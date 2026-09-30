#!/usr/bin/env node
/**
 * AHV — find WHAT overflows, before changing anything.
 *
 * The 252-route sweep reports "horizontal overflow" as a boolean: at 1024 the
 * document scrolls sideways on 34 routes. A boolean is not a cause. Widening a
 * container or hanging `overflow-x: hidden` on <body> to make the boolean flip
 * is the classic wrong fix — it hides the symptom, keeps the element sticking
 * out, and clips it for a real reader instead of a measurement.
 *
 * So this tool measures rather than guesses. For each route it walks the
 * rendered DOM at 1024 and reports every element whose right edge crosses the
 * viewport, keeping only the OUTERMOST offenders — if a wide table pushes its
 * wrapper, its section and its row past the edge, the table is the finding and
 * the three ancestors are noise. For each it records the selector, the measured
 * right edge, the element's own width, and the handful of computed properties
 * that can actually cause it (width/min-width/white-space/position/margin).
 *
 * Read-only. Writes one JSON report; changes nothing.
 *   node tools/diagnose-overflow.mjs [--width 1024] [--out <file>] [--routes / /a/]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, "..");
const argv = process.argv.slice(2);
const flag = (n, d) => { const i = argv.indexOf(n); return i > -1 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : d; };
const list = (n) => { const i = argv.indexOf(n); if (i < 0) return null; const o = []; for (let j = i + 1; j < argv.length && !argv[j].startsWith("--"); j++) o.push(argv[j]); return o; };

const BASE = flag("--base", "http://localhost:4321").replace(/\/$/, "");
const WIDTH = Number(flag("--width", "1024"));
const OUT = flag("--out", path.join(SITE, "english-candidate/overflow-diagnosis.json"));
const CONCURRENCY = Number(flag("--concurrency", "4"));

// Default subject: exactly the routes the last sweep flagged, read from its own
// output rather than retyped, so this can never drift from what CI measured.
const ROUTES = list("--routes") ?? (() => {
  const v = JSON.parse(fs.readFileSync(path.join(SITE, "..", "..", "launches", "ayurvedichealingvillage.com", "evidence", "route-verification", "route-verification.json"), "utf8"));
  return [...new Set(v.results.filter((r) => (r.problems || []).some((p) => /horizontal overflow/.test(String(p)))).map((r) => r.route))];
})();

const DESIGN_ROOT_ID = "ahv-design-root";

async function diagnose(page, route) {
  const url = BASE + route;
  const rec = { route, width: WIDTH, url, offenders: [] };
  try {
    await page.goto(url, { waitUntil: "load", timeout: 45000 });
    await page.locator("h1").first().waitFor({ timeout: 20000 }).catch(() => {});
    await page.evaluate(() => document.fonts.ready);
    // The design mounts asynchronously; measuring before it settles measures a
    // page that never shipped. Wait on the runtime's own readiness attribute.
    await page.waitForFunction((rootId) => {
      const el = document.getElementById(rootId);
      if (!el) return true;
      const s = el.getAttribute("data-ahv-snapshot-state");
      return s === "released" || s === "retired";
    }, DESIGN_ROOT_ID, { timeout: 45000, polling: 200 }).catch(() => {});
    await page.waitForTimeout(400);

    Object.assign(rec, await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const doc = { scrollWidth: document.documentElement.scrollWidth, clientWidth: vw, bodyScrollWidth: document.body.scrollWidth };
      const sel = (e) => {
        if (e.id) return `#${e.id}`;
        const cls = (e.getAttribute("class") || "").trim().split(/\s+/).filter(Boolean).slice(0, 3).join(".");
        return e.tagName.toLowerCase() + (cls ? `.${cls}` : "");
      };
      const pathOf = (e) => { const p = []; for (let n = e; n && n.nodeType === 1 && p.length < 6; n = n.parentElement) p.unshift(sel(n)); return p.join(" > "); };

      const over = [];
      for (const e of document.querySelectorAll("body *")) {
        const r = e.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        const cs = getComputedStyle(e);
        if (cs.visibility === "hidden" || cs.display === "none") continue;
        if (r.right > vw + 1) over.push({ e, right: Math.round(r.right), left: Math.round(r.left), w: Math.round(r.width) });
      }
      // Keep only the outermost: drop any offender that has an offending ancestor.
      const set = new Set(over.map((o) => o.e));
      const outer = over.filter((o) => { for (let n = o.e.parentElement; n; n = n.parentElement) if (set.has(n)) return false; return true; });

      return {
        doc,
        overflowing: doc.scrollWidth > vw + 1,
        totalOffenders: over.length,
        offenders: outer
          .sort((a, b) => b.right - a.right)
          .slice(0, 8)
          .map((o) => {
            const cs = getComputedStyle(o.e);
            return {
              selector: sel(o.e),
              path: pathOf(o.e),
              right: o.right, left: o.left, width: o.w,
              overhang: o.right - vw,
              scrollWidth: o.e.scrollWidth,
              css: {
                width: cs.width, minWidth: cs.minWidth, maxWidth: cs.maxWidth,
                position: cs.position, display: cs.display,
                whiteSpace: cs.whiteSpace, overflowX: cs.overflowX,
                marginLeft: cs.marginLeft, marginRight: cs.marginRight,
                paddingLeft: cs.paddingLeft, paddingRight: cs.paddingRight,
                flexShrink: cs.flexShrink, gridTemplateColumns: cs.gridTemplateColumns.slice(0, 120),
              },
              text: (o.e.tagName === "IMG" ? o.e.currentSrc || o.e.src : (o.e.innerText || "").trim().slice(0, 80)),
            };
          }),
      };
    }));
  } catch (err) {
    rec.error = String(err.message ?? err).split("\n")[0];
  }
  return rec;
}

const browser = await chromium.launch();
const results = [];
const queue = [...ROUTES];
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
  const ctx = await browser.newContext({ viewport: { width: WIDTH, height: 900 } });
  const page = await ctx.newPage();
  for (let r = queue.shift(); r; r = queue.shift()) {
    const rec = await diagnose(page, r);
    results.push(rec);
    process.stdout.write(`${rec.overflowing ? "OVER" : "ok  "}  ${rec.route}  +${rec.offenders?.[0]?.overhang ?? 0}px  ${rec.offenders?.[0]?.selector ?? ""}\n`);
  }
  await ctx.close();
}));
await browser.close();

results.sort((a, b) => a.route.localeCompare(b.route));
fs.writeFileSync(OUT, JSON.stringify({ generated: new Date().toISOString(), base: BASE, width: WIDTH, routes: ROUTES.length, results }, null, 2));

// Group by cause so the fix is per-cause, not per-route. Only routes whose
// DOCUMENT actually scrolls sideways count: an element can hang past the
// viewport and be clipped by an ancestor, which is a layout smell but not the
// defect the sweep reports, and mixing the two inflates the number.
const byCause = new Map();
for (const r of results.filter((x) => x.overflowing)) for (const o of r.offenders ?? []) {
  const k = o.selector;
  if (!byCause.has(k)) byCause.set(k, { selector: k, routes: [], maxOverhang: 0, css: o.css, sample: o.path });
  const g = byCause.get(k);
  g.routes.push(r.route); g.maxOverhang = Math.max(g.maxOverhang, o.overhang);
}
console.log(`\n${results.filter((r) => r.overflowing).length} of ${results.length} route(s) still overflow at ${WIDTH}.`);
console.log(`\ndistinct offending selectors, worst first:`);
for (const g of [...byCause.values()].sort((a, b) => b.routes.length - a.routes.length)) {
  console.log(`  ${g.routes.length.toString().padStart(3)} route(s)  +${g.maxOverhang}px  ${g.selector}`);
  console.log(`            width:${g.css.width} min-width:${g.css.minWidth} pos:${g.css.position} ws:${g.css.whiteSpace} display:${g.css.display}`);
}
console.log(`\nreport: ${path.relative(SITE, OUT)}`);
