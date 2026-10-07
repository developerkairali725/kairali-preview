import type { Variant } from "./types.ts";

export type SectionId = "header" | "hero" | "consultBar" | "proof" | "offer" | "admission" | "stillness" | "films" | "doctors" | "village" | "fees" | "enquiry" | "faq" | "longForm" | "footer";

export const SECTION_ORDER: Record<Variant, SectionId[]> = {
  A: ["header", "hero", "consultBar", "proof", "offer", "admission", "stillness", "films", "doctors", "village", "fees", "enquiry", "faq", "longForm", "footer"],
  B: ["header", "hero", "proof", "offer", "village", "admission", "doctors", "films", "fees", "enquiry", "faq", "longForm", "footer"],
  C: ["header", "hero", "proof", "admission", "stillness", "doctors", "village", "films", "offer", "fees", "enquiry", "faq", "longForm", "footer"],
  D: ["header", "hero", "proof", "offer", "fees", "doctors", "enquiry", "faq", "footer"],
};
