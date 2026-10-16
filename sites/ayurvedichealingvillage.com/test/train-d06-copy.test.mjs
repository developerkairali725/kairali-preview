// Train D06 (15 Oct 2026), source only: one quotation box per route (AHV-WB.105/128/170/263/354/510.quotation-box)
// and the German Abhyanga wording (AHV-WB.507.change). Exact replacements live in fixtures/train-d06-copy-20261015.json.
import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import { productionCampaign } from "../campaign-v2/production/load.ts";
import { UI } from "../campaign-v2/production/ui.ts";
import { candidateSource } from "./fixtures/train-b-20261015.mjs";
// Train G (15 Oct 2026) integrates train E02's accepted rework of these six rows on top; the Train B revert is checked on
// the Train F head bytes and configs (fixtures/train-g-20261015.mjs), and train-e02-20261015.test.mjs checks the rework.
import { reverseTrainGSource, reverseTrainGConfig } from "./fixtures/train-g-20261015.mjs";
const trainFCampaign = (slug) => reverseTrainGConfig(slug, JSON.parse(JSON.stringify(productionCampaign(slug))));

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
const fixture = JSON.parse(read("test/fixtures/train-d06-copy-20261015.json"));
const QUOTE_SLUGS = ["monsoon-wellness", "rejuvenation-detox", "wellness-kerala", "brand", "lp-brand", "lp-behandlung-kerala"];
const text = (c) => JSON.stringify([c.page, c.faq]);

// Train B (15 Oct 2026): the six quotation-box rows were rejected by train-d06/REVIEW.json and are reverted; only
// AHV-WB.507.change is included. The integrated files also carry other candidates' deltas, so D06's own bytes are
// checked through candidateSource (c54e2795e plus this fixture's delta, every Train A/B delta verified).
test("each replacement is applied exactly once and reverses to the prior bytes", () => {
  assert.deepEqual(Object.keys(fixture.files).sort(), ["campaign-v2/production/pages/lp-behandlung-kerala.ts", "campaign-v2/production/ui.ts"]);
  for (const [p, e] of Object.entries(fixture.files)) {
    let s = candidateSource("train D06", p, read(p));
    assert.equal(sha(s), e.afterSHA256, p);
    for (const { row, before, after } of [...e.replacements].reverse()) {
      assert.equal(row, "AHV-WB.507.change");
      assert.equal(s.split(after).length - 1, 1, p);
      s = s.replace(after, before);
    }
    assert.equal(sha(s), e.beforeSHA256, p);
  }
});

test("Train B: the rejected quotation-box rows are reverted exactly; the stay box and CTA support line stay", () => {
  const rows = fixture.trainBExclusions.replacements.map((x) => x.row);
  assert.deepEqual([...new Set(rows)].sort(), ["AHV-WB.105.quotation-box", "AHV-WB.128.quotation-box", "AHV-WB.170.quotation-box",
    "AHV-WB.263.quotation-box", "AHV-WB.354.quotation-box", "AHV-WB.510.quotation-box"]);
  for (const { file, before, row } of fixture.trainBExclusions.replacements) {
    assert.equal(reverseTrainGSource(file, read(file)).split(before).length - 1, 1, `${row}: the prior wording is back once`);
  }
  for (const slug of QUOTE_SLUGS) {
    const c = productionCampaign(slug);
    const [box, extra] = c.page.stay.lists;
    assert.ok(box.items.length >= 4 && box.extra === undefined, slug);
    assert.equal(extra.extra, true, slug);
    assert.ok(c.cta.primarySupport.length > 0, slug);
    assert.doesNotMatch(text(c), /₹|\bINR\b|\bRs\.?\s?\d|\bfrom \d/i, `${slug}: still enquiry-only`);
  }
  for (const slug of ["monsoon-wellness", "rejuvenation-detox"]) {
    assert.ok(trainFCampaign(slug).faq.some((f) => f.q === "What should I check in my quotation?"), slug);
  }
  assert.ok(trainFCampaign("lp-brand").faq.some((f) => f.q === "What should I check before booking?"));
});

test("AHV-WB.507: German Abhyanga paragraph and photo alt use Anwendung with Kräuteröl", () => {
  const de = productionCampaign("lp-behandlung-kerala");
  assert.ok(text(de).includes("Abhyanga ist eine Ganzkörperanwendung mit medizinischen Kräuterölen."));
  assert.doesNotMatch(text(de), /medizinierten|Ganzkörpermassage/);
  assert.equal(UI.de.alt["kt-199"], "Zwei Therapeutinnen bei einer Abhyanga-Ganzkörperanwendung mit warmem medizinischem Kräuteröl");
  assert.doesNotMatch(read("campaign-v2/production/ui.ts"), /Abhyanga-Ganzkörpermassage/);
});
