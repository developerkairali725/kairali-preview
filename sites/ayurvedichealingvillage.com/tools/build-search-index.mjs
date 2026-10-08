#!/usr/bin/env node
/**
 * AHV site search — build the ONE prebuilt index the three search surfaces share
 * (header overlay, programme finder, FAQ filter). D-20260922-32 (Option A),
 * docs/research/2026-09-23-ahv-search-brainstorm.md §7.2 step 2.
 *
 *   english-candidate/search-vocabulary.json   governed vocabulary (classes, terms, synonyms, intents, labels)
 *   public/ahv/assets/all-programs-data.js     the 38 programme records + dated tariff snapshot (validTo)
 *   english-candidate/finder-benchmark/…       the finder's card images per route (design payload, not typed here)
 *   english-candidate/route-manifest.json      every active route + approved metadata description
 *   english-candidate/prerender/<route>.html   the page's own rendered H1 — the governed result label
 *   public/ahv/views/ahv-page-faqs-and-downloads-desktop.json   the FAQ Q&A (44 + the content pass's additions) + 12 topics
 *   public/ahv/views/<programme view>.json     whoFor lines per programme page
 *
 *   → public/ahv/search-index.json
 *
 * Rules enforced here, not in the browser:
 *   · Result labels are NEVER the legacy <title>: H1 from the prerender, else the vocabulary's label override,
 *     else the slug — and an H1/description carrying a KTAHV-locked word is replaced/dropped and counted.
 *   · Prices: a programme whose validTo is in the past is emitted WITHOUT a price (the overlay prints
 *     "Request a quote") and the build FAILS unless --allow-expired is passed. Approved 20260925-R1 tariff source files live in
 *     english-candidate/final-rates; each family retains its own effective dates.
 *   · Size cap: ≤ 35 KB gzip (brainstorm §3.4). Over the cap = build failure.
 *   · Every route referenced by the vocabulary must exist in route-manifest.json (HARD GATE 6 — no invented slugs).
 *
 * Usage: node tools/build-search-index.mjs [--allow-expired] [--dry] [--verbose]
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARGS = process.argv.slice(2);
const CHECK = ARGS.includes("--check");
const DRY = ARGS.includes("--dry") || CHECK;
const ALLOW_EXPIRED = ARGS.includes("--allow-expired");
const VERBOSE = ARGS.includes("--verbose");
const OUT = path.join(SITE, "public/ahv/search-index.json");
const GZIP_CAP = 35 * 1024;

const read = (p) => fs.readFileSync(path.join(SITE, p), "utf8");
const json = (p) => JSON.parse(read(p));

const V = json("english-candidate/search-vocabulary.json");
const MANIFEST = json("english-candidate/route-manifest.json").routes;
const ROUTES = new Set(MANIFEST.map((r) => r.path));
const BENCH = json("english-candidate/finder-benchmark/ahv-page-ayurvedic-treatments-desktop.json");
const FAQ_VIEW = json("public/ahv/views/ahv-page-faqs-and-downloads-desktop.json");

// ---- register guard (KTAHV clinical lock; CLAUDE.md + packages/compliance README seeds) ---------------------
const LOCKED = /\b(spa|spas|resort|resorts|holiday|holidays|luxury|luxurious|cure|cures|cured|curing|journey|journeys|guest|guests|getaway|getaways|escape|escapes|urlaub|kur|luxus|vacances|luxe)\b/i;
const ALLOWED_PHRASES = [/world luxury award winner/i];
const locked = (s) => LOCKED.test(String(s || "").replace(/world luxury award winner/gi, ""));
const registerLog = { labelsReplaced: [], descriptionsDropped: [], faqCarrying: [] };

const decode = (s) => String(s || "")
  .replace(/<[^>]+>/g, " ")
  .replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&#39;|&rsquo;|&#8217;/g, "’").replace(/&lsquo;|&#8216;/g, "‘")
  .replace(/&ldquo;|&#8220;/g, "“").replace(/&rdquo;|&#8221;/g, "”").replace(/&mdash;|&#8212;/g, "—").replace(/&ndash;|&#8211;/g, "–")
  .replace(/&hellip;/g, "…").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/\s+/g, " ").trim();
const clip = (s, n) => { s = decode(s); if (s.length <= n) return s; const cut = s.slice(0, n - 1); return cut.slice(0, Math.max(cut.lastIndexOf(" "), 40)) + "…"; };
const slugLabel = (p) => p.replace(/^\/|\/$/g, "").replace(/\.html$/, "").split("/").pop().split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

// ---- programmes ---------------------------------------------------------------------------------------------------
const finderCtx = { window: {} };
vm.runInNewContext(read("public/ahv/assets/all-programs-data.js"), finderCtx);
const FINDER = finderCtx.window.AHV_FINDER;
if (!FINDER || !Array.isArray(FINDER.programmes)) throw new Error("all-programs-data.js did not expose AHV_FINDER.programmes");

// Card images: the benchmark finder view's PROGRAMMES array (design payload). Read by href, never typed.
const images = {};
for (const m of BENCH.logic.matchAll(/h:'https:\/\/ayurvedichealingvillage\.com([^']+)',i:'([^']+)'/g)) images[m[1]] = m[2];
// D-20260916-10: the benchmark still keys the training umbrella on the pre-move route; the hub is /ayurveda-training-programme/.
if (images["/ayurveda-training-programs/"] && !images["/ayurveda-training-programme/"]) images["/ayurveda-training-programme/"] = images["/ayurveda-training-programs/"];
const COURSE_IMAGES = Object.fromEntries(json("english-candidate/finder-additions.json").programmes.map((c) => [c.route, null]));
for (const c of json("english-candidate/finder-views.json").dataPatch.courses) COURSE_IMAGES[c.route] = c.image;

const TODAY = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z");
const expiredRoutes = [];
const programmes = FINDER.programmes.map((p) => {
  if (!ROUTES.has(p.route)) throw new Error("programme route not in manifest: " + p.route);
  const route = MANIFEST.find((r) => r.path === p.route);
  let whoFor = [];
  try {
    const view = json("public/ahv/views/" + route.desktopView + ".json");
    const m = view.logic.match(/whoFor\s*=\s*\[([\s\S]*?)\];/);
    if (m) whoFor = Array.from(m[1].matchAll(/(["'])((?:\\.|(?!\1).)*)\1/g)).map((x) => decode(x[2].replace(/\\'/g, "'"))).filter(Boolean).slice(0, 6);
  } catch { /* article-reader views carry no whoFor */ }
  const expired = !!p.validTo && TODAY > new Date(p.validTo + "T23:59:59Z");
  if (expired && p.from && p.from.INR != null) expiredRoutes.push(p.route);
  const isCourse = (p.categories || []).includes("Training") && p.route !== "/ayurveda-training-programme/";
  const rec = {
    route: p.route,
    name: decode(p.name),
    sanskrit: p.sanskrit || "",
    cats: (p.categories || []).map((c) => ({ Treatment: "T", Wellness: "W", Training: "R", "Yoga & Meditation": "Y" })[c] || "").join(""),
    nights: p.minimumNights == null ? null : p.minimumNights,
    course: isCourse && p.availability !== "coming_soon",
    availability: p.availability || (p.from?.INR != null ? "current" : "enquiry_only"),
    bookable: p.bookable !== false,
    basis: /per night/i.test(p.priceBasisNote || "") ? "night" : "total",
    from: p.from && p.from.INR != null && !expired ? { INR: p.from.INR, USD: p.from.USD, EUR: p.from.EUR } : null,
    validTo: p.validTo || null,
    validFrom: p.validFrom || null,
    priceState: !(p.from && p.from.INR != null) ? "unpriced" : expired ? "expired" : "valid",
    aliases: (p.aliases || []).map(decode),
    terms: V.terms[p.route] || [],
    forWhat: V.forWhat[p.route] || "",
    whoFor,
    image: images[p.route] || COURSE_IMAGES[p.route] || images[Object.keys(images).find((k) => k === p.route)] || null
  };
  if (!rec.image && VERBOSE) console.warn("no card image for", p.route);
  return rec;
});
for (const r of Object.keys(V.terms)) if (!programmes.find((p) => p.route === r)) throw new Error("vocabulary terms route has no programme record: " + r);
for (const r of Object.keys(V.forWhat)) if (!programmes.find((p) => p.route === r)) throw new Error("forWhat route has no programme record: " + r);
for (const c of V.chips) for (const r of c.routes) if (!programmes.find((p) => p.route === r)) throw new Error(`chip ${c.id} route not a programme: ${r}`);
for (const g of V.generic) for (const r of g.routes) if (!programmes.find((p) => p.route === r)) throw new Error(`generic "${g.term}" route not a programme: ${r}`);
for (const r of Object.keys(V.caveat)) if (!programmes.find((p) => p.route === r)) throw new Error("caveat route not a programme: " + r);

// Budget bands derived from the priced from-totals (never hard-coded): the 1/3 and 2/3 quantiles + the max, per currency.
const budgetBands = {};
for (const cur of ["INR", "USD", "EUR"]) {
  const vals = [...new Set(programmes.filter((p) => p.from && !p.course).map((p) => p.from[cur]))].sort((a, b) => a - b);
  const pick = (f) => vals[Math.min(vals.length - 1, Math.floor(vals.length * f))];
  budgetBands[cur] = [...new Set([pick(1 / 3), pick(2 / 3), vals[vals.length - 1]])];
}

// ---- FAQ ------------------------------------------------------------------------------------------------------------
const faqs = [];
{
  const t = FAQ_VIEW.template;
  const groups = t.split(/<section data-group="1" data-label="/).slice(1);
  let n = 0;
  for (const g of groups) {
    const topic = decode(g.slice(0, g.indexOf('"')));
    // the id comes from the tag, never from the position: the content pass (tools/repair-faq-content.mjs) appends
    // q-45… inside their topics, so position ≠ id and the existing ids (intents, faqKeywords, the query set) hold
    const parts = g.split(/(<details data-q="[^"]*" id="q-\d+"[^>]*>)/).slice(1);
    for (let k = 0; k < parts.length; k += 2) {
      const open = parts[k], d = parts[k + 1];
      n += 1;
      const q = decode((d.match(/<h3[^>]*>([\s\S]*?)<\/h3>/) || [])[1]);
      const body = d.slice(d.indexOf("</summary>"), d.indexOf("</details>"));
      const a = decode(body);
      const id = open.match(/id="(q-\d+)"/)[1];
      const rec = { id, n, topic, q, a: clip(a, 1500), kw: V.faqKeywords[id] || [] };
      if (locked(q) || locked(topic)) registerLog.faqCarrying.push(id + " " + (locked(q) ? "question" : "topic"));
      faqs.push(rec);
    }
  }
  const declared = (t.match(/<details data-q="\d+" id="q-\d+"/g) || []).length;
  if (faqs.length < 44 || faqs.length !== declared) throw new Error(`expected ${declared} (≥44) FAQ questions, found ${faqs.length}`);
  if (new Set(faqs.map((f) => f.id)).size !== faqs.length) throw new Error("duplicate FAQ ids in the view");
  for (const id of Object.keys(V.faqKeywords)) if (!faqs.find((f) => f.id === id)) throw new Error("faqKeywords id not in the FAQ view: " + id);
}

// ---- pages ------------------------------------------------------------------------------------------------------
const PROGRAMME_ROUTES = new Set(programmes.map((p) => p.route));
const h1For = (route) => {
  const slug = route === "/" ? "index" : route.replace(/^\//, "").replace(/\/$/, "").replace(/\//g, "_");
  const f = path.join(SITE, "english-candidate/prerender", slug + ".html");
  if (!fs.existsSync(f)) return null;
  const m = fs.readFileSync(f, "utf8").match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? decode(m[1]) : null;
};
for (const r of Object.keys(V.pages)) if (!ROUTES.has(r)) throw new Error("vocabulary page route not in manifest: " + r);
for (const i of V.intents) if (i.target.startsWith("/") && !ROUTES.has(i.target)) throw new Error("intent target route not in manifest: " + i.target);
for (const i of V.intents) if (!i.target.startsWith("/") && !faqs.find((f) => f.id === i.target)) throw new Error("intent target FAQ id unknown: " + i.target);
for (const b of V.ui.emptyButtons) if (b.href && !ROUTES.has(b.href)) throw new Error("empty-state button route not in manifest: " + b.href);

const REDIRECTS = json("english-candidate/redirect-map.json").redirects;
const SKIP = new Set(["/emailsubscriber/","/founders-message/","/search-results/", "/thank-you/", "/thankyou/", "/contact-us/thank-you/", "/onlinebookingthankyou/", "/onlineconsultation-thanks/", "/ppc-thanks/", "/thanks-old/", "/thanks/", "/gift-test/", "/test-page/", "/test-page-2/", "/testing/"]);
const pages = [];
for (const r of MANIFEST) {
  if (PROGRAMME_ROUTES.has(r.path) || SKIP.has(r.path) || REDIRECTS[r.path] || r.sitemapExclude) continue;
  if (r.status && r.status !== "active") continue;
  if (/^\/ru\//.test(r.path)) continue;
  const v = V.pages[r.path] || {};
  let label = v.label || null;
  if (!label) {
    const h1 = h1For(r.path);
    if (h1 && !locked(h1) && h1.length <= 80) label = h1;
    else if (h1) registerLog.labelsReplaced.push(r.path + " ← " + h1.slice(0, 60));
  }
  if (!label) label = slugLabel(r.path);
  let desc = clip(r.metadata && r.metadata.description, 90);
  if (locked(desc)) { registerLog.descriptionsDropped.push(r.path); desc = ""; }
  pages.push({ route: r.path, label, desc, kw: [...new Set([...(v.keywords || []), ...(r.path === "/about-us/" ? ["founder", "founders message", "K.V. Ramesh"] : [])])] });
}

// ---- assemble -------------------------------------------------------------------------------------------------
const index = {
  version: "2026-09-23a",
  generated: new Date().toISOString(),
  priceValidTo: FINDER.programmes.filter((p) => p.from).map((p) => p.validTo).sort()[0] || null,
  expiredRoutes,
  classes: V.classes,
  vocabulary: {
    filler: V.filler, weak: V.weakWords, misspell: V.misspell,
    rehabExempt: V.rehabExempt, urgent: V.urgent, consult: V.consult, decline: V.decline, caveat: V.caveat, generic: V.generic
  },
  intents: V.intents,
  chips: V.chips,
  budgetBands,
  programmes,
  faqs,
  pages,
  oftenSearched: V.oftenSearched,
  ui: V.ui
};
const text = JSON.stringify(index);
const gz = zlib.gzipSync(text).length;
console.log(`search-index: ${programmes.length} programmes (${expiredRoutes.length} expired), ${faqs.length} FAQ, ${pages.length} pages · ${(text.length / 1024).toFixed(1)} KB raw / ${(gz / 1024).toFixed(1)} KB gzip (cap ${GZIP_CAP / 1024} KB)`);
console.log(`register: ${registerLog.labelsReplaced.length} H1 labels replaced by slug/override, ${registerLog.descriptionsDropped.length} descriptions dropped, ${registerLog.faqCarrying.length} FAQ rows carry a locked word as authored (owner decision, brainstorm Q-08): ${registerLog.faqCarrying.join(", ")}`);
if (VERBOSE) { console.log(registerLog.labelsReplaced.join("\n")); console.log(registerLog.descriptionsDropped.join("\n")); }
console.log(`prices valid to ${index.priceValidTo}; today ${TODAY.toISOString().slice(0, 10)}`);
let fail = false;
if (expiredRoutes.length && !ALLOW_EXPIRED) { console.error(`REFUSED: ${expiredRoutes.length} programme price(s) past validTo — re-read the V4 2026-27 tariff sheet, or pass --allow-expired to emit them price-less ("Request a quote").`); fail = true; }
if (gz > GZIP_CAP) { console.error(`REFUSED: index ${gz} bytes gzip exceeds the ${GZIP_CAP} cap`); fail = true; }
if (fail) process.exit(2);
if (CHECK) {
  const existing = JSON.parse(fs.readFileSync(OUT, "utf8"));
  const expected = { ...index, generated: null };
  if (JSON.stringify({ ...existing, generated: null }) !== JSON.stringify(expected)) {
    console.error("REFUSED: stale search index; run node tools/build-search-index.mjs");
    process.exit(2);
  }
  console.log("search index matches current sources");
}
if (!DRY && !CHECK) {
  let existing = null;
  try { existing = JSON.parse(fs.readFileSync(OUT, "utf8")); } catch {}
  // Generation time describes a changed index, not every verification/build.
  // Keep identical payloads stable for cache validators and release source pins.
  const unchanged = existing && JSON.stringify({ ...existing, generated: null }) === JSON.stringify({ ...index, generated: null });
  if (unchanged) console.log("search index unchanged; retained generation timestamp");
  else { fs.writeFileSync(OUT, text + "\n"); console.log("wrote", path.relative(SITE, OUT)); }
}
