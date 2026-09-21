#!/usr/bin/env node
/**
 * beauty-audit.mjs — the BEAUTY-CONFORMANCE gate (D-20260718-21 + D-20260718-22).
 *
 * THE LAW (Abilash, 18 Jul 2026 — docs/design/BEAUTY_DOCTRINE.md, built from
 * the owner's own paper docs/design/what-is-beauty-owner-paper-2026-07-18.md
 * (PRIMARY source, verbatim) + the critique layer
 * docs/design/beauty-doctrine-inputs-2026-07-18.md; the paper wins conflicts):
 * beauty is not the goal — DESIRED PERCEPTION is. A page is judged against the
 * doctrine's rubric FOR ITS ENTITY (corporate / Healing Village / Villa Raag /
 * KAPPL D2C / KAPPL B2B / blog — each with its exact communicate-list, its
 * must-answer list and its avoid list) AND ITS PAGE TYPE (LP converts, blog
 * educates, homepage positions, About trusts, PDP reduces anxiety, category
 * navigates the catalogue, checkout completes calmly, partner qualifies).
 * The verdict walks the paper's Five-Layer Approval Test (§36): strategic ·
 * visual · informational · functional · commercial — "A page is not complete
 * if it passes only the visual layer."
 *
 * WHAT THE JUDGE SEES (never a text description of a design — same image law
 * as D-20260718-12): rendered DESKTOP AND MOBILE screenshots (base64 via
 * scripts/lib/image-input.mjs), the raw PAGE SOURCE, and the page's STRATEGY
 * artifact (the stated job it is judged against), plus the doctrine itself.
 *
 * GATE-DUPLICATION LAW (doctrine §G): criteria other gates already own are
 * REFERENCED, never re-run — performance numbers come from the EXISTING
 * Lighthouse evidence (--perf-evidence; never re-measured), design-quality/
 * truth from the design-external-ai-review Gate 1/2 evidence and B-14
 * scorecard (--gate-evidence). This gate owns what nothing else checks:
 * entity-perception fit, restraint, timelessness, fleet consistency,
 * authenticity, price-perception ceiling, emotional arc, trust-before-beauty
 * staging, copy deliberateness.
 *
 * ADVISORY LANE (D-EXTREVIEW-OWNER-FACTS, Abilash 2026-07-18 18:55:33 IST):
 * owner-confirmed facts are AUTHORITY — reviewer doubt about a fact in the
 * supplied --facts sheet is ADVISORY, never a blocking FAIL. Advisory items
 * land in the recommendations lane of the evidence file; the owner's
 * signature remains the deciding judgment.
 *
 * EVIDENCE (append-only, launch-evidence law):
 *   launches/<site>/beauty/<YYYY-MM-DD>.md          (pass 1)
 *   launches/<site>/beauty/<YYYY-MM-DD>-pass<N>.md  (pass N >= 2)
 * An existing evidence file is never overwritten — a rerun is the next pass.
 *
 * EXIT CODES (house law, shared with design-review.mjs): 0 = strict PASS ·
 * 2 = strict FAIL · 1 = harness error or no strict verdict (an absent verdict
 * is never a pass — HARD GATE 6 / rule g).
 *
 * Usage:
 *   node scripts/beauty-audit.mjs \
 *     --site whatisayurveda.com --page-type homepage [--entity blog] \
 *     --desktop launches/<site>/screens/.../home--1440x900.png \
 *     --mobile  launches/<site>/screens/.../home--390x844.png \
 *     --source sites/<site>/app/page.tsx \
 *     --strategy docs/<site>-research/BUILD_PLAN.md \
 *     --purpose "why this page exists, in one honest line" \
 *     --audience "who must be convinced, concretely" \
 *     [--facts <owner-facts file>]... [--perf-evidence <lighthouse evidence>] \
 *     [--gate-evidence <design-review/B-14/go-science evidence>]... \
 *     [--pass N] [--model gpt-5]
 *
 * The judge is scripts/audit-gpt.mjs (the is-it-actually-good lane of the
 * 15 Jul two-auditor ruling); the truth lane (Perplexity) already ran at
 * Gate 1/2 and is referenced, not repeated. Keys stay in ~/.secrets/ —
 * this script never sees or prints them.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadImageParts, describeImages } from "./lib/image-input.mjs";
import { istStamp, sha256 } from "./lib/verdict.mjs";
import { deriveVerdict, decideExit } from "./design-review.mjs";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const DOCTRINE = "docs/design/BEAUTY_DOCTRINE.md";
export const DIRECTIVE = "D-20260718-21";
export const JUDGE = Object.freeze({
  name: "audit-gpt",
  script: "scripts/audit-gpt.mjs",
  role: "beauty-conformance judge (reasoning lane; truth lane referenced from Gate 1/2)",
  defaultModel: "gpt-5",
});
export const PILLARS = Object.freeze(["science", "business", "philosophy", "kairali-standard"]);
export const LANES = Object.freeze(["owned", "referenced"]);

/* -------------------------------------------------------------- the rubric */

/**
 * Extract and validate the machine-readable rubric from BEAUTY_DOCTRINE.md
 * (§R — the single source of truth; editing it IS editing this gate).
 * Throws on anything missing or malformed: an unparseable rubric is a gate
 * failure, never a skip (gate-registry-lint stance).
 * @param {string} doctrineText full markdown of BEAUTY_DOCTRINE.md
 */
export function parseRubric(doctrineText) {
  const m = doctrineText.match(/^## §R[^\n]*\n[\s\S]*?```json\n([\s\S]*?)\n```/m);
  if (!m) throw new Error(`${DOCTRINE}: no machine-readable rubric found — expected a \`\`\`json fence under the "## §R" heading`);
  let rubric;
  try { rubric = JSON.parse(m[1]); }
  catch (e) { throw new Error(`${DOCTRINE} §R rubric is not valid JSON: ${e.message}`); }

  const errs = [];
  const entities = rubric.entities ?? {};
  if (Object.keys(entities).length === 0) errs.push("rubric.entities is empty — the gate judges per entity, always");
  for (const [key, e] of Object.entries(entities)) {
    if (!Array.isArray(e.domains) || e.domains.length === 0) errs.push(`entity "${key}": domains[] missing/empty`);
    if (!Array.isArray(e.communicates) || e.communicates.length === 0) errs.push(`entity "${key}": communicates[] missing/empty — an entity without a communicate-list cannot be judged (inputs §2)`);
    // Paper-derived per-type frameworks (D-20260718-22) are optional per entity, but if present they must be usable lists.
    for (const field of ["must_answer", "avoid"]) {
      if (field in e && (!Array.isArray(e[field]) || e[field].length === 0)) errs.push(`entity "${key}": ${field} must be a non-empty array when present (paper Parts IV–VIII frameworks)`);
    }
  }
  const seenDomains = new Map();
  for (const [key, e] of Object.entries(entities)) {
    for (const d of e.domains ?? []) {
      if (seenDomains.has(d)) errs.push(`domain "${d}" mapped to both "${seenDomains.get(d)}" and "${key}" — one page, one entity`);
      seenDomains.set(d, key);
    }
  }
  const pageTypes = rubric.page_types ?? {};
  if (Object.keys(pageTypes).length === 0) errs.push("rubric.page_types is empty — ROI changes what beauty means (inputs §3)");
  for (const [key, p] of Object.entries(pageTypes)) {
    if (!p.job) errs.push(`page_type "${key}": job missing — a page with no stated job cannot be judged beautiful`);
    if (!p.roi_focus) errs.push(`page_type "${key}": roi_focus missing`);
  }
  const criteria = rubric.criteria ?? [];
  if (!Array.isArray(criteria) || criteria.length === 0) errs.push("rubric.criteria is empty — a gate with no criteria checks nothing");
  const seenIds = new Set();
  for (const c of criteria) {
    const id = c.id ?? "(no id)";
    if (!c.id) errs.push("criterion without an id");
    else if (seenIds.has(c.id)) errs.push(`duplicate criterion id "${c.id}"`);
    seenIds.add(c.id);
    if (!PILLARS.includes(c.pillar)) errs.push(`criterion ${id}: pillar "${c.pillar}" not in [${PILLARS.join(", ")}] — findings land per pillar`);
    if (!LANES.includes(c.lane)) errs.push(`criterion ${id}: lane "${c.lane}" not in [${LANES.join(", ")}]`);
    if (!c.question) errs.push(`criterion ${id}: question missing`);
    if (c.lane === "referenced" && !c.evidence) errs.push(`criterion ${id}: lane "referenced" requires an evidence pointer — a reference to nothing re-runs nothing`);
  }
  if (errs.length) throw new Error(`${DOCTRINE} §R rubric invalid:\n  - ${errs.join("\n  - ")}`);
  return rubric;
}

/**
 * Resolve which entity chapter judges this site. An explicit --entity wins
 * (it must exist in the rubric); otherwise the domain map decides; an
 * unmapped domain is REFUSED, never guessed (doctrine Pillar 4: every future
 * property declares its entity before its beauty gate can run).
 * @param {{entities: Record<string, any>}} rubric
 * @param {string} site
 * @param {string} [explicit]
 * @returns {string} entity key
 */
export function selectEntity(rubric, site, explicit = "") {
  const keys = Object.keys(rubric.entities);
  if (explicit) {
    if (!rubric.entities[explicit]) throw new Error(`--entity "${explicit}" is not in the doctrine rubric — valid entities: ${keys.join(", ")} (add a chapter by amendment PR before gating a new entity)`);
    return explicit;
  }
  for (const [key, e] of Object.entries(rubric.entities)) {
    if (e.domains.includes(site)) return key;
  }
  throw new Error(
    `site "${site}" is not mapped to any entity in the doctrine rubric and no --entity was given — ` +
    `the gate refuses to guess (doctrine Pillar 4). Declare --entity <${keys.join("|")}> for the closest chapter, ` +
    `or add the domain to §R by amendment PR.`,
  );
}

/* ----------------------------------------------------------- arg parsing */

/**
 * Parse CLI args. Throws on anything missing/malformed BEFORE any API call —
 * a run that could not be recorded never burns tokens.
 * @param {string[]} argv
 */
export function parseBeautyArgs(argv) {
  const out = {
    site: "", entity: "", pageType: "", desktop: "", mobile: "",
    source: "", strategy: "", purpose: "", audience: "",
    facts: [], gateEvidence: [], perfEvidence: "", pass: "1", model: "",
  };
  const map = { "page-type": "pageType", "gate-evidence": "gateEvidence", "perf-evidence": "perfEvidence" };
  const multi = new Set(["facts", "gateEvidence"]);
  let key = null;
  for (const a of argv) {
    if (a.startsWith("--")) { key = map[a.slice(2)] ?? a.slice(2); continue; }
    if (multi.has(key)) out[key].push(a);
    else if (key) { out[key] = a; key = null; }
  }
  const missing = [];
  if (!out.site) missing.push("--site");
  if (!out.pageType) missing.push("--page-type");
  if (!out.desktop) missing.push("--desktop");
  if (!out.mobile) missing.push("--mobile");
  if (!out.source) missing.push("--source");
  if (!out.strategy) missing.push("--strategy");
  if (!out.purpose) missing.push("--purpose");
  if (!out.audience) missing.push("--audience");
  if (missing.length) {
    throw new Error(
      `missing required: ${missing.join(", ")} — the judge must SEE the rendered page desktop AND mobile, ` +
      `read its source, and know its stated job (strategy artifact) and who it is for; ` +
      `a page is only beautiful FOR someone FOR a reason (doctrine, inputs §1/§3)`,
    );
  }
  if (!/^[1-9]\d*$/.test(String(out.pass))) throw new Error(`--pass must be a positive integer (got "${out.pass}") — every pass is recorded, so every pass has a number`);
  return out;
}

/* ------------------------------------------------------------- the ask */

/**
 * Compose the judge's ask from the rubric, entity and page type. Pure —
 * tests assert the entity list, page job, criteria ids and the advisory-lane
 * instruction all land in the prompt.
 */
export function buildAsk(rubric, entityKey, pageTypeKey, args) {
  const entity = rubric.entities[entityKey];
  const pt = rubric.page_types[pageTypeKey];
  const owned = rubric.criteria.filter((c) => c.lane === "owned");
  const referenced = rubric.criteria.filter((c) => c.lane === "referenced");
  const lines = [
    `This is the BEAUTY-CONFORMANCE gate (${DIRECTIVE}) for ${args.site}. Judge the attached rendered page — desktop AND mobile screenshots — with its raw source and strategy artifact in context, against the BEAUTY_DOCTRINE rubric FOR ITS ENTITY AND PAGE TYPE. Beauty is not the goal; desired perception is (doctrine, inputs §1).`,
    ``,
    `ENTITY: ${entity.label} (${entityKey}). Its beauty must communicate, exactly: ${entity.communicates.join(" · ")}.`,
    ...(entity.register_note ? [`Register note (binding): ${entity.register_note}`] : []),
    ...(entity.must_answer?.length
      ? [``, `MUST-ANSWER LIST (paper Parts IV–VIII — the entity's informational-completeness bar, judged under B18): every item below must be answered visibly on the page or consciously deferred to a named sibling page. Premium design never forces visitors to guess; mystery must not become vagueness.`,
         ...entity.must_answer.map((q) => `  - ${q}`)]
      : []),
    ...(entity.avoid?.length
      ? [``, `AVOID LIST (paper — named failure modes for this entity; each sighting is a finding):`,
         ...entity.avoid.map((a) => `  - ${a}`)]
      : []),
    ``,
    `PAGE TYPE: ${pageTypeKey} — this page's job is: it ${pt.job}. ${pt.roi_focus} Judge beauty AS the doing of that job, never in the abstract.`,
    ``,
    `ADDRESS EVERY CRITERION BELOW BY ID, none skipped. Prefix every finding with its criterion id. Group your reasoning by pillar (${PILLARS.join(" / ")}).`,
    ``,
    `OWNED criteria — judge these directly from the screenshots, source and strategy artifact:`,
    ...owned.map((c) => `  ${c.id} [${c.pillar}] ${c.question}`),
    ``,
    `REFERENCED criteria — other gates own these; READ the supplied evidence in context and cite it. NEVER re-run, re-measure or re-derive them yourself. If the evidence is absent from context, record "<id>: needs evidence" as a finding — that is never a silent pass and never a reason to measure it yourself:`,
    ...referenced.map((c) => `  ${c.id} [${c.pillar}] ${c.question} (evidence source: ${c.evidence})`),
    ``,
    `ADVISORY LANE (binding policy D-EXTREVIEW-OWNER-FACTS): owner-confirmed facts in the supplied facts sheet(s) are AUTHORITY. If your only concern with an element is doubt about such a fact, record it in recommendations prefixed "ADVISORY:" — it is never a blocking finding and never grounds for FAIL. The owner's signature remains the deciding judgment.`,
    ``,
    `RESTRAINT PROBE (B4, mandatory): name concretely what could be removed from this page without losing any item on the entity's communicate-list. "Nothing" must be argued, not asserted.`,
    ``,
    `FIVE-LAYER APPROVAL TEST (paper §36, mandatory frame for your verdict): before the verdict, assess each layer explicitly — Layer 1 STRATEGIC (correct brand and audience position), Layer 2 VISUAL (typography, imagery, composition, colour, motion, detail), Layer 3 INFORMATIONAL (clear, ordered, understandable, complete — the must-answer list), Layer 4 FUNCTIONAL (fast, responsive, accessible — from the referenced evidence, never re-measured), Layer 5 COMMERCIAL (supports the intended action and measurable outcome). "A page is not complete if it passes only the visual layer."`,
    ``,
    `VERDICT LAW: FAIL if any OWNED criterion has a blocking failure for this entity and page type, or if any of the five layers fails on OWNED evidence. Referenced-evidence gaps and advisory items never force a FAIL on their own. PASS only if this page, as seen, genuinely creates the entity's desired perception while doing its page-type job — across all five layers, not the visual layer alone.`,
  ];
  return lines.join("\n");
}

/**
 * The argv tail for the judge run (scripts/audit-gpt.mjs contract). Pure.
 * Context order: doctrine first (the law), then strategy (the stated job),
 * then facts (owner authority), then referenced-gate evidence.
 */
export function judgeArgv(rubric, entityKey, args) {
  const contexts = [
    args.doctrinePath,
    args.strategy,
    ...args.facts,
    ...(args.perfEvidence ? [args.perfEvidence] : []),
    ...args.gateEvidence,
  ];
  return [
    "--purpose", args.purpose,
    "--audience", args.audience,
    "--step", `BEAUTY-CONFORMANCE gate — ${DIRECTIVE} (entity: ${entityKey} · page type: ${args.pageType})`,
    "--pass", String(args.pass),
    "--image", args.desktop,
    "--image", args.mobile,
    ...contexts.flatMap((c) => ["--context", c]),
    "--artifact", args.source,
    "--ask", buildAsk(rubric, entityKey, args.pageType, args),
    "--model", args.model || JUDGE.defaultModel,
    "--raw",
  ];
}

/* --------------------------------------------------- findings per pillar */

/**
 * Group the judge's findings per pillar by their criterion-id prefixes
 * (the ask mandates "prefix every finding with its criterion id").
 * Blocking issues and recommendations are grouped separately — the advisory
 * lane never mixes into the blocking lane. Unprefixed findings land under
 * "unattributed" (visible, never dropped).
 * @param {{blocking_issues?: string[], recommendations?: string[]}} raw judge critique JSON
 * @param {{criteria: Array<{id:string,pillar:string}>}} rubric
 */
export function groupFindingsByPillar(raw, rubric) {
  const pillarOf = new Map(rubric.criteria.map((c) => [c.id, c.pillar]));
  const group = (items) => {
    const out = { unattributed: [] };
    for (const p of PILLARS) out[p] = [];
    for (const item of items ?? []) {
      const m = String(item).match(/^(?:ADVISORY:\s*)?([A-Z]+\d+)\b/);
      const pillar = m ? pillarOf.get(m[1]) : undefined;
      (pillar ? out[pillar] : out.unattributed).push(String(item));
    }
    return out;
  };
  return { blocking: group(raw?.blocking_issues), advisory: group(raw?.recommendations) };
}

/* ----------------------------------------------------------- evidence file */

/** Evidence filename: <date>.md for pass 1, <date>-pass<N>.md after. */
export function evidenceFilename(date, pass) {
  return Number(pass) === 1 ? `${date}.md` : `${date}-pass${pass}.md`;
}

/**
 * Render the evidence markdown — metadata + hashes, the criteria judged,
 * findings per pillar (blocking vs advisory lanes), verdict, raw critique.
 * Written even on FAIL/error: every pass is history; only PASS proceeds.
 */
export function renderEvidence({ args, entityKey, rubric, stamp, images, result, exitCode }) {
  const entity = rubric.entities[entityKey];
  const overall =
    exitCode === 0 ? `OVERALL: PASS — the page creates the entity's desired perception while doing its page-type job; beauty-conformance holds.`
    : exitCode === 2 ? `OVERALL: FAIL — the page does not conform to the BEAUTY_DOCTRINE for this entity and page type. Judge the critique, revise, re-run as pass ${Number(args.pass) + 1}.`
    : `OVERALL: ERROR — the judge produced no strict verdict; an absent verdict is never a pass (HARD GATE 6 / rule g). Fix the cause and re-run this pass.`;

  const grouped = result.raw ? groupFindingsByPillar(result.raw, rubric) : null;
  const pillarSection = (title, byPillar) => {
    const lines = [`### ${title}`, ``];
    for (const p of [...PILLARS, "unattributed"]) {
      const items = byPillar[p];
      if (!items || items.length === 0) continue;
      lines.push(`**${p}**`, ...items.map((i) => `- ${i}`), ``);
    }
    if (lines.length === 2) lines.push(`(none)`, ``);
    return lines;
  };

  const lines = [
    `# BEAUTY-CONFORMANCE — ${args.site} — entity ${entityKey} — page type ${args.pageType} — pass ${args.pass}`,
    ``,
    `- directive: ${DIRECTIVE} + D-20260718-22 (Abilash, 18 Jul 2026) · doctrine: ${DOCTRINE} · inputs (immutable): docs/design/what-is-beauty-owner-paper-2026-07-18.md (PRIMARY) + docs/design/beauty-doctrine-inputs-2026-07-18.md`,
    `- when: ${stamp}`,
    `- entity: ${entity.label} — must communicate: ${entity.communicates.join(" · ")}`,
    `- page type: ${args.pageType} — job: ${rubric.page_types[args.pageType].job}`,
    `- purpose: ${args.purpose}`,
    `- audience: ${args.audience}`,
    `- judge: ${JUDGE.name} (${JUDGE.role}) · model: ${args.model || JUDGE.defaultModel}`,
    `- screenshots (the judge SAW these — base64 content parts, never descriptions):`,
    ...images.map((im) => `  - ${im.path} (${im.mime}, ${im.bytes} bytes, sha256 ${im.sha256})`),
    `- page source: ${args.source} (sha256 ${args.sourceSha})`,
    `- strategy artifact: ${args.strategy}`,
    ...(args.facts.length ? [`- owner-facts sheets (ADVISORY authority, D-EXTREVIEW-OWNER-FACTS): ${args.facts.join(", ")}`] : []),
    `- performance evidence (§14 — read, NEVER re-measured): ${args.perfEvidence || "(none supplied — R1 recorded as needs-evidence, not re-run)"}`,
    ...(args.gateEvidence.length ? [`- referenced gate evidence: ${args.gateEvidence.join(", ")}`] : []),
    ``,
    `## VERDICT (strict PASS|FAIL enum — scripts/lib/audit-verdict.mjs law; nothing else is a verdict)`,
    ``,
    `VERDICT ${JUDGE.name}: ${result.verdict ?? `NONE (${result.reason})`}`,
    ``,
    overall,
    ``,
    `## CRITERIA JUDGED (doctrine §R — owned = this gate; referenced = read other gates' evidence, never re-run)`,
    ``,
    ...rubric.criteria.map((c) => `- ${c.id} · ${c.pillar} · ${c.lane}${c.lane === "referenced" ? ` (evidence: ${c.evidence})` : ""}`),
    ``,
    `## FINDINGS PER PILLAR`,
    ``,
    ...(grouped
      ? [
          ...pillarSection("Blocking lane", grouped.blocking),
          ...pillarSection("Advisory lane (never blocking — D-EXTREVIEW-OWNER-FACTS; includes owner-fact doubts and referenced-evidence gaps)", grouped.advisory),
        ]
      : [`(no critique JSON — see raw section)`, ``]),
    `## ${JUDGE.name} — raw critique`,
    ``,
  ];
  if (result.raw) {
    lines.push("```json", JSON.stringify(result.raw, null, 2), "```", ``);
  } else {
    lines.push(
      `NO CRITIQUE — the judge run produced no parseable output (${result.reason}).`,
      `stderr (truncated; the auditors never print secrets):`,
      "```",
      (result.run.stderr || "(empty)").slice(0, 4000),
      "```",
      ``,
    );
  }
  if (result.verdict === null && result.raw) lines.push(`NOTE: critique recorded but verdict refused — ${result.reason}`, ``);
  return lines.join("\n");
}

/* ------------------------------------------------------------------- run */

/** Run the judge as a child process from the repo root. Injectable in tests — never call live APIs in tests. */
export function defaultRunJudge(argv, { repoRoot = REPO_ROOT } = {}) {
  const r = spawnSync(process.execPath, [join(repoRoot, JUDGE.script), ...argv], {
    cwd: repoRoot, encoding: "utf8", maxBuffer: 256 * 1024 * 1024,
  });
  return {
    status: r.status === null ? 1 : r.status,
    stdout: r.stdout ?? "",
    stderr: r.stderr ?? "",
    error: r.error ? String(r.error.message ?? r.error) : null,
  };
}

/**
 * One full beauty-audit pass: validate everything, run the judge with both
 * screenshots, write the append-only evidence file, return the exit code.
 * @param {string[]} argv raw CLI args
 * @param {{runJudge?: typeof defaultRunJudge, repoRoot?: string, stamp?: string}} deps
 */
export function runBeautyAudit(argv, { runJudge = defaultRunJudge, repoRoot = REPO_ROOT, stamp = istStamp() } = {}) {
  const parsed = parseBeautyArgs(argv);
  const abs = (p) => (isAbsolute(p) ? p : resolve(repoRoot, p));

  const doctrinePath = join(repoRoot, DOCTRINE);
  if (!existsSync(doctrinePath)) throw new Error(`${DOCTRINE} not found — the gate has no law to enforce without the doctrine`);
  const rubric = parseRubric(readFileSync(doctrinePath, "utf8"));

  if (!rubric.page_types[parsed.pageType]) {
    throw new Error(`--page-type "${parsed.pageType}" is not in the doctrine rubric — valid: ${Object.keys(rubric.page_types).join(", ")} (doctrine §3: ROI changes what beauty means)`);
  }
  const entityKey = selectEntity(rubric, parsed.site, parsed.entity);

  const args = {
    ...parsed,
    desktop: abs(parsed.desktop),
    mobile: abs(parsed.mobile),
    sourceAbs: abs(parsed.source),
    strategy: abs(parsed.strategy),
    facts: parsed.facts.map(abs),
    gateEvidence: parsed.gateEvidence.map(abs),
    perfEvidence: parsed.perfEvidence ? abs(parsed.perfEvidence) : "",
    doctrinePath,
  };

  // Fail-early validation, all BEFORE any API call.
  const imageParts = loadImageParts([args.desktop, args.mobile]); // throws on missing/empty/mislabelled
  const images = imageParts.map((im) => ({ path: relative(repoRoot, im.path), mime: im.mime, bytes: im.bytes, sha256: sha256(readFileSync(im.path)) }));
  for (const [flag, p] of [["--source", args.sourceAbs], ["--strategy", args.strategy], ...args.facts.map((f) => ["--facts", f]), ...args.gateEvidence.map((g) => ["--gate-evidence", g]), ...(args.perfEvidence ? [["--perf-evidence", args.perfEvidence]] : [])]) {
    if (!existsSync(p)) throw new Error(`${flag} ${relative(repoRoot, p)}: file does not exist`);
  }

  const date = stamp.slice(0, 10);
  const evidencePath = resolve(repoRoot, "launches", args.site, "beauty", evidenceFilename(date, args.pass));
  if (existsSync(evidencePath)) {
    throw new Error(
      `${relative(repoRoot, evidencePath)} already exists — evidence is append-only (a rerun that could overwrite a recorded FAIL is a forgery surface). ` +
      `A new attempt is a new pass: re-run with --pass ${Number(args.pass) + 1}.`,
    );
  }

  const jv = judgeArgv(rubric, entityKey, { ...args, source: args.sourceAbs });
  console.error(`── running ${JUDGE.name} (${JUDGE.role}) · entity ${entityKey} · page type ${args.pageType} · pass ${args.pass} · images: ${describeImages(imageParts)}`);
  const run = runJudge(jv, { repoRoot });
  const { verdict, raw, reason } = deriveVerdict(run);
  console.error(`── ${JUDGE.name}: ${verdict ?? `NO VERDICT (${reason})`}`);
  const result = { name: JUDGE.name, role: JUDGE.role, argv: jv, run, verdict, raw, reason };

  const exitCode = decideExit([result]);
  const evidenceArgs = {
    ...args,
    source: relative(repoRoot, args.sourceAbs),
    sourceSha: sha256(readFileSync(args.sourceAbs)),
    strategy: relative(repoRoot, args.strategy),
    facts: args.facts.map((f) => relative(repoRoot, f)),
    gateEvidence: args.gateEvidence.map((g) => relative(repoRoot, g)),
    perfEvidence: args.perfEvidence ? relative(repoRoot, args.perfEvidence) : "",
  };
  const markdown = renderEvidence({ args: evidenceArgs, entityKey, rubric, stamp, images, result, exitCode });
  mkdirSync(dirname(evidencePath), { recursive: true });
  writeFileSync(evidencePath, markdown + "\n");

  return { args, entityKey, rubric, result, exitCode, evidencePath, markdown };
}

function main() {
  const { result, entityKey, exitCode, evidencePath, args } = runBeautyAudit(process.argv.slice(2));
  console.log(`\n=== BEAUTY-CONFORMANCE GATE (${DIRECTIVE}) ===`);
  console.log(`site ${args.site} · entity ${entityKey} · page type ${args.pageType} · pass ${args.pass}`);
  console.log(`VERDICT ${JUDGE.name}: ${result.verdict ?? `NONE (${result.reason})`}`);
  console.log(`evidence: ${relative(REPO_ROOT, evidencePath)}`);
  console.log(
    exitCode === 0 ? `RESULT: PASS — beauty-conformance holds for this entity and page type.`
    : exitCode === 2 ? `RESULT: FAIL — the page does not conform to the doctrine; judge the critique, revise, re-run with the next --pass.`
    : `RESULT: ERROR — no strict verdict; an absent verdict is never a pass.`,
  );
  process.exit(exitCode);
}

// NOTE: comparing import.meta.url to process.argv[1] as raw STRINGS silently
// broke on any checkout path containing a space — import.meta.url percent-encodes
// it, argv[1] does not — so main() never ran and the script exited 0 having
// checked NOTHING. Normalising argv[1] through URL() fixes it with no new import.
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  try { main(); }
  catch (e) { console.error(`beauty-audit failed: ${e.message}`); process.exit(1); }
}
