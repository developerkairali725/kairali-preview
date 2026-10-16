// Train E02 (15 Oct 2026). Source only: no build, browser or network.
//   AHV-WB.105/128/170/263/354/510.quotation-box: each page explains its quotation once, in its stay box; the owner's
//     pinned free-consultation CTA support line is the only other quotation sentence (DE: "Angebot").
//   (Train G, 15 Oct 2026: E02's AHV-WB.156/452/473.benefit-copy rows were rejected in review and are not integrated;
//    their three lead paragraphs are checked unchanged below.)
//   AHV-M045.01: the athlete page hero states the approved "up to 20% lower" rate; the bands below are unchanged.
//   AHV-N03.01: every package Sanskrit subtitle after the H1 uses one style per side; names unchanged.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { productionCampaign } from "../campaign-v2/production/load.ts";
import { UI } from "../campaign-v2/production/ui.ts";
import { N03 } from "./fixtures/n03-sanskrit-subtitle-20261015.mjs";
// Train J3 (15 Oct 2026) sits on top (its own AHV-WB.452 line): its exact delta is peeled first.
import { peelTrainJ3Source, reverseTrainJ3Config } from "./fixtures/train-j3-20261015.mjs";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => peelTrainJ3Source(p, fs.readFileSync(path.join(SITE, p), "utf8"));

/** Every string in a config subtree, with its path. */
function strings(value, at = [], out = []) {
  if (typeof value === "string") out.push({ at: at.join("."), s: value });
  else if (Array.isArray(value)) value.forEach((v, i) => strings(v, [...at, i], out));
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) strings(v, [...at, k], out);
  return out;
}

const QUOTE = {
  "monsoon-wellness": /quotation/i,
  "rejuvenation-detox": /quotation/i,
  "wellness-kerala": /quotation/i,
  brand: /quotation/i,
  "lp-brand": /quotation/i,
  "lp-behandlung-kerala": /angebot/i,
};

test("quotation-box: the quotation is explained once, in the stay box; elsewhere only the pinned CTA support line", () => {
  for (const [slug, word] of Object.entries(QUOTE)) {
    const c = productionCampaign(slug);
    const outside = strings({ hero: c.hero, page: { ...c.page, stay: undefined }, faq: c.faq, closing: c.page.closing })
      .filter(({ s }) => word.test(s)).map(({ at, s }) => `${at}: ${s}`);
    assert.deepEqual(outside, [], `${slug}: quotation wording outside the stay box`);
    const box = strings(c.page.stay).filter(({ s }) => word.test(s));
    assert.ok(box.length >= 1, `${slug}: the one quotation box remains`);
    assert.ok(c.page.stay.lists.length >= 1 && c.page.stay.lists.some((l) => l.extra), `${slug}: inclusions and separate charges kept`);
    assert.match(c.cta.primarySupport, word, `${slug}: the owner's free-consultation support line is unchanged`);
    // Every FAQ answer still in the lint range (25-70 words) and the FAQ never lists a quotation question.
    for (const f of c.faq) assert.doesNotMatch(f.q, word, `${slug}: ${f.q}`);
  }
  assert.equal(UI.en.kicker.stay, "Your quotation");
});

test("quotation-box: the facts the removed lines carried remain on each page", () => {
  const has = (slug, re) => assert.match(JSON.stringify(productionCampaign(slug)), re, `${slug}: ${re}`);
  has("monsoon-wellness", /Confirm the number of accommodation nights before booking/);
  has("monsoon-wellness", /Your programme and number of nights/);
  has("monsoon-wellness", /Medicines and tests/);
  has("rejuvenation-detox", /Confirm the exact programme name and number of nights before booking/);
  has("rejuvenation-detox", /seven-night minimum/);
  has("brand", /Villa category, occupancy and taxes/);
  has("brand", /rather than|compare the full proposal/);
  has("lp-brand", /Review the booking terms before making a payment/);
  has("lp-brand", /recommended number of nights/);
  has("lp-behandlung-kerala", /Kostenangebot/);
  has("lp-behandlung-kerala", /Welche Leistungen zusätzlich berechnet werden, hängt von der Vereinbarung ab\./);
  has("lp-behandlung-kerala", /Ihre ärztliche Erstberatung ist kostenlos/);
});

const E02_REJECTED_BENEFIT = {
  "ayurveda-retreat": "Between appointments, you can walk through the grounds",
  "lp-treatment-kerala": "The hours between appointments are yours",
  "lp-treatment-packages": "On each of the three programmes below, your day includes",
};

test("Train G: the rejected E02 benefit-copy lines (AHV-WB.156/452/473) are not integrated", () => {
  for (const [slug, start] of Object.entries(E02_REJECTED_BENEFIT)) {
    const c = reverseTrainJ3Config(slug, JSON.parse(JSON.stringify(productionCampaign(slug))));
    assert.equal(c.page.lead.paragraphs.some((p) => p.startsWith(start)), false, slug);
    assert.doesNotMatch(read(`campaign-v2/production/pages/${slug}.ts`), /AHV-WB\.(156|452|473)\.benefit-copy/, slug);
  }
});

test("M045.01: the athlete hero states the approved up to 20% lower rate; the bands and terms below are unchanged", () => {
  const s = read("campaign-v110/pages/offers/olympics-and-paralympics-offer/staging.html");
  const hero = s.slice(s.indexOf("<h1"), s.indexOf('data-slot="hero-cta"'));
  assert.match(hero, /care-led programme rates up to 20% lower for eligible Olympic and Paralympic athletes\./);
  for (const t of ["10% for 3–13 nights", "15% for 14–20 nights", "20% for 21 nights or more", "Stays of 1–2 nights"]) assert.ok(s.includes(t), t);
  assert.equal(s.split("care-led programme rates").length - 1, 1);
});

test("N03.01: every package Sanskrit subtitle after the H1 has one style per side; text and element unchanged", () => {
  const STYLE = {
    desktop: "font-family:'Marcellus',serif;font-size:24px;color:#75695A;margin:10px 0 0",
    mobile: "font-family:'Marcellus',serif;font-size:20px;color:#75695A;margin:10px 0 0",
  };
  const seen = { desktop: 0, mobile: 0 };
  for (const f of fs.readdirSync(path.join(SITE, "public/ahv/views")).filter((x) => /^ahv-page-.*-(desktop|mobile)\.json$/.test(x))) {
    const side = f.endsWith("-mobile.json") ? "mobile" : "desktop";
    const t = JSON.parse(read(`public/ahv/views/${f}`)).template;
    const m = t.match(/<\/h1>\s*<(div|p) style="([^"]*)">([^<]*)</);
    if (!m || !/Marcellus|Dhyāna/.test(m[2] + m[3]) || !/#75695A|Dhyāna/.test(m[2] + m[3])) continue;
    assert.equal(m[2], STYLE[side], f);
    seen[side] += 1;
    const rec = N03.views[f.replace(/\.json$/, "")];
    if (rec) assert.equal(rec.after, STYLE[side], f);
  }
  assert.deepEqual(seen, { desktop: 30, mobile: 30 });
  assert.equal(Object.keys(N03.views).length, 17);
  assert.match(read("tools/repair-sanskrit-names.mjs"), /font-size:24px;color:#75695A;margin:10px 0 0/);
  assert.doesNotMatch(read("tools/repair-sanskrit-names.mjs"), /font-size:22px;color:#75695A;margin:12px 0 0/);
  const yoga = JSON.parse(read("public/ahv/views/ahv-page-yoga-and-meditation-package-mobile.json")).template;
  assert.match(yoga, /Dhyāna-Yoga Shibiram · Minimum Duration is 7 Nights<\/p>/);
});
