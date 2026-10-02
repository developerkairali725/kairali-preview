import test from 'node:test';
import assert from 'node:assert/strict';
import {heritageYears} from './heritage-age.mjs';
test('family heritage age follows the current Indian calendar year',()=>{
 assert.equal(heritageYears(new Date('2026-10-03T00:00:00Z')),118);
 assert.equal(heritageYears(new Date('2026-12-31T18:29:59Z')),118);
 assert.equal(heritageYears(new Date('2026-12-31T18:30:00Z')),119);
});
