// Rules the authoring guide (§3, §9, §10, §11, §14) promises, enforced by lp:check. One test per rule.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { validConfig } from "./fixtures/lp-v2-valid.ts";
import { lintCampaign } from "../campaign-v2/kit/lint/index.ts";
import { lintLengths } from "../campaign-v2/kit/lint/lengths.ts";
import { lintAssets, altTexts } from "../campaign-v2/kit/lint/assets.ts";
import { lintClaims } from "../campaign-v2/kit/lint/claims.ts";
import { lintLanguage } from "../campaign-v2/kit/lint/language.ts";
import { pending } from "../campaign-v2/kit/pending.ts";
import { img } from "../campaign-v2/kit/registry.ts";
import { parseTscOutput } from "../tools/lp-typecheck.mjs";

const NOW = new Date("2026-10-08T00:00:00Z");
const errs = (issues) => issues.filter((i) => i.level === "error");
const warns = (issues) => issues.filter((i) => i.level === "warning");
const has = (issues, rule, path) => issues.some((i) => i.rule === rule && (!path || i.path === path));
const OFFER = { name: "Seniors offer", headline: "Ten percent off a 14-night program", termsUrl: "https://ayurvedichealingvillage.com/offers/terms/", validFrom: "2026-10-01", validTo: "2026-12-31", source: "Owner email 7 Oct 2026" };

test("guide rules: the valid fixture passes every new rule", () => {
  const { errors } = lintCampaign(validConfig(), NOW);
  assert.deepEqual(errors.map((i) => i.rule), []);
  const ok = validConfig(); ok.offer = { ...OFFER };
  assert.deepEqual(errs(lintCampaign(ok, NOW).errors).map((i) => `${i.rule} ${i.path}`), []);
});

test("§3 film titles: featured ≤ 32, more[] ≤ 28", () => {
  const c = validConfig();
  c.films.featured = { ...c.films.featured, title: "x".repeat(33) };
  c.films.more[1] = { ...c.films.more[1], title: "y".repeat(29) };
  const out = errs(lintLengths(c));
  assert.ok(has(out, "length.films.featured.title", "films.featured.title"));
  assert.ok(has(out, "length.films.more.title", "films.more[1].title"));
  assert.ok(!has(out, "length.films.more.title", "films.more[0].title"));
});

test("§3 fee rows: name ≤ 24, note ≤ 60", () => {
  const c = validConfig();
  c.fees.rows[0].name = "n".repeat(25);
  c.fees.rows[0].note = "o".repeat(61);
  const out = errs(lintLengths(c));
  assert.ok(has(out, "length.fees.name", "fees.rows[0].name"));
  assert.ok(has(out, "length.fees.note", "fees.rows[0].note"));
});

test("§3 offer: name ≤ 30, headline ≤ 80", () => {
  const c = validConfig(); c.offer = { ...OFFER, name: "n".repeat(31), headline: "h".repeat(81) };
  const out = errs(lintLengths(c));
  assert.ok(has(out, "length.offer.name"));
  assert.ok(has(out, "length.offer.headline"));
});

test("§11 offer fields: name, headline, termsUrl, source, ISO dates, from ≤ to, safe terms URL", () => {
  const c = validConfig(); c.offer = { ...OFFER, source: "", termsUrl: "javascript:alert(1)", validFrom: "1 Oct", validTo: "2026-12-31" };
  const paths = errs(lintAssets(c, NOW)).filter((i) => i.rule === "offer.fields").map((i) => i.path);
  assert.deepEqual(paths.sort(), ["offer.source", "offer.termsUrl", "offer.validFrom"].sort());
  const d = validConfig(); d.offer = { ...OFFER, validFrom: "2027-01-01" };
  assert.ok(has(errs(lintAssets(d, NOW)), "offer.fields", "offer.validFrom"));
  const p = validConfig(); p.offer = { ...OFFER, source: pending("C3", "offer source") };
  assert.doesNotThrow(() => lintAssets(p, NOW));
  assert.ok(!has(lintAssets(p, NOW), "offer.fields"), "a pending() field is left to pending.production");
});

test("§3 gallery: fewer than 2 images in a category used is a warning (pilot level), not an error", () => {
  const c = validConfig(); // fixture: 1 Dining, 1 Therapies
  const out = lintAssets(c, NOW).filter((i) => i.rule === "gallery.category");
  assert.equal(out.length, 2);
  assert.ok(out.every((i) => i.level === "warning"));
  assert.match(out.map((i) => i.message).join(" "), /Dining: 1 image/);
  const full = validConfig();
  full.gallery = full.gallery.filter((g) => g.category === "Villas" || g.category === "Grounds");
  assert.equal(lintAssets(full, NOW).filter((i) => i.rule === "gallery.category").length, 0);
});

test("§9 alt text: banned register words warn; award proper nouns stay exempt; claims in alt are errors", () => {
  const c = validConfig();
  c.gallery[0].image = { ...img("kt-116"), alt: "Guests resting on a villa veranda after a spa morning in the village" };
  const reg = warns(lintLanguage(c)).filter((i) => i.rule === "register" && i.path === "gallery[0].alt");
  assert.ok(reg.length >= 1, JSON.stringify(reg));
  const a = validConfig();
  a.gallery[0].image = { ...img("kt-116"), alt: "Villa interior at the village, listed by the World Luxury Hotel & Spa Awards 2025" };
  assert.ok(!lintLanguage(a).some((i) => i.path === "gallery[0].alt"), "award name is exempt");
  const k = validConfig();
  k.gallery[0].image = { ...img("kt-116"), alt: "Villa interior where patients come to cure arthritis in Kerala" };
  assert.ok(has(errs(lintClaims(k)), "claims", "gallery[0].alt"));
  const d = validConfig();
  assert.ok(altTexts(d).every((x) => x.text.length > 0), "decorative images are not scanned");
  assert.ok(!altTexts(d).some((x) => x.path.startsWith("stillness")), "the decorative stillness image has no alt to scan");
});

test("§10 locales: anything other than en is an error until a locale loader exists", () => {
  const c = validConfig(); c.locales = ["en", "de"]; c.translations.push({ locale: "de", review: "approved" });
  const out = errs(lintAssets(c, NOW));
  assert.ok(has(out, "locale.unsupported"));
  assert.match(out.find((i) => i.rule === "locale.unsupported").message, /^de:/);
  assert.ok(!has(errs(lintAssets(validConfig(), NOW)), "locale.unsupported"));
});

test("§11 fees: every priced row needs a USD figure (the fallback for missing currencies)", () => {
  const c = validConfig(); c.fees.rows[0].single = { INR: 400000 };
  assert.ok(has(errs(lintAssets(c, NOW)), "fees.usd", "fees.rows[0].single"));
  const e = validConfig(); e.fees.rows[0].single = {}; e.fees.rows[0].twinEach = {};
  assert.ok(has(errs(lintAssets(e, NOW)), "fees.usd", "fees.rows[0]"));
  const t = validConfig(); t.fees.rows[0].twinEach = {}; // a row priced single-only is fine with USD
  assert.ok(!has(lintAssets(t, NOW), "fees.usd"));
});

test("§14 types: tsc output is filtered to campaign-v2/ with continuation lines folded", () => {
  const out = [
    "campaign-v2/campaigns/x.ts(23,3): error TS2561: Object literal may only specify known properties, but 'programDefualt' does not exist in type 'CampaignConfig'.",
    "  Did you mean 'programDefault'?",
    "app/other.tsx(1,1): error TS2304: Cannot find name 'foo'.",
    "campaign-v2/kit/types.ts(5,10): error TS1005: ';' expected.",
  ].join("\n");
  const d = parseTscOutput(out);
  assert.equal(d.length, 2);
  assert.deepEqual([d[0].file, d[0].line, d[0].col, d[0].code], ["campaign-v2/campaigns/x.ts", 23, 3, "TS2561"]);
  assert.match(d[0].message, /programDefualt.*Did you mean 'programDefault'\?/);
  assert.equal(d[1].file, "campaign-v2/kit/types.ts");
});

test("§14 types: lp:check runs the type check and reports it", () => {
  const r = spawnSync(process.execPath, ["tools/lp-check.mjs", "panchakarma"], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /✔ types \(campaign-v2\/: 0 errors\)/);
  assert.match(r.stdout, /✔ panchakarma \(0 errors/);
});

test("lp:check on _template (preview) lists placeholders without crashing", () => {
  const r = spawnSync(process.execPath, ["tools/lp-check.mjs", "_template", "--no-types"], { encoding: "utf8" });
  assert.equal(r.status, 1, "the blank template still fails its count/length rules");
  assert.doesNotMatch(r.stderr, /TypeError|ReferenceError/);
  assert.match(r.stdout, /pending\(\) placeholder\(s\), allowed on preview/);
  assert.match(r.stdout, /pending seo\.title/);
  assert.doesNotMatch(r.stdout, /readability\.grade/, "pending objects no longer feed [object Object] into the grade");
});

test("lp:check names campaigns/index.ts when a slug is not registered", () => {
  const r = spawnSync(process.execPath, ["tools/lp-check.mjs", "not-registered", "--no-types"], { encoding: "utf8" });
  assert.equal(r.status, 2);
  assert.match(r.stdout, /campaigns\/index\.ts/);
});
