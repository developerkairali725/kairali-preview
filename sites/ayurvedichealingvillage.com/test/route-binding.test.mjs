import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source = readFileSync(new URL('../app/(english)/_families/boot.ts', import.meta.url), 'utf8');
const body = source.slice(source.indexOf('  function bindRoute(tries)'), source.indexOf('  // Same-origin credentials'));
test('readiness retries bind each root once, including a late final root', () => {
  const timers = [], calls = [];
  let name = 'Root';
  const context = { boundRouteName: null, templatePushed: true, pendingTemplate: null,
    window: { __dcRootName: () => name, __dcSetProps: (n, p) => calls.push([n, p.route]) },
    cfg: { path: '/panchakarma-therapy/' }, scheduleHead() {}, setTimeout: fn => timers.push(fn) };
  vm.createContext(context); vm.runInContext(body + '\nbindRoute(40);', context);
  let tick = 0;
  while (timers.length) { if (++tick === 3) name = 'Treatment'; timers.shift()(); }
  assert.equal(tick, 40);
  assert.deepEqual(calls, [['Root', '/panchakarma-therapy/'], ['Treatment', '/panchakarma-therapy/']]);
});
test('failed prop binding retries rather than recording false completion', () => {
  const timers = []; let attempts = 0;
  const context = { boundRouteName: null, templatePushed: true, pendingTemplate: null,
    window: { __dcRootName: () => 'Treatment', __dcSetProps: () => { if (++attempts === 1) throw Error('not ready'); } },
    cfg: { path: '/panchakarma-therapy/' }, scheduleHead() {}, setTimeout: fn => timers.push(fn) };
  vm.createContext(context); vm.runInContext(body + '\nbindRoute(4);', context);
  while (timers.length) timers.shift()();
  assert.equal(attempts, 2); assert.equal(context.boundRouteName, 'Treatment');
});
