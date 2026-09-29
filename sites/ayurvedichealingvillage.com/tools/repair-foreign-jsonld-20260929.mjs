// SEO-D22 / D-11 (29 Sep 2026): a view may not ship a design-supplied JSON-LD graph that describes ANOTHER page.
//
// The five course pages are generated from the training hub pair (tools/build-course-views.mjs) and the five finder
// hubs from the /ayurvedic-treatments/ benchmark (tools/build-finder-views.mjs). Both generators rewrite the visible head
// (title, description, canonical, og:url) but copy the source page's <script type="application/ld+json"> verbatim, so
// e.g. /one-day-ayurveda-workshop-program-kerala/ declared a WebPage + FAQPage whose @id is the retired
// /ayurveda-training-programs/ (a 301) with the hub's name, description and FAQs — none of which that page renders —
// and /training-programs/ declared itself to be /ayurvedic-treatments/. The server graph (schema.ts routeSchema) already
// gives every one of these routes its own WebPage, BreadcrumbList, WebSite and Organization, so the foreign graph is
// removed rather than rewritten: nothing is invented, and FAQ markup stays only where the FAQs are visible.
//
// Rule, per view: drop a design JSON-LD block when it carries a page-level node (WebPage, FAQPage, CollectionPage, …)
// whose @id / url names an ayurvedichealingvillage.com page that is NOT the canonical of ANY route mounting the view.
// Blocks describing the view's own page are untouched. Idempotent.
//   node tools/repair-foreign-jsonld-20260929.mjs [--check]        (--check: exit 1 if anything would change)
// Run order: after build-course-views / build-finder-views (either regenerates the foreign graph from its source).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://ayurvedichealingvillage.com";
const PAGE_TYPES = new Set(["WebPage", "FAQPage", "CollectionPage", "AboutPage", "ContactPage", "ItemPage", "MedicalWebPage", "ProfilePage", "SearchResultsPage", "QAPage", "CheckoutPage"]);
const BLOCK = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>\n?/g;

const pageOf = (id) => (typeof id === "string" && id.startsWith(ORIGIN) ? id.split("#")[0] : null);
const types = (n) => (Array.isArray(n["@type"]) ? n["@type"] : [n["@type"]]);

/** @returns {string[]} the foreign page URLs a JSON-LD block describes (empty = keep the block) */
export function foreignPages(json, ownCanonicals) {
  let g;
  try { g = JSON.parse(json); } catch { return []; } // unparsable blocks are reported by tests, never silently dropped here
  const nodes = Array.isArray(g) ? g : Array.isArray(g["@graph"]) ? g["@graph"] : [g];
  const out = new Set();
  for (const n of nodes) {
    if (!n || typeof n !== "object" || !types(n).some((t) => PAGE_TYPES.has(t))) continue;
    for (const p of [pageOf(n["@id"]), pageOf(n.url)]) if (p && !ownCanonicals.has(p)) out.add(p);
  }
  return [...out];
}

export function viewRoutes() {
  const manifest = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/route-manifest.json"), "utf8")).routes;
  const redirected = new Set(Object.keys(JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/redirect-map.json"), "utf8")).redirects));
  const byView = new Map();
  for (const r of manifest) {
    if (redirected.has(r.path)) continue;
    const own = r.metadata?.canonical || ORIGIN + r.path;
    for (const v of [r.desktopView, r.mobileView]) if (v) {
      if (!byView.has(v)) byView.set(v, { routes: [], canonicals: new Set() });
      byView.get(v).routes.push(r.path);
      byView.get(v).canonicals.add(own.split("#")[0]);
    }
  }
  return byView;
}

function main(argv) {
  const check = argv.includes("--check");
  const log = [];
  for (const [view, { routes, canonicals }] of viewRoutes()) {
    const file = path.join(SITE, "public/ahv/views", view + ".json");
    if (!fs.existsSync(file)) continue;
    const raw = fs.readFileSync(file, "utf8");
    const d = JSON.parse(raw);
    let dropped = [];
    const t = d.template.replace(BLOCK, (whole, json) => {
      const foreign = foreignPages(json, canonicals);
      if (!foreign.length) return whole;
      dropped.push(foreign.join(", "));
      return "";
    });
    if (!dropped.length) continue;
    log.push(`${view} (${routes.join(", ")}): removed JSON-LD describing ${dropped.join(" | ")}`);
    if (!check) {
      d.template = t;
      const indent = (raw.match(/^\{\n( +)"/) || [, " "])[1].length;
      fs.writeFileSync(file, JSON.stringify(d, null, indent) + (raw.endsWith("\n") ? "\n" : ""));
    }
  }
  console.log(log.length ? log.join("\n") : "no foreign page graphs — nothing to do");
  if (check && log.length) return 1;
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
