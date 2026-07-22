/**
 * usage-ledger.mjs — GPTW-44 usage telemetry: the per-call token ledger.
 *
 * WHY THIS FILE EXISTS (our incidents, not industry norms)
 * --------------------------------------------------------
 * - STATUS.yaml's BUDGET-BURN NOTE: tokens_spent / cost_inr / hours are null
 *   FLEET-WIDE because "there is no per-session token/cost/duration ledger yet"
 *   — nulls kept per HARD GATE 6 rather than invented. This module is the
 *   ledger that note says to build.
 * - The 21 Jul 2026 GPT walkthrough (docs/reports/
 *   2026-07-21-gpt-walkthrough-findings.md §1) had to HAND-LOG its own spend
 *   (prompt 63,959 · completion 36,099 across 7 calls) and filed the gap as
 *   GPTW-44 — adjudicated "the register's highest-value candidate", owner-ADOPTed
 *   at the 21 Jul panel close.
 * - The 18 Jul PROMPT-4 pilot measured 334,234 subagent tokens BY HAND while
 *   "parent-session tokens still unmeasured" (STATUS.yaml, Pipeline & CI gates
 *   row) — same hole, different session.
 *
 * WHAT IT IS / IS NOT
 * -------------------
 * - OBSERVABILITY, NOT A GATE. Nothing here blocks, exits non-zero into a
 *   caller, or gates a merge. Callers use appendUsageSafe() so a ledger
 *   failure can NEVER break an audit run. See usage-rollup.mjs for the
 *   REPORT-ONLY doctrine + the documented flip condition for any future
 *   budget gate.
 * - MACHINE-LOCAL. usage-log.jsonl lives at repo root and is git-ignored —
 *   same law as agent-log.jsonl (CLAUDE.md rule (q): machine-local trail;
 *   committed rollups are a separate, curated act).
 * - FACTS ONLY (HARD GATE 6). Token counts come from API `usage` response
 *   objects — those are facts and are recorded verbatim. Anything the API did
 *   not return is stored as null, never estimated. MONEY IS NEVER computed
 *   here — see usage-rollup.mjs + config/api-rates.yaml for the only sanctioned
 *   cost path.
 *
 * ROW SHAPE (one JSON object per line, append-only):
 *   { ts_ist, ts_utc, script, model, prompt_tokens, completion_tokens,
 *     total_tokens, meta }
 *   ts_ist  — "YYYY-MM-DD HH:MM:SS IST", second precision (repo log law).
 *   ts_utc  — ISO-8601 UTC (dual stamp, Evidence Law v2 pattern).
 *   total_tokens — prompt + completion when BOTH are known; null otherwise
 *                  (a total over an unknown part would be an invented number).
 *
 * HOUSE STYLE: plain ESM + JSDoc, no dependencies.
 */

import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { istStamp } from "./verdict.mjs";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Machine-local ledger file (git-ignored — same pattern as agent-log.jsonl). */
export const LEDGER_PATH = resolve(REPO_ROOT, "usage-log.jsonl");

/** @param {any} n @returns {number|null} a non-negative finite count, or null — never a guess */
function asCount(n) {
  return typeof n === "number" && Number.isFinite(n) && n >= 0 ? n : null;
}

/**
 * Build one ledger row from an API usage report. Pure — no I/O — so tests and
 * appendUsage share the exact same shape.
 *
 * @param {{script: string, model: string, prompt_tokens?: number|null,
 *          completion_tokens?: number|null, meta?: Record<string, any>}} e
 * @param {Date} [now]
 */
export function buildRow(e, now = new Date()) {
  if (!e || typeof e !== "object") throw new Error("usage entry must be an object");
  if (typeof e.script !== "string" || !e.script.trim()) throw new Error(`"script" must name the calling script`);
  if (typeof e.model !== "string" || !e.model.trim()) throw new Error(`"model" must name the API model`);
  const prompt_tokens = asCount(e.prompt_tokens);
  const completion_tokens = asCount(e.completion_tokens);
  return {
    ts_ist: istStamp(now), // IST to the second — YYYY-MM-DD HH:MM:SS IST
    ts_utc: now.toISOString(),
    script: e.script.trim(),
    model: e.model.trim(),
    prompt_tokens,
    completion_tokens,
    // HARD GATE 6: a total that includes an unknown part is an invented number.
    total_tokens: prompt_tokens !== null && completion_tokens !== null
      ? prompt_tokens + completion_tokens
      : null,
    meta: e.meta && typeof e.meta === "object" ? e.meta : {},
  };
}

/**
 * Append one usage row to the ledger (JSONL, append-only). Throws on failure —
 * audit-script call sites must use appendUsageSafe() instead.
 *
 * @param {Parameters<typeof buildRow>[0]} entry
 * @param {{ledgerPath?: string, now?: Date}} [opts] overrides for tests
 * @returns {object} the row written
 */
export function appendUsage(entry, opts = {}) {
  const row = buildRow(entry, opts.now);
  appendFileSync(opts.ledgerPath ?? LEDGER_PATH, JSON.stringify(row) + "\n");
  return row;
}

/**
 * ★ THE CALL SITE FOR AUDIT SCRIPTS. Telemetry is observability, not a gate:
 * a full disk, a permissions error, a bad entry — none of these may cost us an
 * audit run that already burned real API tokens. Failure is one warning line
 * on stderr and a null return, never a throw.
 *
 * @param {Parameters<typeof buildRow>[0]} entry
 * @param {{ledgerPath?: string, now?: Date, warn?: (msg: string) => void}} [opts]
 * @returns {object|null}
 */
export function appendUsageSafe(entry, opts = {}) {
  const warn = opts.warn ?? ((m) => console.error(m));
  try {
    return appendUsage(entry, opts);
  } catch (e) {
    warn(`usage-ledger: append failed (non-fatal — telemetry never breaks a run): ${e.message}`);
    return null;
  }
}

/**
 * Read the ledger. A corrupt line (unparseable JSON, or JSON that is not a
 * row-shaped object) is SKIPPED with a warning, never a crash — a damaged
 * telemetry file must not take the reporting down with it. Missing file =
 * empty ledger (nothing has been logged on this machine yet).
 *
 * @param {{ledgerPath?: string, warn?: (msg: string) => void}} [opts]
 * @returns {{rows: object[], skipped: {line: number, reason: string}[]}}
 */
export function readLedger(opts = {}) {
  const path = opts.ledgerPath ?? LEDGER_PATH;
  const warn = opts.warn ?? ((m) => console.error(m));
  /** @type {object[]} */ const rows = [];
  /** @type {{line: number, reason: string}[]} */ const skipped = [];
  if (!existsSync(path)) return { rows, skipped };
  const lines = readFileSync(path, "utf8").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") continue;
    let parsed;
    try {
      parsed = JSON.parse(line);
    } catch (e) {
      skipped.push({ line: i + 1, reason: `unparseable JSON: ${e.message}` });
      warn(`usage-ledger: skipping corrupt line ${i + 1} (${e.message})`);
      continue;
    }
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)
      || typeof parsed.script !== "string" || typeof parsed.model !== "string") {
      skipped.push({ line: i + 1, reason: "not a ledger row (needs object with script + model)" });
      warn(`usage-ledger: skipping non-row line ${i + 1}`);
      continue;
    }
    rows.push(parsed);
  }
  return { rows, skipped };
}

/**
 * Sum the ledger by script+model, plus grand totals. Sums cover only values
 * the API actually reported (numbers); rows with a null count are tallied in
 * `incomplete_calls` so a partial ledger reads as partial, not as complete.
 *
 * @param {object[]} rows from readLedger()
 * @returns {{
 *   by: {script: string, model: string, calls: number, incomplete_calls: number,
 *        prompt_tokens: number, completion_tokens: number, total_tokens: number}[],
 *   totals: {calls: number, incomplete_calls: number, prompt_tokens: number,
 *            completion_tokens: number, total_tokens: number},
 * }}
 */
export function rollup(rows) {
  /** @type {Map<string, any>} */
  const map = new Map();
  const totals = { calls: 0, incomplete_calls: 0, prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
  for (const r of rows) {
    const key = `${r.script}\u001f${r.model}`; // unit-separated so "a"+"bc" can never collide with "ab"+"c"
    if (!map.has(key)) {
      map.set(key, { script: r.script, model: r.model, calls: 0, incomplete_calls: 0, prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 });
    }
    const b = map.get(key);
    b.calls += 1;
    totals.calls += 1;
    const p = asCount(r.prompt_tokens);
    const c = asCount(r.completion_tokens);
    if (p === null || c === null) { b.incomplete_calls += 1; totals.incomplete_calls += 1; }
    if (p !== null) { b.prompt_tokens += p; totals.prompt_tokens += p; }
    if (c !== null) { b.completion_tokens += c; totals.completion_tokens += c; }
    if (p !== null && c !== null) { b.total_tokens += p + c; totals.total_tokens += p + c; }
  }
  const by = [...map.values()].sort((a, b) =>
    a.script === b.script ? (a.model < b.model ? -1 : 1) : (a.script < b.script ? -1 : 1));
  return { by, totals };
}
