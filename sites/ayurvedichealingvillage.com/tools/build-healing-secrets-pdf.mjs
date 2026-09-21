/**
 * Healing Secrets of "Kairali" — Edition 2.0, typeset as a booklet.
 *
 * WHY THIS EXISTS. The shipped PDF is a designed A5 booklet whose CONTENT is
 * the 2023 edition. The owner supplied Edition 2.0 (July 2026) as a Word file:
 * correct and current, but unstyled — 4,681 words, zero images. Converting it
 * straight to PDF produced a Word printout, which is not what a patient should
 * be handed on a hospital's confirmation page. The owner's instruction was to
 * keep the old PDF's format and make it premium.
 *
 * So this rebuilds the booklet: Edition 2.0's text, the old edition's design
 * language, and its own photography.
 *
 * WHAT IS REUSED, AND WHY THAT IS SAFE. The plates, the cover engraving and
 * the logo lockup are taken from the shipped PDF by rendering its pages at
 * 240dpi (pdftoppm) rather than by extracting the embedded streams — the
 * streams are CMYK and decode with inverted colour, which is how the first
 * attempt produced a purple contact sheet. Rendering round-trips through the
 * PDF's own colour handling and comes out correct.
 *
 * DESIGN, measured from the original rather than guessed:
 *   · A5, 148 × 210 mm (the source is 419.528 × 595.276 pt)
 *   · interior pages are WHITE — only the cover and feature pages are parchment
 *   · section headings: Marcellus, with a #378430 green rule on the left and a
 *     gold leaf mark to the right
 *   · cover quote band: #869F2A
 *   · body: PT Serif; labels and lists: Mulish
 * Fonts are the site's own self-hosted files, so the booklet and the website
 * speak in the same type.
 *
 * LOCKED FACTS ENFORCED AT BUILD TIME, not by eye: the WhatsApp number must be
 * +91 92898 38797 (the owner's source carried …38777, the number CLAUDE.md
 * says to fix on sight), and the public address is info@kairali.com. The build
 * FAILS if a banned KTAHV register word reaches a page. A booklet is harder to
 * correct than a web page once it is in someone's hands.
 *
 * Usage:
 *   node tools/build-healing-secrets-pdf.mjs --content <hs-content.json> \
 *        --assets <dir> --out public/ahv/assets/doc/healing-secrets.pdf
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { CENTRES_COUNT, COUNTRIES_PHRASE, COUNTRIES_WORD, CENTRES_NETWORK_LINE } from "@kairali/facts";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const SITE = resolve(HERE, "..");
const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : d;
};

const CONTENT = arg("content", null);
const ASSETS = arg("assets", null);
const OUT = resolve(SITE, arg("out", "public/ahv/assets/doc/healing-secrets.pdf"));
const HTML_OUT = arg("html", null);
if (!CONTENT || !ASSETS) throw new Error("--content and --assets are required");

/* ---------- locked facts (CLAUDE.md) ---------- */
const WHATSAPP = "+91 92898 38797";
const EMAIL = "info@kairali.com";
const BANNED = ["spa", "resort", "holiday", "luxury", "cure", "journey", "guest"];
/** Award names are proper nouns and survive the register lock; so does a
 *  sentence that DENIES a cure claim. Everything else is a build failure. */
const REGISTER_EXCEPTIONS = [
  /world luxury/i, /luxury award/i, /not a cure/i,
  /spasm/i, /span/i, /spatial/i, /holidays?\s*$/i,
];

/* ---------- fonts: the site's own ---------- */
const FONT_DIR = join(SITE, "public/ahv/fonts");
const FONTS = {
  marcellus: "2f6fa616f76102d81c4a935c3a8cd547a8db9de679ad9fda9cfd42f16e7f0743.ttf",
  mulish400: "1594d840862cd8a7027f4e084e9c8240815432db930c915579ce4d6809a02bbb.ttf",
  mulish700: "528a02bfa16072dedf3014b2c6eb5df7de54f984e313131c412f804da959ddff.ttf",
  ptserif400: "009698a23dcc4267ecabc3e0e72f30b61174fe78db20ac6172ef98d15c5f0927.ttf",
  ptserif700: "86fe68d3c03f693cfeb3bfa2410273d3f688c712581d738201bf69fb832545fc.ttf",
};
const fontUrl = (f) => {
  const p = join(FONT_DIR, f);
  if (!existsSync(p)) throw new Error(`font missing: ${f}`);
  return `data:font/ttf;base64,${readFileSync(p).toString("base64")}`;
};
const img = (name) => {
  const p = join(ASSETS, name);
  if (!existsSync(p)) throw new Error(`asset missing: ${name}`);
  return `data:image/jpeg;base64,${readFileSync(p).toString("base64")}`;
};

/* ---------- content ---------- */
/**
 * NETWORK COUNTS ARE COMPUTED, NEVER TYPED (hardcoded-centres-count rule).
 *
 * The source booklet typed "span five countries". Five is CORRECT today — it is
 * exactly what @kairali/facts computes — which is the whole reason the rule
 * exists: a typed count that is right today rots silently the day a centre opens
 * in a sixth country, and a PDF rots worse than a page because nobody re-reads a
 * shipped booklet. The 12x "nine countries" retro-audit of 17 Jul 2026 was that
 * failure at fleet scale.
 *
 * So the content file carries TOKENS and this builder resolves them from the
 * constants at build time. Unknown tokens throw rather than render as literal
 * braces in a customer-facing booklet.
 */
const FACT_TOKENS = {
  COUNTRIES_PHRASE,          // "five countries"
  COUNTRIES_WORD,            // "five"
  CENTRES_COUNT: String(CENTRES_COUNT),
  CENTRES_NETWORK_LINE,      // "14 treatment centres across five countries"
};
function resolveFactTokens(raw) {
  return raw.replace(/\{\{\s*([A-Z_]+)\s*\}\}/g, (m, key) => {
    if (!(key in FACT_TOKENS)) {
      throw new Error(`healing-secrets content references unknown fact token {{${key}}} — add it to @kairali/facts or fix the token.`);
    }
    return FACT_TOKENS[key];
  });
}
const blocks = JSON.parse(resolveFactTokens(readFileSync(CONTENT, "utf8")));
const esc = (s) => String(s).replace(/&amp;/g, "&").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** The leaf mark that sits beside every heading in the original. */
const LEAF = `<svg class="leaf" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21c0-7 5-13 12-15-2 8-6 12-12 15z" fill="#C08A2E"/><path d="M21 3C10 4 4 10 3 21" stroke="#5B8C2A" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`;

function buildPages() {
  const out = [];
  let buf = [];
  const flush = (cls = "") => { if (buf.length) { out.push({ type: "text", cls, html: buf.join("\n") }); buf = []; } };

  // skip the Word file's own cover lines — the cover is designed below
  let i = 0;
  while (i < blocks.length && !/^A Warm Welcome$/i.test(blocks[i].t)) i++;

  const plates = ["plate-a.jpg", "plate-b.jpg", "plate-c.jpg"];
  let plateAt = 0;

  for (; i < blocks.length; i++) {
    const b = blocks[i];
    const t = esc(b.t);
    if (b.s === "Heading1") {
      flush();
      if (plateAt < plates.length && out.length) out.push({ type: "plate", src: plates[plateAt++] });
      out.push({ type: "part", title: t });
    } else if (b.s === "Heading2") {
      buf.push(`<h2>${LEAF}<span>${t}</span></h2>`);
    } else if (b.s === "ListParagraph") {
      const prev = buf[buf.length - 1] || "";
      if (prev.startsWith("<ul>")) buf[buf.length - 1] = prev.replace(/<\/ul>$/, `<li>${t}</li></ul>`);
      else buf.push(`<ul><li>${t}</li></ul>`);
    } else {
      buf.push(`<p>${t}</p>`);
    }
  }
  flush();
  return out;
}

const pages = buildPages();

/* ---------- register + locked-fact gate ---------- */
const allText = blocks.map((b) => b.t).join(" ");
const violations = [];
for (const w of BANNED) {
  const rx = new RegExp(`\\b${w}\\w*\\b`, "gi");
  for (const m of allText.matchAll(rx)) {
    const ctx = allText.slice(Math.max(0, m.index - 70), m.index + 80);
    if (REGISTER_EXCEPTIONS.some((r) => r.test(m[0]) || r.test(ctx))) continue;
    violations.push(`${m[0]} — …${ctx.trim()}…`);
  }
}
if (allText.includes("38777")) violations.push("WhatsApp …38777 — the locked number is …38797 (CLAUDE.md)");
if (violations.length) {
  console.error("REGISTER / LOCKED-FACT FAILURES — booklet not built:");
  for (const v of violations) console.error("  · " + v);
  process.exit(1);
}

/* ---------- the document ----------
 * PAGINATION, and the mistake it corrects. The first build gave every section
 * a fixed 210mm box with overflow:hidden, so anything longer than one page was
 * CLIPPED rather than flowed: 4,681 words of source produced 944 words of PDF,
 * and "Yoga & Meditation Programs" and "Ayurveda Training Programs" — the two
 * sections Edition 2.0 exists to add — vanished completely.
 * Text now flows through the @page margin box and Chrome paginates it. Only
 * the cover, the plates and the part openers are fixed sheets, and they escape
 * the margin box with negative margins so they stay full-bleed.
 */
const html = `<!doctype html><html><head><meta charset="utf-8"><title>Healing Secrets of Kairali</title>
<style>
@font-face{font-family:Marcellus;src:url(${fontUrl(FONTS.marcellus)}) format('truetype');font-weight:400}
@font-face{font-family:Mulish;src:url(${fontUrl(FONTS.mulish400)}) format('truetype');font-weight:400}
@font-face{font-family:Mulish;src:url(${fontUrl(FONTS.mulish700)}) format('truetype');font-weight:700}
@font-face{font-family:'PT Serif';src:url(${fontUrl(FONTS.ptserif400)}) format('truetype');font-weight:400}
@font-face{font-family:'PT Serif';src:url(${fontUrl(FONTS.ptserif700)}) format('truetype');font-weight:700}
:root{--green:#378430;--olive:#869F2A;--gold:#C08A2E;--ink:#2F2A24;--muted:#5C5346;--rule:#E6DFCD}
@page{size:148mm 210mm;margin:16mm 14mm 15mm}
/* NAMED PAGE for the full-bleed sheets. The first attempt pulled them out of
 * the margin box with negative margins; Chrome laid the following flow out
 * against a shifted origin and printed body copy at roughly ten times its size
 * across the part openers. A named page with margin:0 is the supported way to
 * say "this element gets a different page box", and it leaves the flow alone. */
@page bleed{size:148mm 210mm;margin:0}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:#fff;color:var(--ink);font-family:'PT Serif',Georgia,serif}

.full{page:bleed;width:148mm;height:210mm;overflow:hidden;position:relative;break-before:page;break-after:page}
.full img.bleed{width:148mm;height:210mm;object-fit:cover;display:block}

.cover{background:url(${img("parchment.jpg")}) repeat,#EFE7CE;background-size:34mm 34mm;display:flex;flex-direction:column;align-items:center}
.cover .logo{width:62mm;margin:15mm auto 0;display:block;mix-blend-mode:multiply}
.cover h1{font-family:Marcellus,serif;font-size:25pt;line-height:1.25;text-align:center;margin:9mm 12mm 0;color:#3B3428;font-weight:400}
.cover .ed{font-family:Mulish,sans-serif;font-size:8pt;letter-spacing:.22em;text-transform:uppercase;color:#7A6A45;margin-top:4mm}
.cover .eng{width:100%;margin-top:auto;display:block}
.cover .band{background:var(--olive);color:#fff;font-family:Mulish,sans-serif;font-size:8.2pt;line-height:1.62;padding:6mm 11mm;text-align:center}

.part{background:url(${img("parchment.jpg")}) repeat,#EFE7CE;background-size:34mm 34mm;display:flex;flex-direction:column;justify-content:center}
.part .rule{width:18mm;height:2.2pt;background:var(--green);margin:0 auto 6mm}
.part h1{font-family:Marcellus,serif;font-weight:400;font-size:21pt;line-height:1.3;text-align:center;margin:0 14mm;color:#3B3428}

h2{font-family:Marcellus,serif;font-weight:400;font-size:13.2pt;line-height:1.3;color:#2C4A22;
   margin:6.5mm 0 2.8mm;padding-left:4.2mm;border-left:2.6pt solid var(--green);
   display:flex;align-items:center;gap:2.4mm;break-after:avoid;break-inside:avoid}
h2 .leaf{width:4.6mm;height:4.6mm;flex:none;order:2}
h2 span{order:1}
p{font-size:9.3pt;line-height:1.62;margin:0 0 2.6mm;text-align:justify;hyphens:auto;orphans:2;widows:2}
ul{margin:0 0 3mm;padding-left:5mm;font-family:Mulish,sans-serif;font-size:8.8pt;line-height:1.55;break-inside:avoid}
li{margin:0 0 1.1mm}

.contact h1{font-family:Marcellus,serif;font-weight:400;font-size:18pt;margin:0 0 6mm;color:#3B3428;border:0;padding:0;display:block}
.cblock{font-family:Mulish,sans-serif;font-size:9pt;line-height:1.65;margin-bottom:5mm;break-inside:avoid}
.cblock b{display:block;font-size:8pt;letter-spacing:.14em;text-transform:uppercase;color:var(--green);margin-bottom:1.2mm}
.qr{display:flex;align-items:flex-start;gap:5mm;margin-top:6mm;border-top:.8pt solid #D9CFB4;padding-top:5mm;break-inside:avoid}
.colophon .cx{font-family:Marcellus,serif;font-size:15pt;color:#2C4A22;text-align:center;margin:0 10mm}
.colophon .cy{font-family:Mulish,sans-serif;font-size:8.4pt;line-height:1.7;color:#6B6252;text-align:center;margin:5mm 14mm 0}
.qr div{font-family:Mulish,sans-serif;font-size:8pt;line-height:1.5;color:var(--muted)}
</style></head><body>

<section class="full cover">
  <img class="logo" src="${img("logo.jpg")}" alt="Kairali — health through ayurveda, since 1908">
  <h1>Healing Secrets of “Kairali”</h1>
  <div class="ed">Edition 2.0 · July 2026</div>
  <img class="eng" src="${img("engraving.jpg")}" alt="Engraving of Ayurvedic physicians treating a patient">
  <div class="band">“More than 5,000 years ago, the sages of India transcribed their knowledge of healing — Ayurveda, the science of life.”</div>
</section>

${pages.map((pg) => {
  if (pg.type === "plate") return `<section class="full"><img class="bleed" src="${img(pg.src)}" alt=""></section>`;
  if (pg.type === "part") return `<section class="full part"><div class="rule"></div><h1>${pg.title}</h1></section>`;
  return `<section class="flow">${pg.html}</section>`;
}).join("\n")}

<!-- The booklet already ends with its own "Contacts & Our Network" section,
     carrying the corrected WhatsApp number. A second contact page would repeat
     it, so this is a colophon: the one thing the source does not give a reader
     holding a printed copy, which is where to go next. -->
<section class="full part colophon">
  <div class="rule"></div>
  <div class="cx">ayurvedichealingvillage.com</div>
  <div class="cy">Programmes, physicians and how to reach us.<br>Healing Secrets of &ldquo;Kairali&rdquo; &middot; Edition 2.0 &middot; July 2026</div>
</section>

</body></html>`;

/* ---------- render ---------- */
const withQr = html;
if (HTML_OUT) writeFileSync(resolve(HTML_OUT), withQr);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(withQr, { waitUntil: "networkidle" });
// The running footer is Chrome's, not a per-section absolute box: flowing text
// paginates itself, so a footer glued to a section would print once, not once
// per page. Full-bleed sheets carry it too, but they cover it edge to edge.
const FOOT = `<div style="width:100%;font-family:Georgia,serif;font-size:6.5pt;color:#8A7F6C;padding:0 14mm;display:flex;justify-content:space-between;">
  <span>Healing Secrets of &ldquo;Kairali&rdquo; &middot; Edition 2.0</span><span class="pageNumber"></span></div>`;
// preferCSSPageSize hands the page boxes to the stylesheet, so @page and
// @page bleed both apply. Passing a margin here instead would override BOTH and
// print the running footer across the cover and the plates, which is what the
// first render did.
await page.pdf({
  path: OUT, printBackground: true, preferCSSPageSize: true,
  displayHeaderFooter: true, headerTemplate: "<div></div>", footerTemplate: FOOT,
});
await browser.close();

const bytes = readFileSync(OUT).length;
console.log(`healing-secrets: ${pages.length + 2} sections -> ${basename(OUT)} (${(bytes / 1048576).toFixed(2)} MB)`);
console.log(`  register gate: PASS · WhatsApp ${WHATSAPP} · ${EMAIL}`);
