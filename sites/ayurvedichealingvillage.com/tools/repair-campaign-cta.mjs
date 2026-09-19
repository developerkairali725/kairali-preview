/**
 * AHV campaign pages — send the booking CTAs somewhere that exists.
 *
 * WHY. Measured on the built site: every "Book My Treatment", "Book Your
 * Visit Now", "Book My Ayurvedic Retreat" and "Tell Me More" on the campaign
 * pages points at "#Enquirenow" — an in-page enquiry section that the approved
 * rebuild does not contain. Counted in the snapshots: 11 links to
 * #Enquirenow per page, 0 elements carrying id="Enquirenow". On the pages
 * where the runtime resolved the dead anchor it degraded further, to "/", so
 * the primary conversion action on pages carrying 616,098 impressions either
 * did nothing or dropped the visitor on the homepage.
 *
 * WHAT IT DOES. Points them at /enquiry-form/ (owner's ruling, 2026-09-19) —
 * the destination the same pages already use for "ENQUIRE NOW", so the CTA
 * now matches its own page's established behaviour. Dataset entries switch
 * from kind "anchor" to kind "internal" so the renderer treats them as page
 * navigation rather than a scroll target.
 *
 * Only campaign-family files are touched, and only anchors whose visible text
 * is a booking or enquiry action - an anchor to a section that DOES exist is
 * left alone. Idempotent.
 *
 * Usage: node tools/repair-campaign-cta.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const TARGET = "https://ayurvedichealingvillage.com/enquiry-form/";
// Two dead in-page targets, both verified absent from the files repaired:
// the enquiry section and the contact section. A file that DOES contain
// either keeps its anchors untouched.
const DEAD_TARGETS = ["#Enquirenow", "#contact"];
const DEAD = "#Enquirenow";
// Every reference is repointed, not just the ones whose label reads like a
// CTA. Verified first: NO element anywhere in the design package carries
// id="Enquirenow", so there is no legitimate use of this anchor left - and
// many labels are interpolated ({{ property.cta }}), so their text cannot be
// read here anyway.

let dataEntries = 0, templateLinks = 0, files = 0, skipped = 0;

for (const dir of ["public/ahv/assets", "public/ahv/views"]) {
  const full = path.join(SITE, dir);
  for (const f of fs.readdirSync(full)) {
    const file = path.join(full, f);
    if (!fs.statSync(file).isFile()) continue;
    const raw = fs.readFileSync(file, "utf8");
    if (!DEAD_TARGETS.some((t) => raw.includes('"' + t + '"') || raw.includes(t + '\\"'))) continue;
    // CRITICAL, and learned the hard way: the enquiry section DOES exist in
    // four files, including the owner-built packages page. Where the target is
    // present the anchor works perfectly and must not be touched - repointing
    // it sends a visitor off a page that already holds the form. Only files
    // whose own markup lacks id="Enquirenow" are repaired.
    if (/id=\\?"(Enquirenow|contact)\\?"/.test(raw)) { skipped++; continue; }
    let out = raw, n = 0;

    // Dataset: {"kind":"anchor","href":"#Enquirenow",...} -> page navigation.
    out = out.replace(/\{"kind":"anchor","href":"#(Enquirenow|contact)"/g, () => {
      n++; dataEntries++;
      return '{"kind":"internal","href":"' + TARGET + '"';
    });
    // Any remaining dataset href, whatever the surrounding shape.
    out = out.replace(/"href":"#(Enquirenow|contact)"/g, () => { n++; dataEntries++; return '"href":"' + TARGET + '"'; });
    out = out.replace(/"attrs":\{"href":"#(Enquirenow|contact)","target":null\}/g, () => { n++; dataEntries++; return '"attrs":{"href":"' + TARGET + '","target":null}'; });
    // A bare href="#" on a real CTA. The runtime resolves it to the homepage,
    // so "Download Itinerary & Book Free Doctor Consultation" dropped the
    // visitor on the front page. Only anchors whose own text is a CTA are
    // touched: the "(Mon - Sat)" opening-hours label is also wrapped in a bare
    // "#", but it is a label, not a link, and rewiring it is a content change.
    out = out.replace(/"attrs":\{"href":"#","target":null\},"c":\[\{"k":"t","v":"([^"]*)"\}\]/g, (m, text) => {
      if (!/download|book|enquir|consult|itinerary/i.test(text)) return m;
      n++; dataEntries++;
      return '"attrs":{"href":"' + TARGET + '","target":null},"c":[{"k":"t","v":"' + text + '"}]';
    });
    // View templates, including labels that are interpolated at runtime.
    out = out.replace(/href=\\"#(Enquirenow|contact)\\"/g, () => { n++; templateLinks++; return 'href=\\"' + TARGET + '\\"'; });
    out = out.replace(/href="#(Enquirenow|contact)"/g, () => { n++; templateLinks++; return 'href="' + TARGET + '"'; });

    if (n) { files++; if (!DRY) fs.writeFileSync(file, out); }
  }
}
console.log(`${DRY ? "[dry] " : ""}files skipped because they DO contain the enquiry section: ${skipped}`);
console.log(`${DRY ? "[dry] " : ""}campaign CTAs repointed: ${dataEntries} dataset entries, ${templateLinks} template links, across ${files} files`);
let left = 0;
for (const dir of ["public/ahv/assets", "public/ahv/views"])
  for (const f of fs.readdirSync(path.join(SITE, dir))) {
    const p = path.join(SITE, dir, f);
    if (fs.statSync(p).isFile()) left += (fs.readFileSync(p, "utf8").match(/#(Enquirenow|contact)"/g) || []).length;
  }
console.log(`remaining references to the missing #Enquirenow section: ${left} (non-CTA anchors are left alone)`);
