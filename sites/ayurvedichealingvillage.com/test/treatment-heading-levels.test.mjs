import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { treatmentHeadingLevels } from '../app/(english)/_families/treatment-heading-levels.mjs';
const read = id => JSON.parse(fs.readFileSync(`public/ahv/views/${id}.json`, 'utf8'));
for (const variant of ['desktop', 'mobile']) test(`${variant}: treatment cards and search messages mount as H2 with other template bytes retained`, () => {
  const source = read(`ahv-page-ayurvedic-treatments-${variant}`).template;
  assert.equal((source.match(/<h3\b/g) || []).length, variant === 'desktop' ? 4 : 3);
  const result = treatmentHeadingLevels(source, '/ayurvedic-treatments/', variant);
  assert.equal(result, source.replace(/<h3\b/g, '<h2').replace(/<\/h3>/g, '</h2>'));
  assert.match(result, /<h2[^>]*><a[^>]*>\{\{ p.t \}\}<\/a><\/h2>/);
  assert.equal(treatmentHeadingLevels(result, '/ayurvedic-treatments/', variant), result);
  const serialized = vm.runInNewContext(`(${treatmentHeadingLevels.toString()})`);
  assert.equal(serialized(source, '/ayurvedic-treatments/', variant), result);
});
test('unrelated routes, unknown variants and changed hierarchies remain untouched', () => {
  const other = read('ahv-page-all-programs-desktop').template;
  assert.equal(treatmentHeadingLevels(other, '/all-programs/', 'desktop'), other);
  assert.equal(treatmentHeadingLevels(other, '/ayurvedic-treatments/', 'unknown'), other);
  assert.equal(treatmentHeadingLevels('<h3>Nested heading</h3>', '/ayurvedic-treatments/', 'mobile'), '<h3>Nested heading</h3>');
});
