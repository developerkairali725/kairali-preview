import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectSites } from '../lib/selected-sites.mjs';
import { checkLayoutSource, PROBE_GOOD, PROBE_BAD_ORDER, PROBE_MISSING, runControlProbes as chatProbes } from '../chat-bubble-lint.mjs';
import { checkSiteSources, PROBE_GOOD as FOOTER_GOOD, PROBE_MISSING as FOOTER_MISSING, PROBE_HREFS, runControlProbes as footerProbes } from '../footer-socials-lint.mjs';
test('selected chrome checks cannot silently skip an unknown site', () => {
  assert.deepEqual(selectSites(['ahv','other'], ['--only','ahv']), ['ahv']);
  assert.deepEqual(selectSites(['ahv','other'], []), ['ahv','other']);
  for (const argv of [['--only'],['--only','missing']]) assert.throws(() => selectSites(['ahv'],argv), /Unknown selected/);
});
test('scoped consent and chat checks detect missing loaders and incorrect order', () => {
  assert.deepEqual(chatProbes(), []);
  assert.deepEqual(checkLayoutSource(PROBE_GOOD,'fixture'), []);
  for (const source of [PROBE_BAD_ORDER,PROBE_MISSING]) assert.ok(checkLayoutSource(source,'fixture').length);
});
test('scoped footer check retains missing-link and single-source detection', () => {
  assert.deepEqual(footerProbes(), []);
  assert.deepEqual(checkSiteSources(FOOTER_GOOD,'fixture',PROBE_HREFS), []);
  assert.ok(checkSiteSources(FOOTER_MISSING,'fixture',PROBE_HREFS).length);
});
