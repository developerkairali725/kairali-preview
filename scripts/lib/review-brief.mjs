/**
 * review-brief.mjs — the shared REVIEW BRIEF both auditors receive.
 *
 * Abilash's standing ruling (15 Jul 2026), binding on every artifact we produce:
 *   "When you need anything, you will show these two auditors — ChatGPT and
 *    Perplexity — WHAT WAS THERE, WHAT YOUR THOUGHT PROCESS WAS, and WHAT YOU
 *    BUILT. Ask them to be BRUTALLY HONEST and critique it AS AN END RESULT for
 *    my X TARGET AUDIENCE, for THE REASON we are building it. Then judge whether
 *    what they are saying is correct or not and what needs to be implemented.
 *    Then make the changes. At least two or three passes back and forth till you
 *    assume most of it is done — be it code, SEO, content, strategy."
 *
 * WHY THE BRIEF IS SHAPED THIS WAY:
 *  - PRIOR ("what was there") — without the baseline an auditor cannot tell an
 *    improvement from a regression, and will praise motion as progress.
 *  - THINKING ("your thought process") — exposes the REASONING to attack, not
 *    just the output. Bad reasoning that happens to produce plausible output is
 *    the most dangerous failure we have; it repeats.
 *  - AUDIENCE + PURPOSE — an artifact is not good in the abstract. It is good
 *    FOR SOMEONE, FOR A REASON. "Well-written" is not a verdict; "this loses the
 *    sceptical German patient in the second paragraph" is.
 *  - END RESULT — judge the thing the audience actually receives, not our effort.
 *
 * The agent then JUDGES the critique (auditors are advisors, not oracles — they
 * over-reach; verified counter-evidence beats an auditor's assertion), applies
 * what is right, and re-runs. Minimum two passes.
 */
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { stripAnnotations } from "./strip-annotations.mjs";

/** Read a secret from ~/.secrets/<file> without ever printing it. */
export function loadKey(varName, fileName) {
  if (process.env[varName]) return process.env[varName];
  const f = join(homedir(), ".secrets", fileName);
  if (!existsSync(f)) throw new Error(`no ${varName} and ~/.secrets/${fileName} missing`);
  const m = readFileSync(f, "utf8").match(new RegExp(`^${varName}=(.+)$`, "m"));
  if (!m) throw new Error(`${varName} not found in ~/.secrets/${fileName}`);
  return m[1].trim();
}

/**
 * Read files (or inline text) into one labelled bundle.
 * A value that isn't an existing path is treated as literal text — so
 * --thinking "I chose X because Y" works as well as --thinking notes.md
 */
export function readBundle(values, label, { maxFile = 100_000, maxTotal = 300_000, strip = false } = {}) {
  let total = 0;
  const parts = [];
  for (const v of values) {
    if (!existsSync(v)) { parts.push(v); total += v.length; continue; }
    let body = readFileSync(v, "utf8");
    // X-19: the artifact an auditor judges must be RAW. Our own quarantine
    // headers/conclusions get recited back as "findings" — an echo, not
    // verification. Our reasoning has a sanctioned channel: --thinking.
    if (strip) {
      const r = stripAnnotations(body);
      if (r.wasContaminated) {
        STRIP_LOG.push({ file: v, removed: r.stripped });
        body = r.clean;
      }
    }
    if (body.length > maxFile) body = body.slice(0, maxFile) + `\n…[truncated ${v}]`;
    total += body.length;
    if (total > maxTotal) { parts.push(`[${label} truncated — byte budget reached]`); break; }
    parts.push(`### ${v}\n${body}`);
  }
  return parts.join("\n\n");
}

/** What the stripper removed this run — printed, never silent. */
export const STRIP_LOG = [];

export function parseReviewArgs(argv, defaults = {}) {
  const out = {
    context: [], artifact: [], prior: [], thinking: [],
    audience: "", purpose: "", ask: "", step: "", pass: "1",
    raw: false, ...defaults,
  };
  let key = null;
  const multi = new Set(["context", "artifact", "prior", "thinking"]);
  for (const a of argv) {
    if (a.startsWith("--")) {
      key = a.slice(2);
      if (key === "raw") { out.raw = true; key = null; }
      continue;
    }
    if (multi.has(key)) out[key].push(a);
    else if (key) { out[key] = a; key = null; }
  }
  return out;
}

/** The brutal-honesty framing every auditor shares. */
export const BRUTAL = `You have been asked to be BRUTALLY HONEST. That is not a licence to nitpick — it is a duty to say the thing a polite reviewer would swallow.

Judge the work AS AN END RESULT — the thing the target audience actually receives — NOT as effort, intention, or process. Volume is not quality. "Comprehensive" is not a compliment. Competent-but-forgettable is a FAILURE for a team explicitly trying to build one of the best in the world.

Anchor EVERY judgement to the stated TARGET AUDIENCE and PURPOSE below. "Well-written" is not a verdict. "A sceptical 45-year-old German patient stops reading here because we sound like a brochure" is a verdict. If the work would not move THAT person toward THAT purpose, it fails, however polished it looks.

Attack the THOUGHT PROCESS as well as the output. Reasoning that produced a plausible-looking result by luck or by pattern-matching will produce a broken one next time. If the reasoning is unsound, say so even if the artifact looks fine. If a key decision was never actually reasoned about — just assumed — name it.

Compare against WHAT WAS THERE BEFORE. If this is not clearly better for the audience, say so. Motion is not progress.

Do not be agreeable. Do not pad with praise. Do not hedge into uselessness. If something is genuinely good, say it in one line and spend your words on what is not. If you cannot judge something from what you were given, say exactly what you would need — never bluff.`;

/**
 * Build the shared review brief.
 * @param {{prior:string[],thinking:string[],artifact:string[],context:string[],
 *          audience:string,purpose:string,ask:string,step:string,pass:string}} a
 */
export function buildBrief(a, opts = {}) {
  const bundleOpts = opts.bundleOpts || {};
  const sections = [
    `## WHY WE ARE BUILDING THIS (the purpose — judge everything against it)\n${a.purpose || "⚠ NOT STATED — this is itself a finding: work without a stated purpose cannot be judged."}`,
    `## WHO IT IS FOR (the target audience — judge everything as THIS person receiving it)\n${a.audience || "⚠ NOT STATED — this is itself a finding: an artifact is not good in the abstract, only good FOR someone."}`,
    a.step ? `## WHERE WE ARE IN THE PROCESS\n${a.step}` : "",
    `## REVIEW PASS NUMBER\n${a.pass}${Number(a.pass) > 1 ? " (a previous pass raised findings; judge whether they were genuinely fixed or merely papered over)" : ""}`,
    `## WHAT TO CRITIQUE\n${a.ask}`,
    a.prior.length ? `## WHAT WAS THERE BEFORE (the baseline — is this actually better for the audience?)\n${readBundle(a.prior, "prior", bundleOpts)}` : `## WHAT WAS THERE BEFORE\n(nothing supplied — treat as greenfield)`,
    a.thinking.length ? `## MY THOUGHT PROCESS (the agent's reasoning + decisions + trade-offs — attack this too)\n${readBundle(a.thinking, "thinking", bundleOpts)}` : `## MY THOUGHT PROCESS\n⚠ NOT SUPPLIED — flag this: reasoning that cannot be inspected cannot be trusted.`,
    a.context.length ? `## BACKGROUND CONTEXT (rules/doctrine — for understanding where we're coming from)\n${readBundle(a.context, "context", bundleOpts)}` : "",
    // X-19: the artifact is ALWAYS stripped of our own annotations before any
    // auditor sees it. Not a flag a caller can forget — forgetting it is how a
    // fact-checker recites our conclusions back as "findings".
    `## WHAT I BUILT (the artifact — the END RESULT the audience receives)\n${readBundle(a.artifact, "artifact", { ...bundleOpts, strip: true }) || "(none supplied)"}`,
  ].filter(Boolean);
  return sections.join("\n\n---\n\n");
}
