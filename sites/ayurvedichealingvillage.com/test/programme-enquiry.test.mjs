import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { programmeEnquiryComponent, programmeViews, integrateProgrammeView } from '../tools/build-programme-enquiry.mjs';
import { htmlUnits, jsUnits } from '../tools/l10n/lib.mjs';
import { orderedRuntimeScripts } from '../app/(english)/_families/runtime-script-order.mjs';

const read = file => fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const enquiry = JSON.parse(read('public/ahv/views/ahv-page-enquiry-desktop.json'));
const component = read('public/ahv/components/AHV Programme Enquiry.dc.html');
const logic = component.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];

test('programme form is generated from the accepted enquiry form without page metadata or new visible copy', () => {
  assert.equal(component, programmeEnquiryComponent(enquiry));
  assert.ok(component.includes(enquiry.template.match(/<form data-form="contact"[\s\S]*?<\/form>/)[0]));
  assert.doesNotMatch(component, /applyHead|<h1\b|rel="canonical"|AHV Chrome/);
  const existing = new Set([...htmlUnits(enquiry.template), ...jsUnits(enquiry.logic).units].map(u => u.source));
  for (const unit of htmlUnits(component)) assert.ok(existing.has(unit.source), 'new copy: ' + unit.source);
});

test('held Weight views retain production contact links and cannot be reintegrated by the builder', () => {
  assert.deepEqual(programmeViews, []);
  for (const variant of ['desktop', 'mobile']) {
    const view = JSON.parse(read(`public/ahv/views/ahv-page-weight-loss-programme-${variant}.json`));
    const before = structuredClone(view);
    assert.deepEqual(view.scripts, []);
    assert.doesNotMatch(view.template, /AHV Programme Enquiry|#programme-enquiry/);
    assert.match(view.template, /href="https:\/\/ayurvedichealingvillage\.com\/enquiry-form\/"/);
    assert.throws(() => integrateProgrammeView(view), /held at its production baseline/);
    assert.deepEqual(view, before, 'rejected generation cannot mutate the retained view');
    assert.match(view.logic, /villaData/);
    assert.match(view.logic, /₹[0-9]/);
    assert.deepEqual(orderedRuntimeScripts(view, { previewSrc: '/preview.js', supportSrc: '/support.js' }, false).map(x => x.src), ['/preview.js', '/support.js']);
  }
});

test('programme integration behavior stays available for an explicitly unheld fixture', () => {
  const view = { id: 'fixture-unheld-programme', scripts: [], template: '<nav aria-label="On this page"></nav><a href="https://ayurvedichealingvillage.com/enquiry-form/">Enquire</a>', logic: 'unchanged fixture logic' };
  const before = structuredClone(view), integrated = integrateProgrammeView(view);
  assert.deepEqual(view, before, 'integration keeps its input immutable');
  assert.equal(integrated.template.match(/name="AHV Programme Enquiry"/g)?.length, 1);
  assert.ok(integrated.template.indexOf('name="AHV Programme Enquiry"') < integrated.template.indexOf('<nav aria-label="On this page"'));
  assert.ok(integrated.template.includes('href="#programme-enquiry"'));
  assert.equal(integrated.logic, view.logic);
  assert.deepEqual(integrated.scripts, ['/ahv/assets/enquiry-family-data.js', '/ahv/assets/enquiry-family-render.js']);
  assert.deepEqual(integrateProgrammeView(integrated), integrated, 'idempotence for unheld inputs');
});

// The Digestive candidate carries the approved inline enquiry form frozen at c35727ec4 (Final-E capture 2190d657).
// The builder still refuses to regenerate it, so the frozen bytes cannot drift.
test('Digestive views keep the frozen approved inline enquiry form and cannot be reintegrated by the builder', () => {
  for (const variant of ['desktop', 'mobile']) {
    const view = JSON.parse(read(`public/ahv/views/ahv-page-digestive-wellness-gut-health-${variant}.json`));
    const before = structuredClone(view);
    assert.deepEqual(view.scripts, ['/ahv/assets/enquiry-family-data.js', '/ahv/assets/enquiry-family-render.js']);
    assert.equal(view.template.match(/name="AHV Programme Enquiry"/g)?.length, 1);
    assert.ok(view.template.indexOf('name="AHV Programme Enquiry"') < view.template.indexOf('<nav aria-label="On this page"'));
    assert.ok(view.template.includes('href="#programme-enquiry"'));
    assert.doesNotMatch(view.template, /href="https:\/\/ayurvedichealingvillage\.com\/enquiry-form\/"/);
    assert.throws(() => integrateProgrammeView(view), /held at its production baseline/);
    assert.deepEqual(view, before, 'rejected generation cannot mutate the frozen view');
    assert.deepEqual(orderedRuntimeScripts(view, { previewSrc: '/preview.js', supportSrc: '/support.js' }, false).map(x => x.src),
      ['/preview.js', '/design/lead-receipt.js', '/ahv/assets/enquiry-family-data.js', '/ahv/assets/enquiry-family-render.js', '/support.js']);
  }
});

function harness() {
  const requests = [], timers = new Map();
  let now = 0, nextTimer = 0;
  const document = { referrer: '', documentElement: { lang: 'de' }, querySelector: () => null };
  const location = { pathname: '/de/gewichtsverlust-programm/', href: 'https://example.test/de/gewichtsverlust-programm/', search: '' };
  const window = { document, location, AHV_LEAD_RECEIPT: {
    canonicalOption: (_kind, index) => ['','Weight Management'][index] || '',
    attribution: () => ({ utm_source: 'approved-stored-source', gbraid: 'approved-attribution' }),
    siteLanguage: () => 'de',
    contactIntro: () => 'Name, country code, phone and email are required.',
  } };
  const context = { window, document, location, URLSearchParams, Blob, AbortController,
    crypto: globalThis.crypto,
    React: { createElement: () => null },
    DCLogic: class { setState(update) { this.state = { ...this.state, ...(typeof update === 'function' ? update(this.state) : update) }; } },
    setTimeout: (fn, ms) => { const id = ++nextTimer; timers.set(id, { fn, at: now + ms }); return id; },
    clearTimeout: id => timers.delete(id),
    fetch: (url, init) => new Promise((resolve, reject) => {
      requests.push({ url, init, resolve });
      init.signal.addEventListener('abort', () => reject(new Error('aborted')));
    }),
  };
  vm.createContext(context);
  for (const file of ['public/ahv/assets/enquiry-family-data.js', 'public/ahv/assets/enquiry-family-render.js']) vm.runInContext(read(file), context);
  const Component = vm.runInContext(logic + '\n;Component', context);
  const controller = new Component();
  controller.state.cv = { fname: 'Synthetic', country_code: '+1', phone: '2025550147', programme: '', email: 'synthetic@example.invalid', message: 'Synthetic test only' };
  const submit = () => controller.renderVals().contactSubmit({ preventDefault() {} });
  return { controller, requests, submit, advance: ms => { now += ms; for (const [id, timer] of timers) if (timer.at <= now) { timers.delete(id); timer.fn(); } } };
}
const response = (status, data) => ({ ok: status >= 200 && status < 300, status, json: async () => data });

test('required fields reject before transport; page attribution and canonical contact schema are preserved', async () => {
  const h = harness();
  assert.equal(h.controller.renderVals().C.form.sub, 'Name, country code, phone and email are required.');
  h.controller.state.cv.country_code = '';
  await h.submit();
  assert.equal(h.requests.length, 0);
  assert.equal(h.controller.state.cErr.country_code, true);
  h.controller.renderVals().cSet({ target: { name: 'country_code', value: '+1' } });
  const pending = h.submit();
  const payload = JSON.parse(await h.requests[0].init.body.text());
  assert.equal(h.requests[0].url, '/api/lead/');
  assert.equal(payload.form, 'contact');
  assert.equal(payload.site_language, 'de');
  assert.equal(payload.utm_source, 'approved-stored-source');
  assert.equal(payload.gbraid, 'approved-attribution');
  assert.equal(payload.lead_source_url, 'https://example.test/de/gewichtsverlust-programm/');
  assert.deepEqual(Object.keys(payload.fields).sort(), ['countrycode','email','full_name','message','phone','programme']);
  h.requests[0].resolve(response(200, { ok: true }));
  await pending;
  assert.equal(h.controller.state.cValid, true);
});

test('slow acknowledgement waits 45 seconds, blocks duplicate sends and keeps retry identity', async () => {
  const h = harness();
  const pending = h.submit();
  await h.submit();
  assert.equal(h.requests.length, 1);
  h.advance(16000);
  assert.equal(h.requests[0].init.signal.aborted, false);
  h.advance(29000);
  await pending;
  assert.equal(h.requests[0].init.signal.aborted, true);
  assert.match(h.controller.state.cNotice, /could not confirm/);
  assert.equal(h.controller.state.cv.email, 'synthetic@example.invalid');
  const retry = h.submit();
  const first = JSON.parse(await h.requests[0].init.body.text()), second = JSON.parse(await h.requests[1].init.body.text());
  assert.equal(first.submissionToken, second.submissionToken);
  h.requests[1].resolve(response(200, { ok: true }));
  await retry;
  assert.equal(h.controller.state.cValid, true);
});

for (const status of [502, 503, 429]) test(`intercepted ${status} retains fields and never reports receipt`, async () => {
  const h = harness();
  const pending = h.submit();
  h.requests[0].resolve(response(status, { ok: false, code: status === 503 ? 'LEAD_STORE_NOT_CONFIGURED' : 'STORE_FAILED' }));
  await pending;
  assert.equal(h.controller.state.cValid, false);
  assert.equal(h.controller.state.cPending, status === 503);
  assert.equal(h.controller.state.cv.email, 'synthetic@example.invalid');
  assert.doesNotMatch(h.controller.state.cNotice, /have been received/);
});
