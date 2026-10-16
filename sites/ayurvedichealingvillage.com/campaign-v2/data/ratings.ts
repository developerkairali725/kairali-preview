// campaign-v2/data/ratings.ts
// The ONLY place rating numbers live. Never type a rating or review count anywhere else.
// How to refresh: campaign-v2/data/README.md. Google has no static number: see data/google-rating.ts.

/** Copied from the live homepage proof block and its footnote ("as of August 2026"). */
export const TRIPADVISOR = {
  rating: 4.6,
  reviewCount: 450,
  rankText: "#2 of 27 hotels in Palakkad",
  // Tripadvisor's own program name is "Travelers' Choice"; the live homepage misspells it "Travellers'".
  badgeText: "Travelers' Choice & Hall of Fame · every year, 2011–2026",
  hallOfFameYear: 2019,
  // AHV-LATER-038.01 (owner decision 33, 15 Oct 2026: "Show awards history now (Tripadvisor 4.6/450, 29 Aug 2026)"): the
  // dated listing capture behind these figures, Kairali-Image-Library/web-exports/exchange/from-codex/NOTES.md:144-160
  // (location d530306, 29 August 2026: rating 4.6, reviewCount 450, #2 of 27 hotels in Palakkad). Shown with that date.
  asOf: "2026-08-29",
  sourceUrl: "https://ayurvedichealingvillage.com/",
  listingUrl: "https://www.tripadvisor.in/Hotel_Review-g26530598-d530306-Reviews-Kairali_The_Ayurvedic_Healing_Village-Polpully_Palakkad_Palakkad_District_Kerala.html",
  verifiedOn: "2026-10-07",
} as const;

/** NABH certificate validity. Source: the live accreditations page (certificate AH-2024-0250, 2024–2027).
 *  The certificate number itself comes from site.accreditation via sections/facts.ts. */
export const NABH_VALIDITY = "2024–2027";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2026-08" -> "August 2026". */
export function monthLabel(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

/** "2026-08-29" -> "29 August 2026" ("YYYY-MM" keeps the month label). */
export function dateLabel(date: string): string {
  const [, , d] = date.split("-").map(Number);
  return d ? `${d} ${monthLabel(date)}` : monthLabel(date);
}

/** First day of an "YYYY-MM" or "YYYY-MM-DD" date, in UTC. */
export function startOf(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d || 1));
}
