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

test("WB.079: Family topic 14 uses 'Udhwarthanam – herbal powder therapy' and the massage wording cannot come back", () => {
  const all = strings("family-ayurvedic-retreat");
  assert.deepEqual(all.filter((t) => t.includes("Udhwarthanam")), ["Talk through your goals, medicines, meals and daily routine. Discuss suitable activity and any proposed therapies, including Udhwarthanam – herbal powder therapy, with realistic individual goals and follow-up."]);
  assert.ok(!all.some((t) => /herbal powder massage/i.test(t)));
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
  assert.equal(new Set(quotation.map(([, r]) => r.row)).size, 10);
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
