// /defence-and-paramilitary-forces/ — owner-approved defence customer terms + the all-offer rules (28 Sep 2026,
// deliverable OWNER-DECISIONS-LATEST.md: "Owner APPROVED defence-offer customer terms", "LATEST OWNER AUTHORITY —
// staggered discounts apply to ALL offers", "Owner-approved short-stay rule", "Owner-approved all-offer non-stacking
// rule", "Owner-approved discount calculation basis", "Owner wording standard"). Working text:
// DEFENCE-OFFER-TERMS-DRAFT.md, with its superseded parts replaced by the later rulings (staggered bands instead of
// "depends on package and dates"; best single saving instead of "unless the quote allows a combination").
// No expiry date, promo mechanics or legal certification invented. Exact-count, all-or-nothing, idempotent.
//   node tools/repair-defence-offer-terms-20260928.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
export const BANDS = "10% for 3–13 nights, 15% for 14–20 nights and 20% for 21 nights or more";
const R = [
  // eligibility
  ["Serving personnel — [TO CONFIRM: which forces are covered]", "Serving and retired members of India’s Armed Forces, Central Armed Police Forces (CAPFs) and Assam Rifles"],
  ["Retired personnel and ex-servicemen — [TO CONFIRM]", "Their spouses, parents and children"],
  ["Family members — [TO CONFIRM: which relationships are included]", "Family members may book and travel independently; the service member does not need to travel"],
  // proof
  ["[TO CONFIRM: accepted proof of service]", "A service ID, veteran or pensioner card, or other acceptable proof, shown at check-in"],
  ["[TO CONFIRM: proof required for family members]", "Family members can confirm their relationship with our team in advance"],
  ["Checked at [TO CONFIRM: enquiry, booking or admission].", "No promo code or document upload is needed to enquire; please do not send service documents through the enquiry form. If the usual proof is not available, speak with us before paying so we can agree an alternative."],
  // the discount
  ["On Booking amount only. See Terms and Conditions below.", `${BANDS[0].toUpperCase()}${BANDS.slice(1)}, on the treatment-package price before tax. Stays of 1–2 nights are charged at standard rates.`],
  // how to claim (no expiry invented)
  ["How to claim, and until when", "How to claim"],
  ["How to claim — [TO CONFIRM]", "Tell us your preferred dates and programme, and mention the defence offer"],
  ["Valid until — [TO CONFIRM]", "Before you pay, we send a written quote showing the eligible package amount, your saving, any extras, taxes and the final total"],
  // terms that contradicted the approved rules
  ["Bookings made under Military citizen Discount Scheme are changeable and cancellable.", "Availability and the change and cancellation terms are stated in your quote before you pay. Once confirmed, the agreed offer is honoured for that booking."],
  ["Kairali will provide up to 20% discount on Booking amount only.", `The discount applies to the treatment-package price before tax: ${BANDS}; stays of 1–2 nights are charged at standard rates. Separately charged extras are not discounted, and anything included in your package stays included.`],
  ["This offer is applicable for Army, Navy, Air force Citizens.", "One offer applies per booking: if more than one offer fits your stay, we apply the one that gives you the best saving, and discounts are not added together. The benefit has no cash alternative and cannot be transferred to unrelated travellers."],
  // the review flag and the caption fragment left from a map this route does not carry
  ["showDraftMarkers: this.props.showDraftMarkers ?? true", "showDraftMarkers: this.props.showDraftMarkers ?? false"],
  // the runtime passes the declared prop default, so the declared default must be off too
  ['"showDraftMarkers":{"editor":"boolean","default":true', '"showDraftMarkers":{"editor":"boolean","default":false'],
];
const CLICK = /please <a href="#"([^>]*)>Click Here<\/a> <span[^>]*>\[TO CONFIRM: link target\]<\/span>/g;
const CAPTIONS = /\s*<p[^>]*>Kerala, in India Palakkad, in Kerala The hospital, in Palakkad A plan of the grounds, numbering reception, the Ayurvedic hospital, the yoga centre, the herbal garden and the villas\.<\/p>/g;
const log = [], pending = []; let bad = 0;
for (const v of ["desktop", "mobile"]) {
  const file = `public/ahv/views/ahv-page-defence-and-paramilitary-forces-${v}.json`;
  const raw = fs.readFileSync(file, "utf8"); const view = JSON.parse(raw); let n = 0;
  for (const key of ["template", "logic", "props"]) {
    let s = view[key];
    for (const [from, to] of R) { const c = s.split(from).length - 1; if (c) { s = s.split(from).join(to); n += c; } }
    const k = (s.match(CLICK) || []).length; if (k) { s = s.replace(CLICK, (_, attrs) => `please <a href="https://ayurvedichealingvillage.com/all-programs/"${attrs}>see all programmes</a>`); n += k; }
    const m = (s.match(CAPTIONS) || []).length; if (m) { s = s.replace(CAPTIONS, ""); n += m; }
    view[key] = s;
  }
  const left = (view.template.match(/TO CONFIRM|changeable and cancellable|Booking amount only|Army, Navy, Air force Citizens|Click Here/g) || []);
  if (left.length) { bad++; console.error(`FAIL ${v}: still present → ${[...new Set(left)].join(", ")}`); }
  if (n) { log.push(`${v}: ${n} replacement(s)`); pending.push([file, view, raw]); } else log.push(`${v}: already applied`);
}
if (bad) { console.error(`${bad} failure(s) — nothing written`); process.exit(1); }
// keep each file's own serialisation (these views are compact one-line JSON; others are 1-space indented)
const ser = (view, raw) => (raw.startsWith("{\n") ? JSON.stringify(view, null, 1) : JSON.stringify(view)) + (raw.endsWith("\n") ? "\n" : "");
if (!CHECK) for (const [file, view, raw] of pending) fs.writeFileSync(file, ser(view, raw));
console.log((CHECK ? "[check] " : "") + log.join("\n"));
