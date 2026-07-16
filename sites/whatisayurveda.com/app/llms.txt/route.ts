import { buildLlmsTxt } from "@kairali/seo";
import siteConfig from "../../site.config.json";
import { allPages } from "../lib/content";

// llms.txt — canonical facts + the page index for AI crawlers. Facts are the
// LOCKED facts + verified site content only (no fabrication, CLAUDE.md rule 6).
export const dynamic = "force-static";

export function GET() {
  const pages = allPages();
  const body = buildLlmsTxt(siteConfig, {
    name: "What is Ayurveda",
    summary:
      "An educational authority site from the Kairali Ayurvedic Group (physicians since 1908). Evidence-honest explanations of Ayurveda — doshas, panchakarma, herbs, diet, and what the science says. Non-commercial; it educates and points to the group's NABH hospital and WHO-GMP pharmacy.",
    facts: [
      "Publisher: Kairali Ayurvedic Group, founded 1908 (four generations, family-run)",
      // TIERED HONESTY: coverage is per-page (`reviewedOn`); today 0 pages carry one.
      // A blanket claim here is the fabricated-review failure, aimed at the exact AI
      // engines we want citing us. State the RULE, never a coverage claim.
      "Physician review: pages reviewed by a Kairali Ayurvedic physician carry that doctor's name and the date they approved it; pages without it state that they have not been reviewed",
      "Contact: info@kairali.com · WhatsApp +91 92898 38797",
      "Editorial stance: honest about evidence limits; no disease-cure claims; not medical advice",
      "Related: Kairali — The Ayurvedic Healing Village (NABH hospital); Kairali Ayurvedic Products (WHO-GMP)",
    ],
    sections: [
      {
        title: "Guides",
        links: pages
          .filter((p) => !p.slug.startsWith("/about"))
          .map((p) => ({ title: p.title, url: `https://whatisayurveda.com${p.slug}`, note: p.metaDescription })),
      },
    ],
  });
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
