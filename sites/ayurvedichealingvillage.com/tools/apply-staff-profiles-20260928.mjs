// STAFF-01 seven-person profile integration (28 Sep 2026). Source of every fact: each person's SIGNED "Employee Consent
// Form — For Use of Professional Profile & Photograph on Company Website" (Kairali Health Resorts Pvt. Ltd., all dated
// 25 Sep 2026, supplied by HR in Rana's folder 1PvekaZE41_zDKwgRrJeRjwWdrGN5m_xB; read 28 Sep via the Drive connector),
// cross-checked against the CV-derived staff bank (staff-rana-20260926/STAFF-BANK-AND-TODO.md). The forms consent to
// name, designation, qualification, joining date, career start, expertise, languages, photograph and biography, and
// exclude private details. Published here: designation · qualification, the year joined (or practice start), languages.
// Omitted on purpose: every experience TOTAL (the bank flags them as disputed/unreconciled), registration numbers
// (OCR-read digits, not re-verified), condition-level "areas of expertise" (clinical wording for Dr. Deepu John's
// review), quotes and all CV detail. Where form and CV disagree, only what both state is used (Adhina's languages).
// Sreeyuktha C and Krishnapriya K are not in the supplied seven: their cards are untouched and flagged.
// Also: /online-consultation/ Chief Physician line and stat ("12+ years" → practising since 2010, form + CV agree);
// /offers/senior-citizen-offer/ biography (EF-08, owner: derive from Rana's facts) — the unsupported "12 years in
// Ayurvedic geriatrics … specialises in …" sentence becomes his consented profile facts, and "care journey" (KTAHV
// locked word) becomes "stay". Flagged for Dr. Deepu John's review before production (HARD GATE 7).
// Idempotent; backups + restore check written before any edit.   node tools/apply-staff-profiles-20260928.mjs [--check]
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
const CHECK = process.argv.includes("--check");
const BACKUP = "/Volumes/Extreme SSD - Blue 2nd/Claude Workspaces/10x WordPress and Websites/deliverables/WOPS-AHV-FINAL-DRAFT-20260924-001/staff-rana-20260926/profiles-backup-20260928";
const FILES = ["public/ahv/views/home-hi-fi-v4.json", "public/ahv/views/home-mobile.json", "public/ahv/assets/enquiry-family-data.js", "public/ahv/assets/campaign-family-data.js"];
// name on the card -> [new role/meta lines (HTML-escaped as the view expects), aria-label or null to keep]
const CARDS = {
  "Dr. Deepu John": ["Chief Physician &amp; Head of Department · BAMS<br>At Kairali since 2019 · Panchakarma &amp; lifestyle management<br>Speaks Malayalam, English, Hindi, Tamil", null],
  "Dr. Rahul R": ["Ayurvedic Physician · BAMS<br>At Kairali since 2023<br>Speaks English, Malayalam, Tamil", null],
  "Dr. Akhila Oommen": ["Ayurvedic Physician · BAMS<br>At Kairali since 2024<br>Speaks Malayalam, Hindi, English", null],
  "Dr. Adhina U.B.": ["Resident Medical Officer · BAMS<br>At Kairali since 2026<br>Speaks English, Malayalam", null],
  "Dr. Aashitha P.S.": ["Ayurvedic Physician · BAMS<br>At Kairali since 2026<br>Speaks Malayalam, English, Hindi, Tamil", null],
  "R Sivadas": ["Yoga Instructor · M.Sc (Yoga)<br>Teaching yoga since 2000<br>Speaks English, Hindi, Malayalam, Tamil", ["R Sivadas, Yoga Teacher", "R Sivadas, Yoga Instructor"]],
  "Anju S": ["Staff Nurse · Diploma in Nursing<br>At Kairali since 2022<br>Speaks English, Malayalam", ["Anju S, Assistant Nurse", "Anju S, Staff Nurse"]],
};
const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
if (!CHECK) {
  fs.mkdirSync(BACKUP, { recursive: true });
  const man = {};
  for (const f of FILES) { const dest = path.join(BACKUP, f.replace(/\//g, "__")); if (!fs.existsSync(dest)) fs.copyFileSync(f, dest); man[f] = { backup: dest, sha256: sha(fs.readFileSync(dest)) }; }
  for (const [f, m] of Object.entries(man)) if (sha(fs.readFileSync(m.backup)) !== m.sha256) throw new Error("backup restore check failed: " + f);
  fs.writeFileSync(path.join(BACKUP, "MANIFEST.json"), JSON.stringify({ at: new Date().toISOString(), files: man }, null, 1));
}
const log = [];
// 1. homepage cards
for (const f of FILES.slice(0, 2)) {
  const s = fs.readFileSync(f, "utf8"); const V = JSON.parse(s);
  const ser = [(o) => JSON.stringify(o), (o) => JSON.stringify(o, null, 1), (o) => JSON.stringify(o, null, 2), (o) => JSON.stringify(o, null, 2) + "\n", (o) => JSON.stringify(o, null, 1) + "\n"].find((g) => g(V) === s);
  if (!ser) throw new Error(f + ": serialisation");
  let t = V.template, n = 0;
  for (const [name, [lines, aria]] of Object.entries(CARDS)) {
    const i = t.indexOf(">" + name + "</div>"); if (i < 0) throw new Error(`${f}: card ${name} not found`);
    const open = t.indexOf(">", t.indexOf("<div", i + name.length + 2)) + 1, close = t.indexOf("</div>", open);
    if (t.slice(open, close) !== lines) { t = t.slice(0, open) + lines + t.slice(close); n++; }
    if (aria && t.includes(`aria-label="${aria[0]}"`)) { t = t.replace(`aria-label="${aria[0]}"`, `aria-label="${aria[1]}"`); n++; }
  }
  V.template = t;
  if (n) { log.push(`${f}: ${n} card field(s) updated`); if (!CHECK) fs.writeFileSync(f, ser(V)); }
}
// 2 + 3. datasets, exact replacements with expected counts
const REPL = {
  "public/ahv/assets/enquiry-family-data.js": [
    ["Chief Physician & Head of Department · 12+ years’ clinical practice", "Chief Physician & Head of Department · practising since 2010"],
    ['{"k":"12+ yrs","v":"Clinical practice of our Chief Physician, Dr. Deepu John"}', '{"k":"Since 2010","v":"Clinical practice of our Chief Physician, Dr. Deepu John"}'],
  ],
  "public/ahv/assets/campaign-family-data.js": [
    ["With over 12 years of experience in Ayurvedic geriatrics, Dr. Deepu John specialises in managing joint pain due to ageing, body pain in old age, and muscle weakness in seniors — using gentle yet effective, evidence-informed treatment plans.",
      "Dr. Deepu John (BAMS) is Chief Physician and Head of Department at Kairali – The Ayurvedic Healing Village. He has practised Ayurveda since 2010 and joined Kairali in 2019; his areas of work include Panchakarma, nutrition and diet, and lifestyle disorders. He speaks Malayalam, English, Hindi and Tamil."],
    ["Your loved one’s safety, comfort, and long-term wellbeing are at the heart of every decision made during their care journey at Kairali.",
      "Your loved one’s safety, comfort, and long-term wellbeing are at the heart of every decision made during their stay at Kairali."],
  ],
};
for (const [f, pairs] of Object.entries(REPL)) {
  let s = fs.readFileSync(f, "utf8"); let n = 0;
  for (const [a, b] of pairs) {
    const c = s.split(a).length - 1;
    if (c === 0) { if (!s.includes(b)) throw new Error(`${f}: neither old nor new text for "${a.slice(0, 40)}"`); continue; }
    s = s.split(a).join(b); n += c;
  }
  if (n) { log.push(`${f}: ${n} replacement(s)`); if (!CHECK) fs.writeFileSync(f, s); }
}
console.log((CHECK ? "[check] " : "") + (log.join("\n") || "already applied"));
