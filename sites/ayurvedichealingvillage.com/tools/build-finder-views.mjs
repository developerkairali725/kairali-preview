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
const DRY = process.argv.includes("--dry");
const MARK = 'data-ahv-finder-block="1"';
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
  L = once(L, `minusOne: -1,`, `minusOne: -1, total: PROGRAMMES.length, heritageLine: (new Date().getFullYear() - 1908) + '+ Years Heritage',`, "renderVals extras");
  view.logic = L;

  const B = SPEC.sharedBlock;
  let T = view.template;
  T = once(T, "show all 33 programmes", "show all {{ total }} programmes", "show-all copy");
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
  const base = patchShared(loadPristine(SPEC.benchmark[variant]));
  write(base);
  for (const d of SPEC.derived) write(derive(base, d, variant));
}
console.log(`finder views derived from ${SPEC.benchmark.desktop} / ${SPEC.benchmark.mobile}; courses ${SPEC.dataPatch.courses.length}, hubs ${SPEC.derived.length}`);
