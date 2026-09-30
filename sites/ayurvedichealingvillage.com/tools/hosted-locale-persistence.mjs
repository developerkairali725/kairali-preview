// Hosted: is a chosen language kept across real navigation? Starts on the English homepage, picks a language in the
// switcher, then follows a header link, a family-panel link, a finder card and a footer link and reloads — recording
// the full URL + <html lang> at every step, and classifying every visible link on each visited page.
//
// 29 Sep 2026 fix (PARENT-LOCALE-NAV-R14-REVIEW):
//  * links are classified by host/kind (tools/lib/link-class.mjs): internal page · bookings subdomain · XML sitemap ·
//    asset · action · same-page · external. Only an INTERNAL PAGE outside the locale prefix is an English leak, and
//    it is reported with its FULL URL, its link text, and whether l10n/routes.json has a locale route for it;
//  * desktop header: the page is scrolled to reveal the fixed header, and the link is chosen among header nav links
//    that actually intersect the viewport and hit-test to themselves (not "a:visible", which a transformed-offscreen
//    header satisfies);
//  * every candidate link's href is read and classified BEFORE any click; only an internal page is followed, and the
//    wait is for that navigation, not for "a navigation";
//  * a timeout is HARNESS-TIMEOUT (after re-reading the page: if the browser did land outside the locale, that is
//    LOCALE-LOST — an observation, not a timeout); other exceptions are HARNESS-ERROR; missing candidates SKIPPED;
//  * leaks are part of the verdict: pass = every step KEPT and zero internal English leaks.
// Consent: the cookie notice is left untouched by default (never pre-seeded in storage, never auto-dismissed); links
// are chosen by visibility/hit-test so the notice cannot fake a pass. --answer-consent clicks the notice's first button
// ("Decline" — an ordinary choice) once on the homepage and once after the switch.
//   vc env run -- node tools/hosted-locale-persistence.mjs --base https://ahv-final-staging.vercel.app --out <dir> [--cases de@1440,ar@390]
import fs from "node:fs"; import path from "node:path";
import { attachStagingToken } from "./lib/staging-auth.mjs";
import { classifyHref } from "./lib/link-class.mjs";
import { arg, flag, runContext, istStamp, playwright } from "./lib/verify-common.mjs";
const BASE = arg("base", "http://localhost:4471").replace(/\/+$/, ""), OUT = arg("out", "/tmp/locale-persistence");
const ORIGIN = new URL(BASE).origin;
fs.mkdirSync(OUT, { recursive: true });
const L = JSON.parse(fs.readFileSync("l10n/locales.json", "utf8"));
const R = JSON.parse(fs.readFileSync("l10n/routes.json", "utf8")).routes;
const reverse = {}; for (const [k, v] of Object.entries(R)) for (const p of Object.values(v)) reverse[p] = k;
// English redirects (a leak may point at a 301 whose destination DOES have a locale route)
const REDIR = (() => { const m = {}; try { for (const [f, t] of Object.entries(JSON.parse(fs.readFileSync("english-candidate/redirect-map.json", "utf8")).redirects)) m[f] = t.to || t; } catch {} try { for (const [f, t] of Object.entries(JSON.parse(fs.readFileSync("l10n/routes.json", "utf8")).redirects || {})) m[f] = t.to || t; } catch {} return m; })();
const CASES = arg("cases", "de@1440,de@390,ar@1440,ar@390,ja@390").split(",").map((c) => { const [loc, w] = c.split("@"); return [loc, +w]; });
const NAV_TIMEOUT = +arg("nav-timeout", "45000");
const { chromium } = await playwright();
const b = await chromium.launch();
const report = [];
const run = { ...runContext(BASE), tool: "tools/hosted-locale-persistence.mjs", at: new Date().toISOString(), ist: istStamp() };

async function pageLinks(pg) {
  return pg.evaluate(() => [...document.querySelectorAll("a[href]")].filter((a) => a.getClientRects().length).map((a) => ({
    href: a.getAttribute("href"), text: (a.innerText || a.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 50),
    langOption: a.hasAttribute("hreflang") || a.hasAttribute("data-ahv-lang-option"), inHeader: !!a.closest("header"), inFooter: !!a.closest("footer"), inNotice: !!a.closest("#ahv-consent") })));
}
function classifyAll(links, pageUrl, prefix, loc) {
  const counts = {}; const leaks = [];
  for (const l of links) {
    const c = classifyHref(l.href, pageUrl, ORIGIN); counts[c.kind] = (counts[c.kind] || 0) + 1;
    if (c.kind !== "internal-page" || l.langOption) continue;
    if (c.path === "/" + prefix || c.path.startsWith("/" + prefix + "/")) continue;
    const redirectsTo = REDIR[c.path] || null;
    const key = reverse[c.path] || (R[c.path] ? c.path : null) || (redirectsTo && (reverse[redirectsTo] || (R[redirectsTo] ? redirectsTo : null))) || null;
    const localePath = key && R[key] ? R[key][loc] : null;
    leaks.push({ url: c.url, text: l.text, where: l.inNotice ? "cookie notice" : l.inHeader ? "header" : l.inFooter ? "footer" : "body", redirectsTo, routeKey: key, localeRoute: localePath || null,
      note: localePath ? `${redirectsTo ? `301 → ${redirectsTo}; ` : ""}locale route exists (${localePath}) — link should point there` : `${redirectsTo ? `301 → ${redirectsTo}; ` : ""}no locale route in l10n/routes.json (English-only page)` });
  }
  const uniq = []; const seen = new Set(); for (const x of leaks) if (!seen.has(x.url)) { seen.add(x.url); uniq.push(x); }
  return { counts, englishLeaks: uniq };
}

for (const [loc, w] of CASES) {
  const prefix = L[loc].prefix; const langWant = String(L[loc].htmlLang || L[loc].lang || loc).toLowerCase().split("-")[0];
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 800, hasTouch: w < 800 }); await attachStagingToken(ctx, BASE);
  const pg = await ctx.newPage();
  const steps = []; let consent = "untouched";
  const snap = async (how, extra = {}) => {
    await pg.waitForTimeout(1500);
    const url = pg.url(); const p = new URL(url).pathname;
    const s = { how, url, path: p, lang: await pg.evaluate(() => document.documentElement.lang).catch(() => null), stored: await pg.evaluate(() => localStorage.getItem("ahv-locale")).catch(() => null), ...extra };
    s.inLocale = p === "/" + prefix + "/" || p.startsWith("/" + prefix + "/");
    s.langOk = String(s.lang || "").toLowerCase().startsWith(langWant);
    const cl = classifyAll(await pageLinks(pg).catch(() => []), url, prefix, loc); s.linkKinds = cl.counts; s.englishLeaks = cl.englishLeaks;
    if (!s.outcome) s.outcome = s.inLocale && s.langOk ? "KEPT" : "LOCALE-LOST";
    steps.push(s); return s;
  };
  // follow one already-classified link and wait for THAT navigation
  const follow = async (how, handle, cand) => {
    const before = pg.url();
    try {
      await handle.scrollIntoViewIfNeeded().catch(() => {});
      await Promise.all([pg.waitForURL((u) => u.href !== before, { timeout: NAV_TIMEOUT, waitUntil: "domcontentloaded" }), handle.click({ timeout: 15000 })]);
      await snap(how, { clicked: cand, redirected: new URL(pg.url()).pathname !== new URL(cand.url).pathname });
    } catch (e) {
      const timeout = /Timeout/i.test(String(e.name) + String(e.message));
      const s = await snap(how, { clicked: cand, error: String(e.message).split("\n")[0].slice(0, 200) });
      s.outcome = !s.inLocale && pg.url() !== before ? "LOCALE-LOST" : timeout ? "HARNESS-TIMEOUT" : "HARNESS-ERROR";
    }
  };
  const skip = (how, why) => steps.push({ how, outcome: "SKIPPED", reason: why });
  const answerConsent = async () => { if (!flag("answer-consent")) return; const d = pg.locator("#ahv-consent button").first(); if (await d.count() && await d.isVisible()) { await d.click(); consent = "declined via the notice (ordinary choice)"; await pg.waitForTimeout(300); } };
  try {
    await pg.goto(BASE + "/", { waitUntil: "load", timeout: 90000 }); await pg.waitForTimeout(2500); await answerConsent();
    // 1. switcher on the English homepage (desktop: the switcher button inside the viewport; phone: the menu's list)
    try {
      const before = pg.url();
      if (w < 800) {
        await pg.locator("header button").filter({ has: pg.locator("span") }).last().click(); await pg.waitForTimeout(700);
        await Promise.all([pg.waitForURL((u) => u.href !== before, { timeout: NAV_TIMEOUT }), pg.locator(`a[data-ahv-lang-option="${loc}"]:visible`).first().click()]);
      } else {
        await pg.evaluate(() => { const x = [...document.querySelectorAll(".ahv-lang-btn")].find((e) => { const r = e.getBoundingClientRect(); return r.width && r.top >= 0 && r.bottom <= innerHeight; }); x.click(); });
        await pg.waitForTimeout(400);
        await Promise.all([pg.waitForURL((u) => u.href !== before, { timeout: NAV_TIMEOUT }), pg.locator(`.ahv-lang-list:not([hidden]) a[data-ahv-lang-option="${loc}"]`).first().click()]);
      }
      await snap("switcher: English homepage → " + loc);
    } catch (e) { const s = await snap("switcher: English homepage → " + loc, { error: String(e.message).split("\n")[0].slice(0, 200) }); s.outcome = s.inLocale && s.langOk ? "KEPT" : /Timeout/i.test(e.message) ? "HARNESS-TIMEOUT" : "HARNESS-ERROR"; }
    await answerConsent();
    // 2. header link — the REVEALED header on desktop, the phone menu otherwise
    if (w >= 800) {
      // the homepage header is fixed and translated off-screen until the page has scrolled past the hero; family
      // pages use a sticky header. Scroll in steps and stop as soon as a header nav link is on screen AND hit-tests.
      const findRevealed = () => pg.evaluateHandle(() => {
        const inView = (a) => { const r = a.getBoundingClientRect(); if (!r.width || !r.height || r.top < 0 || r.bottom > innerHeight || r.left < 0 || r.right > innerWidth) return false; const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!hit && (hit === a || a.contains(hit)); };
        const links = [...document.querySelectorAll("header nav a[href]")].filter(inView).filter((a) => { const h = a.getAttribute("href"); return h && h.startsWith("/") && !a.hasAttribute("data-ahv-lang-option") && h !== location.pathname; });
        return links[1] || links[0] || null;
      });
      await pg.mouse.move(Math.round(w / 2), 450);
      let el = (await findRevealed()).asElement(); const reveal = [];
      for (const dy of [700, 700, -200, 1400]) { if (el) break; await pg.mouse.wheel(0, dy); await pg.waitForTimeout(800); reveal.push(`${dy}→${await pg.evaluate(() => Math.round(scrollY))}`); el = (await findRevealed()).asElement(); }
      if (!el) skip("header nav link (revealed header)", `no header nav link intersects the viewport and hit-tests after scrolling (${reveal.join(", ")})`);
      else { const href = await el.getAttribute("href"); const cand = { ...classifyHref(href, pg.url(), ORIGIN), text: (await el.innerText()).trim().slice(0, 40) }; await follow("header nav link (revealed header)", el, cand); }
    } else {
      await pg.locator("header button").filter({ has: pg.locator("span") }).last().click().catch(() => {}); await pg.waitForTimeout(700);
      const cands = await pg.locator("nav a:visible").elementHandles();
      let done = false;
      for (const h of cands.slice(0, 40)) { const href = await h.getAttribute("href"); const c = classifyHref(href, pg.url(), ORIGIN); if (c.kind === "internal-page" && !(await h.getAttribute("data-ahv-lang-option")) && c.path !== new URL(pg.url()).pathname) { await follow("phone menu link", h, { ...c, text: (await h.innerText()).trim().slice(0, 40) }); done = true; break; } }
      if (!done) skip("phone menu link", "no internal page link in the open phone menu");
    }
    // 3. a family page via the family header panel (villas family → a villa)
    await pg.goto(BASE + R["/our-villas/"][loc], { waitUntil: "load", timeout: 90000 }); await snap("direct: our-villas (" + loc + ")");
    const fh = pg.locator("[data-ahv-fh-btn]:visible").first();
    if (await fh.count()) {
      await fh.click(); await pg.waitForTimeout(600);
      const hs = await pg.locator("#ahv-fh-panel nav.ahv-fh-family a:visible").elementHandles();
      const internal = []; for (const h of hs) { const c = classifyHref(await h.getAttribute("href"), pg.url(), ORIGIN); if (c.kind === "internal-page" && c.path !== new URL(pg.url()).pathname) internal.push([h, c]); }
      if (internal.length) { const [h, c] = internal[Math.min(2, internal.length - 1)]; await follow("family panel link", h, { ...c, text: (await h.innerText()).trim().slice(0, 40) }); }
      else skip("family panel link", "family panel has no internal page link");
    } else skip("family panel link", "no visible family header button");
    // 4. a programme card from the finder hub
    await pg.goto(BASE + R["/all-programs/"][loc], { waitUntil: "load", timeout: 90000 }); await pg.waitForTimeout(2000);
    {
      const hs = await pg.locator("article a:visible").elementHandles(); let done = false;
      for (const h of hs.slice(0, 20)) { const c = classifyHref(await h.getAttribute("href"), pg.url(), ORIGIN); if (c.kind === "internal-page") { await follow("finder programme card", h, { ...c, text: (await h.innerText()).trim().slice(0, 40) }); done = true; break; } }
      if (!done) skip("finder programme card", "no internal page link in a visible card");
    }
    // 5. a footer link — every footer href is read and classified first; only an internal page is followed
    {
      const hs = await pg.locator("footer a:visible").elementHandles(); const inventory = []; let target = null;
      for (const h of hs) { const href = await h.getAttribute("href"); const c = classifyHref(href, pg.url(), ORIGIN); const langOpt = !!(await h.getAttribute("data-ahv-lang-option")) || !!(await h.getAttribute("hreflang")); const chat = (await h.getAttribute("data-ahv-chat")) !== null; inventory.push({ url: c.url, kind: chat ? "action (chat)" : c.kind, langOption: langOpt }); if (!target && c.kind === "internal-page" && !langOpt && !chat && c.path !== new URL(pg.url()).pathname) target = [h, c]; }
      steps.push({ how: "footer inventory (before any click)", outcome: "INFO", footerLinks: inventory.length, kinds: inventory.reduce((m, x) => ((m[x.kind] = (m[x.kind] || 0) + 1), m), {}), links: inventory });
      if (target) await follow("footer link", target[0], { ...target[1], text: (await target[0].innerText()).trim().slice(0, 40) });
      else skip("footer link", "no internal page link in the visible footer");
    }
    // 6. reload
    await pg.reload({ waitUntil: "load" }); await snap("reload");
    await pg.screenshot({ path: path.join(OUT, `${loc}-${w}-last.png`) });
  } catch (e) { steps.push({ how: "harness", outcome: /Timeout/i.test(e.message) ? "HARNESS-TIMEOUT" : "HARNESS-ERROR", error: String(e.message).split("\n")[0].slice(0, 200) }); }
  const order = ["LOCALE-LOST", "HARNESS-TIMEOUT", "HARNESS-ERROR", "SKIPPED", "KEPT"];
  const navSteps = steps.filter((s) => s.outcome !== "INFO");
  const navigation = order.find((o) => navSteps.some((s) => s.outcome === o)) || "KEPT";
  const leaks = []; const seen = new Set(); for (const s of steps) for (const l of s.englishLeaks || []) if (!seen.has(l.url)) { seen.add(l.url); leaks.push({ ...l, seenOn: s.url }); }
  const pass = navigation === "KEPT" && leaks.length === 0;
  report.push({ loc, w, consent, navigation, internalEnglishLeaks: leaks.length, pass, leaks, steps });
  console.log(`${pass ? "PASS" : "FAIL"} ${loc} ${w} navigation=${navigation} leaks=${leaks.length} | ` + navSteps.map((s) => `${s.how}: ${s.outcome}${s.path ? " " + s.path + " [" + s.lang + "]" : ""}${s.error ? " (" + s.error.slice(0, 80) + ")" : ""}`).join(" | "));
  for (const l of leaks) console.log(`   leak: ${l.url}  "${l.text}" (${l.where}) — ${l.note}`);
  await ctx.close();
}
await b.close();
fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify({ run, base: BASE, at: new Date().toISOString(), verdictRule: "pass = every step KEPT and zero internal English leaks; HARNESS-TIMEOUT/ERROR are harness outcomes, LOCALE-LOST is an observed wrong-locale destination", report }, null, 1));
