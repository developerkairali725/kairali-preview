#!/usr/bin/env node
/**
 * merge-continuity-lint.mjs — the machine proof that the OS v2 merge loses nothing.
 *
 * WHY THIS EXISTS. External review pass 1 (plan §12, gpt-5.6-sol blocking
 * finding #1): the merge plan's §4 gate-continuity table is a MANUAL assertion
 * — a human wrote "verbatim" next to each v1 rule and nothing checks it. The
 * adopted fix is M0(b): every normative CLAUDE.md unit, every gates/registry.yaml
 * row, and every adopted package obligation becomes a ROW in
 * docs/process/os-2026/merge/merge-continuity.yaml, and THIS lint makes the
 * claims machine-checked:
 *
 *   1. schema — every row carries source_id, source_file, old_text,
 *      old_text_hash, new_home, dimensions, trigger, enforcement,
 *      evidence_path (nullable), approver, test, status; missing/empty fails;
 *   2. hash integrity — old_text_hash === sha256 of whitespace-normalized
 *      old_text: a silently edited quote fails;
 *   3. presence — a CLAUDE.md row's old_text must appear VERBATIM (whitespace-
 *      normalized) in CLAUDE.md: a rule that was "mapped" but no longer exists
 *      in the source, or was paraphrased into the mapping, fails;
 *   4. source drift — meta.source_hashes pins CLAUDE.md and gates/registry.yaml;
 *      if either file changes, the lint fails until the continuity file is
 *      re-verified against the delta (an unmapped NEW rule is the miss this
 *      whole mechanism exists to prevent);
 *   5. registry coverage — every gate id in gates/registry.yaml has EXACTLY ONE
 *      GR row (registry_id), and no GR row points at a gate that doesn't exist;
 *   6. conflicts — the same source text mapped to two different new_homes fails
 *      (one obligation, one home); duplicate source_ids fail;
 *   7. pending standards — status: pending_author is legal ONLY for the seven
 *      00_SHARED_STANDARDS rows (new_home under docs/process/os-2026/standards/)
 *      and is REPORTED every run; `--strict` (the M1 deploy mode) fails while
 *      any pending_author row remains or any file-like new_home is absent;
 *   8. strict-residue allowlist (M1) — docs/process/os-2026/merge/
 *      strict-residues.yaml names the residues that LEGITIMATELY remain at
 *      --strict because the plan schedules their file for M2/M3. An
 *      allowlisted residue prints as a LOUD "ALLOWED (M2/M3)" line and does
 *      not fail; a residue NOT allowlisted fails exactly as before; an
 *      allowlist entry whose file EXISTS is itself a failure ("stale
 *      allowlist row — remove it"). pending_author rows are never
 *      allowlistable (rule 7 stays supreme). Rule g: the allowlist declares
 *      WHEN a mechanism lands, never weakens WHAT the row obliges.
 *   8b. ENFORCED EXPIRY (external review pass 2, gpt-5.6-sol BLOCKING finding:
 *      "no supplied evidence shows review_by expiry is enforced") — review_by
 *      is a hard deadline, not a note. Every allowlist entry must carry a
 *      strict YYYY-MM-DD review_by; a missing/malformed date FAILS (an
 *      unparseable expiry counts as already expired — fail-closed). Once the
 *      system date passes review_by, --strict FAILS: "residue EXPIRED —
 *      rebuild or owner re-ruling required; extending review_by is a doctrine
 *      change". An expired or malformed entry excuses NOTHING: its residue
 *      also fails exactly as if it were never allowlisted. Clock = system
 *      date (this is a repo script; CI runs it fresh every time).
 *      "Unauthorized extension / new residue needs owner approval" is
 *      enforced UPSTREAM, not reimplemented here: strict-residues.yaml lives
 *      under docs/process/os-2026/merge/, which the authenticated-approval
 *      GUARDED list covers (scripts/authenticated-approval.mjs) — any PR that
 *      adds an entry or moves a review_by date requires an owner-identity,
 *      hash-bound GitHub approval before it can merge.
 *
 * House rules honored: dependency-free narrow-YAML subset (like
 * gate-registry-lint.mjs); control probes run before the real file so a lint
 * that "always passes" is caught in the same run; exit 1 on any finding.
 *
 * Modes:
 *   node scripts/merge-continuity-lint.mjs            # lint (pre-M1 mode)
 *   node scripts/merge-continuity-lint.mjs --strict   # M1 deploy mode (reads the allowlist)
 *   node scripts/merge-continuity-lint.mjs --write    # fill null hashes +
 *                                                     # meta.source_hashes, rewrite canonically
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseRegistry, REGISTRY } from "./gate-registry-lint.mjs";
export { REGISTRY };

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const CONTINUITY = "docs/process/os-2026/merge/merge-continuity.yaml";
export const STRICT_RESIDUES = "docs/process/os-2026/merge/strict-residues.yaml";
export const PINNED_SOURCES = ["CLAUDE.md", REGISTRY];

export const STATUSES = new Set([
  "verbatim", "relocated", "strengthened", // CLAUDE.md rows (plan §4 vocabulary)
  "adopted", "constrained", "neutralized", // package rows (plan §§2,3,9)
  "pending_author",                        // the seven shared standards (plan §3.6)
  "rejected", "deferred",                  // exclusion-register seed (plan §8)
]);
export const ID_RE = /^(CM|GR|PKG|STD|REJ|DEF)-\d{3}$/;
export const REQUIRED = [
  "source_id", "source_file", "old_text", "new_home", "dimensions",
  "trigger", "enforcement", "approver", "test", "status",
];
const STANDARDS_HOME_RE = /docs\/process\/os-2026\/standards\//;

/** Whitespace-normalize: any run of whitespace = one space, trimmed. */
export const normalize = (s) => String(s).replace(/\s+/g, " ").trim();

/** Strict YYYY-MM-DD, and a REAL calendar date (2026-13-45 is not a date). */
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const isValidDate = (s) => {
  const t = String(s ?? "").trim();
  if (!DATE_RE.test(t)) return false;
  const d = new Date(t + "T00:00:00Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === t;
};
/** Today in the machine's LOCAL calendar (IST on the fleet boxes), YYYY-MM-DD. */
export const todayISO = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const hashOf = (s) => "sha256:" + createHash("sha256").update(normalize(s), "utf8").digest("hex");
export const fileHash = (buf) => "sha256:" + createHash("sha256").update(buf).digest("hex");

/* ────────────────────────── narrow-YAML parser ────────────────────────── */

const unquote = (v) => {
  const t = v.trim();
  if (t === "null" || t === "~" || t === "") return null;
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'")))
    return t.slice(1, -1).replace(/\\"/g, '"');
  return t;
};

const parseInlineList = (v, errors, ln) => {
  const t = v.trim();
  if (!t.startsWith("[") || !t.endsWith("]")) {
    errors.push(`line ${ln}: dimensions must be an inline list [a, b]`);
    return [];
  }
  return t.slice(1, -1).split(",").map((x) => unquote(x)).filter((x) => x != null && x !== "");
};

/**
 * Parse the continuity file's deliberately narrow grammar:
 *   version: 1
 *   meta:            (single-line scalars; source_hashes: nested map of file: hash)
 *   rows:            list items opened by "- source_id:"; single-line fields;
 *                    old_text may be a |- block scalar.
 * Any line outside the grammar is an error, never silently skipped.
 */
export function parseContinuity(text) {
  const errors = [];
  const doc = { version: null, meta: {}, rows: [] };
  const lines = text.split("\n");
  let section = null;         // "meta" | "rows" | null
  let inSourceHashes = false;
  let row = null;
  let block = null;           // { key, indent, lines } while in a block scalar

  const endBlock = () => {
    if (block && row) row[block.key] = block.lines.join("\n");
    block = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const ln = i + 1;
    if (block) {
      if (raw.trim() === "" || /^\s*$/.test(raw)) { block.lines.push(""); continue; }
      const indent = raw.match(/^ */)[0].length;
      if (indent >= block.indent) { block.lines.push(raw.slice(block.indent)); continue; }
      endBlock();
    }
    if (/^\s*(#|$)/.test(raw)) continue;

    let m;
    if ((m = raw.match(/^version:\s*(\S+)/))) { doc.version = Number(m[1]); section = null; continue; }
    if (/^meta:\s*$/.test(raw)) { section = "meta"; inSourceHashes = false; continue; }
    if (/^rows:\s*$/.test(raw)) { section = "rows"; row = null; continue; }

    if (section === "meta") {
      if ((m = raw.match(/^  source_hashes:\s*$/))) { inSourceHashes = true; doc.meta.source_hashes = {}; continue; }
      if (inSourceHashes && (m = raw.match(/^    ([^:]+):\s*(.+)$/))) {
        doc.meta.source_hashes[unquote(m[1])] = unquote(m[2]); continue;
      }
      if ((m = raw.match(/^  (\w+):\s*(.*)$/))) { inSourceHashes = false; doc.meta[m[1]] = unquote(m[2]); continue; }
      errors.push(`line ${ln}: unparseable meta line: ${raw.trim()}`); continue;
    }

    if (section === "rows") {
      if ((m = raw.match(/^  - source_id:\s*(.+)$/))) {
        row = { source_id: unquote(m[1]) }; doc.rows.push(row); continue;
      }
      if (!row) { errors.push(`line ${ln}: row field before first "- source_id:"`); continue; }
      if ((m = raw.match(/^    (\w+):\s*\|-?\s*$/))) {
        block = { key: m[1], indent: 6, lines: [] }; continue;
      }
      if ((m = raw.match(/^    dimensions:\s*(.+)$/))) {
        row.dimensions = parseInlineList(m[1], errors, ln); continue;
      }
      if ((m = raw.match(/^    also_carried_by:\s*(.+)$/))) {
        row.also_carried_by = parseInlineList(m[1], errors, ln); continue;
      }
      if ((m = raw.match(/^    (\w+):\s*(.*)$/))) { row[m[1]] = unquote(m[2]); continue; }
      errors.push(`line ${ln}: unparseable row line: ${raw.trim()}`); continue;
    }

    errors.push(`line ${ln}: unexpected top-level line: ${raw.trim()}`);
  }
  endBlock();
  return { doc, errors };
}

/**
 * Parse the strict-residue allowlist's deliberately narrow grammar (rule 8):
 *   version: 1
 *   meta:       single-line scalars
 *   residues:   list items opened by "- path:"; rows is an inline list;
 *               milestone (M2|M3), reason, review_by are single-line scalars.
 * Any line outside the grammar is an error, never silently skipped.
 */
export function parseStrictResidues(text) {
  const errors = [];
  const doc = { version: null, meta: {}, residues: [] };
  const lines = text.split("\n");
  let section = null;
  let entry = null;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const ln = i + 1;
    if (/^\s*(#|$)/.test(raw)) continue;
    let m;
    if ((m = raw.match(/^version:\s*(\S+)/))) { doc.version = Number(m[1]); section = null; continue; }
    if (/^meta:\s*$/.test(raw)) { section = "meta"; continue; }
    if (/^residues:\s*$/.test(raw)) { section = "residues"; entry = null; continue; }
    if (section === "meta") {
      if ((m = raw.match(/^  (\w+):\s*(.*)$/))) { doc.meta[m[1]] = unquote(m[2]); continue; }
      errors.push(`strict-residues line ${ln}: unparseable meta line: ${raw.trim()}`); continue;
    }
    if (section === "residues") {
      if ((m = raw.match(/^  - path:\s*(.+)$/))) { entry = { path: unquote(m[1]), rows: [] }; doc.residues.push(entry); continue; }
      if (!entry) { errors.push(`strict-residues line ${ln}: field before first "- path:"`); continue; }
      if ((m = raw.match(/^    rows:\s*(.+)$/))) {
        const t = m[1].trim();
        if (t.startsWith("[") && t.endsWith("]"))
          entry.rows = t.slice(1, -1).split(",").map((x) => unquote(x)).filter((x) => x != null && x !== "");
        else errors.push(`strict-residues line ${ln}: rows must be an inline list [CM-001, …]`);
        continue;
      }
      if ((m = raw.match(/^    (\w+):\s*(.*)$/))) { entry[m[1]] = unquote(m[2]); continue; }
      errors.push(`strict-residues line ${ln}: unparseable residue line: ${raw.trim()}`); continue;
    }
    errors.push(`strict-residues line ${ln}: unexpected top-level line: ${raw.trim()}`);
  }
  if (doc.version !== 1) errors.push(`strict-residues: version must be 1 (got ${doc.version})`);
  const seenPaths = new Set();
  for (const e of doc.residues) {
    if (!e.path) { errors.push("strict-residues: entry missing path"); continue; }
    if (seenPaths.has(e.path)) errors.push(`strict-residues ${e.path}: duplicate path entry`);
    seenPaths.add(e.path);
    if (!e.rows?.length) errors.push(`strict-residues ${e.path}: rows must list at least one continuity row id`);
    for (const id of e.rows ?? []) if (!ID_RE.test(id)) errors.push(`strict-residues ${e.path}: bad row id "${id}"`);
    if (!/^M[23]$/.test(e.milestone ?? "")) errors.push(`strict-residues ${e.path}: milestone must be M2 or M3 (got ${e.milestone ?? "nothing"})`);
    for (const f of ["reason", "review_by"])
      if (e[f] == null || String(e[f]).trim() === "") errors.push(`strict-residues ${e.path}: missing/empty ${f}`);
    // 8b. review_by must be a strict, real YYYY-MM-DD date — anything else
    // cannot be expiry-checked and therefore fails at parse time too.
    if (e.review_by != null && String(e.review_by).trim() !== "" && !isValidDate(e.review_by))
      errors.push(`strict-residues ${e.path}: review_by "${e.review_by}" is not a valid YYYY-MM-DD date`);
  }
  return { doc, errors };
}

/** Canonical serializer — the only writer of the continuity file. */
export function serialize(doc) {
  const q = (v) => (v == null ? "null" : `"${String(v).replace(/"/g, '\\"')}"`);
  const out = [];
  out.push("# merge-continuity.yaml — MACHINE PROOF of OS v2 merge continuity (M0(b)).");
  out.push("# GENERATED + hand-verified rows; canonical writer: scripts/merge-continuity-lint.mjs --write.");
  out.push("# Every normative CLAUDE.md unit (CM-*), every registry gate (GR-*), every adopted");
  out.push("# package obligation (PKG-*), the seven pending standards (STD-*), and the exclusion");
  out.push("# register seed (REJ-*/DEF-*). Validated by scripts/merge-continuity-lint.mjs (CI).");
  out.push(`version: ${doc.version}`);
  out.push("meta:");
  for (const [k, v] of Object.entries(doc.meta)) {
    if (k === "source_hashes") continue;
    out.push(`  ${k}: ${q(v)}`);
  }
  out.push("  source_hashes:");
  for (const [f, h] of Object.entries(doc.meta.source_hashes ?? {})) out.push(`    ${f}: ${q(h)}`);
  out.push("rows:");
  for (const r of doc.rows) {
    out.push(`  - source_id: ${r.source_id}`);
    out.push(`    source_file: ${q(r.source_file)}`);
    if (r.registry_id != null) out.push(`    registry_id: ${r.registry_id}`);
    out.push("    old_text: |-");
    for (const l of String(r.old_text ?? "").split("\n")) out.push(l === "" ? "" : `      ${l}`);
    out.push(`    old_text_hash: ${q(r.old_text_hash)}`);
    out.push(`    new_home: ${q(r.new_home)}`);
    out.push(`    dimensions: [${(r.dimensions ?? []).join(", ")}]`);
    if (r.also_carried_by?.length) out.push(`    also_carried_by: [${r.also_carried_by.join(", ")}]`);
    out.push(`    trigger: ${q(r.trigger)}`);
    out.push(`    enforcement: ${q(r.enforcement)}`);
    out.push(`    evidence_path: ${q(r.evidence_path)}`);
    out.push(`    approver: ${q(r.approver)}`);
    out.push(`    test: ${q(r.test)}`);
    out.push(`    status: ${r.status}`);
  }
  return out.join("\n") + "\n";
}

/* ────────────────────────────── the lint ─────────────────────────────── */

/**
 * @param doc parsed continuity document
 * @param opts { strict, sources: {path: normalizedText}, sourceHashes: {path: hash},
 *               registryIds: Set<string>, exists: (path)=>bool,
 *               allow: residue-allowlist entries [{path, rows, milestone, reason, review_by}] (strict mode),
 *               today: YYYY-MM-DD clock override (tests only; defaults to the system date) }
 * @returns { errors: string[], pending: row[], allowed: [{id, path, milestone, reason, review_by}] }
 */
export function lint(doc, opts) {
  const errors = [];
  const pending = [];
  const allowed = [];
  const allowByPath = new Map();
  const today = opts.today ?? todayISO();
  // Entries whose expiry is past or unparseable excuse NOTHING (rule 8b,
  // fail-closed): their residues fail exactly as if never allowlisted.
  const deadAllow = new Set();
  for (const e of opts.allow ?? []) {
    allowByPath.set(e.path, e);
    // Stale allowlist row: the file it excuses now EXISTS — the excuse must go
    // (the allowlist can only shrink truthfully, never rot).
    if (opts.exists(e.path))
      errors.push(`strict allowlist: stale allowlist row — ${e.path} EXISTS on disk; remove its entry from ${STRICT_RESIDUES}`);
    // 8b. ENFORCED EXPIRY: review_by is a hard deadline. Malformed = expired.
    const rb = String(e.review_by ?? "").trim();
    if (!isValidDate(rb)) {
      deadAllow.add(e.path);
      errors.push(`strict allowlist: ${e.path} review_by "${e.review_by}" is not a valid YYYY-MM-DD date — an unparseable expiry counts as expired (fail-closed)`);
    } else if (rb < today) {
      deadAllow.add(e.path);
      errors.push(`strict allowlist: ${e.path} residue EXPIRED (review_by ${rb} < today ${today}) — rebuild or owner re-ruling required; extending review_by is a doctrine change (owner-approved PR; ${STRICT_RESIDUES} is under authenticated-approval guard)`);
    }
  }
  if (doc.version !== 1) errors.push(`version must be 1 (got ${doc.version})`);
  if (!doc.meta?.generated) errors.push("meta.generated missing");
  if (!doc.rows?.length) errors.push("no rows");

  // 4. source drift
  for (const f of PINNED_SOURCES) {
    const pinned = doc.meta?.source_hashes?.[f];
    if (!pinned) errors.push(`meta.source_hashes missing pin for ${f}`);
    else if (opts.sourceHashes[f] && pinned !== opts.sourceHashes[f])
      errors.push(`SOURCE DRIFT: ${f} changed since continuity was generated — ` +
        `re-verify the delta against the rows, then refresh the pin (--write)`);
  }

  const seenIds = new Set();
  const homeByHash = new Map();
  const grByRegistryId = new Map();

  for (const r of doc.rows) {
    const id = r.source_id ?? "(missing id)";
    // 1. schema
    for (const f of REQUIRED) {
      const v = r[f];
      if (v == null || (Array.isArray(v) ? v.length === 0 : String(v).trim() === ""))
        errors.push(`${id}: missing/empty field ${f}`);
    }
    if (!("evidence_path" in r)) errors.push(`${id}: evidence_path missing (null is fine, absent is not)`);
    if (r.source_id && !ID_RE.test(r.source_id)) errors.push(`${id}: bad source_id format`);
    if (r.status && !STATUSES.has(r.status)) errors.push(`${id}: unknown status "${r.status}"`);
    if (seenIds.has(r.source_id)) errors.push(`${id}: duplicate source_id`);
    seenIds.add(r.source_id);

    // 2. hash integrity
    if (r.old_text != null && r.old_text_hash != null && r.old_text_hash !== hashOf(r.old_text))
      errors.push(`${id}: old_text_hash does not match old_text (quote edited without re-hash?)`);
    if (r.old_text_hash == null && !opts.write) errors.push(`${id}: old_text_hash is null (run --write)`);

    // 3. presence (CLAUDE.md rows) + source_file existence (all rows).
    // source_file = "<path> [annotation]" — the first token is the checked
    // path; anything after it is provenance detail (§ refs), kept not checked.
    const sf = String(r.source_file ?? "").split(/\s/)[0];
    if (r.source_file && !opts.exists(sf))
      errors.push(`${id}: source_file does not exist: ${sf}`);
    if (sf === "CLAUDE.md" && r.old_text != null) {
      if (!opts.sources["CLAUDE.md"].includes(normalize(r.old_text)))
        errors.push(`${id}: old_text NOT FOUND verbatim in CLAUDE.md — paraphrase or vanished rule`);
    }

    // 5. registry rows
    if (r.source_id?.startsWith("GR-")) {
      if (!r.registry_id) errors.push(`${id}: GR row missing registry_id`);
      else {
        if (grByRegistryId.has(r.registry_id)) errors.push(`${id}: duplicate GR row for gate ${r.registry_id}`);
        grByRegistryId.set(r.registry_id, r);
        if (!opts.registryIds.has(r.registry_id))
          errors.push(`${id}: registry_id "${r.registry_id}" not in ${REGISTRY}`);
      }
    }

    // 6. conflicts: one source text, one home
    if (r.old_text_hash != null) {
      const prev = homeByHash.get(r.old_text_hash);
      if (prev && prev.new_home !== r.new_home)
        errors.push(`${id}: same old_text as ${prev.source_id} but different new_home — one obligation, one home`);
      if (!prev) homeByHash.set(r.old_text_hash, r);
    }

    // 6b. also_carried_by — a standard may CARRY an obligation whose home is
    // elsewhere (plan §3.6 mapping); entries must name real standard files
    for (const t of r.also_carried_by ?? []) {
      if (!/^docs\/process\/os-2026\/standards\/[A-Z0-9_]+\.md$/.test(t))
        errors.push(`${id}: also_carried_by entry is not a canonical standard path: ${t}`);
    }

    // 7. pending standards
    if (r.status === "pending_author") {
      pending.push(r);
      if (!STANDARDS_HOME_RE.test(r.new_home ?? ""))
        errors.push(`${id}: pending_author is legal only for docs/process/os-2026/standards/ homes`);
    }
    if (opts.strict) {
      if (r.status === "pending_author" && !opts.exists(relHome(r.new_home)))
        errors.push(`${id}: STRICT: standard not authored yet (${r.new_home})`);
      const home = relHome(r.new_home);
      if (home && /\.(md|yaml|mjs|js|json)$/.test(home) && !opts.exists(home)) {
        const a = allowByPath.get(home);
        // Allowlisted residue (rule 8): reported LOUDLY, never fatal.
        // pending_author rows are NEVER allowlistable — rule 7 stays supreme.
        // An expired/malformed entry (deadAllow, rule 8b) excuses nothing.
        if (a && !deadAllow.has(home) && a.rows.includes(r.source_id) && r.status !== "pending_author")
          allowed.push({ id: r.source_id, path: home, milestone: a.milestone, reason: a.reason, review_by: a.review_by });
        else
          errors.push(`${id}: STRICT: new_home file does not exist: ${home}`);
      }
    }
  }

  for (const gid of opts.registryIds)
    if (!grByRegistryId.has(gid))
      errors.push(`registry gate "${gid}" has NO continuity row — an undecided absence (add GR row)`);

  return { errors, pending, allowed };
}

/** Extract a repo-relative path from a new_home string, if it names one. */
export const relHome = (home) => {
  const m = String(home ?? "").match(/(?:^|[\s(])((?:docs|gates|scripts|launches|evolution|decisions)\/[^\s):,]+)/);
  return m ? m[1] : null;
};

/* ─────────────────────────── control probes ──────────────────────────── */

export const PROBE_GOOD = `version: 1
meta:
  generated: "2026-07-19 00:00:00 IST"
  source_hashes:
    CLAUDE.md: "PIN"
    ${REGISTRY}: "PIN"
rows:
  - source_id: CM-001
    source_file: CLAUDE.md
    old_text: |-
      Never write to production.
    old_text_hash: ${hashOf("Never write to production.")}
    new_home: "CLAUDE.md v2 HARD GATES"
    dimensions: [all]
    trigger: "every push"
    enforcement: "staging-only deploy targets"
    evidence_path: null
    approver: "owner"
    test: "MANUAL"
    status: verbatim
  - source_id: GR-001
    source_file: ${REGISTRY}
    registry_id: probe-gate
    old_text: |-
      probe gate
    old_text_hash: ${hashOf("probe gate")}
    new_home: "gates/registry.yaml (unchanged)"
    dimensions: [all]
    trigger: "per PR"
    enforcement: "CI"
    evidence_path: null
    approver: "CI"
    test: "scripts/test/gate-registry-lint.test.js"
    status: verbatim
`;

export function runControlProbes() {
  const probeOpts = {
    strict: false, write: false,
    sources: { "CLAUDE.md": "Never write to production." },
    sourceHashes: { "CLAUDE.md": "PIN", [REGISTRY]: "PIN" },
    registryIds: new Set(["probe-gate"]),
    exists: () => true,
  };
  const good = parseContinuity(PROBE_GOOD);
  if (good.errors.length || lint(good.doc, probeOpts).errors.length)
    return ["CONTROL PROBE FAILURE: known-good probe did not pass — the lint is broken"];
  const badHash = PROBE_GOOD.replace(/old_text_hash: sha256:[0-9a-f]+\n(\s+new_home: "CLAUDE)/, "old_text_hash: \"sha256:0000\"\n$1");
  const b1 = parseContinuity(badHash);
  if (!lint(b1.doc, probeOpts).errors.some((e) => e.includes("does not match")))
    return ["CONTROL PROBE FAILURE: edited-hash probe was not caught"];
  const badText = PROBE_GOOD.replace("Never write to production.\n    old_text_hash",
    "Always write to production.\n    old_text_hash");
  const b2 = parseContinuity(badText);
  if (!lint(b2.doc, probeOpts).errors.some((e) => e.includes("NOT FOUND") || e.includes("does not match")))
    return ["CONTROL PROBE FAILURE: paraphrased-quote probe was not caught"];
  const b3 = lint(good.doc, { ...probeOpts, registryIds: new Set(["probe-gate", "uncovered-gate"]) });
  if (!b3.errors.some((e) => e.includes("NO continuity row")))
    return ["CONTROL PROBE FAILURE: uncovered-registry-gate probe was not caught"];
  // 8b probes: an expired residue entry must be caught; a malformed review_by
  // must be caught; a future-dated entry must NOT be flagged by either.
  const probeAllow = (review_by) => [{ path: "ghost/probe.md", rows: ["CM-001"], milestone: "M2", reason: "probe", review_by }];
  const b4 = lint(good.doc, { ...probeOpts, exists: () => false, allow: probeAllow("2020-01-01"), today: "2026-01-01" });
  if (!b4.errors.some((e) => e.includes("EXPIRED")))
    return ["CONTROL PROBE FAILURE: expired-residue probe was not caught"];
  const b5 = lint(good.doc, { ...probeOpts, exists: () => false, allow: probeAllow("someday"), today: "2026-01-01" });
  if (!b5.errors.some((e) => e.includes("not a valid YYYY-MM-DD")))
    return ["CONTROL PROBE FAILURE: malformed-review_by probe was not caught"];
  const g2 = lint(good.doc, { ...probeOpts, exists: () => false, allow: probeAllow("2027-01-01"), today: "2026-01-01" });
  if (g2.errors.some((e) => e.includes("EXPIRED") || e.includes("not a valid YYYY-MM-DD")))
    return ["CONTROL PROBE FAILURE: future-dated residue entry was wrongly flagged"];
  return [];
}

/* ────────────────────────────── main ─────────────────────────────────── */

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const strict = process.argv.includes("--strict");
  const write = process.argv.includes("--write");

  const probeErrors = runControlProbes();
  if (probeErrors.length) { for (const e of probeErrors) console.error("✗ " + e); process.exit(1); }

  const contPath = resolve(REPO_ROOT, CONTINUITY);
  if (!existsSync(contPath)) { console.error(`✗ ${CONTINUITY} not found`); process.exit(1); }
  const { doc, errors: parseErrors } = parseContinuity(readFileSync(contPath, "utf8"));

  const sources = {}; const sourceHashes = {};
  for (const f of PINNED_SOURCES) {
    const buf = readFileSync(resolve(REPO_ROOT, f));
    sources[f] = normalize(buf.toString("utf8"));
    sourceHashes[f] = fileHash(buf);
  }
  const reg = parseRegistry(readFileSync(resolve(REPO_ROOT, REGISTRY), "utf8"));
  const registryIds = new Set(reg.gates.map((g) => g.id));

  if (write) {
    let filled = 0;
    for (const r of doc.rows) if (r.old_text_hash == null && r.old_text != null) { r.old_text_hash = hashOf(r.old_text); filled++; }
    doc.meta.source_hashes = sourceHashes;
    writeFileSync(contPath, serialize(doc));
    console.log(`--write: filled ${filled} hash(es), pinned ${PINNED_SOURCES.length} source(s), canonicalized.`);
  }

  const exists = (p) => existsSync(resolve(REPO_ROOT, p));

  // Strict-residue allowlist (rule 8) — read ONLY in --strict, where it binds.
  let allow = [];
  let residueParseErrors = [];
  if (strict) {
    const resPath = resolve(REPO_ROOT, STRICT_RESIDUES);
    if (existsSync(resPath)) {
      const parsed = parseStrictResidues(readFileSync(resPath, "utf8"));
      residueParseErrors = parsed.errors;
      allow = parsed.doc.residues;
    }
  }

  const { errors, pending, allowed } = lint(doc, { strict, write, sources, sourceHashes, registryIds, exists, allow });
  const all = [...parseErrors.map((e) => `parse: ${e}`), ...residueParseErrors.map((e) => `parse: ${e}`), ...errors];

  const byPrefix = {};
  for (const r of doc.rows) { const p = (r.source_id ?? "??").slice(0, 3); byPrefix[p] = (byPrefix[p] ?? 0) + 1; }
  console.log(`merge-continuity: ${doc.rows.length} rows (${Object.entries(byPrefix).map(([k, v]) => `${k}${v}`).join(" · ")}) · registry ${registryIds.size} gates`);
  if (pending.length)
    console.log(`  ⏳ ${pending.length} standard(s) PENDING_AUTHOR (GPT lane, D-20260719-11): ${pending.map((r) => r.source_id).join(", ")}${strict ? "" : " — will BLOCK at M1 --strict"}`);
  for (const a of allowed)
    console.log(`  ⚠ ALLOWED (${a.milestone}): ${a.id} — ${a.path} does not exist yet (${a.reason}; review_by ${a.review_by}) [${STRICT_RESIDUES}]`);

  if (all.length) {
    for (const e of all) console.error("  ✗ " + e);
    console.error(`✗ merge-continuity-lint: ${all.length} finding(s)`);
    process.exit(1);
  }
  console.log(`✓ merge-continuity-lint PASS${strict ? " (strict)" : ""} — continuity machine-proven`);
}
