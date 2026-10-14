import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

// Validate deployment artifacts: a local checkout can mask missing packaged files.
const site = process.cwd();
const locales = JSON.parse(fs.readFileSync('l10n/locales.json', 'utf8'));
const dist = process.env.LP_DIST_DIR || '.next';
const tracePath = path.resolve(site, dist, 'server/app/(english)/search/page.js.nft.json');
const trace = JSON.parse(fs.readFileSync(tracePath, 'utf8'));
const shipped = new Set(trace.files.map(file => path.resolve(path.dirname(tracePath), file)));
const packageArg = process.argv.indexOf('--package');
const mapping = packageArg < 0 ? null : JSON.parse(fs.readFileSync(process.argv[packageArg + 1], 'utf8')).filePathMap;
for (const locale of Object.keys(locales)) {
  const relative = `search-runtime/${locale}.json`;
  if (!shipped.has(path.resolve(site, relative))) throw new Error(`Search deployment omits ${locale}: ${relative}`);
  if (mapping && !Object.keys(mapping).some(key => key.endsWith(`/ayurvedichealingvillage.com/${relative}`))) {
    throw new Error(`Packaged search function omits ${locale}: ${relative}`);
  }
  const { script, index, catalog, chrome } = JSON.parse(fs.readFileSync(relative, 'utf8'));
  if (locale !== 'en' && (!Object.keys(catalog).length || !chrome)) throw new Error(`Missing search translations/chrome: ${locale}`);
  const ctx = vm.createContext({});
  vm.runInContext(script, ctx);
  const engine = ctx.AHVSearch.createEngine(index);
  for (const query of ['ayurveda', '{search_term_string}', '', '<script>alert(1)</script>']) {
    const result = engine.query(query, { scope: 'site', limit: 1000 });
    if (!Number.isFinite(result.total)) throw new Error(`Invalid search result for ${locale}`);
  }
}
console.log(`Search ${mapping ? 'package' : 'trace'} and queries verified for ${Object.keys(locales).length} languages.`);
