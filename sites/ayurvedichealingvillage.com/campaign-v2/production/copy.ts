// The reviewed copy of one live ad route, arranged into the production template's sections (production/pages/*.ts).
// Copy only: URLs, photographs, forms and lead identity are route facts (bindings.ts), and every fact on a doctor's
// card comes from data/doctors.ts. Where a page file departs from the reviewed brief's wording, a comment beside
// the string says what changed and why, for the wording review.
//
// Erasable TypeScript only (node --test imports this file).

import type { ProductionPage } from "../kit/types.ts";
import type { ProductionSlug } from "./bindings.ts";

export type ProductionCopy = {
  slug: ProductionSlug;
  route: string;
  /**
   * The reviewed brief this copy is adapted from: .vercel/ppc-task-input/owner-correction/<file> (independent
   * factual/editorial/SEO review PASS, 8 Oct 2026; `sha256` as recorded in CLEAN-COPY-REVIEW.json).
   */
  source: { file: string; sha256: string };
  seo: { title: string; description: string };
  adMatch: { keywords: string[]; adHeadlines: string[] };
  hero: { overline: string; h1: string; standfirst: string };
  cta: { primary: string; primarySupport: string; secondary: string };
  /** The Step-1 bar's program value (batch 1); editorial context only where the route has no ConsultBar. */
  programDefault: string;
  /** Doctor registry ids (data/doctors.ts), in the order shown. */
  doctors: string[];
  faq: { q: string; a: string }[];
  page: ProductionPage;
  /** Family form only: the note under its optional "Any existing health conditions?" field. */
  familyFormNote?: string;
};

/** Identity: types a page file. */
export const defineCopy = (c: ProductionCopy): ProductionCopy => c;
