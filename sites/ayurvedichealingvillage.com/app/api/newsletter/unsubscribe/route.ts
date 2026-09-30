/** Newsletter unsubscribe / suppression (lib/newsletter.ts).
 *
 * The link token is opaque and authenticated (HMAC over the subscriber's
 * random public id; AHV_NEWSLETTER_LINK_SECRET). GET shows a page with an
 * Unsubscribe button and changes nothing (link scanners are harmless). POST
 * suppresses immediately and idempotently — also as an RFC 8058 one-click
 * request (`List-Unsubscribe=One-Click` body, token in the `u` query value).
 * Suppression survives retries, resends and re-imports: only a fresh signup
 * plus a fresh confirmation lifts it. Fails closed (503, body unread) until
 * configured.
 */
import { isNewsletterLocale, renderPage } from '../../../../lib/newsletter-copy.ts';
import {
  NO_STORE_HEADERS,
  defaultNewsletterDeps,
  htmlResponse,
  newsletterConfigured,
  readBoundedText,
  unsubscribeSubscriber,
  wantsJson,
} from '../../../../lib/newsletter.ts';

export const runtime = 'nodejs';

const localeOf = (value: unknown) => (isNewsletterLocale(value) ? value : 'en');

function notConnected(request: Request, locale: string): Response {
  if (wantsJson(request)) return Response.json({ ok: false, code: 'NEWSLETTER_NOT_CONFIGURED' }, { status: 503, headers: NO_STORE_HEADERS });
  return htmlResponse(renderPage({ locale, heading: 'notConnectedHeading', body: ['notConnectedBody'] }), 503);
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const locale = localeOf(url.searchParams.get('l'));
  if (!newsletterConfigured()) return notConnected(request, locale);
  const token = url.searchParams.get('u') || '';
  if (!/^[0-9a-f]{32}\.[A-Za-z0-9_-]{43}$/.test(token)) {
    return htmlResponse(renderPage({ locale, heading: 'invalidUnsubscribeHeading', body: ['invalidUnsubscribeBody'] }), 400);
  }
  const fields: Record<string, string> = { u: token };
  if (locale !== 'en') fields.l = locale;
  return htmlResponse(renderPage({
    locale,
    heading: 'unsubscribeHeading',
    body: ['unsubscribeBody'],
    form: { action: '/api/newsletter/unsubscribe', fields, button: 'unsubscribeButton' },
  }), 200);
}

export async function POST(request: Request): Promise<Response> {
  const url = new URL(request.url);
  if (!newsletterConfigured()) return notConnected(request, localeOf(url.searchParams.get('l')));
  let token: unknown = url.searchParams.get('u');
  let locale = localeOf(url.searchParams.get('l'));
  const raw = await readBoundedText(request, 1024);
  const type = (request.headers.get('content-type') || '').toLowerCase();
  if (raw !== null && type.startsWith('application/x-www-form-urlencoded')) {
    const form = new URLSearchParams(raw);
    if (!token) token = form.get('u');
    if (form.get('l')) locale = localeOf(form.get('l'));
  } else if (raw !== null && type.startsWith('application/json') && !token) {
    try {
      const body = JSON.parse(raw) as Record<string, unknown>;
      if (body && typeof body === 'object') {
        token = body.u;
        if (body.l !== undefined) locale = localeOf(body.l);
      }
    } catch { /* neutral invalid below */ }
  }

  const result = await unsubscribeSubscriber(token, defaultNewsletterDeps());
  if (wantsJson(request)) {
    if (result === 'unsubscribed') return Response.json({ ok: true, status: 'unsubscribed' }, { status: 200, headers: NO_STORE_HEADERS });
    if (result === 'failed') return Response.json({ ok: false, code: 'UNSUBSCRIBE_FAILED' }, { status: 502, headers: NO_STORE_HEADERS });
    return Response.json({ ok: false, code: 'LINK_INVALID' }, { status: 400, headers: NO_STORE_HEADERS });
  }
  if (result === 'unsubscribed') return htmlResponse(renderPage({ locale, heading: 'unsubscribedHeading', body: ['unsubscribedBody'] }), 200);
  if (result === 'failed') return htmlResponse(renderPage({ locale, heading: 'failedHeading', body: ['failedUnsubscribeBody'] }), 502);
  return htmlResponse(renderPage({ locale, heading: 'invalidUnsubscribeHeading', body: ['invalidUnsubscribeBody'] }), 400);
}
