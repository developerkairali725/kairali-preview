import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const source = readFileSync(process.env.AHV_STATIC_DESIGN_SOURCE || new URL('app/(english)/_families/static-design-view.tsx', root), 'utf8');
const start = source.indexOf('  function closeLanguages() {');
const end = source.indexOf('  if (cfg.staticTariffs) {', start);
assert.ok(start > 0 && end > start, 'exercise the actual static language-menu runtime');
const script = source.slice(start, end);
const routes = JSON.parse(readFileSync(new URL('l10n/routes.json', root))).routes;
const locales = JSON.parse(readFileSync(new URL('l10n/locales.json', root)));
const optionsFor = path => Object.keys(locales).map(code => ({ code, href: code === 'en' ? path : routes[path]?.[code] })).filter(option => option.href);

class Element {
  constructor(tag, attrs = {}) { this.tag = tag; this.attrs = { ...attrs }; this.children = []; this.listeners = {}; this.hidden = false; }
  append(child) { child.parent = this; this.children.push(child); return child; }
  contains(node) { return node === this || this.children.some(child => child.contains(node)); }
  getAttribute(name) { return this.attrs[name] ?? null; }
  setAttribute(name, value) { this.attrs[name] = value; }
  matches(selector) {
    if (selector === 'a[data-ahv-lang-option]') return this.tag === 'a' && Object.hasOwn(this.attrs, 'data-ahv-lang-option');
    if (selector === '.ahv-lang-btn[aria-expanded=true]') return this.matches('.ahv-lang-btn') && this.attrs['aria-expanded'] === 'true';
    if (selector === '.ahv-lang-btn' || selector === '.ahv-lang-list') return (this.attrs.class || '').split(' ').includes(selector.slice(1));
    throw new Error(`Unexpected selector: ${selector}`);
  }
  closest(selector) { return this.matches(selector) ? this : this.parent?.closest(selector) || null; }
  querySelectorAll(selector) { return this.children.flatMap(child => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]); }
  addEventListener(type, listener) { (this.listeners[type] ||= []).push(listener); }
}

function harness({ path = '/', config = { locale: { options: optionsFor(path) } }, storageThrows = false, storageGetterThrows = false } = {}) {
  const host = new Element('main');
  const button = host.append(new Element('button', { class: 'ahv-lang-btn', 'aria-expanded': 'false', 'aria-controls': 'languages' }));
  const list = host.append(new Element('ul', { class: 'ahv-lang-list' }));
  list.hidden = true;
  const writes = [], documentListeners = {};
  const context = { host, cfg: config, document: {
    getElementById: id => id === 'languages' ? list : null,
    addEventListener: (type, listener) => { (documentListeners[type] ||= []).push(listener); },
  } };
  Object.defineProperty(context, 'localStorage', { get() {
    if (storageGetterThrows) throw new Error('SecurityError');
    return { setItem(key, value) { if (storageThrows) throw new Error('QuotaExceededError'); writes.push([key, value]); } };
  } });
  vm.runInNewContext(script, context);
  function click(target, { hostOnly = false, ...extras } = {}) {
    const event = { target, ...extras, preventDefault() { assert.fail('normal anchor navigation must remain available'); }, stopPropagation() { assert.fail('normal event propagation must remain available'); } };
    if (hostOnly || host.contains(target)) for (const listener of host.listeners.click || []) listener(event);
    if (!hostOnly) for (const listener of documentListeners.click || []) listener(event);
    return target;
  }
  const anchor = (code = 'hi', href = optionsFor(path).find(option => option.code === code)?.href, parent = list) => parent.append(new Element('a', { 'data-ahv-lang-option': code, ...(href === undefined ? {} : { href }) }));
  return { host, button, list, writes, click, anchor, escape() { for (const listener of documentListeners.keydown || []) listener({ key: 'Escape' }); } };
}

for (const [path, name] of [['/', 'index'], ['/contact-us/', 'contact-us'], ['/panchakarma-therapy/', 'panchakarma-therapy']]) {
  for (const directory of ['english-candidate/prerender', 'public/ahv/static']) {
    test(`${path} ${directory}: all 13 captured language links save their configured preference`, () => {
      const html = readFileSync(new URL(`${directory}/${name}.html`, root), 'utf8');
      const tags = [...html.matchAll(/<a\b[^>]*\bdata-ahv-lang-option="([^"]+)"[^>]*>/g)];
      const captured = new Map(tags.map(match => [match[1], match[0].match(/\bhref="([^"]+)"/)?.[1]]));
      assert.equal(captured.size, 13);
      assert.deepEqual([...captured], optionsFor(path).map(option => [option.code, option.href]));
      const h = harness({ path });
      assert.deepEqual(h.writes, [], 'initialization does not set a preference');
      for (const [code, href] of captured) {
        const link = h.anchor(code, href);
        const nestedLabel = link.append(new Element('span'));
        h.click(nestedLabel);
        assert.deepEqual(h.writes.at(-1), ['ahv-locale', code]);
        assert.equal(link.getAttribute('href'), href, 'the captured destination stays unchanged');
      }
      assert.equal(h.writes.length, 13, 'one preference write per click');
    });
  }
}

test('a direct or keyboard-generated anchor click and modified click retain native navigation', () => {
  const h = harness();
  const link = h.anchor();
  h.click(link, { detail: 0 });
  h.click(link, { ctrlKey: true, metaKey: true });
  assert.deepEqual(h.writes, [['ahv-locale', 'hi'], ['ahv-locale', 'hi']]);
});

test('a later inserted captured language link uses the same delegated listener', () => {
  const h = harness();
  const link = h.anchor('de');
  h.click(link);
  assert.deepEqual(h.writes, [['ahv-locale', 'de']]);
});

for (const mode of ['storageThrows', 'storageGetterThrows']) {
  test(`${mode}: blocked storage leaves the language link usable`, () => {
    const h = harness({ [mode]: true });
    const link = h.anchor();
    assert.doesNotThrow(() => h.click(link));
    assert.equal(link.getAttribute('href'), '/hi/');
    assert.deepEqual(h.writes, []);
  });
}

test('unknown, mismatched, external, missing and unrelated destinations do not persist', () => {
  const h = harness();
  for (const [code, href] of [['xx', '/xx/'], ['HI', '/hi/'], ['hi', '/de/'], ['hi', 'https://example.test/hi/'], ['hi', '#language'], ['hi', '/hi/?unrelated=1'], ['hi', '']]) h.click(h.anchor(code, href));
  const missingHref = h.anchor();
  delete missingHref.attrs.href;
  h.click(missingHref);
  const ordinary = h.list.append(new Element('a', { href: '/hi/' }));
  h.click(ordinary);
  assert.deepEqual(h.writes, []);
});

test('marked non-anchor elements and valid links outside the design host cannot write', () => {
  const h = harness();
  const nonLink = h.list.append(new Element('div', { 'data-ahv-lang-option': 'hi', href: '/hi/' }));
  h.click(nonLink);
  const externalParent = new Element('aside');
  const externalLink = h.anchor('hi', '/hi/', externalParent);
  h.click(externalLink);
  h.click(externalLink, { hostOnly: true }); // Even synthetic delivery must respect the host boundary.
  assert.deepEqual(h.writes, []);
});

test('missing or malformed locale options fail closed without intercepting the link', () => {
  for (const config of [{}, { locale: null }, { locale: {} }, { locale: { options: null } }, { locale: { options: {} } }, { locale: { options: [] } }]) {
    const h = harness({ config });
    assert.doesNotThrow(() => h.click(h.anchor()));
    assert.deepEqual(h.writes, []);
  }
});

test('non-element targets cannot write or fail the new host listener', () => {
  const h = harness();
  for (const target of [null, {}, { nodeType: 3 }]) assert.doesNotThrow(() => h.click(target, { hostOnly: true }));
  assert.deepEqual(h.writes, []);
});

test('opening, closing, Escape and outside clicks preserve existing dropdown behavior', () => {
  const h = harness();
  h.click(h.button);
  assert.equal(h.button.getAttribute('aria-expanded'), 'true');
  assert.equal(h.list.hidden, false);
  h.click(h.button);
  assert.equal(h.list.hidden, true);
  h.click(h.button);
  h.escape();
  assert.equal(h.list.hidden, true);
  assert.equal(h.button.getAttribute('aria-expanded'), 'false');
  h.click(h.button);
  h.click(new Element('aside'));
  assert.equal(h.list.hidden, true);
  assert.deepEqual(h.writes, []);
});
