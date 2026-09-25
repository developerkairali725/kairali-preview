/**
 * Coordinator: harvest worker results (workflow journal.jsonl, or a JSON file),
 * validate each against its frozen input, and write accepted batches to
 * l10n/output/<locale>/<batchId>.json in the kit schema (output.schema.json).
 * Rejected batches go to work/rejected/ with reasons and are retried.
 *   node tools/l10n/harvest.mjs <journal.jsonl|results.json> [...]
 */
import fs from "node:fs";
import path from "node:path";
import { rel, sha256 } from "./sources-lite.mjs";
import { WORK } from "./jobs-const.mjs";
const S = new Map(JSON.parse(fs.readFileSync(rel("l10n/source/units.json"), "utf8")).units.map((u) => [u.id, u]));
const SET = JSON.parse(fs.readFileSync(rel("l10n/batches.json"), "utf8")).sourceSetHash;
const NONLATIN = { hi: /[ऀ-ॿ]/, ru: /[Ѐ-ӿ]/, ar: /[؀-ۿ]/, "zh-Hans": /[一-鿿]/, ja: /[぀-ヿ一-鿿]/, ko: /[가-힯]/ };
const BANNED = {
  de: /\b(Kur|Kuren|Urlaub|Luxus\w*|luxuriös\w*|Gäste?n?|Reise|Spa|Resort)\b/i, fr: /\b(cure|vacances|luxe|luxueu\w*|séjour de rêve|clients?|invités?|voyage|spa|resort|station thermale)\b/i,
  es: /\b(spa|resort|vacaciones|lujo\w*|huésped\w*|viaje|cura)\b/i, it: /\b(spa|resort|vacanz\w+|luss\w+|ospit[ei]|viaggio)\b/i, pt: /\b(spa|resort|férias|luxo\w*|luxuos\w*|hóspedes?|viagem|jornada)\b/i,
  nl: /\b(spa|resort|vakantie|luxe\w*|gasten|reis)\b/i, ru: /(спа|курорт|отпуск|роскош\w*|люкс|гост[ьяи]\w*|путешестви\w*)/i, hi: /(स्पा|रिसॉर्ट|छुट्टी|विलासिता|लक्ज़री|मेहमान|अतिथि|यात्रा)/, ar: /(منتجع|سبا|عطلة|فاخر|فخام|ضيوف|ضيف|رحلة)/,
  "zh-Hans": /(水疗|度假|奢华|豪华|宾客|客人|旅程|治愈)/, ja: /(スパ|リゾート|休暇|ラグジュアリー|贅沢|豪華|ゲスト|宿泊客|旅)/, ko: /(스파|리조트|휴가|럭셔리|호화|고급스러운|게스트|손님|여정)/,
};
const BANNED_EN = /\b(spa|resort|holiday|luxur\w*|cure|journey|guests?)\b/i;
const tokens = (s) => (s.match(/\[\[[A-Z]+_\d+\]\]/g) || []).sort();
const digits = (s) => (s.match(/\d+/g) || []).map((d) => d.replace(/^0+(?=\d)/, "")).sort();
const utf16 = (s) => s.length;

function validate(res, input) {
  const errs = [], warn = [];
  const want = new Map(input.units.map((u) => [u.id, u]));
  const got = new Map();
  for (const u of res.units || []) { if (got.has(u.id)) errs.push(`duplicate ${u.id}`); got.set(u.id, u); }
  for (const id of want.keys()) if (!got.has(id)) errs.push(`missing ${id}`);
  for (const id of got.keys()) if (!want.has(id)) errs.push(`unknown ${id}`);
  for (const [id, w] of want) {
    const u = got.get(id);
    if (!u) continue;
    if (u.status === "blocked") { if (!u.issue) errs.push(`${id} blocked without issue`); continue; }
    const t = u.text;
    if (typeof t !== "string" || !t.trim()) { errs.push(`${id} empty`); continue; }
    const PH = /\bTODO\b|```|^\[(?!\[)|\bLorem ipsum\b/;
    const chips = (x) => x.replace(/\[TO CONFIRM[^\]]*\]/g, "");
    if (PH.test(chips(t)) && !PH.test(w.src)) errs.push(`${id} placeholder-like text`);
    if ((t.match(/\[TO CONFIRM/g) || []).length !== (w.src.match(/\[TO CONFIRM/g) || []).length) errs.push(`${id} [TO CONFIRM] chip count changed`);
    if (tokens(t).join() !== tokens(w.src).join()) errs.push(`${id} tokens ${tokens(w.src).join("")} != ${tokens(t).join("")}`);
    for (const m of t.matchAll(/\[\[OPEN_(\d+)\]\]/g)) if (t.indexOf(`[[CLOSE_${m[1]}]]`) >= 0 && t.indexOf(`[[CLOSE_${m[1]}]]`) < m.index) errs.push(`${id} CLOSE_${m[1]} before OPEN`);
    const ds = digits(w.src), dt = digits(t);
    let missing = ds.filter((d) => { const i = dt.indexOf(d); if (i < 0) return true; dt.splice(i, 1); return false; });
    // 12-hour clock times localized to 24-hour (10 PM → 22 Uhr) are display formatting, not a changed fact
    if (/\b(a\.?m\.?|p\.?m\.?)(?![a-z])/i.test(w.src)) missing = missing.filter((d) => { const n = +d; if (n < 1 || n > 12) return true; const alt = String(n === 12 ? 0 : n + 12); const i = dt.indexOf(alt); if (i < 0 && !(n === 12 && dt.includes("12"))) return true; if (i >= 0) dt.splice(i, 1); return false; });
    if (missing.length) errs.push(`${id} numbers missing ${missing.join(",")}`);
    if (w.roles.includes("seo.title") && utf16(t) > 60) errs.push(`${id} seo.title ${utf16(t)}>60`);
    if (w.roles.includes("seo.description") && utf16(t) > 155) errs.push(`${id} seo.description ${utf16(t)}>155`);
    const BRAND = /Kairali\s*[–—-]?\s*(The\s+)?Ayurvedic Healing Village|Ayurvedic Healing Village|Kairali|Thankam Hospital|Pulse Doctors and Labs|Priya|WhatsApp|YouTube|Facebook|Instagram|LinkedIn|Tripadvisor|Google/gi;
    const words = (w.src.replace(/\[\[[A-Z]+_\d+\]\]/g, " ").replace(BRAND, " ").match(/[A-Za-z]{3,}/g) || []).length;
    if (t.trim() === w.src.trim() && words >= 2 && !u.unchangedReason) errs.push(`${id} unchanged without reason`);
    const re = NONLATIN[input.locale];
    if (re && words >= 3 && !re.test(t) && !u.unchangedReason) errs.push(`${id} no ${input.locale} script`);
    const bad = BANNED[input.locale];
    if (bad && bad.test(t) && !BANNED_EN.test(w.src)) warn.push(`${id} banned-term ${t.match(bad)[0]}`);
    else if (bad && bad.test(t)) warn.push(`${id} banned-term-from-source ${t.match(bad)[0]}`);
  }
  return { errs, warn };
}

function* resultsIn(file) {
  const txt = fs.readFileSync(file, "utf8");
  const lines = file.endsWith(".jsonl") ? txt.split("\n").filter(Boolean) : [txt];
  const seen = new Set();
  const walk = function* (v) {
    if (typeof v === "string" && v.includes('"batchId"')) { try { yield* walk(JSON.parse(v)); } catch { /* not json */ } return; }
    if (!v || typeof v !== "object") return;
    if (typeof v.batchId === "string" && typeof v.locale === "string" && Array.isArray(v.units)) { const k = v.locale + "/" + v.batchId + "/" + JSON.stringify(v.units).length; if (!seen.has(k)) { seen.add(k); yield v; } return; }
    for (const x of Array.isArray(v) ? v : Object.values(v)) yield* walk(x);
  };
  for (const l of lines) { try { yield* walk(JSON.parse(l)); } catch { /* skip */ } }
}

const stats = { accepted: 0, rejected: 0, skippedExisting: 0, warnings: 0, blockedUnits: 0 };
const inflightPath = path.join(WORK, "inflight.json");
let inflight = new Set(fs.existsSync(inflightPath) ? JSON.parse(fs.readFileSync(inflightPath, "utf8")) : []);
for (const f of process.argv.slice(2)) {
  for (const res of resultsIn(f)) {
    const key = res.locale + "/" + res.batchId;
    const out = rel(`l10n/output/${res.locale}/${res.batchId}.json`);
    const inFile = path.join(WORK, "in", res.locale, res.batchId + ".json");
    if (fs.existsSync(out)) { stats.skippedExisting++; inflight.delete(key); continue; }
    if (!fs.existsSync(inFile)) continue;
    const input = JSON.parse(fs.readFileSync(inFile, "utf8"));
    // units retired from the frozen source since the job was issued are dropped, not translated
    const retired = new Set(input.units.filter((w) => !S.has(w.id)).map((w) => w.id));
    input.units = input.units.filter((w) => !retired.has(w.id));
    res.units = (res.units || []).filter((u) => !retired.has(u.id));
    const { errs, warn } = validate(res, input);
    inflight.delete(key);
    if (errs.length) {
      stats.rejected++;
      fs.mkdirSync(path.join(WORK, "rejected", res.locale), { recursive: true });
      fs.writeFileSync(path.join(WORK, "rejected", res.locale, res.batchId + ".json"), JSON.stringify({ errs, res }, null, 1));
      continue;
    }
    const got = new Map(res.units.map((u) => [u.id, u]));
    const units = input.units.map((w) => {
      const u = got.get(w.id);
      if (u.status === "blocked") stats.blockedUnits++;
      return { id: w.id, sourceHash: S.get(w.id).sourceHash, text: u.status === "blocked" ? null : u.text, status: u.status === "blocked" ? "blocked" : "translated",
        unchangedReason: u.unchangedReason || null, issues: [u.issue, ...warn.filter((x) => x.startsWith(w.id + " "))].filter(Boolean) };
    });
    stats.warnings += warn.length;
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify({ batchId: res.batchId, sourceSetHash: SET, locale: res.locale, units }, null, 1) + "\n");
    stats.accepted++;
  }
}
fs.writeFileSync(inflightPath, JSON.stringify([...inflight]));
console.log(JSON.stringify(stats));
