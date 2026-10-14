import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

// AHV-I04.M066.links: the reviewed "Explore related resources" list on the reader-25A
// routes was rendered as a <nav> and then deleted by section-nav.js's retired-sidebar sweep.
const site = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, site), 'utf8');

function load() {
  const ctx = {window: {}, location: {search: ''}, URLSearchParams};
  ctx.window.AHV_COLLECTION_RENDER = {sourceBlocks: (blocks) => blocks};
  vm.createContext(ctx);
  vm.runInContext(read('public/ahv/assets/reader25a-family-data.js'), ctx);
  vm.runInContext(read('public/ahv/assets/reader25a-family-render.js'), ctx);
  return ctx.window;
}

// section-nav.js removes only nav[data-source-component] elements whose component matches this rule.
const navJs = read('public/design/section-nav.js');
const sweepSelector = 'nav[data-source-component]';
const sweepRule = /context|menu|navigation/i;

test('section-nav.js sweeps only <nav> components', () => {
  assert.equal(navJs.split(`querySelectorAll("${sweepSelector}")`).length - 1, 2);
  assert.match(navJs, /\/context\|menu\|navigation\/i\.test\(els\[i\]\.getAttribute\("data-source-component"\)/);
});

test('contextual-resources renders as a section that survives the sidebar sweep; contextNav stays a removable nav', () => {
  const w = load();
  const R = w.AHV_READER25A_RENDER.resolveRoute('/why-get-training-in-ayurveda/');
  assert.ok(R, 'route present in reader-25A dataset');
  const vals = w.AHV_READER25A_RENDER.readerVals(R, () => {});
  const byName = Object.fromEntries(vals.sections.map((s) => [s.component, s]));
  assert.equal(byName['contextual-resources'].isNav, false);
  assert.equal(byName['contextual-resources'].isSection, true);
  assert.equal(byName.contextNav.isNav, true);
  assert.equal(byName.contextNav.isSection, false);
  for (const s of vals.sections) assert.notEqual(s.isNav, s.isSection, s.component);
  const survivors = vals.sections.filter((s) => !(s.isNav && sweepRule.test(s.component))).map((s) => s.component);
  assert.deepEqual(Array.from(survivors), ['hero', 'article', 'contextual-resources']);
});

test('the surviving list keeps its reviewed heading, labels and destinations', () => {
  const w = load();
  const R = w.AHV_READER25A_RENDER.resolveRoute('/why-get-training-in-ayurveda/');
  const c = R.components.find((x) => x.component === 'contextual-resources');
  assert.equal(c.blocks[0].text, 'Explore related resources');
  const links = JSON.parse(JSON.stringify(c.blocks[1].items.map((i) => [i.tree[0].attrs.href, i.text])));
  assert.deepEqual(links, [
    // Train G rework (15 Oct 2026): the reviewer rejected the 301 source; the link names the final URL.
    ['/ayurveda-training-programme/', 'Ayurveda training programmes'],
    ['/training-course-fees/', 'Course information and fees'],
  ]);
  // The three labels already carry reviewed translations for the twelve locale captures.
  const units = JSON.parse(read('english-candidate/information-locales.json')).units;
  for (const label of ['Explore related resources', 'Ayurveda training programmes', 'Course information and fees']) {
    const u = units.find((x) => x.source === label);
    assert.ok(u, label);
    assert.equal(Object.keys(u.translations).length, 12, label);
  }
});

// Train G rework (15 Oct 2026, AHV-I04.M066.links): the renderer change also surfaces the same list on the two other
// reader-25A routes that carry one, plus the treatment explainer; every destination must be a final URL (no 301) whose
// label names what it opens, and every locale must have its own route for it.
test('every surfaced contextual-resources link is a final, served, localized route', () => {
  const w = load();
  const redirects = JSON.parse(read('english-candidate/redirect-map.json')).redirects;
  const manifest = new Set(JSON.parse(read('english-candidate/route-manifest.json')).routes.map((r) => r.path));
  const routes = JSON.parse(read('l10n/routes.json')).routes;
  const lists = {};
  for (const path of ['/why-get-training-in-ayurveda/', '/why-get-training-in-yoga/', '/why-pick-a-yoga-or-yoga-retreat/', '/why-pick-an-ayurveda-treatment-or-ayurvedic-retreat/']) {
    const R = w.AHV_READER25A_RENDER.resolveRoute(path);
    const c = R.components.find((x) => x.component === 'contextual-resources');
    lists[path] = JSON.parse(JSON.stringify(c.blocks[1].items.map((i) => [i.tree[0].attrs.href, i.text])));
  }
  assert.deepEqual(lists, {
    '/why-get-training-in-ayurveda/': [['/ayurveda-training-programme/', 'Ayurveda training programmes'], ['/training-course-fees/', 'Course information and fees']],
    '/why-get-training-in-yoga/': [['/yoga-classes-theory/', 'Yoga theory at Kairali'], ['/yoga-classes-practical/', 'Practical yoga classes'], ['/yoga-meditation-training/', 'Yoga and meditation programme']],
    // was /yoga-retreats/, a 301 to the bespoke /yoga-therapy-individual/ page: 'Yoga programmes' now opens the yoga programmes hub
    '/why-pick-a-yoga-or-yoga-retreat/': [['/yoga-meditation-programs/', 'Yoga programmes'], ['/yoga-classes-practical/', 'Practical yoga classes']],
    '/why-pick-an-ayurveda-treatment-or-ayurvedic-retreat/': [['/ayurvedic-treatments/', 'Ayurvedic treatment programmes'], ['/online-consultation/', 'Speak with an Ayurvedic physician']],
  });
  for (const [page, links] of Object.entries(lists)) for (const [href] of links) {
    assert.equal(redirects[href], undefined, `${page} -> ${href} is not a 301 source`);
    assert.ok(manifest.has(href), `${page} -> ${href} is a served route`);
    assert.equal(Object.keys(routes[href] || {}).length, 13, `${page} -> ${href} has all 13 locale routes`);
  }
});
