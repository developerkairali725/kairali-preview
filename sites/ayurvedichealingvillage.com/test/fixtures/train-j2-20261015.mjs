// Train J batch 2 (15 Oct 2026) on the Train I head 00e944e44 (fixtures/train-j2-20261015.json). Composed exactly as
// Train I composes on Train G (fixtures/train-i-20261015.mjs): callers reverse Train J2 FIRST, then hand the result to
// the older reversals, and every older pin runs unchanged.
//   - reverseTrainJ2Source removes Train J2's recorded source delta. Two states are accepted per file, both by full
//     SHA-256: the Train J2 bytes (reversed, then the Train I head bytes asserted) and the head bytes (passed through).
//     Any other state fails.
//   - peelTrainJ2Source is the hook older chains call first: it reverses exactly the Train J2 bytes and passes any other
//     text through, so each older layer still asserts its own two states.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";

export const TRAIN_J2 = JSON.parse(fs.readFileSync(new URL("./train-j2-20261015.json", import.meta.url), "utf8"));
const sha = (s) => createHash("sha256").update(s).digest("hex");

/** The Train I head text of `path` (unchanged when Train J2 did not touch it, or when it is already the head text). */
export function reverseTrainJ2Source(path, text) {
  const e = TRAIN_J2.files[path];
  if (!e || typeof text !== "string") return text;
  if (sha(text) === e.beforeSHA256) return text;
  assert.equal(sha(text), e.afterSHA256, `${path}: exactly the Train J2 source`);
  let value = text;
  for (const { row, before, after } of [...e.replacements].reverse()) {
    assert.equal(value.split(after).length - 1, 1, `${path}: Train J2 delta (${row}) occurs exactly once`);
    value = value.replace(after, () => before);
  }
  assert.equal(sha(value), e.beforeSHA256, `${path}: exactly the Train I head bytes`);
  return value;
}

/** For older layers' chains: the Train J2 bytes of a Train J2 file are reversed exactly; any other text passes through
 *  untouched (an older layer's own bytes, which that layer then checks against its own pins). */
export function peelTrainJ2Source(path, text) {
  const e = TRAIN_J2.files[path];
  return e && typeof text === "string" && sha(text) === e.afterSHA256 ? reverseTrainJ2Source(path, text) : text;
}
