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
test("POSITIVE: 12h→24h with minutes; double occupancy → 2", () => {
  assert.deepEqual(run("sleep by 10 PM", "vada a dormire entro le 22:00", "it").errs, []);
  assert.deepEqual(run("Single: one person; double: two people sharing", "1名：1名様、2名利用：2名様で共有", "ja").errs, []);
  assert.ok(run("sleep by 10", "entro le 22:00", "it").errs.length, "no am/pm → no minutes allowance");
});
test("source-bound exceptions apply only to the named unit/hash/locale; banned-term boundaries", async () => {
  const { validate: v, BANNED } = await import("../tools/l10n/validate.mjs");
  const src = JSON.parse((await import("node:fs")).readFileSync(new URL("../l10n/source/units.json", import.meta.url), "utf8")).units;
  const S = new Map(src.map((u) => [u.id, u]));
  const id = "t_dc2f0f854f42d0836968", u = S.get(id);
  const ja = "はい。滞在中は週1回のワークショップと料理教室を行います。専門家向けに5つの研修コースがあり、1日のワークショップから20日間の上級プログラムまであります。";
  const ok = v({ units: [{ id, text: ja, status: "translated" }] }, { locale: "ja", units: [{ id, src: u.source, roles: [] }] }, S);
  assert.ok(!ok.errs.some((e) => /numbers/.test(e)), JSON.stringify(ok.errs));
  const three = ja.replace("週1回", "週1回、週1回");
  assert.ok(v({ units: [{ id, text: three, status: "translated" }] }, { locale: "ja", units: [{ id, src: u.source, roles: [] }] }, S).errs.some((e) => /added 1\b/.test(e)), "exception excuses exactly one occurrence");
  const ko = "네. 주 1회 워크숍과 요리 수업이 있습니다. 전문가를 위한 5개 과정이 1일 워크숍부터 20일 과정까지 있습니다.";
  assert.ok(v({ units: [{ id, text: ko, status: "translated" }] }, { locale: "ko", units: [{ id, src: u.source, roles: [] }] }, S).errs.some((e) => /added 1\b/.test(e)), "exception does not leak to another locale");
  assert.ok(!BANNED.ar.test("حمام السباحة"), "سبا inside سباحة is not a finding");
  assert.ok(BANNED.ar.test("منتجع صحي"));
  assert.ok(!BANNED.ru.test("спасибо"), "спа inside спасибо is not a finding");
  assert.ok(BANNED.ru.test("спа-процедуры") || BANNED.ru.test("спа"));
});
