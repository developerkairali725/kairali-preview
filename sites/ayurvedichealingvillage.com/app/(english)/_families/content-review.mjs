import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import copy from '../../../english-candidate/content-review-copy.json' with { type: 'json' };
const cache = new Map();
const bookingCatalogs = new Map();
export function bookingLabelsFor(locale = 'en') {
  const texts = ['Book Your Stay', 'Book Your Package'];
  if (locale === 'en') return {old: texts[0], new: texts[1]};
  if (!bookingCatalogs.has(locale)) {
    const file = path.join(process.cwd(), 'l10n/generated', locale + '.catalog.json');
    bookingCatalogs.set(locale, fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {});
  }
  const translated = texts.map(text => bookingCatalogs.get(locale)['t_' + crypto.createHash('sha256').update(text).digest('hex').slice(0,20)] || text);
  return {old: translated[0], new: translated[1]};
}

export function reviewCopyFor(route, locale = 'en') {
  if (route === '/villa-raag/') return undefined;
  const edits = copy[route] || [];
  if (locale === 'en') return edits;
  if (!cache.has(locale)) {
    const file = path.join(process.cwd(), 'l10n/generated', locale + '.json');
    const generated = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
    cache.set(locale, generated.data?.['content-review-copy'] || {});
  }
  return cache.get(locale)[route] || [];
}
const decode = s => s.replace(/&(?:amp|lt|gt|quot|apos|nbsp|ndash|mdash|rsquo|lsquo|rdquo|ldquo|#\d+|#x[\da-f]+);/gi, x => {
  const n = x.slice(1,-1); const names = {amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' ',ndash:'–',mdash:'—',rsquo:'’',lsquo:'‘',rdquo:'”',ldquo:'“'};
  return names[n] || (n[0] === '#' ? String.fromCodePoint(n[1].toLowerCase()==='x' ? parseInt(n.slice(2),16) : parseInt(n.slice(1),10)) : x);
});
const norm = s => decode(s).replace(/\s+/g, ' ').trim();
const escape = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
export function applyReviewSnapshot(html, route, locale = 'en') {
  if (!html || route === '/villa-raag/') return html;
  const booking = bookingLabelsFor(locale);
  html = html.replace(/<a\b[^>]*\bhref=["']https:\/\/bookings\.ayurvedichealingvillage\.com\/["'][^>]*>[\s\S]*?<\/a>/gi, anchor => anchor.replace(/[^<>]+/g, token => norm(token) === booking.old ? (token.match(/^\s*/)?.[0] || '') + escape(booking.new) + (token.match(/\s*$/)?.[0] || '') : token));
  const edits = reviewCopyFor(route, locale);
  if (!edits?.length) return html;
  const byKey = new Map(edits.map(e => [e.kind + '\0' + e.old, e.new]));
  html = html.replace(/<span\b[^>]*class=["']ahv-link-context["'][^>]*>([^<]*)<\/span>/gi, (span, text) => {
    const replacement = byKey.get('text'+'\0'+norm(text));
    return replacement == null ? span : span.replace(text, escape(replacement));
  });
  html = html.replace(/aria-label="([^"]*)"/g, (attribute, label) => {
    let next = decode(label);
    for (const edit of edits) if (edit.kind === 'link' && next.includes(edit.old)) next = next.replace(edit.old, edit.new);
    return 'aria-label="' + escape(next).replace(/"/g, '&quot;') + '"';
  });
  const stack=[];
  html = html.replace(/<!--[\s\S]*?-->|<[^>]*>|[^<]+/g, token => {
    if (token.startsWith('<')) {
      const close=token.match(/^<\/([\w-]+)/); const open=token.match(/^<([\w-]+)/);
      if(close) { const i=stack.lastIndexOf(close[1].toLowerCase()); if(i>=0) stack.length=i; }
      else if(open && !/\/$/.test(token.slice(0,-1)) && !/^(?:img|br|hr|input|meta|link|source|area|wbr)$/i.test(open[1])) stack.push(open[1].toLowerCase());
      return token;
    }
    if(stack.some(x=>/^(?:script|style|svg|noscript|form)$/.test(x))) return token;
    const heading=[...stack].reverse().find(x=>/^h[1-6]$/.test(x));
    const kind=heading || (stack.includes('a') ? 'link' : 'text');
    const replacement=byKey.get(kind+'\0'+norm(token));
    return replacement == null ? token : (token.match(/^\s*/)?.[0]||'')+escape(replacement)+(token.match(/\s*$/)?.[0]||'');
  });
  return html.replace(/<a\b[^>]*data-recorded-embed[^>]*>[\s\S]*?<\/a>/gi, anchor => {
    const text = norm(anchor.replace(/<svg\b[\s\S]*?<\/svg>/gi, '').replace(/<[^>]*>/g, ''));
    if (!text) return anchor;
    return anchor.replace(/aria-label="[^"]*"/, 'aria-label="' + escape(text).replace(/"/g, '&quot;') + '"');
  });
}
