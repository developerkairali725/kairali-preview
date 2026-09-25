// Acceptance validator fixtures (parent review 25 Sep 2026): negative fixtures
// must be rejected; legitimate localized number formatting must pass.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { validate } from "../tools/l10n/validate.mjs";

const h = (s) => crypto.createHash("sha256").update(s, "utf8").digest("hex");
function run(src, text, locale = "de", opts = {}) {
  const id = "t_x";
  const source = new Map([[id, { source: opts.frozen ?? src, sourceHash: h(opts.frozen ?? src) }]]);
  return validate({ units: [{ id, text, status: "translated", unchangedReason: null, issue: null }] }, { locale, units: [{ id, src, roles: "html-text" }] }, source);
}

test("NEGATIVE: added numeric fact is rejected (parent fixture added-number)", () => {
  const r = run("Admission requires 30 days.", "Die Aufnahme erfordert 30 Tage und 99 Euro.");
  assert.ok(r.errs.some((e) => /numbers added 99/.test(e)), JSON.stringify(r));
});
test("NEGATIVE: crossed inline token nesting is rejected (parent fixture crossed-inline-tokens)", () => {
  const r = run("Read [[OPEN_1]]the [[OPEN_2]]details[[CLOSE_2]][[CLOSE_1]].", "Lesen Sie [[OPEN_1]]die [[OPEN_2]]Details[[CLOSE_1]][[CLOSE_2]].");
  assert.ok(r.errs.some((e) => /crossed or unbalanced/.test(e)), JSON.stringify(r));
});
test("NEGATIVE: changed amount, missing number, stale source binding", () => {
  assert.ok(run("Fee ₹1,500 per day.", "Gebühr ₹1.600 pro Tag.").errs.length);
  assert.ok(run("Stay 14 nights.", "Aufenthalt von vierzehn Nächten.").errs.some((e) => /missing 14/.test(e)));
  assert.ok(run("Stay 14 nights.", "Aufenthalt 14 Nächte.", "de", { frozen: "Stay 21 nights." }).errs.some((e) => /stale/.test(e)));
  assert.ok(run("[[OPEN_1]]a[[CLOSE_1]] b", "[[OPEN_1]]a b").errs.length, "missing CLOSE rejected");
});
test("POSITIVE: legitimate number formatting passes", () => {
  assert.deepEqual(run("From ₹21,567 per night", "Ab ₹21.567 pro Nacht").errs, []);
  assert.deepEqual(run("₹1,50,430 in total", "₹150.430 insgesamt").errs, []);
  assert.deepEqual(run("51.2 km away", "51,2 km entfernt").errs, []);
  assert.deepEqual(run("Sleep by 10 PM", "Schlafen Sie bis 22 Uhr").errs, []);
  assert.deepEqual(run("Rates effective 1 October 2026", "2026年10月1日より有効な料金", "ja").errs, []);
  assert.deepEqual(run("Read [[OPEN_1]]the [[OPEN_2]]details[[CLOSE_2]][[CLOSE_1]].", "Lesen Sie [[OPEN_1]]die [[OPEN_2]]Details[[CLOSE_2]][[CLOSE_1]].").errs, []);
});
test("NEGATIVE: month-number allowance does not apply outside CJK or without a month name", () => {
  assert.ok(run("Rates effective 2026", "2026年10月より", "ja").errs.some((e) => /added 10/.test(e)));
  assert.ok(run("Rates effective 1 October 2026", "Gültig ab 1.10.2026").errs.some((e) => /numbers (added|missing)/.test(e)), "numeric date conversion outside CJK is rejected for retry");
});
test("POSITIVE/NEGATIVE: reviewed normalizations are bounded", () => {
  assert.deepEqual(run("Three-Day Ayurveda Certificate Program", "3日間アーユルヴェーダ修了証プログラム", "ja").errs, []);
  assert.deepEqual(run("level one", "niveau 1", "fr").errs, []);
  assert.deepEqual(run("per night", "／1泊", "ja").errs, []);
  assert.deepEqual(run("Jan", "1月", "ja").errs, []);
  assert.deepEqual(run("24-hour assistance", "Assistance 24 h/24", "fr").errs, []);
  assert.ok(run("per night", "1 Nacht", "de").errs.length, "counter allowance is CJK-only");
  assert.ok(run("Three-Day program", "Programme de 5 jours", "fr").errs.length, "a different number is still rejected");
  assert.ok(run("24-hour assistance", "Assistance 24 h/24 et 7 j/7", "fr").errs.some((e) => /added 7/.test(e)), "a new number beside a repeated one is rejected");
});
