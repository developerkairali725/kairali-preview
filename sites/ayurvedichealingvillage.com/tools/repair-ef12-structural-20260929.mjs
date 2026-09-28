// EF-12 structural repair on /ayurveda-treatment/ (29 Sep 2026), JSON-aware and idempotent.
//   node tools/repair-ef12-structural-20260929.mjs [--check]
// S1: nine therapy cards showed a stand-in photo (Kairali bowls, seven/ca7904c1957e64b7.webp, legacy
//     'not-available.jpg') that depicts none of the therapies. The image block is removed; the card keeps its label
//     (text-only card). No stand-in photo is substituted (owner content note: text-only beats a false photo);
//     missing photographs go to the creative-asset request. Greevavasti's candidate photo was never confirmed by the
//     treatment team, so it follows the same text-only rule.
// S2: the Kavalagraham card appeared four times in a row; the three duplicates (image + label each) are removed.
// Blocks are matched by ptr, never by index. An `ef12` provenance key records the deviation (the l10n extractor
// ignores it).
import fs from "node:fs";

const FILE = "public/ahv/assets/seven-informational-data.js";
const PLACEHOLDER = "ca7904c1957e64b7.webp";
const S1_IMAGE_PTRS = [
  "/sections/3/c/3/c/6/c/35/c/1/c/0", // Urovasti
  "/sections/3/c/3/c/6/c/39/c/1/c/0", // Greevavasti (candidate unconfirmed)
  "/sections/3/c/3/c/6/c/53/c/1/c/0", // Kavalagraham (kept card)
  "/sections/3/c/3/c/6/c/61/c/1/c/0", // Gandoosham
  "/sections/3/c/3/c/6/c/63/c/1/c/0", // Karnapoornam
  "/sections/3/c/3/c/6/c/65/c/1/c/0", // Dhoompanam
  "/sections/3/c/3/c/6/c/67/c/1/c/0", // Thalam
  "/sections/3/c/3/c/6/c/71/c/1/c/0", // Matravasti
  "/sections/3/c/3/c/6/c/73/c/1/c/0", // Kashayavasthi
];
const S2_DUPLICATE_PTRS = [
  "/sections/3/c/3/c/6/c/55/c/1/c/0", "/sections/3/c/3/c/6/c/55/c/3",
  "/sections/3/c/3/c/6/c/57/c/1/c/0", "/sections/3/c/3/c/6/c/57/c/3",
  "/sections/3/c/3/c/6/c/59/c/1/c/0", "/sections/3/c/3/c/6/c/59/c/3",
];

const src = fs.readFileSync(FILE, "utf8");
const a = src.indexOf("{", src.indexOf("= {")), b = src.lastIndexOf("}");
const head = src.slice(0, a), tail = src.slice(b + 1);
const data = JSON.parse(src.slice(a, b + 1));
const route = (data.routes || []).find((r) => r.path === "/ayurveda-treatment/");
if (!route) throw new Error("route /ayurveda-treatment/ not found");
const comp = (route.components || []).find((c) => c.component === "section-3");
if (!comp || !Array.isArray(comp.blocks)) throw new Error("section-3 blocks not found");

// S1b: a card grid reads image-then-caption, so a lone label would caption the NEXT therapy's photo. The labels of
// the photo-less therapies move into one grouped line after the cards (same therapies, same order).
const LABEL_PTRS = S1_IMAGE_PTRS.map((p) => p.replace(/\/c\/1\/c\/0$/, "/c/3"));
const GROUPED_PTR = "/ef12/photo-less-therapies";
const labelOf = (blk) => (blk.tree || []).map((n) => n.v || "").join("").trim();
if (!comp.blocks.some((blk) => blk.ptr === GROUPED_PTR)) {
  const labels = comp.blocks.filter((blk) => LABEL_PTRS.includes(blk.ptr)).map(labelOf);
  if (labels.length === LABEL_PTRS.length) {
    const last = comp.blocks.findIndex((blk) => blk.ptr === LABEL_PTRS[LABEL_PTRS.length - 1]);
    const tmpl = comp.blocks[last];
    const list = labels.slice(0, -1).join(", ") + " and " + labels[labels.length - 1];
    const grouped = { kind: "para", ptr: GROUPED_PTR, tree: [{ k: "t", v: `Also offered, as prescribed by the physician: ${list}.` }], sourceClass: "has-text-align-center wp-block-paragraph" };
    comp.blocks.splice(last + 1, 0, grouped);
    comp.blocks = comp.blocks.filter((blk) => !LABEL_PTRS.includes(blk.ptr));
    console.log(`S1b: ${labels.length} labels grouped after the cards (template ${tmpl.kind})`);
  }
}
for (const blk of comp.blocks) for (const n of blk.tree || []) if (n.v === "Please contact our helpful patient care team for More Details:") n.v = "Please contact our patient care team for more details:";

const blocks = comp.blocks;
const before = blocks.length;
const removed = [];
comp.blocks = blocks.filter((blk) => {
  const ptr = blk.ptr || "";
  const isS1 = S1_IMAGE_PTRS.includes(ptr) && JSON.stringify(blk).includes(PLACEHOLDER);
  const isS2 = S2_DUPLICATE_PTRS.includes(ptr);
  if (isS1 || isS2) { removed.push({ ptr, why: isS1 ? "S1 stand-in photo" : "S2 duplicate Kavalagraham" }); return false; }
  return true;
});
const s1 = removed.filter((r) => r.why.startsWith("S1")).length;
const s2 = removed.filter((r) => r.why.startsWith("S2")).length;
if (removed.length === 0) { console.log("already applied (no matching blocks)"); process.exit(0); }
const leftover = JSON.stringify(comp.blocks).split(PLACEHOLDER).length - 1;
if (s1 !== S1_IMAGE_PTRS.length || s2 !== S2_DUPLICATE_PTRS.length || leftover !== 0) {
  console.error(`MISMATCH: S1 ${s1}/${S1_IMAGE_PTRS.length}, S2 ${s2}/${S2_DUPLICATE_PTRS.length}, placeholder left ${leftover} — nothing written`);
  process.exit(1);
}
if (route.counts && typeof route.counts.images === "number") route.counts.images -= s1 + s2 / 2;
route.ef12 = { structural20260929: { removed, reason: "stand-in photo removed (text-only cards); duplicate Kavalagraham cards removed" } };
console.log(`blocks ${before} -> ${comp.blocks.length}; S1 ${s1} image blocks, S2 ${s2} duplicate blocks`);
if (!process.argv.includes("--check")) fs.writeFileSync(FILE, head + JSON.stringify(data) + tail);
