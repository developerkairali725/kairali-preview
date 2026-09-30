/** Newsletter confirmation-mail OUTBOX worker (lib/newsletter.ts processOutbox).
 *
 * Invoked by a scheduled job (Vercel Cron sends GET with
 * `Authorization: Bearer <CRON_SECRET>`). It claims confirmation jobs whose
 * inline send never reported (crash, lost reply) or ended uncertain, and
 * re-sends the SAME link under the SAME idempotency key; each job is leased by
 * the relay so two workers, or a worker and an inline send, never both send it.
 *
 * Fails closed: 503 until the newsletter is configured and CRON_SECRET is set;
 * 401 on a wrong bearer, before the relay is contacted. The answer carries
 * counts only — never an address or token. Nothing here logs.
 */
import { NO_STORE_HEADERS, cronAuthorized, defaultNewsletterDeps, newsletterConfigured, processOutbox } from '../../../../lib/newsletter.ts';

export const runtime = 'nodejs';

export async function GET(request: Request): Promise<Response> {
  if (!newsletterConfigured() || (process.env.CRON_SECRET ?? '').length < 32) {
    return Response.json({ ok: false, code: 'NEWSLETTER_NOT_CONFIGURED' }, { status: 503, headers: NO_STORE_HEADERS });
  }
  if (!cronAuthorized(request.headers)) {
    return Response.json({ ok: false, code: 'UNAUTHORIZED' }, { status: 401, headers: NO_STORE_HEADERS });
  }
  try {
    const report = await processOutbox(defaultNewsletterDeps());
    return Response.json({ ok: true, ...report }, { status: 200, headers: NO_STORE_HEADERS });
  } catch {
    return Response.json({ ok: false, code: 'OUTBOX_FAILED' }, { status: 502, headers: NO_STORE_HEADERS });
  }
}
