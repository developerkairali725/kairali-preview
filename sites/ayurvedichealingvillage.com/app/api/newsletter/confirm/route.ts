/** Newsletter double opt-in — confirmation (lib/newsletter.ts).
 *
 * Scanner-safe: GET only shows a page with a Confirm button and contacts
 * nothing, so a mail scanner or link preview that fetches the emailed link
 * cannot subscribe anyone. The explicit POST from that page consumes the
 * single-use token atomically; consent evidence and the confirmation time are
 * recorded only then. Expired, used, revoked and tampered tokens all get the
 * same neutral page. Fails closed (503, body unread) until configured.
 */
import { isNewsletterLocale, renderPage } from '../../../../lib/newsletter-copy.ts';
import {
  NO_STORE_HEADERS,
  confirmSubscription,
  defaultNewsletterDeps,
  htmlResponse,
  isTokenShape,
  newsletterConfigured,
  readBoundedText,
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
  const token = url.searchParams.get('t');
  if (!isTokenShape(token)) {
    return htmlResponse(renderPage({ locale, heading: 'invalidConfirmHeading', body: ['invalidConfirmBody'] }), 400);
  }
  const fields: Record<string, string> = { t: token };
  if (locale !== 'en') fields.l = locale;
  return htmlResponse(renderPage({
    locale,
    heading: 'confirmHeading',
    body: ['confirmBody'],
    form: { action: '/api/newsletter/confirm', fields, button: 'confirmButton' },
  }), 200);
}

async function readTokenAndLocale(request: Request): Promise<{ token: unknown; locale: string } | null> {
  const raw = await readBoundedText(request, 1024);
  if (raw === null) return null;
  const type = (request.headers.get('content-type') || '').toLowerCase();
  if (type.startsWith('application/json')) {
    try {
      const body = JSON.parse(raw) as Record<string, unknown>;
      return body && typeof body === 'object' ? { token: body.t, locale: localeOf(body.l) } : null;
    } catch {
      return null;
    }
  }
  if (type.startsWith('application/x-www-form-urlencoded')) {
    const form = new URLSearchParams(raw);
    return { token: form.get('t'), locale: localeOf(form.get('l')) };
  }
  return null;
}

export async function POST(request: Request): Promise<Response> {
  if (!newsletterConfigured()) return notConnected(request, 'en');
  const input = await readTokenAndLocale(request);
  const json = wantsJson(request);
  const locale = input ? input.locale : 'en';
  const result = input ? await confirmSubscription(input.token, locale, defaultNewsletterDeps()) : { kind: 'invalid' as const };

  if (json) {
    if (result.kind === 'confirmed') return Response.json({ ok: true, status: 'confirmed' }, { status: 200, headers: NO_STORE_HEADERS });
    if (result.kind === 'failed') return Response.json({ ok: false, code: 'CONFIRM_FAILED' }, { status: 502, headers: NO_STORE_HEADERS });
    return Response.json({ ok: false, code: 'LINK_INVALID' }, { status: 400, headers: NO_STORE_HEADERS });
  }
  if (result.kind === 'confirmed') {
    return htmlResponse(renderPage({
      locale,
      heading: 'confirmedHeading',
      body: ['confirmedBody'],
      link: { lead: 'unsubscribeHint', href: result.unsubscribeUrl, text: 'unsubscribeButton' },
    }), 200);
  }
  if (result.kind === 'failed') {
    return htmlResponse(renderPage({ locale, heading: 'failedHeading', body: ['failedConfirmBody'] }), 502);
  }
  return htmlResponse(renderPage({ locale, heading: 'invalidConfirmHeading', body: ['invalidConfirmBody'] }), 400);
}

