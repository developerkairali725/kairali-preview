// EF-13 (owner: routine supported copy needs no extra approval) — walk-in OPD / enquiry family copy. Removes SEO
// keyword stuffing, an unsupported "guarantees" and the KTAHV-locked word "journey"; NO fact is added or removed
// ("35 centres", the phone number and www.ktahv.com are left exactly as they are). Exact-string, idempotent.
//   node tools/repair-opd-copy-ef13.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
const FILE = "public/ahv/assets/enquiry-family-data.js";
const R = [
  ["our Ayurvedic OPD consultation for Ayurvedic outpatient services guarantees a smooth, tailored healing journey based on traditional Ayurvedic principles.", "our Ayurvedic outpatient (OPD) consultation offers a smooth, tailored treatment process based on traditional Ayurvedic principles."],
  ["a comprehensive consultation with the best Ayurvedic doctor near me (for local queries), including", "a comprehensive consultation with an Ayurvedic physician, including"],
  ["For individuals seeking convenience, tele-consult Ayurveda and online Ayurvedic doctor consultations in India are offered as well.", "For convenience, online consultations with an Ayurvedic physician in India are also offered."],
  ["Let’s start your journey toward comprehensive healing together.", "Let’s start your path toward comprehensive healing together."],
];
let s = fs.readFileSync(FILE, "utf8"); let n = 0;
for (const [a, b] of R) { const c = s.split(a).length - 1; n += c; s = s.split(a).join(b); console.log(c, "×", a.slice(0, 70)); }
if (!CHECK && n) fs.writeFileSync(FILE, s);
console.log(CHECK ? `would change ${n}` : `changed ${n}`);
if (CHECK && n) process.exitCode = 1;
