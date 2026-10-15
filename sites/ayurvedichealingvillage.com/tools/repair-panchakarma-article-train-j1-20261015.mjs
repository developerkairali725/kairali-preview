// Train J batch 1 (15 Oct 2026; AHV-M004.01 layout, AHV-M004.03 explanatory images). /panchakarma/ (reader 25B) was one
// long run: intro, an upper-case "WHAT IS PANCHAKARMA?" and five therapy paragraphs. It becomes an article with an
// "On this page" list, a "What is Panchakarma?" section and one sub-section per therapy (Vamanam, Virechanam, Vasti,
// Nasyam, Raktamokshana), at the reader's existing 76ch measure. Every visible string is an existing frozen English unit
// with 12 accepted translations ("On this page", "What is Panchakarma?", the five therapy names); every source paragraph,
// the source "Ayurveda" illustration, the hero, the retired sidebar record and the contextual links are kept unchanged and
// in order. Two explanatory photographs are added, each already published on another programme page with its existing
// translated, factual alt text (no caption, no claim): the synchronised Abhyanga oil massage (the intro's "medicated oil
// massage", /preventive-and-regenerative-treatment/) and the Nasyam nasal therapy (beside the Nasyam paragraph,
// /panchakarma-therapy/). /panchakarma-therapy/ stays the package page. The English snapshot is rebuilt to the same markup
// reader25b-family-render.js now emits (heading ids + an in-page link list).
//   node tools/repair-panchakarma-article-train-j1-20261015.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
export const ROUTE = "/panchakarma/";
export const DATA = "public/ahv/assets/reader25b-family-data.js";
export const SNAPSHOT = "english-candidate/prerender/panchakarma.html";
export const ABHYANGA = { kind: "image", src: "/ahv/assets/img/Preventive-About-Abhyanga.webp", alt: "Two Kairali therapists performing a synchronised Abhyanga oil massage on a seated patient", width: 580, height: 387, external: false, linkHref: null, linkPtr: null, reuse: "ahv-page-preventive-regenerative (AHV-M004.03)" };
export const NASYAM = { kind: "image", src: "/ahv/assets/img/Your-Ayurvedic-Treatment-for-Bronchial-Diseases.webp", alt: "Therapist administering Nasyam nasal therapy to a patient during Panchakarma treatment", width: 580, height: 386, external: false, linkHref: null, linkPtr: null, reuse: "ahv-page-panchakarma-therapy (AHV-M004.03)" };
// [anchor, label, source paragraph pointer] in source order
export const THERAPIES = [
  ["vamanam", "Vamanam", "/sections/3/c/3/c/8"],
  ["virechanam", "Virechanam", "/sections/3/c/3/c/10"],
  ["vasti", "Vasti", "/sections/3/c/3/c/14"],
  ["nasyam", "Nasyam", "/sections/3/c/3/c/16"],
  ["raktamokshana", "Raktamokshana", "/sections/3/c/3/c/18"],
];
const WHAT = ["what-is-panchakarma", "What is Panchakarma?"];
const t = (v) => [{ k: "t", v }];
const heading = (tag, text, anchor) => ({ kind: "heading", tag, tree: t(text), text, anchor });
export function applyData(D) {
  const r = D.routes.find((x) => x.path === ROUTE);
  if (!r) throw new Error("missing " + ROUTE);
  if (r.components.some((c) => c.component === "on-this-page")) return D;
  const at = r.components.findIndex((c) => c.component === "article");
  const art = r.components[at];
  const by = Object.fromEntries(art.blocks.filter((b) => b.ptr).map((b) => [b.ptr, b]));
  const need = ["/sections/3/c/3/c/2", "/sections/3/c/3/c/4", "/sections/3/c/3/c/6", "/sections/3/c/3/c/12/c/0", ...THERAPIES.map((x) => x[2])];
  for (const p of need) if (!by[p]) throw new Error("missing source block " + p);
  if (art.blocks.length !== need.length) throw new Error("unexpected article blocks");
  const toc = { kind: "list", ordered: false, items: [WHAT, ...THERAPIES].map(([anchor, label]) => ({ tree: [{ k: "e", tag: "a", attrs: { href: "#" + anchor }, c: t(label) }], text: label, anchor })) };
  const five = [];
  for (const [anchor, label, ptr] of THERAPIES) {
    five.push(heading("h3", label, anchor), by[ptr]);
    if (ptr === "/sections/3/c/3/c/10") five.push(by["/sections/3/c/3/c/12/c/0"]); // the source illustration stays where it was
    if (anchor === "nasyam") five.push({ ...NASYAM });
  }
  const what = by["/sections/3/c/3/c/4"];
  const next = [
    { component: "article", ptr: art.ptr, blocks: [by["/sections/3/c/3/c/2"], { ...ABHYANGA }] },
    { component: "on-this-page", blocks: [heading("h2", "On this page"), toc] },
    // the source H2 keeps its pointer; its upper-case source text is shown in the existing sentence-case unit
    { component: "what-is-panchakarma", blocks: [{ ...what, tree: t(WHAT[1]), text: WHAT[1], anchor: WHAT[0], sourceText: what.text }, by["/sections/3/c/3/c/6"]] },
    { component: "the-five-therapies", blocks: five },
  ];
  r.components.splice(at, 1, ...next);
  return D;
}
// ── English snapshot: the same markup, with the capture's own normalised style strings ──
const P = "margin: 0px 0px 14px; max-width: 76ch; font-size: 17.5px; line-height: 1.75; text-wrap: pretty;";
const H = (tag) => "font-family: Marcellus, serif; font-weight: 400; line-height: 1.22; margin: 26px 0px 10px; font-size: " + (tag === "h2" ? "clamp(24px, 2.4vw, 32px)" : "23px") + ";";
const SEC = "width: min(1220px, 94%); margin: 0px auto; padding: 14px 0px; min-width: 0px;";
const UL = "margin: 0px 0px 16px; padding-left: 24px; display: flex; flex-direction: column; gap: 8px; max-width: 76ch; list-style-type: disc;";
const LI = "font-size: 17.5px; line-height: 1.75; text-wrap: pretty;";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const hHtml = (tag, text, anchor, ptr) => `<${tag}${ptr ? ` data-source-pointer="${ptr}"` : ""} style="${H(tag)}${anchor ? " scroll-margin-top: 96px;" : ""}"${anchor ? ` id="${anchor}"` : ""}>${esc(text)}</${tag}>`;
const imgHtml = (im) => `<div style="margin: 0px 0px 14px; max-width: ${im.width}px; min-width: 0px;"><div style="min-width: 0px;"><img alt="${esc(im.alt)}" width="${im.width}" height="${im.height}" fetchpriority="low" loading="lazy" src="${im.src}" style="display: block; width: 100%; max-width: ${im.width}px; height: auto; border-radius: 4px;"></div></div>`;
const section = (tpl, component, ptr, inner) => `<section data-dc-tpl="${tpl}" data-source-component="${component}"${ptr ? ` data-source-pointer="${ptr}"` : ""} style="${SEC}">${inner}</section>`;
export function applySnapshot(html) {
  if (html.includes('data-source-component="on-this-page"')) return html;
  const open = html.match(/<section data-dc-tpl="(\d+)" data-source-component="article" data-source-pointer="\/sections\/3\/c\/3"[^>]*>/);
  if (!open) throw new Error("snapshot article not found");
  const start = open.index, end = html.indexOf("</section>", start) + "</section>".length, inner = html.slice(start + open[0].length, end - "</section>".length);
  const part = (ptr) => { const m = inner.match(new RegExp(`<p data-source-pointer="${ptr}"[^>]*>[\\s\\S]*?</p>`)); if (!m) throw new Error("snapshot paragraph " + ptr); return m[0]; };
  const ill = inner.match(/<div style="margin: 0px 0px 14px; max-width: 200px; min-width: 0px;">[\s\S]*?<\/div><\/div>/);
  if (!ill) throw new Error("snapshot illustration");
  const tpl = open[1];
  const toc = `<ul data-list-depth="0" style="${UL}">` + [WHAT, ...THERAPIES].map(([a, l]) => `<li style="${LI}"><a href="#${a}" style="text-underline-offset: 2px; overflow-wrap: anywhere;">${esc(l)}</a></li>`).join("") + "</ul>";
  let five = "";
  for (const [a, l, ptr] of THERAPIES) {
    five += hHtml("h3", l, a) + part(ptr);
    if (ptr === "/sections/3/c/3/c/10") five += ill[0];
    if (a === "nasyam") five += imgHtml(NASYAM);
  }
  const out = [
    section(tpl, "article", "/sections/3/c/3", part("/sections/3/c/3/c/2") + imgHtml(ABHYANGA)),
    section(tpl, "on-this-page", null, hHtml("h2", "On this page") + toc),
    section(tpl, "what-is-panchakarma", null, hHtml("h2", WHAT[1], WHAT[0], "/sections/3/c/3/c/4") + part("/sections/3/c/3/c/6")),
    section(tpl, "the-five-therapies", null, five),
  ].join("\n      ");
  return html.slice(0, start) + out + html.slice(end);
}
if (process.argv[1]?.endsWith("repair-panchakarma-article-train-j1-20261015.mjs")) {
  const s = fs.readFileSync(DATA, "utf8");
  const i = s.indexOf("{"), j = s.lastIndexOf("}");
  const pre = s.slice(0, i), post = s.slice(j + 1), D = JSON.parse(s.slice(i, j + 1));
  if (pre + JSON.stringify(D) + post !== s) throw new Error(DATA + ": dataset does not round-trip");
  const next = pre + JSON.stringify(applyData(D)) + post;
  const html = fs.readFileSync(SNAPSHOT, "utf8"), nextHtml = applySnapshot(html);
  const changed = [next !== s && DATA, nextHtml !== html && SNAPSHOT].filter(Boolean);
  if (!CHECK) { if (next !== s) fs.writeFileSync(DATA, next); if (nextHtml !== html) fs.writeFileSync(SNAPSHOT, nextHtml); }
  console.log((CHECK ? "[check] " : "") + `${changed.length} file(s) changed` + (changed.length ? ": " + changed.join(" ") : ""));
  if (CHECK && changed.length) process.exitCode = 1;
}
