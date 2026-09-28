// Figures in public/ahv/assets/article-family-data.js with no recorded width rendered with max-width:0px (the article
// renderer builds max-width from `width`), which a broad !important image override used to mask by stretching every
// column image to 100% (CSR-MAP-ASPECT / PRODUCTS-IMAGE-NAV root cause, 28 Sep 2026). With that override removed, the
// images need their real intrinsic size recorded, so they render at natural size bounded by the column — never
// upscaled, never collapsed. Dimensions are READ from the served image files (webp/png/jpeg headers); nothing guessed.
// Idempotent; byte-exact round trip checked.   node tools/repair-figure-dimensions-20260928.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
const FILE = "public/ahv/assets/article-family-data.js";
function dims(file) {
  const b = fs.readFileSync(file);
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const t = b.toString("ascii", 12, 16);
    if (t === "VP8X") return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
    if (t === "VP8 ") return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    if (t === "VP8L") { const v = b.readUInt32LE(21); return [1 + (v & 0x3fff), 1 + ((v >> 14) & 0x3fff)]; }
  }
  if (b.readUInt32BE(0) === 0x89504e47) return [b.readUInt32BE(16), b.readUInt32BE(20)];
  if (b[0] === 0xff && b[1] === 0xd8) { let i = 2; while (i < b.length) { if (b[i] !== 0xff) { i++; continue; } const m = b[i + 1], len = b.readUInt16BE(i + 2); if (m >= 0xc0 && m <= 0xc3) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]; i += 2 + len; } }
  return null;
}
// this dataset is serialised Python-style (", " and ": " separators, non-ASCII kept); write it back the same way
const py = (v) => Array.isArray(v) ? "[" + v.map(py).join(", ") + "]" : v && typeof v === "object" ? "{" + Object.entries(v).map(([k, x]) => JSON.stringify(k) + ": " + py(x)).join(", ") + "}" : JSON.stringify(v);
const s = fs.readFileSync(FILE, "utf8"); const i = s.indexOf("{"), j = s.lastIndexOf("}");
const pre = s.slice(0, i), post = s.slice(j + 1); const D = JSON.parse(s.slice(i, j + 1));
if (pre + py(D) + post !== s) throw new Error("dataset does not round-trip");
let filled = 0; const missing = [];
const walk = (o) => { if (Array.isArray(o)) return o.forEach(walk); if (!o || typeof o !== "object") return;
  if (o.kind === "figure" && o.src && !o.width) { const f = "public" + o.src; const d = fs.existsSync(f) ? dims(f) : null; if (d) { o.width = d[0]; o.height = d[1]; o.dimensionsNote = "served file header, 28 Sep 2026"; filled++; } else missing.push(o.src); }
  for (const k in o) walk(o[k]); };
walk(D);
if (missing.length) { console.error("could not read:", missing.join(" ")); process.exit(1); }
if (!CHECK && filled) fs.writeFileSync(FILE, pre + py(D) + post);
console.log((CHECK ? "[check] " : "") + `${filled} figure(s) given their intrinsic width/height`);
