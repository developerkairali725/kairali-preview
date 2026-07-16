#!/usr/bin/env node
/**
 * seed-lint.mjs — THE COMPOUND BAN, as code. Gate G3-PRE #1 / G4.
 *
 * CLOSES FAILURE #1: "turmeric curcumin", "amla amalaki", "tulsi holy basil",
 * "giloy guduchi", "fenugreek methi" and three more were seeded into DataForSEO.
 * Nobody types those strings. `turmeric` alone is 301,000 US; the artifact recorded
 * 27,100 under "turmeric curcumin" and called it the demand for turmeric — 11x
 * understated. `amla` = 165,000 India, recorded as 6,600 — 25x.
 *
 * WHY THE BAN NEEDS THREE RULES AND NOT ONE
 * -----------------------------------------
 * "Ban compound concatenations" is unenforceable as stated: `bacopa monnieri` is a
 * Latin binomial, `ashwagandha benefits` is a real modifier query, and
 * `ayurvedic medicine for anxiety` is a legitimate long-tail phrase. All three are
 * multi-word and all three MUST PASS. A lint that cries wolf gets disabled, and a
 * disabled lint protects nothing — so the discrimination IS the job.
 *
 *   RULE A — SELF-JUXTAPOSITION. Two names for ONE referent, welded together.
 *            Catches 7 of our 8 offenders. Decidable because the ontology separates
 *            synonyms from constituents.
 *
 *   RULE B — PARENT/CONSTITUENT. Catches "turmeric curcumin", which RULE A LETS
 *            THROUGH — curcumin is not a synonym of turmeric, it is a chemical
 *            constituent of it. They are genuinely different entities with different
 *            demand and different CPC (301,000/$0.86 vs 60,500/$2.48).
 *            *** THE RULE WRITTEN TO STOP OUR HEADLINE FAILURE DID NOT COVER OUR
 *                HEADLINE FAILURE, AND AN EXTERNAL AUDITOR HAD TO NOTICE. ***
 *            That is why B exists as its own rule, and why it is separately asserted
 *            in the regression corpus. "Turmeric Curcumin 1500mg" is a supplement
 *            LABEL pattern, not a search pattern — which is exactly why it looked
 *            plausible to an agent reading product copy, and why it must be caught by
 *            STRUCTURE rather than by taste.
 *
 *   RULE C — PROVENANCE BACKSTOP. seeds = ontology UNION audience, NOTHING ELSE.
 *            This is the ACTUAL guarantee: "turmeric curcumin" is not a monograph and
 *            no human ever said it, so it cannot enter a compliant seed set REGARDLESS
 *            of A and B. A and B are the fast, legible failures that name the specific
 *            mistake; C catches the modes nobody imagined.
 *
 * WHY WE OVERRULE AHREFS HERE, DELIBERATELY: Ahrefs' published seed method #1 is
 * "brainstorm variations of your target keyword" — the practice that produced our worst
 * artifact. Ahrefs is right FOR A HUMAN IN A TOOL UI: a human who brainstorms "turmeric
 * curcumin", types it in, and sees 27,100 next to "turmeric 301,000" self-corrects in
 * the same glance. The UI is a correction loop. Our agent had none: it generated the
 * string, queried it ALONE, got 27,100, and wrote it into a strategy document. Nothing
 * compared the invention to the real term, because the real term was never queried.
 * Ahrefs is not overruled — it is SCOPED. Brainstorming is legitimate inside a
 * falsification loop and illegitimate outside one. We are the outside-one.
 *
 * Exit 0 = clean · 2 = violations (CI blocks) · 1 = harness error.
 *
 * Usage:
 *   node scripts/seed-lint.mjs --seeds <seeds.json> --ontology <ontology.json>
 *                              [--audience <audience-language.json>] [--compound] [--json]
 */
import { readFileSync } from "node:fs";
import {
  loadOntology, nameFormsOf, constituentFormsOf, tokens, findFormSpans,
  spansOverlap, controlProbe, istNow,
} from "./lib/keyword-model.mjs";

const EXIT_OK = 0, EXIT_HARNESS = 1, EXIT_FAIL = 2;

/** @param {string[]} argv */
function parseArgs(argv) {
  const a = { seeds: null, ontology: null, audience: null, compound: false, json: false };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === "--seeds") a.seeds = argv[++i];
    else if (k === "--ontology") a.ontology = argv[++i];
    else if (k === "--audience") a.audience = argv[++i];
    else if (k === "--compound") a.compound = true;
    else if (k === "--json") a.json = true;
    else throw new Error(`unknown argument: ${k}`);
  }
  if (!a.seeds) throw new Error("--seeds <path> is required");
  // NO DEFAULT ONTOLOGY. A lint that falls back to an empty ontology reports "clean"
  // and is worse than no lint — that is failure #2 living inside the gate.
  if (!a.ontology) throw new Error("--ontology <path> is required (there is no default: an absent ontology would silently pass every seed)");
  return a;
}

/** @param {string} p */
const readJSON = (p) => JSON.parse(readFileSync(p, "utf8"));

/**
 * Normalise seeds to a common shape. Accepts the proper `{seeds:[{seed,origin,...}]}`
 * contract, and also a bare array / bare `{kw: vol}` map so the lint can be pointed at
 * a LEGACY artifact (like demand-raw.json) and still say something true about it.
 * @param {any} raw
 * @returns {{seed: string, origin: string|null, source_id: string|null, source_quote: string|null}[]}
 */
export function normaliseSeeds(raw) {
  const mk = (seed, origin = null, source_id = null, source_quote = null) => ({ seed, origin, source_id, source_quote });
  if (Array.isArray(raw)) {
    return raw.map((s) => (typeof s === "string" ? mk(s) : mk(s.seed ?? s.keyword, s.origin ?? null, s.source_id ?? null, s.source_quote ?? null)));
  }
  if (Array.isArray(raw?.seeds)) {
    return raw.seeds.map((s) => (typeof s === "string" ? mk(s) : mk(s.seed ?? s.keyword, s.origin ?? null, s.source_id ?? null, s.source_quote ?? null)));
  }
  // legacy {market: {keyword: volume}} — e.g. demand-raw.json
  const out = new Map();
  for (const v of Object.values(raw ?? {})) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      for (const kw of Object.keys(v)) if (!out.has(kw)) out.set(kw, mk(kw));
    }
  }
  return [...out.values()];
}

/**
 * RULE A — two DIFFERENT names for the SAME entity, at DISJOINT token spans.
 *
 * The disjointness test is the entire precision of this lint:
 *   "amla amalaki"     -> "amla"[0,1) + "amalaki"[1,2)      DISJOINT -> FAIL (correct)
 *   "bacopa monnieri"  -> "bacopa monnieri"[0,2) + "bacopa"[0,1)  OVERLAP -> pass (correct)
 *   "mucuna pruriens"  -> binomial subsumes "mucuna"        OVERLAP -> pass (correct)
 *   "ashwagandha benefits" -> only one form matches         -> pass (correct)
 * @param {string} seed
 * @param {import("./lib/keyword-model.mjs").Entity[]} entities
 * @returns {{rule:'A', seed:string, entity:string, a:string, b:string, why:string}[]}
 */
export function ruleA(seed, entities) {
  const toks = tokens(seed);
  const out = [];
  for (const e of entities) {
    const forms = nameFormsOf(e);
    /** @type {import("./lib/keyword-model.mjs").Span[]} */
    const matches = [];
    for (const f of forms) matches.push(...findFormSpans(toks, f));
    for (let i = 0; i < matches.length; i++) {
      for (let j = i + 1; j < matches.length; j++) {
        const m = matches[i], n = matches[j];
        if (m.form === n.form) continue;          // same name twice ("amla amla") is a dupe, not a juxtaposition
        if (spansOverlap(m, n)) continue;         // one name, e.g. a binomial containing its genus
        out.push({
          rule: "A",
          seed,
          entity: e.canonical_id,
          a: m.form,
          b: n.form,
          why: `SELF-JUXTAPOSITION: "${m.form}" and "${n.form}" are two names for the SAME entity (${e.canonical_id}). ` +
               `Nobody types both. Test "${m.form}" and "${n.form}" SEPARATELY — whichever the audience actually says is the seed.`,
        });
      }
    }
  }
  return out;
}

/**
 * RULE B — a parent entity welded to its own constituent. Different referents.
 * THIS IS THE RULE THAT CATCHES OUR HEADLINE FAILURE. Rule A cannot: turmeric and
 * curcumin are not two names for one thing — they are two things.
 * @param {string} seed
 * @param {import("./lib/keyword-model.mjs").Entity[]} entities
 */
export function ruleB(seed, entities) {
  const toks = tokens(seed);
  const out = [];
  for (const e of entities) {
    const nameMatches = nameFormsOf(e).flatMap((f) => findFormSpans(toks, f));
    if (!nameMatches.length) continue;
    const constMatches = constituentFormsOf(e).flatMap((f) => findFormSpans(toks, f));
    for (const n of nameMatches) {
      for (const c of constMatches) {
        if (spansOverlap(n, c)) continue;
        out.push({
          rule: "B",
          seed,
          entity: e.canonical_id,
          a: n.form,
          b: c.form,
          why: `PARENT-CONSTITUENT: "${c.form}" is a CONSTITUENT of "${n.form}" (${e.canonical_id}), not a query. ` +
               `They are different entities with different demand and different CPC. ` +
               `Test "${n.form}" and "${c.form}" SEPARATELY — they are different queries. ` +
               `("${seed}" is a supplement-LABEL pattern, not a search pattern.)`,
        });
      }
    }
  }
  return out;
}

/**
 * RULE C — provenance. seeds = ontology UNION audience, nothing else.
 * @param {{seed:string, origin:string|null, source_id:string|null, source_quote:string|null}} s
 * @param {import("./lib/keyword-model.mjs").Entity[]} entities
 * @param {string|null} audienceCorpus  raw text of the audience verbatims, or null
 */
export function ruleC(s, entities, audienceCorpus) {
  const out = [];
  const fail = (why) => out.push({ rule: "C", seed: s.seed, entity: null, a: null, b: null, why });

  if (!s.origin) {
    fail(`NO PROVENANCE: seed "${s.seed}" declares no origin. seeds = ontology UNION audience, nothing else. ` +
         `An untagged seed is indistinguishable from an invented one once it is in the file — which is how "turmeric curcumin" got queried.`);
    return out;
  }
  if (s.origin === "agent_constructed") {
    fail(`FORBIDDEN ORIGIN: seed "${s.seed}" is origin:"agent_constructed". This is banned by name (G3-PRE #1). ` +
         `Brainstorming is a legitimate HUMAN method inside a tool's correction loop and an illegitimate AGENT method outside one.`);
    return out;
  }
  if (s.origin === "ontology") {
    const toks = tokens(s.seed);
    const hit = entities.some((e) => nameFormsOf(e).some((f) => findFormSpans(toks, f).length > 0));
    if (!hit) {
      fail(`UNRESOLVED ONTOLOGY SEED: "${s.seed}" claims origin:"ontology" but resolves to no entity in the loaded ontology. ` +
           `Either it is not an ontology term, or the ontology is incomplete — both are blocking, neither is a pass.`);
    }
    if (!s.source_id) {
      fail(`NO LOCATOR: "${s.seed}" claims origin:"ontology" but names no source_id. An entity with no source is not an entity.`);
    }
    return out;
  }
  if (s.origin === "audience") {
    if (audienceCorpus === null) {
      fail(`UNVERIFIABLE AUDIENCE SEED: "${s.seed}" claims origin:"audience" but no --audience corpus was supplied, ` +
           `so the claim cannot be checked. An unverifiable provenance claim is not provenance.`);
      return out;
    }
    if (!audienceCorpus.toLowerCase().includes(s.seed.toLowerCase())) {
      fail(`NOT VERBATIM: "${s.seed}" claims origin:"audience" but does not appear VERBATIM in the audience corpus. ` +
           `The register IS the keyword ("ke fayde", not "benefits of") — a paraphrase is an invention with a citation stapled to it.`);
    }
    return out;
  }
  fail(`UNKNOWN ORIGIN: seed "${s.seed}" has origin:"${s.origin}" — must be "ontology" or "audience".`);
  return out;
}

/**
 * SX CONTROL PROBE — two-sided, and both sides matter.
 *
 * POSITIVE: known-bad seeds MUST still be caught. A lint whose regex silently stopped
 *   matching reports "0 violations" and is worse than no lint. (Our own record: a
 *   banned-word scan returned 0 hits because `[[:<:]]` silently fails under ugrep; the
 *   control word "ayurveda" also returned 0, which is what exposed it.)
 *
 * NEGATIVE: known-GOOD seeds must NOT be caught. A lint that over-fires gets disabled
 *   by the team, and a disabled lint protects nothing. This half is not symmetry for
 *   its own sake — "ayurvedic medicine for anxiety" is a real long-tail we intend to
 *   rank for, and flagging it would train everyone to click through warnings.
 *
 * NO CONTROL PROBE => THE GATE DID NOT RUN.
 * @param {import("./lib/keyword-model.mjs").Entity[]} entities
 */
export function runControlProbes(entities) {
  return [
    controlProbe({
      name: "Rule A fires on a known synonym-pair",
      known_bad: "amla amalaki",
      detects: () => ruleA("amla amalaki", entities).length > 0,
    }),
    controlProbe({
      name: "Rule B fires on the headline failure",
      known_bad: "turmeric curcumin",
      detects: () => ruleB("turmeric curcumin", entities).length > 0,
    }),
    controlProbe({
      name: "Rule A does NOT fire on a Latin binomial",
      known_bad: "bacopa monnieri (must PASS)",
      detects: () => ruleA("bacopa monnieri", entities).length === 0,
    }),
    controlProbe({
      name: "Rules A+B do NOT fire on a legitimate long-tail",
      known_bad: "ayurvedic medicine for anxiety (must PASS)",
      detects: () =>
        ruleA("ayurvedic medicine for anxiety", entities).length === 0 &&
        ruleB("ayurvedic medicine for anxiety", entities).length === 0,
    }),
  ];
}

/**
 * The whole lint, as a pure function — so the test suite exercises the SAME code path
 * the CLI does, not a re-implementation of it.
 * @param {object} o
 * @param {any} o.seedsRaw
 * @param {any} o.ontologyRaw
 * @param {string|null} [o.audienceCorpus]
 * @param {boolean} [o.compoundOnly]
 */
export function lintSeeds({ seedsRaw, ontologyRaw, audienceCorpus = null, compoundOnly = false }) {
  const { entities, problems } = loadOntology(ontologyRaw);
  const seeds = normaliseSeeds(seedsRaw);
  const probes = runControlProbes(entities);
  const violations = [];

  for (const s of seeds) {
    if (!s.seed || typeof s.seed !== "string") continue;
    violations.push(...ruleA(s.seed, entities));
    violations.push(...ruleB(s.seed, entities));
    if (!compoundOnly) violations.push(...ruleC(s, entities, audienceCorpus));
  }

  const probesOk = probes.every((p) => p.fired);
  return {
    checked_at: istNow(),
    seeds_checked: seeds.length,
    ontology_entities: entities.length,
    ontology_problems: problems,
    control_probes: probes,
    control_probes_ok: probesOk,
    violations,
    // A clean run is only believed if the probes fired. Ontology problems are blocking
    // too: a broken ontology cannot exonerate a seed set.
    verdict: violations.length === 0 && probesOk && problems.length === 0 ? "PASS" : "FAIL",
  };
}

function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (e) {
    console.error(`seed-lint: ${e.message}`);
    process.exit(EXIT_HARNESS);
  }

  let report;
  try {
    report = lintSeeds({
      seedsRaw: readJSON(args.seeds),
      ontologyRaw: readJSON(args.ontology),
      audienceCorpus: args.audience ? readFileSync(args.audience, "utf8") : null,
      compoundOnly: args.compound,
    });
  } catch (e) {
    console.error(`seed-lint: harness error: ${e.message}`);
    process.exit(EXIT_HARNESS);
  }

  if (args.json) {
    console.log(JSON.stringify(report, null, 2));
    process.exit(report.verdict === "PASS" ? EXIT_OK : EXIT_FAIL);
  }

  console.log(`\n=== seed-lint — ${report.verdict} === (${report.checked_at})`);
  console.log(`seeds checked: ${report.seeds_checked} · ontology entities: ${report.ontology_entities}`);

  console.log(`\n--- CONTROL PROBES (SX: a clean run is not believed until a known-bad input is proven caught) ---`);
  for (const p of report.control_probes) {
    console.log(`  ${p.fired ? "OK  " : "DEAD"} ${p.name}  [${p.known_bad}]`);
  }
  if (!report.control_probes_ok) {
    console.log(`\n  *** CONTROL PROBE FAILED — THE LINT DID NOT RUN. ***`);
    console.log(`  A lint reporting "0 violations" because its own matcher is broken is`);
    console.log(`  failure #2 living inside the gate built to prevent failure #2.`);
  }

  if (report.ontology_problems.length) {
    console.log(`\n--- ONTOLOGY PROBLEMS (${report.ontology_problems.length}) — blocking ---`);
    for (const p of report.ontology_problems) console.log(`  x ${p}`);
  }

  const byRule = { A: [], B: [], C: [] };
  for (const v of report.violations) byRule[v.rule].push(v);

  if (report.violations.length) {
    console.log(`\n--- VIOLATIONS: ${report.violations.length} (Rule A: ${byRule.A.length} · Rule B: ${byRule.B.length} · Rule C: ${byRule.C.length}) ---`);
    for (const rule of ["A", "B", "C"]) {
      if (!byRule[rule].length) continue;
      const title = { A: "RULE A — SELF-JUXTAPOSITION (two names for one thing)",
                      B: "RULE B — PARENT/CONSTITUENT (a thing welded to a thing inside it)",
                      C: "RULE C — PROVENANCE (seeds = ontology UNION audience, nothing else)" }[rule];
      console.log(`\n  ${title}`);
      for (const v of byRule[rule]) console.log(`    x "${v.seed}"\n        ${v.why}`);
    }
  } else {
    console.log(`\nno violations.`);
  }

  console.log("");
  process.exit(report.verdict === "PASS" ? EXIT_OK : EXIT_FAIL);
}

// Only run the CLI when executed directly — the test suite imports this module.
if (import.meta.url === `file://${process.argv[1]}`) main();
