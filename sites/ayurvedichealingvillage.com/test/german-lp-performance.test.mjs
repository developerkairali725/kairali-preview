import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { htmlToDOM, Element, Text } from 'html-react-parser';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../', import.meta.url));
const indexPath = path.join(root, 'campaign-v110/components/lp/index.tsx');
const german = 'behandlung-in-kerala';
const css = new Proxy({}, { get: (_, name) => String(name) });
const enquiry = props => React.createElement('form', { 'data-enquiry-fixture': props.pagePath || 'hero' }, props.heading);
const shell = props => React.createElement('main', null, props.children);

export function moduleLoader(indexSource) {
  const cache = new Map();
  function load(filename) {
    filename = path.resolve(filename);
    if (cache.has(filename)) return cache.get(filename).exports;
    const result = { exports: {} }; cache.set(filename, result);
    const source = filename === indexPath && indexSource !== undefined ? indexSource : fs.readFileSync(filename, 'utf8');
    const compiled = ts.transpileModule(source, { compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
    }}).outputText;
    const localRequire = name => {
      if (name.endsWith('.css')) return { __esModule: true, default: css };
      if (/\.(avif|webp|png|jpg)$/.test(name)) return { __esModule: true, default: {
        src: '/fixture/' + path.basename(name), width: 378, height: 335,
      }};
      if (name.endsWith('/EnquiryForm')) return { __esModule: true, default: enquiry };
      if (name.endsWith('/PageShell')) return { __esModule: true, default: shell };
      if (name.endsWith('/lp-metadata')) return { lpMetadata: () => ({}) };
      if (!name.startsWith('.')) return require(name);
      const base = path.resolve(path.dirname(filename), name);
      const resolved = [base, base + '.tsx', base + '.ts', path.join(base, 'index.tsx')].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
      assert.ok(resolved, `Resolve fixture import ${name}`);
      return load(resolved);
    };
    vm.runInNewContext(compiled, { module: result, exports: result.exports, require: localRequire, process }, { filename });
    return result.exports;
  }
  return load;
}

const load = moduleLoader();
const { LpHero } = load(indexPath);
const lpRoot = path.join(root, 'campaign-v110/pages/lp');
export const fixtureNames = fs.readdirSync(lpRoot).filter(name => fs.existsSync(path.join(lpRoot, name, 'content.ts')));
export const contentFor = name => load(path.join(lpRoot, name, 'content.ts')).default;
export function heroProps(c) {
  return { overline: c.hero.overline, title: c.hero.h1.map(x => typeof x === 'string' ? x : x.em || '').join(''),
    sub: c.hero.sub, doctor: c.hero.doctor, creds: c.hero.creds.map(x => ({ label: x.label, detail: x.detail })),
    photo: c.hero.photo, ctaLang: c.lang && c.lang !== 'en' ? 'en' : undefined,
    form: React.createElement('form', { 'data-enquiry-fixture': 'hero' }, c.enquiry.form.heading) };
}
export const renderHero = (Hero, props) => renderToStaticMarkup(React.createElement(Hero, props));
const nodes = html => htmlToDOM(html);
const find = (items, predicate) => items.flatMap(n => n instanceof Element ? [ ...(predicate(n) ? [n] : []), ...find(n.children, predicate) ] : []);
const text = n => n instanceof Text ? n.data : n instanceof Element ? n.children.map(text).join('') : '';
const hasClass = (n, name) => (n.attribs.class || '').split(/\s+/).includes(name);
const elements = (element, type) => !React.isValidElement(element) ? [] : [ ...(element.type === type ? [element] : []),
  ...React.Children.toArray(element.props.children).flatMap(child => elements(child, type)) ];

test('only the actual German LP page opts into stable native intro rendering', () => {
  for (const name of fixtureNames) {
    const Page = load(path.join(lpRoot, name, 'page.tsx')).default;
    const page = Page();
    assert.equal(page.props.stableIntro === true, name === german, name);
    const renderedPage = page.type(page.props);
    const hero = elements(renderedPage, LpHero);
    assert.equal(hero.length, 1, name);
    assert.equal(hero[0].props.stableIntro, name === german, name);
  }
});

test('German intro starts closed without JavaScript and retains exact desktop/mobile copy and label', () => {
  const c = contentFor(german), rendered = nodes(renderHero(LpHero, { ...heroProps(c), stableIntro: true }));
  assert.equal(c.hero.sub.length, 149);
  const desktop = find(rendered, n => hasClass(n, 'campaign-desktop-intro'));
  const mobile = find(rendered, n => n.name === 'details' && hasClass(n, 'campaign-mobile-detail'));
  assert.equal(desktop.length, 1); assert.equal(mobile.length, 1);
  assert.equal('open' in mobile[0].attribs, false);
  assert.equal(text(find(mobile, n => n.name === 'summary')[0]), 'Über dieses Programm');
  assert.equal(text(find(desktop, n => n.name === 'p')[0]), c.hero.sub);
  assert.equal(text(find(mobile, n => n.name === 'p')[0]), c.hero.sub);
  assert.equal(find(rendered, n => n.name === 'form').length, 1, 'the original hero form is not duplicated');
  assert.equal(find(rendered, n => n.attribs.id === 'hero-cta')[0].attribs.href, '#campaign-consultation');
});

test('German priority hint preserves the exact existing image attributes and asset', () => {
  const props = heroProps(contentFor(german));
  const normal = find(nodes(renderHero(LpHero, props)), n => n.name === 'img' && hasClass(n, 'ahv-hero-photo'))[0];
  const stable = find(nodes(renderHero(LpHero, { ...props, stableIntro: true })), n => n.name === 'img' && hasClass(n, 'ahv-hero-photo'))[0];
  assert.equal(stable.attribs.fetchpriority, 'high');
  assert.equal('fetchpriority' in normal.attribs, false);
  const attrs = { ...stable.attribs }; delete attrs.fetchpriority;
  assert.deepEqual(attrs, normal.attribs);
});

test('every other LP retains its default native-open intro and no new priority hint', () => {
  for (const name of fixtureNames.filter(name => name !== german)) {
    const props = heroProps(contentFor(name));
    const normal = renderHero(LpHero, props);
    assert.equal(normal, renderHero(LpHero, { ...props, stableIntro: false }), name);
    const rendered = nodes(normal);
    assert.equal(find(rendered, n => hasClass(n, 'campaign-responsive-intro')).length, 0, name);
    const details = find(rendered, n => n.name === 'details' && hasClass(n, 'campaign-mobile-detail'));
    assert.equal(details.length, 1, name); assert.ok('open' in details[0].attribs, name);
    assert.equal(find(details, n => n.name === 'p').length, 1, name);
    assert.equal(find(rendered, n => n.name === 'img' && 'fetchpriority' in n.attribs).length, 0, name);
  }
});

test('existing shared CSS chooses one visible native intro before hydration at the matching breakpoint', () => {
  const stylesheet = fs.readFileSync(path.join(root, 'campaign-v110/components/campaign-experience.css'), 'utf8');
  assert.match(stylesheet, /\.campaign-responsive-intro > \.campaign-desktop-intro \{ display:none; \}/);
  assert.match(stylesheet, /@media\(min-width:761px\)\s*\{\s*body\[data-ahv-campaign\][^}]*\.campaign-desktop-intro \{ display:block; \}/);
  assert.match(stylesheet, /\.campaign-responsive-intro > \.campaign-mobile-detail \{ display:none; \}/);
  assert.match(fs.readFileSync(path.join(root, 'campaign-v110/components/PageShell.tsx'), 'utf8'), /import "\.\/campaign-experience\.css"/);
});
