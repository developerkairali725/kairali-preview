// VERIFY hosted-rates-exact (29 Sep 2026): the /training-course-fees/ airport/railway transfer cells printed INR with USD
// in brackets only, so the EUR locales (de fr es it pt nl) never showed the approved EUR transfer fare. Each cell now
// carries all three APPROVED values from english-candidate/final-rates/training.json `transfers` (a selection between
// printed editions, never a conversion): "₹3,900 ($56 · €49)". Views + importer overlays, idempotent, every cell asserted.
//   node tools/repair-fees-transfer-eur-20260929.mjs [--check]
import fs from "node:fs";

const CHECK = process.argv.includes("--check");
const T = JSON.parse(fs.readFileSync("english-candidate/final-rates/training.json", "utf8")).transfers;
const fmt = (n) => n.toLocaleString("en-US");
const FILES = [
  ["public/ahv/views/ahv-template-course-and-fees-desktop.json", (i, u) => [`₹${i} <span style=\\"color:#75695A\\">($${u})</span>`, `₹${i} <span style=\\"color:#75695A\\">($${u} · €`]],
  ["public/ahv/views/ahv-template-course-and-fees-mobile.json", (i, u) => [`₹${i} ($${u})`, `₹${i} ($${u} · €`]],
  ["english-candidate/package-overlay/AHV Template Course and Fees Desktop.dc.html", (i, u) => [`₹${i} <span style="color:#75695A">($${u})</span>`, `₹${i} <span style="color:#75695A">($${u} · €`]],
  ["english-candidate/package-overlay/AHV Template Course and Fees Mobile.dc.html", (i, u) => [`₹${i} ($${u})`, `₹${i} ($${u} · €`]],
];
const writes = [];
for (const [file, forms] of FILES) {
  if (!fs.existsSync(file)) throw new Error(`missing ${file}`);
  let s = fs.readFileSync(file, "utf8"); const o = s; let done = 0, edited = 0;
  for (const t of T) for (const k of [0, 1]) {
    const [inr, usd, eur] = [fmt(t.INR[k]), fmt(t.USD[k]), fmt(t.EUR[k])];
    const [old, doneMark] = forms(inr, usd);
    if (s.includes(doneMark + eur + ")")) { done++; continue; }
    if (s.split(old).length !== 2) throw new Error(`${file}: transfer ${t.id}[${k}] cell not found exactly once`);
    s = s.replace(old, old.replace(`($${usd})`, `($${usd} · €${eur})`)); edited++;
  }
  if (s !== o) { writes.push(file); if (!CHECK) fs.writeFileSync(file, s); }
  console.log(`${file}: ${edited} cells now show EUR, ${done} already`);
}
console.log(writes.length ? (CHECK ? "would write: " : "wrote: ") + writes.length + " file(s)" : "up to date");
if (CHECK && writes.length) process.exit(1);
