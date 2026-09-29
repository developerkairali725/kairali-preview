// The enquiry-family views (contact, enquiry-form, careers, online consultation) post to /api/lead/, but while that
// route is not configured they must keep the owner-approved, already-translated "being connected" notices verbatim,
// and none of the new delivery code may become a translation unit (a translated payload key or MIME type would break
// delivery in 12 locales — see l10n-code-tokens.test.mjs).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { jsUnits } from '../tools/l10n/lib.mjs';

const views = ['desktop', 'mobile'].map((v) => [v, JSON.parse(fs.readFileSync(new URL(`../public/ahv/views/ahv-page-enquiry-${v}.json`, import.meta.url), 'utf8'))]);
const CONTACT_PENDING = 'Details look complete. This form is being connected. Until then, please write to info@kairali.com or message us on WhatsApp at +91 92898 38797.';
const APPLY_PENDING = 'Required details look complete. This form is being connected. Until then, please write to info@kairali.com or message us on WhatsApp at +91 92898 38797.';

test('not-configured state keeps the approved notices and the WhatsApp-draft consultation fallback', () => {
  for (const [variant, { template, logic }] of views) {
    assert.ok(template.includes(`<sc-if value="{{ cPending }}" hint-placeholder-val="{{ false }}"><p data-local-valid="true" role="status" style="margin:0;font-size:15px;color:#5A4420;font-weight:600">${CONTACT_PENDING}</p></sc-if>`), `${variant} contact notice verbatim`);
    assert.ok(template.includes(`<sc-if value="{{ aPending }}" hint-placeholder-val="{{ false }}"><p data-local-valid="true" role="status" style="margin:0;font-size:15px;color:#5A4420;font-weight:600">${APPLY_PENDING}</p></sc-if>`), `${variant} careers notice verbatim`);
    assert.match(template, /<sc-if value="\{\{ oBlocked \}\}"[^>]*><p data-blocked="true" role="status"[^>]*>\{\{ O\.card\.done\.blocked \}\}<\/p><\/sc-if>/, `${variant} consultation blocked notice`);
    assert.match(template, /<sc-if value="\{\{ oReceived \}\}"[^>]*><p role="status"[^>]*>Thank you — your consultation request has been received\.<\/p><\/sc-if>/, `${variant} receipt only when received`);
    assert.match(logic, /response\.status === 503 && \/_NOT_CONFIGURED\$\/\.test/, `${variant} detects not-configured`);
    assert.match(logic, /if \(error\.notConnected\) \{ this\.setState\(\{ step: 'done', oErr: \{\}, oSubmitError: '', oReceived: false \}\)/, `${variant} consultation falls back to the draft step`);
    assert.match(logic, /oReceived: true \}\)/, `${variant} receipt flag only on server acceptance`);
    assert.match(logic, /cPending: !!error\.notConnected/);
    assert.match(logic, /aPending: !!error\.notConnected/);
    assert.doesNotMatch(logic, /setState\(\{ cValid: true, cNotice: 'Thank you[^']*' \}\);[^}]*\} catch[^}]*cValid: true/, `${variant} no success in the error path`);
  }
});

test('delivery code tokens are never translation units', () => {
  const codeTokens = ['application/json', 'POST', 'same-origin', 'no-store', '/api/lead/', '/api/application-upload/', 'contact', 'enquiry-form',
    'apply-now', 'online-consultation', 'careers-apply', 'job-detail', 'photo', 'resume', 'application', 'file', 'purpose', 'submissionToken', 'AbortError'];
  for (const [variant, { logic }] of views) {
    const units = jsUnits(logic).units.map((u) => u.source);
    for (const token of codeTokens) assert.ok(!units.includes(token), `${variant}: "${token}" would be translated`);
    for (const visible of ['Sending…', 'Thank you — your details have been received.', 'We could not confirm your submission. Check your connection and try again.']) {
      assert.ok(units.includes(visible), `${variant}: visible "${visible}" is a unit for the localization round`);
    }
  }
});
