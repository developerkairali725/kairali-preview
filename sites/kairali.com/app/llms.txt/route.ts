import { buildLlmsTxt } from "@kairali/seo";
// Network counts are COMPUTED from the verified centres roster — never typed
// (canonical: KAC site figures, ruled 17 Jul 2026; PROJECT_CONTEXT §12).
import { CENTRES_NETWORK_LINE, COUNTRIES_PHRASE } from "@kairali/facts";
import siteConfig from "../../site.config.json";

// llms.txt (Ship Gate B2 / llmstxt.org): the site's canonical facts for AI
// crawlers. Facts below are the LOCKED facts + verified site content only.
export const dynamic = "force-static";

export function GET() {
  const body = buildLlmsTxt(siteConfig, {
    name: "Kairali Ayurvedic Group",
    summary:
      `Flagship site of the Kairali Ayurvedic Group — health through ayurveda since 1908. One family, five doors: an NABH-accredited Ayurvedic hospital, WHO-GMP medicine manufacturing, treatment centres in ${COUNTRIES_PHRASE}, Ayurveda training, and Villa Raag in Goa.`,
    facts: [
      "Kairali Ayurvedic Group, founded 1908 (four generations, family-run)",
      "Contact: info@kairali.com · WhatsApp +91 92898 38797",
      "Kairali — The Ayurvedic Healing Village: NABH-accredited Ayurvedic hospital, Palakkad, Kerala",
      "Kairali Ayurvedic Products: WHO-GMP-certified manufacturing",
      CENTRES_NETWORK_LINE,
      "Villa Raag: boutique wellness villa, Agonda, South Goa",
    ],
    sections: [
      {
        title: "The Kairali family of sites",
        links: [
          {
            title: "Kairali — The Ayurvedic Healing Village",
            url: "https://www.ayurvedichealingvillage.com",
            note: "NABH-accredited Ayurvedic hospital, physician-led treatment programmes",
          },
          {
            title: "Kairali Ayurvedic Centres",
            url: "https://www.kairalicenters.com",
            note: CENTRES_NETWORK_LINE,
          },
          {
            title: "Kairali Ayurvedic Products",
            url: "https://www.kairaliproducts.com",
            note: "WHO-GMP-certified Ayurvedic medicines, oils, and personal care",
          },
          {
            title: "Ayurveda Training",
            url: "https://kairali.guru",
            note: "courses in Ayurveda and Panchakarma at the Healing Village",
          },
          {
            title: "Villa Raag",
            url: "https://villaraag.com",
            note: "boutique wellness villa in Agonda, South Goa",
          },
        ],
      },
    ],
  });
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
