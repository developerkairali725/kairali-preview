// FIXTURE — NEGATION CORPUS for the llms-legal-entity rule: the corrected
// brand form and the facts lines that were always legal, in an llms.txt-scoped
// path. If a rule change makes any of this fail, the RULE is wrong.
export function GET() {
  const summary =
    "The bulk-supply desk of Kairali Ayurvedic Products (KAPPL): manufacturer-direct bulk supply of classical Ayurvedic thailams.";
  const facts = [
    "Operator: Kairali Ayurvedic Group — founded 1989; a family practising Ayurveda since 1908",
    "Manufacturer: KAPPL, Pollachi, Tamil Nadu — in-house laboratories and herb extraction",
    "Certifications (as published by KAPPL): WHO-GMP, ISO, FSSAI",
  ];
  return new Response([summary, ...facts].join("\n"));
}
