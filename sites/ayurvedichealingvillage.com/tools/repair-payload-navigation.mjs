/**
 * Restores link navigation on the published website.
 *
 * THE DEFECT. The approved design carries, in 22 of its 136 view payloads:
 *
 *     const guard = (e) => { e.preventDefault(); };
 *
 * bound as onClick on 91 anchors. That is correct behaviour INSIDE the design
 * tool -- clicking a link on the canvas should not navigate away from it -- but
 * it ships to the website, where it means the link does nothing when a patient
 * taps it. The browser reports the anchor as perfectly healthy: correct href,
 * 200 on fetch, visible, clickable. It simply never navigates.
 *
 * Measured before this fix, at 390px: in-body content links dead on every page
 * served by those payloads. The header and footer menus still worked, which is
 * why the fault reads as "some links are broken" rather than an obvious outage,
 * and why an HTTP-level link check -- which is what had been run -- passes it
 * clean. Every one of the 1,849 internal URLs returns 200. They just cannot be
 * clicked.
 *
 * Worst of it: the guard is bound to contact.phoneHref and footer.emailHref, so
 * tapping the phone number or the email address on the contact page of a
 * hospital did nothing at all.
 *
 * WHY A NO-OP IS SAFE. Every one of the 91 guarded anchors carries a real
 * destination -- audited, and zero are "#", empty, or javascript:. There is no
 * anchor here whose click is supposed to be swallowed, so removing the
 * preventDefault restores navigation and changes nothing else. The function is
 * kept rather than deleted because the templates reference it by name.
 *
 * WHY A TOOL. tools/import-english-candidate.mjs rewrites public/ahv/ wholesale,
 * so a hand edit dies at the next import. Idempotent and re-runnable.
 *
 * Usage: node tools/repair-payload-navigation.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(SITE, "public/ahv/views");
const DRY = process.argv.includes("--dry");

// The design writes the guard in two shapes: a local const, and an object
// property on the value bag the template binds against. 22 payloads use the
// first, 44 the second -- 66 of 136 in total. Both are neutralised, and the
// name is kept because the templates reference it.
const NOTE = "/* preview-only nav guard neutralised for the published site */";
const FORMS = [
  { from: "const guard = (e) => { e.preventDefault(); };", to: `const guard = () => {}; ${NOTE}` },
  { from: "guard: (e) => { e.preventDefault(); }", to: `guard: () => {} ${NOTE}` },
];

let changed = 0, already = 0;
for (const f of fs.readdirSync(DIR).filter((n) => n.endsWith(".json"))) {
  const full = path.join(DIR, f);
  const before = fs.readFileSync(full, "utf8");
  let after = before;
  for (const { from, to } of FORMS) if (after.includes(from)) after = after.split(from).join(to);
  if (after === before) { if (before.includes(NOTE)) already++; continue; }
  if (!DRY) fs.writeFileSync(full, after);
  changed++;
}
console.log(`payloads with the preview guard neutralised : ${changed}${DRY ? " (dry run)" : ""}`);
console.log(`already done                                : ${already}`);
if (!changed && !already) console.log("nothing matched — the source markup may have changed shape; re-audit before assuming this is a no-op");
