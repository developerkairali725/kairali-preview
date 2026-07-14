import { buildLlmsTxt } from "@kairali/seo";
import siteConfig from "../../site.config.json";

// llms.txt (Ship Gate B2 / llmstxt.org): the site's canonical facts for AI
// crawlers. Facts below are the LOCKED facts + verified site content only.
export const dynamic = "force-static";

export function GET() {
  const body = buildLlmsTxt(siteConfig, {
    name: "Arogya Kendra",
    summary:
      "Gateway site of the Kairali Ayurvedic Group — health through ayurveda since 1908. It directs visitors to the group's hospital-retreat, treatment centres, products, tea, and franchise sites.",
    facts: [
      "Kairali Ayurvedic Group, founded 1908 (four generations, family-run)",
      "Contact: info@kairali.com · WhatsApp +91 92898 38797",
      "Kairali — The Ayurvedic Healing Village: NABH-accredited Ayurvedic hospital-retreat, Palakkad, Kerala",
      "Kairali Ayurvedic Products: WHO-GMP-certified manufacturing",
      "Treatment centres across nine countries",
    ],
    sections: [
      {
        title: "The Kairali family of sites",
        links: [
          {
            title: "Kairali — The Ayurvedic Healing Village",
            url: "https://www.ayurvedichealingvillage.com",
            note: "NABH-accredited Ayurvedic hospital-retreat, physician-led treatment programmes",
          },
          {
            title: "Kairali Ayurvedic Centres",
            url: "https://www.kairalicenters.com",
            note: "treatment centres across nine countries",
          },
          {
            title: "Kairali Ayurvedic Products",
            url: "https://www.kairaliproducts.in",
            note: "WHO-GMP-certified Ayurvedic medicines, oils, and personal care",
          },
          {
            title: "Kairali Herbal Tea",
            url: "https://www.kairalitea.com",
            note: "herbal tea blends rooted in Ayurvedic tradition",
          },
          {
            title: "Kairali Franchise",
            url: "https://www.kairalifranchise.com",
            note: "franchise opportunities in India and abroad",
          },
          {
            title: "Kairali Ayurvedic Group",
            url: "https://www.kairali.com",
            note: "the group site",
          },
        ],
      },
    ],
  });
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
