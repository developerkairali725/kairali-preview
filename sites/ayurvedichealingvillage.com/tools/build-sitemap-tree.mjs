/**
 * AHV English candidate — sitemap tree builder.
 *
 * Emits english-candidate/sitemap-tree.json: every approved English route,
 * NUMBERED once and stably, grouped into a reviewable tree so the owner can
 * refer to a page by its number ("fix 148") instead of pasting a URL.
 *
 * WHAT IS FACT AND WHAT IS DERIVED — the distinction matters, because a
 * reference view that quietly mixes the two is how invented structure gets
 * treated as approved structure (HARD GATE 6):
 *
 *   FACT, read straight from the approved package and the owner's overrides:
 *     · path, title, description        — english-candidate/route-manifest.json
 *     · desktopView / mobileView        — the template pair the route mounts
 *     · dataset                         — the record source, when it has one
 *     · sitemapExclude, duplicateOf     — english-candidate/route-overrides.json
 *                                         (owner rulings, page by page)
 *     · canonical                       — override first, then manifest
 *     · nav placement                   — parsed out of the approved chrome
 *                                         components' own hrefs
 *
 *   DERIVED, this file's own opinion, flagged as such in the output and in the
 *   rendered view:
 *     · section                         — the ordered RULES table below
 *
 * Numbering is assigned over routes sorted by path, so it is stable across
 * runs: adding a route renumbers everything after it, which is why the output
 * carries `generated` and the tree is regenerated rather than hand-edited.
 *
 * Run order: after repair-route-manifest (it reads the repaired manifest).
 *   node tools/build-sitemap-tree.mjs
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = join(HERE, "..");
const CAND = join(SITE, "english-candidate");
const ORIGIN = "https://ayurvedichealingvillage.com";

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));

/**
 * Ordered classification rules. FIRST match wins, so the specific rules sit
 * above the general ones. `view` matches the desktop template exactly; `paths`
 * matches an exact route path; `test` is a predicate on the path.
 *
 * Template-keyed rules are the strong ones — a route's template is a fact of
 * the approved design. Path-keyed rules only ever fire for routes the shared
 * article reader serves, where the template says nothing about the subject.
 */
const RULES = [
  { id: "home", title: "Home", why: "The site root.", paths: ["/"] },

  { id: "enquiry", title: "Enquiry & application forms", why: "Routes mounting the approved enquiry template.", view: "ahv-page-enquiry-desktop" },
  { id: "confirmation", title: "Confirmations & transactional", why: "Routes mounting the approved confirmation template.", view: "ahv-page-confirmation-desktop" },
  { id: "policy", title: "Policies & legal", why: "Routes mounting the approved policy-reader template.", view: "ahv-page-policy-reader-desktop" },
  { id: "gallery", title: "Galleries", why: "Routes mounting the approved gallery template, plus the two article-reader gallery indexes.", test: (p, v) => v === "ahv-page-ayurveda-gallery-desktop" || p === "/gallery/" || p === "/video-gallery/" },
  { id: "attractions", title: "Attractions by distance", why: "Routes mounting the approved attractions template.", view: "ahv-page-attractions-desktop" },
  { id: "campaign", title: "Campaign & offer landing pages", why: "Routes mounting the two approved campaign templates, plus /offers/*.", test: (p, v) => v === "ahv-page-campaign-nine-desktop" || v === "ahv-page-campaign-retreat-desktop" || p.startsWith("/offers/") },

  { id: "treatment", title: "Treatments & Panchakarma", why: "Clinical treatment pages and the Panchakarma explainers.", test: (p) => /treatment|panchakarma|panchkarma|cancer|weight-management|therapy-individual|back-to-roots|eye-care|de-addiction|rehabilitation|immunity|sleep-restoration|hormonal|revitalizing|rejuvenation/.test(p) },
  { id: "programme", title: "Programmes, packages & finders", why: "Programme finders, package pages and the all-programmes hub.", test: (p) => /package|program|all-programs|retreats-for-everyone|retreat/.test(p) },
  { id: "training", title: "Yoga, meditation & training", why: "Yoga, meditation and the Ayurveda training school.", test: (p) => /yoga|meditation|training|course|workshop|internship/.test(p) },
  { id: "stay", title: "Stay, villas & facilities", why: "Accommodation and on-property facilities.", test: (p) => /villa|facilit|accommodation|virtual-tour|suite/.test(p) },
  { id: "food", title: "Food, farm & sustainability", why: "Cuisine, the organic farm and the property's no-* commitments.", test: (p) => /cuisine|food|vegetarian|cooking|no-caffeine|no-preservatives|no-refridgeration|no-smoking|alcohol-free|organic-farm|animal-husbandry|herbal-tea|chef/.test(p) },
  { id: "area", title: "Kerala, Palakkad & things to do", why: "Off-property sightseeing and the surrounding area.", test: (p) => /things-to-do|visit-kerala|sightseeing|sight-seeing|safari|tour|nature-walk|wildlife|destination-palakkad|festivals|cultural-events|attractions/.test(p) },
  { id: "products", title: "Products, group companies & business", why: "KAPPL products, group companies, franchise and consultancy.", test: (p) => /product|medicine|franchise|consultancy|equipment|kair-by-kairali|organics|hospitality|arogya|villa-raag|centre|center|group|institute|books|booklet/.test(p) },
  { id: "about", title: "About, credentials & responsibility", why: "Who Kairali is, its awards, accreditations and commitments.", test: (p) => /about|our-story|brief-on-kairali|founder|vision-and-mission|accolade|award|accreditation|social-|responsib|partner|experience|feedback|defence-and-paramilitary/.test(p) },
  { id: "contact", title: "Contact & how to reach", why: "Contact details, directions and the property map.", test: (p) => /contact|how-to-reach|^\/map\/$|enquiry/.test(p) },
  { id: "careers", title: "Careers", why: "Jobs and applications.", test: (p) => /career|jobs|apply-now|postulez/.test(p) },
  { id: "learn", title: "Ayurveda & yoga explainers", why: "Editorial explainers for visitors new to the subject.", test: (p) => /ayurveda|ayurvedic|learn|new-to|what-is|why-get|why-pick|knowledge/.test(p) },
  { id: "utility", title: "Utility, archive & test pages", why: "Housekeeping routes: search, archive, sitemap, and pages left over from the legacy site.", test: (p) => /sitemap|search-results|archive|test|my-account|gift|links|faqs|downloads|offers|deal|advert/.test(p) },
];

function classify(path, view) {
  for (const r of RULES) {
    if (r.paths?.includes(path)) return r;
    if (r.view && view === r.view) return r;
    if (r.test && r.test(path, view)) return r;
  }
  return null;
}

/** Pull the site's own internal link paths out of an approved chrome component. */
function navPaths(componentFile) {
  const html = readFileSync(join(SITE, "public/ahv/components", componentFile), "utf8");
  const out = [];
  for (const m of html.matchAll(/href=["']([^"']+)["']/g)) {
    const href = m[1];
    if (!href.startsWith(`${ORIGIN}/`)) continue;
    const path = href.slice(ORIGIN.length);
    if (!out.includes(path)) out.push(path);
  }
  return out;
}

/**
 * Design-audit coverage, read from the committed evidence rather than assumed.
 * The evidence file keys templates WITHOUT the -desktop suffix, and one key
 * carries an appended note, so the match is prefix-based on purpose: an exact
 * compare silently reported all 74 templates unaudited.
 */
function auditedTemplates() {
  const file = join(SITE, "../../launches/ayurvedichealingvillage.com/design-audit/2026-09-16-template-audit-partial.json");
  const keys = readJson(file).perTemplate.map((x) => String(x.template));
  return (view) => {
    const v = String(view ?? "").replace(/-desktop$/, "");
    return keys.some((k) => k === v || k.startsWith(`${v} `) || k.replace(/-desktop$/, "") === v);
  };
}
const isAudited = auditedTemplates();

/**
 * The owner's twelve 301s (english-candidate/redirect-map.json, 5ba80574).
 * Every one of their sources IS one of the 252 active routes, so at the DNS
 * flip those routes stop being pages and become redirects. A register that
 * still lists them as live pages would be wrong the day it matters most.
 */
function redirects() {
  const file = join(CAND, "redirect-map.json");
  if (!existsSync(file)) return {};
  const { redirects: r = {}, statusCode = 301 } = readJson(file);
  const out = {};
  for (const [from, v] of Object.entries(r)) {
    out[from] = { to: typeof v === "string" ? v : v.to, reason: typeof v === "string" ? null : v.reason ?? null, statusCode };
  }
  return out;
}
const REDIRECTS = redirects();

const manifest = readJson(join(CAND, "route-manifest.json"));
const overrides = readJson(join(CAND, "route-overrides.json")).routes;

const header = navPaths("AHV Chrome Header.dc.html");
const footer = navPaths("AHV Chrome Footer.dc.html");

const sorted = [...manifest.routes].sort((a, b) => a.path.localeCompare(b.path));

const routes = sorted.map((r, i) => {
  const o = overrides[r.path] ?? {};
  const meta = { ...r.metadata, ...(o.metadata ?? {}) };
  const canonical = meta.canonical ?? null;
  const own = `${ORIGIN}${r.path}`;
  const rule = classify(r.path, o.desktopView ?? r.desktopView);
  return {
    n: i + 1,
    path: r.path,
    title: meta.title ?? null,
    description: meta.description ?? null,
    desktopView: o.desktopView ?? r.desktopView ?? null,
    mobileView: o.mobileView ?? r.mobileView ?? null,
    dataset: o.dataset ?? r.dataset ?? null,
    sitemap: !o.sitemapExclude,
    duplicateOf: o.duplicateOf ?? null,
    duplicateNote: o.duplicateNote ?? null,
    canonicalElsewhere:
      canonical != null && canonical.replace(/\/$/, "") !== own.replace(/\/$/, "") ? canonical : null,
    inHeaderNav: header.includes(r.path),
    inFooterNav: footer.includes(r.path),
    section: rule?.id ?? "unclassified",
    designAudited: isAudited(o.desktopView ?? r.desktopView),
    redirectsTo: REDIRECTS[r.path]?.to ?? null,
    redirectReason: REDIRECTS[r.path]?.reason ?? null,
  };
});

const known = new Set(routes.map((r) => r.path));
const sections = RULES.map((r) => ({ id: r.id, title: r.title, why: r.why }));
if (routes.some((r) => r.section === "unclassified")) {
  sections.push({ id: "unclassified", title: "Unclassified", why: "No rule matched — shown so nothing is silently dropped." });
}

const tree = {
  generated: new Date().toISOString(),
  source: "english-candidate/route-manifest.json + route-overrides.json + approved chrome components",
  note: "path/title/template/sitemap/canonical/nav are FACTS from the approved package and the owner's overrides. `section` is DERIVED by tools/build-sitemap-tree.mjs and carries no approval.",
  totals: {
    routes: routes.length,
    inSitemap: routes.filter((r) => r.sitemap).length,
    excludedFromSitemap: routes.filter((r) => !r.sitemap).length,
    canonicalElsewhere: routes.filter((r) => r.canonicalElsewhere).length,
    distinctDesktopViews: new Set(routes.map((r) => r.desktopView)).size,
    inHeaderNav: routes.filter((r) => r.inHeaderNav).length,
    inFooterNav: routes.filter((r) => r.inFooterNav).length,
    templatesNotDesignAudited: new Set(routes.filter((r) => !r.designAudited).map((r) => r.desktopView)).size,
    redirectedAtFlip: routes.filter((r) => r.redirectsTo).length,
  },
  // A chrome link that resolves to no approved route is a real defect, so it is
  // reported rather than quietly dropped from the tree.
  navLinksWithNoRoute: [...header, ...footer]
    .filter((p, i, a) => a.indexOf(p) === i && !known.has(p) && !p.includes("."))
    .sort(),
  sections,
  routes,
};

const out = join(CAND, "sitemap-tree.json");
writeFileSync(out, `${JSON.stringify(tree, null, 2)}\n`);

/**
 * BUILD-SETS.md — the answer to "which routes does this family's template
 * actually have to serve?"
 *
 * Written because the first design handover produced templates for routes that
 * 301 away at the DNS flip and for routes deliberately out of the sitemap. That
 * is not a design mistake, it is a briefing mistake: nothing told the designer
 * which of a family's routes are still pages. This file does, per family, and
 * it regenerates with the tree so it cannot drift.
 */
{
  const byTemplate = {};
  for (const r of routes) (byTemplate[(r.desktopView ?? "").replace(/-desktop$/, "")] ??= []).push(r);
  const shared = Object.entries(byTemplate)
    .filter(([, rs]) => rs.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  const lines = [
    "# Which routes each shared template must serve",
    "",
    `Generated by tools/build-sitemap-tree.mjs — ${tree.generated}. Do not hand-edit.`,
    "",
    "**BUILD FOR** is the live set: still a page after the DNS flip, and in the sitemap.",
    "**301 AT FLIP** stops being a page — do not design for it.",
    "**OUT OF SITEMAP** still serves but is deliberately unindexed (owner's page-by-page pass).",
    "",
  ];
  for (const [tpl, rs] of shared) {
    const build = rs.filter((r) => !r.redirectsTo && r.sitemap);
    const gone = rs.filter((r) => r.redirectsTo);
    const noindex = rs.filter((r) => !r.redirectsTo && !r.sitemap);
    lines.push(`## ${tpl} — ${rs.length} routes, ${build.length} to design for`, "");
    lines.push(`**BUILD FOR (${build.length}):**`, "");
    for (const r of build) lines.push(`- \`#${r.n}\` ${r.path}`);
    if (gone.length) {
      lines.push("", `**301 AT FLIP (${gone.length}) — ignore:**`, "");
      for (const r of gone) lines.push(`- ${r.path} → ${r.redirectsTo}`);
    }
    if (noindex.length) {
      lines.push("", `**OUT OF SITEMAP (${noindex.length}) — serves, unindexed:**`, "");
      for (const r of noindex) lines.push(`- ${r.path}`);
    }
    lines.push("");
  }
  const bsOut = join(SITE, "../../launches/ayurvedichealingvillage.com/design-intake/BUILD-SETS.md");
  writeFileSync(bsOut, `${lines.join("\n")}\n`);
  console.log(`  build-sets: ${shared.length} shared templates -> design-intake/BUILD-SETS.md`);
}

const counts = sections.map((s) => [s.title, routes.filter((r) => r.section === s.id).length]);
console.log(`sitemap-tree: ${routes.length} routes -> ${out}`);
console.log(`  in sitemap ${tree.totals.inSitemap} · excluded ${tree.totals.excludedFromSitemap} · templates ${tree.totals.distinctDesktopViews}`);
for (const [t, n] of counts) console.log(`  ${String(n).padStart(4)}  ${t}`);
if (tree.navLinksWithNoRoute.length) {
  console.log(`  NAV LINKS WITH NO APPROVED ROUTE (${tree.navLinksWithNoRoute.length}):`);
  for (const p of tree.navLinksWithNoRoute) console.log(`        ${p}`);
}
