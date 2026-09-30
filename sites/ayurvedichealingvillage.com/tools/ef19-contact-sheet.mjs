/** EF-19: numbered contact sheet of every gallery image whose library provenance does not prove the
 * Healing Village (anything outside ahv-edited/kAIRALI PALAK KAD…), for the owner to mark
 * AHV / HO / Delhi / other. Read-only: writes <out>/contact-sheet.html + .pdf + .json.
 *   node tools/ef19-contact-sheet.mjs <outDir> */
import fs from "node:fs"; import path from "node:path"; import { createRequire } from "node:module";
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const SITE = process.cwd();
const d = JSON.parse(fs.readFileSync("english-candidate/galleries-2026.json", "utf8"));
const rows = new Map();
for (const r of d.routes) for (const ch of r.chapters) for (const im of ch.images) {
  const lp = im.libraryPath || "?";
  if (lp.startsWith("ahv-edited/kAIRALI PALAK KAD")) continue;
  const k = im.sha256 || im.src;
  if (!rows.has(k)) rows.set(k, { src: im.src, thumb: im.src768 || im.src, library: lp, alt: im.alt, sha256: im.sha256, uses: [] });
  rows.get(k).uses.push(`${r.path} · ${ch.title || ch.id}`);
}
const list = [...rows.values()].sort((a, b) => a.library.localeCompare(b.library, "en", { numeric: true }));
list.forEach((x, i) => (x.no = i + 1));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const html = `<!doctype html><meta charset="utf-8"><title>EF-19 contact sheet</title><style>
body{font:12px/1.4 -apple-system,Helvetica,sans-serif;margin:18px;color:#222}h1{font-size:18px;margin:0 0 4px}p.lead{margin:0 0 14px;max-width:1000px}
.grid{font-size:0}.c{display:inline-block;vertical-align:top;width:calc(25% - 12px);margin:0 12px 12px 0;box-sizing:border-box;font-size:12px;border:1px solid #ccc;padding:6px;break-inside:avoid;page-break-inside:avoid}
.c img{width:100%;height:150px;object-fit:cover;display:block;background:#eee}.n{font-weight:700;font-size:15px}.lib{color:#555;word-break:break-all}.u{color:#666;font-size:10.5px}
.mark{margin-top:4px;font-size:11px}</style>
<h1>EF-19 — gallery images whose source folder does not prove the Healing Village (${list.length})</h1>
<p class="lead">Generated ${new Date().toISOString().slice(0, 16)}Z from english-candidate/galleries-2026.json. Every image below is live in a staging gallery. Folder names (<b>ktahv/</b>, <b>ktahv-shoot-2025/</b>) do not by themselves prove the property; one frame shows a wall emblem reading “Kairali Ayurvedic Centre”. Please mark each number: <b>A</b> = Healing Village (keep) · <b>H</b> = head office · <b>D</b> = Delhi centre · <b>O</b> = other/unsure. Images from the Palakkad library (ahv-edited/…PALAK KAD…) are not listed. The owner-identified head-office hero has already been replaced.</p>
<div class="grid">${list.map((x) => `<div class="c"><div class="n">#${x.no}</div><img src="file://${path.join(SITE, "public", x.thumb)}"><div class="lib">${esc(x.library)}</div><div>${esc(x.alt)}</div><div class="u">${x.uses.map(esc).join("<br>")}</div><div class="mark">A ☐ · H ☐ · D ☐ · O ☐</div></div>`).join("")}</div>`;
fs.writeFileSync(path.join(OUT, "contact-sheet.html"), html);
fs.writeFileSync(path.join(OUT, "contact-sheet.json"), JSON.stringify(list, null, 1));
const require_ = createRequire(import.meta.url);
let dir = SITE, store; for (let i = 0; i < 6 && !store; i++) { const s = path.join(dir, "node_modules", ".pnpm"); if (fs.existsSync(s)) store = s; dir = path.dirname(dir); }
const { chromium } = require_(path.join(store, fs.readdirSync(store).find((x) => x.startsWith("playwright@")), "node_modules", "playwright"));
const b = await chromium.launch(); const p = await b.newPage();
await p.goto("file://" + path.join(OUT, "contact-sheet.html"), { waitUntil: "load" });
await p.pdf({ path: path.join(OUT, "contact-sheet.pdf"), format: "A4", landscape: true, printBackground: true, margin: { top: "10mm", bottom: "10mm", left: "8mm", right: "8mm" } });
await b.close();
console.log("images", list.length, "→", OUT);
