#!/usr/bin/env node
/**
 * report-store-lint.mjs — frontmatter + dispositions law for docs/reports/ (R3).
 *
 * WHY THIS EXISTS. Merge plan §3.3 (docs/plans/2026-07-19-os-v2-architecture-
 * merge-plan.md), the exact triad the owner dictated: every report carries
 * frontmatter (report_id, date IST, task, project, source_tool, type,
 * supersedes) and — when the report's TYPE produces findings — a dispositions
 * block where every actionable finding is rowed as
 * {finding, IMPLEMENT|REJECT|MONITOR, reason}. A finding without a recorded
 * disposition silently becomes either forgotten work or unowned scope creep;
 * this lint makes that silence impossible for every report written from the
 * M2 cutover onward.
 *
 * SCOPE LAW (the grandfather boundary — deliberate, documented, and the most
 * load-bearing judgment in this file):
 *   - The law binds on reports CREATED FROM M2 (2026-07-19) ONWARD. The
 *     boundary is the SIMPLER FRONTMATTER-DATE RULE, chosen over "files added
 *     after the M2 cutover commit" because it is decidable from file bytes
 *     alone (no git dependency, works in any checkout, testable offline):
 *       LEGACY  = no frontmatter at all, OR frontmatter date < 2026-07-19.
 *                 Counted in the banner, indexed where frontmatter allows,
 *                 NEVER failed — retrofitting 100+ historical files would
 *                 falsify history, and nobody grandfathers by editing.
 *       NEW     = frontmatter present AND date >= 2026-07-19 (or date
 *                 unparseable — a report that cannot prove it predates the
 *                 law is judged by the law: fail-closed).
 *   - A NEW report MUST carry complete frontmatter and, when its type is a
 *     FINDING TYPE (research | audit | ingest-screen | review | disposition —
 *     the types whose output IS findings), a dispositions section with at
 *     least one triad row. For milestone-build | handover | dry-run |
 *     ops-plan types the section is OPTIONAL: those reports record executed
 *     work, handed-over state, or owner-directed operational action plans
 *     whose items already live in the issue/queue registers they cite —
 *     forcing a triad table there would duplicate registers, not add truth.
 *     (Triad rows they DO carry are still shape-checked: if a report speaks
 *     the vocabulary, it speaks it completely.)
 *     ops-plan RULING BASIS (added 2026-07-19 19:43:06 IST, M2 fix round):
 *     founding instance RPT-20260720-CHASE, the Monday chase sheet the owner
 *     ordered in D-20260719-31 (DIRECTIVES.md: agent supplies the per-person
 *     chase list — names + work + done-when). Its items are chase ACTIONS the
 *     owner executes, mailbox-reconciled against the WAITING-ON registers —
 *     not findings awaiting IMPLEMENT|REJECT|MONITOR verdicts — so the
 *     dispositions section is optional exactly as for handover. NOT a
 *     weakening (rule g): frontmatter fully binds, any triad row the type
 *     carries is still shape-checked, and unknown types still fail closed.
 *     Lesson the gap taught (concurrent-writer): the chase sheet landed
 *     ~8 min AFTER this lint's delivering session last ran it — a gate PR
 *     must re-run its real-store check against the FINAL store before merge.
 *   - TRIAD GRANDFATHER REGISTER (strict-residues.yaml pattern — loud, owner-
 *     visible, can only shrink): the two M1-era finding-type reports were
 *     written hours BEFORE this lint existed, on the cutover date itself, in
 *     the disposition vocabularies they were ruled with (Scoped/Subordinated/
 *     Mapped; the PR-fate ledger). Retro-editing adopted screens/ledgers to
 *     speak the triad would falsify history (do-not-edit-reports law), so
 *     each is registered below BY report_id WITH its reason, prints as a LOUD
 *     "TRIAD-GRANDFATHERED" line every run, and exempts ONLY the ">=1 triad
 *     row" requirement — frontmatter, section presence, and the shape of any
 *     triad row it might gain all still bind. A register entry whose report
 *     no longer exists, or whose report now carries triad rows, is ITSELF a
 *     failure ("stale register row — remove it").
 *
 * WHAT IT CHECKS (NEW reports):
 *   1. frontmatter complete: report_id, date, task, project, source_tool,
 *      type, supersedes — every key present (supersedes may be null, but the
 *      key must exist: an absent key is an unasked question, a null is an
 *      answered one);
 *   2. report_id matches RPT-YYYYMMDD-SLUG and is UNIQUE across the store
 *      (uniqueness is an index-integrity property, so it binds on every
 *      frontmattered report, legacy included — two reports with one id is
 *      one id lying twice);
 *   3. date is IST to the second: "YYYY-MM-DD HH:MM:SS IST" (CLAUDE.md crash-
 *      resilience law: date-only entries are a lint finding);
 *   4. type is one of the known set; unknown types fail closed (a type the
 *      law has never heard of is a dispositions dodge until ruled otherwise);
 *   5. finding-type reports carry a dispositions section — a heading whose
 *      text contains "disposition(s)" ("## Dispositions", "## Disposition
 *      table", "## … and their dispositions", "### dispositions block" all
 *      count) — with >= 1 triad row (unless triad-grandfathered, above);
 *   6. every triad row (a table row / list line inside a dispositions section
 *      carrying exactly ONE of IMPLEMENT | REJECT | MONITOR) has a non-trivial
 *      finding before the verdict and a non-trivial reason with it;
 *   7. MONITOR rows must name a monitoring home. HONESTY NOTE: this is a
 *      STRING-PRESENCE check — the row must mention launches/<domain>/
 *      monitoring…, BACKLOG, or WAITING-ON. It proves the row POINTS at a
 *      home, not that the home file contains the item; the deep cross-check
 *      rides the M2+ monitoring mechanisms. A shallow check loudly declared
 *      beats a deep check falsely claimed.
 *   8. supersedes, when non-null, must name an EXISTING report_id in the
 *      store (and never the report itself) — a supersedes pointer into the
 *      void un-supersedes nothing.
 *
 * INDEX. Builds docs/reports/index.json — a bare sorted array of
 * {report_id, date, type, file, supersedes} for ALL frontmattered reports
 * (legacy frontmattered included: the index is a retrieval surface, not a
 * compliance verdict) — token-cheap agent retrieval per plan §3.3. Default
 * mode WRITES it (only on a clean run — a lint never bakes an index from
 * violating inputs); --check mode compares and fails on a stale index.
 *
 * SCAN SCOPE: *.md files directly under docs/reports/. Subdirectories
 * (e.g. 2026-07-19-os-v2-evidence/) are evidence bundles ATTACHED to reports,
 * governed by Evidence Law v2 (§2.5), not reports themselves.
 *
 * CONTROL PROBE (§0.6 house stance): known-good and known-bad synthetic
 * report sets run through the REAL parser and REAL lint first; a broken probe
 * means the gate checked nothing and the run fails.
 *
 * RULE g: this gate is purely ADDITIVE — no existing gate is touched.
 *
 * Exit codes: 0 = clean · 2 = violations OR broken probe OR stale index
 * (CI blocks) · 1 = harness error.
 *
 * Usage: node scripts/report-store-lint.mjs [--check] [--dir <reports-dir>]
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const REPORTS_DIR = "docs/reports";
export const INDEX_FILE = "docs/reports/index.json";

/** The M2 cutover date — the frontmatter-date grandfather boundary (header). */
export const M2_CUTOVER = "2026-07-19";

export const FM_KEYS = ["report_id", "date", "task", "project", "source_tool", "type", "supersedes"];

/** Types whose OUTPUT is findings — dispositions section + >=1 triad row required. */
export const FINDING_TYPES = new Set(["research", "audit", "ingest-screen", "review", "disposition"]);
/**
 * Types recording executed work / handed-over state / owner-directed
 * operational action plans — dispositions OPTIONAL (header ¶ scope law;
 * ops-plan ruling basis D-20260719-31, founding instance RPT-20260720-CHASE).
 */
export const OPTIONAL_DISPOSITION_TYPES = new Set(["milestone-build", "handover", "dry-run", "ops-plan"]);
export const TYPES = new Set([...FINDING_TYPES, ...OPTIONAL_DISPOSITION_TYPES]);

export const REPORT_ID_RE = /^RPT-\d{8}(-[A-Z0-9]+)+$/;
export const IST_DATE_RE = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} IST$/;

/** Triad verdict token — uppercase, whole word (MONITORED/IMPLEMENTING never match). */
export const TRIAD_RE = /\b(IMPLEMENT|REJECT|MONITOR)\b/g;

/** MONITOR home — string presence only, shallowness declared in the header (¶7). */
export const MONITOR_HOME_RE = /launches\/[\w.-]+\/monitoring[\w./-]*|\bBACKLOG\b|\bWAITING-ON\b/i;

/**
 * TRIAD GRANDFATHER REGISTER (header ¶ scope law). report_id → reason.
 * Loud every run; can only shrink; a stale row is itself a failure.
 */
export const TRIAD_GRANDFATHER = new Map([
  [
    "RPT-20260719-STD-INGEST",
    "M1-era ingest screen (2026-07-19 14:09:19 IST) — dispositions speak the adoption vocabulary (Scoped/Subordinated/Mapped) it was ruled with, hours before this lint existed; retro-editing an adopted screen would falsify history",
  ],
  [
    "RPT-20260719-M1-PRLEDGER",
    "M1-era frozen-PR ledger (2026-07-19 17:31:03 IST) — rows carry the PR-fate vocabulary the freeze was ruled with; same falsify-history bar",
  ],
]);

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

/**
 * Parse a frontmatter block (narrow YAML subset: single-line `key: value`
 * pairs between `---` fences at byte 0; this repo has no yaml dependency by
 * design). Returns { fm: object|null, errors: string[], body: string }.
 * fm === null means the file does NOT open a frontmatter block at all.
 * A file that OPENS a block but garbles it claims frontmatter — its errors
 * are real errors, not a legacy pass (fail-closed).
 * @param {string} text
 */
export function parseFrontmatter(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0] !== "---") return { fm: null, errors: [], body: text };
  const errors = [];
  const fm = {};
  let close = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "---") { close = i; break; }
    const stripped = lines[i].trim();
    if (stripped === "" || stripped.startsWith("#")) continue;
    const m = lines[i].match(/^([a-z_]+):\s*(.*)$/);
    if (!m) { errors.push(`frontmatter line ${i + 1}: unparseable: ${stripped}`); continue; }
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    fm[m[1]] = v === "null" || v === "" ? null : v;
  }
  if (close === -1) {
    errors.push("frontmatter block opened with --- but never closed");
    return { fm, errors, body: "" };
  }
  return { fm, errors, body: lines.slice(close + 1).join("\n") };
}

/**
 * Find dispositions sections in a markdown body: every heading whose text
 * contains "disposition(s)" (case-insensitive), extending to the next heading
 * of the same or higher level. Returns [{heading, lines}].
 * @param {string} body
 */
export function findDispositionSections(body) {
  const lines = body.split(/\r?\n/);
  const sections = [];
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^(#{1,6})\s+(.*)$/);
    if (!h || !/dispositions?\b/i.test(h[2])) continue;
    const level = h[1].length;
    const sec = { heading: h[2].trim(), lines: [] };
    for (let j = i + 1; j < lines.length; j++) {
      const nh = lines[j].match(/^(#{1,6})\s/);
      if (nh && nh[1].length <= level) break;
      sec.lines.push(lines[j]);
    }
    sections.push(sec);
  }
  return sections;
}

/** Strip markdown emphasis/backticks for length judgments. */
const plain = (s) => s.replace(/[*_`]/g, "").trim();

/**
 * Extract triad rows from dispositions-section lines. A triad row is a
 * non-separator table row or list/plain line carrying EXACTLY ONE distinct
 * verdict token; lines with 2+ distinct tokens are prose about the vocabulary
 * (a legend, a spec quote), never a row.
 * Returns [{line, verdict, finding, reason}].
 * @param {string[]} lines
 */
export function extractTriadRows(lines) {
  const rows = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (line === "" || /^\|[\s|:-]+\|$/.test(line)) continue; // blank / table separator
    const tokens = [...new Set([...line.matchAll(TRIAD_RE)].map((m) => m[1]))];
    if (tokens.length !== 1) continue;
    const verdict = tokens[0];
    let finding = "", reason = "";
    if (line.startsWith("|")) {
      const cells = line.split("|").map((c) => c.trim());
      // drop the empty first/last artefacts of |-delimited rows
      if (cells[0] === "") cells.shift();
      if (cells.length && cells[cells.length - 1] === "") cells.pop();
      const vi = cells.findIndex((c) => new RegExp(`\\b${verdict}\\b`).test(c));
      finding = plain(cells.slice(0, vi).join(" "));
      reason = plain(cells.slice(vi + 1).join(" "));
    } else {
      const stripped = line.replace(/^([-*+]|\d+[.)])\s+/, "");
      const vi = stripped.search(new RegExp(`\\b${verdict}\\b`));
      finding = plain(stripped.slice(0, vi));
      reason = plain(stripped.slice(vi + verdict.length).replace(/^[:\s—–-]+/, ""));
    }
    rows.push({ line, verdict, finding, reason });
  }
  return rows;
}

// ---------------------------------------------------------------------------
// The lint proper — pure, so probes and tests can drive it.
// ---------------------------------------------------------------------------

/**
 * @param {{file:string, text:string}[]} files — repo-relative path + content
 * @param {Map<string,string>} grandfather — triad grandfather register
 * @returns {{violations:string[], loud:string[], index:object[], counts:object}}
 */
export function lintReportStore(files, grandfather = TRIAD_GRANDFATHER) {
  const violations = [];
  const loud = [];
  const counts = { scanned: files.length, legacy_unfrontmattered: 0, legacy_frontmattered: 0, new: 0, grandfathered_triad: 0, indexed: 0 };

  const parsed = [];
  for (const f of files) {
    const { fm, errors, body } = parseFrontmatter(f.text);
    parsed.push({ ...f, fm, fmErrors: errors, body });
  }

  // Classification (header ¶ scope law): fail-closed on unparseable dates.
  for (const p of parsed) {
    if (p.fm === null) { p.cls = "legacy"; counts.legacy_unfrontmattered++; continue; }
    const datePart = typeof p.fm.date === "string" && /^\d{4}-\d{2}-\d{2}/.test(p.fm.date) ? p.fm.date.slice(0, 10) : null;
    if (datePart !== null && datePart < M2_CUTOVER) { p.cls = "legacy"; counts.legacy_frontmattered++; continue; }
    p.cls = "new";
    counts.new++;
    if (datePart === null) violations.push(`${p.file}: frontmatter date is missing/unparseable — a report that cannot prove it predates the ${M2_CUTOVER} law is judged by the law (fail-closed)`);
  }

  // report_id uniqueness — index integrity, binds on every frontmattered report.
  const byId = new Map();
  for (const p of parsed) {
    if (p.fm?.report_id) {
      if (byId.has(p.fm.report_id)) violations.push(`${p.file}: report_id "${p.fm.report_id}" already used by ${byId.get(p.fm.report_id).file} — two reports with one id is one id lying twice`);
      else byId.set(p.fm.report_id, p);
    }
  }

  for (const p of parsed) {
    if (p.cls !== "new") continue;
    const at = p.file;
    for (const e of p.fmErrors) violations.push(`${at}: ${e}`);

    for (const k of FM_KEYS) {
      if (!(k in (p.fm ?? {}))) violations.push(`${at}: frontmatter missing key \`${k}\` — an absent key is an unasked question (null is an answered one)`);
      else if (k !== "supersedes" && p.fm[k] === null) violations.push(`${at}: frontmatter key \`${k}\` is empty/null — only supersedes may be null`);
    }
    if (p.fm.report_id && !REPORT_ID_RE.test(p.fm.report_id)) violations.push(`${at}: report_id "${p.fm.report_id}" does not match RPT-YYYYMMDD-SLUG (uppercase slug segments)`);
    if (typeof p.fm.date === "string" && !IST_DATE_RE.test(p.fm.date)) violations.push(`${at}: date "${p.fm.date}" is not IST to the second ("YYYY-MM-DD HH:MM:SS IST") — date-only entries are a lint finding (CLAUDE.md)`);
    if (p.fm.type && !TYPES.has(p.fm.type)) violations.push(`${at}: type "${p.fm.type}" is not in {${[...TYPES].join(", ")}} — an unknown type is a dispositions dodge until ruled otherwise (fail-closed)`);

    if (p.fm.supersedes !== null && p.fm.supersedes !== undefined) {
      if (p.fm.supersedes === p.fm.report_id) violations.push(`${at}: supersedes names itself`);
      else if (!byId.has(p.fm.supersedes)) violations.push(`${at}: supersedes "${p.fm.supersedes}" names no report_id in the store — a supersedes pointer into the void un-supersedes nothing`);
    }

    // Dispositions law.
    const sections = findDispositionSections(p.body);
    const triadRows = sections.flatMap((s) => extractTriadRows(s.lines));
    const isFindingType = p.fm.type && FINDING_TYPES.has(p.fm.type);
    if (isFindingType) {
      if (sections.length === 0) {
        violations.push(`${at}: type "${p.fm.type}" produces findings but has NO dispositions section — every actionable finding must be rowed {finding, IMPLEMENT|REJECT|MONITOR, reason} (plan §3.3)`);
      } else if (triadRows.length === 0) {
        if (grandfather.has(p.fm.report_id)) {
          counts.grandfathered_triad++;
          loud.push(`TRIAD-GRANDFATHERED  ${p.fm.report_id} (${p.file}) — ${grandfather.get(p.fm.report_id)}`);
        } else {
          violations.push(`${at}: dispositions section carries ZERO triad rows — a finding-type report must row every finding as {finding, IMPLEMENT|REJECT|MONITOR, reason}`);
        }
      }
    }
    // Shape of every triad row anywhere a dispositions section exists —
    // speaking the vocabulary means speaking it completely (any type).
    for (const r of triadRows) {
      if (r.finding.length < 5) violations.push(`${at}: triad row has no finding before its ${r.verdict} verdict: "${r.line.slice(0, 100)}"`);
      if (r.reason.length < 10) violations.push(`${at}: triad row has no/trivial reason with its ${r.verdict} verdict: "${r.line.slice(0, 100)}"`);
      if (r.verdict === "MONITOR" && !MONITOR_HOME_RE.test(r.line)) {
        violations.push(`${at}: MONITOR row names no monitoring home (launches/<domain>/monitoring… or BACKLOG or WAITING-ON) — an unhomed MONITOR is a finding sent nowhere: "${r.line.slice(0, 100)}"`);
      }
    }
  }

  // Grandfather register hygiene — the register can only shrink truthfully.
  for (const [id, reason] of grandfather) {
    const p = byId.get(id);
    if (!p) { violations.push(`triad grandfather register: "${id}" names no report in the store — stale register row, remove it (register reason was: ${reason.slice(0, 60)}…)`); continue; }
    const rows = findDispositionSections(p.body).flatMap((s) => extractTriadRows(s.lines));
    if (rows.length > 0) violations.push(`triad grandfather register: "${id}" (${p.file}) now carries ${rows.length} triad row(s) — the exemption earns nothing, remove the register row`);
  }

  // Index — all frontmattered reports with the three retrieval fields.
  const index = [];
  for (const p of parsed) {
    if (p.fm?.report_id && p.fm?.date && p.fm?.type) {
      index.push({ report_id: p.fm.report_id, date: p.fm.date, type: p.fm.type, file: p.file, supersedes: p.fm.supersedes ?? null });
    } else if (p.fm !== null && p.cls === "legacy") {
      loud.push(`legacy frontmattered but unindexable (missing report_id/date/type): ${p.file}`);
    }
  }
  index.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.report_id < b.report_id ? -1 : 1));
  counts.indexed = index.length;

  return { violations, loud, index, counts };
}

/**
 * Compare an existing index.json text against the computed index.
 * @returns {string[]} violations (empty = fresh)
 */
export function compareIndex(existingText, index) {
  if (existingText === null) return [`${INDEX_FILE} does not exist — stale index; run \`node scripts/report-store-lint.mjs\` to write it`];
  let existing;
  try { existing = JSON.parse(existingText); } catch { return [`${INDEX_FILE} is not valid JSON — stale/corrupt index; regenerate it`]; }
  if (JSON.stringify(existing) !== JSON.stringify(index)) {
    return [`${INDEX_FILE} is STALE — it does not match the frontmatter on disk; run \`node scripts/report-store-lint.mjs\` to regenerate (never hand-edit the index: it is a generated view)`];
  }
  return [];
}

// ---------------------------------------------------------------------------
// Control probes — REAL parser + REAL lint on known-good/known-bad sets.
// ---------------------------------------------------------------------------

export const PROBE_NEW_GOOD = `---
report_id: RPT-20260720-PROBE
date: "2026-07-20 09:00:00 IST"
task: "probe task"
project: "probe project"
source_tool: "probe tool"
type: research
supersedes: null
---

# Probe report

## Dispositions

| finding | disposition | reason |
|---|---|---|
| probe finding one | IMPLEMENT | landed in the probe fix, PR #0 |
| probe finding two | MONITOR | watch via BACKLOG.md row PROBE-1 |
`;

export const PROBE_LEGACY = `# Old report, no frontmatter\n\nHistorical prose only.\n`;

export function runControlProbes() {
  const broken = [];
  const good = lintReportStore([
    { file: "docs/reports/probe-new.md", text: PROBE_NEW_GOOD },
    { file: "docs/reports/probe-legacy.md", text: PROBE_LEGACY },
  ], new Map());
  if (good.violations.length !== 0) broken.push(`anti-probe: a complete new report + a legacy report were flagged (${good.violations[0]})`);
  if (good.counts.legacy_unfrontmattered !== 1 || good.index.length !== 1) broken.push(`probe: classification/index wrong (${JSON.stringify(good.counts)})`);

  const noSection = lintReportStore([{ file: "docs/reports/p.md", text: PROBE_NEW_GOOD.replace(/## Dispositions[\s\S]*/, "") }], new Map());
  if (!noSection.violations.some((v) => v.includes("NO dispositions section"))) broken.push("probe: a finding-type report without a dispositions section was NOT flagged");

  const unhomed = lintReportStore([{ file: "docs/reports/p.md", text: PROBE_NEW_GOOD.replace("watch via BACKLOG.md row PROBE-1", "keep an eye on it somehow") }], new Map());
  if (!unhomed.violations.some((v) => v.includes("MONITOR row names no monitoring home"))) broken.push("probe: an unhomed MONITOR row was NOT flagged");

  return broken;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function loadFiles(dirAbs, dirRel) {
  return readdirSync(dirAbs)
    .filter((n) => n.endsWith(".md") && statSync(join(dirAbs, n)).isFile())
    .sort()
    .map((n) => ({ file: `${dirRel}/${n}`, text: readFileSync(join(dirAbs, n), "utf8") }));
}

function main(argv) {
  const check = argv.includes("--check");
  const dirArg = argv.indexOf("--dir");
  const dirRel = dirArg >= 0 ? argv[dirArg + 1] : REPORTS_DIR;
  const dirAbs = resolve(REPO_ROOT, dirRel);
  const indexAbs = join(dirAbs, "index.json");

  const broken = runControlProbes();
  if (broken.length > 0) {
    console.error("\nreport-store-lint: CONTROL PROBE FAILED — this gate did not run.");
    for (const b of broken) console.error(`  ✗ ${b}`);
    return 2;
  }

  const { violations, loud, index, counts } = lintReportStore(loadFiles(dirAbs, dirRel));

  console.log(`\nreport-store-lint — ${counts.scanned} reports in ${dirRel}/ · ${counts.new} NEW (law binds) · ${counts.legacy_unfrontmattered + counts.legacy_frontmattered} LEGACY grandfathered (${counts.legacy_unfrontmattered} unfrontmattered, ${counts.legacy_frontmattered} pre-${M2_CUTOVER}) · ${counts.indexed} indexed`);
  for (const l of loud) console.log(`  ${l}`);

  if (check) violations.push(...compareIndex(existsSync(indexAbs) ? readFileSync(indexAbs, "utf8") : null, index));

  if (violations.length === 0) {
    if (!check) {
      writeFileSync(indexAbs, JSON.stringify(index, null, 2) + "\n");
      console.log(`\n${dirRel}/index.json written (${index.length} entries).`);
    }
    console.log(`\nPASS — every NEW report carries complete frontmatter${check ? "; index fresh" : ""}; legacy history untouched.\n`);
    return 0;
  }
  for (const v of violations) console.log(`\nVIOLATION  ${v}`);
  console.log(`\nFAIL — ${violations.length} violation${violations.length === 1 ? "" : "s"}. Fix the report (or the stale index/register), never the lint (CLAUDE.md rule g). Legacy history is never the fix target.\n`);
  return 2;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    console.error(`report-store-lint: harness error — ${e.message}`);
    process.exit(1);
  }
}
