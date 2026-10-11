import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { phoneCriticalMedia, descriptiveAwardLinks, firstCriticalImage } from '../app/(english)/_families/critical-media.mjs';
import { installLazyImgOrder } from '../app/(english)/_families/media-loading.mjs';

test('Digestive candidate uses its phone hero derivative and the matching priority preload', () => {
  const route = '/digestive-wellness-gut-health-yoga-therapy/';
  const original = '/ahv/assets/img/digestive.webp', derivative = '/ahv/assets/img/digestive-768-hero.avif';
  const html = `<div style="background-image:url(${original})"></div>`;
  const serializable = new Function(`return (${phoneCriticalMedia.toString()})`)();
  assert.equal(serializable(html, route), html.replace(original, derivative));
  assert.equal(firstCriticalImage(serializable(html, route), route), derivative);
  assert.equal(phoneCriticalMedia(html, '/other/'), phoneCriticalMedia(html));
  for (const variant of ['mobile', 'desktop']) {
    const view = JSON.parse(fs.readFileSync(`public/ahv/views/ahv-page-digestive-wellness-gut-health-${variant}.json`, 'utf8'));
    assert.ok(view.template.includes(original));
  }
});

test('held Weight keeps its original hero and no new preload', () => {
  const weight = '<img src="/ahv/assets/img/weightloss.webp">';
  assert.equal(phoneCriticalMedia(weight, '/weight-loss-programme/'), weight);
  assert.equal(firstCriticalImage(phoneCriticalMedia(weight), '/weight-loss-programme/'), null);
});

test('runtime IMG src interception maps the Digestive hero on its own route and elsewhere', () => {
  for (const route of ['/digestive-wellness-gut-health-yoga-therapy/', '/other/']) {
    class Element {
      constructor() { this.tagName = 'IMG'; this.isConnected = true; this.attrs = {}; }
      setAttribute(name, value) { this.attrs[name] = value; }
      hasAttribute(name) { return Object.hasOwn(this.attrs, name); }
    }
    const win = { Element, matchMedia: () => ({ matches: true }), queueMicrotask };
    installLazyImgOrder(win, null, src => phoneCriticalMedia(src, route));
    const img = new Element();
    img.setAttribute('src', '/ahv/assets/img/digestive.webp');
    assert.equal(img.attrs.src, '/ahv/assets/img/digestive-768-hero.avif');
  }
});

test('Digestive below-fold yoga image keeps its authored lazy/low intent in snapshots', () => {
  const route = '/digestive-wellness-gut-health-yoga-therapy/';
  const src = '/ahv/assets/img/YOGA-AND-MEDITATION-benefits-min.webp';
  const promoted = `<img fetchpriority="high" data-dc-tpl="72" fetchpriority="low" src="${src}" alt="Approved description" width="720" height="500" style="width: 100%;">`;
  const expected = `<img loading="lazy" fetchpriority="low" data-dc-tpl="72" src="${src}" alt="Approved description" width="720" height="500" style="width: 100%;">`;
  const serializable = new Function(`return (${phoneCriticalMedia.toString()})`)();
  assert.equal(serializable(promoted, route), expected);
  assert.equal(phoneCriticalMedia(expected, route), expected, 'idempotent');
  assert.equal(phoneCriticalMedia(promoted, '/other/'), promoted, 'other routes unchanged');
  const logo = '<img fetchpriority="high" src="/ahv/assets/img/kairali-colorful-logo.webp" alt="Kairali">';
  assert.equal(phoneCriticalMedia(logo, route), logo, 'logo keeps its priority');
  const body = fs.readFileSync('english-candidate/prerender/digestive-wellness-gut-health-yoga-therapy.html', 'utf8');
  const mapped = phoneCriticalMedia(body, route);
  const yoga = mapped.match(/<img\b[^>]*YOGA-AND-MEDITATION-benefits-min\.webp[^>]*>/g);
  assert.ok(yoga && yoga.length >= 1);
  for (const tag of yoga) {
    assert.ok(!/fetchpriority="high"/.test(tag), tag);
    assert.equal((tag.match(/fetchpriority=/g) || []).length, 1, tag);
    assert.ok(/loading="lazy"/.test(tag), tag);
  }
  assert.equal(firstCriticalImage(mapped, route), '/ahv/assets/img/digestive-768-hero.avif');
  assert.equal(mapped.replace(/<img\b[^>]*>/g, ''), phoneCriticalMedia(body).replace(/<img\b[^>]*>/g, ''), 'only img tags differ from the generic mapping');
});

test('Digestive candidate views and English body are pinned to the held c35727ec4 bytes', () => {
  const pins = {
    'public/ahv/views/ahv-page-digestive-wellness-gut-health-mobile.json': /^ab8ba8ab4b4ea13b/,
    'public/ahv/views/ahv-page-digestive-wellness-gut-health-desktop.json': /^d28ba7e44334aadb/,
    'english-candidate/prerender/digestive-wellness-gut-health-yoga-therapy.html': /^2190d6574e47ecb3/,
  };
  for (const [file, pin] of Object.entries(pins)) {
    assert.match(createHash('sha256').update(fs.readFileSync(file)).digest('hex'), pin, file);
  }
});

test('Panchakarma phone image and priority preload use the same smaller address', () => {
  const source = '<div style="background-image:url(/ahv/assets/img/ktahv-abhyanga-oil-therapy-2025.webp)"></div>';
  const mapped = phoneCriticalMedia(source);
  assert.equal(firstCriticalImage(mapped), '/ahv/assets/img/ktahv-abhyanga-oil-therapy-2025-544.webp');
  assert.equal(phoneCriticalMedia(mapped), mapped);
  assert.ok(!mapped.includes('-768.webp'));
});
test('main programme phone heroes use the same derivative for background and priority preload', () => {
  for (const name of ['weightloss', 'digestive']) {
    const original = `/ahv/assets/img/${name}.webp`, derivative = `/ahv/assets/img/${name}-768-hero.avif`;
    const source = `<div role="img" aria-label="Approved image" style="height:250px;background-image:url(${original})"></div>`;
    const mapped = phoneCriticalMedia(source);
    assert.equal(firstCriticalImage(mapped), derivative);
    assert.equal(mapped.replace(derivative, original), source, 'no non-image attribute changes');
    assert.equal(phoneCriticalMedia(mapped), mapped);
    assert.equal(firstCriticalImage(source), null, 'desktop/original template is untouched');
  }
  assert.equal(phoneCriticalMedia('<img src="/ahv/assets/img/weight-loss-extra.webp">'), '<img src="/ahv/assets/img/weight-loss-extra.webp">');
});
test('Weight Loss body images retain layout and lazy attributes without priority preload', () => {
  for (const name of ['weight-loss', 'weight-history']) {
    const original = `/ahv/assets/img/${name}.webp`, derivative = `/ahv/assets/img/${name}-768.avif`;
    const source = `<img src="${original}" width="580" height="387" loading="lazy" fetchpriority="low" alt="Approved description" style="width:100%;height:auto">`;
    const mapped = phoneCriticalMedia(source);
    assert.equal(mapped.replace(derivative, original), source);
    assert.equal(firstCriticalImage(mapped), null, 'body image never becomes a critical preload');
    assert.equal(phoneCriticalMedia(mapped), mapped);
  }
});
test('only named first-screen images gain the same-image phone variant', () => {
  const input = '<video poster="/ahv/assets/img/wx-hero.webp"></video><img src="/ahv/assets/img/other.webp">';
  const result = phoneCriticalMedia(input);
  assert.ok(result.includes('wx-hero-544.avif'));
  assert.ok(result.includes('other.webp'));
  assert.equal(phoneCriticalMedia(result), result);
  assert.equal(firstCriticalImage(result), '/ahv/assets/img/wx-hero-544.avif');
  assert.equal(firstCriticalImage('<img src="/unrelated.webp">'), null);
});
test('the four home phone slots use 768px variants without changing preload selection or other markup', () => {
  const names = ['wx-welcome', 'kt-317', 'wx-yogahall', 'kt-106'];
  const template = JSON.parse(fs.readFileSync('public/ahv/views/home-mobile.json', 'utf8')).template;
  for (const name of names) assert.ok(template.includes('/ahv/assets/img/' + name + '.webp'), name + ' in approved phone view');
  const mapped = phoneCriticalMedia(template);
  for (const name of names) {
    assert.ok(mapped.includes('/ahv/assets/img/' + name + '-768.webp'), name + ' gets derivative');
    assert.ok(!mapped.includes('/ahv/assets/img/' + name + '.webp'), name + ' original not in phone template');
  }
  // Reversing just these four URL substitutions recovers the exact source, including slots and lazy attributes.
  let restored = mapped;
  for (const name of names) restored = restored.replaceAll('/ahv/assets/img/' + name + '-768.webp', '/ahv/assets/img/' + name + '.webp');
  let existing = template.replaceAll('/ahv/assets/img/wx-hero.webp', '/ahv/assets/img/wx-hero-544.avif');
  for (const name of ['ktahv-abhyanga-oil-therapy-2025', 'AHV-Enquiry-Garden-Banner'])
    existing = existing.replaceAll('/ahv/assets/img/' + name + '.webp', '/ahv/assets/img/' + name + '-768.webp');
  assert.equal(restored, existing, 'only the four new URLs change beyond the pre-existing mapping');
  assert.equal(firstCriticalImage(mapped), firstCriticalImage(existing), 'existing preload selection is unchanged');
  assert.equal(phoneCriticalMedia(mapped), mapped, 'phone mapping is idempotent');
  const onlyNew = names.map((name) => '<img src="/ahv/assets/img/' + name + '-768.webp">').join('');
  assert.equal(firstCriticalImage(onlyNew), null, 'new below-fold images do not gain a priority preload');
});

test('award link uses its existing title without inventing or translating copy', () => {
  const link = '<a href="/award" aria-label="Read more — Existing title">Read more</a>';
  const result = descriptiveAwardLinks(link);
  assert.ok(result.includes('Read more<span class="ahv-link-context"> — Existing title</span>'));
  assert.equal(descriptiveAwardLinks(result), result);
  for (const untouched of ['<article>Read more</article>', '<a href="/x">Read more</a>', '<a aria-label="Other action">Read more</a>']) assert.equal(descriptiveAwardLinks(untouched), untouched);
  assert.ok(descriptiveAwardLinks('<a aria-label="Mehr — Titel">Mehr</a>').includes(' — Titel</span>'));
});

test('package phone hero retains the approved asset and selects its smaller preload', () => {
 const original='/ahv/assets/img/owner-approved-20260928/ahv-img-002.webp';
 const mapped=phoneCriticalMedia('<img src="'+original+'">');
 assert.equal(firstCriticalImage(mapped),original.replace('.webp','-768.webp'));
 assert.equal(phoneCriticalMedia(mapped),mapped);
});
test('home enquiry removes stale campaign context without changing programme or award links', () => {
 const stale='<a href="/hi/contact-us/" aria-label="Enquire — Karkidaka Monsoon Detox">Enquire<span class="ahv-link-context"> — Karkidaka Monsoon Detox</span></a>';
 assert.equal(descriptiveAwardLinks(stale,'/'),'<a href="/hi/contact-us/">Enquire</a>');
 assert.equal(descriptiveAwardLinks(stale,'/karkidaka-chikitsha-or-monsoon-wellness.html'),stale);
 const programme='<a href="/programme/" aria-label="Read more — Karkidaka">Read more</a>';
 assert.ok(descriptiveAwardLinks(programme,'/').includes(' — Karkidaka</span>'));
});



// The deferred Weight optimization tests remain in immutable pre-isolation
// evidence. These checks bind the production page actually being retained.
test('held Weight preserves all3 original image URLs and suppresses new preload', () => {
  const route = '/weight-loss-programme/';
  const serializable = new Function(`return (${phoneCriticalMedia.toString()})`)();
  for (const name of ['weightloss', 'weight-loss', 'weight-history']) {
    const src = `/ahv/assets/img/${name}.webp`;
    const html = `<div role="img" style="background-image:url(${src})"></div><img src="${src}" loading="lazy">`;
    assert.equal(phoneCriticalMedia(html, route), html);
    assert.equal(serializable(html, route), html);
    assert.equal(serializable(src, route), src);
    assert.equal(firstCriticalImage(html, route), null);
    for (const other of ['', '/', '/other/', '/weight-loss-programme-extra/']) assert.equal(phoneCriticalMedia(html, other), phoneCriticalMedia(html));
  }
  assert.equal(firstCriticalImage('<img src="/ahv/assets/img/weightloss-768-hero.avif">', route), null);
});
test('held Weight runtime IMG interception preserves originals; other routes retain derivatives', () => {
  for (const route of ['/weight-loss-programme/', '/other/']) for (const name of ['weightloss', 'weight-loss', 'weight-history']) {
    class Element { constructor(){this.tagName='IMG';this.isConnected=true;this.attrs={};} setAttribute(name,value){this.attrs[name]=value;} hasAttribute(name){return Object.hasOwn(this.attrs,name);} }
    installLazyImgOrder({Element,matchMedia:()=>({matches:true}),queueMicrotask},null,src=>phoneCriticalMedia(src,route));
    const img = new Element(), src = `/ahv/assets/img/${name}.webp`;img.setAttribute('src',src);
    assert.equal(img.attrs.src,route==='/weight-loss-programme/'?src:phoneCriticalMedia(src));
  }
});
test('held Weight exact published views and English body remain pinned', () => {
  const pins = {
    'public/ahv/views/ahv-page-weight-loss-programme-mobile.json':'a3ddb49f061576c3819410f2b9e484ff3691a00f0f21d5663b99f08e4e85b7ce',
    'public/ahv/views/ahv-page-weight-loss-programme-desktop.json':'6d7a7fe57727b21560f4bb5ab7f145481bc96900a854cb5712e5798883b945de',
    'english-candidate/prerender/weight-loss-programme.html':'0ebe3e9be6a2ea93d56619c073095e251746edd063fc0986ce190ab027d7ac54',
  };
  for (const [file, sha256] of Object.entries(pins)) {
    const bytes = fs.readFileSync(file);
    assert.equal(createHash('sha256').update(bytes).digest('hex'),sha256,file);
    const html = file.endsWith('.json') ? JSON.parse(bytes).template : bytes.toString();
    const mapped=phoneCriticalMedia(html,'/weight-loss-programme/');
    for(const name of ['weightloss','weight-loss','weight-history'])assert.ok(!mapped.includes(`/ahv/assets/img/${name}-768`));
    assert.equal(firstCriticalImage(mapped,'/weight-loss-programme/'),null);
    assert.ok(!html.includes('href="#programme-enquiry"'));
    if(file.endsWith('.json')) assert.deepEqual(JSON.parse(bytes).scripts,[]);
  }
});
