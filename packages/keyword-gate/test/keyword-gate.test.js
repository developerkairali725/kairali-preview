/**
 * keyword-gate.test.js — the S3 gate's regression corpus.
 *
 * *** WHY THIS FILE IS HERE AND NOT IN scripts/test/ ***
 * CI discovers tests with `find packages sites -path '*/test/*.test.js'`
 * (.github/workflows/factory-gate.yml). `scripts/` IS NOT IN THAT PATH. A test at
 * scripts/test/keyword-gate.test.js would never run — it would be a comment.
 *
 * That has already burned this repo TWICE: tests/ktahv-critical-flows.spec.ts, and
 * sites/whatisayurveda.com/test/medical-review.test.js — the only test guarding our
 * anti-fabrication gate — sat outside the old `packages/*/test/*.test.js` glob and never
 * ran. The comment in factory-gate.yml says it plainly: "A test that does not run is not
 * a gate; it is a comment."
 *
 * So this file lives where the glob ALREADY looks. It needs no workflow change. The code
 * under test stays in scripts/ per the commission; only the test moved to where CI can
 * see it. (Flagged to the orchestrator regardless — the glob's blind spot over scripts/
 * is a live hazard for anyone who writes a test there next.)
 *
 * THE FIXTURE PHILOSOPHY, from the research doc: "A fixture we wrote ourselves would
 * encode our assumptions, and our assumptions are the thing under test." So V9/V10 run
 * against the REAL, byte-for-byte committed DataForSEO responses in
 * docs/process/evidence/keyword-rigor-2026-07-15/ — what the API actually DID on
 * 2026-07-15, cost recorded — not against mock JSON expressing what we believe it does.
 */
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { lintSeeds, ruleA, ruleB, normaliseSeeds } from "../../../scripts/seed-lint.mjs";
import { validate, detectShape, extractPair, checkV9, checkV10 } from "../../../scripts/keyword-validate.mjs";
import { Volume, STATUS, sumMeasured, toSignificantFigures, significantFiguresOf, registerOf } from "../../../scripts/lib/keyword-model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..");
const FIX = join(ROOT, "test", "fixtures", "keyword");
const EVIDENCE = join(ROOT, "docs", "process", "evidence", "keyword-rigor-2026-07-15");

const readJSON = (p) => JSON.parse(readFileSync(p, "utf8"));
const fixture = (n) => readJSON(join(FIX, n));
const evidence = (n) => readJSON(join(EVIDENCE, n));
const ontology = () => fixture("ontology.bootstrap.json");
const audience = () => readFileSync(join(FIX, "audience.sample.md"), "utf8");

/** The eight real invented seeds, from the quarantine header of demand.md. */
const THE_EIGHT = [
  "tulsi holy basil", "amla amalaki", "giloy guduchi", "fenugreek methi",
  "boswellia shallaki", "yashtimadhu licorice", "kapikacchu mucuna", "turmeric curcumin",
];
/** The seven real zeros, identical in BOTH markets — itself the signal. */
const THE_ZEROS = ["shilajit", "shatavari", "gokshura", "kapikacchu mucuna"];

// ===========================================================================
describe("FIXTURE 1 — the REAL demand map, unmodified, must FAIL", () => {
// ===========================================================================
  test("the fixture is byte-identical to the real quarantined artifact", () => {
    const a = readFileSync(join(FIX, "fixture1-real-demand-raw.bad.json"), "utf8");
    const b = readFileSync(join(ROOT, "docs", "whatisayurveda-research", "demand-raw.json"), "utf8");
    assert.equal(a, b, "the regression fixture must BE the real failure, not a tidied retelling of it");
  });

  test("seed-lint catches all 8 invented compound seeds — 7 by Rule A, 1 by Rule B", () => {
    const r = lintSeeds({ seedsRaw: fixture("fixture1-real-demand-raw.bad.json"), ontologyRaw: ontology(), compoundOnly: true });
    assert.equal(r.verdict, "FAIL");
    const flagged = new Set(r.violations.map((v) => v.seed));
    for (const s of THE_EIGHT) assert.ok(flagged.has(s), `must flag the invented seed "${s}"`);
    assert.equal(r.violations.filter((v) => v.rule === "A").length, 7, "7 synonym self-juxtapositions");
    assert.equal(r.violations.filter((v) => v.rule === "B").length, 1, "1 parent/constituent weld");
  });

  test("RULE B is separately asserted — Rule A alone would let 'turmeric curcumin' through", () => {
    // The rule written to stop our headline failure did not cover our headline failure,
    // and an external auditor had to notice. A regression suite that only tests the rule
    // you remembered to write is not a regression suite.
    const ents = ontology().entities;
    assert.equal(ruleA("turmeric curcumin", ents).length, 0, "Rule A does NOT catch it — this is the documented hole");
    assert.equal(ruleB("turmeric curcumin", ents).length, 1, "Rule B is the ONLY thing that catches it");
  });

  test("NO FALSE POSITIVES: exactly 8 of the 80 seeds are flagged, and no others", () => {
    const r = lintSeeds({ seedsRaw: fixture("fixture1-real-demand-raw.bad.json"), ontologyRaw: ontology(), compoundOnly: true });
    const flagged = new Set(r.violations.map((v) => v.seed));
    assert.equal(flagged.size, 8, `expected exactly the 8 known offenders, got ${[...flagged].join(", ")}`);
    // The legitimate multi-word terms in the real file must survive.
    for (const ok of ["bacopa monnieri", "ayurvedic medicine for diabetes", "ashwagandha benefits", "gotu kola", "arjuna herb"]) {
      assert.ok(!flagged.has(ok), `"${ok}" is legitimate and must NOT be flagged — a lint that cries wolf gets disabled`);
    }
  });

  test("keyword-validate FAILS and names the compounds AND the zeros AND the locale gap", () => {
    const r = validate({ artifactRaw: fixture("fixture1-real-demand-raw.bad.json"), ontologyRaw: ontology() });
    assert.equal(r.verdict, "FAIL");
    const text = JSON.stringify(r);

    // (1) the compound seeds
    for (const s of THE_EIGHT) assert.ok(text.includes(s), `failure output must name the compound seed "${s}"`);
    // (2) the zeros
    for (const z of THE_ZEROS) assert.ok(text.includes(z), `failure output must name the zero "${z}"`);
    // (3) the locale gap
    const locale = r.checks.find((c) => c.id === "A2");
    assert.equal(locale.state, "FAIL");
    assert.ok(JSON.stringify(locale).includes("hi-Deva"), "must name the missing Devanagari register");
  });

  test("the zeros are caught as a DATA FAULT, not merely as a low number", () => {
    const r = validate({ artifactRaw: fixture("fixture1-real-demand-raw.bad.json"), ontologyRaw: ontology() });
    const v4 = r.checks.find((c) => c.id === "V4");
    assert.equal(v4.state, "FAIL");
    const t = JSON.stringify(v4);
    assert.ok(t.includes("IDENTICAL ZERO SETS"), "identical zero sets across independent markets is the threshold-free signal");
    assert.ok(t.includes("CAPTURE LAYER"), "must say the zeros describe our capture, not the markets");
  });

  test("V1 reports the artifact has NO type model, and that its 'raw' file is not raw", () => {
    const r = validate({ artifactRaw: fixture("fixture1-real-demand-raw.bad.json"), ontologyRaw: ontology() });
    const v1 = r.checks.find((c) => c.id === "V1");
    assert.equal(v1.state, "FAIL");
    assert.ok(JSON.stringify(v1).includes("NOT RAW"));
  });

  test("V4b honestly reports the ojas contamination is UNDETECTABLE in this artifact", () => {
    // competition and keyword_difficulty were discarded at write time, so the conjunction
    // that separates ojas (1.5M, LOW comp, KD 0) from ashwagandha (673k, HIGH comp)
    // cannot be evaluated. Volume alone cannot tell them apart — claiming otherwise is
    // how you build a false-positive machine.
    const r = validate({ artifactRaw: fixture("fixture1-real-demand-raw.bad.json"), ontologyRaw: ontology() });
    const v4b = r.checks.find((c) => c.id === "V4b");
    assert.equal(v4b.state, "CANNOT_RUN");
    assert.ok(JSON.stringify(v4b).includes("ojas"));
  });

  test("V4b does NOT flag ashwagandha 673,000 — real head demand is not contamination", () => {
    const r = validate({ artifactRaw: fixture("fixture1-real-demand-raw.bad.json"), ontologyRaw: ontology() });
    const v4b = r.checks.find((c) => c.id === "V4b");
    assert.equal(v4b.findings.filter((f) => f.startsWith("CONTAMINATION")).length, 0,
      "a bare 10x-median rule fires on every genuine head term and trains the team to click through warnings");
  });
});

// ===========================================================================
describe("FIXTURE 2 — clean seeds + ONE ontology-class zero must FAIL (SS11.3)", () => {
// ===========================================================================
  // Fixture 1 fails on assertion #1 (compound seeds), so the suite could go green while
  // THE ZERO-CHALLENGE HOLE IS NEVER TESTED. A corpus that passes for the wrong reason is
  // worse than none. This fixture isolates the hole.
  const load = () => ({
    artifactRaw: fixture("fixture2-clean-seeds-one-zero.artifact.json"),
    ontologyRaw: ontology(),
    seedsRaw: fixture("fixture2-clean-seeds.json"),
    audiencePath: join(FIX, "audience.sample.md"),
    audienceCorpus: audience(),
    pairs: [{ file: "res_14", pair: extractPair(evidence("res_14_google_ads_bogus_null.json")) }],
  });

  test("its seeds are clean — so this fixture cannot fail for fixture 1's reason", () => {
    const r = lintSeeds({ seedsRaw: fixture("fixture2-clean-seeds.json"), ontologyRaw: ontology(), audienceCorpus: audience() });
    assert.equal(r.verdict, "PASS", `seeds must be clean, got: ${r.violations.map((v) => v.seed).join(", ")}`);
  });

  test("its locale coverage is complete — so it cannot fail for failure #3's reason", () => {
    const r = validate(load());
    assert.equal(r.checks.find((c) => c.id === "A2").state, "PASS");
  });

  test("★ it FAILS anyway, on the ZERO CHALLENGE, naming the one bad row", () => {
    const r = validate(load());
    const a3 = r.checks.find((c) => c.id === "A3");
    assert.equal(a3.state, "FAIL", "if this PASSES, the gate does not do what the pipeline says it does");
    assert.equal(a3.findings.length, 1, "exactly one row is wrong; the gate must name it and nothing else");
    assert.ok(a3.findings[0].includes("shilajit"));
    assert.equal(r.verdict, "FAIL");
  });

  test("the draft's conjunct would have missed it: shilajit is NOT in the audience corpus", () => {
    // THE WHOLE POINT. The draft read "volume == 0 AND seed IN S2 corpus". Ontology
    // entities are Sanskrit drug names a review-mined corpus never quotes, because real
    // people say "energy booster". The conjunct excluded the EXACT class that failed.
    assert.ok(!audience().toLowerCase().includes("shilajit\n"), "shilajit is an ontology term, not audience language");
    const r = validate(load());
    assert.equal(r.checks.find((c) => c.id === "A3").state, "FAIL",
      "our rule keys on status != measured, with NO corpus conjunct — that is the fix");
  });

  test("V2 also fires: the null is an unfinished query, not a finding", () => {
    const r = validate(load());
    assert.equal(r.checks.find((c) => c.id === "V2").state, "FAIL");
  });
});

// ===========================================================================
describe("FIXTURE 3 — the NEGATIVE CONTROL: a clean artifact must PASS", () => {
// ===========================================================================
  // Without this, a validator scores 100% on the corpus by failing everything. A gate
  // that never passes is an outage, and the team routes around it within a week.
  const load = () => ({
    artifactRaw: fixture("fixture3-clean.artifact.json"),
    ontologyRaw: ontology(),
    seedsRaw: fixture("fixture2-clean-seeds.json"),
    audiencePath: join(FIX, "audience.sample.md"),
    audienceCorpus: audience(),
    pairs: [{ file: "res_14", pair: extractPair(evidence("res_14_google_ads_bogus_null.json")) }],
    questions: { questions: [{ q: "what is shilajit", source: "paa", raw_response_hash: "res_05_serp_organic_shilajit_us.json" }] },
  });

  test("it PASSES — every blocking check green", () => {
    const r = validate(load());
    const failing = r.checks.filter((c) => c.blocking && (c.state === "FAIL" || c.state === "CANNOT_RUN"));
    assert.deepEqual(failing.map((c) => `${c.id}: ${c.findings[0] ?? ""}`), [], "a clean artifact must pass");
    assert.equal(r.verdict, "PASS");
  });

  test("it differs from fixture 2 in exactly one row — the resolution", () => {
    const two = fixture("fixture2-clean-seeds-one-zero.artifact.json").rows;
    const three = fixture("fixture3-clean.artifact.json").rows;
    const diff = three.filter((r, i) => JSON.stringify(r) !== JSON.stringify(two[i]));
    assert.equal(diff.length, 1, "one row's status is the only difference between FAIL and PASS");
    assert.equal(diff[0].keyword, "shilajit");
    assert.equal(diff[0].status, STATUS.MEASURED_SECONDARY);
    assert.equal(diff[0].volume, 201000, "the null resolved to a 201,000/mo head term recorded as 0");
  });

  test("the resolved row is measured_secondary at confidence medium, NOT measured/high", () => {
    // We do not launder a second-source number into a first-source claim, and the null
    // stays on the record in cross_check.
    const row = fixture("fixture3-clean.artifact.json").rows.find((r) => r.keyword === "shilajit" && r.locale === "US/en");
    assert.equal(row.confidence, "medium");
    assert.equal(row.cross_check.status, "no_data");
    assert.equal(row.cross_check.volume, null, "google_ads' null is preserved, not overwritten");
  });
});

// ===========================================================================
describe("FIXTURE 4 — adversarial edge cases must PASS (the anti-wolf-crying corpus)", () => {
// ===========================================================================
  test("every adversarial seed passes", () => {
    const r = lintSeeds({ seedsRaw: fixture("fixture4-adversarial-seeds.json"), ontologyRaw: ontology(), audienceCorpus: audience() });
    assert.equal(r.verdict, "PASS", `false positives: ${r.violations.map((v) => `${v.seed} (${v.rule})`).join(", ")}`);
  });

  const ents = () => ontology().entities;
  const clean = (s) => ruleA(s, ents()).length === 0 && ruleB(s, ents()).length === 0;

  test("a Latin binomial passes while a synonym-pair fails — same entity, opposite verdicts", () => {
    // THE SHARPEST TEST IN THE CORPUS. 'mucuna' is a synonym of kapikacchu and also the
    // genus in the binomial 'mucuna pruriens'. Span-overlap is the only thing separating
    // these two, and getting it wrong in either direction breaks the lint.
    assert.ok(clean("mucuna pruriens"), "the binomial is ONE name — its span subsumes the bare synonym");
    assert.equal(ruleA("kapikacchu mucuna", ents()).length, 1, "the juxtaposition is TWO names — disjoint spans");
    assert.ok(clean("bacopa monnieri"), "ontology lists both 'bacopa monnieri' and 'bacopa'; spans overlap");
  });

  test("the commission's named case: 'ayurvedic medicine for anxiety' must NOT be flagged", () => {
    assert.ok(clean("ayurvedic medicine for anxiety"), "a legitimate long-tail — flagging it would discredit the gate");
  });

  test("Rule B bans the weld, never either half", () => {
    assert.ok(clean("turmeric"), "the parent alone is the real 301,000/mo head term");
    assert.ok(clean("curcumin"), "the constituent alone is a legitimate 60,500/mo entity at 2.9x the CPC");
    assert.equal(ruleB("turmeric curcumin", ents()).length, 1, "only the weld is banned");
  });

  test("Rule A bans the weld, never either name", () => {
    assert.ok(clean("tulsi"));
    assert.ok(clean("holy basil"));
    assert.equal(ruleA("tulsi holy basil", ents()).length, 1);
  });

  test("Devanagari survives tokenisation — else every Hindi seed is invisible to the lint", () => {
    assert.ok(clean("अश्वगंधा"));
    assert.equal(registerOf("अश्वगंधा"), "hi-Deva");
    assert.equal(registerOf("ashwagandha ke fayde"), "hi-Latn");
    assert.equal(registerOf("ashwagandha"), "en");
  });

  test("a legitimately zero nonsense term in EVERY market is not a fault", () => {
    // Gibberish is gibberish everywhere, so identical zero sets across markets are
    // EXPECTED here, not suspicious. The zero-set rule only counts UNTYPED/non-measured
    // zeros — a `measured` 0 is a claim the endpoint made.
    const art = {
      meta: { locales: [] },
      rows: [
        { keyword: "zzqx nonexistent herb term", locale: "US/en", language_code: "en", volume: 0, status: "measured",
          source: "google_ads_search_volume", retrieved_at: "2026-07-15 18:13:00 IST",
          cross_check: { endpoint: "labs_keyword_overview", volume: 0, status: "measured" }, confidence: "high" },
        { keyword: "zzqx nonexistent herb term", locale: "IN/en", language_code: "en", volume: 0, status: "measured",
          source: "google_ads_search_volume", retrieved_at: "2026-07-15 18:13:00 IST",
          cross_check: { endpoint: "labs_keyword_overview", volume: 0, status: "measured" }, confidence: "high" },
      ],
    };
    const v4 = validate({ artifactRaw: art, ontologyRaw: ontology() }).checks.find((c) => c.id === "V4");
    assert.equal(v4.state, "PASS", "a genuinely measured 0 in every market is an honest finding, not a coercion artifact");
  });

  test("a legitimately low-volume niche term is not a fault", () => {
    const art = {
      meta: { locales: [] },
      rows: [{ keyword: "vidari", locale: "US/en", language_code: "en", volume: 70, status: "measured",
               source: "google_ads_search_volume", retrieved_at: "2026-07-15 18:13:00 IST",
               competition: "LOW", keyword_difficulty: 8,
               cross_check: { endpoint: "labs_keyword_overview", volume: 70, status: "measured" }, confidence: "high" }],
    };
    const r = validate({ artifactRaw: art, ontologyRaw: ontology() });
    assert.equal(r.checks.find((c) => c.id === "V4").state, "PASS", "70/mo is a real rung on the bucket ladder, not a fault");
    assert.equal(r.checks.find((c) => c.id === "A3").state, "PASS", "measured is measured, however small");
  });
});

// ===========================================================================
describe("FIXTURE 5 — the SABOTAGED lint must be caught by the CONTROL PROBE (SX)", () => {
// ===========================================================================
  test("★ a sabotaged ontology reports ZERO violations on the REAL bad data — and still FAILS", () => {
    const r = lintSeeds({
      seedsRaw: fixture("fixture1-real-demand-raw.bad.json"),
      ontologyRaw: fixture("fixture5-sabotaged-ontology.json"),
      compoundOnly: true,
    });
    // The false clean: the lint is blind and says so by saying nothing.
    assert.equal(r.violations.length, 0, "the sabotage works — the lint is blind to all 8 offenders");
    // And it is caught anyway.
    assert.equal(r.control_probes_ok, false, "the control probe must notice the matcher is dead");
    assert.equal(r.verdict, "FAIL", "a lint that cannot detect its own known-bad input must NEVER report PASS");
  });

  test("the probes that died are the detection ones; the anti-false-positive ones still pass", () => {
    const r = lintSeeds({ seedsRaw: [], ontologyRaw: fixture("fixture5-sabotaged-ontology.json"), compoundOnly: true });
    const dead = r.control_probes.filter((p) => !p.fired).map((p) => p.known_bad);
    assert.deepEqual(dead, ["amla amalaki", "turmeric curcumin"]);
  });

  test("the validator's own probes fire on a healthy run", () => {
    const r = validate({ artifactRaw: fixture("fixture3-clean.artifact.json"), ontologyRaw: ontology() });
    assert.ok(r.control_probes_ok, "no control probe => the gate did not run");
    assert.equal(r.control_probes.length, 5);
  });
});

// ===========================================================================
describe("V9 / V10 — against REAL committed API bytes, not mock JSON", () => {
// ===========================================================================
  test("V9: Labs silently dropped a row — requested 3, returned 2, status 'Ok.'", () => {
    const res = evidence("res_13_labs_bogus_drop.json");
    assert.equal(res.status_message, "Ok.", "the API reported success while losing a row");
    const pair = extractPair(res);
    assert.equal(pair.requested.length, 3);
    assert.equal(pair.returned.length, 2);

    const r = checkV9([{ file: "res_13", pair }]);
    assert.equal(r.state, "FAIL");
    assert.ok(JSON.stringify(r).includes("zzqx nonexistent herb term"), "must name the dropped row");
    assert.ok(JSON.stringify(r).includes("not_returned"), "must demand the not_returned state, never 0");
  });

  test("V9: billing conceals the loss — silence is CHEAPER", () => {
    // 0.012 + 2 x 0.00012 = 0.01224. Priced on RETURNED items, so even the invoice agrees
    // with the lie. This is why "the cost looked right" is not evidence.
    assert.equal(evidence("res_13_labs_bogus_drop.json").cost, 0.01224);
  });

  test("V1 NEGATIVE CONTROL: google_ads returns the row WITH null — no drop", () => {
    // Without this control a validator could "pass" V9 by rejecting every response with
    // fewer rows than requested, including the correct ones. It also proves the drop in
    // res_13 is an endpoint CONTRACT DIFFERENCE, not a fluke.
    const pair = extractPair(evidence("res_14_google_ads_bogus_null.json"));
    assert.equal(pair.requested.length, 3);
    assert.equal(pair.returned.length, 3, "google_ads returns the row and sets volume null");
    assert.equal(checkV9([{ file: "res_14", pair }]).state, "PASS");
  });

  test("a bare null carries ZERO information: identical for a 201k head term and for gibberish", () => {
    const items = evidence("res_14_google_ads_bogus_null.json").tasks[0].result;
    const vol = Object.fromEntries(items.map((i) => [i.keyword, i.search_volume]));
    assert.equal(vol["shilajit"], null, "a 201,000/mo US head term");
    assert.equal(vol["zzqx nonexistent herb term"], null, "a string that is not a query");
    assert.equal(vol["turmeric"], 301000);
    // Same representation, opposite realities. Any rule that reads meaning into a bare
    // null is reading noise — which is why V6's second source is mandatory, not thorough.
  });

  test("V10: the 56-keyword response came back ALPHABETIZED, not in request order", () => {
    const pair = extractPair(evidence("res_12_labs_batch56.json"));
    assert.equal(pair.requested.length, 56);
    assert.equal(pair.returned.length, 56);
    assert.deepEqual(pair.returned, [...pair.returned].sort(), "Labs alphabetizes; google_ads does not");
    assert.equal(pair.requested[0], "ashwagandha benefits");
    assert.equal(pair.returned[0], "abhyanga massage");
    assert.equal(checkV10([{ file: "res_12", pair }]).findings.length > 0, true, "the ordering hazard must be reported");
  });

  test("★ THE V10 CANARY: a positional join is silent, total, and plausible", () => {
    // This is the test that matters. "shilajit = 0" was IMPLAUSIBLE and a human caught it.
    // A misjoin produces PLAUSIBLE numbers against PLAUSIBLE keywords: every row
    // well-formed, non-null, reasonable. It passes V1, V3, V4, V8 and a human read.
    const res = evidence("res_12_labs_batch56.json");
    const items = res.tasks[0].result[0].items;
    const requested = res.tasks[0].data.keywords;

    // THE RIGHT WAY — key-join, read the keyword from the response item itself.
    const keyJoined = Object.fromEntries(items.map((i) => [i.keyword, i.keyword_info.search_volume]));
    assert.equal(keyJoined["ashwagandha benefits"], 201000, "the true value");

    // THE WRONG WAY — zip(requested, items). Correct under google_ads, catastrophic here.
    const misjoined = Object.fromEntries(requested.map((k, i) => [k, items[i].keyword_info.search_volume]));
    assert.equal(misjoined["ashwagandha benefits"], 2400, "abhyanga massage's volume, wearing ashwagandha's name");

    // 2,400 is entirely plausible for a keyword. It is wrong by 84x and nothing says so.
    assert.equal(keyJoined["abhyanga massage"], 2400, "where the 2,400 actually came from");
    assert.ok(misjoined["ashwagandha benefits"] < keyJoined["ashwagandha benefits"] / 80);

    // NOTE FOR THE RECORD: research-keyword-rigor.md SS9 specifies this canary as
    // "assert ashwagandha benefits -> 33,100". That is WRONG — 33,100 is the IN/hi value
    // from a different call (res_03/res_06). In res_12 (US) the true value is 201,000 and
    // the misjoin yields 2,400. The spec's own canary number was never run. Fixed here to
    // the real bytes; flagged to the orchestrator.
  });

  test("V9/V10 CANNOT_RUN when no raw pairs are committed — and CANNOT_RUN is a FAIL", () => {
    assert.equal(checkV9([]).state, "CANNOT_RUN");
    assert.equal(checkV10([]).state, "CANNOT_RUN");
    const r = validate({ artifactRaw: fixture("fixture1-real-demand-raw.bad.json"), ontologyRaw: ontology() });
    assert.equal(r.checks.find((c) => c.id === "V9").state, "CANNOT_RUN");
    assert.equal(r.verdict, "FAIL", "'we could not look' and 'we looked and it was fine' are different facts");
  });
});

// ===========================================================================
describe("THE VOLUME TYPE — X-21: failure #4 made unrepresentable", () => {
// ===========================================================================
  const prov = { endpoint: "labs_keyword_overview", retrieved_at: "2026-07-15 18:42:00 IST", locale: "US/en" };

  test("null -> 0 is UNCONSTRUCTIBLE — the coercion cannot be expressed", () => {
    assert.throws(() => new Volume({ value: 0, status: STATUS.NO_DATA, keyword: "shilajit" }), /null->0 coercion/);
    assert.throws(() => new Volume({ value: 0, status: STATUS.NOT_RETURNED, keyword: "x" }), /must carry value null/);
    assert.throws(() => new Volume({ value: 0, status: STATUS.NOT_QUERIED, keyword: "x" }), /must carry value null/);
  });

  test("a measured row must carry a number; a non-measured row must not", () => {
    assert.throws(() => new Volume({ value: null, status: STATUS.MEASURED, keyword: "x" }), /requires a finite number/);
    assert.doesNotThrow(() => new Volume({ value: null, status: STATUS.NO_DATA, keyword: "x" }));
    assert.doesNotThrow(() => new Volume({ value: 201000, status: STATUS.MEASURED, keyword: "shilajit", provenance: prov }));
  });

  test("reading a number off a non-measured row THROWS instead of returning 0", () => {
    const v = new Volume({ value: null, status: STATUS.NO_DATA, keyword: "shilajit" });
    assert.throws(() => v.measuredValue(), /has NO number/);
  });

  test("V7: a measured number that cannot name its provenance THROWS", () => {
    const v = new Volume({ value: 201000, status: STATUS.MEASURED, keyword: "shilajit" });
    assert.throws(() => v.measuredValue(), /cannot name its provenance/);
  });

  test("★ arithmetic on a modelled estimate THROWS — Number(), +, *", () => {
    const v = new Volume({ value: 201000, status: STATUS.MEASURED, keyword: "shilajit", provenance: prov });
    assert.throws(() => Number(v), /X-21/);
    assert.throws(() => v + 1, /X-21/);
    assert.throws(() => v * 2, /X-21/);
    assert.equal(v.measuredValue(), 201000, "the explicit, typed door still works");
  });

  test("★ a volume cannot be printed as a bare confident integer — the label rides along", () => {
    const v = new Volume({ value: 201000, status: STATUS.MEASURED, keyword: "shilajit", provenance: prov });
    const s = `${v}`;
    assert.ok(!/^201000$/.test(s), "string coercion must never yield a bare number");
    assert.ok(s.includes("~200000"), "rounded to 2 s.f. — the ladder cannot support more");
    assert.ok(s.includes("bucket"), "the bucket label is not a header disclaimer; it rides on every use");
    assert.ok(s.includes("labs_keyword_overview"), "provenance travels with the number");
  });

  test("an honest absence renders as an absence, not a zero", () => {
    const v = new Volume({ value: null, status: STATUS.NO_DATA, keyword: "shilajit" });
    assert.equal(`${v}`, '[no number: no_data] "shilajit"');
  });
});

// ===========================================================================
describe("sumMeasured — the function that would have stopped 'herbs = 2,568,670/mo'", () => {
// ===========================================================================
  const prov = { endpoint: "google_ads_search_volume", retrieved_at: "2026-07-15 18:13:00 IST", locale: "US/en" };
  const m = (kw, n) => new Volume({ value: n, status: STATUS.MEASURED, keyword: kw, provenance: prov });

  test("★ it REFUSES to total a set containing a data fault, and names every offender", () => {
    const set = [
      m("ashwagandha", 673000), m("moringa", 201000),
      new Volume({ value: null, status: STATUS.NO_DATA, keyword: "shilajit" }),
      new Volume({ value: null, status: STATUS.NO_DATA, keyword: "shatavari" }),
      new Volume({ value: null, status: STATUS.NOT_RETURNED, keyword: "gokshura" }),
    ];
    assert.throws(() => sumMeasured(set, { clusterName: "herbs" }), (e) => {
      assert.ok(/REFUSING to aggregate herbs/.test(e.message));
      for (const kw of ["shilajit", "shatavari", "gokshura"]) assert.ok(e.message.includes(kw), `must name ${kw}`);
      assert.ok(/3 of 5 rows are not measured/.test(e.message));
      return true;
    });
  });

  test("it refuses a set whose rows cannot name their provenance (V7)", () => {
    const noProv = new Volume({ value: 100, status: STATUS.MEASURED, keyword: "x" });
    assert.throws(() => sumMeasured([m("a", 10), noProv]), /cannot name their provenance/);
  });

  test("a fully-measured set returns a BAND, never a bare total (V8)", () => {
    const band = sumMeasured([m("ashwagandha", 673000), m("moringa", 201000)], { clusterName: "herbs" });
    assert.equal(band.n_terms, 2);
    assert.ok(band.low < band.point && band.point < band.high, "the band brackets the point estimate");
    assert.ok(band.label.includes("NOT a measurement"));
    assert.equal(significantFiguresOf(band.point) <= 2, true, "2 s.f. max off a 47-value ladder");
  });

  test("V8: 2,568,670 is fake precision to 6 significant figures", () => {
    assert.equal(significantFiguresOf(2568670), 6);
    assert.equal(toSignificantFigures(2568670), 2600000);
    assert.equal(toSignificantFigures(301000), 300000);
  });
});

// ===========================================================================
describe("shape detection + CLI contract", () => {
// ===========================================================================
  test("the real artifact is detected as legacy_lossy", () => {
    assert.equal(detectShape(fixture("fixture1-real-demand-raw.bad.json")), "legacy_lossy");
    assert.equal(detectShape(fixture("fixture3-clean.artifact.json")), "output_contract");
    assert.equal(detectShape(evidence("res_14_google_ads_bogus_null.json")), "api_response");
  });

  test("normaliseSeeds reads the legacy {market:{kw:vol}} map without inventing rows", () => {
    const seeds = normaliseSeeds(fixture("fixture1-real-demand-raw.bad.json"));
    assert.equal(seeds.length, 80, "80 distinct keywords across both markets");
    assert.ok(seeds.every((s) => s.origin === null), "the legacy file declares no origin — that IS the finding");
  });

  const run = (script, args) => spawnSync("node", [join(ROOT, "scripts", script), ...args], { encoding: "utf8" });

  test("seed-lint EXITS 2 on the real bad data (CI must block)", () => {
    const r = run("seed-lint.mjs", ["--seeds", join(ROOT, "docs/whatisayurveda-research/demand-raw.json"),
                                    "--ontology", join(FIX, "ontology.bootstrap.json"), "--compound"]);
    assert.equal(r.status, 2, "exit 2 = FAIL; exit 1 would mean harness error");
    assert.ok(r.stdout.includes("turmeric curcumin"));
  });

  test("seed-lint EXITS 0 on the adversarial fixture", () => {
    const r = run("seed-lint.mjs", ["--seeds", join(FIX, "fixture4-adversarial-seeds.json"),
                                    "--ontology", join(FIX, "ontology.bootstrap.json"),
                                    "--audience", join(FIX, "audience.sample.md")]);
    assert.equal(r.status, 0, r.stdout);
  });

  test("keyword-validate EXITS 2 on the real bad data", () => {
    const r = run("keyword-validate.mjs", ["--artifact", join(ROOT, "docs/whatisayurveda-research/demand-raw.json"),
                                           "--ontology", join(FIX, "ontology.bootstrap.json")]);
    assert.equal(r.status, 2);
    assert.ok(r.stdout.includes("S5 (sitemap/IA) MUST REFUSE TO RUN"));
  });

  test("keyword-validate EXITS 2 when --raw contains the adversarial silent-drop capture", () => {
    // The evidence dir deliberately contains res_13 (Labs dropping a row). V9 correctly
    // FAILS on it. That is the gate working on an adversarial capture, not a bug — but
    // the test must SAY so, because a test named "EXITS 0" that asserts 2 is a lie that
    // rots the suite from inside.
    const r = run("keyword-validate.mjs", ["--artifact", join(FIX, "fixture3-clean.artifact.json"),
                                           "--ontology", join(FIX, "ontology.bootstrap.json"),
                                           "--seeds", join(FIX, "fixture2-clean-seeds.json"),
                                           "--audience", join(FIX, "audience.sample.md"),
                                           "--raw", EVIDENCE]);
    assert.equal(r.status, 2, "V9 must fail against res_13, which is IN that directory by design");
    assert.ok(r.stdout.includes("zzqx"), "and it must say why");
  });

  test("keyword-validate EXITS 0 on the clean fixture with a clean capture", () => {
    // The end-to-end green path: without it, the gate could score 100% by failing
    // everything, and a gate that never passes is an outage the team routes around.
    const r = run("keyword-validate.mjs", ["--artifact", join(FIX, "fixture3-clean.artifact.json"),
                                           "--ontology", join(FIX, "ontology.bootstrap.json"),
                                           "--seeds", join(FIX, "fixture2-clean-seeds.json"),
                                           "--audience", join(FIX, "audience.sample.md"),
                                           "--questions", join(FIX, "fixture3-questions.json"),
                                           "--raw", join(FIX, "raw-clean")]);
    assert.equal(r.status, 0, r.stdout);
    assert.ok(r.stdout.includes("VERDICT: PASS"));
  });

  test("the questions fixture is HARVESTED from real PAA bytes, not composed", () => {
    const q = fixture("fixture3-questions.json");
    assert.equal(q.questions.length, 4);
    for (const x of q.questions) {
      assert.equal(x.source, "paa");
      assert.match(x.raw_response_hash, /^sha256:[0-9a-f]{64}$/, "every question names the exact bytes it came from");
    }
    // and the hash must actually match those bytes — a hash nobody verifies is decoration
    const bytes = readFileSync(join(EVIDENCE, "res_05_serp_organic_shilajit_us.json"));
    const h = createHash("sha256").update(bytes).digest("hex");
    assert.equal(q.questions[0].raw_response_hash, `sha256:${h}`);
  });

  test("a missing required arg is a HARNESS error (exit 1), never a silent pass", () => {
    assert.equal(run("seed-lint.mjs", []).status, 1);
    assert.equal(run("keyword-validate.mjs", []).status, 1);
    // No default ontology: an absent ontology would silently pass every seed.
    assert.equal(run("seed-lint.mjs", ["--seeds", join(FIX, "fixture2-clean-seeds.json")]).status, 1);
  });
});
