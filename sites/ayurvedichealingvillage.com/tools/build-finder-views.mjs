/**
 * AHV programme finders — derive every finder page from the owner's template.
 *
 * WHY. Four templates did one job: /ayurvedic-treatments/ (the owner-built
 * finder), the three homepage hubs, and /training-programs/ - and the finder
 * dataset knew one training course. Owner ruling D-20260916-10: one template,
 * the shared trust-and-guidance block on every finder, five courses visible.
 *
 * WHAT. Reads the benchmark view pair, applies the data patch (five courses,
 * training umbrella moved to the hub URL, Wellness dual-category) and the
 * shared block, writes the benchmark back, then writes one view pair per hub
 * with its own category, h1, breadcrumb, intro, hero and head. The view's
 * own head tags are rewritten because metadata.ts deliberately leaves
 * canonical to the design. Every anchor must match exactly once per variant
 * or the tool stops - it never guesses at a changed template.
 *
 * SEARCH (D-20260922-32 Option A + D-20260922-33, 23 Sep 2026 — brainstorm §4.2).
 * After the shared block, patchSearch() rebuilds the finder's search surface
 * on the same owner template: ONE search box (18px/56px) + the six condition
 * chips + duration + budget + currency in a sticky bar directly under the
 * intro, results directly under the bar (first card visible without scrolling
 * at 390 and 1440), a compact card with ONE CTA, the PRICING literal and the
 * embedded PROGRAMMES array replaced by the JSON dataset generated from
 * public/ahv/search-index.json (tools/build-search-index.mjs — one dataset,
 * one validTo, one vocabulary), the engine from public/design/search.js
 * (typo-tolerant, governed classes) with a plain fallback matcher when the
 * engine is not loaded, and the homepage contract
 * /ayurvedic-treatments/?q=<text>&from=YYYY-MM-DD&to=YYYY-MM-DD (pre-filters
 * on load, dates shown in the results header). /all-programs/ is the sixth
 * hub of the same template (finder-views.json → derived[]).
 *
 * IDEMPOTENT. A pristine copy of the benchmark pair is kept under
 * english-candidate/finder-benchmark/ the first time it is seen unpatched;
 * every run derives from that copy. The import rewrites public/ahv, after
 * which the tool re-derives from the fresh benchmark and refreshes the copy.
 *
 * Usage: node tools/build-finder-views.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VIEWS = path.join(SITE, "public/ahv/views");
const PRISTINE = path.join(SITE, "english-candidate/finder-benchmark");
const SPEC = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/finder-views.json"), "utf8"));
const ADD = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/finder-additions.json"), "utf8"));
const MANIFEST = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/route-manifest.json"), "utf8")).routes;
const INDEX = JSON.parse(fs.readFileSync(path.join(SITE, "public/ahv/search-index.json"), "utf8"));
const DRY = process.argv.includes("--dry");
const MARK = 'data-ahv-finder-block="1"';
const SMARK = 'data-ahv-finder-search="1"';
const HOST = SPEC.host;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const js = (s) => "'" + String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
const rx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Replace exactly one match or throw - the template is the owner's, never guessed at. */
function once(text, find, repl, label) {
  const re = find instanceof RegExp ? find : new RegExp(rx(find));
  const m = text.match(new RegExp(re.source, "g" + re.flags.replace("g", "")));
  const n = m ? m.length : 0;
  if (n !== 1) throw new Error(`${label}: expected exactly one match, found ${n}`);
  return text.replace(re, repl);
}
/** Cut the text between two unique markers (inclusive) and replace it. */
function between(text, startMarker, endMarker, repl, label) {
  const s = text.indexOf(startMarker);
  if (s < 0 || text.indexOf(startMarker, s + 1) >= 0) throw new Error(`${label}: start marker not unique`);
  const e = text.indexOf(endMarker, s);
  if (e < 0) throw new Error(`${label}: end marker not found after start`);
  return text.slice(0, s) + repl + text.slice(e + endMarker.length);
}

function loadPristine(id) {
  const live = path.join(VIEWS, id + ".json");
  const keep = path.join(PRISTINE, id + ".json");
  const view = JSON.parse(fs.readFileSync(live, "utf8"));
  if (!view.template.includes(MARK)) {
    fs.mkdirSync(PRISTINE, { recursive: true });
    fs.writeFileSync(keep, JSON.stringify(view, null, 1));
    return view;
  }
  if (!fs.existsSync(keep)) throw new Error(`${id} is already patched and no pristine copy exists; re-run tools/import-english-candidate.mjs first`);
  return JSON.parse(fs.readFileSync(keep, "utf8"));
}

/** Data + shared block: applied to the benchmark and inherited by every derived view. */
function patchShared(view) {
  const P = SPEC.dataPatch;
  let L = view.logic;
  // Training umbrella -> hub URL, real category, plural name.
  L = once(L, `{t:'Ayurveda Training Program',`, `{t:${js(P.umbrella.name)},`, "umbrella name");
  L = once(L, `h:'${HOST}${P.umbrella.from}',i:'/ahv/assets/img/4-17-1.jpg',c:''}`,
    `h:'${HOST}${P.umbrella.to}',i:'/ahv/assets/img/4-17-1.jpg',c:'${P.umbrella.category}'}` +
    P.courses.map((c) => `, {t:${js(c.name)},s:'',a:'',g:'',x:${js(c.name + " " + c.summary)},h:'${HOST}${c.route}',i:'${c.image}',c:'R'}`).join(""),
    "umbrella entry + courses");
  for (const r of P.wellness) {
    L = once(L, new RegExp(`(h:'${rx(HOST + r)}',i:'[^']*',c:')T'`), "$1TW'", `wellness ${r}`);
  }
  // Card meta for a course: the tariff quotes per-night villa rates, not a course fee.
  const courseMap = "{ " + P.courses.map((c) => `'${c.route}': '${c.days}-day course'`).join(", ") + " }";
  const rateMap = "{ " + Object.entries(P.courseRate).map(([k, v]) => `${k}: '${v}'`).join(", ") + " }";
  L = once(L,
    `const metaFor = (href, cur) => {\n  const row = PRICING[href.replace('${HOST}', '')];\n  if (!row) return 'Tailored programme — fee follows the doctor’s plan';`,
    `const COURSES = ${courseMap};\nconst COURSE_RATE = ${rateMap};\nconst metaFor = (href, cur) => {\n  const p = href.replace('${HOST}', '');\n  if (COURSES[p]) return COURSES[p] + ' · stay from ' + COURSE_RATE[cur] + ' per night';\n  const row = PRICING[p];\n  if (!row) return 'Tailored programme — fee follows the doctor’s plan';`,
    "metaFor");
  L = once(L, `'All 33 governed programmes, as published.'`, `'All ' + PROGRAMMES.length + ' governed programmes, as published.'`, "count copy");
  L = once(L, `minusOne: -1,`, `minusOne: -1, total: PROGRAMMES.length, countAll: PROGRAMMES.length, countW: PROGRAMMES.filter(p => p.c.indexOf('W') >= 0).length, countT: PROGRAMMES.filter(p => p.c.indexOf('T') >= 0).length, countR: PROGRAMMES.filter(p => p.c.indexOf('R') >= 0).length, countY: PROGRAMMES.filter(p => p.c.indexOf('Y') >= 0).length, heritageLine: (new Date().getFullYear() - 1908) + '+ Years Heritage',`, "renderVals extras");
  view.logic = L;

  const B = SPEC.sharedBlock;
  let T = view.template;
  T = once(T, "show all 33 programmes", "show all {{ total }} programmes", "show-all copy");
  // Every category chip printed its count as a literal (33 / 1 / 29 / 1 / 5);
  // the counts now come from the dataset, so five courses read "Training 6".
  const chipRe = /(<button type="button" onClick="\{\{ set(All|W|T|R|Y) \}\}"[\s\S]*?opacity:\.75">)\d+(<\/span><\/button>)/g;
  const chips = (T.match(chipRe) || []).length;
  if (chips !== 5) throw new Error(`chip counts: expected 5 literal chip counts, found ${chips}`);
  T = T.replace(chipRe, (m, a, k, z) => `${a}{{ count${k} }}${z}`);
  const list = `<ul style="margin:0 auto 22px;padding:0;list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(220px,100%),1fr));gap:10px 24px;max-width:640px;text-align:left"> ` +
    B.items.map((it) => `<li style="display:flex;gap:10px;align-items:baseline"><span aria-hidden="true" style="color:#C1882C">◆</span><span>${it}</span></li>`).join(" ") + ` </ul> `;
  T = once(T, /<h2([^>]*)>Not sure which programme fits\?<\/h2>/, (m, a) => list + `<h2${a}>Not sure which programme fits?</h2>`, "not-sure heading");
  T = once(T, /<p([^>]*)>Our physicians match every guest[^<]*<\/p>/, (m, a) => `<p${a}>${esc(B.notSure)}</p>`, "not-sure copy");
  T = once(T, "Free Doctor Consultation</a>",
    `Free Doctor Consultation</a> <a href="${B.whatsapp}" target="_blank" rel="noopener noreferrer" style="border:1.5px solid #006038;color:#006038;border-radius:4px;padding:0 30px;min-height:52px;display:inline-flex;align-items:center;font-weight:700;font-size:14px;letter-spacing:1.5px;text-transform:uppercase" style-hover="background:#006038;color:#F7F4EA;text-decoration:none">${esc(B.whatsappLabel)}</a>`,
    "whatsapp cta");
  T = once(T, 'aria-label="Guidance"', `aria-label="Guidance" ${MARK}`, "block marker");
  view.template = T;
  return view;
}

/* ------------------------------------------------------------------ search surface */
const S = SPEC.search;
const DATASET = INDEX.programmes.map((p) => ({
  r: p.route, t: p.name, s: p.sanskrit || "", c: p.cats, n: p.nights, from: p.from, vt: p.validTo, ps: p.priceState, basis: p.basis,
  fw: p.forWhat, i: p.image || "/ahv/assets/img/F-6.jpg", a: (p.aliases || []), k: p.terms
}));
for (const d of DATASET) if (!MANIFEST.find((r) => r.path === d.r)) throw new Error("dataset route not in manifest: " + d.r);
const CHIPS = INDEX.chips.map((c) => ({ id: c.id, label: c.label, routes: c.routes }));
const BANDS = INDEX.budgetBands;
const UI = INDEX.ui;

const btn = (variant, extra = "") => `font-family:'Mulish',sans-serif;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:${variant === "desktop" ? 48 : 48}px;box-sizing:border-box;padding:0 ${variant === "desktop" ? 18 : 16}px;border-radius:4px;font-weight:700;font-size:${variant === "desktop" ? 16 : 15.5}px;white-space:nowrap;flex:none;${extra}`;
const catBtn = (variant) => `font-family:'Mulish',sans-serif;cursor:pointer;display:inline-flex;align-items:center;gap:6px;min-height:40px;box-sizing:border-box;padding:0 14px;border-radius:4px;font-weight:700;font-size:13px;letter-spacing:1px;text-transform:uppercase;white-space:nowrap;flex:none`;

function bar(variant) {
  const d = variant === "desktop";
  const row = `display:flex;gap:10px;align-items:center;overflow-x:auto;scrollbar-width:thin;padding:2px 0 6px;-webkit-overflow-scrolling:touch`;
  return `<nav aria-label="Find a programme" ${SMARK} style="position:sticky;top:${d ? 0 : 64}px;z-index:35;background:rgba(247,244,234,.98);backdrop-filter:blur(10px);border-bottom:1px solid #E9E2D3">
    <div style="width:min(1220px,${d ? 94 : 92}%);margin:0 auto;padding:${d ? "14px 0 10px" : "10px 0 6px"};display:flex;flex-direction:column;gap:${d ? 10 : 6}px">
      <div style="display:flex;gap:${d ? 14 : 8}px;align-items:center;flex-wrap:${d ? "nowrap" : "wrap"}">
        <label for="${d ? "p11-filter" : "p11m-filter"}" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">What brings you to us?</label>
        <div style="flex:1 1 ${d ? "420px" : "100%"};min-width:0;display:flex;align-items:center;gap:8px;min-height:56px;border:1px solid #C7BCA4;border-radius:4px;background:#fff;padding:0 6px 0 14px;box-sizing:border-box"><span aria-hidden="true" style="color:#8F6212;font-size:20px;flex:none">⌕</span><input id="${d ? "p11-filter" : "p11m-filter"}" type="search" value="{{ query }}" onInput="{{ onQuery }}" placeholder="${esc(S.placeholder)}" autoComplete="off" enterkeyhint="search" style="flex:1;min-width:0;min-height:54px;border:0;outline:none;background:transparent;font-family:'Mulish',sans-serif;font-size:18px;color:#2A2118"><sc-if value="{{ hasQuery }}" hint-placeholder-val="{{ false }}"><button type="button" onClick="{{ clearQuery }}" aria-label="Clear" style="width:44px;height:44px;border:0;background:transparent;color:#75695A;font-size:16px;cursor:pointer;flex:none">✕</button></sc-if></div>
        <div role="group" aria-label="Currency" style="display:flex;gap:4px;flex:none${d ? "" : ";margin-left:auto"}">
          <sc-for list="{{ currencies }}" as="c" hint-placeholder-count="3"><button type="button" onClick="{{ c.pick }}" aria-pressed="{{ c.on }}" style="min-width:44px;min-height:44px;box-sizing:border-box;padding:0 12px;border-radius:4px;border:1px solid {{ c.bd }};background:{{ c.bg }};color:{{ c.fg }};font-family:'Mulish',sans-serif;font-weight:700;font-size:16px;cursor:pointer">{{ c.label }}</button></sc-for>
        </div>
      </div>
      <div role="group" aria-label="Condition" style="${row};${d ? "" : "padding-top:0;padding-bottom:2px"}">
        <sc-for list="{{ chips }}" as="c" hint-placeholder-count="6"><button type="button" onClick="{{ c.pick }}" aria-pressed="{{ c.on }}" style="${btn(variant, "border:1.5px solid {{ c.bd }};background:{{ c.bg }};color:{{ c.fg }}")}">{{ c.label }}</button></sc-for>
      </div>
      <div style="display:flex;gap:${d ? 24 : 14}px;flex-wrap:${d ? "wrap" : "nowrap"};align-items:center;${d ? "" : "overflow-x:auto;-webkit-overflow-scrolling:touch"}">
        <div role="group" aria-label="Duration" style="${row};padding-bottom:2px;${d ? "" : "overflow:visible;flex:none"}"><span style="font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#8F6212;flex:none">Duration</span>
          <sc-for list="{{ durations }}" as="c" hint-placeholder-count="4"><button type="button" onClick="{{ c.pick }}" aria-pressed="{{ c.on }}" style="${btn(variant, "min-height:44px;font-size:15px;border:1.5px solid {{ c.bd }};background:{{ c.bg }};color:{{ c.fg }}")}">{{ c.label }}</button></sc-for>
        </div>
        <div role="group" aria-label="Budget" style="${row};padding-bottom:2px;${d ? "" : "overflow:visible;flex:none"}"><span style="font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#8F6212;flex:none">Budget</span>
          <sc-for list="{{ budgets }}" as="c" hint-placeholder-count="4"><button type="button" onClick="{{ c.pick }}" aria-pressed="{{ c.on }}" style="${btn(variant, "min-height:44px;font-size:15px;border:1.5px solid {{ c.bd }};background:{{ c.bg }};color:{{ c.fg }}")}">{{ c.label }}</button></sc-for>
        </div>
      </div>
      ${d ? `<div role="group" aria-label="Filter by category" style="${row};padding-bottom:4px">__CATS__</div>` : ""}
    </div>
  </nav>`;
}

function card(variant) {
  const d = variant === "desktop";
  const H = d ? "h3" : "h2";
  return `<sc-for list="{{ list }}" as="p" hint-placeholder-count="6">
        <article style="background:#FFFDF7;border:1px solid {{ p.bd }};border-top:3px solid #C1882C;border-radius:4px;display:flex;flex-direction:column;overflow:hidden;box-shadow:{{ p.ring }}">
          <a href="{{ p.h }}" aria-hidden="true" tabIndex="{{ minusOne }}"><img src="{{ p.i }}" width="1920" height="1000" alt="" loading="lazy" style="display:block;width:100%;height:120px;object-fit:cover"></a>
          <div style="padding:${d ? "14px 16px 16px" : "12px 14px 14px"};display:flex;flex-direction:column;gap:6px;flex:1">
            <${H} style="font-family:'Marcellus',serif;font-size:20px;margin:0;line-height:1.3;font-weight:400"><a href="{{ p.h }}" style="color:#2A2118" style-hover="color:#006038">{{ p.t }}</a></${H}>
            <sc-if value="{{ p.s }}" hint-placeholder-val="{{ true }}"><div style="font-family:'Marcellus',serif;font-size:15px;color:#8F6212;margin-top:-4px">{{ p.s }}</div></sc-if>
            <div style="font-family:'Marcellus',serif;font-size:17px;color:#5A4420;letter-spacing:.2px">{{ p.meta }}</div>
            <sc-if value="{{ p.fw }}" hint-placeholder-val="{{ true }}"><p style="margin:0;font-size:16px;line-height:1.5;color:#514a3f;flex:1"><span style="font-weight:700">For:</span> {{ p.fw }}</p></sc-if>
            <a href="{{ p.h }}" style="margin-top:4px;background:#5A4420;color:#F7F4EA;border-radius:4px;padding:0 22px;min-height:52px;font-weight:700;font-size:13.5px;letter-spacing:1.5px;text-transform:uppercase;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box" style-hover="background:#483616;text-decoration:none;color:#F7F4EA">Read the programme</a>
            <a href="{{ p.wa }}" target="_blank" rel="noopener noreferrer" style="font-size:15px;font-weight:700;display:inline-flex;align-items:center;min-height:44px">Ask on WhatsApp ›</a>
          </div>
        </article>
      </sc-for>`;
}

function logic(variant) {
  const d = variant === "desktop";
  const scroll = d
    ? `    this._onScroll = () => { const on = window.scrollY > 620; if (on !== this.state.wOn) this.setState({ wOn: on }); };`
    : `    this._barOn = null; this._priyaOn = null;
    this._onScroll = () => {
      const y = window.scrollY;
      const nearEnd = (y + window.innerHeight) > (document.documentElement.scrollHeight - 140);
      const bar = y > 300;
      const priya = bar && !nearEnd;
      if (bar !== this._barOn || priya !== this._priyaOn) { this._barOn = bar; this._priyaOn = priya; this.setState({ barOn: bar, priyaOn: priya }); }
    };`;
  const scrollVals = d
    ? `      wOpacity: this.state.wOn ? 1 : 0, wVisibility: this.state.wOn ? 'visible' : 'hidden', wPointer: this.state.wOn ? 'auto' : 'none'`
    : `      barO: this.state.barOn ? 1 : 0, barV: this.state.barOn ? 'visible' : 'hidden', barP: this.state.barOn ? 'auto' : 'none',
      priyaO: this.state.priyaOn ? 1 : 0, priyaV: this.state.priyaOn ? 'visible' : 'hidden', priyaP: this.state.priyaOn ? 'auto' : 'none'`;
  const stateExtra = d ? "wOn: false" : "barOn: false, priyaOn: false";
  return `// Generated by tools/build-finder-views.mjs from public/ahv/search-index.json (tools/build-search-index.mjs).
// One dataset, one validTo, one vocabulary for the finder, the header search and the FAQ filter (D-20260922-32).
// Prices: dated tariff snapshot, valid to ${INDEX.priceValidTo}; an expired price prints "${UI.requestQuote}".
const DATASET = ${JSON.stringify(DATASET)};
const CHIPS = ${JSON.stringify(CHIPS)};
const BANDS = ${JSON.stringify(BANDS)};
const HOST_URL = ${js(HOST)};
const LABELS = { A:'All programmes', W:'Wellness Programs', T:'Treatment Programs', R:'Training Programs', Y:'Yoga & Meditation Programs' };
const gINR = n => { const s = String(n), last3 = s.slice(-3), rest = s.slice(0, -3); return '₹' + (rest ? rest.replace(/\\B(?=(\\d{2})+(?!\\d))/g, ',') + ',' : '') + last3; };
const gr = n => String(n).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
const money = (n, cur) => cur === 'INR' ? gINR(n) : (cur === 'USD' ? '$' : '€') + gr(n);
const expired = p => p.ps === 'expired' || (p.vt && new Date() > new Date(p.vt + 'T23:59:59'));
const metaFor = (p, cur) => {
  const parts = [];
  if (p.basis === 'night' && p.n != null) parts.push(p.n + (p.n === 1 ? '-day' : '-day') + (p.c.indexOf('R') >= 0 && p.r !== '/ayurveda-training-programme/' ? ' course' : ''));
  else if (p.n != null) parts.push('Minimum stay: ' + p.n + ' nights');
  if (!p.from) return parts.length ? parts.join(' · ') : 'Tailored programme — fee follows the doctor’s plan';
  if (expired(p)) parts.push(${js(UI.requestQuote)});
  else parts.push(p.basis === 'night' ? 'stay from ' + money(p.from[cur], cur) + ' per night' : 'From ' + money(p.from[cur], cur));
  return parts.join(' · ');
};
const fold = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/[’'\`´]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const fmtDate = s => { const m = /^(\\d{4})-(\\d{2})-(\\d{2})$/.exec(s || ''); if (!m) return ''; const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])); if (isNaN(d)) return ''; return d.getUTCDate() + ' ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getUTCMonth()] + ' ' + d.getUTCFullYear(); };
const PROGRAMMES = DATASET;

class Component extends DCLogic {
  state = { cat: 'A', q: '', cur: 'INR', chip: '', dur: '', budget: '', from: '', to: '', ${stateExtra} };

  componentDidMount() {
    document.documentElement.lang = 'en-US';
${scroll}
    window.addEventListener('scroll', this._onScroll, { passive: true });
    this._onScroll();
    // Homepage contract (D-20260922-33): /ayurvedic-treatments/?q=<text>&from=YYYY-MM-DD&to=YYYY-MM-DD pre-filters on load.
    try {
      const u = new URLSearchParams(window.location.search);
      const next = {};
      if (u.get('q')) next.q = u.get('q').slice(0, 120);
      if (/^\\d{4}-\\d{2}-\\d{2}$/.test(u.get('from') || '')) next.from = u.get('from');
      if (/^\\d{4}-\\d{2}-\\d{2}$/.test(u.get('to') || '')) next.to = u.get('to');
      if (Object.keys(next).length) this.setState(next);
    } catch (e) { /* no URL API */ }
    // The shared engine (public/design/search.js) loads deferred; the index (/ahv/search-index.json) lazily.
    let tries = 0;
    this._wait = setInterval(() => {
      if (window.AHVSearch && window.AHVSearch.load) {
        clearInterval(this._wait); this._wait = null;
        window.AHVSearch.load().then(index => { this._engine = window.AHVSearch.createEngine(index); this.forceUpdate(); }).catch(() => {});
      } else if (++tries > 60) { clearInterval(this._wait); this._wait = null; }
    }, 150);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this._onScroll);
    if (this._wait) clearInterval(this._wait);
    if (this._track) clearTimeout(this._track);
  }

  pick(cat) { this.setState({ cat: cat }); }

  // Engine result → { cls, hits: Map(route -> order) | null, caveats, handoff, corrected, nights, urgent }
  search(raw) {
    const q = String(raw || '').trim();
    if (q.length < 2) return { cls: 'OUT_OF_SCOPE', hits: null, caveats: [], handoff: null, corrected: null };
    if (this._engine) {
      const r = this._engine.query(q, { scope: 'programmes' });
      const hits = new Map();
      r.programmes.forEach((p, n) => hits.set(p.route, n));
      clearTimeout(this._track); this._track = setTimeout(() => { if (window.AHVSearch && window.AHVSearch.track) window.AHVSearch.track('finder', q, hits.size); }, 900);
      return { cls: r.cls, hits: hits, caveats: r.caveats, handoff: r.handoff, corrected: r.corrected, nights: r.nights, urgent: r.urgent };
    }
    // Fallback until the engine arrives: every typed word must appear in name / Sanskrit / aliases / vocabulary / "for what".
    const words = fold(q).split(' ').filter(w => w.length > 1);
    const hits = new Map();
    DATASET.forEach(p => {
      const hay = fold([p.t, p.s, p.fw].concat(p.a, p.k).join(' | '));
      if (words.every(w => hay.indexOf(w) >= 0)) hits.set(p.r, hits.size);
    });
    return { cls: hits.size ? 'MULTIPLE_POSSIBLE_MATCHES' : 'OUT_OF_SCOPE', hits: hits, caveats: [], handoff: null, corrected: null };
  }

  renderVals() {
    const st = this.state, cat = st.cat, cur = st.cur, typed = st.q.trim();
    const res = this.search(st.q);
    const cls = res.cls, hits = res.hits;
    const blocked = cls === 'CONSULT_FIRST' || cls === 'NOT_TREATED';
    const chip = CHIPS.filter(c => c.id === st.chip)[0];
    const band = st.budget ? Number(st.budget) : 0;
    const inDur = p => { if (!st.dur || p.n == null) return !st.dur; if (st.dur === '7') return p.n <= 7; if (st.dur === '14') return p.n === 14; return p.n >= 21; };
    const inBudget = p => !band || (p.from && p.basis !== 'night' && !expired(p) && p.from[cur] <= band);
    const list = DATASET
      .filter(p => cat === 'A' || p.c.indexOf(cat) >= 0)
      .filter(p => !chip || chip.routes.indexOf(p.r) >= 0)
      .filter(inDur).filter(inBudget)
      .filter(p => !hits || hits.has(p.r))
      .sort((a, b) => hits ? hits.get(a.r) - hits.get(b.r) : 0)
      .map(p => ({
        h: HOST_URL + p.r, t: p.t, s: p.s, i: p.i, fw: p.fw,
        wa: 'https://wa.me/919289838797?text=' + encodeURIComponent('Hello, I’d like to check whether the ' + p.t + ' is suitable for me.' + (st.from ? ' Preferred dates: ' + st.from + (st.to ? ' to ' + st.to : '') + '.' : '')),
        meta: metaFor(p, cur),
        bd: hits ? '#C1882C' : '#E9E2D3',
        ring: hits ? '0 0 0 2px rgba(193,136,44,.26)' : 'none'
      }));
    const count = list.length;
    const filtered = !!(chip || st.dur || st.budget);
    const sel = (on) => ({ on: on ? 'true' : 'false', bg: on ? '#5A4420' : '#fff', fg: on ? '#F7F4EA' : '#2A2118', bd: on ? '#5A4420' : '#C9BFA8' });
    const chips = CHIPS.map(c => Object.assign({ id: c.id, label: c.label, pick: () => this.setState({ chip: st.chip === c.id ? '' : c.id }) }, sel(st.chip === c.id)));
    const durations = [['', 'Any'], ['7', 'Up to 7 nights'], ['14', '14 nights'], ['21', '21+ nights']].map(pair => Object.assign({ label: pair[1], pick: () => this.setState({ dur: pair[0] }) }, sel(st.dur === pair[0])));
    const budgets = [{ v: '', label: 'Any' }].concat((BANDS[cur] || []).map(b => ({ v: String(b), label: 'Up to ' + money(b, cur) }))).map(b => Object.assign({ label: b.label, pick: () => this.setState({ budget: b.v }) }, sel(st.budget === b.v)));
    const currencies = [['₹', 'INR'], ['$', 'USD'], ['€', 'EUR']].map(pair => Object.assign({ label: pair[0], pick: () => this.setState({ cur: pair[1], budget: '' }) }, sel(cur === pair[1])));
    const on = k => cat === k, bg = k => cat === k ? '#5A4420' : '#fff', fg = k => cat === k ? '#F7F4EA' : '#2A2118', bd = k => cat === k ? '#5A4420' : '#C9BFA8';
    const TARIFF = {
      INR: ['₹ INR price list 2025-26', '/ahv/assets/doc/KTAHV-Ayurveda-Packages-INR-Price-List-2025-26.pdf'],
      USD: ['$ USD price list 25-26', '/ahv/assets/doc/KTAHV-Ayurveda-Packages-USD-Price-List-25-26.pdf'],
      EUR: ['€ EURO price list 25-26', '/ahv/assets/doc/KTAHV-Ayurveda-Packages-EURO-Price-List-25-26.pdf']
    };
    const dates = st.from ? fmtDate(st.from) + (st.to ? ' – ' + fmtDate(st.to) : '') : '';
    const where = cat === 'A' ? '' : ' in ' + LABELS[cat];
    let resultLine;
    if (cls === 'NOT_TREATED') resultLine = 'This is not something we treat.';
    else if (cls === 'CONSULT_FIRST') resultLine = 'We would rather talk to you about “' + typed + '” than point you at a programme.';
    else if (hits) resultLine = count === 0
      ? 'No close match for “' + typed + '” — a personalised programme may suit you'
      : (res.corrected ? 'Showing ' + count + (count === 1 ? ' programme' : ' programmes') + ' for “' + res.corrected + '” — you typed “' + typed + '”' : count + (count === 1 ? ' programme matches ' : (cls === 'MULTIPLE_POSSIBLE_MATCHES' ? ' programmes may apply to ' : ' programmes match ')) + '“' + typed + '”') + where;
    else if (filtered) resultLine = count + (count === 1 ? ' programme' : ' programmes') + (chip ? ' for ' + chip.label : '') + where;
    else resultLine = cat === 'A' ? 'All ' + DATASET.length + ' governed programmes, as published.' : count + ' in ' + LABELS[cat];
    return {
      list: list, resultLine: resultLine,
      isEmpty: count === 0 && !blocked,
      isUrgent: cls === 'URGENT_MEDICAL_HELP',
      isConsult: cls === 'CONSULT_FIRST' || (cls === 'URGENT_MEDICAL_HELP' && count === 0),
      isDeclined: cls === 'NOT_TREATED',
      isMulti: cls === 'MULTIPLE_POSSIBLE_MATCHES' && count > 1 && !!hits && res.nights == null,
      caveats: res.caveats, hasCaveats: res.caveats.length > 0,
      hasHandoff: !!res.handoff, handoffLabel: res.handoff ? res.handoff.label : '', handoffHref: res.handoff ? HOST_URL + res.handoff.route : '',
      hasDates: !!dates, datesLine: dates ? 'Preferred dates: ' + dates : '',
      enquiryHref: HOST_URL + '/enquiry-form/' + (st.from ? '?from=' + encodeURIComponent(st.from) + (st.to ? '&to=' + encodeURIComponent(st.to) : '') : ''),
      query: st.q, hasQuery: typed.length > 0,
      onQuery: e => this.setState({ q: e.target.value }),
      clearQuery: () => this.setState({ q: '' }),
      reset: () => this.setState({ q: '', cat: 'A', chip: '', dur: '', budget: '' }),
      chips: chips, durations: durations, budgets: budgets, currencies: currencies,
      setAll: () => this.pick('A'), setW: () => this.pick('W'), setT: () => this.pick('T'), setR: () => this.pick('R'), setY: () => this.pick('Y'),
      isAll: on('A') ? 'true' : 'false', isW: on('W') ? 'true' : 'false', isT: on('T') ? 'true' : 'false', isR: on('R') ? 'true' : 'false', isY: on('Y') ? 'true' : 'false',
      bgAll: bg('A'), bgW: bg('W'), bgT: bg('T'), bgR: bg('R'), bgY: bg('Y'),
      fgAll: fg('A'), fgW: fg('W'), fgT: fg('T'), fgR: fg('R'), fgY: fg('Y'),
      bdAll: bd('A'), bdW: bd('W'), bdT: bd('T'), bdR: bd('R'), bdY: bd('Y'),
      tariffLabel: TARIFF[cur][0], tariffHref: TARIFF[cur][1],
      minusOne: -1, total: DATASET.length, countAll: DATASET.length, countW: DATASET.filter(p => p.c.indexOf('W') >= 0).length, countT: DATASET.filter(p => p.c.indexOf('T') >= 0).length, countR: DATASET.filter(p => p.c.indexOf('R') >= 0).length, countY: DATASET.filter(p => p.c.indexOf('Y') >= 0).length, heritageLine: (new Date().getFullYear() - 1908) + '+ Years Heritage',
${scrollVals}
    };
  }
}
`;
}

/** The search surface: sticky bar under the intro, results directly under it, compact card, dataset-driven logic. */
function patchSearch(view, variant) {
  const d = variant === "desktop";
  let T = view.template;
  // 1. the category chips row (owner's five buttons, counts already dynamic) moves INTO the new bar as the quiet last row
  const navStart = '<nav aria-label="Programme categories"';
  const navEnd = "</nav>";
  const s = T.indexOf(navStart); if (s < 0) throw new Error(`${variant}: category nav not found`);
  const e = T.indexOf(navEnd, s);
  const oldNav = T.slice(s, e + navEnd.length);
  const catButtons = (oldNav.match(/<button type="button" onClick="\{\{ set(?:All|W|T|R|Y) \}\}"[\s\S]*?<\/button>/g) || []);
  if (catButtons.length !== 5) throw new Error(`${variant}: expected 5 category buttons, found ${catButtons.length}`);
  const cats = catButtons.map((b) => b.replace(/style="[^"]*"/, (m) => `style="${catBtn(variant)};border:1.5px solid ${m.match(/border:1\.5px solid (\{\{ bd\w+ \}\})/)[1]};background:${m.match(/background:(\{\{ bg\w+ \}\})/)[1]};color:${m.match(/color:(\{\{ fg\w+ \}\})/)[1]}"`).replace(/font-size:1[34](?:\.5)?px;letter-spacing:0;opacity:\.75/, "font-size:13px;letter-spacing:0;opacity:.75")).join(" ");
  T = T.slice(0, s) + "__BAR__" + T.slice(e + navEnd.length);
  // 2. the bar goes directly under the intro; the hero shrinks to a band and moves below the results
  const heroStart = d ? '<div style="height:clamp(280px,30vw,420px);background-image:url(' : '<div style="height:230px;background-image:url(';
  const hs = T.indexOf(heroStart); if (hs < 0 || T.indexOf(heroStart, hs + 1) >= 0) throw new Error(`${variant}: hero not unique`);
  const heroEnd = d ? "</svg>\n  </div>" : "</div>\n  </div>";
  const he = T.indexOf(heroEnd, hs); if (he < 0) throw new Error(`${variant}: hero end not found`);
  let hero = T.slice(hs, he + heroEnd.length);
  hero = hero.replace(heroStart, d ? '<div style="height:clamp(160px,16vw,240px);background-image:url(' : '<div style="height:150px;background-image:url(');
  T = T.slice(0, hs) + "__HERO_SLOT__" + T.slice(he + heroEnd.length);
  T = T.replace("__HERO_SLOT__\n\n  __BAR__", "__BAR__").replace("__HERO_SLOT__", "");
  if (!T.includes("__BAR__")) throw new Error(`${variant}: bar slot lost`);
  T = T.replace("__BAR__", bar(variant).replace("__CATS__", cats));
  // 3. inside the results section: drop the "Choose Your Programme" h2 + currency group, keep the live result line, add dates + hand-off
  T = between(T, d ? '<div style="display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin:0 0 14px">' : '<h2 style="font-family:\'Marcellus\',serif;font-size:26px;margin:0 0 14px">Choose Your',
    d ? "</sc-for>\n      </div>\n    </div>" : "</sc-for>\n    </div>", "", `${variant}: heading + currency group`);
  T = between(T, "<p aria-live=\"polite\"", "</span>", `<p aria-live="polite" style="margin:0;font-size:16px;color:#514a3f;font-weight:700">{{ resultLine }}</p>
      <sc-if value="{{ hasDates }}" hint-placeholder-val="{{ false }}"><p style="margin:0;font-size:15.5px;color:#8F6212">{{ datesLine }}</p></sc-if>
      <sc-if value="{{ hasHandoff }}" hint-placeholder-val="{{ false }}"><a href="{{ handoffHref }}" style="display:inline-flex;align-items:center;min-height:44px;font-size:16px;color:#006038;font-weight:700">Looking for {{ handoffLabel }}? →</a></sc-if>`, `${variant}: result line + tariff`);
  T = T.replace(/<p id="p11m?-filter-help"[^>]*>[\s\S]*?<\/p>/, ""); // desktop: under the result line; mobile: inside the nav removed in step 1
  // 4. the card
  T = between(T, '<sc-for list="{{ list }}" as="p" hint-placeholder-count="6">', "</sc-for>", card(variant), `${variant}: card`);
  // 5. empty state wording: KTAHV clinical register (the g-word) — patients, not the hospitality word
  T = once(T, "Many guests come to us with more than one condition at once", "Many patients come to us with more than one condition at once", `${variant}: empty-state register`);
  // 6. the tariff link joins the footnote; the hero band sits between the results and the guidance block
  T = once(T, /<p style="margin:3[04]px 0 0;padding-top:18px;border-top:1px solid #E9E2D3;color:#75695A;font-size:14.5px[^>]*>Programme fees are/, (m) => m.replace("Programme fees are", 'Full tariff sheet: <a href="{{ tariffHref }}" rel="noopener noreferrer" style="font-weight:700;display:inline-flex;align-items:center;min-height:44px">{{ tariffLabel }}</a>. Programme fees are'), `${variant}: tariff footnote`);
  T = once(T, `<section aria-label="Guidance"`, hero + `\n\n  <section aria-label="Guidance"`, `${variant}: hero band before guidance`);
  // postconditions
  for (const need of ['id="p11', "{{ chips }}", "{{ durations }}", "{{ budgets }}", "{{ currencies }}", "Read the programme", "{{ datesLine }}", SMARK]) if (!T.includes(need)) throw new Error(`${variant}: postcondition missing ${need}`);
  for (const gone of ["Choose Your", "p11-filter-help", "p11m-filter-help", "Check suitability on WhatsApp", "Book Now</a>", "Many guests"]) if (T.includes(gone)) throw new Error(`${variant}: ${gone} survived`);
  view.template = T;
  view.logic = logic(variant);
  view.scripts = [];
  return view;
}

/** Per-hub identity: category, copy, hero, head. */
function derive(base, d, variant) {
  const view = JSON.parse(JSON.stringify(base));
  const route = MANIFEST.find((r) => r.path === d.route);
  if (!route) throw new Error("route not in manifest: " + d.route);
  const md = route.metadata;
  let L = view.logic;
  const catMatches = L.split("cat: 'A'").length - 1;
  if (catMatches !== 2) throw new Error(`${d.id}: expected two "cat: 'A'" anchors, found ${catMatches}`);
  L = L.split("cat: 'A'").join(`cat: '${d.cat}'`);
  view.logic = L;
  let T = view.template;
  T = once(T, /<title>[^<]*<\/title>/, `<title>${esc(md.title)}</title>`, "title");
  T = once(T, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(md.description)}">`, "description");
  T = once(T, /<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${esc(md.canonical)}">`, "canonical");
  T = once(T, /<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(md.ogTitle || md.title)}">`, "og:title");
  T = once(T, /<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(md.ogDescription || md.description)}">`, "og:description");
  T = once(T, /<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${esc(md.canonical)}">`, "og:url");
  T = once(T, /<span aria-current="page"([^>]*)>Ayurvedic Treatments<\/span>/, (m, a) => `<span aria-current="page"${a}>${esc(d.crumb)}</span>`, "breadcrumb");
  T = once(T, "Ayurvedic Treatments</h1>", `${esc(d.h1)}</h1>`, "h1");
  T = once(T, />Experience traditional Ayurvedic treatments in Kerala[^<]*<\/p>/, `>${esc(d.intro)}</p>`, "intro");
  if (d.hero) T = once(T, "background-image:url(/ahv/assets/img/neck-upper-back-pain.webp)", `background-image:url(${d.hero})`, "hero");
  view.template = T;
  view.id = `${d.id}-${variant}`;
  view.derivedFrom = base.id;
  view.derivedRoute = d.route;
  return view;
}

const write = (view) => {
  const file = path.join(VIEWS, view.id + ".json");
  if (!DRY) fs.writeFileSync(file, JSON.stringify(view, null, 1) + "\n");
  console.log(`${DRY ? "[dry] " : ""}wrote ${view.id} (template ${view.template.length} chars, logic ${view.logic.length})`);
};

for (const variant of ["desktop", "mobile"]) {
  const base = patchSearch(patchShared(loadPristine(SPEC.benchmark[variant])), variant);
  write(base);
  for (const d of SPEC.derived) write(derive(base, d, variant));
}
console.log(`finder views derived from ${SPEC.benchmark.desktop} / ${SPEC.benchmark.mobile}; courses ${SPEC.dataPatch.courses.length}, hubs ${SPEC.derived.length}; dataset ${DATASET.length} programmes, prices valid to ${INDEX.priceValidTo}`);
