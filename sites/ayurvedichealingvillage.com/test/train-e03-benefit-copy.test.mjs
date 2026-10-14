// AHV-WB.112/135/177/270.benefit-copy (staff, 9 Oct: "add simple benefit lines"; settled assessment
// IMPLEMENT_FACT_SOURCED_COPY): one non-outcome benefit line per route, drafted only from that route's reviewed brief.
// Every clause must be traceable to the brief; no outcome/result promise and no KTAHV-locked word.
import { test } from "node:test";
import fs from "node:fs";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { productionCampaign } from "../campaign-v2/production/load.ts";
import { TRAIN_E03 } from "./fixtures/train-e03-20261015.mjs";

const LOCKED = /\b(spa|resort|holiday|luxury|luxurious|cure[sd]?|journey|guests?)\b/i;
const OUTCOME = /\b(results?|heal(s|ed|ing)?|improve[sd]?|relief|relieve|feel better|guarantee[sd]?|transform)\b/i;

test("each route carries exactly its one recorded benefit line, after its anchor paragraph", () => {
  assert.deepEqual(Object.keys(TRAIN_E03.configChanges).sort(), ["brand", "monsoon-wellness", "rejuvenation-detox", "wellness-kerala"]);
  for (const [slug, rec] of Object.entries(TRAIN_E03.configChanges)) {
    const paras = productionCampaign(slug).page.lead.paragraphs;
    assert.equal(paras.filter((p) => p === rec.text).length, 1, slug);
    assert.equal(paras[paras.indexOf(rec.text) - 1], rec.insertedAfter, slug);
    assert.match(rec.text, /^What your stay gives you: /, slug);
  }
});

test("benefit lines: register-safe, no outcome promise, every clause sourced from the reviewed brief", () => {
  for (const [slug, rec] of Object.entries(TRAIN_E03.configChanges)) {
    assert.doesNotMatch(rec.text, LOCKED, `${slug}: KTAHV language lock`);
    assert.doesNotMatch(rec.text, OUTCOME, `${slug}: no outcome claim`);
    assert.ok(rec.text.length <= 260, `${slug}: one simple line`);
    assert.ok(TRAIN_E03.briefs[slug].quotes.length >= 3, slug);
  }
});

// The reviewed briefs live in the workspace deliverables, not in this repository: set AHV_BRIEF_ROOT to the workspace
// root to check each brief's recorded hash and that every quoted source sentence is in it verbatim.
const ROOT = process.env.AHV_BRIEF_ROOT;
test("the quoted brief sentences are verbatim in the hash-recorded reviewed briefs", { skip: !ROOT && "AHV_BRIEF_ROOT not set" }, () => {
  for (const slug of Object.keys(TRAIN_E03.configChanges)) {
    const b = TRAIN_E03.briefs[slug];
    const text = fs.readFileSync(`${ROOT}/${TRAIN_E03.briefs.root}/${b.file}`, "utf8");
    assert.equal(createHash("sha256").update(text).digest("hex"), b.sha256, b.file);
    for (const q of b.quotes) assert.ok(text.replace(/\s+/g, " ").includes(q), `${slug}: ${q}`);
  }
});
