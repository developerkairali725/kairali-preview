/**
 * /ppc-thanks/ retirement (owner request, 8 Oct 2026). Paid landing-page receipts now
 * go to the same-locale /thanks/; the 13 released /ppc-thanks/ paths 301 there, and a
 * receipt a cached bridge stored for the old path is honoured once on the new page.
 * Synthetic in-memory fixtures only: no form is submitted and nothing leaves the process.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { randomUUID } from 'node:crypto';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const receiptScript = read('public/design/lead-receipt.js');
const confirmationScript = read('public/ahv/assets/confirmation-family-render.js');
const map = JSON.parse(read('english-candidate/ppc-thanks-redirects.json'));
const released = JSON.parse(read('l10n/routes.json')).routes;
// A fresh synthetic v4 submission ID per run: mocked transports only, never a credential.
const token = randomUUID();
const key = 'ahv:lead-receipt:v1';
const ttl = 2 * 60 * 1000;
const langOf = (locale) => (locale === 'zh-Hans' ? 'zh' : locale);

function page(path, { store = new Map(), storage: override } = {}) {
  const navigations = [];
  const timers = [];
  const calls = { fetch: 0, recordLead: [] };
  const location = {
    href: `https://ayurvedichealingvillage.com${path}`,
    origin: 'https://ayurvedichealingvillage.com',
    pathname: path,
    search: '',
    assign: (target) => navigations.push(target),
  };
  const storage = override || {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
  };
  const context = {
    window: {
      fetch: async () => { calls.fetch += 1; return { status: 200, clone: () => ({ json: async () => ({ ok: true, status: 'received' }) }) }; },
      AHV_MEASUREMENT: { recordLead: (form, t) => calls.recordLead.push([form, t]) },
    },
    location,
    sessionStorage: storage,
    document: { documentElement: { lang: 'en' } },
    setTimeout: (fn) => { timers.push(fn); return timers.length; },
    URL,
    URLSearchParams,
    Date,
  };
  runInNewContext(receiptScript, context);
  return { context, store, timers, navigations, calls, receipt: context.window.AHV_LEAD_RECEIPT };
}

const marker = (fields) => JSON.stringify({ form: 'landing-page', token, lang: 'en', path: '/ppc-thanks/', at: Date.now() - 1000, ...fields });

test('the map is the 13 released /ppc-thanks/ paths, each to the same locale\'s released /thanks/', () => {
  assert.equal(map.length, 13);
  assert.deepEqual(map.map((r) => r.locale), Object.keys(released['/ppc-thanks/']));
  for (const rule of map) {
    assert.equal(rule.source, released['/ppc-thanks/'][rule.locale], rule.locale);
    assert.equal(rule.destination, released['/thanks/'][rule.locale], rule.locale);
    assert.ok(!/[?#]/.test(rule.destination), `${rule.locale}: destination adds no query or fragment`);
  }
  assert.equal(map.find((r) => r.locale === 'fr').destination, '/fr/remerciers/');
  const sources = new Set(map.map((r) => r.source));
  assert.equal(sources.size, 13);
  for (const rule of map) assert.ok(!sources.has(rule.destination), `${rule.source}: destination is itself redirected`);
});

test('no other redirect file claims a /ppc-thanks/ or /thanks/ path, so each source is one hop', () => {
  const others = [
    ...Object.entries(JSON.parse(read('english-candidate/redirect-map.json')).redirects).map(([source, r]) => ({ source, destination: r.to })),
    ...['ad-sitelink-redirects', 'legacy-english-redirects', 'document-redirects'].flatMap((f) => JSON.parse(read(`english-candidate/${f}.json`))),
    ...Object.entries(JSON.parse(read('l10n/routes.json')).redirects).map(([source, r]) => ({ source, destination: r.to })),
  ];
  const touched = new Set([...map.map((r) => r.source.toLowerCase()), ...map.map((r) => r.destination.toLowerCase())]);
  for (const rule of others) assert.ok(!touched.has(String(rule.source).toLowerCase()), `${rule.source} is already a redirect source`);
});

test('next.config.ts issues every mapped rule as a 301', () => {
  const config = read('next.config.ts');
  assert.match(config, /import ppcThanksRedirects from "\.\/english-candidate\/ppc-thanks-redirects\.json";/);
  assert.match(config, /\.\.\.ppcThanksRedirects\.map\(rule => \(\{ source:rule\.source, destination:rule\.destination, statusCode:301 as const \}\)\)/);
});

test('an accepted landing-page submission goes to the same-locale /thanks/ in all 13 locales', async () => {
  const landing = { en: '/lp/treatment-packages/', 'zh-Hans': '/zh/lp/treatment-packages/' };
  for (const rule of map) {
    const from = landing[rule.locale] || `/${rule.locale}/lp/treatment-packages/`;
    const sender = page(from);
    await sender.context.window.fetch('/api/lead/', { method: 'POST', body: JSON.stringify({ form: 'landing-page', submissionToken: token }) });
    sender.timers.forEach((timer) => timer());
    assert.deepEqual(sender.navigations, [rule.destination], rule.locale);
    assert.deepEqual(sender.calls.recordLead, [['landing-page', token]], `${rule.locale}: exactly one lead event, at the accepted response`);
    const stored = JSON.parse(sender.store.get(key));
    assert.equal(stored.path, rule.destination);
    assert.equal(stored.lang, langOf(rule.locale));
  }
});

test('the other forms keep their existing destinations', async () => {
  const expected = { contact: '/contact-us/thank-you/', 'enquiry-form': '/thanks/', 'online-consultation': '/onlineconsultation-thanks/', 'apply-now': '/thanks/', opd: '/thanks/' };
  for (const [form, destination] of Object.entries(expected)) {
    const sender = page('/contact-us/');
    await sender.context.window.fetch('/api/lead/', { method: 'POST', body: JSON.stringify({ form, submissionToken: token }) });
    sender.timers.forEach((timer) => timer());
    assert.deepEqual(sender.navigations, [destination], form);
  }
});

test('an old-path receipt is honoured once on the redirected page in all 13 locales, keeping its token and time', () => {
  for (const rule of map) {
    const at = Date.now() - 5000;
    const store = new Map([[key, marker({ lang: langOf(rule.locale), path: rule.source, at })]]);
    const view = page(rule.destination, { store });
    const item = view.receipt.consume(rule.destination);
    assert.ok(item, rule.locale);
    assert.equal(item.path, rule.destination);
    assert.equal(item.token, token);
    assert.equal(item.at, at);
    assert.equal(item.form, 'landing-page');
    assert.equal(store.has(key), false, `${rule.locale}: removed before use`);
    assert.equal(view.receipt.consume(rule.destination), item, `${rule.locale}: same document re-renders reuse it`);
    assert.equal(view.receipt.current(), item);
    assert.equal(view.calls.fetch, 0, `${rule.locale}: no API call`);
    assert.deepEqual(view.calls.recordLead, [], `${rule.locale}: no lead event on the thank-you page`);
    const reload = page(rule.destination, { store });
    assert.equal(reload.receipt.consume(rule.destination), null, `${rule.locale}: a fresh document cannot reuse it`);
  }
});

test('the confirmation renderer shows the receipt state for a redirected old-path marker, then neutral on reload', () => {
  const store = new Map([[key, marker({ lang: 'de', path: '/de/ppc-thanks/' })]]);
  const view = page('/de/thanks/', { store });
  view.context.window.AHV_CONFIRM = { routes: [{ path: '/thanks/', variant: 'next-steps', metadata: { og: {} } }], images: {} };
  runInNewContext(confirmationScript, view.context);
  const render = view.context.window.AHV_CONFIRM_RENDER;
  const route = render.resolveRoute('/thanks/');
  assert.equal(route.variant, 'next-steps', 'landing-page receipts keep the shared enquiry design');
  assert.equal(render.resolveReceipt(), true);
  const reload = page('/de/thanks/', { store });
  runInNewContext(confirmationScript, reload.context);
  reload.context.window.AHV_CONFIRM = view.context.window.AHV_CONFIRM;
  assert.equal(reload.context.window.AHV_CONFIRM_RENDER.resolveReceipt(), false);
});

test('old-path receipts fail closed for any other form, locale pairing, path, time or token', () => {
  const now = Date.now();
  const cases = [
    ['other form at the old path', { form: 'contact' }, '/thanks/'],
    ['enquiry form at the old path', { form: 'enquiry-form' }, '/thanks/'],
    ['cross-locale destination', { lang: 'de', path: '/de/ppc-thanks/' }, '/fr/remerciers/'],
    ['language and old path disagree', { lang: 'en', path: '/de/ppc-thanks/' }, '/de/thanks/'],
    ['French old path at an unlocalised /fr/thanks/', { lang: 'fr', path: '/fr/ppc-thanks/' }, '/fr/thanks/'],
    ['unreleased language', { lang: 'xx', path: '/xx/ppc-thanks/' }, '/xx/thanks/'],
    ['non-string language', { lang: ['de'], path: '/de/ppc-thanks/' }, '/de/thanks/'],
    ['old path consumed somewhere else', {}, '/contact-us/thank-you/'],
    ['unrelated legacy path', { path: '/thanks-old/' }, '/thanks/'],
    ['expired', { at: now - ttl }, '/thanks/'],
    ['future', { at: now + 60000 }, '/thanks/'],
    ['non-numeric time', { at: String(now) }, '/thanks/'],
    ['malformed token', { token: 'not-a-token' }, '/thanks/'],
    ['missing token', { token: undefined }, '/thanks/'],
  ];
  for (const [name, fields, at] of cases) {
    const store = new Map([[key, marker(fields)]]);
    const view = page(at, { store });
    assert.equal(view.receipt.consume(at), null, name);
    assert.equal(view.receipt.current(), null, name);
    assert.equal(store.has(key), false, `${name}: still removed before validation`);
  }
});

test('the old page itself no longer accepts a new receipt, and direct or query-only visits stay neutral', () => {
  const store = new Map([[key, marker({ path: '/thanks/' })]]);
  assert.equal(page('/ppc-thanks/', { store }).receipt.consume('/ppc-thanks/'), null);
  const direct = page('/thanks/');
  direct.context.location.search = '?gclid=abc&utm_campaign=Brand+%26+Competition&receipt=1';
  assert.equal(direct.receipt.consume('/thanks/'), null);
  assert.equal(direct.receipt.current(), null);
});

test('unavailable storage leaves the thank-you page neutral and the form\'s inline receipt in place', async () => {
  const broken = { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('denied'); }, removeItem: () => { throw new Error('denied'); } };
  const view = page('/thanks/', { storage: broken });
  assert.equal(view.receipt.consume('/thanks/'), null);
  const sender = page('/lp/treatment-packages/', { storage: broken });
  const response = await sender.context.window.fetch('/api/lead/', { method: 'POST', body: JSON.stringify({ form: 'landing-page', submissionToken: token }) });
  sender.timers.forEach((timer) => timer());
  assert.equal(response.status, 200);
  assert.deepEqual(sender.navigations, []);
  assert.deepEqual(sender.calls.recordLead, [['landing-page', token]], 'the accepted response is still measured once');
});
