// Owner-approved image batch 2 (28 Sep 2026; english-feedback-20260926/image-approval-review/
// owner-decisions-batch-02-mapped-20260928.json). Applies the EIGHT "yes" items to their named route and placement
// only; 032/035/036 were rejected and are untouched; batch 1 (fd78c07a/bd5b139a) is not revisited. Assets come from
// tools/build-owner-batch02-assets.py (source SHA-256 verified against the approved hash). Alt and caption = the
// approved caption (batch-1 convention). Heroes: only the visible opening image of that route (share-image metadata
// untouched); generic heroes shared with other routes stay on those routes. Each dataset is written back in its own
// serialisation; idempotent.   node tools/apply-owner-batch02-images.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
const MAP = "/Volumes/Extreme SSD - Blue 2nd/Claude Workspaces/10x WordPress and Websites/deliverables/WOPS-AHV-FINAL-DRAFT-20260924-001/english-feedback-20260926/image-approval-review/owner-decisions-batch-02-mapped-20260928.json";
const DEC = Object.fromEntries(JSON.parse(fs.readFileSync(MAP, "utf8")).map((d) => [d.id, d]));
const A = (n, s = "") => `/ahv/assets/img/owner-approved-20260928/ahv-img-${n}${s}.webp`;
const H = { w: 1600 }; // masters are 1600 wide; heights from the source ratio
const dims = (id) => { const [w, h] = DEC[id].manifestItem.proposed.dimensions; return { width: 1600, height: Math.round(h * 1600 / w), width768: 768, height768: Math.round(h * 768 / w) }; };
for (const id of ["AHV-IMG-032", "AHV-IMG-035", "AHV-IMG-036"]) if (DEC[id].decision !== "no") throw new Error(id + " is no longer a rejection");

// serialisation detection: compact JSON, 1-space pretty, or Python-style
const py = (v) => Array.isArray(v) ? "[" + v.map(py).join(", ") + "]" : v && typeof v === "object" ? "{" + Object.entries(v).map(([k, x]) => JSON.stringify(k) + ": " + py(x)).join(", ") + "}" : JSON.stringify(v);
const styles = [(o) => JSON.stringify(o), py, (o) => JSON.stringify(o, null, 1), (o) => JSON.stringify(o, null, 2)];
function load(file) { const s = fs.readFileSync(file, "utf8"); const i = s.indexOf("{"), j = s.lastIndexOf("}"); const D = JSON.parse(s.slice(i, j + 1));
  const ser = styles.find((f) => s.slice(0, i) + f(D) + s.slice(j + 1) === s); if (!ser) throw new Error(file + ": unknown serialisation");
  return { file, D, save: () => s.slice(0, i) + ser(D) + s.slice(j + 1), orig: s }; }

const log = []; const files = [];
// ---- gallery placements (026, 027 /photo-gallery/; 028 /property-gallery/) -----------------------------------------
const GAL = [["AHV-IMG-026", "026"], ["AHV-IMG-027", "027"], ["AHV-IMG-028", "028"]];
function galleryEntry(id, n, old) {
  const p = DEC[id].manifestItem.proposed, d = dims(id);
  return { src: A(n), src768: A(n, "-768"), width: d.width, height: d.height, alt: p.caption, caption: p.caption };
}
for (const f of ["public/ahv/assets/photo-collections-data.js", "english-candidate/package-overlay/assets/photo-collections-data.js"]) {
  const L = load(f); let n = 0;
  const walk = (o) => { if (Array.isArray(o)) { o.forEach((x, k) => { const hit = x && typeof x === "object" && GAL.find(([id]) => x.src === DEC[id].manifestItem.current.src); if (hit) { o[k] = { ...x, ...galleryEntry(hit[0], hit[1], x) }; n++; } else walk(x); }); return; } if (o && typeof o === "object") for (const k in o) walk(o[k]); };
  walk(L.D); if (n) { files.push(L); log.push(`${f}: ${n} gallery image(s)`); }
}
{ const f = "english-candidate/galleries-2026.json"; const s = fs.readFileSync(f, "utf8"); const D = JSON.parse(s);
  const ser = [(o) => JSON.stringify(o, null, 2) + "\n", (o) => JSON.stringify(o, null, 1) + "\n", (o) => JSON.stringify(o, null, 2), (o) => JSON.stringify(o)].find((g) => g(D) === s); if (!ser) throw new Error("galleries-2026 serialisation");
  let n = 0;
  for (const r of D.routes) for (const c of r.chapters) (c.images || []).forEach((im, k) => { const hit = GAL.find(([id]) => im.src === DEC[id].manifestItem.current.src); if (!hit) return;
    const [id, num] = hit, p = DEC[id].manifestItem.proposed, d = dims(id);
    c.images[k] = { src: A(num), src768: A(num, "-768"), width: d.width, height: d.height, width768: d.width768, height768: d.height768, alt: p.caption, caption: p.caption, theme: im.theme, chapter: im.chapter, sha256: p.sha256, libraryPath: p.libraryRelPath, sourceWidth: p.dimensions[0], sourceHeight: p.dimensions[1], captionSource: "IMAGE_CATALOG.csv vision-pass description", alreadyOnSite: false, ownerApproval: `${id} (owner batch 2, 28 Sep 2026; revises ${DEC[id].manifestItem.revises})` }; n++; });
  if (n) { files.push({ file: f, save: () => ser(D) }); log.push(`${f}: ${n} gallery image(s)`); } }

// ---- opening images (heroes), one route each --------------------------------------------------------------------
const HEROES = [
  ["AHV-IMG-029", "029", "public/ahv/assets/article-family-data.js", "/experience/", ["heroImg"]],
  ["AHV-IMG-030", "030", "public/ahv/assets/collection-family-data.js", "/village-facilities/", ["heroImage", "components.0.blocks.0"]],
  ["AHV-IMG-031", "031", "public/ahv/assets/reader25b-family-data.js", "/ayurvedic-cuisine/", ["components.0.blocks.0"]],
  ["AHV-IMG-033", "033", "public/ahv/assets/enquiry-family-data.js", "/walk-in-ayurveda-treatment/", ["heroImage"]],
  ["AHV-IMG-034", "034", "public/ahv/assets/collection-family-data.js", "/things-to-do/", ["heroImage", "components.0.blocks.0"]],
];
const loaded = {};
for (const [id, num, f, route, paths] of HEROES) {
  const L = loaded[f] || (loaded[f] = load(f)); const rec = L.D.routes.find((r) => r.path === route); if (!rec) throw new Error(route + " not in " + f);
  const cur = DEC[id].manifestItem.current.src.split("/").pop(), p = DEC[id].manifestItem.proposed, d = dims(id);
  for (const path of paths) {
    const keys = path.split("."); const parent = keys.slice(0, -1).reduce((a, k) => a[k], rec); const last = keys[keys.length - 1]; const o = parent[last];
    if (!o || typeof o !== "object") throw new Error(`${route} ${path} missing`);
    if (o.src === A(num) || o.src === A(num, "-banner")) continue;
    if (o.src !== A(num) && !String(o.src).endsWith(cur) && !(id === "AHV-IMG-029" && /our-story\.webp$/.test(o.src))) throw new Error(`${route} ${path}: expected ${cur}, found ${o.src}`);
    // the walk-in hero renders at its natural ratio, so it takes the banner crop built for it
    const banner = id === "AHV-IMG-033";
    parent[last] = { ...o, src: banner ? A(num, "-banner") : A(num), alt: p.caption, width: 1600, height: banner ? 510 : d.height, recordedOriginalSha256: p.sha256, libraryPathPrivate: p.libraryRelPath, ownerApprovalNote: `${id}, owner image batch 2, 28 Sep 2026 (placement: ${DEC[id].manifestItem.placement})` };
    log.push(`${f} ${route} ${path} -> ${A(num)}`);
  }
}
for (const L of Object.values(loaded)) files.push(L);
if (!CHECK) for (const L of files) fs.writeFileSync(L.file, L.save());
console.log((CHECK ? "[check] " : "") + (log.join("\n") || "already applied"));
