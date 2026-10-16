// AHV-WB.276.change (staff, 9 Oct: "Add a 'Kairali at a glance' box: NABH, 65 acres, 30 villas, doctors, price from, map";
// settled assessment PARTIAL_SCOPED_IMPLEMENTATION) and AHV-WB.360.benefit-copy (staff: "add simple benefit lines";
// settled assessment IMPLEMENT_FACT_SOURCED_COPY). One lead paragraph each, drafted only from the route's reviewed brief:
// no price, no unresolved acreage, no outcome promise, no KTAHV-locked word, no new UI.
import { test } from "node:test";
import fs from "node:fs";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { productionCampaign } from "../campaign-v2/production/load.ts";
import { TRAIN_E04 } from "./fixtures/train-e04-20261015.mjs";

const LOCKED = /\b(spa|resort|holiday|luxury|luxurious|cure[sd]?|journey|guests?)\b/i;
const OUTCOME = /\b(results?|heal(s|ed|ing)?|improve[sd]?|relief|relieve|feel better|guarantee[sd]?|transform)\b/i;
const PRICE = /(₹|\$|€|£|\bINR\b|\bUSD\b|\bEUR\b|\bprice|\bfrom\s+\d|\d[\d,.]*\s*(per|\/)\s*(night|day))/i;

test("each route carries exactly its one recorded line, after its anchor paragraph", () => {
  assert.deepEqual(Object.keys(TRAIN_E04.configChanges).sort(), ["brand", "lp-brand"]);
  for (const [slug, rec] of Object.entries(TRAIN_E04.configChanges)) {
    const paras = productionCampaign(slug).page.lead.paragraphs;
    assert.equal(paras.filter((p) => p === rec.text).length, 1, slug);
    assert.equal(paras[paras.indexOf(rec.text) - 1], rec.insertedAfter, slug);
  }
});

test("AHV-WB.276: price-free at-a-glance facts with an internal directions link; no acreage", () => {
  const t = TRAIN_E04.configChanges.brand.text;
  assert.match(t, /^At a glance: /);
  for (const fact of ["NABH-accredited Ayurvedic hospital", "Palakkad, Kerala", "30 villas in a garden setting", "Ayurvedic doctors"]) assert.ok(t.includes(fact), fact);
  assert.ok(t.endsWith("[location and directions](/how-to-reach/)."), "map element = internal directions page link");
  assert.doesNotMatch(t, PRICE, "owner 7 Oct no-numeric-price rule");
  assert.doesNotMatch(t, /acre/i, "65-acre vs 14-acre conflict unresolved");
  assert.doesNotMatch(t, /google\.com\/maps|https?:/i, "no outbound map link");
});

test("AHV-WB.360: one non-outcome benefit line", () => {
  const t = TRAIN_E04.configChanges["lp-brand"].text;
  assert.match(t, /^What your stay gives you: /);
  assert.ok(t.length <= 260);
});

test("both lines: register-safe, no outcome promise, no price, every clause backed by brief quotes", () => {
  for (const [slug, rec] of Object.entries(TRAIN_E04.configChanges)) {
    assert.doesNotMatch(rec.text, LOCKED, `${slug}: KTAHV language lock`);
    assert.doesNotMatch(rec.text, OUTCOME, `${slug}: no outcome claim`);
    assert.doesNotMatch(rec.text, PRICE, `${slug}: no price`);
    assert.ok(TRAIN_E04.briefs[slug].quotes.length >= 3, slug);
  }
});

// The reviewed briefs live in the workspace deliverables, not in this repository: set AHV_BRIEF_ROOT to the workspace
// root to check each brief's recorded hash and that every quoted source sentence is in it verbatim.
const ROOT = process.env.AHV_BRIEF_ROOT;
test("the quoted brief sentences are verbatim in the hash-recorded reviewed briefs", { skip: !ROOT && "AHV_BRIEF_ROOT not set" }, () => {
  for (const slug of Object.keys(TRAIN_E04.configChanges)) {
    const b = TRAIN_E04.briefs[slug];
    const text = fs.readFileSync(`${ROOT}/${TRAIN_E04.briefs.root}/${b.file}`, "utf8");
    assert.equal(createHash("sha256").update(text).digest("hex"), b.sha256, b.file);
    for (const q of b.quotes) assert.ok(text.replace(/\s+/g, " ").includes(q), `${slug}: ${q}`);
  }
});
