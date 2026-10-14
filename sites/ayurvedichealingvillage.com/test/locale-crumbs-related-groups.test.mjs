// AHV-M070.01 / AHV-M071.01: the tree breadcrumb (Home / Things to do / page) must also be rebuilt on locale
// pages, whose design names the breadcrumb nav in the locale's language (de "Navigationspfad").
// AHV-M082.02: /food-sadhana/ related links are grouped by their ENGLISH route on locale pages too, so the
// German and French pages (localized slugs) get the same groups as English and the other ten locales.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { jsUnits, applyUnits, unitId } from '../tools/l10n/lib.mjs';
import { runtimeScriptUnits } from '../tools/l10n/extras.mjs';

const site = new URL('../', import.meta.url);
const read = (p) => fs.readFileSync(new URL(p, site), 'utf8');

function catalogue(locale) {
  const map = new Map();
  const dir = new URL(`l10n/output/${locale}/`, site);
  for (const f of fs.readdirSync(dir)) for (const u of JSON.parse(fs.readFileSync(new URL(f, dir), 'utf8')).units || []) if (u.text != null) map.set(u.id, u.text);
  return map;
}

test('section-nav.js: the breadcrumb label is an allowlisted literal the locale build translates like the design aria-label', () => {
  const file = 'public/design/section-nav.js';
  const text = read(file);
  assert.match(text, /var CRUMB_LABEL = "Breadcrumb";/);
  assert.match(text, /root\.querySelector\('nav\[aria-label="' \+ CRUMB_LABEL \+ '"\]'\)/);
  const allow = JSON.parse(read('l10n/source/runtime-allowlist.json'))['section-nav.js'];
  assert.ok(allow.includes('Breadcrumb'));
  for (const [locale, label] of [['de', 'Navigationspfad'], ['fr', "Fil d'Ariane"], ['ja', 'パンくずリスト']]) {
    const cat = catalogue(locale);
    assert.equal(cat.get(unitId('Breadcrumb')), label, `${locale} catalogue`);
    const out = applyUnits(text, runtimeScriptUnits(file, text), (s) => cat.get(unitId(s)) ?? null);
    assert.ok(out.includes('var CRUMB_LABEL = ' + JSON.stringify(label) + ';') || out.includes("var CRUMB_LABEL = \"" + label + "\";"), `${locale} localized literal`);
    // the English selector stays as code
    assert.ok(out.includes(`'nav[aria-label="Breadcrumb"]'`));
  }
});

test('hist9 related groups: localized hrefs are grouped by their English route', () => {
  const routes = JSON.parse(read('l10n/routes.json')).routes;
  const data = read('public/ahv/assets/hist9-family-data.js');
  const D = JSON.parse(data.slice(data.indexOf('{'), data.trimEnd().lastIndexOf('}') + 1));
  const R = D.routes.find((r) => r.path === '/food-sadhana/');
  const groupsFor = (locale, withMap) => {
    const localPaths = Object.fromEntries(Object.entries(routes).map(([en, r]) => [en, r[locale]]).filter(([, p]) => p));
    const win = { AHV_LOCAL_PATHS: withMap ? localPaths : undefined, AHV_COLLECTION_RENDER: { sourceBlocks: () => [] } };
    const ctx = { window: win, location: { search: '' }, URL, URLSearchParams, React: { createElement: () => null } };
    vm.runInNewContext(read('public/ahv/assets/hist9-family-render.js'), ctx);
    const links = R.relatedLinks.map((l) => {
      const en = new URL(l.href).pathname;
      return { ...l, href: 'https://ayurvedichealingvillage.com' + (locale === 'en' ? en : localPaths[en] || `/${locale}${en}`) };
    });
    const v = win.AHV_HIST9_RENDER.histVals({ ...R, images: [], components: [], relatedLinks: links, archiveLink: R.archiveLink || { href: '/' } });
    return JSON.parse(JSON.stringify(v.relatedGroups.map((g) => `${g.label}:${g.links.length}`)));
  };
  const en = groupsFor('en', false);
  assert.ok(en.length >= 3, en.join());
  for (const locale of ['de', 'fr', 'es', 'zh-Hans']) {
    assert.deepEqual(groupsFor(locale, true), en, `${locale} with route table`);
    // without the route table, locales whose slugs stay English still group by the prefix-stripped path
    if (locale === 'es' || locale === 'zh-Hans') assert.deepEqual(groupsFor(locale, false), en, `${locale} prefix fallback`);
  }
  // the German page no longer files Kairali Hospitality under products
  assert.ok(!groupsFor('de', true).some((g) => /^Products & publications:19$/.test(g)));
});
