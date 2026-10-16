// Train G (15 Oct 2026): the reviewer-accepted Train E source rows (E03 2b5a19d4c/99ac9c079/e4138ca59, E04 c311ebcb4,
// E02 b2eeb48fd accepted rows only), composed on the Train F head dae94e21c exactly as Train F composes on Train B
// (fixtures/train-f-20261015.mjs) and Train B on Train A (fixtures/train-b-20261015.mjs):
//   - reverseTrainGSource removes Train G's recorded source delta (train-g-20261015.json `files`, each edit occurring exactly
//     once) and must then hash to the Train F head bytes; the 17 AHV-N03.01 views reverse through reverseN03File and must
//     hash to their recorded Train F head bytes;
//   - reverseTrainGConfig restores every production-config field Train G changed (`configChanges`), asserting each field.
// The Train E candidates were built on cc1ddad6a (the integrated Train A tree), below Trains B and F, so their own
// after-bytes are checked in isolation on that base by train-g-integration-20261015.test.mjs.
//
// reverseTrainFSource / reverseTrainBSource and reverseTrainFConfig / reverseTrainBConfig call these first, so every older
// pin runs unchanged whichever layer a caller starts from. Each accepts exactly two states and fails on any other: the
// Train G bytes/fields (reversed, then the Train F head bytes/fields asserted) or the Train F head bytes/fields already
// (passed through unchanged, as after an earlier layer's call).
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { reverseN03File } from "./n03-sanskrit-subtitle-20261015.mjs";
// Train I (15 Oct 2026) composes on this head: its exact delta is removed first, so every pin below runs unchanged.
import { peelTrainISource, reverseTrainIConfig } from "./train-i-20261015.mjs";

export const TRAIN_G = JSON.parse(fs.readFileSync(new URL("./train-g-20261015.json", import.meta.url), "utf8"));
const sha = (s) => createHash("sha256").update(s).digest("hex");
const plain = (v) => JSON.parse(JSON.stringify(v));

/** The Train F head text of `path` (unchanged when Train G did not touch it, or when it is already the Train F head). */
export function reverseTrainGSource(path, rawText) {
  const text = peelTrainISource(path, rawText);
  const view = TRAIN_G.views[path];
  if (view) {
    if (sha(text) === view.beforeSHA256) return text;
    assert.equal(sha(text), view.afterSHA256, `${path}: exactly the Train G view`);
    const value = reverseN03File(path, text);
    assert.equal(sha(value), view.beforeSHA256, `${path}: exactly the Train F head view`);
    return value;
  }
  const e = TRAIN_G.files[path];
  if (!e) return text;
  if (sha(text) === e.beforeSHA256) return text;
  assert.equal(sha(text), e.afterSHA256, `${path}: exactly the Train G source`);
  let value = text;
  for (const { before, after } of [...e.replacements].reverse()) {
    assert.equal(value.split(after).length - 1, 1, `${path}: Train G delta occurs exactly once`);
    value = value.replace(after, () => before);
  }
  assert.equal(sha(value), e.beforeSHA256, `${path}: exactly the Train F head bytes`);
  return value;
}

const at = (c, path) => path.reduce((o, k) => (o == null ? undefined : o[k]), c);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** A production config (JSON copy) with Train G's field changes reversed exactly. Mutates and returns `c`. */
export function reverseTrainGConfig(slug, rawConfig) {
  const c = reverseTrainIConfig(slug, rawConfig);
  const changes = TRAIN_G.configChanges[slug];
  if (!changes) return c;
  if (changes.every(({ path, before }) => same(at(c, path), before))) return c;
  for (const { path, before, after } of [...changes].reverse()) {
    const parent = at(c, path.slice(0, -1));
    const k = path.at(-1);
    assert.deepEqual(parent[k], after, `${slug}: exact Train G field ${path.join(".")}`);
    parent[k] = plain(before);
  }
  return c;
}

/** Lead paragraphs with the recorded Train G join undone (anchor and line asserted exactly), for the E03 line check. */
export function splitTrainGLeadJoin(slug, paragraphs) {
  const j = TRAIN_G.leadJoins[slug];
  if (!j) return paragraphs;
  const joined = `${j.anchor} ${j.text}`;
  assert.equal(paragraphs.filter((p) => p === joined).length, 1, `${slug}: the ${j.row} line joined to its anchor once`);
  return paragraphs.flatMap((p) => (p === joined ? [j.anchor, j.text] : [p]));
}
