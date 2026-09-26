/**
 * AHV localization — the acceptance validator (shared by harvest, revalidate
 * and the release gate). A batch result is accepted only when every unit:
 *  · exists once, is bound to the CURRENT frozen source (text + hash), and is
 *    translated (or explicitly blocked with an issue — blocked never passes the
 *    release gate);
 *  · keeps every inline token exactly once with valid nesting (stack check:
 *    OPEN_n … CLOSE_n properly nested, no crossing);
 *  · states exactly the same numbers as the source — none missing, NONE ADDED —
 *    after these explicit, reviewed display normalizations only:
 *      – digit-group separators / decimal comma (21,567 = 21.567 = 21 567;
 *        1,50,430 = 150.430; 51.2 = 51,2): compared as canonical digit strings;
 *      – 12-hour clock → 24-hour (10 PM → 22:00) when the source has am/pm;
 *      – English month names/abbreviations → month numbers (September 2026 →
 *        2026年9月) in zh/ja/ko date formats, one per source month name;
 *      – English number words → digits (three day → 3日; level one → Niveau 1;
 *        single/double occupancy → 1/2); ":00" minutes on converted 12h times;
 *      – zh/ja/ko counters for "per night/day/person", "daily" (→ 1泊, 1日);
 *      – repeating a number the source already states (24-hour → 24 h/24);
 *      – English quantity words as numerals, each bound to the word in the source:
 *        ordinals (second-largest → 2番目), "two decades" → 20, "a decade" → 10,
 *        "a/one <unit>" (a week → 1週間, a century → 1世紀/100年), and in zh/ja/ko
 *        millions expressed in 万 (1.4M → 140万);
 *    anything else (an added amount, duration, percentage, date) is a factual
 *    change and is rejected for retry;
 *  · respects SEO length gates, [TO CONFIRM] chips, placeholder and script checks.
 */
import crypto from "node:crypto";
import fs from "node:fs";

const sha256 = (s) => crypto.createHash("sha256").update(s, "utf8").digest("hex");
export const NONLATIN = { hi: /[ऀ-ॿ]/, ru: /[Ѐ-ӿ]/, ar: /[؀-ۿ]/, "zh-Hans": /[一-鿿]/, ja: /[぀-ヿ一-鿿]/, ko: /[가-힯]/ };
export const BANNED = {
  de: /\b(Kur|Kuren|Urlaub|Luxus\w*|luxuriös\w*|Gäste?n?|Reise|Spa|Resort)\b/i, fr: /\b(cure|vacances|luxe|luxueu\w*|séjour de rêve|clients?|invités?|voyage|spa|resort|station thermale)\b/i,
  es: /\b(spa|resort|vacaciones|lujo\w*|huésped\w*|viaje|cura)\b/i, it: /\b(spa|resort|vacanz\w+|luss\w+|ospit[ei]|viaggio)\b/i, pt: /\b(spa|resort|férias|luxo\w*|luxuos\w*|hóspedes?|viagem|jornada)\b/i,
  nl: /\b(spa|resort|vakantie|luxe\w*|gasten|reis)\b/i,
  // Cyrillic/Devanagari/Arabic: \b is ASCII-only, so use Unicode letter boundaries (a substring inside an ordinary word is not a finding)
  ru: /(?<![\p{L}])(спа|курорт\p{L}*|отпуск\p{L}*|роскош\p{L}*|люкс|гост[ьяие]\p{L}*|путешестви\p{L}*)(?![\p{L}])/iu,
  hi: /(?<![\p{L}\p{M}])(स्पा|रिसॉर्ट|छुट्टी|विलासिता|लक्ज़री|मेहमान|अतिथि|यात्रा)(?![\p{L}\p{M}])/u,
  ar: /(?<![\p{L}])(?:ال)?(منتجع|سبا|عطلة|فاخر\p{L}*|فخام\p{L}*|ضيوف|ضيف|رحلة)(?![\p{L}])/u,
  "zh-Hans": /(水疗|度假|奢华|豪华|宾客|客人|旅程|治愈)/, ja: /(スパ|リゾート|休暇|ラグジュアリー|贅沢|豪華|ゲスト|宿泊客|旅)/, ko: /(스파|리조트|휴가|럭셔리|호화|고급스러운|게스트|손님|여정)/,
};
const BANNED_EN = /\b(spa|resort|holiday|luxur\w*|cure|journey|guests?)\b/i;
const BRAND = /Kairali\s*[–—-]?\s*(The\s+)?Ayurvedic Healing Village|Ayurvedic Healing Village|Kairali|Thankam Hospital|Pulse Doctors and Labs|Priya|WhatsApp|YouTube|Facebook|Instagram|LinkedIn|Tripadvisor|Google/gi;
const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
NUMBER_WORDS[30] = "thirty"; NUMBER_WORDS[40] = "forty"; NUMBER_WORDS[50] = "fifty"; NUMBER_WORDS[100] = "hundred";
const ORDINALS = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];
const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const tokenList = (s) => s.match(/\[\[[A-Z]+_\d+\]\]/g) || [];

/** Canonical numbers: each numeric token with its group/decimal separators removed; leading zeros dropped. */
export function numbers(s) {
  // clock times (7.30 pm, 19:30, 3:30) are hours + minutes, not one grouped number
  // HTML character references are markup, not numbers (&#8217; = ’): decode first
  const decoded = s.replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (m, n) => String.fromCodePoint(parseInt(n, 16)));
  const clean = decoded.replace(/\[\[[A-Z]+_\d+\]\]/g, " ").replace(/\b(\d{1,2})[.:](\d{2})(?=\s*(?:a\.?m\.?|p\.?m\.?|h\b|Uhr\b|uur\b|ч\b|น\b|[^\d.,]|$))/gi, (m, h, mm) => (/^[0-5]\d$/.test(mm) && +h <= 24 ? `${h} ; ${mm}` : m));
  // a space-type separator groups digits only before an exact 3-digit group (21 567; not "July 2-9 2015")
  return (clean.match(/\d+(?:[.,']\d+|[    ]\d{3}(?!\d))*/g) || []).map((n) => n.replace(/\D/g, "").replace(/^0+(?=\d)/, ""));
}

/** Stack check of OPEN/CLOSE tokens: every CLOSE closes the innermost open span. */
export function nestingError(t) {
  const stack = [];
  for (const tok of tokenList(t)) {
    const m = /\[\[(OPEN|CLOSE)_(\d+)\]\]/.exec(tok);
    if (!m) continue;
    if (m[1] === "OPEN") stack.push(m[2]);
    else if (stack.pop() !== m[2]) return `crossed or unbalanced ${tok}`;
  }
  return stack.length ? `unclosed OPEN_${stack.pop()}` : null;
}

export function numberDiff(src, t, locale) {
  const want = numbers(src), got = numbers(t);
  const missing = [];
  for (const d of want) { const i = got.indexOf(d); if (i >= 0) got.splice(i, 1); else missing.push(d); }
  // 12-hour → 24-hour
  if (/\b\d{1,2}(?::\d\d|\.\d\d)?\s*(a\.?m\.?|p\.?m\.?)(?![a-z])/i.test(src)) {
    for (let k = missing.length - 1; k >= 0; k--) {
      const n = +missing[k]; if (n < 1 || n > 12) continue;
      const alt = String(n === 12 ? 0 : n + 12);
      const i = got.indexOf(alt);
      if (i >= 0) { got.splice(i, 1); missing.splice(k, 1); }
      else if (n === 12 && got.includes("12")) { got.splice(got.indexOf("12"), 1); missing.splice(k, 1); }
    }
  }
  const lower = src.toLowerCase();
  const missingIndex = (raw) => missing.indexOf(raw.replace(/\D/g, "").replace(/^0+(?=\d)/, ""));
  const allow = (value, times = 1) => { for (let c = 0; c < times; c++) { const j = got.indexOf(String(value)); if (j >= 0) got.splice(j, 1); } };
  const count = (re) => (lower.match(re) || []).length;
  // English number words written as digits (three day → 3日, level one → Niveau 1)
  NUMBER_WORDS.forEach((w, n) => { if (w) allow(n, count(new RegExp("\\b" + w + "\\b", "g"))); });
  allow(1, count(/\b(single|once)\b/g)); allow(2, count(/\b(twice|double)\b/g));
  // 24-hour times written with minutes (10 PM → 22:00): the ":00" adds no fact
  if (/\b\d{1,2}\s*(a\.?m\.?|p\.?m\.?)(?![a-z])/i.test(src)) allow(0, count(/\b\d{1,2}\s*(a\.?m\.?|p\.?m\.?)(?![a-z])/gi));
  // English quantity words written as numerals (reviewed; each requires the word in the source):
  //   ordinals (second-largest → 2番目), "N decades" (two decades → 20年), "a decade" (→ 10),
  //   "a/an/one <unit>" (a week → 1週間, a century → 1世紀 / 100年, one of → 一つ… as 1)
  ORDINALS.forEach((w, n) => { if (w) allow(n, count(new RegExp("\\b" + w + "\\b", "g"))); });
  NUMBER_WORDS.forEach((w, n) => { if (w && n > 0) allow(n * 10, count(new RegExp("\\b" + w + "\\s+decades?\\b", "g"))); });
  allow(10, count(/\b(a|one)\s+decade\b/g));
  if (["zh-Hans", "ja", "ko"].includes(locale)) {
    // CJK counters render the English article as 1 (a week → 1週間; a villa → 1室); not in European locales
    allow(1, count(/\b(a|an|one)\s+(year|month|week|day|hour|century|decade|villa|room|time|course|visit|place)\b/g));
    allow(1, count(/\bone of\b/g));
    allow(100, count(/\bcentur(y|ies)\b/g));
    // millions in 万 units: 1.4M → 140万 (numerically identical)
    for (const m of src.matchAll(/(\d+(?:\.\d+)?)\s*(?:M\b|million\b)/gi)) { const v = Math.round(parseFloat(m[1]) * 100); allow(String(v).replace(/^0+(?=\d)/, "")); const k = missingIndex(m[1]); if (k >= 0) missing.splice(k, 1); }
    // month names/abbreviations → month numbers in CJK/Korean date formats
    MONTHS.forEach((name, i) => allow(i + 1, count(new RegExp("\\b(" + name + "|" + name.slice(0, 3) + ")\\b", "g"))));
    // counters: per night / per day / daily → 1泊, 1日, 每晚 1 …
    allow(1, count(/\b(per|a|each|every)\s+(night|day|person|session)\b|\bdaily\b|\bnightly\b/g));
  }
  // repeating a number the source already states adds no new fact (24-hour → 24 h/24)
  const srcSet = new Set(want);
  const added = got.filter((d) => !srcSet.has(d));
  return { missing, added };
}

/**
 * @param res   worker result {units:[{id,text,status,unchangedReason,issue}]}
 * @param input job input {locale, units:[{id, src, roles}]}
 * @param source Map id → frozen source unit {source, sourceHash}
 */
const EXCEPTIONS = (() => {
  try {
    const p = new URL("../../l10n/validator-exceptions.json", import.meta.url);
    return JSON.parse(fs.readFileSync(p, "utf8")).entries;
  } catch { return []; }
})();

export function validate(res, input, source) {
  const errs = [], warn = [];
  const want = new Map(input.units.map((u) => [u.id, u]));
  const got = new Map();
  for (const u of res.units || []) { if (got.has(u.id)) errs.push(`duplicate ${u.id}`); got.set(u.id, u); }
  for (const id of want.keys()) if (!got.has(id)) errs.push(`missing ${id}`);
  for (const id of got.keys()) if (!want.has(id)) errs.push(`unknown ${id}`);
  for (const [id, w] of want) {
    const cur = source?.get(id);
    if (source && (!cur || cur.source !== w.src || sha256(cur.source) !== cur.sourceHash)) { errs.push(`${id} stale: job input does not match the current frozen source`); continue; }
    const u = got.get(id);
    if (!u) continue;
    if (u.status === "blocked") { if (!u.issue) errs.push(`${id} blocked without issue`); continue; }
    const t = u.text;
    if (typeof t !== "string" || !t.trim()) { errs.push(`${id} empty`); continue; }
    const PH = /\bTODO\b|```|^\[(?!\[)|\bLorem ipsum\b/;
    const chips = (x) => x.replace(/\[TO CONFIRM[^\]]*\]/g, "");
    if (PH.test(chips(t)) && !PH.test(w.src)) errs.push(`${id} placeholder-like text`);
    if ((t.match(/\[TO CONFIRM/g) || []).length !== (w.src.match(/\[TO CONFIRM/g) || []).length) errs.push(`${id} [TO CONFIRM] chip count changed`);
    if ([...tokenList(t)].sort().join() !== [...tokenList(w.src)].sort().join()) errs.push(`${id} tokens ${tokenList(w.src).join("")} != ${tokenList(t).join("")}`);
    else { const ne = nestingError(t); if (ne) errs.push(`${id} ${ne}`); }
    let { missing, added } = numberDiff(w.src, t, input.locale);
    // source-bound reviewed exceptions (l10n/validator-exceptions.json): exact id + frozen hash + locale + numbers
    const ex = EXCEPTIONS.find((e) => e.id === id && e.locale === input.locale && cur && e.sourceHash === cur.sourceHash && (!e.requireText || t.includes(e.requireText)));
    if (ex) {
      // each listed number excuses exactly ONE occurrence
      for (const d of ex.allowAdded || []) { const i = added.indexOf(d); if (i >= 0) added.splice(i, 1); }
      for (const d of ex.allowMissing || []) { const i = missing.indexOf(d); if (i >= 0) missing.splice(i, 1); }
    }
    if (missing.length) errs.push(`${id} numbers missing ${missing.join(",")}`);
    if (added.length) errs.push(`${id} numbers added ${added.join(",")}`);
    const roles = Array.isArray(w.roles) ? w.roles.join(",") : String(w.roles || "");
    if (roles.includes("seo.title") && t.length > 60) errs.push(`${id} seo.title ${t.length}>60`);
    if (roles.includes("seo.description") && t.length > 155) errs.push(`${id} seo.description ${t.length}>155`);
    const words = (w.src.replace(/\[\[[A-Z]+_\d+\]\]/g, " ").replace(BRAND, " ").match(/[A-Za-z]{3,}/g) || []).length;
    if (t.trim() === w.src.trim() && words >= 2 && !u.unchangedReason) errs.push(`${id} unchanged without reason`);
    const re = NONLATIN[input.locale];
    if (re && words >= 3 && !re.test(t) && !u.unchangedReason) errs.push(`${id} no ${input.locale} script`);
    const bad = BANNED[input.locale];
    if (bad && bad.test(t)) warn.push(`${id} ${BANNED_EN.test(w.src) ? "banned-term-from-source" : "banned-term"} ${t.match(bad)[0]}`);
  }
  return { errs, warn };
}
