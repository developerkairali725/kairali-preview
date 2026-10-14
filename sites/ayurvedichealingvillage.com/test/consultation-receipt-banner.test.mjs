// Owner report 14 Oct 2026 (F1): the verified /onlineconsultation-thanks/ receipt showed the legacy
// poster (message baked into the image) plus a "Text of the poster" box repeating it. The receipt now
// keeps the clean landscape banner, renders the route's own recorded (already localized) lines as a
// real H1 and paragraph, and drops the poster and transcript. Direct visits and refreshes are unchanged.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const receiptScript = read('public/design/lead-receipt.js');
const renderScript = read('public/ahv/assets/confirmation-family-render.js');
const dataScript = read('public/ahv/assets/confirmation-family-data.js');
const views = ['mobile', 'desktop'].map((variant) => [variant, JSON.parse(read(`public/ahv/views/ahv-page-confirmation-${variant}.json`))]);
const token = '545404ff-a177-4f93-b5ab-10b90ee90d58';

function page(path, receipt) {
  const store = new Map();
  if (receipt) store.set('ahv:lead-receipt:v1', JSON.stringify({ form: receipt.form, token, lang: receipt.lang || 'en', path, at: Date.now() - 1000 }));
  const context = {
    window: {},
    location: { href: `https://ayurvedichealingvillage.com${path}`, origin: 'https://ayurvedichealingvillage.com', pathname: path, search: '' },
    sessionStorage: { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v), removeItem: (k) => store.delete(k) },
    document: { documentElement: { lang: 'en' } },
    setTimeout() {}, URL, URLSearchParams, Date, JSON, Object, Array, String,
  };
  runInNewContext(receiptScript, context);
  runInNewContext(dataScript, context);
  runInNewContext(renderScript, context);
  return context;
}

function renderVals(context, view, route) {
  const React = { createElement: (type, props) => ({ type, props }) };
  context.React = React;
  context.DCLogic = class { constructor(props) { this.props = props; } };
  const Component = runInNewContext(`${view.logic}\nComponent`, context);
  return new Component({ route, prototypeReceipt: false }).renderVals();
}

test('verified consultation receipt: real heading and message, clean banner, no poster or transcript (both views)', () => {
  for (const [variant, view] of views) {
    const ctx = page('/onlineconsultation-thanks/', { form: 'online-consultation' });
    const out = renderVals(ctx, view, '/onlineconsultation-thanks/');
    assert.equal(out.isImage, true, variant);
    assert.equal(out.isDirect, false, variant);
    assert.equal(out.h1, 'Thank You', variant);
    assert.equal(out.hasBody, true, variant);
    assert.equal(out.bodyText, 'We will get back to you soon', variant);
    assert.equal(out.hasTranscript, false, variant);
    assert.equal(out.hasPoster, false, variant);
    assert.equal(out.noPoster, true, variant);
    assert.equal(out.posterEl, null, variant);
    // The clean banner is the template's fixed landscape hero; the baked-text poster is gated off.
    const imageBranch = view.template.slice(view.template.indexOf('data-variant="image-receipt"'));
    assert.ok(imageBranch.indexOf('AHV-Confirm-Landscape-1440.webp') > 0 && imageBranch.indexOf('AHV-Confirm-Landscape-1440.webp') < imageBranch.indexOf('{{ h1 }}'), variant);
    const gate = imageBranch.indexOf('<sc-if value="{{ hasPoster }}"');
    assert.ok(gate > 0 && gate < imageBranch.indexOf('{{ posterEl }}') && imageBranch.indexOf('{{ transcript.heading }}') > gate, variant);
    assert.match(imageBranch, /<sc-if value="\{\{ noPoster \}\}"[^>]*><div style="height:(56|88)px"><\/div><\/sc-if>/, variant);
  }
});

test('the consultation receipt reuses the localized route lines and stays on the same route data', () => {
  const ctx = page('/de/onlineconsultation-thanks/', { form: 'online-consultation', lang: 'de' });
  const route = { path: '/onlineconsultation-thanks/', variant: 'image-receipt', h1: 'Danke für Ihre Online-Konsultation', poster: 'poster', metadata: { title: 'T', robots: 'noindex, follow', og: {} },
    transcript: { heading: 'Text des Posters', lines: ['Vielen Dank', 'Kairali - The Ayurvedic Healing Village', 'wir melden uns in Kürze bei Ihnen'] } };
  const item = ctx.window.AHV_LEAD_RECEIPT.consume('/de/onlineconsultation-thanks/');
  const result = ctx.window.AHV_LEAD_RECEIPT.personalize(route, item, {});
  assert.equal(result.h1, 'Vielen Dank');
  assert.equal(result.body.text, 'Wir melden uns in Kürze bei Ihnen');
  assert.equal(result.posterImage, false);
  assert.equal(result.transcript, null);
  assert.equal(result.metadata, route.metadata, 'noindex head metadata is untouched');
  // A route without the recorded lines is returned unchanged rather than inventing copy.
  const bare = { path: '/onlineconsultation-thanks/', variant: 'image-receipt', h1: 'X', metadata: {} };
  assert.equal(ctx.window.AHV_LEAD_RECEIPT.personalize(bare, item, {}), bare);
});

test('direct visits and refreshes stay neutral; the receipt is one-use', () => {
  for (const [variant, view] of views) {
    const direct = renderVals(page('/onlineconsultation-thanks/'), view, '/onlineconsultation-thanks/');
    assert.equal(direct.isDirect, true, variant);
    assert.equal(direct.isImage, false, variant);
    const ctx = page('/onlineconsultation-thanks/', { form: 'online-consultation' });
    assert.equal(renderVals(ctx, view, '/onlineconsultation-thanks/').isImage, true, variant);
    const reload = page('/onlineconsultation-thanks/');
    assert.equal(renderVals(reload, view, '/onlineconsultation-thanks/').isDirect, true, variant);
  }
});

test('application and OPD receipts keep their existing clean landscape image', () => {
  for (const [form, re] of [['apply-now', /application/], ['opd', /OPD/]]) {
    const ctx = page('/thanks/', { form });
    const out = renderVals(ctx, views[0][1], '/thanks/');
    assert.equal(out.isImage, true, form);
    assert.match(out.h1, re, form);
    assert.equal(out.hasPoster, true, form);
    assert.equal(out.poster.src, '/ahv/assets/img/AHV-Confirm-Landscape-1024.webp', form);
  }
});

test('no receipt path sends anything: personalize is display-only', () => {
  assert.doesNotMatch(receiptScript.slice(receiptScript.indexOf('function consultationReceipt'), receiptScript.indexOf('function personalize')), /fetch|recordLead|sendBeacon|AHV_MEASUREMENT/);
});
