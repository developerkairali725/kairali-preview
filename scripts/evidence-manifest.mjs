#!/usr/bin/env node
/**
 * evidence-manifest.mjs — SHA-256 manifests on every evidence bundle
 * (EVIDENCE LAW v2, CLAUDE.md §3 · plan §2.5 · M2 mechanism; clears strict
 * residues PKG-020/PKG-077 in docs/process/os-2026/merge/strict-residues.yaml).
 *
 * WHY THIS EXISTS. v1's evidence law is "if it isn't in the repo, it didn't
 * happen". v2 adds the package's rigor: every evidence bundle under
 * launches/<domain>/ carries a manifest.json listing every file with its
 * SHA-256 hash and byte size, so evidence cannot be silently edited after the
 * fact and evidence outside the manifest is VISIBLE as a finding. This is the
 * port of the package's two stdlib-only Python utilities (archive_artifact.py
 * writer + validate_project_evidence.py validator, PKG-077) into the repo's
 * uniform Node toolchain, extended with the §4 manifest fields the shipped
 * Python omits (collected_at_utc, run_id, producer — PKG-020/PKG-021).
 *
 * THE ONE CORRECTION MODEL (external review adoption, M2 PR — the same law
 * binds write mode AND ci mode; there is no second model):
 *
 *   manifest entries are APPEND-ONLY everywhere: a correction is a NEW file under a versioned name + an appended entry with a strictly newer run-id; the superseded entry stays and may gain superseded_by — the one legal mutation (EVIDENCE LAW v2, plan §2.5)
 *
 * (One deliberately long line: it is the CORRECTION_LAW constant verbatim, so
 * `grep -c` proves the header and every refusal/finding state the SAME model.)
 *
 * THE LAWS THIS SCRIPT ENFORCES (doctrine: CLAUDE.md "EVIDENCE LAW v2"):
 *
 *   · ENTRIES ARE APPEND-ONLY — WRITE MODE. An existing manifested file may
 *     NEVER change or disappear: write mode REFUSES when any manifested
 *     file's bytes differ on disk or a manifested file is missing. The only
 *     legal write is an ADDITION — new files, appended as new entries under a
 *     strictly newer run-id (monotonic <YYYY-MM-DD>-r<N>). To correct
 *     evidence: add the corrected content as a NEW file (versioned name,
 *     e.g. raw/report-v2.txt), append its entry, and optionally mark the
 *     superseded entry with superseded_by via --supersedes old=new. The
 *     superseded entry (and its file) stays forever.
 *   · ENTRIES ARE APPEND-ONLY — CI MODE (EV-4). Every ADDED or MODIFIED
 *     manifest in the PR diff gets FULL verification of its bundle dir at
 *     HEAD (schema incl. producer + per-entry run-ids, every hash matches
 *     disk, no unmanifested files); a MODIFIED manifest must additionally
 *     prove every base entry survives byte-identical (superseded_by gain is
 *     the one legal mutation) under a strictly greater run-id. Any touched
 *     file inside a HEAD-manifested bundle triggers that bundle's full
 *     verification too — a new malformed manifest, a false hash, or a
 *     smuggled unmanifested file cannot pass, and a documented correction
 *     (new file + appended entry) passes by construction.
 *   · DUAL TIMESTAMP. IST to the second remains canonical (`generated`);
 *     machine records carry the dual `collected_at_utc` field. Registers
 *     never fork on timezone again.
 *   · INVISIBLE EVIDENCE IS A FINDING. verify fails on any file in the
 *     bundle dir that the manifest does not list — evidence outside the
 *     manifest is invisible evidence, and invisible evidence is no evidence.
 *   · POINTER-ONLY LOG ROWS (M0(a) disposition 10, M2 format rule). Log and
 *     register rows that cite evidence are POINTERS — ref + hash + timestamp
 *     — never copies of the evidence itself.
 *   · ONE BUNDLE PER CHANGE (M0(a) disposition 11, M2 format rule). Each
 *     change gets ONE evidence bundle; every consumer (state machine row,
 *     registry output, report) references it by path + manifest hash. Two
 *     bundles for one change is drift by construction.
 *   · PRODUCER IDENTITY (EX-3 verifier separation). Every manifest records
 *     producer: {session, role: builder|verifier}. The builder's manifest can
 *     never also be the verifier's sign-off — role separation enforcement
 *     matures at M4; the field is MANDATORY now so M4 has data to bind to.
 *
 * BUNDLE ROOT LAW: in-repo bundles must live under launches/<domain>/ (the
 * evidence root, §2.5 — the package's clients/{id}/ tree is rejected).
 * Directories OUTSIDE the repo are permitted so test fixtures can exercise
 * the mechanism in tmp dirs.
 *
 * House rules honored: dependency-free (node stdlib only); control probes run
 * before the real work so a validator that "always passes" is caught in the
 * same run (merge-continuity-lint.mjs style); git is invoked via execFileSync
 * arg arrays with BASE from flag/env — never shell-interpolated (front-gate
 * injection doctrine); exit 1 on any finding/refusal, exit 2 on usage error.
 *
 * Modes:
 *   node scripts/evidence-manifest.mjs write <dir> --session <id> --role builder|verifier [--run-id <YYYY-MM-DD-rN>] [--supersedes <oldPath>=<newPath>]
 *   node scripts/evidence-manifest.mjs verify <dir>
 *   node scripts/evidence-manifest.mjs ci [--base <sha>]   # BASE env honored; CI append-only law (EV-4)
 */

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, lstatSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { istNow } from "./launch-scaffold.mjs";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const MANIFEST = "manifest.json";
export const MANIFEST_VERSION = 1;
export const RUN_ID_RE = /^(\d{4})-(\d{2})-(\d{2})-r([1-9]\d*)$/;
export const ROLES = new Set(["builder", "verifier"]);
export const SHA_RE = /^[0-9a-f]{64}$/;
export const IST_RE = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} IST$/;
/** macOS Finder droppings are not evidence; everything else in the dir is. */
export const IGNORED_BASENAMES = new Set([".DS_Store"]);

/**
 * THE ONE CORRECTION MODEL — quoted VERBATIM in every refusal and finding
 * that enforces it, and in the header above. One law, one sentence, stated
 * identically everywhere (external review blocker: the write model and the
 * CI model must be the SAME model).
 */
export const CORRECTION_LAW =
  "manifest entries are APPEND-ONLY everywhere: a correction is a NEW file under a versioned name + an appended entry with a strictly newer run-id; the superseded entry stays and may gain superseded_by — the one legal mutation (EVIDENCE LAW v2, plan §2.5)";

export const DOCTRINE_LINE =
  "corrections = a NEW run-id, never overwrite (EVIDENCE LAW v2, plan §2.5)";

export const sha256Hex = (buf) => createHash("sha256").update(buf).digest("hex");

/* ────────────────────────────── run-ids ──────────────────────────────── */

/** Parse <YYYY-MM-DD>-r<N> → {date, n} or null. */
export function parseRunId(id) {
  const m = RUN_ID_RE.exec(String(id ?? "").trim());
  if (!m) return null;
  const date = `${m[1]}-${m[2]}-${m[3]}`;
  const d = new Date(date + "T00:00:00Z");
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== date) return null;
  return { date, n: Number(m[4]) };
}

/** Strict monotonic order: b sorts after a (dates first, then rN numerically). */
export function runIdGreater(b, a) {
  const pb = parseRunId(b);
  const pa = parseRunId(a);
  if (!pb || !pa) return false;
  if (pb.date !== pa.date) return pb.date > pa.date;
  return pb.n > pa.n;
}

/**
 * Derive the next monotonic run-id after prev for today's IST date.
 * Returns null when prev's date is in the FUTURE (clock skew / tampering —
 * fail closed; a derived id must always sort strictly after prev).
 */
export function deriveRunId(prev, today = istNow().slice(0, 10)) {
  if (prev == null) return `${today}-r1`;
  const p = parseRunId(prev);
  if (!p) return null;
  if (p.date < today) return `${today}-r1`;
  if (p.date === today) return `${p.date}-r${p.n + 1}`;
  return null;
}

/* ─────────────────────────── bundle walking ──────────────────────────── */

/**
 * Walk a bundle dir; return { files: sorted repo-style POSIX relative paths
 * (root manifest.json + ignored basenames excluded), odd: non-regular entries
 * (symlinks etc. — evidence must be plain files, fail closed) }.
 */
export function walkBundle(dir) {
  const files = [];
  const odd = [];
  const recur = (abs, rel) => {
    for (const ent of readdirSync(abs, { withFileTypes: true })) {
      const childAbs = join(abs, ent.name);
      const childRel = rel ? `${rel}/${ent.name}` : ent.name;
      if (IGNORED_BASENAMES.has(ent.name)) continue;
      const st = lstatSync(childAbs);
      if (st.isSymbolicLink()) { odd.push(childRel); continue; }
      if (st.isDirectory()) { recur(childAbs, childRel); continue; }
      if (!st.isFile()) { odd.push(childRel); continue; }
      if (childRel === MANIFEST) continue; // the manifest never manifests itself
      files.push(childRel);
    }
  };
  recur(dir, "");
  files.sort();
  odd.sort();
  return { files, odd };
}

/** Hash + size every walked file: [{path, sha256, bytes}] sorted by path. */
export function snapshotBundle(dir) {
  const { files, odd } = walkBundle(dir);
  return {
    entries: files.map((p) => {
      const buf = readFileSync(join(dir, ...p.split("/")));
      return { path: p, sha256: sha256Hex(buf), bytes: buf.length };
    }),
    odd,
  };
}

/* ─────────────────────────── manifest build ──────────────────────────── */

/** The canonical manifest object (dual timestamp per EVIDENCE LAW v2). */
export function buildManifest({ entries, runId, producer, now = new Date() }) {
  return {
    version: MANIFEST_VERSION,
    generated: istNow(now),
    collected_at_utc: now.toISOString().replace(/\.\d{3}Z$/, "Z"),
    run_id: runId,
    producer: { session: producer.session, role: producer.role },
    files: entries,
  };
}

/**
 * The write decision, pure (probe-able): given the existing manifest (or
 * null), the fresh disk snapshot entries, the caller's requested run-id
 * (optional) and supersedes map {oldPath: newPath} (optional), decide
 * { refusal } or { runId, unchanged, files }.
 *
 * APPEND-ONLY: existing entries are carried over BYTE-IDENTICAL (the only
 * legal mutation is gaining superseded_by via the supersedes map); a changed
 * or deleted manifested file is a REFUSAL quoting CORRECTION_LAW; additions
 * are appended as entries carrying the strictly-newer run-id.
 */
export function planWrite({ existing, entries, requestedRunId, supersedes = {}, today }) {
  if (requestedRunId != null && !parseRunId(requestedRunId))
    return { refusal: `--run-id "${requestedRunId}" is not a valid <YYYY-MM-DD>-r<N> run-id` };

  if (existing == null) {
    if (Object.keys(supersedes).length)
      return { refusal: "--supersedes requires an existing manifest — there is nothing to supersede on a first write" };
    const runId = requestedRunId ?? deriveRunId(null, today);
    return { runId, unchanged: false, files: entries.map((e) => ({ ...e, run_id: runId })) };
  }

  if (!parseRunId(existing.run_id) || !Array.isArray(existing.files))
    return { refusal: `existing ${MANIFEST} is invalid/unreadable — fail closed: cannot prove append vs rewrite; fix or remove it under owner review` };

  // append-only survival check: every existing entry's file must be on disk, byte-identical
  const diskByPath = new Map(entries.map((e) => [e.path, e]));
  const deleted = [];
  const changed = [];
  for (const e of existing.files) {
    const d = diskByPath.get(e.path);
    if (!d) { deleted.push(e.path); continue; }
    if (d.sha256 !== e.sha256 || d.bytes !== e.bytes) changed.push(e.path);
  }
  if (deleted.length)
    return { refusal: `REFUSED: manifested file(s) missing from bundle: ${deleted.join(", ")} — ${CORRECTION_LAW}` };
  if (changed.length)
    return { refusal: `REFUSED: manifested file(s) changed on disk: ${changed.join(", ")} — ${CORRECTION_LAW}` };

  const existingPaths = new Set(existing.files.map((e) => e.path));
  const additions = entries.filter((e) => !existingPaths.has(e.path));
  const addPaths = new Set(additions.map((e) => e.path));

  // supersedes: the one legal mutation — set once, and the corrector must be
  // a file ADDED in this very run (a correction is a new versioned file)
  const byPath = new Map(existing.files.map((e) => [e.path, e]));
  for (const [oldP, newP] of Object.entries(supersedes)) {
    const old = byPath.get(oldP);
    if (!old)
      return { refusal: `--supersedes: "${oldP}" is not an entry in the existing ${MANIFEST}` };
    if (old.superseded_by != null)
      return { refusal: `--supersedes: entry "${oldP}" is already superseded by "${old.superseded_by}" — superseded_by is set once; ${CORRECTION_LAW}` };
    if (!addPaths.has(newP))
      return { refusal: `--supersedes: "${newP}" is not among this run's ADDED files — ${CORRECTION_LAW}` };
  }

  if (!additions.length) {
    if (requestedRunId == null || requestedRunId === existing.run_id)
      return { runId: existing.run_id, unchanged: true, files: existing.files };
    return { refusal: `REFUSED: nothing to append — a run-id bump with no added files rewrites history for no reason; ${CORRECTION_LAW}` };
  }

  const runId = requestedRunId ?? deriveRunId(existing.run_id, today);
  if (runId == null || !runIdGreater(runId, existing.run_id))
    return { refusal: `REFUSED: run-id ${runId ?? "(underivable)"} does not sort strictly after ${existing.run_id} — run-ids are monotonic; ${DOCTRINE_LINE}` };

  const carried = existing.files.map((e) =>
    supersedes[e.path] ? { ...e, superseded_by: supersedes[e.path] } : e);
  return { runId, unchanged: false, files: [...carried, ...additions.map((e) => ({ ...e, run_id: runId }))] };
}

/** In-repo bundles must live under launches/<domain>/… (evidence root law). */
export function bundleDirCheck(absDir, repoRoot = REPO_ROOT) {
  const rel = relative(repoRoot, absDir);
  if (rel.startsWith("..") || rel === "") return null; // outside the repo: fixture territory
  const posix = rel.split(sep).join("/");
  if (!/^launches\/[^/]+\/.+/.test(posix))
    return `bundle dir must live under launches/<domain>/ (evidence root, EVIDENCE LAW v2 §2.5) — got ${posix}`;
  return null;
}

/**
 * WRITE mode: snapshot the dir, apply planWrite (append-only), persist
 * manifest.json. Returns { manifest, unchanged, refusal }.
 */
export function writeManifest(dir, { runId: requestedRunId, session, role, supersedes = {}, now = new Date() } = {}) {
  if (!session || String(session).trim() === "")
    return { refusal: "producer session is required (--session) — EX-3 producer identity is mandatory" };
  if (!ROLES.has(role))
    return { refusal: `producer role must be builder|verifier (--role) — got "${role ?? ""}"` };
  const dirErr = bundleDirCheck(resolve(dir));
  if (dirErr) return { refusal: dirErr };

  const { entries, odd } = snapshotBundle(dir);
  if (odd.length)
    return { refusal: `non-regular file(s) in bundle (evidence must be plain files): ${odd.join(", ")}` };

  const mPath = join(dir, MANIFEST);
  let existing = null;
  if (existsSync(mPath)) {
    try { existing = JSON.parse(readFileSync(mPath, "utf8")); }
    catch { return { refusal: `existing ${MANIFEST} is invalid/unreadable — fail closed: cannot prove append vs rewrite; fix or remove it under owner review` }; }
  }

  const plan = planWrite({ existing, entries, requestedRunId, supersedes, today: istNow(now).slice(0, 10) });
  if (plan.refusal) return { refusal: plan.refusal };
  if (plan.unchanged) return { manifest: existing, unchanged: true };

  const manifest = buildManifest({ entries: plan.files, runId: plan.runId, producer: { session, role }, now });
  writeFileSync(mPath, JSON.stringify(manifest, null, 2) + "\n");
  return { manifest, unchanged: false };
}

/* ─────────────────────────────── verify ──────────────────────────────── */

/** Schema findings for one manifest object (pure). */
export function validateManifest(m, label = MANIFEST) {
  const f = [];
  if (m == null || typeof m !== "object") return [`${label}: not a JSON object`];
  if (m.version !== MANIFEST_VERSION) f.push(`${label}: version must be ${MANIFEST_VERSION} (got ${m.version})`);
  if (!IST_RE.test(String(m.generated ?? ""))) f.push(`${label}: generated must be IST to the second ("YYYY-MM-DD HH:MM:SS IST")`);
  const utc = new Date(String(m.collected_at_utc ?? ""));
  if (!String(m.collected_at_utc ?? "").endsWith("Z") || Number.isNaN(utc.getTime()))
    f.push(`${label}: collected_at_utc must be an ISO-8601 UTC instant (dual-timestamp law)`);
  if (!parseRunId(m.run_id)) f.push(`${label}: run_id "${m.run_id}" is not <YYYY-MM-DD>-r<N>`);
  if (m.producer == null || typeof m.producer !== "object" || String(m.producer.session ?? "").trim() === "")
    f.push(`${label}: producer.session is required (EX-3 producer identity)`);
  if (!ROLES.has(m.producer?.role))
    f.push(`${label}: producer.role must be builder|verifier (EX-3 verifier separation)`);
  if (!Array.isArray(m.files)) { f.push(`${label}: files must be an array`); return f; }
  const seen = new Set();
  const allPaths = new Set(m.files.map((e) => String(e?.path ?? "")));
  const runIdByPath = new Map(m.files.map((e) => [String(e?.path ?? ""), e?.run_id]));
  for (const e of m.files) {
    const p = String(e?.path ?? "");
    if (p === "" || p.startsWith("/") || p.includes("\\") || p.split("/").some((s) => s === "" || s === "." || s === ".."))
      f.push(`${label}: bad file path "${p}" (relative, no traversal, POSIX separators)`);
    if (seen.has(p)) f.push(`${label}: duplicate file path "${p}"`);
    seen.add(p);
    if (!SHA_RE.test(String(e?.sha256 ?? ""))) f.push(`${label}: ${p}: sha256 must be 64 hex chars`);
    if (!Number.isInteger(e?.bytes) || e.bytes < 0) f.push(`${label}: ${p}: bytes must be a non-negative integer`);
    if (!parseRunId(e?.run_id))
      f.push(`${label}: ${p}: entry run_id "${e?.run_id}" is not <YYYY-MM-DD>-r<N> — every entry records the run that appended it (${CORRECTION_LAW})`);
    else if (runIdGreater(e.run_id, m.run_id))
      f.push(`${label}: ${p}: entry run_id ${e.run_id} sorts after the manifest run_id ${m.run_id} — entries can never come from the future`);
    if (e?.superseded_by != null) {
      const s = String(e.superseded_by);
      if (s === p) f.push(`${label}: ${p}: superseded_by points at itself`);
      else if (!allPaths.has(s)) f.push(`${label}: ${p}: superseded_by "${s}" is not an entry in this manifest — a correction is an APPENDED entry (${CORRECTION_LAW})`);
      else if (!runIdGreater(runIdByPath.get(s), e.run_id))
        f.push(`${label}: ${p}: superseding entry "${s}" (run ${runIdByPath.get(s)}) does not sort strictly after the superseded run ${e.run_id}`);
    }
  }
  return f;
}

/** Compare a manifest against actual entries (pure): tamper + invisible evidence. */
export function verifyFindings(manifest, actual) {
  const findings = validateManifest(manifest);
  const byPath = new Map((Array.isArray(manifest?.files) ? manifest.files : []).map((e) => [e.path, e]));
  const actualByPath = new Map(actual.map((e) => [e.path, e]));
  for (const [p, e] of byPath) {
    const a = actualByPath.get(p);
    if (!a) { findings.push(`manifested file MISSING: ${p}`); continue; }
    if (a.sha256 !== e.sha256) findings.push(`TAMPER: sha256 mismatch for ${p} (manifest ${e.sha256.slice(0, 12)}… ≠ disk ${a.sha256.slice(0, 12)}…)`);
    else if (a.bytes !== e.bytes) findings.push(`TAMPER: byte-size mismatch for ${p} (manifest ${e.bytes} ≠ disk ${a.bytes})`);
  }
  for (const p of actualByPath.keys())
    if (!byPath.has(p))
      findings.push(`unmanifested file: ${p} — evidence outside the manifest is invisible evidence`);
  return findings;
}

/** VERIFY mode: read manifest.json + walk the dir; findings[] (empty = pass). */
export function verifyBundle(dir) {
  const mPath = join(dir, MANIFEST);
  if (!existsSync(mPath)) return [`no ${MANIFEST} in ${dir} — an unmanifested bundle is invisible evidence`];
  let manifest;
  try { manifest = JSON.parse(readFileSync(mPath, "utf8")); }
  catch { return [`${MANIFEST} is not valid JSON`]; }
  const { entries, odd } = snapshotBundle(dir);
  const findings = verifyFindings(manifest, entries);
  for (const p of odd) findings.push(`non-regular file in bundle (evidence must be plain files): ${p}`);
  return findings;
}

/* ──────────────────────── CI append-only (EV-4) ──────────────────────── */

/**
 * Append-only comparison of a committed manifest vs its head rewrite (pure).
 * Every base entry must survive BYTE-IDENTICAL (path, sha256, bytes, run_id);
 * the one legal mutation is GAINING superseded_by (never changing it); any
 * change to the manifest requires a strictly greater run-id. This is the
 * same law planWrite enforces at write time — one model, two checkpoints.
 */
export function appendOnlyFindings(base, head, mPath) {
  const f = [];
  if (head == null || typeof head !== "object" || !Array.isArray(head.files))
    return [`${mPath}: modified ${MANIFEST} is unreadable/invalid — evidence is append-only, fail closed`];
  const headByPath = new Map(head.files.map((e) => [e.path, e]));
  for (const e of Array.isArray(base?.files) ? base.files : []) {
    const h = headByPath.get(e.path);
    if (!h) { f.push(`${mPath}: HISTORY REWRITE — manifest entry removed: ${e.path} (${CORRECTION_LAW})`); continue; }
    if (h.sha256 !== e.sha256 || h.bytes !== e.bytes || (h.run_id ?? null) !== (e.run_id ?? null))
      f.push(`${mPath}: HISTORY REWRITE — manifest entry changed: ${e.path} (${CORRECTION_LAW})`);
    else if (e.superseded_by != null && h.superseded_by !== e.superseded_by)
      f.push(`${mPath}: HISTORY REWRITE — superseded_by changed for ${e.path}: "${e.superseded_by}" → "${h.superseded_by}" (superseded_by is set once; ${CORRECTION_LAW})`);
  }
  if (!runIdGreater(head.run_id, base?.run_id))
    f.push(`${mPath}: manifest rewritten without a strictly greater run-id (${base?.run_id} → ${head.run_id}) — ${DOCTRINE_LINE}`);
  return f;
}

/** Is repo path p covered by the committed manifest at mPath? */
export const manifestCovers = (mPath, manifest, p) => {
  const dir = mPath.slice(0, -MANIFEST.length); // "launches/d/evidence/x/"
  if (!p.startsWith(dir)) return false;
  const rel = p.slice(dir.length);
  return Array.isArray(manifest?.files) && manifest.files.some((e) => e.path === rel);
};

/**
 * The EV-4 law, pure: changed = [{status: "A"|"M"|"D", path, oldPath?}],
 * baseManifests = Map<repoPath, parsed|null>, headManifestPaths =
 * Set<repoPath> of manifests present at HEAD, headRead(repoPath) → text|null,
 * verifyBundleAt(repoDirPrefix) → findings[] (full verification of that
 * bundle dir at HEAD). A rename counts as delete(oldPath) + add(path).
 *
 * TWO CHECKS, ONE MODEL:
 *   1. FULL VERIFICATION at HEAD of every bundle a changed path touches —
 *      ADDED bundles included (external review blocker: skipping status A
 *      let a new malformed manifest, false hashes, or unmanifested files
 *      through untested).
 *   2. Append-only survival vs base for anything base already manifested.
 */
export function ciFindings({ changed, baseManifests, headManifestPaths = new Set(), verifyBundleAt = () => [], headRead }) {
  const findings = [];
  const judged = [];
  for (const c of changed) {
    const status = c.status[0];
    if (status === "R") {
      judged.push({ status: "D", path: c.oldPath ?? c.path });
      judged.push({ status: "A", path: c.path });
      continue;
    }
    judged.push({ status, path: c.path });
  }

  // check 1 — full verification of every HEAD-manifested bundle the diff touches
  const headDirs = [...headManifestPaths].map((mp) => mp.slice(0, -MANIFEST.length));
  const verifySet = new Set();
  for (const { path: p } of judged) {
    if (!/^launches\//.test(p)) continue;
    let best = null;
    for (const d of headDirs)
      if (p.startsWith(d) && (best == null || d.length > best.length)) best = d;
    if (best != null) verifySet.add(best);
  }
  for (const d of [...verifySet].sort())
    for (const f of verifyBundleAt(d)) findings.push(`${d}: ${f}`);

  // check 2 — append-only survival vs base
  for (const { status, path: p } of judged) {
    if (!/^launches\//.test(p)) continue;
    if (baseManifests.has(p)) {
      // a committed manifest itself was touched
      if (status === "A") continue; // base had it, so A cannot occur; renames' A halves are judged by check 1
      if (status === "D") { findings.push(`${p}: committed ${MANIFEST} DELETED — evidence is append-only; ${DOCTRINE_LINE}`); continue; }
      const base = baseManifests.get(p);
      if (base == null) { findings.push(`${p}: committed ${MANIFEST} at base is unreadable — fail closed, fix under owner review`); continue; }
      let head = null;
      try { head = JSON.parse(headRead(p) ?? "null"); } catch { /* head stays null → finding */ }
      findings.push(...appendOnlyFindings(base, head, p));
      continue;
    }
    if (status === "A") continue; // new files are additions — check 1 already proved they are manifested + hash-true
    for (const [mPath, m] of baseManifests) {
      if (m != null && manifestCovers(mPath, m, p)) {
        findings.push(`${p}: ${status === "D" ? "DELETED" : "MODIFIED"} but matched by committed manifest ${mPath} — evidence is append-only (EV-4); ${DOCTRINE_LINE}`);
        break;
      }
    }
  }
  return findings;
}

/** git plumbing for CI mode: execFileSync arg arrays, never a shell string. */
export function collectCiFindings(root, baseRef) {
  const git = (args) => execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  let mergeBase = null;
  const candidates = [baseRef, "origin/main", "main"].filter((b) => b && !/^0{7,}$/.test(b));
  for (const c of candidates) {
    try { mergeBase = git(["merge-base", c, "HEAD"]).trim(); break; } catch { /* try the next */ }
  }
  if (!mergeBase)
    throw new Error(`cannot resolve a base commit to diff against (tried: ${candidates.join(", ") || "nothing"}). In CI pass --base <sha> (BASE env); the gate refuses to guess, because guessing means passing.`);

  const changed = git(["diff", "--name-status", "-M", mergeBase, "HEAD"]).trim()
    .split("\n").filter(Boolean).map((l) => {
      const [status, ...rest] = l.split("\t");
      return status[0] === "R"
        ? { status: "R", oldPath: rest[0], path: rest[1] }
        : { status: status[0], path: rest[rest.length - 1] };
    });

  const baseManifests = new Map();
  let baseTree = "";
  try { baseTree = git(["ls-tree", "-r", "--name-only", mergeBase, "--", "launches"]); } catch { /* no launches/ at base */ }
  for (const p of baseTree.split("\n").filter((l) => /(^|\/)manifest\.json$/.test(l))) {
    try { baseManifests.set(p, JSON.parse(git(["show", `${mergeBase}:${p}`]))); }
    catch { baseManifests.set(p, null); } // unreadable committed manifest → fail closed in ciFindings
  }

  // manifests present at HEAD — every one a changed path touches gets FULL
  // verification against the checked-out tree (CI checks out HEAD, so the
  // working tree IS the PR's proposed evidence state)
  let headTree = "";
  try { headTree = git(["ls-tree", "-r", "--name-only", "HEAD", "--", "launches"]); } catch { /* no launches/ at HEAD */ }
  const headManifestPaths = new Set(headTree.split("\n").filter((l) => /(^|\/)manifest\.json$/.test(l)));

  const headRead = (p) => {
    const abs = resolve(root, p);
    return existsSync(abs) ? readFileSync(abs, "utf8") : null;
  };
  const verifyBundleAt = (dirPrefix) => verifyBundle(resolve(root, dirPrefix));
  return ciFindings({ changed, baseManifests, headManifestPaths, verifyBundleAt, headRead });
}

/* ─────────────────────────── control probes ──────────────────────────── */

export function runControlProbes() {
  const now = new Date("2026-07-19T12:00:00Z");
  const entry = (p, body, runId = "2026-07-19-r1") =>
    ({ path: p, sha256: sha256Hex(Buffer.from(body)), bytes: Buffer.byteLength(body), run_id: runId });
  const A = entry("raw/a.txt", "alpha");
  const B = entry("raw/b.txt", "beta");
  const good = buildManifest({ entries: [A, B], runId: "2026-07-19-r1", producer: { session: "probe", role: "builder" }, now });

  // verify: known-good passes; tamper, missing and unmanifested are caught
  if (verifyFindings(good, [A, B]).length)
    return ["CONTROL PROBE FAILURE: known-good bundle did not verify clean — the validator is broken"];
  if (!verifyFindings(good, [A, entry("raw/b.txt", "tampered")]).some((e) => e.includes("TAMPER")))
    return ["CONTROL PROBE FAILURE: tampered-file probe was not caught"];
  if (!verifyFindings(good, [A]).some((e) => e.includes("MISSING")))
    return ["CONTROL PROBE FAILURE: missing-file probe was not caught"];
  if (!verifyFindings(good, [A, B, entry("raw/extra.txt", "x")]).some((e) => e.includes("unmanifested")))
    return ["CONTROL PROBE FAILURE: unmanifested-file probe was not caught"];

  // write plan: mutating a manifested file is refused under ANY run-id;
  // the documented correction (append a NEW versioned file + supersedes) passes
  const disk = (e) => ({ path: e.path, sha256: e.sha256, bytes: e.bytes });
  const p1 = planWrite({ existing: good, entries: [disk(A), disk(entry("raw/b.txt", "corrected"))], requestedRunId: "2026-07-19-r2", today: "2026-07-19" });
  if (!p1.refusal || !p1.refusal.includes(CORRECTION_LAW))
    return ["CONTROL PROBE FAILURE: in-place mutation probe was not refused with the correction law"];
  const corrected = [disk(A), disk(B), disk(entry("raw/b-v2.txt", "corrected"))];
  const p2 = planWrite({ existing: good, entries: corrected, requestedRunId: null, supersedes: { "raw/b.txt": "raw/b-v2.txt" }, today: "2026-07-19" });
  if (p2.refusal || p2.runId !== "2026-07-19-r2")
    return ["CONTROL PROBE FAILURE: documented correction (new versioned file + supersedes) was wrongly refused"];
  if (!p2.files.some((e) => e.path === "raw/b.txt" && e.superseded_by === "raw/b-v2.txt"))
    return ["CONTROL PROBE FAILURE: superseded entry did not gain superseded_by"];

  // append-only: preserved+appended+bumped passes; removed/changed entry fails;
  // gaining superseded_by is the one legal mutation
  const C = entry("raw/c.txt", "new", "2026-07-19-r2");
  const appended = { ...good, run_id: "2026-07-19-r2", files: [A, B, C] };
  if (appendOnlyFindings(good, appended, "m").length)
    return ["CONTROL PROBE FAILURE: honest append was wrongly flagged"];
  const gained = { ...good, run_id: "2026-07-19-r2", files: [A, { ...B, superseded_by: "raw/c.txt" }, C] };
  if (appendOnlyFindings(good, gained, "m").length)
    return ["CONTROL PROBE FAILURE: legal superseded_by gain was wrongly flagged"];
  const rewritten = { ...good, run_id: "2026-07-19-r2", files: [A, entry("raw/b.txt", "rewritten")] };
  if (!appendOnlyFindings(good, rewritten, "m").some((e) => e.includes("HISTORY REWRITE")))
    return ["CONTROL PROBE FAILURE: history-rewrite probe was not caught"];

  // CI law: modifying a manifested file fails; an ADDED manifest routes its
  // bundle through FULL verification (the status-A blind spot is closed);
  // an honest addition passes
  const baseManifests = new Map([["launches/x.com/evidence/run/manifest.json", good]]);
  const ciBad = ciFindings({ changed: [{ status: "M", path: "launches/x.com/evidence/run/raw/a.txt" }], baseManifests, headRead: () => null });
  if (!ciBad.some((e) => e.includes("append-only")))
    return ["CONTROL PROBE FAILURE: CI modified-evidence probe was not caught"];
  const newMp = "launches/y.com/evidence/run/manifest.json";
  const ciNewBundle = ciFindings({
    changed: [{ status: "A", path: newMp }],
    baseManifests: new Map(),
    headManifestPaths: new Set([newMp]),
    verifyBundleAt: () => ["TAMPER: probe"],
    headRead: () => null,
  });
  if (!ciNewBundle.some((e) => e.includes("TAMPER: probe")))
    return ["CONTROL PROBE FAILURE: CI added-manifest probe was NOT routed through full verification (status-A blind spot)"];
  const ciGood = ciFindings({
    changed: [{ status: "A", path: "launches/x.com/evidence/run/raw/new.txt" }],
    baseManifests,
    headManifestPaths: new Set(["launches/x.com/evidence/run/manifest.json"]),
    verifyBundleAt: () => [],
    headRead: () => null,
  });
  if (ciGood.length)
    return ["CONTROL PROBE FAILURE: CI clean-addition probe was wrongly flagged"];

  return [];
}

/* ────────────────────────────── main ─────────────────────────────────── */

const USAGE = `usage:
  node scripts/evidence-manifest.mjs write <dir> --session <id> --role builder|verifier [--run-id <YYYY-MM-DD-rN>] [--supersedes <oldPath>=<newPath>]
  node scripts/evidence-manifest.mjs verify <dir>
  node scripts/evidence-manifest.mjs ci [--base <sha>]   (BASE env honored)`;

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const argv = process.argv.slice(2);
  const flag = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : undefined; };
  const mode = argv[0];

  const probeErrors = runControlProbes();
  if (probeErrors.length) { for (const e of probeErrors) console.error("✗ " + e); process.exit(1); }

  if (mode === "write") {
    const dir = argv[1] && !argv[1].startsWith("--") ? argv[1] : null;
    if (!dir) { console.error(USAGE); process.exit(2); }
    const supersedes = {};
    const sup = flag("--supersedes");
    if (sup != null) {
      const eq = sup.indexOf("=");
      if (eq <= 0 || eq === sup.length - 1) { console.error(`✗ --supersedes wants <oldPath>=<newPath>, got "${sup}"\n` + USAGE); process.exit(2); }
      supersedes[sup.slice(0, eq)] = sup.slice(eq + 1);
    }
    const res = writeManifest(resolve(dir), { runId: flag("--run-id"), session: flag("--session"), role: flag("--role"), supersedes });
    if (res.refusal) { console.error("✗ evidence-manifest write: " + res.refusal); process.exit(1); }
    if (res.unchanged) console.log(`✓ evidence-manifest: unchanged — ${res.manifest.files.length} file(s) already manifested under run ${res.manifest.run_id}`);
    else console.log(`✓ evidence-manifest: wrote ${MANIFEST} — run ${res.manifest.run_id}, ${res.manifest.files.length} file(s), producer ${res.manifest.producer.role}:${res.manifest.producer.session}`);
    process.exit(0);
  }

  if (mode === "verify") {
    const dir = argv[1] && !argv[1].startsWith("--") ? argv[1] : null;
    if (!dir) { console.error(USAGE); process.exit(2); }
    const findings = verifyBundle(resolve(dir));
    if (findings.length) {
      for (const f of findings) console.error("  ✗ " + f);
      console.error(`✗ evidence-manifest verify: ${findings.length} finding(s)`);
      process.exit(1);
    }
    console.log("✓ evidence-manifest verify PASS — every file manifested, every hash matches");
    process.exit(0);
  }

  if (mode === "ci") {
    // BASE via flag or env, passed as an execFileSync argument — never
    // shell-interpolated (front-gate injection doctrine).
    const base = flag("--base") ?? process.env.BASE ?? "";
    const root = flag("--root") ?? REPO_ROOT;
    let findings;
    try { findings = collectCiFindings(resolve(root), base); }
    catch (e) { console.error("✗ evidence-manifest ci: " + e.message); process.exit(1); }
    if (findings.length) {
      for (const f of findings) console.error("  ✗ " + f);
      console.error(`✗ evidence-manifest ci: ${findings.length} finding(s) — ${CORRECTION_LAW}`);
      process.exit(1);
    }
    console.log("✓ evidence-manifest ci PASS — every touched bundle fully verified at HEAD; manifest entries append-only (EV-4)");
    process.exit(0);
  }

  console.error(USAGE);
  process.exit(2);
}
