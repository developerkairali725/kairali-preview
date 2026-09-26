/** Separate newsletter contract — deliberately NOT an enquiry/CRM lead.
 * Destination is our own MySQL `newsletter` table (team manages subscribers
 * from it directly); no email-marketing platform integration.
 * Fail closed in every environment: while the database is not configured,
 * never read, log, store or forward the body. Changing AHV_STAGING alone
 * must never activate an unconfigured newsletter.
 */
import { databaseConfigured } from '../../../lib/db.ts';
import { saveNewsletterSignup } from '../../../lib/newsletter-store.ts';

export const runtime = 'nodejs';

const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' };

const UNAVAILABLE_HTML =
  '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Newsletter signup | Kairali</title><main><h1>Newsletter signup is not connected yet</h1><p>Nothing has been saved or sent. Please try again later.</p><p><a href="/">Return to Kairali</a></p></main></html>';

function unavailable(request: Request): Response {
  if ((request.headers.get('accept') || '').includes('text/html')) {
    return new Response(UNAVAILABLE_HTML, { status: 503, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } });
  }
  return Response.json({ ok: false, code: 'NEWSLETTER_NOT_CONFIGURED' }, { status: 503, headers });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** A v4-shaped id from the browser, same shape used across the fleet's forms. */
function validToken(value: unknown): string | null {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? value.toLowerCase()
    : null;
}
const text = (v: unknown, limit: number) => (typeof v === 'string' ? v.trim().slice(0, limit) : '');

export async function POST(request: Request): Promise<Response> {
  // Config check happens BEFORE the body is ever read — an unconfigured
  // deployment must never inspect, let alone store, what a visitor typed.
  if (!databaseConfigured()) return unavailable(request);

  if (!(request.headers.get('content-type') || '').includes('application/json')) return unavailable(request);

  let parsed: unknown;
  try { parsed = await request.json(); } catch { return unavailable(request); }
  const body = (parsed && typeof parsed === 'object' ? parsed : {}) as Record<string, unknown>;

  const email = text(body.email, 190);
  if (!EMAIL_RE.test(email)) return Response.json({ ok: false, code: 'INVALID_EMAIL' }, { status: 400, headers });
  if (body.consent !== true) return Response.json({ ok: false, code: 'CONSENT_REQUIRED' }, { status: 400, headers });

  // Without a submission token the same tap cannot be recognised on a retry,
  // so a double click would risk a second row. Refuse rather than risk that.
  const submissionToken = validToken(body.submissionToken);
  if (!submissionToken) return Response.json({ ok: false, code: 'INVALID_SUBMISSION' }, { status: 400, headers });

  const submitIp = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim().slice(0, 45);

  try {
    await saveNewsletterSignup(
      {
        site: 'ayurvedichealingvillage.com',
        email,
        consent: true,
        consentVersion: text(body.consentVersion, 50),
        sourcePath: text(body.sourcePath, 500),
        utmSource: text(body.utm_source, 190),
        utmMedium: text(body.utm_medium, 190),
        utmCampaign: text(body.utm_campaign, 190),
        utmContent: text(body.utm_content, 190),
        leadSourceUrl: text(body.lead_source_url, 500),
        referrer: text(body.referrer, 500),
        submitIp,
      },
      submissionToken,
    );
  } catch {
    // No driver error, no submitted text, ever surfaces to the browser or a log.
    return Response.json(
      { ok: false, code: 'STORE_FAILED', error: 'We could not confirm your signup. Please try again, or email info@kairali.com.' },
      { status: 502, headers },
    );
  }

  return Response.json({ ok: true, status: 'subscribed' }, { status: 200, headers });
}
