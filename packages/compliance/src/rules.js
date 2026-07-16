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

/** Locked facts (PROJECT_CONTEXT §3 / CLAUDE.md) — wrong values are bugs. */
export const LOCKED_FACTS = {
  contactEmail: "info@kairali.com",
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
