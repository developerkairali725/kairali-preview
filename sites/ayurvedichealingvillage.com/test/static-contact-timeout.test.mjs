import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../app/(english)/_families/static-design-view.tsx', import.meta.url), 'utf8');
const script = source.slice(source.indexOf('  var form = host.querySelector(\'form[data-form="contact"]\');'), source.indexOf('\n})();`;')).replaceAll('\\\\', '\\');

function harness() {
  let now = 0, nextId = 0;
  const timers = new Map(), listeners = {}, requests = [], attributes = {};
  const status = { textContent: '' };
  const values = { fname: 'Synthetic', country_code: '+1', phone: '2025550147', email: 'test@example.com', message: 'Synthetic test' };
  const form = {
    elements: { namedItem: () => ({ setAttribute() {}, removeAttribute() {}, focus() {} }) },
    querySelector: () => status,
    addEventListener: (event, fn) => { listeners[event] = fn; },
    setAttribute: (key, value) => { attributes[key] = value; },
    removeAttribute: (key) => { delete attributes[key]; },
  };
  const context = {
    host: { querySelector: () => form }, location: { hash: '', href: 'https://example.test/contact-us/' },
    document: { referrer: '' },
    window: { AHV_LEAD_RECEIPT: { attribution: () => ({}), canonicalOption: () => '', siteLanguage: () => 'en' } },
    FormData: class { get(key) { return values[key] || ''; } },
    Blob, AbortController, crypto: { randomUUID: () => 'ffbaf628-437e-44c3-ba1f-e6e386fb3de9' },
    setTimeout: (fn, ms) => { const id = ++nextId; timers.set(id, { at: now + ms, fn }); return id; },
    clearTimeout: (id) => timers.delete(id),
    fetch: (url, init) => new Promise((resolve, reject) => {
      requests.push({ url, init, resolve });
      init.signal.addEventListener('abort', () => reject(new Error('aborted')));
    }),
  };
  vm.runInNewContext('(function () {\n' + script + '\n})();', context);
  return {
    requests, status, values, attributes,
    submit: () => listeners.submit({ preventDefault() {} }),
    advance: (ms) => { now += ms; for (const [id, timer] of timers) if (timer.at <= now) { timers.delete(id); timer.fn(); } },
  };
}

test('contact waits for a slow valid acknowledgement and blocks a double click', async () => {
  const h = harness();
  const pending = h.submit();
  await h.submit();
  assert.equal(h.requests.length, 1);
  h.advance(16000);
  assert.equal(h.requests[0].init.signal.aborted, false);
  assert.equal(h.status.textContent, 'Sending…');
  h.requests[0].resolve({ ok: true, status: 200, json: async () => ({ ok: true }) });
  await pending;
  assert.equal(h.status.textContent, 'Thank you — your details have been received.');
  assert.equal(h.attributes['aria-busy'], undefined);
});

test('contact eventually times out, retains details, and reuses the token on retry', async () => {
  const h = harness();
  const pending = h.submit();
  h.advance(45000);
  await pending;
  assert.equal(h.requests[0].init.signal.aborted, true);
  assert.match(h.status.textContent, /could not confirm/);
  assert.equal(h.values.email, 'test@example.com');
  const retry = h.submit();
  const firstBody = JSON.parse(await h.requests[0].init.body.text());
  const retryBody = JSON.parse(await h.requests[1].init.body.text());
  assert.equal(retryBody.submissionToken, firstBody.submissionToken);
  h.requests[1].resolve({ ok: true, status: 200, json: async () => ({ ok: true }) });
  await retry;
  assert.match(h.status.textContent, /have been received/);
});
