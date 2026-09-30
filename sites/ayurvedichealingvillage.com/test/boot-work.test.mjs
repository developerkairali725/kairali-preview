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

const mutations = source.slice(source.indexOf('  new MutationObserver(function (changes) {'), source.indexOf('  // Also normalize synchronously'));
function mutationHarness() {
  const repairs = ['localizeLinks', 'restoreSlotScrolling', 'deferSlotImages', 'deferBackgrounds', 'aliasImages', 'startIstClock', 'hideHoneypots', 'repairEmailLinks', 'upgradeLanguageControls', 'retargetSelfLinks'];
  const calls = Object.fromEntries(repairs.map(name => [name, []]));
  const globals = [];
  const host = {contains(node) { for (let n = node; n; n = n.parentElement) if (n === host) return true; return false; }};
  let callback;
  const ctx = {host, lastLiveChange: 0, Set, Date,
    MutationObserver: class {constructor(cb) {callback = cb;} observe() {}},
    enhanceDirections: node => globals.push(['directions', node]), applyConsent: () => globals.push(['consent']),
    localizeLink: node => globals.push(['link', node])};
  for (const name of repairs) ctx[name] = (...args) => calls[name].push(args);
  vm.createContext(ctx); vm.runInContext(mutations, ctx);
  const node = (name, parentElement = host, nodeType = 1) => ({name, parentElement, nodeType});
  const add = (...addedNodes) => ({type: 'childList', addedNodes});
  return {host, node, add, calls, globals, ctx, run: changes => callback(changes)};
}
test('nested and repeated insertion records repair each attached outermost subtree once', () => {
  const h = mutationHarness(), parent = h.node('parent'), child = h.node('child', parent), grandchild = h.node('grandchild', child), sibling = h.node('sibling');
  // The child record deliberately precedes its parent; final tree membership wins.
  h.run([h.add(child), h.add(parent, sibling), h.add(grandchild), h.add(parent)]);
  for (const calls of Object.values(h.calls)) assert.deepEqual(calls.map(([node]) => node.name), ['parent', 'sibling']);
  assert.deepEqual(h.globals.map(([name]) => name), ['directions', 'consent']);
  assert.ok(h.ctx.lastLiveChange > 0);
});
test('discarded render nodes are skipped while text updates retain the global repairs', () => {
  const h = mutationHarness(), oldRoot = h.node('discarded', null), oldChild = h.node('discarded child', oldRoot), text = h.node('text', h.host, 3);
  h.run([h.add(oldRoot, oldChild, text)]);
  for (const calls of Object.values(h.calls)) assert.equal(calls.length, 0);
  assert.deepEqual(h.globals.map(([name]) => name), ['directions', 'consent']);
});
test('later child additions are repaired and attribute changes keep their existing handling', () => {
  const h = mutationHarness(), parent = h.node('parent'), child = h.node('late child', parent);
  h.run([h.add(parent)]);
  h.run([h.add(child), {type: 'attributes', attributeName: 'style', target: parent}, {type: 'attributes', attributeName: 'href', target: child}]);
  assert.deepEqual(h.calls.localizeLinks.map(([node]) => node.name), ['parent', 'late child']);
  assert.deepEqual(h.calls.deferBackgrounds.map(([node, ownOnly]) => [node.name, ownOnly]), [['parent', undefined], ['late child', undefined], ['parent', true]]);
  assert.deepEqual(h.globals.filter(([name]) => name === 'link').map(([,node]) => node.name), ['late child']);
});
test('a deep insertion batch has linear repair traversal rather than repeated ancestor walks', () => {
  const h = mutationHarness();
  const nodes = []; let parent = h.host;
  for (let i = 0; i < 40; i++) { parent = h.node(String(i), parent); nodes.push(parent); }
  h.run(nodes.map(node => h.add(node)));
  assert.equal(h.calls.localizeLinks.length, 1);
  assert.equal(h.calls.localizeLinks[0][0], nodes[0]);
  // Each of the ten subtree hooks visits 40 nodes once; the old callback
  // traversed 40+39+...+1 = 820 per hook for this same final DOM.
  assert.equal(Object.values(h.calls).reduce((sum, calls) => sum + calls.length, 0), 10);
});
