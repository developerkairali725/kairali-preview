// AHV train D03, 14 Oct 2026 (workbook User Review 9 Oct). Source-only candidate.
// AHV-WB.079.change / AHV-WB.484.change: procedure descriptions only; every "where indicated"/doctor qualifier stays.
// AHV-WB.*.quotation-box (10 routes): delete only sentences that restate the quotation explanation. The stay quotation box,
// the owner-rule primarySupport line, the enquiry-only no-price rule and every distinct fact remain.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { productionCampaign } from "../campaign-v2/production/load.ts";
import { pageText } from "../campaign-v2/kit/lint/page-text.ts";

const fixture = JSON.parse(fs.readFileSync(new URL("./fixtures/d03-copy-corrections-20261014.json", import.meta.url), "utf8"));
const strings = (slug) => { const c = productionCampaign(slug); return [...pageText(c).map(({ text }) => text), ...(c.faq ?? []).map(({ a }) => a)]; };
const slugOf = (f) => f.match(/pages\/(.+)\.ts$/)[1];
const SUPPORT = "Your initial consultation is free. Ask for a quotation covering treatment and any later services.";

// Train B (15 Oct 2026): Train A's AHV-WB.083.change (owner decision 5, parents list) removed the Weight management topic
// card that carried this wording, so WB.079 has no target in the integrated tree; the massage wording stays absent.
test("WB.079 (Train B): the family page has no Udhwarthanam topic left (removed by AHV-WB.083) and no massage wording", () => {
  const all = strings("family-ayurvedic-retreat");
  assert.deepEqual(all.filter((t) => t.includes("Udhwarthanam")), []);
  assert.ok(!all.some((t) => /herbal powder massage/i.test(t)));
  assert.ok(fixture.trainBExclusions.some((x) => x.row === "AHV-WB.079.change" && x.action === "no target in the integrated tree"));
});

test("WB.484: /lp/weight-loss/ says 'oil-based or cleansing therapies', keeping 'where indicated' and assessment", () => {
  const c = productionCampaign("lp-weight-management");
  assert.equal(c.route, "/lp/weight-loss/");
  const all = strings("lp-weight-management");
  assert.ok(all.includes("Prescribed therapies are carried out by the treatment team under physician supervision. Your programme may include oil-based or cleansing therapies where indicated; the specific care is determined by assessment."));
  assert.ok(!all.some((t) => /massage-based/i.test(t)));
});

test("quotation-box: each removed restatement is gone; the remaining sentence, the quotation box and the owner-rule line remain", () => {
  const quotation = Object.entries(fixture.files).flatMap(([f, e]) => e.replacements.filter((r) => r.row.endsWith(".quotation-box")).map((r) => [slugOf(f), r]));
  // Train B (15 Oct 2026): 4 accepted rows; the 6 rejected by train-d03/REVIEW.json are reverted (checked below).
  assert.deepEqual([...new Set(quotation.map(([, r]) => r.row))].sort(), ["AHV-WB.057.quotation-box", "AHV-WB.082.quotation-box", "AHV-WB.191.quotation-box", "AHV-WB.217.quotation-box"]);
  for (const [slug, { before, after }] of quotation) {
    const c = productionCampaign(slug);
    const all = strings(slug);
    assert.ok(before.startsWith(after.replace(/\.$/, "")) && before.length > after.length, `${slug}: deletion only, no new wording`);
    assert.ok(all.some((t) => t.includes(after)), `${slug}: kept text present`);
    assert.ok(!all.some((t) => t.includes(before)), `${slug}: restatement removed`);
    assert.equal(c.cta.primarySupport, SUPPORT, `${slug}: owner-rule line unchanged`);
    assert.ok(c.page.stay.lists.length >= 1, `${slug}: the enquiry-only quotation box remains`);
    assert.ok(all.some((t) => /quot/i.test(t)), `${slug}: one quotation explanation remains in page copy`);
  }
});

test("Train B: the six quotation-box rows rejected by train-d03/REVIEW.json are reverted exactly", () => {
  const rejected = fixture.trainBExclusions.filter((x) => x.action === "reverted");
  assert.deepEqual(rejected.map((x) => x.row).sort(), ["AHV-WB.004.quotation-box", "AHV-WB.030.quotation-box", "AHV-WB.149.quotation-box",
    "AHV-WB.288.quotation-box", "AHV-WB.310.quotation-box", "AHV-WB.334.quotation-box"]);
  for (const { file, before, row } of rejected) {
    const all = strings(slugOf(file));
    assert.ok(all.some((t) => t.includes(before)), `${row}: the original sentence is back`);
    assert.equal(fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8").split(before).length - 1, 1, `${row}: once in source`);
  }
});
