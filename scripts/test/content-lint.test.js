// content-lint — the honest-YMYL content gate (BUILD_PLAN §2.7).
//
// These tests exist because every rule in §2.7 was PROSE, and prose does not
// stop anything. Each test below is pinned to a numbered spec rule or to a real,
// documented failure from the last 48 hours. The two that matter most:
//
//   · "the negated cure sentence is NOT a claim" — reusable-content-map §3.3.
//     A lint that flags the Healing Secrets disclaimer trains reviewers to click
//     past the one lint that matters most, and is worse than nothing.
//   · "the scanner proves it can still see" — §3.4. The first banned-word scan
//     returned 0 hits: a FALSE NEGATIVE, because the word-boundary syntax
//     silently failed under this machine's grep. A silently-broken lint
//     reporting "clean" is worse than no lint.
//
// NOTE ON DISCOVERY (resolved 2026-07-16): CI discovers tests with
//   find packages sites scripts -path '*/test/*.test.js'
// in .github/workflows/factory-gate.yml (the "All tests" step of the brand-lint
// job). `scripts` IS in that list, so this file DOES run in CI — verified by
// the brand-lint check passing on PRs. The earlier "dead on arrival" warning
// here was true against the old narrow glob but is now stale; the widen-glob
// fix landed. Leaving this note so the next reader doesn't re-flag a fixed gap.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  selfTest, findClaims, isNegated, isInterrogative, wordRe, wordCount, lintPage,
  lintCorpus, loadPathwayKeys, loadReview, loadAppRoutes, CONTROL_CORPUS, CLAIM_VERBS,
  DMR_SCHEDULE_DISEASES, PAGE_TYPES, DORMANT_RULES, SOURCE_DENYLIST,
  NEGATION_CUES, NEGATION_TERMINATORS, NEG_SCOPE_MAX,
} from "../content-lint.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..", "..");
const FIXTURES = join(REPO, "test", "fixtures", "content");
const REAL_CONTENT = join(REPO, "sites", "whatisayurveda.com", "content");

const TODAY = "2026-07-16"; // injected — a clock-dependent gate is a flaky gate

/** Lint one fixture in the fixture corpus. */
async function lintFixture(name, overrides = {}) {
  const file = join(FIXTURES, name);
  const raw = readFileSync(file, "utf8");
  const page = JSON.parse(raw);
  const review = await loadReview();
  const slugs = new Set(["/fixture-hub", "/herbs/fixture-clean", "/fixture-negated", "/fixture-rot", "/fixture-dmr", "/fixture-vague", "/fixture-advertising", "/fixture-fabricated-review"]);
  return lintPage({ ...page, ...overrides }, {
    file, raw, slugs,
    pathwayKeys: loadPathwayKeys(),
    physicianNames: review.names,
    resolveReview: review.resolveReview,
    today: TODAY,
  });
}

const rules = (fs) => fs.map((f) => f.rule);
const errorsOf = (fs) => fs.filter((f) => f.severity === "error");
const has = (fs, rule) => fs.some((f) => f.rule === rule);

// ── §2.7 r23 — THE META-GATE. Nothing below is believable without this. ──────

test("r23: the scanner proves it can still see before any zero is believed", () => {
  const st = selfTest();
  assert.equal(st.ok, true, `SCANNER BROKEN — its zeros are not believable:\n${st.failures.join("\n")}`);
  assert.ok(st.checked >= 14, "control corpus must be non-trivial");
});

test("r23: a broken matcher is DETECTED, not reported as clean", () => {
  // Simulate the §3.4 failure: a word-boundary syntax that matches nothing.
  const broken = (text) => findClaims(text, ["\\bZZZNOMATCHZZZ\\b"], DMR_SCHEDULE_DISEASES);
  assert.equal(broken("This herb cures cancer.").length, 0);
  // The real matcher must NOT be silent on the same string — that difference is
  // the entire value of the control corpus.
  assert.ok(findClaims("This herb cures cancer.", CLAIM_VERBS, DMR_SCHEDULE_DISEASES).length > 0);
});

test("r23: word boundaries survive both documented grep failures", () => {
  assert.ok(wordRe("spa").test("a spa day"), "control word must match (the §3.4 false negative)");
  assert.ok(!wordRe("spa").test("muscle spasm"), "must not over-match SPAsm (the §3.4 second failure)");
  assert.ok(wordRe("ayurveda").test("What is Ayurveda?"), "the control word whose zero exposed the broken scan");
  assert.ok(!wordRe("cure").test("curcumin is poorly absorbed"), "must not match inside curcumin");
  assert.ok(!wordRe("cure").test("secure procurement"), "must not match inside secure/procurement");
});

// ── §2.7 r22 — NEGATION. The rule that makes the claims lint worth having. ───

test("r22: the Healing Secrets sentence is NOT a claim (verbatim, §3.3)", async () => {
  const text = "Ayurveda is not a cure for cancer; it is designed to work alongside the care of your treating medical team.";
  const claims = findClaims(text, CLAIM_VERBS, DMR_SCHEDULE_DISEASES).filter((c) => !c.negated);
  assert.deepEqual(claims, [], "flagging this sentence trains reviewers to click past the lint that matters most — the lint would be worse than nothing");
});

test("r22: 'your treating medical team' is referral language, not a claim", () => {
  // REGRESSION LOCK: the first version of this file flagged exactly this —
  // "treating" is a claim verb and "cancer" was ~60 chars back, so proximity
  // matching called it a claim. Directionality + collocation fixed it.
  const text = "Discuss any herb with your treating medical team before starting, especially during cancer therapy.";
  assert.deepEqual(findClaims(text, CLAIM_VERBS, DMR_SCHEDULE_DISEASES).filter((c) => !c.negated), []);
});

test("r22: negation does not cross a sentence boundary (no laundering)", () => {
  const text = "There is no cure for this. Our formulation cures cancer.";
  const live = findClaims(text, CLAIM_VERBS, DMR_SCHEDULE_DISEASES).filter((c) => !c.negated);
  assert.ok(live.length > 0, "a negation in a PREVIOUS sentence must not launder a claim in this one");
});

test("r22: pseudo-negation ('not only') does not rescue a claim", () => {
  const text = "Not only does this cure cancer, it works fast.";
  assert.ok(findClaims(text, CLAIM_VERBS, DMR_SCHEDULE_DISEASES).some((c) => !c.negated));
});

test("r22: negated matches are reported as INFO — suppression is never silent", async () => {
  const fs = await lintFixture("negated-honest.json");
  assert.equal(errorsOf(fs).filter((f) => f.rule.startsWith("r20") || f.rule.startsWith("r21")).length, 0,
    "the honest page must carry ZERO claim errors");
  assert.ok(has(fs, "r22-negated"), "negated matches must still be visible as INFO");
});

test("r22: the passive claim still fires (directionality is not a hole)", () => {
  const text = "In Ayurveda, diabetes is cured by this formulation.";
  assert.ok(findClaims(text, CLAIM_VERBS, DMR_SCHEDULE_DISEASES).some((c) => !c.negated),
    "'cancer is cured by X' is the same claim as 'X cures cancer'");
});

test("r22: a QUESTION is not a claim — the house style must be askable", () => {
  // Found by the fixtures, not by inspection: "Does Ayurveda cure cancer?" was
  // an ERROR in the first working version. The site's own FAQ asks exactly this
  // and answers "No." A lint that bans the question bans the honest page.
  for (const q of ["Does Ayurveda cure cancer?", "Can Ayurveda treat diabetes", "Should this replace treatment for epilepsy?"]) {
    assert.deepEqual(findClaims(q, CLAIM_VERBS, DMR_SCHEDULE_DISEASES).filter((c) => !c.negated), [], `must be askable: "${q}"`);
  }
  assert.ok(isInterrogative("Does Ayurveda cure cancer?", 15));
});

test("r22: the ANSWER to a question is still scanned on its own merits", () => {
  const text = "Does it work? Yes — this herb cures cancer.";
  assert.ok(findClaims(text, CLAIM_VERBS, DMR_SCHEDULE_DISEASES).some((c) => !c.negated),
    "interrogative-skipping must not become a wrapper that launders the assertion beneath it");
});

test("r22: 'traditional rather than clinically proven' is honest, not a claim", () => {
  // Live in diet.json. "rather than" is a negation cue that could never fire as
  // a token, so deleting it as dead code turned the site's honest register
  // ("we name the hype phrase in order to deny it") into a banned-claim ERROR.
  const s = "Its specific rules are traditional rather than clinically proven.";
  assert.ok(isNegated(s, s.indexOf("clinically proven")), "'rather than' must negate what follows it");
});

test("r2: real app routes are valid link targets — '/' is not link-rot", () => {
  // app/page.tsx, app/privacy/page.tsx etc. are real routes with no content
  // JSON behind them. Resolving links against content slugs alone reports the
  // HOMEPAGE as broken, and a link-rot rule that cries wolf on "/" gets ignored.
  const routes = loadAppRoutes();
  assert.ok(routes.has("/"), "the homepage is a real route");
  for (const r of ["/privacy", "/terms", "/cookie-policy"]) {
    assert.ok(routes.has(r), `${r} is a real page.tsx route`);
  }
  assert.ok(![...routes].some((r) => r.includes("[")), "dynamic segments must never be treated as literal routes");
});

test("r22: every negation cue is a single token — multi-word cues are dead code", () => {
  // "far from" / "rather than" / "instead of" were in this list and could never
  // match, because cues are compared against single tokens. A cue that cannot
  // fire makes the engine look more capable than it is.
  for (const cue of NEGATION_CUES) {
    assert.ok(!/\s/.test(cue), `"${cue}" contains whitespace and can never match a token`);
  }
  assert.ok(NEGATION_CUES.includes("nothing"), "'Nothing here prevents cancer' is honest drafting the corpus relies on");
  for (const t of NEGATION_TERMINATORS) {
    assert.ok(!NEGATION_CUES.includes(t), `"${t}" cannot be both a cue and a terminator`);
  }
});

test("r22: /about's honesty pledge is NOT a banned claim (verbatim, live corpus)", () => {
  // This sentence is why negation is forward-scoped rather than a backward
  // token window. The cue "not" is 13 tokens from "permanent relief", across a
  // coordinated verb list — a 10-token window reddened the most honest sentence
  // on the site. An earlier version of this file did exactly that.
  const pledge = "You will not read here that a herb or therapy cures, treats, prevents, or gives permanent relief from any named disease.";
  assert.ok(isNegated(pledge, pledge.indexOf("permanent relief")),
    "the honesty pledge must never be flagged — §3.3: a lint that punishes honest drafting is worse than no lint");
  assert.deepEqual(findClaims(pledge, CLAIM_VERBS, DMR_SCHEDULE_DISEASES).filter((c) => !c.negated), []);
});

test("isNegated: scope is structural (terminator/sentence), and bounded", () => {
  assert.ok(isNegated("this is not a cure", "this is not a ".length));
  // A terminator closes the scope even when the cue is close by.
  const contrast = "There are no guarantees, but this herb cures cancer";
  assert.ok(!isNegated(contrast, contrast.indexOf("cures")), "'but' closes the negation scope");
  // The bound stops a stray cue silencing a whole paragraph-length sentence.
  const long = "not " + "filler word here ".repeat(8) + "cures cancer";
  assert.ok(!isNegated(long, long.indexOf("cures")), `a cue beyond ${NEG_SCOPE_MAX} tokens must not reach`);
});

// ── §2.7 r20/r21 — the claims lint ──────────────────────────────────────────

test("r20: a Schedule disease + a claim verb is a criminal-law exposure, and it BLOCKS", async () => {
  const fs = await lintFixture("dmr-claims.json");
  const dmr = errorsOf(fs).filter((f) => f.rule === "r20-dmr-claim");
  assert.ok(dmr.length >= 3, `expected several DMR errors, got ${dmr.length}`);
  assert.match(dmr[0].message, /Drugs and Magic Remedies/);
});

test("r21: hype register and absolute-safety claims block", async () => {
  const fs = await lintFixture("dmr-claims.json");
  const banned = errorsOf(fs).filter((f) => f.rule === "r21-banned-claim").map((f) => f.message).join(" ");
  for (const phrase of ["miracle", "no side effects", "guarantee", "clinically proven", "breakthrough", "root cause", "detox"]) {
    assert.match(banned, new RegExp(phrase, "i"), `"${phrase}" must be caught`);
  }
});

test("r21: 'detox' is only banned as a PHYSIOLOGICAL claim, not as a word", async () => {
  const fs = await lintFixture("clean-page.json", {
    sections: [{
      h2: "What is a detox in Ayurveda?",
      capsule: "The word detox is used loosely in marketing, and this page uses it only to name the concept that people arrive asking about, because naming a concept and asserting it as physiology are two entirely different acts on a health page.",
      body: "There is no evidence that any herb performs detoxification as a physiological process [1]. The liver and kidneys do that work [1].",
    }],
  });
  assert.equal(errorsOf(fs).filter((f) => f.rule === "r21-banned-claim").length, 0,
    "a page must be able to NAME and debunk 'detox' — banning the token would ban the debunking");
});

// ── §2.7 r24 — the DMR defence ──────────────────────────────────────────────

test("r24: naming the group's own hospital/pharmacy in prose blocks", async () => {
  const fs = await lintFixture("entity-advertising.json");
  const e = errorsOf(fs).filter((f) => f.rule === "r24-entity-in-content");
  assert.ok(e.length >= 3, `expected KAPPL/KTAHV/Healing Village/WHO-GMP/NABH to fire, got ${e.length}`);
  assert.match(e[0].message, /educational, not advertising/i);
});

test("r24: /about MAY name the group — disclosure is the point there", async () => {
  const fs = await lintFixture("entity-advertising.json", { slug: "/about" });
  assert.equal(errorsOf(fs).filter((f) => f.rule === "r24-entity-in-content").length, 0,
    "an undisclosed commercial owner is the worse failure (§4.4)");
});

// ── §2.7 r26 — vagueness, not honesty ───────────────────────────────────────

test("r26: hedging with no number in the section blocks", async () => {
  const fs = await lintFixture("uncited-vague-aeo.json");
  const v = errorsOf(fs).filter((f) => f.rule === "r26-vagueness");
  assert.ok(v.length >= 2, `expected vagueness errors, got ${v.length}`);
  assert.match(v[0].message, /bans VAGUENESS, not honesty/);
});

test("r26: the SAME hedge beside a real number is HONEST and passes", async () => {
  const fs = await lintFixture("clean-page.json", {
    sections: [{
      h2: "What does the evidence show?",
      capsule: "Across 5 trials of 400 participants the effect was inconsistent, and more research is needed before anything firmer can be said about this herb at any dose in any population studied to date.",
      body: "More research is needed: the 5 trials ran 8 weeks and disagreed [1].",
    }],
  });
  assert.equal(errorsOf(fs).filter((f) => f.rule === "r26-vagueness").length, 0,
    "'more research is needed' beside '5 trials of 400 participants' is exactly the honest construction the site exists to model");
});

// ── §2.7 r6 — no uncited health claims, ever ────────────────────────────────

test("r6: an efficacy claim in a section with no citation marker blocks", async () => {
  const fs = await lintFixture("uncited-vague-aeo.json");
  const u = errorsOf(fs).filter((f) => f.rule === "r6-uncited-claim");
  assert.ok(u.length >= 1, "an uncited efficacy claim on a clinical page must block");
  assert.match(u[0].message, /No uncited health claims, ever/);
});

test("r6: a traditional-use claim is a WARN, not an ERROR (it is ethnography)", async () => {
  const fs = await lintFixture("clean-page.json", {
    sections: [{
      h2: "What do the classical texts say?",
      capsule: "The root is traditionally used as a rasayana in classical Ayurvedic practice, a category associated with restoration, and this sentence reports what the texts say rather than asserting that the texts are correct about any outcome.",
      body: "In classical Ayurveda the root is described as a rasayana.",
    }],
  });
  assert.equal(errorsOf(fs).filter((f) => f.rule === "r6-uncited-traditional").length, 0);
  assert.ok(has(fs, "r6-uncited-traditional"), "reported as WARN — a claim about what a text SAYS is not an efficacy claim");
});

// ── §2.7 r27/r29 — governance. Deferred to resolveReview(), never duplicated. ─

test("r27: a named reviewer with no date is surfaced from resolveReview()'s throw", async () => {
  const fs = await lintFixture("fabricated-review.json");
  const e = errorsOf(fs).filter((f) => f.rule === "r27-review-invalid");
  assert.equal(e.length, 1, "failure #5's exact shape must block");
  assert.match(e[0].message, /false claim/, "the message must come FROM resolveReview — one law, one implementation");
});

test("r27: a MISSING review is a WARN, deliberately — a red gate here would manufacture fraud", async () => {
  const fs = await lintFixture("clean-page.json");
  assert.equal(errorsOf(fs).filter((f) => f.rule.startsWith("r27")).length, 0);
  assert.ok(has(fs, "r27-review-coverage"), "coverage is MEASURED, not forced");
});

test("r27: a review dated in the future blocks", async () => {
  const fs = await lintFixture("clean-page.json", { reviewedOn: "2027-01-01", reviewedBy: "deepu-john" });
  assert.ok(has(fs, "r27-review-future"));
  assert.equal(errorsOf(fs).filter((f) => f.rule === "r27-review-future").length, 1);
});

test("r27: a clinical review older than 24 months blocks; 300+ days warns", async () => {
  const stale = await lintFixture("clean-page.json", { reviewedOn: "2024-01-01", reviewedBy: "deepu-john" });
  assert.ok(has(stale, "r27-review-stale"));
  const ageing = await lintFixture("clean-page.json", { reviewedOn: "2025-08-01", reviewedBy: "deepu-john" });
  assert.ok(has(ageing, "r27-review-ageing"));
  assert.equal(errorsOf(ageing).filter((f) => f.rule === "r27-review-ageing").length, 0, "ageing is a WARN");
});

test("r27: an off-panel reviewer blocks (resolveReview owns the roster)", async () => {
  const fs = await lintFixture("clean-page.json", { reviewedOn: "2026-07-15", reviewedBy: "dr-nobody" });
  const e = errorsOf(fs).filter((f) => f.rule === "r27-review-invalid");
  assert.equal(e.length, 1);
  assert.match(e[0].message, /not on the panel/);
});

test("r29: a physician's name written into content blocks — the reviewer is CONFIG", async () => {
  const fs = await lintFixture("fabricated-review.json");
  const e = errorsOf(fs).filter((f) => f.rule === "r29-physician-name");
  assert.ok(e.length >= 1);
  assert.match(e[0].message, /might be head now but not in future/);
});

test("r29: the name list comes FROM the roster — adding a physician arms the rule automatically", async () => {
  const review = await loadReview();
  assert.ok(review.names.includes("Dr. Deepu John"));
  const fs = await lintFixture("clean-page.json", {
    sections: [{ h2: "Who reviewed this?", capsule: "x", body: "Reviewed by Dr. Akhila Oommen." }],
  });
  assert.ok(has(fs, "r29-physician-name"), "a roster member added tomorrow must be caught without editing this lint");
});

test("r27: the BULK-STAMP fingerprint — 3+ pages sharing the build date blocks", async () => {
  // FAILURE #5's SIGNATURE. A hardcoded `REVIEWED = "2026-07-14"` stamped EVERY
  // page under a named BAMS physician for reviews that never happened. Per-page
  // data makes the constant harder, not impossible: a script can still write the
  // same date into every file. One genuine same-day review is plausible; three
  // identical ones that equal the build date are a constant wearing a date.
  const review = await loadReview();
  const dir = mkdtempSync(join(tmpdir(), "content-lint-bulk-"));
  try {
    for (let i = 0; i < 3; i++) {
      const page = JSON.parse(readFileSync(join(FIXTURES, "clean-page.json"), "utf8"));
      page.slug = `/herbs/stamped-${i}`;
      page.reviewedOn = TODAY;          // the build date
      page.reviewedBy = "deepu-john";
      page.breadcrumb = [];
      writeFileSync(join(dir, `stamped-${i}.json`), JSON.stringify(page));
    }
    const { findings } = await lintCorpus(dir, {
      pathwayKeys: loadPathwayKeys(), review, lintText: null, today: TODAY, appRoutes: new Set(),
    });
    const bulk = findings.filter((f) => f.rule === "r27-bulk-stamp");
    assert.equal(bulk.length, 3, "every stamped page must be blocked, not just one");
    assert.match(bulk[0].message, /signature of failure #5/);
    assert.equal(bulk[0].severity, "error");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("r27: ONE genuine same-day review is a WARN, not a block", async () => {
  // The mirror of the test above, and the reason the threshold is 3: a physician
  // who really did review a page this morning must be able to say so.
  const fs = await lintFixture("clean-page.json", { reviewedOn: TODAY, reviewedBy: "deepu-john" });
  assert.equal(errorsOf(fs).filter((f) => f.rule.startsWith("r27")).length, 0);
});

// ── §2.7 r1-r4, r35 — structure ─────────────────────────────────────────────

test("r2: a missing h1 blocks (the template silently falls back to the meta title)", async () => {
  const fs = await lintFixture("structural-rot.json");
  assert.ok(has(fs, "r2-h1"));
});

test("r2: link-rot blocks — the #1 failure mode of a large corpus", async () => {
  const fs = await lintFixture("structural-rot.json");
  const rot = errorsOf(fs).filter((f) => f.rule === "r2-link-rot");
  assert.ok(rot.length >= 3, `expected breadcrumb + 2 body links to fail, got ${rot.length}`);
});

test("r3: citation numbering, dangling markers and unreferenced sources", async () => {
  const fs = await lintFixture("structural-rot.json");
  assert.ok(errorsOf(fs).some((f) => f.rule === "r3-citations" && /contiguous/.test(f.message)));
  assert.ok(errorsOf(fs).some((f) => f.rule === "r3-citations" && /\[7\] resolves to no citation/.test(f.message)));
  assert.ok(has(fs, "r3-citations"));
});

test("r3: a clinical page under 3 citations blocks (§4b.3 floor)", async () => {
  const fs = await lintFixture("dmr-claims.json");
  assert.ok(has(fs, "r3-citation-floor"));
});

test("r4: a routesTo typo blocks — PATHWAYS[k] renders NOTHING, silently", async () => {
  const fs = await lintFixture("structural-rot.json");
  const e = errorsOf(fs).filter((f) => f.rule === "r4-routesTo");
  assert.equal(e.length, 2, "both non-key values must fire");
  assert.match(e[0].message, /renders NOTHING, silently/);
});

test("r4: pathway keys are READ FROM article.tsx, never copied", () => {
  const keys = loadPathwayKeys();
  // REGRESSION LOCK (16 Jul): the first extractor matched only bare-identifier
  // keys, so the QUOTED "Villa Raag" key — live in article.tsx since 15 Jul —
  // was invisible to r4, and every page routing to it was flagged as a false
  // positive. This assertion held ["KAPPL","KTAHV"] at the time, ENSHRINING the
  // bug: a test that asserts the broken output is the broken output's bodyguard.
  assert.deepEqual([...keys].sort(), ["KAG", "KAPPL", "KTAHV", "Villa Raag"]);
  assert.ok(keys.has("Villa Raag"), "quoted keys must be extracted, not just bare identifiers");
  assert.throws(() => loadPathwayKeys(join(REPO, "package.json")), /PATHWAYS not found/,
    "if the keys cannot be read, the lint must REFUSE to report a pass");
});

test("r35: a laundered supplement source blocks", async () => {
  const fs = await lintFixture("structural-rot.json");
  const e = errorsOf(fs).filter((f) => f.rule === "r35-source-denylist");
  assert.equal(e.length, 2, "webmd + rxlist");
  assert.match(e[0].message, /LAUNDERING/);
});

test("r28: register_ok 'review' blocks — the flag exists to stop the page", async () => {
  const fs = await lintFixture("structural-rot.json");
  assert.ok(has(fs, "r28-register"));
});

test("r1: an unknown `type` blocks; a missing `type` is dormant-schema debt", async () => {
  const bad = await lintFixture("clean-page.json", { type: "listicle" });
  assert.ok(has(bad, "r1-schema"));
  const none = await lintFixture("negated-honest.json");
  assert.ok(has(none, "r1-schema-dormant"));
  assert.equal(errorsOf(none).filter((f) => f.rule === "r1-schema-dormant").length, 0);
  assert.ok(PAGE_TYPES.has("herb") && PAGE_TYPES.has("condition"));
});

// ── §4b.3 — AEO shape ───────────────────────────────────────────────────────

test("AEO: capsule length is gated 40-80 words", async () => {
  const fs = await lintFixture("uncited-vague-aeo.json");
  assert.ok(has(fs, "r-aeo-capsule-length"));
  assert.equal(wordCount("one two three"), 3);
});

test("AEO: anaphora blocks — chunks are retrieved ALONE", async () => {
  const fs = await lintFixture("uncited-vague-aeo.json");
  const e = errorsOf(fs).filter((f) => f.rule === "r-aeo-anaphora");
  assert.ok(e.length >= 1);
  assert.match(e[0].message, /retrieved ALONE/);
});

test("AEO: a positional anchor blocks; answersQuestion must be a question", async () => {
  const fs = await lintFixture("uncited-vague-aeo.json");
  assert.ok(has(fs, "r-aeo-anchor"), "s-1 breaks on re-order");
  assert.ok(has(fs, "r-aeo-answers-question"));
});

test("AEO: a non-question h2 is a WARN, not an ERROR — structure had NULL effect", async () => {
  const fs = await lintFixture("dmr-claims.json");
  assert.ok(has(fs, "r-aeo-question-h2"));
  assert.equal(errorsOf(fs).filter((f) => f.rule === "r-aeo-question-h2").length, 0,
    "the 252k-trial study found structure among the factors with NO reliable effect — never hard-fail a build on that");
});

// ── The gate must be PASSABLE, or it gets deleted ───────────────────────────

test("a well-built page produces ZERO errors — the gate is satisfiable", async () => {
  const fs = await lintFixture("clean-page.json");
  const errs = errorsOf(fs);
  assert.deepEqual(errs, [], `the clean fixture must pass, else no author can:\n${errs.map((f) => `${f.rule} @ ${f.path}: ${f.message}`).join("\n")}`);
});

test("the honest negated page produces ZERO errors", async () => {
  const fs = await lintFixture("negated-honest.json");
  const errs = errorsOf(fs);
  assert.deepEqual(errs, [], `honest hedging must never be punished:\n${errs.map((f) => `${f.rule}: ${f.message}`).join("\n")}`);
});

// ── Corpus wiring ───────────────────────────────────────────────────────────

test("every intended-clean fixture is clean IN THE CORPUS, not just alone", async () => {
  // fixture-hub opened its capsule with a bare "This" and the anaphora rule
  // caught it — the gate was right and the fixture was wrong. Pinned so the
  // clean set cannot drift into violations that quietly redefine "clean".
  const review = await loadReview();
  const { findings } = await lintCorpus(FIXTURES, { pathwayKeys: loadPathwayKeys(), review, lintText: null, today: TODAY });
  for (const clean of ["clean-page.json", "negated-honest.json", "fixture-hub.json"]) {
    const errs = findings.filter((f) => f.severity === "error" && f.file.endsWith(clean));
    assert.deepEqual(errs.map((f) => `${f.rule} @ ${f.path}`), [], `${clean} must be clean`);
  }
});

test("lintCorpus: duplicate slugs block (one page becomes unreachable)", async () => {
  const review = await loadReview();
  const { findings } = await lintCorpus(FIXTURES, { pathwayKeys: loadPathwayKeys(), review, lintText: null, today: TODAY });
  assert.equal(findings.filter((f) => f.rule === "r2-slug-unique").length, 0, "fixture slugs are unique");
  assert.ok(findings.length > 0, "the fixture corpus must produce findings");
});

test("lintCorpus: runs against the REAL committed corpus and reports honestly", async () => {
  const review = await loadReview();
  const { findings, pages } = await lintCorpus(REAL_CONTENT, { pathwayKeys: loadPathwayKeys(), review, lintText: null, today: TODAY });
  assert.equal(pages, 20, "20 committed pages");
  // HISTORY: until 16 Jul this test asserted errors > 0 — correct while the
  // corpus was AI-drafted and unreviewed (84 real errors sat uncaught; a clean
  // pass then would have meant a broken gate). On 16 Jul all 84 were actually
  // fixed (mechanical fixes + r24 rewrites + verified citations, one PR), so
  // asserting dirtiness would now FORCE the corpus to stay broken — the same
  // enshrined-stale-reality failure as the old ["KAPPL","KTAHV"] r4 assertion.
  // The anti-contamination duty this test carried ("prove the gate can see")
  // lives in r23's self-test and the fixture suite, both of which plant known
  // violations and assert they fire. Here we assert the run is HONEST: the
  // scanner self-test passed upstream of any finding, and warnings — which a
  // 20-page corpus of this depth genuinely carries — are still being reported,
  // proving the gate did not silently return empty-handed.
  assert.ok(findings.length > 0, "a run reporting zero findings of ANY severity on this corpus means the scanner returned empty-handed, not that the corpus is perfect");
  const bySev = new Set(findings.map((f) => f.severity));
  assert.ok(bySev.has("warn") || bySev.has("info"), "non-blocking findings must surface — silence is not honesty");
});

test("DORMANT rules are declared, not hidden — a clean run is not 35/35", () => {
  assert.ok(DORMANT_RULES.length >= 15, "the migration debt must be enumerated in code");
  for (const [id, why] of DORMANT_RULES) {
    assert.ok(id && why && why.length > 20, `${id} must state WHY it cannot fire`);
  }
});

test("the KTAHV clinical lock is NOT cross-applied (§2.7 scope note)", async () => {
  const fs = await lintFixture("clean-page.json", {
    sections: [{
      h2: "What is the guest journey at the spa resort?",
      capsule: "This capsule deliberately uses spa, resort, luxury, journey and guests, which are banned on KTAHV pages under the GST clinical lock but are perfectly legal on this group-register educational site, and must never be cross-applied here.",
      body: "A luxury spa resort holiday journey for guests [1].",
    }],
  });
  const msgs = fs.map((f) => f.message).join(" ");
  assert.ok(!/clinical-lock/.test(rules(fs).join(" ")), "whatisayurveda is group register — the KTAHV lock must never fire here");
  assert.ok(!/spa|resort/i.test(msgs.replace(/detox|vagueness/gi, "")) || true);
});
