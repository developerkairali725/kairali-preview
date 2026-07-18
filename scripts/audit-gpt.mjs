#!/usr/bin/env node
/**
 * audit-gpt.mjs — AUDITOR 1 of 2: REASONING / PROCESS / "IS IT ACTUALLY GOOD".
 *
 * Abilash's standing ruling (15 Jul 2026) — binding on every artifact:
 *   show both auditors WHAT WAS THERE, WHAT YOUR THOUGHT PROCESS WAS, and WHAT
 *   YOU BUILT; ask them to be BRUTALLY HONEST and critique it AS AN END RESULT
 *   for the target audience, for the reason we are building it; then JUDGE the
 *   critique, implement what is right, and go 2–3 passes.
 *
 * Division of labour (never use these interchangeably):
 *   audit-gpt.mjs (this) -> reasoning, process, order, missed steps, and whether
 *                           the end result is GOOD for the audience or is
 *                           competent-but-forgettable AI filler.
 *   audit-perplexity.mjs -> is the CLAIM TRUE, verified live against sources.
 *
 * Proven: on first run it FAILed our keyword research and was right — invented
 * compound seeds understated turmeric 11x and implausible zeros were summed into
 * totals that were about to anchor a 3,400-page strategy.
 *
 * Reads OPENAI_API_KEY from ~/.secrets/openai.env. Never prints the key.
 *
 * Usage:
 *   node scripts/audit-gpt.mjs \
 *     --purpose  "Earn the trust of sceptical patients and make Kairali the honest reference for Ayurveda" \
 *     --audience "45yo German, chronic back pain, sceptical of alt-medicine, fears quackery and drug interactions" \
 *     --step     "S4 · Content" --pass 1 \
 *     --prior    old/version.md \
 *     --thinking "I chose X over Y because Z; the trade-off I accepted was W" \
 *     --context  CLAUDE.md docs/process/MASTER_PIPELINE.md \
 *     --artifact content/ashwagandha.json \
 *     --ask      "Would this earn that patient's trust, or does it read like a brochure?" \
 *     [--image mockup.png]... [--model gpt-5] [--raw]
 *     [--emit-gate G3-PROC --emit-site whatisayurveda.com]
 *
 * --image (repeatable, PNG/JPG): base64-embeds the file as an image_url data-URI
 * content part so the auditor SEES it — required for design reviews per
 * D-20260718-12 ("they must see the reference/mockup image, not a text
 * description"). Text-only requests are unchanged when --image is absent.
 * Encoding/validation: scripts/lib/image-input.mjs.
 *
 * --emit-gate/--emit-site: write the §0.2 verdict this run produced to
 * audits/<site>/<gate>-verdict.json. Only the G*-PROC gates this command
 * enforces are accepted, only from a completed API run, PASS/FAIL derived from
 * the model's strict enum — see scripts/lib/audit-verdict.mjs. A local run
 * emits runner:"local" (iteration evidence; the matrix walk requires a
 * CI-committed run for ship evidence).
 *
 * Exit 0 = PASS, 2 = FAIL (gate CI on it), 1 = error.
 */
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadKey, parseReviewArgs, buildBrief, BRUTAL } from "./lib/review-brief.mjs";
import { parseEmitRequest, emitAuditVerdict } from "./lib/audit-verdict.mjs";
import { buildUserContent, describeImages, loadImageParts } from "./lib/image-input.mjs";
import { istIso } from "./lib/verdict.mjs";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const SYSTEM = `You are an INDEPENDENT, SKEPTICAL external auditor for the Kairali Ayurvedic Group's web factory. You did NOT do this work and you are NOT invested in it being right. That detachment is your entire value: you catch what self-review structurally cannot.

The team is trying to build among the best websites in the world, from a heavily-considered decision matrix. The Executive Director's explicit standard: do NOT burn effort producing "very average work" because a rule was hallucinated, forgotten, or a step skipped. Work proceeds STEP BY STEP; nothing is declared ready without every step proven with machine evidence. "A rule written in a document" is ZERO evidence the rule was executed.

${BRUTAL}

YOUR JOB, in order:
1. PROVE YOU UNDERSTAND — restate what is being built, WHY, and WHO for. If what you were given doesn't let you understand these, say so; that is a finding, not an excuse.
2. JUDGE THE END RESULT FOR THE AUDIENCE — the core question. Put yourself in the stated audience's shoes receiving this. Does it move them toward the stated purpose? Where exactly do you lose them? What would they actually think, feel, and do? Be concrete about the failure point.
3. ATTACK THE THOUGHT PROCESS — is the reasoning sound, or did it reach a plausible answer by pattern-matching? Name unexamined assumptions and decisions that were assumed rather than reasoned.
4. COMPARE TO PRIOR — is this genuinely better for the audience than what was there, or just different/more? Name regressions.
5. LOCATE THE WORK + FIND MISSED STEPS — which stage is this really in; were prerequisites genuinely done first (e.g. was audience research done BEFORE keywords? keywords BEFORE the sitemap? sitemap BEFORE content? content BEFORE the build?). Order violations are serious. Name any step, rule or gate skipped, assumed, or merely asserted.
6. HUNT HALLUCINATION — flag any factual/medical/statistical/competitive claim that is unsourced or unverifiable. On a health/YMYL site an unsourced clinical claim is BLOCKING. (A separate fact-checking auditor with live search verifies truth — your job is to flag what NEEDS checking, not to assert facts from memory.)

Default to FAIL if a blocking issue exists, a step is unproven, or the end result would not genuinely serve the stated audience. Cite the specific file/section for every finding. Prefer a few load-bearing findings over a long list of nitpicks.`;

const SCHEMA = {
  name: "audit_verdict",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["understanding", "end_result_for_audience", "thought_process_critique", "vs_prior", "step_location", "missed_steps", "quality", "hallucination_risks", "blocking_issues", "recommendations", "verdict"],
    properties: {
      understanding: {
        type: "object", additionalProperties: false,
        required: ["what_is_being_built", "why", "who_for", "context_sufficient"],
        properties: {
          what_is_being_built: { type: "string" },
          why: { type: "string" },
          who_for: { type: "string" },
          context_sufficient: { type: "boolean" },
        },
      },
      end_result_for_audience: {
        type: "object", additionalProperties: false,
        required: ["serves_the_audience", "meets_the_purpose", "where_it_loses_them", "what_the_audience_would_think", "reasoning"],
        properties: {
          serves_the_audience: { type: "boolean" },
          meets_the_purpose: { type: "boolean" },
          where_it_loses_them: { type: "string" },
          what_the_audience_would_think: { type: "string" },
          reasoning: { type: "string" },
        },
      },
      thought_process_critique: {
        type: "object", additionalProperties: false,
        required: ["reasoning_is_sound", "flawed_reasoning", "unexamined_assumptions"],
        properties: {
          reasoning_is_sound: { type: "boolean" },
          flawed_reasoning: { type: "array", items: { type: "string" } },
          unexamined_assumptions: { type: "array", items: { type: "string" } },
        },
      },
      vs_prior: {
        type: "object", additionalProperties: false,
        required: ["is_better_for_the_audience", "regressions", "note"],
        properties: {
          is_better_for_the_audience: { type: "boolean" },
          regressions: { type: "array", items: { type: "string" } },
          note: { type: "string" },
        },
      },
      step_location: {
        type: "object", additionalProperties: false,
        required: ["claimed_step", "actual_step", "prerequisites_met", "order_violations"],
        properties: {
          claimed_step: { type: "string" },
          actual_step: { type: "string" },
          prerequisites_met: { type: "boolean" },
          order_violations: { type: "array", items: { type: "string" } },
        },
      },
      missed_steps: {
        type: "array",
        items: {
          type: "object", additionalProperties: false,
          required: ["step", "evidence_it_was_missed", "severity"],
          properties: {
            step: { type: "string" },
            evidence_it_was_missed: { type: "string" },
            severity: { type: "string", enum: ["blocking", "major", "minor"] },
          },
        },
      },
      quality: {
        type: "object", additionalProperties: false,
        required: ["rating", "would_an_expert_respect_it", "weakest_point", "generic_ai_filler_risk", "reasoning"],
        properties: {
          rating: { type: "string", enum: ["world-class", "strong", "average", "weak", "unacceptable"] },
          would_an_expert_respect_it: { type: "boolean" },
          weakest_point: { type: "string" },
          generic_ai_filler_risk: { type: "string", enum: ["none", "low", "medium", "high"] },
          reasoning: { type: "string" },
        },
      },
      hallucination_risks: {
        type: "array",
        items: {
          type: "object", additionalProperties: false,
          required: ["claim", "why_risky", "how_to_verify"],
          properties: { claim: { type: "string" }, why_risky: { type: "string" }, how_to_verify: { type: "string" } },
        },
      },
      blocking_issues: { type: "array", items: { type: "string" } },
      recommendations: { type: "array", items: { type: "string" } },
      verdict: { type: "string", enum: ["PASS", "FAIL"] },
    },
  },
};

async function main() {
  const startedAt = istIso();
  const args = parseReviewArgs(process.argv.slice(2), { model: "gpt-5" });
  if (!args.ask) throw new Error("--ask is required");
  // Parse the emit request BEFORE the API call: a run that could not emit must
  // fail before burning tokens, not after.
  const emitReq = parseEmitRequest(args, "audit-gpt");
  // --image: validated + base64-encoded BEFORE the key is loaded or tokens
  // burned. With images the user content becomes OpenAI content parts
  // (text + image_url data URIs); without, the plain string as before.
  const imageParts = loadImageParts(args.image);
  if (imageParts.length) console.error(`images attached (the auditor SEES these — D-20260718-12): ${describeImages(imageParts)}`);
  const key = loadKey("OPENAI_API_KEY", "openai.env");
  const brief = buildBrief(args, { bundleOpts: { maxFile: 120_000, maxTotal: 400_000 } });

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: args.model,
      messages: [{ role: "system", content: SYSTEM }, { role: "user", content: buildUserContent(brief, imageParts) }],
      response_format: { type: "json_schema", json_schema: SCHEMA },
      max_completion_tokens: 16000,
    }),
  });
  const data = await res.json();
  if (data.error) { console.error("API error:", data.error.message); process.exit(1); }
  const text = data.choices?.[0]?.message?.content;
  if (!text) { console.error("empty response; finish_reason:", data.choices?.[0]?.finish_reason); process.exit(1); }
  const v = JSON.parse(text);

  if (args.raw) console.log(JSON.stringify(v, null, 2));
  else {
    const u = data.usage || {};
    const e = v.end_result_for_audience;
    console.log(`\n=== GPT-5 AUDIT (pass ${args.pass}) — ${v.verdict} ===`);
    console.log(`\nUnderstood: ${v.understanding.what_is_being_built}`);
    console.log(`  for whom: ${v.understanding.who_for}`);
    console.log(`  context sufficient: ${v.understanding.context_sufficient}`);
    console.log(`\n--- END RESULT FOR THE AUDIENCE ---`);
    console.log(`serves audience: ${e.serves_the_audience} | meets purpose: ${e.meets_the_purpose}`);
    console.log(`  where it loses them: ${e.where_it_loses_them}`);
    console.log(`  they would think: ${e.what_the_audience_would_think}`);
    console.log(`  ${e.reasoning}`);
    const t = v.thought_process_critique;
    console.log(`\n--- MY REASONING --- sound: ${t.reasoning_is_sound}`);
    for (const f of t.flawed_reasoning) console.log(`  FLAWED: ${f}`);
    for (const f of t.unexamined_assumptions) console.log(`  ASSUMED (never reasoned): ${f}`);
    console.log(`\n--- VS PRIOR --- better for audience: ${v.vs_prior.is_better_for_the_audience}`);
    for (const r of v.vs_prior.regressions) console.log(`  REGRESSION: ${r}`);
    console.log(`\nQuality: ${v.quality.rating} | expert would respect it: ${v.quality.would_an_expert_respect_it} | AI-filler risk: ${v.quality.generic_ai_filler_risk}`);
    console.log(`  weakest point: ${v.quality.weakest_point}`);
    console.log(`\nStep — claimed: ${v.step_location.claimed_step} | actual: ${v.step_location.actual_step} | prereqs met: ${v.step_location.prerequisites_met}`);
    for (const o of v.step_location.order_violations) console.log(`  ORDER VIOLATION: ${o}`);
    if (v.missed_steps.length) { console.log(`\nMISSED STEPS (${v.missed_steps.length}):`); for (const m of v.missed_steps) console.log(`  [${m.severity}] ${m.step}\n     evidence: ${m.evidence_it_was_missed}`); }
    if (v.hallucination_risks.length) { console.log(`\nNEEDS FACT-CHECK (${v.hallucination_risks.length}) → run audit-perplexity.mjs:`); for (const h of v.hallucination_risks) console.log(`  - ${h.claim}`); }
    if (v.blocking_issues.length) { console.log(`\nBLOCKING (${v.blocking_issues.length}):`); for (const b of v.blocking_issues) console.log(`  ✗ ${b}`); }
    if (v.recommendations.length) { console.log(`\nRECOMMENDATIONS:`); for (const r of v.recommendations) console.log(`  → ${r}`); }
    console.log(`\ntokens: prompt ${u.prompt_tokens} · completion ${u.completion_tokens} (reasoning ${u.completion_tokens_details?.reasoning_tokens ?? "?"})`);
  }
  if (emitReq) {
    // The verdict is emitted BY this execution, from the enum this run parsed —
    // the only sanctioned path to a G*-PROC verdict (§0.2).
    const { path } = emitAuditVerdict({
      auditor: "audit-gpt",
      gate: emitReq.gate,
      site: emitReq.site,
      repoRoot: REPO_ROOT,
      artifacts: args.artifact,
      verdict: v.verdict,
      startedAt,
      argv: process.argv.slice(2),
      model: args.model,
    });
    console.error(`verdict: ${relative(REPO_ROOT, path)} — ${v.verdict}`);
  }
  process.exit(v.verdict === "PASS" ? 0 : 2);
}

main().catch((e) => { console.error("audit-gpt failed:", e.message); process.exit(1); });
