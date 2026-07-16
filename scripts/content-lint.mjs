#!/usr/bin/env node
/**
 * content-lint — the honest-YMYL content gate for whatisayurveda.com.
 *
 * WHY THIS EXISTS
 * ---------------
 * BUILD_PLAN.md §2.7 specifies 35 content rules and scores today's coverage at
 * ZERO. Every one of them was prose. This file is the machine. It follows the
 * `resolveReview()` pattern (app/lib/medical-review.ts): take the prose rule,
 * apply it to the highest-stakes surface, and make the violation FAIL THE BUILD.
 *
 * It lints the content JSON — the artifact an author actually writes — so that
 * a dishonest page is unrepresentable rather than merely discouraged.
 *
 * WHAT IT DOES NOT DO (stated, not hidden — an honest absence beats a false claim)
 *   · It does not fetch citation URLs (§2.7 r3 assigns that to the weekly QA
 *     rotation). A CI gate that needs the network is a gate that gets disabled.
 *     URL *shape* is checked; URL *liveness* is not. See DORMANT_RULES.
 *   · It does not re-implement the review-claim rules. It CALLS `resolveReview()`
 *     and reports what that function throws. One law, one implementation.
 *   · It does not re-implement banned-filler / locked-facts. It CALLS
 *     `packages/compliance` `lintText()` and re-filters its cure-claim hits
 *     through this file's negation engine (§2.7 r22 — see NEGATION, below).
 *   · ~15 of the 35 rules describe schema that is NOT BUILT YET (`type`,
 *     `evidence`, `safety`, `entity`, `classicalBasis`…). They are implemented
 *     but DORMANT — they fire the moment the field appears, and the corpus
 *     report prints the dormancy count so it can never be mistaken for a pass.
 *
 * SEVERITY SPLIT — the justification (the whole gate's credibility rests here)
 *   ERROR (exit 2, blocks CI) = the page as it ships TODAY is dishonest, unsafe,
 *     legally exposed, or structurally broken. A human cannot be trusted to
 *     remember these at 3,400 pages; that is the point of a gate.
 *   WARN  (exit 0, reported)  = one of exactly four things, never a soft opinion:
 *     (a) DORMANT — the rule's field does not exist yet (migration debt, counted);
 *     (b) the SPEC ITSELF says warn → human review (§2.7 r16 distribution check);
 *     (c) the rule is UNRATIFIED in the spec (§2.7 r25 is marked 🔴 Ratify) —
 *         we do not hard-fail a build on a rule Abilash has not approved;
 *     (d) the machine CANNOT know the answer, only the smell (a review date that
 *         equals the build date might be a real same-day review — see r27).
 *   Nothing is a WARN because it was inconvenient. Per CLAUDE.md rule (g), a
 *   failing gate is never fixed by weakening it.
 *
 * ONE SPEC RULE IS OVERRIDDEN ON PURPOSE — §2.7 r27, and here is the argument.
 *   r27 says `review.reviewedOn` is REQUIRED on every health page. Abilash's
 *   15 Jul tiered-honesty ruling (encoded in medical-review.ts) says the opposite:
 *   a page without a review is honest and expected, because one physician cannot
 *   review 3,400 pages. If this gate made a missing review date RED, the builder
 *   staring at 11 red clinical pages would type a date — and typing a date under
 *   a real BAMS physician's name for a review that never happened IS failure #5,
 *   the exact fabrication this pipeline exists to prevent. A gate that
 *   manufactures the fraud it audits is worse than no gate. So: a MISSING review
 *   is a WARN (a counted coverage gap). A FALSE review is an ERROR. Honesty is
 *   gated; coverage is measured.
 *
 * NEGATION (§2.7 r22) — the rule that makes the claims lint worth having.
 *   `reusable-content-map.md` §3.3: the Healing Secrets booklet says turmeric
 *   "is not a cure for cancer; it is designed to work alongside the care of your
 *   treating medical team". That is EXEMPLARY honest drafting and a naive lint
 *   flags it. Train reviewers to click past the one lint that matters most and
 *   the lint is worse than nothing. So every claim match runs through a
 *   NegEx-style token-window check first. Suppressed matches are reported as
 *   INFO — nothing disappears silently.
 *
 * SELF-TEST (§2.7 r23) — the meta-rule, and the reason to trust a zero.
 *   §3.4: the first banned-word scan returned 0 hits — a FALSE NEGATIVE. The
 *   `[[:<:]]` word-boundary syntax silently fails under this machine's grep
 *   (it is ugrep). The control word "ayurveda" also returned 0, which is what
 *   exposed it. The second attempt over-matched, counting "SPAsm" as "spa".
 *   A silently-broken banned-word lint reporting "clean" is worse than no lint.
 *   Therefore: this scanner validates its own matchers against a control corpus
 *   of known-present and known-absent strings BEFORE it will report any result.
 *   If the control fails, the run EXITS 2 and reports "SCANNER BROKEN" — it never
 *   reports "clean". A zero from this file is only believable because of this.
 *
 * SCOPE BOUNDARY (§2.7 note). whatisayurveda is GROUP/EDUCATIONAL register.
 * The KTAHV clinical lock does NOT apply here and is never cross-applied:
 * "spa"/"resort"/"luxury"/"journey"/"guests" are NOT banned on this site.
 * "cure"/"treats"/"heals" are — for entirely different reasons (DMR + YMYL).
 *
 * USAGE
 *   node scripts/content-lint.mjs [--dir <path>] [--json] [--quiet]
 * EXIT
 *   0 = clean (or warnings only)   2 = ERROR findings, or scanner self-test failed
 *   1 = harness error (could not read corpus / roster / pathway keys)
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolvePath(HERE, "..");
const SITE = join(REPO, "sites", "whatisayurveda.com");
const DEFAULT_CONTENT_DIR = join(SITE, "content");
const ARTICLE_TSX = join(SITE, "app", "_components", "article.tsx");
const MEDICAL_REVIEW_TS = join(SITE, "app", "lib", "medical-review.ts");

/**
 * @typedef {"error"|"warn"|"info"} Severity
 * @typedef {{severity:Severity, rule:string, file:string, line:number, path:string,
 *            message:string, excerpt:string}} Finding
 */

// ─────────────────────────────────────────────────────────────────────────────
// RULE DATA — transcribed from BUILD_PLAN.md §2.7 / §4b.3 and the teardowns.
// Amendments are spec changes, not code changes. Cite the source on every list.
// ─────────────────────────────────────────────────────────────────────────────

/** §2.7 r1 — the ten page types (BUILD_PLAN §1.1 / §4b.3 SCHEMA_BY_TYPE). */
export const PAGE_TYPES = new Set([
  "herb", "formulation", "condition", "therapy", "question",
  "concept", "classical-text", "pharmacopoeia", "hub", "news", "reference",
]);

/**
 * §2.7 r20 — The Drugs and Magic Remedies (Objectionable Advertisements) Act,
 * 1954. Advertising a remedy for any Schedule disease is COGNIZABLE — up to six
 * months' imprisonment on first conviction. The site's defence is that it is
 * EDUCATIONAL, not advertising; §4 F5 (Kairali entities named in main content)
 * is exactly what erodes that defence, which is why r24 is an ERROR too.
 * Diseases as enumerated in BUILD_PLAN §2.7 r20.
 */
export const DMR_SCHEDULE_DISEASES = [
  // PLAIN TEXT ONLY — wordRe() escapes every token and supplies the boundaries.
  // Never put regex source here: it made wordRe() carry an escape-bypass branch,
  // and that branch is what silently killed rule 29.
  "cancer", "tumour", "tumor", "diabetes", "heart disease", "cardiac disease",
  "blood pressure", "hypertension", "epilepsy", "fits", "paralysis", "obesity",
  "tuberculosis", "TB", "sterility", "infertility", "impotence",
  "insanity", "mental disorder", "rheumatism", "arthritis",
  "AIDS", "HIV", "leprosy", "asthma", "cataract", "deafness", "glaucoma",
  "goitre", "hernia", "jaundice", "kidney stone", "leucoderma", "stature",
];

/**
 * §2.7 r20/r21 — claim verbs. These are what turns a disease noun into an
 * advertisement. Negation-aware at the call site (r22).
 */
export const CLAIM_VERBS = [
  "cure", "cures", "cured", "curing", "treat", "treats", "treated", "treating",
  "heal", "heals", "healed", "healing", "prevent", "prevents", "prevented",
  "reverse", "reverses", "reversed", "remedy for", "remedies for", "eliminates",
  "eradicates",
];

/**
 * §2.7 r21 — banned phrases. Flat bans: no proximity needed, the phrase is the
 * violation wherever it appears in prose.
 */
export const BANNED_CLAIM_PHRASES = [
  { re: /\bpermanent(?:ly)?\s+(?:relief|cure[ds]?|remission)\b/giu, note: "permanence claim" },
  { re: /\bguaranteed?\b/giu, note: "guarantee claim" },
  { re: /\bmiracle\b/giu, note: "miracle claim" },
  { re: /\bno\s+side[\s-]?effects?\b/giu, note: "'no side effects' — a safety claim no herb can carry" },
  { re: /\bcompletely\s+safe\b/giu, note: "absolute safety claim" },
  { re: /\b100%\s*(?:safe|natural|effective)\b/giu, note: "absolute claim" },
  { re: /\bclinically\s+proven\b/giu, note: "'clinically proven' — the evidence grade says otherwise" },
  { re: /\bbreakthrough\b/giu, note: "hype register" },
  { re: /\bscience\s+finally\s+confirms\b/giu, note: "hype register" },
  { re: /\bancient\s+wisdom\s+validated\b/giu, note: "hype register" },
  { re: /\broot\s+cause\b/giu, note: "'root cause' as biomedical causation" },
];

/**
 * §2.7 r21 — `detox` as a PHYSIOLOGICAL claim. Not a flat ban: Panchakarma
 * pages must be able to name and then debunk the concept, and the site's
 * `/panchakarma` cluster does exactly that. Fires only in a physiological frame.
 */
export const DETOX_CLAIM_RE =
  /\b(?:detox(?:es|ify|ifies|ification|ifying)?)\s+(?:the\s+)?(?:body|blood|liver|system|cells?|tissues?|organs?)\b/giu;

/**
 * §2.7 r26 / §4b.2 — vagueness. FAILS unless a specific number appears in the
 * same section. Bans vagueness, NOT honesty: "more research is needed" is fine
 * beside "in 3 trials of 41 participants". It is not fine alone.
 */
export const VAGUENESS_PHRASES = [
  /\bmay\s+possibly\b/giu,
  /\bsome\s+people\s+find\b/giu,
  /\bmore\s+research\s+is\s+needed\b/giu,
  /\bstudies\s+suggest\b/giu,
  /\bmany\s+experts\s+(?:believe|agree)\b/giu,
];

/** §4b.3 / teardown-aeo-geo §B2 — anaphora. Chunks are retrieved ALONE. */
export const ANAPHORA_PATTERNS = [
  /\bas\s+(?:mentioned|noted|discussed)\s+(?:above|earlier|previously)\b/giu,
  /\bthis\s+article\b/giu,
  /\bsee\s+(?:below|above)\b/giu,
  /^(?:It|This|They|These|Those|Such)\s+/u, // bare leading pronoun = unresolvable alone
];

/**
 * §2.7 r24 / §4 F5 — Kairali entities in MAIN CONTENT. The educational defence
 * against DMR (r20) dies the moment a page reads as an advertisement for the
 * group's own hospital and pharmacy. Allowed ONLY in the `pathway` aside, which
 * `routesTo` renders and which is not authored prose.
 */
export const KAIRALI_ENTITY_PATTERNS = [
  /\bKAPPL\b/gu,
  /\bKairali\s+Ayurvedic\s+Products\b/giu,
  /\bWHO[\s-]?GMP\b/giu,
  /\bKTAHV\b/gu,
  /\b(?:The\s+)?Ayurvedic\s+Healing\s+Village\b/giu,
];

/**
 * PROPOSED, NOT RATIFIED — reported as WARN, never as a build failure.
 *
 * §2.7 r24 enumerates a specific list, and NABH is not on it. But "NABH-
 * accredited" is how this group refers to its own hospital, and it fires 25
 * times across the corpus — so it is either a real hole in r24 or noise, and
 * that is Abilash's call, not mine. A builder who quietly promotes his own
 * additions into a blocking gate is doing the thing this pipeline exists to
 * stop: declaring doctrine that was never ratified (failure #8). Ratify → move
 * it up into KAIRALI_ENTITY_PATTERNS. Reject → delete this block.
 */
export const KAIRALI_ENTITY_PROPOSED = [
  /\bNABH\b/gu,
];

/**
 * §2.7 r24 — pages where naming the group is the POINT, not a violation.
 * /about is where the commercial relationship must be disclosed (§4.4); an
 * undisclosed owner is the worse failure. Recorded reason, not a silent skip.
 */
export const ENTITY_DISCLOSURE_PAGES = new Set(["/about", "/editorial-policy"]);

/**
 * §2.7 r35 — SOURCE DENYLIST. "The failure mode for this site is not
 * fabrication — it is LAUNDERING a supplement blog's claim into a cited-looking
 * safety statement." (This is how the triphala-antiplatelet myth propagates.)
 */
export const SOURCE_DENYLIST = [
  // Named verbatim in §2.7 r35.
  "webmd.com", "rxlist.com", "actizeet.in", "supersonicfood.com",
  "nutrawiki.org", "droracle.ai",
  // "supplement retailers" — a CATEGORY r35 names; these are instances of it.
  "iherb.com", "amazon.", "vitaminshoppe.com", "banyanbotanicals.com",
  "organicindia.com", "himalayawellness.com",
];

/**
 * PROPOSED under r35's "or similar" — reported as WARN, never a build failure.
 *
 * Healthline is not named in r35 and is not a retailer; it is a health content
 * mill of the WebMD class, which is arguably "or similar". It is also the ONLY
 * thing r35 currently catches: the corpus cites healthline.com/nutrition 6 times
 * and cites WebMD/RxList zero times. So the entire live effect of r35 today rests
 * on a source I chose to add. That decision belongs to whoever owns the source-
 * tier policy (§4.3), not to this file. Ratify → move it up. Reject → delete.
 */
export const SOURCE_DENYLIST_PROPOSED = ["healthline.com"];

/** §2.7 r19 — slugs that must never publish. Empty today; the hook exists. */
export const DO_NOT_PUBLISH_SLUGS = new Set([]);

/** §2.7 r17 — dose patterns are forbidden on condition pages. */
export const DOSE_RE = /\b\d+(?:\.\d+)?\s?(?:mg|g|ml|mcg|µg|tsp|tbsp|IU)\b/giu;

/** Health-outcome nouns — the object half of an efficacy claim (r6). */
export const HEALTH_OUTCOME_NOUNS = [
  "anxiety", "stress", "sleep", "insomnia", "inflammation", "pain",
  "cholesterol", "blood sugar", "blood pressure", "immunity", "digestion",
  "memory", "cognition", "depression", "fatigue", "joint pain", "arthritis",
  "weight", "fertility", "testosterone", "cortisol", "liver", "gut",
];

/** Efficacy verbs — the action half of an efficacy claim (r6). */
export const EFFICACY_VERBS = [
  "reduce", "reduces", "reduced", "reducing", "improve", "improves", "improved",
  "improving", "lower", "lowers", "lowered", "lowering", "relieve", "relieves",
  "relieved", "increase", "increases", "increased", "boost", "boosts", "boosted",
  "enhance", "enhances", "enhanced", "alleviate", "alleviates", "alleviated",
];

/** Traditional-use framing — an ETHNOGRAPHIC claim about texts, not an efficacy claim. */
export const TRADITIONAL_FRAMING = [
  /\btraditionally\s+(?:used|valued|described|said|regarded|taken)\b/giu,
  /\bin\s+(?:classical\s+)?ayurveda\b/giu,
  /\bclassical\s+texts?\b/giu,
  /\bayurvedic\s+texts?\b/giu,
  /\bis\s+described\s+as\b/giu,
];

/**
 * §2.7 r22 — NegEx-style negation cues. A cue within NEG_WINDOW tokens BEFORE a
 * match negates it. "not only" is a PSEUDO-cue (it negates nothing) and is
 * excluded, or "not only does it cure cancer" would slip through.
 */
/**
 * Cues are matched against single TOKENS, so every entry must be one word.
 * "far from" / "rather than" / "instead of" were in this list and could never
 * fire — dead entries that made the negation engine look more capable than it
 * was. ("instead" is a TERMINATOR below; it must not also be a cue.)
 */
export const NEGATION_CUES = [
  "not", "no", "never", "cannot", "n't", "none", "nothing", "nobody", "noone",
  "neither", "nor", "without", "isn", "aren", "doesn", "don", "won", "can",
  "cant", "denies", "denied", "lacks", "absent", "myth", "false",
];
export const PSEUDO_NEGATION = [/\bnot\s+only\b/iu, /\bno\s+wonder\b/iu, /\bnot\s+to\s+mention\b/iu];

/**
 * MULTI-WORD negation cues. Cues are matched per-token, so these can never
 * appear in NEGATION_CUES — they are normalised to a sentinel token first.
 *
 * "Its specific rules are traditional RATHER THAN clinically proven" is live in
 * diet.json, and it is the site's honest register doing exactly its job: naming
 * the hype phrase in order to deny it. Deleting these cues as "dead code"
 * (they were, as tokens) turned that sentence into a banned-claim ERROR.
 * Restored properly rather than dropped.
 */
export const NEGATION_CUE_PHRASES = [
  /\brather\s+than\b/giu,
  /\binstead\s+of\b/giu,
  /\bfar\s+from\b/giu,
  /\bother\s+than\b/giu,
  /\bas\s+opposed\s+to\b/giu,
];
/** Sentinel a phrase cue collapses to; must survive tokenize() as one token. */
const PHRASE_CUE_TOKEN = "xnegcuephrasex";

/**
 * NegEx TERMINATION terms. A negation's scope ENDS here, so the backward scan
 * stops rather than reaching past a contrast into a live claim:
 *   "There are no guarantees, BUT this herb cures cancer"  → still a claim.
 * Without these, widening the window to fit real English ("No preparation has
 * been shown to treat cancer" puts the cue 7 tokens back) would hand authors a
 * laundering device: prefix any claim with a throwaway "no".
 */
export const NEGATION_TERMINATORS = [
  "but", "however", "although", "though", "yet", "except", "besides",
  "nevertheless", "nonetheless", "whereas", "still", "instead",
];

/**
 * Maximum tokens a negation's scope reaches FORWARD from its cue.
 *
 * This is a bound, not the mechanism: NEGATION_TERMINATORS and the sentence
 * boundary are what stop over-suppression. It exists only so a stray "no" early
 * in a very long sentence cannot silence everything after it.
 *
 * Why 20 and not 6: /about's honesty pledge reads "You will NOT read here that a
 * herb or therapy cures, treats, prevents, or gives PERMANENT RELIEF from any
 * named disease" — the cue is 13 tokens from the claim, across a coordinated
 * verb list. A 10-token window flagged that sentence as a banned claim. It is
 * the most honest sentence on the site, and the §3.3 rule applies exactly: a
 * lint that reddens the honesty pledge is worse than no lint.
 */
export const NEG_SCOPE_MAX = 20;

/**
 * §2.7 r23 — THE CONTROL CORPUS. The scanner is not believed until it proves it
 * can still see. Every entry encodes a real, documented failure:
 *   · known-present strings (the §3.4 false negative: a scan that returns 0
 *     because its regex silently broke);
 *   · the "SPAsm counted as spa" over-match (§3.4, second attempt);
 *   · the Healing Secrets negated-cure sentence, verbatim (§3.3) — the single
 *     most important string in this file. If this ever flags, the lint is worse
 *     than nothing and must not run.
 */
export const CONTROL_CORPUS = [
  { id: "ctl-dmr-present", text: "This herb cures cancer completely.", expect: "flag", rule: "r20-dmr-claim" },
  { id: "ctl-dmr-present-2", text: "Ayurveda treats diabetes at its source.", expect: "flag", rule: "r20-dmr-claim" },
  { id: "ctl-banned-present", text: "A miracle herb that is a breakthrough.", expect: "flag", rule: "r21-banned-claim" },
  // /about's HONESTY PLEDGE, verbatim from the live corpus. A 10-token backward
  // window flagged "permanent relief" here — on the most honest sentence the
  // site has. This string is why negation is forward-scoped. If it ever goes
  // red, the claims lint is punishing honesty and must not ship.
  {
    id: "ctl-honesty-pledge",
    text: "You will not read here that a herb or therapy cures, treats, prevents, or gives permanent relief from any named disease.",
    expect: "clean",
    rule: "r21-banned-claim",
  },
  // The same construction for the safety register.
  { id: "ctl-negated-safety", text: "No herb is completely safe, and none has no side effects.", expect: "clean", rule: "r21-banned-claim" },
  // diet.json, verbatim. "rather than" is a NEGATION cue — the sentence denies
  // the hype phrase it names. Flagged as a banned claim until phrase cues existed.
  {
    id: "ctl-rather-than",
    text: "Eating by dosha is a further layer of personalisation, and its specific rules are traditional rather than clinically proven.",
    expect: "clean",
    rule: "r21-banned-claim",
  },
  // THE ONE THAT MATTERS MOST — reusable-content-map.md §3.3, verbatim.
  {
    id: "ctl-negated-cure",
    text: "Ayurveda is not a cure for cancer; it is designed to work alongside the care of your treating medical team.",
    expect: "clean",
    rule: "r20-dmr-claim",
  },
  { id: "ctl-negated-cure-2", text: "There is no cure for diabetes in any system of medicine.", expect: "clean", rule: "r20-dmr-claim" },
  { id: "ctl-negated-cure-3", text: "This does not treat cancer and must never replace oncology care.", expect: "clean", rule: "r20-dmr-claim" },
  // Pseudo-negation must NOT rescue a real claim.
  { id: "ctl-pseudo-negation", text: "Not only does this cure cancer, it works fast.", expect: "flag", rule: "r20-dmr-claim" },
  // REGRESSION LOCK. The first version of this file flagged "your treating
  // medical team" inside the §3.3 sentence: "treating" is a claim verb, "cancer"
  // was ~60 chars back, and proximity matching called it a claim. That is the
  // §3.3 false positive, reproduced by the code written to prevent it. These
  // three strings are why findClaims() is directional + collocation-aware.
  { id: "ctl-collocation-team", text: "Discuss any herb with your treating medical team before starting, especially during cancer therapy.", expect: "clean", rule: "r20-dmr-claim" },
  { id: "ctl-collocation-plan", text: "Your oncologist will design a treatment plan; ask them about cancer care first.", expect: "clean", rule: "r20-dmr-claim" },
  { id: "ctl-cooccurrence", text: "Cancer patients often ask about turmeric while treating side effects with conventional care.", expect: "clean", rule: "r20-dmr-claim" },
  // Directionality must not open a hole: the PASSIVE claim still has to flag.
  { id: "ctl-passive-claim", text: "In Ayurveda, diabetes is cured by this formulation.", expect: "flag", rule: "r20-dmr-claim" },
  // Real English puts the cue further back than a 6-token window reaches. This
  // string is why NEG_WINDOW is 10 — it was flagging on the honest fixture.
  { id: "ctl-long-negation", text: "No Ayurvedic preparation has been shown to treat cancer in any randomised trial.", expect: "clean", rule: "r20-dmr-claim" },
  // …and this is why widening the window REQUIRES terminators. Without them, a
  // throwaway "no" before a contrast becomes a laundering device for any claim.
  { id: "ctl-terminator-but", text: "There are no guarantees, but this herb cures cancer.", expect: "flag", rule: "r20-dmr-claim" },
  { id: "ctl-terminator-however", text: "Nothing here is proven; however, this formulation treats diabetes.", expect: "flag", rule: "r20-dmr-claim" },
  // "nothing" was missing from the cue list, so the honest fixture went red on
  // its own disclaimer. Every cue that the corpus actually relies on gets a lock.
  { id: "ctl-cue-nothing", text: "Nothing described on this site prevents cancer.", expect: "clean", rule: "r20-dmr-claim" },
  // INTERROGATIVES. The house style asks these; the page answers "No" beneath.
  { id: "ctl-question-mark", text: "Does Ayurveda cure cancer?", expect: "clean", rule: "r20-dmr-claim" },
  { id: "ctl-question-heading", text: "Can Ayurveda treat diabetes", expect: "clean", rule: "r20-dmr-claim" },
  // …but the ASSERTION after the question is still scanned on its own merits.
  { id: "ctl-question-then-claim", text: "Does it work? Yes — this herb cures cancer.", expect: "flag", rule: "r20-dmr-claim" },
  // Over-match guards — §3.4's second failure ("SPAsm" counted as "spa").
  { id: "ctl-overmatch-spasm", text: "The patient reported a muscle spasm after treatment.", expect: "clean", rule: "*" },
  { id: "ctl-overmatch-curcumin", text: "Curcumin is poorly absorbed from the gut.", expect: "clean", rule: "r20-dmr-claim" },
  { id: "ctl-overmatch-accurate", text: "The description is accurate and the treatment room is clean.", expect: "clean", rule: "r20-dmr-claim" },
  { id: "ctl-overmatch-secure", text: "Data is stored securely and procurement is documented.", expect: "clean", rule: "r20-dmr-claim" },
];

/**
 * §2.7 rules that are IMPLEMENTED but cannot fire on today's schema. Printed on
 * every run. This list is the migration backlog and the honest headline: a clean
 * run does NOT mean 35/35 enforced.
 */
export const DORMANT_RULES = [
  ["r3(url-liveness)", "citation URLs are checked for SHAPE, not for HTTP 200 — §2.7 assigns liveness to the weekly QA rotation; a CI gate that needs the network gets disabled"],
  ["r5", "herb monograph: mainDrawbacks[]/notStudiedFor[]/grade distribution — needs `type` + `evidence` blocks"],
  ["r6(schema)", "per-row `cites` on outcomes/mechanisms/interactions — needs the evidence blocks; the PROSE form of r6 is ACTIVE below"],
  ["r7", "safety.pregnancy/lactation/preSurgery/longTermSafety — needs `safety` block"],
  ["r8", "dosage.studiedRanges[] form+marker%+duration+population — needs `dosage` block"],
  ["r9", "ayurveda.epistemicNote + karma[].gloss — needs `ayurveda` block"],
  ["r10", "routesTo ⊇ KAPPL ⟹ quality.commercialDisclosure — needs `quality` block"],
  ["r11-r16", "condition-page spine, red-flags DOM order, riskTier, harmNote, grade distribution — needs `type:'condition'` + `sections[].kind`; ZERO condition pages exist today"],
  ["r18", "riskTier 3 ⟹ signoff file + empty routesTo — needs `riskTier`"],
  ["r28(signOff)", "review.signOff === 'approved' — needs the `review` block; `register_ok` half IS active"],
  ["r30", "classicalBasis[].quote ⟹ GREEN licence-register entry — needs `classicalBasis` + the licence register"],
  ["r31", "therapeuticUses ⟹ qualifier REQUIRED — needs `therapeuticUses`"],
  ["r32", "icd11Tm2 ⟹ icd11Caveat — needs `icd11Tm2`"],
  ["r33", "type:'concept' ⟹ criticisms ≥1 + steelmanned — needs `type` + `scientificReception`"],
  ["r34", "/news/ reciprocal evergreenRefs — needs `news` block; ZERO news pages exist today"],
  ["r-aeo(entity)", "entity.canonicalName + ≥1 Wikidata sameAs — needs `entity` block (§4b.3 calls this 'the cheapest unclaimed win on the board')"],
  ["r-aeo(evidence)", "evidence.snapshot trialCount/participantsTotal — needs `evidence` block"],
  ["faqs-visible", "§4b.3 requires faqs render VISIBLY in HTML, never schema-only — a render property, not a JSON property; belongs in the Playwright spec, not here"],
];

// ─────────────────────────────────────────────────────────────────────────────
// MATCHING PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Unicode-safe word/phrase matcher. Built because §3.4's `\bword[a-z]*\b`
 * over-matched ("SPAsm" → "spa") and `[[:<:]]` silently matched nothing. Uses
 * explicit lookaround on letters/digits/hyphen so neither failure recurs.
 *
 * EVERY token is escaped and multi-word phrases are joined with `\s+`, so
 * "heart disease" and "Deepu John" match across a line break. An earlier version
 * tried to let pre-escaped regex source through via `/^\\|\[|\(/.test(word)` —
 * that alternation binds `^` to the FIRST branch only, so "Deepu\s+John" was
 * escaped into a literal backslash-s and rule 29 could never fire. The
 * physician-name rule was silently dead: exactly the false-negative class this
 * file exists to catch, in the file that catches it. Escape everything; no
 * caller passes regex source.
 *
 * @param {string} word a word or a plain-text phrase (never regex source)
 */
export function wordRe(word) {
  const body = word.trim().split(/\s+/)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("\\s+");
  return new RegExp(`(?<![\\p{L}\\p{N}-])(?:${body})(?![\\p{L}\\p{N}-])`, "giu");
}

/** Tokenize for the negation window. */
function tokens(text) {
  return text.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? [];
}

/** Auxiliaries/wh-words that open a question. */
const INTERROGATIVE_OPENERS = [
  "does", "do", "did", "can", "could", "is", "are", "was", "were", "will",
  "would", "should", "has", "have", "had", "may", "might", "what", "why",
  "how", "when", "where", "which", "who", "whom", "whose",
];

/**
 * Is the match inside a QUESTION rather than an assertion?
 *
 * "Does Ayurveda cure cancer?" is the honest question-form heading this site's
 * house style REQUIRES (teardown-condition §1.2), and the page then answers
 * "No." An advertisement does not ask — it asserts. A claims lint that cannot
 * tell a question from a claim forbids the honest page from raising the exact
 * topic readers arrive searching for, which is the §3.3 failure wearing a
 * different hat: the rule fires hardest on the most honest drafting.
 *
 * Two signals: the enclosing sentence terminates in '?', or it opens with an
 * interrogative auxiliary/wh-word (headings often carry no punctuation).
 *
 * THE TRADEOFF, STATED: "Does this cure cancer? Absolutely." would let the
 * question through — but the ANSWER is a separate sentence and is scanned on its
 * own, so the claim still has to survive the assertion path to ship. Accepted
 * knowingly; the alternative is banning the question.
 *
 * @param {string} text
 * @param {number} index
 */
export function isInterrogative(text, index) {
  const after = text.slice(index);
  const rel = after.search(/[.!?]/);
  if (rel >= 0 && after[rel] === "?") return true;
  const before = text.slice(0, index);
  const start = Math.max(
    before.lastIndexOf("."), before.lastIndexOf("!"),
    before.lastIndexOf("?"), before.lastIndexOf(";"), before.lastIndexOf("\n"),
  );
  const first = tokens(before.slice(start + 1))[0];
  return first !== undefined && INTERROGATIVE_OPENERS.includes(first);
}

/**
 * §2.7 r22 — is the match at `index` negated?
 * NegEx-style: scan up to NEG_WINDOW tokens before the match for a negation cue,
 * excluding pseudo-cues. Sentence-scoped so a negation in a previous sentence
 * cannot launder a claim in this one.
 * @param {string} text  full field text
 * @param {number} index character offset of the match
 * @returns {boolean}
 */
export function isNegated(text, index) {
  const before = text.slice(0, index);
  // Sentence scope: a negation in a PREVIOUS sentence cannot launder this claim.
  const sentenceStart = Math.max(
    before.lastIndexOf("."), before.lastIndexOf("!"),
    before.lastIndexOf("?"), before.lastIndexOf(";"),
    before.lastIndexOf("\n"),
  );
  let scope = before.slice(sentenceStart + 1);
  if (PSEUDO_NEGATION.some((re) => re.test(scope))) return false;
  // Collapse multi-word cues to one token so the token walk below can see them.
  for (const re of NEGATION_CUE_PHRASES) scope = scope.replace(new RegExp(re.source, re.flags), ` ${PHRASE_CUE_TOKEN} `);

  // FORWARD-SCOPE NegEx (the real algorithm, not a backward token window).
  // A cue negates everything from itself until a TERMINATOR or the sentence
  // ends. So: take the LAST cue before the match; if any terminator sits between
  // that cue and the match, the scope already closed and this is a live claim.
  //
  // A backward window cannot express this. It has to pick one number, and no
  // number is right: 10 was too short for /about's honesty pledge (cue 13 tokens
  // back) and too long to be safe elsewhere. Scope is structural, not metric.
  const toks = tokens(scope);
  let cueIdx = -1;
  for (let i = toks.length - 1; i >= 0; i--) {
    if (NEGATION_CUES.includes(toks[i]) || toks[i] === PHRASE_CUE_TOKEN) { cueIdx = i; break; }
  }
  if (cueIdx < 0) return false;
  const between = toks.slice(cueIdx + 1);
  if (between.some((t) => NEGATION_TERMINATORS.includes(t))) return false; // scope closed
  if (between.length > NEG_SCOPE_MAX) return false;                        // bounded
  return true;
}

/**
 * SAFE COLLOCATIONS — a claim verb used as a NOUN MODIFIER, not a claim.
 * "your treating medical team" is standard, correct, safety-critical referral
 * language: it is the phrase an honest health page uses to send a cancer patient
 * BACK to their oncologist. The first version of this file flagged it inside the
 * verbatim Healing Secrets sentence — the exact §3.3 false positive — and the
 * control corpus caught it. Never remove without a control string proving the
 * sentence still passes.
 */
export const SAFE_COLLOCATIONS =
  /\b(?:treating|treatment|healing|curing|preventive|preventative)\s+(?:medical\s+)?(?:team|physician|doctor|clinician|oncologist|professional|staff|centre|center|programme|program|plan|options?|room)\b/giu;

/** Passive-voice markers — licence to look BACKWARD for the disease noun. */
const PASSIVE_MARKER = /\b(?:is|are|was|were|be|been|being|can|could|may|might|will|would)\b[^.;!?]{0,20}$/iu;

/**
 * Find claim-verb × disease-noun co-occurrence — DIRECTIONALLY.
 *
 * A claim is a verb GOVERNING a disease ("cures cancer", "cancer is cured").
 * Mere co-occurrence in a window is not a claim, and treating it as one produces
 * the §3.3 false positive that makes reviewers click past the lint that matters
 * most. So:
 *   · forward window (verb → noun): a claim, e.g. "cures cancer";
 *   · backward window (noun → verb): ONLY with a passive marker between them,
 *     e.g. "cancer is cured by" — otherwise it is co-occurrence, not government;
 *   · SAFE_COLLOCATIONS are skipped entirely (verb-as-modifier).
 *
 * Returns negated matches too, flagged, so r22 can report them as INFO rather
 * than dropping them silently.
 *
 * @param {string} text
 * @param {string[]} verbs
 * @param {string[]} nouns
 * @param {number} proximity characters
 * @returns {{match:string, index:number, noun:string, negated:boolean}[]}
 */
export function findClaims(text, verbs, nouns, proximity = 90) {
  /** @type {{match:string, index:number, noun:string, negated:boolean}[]} */
  const out = [];
  for (const verb of verbs) {
    const vre = wordRe(verb);
    let m;
    while ((m = vre.exec(text)) !== null) {
      const end = m.index + m[0].length;

      // Verb-as-noun-modifier ("your treating medical team") is not a claim.
      const coll = new RegExp(SAFE_COLLOCATIONS.source, SAFE_COLLOCATIONS.flags);
      coll.lastIndex = 0;
      let isCollocation = false;
      let c;
      while ((c = coll.exec(text)) !== null) {
        if (c.index <= m.index && m.index < c.index + c[0].length) { isCollocation = true; break; }
      }
      if (isCollocation) continue;

      // A question is not a claim. "Does Ayurveda cure cancer?" is the house
      // style, and the page answers it honestly right underneath.
      if (isInterrogative(text, m.index)) continue;

      const forward = text.slice(end, Math.min(text.length, end + proximity));
      const backText = text.slice(Math.max(0, m.index - proximity), m.index);

      for (const noun of nouns) {
        const nreF = wordRe(noun);
        const nreB = wordRe(noun);
        let hit = null;
        if (nreF.test(forward)) {
          hit = noun;
        } else if (nreB.test(backText)) {
          // Backward only counts in the passive: "cancer is cured by X".
          nreB.lastIndex = 0;
          const nm = [...backText.matchAll(nreB)].pop();
          if (nm) {
            const between = backText.slice(nm.index + nm[0].length);
            if (PASSIVE_MARKER.test(between)) hit = noun;
          }
        }
        if (!hit) continue;
        out.push({
          match: m[0],
          index: m.index,
          noun: hit.replace(/\\b/g, ""),
          negated: isNegated(text, m.index),
        });
        break;
      }
    }
  }
  return out;
}

/** 1-indexed line of a character offset within a raw file, best effort. */
function lineOfSnippet(raw, snippet) {
  if (!snippet) return 1;
  const probe = snippet.slice(0, 60);
  const idx = raw.indexOf(probe);
  if (idx < 0) return 1;
  return raw.slice(0, idx).split("\n").length;
}

/** Words in a capsule (§4b.3 40–80 gate). */
export function wordCount(s) {
  return (s.trim().match(/\S+/g) ?? []).length;
}

/** Every string leaf in a page object, with its JSON path. */
export function* walkStrings(node, path = "") {
  if (typeof node === "string") { yield { path, value: node }; return; }
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) yield* walkStrings(node[i], `${path}[${i}]`);
    return;
  }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) yield* walkStrings(v, path ? `${path}.${k}` : k);
  }
}

/** Paths that are not authored prose — never claim-scanned. */
const NON_PROSE = /(^slug$|^type$|^register_ok$|\.url$|^citations\[\d+\]\.url$|^routesTo|^breadcrumb\[\d+\]\.url$|^review\.|^reviewedOn$|^reviewedBy$|^publishedOn$|^updatedOn$)/;

function isProse(path) { return !NON_PROSE.test(path); }

// ─────────────────────────────────────────────────────────────────────────────
// SELF-TEST (§2.7 r23) — run before ANY result is reported.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Prove the scanner can still see. Runs the real claim matchers over the control
 * corpus and checks each expected outcome.
 * @returns {{ok:boolean, failures:string[], checked:number}}
 */
export function selfTest() {
  const failures = [];
  for (const c of CONTROL_CORPUS) {
    const dmr = findClaims(c.text, CLAIM_VERBS, DMR_SCHEDULE_DISEASES).filter((x) => !x.negated);
    // MUST mirror the real r21 rule body, negation and interrogatives included.
    // A self-test that checks something easier than the rule it guards is a
    // self-test that passes while the rule is broken.
    const banned = BANNED_CLAIM_PHRASES.filter(({ re }) => {
      const r = new RegExp(re.source, re.flags);
      let m;
      while ((m = r.exec(c.text)) !== null) {
        if (!isNegated(c.text, m.index) && !isInterrogative(c.text, m.index)) return true;
      }
      return false;
    });
    const flagged = c.rule === "r21-banned-claim" ? banned.length > 0
      : c.rule === "*" ? dmr.length > 0 || banned.length > 0
      : dmr.length > 0;
    if (c.expect === "flag" && !flagged) {
      failures.push(`${c.id}: expected a FLAG, scanner saw nothing — the matcher is broken and its zeros are NOT believable: "${c.text}"`);
    }
    if (c.expect === "clean" && flagged) {
      failures.push(`${c.id}: expected CLEAN, scanner flagged it — over-matching (§3.4's "SPAsm counted as spa") or negation-blind (§3.3): "${c.text}"`);
    }
  }
  // The word-boundary primitive itself, against both documented grep failures.
  if (!wordRe("spa").test("a spa day")) failures.push("wordRe: control word 'spa' did not match 'a spa day' — word boundaries are broken (the §3.4 false negative)");
  if (wordRe("spa").test("muscle spasm")) failures.push("wordRe: 'spa' matched inside 'spasm' — over-matching (the §3.4 second failure)");
  if (!wordRe("ayurveda").test("What is Ayurveda?")) failures.push("wordRe: control word 'ayurveda' did not match — the exact zero that exposed the broken scan in §3.4");
  return { ok: failures.length === 0, failures, checked: CONTROL_CORPUS.length + 3 };
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT LOADERS — each one FAILS LOUDLY rather than degrading to a silent pass.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * §2.7 r4 — PATHWAYS keys, read from the component that consumes `routesTo`.
 * article.tsx does `page.routesTo?.map((k) => PATHWAYS[k]).find(Boolean)` — a
 * typo silently renders NOTHING. Keys are extracted from the source rather than
 * copied here, so this list cannot drift from the renderer.
 * @returns {Set<string>}
 */
export function loadPathwayKeys(file = ARTICLE_TSX) {
  if (!existsSync(file)) throw new Error(`content-lint: cannot read pathway keys from ${file}`);
  const src = readFileSync(file, "utf8");
  const start = src.indexOf("const PATHWAYS");
  if (start < 0) throw new Error("content-lint: PATHWAYS not found in article.tsx — r4 cannot be enforced, refusing to report a pass");
  // The VALUE's brace, not the type annotation's. `const PATHWAYS: Record<string,
  // { overline: string; ... }> = {` — a naive indexOf("{") lands inside
  // `Record<...>` and extracts the type's keys (overline/body/href/cta), which is
  // how the first version of this function returned zero pathway keys.
  const eq = src.indexOf("= {", start);
  if (eq < 0) throw new Error("content-lint: PATHWAYS declaration found but its value brace was not — refusing to report a pass");
  const open = src.indexOf("{", eq);
  let depth = 0, end = open;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") { depth--; if (depth === 0) { end = i; break; } }
  }
  const block = src.slice(open, end);
  // Keys may be bare identifiers (KTAHV) OR quoted strings ("Villa Raag") —
  // the first version matched only bare identifiers, so "Villa Raag" was
  // invisible to r4 and every page routing to it was a FALSE POSITIVE while
  // the renderer served it fine. Two sources of truth had silently diverged;
  // this extractor exists to prevent exactly that.
  const keys = [...block.matchAll(/^\s{2}(?:"([^"]+)"|([A-Za-z_][\w-]*))\s*:\s*\{/gm)].map((m) => m[1] ?? m[2]);
  if (keys.length === 0) throw new Error("content-lint: extracted ZERO pathway keys — the extractor is broken; refusing to report a pass (§2.7 r23 doctrine)");
  return new Set(keys);
}

/**
 * §2.7 r29 + r27 — the physician roster and resolveReview(), imported from the
 * single source of truth. NOT copied: a second list of physician names is a
 * second thing to get wrong on a YMYL page.
 */
export async function loadReview(file = MEDICAL_REVIEW_TS) {
  const mod = await import(`file://${file}`);
  const names = Object.values(mod.REVIEWERS).map((r) => r.name);
  if (names.length === 0) throw new Error("content-lint: roster is empty — r29 cannot be enforced");
  return { resolveReview: mod.resolveReview, names, REVIEWERS: mod.REVIEWERS };
}

/**
 * §2.7 r2 — real Next.js routes, read from the app tree.
 *
 * Not every valid internal link is a content slug: `/`, `/privacy`, `/terms`,
 * `/cookie-policy` are real `page.tsx` routes with no JSON behind them. Checking
 * links against content slugs ALONE reports the homepage as link-rot, and a lint
 * that cries wolf on `/` is a lint whose link-rot findings get ignored — which
 * costs exactly the failure r2 calls the #1 failure mode of a large corpus.
 *
 * Dynamic segments (`[...slug]`) are skipped: that catch-all is what serves the
 * content slugs, and treating it as a literal route would make every link valid.
 *
 * @returns {Set<string>}
 */
export function loadAppRoutes(appDir = join(SITE, "app")) {
  /** @type {Set<string>} */
  const routes = new Set();
  if (!existsSync(appDir)) return routes;
  const walkRoutes = (dir, segs = []) => {
    for (const name of readdirSync(dir, { withFileTypes: true })) {
      if (name.isDirectory()) {
        if (name.name.startsWith("_") || name.name === "node_modules") continue;
        if (name.name.startsWith("[")) continue; // dynamic — serves content slugs
        // Route groups (folder) do not appear in the URL.
        const next = name.name.startsWith("(") ? segs : [...segs, name.name];
        walkRoutes(join(dir, name.name), next);
      } else if (name.name === "page.tsx" || name.name === "page.js" || name.name === "route.ts") {
        routes.add("/" + segs.join("/"));
      }
    }
  };
  walkRoutes(appDir);
  routes.add("/");
  return routes;
}

/** The compliance lint we EXTEND rather than duplicate. */
async function loadCompliance() {
  const mod = await import(`file://${join(REPO, "packages", "compliance", "src", "lint.js")}`);
  return mod.lintText;
}

// ─────────────────────────────────────────────────────────────────────────────
// THE RULES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lint one page.
 * @param {object} page parsed content JSON
 * @param {object} ctx
 * @param {string} ctx.file
 * @param {string} ctx.raw
 * @param {Set<string>} ctx.slugs        every slug in the corpus (r2 link resolution)
 * @param {Set<string>} ctx.pathwayKeys  (r4)
 * @param {string[]} ctx.physicianNames  (r29)
 * @param {Function} ctx.resolveReview   (r27 — deferred to, never re-implemented)
 * @param {Function} [ctx.lintText]      packages/compliance (extended, not duplicated)
 * @param {string} [ctx.today]           ISO date; injectable so tests are not clock-dependent
 * @returns {Finding[]}
 */
export function lintPage(page, ctx) {
  const { file, raw, slugs, pathwayKeys, physicianNames, resolveReview, lintText, today = isoToday() } = ctx;
  /** @type {Finding[]} */
  const findings = [];
  const slug = typeof page.slug === "string" ? page.slug : "<no slug>";

  const push = (severity, rule, path, message, excerpt = "") =>
    findings.push({ severity, rule, file, line: lineOfSnippet(raw, excerpt || path), path, message, excerpt: String(excerpt).slice(0, 160) });

  const clinical = page.clinical === true;

  // ── r1 — base schema ──────────────────────────────────────────────────────
  for (const f of ["slug", "title", "metaDescription", "answerCapsule", "clinical", "register_ok"]) {
    if (page[f] === undefined || page[f] === null || page[f] === "")
      push("error", "r1-schema", f, `required field \`${f}\` is missing — the loader's type (app/lib/content.ts) says it is not optional`);
  }
  if (!Array.isArray(page.sections) || page.sections.length === 0)
    push("error", "r1-schema", "sections", "`sections` must be a non-empty array");
  if (page.type !== undefined && !PAGE_TYPES.has(page.type))
    push("error", "r1-schema", "type", `type "${page.type}" is not one of: ${[...PAGE_TYPES].join(", ")}`);
  if (page.type === undefined)
    push("warn", "r1-schema-dormant", "type", "no `type` — the whole per-type rule family (§2.7 r5-r19, r30-r34) cannot fire on this page. Schema migration debt, not a pass.");
  if (page.register_ok !== undefined && !["ok", "review"].includes(page.register_ok))
    push("error", "r1-schema", "register_ok", `register_ok must be "ok" or "review", found "${page.register_ok}"`);

  // ── r2 — h1, slug, link resolution ────────────────────────────────────────
  if (!page.h1) push("error", "r2-h1", "h1", "no `h1` — the template falls back to `title`, so the page silently ships with its meta title as its headline (they are written for different jobs)");

  const internalLinks = [];
  for (const c of page.breadcrumb ?? []) if (typeof c?.url === "string") internalLinks.push({ path: "breadcrumb", url: c.url });
  for (const { path, value } of walkStrings(page)) {
    if (!isProse(path)) continue;
    for (const m of value.matchAll(/\]\((\/[^)\s#]*)(?:#[^)\s]*)?\)/g)) internalLinks.push({ path, url: m[1] });
  }
  const linkTargets = new Set([...slugs, ...(ctx.appRoutes ?? [])]);
  for (const { path, url } of internalLinks) {
    if (!url.startsWith("/")) continue;
    const clean = url.replace(/\/$/, "") || "/";
    if (!linkTargets.has(clean) && !linkTargets.has(url))
      push("error", "r2-link-rot", path, `internal link "${url}" resolves to no page in the corpus — link-rot is the #1 failure mode of a large corpus (§2.7 r2)`, url);
  }

  // ── r3 — citations ────────────────────────────────────────────────────────
  const citations = Array.isArray(page.citations) ? page.citations : [];
  const ns = citations.map((c) => c?.n);
  ns.forEach((n, i) => {
    if (n !== i + 1) push("error", "r3-citations", `citations[${i}].n`, `citation numbering must be contiguous from 1 — expected ${i + 1}, found ${n}`);
  });
  const prose = [...walkStrings(page)].filter(({ path }) => isProse(path));
  const referenced = new Set();
  for (const { value } of prose) for (const m of value.matchAll(/\[(\d+)\]/g)) referenced.add(Number(m[1]));
  for (const n of referenced) {
    if (!ns.includes(n)) push("error", "r3-citations", "sections", `body marker [${n}] resolves to no citation — a citation-shaped mark with nothing behind it`);
  }
  for (const n of ns) {
    if (typeof n === "number" && !referenced.has(n))
      push("warn", "r3-citations", `citations[${n - 1}]`, `citation [${n}] is listed but never cited in the body — §2.7 r3 requires resolution "and vice versa"; an unreferenced source pads the list without backing a claim`);
  }
  for (const [i, c] of citations.entries()) {
    if (c?.url !== undefined && !/^https?:\/\/[^\s]+$/.test(c.url))
      push("error", "r3-citations", `citations[${i}].url`, `malformed citation URL "${c.url}"`, c.url);
  }
  if (clinical && citations.length < 3)
    push("error", "r3-citation-floor", "citations", `clinical page carries ${citations.length} citation(s) — §4b.3 requires ≥3. "Evidence-backed claims — OR 2.09 to >>10k. The single highest-value factor."`);

  // ── r35 — source denylist ─────────────────────────────────────────────────
  for (const [i, c] of citations.entries()) {
    const hay = `${c?.url ?? ""} ${c?.text ?? ""}`.toLowerCase();
    for (const bad of SOURCE_DENYLIST) {
      if (hay.includes(bad))
        push("error", "r35-source-denylist", `citations[${i}]`, `denylisted source "${bad}" — the failure mode here is not fabrication, it is LAUNDERING a supplement blog's claim into a cited-looking safety statement (§2.7 r35)`, c?.url ?? c?.text ?? "");
    }
    for (const bad of SOURCE_DENYLIST_PROPOSED) {
      if (hay.includes(bad))
        push("warn", "r35-source-proposed", `citations[${i}]`, `"${bad}" is a health content mill of the WebMD class, but §2.7 r35 does not name it — this is a PROPOSED addition under r35's "or similar" and is not ratified, so it warns rather than blocks. Ratify it and it blocks.`, c?.url ?? c?.text ?? "");
    }
  }

  // ── r4 — routesTo ─────────────────────────────────────────────────────────
  for (const [i, key] of (page.routesTo ?? []).entries()) {
    if (!pathwayKeys.has(key))
      push("error", "r4-routesTo", `routesTo[${i}]`, `"${key}" is not a PATHWAYS key (${[...pathwayKeys].join(", ")}) — article.tsx does PATHWAYS[k] and .find(Boolean), so this renders NOTHING, silently (§2.7 r4)`, key);
  }

  // ── r10 (active half) — KAPPL routing ⟹ commercial disclosure ────────────
  if ((page.routesTo ?? []).includes("KAPPL") && !page.quality?.commercialDisclosure)
    push("warn", "r10-disclosure-dormant", "quality.commercialDisclosure", "routes to KAPPL but has no `quality.commercialDisclosure` — §2.7 r10. DORMANT: the `quality` block does not exist in the schema yet, so this cannot be an ERROR without failing every page for a field no author can set.");

  // ── AEO — answerCapsule + section capsules (§4b.3) ────────────────────────
  const capsules = [{ path: "answerCapsule", value: page.answerCapsule }];
  (page.sections ?? []).forEach((s, i) => capsules.push({ path: `sections[${i}].capsule`, value: s?.capsule }));
  for (const { path, value } of capsules) {
    if (typeof value !== "string" || !value) {
      push("error", "r-aeo-capsule", path, "capsule missing — it is the passage an answer engine extracts; without it the page has no retrievable unit");
      continue;
    }
    const wc = wordCount(value);
    if (wc < 40 || wc > 80)
      push("error", "r-aeo-capsule-length", path, `capsule is ${wc} words — §4b.3 gates 40-80 so the chunk is self-contained and extractable`, value);
    for (const re of ANAPHORA_PATTERNS) {
      const r = new RegExp(re.source, re.flags);
      const m = r.exec(value);
      if (m) push("error", "r-aeo-anaphora", path, `anaphora "${m[0].trim()}" — chunks are retrieved ALONE, so a reference to surrounding text resolves to nothing (§4b.3 / teardown-aeo-geo B2)`, value.slice(0, 120));
    }
  }

  // ── AEO — sections[].answersQuestion / anchor / question-form h2 ───────────
  (page.sections ?? []).forEach((s, i) => {
    if (s?.answersQuestion === undefined)
      push("warn", "r-aeo-dormant", `sections[${i}].answersQuestion`, "no `answersQuestion` — §4b.3 marks it REQUIRED (one sub-query, one section). DORMANT: field not in the schema yet.");
    else if (!String(s.answersQuestion).trim().endsWith("?"))
      push("error", "r-aeo-answers-question", `sections[${i}].answersQuestion`, "`answersQuestion` must end with '?' — it is a query, not a topic", s.answersQuestion);
    if (s?.anchor !== undefined && /^s-\d+$/.test(s.anchor))
      push("error", "r-aeo-anchor", `sections[${i}].anchor`, `anchor "${s.anchor}" is positional — §4b.3 requires stable semantic anchors so deep links survive a re-order`, s.anchor);
    if (typeof s?.h2 === "string" && !s.h2.trim().endsWith("?"))
      push("warn", "r-aeo-question-h2", `sections[${i}].h2`, `h2 "${s.h2}" is not question-form — house style per teardown-condition §1.2. WARN not ERROR: the 252k-trial study found structure among the factors with NO reliable citation effect, so this is a style preference, not evidence-backed. Never hard-fail a build on a null-effect factor.`, s.h2);
  });

  // ── r6 (prose form) — no uncited health claims ────────────────────────────
  (page.sections ?? []).forEach((s, i) => {
    const text = `${s?.capsule ?? ""}\n${s?.body ?? ""}`;
    const cited = /\[\d+\]/.test(text);
    if (cited) return;
    const efficacy = findClaims(text, EFFICACY_VERBS, HEALTH_OUTCOME_NOUNS, 60).filter((c) => !c.negated);
    const traditional = TRADITIONAL_FRAMING.some((re) => new RegExp(re.source, re.flags).test(text));
    if (efficacy.length && clinical) {
      const e = efficacy[0];
      push("error", "r6-uncited-claim", `sections[${i}]`, `efficacy claim ("${e.match}" ... "${e.noun}") in a section with NO citation marker — "No uncited health claims, ever" (§2.7 r6)`, sentenceAround(text, e.index));
    } else if (efficacy.length) {
      const e = efficacy[0];
      push("warn", "r6-uncited-claim", `sections[${i}]`, `efficacy claim ("${e.match}" ... "${e.noun}") with no citation on a NON-clinical page (clinical:false) — WARN because §2.7 r6's citation floor is scoped to clinical pages. If this page makes efficacy claims, \`clinical\` is mis-set and that is the real defect.`, sentenceAround(text, e.index));
    } else if (traditional && clinical) {
      push("warn", "r6-uncited-traditional", `sections[${i}]`, "traditional-use claim with no citation. WARN not ERROR: a statement about what classical texts SAY is an ethnographic claim, not an efficacy claim — the YMYL/DMR risk lives in the efficacy assertion. §2.7 r9 will make this an ERROR once `ayurveda.karma[].gloss` + `cites` exist.");
    }
  });

  // ── r20 / r21 / r22 — the claims lint ─────────────────────────────────────
  for (const { path, value } of prose) {
    // r20 — DMR Schedule disease × claim verb
    for (const c of findClaims(value, CLAIM_VERBS, DMR_SCHEDULE_DISEASES)) {
      const excerpt = sentenceAround(value, c.index);
      if (c.negated) {
        push("info", "r22-negated", path, `"${c.match}" near "${c.noun}" is NEGATED — not a claim. Reported so the suppression is visible, never silent (§2.7 r22).`, excerpt);
      } else {
        push("error", "r20-dmr-claim", path, `"${c.match}" applied to "${c.noun}" — a Schedule disease under the Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954. Cognizable; up to 6 months' imprisonment on first conviction. The site's defence is that it is EDUCATIONAL, not advertising (§2.7 r20).`, excerpt);
      }
    }
    // r21 — flat banned phrases
    for (const { re, note } of BANNED_CLAIM_PHRASES) {
      const r = new RegExp(re.source, re.flags);
      let m;
      while ((m = r.exec(value)) !== null) {
        const excerpt = sentenceAround(value, m.index);
        if (isNegated(value, m.index)) push("info", "r22-negated", path, `${note} ("${m[0]}") is NEGATED — not a claim (§2.7 r22).`, excerpt);
        else if (isInterrogative(value, m.index)) push("info", "r22-question", path, `${note} ("${m[0]}") appears in a QUESTION, not an assertion (§2.7 r22).`, excerpt);
        else push("error", "r21-banned-claim", path, `${note}: "${m[0]}" (§2.7 r21)`, excerpt);
      }
    }
    // r21 — detox as a physiological claim
    {
      const r = new RegExp(DETOX_CLAIM_RE.source, DETOX_CLAIM_RE.flags);
      let m;
      while ((m = r.exec(value)) !== null) {
        const excerpt = sentenceAround(value, m.index);
        if (isNegated(value, m.index)) push("info", "r22-negated", path, `detox claim "${m[0]}" is NEGATED — this is the page debunking the concept, which is the honest construction (§2.7 r22).`, excerpt);
        else if (isInterrogative(value, m.index)) push("info", "r22-question", path, `detox "${m[0]}" appears in a QUESTION — "Does Ayurveda detox the body?" is the query readers arrive with (§2.7 r22).`, excerpt);
        else push("error", "r21-banned-claim", path, `"detox" as a physiological claim: "${m[0]}" — §2.7 r21. Naming the concept is fine; asserting it as physiology is not.`, excerpt);
      }
    }
  }

  // ── r24 — Kairali entities in main content (§4 F5) ────────────────────────
  if (!ENTITY_DISCLOSURE_PAGES.has(slug)) {
    for (const { path, value } of prose) {
      for (const re of KAIRALI_ENTITY_PATTERNS) {
        const r = new RegExp(re.source, re.flags);
        const m = r.exec(value);
        if (m)
          push("error", "r24-entity-in-content", path, `"${m[0]}" named in main content — allowed ONLY inside the pathway aside (§2.7 r24 / §4 F5). Naming the group's own hospital and pharmacy in educational prose is what turns the page into an advertisement, and the "educational, not advertising" defence is the ONLY thing standing between this page and the DMR Act (r20).`, sentenceAround(value, m.index));
      }
      for (const re of KAIRALI_ENTITY_PROPOSED) {
        const r = new RegExp(re.source, re.flags);
        const m = r.exec(value);
        if (m)
          push("warn", "r24-entity-proposed", path, `"${m[0]}" named in main content. §2.7 r24 does NOT list it — this is a PROPOSED extension and is not ratified, so it warns rather than blocks. It reads as the same advertising problem r24 describes; Abilash's call, not this file's.`, sentenceAround(value, m.index));
      }
    }
  }

  // ── r25 — NCCIH non-endorsement (UNRATIFIED) ──────────────────────────────
  {
    const citesNccih = citations.some((c) => `${c?.url ?? ""}${c?.text ?? ""}`.toLowerCase().includes("nccih"));
    if (citesNccih && (page.routesTo ?? []).length > 0)
      push("warn", "r25-nccih-cta", "citations", "cites NCCIH and renders a commercial pathway. NCCIH's own policy forbids using its information to suggest endorsement of a commercial product, and we are a commercial publisher (§2.7 r25). WARN not ERROR: §2.7 marks r25 🔴 Ratify — it is not yet approved, and this gate does not hard-fail builds on unratified rules.");
  }

  // ── r26 — vagueness, unless a number is in the same section ───────────────
  const vagueScopes = [{ path: "answerCapsule", text: page.answerCapsule ?? "" }];
  (page.sections ?? []).forEach((s, i) => vagueScopes.push({ path: `sections[${i}]`, text: `${s?.capsule ?? ""}\n${s?.body ?? ""}` }));
  for (const { path, text } of vagueScopes) {
    const hasNumber = /\b\d+(?:[.,]\d+)?\s*(?:%|mg|g|ml|participants?|patients?|trials?|studies|weeks?|days?|months?|years?|people|adults?)\b/iu.test(text)
      || /\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+(?:trials?|studies|participants?|patients?|weeks?)\b/iu.test(text);
    if (hasNumber) continue;
    for (const re of VAGUENESS_PHRASES) {
      const r = new RegExp(re.source, re.flags);
      const m = r.exec(text);
      if (m)
        push("error", "r26-vagueness", path, `"${m[0]}" with no specific number in the same section — §2.7 r26 bans VAGUENESS, not honesty. "More research is needed" is fine beside "in 3 trials of 41 participants"; alone it is filler that sounds like caution.`, sentenceAround(text, m.index));
    }
  }

  // ── r17 — no dose patterns on condition pages ─────────────────────────────
  if (page.type === "condition") {
    for (const { path, value } of prose) {
      const r = new RegExp(DOSE_RE.source, DOSE_RE.flags);
      const m = r.exec(value);
      if (m) push("error", "r17-dose-on-condition", path, `dose pattern "${m[0]}" on a condition page — §2.7 r17. A dose beside a disease is a prescription, and this site does not prescribe.`, sentenceAround(value, m.index));
    }
  }

  // ── r19 — do-not-publish ──────────────────────────────────────────────────
  if (DO_NOT_PUBLISH_SLUGS.has(slug))
    push("error", "r19-do-not-publish", "slug", `${slug} is on the DO-NOT-PUBLISH list (§2.7 r19)`);

  // ── r27 — the review claim. DEFERRED to resolveReview(); never re-implemented.
  try {
    const resolved = resolveReview(page.reviewedOn, page.reviewedBy, slug);
    if (!resolved) {
      if (clinical)
        push("warn", "r27-review-coverage", "reviewedOn", "clinical page with no physician review. WARN, DELIBERATELY: §2.7 r27 says REQUIRED, but Abilash's 15 Jul tiered-honesty ruling says an unreviewed page is honest and expected. If this gate were RED, the builder would type a date — and a typed date under a real BAMS physician's name IS the fabrication this pipeline exists to stop. Coverage is measured here, not forced.");
    } else {
      if (resolved.date > today)
        push("error", "r27-review-future", "reviewedOn", `reviewedOn ${resolved.date} is in the FUTURE (today ${today}) — a review that has not happened yet is a fabricated review (§2.7 r27)`);
      const age = daysBetween(resolved.date, today);
      if (age > 730 && clinical)
        push("error", "r27-review-stale", "reviewedOn", `clinical page reviewed ${age} days ago (>24 months) — §2.7 r27 hard-fails. Recency is one of only four UNIVERSAL gatekeepers across all 6 models in the 252k-trial study.`);
      else if (age >= 300)
        push("warn", "r27-review-ageing", "reviewedOn", `reviewed ${age} days ago — §2.7 r27 warns at 300 days, targets ≤365.`);
    }
  } catch (e) {
    // resolveReview THROWS on a false/malformed claim. That is the gate; surface it.
    push("error", "r27-review-invalid", "reviewedOn", `resolveReview() rejected this page's review claim: ${e.message}`);
  }

  // ── r28 (active half) — register_ok ───────────────────────────────────────
  if (page.register_ok === "review")
    push("error", "r28-register", "register_ok", 'register_ok is "review" — §2.7 r28: `register_ok === "ok"` or the page does not ship. The flag exists to stop exactly this page from shipping unexamined.');

  // ── r29 — no literal physician name in content ────────────────────────────
  for (const { path, value } of walkStrings(page)) {
    for (const name of physicianNames) {
      // Pass the PLAIN name — wordRe() escapes tokens and joins them with \s+
      // itself. Pre-mangling it to "Deepu\s+John" here is what silently killed
      // this rule: wordRe then escaped the backslash and matched nothing, and
      // the gate reported clean on a page with a physician's name in its body.
      const re = wordRe(name.replace(/^Dr\.\s*/, ""));
      if (re.test(value))
        push("error", "r29-physician-name", path, `"${name}" is written literally into content. The reviewer is CONFIG (app/lib/medical-review.ts), never a literal — Abilash's 15 Jul ruling: "we have many doctors other than Dr. Deepu — he might be head now but not in future." A hardcoded name silently re-attributes when the head changes, and it cannot be checked against the roster (§2.7 r29).`, sentenceAround(value, Math.max(0, value.search(re))));
    }
  }

  // ── EXTEND packages/compliance (never duplicate) ───────────────────────────
  // Its cure-claim patterns are NOT negation-aware; running them raw here would
  // re-import the exact false positive §2.7 r22 forbids. So every cure-claim
  // finding is re-filtered through this file's negation engine before it counts.
  if (lintText) {
    for (const { path, value } of prose) {
      for (const f of lintText(value, { file: `${file}:${path}`, entity: "group" })) {
        if (f.rule === "cure-claims") continue; // owned here, negation-aware — r20/r21 above
        if (f.rule === "brand-voice") continue; // markdown-heading rule; not applicable to JSON fields
        findings.push({
          severity: f.severity === "error" ? "error" : "warn",
          rule: `compliance:${f.rule}`,
          file, line: lineOfSnippet(raw, f.excerpt), path,
          message: `${f.message} — via packages/compliance (group register; the KTAHV clinical lock is NOT applied here, §2.7 scope note)`,
          excerpt: f.excerpt,
        });
      }
    }
  }

  return findings;
}

/** The sentence containing a character offset — a usable excerpt for a reviewer. */
function sentenceAround(text, index) {
  if (index < 0) index = 0;
  const before = text.slice(0, index);
  const start = Math.max(before.lastIndexOf(". "), before.lastIndexOf("\n")) + 1;
  const after = text.slice(index);
  const rel = after.search(/[.!?](?:\s|$)/);
  const end = rel < 0 ? text.length : index + rel + 1;
  return text.slice(start, end).trim();
}

function isoToday(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function daysBetween(iso, todayIso) {
  return Math.round((Date.parse(todayIso) - Date.parse(iso)) / 86400000);
}

// ─────────────────────────────────────────────────────────────────────────────
// CORPUS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lint a whole content directory.
 * @param {string} dir
 * @param {object} [opts]
 * @returns {Promise<{findings:Finding[], pages:number, reviewDates:Map<string,string[]>}>}
 */
export async function lintCorpus(dir = DEFAULT_CONTENT_DIR, opts = {}) {
  const pathwayKeys = opts.pathwayKeys ?? loadPathwayKeys();
  const review = opts.review ?? (await loadReview());
  const lintText = opts.lintText ?? (await loadCompliance().catch(() => null));
  const appRoutes = opts.appRoutes ?? loadAppRoutes();
  const today = opts.today ?? isoToday();

  const files = readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "_manifest.json").sort();
  /** @type {{file:string, raw:string, json:any}[]} */
  const pages = [];
  for (const f of files) {
    const full = join(dir, f);
    const raw = readFileSync(full, "utf8");
    try {
      pages.push({ file: full, raw, json: JSON.parse(raw) });
    } catch (e) {
      throw new Error(`content-lint: ${full} is not valid JSON — ${e.message}`);
    }
  }

  const slugs = new Set(pages.map((p) => p.json.slug).filter(Boolean));
  /** @type {Finding[]} */
  const findings = [];

  // r2 — slug uniqueness, corpus-scoped
  const seen = new Map();
  for (const p of pages) {
    const s = p.json.slug;
    if (!s) continue;
    if (seen.has(s))
      findings.push({ severity: "error", rule: "r2-slug-unique", file: p.file, line: 1, path: "slug", message: `duplicate slug "${s}" (also in ${seen.get(s)}) — the catch-all route resolves one of these and the other is unreachable`, excerpt: s });
    else seen.set(s, p.file);
  }

  for (const p of pages) {
    findings.push(...lintPage(p.json, {
      file: p.file, raw: p.raw, slugs, pathwayKeys, appRoutes,
      physicianNames: review.names, resolveReview: review.resolveReview,
      lintText, today,
    }));
  }

  // r27 — THE BULK-STAMP FINGERPRINT.
  // Failure #5 was a hardcoded `REVIEWED = "2026-07-14"` stamped on EVERY page.
  // A single page reviewed today is plausible; three pages sharing one review
  // date that happens to be the build date is a constant, not a review.
  /** @type {Map<string,string[]>} */
  const reviewDates = new Map();
  for (const p of pages) {
    if (!p.json.reviewedOn) continue;
    if (!reviewDates.has(p.json.reviewedOn)) reviewDates.set(p.json.reviewedOn, []);
    reviewDates.get(p.json.reviewedOn).push(p.json.slug);
  }
  for (const [date, slugList] of reviewDates) {
    if (date === today && slugList.length >= 3) {
      for (const p of pages.filter((x) => x.json.reviewedOn === date)) {
        findings.push({
          severity: "error", rule: "r27-bulk-stamp", file: p.file, line: 1, path: "reviewedOn",
          message: `${slugList.length} pages share reviewedOn "${date}", which is the BUILD DATE — that is the signature of failure #5 (a hardcoded REVIEWED constant stamped on every page under a named BAMS physician for reviews that never happened). One genuine same-day review is plausible; ${slugList.length} are a constant.`,
          excerpt: date,
        });
      }
    } else if (date === today) {
      for (const p of pages.filter((x) => x.json.reviewedOn === date)) {
        findings.push({
          severity: "warn", rule: "r27-build-date", file: p.file, line: 1, path: "reviewedOn",
          message: `reviewedOn equals the build date (${date}). §2.7 r27 forbids this "unless a real review happened that day" — a machine cannot know which. WARN, and a human must confirm the review is real.`,
          excerpt: date,
        });
      }
    }
  }

  return { findings, pages: pages.length, reviewDates };
}

// ─────────────────────────────────────────────────────────────────────────────
// REPORT + CLI
// ─────────────────────────────────────────────────────────────────────────────

const ORDER = { error: 0, warn: 1, info: 2 };

export function formatFindings(findings) {
  return [...findings]
    .sort((a, b) => ORDER[a.severity] - ORDER[b.severity] || a.file.localeCompare(b.file) || a.line - b.line)
    .map((f) => `${f.severity.toUpperCase().padEnd(5)} ${f.file.split("/").pop()}:${f.line} [${f.rule}] ${f.path}\n      ${f.message}${f.excerpt ? `\n      > ${String(f.excerpt).slice(0, 150)}` : ""}`)
    .join("\n\n");
}

async function main(argv) {
  const args = argv.slice(2);
  const dir = args.includes("--dir") ? args[args.indexOf("--dir") + 1] : DEFAULT_CONTENT_DIR;
  const asJson = args.includes("--json");
  const quiet = args.includes("--quiet");

  // §2.7 r23 — NOTHING is reported until the scanner proves it can still see.
  const st = selfTest();
  if (!st.ok) {
    console.error("SCANNER BROKEN — content-lint refuses to report a result.\n");
    console.error("A silently-broken banned-word lint reporting 'clean' is worse than no lint");
    console.error("(reusable-content-map.md §3.4). These control strings did not behave:\n");
    for (const f of st.failures) console.error(`  · ${f}`);
    process.exit(2);
  }

  const { findings, pages } = await lintCorpus(dir);
  const errors = findings.filter((f) => f.severity === "error");
  const warns = findings.filter((f) => f.severity === "warn");
  const infos = findings.filter((f) => f.severity === "info");

  if (asJson) {
    console.log(JSON.stringify({ ok: errors.length === 0, pages, controlsPassed: st.checked, errors: errors.length, warnings: warns.length, info: infos.length, findings }, null, 2));
    process.exit(errors.length ? 2 : 0);
  }

  if (!quiet && findings.length) console.log(formatFindings(findings) + "\n");

  console.log("─".repeat(78));
  console.log(`content-lint · ${pages} pages · ${dir.replace(REPO + "/", "")}`);
  console.log(`self-test: ${st.checked} control strings PASSED — this run's zeros are believable (§2.7 r23)`);
  console.log(`ERROR ${errors.length}   WARN ${warns.length}   INFO ${infos.length}`);
  if (errors.length) {
    const byRule = {};
    for (const f of errors) byRule[f.rule] = (byRule[f.rule] ?? 0) + 1;
    console.log("\nblocking, by rule:");
    for (const [r, n] of Object.entries(byRule).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}  ${r}`);
  }
  console.log(`\nDORMANT — implemented, cannot fire on today's schema (${DORMANT_RULES.length}). A clean run is NOT 35/35:`);
  for (const [id, why] of DORMANT_RULES) console.log(`  · ${id}: ${why}`);
  console.log("─".repeat(78));

  process.exit(errors.length ? 2 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main(process.argv).catch((e) => {
    console.error(`content-lint harness error: ${e.message}`);
    process.exit(1); // 1 = harness broke; 2 = content failed. Never conflate.
  });
}
