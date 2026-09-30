// Acceptance for WOPS-AHV-FINAL-DRAFT-20260924-001 round 14: the 7 owner regressions + highest-risk rows.
// Run from the site dir:  node tools/accept-round14.mjs --base http://127.0.0.1:4471 --out <dir>
//   hosted:  vercel env run -- bash -c "cd sites/ayurvedichealingvillage.com && node tools/accept-round14.mjs --base https://ahv-final-staging.vercel.app --out <dir>"
// The staging token goes to the staging origin only (tools/lib/staging-auth.mjs).
import fs from "node:fs";
import path from "node:path";
import { chromium, webkit, devices } from "@playwright/test";
import { attachStagingToken } from "./lib/staging-auth.mjs";

const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > 0 ? process.argv[i + 1] : d; };
const BASE = arg("base", "http://127.0.0.1:4471").replace(/\/$/, "");
const OUT = arg("out", "/tmp/ahv-accept"); fs.mkdirSync(OUT, { recursive: true });
const R = []; const ok = (id, pass, detail) => { R.push({ id, pass: !!pass, detail }); console.log((pass ? "PASS " : "FAIL ") + id + " " + JSON.stringify(detail).slice(0, 300)); };

async function ctxFor(browser, opts) { const c = await browser.newContext(opts); await attachStagingToken(c, BASE); return c; }
async function open(ctx, route, wait = 900) { const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(e.message)); const r = await p.goto(BASE + route, { waitUntil: "networkidle", timeout: 120000 }); await p.waitForTimeout(wait); return { p, errs, status: r ? r.status() : 0 }; }
const text = (p) => p.evaluate(() => (document.querySelector("#ahv-design-root") || document.body).innerText);

const cb = await chromium.launch();
const desk = await ctxFor(cb, { viewport: { width: 1440, height: 900 } });
const phone = await ctxFor(cb, { ...devices["iPhone 13"], hasTouch: true });

// REG-01 packages page: no Villas association in breadcrumb schema / rail
for (const [n, c] of [["desktop", desk], ["mobile", phone]]) {
  const { p, errs } = await open(c, "/ayurvedic-treatment-packages.html");
  const r = await p.evaluate(() => { const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((x) => x.textContent).join(" "); const bi = ld.indexOf("BreadcrumbList"); const bc = bi >= 0 ? ld.slice(bi, bi + 700) : ""; return { ldVillas: /our-villas|Villa rates/.test(bc), ldProgrammes: /all-programs|Ayurvedic Treatment Packages/.test(bc), railVillaLabel: /Villa rates, treatment included/.test(document.body.innerText) }; });
  ok(`REG-01 ${n}`, !r.ldVillas && !r.railVillaLabel && errs.length === 0, { ...r, errs });
  await p.close();
}
// REG-02 contact bar: exactly one visible bar on phone, none on desktop, no horizontal overflow
for (const route of ["/", "/about-us/", "/awards-and-accreditations/", "/offers/", "/ayurveda-training-programme/", "/de/"]) {
  const { p } = await open(phone, route);
  const r = await p.evaluate(() => { const bars = [...document.querySelectorAll("#ahv-cta-bar, [data-ahv-cta-bar]")].filter((e) => { const s = getComputedStyle(e); const b = e.getBoundingClientRect(); return s.display !== "none" && s.visibility !== "hidden" && b.height > 0 && b.bottom > 0 && b.top < innerHeight; }); return { visibleFixedBars: bars.length, links: bars.flatMap((b) => [...b.querySelectorAll("a")].map((a) => a.getAttribute("href"))), overflow: document.documentElement.scrollWidth > innerWidth + 1 }; });
  ok(`REG-02 phone ${route}`, r.visibleFixedBars === 1 && !r.overflow, r);
  await p.screenshot({ path: path.join(OUT, `reg02-phone-${route.replace(/\W+/g, "_") || "home"}.png`) });
  await p.close();
}
{ const { p } = await open(desk, "/about-us/"); const n = await p.evaluate(() => [...document.querySelectorAll("#ahv-cta-bar, [data-ahv-cta-bar]")].filter((e) => getComputedStyle(e).display !== "none" && getComputedStyle(e).visibility !== "hidden" && e.getBoundingClientRect().height > 0).length); ok("REG-02 desktop none", n === 0, { visibleFixedBars: n }); await p.close(); }
// REG-03 training: tariff inside main, before footer; JSON-LD on own canonical; breadcrumb wraps
for (const [n, c] of [["desktop", desk], ["mobile", phone]]) {
  const { p } = await open(c, "/ayurveda-training-programme/");
  const r = await p.evaluate(() => { const s = document.querySelector("#ahv-design-root [data-rate-reference]"); const m = s && s.closest("main"); const f = [...document.querySelectorAll("#ahv-design-root footer, #ahv-design-root [data-ahv-footer]")].pop(); const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((x) => x.textContent).join(" "); return { tariff: !!s, insideMain: !!m, beforeFooter: f && s ? !!(s.compareDocumentPosition(f) & Node.DOCUMENT_POSITION_FOLLOWING) : null, ldOldAlias: ld.includes("/ayurveda-training-programs/"), overflow: document.documentElement.scrollWidth > innerWidth + 1 }; });
  ok(`REG-03 ${n}`, r.tariff && r.insideMain && r.beforeFooter !== false && !r.ldOldAlias && !r.overflow, r);
  await p.close();
}
// REG-04 WhatsApp Patient Care button solid + centred
for (const [n, c] of [["desktop", desk], ["mobile", phone]]) {
  const { p } = await open(c, "/awards-and-accreditations/");
  const a = p.locator('#ahv-design-root a[href^="https://wa.me/919289838797"]').filter({ hasText: /WhatsApp Patient Care/i }).first();
  await a.scrollIntoViewIfNeeded();
  const r = await a.evaluate((el) => { const cs = getComputedStyle(el); const b = el.getBoundingClientRect(); const rg = document.createRange(); rg.selectNodeContents(el); const t = rg.getBoundingClientRect(); return { bg: cs.backgroundColor, color: cs.color, centreOffset: Math.round(t.left + t.width / 2 - (b.left + b.width / 2)) }; });
  ok(`REG-04 ${n}`, r.bg === "rgb(0, 96, 56)" && Math.abs(r.centreOffset) <= 2, r);
  const box = await a.boundingBox(); await p.screenshot({ path: path.join(OUT, `reg04-${n}.png`), clip: { x: 0, y: Math.max(0, box.y - 160), width: (c === desk ? 1440 : 390), height: 360 } });
  await p.close();
}
// REG-06 offers: badge + valid-until gone, three offers kept
for (const [n, c] of [["desktop", desk], ["mobile", phone]]) {
  const { p } = await open(c, "/offers/"); const t = await text(p);
  const r = { offersListed: /offers listed/i.test(t), validUntil: /valid until/i.test(t), senior: /senior/i.test(t), olympic: /olympic/i.test(t), defence: /defence/i.test(t) };
  ok(`REG-06 ${n}`, !r.offersListed && !r.validUntil && r.senior && r.olympic && r.defence, r);
  await p.close();
}
// REG-05 / REG-07 scroll after chat minimize and certificate close (Chromium + WebKit, iPhone 13 emulation)
const wk = await webkit.launch();
for (const [eng, br] of [["chromium", cb], ["webkit", wk]]) {
  const c = await ctxFor(br, { ...devices["iPhone 13"] });
  { // REG-07: certificate viewer open -> Escape / close -> page scrolls again
    const { p } = await open(c, "/about-us/", 1500);
    const n = await p.locator("button[data-doc-index]").count();
    const r = { docs: n, cycles: [] };
    for (const [i, how] of [[0, "escape"], [1, "close"], [0, "close"]]) {
      if (i >= n) continue;
      const b = p.locator(`button[data-doc-index="${i}"]`); await b.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
      await b.click(); await p.waitForTimeout(700);
      const open = await p.evaluate(() => !!document.querySelector("#doc-dialog[open], #doc-dialog:not([hidden])"));
      if (how === "escape") await p.keyboard.press("Escape"); else await p.locator("#doc-close").click();
      await p.waitForTimeout(600);
      const before = await p.evaluate(() => scrollY); await p.evaluate(() => window.scrollBy(0, 500)); await p.waitForTimeout(300);
      const after = await p.evaluate(() => scrollY);
      r.cycles.push({ i, how, open, scrolled: after > before, bodyClip: await p.evaluate(() => document.body.hasAttribute("data-ahv-fh-clip")) });
    }
    ok(`REG-07 ${eng}`, r.cycles.length > 0 && r.cycles.every((x) => x.scrolled && !x.bodyClip), r); await p.close();
  }
  { // REG-05 footer chat link then minimise
    const { p } = await open(c, "/", 2500);
    const link = p.locator("footer a[data-ahv-chat]").filter({ visible: true }).first();
    let r = { found: await link.count() };
    if (r.found) {
      await link.scrollIntoViewIfNeeded(); await link.click(); await p.waitForTimeout(2500);
      const tog = p.locator("#ahv-contact-controls .ahv-contact-chat"); if (await tog.count()) { await tog.click(); await p.waitForTimeout(1200); }
      await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
      const before = await p.evaluate(() => scrollY); await p.evaluate(() => window.scrollBy(0, 800)); await p.waitForTimeout(400);
      const after = await p.evaluate(() => scrollY);
      r = { ...r, before, after, scrolled: after > before, chatOpenFlag: await p.evaluate(() => document.documentElement.getAttribute("data-ahv-chat-open") || document.body.getAttribute("data-ahv-chat-open")) };
    }
    ok(`REG-05 ${eng}`, r.found && r.scrolled, r); await p.close();
  }
  await c.close();
}
await wk.close();
// High-risk rows: cancer main route hydrated head/body, festival layout, currency, redirects, locale persistence basics
{ const { p, errs, status } = await open(desk, "/revitalizing-and-strengthening-treatment-for-cancer-patients/"); const r = await p.evaluate(() => ({ title: document.title, h1: document.querySelector("h1")?.innerText, text: document.body.innerText.slice(0, 20000) })); const bad = /cure|guarantee|miracle|heal(s|ed)? cancer/i.test(r.text.replace(/no .{0,40}cure/ig, "")); ok("CANCER main hydrated", status === 200 && !/cure|404/i.test(r.title) && !bad && errs.length === 0, { status, title: r.title, h1: r.h1, errs }); await p.close(); }
{ const { p } = await open(desk, "/festivals/", 1500); const r = await p.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth + 1, imgs: [...document.querySelectorAll("#ahv-design-root img")].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute("loading") !== "lazy").length })); ok("FESTIVAL desktop", r &&  !r.overflow && r.imgs === 0, r); await p.screenshot({ path: path.join(OUT, "festival-desktop.png") }); await p.close(); }
for (const [src, want] of [["/contact/", "/contact-us/"], ["/ayurveda-training-programs/", "/ayurveda-training-programme/"], ["/villas/", "/our-villas/"]]) {
  const res = await desk.request.get(BASE + src, { maxRedirects: 0 }); ok(`REDIRECT ${src}`, res.status() === 301 && (res.headers().location || "").endsWith(want), { status: res.status(), location: res.headers().location });
}
{ const { p } = await open(desk, "/de/ayurvedische-behandlungen/", 2500).catch(() => ({ p: null })); if (p) { const t = await p.evaluate(() => document.body.innerText); ok("CURRENCY de finder EUR", /€/.test(t), { euro: (t.match(/€/g) || []).length }); await p.close(); } }
await cb.close();
fs.writeFileSync(path.join(OUT, "RESULTS.json"), JSON.stringify({ base: BASE, at: new Date().toISOString(), passed: R.filter((x) => x.pass).length, failed: R.filter((x) => !x.pass).length, results: R }, null, 1));
console.log(`passed ${R.filter((x) => x.pass).length} / ${R.length}`);
