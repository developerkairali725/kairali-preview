// Train J batch 1 (15 Oct 2026; AHV-M016.01). Owner decision DEC-BAOLI (Sentinel_15817ab250f88191b26a3bdc9959d262):
// keep the inactive Baoli tie-up as an archive/contact page and take it out of active-offer navigation. Its record
// breadcrumb (which the site tree, the section rail/header and the 12 locale captures follow) moves from Offers to
// the archive hub: Home / Past retreats & events / The Baoli Advert Box Deal (labels already frozen units with 12
// translations). Its body (title, email and phone contact reference) is unchanged; no term, discount or validity.
// /the-baoli-special-deal/ is not edited: it is now a 301 to this page (AHV-M016.02, redirect-map.json).
//   node tools/repair-baoli-archive-train-j1-20261015.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
const A = "https://ayurvedichealingvillage.com";
export const ROUTE = "/the-baoli-advert-box-deal/";
export const DATA = "public/ahv/assets/commercial-family-data.js";
export const CRUMBS = [
  { path: "/", label: "Home" },
  { path: "/archive/", label: "Past retreats & events" },
  { path: "/the-baoli-advert-box-deal/", label: "The Baoli Advert Box Deal" },
];
export function applyData(D) {
  const r = D.routes.find((x) => x.path === ROUTE);
  if (!r) throw new Error("missing " + ROUTE);
  r.crumbs = CRUMBS.map((c) => ({ ...c }));
  r.breadcrumbSchemaExpected = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: CRUMBS.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: A + c.path })) };
  return D;
}
// The rail/header data follows the record's archive parent (section offers -> news, Past retreats & events), and the
// retired twin /the-baoli-special-deal/ (now a 301, no longer in the site tree) leaves the rail and family header, as
// every other protection-map source does. Edited in place: the generated audit copy and runtime data otherwise match
// tools/build-section-nav.mjs's last accepted run, which a full re-run would not reproduce byte for byte.
export const NAV_DATA = "public/design/section-nav.data.js", NAV_AUDIT = "english-candidate/section-nav.json";
export const RETIRED = "/the-baoli-special-deal/";
export function applyNav(N) {
  for (const k of ["routes", "family"]) { if (N[k][ROUTE]) N[k][ROUTE].section = "news"; delete N[k][RETIRED]; }
  return N;
}
const NAV_PRE = "window.AHV_SECTION_NAV = ";
export function applyNavData(text) {
  const lines = text.split("\n");
  const i = lines.findIndex((l) => l.startsWith(NAV_PRE));
  const body = lines[i].slice(NAV_PRE.length, -1), N = JSON.parse(body);
  if (JSON.stringify(N) !== body) throw new Error(NAV_DATA + ": does not round-trip");
  lines[i] = NAV_PRE + JSON.stringify(applyNav(N)) + ";";
  return lines.join("\n");
}
export function applyNavAudit(N) { return applyNav(N); }
// The English snapshot's rebuilt breadcrumb (data-ahv-crumbs) names the same parent.
export const SNAPSHOT = "english-candidate/prerender/the-baoli-advert-box-deal.html";
export const CRUMB_BEFORE = 'href="/offers/" style="display: inline-flex; align-items: center; min-height: 44px; font-size: 15.5px !important;" data-ahv-floored="15">Offers</a>';
export const CRUMB_AFTER = 'href="/archive/" style="display: inline-flex; align-items: center; min-height: 44px; font-size: 15.5px !important;" data-ahv-floored="15">Past retreats &amp; events</a>';
export function applySnapshot(html) {
  if (html.includes(CRUMB_AFTER)) return html;
  if (html.split(CRUMB_BEFORE).length !== 2) throw new Error(SNAPSHOT + ": breadcrumb parent not found exactly once");
  return html.replace(CRUMB_BEFORE, CRUMB_AFTER);
}
if (process.argv[1]?.endsWith("repair-baoli-archive-train-j1-20261015.mjs")) {
  const sh = fs.readFileSync(SNAPSHOT, "utf8"), shNext = applySnapshot(sh);
  if (!CHECK) fs.writeFileSync(SNAPSHOT, shNext);
  if (shNext !== sh) { console.log((CHECK ? "[check] " : "") + "snapshot breadcrumb changed"); if (CHECK) process.exitCode = 1; }
  const nd = fs.readFileSync(NAV_DATA, "utf8"), na = fs.readFileSync(NAV_AUDIT, "utf8");
  const ndNext = applyNavData(nd), naNext = JSON.stringify(applyNavAudit(JSON.parse(na)), null, 1) + "\n";
  if (JSON.stringify(JSON.parse(na), null, 1) + "\n" !== na) throw new Error(NAV_AUDIT + ": does not round-trip");
  if (!CHECK) { fs.writeFileSync(NAV_DATA, ndNext); fs.writeFileSync(NAV_AUDIT, naNext); }
  if (ndNext !== nd || naNext !== na) { console.log((CHECK ? "[check] " : "") + "rail/header data changed"); if (CHECK) process.exitCode = 1; }
  const s = fs.readFileSync(DATA, "utf8");
  const i = s.indexOf("{"), j = s.lastIndexOf("}");
  const pre = s.slice(0, i), post = s.slice(j + 1), D = JSON.parse(s.slice(i, j + 1));
  if (pre + JSON.stringify(D) + post !== s) throw new Error(DATA + ": dataset does not round-trip");
  const next = pre + JSON.stringify(applyData(D)) + post;
  if (!CHECK && next !== s) fs.writeFileSync(DATA, next);
  console.log((CHECK ? "[check] " : "") + (next !== s ? "1 file changed: " + DATA : "0 files changed"));
  if (CHECK && next !== s) process.exitCode = 1;
}
