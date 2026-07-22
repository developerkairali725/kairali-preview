#!/usr/bin/env node
/**
 * usage-rollup.mjs — GPTW-44 usage telemetry: the rollup + STATUS.yaml writer.
 *
 * WHY (our incidents — see also scripts/lib/usage-ledger.mjs header):
 *   STATUS.yaml's BUDGET-BURN NOTE keeps tokens_spent/cost_inr/hours null
 *   fleet-wide because no ledger existed (HARD GATE 6: never invent). The
 *   21 Jul GPT walkthrough hand-logged its own spend (docs/reports/
 *   2026-07-21-gpt-walkthrough-findings.md §1) and filed the gap as GPTW-44,
 *   owner-ADOPTed at the 21 Jul panel close. This command turns the ledger
 *   usage-ledger.mjs now writes into (a) a report and (b) the ONE sanctioned
 *   write into STATUS.yaml: the tokens_spent field of a named workstream.
 *
 * REPORT-ONLY DOCTRINE (binding, 21 Jul panel build rule):
 *   This mechanism observes and reports. It is wired into NO CI job, blocks
 *   NO merge, and gates NOTHING on day one. EXPLICIT FLIP CONDITION — a
 *   budget-ceiling gate (the GPTW-45 candidate) may only ever be built after
 *   ALL of: (1) the owner fills config/api-rates.yaml with source-cited rates,
 *   (2) at least one sprint of baseline ledger data exists to size ceilings
 *   from, and (3) the owner rules the flip in DECISIONS.md. Until that ruling
 *   exists, any blocking behavior added here is a gate violation (rule g in
 *   reverse: gates are added by ruling, not grown by drift).
 *
 * MONEY (HARD GATE 6): token counts are facts (API usage objects). Money is
 *   NOT a fact until a rate is. cost_inr is computed ONLY from
 *   config/api-rates.yaml entries that carry BOTH per-1k rates AND a cited
 *   source + as_of date; while rates are absent/empty/uncited, cost prints
 *   null — honestly unknown, never remembered from training data.
 *
 * SCOPE HONESTY: usage-log.jsonl is MACHINE-LOCAL (same law as
 *   agent-log.jsonl) and today captures the external audit API calls
 *   (audit-gpt, audit-perplexity). The tokens_spent it writes is therefore a
 *   MEASURED LOWER BOUND of real spend, not a fleet total — exactly the
 *   "start capturing" baseline STATUS.yaml's note asks for. Parent-session
 *   tokens remain unmeasured (the PROMPT-4 pilot incident: 334,234 subagent
 *   tokens hand-measured, parent session unmeasured).
 *
 * USAGE:
 *   node scripts/usage-rollup.mjs
 *     print the rollup table (sums by script+model + grand totals).
 *   node scripts/usage-rollup.mjs --status --workstream "<name>"
 *     also update ONLY that workstream's tokens_spent in STATUS.yaml from the
 *     ledger's measured token total. cost_inr and hours are NEVER touched.
 *   Overrides (tests/ops): --ledger <path> --status-file <path> --rates <path>
 *
 * EXIT CODES (house idiom): 0 ok · 2 findings (corrupt ledger lines were
 *   skipped — the report still prints, the findings are surfaced) · 1 error.
 *
 * HOUSE STYLE: plain ESM, dependency-free; the rates parser is intentionally
 * minimal (exactly the api-rates.yaml shape, not arbitrary YAML) — same
 * doctrine as status-build.mjs's parsers.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { LEDGER_PATH, readLedger, rollup } from "./lib/usage-ledger.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = resolve(HERE, "..");
export const STATUS_PATH = resolve(REPO_ROOT, "STATUS.yaml");
export const RATES_PATH = resolve(REPO_ROOT, "config/api-rates.yaml");

/* ------------------------------------------------------------------ rates */

/** Strip one layer of surrounding quotes. @param {string} s */
function unquote(s) {
  const t = s.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) return t.slice(1, -1);
  return t;
}

/**
 * Parse config/api-rates.yaml — EXACTLY its documented shape:
 *   rates:
 *     <model-id>:
 *       prompt_inr_per_1k: <number>
 *       completion_inr_per_1k: <number>
 *       source: "<url>"
 *       as_of: "YYYY-MM-DD"
 *
 * An entry missing either rate, the source citation, or the as_of date is
 * REJECTED with a warning: an uncited price is not a fact (HARD GATE 6), so
 * cost stays null rather than computed from it.
 *
 * @param {string} text
 * @param {(msg: string) => void} [warn]
 * @returns {Map<string, {prompt_inr_per_1k: number, completion_inr_per_1k: number, source: string, as_of: string}>}
 */
export function parseRatesYaml(text, warn = (m) => console.error(m)) {
  const valid = new Map();
  /** @type {Record<string, Record<string, string>>} */
  const raw = {};
  let inRates = false;
  let curModel = null;
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (t === "" || t.startsWith("#")) continue;
    const indent = line.length - line.trimStart().length;
    if (indent === 0) {
      inRates = /^rates:\s*(\{\}\s*)?$/.test(t);
      curModel = null;
      continue;
    }
    if (!inRates) continue;
    if (indent === 2 && t.endsWith(":")) { curModel = unquote(t.slice(0, -1)); raw[curModel] = {}; continue; }
    const m = t.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (indent >= 4 && curModel && m) raw[curModel][m[1]] = unquote(m[2]);
  }
  for (const [model, e] of Object.entries(raw)) {
    const p = Number(e.prompt_inr_per_1k);
    const c = Number(e.completion_inr_per_1k);
    const problems = [];
    if (!(Number.isFinite(p) && p >= 0)) problems.push("prompt_inr_per_1k missing/not a number");
    if (!(Number.isFinite(c) && c >= 0)) problems.push("completion_inr_per_1k missing/not a number");
    if (!e.source || !e.source.trim()) problems.push("source citation missing (HARD GATE 6: cite it or the rate is not usable)");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.as_of ?? "")) problems.push('as_of missing/not "YYYY-MM-DD"');
    if (problems.length) {
      warn(`api-rates: entry "${model}" rejected — ${problems.join("; ")} — cost for it stays null`);
      continue;
    }
    valid.set(model, { prompt_inr_per_1k: p, completion_inr_per_1k: c, source: e.source.trim(), as_of: e.as_of });
  }
  return valid;
}

/**
 * @param {{ratesPath?: string, warn?: (msg: string) => void}} [opts]
 * @returns {Map<string, any>} empty map when the file is absent or has no valid entries
 */
export function loadRates(opts = {}) {
  const path = opts.ratesPath ?? RATES_PATH;
  if (!existsSync(path)) return new Map();
  return parseRatesYaml(readFileSync(path, "utf8"), opts.warn);
}

/**
 * Cost in INR for one rollup bucket, or null when its model has no valid rate.
 * @param {{model: string, prompt_tokens: number, completion_tokens: number}} b
 * @param {Map<string, any>} rates
 * @returns {number|null}
 */
export function costInr(b, rates) {
  const r = rates.get(b.model);
  if (!r) return null;
  return Math.round(((b.prompt_tokens / 1000) * r.prompt_inr_per_1k + (b.completion_tokens / 1000) * r.completion_inr_per_1k) * 100) / 100;
}

/* ----------------------------------------------------------- STATUS write */

/**
 * ★ THE ONE SANCTIONED STATUS.yaml WRITE: replace the value of tokens_spent
 * inside the NAMED workstream, byte-preserving every other line. cost_inr and
 * hours are deliberately unreachable from here — cost stays honestly null
 * until the owner supplies cited rates, and hours have no ledger at all.
 *
 * Pure text surgery (no parse/re-serialize) so comments, ordering and the
 * BUDGET-BURN NOTE survive untouched. Written value is a plain integer —
 * status-build.mjs's minimal parser (parseScalar) reads bare integers only,
 * so no trailing comment is appended.
 *
 * @param {string} text current STATUS.yaml content
 * @param {string} workstream exact workstream name (unquoted form)
 * @param {number} tokens non-negative integer from the ledger rollup
 * @returns {string} updated text
 */
export function updateStatusTokens(text, workstream, tokens) {
  if (!Number.isInteger(tokens) || tokens < 0) throw new Error(`tokens must be a non-negative integer (got ${tokens})`);
  const lines = text.split("\n");
  let inWorkstreams = false;
  let inTarget = false;
  let namesSeen = [];
  let targetCount = 0;
  let replacedAt = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();
    const indent = line.length - line.trimStart().length;
    if (indent === 0 && /^[A-Za-z0-9_]+:/.test(t)) {
      inWorkstreams = /^workstreams:\s*$/.test(t);
      inTarget = false;
      continue;
    }
    if (!inWorkstreams) continue;
    const nameM = t.match(/^- name:\s*(.*)$/);
    if (nameM) {
      const name = unquote(nameM[1]);
      namesSeen.push(name);
      inTarget = name === workstream;
      if (inTarget) targetCount++;
      continue;
    }
    if (inTarget) {
      const m = line.match(/^(\s*)tokens_spent:\s*.*$/);
      if (m && replacedAt === -1) {
        lines[i] = `${m[1]}tokens_spent: ${tokens}`;
        replacedAt = i;
      }
    }
  }
  if (targetCount === 0) {
    throw new Error(`workstream not found: "${workstream}". Known workstreams:\n  - ${namesSeen.join("\n  - ")}`);
  }
  if (targetCount > 1) throw new Error(`workstream name "${workstream}" is ambiguous (${targetCount} matches) — refusing to write`);
  if (replacedAt === -1) throw new Error(`workstream "${workstream}" has no tokens_spent line to update`);
  return lines.join("\n");
}

/* ------------------------------------------------------------------- CLI */

/** @param {string[]} argv @returns {{status: boolean, workstream: string|null, ledger: string|null, statusFile: string|null, rates: string|null}} */
export function parseArgs(argv) {
  const out = { status: false, workstream: null, ledger: null, statusFile: null, rates: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--status") out.status = true;
    else if (a === "--workstream") out.workstream = argv[++i] ?? null;
    else if (a === "--ledger") out.ledger = argv[++i] ?? null;
    else if (a === "--status-file") out.statusFile = argv[++i] ?? null;
    else if (a === "--rates") out.rates = argv[++i] ?? null;
    else throw new Error(`unknown argument: ${a}`);
  }
  return out;
}

const pad = (s, w) => String(s).padEnd(w);

/**
 * Render the rollup table. Cost cells are null unless the model has a valid,
 * source-cited rate (see parseRatesYaml); the grand-total cost is null unless
 * EVERY bucket priced — a partial sum printed as "the total" would mislead.
 *
 * @param {{by: any[], totals: any}} r
 * @param {Map<string, any>} rates
 * @returns {string[]} printable lines
 */
export function formatTable(r, rates) {
  const out = [];
  const costCell = (v) => (v === null ? "null" : v.toFixed(2));
  out.push(pad("script", 20) + pad("model", 14) + pad("calls", 7) + pad("prompt", 12) + pad("completion", 12) + pad("total", 12) + "cost_inr");
  let allPriced = r.by.length > 0;
  let costTotal = 0;
  for (const b of r.by) {
    const c = costInr(b, rates);
    if (c === null) allPriced = false; else costTotal += c;
    const incomplete = b.incomplete_calls ? ` (${b.incomplete_calls} call(s) missing counts)` : "";
    out.push(pad(b.script, 20) + pad(b.model, 14) + pad(b.calls, 7) + pad(b.prompt_tokens, 12) + pad(b.completion_tokens, 12) + pad(b.total_tokens, 12) + costCell(c) + incomplete);
  }
  const t = r.totals;
  out.push(pad("TOTAL", 20) + pad("", 14) + pad(t.calls, 7) + pad(t.prompt_tokens, 12) + pad(t.completion_tokens, 12) + pad(t.total_tokens, 12) + costCell(allPriced ? Math.round(costTotal * 100) / 100 : null));
  if (!rates.size) out.push("cost_inr is null: config/api-rates.yaml has no valid rates yet — owner fills it with cited prices (HARD GATE 6; money is never computed from memory)");
  return out;
}

/**
 * @param {string[]} argv
 * @returns {number} exit code — 0 ok, 2 findings (corrupt lines skipped), 1 error
 */
export function main(argv) {
  let args;
  try { args = parseArgs(argv); }
  catch (e) { console.error(`usage-rollup: ${e.message}`); return 1; }
  if (args.status && !args.workstream) {
    console.error("usage-rollup: --status requires --workstream <name>");
    return 1;
  }

  const ledgerPath = args.ledger ? resolve(args.ledger) : LEDGER_PATH;
  const { rows, skipped } = readLedger({ ledgerPath });
  const r = rollup(rows);
  const rates = loadRates({ ratesPath: args.rates ? resolve(args.rates) : RATES_PATH });

  console.log(`usage rollup — ${ledgerPath} (machine-local ledger; ${rows.length} row(s)${skipped.length ? `, ${skipped.length} corrupt line(s) SKIPPED` : ""})`);
  for (const line of formatTable(r, rates)) console.log(line);

  if (args.status) {
    // tokens_spent = every token the ledger measured (prompt + completion sums,
    // including calls where only one side was reported) — a measured lower
    // bound, never an estimate. cost_inr / hours are NEVER written here.
    const tokens = r.totals.prompt_tokens + r.totals.completion_tokens;
    const statusPath = args.statusFile ? resolve(args.statusFile) : STATUS_PATH;
    let updated;
    try {
      updated = updateStatusTokens(readFileSync(statusPath, "utf8"), args.workstream, tokens);
    } catch (e) {
      console.error(`usage-rollup: ${e.message}`);
      return 1;
    }
    writeFileSync(statusPath, updated);
    console.log(`STATUS updated: workstream "${args.workstream}" tokens_spent -> ${tokens} (${statusPath}); cost_inr/hours untouched`);
  }

  return skipped.length ? 2 : 0;
}

// Only run as a CLI when executed directly (house pattern: importable for tests).
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    console.error("usage-rollup failed:", e.message);
    process.exit(1);
  }
}
