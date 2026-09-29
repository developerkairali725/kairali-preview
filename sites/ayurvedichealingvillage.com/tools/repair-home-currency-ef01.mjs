/**
 * EF-01 (owner English feedback, 26 Sep 2026): homepage INR / USD / EUR selection from the APPROVED
 * tariff editions (english-candidate/final-rates, rate build 20260925-R1) — selection only, never an
 * exchange-rate conversion.
 *   · every homepage price is rendered from HOME_RATES (values read from final-rates at patch time);
 *   · `cur: 'INR'` in state is the default the locale build (tools/l10n/build.mjs localizeCurrency)
 *     rewrites to the locale's approved currency (DE/FR/ES/IT/PT/NL EUR, RU/AR/ZH/JA/KO USD, HI INR);
 *   · an explicit choice is remembered in localStorage "ahv-cur" — the same key the site search uses,
 *     so the finder, search and homepage agree;
 *   · a Currency button group (same markup as the finder's) sits under the rates introduction.
 * Prices covered: the three programme rates (Deluxe Villa, single occupancy, per night: groups I, III,
 * V), the daily-admission line (APAI, single occupancy) and the four villa cards (Ayurveda group I,
 * single occupancy). Desktop cards keep the "from · other currencies" line, now computed.
 * Idempotent; asserts every anchor.
 *   node tools/repair-home-currency-ef01.mjs
 */
import fs from "node:fs";
import vm from "node:vm";
const R = (f) => JSON.parse(fs.readFileSync(`english-candidate/final-rates/${f}.json`, "utf8"));
const ay = R("ayurveda"), acc = R("accommodation");
const single = (t) => t[0];
const rates = {};
for (const c of ["INR", "USD", "EUR"]) {
  const e = ay.editions[c].tables, a = acc.editions[c].tables.APAI;
  rates[c] = {
    p: [single(e.I.deluxe), single(e.III.deluxe), single(e.V.deluxe)],
    card: { deluxe: single(e.I.deluxe), classic: single(e.I.classic), royal: single(e.I.royal), suite: single(e.I.suite) },
    day: [single(a.deluxe), single(a.classic), single(a.royal), single(a.suite)],
  };
}
// the INR figures printed on the page today must be exactly the INR edition (proves the mapping)
const PRINTED = { p: [16264, 21567, 22780], card: { deluxe: 16264, classic: 18709, royal: 23014, suite: 42964 }, day: [26700, 29145, 33450, 53400] };
if (JSON.stringify(PRINTED) !== JSON.stringify(rates.INR)) throw new Error("INR edition no longer matches the printed homepage figures: " + JSON.stringify(rates.INR));
const inr = (n) => { const s = String(n), l3 = s.slice(-3), r = s.slice(0, -3); return "₹" + (r ? r.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," : "") + l3; };

const LOGIC_CONST = `
// EF-01 (owner, 26 Sep 2026): approved tariff editions 20260925-R1 (english-candidate/final-rates) —
// the visitor selects a currency; amounts are never converted. p = programme per night (Deluxe Villa,
// single occupancy; groups I, III, V), card = villa "from" (Ayurveda group I, single occupancy),
// day = daily admission APAI (single occupancy).
const HOME_RATES = ${JSON.stringify(rates)};
const homeMoney = (n, c) => { const s = String(n); if (c === 'INR') { const l3 = s.slice(-3), r = s.slice(0, -3); return '₹' + (r ? r.replace(/\\B(?=(\\d{2})+(?!\\d))/g, ',') + ',' : '') + l3; } return (c === 'USD' ? '$' : '€') + s.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ','); };
`;
const RENDER = `
    // EF-01: currency selection (approved editions only)
    const cur = ['INR', 'USD', 'EUR'].includes(this.state.cur) ? this.state.cur : 'INR', HR = HOME_RATES[cur];
    const others = (k) => 'from · ' + ['INR', 'USD', 'EUR'].filter((c) => c !== cur).map((c) => homeMoney(HOME_RATES[c].card[k], c) + '*').join(' · ');
    v.rate = { p0: homeMoney(HR.p[0], cur), p1: homeMoney(HR.p[1], cur), p2: homeMoney(HR.p[2], cur),
      d0: homeMoney(HR.day[0], cur), d1: homeMoney(HR.day[1], cur), d2: homeMoney(HR.day[2], cur), d3: homeMoney(HR.day[3], cur),
      deluxe: homeMoney(HR.card.deluxe, cur), classic: homeMoney(HR.card.classic, cur), royal: homeMoney(HR.card.royal, cur), suite: homeMoney(HR.card.suite, cur),
      deluxeAlt: others('deluxe'), classicAlt: others('classic'), royalAlt: others('royal'), suiteAlt: others('suite') };
    v.curButtons = [['INR', '₹ INR'], ['USD', '$ USD'], ['EUR', '€ EUR']].map((pair) => { const on = cur === pair[0];
      return { label: pair[1], on: on ? 'true' : 'false', bg: on ? '#5A4420' : '#fff', fg: on ? '#F7F4EA' : '#2A2118', bd: on ? '#5A4420' : '#C9BFA8',
        pick: () => { this.setState({ cur: pair[0] }); try { localStorage.setItem('ahv-cur', pair[0]); } catch (e) {} } }; });
`;
const BUTTONS = `<div role="group" aria-label="Currency" style="display:flex;gap:6px;flex-wrap:wrap;margin:14px 0 6px"><sc-for list="{{ curButtons }}" as="c" hint-placeholder-count="3"><button type="button" onClick="{{ c.pick }}" aria-pressed="{{ c.on }}" style="min-width:44px;min-height:44px;box-sizing:border-box;padding:0 14px;border-radius:4px;border:1px solid {{ c.bd }};background:{{ c.bg }};color:{{ c.fg }};font-family:'Mulish',sans-serif;font-weight:700;font-size:15px;cursor:pointer">{{ c.label }}</button></sc-for></div>`;

const once = (s, a, b, where) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error(`${where}: expected 1 × ${JSON.stringify(a).slice(0, 80)}, got ${n}`); return s.replace(a, () => b); };
for (const view of ["home-hi-fi-v4", "home-mobile"]) {
  const f = `public/ahv/views/${view}.json`, raw = fs.readFileSync(f, "utf8"), v = JSON.parse(raw);
  if (v.logic.includes("HOME_RATES")) { console.log(view, "already"); continue; }
  // logic
  let l = v.logic;
  l = once(l, "class Component extends DCLogic {", LOGIC_CONST + "\nclass Component extends DCLogic {", view);
  l = once(l, "state = { tab: 'detox',", "state = { cur: 'INR', tab: 'detox',", view);
  l = once(l, "componentDidMount() {\n", "componentDidMount() {\n    try { const c = localStorage.getItem('ahv-cur'); if (['INR', 'USD', 'EUR'].includes(c) && c !== this.state.cur) this.setState({ cur: c }); } catch (e) {}\n", view);
  const last = l.lastIndexOf("\n    return v;\n  }\n}");
  if (last < 0) throw new Error(view + ": renderVals return");
  l = l.slice(0, last) + RENDER + l.slice(last);
  v.logic = l;
  // template
  let t = v.template;
  const P = PRINTED;
  t = once(t, `class="ahv-rate-price">${inr(P.p[0])}<span> / night</span>`, `class="ahv-rate-price">{{ rate.p0 }}<span> / night</span>`, view);
  t = once(t, `class="ahv-rate-price">${inr(P.p[1])}<span> / night</span>`, `class="ahv-rate-price">{{ rate.p1 }}<span> / night</span>`, view);
  t = once(t, `class="ahv-rate-price">${inr(P.p[2])}<span> / night</span>`, `class="ahv-rate-price">{{ rate.p2 }}<span> / night</span>`, view);
  t = once(t, `Deluxe Villa ${inr(P.day[0])} · Classic Villa ${inr(P.day[1])} · Royal Villa ${inr(P.day[2])} · Maharaja Suite ${inr(P.day[3])}`,
    "Deluxe Villa {{ rate.d0 }} · Classic Villa {{ rate.d1 }} · Royal Villa {{ rate.d2 }} · Maharaja Suite {{ rate.d3 }}", view);
  t = once(t, "Your physician confirms the appropriate programme.</p>", "Your physician confirms the appropriate programme.</p>" + BUTTONS, view);
  for (const k of ["deluxe", "classic", "royal", "suite"]) {
    const amount = inr(P.card[k]);
    const desk = new RegExp(`${amount.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(<span style="font-size:14px">\\*</span> <span[^>]*>)from · \\$[\\d,]+\\* · €[\\d,]+\\*(</span>)`);
    const mob = new RegExp(`${amount.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(<span style="font-size:12px">\\*</span></span>)`);
    if (desk.test(t)) t = t.replace(desk, `{{ rate.${k} }}$1{{ rate.${k}Alt }}$2`);
    else if (mob.test(t)) t = t.replace(mob, `{{ rate.${k} }}$1`);
    else throw new Error(`${view}: villa card ${k}`);
  }
  v.template = t;
  new vm.Script(v.logic.replace(/class Component extends DCLogic/, "class Component extends Object")); // syntax check only (compile, never run)
  const ind = raw.match(/^\{\n( +)/)?.[1].length;
  fs.writeFileSync(f, ind ? JSON.stringify(v, null, ind) + (raw.endsWith("\n") ? "\n" : "") : JSON.stringify(v));
  console.log(view, "patched");
}

// Stage 2 (29 Sep 2026, VERIFY hosted-rates-exact): the phone cards still printed a static
// "from · $… · €…" line under the computed price, so with USD or EUR selected it repeated the primary currency
// (and the DE/FR/AR snapshots showed it). It now renders the same computed {{ rate.<card>Alt }} line as desktop:
// the two currencies other than the selected one. Idempotent; each static line is matched by its approved values.
{
  const f = "public/ahv/views/home-mobile.json", raw = fs.readFileSync(f, "utf8"), v = JSON.parse(raw);
  let t = v.template, n = 0;
  for (const k of ["deluxe", "classic", "royal", "suite"]) {
    const usd = rates.USD.card[k].toLocaleString("en-US"), eur = rates.EUR.card[k].toLocaleString("en-US");
    const line = `>from · $${usd}* · €${eur}*</div>`;
    if (t.includes(`>{{ rate.${k}Alt }}</div>`)) continue;
    if (t.split(line).length !== 2) throw new Error(`home-mobile: static 'from' line for ${k} not found exactly once`);
    t = t.replace(line, `>{{ rate.${k}Alt }}</div>`); n++;
  }
  if (n) { v.template = t; const ind = raw.match(/^\{\n( +)/)?.[1].length; fs.writeFileSync(f, ind ? JSON.stringify(v, null, ind) + (raw.endsWith("\n") ? "\n" : "") : JSON.stringify(v)); }
  console.log("home-mobile stage 2:", n ? `${n} card 'from' lines now computed` : "already");
}

// Stage 3: previously patched views must also reject inherited/unknown currency keys.
for (const view of ["home-hi-fi-v4", "home-mobile"]) {
  const f = `public/ahv/views/${view}.json`, raw = fs.readFileSync(f, "utf8"), v = JSON.parse(raw);
  const before = v.logic;
  v.logic = v.logic.replace("HOME_RATES[this.state.cur] ? this.state.cur : 'INR'", "['INR', 'USD', 'EUR'].includes(this.state.cur) ? this.state.cur : 'INR'")
    .replace("c && HOME_RATES[c] && c !== this.state.cur", "['INR', 'USD', 'EUR'].includes(c) && c !== this.state.cur");
  if (v.logic !== before) {
    const ind = raw.match(/^\{\n( +)/)?.[1].length;
    fs.writeFileSync(f, ind ? JSON.stringify(v, null, ind) + (raw.endsWith("\n") ? "\n" : "") : JSON.stringify(v));
  }
}
