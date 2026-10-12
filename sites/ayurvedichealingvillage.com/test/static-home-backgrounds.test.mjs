import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../app/(english)/_families/static-design-boot.mjs', import.meta.url), 'utf8');
const start = source.indexOf('  function deferStaticHomeBackgrounds() {');
const end = source.indexOf('\n  if (cfg.staticHome) deferStaticHomeBackgrounds();', start);
assert.ok(start >= 0 && end > start, 'production static-home initializer is present');
const initializer = source.slice(start, end);

function fixture(rows, { observer = true, revealed = false } = {}) {
  const calls = [], sections = [], elements = [], instances = [];
  const hero = Object.freeze({ src: '/ahv/assets/homepage-journey.mp4', poster: '/ahv/assets/img/wx-hero-544.avif', preload: 'none', playing: false });
  for (const [index, row] of rows.entries()) {
    const section = {
      id: index,
      getBoundingClientRect() { calls.push(['rect', index]); return { top: row.top, bottom: row.bottom, width: row.width ?? 412, height: row.height ?? row.bottom - row.top }; },
    };
    sections.push(section);
    for (let i = 0; i < row.count; i++) {
      const attributes = new Map(revealed ? [['data-ahv-bg', '']] : []);
      const element = {
        attributes,
        // A test fails immediately if production code probes any background descendant.
        getBoundingClientRect() { throw new Error('forbidden descendant layout probe'); },
        closest(selector) {
          calls.push(['closest', selector]);
          return selector.startsWith('.sc-host') ? section : { getBoundingClientRect() { throw new Error('nested section layout probe'); } };
        },
        hasAttribute(name) { return attributes.has(name); },
        setAttribute(name, value) { assert.equal(name, 'data-ahv-bg', 'no style, ARIA, media or content mutation'); calls.push(['reveal', index]); attributes.set(name, value); },
      };
      elements.push(element);
    }
  }
  class Observer {
    constructor(callback, options) { this.callback = callback; this.options = options; this.observed = new Set(); this.unobserved = []; this.disconnections = 0; instances.push(this); }
    observe(target) { calls.push(['observe', target.id]); this.observed.add(target); }
    unobserve(target) { this.unobserved.push(target); this.observed.delete(target); }
    disconnect() { this.disconnections++; this.observed.clear(); }
    emit(entries) { this.callback(entries); }
  }
  const host = { querySelectorAll(selector) { assert.equal(selector, "[style*='url(']"); return elements; } };
  const window = { innerHeight: 820, ...(observer ? { IntersectionObserver: Observer } : {}) };
  const run = () => vm.runInNewContext(`${initializer}\ndeferStaticHomeBackgrounds();`, { host, window, IntersectionObserver: observer ? Observer : undefined });
  return { calls, sections, elements, instances, hero, run };
}

const belowFold = [
  { count: 1, top: 4000, bottom: 5000 },
  { count: 9, top: 9000, bottom: 11000 },
  { count: 15, top: 18000, bottom: 23000 },
];

test('25 homepage backgrounds register only three outer section boxes, with no descendant layout probes', () => {
  const f = fixture(belowFold); f.run();
  assert.equal(f.calls.filter(([type]) => type === 'rect').length, 3);
  assert.equal(f.instances.length, 1);
  assert.equal(f.instances[0].options.rootMargin, '800px 0px');
  assert.equal(f.instances[0].observed.size, 3);
  assert.equal(f.elements.filter(el => el.hasAttribute('data-ahv-bg')).length, 0);
  assert.deepEqual(f.hero, { src: '/ahv/assets/homepage-journey.mp4', poster: '/ahv/assets/img/wx-hero-544.avif', preload: 'none', playing: false });
});

test('entering each section restores its complete background group and disconnects after the last group', () => {
  const f = fixture(belowFold); f.run(); const io = f.instances[0];
  io.emit([{ target: f.sections[0], isIntersecting: false }]);
  assert.equal(f.elements.filter(el => el.hasAttribute('data-ahv-bg')).length, 0);
  for (const [index, expected] of [1, 10, 25].entries()) {
    io.emit([{ target: f.sections[index], isIntersecting: true }]);
    assert.equal(f.elements.filter(el => el.hasAttribute('data-ahv-bg')).length, expected);
  }
  assert.equal(io.unobserved.length, 3);
  assert.equal(io.disconnections, 1);
  assert.equal(io.observed.size, 0);
  const writes = f.calls.filter(([type]) => type === 'reveal').length;
  io.emit([{ target: f.sections[2], isIntersecting: true }]);
  assert.equal(f.calls.filter(([type]) => type === 'reveal').length, writes, 'duplicate delivery has no extra mutation');
});

test('near groups reveal synchronously, after all boundary reads and before any scroll event', () => {
  const f = fixture([{ count: 2, top: 0, bottom: 500 }, ...belowFold]); f.run();
  assert.equal(f.elements.filter(el => el.hasAttribute('data-ahv-bg')).length, 2);
  const firstWrite = f.calls.findIndex(([type]) => type === 'reveal');
  const finalRead = f.calls.map(([type]) => type).lastIndexOf('rect');
  assert.ok(finalRead < firstWrite, 'no read/write layout interleaving');
  assert.equal(f.instances[0].observed.size, 3);
});

test('the existing 800-pixel near-window bounds and zero-size behavior are retained', () => {
  const f = fixture([
    { count: 1, top: 1619, bottom: 1719 },
    { count: 1, top: 1620, bottom: 1720 },
    { count: 1, top: -900, bottom: -800 },
    { count: 1, top: -899, bottom: -799 },
    { count: 1, top: 0, bottom: 0, width: 0, height: 0 },
  ]); f.run();
  assert.deepEqual(f.elements.map(el => el.hasAttribute('data-ahv-bg')), [true, false, false, true, false]);
});

test('without IntersectionObserver every background remains available without measuring layout', () => {
  const f = fixture(belowFold, { observer: false }); f.run();
  assert.equal(f.elements.filter(el => el.hasAttribute('data-ahv-bg')).length, 25);
  assert.equal(f.calls.filter(([type]) => type === 'rect').length, 0);
  assert.equal(f.instances.length, 0);
});

test('already revealed content is preserved without observers or geometry reads', () => {
  const f = fixture(belowFold, { revealed: true }); f.run();
  assert.equal(f.instances.length, 0);
  assert.equal(f.calls.length, 0);
  assert.equal(f.elements.every(el => el.hasAttribute('data-ahv-bg')), true);
});

test('a section initially near the viewport is unobserved and the observer is released when no groups remain', () => {
  const f = fixture([{ count: 25, top: 0, bottom: 700 }]); f.run();
  assert.equal(f.instances[0].observed.size, 0);
  assert.equal(f.instances[0].disconnections, 1);
  assert.equal(f.elements.filter(el => el.hasAttribute('data-ahv-bg')).length, 25);
});

test('negative canary rejects the old descendant-probing operation', () => {
  const f = fixture(belowFold);
  assert.throws(() => f.elements.map(el => el.getBoundingClientRect()), /forbidden descendant layout probe/);
});
