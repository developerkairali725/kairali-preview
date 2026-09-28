// Hosted: is a chosen language kept across real navigation? Starts on the English homepage, picks a language in the
// switcher, then follows header, family-panel, content and footer links and reloads — recording path + <html lang>
// at every step and scanning each visited page for internal links that leave the locale (English leaks).
// Protected staging: vc env run -- node tools/hosted-locale-persistence.mjs --base https://ahv-final-staging.vercel.app --out <dir>
import fs from "node:fs"; import path from "node:path"; import { createRequire } from "node:module"; import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const store = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../node_modules/.pnpm");
const pw = require(path.join(store, fs.readdirSync(store).find((d) => d.startsWith("playwright@")), "node_modules/playwright"));
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg("base", "http://localhost:4471"), OUT = arg("out", "/tmp/locale-persistence");
fs.mkdirSync(OUT, { recursive: true });
const oidc = /^https/.test(BASE) && process.env.VERCEL_OIDC_TOKEN ? { extraHTTPHeaders: { "x-vercel-trusted-oidc-idp-token": process.env.VERCEL_OIDC_TOKEN } } : {};
const L = JSON.parse(fs.readFileSync("l10n/locales.json", "utf8"));
const R = JSON.parse(fs.readFileSync("l10n/routes.json", "utf8")).routes;
const b = await pw.chromium.launch();
const report = [];
const leaks = async (pg, prefix) => pg.evaluate((prefix) => {
  const out = [];
  for (const a of document.querySelectorAll("a[href]")) {
    if (!a.getClientRects().length) continue; // visible links only
    let u; try { u = new URL(a.getAttribute("href"), location.href); } catch { continue; }
    if (u.origin !== location.origin && !/ayurvedichealingvillage\.com$/.test(u.hostname)) continue;
    const p = u.pathname;
    if (/^\/(documents|ahv|_next|images|wp-content)\//.test(p) || /\.(pdf|jpe?g|png|webp|mp4)$/i.test(p) || a.hasAttribute("hreflang")) continue;
    if (!p.startsWith("/" + prefix + "/")) out.push(p + " ← " + (a.innerText || a.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 40));
  }
  return [...new Set(out)];
}, prefix);
for (const [loc, w] of [["de", 1440], ["de", 390], ["ar", 1440], ["ar", 390], ["ja", 390]]) {
  const prefix = L[loc].prefix;
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 800, hasTouch: w < 800, ...oidc });
  await ctx.addInitScript(() => { try { localStorage.setItem("ktahv-consent", "declined"); } catch (e) {} });
  const pg = await ctx.newPage();
  const steps = [];
  const snap = async (how) => { await pg.waitForTimeout(2500); const s = { how, path: new URL(pg.url()).pathname, lang: await pg.evaluate(() => document.documentElement.lang), stored: await pg.evaluate(() => localStorage.getItem("ahv-locale")), leaks: await leaks(pg, prefix) }; s.inLocale = s.path.startsWith("/" + prefix + "/"); steps.push(s); return s; };
  try {
    await pg.goto(BASE + "/", { waitUntil: "load", timeout: 90000 }); await pg.waitForTimeout(2500);
    // 1. switcher on the English homepage (desktop header, or the phone menu's language list)
    // desktop: the switcher button that is inside the viewport (a hidden sticky-header copy sits above it);
    // phone: the menu's inline language list
    if (w < 800) {
      await pg.locator("header button").filter({ has: pg.locator("span") }).last().click(); await pg.waitForTimeout(700);
      await Promise.all([pg.waitForNavigation({ timeout: 60000 }), pg.locator(`a[data-ahv-lang-option="${loc}"]:visible`).first().click()]);
    } else {
      await pg.evaluate(() => { const b = [...document.querySelectorAll(".ahv-lang-btn")].find((e) => { const r = e.getBoundingClientRect(); return r.width && r.top >= 0 && r.bottom <= innerHeight; }); b.click(); });
      await pg.waitForTimeout(400);
      await Promise.all([pg.waitForNavigation({ timeout: 60000 }), pg.locator(`.ahv-lang-list:not([hidden]) a[data-ahv-lang-option="${loc}"]`).first().click()]);
    }
    await snap("switcher: English homepage → " + loc);
    // 2. a primary header link / phone menu link (the design's own nav)
    const nav = w < 800 ? null : pg.locator("header nav a:visible").nth(1);
    if (nav && await nav.count()) { await Promise.all([pg.waitForNavigation({ timeout: 60000 }), nav.click()]); await snap("header nav link 2"); }
    else { await pg.locator("header button").filter({ has: pg.locator("span") }).last().click(); await pg.waitForTimeout(700); await Promise.all([pg.waitForNavigation({ timeout: 60000 }), pg.locator("nav a:visible").nth(2).click()]); await snap("phone menu link 3"); }
    // 3. a family page via the family header panel (villas family → a villa)
    await pg.goto(BASE + R["/our-villas/"][loc], { waitUntil: "load", timeout: 90000 }); await snap("direct: our-villas (" + loc + ")");
    const fh = pg.locator("[data-ahv-fh-btn]:visible").first();
    if (await fh.count()) { await fh.click(); await pg.waitForTimeout(500); const link = pg.locator("#ahv-fh-panel nav.ahv-fh-family a:visible").nth(2); if (await link.count()) { await Promise.all([pg.waitForNavigation({ timeout: 60000 }), link.click()]); await snap("family panel link"); } }
    // 4. a programme card from the finder
    await pg.goto(BASE + R["/all-programs/"][loc], { waitUntil: "load", timeout: 90000 }); await pg.waitForTimeout(2000);
    const card = pg.locator("article a:visible").first();
    if (await card.count()) { await Promise.all([pg.waitForNavigation({ timeout: 60000 }), card.click()]); await snap("finder programme card"); }
    // 5. a footer link
    const foot = pg.locator("footer a:visible").filter({ hasNot: pg.locator("img") }).nth(3);
    if (await foot.count()) { await foot.scrollIntoViewIfNeeded(); await Promise.all([pg.waitForNavigation({ timeout: 60000 }), foot.click()]); await snap("footer link 4"); }
    // 6. reload
    await pg.reload({ waitUntil: "load" }); await snap("reload");
    await pg.screenshot({ path: path.join(OUT, `${loc}-${w}-last.png`) });
  } catch (e) { steps.push({ error: String(e).slice(0, 200) }); }
  const allIn = steps.every((s) => s.error ? false : s.inLocale && s.lang.startsWith(loc === "zh-Hans" ? "zh" : loc));
  report.push({ loc, w, allInLocale: allIn, steps });
  console.log(loc, w, allIn ? "KEPT" : "LEFT LOCALE", steps.map((s) => s.error ? "ERR " + s.error : `${s.how}: ${s.path} [${s.lang}] leaks=${s.leaks.length}`).join(" | "));
  await ctx.close();
}
await b.close();
fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify({ base: BASE, at: new Date().toISOString(), report }, null, 1));
