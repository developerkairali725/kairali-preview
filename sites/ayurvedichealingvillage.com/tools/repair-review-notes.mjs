/**
 * AHV — take the design-review notes off the published page.
 *
 * WHY. The campaign view carries notes written for a design reviewer and
 * renders them as ordinary page copy. On the Air India tie-up page a visitor
 * reads, under the booking form: 'Source captcha response field (name
 * "result"); no challenge is generated in review.' That is developer scaffolding
 * on a page the owner is showing to a partner.
 *
 * WHAT. Blanks the captcha note. The sibling note - 'Design review prototype -
 * nothing is submitted' - is deliberately KEPT, because it is true today and
 * useful to the people reviewing the staging site; it is listed as a go-live
 * item instead, to be removed when the forms are switched on.
 *
 * Idempotent. Usage: node tools/repair-review-notes.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const NOTE = /Source captcha response field \(name [^']*?\); no challenge is generated in review\./g;

let n = 0, files = 0;
for (const dir of ["public/ahv/views", "public/ahv/assets"]) {
  const full = path.join(SITE, dir);
  for (const f of fs.readdirSync(full)) {
    const file = path.join(full, f);
    if (!fs.statSync(file).isFile()) continue;
    const raw = fs.readFileSync(file, "utf8");
    if (!raw.includes("Source captcha response field")) continue;
    const out = raw.replace(NOTE, () => { n++; return ""; });
    if (out !== raw) { files++; if (!DRY) fs.writeFileSync(file, out); }
  }
}
console.log(`${DRY ? "[dry] " : ""}review notes removed: ${n} across ${files} file(s)`);
