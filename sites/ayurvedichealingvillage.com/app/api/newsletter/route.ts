/** Separate newsletter contract — deliberately NOT an enquiry/CRM lead.
 *
 * Approved double opt-in (lib/newsletter.ts): the address is stored as PENDING
 * in the dedicated newsletter tables (never the patient lead tables) together
 * with a durable, recoverable confirmation-mail job, the confirmation email is
 * sent, and `pending_confirmation` is answered only once the provider has
 * accepted it (uncertain and refused sends are reported as such). Nobody is
 * subscribed until they open the emailed link and press Confirm.
 *
 * FAILS CLOSED in every environment until the relay, the mail provider, the
 * public origin and the link secret are all configured: the 503 below is
 * answered before the body is read, logged, stored or forwarded. Changing
 * AHV_STAGING alone never activates the newsletter.
 *
 * The response never says whether an address is already pending, confirmed or
 * unsubscribed. Nothing here logs, and no email, token or secret is written to
 * a log, a URL or client storage.
 */
import {
  NO_STORE_HEADERS,
  clientIp,
  defaultNewsletterDeps,
  newsletterConfigured,
  readBoundedText,
  requestSubscription,
  validateSubscription,
} from '../../../lib/newsletter.ts';

export const runtime = 'nodejs';

export async function POST(request: Request): Promise<Response> {
  const headers = NO_STORE_HEADERS;
  if (!newsletterConfigured()) {
    if ((request.headers.get('accept') || '').includes('text/html')) {
      return new Response(
        '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Newsletter signup | Kairali</title><main><h1>Newsletter signup is not connected yet</h1><p>Nothing has been saved or sent. Please try again later.</p><p><a href="/">Return to Kairali</a></p></main></html>',
        { status: 503, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } },
      );
    }
    return Response.json({ ok: false, code: 'NEWSLETTER_NOT_CONFIGURED' }, { status: 503, headers });
  }

  if (!(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) {
    return Response.json({ ok: false, code: 'INVALID_REQUEST' }, { status: 415, headers });
  }
  const raw = await readBoundedText(request);
  if (raw === null) return Response.json({ ok: false, code: 'INVALID_REQUEST' }, { status: 413, headers });
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { return Response.json({ ok: false, code: 'INVALID_REQUEST' }, { status: 400, headers }); }
  const valid = validateSubscription(parsed);
  if (!valid.ok) return Response.json({ ok: false, code: valid.code }, { status: 400, headers });

  const result = await requestSubscription(valid.value, clientIp(request.headers), defaultNewsletterDeps());
  if (result === 'pending_confirmation') {
    return Response.json({ ok: true, status: 'pending_confirmation' }, { status: 200, headers });
  }
  if (result === 'rate_limited') {
    return Response.json({ ok: false, code: 'RATE_LIMITED' }, { status: 429, headers: { ...headers, 'Retry-After': '3600' } });
  }
  if (result === 'mail_failed') {
    return Response.json({ ok: false, code: 'CONFIRMATION_MAIL_FAILED', error: 'We could not send the confirmation email. You are not subscribed yet. Please try again.' }, { status: 502, headers });
  }
  if (result === 'mail_uncertain') {
    // The email may or may not have left (timeout / unverifiable reply). Never "check your email" on a guess.
    return Response.json({ ok: false, code: 'CONFIRMATION_MAIL_UNCERTAIN', error: 'We could not confirm that the confirmation email was sent. If it does not arrive within a few minutes, please try again.' }, { status: 502, headers });
  }
  return Response.json({ ok: false, code: 'STORE_FAILED', error: 'We could not confirm your signup. You are not subscribed yet. Please try again.' }, { status: 502, headers });
}
