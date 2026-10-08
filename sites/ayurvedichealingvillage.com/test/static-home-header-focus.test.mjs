import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const sourceUrl = process.env.AHV_TEST_STATIC_VIEW_SOURCE || new URL('../app/(english)/_families/static-design-view.tsx', import.meta.url);
const source = readFileSync(sourceUrl, 'utf8');
const start = source.indexOf('  if (cfg.staticHome) {\n    var stickyHeader');
const end = source.indexOf('\n  host.setAttribute("data-ahv-snapshot-state", "retired");', start);
assert.ok(start >= 0 && end > start, 'production static-home sticky-header initializer is present');
const initializer = source.slice(start, end);

function fixture({ wide = true } = {}) {
  const listeners = {}, inside = new Set();
  const header = {
    style: { transform: 'translateY(-110%)' },
    addEventListener(name, fn) { (listeners[name] ||= []).push(fn); },
    contains(node) { return inside.has(node); },
  };
  const win = { scrollY: 0, scrollFns: [], matchMedia() { return { matches: wide }; }, addEventListener(name, fn) { if (name === 'scroll') this.scrollFns.push(fn); } };
  const host = { querySelector(selector) { assert.equal(selector, 'header[style*="translateY"]'); return header; } };
  vm.runInNewContext(initializer, { cfg: { staticHome: {}, breakpoint: 768 }, host, window: win });
  const link = (focusVisible) => { const node = { matches: (s) => s === ':focus-visible' && focusVisible }; inside.add(node); return node; };
  const fire = (name, event) => (listeners[name] || []).forEach((fn) => fn(event));
  const scroll = (y) => { win.scrollY = y; win.scrollFns.forEach((fn) => fn()); };
  return { header, listeners, link, fire, scroll };
}

test('keyboard focus inside the static-home header reveals it at scroll top and keeps it revealed across header links', () => {
  const { header, link, fire } = fixture();
  assert.equal(header.style.transform, 'translateY(-110%)');
  const a = link(true), b = link(true);
  fire('focusin', { target: a });
  assert.equal(header.style.transform, 'translateY(0)');
  fire('focusout', { target: a, relatedTarget: b });
  assert.equal(header.style.transform, 'translateY(0)');
  fire('focusin', { target: b });
  assert.equal(header.style.transform, 'translateY(0)');
  fire('focusout', { target: b, relatedTarget: { outside: true } });
  assert.equal(header.style.transform, 'translateY(-110%)');
  fire('focusin', { target: a });
  fire('focusout', { target: a, relatedTarget: null });
  assert.equal(header.style.transform, 'translateY(-110%)');
});

test('negative controls: pointer focus does not reveal; scroll threshold behaviour is unchanged', () => {
  const { header, link, fire, scroll } = fixture();
  fire('focusin', { target: link(false) });
  assert.equal(header.style.transform, 'translateY(-110%)', 'pointer (non focus-visible) focus leaves the scroll-driven header alone');
  scroll(520); assert.equal(header.style.transform, 'translateY(-110%)');
  scroll(521); assert.equal(header.style.transform, 'translateY(0)');
  scroll(0); assert.equal(header.style.transform, 'translateY(-110%)');
});

test('keyboard focus held while scrolling back to top keeps the header revealed until focus leaves', () => {
  const { header, link, fire, scroll } = fixture();
  const a = link(true);
  scroll(900); fire('focusin', { target: a }); scroll(0);
  assert.equal(header.style.transform, 'translateY(0)');
  fire('focusout', { target: a, relatedTarget: null });
  assert.equal(header.style.transform, 'translateY(-110%)');
});

test('below the desktop breakpoint no sticky-header listeners are attached (mobile layout untouched)', () => {
  const { listeners, header } = fixture({ wide: false });
  assert.deepEqual(Object.keys(listeners), []);
  assert.equal(header.style.transform, 'translateY(-110%)');
});
