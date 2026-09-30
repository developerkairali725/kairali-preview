#!/usr/bin/env node
/**
 * AHV — /about-us/: two owner asks from the 22–23 Sep review (D-20260922-22).
 *
 * 1. THE "IMAGE WITH TEXT ON TOP". The intro section's figure is a 448×455
 *    photograph with a translucent card, the Kairali logo and the words
 *    "Asia's Best Ayurvedic Retreat Since 1999" + one paragraph BAKED INTO
 *    THE PIXELS (AHV-About-Wellness-section.webp) — unreadable to a search
 *    engine or an AI. Owner: "can be remade by you, same concept, just newer
 *    and AI-readable text". The figure becomes real markup: a photograph with
 *    the same card over it, the logo as an <img>, the heading and paragraph
 *    as text — copied VERBATIM from the picture, no word changed. The
 *    photograph is the first record image of /property-gallery/ (a served
 *    property photograph, not the aerial the page already uses), so the page
 *    stops repeating a picture.
 *
 * 2. CERTIFICATES & RECOGNITIONS — "a little note on what each is, better for
 *    AI search". Each document card gains one factual line composed ONLY from
 *    the record's printed evidence (number / order, issue or validity dates,
 *    issuer scope as printed) — no judgement words (the record's internal
 *    review notes such as "do not upgrade" or "standing not checked" are NOT
 *    printed). The dataset already orders NABH first; nothing is reordered
 *    here. No newer certificate scans exist in the image bank (checked 23 Sep:
 *    the bank's award images are 2007–2019 banners, all older than the
 *    site's), so none is replaced — flagged for the owner.
 *
 * Applied to both about-us views. Idempotent; loud postconditions.
 *
 *   node tools/repair-about-us.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const VIEWS = join(SITE, "public/ahv/views");
const RECORD = JSON.parse(readFileSync(join(SITE, "english-candidate/record-images.json"), "utf8")).routes;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/* the photograph behind the card: the first served property-gallery record image not already on the page */
const aboutView = JSON.parse(readFileSync(join(VIEWS, "ahv-page-about-us-desktop.json"), "utf8")).template;
// not the paddy-field aerial the whole site already reuses, not anything already on the page
const pool = (RECORD["/property-gallery/"] || []).filter((i) => !aboutView.includes(i.src) && !/aerial|signboard|site map|prohibit/i.test(i.alt || ""));
// a garden / pathway / lawn view first (the card sits over it; a quiet background reads best), else the first left
const photo = pool.find((i) => /garden|pathway|lawn|hammock|pool/i.test(i.alt || "")) || pool[0];
if (!photo) { console.error("no property-gallery record image available for the banner"); process.exit(1); }
if (!existsSync(join(SITE, "public", photo.src.replace(/^\//, "")))) { console.error(`banner photo missing on disk: ${photo.src}`); process.exit(1); }

const HEADING = "Asia's Best Ayurvedic Retreat Since 1999";
const PARA = "Kairali-The Ayurvedic Healing Village, Palakkad, Kerala is one-of-its-kind of a holistic space, which heals you internally and externally with traditional and authentic Ayurvedic therapies.";
const LOGO = "/ahv/assets/img/kairali-colorful-logo.webp";

function banner(mobile) {
  return `<figure data-ahv-banner="about-wellness" style="margin:0;${mobile ? "width:100%" : "justify-self:end;width:100%;max-width:448px"};position:relative;aspect-ratio:448/455;border-radius:4px;overflow:hidden;background:#E0D7C4">` +
    `<img src="${esc(photo.src)}" alt="${esc(photo.alt || "Kairali – The Ayurvedic Healing Village, Palakkad")}" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block">` +
    `<figcaption style="position:absolute;left:8%;right:8%;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.93);border:1px solid rgba(233,226,211,.9);border-radius:4px;padding:26px 22px;text-align:center;box-sizing:border-box">` +
    `<img src="${LOGO}" alt="Kairali – The Ayurvedic Healing Village" width="150" height="35" loading="lazy" style="width:150px;height:auto;display:block;margin:0 auto 14px">` +
    `<strong style="display:block;font-family:'Marcellus',serif;font-weight:400;font-size:${mobile ? "22px" : "24px"};line-height:1.2;color:#2A2118;text-wrap:balance">${esc(HEADING)}</strong>` +
    `<span style="display:block;margin-top:12px;font-size:15.5px;line-height:1.6;color:#514A3F">${esc(PARA)}</span>` +
    `</figcaption></figure>`;
}

/** one factual line per document, from the printed evidence only */
const NOTE_FN = `
function ahvDocNote(c) {
  const e = c.printedEvidence || {};
  const parts = [];
  if (e.number) parts.push("No. " + e.number);
  if (e.order) parts.push("Order " + e.order);
  if (e.printedValidFrom && e.printedValidThrough) parts.push("Valid " + e.printedValidFrom + " to " + e.printedValidThrough);
  else if (e.printedIssueDate && e.printedValidThrough) parts.push("Issued " + e.printedIssueDate + ", valid to " + e.printedValidThrough);
  else if (e.printedValidThrough) parts.push("Valid to " + e.printedValidThrough);
  else if (e.printedDate && e.printedPeriod) parts.push("Dated " + e.printedDate + ", " + e.printedPeriod);
  else if (e.issued) parts.push("Issued " + e.issued.replace(/(\\d)(\\D)/, "$1 $2"));
  return parts.join(" · ");
}
`;

const problems = [];
let touched = 0;
for (const side of ["desktop", "mobile"]) {
  const id = `ahv-page-about-us-${side}`;
  const file = join(VIEWS, `${id}.json`);
  const view = JSON.parse(readFileSync(file, "utf8"));
  let t = view.template, logic = view.logic || "";
  const did = [];
  // 1. the banner
  const figRe = /<figure[^>]*>\s*<img src="\/ahv\/assets\/img\/AHV-About-Wellness-section\.webp"[^>]*>\s*<\/figure>/;
  if (figRe.test(t)) { t = t.replace(figRe, banner(side === "mobile")); did.push("banner → markup"); }
  else {
    // already remade: keep its photograph in step with the choice above
    const cur = t.match(/<figure data-ahv-banner="about-wellness"[^>]*>\s*<img src="([^"]+)"/);
    if (cur && cur[1] !== photo.src) { t = t.replace(/(<figure data-ahv-banner="about-wellness"[^>]*>\s*<img src=")[^"]+(" alt=")[^"]*(")/, `$1${esc(photo.src)}$2${esc(photo.alt || "")}$3`); did.push("banner photo"); }
  }
  // 2. the certificate note: logic passes it, the template prints it
  if (!logic.includes("ahvDocNote")) {
    const mapRe = /documents: docs\.map\(\(c, idx\) => \(\{ i: idx, src: c\.src, label: c\.label,/;
    if (!mapRe.test(logic)) problems.push(`${id}: documents mapping not found`);
    else {
      logic = logic.replace(mapRe, "documents: docs.map((c, idx) => ({ i: idx, src: c.src, label: c.label, note: ahvDocNote(c),");
      logic = logic.replace(/class Component extends DCLogic \{/, NOTE_FN + "\nclass Component extends DCLogic {");
      did.push("note in logic");
    }
  }
  if (!t.includes("{{ c.note }}")) {
    const labelRe = /(<span style="font-weight:700;font-size:1[45]\.5px;line-height:1\.(?:4|35)">\{\{ c\.label \}\}<\/span>)/;
    if (!labelRe.test(t)) problems.push(`${id}: certificate label span not found`);
    else { t = t.replace(labelRe, `$1<span style="font-size:14px;line-height:1.45;color:#514A3F">{{ c.note }}</span>`); did.push("note in template"); }
  }
  if (did.length) { touched += 1; if (!DRY) { view.template = t; view.logic = logic; writeFileSync(file, JSON.stringify(view)); } }
  console.log(`${did.length ? (DRY ? "[dry] " : "fixed  ") : "as-is  "}${id}${did.length ? "  (" + did.join(", ") + ")" : ""}`);
  if (t.includes("AHV-About-Wellness-section.webp")) problems.push(`${id}: the baked-text banner survives`);
  try { new Function("DCLogic", "React", logic); } catch (e) { problems.push(`${id}: logic does not parse: ${e.message}`); }
}
console.log(`\nrepair-about-us${DRY ? " (dry)" : ""}: ${touched} view(s) changed · banner photo ${photo.src.split("/").pop().slice(0, 16)}… (${photo.alt || "no alt"})`);
if (problems.length) { console.error("POSTCONDITION FAILURES:\n  " + problems.join("\n  ")); process.exit(1); }
