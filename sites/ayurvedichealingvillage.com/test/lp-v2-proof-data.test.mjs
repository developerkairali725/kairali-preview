// test/lp-v2-proof-data.test.mjs: Task 18, awards and ratings registries (campaign-v2/data/*.ts).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { AWARDS, FEATURED_AWARDS, awardRow, AWARD_ROW_MAX, LATEST_TRAVELERS_CHOICE } from "../campaign-v2/data/awards.ts";
import { TRIPADVISOR, NABH_VALIDITY, monthLabel } from "../campaign-v2/data/ratings.ts";
import { getGoogleRating } from "../campaign-v2/data/google-rating.ts";
import { lintData } from "../campaign-v2/kit/lint/data.ts";
import { lintCampaign } from "../campaign-v2/kit/lint/index.ts";
import { validConfig } from "./fixtures/lp-v2-valid.ts";
// Train I (15 Oct 2026, AHV-LATER-038.01) dates the figures to the 29 Aug 2026 capture; these pins run on the prior registry.
import { reverseTrainIRatings } from "./fixtures/train-i-20261015.mjs";

const pub = (src) => fileURLToPath(new URL(`../public${src}`, import.meta.url));

/** Pixel size from a PNG or WebP header (no dependencies). */
function imageSize(file) {
  const b = readFileSync(file);
  if (b.toString("ascii", 1, 4) === "PNG") return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const chunk = b.toString("ascii", 12, 16);
    if (chunk === "VP8X") return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
    if (chunk === "VP8 ") return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (chunk === "VP8L") { const n = b.readUInt32LE(21); return { width: 1 + (n & 0x3fff), height: 1 + ((n >> 14) & 0x3fff) }; }
  }
  throw new Error(`unknown image format: ${file}`);
}

test("every award logo file exists in public/ with the registry's true pixel size", () => {
  for (const a of AWARDS) {
    const file = pub(a.logo.src);
    assert.ok(existsSync(file), `${a.id}: missing ${a.logo.src}`);
    assert.deepEqual(imageSize(file), { width: a.logo.width, height: a.logo.height }, `${a.id}: ${a.logo.src}`);
  }
});

test("featured awards: the verified five, most recent first", () => {
  assert.deepEqual(FEATURED_AWARDS.map((a) => a.id), ["ta-travelers-choice-2026", "haute-grandeur-2026", "patwa-2026", "natgeo-traveller-2026", "world-luxury-2025"]);
  assert.deepEqual(FEATURED_AWARDS.map((a) => a.alt), [
    "Tripadvisor Travelers' Choice 2026",
    "Haute Grandeur Global Excellence Awards 2026",
    "PATWA International Travel Award 2026",
    "National Geographic Traveller: 2026 Spa & Wellness Collection",
    "World Luxury Hotel & Spa Awards 2025",
  ]);
  for (const a of AWARDS) {
    assert.match(a.sourceUrl, /^https:\/\//, a.id);
    assert.match(a.verifiedOn, /^\d{4}-\d{2}-\d{2}$/, a.id);
    assert.ok(a.alt.includes(String(a.year)), `${a.id}: alt must carry the year`);
  }
  // Only the two named World Luxury titles; never invented ones.
  assert.deepEqual(AWARDS.find((a) => a.id === "world-luxury-2025").titles, ["Best Luxury Ayurveda Retreat (Global Winner)", "Best Luxury Yoga Retreat"]);
  assert.ok(!AWARDS.some((a) => /marketing director|monsoon/i.test(`${a.name} ${a.titles.join(" ")}`)), "excluded items stay out");
  assert.equal(LATEST_TRAVELERS_CHOICE.year, 2026);
});

test("logo row: max 5 on desktop, max 4 on phones; the rest are not rendered on phones", () => {
  assert.deepEqual(AWARD_ROW_MAX, { desktop: 5, mobile: 4 });
  const row = awardRow();
  assert.equal(row.length, 5);
  assert.deepEqual(row.map((s) => s.mobile), [true, true, true, true, false]);
  const many = [...FEATURED_AWARDS, ...FEATURED_AWARDS];
  assert.equal(awardRow(many).length, 5);
  assert.equal(awardRow(many).filter((s) => s.mobile).length, 4);
});

test("no logo is upscaled: natural height >= 2x the 60px row height", () => {
  for (const { award } of awardRow()) assert.ok(award.logo.height >= 120, `${award.id} needs a higher-res asset`);
  assert.ok(LATEST_TRAVELERS_CHOICE.logo.height >= 2 * 56, "B/D card badge");
});

test("ratings registry: Tripadvisor values as verified 2026-10-07", () => {
  assert.equal(TRIPADVISOR.rating, 4.6);
  assert.equal(TRIPADVISOR.reviewCount, 450);
  assert.equal(reverseTrainIRatings(TRIPADVISOR).asOf, "2026-08");
  assert.equal(monthLabel(reverseTrainIRatings(TRIPADVISOR).asOf), "August 2026");
  assert.match(TRIPADVISOR.badgeText, /Travelers' Choice/);
  assert.match(TRIPADVISOR.listingUrl, /^https:\/\/www\.tripadvisor\.in\/Hotel_Review-/);
  assert.equal(NABH_VALIDITY, "2024–2027");
});

test("ProofStrip has no typed-in ratings or placeholders", () => {
  const src = readFileSync(fileURLToPath(new URL("../campaign-v2/sections/ProofStrip.tsx", import.meta.url)), "utf8");
  assert.ok(!/pending\(|"C5"|\[4\.x\]|\[N\]/.test(src), "no placeholders");
  assert.ok(!/\b4\.\d\b|\b450\b/.test(src), "no hand-typed rating numbers");
  assert.ok(!/\/lp-v2\/img\/logo-|\/ahv\/assets\/img\//.test(src), "logos come from data/awards.ts");
});

// --- data.stale -------------------------------------------------------------------------------
const rules = (issues) => issues.map((i) => i.rule);

test("data.stale: quiet on 2026-10-07 and in lp:check", () => {
  assert.deepEqual(lintData(new Date("2026-10-07T00:00:00Z")), []);
  assert.ok(!rules(lintCampaign(validConfig(), new Date("2026-10-07T00:00:00Z")).warnings).includes("data.stale"));
});

test("data.stale: Tripadvisor asOf older than 120 days warns", () => {
  assert.deepEqual(lintData(new Date("2026-11-29T00:00:00Z"), reverseTrainIRatings(TRIPADVISOR)), []); // Aug 1 + 120 days
  const out = lintData(new Date("2026-12-01T00:00:00Z"), reverseTrainIRatings(TRIPADVISOR));
  assert.deepEqual(rules(out), ["data.stale"]);
  assert.equal(out[0].level, "warning");
  assert.match(out[0].message, /Re-verify ratings\/awards from https:\/\/ayurvedichealingvillage\.com\/ and update campaign-v2\/data\/\*\.ts/);
});

test("data.stale: a featured award verifiedOn older than 180 days warns (one per award)", () => {
  const now = new Date("2027-04-06T00:00:00Z"); // 2026-10-07 + 181 days
  const out = lintData(now, { asOf: "2027-03" });
  assert.equal(out.length, FEATURED_AWARDS.length);
  assert.ok(out.every((i) => i.rule === "data.stale" && i.level === "warning"));
  assert.deepEqual(lintData(new Date("2027-04-05T00:00:00Z"), { asOf: "2027-03" }), []);
});

// --- register exemption -----------------------------------------------------------------------
test("register: award names from the registry are proper nouns, not register words", () => {
  const c = validConfig();
  c.village.body = "Named in the World Luxury Hotel & Spa Awards 2025 and the National Geographic Traveller: 2026 Spa & Wellness Collection. Laterite, teak and terracotta rooms.";
  const w = lintCampaign(c, new Date("2026-10-08T00:00:00Z"));
  assert.ok(!rules(w.warnings).includes("register"), JSON.stringify(w.warnings));
  assert.ok(!rules(w.errors).includes("spelling.us"), JSON.stringify(w.errors));
  const d = validConfig();
  d.village.body = "A luxury spa among the gardens. Laterite, teak and terracotta rooms around the gardens.";
  assert.ok(rules(lintCampaign(d, new Date("2026-10-08T00:00:00Z")).warnings).includes("register"));
});

// --- Google: live only, never a typed number ----------------------------------------------------
const ENV = { AHV_GOOGLE_REVIEWS_ENABLED: "1", AHV_GOOGLE_PLACES_API_KEY: "test-key", AHV_GOOGLE_PLACE_ID: "test-place" };
const okFetch = async () => new Response(JSON.stringify({
  displayName: { text: "Kairali - The Ayurvedic Healing Village" }, rating: 4.7, userRatingCount: 1234,
  googleMapsUri: "https://maps.google.com/?cid=1", reviews: [],
}), { status: 200 });

test("getGoogleRating: null when not enabled (no fetch made)", async () => {
  let called = false;
  const f = async () => { called = true; return okFetch(); };
  assert.equal(await getGoogleRating({}, f), null);
  assert.equal(await getGoogleRating({ ...ENV, AHV_GOOGLE_REVIEWS_ENABLED: "0" }, f), null);
  assert.equal(called, false);
});

test("getGoogleRating: rating, count and mapsUri when the Places API is ready", async () => {
  assert.deepEqual(await getGoogleRating({ ...ENV }, okFetch), { rating: 4.7, count: 1234, mapsUri: "https://maps.google.com/?cid=1" });
});

test("getGoogleRating: never throws; errors, non-200 and missing numbers give null", async () => {
  assert.equal(await getGoogleRating({ ...ENV }, async () => { throw new Error("network"); }), null);
  assert.equal(await getGoogleRating({ ...ENV }, async () => new Response("no", { status: 500 })), null);
  const noCount = async () => new Response(JSON.stringify({ displayName: { text: "Kairali The Ayurvedic Healing Village" }, rating: 4.7 }), { status: 200 });
  assert.equal(await getGoogleRating({ ...ENV }, noCount), null);
});

test("getGoogleRating: passes a short abort signal to the fetch", async () => {
  let signal;
  await getGoogleRating({ ...ENV }, async (_u, init) => { signal = init.signal; return okFetch(); });
  assert.ok(signal instanceof AbortSignal);
});
