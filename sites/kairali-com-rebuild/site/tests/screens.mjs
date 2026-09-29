// Desktop 1440 / mobile 390 full-page screenshots per family. Usage: node tests/screens.mjs [route ...]
import { chromium } from "playwright";
import fs from "node:fs";
const BASE = process.env.BASE || "http://127.0.0.1:8774";
import { fileURLToPath } from "node:url";
const OUT = fileURLToPath(new URL("../../evidence/screens/", import.meta.url));
fs.mkdirSync(OUT, { recursive: true });
const DEFAULT = ["/", "/ayurveda-treatments.aspx", "/enquiry-form.aspx", "/ayurvedic-healing-village.aspx", "/villa-raag.aspx", "/svata-katerina-prague-czech-republic.aspx",
  "/ayurvedic-products.aspx", "/ayurvedic-medicine.aspx", "/training.aspx", "/kairali-group-awards.aspx", "/detail.aspx?page=ficci-travel-and-tourism-award-for-promoting-wellness-tourism",
  "/kairali-blog.aspx?page=2", "/testimonials.aspx", "/ayurvedic-hospitality-video-library.aspx", "/ayurvedic-hospitality-photo-library.aspx", "/download-centre.aspx",
  "/partnerships-and-investment.aspx", "/onlineconsultation.aspx", "/apply-now.aspx?id=7", "/current-openings.aspx", "/locations.aspx", "/privacy-policy.aspx",
  "/sitemap.aspx", "/search-results.aspx?q=panchakarma", "/search-results.aspx?q=zzqx", "/virtual-tour.aspx", "/our-partners.aspx", "/nope.aspx"];
const routes = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT;
const name = (r) => (r === "/" ? "home" : r.replace(/^\//, "").replace(/[^a-z0-9]+/gi, "_").slice(0, 80));
const browser = await chromium.launch();
const vps = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } };
const report = [];
for (const [vp, opts] of Object.entries(vps)) {
  const ctx = await browser.newContext({ viewport: { width: opts.width, height: opts.height }, isMobile: !!opts.isMobile, hasTouch: !!opts.hasTouch, deviceScaleFactor: opts.deviceScaleFactor || 1 });
  const page = await ctx.newPage();
  for (const r of routes) {
    const resp = await page.goto(BASE + r, { waitUntil: "networkidle" });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
      await Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 4000); }))); window.scrollTo(0, 0); });
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const file = `${OUT}${name(r)}__${vp}.png`;
    await page.screenshot({ path: file, fullPage: true });
    report.push({ route: r, vp, status: resp?.status(), horizontalOverflowPx: overflow, file: file.split("/evidence/")[1] });
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync(`${OUT}screens.json`, JSON.stringify(report, null, 1));
console.log(report.map((x) => `${x.status} ${x.vp} overflow=${x.horizontalOverflowPx} ${x.route}`).join("\n"));
