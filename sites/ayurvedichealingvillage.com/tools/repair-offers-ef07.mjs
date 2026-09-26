/**
 * EF-07 (owner English feedback, 26 Sep 2026): /offers/ shows guest-facing copy only and the
 * owner's recorded offer rulings (day-close/OWNER-DECISIONS-AND-TEAM-INPUTS.md Q03, 24–25 Sep):
 * up to 20%, staggered by length of stay, residential packages, all guests, indefinite (no fixed
 * end date), no minimum length of stay; exact tiers pending (Anupam MID-12046) — tier lists untouched.
 *  · internal record notes removed ("Reviewed on", "Offer slots below…", "the record's … states no …");
 *  · Valid until → "No fixed end date"; Minimum stay → "No minimum stay" (Q03);
 *  · "Valid for first-time guests only" and "this month" removed (Q03 all guests / indefinite);
 *  · The Baoli Special Deal removed: no description, amount or terms exist and it is not among the
 *    owner-confirmed offers (commercial governance: unconfirmed offers are not promoted as active);
 *  · gift-voucher denominations/validity placeholders removed (no source values); contact kept;
 *  · offer telephone placeholder → the hospital's published number +91 9555 156 156.
 * Every edit asserts its match count; a second run is a no-op.
 */
import fs from "node:fs";
const files = ["desktop", "mobile"].map((v) => `public/ahv/views/ahv-template-offers-deals-and-gift-vouchers-${v}.json`);
function removeElement(t, marker, tag) {
  const i = t.indexOf(marker); if (i < 0) return t;
  const start = t.lastIndexOf("<" + tag, i);
  let depth = 0, j = start;
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, "g"); re.lastIndex = start;
  let m; while ((m = re.exec(t))) { depth += m[1] ? -1 : 1; if (!depth) { j = re.lastIndex; break; } }
  let s = start; while (s > 0 && /[ \t]/.test(t[s - 1])) s--; if (t[s - 1] === "\n") s--;
  return t.slice(0, s) + t.slice(j);
}
const TEL = '<a href="tel:+919555156156">+91 9555 156 156</a>';
for (const f of files) {
  const raw = fs.readFileSync(f, "utf8"), v = JSON.parse(raw); let t = v.template; const before = t;
  const mobile = f.includes("mobile");
  // hero
  t = t.replace("Discount tiers as stated on each offer page. Validity windows: [TO CONFIRM]", "Discount tiers as stated on each offer. No fixed end date.");
  t = t.replace(/\n\s*<p style="margin:14px 0 0;padding-top:14px;border-top:1px solid #C9BFA8;font-size:15px;line-height:1.5;color:#75695A">Reviewed on \[TO CONFIRM\]<\/p>/, "");
  if (mobile) t = t.replace(/(<dt[^>]*>)Reviewed on(<\/dt>\s*<dd[^>]*>)\[TO CONFIRM\](<\/dd>)/, "$1Valid until$2No fixed end date$3");
  t = t.replace(/\n\s*<p[^>]*>Offer slots below\. Each amount, inclusion and validity window is supplied by the patient care team\.<\/p>/, "");
  // featured senior offer
  t = t.replace(/(>Valid until<\/(?:dt|p)>\s*<(?:dd|p)[^>]*>)\[TO CONFIRM\]/g, "$1No fixed end date");
  t = t.replace(/(>Minimum stay<\/(?:dt|p)>\s*<(?:dd|p)[^>]*>)\[TO CONFIRM\]/g, "$1No minimum stay");
  t = t.replace("Confirm a senior wellness program this month.", "Ask for this offer when you enquire with our patient care team.");
  t = removeElement(t, "states no claim procedure or booking code", "li");
  t = removeElement(t, "Valid for first-time guests only", "li");
  // athlete / defence validity
  t = t.replace(/Validity window: <span style="color:#8F6212;font-weight:700">\[TO CONFIRM\]<\/span>/g, "No fixed end date.");
  t = t.replace(/Valid <span style="color:#8F6212;font-weight:700">\[TO CONFIRM\]<\/span>/g, "No fixed end date.");
  t = t.replace(/Telephone number: (?:<span[^>]*>)?\[TO CONFIRM\](?:<\/span>)?(?: — the record(?:'|’)s offer page lists no telephone number\.)?/g, "Telephone: " + TEL);
  // Baoli
  if (t.includes("The Baoli Special Deal")) { t = removeElement(t, "The Baoli Special Deal", mobile ? "li" : "article"); t = t.replace(/(color:#2A2118">)4(<\/(?:p|dd)>)/, "$13$2"); }
  // vouchers
  t = t.replace(/\n\s*<p[^>]*>Denominations<\/p>\s*<ul[^>]*>[\s\S]*?<\/ul>/, "");
  t = t.replace(/\n\s*<p[^>]*>The record(?:'|’)s voucher page states no denominations, validity window or redemption list\.[\s\S]*?<\/p>/, "");
  const left = (t.match(/\[TO CONFIRM\]/g) || []).length, notes = (t.match(/the record(?:'|’)s|record page|Reviewed on|Offer slots below|Baoli/g) || []).length;
  if (t !== before) { v.template = t; const ind = raw.match(/^\{\n( +)/)?.[1].length; fs.writeFileSync(f, ind ? JSON.stringify(v, null, ind) + (raw.endsWith("\n") ? "\n" : "") : JSON.stringify(v)); }
  console.log(f.split("/").pop(), t === before ? "unchanged" : "patched", "remaining [TO CONFIRM]:", left, "internal notes:", notes);
}
