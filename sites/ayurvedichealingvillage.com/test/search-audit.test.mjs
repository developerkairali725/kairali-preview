import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('public/design/search.js', 'utf8'), ctx);
const index = JSON.parse(fs.readFileSync('public/ahv/search-index.json', 'utf8'));
const engine = ctx.AHVSearch.createEngine(index);
test('price sorting retains the requested duration', () => {
  const r = engine.query('cheapest 7 nights');
  assert.ok(r.programmes.length);
  assert.ok(r.programmes.every(p => p.data.nights === 7));
  assert.ok(r.programmes.every((p, i, a) => !i || p.data.from.INR >= a[i - 1].data.from.INR));
});
test('FAQ scope cannot inject programmes or pages through intents or facets', () => {
  for (const q of ['7 nights', 'cheapest', 'airport', 'back pain']) {
    const r = engine.query(q, { scope: 'faq' });
    assert.equal(r.programmes.length + r.pages.length, 0, q);
  }
});
test('finder retains all matches before category, duration and budget filters', () => {
  const r = engine.query('14 days', { scope: 'programmes' });
  assert.ok(r.programmes.length > 12);
  assert.equal(r.programmes.length, index.programmes.filter(p => p.nights === 14).length);
});
test('preview counts are the full count and all results remain accessible', () => {
  const preview = engine.query('yoga');
  const full = engine.query('yoga', { limit: 1000 });
  assert.equal(preview.total, full.total);
  assert.ok(preview.total > preview.shown);
  assert.equal(full.shown, full.total);
});
test('compound number words map to duration', () => {
  const r = engine.query('twenty one days');
  assert.equal(r.nights, 21);
  assert.ok(r.programmes.length);
  assert.ok(r.programmes.every(p => p.data.nights === 21));
});
test('owner-confirmed amenities and exact suite identifiers are discoverable', () => {
  for (const q of ['1001', '1002']) assert.equal(engine.query(q).pages[0].route, '/maharaja-suite/');
  assert.equal(engine.query('1003').total, 0);
  const r = engine.query('hairdryer');
  for (const route of ['maharaja-suite', 'royal-villa', 'classic-villa', 'deluxe-villa']) assert.ok(r.pages.some(p => p.route === '/' + route + '/'));
});
test('blank and punctuation-only queries have a defined zero count', () => {
  for (const q of ['', ' ', '!!!', '💚']) assert.equal(engine.query(q).total, 0);
});
test('test and submission-confirmation pages are excluded from public search', () => {
  assert.ok(index.pages.every(p => !/\/(testing|test-page(?:-2)?|gift-test|thanks(?:-old)?|thank-you|onlinebookingthankyou|onlineconsultation-thanks|ppc-thanks)\//.test(p.route)));
});

test('visitor family questions prefer the children policy over packing', () => {
  for (const q of ['can I bring my child', 'can I bring my kids', 'travel with children']) {
    const r = engine.query(q);
    assert.equal(r.order[0], 'questions');
    assert.equal(r.questions[0].id, 'q-48');
  }
});
test('unknown words cannot silently become a duration-only recommendation', () => {
  assert.equal(engine.query('xyzzy 7 days').total, 0);
  assert.ok(engine.query('7 days').programmes.length);
  assert.ok(engine.query('cheapest 7 nights').programmes.length);
});
test('public results exclude redirects, duplicate and internal pages', () => {
  const redirects = JSON.parse(fs.readFileSync('english-candidate/redirect-map.json')).redirects;
  const excluded = new Set(JSON.parse(fs.readFileSync('english-candidate/route-manifest.json')).routes.filter(r => r.sitemapExclude).map(r => r.path));
  for (const p of index.pages) assert.ok(!redirects[p.route] && !excluded.has(p.route), p.route);
});
test('expired and future tariffs are not shown or sorted as current prices', () => {
  const make = date => {
    const c = { Date: class extends Date { constructor(...a) { super(...(a.length ? a : [date])); } } };
    vm.runInNewContext(fs.readFileSync('public/design/search.js', 'utf8'), c);
    return c.AHVSearch.createEngine(index);
  };
  const before = make('2026-09-24T12:00:00Z');
  const after = make('2026-10-01T12:00:00Z');
  const course = index.programmes.find(p => p.validFrom === '2026-10-01');
  assert.ok(course);
  assert.equal(before.priceAvailable(course), false);
  assert.equal(after.priceAvailable(course), true);
  const p = index.programmes.find(p => p.validTo === '2026-09-30' && p.from);
  assert.equal(after.priceAvailable(p), false);
  assert.match(after.answerLine(p, 'INR', index.ui), /Request a quote/);
  assert.equal(after.query('cheapest 7 nights').programmes.length, 0);
});
