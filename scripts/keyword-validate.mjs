#!/usr/bin/env node
/**
 * keyword-validate.mjs — V1-V10 + the four-state type model + G3-PRE assertions 0-9.
 * The S3 blocking gate. No number leaves this stage un-validated.
 *
 * CLOSES FAILURES #1, #2, #3, #4 — the ones that started this exercise:
 *   #1 invented compound seeds     -> assertion 1 (delegates to seed-lint Rules A/B/C)
 *   #2 implausible zeros summed    -> V1 four-state + assertion 3 + assertion 5 + V4
 *   #3 English-only India          -> assertion 2 (locale x script PARITY, not presence)
 *   #4 modelled estimate as fact   -> V7 provenance + V8 buckets + X-21 Volume type
 *
 * ===========================================================================
 * THE ONE RULE THAT GOVERNS EVERY CHECK BELOW: A CHECK THAT CANNOT RUN FAILS.
 * ===========================================================================
 * It never passes, and it never "skips". This is not defensive style — it is the
 * whole lesson of the incident, generalised:
 *
 *   - `null` -> 0 said "no data" and "no demand" are the same. They are not.
 *   - absent -> 0 said "no row came back" and "no demand" are the same. They are not.
 *   - "Perplexity couldn't verify it" -> "it's fabricated" said "retrieval failed" and
 *     "false" are the same. They are not. (Our own fact-checker did this to us, and a
 *     `curl | grep` disproved it in one command.)
 *   - A lint whose regex silently stops matching reports 0 hits and says "clean".
 *
 * Every one of those is the SAME error: a statement about OUR REQUEST read as a
 * statement about THE WORLD. So when this validator cannot run a check — no raw
 * responses committed, no seeds file, no ontology — it says FAIL/CANNOT_RUN and blocks.
 * Silence is the failure mode, so silence is never green.
 *
 * Exit 0 = PASS · 2 = FAIL (CI blocks) · 1 = harness error.
 *
 * Usage:
 *   node scripts/keyword-validate.mjs --artifact <demand.json>
 *        [--ontology <o.json>] [--seeds <s.json>] [--audience <a.md>]
 *        [--raw <dir-of-request-response-pairs>] [--questions <q.json>]
 *        [--check V1|V9|V10|locales|ontology|...] [--json]
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  STATUS, isMeasuredStatus, Volume, sumMeasured, toSignificantFigures, significantFiguresOf,
  MAX_SIGNIFICANT_FIGURES, LOCALE_MATRIX, HARD_BLOCK_REGISTERS, HIGH_PRIOR_ENTITIES,
  registerOf, hasDevanagari, controlProbe, istNow, tokens, findFormSpans, resolveMarket,
} from "./lib/keyword-model.mjs";
import { lintSeeds } from "./seed-lint.mjs";

const EXIT_OK = 0, EXIT_HARNESS = 1, EXIT_FAIL = 2;

/** The bucket ladder's smallest non-zero rung (research SS6 V8, measured from our own pulls). */
const LADDER_MIN = 10;

// ---------------------------------------------------------------------------
// result helpers
// ---------------------------------------------------------------------------

/**
 * @typedef {'PASS'|'FAIL'|'REPORT_ONLY'|'CANNOT_RUN'} CheckState
 * @typedef {object} CheckResult
 * @property {string} id
 * @property {string} title
 * @property {CheckState} state
 * @property {boolean} blocking
 * @property {string[]} findings
 * @property {string} [note]
 */

/** @returns {CheckResult} */
const check = (id, title, state, findings = [], { blocking = true, note } = {}) =>
  ({ id, title, state, blocking, findings, note });

// ---------------------------------------------------------------------------
// ARTIFACT SHAPES
// ---------------------------------------------------------------------------

/**
 * @typedef {object} Row
 * @property {string} keyword
 * @property {string} market
 * @property {number|null} rawValue
 * @property {string|null} status      null => the artifact carries NO status field at all
 * @property {string|null} source
 * @property {string|null} retrieved_at
 * @property {string|null} language_code
 * @property {string|null} locale
 * @property {string|null} [cluster]
 * @property {string|undefined} [competition]
 * @property {number|undefined} [keyword_difficulty]
 */

/**
 * Detect the artifact's shape. This matters more than it looks: the file named
 * `demand-raw.json` IS NOT RAW. It is a pre-digested {keyword: number} map. The actual
 * API response — nulls, competition, cpc, monthly_searches, the task cost, the request
 * payload — was discarded at write time. So the null->0 coercion is UNDETECTABLE BY
 * INSPECTION OF OUR OWN EVIDENCE. Our audit trail could not have caught this bug;
 * GPT-5 caught it by reasoning about Ayurveda, not by reading our data.
 *
 * That is why a lossy "raw" file is itself a V1 failure, independent of its contents.
 * @param {any} raw
 * @returns {'output_contract'|'legacy_lossy'|'api_response'|'unknown'}
 */
export function detectShape(raw) {
  if (raw && typeof raw === "object") {
    if (Array.isArray(raw.tasks)) return "api_response";
    if (raw.meta && (Array.isArray(raw.clusters) || Array.isArray(raw.rows))) return "output_contract";
    const vals = Object.values(raw);
    if (vals.length && vals.every((v) => v && typeof v === "object" && !Array.isArray(v) &&
        Object.values(v).every((x) => typeof x === "number" || x === null))) {
      return "legacy_lossy";
    }
  }
  return "unknown";
}

/**
 * Normalise any shape to Rows. Legacy rows come back with `status: null` — meaning the
 * artifact does not merely have a WRONG status, it has NO CONCEPT of status. That
 * distinction is the finding.
 * @param {any} raw
 * @param {string} shape
 * @returns {Row[]}
 */
export function toRows(raw, shape) {
  /** @type {Row[]} */
  const rows = [];
  if (shape === "legacy_lossy") {
    for (const [market, kws] of Object.entries(raw)) {
      for (const [keyword, v] of Object.entries(/** @type {object} */ (kws))) {
        rows.push({ keyword, market: resolveMarket(market) ?? market, rawValue: /** @type {number|null} */ (v), status: null,
                    source: null, retrieved_at: null, language_code: null, locale: null });
      }
    }
    return rows;
  }
  if (shape === "output_contract") {
    const flat = raw.rows ?? (raw.clusters ?? []).flatMap((c) =>
      (c.demand ?? []).map((d) => ({
        ...d,
        keyword: d.keyword ?? c.entity?.preferred_term ?? c.cluster_id,
        cluster: c.cluster_id ?? null,
        keyword_difficulty: d.keyword_difficulty ?? c.difficulty?.kd,
      })));
    for (const d of flat) {
      const locale = d.locale ?? null;
      const marketKey = locale ? String(locale).split("/")[0] : d.market;
      rows.push({
        keyword: d.keyword,
        market: resolveMarket(marketKey) ?? String(marketKey ?? "unknown").toLowerCase(),
        rawValue: d.volume ?? null,
        status: d.status ?? null,
        source: d.source ?? null,
        retrieved_at: d.retrieved_at ?? d.provenance?.retrieved_at ?? null,
        language_code: d.language_code ?? null,
        locale,
        cluster: d.cluster ?? null,
        competition: d.competition,
        keyword_difficulty: d.keyword_difficulty,
        cross_check: d.cross_check,
        confidence: d.confidence,
      });
    }
    return rows;
  }
  return rows;
}

// ---------------------------------------------------------------------------
// V1 — NULL IS NOT ZERO. The type gate. Catches the actual bug.
// ---------------------------------------------------------------------------

/**
 * V1 would have prevented the entire incident, independent of any knowledge of
 * Ayurveda. It is first because it is the only check that does not depend on us already
 * SUSPECTING something. But it is not "the" defence — it is the first of three: V1
 * alone is defeated by a row that never arrives (V9) and blind to a row attributed to
 * the wrong keyword (V10).
 * @param {Row[]} rows
 * @param {string} shape
 */
export function checkV1(rows, shape) {
  const findings = [];

  if (shape === "legacy_lossy") {
    findings.push(
      `THE ARTIFACT HAS NO TYPE MODEL AT ALL. All ${rows.length} rows are bare integers with no ` +
      `status field. The four-state model (measured / no_data / not_returned / not_queried) is ` +
      `not violated here — it is ABSENT.`,
    );
    findings.push(
      `THE FILE NAMED "raw" IS NOT RAW. It is a pre-digested {keyword: number} map. The API's ` +
      `nulls, competition, cpc, monthly_searches, task cost and request payload were discarded at ` +
      `write time — so the null->0 coercion is UNDETECTABLE BY INSPECTION OF OUR OWN EVIDENCE. ` +
      `This is why byte-for-byte response capture is mandatory: not filing hygiene, but because a ` +
      `lossy evidence layer made a wrong number unfalsifiable.`,
    );
    const zeros = rows.filter((r) => r.rawValue === 0);
    if (zeros.length) {
      const byKw = new Map();
      for (const z of zeros) {
        if (!byKw.has(z.keyword)) byKw.set(z.keyword, []);
        byKw.get(z.keyword).push(z.market);
      }
      findings.push(
        `${zeros.length} rows (${byKw.size} distinct keywords) record the integer 0. ` +
        `0 IS NOT A VALUE ON THE MEASURED BUCKET LADDER — the ladder's smallest rung is ${LADDER_MIN} ` +
        `(10, 20, 40, 50, 70, 90, 110 ... measured across 160+ of our own keywords). A 0 in an ` +
        `artifact with no status field is a coerced null until proven otherwise:`,
      );
      for (const [kw, markets] of byKw) findings.push(`      - "${kw}" = 0 in [${markets.join(", ")}]`);
      findings.push(
        `   VERIFIED, same endpoint, same day: DataForSEO NEVER RETURNED 0 for shilajit. It returned ` +
        `null. Labs keyword_overview returns shilajit US = 201,000 at KD 12 — the highest-value ` +
        `opportunity in the entire set, recorded here as nonexistent. shatavari null -> 14,800. ` +
        `gokshura null -> 1,900. The zero was manufactured inside our own capture layer.`,
      );
    }
    return check("V1", "NULL IS NOT ZERO — the four-state type gate", "FAIL", findings);
  }

  // Typed artifact: enforce the state machine row by row via the Volume type itself.
  for (const r of rows) {
    if (r.status === null) {
      findings.push(`"${r.keyword}" (${r.market}): no status field — every row must be exactly one of ` +
                    `${Object.values(STATUS).join(" / ")}`);
      continue;
    }
    try {
      // Constructing a Volume IS the check: the type refuses null->0 and refuses a
      // measured row with no number. We do not re-implement the rule here.
      new Volume({ value: r.rawValue, status: /** @type {any} */ (r.status), keyword: r.keyword });
    } catch (e) {
      findings.push(`"${r.keyword}" (${r.market}): ${e.message}`);
    }
    if (!isMeasuredStatus(r.status) && r.rawValue === 0) {
      findings.push(`"${r.keyword}" (${r.market}): status "${r.status}" with value 0 — THE COERCION ITSELF.`);
    }
  }
  return check("V1", "NULL IS NOT ZERO — the four-state type gate", findings.length ? "FAIL" : "PASS", findings);
}

// ---------------------------------------------------------------------------
// G3-PRE #2 — LOCALE x SCRIPT PARITY (failure #3)
// ---------------------------------------------------------------------------

/**
 * PARITY, NOT PRESENCE. The draft's version passed on 5,000 `en` rows + 1 `hi-Deva` row.
 *
 * The hard-block half rests ONLY on the Devanagari Unicode test — a pure script check
 * with no judgement and no unratified list. The Hinglish half is REPORT-ONLY (G5a),
 * because the pattern list is unratified by any Hindi speaker (Q9 open), and blocking on
 * an unratified list is not rigour — it enforces our guess. Same reasoning as V3's
 * unsourced floors.
 *
 * The stakes of the report-only half are not small: `ashwagandha ke fayde` (33,100,
 * Hinglish) OUTRANKS अश्वगंधा (22,200, Devanagari), and `shilajit ke fayde` (27,100)
 * beats शिलाजीत (9,900) by 2.7x. A "we'll add Devanagari" fix captures the SMALLER half
 * of Hindi demand and declares the locale problem solved.
 * @param {Row[]} rows
 */
export function checkLocaleParity(rows) {
  const findings = [];
  const reportOnly = [];
  const markets = [...new Set(rows.map((r) => r.market))];

  for (const market of markets) {
    const spec = LOCALE_MATRIX[market];
    if (!spec) {
      findings.push(`market "${market}" is not in the committed locale matrix (${Object.keys(LOCALE_MATRIX).join(", ")}) — ` +
                    `an unknown market cannot be checked for parity, and an uncheckable market does not pass`);
      continue;
    }
    const terms = rows.filter((r) => r.market === market).map((r) => r.keyword);
    const present = new Set(terms.map(registerOf));
    const counts = {};
    for (const t of terms) counts[registerOf(t)] = (counts[registerOf(t)] ?? 0) + 1;

    for (const req of spec.required_registers) {
      const n = counts[req] ?? 0;
      const hard = HARD_BLOCK_REGISTERS.includes(req);
      if (n === 0) {
        const msg = `market "${market}" (location_code ${spec.location_code}) requires register "${req}" and has ZERO rows in it ` +
                    `(present: ${[...present].map((p) => `${p}=${counts[p]}`).join(", ")})`;
        if (hard) {
          findings.push(msg);
          if (req === "hi-Deva") {
            findings.push(`   India is not an English-language market. The failed pull requested India in language_code=en ` +
                          `ONLY and called the result "India". Devanagari demand is invisible here: अश्वगंधा 22,200 · हल्दी 18,100 · ` +
                          `आंवला 8,100 · त्रिफला 8,100 — none of it in this artifact.`);
          }
        } else {
          reportOnly.push(`${msg} [REPORT-ONLY: the Hinglish pattern list is unratified — Q9]`);
        }
      }
    }
    // Parity, not presence: a token handful of rows in a required register is not coverage.
    for (const req of spec.required_registers) {
      const n = counts[req] ?? 0;
      const max = Math.max(...Object.values(counts), 0);
      if (n > 0 && max > 0 && n < max * 0.1) {
        const msg = `market "${market}": register "${req}" has only ${n} rows against ${max} in the dominant register ` +
                    `— that is presence, not PARITY. A token row is how "5,000 en + 1 hi-Deva" passed the draft's gate.`;
        (HARD_BLOCK_REGISTERS.includes(req) ? findings : reportOnly).push(msg);
      }
    }
  }

  const state = findings.length ? "FAIL" : "PASS";
  const r = check("A2", "G3-PRE #2 — LOCALE x SCRIPT PARITY (India = en + Devanagari + Hinglish)", state, findings);
  if (reportOnly.length) r.note = `REPORT-ONLY (G5a, Q9 open):\n      ` + reportOnly.join("\n      ");
  return r;
}

// ---------------------------------------------------------------------------
// G3-PRE #3 — THE ZERO CHALLENGE. ★ The single most important assertion. ★
// ---------------------------------------------------------------------------

/**
 * THE FIX, and the reason it is written this way.
 *
 * The draft read: "volume == 0 AND seed IN S2 corpus". shilajit, shatavari and gokshura
 * are ONTOLOGY entities (K1) — Sanskrit drug names that a corpus mined from customer
 * reviews and forums NEVER QUOTES, because the audience says "energy booster". THE
 * CONJUNCT EXCLUDED THE EXACT CLASS THAT FAILED. Traced end to end, the draft's gate
 * went GREEN on our real failure:
 *     #1 seed provenance -> PASS (origin: ontology)
 *     #2 locale x script -> PASS (US/en is a required row)
 *     #3 zero challenge  -> DOES NOT FIRE
 *     #4 row provenance  -> PASS
 *     #5 no blind sums   -> PERMITS THE SUM
 * Failure #2 recurring verbatim, through the gate built to stop it.
 *
 * So the rule is now: ANY seed row whose status != "measured" FAILS, unless a committed
 * NAMED-HUMAN waiver names that row. No corpus conjunct. No entity list. No threshold.
 * A human's name, or it blocks.
 * @param {Row[]} rows
 * @param {Set<string>} seedSet
 * @param {any} waivers
 */
export function checkZeroChallenge(rows, seedSet, waivers) {
  const findings = [];
  const waived = new Set((waivers?.waivers ?? []).filter((w) => w.named_human && w.row).map((w) => w.row));

  for (const r of rows) {
    const isSeed = seedSet.size === 0 || seedSet.has(r.keyword);
    if (!isSeed) continue;
    const rowId = `${r.market}:${r.keyword}`;
    if (waived.has(rowId)) continue;

    // Untyped artifact: status is unknowable, so it is NOT "measured" — it is unknown.
    // An unknown status cannot clear an assertion that requires "measured".
    if (r.status === null) {
      if (r.rawValue === 0) {
        findings.push(`"${r.keyword}" (${r.market}) = 0 with NO status. Status is not "measured" — it is UNKNOWABLE, ` +
                      `and an unknowable status cannot clear an assertion that requires "measured".`);
      }
      continue; // the blanket "no status" finding is V1's; do not duplicate 160x here
    }
    if (!isMeasuredStatus(r.status)) {
      findings.push(`"${r.keyword}" (${r.market}) has status "${r.status}" and is a SEED — a seed row that was never ` +
                    `measured may not pass. Resolve it (V2) or commit a NAMED-HUMAN waiver.`);
    }
  }
  return check("A3", "G3-PRE #3 — ZERO CHALLENGE (any non-measured seed row blocks)", findings.length ? "FAIL" : "PASS", findings);
}

// ---------------------------------------------------------------------------
// V4 — OUTLIER / CONTAMINATION / DATA-FAULT DETECTION
// ---------------------------------------------------------------------------

/**
 * V4-FAULT — BLOCKING. Two detectors, NEITHER of which needs a threshold or a list:
 *
 *  (a) CROSS-MARKET ZERO-SET IDENTITY — a pure set-identity test, no threshold at all.
 *      If two INDEPENDENT markets produce byte-identical zero sets, the zeros describe
 *      our CAPTURE, not the markets. Real markets do not agree to the letter on which
 *      seven terms nobody searches. This is the strongest signal in the artifact, it is
 *      free, and nobody looked.
 *
 *  (b) CROSS-MARKET ASYMMETRY — the commission's signal: shilajit US=0 while India
 *      =246,000. A hard 0 next to a measured presence elsewhere is a DATA FAULT, not a
 *      finding. Only checkable because we hold both markets: the artifact contained the
 *      evidence of its own corruption all along.
 *
 * Both are blocking precisely BECAUSE they need no judgement. Contrast checkV4Outliers
 * below, which needs plenty — and is therefore not blocking on its own.
 * @param {Row[]} rows
 */
export function checkV4(rows) {
  const findings = [];
  const markets = [...new Set(rows.map((r) => r.market))];

  // (a) zero-set identity — over SUSPECT zeros only.
  //
  // A `measured` 0 is a CLAIM THE ENDPOINT MADE: it returned a row and the row said 0.
  // An UNTYPED or NON-MEASURED 0 is a coercion artifact — nothing said 0; our capture
  // layer wrote it. Only the latter is evidence of the disease, and the distinction is
  // the whole four-state model applied to this check.
  //
  // It also stops a false positive that would otherwise wreck the rule: a genuinely
  // nonsense term ("zzqx nonexistent herb term") is legitimately 0 in EVERY market, so
  // identical zero sets across markets would be expected, not suspicious. Gibberish is
  // gibberish everywhere. Flagging that would be crying wolf on the one case where a
  // hard zero is the honest answer.
  const suspect = (r) => r.rawValue === 0 && (r.status === null || !isMeasuredStatus(r.status));
  const zeroSets = new Map();
  for (const m of markets) {
    zeroSets.set(m, new Set(rows.filter((r) => r.market === m && suspect(r)).map((r) => r.keyword)));
  }
  for (let i = 0; i < markets.length; i++) {
    for (let j = i + 1; j < markets.length; j++) {
      const a = zeroSets.get(markets[i]), b = zeroSets.get(markets[j]);
      if (a.size === 0 || b.size === 0) continue;
      const same = a.size === b.size && [...a].every((k) => b.has(k));
      if (same) {
        findings.push(
          `DATA FAULT — IDENTICAL ZERO SETS across independent markets "${markets[i]}" and "${markets[j]}": ` +
          `both report exactly the same ${a.size} terms as zero {${[...a].join(", ")}}. ` +
          `Two independent markets cannot plausibly agree to the letter on which terms nobody searches. ` +
          `THE ZEROS DESCRIBE OUR CAPTURE LAYER, NOT THE MARKETS. This needs no threshold and no prior list — ` +
          `it is a set-identity test, and the artifact contained the evidence of its own corruption all along.`,
        );
      }
    }
  }

  // (b) cross-market asymmetry
  const byKw = new Map();
  for (const r of rows) {
    if (!byKw.has(r.keyword)) byKw.set(r.keyword, []);
    byKw.get(r.keyword).push(r);
  }
  for (const [kw, rs] of byKw) {
    if (rs.length < 2) continue;
    const zero = rs.filter((r) => r.rawValue === 0 || (r.status !== null && !isMeasuredStatus(r.status)));
    const present = rs.filter((r) => typeof r.rawValue === "number" && r.rawValue >= LADDER_MIN);
    if (zero.length && present.length) {
      const p = present.map((r) => `${r.market}=${r.rawValue}`).join(", ");
      const z = zero.map((r) => r.market).join(", ");
      findings.push(
        `DATA FAULT — CROSS-MARKET ASYMMETRY on "${kw}": zero/non-measured in [${z}] while measured in [${p}]. ` +
        `THE ASYMMETRY IS ITSELF THE SIGNAL — a term with real demand in one market does not vanish to a hard 0 ` +
        `in another; it degrades. A hard 0 is not even on the bucket ladder (min rung ${LADDER_MIN}).`,
      );
    }
  }

  return check("V4", "DATA-FAULT DETECTION (zero-set identity · cross-market asymmetry)", findings.length ? "FAIL" : "PASS", findings);
}

/**
 * V4-OUTLIER — CONTAMINATION. Report-only unless the discriminating fields are present.
 *
 * ⚠️ I BUILT THIS WRONG THE FIRST TIME AND THE OUTPUT CAUGHT ME. A bare "volume > 10x
 * median" flag over this artifact fired 26 times — on ashwagandha (673,000), moringa,
 * neem, triphala, brahmi — every one of them REAL head-term demand. That is a
 * false-positive machine, and the research doc names this exact hazard when it rejects
 * the "duplicate volume => grouping" rule: such a check flags arithmetic that is fine
 * and TRAINS THE TEAM TO CLICK THROUGH WARNINGS. A lint that cries wolf gets disabled,
 * and a disabled lint protects nothing. Two bugs were in that version:
 *
 *   1. MARKET median, not CLUSTER median. A market mixing head terms with long-tails has
 *      a median of 720, so every genuine head term is "10x the median". Of course it is —
 *      that is what a head term IS. The spec says CLUSTER median and the distinction is
 *      load-bearing, not pedantic.
 *   2. The spec's CONJUNCTION was dropped. Contamination is not "high volume". It is
 *      "high volume AND competition LOW AND keyword_difficulty ~ 0" — a term with huge
 *      demand that NOBODY IS COMPETING FOR, which is not how real demand behaves. That
 *      conjunction is the ONLY thing that separates ojas (1,500,000/mo, competition LOW,
 *      KD 0 — a common Indian personal/brand name) from ashwagandha (673,000, HIGH
 *      competition — a real herb). Volume alone cannot tell them apart, and pretending
 *      otherwise buries the one true signal under 25 false ones.
 *
 * AND HERE IS THE FINDING THAT MATTERS: on the real artifact this check CANNOT RUN,
 * because `competition` and `keyword_difficulty` were discarded at write time. The ojas
 * contamination is NOT detectable in demand-raw.json by any means — for the same reason
 * the shilajit null is not: the lossy capture layer threw away the evidence that would
 * falsify it. This is the third distinct thing that file made unfalsifiable.
 * @param {Row[]} rows
 * @param {any} artifactRaw
 */
export function checkV4Outliers(rows, artifactRaw) {
  const hasDiscriminators = JSON.stringify(artifactRaw ?? {}).match(/"(competition|keyword_difficulty)"/) !== null;
  const markets = [...new Set(rows.map((r) => r.market))];
  const summary = [];

  for (const m of markets) {
    const vals = rows.filter((r) => r.market === m && typeof r.rawValue === "number" && r.rawValue > 0).map((r) => r.rawValue).sort((x, y) => x - y);
    if (vals.length < 5) continue;
    const median = vals[Math.floor(vals.length / 2)];
    const over = rows.filter((r) => r.market === m && typeof r.rawValue === "number" && r.rawValue > median * 10);
    if (over.length) {
      const top = [...over].sort((a, b) => b.rawValue - a.rawValue).slice(0, 3).map((r) => `${r.keyword}=${r.rawValue}`);
      summary.push(`${m}: ${over.length} terms exceed 10x the MARKET median (${median}) — top: ${top.join(", ")}`);
    }
  }

  if (!hasDiscriminators) {
    return check("V4b", "CONTAMINATION (high volume AND competition LOW AND KD~0)", "CANNOT_RUN", [
      `The artifact carries NO "competition" and NO "keyword_difficulty" fields, so the contamination ` +
      `conjunction cannot be evaluated. Volume alone CANNOT distinguish contamination from real demand: ` +
      `ojas India 1,500,000 (competition LOW, KD 0 — a common Indian personal/brand name, which would have ` +
      `made "concepts" the site's top cluster and driven the entire IA off a homonym) and ashwagandha ` +
      `673,000 (competition HIGH — a real herb) are indistinguishable by magnitude.`,
      `THE OJAS CONTAMINATION IS THEREFORE NOT DETECTABLE IN THIS ARTIFACT AT ALL — the lossy capture layer ` +
      `discarded the two fields that identify it, exactly as it discarded the nulls that identify the shilajit ` +
      `fault. A check that cannot run FAILS.`,
      ...(summary.length ? [`(Raw 10x-median spread, NOT a fault signal by itself: ${summary.join(" · ")})`] : []),
    ]);
  }

  const findings = [];
  const flat = rows.filter((r) => typeof r.rawValue === "number");
  for (const r of flat) {
    const cluster = r.cluster ?? null;
    const peers = flat.filter((p) => (cluster ? p.cluster === cluster : p.market === r.market) && p.rawValue > 0).map((p) => p.rawValue).sort((a, b) => a - b);
    if (peers.length < 5) continue;
    const median = peers[Math.floor(peers.length / 2)];
    const lowComp = r.competition !== undefined && String(r.competition).toUpperCase() === "LOW";
    const lowKd = r.keyword_difficulty !== undefined && Number(r.keyword_difficulty) <= 5;
    if (r.rawValue > median * 10 && lowComp && lowKd) {
      findings.push(
        `CONTAMINATION — "${r.keyword}" (${r.market}) = ${r.rawValue} is >10x the ${cluster ? `cluster "${cluster}"` : "market"} ` +
        `median (${median}) AND competition=LOW AND keyword_difficulty=${r.keyword_difficulty}. Huge demand that nobody ` +
        `competes for is not demand — it is a homonym or a brand name. Requires V5 grounding (>=2 independent citations).`,
      );
    }
  }
  return check("V4b", "CONTAMINATION (high volume AND competition LOW AND KD~0)", findings.length ? "FAIL" : "PASS", findings, {
    note: summary.length ? `10x-median spread (informational, not a fault): ${summary.join(" · ")}` : undefined,
  });
}

// ---------------------------------------------------------------------------
// V3 — HIGH-PRIOR (REPORT-ONLY until Q1 closes)
// ---------------------------------------------------------------------------

/**
 * REPORT-ONLY, deliberately, and this is NOT a weakened gate (CLAUDE.md rule g).
 * The floors are unsourced (Q1 open) and a fabricated floor is the original sin one
 * level up: an authoritative-looking number with nothing under it. Shipping V3
 * report-only WITH A REASON is more rigorous than shipping it with invented floors.
 *
 * It costs us nothing, because assertion #3 hard-blocks EVERY non-measured seed row
 * regardless of any list. V3 is the redundant second net; the type model is the method.
 * A high-prior list only catches entities we already suspect — V1 catches the ones we
 * do not.
 * @param {Row[]} rows
 */
export function checkV3(rows) {
  const findings = [];
  for (const r of rows) {
    const toks = tokens(r.keyword);
    const hp = HIGH_PRIOR_ENTITIES.find((e) => findFormSpans(toks, e).length > 0);
    if (!hp) continue;
    if (r.rawValue === 0 || (r.status !== null && !isMeasuredStatus(r.status))) {
      findings.push(`HIGH-PRIOR "${hp}" via "${r.keyword}" (${r.market}) is ${r.rawValue === 0 ? "0" : r.status} — ` +
                    `cannot plausibly be near-zero in a major market.`);
    }
  }
  return check("V3", "HIGH-PRIOR ENTITY PLAUSIBILITY", findings.length ? "REPORT_ONLY" : "PASS", findings, {
    blocking: false,
    note: "REPORT-ONLY until Q1 closes (floors unsourced — a fabricated floor is the original sin one level up). " +
          "Assertion #3 hard-blocks these same rows anyway.",
  });
}

// ---------------------------------------------------------------------------
// V7 — PROVENANCE COMPLETENESS / G3-PRE #4 — ROW PROVENANCE
// ---------------------------------------------------------------------------

/**
 * "If a number cannot say where it came from, it does not ship."
 * This is the check that makes demand-raw.json's failure mode structurally impossible.
 * @param {Row[]} rows
 * @param {string} shape
 */
export function checkV7(rows, shape) {
  const findings = [];
  if (shape === "legacy_lossy") {
    findings.push(
      `NOT ONE of the ${rows.length} numbers in this artifact can name its endpoint, request payload, ` +
      `response file, timestamp, cost, locale, status or confidence. Every number here is unprovenanced.`,
    );
    findings.push(
      `FAILURE #4 — MODELLED ESTIMATE AS MEASURED FACT. Google does not publish per-keyword search ` +
      `volumes; commercial tools MODEL them and diverge (GKP roughly accurate in ~45% of cases vs ` +
      `Ahrefs ~60%, benchmarked against GSC impressions). Every figure here is a bucketed model quoted ` +
      `as ground truth. There is no provenance field in which to say so, and no type to enforce it.`,
    );
    return check("V7", "PROVENANCE COMPLETENESS (V7 / G3-PRE #4)", "FAIL", findings);
  }
  for (const r of rows) {
    const missing = ["source", "retrieved_at", "locale", "language_code"].filter((f) => !r[f]);
    if (missing.length && (r.status === null || isMeasuredStatus(r.status))) {
      findings.push(`"${r.keyword}" (${r.market}): missing ${missing.join(", ")}`);
    }
  }
  return check("V7", "PROVENANCE COMPLETENESS (V7 / G3-PRE #4)", findings.length ? "FAIL" : "PASS", findings);
}

// ---------------------------------------------------------------------------
// V9 / V10 — request/response reconciliation and key-join. RUNTIME, authoritative.
// ---------------------------------------------------------------------------

/**
 * Pull (requested[], returned[]) out of a committed DataForSEO response.
 * @param {any} res
 */
export function extractPair(res) {
  const task = res?.tasks?.[0];
  if (!task) return null;
  const requested = task.data?.keywords ?? null;
  const result = task.result ?? [];
  let returned = null;
  if (result.length && Array.isArray(result[0]?.items)) {
    returned = result[0].items.map((i) => i.keyword);           // Labs keyword_overview
  } else if (result.length && result[0]?.keyword !== undefined) {
    returned = result.map((r) => r.keyword);                    // google_ads search_volume
  }
  return requested && returned ? { requested, returned, endpoint: task.data?.se ?? "unknown", cost: res.cost } : null;
}

/**
 * V9 — THE ROW THAT NEVER CAME BACK.
 *
 * Verified live: Labs keyword_overview requested 3, returned 2, status "Ok.", and the
 * cost DROPPED to match — you are billed per RETURNED item, so even the invoice conceals
 * the loss. Build {kw: vol} from that response, look up the missing key with the idiom
 * every engineer reaches for — d.get(kw, 0) — and you get 0. That is the original
 * incident arriving through a door the null-check left wide open.
 *
 * AND IT IS INSIDE OUR OWN CURE: the remedy for null rows is "re-query Labs" — which
 * routes every one of our nulls through the endpoint that silently drops rows. A keyword
 * null in google_ads AND unknown to Labs comes back from the repair as NOTHING AT ALL,
 * and nothing, unreconciled, becomes zero. The cure re-creates the disease. V9 must
 * therefore run INSIDE the null-resolution loop, not merely after it.
 * @param {{file: string, pair: {requested: string[], returned: string[]}}[]} pairs
 */
export function checkV9(pairs) {
  const findings = [];
  if (!pairs.length) {
    return check("V9", "REQUEST/RESPONSE SET RECONCILIATION", "CANNOT_RUN", [
      "No committed request/response pairs found — so set reconciliation CANNOT RUN.",
      "A check that cannot run FAILS. It never passes and it never skips: 'we could not look' and " +
      "'we looked and it was fine' are different facts, and collapsing them is the whole disease " +
      "(null->0, absent->0, unverifiable->fabricated). Commit the raw API bytes (G12).",
    ]);
  }
  for (const { file, pair } of pairs) {
    const req = new Set(pair.requested), ret = new Set(pair.returned);
    const unrequested = [...ret].filter((k) => !req.has(k));
    if (unrequested.length) {
      findings.push(`${file}: response contains rows we never requested {${unrequested.join(", ")}} — wrong response, hard fail`);
    }
    const dropped = [...req].filter((k) => !ret.has(k));
    if (dropped.length) {
      findings.push(
        `${file}: requested ${req.size}, returned ${ret.size} — ${dropped.length} ROW(S) SILENTLY DROPPED: ` +
        `{${dropped.join(", ")}}. Each MUST be emitted as {volume: null, status: "not_returned"} — ` +
        `NEVER omitted, NEVER 0. A row that never arrived cannot be "no_data", because nothing said so.`,
      );
    }
  }
  return check("V9", "REQUEST/RESPONSE SET RECONCILIATION", findings.length ? "FAIL" : "PASS", findings);
}

/**
 * V10 — KEY-JOIN ONLY, NEVER POSITIONAL.
 *
 * WHY THIS OUTRANKS THE BUG THAT STARTED ALL THIS: "shilajit = 0" was IMPLAUSIBLE —
 * GPT-5 caught it by knowing Ayurveda. A positional misjoin produces PLAUSIBLE numbers
 * against PLAUSIBLE keywords. It is silent, total, and undetectable by inspection: every
 * row well-formed, non-null, reasonable. It would pass V1, V3, V4, V8 and a human read.
 *
 * Verified live: the two endpoints have OPPOSITE ordering contracts — Labs returns
 * ALPHABETIZED, google_ads returns REQUEST ORDER — and neither documents this where you
 * would read it. With 56 keywords sorted alphabetically against a thematically-ordered
 * request, essentially EVERY row is wrong and nothing in the artifact says so.
 *
 * NOTE THE RULE IS WRITTEN TO SURVIVE THE CONTRACT CHANGING: "key-join only" is correct
 * under ANY ordering, including one that changes tomorrow. A rule that said "reverse the
 * alphabetization" would be a time bomb. These orderings are behaviours observed on our
 * account on one day, not contracts DataForSEO documents — a documented observation is a
 * fact about a day, not a law.
 * @param {{file: string, pair: {requested: string[], returned: string[]}}[]} pairs
 */
export function checkV10(pairs) {
  const findings = [];
  if (!pairs.length) {
    return check("V10", "KEY-JOIN ONLY — never positional", "CANNOT_RUN", [
      "No committed request/response pairs found — the positional-misjoin canary CANNOT RUN.",
      "A check that cannot run FAILS.",
    ]);
  }
  for (const { file, pair } of pairs) {
    const { requested, returned } = pair;
    const alphabetized = returned.length > 1 && returned.every((k, i) => i === 0 || returned[i - 1].localeCompare(k) <= 0);
    const orderDiffers = requested.length === returned.length && requested.some((k, i) => k !== returned[i]);
    if (alphabetized && orderDiffers) {
      const misjoined = requested.filter((k, i) => returned[i] !== undefined && returned[i] !== k).length;
      findings.push(
        `${file}: RESPONSE ORDER != REQUEST ORDER (response is alphabetized). A positional join ` +
        `(zip(seeds, items) / items[i]) would misattribute ${misjoined} of ${requested.length} rows — ` +
        `e.g. requested[0]="${requested[0]}" but returned[0]="${returned[0]}".`,
      );
      findings.push(
        `   This is INFORMATIONAL for the artifact (it proves the hazard is live on this endpoint), ` +
        `but the gate on it is structural: every volume must be key-joined from item.keyword read out ` +
        `of the response itself. The canary test asserts the JOIN, not the values — because every value ` +
        `here is well-formed and plausible, which is exactly what makes a misjoin undetectable.`,
      );
    }
    const unknown = returned.filter((k) => !requested.includes(k));
    if (unknown.length) findings.push(`${file}: returned keys not in the request set: {${unknown.join(", ")}} — round-trip assertion failed`);
  }
  // Ordering hazard alone is not a FAIL of the artifact; an unrequested key IS.
  const hard = findings.filter((f) => f.includes("round-trip assertion failed"));
  return check("V10", "KEY-JOIN ONLY — never positional", hard.length ? "FAIL" : "PASS", findings, {
    note: findings.length && !hard.length ? "Ordering hazard OBSERVED and live on this endpoint; artifact join not proven positional." : undefined,
  });
}

// ---------------------------------------------------------------------------
// V8 — bucket quantization / fake precision
// ---------------------------------------------------------------------------

/**
 * "herbs 2.57M/mo" was fake precision to SIX significant figures, built from a 47-value
 * ladder. Even had every seed been real and every null resolved, that number was never
 * knowable to better than ~+/-11% per term. The old artifact was wrong twice over: wrong
 * inputs AND a precision claim the instrument cannot support.
 * @param {any} raw
 * @param {Row[]} rows
 */
export function checkV8(raw, rows) {
  const findings = [];
  const aggregates = [];
  const walk = (o, path) => {
    if (!o || typeof o !== "object") return;
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === "number" && /total|sum|cluster_volume|demand_total/i.test(k)) aggregates.push({ path: `${path}.${k}`, v });
      else if (typeof v === "object") walk(v, `${path}.${k}`);
    }
  };
  walk(raw, "$");
  for (const a of aggregates) {
    if (significantFiguresOf(a.v) > MAX_SIGNIFICANT_FIGURES) {
      findings.push(`${a.path} = ${a.v} is stated to ${significantFiguresOf(a.v)} significant figures. Every volume we ` +
                    `hold is a BUCKET LABEL ~+/-11% wide off a 47-value geometric ladder (ratio ~1.22). ` +
                    `Report <=${MAX_SIGNIFICANT_FIGURES} s.f. (~${toSignificantFigures(a.v)}) and always with its band.`);
    }
  }
  return check("V8", "BUCKET QUANTIZATION — every volume is a label, not a count", findings.length ? "FAIL" : "PASS", findings, {
    note: `${rows.length} rows; volumes are bucket labels, never measurements. Cluster sums inherit ~+/-11% per term.`,
  });
}

// ---------------------------------------------------------------------------
// V2 / V5 / V6 — resolution, grounding, cross-endpoint
// ---------------------------------------------------------------------------

/** @param {Row[]} rows @param {string} shape */
export function checkV2(rows, shape) {
  if (shape === "legacy_lossy") {
    return check("V2", "NULL RESOLUTION — an unfinished query, not a finding", "CANNOT_RUN", [
      "The artifact has no status field, so no row can even be identified as needing resolution.",
      "Every null is an UNFINISHED QUERY: a null from google_ads/search_volume is a statement about " +
      "GOOGLE ADS' DATA COVERAGE, not about the world — and the second endpoint frequently knows the " +
      "answer (shilajit null -> Labs 201,000). The stage is not complete while a null remains unresolved.",
      "A check that cannot run FAILS.",
    ]);
  }
  const findings = rows
    .filter((r) => r.status === STATUS.NO_DATA || r.status === STATUS.NOT_RETURNED)
    .map((r) => `"${r.keyword}" (${r.market}) exits with status "${r.status}" and no logged resolution attempt`);
  return check("V2", "NULL RESOLUTION — an unfinished query, not a finding", findings.length ? "FAIL" : "PASS", findings);
}

/**
 * V5 keys off V4 DATA FAULTS only — never off the report-only outlier spread.
 * A grounding requirement that fires on 26 false positives is not rigour; it is how a
 * gate gets routed around. (It also has a cost: every flag is a live Perplexity call.)
 * @param {CheckResult[]} priorFlags @param {any} grounding
 */
export function checkV5(priorFlags, grounding) {
  const flagged = priorFlags.filter((c) => c.id === "V4" && c.state === "FAIL").flatMap((c) => c.findings);
  if (!flagged.length) return check("V5", "PERPLEXITY FACT-GROUNDING on every anomaly", "PASS", []);
  if (!grounding) {
    return check("V5", "PERPLEXITY FACT-GROUNDING on every anomaly", "FAIL", [
      `${flagged.length} V4 DATA FAULT(S) were raised and NO grounding.json was supplied — every flag must carry ` +
      `>=2 independent citations before a human sees the number.`,
      `Note the asymmetry that governs V5: a POSITIVE finding is evidence; a NEGATIVE finding ` +
      `("unverifiable"/"fabricated") is a NULL — a statement about RETRIEVAL, not about the world — and is ` +
      `NEVER blocking on its own. Our own fact-checker once accused this repo of fabricating four statistics ` +
      `that were verbatim on the public page it cited as its source; a curl|grep disproved it in one command. ` +
      `"Perplexity could not find it" is a null, not a zero.`,
    ]);
  }
  return check("V5", "PERPLEXITY FACT-GROUNDING on every anomaly", "PASS", []);
}

/**
 * V6 — CROSS-ENDPOINT AGREEMENT. Every priority-set row must carry a `cross_check` from
 * a SECOND, INDEPENDENT endpoint.
 *
 * The priority set is EVERY entity in the ontology — no sampling, no judgement. The
 * reasoning is arithmetic, not taste: the full pull is ~$11 against ~$50 credit, so any
 * selection rule costs more to design and defend than querying everything, and every
 * selection rule is a place for an agent to quietly decide an entity is unimportant.
 * THAT IS HOW shilajit BECAME A ZERO. When the complete population is affordable,
 * sampling is not rigour — it is an unforced opportunity to be wrong.
 *
 * Why a second source is MANDATORY rather than thorough: without one, a null is NOT
 * INTERPRETABLE AT ALL. google_ads returns the identical representation — `null` — for a
 * 201,000/mo head term (shilajit) and for "zzqx nonexistent herb term", a string that is
 * not a query at all. Verified in one call, res_14. A bare null carries ZERO information
 * about the world, and any rule that reads meaning into one is reading noise.
 * @param {Row[]} rows @param {{file:string,pair:any}[]} pairs @param {string} shape
 */
export function checkV6(rows, pairs, shape) {
  if (shape === "legacy_lossy") {
    return check("V6", "CROSS-ENDPOINT AGREEMENT (both endpoints, every priority-set keyword)", "CANNOT_RUN", [
      "The artifact has no per-row endpoint attribution and no cross_check field — cross-endpoint agreement CANNOT RUN.",
      "This was never a budget question: the full ontology across BOTH endpoints costs ~$11 against ~$50 credit. " +
      "The rigorous method costs about $11; the sloppy one that produced this file cost $0.18. And the flat-rate " +
      "pricing means a 1,000-keyword task costs the same as a 1-keyword task — there was never a cost reason to " +
      "skimp on the seed set.",
      "Without a second source a null is NOT INTERPRETABLE AT ALL: google_ads gives the identical representation " +
      "to a 201,000/mo head term and to a string that is not a query. A check that cannot run FAILS.",
    ]);
  }
  const findings = [];
  for (const r of rows) {
    if (r.status !== null && !isMeasuredStatus(r.status) && r.cross_check === undefined) {
      findings.push(`"${r.keyword}" (${r.locale ?? r.market}) is "${r.status}" with NO cross_check — a null is an ` +
                    `UNFINISHED QUERY, not a finding. The second endpoint frequently knows the answer ` +
                    `(shilajit null -> Labs 201,000 US at KD 12).`);
      continue;
    }
    if (!isMeasuredStatus(r.status ?? "")) continue;
    if (r.cross_check === undefined) {
      findings.push(`"${r.keyword}" (${r.locale ?? r.market}) = ${r.rawValue} was never cross-checked against a second endpoint.`);
      continue;
    }
    const cc = r.cross_check;
    if (typeof cc?.volume === "number" && typeof r.rawValue === "number" && cc.volume > 0 && r.rawValue > 0) {
      const ratio = Math.max(r.rawValue, cc.volume) / Math.min(r.rawValue, cc.volume);
      if (ratio > 2 && r.confidence !== "low") {
        findings.push(`"${r.keyword}" (${r.locale ?? r.market}): sources disagree ${ratio.toFixed(1)}x ` +
                      `(${r.source}=${r.rawValue} vs ${cc.endpoint}=${cc.volume}) but confidence is "${r.confidence ?? "unset"}". ` +
                      `A >2x disagreement REQUIRES confidence:"low" + V5 grounding — we have no evidence for which ` +
                      `source wins a numeric disagreement (Q2 open).`);
      }
    }
  }
  return check("V6", "CROSS-ENDPOINT AGREEMENT (both endpoints, every priority-set keyword)",
    findings.length ? "FAIL" : "PASS", findings, {
      note: pairs.length ? `${pairs.length} committed raw request/response pair(s) available for V9/V10.` : undefined,
    });
}

// ---------------------------------------------------------------------------
// Assertions 0, 7, 8, 9
// ---------------------------------------------------------------------------

/** @param {string|null} audiencePath */
export function checkEntry(audiencePath) {
  if (!audiencePath || !existsSync(audiencePath)) {
    return check("A0", "G3-PRE #0 — ENTRY (S2 audience dossier exists, verbatim section non-empty)", "FAIL", [
      `No audience dossier${audiencePath ? ` at ${audiencePath}` : " supplied"}. STOP.`,
      "Seeds derive from audience UNION ontology. With no audience, seeds can only be INVENTED — which is " +
      "precisely how this failed. EVERY DOWNSTREAM FAILURE IS DOWNSTREAM OF THIS: the demand map was pulled " +
      "with no audience dossier in existence, so the seeds could only come from the agent's head.",
    ]);
  }
  const txt = readFileSync(audiencePath, "utf8");
  if (txt.trim().length === 0) {
    return check("A0", "G3-PRE #0 — ENTRY (S2 audience dossier exists, verbatim section non-empty)", "FAIL",
      [`${audiencePath} is empty — a dossier with no verbatim language supplies no legitimate seeds.`]);
  }
  return check("A0", "G3-PRE #0 — ENTRY (S2 audience dossier exists, verbatim section non-empty)", "PASS", []);
}

/** @param {any} questions */
export function checkQuestionProvenance(questions) {
  const OK = ["paa", "autocomplete", "gsc", "inbox", "forum"];
  if (!questions) {
    return check("A7", "G3-PRE #7 — QUESTION PROVENANCE", "CANNOT_RUN", [
      "No questions.json supplied — question provenance CANNOT RUN.",
      `"What are the benefits of Ashwagandha for stress?" is an agent-constructed question by the same ` +
      `mechanism as "turmeric curcumin": same plausibility, same absence of a falsification loop. That is ` +
      `FAILURE #1 VERBATIM, ONE ARTIFACT OVER — and questions drive the URL decision downstream. ` +
      `seeds.json forbids agent_constructed by name; questions.json must too.`,
    ]);
  }
  const findings = [];
  for (const q of questions.questions ?? []) {
    if (!q.source || !OK.includes(q.source)) findings.push(`question "${q.q}" has source "${q.source ?? "none"}" — must be one of ${OK.join("/")}`);
    if (!q.raw_response_hash) findings.push(`question "${q.q}" carries no raw_response_hash — unverifiable`);
  }
  return check("A7", "G3-PRE #7 — QUESTION PROVENANCE", findings.length ? "FAIL" : "PASS", findings);
}

/**
 * G3-PRE #8 — REGISTER SCREEN. D1, encoded at last.
 * Cheapest high-stakes check in the pipeline: without it, /spa-treatments/ can be
 * validated at S3, minted at S5, approved, and first objected to by a lint on the BODY
 * TEXT of a page that already has the banned word in its URL — at which point the cost
 * is a migration.
 *
 * NOTE: the KTAHV clinical lock does NOT apply to Villa Raag or KAPPL (CLAUDE.md).
 * Cross-applying it is itself a violation, so the banned list is passed in per-site and
 * this check is inert unless a register is declared.
 * @param {Row[]} rows
 * @param {string[]|null} banned
 */
export function checkRegisterScreen(rows, banned) {
  if (!banned || !banned.length) {
    return check("A8", "G3-PRE #8 — REGISTER SCREEN", "PASS", [], {
      blocking: false,
      note: "No register banned-list declared for this artifact (correct for whatisayurveda/KAPPL/Villa Raag — " +
            "the KTAHV clinical lock must NEVER be cross-applied). Declare one for KTAHV surfaces.",
    });
  }
  const findings = [];
  for (const r of rows) {
    const toks = tokens(r.keyword);
    for (const b of banned) if (toks.includes(b.toLowerCase())) findings.push(`"${r.keyword}" (${r.market}) contains banned register term "${b}"`);
  }
  return check("A8", "G3-PRE #8 — REGISTER SCREEN", findings.length ? "FAIL" : "PASS", findings);
}

/**
 * G3-PRE #9 / SX — THE CONTROL PROBE. "No control probe => the gate did not run."
 * Proves, in the same process and on the same code path, that this validator can still
 * detect the things it exists to detect. A gate that has silently stopped detecting
 * reports PASS, and a PASS from a dead gate is worse than no gate — it launders
 * "nobody checked" into "the machine approved it".
 */
export function runValidatorProbes() {
  return [
    controlProbe({
      name: "the Volume type still refuses null->0",
      known_bad: 'new Volume({value: 0, status: "no_data"})',
      detects: () => {
        try { new Volume({ value: 0, status: STATUS.NO_DATA, keyword: "probe" }); return false; }
        catch { return true; }
      },
    }),
    controlProbe({
      name: "sumMeasured still refuses to total a set containing a data fault",
      known_bad: "sum([measured 100, no_data null])",
      detects: () => {
        const prov = { endpoint: "probe", retrieved_at: "probe", locale: "US/en" };
        const ok = new Volume({ value: 100, status: STATUS.MEASURED, keyword: "a", provenance: prov });
        const bad = new Volume({ value: null, status: STATUS.NO_DATA, keyword: "b" });
        try { sumMeasured([ok, bad]); return false; } catch { return true; }
      },
    }),
    controlProbe({
      name: "X-21 still throws on arithmetic over a modelled estimate",
      known_bad: "Number(volume)",
      detects: () => {
        const v = new Volume({ value: 100, status: STATUS.MEASURED, keyword: "a", provenance: { endpoint: "p", retrieved_at: "p", locale: "US/en" } });
        try { Number(v); return false; } catch { return true; }
      },
    }),
    controlProbe({
      name: "the Devanagari script test still matches (locale parity depends on it)",
      known_bad: "hasDevanagari('अश्वगंधा')",
      detects: () => hasDevanagari("अश्वगंधा") === true && hasDevanagari("ashwagandha") === false,
    }),
    controlProbe({
      name: "the zero-set/asymmetry detector still fires on the known incident shape",
      known_bad: "shilajit US=0 / india=246000",
      detects: () => checkV4([
        { keyword: "shilajit", market: "us", rawValue: 0, status: null, source: null, retrieved_at: null, language_code: null, locale: null },
        { keyword: "shilajit", market: "india", rawValue: 246000, status: null, source: null, retrieved_at: null, language_code: null, locale: null },
      ]).findings.length > 0,
    }),
  ];
}

// ---------------------------------------------------------------------------
// THE VALIDATOR
// ---------------------------------------------------------------------------

/** @param {string} dir */
function loadRawPairs(dir) {
  if (!dir || !existsSync(dir)) return [];
  const out = [];
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".json")) continue;
    const p = join(dir, f);
    if (!statSync(p).isFile()) continue;
    try {
      const pair = extractPair(JSON.parse(readFileSync(p, "utf8")));
      if (pair) out.push({ file: f, pair });
    } catch { /* not a response file; ignore */ }
  }
  return out;
}

/**
 * @param {object} o
 * @param {any} o.artifactRaw
 * @param {any} [o.ontologyRaw]
 * @param {any} [o.seedsRaw]
 * @param {string|null} [o.audiencePath]
 * @param {string|null} [o.audienceCorpus]
 * @param {{file:string,pair:any}[]} [o.pairs]
 * @param {any} [o.questions]
 * @param {any} [o.grounding]
 * @param {any} [o.waivers]
 * @param {string[]|null} [o.bannedRegister]
 */
export function validate({
  artifactRaw, ontologyRaw = null, seedsRaw = null, audiencePath = null, audienceCorpus = null,
  pairs = [], questions = null, grounding = null, waivers = null, bannedRegister = null,
}) {
  const shape = detectShape(artifactRaw);
  const rows = toRows(artifactRaw, shape);
  const probes = runValidatorProbes();

  /** @type {CheckResult[]} */
  const checks = [];

  checks.push(checkEntry(audiencePath));

  // Assertion 1 — seed provenance + the compound ban. Delegated to seed-lint so there is
  // exactly ONE implementation of Rules A/B/C in the repo. A second implementation is how
  // two rules drift apart and one of them quietly stops catching things.
  if (ontologyRaw) {
    const seedSrc = seedsRaw ?? artifactRaw;
    const lint = lintSeeds({ seedsRaw: seedSrc, ontologyRaw, audienceCorpus, compoundOnly: seedsRaw === null });
    const findings = lint.violations.map((v) => `Rule ${v.rule}: "${v.seed}" — ${v.why}`);
    if (!lint.control_probes_ok) findings.unshift("SEED-LINT CONTROL PROBE FAILED — the lint did not run.");
    checks.push(check("A1", "G3-PRE #1 — SEED PROVENANCE + COMPOUND BAN (seed-lint Rules A/B/C)",
      findings.length ? "FAIL" : "PASS", findings, {
        note: seedsRaw === null
          ? "No seeds.json supplied — ran Rules A/B over the artifact's keywords. Rule C (provenance) COULD NOT RUN: " +
            "there is no origin field to check, which is itself the finding — an untagged seed is indistinguishable " +
            "from an invented one once it is in the file."
          : undefined,
      }));
  } else {
    checks.push(check("A1", "G3-PRE #1 — SEED PROVENANCE + COMPOUND BAN (seed-lint Rules A/B/C)", "CANNOT_RUN", [
      "No --ontology supplied, so Rules A and B CANNOT RUN. A check that cannot run FAILS.",
    ]));
  }

  checks.push(checkLocaleParity(rows));
  const seedSet = new Set((seedsRaw?.seeds ?? []).map((s) => (typeof s === "string" ? s : s.seed)));
  checks.push(checkZeroChallenge(rows, seedSet, waivers));
  checks.push(checkV1(rows, shape));
  checks.push(checkV2(rows, shape));
  checks.push(checkV3(rows));
  const v4 = checkV4(rows);
  checks.push(v4);
  checks.push(checkV4Outliers(rows, artifactRaw));
  checks.push(checkV5([v4], grounding));
  checks.push(checkV6(rows, pairs, shape));
  checks.push(checkV7(rows, shape));
  checks.push(checkV8(artifactRaw, rows));
  checks.push(checkV9(pairs));
  checks.push(checkV10(pairs));
  checks.push(checkQuestionProvenance(questions));
  checks.push(checkRegisterScreen(rows, bannedRegister));

  const probesOk = probes.every((p) => p.fired);
  // CANNOT_RUN is a FAIL. That is the point.
  const blockingFails = checks.filter((c) => c.blocking && (c.state === "FAIL" || c.state === "CANNOT_RUN"));

  return {
    validated_at: istNow(),
    artifact_shape: shape,
    rows: rows.length,
    markets: [...new Set(rows.map((r) => r.market))],
    control_probes: probes,
    control_probes_ok: probesOk,
    checks,
    blocking_failures: blockingFails.length,
    verdict: blockingFails.length === 0 && probesOk ? "PASS" : "FAIL",
  };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const a = { artifact: null, ontology: null, seeds: null, audience: null, raw: null,
              questions: null, grounding: null, waivers: null, check: null, json: false };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === "--artifact") a.artifact = argv[++i];
    else if (k === "--ontology") a.ontology = argv[++i];
    else if (k === "--seeds") a.seeds = argv[++i];
    else if (k === "--audience") a.audience = argv[++i];
    else if (k === "--raw") a.raw = argv[++i];
    else if (k === "--questions") a.questions = argv[++i];
    else if (k === "--grounding") a.grounding = argv[++i];
    else if (k === "--waivers") a.waivers = argv[++i];
    else if (k === "--check") a.check = argv[++i];
    else if (k === "--json") a.json = true;
    else throw new Error(`unknown argument: ${k}`);
  }
  if (!a.artifact) throw new Error("--artifact <path> is required");
  return a;
}

const readJSON = (p) => JSON.parse(readFileSync(p, "utf8"));
const readJSONOpt = (p) => (p && existsSync(p) ? readJSON(p) : null);

const STATE_MARK = { PASS: "PASS      ", FAIL: "FAIL      ", REPORT_ONLY: "report-only", CANNOT_RUN: "CANNOT RUN" };

function main() {
  let args;
  try { args = parseArgs(process.argv.slice(2)); }
  catch (e) { console.error(`keyword-validate: ${e.message}`); process.exit(EXIT_HARNESS); }

  let report;
  try {
    report = validate({
      artifactRaw: readJSON(args.artifact),
      ontologyRaw: readJSONOpt(args.ontology),
      seedsRaw: readJSONOpt(args.seeds),
      audiencePath: args.audience,
      audienceCorpus: args.audience && existsSync(args.audience) ? readFileSync(args.audience, "utf8") : null,
      pairs: loadRawPairs(args.raw),
      questions: readJSONOpt(args.questions),
      grounding: readJSONOpt(args.grounding),
      waivers: readJSONOpt(args.waivers),
    });
  } catch (e) {
    console.error(`keyword-validate: harness error: ${e.message}`);
    process.exit(EXIT_HARNESS);
  }

  let checks = report.checks;
  if (args.check) {
    const want = args.check.toLowerCase();
    const alias = { locales: "A2", ontology: "A1", hinglish: "A2", entry: "A0" };
    const id = (alias[want] ?? args.check).toUpperCase();
    checks = report.checks.filter((c) => c.id.toUpperCase() === id);
    if (!checks.length) { console.error(`keyword-validate: no such check "${args.check}"`); process.exit(EXIT_HARNESS); }
  }

  if (args.json) {
    console.log(JSON.stringify({ ...report, checks }, null, 2));
  } else {
    console.log(`\n${"=".repeat(78)}`);
    console.log(`=== keyword-validate — ${report.verdict} === (${report.validated_at})`);
    console.log(`${"=".repeat(78)}`);
    console.log(`artifact shape: ${report.artifact_shape}  ·  rows: ${report.rows}  ·  markets: [${report.markets.join(", ")}]`);
    if (report.artifact_shape === "legacy_lossy") {
      console.log(`\n  ⚠  SHAPE "legacy_lossy": this artifact is a {keyword: number} map. It is NOT the API's`);
      console.log(`     response schema, so most checks below cannot be satisfied by it at all — not because`);
      console.log(`     they are strict, but because the evidence needed to answer them was destroyed at`);
      console.log(`     write time.`);
    }

    console.log(`\n--- CONTROL PROBES (SX: no control probe => the gate did not run) ---`);
    for (const p of report.control_probes) console.log(`  ${p.fired ? "OK  " : "DEAD"} ${p.name}`);

    console.log(`\n--- CHECKS ---`);
    for (const c of checks) {
      const mark = STATE_MARK[c.state] ?? c.state;
      const block = c.blocking ? "" : "  (non-blocking)";
      console.log(`\n[${mark}] ${c.id} · ${c.title}${block}`);
      for (const f of c.findings) console.log(`      · ${f}`);
      if (c.note) console.log(`      note: ${c.note}`);
    }

    const fails = checks.filter((c) => c.blocking && (c.state === "FAIL" || c.state === "CANNOT_RUN"));
    console.log(`\n${"=".repeat(78)}`);
    console.log(`VERDICT: ${report.verdict}  ·  ${fails.length} blocking failure(s): ${fails.map((c) => c.id).join(", ") || "none"}`);
    if (report.verdict === "FAIL") {
      console.log(`\nS5 (sitemap/IA) MUST REFUSE TO RUN ON THIS ARTIFACT.`);
      console.log(`An architecture decision may not be taken from unaudited demand data.`);
    }
    console.log(`${"=".repeat(78)}\n`);
  }
  process.exit(report.verdict === "PASS" ? EXIT_OK : EXIT_FAIL);
}

// NOTE: comparing import.meta.url to process.argv[1] as raw STRINGS silently
// broke on any checkout path containing a space — import.meta.url percent-encodes
// it, argv[1] does not — so main() never ran and the script exited 0 having
// checked NOTHING. Normalising argv[1] through URL() fixes it with no new import.
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) main();
