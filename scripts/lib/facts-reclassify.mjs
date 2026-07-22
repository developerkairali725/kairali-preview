/**
 * facts-reclassify.mjs — the ADVISORY verdict lane of D-EXTREVIEW-OWNER-FACTS
 * (Abilash, 18 Jul 2026 18:55:33 IST, DECISIONS.md):
 *
 *   "OWNER-CONFIRMED FACTS ARE AUTHORITY in external AI design reviews. Every
 *    review run attaches a canonical facts sheet (relevant DECISIONS rulings +
 *    @kairali/facts); reviewer doubt on owner-confirmed facts is ADVISORY,
 *    never a blocking FAIL; the owner's signature remains the deciding
 *    judgment."
 *
 * WHAT THIS IS: an ANNOTATION LAYER over the strict PASS|FAIL verdict enum —
 * never an edit of it. The auditors' raw critiques and raw verdicts are
 * preserved verbatim; scripts/lib/audit-verdict.mjs and its enum law are
 * untouched. When an auditor's FAIL rests SOLELY on doubting facts the owner
 * has confirmed in the attached canonical facts sheet, the ORCHESTRATOR
 * (scripts/design-review.mjs) records the verdict as
 * "FAIL(raw) → ADVISORY per D-EXTREVIEW-OWNER-FACTS" and treats the run as
 * non-blocking. Any blocking finding the sheet does NOT cover keeps the FAIL
 * blocking. Rule-g compliant: this implements a ratified owner ruling; the
 * strict lane for everything not owner-confirmed is exactly as strict as ever.
 *
 * HOW COVERAGE IS DECIDED — machine-checked, never self-asserted by us:
 * the SAME auditor model that produced the FAIL is asked to map ITS OWN
 * blocking findings against the sheet (scripts/audit-reclassify.mjs). The
 * mapping is then validated mechanically: every finding mapped exactly once,
 * coverage is a boolean, and every claimed covering fact must actually appear
 * in the sheet (normalized-substring check). The advisory flip happens only
 * from `every(mapping.covered)` computed in code. Any validation failure means
 * NO reclassification — the raw FAIL stays blocking. A broken checker can only
 * fail toward blocking, never toward advisory.
 */

/**
 * Pull the machine-readable BLOCKING findings out of one auditor's raw
 * critique JSON — the findings that force the FAIL under each auditor's own
 * contract. Non-blocking severities (major/minor, SUPPORTED claims,
 * non-health UNVERIFIABLE) are deliberately NOT extracted: the ruling asks
 * whether the FAIL rests solely on owner-confirmed facts, and only blocking
 * findings carry the FAIL.
 *
 * @param {"audit-gpt"|"audit-perplexity"} auditorName
 * @param {any} raw the parsed --raw critique JSON
 * @returns {{id: string, text: string}[]} stable-id findings
 */
export function extractBlockingFindings(auditorName, raw) {
  const out = [];
  if (!raw || typeof raw !== "object") return out;

  if (auditorName === "audit-gpt") {
    // audit-gpt's FAIL carriers: blocking_issues[] + missed_steps severity=blocking.
    for (const [i, b] of (Array.isArray(raw.blocking_issues) ? raw.blocking_issues : []).entries()) {
      if (typeof b === "string" && b.trim()) out.push({ id: `blocking_issues[${i}]`, text: b });
    }
    for (const [i, m] of (Array.isArray(raw.missed_steps) ? raw.missed_steps : []).entries()) {
      if (m && m.severity === "blocking") {
        out.push({ id: `missed_steps[${i}]`, text: `${m.step ?? ""} — evidence: ${m.evidence_it_was_missed ?? ""}` });
      }
    }
    return out;
  }

  if (auditorName === "audit-perplexity") {
    // audit-perplexity's FAIL carriers (its own system-prompt contract):
    // CONTRADICTED or MISLEADING claims, UNVERIFIABLE health claims, plus
    // data faults and fabricated/misrepresented sources (critical findings).
    for (const [i, c] of (Array.isArray(raw.claims_checked) ? raw.claims_checked : []).entries()) {
      if (!c || typeof c !== "object") continue;
      const blocking = c.verdict === "CONTRADICTED" || c.verdict === "MISLEADING" ||
        (c.verdict === "UNVERIFIABLE" && c.is_health_claim === true);
      if (!blocking) continue;
      const bits = [`[${c.verdict}] ${c.claim ?? ""}`];
      if (c.evidence) bits.push(`evidence: ${c.evidence}`);
      if (c.correction) bits.push(`correction: ${c.correction}`);
      out.push({ id: `claims_checked[${i}]`, text: bits.join(" — ") });
    }
    for (const [i, d] of (Array.isArray(raw.data_faults) ? raw.data_faults : []).entries()) {
      if (typeof d === "string" && d.trim()) out.push({ id: `data_faults[${i}]`, text: d });
    }
    for (const [i, f] of (Array.isArray(raw.fabricated_or_misrepresented_sources) ? raw.fabricated_or_misrepresented_sources : []).entries()) {
      if (typeof f === "string" && f.trim()) out.push({ id: `fabricated_sources[${i}]`, text: f });
    }
    return out;
  }

  throw new Error(`unknown auditor "${auditorName}" — the advisory lane knows only the two auditors of the 15 Jul ruling`);
}

/** Strict response schema for the mapping call (OpenAI json_schema shape; Perplexity accepts the same schema object). */
export const RECLASSIFY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["mappings"],
  properties: {
    mappings: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["finding_id", "covered", "fact", "reasoning"],
        properties: {
          finding_id: { type: "string" },
          covered: { type: "boolean" },
          fact: { type: "string" },
          reasoning: { type: "string" },
        },
      },
    },
  },
};

/**
 * The system + user messages for the mapping call. The model is the SAME one
 * that produced the FAIL; the task is a MAPPING of its own findings, not a
 * re-audit, and it is told the tie-break: in doubt, covered=false (blocking).
 */
export function buildReclassifyMessages({ auditor, findings, factsText, factsPath }) {
  const system = `You are the SAME auditor model that just returned a FAIL verdict in an external design review for the Kairali web factory (${auditor}). The findings below are YOUR OWN blocking findings from that critique.

The owner's ratified ruling D-EXTREVIEW-OWNER-FACTS (18 Jul 2026) is in force: OWNER-CONFIRMED FACTS ARE AUTHORITY in these reviews. Reviewer doubt about a fact the owner has confirmed in the attached canonical facts sheet is ADVISORY, never a blocking FAIL — the owner's signature remains the deciding judgment. Anything NOT covered by an owner-confirmed fact is judged as strictly as ever.

YOUR TASK IS A MAPPING, NOT A RE-AUDIT. For EACH finding, decide whether its blocking substance rests SOLELY on doubting, contradicting, or being unable to externally verify a fact the sheet declares owner-confirmed:
- covered=true ONLY when an owner-confirmed fact in the sheet fully answers the finding. Quote that fact VERBATIM from the sheet in "fact" (the quote is machine-checked against the sheet text).
- covered=false when ANY part of the finding stands independently of the sheet — design quality, accessibility, layout, conversion, wayfinding, a claim the sheet does not declare, or a partial overlap.
- When in doubt, covered=false. This mapping can only downgrade a FAIL to advisory, so err on the side of blocking.

Map every finding exactly once, by its exact finding_id. Do not invent findings, do not drop findings, do not revise your original critique. Return ONLY the JSON object matching the schema.`;

  const user = [
    `## THE CANONICAL OWNER FACTS SHEET (${factsPath}) — the authority per D-EXTREVIEW-OWNER-FACTS`,
    factsText,
    `---`,
    `## YOUR BLOCKING FINDINGS — map EVERY one by finding_id`,
    JSON.stringify(findings, null, 2),
  ].join("\n\n");

  return { system, user };
}

/** Whitespace/punctuation-tolerant "does this quote actually appear in the sheet" check. */
function normalizeForQuoteCheck(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/**
 * Mechanical validation of the model's mapping — the machine-checked half of
 * the lane. Throws (→ no reclassification, FAIL stays blocking) when:
 *   - mappings is not an array, or does not map every finding exactly once;
 *   - covered is not a boolean;
 *   - a covered=true mapping quotes no fact, quotes a trivially short one, or
 *     quotes text that does not appear in the sheet (normalized substring).
 * @returns {{finding_id:string, covered:boolean, fact:string, reasoning:string}[]}
 */
export function validateMappings(findings, parsed, factsText) {
  const mappings = parsed?.mappings;
  if (!Array.isArray(mappings)) throw new Error("reclassifier output has no mappings array");
  const wanted = new Set(findings.map((f) => f.id));
  const seen = new Set();
  const normalizedSheet = normalizeForQuoteCheck(factsText);
  for (const m of mappings) {
    if (!m || typeof m !== "object") throw new Error("mapping entry is not an object");
    if (!wanted.has(m.finding_id)) throw new Error(`mapping names unknown finding_id ${JSON.stringify(m.finding_id)} — mappings must cover exactly the extracted findings`);
    if (seen.has(m.finding_id)) throw new Error(`finding_id ${JSON.stringify(m.finding_id)} mapped more than once`);
    seen.add(m.finding_id);
    if (typeof m.covered !== "boolean") throw new Error(`mapping ${m.finding_id}: covered must be a boolean`);
    if (m.covered) {
      const quote = normalizeForQuoteCheck(m.fact ?? "");
      if (quote.length < 10) throw new Error(`mapping ${m.finding_id}: covered=true requires a substantive verbatim fact quote from the sheet`);
      if (!normalizedSheet.includes(quote)) throw new Error(`mapping ${m.finding_id}: the quoted fact does not appear in the facts sheet — a covering fact must be quoted from the sheet, not asserted`);
    }
  }
  const missing = [...wanted].filter((id) => !seen.has(id));
  if (missing.length) throw new Error(`mapping is incomplete — unmapped finding(s): ${missing.join(", ")} (an unmapped blocking finding stays blocking)`);
  return mappings;
}

/**
 * Turn one reclassifier child-process run into a validated result.
 * Every failure path returns {error} and NO mappings — design-review then
 * leaves the raw FAIL blocking and records why. Errors here can never flip a
 * verdict to advisory.
 * @param {{id:string,text:string}[]} findings
 * @param {{status:number, stdout:string, stderr:string, error:string|null}} run
 * @param {string} factsText
 * @returns {{mappings: any[]|null, allCovered: boolean, error: string|null}}
 */
export function parseReclassifierOutput(findings, run, factsText) {
  if (run.error) return { mappings: null, allCovered: false, error: `reclassifier process failed to run: ${run.error}` };
  if (run.status !== 0) return { mappings: null, allCovered: false, error: `reclassifier exited ${run.status}: ${(run.stderr || run.stdout || "").slice(0, 500).trim()}` };
  let parsed;
  try { parsed = JSON.parse(run.stdout); }
  catch { return { mappings: null, allCovered: false, error: "reclassifier produced no parseable JSON mapping" }; }
  try {
    const mappings = validateMappings(findings, parsed, factsText);
    return { mappings, allCovered: mappings.every((m) => m.covered === true), error: null };
  } catch (e) {
    return { mappings: null, allCovered: false, error: e.message };
  }
}
