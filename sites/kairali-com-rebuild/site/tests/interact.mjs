// Browser interaction checks (Chromium via Playwright) against the local preview.
import { chromium } from "playwright";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const BASE = process.env.BASE || "http://127.0.0.1:8774";
const OUT = fileURLToPath(new URL("../../evidence/", import.meta.url));
const shots = OUT + "screens/interact/";
fs.mkdirSync(shots, { recursive: true });
const results = [];
const check = (name, ok, detail = "") => { results.push({ name, ok: !!ok, detail }); console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? " — " + detail : ""}`); };

const browser = await chromium.launch();

// 1. Network + console on key pages: no Google Fonts, no third-party requests on load, no console errors.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const external = new Set(); const errors = [];
  page.on("request", (r) => { const u = new URL(r.url()); if (!["127.0.0.1", "localhost"].includes(u.hostname)) external.add(u.hostname); });
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  for (const r of ["/", "/ayurveda-treatments.aspx", "/enquiry-form.aspx", "/download-centre.aspx", "/kairali-group-awards.aspx", "/search-results.aspx?q=yoga"]) {
    await page.goto(BASE + r, { waitUntil: "networkidle" });
  }
  check("no Google Fonts requests", ![...external].some((h) => h.includes("fonts.g")), [...external].join(", ") || "no external hosts");
  check("no third-party requests on load (key pages)", external.size === 0, [...external].join(", "));
  check("no console errors (key pages)", errors.length === 0, errors.slice(0, 3).join(" | "));
  // rendered faces
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const faces = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter((f) => f.status === "loaded").map((f) => `${f.family} ${f.weight}`); });
  check("Kurale, Asap and Lato faces loaded", ["Kurale", "Asap", "Lato"].every((f) => faces.some((x) => x.includes(f))), [...new Set(faces)].join(", "));
  const h1font = await page.$eval("h1", (el) => getComputedStyle(el).fontFamily);
  check("H1 uses Kurale", h1font.includes("Kurale"), h1font);
  const synth = await page.$eval("h1", (el) => getComputedStyle(el).fontSynthesis || getComputedStyle(el).getPropertyValue("font-synthesis"));
  check("no synthetic bold on display face", synth === "none" || synth.includes("none"), synth);
  // CLS on home (lab)
  const cls = await page.evaluate(() => new Promise((res) => { let v = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) v += e.value; }).observe({ type: "layout-shift", buffered: true }); setTimeout(() => res(v), 1500); }));
  check("home CLS ≤ 0.1 (lab)", cls <= 0.1, cls.toFixed(4));
  const lcp = await page.evaluate(() => new Promise((res) => { let v = 0; new PerformanceObserver((l) => { const e = l.getEntries(); v = e[e.length - 1].startTime; }).observe({ type: "largest-contentful-paint", buffered: true }); setTimeout(() => res(v), 1500); }));
  check("home LCP ≤ 2500 ms (lab, local, unthrottled)", lcp <= 2500, `${Math.round(lcp)} ms`);
  await ctx.close();
}

// 2. Keyboard: skip link, mega menu, focus visibility
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/ayurveda-treatments.aspx", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const first = await page.evaluate(() => document.activeElement?.textContent?.trim());
  check("first Tab reaches skip link", first === "Skip to content", first);
  await page.keyboard.press("Enter");
  const afterSkip = await page.evaluate(() => document.activeElement?.id);
  check("skip link moves focus to main", afterSkip === "main", afterSkip);
  const trigger = page.locator(".nav-trigger").first();
  await trigger.focus(); await page.keyboard.press("Enter");
  check("mega menu opens with keyboard", (await trigger.getAttribute("aria-expanded")) === "true");
  await page.screenshot({ path: shots + "mega-menu-open.png" });
  await page.keyboard.press("Escape");
  check("Escape closes menu and returns focus", (await trigger.getAttribute("aria-expanded")) === "false" && await trigger.evaluate((el) => el === document.activeElement));
  const outline = await page.evaluate(() => { const a = document.querySelector(".subnav a"); a.focus(); return getComputedStyle(a).outlineStyle + " " + getComputedStyle(a).outlineWidth; });
  check("visible focus outline on links", outline.startsWith("solid") && !outline.endsWith(" 0px"), outline);
  await ctx.close();
}

// 3. Mobile drawer
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.click(".menu-toggle");
  check("mobile menu opens", await page.isVisible("#drawer .drawer-panel"));
  await page.screenshot({ path: shots + "mobile-drawer.png" });
  await page.keyboard.press("Escape");
  check("mobile menu closes with Escape", !(await page.isVisible("#drawer .drawer-panel")));
  const tap = await page.$$eval(".btn, .icon-btn", (els) => els.filter((e) => e.offsetParent).map((e) => e.getBoundingClientRect().height));
  check("touch targets ≥ 44px (buttons)", tap.every((h) => h >= 44), `min ${Math.min(...tap)}px`);
  await ctx.close();
}

// 4. Q8-C supersedes editable mock validation: all six preview forms are inactive.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const posts = [];
  page.on("request", (r) => { if (r.method() !== "GET") posts.push(r.url()); });
  const routes = ["/contact-us.aspx", "/enquiry-form.aspx", "/onlineconsultation.aspx", "/apply-now.aspx?id=7", "/svata-katerina-prague-czech-republic.aspx", "/ayurveda-newsletter.aspx"];
  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    const form = page.locator("main form[data-form]");
    check(`${route}: all form controls inactive`, await form.locator("input, select, textarea, button").evaluateAll((els) => els.length > 0 && els.every((el) => el.matches(":disabled"))));
    check(`${route}: explicit preview notice`, (await form.textContent()).includes("does not collect, store, email or upload"));
    await form.evaluate((el) => el.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
  }
  check("no form data transmitted (no POST requests)", posts.length === 0, posts.join(", "));
  await page.goto(BASE + "/enquiry-form.aspx", { waitUntil: "networkidle" });
  check("general enquiry has no gender/age/address fields (Q7)", (await page.locator('main form[data-form="enquiry"] [name="gender"], main form[data-form="enquiry"] [name="age"], main form[data-form="enquiry"] [name="address"]').count()) === 0);
  await page.goto(BASE + "/apply-now.aspx?id=7", { waitUntil: "networkidle" });
  check("apply ?id=7 pre-selects Ayurveda Therapist", (await page.inputValue('main [name="post"]')) === "Ayurveda Therapist");
  check("apply ?id=7 pre-fills job reference Ayu819814", (await page.inputValue('main [name="jobRef"]')) === "Ayu819814");
  await page.goto(BASE + "/onlineconsultation.aspx", { waitUntil: "networkidle" });
  const cfields = await page.locator('main form[data-form="consultation"] [name]').evaluateAll((els) => new Set(els.map((e) => e.getAttribute("name")).filter((n) => n !== "website")).size);
  check("medical consultation form keeps its separate full field set", cfields >= 30, `${cfields} named fields`);
  await ctx.close();
}

// 5. Search
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/search-results.aspx?q=panchakarma", { waitUntil: "networkidle" });
  await page.waitForSelector("#search-results li");
  const n = await page.locator("#search-results li").count();
  check("search returns indexed results for 'panchakarma'", n > 3, `${n} results`);
  await page.fill("#site-q", "villa raag agonda");
  await page.waitForTimeout(200);
  const top = await page.locator("#search-results li a .r-title").first().textContent();
  check("multi-word search ranks Villa Raag first", top?.includes("Villa Raag"), top);
  await page.focus("#site-q"); await page.keyboard.press("ArrowDown");
  check("ArrowDown moves focus into results", await page.evaluate(() => document.activeElement?.closest("#search-results") !== null));
  await page.fill("#site-q", "zzqxw");
  await page.waitForTimeout(200);
  check("no-results state", (await page.textContent("main")).includes("No pages match"));
  await page.screenshot({ path: shots + "search-no-results.png" });
  await page.goto(BASE + "/search-results.aspx?q=nabh", { waitUntil: "networkidle" });
  await page.click('.facet button:has-text("Group & awards")');
  const f2 = await page.locator("#search-results li").count();
  check("section facet filters results", f2 > 0, `${f2} results in Group & awards`);
  await ctx.close();
}

// 6. Downloads
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/download-centre.aspx", { waitUntil: "networkidle" });
  const cards = await page.locator("article.collection").count();
  check("download library shows 12 current + earlier collections", cards >= 21, `${cards} cards`);
  const kappl = await page.locator('article.collection:has-text("Retail catalogue") a[href*="KAPPL-RET-INR-20260928-R01.pdf"]').count();
  check("product catalogues link to public portal PDFs", kappl === 1);
  check("no pending/review labels remain", !(await page.textContent("main")).match(/Publication pending|Up for review|401/));
  await page.selectOption("#dl-l", "German");
  await page.selectOption("#dl-c", "EUR");
  const status = await page.textContent('p[role="status"]');
  check("language + currency filters narrow editions", /^\d+ document/.test(status) && !status.startsWith("172"), status);
  await page.fill("#dl-q", "no-such-document-xyz");
  check("download no-results state", (await page.textContent("main")).includes("No documents match"));
  await page.screenshot({ path: shots + "downloads-no-results.png" });
  await ctx.close();
}

// 7. Reduced motion: content visible, no transitions
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const hidden = await page.$$eval(".reveal", (els) => els.filter((e) => getComputedStyle(e).opacity !== "1").length);
  check("reduced motion: all reveal content visible", hidden === 0, `${hidden} hidden`);
  const dur = await page.$eval(".btn", (el) => getComputedStyle(el).transitionDuration);
  check("reduced motion: transitions disabled", dur.split(",").every((d) => parseFloat(d) === 0), dur);
  await ctx.close();
  const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const p2 = await ctx2.newPage();
  await p2.goto(BASE + "/ayurveda-treatments.aspx");
  const text = await p2.textContent("main");
  check("content renders without JavaScript (SSR/SSG)", text.includes("Panchkarma") && text.length > 3000, `${text.length} chars`);
  await ctx2.close();
}

// 8. Zoom / reflow at 320 CSS px (≈ 400% of 1280)
{
  const ctx = await browser.newContext({ viewport: { width: 320, height: 640 } });
  const page = await ctx.newPage();
  let worst = 0, where = "";
  for (const r of ["/", "/download-centre.aspx", "/svata-katerina-prague-czech-republic.aspx", "/kairali-group-profile.aspx", "/onlineconsultation.aspx"]) {
    await page.goto(BASE + r, { waitUntil: "networkidle" });
    const o = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (o > worst) { worst = o; where = r; }
  }
  check("reflow at 320px: no horizontal page scroll", worst <= 0, worst ? `${worst}px on ${where}` : "");
  await ctx.close();
}

await browser.close();
fs.writeFileSync(OUT + "interact-report.json", JSON.stringify(results, null, 1));
console.log(`\n${results.filter((r) => r.ok).length}/${results.length} passed`);
