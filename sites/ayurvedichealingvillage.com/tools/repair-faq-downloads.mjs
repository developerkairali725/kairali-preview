#!/usr/bin/env node
/**
 * AHV — fill the FAQs & Downloads shelf with the site's self-hosted documents.
 *
 * The 22 Sep 2026 design shipped three EMPTY document slots ("[TO CONFIRM]
 * Document title · Awaiting file") because the live /faqs-downloads/ page
 * attaches no files. The owner ruled (D-20260922-11): download the PDFs and
 * self-host them. english-candidate/downloads.json lists every PDF the served
 * record links — all already under public/ahv/assets/doc/ — with the title
 * source for each. This tool rewrites the shelf from that manifest:
 *
 *   · the intro sentence (which described the empty slots) becomes a plain
 *     one-liner;
 *   · the three slot cards become one card per document, in manifest order,
 *     with the file's real size and its last-modified date read from the PDF
 *     itself (/ModDate, else the file's mtime) — nothing typed by hand;
 *   · the dashed "Awaiting file" span becomes the site's brown outline button,
 *     a real download link.
 *
 * Idempotent: a shelf already carrying the manifest is re-generated to the
 * same markup. Fails loudly if a manifest file is missing on disk or the
 * shelf markup is not found.
 *
 *   node tools/repair-faq-downloads.mjs [--dry]
 */
import { readFileSync, writeFileSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const VIEWS = join(SITE, "public/ahv/views");
const DOCS = join(SITE, "public/ahv/assets/doc");
const MANIFEST = JSON.parse(readFileSync(join(SITE, "english-candidate/downloads.json"), "utf8"));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function pdfDate(file) {
  const buf = readFileSync(file);
  const head = buf.toString("latin1");
  const m = head.match(/\/ModDate\s*\(D:(\d{4})(\d{2})(\d{2})/) || head.match(/\/CreationDate\s*\(D:(\d{4})(\d{2})(\d{2})/);
  if (m) return { y: +m[1], mo: +m[2], d: +m[3], from: "pdf" };
  const t = statSync(file).mtime;
  return { y: t.getFullYear(), mo: t.getMonth() + 1, d: t.getDate(), from: "mtime" };
}
const fmtDate = (d) => `${MONTHS[d.mo - 1]} ${d.y}`;
const fmtSize = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);

const docs = MANIFEST.documents.map((d) => {
  if (d.kind === "catalogue") return { ...d, size: "13 languages", date: "September 2026" };
  const file = d.href ? join(SITE, "public", d.href) : join(DOCS, d.file);
  if (!existsSync(file)) throw new Error(`manifest document not on disk: ${d.file}`);
  const bytes = statSync(file).size;
  return { ...d, href: d.href || `/ahv/assets/doc/${d.file}`, size: fmtSize(bytes), bytes, date: fmtDate(pdfDate(file)) };
});

const INTRO = "Documents from the hospital you may want to keep: the price lists for the Ayurveda packages, the free e-book and the village's fauna booklet.";

function card(d, side) {
  const pad = side === "desktop" ? "24px" : "20px";
  return `<article style="border:1px solid #E9E2D3;border-radius:4px;background:#FFFFFF;padding:${pad};box-sizing:border-box;display:flex;flex-direction:column;gap:10px;" data-ahv-download="${esc(d.file)}">` +
    `<span style="font-size:12.5px;letter-spacing:2.6px;text-transform:uppercase;color:#8F6212;">${d.kind === "catalogue" ? "Documents" : "PDF"} · ${esc(d.size)}</span>` +
    `<h3 style="margin:0;font-family:Marcellus,serif;font-weight:400;font-size:23px;line-height:1.3;color:#2A2118;">${esc(d.title)}</h3>` +
    `<p style="margin:0;font-size:16px;line-height:1.6;color:#75695A;">Last updated ${esc(d.date)}</p>` +
    `<a href="${esc(d.href)}" ${d.kind === "catalogue" ? "" : "download"} style="display:inline-flex;align-items:center;justify-content:center;min-height:52px;margin-top:6px;border-radius:4px;border:1.5px solid #5A4420;color:#5A4420;font-weight:700;font-size:14px;letter-spacing:1.5px;text-transform:uppercase;text-decoration:none;padding:0 18px;box-sizing:border-box;">${d.kind === "catalogue" ? "Browse all editions" : "Download PDF"}</a>` +
    `</article>`;
}

let touched = 0;
const problems = [];
for (const side of ["desktop", "mobile"]) {
  const id = `ahv-page-faqs-and-downloads-${side}`;
  const file = join(VIEWS, `${id}.json`);
  if (!existsSync(file)) { problems.push(`missing view: ${id}`); continue; }
  const view = JSON.parse(readFileSync(file, "utf8"));
  let t = view.template;
  const before = t;
  // the shelf: <section id="downloads" …> … <div style="display:grid;…"> (cards) </div> </section>
  const secStart = t.indexOf('<section id="downloads"');
  const secEnd = t.indexOf("</section>", secStart);
  if (secStart < 0 || secEnd < 0) { problems.push(`${id}: downloads shelf not found`); continue; }
  let sec = t.slice(secStart, secEnd);
  // intro paragraph: the first <p …> after the <h2> in the shelf
  sec = sec.replace(/(<h2[^>]*>[^<]*<\/h2>\s*<p[^>]*>)[^<]*(<\/p>)/, `$1${INTRO}$2`);
  // the card grid: replace everything inside the grid div
  const gridRe = /(<div style="display:grid;[^"]*">)[\s\S]*$/;
  if (!gridRe.test(sec)) { problems.push(`${id}: card grid not found`); continue; }
  sec = sec.replace(gridRe, (_m, open) => `${open} ${docs.map((d) => card(d, side)).join(" ")} </div> `);
  t = t.slice(0, secStart) + sec + t.slice(secEnd);
  // postconditions
  const shelf = t.slice(secStart, t.indexOf("</section>", secStart));
  if (/Awaiting file|\[TO CONFIRM\] Document title|carries no attached files/.test(shelf)) problems.push(`${id}: placeholder text survives in the shelf`);
  if ((shelf.match(/data-ahv-download=/g) || []).length !== docs.length) problems.push(`${id}: expected ${docs.length} cards`);
  if (t !== before) { touched += 1; if (!DRY) { view.template = t; writeFileSync(file, JSON.stringify(view)); } console.log(`${DRY ? "[dry] " : "fixed  "}${id}: ${docs.length} documents on the shelf`); }
  else console.log(`as-is  ${id}`);
}
for (const d of docs) console.log(`  ${d.file.padEnd(52)} ${d.size.padStart(7)}  ${d.date}`);
console.log(`\nrepair-faq-downloads${DRY ? " (dry)" : ""}: ${touched} view(s) changed`);
if (problems.length) { console.error("POSTCONDITION FAILURES:\n  " + problems.join("\n  ")); process.exit(1); }
