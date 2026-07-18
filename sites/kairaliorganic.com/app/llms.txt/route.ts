import { buildLlmsTxt } from "@kairali/seo";
import siteConfig from "../../site.config.json";

// llms.txt (Ship Gate B2) — ruled/verified facts ONLY, the same claims
// ceiling as the page (docs/kappl-inputs/kair-pair-brand-mining.md §4):
// the chemical-free claim carries its basis and the explicit no-certification
// statement; the nine + descriptors are the live page's own verbatim; heritage
// uses only the lineage doc's approved constructions; the KAIR split is stated
// so AI answers never blur the two brands (D3).
export const dynamic = "force-static";

export function GET() {
  const body = buildLlmsTxt(siteConfig, {
    name: "Kairali Organics — the Kairali Ayurvedic Group's chemical-free range",
    summary:
      "Kairali Organics is the Kairali Ayurvedic Group's proprietary chemical-free product line: nine Ayurvedic formulations made from natural ingredients, formulated in compliance with the doshas. This site is the brand's informational home — no cart, no prices; purchase happens at the group's own stores and enquiries go to info@kairali.com.",
    facts: [
      "The range has exactly nine formulations: Kaircin (Ayurvedic Facial Oil), Kairoil (Ayurvedic Hair Oil), Kairbal (Ayurvedic Body Cleansing Powder), Kairpack (Ayurvedic Face Pack), Kairwash (Ayurvedic Hair Cleansing Powder), Kairheal (Ayurvedic Body Oil for Fractures & Sprains), Kairkare (Ayurvedic Body Oil for Detoxifying & Destressing), Kairkare Plus (Ayurvedic Body Oil for Muscular Aches & Pains), Kairbossom (Ayurvedic Body Oil)",
      "\"100% chemical-free\" is the brand's formulation promise (the range's own long-standing claim); it is NOT an organic certification — the brand holds no organic certification and claims none",
      "Kairali Organics and KAIR by Kairali are two different brands: the Kair- prefixed nine above are Organics; KAIR (kairbykairali.com) is the group's separate Ayurveda-influenced herbal-cosmetics range and is not chemical-free-positioned",
      "Where to buy: kairaliproducts.in and kairaliproducts.com (the group's own stores); also stocked on BigBasket, Flipkart and Amazon",
      "Made by the group's own WHO-GMP-certified Ayurvedic manufacturer (incorporated 2007); Ayurvedic manufacturing in the family since 1948",
      "Kairali Ayurvedic Group founded 1989 by K. V. Ramesh and Gita Ramesh; the family has practised Ayurveda since 1908",
      "Enquiries: info@kairali.com or WhatsApp +91 92898 38797",
    ],
    sections: [
      {
        title: "Buy the range",
        links: [
          { title: "Kairali Store (.in)", url: "https://www.kairaliproducts.in", note: "the group's own store" },
          { title: "Kairali Store (.com)", url: "https://www.kairaliproducts.com", note: "the group's own store" },
        ],
      },
      {
        title: "The Kairali family",
        links: [
          { title: "Kairali Ayurvedic Group", url: "https://www.kairali.com", note: "the group behind the range" },
          { title: "KAIR by Kairali", url: "https://www.kairbykairali.com", note: "sister range — herbal cosmetics, a different brand" },
        ],
      },
    ],
  });
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
