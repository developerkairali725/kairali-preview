// matrix-walk.test.js — the tests for G9-PRE, the gate that decides whether a site
// may be called ready. If this file is wrong, the walk is decoration.
//
// The suite is built around one asymmetry: it is easy to write a gate that always
// says no, and easy to write one that always says yes. Both are useless. So every
// detector is tested in BOTH directions — the clean fixture must PROVE, and the
// broken fixture must FAIL, for the same detector, in the same run. That is the
// same idea as SD 0.6's control probe, applied to the test suite itself.
//
// Fixtures are ARTIFACTS (a real map, a real built-URL inventory). Verdict hashes
// are computed at runtime from those artifacts rather than hardcoded: a fixture
// with a stale hardcoded hash would make the binding tests pass for the wrong
// reason, which is precisely the class of bug this gate exists to catch.
//
// house style: plain ESM + node --test. Node 24 type-strips the .ts import chain.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  checkBinding, checkProvenance, gitProvenance, loadVerdicts, parseTsv, sha256File,
  sliceArtifact, validateVerdict,
} from "../lib/verdict.mjs";
import {
  CHANGE_CLASSES, PROVEN, REGISTRY, TRIBUTARIES, UNPROVEN, VOID, NA,
  applyVoidChain, checkConformance, findMap, renderText, resolveGate, runControlProbes, walk,
} from "../matrix-walk.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const FIX = resolve(HERE, "../../test/fixtures/matrix");
const DOMAIN = "whatisayurveda.com";
const MAP_REL = "docs/group-inputs/whatisayurveda-keyword-url-map.tsv";

const fix = (n) => join(FIX, n);
const readFix = (n) => readFileSync(fix(n), "utf8");
const jsonFix = (n) => JSON.parse(readFix(n));

/** A CI-committed verdict, as far as provenance is concerned. */
const CI_PROV = () => ({ available: true, committed: true, dirty: false, author: "github-actions[bot]", email: "41898282+github-actions[bot]@users.noreply.github.com", isCi: true, commit: "deadbeef", signature: "N" });
const HUMAN_PROV = (name = "Abilash") => ({ available: true, committed: true, dirty: false, author: name, email: "director@kairali.com", isCi: false, commit: "cafe", signature: "N" });

/* ------------------------------------------------------------ scaffolding */

/** Build a throwaway repo with the fixture artifacts in it. */
function makeRepo(t, { map = "keyword-url-map.tsv", built = "built-urls.good.json" } = {}) {
  const root = mkdtempSync(join(tmpdir(), "matrix-walk-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "audits", DOMAIN), { recursive: true });
  mkdirSync(join(root, dirname(MAP_REL)), { recursive: true });
  // the control probe binds package.json; every repo root has one
  writeFileSync(join(root, "package.json"), JSON.stringify({ name: "fixture-repo" }, null, 2));
  if (map) copyFileSync(fix(map), join(root, MAP_REL));
  if (built) copyFileSync(fix(built), join(root, "audits", DOMAIN, "built-urls.json"));
  return root;
}

const BASE_TIME = Date.parse("2026-07-16T10:00:00+05:30");
const stamp = (offsetHours) => new Date(BASE_TIME + offsetHours * 3600_000).toISOString().replace(/\.\d+Z$/, "+00:00");

/**
 * Write a §0.2-compliant PASS verdict for `gate`, binding a real file with its real
 * hash. Timestamps ascend with stage so the monotonic rule is satisfied.
 */
function writeVerdict(root, gate, { stage = 0, artifact = MAP_REL, status = "PASS", human = null, extra = {} } = {}) {
  const abs = resolve(root, artifact);
  const v = {
    gate, status,
    artifact_path: artifact,
    artifact_sha256: sha256File(abs),
    rubric_sha256: null,
    command: human ? null : `node scripts/${gate.toLowerCase()}.mjs`,
    argv: [],
    exit_code: status === "PASS" ? 0 : 2,
    started_at: stamp(stage),
    finished_at: stamp(stage + 0.1),
    runner: human ? "human" : "github-actions",
    ci_run_url: human ? null : `https://github.com/kairali-digital/kairali-web-factory/actions/runs/${1000 + stage}`,
    control_probe: { name: "known-present-control", expected: true, observed: true },
    ...(human ? { human: { name: human, role: "signatory" } } : {}),
    ...extra,
  };
  writeFileSync(join(root, "audits", DOMAIN, `${gate}-verdict.json`), JSON.stringify(v, null, 2));
  return v;
}

/** Give every blocking gate + tributary on track A a clean, proven verdict. */
function proveEverything(root) {
  for (const g of REGISTRY) {
    if (g.track && g.track !== "A") continue;
    if (g.blocking === "advisory") continue;
    writeVerdict(root, g.id, { stage: g.stage, human: g.kind === "HUMAN" ? "Abilash" : null });
  }
  for (const t of TRIBUTARIES) {
    if (t.track && t.track !== "A") continue;
    writeVerdict(root, t.id, { stage: t.at });
  }
}

/** Provenance resolver keyed on what the verdict declares (human vs CI). */
const provFor = (root) => (file) => {
  // the hash control probe binds package.json, which is not a verdict — and may be
  // deleted by the probe-failure test. Tolerate both; git would not care either.
  try {
    const v = JSON.parse(readFileSync(file, "utf8"));
    return v.runner === "human" ? HUMAN_PROV(v.human?.name ?? "Abilash") : CI_PROV();
  } catch {
    return CI_PROV();
  }
};

const walkRepo = (root, opts = {}) =>
  walk({ site: DOMAIN, repoRoot: root, provenance: provFor(root), now: BASE_TIME + 12 * 3600_000, ...opts });

/* ==========================================================================
 * 1 · THE VERDICT CONTRACT (SD 0.2)
 * ========================================================================== */

test("a well-formed verdict passes the contract", () => {
  assert.deepEqual(validateVerdict(jsonFix("verdict.valid.json")), []);
});

test("SD 0.2 rejects a verdict that lacks any field — no control probe means the gate did not run", () => {
  const p = validateVerdict(jsonFix("verdict.no-control-probe.json"));
  assert.ok(p.some((x) => /missing required field "control_probe"/.test(x)), p.join("|"));
});

test("SD 0.2 rejects status PASS with a non-zero exit code — the forged-success shape", () => {
  const p = validateVerdict(jsonFix("verdict.pass-with-nonzero-exit.json"));
  assert.ok(p.some((x) => /exit_code 2.*claims it passed/.test(x)), p.join("|"));
});

test("SD 0.6 rejects a verdict whose control probe observed != expected (our ugrep zero, in a file)", () => {
  const p = validateVerdict(jsonFix("verdict.control-probe-broken.json"));
  assert.ok(p.some((x) => /the gate's own detector is broken/.test(x)), p.join("|"));
});

test("SD 0.5: rubric_sha256 may be null while the rubric layer is unbuilt, but never garbage", () => {
  assert.deepEqual(validateVerdict(jsonFix("verdict.valid.json")), []); // null is fine
  const p = validateVerdict(jsonFix("verdict.rubric-garbage.json"));
  assert.ok(p.some((x) => /rubric_sha256/.test(x)), p.join("|"));
});

test("a verdict bound to nothing judged nothing", () => {
  const p = validateVerdict(jsonFix("verdict.unbound.json"));
  assert.ok(p.some((x) => /judged nothing/.test(x)), p.join("|"));
});

test("a person cannot stand in for a machine gate's enforcing command", () => {
  const p = validateVerdict(jsonFix("verdict.human-on-machine-gate.json"), { kind: "PRE" });
  assert.ok(p.some((x) => /a person cannot stand in for/.test(x)), p.join("|"));
});

test("a HUMAN gate's verdict must name the person — not delegable", () => {
  const p = validateVerdict(jsonFix("verdict.human-unnamed.json"), { kind: "HUMAN" });
  assert.ok(p.some((x) => /must name the person/.test(x)), p.join("|"));
});

test("status FAIL with exit 0 is rejected — a failing gate that exits 0 does not block CI", () => {
  const v = { ...jsonFix("verdict.valid.json"), status: "FAIL", exit_code: 0 };
  assert.ok(validateVerdict(v).some((x) => /does not block CI/.test(x)));
});

/* ==========================================================================
 * 2 · PROVENANCE — what separates a verdict from a .md file
 * ========================================================================== */

test("a verdict last committed by a human/agent is not evidence, however well-formed", () => {
  const v = jsonFix("verdict.valid.json");
  const p = checkProvenance(v, HUMAN_PROV("Abhilash Kairali"), { kind: "PRE" });
  assert.ok(p.some((x) => /not a CI job/.test(x)), p.join("|"));
  assert.ok(p.some((x) => /different costume/.test(x)), p.join("|"));
});

test("a CI-committed verdict clears provenance", () => {
  assert.deepEqual(checkProvenance(jsonFix("verdict.valid.json"), CI_PROV(), { kind: "PRE" }), []);
});

test('runner "local" is iteration evidence, never ship evidence', () => {
  const v = { ...jsonFix("verdict.valid.json"), runner: "local", ci_run_url: null };
  const p = checkProvenance(v, CI_PROV(), { kind: "PRE" });
  assert.ok(p.some((x) => /no CI provenance/.test(x)), p.join("|"));
});

test("an uncommitted verdict is not evidence", () => {
  const p = checkProvenance(jsonFix("verdict.valid.json"), { available: true, committed: false, reason: "never committed" }, {});
  assert.deepEqual(p, ["never committed"]);
});

test("we fail CLOSED when git is unavailable — 'could not check' must cost the same as 'failed'", () => {
  const p = checkProvenance(jsonFix("verdict.valid.json"), { available: false, reason: "git is unavailable" }, {});
  assert.equal(p.length, 1);
});

test("a HUMAN gate signed by a CI job is rejected — a machine cannot sign for a person", () => {
  const v = jsonFix("verdict.human-unnamed.json");
  const p = checkProvenance(v, CI_PROV(), { kind: "HUMAN" });
  assert.ok(p.some((x) => /cannot sign for a person/.test(x)), p.join("|"));
});

/* ==========================================================================
 * 3 · SLICE HASHING (SD 0.3)
 * ========================================================================== */

test("slice hashing is order-independent but content-sensitive", () => {
  const text = readFix("keyword-url-map.tsv");
  const { header, rows } = parseTsv(text);
  const reordered = [header.join("\t"), ...[...rows].reverse().map((r) => header.map((h) => r[h]).join("\t"))].join("\n");
  assert.equal(
    sliceArtifact(reordered, ["locale", "keyword"]).manifest_sha256,
    sliceArtifact(text, ["locale", "keyword"]).manifest_sha256,
    "re-ordering rows is not a change",
  );
  const edited = text.replace("/doshas/vata", "/doshas/vaata");
  assert.notEqual(
    sliceArtifact(edited, ["locale", "keyword"]).manifest_sha256,
    sliceArtifact(text, ["locale", "keyword"]).manifest_sha256,
    "editing any cell IS a change",
  );
});

test("a duplicate row id throws rather than silently collapsing two rows into one", () => {
  assert.throws(
    () => sliceArtifact(readFix("keyword-url-map-cannibalised.tsv"), ["locale", "keyword"]),
    /duplicate row id/,
  );
});

test("an unknown slice key column throws", () => {
  assert.throws(() => sliceArtifact(readFix("keyword-url-map.tsv"), ["nope"]), /not in the header/);
});

test("SD 0.3: appending a row voids ONLY the appended rows, not the old verdict", (t) => {
  const root = makeRepo(t);
  const judged = sliceArtifact(readFix("keyword-url-map.tsv"), ["locale", "keyword"]);
  const v = {
    ...jsonFix("verdict.valid.json"), gate: "G5-PRE", artifact_path: MAP_REL,
    artifact_sha256: null, slice: judged,
  };
  // still MATCH after an append — this is the whole point of slice binding:
  // "don't touch the artifact" was how S5 mistakes got built instead of corrected.
  copyFileSync(fix("keyword-url-map-appended.tsv"), join(root, MAP_REL));
  assert.equal(checkBinding(v, root, ["locale", "keyword"]).state, "MATCH");

  // but editing a JUDGED row voids it
  writeFileSync(join(root, MAP_REL), readFix("keyword-url-map.tsv").replace("/doshas/vata", "/doshas/CHANGED"));
  const b = checkBinding(v, root, ["locale", "keyword"]);
  assert.equal(b.state, "MISMATCH");
  assert.deepEqual(b.changedRows.map((r) => r.split(String.fromCharCode(31)).join("/")), ["en/vata dosha"]);
});

test("deleting a judged row voids the verdict too", (t) => {
  const root = makeRepo(t);
  const judged = sliceArtifact(readFix("keyword-url-map.tsv"), ["locale", "keyword"]);
  const v = { ...jsonFix("verdict.valid.json"), artifact_path: MAP_REL, artifact_sha256: null, slice: judged };
  writeFileSync(join(root, MAP_REL), readFix("keyword-url-map.tsv").split("\n").filter((l) => !l.includes("vata dosha")).join("\n"));
  const b = checkBinding(v, root, ["locale", "keyword"]);
  assert.equal(b.state, "MISMATCH");
  assert.equal(b.missingRows.length, 1);
});

/* ==========================================================================
 * 4 · BINDING — the artifact changed after it passed
 * ========================================================================== */

test("whole-file binding: MATCH, then MISMATCH the moment the artifact changes", (t) => {
  const root = makeRepo(t);
  const v = writeVerdict(root, "G5-PRE", { stage: 5 });
  assert.equal(checkBinding(v, root).state, "MATCH");
  writeFileSync(join(root, MAP_REL), readFix("keyword-url-map.tsv") + "en\tnew\t/new\tURL\tx\ty\n");
  const b = checkBinding(v, root);
  assert.equal(b.state, "MISMATCH");
  assert.match(b.detail, /changed after it passed/);
});

test("a verdict judging an artifact that is no longer on disk fails — absence of artifact = FAIL", (t) => {
  const root = makeRepo(t);
  const v = writeVerdict(root, "G5-PRE", { stage: 5 });
  rmSync(join(root, MAP_REL));
  assert.equal(checkBinding(v, root).state, "ARTIFACT_MISSING");
});

/* ==========================================================================
 * 5 · THE MISSING VERDICT — the branch that fires everywhere today
 * ========================================================================== */

test("a MISSING verdict is UNPROVEN, never a pass — silence is not consent", (t) => {
  const root = makeRepo(t);
  const row = resolveGate(REGISTRY.find((g) => g.id === "G3-PRE"), {
    byGate: new Map(), repoRoot: root, track: "A", tier: null, provenance: CI_PROV, now: BASE_TIME,
  });
  assert.equal(row.status, UNPROVEN);
  assert.ok(row.reasons.some((r) => /NO VERDICT/.test(r)));
  assert.ok(row.reasons.some((r) => /silence is not consent/.test(r)));
});

test("an unknown tier fails CLOSED — conditional gates are treated as blocking", (t) => {
  const root = makeRepo(t);
  const ctx = { byGate: new Map(), repoRoot: root, track: "A", tier: null, provenance: CI_PROV, now: BASE_TIME };
  const row = resolveGate(REGISTRY.find((g) => g.id === "G5-FACT"), ctx); // blocking: "FULL"
  assert.equal(row.blocking, true);
  assert.ok(row.notes.some((r) => /fail-closed/.test(r)));
  assert.deepEqual(row.reasons.filter((r) => /fail-closed/.test(r)), [], "a scoping note is not a contract violation");
  // ...and relaxes only when the tier is actually declared
  const lite = resolveGate(REGISTRY.find((g) => g.id === "G5-FACT"), { ...ctx, tier: "LITE" });
  assert.equal(lite.blocking, false);
});

test("a track-scoped gate is N/A with its reason printed, never silently dropped", (t) => {
  const root = makeRepo(t);
  const row = resolveGate(REGISTRY.find((g) => g.id === "G5-EXEC"), {
    byGate: new Map(), repoRoot: root, track: "A", tier: null, provenance: CI_PROV, now: BASE_TIME,
  });
  assert.equal(row.status, NA);
  assert.match(row.notes.join(" "), /track-scoped to B/);
});

/* ==========================================================================
 * 6 · THE VOID CHAIN (SD 0.3)
 * ========================================================================== */

test("a voided upstream gate voids everything downstream that stood on it", () => {
  const rows = [
    { gate: "G3-PRE", stage: 3, status: VOID, void: true, blocking: true, reasons: [], finishedAt: stamp(3) },
    { gate: "G5-PRE", stage: 5, status: PROVEN, void: false, blocking: true, reasons: [], finishedAt: stamp(5) },
    { gate: "G6-PRE", stage: 6, status: PROVEN, void: false, blocking: true, reasons: [], finishedAt: stamp(6) },
  ];
  applyVoidChain(rows);
  assert.equal(rows[1].status, VOID);
  assert.equal(rows[2].status, VOID);
  assert.match(rows[1].voidReason, /downstream of G3-PRE/);
});

test("THE MONOTONIC RULE: an upstream gate that re-ran LATER makes a downstream verdict stale", () => {
  // Both gates are green. Both are individually valid. Nobody catches this by hand:
  // the map was corrected at S5 and the content was never re-judged against it.
  const rows = [
    { gate: "G5-PRE", stage: 5, status: PROVEN, void: false, blocking: true, reasons: [], finishedAt: stamp(20) },
    { gate: "G6-PRE", stage: 6, status: PROVEN, void: false, blocking: true, reasons: [], finishedAt: stamp(6) },
  ];
  applyVoidChain(rows);
  assert.equal(rows[0].status, PROVEN, "the upstream gate itself is fine");
  assert.equal(rows[1].status, VOID);
  assert.match(rows[1].voidReason, /STALE: G5-PRE .* re-ran .* AFTER this verdict/);
});

test("an advisory gate never voids the chain", () => {
  const rows = [
    { gate: "G0-FACT", stage: 0, status: UNPROVEN, void: false, blocking: false, advisory: true, reasons: [], finishedAt: null },
    { gate: "G8-PRE", stage: 8, status: PROVEN, void: false, blocking: true, reasons: [], finishedAt: stamp(8) },
  ];
  applyVoidChain(rows);
  assert.equal(rows[1].status, PROVEN);
});

/* ==========================================================================
 * 7 · CONFORMANCE — the site IS the map (SD S9(d)3)
 * ========================================================================== */

const conformCtx = (root, over = {}) => ({
  repoRoot: root, domain: DOMAIN, byGate: new Map(), mapPath: MAP_REL,
  builtUrlsPath: join("audits", DOMAIN, "built-urls.json"), ...over,
});

test("conformance PASSES when the build is the map", (t) => {
  const root = makeRepo(t);
  const c = checkConformance(conformCtx(root));
  assert.equal(c.status, PROVEN, JSON.stringify(c.assertions, null, 2));
  assert.equal(c.assertions.filter((a) => !a.pass).length, 0);
});

test("conformance catches the build silently diverging from the approved map (AP-19)", (t) => {
  const root = makeRepo(t, { built: "built-urls.drift.json" });
  const c = checkConformance(conformCtx(root));
  assert.equal(c.status, UNPROVEN);
  const setEq = c.assertions.find((a) => a.name.startsWith("set(built URLs)"));
  assert.equal(setEq.pass, false);
  assert.match(setEq.detail, /1 approved URL\(s\) NOT BUILT \[\/doshas\/pitta\]/);
  assert.match(setEq.detail, /1 built URL\(s\) NOT IN THE MAP \[\/blog\/10-amazing-ayurveda-hacks\]/);
});

test("conformance catches a page claiming a keyword the map never bound to it", (t) => {
  const root = makeRepo(t, { built: "built-urls.drift.json" });
  const c = checkConformance(conformCtx(root));
  const sub = c.assertions.find((a) => a.name.startsWith("∀ page"));
  assert.equal(sub.pass, false);
  assert.match(sub.detail, /ayurveda cures everything/);
});

test("a decision that is not URL is not expected in the build (MERGE and 301 rows)", (t) => {
  const root = makeRepo(t);
  const c = checkConformance(conformCtx(root));
  // /herbs/turmeric exists once; "haldi doodh" is MERGEd and "ayurveda cure cancer"
  // is a 301 — neither may demand a built URL, or every merge would fail the gate.
  assert.equal(c.assertions.find((a) => a.name.startsWith("set(built URLs)")).pass, true);
});

test("conformance catches one keyword cannibalised across two URLs", (t) => {
  const root = makeRepo(t, { map: "keyword-url-map-cannibalised.tsv", built: null });
  writeFileSync(join(root, "audits", DOMAIN, "built-urls.json"), JSON.stringify({
    urls: [{ url: "/what-is-ayurveda", keywords: [] }, { url: "/herbs/turmeric", keywords: [] }, { url: "/blog/turmeric-benefits", keywords: [] }],
  }));
  const c = checkConformance(conformCtx(root));
  const uniq = c.assertions.find((a) => a.name.startsWith("no keyword bound to two URLs"));
  assert.equal(uniq.pass, false);
  assert.match(uniq.detail, /en\/turmeric benefits → \/herbs\/turmeric AND \/blog\/turmeric-benefits/);
});

test("the same keyword in two LOCALES is not cannibalisation", (t) => {
  const root = makeRepo(t);
  const c = checkConformance(conformCtx(root));
  assert.equal(c.assertions.find((a) => a.name.startsWith("no keyword bound to two URLs")).pass, true);
});

test("★ SLICE COVERAGE: a row appended after the last verdict is judged by NOBODY and must fail", (t) => {
  const root = makeRepo(t, { map: "keyword-url-map-appended.tsv" });
  const judged = sliceArtifact(readFix("keyword-url-map.tsv"), ["locale", "keyword"]); // the OLD row-set
  const byGate = new Map([["G5-PRE", [{ ...jsonFix("verdict.valid.json"), gate: "G5-PRE", artifact_path: MAP_REL, artifact_sha256: null, slice: judged }]]]);
  const c = checkConformance(conformCtx(root, { byGate }));
  const cov = c.assertions.find((a) => a.name.startsWith("slice coverage"));
  assert.equal(cov.pass, false, "slice hashing without a coverage check lets a new row skip the gate entirely");
  assert.match(cov.detail, /en\/shilajit benefits/);
  assert.match(cov.detail, /judged by NOTHING/);
});

test("conformance is UNPROVEN — not skipped — when there is no map at all", (t) => {
  const root = makeRepo(t, { map: null });
  const c = checkConformance(conformCtx(root, { mapPath: undefined }));
  assert.equal(c.status, UNPROVEN);
  assert.match(c.reasons.join(" "), /nothing for the build to conform TO/);
});

test("conformance is UNPROVEN when the build emitted no URL inventory", (t) => {
  const root = makeRepo(t, { built: null });
  const c = checkConformance(conformCtx(root));
  assert.equal(c.status, UNPROVEN);
  assert.match(c.reasons.join(" "), /marking its own homework/);
});

/* ==========================================================================
 * 8 · CONTROL PROBES (SD 0.6) — the walk challenges its own zero
 * ========================================================================== */

test("the control probes fire and both detectors are live", (t) => {
  const root = makeRepo(t);
  const { probes, ok } = runControlProbes({
    byGate: new Map(), repoRoot: root, track: "A", tier: null, provenance: CI_PROV, now: BASE_TIME,
  });
  assert.equal(ok, true);
  assert.deepEqual(probes.map((p) => p.name).sort(), ["hash-mismatch-detector", "missing-verdict-detector"]);
  assert.equal(probes.find((p) => p.name === "missing-verdict-detector").observed, UNPROVEN);
  assert.equal(probes.find((p) => p.name === "hash-mismatch-detector").observed, true);
});

/* ==========================================================================
 * 9 · MALFORMED EVIDENCE — never silently skipped
 * ========================================================================== */

test("verdict-shaped JSON with no gate field is reported malformed, not ignored", (t) => {
  const root = makeRepo(t);
  copyFileSync(fix("verdict.no-gate-field.json"), join(root, "audits", DOMAIN, "stray.json"));
  const { malformed } = loadVerdicts(join(root, "audits", DOMAIN));
  assert.equal(malformed.length, 1);
  assert.match(malformed[0].reason, /no "gate" field/);
});

test("unparseable JSON in audits/ is reported, not swallowed", (t) => {
  const root = makeRepo(t);
  copyFileSync(fix("verdict.truncated.json"), join(root, "audits", DOMAIN, "broken.json"));
  const { malformed } = loadVerdicts(join(root, "audits", DOMAIN));
  assert.match(malformed[0].reason, /unparseable JSON/);
});

test("verdicts bind on the gate FIELD, not the filename — a misnamed file cannot satisfy the wrong gate", (t) => {
  const root = makeRepo(t);
  const v = writeVerdict(root, "G3-PRE", { stage: 3 });
  // rename the file to claim a different gate; the field must still rule
  writeFileSync(join(root, "audits", DOMAIN, "G8-PRE-verdict.json"), JSON.stringify(v));
  rmSync(join(root, "audits", DOMAIN, "G3-PRE-verdict.json"));
  const { byGate } = loadVerdicts(join(root, "audits", DOMAIN));
  assert.ok(byGate.has("G3-PRE"));
  assert.ok(!byGate.has("G8-PRE"));
});

/* ==========================================================================
 * 10 · THE WALK, END TO END — both directions
 * ========================================================================== */

test("★ an empty repo is DO-NOT-SHIP and names every unproven gate", (t) => {
  const root = makeRepo(t, { map: null, built: null });
  const r = walkRepo(root);
  assert.equal(r.ship, false);
  assert.ok(r.unproven.length > 30, `expected the whole matrix unproven, got ${r.unproven.length}`);
  // the tributaries the draft lost to range notation are individually named
  for (const id of ["C1-FORM", "C3-STALE", "C4-AXE", "C7-LOCK"]) {
    assert.ok(r.unproven.some((x) => x.gate === id), `${id} must be named, never ranged`);
  }
  assert.equal(r.conformance.status, UNPROVEN);
});

test("★ a fully-evidenced repo SHIPS — the gate can say yes, or its no means nothing", (t) => {
  const root = makeRepo(t);
  proveEverything(root);
  const r = walkRepo(root);
  assert.equal(r.ship, true, "unproven: " + JSON.stringify(r.unproven.map((x) => [x.gate, x.reasons]), null, 2));
  assert.equal(r.unproven.length, 0);
  assert.equal(r.conformance.status, PROVEN);
  assert.equal(r.control.ok, true);
});

test("★ ONE hand-authored verdict flips SHIP to DO-NOT-SHIP", (t) => {
  const root = makeRepo(t);
  proveEverything(root);
  const r = walkRepo(root, {
    // the same evidence, but git says a person wrote G3-PRE's verdict
    provenance: (file) => {
      const v = JSON.parse(readFileSync(file, "utf8"));
      if (v.gate === "G3-PRE") return HUMAN_PROV("Abhilash Kairali");
      return provFor(root)(file);
    },
  });
  assert.equal(r.ship, false);
  const g3 = r.all.find((x) => x.gate === "G3-PRE");
  assert.equal(g3.status, UNPROVEN);
  assert.match(g3.reasons.join(" "), /not a CI job/);
  // and the void chain carries it downstream
  assert.equal(r.all.find((x) => x.gate === "G6-PRE").status, VOID);
});

test("★ touching an artifact after it passed voids its gate and everything downstream", (t) => {
  const root = makeRepo(t);
  proveEverything(root);
  assert.equal(walkRepo(root).ship, true);
  writeFileSync(join(root, MAP_REL), readFix("keyword-url-map.tsv") + "en\tsneaked in\t/sneaky\tURL\tx\ty\n");
  const r = walkRepo(root);
  assert.equal(r.ship, false);
  assert.ok(r.voided.length > 0);
  assert.match(r.all.find((x) => x.gate === "G5-PRE").voidReason, /changed after it passed/);
});

test("★ a FAILING gate's verdict is not a pass", (t) => {
  const root = makeRepo(t);
  proveEverything(root);
  writeVerdict(root, "G6-LINT", { stage: 6, status: "FAIL" });
  const r = walkRepo(root);
  assert.equal(r.ship, false);
  assert.match(r.all.find((x) => x.gate === "G6-LINT").reasons.join(" "), /ran and FAILED/);
});

test("★ SD 11.7: fleet evidence EXPIRES — a snapshot is not a check for a target you do not own", (t) => {
  const root = makeRepo(t);
  proveEverything(root);
  const r = walkRepo(root, { now: BASE_TIME + 40 * 86_400_000 }); // 40 days later
  assert.equal(r.ship, false);
  const fleet = r.all.find((x) => x.gate === "G11-FLEET");
  assert.equal(fleet.status, VOID);
  assert.match(fleet.voidReason, /days old/);
});

test("a broken control probe makes the walk's result not-evidence, whatever it says", (t) => {
  const root = makeRepo(t, { map: null, built: null });
  rmSync(join(root, "package.json")); // the hash probe's control artifact
  const r = walkRepo(root);
  assert.equal(r.control.ok, false);
  assert.equal(r.ship, false);
});

/* ==========================================================================
 * 11 · G9-Δ — the slice walk (SD 0.3's change-class table)
 * ========================================================================== */

test("G9-Δ scopes the walk to the gates the change class re-enters", (t) => {
  const root = makeRepo(t);
  const r = walkRepo(root, { slice: { class: "copy-edit" } });
  assert.equal(r.mode, "G9-Δ");
  assert.equal(r.sliceInfo.reEntersAt, "S6");
  assert.deepEqual(r.rows.map((x) => x.gate).sort(), ["G6-CITE", "G6-LINT", "G6-PRE", "G8-PRE"]);
  assert.equal(r.ship, false); // nothing is proven in this repo
});

test("a new URL re-enters at S5, not S8 — never route a change below the decision it changes", () => {
  assert.equal(CHANGE_CLASSES["new-page"].stage, 5);
  assert.ok(CHANGE_CLASSES["new-page"].gates.includes("G5-PRE"));
});

test("an unknown change class throws rather than walking nothing and reporting green", (t) => {
  const root = makeRepo(t);
  assert.throws(() => walkRepo(root, { slice: { class: "just-a-tweak" } }), /unknown change class/);
});

/* ==========================================================================
 * 12 · THE REGISTRY IS THE MATRIX
 * ========================================================================== */

test("all 17 compliance tributaries are present and named literally", () => {
  assert.equal(TRIBUTARIES.length, 17);
  assert.deepEqual(TRIBUTARIES.map((t) => t.id).sort(), [
    "C1-ART9", "C1-BANNER", "C1-FORM", "C1-PRECONSENT",
    "C2-MARKET", "C2-SCHEDULE", "C2-TIER",
    "C3-REVIEW", "C3-SCHEMA", "C3-STALE",
    "C4-AXE", "C4-CONTRAST", "C4-TARGET",
    "C5-PDP", "C5-POLICY", "C6-LP", "C7-LOCK",
  ]);
});

test("RANGE NOTATION IS BANNED in the registry — a range is what made 17 dropped checks invisible to a grep", () => {
  for (const g of [...REGISTRY, ...TRIBUTARIES]) {
    assert.doesNotMatch(g.id, /[–—…]|\.\.\./, `gate id "${g.id}" uses range notation`);
  }
});

test("every stage S0..S9 has at least one blocking gate — a stage with no gate is a stage that does not exist", () => {
  for (let s = 0; s <= 9; s++) {
    assert.ok(
      REGISTRY.some((g) => g.stage === s && g.blocking !== "advisory"),
      `S${s} has no blocking gate`,
    );
  }
});

test("G9-PRE is not in its own registry — a gate cannot be its own evidence", () => {
  assert.ok(!REGISTRY.some((g) => g.id === "G9-PRE"));
});

test("gate ids are unique", () => {
  const ids = [...REGISTRY, ...TRIBUTARIES].map((g) => g.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("every machine gate names its enforcing command; every HUMAN gate names none", () => {
  for (const g of REGISTRY) {
    if (g.kind === "HUMAN") assert.equal(g.command, null, `${g.id} is HUMAN and must not claim a command`);
    else assert.ok(g.command && g.command.length > 3, `${g.id} has no enforcing command`);
  }
});

/* ==========================================================================
 * 13 · FINDING THE MAP — silence and guessing are both failures
 * ========================================================================== */

test("the map is found by domain label, not the full domain (docs drop the TLD)", (t) => {
  const root = makeRepo(t);
  const found = findMap(root, DOMAIN, undefined);
  assert.equal(found.path, join(root, MAP_REL));
  assert.equal(found.error, null);
});

test("two matching maps is an ERROR, never a guess — certifying against a map nobody chose", (t) => {
  const root = makeRepo(t);
  copyFileSync(fix("keyword-url-map.tsv"), join(root, "docs/group-inputs/whatisayurveda-v2-keyword-url-map.tsv"));
  const found = findMap(root, DOMAIN, undefined);
  assert.equal(found.path, null);
  assert.match(found.error, /refusing to guess/);
});

test("a near-miss is REPORTED — 'no map found' must not hide a filename typo", (t) => {
  const root = makeRepo(t, { map: null });
  copyFileSync(fix("keyword-url-map.tsv"), join(root, "docs/group-inputs/kairalicenters-keyword-url-map.tsv"));
  const found = findMap(root, DOMAIN, undefined);
  assert.equal(found.path, null);
  assert.match(found.error, /though 1 exist elsewhere/);
  assert.match(found.error, /kairalicenters-keyword-url-map\.tsv/);
});

test("an explicit --map that does not exist is an error, not a silent skip", (t) => {
  const root = makeRepo(t);
  const found = findMap(root, DOMAIN, "docs/nope.tsv");
  assert.equal(found.path, null);
  assert.match(found.error, /does not exist/);
});

/* ==========================================================================
 * 14 · THE REAL GIT PATH — the one function no fake can validate
 *
 * Every test above injects a fake provenance resolver, and the acceptance run
 * against whatisayurveda never reaches gitProvenance (no verdict exists to check).
 * So without these, the single most load-bearing function in the contract would
 * ship having never executed — which is this repo's own "dead on arrival" failure,
 * committed inside the gate built to stop exactly that.
 * ========================================================================== */

test("gitProvenance reads REAL git history: a human-committed file is committed, and is not CI", () => {
  const root = resolve(HERE, "../..");
  const prov = gitProvenance(join(root, "CLAUDE.md"), root);
  if (!prov.available) {
    // no git here — then the contract must fail CLOSED, and say so
    assert.match(prov.reason, /git is unavailable|not a work tree/);
    return;
  }
  assert.equal(prov.committed, true);
  assert.ok(prov.author.length > 0, "a real author name");
  assert.equal(prov.isCi, false, "CLAUDE.md is committed by people, so it would NOT be ship evidence");
  assert.match(prov.commit, /^[0-9a-f]{40}$/);
  // and that is exactly what checkProvenance must reject for a machine gate
  assert.ok(checkProvenance(jsonFix("verdict.valid.json"), prov, { kind: "PRE" }).some((x) => /not a CI job/.test(x)));
});

test("gitProvenance: an untracked file has never been committed, so it is not evidence", (t) => {
  const root = resolve(HERE, "../..");
  const scratch = join(root, `.matrix-walk-provenance-probe-${process.pid}.json`);
  t.after(() => rmSync(scratch, { force: true }));
  writeFileSync(scratch, "{}");
  const prov = gitProvenance(scratch, root);
  if (!prov.available) return;
  assert.equal(prov.committed, false);
  assert.match(prov.reason, /never been committed/);
});

test("the 17 tributaries are never labelled 'human' — that would invent an owner for unassigned work", (t) => {
  const root = makeRepo(t, { map: null, built: null });
  const text = renderText(walkRepo(root));
  assert.match(text, /C3-STALE[\s\S]{0,200}NO MACHINE ASSIGNED/);
  assert.doesNotMatch(text, /C4-AXE[\s\S]{0,120}\(human — not delegable\)/);
});
