/**
 * Frozen termbase from the owner-approved PDF family (final 20260925-R1 editable
 * source). Aligns every flattened key across strings/rate-strings/
 * rate-strings-extra/hs-strings for the 12 locales. Short aligned pairs become
 * glossary terms; exact whole-string matches are reusable as approved
 * translations. PDF AI QA is terminology evidence, not native legal/clinical
 * sign-off. Output: l10n/glossary.json
 */
import fs from "node:fs";
import path from "node:path";
import { rel, sha256 } from "./sources-lite.mjs";

const PDF = "/Volumes/Extreme SSD - Blue 2nd/Kairali Digital/AHV-PDF-DESIGN-FAMILY-2026-09-22/13-review-output/rate-build-20260925-1611/editable-source/content";
export const LOCALES = ["hi", "de", "fr", "es", "it", "pt", "nl", "ru", "ar", "zh-Hans", "ja", "ko"];
const pdfCode = (l) => (l === "zh-Hans" ? "zh" : l);
const FAMILIES = ["strings", "rate-strings", "rate-strings-extra", "hs-strings", "hs-content"];
function flat(d, p, out) {
  if (Array.isArray(d)) d.forEach((v, i) => flat(v, `${p}[${i}]`, out));
  else if (d && typeof d === "object") for (const [k, v] of Object.entries(d)) flat(v, `${p}.${k}`, out);
  else if (typeof d === "string") out[p] = d;
  return out;
}
const strip = (s) => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const pairs = {}; // en -> {locale: text}
const evidence = [];
for (const fam of FAMILIES) {
  const enPath = path.join(PDF, `${fam}.en.json`);
  if (!fs.existsSync(enPath)) continue;
  const en = flat(JSON.parse(fs.readFileSync(enPath, "utf8")), "", {});
  evidence.push({ file: `${fam}.en.json`, sha256: sha256(fs.readFileSync(enPath, "utf8")) });
  for (const loc of LOCALES) {
    const p = path.join(PDF, `${fam}.${pdfCode(loc)}.json`);
    if (!fs.existsSync(p)) continue;
    const txt = fs.readFileSync(p, "utf8");
    evidence.push({ file: `${fam}.${pdfCode(loc)}.json`, sha256: sha256(txt) });
    const tr = flat(JSON.parse(txt), "", {});
    for (const [k, v] of Object.entries(en)) {
      if (k.startsWith("._meta") || typeof tr[k] !== "string") continue;
      const e = strip(v);
      if (!/\p{L}/u.test(e) || /\{[a-z_]+\}/.test(e) && e.length < 6) continue;
      (pairs[e] ||= {})[loc] = strip(tr[k]);
    }
  }
}
const all = Object.entries(pairs).filter(([, m]) => Object.keys(m).length === LOCALES.length);
const terms = all.filter(([e]) => e.split(" ").length <= 6 && e.length <= 60 && !/\{/.test(e));
const sentences = all.filter(([e]) => !(e.split(" ").length <= 6 && e.length <= 60));
const glossary = {
  _about: "Frozen AHV web termbase. Terms = short aligned pairs from the approved final PDF family (20260925-R1). Rules bind every batch. Terminology evidence only; not native clinical/legal review.",
  frozenAt: new Date().toISOString(),
  pdfSource: PDF,
  evidence,
  rules: [
    "KTAHV clinical register in every language: patient, physician, treatment, programme, Panchakarma, admission, discharge, consultation.",
    "Never use equivalents of: spa, resort, holiday/vacation, luxury, cure, journey, guests (e.g. DE Kur/Urlaub/Luxus/Gäste; FR cure/vacances/luxe/clients-invités; ES spa/vacaciones/lujo/cura/huéspedes; IT vacanza/lusso/cura(=guarigione)/ospiti; etc.) EXCEPT where the English source itself names an award/title/proper noun containing the word (keep the proper noun as in source, e.g. 'World Luxury Spa Awards').",
    "Support is not cure; assessment is not guaranteed admission; keep every qualifier (may, can, as required, where appropriate).",
    "Keep proper names unchanged: Kairali, Kairali – The Ayurvedic Healing Village, Priya, physician names, villa names as brand names may be kept or transliterated per glossary, programme codes (AALCT-HV, TAP-HV…), Thankam Hospital, Pulse Doctors and Labs, Palakkad, Kodumbu, Olassery.",
    "Never convert prices or change currency symbols; keep every number, date, phone, email, URL exactly.",
    "Do not add medical titles, claims, guarantees or efficacy statements; do not invent jurisdiction-specific titles (translate 'physician'/'doctor' generically).",
    "Tokens [[OPEN_n]] [[CLOSE_n]] [[TAG_n]] [[VAR_n]] must each appear exactly once, unchanged; OPEN before its CLOSE.",
    "Arabic: Modern Standard Arabic; Latin names/IDs/numbers stay as-is. Chinese: Simplified. Portuguese: neutral (PDF variant). Hindi: Devanagari, clear formal register (aap).",
  ],
  terms: Object.fromEntries(terms),
  approvedSentences: Object.fromEntries(sentences),
};
fs.mkdirSync(rel("l10n"), { recursive: true });
fs.writeFileSync(rel("l10n/glossary.json"), JSON.stringify(glossary, null, 1) + "\n");
console.log({ terms: terms.length, approvedSentences: sentences.length, files: evidence.length });
