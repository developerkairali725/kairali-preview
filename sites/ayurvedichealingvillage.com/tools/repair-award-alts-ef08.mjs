// EF-08 (owner English feedback): on /offers/senior-citizen-offer/ (and the retired /offers/new/ record) five award
// logos all carried the alt "World Luxury Award 2023", copied from the WordPress source onto unrelated logos. Each alt
// now states what that logo image itself shows (read from the image, 28 Sep 2026); where the image's text is not
// legible, the alt stays generic — no award, year or organiser is asserted beyond the logo. Idempotent.
//   node tools/repair-award-alts-ef08.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
const FILE = "public/ahv/assets/campaign-family-data.js";
const ALT = {
  "AHV-V2-5.webp": "Condé Nast Traveller Readers' Travel Awards 2025 logo",
  "AHV-V2-4.1.webp": "Tripadvisor Travellers' Choice Awards 2025 logo",
  "AHV-V2-3.1.webp": "ITCTA awards logo, 10th edition",
  "AHV-V2-2.1.webp": "Award trophy",
  "AHV-V2-1.1.webp": "World Luxury Spa Awards 2025 winner badge",
};
let s = fs.readFileSync(FILE, "utf8"), n = 0;
for (const [img, alt] of Object.entries(ALT)) {
  const from = `"src":"/ahv/assets/img/${img}","alt":"World Luxury Award 2023"`;
  const c = s.split(from).length - 1; n += c;
  s = s.split(from).join(`"src":"/ahv/assets/img/${img}","alt":${JSON.stringify(alt)}`);
}
if (!CHECK && n) fs.writeFileSync(FILE, s);
console.log(`${CHECK ? "would change" : "changed"} ${n} alt(s)`);
if (CHECK && n) process.exitCode = 1;
