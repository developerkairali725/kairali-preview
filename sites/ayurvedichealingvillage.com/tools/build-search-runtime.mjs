import fs from 'node:fs';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';

// The shared /search/ function serves every query language. Keep its data
// outside the per-page locale directories narrowed by the release packager.
const locales = JSON.parse(fs.readFileSync('l10n/locales.json', 'utf8'));
fs.mkdirSync('search-runtime', { recursive: true });
for (const [locale, { prefix }] of Object.entries(locales)) {
  const base = prefix ? `public/ahv/l10n/${prefix}` : 'public';
  const script = fs.readFileSync(path.join(base, 'design/search.js'), 'utf8');
  const index = JSON.parse(fs.readFileSync(prefix ? `${base}/search-index.json` : 'public/ahv/search-index.json', 'utf8'));
  const catalog = prefix ? JSON.parse(fs.readFileSync(`l10n/generated/${locale}.catalog.json`, 'utf8')) : {};
  const chrome = prefix ? gunzipSync(fs.readFileSync(`l10n/prerender/${locale}/about-us.html.gz`)).toString('utf8') : '';
  fs.writeFileSync(`search-runtime/${locale}.json`, JSON.stringify({ script, index, catalog, chrome }));
}
console.log(`Prepared server search data for ${Object.keys(locales).length} languages.`);
