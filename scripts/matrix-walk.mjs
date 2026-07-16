#!/usr/bin/env node
/**
 * matrix-walk.mjs — `G9-PRE` / `G9-Δ`. THE FINAL PRE-LAUNCH MATRIX WALK.
 *
 * ABILASH'S #1 ASK, VERBATIM:
 *   "when the work is completed, you go through all of the entire decision matrix
 *    and everything. See that all the steps were done before saying the website is
 *    ready for launch or shipping."
 *   "Doctrine written in a .md file is ZERO evidence the rule was executed."
 *
 * WHAT THIS IS. Given a site, it re-walks every stage gate S0→S9 and proves FROM
 * PERSISTED EVIDENCE that each gate actually RAN and PASSED. It reads no prose. It
 * believes no claim. Every conclusion is re-derived here from three things a
 * document cannot fake: the bytes of the artifact on disk, the exit code the
 * enforcing command recorded, and git's record of who committed the verdict.
 *
 * THE FOUR RULES IT ENFORCES (MASTER_PIPELINE §0.2, §0.3, §S9):
 *   1. A MISSING VERDICT IS A FAIL, NEVER A PASS. Silence is not consent.
 *      "ABSENCE OF ARTIFACT = FAIL. No exceptions. No verbal assurances." (§S9(d)4)
 *   2. A verdict is bound to the ARTIFACT IT JUDGED. If the file changed after the
 *      verdict, the verdict is VOID and the gate is UNPROVEN (§S9(d)2).
 *   3. THE VOID CHAIN — a voided upstream verdict voids everything downstream that
 *      depended on it (§0.3). A voided gate is a normal event; an UNREPAIRED voided
 *      gate is the failure.
 *   4. CONFORMANCE — the built site IS the approved map (§S9(d)3). The hash proved
 *      the artifacts didn't change. It never compared them to the built pages.
 *
 * WHY THE HASH ALONE WAS NOT ENOUGH — the finding this file exists to answer:
 *   "it binds verdict → artifact, and nothing bound verdict → execution. The hash is
 *    computable by anyone holding the artifact. Forging a clean matrix walk required
 *    writing one JSON file — which is epistemically identical to a .md file asserting
 *    a rule binds. That is failure #9, assigned to S9, and S9 was the stage that
 *    could not detect it."
 * So provenance (git: was this committed, by a CI job?) is load-bearing here, not
 * decoration. See scripts/lib/verdict.mjs, which owns the contract.
 *
 * IT IS DESIGNED TO SAY NO TODAY. Run against whatisayurveda.com right now it must
 * print DO-NOT-SHIP and name every unproven gate, because ~nothing has a verdict
 * yet. A matrix walk that passes today would be broken, and would be this repo's
 * ninth documented failure committed by the gate built to prevent it.
 *
 * USAGE
 *   node scripts/matrix-walk.mjs --site whatisayurveda.com
 *   node scripts/matrix-walk.mjs --site whatisayurveda.com --slice path/to/slice.json   # G9-Δ
 *   node scripts/matrix-walk.mjs --site x --json          # machine-readable
 *   node scripts/matrix-walk.mjs --site x --no-write      # don't emit the report/verdict
 *
 * EXIT CODES (house rule): 0 = SHIP · 2 = DO-NOT-SHIP (gate blocks CI) · 1 = harness error.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  checkBinding, checkProvenance, emitVerdict, gitProvenance, istIso, istStamp,
  latest, loadVerdicts, parseTsv, sliceArtifact, validateVerdict,
} from "./lib/verdict.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_REPO_ROOT = resolve(HERE, "..");

/** Row-id separator — must match the one sliceArtifact() joins key columns with. */
const SEP = String.fromCharCode(31);
const showId = (id) => id.split(SEP).join("/");

/* ==========================================================================
 * THE REGISTRY — every gate S0→S9, transcribed LITERALLY from the §2 stage
 * tables. This list is the matrix. If a gate is not here, it is not walked, and
 * a gate that is not walked is a gate that silently does not exist.
 *
 * ★ RANGE NOTATION IS BANNED HERE, and that is not stylistic. §S9(d)5:
 *   "The draft wrote 'Re-walk compliance C1–C7' — a range reference to checkpoints
 *    it never named, never staged and never put on the build list. All 17 were
 *    dropped; the range notation is what made the loss invisible to a grep."
 * So all 17 tributaries are named individually below, and G4-PRE's MM-1..MM-15 are
 * named individually in its own lint (build #9), not collapsed here.
 * ========================================================================== */

/**
 * @typedef {object} GateSpec
 * @property {string} id
 * @property {number} stage
 * @property {"PRE"|"CITE"|"FACT"|"PROC"|"HUMAN"|"BUILD"|"LINT"|"SEC"|"REVIEW"|"EXEC"|"FLEET"} kind
 * @property {"always"|"FULL"|"FULL,LITE"|"advisory"} blocking
 * @property {string} command  the enforcing command per the pipeline
 * @property {string} what     what it proves, in one line
 * @property {"A"|"B"|"C"} [track] track-scoped gates only
 * @property {number} [maxAgeDays] evidence that expires (external dependencies)
 */

/** @type {GateSpec[]} */
export const REGISTRY = [
  // ---- S0 · MINE WHAT'S ALREADY THERE ------------------------------------
  { id: "G0-PRE", stage: 0, kind: "PRE", blocking: "always", command: "scripts/protection-map-lint.mjs",
    what: "every legacy URL has exactly one fate; every 301 resolves 200 single-hop; asset rights; restore test" },
  { id: "G0-FACT", stage: 0, kind: "FACT", blocking: "advisory", command: "scripts/audit-perplexity.mjs",
    what: "benchmark claims fact-grounded" },

  // ---- S1 · ALIGN ---------------------------------------------------------
  { id: "G1-PRE", stage: 1, kind: "PRE", blocking: "always", command: "scripts/brief-lint.mjs",
    what: "register, archetype, tier, sign-off owners, soul.md, performance budget" },
  { id: "G1-HUMAN", stage: 1, kind: "HUMAN", blocking: "always", command: null,
    what: "Abilash — 6-bullet comprehension confirm (taken in the G4 sitting)" },

  // ---- S2 · AUDIENCE & PSYCHOLOGY -----------------------------------------
  { id: "G2-PRE", stage: 2, kind: "PRE", blocking: "always", command: "scripts/dossier-lint.mjs",
    what: "every claim row has source URL + verbatim quote + date; per-locale verbatim coverage" },
  { id: "G2-CITE", stage: 2, kind: "CITE", blocking: "always", command: "scripts/cite-resolve.mjs",
    what: "HTTP-resolve every URL + string-match the quote" },
  { id: "G2-PROC", stage: 2, kind: "PROC", blocking: "FULL", command: "scripts/audit-gpt.mjs",
    what: "evidenced audience research, or invented personas?" },

  // ---- S3 · FIND THE REAL DEMAND ★ ----------------------------------------
  { id: "G3-PRE", stage: 3, kind: "PRE", blocking: "always", command: "scripts/keyword-validate.mjs + scripts/seed-lint.mjs",
    what: "V1–V10 + assertions 0–9 + seed Rule A/B — failures #1 #2 #3 #4 live here" },
  { id: "G3-FACT", stage: 3, kind: "FACT", blocking: "always", command: "scripts/audit-perplexity.mjs --raw",
    what: "is 27.1K real for turmeric US? only live search can say" },
  { id: "G3-PROC", stage: 3, kind: "PROC", blocking: "always", command: "scripts/audit-gpt.mjs",
    what: "order violations, missed steps, method soundness" },

  // ---- S4 · WILL IT SELL? -------------------------------------------------
  { id: "G4-PRE", stage: 4, kind: "PRE", blocking: "always", command: "scripts/business-case-lint.mjs",
    what: "MM-1 … MM-15, each asserted literally by the lint" },
  { id: "G4-PROC", stage: 4, kind: "PROC", blocking: "always", command: "scripts/audit-gpt.mjs",
    what: "information-gain-per-URL; scaled-content-abuse exposure" },
  { id: "G4-HUMAN", stage: 4, kind: "HUMAN", blocking: "always", command: null,
    what: "Abilash — 'will it sell?' is a commercial call" },
  { id: "G4-HUMAN-2", stage: 4, kind: "HUMAN", blocking: "always", command: null,
    what: "Dr. Deepu John — co-gatekeeper where clinical capacity is committed" },

  // ---- S5 · DRAW THE MAP ★ (the hinge) ------------------------------------
  { id: "G5-PRE", stage: 5, kind: "PRE", blocking: "always", command: "scripts/sitemap-gate.mjs",
    what: "1:1 keyword→URL per locale; zero orphans + control probe; URL grammar; locale fates" },
  { id: "G5-FACT", stage: 5, kind: "FACT", blocking: "FULL", command: "scripts/audit-perplexity.mjs --raw",
    what: "demand numbers become permanent architecture here" },
  { id: "G5-PROC", stage: 5, kind: "PROC", blocking: "always", command: "scripts/audit-gpt.mjs",
    what: "mental-model vs demand vs register-lock conflicts" },
  { id: "G5-HUMAN", stage: 5, kind: "HUMAN", blocking: "always", command: null,
    what: "Abilash approves the tree — one of his three sittings" },
  { id: "G5-EXEC", stage: 5, kind: "EXEC", blocking: "always", track: "B", command: "scripts/shopify-admin-diff.mjs",
    what: "post-execution admin diff — the store is the artifact" },

  // ---- S6 · WHAT EACH PAGE SAYS -------------------------------------------
  { id: "G6-PRE", stage: 6, kind: "PRE", blocking: "always", command: "packages/compliance/bin/lint.js + scripts/claims-lint.mjs",
    what: "banned words (negation-aware, control-probed); banned strings; process-claim register; schema" },
  { id: "G6-CITE", stage: 6, kind: "CITE", blocking: "always", command: "scripts/cite-resolve.mjs",
    what: "resolve every citation; resolveClassicalRef() for the classical tier" },
  { id: "G6-FACT", stage: 6, kind: "FACT", blocking: "always", command: "scripts/audit-perplexity.mjs --raw",
    what: "100% of safety.* / interactions.* and every new claim type, fact-grounded" },
  { id: "G6-PROC", stage: 6, kind: "PROC", blocking: "always", command: "scripts/audit-gpt.mjs",
    what: "AEO shape designed in; 'is this generic AI filler?'" },
  { id: "G6-BUILD", stage: 6, kind: "BUILD", blocking: "always", command: "pnpm build (resolveReview() throws)",
    what: "no fabricated physician review can be represented — failure #5. ⭐ the one gate that is LIVE" },
  { id: "G6-LINT", stage: 6, kind: "LINT", blocking: "always", command: "scripts/content-lint.mjs",
    what: "the 35-rule per-page lint at 3,400-page scale — safety fields, DMR × cure-verb, source denylist" },
  { id: "G6-HUMAN-A", stage: 6, kind: "HUMAN", blocking: "always", command: null,
    what: "the named panel doctor — PER PAGE, for badged (TIER-1) pages" },
  { id: "G6-HUMAN-B", stage: 6, kind: "HUMAN", blocking: "always", command: null,
    what: "Dr. Deepu John or the named panel doctor — PER TEMPLATE, all health templates" },

  // ---- S7 · DESIGN IT -----------------------------------------------------
  { id: "G7-PRE", stage: 7, kind: "PRE", blocking: "always", command: "brand-lint.js + factory spec A4 + scripts/a11y-gate.mjs",
    what: "brand lint; C4-AXE; C4-TARGET; C4-CONTRAST; consent click-depth; placeholder scan; image rights" },
  { id: "G7-PROC", stage: 7, kind: "PROC", blocking: "always", command: "scripts/design-review/PROMPT.md (agent-run)",
    what: "design-critic ≥9.0 avg, no criterion <7 — the repo's strongest non-CI gate" },
  { id: "G7-HUMAN", stage: 7, kind: "HUMAN", blocking: "FULL,LITE", command: null,
    what: "the named accessibility reviewer — machines cover only ~30–40% of WCAG" },
  { id: "G7-ADV", stage: 7, kind: "PROC", blocking: "advisory", command: "scripts/audit-gpt.mjs",
    what: "advisory only — text judgement of visual work is weak, honestly labelled" },

  // ---- S8 · BUILD IT ------------------------------------------------------
  { id: "G8-PRE", stage: 8, kind: "PRE", blocking: "always", command: "gate.yml + factory-gate.yml",
    what: "pnpm build clean, spec suite, compliance lint, brand lint, gitleaks, pnpm audit, bundle budget" },
  { id: "G8-SEC", stage: 8, kind: "SEC", blocking: "always", command: "gate.yml security-review job",
    what: "/security-review on the release diff — zero high/critical" },
  { id: "G8-REVIEW", stage: 8, kind: "REVIEW", blocking: "always", command: "code-review stage",
    what: "code-review on Tier-1 PRs (KD-h claims it; no job exists)" },

  // ---- S9 · STAGE IT AND PROVE IT ----------------------------------------
  // G9-PRE is THIS command and is deliberately absent: a gate cannot be its own
  // evidence. It is the one gate whose proof is the exit code of this process.
  { id: "G9-FACT", stage: 9, kind: "FACT", blocking: "always", command: "scripts/audit-perplexity.mjs --raw",
    what: "final fact sweep on the BUILT pages, raw" },
  { id: "G9-PROC", stage: 9, kind: "PROC", blocking: "always", command: "scripts/audit-gpt.mjs",
    what: "final re-walk" },
  { id: "G9-HUMAN", stage: 9, kind: "HUMAN", blocking: "always", command: null,
    what: "Abilash approves the preview (the G-LIVE sitting)" },

  // ---- THE FLEET INVARIANT (§11.7) ---------------------------------------
  // ★ This row exists because §11.7 names THIS command as the thing that gets it
  // wrong: "The 410 lands. kairali.com's G5 verdict is now false — but its artifact
  // hash still matches, so G9-PRE passes and S9 certifies the site." Hashing proves
  // internal consistency and is SILENT about external dependencies. On a 28-site
  // fleet with sibling 301s, the external dependencies are where the equity is. So
  // this gate's evidence EXPIRES: a snapshot is not a check for a target you do not own.
  { id: "G11-FLEET", stage: 9, kind: "FLEET", blocking: "always", command: "scripts/fleet-redirect-check.mjs",
    maxAgeDays: 31,
    what: "cross-domain 301 targets still resolve — evidence older than 31 days is not evidence (§11.7)" },
];

/**
 * THE 17 COMPLIANCE TRIBUTARIES (§S9(d)5), named literally, never as a range.
 * `at` is the stage that OWNS the checkpoint; S9 re-walks all of them.
 * @type {{id:string, at:number, what:string, track?:"A"|"B"|"C", note?:string}[]}
 */
export const TRIBUTARIES = [
  { id: "C1-FORM", at: 5, what: "lawful basis + retention period per form, declared in the sitemap" },
  { id: "C1-ART9", at: 6, what: "explicit-consent rebuild if a form captures condition/ailment" },
  { id: "C1-PRECONSENT", at: 9, what: "tags verified SILENT before consent — a passing unit test is not evidence",
    note: "§10.5 maps this to S10 (live). §S9(d)5 re-walks it at S9. Required at BOTH: staging proves the build, live proves the deployment. Verified here against staging." },
  { id: "C1-BANNER", at: 7, what: "consent copy written; click-depth(reject) ≤ click-depth(accept)" },
  { id: "C2-SCHEDULE", at: 3, what: "Schedule-disease term scan AT KEYWORD TIME — a keyword we may not target is not a keyword" },
  { id: "C2-TIER", at: 1, what: "claims tier per entity" },
  { id: "C2-MARKET", at: 5, what: "claim-collision log; disclaimer placement as an IA decision" },
  { id: "C3-REVIEW", at: 6, what: "review model, honest absence — resolveReview()" },
  { id: "C3-SCHEMA", at: 6, what: "schema per template, planned not retrofitted" },
  { id: "C3-STALE", at: 6, what: "lastReviewed > N months ⇒ warn — a 2026 badge still showing in 2030 is the fabricated review arriving slowly",
    note: "N is Dr. Deepu John's call (open #17). The rule is unwritable until he sets N." },
  { id: "C4-AXE", at: 7, what: "axe-core on every template, in CI" },
  { id: "C4-TARGET", at: 7, what: "WCAG 2.5.8 target size 24×24 CSS px" },
  { id: "C4-CONTRAST", at: 7, what: "token-level contrast validation at build" },
  { id: "C5-PDP", at: 6, track: "B", what: "PDP disclosure completeness" },
  { id: "C5-POLICY", at: 5, what: "policy pages are NODES in the sitemap (privacy, cookies, ToS, grievance officer, a11y statement)" },
  { id: "C6-LP", at: 4, track: "C", what: "ad-platform runnability confirmed BEFORE design" },
  { id: "C7-LOCK", at: 6, what: "entity-scoped banned words, all locales",
    note: "DE/FR wordlist is UNVALIDATED by native/legal review (open #12) — a live risk even when this passes." },
];

/** §0.3's change-class table: which gates a slice re-walks. Drives `--slice` (G9-Δ). */
export const CHANGE_CLASSES = {
  "copy-edit": { stage: 6, gates: ["G6-PRE", "G6-CITE", "G6-LINT", "G8-PRE"] },
  "new-claim": { stage: 6, gates: ["G6-PRE", "G6-CITE", "G6-FACT", "G6-LINT", "G6-HUMAN-A", "G8-PRE"] },
  "new-page": { stage: 5, gates: ["G5-PRE", "G5-PROC", "G6-PRE", "G6-CITE", "G6-LINT", "G8-PRE"] },
  "new-cluster": { stage: 3, gates: ["G3-PRE", "G3-FACT", "G3-PROC", "G4-PRE", "G5-PRE"] },
  "template-change": { stage: 7, gates: ["G7-PRE", "G7-PROC", "G8-PRE"] },
  "wave-batch": { stage: 5, gates: ["G5-PRE", "G6-PRE", "G6-LINT", "G8-PRE"] },
  "shopify-pdp-copy": { stage: 6, gates: ["G6-PRE", "G6-CITE", "G5-EXEC"] },
  "lp-variant": { stage: 6, gates: ["G6-PRE", "G7-PRE"] },
};

/** Key columns identifying a row of the S5 keyword→URL map, for slice hashing. */
export const MAP_SLICE_KEYS = ["locale", "keyword"];

/* ==========================================================================
 * STATUS MODEL
 * ========================================================================== */

export const PROVEN = "PROVEN";
export const UNPROVEN = "UNPROVEN";
export const VOID = "VOID";
export const NA = "N/A";

/* ==========================================================================
 * THE WALK
 * ========================================================================== */

/**
 * Resolve one gate against the evidence on disk. Returns a row of the walk table.
 * Nothing here trusts the verdict's own assertions: status is re-derived.
 *
 * @param {GateSpec|{id:string,stage:number,kind:string,blocking:string,what:string,track?:string,command?:string|null,maxAgeDays?:number}} gate
 * @param {{byGate: Map<string, any[]>, repoRoot: string, track: string, tier: string|null,
 *          provenance: (abs:string, root:string)=>any, now: number}} ctx
 */
export function resolveGate(gate, ctx) {
  // `reasons` are CONTRACT VIOLATIONS and nothing else — they alone decide status.
  // `notes` are informational (scoping, caveats). Keeping them apart is not tidiness:
  // when they shared one list, the note "tier UNDECLARED → fail-closed" marked a
  // perfectly-evidenced gate UNPROVEN, i.e. a gate could never pass while an
  // unrelated build was missing. A gate that can only ever say no teaches everyone
  // to ignore it, which is how you get a lint nobody reads.
  const row = {
    gate: gate.id, stage: gate.stage, kind: gate.kind, what: gate.what,
    command: gate.command ?? null,
    status: UNPROVEN, verdictStatus: null, evidence: null, hashMatch: null,
    void: false, voidReason: null, reasons: [], notes: [], advisory: false, blocking: true,
  };

  // Track scoping. A gate for another track is genuinely not applicable — but the
  // REASON is printed, because an unexplained N/A is how a gate disappears.
  if (gate.track && gate.track !== ctx.track) {
    row.status = NA;
    row.blocking = false;
    row.notes.push(`track-scoped to ${gate.track}; this site is track ${ctx.track}`);
    return row;
  }

  // Tier scoping. §0.1: G2-PROC blocks on FULL, is advisory on LITE; G5-FACT blocks
  // on FULL; G7-HUMAN blocks on FULL/LITE. The tier comes from the S1 brief — which
  // is gated by G1-PRE, which is NOT BUILT. So the tier is UNDECLARED, and we
  // FAIL CLOSED: unknown tier means the strictest reading. An unknown that resolves
  // to "less strict" is how a gate gets skipped by accident.
  if (gate.blocking === "advisory") { row.advisory = true; row.blocking = false; }
  else if (gate.blocking !== "always") {
    const tiers = gate.blocking.split(",");
    if (ctx.tier && !tiers.includes(ctx.tier)) { row.advisory = true; row.blocking = false; row.notes.push(`advisory at tier ${ctx.tier}`); }
    else if (!ctx.tier) row.notes.push(`tier UNDECLARED (G1-PRE not built) → treated as blocking (fail-closed)`);
  }

  const found = ctx.byGate.get(gate.id) ?? [];
  if (found.length === 0) {
    // RULE 1. This is the branch that fires ~everywhere today, and it is the point.
    row.reasons.push(`NO VERDICT — the gate has no evidence it ever ran. Absence of artifact = FAIL (§S9(d)4); silence is not consent`);
    return row;
  }

  const v = latest(found);
  row.evidence = relative(ctx.repoRoot, v.__file);
  row.verdictStatus = v.status ?? null;
  row.finishedAt = v.finished_at ?? null;

  // (a) the §0.2 envelope
  const problems = validateVerdict(v, { kind: gate.kind });
  row.reasons.push(...problems);

  // (b) provenance — the rule that separates a verdict from a .md file
  const prov = ctx.provenance(v.__file, ctx.repoRoot);
  row.provenance = prov.available ? `${prov.author || "?"}${prov.isCi ? " [CI]" : ""}${prov.dirty ? " [DIRTY]" : ""}` : "unavailable";
  row.signature = prov.signature ?? "?";
  row.reasons.push(...checkProvenance(v, prov, { kind: gate.kind }));

  // (c) binding — did the thing it judged change underneath it?
  if (typeof v.artifact_path === "string" && v.artifact_path.trim()) {
    const binding = checkBinding(v, ctx.repoRoot, MAP_SLICE_KEYS);
    row.hashMatch = binding.state;
    row.bindingDetail = binding.detail;
    if (binding.state === "MISMATCH") {
      // RULE 2 → the head of the void chain.
      row.void = true;
      row.voidReason = binding.detail;
      row.reasons.push(`VOID: ${binding.detail}`);
    } else if (binding.state !== "MATCH") {
      row.reasons.push(binding.detail);
    }
  }

  // (d) freshness, for evidence about things we do not own (§11.7)
  if (gate.maxAgeDays && v.finished_at) {
    const ageDays = (ctx.now - Date.parse(v.finished_at)) / 86_400_000;
    if (Number.isFinite(ageDays) && ageDays > gate.maxAgeDays) {
      row.void = true;
      row.voidReason = `evidence is ${Math.floor(ageDays)} days old (max ${gate.maxAgeDays})`;
      row.reasons.push(`VOID: ${row.voidReason} — a target you do not own needs re-verification, not a one-shot snapshot (§11.7)`);
    }
  }

  // (e) the verdict's own claim, re-derived last and trusted least
  if (v.status === "FAIL") row.reasons.push(`the gate ran and FAILED (exit ${v.exit_code})`);

  row.status = row.void ? VOID : row.reasons.length === 0 ? PROVEN : UNPROVEN;
  return row;
}

/**
 * ★ THE VOID CHAIN (§0.3). "Changing an artifact voids its verdict and every
 * downstream verdict that consumed it."
 *
 * The dependency edges are the STAGE ORDER itself, and that is not an approximation
 * — §0.1 defines it: "A stage is ENTERED only when the previous stage's exit
 * evidence exists as a committed artifact." Every stage therefore consumes every
 * earlier stage. So an unproven or voided gate at stage N puts every gate at stage
 * > N under a void: they judged work built on an approval that no longer holds.
 *
 * Plus the MONOTONIC RULE, which catches the subtler and more common case: if S5's
 * verdict is NEWER than S6's, then S6 judged a pre-revision artifact. The map was
 * fixed and the content was never re-checked against it. Nobody notices this by
 * hand, ever — both gates are green and both are individually valid.
 *
 * @param {any[]} rows already resolved, any order
 * @returns {any[]} the same rows, mutated with downstream void reasons
 */
export function applyVoidChain(rows) {
  const ordered = [...rows].sort((a, b) => a.stage - b.stage);
  /** @type {{gate:string, stage:number}[]} */
  const broken = [];

  for (const row of ordered) {
    if (row.status === NA || row.advisory) continue;

    // downstream of anything broken upstream
    const upstream = broken.filter((b) => b.stage < row.stage);
    if (upstream.length && row.status === PROVEN) {
      row.void = true;
      row.status = VOID;
      row.voidReason = `downstream of ${upstream.map((u) => u.gate).join(", ")} — it judged work built on an approval that no longer holds (§0.3)`;
      row.reasons.push(`VOID (downstream): ${row.voidReason}`);
    }

    // monotonic rule: a gate must not be older than an upstream gate it depends on
    if (row.status === PROVEN && row.finishedAt) {
      const mine = Date.parse(row.finishedAt);
      for (const other of ordered) {
        if (other.stage >= row.stage || !other.finishedAt || other.status === NA) continue;
        if (Date.parse(other.finishedAt) > mine) {
          row.void = true;
          row.status = VOID;
          row.voidReason = `STALE: ${other.gate} (S${other.stage}) re-ran at ${other.finishedAt}, AFTER this verdict at ${row.finishedAt} — an upstream artifact changed and this gate never re-judged it (§0.3)`;
          row.reasons.push(`VOID (stale): ${row.voidReason}`);
          break;
        }
      }
    }

    if (row.status !== PROVEN) broken.push({ gate: row.gate, stage: row.stage });
  }
  return rows;
}

/* ==========================================================================
 * CONFORMANCE — "the site IS the map" (§S9(d)3)
 * ========================================================================== */

/**
 * Locate the S5 keyword→URL map. §11.6 globs it as `**\/*-keyword-url-map.tsv`.
 *
 * The domain is `whatisayurveda.com` but the repo's artifact convention drops the
 * TLD (`docs/group-inputs/whatisayurveda-niche-brief.md`), so we match on BOTH the
 * full domain and its first label.
 *
 * Ambiguity is an ERROR, never a guess: picking the "first match" among two maps
 * would mean this gate certifying the site against a map nobody chose. And a
 * near-miss (maps exist, none for this domain) is REPORTED — "no map found" with no
 * further detail is how a naming typo becomes an unexplained red gate that someone
 * eventually switches off.
 *
 * @returns {{path: string|null, error: string|null, candidates: string[]}}
 */
export function findMap(repoRoot, domain, explicit) {
  if (explicit) {
    const p = resolve(repoRoot, explicit);
    return existsSync(p)
      ? { path: p, error: null, candidates: [] }
      : { path: null, error: `--map ${explicit} does not exist`, candidates: [] };
  }
  const docs = join(repoRoot, "docs");
  if (!existsSync(docs)) return { path: null, error: null, candidates: [] };

  /** @type {string[]} */
  const hits = [];
  const scan = (dir, depth) => {
    if (depth > 4) return;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) scan(p, depth + 1);
      else if (e.name.endsWith("keyword-url-map.tsv")) hits.push(p);
    }
  };
  scan(docs, 0);

  const label = domain.split(".")[0];
  const mine = hits.filter((h) => h.includes(domain) || h.includes(label));
  if (mine.length === 1) return { path: mine[0], error: null, candidates: hits };
  if (mine.length > 1) {
    return {
      path: null,
      candidates: hits,
      error: `${mine.length} keyword→URL maps match "${domain}": ${mine.map((m) => relative(repoRoot, m)).join(", ")} — refusing to guess which one the build was meant to honour; pass --map`,
    };
  }
  return {
    path: null,
    candidates: hits,
    error: hits.length
      ? `no keyword→URL map matches "${domain}" (or "${label}"), though ${hits.length} exist elsewhere: ${hits.map((h) => relative(repoRoot, h)).join(", ")} — check the filename convention`
      : null,
  };
}

/**
 * ★ THE CONFORMANCE CHECK. The hash proves the artifacts didn't change. It never
 * compared them to the built pages — so S5, the most-audited stage in the pipeline,
 * could be approved by Abilash, hashed, and then IGNORED BY THE BUILD, and the
 * whole matrix walk would go green with every URL different from the approved tree.
 * For a 3,400-page programmatic build whose URLs come from a template, that is not
 * hypothetical.
 *
 * Three assertions, all set arithmetic, all deterministic (§S9(d)3):
 *   1. set(built URLs) == set(map URLs where decision == URL)
 *   2. ∀ page: frontmatter.keywords[] ⊆ the keywords the map binds to that URL
 *   3. no keyword bound to two URLs
 * Plus SLICE COVERAGE, which is mine and is not optional: slice hashing (§0.3) means
 * an appended row does not void old verdicts — so without a coverage check an
 * appended row is judged by NOBODY and skips the gate entirely. That would be a
 * bigger hole than the one slice hashing was built to fix.
 *
 * INPUT CONTRACT (defined here because the pipeline does not define it — flagged):
 *   map  : TSV with columns locale, keyword, url, decision
 *   built: JSON {"urls":[{"url":"/x","keywords":["a","b"]}]} — EMITTED BY THE BUILD,
 *          never hand-written, and itself bound by G8-PRE's verdict.
 */
export function checkConformance(ctx) {
  const out = { status: UNPROVEN, reasons: [], assertions: [], mapPath: null, builtPath: null };

  const found = findMap(ctx.repoRoot, ctx.domain, ctx.mapPath);
  if (!found.path) {
    out.reasons.push(
      found.error ??
      `no S5 keyword→URL map found for ${ctx.domain} (looked for docs/**/*keyword-url-map.tsv) — with no approved map there is nothing for the build to conform TO, and S5 is the hinge`,
    );
    return out;
  }
  const mapAbs = found.path;
  out.mapPath = relative(ctx.repoRoot, mapAbs);

  const builtAbs = resolve(ctx.repoRoot, ctx.builtUrlsPath ?? join("audits", ctx.domain, "built-urls.json"));
  if (!existsSync(builtAbs)) {
    out.reasons.push(`no built-URL inventory at ${relative(ctx.repoRoot, builtAbs)} — the build must EMIT the list of URLs it actually produced. Deriving it here would mean this gate marking its own homework`);
    return out;
  }
  out.builtPath = relative(ctx.repoRoot, builtAbs);

  let built;
  try {
    const raw = JSON.parse(readFileSync(builtAbs, "utf8"));
    built = Array.isArray(raw) ? raw : raw.urls;
    if (!Array.isArray(built)) throw new Error(`expected {"urls":[…]} or a bare array`);
  } catch (e) {
    out.reasons.push(`built-URL inventory is unreadable: ${e.message}`);
    return out;
  }

  const { header, rows } = parseTsv(readFileSync(mapAbs, "utf8"));
  for (const col of ["locale", "keyword", "url", "decision"]) {
    if (!header.includes(col)) {
      out.reasons.push(`the map is missing the "${col}" column (has: ${header.join(", ")}) — matrix-walk cannot check conformance against a map whose shape it cannot read`);
      return out;
    }
  }

  // 1. set equality
  const mapUrls = new Set(rows.filter((r) => r.decision === "URL").map((r) => r.url));
  const builtUrls = new Set(built.map((b) => b.url));
  const missing = [...mapUrls].filter((u) => !builtUrls.has(u)).sort();
  const extra = [...builtUrls].filter((u) => !mapUrls.has(u)).sort();
  out.assertions.push({
    name: "set(built URLs) == set(map URLs where decision == URL)",
    pass: missing.length === 0 && extra.length === 0,
    detail: missing.length || extra.length
      ? `${missing.length} approved URL(s) NOT BUILT [${missing.slice(0, 5).join(", ")}${missing.length > 5 ? ", …" : ""}]; ${extra.length} built URL(s) NOT IN THE MAP [${extra.slice(0, 5).join(", ")}${extra.length > 5 ? ", …" : ""}]`
      : `${mapUrls.size} URLs, exact match`,
  });

  // 2. keywords[] ⊆ the map's bindings for that URL
  /** @type {Map<string, Set<string>>} */
  const bindings = new Map();
  for (const r of rows) {
    if (r.decision !== "URL") continue;
    if (!bindings.has(r.url)) bindings.set(r.url, new Set());
    bindings.get(r.url).add(r.keyword);
  }
  const strays = [];
  for (const page of built) {
    const allowed = bindings.get(page.url) ?? new Set();
    for (const k of page.keywords ?? []) if (!allowed.has(k)) strays.push(`${page.url} claims "${k}"`);
  }
  out.assertions.push({
    name: "∀ page: frontmatter.keywords[] ⊆ the map's bindings for that URL",
    pass: strays.length === 0,
    detail: strays.length ? `${strays.length} unbound keyword claim(s): ${strays.slice(0, 5).join("; ")}${strays.length > 5 ? "; …" : ""}` : "every keyword claim is bound by the map",
  });

  // 3. no keyword bound to two URLs (per locale — the same word legitimately maps
  //    to different URLs in EN and DE; collapsing locales would fake a violation)
  /** @type {Map<string, Set<string>>} */
  const kw = new Map();
  for (const r of rows) {
    if (r.decision !== "URL") continue;
    const key = `${r.locale}${SEP}${r.keyword}`;
    if (!kw.has(key)) kw.set(key, new Set());
    kw.get(key).add(r.url);
  }
  const dupes = [...kw.entries()].filter(([, urls]) => urls.size > 1)
    .map(([k, urls]) => `${showId(k)} → ${[...urls].join(" AND ")}`);
  out.assertions.push({
    name: "no keyword bound to two URLs (within a locale)",
    pass: dupes.length === 0,
    detail: dupes.length ? `${dupes.length} cannibalised keyword(s): ${dupes.slice(0, 5).join("; ")}` : "1:1 keyword→URL holds",
  });

  // 4. slice coverage — every row on disk was judged by SOME S5 verdict
  const s5 = (ctx.byGate.get("G5-PRE") ?? []).filter((v) => v.slice);
  if (s5.length) {
    const judged = new Set();
    for (const v of s5) for (const r of v.slice.rows) judged.add(r.id);
    let current;
    try {
      current = sliceArtifact(readFileSync(mapAbs, "utf8"), MAP_SLICE_KEYS);
    } catch (e) {
      current = null;
      out.assertions.push({ name: "slice coverage: every map row was judged", pass: false, detail: `cannot slice the map: ${e.message}` });
    }
    if (current) {
      const unjudged = current.rows.filter((r) => !judged.has(r.id)).map((r) => showId(r.id));
      out.assertions.push({
        name: "slice coverage: every map row was judged by some G5-PRE verdict",
        pass: unjudged.length === 0,
        detail: unjudged.length
          ? `${unjudged.length} row(s) appended after the last verdict and judged by NOTHING: ${unjudged.slice(0, 5).join(", ")}${unjudged.length > 5 ? ", …" : ""} — slice hashing means these did not void the old verdict; it does not mean they were checked`
          : `all ${current.rows.length} row(s) covered`,
      });
    }
  }

  const failed = out.assertions.filter((a) => !a.pass);
  out.status = failed.length === 0 ? PROVEN : UNPROVEN;
  if (failed.length) out.reasons.push(...failed.map((a) => `${a.name} — ${a.detail}`));
  return out;
}


/* ==========================================================================
 * CONTROL PROBES (§0.6) — the walk challenges its own zero
 * ========================================================================== */

/**
 * "A zero is not believed until a known-present control probe returns non-zero in
 * the same run… No control probe ⇒ the gate did not run."
 *
 * This gate's zero is "zero unproven gates". That claim is only believable if the
 * detector that produces it can still detect an unproven gate AT ALL, IN THIS RUN.
 * Our own banned-word scan returned 0 hits because ugrep silently ignored the
 * word-boundary syntax; the control word returned 0 too, and that is the only reason
 * anyone noticed. A silently-broken lint reporting "clean" is worse than no lint.
 *
 * Probe 1: a synthetic gate that CANNOT have a verdict must come back UNPROVEN.
 * Probe 2: a synthetic verdict binding a real file to a wrong hash must come back VOID.
 * Either probe misfiring means the walk's result is not evidence, whatever it says.
 */
export function runControlProbes(ctx) {
  const probes = [];

  const missing = resolveGate(
    { id: "G-CONTROL-PROBE-MISSING", stage: 0, kind: "PRE", blocking: "always", command: "n/a", what: "control probe" },
    ctx,
  );
  probes.push({ name: "missing-verdict-detector", expected: UNPROVEN, observed: missing.status });

  const realFile = resolve(ctx.repoRoot, "package.json");
  const fake = {
    gate: "G-CONTROL-PROBE-HASH", status: "PASS", artifact_path: "package.json",
    artifact_sha256: "0".repeat(64), rubric_sha256: null, command: "control-probe", argv: [],
    exit_code: 0, started_at: istIso(), finished_at: istIso(), runner: "github-actions",
    ci_run_url: "https://example.invalid/control-probe",
    control_probe: { name: "self", expected: true, observed: true },
    __file: realFile,
  };
  const probeCtx = { ...ctx, byGate: new Map([["G-CONTROL-PROBE-HASH", [fake]]]) };
  const hashRow = resolveGate(
    { id: "G-CONTROL-PROBE-HASH", stage: 0, kind: "PRE", blocking: "always", command: "n/a", what: "control probe" },
    probeCtx,
  );
  probes.push({ name: "hash-mismatch-detector", expected: true, observed: hashRow.void === true });

  const ok = probes.every((p) => JSON.stringify(p.expected) === JSON.stringify(p.observed));
  return { probes, ok };
}

/* ==========================================================================
 * WALK + REPORT
 * ========================================================================== */

/**
 * @param {{site:string, repoRoot?:string, track?:"A"|"B"|"C", tier?:string|null,
 *          slice?:any, mapPath?:string, builtUrlsPath?:string,
 *          provenance?:Function, now?:number}} opts
 */
export function walk(opts) {
  const repoRoot = opts.repoRoot ?? DEFAULT_REPO_ROOT;
  const domain = opts.site;
  const auditDir = join(repoRoot, "audits", domain);
  const { byGate, malformed } = loadVerdicts(auditDir);

  const ctx = {
    byGate, repoRoot, domain,
    track: opts.track ?? "A",
    tier: opts.tier ?? null,
    provenance: opts.provenance ?? gitProvenance,
    now: opts.now ?? Date.now(),
    mapPath: opts.mapPath,
    builtUrlsPath: opts.builtUrlsPath,
  };

  // Which gates does this walk cover? Full walk = all of them (G9-PRE). A slice
  // walk (G9-Δ) covers only what §0.3's change-class table says the change re-enters.
  let gates = REGISTRY;
  let mode = "G9-PRE";
  let sliceInfo = null;
  if (opts.slice) {
    const cls = CHANGE_CLASSES[opts.slice.class];
    if (!cls) throw new Error(`unknown change class "${opts.slice.class}" — known: ${Object.keys(CHANGE_CLASSES).join(", ")}`);
    mode = "G9-Δ";
    sliceInfo = { class: opts.slice.class, reEntersAt: `S${cls.stage}`, gates: cls.gates };
    gates = REGISTRY.filter((g) => cls.gates.includes(g.id));
  }

  const rows = gates.map((g) => resolveGate(g, ctx));

  // Tributaries ride the same evidence rule: a checkpoint with no verdict is a
  // checkpoint nobody ran. §S9(d)5 re-walks all 17 at S9 — named, never ranged.
  const tribRows = (opts.slice ? [] : TRIBUTARIES).map((t) =>
    Object.assign(
      resolveGate(
        { id: t.id, stage: t.at, kind: "PRE", blocking: "always", command: null, what: t.what, track: t.track },
        ctx,
      ),
      { tributary: true, note: t.note ?? null },
    ),
  );

  // ONE chain over gates AND tributaries. They are not separate universes: an
  // unproven S3 gate must void a C4 tributary at S7 exactly as it voids G7-PRE,
  // because both judged work standing on the same broken approval. Running two
  // chains would quietly exempt the 17 checkpoints the draft already lost once.
  applyVoidChain([...rows, ...tribRows]);

  const conformance = opts.slice ? { status: NA, reasons: ["slice walk: conformance is scoped to the slice's URLs"], assertions: [] } : checkConformance(ctx);
  const control = runControlProbes(ctx);

  const all = [...rows, ...tribRows];
  const blocking = all.filter((r) => r.blocking && r.status !== NA);
  const unproven = blocking.filter((r) => r.status !== PROVEN);
  const voided = all.filter((r) => r.void);
  const unrepaired = voided.filter((r) => r.blocking);

  const ship =
    control.ok &&
    unproven.length === 0 &&
    unrepaired.length === 0 &&
    malformed.length === 0 &&
    (conformance.status === PROVEN || conformance.status === NA);

  return {
    mode, domain, repoRoot, sliceInfo,
    asOf: istStamp(new Date(ctx.now)),
    rows, tribRows, all, conformance, control, malformed,
    unproven, voided, unrepaired,
    unverified: all.filter((r) => r.status === UNPROVEN || r.status === VOID),
    ship,
    tier: ctx.tier, track: ctx.track,
  };
}

const ICON = { [PROVEN]: "✅", [UNPROVEN]: "❌", [VOID]: "🟠", [NA]: "—" };

/**
 * A tributary with no command is NOT a human gate — it is a checkpoint the pipeline
 * never assigned a machine to. Printing "(human)" there would invent an owner for
 * work nobody has been given, which is the same move as declaring a rule binding
 * and never building its enforcement.
 */
function commandLabel(row) {
  if (row.command) return row.command;
  if (row.kind === "HUMAN") return "(human — not delegable)";
  if (row.tributary) return "(NO MACHINE ASSIGNED — the checkpoint has no enforcing command; see §12 build list)";
  return "(none)";
}

function pad(s, n) { s = String(s ?? ""); return s.length >= n ? s.slice(0, n) : s + " ".repeat(n - s.length); }

/** The §S9(g) walk table + the honest UNVERIFIED list. */
export function renderText(r) {
  const L = [];
  L.push("");
  L.push(`=== ${r.mode} MATRIX WALK — ${r.domain} — ${r.ship ? "SHIP" : "DO-NOT-SHIP"} ===`);
  L.push(`as of ${r.asOf} · track ${r.track} · tier ${r.tier ?? "UNDECLARED (G1-PRE not built)"}`);
  if (r.sliceInfo) L.push(`slice: class "${r.sliceInfo.class}" re-enters at ${r.sliceInfo.reEntersAt}; gates ${r.sliceInfo.gates.join(", ")}`);
  L.push("");
  L.push(`${pad("STAGE", 6)}${pad("GATE", 16)}${pad("KIND", 7)}${pad("STATUS", 13)}${pad("VERDICT", 9)}${pad("HASH", 18)}${pad("VOID?", 7)}EVIDENCE`);
  L.push("-".repeat(112));
  const line = (row) => `${pad("S" + row.stage, 6)}${pad(row.gate, 16)}${pad(row.kind, 7)}${pad(ICON[row.status] + " " + row.status, 13)}${pad(row.verdictStatus ?? "—", 9)}${pad(row.hashMatch ?? "—", 18)}${pad(row.void ? "VOID" : "—", 7)}${row.evidence ?? "(none)"}`;
  for (const row of [...r.rows].sort((a, b) => a.stage - b.stage || a.gate.localeCompare(b.gate))) L.push(line(row));
  L.push("");
  L.push(`--- THE 17 COMPLIANCE TRIBUTARIES (§S9(d)5 — named literally, never as a range) ---`);
  for (const row of r.tribRows) L.push(line(row));

  L.push("");
  L.push(`--- CONFORMANCE: the site IS the map (§S9(d)3) --- ${ICON[r.conformance.status] ?? ""} ${r.conformance.status}`);
  if (r.conformance.mapPath) L.push(`  map:   ${r.conformance.mapPath}`);
  if (r.conformance.builtPath) L.push(`  built: ${r.conformance.builtPath}`);
  for (const a of r.conformance.assertions) L.push(`  ${a.pass ? "✅" : "❌"} ${a.name}\n       ${a.detail}`);
  for (const reason of r.conformance.reasons) L.push(`  ❌ ${reason}`);

  L.push("");
  L.push(`--- CONTROL PROBES (§0.6 — this walk challenges its own zero) --- ${r.control.ok ? "✅ detectors live" : "❌ DETECTOR BROKEN"}`);
  for (const p of r.control.probes) {
    L.push(`  ${JSON.stringify(p.expected) === JSON.stringify(p.observed) ? "✅" : "❌"} ${p.name}: expected ${JSON.stringify(p.expected)}, observed ${JSON.stringify(p.observed)}`);
  }

  if (r.malformed.length) {
    L.push("");
    L.push(`--- MALFORMED EVIDENCE (never silently skipped) ---`);
    for (const m of r.malformed) L.push(`  ❌ ${relative(r.repoRoot, m.file)}: ${m.reason}`);
  }

  // §S9(d)7: "LIST EVERY UNVERIFIED ITEM AS UNVERIFIED. The S9 report is not
  // 'all green' — it is 'these are green, these are unverified, and here is why.'"
  L.push("");
  L.push(`--- UNPROVEN GATES (${r.unproven.length}) — each one is a step nobody can show was taken ---`);
  for (const row of r.unproven.sort((a, b) => a.stage - b.stage)) {
    L.push(`  ❌ S${row.stage} ${row.gate} — ${row.what}`);
    L.push(`     enforcing command: ${commandLabel(row)}`);
    for (const reason of row.reasons) L.push(`     · ${reason}`);
    for (const n of row.notes ?? []) L.push(`     (note) ${n}`);
    if (row.note) L.push(`     ⚠ ${row.note}`);
  }
  if (r.voided.length) {
    L.push("");
    L.push(`--- THE VOID CHAIN (${r.voided.length}) — a voided gate is normal; an UNREPAIRED one is the failure (§0.3) ---`);
    for (const row of r.voided) L.push(`  🟠 ${row.gate}: ${row.voidReason}`);
  }

  L.push("");
  L.push("=".repeat(110));
  if (r.ship) {
    L.push(`SHIP — every blocking gate S0→S9 is proven by a §0.2-compliant verdict bound to an unchanged artifact, emitted by a CI job.`);
  } else {
    L.push(`DO-NOT-SHIP — ${r.unproven.length} blocking gate(s) unproven, ${r.unrepaired.length} unrepaired void(s).`);
    L.push(`The site may well be fine. That is not the claim being tested. The claim being tested is whether anyone can`);
    L.push(`SHOW the steps were taken — and for the gates listed above, nobody can. Doctrine in a .md file is zero evidence.`);
  }
  L.push("=".repeat(110));
  L.push("");
  return L.join("\n");
}

/** §S9(g): audits/<domain>/G9-matrix-walk-<date>.md */
export function renderMarkdown(r) {
  const date = r.asOf.slice(0, 10);
  const L = [];
  L.push(`# ${r.mode} MATRIX WALK — ${r.domain} — **${r.ship ? "SHIP" : "DO-NOT-SHIP"}**`);
  L.push("");
  L.push(`_as of ${r.asOf} · track ${r.track} · tier ${r.tier ?? "UNDECLARED"} · generated by \`scripts/matrix-walk.mjs\`; do not hand-edit — re-run it._`);
  L.push("");
  L.push(`| Stage | Gate | Kind | Status | Verdict | Evidence | Hash | Void? | Enforcing command |`);
  L.push(`|---|---|---|---|---|---|---|---|---|`);
  for (const row of [...r.all].sort((a, b) => a.stage - b.stage || a.gate.localeCompare(b.gate))) {
    L.push(`| S${row.stage} | \`${row.gate}\` | ${row.kind} | ${ICON[row.status]} ${row.status} | ${row.verdictStatus ?? "—"} | ${row.evidence ? `\`${row.evidence}\`` : "—"} | ${row.hashMatch ?? "—"} | ${row.void ? "**VOID**" : "—"} | ${row.command ? `\`${row.command}\`` : (row.tributary ? "_no machine assigned_" : "_human_")} |`);
  }
  L.push("");
  L.push(`## Conformance — the site IS the map (§S9(d)3): ${r.conformance.status}`);
  for (const a of r.conformance.assertions) L.push(`- ${a.pass ? "✅" : "❌"} **${a.name}** — ${a.detail}`);
  for (const reason of r.conformance.reasons) L.push(`- ❌ ${reason}`);
  L.push("");
  L.push(`## Control probes (§0.6): ${r.control.ok ? "✅ detectors live" : "❌ DETECTOR BROKEN — this result is not evidence"}`);
  for (const p of r.control.probes) L.push(`- ${JSON.stringify(p.expected) === JSON.stringify(p.observed) ? "✅" : "❌"} \`${p.name}\` expected \`${JSON.stringify(p.expected)}\`, observed \`${JSON.stringify(p.observed)}\``);
  L.push("");
  L.push(`## UNPROVEN (${r.unproven.length}) — listed as unverified, never assumed (§S9(d)7, CLAUDE.md rule f)`);
  for (const row of r.unproven.sort((a, b) => a.stage - b.stage)) {
    L.push(`- ❌ **S${row.stage} \`${row.gate}\`** — ${row.what}`);
    for (const reason of row.reasons) L.push(`  - ${reason}`);
  }
  if (r.voided.length) {
    L.push("");
    L.push(`## The void chain (${r.voided.length})`);
    for (const row of r.voided) L.push(`- 🟠 \`${row.gate}\`: ${row.voidReason}`);
  }
  L.push("");
  L.push(`_${date} · exit ${r.ship ? 0 : 2}_`);
  return L.join("\n") + "\n";
}

/* ------------------------------------------------------------------- CLI */

function parseArgs(argv) {
  const o = { site: null, track: "A", tier: null, slice: null, json: false, write: true, mapPath: undefined, builtUrlsPath: undefined };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--site") o.site = argv[++i];
    else if (a === "--track") o.track = argv[++i];
    else if (a === "--tier") o.tier = argv[++i];
    else if (a === "--slice") o.slice = argv[++i];
    else if (a === "--map") o.mapPath = argv[++i];
    else if (a === "--built-urls") o.builtUrlsPath = argv[++i];
    else if (a === "--json") o.json = true;
    else if (a === "--no-write") o.write = false;
    else throw new Error(`unknown argument "${a}"`);
  }
  return o;
}

async function main() {
  const started = istIso();
  const args = parseArgs(process.argv.slice(2));
  if (!args.site) {
    console.error("usage: node scripts/matrix-walk.mjs --site <domain> [--track A|B|C] [--tier FULL|LITE|MIN] [--slice slice.json] [--json] [--no-write]");
    process.exit(1);
  }
  const slice = args.slice ? JSON.parse(readFileSync(resolve(process.cwd(), args.slice), "utf8")) : null;
  const r = walk({ ...args, slice });

  if (args.json) console.log(JSON.stringify(r, (k, v) => (k === "__file" ? undefined : v), 2));
  else process.stdout.write(renderText(r));

  if (args.write) {
    const dir = join(r.repoRoot, "audits", r.domain);
    mkdirSync(dir, { recursive: true });
    const md = join(dir, `G9-matrix-walk-${r.asOf.slice(0, 10)}.md`);
    writeFileSync(md, renderMarkdown(r));

    // Dogfood: this gate emits its own §0.2 verdict, from the run that produced it.
    // It binds the REPORT (this run's artifact). Its status is the walk's real
    // result — a FAIL verdict committed by CI is exactly as valuable as a PASS.
    emitVerdict({
      gate: r.mode === "G9-Δ" ? "G9-DELTA" : "G9-PRE",
      status: r.ship ? "PASS" : "FAIL",
      artifactPath: relative(r.repoRoot, md),
      repoRoot: r.repoRoot,
      command: "node scripts/matrix-walk.mjs",
      argv: process.argv.slice(2),
      exitCode: r.ship ? 0 : 2,
      startedAt: started,
      controlProbe: {
        name: r.control.probes.map((p) => p.name).join("+"),
        expected: r.control.probes.map((p) => p.expected),
        observed: r.control.probes.map((p) => p.observed),
      },
      extra: {
        unproven_gates: r.unproven.map((x) => x.gate),
        void_chain: r.voided.map((x) => ({ gate: x.gate, reason: x.voidReason })),
        conformance: r.conformance.status,
      },
      outPath: join("audits", r.domain, `${r.mode === "G9-Δ" ? "G9-DELTA" : "G9-PRE"}-verdict.json`),
    });
    if (!args.json) console.log(`report:  ${relative(r.repoRoot, md)}\nverdict: audits/${r.domain}/${r.mode === "G9-Δ" ? "G9-DELTA" : "G9-PRE"}-verdict.json\n`);
  }

  process.exit(r.ship ? 0 : 2);
}

// Only run as a CLI, never on import (the test imports walk()).
if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  main().catch((e) => { console.error("matrix-walk harness error:", e.message); process.exit(1); });
}
