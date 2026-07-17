#!/usr/bin/env node
/**
 * launch-evidence-gate.mjs — audit reports without the evidence set block the PR.
 *
 * WHY THIS EXISTS. CLAUDE.md's launch-evidence law ("a launch without its filled
 * checklists in the repo is not a launch") relied on the agent REMEMBERING it at
 * the end of a build session. For the entire 16-Jul wave (4 sites), memory
 * failed: design-qa and seo-aeo-geo reports were written, but no filled
 * checklists, no wiki/log.md entries, no LEARNINGS retros — a full evidence
 * layer skipped, discovered only by the 17-Jul retro-audit, repaired only by a
 * dedicated backfill session (PR #88). This gate makes the law mechanical
 * (retro-audit process fix #2): the moment a launches/<domain>/ folder carries
 * an audit report, the rest of the evidence set is REQUIRED, in the same PR.
 *
 * ARMING RULE. A launch dir is "armed" when it contains design-qa-report.md or
 * seo-aeo-geo-report.md — those are written by the design-qa / seo-aeo-geo
 * sub-agents at the end of a build (CLAUDE.md rule n), so their presence marks
 * "a build round happened here". An armed dir must have:
 *   · sitewide-checklist.md   (filled master — scripts/launch-scaffold.mjs seeds it)
 *   · pagewise-checklist.md   (ditto)
 *   · a wiki/log.md entry mentioning the domain      (logger sub-agent, layer 2)
 *   · a LEARNINGS.md entry mentioning the domain     (the retro)
 * Unarmed dirs (screenshots-only, design-review.md-only) are listed loudly and
 * skipped — arogyakendra/kairali.com/whatisayurveda predate the report ritual.
 *
 * The checklist templates and the wiki/LEARNINGS entries are prose written by
 * people/agents — this gate checks PRESENCE, not quality. Quality stays with
 * the humans and the auditor agents; absence is what kept slipping.
 *
 * Exit codes: 0 = clean · 2 = evidence debt OR broken probe (CI blocks) · 1 = harness error.
 *
 * Usage: node scripts/launch-evidence-gate.mjs [--root <repo-root>]
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Reports whose presence arms the gate for a launch dir. */
export const ARMING_REPORTS = ["design-qa-report.md", "seo-aeo-geo-report.md"];
/** Files the armed dir must contain. */
export const REQUIRED_FILES = ["sitewide-checklist.md", "pagewise-checklist.md"];
/** Repo-level logs that must mention the domain. */
export const REQUIRED_MENTIONS = ["wiki/log.md", "LEARNINGS.md"];

/**
 * Pure check for one launch dir — testable without a filesystem.
 * @param {{domain:string, files:string[], mentions:Record<string,string>}} input
 *   files: filenames present in launches/<domain>/
 *   mentions: { "wiki/log.md": <full text>, "LEARNINGS.md": <full text> }
 * @returns {{armed:boolean, missing:string[]}}
 */
export function checkLaunchDir({ domain, files, mentions }) {
  const fileSet = new Set(files);
  const armed = ARMING_REPORTS.some((r) => fileSet.has(r));
  if (!armed) return { armed, missing: [] };
  const missing = [];
  for (const f of REQUIRED_FILES) {
    if (!fileSet.has(f)) missing.push(`launches/${domain}/${f} — run scripts/launch-scaffold.mjs ${domain}, then FILL it (an unfilled template is caught by human review, not this gate)`);
  }
  for (const log of REQUIRED_MENTIONS) {
    if (!mentions[log]?.includes(domain)) missing.push(`${log} has no entry mentioning ${domain} — ${log === "wiki/log.md" ? "invoke the logger sub-agent for the layer-2 rollup" : "write the build retro"}`);
  }
  return { armed, missing };
}

// ---------------------------------------------------------------------------
// Control probes — the real checker, known-bad and known-good inputs, every run.
// ---------------------------------------------------------------------------

export function runControlProbes() {
  const broken = [];
  const bad = checkLaunchDir({
    domain: "probe.example",
    files: ["design-qa-report.md"], // armed, everything else missing
    mentions: { "wiki/log.md": "", "LEARNINGS.md": "" },
  });
  if (!bad.armed || bad.missing.length !== 4) {
    broken.push(`probe: an armed dir missing all 4 evidence items reported ${bad.missing.length}/4 — the gate would under-report`);
  }
  const good = checkLaunchDir({
    domain: "probe.example",
    files: ["design-qa-report.md", "sitewide-checklist.md", "pagewise-checklist.md"],
    mentions: { "wiki/log.md": "… probe.example shipped …", "LEARNINGS.md": "… probe.example retro …" },
  });
  if (good.missing.length !== 0) broken.push(`anti-probe: a complete evidence set was flagged (${good.missing[0]})`);
  const unarmed = checkLaunchDir({ domain: "probe.example", files: ["design-review.md", "home.png"], mentions: {} });
  if (unarmed.armed) broken.push("anti-probe: a dir with no audit report was armed — legacy screenshot dirs would all go red");
  return broken;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function main(argv) {
  const rootArg = argv.indexOf("--root");
  const root = resolve(rootArg >= 0 ? argv[rootArg + 1] : REPO_ROOT);

  const broken = runControlProbes();
  if (broken.length > 0) {
    console.error("\nlaunch-evidence-gate: CONTROL PROBE FAILED — this gate did not run.");
    for (const b of broken) console.error(`  ✗ ${b}`);
    return 2;
  }

  const launches = join(root, "launches");
  if (!existsSync(launches)) {
    console.error("launch-evidence-gate: no launches/ directory — the walk is broken, not the repo clean (§0.6).");
    return 2;
  }
  const mentions = {};
  for (const log of REQUIRED_MENTIONS) {
    mentions[log] = existsSync(join(root, log)) ? readFileSync(join(root, log), "utf8") : "";
  }

  const dirs = readdirSync(launches, { withFileTypes: true }).filter((d) => d.isDirectory());
  let armedCount = 0;
  const debt = [];
  const unarmed = [];
  for (const d of dirs) {
    const files = readdirSync(join(launches, d.name));
    const { armed, missing } = checkLaunchDir({ domain: d.name, files, mentions });
    if (!armed) { unarmed.push(d.name); continue; }
    armedCount++;
    for (const m of missing) debt.push(`launches/${d.name}: ${m}`);
  }

  console.log(`\nlaunch-evidence-gate — ${dirs.length} launch dirs · ${armedCount} armed (audit report present) · ${unarmed.length} unarmed`);
  if (unarmed.length > 0) console.log(`  UNARMED (no design-qa/seo report yet — pre-ritual dirs, listed so nothing hides): ${unarmed.join(", ")}`);

  if (debt.length === 0) {
    console.log(`\nPASS — every armed launch dir carries its full evidence set (checklists + wiki/log + LEARNINGS).\n`);
    return 0;
  }
  for (const item of debt) console.log(`\nDEBT  ${item}`);
  console.log(`\nFAIL — ${debt.length} missing evidence item${debt.length === 1 ? "" : "s"}. CLAUDE.md: "A launch without its filled checklists in the repo is not a launch." The 16-Jul wave skipped this layer entirely and it cost a dedicated backfill session (PR #88) — ship the evidence in THIS PR, never a later one.\n`);
  return 2;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    console.error(`launch-evidence-gate: harness error — ${e.message}`);
    process.exit(1);
  }
}
