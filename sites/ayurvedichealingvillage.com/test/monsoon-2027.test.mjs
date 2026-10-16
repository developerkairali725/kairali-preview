import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { productionCampaign } from '../campaign-v2/production/load.ts';
import { productionJsonLd, productionMetadata } from '../campaign-v2/production/metadata.ts';
import { applyReviewSnapshot, reviewCopyFor } from '../app/(english)/_families/content-review.mjs';
import season from '../english-candidate/monsoon-season-2027.json' with { type: 'json' };
import routes from '../l10n/routes.json' with { type: 'json' };
const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Isolated source tests can reuse the existing SSD generated source bank without building.
const PAYLOAD = process.env.WOPS_MONSOON_PAYLOAD_ROOT || SITE;
assert.ok(path.isAbsolute(PAYLOAD)); process.chdir(PAYLOAD);
const route = '/karkidaka-chikitsha-or-monsoon-wellness.html';
const c = productionCampaign('monsoon-wellness');
const qualifier = 'All programmes are personalised based on individual constitution and physician assessment. Inclusions are indicative and subject to clinical evaluation.';

test('three named day programmes retain clinical qualifiers, included care and no prices', () => {
  assert.equal(c.page.offering.kind, 'cards'); const cards = c.page.offering.cards;
  assert.deepEqual(cards.map(x => x.title), ['The Monsoon Starter · 7 days', 'The Monsoon Reset · 14 days', 'The Monsoon Overhaul · 21 days']);
  assert.ok(c.page.offering.intro.includes(qualifier));
  // AHV-WB.105.quotation-box (train E02): the nights confirmation stays; the quotation itself is explained once, in the stay box.
  assert.ok(c.page.offering.intro.includes('Programme durations are stated in days. Confirm the number of accommodation nights before booking.'));
  assert.ok(c.page.stay.lists[0].items.includes('Your programme and number of nights'));
  for (const card of cards) {
    assert.match(card.paragraphs.join(' '), /Two physician-prescribed therapy sessions daily/);
    assert.doesNotMatch(card.paragraphs.join(' '), /\b(?:7|14|21)[ -]nights?\b|₹|\bINR\b|factory|guaranteed|cure/i);
  }
  assert.match(cards[0].paragraphs.join(' '), /written post-programme wellness plan/);
  assert.match(cards[1].paragraphs.join(' '), /Five days of preparation/);
  assert.match(cards[2].paragraphs.join(' '), /Seven days of preparation/);
  assert.match(cards[2].paragraphs.join(' '), /Three months of structured physician-led remote follow-up included/);
  assert.ok(cards.slice(0, 2).every(x => !x.paragraphs.join(' ').includes('Three months')));
  assert.equal(c.fees, null); assert.equal(c.offer, null); assert.equal(c.pricing.display, 'hidden');
});
test('month-only 2027 season and FAQ schema agree with physician/night confirmation', () => {
  assert.equal(c.hero.overline, 'Karkidaka Chikitsa · July–August 2027');
  assert.match(productionMetadata('monsoon-wellness', c).description, /July–August 2027/);
  assert.match(c.page.lead.paragraphs[0], /July–August 2027/); assert.match(c.faq[0].a, /July–August 2027/);
  assert.match(c.faq[2].a, /Starter is 7 days.*Reset is 14 days.*Overhaul is 21 days/);
  const faq = productionJsonLd('monsoon-wellness', c).find(x => x['@type'] === 'FAQPage');
  assert.deepEqual(faq.mainEntity.map(x => x.acceptedAnswer.text), c.faq.map(x => x.a));
  assert.doesNotMatch(JSON.stringify(c.page.offering), /\b(?:1 July|July 1|31 August|August 31|2026)\b/);
});
test('season corrections cover exactly the existing 13 locales and no other route', () => {
  assert.equal(season.route, route); assert.equal(season.year, 2027);
  assert.deepEqual(Object.keys(season.locales).sort(), Object.keys(routes.routes[route]).sort()); assert.equal(Object.keys(season.locales).length, 13);
  for (const locale of Object.keys(season.locales)) {
    assert.equal(season.locales[locale].length, 1); const edit = season.locales[locale][0];
    assert.equal(edit.kind, 'text'); assert.doesNotMatch(edit.old, /2027/); assert.equal(edit.new.match(/2027/g)?.length, 1);
    assert.deepEqual(reviewCopyFor('/unrelated-test-route/', locale), []); assert.equal(reviewCopyFor('/villa-raag/', locale), undefined);
    assert.ok(reviewCopyFor(route, locale).some(x => x.old === edit.old && x.new === edit.new));
    assert.equal(applyReviewSnapshot(`<p>${edit.old}</p>`, '/unrelated-test-route/', locale), `<p>${edit.old}</p>`);
  }
});
for (const locale of Object.keys(season.locales)) test(`${locale}: actual source matches once; correction is idempotent and avoids scripts/forms`, () => {
  const file = path.join(PAYLOAD, locale === 'en' ? 'english-candidate/prerender/karkidaka-chikitsha-or-monsoon-wellness.html.html' : `l10n/prerender/${locale}/karkidaka-chikitsha-or-monsoon-wellness.html.html.gz`);
  const html = locale === 'en' ? fs.readFileSync(file, 'utf8') : zlib.gunzipSync(fs.readFileSync(file)).toString('utf8'); const edit = season.locales[locale][0];
  assert.equal(html.split(edit.old).length - 1, 1, 'Exact source text, no inferred translation');
  const changed = applyReviewSnapshot(html, route, locale);
  assert.equal(changed.includes(edit.old), false); assert.equal(changed.split(edit.new).length - 1, 1);
  assert.equal(applyReviewSnapshot(changed, route, locale), changed);
  const protectedHtml = `<script>${edit.old}</script><style>${edit.old}</style><form><p>${edit.old}</p></form>`;
  assert.equal(applyReviewSnapshot(protectedHtml, route, locale), protectedHtml);
});
