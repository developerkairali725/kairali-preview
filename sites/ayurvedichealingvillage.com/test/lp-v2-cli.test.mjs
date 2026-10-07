import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("lp:check on the blank template fails with pending/length errors", () => {
  const r = spawnSync(process.execPath, ["tools/lp-check.mjs", "_template", "--production"], { encoding: "utf8" });
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.stdout, /pending\.production/);
});

test("lp:check with an unknown slug exits 2", () => {
  const r = spawnSync(process.execPath, ["tools/lp-check.mjs", "does-not-exist"], { encoding: "utf8" });
  assert.equal(r.status, 2);
});
