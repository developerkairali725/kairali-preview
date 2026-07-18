#!/usr/bin/env node
/**
 * factory-matrix-lint.mjs — the self-registration gate for the factory CI matrix.
 *
 * WHY THIS EXISTS. The factory-spec matrix in .github/workflows/factory-gate.yml
 * carried the comment "Every Factory site adds itself here at scaffold time
 * (Ship Gate A2)" — and then FOUR sites shipped (arogyashala.in, healing.recipes,
 * kairaliyoga.com, kairalihospitality.com, all merged 16–17 Jul 2026) without any
 * of them entering the matrix. The Playwright browser gate never ran on any of
 * them; the green checkmark on their PRs was the OLD sites passing. That is the
 * dead-test failure class for the third time (see factory-gate.yml's own history:
 * the fixed test glob, tests/ktahv-critical-flows outside the glob). A promise in
 * a comment is not a gate. This file makes the promise mechanical: a site that
 * exists on disk but is absent from ANY `site: [...]` matrix in factory-gate.yml
 * fails CI on the PR that adds the site — the miss becomes structurally
 * impossible (retro-audit 17 Jul, process fix #1).
 *
 * WHAT IT CHECKS (against every `site: [...]` matrix found in the workflow —
 * factory-spec AND lighthouse, so the two can never drift apart):
 *   1. every sites/<dir> with a site.config.json is in the matrix, unless it is
 *      in the EXEMPT list below (each exemption is printed LOUDLY every run —
 *      a silent exemption is how the next drift starts);
 *   2. every matrix entry exists on disk (a dead entry means a site was renamed
 *      or removed and the matrix now tests nothing);
 *   3. every exemption still corresponds to a real, un-matrixed site (an
 *      exemption for a site that joined the matrix, or no longer exists, is
 *      stale and must be deleted — exemptions rot too).
 *
 * CONTROL PROBE (§0.6): the YAML "parser" here is a deliberately narrow line
 * scanner. If the workflow is ever reformatted so the scanner finds no matrix,
 * this gate would pass while checking nothing — so a known-good probe document
 * and a known-BAD probe document run through the real code paths first, and the
 * real file yielding zero matrices is itself a failure.
 *
 * Exit codes: 0 = clean · 2 = drift OR broken probe (CI blocks) · 1 = harness error.
 *
 * Usage: node scripts/factory-matrix-lint.mjs [--workflow <path>]
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const WORKFLOW = ".github/workflows/factory-gate.yml";

/**
 * Sites that exist on disk but are deliberately NOT in the CI matrix.
 * Every entry needs Abilash's standing question or ruling as its reason —
 * an exemption without a paper trail is drift wearing a badge.
 */
export const EXEMPT = new Map([
  ["sites/abhilashkr", "imported personal site (brand: none) — STANDING RULING, Abilash 17 Jul 2026 (D-RULE-MATRIX-EXEMPT): stays out of the matrices; exemption stays loud and paper-trailed"],
  ["sites/kairali.ai", "internal placeholder surface (register: internal) — same standing ruling as abhilashkr (D-RULE-MATRIX-EXEMPT, 17 Jul 2026)"],
  ["sites/ayurvedichealingvillage.com", "pipeline-container scaffold: config + armed front-gate ledger, ZERO pages (Workbook Part 4 one-time setup #1; Abilash's 18 Jul 2026 in-chat directive to walk the setup) — a page-less site cannot run factory-spec/lighthouse; joins BOTH matrices in the same PR that adds its first page. TEMPORARY, pending ratification: Q-SCAFFOLD-MATRIX, QUESTIONS.md 18 Jul 2026"],
  ["sites/whyayurveda.org", "pipeline-container scaffold: config + armed front-gate ledger, ZERO pages (Workbook Part 4 one-time setup #2; same 18 Jul 2026 directive) — same rule and same exit as ayurvedichealingvillage.com: matrix entry lands with the first page PR. TEMPORARY, pending ratification: Q-SCAFFOLD-MATRIX, QUESTIONS.md 18 Jul 2026"],
]);

/**
 * Extract every `site: [...]` matrix from workflow YAML text, with the job it
 * belongs to (nearest preceding 2-space-indented `<name>:` line under `jobs:`).
 * @param {string} text
 * @returns {{job:string, line:number, sites:string[]}[]}
 */
export function parseMatrices(text) {
  const matrices = [];
  let job = "<unknown>";
  let inJobs = false;
  text.split(/\r?\n/).forEach((raw, i) => {
    if (/^jobs:\s*$/.test(raw)) { inJobs = true; return; }
    const jobLine = raw.match(/^  ([A-Za-z0-9_-]+):\s*$/);
    if (inJobs && jobLine) job = jobLine[1];
    const m = raw.match(/^\s*site:\s*\[(.*)\]\s*$/);
    if (m) {
      const sites = m[1]
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
      matrices.push({ job, line: i + 1, sites });
    }
  });
  return matrices;
}

/** Every sites/<dir> that carries a site.config.json (the definition of a fleet site). */
export function fleetSites(root = REPO_ROOT) {
  return readdirSync(join(root, "sites"), { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(root, "sites", d.name, "site.config.json")))
    .map((d) => `sites/${d.name}`)
    .sort();
}

/**
 * The lint proper — pure, so the control probe and the tests can drive it.
 * @param {{matrices:{job:string,line:number,sites:string[]}[], sites:string[], exempt:Map<string,string>}} input
 * @returns {string[]} human-readable violations (empty = clean)
 */
export function lint({ matrices, sites, exempt }) {
  const violations = [];
  if (matrices.length === 0) {
    violations.push(`no \`site: [...]\` matrix found in ${WORKFLOW} — the scanner is broken or the workflow was reformatted; this gate checked NOTHING`);
    return violations;
  }
  const siteSet = new Set(sites);
  for (const [ex, reason] of exempt) {
    if (!siteSet.has(ex)) violations.push(`stale exemption: ${ex} is exempt ("${reason}") but no such fleet site exists — delete the exemption`);
  }
  for (const { job, line, sites: matrix } of matrices) {
    const matrixSet = new Set(matrix);
    for (const site of sites) {
      if (!matrixSet.has(site) && !exempt.has(site)) {
        violations.push(`${site} exists (site.config.json present) but is ABSENT from the \`${job}\` matrix (${WORKFLOW}:${line}). Add "${site}" to that matrix — scripts/launch-scaffold.mjs does it for you.`);
      }
    }
    for (const entry of matrix) {
      if (!siteSet.has(entry)) violations.push(`dead matrix entry: \`${job}\` matrix (${WORKFLOW}:${line}) lists "${entry}" but no such fleet site exists on disk`);
      if (exempt.has(entry)) violations.push(`stale exemption: ${entry} is BOTH exempt and in the \`${job}\` matrix — it self-registered; delete the exemption`);
    }
  }
  return violations;
}

// ---------------------------------------------------------------------------
// Control probes — run through the REAL parser and REAL lint before any file.
// ---------------------------------------------------------------------------

const PROBE_GOOD = `
jobs:
  probe-job:
    strategy:
      matrix:
        site: ["sites/a.com", "sites/b.com"]
`;

export function runControlProbes() {
  const broken = [];
  const good = parseMatrices(PROBE_GOOD);
  if (good.length !== 1 || good[0].job !== "probe-job" || good[0].sites.join() !== "sites/a.com,sites/b.com") {
    broken.push(`parser probe: known-good matrix not extracted (got ${JSON.stringify(good)})`);
  }
  // the lint MUST flag a site missing from the matrix…
  const mustFail = lint({ matrices: good, sites: ["sites/a.com", "sites/b.com", "sites/c.com"], exempt: new Map() });
  if (mustFail.length === 0) broken.push("lint probe: a known-missing site was NOT flagged — the gate would pass while checking nothing");
  // …and must NOT flag a complete one (a gate that always fails gets deleted).
  const mustPass = lint({ matrices: good, sites: ["sites/a.com", "sites/b.com"], exempt: new Map() });
  if (mustPass.length !== 0) broken.push(`lint anti-probe: a complete matrix was flagged (${mustPass[0]})`);
  return broken;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function main(argv) {
  const wfArg = argv.indexOf("--workflow");
  const wfPath = resolve(REPO_ROOT, wfArg >= 0 ? argv[wfArg + 1] : WORKFLOW);

  const broken = runControlProbes();
  if (broken.length > 0) {
    console.error("\nfactory-matrix-lint: CONTROL PROBE FAILED — this gate did not run.");
    for (const b of broken) console.error(`  ✗ ${b}`);
    return 2;
  }

  const matrices = parseMatrices(readFileSync(wfPath, "utf8"));
  const sites = fleetSites();
  const violations = lint({ matrices, sites, exempt: EXEMPT });

  console.log(`\nfactory-matrix-lint — ${sites.length} fleet sites vs ${matrices.length} matrix(es) in ${WORKFLOW}`);
  for (const [ex, reason] of EXEMPT) console.log(`  EXEMPT ${ex} — ${reason}`);

  if (violations.length === 0) {
    console.log(`\nPASS — every fleet site is in every matrix (${matrices.map((m) => m.job).join(", ")}); no dead entries, no stale exemptions.\n`);
    return 0;
  }
  for (const v of violations) console.log(`\nDRIFT  ${v}`);
  console.log(`\nFAIL — ${violations.length} drift finding${violations.length === 1 ? "" : "s"}. A site outside the matrix ships untested — that is how the 16-Jul wave shipped with the browser gate never run. Fix the matrix, never the gate (CLAUDE.md rule g).\n`);
  return 2;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    console.error(`factory-matrix-lint: harness error — ${e.message}`);
    process.exit(1);
  }
}
