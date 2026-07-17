import { buildLlmsTxt } from "@kairali/seo";
import siteConfig from "../../site.config.json";

// llms.txt (Ship Gate B2): ruled/verified facts only — properties per
// wiki/entities/kairali-hospitality.md (LOCKED); Svatá Kateřina name/region
// two-source verified 16 Jul 2026 (build brief); RULED 17 Jul 2026
// (D-KH-JV-LABEL): the relationship prints as "in cooperation with" — no
// "joint venture"/ownership language until Abilash confirms the legal form;
// no dates/counts beyond the locked 1908/1989 anchors.
export const dynamic = "force-static";

export function GET() {
  const body = buildLlmsTxt(siteConfig, {
    name: "Kairali Hospitality — the Kairali Ayurvedic Group's properties umbrella",
    summary:
      "Kairali Hospitality is the umbrella for the Kairali Ayurvedic Group's hospitality properties — Villa Raag (Agonda, Goa), Kairali — The Ayurvedic Healing Village (the group's NABH-accredited Ayurvedic hospital, Palakkad, Kerala), and Resort Svatá Kateřina (Vysočina, Czech Republic), whose Ayurvedic programmes run in cooperation with the group — and the group's consultancy for people developing wellness properties of their own.",
    facts: [
      "Villa Raag: the group's boutique wellness property in Agonda, Goa — villaraag.com",
      "Kairali — The Ayurvedic Healing Village: the group's NABH-accredited Ayurvedic hospital in Palakkad, Kerala; physician-led treatment programmes — ayurvedichealingvillage.com",
      "Kairali — The Ayurvedic Healing Village opened 14 February 1999",
      "Resort Svatá Kateřina: a resort in the Bohemian-Moravian Highlands (Vysočina), Czech Republic, whose purpose-built Ayurvedic Pavilion and programmes run in cooperation with the Kairali Ayurvedic Group — katerinaresort.cz",
      "Consultancy: concept, build and operating support for new wellness/hospitality properties; the group's own properties are the case studies",
      "Kairali Ayurvedic Group founded 1989 by K. V. Ramesh and Gita Ramesh; the family has practised Ayurveda since 1908",
      "Enquiries: info@kairali.com or WhatsApp +91 92898 38797",
    ],
    sections: [
      {
        title: "The properties",
        links: [
          { title: "Villa Raag", url: "https://villaraag.com", note: "Agonda, Goa" },
          { title: "Kairali — The Ayurvedic Healing Village", url: "https://www.ayurvedichealingvillage.com", note: "the group's NABH-accredited hospital, Palakkad" },
          { title: "Resort Svatá Kateřina", url: "https://www.katerinaresort.cz/en", note: "Vysočina, Czech Republic" },
        ],
      },
      {
        title: "Kairali sites",
        links: [
          { title: "Kairali Ayurvedic Group", url: "https://www.kairali.com", note: "the group behind the properties" },
          { title: "Kairali Store (India)", url: "https://www.kairaliproducts.in", note: "the WHO-GMP product range" },
        ],
      },
    ],
  });
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
