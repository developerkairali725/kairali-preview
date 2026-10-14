import fs from 'node:fs';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import crypto from 'node:crypto';
import ts from 'typescript';

// Only carry strings this search view can render, not the full site catalogue.
const labels = new Set();
for (const file of ['view.tsx', 'search-language.ts']) {
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.Standard, fs.readFileSync(`app/(english)/search/${file}`, 'utf8'));
  for (let token = scanner.scan(); token !== ts.SyntaxKind.EndOfFileToken; token = scanner.scan()) {
    if (token === ts.SyntaxKind.StringLiteral) labels.add(scanner.getTokenValue());
  }
}
const englishChrome = fs.readFileSync('english-candidate/prerender/about-us.html', 'utf8');
for (const match of englishChrome.matchAll(/>([^<>]+)<|aria-label="([^"]*)"/g)) labels.add((match[1] || match[2]).replace(/&amp;/g, '&').trim());
function collect(value, into) {
  if (typeof value === 'string') into.add(value);
  else if (value && typeof value === 'object') Object.values(value).forEach(item => collect(item, into));
}
function textKey(text) {
  const normalized = text.replace(/[\s ]+/g, m => m.includes(' ') && !/[\t\n\r ]/.test(m) ? ' ' : ' ').trim();
  return 't_' + crypto.createHash('sha256').update(normalized, 'utf8').digest('hex').slice(0, 20);
}

// The shared /search/ function serves every query language. Keep its data
// outside the per-page locale directories narrowed by the release packager.
const locales = JSON.parse(fs.readFileSync('l10n/locales.json', 'utf8'));
fs.mkdirSync('search-runtime', { recursive: true });
for (const [locale, { prefix }] of Object.entries(locales)) {
  const base = prefix ? `public/ahv/l10n/${prefix}` : 'public';
  const script = fs.readFileSync(path.join(base, 'design/search.js'), 'utf8');
  const index = JSON.parse(fs.readFileSync(prefix ? `${base}/search-index.json` : 'public/ahv/search-index.json', 'utf8'));
  const fullCatalog = prefix ? JSON.parse(fs.readFileSync(`l10n/generated/${locale}.catalog.json`, 'utf8')) : {};
  const needed = new Set(labels);
  collect(index, needed);
  const keys = new Set([...needed].map(textKey));
  const catalog = Object.fromEntries(Object.entries(fullCatalog).filter(([key]) => keys.has(key)));
  const chrome = prefix ? gunzipSync(fs.readFileSync(`l10n/prerender/${locale}/about-us.html.gz`)).toString('utf8') : '';
  fs.writeFileSync(`search-runtime/${locale}.json`, JSON.stringify({ script, index, catalog, chrome }));
}
console.log(`Prepared server search data for ${Object.keys(locales).length} languages.`);
