import test from 'node:test';
import assert from 'node:assert/strict';
import { assertCapturePage, captureFormSelector, captureContentRequirements, inspectCapturePage, createCaptureEvaluation } from '../tools/capture-page-guard.mjs';
const complete = { errors: [], heading: 'Contact us', bodyChars: 1200, requiredForm: true, requiredContent: true, forbiddenContent: false };

test('serialized proof cannot omit metrics or content-state booleans', () => {
  for (const key of ['bodyChars', 'requiredContent', 'forbiddenContent']) {
    const partial = { ...complete }; delete partial[key];
    assert.throws(() => assertCapturePage(partial, '/about-us/'), /Malformed/);
  }
});

const digestiveRoute = '/digestive-wellness-gut-health-yoga-therapy/';
const contactPaths = {
  en: '/contact-us/', hi: '/hi/contact-us/', de: '/de/kontakt/', fr: '/fr/contactez-nous/',
  es: '/es/contact-us/', it: '/it/contact-us/', pt: '/pt/contact-us/', nl: '/nl/contact-us/',
  ru: '/ru/contact-us/', ar: '/ar/contact-us/', 'zh-Hans': '/zh/contact-us/', ja: '/ja/contact-us/', ko: '/ko/contact-us/',
};
function digestiveProof(locale = 'en', { hrefs = [contactPaths[locale]], chromeHrefs = [], actions = ['/api/newsletter'], bodyActions = [], sections = 0, empty = false, noHeading = false, error = false } = {}, route = digestiveRoute) {
  const root = fixtureRoot(error), content = fixtureRoot();
  const originalQuery = root.querySelectorAll.bind(root), contentQuery = content.querySelectorAll.bind(content);
  const anchors = list => list.map(href => ({ getAttribute: name => name === 'href' ? href : null }));
  root.querySelectorAll = selector => {
    if (selector === 'a[href]') return anchors([...hrefs, ...chromeHrefs]);
    if (selector === 'form') return actions.map(action => ({ getAttribute: name => name === 'action' ? action : null }));
    if (selector === '#programme-enquiry') return Array.from({ length: sections }, () => ({}));
    if (selector === 'h1' && noHeading) return [];
    return originalQuery(selector);
  };
  content.querySelectorAll = selector => selector === 'a[href]' ? anchors(hrefs) : selector === 'form' ? bodyActions.map(action => ({ getAttribute: () => action })) : contentQuery(selector);
  if (empty) content.textContent = '';
  root.cloneNode = () => content;
  return inspectCapturePage({ ...captureContentRequirements(route, {}, locale), rootElement: root });
}

// Restores the approved c35727ec4 inline-form contract for Digestive alone.
// Weight remains held and keeps the adversarial external-contact tests below.
test('Digestive capture requires exactly one populated programme contact form in every locale', () => {
  for (const locale of [null, undefined, ...Object.keys(contactPaths)]) {
    const requirements = captureContentRequirements(digestiveRoute, {}, locale);
    assert.deepEqual(requirements, { formSelector: '#programme-enquiry form[data-form="contact"]', formCount: 1 });
    assert.equal(captureFormSelector(digestiveRoute), requirements.formSelector);
    for (const [count, populated] of [[0, false], [1, false], [1, true], [2, true]]) {
      const root = fixtureRoot(), query = root.querySelectorAll.bind(root);
      const form = { querySelector: () => populated ? { tagName: 'INPUT' } : null };
      root.querySelector = selector => selector === requirements.formSelector && count ? form : null;
      root.querySelectorAll = selector => selector === requirements.formSelector ? Array.from({ length: count }, () => form) : query(selector);
      const proof = inspectCapturePage({ ...requirements, rootElement: root });
      if (count === 1 && populated) assert.doesNotThrow(() => assertCapturePage(proof, digestiveRoute));
      else assert.throws(() => assertCapturePage(proof, digestiveRoute), /page form/);
    }
  }
});

test('Digestive cannot accept an obsolete held-contact proof or incomplete content', () => {
  assert.throws(() => assertCapturePage({ ...complete, retainedDigestiveContact: { id: 'ahv-digestive-production-contact-v1' } }, digestiveRoute), /Unexpected held programme/);
  for (const change of [{ requiredForm: false }, { heading: '' }, { bodyChars: 0 }, { errors: ['Component import failed'] }]) {
    assert.throws(() => assertCapturePage({ ...complete, ...change }, digestiveRoute));
  }
});

function fixtureRoot(importFailure = false) {
  const failure = { textContent: 'Component import failed', querySelector: () => null };
  return {
    textContent: 'Substantive page content. '.repeat(12),
    hasAttribute: () => false,
    querySelectorAll(selector) {
      if (selector === 'h1') return [{ textContent: 'Contact us' }];
      if (importFailure && selector.split(',').includes('.sc-placeholder-error')) return [failure];
      return [];
    },
    querySelector: () => null,
    cloneNode() { return this; },
  };
}

test('component import placeholders are rejected by the actual DOM inspector', () => {
  globalThis.document = { getElementById: () => fixtureRoot(true) };
  try { assert.throws(() => assertCapturePage(inspectCapturePage(), '/contact-us/'), /Component import failed/); }
  finally { delete globalThis.document; }
});

test('proof and extraction finish before a queued DOM mutation can run', async () => {
  const root = fixtureRoot();
  const get = root.querySelectorAll.bind(root);
  root.querySelectorAll = (selector) => {
    queueMicrotask(() => { root.textContent = 'Late error'; });
    return get(selector);
  };
  globalThis.document = { getElementById: () => root, createElement: () => ({ content: { firstElementChild: fixtureRoot() } }) };
  try {
    const evaluate = createCaptureEvaluation(() => ({ html: document.getElementById('ahv-design-root').textContent }));
    const { contentProof, got } = evaluate({});
    assertCapturePage(contentProof, '/about-us/');
    assert.equal(got.html, 'Substantive page content. '.repeat(12));
    await Promise.resolve();
    assert.equal(root.textContent, 'Late error');
  } finally { delete globalThis.document; }
});

test('extracted body is independently checked after rendering transforms', () => {
  const live = fixtureRoot(), saved = fixtureRoot();
  saved.textContent = '';
  saved.querySelectorAll = () => [];
  globalThis.document = { getElementById: () => live, createElement: () => ({ content: { firstElementChild: saved } }) };
  try {
    const { liveContentProof, contentProof } = createCaptureEvaluation(() => ({ html: '<header>Shell only</header>' }))({});
    assert.doesNotThrow(() => assertCapturePage(liveContentProof, '/about-us/'));
    assert.throws(() => assertCapturePage(contentProof, '/about-us/'), /H1/);
  } finally { delete globalThis.document; }
});

test('caught component errors cannot pass even when chrome and a readiness marker exist', () => {
  assert.throws(() => assertCapturePage({ ...complete, errors: ["Root: Cannot read properties of undefined (reading 'canonicalOption')"] }, '/contact-us/'), /Rendered component error/);
});

test('a vacancy closed by source requires its closed notice and no application form', () => {
  assert.deepEqual(captureContentRequirements('/jobs/business-development-manager/', { closed: true, applicationsOpen: false }),
    { formSelector: null, requiredSelector: '[data-job-closed="true"]', forbiddenSelector: 'form[data-form="job"]' });
  assert.deepEqual(captureContentRequirements('/jobs/business-development-manager/', { closed: false, applicationsOpen: true }), { formSelector: 'form[data-form="job"]' });
  assert.throws(() => assertCapturePage({ ...complete, requiredContent: false }, '/jobs/business-development-manager/'), /required page state/);
  assert.throws(() => assertCapturePage({ ...complete, forbiddenContent: true }, '/jobs/business-development-manager/'), /Unexpected page state/);
});
test('page heading, non-navigation body and required form must each exist', () => {
  assert.throws(() => assertCapturePage({ ...complete, heading: '' }, '/contact-us/'), /H1/);
  assert.throws(() => assertCapturePage({ ...complete, bodyChars: 0 }, '/contact-us/'), /page body/);
  assert.throws(() => assertCapturePage({ ...complete, requiredForm: false }, '/contact-us/'), /page form/);
  assert.doesNotThrow(() => assertCapturePage(complete, '/contact-us/'));
  assert.equal(captureFormSelector('/contact-us/'), 'form[data-form="contact"]');
  assert.equal(captureFormSelector('/online-consultation/'), 'form[data-step="1"]');
  assert.equal(captureFormSelector('/about-us/'), null);
});

const weightRoute = '/weight-loss-programme/';
test('held Weight preserves its external contact contract in all13 locales', () => {
  for (const [locale, path] of Object.entries(contactPaths)) {
    const requirements = captureContentRequirements(weightRoute, {}, locale);
    assert.equal(requirements.formSelector, null);
    assert.equal(requirements.retainedWeightContact.id, 'ahv-weight-production-contact-v1');
    assert.equal(requirements.retainedWeightContact.path, path);
    for (const href of [path, `https://ayurvedichealingvillage.com${path}`, `${path}?programme=treatment`]) {
      assert.doesNotThrow(() => assertCapturePage(digestiveProof(locale, { hrefs: [href] }, weightRoute), weightRoute));
    }
  }
  assert.equal(captureFormSelector(weightRoute), null);
});
test('held Weight rejects inline form, dead anchor, wrong destination and bodyless page', () => {
  for (const options of [{ actions: ['/api/lead/'] }, { bodyActions: ['/api/newsletter'] }, { sections: 1 }, { hrefs: ['#programme-enquiry'] }, { hrefs: ['/de/kontakt/'] }, { hrefs: ['https://foreign.test/contact-us/'] }, { hrefs: [] }, { empty: true }, { noHeading: true }]) {
    assert.throws(() => assertCapturePage(digestiveProof('en', options, weightRoute), weightRoute));
  }
  const weight = digestiveProof('en', {}, weightRoute);
  assert.throws(() => assertCapturePage(weight, digestiveRoute), /held programme/);
  assert.throws(() => assertCapturePage(weight, '/about-us/'), /Unexpected/);
  const both = { ...weight, retainedDigestiveContact: digestiveProof().retainedDigestiveContact };
  assert.throws(() => assertCapturePage(both, weightRoute), /Unexpected/);
});

test('held Weight accepts the English prerender null locale with the full contact guard', () => {
  assert.deepEqual(captureContentRequirements(weightRoute, {}, null),captureContentRequirements(weightRoute, {}, 'en'));
  assert.equal(captureContentRequirements(weightRoute, {}, null).retainedWeightContact.path,'/contact-us/');
});
