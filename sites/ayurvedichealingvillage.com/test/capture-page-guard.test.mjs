import test from 'node:test';
import assert from 'node:assert/strict';
import { assertCapturePage, captureFormSelector, captureContentRequirements } from '../tools/capture-page-guard.mjs';
const complete = { errors: [], heading: 'Contact us', bodyChars: 1200, requiredForm: true };

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
