// Owner report 14 Oct 2026 (F3): on iOS the inner-page header language switcher
// did nothing, and after one switch on the homepage a second switch failed.
// Safari never focuses a link on tap/click, so pressing an option blurred the
// focused current option with relatedTarget null BEFORE the click; the old
// focusout handler closed the list and the click landed on the page beneath.
// This exercises the actual boot.ts switcher (localeGroup) in a minimal DOM.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../app/(english)/_families/boot.ts', import.meta.url), 'utf8');
const start = source.indexOf('  var LOC = cfg.locale');
const end = source.indexOf('  function inlineLanguages()', start);
assert.ok(start > 0 && end > start, 'exercise the actual boot.ts language switcher');
const script = source.slice(start, end);

class Node {
  constructor(tag) { this.tagName = tag.toUpperCase(); this.children = []; this.attrs = {}; this.listeners = {}; this.hidden = false; this.textContent = ''; this.innerHTML = ''; }
  appendChild(child) { child.parentNode = this; this.children.push(child); return child; }
  setAttribute(name, value) { this.attrs[name] = String(value); }
  getAttribute(name) { return Object.hasOwn(this.attrs, name) ? this.attrs[name] : null; }
  hasAttribute(name) { return Object.hasOwn(this.attrs, name); }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  contains(node) { return !!node && (node === this || this.children.some((child) => child.contains(node))); }
  all() { return this.children.flatMap((child) => [child, ...child.all()]); }
  querySelectorAll(selector) {
    if (selector === 'a') return this.all().filter((n) => n.tagName === 'A');
    if (selector === 'a[aria-current]') return this.all().filter((n) => n.tagName === 'A' && n.hasAttribute('aria-current'));
    throw new Error('Unexpected selector ' + selector);
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  focus() { this.ownerDocument.activeElement = this; }
}

function harness() {
  const docListeners = {};
  const document = {
    activeElement: null,
    head: { appendChild() {} },
    createElement(tag) { const n = new Node(tag); n.ownerDocument = document; return n; },
    getElementById() { return null; },
    addEventListener(type, fn) { (docListeners[type] ||= []).push(fn); },
  };
  const options = ['en', 'de', 'fr'].map((code) => ({ code, lang: code, name: code.toUpperCase(), href: code === 'en' ? '/' : `/${code}/` }));
  const context = { cfg: { locale: { code: 'de', options, ui: {} } }, document, String, localStorage: { setItem() {} } };
  vm.runInNewContext(`${script}\nthis.group = localeGroup();`, context);
  const wrap = context.group;
  const [button, list] = wrap.children;
  const outside = document.createElement('main');
  const fire = (node, type, extra = {}) => {
    const event = { target: node, preventDefault() {}, stopPropagation() {}, ...extra };
    if (type === 'pointerdown' || type === 'click') for (const fn of docListeners[type] || []) fn(event);
    for (const fn of node === wrap || wrap.contains(node) ? wrap.listeners[type] || [] : []) fn(event);
    for (const fn of node.listeners[type] || []) fn(event);
  };
  const link = (code) => list.querySelectorAll('a').find((a) => a.getAttribute('data-ahv-lang-option') === code);
  const open = () => { fire(button, 'click'); assert.equal(list.hidden, false); assert.equal(button.getAttribute('aria-expanded'), 'true'); };
  return { wrap, button, list, outside, fire, link, open, document };
}

test('a Safari tap on another language keeps the list open until the link click (iOS/macOS Safari)', () => {
  const h = harness();
  h.open();
  const current = h.document.activeElement;
  assert.equal(current.getAttribute('data-ahv-lang-option'), 'de');
  const target = h.link('en');
  // Safari order: pointerdown -> (touch) -> mousedown -> focusout(relatedTarget null) -> mouseup -> click
  h.fire(target, 'pointerdown');
  h.fire(current, 'focusout', { relatedTarget: null });
  assert.equal(h.list.hidden, false, 'the list must still be under the finger when the click arrives');
  assert.equal(target.href, '/');
});

test('every option survives the Safari press sequence, so repeated switches work', () => {
  for (const code of ['en', 'de', 'fr']) {
    const h = harness();
    h.open();
    h.fire(h.link(code), 'pointerdown');
    h.fire(h.document.activeElement, 'focusout', { relatedTarget: null });
    assert.equal(h.list.hidden, false, code);
  }
});

test('a press outside the switcher still closes it', () => {
  const h = harness();
  h.open();
  h.fire(h.outside, 'pointerdown');
  h.fire(h.document.activeElement, 'focusout', { relatedTarget: null });
  assert.equal(h.list.hidden, true);
  assert.equal(h.button.getAttribute('aria-expanded'), 'false');
});

test('keyboard focus leaving the switcher closes it even after an earlier press inside', () => {
  const h = harness();
  h.open();
  h.fire(h.link('fr'), 'pointerdown');
  h.fire(h.document.activeElement, 'focusout', { relatedTarget: h.outside });
  assert.equal(h.list.hidden, true);
});

test('focus moving between options keeps the list open', () => {
  const h = harness();
  h.open();
  h.fire(h.document.activeElement, 'focusout', { relatedTarget: h.link('fr') });
  assert.equal(h.list.hidden, false);
});
