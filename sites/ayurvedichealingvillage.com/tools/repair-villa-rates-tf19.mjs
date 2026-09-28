// TF-19 (team audit group 19; owner 28 Sep 2026: approved tariff presentation needs no extra approval once the basis
// is verified). The four villa pages carried no rate: their datasets omitted the EXPIRED 2024–25 tariff. The approved
// 20260925-R1 editions (english-candidate/final-rates/accommodation.json, APAI "daily admission", valid 2025-04-01 →
// 2027-09-30) are the same basis the homepage prints under "Daily admission by villa". Each villa page now shows its
// own single-occupancy figure with the homepage's own inclusions sentence and tariff link — selection of the approved
// edition by currency, never conversion. Default currency = the locale's approved table (tools/l10n/build.mjs rewrites
// `cur: 'INR'`); an explicit visitor choice (localStorage "ahv-cur", shared with homepage/finder/search) wins.
// Villa sizes, bed mappings and every other fact are untouched. Idempotent; asserts every anchor.
//   node tools/repair-villa-rates-tf19.mjs [--check]
import fs from "node:fs";

const CHECK = process.argv.includes("--check");
const acc = JSON.parse(fs.readFileSync("english-candidate/final-rates/accommodation.json", "utf8"));
const KEYS = { "deluxe-villa": "deluxe", "classic-villa": "classic", "royal-villa": "royal", "maharaja-suite": "suite" };
const day = {};
for (const c of ["INR", "USD", "EUR"]) {
  const e = acc.editions[c];
  if (e.validity.from !== "2025-04-01" || e.validity.to !== "2027-09-30") throw new Error(`${c} validity changed: ${JSON.stringify(e.validity)}`);
  day[c] = Object.fromEntries(Object.values(KEYS).map((k) => [k, e.tables.APAI[k][0]])); // [0] = single occupancy
}
// the homepage prints exactly these INR figures under "Daily admission by villa" (proves the same basis)
const HOME_DAY_INR = { deluxe: 26700, classic: 29145, royal: 33450, suite: 53400 };
if (JSON.stringify(day.INR) !== JSON.stringify(HOME_DAY_INR)) throw new Error("INR APAI no longer matches the homepage daily-admission line: " + JSON.stringify(day.INR));

const MARK = "TF-19 villa daily-admission rate";
const LOGIC_CONST = `
// ${MARK} (28 Sep 2026): approved edition 20260925-R1, APAI single occupancy (english-candidate/final-rates) —
// the same figures the homepage prints under "Daily admission by villa". Selection by currency, never conversion.
const VILLA_DAY = ${JSON.stringify({ 'INR': day.INR, 'USD': day.USD, 'EUR': day.EUR }).replace(/"(INR|USD|EUR)"/g, "'$1'")};
const villaMoney = (n, c) => { const s = String(n); if (c === 'INR') { const l3 = s.slice(-3), r = s.slice(0, -3); return '₹' + (r ? r.replace(/\\B(?=(\\d{2})+(?!\\d))/g, ',') + ',' : '') + l3; } return (c === 'USD' ? '$' : '€') + s.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ','); };
`;
const BLOCK = (pdf) =>
  `<div data-ahv-villa-rate="1" style="margin-top:18px;max-width:62ch">` +
  `<p style="margin:0;font-weight:700;font-size:15px">Daily admission by villa</p>` +
  `<p style="margin:4px 0 0;font-size:16px">Single occupancy, per villa per night: {{ villaRate }}.</p>` +
  `<p style="margin:6px 0 0;font-size:15px;line-height:1.6">Includes accommodation, vegetarian meals, one Ayurvedic herbal oil massage per person, one physician consultation and one yoga &amp; meditation session. These are admission rates, not room-only prices. <a href="${pdf}">Daily admission tariff, validity and terms</a></p>` +
  `</div>`;
const home = JSON.parse(fs.readFileSync("public/ahv/views/home-hi-fi-v4.json", "utf8")).template;
const PDF = (home.match(/href="(\/documents\/pdf\/daily-admission-tariff\/en\/[^"]+\.pdf)"/) || [])[1];
if (!PDF || !fs.existsSync("public" + PDF)) throw new Error("homepage daily-admission PDF link not found / missing file: " + PDF);

let changed = 0;
for (const [slug, key] of Object.entries(KEYS)) for (const d of ["desktop", "mobile"]) {
  const file = `public/ahv/views/ahv-page-${slug}-${d}.json`;
  const raw = fs.readFileSync(file, "utf8");
  const j = JSON.parse(raw);
  if (j.template.includes('data-ahv-villa-rate="1"')) continue;
  // template: the facts list and the rate block share ONE grid cell
  const m = j.template.match(/<ul aria-label="Villa facts"[\s\S]*?<\/ul>/);
  if (!m) throw new Error(`${file}: facts list not found`);
  // function replacers throughout: the inserted text contains "$'" (the USD symbol), a special pattern in replace strings
  j.template = j.template.replace(m[0], () => `<div>${m[0]}${BLOCK(PDF)}</div>`);
  // logic: constants, state.cur, stored choice, render value
  if (!/state = \{ open: false, set: null, i: 0, ret: null \}/.test(j.logic)) throw new Error(`${file}: state anchor`);
  j.logic = j.logic.replace(/\nclass Component extends DCLogic \{/, () => LOGIC_CONST + "\nclass Component extends DCLogic {");
  j.logic = j.logic.replace("state = { open: false, set: null, i: 0, ret: null }", () => "state = { open: false, set: null, i: 0, ret: null, cur: 'INR' }");
  const cdm = /componentDidMount\(\) \{/;
  if (!cdm.test(j.logic)) throw new Error(`${file}: componentDidMount anchor`);
  j.logic = j.logic.replace(cdm, () => "componentDidMount() { try { const c = localStorage.getItem('ahv-cur'); if (c && VILLA_DAY[c] && c !== this.state.cur) this.setState({ cur: c }); } catch (e) {}");
  const ret = /return \{ F: window\.AHV_ROOMS_2026\.features\('([a-z]+)'\),/;
  if (!ret.test(j.logic)) throw new Error(`${file}: return anchor`);
  j.logic = j.logic.replace(ret, (all) => `const villaCur = VILLA_DAY[this.state.cur] ? this.state.cur : 'INR';\n    ${all} villaRate: villaMoney(VILLA_DAY[villaCur].${key}, villaCur),`);
  if (!j.logic.includes("\nclass Component") || !j.logic.includes("VILLA_DAY")) throw new Error(`${file}: logic constant not inserted`);
  // the runtime compiles logic with new Function (public/ahv/support.js evalDcLogic): prove it still compiles
  try { new Function("DCLogic", "StreamableLogic", "React", j.logic + "\n;return 1;"); } catch (e) { throw new Error(`${file}: logic no longer compiles: ${e.message}`); }
  changed++;
  if (!CHECK) fs.writeFileSync(file, JSON.stringify(j, null, 2) + (raw.endsWith("\n") ? "\n" : ""));
}
console.log(`${CHECK ? "would change" : "changed"} ${changed} villa view(s); INR ${JSON.stringify(day.INR)} USD ${JSON.stringify(day.USD)} EUR ${JSON.stringify(day.EUR)}; pdf ${PDF}`);
if (CHECK && changed) process.exitCode = 1;
