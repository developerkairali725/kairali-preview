// neutralize-workflows.test.js — tests for the PKG-043 rule-9 neutralization
// generator/checker (plan §9 + §3.6; D-20260719-03).
//
// House rule: every detector tested in BOTH directions.
// house style: plain ESM + node --test.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import {
  ADOPTED_ROOT, DATE_RE, ORIGINAL_RULE9_SENTENCE, PACKAGE_WORKFLOWS,
  REPLACEMENT_RULE9, buildAdopted, buildReadme, check, generate, istTimestamp,
  neutralize,
} from "../neutralize-workflows.mjs";

const RULE9_LINE = `9. ${ORIGINAL_RULE9_SENTENCE}`;
const DATE = "2026-07-19 15:00:00 IST";

const workflowText = (title) => [
  `# ${title}`,
  "",
  "## AI-agent execution rules",
  "",
  "1. Select the correct workflow before taking action.",
  "8. Stop at phase gates requiring accountable approval; do not silently bypass them.",
  RULE9_LINE,
  "",
  "## Tail section",
  "",
  "Unrelated body bytes that must survive untouched.",
  "",
].join("\n");

/** Tmp fixture repo with 2 package workflows. */
function fixtureRepo() {
  const repoRoot = mkdtempSync(join(tmpdir(), "neutralize-"));
  const files = {
    [`${PACKAGE_WORKFLOWS}/01_B2C/01_NEW_WEBSITE.md`]: workflowText("B2C New Website"),
    [`${PACKAGE_WORKFLOWS}/02_B2B/02_EXISTING.md`]: workflowText("B2B Existing"),
  };
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(join(repoRoot, dirname(rel)), { recursive: true });
    writeFileSync(join(repoRoot, rel), text);
  }
  return { repoRoot, sources: Object.keys(files).sort() };
}

const adoptedPath = (repoRoot, subtree) => join(repoRoot, ADOPTED_ROOT, subtree);

test("generate: replaces rule 9, preserves every other byte, records source hash", (t) => {
  const { repoRoot } = fixtureRepo();
  t.after(() => rmSync(repoRoot, { recursive: true, force: true }));
  const { written, banner } = generate({ repoRoot, date: DATE, expectedCount: 2 });
  assert.equal(written.length, 3); // 2 copies + README
  assert.match(banner, /2\/2 adopted copies written/);

  const source = readFileSync(join(repoRoot, PACKAGE_WORKFLOWS, "01_B2C/01_NEW_WEBSITE.md"), "utf8");
  const adopted = readFileSync(adoptedPath(repoRoot, "01_B2C/01_NEW_WEBSITE.md"), "utf8");
  // Neutralized: replacement present, original sentence absent.
  assert.ok(adopted.includes(REPLACEMENT_RULE9));
  assert.ok(!adopted.includes(ORIGINAL_RULE9_SENTENCE));
  // Byte-preserving: adopted = header + source with ONLY the rule-9 line swapped.
  assert.ok(adopted.endsWith(source.replace(RULE9_LINE, REPLACEMENT_RULE9)));
  // Header carries source path + sha256 + generated date.
  assert.ok(adopted.includes(`${PACKAGE_WORKFLOWS}/01_B2C/01_NEW_WEBSITE.md`));
  assert.match(adopted, /Source sha256:\*\* `sha256:[0-9a-f]{64}`/);
  assert.ok(adopted.includes(`> **Generated:** ${DATE}`));
  // README exists and never quotes the original sentence.
  const readme = readFileSync(adoptedPath(repoRoot, "README.md"), "utf8");
  assert.ok(!readme.includes(ORIGINAL_RULE9_SENTENCE));
  assert.ok(readme.includes(REPLACEMENT_RULE9));
  assert.equal(readme, buildReadme());
});

test("check: passes on a freshly generated tree", (t) => {
  const { repoRoot } = fixtureRepo();
  t.after(() => rmSync(repoRoot, { recursive: true, force: true }));
  generate({ repoRoot, date: DATE, expectedCount: 2 });
  const res = check({ repoRoot, expectedCount: 2 });
  assert.equal(res.ok, true, res.banner);
  assert.match(res.banner, /PASS: 2\/2 adopted copies byte-faithful/);
});

test("check: catches drift in an adopted copy", (t) => {
  const { repoRoot } = fixtureRepo();
  t.after(() => rmSync(repoRoot, { recursive: true, force: true }));
  generate({ repoRoot, date: DATE, expectedCount: 2 });
  const p = adoptedPath(repoRoot, "01_B2C/01_NEW_WEBSITE.md");
  writeFileSync(p, readFileSync(p, "utf8") + "sneaky edit\n");
  const res = check({ repoRoot, expectedCount: 2 });
  assert.equal(res.ok, false);
  assert.ok(res.problems.some((x) => x.startsWith("DRIFT:") && x.includes("01_NEW_WEBSITE.md")));
});

test("check: catches a reintroduced original rule-9 sentence", (t) => {
  const { repoRoot } = fixtureRepo();
  t.after(() => rmSync(repoRoot, { recursive: true, force: true }));
  generate({ repoRoot, date: DATE, expectedCount: 2 });
  const p = adoptedPath(repoRoot, "02_B2B/02_EXISTING.md");
  writeFileSync(p, readFileSync(p, "utf8").replace(REPLACEMENT_RULE9, RULE9_LINE));
  const res = check({ repoRoot, expectedCount: 2 });
  assert.equal(res.ok, false);
  assert.ok(res.problems.some((x) => x.startsWith("RULE-9 REINTRODUCED:")));
});

test("check: catches a missing adopted copy and a missing README", (t) => {
  const { repoRoot } = fixtureRepo();
  t.after(() => rmSync(repoRoot, { recursive: true, force: true }));
  generate({ repoRoot, date: DATE, expectedCount: 2 });
  unlinkSync(adoptedPath(repoRoot, "01_B2C/01_NEW_WEBSITE.md"));
  unlinkSync(adoptedPath(repoRoot, "README.md"));
  const res = check({ repoRoot, expectedCount: 2 });
  assert.equal(res.ok, false);
  assert.ok(res.problems.some((x) => x === `MISSING: ${ADOPTED_ROOT}/01_B2C/01_NEW_WEBSITE.md`));
  assert.ok(res.problems.some((x) => x === `MISSING: ${ADOPTED_ROOT}/README.md`));
});

test("check: catches a touched package source (original sentence gone) and README drift", (t) => {
  const { repoRoot } = fixtureRepo();
  t.after(() => rmSync(repoRoot, { recursive: true, force: true }));
  generate({ repoRoot, date: DATE, expectedCount: 2 });
  const src = join(repoRoot, PACKAGE_WORKFLOWS, "01_B2C/01_NEW_WEBSITE.md");
  writeFileSync(src, readFileSync(src, "utf8").replace(RULE9_LINE + "\n", ""));
  const readme = adoptedPath(repoRoot, "README.md");
  writeFileSync(readme, readFileSync(readme, "utf8") + "\nextra\n");
  const res = check({ repoRoot, expectedCount: 2 });
  assert.equal(res.ok, false);
  assert.ok(res.problems.some((x) => x.startsWith("SOURCE TOUCHED:") && x.includes("0 times")));
  assert.ok(res.problems.some((x) => x === `DRIFT: ${ADOPTED_ROOT}/README.md differs from what generation would produce`));
});

test("check: catches stray files in the adopted tree", (t) => {
  const { repoRoot } = fixtureRepo();
  t.after(() => rmSync(repoRoot, { recursive: true, force: true }));
  generate({ repoRoot, date: DATE, expectedCount: 2 });
  writeFileSync(adoptedPath(repoRoot, "01_B2C/99_INVENTED.md"), "# not from any source\n");
  const res = check({ repoRoot, expectedCount: 2 });
  assert.equal(res.ok, false);
  assert.ok(res.problems.some((x) => x.startsWith("STRAY:") && x.includes("99_INVENTED.md")));
});

test("neutralize/buildAdopted: reject 0 or >1 occurrences; accept exactly 1", () => {
  assert.equal(neutralize("no rule here\n").count, 0);
  assert.throws(() => buildAdopted("no rule here\n", "x.md", DATE), /found 0/);
  const twice = workflowText("T") + RULE9_LINE + "\n";
  assert.equal(neutralize(twice).count, 2);
  assert.throws(() => buildAdopted(twice, "x.md", DATE), /found 2/);
  assert.ok(buildAdopted(workflowText("T"), "x.md", DATE).includes(REPLACEMENT_RULE9));
});

test("generate: rejects a malformed --date; source-count mismatch fails", (t) => {
  const { repoRoot } = fixtureRepo();
  t.after(() => rmSync(repoRoot, { recursive: true, force: true }));
  assert.throws(() => generate({ repoRoot, date: "yesterday", expectedCount: 2 }), /--date must match/);
  assert.throws(() => generate({ repoRoot, date: DATE, expectedCount: 24 }), /expected 24 workflow sources/);
});

test("istTimestamp: emits the strict IST-to-the-second format --check requires", () => {
  const ts = istTimestamp(Date.UTC(2026, 6, 19, 9, 30, 0)); // 09:30:00 UTC = 15:00:00 IST
  assert.match(ts, DATE_RE);
  assert.equal(ts, "2026-07-19 15:00:00 IST");
});
