// Train A batch 6 (14 Oct 2026): the exact source deltas of AHV-WB.530.first-screen-cta, AHV-WB.021/459.phone-example,
// AHV-WB.021/161/304.checkbox-wording and AHV-WB.249/320/430/272 guest-video + villa-gallery
// (train-a-batch6-20261014.json). Tests that pin earlier bytes or configs remove exactly these deltas first, so every
// prior pin and fixture stays as it was. Removing a delta here and in the source restores the prior state.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";

export const BATCH6 = JSON.parse(fs.readFileSync(new URL("./train-a-batch6-20261014.json", import.meta.url), "utf8"));
const sha = (s) => createHash("sha256").update(s).digest("hex");

/** The source text with this batch's exact delta removed (unchanged for a file the batch did not touch). */
export function reverseBatch6Source(path, text) {
  const entry = BATCH6.files[path];
  if (!entry) return text;
  assert.equal(sha(text), entry.afterSHA256, `${path}: exactly the batch 6 source`);
  let value = text;
  for (const { before, after } of entry.replacements) {
    assert.equal(value.split(after).length - 1, 1, `${path}: batch 6 delta occurs once`);
    value = value.replace(after, before);
  }
  assert.equal(sha(value), entry.beforeSHA256, `${path}: prior bytes restored`);
  return value;
}

/** A JSON copy of a production config with the batch 6 village and films removed from the four listed D routes. */
export function reverseBatch6Config(slug, config) {
  if (!BATCH6.dSlugs.includes(slug)) return config;
  assert.ok(config.page?.place && config.page?.stories, `${slug}: batch 6 village and films present`);
  delete config.page.place;
  delete config.page.stories;
  return config;
}
