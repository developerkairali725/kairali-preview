/** EF-04/EF-25 family-header probe (read-only): per route × viewport, the header surface,
 * occupied viewport (default + panel open), duplicates, CTA bar, finder state, page errors.
 *   node tools/fh-probe.mjs --base http://localhost:4471 --routes /a/,/b/ [--engine webkit] [--shots dir] */
import fs from "node:fs"; import path from "node:path"; import { createRequire } from "node:module";
const arg = (n, d) => { const i = process.argv.indexOf("--" + n); return i > -1 ? process.argv[i + 1] : d; };
const require_ = createRequire(import.meta.url);
let dir = process.cwd(), store; for (let i = 0; i < 6 && !store; i++) { const s = path.join(dir, "node_modules", ".pnpm"); if (fs.existsSync(s)) store = s; dir = path.dirname(dir); }
const pw = require_(path.join(store, fs.readdirSync(store).find((d) => d.startsWith("playwright@")), "node_modules", "playwright"));
const BASE = arg("base", "http://localhost:4471"), SHOTS = arg("shots", ""), ENGINE = arg("engine", "chromium");
const routes = arg("routes", "/").split(",");
const VPS = (arg("viewports", "360x640,390x844,430x932,1440x900")).split(",").map((v) => { const [w, h] = v.split("x").map(Number); return { w, h }; });
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
const b = await pw[ENGINE].launch(); const out = [];
for (const vp of VPS) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.w < 800 && ENGINE !== "firefox", hasTouch: vp.w < 800 });
  await ctx.addInitScript(() => { try { localStorage.setItem("ktahv-consent", "declined"); } catch (e) {} });
  for (const r of routes) {
    const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 140)));
    const row = { route: r, vp: `${vp.w}x${vp.h}` };
    try {
      const resp = await p.goto(BASE + r, { waitUntil: "load", timeout: 60000 }); row.status = resp.status();
      await p.waitForTimeout(2600);
      await p.evaluate(() => window.scrollTo(0, 900)); await p.waitForTimeout(700);
      const m = () => p.evaluate(() => {
        const vh = innerHeight, fixed = [];
        for (const el of document.querySelectorAll("body *")) { const cs = getComputedStyle(el); if (cs.position !== "fixed" && cs.position !== "sticky") continue; if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) continue; const rr = el.getBoundingClientRect(); if (rr.width < innerWidth * 0.5 || rr.height < 8 || rr.bottom <= 0 || rr.top >= vh) continue; let q = el.parentElement, nested = false; while (q) { const ps = getComputedStyle(q).position; if (ps === "fixed" || ps === "sticky") { nested = true; break; } q = q.parentElement; } if (nested) continue; const t = (el.innerText || "").trim(); if (/^Skip to/i.test(t) || el.getAttribute("aria-label") === "Cookie notice") continue; fixed.push([Math.max(0, rr.top), Math.min(vh, rr.bottom), (el.getAttribute("aria-label") || el.tagName + (el.id ? "#" + el.id : "")).slice(0, 30)]); }
        fixed.sort((a, c) => a[0] - c[0]); let cov = 0, cur = null; for (const [a, c] of fixed) { if (!cur || a > cur[1]) { if (cur) cov += cur[1] - cur[0]; cur = [a, c]; } else cur[1] = Math.max(cur[1], c); } if (cur) cov += cur[1] - cur[0];
        const vis = (e) => { if (!e) return false; const rr = e.getBoundingClientRect(); const cs = getComputedStyle(e); return rr.width > 0 && rr.height > 0 && cs.visibility !== "hidden"; };
        return { familyMode: document.documentElement.getAttribute("data-ahv-fh"), coveredPct: Math.round(cov / vh * 100), bars: fixed.map((f) => f[2] + ":" + Math.round(f[1] - f[0])),
          fhButtons: [...document.querySelectorAll("[data-ahv-fh-btn]")].filter(vis).map((e) => e.getAttribute("data-ahv-fh-btn")),
          primaryVisible: [...document.querySelectorAll("header nav")].filter((n) => n.querySelectorAll("a").length >= 4 && vis(n)).length,
          railVisible: [...document.querySelectorAll("nav[data-ahv-section-nav]")].filter(vis).length,
          ctaBarVisible: [...document.querySelectorAll("[data-ahv-cta-bar]")].filter(vis).length + [...document.querySelectorAll("a[href*='online-consultation']")].filter((a) => { let e = a; for (let i = 0; i < 4 && e; i++) { if (getComputedStyle(e).position === "fixed") return vis(a); e = e.parentElement; } return false; }).length,
          langVisible: [...document.querySelectorAll(".ahv-lang-btn")].filter(vis).length,
          finder: document.querySelector("nav[data-ahv-fh-finder]") ? getComputedStyle(document.querySelector("nav[data-ahv-fh-finder]")).position + " filters:" + (document.querySelector(".ahv-fh-filters") || {}).textContent : null };
      });
      row.default = await m();
      const btn = p.locator("[data-ahv-fh-btn]:visible").first();
      if (await btn.count()) {
        await btn.click(); await p.waitForTimeout(400);
        row.open = await p.evaluate(() => { const pn = document.getElementById("ahv-fh-panel"); const rr = pn && pn.getBoundingClientRect(); return pn && !pn.hidden ? { top: Math.round(rr.top), h: Math.round(rr.height), current: (pn.querySelector('.ahv-fh-family [aria-current="page"]') || {}).textContent, familyLinks: pn.querySelectorAll(".ahv-fh-family a").length, mainLinks: pn.querySelectorAll(".ahv-fh-main a").length, focus: document.activeElement && document.activeElement.textContent.trim().slice(0, 30), expanded: document.querySelector("[data-ahv-fh-btn]:not([hidden])").getAttribute("aria-expanded") } : "not opened"; });
        if (SHOTS && (vp.w === 390 || vp.w === 1440)) await p.screenshot({ path: `${SHOTS}/${ENGINE}-${r.replace(/[\/?=]+/g, "_").replace(/^_|_$/g, "") || "home"}-${vp.w}-open.png` });
        await p.keyboard.press("Escape"); await p.waitForTimeout(250);
        row.afterEscape = await p.evaluate(() => ({ panelHidden: document.getElementById("ahv-fh-panel").hidden, focusOnButton: !!(document.activeElement && document.activeElement.hasAttribute("data-ahv-fh-btn")) }));
      }
      if (SHOTS && (vp.w === 390 || vp.w === 1440 || vp.w === 360)) { await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300); await p.screenshot({ path: `${SHOTS}/${ENGINE}-${r.replace(/[\/?=]+/g, "_").replace(/^_|_$/g, "") || "home"}-${vp.w}.png` }); }
    } catch (e) { row.error = String(e).slice(0, 160); }
    row.errors = errs; out.push(row); await p.close();
    console.log(JSON.stringify(row));
  }
  await ctx.close();
}
await b.close();
if (arg("out")) fs.writeFileSync(arg("out"), JSON.stringify(out, null, 1));
