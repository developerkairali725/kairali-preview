// Train N performance fix (16 Oct 2026) on the Train N head 6f72f2e71: the release gate's package-page CLS repair
// edits app/(english)/_families/boot.ts, which the Train J2 and J-integration tests pin by SHA-256.
// peelTrainNPerfFix removes exactly that recorded edit from the current bytes (full SHA-256 match, the edit exactly
// once) and asserts the Train N head bytes, so every older layer keeps asserting its own states unchanged. Any other
// text passes through. No pin is re-hashed.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";

export const TRAIN_N_PERF_FIX = JSON.parse(fs.readFileSync(new URL("./train-n-perf-fix-20261016.json", import.meta.url), "utf8"));
const sha = (s) => createHash("sha256").update(s).digest("hex");

/** Current bytes -> exactly the Train N head bytes (perf fix removed); any other text passes through. */
export function peelTrainNPerfFix(path, text) {
  const e = TRAIN_N_PERF_FIX.files[path];
  if (!e || typeof text !== "string" || sha(text) !== e.afterSHA256) return text;
  let value = text;
  for (const { before, after } of [...e.replacements].reverse()) {
    assert.equal(value.split(after).length - 1, 1, `${path}: Train N perf fix occurs exactly once`);
    value = value.replace(after, () => before);
  }
  assert.equal(sha(value), e.beforeSHA256, `${path}: exactly the Train N head bytes`);
  return value;
}
