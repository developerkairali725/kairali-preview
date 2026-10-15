// Train I (15 Oct 2026): owner decisions 28-30, 32 and 33 on the Train G head 441c3aa5c (fixtures/train-i-20261015.json).
// Composed exactly as the Train G rework composes on Train G (fixtures/train-g-rework-20261015.mjs): callers reverse Train I
// FIRST, then hand the result to the older reversals, and every older pin runs unchanged.
//   - reverseTrainISource removes Train I's recorded source delta. Two states are accepted per file, both by full SHA-256:
//     the Train I bytes (reversed, then the head bytes asserted) and the head bytes (passed through). Any other state fails.
//   - reverseTrainIConfig restores every production-config field Train I changed (configChanges), asserting each field's
//     exact Train I value first; a config already at the head values passes through.
//   - peelTrainISource is the hook older chains call first: it reverses exactly the Train I bytes and passes any other
//     text through, so each older layer still asserts its own two states.
//   - reverseTrainIRatings restores the Tripadvisor registry's asOf (AHV-LATER-038.01) for the older registry pins.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
// Train J (batches J1, J2 and later J3) composes on Train I the same way: its whole delta is peeled first, so the
// Train J bytes reach every Train I consumer (and through peelTrainISource every older chain) as the Train I bytes
// (fixtures/train-j-integration-20261015.mjs composes the batch fixtures train-j1/j2/j3-20261015.mjs).
import { peelTrainJSource } from "./train-j-integration-20261015.mjs";

export const TRAIN_I = JSON.parse(fs.readFileSync(new URL("./train-i-20261015.json", import.meta.url), "utf8"));
const sha = (s) => createHash("sha256").update(s).digest("hex");
const plain = (v) => JSON.parse(JSON.stringify(v));

/** The Train G head text of `path` (unchanged when Train I did not touch it, or when it is already the head text). */
export function reverseTrainISource(path, rawText) {
  const text = peelTrainJSource(path, rawText);
  const e = TRAIN_I.files[path];
  if (!e || typeof text !== "string") return text;
  if (sha(text) === e.beforeSHA256) return text;
  assert.equal(sha(text), e.afterSHA256, `${path}: exactly the Train I source`);
  let value = text;
  for (const { row, before, after } of [...e.replacements].reverse()) {
    assert.equal(value.split(after).length - 1, 1, `${path}: Train I delta (${row}) occurs exactly once`);
    value = value.replace(after, () => before);
  }
  assert.equal(sha(value), e.beforeSHA256, `${path}: exactly the Train G head bytes`);
  return value;
}

/** For older layers' chains: the Train I bytes of a Train I file are reversed exactly; any other text passes through
 *  untouched (an older layer's own bytes, which that layer then checks against its own pins). */
export function peelTrainISource(path, rawText) {
  const text = peelTrainJSource(path, rawText);
  const e = TRAIN_I.files[path];
  return e && typeof text === "string" && sha(text) === e.afterSHA256 ? reverseTrainISource(path, text) : text;
}

const at = (c, path) => path.reduce((o, k) => (o == null ? undefined : o[k]), c);

/** A production config (JSON copy) with Train I's field changes reversed exactly. Mutates and returns `c`. */
export function reverseTrainIConfig(slug, c) {
  const changes = TRAIN_I.configChanges[slug];
  if (!changes || !c) return c;
  const present = changes.filter(({ path }) => at(c, path.slice(0, -1)) != null);
  if (present.every(({ path, before }) => at(c, path) === before)) return c;
  for (const { path, before, after } of [...present].reverse()) {
    const parent = at(c, path.slice(0, -1));
    assert.equal(parent[path.at(-1)], after, `${slug}: exact Train I field ${path.join(".")}`);
    parent[path.at(-1)] = plain(before);
  }
  return c;
}

export const TRAIN_I_RATINGS = Object.freeze({ row: "AHV-LATER-038.01", asOf: Object.freeze({ before: "2026-08", after: "2026-08-29" }) });

/** The Tripadvisor registry (a copy) as before Train I: asOf back to the month-only value. */
export function reverseTrainIRatings(ratings) {
  const r = { ...ratings };
  if (r.asOf === TRAIN_I_RATINGS.asOf.before) return r;
  assert.equal(r.asOf, TRAIN_I_RATINGS.asOf.after, "TRIPADVISOR.asOf: exactly the Train I capture date");
  r.asOf = TRAIN_I_RATINGS.asOf.before;
  return r;
}
