#!/usr/bin/env node
/**
 * writer-lease.mjs — cooperative writer lease for single-writer scopes
 * (GPTW-04 / GPTW-36 / GPTW-42; owner-ruled ADOPT).
 *
 * WHY THIS EXISTS — OUR incidents, not industry standards:
 *   - GPTW-04 (docs/reports/2026-07-21-gpt-walkthrough-findings.md, step 1
 *     finding 4): "Concurrent writers (worktrees) have already produced
 *     truncated duplicate reports; no contention control."
 *   - GPTW-36 (same report, step 5 finding 9): Phase-4 single-writer is
 *     declared without locks amid known concurrent-writer incidents.
 *   - GPTW-42 (same report, step 6 finding 6): duplicate concurrent-writer
 *     reports occurred; no guard prevents parallel report creation.
 *   - Standing cautions on record: "one records PR per wave (index.json
 *     races)" and "parallel agents: unique scratchpad paths".
 *
 * WHAT THIS IS (and is NOT) — REPORT-ONLY ALTITUDE:
 *   This is a CONVENTION MECHANIZED. Nothing else enforces it yet: no CI job
 *   checks that a lease was held, no hook blocks a write without one.
 *   Report-writing flows SHOULD claim scope "reports" before writing anything
 *   under docs/reports/ (and release on finish); wave-record flows SHOULD do
 *   the same for their scope. CI/hook enforcement is a LATER, SEPARATELY-
 *   RULED step (house law: blocking behavior ships report-only first, and the
 *   flip is an owner ruling, never a day-one default).
 *
 * STATE — MACHINE-LOCAL BY CONSTRUCTION:
 *   state/writer-lease.local.json. The state/ directory is git-ignored
 *   (.gitignore line "state/", plus an explicit line for this file) because a
 *   COMMITTED lease would race itself: two checkouts would each "hold" the
 *   lease their commit shows, which is exactly the concurrent-writer bug this
 *   tool exists to prevent. A lease only means anything on the machine where
 *   the writers actually run. Writes go tmp-file + rename (atomic on one
 *   filesystem) so a crashed writer never leaves a torn state file.
 *   A CORRUPT state file is RESET with a loud printed note rather than
 *   hard-failing: it is advisory machine-local scratch, and the worst case of
 *   a reset equals the pre-mechanism world — while a hard fail would block
 *   every writer on a scratch file nobody can trust anyway.
 *
 * HOLDER IDENTITY:
 *   WRITER_LEASE_ID env var when set (session naming — e.g. "wave1-agent-B"),
 *   else "pid-<pid>". Two sessions that want to look like one writer can
 *   share a WRITER_LEASE_ID; by default every process is its own holder.
 *
 * SEMANTICS:
 *   claim <scope> [--ttl-min N]   N defaults to 30.
 *     - free scope            -> lease written, exit 0
 *     - held by SAME holder   -> refresh (TTL clock resets), exit 0
 *     - held by OTHER, live   -> DENIED loudly (holder + age named), exit 2
 *     - held by OTHER, stale  -> TAKEOVER with a printed note, exit 0
 *   release <scope>
 *     - own lease             -> released, exit 0
 *     - no lease              -> nothing to release (idempotent), exit 0
 *     - foreign STALE lease   -> cleared with a note, exit 0
 *     - foreign LIVE lease    -> REFUSED loudly, exit 2 (releasing someone
 *       else's live lease is the same race wearing a different verb)
 *   check <scope>
 *     - free / own / stale    -> exit 0 (stale prints that claim will take over)
 *     - foreign live          -> exit 2 (the "findings" exit: scope is busy)
 *   list                       -> all leases with holder/age/status, exit 0
 *
 * Timestamps print IST to the second (YYYY-MM-DD HH:MM:SS IST — house law);
 * staleness math runs on epoch milliseconds stored alongside.
 *
 * Exit codes: 0 = ok · 2 = findings (live foreign lease) · 1 = harness/usage
 * error.
 *
 * Usage: node scripts/writer-lease.mjs claim reports --ttl-min 45
 *        WRITER_LEASE_ID=wave1-B node scripts/writer-lease.mjs check reports
 */

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const DEFAULT_STATE_FILE = "state/writer-lease.local.json";
export const DEFAULT_TTL_MIN = 30;

// ---------------------------------------------------------------------------
// Time helpers — IST to the second for humans, epoch ms for math.
// ---------------------------------------------------------------------------

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

/** Format epoch ms as "YYYY-MM-DD HH:MM:SS IST" (house timestamp law). */
export function istStamp(ms) {
  const d = new Date(ms + IST_OFFSET_MS);
  const p = (n, w = 2) => String(n).padStart(w, "0");
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} IST`;
}

/** Human age like "4m12s" (hours folded in when it gets that old). */
export function fmtAge(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return h > 0 ? `${h}h${m}m${r}s` : `${m}m${r}s`;
}

// ---------------------------------------------------------------------------
// State — load / save (atomic) / lease math.
// ---------------------------------------------------------------------------

/** Holder id: WRITER_LEASE_ID env (session naming) or pid-<pid>. */
export function holderId(env = process.env, pid = process.pid) {
  const id = (env.WRITER_LEASE_ID ?? "").trim();
  return id !== "" ? id : `pid-${pid}`;
}

/**
 * Load lease state. Corrupt file -> reset with a note in .resetNote (header:
 * advisory machine-local scratch; a hard fail would block on garbage).
 */
export function loadState(fileAbs) {
  if (!existsSync(fileAbs)) return { leases: {} };
  try {
    const parsed = JSON.parse(readFileSync(fileAbs, "utf8"));
    if (!parsed || typeof parsed !== "object" || typeof parsed.leases !== "object" || parsed.leases === null) {
      throw new Error("missing leases object");
    }
    return parsed;
  } catch (e) {
    return { leases: {}, resetNote: `state file ${fileAbs} was corrupt (${e.message}) — RESET to empty (machine-local advisory state)` };
  }
}

/** Atomic save: tmp file + rename, so a crash never leaves a torn file. */
export function saveState(fileAbs, state) {
  mkdirSync(dirname(fileAbs), { recursive: true });
  const tmp = `${fileAbs}.${process.pid}.tmp`;
  const clean = { leases: state.leases }; // never persist resetNote
  writeFileSync(tmp, JSON.stringify(clean, null, 2) + "\n");
  renameSync(tmp, fileAbs);
}

/** A lease is stale when its TTL has fully elapsed since claim/refresh. */
export function isStale(lease, nowMs) {
  return nowMs - lease.claimed_at_ms >= lease.ttl_min * 60 * 1000;
}

// ---------------------------------------------------------------------------
// CLI core — pure-ish (env/now injectable) so tests drive every path offline.
// ---------------------------------------------------------------------------

/**
 * @param {string[]} argv — e.g. ["claim","reports","--ttl-min","45"]
 * @param {{env?:object, nowMs?:number, pid?:number, stateFile?:string}} opts
 * @returns {{code:number, lines:string[]}}
 */
export function runCli(argv, opts = {}) {
  const env = opts.env ?? process.env;
  const nowMs = opts.nowMs ?? Date.now();
  const pid = opts.pid ?? process.pid;
  const lines = [];

  const cmd = argv[0];
  if (!["claim", "release", "check", "list"].includes(cmd ?? "")) {
    lines.push("usage: writer-lease.mjs claim <scope> [--ttl-min N] | release <scope> | check <scope> | list");
    return { code: 1, lines };
  }

  // --state <path> (tests / unusual layouts) beats WRITER_LEASE_STATE env
  // beats the default repo-root path.
  const stateIdx = argv.indexOf("--state");
  const stateRel = stateIdx >= 0 ? argv[stateIdx + 1] : (env.WRITER_LEASE_STATE ?? opts.stateFile ?? DEFAULT_STATE_FILE);
  if (stateRel === undefined) { lines.push("writer-lease: --state needs a path"); return { code: 1, lines }; }
  const fileAbs = resolve(REPO_ROOT, stateRel);

  const me = holderId(env, pid);
  const state = loadState(fileAbs);
  if (state.resetNote) lines.push(`NOTE  ${state.resetNote}`);

  const describe = (scope, lease) => {
    const age = fmtAge(nowMs - lease.claimed_at_ms);
    return `scope "${scope}" held by ${lease.holder} — age ${age} of ${lease.ttl_min}m TTL, claimed ${lease.claimed_at_ist}`;
  };

  if (cmd === "list") {
    const scopes = Object.keys(state.leases).sort();
    if (scopes.length === 0) { lines.push("writer-lease: no leases held."); return { code: 0, lines }; }
    for (const s of scopes) {
      const l = state.leases[s];
      lines.push(`${isStale(l, nowMs) ? "STALE" : "LIVE "}  ${describe(s, l)}`);
    }
    return { code: 0, lines };
  }

  const scope = argv[1];
  if (!scope || scope.startsWith("--")) { lines.push(`writer-lease: ${cmd} needs a <scope>`); return { code: 1, lines }; }
  const lease = state.leases[scope];
  const foreign = lease && lease.holder !== me;
  const stale = lease && isStale(lease, nowMs);

  if (cmd === "check") {
    if (!lease) { lines.push(`FREE  scope "${scope}" is unclaimed.`); return { code: 0, lines }; }
    if (!foreign) { lines.push(`OURS  ${describe(scope, lease)}${stale ? " (EXPIRED — re-claim to refresh)" : ""}`); return { code: 0, lines }; }
    if (stale) { lines.push(`STALE  ${describe(scope, lease)} — past TTL; a claim will take over.`); return { code: 0, lines }; }
    lines.push(`HELD  ${describe(scope, lease)} — a claim now would be DENIED.`);
    return { code: 2, lines };
  }

  if (cmd === "release") {
    if (!lease) { lines.push(`writer-lease: scope "${scope}" was not held — nothing to release.`); return { code: 0, lines }; }
    if (foreign && !stale) {
      lines.push(`RELEASE REFUSED  ${describe(scope, lease)} — releasing someone else's LIVE lease is the same race wearing a different verb. Wait for expiry or have the holder release.`);
      return { code: 2, lines };
    }
    delete state.leases[scope];
    saveState(fileAbs, state);
    lines.push(foreign
      ? `RELEASED (stale-cleanup)  scope "${scope}" — foreign lease by ${lease.holder} was past TTL.`
      : `RELEASED  scope "${scope}" by ${me} at ${istStamp(nowMs)}.`);
    return { code: 0, lines };
  }

  // claim
  const ttlIdx = argv.indexOf("--ttl-min");
  let ttlMin = DEFAULT_TTL_MIN;
  if (ttlIdx >= 0) {
    ttlMin = Number(argv[ttlIdx + 1]);
    if (!Number.isFinite(ttlMin) || ttlMin <= 0) { lines.push(`writer-lease: --ttl-min needs a positive number, got "${argv[ttlIdx + 1]}"`); return { code: 1, lines }; }
  }

  if (foreign && !stale) {
    lines.push(`LEASE DENIED  ${describe(scope, lease)}.`);
    lines.push(`ANOTHER WRITER OWNS "${scope}" RIGHT NOW — writing anyway is how the truncated duplicate reports happened (GPTW-04). Wait, coordinate, or re-check after the TTL.`);
    return { code: 2, lines };
  }

  const record = {
    holder: me,
    pid,
    scope,
    ttl_min: ttlMin,
    claimed_at_ms: nowMs,
    claimed_at_ist: istStamp(nowMs),
    first_claimed_at_ist: lease && !foreign ? (lease.first_claimed_at_ist ?? lease.claimed_at_ist) : istStamp(nowMs),
  };
  state.leases[scope] = record;
  saveState(fileAbs, state);

  if (lease && !foreign) {
    lines.push(`REFRESHED  scope "${scope}" by ${me} at ${record.claimed_at_ist} — TTL clock reset (${ttlMin}m; first claimed ${record.first_claimed_at_ist}).`);
  } else if (foreign && stale) {
    lines.push(`TAKEOVER  scope "${scope}" claimed by ${me} at ${record.claimed_at_ist} — previous lease by ${lease.holder} was STALE (age ${fmtAge(nowMs - lease.claimed_at_ms)} > ${lease.ttl_min}m TTL). If ${lease.holder} is still mid-write, STOP and coordinate.`);
  } else {
    lines.push(`CLAIMED  scope "${scope}" by ${me} at ${record.claimed_at_ist} (TTL ${ttlMin}m). Release with: node scripts/writer-lease.mjs release ${scope}`);
  }
  return { code: 0, lines };
}

// ---------------------------------------------------------------------------
// Entry point.
// ---------------------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const { code, lines } = runCli(process.argv.slice(2));
    for (const l of lines) (code === 1 ? console.error : console.log)(l);
    process.exit(code);
  } catch (e) {
    console.error(`writer-lease: harness error — ${e.message}`);
    process.exit(1);
  }
}
