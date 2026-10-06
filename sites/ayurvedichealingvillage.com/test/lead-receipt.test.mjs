import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const receiptScript = readFileSync(new URL('../public/design/lead-receipt.js', import.meta.url), 'utf8');
const confirmationScript = readFileSync(new URL('../public/ahv/assets/confirmation-family-render.js', import.meta.url), 'utf8');
const enquiryScript = readFileSync(new URL('../public/ahv/assets/enquiry-family-render.js', import.meta.url), 'utf8');
const token = '545404ff-a177-4f93-b5ab-10b90ee90d58';

function page(path, { store = new Map(), status = 200, body = { ok: true, status: 'received' }, lang = 'en' } = {}) {
  const navigations = [];
  const timers = [];
  const location = {
    href: `https://ayurvedichealingvillage.com${path}`,
    origin: 'https://ayurvedichealingvillage.com',
    pathname: path,
    search: '',
    assign: (target) => navigations.push(target),
  };
  const storage = {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, value),
    removeItem: (key) => store.delete(key),
  };
  const context = {
    window: { fetch: async () => ({ status, clone: () => ({ json: async () => body }) }) },
    location,
    sessionStorage: storage,
    document: { documentElement: { lang } },
    setTimeout: (fn) => { timers.push(fn); return timers.length; },
    URL,
    URLSearchParams,
    Date,
  };
  runInNewContext(receiptScript, context);
  return { context, store, timers, navigations };
}

async function submit(view, form) {
  await view.context.window.fetch('/api/lead/', {
    method: 'POST',
    body: JSON.stringify({ form, submissionToken: token }),
  });
  view.timers.forEach((timer) => timer());
}

test('accepted German contact redirects in the route language and is one-use', async () => {
  const sender = page('/de/kontakt/', { lang: 'en' }); // Chrome Translate changed lang.
  await submit(sender, 'contact');
  assert.deepEqual(sender.navigations, ['/de/contact-us/thank-you/']);

  const destination = page('/de/contact-us/thank-you/', { store: sender.store });
  destination.context.window.AHV_CONFIRM = {
    routes: [{ path: '/contact-us/thank-you/', slug: 'contact-us/thank-you' }], images: {},
  };
  runInNewContext(confirmationScript, destination.context);
  const render = destination.context.window.AHV_CONFIRM_RENDER;
  assert.equal(render.resolveRoute('/contact-us/thank-you/').path, '/contact-us/thank-you/');
  assert.equal(render.resolveReceipt(), true);
  destination.context.location.pathname = '/de/ppc-thanks/';
  assert.equal(render.resolveReceipt(), false);
  assert.equal(destination.context.window.AHV_LEAD_RECEIPT.consume('/de/ppc-thanks/'), null);
  destination.context.location.pathname = '/de/contact-us/thank-you/';
  assert.equal(render.resolveReceipt(), false);

  const refresh = page('/de/contact-us/thank-you/', { store: sender.store });
  runInNewContext(confirmationScript, refresh.context);
  assert.equal(refresh.context.window.AHV_CONFIRM_RENDER.resolveReceipt(), false);
});

test('failed, direct and query-only visits never claim a receipt', async () => {
  const failed = page('/contact-us/', { status: 502, body: { ok: false } });
  await submit(failed, 'contact');
  assert.deepEqual(failed.navigations, []);
  const direct = page('/contact-us/thank-you/');
  direct.context.location.search = '?receipt=prototype';
  runInNewContext(confirmationScript, direct.context);
  assert.equal(direct.context.window.AHV_CONFIRM_RENDER.resolveReceipt('prototype'), false);
});

test('French application uses its released thank-you alias with application copy', async () => {
  const sender = page('/fr/apply-now/');
  await submit(sender, 'apply-now');
  assert.deepEqual(sender.navigations, ['/fr/remerciers/']);
  const destination = page('/fr/remerciers/', { store: sender.store });
  destination.context.window.AHV_CONFIRM = {
    routes: [{ path: '/thanks/', variant: 'next-steps', metadata: { og: {} } }], images: {},
  };
  runInNewContext(confirmationScript, destination.context);
  const route = destination.context.window.AHV_CONFIRM_RENDER.resolveRoute('/thanks/');
  assert.equal(route.variant, 'image-receipt');
  assert.match(route.h1, /candidature/);
  assert.equal(destination.context.window.AHV_CONFIRM_RENDER.resolveReceipt(), true);
});

test('the Contact required-fields note remains truthful in a translated route', () => {
  const view = page('/de/kontakt/', { lang: 'en' });
  view.context.window.AHV_ENQUIRY = {
    routes: [{ path: '/contact-us/', form: { sub: 'Everything else is optional.' } }],
  };
  runInNewContext(enquiryScript, view.context);
  const route = view.context.window.AHV_ENQUIRY_RENDER.resolveRoute('/contact-us/');
  assert.match(route.form.sub, /E-Mail-Adresse/);
  assert.match(route.form.sub, /Telefonnummer/);
});


test('legacy forms retain the first safe nonempty paid parameter and use consent-aware session attribution', () => {
  const view = page('/pain-management.html');
  view.context.location.search = '?utm_campaign=&utm_campaign=Brand+%26+Competition&gclid=&gclid=paid123&email=private%40example.com';
  const attribution = view.context.window.AHV_LEAD_RECEIPT.attribution();
  assert.deepEqual(JSON.parse(JSON.stringify(attribution)), {gclid:'paid123',utm_campaign:'Brand & Competition'});
  view.context.window.AHV_MEASUREMENT = {attribution: () => ({utm_campaign:'Prior consented campaign'})};
  assert.equal(view.context.window.AHV_LEAD_RECEIPT.attribution().utm_campaign, 'Prior consented campaign');
});
