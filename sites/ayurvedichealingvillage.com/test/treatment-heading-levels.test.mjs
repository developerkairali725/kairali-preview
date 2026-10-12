import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { treatmentHeadingLevels } from '../tools/lib/treatment-heading-levels.mjs';
const read = id => JSON.parse(fs.readFileSync(`public/ahv/views/${id}.json`, 'utf8'));
test('treatment finder headings survive regeneration without changing card content or styles', () => {
  const current = read('ahv-page-ayurvedic-treatments-desktop');
  assert.doesNotMatch(current.template, /<h3\b/);
  assert.match(current.template, /<h2[^>]*><a[^>]*>\{\{ p.t \}\}<\/a><\/h2>/);
  const old = structuredClone(current);
  let count = 0;
  old.template = old.template.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/g, (full, attrs, body) => {
    if (!body.includes('{{ p.t }}') && !attrs.includes('font-size:27px')) return full;
    count++; return `<h3${attrs}>${body}</h3>`;
  });
  assert.equal(count, 4);
  assert.deepEqual(treatmentHeadingLevels(old), current);
  assert.deepEqual(treatmentHeadingLevels(old), current);
});
test('heading correction leaves mobile and other finders unchanged and rejects changed desktop anchors', () => {
  for (const id of ['ahv-page-ayurvedic-treatments-mobile', 'ahv-page-all-programs-desktop']) {
    const view = read(id), original = structuredClone(view);
    assert.deepEqual(treatmentHeadingLevels(view), original);
  }
  assert.throws(() => treatmentHeadingLevels({ id: 'ahv-page-ayurvedic-treatments-desktop', template: '<h3>Changed source</h3>' }), /anchors changed/);
});
