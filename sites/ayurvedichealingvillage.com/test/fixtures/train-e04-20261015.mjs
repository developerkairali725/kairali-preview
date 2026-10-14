// Train E04 (15 Oct 2026): AHV-WB.276.change (a price-free "At a glance" line in the /Kairali_Brand_and_Competition_Neo-
// original.html lead) and AHV-WB.360.benefit-copy (one fact-sourced benefit line in the /lp/kairali-brand/ lead), each one
// paragraph inserted after a recorded anchor. Built on cc1ddad6a, i.e. after the integrated Train A tree, so it is
// reversed FIRST: every Train A reversal and pin then runs unchanged on the exact bytes it pinned before. Each file must
// hash to the recorded after-bytes, lose exactly its one recorded line, and hash to the recorded before-bytes; each
// config must carry exactly that one paragraph, directly after its recorded anchor paragraph.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";

export const TRAIN_E04 = JSON.parse(fs.readFileSync(new URL("./train-e04-20261015.json", import.meta.url), "utf8"));
const sha = (s) => createHash("sha256").update(s).digest("hex");

/** `text` of `path` with the Train E04 delta removed (unchanged for a file E04 did not touch). */
export function reverseTrainE04Source(path, text) {
  const rec = TRAIN_E04.files[path];
  if (!rec) return text;
  assert.equal(sha(text), rec.afterSHA256, `${path}: exactly the Train E04 source`);
  let value = text;
  for (const { before, after } of rec.replacements) {
    assert.equal(value.split(after).length - 1, 1, `${path}: Train E04 delta occurs exactly once`);
    value = value.replace(after, before);
  }
  assert.equal(sha(value), rec.beforeSHA256, `${path}: Train E04 before-bytes restored`);
  return value;
}

/** A production config with the Train E04 lead paragraph removed (mutates and returns `config`). */
export function reverseTrainE04Config(slug, config) {
  const rec = TRAIN_E04.configChanges[slug];
  if (!rec) return config;
  let obj = config;
  for (const key of rec.path) obj = obj[key];
  assert.ok(Array.isArray(obj), `${slug}: ${rec.path.join(".")}`);
  assert.equal(obj.filter((p) => p === rec.text).length, 1, `${slug}: exactly one Train E04 line`);
  const i = obj.indexOf(rec.text);
  assert.equal(obj[i - 1], rec.insertedAfter, `${slug}: Train E04 line follows its recorded anchor`);
  obj.splice(i, 1);
  return config;
}
