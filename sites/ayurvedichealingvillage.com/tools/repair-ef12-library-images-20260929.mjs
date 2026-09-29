// EF-12 stage 4 (29 Sep 2026): the EF12-IMG lane's remaining image findings, served from the Palakkad gallery library
// (public/ahv/assets/img/gallery-2026, catalogued in english-candidate/galleries-2026.json — the same source
// tools/repair-knowledge-images-ef12.py used on 26 Sep). JSON-aware, guarded, idempotent. Alts are the library's.
//   F9  /ayurveda/ side image: a foot massage matching a stock-agency file name (likely third-party stock). Replaced by
//       the library's Abhyanga foot and lower-leg massage (same subject, Palakkad provenance).
//   F12 /new-to-ayurveda/ card "Ayurveda Retreats for everyone": a group doing standing yoga on a lawn (weak context).
//       Replaced by the reception welcome (kasavu cloth draped over an arriving woman's shoulders).
//   F13 /learn-about-ayurveda/ and /learn-more-about-ayurveda/: only the shared aerial banner, no content photo. Each
//       gets ONE library image after its first paragraph (block ptr /ef12/img, the 26 Sep pattern).
//   node tools/repair-ef12-library-images-20260929.mjs [--check]
import fs from "node:fs";

const CHECK = process.argv.includes("--check");
const G = "/ahv/assets/img/gallery-2026/";
const log = [], writes = [];

function edit(file, fn) {
  const src = fs.readFileSync(file, "utf8");
  const a = src.indexOf("{", src.indexOf("= {")), b = src.lastIndexOf("}");
  const data = JSON.parse(src.slice(a, b + 1));
  fn(data);
  const out = src.slice(0, a) + JSON.stringify(data) + src.slice(b + 1);
  if (out !== src) { writes.push(file); if (!CHECK) fs.writeFileSync(file, out); }
}
const allBlocks = (route) => (route.components || []).flatMap(function walk(c) { return (c.blocks || []).flatMap((x) => [x, ...walk(x)]); });
function swap(data, path, ptr, oldKey, next, label) {
  const route = data.routes.find((r) => r.path === path);
  const blk = allBlocks(route).find((x) => x.ptr === ptr);
  if (!blk) throw new Error(`${label}: block ${ptr} not found`);
  if (blk.src === next.src) { log.push(`${label}: already applied`); return; }
  if (!blk.src.includes(oldKey)) throw new Error(`${label}: unexpected image ${blk.src}`);
  Object.assign(blk, next, { sourceUrl: next.src, ef12: "29 Sep 2026: Palakkad gallery library image (tools/repair-ef12-library-images-20260929.mjs)" });
  log.push(`${label}: ${oldKey} -> ${next.src.split("/").pop()}`);
}
function insert(data, path, comp, next, label) {
  const route = data.routes.find((r) => r.path === path);
  const c = route.components.find((x) => x.component === comp);
  if (!c) throw new Error(`${label}: component ${comp} missing`);
  if (c.blocks.some((x) => x.ptr === "/ef12/img")) { log.push(`${label}: already applied`); return; }
  const k = c.blocks.findIndex((x) => x.kind === "para");
  if (k < 0) throw new Error(`${label}: no paragraph to anchor after`);
  c.blocks.splice(k + 1, 0, { kind: "image", ptr: "/ef12/img", ...next, sourceUrl: next.src, external: false, ef12: "29 Sep 2026: Palakkad gallery library image (article had only the shared banner)" });
  log.push(`${label}: inserted ${next.src.split("/").pop()}`);
}

edit("public/ahv/assets/reader25b-family-data.js", (d) => {
  swap(d, "/ayurveda/", "/sections/3/c/3/c/4/c/0", "cafe93337f78e28d", { src: G + "treatments/oil-abhyanga-therapists-massage-feet-08-768.webp", width: 768, height: 511, alt: "Abhyanga: therapists massage the feet and lower legs of a supine patient on a wooden therapy table" }, "F9 /ayurveda/");
  swap(d, "/new-to-ayurveda/", "/sections/3/c/3/c/36/c/9/c/1/c/0/c/0", "885e4af7a259bfef", { src: G + "retreats/welcome-people-staff-member-drapes-03-768.webp", width: 768, height: 511, alt: "A staff member drapes a kasavu cloth over an arriving woman's shoulders in the reception hall" }, "F12 /new-to-ayurveda/");
});
edit("public/ahv/assets/reader6c-family-data.js", (d) => {
  insert(d, "/learn-about-ayurveda/", "educational-body", { src: G + "retreats/care-people-side-profile-therapist-07-768.webp", width: 768, height: 511, alt: "Side profile of a therapist seated at the fountain channel preparing kizhi boluses on a wicker tray" }, "F13 /learn-about-ayurveda/");
  insert(d, "/learn-more-about-ayurveda/", "educational-body", { src: G + "photo/treatments-shiro-abhyanga-therapist-kerala-kasavu-16-768.webp", width: 768, height: 545, alt: "Shiro Abhyanga: therapist in Kerala kasavu uniform drips herbal oil from a small brass vessel onto the crown" }, "F13 /learn-more-about-ayurveda/");
});

console.log(log.join("\n"));
console.log(writes.length ? (CHECK ? "would write: " : "wrote: ") + writes.join(", ") : "up to date");
if (CHECK && writes.length) process.exit(1);
