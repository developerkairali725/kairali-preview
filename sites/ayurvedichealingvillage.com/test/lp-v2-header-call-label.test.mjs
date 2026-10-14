import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import { productionCampaign, PRODUCTION_SLUGS } from '../campaign-v2/production/load.ts';
import { pageUi } from '../campaign-v2/production/ui.ts';
import { contact, site } from '../campaign-v110/lib/site.ts';
import { whatsappHref } from '../campaign-v2/production/whatsapp.ts';
import { candidateSource } from './fixtures/train-b-20261015.mjs';
const require = createRequire(import.meta.url);
const source = fs.readFileSync(new URL('../campaign-v2/sections/Header.tsx', import.meta.url), 'utf8');
const delta = '{production ? `${ui.header.call} · ` : ""}';
const baseline = source.replace(delta, '');
function load(text) {
  const mod = { exports: {} };
  const code = ts.transpileModule(text, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const req = name => {
    if (name === 'next/image') return props => React.createElement('img', props);
    if (name.endsWith('/site.ts')) return { contact, site };
    if (name.endsWith('/ui.ts')) return { pageUi };
    if (name.endsWith('/LocaleSwitcher')) return () => null;
    if (name.endsWith('/icons')) return { PhoneIcon: () => null, WaIcon: () => null };
    // Train B: Header.tsx imports Train A batch 7's page-context WhatsApp link (production/whatsapp.ts).
    if (name.endsWith('/whatsapp.ts')) return { whatsappHref };
    return require(name);
  };
  vm.runInNewContext(code, { module: mod, exports: mod.exports, require: req });
  return mod.exports.default;
}
const Header = load(source), Before = load(baseline);
const render = (Component, c, req) => renderToStaticMarkup(React.createElement(Component, { c, req, v: c.defaultVariant }));
test('24 production headers clarify Call while preserving every other rendered control', () => {
  assert.equal(PRODUCTION_SLUGS.length, 24);
  const locales = new Set(), variants = new Set();
  for (const slug of PRODUCTION_SLUGS) {
    const c = productionCampaign(slug);
    const req = { surface: 'production', locale: c.locales[0], currency: 'INR' };
    const ui = pageUi(req); locales.add(req.locale); variants.add(c.defaultVariant);
    const before = render(Before, c, req), after = render(Header, c, req);
    const start = after.indexOf('<a class="lp-header__phone"');
    const end = after.indexOf('</a>', start);
    const anchor = after.slice(start, end + 4);
    assert.ok(anchor.endsWith(`>${ui.header.call} · ${contact.phone.display}</a>`), slug);
    assert.ok(anchor.includes(`href="${contact.phone.href}"`), slug);
    assert.ok(anchor.includes('data-track-cta="call"'), slug);
    assert.equal(after.replace(`>${ui.header.call} · ${contact.phone.display}</a>`, `>${contact.phone.display}</a>`), before, slug);
    assert.ok(after.includes(`aria-label="${ui.header.callAria} ${contact.phone.display}"`), slug);
    // Train B: the header WhatsApp link is Train A batch 7's page-context link (bare where no template exists).
    assert.ok(after.includes(`href="${whatsappHref(c, req).replaceAll('&', '&amp;')}"`), slug);
    assert.ok(whatsappHref(c, req).startsWith(`https://wa.me/${contact.whatsapp.number}`), slug);
  }
  assert.deepEqual([...locales].sort(), ['de', 'en', 'ru']);
  assert.deepEqual([...variants].sort(), ['A', 'B', 'C', 'D']);
});
test('change is confined to the production label; historical Header source and kit output retained', () => {
  assert.equal(source.split(delta).length, 2);
  // Train B: the integrated Header also carries Train A batch 7's WhatsApp delta; candidateSource gives exactly this
  // candidate's own bytes (c54e2795e plus the Call prefix), every Train A/B delta checked.
  const own = candidateSource('train C02', 'campaign-v2/sections/Header.tsx', source);
  assert.equal(own.split(delta).length, 2);
  assert.equal(crypto.createHash('sha256').update(own.replace(delta, '')).digest('hex'), '3eb36357835c46089a286fa2d99477d7e429efee3c80bac59d5309f5ce29842d');
  const c = productionCampaign(PRODUCTION_SLUGS[0]);
  const req = { surface: 'preview', locale: 'en', currency: 'INR' };
  assert.equal(render(Header,c,req),render(Before,c,req));
});
