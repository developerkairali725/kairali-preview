// Train D06 (15 Oct 2026), source only: one quotation box per route (AHV-WB.105/128/170/263/354/510.quotation-box)
// and the German Abhyanga wording (AHV-WB.507.change). Exact replacements live in fixtures/train-d06-copy-20261015.json.
import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import { productionCampaign } from "../campaign-v2/production/load.ts";
import { UI } from "../campaign-v2/production/ui.ts";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
const fixture = JSON.parse(read("test/fixtures/train-d06-copy-20261015.json"));
const QUOTE_SLUGS = ["monsoon-wellness", "rejuvenation-detox", "wellness-kerala", "brand", "lp-brand", "lp-behandlung-kerala"];
const text = (c) => JSON.stringify([c.page, c.faq]);

test("each replacement is applied exactly once and reverses to the prior bytes", () => {
  assert.equal(Object.keys(fixture.files).length, 7);
  for (const [p, e] of Object.entries(fixture.files)) {
    let s = read(p);
    assert.equal(sha(s), e.afterSHA256, p);
    for (const { row, before, after } of [...e.replacements].reverse()) {
      assert.match(row, /^AHV-WB\.(105|128|170|263|354|510)\.quotation-box$|^AHV-WB\.507\.change$/);
      assert.ok(before.length > after.length || row === "AHV-WB.507.change", `${p}: consolidation only removes wording`);
      assert.equal(s.split(after).length - 1, 1, p);
      s = s.replace(after, before);
    }
    assert.equal(sha(s), e.beforeSHA256, p);
  }
});

test("quotation: the one stay box, its separate-charges list and the CTA support line stay; repeats are gone", () => {
  for (const slug of QUOTE_SLUGS) {
    const c = productionCampaign(slug);
    const [box, extra] = c.page.stay.lists;
    assert.ok(box.items.length >= 4 && box.extra === undefined, slug);
    assert.equal(extra.extra, true, slug);
    assert.ok(c.cta.primarySupport.length > 0, slug);
    assert.doesNotMatch(text(c), /₹|\bINR\b|\bRs\.?\s?\d|\bfrom \d/i, `${slug}: still enquiry-only`);
  }
  for (const slug of ["monsoon-wellness", "rejuvenation-detox"]) {
    assert.ok(!productionCampaign(slug).faq.some((f) => f.q === "What should I check in my quotation?"), slug);
  }
  assert.ok(!productionCampaign("lp-brand").faq.some((f) => f.q === "What should I check before booking?"));
  assert.ok(productionCampaign("lp-brand").page.stay.after.includes("Review the booking terms before making a payment."));
  for (const { slug, before, after } of fixture.configChanges) {
    const count = (v) => (JSON.stringify(v).match(/quotation|Angebot/gi) ?? []).length;
    assert.ok(count(after) <= count(before), slug);
  }
});

test("AHV-WB.507: German Abhyanga paragraph and photo alt use Anwendung with Kräuteröl", () => {
  const de = productionCampaign("lp-behandlung-kerala");
  assert.ok(text(de).includes("Abhyanga ist eine Ganzkörperanwendung mit medizinischen Kräuterölen."));
  assert.doesNotMatch(text(de), /medizinierten|Ganzkörpermassage/);
  assert.equal(UI.de.alt["kt-199"], "Zwei Therapeutinnen bei einer Abhyanga-Ganzkörperanwendung mit warmem medizinischem Kräuteröl");
  assert.doesNotMatch(read("campaign-v2/production/ui.ts"), /Abhyanga-Ganzkörpermassage/);
});
