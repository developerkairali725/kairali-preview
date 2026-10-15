// Train J integration (15 Oct 2026): batches J1, J2 and J3 each recorded their delta against the Train I head 00e944e44
// (fixtures/train-j1-, train-j2-, train-j3-20261015.*). Where two batches edited the same file, the integrated bytes are
// neither batch's after-bytes; this layer records those files (fixtures/train-j-integration-20261015.json) and peels
// them exactly, so no batch pin is re-hashed:
//   - peelTrainJ2OverJ1 removes the Train J2 delta from the integrated bytes and asserts the Train J1 after-bytes;
//   - peelTrainJ1UnderJ2 removes the Train J1 delta from the integrated bytes and asserts the Train J2 after-bytes.
//   Both accept exactly the integrated bytes (full SHA-256) and pass any other text through.
//   - peelTrainJSource is the hook for every older chain: it peels the whole of Train J (integration, then J2, J1),
//     returning the Train I head bytes for a Train J file and passing any other text through, so each older layer still
//     asserts its own states.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { peelTrainJ1Source } from "./train-j1-20261015.mjs";
import { peelTrainJ2Source } from "./train-j2-20261015.mjs";

export const TRAIN_J_INTEGRATION = JSON.parse(fs.readFileSync(new URL("./train-j-integration-20261015.json", import.meta.url), "utf8"));
const sha = (s) => createHash("sha256").update(s).digest("hex");

function peel(path, text, key, wantKey, label) {
  const e = TRAIN_J_INTEGRATION.files[path];
  if (!e || typeof text !== "string" || sha(text) !== e.integratedSHA256) return text;
  let value = text;
  for (const { row, before, after } of [...e[key]].reverse()) {
    assert.equal(value.split(after).length - 1, 1, `${path}: ${label} delta (${row}) occurs exactly once`);
    value = value.replace(after, () => before);
  }
  assert.equal(sha(value), e[wantKey], `${path}: exactly the ${label === "Train J2" ? "Train J1" : "Train J2"} after-bytes`);
  return value;
}

/** Integrated bytes -> exactly the Train J1 after-bytes (Train J2's delta removed); any other text passes through. */
export function peelTrainJ2OverJ1(path, text) { return peel(path, text, "j2OverJ1", "j1AfterSHA256", "Train J2"); }

/** Integrated bytes -> exactly the Train J2 after-bytes (Train J1's delta removed); any other text passes through. */
export function peelTrainJ1UnderJ2(path, text) { return peel(path, text, "j1UnderJ2", "j2AfterSHA256", "Train J1"); }

/** The whole of Train J peeled: a Train J file's integrated bytes become the Train I head bytes; other text passes through. */
export function peelTrainJSource(path, text) {
  return peelTrainJ1Source(path, peelTrainJ2Source(path, peelTrainJ2OverJ1(path, text)));
}
