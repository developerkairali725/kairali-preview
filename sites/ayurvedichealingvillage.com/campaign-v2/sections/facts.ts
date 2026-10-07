import { site } from "../../campaign-v110/lib/site.ts";

/** NABH certificate number, read from the locked accreditation line in site.ts (never retyped). */
export const NABH_NO = site.accreditation.match(/AH-\d{4}-\d{4}/)?.[0] ?? "";

/** Owner decision (Task 12a review): exact wording, shown where the artboards show it (B proof tile, C trust line).
 *  Not the village's own founding year, which is a separate pending fact (C8). */
export const FAMILY_TRADITION = "Ayurvedic family tradition since 1908";
