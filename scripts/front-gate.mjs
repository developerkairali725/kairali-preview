#!/usr/bin/env node
/**
 * front-gate.mjs — an unapproved build is un-mergeable.
 *
 * WHY THIS EXISTS. Session 2C hardened the BACK of the pipeline: once a build
 * had happened, launch-evidence-gate + factory-matrix-lint made its evidence
 * and its CI registration impossible to forget. Nothing guarded the FRONT. The
 * agent could brief itself, invent a sitemap, invent a design direction, build
 * eight pages, and only then meet a gate — by which point the owner's only
 * real options are "accept it" or "throw away a session". Every approval that
 * arrives after the work is a rubber stamp wearing a gate's uniform.
 *
 * So the front gates move BEFORE the build, and this script is what makes them
 * cost something: a PR that adds or changes pages under sites/<domain> while
 * launches/<domain>/approvals.yaml lacks a signed row FAILS. CI does not judge
 * the brief, the strategy, the design or the golden page — judgment is the
 * owner's and stays the owner's. CI checks only that the row EXISTS and is
 * SIGNED. That is the whole trick: the gate cannot be talked around, and it
 * cannot be self-approved, because the agent writing `status: approved` without
 * the owner's word is falsifying a ledger, not passing a check.
 *
 * ARMING RULE (the honest boundary — read this before trusting a green run).
 * A domain is ARMED when launches/<domain>/approvals.yaml exists. Consequences,
 * stated plainly rather than buried:
 *   · every NEW site is armed by construction — launch-scaffold.mjs writes the
 *     ledger, and a PR that adds sites/<domain>/site.config.json with NO ledger
 *     fails right here (§ newSiteWithoutLedger). Skipping the scaffold is not
 *     an escape route; it is the loudest possible failure.
 *   · deleting a ledger fails the PR that deletes it. An armed domain cannot be
 *     disarmed by the agent — only by the owner, in his own commit.
 *   · the eight sites built BEFORE this gate existed carry no ledger, so page
 *     changes to them are NOT blocked. They are printed as UNARMED on every run
 *     (never silently skipped — a silent exemption is how the next drift
 *     starts, see factory-matrix-lint's EXEMPT list). Retro-fitting them is an
 *     owner decision, not the agent's: it would make the next typo fix on a
 *     live site unmergeable until four rows are signed for a site that already
 *     shipped. Logged for ratification, not assumed.
 *
 * WHAT COUNTS AS A PAGE. Anything under sites/<domain>/{app,pages,content}/ or
 * a *.tsx/*.mdx/*.md file anywhere under sites/<domain>/. Config, tests and
 * assets do not arm the gate — a dependency bump or a test fix on an approved
 * site is not a design decision and must not need a design approval.
 *
 * CONTROL PROBE (§0.6). The ledger "parser" here is a narrow line scanner, not
 * a YAML library (this repo has no yaml dependency, and a hand-rolled parser
 * that quietly misreads a file is worse than none). So: it FAILS LOUDLY on
 * anything it does not understand — an unparseable ledger is a gate failure,
 * never a pass — and known-good/known-bad probe documents run through the real
 * code paths before any real file is read.
 *
 * Exit codes: 0 = clean · 2 = unapproved build OR broken probe (CI blocks) · 1 = harness error.
 *
 * Usage: node scripts/front-gate.mjs [--base <ref>] [--root <repo-root>]
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Rows every ledger must carry, signed, before pages may be built. */
export const REQUIRED_GATES = ["brief", "strategy", "design_source", "golden_page"];
/** Mode B invents a design direction, so Mode B must have it signed too. */
export const MODE_B_GATE = "design_direction";
/** The only statuses a row may carry. Anything else = unparseable = FAIL. */
export const VALID_STATUS = ["pending", "approved", "changes"];
export const LEDGER = "approvals.yaml";

/**
 * Does this path represent a page (as opposed to config/test/asset)?
 * @param {string} p repo-relative path
 * @returns {string|null} the domain, or null if not a site page
 */
export function pageDomain(p) {
  const m = p.match(/^sites\/([^/]+)\/(.+)$/);
  if (!m) return null;
  const [, domain, rest] = m;
  if (/^(app|pages|content)\//.test(rest)) return domain;
  if (/\.(tsx|mdx|md)$/.test(rest) && !/(^|\/)(test|tests|__tests__)\//.test(rest)) return domain;
  return null;
}

/** A PR that introduces sites/<domain>/site.config.json is introducing a site. */
export function newSiteDomain(p) {
  const m = p.match(/^sites\/([^/]+)\/site\.config\.json$/);
  return m ? m[1] : null;
}

/**
 * Narrow scanner for the approvals ledger. Deliberately strict: it understands
 * exactly the shape launch-scaffold.mjs writes and rejects everything else, so
 * a malformed or creatively-reformatted ledger blocks rather than waves through.
 * @param {string} text
 * @returns {{domain:string|null, mode:string|null, rows:Array<{gate:string,status:string,owner:string,date:string,artifact:string}>, errors:string[]}}
 */
export function parseApprovals(text) {
  const errors = [];
  const rows = [];
  let domain = null;
  let mode = null;
  let cur = null;
  let inApprovals = false;

  const push = () => { if (cur) { rows.push(cur); cur = null; } };

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/\s+$/, "");
    if (!line || /^\s*#/.test(line)) continue;

    let m;
    if ((m = line.match(/^domain:\s*(\S+)\s*$/))) { domain = m[1]; continue; }
    if ((m = line.match(/^mode:\s*([AB])\s*$/))) { mode = m[1]; continue; }
    if (/^mode:/.test(line)) { errors.push(`mode must be exactly "A" or "B" — got ${JSON.stringify(line)}`); continue; }
    if (/^approvals:\s*$/.test(line)) { inApprovals = true; continue; }

    if ((m = line.match(/^\s*-\s*gate:\s*(\S+)\s*$/))) {
      if (!inApprovals) { errors.push(`gate row outside the "approvals:" block: ${JSON.stringify(line)}`); continue; }
      push();
      cur = { gate: m[1], status: "", owner: "", date: "", artifact: "" };
      continue;
    }
    if ((m = line.match(/^\s+(status|owner|date|artifact|commit):\s*(.*)$/))) {
      if (!cur) { errors.push(`"${m[1]}" appears before any "- gate:" row`); continue; }
      const key = m[1] === "commit" ? "artifact" : m[1];
      cur[key] = m[2].trim();
      continue;
    }
    errors.push(`line not understood by the ledger scanner: ${JSON.stringify(line)}`);
  }
  push();

  if (!domain) errors.push(`no "domain:" line`);
  if (!mode) errors.push(`no "mode:" line — every run declares MODE A (human-supplied design) or MODE B (agent-proposed)`);
  if (rows.length === 0) errors.push(`no gate rows found under "approvals:"`);
  for (const r of rows) {
    if (!VALID_STATUS.includes(r.status)) {
      errors.push(`gate "${r.gate}": status must be one of ${VALID_STATUS.join(" | ")} — got ${JSON.stringify(r.status)}`);
    }
  }
  return { domain, mode, rows, errors };
}

/**
 * Which required rows are not signed? Pure — the heart of the gate.
 * @param {{domain:string, mode:string|null, rows:Array<{gate:string,status:string,owner:string,date:string,artifact:string}>}} ledger
 * @returns {string[]} human-readable blockers (empty = every required row signed)
 */
export function unsignedGates({ domain, mode, rows }) {
  const required = [...REQUIRED_GATES];
  if (mode === "B") required.splice(required.indexOf("design_source") + 1, 0, MODE_B_GATE);
  const byGate = new Map(rows.map((r) => [r.gate, r]));
  const out = [];
  for (const g of required) {
    const row = byGate.get(g);
    if (!row) { out.push(`${g}: NO ROW in launches/${domain}/${LEDGER} — the gate was never opened`); continue; }
    if (row.status !== "approved") {
      out.push(`${g}: status "${row.status}" — the owner has not signed this gate${row.status === "changes" ? " (he asked for changes)" : ""}`);
      continue;
    }
    const blank = ["owner", "date", "artifact"].filter((k) => !row[k]);
    if (blank.length > 0) out.push(`${g}: status "approved" but ${blank.join(" + ")} blank — an unsigned approval is not an approval`);
  }
  return out;
}

/**
 * The full check. Pure — no filesystem, no git — so both directions are testable.
 * @param {{changed:Array<{status:string,path:string}>, ledgers:Record<string,string|null>}} input
 *   changed: git name-status over the PR's diff ("A"|"M"|"D"|"R…")
 *   ledgers: { "<domain>": <ledger text> | null-if-absent } for every touched domain
 * @returns {{blockers:string[], unarmed:string[], armed:string[]}}
 */
export function checkFrontGate({ changed, ledgers }) {
  const blockers = [];
  const unarmed = new Set();
  const armed = new Set();

  // A ledger may never be deleted by the agent — that would disarm the gate.
  for (const { status, path } of changed) {
    const m = path.match(/^launches\/([^/]+)\/approvals\.yaml$/);
    if (m && status.startsWith("D")) {
      blockers.push(`launches/${m[1]}/${LEDGER} is DELETED in this PR — a ledger is removed by the owner, in his own commit, never by a build. Restore it.`);
    }
  }

  // A new site with no ledger at all: the scaffold was skipped.
  for (const { status, path } of changed) {
    if (!status.startsWith("A")) continue;
    const d = newSiteDomain(path);
    if (d && !ledgers[d]) {
      blockers.push(`sites/${d} is NEW but has no launches/${d}/${LEDGER} — run \`node scripts/launch-scaffold.mjs ${d}\` and take the front gates in order (brief → strategy → design_source → golden_page). A site cannot enter the factory unbriefed.`);
    }
  }

  const touched = new Map();
  for (const { status, path } of changed) {
    if (status.startsWith("D")) continue; // deleting a page is not building one
    const d = pageDomain(path);
    if (!d) continue;
    if (!touched.has(d)) touched.set(d, []);
    touched.get(d).push(path);
  }

  for (const [domain, paths] of [...touched].sort()) {
    const text = ledgers[domain];
    if (!text) { unarmed.add(domain); continue; }
    armed.add(domain);
    const parsed = parseApprovals(text);
    if (parsed.errors.length > 0) {
      for (const e of parsed.errors) blockers.push(`launches/${domain}/${LEDGER} unreadable — ${e}`);
      continue;
    }
    const unsigned = unsignedGates({ domain, mode: parsed.mode, rows: parsed.rows });
    for (const u of unsigned) {
      blockers.push(`sites/${domain} (MODE ${parsed.mode}) — ${paths.length} page file(s) changed, but ${u}`);
    }
  }

  return { blockers, unarmed: [...unarmed].sort(), armed: [...armed].sort() };
}

// ---------------------------------------------------------------------------
// Control probes — the real checker, known-bad and known-good inputs, every run.
// ---------------------------------------------------------------------------

const PROBE_LEDGER = (status) => `
domain: probe.example
mode: A
approvals:
  - gate: brief
    status: ${status}
    owner: Abilash
    date: 2026-07-18 09:00:00 IST
    artifact: docs/site-briefs/probe.example.md
  - gate: strategy
    status: ${status}
    owner: Abilash
    date: 2026-07-18 09:00:00 IST
    artifact: docs/strategy/probe.example.md
  - gate: design_source
    status: ${status}
    owner: Abilash
    date: 2026-07-18 09:00:00 IST
    artifact: launches/probe.example/design-intake/
  - gate: golden_page
    status: ${status}
    owner: Abilash
    date: 2026-07-18 09:00:00 IST
    artifact: https://preview.example/home
`;

export function runControlProbes() {
  const broken = [];
  const page = [{ status: "M", path: "sites/probe.example/app/page.tsx" }];

  const signed = checkFrontGate({ changed: page, ledgers: { "probe.example": PROBE_LEDGER("approved") } });
  if (signed.blockers.length !== 0) {
    broken.push(`anti-probe: a fully signed ledger was blocked (${signed.blockers[0]}) — the gate would block every approved build`);
  }

  const pending = checkFrontGate({ changed: page, ledgers: { "probe.example": PROBE_LEDGER("pending") } });
  if (pending.blockers.length !== 4) {
    broken.push(`probe: an all-pending ledger reported ${pending.blockers.length}/4 blockers — the gate would under-report`);
  }

  const missing = checkFrontGate({ changed: page, ledgers: { "probe.example": null } });
  if (missing.blockers.length !== 0 || missing.unarmed.length !== 1) {
    broken.push(`probe: a page change with no ledger did not land in UNARMED — the arming rule is broken`);
  }

  const newSite = checkFrontGate({
    changed: [{ status: "A", path: "sites/probe.example/site.config.json" }],
    ledgers: { "probe.example": null },
  });
  if (newSite.blockers.length !== 1) {
    broken.push(`probe: a NEW site with no ledger was not blocked — the scaffold could be skipped`);
  }

  const deleted = checkFrontGate({
    changed: [{ status: "D", path: "launches/probe.example/approvals.yaml" }],
    ledgers: { "probe.example": null },
  });
  if (deleted.blockers.length !== 1) broken.push(`probe: deleting a ledger was not blocked — an armed gate could be disarmed`);

  const garbage = parseApprovals("this is not a ledger at all\n");
  if (garbage.errors.length === 0) broken.push(`probe: unparseable ledger text produced no errors — a malformed ledger would pass`);

  // Mode B needs design_direction; the same ledger in Mode A must not need it.
  const modeB = checkFrontGate({ changed: page, ledgers: { "probe.example": PROBE_LEDGER("approved").replace("mode: A", "mode: B") } });
  if (modeB.blockers.length !== 1 || !modeB.blockers[0].includes(MODE_B_GATE)) {
    broken.push(`probe: MODE B did not require ${MODE_B_GATE} — the agent could invent a design direction unsigned`);
  }

  // A config-only change on an unapproved site must NOT be blocked.
  const configOnly = checkFrontGate({
    changed: [{ status: "M", path: "sites/probe.example/site.config.json" }],
    ledgers: { "probe.example": PROBE_LEDGER("pending") },
  });
  if (configOnly.blockers.length !== 0) {
    broken.push(`anti-probe: a config-only change was blocked — dependency bumps and test fixes would need design approval`);
  }

  return broken;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

/** git name-status over base..HEAD. Never guesses: an unresolvable base is fatal. */
function changedFiles(root, base) {
  const git = (args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  let mergeBase;
  const candidates = [base, "origin/main", "main"].filter((b) => b && !/^0{7,}$/.test(b));
  for (const c of candidates) {
    try { mergeBase = git(["merge-base", c, "HEAD"]); break; } catch { /* try the next */ }
  }
  if (!mergeBase) {
    throw new Error(`cannot resolve a base commit to diff against (tried: ${candidates.join(", ") || "nothing"}). In CI pass --base <sha>; the gate refuses to guess, because guessing means passing.`);
  }
  const out = git(["diff", "--name-status", `${mergeBase}`, "HEAD"]);
  if (!out) return [];
  return out.split("\n").map((l) => {
    const [status, ...rest] = l.split("\t");
    return { status, path: rest[rest.length - 1] };
  });
}

function main(argv) {
  const rootArg = argv.indexOf("--root");
  const root = resolve(rootArg >= 0 ? argv[rootArg + 1] : REPO_ROOT);
  const baseArg = argv.indexOf("--base");
  const base = baseArg >= 0 ? argv[baseArg + 1] : "";

  const broken = runControlProbes();
  if (broken.length > 0) {
    console.error("\nfront-gate: CONTROL PROBE FAILED — this gate did not run.");
    for (const b of broken) console.error(`  ✗ ${b}`);
    return 2;
  }

  const changed = changedFiles(root, base);
  const domains = new Set();
  for (const { path } of changed) {
    const d = pageDomain(path) || newSiteDomain(path) || path.match(/^launches\/([^/]+)\//)?.[1];
    if (d) domains.add(d);
  }
  const ledgers = {};
  for (const d of domains) {
    const p = join(root, "launches", d, LEDGER);
    ledgers[d] = existsSync(p) ? readFileSync(p, "utf8") : null;
  }

  const { blockers, unarmed, armed } = checkFrontGate({ changed, ledgers });

  console.log(`\nfront-gate — ${changed.length} changed file(s) · ${armed.length} armed domain(s) · ${unarmed.length} unarmed`);
  if (armed.length > 0) console.log(`  ARMED (ledger present, rows enforced): ${armed.join(", ")}`);
  if (unarmed.length > 0) {
    console.log(`  UNARMED (no launches/<domain>/${LEDGER} — built before the front gates existed, listed so nothing hides): ${unarmed.join(", ")}`);
    console.log(`           Retro-fitting a ledger onto a shipped site is an OWNER decision (it makes the next typo fix wait on four signatures) — not the agent's to assume.`);
  }

  if (blockers.length === 0) {
    console.log(`\nPASS — no page was built ahead of its signed approval.\n`);
    return 0;
  }
  for (const b of blockers) console.log(`\nBLOCK  ${b}`);
  console.log(`
FAIL — ${blockers.length} unapproved build issue${blockers.length === 1 ? "" : "s"}. CLAUDE.md "Design source" + "Golden page" + "Stop at each gate": the order is brief → strategy → design_source${"" /* +design_direction in B */} → golden_page → full build, and the owner signs each one in a word. CI does not judge your brief or your design — it only refuses to let an unsigned one merge. Post the artifact, ask for APPROVE, and write the row when he says it.
`);
  return 2;
}

// NOTE: comparing import.meta.url to process.argv[1] as raw STRINGS silently
// broke on any checkout path containing a space — import.meta.url percent-encodes
// it, argv[1] does not — so main() never ran and the script exited 0 having
// checked NOTHING. Normalising argv[1] through URL() fixes it with no new import.
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    console.error(`front-gate: harness error — ${e.message}`);
    process.exit(1);
  }
}
