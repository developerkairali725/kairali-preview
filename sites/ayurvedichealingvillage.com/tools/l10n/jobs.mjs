/**
 * Coordinator: pick the next pending (locale, batch) jobs round-robin across
 * locales and write one self-contained input file per job (units + the batch's
 * relevant frozen terms + rules). Accepted outputs live in l10n/output/<loc>/<batch>.json.
 *   node tools/l10n/jobs.mjs --count 90 [--locales de,fr] [--retry]  → prints job list JSON
 */
import fs from "node:fs";
import path from "node:path";
import { rel } from "./sources-lite.mjs";
const arg = (n, d) => { const i = process.argv.indexOf("--" + n); return i > -1 ? process.argv[i + 1] : d; };
export { WORK } from "./jobs-const.mjs";
import { WORK } from "./jobs-const.mjs";
export const LANG = { hi: "Hindi (Devanagari, formal 'aap')", de: "German (Sie-form)", fr: "French (vouvoiement)", es: "Spanish (usted, neutral international)", it: "Italian (Lei-form)", pt: "Portuguese (neutral, as in the approved PDF family)", nl: "Dutch (u-form)", ru: "Russian (formal 'вы')", ar: "Arabic (Modern Standard Arabic)", "zh-Hans": "Simplified Chinese", ja: "Japanese (polite です/ます)", ko: "Korean (formal 합니다체)" };
const B = JSON.parse(fs.readFileSync(rel("l10n/batches.json"), "utf8"));
const S = new Map(JSON.parse(fs.readFileSync(rel("l10n/source/units.json"), "utf8")).units.map((u) => [u.id, u]));
const G = JSON.parse(fs.readFileSync(rel("l10n/glossary.json"), "utf8"));
const locales = (arg("locales", "") || B.locales.join(",")).split(",");
const count = +arg("count", "90");
const done = (l, b) => fs.existsSync(rel(`l10n/output/${l}/${b}.json`));
const inflight = new Set(fs.existsSync(path.join(WORK, "inflight.json")) ? JSON.parse(fs.readFileSync(path.join(WORK, "inflight.json"), "utf8")) : []);
const RULES = [
  "You are a senior native-speaker medical/clinical website editor. Translate each English unit into natural, idiomatic TARGET LANGUAGE for patients, preserving meaning, nuance, qualifiers and register (not word order).",
  "Site: Kairali – The Ayurvedic Healing Village, an NABH-accredited Ayurvedic hospital in Palakkad, Kerala, India. Clinical register: patient, physician, treatment, programme, Panchakarma, admission, discharge, consultation.",
  "Avoid equivalents of spa, resort, holiday/vacation, luxury, cure, journey, guests: use patient/visitor, stay, programme/treatment, premium/comfort, path/process, relief/support instead — EXCEPT inside proper names/award titles, which stay verbatim. Note any such substitution in 'issue'.",
  "Never strengthen claims: support ≠ cure; assessment ≠ guaranteed admission; keep may/can/as required/where appropriate. No new facts, titles, guarantees or efficacy claims. Translate 'doctor/physician' generically; never invent a country-specific medical title.",
  "Keep unchanged: brand and proper names (Kairali, Kairali – The Ayurvedic Healing Village, Priya, people's names, Thankam Hospital, Pulse Doctors and Labs, place names may be transliterated in non-Latin scripts), programme codes (AALCT-HV…), Sanskrit therapy names (transliterate in non-Latin scripts where natural, keep Latin form in parentheses only if the source term is the only identifier), every number, price, currency symbol, date, time, phone, email, URL. Use Western digits 0-9.",
  "Tokens like [[OPEN_1]] [[CLOSE_1]] [[TAG_2]] [[VAR_1]] are markup/variables: each must appear exactly once, unchanged; an OPEN must precede its CLOSE; you may move a whole OPEN…CLOSE span for grammar. A unit that is only a fragment (e.g. ends mid-sentence or is one word joined to a variable) must be translated as a fragment that still fits its sentence (see 'where').",
  "Role limits: a unit whose roles include seo.title must be ≤60 characters; seo.description ≤155. Write concise natural alternatives rather than truncating.",
  "If a unit is a proper name/code/already language-neutral, return it unchanged and give unchangedReason. If a unit is genuinely untranslatable without an unresolved medical/legal fact, set status 'blocked', text null, and explain in issue — do not guess.",
  "Postal addresses (house numbers, PO, district, PIN) stay exactly as in the source, in Latin script, for courier use.",
  "Use the provided 'terms' (approved translations from the owner-approved PDF family) whenever the English term occurs.",
];
const jobs = [];
const pending = Object.fromEntries(locales.map((l) => [l, B.batches.filter((b) => !done(l, b.id) && !inflight.has(l + "/" + b.id))]));
let progressed = true;
while (jobs.length < count && progressed) {
  progressed = false;
  for (const l of locales) {
    if (jobs.length >= count) break;
    const b = pending[l].shift();
    if (!b) continue;
    progressed = true;
    const units = b.ids.map((id) => { const u = S.get(id); return { id, roles: u.roles.join(","), where: u.files[0].replace(/^public\/ahv\/(views|assets)\//, "").replace(/\.json$|\.js$/, ""), src: u.source }; });
    const text = units.map((u) => u.src).join("\n");
    const terms = {};
    for (const [en, m] of Object.entries(G.terms)) if (en.length > 3 && text.includes(en) && m[l]) terms[en] = m[l];
    const file = path.join(WORK, "in", l, b.id + ".json");
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify({ batchId: b.id, locale: l, targetLanguage: LANG[l], rules: RULES, terms, units }, null, 1));
    jobs.push({ locale: l, batchId: b.id, file, n: units.length });
  }
}
fs.mkdirSync(WORK, { recursive: true });
fs.writeFileSync(path.join(WORK, "inflight.json"), JSON.stringify([...inflight, ...jobs.map((j) => j.locale + "/" + j.batchId)]));
process.stdout.write(JSON.stringify(jobs.map(({ locale, batchId }) => [locale, batchId])));
