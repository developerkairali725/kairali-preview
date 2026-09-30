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
 *   3. launches/<domain>/design-intake/README.md + REFERENCES.md — the human's
 *      drop-box. A designer/marketer/intern puts the design here BEFORE the
 *      build; the agent implements it and does not redesign it (CLAUDE.md
 *      "Design source", MODE A). REFERENCES.md holds the owner's aesthetic
 *      anchors and is what MODE B is allowed to reason from when the drop-box
 *      is empty — so even the fallback is anchored, never invented.
 *   4. launches/<domain>/approvals.yaml — the signed front-gate ledger
 *      (brief · strategy · design_source · golden_page, + design_direction in
 *      MODE B), all rows born `pending`. scripts/front-gate.mjs makes an
 *      unsigned row un-mergeable, so this file is the reason a site cannot be
 *      built before the owner has approved what it is.
 *   5. Adds "sites/<domain>" to EVERY `site: [...]` matrix in factory-gate.yml
 *      (factory-spec + lighthouse), so the site is tested from its first PR.
 *   6. Prints the gh command Abilash one-clicks to add the new required-check
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
/** The front-gate ledger's filename — front-gate.mjs is the enforcer. */
export const LEDGER_FILE = "approvals.yaml";
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
    "front-gate", // session 2D — un-required, it is advice; required, it is a gate
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

/**
 * The human's drop-box instructions. Written for a designer/marketer/intern who
 * has never read CLAUDE.md and never will — so it says what to drop and where,
 * in their language, and nothing else.
 */
export function designIntakeReadme(domain, when) {
  return `# Design intake — ${domain}

<!-- scaffolded by scripts/launch-scaffold.mjs on ${when} -->

**This folder is where the design for ${domain} comes from. A human fills it. The
build reads it.** Nothing gets built here until something is in it (or the owner
explicitly rules MODE B — see the bottom).

## What to drop in — ONE of these three is REQUIRED

1. **Exported design frames or screenshots** — Figma/XD/Canva exports, or clean
   screenshots of the design. PNG or JPG, one file per page or per section.
   Name them so the order is obvious: \`01-home-hero.png\`, \`02-home-treatments.png\`.
2. **Reference-site URLs** — if the design *is* "make it like this site". Put them
   in a file called \`reference-sites.md\` here, one URL per line, each with one
   line saying what you want taken from it (layout? colour? typography? the feel?).
   "Like X" without saying *what* about X is not a design — it is a guess request.
3. **A wireframe** — hand-drawn and photographed is fine. Boxes and labels beat
   a paragraph describing boxes and labels.

## Also required: the page and section order

Add a file \`page-order.md\` here listing the pages the site has, top to bottom,
and inside each page the sections in order. Example:

\`\`\`
Home: hero → what we treat → the doctors → testimonials → enquiry
About: story → the family → the centres → press
Contact: form → map → phone/WhatsApp
\`\`\`

Without this the build has to invent the sitemap, and inventing the sitemap is
exactly what these gates exist to stop.

## What happens next

The agent **implements what is here, faithfully.** It does not redesign it,
re-theme it, restyle it, or "improve" it. If something in the supplied design
looks broken — layout that cannot work responsively, an accessibility problem
(contrast, tap targets, focus), or something off-brand against the brand manual
— the agent **stops and flags it to the owner**. It never silently overrides your
design. Your design is the authority; the agent executes it.

Then: the owner signs \`design_source\` in \`../approvals.yaml\`, the agent builds
**one page** (the golden page — the homepage unless the brief names another),
stops again for \`golden_page\` approval, and only then builds the rest to match.

## If this folder stays empty (MODE B — fallback, not the plan)

The agent proposes **one** design direction — tokens plus a single hero mockup —
reasoned from \`REFERENCES.md\` in this folder, never from nothing. It then STOPS
for the owner's approval before any page is built. MODE B costs an extra gate
(\`design_direction\`) precisely because it is the mode where the agent is doing a
human's job.
`;
}

/**
 * The owner's aesthetic anchors. MODE B's ONLY legitimate input — the rule that
 * a fallback design direction is anchored to something he has actually pointed
 * at, rather than invented and then defended.
 */
export function designIntakeReferences(domain, when) {
  return `# Aesthetic references — ${domain}

<!-- scaffolded by scripts/launch-scaffold.mjs on ${when} -->

**Owner-supplied only.** This is Abilash's "sites I like" list for ${domain}.
It is the ONLY thing MODE B is allowed to reason from when \`design-intake/\` has
no human design in it (CLAUDE.md "Design source", MODE B). An agent that invents
a direction from nothing and calls it a proposal has skipped the gate, not passed it.

The agent does NOT write this file. If it is empty and a design is needed, the
answer is to ask the owner — not to fill it in on his behalf.

## Sites / references

<!-- One per line. What matters is WHICH PART you like — "the whole thing" is
     not actionable. Format:
     - <url or name> — what to take from it (layout / colour / type / motion / feel)
-->

-

## Anti-references — what this site must NOT look like

<!-- Just as useful. "Not another AI-generic wellness template" belongs here. -->

-

## Non-negotiables from the brand manual

<!-- The brand manuals win over any reference above (CLAUDE.md doctrine (d):
     design skills/plugins NEVER override packages/ui/brand-tokens.css or
     raag-tokens.css). Note anything here that a reference would violate. -->

-
`;
}

/**
 * The signed front-gate ledger. Every row is born `pending`: the file's whole
 * purpose is to be un-signed until the owner says a word, and to make the
 * un-signed state block the build (scripts/front-gate.mjs).
 */
export function approvalsLedger(domain, when) {
  return `# launches/${domain}/approvals.yaml — the signed FRONT-GATE ledger.
#
# scaffolded by scripts/launch-scaffold.mjs on ${when}
#
# THE RULE (CLAUDE.md "Design source" / "Golden page" / "Stop at each gate"):
# the build runs to the next unsigned gate, posts the artifact, and STOPS. The
# owner replies APPROVE <gate> or CHANGES <notes>, in one word, from his phone.
# On APPROVE the agent writes the row below and commits it. The agent NEVER
# self-approves a gate and NEVER merges its own PR.
#
# scripts/front-gate.mjs FAILS any PR that adds or changes pages under
# sites/${domain} while a required row here is not "approved". CI does not judge
# the brief or the design — it only checks the row exists and is signed.
#
# Order: brief → strategy → design_source (+ design_direction in MODE B)
#        → golden_page → full build.

domain: ${domain}

# MODE A = a human supplied the design in design-intake/ — the agent IMPLEMENTS
#          it faithfully and must not redesign it. DEFAULT and preferred.
# MODE B = design-intake/ is empty — the agent proposes ONE direction, anchored
#          to design-intake/REFERENCES.md, and needs design_direction signed too.
# Set this deliberately at the start of the run. It is not a formality: it
# decides who is doing the designing.
mode: A

approvals:
  # What the site is, who it is for, what it must achieve. The golden page is
  # the homepage unless this brief names another page.
  - gate: brief
    status: pending
    owner:
    date:
    artifact:

  # ONE approval, everything plannable batched in — so the stops stay few:
  #   · the sitemap
  #   · primary + secondary keywords PER PAGE
  #   · the competitor-keyword-to-page map
  #   · the integrations plan — which events fire, which forms, chatbot/voice
  - gate: strategy
    status: pending
    owner:
    date:
    artifact:

  # Which mode, and the design that is being implemented (MODE A: what is in
  # design-intake/. MODE B: the confirmation that it is legitimately empty).
  - gate: design_source
    status: pending
    owner:
    date:
    artifact:

  # MODE B ONLY — delete this row in MODE A. The agent's single proposed
  # direction: tokens + one hero mockup, anchored to REFERENCES.md.
  # front-gate.mjs requires this row when mode is B.
  - gate: design_direction
    status: pending
    owner:
    date:
    artifact:

  # ONE page built, then STOP. Every later page must match this approved page.
  # No full-site build before this row is signed.
  - gate: golden_page
    status: pending
    owner:
    date:
    artifact:
`;
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

  // 3+4 — the FRONT gates: the human's drop-box and the signed ledger. Written
  // at scaffold time for the same reason as the checklists — the session that
  // creates the site is the one moment nobody has forgotten about the site.
  mkdirSync(join(launchDir, "design-intake"), { recursive: true });
  const fronts = [
    ["design-intake/README.md", designIntakeReadme(domain, when)],
    ["design-intake/REFERENCES.md", designIntakeReferences(domain, when)],
    [LEDGER_FILE, approvalsLedger(domain, when)],
  ];
  for (const [rel, body] of fronts) {
    const dest = join(launchDir, rel);
    if (existsSync(dest)) { actions.push(`kept   launches/${domain}/${rel} (exists — never overwritten)`); continue; }
    writeFileSync(dest, body);
    actions.push(`wrote  launches/${domain}/${rel}`);
  }

  // 5 — CI matrix self-registration
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
DO NOT START BUILDING. The front gates come first (CLAUDE.md "Design source",
"Golden page", "Stop at each gate"). In this order:
  · a HUMAN drops the design into launches/${domain}/design-intake/ (that folder's
    README says exactly what) → MODE A. Only if it stays empty is this MODE B,
    and MODE B needs design_direction signed as well.
  · run to the next unsigned row in launches/${domain}/approvals.yaml, post the
    artifact, and STOP with one line: "reply APPROVE <gate> or CHANGES <notes>".
    On APPROVE, write and commit the row yourself. Never self-approve. Never merge.
  · order: brief → strategy → design_source (+ design_direction in B) → golden_page
  · golden_page = ONE page built, then STOP. The rest of the site only after it is
    signed, and every later page matches it.
  · front-gate.mjs fails the PR if a page lands under sites/${domain} ahead of its row.

Then (once golden_page is signed):
  · build the rest; FILL both checklists as you go, not after
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

// NOTE: comparing import.meta.url to process.argv[1] as raw STRINGS silently
// broke on any checkout path containing a space — import.meta.url percent-encodes
// it, argv[1] does not — so main() never ran and the script exited 0 having
// checked NOTHING. Normalising argv[1] through URL() fixes it with no new import.
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    console.error(`launch-scaffold: harness error — ${e.message}`);
    process.exit(1);
  }
}
