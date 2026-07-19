// report-store-lint.test.js — tests for the report-store frontmatter +
// dispositions lint (merge plan §3.3, the R3 triad; M2 mechanisms).
//
// House rule (matrix-walk.test.js, gate-registry-lint.test.js): every
// detector is tested in BOTH directions — the clean input must PASS and the
// broken input must FAIL, for the same detector, in the same run. The
// grandfather boundary (the scope law's load-bearing judgment) gets both
// directions explicitly: 2026-07-18 legacy freedom AND 2026-07-19 new-law
// bite on the SAME defect.
//
// house style: plain ESM + node --test.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import {
  FM_KEYS, FINDING_TYPES, INDEX_FILE, M2_CUTOVER, OPTIONAL_DISPOSITION_TYPES,
  PROBE_NEW_GOOD, PROBE_LEGACY,
  REPO_ROOT, REPORTS_DIR, TRIAD_GRANDFATHER,
  compareIndex, extractTriadRows, findDispositionSections, lintReportStore,
  parseFrontmatter, runControlProbes,
} from "../report-store-lint.mjs";

/** Lint a single synthetic report with no grandfather register. */
const check = (text, register = new Map()) =>
  lintReportStore([{ file: "docs/reports/t.md", text }], register).violations;

/** A fully-compliant NEW report the broken variants are derived from. */
const GOOD = PROBE_NEW_GOOD;

// ── control probes ───────────────────────────────────────────────────────────

test("control probes pass (the gate is not broken)", () => {
  assert.deepEqual(runControlProbes(), []);
});

// ── frontmatter parser: both directions ──────────────────────────────────────

test("frontmatter parses keys, quoted values, and null", () => {
  const { fm, errors } = parseFrontmatter(GOOD);
  assert.deepEqual(errors, []);
  assert.equal(fm.report_id, "RPT-20260720-PROBE");
  assert.equal(fm.date, "2026-07-20 09:00:00 IST");
  assert.equal(fm.type, "research");
  assert.equal(fm.supersedes, null);
});

test("a file not starting with --- has fm === null (legacy signal)", () => {
  assert.equal(parseFrontmatter(PROBE_LEGACY).fm, null);
});

test("an opened-but-garbled frontmatter block errors instead of passing as legacy", () => {
  const { fm, errors } = parseFrontmatter("---\nno colon here\ntype: research\n---\nbody");
  assert.notEqual(fm, null);
  assert.ok(errors.some((e) => e.includes("unparseable")));
  const unclosed = parseFrontmatter("---\ntype: research\nbody with no closing fence");
  assert.ok(unclosed.errors.some((e) => e.includes("never closed")));
});

// ── THE GRANDFATHER BOUNDARY: both directions on the same defect ─────────────

test("no-frontmatter legacy report passes no matter its content", () => {
  assert.deepEqual(check("# Old report\n\nFindings galore, zero dispositions, no frontmatter.\n"), []);
});

test(`frontmattered report dated before ${M2_CUTOVER} is LEGACY — incomplete frontmatter + no dispositions never fail`, () => {
  const legacy = `---\nreport_id: RPT-20260718-OLD\ndate: "2026-07-18 10:00:00 IST"\ntype: research\n---\n# Old\n\nFindings, no dispositions.\n`;
  const { violations, counts, index } = lintReportStore([{ file: "docs/reports/old.md", text: legacy }], new Map());
  assert.deepEqual(violations, []);
  assert.equal(counts.legacy_frontmattered, 1);
  // …but it is still INDEXED (the index is a retrieval surface, not a verdict)
  assert.equal(index.length, 1);
  assert.equal(index[0].report_id, "RPT-20260718-OLD");
});

test(`the SAME gaps dated ${M2_CUTOVER} fail — the law binds at the boundary`, () => {
  const onBoundary = `---\nreport_id: RPT-20260719-NEWX\ndate: "2026-07-19 10:00:00 IST"\ntype: research\n---\n# New\n\nFindings, no dispositions.\n`;
  const v = check(onBoundary);
  assert.ok(v.some((x) => x.includes("missing key `task`")));
  assert.ok(v.some((x) => x.includes("NO dispositions section")));
});

test("a frontmattered report with an unparseable date is judged NEW (fail-closed), never quietly legacy", () => {
  const v = check(GOOD.replace('date: "2026-07-20 09:00:00 IST"', "date: sometime"));
  assert.ok(v.some((x) => x.includes("fail-closed")));
});

// ── frontmatter completeness on NEW reports ──────────────────────────────────

test("the fully-compliant new report passes clean", () => {
  assert.deepEqual(check(GOOD), []);
});

for (const key of FM_KEYS.filter((k) => k !== "date")) {
  test(`new report missing \`${key}\` fails`, () => {
    const v = check(GOOD.replace(new RegExp(`^${key}:.*\\n`, "m"), ""));
    assert.ok(v.some((x) => x.includes(`missing key \`${key}\``)), JSON.stringify(v));
  });
}

test("null in a non-supersedes key fails; null supersedes is fine", () => {
  assert.ok(check(GOOD.replace('task: "probe task"', "task: null")).some((x) => x.includes("only supersedes may be null")));
  assert.deepEqual(check(GOOD), []); // GOOD carries supersedes: null
});

test("date must be IST to the second — date-only fails", () => {
  const v = check(GOOD.replace('date: "2026-07-20 09:00:00 IST"', 'date: "2026-07-20"'));
  assert.ok(v.some((x) => x.includes("not IST to the second")));
});

test("report_id format is enforced (RPT-YYYYMMDD-SLUG)", () => {
  const v = check(GOOD.replace("RPT-20260720-PROBE", "rpt-probe"));
  assert.ok(v.some((x) => x.includes("does not match RPT-YYYYMMDD-SLUG")));
});

test("duplicate report_id fails — even when one holder is legacy (index integrity)", () => {
  const legacyDup = `---\nreport_id: RPT-20260720-PROBE\ndate: "2026-07-01 10:00:00 IST"\ntype: audit\n---\n# Old\n`;
  const { violations } = lintReportStore([
    { file: "docs/reports/a.md", text: GOOD },
    { file: "docs/reports/b.md", text: legacyDup },
  ], new Map());
  assert.ok(violations.some((x) => x.includes("already used by")));
});

test("unknown type fails closed", () => {
  const v = check(GOOD.replace("type: research", "type: vibes"));
  assert.ok(v.some((x) => x.includes('type "vibes" is not in')));
});

// ── supersedes link validation: both directions ──────────────────────────────

test("supersedes naming an existing report passes; naming the void or itself fails", () => {
  const older = `---\nreport_id: RPT-20260718-OLD\ndate: "2026-07-18 10:00:00 IST"\ntype: research\n---\n# Old\n`;
  const superseder = GOOD.replace("supersedes: null", "supersedes: RPT-20260718-OLD");
  const ok = lintReportStore([
    { file: "docs/reports/old.md", text: older },
    { file: "docs/reports/new.md", text: superseder },
  ], new Map());
  assert.deepEqual(ok.violations, []);
  assert.equal(ok.index.find((e) => e.report_id === "RPT-20260720-PROBE").supersedes, "RPT-20260718-OLD");

  assert.ok(check(GOOD.replace("supersedes: null", "supersedes: RPT-20990101-GHOST"))
    .some((x) => x.includes("names no report_id in the store")));
  assert.ok(check(GOOD.replace("supersedes: null", "supersedes: RPT-20260720-PROBE"))
    .some((x) => x.includes("names itself")));
});

// ── dispositions law: section, heading variants, triad rows ──────────────────

test("heading variants count as the dispositions section", () => {
  for (const h of ["## Dispositions", "## Disposition table", "### dispositions block", "## The finding themes and their dispositions"]) {
    assert.deepEqual(check(GOOD.replace("## Dispositions", h)), [], h);
  }
});

test("finding-type report without the section fails; optional types pass without it", () => {
  const noSection = GOOD.replace(/## Dispositions[\s\S]*/, "");
  assert.ok(check(noSection).some((x) => x.includes("NO dispositions section")));
  for (const t of ["milestone-build", "handover", "dry-run", "ops-plan"]) {
    assert.deepEqual(check(noSection.replace("type: research", `type: ${t}`)), [], t);
  }
});

test("a dispositions section with zero triad rows fails a finding-type report", () => {
  const hollow = GOOD.replace(/\| probe finding[\s\S]*/, "Prose about findings, no rows.\n");
  assert.ok(check(hollow).some((x) => x.includes("ZERO triad rows")));
});

test("triad rows in an OPTIONAL-type report are still shape-checked (speak the vocabulary completely)", () => {
  for (const t of ["dry-run", "ops-plan"]) {
    const opt = GOOD
      .replace("type: research", `type: ${t}`)
      .replace("| probe finding two | MONITOR | watch via BACKLOG.md row PROBE-1 |", "| probe finding two | MONITOR | eh |");
    const v = check(opt);
    assert.ok(v.some((x) => x.includes("no/trivial reason")), t);
  }
});

test("triad row grammar: missing finding and missing reason both fail; list-form rows parse too", () => {
  assert.ok(check(GOOD.replace("| probe finding one | IMPLEMENT | landed in the probe fix, PR #0 |", "| x | IMPLEMENT | landed in the probe fix, PR #0 |"))
    .some((x) => x.includes("no finding before")));
  assert.ok(check(GOOD.replace("| probe finding one | IMPLEMENT | landed in the probe fix, PR #0 |", "| probe finding one | IMPLEMENT | ok |"))
    .some((x) => x.includes("no/trivial reason")));
  // list-form row, clean
  const listForm = GOOD.replace(/\| finding[\s\S]*/, "- probe finding one — IMPLEMENT: landed in the probe fix, PR #0\n- probe finding two — MONITOR: watch via WAITING-ON row PROBE-1\n");
  assert.deepEqual(check(listForm), []);
});

test("a line speaking 2+ triad tokens is prose (a legend), never a row", () => {
  const rows = extractTriadRows(["Every finding is rowed IMPLEMENT|REJECT|MONITOR per plan §3.3.", "| f is long enough | REJECT | reason long enough here |"]);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].verdict, "REJECT");
});

test("MONITORED / IMPLEMENTING never match as verdict tokens", () => {
  assert.deepEqual(extractTriadRows(["| state | MONITORED then CLOSED | fine |", "| state | IMPLEMENTING now | fine |"]), []);
});

// ── MONITOR home check: both directions (shallow by declaration) ─────────────

test("MONITOR row without a home fails; launches/<domain>/monitoring, BACKLOG and WAITING-ON all satisfy it", () => {
  const base = "| probe finding two | MONITOR | watch via BACKLOG.md row PROBE-1 |";
  assert.ok(check(GOOD.replace(base, "| probe finding two | MONITOR | we will keep watching it closely |"))
    .some((x) => x.includes("names no monitoring home")));
  for (const home of ["launches/theblushlounge.com/monitoring.yaml row 3", "BACKLOG.md row PROBE-1", "WAITING-ON item 4"]) {
    assert.deepEqual(check(GOOD.replace(base, `| probe finding two | MONITOR | tracked at ${home} |`)), [], home);
  }
});

// ── triad grandfather register: both directions + hygiene ────────────────────

test("a grandfathered finding-type report with zero triad rows passes LOUDLY; the same report un-registered fails", () => {
  const hollow = GOOD.replace(/\| probe finding[\s\S]*/, "1. theme one → Subordinated: handled in the appendix per plan §0.\n");
  const reg = new Map([["RPT-20260720-PROBE", "test-era report, pre-lint vocabulary"]]);
  const ok = lintReportStore([{ file: "docs/reports/t.md", text: hollow }], reg);
  assert.deepEqual(ok.violations, []);
  assert.equal(ok.counts.grandfathered_triad, 1);
  assert.ok(ok.loud.some((l) => l.startsWith("TRIAD-GRANDFATHERED")));
  assert.ok(check(hollow).some((x) => x.includes("ZERO triad rows")));
});

test("register hygiene: an entry naming no report, or a report that now carries triad rows, is a stale row and fails", () => {
  const ghost = lintReportStore([{ file: "docs/reports/t.md", text: GOOD }], new Map([["RPT-20990101-GHOST", "gone"]]));
  assert.ok(ghost.violations.some((x) => x.includes("names no report in the store")));
  const outgrown = lintReportStore([{ file: "docs/reports/t.md", text: GOOD }], new Map([["RPT-20260720-PROBE", "was hollow once"]]));
  assert.ok(outgrown.violations.some((x) => x.includes("remove the register row")));
});

// ── index: build + staleness, both directions ────────────────────────────────

test("index carries {report_id, date, type, file, supersedes} sorted by date", () => {
  const older = `---\nreport_id: RPT-20260718-OLD\ndate: "2026-07-18 10:00:00 IST"\ntype: audit\n---\n# Old\n`;
  const { index } = lintReportStore([
    { file: "docs/reports/new.md", text: GOOD },
    { file: "docs/reports/old.md", text: older },
  ], new Map());
  assert.deepEqual(index.map((e) => e.report_id), ["RPT-20260718-OLD", "RPT-20260720-PROBE"]);
  assert.deepEqual(Object.keys(index[0]), ["report_id", "date", "type", "file", "supersedes"]);
});

test("compareIndex: fresh passes; missing, corrupt, and stale all fail", () => {
  const { index } = lintReportStore([{ file: "docs/reports/t.md", text: GOOD }], new Map());
  assert.deepEqual(compareIndex(JSON.stringify(index), index), []);
  assert.ok(compareIndex(null, index).some((x) => x.includes("does not exist")));
  assert.ok(compareIndex("{not json", index).some((x) => x.includes("not valid JSON")));
  assert.ok(compareIndex("[]", index).some((x) => x.includes("STALE")));
});

// ── the REAL repo store: the law holds on main-line content ──────────────────

test("the real docs/reports/ store passes, M1-era reports intact, index fresh on disk", () => {
  const dirAbs = join(REPO_ROOT, REPORTS_DIR);
  const files = readdirSync(dirAbs)
    .filter((n) => n.endsWith(".md") && statSync(join(dirAbs, n)).isFile())
    .sort()
    .map((n) => ({ file: `${REPORTS_DIR}/${n}`, text: readFileSync(join(dirAbs, n), "utf8") }));
  const { violations, index, counts } = lintReportStore(files, TRIAD_GRANDFATHER);
  assert.deepEqual(violations, []);
  assert.ok(counts.new >= 5);
  for (const id of ["RPT-20260719-M0A", "RPT-20260719-M1", "RPT-20260719-M1-PRLEDGER", "RPT-20260719-STD-INGEST", "RPT-20260720-CHASE"]) {
    assert.ok(index.some((e) => e.report_id === id), `${id} missing from index`);
  }
  // the committed index is fresh (the --check contract)
  const onDisk = readFileSync(join(REPO_ROOT, INDEX_FILE), "utf8");
  assert.deepEqual(compareIndex(onDisk, index), []);
});

test("the finding-type set is exactly the ruled one", () => {
  assert.deepEqual([...FINDING_TYPES].sort(), ["audit", "disposition", "ingest-screen", "research", "review"]);
});

test("the optional-disposition set is exactly the ruled one (ops-plan per D-20260719-31, never a silent widening)", () => {
  assert.deepEqual([...OPTIONAL_DISPOSITION_TYPES].sort(), ["dry-run", "handover", "milestone-build", "ops-plan"]);
});
