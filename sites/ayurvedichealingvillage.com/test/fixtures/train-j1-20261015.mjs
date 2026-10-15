// Train J batch 1 (15 Oct 2026): rows AHV-I04.M054/M056/M059/M065.links, AHV-LATER-021.01/041.01/053.01, AHV-M004.01/.03,
// AHV-M005.02, AHV-M016.01/.02, AHV-M021.02 (duration part), AHV-M077.01 on the Train I head 00e944e44
// (fixtures/train-j1-20261015.json). Composed exactly as Train I composes on Train G (fixtures/train-i-20261015.mjs):
// callers reverse Train J1 FIRST, then hand the result to the older reversals, so every older pin runs unchanged.
//   - reverseTrainJ1Source removes Train J1's recorded source delta. Two states are accepted per file, both by full
//     SHA-256: the Train J1 bytes (reversed, then the Train I head bytes asserted) and the Train I head bytes (passed
//     through). Any other state fails.
//   - peelTrainJ1Source is the hook older chains call first: it reverses exactly the Train J1 bytes and passes any other
//     text through, so each older layer still asserts its own two states.
//   - peelTrainJ1Generated does the same for the git-ignored locale review chrome the l10n build regenerates (its route
//     map no longer names the retired /the-baoli-special-deal/, AHV-M016.02); base = the Train I build's bytes.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";

export const TRAIN_J1 = JSON.parse(fs.readFileSync(new URL("./train-j1-20261015.json", import.meta.url), "utf8"));
const sha = (s) => createHash("sha256").update(s).digest("hex");

function reverseWith(table, path, text) {
  const e = table[path];
  if (!e || typeof text !== "string") return text;
  if (sha(text) === e.beforeSHA256) return text;
  assert.equal(sha(text), e.afterSHA256, `${path}: exactly the Train J1 source`);
  let value = text;
  for (const { row, before, after } of [...e.replacements].reverse()) {
    assert.equal(value.split(after).length - 1, 1, `${path}: Train J1 delta (${row}) occurs exactly once`);
    value = value.replace(after, () => before);
  }
  assert.equal(sha(value), e.beforeSHA256, `${path}: exactly the Train I head bytes`);
  return value;
}

/** The Train I head text of `path` (unchanged when Train J1 did not touch it, or when it is already the head text). */
export function reverseTrainJ1Source(path, text) { return reverseWith(TRAIN_J1.files, path, text); }

/** For older layers' chains: the Train J1 bytes of a Train J1 file are reversed exactly; any other text passes through. */
export function peelTrainJ1Source(path, text) {
  const e = TRAIN_J1.files[path];
  return e && typeof text === "string" && sha(text) === e.afterSHA256 ? reverseTrainJ1Source(path, text) : text;
}

/** The Train I build's bytes of a regenerated, git-ignored locale file; any other text passes through. */
export function peelTrainJ1Generated(path, text) {
  const e = TRAIN_J1.generated[path];
  return e && typeof text === "string" && sha(text) === e.afterSHA256 ? reverseWith(TRAIN_J1.generated, path, text) : text;
}
