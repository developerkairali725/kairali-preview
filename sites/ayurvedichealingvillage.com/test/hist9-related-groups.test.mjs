import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { applyReviewSnapshot, reviewCopyFor } from '../app/(english)/_families/content-review.mjs';
import routes from '../l10n/routes.json' with { type: 'json' };

// M084.02 / M085.02: the historical-record related links are grouped by destination. Locale builds rewrite
// each href to the locale's own path (and sometimes a translated slug), which used to drop links into the
// fallback "Products & publications" group (/ja/karma-being-retreat/ live: 2 groups; de: 1).
const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(SITE, p), 'utf8');
const A = 'https://ayurvedichealingvillage.com';
const ROUTES = ['/karma-being-retreat/', '/katha-wellness-retreat-2019/'];
const LOCALES = Object.keys(routes.routes['/karma-being-retreat/']).filter((l) => l !== 'en');

function runtime(localPaths) {
  const window = { AHV_COLLECTION_RENDER: { sourceBlocks: () => null } };
  if (localPaths) window.AHV_LOCAL_PATHS = localPaths;
  const ctx = vm.createContext({ window, URL, URLSearchParams, location: { search: '' }, React: { createElement: () => ({}) } });
  vm.runInContext(read('public/ahv/assets/hist9-family-data.js'), ctx);
  vm.runInContext(read('public/ahv/assets/hist9-family-render.js'), ctx);
  return window;
}
// JSON round-trip: values built inside the vm realm do not deep-equal host-realm literals.
const groupsOf = (w, R) => JSON.parse(JSON.stringify(w.AHV_HIST9_RENDER.histVals(R, {}).relatedGroups
  .map((g) => ({ label: g.label, paths: g.links.map((l) => new URL(l.url).pathname) }))));
const localPathsFor = (loc) => Object.fromEntries(Object.entries(routes.routes).map(([en, r]) => [en, r[loc]]).filter(([, p]) => p));
const localize = (R, loc) => ({ ...R, relatedLinks: R.relatedLinks.map((l) => {
  const p = new URL(l.href, A).pathname; const t = routes.routes[p] && routes.routes[p][loc];
  return { ...l, href: t ? A + t : l.href };
}) });

test('English related links keep their accepted destination groups', () => {
  const w = runtime(null);
  const kb = groupsOf(w, w.AHV_HIST9_FAMILY.routes.find((r) => r.path === '/karma-being-retreat/'));
  assert.deepEqual(kb.map((g) => g.label), ['Ayurveda & yoga knowledge', 'Food & cooking at Kairali', 'Products & publications']);
  assert.deepEqual(kb[1].paths, ['/ayurvedic-resturant-and-cooking-at-healing-village/']);
  const katha = groupsOf(w, w.AHV_HIST9_FAMILY.routes.find((r) => r.path === '/katha-wellness-retreat-2019/'));
  assert.deepEqual(katha.map((g) => g.label), ['Kairali Group & education', 'Products & publications', 'About Kairali']);
});

test('every locale groups localized hrefs exactly as English does', () => {
  const en = runtime(null);
  for (const route of ROUTES) {
    const R = en.AHV_HIST9_FAMILY.routes.find((r) => r.path === route);
    const want = groupsOf(en, R).map((g) => ({ label: g.label, count: g.paths.length }));
    for (const loc of LOCALES) {
      const w = runtime(localPathsFor(loc));
      const got = groupsOf(w, localize(R, loc));
      assert.deepEqual(got.map((g) => ({ label: g.label, count: g.paths.length })), want, route + ' ' + loc);
      for (const g of got) for (const p of g.paths) assert.ok(p.startsWith(routes.routes['/'][loc]), route + ' ' + loc + ' kept locale href ' + p);
    }
  }
});

test('related-link labels name the destination page as it is now titled', () => {
  const h1 = (route) => read('english-candidate/prerender/' + route.replace(/^\/|\/$/g, '') + '.html')
    .match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
  const cases = [
    ['/karma-being-retreat/', 'Live to 100 with Panchkarma', '/live-to-100-with-panchkarma/'],
    ['/karma-being-retreat/', 'Products', '/ayurvedic-products/'],
    ['/karma-being-retreat-2019/', 'Kairali Ayurvedic Center', '/kairali-ayurvedic-centre/'],
    ['/katha-wellness-retreat-2019/', 'Kairali Ayurvedic Center', '/kairali-ayurvedic-centre/'],
  ];
  for (const [route, old, dest] of cases) {
    const edit = reviewCopyFor(route, 'en').find((e) => e.kind === 'link' && e.old === old);
    assert.ok(edit, route + ' ' + old);
    assert.equal(edit.new, h1(dest), route + ' label matches ' + dest);
    const before = `<li><a href="${dest}">${old}</a></li><p>${old}</p>`;
    const after = applyReviewSnapshot(before, route, 'en');
    assert.equal(after, `<li><a href="${dest}">${edit.new.replace(/&/g, '&amp;')}</a></li><p>${old}</p>`);
    assert.equal(applyReviewSnapshot(after, route, 'en'), after);
    assert.equal(applyReviewSnapshot(before, '/unrelated-test-route/', 'en'), before);
  }
});
