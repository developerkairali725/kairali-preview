import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { reverseN03File } from './fixtures/n03-sanskrit-subtitle-20261015.mjs';
import { phoneCriticalMedia, descriptiveAwardLinks, firstCriticalImage, retreatRuntimeMedia } from '../app/(english)/_families/critical-media.mjs';
import { installLazyImgOrder } from '../app/(english)/_families/media-loading.mjs';

test('Digestive candidate uses its phone hero derivative and the matching priority preload', () => {
  const route = '/digestive-wellness-gut-health-yoga-therapy/';
  const original = '/ahv/assets/img/digestive.webp', derivative = '/ahv/assets/img/digestive-768-hero.avif';
  const html = `<div style="background-image:url(${original})"></div>`;
  const serializable = new Function(`return (${phoneCriticalMedia.toString()})`)();
  assert.equal(serializable(html, route), html.replace(original, derivative));
  assert.equal(firstCriticalImage(serializable(html, route), route), derivative);
  assert.equal(phoneCriticalMedia(html, '/other/'), phoneCriticalMedia(html));
  const weight = '<img src="/ahv/assets/img/weightloss.webp">';
  assert.equal(phoneCriticalMedia(weight, '/weight-loss-programme/'), phoneCriticalMedia(weight));
  assert.equal(firstCriticalImage(phoneCriticalMedia(weight), '/weight-loss-programme/'), '/ahv/assets/img/weightloss-768-hero.avif');

  for (const variant of ['mobile', 'desktop']) {
    const view = JSON.parse(fs.readFileSync(`public/ahv/views/ahv-page-digestive-wellness-gut-health-${variant}.json`, 'utf8'));
    assert.ok(view.template.includes(original));
  }
});

test('approved Weight uses its phone hero and matching preload', () => {
  const weight = '<img src="/ahv/assets/img/weightloss.webp">';
  assert.equal(phoneCriticalMedia(weight, '/weight-loss-programme/'), weight.replace('weightloss.webp','weightloss-768-hero.avif'));
  assert.equal(firstCriticalImage(phoneCriticalMedia(weight), '/weight-loss-programme/'), '/ahv/assets/img/weightloss-768-hero.avif');
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

test('Digestive views and English body are pinned to the approved final N12 schedule', () => {
  const pins = {
    'public/ahv/views/ahv-page-digestive-wellness-gut-health-mobile.json': /^44564e7d7c9ec172bec3defe7bb5b9e02b6c423a6cf8015d91db6c72dd29774a$/,
    'public/ahv/views/ahv-page-digestive-wellness-gut-health-desktop.json': /^857d68f8491abee785007069dddf19777c999160f6f13f91f5a6de0a65a02a8f$/,
    'english-candidate/prerender/digestive-wellness-gut-health-yoga-therapy.html': /^c42f81befcccab8a379a008f4e8fc95adf0c2e72a68be71a236a529b2689af53$/,
  };
  for (const [file, pin] of Object.entries(pins)) {
    // AHV-N03.01: the recorded Sanskrit-subtitle style is reversed first; every other byte stays pinned.
    assert.match(createHash('sha256').update(reverseN03File(file, fs.readFileSync(file, 'utf8'))).digest('hex'), pin, file);
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
  const german = '<a href="https://whyayurveda.org/example/" aria-label="Weiterlesen – NABH">Weiterlesen</a>';
  const described = descriptiveAwardLinks(german);
  assert.ok(described.includes('Weiterlesen<span class="ahv-link-context"> – NABH</span>'));
  assert.equal(descriptiveAwardLinks(described), described);
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

// Trace-backed priority: never preload a programme hero on an unrelated route.
test('N12 programme background priorities stay route-scoped', () => {
 for (const [route,hero] of [['/treatment-for-bronchial-diseases/','/ahv/assets/img/bronchial-hero-nasyam.webp'],['/holistic-treatment-for-rejuvenation-and-detoxification/','/ahv/assets/img/ho-pizhichil.webp'],['/treatment-for-hypertension/','/ahv/assets/img/hypertension-hero-thakaradhara.webp'],['/treatment-for-paralysis/','/ahv/assets/img/paralysis-hero-pinda-sweda.webp'],['/treatment-for-skin-diseases/','/ahv/assets/img/skin-vitality-hero-mukha-abhyanga-3.webp']]) {
  assert.equal(firstCriticalImage('<div style="background-image:url('+hero+')"></div>',route),hero);
  assert.equal(firstCriticalImage('<div style="background-image:url('+hero+')"></div>','/other/'),null);
  assert.equal(firstCriticalImage('<div></div>',route),null);
 }
});

test('Retreat phone derivatives keep photos exact-route scoped and survive runtime serialization', () => {
  const serializable = new Function(`return (${phoneCriticalMedia.toString()})`)();
  for (const [route,names] of [['/ananda-lahari-yoga-and-ayurveda-retreat/',['AHV-Ananda-Alcohol-Free','AHV-Ananda-Landscape','AHV-Ananda-Massage','AHV-Ananda-Village']],['/archive-yoga-retreat/',['AHV-Retreat-Archive-Landscape',...Array.from({length:7},(_,i)=>'AHV-Retreat-Archive-0'+(i+1))]]]) {
    for (const name of names) {
      const original='/ahv/assets/img/'+name+'.webp', derivative='/ahv/assets/img/'+name+'-768-phone.avif';
      const html='<img src="'+original+'"><div style="background-image:url('+original+')"></div>';
      assert.equal(serializable(html,route),html.replaceAll(original,derivative));
      assert.equal(serializable(html,'/unrelated/'),html);
      assert(fs.existsSync('public'+original));assert(fs.statSync('public'+derivative).size<fs.statSync('public'+original).size);
    }
  }
});

test('Retreat runtime image data is mapped before rendering only for the selected phone route', () => {
 const runtime=new Function(`return (${retreatRuntimeMedia.toString()})`)();
 for(const [route,key,collection,name] of [['/ananda-lahari-yoga-and-ayurveda-retreat/','AHV_ANANDA','sections','AHV-Ananda-Village'],['/archive-yoga-retreat/','AHV_PAST_RETREATS','cards','AHV-Retreat-Archive-01']]){
  for(const phone of [false,true]){
   const image='/ahv/assets/img/'+name+'.webp',row={image,text:'Unchanged'};
   const win={matchMedia:()=>({matches:phone}),[key]:{[collection]:[row,{text:'No image'}]}};
   runtime(win,'/unrelated/',phoneCriticalMedia);assert.equal(row.image,image);
   runtime(win,route,phoneCriticalMedia);assert.equal(row.image,phone?image.replace('.webp','-768-phone.avif'):image);assert.equal(row.text,'Unchanged');
   runtime(win,route,phoneCriticalMedia);assert.equal(row.image,phone?image.replace('.webp','-768-phone.avif'):image);
  }
 }
});

test('Panchakarma reuses the exact existing landscape derivative only on its phone route', () => { const original='/ahv/assets/img/gallery/ee7d129f97f1b7e211572def4f1bbae675da2b34eaf75e3b76df1d57f01a63bd.webp', target='/ahv/assets/img/AHV-Ananda-Landscape-768-phone.avif'; assert.equal(phoneCriticalMedia(original,'/panchakarma/'),target); assert.equal(phoneCriticalMedia(original,'/unrelated/'),original); assert.equal(phoneCriticalMedia(target,'/panchakarma/'),target); const serialized=new Function('return ('+phoneCriticalMedia.toString()+')')(); assert.equal(serialized(original,'/panchakarma/'),target); });
