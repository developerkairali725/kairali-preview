// Train N integration (15 Oct 2026): Train N merges the Train J branch (a6da1070c) onto the Train B production merge
// cc7c12573. Train J descends from the lead hotfix 0b1832c76, so Train B's last production commits are not in it; two
// of them edit files that Train G/H/J tests pin by SHA-256:
//   - 285074497 app/(english)/_families/design-view.tsx (past retreat records share the runtime font stylesheet);
//   - c33db4e6b public/design/consistency.css (past retreat record WCAG AA rules, appended).
// peelTrainNTail removes exactly that recorded tail from the Train N bytes (full SHA-256 match, each edit exactly once)
// and asserts the Train J head bytes, so every older layer keeps asserting its own states unchanged. Any other text
// passes through. No pin is re-hashed.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";

export const TRAIN_N_INTEGRATION = JSON.parse(fs.readFileSync(new URL("./train-n-integration-20261015.json", import.meta.url), "utf8"));
const sha = (s) => createHash("sha256").update(s).digest("hex");

/** Train N bytes -> exactly the Train J head bytes (Train B production tail removed); any other text passes through. */
export function peelTrainNTail(path, text) {
  const e = TRAIN_N_INTEGRATION.files[path];
  if (!e || typeof text !== "string" || sha(text) !== e.afterSHA256) return text;
  let value = text;
  for (const { before, after } of [...e.replacements].reverse()) {
    assert.equal(value.split(after).length - 1, 1, `${path}: Train B tail (${e.commit}) occurs exactly once`);
    value = value.replace(after, () => before);
  }
  assert.equal(sha(value), e.beforeSHA256, `${path}: exactly the Train J head bytes`);
  return value;
}
