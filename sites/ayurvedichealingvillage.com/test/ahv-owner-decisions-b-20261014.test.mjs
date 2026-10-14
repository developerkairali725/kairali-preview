// Owner decisions, 14 Oct 2026 (OWNER-DECISIONS-20261014-ANSWERS.json: 5-family-conditions, 6-airport-pickup,
// 7-timetable), scoped to the routes their tracker rows name: AHV-WB.083.change (/family-ayurvedic-retreat-kerala.html),
// AHV-WB.330.change (/lp/ayurveda-treatment-south-india/) and AHV-WB.167.change (/ayurveda-retreat-kerala.html).
// Source-level: no build, browser or network. Exact source reversal lives in test/fixtures/owner-decisions-b-20261014.json.
import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { productionCampaign, PRODUCTION_SLUGS } from "../campaign-v2/production/load.ts";
import { COPY } from "../campaign-v2/production/pages/index.ts";
import { reverseTrainASource } from "./fixtures/train-a-20261014.mjs";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(SITE, p), "utf8");
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
const fixture = JSON.parse(read("test/fixtures/owner-decisions-b-20261014.json"));
const C = Object.fromEntries(PRODUCTION_SLUGS.map((s) => [s, productionCampaign(s)]));
const strings = (x) => (typeof x === "string" ? [x] : Array.isArray(x) ? x.flatMap(strings) : x && typeof x === "object" ? Object.values(x).flatMap(strings) : []);
const pageText = (slug) => [...strings(C[slug].page), ...strings(C[slug].faq), ...strings(C[slug].hero), ...strings(C[slug].seo)].join("\n");

test("scope: exactly the three row routes change, each by an exact reversible source delta", () => {
  assert.deepEqual(fixture.rows, { "AHV-WB.083.change": "family-ayurvedic-retreat", "AHV-WB.330.change": "lp-south-india", "AHV-WB.167.change": "ayurveda-retreat" });
  assert.deepEqual(C["family-ayurvedic-retreat"].route, "/family-ayurvedic-retreat-kerala.html");
  assert.deepEqual(C["lp-south-india"].route, "/lp/ayurveda-treatment-south-india/");
  assert.deepEqual(C["ayurveda-retreat"].route, "/ayurveda-retreat-kerala.html");
  assert.deepEqual(Object.keys(fixture.files).sort(), Object.values(fixture.rows).map((s) => `campaign-v2/production/pages/${s}.ts`).sort());
  // Train A integration: batch 6 also edited lp-south-india.ts, so the composed reversal (fixtures/train-a-20261014.mjs)
  // checks this candidate's own after-bytes with every other candidate's delta removed, then the base bytes.
  for (const [f, e] of Object.entries(fixture.files)) {
    const s = reverseTrainASource(f, read(f));
    assert.equal(sha(s), e.beforeSHA256, f);
  }
  assert.deepEqual(Object.keys(fixture.configChanges).sort(), Object.values(fixture.rows).sort());
});

test("WB.083: the family list keeps only existing reviewed topics, wording unchanged, for parents; nothing added", () => {
  const before = fixture.configChanges["family-ayurvedic-retreat"].find((d) => d.path.join(".") === "page.offering.topics").before;
  const now = C["family-ayurvedic-retreat"].page.offering;
  assert.equal(now.kind, "index");
  assert.equal(now.heading, "Explore the care each person wants to discuss");
  assert.ok(now.topics.length >= 5 && now.topics.length < before.length);
  // Every kept topic is an exact reviewed entry, in its reviewed relative order.
  const idx = now.topics.map((t) => before.findIndex((b) => b.title === t.title && b.body === t.body));
  assert.ok(idx.every((i) => i >= 0), "no new topic or wording");
  assert.deepEqual([...idx].sort((a, b) => a - b), idx, "reviewed order");
  for (const dropped of ["Addiction recovery", "Neurological care needs", "Women’s hormonal health", "Skin concerns", "Respiratory health", "Weight management"])
    assert.ok(!now.topics.some((t) => t.title === dropped), dropped);
  // Parents' concerns the owner named stay: joints, sleep (pain affecting sleep), digestion, rejuvenation (Rasayana).
  assert.ok(now.topics.some((t) => /Joint care/.test(t.title)));
  assert.ok(now.topics.some((t) => /sleep/.test(t.body)));
  assert.ok(now.topics.some((t) => /Digestive/.test(t.title)));
  assert.ok(now.topics.some((t) => /Rasayana/.test(t.body)));
  // The family form is untouched: the topic list is the only config field this change moves.
  assert.deepEqual(fixture.configChanges["family-ayurvedic-retreat"].map((d) => d.path.join(".")), ["page.offering.topics"]);
  assert.equal(COPY["family-ayurvedic-retreat"].familyFormNote, "Share any health concerns you would like to discuss with the doctor. This field is optional.");
  assert.deepEqual(C["family-ayurvedic-retreat"].productionForm, { formVariant: "r10-family-retreat", downloadGuide: false, profile: "family-retreat" });
});

test("WB.330: airport pick-up on request at an extra charge, with no price, travel time or distance", () => {
  const step = C["lp-south-india"].page.pathway.steps.find((s) => s.title === "Arrange the trip to Palakkad");
  assert.match(step.body, /Airport pick-up can be arranged on request at an extra charge\./);
  const text = pageText("lp-south-india");
  assert.equal(text.split("pick-up").length - 1, 1, "stated once");
  assert.doesNotMatch(text, /(₹|Rs\.?\s?\d|INR|USD|\$\s?\d|€)/, "no price");
  assert.doesNotMatch(text, /\b\d+(\.\d+)?\s?(km|kilomet|hours?|hrs?|minutes?|mins?)\b/i, "no distance or travel time");
  assert.deepEqual(C["lp-south-india"].locales, ["en"], "English-only route: no other locale to translate");
});

test("WB.167: a typical day from the approved Dinacharya times only, second therapy only when the plan has two", () => {
  const steps = C["ayurveda-retreat"].page.pathway.steps;
  assert.equal(steps.length, 3);
  const day = steps.find((s) => s.title === "Settle into a daily routine").body;
  assert.match(day, /On a typical day, your first treatment is at 09:30 and an activity at 14:00; a second therapy follows at 15:30 only when your plan includes two therapies\./);
  const times = pageText("ayurveda-retreat").match(/\b\d{1,2}[:.]\d{2}\b|\b\d{1,2}\s?(am|pm)\b/gi) ?? [];
  assert.deepEqual(times, ["09:30", "14:00", "15:30"], "only the approved times");
  assert.doesNotMatch(day, /two therapies (a|per|each) day|daily two/i, "never promised universally");
  // The 'A day at the village' film stays.
  assert.ok(C["ayurveda-retreat"].page.stories.films.some((f) => f.title === "A day at the village" && /iPARaMRASUs/.test(f.href)));
});
