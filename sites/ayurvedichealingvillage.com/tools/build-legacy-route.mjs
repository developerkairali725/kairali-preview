#!/usr/bin/env node
/**
 * AHV — build a live page the design package never received.
 *
 * WHY THIS EXISTS. Two live pages were ruled BUILD on 2026-09-20 and neither is
 * in the approved package. Their source kits were completed on 2026-09-01 and
 * their design pass was never started, so the manifest — which is generated
 * from what the package contains — had nothing to report. Of 241 page kits,
 * exactly these two never reached the rebuild.
 *
 *   /karkidaka-chikitsha-or-monsoon-wellness.html  seasonal programme LP, EN
 *   /treatment-in-kerala-russian.html              RU, and served as mojibake
 *
 * WHAT IT DOES NOT DO. It does not design anything and it does not write copy.
 * It reads the live page, recovers it if it is damaged, and carries the content
 * onto the site's own article-reader template — the family built for long-form
 * pages, and the one this session's overflow fix corrected. Every string it
 * emits came off the page; nothing is translated, summarised or improved.
 *
 * WHY THE ARTICLE TEMPLATE AND NOT THE CAMPAIGN ONE. The Russian page's English
 * twin, /treatment-in-kerala.html, is on the T06 campaign template, so the
 * obvious move is to put the Russian one there too. That template takes about
 * thirty hand-mapped structured fields — hero, property, awards, isItForMe,
 * postCare and the rest — and mapping them means deciding which Russian
 * paragraph is the "property" copy and which is the "mission" copy. Nobody in
 * this lane reads Russian. Guessing that mapping would be inventing structure
 * for content I cannot check, so the page goes onto the template that takes its
 * content in document order and preserves it exactly. Flagged, not hidden: the
 * two pages will not look alike until someone who reads Russian maps the fields.
 *
 * MEASURED IN A REAL BROWSER, like everything else here. The legacy markup is
 * hand-built and messy; a regex walk over it produces plausible nonsense. This
 * renders the (recovered) HTML and reads the DOM, so what it captures is what a
 * reader sees — visible blocks only, in visual order, chrome excluded by role.
 *
 * IMAGES ARE SELF-HOSTED. Every image is downloaded into the repo. The route
 * sweep fails any state that makes an off-origin request, and a rebuilt page
 * that still pulls its pictures from the WordPress host is a page that breaks
 * the day that host moves.
 *
 *   node tools/build-legacy-route.mjs --route /x.html --slug x --source <file> [--dry]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { recover, verify } from "./lib/mojibake.mjs";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const flag = (n, d) => { const i = argv.indexOf(n); return i > -1 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : d; };
const DRY = argv.includes("--dry");

const ROUTE = flag("--route", null);
const SLUG = flag("--slug", null);
const SOURCE = flag("--source", null);
if (!ROUTE || !SLUG || !SOURCE) {
  console.error("usage: --route /x.html --slug x --source <captured html> [--dry]");
  process.exit(2);
}

const IMG_DIR = join(SITE, "public/ahv/assets/img/legacy", SLUG);
const IMG_URL = `/ahv/assets/img/legacy/${SLUG}`;

/** Hosts whose images are tracking pixels, never content. */
const TRACKERS = /facebook\.com|google-analytics|googletagmanager|doubleclick|clarity\.ms|bat\.bing/i;

// ---------------------------------------------------------------- recover ---
const rawHtml = readFileSync(SOURCE, "utf8");
const rec = recover(rawHtml);
const ver = verify(rec);
if (rec.converted && !ver.ok) {
  console.error(`REFUSING: ${ver.failures.length} recovered run(s) do not round-trip. A recovery that cannot be proven is a rewrite.`);
  process.exit(1);
}
const html = rec.text;
console.log(`source ${SOURCE}`);
console.log(`  mojibake runs decoded ${rec.converted}/${rec.runs}   round-trips ${rec.converted ? "all " + ver.checked : "n/a"}   Cyrillic 0 -> ${rec.cyrillic}`);

// ------------------------------------------------------------------ blocks ---
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
// Nothing may load from the network: the capture is evidence, not a live page.
await page.route("**/*", (r) => (r.request().resourceType() === "document" ? r.continue() : r.abort()));
await page.setContent(html, { waitUntil: "domcontentloaded" });

const extracted = await page.evaluate(() => {
  const SKIP = new Set(["HEADER", "NAV", "FOOTER", "FORM", "SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "SELECT", "BUTTON"]);
  const inChrome = (el) => {
    for (let n = el; n; n = n.parentElement) if (SKIP.has(n.tagName)) return true;
    return false;
  };
  const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
  /** textContent, but <br> and block children keep the word gap they draw.
   *  Without this, "…in Kerala<br>For a Complete Body Reset" reads back as one
   *  run-on word, which is how a heading silently loses a space. */
  const textOf = (el) => {
    const c = el.cloneNode(true);
    for (const br of c.querySelectorAll("br")) br.replaceWith(" ");
    for (const b of c.querySelectorAll("p,div,li,h1,h2,h3,h4,h5,h6,tr,td,th,section")) {
      b.prepend(" ");
      b.append(" ");
    }
    return clean(c.textContent);
  };

  const out = [];
  const seen = new Set();
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
  for (let el = walk.nextNode(); el; el = walk.nextNode()) {
    if (inChrome(el)) continue;
    const tag = el.tagName;

    if (/^H[1-4]$/.test(tag)) {
      const text = textOf(el);
      if (!text || seen.has("h:" + text)) continue;
      seen.add("h:" + text);
      out.push({ kind: "heading", tag: tag.toLowerCase(), text });
      continue;
    }
    if (tag === "P") {
      // Only paragraphs that carry their own text, not wrappers around others.
      if (el.querySelector("p, h1, h2, h3, h4, ul, ol, img")) continue;
      const text = textOf(el);
      if (text.length < 3 || seen.has("p:" + text)) continue;
      seen.add("p:" + text);
      out.push({ kind: "para", text });
      continue;
    }
    if (tag === "UL" || tag === "OL") {
      if (el.parentElement && el.parentElement.closest("ul, ol")) continue;
      const items = [...el.children]
        .filter((li) => li.tagName === "LI" && !li.querySelector("ul, ol"))
        .map((li) => textOf(li))
        .filter(Boolean);
      if (!items.length) continue;
      const key = "l:" + items.join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ kind: "list", ordered: tag === "OL", items });
      continue;
    }
    if (tag === "IMG") {
      const src = el.getAttribute("src") || "";
      if (!src || src.startsWith("data:")) continue;
      if (seen.has("i:" + src)) continue;
      seen.add("i:" + src);
      const fig = el.closest("figure");
      out.push({
        kind: "figure",
        sourceUrl: new URL(src, "https://ayurvedichealingvillage.com/").href,
        alt: clean(el.getAttribute("alt")),
        caption: fig && fig.querySelector("figcaption") ? textOf(fig.querySelector("figcaption")) : "",
      });
    }
  }
  return {
    blocks: out,
    title: document.title.trim(),
    lang: document.documentElement.lang || "",
    description: document.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() || "",
  };
});
await browser.close();

const blocks = extracted.blocks.filter((b) => !(b.kind === "figure" && TRACKERS.test(b.sourceUrl)));
const kinds = blocks.reduce((m, b) => ({ ...m, [b.kind]: (m[b.kind] ?? 0) + 1 }), {});
console.log(`  blocks ${blocks.length}  ${Object.entries(kinds).map(([k, n]) => `${k}:${n}`).join("  ")}`);

// ------------------------------------------------------------------ images ---
mkdirSync(IMG_DIR, { recursive: true });
let fetched = 0;
let reused = 0;
const failed = [];
for (const b of blocks) {
  if (b.kind !== "figure") continue;
  const name = decodeURIComponent(new URL(b.sourceUrl).pathname.split("/").pop() || "").replace(/[^\w.-]+/g, "-");
  const dest = join(IMG_DIR, name);
  b.src = `${IMG_URL}/${name}`;
  if (existsSync(dest)) { reused += 1; continue; }
  if (DRY) continue;
  try {
    const res = await fetch(b.sourceUrl, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    fetched += 1;
  } catch (err) {
    failed.push(`${name}: ${String(err.message ?? err).split("\n")[0]}`);
  }
}
console.log(`  images ${fetched} downloaded, ${reused} already here, ${failed.length} failed`);
for (const f of failed) console.log(`     ${f}`);

// ------------------------------------------------------------------ record ---
const record = {
  path: ROUTE,
  slug: SLUG,
  title: extracted.title,
  h1: blocks.find((b) => b.kind === "heading" && b.tag === "h1")?.text ?? extracted.title,
  provenance: {
    ruling: "Abilash, 2026-09-20 — ruled BUILD after the page was found live and absent from the rebuild",
    source: "live capture, recovered where damaged",
    mojibakeRunsRecovered: rec.converted,
    recoveryVerified: rec.converted ? ver.ok : null,
    builtBy: "tools/build-legacy-route.mjs",
  },
  metadata: {
    title: extracted.title,
    description: extracted.description,
    htmlLang: extracted.lang || "en",
    canonical: `https://ayurvedichealingvillage.com${ROUTE}`,
  },
  items: blocks.map((b) =>
    b.kind === "heading" ? { kind: "heading", tag: b.tag, text: b.text, tree: [{ k: "t", v: b.text }] }
      : b.kind === "para" ? { kind: "para", text: b.text, tree: [{ k: "t", v: b.text }] }
      : b.kind === "list" ? { kind: "list", ordered: !!b.ordered, items: b.items }
      : { kind: "figure", src: b.src, sourceUrl: b.sourceUrl, alt: b.alt || "", caption: b.caption || "" }),
};

const OUT = join(SITE, "english-candidate/legacy-routes");
mkdirSync(OUT, { recursive: true });
const outFile = join(OUT, `${SLUG}.json`);
if (!DRY) writeFileSync(outFile, JSON.stringify(record, null, 1) + "\n");
console.log(`${DRY ? "[dry] " : ""}record -> ${outFile.replace(SITE + "/", "")}`);
console.log(`  title : ${record.title.slice(0, 90)}`);
console.log(`  h1    : ${record.h1.slice(0, 90)}`);
console.log(`  lang  : ${record.metadata.htmlLang}`);
