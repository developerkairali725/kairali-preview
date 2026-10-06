// Acceptance fixture: Front Office corrected Room category list.xlsx, 2 Oct 2026,
// message 1a0fc049e9c21663. Reassignment must retain each physical room's photos.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const roster = {
  CLASSIC: {'101':'King','102':'King','104':'Twin','105':'Twin','106':'Twin','107':'King','202':'King','204':'Twin','207':'King','306':'Twin'},
  DELUXE: {'103':'Twin','201':'King','203':'King','205':'King','206':'Twin','209':'King','210':'Twin','211':'King'},
  ROYAL: {'108':'King','109':'Twin','110':'King','208':'King','212':'Twin','301':'King','302':'King','303':'King','304':'King','305':'Twin'},
  MAHARAJA: {'1001':'King','1002':'King & Twin'},
};
const file = k => k === 'MAHARAJA' ? 'maharaja-suite-data.js' : k.toLowerCase() + '-villa-data.js';
const read = (root, key) => {
  const window = {};
  vm.runInNewContext(fs.readFileSync(`${root}/assets/${file(key)}`, 'utf8'), {window});
  return window['AHV_' + key];
};
test('all 30 physical rooms match the corrected operations roster exactly once', () => {
  const ids=[];
  for (const [key, expected] of Object.entries(roster)) {
    const d=read('public/ahv',key);
    assert.deepEqual(Object.fromEntries(d.rooms.map(r=>[r.room,r.bed])),expected,key);
    ids.push(...d.rooms.map(r=>r.room));
  }
  assert.equal(ids.length,30);assert.equal(new Set(ids).size,30);
  const room=read('public/ahv','ROYAL').rooms.find(r=>r.room==='212');
  assert.equal(room.name,'Atham');assert.equal(room.images.length,3);
  assert.ok(room.images.every(r=>r.legacyUrl.includes('212-attam-')));
  assert.ok(room.images.every(r=>!r.alt.includes('Classic')));
});
test('every generated locale preserves room identity, category and its translated king-bed value',()=>{
  const locales=JSON.parse(fs.readFileSync('l10n/locales.json','utf8'));
  for(const [loc,info] of Object.entries(locales)){
    if(loc==='en')continue;
    const root=`public/ahv/l10n/${info.prefix}`;
    const c=read(root,'CLASSIC'),r=read(root,'ROYAL');
    assert.equal(c.rooms.length,10,loc);assert.equal(r.rooms.length,10,loc);
    assert.equal(c.rooms.some(x=>x.room==='212'),false,loc);
    assert.equal(r.rooms.find(x=>x.room==='212').images.length,3,loc);
    assert.equal(r.rooms.find(x=>x.room==='301').bed,r.rooms.find(x=>x.room==='302').bed,loc);
  }
});
