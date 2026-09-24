// ONE site tree drives the /sitemap/ page AND the left section rail (owner, 23 Sep 2026).
// tools/build-site-tree.mjs -> english-candidate/site-tree.json
//   -> tools/build-sitemap-navigation.mjs (sitemap views) + tools/build-section-nav.mjs (rail data)
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const url = (p) => new URL('../' + p, import.meta.url);
const read = (p) => JSON.parse(fs.readFileSync(url(p), 'utf8'));
const tree = read('english-candidate/site-tree.json');
const manifest = read('english-candidate/route-manifest.json');
const byPath = new Map(manifest.routes.map((r) => [r.path, r]));
const overrides = fs.existsSync(url('english-candidate/site-tree-overrides.json')) ? read('english-candidate/site-tree-overrides.json') : { drops: [] };
const dropped = new Set((overrides.drops || []).map((d) => d.path));
const JUNK = /^\/(gift-test|test-page|test-page-2|testing|my-account|search-results|new-privacy-policy|contact-us-old|enquiry-form-old|how-to-reach-old|online-consultation-old|thanks-old|cart|checkout|onlinebookingthankyou|onlineconsultation-thanks|contact-us\/thank-you|thanks|ppc-thanks|postulez-maintenant|ru|treatment-in-kerala-russian\.html)\/?$/;
const BANNED = /\b(spa|resort|holiday|luxury|cure|journey|guests?)\b/i;
const nodes = [];
const walk = (list) => list.forEach((n) => { nodes.push(n); walk(n.children); });
tree.sections.forEach((s) => walk(s.children));

test('every indexable page is in the tree exactly once, and every entry is a served page', () => {
  const expected = manifest.routes.filter((r) => r.path !== '/' && !r.sitemapExclude && !manifest.deferred.includes(r.path) && !JUNK.test(r.path) && !dropped.has(r.path)).map((r) => r.path).sort();
  assert.deepEqual(Object.keys(tree.index).sort(), expected);
  const paths = nodes.filter((n) => n.path).map((n) => n.path);
  assert.equal(new Set(paths).size, paths.length, 'a page is listed twice');
  for (const p of Object.keys(tree.index)) assert.ok(byPath.has(p), 'not served: ' + p);
});
test('parents are real pages (the only non-link parents are concern headings and hub-less sections)', () => {
  for (const n of nodes) if (n.children.length && !n.path) assert.ok(n.group, 'a parent with no page: ' + n.title);
  for (const s of tree.sections) if (!s.hub) assert.match(s.id, /^(campaigns|site)$/);
});
test('children read in their intended order (ladders, hub card order)', () => {
  const o = overrides.order || {};
  const find = (list, p) => { for (const n of list) { if (n.path === p) return n; const f = find(n.children, p); if (f) return f; } return null; };
  for (const [parent, want] of Object.entries(o)) {
    const sec = tree.sections.find((s) => s.hub === parent);
    const kids = (sec ? sec.children : (find(tree.sections.flatMap((s) => s.children), parent) || { children: [] }).children).map((n) => n.path).filter((p) => want.includes(p));
    assert.deepEqual(kids, want.filter((p) => kids.includes(p)), parent);
  }
});
test('owner rulings: villas sit under Our Villas; the Air India page is a partnership under About', () => {
  for (const v of ['/classic-villa/', '/deluxe-villa/', '/royal-villa/', '/maharaja-suite/']) assert.equal(tree.index[v].section, 'villas', v);
  const ai = tree.index['/kairali-air-india-maharaja-club.html'];
  assert.equal(ai.section, 'about'); assert.ok(ai.ancestors.includes('/our-partners/'));
});
test('no KTAHV-locked word in any label or section title', () => {
  for (const n of nodes) assert.doesNotMatch(n.title, BANNED, n.title);
  for (const s of tree.sections) assert.doesNotMatch(s.title, BANNED, s.title);
});
test('the rail renders the same tree the sitemap renders', () => {
  const w = {}; vm.runInNewContext(fs.readFileSync(url('public/design/section-nav.data.js'), 'utf8'), { window: w });
  const rail = JSON.parse(JSON.stringify(w.AHV_SECTION_NAV));   // out of the VM realm, so deepEqual compares values
  const shape = (list) => list.map((n) => [n.path, n.children.length ? shape(n.children) : 0]);
  for (const s of tree.sections.filter((x) => x.hub)) {
    assert.deepEqual(shape(rail.sections[s.id].items), shape(s.children), 'rail differs from sitemap in ' + s.id);
    assert.equal(rail.sections[s.id].label, s.title);
  }
  for (const [p, r] of Object.entries(rail.routes)) { const at = tree.index[p] || (tree.unlisted || {})[p]; assert.ok(at, p); assert.deepEqual(r.crumbs, [...at.ancestors, p], p); }
  // unlisted (dropped) pages still draw the rail, so their old WordPress sidebar never returns
  for (const p of Object.keys(tree.unlisted || {})) assert.ok(!(p in tree.index), p);
});
test('both sitemap views carry every page; mobile imports the narrow chrome; the filter is typo-tolerant', () => {
  const d = read('public/ahv/views/ahv-page-sitemap-desktop.json'), m = read('public/ahv/views/ahv-page-sitemap-mobile.json');
  for (const p of Object.keys(tree.index).filter(p=>tree.index[p].section!=='campaigns')) { assert.ok(d.template.includes('href="' + p + '"'), p); assert.ok(m.template.includes('href="' + p + '"'), p); }
  assert.match(m.template, /AHV Chrome Header" narrow="true"/);
  assert.ok(d.logic.includes('const hit='));
});
test('the server-rendered sitemap carries every page', () => {
  const ssr = fs.readFileSync(url('english-candidate/prerender/sitemap.html'), 'utf8');
  for (const p of Object.keys(tree.index).filter(p=>tree.index[p].section!=='campaigns')) assert.ok(ssr.includes('href="' + p + '"'), p);
  assert.ok(!ssr.includes('{{')); assert.ok(!ssr.includes('<dc-import'));
});

test('visitor sitemap excludes campaign links while offering both programme entry paths', () => {
  for (const variant of ['desktop', 'mobile']) {
    const view = read('public/ahv/views/ahv-page-sitemap-' + variant + '.json');
    for (const [p, entry] of Object.entries(tree.index)) if (entry.section === 'campaigns') assert.ok(!view.template.includes('href="' + p + '"'), p);
    assert.match(view.template, /class="sm-entry-paths"/);
    assert.match(view.template, /Browse our main pages/);
    assert.ok(view.logic.includes("hits===1?'page':'pages'"));
  }
  const footer = fs.readFileSync(url('public/ahv/components/AHV Chrome Footer.dc.html'), 'utf8');
  assert.match(footer, /href="https:\/\/ayurvedichealingvillage.com\/read-feedback\/"[^>]*>Reviews<\/a>/);
});

test('server sitemap mirrors the corrected visitor directory', () => {
  const html = fs.readFileSync(url('english-candidate/prerender/sitemap.html'), 'utf8');
  const pageCount = Object.values(tree.index).filter(x => x.section !== "campaigns").length;
  const sectionCount = tree.sections.filter(x => x.id !== "campaigns").length;
  assert.ok(html.includes(`${pageCount} pages across ${sectionCount} sections`));
  assert.ok(!html.includes("/founders-message/"));
  assert.match(html, /class="sm-entry-paths"/);
  for (const [p, entry] of Object.entries(tree.index)) if (entry.section === 'campaigns') assert.ok(!html.includes('href="' + p + '"'), p);
});
