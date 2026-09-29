// EF-12 stage 2 on /ayurveda-treatment/ (29 Sep 2026), JSON-aware and idempotent; runs after
// tools/repair-ef12-structural-20260929.mjs. Findings from the EF12-IMG lane (deliverable lanes/EF12-IMG/PLAN.json):
//   F6  Sirodhara showed a copy of its photograph watermarked "Kairali Ayurvedic Centre" (the centres brand). The same
//       photograph without the watermark is already served (reader25b/8410976d…, 1200x628, used on /new-to-ayurveda/):
//       the card now uses it. The photograph's location ruling stays with the owner.
//   F1  Dhanyamala Dhara showed a hand massage (no pouring) — a photograph of a different therapy.
//   F2–F4  Elakizhi, Muttakizhi and Manalkizhi showed studio still lifes (Muttakizhi's from the same Kairali-bowls series
//       as the stand-in removed in stage 1) — no therapy shown.
//   For F1–F4 the owner's rule applied in stage 1 holds: text-only beats a false photo. Their image blocks are removed and
//   their labels join the grouped "Also offered…" line in card order; the missing photographs are in the creative
//   request drafted by the lane (not sent).
//   node tools/repair-ef12-imagery-20260929.mjs [--check]
import fs from "node:fs";

const FILE = "public/ahv/assets/seven-informational-data.js";
const GROUPED = "/ef12/photo-less-therapies";
const SIRO_IMG = "/sections/3/c/3/c/6/c/3/c/1/c/0";
const SIRO_OLD = "/ahv/assets/img/seven/99b7dd5720b7da2e.webp";
const SIRO_NEW = { src: "/ahv/assets/img/reader25b/8410976d314b92c7996855eea03d48d64b3acb5b3cff8a89691c02961e02f68e.webp", width: 1200, height: 628 };
// image ptr -> label ptr, in card order (all precede stage 1's photo-less cards)
const REMOVE = [
  ["/sections/3/c/3/c/6/c/7/c/1/c/0", "/sections/3/c/3/c/6/c/7/c/3", "f1cc0ca6"], // Dhanyamala Dhara (F1)
  ["/sections/3/c/3/c/6/c/13/c/1/c/0", "/sections/3/c/3/c/6/c/13/c/3", "72fc1cff"], // Elakizhi (F2)
  ["/sections/3/c/3/c/6/c/21/c/1/c/0", "/sections/3/c/3/c/6/c/21/c/3", "810809ec"], // Muttakizhi (F3)
  ["/sections/3/c/3/c/6/c/23/c/1/c/0", "/sections/3/c/3/c/6/c/23/c/3", "1c927f2f"], // Manalkizhi (F4)
];
const PREFIX = "Also offered, as prescribed by the physician: ";

const src = fs.readFileSync(FILE, "utf8");
const a = src.indexOf("{", src.indexOf("= {")), b = src.lastIndexOf("}");
const head = src.slice(0, a), tail = src.slice(b + 1);
const data = JSON.parse(src.slice(a, b + 1));
const route = (data.routes || []).find((r) => r.path === "/ayurveda-treatment/");
const comp = route && (route.components || []).find((c) => c.component === "section-3");
if (!comp) throw new Error("/ayurveda-treatment/ section-3 not found");
const log = [];
const labelOf = (blk) => (blk.tree || []).map((n) => n.v || "").join("").trim();

// F6
const siro = comp.blocks.find((x) => x.ptr === SIRO_IMG);
if (!siro) throw new Error("Sirodhara image block not found");
if (siro.src === SIRO_OLD) { Object.assign(siro, SIRO_NEW); log.push("F6 Sirodhara: unwatermarked copy"); }
else if (siro.src === SIRO_NEW.src) log.push("F6 already applied");
else throw new Error("Sirodhara image is neither the watermarked nor the unwatermarked copy: " + siro.src);

// F1–F4
const grouped = comp.blocks.find((x) => x.ptr === GROUPED);
if (!grouped) throw new Error("stage 1 grouped line missing: run repair-ef12-structural-20260929.mjs first");
const present = REMOVE.filter(([img]) => comp.blocks.some((x) => x.ptr === img));
if (present.length && present.length !== REMOVE.length) throw new Error(`partial state: ${present.length}/${REMOVE.length} image blocks present`);
if (present.length) {
  const labels = [];
  for (const [img, lab, key] of REMOVE) {
    const ib = comp.blocks.find((x) => x.ptr === img);
    if (!JSON.stringify(ib).includes(key)) throw new Error(`${img}: expected image ${key}`);
    const lb = comp.blocks.find((x) => x.ptr === lab);
    if (!lb) throw new Error(`${lab}: label missing`);
    labels.push(labelOf(lb));
  }
  const text = labelOf(grouped);
  if (!text.startsWith(PREFIX)) throw new Error("grouped line has unexpected text");
  const rest = text.slice(PREFIX.length).replace(/\.$/, "");
  const existing = rest.split(/, | and /);
  const all = [...labels, ...existing];
  grouped.tree = [{ k: "t", v: PREFIX + all.slice(0, -1).join(", ") + " and " + all[all.length - 1] + "." }];
  const drop = new Set(REMOVE.flatMap(([img, lab]) => [img, lab]));
  comp.blocks = comp.blocks.filter((x) => !drop.has(x.ptr));
  if (route.counts && typeof route.counts.images === "number") route.counts.images -= REMOVE.length;
  route.ef12 = route.ef12 || {};
  route.ef12.imagery20260929 = { removed: REMOVE.map(([img, , key]) => ({ ptr: img, image: key })), sirodhara: "unwatermarked copy", reason: "F1-F4 wrong-subject/stand-in photographs -> text-only (owner rule, stage 1); F6 centres-brand watermark removed" };
  log.push(`F1-F4: ${labels.join(", ")} -> grouped line (${all.length} therapies)`);
} else log.push("F1-F4 already applied");

if (!process.argv.includes("--check")) fs.writeFileSync(FILE, head + JSON.stringify(data) + tail);
console.log(log.join("\n"));
