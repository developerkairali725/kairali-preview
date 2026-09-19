/**
 * AHV — external links open in a new tab instead of stealing the page.
 *
 * WHY. "Chat with Priya" is a link to https://chat.kairali.com/ with no
 * target, on 79 views. Clicking it REPLACES the page: a patient reading about
 * a treatment taps the chat button and the website is gone, with no way back
 * but the browser's back button. Reported by the owner as "Chat with Priya is
 * broken", and reproduced in a browser - after the click the tab sits on
 * chat.kairali.com.
 *
 * WHAT. Adds target="_blank" and rel="noopener noreferrer" to links that
 * leave the site for a Kairali service: the chat, the booking engine and
 * WhatsApp. rel="noopener" is not optional - without it the opened page can
 * reach back into this one through window.opener.
 *
 * Links that already declare a target are left exactly as they are.
 * Idempotent.
 *
 * Usage: node tools/repair-external-links.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const HOSTS = ["chat.kairali.com", "bookings.ayurvedichealingvillage.com", "wa.me"];

let tags = 0, files = 0, already = 0;
for (const dir of ["public/ahv/views", "public/ahv/assets"]) {
  const full = path.join(SITE, dir);
  for (const f of fs.readdirSync(full)) {
    const file = path.join(full, f);
    if (!fs.statSync(file).isFile()) continue;
    const raw = fs.readFileSync(file, "utf8");
    if (!HOSTS.some((h) => raw.includes(h))) continue;
    let n = 0;
    const out = raw.replace(/<a\b[^>]*?>/g, (tag) => {
      if (!HOSTS.some((h) => tag.includes(h))) return tag;
      if (/\btarget=/.test(tag)) { already++; return tag; }
      n++; tags++;
      // The view templates store markup with escaped quotes; match whichever
      // spelling this file uses so one pass covers both shapes.
      const q = tag.includes('href=\\"') ? '\\"' : '"';
      return tag.replace(/>$/, ` target=${q}_blank${q} rel=${q}noopener noreferrer${q}>`);
    });
    if (n) { files++; if (!DRY) fs.writeFileSync(file, out); }
  }
}
console.log(`${DRY ? "[dry] " : ""}external links opened in a new tab: ${tags} across ${files} files (${already} already declared a target)`);
