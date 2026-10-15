// Train J batch 1 (15 Oct 2026; AHV-LATER-021.01). The 12 locale /panchkarma-treatment.html pages (design view
// ahv-page-panchkarma-treatment-*) open on the HOMEPAGE hero (wx-hero), so a visitor sees the same photograph on the
// home page and the Panchakarma page. Owner decision 10 ("pick ... from the image bank, old or new") — the hero becomes
// the page-specific Palakkad photograph the English Panchakarma page already uses (Train F, PHOTO_PICKS_20261015
// panchakarma: ahv-pkd-50, IMAGE_CATALOG register_ok, no person in frame). The phone view takes the 768px derivative.
// The alt stays the existing, translated "Kairali — The Ayurvedic Healing Village, Palakkad" (a factual description of
// a patient villa at Kairali, Palakkad), so no new copy or translation is introduced. Photograph only; nothing else.
//   node tools/repair-panchakarma-locale-hero-train-j1-20261015.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
export const FILES = {
  "public/ahv/views/ahv-page-panchkarma-treatment-desktop.json": ['<img src="/ahv/assets/img/wx-hero.webp" alt="Kairali &mdash; The Ayurvedic Healing Village, Palakkad" width="1920" height="900"', '<img src="/ahv/assets/img/owner-decision-20261015/ahv-pkd-50.webp" alt="Kairali &mdash; The Ayurvedic Healing Village, Palakkad" width="1600" height="1067"'],
  "public/ahv/views/ahv-page-panchkarma-treatment-mobile.json": ['<img src="/ahv/assets/img/wx-hero.webp" alt="Kairali &mdash; The Ayurvedic Healing Village, Palakkad" width="1920" height="900"', '<img src="/ahv/assets/img/owner-decision-20261015/ahv-pkd-50-768.webp" alt="Kairali &mdash; The Ayurvedic Healing Village, Palakkad" width="768" height="512"'],
};
export function apply(file, text) {
  const [before, after] = FILES[file];
  const d = JSON.parse(text);
  if (d.template.includes(after)) return text;
  if (d.template.split(before).length !== 2) throw new Error(file + ": hero not found exactly once");
  d.template = d.template.replace(before, after);
  return JSON.stringify(d, null, 2) + "\n";
}
if (process.argv[1]?.endsWith("repair-panchakarma-locale-hero-train-j1-20261015.mjs")) {
  const changed = [];
  for (const file of Object.keys(FILES)) {
    const s = fs.readFileSync(file, "utf8");
    if (JSON.stringify(JSON.parse(s), null, 2) + "\n" !== s) throw new Error(file + ": does not round-trip");
    const next = apply(file, s);
    if (next !== s) { changed.push(file); if (!CHECK) fs.writeFileSync(file, next); }
  }
  console.log((CHECK ? "[check] " : "") + `${changed.length} view(s) changed` + (changed.length ? ": " + changed.join(" ") : ""));
  if (CHECK && changed.length) process.exitCode = 1;
}
