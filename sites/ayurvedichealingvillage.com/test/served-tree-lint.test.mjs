// SEO-D22 / D-22 (29 Sep 2026): the banned-string lint must also reach the git-ignored trees a CLI deploy serves.
// These tests pin COVERAGE only — they never assert the real served trees are clean (that verdict is the lint's, and
// the open classes are an owner ruling, QUESTIONS.md Q-AHV-L10N-LINT-SCOPE), so no gate semantics change here.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { SERVED_UNTRACKED_ROOTS, NOT_SERVED, SITE, run } from "../tools/lint-served-tree.mjs";

function quiet(fn) {
  const log = console.log, err = console.error;
  console.log = () => {}; console.error = () => {};
  try { return fn(); } finally { console.log = log; console.error = err; }
}
function fixture(files) {
  const site = fs.mkdtempSync(path.join(os.tmpdir(), "served-lint-"));
  for (const [rel, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(site, rel)), { recursive: true });
    fs.writeFileSync(path.join(site, rel), text);
  }
  return site;
}

test("every git-ignored directory of the site is either linted as a served tree or named as not served", () => {
  const dirs = fs.readFileSync(path.join(SITE, ".gitignore"), "utf8").split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && !l.startsWith("!") && l.endsWith("/") && !/[*?[]/.test(l))
    .map((l) => l.replace(/^\/|\/$/g, ""));
  assert.ok(dirs.length >= 3, `expected the locale build's ignored trees, found ${dirs.join(", ")}`);
  const unaccounted = dirs.filter((d) => !SERVED_UNTRACKED_ROOTS.includes(d) && !(d in NOT_SERVED));
  assert.deepEqual(unaccounted, [], "a new ignored tree must be added to SERVED_UNTRACKED_ROOTS (or NOT_SERVED with a reason)");
  for (const r of SERVED_UNTRACKED_ROOTS) assert.ok(!(r in NOT_SERVED), `${r} cannot be both served and not served`);
});

test("the served-tree lint scans every served tree with the unchanged lint and fails on a known-bad served string", () => {
  const site = fixture({
    "public/ahv/l10n/de/assets/probe-data.js": 'window.X = {"contact":"reservations@kairali.com"};\n',
    "l10n/generated/de.catalog.json": '{"t_1":"info@kairali.com"}\n',
    "l10n/prerender/de/probe.html": "<main><p>info@kairali.com</p></main>\n",
  });
  const out = path.join(site, "report.json");
  const code = quiet(() => run(["--out", out], { site }));
  assert.equal(code, 2, "a banned string in a served tree must fail exactly as the lint would");
  const report = JSON.parse(fs.readFileSync(out, "utf8"));
  assert.deepEqual(report.roots, SERVED_UNTRACKED_ROOTS);
  assert.equal(report.filesScanned, 3);
  assert.equal(report.controlProbe.ok, true);
  assert.deepEqual(report.byRule, { "wrong-contact-email": 1 });
  assert.deepEqual(report.byRoot, { "public/ahv/l10n": 1 });
});

test("a missing served tree is never a pass: exit 1 unless --allow-missing, and no tree at all is a vacuous run", () => {
  const site = fixture({ "l10n/generated/de.catalog.json": '{"t_1":"info@kairali.com"}\n' });
  assert.equal(quiet(() => run([], { site })), 1);
  assert.equal(quiet(() => run(["--allow-missing"], { site })), 0);
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), "served-lint-empty-"));
  assert.equal(quiet(() => run(["--allow-missing"], { site: empty })), 2);
});
