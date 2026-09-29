// Behaviour of the enquiry-family view logic's delivery paths, run in a sandbox: the real view logic + the real
// family data/render scripts, a synchronous DCLogic stand-in and a stubbed fetch. Proves the three outcomes the
// visitor can see — not connected (approved notice / WhatsApp-draft step), server acceptance (receipt) and failure
// (error, details kept) — without a browser, a network or a lead store.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const noopEl = () => new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => '' : k === 'style' || k === 'dataset' || k === 'classList' ? noopEl() : noopEl()), apply: () => noopEl(), set: () => true });

function sandbox(fetchImpl) {
  const requests = [];
  const document = { title: 'T', referrer: '', documentElement: { lang: 'de' }, head: noopEl(), body: noopEl(), querySelector: () => null, querySelectorAll: () => [], getElementById: () => null, createElement: () => noopEl(), addEventListener() {} };
  const window = { location: { href: 'https://preview.example.test/contact-us/?utm_source=google', search: '?utm_source=google', pathname: '/contact-us/', hash: '' }, addEventListener() {}, matchMedia: () => ({ matches: false, addEventListener() {} }) };
  const ctx = {
    window, document, location: window.location, navigator: { userAgent: 'node' }, console, URLSearchParams, URL, Blob, FormData, AbortController, setTimeout, clearTimeout, crypto: globalThis.crypto,
    requestAnimationFrame: (f) => setTimeout(f, 0), getComputedStyle: () => ({}),
    fetch: async (url, init) => { requests.push({ url, init, body: init.body instanceof Blob ? JSON.parse(await init.body.text()) : init.body }); return fetchImpl(url, init); },
    React: { createRef: () => ({ current: null }), createElement: () => null, Fragment: 'f' },
  };
  ctx.globalThis = ctx; window.document = document;
  vm.createContext(ctx);
  // The family scripts publish onto window.*; expose window's members globally the way a browser does.
  vm.runInContext('var self = window;', ctx);
  for (const file of ['../public/ahv/assets/enquiry-family-data.js', '../public/ahv/assets/enquiry-family-render.js']) {
    vm.runInContext(read(file), ctx, { filename: file });
    for (const k of Object.keys(ctx.window)) if (!(k in ctx)) ctx[k] = ctx.window[k];
  }
  ctx.DCLogic = class { constructor(props) { this.props = props || {}; } setState(u) { this.state = Object.assign({}, this.state, typeof u === 'function' ? u(this.state) : u); } };
  const { logic } = JSON.parse(read('../public/ahv/views/ahv-page-enquiry-desktop.json'));
  const Component = vm.runInContext(logic + '\n;Component', ctx);
  return { ctx, Component, requests };
}

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
const flush = () => new Promise((r) => setTimeout(r, 5));

function contactFlow(fetchImpl) {
  const s = sandbox(fetchImpl);
  if (!s.ctx.window.AHV_ENQUIRY_RENDER) return null;
  const c = new s.Component({ route: '/contact-us/' });
  c.state = Object.assign({}, c.state, { cv: { fname: 'Synthetic', country_code: '+91', phone: '9999999999', programme: '', email: 'synthetic@example.invalid', message: 'Hi' } });
  c._aFiles = {}; c._jFiles = {};
  c.focusFirstInvalid = () => {}; c.focusWhen = () => {};
  return { c, s, submit: async () => { const out = c.renderVals(); await out.contactSubmit({ preventDefault() {} }); await flush(); return c.state; } };
}

test('contact: not configured (503) shows the approved notice, never a receipt', async (t) => {
  const f = contactFlow(async () => json(503, { ok: false, code: 'LEAD_STORE_NOT_CONFIGURED' }));
  if (!f) return t.skip('family render script did not initialise in the sandbox');
  const st = await f.submit();
  assert.equal(st.cPending, true);
  assert.equal(st.cValid, false);
  assert.equal(st.cNotice, '');
  assert.equal(f.s.requests.length, 1);
  assert.equal(f.s.requests[0].url, '/api/lead/');
  assert.equal(f.s.requests[0].body.form, 'contact');
  assert.equal(f.s.requests[0].body.fields.full_name, 'Synthetic');
  assert.equal(f.s.requests[0].body.utm_source, 'google');
  assert.equal(f.s.requests[0].init.body.type, 'application/json');
});

test('contact: server acceptance shows the receipt; failure keeps details and says so', async (t) => {
  const ok = contactFlow(async () => json(200, { ok: true, status: 'received', guideUrl: '' }));
  if (!ok) return t.skip('family render script did not initialise in the sandbox');
  const st = await ok.submit();
  assert.equal(st.cValid, true);
  assert.equal(st.cPending, false);
  assert.equal(st.cNotice, 'Thank you — your details have been received.');
  const bad = contactFlow(async () => json(502, { ok: false, code: 'STORE_FAILED' }));
  const st2 = await bad.submit();
  assert.equal(st2.cValid, false);
  assert.equal(st2.cPending, false);
  assert.match(st2.cNotice, /could not confirm your submission/);
  assert.equal(st2.cv.email, 'synthetic@example.invalid', 'details are kept');
  const limited = contactFlow(async () => json(429, { ok: false, code: 'RATE_LIMITED' }));
  assert.match((await limited.submit()).cNotice, /Please wait before trying again/);
  const offline = contactFlow(async () => { throw new TypeError('network'); });
  assert.match((await offline.submit()).cNotice, /could not confirm your submission/, 'a browser network error is never shown raw');
});

function consultFlow(fetchImpl) {
  const s = sandbox(fetchImpl);
  if (!s.ctx.window.AHV_ENQUIRY_RENDER) return null;
  const c = new s.Component({ route: '/online-consultation/' });
  c.state = Object.assign({}, c.state, { step: 'review', ov: Object.assign({}, c.state.ov, { fName: 'Synthetic', fPhone: '9999999999', fEmail: 'synthetic@example.invalid', fCountry: 'India', fConcern: 'Back pain', consent: true }) });
  c._aFiles = {}; c._jFiles = {};
  c.focusFirstInvalid = () => {}; c.focusWhen = () => {};
  return { c, s, submit: async () => { const out = c.renderVals(); await out.submitReq({ preventDefault() {} }); await flush(); return { st: c.state, out: c.renderVals() }; } };
}

test('online consultation: not configured keeps the WhatsApp-draft step with the blocked notice; acceptance shows receipt', async (t) => {
  const pending = consultFlow(async () => json(503, { ok: false, code: 'LEAD_SHEET_NOT_CONFIGURED' }));
  if (!pending) return t.skip('family render script did not initialise in the sandbox');
  const a = await pending.submit();
  assert.equal(a.st.step, 'done');
  assert.equal(a.out.oReceived, false);
  assert.equal(a.out.oBlocked, true);
  assert.equal(pending.s.requests[0].body.form, 'online-consultation');
  assert.equal(pending.s.requests[0].body.fields.consent, true);
  const received = consultFlow(async () => json(200, { ok: true, status: 'received' }));
  const b = await received.submit();
  assert.equal(b.st.step, 'done');
  assert.equal(b.out.oReceived, true);
  assert.equal(b.out.oBlocked, false);
  const failed = consultFlow(async () => json(502, { ok: false, code: 'STORE_FAILED' }));
  const c = await failed.submit();
  assert.equal(c.st.step, 'review', 'a failure never advances to the done step');
  assert.match(c.st.oSubmitError, /could not confirm your submission/);
});
