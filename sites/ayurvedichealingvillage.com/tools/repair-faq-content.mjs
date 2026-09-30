#!/usr/bin/env node
/**
 * AHV — /faqs-downloads/: the owner-approved FAQ content pass (D-20260922-36, "approved both").
 *
 * SOURCE. docs/research/2026-09-23-ahv-search-brainstorm.md §5.3 (25 new questions) + §5.4 (38 proofread
 * findings F1–F38), drafted into english-candidate/faq-content-2026.json by content-geo-writer from RECORDED
 * facts only (rates reckoner, served datasets, physician roster) — never invented (HARD GATE 6). A question
 * whose answer has no recorded fact carries status "no-recorded-fact" and is NOT added here; it is listed for
 * the owner / Dr. Deepu John in docs/content/ahv-faq-content-pass-2026-09-23.md. Clinical rewrites are flagged
 * for Dr. Deepu John's sign-off before production (HARD GATE 7) — they ship to STAGING only.
 *
 * WHAT THIS DOES (both FAQ views + both design-overlay components, so the next import derives the same page):
 *   1. edits      — replaces the question (<h3>) and the answer (<div> after </summary>) of every q-NN in
 *                   `edits`, restyling the writer's bare <p>/<ul>/<li>/<strong>/<a> with the view's inline styles;
 *   2. additions  — appends every `drafted` addition to the END of its topic <section>, ids q-45… in file order
 *                   (existing ids never move — the search index, the intents and the query test set key on them);
 *   3. register   — the topic "For International Guests" → "For International Patients" (label, heading, rail,
 *                   id → topic-for-international-patients); the intro and closing paragraphs lose the g-/j-words;
 *   4. counts     — the per-topic "N questions" badges, the rail counts and the "44 questions" mentions follow
 *                   the new totals.
 * Idempotent (re-running applies nothing new). Loud postconditions: ids unique and complete, counts consistent,
 * ZERO banned words and ZERO competitor names in the rendered FAQ text.
 *
 *   node tools/repair-faq-content.mjs [--dry]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const CONTENT = JSON.parse(readFileSync(join(SITE, "english-candidate/faq-content-2026.json"), "utf8"));
const VIEWS = join(SITE, "public/ahv/views");
const OVERLAY = join(SITE, "english-candidate/package-overlay");

const BANNED = /\b(spa|spas|resorts?|holidays?|luxury|luxurious|cure|cures|cured|journeys?|guests?|getaways?|retreats?|wellness consultants?|guest relations)\b/i;
const COMPETITORS = /Somatheeram|Atmantan|Ananda|Kerala Ayurveda|Kalari Kovilakom|Pema|Six Senses|\bVana\b/;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const strip = (h) => h.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ");

const VOID = new Set(["br", "img", "hr", "meta", "link", "input", "source", "wbr"]);
function elementSpan(t, at) {
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^>]*)>/g;
  re.lastIndex = at;
  let depth = 0, m;
  while ((m = re.exec(t))) {
    const [full, close, tag, attrs] = m;
    if (VOID.has(tag.toLowerCase()) || /\/\s*$/.test(attrs)) { if (m.index === at) return [at, at + full.length]; continue; }
    if (close) { depth -= 1; if (depth === 0) return [at, m.index + full.length]; } else depth += 1;
  }
  throw new Error(`unbalanced element at ${at}`);
}

/** the view's inline styles per side (measured from q-09 in each view) */
function styles(side) {
  const fs = side === "desktop" ? "17.5px" : "17px";
  return {
    p: `max-width:66ch;font-size:${fs};line-height:1.75;color:#514A3F;margin:0 0 14px;`,
    ul: `max-width:66ch;margin:0 0 14px;padding:0 0 0 20px;font-size:${fs};line-height:1.75;color:#514A3F;`,
    li: "margin:0 0 8px;",
    strong: "color:#2A2118;",
  };
}
/** the writer's bare HTML → the view's styled HTML (only p/ul/li/strong/a are allowed; anything else fails loudly) */
function renderAnswer(html, side, id) {
  const st = styles(side);
  const tags = [...html.matchAll(/<\/?([a-zA-Z][a-zA-Z0-9]*)/g)].map((m) => m[1].toLowerCase());
  const bad = tags.filter((x) => !["p", "ul", "li", "strong", "a"].includes(x));
  if (bad.length) throw new Error(`${id}: disallowed tag(s) in answerHtml: ${[...new Set(bad)].join(", ")}`);
  for (const m of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    if (!/^(\/[a-z0-9-]*\/?(#[a-z0-9-]+)?|https:\/\/(wa\.me|indianvisaonline\.gov\.in)\/[^"]*|mailto:info@kairali\.com|tel:\+919555156156)$/.test(m[1])) throw new Error(`${id}: link not allowed: ${m[1]}`);
  }
  return html
    .replace(/<p>/g, `<p style="${st.p}">`)
    .replace(/<ul>/g, `<ul style="${st.ul}">`)
    .replace(/<li>/g, `<li style="${st.li}">`)
    .replace(/<strong>/g, `<strong style="${st.strong}">`)
    .replace(/\s+/g, " ").trim();
}

const TOPIC_RENAME = { from: "For International Guests", to: "For International Patients", idFrom: "topic-for-international-guests", idTo: "topic-for-international-patients" };
const INTRO_FROM = /Namaste and welcome to Healing Village’s comprehensive FAQ page\. We’ve organized these questions to help you navigate your wellness journey with ease\. If you don’t find what you’re looking for, please contact our guest relations team\./;
const INTRO_TO = "Namaste and welcome to the Healing Village’s FAQ page. The questions are organised by topic to help you plan your treatment. If you don’t find what you’re looking for, please write to the patient care team.";
const CLOSE_FROM = /We hope this comprehensive FAQ serves as a helpful guide to answer your questions and enhance your experience at (<strong[^>]*>Kairali – The Ayurvedic Healing Village<\/strong>)\. If you have any further questions or need personalized assistance, please feel free to contact our friendly team—we’re here to help you on your journey to holistic wellness\./;
const CLOSE_TO = "We hope this FAQ answers your questions about treatment at $1. If you have any further questions or need personal assistance, please contact the patient care team — our physicians are here to help.";

const additions = (CONTENT.additions || []).filter((a) => a.status === "drafted" && a.answerHtml);
const EXISTING = 44;
const TOTAL = EXISTING + additions.length;

function patchTemplate(t, side, label) {
  const did = [];
  // 1. edits
  for (const [id, e] of Object.entries(CONTENT.edits || {})) {
    const n = String(parseInt(id.slice(2), 10));
    const at = t.indexOf(`<details data-q="${n}" id="${id}"`);
    if (at < 0) throw new Error(`${label}: ${id} not found`);
    const [a, b] = elementSpan(t, at);
    let block = t.slice(a, b);
    const h3 = block.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
    if (!h3) throw new Error(`${label}: ${id} has no <h3>`);
    const ansAt = block.indexOf("<div", block.indexOf("</summary>"));
    const [c, d] = elementSpan(block, ansAt);
    const open = block.slice(c, block.indexOf(">", c) + 1);
    const next = block.slice(0, h3.index) + h3[0].replace(h3[1], esc(e.summary)) + block.slice(h3.index + h3[0].length, c) + open + renderAnswer(e.answerHtml, side, id) + "</div>" + block.slice(d);
    if (next !== block) { t = t.slice(0, a) + next + t.slice(b); did.push(id); }
  }
  // renames FIRST (F27, F35) so the additions and the topic creation see the final labels on every run
  if (t.includes(TOPIC_RENAME.from)) { t = t.split(TOPIC_RENAME.from).join(TOPIC_RENAME.to).split(TOPIC_RENAME.idFrom).join(TOPIC_RENAME.idTo); did.push("topic renamed"); }
  if (t.includes("Treatments &amp; Programs") || t.includes('data-label="Treatments & Programs"')) { t = t.split("Treatments &amp; Programs").join("Treatments &amp; Programmes").split('data-label="Treatments & Programs"').join('data-label="Treatments & Programmes"'); did.push("programmes spelling"); }
  // 2. additions (appended to the end of their topic section; ids q-45… in file order)
  const summaryTpl = t.match(/<details data-q="1" id="q-01"[^>]*>\s*(<summary[^>]*>\s*<span[^>]*>\+<\/span>\s*<h3[^>]*>)/);
  if (!summaryTpl) throw new Error(`${label}: q-01 summary shape not found`);
  const detailsOpenStyle = (t.match(/<details data-q="1" id="q-01" style="([^"]*)"/) || [])[1] || "";
  const ansOpen = (t.match(/<details data-q="1" id="q-01"[\s\S]*?<\/summary>\s*(<div style="[^"]*">)/) || [])[1] || "<div>";
  // new topics the writer proposed (e.g. "Consultation & Admission"): cloned from the first section's shell
  // (header div + h2 + count badge, no questions) and the first rail link, placed right after "Why Choose Kairali?"
  const RENAMES = { [TOPIC_RENAME.from]: TOPIC_RENAME.to, "Treatments & Programs": "Treatments & Programmes" };
  const mapTopic = (x) => RENAMES[x] || x;
  for (const topic of [...new Set(additions.map((a) => mapTopic(a.topic)))]) {
    // data-label carries the RAW label ("Treatments & Programs"); headings and rail spans carry the entity form
    const raw = topic, lab = esc(topic);
    if (t.includes(`<section data-group="1" data-label="${raw}"`)) continue;
    const slug = "topic-" + topic.toLowerCase().replace(/&amp;|&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const first = t.match(/<section data-group="1" data-label="([^"]+)" id="(topic-[^"]+)"[^>]*>/);
    if (!first) throw new Error(`${label}: no topic section to clone`);
    const [fa, fb] = elementSpan(t, first.index);
    const shell = t.slice(fa, fb);
    const headEnd = shell.indexOf("<details");
    if (headEnd < 0) throw new Error(`${label}: first section has no questions to delimit its header`);
    const head = shell.slice(0, headEnd).replace(`data-label="${first[1]}"`, `data-label="${raw}"`).replace(`id="${first[2]}"`, `id="${slug}"`).replace(new RegExp(`(<h2[^>]*>)${esc(first[1]).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(</h2>)`), `$1${lab}$2`).replace(/(<span data-count="1"[^>]*>)[^<]*(<\/span>)/, "$10 questions$2");
    if (!head.includes(lab) || !head.includes(raw) || !head.includes(slug)) throw new Error(`${label}: could not derive the ${topic} section header`);
    t = t.slice(0, fb) + "\n\n" + head + "\n      </section>" + t.slice(fb);
    // desktop: <li><a data-rail="1" href="#topic-…">…</a></li> · mobile: a bare <a href="#topic-…">…</a> grid tile
    const rail = t.match(/(<li>\s*)?<a(?: data-rail="1")? href="#topic-[^"]+"[^>]*><span>[^<]*<\/span><span[^>]*>\d+<\/span><\/a>(\s*<\/li>)?/);
    if (!rail) throw new Error(`${label}: rail link shape not found`);
    const li = rail[0].replace(/href="#topic-[^"]+"/, `href="#${slug}"`).replace(/<span>[^<]*<\/span>/, `<span>${lab}</span>`).replace(/(<span[^>]*>)\d+(<\/span>\s*<\/a>)/, "$10$2");
    if (li === rail[0] || !li.includes(slug) || !li.includes(lab)) throw new Error(`${label}: could not derive the ${topic} rail link`);
    t = t.slice(0, rail.index + rail[0].length) + "\n            " + li + t.slice(rail.index + rail[0].length);
    did.push(`topic "${topic}" created`);
  }
  let added = 0;
  additions.forEach((add, i) => {
    const n = EXISTING + 1 + i, id = "q-" + String(n).padStart(2, "0");
    if (t.includes(`id="${id}"`)) return; // already applied
    const topic = mapTopic(add.topic);
    const secRe = new RegExp(`<section data-group="1" data-label="${topic.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`);
    const sm = t.match(secRe) || t.match(new RegExp(`<section data-group="1" data-label="${add.topic.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`));
    if (!sm) throw new Error(`${label}: topic section not found for addition ${add.n}: ${add.topic}`);
    const [sa, sb] = elementSpan(t, sm.index);
    const sec = t.slice(sa, sb);
    const lastDetails = sec.lastIndexOf("</details>");
    // an empty (newly created) topic has no </details> yet: append before the section's own close tag
    const lastClose = lastDetails >= 0 ? lastDetails + "</details>".length : sec.lastIndexOf("</section>");
    const block = `\n        <details data-q="${n}" id="${id}" style="${detailsOpenStyle}">\n          ${summaryTpl[1]}${esc(add.summary)}</h3>\n          </summary>\n          ${ansOpen}${renderAnswer(add.answerHtml, side, id)}</div>\n        </details>`;
    t = t.slice(0, sa) + sec.slice(0, lastClose) + block + sec.slice(lastClose) + t.slice(sb);
    added += 1;
  });
  if (added) did.push(`+${added} questions`);
  // 3. register: topic rename + intro/closing
  // (topic renames ran above, before the additions)
  if (INTRO_FROM.test(t)) { t = t.replace(INTRO_FROM, INTRO_TO); did.push("intro"); }
  if (CLOSE_FROM.test(t)) { t = t.replace(CLOSE_FROM, CLOSE_TO); did.push("closing"); }
  // 4. counts
  const secs = [...t.matchAll(/<section data-group="1" data-label="([^"]+)" id="(topic-[^"]+)"[^>]*>/g)];
  const counts = {};
  for (const s of secs) { const [a, b] = elementSpan(t, s.index); counts[s[2]] = (t.slice(a, b).match(/<details data-q=/g) || []).length; }
  let before = t;
  for (const s of secs) {
    const [a, b] = elementSpan(t, t.indexOf(s[0]));
    const sec = t.slice(a, b).replace(/(<span data-count="1"[^>]*>)\d+ questions?(<\/span>)/, `$1${counts[s[2]]} question${counts[s[2]] === 1 ? "" : "s"}$2`);
    t = t.slice(0, a) + sec + t.slice(b);
    t = t.replace(new RegExp(`(<a(?: data-rail="1")? href="#${s[2]}"[^>]*><span>[^<]*</span><span[^>]*>)\\d+(</span>)`), `$1${counts[s[2]]}$2`);
  }
  t = t.replace(/\b44 questions\b/g, `${TOTAL} questions`);
  if (t !== before) did.push("counts");
  return { t, did, counts };
}

const problems = [];
let touched = 0;
for (const side of ["desktop", "mobile"]) {
  const id = `ahv-page-faqs-and-downloads-${side}`;
  const file = join(VIEWS, id + ".json");
  const view = JSON.parse(readFileSync(file, "utf8"));
  const { t, did, counts } = patchTemplate(view.template, side, id);
  const changed = t !== view.template;
  if (changed) { touched += 1; if (!DRY) { view.template = t; writeFileSync(file, JSON.stringify(view) + "\n"); } }
  console.log(`${changed ? (DRY ? "[dry] " : "fixed  ") : "as-is  "}${id}${did.length ? "  (" + did.join(", ") + ")" : ""}`);
  // postconditions on the served view
  const ids = [...t.matchAll(/<details data-q="(\d+)" id="(q-\d+)"/g)].map((m) => m[2]);
  if (ids.length !== TOTAL) problems.push(`${id}: ${ids.length} questions, expected ${TOTAL}`);
  if (new Set(ids).size !== ids.length) problems.push(`${id}: duplicate question ids`);
  for (let k = 1; k <= TOTAL; k++) if (!ids.includes("q-" + String(k).padStart(2, "0"))) problems.push(`${id}: missing q-${String(k).padStart(2, "0")}`);
  for (const [k, v] of Object.entries(counts)) if (!v) problems.push(`${id}: topic ${k} has no questions`);
  const secIds = [...t.matchAll(/<section data-group="1" data-label="[^"]+" id="(topic-[^"]+)"/g)].map((m) => m[1]);
  if (new Set(secIds).size !== secIds.length) problems.push(`${id}: duplicate topic sections: ${secIds.filter((x, i) => secIds.indexOf(x) !== i).join(", ")}`);
  const sum = Object.values(counts).reduce((x, y) => x + y, 0);
  if (sum !== TOTAL) problems.push(`${id}: topic counts sum ${sum} ≠ ${TOTAL}`);
  const faqStart = t.indexOf('<section data-group="1"'), faqEnd = t.lastIndexOf("</details>");
  const text = strip(t.slice(faqStart, faqEnd)) + " " + strip((t.match(/<p[^>]*>Namaste[\s\S]*?<\/p>/) || [""])[0]) + " " + strip((t.match(/<p[^>]*>We hope[\s\S]*?<\/p>/) || [""])[0]);
  const hits = [...text.matchAll(new RegExp(BANNED.source, "gi"))].map((m) => m[0]);
  if (hits.length) problems.push(`${id}: banned word(s) in the FAQ text: ${[...new Set(hits.map((h) => h.toLowerCase()))].join(", ")} (${hits.length})`);
  const comp = text.match(new RegExp(COMPETITORS.source, "g"));
  if (comp) problems.push(`${id}: competitor name(s) survive: ${[...new Set(comp)].join(", ")}`);
  if (/international-guests|International Guests/.test(t)) problems.push(`${id}: the old topic name survives`);
  // the overlay component, same patch inside <x-dc>
  const oc = join(OVERLAY, `AHV Page FAQs and Downloads ${side === "desktop" ? "Desktop" : "Mobile"}.dc.html`);
  const src = readFileSync(oc, "utf8");
  const open = src.indexOf("<x-dc>"), close = src.lastIndexOf("</x-dc>");
  if (open < 0 || close < 0) { problems.push(`${basename(oc)}: no <x-dc>`); continue; }
  const inner = src.slice(open + 6, close);
  const { t: inner2, did: odid } = patchTemplate(inner, side, basename(oc));
  const out = src.slice(0, open + 6) + inner2 + src.slice(close);
  if (out !== src) { touched += 1; if (!DRY) writeFileSync(oc, out); }
  console.log(`${out !== src ? (DRY ? "[dry] " : "fixed  ") : "as-is  "}${basename(oc)}${odid.length ? "  (" + odid.join(", ") + ")" : ""}`);
  if ((inner2.match(/<details data-q=/g) || []).length !== TOTAL) problems.push(`${basename(oc)}: question count ≠ ${TOTAL}`);
}
console.log(`\nrepair-faq-content${DRY ? " (dry)" : ""}: ${touched} file(s) changed · ${Object.keys(CONTENT.edits || {}).length} edits · ${additions.length} additions applied · ${(CONTENT.additions || []).length - additions.length} additions withheld (no recorded fact) · total ${TOTAL} questions`);
if (problems.length) { console.error("POSTCONDITION FAILURES:\n  " + problems.join("\n  ")); process.exit(1); }
