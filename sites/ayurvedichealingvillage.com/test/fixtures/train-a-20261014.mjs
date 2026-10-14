// Train A integration (14 Oct 2026): every accepted candidate was built on the same base (c54e2795e) and recorded its
// own exact source delta (before/after text replacements plus before/after SHA-256) and, where it changed campaign
// configs, its own exact config reversal. In the integrated tree several candidates edit the same file, so no single
// candidate's after-hash can hold on its own. This module composes them without loosening any pin:
//   - for every candidate that touched a file, the integrated text minus every OTHER candidate's delta must hash to
//     that candidate's recorded after-SHA-256 (so each candidate's exact bytes are still checked);
//   - removing all their deltas (newest merge first, each edit occurring exactly once) must hash to every
//     candidate's recorded before-SHA-256, i.e. the base bytes, before the older pins run unchanged;
//   - where two candidates edited the same lines (train-a-20261014.json `overlaps`), the integrated bytes are pinned
//     and the exact merged form of the newer delta is removed first; the result must be the older candidate's
//     recorded after-bytes, and that candidate is then checked as above.
// Merge order: batch 6, batch 8 (rejected AHV-WB.015/039/253 excluded), owner decisions, owner decisions B.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { BATCH6, reverseBatch6Config } from "./train-a-batch6-20261014.mjs";
import { reverseBatch8Config } from "./train-a-batch8-reverse.mjs";

const json = (name) => JSON.parse(fs.readFileSync(new URL(`./${name}`, import.meta.url), "utf8"));
const sha = (s) => createHash("sha256").update(s).digest("hex");

export const TRAIN_A = json("train-a-20261014.json");

/** Candidates in merge order: name, per-file entries and the key that holds their {before, after} list. */
export const TRAIN_A_CANDIDATES = Object.freeze([
  { name: "train-a batch 6", files: BATCH6.files, list: "replacements" },
  { name: "train-a batch 8", files: json("train-a-batch8-20261014.json").files, list: "replacements" },
  { name: "owner decisions", files: json("owner-decisions-20261014-approved-delta.json").files, list: "edits" },
]);

function strip(path, text, replacements, name) {
  let value = text;
  for (const { before, after } of replacements) {
    assert.equal(value.split(after).length - 1, 1, `${path}: ${name} delta occurs exactly once`);
    value = value.replace(after, before);
  }
  return value;
}

/** The base text of `path` with every Train A candidate delta removed (unchanged for a file no candidate touched). */
export function reverseTrainASource(path, text) {
  let value = text;
  let touching = TRAIN_A_CANDIDATES.filter((c) => c.files[path]);
  const overlap = TRAIN_A.overlaps[path];
  if (overlap) {
    assert.equal(sha(value), overlap.integratedSHA256, `${path}: exactly the integrated Train A source`);
    value = strip(path, value, overlap.replacements, `merged ${overlap.candidate}`);
    assert.equal(sha(value), overlap.resultSHA256, `${path}: merged ${overlap.candidate} delta removed exactly`);
    assert.ok(touching.some((c) => c.name === overlap.candidate), `${path}: ${overlap.candidate} recorded`);
    touching = touching.filter((c) => c.name !== overlap.candidate);
  }
  if (!touching.length) return value;
  const newestFirst = [...touching].reverse();
  for (const own of touching) {
    const ownText = newestFirst.filter((c) => c !== own).reduce((t, c) => strip(path, t, c.files[path][c.list], c.name), value);
    assert.equal(sha(ownText), own.files[path].afterSHA256, `${path}: exactly the ${own.name} source`);
  }
  value = newestFirst.reduce((t, c) => strip(path, t, c.files[path][c.list], c.name), value);
  for (const c of touching) assert.equal(sha(value), c.files[path].beforeSHA256, `${path}: base bytes restored (${c.name})`);
  return value;
}

// Owner decisions, 14 Oct 2026 (AHV-WB.042.change, AHV-WB.299.change), reversed exactly before the original config pins:
// the weight routes' one-card Rupak Mann Stories band and the Panchakarma 14–28 night range. (Moved verbatim from the
// owner-decision candidate's lp-v2-locale-physicians / lp-v2-third-guest-videos tests, which defined it twice.)
const WEIGHT_STORY={heading:'Hear from people who have stayed at Kairali',body:'Watch a patient describe their stay in their own words. Individual experiences vary.',films:[{title:'Watch Rupak Mann’s experience',href:'https://www.youtube.com/watch?v=D3QLxKpwtJs',thumb:{src:'/ahv/assets/img/video-thumb-D3QLxKpwtJs.webp',width:480,height:360}}]};
const PANCHAKARMA_RANGE={'panchakarma':3,'lp-panchakarma':2};
export const reverseOwnerDecisionsConfig=(slug,c)=>{
 if(slug==='weight-management'||slug==='lp-weight-management'){assert.deepEqual(c.page.stories,WEIGHT_STORY,slug);delete c.page.stories;}
 if(PANCHAKARMA_RANGE[slug]){let j=JSON.stringify(c);assert.equal(j.split('14–28 night').length-1,PANCHAKARMA_RANGE[slug],slug);assert.equal(j.split('14–21 night').length-1,0,slug);c=JSON.parse(j.replaceAll('14–28 night','14–21 night'));}
 return c;
};

/**
 * A JSON copy of a production config with every Train A candidate's exact config change reversed, newest first.
 * Use the returned value: a reversal may return a new object.
 */
export function reverseTrainAConfig(slug, config) {
  return reverseBatch6Config(slug, reverseBatch8Config(slug, reverseOwnerDecisionsConfig(slug, config)));
}
