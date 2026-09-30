#!/usr/bin/env node
/**
 * authenticated-approval.mjs — an agent-written approval row is not an approval.
 *
 * WHY THIS EXISTS (plan §10 M1 · external review pass 1 blocking finding 2,
 * "the sharpest catch of the round"): every gate this repo has built ultimately
 * rests on rows the AGENT typed — `status: approved`, `owner: Abilash` — and
 * nothing platform-side proved the owner was ever in the loop. front-gate.mjs
 * makes an unsigned row un-mergeable, but it cannot tell a signature from a
 * forgery: the bytes are identical. This script adds the missing half — the
 * PLATFORM-AUTHENTICATED event. A PR that touches a guarded path merges only
 * with a GitHub PR review, state APPROVED, submitted at the PR's CURRENT HEAD
 * SHA, authored by a login registered in gates/owners.yaml. GitHub does the
 * authentication; CI only refuses to merge without the event.
 *
 * SCOPE (D-20260719-10, owner ruling 19 Jul 2026 ~13:40 IST — narrower than the
 * reviewer proposed, deliberately): authenticated approval binds FRONT GATES +
 * doctrine/evolution PRs ONLY. Routine green technical PRs keep agent-armed
 * auto-merge per D-AUTOMERGE-TIERS ("keep self merging"). Learnings/doctrine
 * changes are always owner-approved — never auto-merged. A PR touching none of
 * the guarded paths therefore PASSES here as out of scope; that is the ruling,
 * not a gap.
 *
 * GUARDED PATHS (the explicit list — additions ride doctrine PRs, which are
 * themselves guarded; the matcher is in GUARDED below):
 *   launches/<domain>/approvals.yaml            — the front-gate ledgers themselves
 *   CLAUDE.md                                   — the rulebook
 *   gates/**                                    — registry + class map + owners register (self-guarding)
 *   docs/process/os-2026/standards/**           — the seven authored standards
 *   docs/process/os-2026/workflows/**           — the OS v2 workflows
 *   docs/design/BEAUTY_DOCTRINE.md              — doctrine
 *   docs/design/what-is-beauty-owner-paper-2026-07-18.md — owner paper (immutable)
 *   docs/marketing/go-science/**                — GO-science source docs (rubric derives from these)
 *   evolution/**                                — evolution registers
 *   decisions/**                                — decision records
 *   docs/process/os-2026/merge/merge-continuity.yaml — the continuity proof
 *   scripts/front-gate.mjs · scripts/authenticated-approval.mjs ·
 *   scripts/merge-continuity-lint.mjs · scripts/standards-acceptance.mjs ·
 *   scripts/class-map-lint.mjs · scripts/gate-registry-lint.mjs ·
 *   scripts/go-science-audit.mjs · scripts/beauty-audit.mjs
 *                                               — the enforcement scripts (a gate
 *                                                 whose enforcer can be edited in a
 *                                                 routine PR is not a gate)
 *   .github/workflows/**                        — the ENFORCEMENT POINT (pass-2 B2):
 *                                                 factory-gate.yml is where every gate
 *                                                 actually binds; a workflow editable in
 *                                                 a routine PR can delete the gate job
 *                                                 itself, so the workflows are guarded
 *   scripts/neutralize-workflows.mjs            — rewrites workflows (pass-2 B2):
 *                                                 guarding the workflows while leaving
 *                                                 their rewriter routine is the same hole
 *   docs/process/os-2026/merge/**               — the merge-law records (pass-2 B2):
 *                                                 continuity map (hash-pins CLAUDE.md
 *                                                 lines), strict-residues, gap-list,
 *                                                 work-item boundary; supersedes the
 *                                                 older single merge-continuity.yaml
 *                                                 entry, which is kept for history
 *   package.json · pnpm-workspace.yaml · turbo.json
 *                                               — the test/check WIRING (pass-2 B2):
 *                                                 the ROOT manifests define what `pnpm
 *                                                 test`/CI steps actually execute; edit
 *                                                 the wiring, skip the gate. Per-site
 *                                                 package.json files stay routine —
 *                                                 D-20260719-10's auto-merge lane is
 *                                                 for site work, not for CI wiring.
 *   pnpm-lock.yaml                              — the DEPENDENCY PINS (pass-2 B2 re-fix):
 *                                                 a lockfile-only PR can repoint a dep's
 *                                                 resolved URL/integrity within semver;
 *                                                 --frozen-lockfile only checks sync with
 *                                                 package.json, so the poisoned package
 *                                                 runs inside the gate-executing CI jobs
 *   scripts/design-review.mjs · scripts/audit-gpt.mjs ·
 *   scripts/audit-perplexity.mjs · scripts/lib/**
 *                                               — the enforcers' EXECUTABLE CLOSURE
 *                                                 (pass-2 B2 re-fix): design-review is the
 *                                                 sole enforcer of both external-AI review
 *                                                 rows and lends deriveVerdict/decideExit
 *                                                 to beauty-audit; the audit-* scripts are
 *                                                 the spawned verdict emitters; scripts/lib
 *                                                 holds the shared verdict + evidence
 *                                                 hash-binding plumbing (sha256/istStamp).
 *                                                 A guarded gate importing routine modules
 *                                                 is editable in a routine PR — same hole.
 *
 * RENAMES (pass-2 B2): the diff is taken with rename/copy detection (-M) and
 * R/C name-status lines carry BOTH paths. A file is guarded when EITHER side
 * of a rename matches a guarded pattern — renaming CLAUDE.md to notes.md is a
 * doctrine change, and renaming notes.md onto a guarded path is too. Keeping
 * only the destination path (the old behavior) let a guarded file exit the
 * guard by being renamed; that door is closed.
 *
 * WORKFLOW-DERIVED GUARDS (adversarial verifier BLOCKING finding, 19 Jul 2026).
 * Ten merge-blocking enforcers invoked by the guarded workflows classified
 * ROUTINE (banned-string-lint, cta-label-lint, placeholder-lint, content-lint,
 * seed-lint, keyword-validate, factory-matrix-lint, launch-evidence-gate,
 * chat-bubble-lint, lighthouse-gate) — so a routine auto-merge PR could
 * rewrite any of them to process.exit(0) and silently disable its check.
 * Rather than freeze today's list into more static rows (which regresses the
 * moment the NEXT enforcer is wired into CI), the guard set is DERIVED at
 * runtime: every .github/workflows/*.yml is read from the TRUSTED BASE
 * revision (the same `git show <merge-base>:` mechanism the owner register
 * uses — NEVER the PR checkout), every `scripts/<name>.mjs` reference in them
 * is extracted, and each referenced script joins the guarded set for this run.
 * Tamper-evident by construction: .github/workflows/** is itself guarded, so
 * un-guarding a script means editing a guarded workflow file — which itself
 * needs an authenticated owner approval. The static GUARDED list below is
 * UNCHANGED (defense in depth — the derivation only ever ADDS, rule g).
 * FAIL CLOSED: if the workflows are unreadable at the trusted revision the
 * reference list cannot be trusted, so the run enters DEGRADED mode — ALL
 * scripts/**.mjs changes are treated as guarded, printed loudly — because an
 * unreadable reference list must never quietly un-guard an enforcer.
 * CONTROL PROBE: workflowCoverageProbe() parses the CURRENT workflows on disk
 * every run, lists every `node scripts/*.mjs` invocation, and asserts each
 * classifies GUARDED under the real classifier (static + derivation) — an
 * enforcer wired into CI in a form the derivation cannot see fails the probe
 * (exit 2, gate-did-not-run), so guard coverage cannot silently regress.
 *
 * STALENESS + EFFECTIVE STATE (pass-2 B4). An APPROVED review binds to the
 * exact commit it reviewed (commit_id). Commits pushed after the approval
 * invalidate it here — the owner approved DIFFERENT bytes. Stale approvals are
 * reported by SHA so the failure is legible, and never counted. Approval is
 * judged by EFFECTIVE STATE, not existence-of-event: reviews are grouped by
 * author, each author's LATEST submitted review (by submitted_at) is the one
 * that speaks, and it must be state APPROVED at the current head. A later
 * CHANGES_REQUESTED supersedes an earlier approval; a DISMISSED latest review
 * means the author currently approves NOTHING (a dismissed approval is not
 * resurrected by an older one). This is deliberately stricter than GitHub's
 * own mergeability math — stricter is the permitted direction (rule g).
 *
 * TRUSTED BASE IDENTITY (pass-2 B3). gates/owners.yaml is resolved from the
 * TRUSTED BASE revision (`git show <merge-base>:gates/owners.yaml`), NEVER
 * from the PR checkout — otherwise a PR could add its own author to the
 * register and have that newly minted identity approve the very PR that minted
 * it. A change to the register is validated against the BASE list: an identity
 * added in this PR cannot approve this PR; the new list takes effect only
 * after an ALREADY-registered owner approves the merge. If the register does
 * not exist at base (git show fails), the owner list is EMPTY and the gate
 * FAILS CLOSED with a message saying exactly that.
 *
 * HASH BINDING. For every approvals.yaml ledger in the diff: each approved row
 * that this PR ADDS or MODIFIES must carry `artifact` (a committed repo path)
 * and `artifact_sha256` equal to sha256 of the committed file bytes — the
 * approval is bound to the exact artifact the owner saw, not to a filename
 * whose content can drift after signing. PRE-EXISTING approved rows that this
 * diff does not touch are OUT OF SCOPE: the eight-plus ledgers signed before
 * this mechanism existed are not retroactively broken, and backfill rides each
 * site's next touch of its own ledger (the moment a ledger row changes, every
 * changed approved row must be hash-bound). `--hash <repo-path>` prints the
 * sha256 to paste.
 *
 * ENFORCEMENT POINT (front-gate precedent): CI. Local runs without a
 * GITHUB_TOKEN + PR context print what WOULD be required and exit 0 with a
 * loud LOCAL ADVISORY banner — the merge queue, not the laptop, is where the
 * requirement binds. Hash-binding findings ARE computed locally (they need no
 * network) and are advisory locally, blocking in CI.
 *
 * CI inputs: GITHUB_TOKEN · PR number from GITHUB_EVENT_PATH json (or env
 * PR_NUMBER) · repo from GITHUB_REPOSITORY · head SHA from the event payload
 * (or git rev-parse HEAD). Reviews come from the REST reviews endpoint via
 * fetch — no gh dependency in CI, dependency-free like front-gate.mjs. BASE
 * arrives via env/--base, never interpolated into a shell line.
 *
 * Exit codes: 0 = pass (or local advisory) · 2 = approval/hash blocker OR
 * broken probe (CI blocks) · 1 = harness error.
 *
 * Usage:
 *   node scripts/authenticated-approval.mjs [--base <ref>] [--root <repo-root>]
 *   node scripts/authenticated-approval.mjs --hash <repo-path>   # print sha256 for a ledger row
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const OWNERS = "gates/owners.yaml";

/**
 * The guarded-path law, as data. `**` = any suffix (including slashes),
 * `*` = one path segment. Everything else matches literally.
 */
export const GUARDED = [
  "launches/*/approvals.yaml",
  "CLAUDE.md",
  "gates/**",
  "docs/process/os-2026/standards/**",
  "docs/process/os-2026/workflows/**",
  "docs/design/BEAUTY_DOCTRINE.md",
  "docs/design/what-is-beauty-owner-paper-2026-07-18.md",
  "docs/marketing/go-science/**",
  "evolution/**",
  "decisions/**",
  "scripts/front-gate.mjs",
  "scripts/authenticated-approval.mjs",
  "scripts/merge-continuity-lint.mjs",
  "scripts/standards-acceptance.mjs",
  "scripts/class-map-lint.mjs",
  "scripts/gate-registry-lint.mjs",
  "scripts/go-science-audit.mjs",
  "scripts/beauty-audit.mjs",
  "docs/process/os-2026/merge/merge-continuity.yaml",
  // ── pass-2 B2 additions (external review pass 2, gpt-5.6-sol) ──
  ".github/workflows/**", // the enforcement point — an editable workflow can delete the gate job
  "scripts/neutralize-workflows.mjs", // the workflow rewriter — same hole as the workflows themselves
  "docs/process/os-2026/merge/**", // continuity map + strict-residues + gap-list + boundary (supersedes the single entry above, kept for history)
  "package.json", // ROOT test/check wiring — what `pnpm test`/CI actually runs (per-site package.json stays routine)
  "pnpm-workspace.yaml", // workspace membership — decides which packages the checks even see
  "turbo.json", // task pipeline config — decides which tasks run and cache
  // ── pass-2 B2 re-fix (external review pass 2 verifier, BLOCKING) ──
  // (1) The lockfile is the same attack surface as package.json: a routine
  // lockfile-only PR can repoint an existing dep's resolved URL/integrity
  // within its semver range — `pnpm install --frozen-lockfile` only checks
  // lockfile↔manifest SYNC, so the poisoned package installs and its code runs
  // inside the very CI jobs that execute the required checks. No CODEOWNERS
  // backstop covers it either.
  "pnpm-lock.yaml",
  // (2) A guarded enforcer whose imported/spawned modules are routine is not
  // guarded: "a gate whose enforcer can be edited in a routine PR is not a
  // gate" applies to the enforcer's whole executable closure.
  "scripts/design-review.mjs", // sole enforcer of BOTH design-external-ai-review registry rows; exports deriveVerdict/decideExit consumed by beauty-audit.mjs
  "scripts/audit-gpt.mjs", // the verdict emitters spawned by design-review + beauty-audit —
  "scripts/audit-perplexity.mjs", // an auditor rewired to always PASS guts every gate that spawns it
  "scripts/lib/**", // shared verdict plumbing imported by the guarded enforcers: verdict.mjs (istStamp + sha256 — the evidence hash-binding), image-input.mjs, audit-verdict.mjs, review-brief.mjs
];

const patternToRegex = (pattern) =>
  new RegExp(
    "^" +
      pattern
        .split(/(\*\*|\*)/)
        .map((part) => {
          if (part === "**") return ".+";
          if (part === "*") return "[^/]+";
          return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        })
        .join("") +
      "$",
  );

const GUARDED_RES = GUARDED.map((p) => ({ pattern: p, re: patternToRegex(p) }));

/**
 * Which guarded pattern does this path fall under?
 * @param {string} p repo-relative path
 * @returns {string|null} the matching pattern, or null (= routine)
 */
export function guardRule(p) {
  for (const { pattern, re } of GUARDED_RES) if (re.test(p)) return pattern;
  return null;
}

// ---------------------------------------------------------------------------
// Workflow-derived guards — the guarded set is DERIVED from the workflows at
// the trusted base revision, so the NEXT enforcer wired into CI is guarded
// the moment its workflow lands, with no list to remember to update (see the
// WORKFLOW-DERIVED GUARDS header section for the WHY).
// ---------------------------------------------------------------------------

export const WORKFLOWS_DIR = ".github/workflows";

/**
 * DEGRADED-mode pattern: when the workflows are unreadable at the trusted
 * revision, EVERY .mjs under scripts/ (any depth) is guarded — fail closed.
 */
export const DEGRADED_SCRIPTS_PATTERN = "scripts/**.mjs";

// Broad MENTION regex (derivation): any scripts/<path>.mjs reference in a
// workflow, invocation or not — comments included, deliberately. Over-guarding
// a merely-mentioned script is safe; missing an invoked one is the hole. The
// lookbehind stops prefix bleed (prescripts/x.mjs, vendor/scripts/x.mjs); an
// optional ./ prefix is accepted and stripped.
const SCRIPT_REF_RE = /(?<![\w/.-])(?:\.\/)?(scripts\/[\w./-]+\.mjs)(?![\w-])/g;

// Strict INVOCATION regex (control probe): `node [flags] scripts/<path>.mjs`.
// Strictly narrower than the mention regex BY DESIGN: everything the probe
// finds, the derivation must have found too — if the two ever disagree, the
// probe fails and the gate refuses to run.
const SCRIPT_INVOCATION_RE = /\bnode\s+(?:--[\w-]+(?:=\S+)?\s+)*(?:\.\/)?(scripts\/[\w./-]+\.mjs)(?![\w-])/g;

/** Every scripts/<path>.mjs MENTIONED in workflow text (sorted, unique). */
export function extractWorkflowScriptRefs(text) {
  return [...new Set([...text.matchAll(SCRIPT_REF_RE)].map((m) => m[1]))].sort();
}

/** Every scripts/<path>.mjs INVOKED via `node …` in workflow text (sorted, unique). */
export function extractWorkflowScriptInvocations(text) {
  return [...new Set([...text.matchAll(SCRIPT_INVOCATION_RE)].map((m) => m[1]))].sort();
}

/**
 * Derive the workflow-referenced enforcer scripts from the TRUSTED revision.
 * Pure — both accessors are injected (CLI: git ls-tree + git show at the
 * merge-base; tests: stubs). ANY read failure — the listing throws, a file is
 * unreadable, or no workflow files are visible at all — enters DEGRADED mode:
 * scripts is empty, degraded is true, and the caller must guard ALL
 * scripts/**.mjs (DEGRADED_SCRIPTS_PATTERN). An unreadable reference list
 * must never quietly un-guard an enforcer — fail closed, loudly.
 * @param {{listWorkflows:()=>string[], show:(repoPath:string)=>string}} accessors
 *        listWorkflows returns repo-relative workflow paths at the trusted
 *        revision (or throws); show returns a file's text there (or throws)
 * @returns {{scripts:string[], degraded:boolean, notes:string[]}}
 */
export function resolveWorkflowGuardedScripts({ listWorkflows, show }) {
  const degraded = (why) => ({
    scripts: [],
    degraded: true,
    notes: [
      `DEGRADED FAIL-CLOSED MODE: the workflow-derived guard register cannot be built — ${why}. ` +
        `The ${WORKFLOWS_DIR} files at the TRUSTED BASE revision are the tamper-evident list of CI-invoked enforcer scripts; ` +
        `with that list unreadable, EVERY scripts/**.mjs change is treated as GUARDED until it is readable again. ` +
        `An unreadable reference list must never quietly un-guard an enforcer.`,
    ],
  });
  let files;
  try { files = listWorkflows(); } catch (e) { return degraded(`listing ${WORKFLOWS_DIR} at the trusted revision failed (${e.message})`); }
  files = (files ?? []).filter((f) => /\.ya?ml$/i.test(f));
  if (files.length === 0) return degraded(`no *.yml/*.yaml workflow files are visible at the trusted revision`);
  const refs = new Set();
  for (const f of files) {
    let text;
    try { text = show(f); } catch (e) { return degraded(`${f} is unreadable at the trusted revision (${e.message})`); }
    for (const r of extractWorkflowScriptRefs(text)) refs.add(r);
  }
  return { scripts: [...refs].sort(), degraded: false, notes: [] };
}

/**
 * The effective classifier: the static GUARDED list (unchanged — defense in
 * depth) PLUS the workflow-derived scripts, PLUS — in degraded mode — the
 * fail-closed all-scripts pattern. Static rules answer first so their pattern
 * names stay stable in output.
 * @param {string[]} derivedScripts workflow-derived script paths (literal)
 * @param {{degraded?:boolean}} opts degraded=true guards ALL scripts/**.mjs
 * @returns {(p:string)=>string|null} same contract as guardRule
 */
export function makeGuardRule(derivedScripts = [], { degraded = false } = {}) {
  const extra = [
    ...derivedScripts,
    ...(degraded ? [DEGRADED_SCRIPTS_PATTERN] : []),
  ].map((p) => ({ pattern: p, re: patternToRegex(p) }));
  return (p) => {
    const staticRule = guardRule(p);
    if (staticRule) return staticRule;
    for (const { pattern, re } of extra) if (re.test(p)) return pattern;
    return null;
  };
}

/**
 * CONTROL PROBE (runs every CLI invocation, drivable from tests): parse the
 * CURRENT ${WORKFLOWS_DIR} on disk, list every `node scripts/*.mjs`
 * invocation, and assert each classifies GUARDED under the real classifier
 * (static GUARDED + the derivation over these same files). What it catches:
 * the derivation being unplugged from classification, the mention regex
 * narrowing below the invocation regex (an invocation form the derivation
 * cannot see), a broken/blind extractor, or the workflows dir going missing —
 * each of which would let the NEXT workflow-added enforcer slip back into the
 * routine lane. Any finding is a broken-gate condition (exit 2 in the CLI).
 * @param {string} root repo root holding ${WORKFLOWS_DIR}
 * @param {(derivedScripts:string[])=>(p:string)=>string|null} makeRule
 *        classifier factory — injectable so tests can prove the probe FAILS
 *        when handed a classifier without derivation (static-only)
 * @returns {string[]} probe failures (empty = coverage proven)
 */
export function workflowCoverageProbe(root = REPO_ROOT, makeRule = (derivedScripts) => makeGuardRule(derivedScripts)) {
  const dir = join(root, WORKFLOWS_DIR);
  if (!existsSync(dir)) {
    return [`workflow-coverage probe: ${WORKFLOWS_DIR} does not exist on disk under ${root} — cannot prove that every CI-invoked enforcer script is guarded`];
  }
  const files = readdirSync(dir).filter((f) => /\.ya?ml$/i.test(f)).sort();
  if (files.length === 0) {
    return [`workflow-coverage probe: no *.yml/*.yaml files under ${WORKFLOWS_DIR} — cannot prove that every CI-invoked enforcer script is guarded`];
  }
  const derived = new Set();
  const invocations = [];
  for (const f of files) {
    const text = readFileSync(join(dir, f), "utf8");
    for (const r of extractWorkflowScriptRefs(text)) derived.add(r);
    for (const s of extractWorkflowScriptInvocations(text)) invocations.push({ file: `${WORKFLOWS_DIR}/${f}`, script: s });
  }
  const failures = [];
  if (invocations.length === 0) {
    failures.push(`workflow-coverage probe: ZERO \`node scripts/*.mjs\` invocations found across ${files.length} workflow file(s) — the invocation extractor has gone blind, and a blind probe proves nothing`);
  }
  const rule = makeRule([...derived].sort());
  for (const { file, script } of invocations) {
    if (rule(script) === null) {
      failures.push(
        `workflow-coverage probe: ${file} invokes ${script}, but it classifies ROUTINE — a routine auto-merge PR could rewrite this merge-blocking enforcer to process.exit(0) and silently disable its check. Every script the workflows invoke must classify GUARDED (static GUARDED list or the workflow-derived set).`,
      );
    }
  }
  return failures;
}

/**
 * Parse `git diff --name-status -M` output. Pure, so the rename shapes are
 * testable without git. R/C status lines carry BOTH paths (old TAB new) —
 * keeping only the destination (the old behavior) let a guarded file exit the
 * guard by being renamed (pass-2 B2).
 * @param {string} out raw git output
 * @returns {Array<{status:string,path:string,oldPath?:string}>}
 */
export function parseNameStatus(out) {
  if (!out) return [];
  return out.split("\n").filter((l) => l.length > 0).map((l) => {
    const parts = l.split("\t");
    const status = parts[0];
    if (/^[RC]/.test(status) && parts.length >= 3) {
      return { status, oldPath: parts[1], path: parts[2] };
    }
    return { status, path: parts[parts.length - 1] };
  });
}

/**
 * Split a diff into guarded and routine files. ALL statuses count, including
 * D — deleting CLAUDE.md is exactly as much a doctrine change as editing it.
 * Renames/copies are guarded when EITHER side matches a guarded pattern:
 * renaming CLAUDE.md away is a doctrine change, and renaming a file ONTO a
 * guarded path is too (pass-2 B2).
 * @param {Array<{status:string,path:string,oldPath?:string}>} changed git name-status rows
 * @param {(p:string)=>string|null} ruleFor the classifier — defaults to the
 *        static guardRule; the CLI passes the EFFECTIVE rule (static +
 *        workflow-derived scripts) built by makeGuardRule
 * @returns {{guarded:Array<{status:string,path:string,oldPath?:string,rule:string}>, routine:string[]}}
 */
export function classifyChanged(changed, ruleFor = guardRule) {
  const guarded = [];
  const routine = [];
  for (const { status, path, oldPath } of changed) {
    const rule = ruleFor(path) ?? (oldPath ? ruleFor(oldPath) : null);
    if (rule) guarded.push(oldPath ? { status, path, oldPath, rule } : { status, path, rule });
    else routine.push(path);
  }
  return { guarded, routine };
}

/**
 * Narrow scanner for gates/owners.yaml — same philosophy as front-gate's
 * ledger scanner: strict, and loud when it cannot read. An unreadable owners
 * register is a gate failure, never an empty allow-list that waves through
 * (or, worse, an empty allow-list that blocks forever with no explanation).
 * @param {string} text
 * @returns {{version:string|null, ownerLogins:string[], errors:string[]}}
 */
export function parseOwners(text) {
  const errors = [];
  const ownerLogins = [];
  let version = null;
  let inLogins = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/\s+$/, "");
    if (!line || /^\s*#/.test(line)) continue;
    let m;
    if ((m = line.match(/^version:\s*(\S+)\s*$/))) { version = m[1]; inLogins = false; continue; }
    if (/^note:\s*/.test(line)) { inLogins = false; continue; }
    if (/^owner_logins:\s*$/.test(line)) { inLogins = true; continue; }
    if ((m = line.match(/^\s+-\s*([A-Za-z0-9-]+)\s*$/))) {
      if (!inLogins) { errors.push(`login row outside the "owner_logins:" block: ${JSON.stringify(line)}`); continue; }
      ownerLogins.push(m[1]);
      continue;
    }
    errors.push(`line not understood by the owners scanner: ${JSON.stringify(line)}`);
  }
  if (!version) errors.push(`no "version:" line`);
  if (ownerLogins.length === 0) errors.push(`no logins under "owner_logins:" — an empty identity register can authenticate nobody`);
  return { version, ownerLogins, errors };
}

/**
 * Resolve the owner register from the TRUSTED BASE revision — never the PR
 * checkout (pass-2 B3: otherwise a PR could add its own author to the list and
 * have that newly minted identity approve the very PR that minted it). Pure:
 * `show` is injected (CLI: `git show <merge-base>:gates/owners.yaml`; tests: a
 * stub that returns text or throws). If `show` throws (file absent at base),
 * the owner list is EMPTY and the errors say so — FAIL CLOSED, never an
 * accidental allow-list.
 * @param {(repoPath:string)=>string} show returns the file's text at the trusted base, or throws
 * @returns {{version:string|null, ownerLogins:string[], errors:string[]}}
 */
export function resolveBaseOwners(show) {
  let text = null;
  try { text = show(OWNERS); } catch { text = null; }
  if (text === null) {
    return {
      version: null,
      ownerLogins: [],
      errors: [
        `${OWNERS} is unreadable at the TRUSTED BASE revision. Owner identities are resolved from the base branch, never from the PR checkout — an identity added in this PR cannot approve this PR. With no readable base register the owner list is EMPTY and this gate FAILS CLOSED: land ${OWNERS} on the base branch first (an owner ruling), then open the guarded PR.`,
      ],
    };
  }
  return parseOwners(text);
}

/**
 * The note printed (pass or fail) whenever the diff itself touches the owner
 * register — so the base-trust rule is legible exactly when it bites.
 */
export const OWNERS_BASE_NOTE =
  `NOTE: this PR touches ${OWNERS}. Owner-list changes are validated against the BASE list — identities are resolved from the trusted base revision, never the PR checkout, so a login added in this PR cannot approve this PR. The changed register takes effect only after an ALREADY-registered owner approves this merge.`;

/**
 * Effective review state per author (pass-2 B4): group reviews by author and
 * keep each author's LATEST submitted review (by submitted_at; ties go to the
 * later array position — API order is chronological). PENDING (unsubmitted
 * drafts) never speak. If an author's overall-latest review is DISMISSED, the
 * author has NO effective review — a dismissed approval is not resurrected by
 * an older approval event (strictly stronger than "latest non-dismissed",
 * which is the permitted direction, rule g).
 * @param {Array<{user?:{login?:string}, state?:string, commit_id?:string, submitted_at?:string}>} reviews
 * @returns {Map<string, object>} login → the author's effective (speaking) review
 */
export function latestEffectiveReviews(reviews) {
  const latest = new Map();
  for (const r of reviews ?? []) {
    const login = r?.user?.login;
    if (!login || r.state === "PENDING") continue;
    const prev = latest.get(login);
    if (!prev || String(r.submitted_at ?? "") >= String(prev.submitted_at ?? "")) latest.set(login, r);
  }
  const effective = new Map();
  for (const [login, r] of latest) if (r.state !== "DISMISSED") effective.set(login, r);
  return effective;
}

/**
 * The authentication check. Pure — the reviews payload is plain JSON (the REST
 * reviews endpoint shape: [{ user:{login}, state, commit_id, submitted_at }])
 * so both directions are testable without a network. EFFECTIVE-STATE
 * semantics (pass-2 B4): each author's latest review is the one that speaks —
 * an APPROVED event superseded by a later CHANGES_REQUESTED, or dismissed,
 * authenticates nothing. `ownersTouched` (pass-2 B3) marks a diff that edits
 * the owner register itself, so the failure/pass text explains that the BASE
 * list is the one being consulted.
 * @param {{guarded:Array<{path:string,rule:string}>, headSha:string,
 *          reviews:Array<{user?:{login?:string}, state?:string, commit_id?:string, submitted_at?:string}>,
 *          ownerLogins:string[], ownersTouched?:boolean}} input
 * @returns {{ok:boolean, approvedBy:string|null, failures:string[]}}
 */
export function evaluateOwnerApproval({ guarded, headSha, reviews, ownerLogins, ownersTouched = false }) {
  if (guarded.length === 0) return { ok: true, approvedBy: null, failures: [] };

  const effective = latestEffectiveReviews(reviews);
  for (const login of ownerLogins) {
    const r = effective.get(login);
    if (r && r.state === "APPROVED" && r.commit_id === headSha) {
      return { ok: true, approvedBy: login, failures: [] };
    }
  }

  const failures = [];
  for (const login of ownerLogins) {
    const eff = effective.get(login);
    const events = (reviews ?? []).filter((r) => r?.user?.login === login);
    const hadApprovalEvent = events.some((r) => r.state === "APPROVED");
    if (eff && eff.state === "APPROVED" && eff.commit_id !== headSha) {
      failures.push(
        `STALE approval: ${login} approved at commit ${eff.commit_id} but the PR head is now ${headSha} — commits were pushed after the approval, so the owner approved DIFFERENT bytes. A stale approval does not count. Ask for re-approval at the current head.`,
      );
    } else if (eff && eff.state !== "APPROVED" && hadApprovalEvent) {
      failures.push(
        `SUPERSEDED approval: ${login}'s latest review is ${eff.state}${eff.submitted_at ? ` (${eff.submitted_at})` : ""}, which supersedes an earlier APPROVED event. Approval is judged by the reviewer's LATEST EFFECTIVE state, not by the existence of an approval event — a later ${eff.state} withdraws the approval. Ask for a fresh approval at the current head.`,
      );
    } else if (!eff && events.some((r) => r.state === "DISMISSED")) {
      failures.push(
        `DISMISSED approval: ${login}'s latest review was dismissed — a dismissed review authenticates nothing, and an older approval event is not resurrected by it. Ask for a fresh approval at the current head.`,
      );
    }
  }
  for (const [login, r] of effective) {
    if (!ownerLogins.includes(login) && r.state === "APPROVED" && r.commit_id === headSha) {
      failures.push(
        `NON-OWNER approval: ${login} approved at head, but that login is not in ${OWNERS} at the trusted BASE revision — only an already-registered owner login authenticates a guarded change (additions to the register are owner rulings, and a login added in this same PR cannot approve it).`,
      );
    }
  }
  if (failures.length === 0) {
    failures.push(
      `NO approval found at head ${headSha} by any owner login (${ownerLogins.join(", ")}).`,
    );
  }
  if (ownersTouched) failures.push(OWNERS_BASE_NOTE);
  failures.push(
    `WHAT TO CLICK (owner): open the PR → "Files changed" → "Review changes" (top right) → select "Approve" → "Submit review". Submit AFTER the latest push — GitHub records the review at the head commit, and only a review at ${headSha} counts.`,
  );
  return { ok: false, approvedBy: null, failures };
}

// ---------------------------------------------------------------------------
// Hash binding — the approval is bound to the exact artifact bytes.
// ---------------------------------------------------------------------------

/** sha256 hex of a Buffer/string. */
export function sha256Hex(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

/**
 * Ledger scanner for hash binding — a SUPERSET of front-gate's parseApprovals:
 * it additionally understands `artifact_sha256:` (front-gate's scanner
 * predates the field). Same law otherwise: strict, and an unreadable ledger is
 * a gate failure, never a pass. Quoted values are unquoted.
 * @param {string} text
 * @returns {{rows:Array<{gate:string,status:string,owner:string,date:string,artifact:string,artifact_sha256:string}>, errors:string[]}}
 */
export function parseLedger(text) {
  const errors = [];
  const rows = [];
  let cur = null;
  let inApprovals = false;
  const unquote = (v) => v.replace(/^"(.*)"$/, "$1");
  const push = () => { if (cur) { rows.push(cur); cur = null; } };

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/\s+$/, "");
    if (!line || /^\s*#/.test(line)) continue;
    let m;
    if (/^(domain|mode):/.test(line)) continue; // front-gate's territory, not ours
    if (/^approvals:\s*$/.test(line)) { inApprovals = true; continue; }
    if ((m = line.match(/^\s*-\s*gate:\s*(\S+)\s*$/))) {
      if (!inApprovals) { errors.push(`gate row outside the "approvals:" block: ${JSON.stringify(line)}`); continue; }
      push();
      cur = { gate: m[1], status: "", owner: "", date: "", artifact: "", artifact_sha256: "" };
      continue;
    }
    if ((m = line.match(/^\s+(status|owner|date|artifact|artifact_sha256|commit):\s*(.*)$/))) {
      if (!cur) { errors.push(`"${m[1]}" appears before any "- gate:" row`); continue; }
      const key = m[1] === "commit" ? "artifact" : m[1];
      cur[key] = unquote(m[2].trim());
      continue;
    }
    errors.push(`line not understood by the ledger scanner: ${JSON.stringify(line)}`);
  }
  push();
  return { rows, errors };
}

/** The exact remedy line for an unbound approved row — quoted verbatim in tests. */
export const HASH_REMEDY =
  "remedy: set artifact to the committed repo path of the approved artifact, run `node scripts/authenticated-approval.mjs --hash <that-path>`, and write the printed sha256 into artifact_sha256 on the same row.";

/**
 * Which approved rows does THIS diff add or modify? Pure. A row counts as
 * touched when it is absent from the base ledger or any of its fields differ.
 * Pre-existing rows the diff leaves byte-identical are out of scope by design
 * (see header: backfill rides each site's next touch).
 * @param {{baseText:string|null, headText:string}} input
 * @returns {{touched:Array<object>, errors:string[]}}
 */
export function changedApprovedRows({ baseText, headText }) {
  const head = parseLedger(headText);
  if (head.errors.length > 0) return { touched: [], errors: head.errors };
  const base = baseText === null ? { rows: [], errors: [] } : parseLedger(baseText);
  if (base.errors.length > 0) {
    // An unreadable BASE cannot prove any head row pre-existed — fail closed:
    // every approved head row is treated as touched.
    return { touched: head.rows.filter((r) => r.status === "approved"), errors: [] };
  }
  const FIELDS = ["status", "owner", "date", "artifact", "artifact_sha256"];
  const baseByGate = new Map(base.rows.map((r) => [r.gate, r]));
  const touched = head.rows.filter((r) => {
    if (r.status !== "approved") return false;
    const b = baseByGate.get(r.gate);
    return !b || FIELDS.some((f) => r[f] !== b[f]);
  });
  return { touched, errors: [] };
}

/**
 * The hash-binding check. Pure — hashOf is injected (CLI: sha256 of the
 * committed file bytes in the checkout; tests: a plain map lookup).
 * @param {{ledgers:Array<{path:string, baseText:string|null, headText:string}>,
 *          hashOf:(repoPath:string)=>string|null}} input
 * @returns {string[]} blockers (empty = every touched approved row is hash-bound)
 */
export function checkHashBinding({ ledgers, hashOf }) {
  const blockers = [];
  for (const { path, baseText, headText } of ledgers) {
    const { touched, errors } = changedApprovedRows({ baseText, headText });
    for (const e of errors) blockers.push(`${path} unreadable — ${e}`);
    if (errors.length > 0) continue;
    for (const row of touched) {
      const where = `${path} gate "${row.gate}"`;
      if (!row.artifact) {
        blockers.push(`${where}: approved row added/modified in this PR carries no artifact (repo path). ${HASH_REMEDY}`);
        continue;
      }
      if (!row.artifact_sha256) {
        blockers.push(`${where}: approved row added/modified in this PR carries no artifact_sha256 — the approval is not bound to the bytes the owner saw. ${HASH_REMEDY}`);
        continue;
      }
      const actual = hashOf(row.artifact);
      if (actual === null) {
        blockers.push(`${where}: artifact "${row.artifact}" is not a committed file in this checkout — the artifact must be a repo path so its bytes are auditable. ${HASH_REMEDY}`);
        continue;
      }
      if (actual !== row.artifact_sha256) {
        blockers.push(
          `${where}: artifact_sha256 MISMATCH — row says ${row.artifact_sha256}, committed bytes of ${row.artifact} hash to ${actual}. The artifact changed after (or the hash was written without) the owner's approval. Re-post the artifact, get re-approval, re-hash.`,
        );
      }
    }
  }
  return blockers;
}

// ---------------------------------------------------------------------------
// Control probes — the real checkers, known-bad and known-good, every run
// (front-gate §0.6 law: a broken gate must fail loudly, not pass quietly).
// ---------------------------------------------------------------------------

export function runControlProbes() {
  const broken = [];
  const owners = ["probe-owner"];
  const guarded = [{ path: "CLAUDE.md", rule: "CLAUDE.md" }];
  const review = (login, state, commit_id, submitted_at) => ({ user: { login }, state, commit_id, submitted_at });

  if (guardRule("CLAUDE.md") === null || guardRule("launches/x.com/approvals.yaml") === null || guardRule("gates/owners.yaml") === null) {
    broken.push("probe: a guarded path was classified routine — doctrine could ride the auto-merge lane");
  }
  if (guardRule(".github/workflows/factory-gate.yml") === null || guardRule("scripts/neutralize-workflows.mjs") === null || guardRule("docs/process/os-2026/merge/strict-residues.yaml") === null || guardRule("package.json") === null) {
    broken.push("probe: an enforcement-point path (pass-2 B2) was classified routine — the workflow that runs the gates could be edited in a routine PR");
  }
  if (guardRule("sites/x.com/app/page.tsx") !== null || guardRule("sites/x.com/package.json") !== null) {
    broken.push("anti-probe: a routine path was classified guarded — every green technical PR would wait on the owner (violates D-20260719-10)");
  }

  const renamedAway = classifyChanged([{ status: "R100", oldPath: "CLAUDE.md", path: "docs/notes/rulebook.md" }]);
  if (renamedAway.guarded.length !== 1) broken.push("probe: renaming a guarded file to an unguarded path escaped the guard — the rename bypass (pass-2 B2) is open");

  // ── workflow-derived guards (adversarial verifier finding, 19 Jul 2026) ──
  const derivedRule = makeGuardRule(["scripts/probe-gate.mjs"]);
  if (derivedRule("scripts/probe-gate.mjs") === null) {
    broken.push("probe: a workflow-derived enforcer script was classified routine — the dynamic guard derivation is unplugged, and a routine PR could rewrite a CI-invoked enforcer to process.exit(0)");
  }
  if (derivedRule("scripts/probe-other.mjs") !== null || derivedRule("sites/x.com/app/page.tsx") !== null) {
    broken.push("anti-probe: a path OUTSIDE the derived set was classified guarded — the auto-merge lane (D-20260719-10) would close for routine work");
  }
  if (derivedRule("CLAUDE.md") !== "CLAUDE.md") {
    broken.push("probe: makeGuardRule dropped the static GUARDED list — the derivation must ADD to the static law, never replace it");
  }
  if (!extractWorkflowScriptRefs("      - run: node scripts/probe-lint.mjs --quiet\n").includes("scripts/probe-lint.mjs")) {
    broken.push("probe: the workflow reference extractor missed a plain `node scripts/x.mjs` step — the derivation would guard nothing");
  }
  if (extractWorkflowScriptRefs("prescripts/foo.mjs vendor/scripts/foo.mjs scripts/foo.mjsx").length !== 0) {
    broken.push("anti-probe: the reference extractor over-matched a non-scripts path — unrelated files would be dragged into the guard");
  }
  const probeInvocations = extractWorkflowScriptInvocations('OUT=$(node scripts/uptime/check.mjs 2>&1)\n        run: node scripts/probe-lint.mjs --quiet\n        run: ./scripts/probe-lint.mjs\n');
  if (probeInvocations.length !== 2 || !probeInvocations.includes("scripts/uptime/check.mjs") || !probeInvocations.includes("scripts/probe-lint.mjs")) {
    broken.push("probe: the invocation extractor misread `node scripts/*.mjs` forms — the workflow-coverage probe would be blind");
  }
  const degradedResolve = resolveWorkflowGuardedScripts({ listWorkflows: () => { throw new Error("probe: unreadable"); }, show: () => "" });
  if (!degradedResolve.degraded || degradedResolve.notes.length === 0) {
    broken.push("probe: unreadable workflows at the trusted revision did not enter DEGRADED fail-closed mode — an unreadable reference list would quietly un-guard every enforcer");
  }
  const degradedRule = makeGuardRule(degradedResolve.scripts, { degraded: degradedResolve.degraded });
  if (degradedRule("scripts/any-enforcer-at-all.mjs") === null || degradedRule("scripts/uptime/check.mjs") === null) {
    broken.push("probe: DEGRADED mode did not guard scripts/**.mjs — the fail-closed fallback is open");
  }
  if (degradedRule("sites/x.com/app/page.tsx") !== null) {
    broken.push("anti-probe: DEGRADED mode guarded a non-script routine path — degradation must fail closed on scripts, not close the whole auto-merge lane");
  }

  const good = evaluateOwnerApproval({ guarded, headSha: "H", reviews: [review("probe-owner", "APPROVED", "H")], ownerLogins: owners });
  if (!good.ok) broken.push("anti-probe: an owner approval at head was rejected — no guarded PR could ever merge");

  const stale = evaluateOwnerApproval({ guarded, headSha: "H", reviews: [review("probe-owner", "APPROVED", "OLD")], ownerLogins: owners });
  if (stale.ok || !stale.failures.some((f) => /STALE/.test(f))) broken.push("probe: a stale approval counted — bytes pushed after approval would merge as approved");

  const imposter = evaluateOwnerApproval({ guarded, headSha: "H", reviews: [review("not-the-owner", "APPROVED", "H")], ownerLogins: owners });
  if (imposter.ok) broken.push("probe: a non-owner approval counted — anyone with a GitHub account could sign a gate");

  const superseded = evaluateOwnerApproval({
    guarded, headSha: "H",
    reviews: [review("probe-owner", "APPROVED", "H", "2026-01-01T00:00:00Z"), review("probe-owner", "CHANGES_REQUESTED", "H", "2026-01-02T00:00:00Z")],
    ownerLogins: owners,
  });
  if (superseded.ok) broken.push("probe: an approval superseded by a later CHANGES_REQUESTED still counted — existence-of-event semantics (pass-2 B4) are back");

  const recovered = evaluateOwnerApproval({
    guarded, headSha: "H",
    reviews: [review("probe-owner", "CHANGES_REQUESTED", "H", "2026-01-01T00:00:00Z"), review("probe-owner", "APPROVED", "H", "2026-01-02T00:00:00Z")],
    ownerLogins: owners,
  });
  if (!recovered.ok) broken.push("anti-probe: request-changes followed by a fresh approval at head was rejected — no guarded PR could recover from a review round");

  const emptyBase = resolveBaseOwners(() => { throw new Error("no such path at base"); });
  if (emptyBase.ownerLogins.length !== 0 || emptyBase.errors.length === 0) broken.push("probe: an unreadable base owner register did not fail closed (pass-2 B3)");

  const HASH = sha256Hex("bytes");
  const ledgerRow = (extra) => `approvals:\n  - gate: brief\n    status: approved\n    owner: Abilash\n    date: 2026-07-19 17:30:00 IST\n    artifact: docs/x.md\n${extra}`;
  const bound = checkHashBinding({
    ledgers: [{ path: "launches/p/approvals.yaml", baseText: null, headText: ledgerRow(`    artifact_sha256: ${HASH}\n`) }],
    hashOf: () => HASH,
  });
  if (bound.length !== 0) broken.push(`anti-probe: a correctly hash-bound row was blocked (${bound[0]})`);

  const unbound = checkHashBinding({
    ledgers: [{ path: "launches/p/approvals.yaml", baseText: null, headText: ledgerRow("") }],
    hashOf: () => HASH,
  });
  if (unbound.length !== 1) broken.push("probe: an approved row without artifact_sha256 was not blocked — approvals would float free of their bytes");

  const preexisting = checkHashBinding({
    ledgers: [{ path: "launches/p/approvals.yaml", baseText: ledgerRow(""), headText: ledgerRow("") }],
    hashOf: () => HASH,
  });
  if (preexisting.length !== 0) broken.push("probe: an UNCHANGED pre-existing row was blocked — every legacy ledger would break retroactively (backfill rides the next touch, by design)");

  return broken;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

/** git name-status over base..HEAD — same never-guess law as front-gate. */
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
  // -M: rename detection ON explicitly, and parseNameStatus keeps BOTH sides
  // of an R/C line — a rename of a guarded file is guarded whichever way it
  // points (pass-2 B2).
  const out = git(["diff", "--name-status", "-M", mergeBase, "HEAD"]);
  return { changed: parseNameStatus(out), mergeBase, git };
}

/** PR context from the Actions event payload / env. Nulls = local mode. */
function prContext(env) {
  let event = null;
  if (env.GITHUB_EVENT_PATH && existsSync(env.GITHUB_EVENT_PATH)) {
    try { event = JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, "utf8")); } catch { event = null; }
  }
  const prNumber = Number(env.PR_NUMBER || event?.pull_request?.number || event?.number) || null;
  const headSha = event?.pull_request?.head?.sha || null;
  return { prNumber, headSha, repo: env.GITHUB_REPOSITORY || null, token: env.GITHUB_TOKEN || null };
}

/** Hard page cap for the reviews fetch — beyond it we refuse, loudly. */
export const REVIEWS_MAX_PAGES = 20;

/**
 * REST reviews for the PR — fetch + token, no gh dependency in CI. Paginates
 * per_page=100 until a short page. TRUNCATION IS A FAILURE (pass-2 B4): if
 * REVIEWS_MAX_PAGES full pages arrive we throw instead of returning a
 * truncated list — effective-state semantics need the reviewer's LATEST
 * review, and a truncated list could hide a later CHANGES_REQUESTED behind an
 * early approval. `fetchImpl` is injected so pagination is testable offline.
 */
export async function fetchReviews({ repo, prNumber, token }, fetchImpl = fetch) {
  const reviews = [];
  for (let page = 1; page <= REVIEWS_MAX_PAGES; page++) {
    const res = await fetchImpl(
      `https://api.github.com/repos/${repo}/pulls/${prNumber}/reviews?per_page=100&page=${page}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
          accept: "application/vnd.github+json",
          "user-agent": "kairali-authenticated-approval",
        },
      },
    );
    if (!res.ok) throw new Error(`GitHub reviews API returned ${res.status} for PR #${prNumber}`);
    const batch = await res.json();
    reviews.push(...batch);
    if (batch.length < 100) return reviews;
  }
  throw new Error(
    `PR #${prNumber} has more than ${REVIEWS_MAX_PAGES * 100} reviews — refusing to evaluate a TRUNCATED review list (a truncated list could hide the reviewer's latest CHANGES_REQUESTED behind an early approval). Raise REVIEWS_MAX_PAGES deliberately if this is real.`,
  );
}

async function main(argv) {
  const rootArg = argv.indexOf("--root");
  const root = resolve(rootArg >= 0 ? argv[rootArg + 1] : REPO_ROOT);

  const hashArg = argv.indexOf("--hash");
  if (hashArg >= 0) {
    const p = argv[hashArg + 1];
    if (!p) { console.error("--hash needs a repo path"); return 1; }
    const abs = join(root, p);
    if (!existsSync(abs)) { console.error(`--hash: ${p} does not exist under ${root}`); return 1; }
    console.log(`${sha256Hex(readFileSync(abs))}  ${p}`);
    return 0;
  }

  const baseArg = argv.indexOf("--base");
  const base = baseArg >= 0 ? argv[baseArg + 1] : (process.env.BASE || "");

  // Pure probes + the workflow-coverage probe (CURRENT workflows on disk:
  // every `node scripts/*.mjs` invocation must classify GUARDED, or the gate
  // refuses to run — a coverage regression is a broken gate, not a pass).
  const broken = [...runControlProbes(), ...workflowCoverageProbe(root)];
  if (broken.length > 0) {
    console.error("\nauthenticated-approval: CONTROL PROBE FAILED — this gate did not run.");
    for (const b of broken) console.error(`  ✗ ${b}`);
    return 2;
  }

  const { changed, mergeBase, git } = changedFiles(root, base);

  // Workflow-derived guards come from the TRUSTED BASE revision — the same
  // never-the-PR-checkout law as the owner register. Unreadable ⇒ DEGRADED
  // fail-closed mode (all scripts/**.mjs guarded, loudly).
  const wf = resolveWorkflowGuardedScripts({
    listWorkflows: () => git(["ls-tree", "--name-only", mergeBase, `${WORKFLOWS_DIR}/`]).split("\n").filter((l) => l.length > 0),
    show: (p) => git(["show", `${mergeBase}:${p}`]),
  });
  const effectiveRule = makeGuardRule(wf.scripts, { degraded: wf.degraded });
  const { guarded } = classifyChanged(changed, effectiveRule);

  console.log(`\nauthenticated-approval — ${changed.length} changed file(s) · ${guarded.length} guarded`);
  console.log(
    wf.degraded
      ? `guard register: ${GUARDED.length} static patterns + DEGRADED fail-closed mode (ALL scripts/**.mjs guarded — ${WORKFLOWS_DIR} unreadable @ BASE ${mergeBase.slice(0, 12)})`
      : `guard register: ${GUARDED.length} static patterns + ${wf.scripts.length} workflow-derived enforcer scripts (${WORKFLOWS_DIR} @ BASE ${mergeBase.slice(0, 12)} — tamper-evident: un-guarding one means editing a guarded workflow)`,
  );
  for (const n of wf.notes) console.log(`  DEGRADED  ${n}`);

  if (guarded.length === 0) {
    console.log(`\nPASS — out of scope (routine PR — agent auto-merge lane, D-20260719-10).\n`);
    return 0;
  }
  for (const g of guarded) console.log(`  GUARDED  ${g.oldPath ? `${g.oldPath} → ` : ""}${g.path}  (rule: ${g.rule})`);

  // Hash binding runs in every mode — it needs no network, only the checkout.
  const ledgers = guarded
    .filter((g) => /^launches\/[^/]+\/approvals\.yaml$/.test(g.path) && !g.status.startsWith("D"))
    .map(({ path }) => {
      let baseText = null;
      try { baseText = git(["show", `${mergeBase}:${path}`]); } catch { baseText = null; }
      return { path, baseText, headText: readFileSync(join(root, path), "utf8") };
    });
  const hashOf = (repoPath) => {
    const abs = join(root, repoPath);
    return existsSync(abs) ? sha256Hex(readFileSync(abs)) : null;
  };
  const hashBlockers = checkHashBinding({ ledgers, hashOf });

  // TRUSTED BASE identity (pass-2 B3): the owner register is read from the
  // merge-base revision — a commit on the base branch the PR cannot rewrite —
  // NEVER from the working tree. If the register is unreadable at base the
  // list is empty and the gate fails closed (resolveBaseOwners says so).
  const owners = resolveBaseOwners((p) => git(["show", `${mergeBase}:${p}`]));
  const ownersTouched = changed.some((c) => c.path === OWNERS || c.oldPath === OWNERS);

  const ctx = prContext(process.env);
  const local = !ctx.token || !ctx.prNumber || !ctx.repo;

  if (local) {
    console.log(`\nLOCAL ADVISORY — CI enforces (front-gate precedent: the merge queue, not the laptop, is the enforcement point).`);
    console.log(`This PR touches guarded paths, so AT MERGE it will require a GitHub PR review, state APPROVED,`);
    console.log(`submitted at the PR's current head SHA, by one of: ${owners.ownerLogins.join(", ") || "<owners register unreadable at base>"} (${OWNERS} @ BASE ${mergeBase.slice(0, 12)} — never the PR checkout).`);
    if (ownersTouched) console.log(`  ADVISORY  ${OWNERS_BASE_NOTE}`);
    for (const e of owners.errors) console.log(`  ADVISORY  ${OWNERS}: ${e}`);
    for (const b of hashBlockers) console.log(`  ADVISORY  ${b}`);
    if (hashBlockers.length > 0) console.log(`\n  ${hashBlockers.length} hash-binding finding(s) above WILL BLOCK in CI — fix before pushing.`);
    console.log("");
    return 0;
  }

  const blockers = [...hashBlockers];
  for (const e of owners.errors) blockers.push(`${OWNERS} @ BASE unreadable — ${e}`);

  if (owners.errors.length === 0) {
    const headSha = ctx.headSha || git(["rev-parse", "HEAD"]);
    const reviews = await fetchReviews(ctx);
    const verdict = evaluateOwnerApproval({ guarded, headSha, reviews, ownerLogins: owners.ownerLogins, ownersTouched });
    if (verdict.ok) {
      console.log(`\n  authenticated: APPROVED at head by ${verdict.approvedBy} — latest effective review (${OWNERS} @ BASE ${mergeBase.slice(0, 12)})`);
      if (ownersTouched) console.log(`  ${OWNERS_BASE_NOTE}`);
    } else {
      blockers.push(...verdict.failures);
    }
  }

  if (blockers.length === 0) {
    console.log(`\nPASS — every guarded change carries an authenticated owner approval, and every touched approved row is hash-bound.\n`);
    return 0;
  }
  for (const b of blockers) console.log(`\nBLOCK  ${b}`);
  console.log(`
FAIL — ${blockers.length} authenticated-approval issue${blockers.length === 1 ? "" : "s"}. Scope: FRONT GATES + doctrine/evolution PRs only (D-20260719-10) — routine green technical PRs are untouched. An approvals.yaml row is the RECORD of an approval; the GitHub review is the PROOF it happened. This gate needs both.
`);
  return 2;
}

// NOTE: comparing import.meta.url to process.argv[1] as raw STRINGS silently
// broke on any checkout path containing a space — import.meta.url percent-encodes
// it, argv[1] does not — so main() never ran and the script exited 0 having
// checked NOTHING. Normalising argv[1] through URL() fixes it with no new import.
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main(process.argv.slice(2))
    .then((code) => process.exit(code))
    .catch((e) => {
      console.error(`authenticated-approval: harness error — ${e.message}`);
      process.exit(1);
    });
}
