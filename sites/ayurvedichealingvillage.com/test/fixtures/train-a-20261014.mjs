// Train A integration (14 Oct 2026): every accepted candidate was built on the same base (c54e2795e) and recorded its
// own exact source delta (before/after text replacements plus before/after SHA-256) and, where it changed campaign
// configs, its own exact config reversal. In the integrated tree several candidates edit the same file, so no single
// candidate's after-hash can hold on its own. This module composes them without loosening any pin:
//   - for every candidate that touched a file, the integrated text minus every OTHER candidate's delta must hash to
//     that candidate's recorded after-SHA-256 (so each candidate's exact bytes are still checked);
//   - removing all their deltas (newest merge first, each edit occurring exactly once) must hash to every
//     candidate's recorded before-SHA-256, i.e. the base bytes, before the older pins run unchanged.
// Merge order: batch 6, batch 8 (rejected AHV-WB.015/039/253 excluded), owner decisions, owner decisions B.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { BATCH6, reverseBatch6Config } from "./train-a-batch6-20261014.mjs";
import { reverseBatch8Config } from "./train-a-batch8-reverse.mjs";

const json = (name) => JSON.parse(fs.readFileSync(new URL(`./${name}`, import.meta.url), "utf8"));
const sha = (s) => createHash("sha256").update(s).digest("hex");

/** Candidates in merge order: name, per-file entries and the key that holds their {before, after} list. */
export const TRAIN_A_CANDIDATES = Object.freeze([
  { name: "train-a batch 6", files: BATCH6.files, list: "replacements" },
  { name: "train-a batch 8", files: json("train-a-batch8-20261014.json").files, list: "replacements" },
]);

function strip(path, text, candidate) {
  let value = text;
  for (const { before, after } of candidate.files[path][candidate.list]) {
    assert.equal(value.split(after).length - 1, 1, `${path}: ${candidate.name} delta occurs exactly once`);
    value = value.replace(after, before);
  }
  return value;
}

/** The base text of `path` with every Train A candidate delta removed (unchanged for a file no candidate touched). */
export function reverseTrainASource(path, text) {
  const touching = TRAIN_A_CANDIDATES.filter((c) => c.files[path]);
  if (!touching.length) return text;
  const newestFirst = [...touching].reverse();
  for (const own of touching) {
    const ownText = newestFirst.filter((c) => c !== own).reduce((t, c) => strip(path, t, c), text);
    assert.equal(sha(ownText), own.files[path].afterSHA256, `${path}: exactly the ${own.name} source`);
  }
  const value = newestFirst.reduce((t, c) => strip(path, t, c), text);
  for (const c of touching) assert.equal(sha(value), c.files[path].beforeSHA256, `${path}: base bytes restored (${c.name})`);
  return value;
}

/** A JSON copy of a production config with every Train A candidate's exact config change reversed, newest first. */
export function reverseTrainAConfig(slug, config) {
  return reverseBatch6Config(slug, reverseBatch8Config(slug, config));
}
