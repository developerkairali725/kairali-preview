import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import { STATIC_BOOT } from '../app/(english)/_families/static-design-boot.mjs';

test('homepage boot asset has the complete runtime and an immutable content identity', () => {
  const manifest = JSON.parse(readFileSync(new URL('../public/design/static-design-boot.json', import.meta.url)));
  const hash = createHash('sha256').update(STATIC_BOOT).digest('hex');
  assert.equal(manifest.sha256, hash);
  assert.equal(manifest.src, `/design/static-design-boot-${hash.slice(0, 20)}.js`);
  const asset = readFileSync(new URL(`../public${manifest.src}`, import.meta.url), 'utf8');
  assert.equal(asset, STATIC_BOOT);
  assert.doesNotThrow(() => new vm.Script(asset));
});
