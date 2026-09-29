/** Store-first capture for contact, enquiry-form, apply-now, opd,
 * online-consultation and the landing-page forms into the scoped AHV MySQL
 * tables, then a mirror of the stored row to the team's Sheet.
 *
 * Deliberately separate from `/api/enquiry` (the frozen v1 CRM/Supabase path,
 * staging-gated), which this route does not touch.
 *
 * Transport: the database endpoint has no TLS, so this route never connects to
 * MySQL. It calls the HMAC-signed HTTPS relay on the database host
 * (lib/form-relay.ts, bridge/form-relay/). There is no direct-database or
 * plain-HTTP fallback.
 *
 * FAILS CLOSED until real configuration is present: with the relay or the
 * Sheet webhook unset/unsafe it answers a truthful 503 ("nothing has been
 * saved") BEFORE the request body is read — never a fake success.
 */
import { relayConfigured } from '../../../lib/form-relay.ts';
import { LEAD_TABLES, LeadRateLimitError, saveLead, type LeadTable } from '../../../lib/lead-store.ts';
import { deliverLeadToSheet, leadSheetConfigured } from '../../../lib/lead-sheet-bridge.ts';
import { validationProblem } from '../../../lib/lead-validation.ts';
import { guideDownloadUrl } from '../../../lib/guide-download.ts';

export const runtime = 'nodejs';
const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' };
const NOT_CONNECTED = 'This form is not connected yet. Nothing has been saved or sent. Please email info@kairali.com.';

const text = (v: unknown, limit: number) => (typeof v === 'string' ? v.trim().slice(0, limit) : '');
function validToken(value: unknown): string | null {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? value.toLowerCase()
    : null;
}

export async function POST(request: Request): Promise<Response> {
  // Config check before the body is ever read — an unconfigured deployment
  // must never inspect, let alone store, what a visitor typed.
  if (!relayConfigured()) {
    return Response.json({ ok: false, code: 'LEAD_STORE_NOT_CONFIGURED', error: NOT_CONNECTED }, { status: 503, headers });
  }
  if (!leadSheetConfigured()) {
    return Response.json({ ok: false, code: 'LEAD_SHEET_NOT_CONFIGURED', error: NOT_CONNECTED }, { status: 503, headers });
  }
  if (!(request.headers.get('content-type') || '').includes('application/json')) {
    return Response.json({ ok: false, code: 'INVALID_REQUEST' }, { status: 415, headers });
  }
  let parsed: unknown;
  try { parsed = await request.json(); } catch { return Response.json({ ok: false, code: 'INVALID_REQUEST' }, { status: 400, headers }); }
  const body = (parsed && typeof parsed === 'object' ? parsed : {}) as Record<string, unknown>;

  const table = text(body.form, 40) as LeadTable;
  if (!LEAD_TABLES.includes(table)) return Response.json({ ok: false, code: 'UNKNOWN_FORM' }, { status: 400, headers });

  const submissionToken = validToken(body.submissionToken);
  if (!submissionToken) return Response.json({ ok: false, code: 'INVALID_SUBMISSION' }, { status: 400, headers });

  const fields = (body.fields && typeof body.fields === 'object' ? body.fields : {}) as Record<string, unknown>;
  const values: Record<string, string | number | boolean | null> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined || v === null) continue;
    if (typeof v === 'boolean') { values[k] = v; continue; }
    if (typeof v === 'number') { if (Number.isFinite(v)) values[k] = v; continue; }
    if (Array.isArray(v)) {
      values[k] = v.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean).join(', ').slice(0, 500);
      continue;
    }
    values[k] = text(v, k === 'message' || k === 'symptoms' || k === 'address' || k === 'cover_letter' || k === 'highest_qualification' ? 4000 : 500);
  }
  const invalid = validationProblem(table, values);
  if (invalid) return Response.json({ ok: false, code: invalid }, { status: 400, headers });

  const submitIp = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim().slice(0, 45);
  const tracking = {
    source: text(body.source, 190), campaign: text(body.campaign, 190), medium: text(body.medium, 190),
    gclid: text(body.gclid, 255), fbclid: text(body.fbclid, 255),
    utmSource: text(body.utm_source, 190), utmMedium: text(body.utm_medium, 190),
    utmCampaign: text(body.utm_campaign, 190), utmTerm: text(body.utm_term, 190), utmContent: text(body.utm_content, 190),
    leadSourceUrl: text(body.lead_source_url, 500), referrer: text(body.referrer, 500),
  };

  try {
    const stored = await saveLead(table, {
      site: 'ayurvedichealingvillage.com',
      formType: table,
      values,
      submitIp,
      tracking,
    }, submissionToken);
    try {
      await deliverLeadToSheet(table, stored.row, submissionToken);
    } catch {
      // The database row is intentionally retained. A retry with the same
      // browser token reads that row back and safely retries only the Sheet.
      return Response.json({ ok: false, code: 'SHEET_SYNC_FAILED', error: 'Your details were saved, but final confirmation failed. Please retry once.' }, { status: 502, headers });
    }
  } catch (error) {
    if (error instanceof LeadRateLimitError) {
      return Response.json({ ok: false, code: 'RATE_LIMITED', error: 'Please wait before trying again.' }, { status: 429, headers });
    }
    // No relay/driver error, no submitted text, ever surfaces to the browser or a log.
    return Response.json({ ok: false, code: 'STORE_FAILED', error: 'We could not confirm your submission. Please try again, or email info@kairali.com.' }, { status: 502, headers });
  }

  return Response.json({
    ok: true,
    status: 'received',
    guideUrl: guideDownloadUrl(body.site_language),
  }, { status: 200, headers });
}
