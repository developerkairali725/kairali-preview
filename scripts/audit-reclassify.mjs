#!/usr/bin/env node
/**
 * audit-reclassify.mjs — the mapping call of the D-EXTREVIEW-OWNER-FACTS
 * ADVISORY lane (see scripts/lib/facts-reclassify.mjs for the ruling and the
 * design). Invoked by scripts/design-review.mjs after an auditor returns a
 * raw FAIL with a canonical facts sheet attached (--facts).
 *
 * WHAT IT DOES: asks the SAME auditor model that produced the FAIL to map ITS
 * OWN blocking findings against the owner facts sheet — covered (the finding
 * rests solely on an owner-confirmed fact) or not. The mapping is validated
 * mechanically before anything is printed (every finding mapped exactly once,
 * covering facts quoted verbatim from the sheet); an invalid mapping exits 1
 * and the caller leaves the raw FAIL blocking. This tool ANNOTATES a verdict;
 * it can never produce, edit, or replace one — the strict PASS|FAIL enum law
 * (scripts/lib/audit-verdict.mjs) is untouched.
 *
 * Reads the findings JSON from stdin: {"findings":[{"id":"…","text":"…"}, …]}.
 * Keys stay in ~/.secrets/ (OPENAI_API_KEY / PERPLEXITY_API_KEY per auditor),
 * loaded here at runtime and never printed.
 *
 * Usage:
 *   echo '{"findings":[…]}' | node scripts/audit-reclassify.mjs \
 *     --auditor audit-gpt|audit-perplexity \
 *     --model   <the exact model that produced the FAIL> \
 *     --facts   launches/<site>/design-review/context-rulings.md
 *
 * Exit 0 = a validated mapping was printed (stdout JSON: {mappings:[…]}).
 * Exit 1 = no mapping (any error). There is no exit 2: coverage is not a
 * verdict, it is an annotation the orchestrator interprets.
 */
import { existsSync, readFileSync } from "node:fs";
import { loadKey } from "./lib/review-brief.mjs";
import { RECLASSIFY_SCHEMA, buildReclassifyMessages, validateMappings } from "./lib/facts-reclassify.mjs";

/** Which provider speaks for which auditor — the SAME endpoints and key files the auditors themselves use. */
export const PROVIDERS = Object.freeze({
  "audit-gpt": Object.freeze({
    keyVar: "OPENAI_API_KEY", keyFile: "openai.env",
    url: "https://api.openai.com/v1/chat/completions",
    body: (model, system, user) => ({
      model,
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
      response_format: { type: "json_schema", json_schema: { name: "facts_reclassification", strict: true, schema: RECLASSIFY_SCHEMA } },
      max_completion_tokens: 8000,
    }),
  }),
  "audit-perplexity": Object.freeze({
    keyVar: "PERPLEXITY_API_KEY", keyFile: "perplexity.env",
    url: "https://api.perplexity.ai/chat/completions",
    body: (model, system, user) => ({
      model,
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
      response_format: { type: "json_schema", json_schema: { schema: RECLASSIFY_SCHEMA } },
      temperature: 0,
    }),
  }),
});

/** Parse CLI args; throws on anything missing/unknown BEFORE any key is loaded or token burned. */
export function parseReclassifyArgs(argv) {
  const out = { auditor: "", model: "", facts: "" };
  let key = null;
  for (const a of argv) {
    if (a.startsWith("--")) { key = a.slice(2); continue; }
    if (key) { out[key] = a; key = null; }
  }
  if (!PROVIDERS[out.auditor]) throw new Error(`--auditor must be one of [${Object.keys(PROVIDERS).join(", ")}] (got ${JSON.stringify(out.auditor || null)}) — the mapping must come from the SAME auditor model that produced the FAIL`);
  if (!out.model) throw new Error("--model is required — the exact model that produced the FAIL, never a substitute");
  if (!out.facts) throw new Error("--facts is required — without the canonical owner facts sheet there is nothing to map against");
  return out;
}

/** Parse + validate the stdin findings payload. */
export function parseFindingsPayload(text) {
  let parsed;
  try { parsed = JSON.parse(text); }
  catch { throw new Error("stdin is not JSON — expected {\"findings\":[{\"id\":…,\"text\":…}]}"); }
  const findings = parsed?.findings;
  if (!Array.isArray(findings) || findings.length === 0) throw new Error("stdin carries no findings — a FAIL with no extractable blocking findings has nothing to reclassify (it stays blocking)");
  for (const f of findings) {
    if (!f || typeof f.id !== "string" || !f.id || typeof f.text !== "string" || !f.text.trim()) {
      throw new Error(`malformed finding ${JSON.stringify(f)} — each needs a non-empty id and text`);
    }
  }
  return findings;
}

async function main() {
  const args = parseReclassifyArgs(process.argv.slice(2));
  const findings = parseFindingsPayload(readFileSync(0, "utf8"));
  if (!existsSync(args.facts)) throw new Error(`--facts ${args.facts}: file does not exist`);
  const factsText = readFileSync(args.facts, "utf8");
  if (!factsText.trim()) throw new Error(`--facts ${args.facts} is empty — an authority sheet with no facts covers nothing`);

  const provider = PROVIDERS[args.auditor];
  const key = loadKey(provider.keyVar, provider.keyFile);
  const { system, user } = buildReclassifyMessages({ auditor: args.auditor, findings, factsText, factsPath: args.facts });

  const res = await fetch(provider.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(provider.body(args.model, system, user)),
  });
  const data = await res.json();
  if (data.error) { console.error("API error:", JSON.stringify(data.error).slice(0, 300)); process.exit(1); }
  const text = data.choices?.[0]?.message?.content;
  if (!text) { console.error("empty response:", JSON.stringify(data).slice(0, 300)); process.exit(1); }

  let parsed;
  try { parsed = JSON.parse(text); }
  catch { const m = text.match(/\{[\s\S]*\}/); if (!m) { console.error("unparseable:", text.slice(0, 300)); process.exit(1); } parsed = JSON.parse(m[0]); }

  // Machine-check at the source too: an invalid mapping never leaves this
  // process looking like a valid one.
  const mappings = validateMappings(findings, parsed, factsText);
  console.log(JSON.stringify({ mappings }, null, 2));
  process.exit(0);
}

// NOTE: comparing import.meta.url to process.argv[1] as raw STRINGS silently
// broke on any checkout path containing a space — import.meta.url percent-encodes
// it, argv[1] does not — so main() never ran and the script exited 0 having
// checked NOTHING. Normalising argv[1] through URL() fixes it with no new import.
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main().catch((e) => { console.error("audit-reclassify failed:", e.message); process.exit(1); });
}
