import { chromium } from "@playwright/test";
const b = await chromium.launch();
const jobs = [["/kair-by-kairali/", [0]], ["/festivals/", [0, 900, 1800]], ["/walk-in-ayurveda-treatment/", [0, 900, 1800]], ["/social-responsibilities/", [0, 900]], ["/books/", [0, 700]], ["/online-consultation/", [0, 900, 1800]], ["/about-us/", [1600, 2400, 3200]]];
for (const w of [1920, 1440]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 1000 } }); const p = await ctx.newPage();
  for (const [r, ys] of jobs) {
    await p.goto("http://localhost:4321" + r, { waitUntil: "networkidle", timeout: 60000 }); await p.waitForTimeout(800);
    for (const y of ys) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(350); await p.screenshot({ path: `${process.argv[2]}/${w}-${r.replace(/[^a-z0-9]+/gi, "_")}-${y}.png`, timeout: 30000 }); }
  }
  // books: click test
  await p.goto("http://localhost:4321/books/", { waitUntil: "networkidle" }); await p.waitForTimeout(800);
  const info = await p.evaluate(() => { const nav = [...document.querySelectorAll("#ahv-design-root main nav")].find(n => n.querySelectorAll("a").length >= 3 && n.getAttribute("aria-label") !== "Breadcrumb"); const a = nav.querySelectorAll("a")[2]; const r = a.getBoundingClientRect(); return { text: a.textContent.trim(), href: a.getAttribute("href"), onclick: a.getAttribute("onclick") || a.getAttribute("onClick"), rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], pe: getComputedStyle(a).pointerEvents, hit: (document.elementFromPoint(r.left + 10, r.top + r.height / 2) || {}).tagName, navPos: getComputedStyle(nav).position, navZ: getComputedStyle(nav).zIndex, navTop: getComputedStyle(nav).top }; });
  const before = p.url(); try { await p.click(`#ahv-design-root main nav a:nth-of-type(3)`, { timeout: 5000 }); } catch (e) { info.clickErr = String(e).slice(0, 120); } await p.waitForTimeout(1200); info.urlAfter = p.url(); info.navigated = p.url() !== before;
  console.log(w, "books nav:", JSON.stringify(info));
  await ctx.close();
}
await b.close();
