import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import zlib from 'node:zlib';
import { articleContactHeadingHtml, repairArticleContactHeading } from '../app/(english)/_families/article-contact-heading.mjs';

// N08 batch 4: reviewed heading-level corrections on eight article routes, in every released locale snapshot.
const locales = ['en', 'hi', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'ru', 'ar', 'zh-Hans', 'ja', 'ko'];
const expected = {
  '/why-get-training-in-ayurveda/': ['h4', 'h2', 7],
  '/why-pick-a-yoga-or-yoga-retreat/': ['h4', 'h2', 9],
  '/meditation/': ['h4', 'h2', 5],
  '/new-to-ayurveda/': ['h3', 'h2', 6],
  '/new-to-yoga/': ['h3', 'h2', 10],
  '/yoga-retreats-for-everyone/': ['h4', 'h3', 2],
  '/ayurveda-workshop/': ['h4', 'h3', 2],
  '/karkidaka-chikitsha-or-monsoon-wellness.html': ['h4', 'h3', 10],
};
const snapshot = (route, locale) => {
  const name = route.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9._-]+/gi, '_') + '.html';
  const file = locale === 'en' ? 'english-candidate/prerender/' + name : `l10n/prerender/${locale}/${name}.gz`;
  const raw = fs.readFileSync(file);
  return (file.endsWith('.gz') ? zlib.gunzipSync(raw) : raw).toString();
};
const levels = html => [...html.matchAll(/<h([1-6])\b/g)].map(m => Number(m[1]));
const tagNamesOnly = html => html.replace(/<(\/?)h[1-6]\b/g, '<$1h');

for (const [route, [from, to, count]] of Object.entries(expected)) test(`${route} corrects only its reviewed ${from} headings to ${to} in every locale`, () => {
  for (const locale of locales) {
    const html = snapshot(route, locale);
    const fixed = articleContactHeadingHtml(html, route);
    const before = levels(html), after = levels(fixed);
    assert.equal(before.length, after.length, locale);
    const changed = before.map((level, i) => level !== after[i]).filter(Boolean).length;
    assert.equal(changed, count, locale);
    before.forEach((level, i) => { if (level !== after[i]) { assert.equal('h' + level, from, locale); assert.equal('h' + after[i], to, locale); } });
    // Every attribute, inline style, text and child is byte-identical; only heading tag names changed.
    assert.equal(tagNamesOnly(fixed), tagNamesOnly(html), locale);
    assert.equal(fixed.length, html.length, locale);
    // One H1, no skipped level after it.
    assert.equal(after.filter(level => level === 1).length, 1, locale);
    after.forEach((level, i) => { if (i) assert.ok(level <= after[i - 1] + 1, `${locale} heading ${i}: h${after[i - 1]} -> h${level}`); });
    assert.equal(articleContactHeadingHtml(fixed, route), fixed, locale);
    assert.equal(articleContactHeadingHtml(html, '/unrelated/'), html, locale);
  }
});

test('the existing contact heading correction is unchanged', () => {
  assert.deepEqual(repairArticleContactHeading(null, '/ayurveda-treatment/'), ['h4', 'h3', [12]]);
  const html = '<h4 data-source-pointer="/sections/3/c/3/c/12" style="x">Contact</h4><h4 data-source-pointer="/sections/3/c/3/c/120">Other</h4><h4>Plain</h4>';
  assert.equal(articleContactHeadingHtml(html, '/ayurveda-treatment/'), '<h3 data-source-pointer="/sections/3/c/3/c/12" style="x">Contact</h3><h4 data-source-pointer="/sections/3/c/3/c/120">Other</h4><h4>Plain</h4>');
  for (const route of ['/', '/about-us/', '/yoga-retreats/', '/new-to-yoga-teacher-training/']) assert.equal(repairArticleContactHeading(null, route), undefined);
});

// Minimal DOM: the serialized live repair must retag exactly the headings the server snapshot corrects.
function fakeRoot(html) {
  const children = [];
  const doc = { createElement: tag => element(tag, []) };
  function element(tag, attributes) {
    return { tagName: tag.toUpperCase(), ownerDocument: doc, kids: [], attributes,
      setAttribute(name, value) { const found = this.attributes.find(a => a.name === name); if (found) found.value = value; else this.attributes.push({ name, value }); },
      getAttribute(name) { return this.attributes.find(a => a.name === name)?.value ?? null; },
      get firstChild() { return this.kids[0] || null; },
      appendChild(child) { if (child.parent) child.parent.kids.splice(child.parent.kids.indexOf(child), 1); child.parent = this; this.kids.push(child); },
      replaceWith(next) { children[children.indexOf(this)] = next; } };
  }
  for (const m of html.matchAll(/<(h[1-6])\b([^>]*)>/g)) {
    const node = element(m[1], [...m[2].matchAll(/([a-z-]+)="([^"]*)"/g)].map(a => ({ name: a[1], value: a[2] })));
    node.appendChild({ text: 'child' });
    children.push(node);
  }
  const matches = (node, selector) => selector.split(',').some(part => {
    const s = /^(h[1-6])(?:\[data-source-pointer="([^"]+)"\])?$/.exec(part);
    assert.ok(s, 'unexpected selector ' + part);
    return node.tagName === s[1].toUpperCase() && (!s[2] || node.getAttribute('data-source-pointer') === s[2]);
  });
  return { children, root: { querySelectorAll: selector => children.filter(node => matches(node, selector)) } };
}

for (const route of Object.keys(expected)) test(`${route} live repair matches the server snapshot correction`, () => {
  const run = vm.runInNewContext('(' + repairArticleContactHeading.toString() + ')');
  for (const locale of locales) {
    const html = snapshot(route, locale);
    const dom = fakeRoot(html);
    const attrsBefore = dom.children.map(node => JSON.stringify(node.attributes));
    run(dom.root, route);
    assert.deepEqual(dom.children.map(node => Number(node.tagName.slice(1))), levels(articleContactHeadingHtml(html, route)), locale);
    assert.deepEqual(dom.children.map(node => JSON.stringify(node.attributes)), attrsBefore, locale);
    for (const node of dom.children) assert.equal(node.kids.length, 1, locale);
    run(dom.root, '/unrelated/');
  }
});
