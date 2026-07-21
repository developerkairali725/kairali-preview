/**
 * @kairali/facts — locked-fact constants for the Kairali estate.
 *
 * THE RULE THIS PACKAGE ENFORCES (Abilash, 16-17 Jul 2026):
 *   A value that changes with the real world is NEVER typed into copy.
 *   It is COMPUTED here from the verified source data, and sites render the
 *   exported constants. "Nine countries" was hardcoded 12 times across two
 *   shipped sites while the verified network was 14 centres in 5 countries —
 *   this package is the structural fix (retro-audit 17 Jul, process fix #4).
 *
 * SOURCE OF TRUTH: the roster below is transcribed VERBATIM from the live
 * kairalicenters.com /locations/ page (mined 2026-07-14, see
 * docs/group-inputs/kairalicenters-org-inventory.md). Nothing is invented
 * (CLAUDE.md rule 6). Canonical ruling: the KAC website's published figures
 * are canonical for all Kairali properties — confirmed by owner's brother,
 * 17 Jul 2026 (PROJECT_CONTEXT §12). sites/kairalicenters.com re-exports this
 * roster, so the centres site and every count claim share ONE dataset.
 *
 * Partner-branded centres are marked `partner: true` pending the
 * owned-vs-franchise ruling (QUESTIONS Q-KC-PARTNERS).
 */

export const CANONICAL_COUNT_RULING =
  "canonical: KAC site (kairalicenters.com/locations) — ruled 17 Jul 2026, owner's brother confirm; see PROJECT_CONTEXT §12";

/** @type {import("./index.d.ts").Centre[]} */
export const CENTRES = [
  { slug: "new-delhi-mehrauli", name: "Kairali Ayurvedic Centre", city: "New Delhi", region: "Mehrauli", country: "India",
    address: "D-130, Ambedkar Colony, Mehrauli, New Delhi, India – 110 030", phones: ["+91-8826513700"], email: "delhi@kairalicentres.com", hours: "8 AM – 6 PM" },
  { slug: "new-delhi-sirifort", name: "Kairali Ayurvedic Centre", city: "New Delhi", region: "Siri Fort", country: "India",
    address: "Indoor Badminton Court, Siri Fort Sports Complex, Siri Fort, New Delhi – 110049", phones: ["+91-9289843222", "+91-9289853222"], email: "sirifort@kairalicentres.com", hours: "7 AM – 9 PM" },
  { slug: "gurgaon-sector-46", name: "Kairali Ayurvedic Centre", city: "Gurgaon", region: "Sector 46", country: "India",
    address: "3059-P, Sector 46, Gurgaon, Haryana – 122506", phones: ["+91-8800861733", "+91-8800861734"], email: "gug@kairalicentres.com", hours: "9 AM – 6 PM" },
  { slug: "patna-boring-road", name: "Kairali Ayurvedic Centre — Surya Healthcare", city: "Patna", region: "Boring Road", country: "India",
    address: "Ground Floor, Surya Shiv Ambika Apartment, Boring Patliputra Road, Patna, Bihar – 800013", phones: ["+91-612-2261188", "+91-7759827777"], email: "patna@kairalicentres.com", hours: "8 AM – 6 PM", partner: true },
  { slug: "vadodara-race-course-road", name: "Kairali Ayurvedic Centre", city: "Vadodara", region: "Race Course Road", country: "India",
    address: "319/320, Trivia, Nr. Natubhai Circle, Race Course Road, Vadodara, Gujarat – 390023", phones: ["+91-265-6995151", "+91-9714707784"], email: "retrofit@kairalicentres.com", hours: "8 AM – 6 PM", partner: true },
  { slug: "faridabad-sector-15", name: "Kairali Ayurvedic Centre", city: "Faridabad", region: "Sector 15", country: "India",
    address: "House No. 409, Sector 15, Near Gate No. 3, Faridabad, Haryana – 121007", phones: ["+91-9650680900", "+91-129-4873460"], email: "faridabad@kairalicentres.com", hours: "8 AM – 6 PM" },
  { slug: "guwahati", name: "Kairali Ayurvedic Centre", city: "Guwahati", region: "Assam", country: "India",
    address: "B N Saikia Path, Basistha Charali, Beltola Tiniali, Guwahati, Assam – 781028", phones: ["+91-70990-14368"], email: "gua@kairalicentres.com", hours: "9 AM – 6 PM" },
  { slug: "raipur", name: "Kairali Ayurvedic Centre", city: "Raipur", region: "Chhattisgarh", country: "India",
    address: "Yoga Tower, Great Eastern Rd, opp. Anupam Garden, Samta Colony, Raipur, Chhattisgarh – 492001", phones: ["+91-9200655555"], email: "info@kairalicentres.com", note: "Opening hours to be confirmed." },
  { slug: "yokohama", name: "Kairali Ayurvedic Health Spa", city: "Yokohama", region: "Kanagawa", country: "Japan",
    address: "1802-27 Yamashita-cho, Naka-ku, Yokohama-shi, Kanagawa – 231-023, Japan", phones: ["+81-45-640-0383"], email: "wakaba@ayus.co.jp", partner: true },
  { slug: "tokyo-seijo", name: "Kairali Ayurvedic Health Centre", city: "Tokyo", region: "Seijo", country: "Japan",
    address: "F2 Central Wellness Town Seijo, 3-20-2 Chitosedai, Setagaya-ku, Tokyo, Japan", phones: ["+81-3-3484-3807"], email: "kairalispa@ayus.co.jp", partner: true },
  { slug: "tokyo-minamiaoyama", name: "Kairali Ayurvedic Health Centre", city: "Tokyo", region: "Minami-Aoyama", country: "Japan",
    address: "B1 Collezione, 6-2-3 Minami-Aoyama, Minato-ku, Tokyo, Japan", phones: ["+81-3-5468-1788"], email: "kairalispa@ayus.co.jp", partner: true },
  { slug: "phoenix-mauritius", name: "Kairali Ayurvedic Health Spa", city: "Phoenix", region: "St. Phoenix", country: "Mauritius",
    address: "8, Remy Ollier St., Phoenix, Mauritius", phones: ["+230-698-4440"], email: "info@kairali.mu", partner: true },
  { slug: "prague-vinohrady", name: "Kairali Ayurvedic Spa — Resort Svatá Kateřina", city: "Prague", region: "Vinohrady", country: "Czech Republic",
    address: "Riegrovy sady 38, 120 00 Prague – Vinohrady, Czech Republic", phones: ["+420-565-456-801"], partner: true,
    // email WITHHELD until Q-KC-DATA is ruled (HARD GATE 6: leave empty and
    // flag). The live site prints info@katrinaresort.com; the resort's own
    // domain is katerinaresort.cz — the two-spelling discrepancy is the open
    // question, and no third spelling may ship. Consumers render email
    // conditionally and @kairali/schema strips undefined keys, so the Prague
    // page keeps the group contact only. NOTE renders on the public centre
    // page — keep it customer-facing; the tracker ID stays in this comment.
    note: "Centre email being confirmed — please reach us via the group contact." },
  { slug: "kuwait", name: "Kairali Ayurvedic Centre", city: "Kuwait City", region: "Sharq", country: "Kuwait",
    address: "Khalid Bin Alwaleed Street, Injazat Tower, Floor 23, Sharq, Kuwait", phones: ["+965-97706554"], email: "kuwait@kairalicentres.com", partner: true },
];

export const INDIA_CENTRES = CENTRES.filter((c) => c.country === "India");
export const INTERNATIONAL_CENTRES = CENTRES.filter((c) => c.country !== "India");
export const COUNTRIES = [...new Set(CENTRES.map((c) => c.country))];

// COMPUTED, never typed. If the roster changes these follow; the facts test
// pins today's ruling (14/5) so a roster change forces a conscious re-ruling.
export const CENTRES_COUNT = CENTRES.length;
export const COUNTRIES_COUNT = COUNTRIES.length;

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

/**
 * Word form for small counts, digits beyond twelve (house style). Zero stays
 * "0" — a zero-count claim should look wrong in copy review, because it is.
 * @param {number} n
 * @returns {string}
 */
export function numberWord(n) {
  return n >= 1 && n <= 12 ? WORDS[n] : String(n);
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** "five" */
export const COUNTRIES_WORD = numberWord(COUNTRIES_COUNT);
/** "five countries" — the prose form */
export const COUNTRIES_PHRASE = `${COUNTRIES_WORD} countries`;
/** "Five Countries" — the stat-tile / title form */
export const COUNTRIES_PHRASE_TITLE = `${capitalize(COUNTRIES_WORD)} Countries`;
/** "14 treatment centres across five countries" — the standard network line */
export const CENTRES_NETWORK_LINE = `${CENTRES_COUNT} treatment centres across ${COUNTRIES_PHRASE}`;

/**
 * @param {string} slug
 * @returns {import("./index.d.ts").Centre | undefined}
 */
export function centreBySlug(slug) {
  return CENTRES.find((c) => c.slug === slug);
}
