// EF-04a (owner, 26 Sep 2026) — the homepage views carry their own footer markup apart from the shared
// footer component every other page imports. The header was already aligned; the footer still said
// "Yoga–Dhyāna Abhyāsa — Yoga & Meditation Training" (and three other labels drifted). This rewrites
// ONLY the visible text of homepage FOOTER links whose destination the shared footer also links, to the
// shared footer's label. Destinations, attributes and everything outside <footer> are untouched.
// Idempotent. Guarded by test/chrome-consistency.test.mjs.
//   node tools/repair-home-footer-labels-ef04a.mjs [--check]
import fs from "node:fs";

const CHECK = process.argv.includes("--check");
const strip = (s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const rel = (h) => h.replace(/^https?:\/\/(www\.)?ayurvedichealingvillage\.com/, "");
const comp = fs.readFileSync("public/ahv/components/AHV Chrome Footer.dc.html", "utf8");
const shared = new Map();
// a destination may carry more than one label in the shared footer (desktop vs phone); any of them is in sync
for (const m of comp.matchAll(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) { const l = strip(m[2]); if (!l) continue; const k = rel(m[1]); if (!shared.has(k)) shared.set(k, []); if (!shared.get(k).includes(l)) shared.get(k).push(l); }

let changed = 0;
for (const v of ["home-hi-fi-v4", "home-mobile"]) {
  const file = `public/ahv/views/${v}.json`;
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  const t = json.template;
  const a = t.lastIndexOf("<footer"), b = t.indexOf("</footer>", a);
  if (a < 0 || b < 0) throw new Error(`${v}: no footer`);
  const foot = t.slice(a, b).replace(/(<a[^>]*href="([^"]+)"[^>]*>)([^<]*)(<\/a>)/g, (all, open, href, text, close) => {
    const labels = shared.get(rel(href));
    if (!labels || labels.includes(strip(text))) return all;
    const want = labels[0];
    changed++;
    console.log(`${v}: ${rel(href)}  "${strip(text)}" -> "${want}"`);
    return open + want.replace(/&/g, "&amp;") + close;
  });
  json.template = t.slice(0, a) + foot + t.slice(b);
  if (!CHECK) fs.writeFileSync(file, JSON.stringify(json, null, 2) + "\n");
}
console.log(CHECK ? `${changed} label(s) would change` : `${changed} label(s) aligned`);
if (CHECK && changed) process.exitCode = 1;
