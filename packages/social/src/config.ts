/**
 * THE single source of truth for the Kairali Ayurvedic Group's social
 * profiles — D-20260718-04 (footer social-links parity, fleet-wide).
 *
 * CANONICAL SET per the marketing true-up (D-20260720-39 UNFREEZE): Anupam
 * Singh Molpha's reply of 2026-07-20 17:26 IST (mkt@ktahv.com, cc Astha
 * ho.mkt@ — thread 19f7528b5b9fc4ab) delivered the verified per-vertical
 * list the interim set (D-SOCIALS-INTERIM, 18 Jul) was waiting for. D-04's
 * rule is PARITY — every fleet footer carries the GROUP (KAG) set — so this
 * file ships the KAG profiles. The per-vertical profiles (KTAHV / KAPPL /
 * Villa Raag) are recorded in wiki/marketing/social-profiles.md for the day
 * vertical-entity sites join the fleet; KTAHV/KAPPL "use the KAG account"
 * for X/LinkedIn/YouTube per the same reply.
 *
 * HARD GATE 6 (never invent facts): every entry below is the canonical
 * email's URL, HTTP-verified again on 2026-07-20 before shipping. Deltas
 * from the interim set, each grounded in the canonical reply:
 *  - X: @Kairali_Group (underscore) — Anupam's answer to the interim set's
 *    open two-accounts question; HTTP 200 re-verified 20 Jul.
 *  - Instagram REMOVED: KAG Instagram = "N.A" in the canonical list (the
 *    interim carried KTAHV's account as a stand-in). Restoring KTAHV's
 *    handle fleet-wide needs an owner word — Q-SOCIALS-CANONICAL-WARTS.
 *  - Pinterest REMOVED: absent from the canonical KAG list ("profiles
 *    currently active"); the interim entry came from the old live footer.
 *  - LinkedIn: the canonical reply gave a personal-profile form
 *    (/in/kairaliayurvedicgroup, HTTP 999 bot-blocked, unverifiable); the
 *    content-verified COMPANY page (18 Jul, HTTP 200 again 20 Jul) ships
 *    instead — same org, verifiable form. Q-SOCIALS-CANONICAL-WARTS.
 */

export interface SocialProfile {
  /** Stable kebab-case id — React key + `data-social` attribute on the link. */
  id: string;
  /** Visible link text. */
  label: string;
  /** Full https profile URL — verified, never invented. */
  href: string;
}

export const SOCIAL_PROFILES: readonly SocialProfile[] = [
  // Canonical (Anupam 20 Jul): the UNDERSCORE account is the group's —
  // answers the interim set's two-accounts question. HTTP 200, 20 Jul 2026.
  { id: "x", label: "X (Twitter)", href: "https://x.com/Kairali_Group" },
  // Canonical (Anupam 20 Jul) == interim: channel "Kairali Ayurveda Group".
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@kairaliayurvedagroup",
  },
  // Verified company page (18 Jul content-check; HTTP 200 again 20 Jul).
  // The canonical reply's /in/ variant is bot-blocked/unverifiable —
  // flagged in QUESTIONS.md (Q-SOCIALS-CANONICAL-WARTS), not shipped.
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/kairali-ayurvedic-group",
  },
  // Canonical (Anupam 20 Jul) == interim page: "Kairali Ayurvedic Group".
  { id: "facebook", label: "Facebook", href: "https://www.facebook.com/KairaliGroup" },
] as const;
