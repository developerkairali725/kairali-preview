/** EF-24: evidence for "true duplicate" archive pages — rendered <main> text per route, pairwise
 * Jaccard similarity of 5-word shingles, plus dates/years named in each page. Read-only.
 *   node tools/ef24-duplicates.mjs --section news --out <file.json> */
import fs from "node:fs"; import path from "node:path"; import { createRequire } from "node:module";
const arg = (n, d) => { const i = process.argv.indexOf("--" + n); return i > -1 ? process.argv[i + 1] : d; };
const tree = JSON.parse(fs.readFileSync("english-candidate/site-tree.json", "utf8"));
const s = tree.sections.find((x) => x.id === arg("section", "news"));
const routes = []; const walk = (ns) => ns.forEach((n) => { if (n.path) routes.push(n.path); walk(n.children || []); }); walk(s.children);
const require_ = createRequire(import.meta.url);
let dir = process.cwd(), store; for (let i = 0; i < 6 && !store; i++) { const q = path.join(dir, "node_modules", ".pnpm"); if (fs.existsSync(q)) store = q; dir = path.dirname(dir); }
const { chromium } = require_(path.join(store, fs.readdirSync(store).find((d) => d.startsWith("playwright@")), "node_modules", "playwright"));
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const pages = {};
for (const r of routes) { const p = await ctx.newPage(); await p.goto("http://localhost:4471" + r, { waitUntil: "load" }); await p.waitForTimeout(1500);
  pages[r] = await p.evaluate(() => { const m = document.querySelector("main") || document.body; const rail = m.querySelector("[data-ahv-section-nav]"); if (rail) rail.remove(); const crumbs = m.querySelector('nav[aria-label="Breadcrumb"]'); if (crumbs) crumbs.remove(); return { h1: (document.querySelector("h1") || {}).innerText || "", text: m.innerText }; }); await p.close(); }
await b.close();
const sh = (t) => { const w = t.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean); const set = new Set(); for (let i = 0; i + 5 <= w.length; i++) set.add(w.slice(i, i + 5).join(" ")); return set; };
const S = Object.fromEntries(Object.entries(pages).map(([r, v]) => [r, sh(v.text)]));
const pairs = [];
for (let i = 0; i < routes.length; i++) for (let j = i + 1; j < routes.length; j++) {
  const a = S[routes[i]], c = S[routes[j]]; let inter = 0; for (const x of a) if (c.has(x)) inter++;
  const jac = inter / (a.size + c.size - inter || 1), cover = inter / Math.min(a.size, c.size || 1);
  if (jac > 0.2 || cover > 0.5) pairs.push({ a: routes[i], b: routes[j], jaccard: +jac.toFixed(2), containment: +cover.toFixed(2) });
}
const dates = Object.fromEntries(Object.entries(pages).map(([r, v]) => [r, { h1: v.h1.trim(), years: [...new Set(v.text.match(/\b(19|20)\d\d\b/g) || [])].sort(), words: (v.text.match(/\S+/g) || []).length }]));
fs.writeFileSync(arg("out", "/tmp/ef24.json"), JSON.stringify({ at: new Date().toISOString(), pairs: pairs.sort((x, y) => y.jaccard - x.jaccard), pages: dates }, null, 1));
for (const p of pairs.sort((x, y) => y.jaccard - x.jaccard)) console.log(p.jaccard, p.containment, p.a, "~", p.b, "| years", dates[p.a].years.join(","), "vs", dates[p.b].years.join(","));
