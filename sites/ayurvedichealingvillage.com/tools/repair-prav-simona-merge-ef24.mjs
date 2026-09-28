// EF-24 — owner ruling 28 Sep 2026 (deliverable OWNER-DECISIONS-LATEST.md, "Owner-approved retreat archive
// consolidation"): merge genuinely duplicate retreat archive pages, keep their unique text and photos, 301 the old
// page to its matching retreat page; keep different retreats separate; prove equivalence first.
// Equivalence (measured 28 Sep over the served snapshots of all 23 retreat/archive pages): only one pair qualifies —
// /prav-simona-yoga-retreat/ (the Prav & Simona retreat, Sept 2017) is a subset of /prav-simona-monsoon-yoga-retreat/,
// which records BOTH of that retreat's programmes (17–22 Sept stress management + 23–30 Sept healing) with every
// section the short page has (intro, 70% organic-farm food, stress-management list, healing list). Its sentences
// differ only in wording. What the full page lacks: two photographs ("yoga steps", "yoga pose") — moved here into
// the matching sections. The short page then 301s (redirect-map.json). Idempotent; byte-exact round trip checked.
//   node tools/repair-prav-simona-merge-ef24.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
const FILE = "public/ahv/assets/hist9-family-data.js";
const s = fs.readFileSync(FILE, "utf8"); const i = s.indexOf("{"), j = s.lastIndexOf("}");
const pre = s.slice(0, i), post = s.slice(j + 1); const D = JSON.parse(s.slice(i, j + 1));
if (pre + JSON.stringify(D) + post !== s) throw new Error("dataset does not round-trip byte-exactly");
const A = D.routes.find((r) => r.path === "/prav-simona-yoga-retreat/"), B = D.routes.find((r) => r.path === "/prav-simona-monsoon-yoga-retreat/");
const img = (R, alt) => R.components.flatMap((c) => c.blocks).find((b) => b.kind === "image" && b.alt === alt);
const moves = [["yoga steps", /Stress Management/], ["yoga pose", /Healing/]];
let n = 0;
for (const [alt, section] of moves) {
  const block = img(A, alt); if (!block) throw new Error(`short page has no '${alt}' image`);
  const target = B.components.find((c) => c.blocks[0] && c.blocks[0].kind === "heading" && section.test(c.blocks[0].text || ""));
  if (!target) throw new Error(`full page has no section matching ${section}`);
  if (target.blocks.some((b) => b.kind === "image" && b.src === block.src)) continue;
  target.blocks.push({ ...block, ptr: `/merged-from/prav-simona-yoga-retreat${block.ptr}`, mergedFrom: "/prav-simona-yoga-retreat/", mergeNote: "EF-24 owner ruling 28 Sep 2026: unique photograph of the same retreat, moved before the 301." });
  n++;
}
if (!CHECK && n) fs.writeFileSync(FILE, pre + JSON.stringify(D) + post);
console.log((CHECK ? "[check] " : "") + (n ? `${n} photograph(s) moved into /prav-simona-monsoon-yoga-retreat/` : "already applied"));
