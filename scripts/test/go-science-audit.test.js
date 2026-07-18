// go-science-audit.test.js — the GO-SCIENCE CONFORMANCE gate
// (D-GO-SCIENCE-GATE / D-20260718-20 + the same-evening LOOK/ROI amendment):
// scripts/go-science-audit.mjs.
//
// What is under test, and why it matters: the rubric must be DERIVED from
// docs/marketing/go-science/ — every criterion cites a verbatim doc passage
// and the gate fail-closes when the docs drift (never invent framework
// content); findings must be hash-bound to the exact artifacts judged; the
// LOOK section is judged on REAL images (magic-byte-validated screenshots);
// evidence is append-only; and exit 0 is reachable ONLY through every
// criterion PASSing in BOTH blocking sections. Both directions per the house
// rule: the valid paths pass, and every refusal actually refuses. No model is
// called here — the script is the validating/recording harness for an
// evaluating agent, so the tests drive the parsing/evidence/exit-code paths.
//
// house style: plain ESM + node --test, throwaway repos.
import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

import {
  AMBIGUITIES, DIRECTIVES, GO_DOCS, RUBRIC, RUBRIC_VERSION, SECTIONS, WORKING_QUESTION,
  parseArgs, rubricSha, runGoScienceAudit, sectionVerdicts, validateFindings, verifyRubricCitations,
} from "../go-science-audit.mjs";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SITE = "whatisayurveda.com";
const STAMP = "2026-07-18 21:00:00 IST"; // deterministic evidence date

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

// A real 1x1 transparent PNG — the screenshot validation round-trips real bytes.
const PNG_BYTES = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);

const PAGE_TEXT = "<main><h1>hero hook</h1><a href=\"/consult\">small CTA</a></main>\n";
const STRATEGY_TEXT = "# strategy\nMoA: declared avatar\nsignature MCB: declared\nSBJ stage: CMA\nNDFF source: MoA interviews\n";

/** Throwaway repo with the REAL go-science docs copied in (the rubric verifies
 * its citations against them — a repo without the docs must refuse to run). */
function makeRepo(t, { withDocs = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), "go-science-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  if (withDocs) {
    for (const rel of Object.values(GO_DOCS)) {
      mkdirSync(join(root, dirname(rel)), { recursive: true });
      cpSync(join(REPO_ROOT, rel), join(root, rel));
    }
  }
  writeFileSync(join(root, "page.tsx"), PAGE_TEXT);
  writeFileSync(join(root, "strategy.md"), STRATEGY_TEXT);
  writeFileSync(join(root, "shot-desktop.png"), PNG_BYTES);
  writeFileSync(join(root, "shot-mobile.png"), PNG_BYTES);
  return root;
}

function goodFindings(overrides = {}) {
  return {
    auditor: "test evaluating agent",
    working_question: WORKING_QUESTION,
    judged: {
      page_sha256: sha256(Buffer.from(PAGE_TEXT)),
      strategy_sha256: sha256(Buffer.from(STRATEGY_TEXT)),
      screenshot_desktop_sha256: sha256(PNG_BYTES),
      screenshot_mobile_sha256: sha256(PNG_BYTES),
    },
    criteria: RUBRIC.map((r) => ({
      id: r.id,
      result: "PASS",
      finding: `criterion ${r.id} verified against the artifacts in detail`,
      evidence: `page.tsx hero + strategy.md declaration for ${r.id}`,
    })),
    verdict: "PASS",
    ...overrides,
  };
}

function goodArgv(root, { findings = "findings.json", pass } = {}) {
  return [
    "--site", SITE,
    "--page", join(root, "page.tsx"),
    "--strategy", join(root, "strategy.md"),
    "--screenshot-desktop", join(root, "shot-desktop.png"),
    "--screenshot-mobile", join(root, "shot-mobile.png"),
    "--findings", join(root, findings),
    "--auditor", "test evaluating agent",
    ...(pass ? ["--pass", String(pass)] : []),
  ];
}

function writeFindings(root, findings, name = "findings.json") {
  writeFileSync(join(root, name), JSON.stringify(findings, null, 2));
}

/* ------------------------------------------------- rubric: derived, not invented */

test("rubric: every citation is a verbatim passage of the real go-science docs", () => {
  assert.deepEqual(verifyRubricCitations({ repoRoot: REPO_ROOT }), []);
});

test("rubric: shape — unique ids, both blocking sections populated, every criterion cited and judgeable", () => {
  const ids = RUBRIC.map((r) => r.id);
  assert.equal(new Set(ids).size, ids.length, "criterion ids must be unique");
  for (const section of Object.keys(SECTIONS)) {
    assert.ok(RUBRIC.some((r) => r.section === section), `section "${section}" must have criteria — both sections are blocking`);
  }
  for (const r of RUBRIC) {
    assert.ok(["content", "visual"].includes(r.section), `${r.id}: unknown section`);
    assert.ok(r.citations.length >= 1, `${r.id}: must cite the docs`);
    assert.ok(r.requirement.length > 30 && r.judge.length > 20, `${r.id}: requirement + judge question must be substantive`);
    for (const { file } of r.citations) {
      assert.ok(Object.values(GO_DOCS).includes(file), `${r.id}: citations may only point at docs/marketing/go-science/ (got ${file})`);
    }
  }
});

test("rubric: every LOOK criterion carries the amendment as its directive basis", () => {
  for (const r of RUBRIC.filter((r) => r.section === "visual")) {
    assert.equal(r.directive, "amendment", `${r.id}: the visual section exists because of the D-GO-SCIENCE-GATE amendment and must say so`);
  }
  assert.match(DIRECTIVES.amendment, /ROI IS THE KEY METRIC/);
});

test("rubric: every flagged ambiguity resolves to a registered entry, and drift fail-closes", (t) => {
  const registered = new Set(AMBIGUITIES.map((a) => a.id));
  for (const r of RUBRIC) {
    if (r.ambiguity) assert.ok(registered.has(r.ambiguity), `${r.id}: ambiguity ${r.ambiguity} is not in the register`);
  }
  // Drift: docs missing entirely -> problems name every criterion's missing doc.
  const bare = makeRepo(t, { withDocs: false });
  const missing = verifyRubricCitations({ repoRoot: bare });
  assert.ok(missing.length > 0 && missing.every((m) => m.includes("does not exist")));
  // Drift: a doc present but a quote edited away -> the exact quote is named.
  const drifted = makeRepo(t);
  const kb = join(drifted, GO_DOCS.KB);
  writeFileSync(kb, readFileSync(kb, "utf8").replace("People who are curious raise their hand and enter your world", "Curious people engage"));
  const probs = verifyRubricCitations({ repoRoot: drifted });
  assert.ok(probs.some((p) => p.includes("GS-MCB-5") && p.includes("re-derive the rubric")), `drift must be caught: ${probs.join(" | ")}`);
});

/* ----------------------------------------------------------------- parseArgs */

test("parseArgs: --rubric needs nothing else; a full run requires every input incl. BOTH screenshots and the auditor", () => {
  assert.equal(parseArgs(["--rubric"]).rubric, true);
  assert.throws(() => parseArgs(["--site", SITE]), /--page.*--strategy.*--screenshot-desktop.*--screenshot-mobile.*--findings.*--auditor/s);
  assert.throws(() => parseArgs([]), /desktop \+ mobile screenshots/);
  const ok = parseArgs(["--site", SITE, "--page", "p", "--strategy", "s", "--screenshot-desktop", "d.png", "--screenshot-mobile", "m.png", "--findings", "f.json", "--auditor", "agent"]);
  assert.equal(ok.screenshotDesktop, "d.png");
  assert.equal(ok.pass, "1");
  assert.throws(() => parseArgs(["--site", SITE, "--page", "p", "--strategy", "s", "--screenshot-desktop", "d.png", "--screenshot-mobile", "m.png", "--findings", "f.json", "--auditor", "a", "--pass", "0"]), /--pass must be a positive integer/);
});

/* --------------------------------------------------------- findings validation */

test("validateFindings: the complete, bound, consistent evaluation is accepted", () => {
  const bind = {
    pageSha: sha256(Buffer.from(PAGE_TEXT)),
    strategySha: sha256(Buffer.from(STRATEGY_TEXT)),
    desktopSha: sha256(PNG_BYTES),
    mobileSha: sha256(PNG_BYTES),
  };
  assert.deepEqual(validateFindings(goodFindings(), bind), []);
});

test("validateFindings: every refusal refuses", () => {
  const bind = {
    pageSha: sha256(Buffer.from(PAGE_TEXT)),
    strategySha: sha256(Buffer.from(STRATEGY_TEXT)),
    desktopSha: sha256(PNG_BYTES),
    mobileSha: sha256(PNG_BYTES),
  };
  const probsOf = (f) => validateFindings(f, bind);

  assert.ok(probsOf(null).some((p) => p.includes("JSON object")));
  assert.ok(probsOf(goodFindings({ auditor: " " })).some((p) => p.includes("anonymous evaluation")));
  assert.ok(probsOf(goodFindings({ working_question: "Is it good?" })).some((p) => p.includes(WORKING_QUESTION)));

  // Binding: findings hashed against different bytes judge a different page.
  const wrongHash = goodFindings();
  wrongHash.judged = { ...wrongHash.judged, page_sha256: "0".repeat(64) };
  assert.ok(probsOf(wrongHash).some((p) => p.includes("different bytes")));
  assert.ok(probsOf(goodFindings({ judged: null })).some((p) => p.includes('"judged" must bind')));

  // Criteria coverage: unknown, duplicate, missing, bad enum, empty finding/evidence.
  const unknown = goodFindings();
  unknown.criteria = [...unknown.criteria, { id: "GS-NOPE-9", result: "PASS", finding: "x".repeat(30), evidence: "e" }];
  assert.ok(probsOf(unknown).some((p) => p.includes("unknown id")));

  const dup = goodFindings();
  dup.criteria = [...dup.criteria, { ...dup.criteria[0] }];
  assert.ok(probsOf(dup).some((p) => p.includes("answered twice")));

  const short = goodFindings();
  short.criteria = short.criteria.slice(1);
  short.verdict = undefined;
  assert.ok(probsOf(short).some((p) => p.includes("unanswered")));

  const badEnum = goodFindings();
  badEnum.criteria = badEnum.criteria.map((c, i) => (i === 0 ? { ...c, result: "N_A" } : c));
  assert.ok(probsOf(badEnum).some((p) => p.includes("strict PASS|FAIL enum")));

  const noFinding = goodFindings();
  noFinding.criteria = noFinding.criteria.map((c, i) => (i === 0 ? { ...c, finding: "ok" } : c));
  assert.ok(probsOf(noFinding).some((p) => p.includes("judged nothing")));

  const noEvidence = goodFindings();
  noEvidence.criteria = noEvidence.criteria.map((c, i) => (i === 0 ? { ...c, evidence: "" } : c));
  assert.ok(probsOf(noEvidence).some((p) => p.includes('"evidence"')));

  // Consistency: a declared verdict must agree with the per-criterion results.
  const lying = goodFindings();
  lying.criteria = lying.criteria.map((c, i) => (i === 3 ? { ...c, result: "FAIL" } : c));
  assert.ok(probsOf(lying).some((p) => p.includes("disagrees with the per-criterion results")));
});

test("sectionVerdicts: both sections block — a single FAIL in either fails the overall", () => {
  const all = goodFindings();
  assert.deepEqual(sectionVerdicts(all), { content: "PASS", visual: "PASS", overall: "PASS" });

  const contentFail = goodFindings();
  contentFail.criteria = contentFail.criteria.map((c) => (c.id === "GS-MCB-6" ? { ...c, result: "FAIL" } : c));
  assert.deepEqual(sectionVerdicts(contentFail), { content: "FAIL", visual: "PASS", overall: "FAIL" });

  const visualFail = goodFindings();
  visualFail.criteria = visualFail.criteria.map((c) => (c.id === "GS-VIS-6" ? { ...c, result: "FAIL" } : c));
  assert.deepEqual(sectionVerdicts(visualFail), { content: "PASS", visual: "FAIL", overall: "FAIL" });
});

/* ------------------------------------------------------------- full runs */

test("run: all-PASS findings -> exit 0 and a complete evidence file", (t) => {
  const root = makeRepo(t);
  writeFindings(root, goodFindings());
  const r = runGoScienceAudit(goodArgv(root), { repoRoot: root, stamp: STAMP });
  assert.equal(r.exitCode, 0);
  assert.equal(r.evidencePath, join(root, "launches", SITE, "go-science", "2026-07-18.md"));
  const md = readFileSync(r.evidencePath, "utf8");
  assert.match(md, /OVERALL: PASS/);
  assert.match(md, /VERDICT content \(MCB \+ MoA\): PASS/);
  assert.match(md, /VERDICT visual \(LOOK \/ ROI\): PASS/);
  assert.ok(md.includes(DIRECTIVES.gate) && md.includes(DIRECTIVES.amendment), "evidence must carry both directive texts");
  assert.ok(md.includes(sha256(Buffer.from(PAGE_TEXT))), "evidence must hash-bind the page");
  assert.ok(md.includes(rubricSha()), "evidence must record the rubric hash");
  for (const r2 of RUBRIC) assert.ok(md.includes(`${r2.id} · ${r2.name}`), `evidence must record ${r2.id}`);
  assert.match(md, /Q-GO-SCIENCE-RUBRIC/);
});

test("run: a FAIL in the LOOK section -> exit 2, evidence written and honest (blocking, not advisory)", (t) => {
  const root = makeRepo(t);
  const f = goodFindings();
  f.criteria = f.criteria.map((c) => (c.id === "GS-VIS-1" ? { ...c, result: "FAIL", finding: "the hero hook is visually subordinate to the nav on mobile", evidence: "shot-mobile.png top fold" } : c));
  f.verdict = "FAIL";
  writeFindings(root, f);
  const r = runGoScienceAudit(goodArgv(root), { repoRoot: root, stamp: STAMP });
  assert.equal(r.exitCode, 2);
  const md = readFileSync(r.evidencePath, "utf8");
  assert.match(md, /VERDICT visual \(LOOK \/ ROI\): FAIL/);
  assert.match(md, /OVERALL: FAIL — the content\/look is REBUILT or refixed, never shipped around/);
});

test("run: a FAIL in the CONTENT section also blocks", (t) => {
  const root = makeRepo(t);
  const f = goodFindings();
  f.criteria = f.criteria.map((c) => (c.id === "GS-MOA-3" ? { ...c, result: "FAIL", finding: "the strategy artifact names no NDFF source; the page's fear-claims are invented", evidence: "strategy.md has no NDFF section" } : c));
  f.verdict = "FAIL";
  writeFindings(root, f);
  assert.equal(runGoScienceAudit(goodArgv(root), { repoRoot: root, stamp: STAMP }).exitCode, 2);
});

test("run: evidence is append-only; the next attempt is the next pass", (t) => {
  const root = makeRepo(t);
  writeFindings(root, goodFindings());
  runGoScienceAudit(goodArgv(root), { repoRoot: root, stamp: STAMP });
  assert.throws(() => runGoScienceAudit(goodArgv(root), { repoRoot: root, stamp: STAMP }), /append-only.*--pass 2/s);
  const r2 = runGoScienceAudit(goodArgv(root, { pass: 2 }), { repoRoot: root, stamp: STAMP });
  assert.equal(r2.evidencePath, join(root, "launches", SITE, "go-science", "2026-07-18-pass2.md"));
  assert.ok(existsSync(r2.evidencePath));
});

test("run: refusals — missing/empty artifacts, fake screenshots, unparseable or unbound findings, doc drift", (t) => {
  const root = makeRepo(t);
  writeFindings(root, goodFindings());

  // Missing page.
  const noPage = goodArgv(root);
  noPage[noPage.indexOf(join(root, "page.tsx"))] = join(root, "nope.tsx");
  assert.throws(() => runGoScienceAudit(noPage, { repoRoot: root, stamp: STAMP }), /--page .*does not exist/);

  // Empty strategy artifact.
  writeFileSync(join(root, "empty.md"), "   \n");
  const emptyStrat = goodArgv(root);
  emptyStrat[emptyStrat.indexOf(join(root, "strategy.md"))] = join(root, "empty.md");
  assert.throws(() => runGoScienceAudit(emptyStrat, { repoRoot: root, stamp: STAMP }), /--strategy .*empty/);

  // A text file wearing a .png extension is refused (magic bytes) — the LOOK
  // section is judged on pixels, and a mislabelled artifact is never sent on.
  writeFileSync(join(root, "fake.png"), "not an image");
  const fakeShot = goodArgv(root);
  fakeShot[fakeShot.indexOf(join(root, "shot-mobile.png"))] = join(root, "fake.png");
  assert.throws(() => runGoScienceAudit(fakeShot, { repoRoot: root, stamp: STAMP }), /magic-byte check failed/);

  // Unparseable findings.
  writeFileSync(join(root, "bad.json"), "{ nope");
  assert.throws(() => runGoScienceAudit(goodArgv(root, { findings: "bad.json" }), { repoRoot: root, stamp: STAMP }), /unparseable JSON/);

  // Findings bound to different bytes (page edited after evaluation).
  writeFileSync(join(root, "page.tsx"), PAGE_TEXT + "<!-- edited after the evaluation -->\n");
  assert.throws(() => runGoScienceAudit(goodArgv(root), { repoRoot: root, stamp: STAMP }), /different bytes/);
  writeFileSync(join(root, "page.tsx"), PAGE_TEXT); // restore

  // Doc drift fail-closes the whole run, before any judging.
  const kb = join(root, GO_DOCS.KB);
  writeFileSync(kb, readFileSync(kb, "utf8").replace("raise their hand and enter your world", "convert"));
  assert.throws(() => runGoScienceAudit(goodArgv(root), { repoRoot: root, stamp: STAMP }), /rubric\/doc drift/);
});
