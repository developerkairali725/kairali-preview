// /arogya-kendra/ owner content review (28 Sep 2026, parent OWNER-OPD-AROGYA-REGRESSIONS.md): the partner page was one
// long run of four paragraphs, then a generic hospital-location block and a patient-programme prompt. The location
// block is fixed at its root in article-reader.css (it was never meant to show here). This gives the page its own
// structure and onward navigation WITHOUT new facts:
//  · three sub-headings, each a plain summary of the paragraph(s) it introduces (what the idea is, who it is for,
//    what Kairali provides) — no claim is added, and no paragraph text is changed (the legacy wording, including
//    "remedies … performed miracles", stays as held content for the owner / Dr. Deepu John to rule on);
//  · "Other ways to work with Kairali": links to the partner pages that exist in the site tree, with the tree's own
//    labels, plus the partners hub and the contact page.
// The patient prompt ("Not sure which programme fits?") is hidden on this route in article-reader.css.
// Idempotent; the dataset is written back in its own serialisation.
//   node tools/repair-arogya-kendra-partner-page-20260928.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
const FILE = "public/ahv/assets/reader25b-family-data.js";
const py = (v) => Array.isArray(v) ? "[" + v.map(py).join(", ") + "]" : v && typeof v === "object" ? "{" + Object.entries(v).map(([k, x]) => JSON.stringify(k) + ": " + py(x)).join(", ") + "}" : JSON.stringify(v);
const s = fs.readFileSync(FILE, "utf8"); const i = s.indexOf("{"), j = s.lastIndexOf("}");
const D = JSON.parse(s.slice(i, j + 1));
const ser = [(o) => JSON.stringify(o), py, (o) => JSON.stringify(o, null, 1), (o) => JSON.stringify(o, null, 2)].find((f) => s.slice(0, i) + f(D) + s.slice(j + 1) === s);
if (!ser) throw new Error("unknown serialisation");
const R = D.routes.find((r) => r.path === "/arogya-kendra/");
const art = R.components.find((c) => c.component === "article");
const paras = art.blocks.filter((b) => b.kind === "para");
if (paras.length !== 4) throw new Error(`expected 4 paragraphs, found ${paras.length}`);
const expect = ["Up until recently, Ayurveda", "For its efforts in this regard", "For Ayurvedic practitioners who are willing", "Kairali Ayurvedic Group provides doctors"];
paras.forEach((p, k) => { if (!String(p.text || "").startsWith(expect[k])) throw new Error(`paragraph ${k + 1} changed: ${String(p.text).slice(0, 40)}`); });
const NOTE = "Owner content review 28 Sep 2026: structure only, summarising the paragraph(s) below; no new fact.";
const h = (text, ptr) => ({ kind: "heading", tag: "h2", ptr, tree: [{ k: "t", v: text }], text, editorialNote: NOTE });
const link = (href, text, ptr) => ({ ptr, tree: [{ k: "e", tag: "a", attrs: { href, target: null }, c: [{ k: "t", v: text }] }], text, images: [], children: [] });
let changed = false;
if (!art.blocks.some((b) => b.ptr === "/review-20260928/h-idea")) {
  const out = [];
  for (const b of art.blocks) {
    if (b === paras[0]) out.push(h("The Arogya Kendra idea", "/review-20260928/h-idea"));
    if (b === paras[2]) out.push(h("Who it is for", "/review-20260928/h-who"));
    if (b === paras[3]) out.push(h("What Kairali provides", "/review-20260928/h-support"));
    out.push(b);
  }
  out.push(h("Other ways to work with Kairali", "/review-20260928/h-partners"));
  out.push({ kind: "list", ordered: false, ptr: "/review-20260928/partners", editorialNote: "Onward navigation: partner pages from the site tree (english-candidate/site-tree.json, /our-partners/ branch), their tree labels.", items: [
    link("/arogya-shala/", "Arogya Shala: product partnership for doctors", "/review-20260928/partners/1"),
    link("/ayurvedic-franchise/", "Franchise with Kairali", "/review-20260928/partners/2"),
    link("/consultancy/", "Consultancy for wellness businesses", "/review-20260928/partners/3"),
    link("/our-partners/", "All partnerships", "/review-20260928/partners/4"),
    link("/contact-us/", "Contact us about an Arogya Kendra", "/review-20260928/partners/5"),
  ] });
  art.blocks = out; changed = true;
}
if (changed && !CHECK) fs.writeFileSync(FILE, s.slice(0, i) + ser(D) + s.slice(j + 1));
console.log((CHECK ? "[check] " : "") + (changed ? "/arogya-kendra/: 4 sub-headings + partner onward navigation added" : "already applied"));
