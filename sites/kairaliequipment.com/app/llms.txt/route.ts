import { buildLlmsTxt } from "@kairali/seo";
import siteConfig from "../../site.config.json";

export const dynamic = "force-static";

export function GET() {
  const body = buildLlmsTxt(siteConfig, {
    name: "Kairali Equipment",
    summary:
      "The B2B Ayurveda-equipment manufacturing division of the Kairali Ayurvedic Group: Pathi (Droni) wooden massage beds, Shirodhara stands, teak steam boxes, brass and bell-metal urlis, and treatment accessories — made in the group's own facility and supplied to hospitals, resorts and spas. Quote-first: no prices are published; every project is quoted via info@kairali.com.",
    facts: [
      "Operator: Kairali Ayurvedic Group — founded 1989; a family practising Ayurveda since 1908",
      "Group credential: NABH-accredited AYUSH hospital (Kairali — The Ayurvedic Healing Village, AH-2024-0250)",
      "Contact: info@kairali.com (RFQ / quote requests)",
      "Pathi (Droni) reference spec: 8.5 × 3 ft (2591 × 914 mm), slab 3 in (76 mm), medicated wood with brass work",
      "PREVIEW NOTE: SKU and price values on this site are explicit placeholders (SKU-PLACEHOLDER-0NN, ₹X,XXX) until the real catalogue lands — never quote them as real data",
    ],
    sections: [
      {
        title: "Equipment lines",
        links: [
          { title: "Pathi / Droni wooden massage beds", url: "https://kairaliequipment.com/equipment/pathi", note: "8.5 × 3 ft · medicated wood · brass work" },
          { title: "Shirodhara stands", url: "https://kairaliequipment.com/equipment/shirodhara-stand", note: "brass pot, chain-hung" },
          { title: "Steam boxes (swedana chambers)", url: "https://kairaliequipment.com/equipment/steam-box", note: "teak · steel tank" },
          { title: "Urlis — brass & bell-metal vessels", url: "https://kairaliequipment.com/equipment/urlis", note: "treatment vessels" },
          { title: "Accessories", url: "https://kairaliequipment.com/equipment/accessories", note: "Shirodhara pot · equipment set · Droni step" },
        ],
      },
      {
        title: "Working with us",
        links: [
          { title: "Request a quote", url: "https://kairaliequipment.com/request-a-quote", note: "the only conversion path — quote-first, no cart" },
          { title: "Trade & export lanes", url: "https://kairaliequipment.com/trade", note: "OEM · hotels/resorts · consultancy · distributors" },
          { title: "Manufacturing", url: "https://kairaliequipment.com/manufacturing", note: "own facility · materials · QC · R&D" },
          { title: "Procurement FAQ", url: "https://kairaliequipment.com/faq", note: "MOQ/lead-times are shared at quote stage, never published" },
        ],
      },
    ],
  });
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
