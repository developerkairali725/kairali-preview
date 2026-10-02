import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { phoneCriticalMedia, descriptiveAwardLinks, firstCriticalImage } from '../app/(english)/_families/critical-media.mjs';
test('Panchakarma phone image and priority preload use the same smaller address', () => {
  const source = '<div style="background-image:url(/ahv/assets/img/ktahv-abhyanga-oil-therapy-2025.webp)"></div>';
  const mapped = phoneCriticalMedia(source);
  assert.equal(firstCriticalImage(mapped), '/ahv/assets/img/ktahv-abhyanga-oil-therapy-2025-544.webp');
  assert.equal(phoneCriticalMedia(mapped), mapped);
  assert.ok(!mapped.includes('-768.webp'));
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
