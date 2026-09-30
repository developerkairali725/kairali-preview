#!/usr/bin/env node
/**
 * go-science-audit.mjs — GO-SCIENCE CONFORMANCE GATE ("What would Akshar say?").
 *
 * THE LAW (owner directives, 18 Jul 2026):
 *   D-GO-SCIENCE-GATE / DIRECTIVES.md D-20260718-20 (Abilash in-chat voice,
 *   ~19:56 IST): every site/LP build — organic AND Shopify — is "checked for
 *   GO-science conformance (MCB + MOA per docs/marketing/go-science/) during
 *   build AND as a final pre-ship pass; a FAIL means the content is
 *   rebuilt/refixed, never shipped around."
 *
 *   AMENDMENT (same evening, 19:58:22 IST, from his phone; DECISIONS.md):
 *   "the conformance check covers CONTENT AND LOOK — the page must be
 *   PSYCHOLOGICALLY ATTRACTIVE to its MOA (awareness-stage audience), visually
 *   and structurally, not just copy-conformant. ROI IS THE KEY METRIC — the
 *   audit judges every element (visual hierarchy, imagery, CTA psychology,
 *   trust signals) by whether it converts the MOA audience."
 *
 *   Context: D-AKSHAR-ROLE / D-20260718-02 — Akshar Yadav is Abilash's
 *   MARKETING TEACHER; his GO-science teachings (docs/marketing/go-science/)
 *   are standing build-time doctrine for everything marketing. The working
 *   question for every page is literally "What would Akshar say?".
 *
 * WHAT THIS SCRIPT IS: the registry's `run: agent` harness for the
 * go-science-conformance gate. The RUBRIC below is DERIVED from
 * docs/marketing/go-science/ — every criterion cites its source passage
 * VERBATIM, and verifyRubricCitations() re-checks each quote against the docs
 * on every run: if the docs drift, the script FAIL-CLOSES rather than judging
 * against a rubric the docs no longer back. Framework content is NEVER
 * invented here; where the docs are ambiguous the rubric does not guess — the
 * ambiguity is logged in QUESTIONS.md (Q-GO-SCIENCE-RUBRIC) and cited.
 *
 * HOW A RUN WORKS (mirrors design-review.mjs, the house auditor pattern):
 *   1. `--rubric` prints the machine-readable rubric + ambiguity register.
 *      The EVALUATING AGENT (a subagent with the page, strategy artifact and
 *      the desktop+mobile screenshots in front of it — a vision-capable model
 *      for the LOOK section) answers every criterion with a strict
 *      PASS|FAIL + finding + evidence, into a findings JSON.
 *   2. The full run validates that findings file: every criterion answered
 *      exactly once, strict enums only, non-empty findings, the working
 *      question acknowledged, and the findings HASH-BOUND to the exact
 *      artifacts on disk (a findings file produced against different bytes is
 *      refused — scripts/lib/verdict.mjs binding law).
 *   3. Evidence lands at launches/<site>/go-science/<date>.md (pass 1;
 *      `-pass<N>` for N>=2), append-only — an existing file is never
 *      overwritten (a rerun that could overwrite a FAIL is a forgery surface).
 *
 * VERDICT ARITHMETIC: the CONTENT section (MCB + MoA) and the LOOK section
 * (visual psychology) are BOTH blocking — overall PASS only when every
 * criterion in both sections is PASS. Exit 0 = PASS · 2 = FAIL (CI blocks;
 * the content/look is rebuilt or refixed, never shipped around) · 1 = harness
 * error, including citation drift and findings that fail validation (an
 * unvalidatable evaluation is never a pass — HARD GATE 6 / rule g).
 *
 * ENTITY LOCKS OUTRANK AESTHETICS: the KTAHV clinical lock and every other
 * HARD GATE bind INSIDE this rubric — a hook that lands its curiosity by
 * violating an entity register is a FAIL on that criterion, never a trade-off.
 *
 * Usage:
 *   node scripts/go-science-audit.mjs --rubric
 *   node scripts/go-science-audit.mjs \
 *     --site whatisayurveda.com \
 *     --page sites/whatisayurveda.com/app/page.tsx \
 *     --strategy docs/group-inputs/whatisayurveda-niche-brief.md \
 *     --screenshot-desktop launches/whatisayurveda.com/home-desktop.png \
 *     --screenshot-mobile launches/whatisayurveda.com/home-mobile.png \
 *     --findings /tmp/go-science-findings.json \
 *     --auditor "claude subagent (session xyz)" [--pass N]
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadImageParts } from "./lib/image-input.mjs";
import { istStamp, sha256 } from "./lib/verdict.mjs";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export const RUBRIC_VERSION = "1.0";
export const WORKING_QUESTION = "What would Akshar say?";

/** The three source docs the rubric is derived from — nothing else. */
export const GO_DOCS = Object.freeze({
  KB: "docs/marketing/go-science/knowledge/ay-science-knowledge.md",
  SKILL: "docs/marketing/go-science/marketplace/skills/go-science/SKILL.md",
  README: "docs/marketing/go-science/README.md",
});

/** Directive provenance, recorded verbatim in every evidence file. */
export const DIRECTIVES = Object.freeze({
  gate: `D-GO-SCIENCE-GATE / DIRECTIVES.md D-20260718-20 (Abilash in-chat voice, 18 Jul 2026 ~19:56 IST): "checked for GO-science conformance (MCB + MOA per docs/marketing/go-science/) during build AND as a final pre-ship pass; a FAIL means the content is rebuilt/refixed, never shipped around"`,
  amendment: `D-GO-SCIENCE-GATE amendment (DECISIONS.md 2026-07-18 19:58:22 IST, in-chat from his phone): "the conformance check covers CONTENT AND LOOK — the page must be PSYCHOLOGICALLY ATTRACTIVE to its MOA (awareness-stage audience), visually and structurally, not just copy-conformant. ROI IS THE KEY METRIC — the audit judges every element (visual hierarchy, imagery, CTA psychology, trust signals) by whether it converts the MOA audience, per docs/marketing/go-science/."`,
  role: `D-AKSHAR-ROLE / D-20260718-02: Akshar Yadav is the MARKETING TEACHER; the working question for everything marketing is "${WORKING_QUESTION}"`,
});

/**
 * AMBIGUITY REGISTER — where the docs do not answer a question the rubric
 * needs answered, we FLAG (QUESTIONS.md Q-GO-SCIENCE-RUBRIC, 2026-07-18) and
 * state the interpretation used, rather than silently inventing doctrine.
 */
export const AMBIGUITIES = Object.freeze([
  Object.freeze({
    id: "A1",
    criteria: ["GS-MCB-1"],
    cites: `${GO_DOCS.KB} §Step 1 — the MCB formula "How to [secret desire] without [painful effort / difficulty]" is defined for a mass OUTBOUND message; the docs never state how an MCB manifests on a WEBSITE page (hero H1? title? the page as a whole?).`,
    interpretation: "The rubric judges the MECHANISM (curiosity generated from the MoA's secret desire, friction removed) on the page's primary hook; it does NOT require the literal \"How to … without …\" syntax.",
    question: "Does the owner/Akshar require literal MCB formula syntax on web heroes, or the mechanism only?",
  }),
  Object.freeze({
    id: "A2",
    criteria: ["GS-MOA-2"],
    cites: `${GO_DOCS.KB} §Step 6 — the 4-group client mapping (Misfits / Profitable-no-referral / Refer-not-profitable / Ideal) is defined for a B2B business-owner MoA with repeat orders and referrals.`,
    interpretation: "For consumer wellness/e-commerce audiences the STRATEGY ARTIFACT must define the ideal-group mapping for its market; the auditor verifies the page serves that declared ideal group and never invents the mapping.",
    question: "How does the 4-group mapping translate to end-consumer segments (e.g. the fleet's MOA Matrix v3.0 segments)?",
  }),
  Object.freeze({
    id: "A3",
    criteria: [],
    cites: `${GO_DOCS.KB} §10 Core Principle 1 — "Price never before Phase 3" governs 4-Phase content; commerce PDPs show price immediately by design, and D-20260718-20 scopes this gate to MCB + MoA.`,
    interpretation: "NOT ENFORCED by this rubric (out of the directive's stated MCB+MoA scope). Flagged so the absence is a decision, not a silence.",
    question: "Does the GO-science gate later widen to 4-Phase rules (price placement on Shopify PDPs), or is the 4-Phase law out of scope for pages?",
  }),
  Object.freeze({
    id: "A4",
    criteria: ["GS-VIS-3"],
    cites: `${GO_DOCS.KB} §7 — the Influence Check asks for the RIGHT emotion "for this stage of the buyer journey", but the docs never assign website PAGE TYPES to SBJ stages.`,
    interpretation: "The STRATEGY ARTIFACT must declare the page's SBJ/awareness stage; the auditor judges emotion-fit against that declaration and FAILS the criterion if no stage is declared (an unjudgeable criterion is never a pass).",
    question: "Owner/Akshar ruling wanted: canonical page-type -> SBJ-stage map for the fleet.",
  }),
  Object.freeze({
    id: "A5",
    criteria: ["GS-MOA-1"],
    cites: `${GO_DOCS.KB} §9 defines MoA = "Market of Avatar"; docs/strategy/POSITIONING_AND_MOA.md defines the fleet's MOA = "Market of Acquisition" (Abilash's usage, MOA Matrix v3.0). Same acronym, two frameworks.`,
    interpretation: "Per D-20260718-20 (\"per docs/marketing/go-science/\") the rubric applies the GO-science definition — the avatar-level ideal-client profile. A fleet MOA segment (e.g. M1/M2) COUNTS as a declared MoA when the strategy artifact carries its niche/type/profile specifics.",
    question: "Confirm the two MOA vocabularies and their precedence are as interpreted.",
  }),
]);

/**
 * THE RUBRIC — derived from docs/marketing/go-science/, one criterion per
 * checkable teaching. Every `citations[].quote` is a VERBATIM substring of its
 * `file` and is re-verified on every run (fail-closed). `section` is the
 * blocking unit: "content" (MCB + MoA copy conformance) and "visual" (the
 * LOOK amendment — judged on the desktop+mobile screenshots).
 */
export const RUBRIC = Object.freeze([
  // ── CONTENT · MCB (Mass Control Bed — KB §Step 1) ──
  {
    id: "GS-MCB-1",
    section: "content",
    framework: "MCB",
    name: "Curiosity hook rooted in the secret desire",
    requirement: "The page's primary hook (hero headline + immediate support copy) is a curiosity-generating message doing the MCB formula's job: the declared MoA's secret desire, gained without the painful effort/difficulty they dread. Mechanism, not literal syntax (ambiguity A1).",
    judge: "Read the hero as the declared MoA. Does it generate curiosity from THEIR secret desire — or is it a generic descriptor of the business?",
    citations: [
      { file: GO_DOCS.KB, quote: "How to [secret desire] without [painful effort / difficulty]" },
      { file: GO_DOCS.KB, quote: "a mass-scale curiosity-generating message" },
    ],
    ambiguity: "A1",
  },
  {
    id: "GS-MCB-2",
    section: "content",
    framework: "MCB",
    name: "Big Promise support",
    requirement: "2–3 Big Promise words/phrases support the hook — short, punchy, showing the specific benefit the MoA gets by engaging.",
    judge: "Are the supporting promises present, punchy and SPECIFIC to this MoA — or vague filler?",
    citations: [
      { file: GO_DOCS.KB, quote: "short, punchy, supporting the main hook, showing the specific benefit they get by engaging with you" },
    ],
  },
  {
    id: "GS-MCB-3",
    section: "content",
    framework: "MCB",
    name: "Small CTA — simple, non-pressuring",
    requirement: "The hook carries a small CTA: a simple, non-pressuring call to action.",
    judge: "Is the primary CTA an easy, low-friction hand-raise — or absent, buried, or pressuring?",
    citations: [
      { file: GO_DOCS.KB, quote: "a simple, non-pressuring call to action" },
    ],
  },
  {
    id: "GS-MCB-4",
    section: "content",
    framework: "MCB",
    name: "Secret desire, not surface need",
    requirement: "The hook targets a genuine SECRET desire of the declared MoA — the deepest thing they want but rarely say out loud — not a surface need.",
    judge: "Name the desire the hook addresses. Is it the deep, rarely-spoken layer for this MoA, or the obvious surface layer?",
    citations: [
      { file: GO_DOCS.KB, quote: "the deepest thing they want but rarely say out loud" },
      { file: GO_DOCS.SKILL, quote: "Check that it targets a genuine secret desire (not surface need)" },
    ],
  },
  {
    id: "GS-MCB-5",
    section: "content",
    framework: "MCB",
    name: "The hand-raise test",
    requirement: "The MCB layer's job is curiosity, not trust-claims: a curious MoA raises their hand. Score the page's hook by that outcome.",
    judge: "Would the declared MoA, encountering this page cold, raise their hand (click the CTA / read on)? Why exactly?",
    citations: [
      { file: GO_DOCS.KB, quote: "People who are curious raise their hand and enter your world" },
      { file: GO_DOCS.SKILL, quote: "Does this create curiosity in the MoA? Would they raise their hand?" },
    ],
  },
  {
    id: "GS-MCB-6",
    section: "content",
    framework: "MCB",
    name: "Signature anchoring",
    requirement: "The strategy artifact declares ONE signature MCB / anchor secret desire for this site, and the page stays anchored to it. No declaration = FAIL (nothing to anchor to).",
    judge: "Quote the strategy artifact's declared signature MCB / secret desire. Is the page anchored to it?",
    citations: [
      { file: GO_DOCS.KB, quote: "It evolves but stays anchored to the same secret desire" },
    ],
  },

  // ── CONTENT · MoA (Market of Avatar — KB §Step 6 + §Step 7) ──
  {
    id: "GS-MOA-1",
    section: "content",
    framework: "MoA",
    name: "MoA declared with Market-2.0 specificity",
    requirement: "The strategy artifact defines this page's MoA precisely — the specific niche, type, size and profile (Market 2.0: target market + ideal customer + niche) — never a generic audience.",
    judge: "Quote the strategy artifact's MoA declaration. Is it avatar-specific, or generic (\"health seekers\", \"wellness travellers\")?",
    citations: [
      { file: GO_DOCS.KB, quote: "the precise definition of your ideal client" },
      { file: GO_DOCS.KB, quote: "The intersection of your target market + ideal customer + niche" },
    ],
    ambiguity: "A5",
  },
  {
    id: "GS-MOA-2",
    section: "content",
    framework: "MoA",
    name: "Built for the ideal group, not misfits",
    requirement: "The page's content and offer are built entirely around the declared IDEAL client group — never around misfits the strategy has excluded.",
    judge: "Who does this page actually attract? The declared ideal group, or a misfit segment the strategy names as not-ours?",
    citations: [
      { file: GO_DOCS.KB, quote: "identify and build your system entirely around Group 4" },
      { file: GO_DOCS.SKILL, quote: "Ensure all materials are built for MoA (not misfits)" },
    ],
    ambiguity: "A2",
  },
  {
    id: "GS-MOA-3",
    section: "content",
    framework: "MoA",
    name: "NDFF grounded, never invented",
    requirement: "Every needs/desires/fears/frustrations claim the page's messaging leans on traces to the strategy artifact's declared NDFF source (MoA interviews / owner-supplied research). NDFF cannot be assumed or guessed by the builder (harmonises with HARD GATE 6).",
    judge: "Trace the page's psychological claims to the strategy artifact's NDFF source. Anything invented?",
    citations: [
      { file: GO_DOCS.KB, quote: "It cannot be assumed or guessed" },
      { file: GO_DOCS.SKILL, quote: "never invent NDFF" },
    ],
  },
  {
    id: "GS-MOA-4",
    section: "content",
    framework: "MoA",
    name: "Enter their world",
    requirement: "The page speaks the declared MoA's language and reality (register, vocabulary, concerns) — it enters THEIR world rather than dragging them into ours. Entity register locks (e.g. KTAHV clinical lock) bind inside this criterion.",
    judge: "Read a passage aloud as the MoA. Is this their language and their reality — within the entity's locked register?",
    citations: [
      { file: GO_DOCS.KB, quote: "speaking their language, understanding their reality" },
      { file: GO_DOCS.KB, quote: "You cannot drag them into your world" },
    ],
  },

  // ── LOOK · VISUAL PSYCHOLOGY (D-GO-SCIENCE-GATE amendment — judged on the
  //    desktop AND mobile screenshots; ROI/conversion of the MoA is the metric) ──
  {
    id: "GS-VIS-1",
    section: "visual",
    framework: "LOOK",
    name: "Visual hierarchy serves the hook",
    requirement: "On BOTH desktop and mobile renders, the curiosity hook is the visually dominant element and the eye-path runs hook → promises → CTA. The MCB anchors the marketing identity — the layout must make it anchor the page.",
    judge: "From the screenshots alone: where does the MoA's eye land first, second, third? Does that path serve the hook and the CTA?",
    citations: [
      { file: GO_DOCS.KB, quote: "The MCB is the anchor of your entire marketing identity" },
    ],
    directive: "amendment",
  },
  {
    id: "GS-VIS-2",
    section: "visual",
    framework: "LOOK",
    name: "Imagery from the MoA's world",
    requirement: "Imagery is chosen for the declared MoA's reality and aspiration — it enters their world — not generic decoration or off-avatar stock.",
    judge: "Would the declared MoA recognise themselves (their situation, their aspiration) in these images?",
    citations: [
      { file: GO_DOCS.KB, quote: "speaking their language, understanding their reality" },
    ],
    directive: "amendment",
  },
  {
    id: "GS-VIS-3",
    section: "visual",
    framework: "LOOK",
    name: "Right emotion for the stage",
    requirement: "The strategy artifact declares the page's SBJ/awareness stage; the rendered page triggers the RIGHT emotion(s) for that stage (curiosity / excitement / interest / desire / warm / wow). No declared stage = FAIL (ambiguity A4).",
    judge: "Name the emotions the rendered page actually triggers and check them against the declared stage.",
    citations: [
      { file: GO_DOCS.KB, quote: "Every message must trigger specific emotions to move prospects forward" },
      { file: GO_DOCS.KB, quote: "Is it the RIGHT emotion for this stage of the buyer journey?" },
    ],
    directive: "amendment",
    ambiguity: "A4",
  },
  {
    id: "GS-VIS-4",
    section: "visual",
    framework: "LOOK",
    name: "CTA psychology — forward, not pressure",
    requirement: "The CTA is visually findable at the natural decision moments on desktop AND mobile, reads simple and non-pressuring, and its influence moves the MoA genuinely forward.",
    judge: "At each scroll-depth decision moment: is the CTA there, is it easy, and is the influence forward-moving rather than pressuring?",
    citations: [
      { file: GO_DOCS.KB, quote: "Is the influence moving the prospect genuinely forward — or creating pressure?" },
      { file: GO_DOCS.KB, quote: "a simple, non-pressuring call to action" },
    ],
    directive: "amendment",
  },
  {
    id: "GS-VIS-5",
    section: "visual",
    framework: "LOOK",
    name: "Trust signals staged for the MoA",
    requirement: "Trust elements (testimonials, case studies, credentials, certifications) are present as the page's stage requires and are staged to SUPPORT the curiosity hook, not displace it — trust accumulates after the hand-raise.",
    judge: "Which trust signals are visible, where, and do they support or smother the hook for this MoA at this stage?",
    citations: [
      { file: GO_DOCS.KB, quote: "built on trust already accumulated through MCB" },
      { file: GO_DOCS.KB, quote: "People who are curious raise their hand and enter your world" },
    ],
    directive: "amendment",
  },
  {
    id: "GS-VIS-6",
    section: "visual",
    framework: "LOOK",
    name: "Every element answers to ROI",
    requirement: "Every major element (above the fold especially, desktop AND mobile) has a conversion job: it moves the declared MoA toward the CTA. ROI is the key metric — an element that cannot answer \"how does this convert the MoA?\" is a finding.",
    judge: "Walk the major elements top to bottom and make each one answer: what is your conversion job for this MoA?",
    citations: [
      { file: GO_DOCS.KB, quote: "You can control the flow of your prospect's purchase decision with SBJ" },
    ],
    directive: "amendment",
  },
].map(Object.freeze));

export const SECTIONS = Object.freeze({
  content: "CONTENT — MCB + MoA conformance (D-20260718-20)",
  visual: "LOOK — visual psychology for the MoA, ROI the key metric (D-GO-SCIENCE-GATE amendment)",
});

/* ------------------------------------------------------- citation integrity */

/**
 * Verify every rubric citation is a VERBATIM substring of its source doc.
 * Empty result = the rubric is still backed by the docs. Non-empty = the docs
 * drifted (or are missing) and the gate FAIL-CLOSES: judging against an
 * unbacked rubric would be inventing framework content.
 * @param {{repoRoot?: string, rubric?: typeof RUBRIC}} [opts]
 * @returns {string[]} problems
 */
export function verifyRubricCitations({ repoRoot = REPO_ROOT, rubric = RUBRIC } = {}) {
  const problems = [];
  const cache = new Map();
  for (const c of rubric) {
    if (!Array.isArray(c.citations) || c.citations.length === 0) {
      problems.push(`${c.id}: no citations — every criterion must be derived from docs/marketing/go-science/, never invented`);
      continue;
    }
    for (const { file, quote } of c.citations) {
      if (!cache.has(file)) {
        const abs = resolve(repoRoot, file);
        cache.set(file, existsSync(abs) ? readFileSync(abs, "utf8") : null);
      }
      const text = cache.get(file);
      if (text === null) problems.push(`${c.id}: cited doc ${file} does not exist`);
      else if (!text.includes(quote)) problems.push(`${c.id}: quote not found verbatim in ${file}: "${quote}" — the docs drifted; re-derive the rubric from the docs, never the reverse`);
    }
  }
  return problems;
}

/* ----------------------------------------------------------- arg parsing */

/**
 * Parse CLI args. Throws on anything missing/malformed BEFORE any work.
 * @param {string[]} argv
 */
export function parseArgs(argv) {
  const out = {
    rubric: false, site: "", page: "", strategy: "",
    screenshotDesktop: "", screenshotMobile: "",
    findings: "", auditor: "", pass: "1",
  };
  const map = {
    "screenshot-desktop": "screenshotDesktop",
    "screenshot-mobile": "screenshotMobile",
  };
  let key = null;
  for (const a of argv) {
    if (a === "--rubric") { out.rubric = true; key = null; continue; }
    if (a.startsWith("--")) { key = map[a.slice(2)] ?? a.slice(2); continue; }
    if (key) { out[key] = a; key = null; }
  }
  if (out.rubric) return out;
  const missing = [];
  if (!out.site) missing.push("--site");
  if (!out.page) missing.push("--page");
  if (!out.strategy) missing.push("--strategy");
  if (!out.screenshotDesktop) missing.push("--screenshot-desktop");
  if (!out.screenshotMobile) missing.push("--screenshot-mobile");
  if (!out.findings) missing.push("--findings");
  if (!out.auditor) missing.push("--auditor");
  if (missing.length) {
    throw new Error(
      `missing required: ${missing.join(", ")} — the gate judges the page WITH its strategy artifact AND its rendered look ` +
      `(desktop + mobile screenshots, per the D-GO-SCIENCE-GATE amendment), and every evaluation names its evaluator`,
    );
  }
  if (!/^[1-9]\d*$/.test(String(out.pass))) {
    throw new Error(`--pass must be a positive integer (got "${out.pass}") — every pass is recorded, so every pass has a number`);
  }
  return out;
}

/* ----------------------------------------------------- findings validation */

/**
 * Validate the evaluating agent's findings JSON against the rubric and against
 * the artifact hashes of what is actually on disk.
 * @param {any} findings parsed JSON
 * @param {{pageSha:string, strategySha:string, desktopSha:string, mobileSha:string, rubric?: typeof RUBRIC}} bind
 * @returns {string[]} problems (empty = valid)
 */
export function validateFindings(findings, bind) {
  const rubric = bind.rubric ?? RUBRIC;
  const p = [];
  if (findings === null || typeof findings !== "object" || Array.isArray(findings)) return ["findings must be a JSON object"];

  if (typeof findings.auditor !== "string" || !findings.auditor.trim()) {
    p.push(`"auditor" must name who/what evaluated (agent id / model) — an anonymous evaluation is not evidence`);
  }
  if (findings.working_question !== WORKING_QUESTION) {
    p.push(`"working_question" must be exactly "${WORKING_QUESTION}" (D-AKSHAR-ROLE) — the evaluator must acknowledge the frame it judged under`);
  }

  const judged = findings.judged;
  if (judged === null || typeof judged !== "object" || Array.isArray(judged)) {
    p.push(`"judged" must bind the evaluation to the artifacts: {page_sha256, strategy_sha256, screenshot_desktop_sha256, screenshot_mobile_sha256}`);
  } else {
    const want = {
      page_sha256: bind.pageSha,
      strategy_sha256: bind.strategySha,
      screenshot_desktop_sha256: bind.desktopSha,
      screenshot_mobile_sha256: bind.mobileSha,
    };
    for (const [k, expected] of Object.entries(want)) {
      if (judged[k] !== expected) {
        p.push(`"judged.${k}" is ${JSON.stringify(judged[k] ?? null)} but the artifact on disk hashes ${expected} — findings produced against different bytes judge a different page (binding law, scripts/lib/verdict.mjs)`);
      }
    }
  }

  if (!Array.isArray(findings.criteria)) {
    p.push(`"criteria" must be an array answering every rubric criterion`);
    return p;
  }
  const seen = new Map();
  for (const c of findings.criteria) {
    const id = c?.id;
    const at = `criterion ${JSON.stringify(id ?? null)}`;
    if (typeof id !== "string" || !rubric.some((r) => r.id === id)) { p.push(`${at}: unknown id — not in rubric v${RUBRIC_VERSION}`); continue; }
    if (seen.has(id)) { p.push(`${at}: answered twice — one criterion, one verdict`); continue; }
    seen.set(id, c);
    if (c.result !== "PASS" && c.result !== "FAIL") {
      p.push(`${at}: result ${JSON.stringify(c.result ?? null)} is not the strict PASS|FAIL enum — nothing else is a verdict (audit-verdict law); an unverifiable criterion is a FAIL, never an N/A`);
    }
    if (typeof c.finding !== "string" || c.finding.trim().length < 20) {
      p.push(`${at}: "finding" must state what was observed, concretely (>=20 chars) — a verdict with no finding judged nothing`);
    }
    if (typeof c.evidence !== "string" || !c.evidence.trim()) {
      p.push(`${at}: "evidence" must quote/point at the page, strategy or screenshot material the finding rests on`);
    }
  }
  for (const r of rubric) {
    if (!seen.has(r.id)) p.push(`criterion ${r.id} (${r.name}) is unanswered — every criterion is answered or the evaluation is incomplete`);
  }

  if (findings.verdict !== undefined) {
    const computed = [...seen.values()].some((c) => c.result !== "PASS") ? "FAIL" : "PASS";
    if (findings.verdict !== computed) {
      p.push(`declared verdict ${JSON.stringify(findings.verdict)} disagrees with the per-criterion results (computed ${computed}) — an inconsistent evaluation is not evidence`);
    }
  }
  return p;
}

/**
 * Section + overall verdicts from validated findings. Both sections are
 * blocking (the amendment's law): overall PASS only when content AND visual
 * are each all-PASS.
 * @param {any} findings validated findings
 * @param {typeof RUBRIC} [rubric]
 */
export function sectionVerdicts(findings, rubric = RUBRIC) {
  const bySection = { content: "PASS", visual: "PASS" };
  const byId = new Map(findings.criteria.map((c) => [c.id, c]));
  for (const r of rubric) {
    if (byId.get(r.id)?.result !== "PASS") bySection[r.section] = "FAIL";
  }
  return { ...bySection, overall: bySection.content === "PASS" && bySection.visual === "PASS" ? "PASS" : "FAIL" };
}

/* ----------------------------------------------------------- evidence file */

/**
 * Render the evidence markdown for this pass — directives, artifact hashes,
 * per-criterion findings grouped by section, section + overall verdicts, and
 * the ambiguity register. Written on PASS and FAIL alike: the record IS the
 * point; only PASS may ship.
 */
export function renderEvidence({ args, stamp, hashes, findings, verdicts }) {
  const byId = new Map(findings.criteria.map((c) => [c.id, c]));
  const lines = [
    `# GO-SCIENCE CONFORMANCE — ${args.site} — pass ${args.pass}`,
    ``,
    `- directive: ${DIRECTIVES.gate}`,
    `- amendment: ${DIRECTIVES.amendment}`,
    `- context: ${DIRECTIVES.role}`,
    `- when: ${stamp}`,
    `- site: ${args.site} · pass: ${args.pass} · rubric: v${RUBRIC_VERSION} (sha256 ${hashes.rubric})`,
    `- evaluator: ${args.auditor}`,
    `- working question acknowledged: "${findings.working_question}"`,
    `- artifacts judged (hash-bound — findings were validated against these exact bytes):`,
    `  - page: ${args.page} (sha256 ${hashes.page})`,
    `  - strategy: ${args.strategy} (sha256 ${hashes.strategy})`,
    `  - screenshot desktop: ${args.screenshotDesktop} (sha256 ${hashes.desktop})`,
    `  - screenshot mobile: ${args.screenshotMobile} (sha256 ${hashes.mobile})`,
    `- ambiguity register: QUESTIONS.md Q-GO-SCIENCE-RUBRIC — the rubric flags doc ambiguities (${AMBIGUITIES.map((a) => a.id).join(", ")}) rather than guessing.`,
    ``,
    `## VERDICTS (strict PASS|FAIL enum — both sections blocking)`,
    ``,
    `VERDICT content (MCB + MoA): ${verdicts.content}`,
    `VERDICT visual (LOOK / ROI): ${verdicts.visual}`,
    ``,
    verdicts.overall === "PASS"
      ? `OVERALL: PASS — the page conforms to GO science (content AND look); it may proceed to ship candidacy.`
      : `OVERALL: FAIL — the content/look is REBUILT or refixed, never shipped around (D-20260718-20, rule g). Judge the findings, revise, re-run as pass ${Number(args.pass) + 1}.`,
    ``,
  ];
  for (const [section, label] of Object.entries(SECTIONS)) {
    lines.push(`## ${label}`, ``);
    for (const r of RUBRIC.filter((r) => r.section === section)) {
      const f = byId.get(r.id);
      lines.push(
        `### ${r.id} · ${r.name} — ${f.result}`,
        ``,
        `- requirement: ${r.requirement}`,
        ...r.citations.map(({ file, quote }) => `- source: ${file} — "${quote}"`),
        ...(r.directive ? [`- directive basis: ${DIRECTIVES[r.directive]}`] : []),
        ...(r.ambiguity ? [`- flagged ambiguity: ${r.ambiguity} (QUESTIONS.md Q-GO-SCIENCE-RUBRIC)`] : []),
        `- finding: ${f.finding}`,
        `- evidence: ${f.evidence}`,
        ``,
      );
    }
  }
  lines.push(
    `## AMBIGUITY REGISTER (flagged, never guessed)`,
    ``,
    ...AMBIGUITIES.flatMap((a) => [
      `- **${a.id}** (${a.criteria.length ? a.criteria.join(", ") : "scope"}): ${a.cites}`,
      `  - interpretation used: ${a.interpretation}`,
      `  - open question: ${a.question}`,
    ]),
    ``,
  );
  return lines.join("\n");
}

/* ------------------------------------------------------------------- run */

/** Stable hash of the rubric text itself, recorded in evidence. */
export function rubricSha() {
  return sha256(JSON.stringify({ version: RUBRIC_VERSION, rubric: RUBRIC, ambiguities: AMBIGUITIES }));
}

/**
 * One full audit pass: verify the rubric is doc-backed, load + hash the
 * artifacts, validate the findings against rubric and hashes, write the
 * evidence file, return the exit code.
 * @param {string[]} argv raw CLI args
 * @param {{repoRoot?: string, stamp?: string}} [deps]
 */
export function runGoScienceAudit(argv, { repoRoot = REPO_ROOT, stamp = istStamp() } = {}) {
  const drift = verifyRubricCitations({ repoRoot });
  if (drift.length) {
    throw new Error(`rubric/doc drift — the docs are the source of truth and the rubric no longer matches them:\n  - ${drift.join("\n  - ")}`);
  }

  const parsed = parseArgs(argv);
  const abs = (p) => (isAbsolute(p) ? p : resolve(repoRoot, p));

  for (const [flag, p] of [["--page", parsed.page], ["--strategy", parsed.strategy], ["--findings", parsed.findings]]) {
    if (!existsSync(abs(p))) throw new Error(`${flag} ${p}: file does not exist`);
    if (!readFileSync(abs(p), "utf8").trim()) throw new Error(`${flag} ${p}: file is empty — an empty artifact evaluates nothing`);
  }
  // Screenshots: validated as REAL images (extension + magic bytes) — the LOOK
  // section is judged on pixels, never on a text description of them.
  const [desktopImg, mobileImg] = loadImageParts([abs(parsed.screenshotDesktop), abs(parsed.screenshotMobile)]);

  const hashes = {
    rubric: rubricSha(),
    page: sha256(readFileSync(abs(parsed.page))),
    strategy: sha256(readFileSync(abs(parsed.strategy))),
    desktop: sha256(readFileSync(desktopImg.path)),
    mobile: sha256(readFileSync(mobileImg.path)),
  };

  let findings;
  try {
    findings = JSON.parse(readFileSync(abs(parsed.findings), "utf8"));
  } catch (e) {
    throw new Error(`--findings ${parsed.findings}: unparseable JSON (${e.message})`);
  }
  const problems = validateFindings(findings, {
    pageSha: hashes.page, strategySha: hashes.strategy, desktopSha: hashes.desktop, mobileSha: hashes.mobile,
  });
  if (problems.length) {
    throw new Error(`findings failed validation — an unvalidatable evaluation is never a pass:\n  - ${problems.join("\n  - ")}`);
  }

  const verdicts = sectionVerdicts(findings);
  const date = stamp.slice(0, 10);
  const name = Number(parsed.pass) === 1 ? `${date}.md` : `${date}-pass${parsed.pass}.md`;
  const evidencePath = resolve(repoRoot, "launches", parsed.site, "go-science", name);
  if (existsSync(evidencePath)) {
    throw new Error(
      `${relative(repoRoot, evidencePath)} already exists — evidence is append-only (a rerun that could overwrite a recorded FAIL is a forgery surface). ` +
      `A new attempt is a new pass: re-run with --pass ${Number(parsed.pass) + 1}.`,
    );
  }

  const evidenceArgs = {
    ...parsed,
    page: relative(repoRoot, abs(parsed.page)),
    strategy: relative(repoRoot, abs(parsed.strategy)),
    screenshotDesktop: relative(repoRoot, abs(parsed.screenshotDesktop)),
    screenshotMobile: relative(repoRoot, abs(parsed.screenshotMobile)),
  };
  const markdown = renderEvidence({ args: evidenceArgs, stamp, hashes, findings, verdicts });
  mkdirSync(dirname(evidencePath), { recursive: true });
  writeFileSync(evidencePath, markdown + "\n");

  return { args: parsed, findings, verdicts, hashes, evidencePath, markdown, exitCode: verdicts.overall === "PASS" ? 0 : 2 };
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--rubric")) {
    const drift = verifyRubricCitations({});
    if (drift.length) {
      console.error(`go-science-audit: rubric/doc drift:\n  - ${drift.join("\n  - ")}`);
      process.exit(1);
    }
    console.log(JSON.stringify({
      rubric_version: RUBRIC_VERSION,
      rubric_sha256: rubricSha(),
      working_question: WORKING_QUESTION,
      directives: DIRECTIVES,
      sections: SECTIONS,
      criteria: RUBRIC,
      ambiguities: AMBIGUITIES,
      findings_contract: {
        auditor: "who/what evaluated (agent id / model)",
        working_question: WORKING_QUESTION,
        judged: { page_sha256: "…", strategy_sha256: "…", screenshot_desktop_sha256: "…", screenshot_mobile_sha256: "…" },
        criteria: [{ id: "GS-…", result: "PASS|FAIL", finding: "what was observed", evidence: "quote/pointer" }],
        verdict: "PASS|FAIL (optional; must agree with criteria)",
      },
    }, null, 2));
    process.exit(0);
  }

  const { verdicts, evidencePath, exitCode } = runGoScienceAudit(argv);
  console.log(`\n=== GO-SCIENCE CONFORMANCE ("${WORKING_QUESTION}") ===`);
  console.log(`VERDICT content (MCB + MoA): ${verdicts.content}`);
  console.log(`VERDICT visual (LOOK / ROI): ${verdicts.visual}`);
  console.log(`evidence: ${relative(REPO_ROOT, evidencePath)}`);
  console.log(
    exitCode === 0
      ? `RESULT: PASS — the page conforms to GO science (content AND look).`
      : `RESULT: FAIL — the content/look is REBUILT or refixed, never shipped around (D-20260718-20, rule g).`,
  );
  process.exit(exitCode);
}

// NOTE: comparing import.meta.url to process.argv[1] as raw STRINGS silently
// broke on any checkout path containing a space — import.meta.url percent-encodes
// it, argv[1] does not — so main() never ran and the script exited 0 having
// checked NOTHING. Normalising argv[1] through URL() fixes it with no new import.
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  try { main(); }
  catch (e) { console.error(`go-science-audit failed: ${e.message}`); process.exit(1); }
}
