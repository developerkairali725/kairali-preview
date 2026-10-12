import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { treatmentHeadingLevels } from '../app/(english)/_families/treatment-heading-levels.mjs';
const read = id => JSON.parse(fs.readFileSync(`public/ahv/views/${id}.json`, 'utf8'));
test('treatment desktop mounts top-level headings as H2 with all other template bytes retained', () => {
  const source = read('ahv-page-ayurvedic-treatments-desktop').template;
  assert.equal((source.match(/<h3\b/g) || []).length, 4);
  const result = treatmentHeadingLevels(source, '/ayurvedic-treatments/');
  assert.equal(result, source.replace(/<h3\b/g, '<h2').replace(/<\/h3>/g, '</h2>'));
  assert.match(result, /<h2[^>]*><a[^>]*>\{\{ p.t \}\}<\/a><\/h2>/);
  assert.equal(treatmentHeadingLevels(result, '/ayurvedic-treatments/'), result);
  const serialized = vm.runInNewContext(`(${treatmentHeadingLevels.toString()})`);
  assert.equal(serialized(source, '/ayurvedic-treatments/'), result);
});
test('mobile, unrelated routes and changed hierarchy remain untouched', () => {
  const mobile = read('ahv-page-ayurvedic-treatments-mobile').template;
  assert.equal(treatmentHeadingLevels(mobile, '/ayurvedic-treatments/'), mobile);
  const other = read('ahv-page-all-programs-desktop').template;
  assert.equal(treatmentHeadingLevels(other, '/all-programs/'), other);
  assert.equal(treatmentHeadingLevels('<h3>Nested heading</h3>', '/ayurvedic-treatments/'), '<h3>Nested heading</h3>');
});
