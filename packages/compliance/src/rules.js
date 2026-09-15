/**
 * Rule data transcribed from CLAUDE.md (fleet rulebook) and PROJECT_CONTEXT.md §4.
 * These lists are LAW — amendments only via Abilash, logged in CLAUDE.md CHANGELOG.
 *
 * DE/FR equivalents are SEEDED from the examples in CLAUDE.md ("Kur/Urlaub/Luxus,
 * cure/vacances/luxe") and await native/legal confirmation — see QUESTIONS.md.
 */

/**
 * KTAHV GST clinical lock — applies to entity "ktahv" ONLY (never Raag/KAPPL).
 * Union of CLAUDE.md list and PROJECT_CONTEXT §4.1 (adds getaway/escape).
 *
 * Abilash directive 13 Jul 2026: locks cover EVERY locale a site targets per
 * SITE_DESIGN_LOCALE_REGISTER.md — not just DE/FR. Before any locale ships,
 * its banned-equivalents list must exist here (AR/RU for guru-family, CS for
 * .cz, etc.) and be native-reviewed. A locale with no list is a launch
 * blocker, not a pass.
 */
export const CLINICAL_LOCK_BANNED = {
  en: [
    "spa",
    "resort",
    "holiday",
    "holidays",
    "luxury",
    "luxurious",
    "cure",
    "cures",
    "journey",
    "journeys",
    "guest",
    "guests",
    "getaway",
    "getaways",
    "escape",
    "escapes",
  ],
  // SEED lists — confirm with native review before hard CI gate (QUESTIONS.md)
  // REBUILT 16 Jul 2026 on a principle, after BOTH auditors failed the previous
  // lists. The old ones were translations of the English ban — which was exactly
  // wrong, and made BOTH readers worse:
  //   patient: "this doesn't sound like a hospital; they avoid normal hospital words"
  //   GST officer: "they talk like a resort and avoid clinical terms — supports our case"
  //
  // THE PRINCIPLE (GPT-5's answer to the actual question): ban the vocabulary a
  // RESORT uses that a HOSPITAL never would. Do NOT ban clinical language merely
  // because its English cognate is banned — the English "cure" ban is about
  // EFFICACY claims, a different rule with a different reason.
  //
  // REMOVED and why (they are standard hospital register; banning them forced
  // writers toward worse, less clinical prose — the opposite of the tax goal):
  //   fr "séjour"/"séjours" — "séjour hospitalier", "durée de séjour" are THE
  //       standard French terms for a hospital stay. Banning it was self-defeating.
  //   fr "cure"/"cures" — French "cure" = a course of treatment ("cure de
  //       sevrage"); a false friend of English "cure". Efficacy claims are caught
  //       by the cure-claims rule, which is a separate lint with a separate reason.
  //   de "kur" — a REGULATED German rehabilitation concept inside statutory
  //       healthcare (Perplexity, 14 sources; formal Reha-vs-Kur distinction).
  //       The SPA risk lives in "kurort"/"kurhotel" (spa town/spa hotel), which
  //       ARE banned below. Banning "kur" itself blocked legitimate medical German.
  //
  // ADDED: the resort lexicon the old lists missed entirely — a German
  // Wellnesshotel and a French centre de bien-être use these; a hospital does not.
  // INTERIM: validated by GPT-5 + Perplexity only (Abilash's ruling, 16 Jul).
  // A native DE/FR speaker + the GST adviser must still confirm. See QUESTIONS.md.
  de: [
    // hospitality/wellness register — a Klinik never says these
    "wellness", "wellnesshotel", "retreat", "kurort", "kurhotel", "kurzurlaub",
    "urlaub", "luxus", "luxuriös", "resort", "spa", "erholung", "auszeit",
    "verwöhn", "pauschale", "wohlfühl",
    // "guest" — a hospital says Patient
    "gast", "gäste",
  ],
  fr: [
    // hospitality/wellness register — an hôpital/clinique never says these
    "vacances", "luxe", "luxueux", "luxueuse", "escapade", "escapades",
    "évasion", "spa", "resort", "bien-être", "forfait", "détente",
    "ressourcement", "parenthèse",
    // "guest" — a hospital says patient
    "invité", "invités", "hôte", "hôtes",
  ],
};

/** Required clinical register (advisory — reported as info, never a failure). */
export const CLINICAL_REGISTER_EXPECTED = [
  "patient",
  "physician",
  "treatment",
  "programme",
  "Panchakarma",
  "admission",
  "discharge",
  "consultation",
];

/** Banned filler — ALL entities, group-wide (Brand Manual ch.11 via PROJECT_CONTEXT §4.2). */
export const BANNED_FILLER = [
  "bespoke",
  "curated",
  "discerning",
  "unparalleled",
  "nestled",
  "indulge",
  "pamper",
  "exquisite",
  "world-class",
  "unique",
];

/**
 * Cure-claim patterns — "no cure promises anywhere" (all entities, all markets).
 * The full claims-jurisdiction matrix (DMR/ASCI, MHRA, FDA/FTC, EU) needs
 * per-market phrase lists — v1 gates the universal floor only. See QUESTIONS.md.
 */
export const CURE_CLAIM_PATTERNS = [
  { re: /\bcures?\b/giu, note: "cure claim" },
  { re: /\bguarantee[ds]?\s+(?:results?|recovery|relief|healing)\b/giu, note: "guaranteed-outcome claim" },
  { re: /\bmiracle\b/giu, note: "miracle claim" },
  { re: /\b100%\s+(?:safe|effective|natural\s+cure|success)\b/giu, note: "absolute claim" },
  { re: /\bpermanent(?:ly)?\s+(?:cure[ds]?|relief|remission)\b/giu, note: "permanence claim" },
];

/**
 * Locked-count patterns — the canonical centres/countries ruling of 17 Jul 2026
 * (PROJECT_CONTEXT §12: the KAC website's published figures — 14 centres in
 * 5 countries — are canonical for ALL properties; retro-audit process fix #4).
 *
 * TWO families, one gate:
 *   · STALE counts ("nine countries", "18 centres", "25 Centers") — the drift
 *     that actually shipped 12× across kairali.com + arogyakendra.com;
 *   · the CURRENT canonical values typed as literals ("five countries",
 *     "14 centres") — banned for the same reason "115+ years" was banned
 *     (D 16 Jul: never hardcode a rolling number). Copy renders the computed
 *     constants from @kairali/facts; a typed count rots the day the network
 *     changes.
 *
 * Violations are ERRORS even in code files (like the locked facts below, and
 * unlike the word lists): a count literal in TSX is exactly the bug this rule
 * exists to kill. Escape hatch: `compliance-allow: locked-counts` on the line
 * (reported as info, never silent).
 */
// Up to two qualifier words may sit between the number and the noun
// ("18 Ayurvedic treatment centres" is the same stale claim as "18 centres").
const CENTRE_QUALIFIERS = /(?:(?:treatment|ayurvedic|wellness|health)\s+){0,2}/.source;

export const LOCKED_COUNT_STALE_PATTERNS = [
  { re: /\b(?:nine|9)\s+countries\b/giu, note: 'stale network count "nine countries"' },
  { re: new RegExp(`\\b(?:eighteen|18)\\s+${CENTRE_QUALIFIERS}cent(?:re|er)s\\b`, "giu"), note: 'stale network count "18 centres"' },
  { re: new RegExp(`\\b(?:twenty[-\\s]?five|25)\\s+${CENTRE_QUALIFIERS}cent(?:re|er)s\\b`, "giu"), note: 'stale network count "25 Centers"' },
];

/**
 * These are TRUE today — and banned as literals anyway, in SOURCE only.
 * Rendered output legitimately shows "five countries" (that is the constants
 * doing their job); source that TYPES it is the drift bug. The factory spec's
 * render-level check therefore uses only the STALE list above.
 */
export const LOCKED_COUNT_HARDCODE_PATTERNS = [
  // Lookbehind: "twenty-five countries" is not the canonical count typed out.
  { re: /(?<!twenty[-\s])\b(?:five|5)\s+countries\b/giu, note: "canonical country count typed as a literal" },
  { re: new RegExp(`\\b(?:fourteen|14)\\s+${CENTRE_QUALIFIERS}cent(?:re|er)s\\b`, "giu"), note: "canonical centre count typed as a literal" },
];

export const LOCKED_COUNT_PATTERNS = [
  ...LOCKED_COUNT_STALE_PATTERNS,
  ...LOCKED_COUNT_HARDCODE_PATTERNS,
];

/** Locked facts (PROJECT_CONTEXT §3 / CLAUDE.md) — wrong values are bugs. */
export const LOCKED_FACTS = {
  contactEmail: "info@kairali.com",
  /**
   * Departmental mailboxes the owner has ruled permitted alongside the public
   * contact address. The rule still fires on every OTHER @kairali.com local
   * part, so a typo like infoo@ is still caught. Owner ruling D-20260915-06
   * (2026-09-15): career@ is correct on careers/apply routes.
   */
  permittedDepartmentEmails: ["career@kairali.com"],
  ktahvWhatsApp: "+91 92898 38797",
  /** Known-bad number — remove on sight, any formatting. */
  knownBadNumberDigits: "9289838777",
};

/** Entities the clinical lock applies to. */
export const CLINICAL_LOCK_ENTITIES = new Set(["ktahv"]);

/** File extensions scanned as content (violations = errors). */
export const CONTENT_EXTENSIONS = new Set([".md", ".mdx", ".html", ".txt"]);

/** File extensions scanned as code (violations = warnings — copy usually lives in MDX). */
export const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);

/** Directories never scanned. */
export const IGNORED_DIRS = new Set([
  "node_modules",
  ".next",
  ".turbo",
  "dist",
  "out",
  ".git",
  ".vercel",
]);
