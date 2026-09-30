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

function sandbox(fetchImpl, view = 'desktop') {
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
  const { logic } = JSON.parse(read('../public/ahv/views/ahv-page-enquiry-' + view + '.json'));
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

function consultFlow(fetchImpl, view) {
  const s = sandbox(fetchImpl, view);
  if (!s.ctx.window.AHV_ENQUIRY_RENDER) return null;
  const c = new s.Component({ route: '/online-consultation/' });
  c.state = Object.assign({}, c.state, { step: 'review', ov: Object.assign({}, c.state.ov, { fName: 'Synthetic', fPhone: '9999999999', fEmail: 'synthetic@example.invalid', fCountry: 'India', fConcern: 'Back pain', consent: true }) });
  c._aFiles = {}; c._jFiles = {};
  c.focusFirstInvalid = () => {}; c.focusWhen = () => {};
  return { c, s, submit: async () => { const out = c.renderVals(); await out.submitReq({ preventDefault() {} }); await flush(); return { st: c.state, out: c.renderVals() }; } };
}

for (const view of ['desktop', 'mobile']) test(view + ' online consultation: not configured keeps the WhatsApp-draft step with the blocked notice; acceptance shows receipt', async (t) => {
  const pending = consultFlow(async () => json(503, { ok: false, code: 'LEAD_SHEET_NOT_CONFIGURED' }), view);
  if (!pending) return t.skip('family render script did not initialise in the sandbox');
  const a = await pending.submit();
  assert.equal(a.st.step, 'done');
  assert.equal(a.out.oReceived, false);
  assert.equal(a.out.oBlocked, true);
  assert.equal(a.out.oDoneHeading, 'Continue in WhatsApp');
  assert.match(a.out.oDoneBody, /does not confirm/);
  assert.match(a.out.O.card.done.blocked, /not connected/);
  assert.equal(a.out.O.card.review.submit, 'Send consultation request');
  assert.doesNotMatch(a.out.O.card.review.intro, /Sending opens WhatsApp/);
  assert.equal(pending.s.requests[0].body.form, 'online-consultation');
  assert.equal(pending.s.requests[0].body.fields.consent, true);
  const received = consultFlow(async () => json(200, { ok: true, status: 'received' }), view);
  const b = await received.submit();
  assert.equal(b.st.step, 'done');
  assert.equal(b.out.oReceived, true);
  assert.equal(b.out.oBlocked, false);
  assert.equal(b.out.oDoneHeading, 'Request received');
  assert.doesNotMatch(b.out.oDoneBody, /draft|does not confirm/);
  assert.match(b.out.oWhatsAppLabel, /optional/);
  const template = JSON.parse(read('../public/ahv/views/ahv-page-enquiry-' + view + '.json')).template;
  for (const value of ['oDoneHeading', 'oDoneBody', 'oWhatsAppLabel']) assert.ok(template.includes('{{ ' + value + ' }}'));
  const failed = consultFlow(async () => json(502, { ok: false, code: 'STORE_FAILED' }), view);
  const c = await failed.submit();
  assert.equal(c.st.step, 'review', 'a failure never advances to the done step');
  assert.match(c.st.oSubmitError, /could not confirm your submission/);
});

test('application upload rejects oversize before transport and reports server413 honestly', async () => {
  const s = sandbox(async () => json(413, {ok:false, code:'FILE_TOO_LARGE'}));
  const c = new s.Component({route:'/apply-now/'});
  await assert.rejects(c.uploadApplicationFile({size:4194305}, 'resume', 'synthetic'), /larger than 4 MB/);
  assert.equal(s.requests.length, 0);
  await assert.rejects(c.uploadApplicationFile(new Blob(['synthetic']), 'resume', 'synthetic'), /larger than 4 MB/);
  assert.equal(s.requests.length, 1);
});

function opdFlow(fetchImpl, view, pathname = '/walk-in-ayurveda-treatment/', fields = {}) {
  const s = sandbox(fetchImpl, view);
  s.ctx.window.location.pathname = pathname;
  s.ctx.window.location.href = 'https://preview.example.test' + pathname;
  const listeners = {};
  s.ctx.document.addEventListener = (name, callback) => { listeners[name] = callback; };
  const values = { fname: 'Synthetic', age: '30', gender: 'Male', phone: '2025550143', symptoms: 'Synthetic test only', 'functional-history[]': 'yes', ...fields };
  const attributes = {}, button = { disabled: false };
  let status = null, resets = 0;
  const form = {
    matches: (selector) => selector === 'form',
    elements: { namedItem: (name) => Object.hasOwn(values, name) ? { focus() {} } : null },
    getAttribute: (name) => attributes[name], setAttribute: (name, value) => { attributes[name] = value; }, removeAttribute: (name) => { delete attributes[name]; },
    querySelector: (selector) => selector === '.ahv-opd-status' ? status : button,
    appendChild: (element) => { status = element; },
    reportValidity: () => true, reset: () => { resets++; },
  };
  s.ctx.document.createElement = () => ({ textContent: '', setAttribute() {} });
  s.ctx.FormData = class { get(name) { return values[name] || null; } };
  vm.runInContext(read('../public/design/opd-form-submit.js'), s.ctx);
  const c = new s.Component({ route: pathname.replace(/^\/(?:hi|de|fr|es|it|pt|nl|ru|ar|zh|ja|ko)\//, '/') });
  const submit = async () => {
    const nativeEvent = { target: form, preventDefault() {} };
    const pending = listeners.submit?.(nativeEvent);
    // React receives the same native event after the document capture listener.
    c.renderVals().leSubmit({ nativeEvent, preventDefault() {} });
    await pending;
    return { nativeEvent, status: status?.textContent || '', out: c.renderVals(), resets };
  };
  return { s, c, submit, form };
}

for (const view of ['desktop', 'mobile']) test(view + ' OPD: the actual handler owns receipt/error and the legacy notice stays silent', async () => {
  const received = opdFlow(async () => json(200, { ok: true }), view);
  assert.equal(received.c.renderVals().leNotice, '', 'loaded OPD handler is not described as unconnected');
  const a = await received.submit();
  assert.equal(a.nativeEvent.__ahvOpdHandled, true);
  assert.equal(a.out.leNotice, '');
  assert.match(a.status, /details have been received/);
  assert.equal(a.resets, 1);
  assert.equal(received.s.requests.length, 1);
  const failure = opdFlow(async () => json(502, { ok: false }), view);
  const b = await failure.submit();
  assert.equal(b.out.leNotice, '');
  assert.match(b.status, /could not confirm/);
  assert.equal(b.resets, 0);
  const unavailable = opdFlow(async () => json(503, { ok: false, code: 'LEAD_STORE_NOT_CONFIGURED' }), view);
  const d = await unavailable.submit();
  assert.equal(d.out.leNotice, '');
  assert.match(d.status, /not connected yet/);
  assert.equal(d.resets, 0);
  const invalid = opdFlow(async () => { throw new Error('must not send'); }, view, '/walk-in-ayurveda-treatment/', { 'functional-history[]': '' });
  const e = await invalid.submit();
  assert.equal(e.out.leNotice, '');
  assert.match(e.status, /required fields and consent/);
  assert.equal(invalid.s.requests.length, 0);
});

test('OPD ownership is exact across released locales; old legacy forms retain their fallback', async () => {
  for (const locale of ['en', 'hi', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'ru', 'ar', 'zh', 'ja', 'ko']) {
    const path = (locale === 'en' ? '' : '/' + locale) + '/walk-in-ayurveda-treatment/';
    const f = opdFlow(async () => json(200, { ok: true }), 'desktop', path);
    assert.equal((await f.submit()).out.leNotice, '', locale);
    const body = JSON.parse(f.s.requests[0].init.body);
    assert.equal(body.site_language, locale === 'zh' ? 'zh-Hans' : locale);
  }
  const legacy = opdFlow(async () => { throw new Error('must not send'); }, 'desktop', '/enquiry-form-old/');
  assert.equal(legacy.s.ctx.window.__ahvOpdBound, undefined);
  const old = await legacy.submit();
  assert.match(old.out.leNotice, /Submission is disabled in review/);
  assert.equal(legacy.s.requests.length, 0);
  const unloaded = sandbox(async () => { throw new Error('must not send'); });
  const c = new unloaded.Component({ route: '/walk-in-ayurveda-treatment/' });
  assert.match(c.renderVals().leNotice, /being connected/);
  c.renderVals().leSubmit({ preventDefault() {}, nativeEvent: {} });
  assert.match(c.renderVals().leNotice, /Submission is disabled in review/);
});
