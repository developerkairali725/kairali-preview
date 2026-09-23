#!/usr/bin/env node
/**
 * AHV /sitemap/ — curate the classified inventory BEFORE tools/build-sitemap-navigation.mjs
 * renders it (owner, 23 Sep 2026: "battle test and improve" the Codex concept).
 *
 * The concept (twelve subject roots, a filterable tree, an index) stays. What the
 * battle test found in its inventory, and what this pass does about it, measured
 * against the route manifest and the owner's programme register:
 *   1. DEAD LINKS carried from the WordPress sitemap: /opd/ (the page is
 *      /walk-in-ayurveda-treatment/), /panchkarma/ (the article is /panchakarma/),
 *      /sitemap_index.xml (a WordPress artefact). Re-pointed or dropped.
 *   2. EIGHT hrefs without their trailing slash — each a redirect hop. Fixed.
 *   3. DUPLICATES: four hrefs listed twice, and /treatment-in-kerala.html listed
 *      three times as "English / German / Russian" editions that do not exist
 *      (the Russian route is deferred, there is no German one). One entry each.
 *   4. CONFIRMATION pages (/thanks/, /ppc-thanks/) are not destinations. Dropped.
 *   5. TWENTY-ONE served pages were missing — the five programme finders, the
 *      gallery hub, the OPD page, the defence offer, three campaign pages, six
 *      articles, a job page. Added, each to its subject (table below), titled
 *      from the register (programmes) or the page's own <title>. Test/junk
 *      routes (/gift-test/, /test-page-2/, /new-privacy-policy/) stay out.
 *   6. CLINICAL LOCK: one title carried a banned word (a campaign page called
 *      itself a "resort"); relabelled.
 *   7. PROGRAMME titles now use the register's current names.
 * Idempotent: re-running changes nothing. Titles keep the concept's sentence
 * case (proper nouns preserved). Output: english-candidate/sitemap-navigation.json.
 *
 *   node tools/curate-sitemap-navigation.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = path.join(SITE, "english-candidate/sitemap-navigation.json");
const DRY = process.argv.includes("--dry");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));
const manifest = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/route-manifest.json"), "utf8"));
const byPath = new Map(manifest.routes.map((r) => [r.path, r]));
const w = {}; vm.runInNewContext(fs.readFileSync(path.join(SITE, "public/ahv/assets/all-programs-data.js"), "utf8"), { window: w });
const register = new Map(Object.values(w)[0].programmes.map((p) => [p.route, p.name]));

const PROPER = ["Ayurveda", "Ayurvedic", "Ayurveda's", "Kairali", "Kairali's", "Kerala", "Kerala's", "Panchakarma", "Panchkarma", "Palakkad", "India", "Indian", "Air", "Air India", "Maharaja", "Karkidaka", "Chikitsa", "OPD", "NABH", "WHO-GMP", "Kathakali", "Sanskrit", "Gita", "Ramesh", "Anupam", "TAP-HV", "OAP-HV", "WAP-HV", "AATP1-HV", "AALCT-HV", "Coimbatore", "Kochi", "Bangalore", "Chennai", "Delhi", "Mumbai", "Ashtanga", "Hatha", "Lakshya", "Katha", "Yala", "Prav", "Simona", "Raag", "Villa", "Arogya", "Kendra", "Shala", "Kair", "PPC", "FAQs", "PDF", "German", "Russian", "English", "Karma", "Ananda", "Lahari", "Baoli", "Kairtis"];
const properSet = new Set(PROPER.map((p) => p.toLowerCase()));
function sentence(s) {
  const words = String(s).replace(/\s+/g, " ").trim().split(" ");
  return words.map((wd, i) => {
    const core = wd.replace(/[^A-Za-z'’-]/g, "");
    if (!core) return wd;
    if (i === 0) return wd.split("-").map((part, k) => (k === 0 || properSet.has(part.toLowerCase()) ? part : part.charAt(0).toLowerCase() + part.slice(1))).join("-");
    if (properSet.has(core.toLowerCase()) || /^[A-Z0-9&-]{2,}$/.test(core) || /^[A-Z]\./.test(core)) return wd;
    if (/^[A-Z][a-z]/.test(core) && core.length > 1 && !/^[A-Z][a-z]+$/.test(core)) return wd;   // CamelCase, e.g. WhatsApp
    return wd.split("-").map((part) => (properSet.has(part.toLowerCase()) ? part : part.charAt(0).toLowerCase() + part.slice(1))).join("-");
  }).join(" ");
}
const pageTitle = (route) => {
  const r = byPath.get(route); if (!r) return null;
  return sentence(String(r.metadata.title || "").split(/\s*(?:[|–—]|\s-\s)\s*/)[0].trim());
};
const slashed = (h) => (/^\//.test(h) && !/\.(html|xml)$/.test(h) && !h.endsWith("/") ? h + "/" : h);

/** Dead WordPress-era hrefs → the page that serves that need today (or null = drop). */
const ALIAS = { "/opd/": "/walk-in-ayurveda-treatment/", "/panchkarma/": "/panchakarma/", "/sitemap_index.xml": null, "/search-results/": "/search/" };
/** Served by the app, not by the design manifest. */
const APP_ROUTES = new Set(["/search/", "/sitemap.xml"]);
/** Not destinations for a visitor. */
const DROP = new Set(["/thanks/", "/ppc-thanks/", "/contact-us/thank-you/", "/onlinebookingthankyou/", "/onlineconsultation-thanks/", "/thanks-old/"]);
/** Served pages the inventory lacked → subject branch (a subject the tree already has). */
const ADD = [
  ["/all-programs/", ["Treatments & clinical care", "Treatment directories"], "All programmes"],
  ["/treatment-programs/", ["Treatments & clinical care", "Treatment directories"], "Treatment programmes"],
  ["/wellness-programs/", ["Treatments & clinical care", "Treatment directories"], "Wellness programmes"],
  ["/yoga-meditation-programs/", ["Yoga & meditation"], "Yoga & meditation programmes"],
  ["/yoga-retreats/", ["Yoga & meditation", "Therapeutic programmes"], null],
  ["/retreats-for-everyone/", ["Yoga & meditation", "Getting started"], null],
  ["/yoga-and-ayurveda/", ["Yoga & meditation", "Getting started"], "Yoga & Ayurveda"],
  ["/training-programs/", ["Training & education", "Overview & fees"], "Training programmes"],
  ["/new-to-yoga-teacher-training/", ["Training & education", "Yoga teacher training", "Overview & guidance"], "New to yoga teacher training"],
  ["/gallery/", ["Galleries & reviews", "Photo galleries"], "All galleries"],
  ["/walk-in-ayurveda-treatment/", ["Contact & plan your visit", "Consultations & appointments"], "Walk-in Ayurveda treatment (OPD)"],
  ["/learn-about-ayurveda/", ["Ayurveda library", "Getting started & further reading"], "Learn about Ayurveda"],
  ["/no-refridgeration/", ["Stay & village experiences", "Life at the village", "Food & lifestyle commitments"], "No refrigeration"],
  ["/offers/defence-paramilitary-personnel-get-upto-30-off/", ["Packages & offers", "Special offers"], "Defence & paramilitary personnel offer"],
  ["/family-ayurvedic-retreat-kerala.html", ["Campaign pages", "Regional & brand campaigns"], "Family Ayurveda programme, Kerala (campaign page)"],
  ["/kairali-air-india-maharaja-club.html", ["Campaign pages", "Regional & brand campaigns"], "Kairali × Air India Maharaja Club (campaign page)"],
  ["/karkidaka-chikitsha-or-monsoon-wellness.html", ["Campaign pages", "Treatment campaigns"], "Monsoon Ayurvedic treatment — Karkidaka Chikitsa"],
  ["/jobs/business-development-manager/", ["About Kairali", "Careers & internships"], "Business development manager (apply)"],
];
/** Clinical-lock relabels (KTAHV banned words) and the phantom editions. */
const RELABEL = { "/wellness-resort-kerala.html": "Ayurveda in Kerala (campaign page)", "/treatment-in-kerala.html": "Treatment in Kerala (campaign page)", "/ayurveda-retreat-kerala.html": "Ayurveda programme in Kerala (campaign page)" };
const BANNED = /\b(spa|resort|holiday|luxury|cure|journey|guests?)\b/i;

let links = [];
const seen = new Set();
const notes = { repointed: [], dropped: [], deduped: [], slashed: [], added: [], relabelled: [], renamed: [] };
for (const l of data.links) {
  let href = l.href;
  if (Object.prototype.hasOwnProperty.call(ALIAS, href)) { if (ALIAS[href] === null) { notes.dropped.push(href); continue; } notes.repointed.push(href + " → " + ALIAS[href]); href = ALIAS[href]; }
  const s = slashed(href); if (s !== href) { notes.slashed.push(href); href = s; }
  if (DROP.has(href)) { notes.dropped.push(href); continue; }
  // a route that canonicalises elsewhere (route-overrides.json → sitemapExclude) is listed as its canonical page
  if (byPath.has(href) && byPath.get(href).sitemapExclude) { const c = String(byPath.get(href).metadata.canonical || "").replace(/^https?:\/\/[^/]+/, ""); if (c && byPath.has(c)) { notes.repointed.push(href + " → " + c + " (canonical)"); href = c; } }
  if (seen.has(href)) { notes.deduped.push(href + " (" + l.title + ")"); continue; }
  seen.add(href);
  let title = l.title;
  if (register.has(href)) { const n = sentence(register.get(href)); if (n !== title) { notes.renamed.push(title + " → " + n); title = n; } }
  if (RELABEL[href]) { notes.relabelled.push(title + " → " + RELABEL[href]); title = RELABEL[href]; }
  if (href === "/walk-in-ayurveda-treatment/" && l.href === "/opd/") title = "Walk-in Ayurveda treatment (OPD)";
  if (href === "/search/") title = "Search the site";
  // campaign pages carried their WordPress slugs as titles ("Kairali brand and competition neo original"):
  // the page's own <title> says what it is, plus the label every campaign entry carries
  if (l.branch[0] === "Campaign pages" && !RELABEL[href] && byPath.has(href)) { const t = pageTitle(href).replace(/\s*\(campaign page\)$/, "") + " (campaign page)"; if (t !== title) { notes.relabelled.push(title + " → " + t); title = t; } }
  if (!byPath.has(href) && !APP_ROUTES.has(href) && /^\//.test(href)) { notes.dropped.push(href + " (not served)"); continue; }
  links.push({ ...l, href, title });
}
for (const [href, branch, title] of ADD) {
  if (seen.has(href)) continue;
  if (!byPath.has(href)) { console.warn("ADD skipped, not a route: " + href); continue; }
  seen.add(href);
  const t = title || (register.has(href) ? sentence(register.get(href)) : pageTitle(href));
  links.push({ id: "", title: t, href, branch, originalTitle: byPath.get(href).metadata.title || t, added: "tools/curate-sitemap-navigation.mjs (served page the WordPress sitemap never listed)" });
  notes.added.push(href);
}
// stable ids in tree order, subjects in the concept's root order
const rootIndex = new Map(data.roots.map((r, i) => [r, i]));
links.sort((a, b) => rootIndex.get(a.branch[0]) - rootIndex.get(b.branch[0]) || data.links.findIndex((x) => x.href === a.href || x === a) - data.links.findIndex((x) => x.href === b.href || x === b));
links = links.map((l, i) => ({ ...l, id: "link-" + String(i + 1).padStart(3, "0") }));

// contract checks (the test file asserts the same)
const problems = [];
for (const l of links) {
  if (BANNED.test(l.title)) problems.push("banned word: " + l.title);
  if (/^\//.test(l.href) && !byPath.has(l.href) && !APP_ROUTES.has(l.href)) problems.push("not a route: " + l.href);
  if (/^\//.test(l.href) && !/\.(html|xml)$/.test(l.href) && !l.href.endsWith("/")) problems.push("no trailing slash: " + l.href);
}
if (problems.length) { console.error(problems.join("\n")); process.exit(1); }

const out = { ...data, curated: { by: "tools/curate-sitemap-navigation.mjs", at: new Date().toISOString(), ...Object.fromEntries(Object.entries(notes).map(([k, v]) => [k, v.length])) }, links };
if (!DRY) fs.writeFileSync(FILE, JSON.stringify(out, null, 1) + "\n");
console.log(`sitemap inventory: ${data.links.length} → ${links.length} links · repointed ${notes.repointed.length} · slashed ${notes.slashed.length} · deduped ${notes.deduped.length} · dropped ${notes.dropped.length} · added ${notes.added.length} · programme names ${notes.renamed.length} · relabelled ${notes.relabelled.length}`);
for (const [k, v] of Object.entries(notes)) if (v.length) console.log("  " + k + ": " + v.join(" · "));
