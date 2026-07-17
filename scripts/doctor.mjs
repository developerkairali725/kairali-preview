#!/usr/bin/env node
/**
 * doctor.mjs — GitHub-truth reconcile: repo-recorded state vs the live repo,
 * non-zero on contradiction.
 *
 * WHY THIS EXISTS. Twice in one week the durable logs contradicted GitHub and
 * the wrong side was believed: PR #65 sat "blocked, awaiting review" in
 * BACKLOG's NOW line five hours after Abilash merged it (16 Jul), and the
 * morning-brief class of "nothing merged after X" claims kept going stale the
 * moment more work landed. The 16-Jul research pass adopted the fix as MVP
 * item 2 (docs/research/agentic-memory-and-state-2026-07-16.md): a scheduled
 * reconcile against external ground truth, GitHub-only first — the GPT-5
 * review explicitly deferred email ingestion until this is stable; the
 * interim mailbox lane stays the Gmail-MCP reconcile on session resume.
 *
 * WHAT IT CHECKS.
 *   1. CONTRADICTIONS (exit 2): an UNCHECKED `- [ ]` item in BACKLOG.md that
 *      references a PR (`#NN`) which GitHub says is MERGED or CLOSED — the
 *      exact merged-PR-still-blocked class. Checked items and prose history
 *      are left alone: the logs are append-only and old lines legitimately
 *      describe old states.
 *   2. CONTRADICTIONS (exit 2): a branch-protection required-check context
 *      that names a site absent from the factory-gate matrices (a required
 *      check that can never run again blocks main forever).
 *   3. ATTENTION (exit 0): matrix contexts not yet in required checks (the
 *      owner one-click), open PRs idle >48h, local branches ahead of origin.
 *
 * Runs at session start (CLAUDE.md boot rule) and before the morning brief.
 *
 * Usage: node scripts/doctor.mjs
 * Exit codes: 0 = no contradictions · 2 = contradiction(s) · 1 = harness error.
 */

import { readFileSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { parseMatrices, WORKFLOW } from "./factory-matrix-lint.mjs";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const run = (cmd, args) =>
  execFileSync(cmd, args, { cwd: REPO_ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 30_000 }).trim();

/** The item ASSERTS the PR is still in flight… */
const OPEN_ASSERT = /\b(awaiting|blocked|pending|in review|waiting|stranded|still open|not (?:yet )?merged|un-?merged|needs (?:review|approval|merge))\b/i;
/** …and nothing in the window says it already landed (historic citations —
 *  "RESOLVED via PR #87", "(PR #81 merged)" — are the normal, healthy case). */
const CLOSED_HINT = /\b(merged|resolved|ruled|closed|done|shipped|landed|cherry-pick)/i;

/**
 * Find unchecked BACKLOG items that ASSERT a PR is in flight while GitHub says
 * MERGED/CLOSED — the exact 16-Jul class ("PR #65 blocked, awaiting review"
 * five hours after it merged). Pure — tests drive it with fabricated logs.
 *
 * PRECISION OVER RECALL, deliberately: only `PR #NN` (with the PR prefix)
 * inside an unchecked `- [ ]` item, only with an open-state assertion in the
 * ±90-char window, only without a closure word in that window. First run of
 * the naive version flagged 8 "contradictions" on the real BACKLOG — 7 were
 * historic citations and one ("[gap #1]") was not a PR at all. A doctor that
 * cries wolf gets ignored, and then it protects nothing (§0.6's cousin).
 * @param {string} backlogText
 * @param {Map<number, string>} prStates number → "OPEN"|"MERGED"|"CLOSED"
 * @returns {{line:number, pr:number, state:string, excerpt:string}[]}
 */
export function findPrContradictions(backlogText, prStates) {
  const out = [];
  backlogText.split(/\r?\n/).forEach((line, i) => {
    if (!/^\s*- \[ \]/.test(line)) return; // only OPEN items can contradict
    for (const m of line.matchAll(/\bPR\s*#(\d+)\b/g)) {
      const pr = Number(m[1]);
      const state = prStates.get(pr);
      if (state !== "MERGED" && state !== "CLOSED") continue;
      const window = line.slice(Math.max(0, m.index - 90), m.index + m[0].length + 90);
      if (!OPEN_ASSERT.test(window) || CLOSED_HINT.test(window)) continue;
      out.push({ line: i + 1, pr, state, excerpt: line.trim().slice(0, 140) });
    }
  });
  return out;
}

/**
 * Required-check contexts that reference matrix sites which no longer exist
 * in any matrix — those checks can never report again and would block main.
 * @param {string[]} requiredContexts @param {string[]} matrixSites
 */
export function findDeadRequiredChecks(requiredContexts, matrixSites) {
  const sites = new Set(matrixSites);
  return requiredContexts.filter((c) => {
    const m = c.match(/^(?:factory-spec|lighthouse) \((sites\/[^)]+)\)$/);
    return m && !sites.has(m[1]);
  });
}

/** Matrix contexts not yet required — the owner's one-click backlog. */
export function findMissingRequiredChecks(requiredContexts, matrixSites) {
  const required = new Set(requiredContexts);
  return matrixSites.flatMap((s) => [`factory-spec (${s})`, `lighthouse (${s})`]).filter((c) => !required.has(c));
}

function main() {
  const read = (rel) => (existsSync(join(REPO_ROOT, rel)) ? readFileSync(join(REPO_ROOT, rel), "utf8") : "");
  const contradictions = [];
  const attention = [];

  // ground truth — degrade loudly when gh is unreachable
  let prs = null;
  let protection = null;
  try {
    prs = JSON.parse(run("gh", ["pr", "list", "--state", "all", "--limit", "200", "--json", "number,state,updatedAt,title"]));
  } catch { attention.push("gh unreachable — PR reconcile SKIPPED (offline is a state, not a pass)"); }
  try {
    protection = JSON.parse(run("gh", ["api", "repos/kairali-digital/kairali-web-factory/branches/main/protection/required_status_checks"]));
  } catch { attention.push("branch protection unreadable — required-checks reconcile SKIPPED"); }

  const matrixSites = [...new Set(parseMatrices(read(WORKFLOW)).flatMap((m) => m.sites))];

  if (prs) {
    const prStates = new Map(prs.map((p) => [p.number, p.state]));
    for (const c of findPrContradictions(read("BACKLOG.md"), prStates)) {
      contradictions.push(`BACKLOG.md:${c.line} — open item references PR #${c.pr}, but GitHub says ${c.state}. Truth-up the item (GitHub, not this file, is the source of truth for PR state — 16-Jul lesson).\n    > ${c.excerpt}`);
    }
    const now = Date.now();
    for (const p of prs.filter((p) => p.state === "OPEN")) {
      const idleH = (now - new Date(p.updatedAt).getTime()) / 3.6e6;
      if (idleH > 48) attention.push(`PR #${p.number} open and idle ${Math.round(idleH)}h — "${p.title.slice(0, 60)}"`);
    }
  }

  if (protection?.contexts) {
    for (const dead of findDeadRequiredChecks(protection.contexts, matrixSites)) {
      contradictions.push(`required check "${dead}" names a site in NO factory-gate matrix — it can never report again and will block main forever. Owner: remove or re-add the site.`);
    }
    const missing = findMissingRequiredChecks(protection.contexts, matrixSites);
    if (missing.length > 0) attention.push(`${missing.length} matrix context(s) not yet required on main (owner one-click — command in scripts/launch-scaffold.mjs output): ${missing.slice(0, 4).join(" · ")}${missing.length > 4 ? " · …" : ""}`);
  }

  try {
    const ahead = run("git", ["log", "--branches", "--not", "--remotes", "--oneline"]);
    if (ahead) attention.push(`local commits not on origin (crash exposure — push them):\n    ${ahead.split("\n").slice(0, 5).join("\n    ")}`);
  } catch { /* fine */ }

  console.log(`\ndoctor — GitHub-truth reconcile · ${contradictions.length} contradiction(s) · ${attention.length} attention item(s)`);
  for (const c of contradictions) console.log(`\nCONTRADICTION  ${c}`);
  for (const a of attention) console.log(`\nattention  ${a}`);
  if (contradictions.length > 0) {
    console.log(`\nFAIL — derived state contradicts GitHub. Fix the LOGS to match GitHub (never the reverse), commit the truth-up, then re-run.\n`);
    return 2;
  }
  console.log(`\nPASS — no derived-state contradictions against GitHub.\n`);
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    process.exit(main());
  } catch (e) {
    console.error(`doctor: harness error — ${e.message}`);
    process.exit(1);
  }
}
