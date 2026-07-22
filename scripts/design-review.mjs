#!/usr/bin/env node
/**
 * design-review.mjs — DESIGN EXTERNAL-AI REVIEW, both checkpoints.
 *
 * THE LAW (owner directives, 18 Jul 2026 — "very important, without fail"):
 *   Gate 1 · --stage pre  (D-20260718-12): BEFORE content starts on ANY
 *   site/LP, the proposed design is reviewed by ChatGPT AND Perplexity — and
 *   they must SEE the reference/mockup IMAGE, not a text description. Only on
 *   their positive verdict does the design proceed to content/build. This gap
 *   is the main reason all 8 sites got redesigned.
 *
 *   Gate 2 · --stage post (D-20260718-15): when a site/LP build is believed
 *   FINISHED, both auditors vet it EACH ELEMENT against a per-element
 *   checklist (seeded from our generated site checklist; the GPT auditor may
 *   extend it), reviewing SCREENSHOTS of the built pages (golden page + key
 *   templates, desktop AND mobile). Their returned checklist + verdicts are
 *   SAVED in the repo; the caller iterates passes until the desired result.
 *
 * DIVISION OF LABOUR (15 Jul two-auditor ruling — never interchangeable):
 *   audit-gpt.mjs        -> is the design ACTUALLY GOOD for the audience
 *   audit-perplexity.mjs -> is what the design shows/claims TRUE, live-checked
 *
 * WHAT THIS SCRIPT IS AND IS NOT: it runs ONE pass — both auditors, with the
 * image(s) — and records that pass as evidence. The critique → judge → revise
 * loop (2–3+ passes per the standing ruling) is the CALLER's job; each re-run
 * with --pass N+1 appends a new evidence file. Evidence files are append-only:
 * an existing <date>-pass<N>.md is never overwritten (a rerun that could
 * overwrite a FAIL would be a forgery surface).
 *
 * EVIDENCE (committed, per launch-evidence law):
 *   pre  -> launches/<site>/design-review/<YYYY-MM-DD>-pass<N>.md
 *   post -> launches/<site>/design-review/post-build/<YYYY-MM-DD>-pass<N>.md
 * Each file: run metadata + image hashes, the submitted checklist (post), both
 * auditors' RAW critiques, and one strict verdict line per auditor drawn from
 * the schema-strict PASS|FAIL enum (the audit-verdict.mjs law: nothing but the
 * enum is a verdict). A design may not proceed to content/build without a
 * PASSING evidence file here.
 *
 * ADVISORY LANE (D-EXTREVIEW-OWNER-FACTS, Abilash 18 Jul 2026 — ratified):
 * OWNER-CONFIRMED FACTS ARE AUTHORITY in these reviews. `--facts <sheet>`
 * attaches the canonical owner facts sheet (relevant DECISIONS rulings +
 * @kairali/facts; the kairalicenters context-rulings file is the template) as
 * context to BOTH auditors, and arms a RECLASSIFICATION step after the
 * verdicts: when an auditor's strict verdict is FAIL and EVERY one of its
 * blocking findings maps to a fact declared in the sheet, the verdict is
 * recorded as "FAIL(raw) → ADVISORY per D-EXTREVIEW-OWNER-FACTS" and treated
 * as non-blocking. The mapping is made by the SAME auditor model against its
 * own findings and validated mechanically (scripts/audit-reclassify.mjs +
 * scripts/lib/facts-reclassify.mjs) — machine-checked, never self-asserted by
 * us. Any finding the sheet does not cover keeps the FAIL blocking; any
 * reclassifier failure leaves the raw FAIL blocking. Raw critiques and raw
 * verdicts are ALWAYS preserved verbatim — reclassification is an annotation
 * layer, never an edit; the strict enum law (audit-verdict.mjs) is untouched.
 *
 * EXIT CODES: 0 = no blocking verdict remains (both PASS, or a FAIL(raw)
 * reclassified ADVISORY per D-EXTREVIEW-OWNER-FACTS) · 2 = at least one
 * blocking FAIL · 1 = harness error or an auditor produced no strict verdict
 * (an absent verdict is never a pass — HARD GATE 6 / rule g).
 *
 * Usage:
 *   node scripts/design-review.mjs \
 *     --site whyayurveda.org \
 *     --image launches/whyayurveda.org/design-intake/hero-mockup.png \
 *     --purpose  "why the site exists, in one honest line" \
 *     --audience "who must be convinced, concretely" \
 *     [--stage pre|post] [--pass N] [--context file]... \
 *     [--facts launches/<site>/design-review/context-rulings.md] \
 *     [--checklist launches/<site>/post-build-checklist.md]   (post: required)
 *     [--gpt-model gpt-5] [--perplexity-model sonar-pro]
 *
 * Paths are repo-relative (or absolute). Keys stay in ~/.secrets/, loaded by
 * the auditors at runtime — this script never sees or prints them.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadImageParts, describeImages } from "./lib/image-input.mjs";
import { istStamp, sha256 } from "./lib/verdict.mjs";
import { extractBlockingFindings, parseReclassifierOutput } from "./lib/facts-reclassify.mjs";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** The two external auditors of the 15 Jul ruling — both run, always. */
export const AUDITORS = Object.freeze([
  Object.freeze({ name: "audit-gpt", script: "scripts/audit-gpt.mjs", role: "reasoning / is-the-design-actually-good (ChatGPT)", modelFlag: "gptModel", defaultModel: "gpt-5" }),
  Object.freeze({ name: "audit-perplexity", script: "scripts/audit-perplexity.mjs", role: "truth / live verification (Perplexity)", modelFlag: "perplexityModel", defaultModel: "sonar-pro" }),
]);

export const STAGES = Object.freeze({
  pre: Object.freeze({
    directive: "D-20260718-12",
    label: "GATE 1 · pre-content design review (mockup image)",
    evidenceDir: (site) => join("launches", site, "design-review"),
    proceedsTo: "content/build",
  }),
  post: Object.freeze({
    directive: "D-20260718-15",
    label: "GATE 2 · post-build element-by-element vet (page screenshots)",
    evidenceDir: (site) => join("launches", site, "design-review", "post-build"),
    proceedsTo: "ship candidacy",
  }),
});

/* ----------------------------------------------------------- arg parsing */

/**
 * Parse CLI args. Throws on anything missing or malformed — this runs BEFORE
 * any API call so a run that could not be recorded never burns tokens.
 * @param {string[]} argv
 */
export function parseDesignArgs(argv) {
  const out = {
    site: "", stage: "pre", image: [], purpose: "", audience: "",
    context: [], checklist: "", facts: "", pass: "1", gptModel: "", perplexityModel: "",
  };
  const multi = new Set(["image", "context"]);
  const map = { "gpt-model": "gptModel", "perplexity-model": "perplexityModel" };
  let key = null;
  for (const a of argv) {
    if (a.startsWith("--")) { key = map[a.slice(2)] ?? a.slice(2); continue; }
    if (multi.has(key)) out[key].push(a);
    else if (key) { out[key] = a; key = null; }
  }
  if (!STAGES[out.stage]) throw new Error(`--stage must be "pre" (D-20260718-12 mockup review) or "post" (D-20260718-15 element vet), got "${out.stage}"`);
  const missing = [];
  if (!out.site) missing.push("--site");
  if (out.image.length === 0) missing.push("--image");
  if (!out.purpose) missing.push("--purpose");
  if (!out.audience) missing.push("--audience");
  if (out.stage === "post" && !out.checklist) missing.push("--checklist");
  if (missing.length) {
    throw new Error(
      `missing required: ${missing.join(", ")} — the auditors must SEE the image (D-20260718-12), ` +
      `a design is only judgeable FOR someone FOR a reason, and the post-build vet is element-by-element against a checklist (D-20260718-15)`,
    );
  }
  if (!/^[1-9]\d*$/.test(String(out.pass))) throw new Error(`--pass must be a positive integer (got "${out.pass}") — every pass is recorded, so every pass has a number`);
  if (out.stage === "pre" && out.checklist) throw new Error(`--checklist belongs to --stage post — the pre-content gate judges the mockup, not a build`);
  return out;
}

/* ------------------------------------------------- auditor invocations */

function preAsk(auditorName, args) {
  const common = `This is external design GATE 1 (D-20260718-12) for ${args.site}: a PROPOSED VISUAL DESIGN reviewed BEFORE any content or page build exists. The design is the attached mockup/reference image(s) — judge what you SEE in the pixels, not any text about it.`;
  if (auditorName === "audit-gpt") {
    return `${common} Is this design genuinely good for THIS audience and purpose — memorable, credible, "best foot forward" — or boring, templated, AI-generic? Judge layout, visual hierarchy, typography, colour, imagery, trust signals, and mobile-readiness as visible in the image(s). The owner's standard: all 8 fleet sites were redesigned because designs were not vetted at this point. Verdict PASS only if this design should proceed to content/build as-is; otherwise FAIL with concrete, image-specific findings.`;
  }
  return `${common} Your lane is TRUTH: (1) verify every claim, badge, certification, number, or named entity VISIBLE in the mockup image(s) against live authoritative sources; (2) check the design direction against the CURRENT competitive/design-pattern reality for this audience and niche (live search, not memory) — does what the mockup shows match what actually earns trust in this space today? Verdict PASS only if nothing visible is false or misleading and the direction is defensible against live reality.`;
}

function postAsk(auditorName, args) {
  const common = `This is external design GATE 2 (D-20260718-15) for ${args.site}: the build is believed FINISHED. Attached: screenshots of the built pages (desktop AND mobile viewports). The per-element checklist is supplied in the context section (${args.checklist}). Vet EVERY checklist element against the screenshots — element by element, none skipped. An element you cannot verify from the screenshots is a finding ("needs evidence"), never a silent pass.`;
  if (auditorName === "audit-gpt") {
    return `${common} For each element: does the built result meet the standard, for THIS audience and purpose? Prefix every finding with the checklist element it concerns. Then EXTEND the checklist: list any element that matters for this audience that the checklist misses, each prefixed "ADD:" (in recommendations). Verdict PASS only if every vetted element is genuinely done to standard and nothing blocking is missing.`;
  }
  return `${common} Your lane is TRUTH: verify every factual or checkable claim visible in the screenshots (contact details, certifications, prices, medical/venue claims, named entities) against live authoritative sources and against any locked facts supplied in context, and vet every checklist element that asserts something externally checkable. Prefix findings with the checklist element concerned. Verdict PASS only if nothing shown in the built pages is false or misleading.`;
}

/**
 * The argv tail for one auditor run. Pure — tests assert on it directly.
 * @param {{name:string, defaultModel:string, modelFlag:string}} auditor
 * @param {ReturnType<typeof parseDesignArgs>} args (paths already resolved)
 */
export function auditorArgv(auditor, args) {
  const stage = STAGES[args.stage];
  const artifactNote = args.stage === "pre"
    ? `The artifact under review is the proposed DESIGN itself, shown in the attached mockup/reference image(s): ${args.image.join(", ")}. There is no text artifact — judge the design AS SEEN in the image(s), per D-20260718-12.`
    : `The artifact under review is the BUILT site as shown in the attached page screenshot(s): ${args.image.join(", ")}. Vet it element-by-element against the checklist supplied in context, per D-20260718-15.`;
  // D-EXTREVIEW-OWNER-FACTS: the canonical facts sheet is auto-attached as
  // context so both auditors judge against the owner rulings, not stale web
  // profiles. Order: checklist (post) first, then the facts sheet, then any
  // caller context.
  const contexts = [
    ...(args.stage === "post" ? [args.checklist] : []),
    ...(args.facts ? [args.facts] : []),
    ...args.context,
  ];
  const model = args[auditor.modelFlag] || auditor.defaultModel;
  return [
    "--purpose", args.purpose,
    "--audience", args.audience,
    "--step", `DESIGN ${stage.label} — ${stage.directive}`,
    "--pass", String(args.pass),
    ...args.image.flatMap((p) => ["--image", p]),
    ...contexts.flatMap((c) => ["--context", c]),
    "--artifact", artifactNote,
    "--ask", (args.stage === "pre" ? preAsk : postAsk)(auditor.name, args),
    "--model", model,
    "--raw",
  ];
}

/* ------------------------------------------------------ running + parsing */

/**
 * Run one auditor as a child process from the repo root. Injectable in tests
 * (never call live APIs in tests).
 */
export function defaultRunAuditor(auditor, argv, { repoRoot = REPO_ROOT } = {}) {
  const r = spawnSync(process.execPath, [join(repoRoot, auditor.script), ...argv], {
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
 * Run the D-EXTREVIEW-OWNER-FACTS reclassifier (scripts/audit-reclassify.mjs)
 * as a child process — the SAME auditor model maps its own blocking findings
 * against the facts sheet. Injectable in tests (never call live APIs in
 * tests); keys stay with the child, this script never sees them.
 */
export function defaultRunReclassifier({ auditor, model, factsPath, findings }, { repoRoot = REPO_ROOT } = {}) {
  const r = spawnSync(
    process.execPath,
    [join(repoRoot, "scripts", "audit-reclassify.mjs"), "--auditor", auditor, "--model", model, "--facts", factsPath],
    { cwd: repoRoot, encoding: "utf8", input: JSON.stringify({ findings }), maxBuffer: 64 * 1024 * 1024 },
  );
  return {
    status: r.status === null ? 1 : r.status,
    stdout: r.stdout ?? "",
    stderr: r.stderr ?? "",
    error: r.error ? String(r.error.message ?? r.error) : null,
  };
}

/**
 * Derive the strict verdict from one auditor run. Only the schema-strict
 * PASS|FAIL enum counts (audit-verdict.mjs law), and it must AGREE with the
 * exit code the auditor's own contract promises (0=PASS, 2=FAIL) — a run that
 * says PASS but exited non-zero is inconsistent, and an inconsistent run is
 * not evidence.
 * @returns {{verdict: "PASS"|"FAIL"|null, raw: any, reason: string|null}}
 */
export function deriveVerdict(run) {
  if (run.error) return { verdict: null, raw: null, reason: `auditor process failed to run: ${run.error}` };
  let raw = null;
  try { raw = JSON.parse(run.stdout); } catch { /* not JSON */ }
  if (!raw || typeof raw !== "object") {
    return { verdict: null, raw: null, reason: `auditor produced no parseable JSON critique (exit ${run.status})` };
  }
  const v = raw.verdict;
  if (v !== "PASS" && v !== "FAIL") {
    return { verdict: null, raw, reason: `auditor returned ${JSON.stringify(v ?? null)} — not the strict PASS|FAIL enum, so it is no verdict at all` };
  }
  const expected = v === "PASS" ? 0 : 2;
  if (run.status !== expected) {
    return { verdict: null, raw, reason: `verdict ${v} but exit code ${run.status} (contract says ${expected}) — an inconsistent run is not evidence` };
  }
  return { verdict: v, raw, reason: null };
}

/**
 * Apply the D-EXTREVIEW-OWNER-FACTS reclassification to the auditor results
 * IN PLACE: every result gains `effective` (the verdict the exit code obeys)
 * and `reclass` (the annotation record, or null). The effective verdict can
 * move ONLY FAIL → ADVISORY, only when a facts sheet is attached, and only
 * when the validated mapping covers every blocking finding; every error path
 * leaves the raw FAIL blocking with the reason recorded.
 */
export function reclassifyResults(results, args, { runReclassifier = defaultRunReclassifier, repoRoot = REPO_ROOT } = {}) {
  for (const r of results) {
    r.effective = r.verdict;
    r.reclass = null;
    if (!args.facts || r.verdict !== "FAIL") continue;
    const auditor = AUDITORS.find((a) => a.name === r.name);
    const model = args[auditor.modelFlag] || auditor.defaultModel;
    const findings = extractBlockingFindings(r.name, r.raw);
    if (findings.length === 0) {
      r.reclass = {
        model, findings, mappings: null, allCovered: false,
        error: "no machine-extractable blocking findings in the raw critique — a FAIL that cannot be itemised cannot be shown to rest solely on owner-confirmed facts; it stays blocking",
      };
      continue;
    }
    console.error(`── reclassification (D-EXTREVIEW-OWNER-FACTS): ${r.name} raw FAIL — mapping ${findings.length} blocking finding(s) against ${args.facts} via the same model (${model})`);
    const run = runReclassifier({ auditor: r.name, model, factsPath: args.facts, findings }, { repoRoot });
    const parsed = parseReclassifierOutput(findings, run, readFileSync(isAbsolute(args.facts) ? args.facts : resolve(repoRoot, args.facts), "utf8"));
    r.reclass = { model, findings, ...parsed };
    if (!parsed.error && parsed.allCovered) r.effective = "ADVISORY";
    console.error(`── ${r.name} effective: ${r.effective}${r.reclass.error ? ` (reclassification not applied: ${r.reclass.error})` : ""}`);
  }
  return results;
}

/**
 * @returns {0|1|2} 0 only when no blocking verdict remains — every effective
 * verdict is PASS or ADVISORY (the D-EXTREVIEW-OWNER-FACTS non-blocking lane).
 */
export function decideExit(results) {
  const eff = (r) => r.effective ?? r.verdict;
  if (results.some((r) => eff(r) == null)) return 1;
  if (results.some((r) => eff(r) === "FAIL")) return 2;
  return 0;
}

/* ----------------------------------------------------------- evidence file */

/** Markdown-table cell: one line, pipes escaped, truncated — display only, the raw stays verbatim below. */
function mdCell(s, max = 240) {
  const one = String(s ?? "").replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
  return one.length > max ? `${one.slice(0, max)}…` : one;
}

/** The per-auditor VERDICT line — the D-EXTREVIEW-OWNER-FACTS annotation form when reclassified. */
function verdictLine(r) {
  if (r.verdict === null) return `NONE (${r.reason})`;
  if ((r.effective ?? r.verdict) === "ADVISORY") return "FAIL(raw) → ADVISORY per D-EXTREVIEW-OWNER-FACTS";
  return r.verdict;
}

/**
 * Render the evidence markdown for this pass — metadata, image hashes, the
 * submitted checklist (post), one strict verdict line per auditor, the
 * D-EXTREVIEW-OWNER-FACTS reclassification table when a facts sheet was
 * attached, and both RAW critiques. Written even on FAIL/error: the record of
 * the pass IS the point; only success may proceed, but every pass is history.
 */
export function renderEvidence({ args, stamp, images, checklistText, factsText = "", results, exitCode }) {
  const stage = STAGES[args.stage];
  const eff = (r) => r.effective ?? r.verdict;
  const advisories = results.filter((r) => eff(r) === "ADVISORY");
  const overall =
    exitCode === 0 && advisories.length === 0 ? `OVERALL: PASS — both external auditors returned PASS; the design proceeds to ${stage.proceedsTo}.`
    : exitCode === 0 ? `OVERALL: PASS (advisory) — no blocking verdict remains: ${results.map((r) => `${r.name} ${eff(r) === "ADVISORY" ? "FAIL(raw)→ADVISORY" : "PASS"}`).join(" + ")}. Every raw-FAIL blocking finding maps to an owner-confirmed fact (D-EXTREVIEW-OWNER-FACTS: reviewer doubt on owner-confirmed facts is ADVISORY, never blocking; the owner's signature remains the deciding judgment). The design proceeds to ${stage.proceedsTo}; the advisory findings are recorded below for the owner to weigh.`
    : exitCode === 2 ? `OVERALL: FAIL — ${results.filter((r) => eff(r) === "FAIL").map((r) => r.name).join(" + ")} returned FAIL; the design may NOT proceed to ${stage.proceedsTo}. Judge the critique, revise, re-run as pass ${Number(args.pass) + 1}.`
    : `OVERALL: ERROR — ${results.filter((r) => r.verdict === null).map((r) => r.name).join(" + ")} produced no strict verdict; an absent verdict is never a pass (HARD GATE 6 / rule g). Fix the cause and re-run this pass.`;

  const lines = [
    `# DESIGN EXTERNAL-AI REVIEW — ${args.site} — ${stage.label} — pass ${args.pass}`,
    ``,
    `- directive: ${stage.directive}${args.stage === "post" ? " (companion to D-20260718-12)" : ""} — Abilash, 18 Jul 2026; two-auditor law: 15 Jul 2026 standing ruling`,
    `- when: ${stamp}`,
    `- site: ${args.site} · stage: ${args.stage} · pass: ${args.pass}`,
    `- purpose: ${args.purpose}`,
    `- audience: ${args.audience}`,
    `- models: ${AUDITORS.map((a) => `${a.name}=${args[a.modelFlag] || a.defaultModel}`).join(" · ")}`,
    `- images (the auditors SAW these — base64 data-URI content parts, not descriptions):`,
    ...images.map((im) => `  - ${im.path} (${im.mime}, ${im.bytes} bytes, sha256 ${im.sha256})`),
    ...(args.stage === "post" ? [`- checklist: ${args.checklist} (sha256 ${sha256(checklistText)})`] : []),
    ...(args.facts ? [`- facts sheet (owner-confirmed authority, D-EXTREVIEW-OWNER-FACTS — attached to both auditors as context): ${args.facts} (sha256 ${sha256(factsText)})`] : []),
    ...(args.context.length ? [`- context: ${args.context.join(", ")}`] : []),
    `- loop: critique → judge → revise is the CALLER's job (2–3+ passes, 15 Jul ruling); this file records pass ${args.pass} only.`,
    ``,
    `## VERDICTS (strict PASS|FAIL enum — scripts/lib/audit-verdict.mjs law; nothing else is a verdict${args.facts ? "; ADVISORY is an annotation on a raw FAIL per D-EXTREVIEW-OWNER-FACTS, never a third enum value" : ""})`,
    ``,
    ...results.map((r) => `VERDICT ${r.name}: ${verdictLine(r)}`),
    ``,
    overall,
    ``,
  ];

  const reclassed = results.filter((r) => r.reclass);
  if (reclassed.length) {
    lines.push(
      `## RECLASSIFICATION — D-EXTREVIEW-OWNER-FACTS (owner-confirmed facts are authority)`,
      ``,
      `An annotation layer, never an edit: the raw critiques below are preserved verbatim. For each raw-FAIL auditor, the SAME auditor model mapped its own blocking findings against the owner facts sheet (${args.facts}); the mapping is machine-validated (every finding mapped exactly once; covering facts quoted verbatim from the sheet). A FAIL becomes ADVISORY (non-blocking) ONLY when EVERY blocking finding is covered; anything the sheet does not cover stays blocking, and any reclassifier failure leaves the raw FAIL blocking.`,
      ``,
    );
    for (const r of reclassed) {
      lines.push(`### ${r.name} — raw FAIL, ${r.reclass.findings.length} blocking finding(s), mapped by the same model (${r.reclass.model})`, ``);
      if (r.reclass.error) {
        lines.push(
          `RECLASSIFICATION NOT APPLIED — ${r.reclass.error}`,
          `The raw FAIL stays BLOCKING (a broken or refused mapping can only fail toward blocking, never toward advisory — rule g).`,
          ``,
        );
        continue;
      }
      const byId = new Map(r.reclass.mappings.map((m) => [m.finding_id, m]));
      lines.push(
        `| finding | blocking finding (truncated — raw critique below is verbatim) | covered by owner fact | effective |`,
        `|---|---|---|---|`,
        ...r.reclass.findings.map((f) => {
          const m = byId.get(f.id);
          return `| ${mdCell(f.id)} | ${mdCell(f.text)} | ${m.covered ? mdCell(m.fact) : "—"} | ${m.covered ? "ADVISORY" : "BLOCKING"} |`;
        }),
        ``,
        `EFFECTIVE ${r.name}: ${r.effective === "ADVISORY"
          ? `ADVISORY — all ${r.reclass.findings.length} blocking finding(s) rest on owner-confirmed facts; non-blocking per D-EXTREVIEW-OWNER-FACTS (the owner's signature remains the deciding judgment).`
          : `FAIL — ${r.reclass.mappings.filter((m) => !m.covered).length} finding(s) not covered by the sheet keep the FAIL blocking.`}`,
        ``,
        `Raw mapping (verbatim):`,
        "```json",
        JSON.stringify({ mappings: r.reclass.mappings }, null, 2),
        "```",
        ``,
      );
    }
  }

  if (args.stage === "post") {
    lines.push(
      `## SUBMITTED CHECKLIST (what both auditors were asked to vet, element by element)`,
      ``,
      "````markdown",
      checklistText.trimEnd(),
      "````",
      ``,
    );
  }

  for (const r of results) {
    lines.push(`## ${r.name} — ${r.role} — raw critique`, ``);
    if (r.raw) {
      lines.push("```json", JSON.stringify(r.raw, null, 2), "```", ``);
    } else {
      lines.push(
        `NO CRITIQUE — the auditor run produced no parseable output (${r.reason}).`,
        `stderr (truncated, no secrets are ever printed by the auditors):`,
        "```",
        (r.run.stderr || "(empty)").slice(0, 4000),
        "```",
        ``,
      );
    }
    if (r.verdict === null && r.raw) lines.push(`NOTE: critique recorded but verdict refused — ${r.reason}`, ``);
  }
  return lines.join("\n");
}

/* ------------------------------------------------------------------- run */

/**
 * One full review pass: validate everything, run BOTH auditors with the
 * image(s), write the evidence file, return the exit code.
 * @param {string[]} argv raw CLI args
 * @param {{runAuditor?: typeof defaultRunAuditor, repoRoot?: string, stamp?: string}} deps
 */
export function runDesignReview(argv, { runAuditor = defaultRunAuditor, runReclassifier = defaultRunReclassifier, repoRoot = REPO_ROOT, stamp = istStamp() } = {}) {
  const parsed = parseDesignArgs(argv);
  const abs = (p) => (isAbsolute(p) ? p : resolve(repoRoot, p));
  const args = {
    ...parsed,
    image: parsed.image.map(abs),
    context: parsed.context.map(abs),
    checklist: parsed.checklist ? abs(parsed.checklist) : "",
    facts: parsed.facts ? abs(parsed.facts) : "",
  };

  // Fail-early validation, all BEFORE any API call.
  const imageParts = loadImageParts(args.image); // throws on missing/empty/mislabelled
  const images = imageParts.map((im) => ({ path: relative(repoRoot, im.path), mime: im.mime, bytes: im.bytes, sha256: sha256(readFileSync(im.path)) }));
  let checklistText = "";
  if (args.stage === "post") {
    if (!existsSync(args.checklist)) throw new Error(`--checklist ${parsed.checklist}: file does not exist — seed it from the generated site checklist (scripts/gate-checklist-gen.mjs / gates/registry.yaml)`);
    checklistText = readFileSync(args.checklist, "utf8");
    if (!checklistText.trim()) throw new Error(`--checklist ${parsed.checklist} is empty — an element-by-element vet needs elements`);
  }
  let factsText = "";
  if (args.facts) {
    if (!existsSync(args.facts)) throw new Error(`--facts ${parsed.facts}: file does not exist — the canonical owner facts sheet must be a real, committed file (D-EXTREVIEW-OWNER-FACTS; the kairalicenters context-rulings file is the template)`);
    factsText = readFileSync(args.facts, "utf8");
    if (!factsText.trim()) throw new Error(`--facts ${parsed.facts} is empty — an authority sheet with no facts covers nothing`);
  }
  for (const c of args.context) {
    if (!existsSync(c)) throw new Error(`--context ${c}: file does not exist`);
  }

  const date = stamp.slice(0, 10);
  const evidencePath = resolve(repoRoot, STAGES[args.stage].evidenceDir(args.site), `${date}-pass${args.pass}.md`);
  if (existsSync(evidencePath)) {
    throw new Error(
      `${relative(repoRoot, evidencePath)} already exists — evidence is append-only (a rerun that could overwrite a recorded FAIL is a forgery surface). ` +
      `A new attempt is a new pass: re-run with --pass ${Number(args.pass) + 1}.`,
    );
  }

  // Record checklist/facts paths repo-relative in evidence (portable), keep abs for children.
  const evidenceArgs = {
    ...args,
    checklist: args.checklist ? relative(repoRoot, args.checklist) : "",
    facts: args.facts ? relative(repoRoot, args.facts) : "",
    context: args.context.map((c) => relative(repoRoot, c)),
  };

  const results = AUDITORS.map((auditor) => {
    const av = auditorArgv(auditor, args);
    console.error(`\n── running ${auditor.name} (${auditor.role}) · stage ${args.stage} · pass ${args.pass} · images: ${describeImages(imageParts)}`);
    const run = runAuditor(auditor, av, { repoRoot });
    const { verdict, raw, reason } = deriveVerdict(run);
    console.error(`── ${auditor.name}: ${verdict ?? `NO VERDICT (${reason})`}`);
    return { name: auditor.name, role: auditor.role, argv: av, run, verdict, raw, reason };
  });

  // D-EXTREVIEW-OWNER-FACTS reclassification — annotation only, after the raw
  // verdicts are locked in; can move FAIL → ADVISORY, nothing else.
  reclassifyResults(results, args, { runReclassifier, repoRoot });

  const exitCode = decideExit(results);
  const markdown = renderEvidence({ args: evidenceArgs, stamp, images, checklistText, factsText, results, exitCode });
  mkdirSync(dirname(evidencePath), { recursive: true });
  writeFileSync(evidencePath, markdown + "\n");

  return { args, results, exitCode, evidencePath, markdown };
}

function main() {
  const { results, exitCode, evidencePath } = runDesignReview(process.argv.slice(2));
  const advisories = results.filter((r) => (r.effective ?? r.verdict) === "ADVISORY");
  console.log(`\n=== DESIGN EXTERNAL-AI REVIEW ===`);
  for (const r of results) console.log(`VERDICT ${r.name}: ${verdictLine(r)}`);
  console.log(`evidence: ${relative(REPO_ROOT, evidencePath)}`);
  console.log(
    exitCode === 0 && advisories.length === 0 ? `RESULT: PASS — both auditors positive; the design may proceed.`
    : exitCode === 0 ? `RESULT: PASS (advisory) — no blocking findings remain; the raw FAIL(s) rest solely on owner-confirmed facts (D-EXTREVIEW-OWNER-FACTS). The design may proceed; weigh the advisory findings with the owner.`
    : exitCode === 2 ? `RESULT: FAIL — the design may NOT proceed; judge the critique, revise, and re-run with the next --pass.`
    : `RESULT: ERROR — at least one auditor produced no strict verdict; an absent verdict is never a pass.`,
  );
  process.exit(exitCode);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try { main(); }
  catch (e) { console.error(`design-review failed: ${e.message}`); process.exit(1); }
}
