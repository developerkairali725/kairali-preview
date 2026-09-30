import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source = readFileSync(new URL('../app/(english)/_families/boot.ts', import.meta.url), 'utf8');
const discovery = source.slice(source.indexOf('  var honeypotDatasetCache'), source.indexOf('  // Cloudflare email'));
test('empty datasets are scanned once; late and replaced datasets remain discoverable', () => {
  let reads = 0;
  const dataset = { get fields() { reads++; return []; } };
  const ctx = {window: {AHV_DATA: dataset}};
  vm.createContext(ctx); vm.runInContext(discovery, ctx);
  assert.equal(ctx.honeypotNames().length, 0);
  ctx.honeypotNames(); assert.equal(reads, 1);
  ctx.window.AHV_FORM = {fields: [{name: 'website', honeypot: true}]};
  assert.deepEqual(Array.from(ctx.honeypotNames()), ['website']);
  ctx.window.AHV_FORM = {fields: [{name: 'company', honeypot: true}]};
  assert.deepEqual(Array.from(ctx.honeypotNames()), ['company']);
});
const slots = source.slice(source.indexOf('  function sweepSlots(tries)'), source.indexOf('  function bindRoute(tries)'));
test('slot readiness retries stop after upgrade and can repair a later inserted slot', () => {
  const list = [{}], timers = []; let ready = false, repaired = 0;
  const ctx = {host: {querySelectorAll: () => list},
    restoreSlotScroll: s => {if (ready) s.__ahvTouchFixed = true;},
    deferSlotImage: s => {if (ready) {s.__ahvLazySet = true; repaired++;}},
    setTimeout: f => timers.push(f)};
  vm.createContext(ctx); vm.runInContext(slots, ctx); ctx.sweepSlots(40);
  assert.equal(timers.length, 1);
  ready = true; timers.shift()();
  assert.equal(timers.length, 0); assert.equal(repaired, 1);
  list.push({}); ctx.sweepSlots(40);
  assert.equal(repaired, 2); assert.equal(timers.length, 0);
});
test('no slots means no readiness polling; an unavailable upgrade has a bounded retry', () => {
  let list = [], ticks = 0; const timers = [];
  const ctx = {host: {querySelectorAll: () => list}, restoreSlotScroll() {}, deferSlotImage() {}, setTimeout: f => timers.push(f)};
  vm.createContext(ctx); vm.runInContext(slots, ctx); ctx.sweepSlots(40);
  assert.equal(timers.length, 0);
  list = [{}]; ctx.sweepSlots(3);
  while (timers.length) {ticks++; timers.shift()();}
  assert.equal(ticks, 3);
});
