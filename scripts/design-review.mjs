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
 * EXIT CODES: 0 = BOTH auditors returned PASS · 2 = at least one FAIL ·
 * 1 = harness error or an auditor produced no strict verdict (an absent
 * verdict is never a pass — HARD GATE 6 / rule g).
 *
 * Usage:
 *   node scripts/design-review.mjs \
 *     --site whyayurveda.org \
 *     --image launches/whyayurveda.org/design-intake/hero-mockup.png \
 *     --purpose  "why the site exists, in one honest line" \
 *     --audience "who must be convinced, concretely" \
 *     [--stage pre|post] [--pass N] [--context file]... \
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
    context: [], checklist: "", pass: "1", gptModel: "", perplexityModel: "",
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
  const contexts = args.stage === "post" ? [args.checklist, ...args.context] : args.context;
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

/** @returns {0|1|2} 0 only when BOTH strict verdicts are PASS. */
export function decideExit(results) {
  if (results.some((r) => r.verdict === null)) return 1;
  if (results.some((r) => r.verdict === "FAIL")) return 2;
  return 0;
}

/* ----------------------------------------------------------- evidence file */

/**
 * Render the evidence markdown for this pass — metadata, image hashes, the
 * submitted checklist (post), one strict verdict line per auditor, and both
 * RAW critiques. Written even on FAIL/error: the record of the pass IS the
 * point; only success may proceed, but every pass is history.
 */
export function renderEvidence({ args, stamp, images, checklistText, results, exitCode }) {
  const stage = STAGES[args.stage];
  const overall =
    exitCode === 0 ? `OVERALL: PASS — both external auditors returned PASS; the design proceeds to ${stage.proceedsTo}.`
    : exitCode === 2 ? `OVERALL: FAIL — ${results.filter((r) => r.verdict === "FAIL").map((r) => r.name).join(" + ")} returned FAIL; the design may NOT proceed to ${stage.proceedsTo}. Judge the critique, revise, re-run as pass ${Number(args.pass) + 1}.`
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
    ...(args.context.length ? [`- context: ${args.context.join(", ")}`] : []),
    `- loop: critique → judge → revise is the CALLER's job (2–3+ passes, 15 Jul ruling); this file records pass ${args.pass} only.`,
    ``,
    `## VERDICTS (strict PASS|FAIL enum — scripts/lib/audit-verdict.mjs law; nothing else is a verdict)`,
    ``,
    ...results.map((r) => `VERDICT ${r.name}: ${r.verdict ?? `NONE (${r.reason})`}`),
    ``,
    overall,
    ``,
  ];

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
export function runDesignReview(argv, { runAuditor = defaultRunAuditor, repoRoot = REPO_ROOT, stamp = istStamp() } = {}) {
  const parsed = parseDesignArgs(argv);
  const abs = (p) => (isAbsolute(p) ? p : resolve(repoRoot, p));
  const args = {
    ...parsed,
    image: parsed.image.map(abs),
    context: parsed.context.map(abs),
    checklist: parsed.checklist ? abs(parsed.checklist) : "",
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

  // Record checklist path repo-relative in evidence (portable), keep abs for children.
  const evidenceArgs = { ...args, checklist: args.checklist ? relative(repoRoot, args.checklist) : "", context: args.context.map((c) => relative(repoRoot, c)) };

  const results = AUDITORS.map((auditor) => {
    const av = auditorArgv(auditor, args);
    console.error(`\n── running ${auditor.name} (${auditor.role}) · stage ${args.stage} · pass ${args.pass} · images: ${describeImages(imageParts)}`);
    const run = runAuditor(auditor, av, { repoRoot });
    const { verdict, raw, reason } = deriveVerdict(run);
    console.error(`── ${auditor.name}: ${verdict ?? `NO VERDICT (${reason})`}`);
    return { name: auditor.name, role: auditor.role, argv: av, run, verdict, raw, reason };
  });

  const exitCode = decideExit(results);
  const markdown = renderEvidence({ args: evidenceArgs, stamp, images, checklistText, results, exitCode });
  mkdirSync(dirname(evidencePath), { recursive: true });
  writeFileSync(evidencePath, markdown + "\n");

  return { args, results, exitCode, evidencePath, markdown };
}

function main() {
  const { results, exitCode, evidencePath } = runDesignReview(process.argv.slice(2));
  console.log(`\n=== DESIGN EXTERNAL-AI REVIEW ===`);
  for (const r of results) console.log(`VERDICT ${r.name}: ${r.verdict ?? `NONE (${r.reason})`}`);
  console.log(`evidence: ${relative(REPO_ROOT, evidencePath)}`);
  console.log(
    exitCode === 0 ? `RESULT: PASS — both auditors positive; the design may proceed.`
    : exitCode === 2 ? `RESULT: FAIL — the design may NOT proceed; judge the critique, revise, and re-run with the next --pass.`
    : `RESULT: ERROR — at least one auditor produced no strict verdict; an absent verdict is never a pass.`,
  );
  process.exit(exitCode);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try { main(); }
  catch (e) { console.error(`design-review failed: ${e.message}`); process.exit(1); }
}
