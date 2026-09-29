import fs from 'node:fs';
import path from 'node:path';
import LOCALES from '../l10n/locales.json' with { type: 'json' };

/**
 * Visitor-facing copy for the newsletter double opt-in: the confirmation
 * email and the confirm / unsubscribe / result pages.
 *
 * English is the source. Every string below is also listed in
 * l10n/source/ui-strings.json, so the site's localization pipeline extracts it
 * and tools/l10n/build.mjs compiles accepted translations into
 * l10n/generated/<locale>.json (`ui` map). Lookup happens here at request time
 * from that generated file; a string without an accepted translation stays
 * English — nothing is machine-translated at runtime.
 *
 * KTAHV clinical register applies (CLAUDE.md language lock).
 */
export const NEWSLETTER_COPY = {
  pageTitle: 'Kairali newsletter',
  returnLink: 'Return to Kairali',
  notConnectedHeading: 'Newsletter signup is not connected yet',
  notConnectedBody: 'Nothing has been saved or sent. Please try again later.',
  confirmHeading: 'Confirm your newsletter subscription',
  confirmBody: 'Press the button below to confirm that you want to receive Kairali news and programme updates at this email address.',
  confirmButton: 'Confirm subscription',
  confirmedHeading: 'Your subscription is confirmed',
  confirmedBody: 'Thank you. You will receive Kairali news and programme updates by email.',
  unsubscribeHint: 'You can unsubscribe at any time with this link:',
  invalidConfirmHeading: 'This confirmation link is no longer valid',
  invalidConfirmBody: 'It may have expired or already been used. If you have already confirmed, there is nothing more to do. Otherwise, please sign up again with the newsletter form on any page.',
  unsubscribeHeading: 'Unsubscribe from the Kairali newsletter',
  unsubscribeBody: 'Press the button below to stop receiving Kairali news and programme updates at this email address.',
  unsubscribeButton: 'Unsubscribe',
  unsubscribedHeading: 'You are unsubscribed',
  unsubscribedBody: 'You will not receive the newsletter at this address any more. If you change your mind, you can sign up again and confirm your email address.',
  invalidUnsubscribeHeading: 'This unsubscribe link is not valid',
  invalidUnsubscribeBody: 'Please use the link from your most recent newsletter email, or write to info@kairali.com.',
  failedHeading: 'We could not complete this just now',
  failedConfirmBody: 'Nothing has changed. Please open the link from your email again in a few minutes.',
  failedUnsubscribeBody: 'Nothing has changed yet. Please try again in a few minutes, or write to info@kairali.com.',
  mailSubject: 'Please confirm your Kairali newsletter subscription',
  mailGreeting: 'Hello,',
  mailIntro: 'We received a request to send Kairali news and programme updates to this email address.',
  mailAction: 'To confirm your subscription, open this link and press "Confirm subscription":',
  mailExpiry: 'The link expires in 48 hours.',
  mailIgnore: 'If you did not ask for this, you can ignore this email. You will not be subscribed.',
  mailSignoff: 'Kairali – The Ayurvedic Healing Village',
  mailReference: 'Reference:',
} as const;

export type CopyKey = keyof typeof NEWSLETTER_COPY;

type LocaleRow = { prefix: string; htmlLang: string; dir: string };
const TABLE = LOCALES as unknown as Record<string, LocaleRow>;
export const NEWSLETTER_LOCALES = Object.keys(TABLE);

export function isNewsletterLocale(value: unknown): value is string {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(TABLE, value);
}

/** Locale of a same-site path from its first segment (/de/…, /zh/… → zh-Hans); English otherwise. */
export function localeFromPath(sourcePath: string): string {
  const first = sourcePath.split('/')[1] ?? '';
  if (!first) return 'en';
  for (const [code, row] of Object.entries(TABLE)) if (row.prefix && row.prefix === first) return code;
  return 'en';
}

const dictionaries = new Map<string, Record<string, string>>();
function dictionary(locale: string): Record<string, string> {
  if (!dictionaries.has(locale)) {
    let ui: Record<string, string> = {};
    try {
      const file = path.join(process.cwd(), 'l10n', 'generated', `${locale}.json`);
      const parsed = JSON.parse(fs.readFileSync(file, 'utf8')) as { ui?: Record<string, string> };
      if (parsed && parsed.ui && typeof parsed.ui === 'object') ui = parsed.ui;
    } catch {
      // No generated dictionary (e.g. before the l10n build): English source, never a guess.
    }
    dictionaries.set(locale, ui);
  }
  return dictionaries.get(locale)!;
}

export function copy(locale: string, key: CopyKey): string {
  const english = NEWSLETTER_COPY[key];
  if (locale === 'en' || !isNewsletterLocale(locale)) return english;
  const hit = dictionary(locale)[english.replace(/\s+/g, ' ').trim()];
  return typeof hit === 'string' && hit.trim() ? hit : english;
}

export function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export type PageSpec = {
  locale: string;
  heading: CopyKey;
  body: CopyKey[];
  form?: { action: string; fields: Record<string, string>; button: CopyKey };
  link?: { lead: CopyKey; href: string; text: CopyKey };
};

/** Minimal self-contained page: no scripts, no external assets, no analytics. */
export function renderPage(spec: PageSpec): string {
  const locale = isNewsletterLocale(spec.locale) ? spec.locale : 'en';
  const row = TABLE[locale];
  const t = (key: CopyKey) => escapeHtml(copy(locale, key));
  const home = row.prefix ? `/${row.prefix}/` : '/';
  const parts = [
    '<!doctype html>',
    `<html lang="${escapeHtml(row.htmlLang)}" dir="${row.dir === 'rtl' ? 'rtl' : 'ltr'}">`,
    '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="referrer" content="no-referrer">',
    `<title>${t('pageTitle')}</title>`,
    // Colours are the brand manual's tokens (packages/ui/brand-tokens.css: --ivory, --ink, --forest-500/-700).
    '<style>body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.6;color:#1C1B19;background:#F7F4EA;margin:0}main{max-width:36rem;margin:12vh auto;padding:0 1.25rem}h1{font-size:1.6rem;line-height:1.25;margin:0 0 1rem}button{font:inherit;padding:.7rem 1.4rem;border:0;border-radius:.4rem;background:#006038;color:#fff;cursor:pointer}button:hover{background:#004226}button:focus-visible,a:focus-visible{outline:3px solid #004226;outline-offset:2px}a{color:#006038}</style>',
    '</head><body><main>',
    `<h1>${t(spec.heading)}</h1>`,
    ...spec.body.map((key) => `<p>${t(key)}</p>`),
  ];
  if (spec.form) {
    parts.push(`<form method="post" action="${escapeHtml(spec.form.action)}">`);
    for (const [name, value] of Object.entries(spec.form.fields)) {
      parts.push(`<input type="hidden" name="${escapeHtml(name)}" value="${escapeHtml(value)}">`);
    }
    parts.push(`<button type="submit">${t(spec.form.button)}</button></form>`);
  }
  if (spec.link) parts.push(`<p>${t(spec.link.lead)} <a href="${escapeHtml(spec.link.href)}" rel="nofollow">${t(spec.link.text)}</a></p>`);
  parts.push(`<p><a href="${home}">${t('returnLink')}</a></p>`, '</main></body></html>');
  return parts.join('\n');
}

/**
 * Confirmation email (plain text + equivalent HTML). Variable parts: the link, and the job reference
 * (the idempotency key — lets the sender reconcile an uncertain send against its Sent mail).
 */
export function confirmationMail(locale: string, confirmUrl: string, reference: string): { subject: string; text: string; html: string } {
  const loc = isNewsletterLocale(locale) ? locale : 'en';
  const t = (key: CopyKey) => copy(loc, key);
  const text = [
    t('mailGreeting'), '',
    t('mailIntro'), '',
    t('mailAction'), confirmUrl, '',
    t('mailExpiry'), t('mailIgnore'), '',
    t('mailSignoff'), 'info@kairali.com', '',
    `${t('mailReference')} ${reference}`,
  ].join('\n');
  const e = (key: CopyKey) => escapeHtml(t(key));
  const row = TABLE[loc];
  const html = [
    `<!doctype html><html lang="${escapeHtml(row.htmlLang)}" dir="${row.dir === 'rtl' ? 'rtl' : 'ltr'}"><body>`,
    `<p>${e('mailGreeting')}</p>`,
    `<p>${e('mailIntro')}</p>`,
    `<p>${e('mailAction')}<br><a href="${escapeHtml(confirmUrl)}">${escapeHtml(confirmUrl)}</a></p>`,
    `<p>${e('mailExpiry')} ${e('mailIgnore')}</p>`,
    `<p>${e('mailSignoff')}<br>info@kairali.com</p>`,
    `<p style="color:#666;font-size:12px">${e('mailReference')} ${escapeHtml(reference)}</p>`,
    '</body></html>',
  ].join('\n');
  return { subject: t('mailSubject'), text, html };
}
