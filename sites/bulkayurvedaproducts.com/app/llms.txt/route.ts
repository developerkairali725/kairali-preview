import { buildLlmsTxt } from "@kairali/seo";
import siteConfig from "../../site.config.json";

export const dynamic = "force-static";

// Machine-readable surface (B2 GEO). Facts here are the owned-claims register
// only — cited-owned cert claims with the as-published qualifier; published
// engagement models verbatim; no MOQ ladder, prices or client names
// (unpublished = unprinted, HARD GATE 6).
export function GET() {
  const body = buildLlmsTxt(siteConfig, {
    name: "Bulk Ayurveda Products — a KAPPL manufacturing desk",
    summary:
      "The manufacturing-partnership desk of Kairali Ayurvedic Products Pvt. Ltd. (KAPPL): private label, third-party and loan-licence manufacturing of Ayurvedic and herbal products, from formulation to dispatch. Project-enquiry based — no cart, no online checkout.",
    facts: [
      "Operator: Kairali Ayurvedic Group — founded 1989; a family practising Ayurveda since 1908",
      "Facility: Pollachi, Tamil Nadu — in-house laboratories, herb-extraction unit and R&D",
      "Certifications (as published by KAPPL): WHO-GMP, ISO, FSSAI",
      "Engagement models as published: our products/our packing · our products/your packing · your products/your brand/your packing · your concept/our R&D/your brand",
      "Categories: Ayurvedic oils · Ayurvedic/herbal cosmetics · Ayurvedic & herbal medicines · shampoos & soaps",
      "Dosage forms as published: capsules, tablets, syrups/tonics, churnam, kwath, avaleham/lehyam, balms, lotions, powders",
      "Published claims carried as-is: 'Low MOQs' · 'Launch Your Own Brand in Just 30 Days'",
      "Contact: info@kairali.com · WhatsApp +91 92898 38797",
    ],
    sections: [
      {
        title: "This desk",
        links: [
          { title: "Private label", url: "https://bulkayurvedaproducts.com/services/private-label", note: "Formulation to dispatch under your brand" },
          { title: "Third-party manufacturing", url: "https://bulkayurvedaproducts.com/services/third-party-manufacturing", note: "The two published third-party models" },
          { title: "Loan licence", url: "https://bulkayurvedaproducts.com/services/loan-licence", note: "Your approvals on our licensed line" },
          { title: "What we manufacture", url: "https://bulkayurvedaproducts.com/products", note: "The four published capability categories" },
          { title: "The Pollachi facility", url: "https://bulkayurvedaproducts.com/facility" },
          { title: "Quality — certifications as published", url: "https://bulkayurvedaproducts.com/quality" },
          { title: "How it works", url: "https://bulkayurvedaproducts.com/how-it-works", note: "Process, sampling-first, honest MOQ policy" },
          { title: "Start your project", url: "https://bulkayurvedaproducts.com/start-your-project", note: "The one conversion — project quote model" },
        ],
      },
      {
        title: "The Kairali Group",
        links: [
          { title: "KAPPL — the manufacturer", url: "https://kappl.co.in", note: "Corporate site with published certificates" },
          { title: "Published contract-manufacturing page", url: "https://www.kairaliproducts.in/pages/ayurvedic-herbal-products-contract-manufacturing-and-third-party-manufacturing-company-in-india", note: "The owned page this desk's claims are cited from" },
          { title: "Ready-made bulk oils and powders", url: "https://www.bulkayurvedaoils.com", note: "The sister supply desk" },
          { title: "Kairali Ayurvedic Group", url: "https://www.kairali.com" },
        ],
      },
    ],
  });
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
