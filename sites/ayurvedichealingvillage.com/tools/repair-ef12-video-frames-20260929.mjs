// EF-12 stage 3 (29 Sep 2026): photographs from the KTAHV 2023 therapy video replace three images the EF12-IMG lane
// flagged. Runs after tools/repair-ef12-imagery-20260929.mjs. JSON-aware, guarded, idempotent.
// Source is KTAHV's own branded footage, shot in the Palakkad treatment rooms and filed KTAHV-safe in the image library's
// source registry: Kairali-Image-Library/video/ktahv/ktahv-2023-07-ktahv-therapy-treatment-3-2023.mp4 (3840x2160,
// sha256 c2ecac8e…). The parent video review (fresh-claude-handoff-20260928/parent-video-review/REVIEW.md) found these
// frames. english-candidate/ef12-video-frames.json records each frame's time, crop box and output hash, and
// tools/media/grab-video-frame.swift is the extractor. The webp files are gitignored like every other image, so they
// ship through the runtime-asset path.
//   F5  /ayurveda-treatment/ Udgharshanam: a sepia oil or hand massage with no powder visible. The new frame (18.3 s)
//       shows two therapists working a granular powder over a patient's back. No ingredient is named.
//   F6  Sirodhara on /ayurveda-treatment/ and /new-to-ayurveda/: the kc-5 photograph, whose location is disputed
//       because of the centre emblem, is replaced by a frame at 49.4 s: a KTAHV therapist pours from a suspended brass
//       vessel onto a patient's forehead in the brick-walled treatment room.
//   F10 /knowledge-centre/ card "Explore Ayurveda": a hot-stone still life, a spa prop that reads as the locked register
//       visually. The new frame (54.6 s) shows a therapist pouring oil into a suspended brass dhara vessel. The same
//       change goes into the importer overlay so a re-import keeps it.
// Clinical depiction (F5 Udgharshanam) is shown to Dr. Deepu John before production (HARD GATE 7). No ingredient,
// licence or sign-off is claimed.
//   node tools/repair-ef12-video-frames-20260929.mjs [--check]
import fs from "node:fs";

const CHECK = process.argv.includes("--check");
const IMG = "/ahv/assets/img/ktahv-video-2023/";
const UDG = { src: IMG + "udgharshanam-85f39fe3fb0bbf71.webp", width: 900, height: 600, alt: "Two therapists working a granular herbal powder over a patient's back" };
const SIRO = { src: IMG + "sirodhara-defe5c5f089c4be7.webp", width: 1200, height: 628, alt: "A therapist pours warm oil from a suspended brass vessel onto a patient's forehead during Shirodhara" };
const KNOW = { file: IMG + "knowledge-02a1d00663e4c51e.webp", width: 1200, height: 536, alt: "A therapist pours oil into a suspended brass dhara vessel" };
const log = [];
const writes = [];

// Datasets of the form `window.X = {...};` (single JSON literal).
function editJsonDataset(file, fn) {
  const src = fs.readFileSync(file, "utf8");
  const a = src.indexOf("{", src.indexOf("= {")), b = src.lastIndexOf("}");
  const data = JSON.parse(src.slice(a, b + 1));
  fn(data);
  const out = src.slice(0, a) + JSON.stringify(data) + src.slice(b + 1);
  if (out !== src) { writes.push(file); if (!CHECK) fs.writeFileSync(file, out); }
}
function swapBlock(route, ptr, oldSrc, next, label) {
  const blocks = (route.components || []).flatMap(function walk(c) { return (c.blocks || []).flatMap((x) => [x, ...walk(x)]); });
  const blk = blocks.find((x) => x.ptr === ptr);
  if (!blk) throw new Error(`${label}: block ${ptr} not found on ${route.path}`);
  if (blk.src === next.src) { log.push(`${label}: already applied`); return; }
  if (blk.src !== oldSrc) throw new Error(`${label}: unexpected image ${blk.src}`);
  Object.assign(blk, { src: next.src, width: next.width, height: next.height, alt: next.alt });
  delete blk.sourceUrl;
  blk.ef12 = "KTAHV 2023 therapy video frame (tools/repair-ef12-video-frames-20260929.mjs)";
  log.push(`${label}: ${oldSrc.split("/").pop().slice(0, 16)} -> ${next.src.split("/").pop()}`);
}

editJsonDataset("public/ahv/assets/seven-informational-data.js", (data) => {
  const route = data.routes.find((r) => r.path === "/ayurveda-treatment/");
  swapBlock(route, "/sections/3/c/3/c/6/c/31/c/1/c/0", "/ahv/assets/img/seven/e4cd8dd6c5c3a4dc.webp", UDG, "F5 Udgharshanam");
  swapBlock(route, "/sections/3/c/3/c/6/c/3/c/1/c/0", "/ahv/assets/img/reader25b/8410976d314b92c7996855eea03d48d64b3acb5b3cff8a89691c02961e02f68e.webp", SIRO, "F6 Sirodhara (/ayurveda-treatment/)");
});
editJsonDataset("public/ahv/assets/reader25b-family-data.js", (data) => {
  const route = data.routes.find((r) => r.path === "/new-to-ayurveda/");
  swapBlock(route, "/sections/3/c/3/c/36/c/3/c/1/c/0/c/0", "/ahv/assets/img/reader25b/8410976d314b92c7996855eea03d48d64b3acb5b3cff8a89691c02961e02f68e.webp", SIRO, "F6 Sirodhara (/new-to-ayurveda/)");
});

// Knowledge centre: a JS object literal, served copy and importer overlay (package-relative path).
const KNOW_OLD_ALT = "Herbal boluses, towels and treatment accessories.";
for (const [file, oldImg, newImg] of [
  ["public/ahv/assets/knowledge-centre-data.js", "/ahv/assets/img/AHV-Knowledge-Ayurveda.webp", KNOW.file],
  ["english-candidate/package-overlay/assets/knowledge-centre-data.js", "assets/img/AHV-Knowledge-Ayurveda.jpg", KNOW.file.replace("/ahv/", "")],
]) {
  const src = fs.readFileSync(file, "utf8");
  const oldCard = `image: "${oldImg}", width: 1280, height: 572, alt: "${KNOW_OLD_ALT}"`;
  const newCard = `image: "${newImg}", width: ${KNOW.width}, height: ${KNOW.height}, alt: "${KNOW.alt}"`;
  if (src.includes(newCard)) { log.push(`F10 ${file}: already applied`); continue; }
  if (src.split(oldCard).length !== 2) throw new Error(`F10 ${file}: expected exactly one Explore Ayurveda card`);
  const out = src.replace(oldCard, newCard);
  writes.push(file); if (!CHECK) fs.writeFileSync(file, out);
  log.push(`F10 ${file}: hot-stone still life -> dhara vessel frame`);
}

for (const f of [UDG.src, SIRO.src, KNOW.file]) if (!fs.existsSync("public" + f)) throw new Error(`missing image public${f} (see english-candidate/ef12-video-frames.json)`);
console.log(log.join("\n"));
console.log(writes.length ? (CHECK ? "would write: " : "wrote: ") + writes.join(", ") : "up to date");
if (CHECK && writes.length) process.exit(1);
