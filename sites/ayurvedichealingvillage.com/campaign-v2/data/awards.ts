// campaign-v2/data/awards.ts
// The ONLY place award facts live. Every section reads from here; never type an award name, year or logo
// path into a section or a campaign config. How to refresh: campaign-v2/data/README.md.
//
// House rule: names with "Luxury"/"Spa" are proper nouns. They appear only as logo alt text or a captioned
// award name, never in running copy. lp:check strips these exact names before its register check.

export type AwardLogo = { src: string; width: number; height: number };
export type Award = {
  id: string;
  /** Official award name, without the year. */
  name: string;
  /** Awarding body / publication. */
  body: string;
  year: number;
  /** Category titles won, verbatim from the source. Empty when the source names none. */
  titles: string[];
  /** A file in this app's public/ folder. width/height are the file's true pixel size (checked with sips). */
  logo: AwardLogo;
  /** Exact award name + year. */
  alt: string;
  /** Live page or whyayurveda.org article the facts were copied from. */
  sourceUrl: string;
  /** ISO date the facts were last checked against sourceUrl. */
  verifiedOn: string;
  featured: boolean;
  /** Display order among featured awards (1 = first). Most recent first. */
  order: number;
};

export const AWARDS: readonly Award[] = [
  {
    id: "ta-travelers-choice-2026",
    name: "Tripadvisor Travelers' Choice",
    body: "Tripadvisor",
    year: 2026,
    titles: [],
    logo: { src: "/ahv/assets/img/logo-ta.webp", width: 200, height: 254 },
    alt: "Tripadvisor Travelers' Choice 2026",
    sourceUrl: "https://whyayurveda.org/tripadvisor-travelers-choice-award-2026-kairali/",
    verifiedOn: "2026-10-07",
    featured: true,
    order: 1,
  },
  {
    id: "haute-grandeur-2026",
    name: "Haute Grandeur Global Excellence Awards",
    body: "Haute Grandeur",
    year: 2026,
    titles: ["Best Wellness Retreat India", "Best Ayurveda Retreat India"],
    // Tightly cropped copy of the live site's award-haute-grandeur-2026-web.webp (800×450, wide transparent margins).
    logo: { src: "/lp-v2/img/award-haute-grandeur-2026-crop.webp", width: 667, height: 375 },
    alt: "Haute Grandeur Global Excellence Awards 2026",
    sourceUrl: "https://whyayurveda.org/best-ayurveda-retreat-india-kairali-2026-award/",
    verifiedOn: "2026-10-07",
    featured: true,
    order: 2,
  },
  {
    id: "patwa-2026",
    name: "PATWA International Travel Award",
    body: "PATWA",
    year: 2026,
    titles: ["Best Retreat Wellness (India), ITB Berlin"],
    logo: { src: "/lp-v2/img/logo-patwa.png", width: 400, height: 400 },
    alt: "PATWA International Travel Award 2026",
    sourceUrl: "https://whyayurveda.org/kairali-the-ayurvedic-healing-village-wins-patwa-international-travel-award-2026-at-itb-berlin/",
    verifiedOn: "2026-10-07",
    featured: true,
    order: 3,
  },
  {
    id: "natgeo-traveller-2026",
    // "Traveller" is the publication's own (British) title: a proper noun, exempt from the spelling rule.
    name: "National Geographic Traveller: 2026 Spa & Wellness Collection",
    body: "National Geographic Traveller",
    year: 2026,
    titles: [],
    logo: { src: "/ahv/assets/img/award-natgeo-traveller-spa-wellness-2026-kit.webp", width: 1200, height: 1071 },
    alt: "National Geographic Traveller: 2026 Spa & Wellness Collection",
    sourceUrl: "https://whyayurveda.org/kairali-the-ayurvedic-healing-village-featured-in-national-geographic-traveller-a-global-recognition-of-authentic-healing/",
    verifiedOn: "2026-10-07",
    featured: true,
    order: 4,
  },
  {
    id: "world-luxury-2025",
    name: "World Luxury Hotel & Spa Awards",
    body: "World Luxury Hotel Awards / World Luxury Spa Awards",
    year: 2025,
    // The source reports four titles; only these two are named there. Do not add the other two by guesswork.
    titles: ["Best Luxury Ayurveda Retreat (Global Winner)", "Best Luxury Yoga Retreat"],
    // Logo choice (Task 18): the clean World Luxury Hotel Awards mark. The live site's
    // ann-11-world-luxury-hotel-awards-2025.webp is an event photo, not a logo.
    logo: { src: "/lp-v2/img/logo-wlha-black.png", width: 1015, height: 941 },
    alt: "World Luxury Hotel & Spa Awards 2025",
    sourceUrl: "https://whyayurveda.org/from-kerala-to-the-world-how-kairali-clinched-4-luxury-awards-in-one-night/",
    verifiedOn: "2026-10-07",
    featured: true,
    order: 5,
  },
  // Archive: true and sourced, but not shown on the landing pages.
  {
    id: "ta-travelers-choice-2025",
    name: "Tripadvisor Travelers' Choice",
    body: "Tripadvisor",
    year: 2025,
    titles: [],
    logo: { src: "/ahv/assets/img/Travelers-Choice-Award-2025.webp", width: 300, height: 300 },
    alt: "Tripadvisor Travelers' Choice 2025",
    sourceUrl: "https://ayurvedichealingvillage.com/",
    verifiedOn: "2026-10-07",
    featured: false,
    order: 0,
  },
  {
    id: "apswc-2024",
    name: "APSWC Wellness Resort of the Year",
    body: "APSWC",
    year: 2024,
    titles: [],
    logo: { src: "/ahv/assets/img/ann-19-apswc-award-2024.webp", width: 1200, height: 675 },
    alt: "APSWC Wellness Resort of the Year 2024",
    sourceUrl: "https://ayurvedichealingvillage.com/",
    verifiedOn: "2026-10-07",
    featured: false,
    order: 0,
  },
  {
    id: "lotus-2026",
    name: "Lotus Travel Quality Partner",
    body: "Lotus Travel",
    year: 2026,
    titles: [],
    logo: { src: "/ahv/assets/img/ann-10-lotus-travel-quality-partner-2026.webp", width: 200, height: 113 },
    alt: "Lotus Travel Quality Partner 2026",
    sourceUrl: "https://ayurvedichealingvillage.com/",
    verifiedOn: "2026-10-07",
    featured: false,
    order: 0,
  },
  // Excluded on purpose: "Best Marketing Director India" (a personal award, not the property's) and the
  // APSWC seasonal monsoon card (an offer, not an award).
];

/** Featured awards in display order. */
export const FEATURED_AWARDS: readonly Award[] = AWARDS.filter((a) => a.featured).sort((a, b) => a.order - b.order);

/** Logo-row limits. Awards beyond the mobile limit are not rendered on phones at all (no hidden images). */
export const AWARD_ROW_MAX = { desktop: 5, mobile: 4 } as const;

export type AwardSlot = { award: Award; mobile: boolean };
/** The logo row: up to `desktop` featured awards; the first `mobile` of them also show on phones. */
export function awardRow(featured: readonly Award[] = FEATURED_AWARDS, max = AWARD_ROW_MAX): AwardSlot[] {
  return featured.slice(0, max.desktop).map((award, i) => ({ award, mobile: i < max.mobile }));
}

/** The current Tripadvisor Travelers' Choice award (most recent year), for one-line trust mentions. */
export const LATEST_TRAVELERS_CHOICE: Award = AWARDS.filter((a) => a.id.startsWith("ta-travelers-choice-"))
  .sort((a, b) => b.year - a.year)[0];

/** Every award name and title, for the lint exemption (proper nouns). */
export const AWARD_PROPER_NOUNS: readonly string[] = AWARDS.flatMap((a) => [a.name, a.alt, ...a.titles]);
