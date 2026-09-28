// OWNER-REG-06 (29 Sep 2026): /offers/ drops the "Offers listed / 3" count badge and the "Valid until" presentation.
//   node tools/repair-offers-presentation-20260929.mjs [--check]
// Presentation units only: all three approved offers (senior, Olympic/Paralympic, defence) and their terms stay,
// including the "No fixed end date." sentences inside each offer's own terms. Applied to the served views AND the
// importer overlays, so a re-import keeps the removal. Idempotent: an already-removed unit is reported, not re-sought.
import fs from "node:fs";

const VIEW = (v) => `public/ahv/views/ahv-template-offers-deals-and-gift-vouchers-${v}.json`;
const OVERLAY = (v) => `english-candidate/package-overlay/AHV Template Offers Deals and Gift Vouchers ${v}.dc.html`;

// Remove the whole element that opens at `start` (tag-depth matched), with its leading indentation and newline.
function cut(t, start, tag) {
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, "g");
  re.lastIndex = start;
  let depth = 0, end = -1, m;
  while ((m = re.exec(t))) { depth += m[1] ? -1 : 1; if (!depth) { end = re.lastIndex; break; } }
  if (end < 0) throw new Error(`unbalanced <${tag}> at ${start}`);
  let s = start;
  while (s > 0 && /[ \t]/.test(t[s - 1])) s--;
  if (t[s - 1] === "\n") s--;
  return t.slice(0, s) + t.slice(end);
}
// The innermost `open` tag before `marker` that encloses it.
function enclosing(t, marker, open) {
  const i = t.indexOf(marker);
  if (i < 0) return -1;
  const s = t.lastIndexOf(open, i);
  if (s < 0) throw new Error(`no ${open} before ${marker}`);
  return s;
}

const UNITS = {
  desktop: [
    { id: "badge", marker: ">Offers listed</p>", open: '<div style="border:1px solid #C9BFA8;', tag: "div" },
    { id: "valid-until", marker: ">Valid until</dt>\n            <dd style=\"margin:8px 0 0;font-family:'Marcellus',serif;font-size:26px;line-height:1.1;color:#2A2118\">No fixed end date</dd>", open: '<div style="background:#FFFFFF;padding:16px 18px;', tag: "div" },
  ],
  mobile: [
    { id: "badge", marker: ">Offers listed</dt>", open: "<dl ", tag: "dl" },
    { id: "valid-until", marker: ">Valid until</dt>\n            <dd style=\"margin:0;font-family:'Marcellus',serif;font-size:20px;color:#2A2118;text-align:right\">No fixed end date</dd>", open: '<div style="display:flex;justify-content:space-between;', tag: "div" },
  ],
};
// Layout follow-ups on desktop: the hero loses its 320px badge column; the featured facts grid goes 3 -> 2 columns.
const DESKTOP_LAYOUT = [
  ["grid-template-columns:minmax(0,1fr) 320px;gap:32px 56px;align-items:end;padding:10px 0 30px", "grid-template-columns:minmax(0,1fr);gap:32px 56px;align-items:end;padding:10px 0 30px"],
];
const FEATURED_DL = "<dl style=\"display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;margin:24px 0 0;";

function repair(t, variant, label, log) {
  for (const u of UNITS[variant]) {
    const s = enclosing(t, u.marker, u.open);
    if (s < 0) { log.push(`${label} ${u.id}: already removed`); continue; }
    if (u.id === "valid-until" && variant === "desktop") {
      const dl = t.lastIndexOf("<dl ", s);
      if (t.startsWith(FEATURED_DL, dl)) t = t.slice(0, dl) + FEATURED_DL.replace("repeat(3,", "repeat(2,") + t.slice(dl + FEATURED_DL.length);
      else throw new Error(`${label}: featured facts grid not where expected`);
    }
    t = cut(t, s, u.tag);
    if (t.includes(u.marker)) throw new Error(`${label} ${u.id}: more than one instance`);
    log.push(`${label} ${u.id}: removed`);
  }
  if (variant === "desktop") for (const [a, b] of DESKTOP_LAYOUT) if (t.includes(a)) t = t.replace(a, b);
  return t;
}

const check = process.argv.includes("--check");
const log = [];
for (const variant of ["desktop", "mobile"]) {
  const vf = VIEW(variant);
  const raw = fs.readFileSync(vf, "utf8");
  const v = JSON.parse(raw);
  const t = repair(v.template, variant, `view ${variant}`, log);
  if (t !== v.template && !check) { v.template = t; fs.writeFileSync(vf, JSON.stringify(v, null, 1) + (raw.endsWith("\n") ? "\n" : "")); }
  const of = OVERLAY(variant.charAt(0).toUpperCase() + variant.slice(1));
  const o = fs.readFileSync(of, "utf8");
  const o2 = repair(o, variant, `overlay ${variant}`, log);
  if (o2 !== o && !check) fs.writeFileSync(of, o2);
}
console.log(log.join("\n"));
