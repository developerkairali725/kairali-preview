#!/usr/bin/env node
/**
 * ci-emit-verdicts.mjs — the CI WIRING for the tranche-1 verdict emitters.
 *
 * RATIFICATION. PR #126 built the emitters and shipped them DELIBERATELY
 * un-wired (O6 precedent: wiring is a separate ratified change). Abilash
 * ratified the wiring on 18 Jul 2026 in the weekend-unblock walk:
 * DECISIONS.md D-EMITTER-WIRING — "RATIFIED — wire the #126 emitters into CI
 * as its own PR." This file is that wiring's engine; the `emit-verdicts` job
 * in .github/workflows/factory-gate.yml is its driver.
 *
 * WHAT IT DOES. For every site in the EMIT SET (below) × every emitter in
 * gate-emit.mjs's closed spec table, it calls emitForGate() — which spawns the
 * REAL enforcing command, fires the §0.6 control probe first, and derives the
 * verdict from the command's REAL exit code. This file adds NO emit logic of
 * its own: it cannot widen a scope, soften an exit code, or speak for a gate
 * the spec table does not cover. It is a loop and a report.
 *
 * THE EMIT SET = the factory CI matrix set, by construction: fleetSites()
 * minus EXEMPT, imported from factory-matrix-lint.mjs — the same exports that
 * keep the factory-spec and lighthouse matrices honest. A site outside the
 * matrix is never emitted for (its build was never CI-validated), and the
 * parity is asserted by scripts/test/ci-emit-verdicts.test.js, so the two
 * sets cannot drift apart silently. Exemptions print LOUDLY, same as the lint.
 *
 * WHAT A RUN OF THIS FILE IS NOT. Writing verdicts is not committing them:
 * a verdict becomes ship evidence only when a CI job COMMITS it
 * (§0.2 provenance — checkProvenance rejects human/agent authors). The commit
 * step lives in the workflow, not here; a local run of this file yields
 * runner:"local" verdicts that matrix-walk correctly refuses as iteration
 * evidence. That is the anti-falsification law working, not a bug.
 *
 * EXIT CODES (house rule): 0 = every armed emitter PASSed (or none armed —
 * absence stays honest) · 2 = at least one FAIL verdict was emitted (the
 * verdict IS still written: a FAIL is exactly as much evidence as a PASS) ·
 * 1 = harness error (a §0.6 probe misfire aborts the whole run — if the
 * failure detector is broken, nothing this run reports is evidence).
 *
 * USAGE
 *   node scripts/ci-emit-verdicts.mjs                 # full emit set × all emitters
 *   node scripts/ci-emit-verdicts.mjs --site <domain> # one site (repeatable)
 *   node scripts/ci-emit-verdicts.mjs --list          # show the emit set + emitters
 */

import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_REPO_ROOT, EMITTERS, emitForGate } from "./gate-emit.mjs";
import { EXEMPT, fleetSites } from "./factory-matrix-lint.mjs";

/**
 * The sites this wiring emits for: every fleet site (sites/<dir> with a
 * site.config.json) that is NOT matrix-exempt, as bare domains. Kept in
 * lockstep with the CI matrices through the same two exports the matrix lint
 * gates on — reusing them IS the lockstep.
 *
 * @param {string} [root]
 * @returns {string[]} sorted bare domains, e.g. ["arogyashala.in", …]
 */
export function emitSiteSet(root = DEFAULT_REPO_ROOT) {
  return fleetSites(root)
    .filter((s) => !EXEMPT.has(s))
    .map((s) => s.replace(/^sites\//, ""));
}

/**
 * @typedef {object} EmitResult
 * @property {string} site
 * @property {string} gate
 * @property {"PASS"|"FAIL"|"NOT_ARMED"} outcome
 * @property {string} [path]    repo-relative verdict path (when emitted)
 * @property {string} [runner]  verdict runner (when emitted)
 * @property {string} [reason]  the loud not-armed reason (when not emitted)
 */

/**
 * Run every emitter for every site. A harness error (§0.6 probe misfire, a
 * command with no exit code) PROPAGATES — it aborts the whole run rather than
 * being downgraded to a per-gate skip, because a broken failure detector
 * invalidates every "zero" this process could report.
 *
 * @param {{
 *   repoRoot?: string,
 *   sites?: string[],                      defaults to emitSiteSet(repoRoot)
 *   gates?: string[],                      defaults to the full spec table
 *   run?: (argv: string[], o: {repoRoot: string}) => {exit: number|null, output: string},
 * }} [opts]
 * @returns {EmitResult[]}
 */
export function emitAll(opts = {}) {
  const repoRoot = opts.repoRoot ?? DEFAULT_REPO_ROOT;
  const sites = opts.sites ?? emitSiteSet(repoRoot);
  const gates = opts.gates ?? EMITTERS.map((s) => s.gate);
  /** @type {EmitResult[]} */
  const results = [];
  for (const site of sites) {
    for (const gate of gates) {
      const r = emitForGate(gate, { site, repoRoot, ...(opts.run ? { run: opts.run } : {}) });
      if (!r.emitted) {
        results.push({ site, gate, outcome: "NOT_ARMED", reason: r.reason });
      } else {
        results.push({
          site,
          gate,
          outcome: r.verdict.status,
          path: relative(repoRoot, r.path),
          runner: r.verdict.runner,
        });
      }
    }
  }
  return results;
}

/**
 * 2 when any FAIL verdict was emitted, else 0. NOT_ARMED never fails the run —
 * absence is the honest state, and CI's own S3 step prints the same convention.
 * @param {EmitResult[]} results
 */
export function exitCodeFor(results) {
  return results.some((r) => r.outcome === "FAIL") ? 2 : 0;
}

/* ------------------------------------------------------------------- CLI */

function parseArgs(argv) {
  const o = { sites: /** @type {string[]|null} */ (null), list: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--site") (o.sites ??= []).push(argv[++i]);
    else if (a === "--list") o.list = true;
    else throw new Error(`unknown argument "${a}"`);
  }
  return o;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const sites = args.sites ?? emitSiteSet();

  console.log(`ci-emit-verdicts — ${sites.length} site(s) × ${EMITTERS.length} emitter(s) [${EMITTERS.map((s) => s.gate).join(", ")}]`);
  for (const [ex, reason] of EXEMPT) console.log(`  EXEMPT ${ex} — ${reason}`);
  if (args.list) {
    for (const s of sites) console.log(`  ${s}`);
    process.exit(0);
  }

  const results = emitAll({ sites });
  let pass = 0, fail = 0, notArmed = 0;
  for (const r of results) {
    if (r.outcome === "NOT_ARMED") {
      notArmed++;
      console.log(`\nNOT ARMED  ${r.site} · ${r.gate} — nothing written (absence stays honest):\n  ${r.reason}`);
    } else {
      r.outcome === "PASS" ? pass++ : fail++;
      console.log(`\n${r.outcome === "PASS" ? "PASS  " : "FAIL  "} ${r.site} · ${r.gate} → ${r.path} (runner ${r.runner}${r.runner === "local" ? " — iteration evidence; ship evidence requires a CI-committed run, §0.2" : ""})`);
    }
  }
  const code = exitCodeFor(results);
  console.log(`\nsummary: ${pass} PASS verdict(s) · ${fail} FAIL verdict(s) · ${notArmed} not-armed`);
  console.log(code === 2
    ? "exit 2 — at least one enforcing command FAILED; its FAIL verdict is written and must be committed like any other evidence."
    : "exit 0 — every armed emitter passed. Verdicts become ship evidence only once a CI job commits them (§0.2).");
  process.exit(code);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  try { main(); } catch (e) { console.error("ci-emit-verdicts harness error:", e.message); process.exit(1); }
}
