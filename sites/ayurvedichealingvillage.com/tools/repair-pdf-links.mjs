/**
 * AHV — self-host every PDF, and make the e-book button deliver the book.
 *
 * TWO DEFECTS, both found by reading the payload rather than the design.
 *
 * 1. OFF-SITE PRICE LISTS. 23 rendered links pointed at
 *    www.kairali.com/download/KTAHV-Ayurveda-Packages-{INR,USD,EURO}-…pdf —
 *    including on /ayurvedic-treatments/, one of the owner's benchmark pages.
 *    All three resolve 200 today, so nothing is visibly broken; the problem is
 *    that they are a cross-property dependency. If the group site moves or
 *    renames those files, these pages break and nothing on this site would
 *    notice. Self-hosting turns a silent external dependency into a file this
 *    repo owns and this repo's link checks can see.
 *
 * 2. THE E-BOOK BUTTON DELIVERED NOTHING. Two calls to action —
 *    "Download Free E-book Healing Secrets of Kairali" and "Download E-book &
 *    Book Free Doctor Consultation" — both pointed at "#contact", an in-page
 *    anchor. A visitor pressing Download scrolled to a form. The owner's
 *    instruction (19 Sep 2026) is that they link straight to the file.
 *
 *    Worth recording WHY that is safe: Deepu's WPForms verification the same
 *    morning showed form 8055 ("Download E-book") already uses Go-to-URL
 *    confirmation pointing at the booklet PDF on wp-content. So the live site
 *    ALREADY hands the book over on submit; the button linking straight to it
 *    changes the number of steps, not whether the book is gated. The file it
 *    now points at is the rebuilt Edition 2.0, which supersedes the v12 the
 *    live form serves.
 *
 * NOT CHANGED, deliberately: /download/ayurvedaworkshop-in-kairali.pdf 404s on
 * the live site, so there is nothing to self-host. It survives only in data and
 * reaches no rendered page. Inventing a replacement would be inventing a
 * document (HARD GATE 6); it stays flagged for the owner.
 *
 * Idempotent. Re-run after any design import.
 *   node tools/repair-pdf-links.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const DOC = "/ahv/assets/doc";

/** Off-site PDF -> the self-hosted copy that must exist before we point at it. */
const SELF_HOST = {
  "https://www.kairali.com/download/KTAHV-Ayurveda-Packages-INR-Price-List-2025-26.pdf": `${DOC}/KTAHV-Ayurveda-Packages-INR-Price-List-2025-26.pdf`,
  "https://www.kairali.com/download/KTAHV-Ayurveda-Packages-USD-Price-List-25-26.pdf": `${DOC}/KTAHV-Ayurveda-Packages-USD-Price-List-25-26.pdf`,
  "https://www.kairali.com/download/KTAHV-Ayurveda-Packages-EURO-Price-List-25-26.pdf": `${DOC}/KTAHV-Ayurveda-Packages-EURO-Price-List-25-26.pdf`,
};

/** The booklet the e-book buttons now hand over. */
const EBOOK = `${DOC}/healing-secrets.pdf`;
/** Only these two labels are re-pointed — matched on their own text, so an
 *  unrelated "#contact" button is never touched. */
const EBOOK_LABELS = [
  "Download Free E-book Healing Secrets of Kairali",
  "Download E-book & Book Free Doctor Consultation",
];

// Refuse to rewrite a link to a file that is not actually here yet: a local
// 404 is worse than a working off-site link.
for (const local of [...Object.values(SELF_HOST), EBOOK]) {
  const p = join(SITE, "public", local.replace(/^\//, ""));
  if (!existsSync(p)) throw new Error(`self-hosted file missing, refusing to rewrite: ${local}`);
}

const dirs = ["public/ahv/assets", "public/ahv/views"];
let selfHosted = 0, ebookFixed = 0;
const touched = new Set();

for (const d of dirs) {
  for (const f of readdirSync(join(SITE, d))) {
    if (!/\.(js|json)$/.test(f)) continue;
    const p = join(SITE, d, f);
    const before = readFileSync(p, "utf8");
    let out = before;

    for (const [remote, local] of Object.entries(SELF_HOST)) {
      const n = out.split(remote).length - 1;
      if (n) { out = out.split(remote).join(local); selfHosted += n; }
    }

    for (const label of EBOOK_LABELS) {
      // Only the href that belongs to THIS button, and only while it is still
      // the placeholder anchor.
      const rx = new RegExp(`("text":"${label.replace(/[.*+?^${}()|[\]\\&]/g, "\\$&")}","href":")#contact(")`, "g");
      const n = (out.match(rx) || []).length;
      if (n) { out = out.replace(rx, `$1${EBOOK}$2`); ebookFixed += n; }
    }

    if (out !== before) { touched.add(`${d}/${f}`); if (!DRY) writeFileSync(p, out); }
  }
}

console.log(`${DRY ? "[dry] " : ""}pdf links: ${selfHosted} off-site price-list links now self-hosted, ${ebookFixed} e-book buttons now hand over the booklet`);
for (const t of [...touched].sort()) console.log(`  · ${t}`);
if (!touched.size) console.log("  (nothing to do — already applied)");
