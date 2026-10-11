import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const defaultViews = join(dirname(fileURLToPath(import.meta.url)), '../public/ahv/views');
const views = process.env.AHV_TEST_VIEWS_DIR || defaultViews;
const payload = JSON.parse(readFileSync(join(views, 'home-hi-fi-v4.json'), 'utf8'));

function mount() {
  const docListeners = {};
  const windowStub = { innerWidth: 1440, innerHeight: 900, scrollY: 0, addEventListener() {}, removeEventListener() {}, matchMedia() { return { matches: false }; } };
  const documentStub = {
    addEventListener(name, fn) { (docListeners[name] ||= []).push(fn); },
    removeEventListener(name, fn) { docListeners[name] = (docListeners[name] || []).filter((f) => f !== fn); },
    querySelectorAll() { return []; },
  };
  class DCLogic {
    setState(update) {
      const value = typeof update === 'function' ? update(this.state) : update;
      this.state = { ...this.state, ...value };
    }
  }
  const Component = vm.runInNewContext(`${payload.logic}\nComponent`, {
    DCLogic, window: windowStub, document: documentStub,
    localStorage: { getItem() { return null; }, setItem() {} },
    setTimeout() { return 1; }, clearTimeout() {}, setInterval() { return 1; }, clearInterval() {},
    IntersectionObserver: class { observe() {} unobserve() {} disconnect() {} },
  });
  const c = new Component();
  c.props = c.props || {};
  c.componentDidMount();
  const fire = (type, init) => (docListeners[type] || []).forEach((fn) => fn({ type, ...init }));
  return { c, fire, windowStub, docListeners };
}

// Element stubs: inside/outside the homepage header, keyboard (:focus-visible) or pointer focus.
const el = (inHeader, focusVisible) => ({
  closest: (sel) => (sel === '[data-ahv-home-header]' && inHeader ? {} : null),
  matches: (sel) => sel === ':focus-visible' && focusVisible,
});
const hdrY = (c) => c.renderVals().hdrY;

test('homepage header carries the narrow durable focus-reveal marker exactly once', () => {
  assert.equal(payload.template.match(/<header data-ahv-home-header="1" style="position:fixed;/g)?.length, 1);
  assert.match(payload.template, /transform:translateY\(\{\{ hdrY \}\}\);transition:transform \.4s ease/);
});

test('at scroll top the header stays hidden until a keyboard-focused header descendant appears, then reveals', () => {
  const { c, fire } = mount();
  assert.equal(hdrY(c), '-110%');
  fire('focusin', { target: el(true, true) });
  assert.equal(hdrY(c), '0%');
  // moving keyboard focus between header links keeps it revealed
  fire('focusout', { relatedTarget: el(true, true) });
  assert.equal(hdrY(c), '0%');
  fire('focusin', { target: el(true, true) });
  assert.equal(hdrY(c), '0%');
  // leaving the header restores the normal hidden-at-top state
  fire('focusout', { relatedTarget: el(false, true) });
  assert.equal(hdrY(c), '-110%');
  fire('focusout', { relatedTarget: null });
  assert.equal(hdrY(c), '-110%');
});

test('negative controls: pointer focus and focus outside the header do not reveal; scroll threshold unchanged', () => {
  const { c, fire, windowStub } = mount();
  fire('focusin', { target: el(true, false) });
  assert.equal(hdrY(c), '-110%', 'pointer (non focus-visible) focus must not change the scroll-driven header');
  fire('focusin', { target: el(false, true) });
  assert.equal(hdrY(c), '-110%', 'keyboard focus outside the header must not reveal it');
  windowStub.scrollY = 520; c._sc();
  assert.equal(hdrY(c), '-110%');
  windowStub.scrollY = 521; c._sc();
  assert.equal(hdrY(c), '0%');
  windowStub.scrollY = 0; c._sc();
  assert.equal(hdrY(c), '-110%');
});

test('unmount removes the focus listeners', () => {
  const { c, docListeners } = mount();
  assert.equal(docListeners.focusin.length, 1);
  c.componentWillUnmount();
  assert.equal(docListeners.focusin.length, 0);
  assert.equal(docListeners.focusout.length, 0);
});
