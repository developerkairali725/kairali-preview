// KTAHV language lock (GST SCN) for the VERIFY-lane checks — one list, one allowlist, printed in every report.
// Authority: CLAUDE.md "KTAHV LANGUAGE LOCK" (spa, resort, holiday, luxury, cure, journey, guests — any casing, all
// locales; DE/FR equivalents e.g. Kur/Urlaub/Luxus, cure/vacances/luxe). The DE/FR extras are the ones the WP-era
// spec (tests/ktahv-critical-flows.spec.ts) already carried; inflections follow tools/language-lock-tiers.mjs.
// The English list applies on EVERY locale (loanwords such as "Spa"/"Resort" are common in German and French copy).
//
// ALLOWLIST: a match is excluded ONLY when it sits inside one of the phrases below (proper names, award titles,
// organisation/legal-entity names, and negating disclaimers that the GST-lock review already accepted in the
// campaign check). Everything else is pass-blocking. The list is exported so each report prints it verbatim —
// extending it is an owner/Dr. Deepu John decision, never a way to turn a check green.
export const LOCK_WORDS = {
  en: ["spa", "spas", "resort", "resorts", "holiday", "holidays", "luxury", "luxurious", "cure", "cures", "cured", "curing", "journey", "journeys", "guest", "guests"],
  de: ["kur", "kuren", "urlaub", "urlaubs", "luxus", "luxuriös", "luxuriöse", "luxuriösen", "wellnesshotel"],
  fr: ["cure", "cures", "vacances", "luxe", "luxueux", "luxueuse", "séjour de luxe"],
};
// German compounds ending in "-kur" (Entgiftungskur, Ayurvedakur) carry the banned sense and evade a word boundary.
export const DE_KUR_COMPOUND = /(?<![\p{L}\p{N}])[\p{L}]{3,}kur(?:en)?(?![\p{L}\p{N}])/giu;
export const DE_KUR_COMPOUND_FALSE_POSITIVES = []; // none known; add only with a recorded ruling

export const ALLOWLIST = [
  { kind: "award-title", re: /World Luxury (Spa )?Awards?/gi },
  { kind: "award-title", re: /World Luxury Spa (and|&) Restaurant Awards?/gi },
  { kind: "award-title", re: /Luxury Lifestyle Awards?/gi },
  { kind: "award-title", re: /Certified Spa Awards?/gi },
  { kind: "award-title", re: /(Asia |Global |World )?Spa Awards?/gi },
  { kind: "award-title", re: /Luxury Spa Destination/gi },
  { kind: "award-title", re: /Luxury Travel Guide/gi },
  { kind: "award-title", re: /Top Ten Wellness Destination/gi },
  { kind: "award-title", re: /Travell?ers?['’]? Choice/gi },
  { kind: "award-title", re: /Best Luxury Ayurveda Spa/gi },
  { kind: "award-title", re: /Luxury Ayurveda Spa in (Asia Continent|South-West Asia and India)/gi },
  { kind: "award-title", re: /Luxury Ayurveda Retreat \(Global\)/gi },
  { kind: "award-title", re: /Best Luxury (Wellness Healing|Yoga & Wellness) Retreat/gi },
  { kind: "award-title", re: /Wellness Resort of the Year/gi },
  { kind: "award-title", re: /Best Destination Spa/gi },
  { kind: "award-title", re: /Spa Asia Crystal Award/gi },
  { kind: "award-title", re: /India['’]s Leading Resort/gi },
  { kind: "award-title", re: /Preferred Partner Ayurveda Resort/gi },
  { kind: "organisation", re: /Spa (and|&) Wellness (Coalition|Collection)/gi },
  { kind: "proper-name", re: /Kairali Health Resorts/gi },
  { kind: "organisation", re: /Global Spa( & Wellness)?/gi },
  { kind: "legal-entity", re: /Kairali Ayurvedic Health Resorts?( Pvt\.? Ltd\.?)?/gi },
  { kind: "proper-name", re: /Ayurvedic Indian Journey/gi },
  { kind: "negating-disclaimer", re: /No disease cure claims are made/gi },
  { kind: "negating-disclaimer", re: /no specific improvement or cure is guaranteed/gi },
  { kind: "negating-disclaimer", re: /without promising a permanent cure/gi },
];
// Quotations (guest testimonials, press quotes): a match inside a “curly” quotation, or inside a "straight" quotation on
// a single line, up to QUOTE_MAX characters, is excluded as kind "quote" and listed in the report like every other
// exclusion. Pass { quotes: false } to scanLockedWords to judge quoted text too.
export const QUOTE_MAX = 900;
const QUOTE_RES = [new RegExp(`“[^“”]{1,${QUOTE_MAX}}”`, "g"), new RegExp(`"[^"\\n]{1,${QUOTE_MAX}}"`, "g")];
export const allowlistForReport = () => [...ALLOWLIST.map((a) => ({ kind: a.kind, pattern: a.re.source, flags: a.re.flags })), ...QUOTE_RES.map((r) => ({ kind: "quote", pattern: r.source, flags: r.flags }))];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const wordRe = (w) => new RegExp(`(?<![\\p{L}\\p{N}])${esc(w).replace(/ /g, "\\s+")}(?![\\p{L}\\p{N}])`, "giu");

/** Words that apply on a locale: English everywhere, plus the locale's own list. */
export const wordsFor = (locale) => [...new Set([...LOCK_WORDS.en, ...(LOCK_WORDS[locale] || [])])];

/**
 * Scan visible text. Returns { hits: [{word, context, at}], allowlisted: [{word, kind, phrase, context}] }.
 * Allowlisted phrases are masked (same length) before the word scan so offsets stay true.
 */
export function scanLockedWords(text, locale, { quotes = true } = {}) {
  const src = String(text || "");
  let masked = src;
  const allowlisted = [];
  const rules = [...ALLOWLIST, ...(quotes ? QUOTE_RES.map((re) => ({ kind: "quote", re })) : [])];
  for (const a of rules) {
    masked = masked.replace(new RegExp(a.re.source, a.re.flags), (m, ...rest) => {
      const at = rest.find((x) => typeof x === "number");
      for (const w of wordsFor(locale)) if (wordRe(w).test(m)) allowlisted.push({ word: w, kind: a.kind, phrase: m.length > 160 ? m.slice(0, 157) + "…" : m, context: ctx(src, at, Math.min(m.length, 120)) });
      return " ".repeat(m.length);
    });
  }
  const hits = [];
  for (const w of wordsFor(locale)) {
    const re = wordRe(w); let m;
    while ((m = re.exec(masked))) hits.push({ word: w, match: src.slice(m.index, m.index + m[0].length), at: m.index, context: ctx(src, m.index, m[0].length) });
  }
  if (locale === "de") {
    const re = new RegExp(DE_KUR_COMPOUND.source, DE_KUR_COMPOUND.flags); let m;
    while ((m = re.exec(masked))) if (!DE_KUR_COMPOUND_FALSE_POSITIVES.includes(m[0].toLowerCase())) hits.push({ word: "-kur compound", match: m[0], at: m.index, context: ctx(src, m.index, m[0].length) });
  }
  // "séjour de luxe" also matches "luxe": keep the longer phrase only
  const dedup = hits.filter((h) => !hits.some((o) => o !== h && o.at <= h.at && o.at + o.match.length >= h.at + h.match.length && o.match.length > h.match.length));
  return { hits: dedup.sort((a, b) => a.at - b.at), allowlisted };
}
const ctx = (s, at, len) => s.slice(Math.max(0, at - 60), at + len + 60).replace(/\s+/g, " ").trim();
