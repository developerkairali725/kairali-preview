/**
 * Corrects the organisation entity in the approved design's JSON-LD.
 *
 * THE DEFECT. The only organisation node on the site declared
 * "@type": ["Resort", "MedicalBusiness"]. Resort is a LodgingBusiness subtype,
 * so a NABH-accredited Ayurvedic hospital was telling Google, in machine-readable
 * form and with Resort listed FIRST, that it is a hotel. That puts the entity in
 * the wrong competitive set and works against the trust signals Google weights
 * most heavily on medical (YMYL) subjects. It is also the clinical lock's banned
 * word asserted as a type, which the language-lock audit did not catch because it
 * scans prose and titles, not JSON-LD.
 *
 * WHAT IS ADDED, AND WHERE EACH FACT COMES FROM. Nothing is invented (HARD GATE 6):
 *   Hospital / MedicalClinic  the site states throughout that it is a
 *                             NABH-accredited Ayurvedic hospital.
 *   hasCredential             the approved /accreditations page captions its own
 *                             certificate image "NABH accreditation certificate
 *                             — 2024–2027". Name, issuer and validity are read
 *                             from that. NO certificate number is asserted,
 *                             because none appears anywhere in the content.
 *
 * WHY A TOOL. tools/import-english-candidate.mjs rewrites public/ahv/ wholesale,
 * so a hand edit would not survive the next import. Idempotent and re-runnable.
 *
 * Usage: node tools/repair-payload-schema.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(SITE, "public/ahv/views");
const DRY = process.argv.includes("--dry");

// The payloads carry the JSON-LD as an escaped string, so the edits are made on
// the escaped form rather than by parsing and re-serialising the whole template.
const FROM = '\\"@type\\": [\\"Resort\\", \\"MedicalBusiness\\"]';
const TO = '\\"@type\\": [\\"Hospital\\", \\"MedicalClinic\\"]';

const CREDENTIAL =
  ',\\n      \\"hasCredential\\": {\\n' +
  '        \\"@type\\": \\"EducationalOccupationalCredential\\",\\n' +
  '        \\"credentialCategory\\": \\"Accreditation\\",\\n' +
  '        \\"name\\": \\"NABH Accreditation\\",\\n' +
  '        \\"validFrom\\": \\"2024\\",\\n' +
  '        \\"validThrough\\": \\"2027\\",\\n' +
  '        \\"recognizedBy\\": {\\n' +
  '          \\"@type\\": \\"Organization\\",\\n' +
  '          \\"name\\": \\"National Accreditation Board for Hospitals and Healthcare Providers\\",\\n' +
  '          \\"alternateName\\": \\"NABH\\"\\n' +
  '        }\\n' +
  '      }';

let changedFiles = 0, typeFixes = 0, credAdded = 0;
for (const f of fs.readdirSync(DIR).filter((n) => n.endsWith(".json"))) {
  const full = path.join(DIR, f);
  const before = fs.readFileSync(full, "utf8");
  let after = before;
  if (after.includes(FROM)) {
    after = after.split(FROM).join(TO);
    typeFixes++;
  }
  // Attach the credential to the organisation node, once.
  const anchor = TO + ',\\n      \\"@id\\": \\"https://ayurvedichealingvillage.com/#organization\\"';
  if (after.includes(anchor) && !after.includes("NABH Accreditation")) {
    after = after.replace(anchor, anchor + CREDENTIAL);
    credAdded++;
  }
  if (after !== before) {
    if (!DRY) fs.writeFileSync(full, after);
    changedFiles++;
  }
}
console.log(`payloads changed        : ${changedFiles}${DRY ? " (dry run)" : ""}`);
console.log(`Resort -> Hospital      : ${typeFixes}`);
console.log(`NABH credential added   : ${credAdded}`);
if (!typeFixes && !credAdded) console.log("nothing to do — already corrected, or the source markup changed shape");
