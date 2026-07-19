#!/usr/bin/env node
/**
 * decisions-index.mjs — index + validator + Decision Guardian for the
 * decisions/ provenance store (OS v2 plan §3.2; owner requirement R2;
 * clears strict residues CM-073/CM-076).
 *
 * WHAT IT DOES
 *   1. VALIDATES every decision record — global `decisions/D-*.md` and
 *      site-scoped `launches/<domain>/decisions/D-*.md` (same format law,
 *      decisions/README.md):
 *        - frontmatter completeness: id (= filename), type, status, date
 *          (IST to the second, matching the id's date), deciders,
 *          expected_outcome, confidence, sources[{ref, trust_tier, retrieved}];
 *        - body: title + the six sections in order (Context, Drivers,
 *          Options considered, Outcome, Scientific rationale, Consequences);
 *        - supersedes/superseded_by linkage BOTH WAYS, no self/cyclic chains.
 *   2. ENFORCES IMMUTABILITY — the committed decisions/index.json stores a
 *      content hash per record. `immutable_sha256` hashes the record with the
 *      two legally mutable frontmatter fields (`status`, `superseded_by` —
 *      the supersession flip, README immutability law) EXCLUDED; any other
 *      change to a record that was accepted (or superseded) in the stored
 *      index FAILS the rebuild. Deleting such a record FAILS. Flipping
 *      accepted → superseded passes ONLY with a linked superseding record;
 *      accepted → proposed/rejected always FAILS. A legitimately NEW or
 *      superseding record is fine. proposed/rejected records are still
 *      editable (they have not entered history).
 *   3. BUILDS decisions/index.json: an array of
 *        {id, type, status, date, title, file, supersedes, superseded_by,
 *         content_sha256, immutable_sha256}
 *      sorted by id — the token-cheap query surface the boot contract loads
 *      (integrator wiring; see decisions/README.md "Boot hook").
 *
 * MODES
 *   node scripts/decisions-index.mjs                 # validate + rebuild index.json
 *   node scripts/decisions-index.mjs --check         # CI: index up to date + no
 *                                                    # mutated accepted records; exit 1 on any finding
 *
 *     BASE TRUST (--check; external pass blocker fix). The working-tree
 *     decisions/index.json rides in the same commit as the records, so a PR
 *     could edit an accepted record AND re-hash the ledger in one commit —
 *     the edited record then matches the edited ledger and the old check
 *     passed (deleting record + index row was laundered the same way). The
 *     fix: with BASE (env, front-gate/evidence-manifest convention) or
 *     --base <ref>, --check loads the PRIOR index from the TRUSTED BASE
 *     revision — `git show $(git merge-base BASE HEAD):decisions/index.json`,
 *     the same trusted-base mechanism as authenticated-approval — and
 *     compares CURRENT records against THAT ledger. A PR cannot rewrite the
 *     history it is being judged against.
 *       - accepted/superseded at base ⇒ must exist now with an unchanged
 *         immutable_sha256 (status→superseded + superseded_by addition stay
 *         the only legal mutations); missing now = deletion finding.
 *       - index absent at the merge base (the store is NEW in this PR) ⇒
 *         BOOTSTRAP: loud "base-trust unavailable" note + working-tree-only
 *         check. Fail-closed here would break the very PR that mints the
 *         store — the same bootstrap posture authenticated-approval takes on
 *         its first ledger. From the next PR on, base-trust binds.
 *       - index PRESENT at base but unparseable, or an unresolvable merge
 *         base ⇒ FAIL CLOSED (that is corruption or a broken diff context,
 *         not a bootstrap).
 *     Local mode WITHOUT BASE keeps today's working-tree behavior and prints
 *     that CI enforces base-trust.
 *
 *   node scripts/decisions-index.mjs guardian --base <sha>
 *     Decision Guardian: for the diff <sha>...HEAD, prints which decision
 *     records GOVERN the touched files:
 *         "you are touching <file> — <id> governs (<title>)"
 *     INFORMATIONAL, exit 0 — the Guardian informs, the owner rules.
 *
 * GUARDIAN MATCHING (site scope + type-to-path heuristics — the documented map)
 *   - EXPLICIT `governs:` (optional frontmatter, a list of repo-relative path
 *     prefixes): when present it REPLACES the type heuristic for that record —
 *     the record governs exactly the files under those prefixes. This is the
 *     precision channel; seed records use it so the Guardian stays readable.
 *   - SITE SCOPE: a record in launches/<domain>/decisions/ governs any touched
 *     file under launches/<domain>/ or sites/<domain>/ (decision records
 *     themselves excluded — editing the store is not "touching governed work").
 *   - GLOBAL records WITHOUT `governs:` fall back to TYPE heuristics:
 *       gate            → gates/, scripts/*gate*.mjs, scripts/*lint*.mjs,
 *                         scripts/authenticated-approval.mjs, .github/workflows/
 *       process         → CLAUDE.md, DECISIONS.md, DIRECTIVES.md, QUESTIONS.md,
 *                         BACKLOG.md, docs/process/, docs/plans/, docs/sops/, wiki/
 *       infra           → scripts/, packages/, package.json, pnpm-*, turbo.json,
 *                         .github/, evolution/
 *       commerce        → shopify-agents/, packages/product-card/
 *       design.font     → packages/ui/, docs/design/
 *       design.color    → packages/ui/, docs/design/
 *       design.direction→ docs/design/, packages/ui/, any design-intake/ or design-review/ dir
 *       content.tagline → content/
 *       seo.keyword     → any STRATEGY.md, content/
 *       seo.sitemap     → any path containing "sitemap", any STRATEGY.md
 *     Heuristics are deliberately generous — an extra informational line is
 *     cheap; a missed governing record is the R2 failure this tool prevents.
 *
 * House rules: dependency-free (node stdlib only), control probes run before
 * the real store so a validator that "always passes" is caught in the same
 * run (merge-continuity-lint.mjs convention); rule g — this tool only ever
 * ADDS findings, never suppresses one.
 * Tested in scripts/test/decisions-index.test.js.
 */

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve, dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const GLOBAL_DIR = "decisions";
export const LAUNCHES_DIR = "launches";
export const INDEX_FILE = "decisions/index.json";

export const TYPES = new Set([
  "design.font", "design.color", "design.direction",
  "content.tagline", "seo.keyword", "seo.sitemap",
  "gate", "infra", "commerce", "process",
]);
export const STATUSES = new Set(["proposed", "accepted", "rejected", "superseded"]);
export const CONFIDENCES = new Set(["low", "medium", "high"]);
export const TRUST_TIERS = new Set([
  "owner_ruling", "repo_artifact", "external_verified", "external_unverified",
]);
/** id = D-YYYYMMDD-<kebab slug>; slug starts with a letter so ids can never
 *  collide with DECISIONS.md bare-number ruling ids (README format law). */
export const ID_RE = /^D-(\d{8})-([a-z][a-z0-9]*(?:-[a-z0-9]+)*)$/;
export const DATE_IST_RE = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2}) IST$/;
export const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
export const SECTIONS = [
  "## Context", "## Drivers", "## Options considered",
  "## Outcome", "## Scientific rationale", "## Consequences",
];
/** The only frontmatter fields an accepted record may legally change
 *  (the supersession flip — README immutability law). */
export const MUTABLE_FM_KEYS = new Set(["status", "superseded_by"]);

const sha256 = (s) => "sha256:" + createHash("sha256").update(s, "utf8").digest("hex");
const normEOL = (s) => String(s).replace(/\r\n?/g, "\n");

export const isRealDay = (s) => {
  if (!DAY_RE.test(s)) return false;
  const d = new Date(s + "T00:00:00Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
};

/* ───────────────────────── parsing ───────────────────────── */

/**
 * Parse one record file (narrow YAML frontmatter + markdown body).
 * Returns { rec, errors } — rec is null when the envelope is unusable.
 */
export function parseRecord(content, relFile) {
  const errors = [];
  const src = normEOL(content);
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { rec: null, errors: [`${relFile}: no frontmatter block (--- ... ---)`] };
  const [, fmText, body] = m;

  const fm = {};
  const sources = [];
  const governs = [];
  let listKey = null; // "sources" (object items) | "governs" (scalar items)
  let cur = null;
  for (const raw of fmText.split("\n")) {
    if (!raw.trim() || raw.trim().startsWith("#")) continue;
    const indent = raw.length - raw.trimStart().length;
    const line = raw.trim();
    if (indent === 0) {
      listKey = null;
      cur = null;
      const kv = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
      if (!kv) { errors.push(`${relFile}: unparseable frontmatter line: ${line}`); continue; }
      const [, key, valRaw] = kv;
      if ((key === "sources" || key === "governs") && valRaw === "") { listKey = key; continue; }
      fm[key] = unquote(valRaw);
    } else if (listKey === "governs") {
      if (line.startsWith("- ")) governs.push(unquote(line.slice(2)));
      else errors.push(`${relFile}: unparseable governs line: ${line}`);
    } else if (listKey === "sources") {
      if (line.startsWith("- ")) {
        cur = {};
        sources.push(cur);
        const kv = line.slice(2).match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
        if (kv) cur[kv[1]] = unquote(kv[2]);
        else errors.push(`${relFile}: unparseable source item line: ${line}`);
      } else if (cur) {
        const kv = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
        if (kv) cur[kv[1]] = unquote(kv[2]);
        else errors.push(`${relFile}: unparseable source field line: ${line}`);
      } else {
        errors.push(`${relFile}: source field before any "- " item: ${line}`);
      }
    } else {
      errors.push(`${relFile}: unexpected indented frontmatter line: ${line}`);
    }
  }
  fm.sources = sources;
  fm.governs = governs;

  const titleMatch = body.match(/^#\s+(.+)$/m);
  const rec = {
    file: relFile,
    fm,
    body,
    title: titleMatch ? titleMatch[1].trim() : null,
    content_sha256: sha256(src),
    immutable_sha256: immutableHash(src),
  };
  return { rec, errors };
}

function unquote(v) {
  const t = String(v).trim();
  if (t === "" || t === "null" || t === "~") return null;
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'")))
    return t.slice(1, -1).replace(/\\"/g, '"');
  return t;
}

/**
 * Hash of the record with the two legally-mutable frontmatter fields removed
 * (top-level `status:` / `superseded_by:` lines inside the frontmatter only).
 * This is the hash the immutability law compares.
 */
export function immutableHash(content) {
  const src = normEOL(content);
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return sha256(src);
  const kept = m[1]
    .split("\n")
    .filter((l) => !/^(status|superseded_by):/.test(l))
    .join("\n");
  return sha256("---\n" + kept + "\n---\n" + m[2]);
}

/* ───────────────────────── collection ───────────────────────── */

/** All record files, repo-relative, global + site-scoped. */
export function collectRecordFiles(root = REPO_ROOT) {
  const files = [];
  const globalDir = join(root, GLOBAL_DIR);
  if (existsSync(globalDir)) {
    for (const f of readdirSync(globalDir)) if (/^D-.*\.md$/.test(f)) files.push(`${GLOBAL_DIR}/${f}`);
  }
  const launches = join(root, LAUNCHES_DIR);
  if (existsSync(launches)) {
    for (const domain of readdirSync(launches, { withFileTypes: true })) {
      if (!domain.isDirectory()) continue;
      const dDir = join(launches, domain.name, "decisions");
      if (!existsSync(dDir)) continue;
      for (const f of readdirSync(dDir)) if (/^D-.*\.md$/.test(f)) files.push(`${LAUNCHES_DIR}/${domain.name}/decisions/${f}`);
    }
  }
  return files.sort();
}

export function loadRecords(root = REPO_ROOT) {
  const errors = [];
  const records = [];
  for (const rel of collectRecordFiles(root)) {
    const { rec, errors: e } = parseRecord(readFileSync(join(root, rel), "utf8"), rel);
    errors.push(...e);
    if (rec) records.push(rec);
  }
  return { records, errors };
}

/* ───────────────────────── validation ───────────────────────── */

export function lintRecords(records) {
  const errors = [];
  const byId = new Map();

  for (const r of records) {
    const f = r.file;
    const fm = r.fm;
    const id = fm.id;

    if (!id) { errors.push(`${f}: missing id`); continue; }
    if (byId.has(id)) errors.push(`${f}: duplicate id ${id} (also in ${byId.get(id).file})`);
    else byId.set(id, r);

    if (basename(f, ".md") !== id) errors.push(`${f}: filename must equal id (${id}.md)`);
    const idm = String(id).match(ID_RE);
    if (!idm) errors.push(`${f}: id "${id}" does not match D-YYYYMMDD-<kebab-slug> (slug starts with a letter)`);

    if (!fm.type || !TYPES.has(fm.type)) errors.push(`${f}: type "${fm.type}" not in enum [${[...TYPES].join(", ")}]`);
    if (!fm.status || !STATUSES.has(fm.status)) errors.push(`${f}: status "${fm.status}" not in enum [${[...STATUSES].join(", ")}]`);
    if (!fm.confidence || !CONFIDENCES.has(fm.confidence)) errors.push(`${f}: confidence "${fm.confidence}" not in enum [${[...CONFIDENCES].join(", ")}]`);

    const dm = String(fm.date ?? "").match(DATE_IST_RE);
    if (!dm) errors.push(`${f}: date "${fm.date}" is not IST to the second (YYYY-MM-DD HH:MM:SS IST)`);
    else {
      if (!isRealDay(`${dm[1]}-${dm[2]}-${dm[3]}`) || Number(dm[4]) > 23 || Number(dm[5]) > 59 || Number(dm[6]) > 59)
        errors.push(`${f}: date "${fm.date}" is not a real calendar date-time`);
      if (idm && `${dm[1]}${dm[2]}${dm[3]}` !== idm[1])
        errors.push(`${f}: id date ${idm[1]} disagrees with frontmatter date ${dm[1]}-${dm[2]}-${dm[3]}`);
    }

    for (const key of ["deciders", "expected_outcome"])
      if (!fm[key] || !String(fm[key]).trim()) errors.push(`${f}: missing/empty ${key}`);

    for (const [i, g] of (fm.governs ?? []).entries())
      if (!g || !String(g).trim()) errors.push(`${f}: governs[${i}] is empty`);

    if (!Array.isArray(fm.sources) || fm.sources.length === 0) errors.push(`${f}: sources must be a non-empty list`);
    else fm.sources.forEach((s, i) => {
      if (!s.ref || !String(s.ref).trim()) errors.push(`${f}: sources[${i}] missing ref`);
      if (!s.trust_tier || !TRUST_TIERS.has(s.trust_tier)) errors.push(`${f}: sources[${i}] trust_tier "${s.trust_tier}" not in enum [${[...TRUST_TIERS].join(", ")}]`);
      if (!s.retrieved || !isRealDay(String(s.retrieved))) errors.push(`${f}: sources[${i}] retrieved "${s.retrieved}" is not a real YYYY-MM-DD date`);
    });

    if (!r.title) errors.push(`${f}: body has no "# <title>" line`);
    let pos = -1;
    for (const h of SECTIONS) {
      const at = r.body.indexOf(`\n${h}\n`);
      if (at === -1) errors.push(`${f}: missing body section "${h}"`);
      else if (at < pos) errors.push(`${f}: section "${h}" out of order (required order: ${SECTIONS.join(" → ")})`);
      else pos = at;
    }
  }

  // supersedes / superseded_by linkage — both ways.
  for (const r of records) {
    const f = r.file, fm = r.fm, id = fm.id;
    if (fm.supersedes) {
      if (fm.supersedes === id) errors.push(`${f}: record supersedes itself`);
      const target = byId.get(fm.supersedes);
      if (!target) errors.push(`${f}: supersedes ${fm.supersedes} — no such record`);
      else if (fm.status === "accepted" || fm.status === "superseded") {
        if (target.fm.status !== "superseded")
          errors.push(`${f}: supersedes ${fm.supersedes} but its status is "${target.fm.status}" — the superseded record must flip to status: superseded with a superseded_by backlink (both linked)`);
        if (target.fm.superseded_by !== id)
          errors.push(`${f}: supersedes ${fm.supersedes} but that record's superseded_by is "${target.fm.superseded_by}" (backlink missing)`);
      }
    }
    if (fm.superseded_by) {
      if (fm.status !== "superseded") errors.push(`${f}: has superseded_by but status is "${fm.status}" (must be superseded)`);
      const heir = byId.get(fm.superseded_by);
      if (!heir) errors.push(`${f}: superseded_by ${fm.superseded_by} — no such record`);
      else if (heir.fm.supersedes !== id) errors.push(`${f}: superseded_by ${fm.superseded_by} but that record's supersedes is "${heir.fm.supersedes}" (forward link missing)`);
    } else if (fm.status === "superseded") {
      errors.push(`${f}: status superseded without a superseded_by backlink`);
    }
  }

  // cycle detection on the supersedes chain.
  for (const r of records) {
    const seen = new Set();
    let cur = r;
    while (cur && cur.fm.supersedes) {
      if (seen.has(cur.fm.id)) { errors.push(`${r.file}: cyclic supersedes chain via ${cur.fm.id}`); break; }
      seen.add(cur.fm.id);
      cur = byId.get(cur.fm.supersedes);
    }
  }

  return errors;
}

/* ───────────────────────── immutability ───────────────────────── */

/**
 * Compare current records against the stored index (the hash ledger).
 * priorIndex: the parsed committed decisions/index.json (array), or null.
 */
export function checkImmutability(records, priorIndex) {
  const errors = [];
  if (!Array.isArray(priorIndex)) return errors; // first build — nothing entered history yet
  const byId = new Map(records.map((r) => [r.fm.id, r]));
  for (const prev of priorIndex) {
    if (prev.status !== "accepted" && prev.status !== "superseded") continue; // proposed/rejected stay editable
    const now = byId.get(prev.id);
    if (!now) { errors.push(`IMMUTABILITY: ${prev.id} was ${prev.status} in the stored index and is now MISSING — accepted records are never deleted`); continue; }
    if (prev.immutable_sha256 && now.immutable_sha256 !== prev.immutable_sha256)
      errors.push(`IMMUTABILITY: ${now.file} — content of ${prev.status} record ${prev.id} changed vs stored hash. An accepted record is immutable: change = a NEW record with supersedes: ${prev.id}`);
    const s = now.fm.status;
    if (prev.status === "accepted" && s !== "accepted" && s !== "superseded")
      errors.push(`IMMUTABILITY: ${now.file} — accepted record ${prev.id} flipped to "${s}"; the only legal flip is accepted → superseded (with a linked superseding record)`);
    if (prev.status === "superseded" && s !== "superseded")
      errors.push(`IMMUTABILITY: ${now.file} — superseded record ${prev.id} flipped to "${s}"; superseded is terminal`);
  }
  return errors;
}

/**
 * BASE TRUST: resolve the PRIOR index from the merge base of baseRef and HEAD
 * (`git show <merge-base>:decisions/index.json`) — the ledger the PR cannot
 * have rewritten. Returns exactly one of:
 *   { mergeBase, baseIndex }                    — base-trust established
 *   { mergeBase, baseIndex: null, bootstrap }   — index absent at base (store new in this PR)
 *   { mergeBase|null, baseIndex: null, error }  — fail closed (unresolvable base / corrupt base index)
 */
export function resolveBaseIndex({ baseRef, root = REPO_ROOT }) {
  // stderr piped, not inherited: a missing path at base is an EXPECTED probe
  // outcome (bootstrap), not something to spray "fatal:" over the CI log.
  const git = (args) => execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  let mergeBase = null;
  const candidates = [baseRef, "origin/main", "main"].filter((b) => b && !/^0{7,}$/.test(b));
  for (const c of candidates) {
    try { mergeBase = git(["merge-base", c, "HEAD"]); break; } catch { /* try the next */ }
  }
  if (!mergeBase) {
    return { mergeBase: null, baseIndex: null, error: `cannot resolve a merge base to trust (tried: ${candidates.join(", ") || "nothing"}). The gate refuses to guess, because guessing means passing.` };
  }
  let text = null;
  try { text = git(["show", `${mergeBase}:${INDEX_FILE}`]); }
  catch { return { mergeBase, baseIndex: null, bootstrap: true }; }
  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error("not an array");
    return { mergeBase, baseIndex: parsed };
  } catch {
    return { mergeBase, baseIndex: null, error: `${INDEX_FILE} EXISTS at merge base ${mergeBase} but is not a valid JSON array — that is corruption, not a bootstrap; base-trust FAILS CLOSED.` };
  }
}

/* ───────────────────────── index build ───────────────────────── */

export function buildIndex(records) {
  return records
    .map((r) => ({
      id: r.fm.id,
      type: r.fm.type,
      status: r.fm.status,
      date: r.fm.date,
      title: r.title,
      file: r.file,
      supersedes: r.fm.supersedes ?? null,
      superseded_by: r.fm.superseded_by ?? null,
      content_sha256: r.content_sha256,
      immutable_sha256: r.immutable_sha256,
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export const serializeIndex = (index) => JSON.stringify(index, null, 2) + "\n";

/* ───────────────────────── Decision Guardian ───────────────────────── */

const TYPE_PATHS = {
  gate: [/^gates\//, /^scripts\/[^/]*gate[^/]*\.mjs$/, /^scripts\/[^/]*lint[^/]*\.mjs$/, /^scripts\/authenticated-approval\.mjs$/, /^\.github\/workflows\//],
  process: [/^CLAUDE\.md$/, /^DECISIONS\.md$/, /^DIRECTIVES\.md$/, /^QUESTIONS\.md$/, /^BACKLOG\.md$/, /^docs\/process\//, /^docs\/plans\//, /^docs\/sops\//, /^wiki\//],
  infra: [/^scripts\//, /^packages\//, /^package\.json$/, /^pnpm-(lock|workspace)\.yaml$/, /^turbo\.json$/, /^\.github\//, /^evolution\//],
  commerce: [/^shopify-agents\//, /^packages\/product-card\//],
  "design.font": [/^packages\/ui\//, /^docs\/design\//],
  "design.color": [/^packages\/ui\//, /^docs\/design\//],
  "design.direction": [/^docs\/design\//, /^packages\/ui\//, /(^|\/)design-intake\//, /(^|\/)design-review\//],
  "content.tagline": [/^content\//],
  "seo.keyword": [/(^|\/)STRATEGY\.md$/, /^content\//],
  "seo.sitemap": [/sitemap/i, /(^|\/)STRATEGY\.md$/],
};

const SITE_RE = /^launches\/([^/]+)\/decisions\/D-.*\.md$/;
const isDecisionRecord = (f) => /(^decisions\/|\/decisions\/)D-.*\.md$/.test(f);

/** [{file, id, title}] — which records govern which touched files. */
export function guardianFindings(records, touchedFiles) {
  const findings = [];
  for (const f of touchedFiles) {
    if (isDecisionRecord(f)) continue;
    for (const r of records) {
      const siteM = r.file.match(SITE_RE);
      let governs = false;
      if (Array.isArray(r.fm.governs) && r.fm.governs.length > 0) {
        // explicit governs list REPLACES the heuristic (precision channel)
        governs = r.fm.governs.some((p) => f === p || f.startsWith(p.endsWith("/") ? p : p + "/"));
      } else if (siteM) {
        const d = siteM[1];
        governs = f.startsWith(`launches/${d}/`) || f.startsWith(`sites/${d}/`);
      } else {
        governs = (TYPE_PATHS[r.fm.type] ?? []).some((re) => re.test(f));
      }
      if (governs) findings.push({ file: f, id: r.fm.id, title: r.title ?? "" });
    }
  }
  return findings;
}

export function diffFiles(baseSha, root = REPO_ROOT) {
  const out = execFileSync("git", ["diff", "--name-only", `${baseSha}...HEAD`], {
    cwd: root, encoding: "utf8",
  });
  return out.split("\n").map((s) => s.trim()).filter(Boolean);
}

/* ───────────────────────── control probes ───────────────────────── */

export const PROBE_GOOD = `---
id: D-20260719-probe-good
type: process
status: accepted
date: "2026-07-19 12:00:00 IST"
deciders: "probe"
expected_outcome: "probe outcome"
confidence: high
sources:
  - ref: "probe ref"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
---

# Probe decision

## Context
x
## Drivers
x
## Options considered
x
## Outcome
x
## Scientific rationale
x
## Consequences
x
`;

/** Prove every detector class is alive; [] = all probes pass. */
export function runControlProbes() {
  const fails = [];
  const good = parseRecord(PROBE_GOOD, "decisions/D-20260719-probe-good.md");
  if (good.errors.length || lintRecords([good.rec]).length)
    fails.push("control probe: known-GOOD record did not lint clean");

  const bad = parseRecord(PROBE_GOOD.replace("type: process", "type: vibes"), "decisions/D-20260719-probe-good.md");
  if (!lintRecords([bad.rec]).some((e) => e.includes("not in enum")))
    fails.push("control probe: bad type NOT caught");

  const dateless = parseRecord(PROBE_GOOD.replace('date: "2026-07-19 12:00:00 IST"', 'date: "2026-07-19"'), "decisions/D-20260719-probe-good.md");
  if (!lintRecords([dateless.rec]).some((e) => e.includes("IST to the second")))
    fails.push("control probe: date-only timestamp NOT caught");

  const tampered = parseRecord(PROBE_GOOD.replace("probe outcome", "edited outcome"), "decisions/D-20260719-probe-good.md");
  const prior = buildIndex([good.rec]);
  if (!checkImmutability([tampered.rec], prior).some((e) => e.includes("IMMUTABILITY")))
    fails.push("control probe: mutated accepted record NOT caught");
  if (checkImmutability([good.rec], prior).length)
    fails.push("control probe: untouched accepted record wrongly flagged");
  return fails;
}

/* ───────────────────────── main ───────────────────────── */

function main(argv) {
  const args = argv.slice(2);

  if (args[0] === "guardian") {
    const at = args.indexOf("--base");
    const base = at !== -1 ? args[at + 1] : null;
    if (!base) { console.error("usage: decisions-index.mjs guardian --base <sha>"); return 2; }
    const { records, errors } = loadRecords();
    for (const e of errors) console.error(`guardian note (record parse): ${e}`);
    let touched;
    try { touched = diffFiles(base); }
    catch (e) { console.error(`guardian: git diff failed for base ${base}: ${e.message}`); return 2; }
    const findings = guardianFindings(records, touched);
    if (findings.length === 0) console.log(`Decision Guardian: no decision records govern the ${touched.length} touched file(s).`);
    for (const g of findings) console.log(`you are touching ${g.file} — ${g.id} governs (${g.title})`);
    console.log("Decision Guardian is informational — the Guardian informs, the owner rules. exit 0");
    return 0;
  }

  const check = args.includes("--check");
  const rootAt = args.indexOf("--root");
  const root = rootAt !== -1 ? resolve(args[rootAt + 1]) : REPO_ROOT;
  const baseAt = args.indexOf("--base");
  const baseRef = baseAt !== -1 ? args[baseAt + 1] : (process.env.BASE || "");

  const probeFails = runControlProbes();
  const { records, errors } = loadRecords(root);
  errors.push(...lintRecords(records));

  const indexPath = join(root, INDEX_FILE);
  let prior = null;
  if (existsSync(indexPath)) {
    try { prior = JSON.parse(readFileSync(indexPath, "utf8")); }
    catch { errors.push(`${INDEX_FILE}: exists but is not valid JSON`); }
  }
  errors.push(...checkImmutability(records, prior));
  errors.unshift(...probeFails);

  const fresh = serializeIndex(buildIndex(records));

  if (check) {
    if (!existsSync(indexPath)) errors.push(`${INDEX_FILE} missing — run: node scripts/decisions-index.mjs`);
    else if (readFileSync(indexPath, "utf8") !== fresh) errors.push(`${INDEX_FILE} STALE — records changed; run: node scripts/decisions-index.mjs`);

    // BASE TRUST — compare CURRENT records against the ledger at the merge
    // base, which this PR cannot have rewritten (see header). The working-tree
    // comparison above still runs; base-trust only ADDS findings (rule g).
    if (baseRef) {
      const bt = resolveBaseIndex({ baseRef, root });
      if (bt.error) {
        errors.push(`BASE-TRUST: ${bt.error}`);
      } else if (bt.bootstrap) {
        console.log(
          `BASE-TRUST UNAVAILABLE — ${INDEX_FILE} does not exist at merge base ${bt.mergeBase.slice(0, 12)}: ` +
          `the store is NEW in this PR (bootstrap). Immutability is checked against the WORKING TREE ONLY this run — ` +
          `fail-closed would break the very PR that mints the store (the authenticated-approval bootstrap posture). ` +
          `From the next PR on, base-trust binds automatically.`);
      } else {
        errors.push(...checkImmutability(records, bt.baseIndex)
          .map((e) => `BASE-TRUST(@${bt.mergeBase.slice(0, 12)}): ${e}`));
        console.log(`base-trust: current records verified against ${INDEX_FILE} @ merge base ${bt.mergeBase.slice(0, 12)} (${bt.baseIndex.length} base row(s)).`);
      }
    } else {
      console.log(
        `base-trust: no BASE provided — local mode compares against the working-tree ${INDEX_FILE} only. ` +
        `CI enforces base-trust (BASE env / --base <ref>): a same-commit edit+reindex passes locally but FAILS there.`);
    }
  }

  if (errors.length) {
    for (const e of errors) console.error(`FAIL ${e}`);
    console.error(`decisions-index: ${errors.length} finding(s) across ${records.length} record(s).`);
    return 1;
  }

  if (!check) {
    writeFileSync(indexPath, fresh);
    console.log(`decisions-index: OK — ${records.length} record(s) valid, immutability clean, wrote ${INDEX_FILE}`);
  } else {
    console.log(`decisions-index --check: OK — ${records.length} record(s) valid, index up to date, no mutated accepted records`);
  }
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(main(process.argv));
}
