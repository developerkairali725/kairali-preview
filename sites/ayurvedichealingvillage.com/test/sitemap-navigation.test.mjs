import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read = (p) => JSON.parse(fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8'));
const data = read('english-candidate/sitemap-navigation.json');
const baseline = read('english-candidate/sitemap-navigation-baseline.json');
const manifest = read('english-candidate/route-manifest.json');
const byPath = new Map(manifest.routes.map((r) => [r.path, r]));
const APP_ROUTES = new Set(['/search/', '/sitemap.xml']);
// the WordPress-era hrefs the curation pass re-points (tools/curate-sitemap-navigation.mjs)
const ALIAS = { '/opd/': '/walk-in-ayurveda-treatment/', '/panchkarma/': '/panchakarma-therapy/', '/panchakarma/': '/panchakarma-therapy/', '/search-results/': '/search/' };
const DROPPED = new Set(['/sitemap_index.xml', '/thanks/', '/ppc-thanks/']);
const JUNK = /^\/(gift-test|test-page|test-page-2|testing|my-account|search-results|new-privacy-policy|contact-us-old|enquiry-form-old|how-to-reach-old|online-consultation-old|thanks-old|cart|checkout|onlinebookingthankyou|onlineconsultation-thanks|contact-us\/thank-you|thanks|ppc-thanks|postulez-maintenant|apply-now|ru|treatment-in-kerala-russian\.html|sitemap)\/?$/;
const slashed = (h) => (/^\//.test(h) && !/\.(html|xml)$/.test(h) && !h.endsWith('/') ? h + '/' : h);

test('the original 214 entries all survive, resolved through the alias map, or are documented drops', () => {
  assert.equal(baseline.length, 214);
  const after = new Set(data.links.map((l) => l.href));
  for (const b of baseline) {
    const h = slashed(b.href);
    if (DROPPED.has(h)) continue;
    assert.ok(after.has(ALIAS[h] || h), b.href);
  }
});
test('every entry is a served page, listed once, with its trailing slash and no banned word', () => {
  assert.equal(new Set(data.links.map((l) => l.id)).size, data.links.length);
  assert.equal(new Set(data.links.map((l) => l.href)).size, data.links.length, 'duplicate href');
  for (const l of data.links) {
    assert.ok(data.roots.includes(l.branch[0]), l.href);
    assert.ok(l.branch.length >= 1 && l.branch.length <= 3);
    if (/^\//.test(l.href)) { assert.ok(byPath.has(l.href) || APP_ROUTES.has(l.href), 'not served: ' + l.href); assert.equal(l.href, slashed(l.href)); }
    else assert.match(l.href, /^https:\/\//);
    assert.doesNotMatch(l.title, /\b(spa|resort|holiday|luxury|cure|journey|guests?)\b/i, l.title);
    const r = byPath.get(l.href); if (r) assert.ok(!r.sitemapExclude, 'canonicalised duplicate listed: ' + l.href);
  }
});
test('every served, indexable page is in the tree (junk/test/old/confirmation routes stay out)', () => {
  const listed = new Set(data.links.map((l) => l.href));
  const missing = manifest.routes.filter((r) => !r.sitemapExclude && !manifest.deferred.includes(r.path) && !JUNK.test(r.path) && !listed.has(r.path)).map((r) => r.path);
  assert.deepEqual(missing, []);
});
test('programme entries carry the register name', () => {
  const w = {}; vm.runInNewContext(fs.readFileSync(new URL('../public/ahv/assets/all-programs-data.js', import.meta.url), 'utf8'), { window: w });
  const reg = new Map(Object.values(w)[0].programmes.map((p) => [p.route, p.name.toLowerCase()]));
  for (const l of data.links) if (reg.has(l.href)) assert.equal(l.title.toLowerCase(), reg.get(l.href), l.href);
});
test('desktop and mobile use identical trees and all destinations are present in each payload', () => {
  const d = read('public/ahv/views/ahv-page-sitemap-desktop.json'), m = read('public/ahv/views/ahv-page-sitemap-mobile.json');
  // identical trees; the mobile view differs only in importing the chrome's narrow half
  const strip = (t) => t.replace(/<dc-import[^>]*>/g, '<dc-import>');
  assert.equal(strip(d.template), strip(m.template)); assert.equal(d.logic, m.logic);
  assert.match(m.template, /AHV Chrome Header" narrow="true"/);
  assert.equal((d.template.match(/data-leaf /g) || []).length, data.links.length);
  for (const l of data.links) assert.ok(d.template.includes('href="' + l.href + '"'), l.href);
  assert.equal((d.template.match(/class="sm-branch sm-depth-0"/g) || []).length, data.roots.length);
  assert.ok(d.logic.includes('const hit='), 'typo-tolerant filter');
});
test('server-rendered sitemap contains every destination', () => {
  const ssr = fs.readFileSync(new URL('../english-candidate/prerender/sitemap.html', import.meta.url), 'utf8');
  for (const l of data.links) assert.ok(ssr.includes('href="' + l.href + '"'), l.href);
  assert.ok(!ssr.includes('{{')); assert.ok(!ssr.includes('<dc-import'));
});
