// Section-level evidence: homepage Ayurvedic Products section + villa-raag.aspx, desktop and mobile.
// Usage: node tests/section-shots.mjs <label>   (label = before | after)
import { chromium } from "playwright";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const BASE = process.env.BASE || "http://127.0.0.1:8774";
const label = process.argv[2] || "after";
const OUT = fileURLToPath(new URL("../../evidence/screens/square-edges/", import.meta.url));
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
const out = [];
for (const [vp, o] of Object.entries({ desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 } })) {
  const ctx = await b.newContext({ viewport: { width: o.width, height: o.height }, isMobile: !!o.isMobile, deviceScaleFactor: o.deviceScaleFactor || 1 });
  const p = await ctx.newPage();
  for (const r of ["/", "/villa-raag.aspx"]) {
    await p.goto(BASE + r, { waitUntil: "networkidle" });
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); } await Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 4000); }))); window.scrollTo(0, 0); });
    const name = r === "/" ? "home" : "villa-raag";
    await p.screenshot({ path: `${OUT}${name}__${vp}__${label}.png`, fullPage: true });
    if (r === "/") {
      const sec = p.locator('section[aria-labelledby="prod-title"]');
      await sec.screenshot({ path: `${OUT}home-products__${vp}__${label}.png` });
      const box = await sec.boundingBox();
      out.push({ vp, section: "home products", height: Math.round(box.height) });
    }
    const radii = await p.evaluate(() => {
      const bad = [];
      for (const el of document.querySelectorAll("body *")) {
        if (el.matches('input[type="radio"], input[type="checkbox"], svg *, .motif, .motif *')) continue;
        const cs = getComputedStyle(el);
        if (cs.display === "none" || !el.getClientRects().length) continue;
        const rad = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"].map((k) => parseFloat(cs[k]) || 0);
        if (rad.some((v) => v > 0)) bad.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} ${rad.join("/")}`);
      }
      return bad;
    });
    out.push({ vp, route: r, roundedElements: radii.length, sample: radii.slice(0, 8) });
  }
  await ctx.close();
}
await b.close();
fs.writeFileSync(`${OUT}measure__${label}.json`, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
