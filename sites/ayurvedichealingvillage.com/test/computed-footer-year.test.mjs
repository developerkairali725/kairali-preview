import test from 'node:test';
import assert from 'node:assert/strict';
import {computedFooterYear} from '../app/(english)/_families/computed-footer-year.ts';
test('SSR refreshes rolling footer years after the snapshot year', () => {
  for(const marker of ['', ' data-dc-computed="yearNow"']) {
    const input=`© 1908 — <span class="sc-interp"${marker}>2026</span>`;
    assert.equal(computedFooterYear(input, 2027), '© 1908 — <span class="sc-interp" data-dc-computed="yearNow">2027</span>');
  }
});
test('historical content is not rolled forward', () => {
  const input='Tariff 2025–2026. Reviewed <span class="sc-interp">2026</span>. Founded 1908.';
  assert.equal(computedFooterYear(input, 2027), input);
});
