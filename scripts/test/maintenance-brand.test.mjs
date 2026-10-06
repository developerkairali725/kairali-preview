import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RULES, isGeneratedLocale, maintenanceRules, scanText, runControlProbes } from '../banned-string-lint.mjs';
import { analyzeSource, PRIYA_DIGITS } from '../cta-label-lint.mjs';
const rules = maintenanceRules();
const scan = text => scanText(text, { kind: 'plain', rules });
test('maintenance permits ordinary clinical prose, quoted short names and static copyright years', () => {
  for (const text of ['Ask your doctor about suitability.', 'A guest said: Dr Deepu was helpful.', '© 2026 Kairali Ayurvedic Group.']) {
    assert.deepEqual(scan(text), []);
    assert.ok(scanText(text, { kind: 'plain', rules: RULES }).length, 'historical audit rules remain available');
  }
});
test('maintenance still rejects real factual and medical-claim violations', () => {
  for (const id of ['group-attached-1908', 'wrong-whatsapp-38777', 'blanket-review-claim']) {
    const rule = rules.find(r => r.id === id);
    assert.ok(scan(rule.probe).some(f => f.rule === id));
  }
  assert.equal(runControlProbes(rules).ok, true);
});
test('clinical CTA labels are checked against their real destination', () => {
  assert.ok(analyzeSource(`<a href="https://wa.me/${PRIYA_DIGITS}">Ask a doctor</a>`).length);
  assert.deepEqual(analyzeSource('<a href="/contact-us/">Ask a doctor</a>'), []);
  assert.deepEqual(analyzeSource(`<a href="https://wa.me/${PRIYA_DIGITS}">Ask Priya, our AI assistant</a>`), []);
});

test('only compiled locale outputs are omitted from source scans', () => {
  assert.equal(isGeneratedLocale('sites/ayurvedichealingvillage.com/l10n/generated/hi.catalog.json'),true);
  assert.equal(isGeneratedLocale('sites/ayurvedichealingvillage.com/public/ahv/l10n/hi/assets/policy-family-data.js'),true);
  for (const file of ['sites/ayurvedichealingvillage.com/l10n/source/units.json','sites/ayurvedichealingvillage.com/l10n/output/hi/batch.json','sites/ayurvedichealingvillage.com/public/ahv/assets/policy-family-data.js','sites/other.com/l10n/generated/hi.json']) assert.equal(isGeneratedLocale(file),false);
});
