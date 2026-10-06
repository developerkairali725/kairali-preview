import { test } from 'node:test';
import assert from 'node:assert/strict';
import { incomplete } from '../ci-completion.mjs';
const good = { changes:{result:'success'}, 'brand-lint':{result:'success'}, 'site-check':{result:'success'} };
test('selected sites require successful QA', () => {
  assert.deepEqual(incomplete(good,1),[]);
  for (const result of ['failure','cancelled','skipped',undefined]) {
    assert.ok(incomplete({...good,'site-check':{result}},1).includes('site-check'));
  }
});
test('only explicit empty plans may skip browser/build matrix', () => {
  const skipped={...good,'site-check':{result:'skipped'}};
  assert.deepEqual(incomplete(skipped,0),[]);
  for (const count of [undefined,NaN,-1,0.5]) assert.ok(incomplete(skipped,count).length);
});
test('failed, cancelled or missing planner/brand checks never pass', () => {
  for (const name of ['changes','brand-lint']) for (const result of ['failure','cancelled','skipped',undefined]) {
    assert.ok(incomplete({...good,[name]:{result}},0).includes(name));
  }
  assert.ok(incomplete({},0).length);
});
