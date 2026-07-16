/**
 * keyword-model.mjs — the SHARED TYPE LAYER for S3 keyword & demand.
 *
 * This file exists because of four real failures, all ours, all documented:
 *
 *   #1 INVENTED COMPOUND SEEDS      "turmeric curcumin" understated turmeric 11x
 *   #2 IMPLAUSIBLE ZEROS SUMMED     shilajit US=0 summed into "herbs = 2,568,670/mo"
 *   #3 ENGLISH-ONLY INDIA           language_code=en only; Hindi/Hinglish demand invisible
 *   #4 MODELLED ESTIMATE AS FACT    Google publishes no per-keyword volumes. Tools MODEL
 *                                   them. 27,100 was quoted to the Director as measurement.
 *
 * THE DESIGN RULE, copied from `sites/whatisayurveda.com/app/lib/medical-review.ts`:
 * do not WARN about a violation — make it UNREPRESENTABLE. `resolveReview()` THROWS
 * rather than silently degrading, because a broken claim on a medical page is a
 * build-stopping error. The same logic governs a number shown to the Director.
 *
 * Hence `Volume` (below) is a TYPE, not a number:
 *   - `vol + vol`, `Number(vol)`, `vol * 2`  THROW. Arithmetic on a modelled estimate
 *     is not a thing you may do by accident. (X-21 / G3-PRE #6 — "a type, not a string".)
 *   - `${vol}` does NOT throw — it renders WITH its status and provenance label, so a
 *     volume physically cannot be printed as a bare confident integer. That is failure
 *     #4 closed by construction rather than by a header disclaimer nobody reads.
 *   - `.measuredValue()` is the ONLY way to a raw number, and it throws unless the row
 *     is genuinely `measured` AND carries complete provenance.
 *
 * WHY A TYPE AND NOT A LINT: the original incident was ONE defaulting accessor —
 * `d.get(k, 0)`. A lint can be forgotten, greased past, or written in a language nobody
 * greps ("a grep proves the presence of a mistake, never its absence" — research §9).
 * A type cannot be forgotten, because the program does not run without satisfying it.
 *
 * Source of every rule here: docs/process/research-keyword-rigor.md (rev 3) and
 * docs/process/MASTER_PIPELINE.md §S3 / G3-PRE assertions 0-9.
 *
 * House style: plain-ESM JavaScript + JSDoc. Node 24. No TypeScript.
 */

// ---------------------------------------------------------------------------
// THE FOUR-STATE TYPE MODEL (research §6 V1)
// ---------------------------------------------------------------------------

/**
 * Every keyword row is EXACTLY one of these. The whole incident is the collapse of
 * three distinct facts — "no demand", "no data", "not queried" — into one integer `0`.
 *
 * `not_returned` is NOT a pedantic fourth case. Labs `keyword_overview` silently omits
 * keywords it does not know (verified live: res_13 requested 3, returned 2, status
 * "Ok."). A row that never arrived cannot be `no_data`, because NOTHING SAID SO.
 * Collapsing "the endpoint told us it has no number" into "the endpoint never mentioned
 * it" is the identical category error as null->0, one level up — and it defeats a
 * null-check by never presenting a row to check.
 *
 * @typedef {'measured'|'measured_secondary'|'no_data'|'not_returned'|'not_queried'} Status
 */
export const STATUS = Object.freeze({
  /** endpoint returned a row WITH a number */
  MEASURED: "measured",
  /** primary endpoint had no number; a second source did (V2 resolution) */
  MEASURED_SECONDARY: "measured_secondary",
  /** endpoint returned a row, no number. NOT zero. A statement about coverage. */
  NO_DATA: "no_data",
  /** we asked; NO ROW CAME BACK. Nothing said anything. (V9) */
  NOT_RETURNED: "not_returned",
  /** we never asked. An absence in our process, not in the world. */
  NOT_QUERIED: "not_queried",
});

/** The ONLY states from which a number may be read or summed. */
export const MEASURED_STATES = Object.freeze([STATUS.MEASURED, STATUS.MEASURED_SECONDARY]);

/** @param {string} s */
export const isMeasuredStatus = (s) => MEASURED_STATES.includes(s);

const ALL_STATUSES = Object.values(STATUS);

/**
 * Provenance required on EVERY number (research §6 V7).
 * "If a number cannot say where it came from, it does not ship."
 * @typedef {object} Provenance
 * @property {string} endpoint       e.g. "keywords_data/google_ads/search_volume/live"
 * @property {string} retrieved_at   IST, second precision
 * @property {string} locale         e.g. "IN/hi-Deva"
 * @property {string} [response_file] path to the byte-for-byte committed response
 * @property {number} [cost_usd]
 * @property {'high'|'medium'|'low'} [confidence]
 */

const PROVENANCE_REQUIRED = ["endpoint", "retrieved_at", "locale"];

// ---------------------------------------------------------------------------
// V8 — THE BUCKET LADDER. Every volume we hold is a LABEL, not a count.
// ---------------------------------------------------------------------------

/**
 * MEASURED, not assumed: across 160+ keywords spanning US + India,
 * `google_ads/search_volume` returned only 47 distinct values, with a median ratio of
 * ~1.224 between consecutive distinct values — a geometric ladder of ratio ~1.22.
 * (research §6 V8, computed from our own committed responses, not taken on faith.)
 *
 * CONSEQUENCE: no volume DataForSEO gives us is a measurement. Every one is the label
 * of a bucket ~+/-11% wide, and the true value sits anywhere inside it.
 * "herbs 2.57M/mo" was fake precision to SIX significant figures built from a 47-value
 * ladder — wrong twice over: wrong inputs AND a precision claim the instrument cannot
 * support.
 */
export const BUCKET_RATIO = 1.22;

/** Half-width of a bucket as a fraction: ratio 1.22 => ~+/-11%. */
export const BUCKET_HALF_WIDTH = (BUCKET_RATIO - 1) / 2; // ~0.11

/** V8: volumes are reported to at most 2 significant figures. */
export const MAX_SIGNIFICANT_FIGURES = 2;

/**
 * Round to N significant figures. V8: "FAIL if any volume is reported to >2 s.f."
 * @param {number} n
 * @param {number} [sf]
 * @returns {number}
 */
export function toSignificantFigures(n, sf = MAX_SIGNIFICANT_FIGURES) {
  if (!Number.isFinite(n)) throw new TypeError(`toSignificantFigures: not a finite number: ${n}`);
  if (n === 0) return 0;
  const mag = Math.floor(Math.log10(Math.abs(n)));
  const factor = 10 ** (mag - sf + 1);
  return Math.round(n / factor) * factor;
}

/**
 * Count the significant figures a number is EXPRESSED to. Used to catch fake precision
 * such as 2,568,670 (6 s.f.) coming off a 47-value ladder.
 * @param {number} n
 * @returns {number}
 */
export function significantFiguresOf(n) {
  if (!Number.isFinite(n) || n === 0) return 0;
  // strip sign, strip trailing zeros of the integer part, count remaining digits
  const digits = Math.abs(n).toString().replace(".", "").replace(/0+$/, "");
  return digits.length === 0 ? 1 : digits.length;
}

// ---------------------------------------------------------------------------
// THE VOLUME TYPE — X-21. Arithmetic on a modelled estimate THROWS.
// ---------------------------------------------------------------------------

/**
 * A search volume, as the thing it actually is: a MODELLED, BUCKETED ESTIMATE with a
 * status and a provenance — never a bare integer.
 *
 * Failure #4 is a USAGE failure, not a LABELLING failure. A string-presence check is
 * satisfied by pasting "all figures are modelled estimates" once in a header while the
 * body still reports 27.1K as fact — which is EXACTLY what our failure was. So the
 * label is enforced by the type system, at the point of use, every time.
 */
export class Volume {
  /** @type {number|null} */ #value;
  /** @type {Status} */ #status;
  /** @type {Provenance|null} */ #provenance;
  /** @type {string} */ #keyword;

  /**
   * @param {object} o
   * @param {number|null} o.value
   * @param {Status} o.status
   * @param {string} o.keyword
   * @param {Provenance|null} [o.provenance]
   */
  constructor({ value, status, keyword, provenance = null }) {
    if (!ALL_STATUSES.includes(status)) {
      throw new TypeError(
        `Volume: unknown status ${JSON.stringify(status)} for "${keyword}" — must be one of ${ALL_STATUSES.join(", ")}`,
      );
    }
    // THE CORE INVARIANT. A non-measured row may not carry a number, and a measured row
    // must. This is the null->0 collapse made structurally impossible: there is no way to
    // construct a Volume that says "no_data" and also holds 0.
    if (isMeasuredStatus(status)) {
      if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new TypeError(
          `Volume: status "${status}" for "${keyword}" requires a finite number, got ${JSON.stringify(value)}`,
        );
      }
    } else if (value !== null) {
      throw new TypeError(
        `Volume: status "${status}" for "${keyword}" must carry value null, got ${JSON.stringify(value)} — ` +
          `this is the null->0 coercion that produced "shilajit = 0". A non-measured row has NO number.`,
      );
    }
    this.#value = value;
    this.#status = status;
    this.#keyword = keyword;
    this.#provenance = provenance;
  }

  get keyword() { return this.#keyword; }
  get status() { return this.#status; }
  get provenance() { return this.#provenance; }

  isMeasured() { return isMeasuredStatus(this.#status); }

  /** @returns {string[]} the provenance fields that are missing (V7). */
  missingProvenance() {
    if (!this.isMeasured()) return [];
    if (!this.#provenance) return [...PROVENANCE_REQUIRED];
    return PROVENANCE_REQUIRED.filter((f) => {
      const v = this.#provenance[f];
      return v === undefined || v === null || String(v).trim() === "";
    });
  }

  /**
   * THE ONLY DOOR TO A RAW NUMBER — and it is deliberately narrow.
   *
   * Throws unless the row is genuinely measured AND can name where it came from.
   * V7: "If a number cannot say where it came from, it does not ship."
   * @returns {number}
   */
  measuredValue() {
    if (!this.isMeasured()) {
      throw new Error(
        `Volume.measuredValue: "${this.#keyword}" has status "${this.#status}" — it has NO number.\n` +
          `  A ${this.#status} row is a statement about our REQUEST, not about the world.\n` +
          `  Resolve it (V2: re-query a second source) or record it. Do NOT default it to 0 —\n` +
          `  that is the exact coercion that reported shilajit as having no US demand.`,
      );
    }
    const missing = this.missingProvenance();
    if (missing.length) {
      throw new Error(
        `Volume.measuredValue: "${this.#keyword}" = ${this.#value} cannot name its provenance ` +
          `(missing: ${missing.join(", ")}) — V7: a number that cannot say where it came from does not ship.`,
      );
    }
    return /** @type {number} */ (this.#value);
  }

  /**
   * X-21 — THE TRAP.
   *
   * `number`/`default` hints (v + 1, Number(v), v * 2, v > 3) THROW: arithmetic on a
   * modelled estimate must be a deliberate, typed act, never an accident.
   *
   * `string` hint does NOT throw — it renders WITH the status and provenance. A volume
   * therefore cannot be interpolated into a report as a bare confident integer. You get
   * "~201000 [measured, bucket +/-11%, labs_keyword_overview @ 2026-07-15]", not "201000".
   * That is failure #4 closed at the point of use.
   *
   * @param {string} hint
   */
  [Symbol.toPrimitive](hint) {
    if (hint === "string") return this.label();
    throw new TypeError(
      `X-21: refusing to coerce the volume of "${this.#keyword}" to a ${hint}.\n` +
        `  Google does not publish per-keyword search volumes. Every figure we hold is a\n` +
        `  MODELLED, BUCKETED estimate (~+/-11%). Arithmetic on it is not a thing you may do\n` +
        `  by accident — that is how "herbs = 2,568,670/mo" was reported to the Director as fact.\n` +
        `  If you genuinely mean it: call .measuredValue() (throws on non-measured rows),\n` +
        `  or sumMeasured() / bandFor() which refuse to total a set containing data faults.`,
    );
  }

  /** Human-facing rendering — ALWAYS carries the label. Never a bare integer. */
  label() {
    if (!this.isMeasured()) {
      return `[no number: ${this.#status}] "${this.#keyword}"`;
    }
    const p = this.#provenance;
    const src = p ? `${p.endpoint ?? "?"} @ ${p.retrieved_at ?? "?"}` : "NO PROVENANCE";
    const rounded = toSignificantFigures(/** @type {number} */ (this.#value));
    return `~${rounded} [${this.#status}, bucket +/-${Math.round(BUCKET_HALF_WIDTH * 100)}%, ${src}]`;
  }

  toJSON() {
    return { keyword: this.#keyword, volume: this.#value, status: this.#status, provenance: this.#provenance };
  }
}

// ---------------------------------------------------------------------------
// AGGREGATION — G3-PRE #5 "NO BLIND SUMS" / research §6 V1, V8
// ---------------------------------------------------------------------------

/**
 * A cluster's demand, as a BAND — never a total.
 * V8: "FAIL if a cluster sum is presented without its quantization band."
 * @typedef {object} Band
 * @property {number} low
 * @property {number} high
 * @property {number} point
 * @property {number} n_terms
 * @property {string} label
 */

/**
 * Sum a set of Volumes — and REFUSE if any summand is not measured.
 *
 * THIS IS THE FUNCTION THAT WOULD HAVE STOPPED "herbs = 2,568,670/mo".
 * That number was computed over a set containing seven rows whose real status was
 * "no number" and whose recorded value was 0. Every one of those zeros summed cleanly,
 * because 0 is a number and nothing in the path asked whether it was a MEASUREMENT.
 *
 * G3-PRE #5: "No aggregate may be emitted unless for all summands: status == measured."
 *
 * @param {Volume[]} volumes
 * @param {object} [opts]
 * @param {string} [opts.clusterName]
 * @returns {Band}
 */
export function sumMeasured(volumes, { clusterName = "cluster" } = {}) {
  if (!Array.isArray(volumes)) throw new TypeError("sumMeasured: expected an array of Volume");
  const faults = volumes.filter((v) => !v.isMeasured());
  if (faults.length) {
    const names = faults.map((v) => `      - "${v.keyword}" (${v.status})`).join("\n");
    throw new Error(
      `sumMeasured: REFUSING to aggregate ${clusterName} — ${faults.length} of ${volumes.length} rows are not measured:\n` +
        `${names}\n` +
        `  A non-measured row has no number. Summing it means inventing one (almost always 0).\n` +
        `  THIS IS FAILURE #2: seven such rows summed into "herbs = 2,568,670/mo", which was\n` +
        `  reported to the Director as fact. Resolve every row (V2) or exclude the cluster.\n` +
        `  Nulls are EXCLUDED from a total, never zeroed — and a total missing rows is not a total.`,
    );
  }
  const missingProv = volumes.filter((v) => v.missingProvenance().length);
  if (missingProv.length) {
    throw new Error(
      `sumMeasured: REFUSING to aggregate ${clusterName} — ${missingProv.length} rows cannot name their provenance ` +
        `(V7): ${missingProv.map((v) => `"${v.keyword}"`).join(", ")}`,
    );
  }
  const point = volumes.reduce((acc, v) => acc + v.measuredValue(), 0);
  return bandFor(point, volumes.length, clusterName);
}

/**
 * Wrap a point estimate in its quantization band. Volumes are bucket LABELS, so a sum
 * inherits ~+/-11% per term.
 * @param {number} point
 * @param {number} nTerms
 * @param {string} [clusterName]
 * @returns {Band}
 */
export function bandFor(point, nTerms, clusterName = "cluster") {
  const low = toSignificantFigures(point * (1 - BUCKET_HALF_WIDTH));
  const high = toSignificantFigures(point * (1 + BUCKET_HALF_WIDTH));
  const rounded = toSignificantFigures(point);
  return {
    low,
    high,
    point: rounded,
    n_terms: nTerms,
    label:
      `${clusterName}: ~${rounded}/mo (band ${low}-${high}, ${nTerms} terms, each a ` +
      `+/-${Math.round(BUCKET_HALF_WIDTH * 100)}% bucket label — NOT a measurement)`,
  };
}

// ---------------------------------------------------------------------------
// TOKENISATION + SURFACE-FORM SPAN MATCHING (the core of seed-lint's precision)
// ---------------------------------------------------------------------------

/**
 * Unicode-aware tokenisation. MUST keep Devanagari intact — a tokeniser that drops
 * non-ASCII would silently make every Hindi seed invisible to the lint, which is
 * failure #3 wearing a different hat.
 * @param {string} s
 * @returns {string[]}
 */
export function tokens(s) {
  return String(s).toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
}

/**
 * @typedef {object} Span
 * @property {number} start  inclusive token index
 * @property {number} end    exclusive token index
 * @property {string} form   the surface form that matched
 */

/**
 * Find every consecutive-token span where `form` occurs in `toks`.
 * @param {string[]} toks
 * @param {string} form
 * @returns {Span[]}
 */
export function findFormSpans(toks, form) {
  const f = tokens(form);
  if (f.length === 0) return [];
  /** @type {Span[]} */
  const out = [];
  for (let i = 0; i + f.length <= toks.length; i++) {
    let hit = true;
    for (let j = 0; j < f.length; j++) {
      if (toks[i + j] !== f[j]) { hit = false; break; }
    }
    if (hit) out.push({ start: i, end: i + f.length, form: f.join(" ") });
  }
  return out;
}

/**
 * Do two spans overlap? THIS PREDICATE IS THE WHOLE PRECISION OF RULE A.
 *
 * "bacopa monnieri" is a Latin binomial — ONE name for one entity — and must PASS.
 * If the ontology lists both "bacopa monnieri" and "bacopa", both match, and a naive
 * "two forms of the same entity" rule would flag a legitimate binomial. Their spans
 * OVERLAP ([0,2) vs [0,1)), so it is one name, not a juxtaposition.
 *
 * "amla amalaki" matches "amla" at [0,1) and "amalaki" at [1,2) — DISJOINT. That is two
 * names for one referent welded together, and it must FAIL.
 *
 * A lint that cries wolf gets disabled. This predicate is why it does not.
 * @param {Span} a
 * @param {Span} b
 */
export const spansOverlap = (a, b) => a.start < b.end && b.start < a.end;

// ---------------------------------------------------------------------------
// LOCALE / REGISTER (failure #3)
// ---------------------------------------------------------------------------

/** Devanagari Unicode block. A pure script test — no judgement, no unratified list. */
export const DEVANAGARI_RE = /[ऀ-ॿ]/u;

/**
 * Hinglish (romanised Hindi) patterns.
 *
 * ⚠️ UNRATIFIED — Q9 is open: no Hindi speaker has validated this list against real
 * Kairali customer language. Therefore Hinglish PATTERN COVERAGE is REPORT-ONLY
 * (gate G5a), exactly as V3's unsourced floors are report-only. Blocking on an
 * unratified list is not rigour — it enforces our guess.
 *
 * The LOCALE-PARITY half (G5 / assertion #2) does NOT depend on this list: it fires on
 * the Devanagari script test above, which is decidable with no judgement at all.
 * Source: research §5.1a.
 */
export const HINGLISH_PATTERNS = Object.freeze([
  "ke fayde", "ke nuksan", "kaise use kare", "ki taseer", "kya hai",
  "ke upay", "ke fayde aur nuksan", "dosage kitna", "kab lena chahiye",
]);

/** @param {string} term */
export const hasDevanagari = (term) => DEVANAGARI_RE.test(term);

/** @param {string} term */
export const looksHinglish = (term) => {
  const t = String(term).toLowerCase();
  return HINGLISH_PATTERNS.some((p) => t.includes(p));
};

/**
 * Classify a term's register from the STRING ITSELF.
 *
 * Verified (research §5.1a): `language_code` does not affect the returned volume at all
 * — `ashwagandha ke fayde` returns 33,100 under both en and hi. The register is carried
 * by the KEYWORD STRING, not by the locale code. There is no API field to assert on, so
 * we assert on construction and coverage of the strings.
 * @param {string} term
 * @returns {'hi-Deva'|'hi-Latn'|'en'}
 */
export function registerOf(term) {
  if (hasDevanagari(term)) return "hi-Deva";
  if (looksHinglish(term)) return "hi-Latn";
  return "en";
}

/**
 * Required registers per market (research §5.1 locale matrix).
 * India is not an English-language market. The failed pull requested India in `en` only
 * and called the result "India".
 *
 * "Hindi" is NOT a synonym for "Devanagari": `ashwagandha ke fayde` (33,100, Hinglish)
 * outranks `अश्वगंधा` (22,200, Devanagari), and `shilajit ke fayde` (27,100) beats
 * `शिलाजीत` (9,900) by 2.7x. A "we'll add Devanagari" fix captures the SMALLER half and
 * declares the locale problem solved.
 */
export const LOCALE_MATRIX = Object.freeze({
  us:    { location_code: 2840, required_registers: ["en"] },
  india: { location_code: 2356, required_registers: ["en", "hi-Deva", "hi-Latn"] },
});

/**
 * Market identifiers arrive spelled several ways — "india" in the legacy map, "IN" in a
 * locale string like "IN/hi-Deva", and 2356 in an API payload. They are ONE market.
 *
 * This is deliberately an explicit ALIAS TABLE and not a fuzzy match. An unknown market
 * must resolve to null and FAIL loudly (an uncheckable market does not pass), because a
 * market silently failing to resolve is how a locale requirement evaporates — which is
 * failure #3's mechanism, one layer down.
 */
export const MARKET_ALIASES = Object.freeze({
  us: "us", usa: "us", "united states": "us", 2840: "us", "2840": "us",
  in: "india", india: "india", 2356: "india", "2356": "india",
});

/** @param {string|number} key @returns {string|null} canonical market id, or null if unknown */
export function resolveMarket(key) {
  if (key === null || key === undefined) return null;
  return MARKET_ALIASES[String(key).trim().toLowerCase()] ?? null;
}

/** Registers whose absence HARD-BLOCKS (decidable by script test alone, no unratified list). */
export const HARD_BLOCK_REGISTERS = Object.freeze(["en", "hi-Deva"]);

// ---------------------------------------------------------------------------
// V3 — HIGH-PRIOR ENTITIES (report-only; Q1 blocks the floors)
// ---------------------------------------------------------------------------

/**
 * Entities that cannot plausibly be near-zero in a major market.
 * Source: research §6 V3 (the list is sourced; the FLOORS are not).
 *
 * ⚠️ REPORT-ONLY until Q1 closes. No floor is invented here — a fabricated floor is the
 * original sin one level up. Shipping V3 report-only with a real reason is MORE rigorous
 * than shipping it with invented numbers.
 *
 * This costs us nothing, because G3-PRE #3 (ZERO CHALLENGE) hard-blocks EVERY
 * non-measured seed row regardless of any list. V3 is the redundant second net; the
 * type model is the method.
 */
export const HIGH_PRIOR_ENTITIES = Object.freeze([
  "ashwagandha", "turmeric", "shilajit", "triphala", "amla", "neem", "tulsi",
  "brahmi", "moringa", "chyawanprash", "shatavari", "giloy", "panchakarma",
]);

// ---------------------------------------------------------------------------
// ONTOLOGY
// ---------------------------------------------------------------------------

/**
 * @typedef {object} Entity
 * @property {string} canonical_id
 * @property {string} preferred_term
 * @property {string} [sanskrit_term]
 * @property {string} [latin_binomial]
 * @property {string[]} [common_en]
 * @property {string[]} [synonyms]     SAME referent (amalaki IS amla)      -> Rule A
 * @property {string[]} [constituents] DIFFERENT referent (curcumin is IN turmeric) -> Rule B
 * @property {string} source_url
 * @property {string} source_type
 */

/**
 * Every surface form that NAMES an entity. Deliberately EXCLUDES `constituents` —
 * that exclusion is the load-bearing distinction of the whole compound ban.
 *
 * `amalaki` is a SYNONYM of amla (same thing, Rule A).
 * `curcumin` is a CONSTITUENT of turmeric (a different thing, Rule B).
 * Collapsing the two lists into one re-opens the exact hole that produced
 * "turmeric curcumin" — and Rule A alone waves it straight through, because turmeric
 * and curcumin are NOT two names for one entity. They are two entities.
 * @param {Entity} e
 * @returns {string[]}
 */
export function nameFormsOf(e) {
  return [e.preferred_term, e.sanskrit_term, e.latin_binomial, ...(e.common_en ?? []), ...(e.synonyms ?? [])]
    .filter((x) => typeof x === "string" && x.trim() !== "");
}

/** @param {Entity} e @returns {string[]} */
export function constituentFormsOf(e) {
  return (e.constituents ?? []).filter((x) => typeof x === "string" && x.trim() !== "");
}

/**
 * Load + validate an ontology file.
 * K1 exit test: 100% of rows carry a resolvable source_url, and ZERO terms appear in
 * both synonyms[] and constituents[] of the same entity (that overlap IS the bug).
 * @param {any} raw
 * @returns {{entities: Entity[], problems: string[]}}
 */
export function loadOntology(raw) {
  const problems = [];
  const entities = Array.isArray(raw?.entities) ? raw.entities : [];
  if (!entities.length) problems.push("ontology has no entities[] — seed-lint cannot resolve any seed");
  for (const e of entities) {
    if (!e.canonical_id) problems.push(`entity missing canonical_id: ${JSON.stringify(e).slice(0, 80)}`);
    if (!e.source_url) problems.push(`entity "${e.canonical_id}" has no source_url — an entity with no source is not an entity`);
    const syn = new Set(nameFormsOf(e).map((f) => f.toLowerCase()));
    for (const c of constituentFormsOf(e)) {
      if (syn.has(c.toLowerCase())) {
        problems.push(
          `entity "${e.canonical_id}": "${c}" appears as BOTH a name form and a constituent — ` +
            `that collapse is the turmeric/curcumin hole itself`,
        );
      }
    }
  }
  return { entities, problems };
}

// ---------------------------------------------------------------------------
// SX — THE CONTROL PROBE. "A zero is not believed until a known-present control
//      probe returns non-zero in the same run."
// ---------------------------------------------------------------------------

/**
 * From our own record: a banned-word scan on this machine returned "0 hits — a false
 * negative"; `[[:<:]]` word-boundary syntax silently fails under ugrep. The control word
 * "ayurveda" ALSO returned 0, which is what exposed it.
 *
 * A LINT RETURNING ZERO BECAUSE ITS REGEX SILENTLY DIDN'T MATCH IS FAILURE #2 LIVING
 * INSIDE THE GATE BUILT TO PREVENT FAILURE #2 — an implausible zero, believed, reported
 * as PASS.
 *
 * So: a clean run is not believed until a KNOWN-BAD input is proven to still be caught,
 * in the same process, on the same code path. No control probe => the gate did not run.
 *
 * @param {object} o
 * @param {() => boolean} o.detects  must return true (the known-bad input IS caught)
 * @param {string} o.name
 * @param {string} o.known_bad
 * @returns {{name: string, known_bad: string, fired: boolean}}
 */
export function controlProbe({ detects, name, known_bad }) {
  let fired = false;
  try {
    fired = detects() === true;
  } catch {
    fired = false;
  }
  return { name, known_bad, fired };
}

/** IST timestamp to the second — CLAUDE.md requires second precision on every log line. */
export function istNow() {
  const d = new Date(Date.now() + 5.5 * 3600 * 1000);
  return `${d.toISOString().slice(0, 19).replace("T", " ")} IST`;
}
