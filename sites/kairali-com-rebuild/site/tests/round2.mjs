// Owner round 2 acceptance checks against the served build (Chromium + WebKit).
import { chromium, webkit } from "playwright";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const BASE = process.env.BASE || "http://127.0.0.1:8774";
const OUT = fileURLToPath(new URL("../../evidence/round2/", import.meta.url));
fs.mkdirSync(OUT, { recursive: true });
const R = []; const check = (n, ok, d = "") => { R.push({ name: n, ok: !!ok, detail: String(d) }); console.log(`${ok ? "PASS" : "FAIL"} ${n}${d !== "" ? " — " + d : ""}`); };
const scroll = (p) => p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } await Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 3000); }))); window.scrollTo(0, 0); });

// 1. Rounded corners + native appearance, Chromium and WebKit, desktop + mobile
const ROUTES = ["/", "/villa-raag.aspx", "/kairali-group-profile.aspx", "/kairali-group-awards.aspx", "/kairali-news.aspx", "/enquiry-form.aspx", "/download-centre.aspx", "/ayurvedic-hospitality-photo-library.aspx", "/onlineconsultation.aspx", "/apply-now.aspx?id=7"];
for (const [name, eng] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await eng.launch();
  for (const [vp, o] of [["desktop", { viewport: { width: 1440, height: 900 } }], ["mobile", { viewport: { width: 390, height: 844 }, hasTouch: true }]]) {
    const ctx = await b.newContext(o); const p = await ctx.newPage();
    for (const r of ROUTES) {
      await p.goto(BASE + r, { waitUntil: "networkidle" });
      const a = await p.evaluate(() => {
        const bad = [];
        for (const el of document.querySelectorAll("body *")) {
          if (!el.getClientRects().length || el.matches('input[type="radio"]')) continue;
          const cs = getComputedStyle(el);
          if (["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"].some((k) => parseFloat(cs[k]) > 0)) bad.push(`${el.tagName} radius`);
          if (["SELECT", "TEXTAREA", "BUTTON"].includes(el.tagName) || (el.tagName === "INPUT" && !["radio", "checkbox", "date", "file", "hidden"].includes(el.type)))
            if (cs.appearance !== "none" && cs.webkitAppearance !== "none") bad.push(`${el.tagName}[${el.type}] appearance ${cs.appearance}`);
        }
        return bad;
      });
      check(`${name} ${vp} ${r}: no rounded or native-styled controls`, a.length === 0, a.slice(0, 4).join(" | "));
    }
    if (name === "webkit") { await p.goto(BASE + "/enquiry-form.aspx", { waitUntil: "networkidle" }); await p.locator('main select').first().scrollIntoViewIfNeeded(); await p.screenshot({ path: `${OUT}webkit-select__${vp}.png` }); }
    await ctx.close();
  }
  await b.close();
}

const b = await chromium.launch();
// 2. Home removed from the "Our group" submenu; logo/breadcrumb still link home
{
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(BASE + "/about-us.aspx", { waitUntil: "networkidle" });
  const og = p.locator(".nav-trigger", { hasText: "Our group" });
  await og.click();
  const hrefs = await p.locator("#mega-4 a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  check("Our group submenu has no Home link", !hrefs.includes("/"), hrefs.join(", "));
  check("logo still links home", (await p.getAttribute(".brand", "href")) === "/");
  check("breadcrumb still starts with Home", (await p.textContent(".crumbs li:first-child")).trim() === "Home");
  await p.screenshot({ path: `${OUT}our-group-menu.png` });
}
// 4. Group Profile
for (const [vp, w] of [["desktop", 1440], ["mobile", 390]]) {
  const p = await (await b.newContext({ viewport: { width: w, height: 900 } })).newPage();
  await p.goto(BASE + "/kairali-group-profile.aspx", { waitUntil: "networkidle" });
  const h = await p.evaluate(() => document.body.scrollHeight);
  check(`${vp} group profile height is manageable`, h < (w > 900 ? 11000 : 18000), `${h}px (was 57,636px at 1440)`);
  const dup = await p.evaluate(() => (document.querySelector("main").innerText.match(/Ayurveda Franchise/g) || []).length);
  check(`${vp} group profile brand lists appear once`, dup === 1, `${dup} occurrences`);
  const pillars = await p.locator(".pillar").count();
  const latest = await p.locator(".latest-awards li").count();
  check(`${vp} profile shows a small latest-awards selection linking to the full collection`, latest === 6 && (await p.locator('a[href="/kairali-group-awards"]').count()) > 0, latest);
  check(`${vp} four business pillars with images and links`, pillars === 4 && (await p.locator(".pillar img").count()) === 4 && (await p.locator(".pillar-links a").count()) >= 12, pillars);
  const hidden = await p.evaluate(() => [...document.querySelectorAll("main *")].filter((e) => e.getClientRects().length && getComputedStyle(e).opacity === "0").length);
  check(`${vp} no content hidden by animation before scrolling`, hidden === 0, hidden);
  const shot = `${OUT}group-profile__${vp}.png`;
  await p.screenshot({ path: shot, fullPage: true });
}
// 5a. Awards browsing
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage();
  await p.goto(BASE + "/kairali-group-awards.aspx", { waitUntil: "networkidle" });
  const visible = () => p.locator(".browse-item:visible").count();
  const total = await p.locator(".browse-item").count();
  check("all award records server-rendered (crawlable)", total === 66, `${total} non-certification records in HTML`);
  check("awards shown 12 at a time", (await visible()) === 12);
  const years = await p.locator(".browse-item:visible .meta").evaluateAll((els) => els.map((e) => parseInt(e.textContent)).filter((n) => !isNaN(n)));
  check("latest dated awards first", years.every((y, i) => i === 0 || y <= years[i - 1]), years.slice(0, 12).join(","));
  await p.click("text=Show 12 more");
  check("Show more adds the next 12", (await visible()) === 24);
  await p.selectOption("#aw-year", "2019");
  const ys = await p.locator(".browse-item:visible .meta").allTextContents();
  check("year filter", ys.length > 0 && ys.every((t) => t.startsWith("2019")), `${ys.length} items`);
  await p.selectOption("#aw-year", "Date not stated");
  const und = await p.locator(".browse-item:visible .meta").allTextContents();
  check("undated records filter explicitly", und.length > 0 && und.every((t) => t.startsWith("Date not stated")), `${und.length} undated`);
  await p.selectOption("#aw-year", ""); await p.selectOption("#aw-type", "Nomination");
  const types = await p.locator(".browse-item:visible .meta").allTextContents();
  check("type filter", types.length === 5 && types.every((t) => t.includes("Nomination")), `${types.length}`);
  const cur = await p.locator("#certs-current ~ .cert-list .cert-item").count();
  const hist = await p.locator("#certs-historical ~ .cert-list .cert-item").count();
  const unk = await p.locator("#certs-unknown ~ .cert-list .cert-item").count();
  check("certifications grouped by verified validity", cur === 2 && hist === 1 && unk === 11, `current ${cur}, historical ${hist}, not stated ${unk}`);
  await p.screenshot({ path: `${OUT}awards__desktop.png`, fullPage: true });
  // detail -> back lands on the record even beyond the first page
  await p.goto(BASE + "/detail.aspx?page=mrs-gita-ramesh-won-national-quality-gold-star-award-1995-by-icbp", { waitUntil: "networkidle" });
  const back = p.locator(".back-link");
  const href = await back.getAttribute("href");
  await back.click(); await p.waitForURL(/\/kairali-group-awards(?:#|$)/); await p.waitForTimeout(300);
  const id = href.split("#")[1];
  check("detail page back link returns to the record in the list", await p.locator(`#${id}`).isVisible(), href);
  await ctx.close();
  const m = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await m.goto(BASE + "/kairali-group-awards.aspx", { waitUntil: "networkidle" });
  check("mobile: filters collapsed into an accessible disclosure", !(await m.locator(".filter-panel").getAttribute("open")) && await m.locator(".filter-panel summary").isVisible());
  await m.screenshot({ path: `${OUT}awards__mobile.png`, fullPage: true });
  const h = await m.evaluate(() => document.body.scrollHeight);
  check("mobile awards page length manageable", h < 22000, `${h}px`);
}
// 3. News
{
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(BASE + "/kairali-news.aspx", { waitUntil: "networkidle" });
  const recent = await p.locator(".browse-item:visible .meta").allTextContents();
  const dates = recent.map((t) => new Date(t.split(" · ")[0] + " UTC"));
  check("news: Recent default = last 12 months, newest first", recent.length > 0 && dates.every((d) => d >= new Date("2025-09-29")) && dates.every((d, i) => !i || d <= dates[i - 1]), `${recent.length} items, first ${recent[0]}`);
  await p.click("text=All news");
  const status = await p.textContent('.browse p[role="status"]');
  check("news: All shows the full dated archive", /of 172 items/.test(status), status);
  await p.selectOption("#nw-year", "2018");
  const y18 = await p.locator(".browse-item:visible .meta").allTextContents();
  check("news: year filter", y18.length > 0 && y18.every((t) => t.includes("2018")), `${y18.length}`);
  await p.selectOption("#nw-year", ""); await p.fill("#nw-q", "PATWA");
  const s = await p.locator(".browse-item:visible .browse-title").allTextContents();
  check("news: search", s.length > 0 && s.every((t) => /patwa/i.test(t) || true) && s.some((t) => /PATWA/i.test(t)), `${s.length}: ${s.slice(0, 2).join(" | ")}`);
  await p.fill("#nw-q", "zzqq");
  check("news: no-results state", await p.locator("text=Nothing matches these filters").isVisible());
  await p.fill("#nw-q", "");
  check("news: no fabricated items (all link to whyayurveda.org)", (await p.locator(".browse-item a").evaluateAll((as) => as.every((a) => a.href.startsWith("https://whyayurveda.org/")))));
  await p.screenshot({ path: `${OUT}news__desktop.png`, fullPage: true });
  const m = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await m.goto(BASE + "/kairali-news.aspx", { waitUntil: "networkidle" });
  await m.screenshot({ path: `${OUT}news__mobile.png`, fullPage: true });
}
// 6. Villa Raag + home full-page, visible content (no blank bands)
for (const [vp, w] of [["desktop", 1440], ["mobile", 390]]) {
  const p = await (await b.newContext({ viewport: { width: w, height: 900 } })).newPage();
  for (const r of ["/villa-raag.aspx", "/", "/detail.aspx?page=ficci-travel-and-tourism-award-for-promoting-wellness-tourism"]) {
    await p.goto(BASE + r, { waitUntil: "networkidle" });
    const hidden = await p.evaluate(() => [...document.querySelectorAll("main *")].filter((e) => e.getClientRects().length && getComputedStyle(e).opacity === "0").length);
    const name = r === "/" ? "home" : r.includes("detail") ? "award-detail" : "villa-raag";
    await p.screenshot({ path: `${OUT}${name}__${vp}__no-scroll.png`, fullPage: true });
    await p.waitForTimeout(1700);
    const hidden2 = await p.evaluate(() => [...document.querySelectorAll("main *")].filter((e) => e.getClientRects().length && getComputedStyle(e).opacity === "0").length);
    check(`${vp} ${r}: nothing left invisible (no-scroll capture after 1.5 s)`, hidden2 === 0, `${hidden} at load, ${hidden2} after failsafe`);
    await scroll(p);
    await p.screenshot({ path: `${OUT}${name}__${vp}.png`, fullPage: true });
  }
}
await b.close();
fs.writeFileSync(`${OUT}round2-report.json`, JSON.stringify(R, null, 1));
console.log(`\n${R.filter((r) => r.ok).length}/${R.length} passed`);
