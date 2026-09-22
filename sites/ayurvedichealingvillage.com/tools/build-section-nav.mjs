#!/usr/bin/env node
/**
 * AHV — ONE section navigation for every content family (owner, 23 Sep 2026:
 * "why not all families have the same navigation … knowledge center, about us,
 * things to do, attractions all families share the same left side navigation").
 *
 * WHAT WAS WRONG. The WordPress capture carried whatever sidebar widget each
 * page happened to have, so /live-to-100-with-panchkarma/ (Knowledge Centre)
 * printed the Things-To-Do menu, /yoga-retreats-for-everyone/ printed the
 * Knowledge Center menu inline as body text, /things-to-do/ itself had no menu
 * at all, and the Claude-Design article family folded its groups behind toggle
 * buttons whose headings ("Attractions") were not links. Four shapes, none of
 * them the page's own section.
 *
 * WHAT THIS BUILDS. english-candidate/section-nav.json + the browser copy
 * public/design/section-nav.data.js — for every route in scope: which SECTION
 * it belongs to and that section's page tree. NOTHING is typed by hand: the
 * section is crumbs[1] of the route's OWNER-AUTHORISED breadcrumb (the dataset
 * record's `crumbs`/`breadcrumb`, or the view's own breadcrumb nav for the
 * view-owned routes), the tree is the union of those breadcrumbs, labels are
 * the breadcrumbs' concise labels. The rail therefore says exactly what the
 * breadcrumb says, one level wider.
 *
 * Also recorded per route: which legacy menu to REMOVE — the source pointer
 * prefix of the captured sidebar (context-menu components render their menu
 * under `<ptr>/c/1`, the article under `<ptr>/c/3`, measured on every
 * collection/commercial record), so public/design/section-nav.js can drop
 * exactly those elements and nothing else.
 *
 * SCOPE (the sections that get the rail) and the families kept out of it are
 * the two explicit lists below. A locked package page (D-20260921-14) is never
 * listed below depth 1 — the finders do that job — and never receives the rail.
 *
 * Idempotent, re-runnable after every import:  node tools/build-section-nav.mjs
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = path.join(SITE, "public/ahv/assets");
const VIEWS = path.join(SITE, "public/ahv/views");
const manifest = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/route-manifest.json"), "utf8"));
const lock = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/consistency-locked-families.json"), "utf8"));

/** Section hubs that carry the shared rail (crumbs[1].path of their pages). */
const RAIL_HUBS = new Set([
  "/about-us/", "/knowledge-centre/", "/things-to-do/", "/village-facilities/",
  "/training-programs/", "/gallery/", "/archive/", "/offers/", "/careers/",
  "/read-feedback/", "/all-programs/",
]);
/** Families that keep their own designed chrome (forms, campaigns, policies, galleries, packages). */
const EXCLUDE_FAMILIES = new Set([
  "enquiry", "confirmation", "policy-reader", "ahv-template-legal-policy",
  "campaign-nine", "campaign-retreat", "ahv-template-offers-deals-and-gift-vouchers",
  "sitemap", "faqs-and-downloads", "how-to-reach", "ahv-template-photo-collections",
  "ahv-template-past-retreat-record", "ahv-template-product-family", "ahv-template-course-and-fees",
  "no-preservatives", "defence-and-paramilitary-forces", "cancer-supportive-care", "supportive-care-cancer",
  "ayurveda-gallery", "past-retreats", "ananda-lahari-retreat", "ashtanga-retreat", "yala-2018-retreat",
  "ayuryoga", "back-to-roots", "lakshya-yoga", "mindfulness-retreat", "our-villas",
  "classic-villa", "deluxe-villa", "royal-villa", "maharaja-suite", "yoga-retreats",
]);
/** Locked families that are still LISTED in a tree (they are section hubs or courses, not package pages). */
function listable(family) {
  const reason = lock.families[family];
  if (!reason) return true;
  return /finder hub|course family/.test(reason);
}

function familyOf(route) {
  return (route.desktopView ?? route.mobileView ?? "").replace(/^ahv-page-/, "").replace(/-(desktop|mobile)$/, "");
}
function loadDataset(file) {
  const w = {};
  vm.runInNewContext(fs.readFileSync(file, "utf8"), { window: w, document: {}, location: {} }, { timeout: 5000 });
  return Object.values(w)[0];
}
function decode(s) {
  return String(s).replace(/&amp;/g, "&").replace(/&#8217;|&rsquo;/g, "’").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}
function relPath(p) {
  return String(p).replace(/^https?:\/\/(www\.)?ayurvedichealingvillage\.com/, "");
}

// ---- 1. breadcrumbs for every route -----------------------------------------
const crumbsByPath = new Map();     // path -> [{path,label}]
const removeByPath = new Map();     // path -> { navPrefixes:[], blockPrefixes:[] }
const recordsByPath = new Map();

for (const file of fs.readdirSync(ASSETS).filter((f) => /-data\.js$/.test(f))) {
  let D;
  try { D = loadDataset(path.join(ASSETS, file)); } catch { continue; }
  const recs = D && (D.routes || D.records);
  if (!Array.isArray(recs)) continue;
  for (const R of recs) {
    if (!R || !R.path) continue;
    const crumbs = Array.isArray(R.crumbs) ? R.crumbs : Array.isArray(R.breadcrumb) ? R.breadcrumb : null;
    if (crumbs && crumbs.length >= 2 && !crumbsByPath.has(R.path)) {
      crumbsByPath.set(R.path, crumbs.map((c) => ({ path: relPath(c.path), label: decode(c.label) })));
    }
    recordsByPath.set(R.path, { file, record: R });
    // the captured sidebar: a component whose name says so
    const navPrefixes = [], blockPrefixes = [];
    for (const c of R.components || []) {
      if (!/context|menu|navigation/i.test(c.component || "")) continue;
      if (/^context-?nav$/i.test(c.component) || /^travel-navigation$/i.test(c.component)) navPrefixes.push(c.ptr);
      else blockPrefixes.push(c.ptr + "/c/1");           // menu subtree; the article lives under /c/3
    }
    if (R.nav && Array.isArray(R.nav.groups)) navPrefixes.push("ctx-h");   // the article family's disclosure menu
    if (navPrefixes.length || blockPrefixes.length) removeByPath.set(R.path, { navPrefixes, blockPrefixes });
  }
}
// view-owned routes: the breadcrumb nav inside the desktop view
for (const r of manifest.routes) {
  if (crumbsByPath.has(r.path) || !r.desktopView) continue;
  const f = path.join(VIEWS, r.desktopView + ".json");
  if (!fs.existsSync(f)) continue;
  const T = JSON.parse(fs.readFileSync(f, "utf8")).template;
  const b = T.match(/<nav aria-label="Breadcrumb"[^>]*>([\s\S]*?)<\/nav>/);
  if (!b) continue;
  const links = [...b[1].matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map((x) => ({ path: relPath(x[1]), label: decode(x[2]) }));
  const cur = (b[1].match(/aria-current="page"[^>]*>([^<]+)</) || [])[1];
  // a templated breadcrumb ({{ c.url }}) belongs to a dataset route and was read above
  if (!links.length || !cur || links.some((l) => /\{\{/.test(l.path + l.label)) || /\{\{/.test(cur)) continue;
  crumbsByPath.set(r.path, [...links, { path: r.path, label: decode(cur) }]);
}
// the four attractions pages sit in Things to Do (their own breadcrumb says so)
for (const r of manifest.routes) {
  if (crumbsByPath.has(r.path)) continue;
  const rec = recordsByPath.get(r.path);
  if (rec && Array.isArray(rec.record.breadcrumb)) {
    crumbsByPath.set(r.path, rec.record.breadcrumb.map((c) => ({ path: relPath(c.path), label: decode(c.label) })));
  }
}

// ---- 2. sections and trees ---------------------------------------------------
const byPath = new Map(manifest.routes.map((r) => [r.path, r]));
const sections = {};
function section(hubPath, label) {
  if (!sections[hubPath]) sections[hubPath] = { label, hub: hubPath, nodes: {} };
  return sections[hubPath];
}
function node(sec, p, label, parent) {
  if (!sec.nodes[p]) sec.nodes[p] = { path: p, label, parent, isRoute: byPath.has(p), children: [] };
  else if (!sec.nodes[p].label) sec.nodes[p].label = label;
  return sec.nodes[p];
}
for (const crumbs of crumbsByPath.values()) {
  if (crumbs.length < 2 || crumbs[0].path !== "/") continue;
  const hub = crumbs[1];
  if (!RAIL_HUBS.has(hub.path)) continue;
  const sec = section(hub.path, hub.label);
  // every crumb after the hub becomes a node under its predecessor
  for (let i = 2; i < crumbs.length; i++) {
    const c = crumbs[i], parent = crumbs[i - 1].path === hub.path ? null : crumbs[i - 1].path;
    const route = byPath.get(c.path);
    if (route && !listable(familyOf(route))) continue;   // package pages: the finder lists them
    if (route && route.sitemapExclude) continue;          // canonicalised duplicates never appear twice
    if (c.path === hub.path) continue;                    // a hub does not list itself
    node(sec, c.path, c.label, parent);
  }
}
const ORDER = { "/": 0 };
manifest.routes.forEach((r, i) => { ORDER[r.path] = i + 1; });
for (const sec of Object.values(sections)) {
  const roots = [];
  for (const n of Object.values(sec.nodes)) {
    if (n.parent && sec.nodes[n.parent]) sec.nodes[n.parent].children.push(n);
    else roots.push(n);
  }
  const sortNodes = (arr) => { arr.sort((a, b) => (ORDER[a.path] ?? 9e6) - (ORDER[b.path] ?? 9e6) || a.label.localeCompare(b.label)); arr.forEach((n) => sortNodes(n.children)); };
  sortNodes(roots);
  const strip = (n) => ({ path: n.path, label: n.label, link: n.isRoute, children: n.children.map(strip) });
  sec.items = roots.map(strip);
  delete sec.nodes;
}

// ---- 3. per-route assignment --------------------------------------------------
const routes = {};
const skipped = [];
for (const r of manifest.routes) {
  const crumbs = crumbsByPath.get(r.path);
  const family = familyOf(r);
  if (!crumbs || crumbs.length < 2) continue;
  const isHub = crumbs.length === 2 && RAIL_HUBS.has(r.path);
  const sectionHub = isHub ? r.path : crumbs[1].path;
  if (!sections[sectionHub]) continue;
  if (EXCLUDE_FAMILIES.has(family) || (lock.families[family] && !/finder hub/.test(lock.families[family])) || /finder hub/.test(lock.families[family] || "")) {
    skipped.push(r.path + " (" + family + ")");
    continue;
  }
  routes[r.path] = {
    section: sectionHub,
    crumbs: crumbs.map((c) => c.path),
    remove: removeByPath.get(r.path) || null,
  };
}

const out = {
  generated: new Date().toISOString(),
  why: "One section rail for every content family. Sections and labels come from the owner-authorised breadcrumbs (dataset crumbs / view breadcrumb nav); nothing typed by hand. Built by tools/build-section-nav.mjs.",
  railHubs: [...RAIL_HUBS],
  excludedFamilies: [...EXCLUDE_FAMILIES],
  sections,
  routes,
  skipped,
};
fs.writeFileSync(path.join(SITE, "english-candidate/section-nav.json"), JSON.stringify(out, null, 1) + "\n");
const browser = { sections, routes };
fs.writeFileSync(path.join(SITE, "public/design/section-nav.data.js"),
  "/* generated by tools/build-section-nav.mjs — do not edit */\nwindow.AHV_SECTION_NAV = " + JSON.stringify(browser) + ";\n");

const counts = Object.fromEntries(Object.entries(sections).map(([k, s]) => [k, Object.values(routes).filter((r) => r.section === k).length + " routes / " + JSON.stringify(s.items).match(/"path"/g).length + " nodes"]));
console.log("section-nav: routes in scope", Object.keys(routes).length, "· skipped (designed/locked)", skipped.length);
console.log(counts);
