#!/usr/bin/env node
/**
 * AHV — verbatim live copy for the 8 undrawn Knowledge/Explainer routes.
 *
 * WHY THIS TOOL EXISTS. The Claude Design session building the T04 family has
 * verbatim source for only the 3 routes it drew, and cannot fetch the other 8
 * itself: every page on this site carries a very large multilingual mega-menu,
 * so a naive fetch is ~80% chrome. It wrote a prompt asking GPT to browse and
 * return the JSON. This does the same job deterministically instead — same 8
 * URLs, same exclusions, but the extraction is a rule rather than a model's
 * best effort, and the counts are measured rather than reported.
 *
 * THE CONTAINER, found by inspection not assumption: every page has exactly
 * ONE <main>, id="wp--skip-link--target". The mega-menu, the language
 * switchers, the footer columns, the newsletter form, the exit-intent popup
 * and the chat widget all sit OUTSIDE it. Anything chrome-like that is still
 * inside is removed by the explicit drop list below, and each drop is counted
 * and reported so a silent over-removal is impossible.
 *
 * VERBATIM IS THE WHOLE POINT. Text is taken exactly as published — typos,
 * double spaces, curly quotes, en dashes, "Ayurveda" vs "ayurveda". The URL
 * `ayurvedic-resturant-and-cooking-at-healing-village` is the live
 * misspelling and is NOT corrected. This copy is being migrated byte-for-byte
 * and is SEO-critical.
 *
 * The output carries three layers so the consumer is never stuck with my
 * parse: the raw verbatim inner HTML of <main>, a parsed block list, and
 * measured counts.
 *
 *   node tools/fetch-explainer-routes.mjs [--out <path>]
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://ayurvedichealingvillage.com";
const argv = process.argv.slice(2);
const OUT = join(SITE, argv.includes("--out") ? argv[argv.indexOf("--out") + 1] : "english-candidate/knowledge-explainer-8-routes.json");

/** The 8 routes the drop does not draw. Spellings are the live ones. */
const ROUTES = [
  "/why-get-training-in-ayurveda/",
  "/new-to-yoga/",
  "/what-is-ayurvedic-food/",
  "/what-is-panchkarma/",
  "/live-to-100-with-panchkarma/",
  "/why-pick-an-ayurveda-treatment-or-ayurvedic-retreat/",
  "/ayurvedic-resturant-and-cooking-at-healing-village/",
  "/ayurveda-retreats-for-everyone/",
];

/** Chrome that can appear INSIDE <main>. Each removal is counted. */
const DROP = [
  ["nav", /<nav\b[\s\S]*?<\/nav>/gi],
  ["newsletter form", /<form\b[^>]*(?:newsletter|subscribe)[\s\S]*?<\/form>/gi],
  ["exit-intent popup", /<div\b[^>]*(?:popup|modal|exit-intent)[^>]*>[\s\S]*?<\/div>/gi],
  ["youtube embed", /<iframe\b[^>]*(?:youtube|youtu\.be)[\s\S]*?<\/iframe>/gi],
  ["script", /<script\b[\s\S]*?<\/script>/gi],
  ["style", /<style\b[\s\S]*?<\/style>/gi],
  ["noscript", /<noscript\b[\s\S]*?<\/noscript>/gi],
];

const attr = (html, re) => (re.exec(html) ?? [])[1] ?? null;
const decode = (s) => s
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&nbsp;/g, " ");
const text = (html) => decode(html.replace(/<[^>]+>/g, " ")).replace(/[ \t ]+/g, " ").trim();

/** Inner HTML of the single <main>, by tag balance rather than a lazy regex. */
function mainInner(html) {
  const open = /<main\b[^>]*>/i.exec(html);
  if (!open) throw new Error("no <main> on the page");
  let i = open.index + open[0].length, depth = 1;
  const re = /<\/?main\b[^>]*>/gi;
  re.lastIndex = i;
  let m;
  while ((m = re.exec(html))) {
    depth += m[0][1] === "/" ? -1 : 1;
    if (depth === 0) return html.slice(i, m.index);
  }
  throw new Error("unterminated <main>");
}

/** Blocks, in document order, from the cleaned main HTML. */
function blocks(html) {
  const out = [];
  const re = /<(h1|h2|h3|h4|p|ul|ol|dl|table|figure|blockquote)\b([^>]*)>([\s\S]*?)<\/\1\s*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const [, tag, , inner] = m;
    const t = text(inner);
    if (tag === "ul" || tag === "ol") {
      const items = [...inner.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li\s*>/gi)].map((x) => text(x[1])).filter(Boolean);
      if (items.length) out.push({ type: tag === "ul" ? "bulletList" : "numberedList", items });
      continue;
    }
    if (tag === "dl") {
      const terms = [...inner.matchAll(/<dt\b[^>]*>([\s\S]*?)<\/dt\s*>[\s\S]*?<dd\b[^>]*>([\s\S]*?)<\/dd\s*>/gi)]
        .map((x) => ({ term: text(x[1]), definition: text(x[2]) }));
      if (terms.length) out.push({ type: "definitionList", terms });
      continue;
    }
    if (tag === "figure") {
      const src = attr(inner, /<img\b[^>]*\bsrc="([^"]+)"/i);
      const alt = attr(inner, /<img\b[^>]*\balt="([^"]*)"/i);
      const cap = /<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i.exec(inner);
      out.push({ type: "figure", src, alt, caption: cap ? text(cap[1]) : null });
      continue;
    }
    if (tag === "table") { out.push({ type: "table", html: inner.trim() }); continue; }
    if (tag === "blockquote") { if (t) out.push({ type: "pullQuote", text: t }); continue; }
    if (!t) continue;
    out.push({ type: tag === "p" ? "paragraph" : `heading${tag.slice(1)}`, text: t });
  }
  return out;
}

const browser = await chromium.launch();
const ctx = await browser.newContext();
const routes = {};
const report = [];

for (const path of ROUTES) {
  const res = await ctx.request.get(ORIGIN + path, { timeout: 40000 });
  const html = await res.text();
  if (res.status() !== 200) { report.push([path, `HTTP ${res.status()}`]); continue; }

  let main = mainInner(html);
  const dropped = {};
  for (const [label, re] of DROP) {
    const n = (main.match(re) ?? []).length;
    if (n) { dropped[label] = n; main = main.replace(re, ""); }
  }

  const body = text(main);
  const words = body ? body.split(/\s+/).length : 0;
  const count = (t) => (main.match(new RegExp(`<${t}\\b`, "gi")) ?? []).length;

  routes[path] = {
    url: ORIGIN + path,
    httpStatus: res.status(),
    meta: {
      title: attr(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
      description: attr(html, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i),
      canonical: attr(html, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i),
      robots: attr(html, /<meta[^>]+name="robots"[^>]+content="([^"]*)"/i),
      ogTitle: attr(html, /<meta[^>]+property="og:title"[^>]+content="([^"]*)"/i),
      ogDescription: attr(html, /<meta[^>]+property="og:description"[^>]+content="([^"]*)"/i),
      ogImage: attr(html, /<meta[^>]+property="og:image"[^>]+content="([^"]*)"/i),
    },
    h1: (blocks(main).find((b) => b.type === "heading1") ?? {}).text ?? null,
    counts: {
      words, h2: count("h2"), h3: count("h3"), listItems: count("li"),
      images: count("img"), paragraphs: count("p"), tables: count("table"),
    },
    chromeRemovedInsideMain: dropped,
    blocks: blocks(main),
    verbatimMainHtml: main.trim(),
  };
  const c = routes[path].counts;
  report.push([path, `${words}w · h2 ${c.h2} · h3 ${c.h3} · li ${c.listItems} · img ${c.images}${words < 400 ? "  ** UNDER 400 WORDS — wrong container? **" : ""}`]);
}
await browser.close();

const payload = {
  fetched: new Date().toISOString(),
  source: "live server-rendered HTML, single <main id=wp--skip-link--target> per page",
  extractedBy: "sites/ayurvedichealingvillage.com/tools/fetch-explainer-routes.mjs",
  verbatim: "text copied exactly as published — typos, spacing, curly quotes and dashes preserved; 'resturant' is the live spelling and is NOT corrected",
  excluded: "everything outside <main> (mega-menu, language switchers, footer columns, newsletter, exit-intent popup, chat widget) plus the in-main drop list, counted per route",
  routeCount: Object.keys(routes).length,
  routes,
};
writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`);

console.log(`fetched ${Object.keys(routes).length} of ${ROUTES.length} routes\n`);
for (const [p, line] of report) console.log(`  ${p}\n      ${line}`);
console.log(`\nwrote ${OUT.replace(`${SITE}/`, "")}`);
