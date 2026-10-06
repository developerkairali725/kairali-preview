import test from 'node:test';
import assert from 'node:assert/strict';
import { observeSnapshotStyleRetirement } from '../app/(english)/_families/snapshot-style-retirement.mjs';

function fixture(state = 'held') {
  const doc = new EventTarget();
  const headCss = ['body{margin:0}'];
  const headLinks = ['/fonts/body.css'];
  doc.getElementById = () => ({ getAttribute: () => state });
  doc.head = { querySelectorAll: (selector) => selector === 'style'
    ? headCss.map((textContent) => ({ textContent }))
    : headLinks.map((href) => ({ getAttribute: () => href })) };
  const assets = [
    { key: 'matched', kind: 'style', css: ' body{margin:0} ' },
    { key: 'unmatched', kind: 'style', css: 'h1{color:green}' },
    { key: 'font', kind: 'link', href: '/fonts/body.css' },
    { key: 'pending-font', kind: 'link', href: '/fonts/heading.css' },
  ];
  return { doc, assets, setState: (value) => { state = value; }, fire: () => doc.dispatchEvent(new Event('ahv:snapshot-retired')) };
}

test('styles remain while the snapshot is active, even if a retirement event arrives early', () => {
  const f = fixture();
  const calls = [];
  const cleanup = observeSnapshotStyleRetirement(f.doc, f.assets, (assets) => calls.push(assets));
  f.fire();
  assert.deepEqual(calls, []);
  f.setState('retired');
  f.fire();
  assert.deepEqual(calls, [[f.assets[0], f.assets[2]]]);
  cleanup();
});

test('runtime finishing before React hydration still retires only exact duplicates', () => {
  const f = fixture('retired');
  const calls = [];
  const cleanup = observeSnapshotStyleRetirement(f.doc, f.assets, (assets) => calls.push(assets));
  assert.deepEqual(calls, [[f.assets[0], f.assets[2]]]);
  assert.equal(calls[0][0], f.assets[0], 'preserves identity for the component state');
  cleanup();
});

test('unmount removes the listener and remount can observe the already-retired snapshot', () => {
  const f = fixture();
  let calls = 0;
  const cleanup = observeSnapshotStyleRetirement(f.doc, f.assets, () => calls++);
  cleanup();
  f.setState('retired');
  f.fire();
  assert.equal(calls, 0);
  const cleanupAgain = observeSnapshotStyleRetirement(f.doc, f.assets, () => calls++);
  assert.equal(calls, 1);
  cleanupAgain();
});

test('a missing design root leaves styles intact', () => {
  const f = fixture('retired');
  f.doc.getElementById = () => null;
  const calls = [];
  const cleanup = observeSnapshotStyleRetirement(f.doc, f.assets, (assets) => calls.push(assets));
  f.fire();
  assert.deepEqual(calls, []);
  cleanup();
});
