import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { offersFlow } from '../app/(english)/_families/offers-flow.mjs';

const { htmlToDOM } = createRequire(import.meta.url)('html-react-parser');
const directory = 'campaign-v110/pages/offers/';
const slugs = ['senior-citizen-offer', 'olympics-and-paralympics-offer', 'defence-and-paramilitary'];
const read = slug => fs.readFileSync(directory + slug + '/staging.html', 'utf8');
const nodes = slug => htmlToDOM(read(slug));
const walk = (list, predicate) => list.flatMap(node => [
  ...(predicate(node) ? [node] : []),
  ...walk(node.children ?? [], predicate),
]);
const shape = list => list.filter(node => node.type === 'tag').map(node => ({
  tag: node.name,
  attributes: Object.fromEntries(Object.entries(node.attribs).filter(([key]) => !['src', 'alt'].includes(key)).sort()),
  // Eligibility text can need extra paragraphs; the surrounding terms card,
  // its position, original class and financial list stay the same.
  children: node.attribs.id === 'offer-terms' ? [] : shape(node.children ?? []),
}));
const text = list => list.map(node => node.type === 'text' ? node.data : text(node.children ?? [])).join(' ');

test('the existing server layout pass preserves elderly layout for both audience pages', () => {
  const require = createRequire(import.meta.url);
  const ts = require('typescript');
  const source = fs.readFileSync('campaign-v110/components/dc/dc-layout.ts', 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(compiled, { require, module, exports: module.exports });
  const expected = shape(module.exports.layoutCampaign(nodes(slugs[0])));
  for (const slug of slugs.slice(1)) {
    assert.deepEqual(shape(module.exports.layoutCampaign(nodes(slug))), expected, slug);
  }
});

for (const slug of slugs.slice(1)) {
  test(`${slug}: elderly section structure, styles and form slots are preserved`, () => {
    assert.deepEqual(shape(nodes(slug)), shape(nodes(slugs[0])));
    assert.equal(walk(nodes(slug), node => node.attribs?.['data-slot'] === 'hero-cta').length, 1);
    assert.equal(walk(nodes(slug), node => node.attribs?.['data-slot'] === 'enquiry-form').length, 1);
    const meta = JSON.parse(fs.readFileSync(directory + slug + '/meta.json'));
    assert.equal(meta.rootAttrs['data-ahv-route'], `/offers/${slug}/`);
    assert.equal(meta.rootAttrs['data-ahv-family'], 'campaign-retreat');
    assert.equal(meta.head.canonical, `https://ayurvedichealingvillage.com/offers/${slug}/`);
    assert.ok(fs.existsSync(`app/(campaign)/offers/${slug}/page.tsx`));
  });

  test(`${slug}: the approved programme-rate rules and source photographs remain intact`, () => {
    const body = text(nodes(slug));
    assert.match(body, /10% for 3–13 nights, 15% for 14–20 nights and 20% for 21 nights or more/);
    assert.match(body, /1–2 nights use regular programme rates/);
    assert.match(body, /Benefits do not stack/);
    assert.match(body, /treatment-package price before tax/);
    assert.doesNotMatch(body, /30%|free treatment|tax.deductib|guaranteed recovery|improved performance|geriatric|ageing bodies/i);
    for (const image of walk(nodes(slug), node => node.name === 'img')) {
      assert.ok(fs.existsSync('public' + image.attribs.src), image.attribs.src);
    }
  });
}

test('eligibility is not broadened from the existing audience records', () => {
  const athletes = text(nodes(slugs[1]));
  assert.match(athletes, /eligible Olympic and Paralympic athletes/);
  assert.doesNotMatch(athletes, /all athletes|all sportspeople|For Seniors/);
  const defence = text(nodes(slugs[2]));
  assert.match(defence, /Central Armed Police Forces \(CAPFs\) and Assam Rifles/);
  assert.match(defence, /spouses, parents and children/);
  assert.match(defence, /Family members may book and travel independently/);
  assert.match(defence, /please do not send service documents through the enquiry form/);
});

for (const variant of ['desktop', 'mobile', 'ssr']) {
  test(`${variant}: matching centred programme CTAs precede terms and resolve to the existing pages`, () => {
    const source = variant === 'ssr'
      ? fs.readFileSync('english-candidate/prerender/offers.html', 'utf8')
      : JSON.parse(fs.readFileSync(`public/ahv/views/ahv-template-offers-deals-and-gift-vouchers-${variant}.json`)).template;
    const result = offersFlow(source, '/offers/');
    const dom = htmlToDOM(result);
    const buttons = walk(dom, node => node.attribs?.['data-care-flow']);
    // The phone upper cards use divs; all three primary and three care cards
    // still need a matching programme link before their rates.
    assert.equal(buttons.length, 6);
    const stylesheet = walk(dom, node => node.name === 'style' && node.attribs?.['data-care-flow-style']);
    assert.equal(stylesheet.length, 1);
    assert.match(text(stylesheet), /#ahv-design-root\[data-ahv-route="\/offers\/"\] \.ahv-care-cta-row a\[data-care-flow\]\{background:#5A4420!important;color:#F7F4EA!important\}/);
    for (const slug of slugs) {
      const button = buttons.find(node => node.attribs.href === `/offers/${slug}/`);
      assert.ok(button, slug);
      assert.match(button.parent.attribs.style, /justify-content:center/);
      assert.match(button.attribs.style, /text-align:center/);
      assert.match(button.attribs.style, /min-height:52px/);
      assert.match(button.attribs.style, /background:#5A4420;color:#F7F4EA/);
      assert.doesNotMatch(button.attribs.style, /!important/, 'React style props must use valid CSS values');
      let card=button.parent;
      while(card.parent && !walk(card.children ?? [],n=>/^h[1-6]$/.test(n.name??'')).length)card=card.parent;
      const serialized = text([card]);
      assert.ok(serialized.indexOf('Explore') < (serialized.indexOf('10%') < 0 ? Infinity : serialized.indexOf('10%')));
    }
    assert.doesNotMatch(result, /href="\/offers\/defence-paramilitary-personnel-get-upto-30-off\/"/);
    const ids = walk(dom, node => node.attribs?.id).map(node => node.attribs.id);
    assert.equal(new Set(ids).size, ids.length, 'No duplicate jump targets');
    assert.equal(offersFlow(result, '/offers/'), result);
    assert.equal(offersFlow(source, '/offers/', 'de'), source);
  });
}

test('the shared CTA palette passes normal-text WCAG AA contrast', () => {
  const luminance = hex => hex.match(/\w\w/g).map(s => parseInt(s, 16) / 255)
    .map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)
    .reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
  const dark = luminance('5A4420'), light = luminance('F7F4EA');
  assert.ok((light + .05) / (dark + .05) >= 4.5);
});

for (const variant of ['desktop', 'mobile']) test(`${variant}: audience cards use the approved matching care photographs`, () => {
  const source=JSON.parse(fs.readFileSync(`public/ahv/views/ahv-template-offers-deals-and-gift-vouchers-${variant}.json`)).template;
  const dom=htmlToDOM(offersFlow(source,'/offers/'));
  for(const [flow,photo] of [['athlete','yoga-side-female-patient-02.webp'],['defence','hero-detail-cloth-herbal-poultice-01.webp']]){
    const button=walk(dom,n=>n.attribs?.['data-care-flow']===flow)[0];
    let card=button;while(card.parent && !walk([card],n=>n.name==='img').length)card=card.parent;
    assert.ok(walk([card],n=>n.name==='img'&&n.attribs.src.endsWith(photo)).length,flow);
  }
});

test('defence proof and enquiry rules remain separate readable paragraphs', () => {
  const terms=walk(nodes('defence-and-paramilitary'),node=>node.attribs?.id==='offer-terms')[0];
  const paragraphs=walk([terms],node=>node.name==='p').map(node=>text([node]));
  assert.ok(paragraphs.some(value=>value.startsWith('A service ID, veteran or pensioner card')));
  assert.ok(paragraphs.some(value=>value.startsWith('No promo code or document upload')));
  assert.ok(paragraphs.some(value=>value.startsWith('If usual proof is unavailable')));
});

test('eligibility paragraphs override the inherited first-section hero colour', () => {
  const css=fs.readFileSync('campaign-v110/components/dc/dc-overrides.css','utf8');
  assert.match(css,/#consult > #offer-terms :is\(p, li\) \{\s*color: var\(--ink\) !important;/);
});

test('the offers enhancer works when serialized into the existing browser boot', () => {
  const source = JSON.parse(fs.readFileSync('public/ahv/views/ahv-template-offers-deals-and-gift-vouchers-desktop.json')).template;
  const browserEnhancer = vm.runInNewContext(`(${offersFlow.toString()})`);
  assert.equal(browserEnhancer(source, '/offers/'), offersFlow(source, '/offers/'));
});
