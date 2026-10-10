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
 * four routes only.
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
 * Owner, 10 Oct 2026 (WOPS-AHV-DOCTOR-POSITION-20261010-001): on these four routes only, the complete existing doctors
 * section moves up as-is — immediately after the lead, before the offering. Same section, same props, shown once; every
 * other section keeps its relative order. This supersedes the 8 Oct "directly before the enquiry" placement for these
 * four slugs alone; the other routes keep their variant's default order. Reversible: remove a slug to restore it.
 */
export const DOCTORS_AFTER_LEAD: readonly string[] = ["treatment-packages", "panchakarma", "pain-management", "family-ayurvedic-retreat"];

/** The variant's order for one route: the default, or (allowlisted routes) the doctors moved up to follow the lead. */
export function variantOrder(slug: string, v: Variant): Block[] {
  const base = [...ORDER[v]];
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
