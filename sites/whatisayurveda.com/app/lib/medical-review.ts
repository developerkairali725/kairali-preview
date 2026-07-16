// SINGLE SOURCE OF TRUTH for this site's medical review.
//
// TWO Abilash rulings are encoded here:
//
// 1. (15 Jul) "We have many doctors other than Dr. Deepu — he might be head now
//    but not in future." Reviewers are a ROSTER, never a literal in a component.
//    Changing the head, or adding physicians to a review panel, is a data edit
//    here — it never touches page code and never invalidates the repository.
//
// 2. (15 Jul) TIERED HONESTY. A page may claim physician review ONLY if a
//    physician genuinely reviewed it. The previous code hardcoded
//    `REVIEWED = "2026-07-14"` and stamped EVERY page — byline AND MedicalWebPage
//    `lastReviewed` JSON-LD — under Dr. Deepu John's named BAMS credential, for
//    reviews that never happened. On a YMYL health site that is exactly the hype
//    this site exists to oppose, and it put a real physician's professional name
//    behind work he never read.
//
//    THE LAW NOW: `reviewedOn` is per-page data, set ONLY on genuine sign-off.
//    No `reviewedOn` => no reviewer byline, no `lastReviewed`, no Physician node.
//    An honest absence beats a false claim. E-E-A-T is earned, not asserted.
//
// The promise "every health page is physician-reviewed" is arithmetically
// undeliverable across ~3,400 pages by one doctor — so genuinely reviewed pages
// are MARKED, and the rest state plainly what they are. Coverage grows as
// physicians review; the badge stays meaningful because it is never free.

export type Reviewer = {
  /** stable key a page's `reviewedBy` refers to */
  key: string;
  name: string;
  credentials: string;
  title: string;
  /** stable #anchor on /about — NOT the person's name, so links survive changes */
  anchor: string;
};

/**
 * THE REVIEW PANEL — every entry VERIFIED against two independent live sources
 * (the KTAHV site roster + whyayurveda.org profile/author schema), mined
 * 15 Jul 2026. Evidence + verbatim credential lines:
 * docs/group-inputs/kairali-physician-roster.md
 *
 * NEVER add a physician, degree, or title that is not published and verified.
 * All five verified physicians hold BAMS ONLY — no MD/MS/PhD is claimed anywhere
 * on any Kairali source, so none may be written here. Inventing a credential on
 * a YMYL page is the worst thing this file could do.
 */
export const REVIEWERS: Record<string, Reviewer> = {
  "deepu-john": {
    key: "deepu-john",
    name: "Dr. Deepu John",
    credentials: "BAMS",
    // CORRECTED 15 Jul: every live source says "& Head of Department";
    // our previous string truncated it to "Chief Physician".
    title: "Chief Physician & Head of Department, Kairali — The Ayurvedic Healing Village",
    anchor: "medical-reviewer",
  },
  "akhila-oommen": {
    key: "akhila-oommen",
    name: "Dr. Akhila Oommen",
    credentials: "BAMS",
    title: "Ayurvedic Physician, Kairali — The Ayurvedic Healing Village",
    anchor: "medical-reviewer",
  },
  "rahul-r": {
    key: "rahul-r",
    name: "Dr. Rahul R",
    credentials: "BAMS",
    title: "Ayurvedic Physician, Kairali — The Ayurvedic Healing Village",
    anchor: "medical-reviewer",
  },
  // Spelling RULED by Abilash, 16 Jul 2026. The live sites publish BOTH
  // "Ashika" and "Ashikha" — contradicting each other inside a single Yoast
  // schema block — so this could not be resolved from published sources. The
  // live-site instances of "Ashika" are logged for correction (QUESTIONS.md).
  "ashikha-raj": {
    key: "ashikha-raj",
    name: "Dr. Ashikha Raj",
    credentials: "BAMS",
    title: "Ayurvedic Physician & Resident Medical Officer, Kairali — The Ayurvedic Healing Village",
    anchor: "medical-reviewer",
  },
  // Surname supplied by Abilash, 16 Jul 2026 — it is published NOWHERE on the
  // live sites (no profile, no photo, no author account), so it could not be
  // verified from source. Flagged for publication: an uncredited physician
  // carries no E-E-A-T weight, however real she is.
  "anagha-santhosh": {
    key: "anagha-santhosh",
    name: "Dr. Anagha Santhosh",
    credentials: "BAMS",
    title: "Ayurvedic Physician, Kairali — The Ayurvedic Healing Village",
    anchor: "medical-reviewer",
  },
};

/**
 * NOT YET ON THE PANEL — verified as physicians, but NOT usable for attribution
 * until a human resolves the gap. Adding them now would put a guessed name on a
 * medical page under a real person's registration.
 *
 *  · Dr. Ashika / Ashikha Raj (BAMS, Ayurvedic Physician & RMO, 8+ yrs) —
 *    BOTH spellings are live, contradicting each other inside a single Yoast
 *    schema block. We do not guess a real doctor's name. → Abilash/HR.
 *  · Dr. Anagha (BAMS, Ayurvedic Physician, 2+ yrs) — SURNAME IS NOT PUBLISHED
 *    anywhere, and she has no profile or author account. Cannot be credited.
 *
 * OPEN YMYL GAP (all five): no medical-council registration numbers are
 * published for any physician. That is the first thing a Google quality rater —
 * or a regulator — looks for on health content. Collect from HR before launch.
 * See docs/group-inputs/kairali-physician-roster.md §6.
 */

/** Head of the review panel TODAY. Update this one line when it changes. */
export const HEAD_REVIEWER_KEY = "deepu-john";

export const MEDICAL_REVIEW = {
  current: REVIEWERS[HEAD_REVIEWER_KEY],
  /** Institutional framing — the process belongs to the group, not one person. */
  institution: "the registered physicians of the Kairali Ayurvedic Group",
  labels: {
    author: "the Kairali Editorial Team",
    /** Shown ONLY when a real review exists. */
    reviewed: (r: Reviewer) => `Medically reviewed by ${r.name} (${r.credentials})`,
    /** Shown when it does not. Honest, not apologetic — stating limits is the brand. */
    notReviewed: "Not yet individually reviewed by one of our physicians",
  },
} as const;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export type ResolvedReview = { reviewer: Reviewer; date: string };

/**
 * Resolve a page's review claim. Returns null when the page has NOT been
 * genuinely reviewed — callers must then render no reviewer byline and emit no
 * `lastReviewed` / Physician JSON-LD.
 *
 * THROWS on malformed review data rather than silently degrading: a broken
 * review claim on a medical page is a build-stopping error, not a warning
 * (CLAUDE.md rule g — gates fail builds; they are never advisory).
 *
 * @param reviewedOn ISO date (YYYY-MM-DD) of a REAL physician sign-off
 * @param reviewedBy roster key; defaults to the panel head
 * @param where      page identity, for a useful build error
 */
export function resolveReview(
  reviewedOn?: string,
  reviewedBy?: string,
  where = "a page",
): ResolvedReview | null {
  if (!reviewedOn) {
    if (reviewedBy) {
      throw new Error(
        `medical-review: ${where} names reviewer "${reviewedBy}" but has no reviewedOn date — a reviewer without a real review date is a false claim`,
      );
    }
    return null; // honest: no review happened
  }
  if (!ISO_DATE.test(reviewedOn)) {
    throw new Error(`medical-review: ${where} has reviewedOn "${reviewedOn}" — must be YYYY-MM-DD`);
  }
  const key = reviewedBy ?? HEAD_REVIEWER_KEY;
  const reviewer = REVIEWERS[key];
  if (!reviewer) {
    throw new Error(
      `medical-review: ${where} names reviewer "${key}" who is not on the panel (known: ${Object.keys(REVIEWERS).join(", ")})`,
    );
  }
  return { reviewer, date: reviewedOn };
}
