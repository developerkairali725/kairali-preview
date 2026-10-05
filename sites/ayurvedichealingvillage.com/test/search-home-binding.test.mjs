import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

class Element extends EventTarget {
  constructor() { super(); this.attrs = {}; this.children = []; this.isConnected = true; this.value = ''; this.style = {}; }
  setAttribute(k, v) { this.attrs[k] = v; }
  getAttribute(k) { return this.attrs[k] ?? null; }
  removeAttribute(k) { delete this.attrs[k]; }
  appendChild(e) { e.parentNode = this; e.isConnected = true; this.children.push(e); }
  remove() { this.isConnected = false; if (this.parentNode) this.parentNode.children = this.parentNode.children.filter(e => e !== this); }
  querySelector(s) { return s === '#ahvs-home-list' ? this.children.find(e => e.id === 'ahvs-home-list') : null; }
  querySelectorAll() { return []; }
  contains(e) { return this.children.includes(e); }
}
const until = async predicate => {
  for (let n = 0; n < 100; n++) { if (predicate()) return; await new Promise(resolve => setTimeout(resolve, 10)); }
  assert.fail('Search suggestions did not become ready');
};

test('homepage suggestions bind a marked snapshot and rebind a replaced input once', async () => {
  const doc = new Element(), form = new Element(), host = new Element();
  let input = new Element(), onMutation;
  host.appendChild(input);
  form.setAttribute('data-ahvs-suggest', '1'); // Serialized marker has no listeners.
  form.querySelector = selector => selector === 'input[name="q"]' ? input : null;
  doc.querySelector = selector => selector === 'form[data-ahv-home-finder="1"]' ? form : null;
  doc.getElementById = () => new Element();
  doc.createElement = () => new Element();
  doc.readyState = 'complete';
  const index = JSON.parse(fs.readFileSync(new URL('../public/ahv/search-index.json', import.meta.url)));
  const ctx = { document: doc, Event, AbortController, setTimeout, clearTimeout, addEventListener() {},
    getComputedStyle: () => ({ position: 'relative' }),
    fetch: async () => ({ ok: true, json: async () => index }),
    MutationObserver: class { constructor(fn) { onMutation = fn; } observe() {} }
  };
  vm.runInNewContext(fs.readFileSync(new URL('../public/design/search.js', import.meta.url), 'utf8'), ctx);
  input.value = 'offers'; input.dispatchEvent(new Event('input'));
  await until(() => host.querySelector('#ahvs-home-list')?.innerHTML?.includes('href="/offers/"'));
  const oldInput = input, oldBox = host.querySelector('#ahvs-home-list');
  input = new Element(); input.value = 'awards'; oldInput.remove(); host.appendChild(input);
  onMutation();
  await until(() => host.querySelector('#ahvs-home-list') !== oldBox);
  await until(() => host.querySelector('#ahvs-home-list')?.innerHTML?.includes('href="/awards-and-accreditations/"'));
  const box = host.querySelector('#ahvs-home-list');
  onMutation(); onMutation();
  await new Promise(resolve => setTimeout(resolve, 20));
  assert.equal(host.querySelector('#ahvs-home-list'), box);
  assert.equal(host.children.filter(e => e.id === 'ahvs-home-list').length, 1);
  assert.equal(oldBox.isConnected, false);
});
