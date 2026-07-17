import { buildLlmsTxt } from "@kairali/seo";
import siteConfig from "../../site.config.json";

// llms.txt (Ship Gate B2): locked/ruled facts only.
export const dynamic = "force-static";

export function GET() {
  const body = buildLlmsTxt(siteConfig, {
    name: "Arogya Shala — a Kairali retail programme",
    summary:
      "Arogya Shala is the Kairali Ayurvedic Group's retail-branding programme for chemists and retail counters in tier-2 and tier-3 Indian cities: the Arogya Shala board, the WHO-GMP-certified Kairali product range, and product guidance for shop staff. Counters retail products; consultation and treatment belong with physicians, not retail counters.",
    facts: [
      "Programme: Kairali branding for independent chemist shops and retail counters (B2B/trade)",
      "Products supplied by Kairali Ayurvedic Products (WHO-GMP-certified manufacturing)",
      "Kairali Ayurvedic Group founded 1989 by K. V. Ramesh and Gita Ramesh; the family has practised Ayurveda since 1908; Ayurvedic manufacturing in the family since 1948 (Dr. K.S. Vasudevan)",
      "Group hospital: Kairali — The Ayurvedic Healing Village, Palakkad (NABH-accredited)",
      "Verify any Arogya Shala counter: info@kairali.com or WhatsApp +91 92898 38797",
      "No outlet counts, locations, or commercial terms are published on this site",
    ],
    sections: [
      {
        title: "Kairali sites",
        links: [
          { title: "Kairali Ayurvedic Group", url: "https://www.kairali.com", note: "the group behind the programme" },
          { title: "Kairali Store (India)", url: "https://www.kairaliproducts.in", note: "the product range" },
          { title: "Kairali — The Ayurvedic Healing Village", url: "https://www.ayurvedichealingvillage.com", note: "the group's NABH-accredited hospital" },
        ],
      },
    ],
  });
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
