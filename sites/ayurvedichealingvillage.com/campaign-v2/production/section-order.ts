// The order of the designed sections on a live ad route (production/ProductionPage.tsx renders it). Pure data and one
// pure function, so node --test exercises the exact order the template renders.
//
// Erasable TypeScript only (node --test imports this file).

import type { CampaignConfig, Variant } from "../kit/types.ts";

export type Block = "lead" | "offering" | "pathway" | "rest" | "place" | "stories" | "stay" | "physicians";

/**
 * The designed sections in the order each variant tells its story (kit/variants.ts adapted to the designed page).
 * By default every variant ends doctors → enquiry → one FAQ (owner, 8 Oct 2026: the doctor biographies once, directly
 * before the enquiry they lead into; one FAQ for the whole page). DOCTORS_AFTER_LEAD below supersedes that placement on
 * the routes it lists.
 *   A Quiet Admission — the argument, the care, the quiet band, the village, the stay.
 *   B Garden Bento — the place first (the village right after the argument), no stillness band (as the kit's B).
 *   C Editorial — the method as numbered chapters, the full-bleed quiet band, then the village.
 *   D Direct — the shortest path: argument, what is involved, three steps, what the quotation covers.
 */
export const ORDER: Readonly<Record<Variant, readonly Block[]>> = {
  A: ["lead", "offering", "pathway", "rest", "place", "stories", "stay", "physicians"],
  B: ["lead", "place", "offering", "pathway", "stories", "stay", "physicians"],
  C: ["lead", "offering", "pathway", "rest", "place", "stories", "stay", "physicians"],
  D: ["lead", "offering", "pathway", "stay", "physicians"],
};

/**
 * Owner, 10 Oct 2026 (WOPS-AHV-DOCTOR-POSITION-20261010-001): on the routes listed here, the complete existing doctors
 * section moves up as-is — immediately after the lead (before the offering; in B, before the village). Same section,
 * same props, shown once; every other section keeps its relative order. This supersedes the 8 Oct "directly before the
 * enquiry" placement for the listed slugs; a route not listed keeps its variant's default order. Reversible: remove a
 * slug to restore it. In variant C the chapters stay numbered in reading order, so the doctors become chapter 01.
 *   First four (batch 1), then the remaining 20 (batch 2), in PRODUCTION_SLUGS order.
 */
export const DOCTORS_AFTER_LEAD: readonly string[] = [
  "treatment-packages", "panchakarma", "pain-management", "family-ayurvedic-retreat",
  "monsoon-wellness", "rejuvenation-detox", "ayurveda-retreat", "wellness-kerala", "cleansing-centre",
  "treatment-kerala", "south-india-cities", "brand", "weight-management", "lp-south-india",
  "lp-hospital-kerala", "lp-brand", "lp-cleansing-centre", "lp-pain-management", "lp-panchakarma",
  "lp-treatment-kerala", "lp-treatment-packages", "lp-weight-management", "lp-behandlung-kerala", "lp-treatment-kerala-ru",
];

/**
 * Staff review 9 Oct 2026 (AHV-WB.249/320/430/272 guest-video and villa-gallery), under the owner's standing authority
 * for approved villa photographs and on-page guest video: on the Direct (D) routes listed here the existing village
 * section (Place, with the route's own approved gallery) and patient films (Stories) follow the three steps, before the
 * quotation, as in variant A. Same sections, styles and props; every other D route keeps the shortest path. Reversible:
 * remove a slug to restore its D order.
 */
// Train J3 (15 Oct 2026, AHV-WB.362.villa-gallery / .guest-video): /lp/kairali-brand/ joins, as its sibling brand page.
export const D_VILLAGE_AND_STORIES: readonly string[] = ["south-india-cities", "brand", "lp-south-india", "lp-panchakarma", "lp-brand"];
const D_WITH_VILLAGE_AND_STORIES: readonly Block[] = ["lead", "offering", "pathway", "place", "stories", "stay", "physicians"];

/** The variant's designed sections for one route, before the doctors move (ORDER, or a listed D route's override). */
export function baseOrder(slug: string, v: Variant): Block[] {
  return v === "D" && D_VILLAGE_AND_STORIES.includes(slug) ? [...D_WITH_VILLAGE_AND_STORIES] : [...ORDER[v]];
}

/** The variant's order for one route: the default, or (allowlisted routes) the doctors moved up to follow the lead. */
export function variantOrder(slug: string, v: Variant): Block[] {
  const base = baseOrder(slug, v);
  if (!DOCTORS_AFTER_LEAD.includes(slug)) return base;
  const rest = base.filter((b) => b !== "physicians");
  const at = rest.indexOf("lead") + 1;
  return [...rest.slice(0, at), "physicians", ...rest.slice(at)];
}

/** The sections a route renders, in order: its variant order, less the bands its copy does not write. */
export function sectionOrder(c: Pick<CampaignConfig, "slug" | "page">, v: Variant): Block[] {
  const page = c.page;
  return variantOrder(c.slug, v).filter((b) => (b === "rest" ? !!page?.rest : b === "place" ? !!page?.place : b === "stories" ? !!page?.stories : true));
}
