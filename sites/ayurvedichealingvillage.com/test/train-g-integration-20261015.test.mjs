// Train G integration (15 Oct 2026): the reviewer-accepted Train E rows on top of the Train F head dae94e21c.
//   E03 (2b5a19d4c, 99ac9c079, e4138ca59): AHV-I01.nav3/4/5, AHV-M070.01, AHV-M071.01, AHV-M082.02,
//       AHV-WB.112/135/177/270.benefit-copy
//   E04 (c311ebcb4 only): AHV-WB.276.change, AHV-WB.360.benefit-copy; 023f563c7 (AHV-M004.01) rejected and not taken
//   E02 (b2eeb48fd, accepted rows only): AHV-M045.01, AHV-N03.01, AHV-WB.105/128/170/263/354/510.quotation-box
// Every recorded Train G file reverses exactly to its Train F head bytes; each Train E candidate's own after-bytes hold in
// isolation on its cc1ddad6a base (Train G, then Trains F and B, removed exactly); the configs reverse exactly; rejected rows
// stay out. Source only: no build, browser or network.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { TRAIN_G, reverseTrainGSource, reverseTrainGConfig, splitTrainGLeadJoin } from "./fixtures/train-g-20261015.mjs";
import { reverseTrainFSource } from "./fixtures/train-f-20261015.mjs";
// The Train G rework (f883eedb3) is merged on top; its exact change to a Train G file is reversed first.
import { reverseTrainGReworkSource, TRAIN_G_REWORK_SOURCES } from "./fixtures/train-g-rework-20261015.mjs";
import { reverseTrainBSource } from "./fixtures/train-b-20261015.mjs";
import { reverseTrainASource } from "./fixtures/train-a-20261014.mjs";
import { TRAIN_E03 } from "./fixtures/train-e03-20261015.mjs";
import { TRAIN_E04 } from "./fixtures/train-e04-20261015.mjs";
import { N03 } from "./fixtures/n03-sanskrit-subtitle-20261015.mjs";
import { productionCampaign, PRODUCTION_SLUGS } from "../campaign-v2/production/load.ts";
import { lintCampaign } from "../campaign-v2/kit/lint/index.ts";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const sha = (s) => createHash("sha256").update(s).digest("hex");
const json = (p) => JSON.parse(read(p));
const plain = (v) => JSON.parse(JSON.stringify(v));
const TRAIN_E02 = json("test/fixtures/train-e02-20261015.json");

const CANDIDATES = [
  { name: "train E03", rec: TRAIN_E03 },
  { name: "train E04", rec: TRAIN_E04 },
  { name: "train E02", rec: TRAIN_E02 },
];

test("every recorded Train G file reverses exactly to the Train F head bytes; a Train F head text passes through", () => {
  for (const [f, e] of Object.entries(TRAIN_G.files)) {
    const integrated = read(f);
    if (TRAIN_G_REWORK_SOURCES[f]) assert.equal(sha(integrated), TRAIN_G_REWORK_SOURCES[f].afterSHA256, `${f}: integrated with the rework`);
    const now = reverseTrainGReworkSource(f, integrated);
    assert.equal(sha(now), e.afterSHA256, f);
    const trainF = reverseTrainGSource(f, now);
    assert.equal(sha(trainF), e.beforeSHA256, f);
    assert.equal(reverseTrainGSource(f, trainF), trainF, `${f}: idempotent on the Train F head bytes only`);
    assert.throws(() => reverseTrainGSource(f, now + " "), undefined, `${f}: any third state fails`);
    assert.ok(e.rows.length >= 1, f);
  }
  // every rework reversal targets a recorded Train G file, and a third state fails
  for (const f of Object.keys(TRAIN_G_REWORK_SOURCES)) {
    assert.ok(TRAIN_G.files[f], `${f}: a recorded Train G file`);
    assert.throws(() => reverseTrainGReworkSource(f, read(f) + " "), undefined, `${f}: any third rework state fails`);
  }
  assert.equal(Object.keys(TRAIN_G.views).length, 17);
  assert.deepEqual(Object.keys(TRAIN_G.views).map((f) => f.split("/").pop().replace(/\.json$/, "")).sort(), Object.keys(N03.views).sort());
  for (const [f, e] of Object.entries(TRAIN_G.views)) assert.equal(sha(reverseTrainGSource(f, read(f))), e.beforeSHA256, f);
});

test("each Train E candidate's own after-bytes hold in isolation on its recorded base", () => {
  let checked = 0;
  for (const { name, rec } of CANDIDATES) {
    for (const [f, e] of Object.entries(rec.files)) {
      assert.ok(TRAIN_G.files[f], `${f} (${name}) is recorded in Train G`);
      // cc1ddad6a bytes; E02 recorded its base as the Train A base (c54e2795e) on the files Train A also touched.
      const trainA = reverseTrainBSource(f, reverseTrainFSource(f, read(f)));
      const base = sha(trainA) === e.beforeSHA256 ? trainA : reverseTrainASource(f, trainA);
      assert.equal(sha(base), e.beforeSHA256, `${f} (${name}): the candidate's recorded base`);
      let v = base;
      for (const { before, after } of e.replacements) {
        assert.equal(v.split(before).length - 1, 1, `${f} (${name}): delta applies once to the base`);
        v = v.replace(before, () => after);
      }
      assert.equal(sha(v), e.afterSHA256, `${f} (${name}): exactly the candidate's own source`);
      checked += 1;
    }
  }
  assert.equal(checked, 4 + 2 + 6);
});

test("configs: Train G changes exactly the recorded fields on six routes and reverses to the Train F head", () => {
  assert.deepEqual(Object.keys(TRAIN_G.configChanges).sort(), ["brand", "lp-behandlung-kerala", "lp-brand", "monsoon-wellness", "rejuvenation-detox", "wellness-kerala"]);
  for (const slug of PRODUCTION_SLUGS) {
    const now = plain(productionCampaign(slug));
    const trainF = reverseTrainGConfig(slug, plain(now));
    assert.equal(JSON.stringify(reverseTrainGConfig(slug, plain(trainF))), JSON.stringify(trainF), `${slug}: Train F head passes through`);
    if (!TRAIN_G.configChanges[slug]) assert.equal(JSON.stringify(trainF), JSON.stringify(now), slug);
    else assert.notEqual(JSON.stringify(trainF), JSON.stringify(now), slug);
  }
});

test("integration edit: brand keeps a 1-3 paragraph lead; the AHV-WB.270 and AHV-WB.276 lines are each present once, word for word", () => {
  const paras = productionCampaign("brand").page.lead.paragraphs;
  assert.equal(paras.length, 3);
  const j = TRAIN_G.leadJoins.brand;
  assert.equal(j.text, TRAIN_E03.configChanges.brand.text);
  assert.equal(j.anchor, TRAIN_E03.configChanges.brand.insertedAfter);
  assert.equal(paras.filter((p) => p === `${j.anchor} ${j.text}`).length, 1);
  assert.equal(paras.filter((p) => p === TRAIN_E04.configChanges.brand.text).length, 1);
  assert.equal(paras[paras.indexOf(TRAIN_E04.configChanges.brand.text) - 1], TRAIN_E04.configChanges.brand.insertedAfter);
  assert.deepEqual(splitTrainGLeadJoin("brand", paras).length, 4);
  for (const slug of Object.keys(TRAIN_G.configChanges)) {
    assert.deepEqual(lintCampaign(productionCampaign(slug)).errors, [], slug);
  }
});

test("rejected rows stay out: E02 benefit lines and E04's AHV-M004.01", () => {
  for (const slug of ["ayurveda-retreat", "lp-treatment-kerala", "lp-treatment-packages"]) {
    assert.equal(TRAIN_G.files[`campaign-v2/production/pages/${slug}.ts`], undefined, slug);
    assert.equal(productionCampaign(slug).page.lead.paragraphs.length, 2, slug);
  }
  assert.deepEqual(Object.keys(TRAIN_E02.files).sort(), Object.keys(TRAIN_E02.configChanges).map((s) => `campaign-v2/production/pages/${s}.ts`).sort());
  assert.equal(Object.keys(TRAIN_E02.rows).every((r) => r.endsWith(".quotation-box")), true);
  // 023f563c7 (AHV-M004.01) would add the contextual-resources exception to section-nav.js and its own test.
  assert.doesNotMatch(read("public/design/section-nav.js"), /contextual-resources|isLegacySidebar/);
  assert.equal(fs.existsSync(new URL("./section-nav-contextual-resources.test.mjs", import.meta.url)), false);
  // D06's six quotation-box rows stay reverted at the Train F head (train-b-integration / train-d06-copy check them there);
  // the accepted E02 rework of the same rows supersedes them in Train G, and some E02 deletions coincide with D06's.
});
