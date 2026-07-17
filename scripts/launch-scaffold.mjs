#!/usr/bin/env node
/**
 * launch-scaffold.mjs — one command makes a new site's evidence + CI registration
 * exist BEFORE the build starts, so neither can be forgotten at the end of it.
 *
 * WHY THIS EXISTS. Two misses from the 16-Jul wave (retro-audit 17 Jul,
 * process fixes #1 + #2), both of the class "a step that lives at the END of a
 * tired build session gets skipped":
 *   · no wave site entered the factory-spec CI matrix → the browser gate never
 *     ran on any of them;
 *   · no wave site got its checklists into launches/<domain>/ → the launch-
 *     evidence law existed only as prose.
 * Scaffold time is the one moment a site cannot be forgotten — the session that
 * creates sites/<domain> is wide awake about <domain>. So this script front-loads
 * both duties, and the two CI gates (factory-matrix-lint, launch-evidence-gate)
 * make skipping THIS script fail the PR that adds the site.
 *
 * WHAT IT DOES (idempotent — reruns skip what exists, never overwrite):
 *   1. launches/<domain>/sitewide-checklist.md + pagewise-checklist.md — copies
 *      of the docs/checklists masters with a provenance header; the build FILLS
 *      them (an empty template is for the reviewer to catch — presence is ours).
 *   2. launches/<domain>/screens/.gitkeep — where the evidence screenshots go.
 *   3. Adds "sites/<domain>" to EVERY `site: [...]` matrix in factory-gate.yml
 *      (factory-spec + lighthouse), so the site is tested from its first PR.
 *   4. Prints the gh command Abilash one-clicks to add the new required-check
 *      contexts to branch protection (an admin action — the agent never runs it).
 *
 * Usage: node scripts/launch-scaffold.mjs <domain | sites/domain>
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseMatrices } from "./factory-matrix-lint.mjs";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const WORKFLOW = ".github/workflows/factory-gate.yml";
const MASTERS = [
  ["docs/checklists/sitewide-checklist.md", "sitewide-checklist.md", "docs/checklists/sitewide-migration-checklist.md"],
  ["docs/checklists/pagewise-checklist.md", "pagewise-checklist.md", "docs/checklists/pagewise-migration-checklist.md"],
];

/** Second-precision IST stamp (CLAUDE.md log law) — pure JS, no shell. */
export const istNow = (d = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata", hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")} IST`;
};

/**
 * The one-click branch-protection command for Abilash: every matrix context in
 * the (post-insertion) workflow, plus the static jobs. Owner-only by design —
 * required checks are edited by an admin, never by the agent (CLAUDE.md:
 * the agent cannot self-approve past a gate).
 * @param {string} workflowText
 */
export function requiredChecksCommand(workflowText) {
  const sites = [...new Set(parseMatrices(workflowText).flatMap((m) => m.sites))].sort();
  const contexts = [
    "gate",
    "brand-lint",
    ...sites.map((s) => `factory-spec (${s})`),
    ...sites.map((s) => `lighthouse (${s})`),
  ];
  const flags = contexts.map((c) => `  -f 'contexts[]=${c}'`).join(" \\\n");
  return `gh api -X PATCH repos/kairali-digital/kairali-web-factory/branches/main/protection/required_status_checks \\\n${flags}`;
}

/**
 * Insert a site into every `site: [...]` matrix in workflow YAML text.
 * Pure — testable without touching the real workflow.
 * @param {string} text @param {string} site e.g. "sites/example.com"
 * @returns {{text:string, touched:number, already:number}}
 */
export function insertIntoMatrices(text, site) {
  let touched = 0;
  let already = 0;
  const out = text
    .split(/\r?\n/)
    .map((line) => {
      const m = line.match(/^(\s*site:\s*\[)(.*)(\]\s*)$/);
      if (!m) return line;
      const entries = m[2].split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
      if (entries.includes(site)) { already++; return line; }
      touched++;
      return `${m[1]}${[...entries, site].map((s) => `"${s}"`).join(", ")}${m[3]}`;
    })
    .join("\n");
  return { text: out, touched, already };
}

/** Provenance header stamped onto each scaffolded checklist copy. */
export function checklistHeader(domain, masterPath, when) {
  return [
    `<!-- launches/${domain} — scaffolded by scripts/launch-scaffold.mjs on ${when}.`,
    `     Master: ${masterPath} (Abilash's originals — every item mandatory unless a`,
    `     stricter Launch Checklist gate covers it). FILL EVERY ITEM during the build:`,
    `     [x] done · [ ] pending with an honest note. CLAUDE.md launch-evidence law:`,
    `     "A launch without its filled checklists in the repo is not a launch." -->`,
    "",
  ].join("\n");
}

function main(argv) {
  const arg = argv.find((a) => !a.startsWith("-"));
  if (!arg) {
    console.error("usage: node scripts/launch-scaffold.mjs <domain | sites/domain>");
    return 1;
  }
  const domain = arg.replace(/^sites\//, "").replace(/\/$/, "");
  const site = `sites/${domain}`;
  const when = istNow();
  const actions = [];

  // 1+2 — evidence scaffold
  const launchDir = join(REPO_ROOT, "launches", domain);
  mkdirSync(join(launchDir, "screens"), { recursive: true });
  for (const [masterRel, target, fallbackRel] of MASTERS) {
    const masterPath = existsSync(join(REPO_ROOT, masterRel)) ? masterRel : fallbackRel;
    const dest = join(launchDir, target);
    if (existsSync(dest)) { actions.push(`kept   launches/${domain}/${target} (exists — never overwritten)`); continue; }
    const master = readFileSync(join(REPO_ROOT, masterPath), "utf8");
    writeFileSync(dest, checklistHeader(domain, masterPath, when) + master);
    actions.push(`wrote  launches/${domain}/${target} (from ${masterPath})`);
  }
  const gitkeep = join(launchDir, "screens", ".gitkeep");
  if (!existsSync(gitkeep)) { writeFileSync(gitkeep, ""); actions.push(`wrote  launches/${domain}/screens/.gitkeep`); }

  // 3 — CI matrix self-registration
  const wfPath = join(REPO_ROOT, WORKFLOW);
  const wf = readFileSync(wfPath, "utf8");
  const { text, touched, already } = insertIntoMatrices(wf, site);
  if (touched > 0) {
    writeFileSync(wfPath, text);
    actions.push(`added  ${site} to ${touched} CI matrix(es) in ${WORKFLOW}`);
  }
  if (already > 0) actions.push(`kept   ${site} already in ${already} CI matrix(es)`);
  if (touched === 0 && already === 0) {
    console.error(`launch-scaffold: found NO site matrix in ${WORKFLOW} — the workflow was reformatted; fix insertIntoMatrices or the file.`);
    return 1;
  }

  console.log(`\nlaunch-scaffold — ${domain} · ${when}`);
  for (const a of actions) console.log(`  ${a}`);
  console.log(`
Next (in this order):
  · build the site; FILL both checklists as you go, not after
  · design-qa + seo-aeo-geo audits write their reports into launches/${domain}/
  · logger sub-agent writes the wiki/log.md rollup · LEARNINGS.md gets the retro
  · the PR runs factory-matrix-lint + launch-evidence-gate + factory-spec + lighthouse on ${site}

OWNER ACTION (Abilash — requires admin; the agent never runs this): once the PR
merges, replace the required-check contexts on branch protection with the full
current set (rebuilt from the live matrix, so it is always complete):

${requiredChecksCommand(touched > 0 ? text : wf)}
`);
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    console.error(`launch-scaffold: harness error — ${e.message}`);
    process.exit(1);
  }
}
