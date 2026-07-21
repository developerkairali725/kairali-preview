// Owned-claims facts — single source for every page on this site.
// HARD GATE 6 basis: the live contract-manufacturing page [OWN-5] + kappl.co.in
// [OWN-4] (docs/kappl-inputs/bulk-b2b-niche-brief.md §1). The four engagement
// models LEAD with the canonical published wording (guards test pins it);
// counters carry their provenance line; nothing here is restated or expanded.

export const MODELS = [
  { name: "Our products · our packing", lane: "Third party", desc: "KAPPL's formulations, manufactured and packed on our line — supplied ready for your market." },
  { name: "Our products · your packing", lane: "Third party", desc: "KAPPL's formulations, finished under your own pack and label." },
  { name: "Your products · your brand · your packing", lane: "Loan licence", desc: "Your approved products, manufactured on our licensed WHO-GMP line." },
  { name: "Your concept · our R&D · your brand", lane: "Loan licence", desc: "Your idea, developed by our R&D into your brand's product." },
] as const;

export const CAPABILITIES = [
  { slug: "oils", h: "Ayurvedic oils", p: "Classical thailams and proprietary oil formulations, developed and filled on the same line that supplies our own range." },
  { slug: "cosmetics", h: "Ayurvedic & herbal cosmetics", p: "Skin and hair care built on herbal actives — formulation, stability and packing under one roof." },
  { slug: "medicines", h: "Ayurvedic & herbal medicines", p: "Classical and proprietary medicines across the published dosage forms, on a licensed pharma line." },
  { slug: "shampoos-soaps", h: "Shampoos & soaps", p: "Herbal cleansing ranges — from formulation brief to dispatch-ready cartons." },
] as const;

export const DOSAGE_FORMS =
  "capsules · tablets · syrups & tonics · churnam · kwath · avaleham / lehyam · balms · lotions · powders";

export const COUNTERS = [
  { n: "10000+", l: "Satisfied clients" },
  { n: "1200+", l: "Total distributors" },
  { n: "900+", l: "Product SKUs" },
  { n: "4", l: "Generations practising Ayurveda" },
] as const;

export const COUNTERS_PROVENANCE = "Figures as published by KAPPL — carried as-is, never restated";
