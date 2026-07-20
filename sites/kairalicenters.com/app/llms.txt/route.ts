import { buildLlmsTxt } from "@kairali/seo";
import siteConfig from "../../site.config.json";
import { CENTRES } from "../lib/centres";

export const dynamic = "force-static";

export function GET() {
  const body = buildLlmsTxt(siteConfig, {
    name: "Kairali Ayurvedic Centres",
    summary:
      "The network of Kairali Ayurvedic treatment centres in India and abroad, part of the Kairali Ayurvedic Group (physicians since 1908; NABH hospital + WHO-GMP pharmacy). Each centre page lists its address, phone, and timings. Non-commercial directory; it helps people find a centre and book a consultation.",
    facts: [
      "Publisher: Kairali Ayurvedic Group, founded 1989 (family-run; practising Ayurveda since 1908)",
      "Group contact: info@kairali.com · WhatsApp +91 92898 38797",
      "Centres verified from the live directory; some are Kairali-affiliated partner centres",
      "For treatment programmes see the NABH-accredited Ayurvedic Healing Village, Kerala",
    ],
    sections: [
      {
        title: "Centres",
        links: CENTRES.map((c) => ({
          title: `Kairali Ayurvedic Centre, ${c.city}${c.region ? ` (${c.region})` : ""}, ${c.country}`,
          url: `https://kairalicenters.com/centres/${c.slug}`,
          note: c.address,
        })),
      },
    ],
  });
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
