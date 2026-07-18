#!/usr/bin/env node
/**
 * audit-perplexity.mjs — AUDITOR 2 of 2: IS IT TRUE? (live search + citations)
 *
 * Abilash's standing ruling (15 Jul 2026): every artifact goes to BOTH auditors
 * with what was there, the thought process, and what was built; brutally honest;
 * judged as an END RESULT for the target audience and the reason we're building
 * it; then the agent judges the critique, implements, and re-runs — 2–3 passes.
 *
 * Division of labour (never interchangeable):
 *   audit-gpt.mjs        -> reasoning/process/order/"is it actually good".
 *   audit-perplexity.mjs -> is the CLAIM TRUE, checked against live sources.
 *
 * Why both: GPT-5 could only SUSPECT "shilajit = 0 US searches" was wrong — it
 * cannot check. Perplexity disproved it with sources. Suspicion vs proof. On a
 * YMYL health site publishing claims about herbs to real patients, this gate is
 * the defence against hallucinated medicine.
 *
 * CONTAMINATION RULE (learned the hard way): never hand this auditor an artifact
 * annotated with our own conclusions — it will recite them back as "findings".
 * Strip our analysis first. A verdict justified by "the artifact itself says" is
 * worthless; only external sources count.
 *
 * Reads PERPLEXITY_API_KEY from ~/.secrets/perplexity.env. Never prints the key.
 * Exit 0 = PASS, 2 = FAIL, 1 = error.
 *
 * --emit-gate/--emit-site (e.g. --emit-gate G6-FACT --emit-site
 * whatisayurveda.com): write the §0.2 verdict this run produced to
 * audits/<site>/<gate>-verdict.json. Only the G*-FACT gates this command
 * enforces are accepted, only from a completed API run, PASS/FAIL derived from
 * the model's strict enum — see scripts/lib/audit-verdict.mjs. A local run
 * emits runner:"local" (iteration evidence; the matrix walk requires a
 * CI-committed run for ship evidence).
 */
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadKey, parseReviewArgs, buildBrief, BRUTAL } from "./lib/review-brief.mjs";
import { parseEmitRequest, emitAuditVerdict } from "./lib/audit-verdict.mjs";
import { istIso } from "./lib/verdict.mjs";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const SYSTEM = `You are a FACT-GROUNDING AUDITOR with live web access. You are the last line of defence against confidently-stated falsehood.

You audit work produced by an AI agent for the Kairali Ayurvedic Group — including a health/medical encyclopedia (YMYL) that publishes claims about Ayurvedic herbs, treatments and evidence to real patients. A wrong medical claim can harm a reader. A wrong market number can misdirect a multi-thousand-page strategy.

YOUR JOB IS TRUTH. Not style, not process — is each claim TRUE? Another auditor handles reasoning and quality; do not duplicate it.

${BRUTAL}

Use the stated AUDIENCE and PURPOSE to judge STAKES and SAFETY: a claim a healthy browser could shrug off may be dangerous for the actual audience (e.g. someone on medication, pregnant, or delaying real treatment). Weight your severity accordingly.

METHOD:
1. Extract every checkable factual claim: medical/clinical/pharmacological, statistics and numbers, search/market data, competitive and company facts, regulatory/legal claims, historical claims, and any citation of a study or source (verify the source EXISTS and says what is claimed — fabricated or misrepresented citations are a critical finding).
2. SEARCH and verify each against real, current, authoritative sources. Prefer primary sources (peer-reviewed literature, PubMed/Cochrane, NIH/NCCIH/ODS, regulators, official pharmacopoeias, official registries) over blogs and SEO content.
3. Judge each claim:
   - SUPPORTED    = authoritative sources confirm it.
   - CONTRADICTED = sources show it is FALSE. Give the correct fact.
   - MISLEADING   = technically defensible but creates a false impression (overstated certainty, cherry-picked, missing a critical caveat). For health claims, preliminary/in-vitro/animal evidence presented as if it applies to humans is MISLEADING.
   - UNVERIFIABLE = no authoritative support found. For a YMYL health claim this is serious — it must not be published as fact.
4. PLAUSIBILITY: if a number is implausible on its face (a globally popular supplement reported as ZERO search volume in a major market), name it as a DATA FAULT and give the real approximate figure. Do not repeat a data fault as if it were a finding about the world.
5. EPISTEMIC HONESTY about data provenance: state plainly when a figure is a MODELLED ESTIMATE rather than a measured fact (e.g. Google does not publish per-keyword volumes; commercial tools model them and diverge from each other). Treating modelled estimates as ground truth is itself a finding.
6. CITE a specific external source for every judgement. CRITICAL: the artifact under review is NOT evidence for itself. If your only justification is "the artifact itself states…", that is not verification — mark the claim UNVERIFIABLE and say you need an external source.

Be blunt. If a claim is fine, mark SUPPORTED in one line — false alarms waste the team's time and cost you credibility. Default to FAIL if any claim is CONTRADICTED or MISLEADING, or if a health claim is UNVERIFIABLE.

Return ONLY the JSON object matching the schema.`;

const SCHEMA = {
  type: "object",
  properties: {
    claims_checked: {
      type: "array",
      items: {
        type: "object",
        properties: {
          claim: { type: "string" },
          verdict: { type: "string", enum: ["SUPPORTED", "CONTRADICTED", "MISLEADING", "UNVERIFIABLE"] },
          evidence: { type: "string" },
          correction: { type: "string" },
          is_health_claim: { type: "boolean" },
          risk_to_this_audience: { type: "string", enum: ["none", "low", "medium", "high"] },
          confidence: { type: "string", enum: ["high", "medium", "low"] },
        },
        required: ["claim", "verdict", "evidence", "correction", "is_health_claim", "risk_to_this_audience", "confidence"],
        additionalProperties: false,
      },
    },
    data_faults: { type: "array", items: { type: "string" } },
    fabricated_or_misrepresented_sources: { type: "array", items: { type: "string" } },
    summary: { type: "string" },
    verdict: { type: "string", enum: ["PASS", "FAIL"] },
  },
  required: ["claims_checked", "data_faults", "fabricated_or_misrepresented_sources", "summary", "verdict"],
  additionalProperties: false,
};

async function main() {
  const startedAt = istIso();
  const args = parseReviewArgs(process.argv.slice(2), { model: "sonar-pro" });
  if (!args.ask) throw new Error("--ask is required");
  // Parse the emit request BEFORE the API call: a run that could not emit must
  // fail before burning tokens, not after.
  const emitReq = parseEmitRequest(args, "audit-perplexity");
  const key = loadKey("PERPLEXITY_API_KEY", "perplexity.env");
  // sonar's context is tighter than gpt-5's
  const brief = buildBrief(args, { bundleOpts: { maxFile: 60_000, maxTotal: 140_000 } });

  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: args.model,
      messages: [{ role: "system", content: SYSTEM }, { role: "user", content: brief }],
      response_format: { type: "json_schema", json_schema: { schema: SCHEMA } },
      temperature: 0,
    }),
  });
  const data = await res.json();
  if (data.error) { console.error("API error:", JSON.stringify(data.error).slice(0, 300)); process.exit(1); }
  const text = data.choices?.[0]?.message?.content;
  if (!text) { console.error("empty response:", JSON.stringify(data).slice(0, 300)); process.exit(1); }

  let v;
  try { v = JSON.parse(text); }
  catch { const m = text.match(/\{[\s\S]*\}/); if (!m) { console.error("unparseable:", text.slice(0, 300)); process.exit(1); } v = JSON.parse(m[0]); }
  const citations = data.citations || data.search_results || [];

  if (args.raw) console.log(JSON.stringify({ ...v, citations }, null, 2));
  else {
    console.log(`\n=== PERPLEXITY FACT AUDIT (pass ${args.pass}) — ${v.verdict} ===\n`);
    console.log(v.summary);
    const bad = v.claims_checked.filter((c) => c.verdict !== "SUPPORTED");
    console.log(`\nclaims checked: ${v.claims_checked.length} | problems: ${bad.length}`);
    for (const c of bad) {
      const tag = [c.is_health_claim ? "HEALTH" : null, c.risk_to_this_audience !== "none" ? `risk:${c.risk_to_this_audience}` : null].filter(Boolean).join(" ");
      console.log(`\n[${c.verdict}]${tag ? ` (${tag})` : ""} ${c.claim}`);
      console.log(`   evidence: ${c.evidence}`);
      if (c.correction) console.log(`   correction: ${c.correction}`);
    }
    if (v.fabricated_or_misrepresented_sources.length) { console.log(`\n⚠ FABRICATED / MISREPRESENTED SOURCES:`); for (const f of v.fabricated_or_misrepresented_sources) console.log(`  ✗ ${f}`); }
    if (v.data_faults.length) { console.log(`\nDATA FAULTS:`); for (const d of v.data_faults) console.log(`  ✗ ${d}`); }
    if (citations.length) { console.log(`\nSOURCES (${citations.length}):`); for (const c of citations.slice(0, 12)) console.log(`  - ${typeof c === "string" ? c : c.url || ""}`); }
  }
  if (emitReq) {
    // The verdict is emitted BY this execution, from the enum this run parsed —
    // the only sanctioned path to a G*-FACT verdict (§0.2).
    const { path } = emitAuditVerdict({
      auditor: "audit-perplexity",
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

main().catch((e) => { console.error("audit-perplexity failed:", e.message); process.exit(1); });
