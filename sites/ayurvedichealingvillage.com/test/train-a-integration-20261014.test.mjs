// Train A integration (14 Oct 2026): every source file that any merged candidate recorded (batch 5, batch 6, batch 8 without the
// rejected AHV-WB.015/039/253, owner decisions, owner decisions B) reverses through the composed reversal to its
// candidate's recorded base bytes, each candidate's own after-bytes checked in isolation (fixtures/train-a-20261014.mjs).
// Source only: no build, browser or network.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { TRAIN_A, TRAIN_A_CANDIDATES, reverseTrainASource } from "./fixtures/train-a-20261014.mjs";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const sha = (s) => createHash("sha256").update(s).digest("hex");

test("every recorded candidate file reverses exactly to its base bytes in the integrated tree", () => {
  const files = [...new Set(TRAIN_A_CANDIDATES.flatMap((c) => Object.keys(c.files)))].sort();
  assert.equal(files.length, 19, `${files.length} files`);
  for (const f of files) {
    const current = read(f);
    const base = reverseTrainASource(f, current);
    assert.notEqual(base, current, f);
    for (const c of TRAIN_A_CANDIDATES.filter((x) => x.files[f])) assert.equal(sha(base), c.files[f].beforeSHA256, `${f} (${c.name})`);
  }
});

test("overlaps: only the recorded file, pinned to its integrated bytes, merged on top of the named older candidate", () => {
  assert.deepEqual(Object.keys(TRAIN_A.overlaps), ["campaign-v2/production/sections/guest-video-policy.mjs"]);
  for (const [f, o] of Object.entries(TRAIN_A.overlaps)) {
    assert.equal(sha(read(f)), o.integratedSHA256, f);
    const older = TRAIN_A_CANDIDATES.find((c) => c.name === o.over);
    assert.equal(o.resultSHA256, older.files[f].afterSHA256, f);
  }
  assert.equal(TRAIN_A.base, "c54e2795ebf7f1c525313ff2ea10b1fd95881f4e");
});

test("the rejected rows stay out: no AHV-WB.015/039/253 delta and no German WhatsApp message", () => {
  const batch8 = TRAIN_A_CANDIDATES.find((c) => c.name === "train-a batch 8");
  for (const f of ["campaign-v2/production/pages/treatment-packages.ts", "campaign-v2/production/sections/guest-video-policy.mjs", "campaign-v2/production/pages/south-india-cities.ts"])
    assert.equal(batch8.files[f], undefined, f);
  assert.doesNotMatch(read("campaign-v2/production/pages/treatment-packages.ts"), /stories:/);
  assert.doesNotMatch(read("campaign-v2/production/pages/south-india-cities.ts"), /Coimbatore|CJB|km by road/);
  assert.doesNotMatch(read("campaign-v2/production/pages/panchakarma.ts"), /stories:/);
  assert.doesNotMatch(read("campaign-v2/production/sections/guest-video-policy.mjs"), /"\/ayurvedic-treatment-packages\.html"|"\/panchkarma-treatment\.html"/);
  assert.doesNotMatch(read("campaign-v2/production/whatsapp.ts"), /Hallo|\bde:/);
});
