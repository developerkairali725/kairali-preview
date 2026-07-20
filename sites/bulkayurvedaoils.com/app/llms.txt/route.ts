import { buildLlmsTxt } from "@kairali/seo";
import siteConfig from "../../site.config.json";

export const dynamic = "force-static";

// Machine-readable surface (B2 GEO). Facts here are the owned-claims register
// only — cited-owned cert claims with the as-published qualifier; no MOQs,
// prices or lead times (unpublished = unprinted, HARD GATE 6).
export function GET() {
  const body = buildLlmsTxt(siteConfig, {
    name: "Bulk Ayurveda Oils — a KAPPL supply desk",
    summary:
      "The bulk-supply desk of Kairali Ayurvedic Products (KAPPL): manufacturer-direct bulk supply of classical Ayurvedic thailams, proprietary oils and therapy powders for spas, panchakarma centres, clinics and distributors. Quote-based B2B supply — no cart, no online checkout.",
    facts: [
      "Operator: Kairali Ayurvedic Group — founded 1989; a family practising Ayurveda since 1908",
      "Manufacturer: KAPPL, Pollachi, Tamil Nadu — in-house laboratories and herb extraction",
      "Certifications (as published by KAPPL): WHO-GMP, ISO, FSSAI",
      "Bulk pack formats: 5 L cans (classical thailams) · 500 g – 1 kg (choornams and therapy powders)",
      "Dispatch: India and export markets — quoted direct; minimums and lead times confirmed per quote",
      "Contact: info@kairali.com · WhatsApp +91 92898 38797",
    ],
    sections: [
      {
        title: "This desk",
        links: [
          { title: "Bulk catalog — oils and powders", url: "https://bulkayurvedaoils.com/oils", note: "The verified 11-SKU ledger with pack formats" },
          { title: "Classical thailams (5 L cans)", url: "https://bulkayurvedaoils.com/oils/classical-thailams" },
          { title: "Therapy powders and choornams (500 g – 1 kg)", url: "https://bulkayurvedaoils.com/oils/therapy-powders-choornams" },
          { title: "For spas, hotels and resorts", url: "https://bulkayurvedaoils.com/for/spas-hotels-resorts" },
          { title: "For panchakarma centres and clinics", url: "https://bulkayurvedaoils.com/for/panchakarma-centres-clinics" },
          { title: "For distributors and importers", url: "https://bulkayurvedaoils.com/for/distributors-importers" },
          { title: "Quality — certifications as published", url: "https://bulkayurvedaoils.com/quality" },
          { title: "How bulk supply works", url: "https://bulkayurvedaoils.com/how-bulk-supply-works", note: "Process, pack formats, honest MOQ policy" },
          { title: "Request a quote", url: "https://bulkayurvedaoils.com/request-a-quote", note: "The one conversion — quote model, no cart" },
        ],
      },
      {
        title: "The Kairali Group",
        links: [
          { title: "KAPPL — the manufacturer", url: "https://kappl.co.in", note: "Corporate site with published certificates" },
          { title: "Kairali retail store — wholesale collection", url: "https://www.kairaliproducts.in/collections/ayurvedic-herbal-products-wholesaler-bulk-supplier", note: "The live bulk listings this desk quotes against" },
          { title: "Private label and contract manufacturing", url: "https://www.bulkayurvedaproducts.com", note: "The sister manufacturing desk" },
          { title: "Kairali Ayurvedic Group", url: "https://www.kairali.com" },
        ],
      },
    ],
  });
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
