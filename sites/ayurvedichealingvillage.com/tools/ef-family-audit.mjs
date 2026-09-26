/**
 * Owner-feedback family audit (EF-12/13/14/17/24): render every route of a site-tree section (or an
 * explicit list) in batches of ≤25 and report, per route, what a visitor would hit:
 *   · links in <main>: status of every internal target (redirects and 4xx named), zero-size links;
 *   · images in <main>: broken, repeated on the page, the shared aerial banner used as content,
 *     empty/filename-like alt;
 *   · text: [TO CONFIRM] chips and internal-note phrasing ("the record", "source page", "captured").
 * Read-only. Writes <out>.json and <out>.md.
 *   node tools/ef-family-audit.mjs --base http://localhost:4471 --section knowledge --out /tmp/kc
 *   node tools/ef-family-audit.mjs --routes /a/,/b/ --out /tmp/x
 */
import fs from "node:fs"; import path from "node:path"; import { createRequire } from "node:module";
const arg = (n, d) => { const i = process.argv.indexOf("--" + n); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg("base", "http://localhost:4471"), OUT = arg("out", "/tmp/ef-audit");
const tree = JSON.parse(fs.readFileSync("english-candidate/site-tree.json", "utf8"));
let routes = arg("routes", "") ? arg("routes").split(",") : [];
if (arg("section")) {
  const s = tree.sections.find((x) => x.id === arg("section"));
  if (!s) throw new Error("no section " + arg("section"));
  const walk = (ns) => ns.forEach((n) => { if (n.path) routes.push(n.path); walk(n.children || []); });
  if (s.hub) routes.push(s.hub); walk(s.children);
  for (const [p, info] of Object.entries(tree.unlisted || {})) if (info.section === s.id) routes.push(p);
}
routes = [...new Set(routes)];
const require_ = createRequire(import.meta.url);
let dir = process.cwd(), store; for (let i = 0; i < 6 && !store; i++) { const s = path.join(dir, "node_modules", ".pnpm"); if (fs.existsSync(s)) store = s; dir = path.dirname(dir); }
const { chromium } = require_(path.join(store, fs.readdirSync(store).find((d) => d.startsWith("playwright@")), "node_modules", "playwright"));
const BANNER = /ee7d129f97f1b7e2|our-story\.webp/;
const NOTE = /\bthe record('|’)?s?\b|\bsource (page|record|node)\b|\bcaptured\b|\bplaceholder\b|\bTODO\b/i;
const status = new Map();
async function head(u) {
  if (status.has(u)) return status.get(u);
  let s; try { const r = await fetch(u, { redirect: "manual" }); s = r.status + (r.headers.get("location") ? "→" + new URL(r.headers.get("location"), u).pathname : ""); } catch { s = "ERR"; }
  status.set(u, s); return s;
}
const b = await chromium.launch();
const results = [];
for (let i = 0; i < routes.length; i += 25) {
  const batch = routes.slice(i, i + 25);
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  for (const route of batch) {
    const p = await ctx.newPage(); const errors = [];
    p.on("pageerror", (e) => errors.push(String(e).slice(0, 120)));
    const row = { route, batch: i / 25 + 1, issues: [] };
    try {
      const resp = await p.goto(BASE + route, { waitUntil: "load", timeout: 60000 });
      row.status = resp.status();
      await p.waitForTimeout(1800);
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
      await p.waitForTimeout(600);
      const data = await p.evaluate(() => {
        const main = document.querySelector("main") || document.body;
        const rail = main.querySelector("nav[data-ahv-section-nav], [data-ahv-section-nav]");
        const inRail = (e) => rail && rail.contains(e);
        const links = [...main.querySelectorAll("a[href]")].filter((a) => !inRail(a)).map((a) => { const r = a.getBoundingClientRect(); return { href: a.href, text: (a.innerText || a.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 60), w: r.width, h: r.height }; });
        const imgs = [...main.querySelectorAll("img")].filter((i) => !inRail(i)).map((i) => ({ src: i.currentSrc || i.src, alt: i.getAttribute("alt"), complete: i.complete, nw: i.naturalWidth, w: Math.round(i.getBoundingClientRect().width) }));
        return { h1: (document.querySelector("h1") || {}).innerText || "", text: main.innerText, links, imgs };
      });
      row.h1 = data.h1.trim().slice(0, 80);
      row.bodyImages = data.imgs.filter((im) => !BANNER.test(im.src) && !/lotus|logo|icon|\/travel\//i.test(im.src) && (im.w || 0) >= 0).length;
      row.words = (data.text.match(/\S+/g) || []).length;
      row.links = data.links.length;
      if (!row.bodyImages) row.issues.push({ kind: "no-content-image", detail: "only the shared banner (or none)" });
      for (const l of data.links) {
        let u; try { u = new URL(l.href); } catch { continue; }
        if (!/^https?:/.test(u.protocol) || u.hash && u.pathname === new URL(BASE + route).pathname) continue;
        if (!(u.origin === BASE || /ayurvedichealingvillage\.com$/.test(u.hostname))) continue;
        const s = await head(BASE + u.pathname + u.search);
        if (!/^200$/.test(s)) row.issues.push({ kind: "link", detail: `${s} ${u.pathname} "${l.text}"` });
        else if (!l.w && !l.h && l.text) row.issues.push({ kind: "hidden-link", detail: `${u.pathname} "${l.text}"` });
      }
      const seen = new Map();
      for (const im of data.imgs) {
        const name = im.src.split("/").pop();
        seen.set(name, (seen.get(name) || 0) + 1);
        if (im.complete && im.nw === 0) row.issues.push({ kind: "broken-image", detail: name });
        if (BANNER.test(im.src) && im.w && im.w < 1000) row.issues.push({ kind: "banner-as-content", detail: name.slice(0, 30) + " alt=" + JSON.stringify(im.alt) });
        if (im.alt === "" && im.w > 120) row.issues.push({ kind: "empty-alt", detail: name.slice(0, 40) });
        else if (im.alt && /\.(jpe?g|png|webp)$|^(img|image|dsc)[\w-]*\d/i.test(im.alt)) row.issues.push({ kind: "filename-alt", detail: im.alt });
      }
      for (const [n, c] of seen) if (c > 1 && !BANNER.test(n)) row.issues.push({ kind: "repeated-image", detail: `${n.slice(0, 40)} ×${c}` });
      const chips = (data.text.match(/\[TO CONFIRM[^\]]*\]/g) || []).length;
      if (chips) row.issues.push({ kind: "to-confirm", detail: `${chips} chip(s)` });
      for (const line of data.text.split("\n")) if (NOTE.test(line) && line.length < 400) row.issues.push({ kind: "internal-note?", detail: line.trim().slice(0, 140) });
      if (errors.length) row.issues.push({ kind: "js-error", detail: errors[0] });
    } catch (e) { row.issues.push({ kind: "load", detail: String(e).slice(0, 120) }); }
    results.push(row); await p.close();
    process.stdout.write(`${route} ${row.issues.length}\n`);
  }
  await ctx.close();
}
await b.close();
fs.writeFileSync(OUT + ".json", JSON.stringify({ base: BASE, at: new Date().toISOString(), routes: results.length, results }, null, 1));
const md = [`# Family audit — ${arg("section") || "routes"} (${results.length} routes, batches of ≤25)`, "", `Base ${BASE} · ${new Date().toISOString()} · local Chromium 1440 · read-only`, "", "| # | Route | H1 | imgs / words / links | Issues |", "|---|---|---|---|---|",
  ...results.map((r, i) => `| ${i + 1} | ${r.route} | ${(r.h1 || "").replace(/\|/g, "/")} | ${r.bodyImages ?? "?"} / ${r.words ?? "?"} / ${r.links ?? "?"} | ${r.issues.length ? r.issues.map((x) => `**${x.kind}** ${x.detail.replace(/\|/g, "/")}`).join("<br>") : "—"} |`)];
fs.writeFileSync(OUT + ".md", md.join("\n") + "\n");
console.log("routes", results.length, "with issues", results.filter((r) => r.issues.length).length);
