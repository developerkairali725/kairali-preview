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
  de: ["kur", "urlaub", "luxus", "luxuriös", "gast", "gäste", "auszeit", "kurzurlaub", "resort", "spa"],
  fr: ["cure", "cures", "vacances", "luxe", "luxueux", "luxueuse", "séjour", "séjours", "invité", "invités", "hôte", "hôtes", "escapade", "escapades", "évasion", "spa", "resort"],
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
