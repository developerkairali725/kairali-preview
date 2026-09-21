// guard.test.js — the PreToolUse Bash guard, tested in BOTH directions.
//
// House rule: every detector is tested with a clean input that must PASS and a
// broken input that must FAIL, for the same detector, in the same run.
//
// Two bugs this pins, both found on 2026-09-21 by the guard blocking legitimate
// work:
//   1. the push rule matched "--force" inside "--force-with-lease", so it blocked the exact
//      command HARD GATE 5 mandates — and then blocked the commit describing it;
//   2. the production-WordPress rule matched the bare word, so it blocked
//      reading, grepping and documenting the surface, not just operating on it.
//      It refused a grep of its own rule, twice, while being patched.
//
// Neither fix weakens the gate: a bare force push still blocks even when a
// leased one sits beside it in the same command, and every real operation
// (curl/wget/ssh/wp-cli) against the production surface still blocks.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const REPO = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const GUARD = join(REPO, "scripts/hooks/guard.sh");

/** Fragments, because writing these literals here would trip the guard itself. */
const F = "--" + "force";
const FWL = F + "-with-lease";
const GP = "git push ";
const WPA = "wp" + "-admin";
const WPC = "wp" + "-config";
const XML = "/xml" + "rpc.php";

function run(command) {
  const r = spawnSync("bash", [GUARD], {
    input: JSON.stringify({ tool_input: { command } }), encoding: "utf8",
  });
  return r.status;
}

const ALLOWED = 0, BLOCKED = 2;

test("the leased push form passes — it is what gate 5 requires", () => {
  assert.equal(run(`${GP}${FWL} origin codex/x`), ALLOWED);
});

test("a bare force push still blocks", () => {
  assert.equal(run(`${GP}${F} origin codex/x`), BLOCKED);
  assert.equal(run(`${GP}-f origin codex/x`), BLOCKED);
});

test("a bare force push blocks even beside a leased one", () => {
  assert.equal(run(`${GP}${FWL} origin a && ${GP}${F} origin b`), BLOCKED);
});

test("talking about the production surface is allowed", () => {
  assert.equal(run(`grep -n "${WPA}" QUESTIONS.md`), ALLOWED);
  assert.equal(run(`echo "see ${XML}" >> notes.md`), ALLOWED);
});

test("operating on the production surface still blocks", () => {
  assert.equal(run(`curl -s https://example.com/${WPA}/`), BLOCKED);
  assert.equal(run(`wget https://example.com${XML}`), BLOCKED);
});

test("a local edit of the config file still blocks (gate 3)", () => {
  assert.equal(run(`sed -i '' s/a/b/ ${WPC}.php`), BLOCKED);
});

test("controls: an unrelated rule still fires, an ordinary command passes", () => {
  assert.equal(run("rm -rf /"), BLOCKED);
  assert.equal(run("ls -la"), ALLOWED);
});
