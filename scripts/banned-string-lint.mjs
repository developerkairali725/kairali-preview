#!/usr/bin/env node
/**
 * banned-string-lint.mjs — the string half of `G6-PRE` (MASTER_PIPELINE §1141).
 * Rubric: docs/process/rubrics/G6-PRE-STRINGS.md
 *
 * WHY THIS EXISTS. Every rule below is one of OUR OWN documented failures. None
 * is a hypothetical:
 *
 *   · "Ask a doctor on WhatsApp" shipped on every article. +91 92898 38797 is
 *     the Priya Chatbase AI ASSISTANT, not a physician. On a YMYL health page
 *     that is a false medical claim, not a marketing flourish. It was removed
 *     sitewide (DECISIONS.md 15 Jul 18:31:07) — and the rule then survived ONLY
 *     as a code comment at chrome.tsx:5-7. One careless edit re-introduces it.
 *     A rule that lives in a comment is not a rule. This file is that rule.
 *   · …38777 is a known-bad WhatsApp number (CLAUDE.md LOCKED FACTS). The
 *     correct number is +91 92898 38797. Any occurrence, any formatting, is a bug.
 *   · A hardcoded `REVIEWED = "2026-07-14"` was emitted as MedicalWebPage
 *     `lastReviewed` under a named BAMS physician, on every page, for reviews
 *     that never happened. `resolveReview()` now stops the DATA shape; this stops
 *     the CODE shape — a literal ISO date bolted to a REVIEW*-named binding.
 *   · The blanket promise "every health page is reviewed by a registered
 *     Ayurvedic physician" was false and was "removed sitewide — verified 0
 *     occurrences in built HTML". IT WAS NOT. It is alive in two files right now
 *     (llms.txt/route.ts, page.tsx) because the verification checked built HTML
 *     and llms.txt is a route, not HTML. Fixing one instance is not done
 *     (CLAUDE.md PROOF-OF-WORK). This lint greps every instance, every time.
 *
 * WHAT IS IN SCOPE. Shipped site source + content only (`sites/`), because that
 * is what reaches a patient. A post-mortem in DECISIONS.md, a rule in
 * docs/process/, an audit in launches/ and a CODE COMMENT EXPLAINING THE BAN are
 * all legitimate uses and are NOT violations — a lint that flags its own
 * documentation gets switched off within a week, and then it protects nothing.
 * Comments are stripped from code before scanning (string-aware, so a URL inside
 * a string literal is never mistaken for a `//` comment), and paths outside
 * `sites/` are not scanned at all.
 *
 * KNOWN LIMITATION, DELIBERATE: `packages/` is not scanned by default even
 * though it ships into sites, because packages/compliance/src/rules.js
 * legitimately carries the known-bad number as RULE DATA. Point `--root
 * packages` at it once that line carries a `banned-string-allow:` marker. Stated
 * here rather than silently skipped.
 *
 * CONTROL PROBE (§0.6 — binding on this gate BY NAME). "A zero is not believed
 * until a known-present control probe returns non-zero in the same run." Our own
 * banned-word scan once returned 0 hits because `[[:<:]]` silently fails under
 * ugrep — a broken lint reporting "clean" is worse than no lint. So every rule
 * here carries `probe` (text it MUST flag) and `antiProbes` (text it must NOT
 * flag — the negation corpus: our best, most honest sentences). Both run through
 * the real matcher on every invocation, before any file is read. A probe failure
 * EXITS 2 and blocks: a lint that cannot prove it still matches has not run.
 *
 * Exit codes: 0 = clean · 2 = violation OR broken probe (CI blocks) · 1 = harness error.
 *
 * Usage:
 *   node scripts/banned-string-lint.mjs [--root sites] [--json] [--help]
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
// ONE pattern list for the locked-count ban, shared with packages/compliance
// (which enforces it at edit time via the PostToolUse hook). A second copy of
// the patterns is a second thing to drift — the exact failure counts had.
import { LOCKED_COUNT_PATTERNS } from "../packages/compliance/src/rules.js";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Scanned as code — comments stripped first. */
export const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
/** Scanned as content. `.json` is here ON PURPOSE: whatisayurveda's entire
 *  ~3,400-page corpus is JSON, and packages/compliance's lint does not read it. */
export const CONTENT_EXTENSIONS = new Set([".json", ".md", ".mdx", ".html", ".txt"]);
/** Markup content that can carry comments (HTML and JSX-expression comments). */
const MARKUP_EXTENSIONS = new Set([".md", ".mdx", ".html"]);

export const IGNORED_DIRS = new Set([
  "node_modules", ".next", ".turbo", ".git", ".vercel", "dist", "out", "build",
  "coverage", "test", "tests", "__tests__", "fixtures", "test-results",
]);

/** A line carrying `banned-string-allow: <rule-id>` suppresses that rule on that
 *  line — and the suppression is REPORTED as info, so nothing disappears
 *  silently (the convention packages/compliance already uses). JSON content has
 *  no comment syntax and therefore no escape hatch: fix the copy. */
const ALLOW_RE = /banned-string-allow:\s*([a-z0-9,\s-]+)/i;

// ---------------------------------------------------------------------------
// Comment stripping — the load-bearing discrimination.
// ---------------------------------------------------------------------------

/** Chars after which a `/` starts a regex literal rather than a division.
 *  `>` and `}` are deliberately EXCLUDED: in JSX `<div></div>` puts `>` right
 *  before the `/` of a closing tag, and misreading that as a regex would let a
 *  real `//` comment on the same line survive into the scan — a false positive
 *  on a comment, the exact failure this stripper exists to prevent. */
const REGEX_START_AFTER = new Set(["", "(", ",", "=", ":", "[", "!", "&", "|", "?", ";", "+", "-", "*", "%", "~", "^", "{"]);

/**
 * Replace comment bodies with spaces, preserving every newline (so line numbers
 * survive) and every string literal (so "https://wa.me/…" is never mistaken for
 * a line comment).
 * @param {string} text
 * @returns {string}
 */
export function stripCodeComments(text) {
  const out = [...text];
  const n = text.length;
  let i = 0;
  let prev = ""; // last significant (non-whitespace) char
  while (i < n) {
    const c = text[i];
    const d = text[i + 1];
    // string / template literal — skipped whole, never stripped
    if (c === '"' || c === "'" || c === "`") {
      const q = c;
      i++;
      while (i < n) {
        if (text[i] === "\\") { i += 2; continue; }
        if (text[i] === q) { i++; break; }
        if (q !== "`" && text[i] === "\n") break; // unterminated — bail, don't hang
        i++;
      }
      prev = q;
      continue;
    }
    if (c === "/" && d === "/") {
      while (i < n && text[i] !== "\n") { out[i] = " "; i++; }
      continue;
    }
    if (c === "/" && d === "*") {
      out[i] = " "; out[i + 1] = " "; i += 2;
      while (i < n && !(text[i] === "*" && text[i + 1] === "/")) {
        if (text[i] !== "\n") out[i] = " ";
        i++;
      }
      if (i < n) { out[i] = " "; out[i + 1] = " "; i += 2; }
      continue;
    }
    if (c === "/" && REGEX_START_AFTER.has(prev)) {
      i++; // regex literal — skip so its `//` cannot masquerade as a comment
      let inClass = false;
      while (i < n) {
        const ch = text[i];
        if (ch === "\\") { i += 2; continue; }
        if (ch === "\n") break; // a regex literal cannot span lines
        if (ch === "[") inClass = true;
        else if (ch === "]") inClass = false;
        else if (ch === "/" && !inClass) { i++; break; }
        i++;
      }
      prev = "/";
      continue;
    }
    if (!/\s/.test(c)) prev = c;
    i++;
  }
  return out.join("");
}

/** Strip `<!-- -->` and `{/* *​/}` from markup content, preserving newlines. */
export function stripMarkupComments(text) {
  const blank = (m) => m.replace(/[^\n]/g, " ");
  return text
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, blank);
}

/**
 * @param {string} text
 * @param {"code"|"markup"|"plain"} kind
 */
export function stripComments(text, kind) {
  if (kind === "code") return stripCodeComments(text);
  if (kind === "markup") return stripMarkupComments(text);
  return text;
}

// ---------------------------------------------------------------------------
// Rules. Every one is [OURS] — a failure we committed and documented.
// ---------------------------------------------------------------------------

/**
 * @typedef {{ line:number, message:string }} Hit
 * @typedef {{ id:string, appliesTo:"code"|"content"|"both", why:string,
 *             scan:(ctx:{text:string,lines:string[],lineAt:(i:number)=>number})=>Hit[],
 *             probe:string, probeKind?:"code"|"markup"|"plain", antiProbes:string[] }} Rule
 */

/**
 * Collect every match of `re` over the whole text, mapped back to a line number.
 * `skip(m, ctx)` drops a match before it becomes a finding.
 */
function reScan(ctx, re, message, skip) {
  /** @type {Hit[]} */
  const hits = [];
  const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  let m;
  while ((m = r.exec(ctx.text)) !== null) {
    if (m[0].length === 0) { r.lastIndex++; continue; }
    if (skip && skip(m, ctx)) continue;
    hits.push({ line: ctx.lineAt(m.index), message: message(m) });
  }
  return hits;
}

/** Negation cues that flip an assertion into an honest denial of it. */
const NEGATION_CUE = /\b(?:not|never|nor|cannot|no)\b|n't\b/i;

/**
 * True when the match sits in a clause already negated — "NOT every page is
 * reviewed", "we do NOT claim every page is reviewed". §0.6's companion rule:
 * the Healing Secrets booklet's "is not a cure for cancer" is exemplary honest
 * drafting that a naive lint flags, and a lint that punishes our best sentence
 * teaches everyone to ignore it.
 *
 * The window is the current clause only — bounded by the previous `.`, `;` or
 * newline — so a negation in a NEIGHBOURING sentence cannot launder a claim
 * ("We never overstate. Every page is reviewed by a doctor." still fails).
 *
 * HONEST LIMIT: this is a heuristic, not a parser. A negation placed earlier in
 * the same clause but not governing the claim ("we do not exaggerate: every page
 * is reviewed") suppresses it. That is a deliberate trade — a false positive on
 * honest copy gets the lint disabled; this false negative is adversarially
 * shaped, and `G6-PROC`/`G6-FACT` (auditors) are the backstop for prose written
 * to slip a gate.
 */
function inNegatedClause(m, ctx) {
  const from = Math.max(0, m.index - 120);
  const before = ctx.text.slice(from, m.index);
  const cut = Math.max(before.lastIndexOf("."), before.lastIndexOf("\n"), before.lastIndexOf(";"));
  return NEGATION_CUE.test(cut >= 0 ? before.slice(cut + 1) : before);
}

/** The digits of a line, so any formatting of a phone number is caught. */
const digitsOf = (s) => s.replace(/\D/g, "");

export const KNOWN_BAD_WHATSAPP_DIGITS = "9289838777";
export const CORRECT_WHATSAPP = "+91 92898 38797";
export const CONTACT_EMAIL = "info@kairali.com";

/** @type {Rule[]} */
export const RULES = [
  {
    id: "ask-a-doctor",
    appliesTo: "both",
    why: '"Ask a doctor on WhatsApp" reached the Priya AI chatbot. A false medical claim on a YMYL page (DECISIONS.md 15 Jul 18:31:07, MR-3).',
    // Article REQUIRED, so honest prose ("ask what a doctor thinks") is untouched.
    // \s+ crosses newlines: JSX wraps prose, and a claim split over two lines is
    // still a claim on the rendered page.
    scan: (ctx) =>
      reScan(
        ctx,
        /\bask\s+(?:a|an|the|our|your)\s+(?:[a-z]+\s+){0,2}?(?:doctors?|physicians?|vaidyas?|clinicians?)\b/gi,
        (m) =>
          `"${m[0].replace(/\s+/g, " ")}" claims a human clinical channel. ` +
          `+91 92898 38797 is the Priya AI assistant, not a physician — disclose it as AI ("Ask Priya, our AI assistant").`
      ),
    probe: "Ask a doctor on WhatsApp",
    antiProbes: [
      // The site footer. Exemplary honest drafting — a lint that punishes our
      // best sentence teaches everyone to ignore it (§0.6 companion).
      "Always consult a doctor before starting any treatment.",
      "Ayurvedic therapies and herbs should be used under the guidance of a qualified physician.",
      "Ask Priya, our AI assistant",
      "You may want to ask what a doctor thinks before starting.",
    ],
  },
  {
    id: "wrong-whatsapp-38777",
    appliesTo: "both",
    why: `CLAUDE.md LOCKED FACTS: Priya's KTAHV WhatsApp is ${CORRECT_WHATSAPP}. Any occurrence of …38777 is WRONG — fix on sight.`,
    // Line-scoped: digit normalisation over a whole file would fuse unrelated numbers.
    scan: (ctx) => {
      /** @type {Hit[]} */
      const hits = [];
      ctx.lines.forEach((line, i) => {
        if (digitsOf(line).includes(KNOWN_BAD_WHATSAPP_DIGITS)) {
          hits.push({ line: i + 1, message: `Known-bad WhatsApp number (…38777). The locked fact is ${CORRECT_WHATSAPP}.` });
        }
      });
      return hits;
    },
    probe: "WhatsApp +91 92898 38777",
    antiProbes: [
      `WhatsApp ${CORRECT_WHATSAPP}`,
      'const WHATSAPP_URL = "https://wa.me/919289838797";',
    ],
  },
  {
    id: "hardcoded-review-date",
    appliesTo: "code",
    why: 'We shipped `REVIEWED = "2026-07-14"` stamped onto EVERY page as MedicalWebPage lastReviewed under a named BAMS physician, for reviews that never happened. A review date is per-page data set on genuine sign-off (medical-review.ts), never a constant in code.',
    scan: (ctx) => [
      // (a) a REVIEW*-named binding holding a literal ISO date. The name filter
      //     is applied to the CAPTURE, not to the message: `const LAUNCH_DATE =
      //     "2026-07-14"` is a launch date, not a medical claim, and must pass.
      ...reScan(
        ctx,
        /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(["'`])(\d{4}-\d{2}-\d{2})\2/g,
        (m) => (/review/i.test(m[1])
          ? `\`${m[1]} = "${m[3]}"\` — a literal review date hardcoded in shipped code. A review date is per-page data set on genuine sign-off; pass \`reviewedOn\` to resolveReview(). No review, no date.`
          : "")
      ).filter((h) => h.message !== ""),
      // (b) the emitted shape: a review key bound to a literal ISO date in code.
      //     Content JSON is exempt by `appliesTo: "code"` — `"reviewedOn":
      //     "2026-07-15"` in a page file is the LEGITIMATE per-page datum.
      ...reScan(
        ctx,
        /(["']?)(lastReviewed|reviewedOn|reviewedAt|reviewedDate|reviewDate|dateReviewed)\1\s*:\s*(["'])(\d{4}-\d{2}-\d{2})\3/gi,
        (m) => `\`${m[2]}: "${m[4]}"\` — a literal review date in shipped code asserts a review that no physician performed. Use resolveReview(page.reviewedOn).`
      ),
    ],
    probe: 'const REVIEWED = "2026-07-14";',
    antiProbes: [
      "lastReviewed: review?.date,",
      "reviewedOn?: string;",
      'const LAUNCH_DATE = "2026-07-14";',
      '  const review = resolveReview(page.reviewedOn, page.reviewedBy, page.slug);',
    ],
  },
  {
    id: "blanket-review-claim",
    appliesTo: "both",
    why: 'The promise "every health page is reviewed by a registered Ayurvedic physician" was false, was ruled removed sitewide, and is STILL LIVE in the repo. It is arithmetically undeliverable across ~3,400 pages: today 0 pages carry a `reviewedOn`. Genuinely reviewed pages are MARKED; the rest state what they are.',
    // The claim shape is a quantifier ASSERTING the review as fact:
    // "<every|all|each> … page … <is|are|has been> … reviewed" — OR the
    // elliptical participle form with no copula at all, "every health page
    // checked by a BAMS doctor" (the whatisayurveda trust-strip tile that
    // slipped the original copula-anchored pattern; widened 20 Jul 2026 per
    // the erosion-handover finding, D-REVIEW-2). The verb set covers the
    // synonyms a rewrite reaches for (checked/vetted/verified/approved) and
    // hyphenated participles ("physician-reviewed").
    // It is NOT triggered by copy that merely REPORTS review state — "each page
    // states honestly whether a physician has reviewed it yet" (about.json) is
    // our honest sentence and must survive. Nor by a negated claim — "not every
    // page is reviewed" is the honest form, and a lint that flags our best
    // sentence teaches everyone to ignore it (§0.6 negation-awareness). Nor by
    // the per-page rule itself — "Reviewed pages carry the doctor's name and
    // date" opens with the participle, carries no quantifier, and must survive.
    scan: (ctx) =>
      reScan(
        ctx,
        /\b(?:every|all|each)\s+(?:[a-z]+\s+){0,3}?(?:pages?|articles?|monographs?)\b(?:(?:\s+[a-z]+){0,4}?\s+(?:is|are|has\s+been|have\s+been|gets?|will\s+be)\s+(?:(?!not\b)[a-z-]+\s+){0,2}?|\s+)(?:[a-z]+-)?(?:reviewed|checked|vetted|verified|approved)\b/gi,
        (m) =>
          `"${m[0].replace(/\s+/g, " ")}" — a blanket physician-review claim. ` +
          `Coverage is per-page (\`reviewedOn\`, today 0 pages carry one); asserting it for all pages is the fabricated-review failure written in prose.`,
        inNegatedClause
      ),
    probe: "Every health page checked by a BAMS doctor.",
    antiProbes: [
      "Health pages reviewed by one of our Ayurvedic physicians are marked with that doctor's name and the date they approved it.",
      "each page states honestly whether a physician has reviewed it yet.",
      "A page one of them has approved carries their name and the date; a page that has not been reviewed yet says so at the top.",
      "Not every page is reviewed by a physician, and we say so on the ones that are not.",
      "We do not claim every page is reviewed.",
      "Reviewed pages carry the doctor's name and date.",
      "Physician-reviewed pages carry the doctor's name and date.",
    ],
  },
  {
    id: "hardcoded-centres-count",
    appliesTo: "both",
    why:
      'The centres/countries count was hardcoded 12× ("nine countries") across two shipped sites while the verified network was 14 centres in 5 countries ' +
      "(retro-audit 17 Jul 2026; canonical = the KAC website's figures, PROJECT_CONTEXT §12). A typed count — stale OR currently-correct — rots the day the " +
      "network changes. Copy renders the computed constants from @kairali/facts (CENTRES_COUNT, COUNTRIES_PHRASE, CENTRES_NETWORK_LINE).",
    scan: (ctx) =>
      LOCKED_COUNT_PATTERNS.flatMap(({ re, note }) =>
        // No figures in the message — the canonical numbers live in @kairali/facts
        // (computed); a number typed here would rot exactly the way the rule forbids.
        reScan(ctx, re, (m) => `"${m[0].replace(/\s+/g, " ")}" — ${note}. Network counts are canonical (KAC site ruling 17 Jul 2026, PROJECT_CONTEXT §12) and render from @kairali/facts constants; never type one.`)
      ),
    probe: "Treatment centres across nine countries",
    antiProbes: [
      // "six doors" is the flagship's own summary line (ruled composition,
      // DECISIONS.md 14 Jul 19:05; count corrected five→six 21 Jul per
      // RPT-20260721-DEEPC C-SC-01) — numbers next to a different noun must
      // never trip a countries/centres count ban.
      "One family, six doors: an NABH-accredited Ayurvedic hospital, WHO-GMP medicine manufacturing, Ayurveda training, Villa Raag in Goa, and the Kairali franchise network.",
      // digit boundaries: 195 must not contain a "9 countries" / "5 countries" hit
      "Ayurveda is practised in 195 countries today.",
      // the constants-rendered form is the CORRECT shape — it must always pass
      "`${CENTRES_COUNT} treatment centres across ${COUNTRIES_PHRASE}`",
      "Nine practitioners trained in five disciplines",
    ],
  },
  {
    id: "wrong-contact-email",
    appliesTo: "both",
    why: `CLAUDE.md LOCKED FACTS: the public contact email everywhere is ${CONTACT_EMAIL}.`,
    scan: (ctx) =>
      reScan(ctx, /[A-Za-z0-9._%+-]+@kairali\.com/g, (m) =>
        m[0].toLowerCase() === CONTACT_EMAIL ? "" : `"${m[0]}" — the public contact email everywhere is ${CONTACT_EMAIL}.`
      ).filter((h) => h.message !== ""),
    probe: "reservations@kairali.com",
    antiProbes: [CONTACT_EMAIL, "info@kairalicentres.com", "info@kairali.mu"],
  },
  {
    id: "deepu-name-conflation",
    appliesTo: "both",
    why: 'CLAUDE.md LOCKED FACTS — two Deepus: "Deepu" is the web developer; "Dr. Deepu John" is the chief physician. On a shipped page the physician\'s name is always written in full: a truncated "Dr. Deepu" or a bare "Deepu John" on a medical byline is the conflation the rulebook forbids.',
    scan: (ctx) => {
      // EXEMPTION — sites/kairali.ai ONLY. That site is the INTERNAL, noindex
      // ops manual (Fleet Pulse + the team Playbook) whose subject matter IS
      // Deepu-the-developer: the publisher role appears ~130 times by design.
      // This rule's assumption — every bare "Deepu" on a shipped page is a
      // truncated physician byline — is false there and only there. Patient-
      // facing sites keep the rule at FULL strength. Same standing internal-
      // site ruling as D-RULE-MATRIX-EXEMPT (factory-matrix-lint), and like
      // that exemption it lives HERE, loudly, not in a config nobody reads.
      // Ratified by Abilash via merge of PR #109 (18 Jul 2026).
      if (ctx.file && ctx.file.includes("sites/kairali.ai/")) return [];
      /** @type {Hit[]} */
      const hits = [];
      ctx.lines.forEach((line, i) => {
        // Remove every correct rendering, then see if the name survives.
        const rest = line.replace(/Dr\.\s+Deepu\s+John/g, "");
        if (/\bDeepu\b/.test(rest)) {
          hits.push({ line: i + 1, message: `"Deepu" not written as the full "Dr. Deepu John". Two Deepus (CLAUDE.md): the developer and the chief physician — never conflate on a shipped page.` });
        }
      });
      return hits;
    },
    probe: "Reviewed by Deepu John",
    antiProbes: [
      "Medically reviewed by Dr. Deepu John (BAMS)",
      '  "deepu-john": {',
      "- **Dr. Deepu John, BAMS** — Chief Physician & Head of Department",
    ],
  },
  {
    id: "group-attached-1908",
    appliesTo: "both",
    why:
      "DECISIONS.md 16 Jul (Abilash, primary source): 1908 is the FAMILY lineage origin; the GROUP was founded 1989. " +
      '"Kairali Ayurvedic Group — Since 1908" / "founded 1908" conflates the two — the ruled fix is "a family tradition since 1908". ' +
      "Four shipped sites carried the wrong form on main for three days after the ruling (findings B-144, CARD-4 / D-20260720-25). " +
      "Companion typed-rolling ban (D-ROLLING-NUMBER): a copyright year is computed, never typed — \"© 1908–2026\" shipped on four footers.",
    scan: (ctx) => {
      /** @type {Hit[]} */
      const hits = [];
      ctx.lines.forEach((line, i) => {
        // (a) "founded 1908" — always wrong: nothing of ours was FOUNDED in 1908
        //     (the group: 1989; the first clinic was opened, and lineage prose
        //     never uses "founded").
        if (/\bfounded\s+(?:in\s+)?1908\b/i.test(line)) {
          hits.push({ line: i + 1, message: `"founded 1908" — the group was founded 1989; 1908 is the family lineage. Ruled form: "founded 1989; a family practising Ayurveda since 1908".` });
        }
        // (b) "Group … Since 1908" with ONLY punctuation between — the exact
        //     prohibited overline/title shape. Words between ("Group (physicians
        //     since 1908", "Group — a family tradition since 1908") stay legal.
        if (/\bGroup\s*[—–·,:-]?\s*(?:est\.?\s+)?since\s+1908\b/i.test(line)) {
          hits.push({ line: i + 1, message: `Group-attached "Since 1908". The group dates to 1989; the ruled form is "· A family tradition since 1908".` });
        }
        // (c) a TYPED copyright year — "© 1908–2026", "© 2026", "© 1989–2026".
        //     Rolling values are computed ({new Date().getFullYear()}), never
        //     typed (D-ROLLING-NUMBER). A fixed span START before a computed end
        //     ("© 1989–{…}") has no literal year token directly after © or the
        //     dash, so it stays legal.
        if (/©\s*(?:19|20)\d{2}\s*[—–-]\s*(?:19|20)\d{2}\b/.test(line) || /©\s*(?:19|20)\d{2}\b(?!\s*[—–-]\s*\{)/.test(line)) {
          hits.push({ line: i + 1, message: `Typed copyright year. Rolling values are computed, never typed (D-ROLLING-NUMBER): © {new Date().getFullYear()} …` });
        }
      });
      return hits;
    },
    probe: "Kairali Ayurvedic Group · Since 1908",
    antiProbes: [
      // The ruled forms — the lint must never flag our own corrections.
      // ("WHO-GMP manufacturer · Since 1908, founded 1989" sat here until
      // 21 Jul 2026: Phase C ruled the manufacture-attached form WRONG too
      // (RPT-20260721-DEEPC C-LF-02/03) — it is now the PROBE of
      // manufacture-attached-1908 below. Same string, opposite verdict, on
      // the record.)
      "a family tradition since 1908",
      "Kairali Ayurvedic Group founded 1989 by K. V. Ramesh and Gita Ramesh; the family has practised Ayurveda since 1908 (four generations, family-run)",
      "part of the Kairali Ayurvedic Group (physicians since 1908; NABH hospital + WHO-GMP pharmacy)",
      "Kairali Ayurvedic Group · A family tradition since 1908",
      "a family of Ayurvedic physicians since 1908",
      "© 1989–{new Date().getFullYear()} Kairali Ayurvedic Group.",
    ],
  },
  {
    id: "manufacture-attached-1908",
    appliesTo: "both",
    why:
      "Phase-C findings C-LF-02/C-LF-03/C-SC-03 (RPT-20260721-DEEPC): both bulk-B2B sites shipped 1908 attached to MANUFACTURE " +
      '("Trusted since 1908 — four generations of Ayurvedic manufacture", "WHO-GMP manufacturer · Since 1908, founded 1989"). ' +
      "The ruled timeline (D-1908-DOC) puts Ayurvedic MANUFACTURING at 1948; 1908 is the family's first clinic. The licensed " +
      'pairing is "founded 1989; a family practising Ayurveda since 1908" — a manufacture claim dates from 1948, never 1908.',
    scan: (ctx) => {
      /** 1948 in the same clause corrects the attachment — the canonical
       *  "since 1908 — manufacturing since 1948" must always pass. The clause
       *  runs from the match to the next `.` `;` or newline. */
      const clauseCorrects1948 = (m, c) => /1948/.test(c.text.slice(m.index).split(/[.;\n]/, 1)[0]);
      return [
        // (a) manufactur* joined to "since 1908" by punctuation/space only —
        //     "manufacturer · Since 1908", "manufacture since 1908". Words in
        //     between ("manufacturer · founded 1989 · a family practising
        //     Ayurveda since 1908") break the attachment and stay legal.
        ...reScan(
          ctx,
          /\bmanufactur\w*\s*[—–·,:&()-]*\s*(?:est\.?\s+)?since\s+1908\b/gi,
          (m) => `"${m[0].replace(/\s+/g, " ")}" — manufacture attached to 1908. Manufacturing dates from 1948; 1908 is the family's first clinic (D-1908-DOC). Ruled pairing: "founded 1989; a family practising Ayurveda since 1908".`
        ),
        // (b) "since 1908" with manufactur* later in the SAME clause and no
        //     1948 correcting it — "Trusted since 1908 — four generations of
        //     Ayurvedic manufacture".
        ...reScan(
          ctx,
          /\bsince\s+1908\b[^.;\n]{0,90}?\bmanufactur\w*/gi,
          (m) => `"${m[0].replace(/\s+/g, " ")}" — 1908 and manufacture in one clause with no 1948. Split the facts: family practice since 1908 · manufacturing since 1948 (D-1908-DOC).`,
          clauseCorrects1948
        ),
        // (c) the dangling compression "Since 1908, founded 1989" — it attaches
        //     1908 to whatever noun precedes it (on both bulk sites: the
        //     manufacturer). The ruled order puts 1989 first, with the family
        //     phrase carrying 1908.
        ...reScan(
          ctx,
          /\bsince\s+1908\s*,\s*founded\s+(?:in\s+)?1989\b/gi,
          (m) => `"${m[0].replace(/\s+/g, " ")}" — the "Since 1908, founded 1989" compression attaches 1908 to the preceding noun. Ruled form: "founded 1989; a family practising Ayurveda since 1908".`
        ),
        // (d) "four generations of … manufacture" — the generations count
        //     belongs to the family PRACTICE (since 1908); manufacture spans
        //     from 1948 only.
        ...reScan(
          ctx,
          /\bfour\s+generations\s+of\s+(?:[A-Za-z]+\s+){0,2}?manufactur\w*/gi,
          (m) => `"${m[0].replace(/\s+/g, " ")}" — "four generations" belongs to the family practice (since 1908); manufacture spans from 1948 (D-1908-DOC). Write "four generations practising Ayurveda" or date the manufacture from 1948.`
        ),
      ];
    },
    probe: "WHO-GMP manufacturer · Since 1908, founded 1989",
    antiProbes: [
      // The ruled corrections — the lint must never flag its own fix wave.
      "A family practising Ayurveda since 1908 — manufacturing since 1948.",
      "founded 1989; a family practising Ayurveda since 1908",
      "Kairali Ayurvedic Group · A family tradition since 1908",
      "Four generations practising Ayurveda since 1908; Ayurvedic manufacturing since 1948.",
      "WHO-GMP manufacturer · founded 1989 · a family practising Ayurveda since 1908",
      "WHO-GMP manufacture at Pollachi. Founded 1989; a family practising Ayurveda since 1908.",
    ],
  },
  {
    id: "llms-legal-entity",
    appliesTo: "both",
    why:
      "DECISIONS.md ruling 14 standing consequence (17 Jul, Abilash): llms.txt files carry brand/property facts, NEVER " +
      "legal-entity names — entity names stay on genuinely legal surfaces. Breached the very next day: PR #159 shipped " +
      "'Kairali Ayurvedic Products Pvt. Ltd.' in both bulk-site llms.txt summaries with no recorded exception " +
      "(findings B-212/B-235, purged by CARD-4(b) / D-20260720-25 fix 2). This row is the 'so it cannot recur' half.",
    scan: (ctx) => {
      // SCOPE — the machine-facts surface ONLY: any file under an app/llms.txt/
      // route (plus the probe corpus, whose synthetic <probe:…> file id carries
      // no path). About pages, terms, imprints are genuinely legal surfaces and
      // may print the registered name — flagging them would invert the ruling.
      if (ctx.file && !ctx.file.includes("llms.txt") && !ctx.file.startsWith("<probe:")) return [];
      /** @type {Hit[]} */
      const hits = [];
      ctx.lines.forEach((line, i) => {
        if (/\bPvt\.?\s?Ltd\.?|\bPrivate\s+Limited\b|\bLLP\b/i.test(line)) {
          hits.push({ line: i + 1, message: `Legal-entity name in an llms.txt machine-facts file. Ruling 14: brand/property facts only — write the brand ("Kairali Ayurvedic Products (KAPPL)"); the registered name lives on legal surfaces.` });
        }
      });
      return hits;
    },
    probe: "The bulk-supply desk of Kairali Ayurvedic Products Pvt. Ltd. (KAPPL)",
    antiProbes: [
      // The corrected brand form and the facts lines that were always legal.
      "The bulk-supply desk of Kairali Ayurvedic Products (KAPPL): manufacturer-direct bulk supply",
      "Manufacturer: KAPPL, Pollachi, Tamil Nadu — in-house laboratories and herb extraction",
      "Certifications (as published by KAPPL): WHO-GMP, ISO, FSSAI",
      "Operator: Kairali Ayurvedic Group — founded 1989; a family practising Ayurveda since 1908",
    ],
  },
];

// ---------------------------------------------------------------------------
// Scanning
// ---------------------------------------------------------------------------

/** @typedef {{file:string,line:number,severity:"error"|"info",rule:string,message:string,excerpt:string}} Finding */

/**
 * Scan one file's text.
 * @param {string} text
 * @param {{file?:string, kind:"code"|"markup"|"plain", rules?:Rule[]}} opts
 * @returns {Finding[]}
 */
export function scanText(text, { file = "<text>", kind, rules = RULES }) {
  const scanned = stripComments(text, kind);
  const rawLines = text.split(/\r?\n/);
  const lines = scanned.split(/\r?\n/);

  // offset -> line number (1-based)
  const lineStarts = [0];
  for (let i = 0; i < scanned.length; i++) if (scanned[i] === "\n") lineStarts.push(i + 1);
  const lineAt = (idx) => {
    let lo = 0, hi = lineStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lineStarts[mid] <= idx) lo = mid; else hi = mid - 1;
    }
    return lo + 1;
  };

  const ctx = { text: scanned, lines, lineAt, file };
  const applies = kind === "code" ? "code" : "content";

  /** @type {Finding[]} */
  const findings = [];
  for (const rule of rules) {
    if (rule.appliesTo !== "both" && rule.appliesTo !== applies) continue;
    for (const hit of rule.scan(ctx)) {
      const raw = rawLines[hit.line - 1] ?? "";
      const allow = raw.match(ALLOW_RE);
      const suppressed = allow && allow[1].split(",").map((s) => s.trim().toLowerCase()).includes(rule.id);
      findings.push({
        file,
        line: hit.line,
        severity: suppressed ? "info" : "error",
        rule: rule.id,
        message: suppressed ? `suppressed by banned-string-allow: ${rule.id} — ${hit.message}` : hit.message,
        excerpt: raw.trim().slice(0, 160),
      });
    }
  }
  return findings;
}

/** @param {string} file */
export function kindOf(file) {
  const ext = extname(file).toLowerCase();
  if (CODE_EXTENSIONS.has(ext)) return "code";
  if (MARKUP_EXTENSIONS.has(ext)) return "markup";
  if (CONTENT_EXTENSIONS.has(ext)) return "plain";
  return null;
}

/** @param {string} dir @param {string[]} out */
export function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (IGNORED_DIRS.has(name) || name.startsWith(".")) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (kindOf(p)) out.push(p);
  }
  return out;
}

/**
 * @param {string[]} roots absolute or repo-relative dirs
 * @returns {{findings:Finding[], filesScanned:number}}
 */
export function scanRoots(roots) {
  /** @type {Finding[]} */
  const findings = [];
  let filesScanned = 0;
  for (const root of roots) {
    const abs = resolve(REPO_ROOT, root);
    if (!existsSync(abs)) throw new Error(`root does not exist: ${root}`);
    for (const file of walk(abs)) {
      filesScanned++;
      findings.push(...scanText(readFileSync(file, "utf8"), { file: relative(REPO_ROOT, file), kind: kindOf(file) }));
    }
  }
  return { findings, filesScanned };
}

// ---------------------------------------------------------------------------
// Control probe (§0.6) — run BEFORE any file is read.
// ---------------------------------------------------------------------------

/**
 * Run every rule against text it MUST flag and text it must NOT flag, through
 * the real matcher. A rule that stops matching is a rule that has stopped
 * existing — and it would report "clean".
 * @param {Rule[]} rules
 */
export function runControlProbes(rules = RULES) {
  const broken = [];
  for (const rule of rules) {
    const kind = rule.probeKind ?? (rule.appliesTo === "code" ? "code" : "plain");
    const hits = scanText(rule.probe, { file: `<probe:${rule.id}>`, kind, rules: [rule] });
    if (hits.length === 0) broken.push(`${rule.id}: PROBE DID NOT MATCH its known-present text — the rule is broken and would report clean. Probe: ${JSON.stringify(rule.probe)}`);
    for (const anti of rule.antiProbes) {
      const bad = scanText(anti, { file: `<anti:${rule.id}>`, kind, rules: [rule] });
      if (bad.length > 0) broken.push(`${rule.id}: ANTI-PROBE FIRED on legitimate text — the rule punishes honest copy. Text: ${JSON.stringify(anti)}`);
    }
  }
  const probes = rules.length;
  const antiProbes = rules.reduce((n, r) => n + r.antiProbes.length, 0);
  return { ok: broken.length === 0, broken, probes, antiProbes };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const HELP = `banned-string-lint — strings that must never ship on a Kairali site.

  node scripts/banned-string-lint.mjs [--root <dir>]... [--json]

  --root <dir>  scan root, repeatable (default: sites)
  --json        machine-readable report on stdout

exit 0 clean · 2 violation or broken control probe (CI blocks) · 1 harness error
Rubric: docs/process/rubrics/G6-PRE-STRINGS.md`;

function main(argv) {
  if (argv.includes("--help") || argv.includes("-h")) { console.log(HELP); return 0; }
  const json = argv.includes("--json");
  /** @type {string[]} */
  const roots = [];
  for (let i = 0; i < argv.length; i++) if (argv[i] === "--root") roots.push(argv[++i]);
  if (roots.length === 0) roots.push("sites");

  const probe = runControlProbes();
  if (!probe.ok) {
    console.error(`\nbanned-string-lint: CONTROL PROBE FAILED — this gate did not run.\n`);
    for (const b of probe.broken) console.error(`  ✗ ${b}`);
    console.error(`\nA lint that cannot prove it still matches is worse than no lint (§0.6). Fix the rule; never delete the probe.`);
    return 2;
  }

  const { findings, filesScanned } = scanRoots(roots);
  if (filesScanned === 0) {
    console.error(`banned-string-lint: 0 files scanned under ${roots.join(", ")} — the walk is broken, not the repo clean (§0.6).`);
    return 2;
  }

  const errors = findings.filter((f) => f.severity === "error");
  const infos = findings.filter((f) => f.severity === "info");

  if (json) {
    console.log(JSON.stringify({
      gate: "G6-PRE-STRINGS",
      rubric: "docs/process/rubrics/G6-PRE-STRINGS.md",
      status: errors.length === 0 ? "PASS" : "FAIL",
      roots, files_scanned: filesScanned, rules: RULES.map((r) => r.id),
      control_probe: { name: "per-rule probe + negation corpus", expected: true, observed: probe.ok, probes: probe.probes, anti_probes: probe.antiProbes },
      findings,
    }, null, 2));
    return errors.length === 0 ? 0 : 2;
  }

  console.log(`\nbanned-string-lint — ${RULES.length} rules · ${filesScanned} files under ${roots.join(", ")}`);
  console.log(`control probe: ${probe.probes}/${probe.probes} rules matched their known-present text · ${probe.antiProbes}/${probe.antiProbes} negation probes stayed clean`);
  for (const f of infos) console.log(`\nINFO  ${f.file}:${f.line} [${f.rule}] ${f.message}\n      > ${f.excerpt}`);
  for (const f of errors) {
    const rule = RULES.find((r) => r.id === f.rule);
    console.log(`\nERROR ${f.file}:${f.line} [${f.rule}] ${f.message}\n      > ${f.excerpt}\n      why: ${rule?.why}`);
  }
  console.log(errors.length === 0
    ? `\nPASS — 0 violations.\n`
    : `\nFAIL — ${errors.length} violation${errors.length === 1 ? "" : "s"}. Fix the copy; never the gate (CLAUDE.md rule g).\n`);
  return errors.length === 0 ? 0 : 2;
}

// NOTE: comparing import.meta.url to process.argv[1] as raw STRINGS silently
// broke on any checkout path containing a space — import.meta.url percent-encodes
// it, argv[1] does not — so main() never ran and the script exited 0 having
// checked NOTHING. Normalising argv[1] through URL() fixes it with no new import.
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    console.error(`banned-string-lint: harness error — ${e.message}`);
    process.exit(1);
  }
}
