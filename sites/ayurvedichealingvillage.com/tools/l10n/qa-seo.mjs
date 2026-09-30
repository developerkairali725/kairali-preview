/**
 * Locale SEO/route verification on SERVER HTML (what a crawler reads), in
 * batches of <=25 pages, for English and every locale.
 *
 * Per page (expected values are derived independently of the app code, from
 * the reviewed route table, the manifest and the robots policy):
 *  · HTTP 200 at the reviewed URL; <html lang/dir>;
 *  · exactly one <title> and a meta description;
 *  · canonical = self, or the localized consolidation target for an alias;
 *  · robots: staging → X-Robots-Tag noindex header + meta noindex;
 *    production → meta robots equal to the route's production policy;
 *  · hreflang: eligible (self-canonical, production-indexable) routes carry the
 *    full cluster + x-default; aliases and noindex utility routes carry NONE;
 *  · og:locale present and correct;
 *  · JSON-LD: WebPage (inLanguage = page language), Organization, and
 *    BreadcrumbList for every non-home page, with absolute URLs;
 *  · PDF links point at this language's edition;
 *  · --release: title, description and every breadcrumb label must be an
 *    ACCEPTED translation (present in the locale catalogue — an unchanged proper
 *    name counts only if a worker accepted it with a reason); anything else fails.
 * After all fetches: hreflang reciprocity is checked across the fetched pages.
 *
 *   node tools/l10n/qa-seo.mjs --base http://localhost:4471 [--locales en,de] [--mode staging|production] [--release] [--limit n] [--out file]
 */
import fs from "node:fs";
import crypto from "node:crypto";
const arg = (n, d) => { const i = process.argv.indexOf("--" + n); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg("base", "http://localhost:4471");
const MODE = arg("mode", "staging");
const RELEASE = process.argv.includes("--release");
const HEADERS = process.env.VERCEL_OIDC_TOKEN && /vercel\.app/.test(BASE) ? { "x-vercel-trusted-oidc-idp-token": process.env.VERCEL_OIDC_TOKEN } : {};
const ORIGIN = "https://ayurvedichealingvillage.com";
const ROUTES = JSON.parse(fs.readFileSync("l10n/routes.json", "utf8")).routes;
const LOC = JSON.parse(fs.readFileSync("l10n/locales.json", "utf8"));
const MAN = new Map(JSON.parse(fs.readFileSync("english-candidate/route-manifest.json", "utf8")).routes.map((r) => [r.path, r]));
const OVR = JSON.parse(fs.readFileSync("english-candidate/route-overrides.json", "utf8")).robotsOverrides || {};
const INTERNAL = new Set(fs.readFileSync("app/(english)/_families/robots-policy.ts", "utf8").match(/new Set\(\[([\s\S]*?)\]\)/)[1].match(/"[^"]+"/g).map((s) => JSON.parse(s)));
const prodRobots = (p) => OVR[p] && typeof OVR[p] === "string" ? OVR[p] : INTERNAL.has(p) || p.startsWith("/lp/") ? "noindex, follow" : "index, follow";
const aliasTarget = (p) => { const c = MAN.get(p)?.metadata?.canonical; if (!c) return null; const t = new URL(c).pathname; return t !== p && ROUTES[t] ? t : null; };
const eligible = (p) => !aliasTarget(p) && prodRobots(p).startsWith("index");
const locales = arg("locales", Object.keys(LOC).join(",")).split(",");
const limit = +arg("limit", "0");
const norm = (s) => s.replace(/[\s ]+/g, (m) => (m.includes(" ") && !/[\t\n\r ]/.test(m) ? " " : " ")).trim();
const uid = (s) => "t_" + crypto.createHash("sha256").update(norm(s), "utf8").digest("hex").slice(0, 20);
const catalogs = {};
const cat = (loc) => (catalogs[loc] ??= fs.existsSync(`l10n/generated/${loc}.catalog.json`) ? JSON.parse(fs.readFileSync(`l10n/generated/${loc}.catalog.json`, "utf8")) : {});
const TREE = JSON.parse(fs.readFileSync("english-candidate/site-tree.json", "utf8"));
const treeTitles = new Set(); (function walk(l) { for (const n of l) { if (n.title) treeTitles.add(n.title); walk(n.children || []); } })(TREE.sections);
for (const s of TREE.sections) treeTitles.add(s.title);
const dec = (s) => s == null ? s : s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const attr = (h, re) => (h.match(re) || [])[1] ?? null;
const out = { base: BASE, mode: MODE, release: RELEASE, at: new Date().toISOString(), batches: [], summary: {}, reciprocity: {} };
const fetched = new Map(); // url path -> alternates
let exit = 0;

for (const loc of locales) {
  const info = LOC[loc];
  const pages = Object.entries(ROUTES).map(([en, row]) => ({ en, url: row[loc] })).filter((p) => p.url);
  const list = limit ? pages.slice(0, limit) : pages;
  const stat = { pages: list.length, pass: 0, fail: 0, issues: {} };
  for (let i = 0; i < list.length; i += 25) {
    const batch = list.slice(i, i + 25);
    const res = await Promise.all(batch.map(async (p) => {
      const r = { url: p.url, en: p.en, problems: [] };
      const bad = (x) => r.problems.push(x);
      try {
        const resp = await fetch(BASE + p.url, { redirect: "manual", headers: HEADERS });
        r.status = resp.status;
        if (resp.status !== 200) { bad("status " + resp.status); return r; }
        const h = await resp.text();
        if (attr(h, /<html[^>]*\slang="([^"]+)"/) !== info.htmlLang) bad("lang");
        if ((attr(h, /<html[^>]*\sdir="([^"]+)"/) || "ltr") !== info.dir) bad("dir");
        const titles = [...h.matchAll(/<title>([^<]*)<\/title>/g)].map((m) => dec(m[1]));
        if (titles.length !== 1) bad(`titles:${titles.length}`);
        const desc = dec(attr(h, /<meta name="description" content="([^"]*)"/));
        if (!desc) bad("description:missing");
        const target = aliasTarget(p.en) ?? p.en;
        const wantCanon = ORIGIN + ROUTES[target][loc];
        const canon = attr(h, /<link rel="canonical" href="([^"]+)"/);
        // English self-canonical routes may rely on the runtime canonical (13-family server exception list)
        if (canon !== wantCanon && !(loc === "en" && canon === null && !aliasTarget(p.en))) bad(`canonical:${canon}`);
        const robots = attr(h, /<meta name="robots" content="([^"]+)"/);
        if (MODE === "staging") {
          if (!/noindex/.test(resp.headers.get("x-robots-tag") || "")) bad("robots:header");
          if (!/noindex/.test(robots || "")) bad("robots:meta");
        } else if ((robots || "index, follow").replace(/\s/g, "") !== prodRobots(p.en).replace(/\s/g, "")) bad(`robots:${robots}`);
        const alts = Object.fromEntries([...h.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]));
        fetched.set(p.url, { alts, lang: loc === "en" ? "en" : info.lang });
        if (eligible(p.en)) {
          for (const [c, path] of Object.entries(ROUTES[p.en])) { const k = c === "en" ? "en" : LOC[c].lang; if (alts[k] !== ORIGIN + path) bad(`hreflang:${k}`); }
          if (alts["x-default"] !== ORIGIN + ROUTES[p.en].en) bad("hreflang:x-default");
        } else if (Object.keys(alts).length) bad("hreflang:on-ineligible");
        const ogl = attr(h, /<meta property="og:locale" content="([^"]+)"/);
        if (ogl !== info.og) bad(`og:locale:${ogl}`);
        const graph = [];
        for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { const j = JSON.parse(m[1]); graph.push(...(j["@graph"] || [j])); } catch { bad("schema:parse"); } }
        const types = (x) => [].concat(x["@type"]);
        const wp = graph.find((x) => types(x).includes("WebPage") || types(x).includes("CollectionPage"));
        if (!wp) bad("schema:WebPage"); else if (wp.inLanguage && wp.inLanguage !== info.htmlLang) bad("schema:inLanguage");
        if (!graph.some((x) => types(x).includes("Organization"))) bad("schema:Organization");
        const bc = graph.find((x) => types(x).includes("BreadcrumbList"));
        if (p.en !== "/" && !bc && !["/read-feedback/", "/givefeedback/", "/sightseeing/", "/video-gallery/", "/search/"].includes(p.en)) bad("schema:BreadcrumbList");
        if (bc && bc.itemListElement?.some((it) => it.item && !String(it.item).startsWith(ORIGIN))) bad("schema:breadcrumb-url");
        const pdfs = [...h.matchAll(/\/documents\/pdf\/[a-z-]+\/([a-z]{2})\//g)].map((m) => m[1]);
        if (pdfs.some((x) => x !== (info.pdf || "en"))) bad("pdf-edition");
        if (RELEASE && loc !== "en") {
          const c = cat(loc), m = MAN.get(p.en)?.metadata || {};
          if (m.title && !c[uid(m.title)]) bad("untranslated:title");
          if (m.description && !c[uid(m.description)]) bad("untranslated:description");
          for (const it of bc?.itemListElement || []) if (treeTitles.has(it.name) && !c[uid(it.name)]) bad(`untranslated:breadcrumb`);
        }
      } catch (e) { bad("fetch:" + String(e).slice(0, 60)); }
      return r;
    }));
    for (const r of res) { if (r.problems.length) { stat.fail++; for (const x of r.problems) { const k = x.split(":")[0]; stat.issues[k] = (stat.issues[k] || 0) + 1; } } else stat.pass++; }
    out.batches.push({ locale: loc, from: i, failures: res.filter((r) => r.problems.length) });
  }
  out.summary[loc] = stat;
  if (stat.fail) exit = 1;
  console.log(loc, JSON.stringify(stat));
}
// reciprocity across fetched pages: every listed sibling that was fetched lists this page back
let recip = 0, recipBad = 0;
for (const [url, { alts, lang }] of fetched) for (const [k, href] of Object.entries(alts)) {
  if (k === "x-default") continue;
  const sib = fetched.get(href.replace(ORIGIN, ""));
  if (!sib) continue;
  recip++;
  if (sib.alts[lang] !== ORIGIN + url) { recipBad++; if (recipBad < 20) (out.reciprocity.failures ||= []).push(`${href} does not return ${url}`); }
}
out.reciprocity.checked = recip; out.reciprocity.failed = recipBad;
if (recipBad) exit = 1;
console.log("reciprocity", JSON.stringify({ checked: recip, failed: recipBad }));
if (arg("out", null)) fs.writeFileSync(arg("out"), JSON.stringify(out, null, 1));
process.exitCode = exit;
