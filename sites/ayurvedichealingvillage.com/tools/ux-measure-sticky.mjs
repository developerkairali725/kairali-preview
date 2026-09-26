/**
 * EF-04 evidence: measure how much of the viewport the persistent chrome
 * (fixed/sticky header, secondary family nav, filter bar, CTA bar) occupies,
 * at scroll 0 and after scrolling, per page and viewport. Read-only; writes a
 * JSON report + screenshots.
 *   node tools/ux-measure-sticky.mjs --base http://localhost:4471 --out <dir> [--paths /,/offers/]
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require_ = createRequire(import.meta.url);
const arg = (n, d) => { const i = process.argv.indexOf("--" + n); return i > -1 ? process.argv[i + 1] : d; };
let dir = process.cwd(), store = null;
for (let up = 0; up < 6 && !store; up++) { const s = path.join(dir, "node_modules", ".pnpm"); if (fs.existsSync(s)) store = s; dir = path.dirname(dir); }
const pw = fs.readdirSync(store).find((d) => d.startsWith("playwright@"));
const { chromium } = require_(path.join(store, pw, "node_modules", "playwright"));

const BASE = arg("base", "http://localhost:4471");
const OUT = arg("out", "/tmp/ux-sticky");
const PATHS = arg("paths", "/,/ayurvedic-treatments/,/yoga-meditation-programs/,/ananda-lahari-yoga-and-ayurveda-retreat/,/alcohol-free/,/offers/,/gallery/,/contact-us/").split(",");
const VIEWPORTS = [
  { name: "360x640", width: 360, height: 640, mobile: true },
  { name: "390x844", width: 390, height: 844, mobile: true },
  { name: "430x932", width: 430, height: 932, mobile: true },
  { name: "1440x900", width: 1440, height: 900, mobile: false },
];
fs.mkdirSync(OUT, { recursive: true });

const measure = () => {
  const vh = innerHeight, vw = innerWidth, out = [];
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (cs.position !== "fixed" && cs.position !== "sticky") continue;
    if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) continue;
    const r = el.getBoundingClientRect();
    if (r.width < vw * 0.5 || r.height < 8 || r.bottom <= 0 || r.top >= vh) continue; // full-width bars only
    // skip nested: an ancestor already counted
    let p = el.parentElement, nested = false;
    while (p) { const ps = getComputedStyle(p).position; if (ps === "fixed" || ps === "sticky") { nested = true; break; } p = p.parentElement; }
    if (nested) continue;
    const t0 = (el.innerText || "").trim();
    if (/^Skip to/i.test(t0)) continue; // visually-hidden skip link (not a bar)
    if (/^We use cookies/i.test(t0) || el.getAttribute("aria-label") === "Cookie notice") continue; // consent notice: one-time, measured separately

    const label = el.getAttribute("aria-label") || el.id || el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.split(/\s+/)[0] : "");
    const text = (el.innerText || "").replace(/\s+/g, " ").trim().slice(0, 90);
    out.push({ label, position: cs.position, top: Math.round(r.top), bottom: Math.round(r.bottom), height: Math.round(Math.min(r.bottom, vh) - Math.max(r.top, 0)), text });
  }
  // union of covered vertical pixels
  const iv = out.map((o) => [Math.max(o.top, 0), Math.min(o.bottom, vh)]).sort((a, b) => a[0] - b[0]);
  let covered = 0, cur = null;
  for (const [a, b] of iv) { if (!cur || a > cur[1]) { if (cur) covered += cur[1] - cur[0]; cur = [a, b]; } else cur[1] = Math.max(cur[1], b); }
  if (cur) covered += cur[1] - cur[0];
  const ctas = [...document.querySelectorAll("a,button")].filter((a) => { const r = a.getBoundingClientRect(); return r.width && r.height && r.top < vh && r.bottom > 0 && /^(call|enquire|enquiry|free consult|book|whatsapp|consult)/i.test((a.innerText || a.getAttribute("aria-label") || "").trim()); }).map((a) => (a.innerText || a.getAttribute("aria-label")).trim().replace(/\s+/g, " ").slice(0, 40));
  return { vh, bars: out, coveredPx: covered, coveredPct: Math.round((covered / vh) * 100), visibleCtas: [...new Set(ctas)] };
};

const browser = await chromium.launch();
const report = { base: BASE, at: new Date().toISOString(), note: "Local Chromium (Playwright) emulation — not a physical iPhone/WebKit test.", pages: [] };
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.mobile, hasTouch: vp.mobile, deviceScaleFactor: vp.mobile ? 2 : 1 });
  const page = await ctx.newPage();
  for (const p of PATHS) {
    const row = { path: p, viewport: vp.name };
    try {
      await page.goto(BASE + p, { waitUntil: "load", timeout: 60000 });
      await page.waitForTimeout(2500);
      row.top = await page.evaluate(measure);
      const slug = (p.replace(/\//g, "_") || "_home").replace(/^_|_$/g, "") || "home";
      if (vp.name === "390x844" || vp.name === "360x640") await page.screenshot({ path: `${OUT}/${slug}-${vp.name}-top.png` });
      await page.mouse.wheel(0, 700); await page.waitForTimeout(900);
      await page.mouse.wheel(0, 700); await page.waitForTimeout(900);
      row.scrolled = await page.evaluate(measure);
      if (vp.name === "390x844" || vp.name === "360x640") await page.screenshot({ path: `${OUT}/${slug}-${vp.name}-scrolled.png` });
      await page.mouse.wheel(0, -300); await page.waitForTimeout(900);
      row.scrolledUp = await page.evaluate(measure);
    } catch (e) { row.error = String(e).slice(0, 120); }
    report.pages.push(row);
    console.log(vp.name, p, row.error || `top ${row.top.coveredPct}% scrolled ${row.scrolled.coveredPct}% up ${row.scrolledUp.coveredPct}% bars ${row.scrolled.bars.map((b) => b.label + ":" + b.height).join(" | ")}`);
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync(`${OUT}/sticky-measure.json`, JSON.stringify(report, null, 1));
