// TEMPORARY chrome-consistency audit — read-only, deleted after run.
import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";

const OUT = process.env.OUT || "/private/tmp/claude-501/-Volumes-Extreme-SSD---Blue-2nd-Kairali-Digital--codex-worktrees-ahv-english-staging-20260915/69e0a352-1b99-4612-a1c8-19f60a8929a2/scratchpad/chrome-audit.json";
const BASE = "http://localhost:4321";
const manifest = JSON.parse(readFileSync("english-candidate/route-manifest.json", "utf8"));
let routes = manifest.routes;
if (process.env.ONLY) routes = routes.filter(r => process.env.ONLY.split(",").includes(r.path));
if (process.env.LIMIT) routes = routes.slice(0, +process.env.LIMIT);
const VIEWPORTS = [{ name: "390", width: 390, height: 844 }, { name: "1440", width: 1440, height: 900 }];
const CONC = +(process.env.CONC || 4);

const family = (v) => (v || "").replace(/^ahv-(page|template)-/, "").replace(/-desktop$/, "");

const MEASURE = ({ vw }) => {
  const root = document.querySelector("#ahv-design-root") || document.body;
  const vis = (e) => { if (!e) return false; const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && s.opacity !== "0"; };
  const onScreen = (e) => { const r = e.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
  const bg = (e) => { const s = getComputedStyle(e); return { color: s.backgroundColor, image: s.backgroundImage === "none" ? null : s.backgroundImage.slice(0, 80) }; };
  const txt = (e) => (e.textContent || "").replace(/\s+/g, " ").trim();
  const digits = (s) => s.replace(/\D/g, "");
  const out = { rootFound: !!document.querySelector("#ahv-design-root") };

  // ---- headers
  const headers = [...root.querySelectorAll("header")];
  const visHeaders = headers.filter(vis);
  out.header = {
    total: headers.length,
    visibleCount: visHeaders.length,
    all: headers.map(h => { const r = h.getBoundingClientRect(); const s = getComputedStyle(h); return { visible: vis(h), onScreen: vis(h) && onScreen(h), height: Math.round(r.height), top: Math.round(r.top), position: s.position, transform: s.transform === "none" ? null : s.transform, inMain: !!h.closest("main") }; }),
  };
  const primary = visHeaders.find(h => onScreen(h)) || visHeaders[0] || null;
  if (primary) {
    const r = primary.getBoundingClientRect(); const s = getComputedStyle(primary);
    const logo = [...primary.querySelectorAll("img")].find(vis) || primary.querySelector("img");
    const lr = logo ? logo.getBoundingClientRect() : null;
    const navs = [...primary.querySelectorAll("nav")].filter(n => !/language/i.test(n.getAttribute("aria-label") || "") && !n.hasAttribute("data-ahv-locale-switcher"));
    const navLinks = navs.flatMap(n => [...n.querySelectorAll(":scope > a, :scope > ul > li > a, :scope > div > a")]);
    const navVisible = navLinks.filter(vis);
    const lang = primary.querySelector("[data-ahv-locale-switcher], nav[aria-label='Language']");
    const langTexts = lang ? [...lang.querySelectorAll("[data-ahv-locale], a, span, button")].map(txt).filter(t => /^(EN|DE|FR)$/.test(t)) : [];
    const langByText = !lang && /\bEN\b.*\bDE\b.*\bFR\b/.test(txt(primary));
    const book = [...primary.querySelectorAll("a, button")].find(e => /book/i.test(txt(e)));
    const search = primary.querySelector("[aria-label*='earch' i], [aria-label*='Search'], input[type=search], a[href='#search']");
    const burgerCand = [...primary.querySelectorAll("button, [role=button], a")].filter(e => /menu|navigation|burger|hamburger/i.test(e.getAttribute("aria-label") || "") || /^(☰|menu)$/i.test(txt(e)));
    const burger = burgerCand.find(vis) || burgerCand[0] || null;
    const items = [];
    if (logo) items.push({ name: "logo", top: Math.round(lr.top), visible: vis(logo) });
    if (navs[0]) items.push({ name: "nav", top: Math.round(navs[0].getBoundingClientRect().top), visible: vis(navs[0]) });
    if (search) items.push({ name: "search", top: Math.round(search.getBoundingClientRect().top), visible: vis(search) });
    if (lang) items.push({ name: "lang", top: Math.round(lang.getBoundingClientRect().top), visible: vis(lang) });
    if (book) items.push({ name: "book", top: Math.round(book.getBoundingClientRect().top), visible: vis(book) });
    const visItems = items.filter(i => i.visible);
    const rows = [];
    for (const i of visItems) { const row = rows.find(rw => Math.abs(rw.top - i.top) <= 12); if (row) row.items.push(i.name); else rows.push({ top: i.top, items: [i.name] }); }
    rows.sort((a, b) => a.top - b.top);
    out.header.primary = {
      height: Math.round(r.height), top: Math.round(r.top), position: s.position, transform: s.transform === "none" ? null : s.transform, onScreen: onScreen(primary),
      background: bg(primary),
      logo: logo ? { src: logo.getAttribute("src"), alt: logo.getAttribute("alt"), width: Math.round(lr.width), height: Math.round(lr.height), visible: vis(logo) } : null,
      nav: { navCount: navs.length, linkCount: navLinks.length, visibleLinkCount: navVisible.length, texts: navLinks.map(txt), visibleTexts: navVisible.map(txt), navDisplay: navs[0] ? getComputedStyle(navs[0]).display : null },
      lang: { present: !!lang || langByText, visible: lang ? vis(lang) : langByText, texts: langTexts },
      book: book ? { text: txt(book), height: Math.round(book.getBoundingClientRect().height), visible: vis(book), href: book.getAttribute("href") } : null,
      search: search ? { tag: search.tagName.toLowerCase(), visible: vis(search), ariaLabel: search.getAttribute("aria-label") } : null,
      burger: burger ? { tag: burger.tagName.toLowerCase(), ariaLabel: burger.getAttribute("aria-label"), text: txt(burger), visible: vis(burger), w: Math.round(burger.getBoundingClientRect().width), h: Math.round(burger.getBoundingClientRect().height), ariaExpanded: burger.getAttribute("aria-expanded"), ariaControls: burger.getAttribute("aria-controls") } : null,
      rows: { count: rows.length, layout: rows.map(rw => rw.items.join("+")) },
    };
    primary.setAttribute("data-audit-primary-header", "1");
    if (burger) burger.setAttribute("data-audit-burger", "1");
  } else out.header.primary = null;

  // ---- in-main mastheads
  const main = root.querySelector("main") || root;
  const mainLogos = [...main.querySelectorAll("img")].filter(i => /logo/i.test(i.getAttribute("src") || "") || /logo/i.test(i.getAttribute("alt") || "")).map(i => ({ src: i.getAttribute("src"), alt: i.getAttribute("alt"), visible: vis(i), w: Math.round(i.getBoundingClientRect().width), h: Math.round(i.getBoundingClientRect().height), inHeader: !!i.closest("header") }));
  const contactLists = [...main.querySelectorAll("ul, ol")].filter(ul => { const lis = [...ul.children].filter(c => c.tagName === "LI"); if (!lis.length) return false; return lis.every(li => { const as = [...li.querySelectorAll("a[href]")]; return as.length && as.every(a => /^(tel:|mailto:)/i.test(a.getAttribute("href"))); }); }).map(ul => ({ items: [...ul.querySelectorAll("a[href]")].map(a => a.getAttribute("href")), visible: vis(ul), inHeader: !!ul.closest("header") }));
  // also loose tel/mailto anchors in main outside footer (a contact strip may not be a UL)
  const mainContactAnchors = [...main.querySelectorAll("a[href^='tel:'], a[href^='mailto:']")].filter(a => !a.closest("footer")).map(a => a.getAttribute("href"));
  out.mastheads = { logosInMain: mainLogos, telMailListsInMain: contactLists, telMailAnchorsInMain: mainContactAnchors, headersInMain: headers.filter(h => h.closest("main") && vis(h)).length };

  // ---- footers
  const footers = [...root.querySelectorAll("footer")];
  const visFooters = footers.filter(vis);
  out.footer = { total: footers.length, visibleCount: visFooters.length, all: footers.map(f => ({ visible: vis(f), height: Math.round(f.getBoundingClientRect().height), inMain: !!f.closest("main") })) };
  const F = visFooters[visFooters.length - 1] || null;
  if (F) {
    const t = txt(F);
    const links = [...F.querySelectorAll("a[href]")];
    const phones = [...new Set((t.match(/\+?\d[\d\s().-]{7,}\d/g) || []).map(m => m.trim()).filter(m => digits(m).length >= 10))];
    const telHrefs = [...new Set(links.map(a => a.getAttribute("href")).filter(h => /^tel:/i.test(h)))];
    const socials = links.map(a => a.getAttribute("href")).filter(h => /facebook|instagram|youtube|linkedin|x\.com|twitter/i.test(h));
    const copyEl = [...F.querySelectorAll("*")].filter(e => /©|copyright/i.test(txt(e)) && e.children.length < 6).sort((a, b) => txt(a).length - txt(b).length)[0];
    const grid = [...F.querySelectorAll("*")].find(e => /grid/.test(getComputedStyle(e).display) && [...e.children].filter(vis).length > 1);
    out.footer.last = {
      height: Math.round(F.getBoundingClientRect().height), background: bg(F), display: getComputedStyle(F).display,
      linkCount: links.length, visibleLinkCount: links.filter(vis).length,
      hasWhatsApp: digits(t).includes("919289838797") || telHrefs.some(h => digits(h).includes("919289838797")),
      has38777: digits(t).includes("9289838777") || telHrefs.some(h => digits(h).includes("9289838777")),
      has38794: digits(t).includes("9289838794") || telHrefs.some(h => digits(h).includes("9289838794")),
      hasEmail: /info@kairali\.com/i.test(t) || links.some(a => /mailto:info@kairali\.com/i.test(a.getAttribute("href"))),
      otherEmails: [...new Set((t.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) || []).filter(e => e.toLowerCase() !== "info@kairali.com"))],
      phonesInText: phones, telHrefs,
      socials: [...new Set(socials)],
      copyright: copyEl ? txt(copyEl).slice(0, 200) : null,
      columns: grid ? { count: [...grid.children].filter(vis).length, template: getComputedStyle(grid).gridTemplateColumns.split(" ").length } : null,
      logo: (() => { const i = [...F.querySelectorAll("img")].find(vis); return i ? { src: i.getAttribute("src"), h: Math.round(i.getBoundingClientRect().height) } : null; })(),
      hasNewsletter: !!F.querySelector("input[type=email]"),
    };
  } else out.footer.last = null;

  // ---- overflow
  const de = document.documentElement;
  out.overflow = { doc: de.scrollWidth > de.clientWidth, docScrollWidth: de.scrollWidth, clientWidth: de.clientWidth, root: root.scrollWidth > root.clientWidth + 1 };
  return out;
};

const BURGER = () => {
  const root = document.querySelector("#ahv-design-root") || document.body;
  const vis = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && s.opacity !== "0"; };
  const onScreen = (e) => { const r = e.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
  const b = root.querySelector("[data-audit-burger]");
  const ctl = b && b.getAttribute("aria-controls") ? document.getElementById(b.getAttribute("aria-controls")) : null;
  const panel = ctl || [...root.querySelectorAll("[role=dialog], dialog, [aria-modal], nav")].find(e => vis(e) && e.getBoundingClientRect().height > 200 && !e.closest("footer"));
  const visibleLinks = [...root.querySelectorAll("a[href]")].filter(a => vis(a) && onScreen(a)).length;
  const panelLinks = panel ? [...panel.querySelectorAll("a[href]")].filter(vis).length : null;
  return { ariaExpanded: b ? b.getAttribute("aria-expanded") : null, panelFound: !!panel, panelVisible: panel ? vis(panel) : null, panelLinks, visibleLinksOnScreen: visibleLinks, bodyOverflow: getComputedStyle(document.body).overflow, controlsId: b ? b.getAttribute("aria-controls") : null };
};

const browser = await chromium.launch();
const results = [];
const jobs = [];
for (const r of routes) for (const v of VIEWPORTS) jobs.push({ r, v });
let idx = 0, done = 0;
const t0 = Date.now();
async function worker(id) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  while (idx < jobs.length) {
    const { r, v } = jobs[idx++];
    const page = await ctx.newPage();
    await page.setViewportSize({ width: v.width, height: v.height });
    const consoleErrors = [];
    page.on("console", m => { if (m.type() === "error") consoleErrors.push(m.text().slice(0, 300)); });
    page.on("pageerror", e => consoleErrors.push("pageerror: " + String(e.message || e).slice(0, 300)));
    const rec = { path: r.path, desktopView: r.desktopView, mobileView: r.mobileView, family: family(r.desktopView), viewport: v.name };
    try {
      const resp = await page.goto(BASE + r.path, { waitUntil: "networkidle", timeout: 60000 });
      rec.status = resp ? resp.status() : null;
      await page.waitForTimeout(600);
      Object.assign(rec, await page.evaluate(MEASURE, { vw: v.width }));
      if (v.width === 390) {
        const b = rec.header?.primary?.burger;
        if (b && b.visible) {
          const before = await page.evaluate(BURGER);
          const el = page.locator("[data-audit-burger]").first();
          let clickErr = null;
          try { await el.click({ timeout: 5000 }); } catch (e) { clickErr = String(e.message).slice(0, 120); try { await el.click({ force: true, timeout: 3000 }); } catch (e2) { clickErr += " | force: " + String(e2.message).slice(0, 80); } }
          await page.waitForTimeout(500);
          const open = await page.evaluate(BURGER);
          let closed = null, clickErr2 = null;
          try { await el.click({ timeout: 5000 }); } catch (e) { clickErr2 = String(e.message).slice(0, 120); try { await el.click({ force: true, timeout: 3000 }); } catch (e2) { clickErr2 += " | force: " + String(e2.message).slice(0, 80); } }
          await page.waitForTimeout(500);
          closed = await page.evaluate(BURGER);
          const opened = (open.ariaExpanded === "true") || (open.panelVisible === true && before.panelVisible !== true) || (open.visibleLinksOnScreen > before.visibleLinksOnScreen + 2);
          const closes = opened && ((closed.ariaExpanded === "false") || (closed.panelVisible !== true && open.panelVisible === true) || (closed.visibleLinksOnScreen <= before.visibleLinksOnScreen + 1));
          rec.burgerTest = { before, open, closed, opened, closesOnSecondClick: closes, linksAfterOpen: open.panelLinks ?? open.visibleLinksOnScreen, clickErr, clickErr2 };
        } else rec.burgerTest = { skipped: b ? "burger not visible" : "no burger found" };
      }
    } catch (e) { rec.error = String(e.message || e).slice(0, 300); }
    rec.consoleErrors = consoleErrors;
    results.push(rec);
    done++;
    if (done % 25 === 0) console.log(`[w${id}] ${done}/${jobs.length} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    await page.close();
  }
  await ctx.close();
}
await Promise.all(Array.from({ length: CONC }, (_, i) => worker(i)));
await browser.close();
results.sort((a, b) => a.path.localeCompare(b.path) || a.viewport.localeCompare(b.viewport));
writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), base: BASE, routeCount: routes.length, records: results }, null, 1));
console.log("wrote", OUT, results.length, "records in", ((Date.now() - t0) / 1000).toFixed(0), "s");
