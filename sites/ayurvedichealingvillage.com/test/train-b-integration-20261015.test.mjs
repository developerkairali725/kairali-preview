// Train B integration (15 Oct 2026): every source file that any merged Train B candidate recorded reverses through the
// composed reversal (fixtures/train-b-20261015.mjs) to the integrated Train A bytes, each candidate's own after-bytes
// checked in isolation on c54e2795e; rejected rows stay out; the two owner-approved edits are exactly in place.
// Source only: no build, browser or network.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { TRAIN_B, TRAIN_B_CANDIDATES, reverseTrainBSource, candidateSource } from "./fixtures/train-b-20261015.mjs";
// Train F (15 Oct 2026) sits on top of Train B: its exact source delta is removed first (fixtures/train-f-20261015.mjs).
import { reverseTrainFSource } from "./fixtures/train-f-20261015.mjs";
import { productionCampaign, PRODUCTION_SLUGS } from "../campaign-v2/production/load.ts";
import { productionJsonLd } from "../campaign-v2/production/metadata.ts";
import { PHOTO_PICKS_20261014 } from "../campaign-v2/production/bindings.ts";
import { FAMILY_DURATIONS } from "../campaign-v2/forms/schema.ts";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const sha = (s) => createHash("sha256").update(s).digest("hex");
const json = (p) => JSON.parse(read(p));

test("every recorded Train B file reverses exactly to the integrated Train A bytes; each candidate's own bytes hold", () => {
  const files = [...new Set(TRAIN_B_CANDIDATES.flatMap((c) => Object.keys(c.files)))].sort();
  assert.deepEqual(files, Object.keys(TRAIN_B.trainABytesSHA256).sort());
  for (const f of files) {
    const current = reverseTrainFSource(f, read(f));
    const trainA = reverseTrainBSource(f, current);
    assert.notEqual(trainA, current, f);
    assert.equal(sha(trainA), TRAIN_B.trainABytesSHA256[f], f);
    for (const c of TRAIN_B_CANDIDATES.filter((x) => x.files[f])) assert.equal(sha(candidateSource(c.name, f, current)), c.files[f].afterSHA256, `${f} (${c.name})`);
  }
});

test("the rejected rows stay out", () => {
  // Owner decisions C: AHV-WB.005.hero-image and AHV-WB.403.change keep their prior heroes. (Train F re-does both rows in
  // its own PHOTO_PICKS_20261015, checked by train-f-photos-20261015.test.mjs; the decision-10 record here is unchanged.)
  assert.equal(PHOTO_PICKS_20261014["treatment-packages"].hero, undefined);
  assert.equal(PHOTO_PICKS_20261014["lp-pain-management"].hero, undefined);
  // D03 / D04 / D05 / D06: every rejected replacement's prior wording is back, once.
  const reverted = [
    ...json("test/fixtures/d03-copy-corrections-20261014.json").trainBExclusions.filter((x) => x.action === "reverted"),
    ...json("test/fixtures/train-d04-copy-20261014.json").trainBExclusions.flatMap((x) => x.replacements.map((r) => ({ ...r, file: x.file, row: x.row }))),
    ...json("test/fixtures/train-d05-20261014.json").trainBExclusions.flatMap((x) => x.replacements.map((r) => ({ ...r, file: x.file, row: x.row }))),
    ...json("test/fixtures/train-d06-copy-20261015.json").trainBExclusions.replacements,
  ];
  assert.equal(reverted.length, 6 + 2 + 2 + 7);
  for (const { file, before, after, row } of reverted) {
    assert.equal(read(file).split(before).length - 1, 1, `${row}: prior wording present once`);
    if (!before.includes(after)) assert.equal(read(file).split(after).length - 1, 0, `${row}: rejected wording absent`);
  }
  // Train D07 (AHV-WB.516.benefit-copy) and queued batch 12 (AHV-N03.01) were not merged.
  assert.doesNotMatch(read("campaign-v2/production/pages/lp-behandlung-kerala.ts"), /AHV-WB\.516/);
  assert.equal(fs.existsSync(new URL("./n03-yoga-sanskrit-subtitle.test.mjs", import.meta.url)), false);
});

test("owner decisions 22 and 23 are exactly in place", () => {
  assert.deepEqual(FAMILY_DURATIONS.map((o) => o.value), ["", "7 nights", "14 nights", "21 nights"]);
  const lead = productionCampaign("lp-panchakarma").page.lead.paragraphs[0];
  assert.equal(lead.startsWith("When you compare Panchakarma packages, it is natural to look at length first. "), true);
  assert.doesNotMatch(lead, /\bcost/i);
  assert.doesNotMatch(JSON.stringify(productionCampaign("lp-panchakarma")), /₹|\bINR\b|\bUSD\b|\bfrom \d/);
});

test("the site entity is emitted once per route (C01/C02/D02 reviewed routes and D01 routes compose)", () => {
  for (const slug of PRODUCTION_SLUGS) {
    const graph = productionJsonLd(slug, productionCampaign(slug));
    assert.equal(graph.filter((n) => n["@id"] === "https://ayurvedichealingvillage.com/#organization").length, 1, slug);
  }
});
