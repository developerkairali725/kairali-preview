import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

// Exercise the actual method body in the served image-slot.js without DOM setup.
const source = fs.readFileSync(new URL('../public/ahv/image-slot.js', import.meta.url), 'utf8');
const match = source.match(/    _geom\(\) \{[\s\S]*?\n    \}\n\n    _clampView\(\)/);
assert.ok(match, 'image-slot geometry method is present');
const method = match[0].replace(/\n\n    _clampView\(\)$/, '');
const geom = Function(`return ({${method}})._geom`)();

test('unloaded image avoids frame layout reads', () => {
  let reads = 0;
  const slot = {
    _img: { naturalWidth: 0, naturalHeight: 0 },
    get clientWidth() { reads++; throw new Error('frame width forced layout'); },
    get clientHeight() { reads++; throw new Error('frame height forced layout'); },
    getAttribute: () => 'cover',
  };
  assert.equal(geom.call(slot), null);
  assert.equal(reads, 0);
});

test('loaded cover and contain retain their exact frame scale', () => {
  for (const [fit, base] of [['cover', 0.5], ['contain', 0.25]]) {
    const slot = {
      _img: { naturalWidth: 1200, naturalHeight: 800 },
      clientWidth: 300,
      clientHeight: 400,
      getAttribute: () => fit,
    };
    assert.deepEqual(geom.call(slot), { iw: 1200, ih: 800, fw: 300, fh: 400, base });
  }
});

test('loaded image in a hidden zero-width frame remains unset', () => {
  const slot = {
    _img: { naturalWidth: 1200, naturalHeight: 800 },
    clientWidth: 0,
    clientHeight: 400,
    getAttribute: () => 'cover',
  };
  assert.equal(geom.call(slot), null);
});
