import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";
const ROUTES = ["/kair-by-kairali/", "/festivals/", "/walk-in-ayurveda-treatment/", "/social-responsibilities/", "/books/", "/online-consultation/", "/about-us/"];
const b = await chromium.launch(); const out = {};
for (const w of [1920, 390]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 1000 } }); const p = await ctx.newPage(); const errs = [];
  p.on("console", m => { if (m.type() === "error") errs.push(m.text().slice(0, 140)); }); p.on("pageerror", e => errs.push("PAGEERROR " + String(e).slice(0, 140)));
  for (const r of ROUTES) {
    errs.length = 0; await p.goto("http://localhost:4321" + r, { waitUntil: "networkidle", timeout: 60000 }); await p.waitForTimeout(900);
    const d = await p.evaluate(() => {
      const root = document.getElementById("ahv-design-root"); const main = root.querySelector("main") || root; const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== "none"; };
      const txt = main.innerText || ""; const ps = [...main.querySelectorAll("p")].filter(vis).sort((a, b) => b.textContent.length - a.textContent.length); const big = ps[0]; const bigR = big && big.getBoundingClientRect();
      const navs = [...main.querySelectorAll("nav, aside, section > ul")].filter(n => vis(n) && n.querySelectorAll("a").length >= 3 && n.getAttribute("aria-label") !== "Breadcrumb").map(n => { const r = n.getBoundingClientRect(); const a = n.querySelector("a"); const ar = a.getBoundingClientRect(); const hit = document.elementFromPoint(ar.left + ar.width / 2, Math.min(ar.top + ar.height / 2, innerHeight - 1)); return { tag: n.tagName.toLowerCase(), left: Math.round(r.left), right: Math.round(r.right), top: Math.round(r.top), w: Math.round(r.width), links: n.querySelectorAll("a").length, firstLink: a.textContent.trim().slice(0, 30), firstLinkHit: hit && (hit.tagName.toLowerCase() + (hit.id ? "#" + hit.id : "") + (hit === a || a.contains(hit) ? " (=link)" : " (COVERS)")), pos: getComputedStyle(n).position, float: getComputedStyle(n).float }; });
      const imgs = [...root.querySelectorAll("main img, img")].filter(vis).slice(0, 40).map(i => ({ src: i.getAttribute("src").split("/").slice(-2).join("/").slice(0, 60), nw: i.naturalWidth, w: Math.round(i.getBoundingClientRect().width), alt: (i.alt || "").slice(0, 40) }));
      const ph = [...main.querySelectorAll("*")].filter(e => { const s = e.getAttribute("style") || ""; return vis(e) && (/#E0D7C4/i.test(s) || /dashed/.test(s)) && !e.querySelector("img"); }).slice(0, 6).map(e => ({ tag: e.tagName.toLowerCase(), w: Math.round(e.getBoundingClientRect().width), h: Math.round(e.getBoundingClientRect().height), text: e.innerText.replace(/\s+/g, " ").slice(0, 50) }));
      const leaks = (txt.match(/\{\{/g) || []).length;
      const h1 = main.querySelector("h1"); const structure = [...main.children].slice(0, 10).map(c => c.tagName.toLowerCase() + (c.id ? "#" + c.id : "") + "(" + c.children.length + ")");
      return { fam: root.getAttribute("data-ahv-family"), textLen: txt.length, head: txt.replace(/\s+/g, " ").slice(0, 220), h1: h1 && h1.textContent.trim().slice(0, 60), bigP: bigR && { left: Math.round(bigR.left), right: Math.round(bigR.right), w: Math.round(bigR.width) }, navs, imgs: imgs.length, brokenImgs: imgs.filter(i => i.nw === 0), imgSample: imgs.slice(0, 6), placeholders: ph, leaks, structure, overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth };
    });
    out[w + " " + r] = { ...d, errs: errs.slice(0, 3) };
  }
  await ctx.close();
}
await b.close(); writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
for (const [k, d] of Object.entries(out)) { console.log("\n=== " + k + " fam=" + d.fam + " textLen=" + d.textLen + " leaks=" + d.leaks + " overflow=" + d.overflow + " imgs=" + d.imgs + " broken=" + d.brokenImgs.length + " errs=" + d.errs.join(" | ")); console.log("  h1: " + d.h1 + " | head: " + d.head.slice(0, 160)); console.log("  structure: " + d.structure.join(" ")); console.log("  bigP: " + JSON.stringify(d.bigP) + " navs: " + JSON.stringify(d.navs)); if (d.placeholders.length) console.log("  placeholders: " + JSON.stringify(d.placeholders)); if (d.brokenImgs.length) console.log("  broken: " + JSON.stringify(d.brokenImgs)); console.log("  imgSample: " + JSON.stringify(d.imgSample)); }
