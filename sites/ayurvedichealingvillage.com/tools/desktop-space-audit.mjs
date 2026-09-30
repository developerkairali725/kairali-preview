// Desktop space audit (owner, 28 Sep 2026: secondary-family pages use a narrow left column and leave the right side of
// large desktop screens empty). For every English route at a given width, measures inside <main>: the main box, the
// right edge reached by real content (text blocks, images, lists, tables, cards), the empty band to the right, and the
// widest prose column. Grouped by the page's design family so the affected TEMPLATES are named, not guessed. Read-only.
//   node tools/desktop-space-audit.mjs --base http://localhost:4471 --width 1440 [--out file.json] [--only /a/,/b/]
import fs from "node:fs"; import path from "node:path"; import { createRequire } from "node:module"; import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url)); const SITE = path.resolve(HERE, "..");
const store = path.resolve(SITE, "../../node_modules/.pnpm");
const pw = require(path.join(store, fs.readdirSync(store).find((d) => d.startsWith("playwright@")), "node_modules/playwright"));
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg("base", "http://localhost:4471"), W = +arg("width", "1440"), OUT = arg("out", null), ONLY = arg("only", null);
const manifest = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/route-manifest.json"), "utf8")).routes;
const redirected = new Set(Object.keys(JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/redirect-map.json"), "utf8")).redirects));
let routes = manifest.filter((r) => !redirected.has(r.path) && !r.sitemapExclude).map((r) => ({ path: r.path, view: r.desktopView }));
if (ONLY) { const s = new Set(ONLY.split(",")); routes = routes.filter((r) => s.has(r.path)); }
const b = await pw.chromium.launch(); const rows = [];
const queue = [...routes];
async function worker() {
  const ctx = await b.newContext({ viewport: { width: W, height: 1000 } });
  await ctx.addInitScript(() => { try { localStorage.setItem("ktahv-consent", "declined"); } catch (e) {} });
  while (queue.length) {
    const r = queue.shift(); const p = await ctx.newPage();
    try {
      await p.goto(BASE + r.path, { waitUntil: "load", timeout: 60000 }); await p.waitForTimeout(1800);
      const m = await p.evaluate(() => {
        const main = document.querySelector("main"); if (!main) return null;
        const mb = main.getBoundingClientRect();
        const fam = (document.querySelector("[data-ahv-family]") || document.body).getAttribute("data-ahv-family") || "";
        const els = [...main.querySelectorAll("p, h2, h3, li, img, table, figure, blockquote")].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 40 && r.height > 8 && !e.closest("nav, header, footer, [data-ahv-section-nav], aside[aria-label]"); });
        let right = 0, left = 1e9, prose = 0, proseLeft = 0, n = 0;
        for (const e of els) { const r = e.getBoundingClientRect(); right = Math.max(right, r.right); left = Math.min(left, r.left); if (e.tagName === "P" && (e.textContent || "").length > 160) { n++; if (r.width > prose) { prose = r.width; proseLeft = r.left; } } }
        // band scan: every 24px down <main>, the right edge reached by content crossing that line. A band whose content
        // stops before 62% of the content box width (and is not a short heading row) is "left-only" empty space.
        const boxes = els.map((e) => e.getBoundingClientRect()).map((r) => ({ t: r.top + scrollY, b: r.bottom + scrollY, l: r.left, r: r.right }));
        const cL = Math.min(...boxes.map((x) => x.l)), cR = Math.max(...boxes.map((x) => x.r)), cut = cL + 0.62 * (cR - cL);
        let bands = 0, leftOnly = 0;
        for (let y = mb.top + scrollY; y < mb.bottom + scrollY; y += 24) { const hit = boxes.filter((x) => x.t <= y && x.b >= y); if (!hit.length) continue; bands++; if (Math.max(...hit.map((x) => x.r)) < cut) leftOnly++; }
        return { leftOnlyPct: bands ? Math.round(100 * leftOnly / bands) : 0, leftOnlyPx: leftOnly * 24, family: fam, mainLeft: Math.round(mb.left), mainWidth: Math.round(mb.width), contentLeft: Math.round(left), contentRight: Math.round(right), emptyRight: Math.round(mb.right - right), widestProse: Math.round(prose), proseLeft: Math.round(proseLeft), longParas: n, height: Math.round(document.documentElement.scrollHeight) };
      });
      if (m) rows.push({ ...r, ...m });
    } catch (e) { rows.push({ ...r, error: String(e).slice(0, 120) }); }
    await p.close();
  }
  await ctx.close();
}
await Promise.all([worker(), worker(), worker()]);
await b.close();
// per view (template): how many routes leave a large empty band on the right
const byView = {};
for (const r of rows) { if (r.error) continue; const k = r.view; (byView[k] ||= []).push(r); }
const med = (a) => a.sort((x, y) => x - y)[Math.floor(a.length / 2)];
const summary = Object.entries(byView).map(([view, rs]) => ({ view, family: rs[0].family, routes: rs.length, leftOnlyPctMedian: med(rs.map((x) => x.leftOnlyPct)), leftOnlyPxMedian: med(rs.map((x) => x.leftOnlyPx)), emptyRightMedian: rs.map((x) => x.emptyRight).sort((a, b) => a - b)[Math.floor(rs.length / 2)], proseMedian: rs.map((x) => x.widestProse).sort((a, b) => a - b)[Math.floor(rs.length / 2)], mainWidth: rs[0].mainWidth, examples: rs.slice(0, 3).map((x) => x.path) })).sort((a, b) => b.leftOnlyPxMedian - a.leftOnlyPxMedian);
for (const s of summary) console.log(String(s.leftOnlyPctMedian).padStart(4) + "%", String(s.leftOnlyPxMedian).padStart(6) + "px", String(s.proseMedian).padStart(5), String(s.routes).padStart(4), s.view.padEnd(52), s.family.padEnd(18), s.examples.join(" "));
if (OUT) fs.writeFileSync(OUT, JSON.stringify({ base: BASE, width: W, at: new Date().toISOString(), summary, rows }, null, 1));
