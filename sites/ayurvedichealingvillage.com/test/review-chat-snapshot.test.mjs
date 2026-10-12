import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function binding(source, openChat) {
  const start = source.indexOf('  function chatLinks(f)');
  const end = source.indexOf('  // Owner 5 Oct:', start);
  assert.ok(start >= 0 && end > start);
  const context = vm.createContext({ openChat });
  vm.runInContext(source.slice(start, end) + '\nthis.bind = chatLinks;', context);
  return context.bind;
}

function anchor(attributes) {
  const node = new EventTarget();
  node.attributes = { ...attributes };
  node.getAttribute = key => node.attributes[key] ?? null;
  node.setAttribute = (key, value) => { node.attributes[key] = value; };
  node.removeAttribute = key => { delete node.attributes[key]; };
  return node;
}

const source = fs.readFileSync('public/design/review-chrome.js', 'utf8');

test('serialized footer chat link regains its listener and repeated passes invoke it once', () => {
  const node = anchor({ href: '#chat', 'data-ahv-chat': '1' });
  let calls = 0;
  const bind = binding(source, event => { event.preventDefault(); calls++; });
  const footer = { querySelectorAll: () => [node] };
  for (let i = 0; i < 5; i++) bind(footer);
  const event = new Event('click', { cancelable: true });
  node.dispatchEvent(event);
  assert.equal(calls, 1);
  assert.equal(event.defaultPrevented, true);
});

test('cloned snapshot node binds independently while a legacy link retains the shared controller', () => {
  const original = anchor({ href: 'https://chat.kairali.com/', target: '_blank' });
  let calls = 0;
  const bind = binding(source, () => { calls++; });
  bind({ querySelectorAll: () => [original] });
  assert.equal(original.getAttribute('href'), '#chat');
  assert.equal(original.getAttribute('target'), null);
  const clone = anchor(original.attributes);
  bind({ querySelectorAll: () => [clone] });
  original.dispatchEvent(new Event('click'));
  clone.dispatchEvent(new Event('click'));
  assert.equal(calls, 2);
});

test('every locale reviewed runtime carries the same snapshot-safe binding', () => {
  const locales = fs.readdirSync('public/ahv/l10n').filter(locale => fs.existsSync(`public/ahv/l10n/${locale}/design/review-chrome.js`));
  assert.equal(locales.length, 12);
  for (const locale of locales) {
    const localized = fs.readFileSync(`public/ahv/l10n/${locale}/design/review-chrome.js`, 'utf8');
    let calls = 0;
    const bind = binding(localized, () => { calls++; });
    const node = anchor({ href: '#chat', 'data-ahv-chat': '1' });
    const footer = { querySelectorAll: () => [node] };
    bind(footer); bind(footer); node.dispatchEvent(new Event('click'));
    assert.equal(calls, 1, locale);
  }
});

test('serialized header triggers regain the existing dialog action exactly once', () => {
  const files = ['public/design/review-chrome.js', ...fs.readdirSync('public/ahv/l10n')
    .map(locale => `public/ahv/l10n/${locale}/design/review-chrome.js`).filter(file => fs.existsSync(file))];
  for (const file of files) {
    const runtime = fs.readFileSync(file, 'utf8');
    const start = runtime.indexOf('  function bindContactTrigger(button)');
    const end = runtime.indexOf('  function contactTrigger()', start);
    assert.ok(start >= 0 && end > start, file);
    let calls = 0;
    const context = vm.createContext({ openContactChoices: () => { calls++; } });
    vm.runInContext(runtime.slice(start, end) + '\nthis.bind = bindContactTrigger;', context);
    const original = anchor({ class: 'ahv-contact-trigger', 'aria-controls': 'ahv-contact-controls' });
    context.bind(original); context.bind(original);
    original.dispatchEvent(new Event('click'));
    const clone = anchor(original.attributes);
    context.bind(clone); context.bind(clone);
    clone.dispatchEvent(new Event('click'));
    assert.equal(calls, 2, file);
  }
});
