// Read-only: tier the KTAHV language-lock occurrences in the served English pages (prerender snapshots + route
// metadata) by WHERE they appear, so a scoped change can be decided instead of a blanket rewrite. Authority for the
// word list: CLAUDE.md "KTAHV LANGUAGE LOCK (GST SCN)"; standing instruction (owner, 15 Sep 2026): report only —
// the approved design copy is not rewritten without a ruling (english-candidate/language-lock-audit.json).
//   node tools/language-lock-tiers.mjs [--out file.json]
import fs from "node:fs";
const OUT = (() => { const i = process.argv.indexOf("--out"); return i > -1 ? process.argv[i + 1] : null; })();
const WORDS = /\b(spas?|resorts?|holidays?|luxury|luxurious|cures?|cured|curing|journeys?|guests?|getaways?)\b/gi;
// proper names that contain a locked word and stay verbatim (award / organisation / legal-entity / event titles)
const PROPER = [
  /World Luxury (Spa )?Awards?/gi, /Luxury Lifestyle Awards?/gi, /Spa (and|&) Wellness (Coalition|Collection)/gi, /Certified Spa Awards?/gi,
  /Global Spa( & Wellness)?/gi, /Luxury Spa Destination/gi, /Kairali Ayurvedic Health Resorts?( Pvt\.? Ltd\.?)?/gi, /Ayurvedic Indian Journey/gi,
  /Travellers?'? Choice/gi, /Spa Awards?/gi, /Asia Spa/gi, /Luxury Travel Guide/gi,
];
const manifest = JSON.parse(fs.readFileSync("english-candidate/route-manifest.json", "utf8")).routes;
const redirected = new Set(Object.keys(JSON.parse(fs.readFileSync("english-candidate/redirect-map.json", "utf8")).redirects));
const TIERS = { heading: 0, cta: 0, alt: 0, seoMeta: 0, body: 0, properNameExempt: 0 };
const perRoute = [];
const count = (text) => { let exempt = 0; let t = text; for (const p of PROPER) t = t.replace(p, (m) => { exempt += (m.match(WORDS) || []).length; return " ".repeat(m.length); }); return { hits: (t.match(WORDS) || []).length, exempt }; };
for (const r of manifest) {
  if (redirected.has(r.path) || r.sitemapExclude) continue;
  const f = `english-candidate/prerender/${(r.path.replace(/^\/+|\/+$/g, "") || "index").replace(/[^a-z0-9._-]+/gi, "_")}.html`;
  if (!fs.existsSync(f)) continue;
  const html = fs.readFileSync(f, "utf8").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
  const row = { route: r.path, heading: 0, cta: 0, alt: 0, seoMeta: 0, body: 0, properNameExempt: 0 };
  const add = (tier, text) => { const c = count(text); row[tier] += c.hits; row.properNameExempt += c.exempt; };
  // alts
  for (const mm of html.matchAll(/\balt="([^"]*)"/gi)) add("alt", mm[1]);
  // headings, then CTA-ish link/button text, then the remaining body text
  let rest = html.replace(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi, (m, t) => { add("heading", t.replace(/<[^>]+>/g, " ")); return " "; });
  rest = rest.replace(/<(a|button)\b[^>]*>([\s\S]*?)<\/\1>/gi, (m, tag, t) => { const s = t.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); if (s.length <= 60) { add("cta", s); return " "; } return m; });
  add("body", rest.replace(/\balt="[^"]*"/gi, " ").replace(/<[^>]+>/g, " "));
  const md = r.metadata || {};
  add("seoMeta", [md.title, md.description, md.ogTitle, md.ogDescription].filter(Boolean).join(" \n "));
  const total = row.heading + row.cta + row.alt + row.seoMeta + row.body;
  if (total || row.properNameExempt) perRoute.push({ ...row, total });
  for (const k of Object.keys(TIERS)) TIERS[k] += row[k];
}
perRoute.sort((a, b) => b.total - a.total);
const summary = { generated: new Date().toISOString(), authority: ["CLAUDE.md KTAHV LANGUAGE LOCK (GST SCN)", "owner instruction 15 Sep 2026: report only, approved design copy not rewritten without a ruling (english-candidate/language-lock-audit.json)", "docs/reports/2026-09-15-ahv-go-live-checklist.md: 'Dr. Deepu John and the owner rule on the KTAHV language lock … a GST-exposure decision and it is not a build fix'"], tiers: TIERS, routesWithHits: perRoute.filter((r) => r.total).length, top: perRoute.slice(0, 25) };
console.log(JSON.stringify({ tiers: TIERS, routesWithHits: summary.routesWithHits }, null, 1));
for (const r of perRoute.slice(0, 12)) console.log(String(r.total).padStart(4), r.route, `h${r.heading} cta${r.cta} alt${r.alt} meta${r.seoMeta} body${r.body} exempt${r.properNameExempt}`);
if (OUT) fs.writeFileSync(OUT, JSON.stringify({ ...summary, routes: perRoute }, null, 1));
