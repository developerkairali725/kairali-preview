/**
 * Browser QA for the locale lane (desktop 1440 + phones 360/390/430): after
 * hydration — html lang/dir unchanged by the client, localized title/canonical
 * kept, switcher present with every language, option targets are the page's
 * own equivalents (deep links, no root reset), keyboard open/Escape, mobile
 * burger language list, footer/newsletter overflow, console errors.
 *   node tools/l10n/qa-switcher.mjs --base http://localhost:4471 --paths /de/,/de/behandlung-von-bluthochdruck/ [--out dir]
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require_ = createRequire(import.meta.url);
const store = path.resolve("../../node_modules/.pnpm");
const pw = fs.readdirSync(store).find((d) => d.startsWith("playwright@"));
const { chromium } = require_(path.join(store, pw, "node_modules", "playwright"));
const arg = (n, d) => { const i = process.argv.indexOf("--" + n); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg("base", "http://localhost:4471");
const PATHS = arg("paths", "/de/").split(",");
const OUT = arg("out", null);
const VIEWPORTS = (arg("viewports", "1440,390") || "").split(",").map(Number);
if (OUT) fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const results = [];
for (const p of PATHS) for (const w of VIEWPORTS) {
  const mobile = w < 700;
  // Protected Vercel previews: the CLI's short-lived OIDC token as the Trusted
  // Sources header (vercel env run). Never logged or written anywhere.
  const tok = process.env.VERCEL_OIDC_TOKEN;
  const extraHTTPHeaders = tok && /vercel\.app/.test(BASE) ? { "x-vercel-trusted-oidc-idp-token": tok } : undefined;
  const ctx = await browser.newContext({ viewport: { width: w, height: mobile ? 860 : 900 }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1, ...(extraHTTPHeaders ? { extraHTTPHeaders } : {}) });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 200)); });
  page.on("pageerror", (e) => errors.push("pageerror: " + String(e).slice(0, 200)));
  const failed = [];
  page.on("requestfailed", (r) => failed.push(r.url().slice(0, 140)));
  page.on("response", (r) => { if (r.status() >= 400 && !/favicon/.test(r.url())) failed.push(r.status() + " " + r.url().slice(0, 140)); });
  const rec = { path: p, width: w };
  try {
    await page.goto(BASE + p, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForFunction(() => document.querySelector("[data-ahv-locale-switcher], [data-ahv-locale-inline]"), null, { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(1500);
    Object.assign(rec, await page.evaluate(() => {
      const sw = [...document.querySelectorAll("[data-ahv-locale-switcher]")].filter((e) => e.offsetParent);
      const opts = [...document.querySelectorAll("[data-ahv-locale-switcher] a[data-ahv-lang-option]")].map((a) => a.getAttribute("data-ahv-lang-option") + "=" + a.getAttribute("href"));
      const canon = [...document.querySelectorAll('link[rel="canonical"]')].map((l) => l.href);
      return {
        lang: document.documentElement.lang, dir: document.documentElement.dir || "ltr", title: document.title,
        canonical: canon, hreflang: document.querySelectorAll('link[rel="alternate"][hreflang]').length,
        visibleSwitchers: sw.length, options: [...new Set(opts)].length, optionSample: [...new Set(opts)].slice(0, 13),
        overflowX: document.documentElement.scrollWidth - window.innerWidth,
        h1: (document.querySelector("h1") || {}).textContent?.trim().slice(0, 80) || null,
      };
    }));
    if (!mobile && rec.visibleSwitchers) {
      const btn = page.locator("[data-ahv-locale-switcher] .ahv-lang-btn").filter({ visible: true }).first();
      await btn.focus(); await page.keyboard.press("Enter"); await page.waitForTimeout(200);
      rec.keyboardOpen = await page.evaluate(() => { const l = [...document.querySelectorAll(".ahv-lang-list")].find((x) => !x.hidden); return l ? { focused: document.activeElement?.getAttribute("data-ahv-lang-option"), items: l.querySelectorAll("a").length } : null; });
      if (OUT) await page.screenshot({ path: path.join(OUT, `${p.replace(/\//g, "_")}-${w}-switcher-open.png`) });
      await page.keyboard.press("Escape"); await page.waitForTimeout(150);
      rec.escapeClosed = await page.evaluate(() => [...document.querySelectorAll(".ahv-lang-list")].every((x) => x.hidden) && document.activeElement?.classList.contains("ahv-lang-btn"));
    }
    if (mobile) {
      // The burger is the header's last visible button that is not the language, search or chat
// control (it may carry no aria-expanded; its label is translated) — parent review 25 Sep.
const burger = page.locator('header button:not(.ahv-lang-btn):not([aria-controls="ahv-search-dialog"]):not([data-ahv-home-search]):not(.ahv-contact-chat)').filter({ visible: true }).last();
      if (await burger.count()) {
        await burger.tap().catch(() => burger.click());
        await page.waitForTimeout(500);
        rec.drawerLanguages = await page.evaluate(() => { const n = [...document.querySelectorAll("[data-ahv-locale-inline]")].find((e) => e.offsetParent); return n ? n.querySelectorAll("a").length : 0; });
        rec.menuAriaExpanded = await burger.getAttribute("aria-expanded");
        if (OUT) await page.screenshot({ path: path.join(OUT, `${p.replace(/\//g, "_")}-${w}-menu.png`) });
        await burger.tap().catch(() => {});
      }
    }
    if (OUT) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(OUT, `${p.replace(/\//g, "_")}-${w}-footer.png`) });
    }
  } catch (e) { rec.error = String(e).slice(0, 200); }
  rec.consoleErrors = errors.slice(0, 6); rec.failedRequests = failed.slice(0, 6);
  results.push(rec);
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
if (OUT) fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify(results, null, 1));
