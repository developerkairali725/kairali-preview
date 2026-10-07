import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { phoneCriticalMedia, descriptiveAwardLinks, firstCriticalImage } from '../app/(english)/_families/critical-media.mjs';
import { installLazyImgOrder } from '../app/(english)/_families/media-loading.mjs';

test('held Digestive retains production image and no new preload without changing other routes', () => {
  const route = '/digestive-wellness-gut-health-yoga-therapy/';
  const original = '/ahv/assets/img/digestive.webp', derivative = '/ahv/assets/img/digestive-768-hero.avif';
  const html = `<div style="background-image:url(${original})"></div><img loading="lazy" src="${original}">`;
  const serializable = new Function(`return (${phoneCriticalMedia.toString()})`)();
  assert.equal(serializable(html, route), html);
  assert.equal(firstCriticalImage(html, route), null);
  assert.equal(firstCriticalImage(`<img src="${derivative}">`, route), null, 'old seed snapshots cannot introduce a new held-route preload');
  assert.equal(phoneCriticalMedia(html, '/other/'), phoneCriticalMedia(html));
  const weight = '<img src="/ahv/assets/img/weightloss.webp">';
  assert.equal(phoneCriticalMedia(weight, '/weight-loss-programme/'), phoneCriticalMedia(weight));
  assert.equal(firstCriticalImage(phoneCriticalMedia(weight), '/weight-loss-programme/'), '/ahv/assets/img/weightloss-768-hero.avif');
  for (const variant of ['mobile', 'desktop']) {
    const view = JSON.parse(fs.readFileSync(`public/ahv/views/ahv-page-digestive-wellness-gut-health-${variant}.json`, 'utf8'));
    assert.ok(view.template.includes(original));
    assert.ok(!phoneCriticalMedia(view.template, route).includes(derivative));
  }
});

test('runtime IMG src interception respects canonical held route while retaining other mappings', () => {
  const held = '/digestive-wellness-gut-health-yoga-therapy/';
  for (const route of [held, '/other/']) {
    class Element {
      constructor() { this.tagName = 'IMG'; this.isConnected = true; this.attrs = {}; }
      setAttribute(name, value) { this.attrs[name] = value; }
      hasAttribute(name) { return Object.hasOwn(this.attrs, name); }
    }
    const win = { Element, matchMedia: () => ({ matches: true }), queueMicrotask };
    installLazyImgOrder(win, null, src => phoneCriticalMedia(src, route));
    const img = new Element();
    img.setAttribute('src', '/ahv/assets/img/digestive.webp');
    assert.equal(img.attrs.src, route === held ? '/ahv/assets/img/digestive.webp' : '/ahv/assets/img/digestive-768-hero.avif');
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


test('Weight ABOUT image normalizes conflicting duplicate priority and loading attributes', () => {
  const src = '/ahv/assets/img/weight-loss-768.avif';
  const input = `<img fetchpriority="high" data-dc-tpl="77" fetchpriority="low" loading="eager" LOADING = 'lazy' src="${src}" alt="Approved description" width="580" height="387" style="width:100%;height:auto">`;
  const expected = `<img loading="lazy" fetchpriority="low" data-dc-tpl="77" src="${src}" alt="Approved description" width="580" height="387" style="width:100%;height:auto">`;
  assert.equal(phoneCriticalMedia(input, '/weight-loss-programme/'), expected);
  assert.equal(phoneCriticalMedia(expected, '/weight-loss-programme/'), expected, 'idempotent on corrected markup');
  assert.equal(firstCriticalImage(expected, '/weight-loss-programme/'), null, 'ABOUT never becomes hero preload');
});

test('Weight priority correction is exact-route and exact-img-src scoped', () => {
  const route = '/weight-loss-programme/';
  const src = '/ahv/assets/img/weight-loss-768.avif';
  const target = `<img src="${src}" fetchpriority="high">`;
  for (const other of ['', '/', '/other/', '/digestive-wellness-gut-health-yoga-therapy/', '/weight-loss-programme-extra/', '/hi/weight-loss-programme/']) {
    assert.equal(phoneCriticalMedia(target, other), target, other || 'default route');
  }
  for (const untouched of [
    `<img data-src="${src}" src="/ahv/assets/img/other.webp" fetchpriority="high">`,
    `<img src="${src}?other=1" loading="eager" fetchpriority="high">`,
    `<img src="/ahv/assets/img/weight-history-768.avif" fetchpriority="high">`,
    `<img src="/ahv/assets/img/kairali-colorful-logo.webp" fetchpriority="high">`,
    `<img src="/ahv/assets/img/weightloss-768-hero.avif" fetchpriority="high">`,
    `<div data-src="${src}" fetchpriority="high">Approved text</div>`,
  ]) assert.equal(phoneCriticalMedia(untouched, route), untouched);
  const hero = '<div style="background-image:url(/ahv/assets/img/weightloss-768-hero.avif)"></div>';
  assert.equal(firstCriticalImage(phoneCriticalMedia(hero + target, route), route), '/ahv/assets/img/weightloss-768-hero.avif');
});

test('Weight priority correction handles existing attribute syntax and preserves data attributes', () => {
  const input = `<IMG data-fetchpriority="high" data-loading="eager" SRC = '/ahv/assets/img/weight-loss.webp' FETCHPRIORITY = high loading=auto width="580" height="387" />`;
  const expected = `<img loading="lazy" fetchpriority="low" data-fetchpriority="high" data-loading="eager" SRC = '/ahv/assets/img/weight-loss-768.avif' width="580" height="387" />`;
  assert.equal(phoneCriticalMedia(input, '/weight-loss-programme/'), expected);
});

test('Weight loading correction remains self-contained when serialized into the live boot', () => {
  const serialized = new Function(`return (${phoneCriticalMedia.toString()})`)();
  const source = '<img fetchpriority="high" fetchpriority="low" src="/ahv/assets/img/weight-loss.webp">';
  assert.equal(serialized(source, '/weight-loss-programme/'), phoneCriticalMedia(source, '/weight-loss-programme/'));
  assert.equal(serialized('/ahv/assets/img/weight-loss.webp', '/weight-loss-programme/'), '/ahv/assets/img/weight-loss-768.avif', 'src-only interception still maps the URL');
});

test('actual Weight phone view retains the authored lazy ABOUT image and content', () => {
  const view = JSON.parse(fs.readFileSync('public/ahv/views/ahv-page-weight-loss-programme-mobile.json', 'utf8'));
  const original = view.template.match(/<img\b[^>]*\ssrc="\/ahv\/assets\/img\/weight-loss\.webp"[^>]*>/g);
  assert.equal(original?.length, 1);
  assert.match(original[0], /loading="lazy"/);
  const previous = phoneCriticalMedia(view.template);
  const mapped = phoneCriticalMedia(view.template, '/weight-loss-programme/');
  const previousTag = previous.match(/<img\b[^>]*\ssrc="\/ahv\/assets\/img\/weight-loss-768\.avif"[^>]*>/g);
  const corrected = mapped.match(/<img\b[^>]*\ssrc="\/ahv\/assets\/img\/weight-loss-768\.avif"[^>]*>/g);
  assert.equal(previousTag?.length, 1);
  assert.equal(corrected?.length, 1);
  assert.equal((corrected[0].match(/\sloading=/g) || []).length, 1);
  assert.equal((corrected[0].match(/\sfetchpriority=/g) || []).length, 1);
  assert.match(corrected[0], /loading="lazy" fetchpriority="low"/);
  assert.equal(mapped.replace(corrected[0], previousTag[0]), previous, 'all text, links, design, hero and other image markup unchanged');
});

test('actual Weight captured body changes only the ABOUT image loading attributes', () => {
  const body = fs.readFileSync('english-candidate/prerender/weight-loss-programme.html', 'utf8');
  const previous = phoneCriticalMedia(body);
  const mapped = phoneCriticalMedia(body, '/weight-loss-programme/');
  const tags = value => value.match(/<img\b[^>]*\ssrc="\/ahv\/assets\/img\/weight-loss-768\.avif"[^>]*>/g);
  const before = tags(previous), after = tags(mapped);
  assert.equal(before?.length, 1);
  assert.equal(after?.length, 1);
  assert.equal((after[0].match(/\sloading=/g) || []).length, 1);
  assert.equal((after[0].match(/\sfetchpriority=/g) || []).length, 1);
  assert.match(after[0], /loading="lazy" fetchpriority="low"/);
  const stripLoading = tag => tag.replace(/\s(?:loading|fetchpriority)="[^"]*"/g, '');
  assert.equal(stripLoading(after[0]), stripLoading(before[0]));
  assert.equal(mapped.replace(after[0], before[0]), previous, 'only targeted loading attributes changed');
  assert.equal(firstCriticalImage(mapped, '/weight-loss-programme/'), firstCriticalImage(previous, '/weight-loss-programme/'));
  assert.equal(phoneCriticalMedia(mapped, '/weight-loss-programme/'), mapped);
});
