#!/usr/bin/env node
/**
 * AHV — ONE site tree for the whole site (owner, 23 Sep 2026: "the sitemap and the
 * left-hand sidebar … consistent on all pages, not too many dead links … villa
 * directory is the parent and the villas under it … Air India is a tie-up, not a
 * campaign … the site should be easy for a human to navigate").
 *
 * Output: english-candidate/site-tree.json. It is the single source for BOTH
 *   · /sitemap/            (tools/build-sitemap-navigation.mjs renders the whole tree)
 *   · the left section rail (tools/build-section-nav.mjs renders the page's section)
 * so a page sits in the same place in both, by construction.
 *
 * RULES
 *   1. Every node is a page the site serves (no dead links). The only non-link
 *      nodes are the concern headings inside Ayurvedic Treatments and the two
 *      sections that have no hub page (campaign pages, policies).
 *   2. A parent is a real hub page: the page's owner-authorised breadcrumb says
 *      who its parent is (tools/lib/route-crumbs.mjs). Villas sit under Our Villas,
 *      attractions under Things to Do, articles under the Knowledge Centre, etc.
 *   3. Treatment packages sit under the Ayurvedic Treatments finder (their own
 *      breadcrumb), grouped by concern (Codex's grouping, kept); yoga-only
 *      programmes under Yoga & Meditation Programmes.
 *   4. Training is its own section (the header's "Yoga & Training"), not buried
 *      three levels down in All Programmes.
 *   5. Owner rulings: the Air India Maharaja Club page is a TIE-UP → About Kairali ›
 *      Our Partners. Test, old, junk and thank-you routes are never listed.
 *   6. Labels are the breadcrumb's concise labels (programmes: the register name);
 *      a KTAHV-locked word in a label is relabelled here (the lock).
 * Every indexable route appears exactly once (asserted; the build stops otherwise).
 *
 *   node tools/build-site-tree.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { routeCrumbs, loadDataset } from "./lib/route-crumbs.mjs";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/route-manifest.json"), "utf8"));
const campaignRoutes = JSON.parse(fs.readFileSync(path.join(SITE, "campaign-v110/routes.json"), "utf8"));
for (const p of campaignRoutes) if (!manifest.routes.some(r => r.path === p)) manifest.routes.push({ path:p, desktopView:'ahv-page-campaign-nine-desktop', metadata:{title:p.replace(/^\/lp\/|^\/offers\/|\/$/g,'').replaceAll('-',' ')} });
const redirected = new Set(Object.keys(JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/redirect-map.json"), "utf8")).redirects));
const byPath = new Map(manifest.routes.map((r) => [r.path, r]));
const { crumbs } = routeCrumbs(SITE, manifest);
const register = new Map(loadDataset(path.join(SITE, "public/ahv/assets/all-programs-data.js")).programmes.map((p) => [p.route, p]));

/** Not destinations: test, old, confirmation and utility routes (served, never listed). */
export const JUNK = /^\/(gift-test|test-page|test-page-2|testing|my-account|search-results|contact-us-old|enquiry-form-old|how-to-reach-old|online-consultation-old|thanks-old|cart|checkout|onlinebookingthankyou|onlineconsultation-thanks|contact-us\/thank-you|thanks|ppc-thanks|postulez-maintenant|ru|treatment-in-kerala-russian\.html)\/?$/;
/** Content-based decisions (every page read, architect + adversarial review, 23 Sep 2026):
 *  english-candidate/site-tree-overrides.json { moves, relabels, drops, sectionTitles }. */
const OVR_FILE = path.join(SITE, "english-candidate/site-tree-overrides.json");
const OVR = fs.existsSync(OVR_FILE) ? JSON.parse(fs.readFileSync(OVR_FILE, "utf8")) : { moves: [], relabels: [], drops: [], sectionTitles: [] };
const DROPPED = new Set((OVR.drops || []).map((d) => d.path));
const MOVED = new Map((OVR.moves || []).map((m) => [m.path, m]));
const indexable = manifest.routes.filter((r) => r.path !== "/" && !r.sitemapExclude && !manifest.deferred.includes(r.path) && !JUNK.test(r.path) && !DROPPED.has(r.path) && !redirected.has(r.path));
/** Unlisted (dropped) pages are still served: the rail still draws on them (else their old WordPress sidebar returns). */
const unlistedRoutes = manifest.routes.filter((r) => DROPPED.has(r.path) && !redirected.has(r.path));

/** Sections, in the order a visitor meets them (the header first). hub = the section's own page. */
const SECTIONS = [
  { id: "programmes", hub: "/all-programs/", title: "Treatments & programmes" },
  { id: "villas", hub: "/our-villas/", title: "Villas" },
  { id: "training", hub: "/yoga-meditation-training/", title: "Yoga & Training" },
  { id: "offers", hub: "/offers/", title: "Offers" },
  { id: "about", hub: "/about-us/", title: "About Kairali" },
  { id: "visit", hub: "/contact-us/", title: "Plan your visit & contact" },   // reviewers: booking, payment, FAQs must not sit 11th of 15
  { id: "reviews", hub: "/read-feedback/", title: "Patient reviews" },
  { id: "facilities", hub: "/village-facilities/", title: "Village facilities" },
  { id: "things", hub: "/things-to-do/", title: "Things to do" },
  { id: "knowledge", hub: "/knowledge-centre/", title: "Knowledge centre" },
  { id: "gallery", hub: "/gallery/", title: "Gallery" },
  { id: "news", hub: "/archive/", title: "News & past events" },
  { id: "careers", hub: "/careers/", title: "Careers" },
  { id: "campaigns", hub: null, title: "Campaign pages" },
  { id: "site", hub: null, title: "Policies & site information" },
];
for (const t of OVR.sectionTitles || []) { const sec = SECTIONS.find((x) => x.id === t.id); if (sec) sec.title = t.title; }
const sectionByHub = new Map(SECTIONS.filter((s) => s.hub).map((s) => [s.hub, s]));

/** Codex's concern grouping for treatment packages (kept — it reads well for a patient). */
const CONCERN = {
  "Rejuvenation & detoxification": ["/panchakarma-therapy/", "/holistic-treatment-for-rejuvenation-and-detoxification/", "/preventive-and-regenerative-treatment/", "/immunity-enhancement-executive-health-assessment-therapy/"],
  "Joints, back & spine": ["/treatment-for-arthritis-and-spondylitis/", "/treatment-for-chronic-back-pain/", "/treatment-for-slip-disc/", "/treatment-for-cervical-spondylosis/", "/treatment-for-spondylitis/"],
  "Metabolic, digestive & heart health": ["/weight-loss-programme/", "/treatment-for-diabetes/", "/treatment-for-hypertension/", "/digestive-wellness-gut-health-yoga-therapy/"],
  "Stress, sleep & headaches": ["/treatment-to-remove-stress-and-strain/", "/sleep-restoration-therapy/", "/treatment-for-sinusitis-and-migraine/", "/yoga-based-stress-energy-reset-program/"],
  "Nerves, paralysis & recovery": ["/treatment-for-paralysis/", "/treatment-for-facial-paralysis/", "/treatment-for-nervous-disability/", "/de-addiction-and-rehabilitation-from-alcohol-drugs-tobacco/"],
  "Skin & eyes": ["/treatment-for-psoriasis/", "/treatment-for-skin-diseases/", "/beauty-care-and-eye-care/"],
  "Breathing": ["/treatment-for-bronchial-diseases/"],
  "Women's health": ["/womens-hormonal-balance-endocrine-therapy/", "/post-pregnancy-health-programme/"],
  "Supportive cancer care": ["/revitalizing-and-strengthening/"],
};
// /personalized-customized-healing-program/ is for MORE THAN ONE condition (its own "who is this for"), so it heads the finder ungrouped
const concernOf = new Map(Object.entries(CONCERN).flatMap(([g, ps]) => ps.map((p) => [p, g])));

/** Explicit placements — each an owner ruling or a page whose breadcrumb is missing or points at itself. */
const PLACE = {
  "/kairali-air-india-maharaja-club.html": ["/about-us/", "/our-partners/"],   // owner: a tie-up, not a campaign
  "/accreditations/": ["/about-us/", "/awards-and-accreditations/"],
  "/faqs-downloads/": ["/contact-us/"],
  "/karkidaka-chikitsha-or-monsoon-wellness.html": ["/all-programs/"],
  "/ayurvedic-treatment-packages.html": ["/all-programs/"],
  "/emailsubscriber/": ["@site"],
  "/sitemap/": ["@site"],
};
const CAMPAIGN_FAMILIES = /^(campaign-nine|campaign-retreat|panchkarma-treatment)$/;
const familyOf = (r) => (r.desktopView ?? "").replace(/^ahv-(page|template)-/, "").replace(/-(desktop|mobile)$/, "");
/** Labels that carry a KTAHV-locked word, or read badly out of context. */
const LABEL = {
  "/read-feedback/": "Patient reviews", "/givefeedback/": "Share your feedback",
  "/kairali-air-india-maharaja-club.html": "Air India Maharaja Club (partnership)",
  "/karkidaka-chikitsha-or-monsoon-wellness.html": "Monsoon treatment — Karkidaka Chikitsa",
  "/ayurvedic-treatment-packages.html": "Ayurvedic treatment packages",
  "/faqs-downloads/": "FAQs & downloads", "/sitemap/": "Site map", "/emailsubscriber/": "Newsletter",
  "/ayurvedic-treatments/": "Find a treatment (all programmes)",
};
const BANNED = /\b(spa|resort|holiday|luxury|cure|journey|guests?)\b/i;

for (const r of OVR.relabels || []) LABEL[r.path] = r.label;
for (const m of OVR.moves || []) if (m.label) LABEL[m.path] = m.label;
function titleOf(p) {
  if (LABEL[p]) return LABEL[p];
  const reg = register.get(p); if (reg) return reg.name.replace(/'/g, "’");
  const c = crumbs.get(p); if (c && c[c.length - 1].path === p) return c[c.length - 1].label;
  const r = byPath.get(p); const t = String((r && r.metadata.title) || p).split(/\s*(?:[|–—]|\s-\s)\s*/)[0].trim();
  return t;
}
function campaignLabel(p) {
  const t = titleOf(p).replace(BANNED, "").replace(/\s{2,}/g, " ").replace(/\s+([,.])/g, "$1").trim();
  return t;   // the section heading already says "Campaign pages"
}

// ---- 1. each indexable route → [section, ...ancestor paths] -----------------------
const placement = new Map();
const unplaced = [];
for (const r of indexable) {
  const p = r.path;
  if (MOVED.has(p)) { placement.set(p, { section: MOVED.get(p).section, chain: [], group: concernOf.get(p) || null }); continue; }
  let chain = null, section = null, group = null;
  if (PLACE[p]) {
    if (PLACE[p][0] === "@site") section = "site";
    else chain = [...PLACE[p]];
  } else if (register.has(p) && !sectionByHub.has(p) && !/^\/(ayurvedic-treatments|wellness-programs|treatment-programs|yoga-meditation-programs|training-programs|all-programs)\/$/.test(p)) {
    const cats = register.get(p).categories || [];
    if (cats.includes("Training")) chain = ["/yoga-meditation-training/"];
    else if (cats[0] === "Treatment") { chain = ["/all-programs/", "/ayurvedic-treatments/"]; group = concernOf.get(p) || null; }
    else if (cats.includes("Yoga & Meditation")) chain = ["/all-programs/", "/yoga-meditation-programs/"];
  }
  if (!chain && !section) {
    const c = crumbs.get(p);
    if (c && c.length >= 2 && c[0].path === "/") {
      chain = c.slice(1).map((x) => x.path === "/training-programs/" ? "/yoga-meditation-training/" : x.path).filter((x) => x !== p && byPath.has(x));
      if (!chain.length && c.length === 2 && !sectionByHub.has(p)) { section = CAMPAIGN_FAMILIES.test(familyOf(r)) ? "campaigns" : "site"; chain = null; }
    } else section = CAMPAIGN_FAMILIES.test(familyOf(r)) || /\.html$/.test(p) ? "campaigns" : null;
  }
  if (chain) {
    const t = chain.indexOf("/yoga-meditation-training/");
    if (t >= 0) chain = chain.slice(t);
    if (sectionByHub.has(p) && !chain.length) section = sectionByHub.get(p).id;
    else if (p === "/yoga-meditation-training/") { section = "training"; chain = []; }
    else {
      const hub = chain.find((x) => sectionByHub.has(x));
      if (!hub) { unplaced.push(p + " (chain " + chain.join(" > ") + ")"); continue; }
      section = sectionByHub.get(hub).id;
      chain = chain.slice(chain.indexOf(hub));
    }
  }
  if (!section) { unplaced.push(p); continue; }
  placement.set(p, { section, chain: chain || [], group });
}
for (const [p, mv] of MOVED) {
  if (!placement.has(p)) { if (redirected.has(p) || byPath.get(p)?.sitemapExclude) continue; console.error("override for a route not in the tree: " + p); process.exit(1); }
  const sec = SECTIONS.find((x) => x.id === mv.section);
  if (!sec) { console.error("override: unknown section " + mv.section + " for " + p); process.exit(1); }
  const keepGroup = mv.parent === "/ayurvedic-treatments/" ? placement.get(p).group : null;
  placement.set(p, { section: mv.section, chain: [], group: keepGroup, parent: mv.parent && mv.parent !== sec.hub ? mv.parent : null });
}
if (unplaced.length) { console.error("UNPLACED routes (add a PLACE rule):\n  " + unplaced.join("\n  ")); process.exit(1); }

// ---- 2. build the trees ------------------------------------------------------------
const ORDER = new Map(manifest.routes.map((r, i) => [r.path, i]));
const nodes = new Map();
const mk = (p) => { if (!nodes.has(p)) nodes.set(p, { path: p, title: titleOf(p), children: [] }); return nodes.get(p); };
const sections = SECTIONS.map((s) => ({ ...s, children: [] }));
const secById = new Map(sections.map((s) => [s.id, s]));
for (const [p, pl] of placement) {
  const sec = secById.get(pl.section);
  if (sec.hub === p) continue;                                  // the hub is the section itself
  const node = mk(p);
  if (pl.section === "campaigns") node.title = campaignLabel(p);
  // parent = an explicit (content-review) parent, else the deepest breadcrumb ancestor below the hub in this section
  let parent;
  if (pl.parent) {
    if (!placement.has(pl.parent) || placement.get(pl.parent).section !== pl.section) { console.error(`override: parent ${pl.parent} of ${p} is not a page in section ${pl.section}`); process.exit(1); }
    parent = mk(pl.parent);
  } else {
    const anc = pl.chain.filter((x) => x !== sec.hub && placement.has(x) && placement.get(x).section === pl.section);
    parent = anc.length ? mk(anc[anc.length - 1]) : sec;
  }
  if (pl.group) {
    let g = parent.children.find((c) => c.group === pl.group);
    if (!g) { g = { path: null, title: pl.group, group: pl.group, children: [] }; parent.children.push(g); }
    parent = g;
  }
  if (!parent.children.includes(node)) parent.children.push(node);
}
const groupOrder = Object.keys(CONCERN);
const CHILD_ORDER = OVR.order || {};
const sortTree = (list, parentPath) => {
  const want = CHILD_ORDER[parentPath];
  if (want) {
    const rank = (n) => { const i = want.indexOf(n.path); return i < 0 ? 1e6 + (ORDER.get(n.path) ?? 9e6) : i; };
    list.sort((a, b) => (a.group ? 1 : 0) - (b.group ? 1 : 0) || rank(a) - rank(b));
    list.forEach((n) => sortTree(n.children, n.path));
    return;
  }
  list.sort((a, b) => (a.group && b.group) ? groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group)
    : (a.group ? 1 : 0) - (b.group ? 1 : 0) || (b.children.length ? 1 : 0) - (a.children.length ? 1 : 0) || (ORDER.get(a.path) ?? 9e6) - (ORDER.get(b.path) ?? 9e6));
  list.forEach((n) => sortTree(n.children, n.path));
};
sections.forEach((s) => sortTree(s.children, s.hub));

// ---- 3. checks -----------------------------------------------------------------------
const listed = new Map();
const walk = (list, sec, trail) => list.forEach((n) => { if (n.path) { if (listed.has(n.path)) throw new Error("listed twice: " + n.path); listed.set(n.path, { section: sec.id, ancestors: trail.filter(Boolean) }); } walk(n.children, sec, [...trail, n.path]); });
for (const s of sections) { if (s.hub) listed.set(s.hub, { section: s.id, ancestors: [] }); walk(s.children, s, []); }
const missing = indexable.filter((r) => !listed.has(r.path)).map((r) => r.path);
if (missing.length) { console.error("NOT IN TREE: " + missing.join(" ")); process.exit(1); }
const banned = [...nodes.values()].filter((n) => BANNED.test(n.title)).map((n) => n.path + " " + n.title);
if (banned.length) { console.error("KTAHV-locked word in a label:\n  " + banned.join("\n  ")); process.exit(1); }
for (const p of listed.keys()) if (!byPath.has(p)) { console.error("not served: " + p); process.exit(1); }

const strip = (n) => ({ path: n.path, title: n.title, ...(n.group ? { group: true } : {}), children: n.children.map(strip) });
const out = {
  generatedBy: "tools/build-site-tree.mjs",
  why: "One tree for the sitemap AND the left section rail; parents are real hub pages; every node is a served page.",
  sections: sections.map((s) => ({ id: s.id, title: s.title, hub: s.hub, children: s.children.map(strip) })),
  index: Object.fromEntries([...listed].sort((a, b) => a[0].localeCompare(b[0]))),
  // served but not listed: section only (their rail highlights nothing); from their breadcrumb's first hub
  unlisted: Object.fromEntries(unlistedRoutes.map((r) => {
    const c = crumbs.get(r.path) || [];
    const hub = c.map((x) => x.path).find((x) => sectionByHub.has(x));
    return [r.path, { section: hub ? sectionByHub.get(hub).id : null, ancestors: [] }];
  }).filter(([, v]) => v.section)),
};
fs.writeFileSync(path.join(SITE, "english-candidate/site-tree.json"), JSON.stringify(out, null, 1) + "\n");
const count = (list) => list.reduce((n, x) => n + (x.path ? 1 : 0) + count(x.children), 0);
console.log(`site tree: ${listed.size} pages in ${sections.length} sections (every indexable route once, 0 dead links)`);
for (const s of out.sections) console.log(`  ${s.title.padEnd(28)} ${String(count(s.children) + (s.hub ? 1 : 0)).padStart(3)}  ${s.hub || "(no hub page)"}`);
