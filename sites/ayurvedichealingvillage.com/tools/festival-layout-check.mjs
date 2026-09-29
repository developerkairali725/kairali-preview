// Festival / culture layout check: the /festivals/ hub, /cultural-events/ and the festival detail units, at
// 390 / 768 / 1440 / 1920 / 2560 in English and in Arabic (RTL), with full-page screenshots.
//   * identity first: HTTP 200, final URL, data-ahv-route, <html lang>/dir (rtl for /ar/);
//   * gallery/content images actually loaded: every rendered <img> in the page body (header/footer excluded) is
//     scrolled into view and must reach naturalWidth > 0; images the layout does not render at that width
//     (display:none variants) are listed separately, never counted as loaded;
//   * lone images/cards sit in the text column at ≥ 1180 px: per content section, the text column is the horizontal
//     extent of its paragraphs; a media item with no other media item beside it (a "lone" image or card) must lie
//     inside that extent (±2 px). Side-by-side galleries are exempt and listed;
//   * no horizontal overflow: scrollWidth ≤ innerWidth + 1, offenders listed.
// Festival DETAIL routes: taken from --detail-routes, else discovered from l10n/routes.json and the site tree
// (children of /festivals/). If fewer than three exist, the report says so and the per-festival sections of the
// hub (each H2 title followed by H3 month) are checked as the detail units instead — nothing is invented.
//   node tools/festival-layout-check.mjs --base http://127.0.0.1:4471 --out /tmp/festivals [--locales en,ar] [--widths 390,768,1440,1920,2560] [--detail-routes a,b,c]
//   hosted: vercel env run -- bash -c "cd sites/ayurvedichealingvillage.com && node tools/festival-layout-check.mjs --base https://ahv-final-staging.vercel.app --out <dir>"
import path from "node:path";
import fs from "node:fs";
import { attachStagingToken } from "./lib/staging-auth.mjs";
import { arg, baseArg, outDir, readJson, writeJson, nowIso, istStamp, runContext, line, playwright } from "./lib/verify-common.mjs";

const BASE = baseArg();
const OUT = outDir("/tmp/ahv-festival-layout");
const LOCALES = arg("locales", "en,ar").split(",");
const WIDTHS = arg("widths", "390,768,1440,1920,2560").split(",").map(Number);
const HEIGHT = { 390: 844, 768: 1024, 1440: 900, 1920: 1080, 2560: 1440 };
const R = readJson("l10n/routes.json").routes;
const L = readJson("l10n/locales.json");
const HUBS = ["/festivals/", "/cultural-events/"];

function discoverDetails() {
  const explicit = arg("detail-routes"); if (explicit) return { routes: explicit.split(","), source: "--detail-routes" };
  const found = new Set(Object.keys(R).filter((k) => /festiv|pooram|onam|vela|nercha|konganpada/i.test(k) && !HUBS.includes(k)));
  try {
    const tree = readJson("english-candidate/site-tree.json");
    const walk = (n) => { if (!n || typeof n !== "object") return; if (Array.isArray(n)) return n.forEach(walk); if (n.path === "/festivals/" && Array.isArray(n.children)) for (const c of n.children) found.add(c.path); for (const v of Object.values(n)) if (v && typeof v === "object") walk(v); };
    walk(tree);
  } catch {}
  return { routes: [...found], source: "l10n/routes.json keys matching festival names + site-tree children of /festivals/" };
}
const details = discoverDetails();
const run = { ...runContext(BASE), tool: "tools/festival-layout-check.mjs", at: nowIso(), ist: istStamp(), locales: LOCALES, widths: WIDTHS, detailRoutes: details };
console.log(`festival layout @ ${BASE} (${run.note})`);
if (details.routes.length < 3) console.log(`NOTE: ${details.routes.length} festival detail route(s) exist (${details.source}); the hub's per-festival sections are checked as the detail units.`);
const ROUTES = [...HUBS, ...details.routes];
const MAX_TILES = +arg("max-tiles", "14");
// --negative-control-css "<css>": injects CSS after load to prove the checks can fail (evidence runs never use it)
const NEG_CSS = arg("negative-control-css", "");
// --negative-control-block "<substring>": aborts matching image requests, to prove a missing image is caught
const NEG_BLOCK = arg("negative-control-block", "");
if (NEG_BLOCK) console.log(`NEGATIVE CONTROL: aborting requests containing ${JSON.stringify(NEG_BLOCK)} — results are NOT evidence about the site`);
if (NEG_CSS) console.log(`NEGATIVE CONTROL: injecting CSS ${JSON.stringify(NEG_CSS)} — results are NOT evidence about the site`);
async function captureTiles(pg, stem) {
  const files = [];
  const { sh, ih } = await pg.evaluate(() => ({ sh: document.documentElement.scrollHeight, ih: innerHeight }));
  const n = Math.min(MAX_TILES, Math.ceil(sh / ih));
  for (let t = 0; t < n; t++) {
    await pg.evaluate((y) => window.scrollTo(0, y), t * ih); await pg.waitForTimeout(350);
    const f = `${stem}-t${String(t + 1).padStart(2, "0")}.png`;
    try { await pg.screenshot({ path: f, timeout: 20000 }); files.push(f); } catch (e) { files.push(`FAILED ${f}: ${String(e.message).split("\n")[0].slice(0, 80)}`); }
  }
  if (Math.ceil(sh / ih) > n) files.push(`(page is ${Math.ceil(sh / ih)} viewports tall; first ${n} captured — raise --max-tiles for more)`);
  await pg.evaluate(() => window.scrollTo(0, 0));
  return files;
}
function festivalIdentity(rec, id, loc, key, p) {
  const probs = []; let u; try { u = new URL(rec.finalUrl); } catch {}
  if (rec.status !== 200) probs.push("non-200 status");
  if (!u || u.origin !== new URL(BASE).origin || u.pathname !== p) probs.push("wrong origin/path");
  if (id.route !== key) probs.push("wrong route");
  const allowed = [L[loc]?.lang,L[loc]?.htmlLang].filter(Boolean).map(x=>x.toLowerCase());
  if (!allowed.includes(String(id.lang || "").toLowerCase())) probs.push("wrong lang");
  if (id.dir !== (L[loc]?.dir || "ltr")) probs.push("wrong direction");
  return probs;
}
function festivalCoverage(rec) {
  const probs=[];
  if (!rec.images?.rendered) probs.push("no rendered content images");
  if (!rec.layout?.length || !rec.layout.some(s=>s.items?.length)) probs.push("empty scoped layout/media");
  if (rec.key === "/festivals/" && (rec.festivalUnits?.length !== 5 || rec.festivalUnits.some(u=>!u.title || !u.month || !u.text))) probs.push("expected five H2 festival units with H3 month and body text");
  if (!rec.screenshots?.length) probs.push("screenshot evidence absent");
  if (rec.screenshots?.some(s=>s.startsWith("FAILED "))) probs.push("screenshot capture failed");
  if (rec.screenshots?.some(s=>s.startsWith("(page is "))) probs.push("screenshot evidence truncated");
  return probs;
}
const results = [];

const { chromium } = await playwright();
const browser = await chromium.launch();
for (const loc of LOCALES) for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: HEIGHT[w] || 900 }, isMobile: w < 800, hasTouch: w < 800 });
  await attachStagingToken(ctx, BASE);
  if (NEG_BLOCK) await ctx.route((u) => u.href.includes(NEG_BLOCK), (rt) => rt.abort());
  for (const key of ROUTES) {
    const p = loc === "en" ? key : (R[key] && R[key][loc]);
    const tag = `${key} ${loc}@${w}`;
    if (!p) { results.push({ key, loc, w, status2: "FAIL", error: "no locale route" }); line("FAIL", tag, "no locale route"); continue; }
    const pg = await ctx.newPage(); const pageErrors = []; pg.on("pageerror", (e) => pageErrors.push(String(e.message).slice(0, 200)));
    const rec = { key, loc, w, path: p };
    try {
      const resp = await pg.goto(BASE + p, { waitUntil: "networkidle", timeout: 120000 }); await pg.waitForTimeout(2000);
      rec.status = resp ? resp.status() : 0; rec.finalUrl = pg.url();
      const id = await pg.evaluate(() => ({ lang: document.documentElement.lang, dir: document.documentElement.dir || getComputedStyle(document.documentElement).direction, route: document.getElementById("ahv-design-root")?.getAttribute("data-ahv-route"), title: document.title, h1: (document.querySelector("h1") || {}).innerText || null }));
      rec.identity = id;
      const idProblems = festivalIdentity(rec, id, loc, key, p);
      rec.identityProblems = idProblems;
      if (idProblems.length) throw new Error("identity: " + idProblems.join("; "));
      if (NEG_CSS) { await pg.addStyleTag({ content: NEG_CSS }); await pg.waitForTimeout(300); rec.negativeControlCss = NEG_CSS; }
      // images: scroll each rendered body image into view and wait for it
      const n = await pg.evaluate(() => { const root = document.querySelector("#ahv-design-root main"); const imgs = [...(root?.querySelectorAll("img") || [])].filter((i) => !i.closest("header, footer, nav, #ahv-consent, #ahv-contact-controls")); imgs.forEach((i, k) => i.setAttribute("data-verify-img", String(k))); return imgs.length; });
      const images = [];
      for (let k = 0; k < n; k++) {
        const loc8 = pg.locator(`[data-verify-img="${k}"]`);
        const pre = await loc8.evaluate((i) => { const r = i.getBoundingClientRect(); const s = getComputedStyle(i); return { rendered: r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden" }; });
        if (!pre.rendered) { images.push({ k, rendered: false, src: await loc8.evaluate((i) => (i.currentSrc || i.getAttribute("src") || "").replace(location.origin, "")) }); continue; }
        await loc8.evaluate((i) => i.scrollIntoView({ block: "center" }));
        const st = await loc8.evaluate(async (i) => { const t0 = Date.now(); while (!(i.complete && i.naturalWidth > 0) && Date.now() - t0 < 6000) await new Promise((r) => setTimeout(r, 150)); const r = i.getBoundingClientRect(); return { src: (i.currentSrc || i.src || "").replace(location.origin, ""), complete: i.complete, naturalWidth: i.naturalWidth, w: Math.round(r.width), h: Math.round(r.height), loading: i.loading, alt: i.getAttribute("alt") }; });
        images.push({ k, rendered: true, ...st, loaded: st.naturalWidth > 0 });
      }
      rec.images = { rendered: images.filter((i) => i.rendered).length, loaded: images.filter((i) => i.rendered && i.loaded).length, notRendered: images.filter((i) => !i.rendered).map((i) => i.src), failed: images.filter((i) => i.rendered && !i.loaded) };
      await pg.evaluate(() => window.scrollTo(0, 0)); await pg.waitForTimeout(400);
      // layout: text column vs lone media, per content section
      rec.layout = await pg.evaluate((w) => {
        const vis = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden"; };
        const root = document.getElementById("ahv-design-root") || document.body;
        const main = root.querySelector("main") || root;
        // content blocks: the innermost <section>/<article> elements of the page body (the hub uses a 2-column
        // <section> grid, the culture page a 2-column <article> grid)
        const sections = [...main.querySelectorAll("section, article")].filter(vis).filter((s) => !s.closest("header, footer") && !s.querySelector("section, article"));
        const out = [];
        for (const s of sections) {
          const allParas = [...s.querySelectorAll("p")].filter(vis).filter((p) => (p.innerText || "").trim().length > 40);
          if (!allParas.length) continue;
          // media items: cards (li/figure holding an image) else bare images
          const outerCard = (c) => { for (let a = c.parentElement; a && a !== s; a = a.parentElement) if (a.matches("li, figure")) return false; return true; };
          const cards = [...s.querySelectorAll("li, figure")].filter(vis).filter((c) => c.querySelector("img") && outerCard(c));
          // the text column is measured on the running text OUTSIDE the cards (a card's own caption must not widen it)
          const freeParas = allParas.filter((p) => !cards.some((c) => c.contains(p)));
          const paras = freeParas.length ? freeParas : allParas;
          const col = { l: Math.min(...paras.map((p) => p.getBoundingClientRect().left)), r: Math.max(...paras.map((p) => p.getBoundingClientRect().right)) };
          const imgs = [...s.querySelectorAll("img")].filter(vis).filter((i) => !cards.some((c) => c.contains(i)) && i.getBoundingClientRect().width > 60);
          const h3s = [...s.querySelectorAll("h2")].filter(vis);
          const unitOf = (el) => { let u = null; for (const h of h3s) if (h.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) u = h.innerText.trim().slice(0, 50); return u; };
          const items = [...cards.map((c) => ({ kind: "card", el: c })), ...imgs.map((i) => ({ kind: "image", el: i }))].map((x) => { const r = x.el.getBoundingClientRect(); return { kind: x.kind, unit: unitOf(x.el), l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top + scrollY), b: Math.round(r.bottom + scrollY), src: (x.el.querySelector ? (x.el.querySelector("img") || x.el) : x.el).getAttribute("src") }; }).sort((a, b) => a.t - b.t);
          for (const it of items) { it.lone = !items.some((o) => o !== it && o.t < it.b && o.b > it.t && (o.r <= it.l || o.l >= it.r)); it.inColumn = it.l >= col.l - 2 && it.r <= col.r + 2; }
          const heading = (s.querySelector("h1,h2,h3") || {}).innerText || "";
          out.push({ heading: heading.trim().slice(0, 60), column: { l: Math.round(col.l), r: Math.round(col.r) }, items, festivals: [...s.querySelectorAll("h2")].filter(vis).map((h) => h.innerText.trim().slice(0, 50)) });
        }
        return out;
      }, w);
      // Structural language-independent unit signature from the source article: H2 title, H3 month, body.
      rec.festivalUnits = key === "/festivals/" ? await pg.evaluate(() => {
        const main=document.querySelector("#ahv-design-root main"); if(!main)return [];
        const visible=e=>e.getClientRects().length>0 && getComputedStyle(e).visibility!=="hidden";
        return [...main.querySelectorAll("h2")].filter(visible).filter(h=>!h.closest("nav,header,footer") && h.nextElementSibling?.tagName==="H3").map((h,index)=>{
          const month=h.nextElementSibling;let text="";
          for(let n=month.nextElementSibling;n && n.tagName!=="H2";n=n.nextElementSibling) if(visible(n)) text+=(n.innerText||"").trim();
          return {index,title:h.innerText.trim(),month:visible(month)&&month.innerText.trim(),text:text.length>40};
        });
      }) : null;
      const enforce = w >= 1180;
      const misplaced = rec.layout.flatMap((s) => s.items.filter((i) => i.lone && !i.inColumn).map((i) => ({ section: s.heading, ...i, column: s.column })));
      rec.lonesOutOfColumn = enforce ? misplaced : [];
      rec.galleriesExempt = rec.layout.flatMap((s) => s.items.filter((i) => !i.lone)).length;
      rec.overflow = await pg.evaluate(() => {
        const sw = document.documentElement.scrollWidth, iw = innerWidth;
        const offenders = sw > iw + 1 ? [...document.querySelectorAll("body *")].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > iw + 1 || r.left < -1) && getComputedStyle(e).position !== "fixed"; }).slice(0, 12).map((e) => { const r = e.getBoundingClientRect(); return `${e.tagName.toLowerCase()}${e.id ? "#" + e.id : ""}${e.className && typeof e.className === "string" ? "." + e.className.split(" ")[0] : ""} [${Math.round(r.left)}..${Math.round(r.right)}]`; }) : [];
        return { scrollWidth: sw, innerWidth: iw, overflow: sw > iw + 1, offenders };
      });
      // screenshots: viewport tiles top→bottom (a fullPage capture hangs on this runtime at ≥ 768 px — the
      // viewport resize it performs re-triggers the design's breakpoint swap), so the evidence is N real viewports
      rec.screenshots = await captureTiles(pg, path.join(OUT, `${key.replace(/\W+/g, "_")}-${loc}-${w}`));
      const problems = festivalCoverage(rec);
      if (rec.images.failed.length) problems.push(`${rec.images.failed.length} rendered image(s) never loaded`);
      if (rec.lonesOutOfColumn.length) problems.push(`${rec.lonesOutOfColumn.length} lone image/card outside the text column`);
      if (rec.overflow.overflow) problems.push(`horizontal overflow ${rec.overflow.scrollWidth} > ${rec.overflow.innerWidth}`);
      if (pageErrors.length) problems.push(`${pageErrors.length} page error(s)`);
      rec.pageErrors = pageErrors; rec.problems = problems; rec.status2 = problems.length ? "FAIL" : "PASS";
    } catch (e) { rec.status2 = "FAIL"; rec.error = String(e.message).slice(0, 240); }
    results.push(rec);
    line(rec.status2, tag, rec.error ? { error: rec.error } : { images: `${rec.images.loaded}/${rec.images.rendered} loaded (${rec.images.notRendered.length} not rendered at this width)`, sections: rec.layout.length, lonesChecked: w >= 1180 ? rec.layout.reduce((a, s) => a + s.items.filter((i) => i.lone).length, 0) : "n/a <1180", galleriesExempt: rec.galleriesExempt, overflow: rec.overflow.overflow, problems: rec.problems });
    await pg.close();
  }
  await ctx.close();
}
await browser.close();
const summary = { PASS: results.filter((r) => r.status2 === "PASS").length, FAIL: results.filter((r) => r.status2 === "FAIL").length };
writeJson(OUT, "festival-layout.json", { run: { ...run, negativeControlCss: NEG_CSS || null, negativeControlBlock: NEG_BLOCK || null }, summary, results });
console.log(`\nsummary: ${JSON.stringify(summary)} → ${path.join(OUT, "festival-layout.json")}  (screenshots in ${OUT})`);
process.exit(summary.FAIL ? 1 : 0);
