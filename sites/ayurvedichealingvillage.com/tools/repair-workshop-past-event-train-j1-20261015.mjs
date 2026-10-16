// Train J batch 1 (15 Oct 2026; AHV-M077.01). /ayurveda-workshop/ is a past event: it gets the existing past-retreat
// eyebrow ("Past Retreat", as on /chef-retreat-food-to-wellness/) and the existing undated historical notice
// ("Past retreat — preserved for historical reference. The event year has not been verified.", lakshya-recovered),
// both already frozen English units with 12 accepted translations; the workshop states no year, so none is added.
// Its data breadcrumb (which the 12 locale captures render) moves from Training Programs to the English site-tree
// parents: Past retreats & events (/archive/) / Past retreats (/archive-yoga-retreat/). The English snapshot
// already shows that trail (section-nav); it gains the eyebrow and notice as the first body section, exactly the
// markup training7-family-render.js now emits for any route with a statusLabel.
//   node tools/repair-workshop-past-event-train-j1-20261015.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
const A = "https://ayurvedichealingvillage.com";
export const ROUTE = "/ayurveda-workshop/";
export const STATUS = "Past Retreat";
export const NOTICE = "Past retreat — preserved for historical reference. The event year has not been verified.";
export const CRUMBS = [
  { label: "Home", path: "/" },
  { label: "Past retreats & events", path: "/archive/" },
  { label: "Past retreats", path: "/archive-yoga-retreat/" },
  { label: "Ayurveda Workshop", path: "/ayurveda-workshop/" },
];
export const DATA = "public/ahv/assets/training7-family-data.js";
export const SNAPSHOT = "english-candidate/prerender/ayurveda-workshop.html";
const STATUS_STYLE = "margin: 8px 0px 0px; display: inline-flex; align-items: center; min-height: 40px; padding: 0px 16px; border: 1px solid rgb(90, 68, 32); border-radius: 4px; font-family: Mulish, sans-serif; font-weight: 700; font-size: 14.5px; letter-spacing: 1.2px; text-transform: uppercase; color: rgb(90, 68, 32);";
const NOTICE_STYLE = "margin: 16px 0px 0px; padding: 14px 18px; background: rgb(244, 240, 228); border-left: 4px solid rgb(90, 68, 32); font-size: 16.5px; line-height: 1.7; max-width: 78ch; text-wrap: pretty; overflow-wrap: anywhere;";
export const SNAPSHOT_SECTION = `<section data-dc-tpl="202" data-source-component="past-event-notice" style="width: min(1220px, 94%); margin: 0px auto; padding: 14px 0px; min-width: 0px;"><p data-ahv-past-status="" style="${STATUS_STYLE}">${STATUS}</p><p data-ahv-past-notice="" role="note" style="${NOTICE_STYLE}">${NOTICE}</p></section>`;
export function applyData(D) {
  const r = D.routes.find((x) => x.path === ROUTE);
  if (!r) throw new Error("missing " + ROUTE);
  r.statusLabel = STATUS;
  r.historicalNotice = NOTICE;
  r.crumbs = CRUMBS.map((c) => ({ ...c }));
  r.breadcrumbSchemaExpected = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: CRUMBS.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: A + c.path })) };
  return D;
}
export function applySnapshot(html) {
  if (html.includes('data-source-component="past-event-notice"')) return html;
  const h1 = html.indexOf('id="r6c-h1"');
  const end = html.indexOf("</section>", h1);
  if (h1 < 0 || end < 0) throw new Error("snapshot header not found");
  const at = end + "</section>".length;
  return html.slice(0, at) + "\n\n      " + SNAPSHOT_SECTION + html.slice(at);
}
if (process.argv[1]?.endsWith("repair-workshop-past-event-train-j1-20261015.mjs")) {
  const s = fs.readFileSync(DATA, "utf8");
  const i = s.indexOf("{"), j = s.lastIndexOf("}");
  const pre = s.slice(0, i), post = s.slice(j + 1), D = JSON.parse(s.slice(i, j + 1));
  if (pre + JSON.stringify(D) + post !== s) throw new Error(DATA + ": dataset does not round-trip");
  const next = pre + JSON.stringify(applyData(D)) + post;
  const html = fs.readFileSync(SNAPSHOT, "utf8"), nextHtml = applySnapshot(html);
  const changed = [next !== s && DATA, nextHtml !== html && SNAPSHOT].filter(Boolean);
  if (!CHECK) { if (next !== s) fs.writeFileSync(DATA, next); if (nextHtml !== html) fs.writeFileSync(SNAPSHOT, nextHtml); }
  console.log((CHECK ? "[check] " : "") + `${changed.length} file(s) changed` + (changed.length ? ": " + changed.join(" ") : ""));
  if (CHECK && changed.length) process.exitCode = 1;
}
