// PRODUCTS-IMAGE-NAV (owner, 28 Sep 2026; parent LEGACY-NAV-ROOT-CAUSE.md): 19 article-reader routes still render the
// captured WordPress family sidebar ("Knowledge Center", "About Us", "Things To Do") as an UNLABELLED <nav> in the
// body — family-header.css only hides nav[data-ahv-section-nav], so these escaped the EF-04 takeover and showed on
// desktop AND mobile, duplicating the approved family header. Destinations checked before retiring: all 318 links
// resolve to pages already in the site tree (the family header's source); the one mismatch is a typo in the captured
// data (…-orayurvedic-retreat/) whose correct page is in the tree. Kept: /chef-retreat-food-to-wellness/'s
// "Explore current programmes" (points past-event visitors onward; not a family duplicate). The captured nav is kept
// as provenance under a non-display key. Idempotent; byte-exact round trip.
//   node tools/repair-retire-legacy-family-nav-20260928.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
const FILE = "public/ahv/assets/article-family-data.js";
const KEEP = new Set(["/chef-retreat-food-to-wellness/", "/training-course-fees/"]); // training-course-fees renders a different template: its nav never showed
const py = (v) => Array.isArray(v) ? "[" + v.map(py).join(", ") + "]" : v && typeof v === "object" ? "{" + Object.entries(v).map(([k, x]) => JSON.stringify(k) + ": " + py(x)).join(", ") + "}" : JSON.stringify(v);
const s = fs.readFileSync(FILE, "utf8"); const i = s.indexOf("{"), j = s.lastIndexOf("}");
const pre = s.slice(0, i), post = s.slice(j + 1); const D = JSON.parse(s.slice(i, j + 1));
if (pre + py(D) + post !== s) throw new Error("dataset does not round-trip");
const done = [];
for (const r of D.routes) {
  if (KEEP.has(r.path) || !r.nav || typeof r.nav !== "object" || !(r.nav.groups || r.nav.items)) continue;
  r.retiredFamilyNavPrivate = r.nav; // provenance only (key ends in Private: never rendered, never extracted)
  r.retiredFamilyNavNote = "Captured WordPress family sidebar retired 28 Sep 2026 (PRODUCTS-IMAGE-NAV): every destination is in the family header.";
  delete r.nav; done.push(r.path);
}
if (!CHECK && done.length) fs.writeFileSync(FILE, pre + py(D) + post);
console.log((CHECK ? "[check] " : "") + `${done.length} legacy family nav(s) retired` + (done.length ? ": " + done.join(" ") : ""));
