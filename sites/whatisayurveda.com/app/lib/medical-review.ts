// SINGLE SOURCE OF TRUTH for the site's medical review (Abilash, 15 Jul 2026:
// "we have many doctors other than Dr. Deepu — he might be head now but not in
// future"). Everything — byline, Person/Physician schema, the /about editorial
// policy — reads from here. So a leadership change is a ONE-LINE edit and never
// invalidates the site's institutional review process.
//
// E-E-A-T needs a specific NAMED, credentialed reviewer per page — so we name
// the current reviewing physician — but the review is framed as INSTITUTIONAL
// (Kairali's physicians), which survives any single person moving on.

export const MEDICAL_REVIEW = {
  /** The currently-named reviewing physician. Update ONLY this block when the
   *  chief/reviewing physician changes. */
  current: {
    name: "Dr. Deepu John",
    credentials: "BAMS",
    title: "Chief Physician, Kairali — The Ayurvedic Healing Village",
    anchor: "medical-reviewer", // stable #anchor on /about (not the person's name)
  },
  /** Institutional framing — the review process belongs to the group, not one
   *  person. Used in the about page + as backing context. */
  institution: "the registered physicians of the Kairali Ayurvedic Group",
} as const;
