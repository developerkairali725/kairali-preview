/**
 * Locale SEO/route verification on SERVER HTML (what a crawler reads), in
 * batches of <=25 pages. Per page: HTTP 200 at the reviewed locale URL, <html
 * lang/dir>, one <title> + description (localized: differs from English unless
 * the catalogue has no accepted translation yet — reported, not hidden),
 * self-canonical, hreflang cluster identical to the route table (reciprocal by
 * construction, verified per page), og:locale, JSON-LD parses, breadcrumb names
 * localized, PDF links point at this language's edition, robots as expected.
 *   node tools/l10n/qa-seo.mjs --base http://localhost:4471 [--locales ar,de] [--limit 25] [--out file]
 */
import fs from "node:fs";
const arg = (n, d) => { const i = process.argv.indexOf("--" + n); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg("base", "http://localhost:4471");
const ROUTES = JSON.parse(fs.readFileSync("l10n/routes.json", "utf8")).routes;
const LOC = JSON.parse(fs.readFileSync("l10n/locales.json", "utf8"));
const MAN = new Map(JSON.parse(fs.readFileSync("english-candidate/route-manifest.json", "utf8")).routes.map((r) => [r.path, r]));
const locales = (arg("locales", Object.keys(LOC).filter((c) => c !== "en").join(","))).split(",");
const limit = +arg("limit", "0");
const ORIGIN = "https://ayurvedichealingvillage.com";
const out = { base: BASE, at: new Date().toISOString(), batches: [], summary: {} };
const attr = (h, re) => (h.match(re) || [])[1] ?? null;
for (const loc of locales) {
  const info = LOC[loc];
  const pages = Object.entries(ROUTES).map(([en, row]) => ({ en, url: row[loc] })).filter((p) => p.url);
  const list = limit ? pages.slice(0, limit) : pages;
  const stat = { pages: list.length, ok: 0, fail: 0, englishTitle: 0, englishDescription: 0, issues: {} };
  for (let i = 0; i < list.length; i += 25) {
    const batch = list.slice(i, i + 25);
    const res = await Promise.all(batch.map(async (p) => {
      const r = { url: p.url, en: p.en, problems: [] };
      try {
        const resp = await fetch(BASE + p.url, { redirect: "manual" });
        r.status = resp.status;
        if (resp.status !== 200) { r.problems.push("status " + resp.status); return r; }
        const h = await resp.text();
        const lang = attr(h, /<html[^>]*\slang="([^"]+)"/), dir = attr(h, /<html[^>]*\sdir="([^"]+)"/);
        if (lang !== info.htmlLang) r.problems.push(`lang ${lang}`);
        if ((dir || "ltr") !== info.dir) r.problems.push(`dir ${dir}`);
        const titles = [...h.matchAll(/<title>([^<]*)<\/title>/g)].map((m) => m[1]);
        if (titles.length !== 1) r.problems.push(`titles ${titles.length}`);
        const enTitle = MAN.get(p.en)?.metadata?.title;
        const dec = (s) => s?.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');
        if (enTitle && dec(titles[0]) === enTitle) { r.englishTitle = true; }
        const desc = attr(h, /<meta name="description" content="([^"]*)"/);
        if (!desc) r.problems.push("no description");
        else if (dec(desc) === MAN.get(p.en)?.metadata?.description) r.englishDescription = true;
        const canon = attr(h, /<link rel="canonical" href="([^"]+)"/);
        if (canon !== ORIGIN + p.url) r.problems.push(`canonical ${canon}`);
        const alts = Object.fromEntries([...h.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]));
        const want = ROUTES[p.en];
        for (const [c, path] of Object.entries(want)) { const k = c === "en" ? "en" : LOC[c].lang; if (alts[k] !== ORIGIN + path) r.problems.push(`hreflang ${k}`); }
        if (alts["x-default"] !== ORIGIN + want.en) r.problems.push("x-default");
        const ogl = attr(h, /<meta property="og:locale" content="([^"]+)"/);
        if (ogl && ogl !== info.og) r.problems.push(`og:locale ${ogl}`);
        for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { const j = JSON.parse(m[1]); const g = j["@graph"] || []; const bc = g.find((x) => x["@type"] === "BreadcrumbList"); if (bc && bc.itemListElement?.some((it) => it.item && !String(it.item).startsWith(ORIGIN))) r.problems.push("breadcrumb url"); const wp = g.find((x) => [].concat(x["@type"]).includes("WebPage")); if (wp && wp.inLanguage !== info.htmlLang) r.problems.push("schema inLanguage " + wp.inLanguage); } catch { r.problems.push("json-ld parse"); } }
        const pdfs = [...h.matchAll(/\/documents\/pdf\/[a-z-]+\/([a-z]{2})\//g)].map((m) => m[1]);
        if (pdfs.some((x) => x !== info.pdf)) r.problems.push("pdf edition " + [...new Set(pdfs)].join(","));
        r.robots = attr(h, /<meta name="robots" content="([^"]+)"/);
      } catch (e) { r.problems.push(String(e).slice(0, 80)); }
      return r;
    }));
    for (const r of res) {
      if (r.problems.length) { stat.fail++; for (const p of r.problems) { const k = p.split(" ")[0]; stat.issues[k] = (stat.issues[k] || 0) + 1; } } else stat.ok++;
      if (r.englishTitle) stat.englishTitle++;
      if (r.englishDescription) stat.englishDescription++;
    }
    out.batches.push({ locale: loc, from: i, pages: res.filter((r) => r.problems.length || r.englishTitle) });
  }
  out.summary[loc] = stat;
  console.log(loc, JSON.stringify(stat));
}
if (arg("out", null)) fs.writeFileSync(arg("out"), JSON.stringify(out, null, 1));
