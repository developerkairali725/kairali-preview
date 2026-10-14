import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import {
  SITEMAP_CATEGORIES, buildCategorySitemap, categoryForPath, sitemapIndexXml, sitemapXml,
} from '../lib/sitemap.ts';

const SITE = fileURLToPath(new URL('../', import.meta.url));
const read = file => JSON.parse(fs.readFileSync(path.join(SITE, file), 'utf8'));
const nativeRequire = createRequire(import.meta.url);
const ts = nativeRequire('typescript');
const origin = 'https://ayurvedichealingvillage.com';
const manifest = read('english-candidate/route-manifest.json');
const ledger = read('english-candidate/catalogue-route-ledger.json');
const redirects = read('english-candidate/redirect-map.json').redirects;
const localized = read('l10n/routes.json');
const locales = read('l10n/locales.json');
const campaigns = read('campaign-v110/routes.json');
const tree = read('english-candidate/site-tree.json');
const yoga = read('english-candidate/final-rates/yoga.json').groups.flatMap(group => group.programmes.map(row => new URL(row.url).pathname));
const categories = {
  ledger: new Map(ledger.rows.map(row => [row.path, row.sitemapCategory])),
  tree: { ...tree.unlisted, ...tree.index }, campaigns: new Set(campaigns), yoga: new Set(yoga),
};

// Load the real TypeScript route handlers and their real data imports, with
// isolated environment flags. No mocked sitemap, locale, robots or image logic.
function application(flag) {
  const cache = new Map();
  const processForBuild = { ...process, env: { ...process.env, AHV_STAGING: flag } };
  function load(file) {
    file = path.resolve(SITE, file);
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} }; cache.set(file, module);
    const require = specifier => {
      if (!specifier.startsWith('.')) return nativeRequire(specifier);
      const resolved = path.resolve(path.dirname(file), specifier);
      if (resolved.endsWith('.json')) return JSON.parse(fs.readFileSync(resolved, 'utf8'));
      if (resolved.endsWith('.mjs') || resolved.endsWith('.js')) return nativeRequire(resolved);
      for (const suffix of ['', '.ts', '.tsx']) if (fs.existsSync(resolved + suffix) && fs.statSync(resolved + suffix).isFile()) return load(resolved + suffix);
      throw new Error(`Unresolved ${specifier} in ${file}`);
    };
    const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText;
    new Function('require', 'module', 'exports', 'process', source)(require, module, module.exports, processForBuild);
    return module.exports;
  }
  return {
    root: load('app/sitemap.xml/route.ts'), child: load('app/sitemaps/[category]/route.ts'),
    source: load('lib/sitemap-source.ts'), robots: load('app/(english)/_families/robots-policy.ts'),
    l10n: load('app/(english)/_families/l10n.ts'),
  };
}
const production = application('0');
const maps = new Map(SITEMAP_CATEGORIES.map(category => [category, production.source.categorySitemap(category)]));
const entries = [...maps.values()].flat();
const urls = new Set(entries.map(entry => entry.url));

test('the root is a seven-child sitemap index, and all child handlers return XML', async t => {
  assert.deepEqual(SITEMAP_CATEGORIES, ['ayurveda', 'yoga', 'training', 'campaigns', 'knowledge', 'archive', 'site']);
  const response = production.root.GET();
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^application\/xml/);
  assert.equal(response.headers.get('x-robots-tag'), null);
  const xml = await response.text();
  assert.match(xml, /<sitemapindex xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);
  assert.equal((xml.match(/<sitemap>/g) ?? []).length, 7);
  assert.doesNotMatch(xml, /<url>/);
  assert.deepEqual(production.child.generateStaticParams(), SITEMAP_CATEGORIES.map(category => ({ category: `${category}.xml` })));
  for (const category of SITEMAP_CATEGORIES) {
    assert.ok(xml.includes(`<loc>${origin}/sitemaps/${category}.xml</loc>`), category);
    const response = await production.child.GET(new Request(origin), { params: Promise.resolve({ category: `${category}.xml` }) });
    assert.equal(response.status, 200, category);
    assert.match(response.headers.get('content-type'), /^application\/xml/);
    const body = await response.text();
    assert.match(body, /<urlset xmlns=/);
    assert.equal((body.match(/<url>/g) ?? []).length, maps.get(category).length, category);
    assert.ok(maps.get(category).length > 0, category);
  }
  const invalid = await production.child.GET(new Request(origin), { params: Promise.resolve({ category: 'unknown.xml' }) });
  assert.equal(invalid.status, 404);
  t.diagnostic(JSON.stringify({ urls: entries.length, categories: Object.fromEntries([...maps].map(([category, entries]) => [category, entries.length])) }));
});

test('protected, unset and invalid staging flags expose neither page URLs nor childmap URLs', async () => {
  for (const flag of ['1', undefined, '[SENSITIVE]']) {
    const app = application(flag);
    const root = app.root.GET();
    assert.equal(root.headers.get('x-robots-tag'), 'noindex, nofollow');
    assert.doesNotMatch(await root.text(), /<loc>/);
    for (const category of SITEMAP_CATEGORIES) {
      assert.deepEqual(app.source.categorySitemap(category), []);
      const child = await app.child.GET(new Request(origin), { params: Promise.resolve({ category: `${category}.xml` }) });
      assert.equal(child.headers.get('x-robots-tag'), 'noindex, nofollow');
      assert.doesNotMatch(await child.text(), /<loc>|<xhtml:link|<image:image>/);
    }
  }
});

test('every eligible registered or native campaign URL appears in exactly one category', () => {
  const expected = new Set();
  const registered = new Set(manifest.routes.map(route => route.path));
  const routes = [...manifest.routes, ...campaigns.filter(path => !registered.has(path)).map(path => ({ path }))];
  for (const route of routes) {
    if (route.sitemapExclude || redirects[route.path] || manifest.deferred.includes(route.path)
      || !production.robots.routeRobots(route, false).startsWith('index')
      || (route.metadata?.canonical && route.metadata.canonical !== origin + route.path)) continue;
    for (const pathname of [route.path, ...Object.values(localized.routes[route.path] ?? {})]) {
      if (!redirects[pathname] && !localized.redirects[pathname]) expected.add(origin + pathname);
    }
  }
  assert.equal(entries.length, urls.size, 'no duplicate URL across childmaps');
  assert.deepEqual([...urls].sort(), [...expected].sort());
  assert.ok(urls.has(origin + '/ru/'), 'the released Russian homepage is distinct from the deferred legacy English-registry route');
  for (const pathname of yoga) assert.ok(maps.get('yoga').some(entry => entry.url === origin + pathname), pathname);
  for (const pathname of campaigns.filter(path => path.startsWith('/lp/'))) assert.ok(maps.get('campaigns').some(entry => entry.url === origin + pathname), pathname);
  assert.ok(maps.get('site').some(entry => entry.url === origin + '/kairali-air-india-maharaja-club.html'));
});

for (let start = 0; start < 93; start += 25) test(`review ledger placements and active redirect exclusions M${start + 1}–M${Math.min(start + 25, 93)}`, () => {
  assert.equal(ledger.rows.length, 93);
  assert.equal(new Set(ledger.rows.map(row => row.path)).size, 93);
  for (const [offset, row] of ledger.rows.slice(start, start + 25).entries()) {
    assert.equal(row.id, `M${String(start + offset + 1).padStart(3, '0')}`);
    assert.equal(categoryForPath(row.path, categories), row.sitemapCategory);
    const variants = [row.path, ...Object.values(localized.routes[row.path] ?? {})];
    if (redirects[row.path]) for (const variant of variants) assert.ok(!urls.has(origin + variant), row.id + ': ' + variant);
    else if (urls.has(origin + row.path)) assert.ok(maps.get(row.sitemapCategory).some(entry => entry.url === origin + row.path), row.id);
  }
});

test('unresolved ranking and Baoli merges are recorded without deciding a survivor', () => {
  for (const id of ['M009', 'M010', 'M016', 'M017']) {
    const row = ledger.rows.find(row => row.id === id);
    assert.equal(row.disposition, 'conditional-merge', id);
    assert.equal(row.target, undefined, id);
    assert.ok(row.dependency, id);
  }
});

// M005 left the unresolved set on the owner's 7 Oct 2026 survivor ruling ("approved as
// per search data"). The ledger records exactly the survivor the runtime 301 serves.
test('M005 cancer-support ledger row records the owner-approved survivor the runtime 301 serves', () => {
  const row = ledger.rows.find(row => row.id === 'M005');
  assert.equal(row.path, '/revitalizing-and-strengthening-treatment-for-cancer-patients/');
  assert.equal(row.sitemapCategory, 'ayurveda');
  assert.equal(row.disposition, 'redirect-after-preservation');
  assert.equal(row.dependency, undefined);
  assert.equal(row.target, '/revitalizing-and-strengthening/');
  assert.equal(redirects[row.path].to, row.target);
  assert.match(row.survivorRuling, /approved as per search data; M005\/M009\/M010; cb41d2e2d2c48191a3ead4fe5c267451/);
  assert.equal(redirects[row.target], undefined, 'survivor is not itself redirected');
  assert.ok(manifest.routes.some(route => route.path === row.target), 'survivor is a served route');
});

test('all 13 locale canonical URLs retain the same reciprocal alternate cluster and x-default', () => {
  assert.equal(Object.keys(locales).length, 13);
  const byUrl = new Map(entries.map(entry => [entry.url, entry]));
  let clustered = 0;
  for (const entry of entries) {
    if (!entry.alternates) continue;
    clustered++;
    const languages = entry.alternates.languages;
    assert.equal(Object.keys(languages).length, 14, entry.url);
    assert.equal(languages.en, languages['x-default']);
    for (const url of Object.values(languages)) {
      assert.ok(byUrl.has(url), `alternate absent from sitemap: ${url}`);
      assert.deepEqual(byUrl.get(url).alternates, entry.alternates, url);
    }
  }
  assert.ok(clustered > 2000, 'the full existing localized inventory is preserved');
});

test('all intentional thank-you pages and their locale variants remain outside every map', () => {
  let checked = 0;
  for (const route of manifest.routes.filter(route => /thank|thanks/.test(route.path))) {
    for (const pathname of [route.path, ...Object.values(localized.routes[route.path] ?? {})]) {
      checked++;
      assert.ok(!urls.has(origin + pathname), pathname);
    }
  }
  assert.ok(checked >= 78, `checked ${checked} thank-you variants`);
  for (const pathname of ['/search/', '/emailsubscriber/', '/cart/', '/checkout/']) assert.ok(!urls.has(origin + pathname), pathname);
});

test('gallery image extensions remain exact in every localized gallery and serialized XML', () => {
  const galleries = read('english-candidate/galleries-2026.json').routes;
  for (const gallery of galleries) {
    const images = [gallery.hero, ...gallery.chapters.flatMap(chapter => chapter.images)].map(image => origin + image.src);
    const variants = new Set([origin + gallery.path, ...Object.values(localized.routes[gallery.path] ?? {}).map(path => origin + path)]);
    const found = entries.filter(entry => variants.has(entry.url));
    assert.equal(found.length, 13, gallery.path);
    for (const entry of found) {
      assert.deepEqual(entry.images, images, entry.url);
      assert.equal((sitemapXml([entry]).match(/<image:image>/g) ?? []).length, images.length);
    }
  }
});

test('redirect-map changes remove a base page and all alternates without a ledger edit', () => {
  const source = {
    origin, staging: false, routes: [{ path: '/retained/' }], redirects: {}, deferred: [],
    routeRobots: () => 'index, follow', categoryForPath: () => 'site',
    localizedPaths: () => ['/fr/retained/'],
    alternates: () => ({ en: origin + '/retained/', fr: origin + '/fr/retained/', 'x-default': origin + '/retained/' }),
    galleryImageUrls: () => [],
  };
  assert.equal(buildCategorySitemap('site', source).length, 2);
  source.redirects['/retained/'] = { to: '/survivor/' };
  assert.deepEqual(buildCategorySitemap('site', source), []);
  delete source.redirects['/retained/'];
  source.routes[0].metadata = { canonical: origin + '/survivor/' };
  assert.deepEqual(buildCategorySitemap('site', source), []);
});

test('native campaigns added outside the English registry have verified self-canonical source metadata', () => {
  const registered = new Set(manifest.routes.map(route => route.path));
  for (const route of campaigns.filter(route => !registered.has(route))) {
    const directory = path.join(SITE, 'campaign-v110/pages', route);
    const metadata = ['meta.json', 'content.ts', 'page.tsx'].map(name => path.join(directory, name)).find(file => fs.existsSync(file));
    assert.ok(metadata, route);
    const source = fs.readFileSync(metadata, 'utf8');
    const canonical = source.match(/"canonical":\s*"([^"]+)"/)?.[1] ?? source.match(/const CANONICAL\s*=\s*"([^"]+)"/)?.[1];
    assert.equal(canonical, origin + route, route);
  }
});

test('legacy sitemap aliases still target /sitemap.xml and XML values are escaped', () => {
  const config = fs.readFileSync(path.join(SITE, 'next.config.ts'), 'utf8');
  assert.match(config, /LEGACY_SITEMAPS\.map\(\(source\)\s*=>\s*\(\{\s*source,\s*destination:\s*"\/sitemap\.xml",\s*statusCode:\s*301/);
  for (const alias of ['/sitemap_index.xml', '/sitemap.xml.gz', '/wp-sitemap.xml']) assert.ok(config.includes(`"${alias}"`));
  assert.match(sitemapIndexXml('https://example.invalid/?a=1&b=2', false), /a=1&amp;b=2/);
  const xml = sitemapXml([{ url: 'https://example.invalid/?a=1&b="two"', images: ['https://example.invalid/<photo>.jpg'] }]);
  assert.match(xml, /a=1&amp;b=&quot;two&quot;/);
  assert.match(xml, /&lt;photo&gt;/);
});
