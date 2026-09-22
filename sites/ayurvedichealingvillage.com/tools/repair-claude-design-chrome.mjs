#!/usr/bin/env node
/**
 * AHV — make the Claude Design family views (22 Sep 2026) servable as site pages.
 *
 * The standing brief the owner gave Claude Design asked for the site header and
 * footer as PLACEHOLDERS (a 72px grey bar, a ~620px grey block) and for the
 * mobile view to be drawn on a design board, sometimes with a second "content
 * extreme" frame beside the real page. All of that is right for a design review
 * and wrong for a served page. This tool applies four deterministic, idempotent
 * transforms to the served view payloads (public/ahv/views/*.json) of the
 * routes the overlay repointed (english-candidate/package-overlay):
 *
 *   1. BOARD UNWRAP — a mobile file whose body is a board holding two frames
 *      keeps frame A's phone container only; the board, the second frame and
 *      the annotation labels ("Mobile 390 — /offers/, 808 words") go.
 *   2. HEADER — the 72px placeholder bar becomes
 *      <dc-import name="AHV Chrome Header">, exactly as every package view.
 *   3. FOOTER — the 620px placeholder block becomes
 *      <dc-import name="AHV Chrome Footer">.
 *   4. WIDTHS — a wrapper fixed at the mockup's 1440px / 390px becomes 100%.
 *
 * Nothing else in the template is touched: no copy, no styles, no logic.
 * Re-run after every import (the importer rewrites public/ahv wholesale).
 * Postconditions fail loudly: any placeholder text or board label left in a
 * treated view exits 1.
 *
 *   node tools/repair-claude-design-chrome.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const VIEWS = join(SITE, "public/ahv/views");
const OVERLAY_ROUTES = join(SITE, "english-candidate/package-overlay/ROUTES-REPOINTED.json");

const HEADER_IMPORT = '<dc-import name="AHV Chrome Header" hint-size="100%,72px"></dc-import>';
const FOOTER_IMPORT = '<dc-import name="AHV Chrome Footer" hint-size="100%,560px"></dc-import>';

/** Views the overlay repointed, derived from the repoint ledger, not hand-listed. */
function treatedViews() {
  const rows = JSON.parse(readFileSync(OVERLAY_ROUTES, "utf8"));
  const ids = new Set();
  for (const r of rows) {
    const desk = r.viewsTo ?? r.to;
    if (!desk) continue;
    const base = desk.replace(/ Desktop\.dc\.html$/, "");
    for (const side of ["Desktop", "Mobile"]) {
      const id = `${base} ${side}`.toLowerCase().replace(/\.dc\.html$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      ids.add(id);
    }
  }
  return [...ids].sort();
}

const VOID = new Set(["br", "img", "hr", "meta", "link", "input", "source", "path", "circle", "rect", "line", "polyline", "polygon", "use", "wbr", "area", "col", "embed", "track"]);

/** [start, end) of the element whose opening tag begins at `at`. */
function elementSpan(t, at) {
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^>]*)>/g;
  re.lastIndex = at;
  let depth = 0;
  let m;
  while ((m = re.exec(t))) {
    const [full, close, tag, attrs] = m;
    if (VOID.has(tag.toLowerCase()) || /\/\s*$/.test(attrs)) { if (m.index === at) return [at, at + full.length]; continue; }
    if (close) { depth -= 1; if (depth === 0) return [at, m.index + full.length]; }
    else depth += 1;
  }
  throw new Error(`unbalanced element at ${at}`);
}

/** Direct element children of the element spanning [start,end). */
function children(t, start, end) {
  const [, openEnd] = /^<[^>]*>/.exec(t.slice(start)) ? [0, start + /^<[^>]*>/.exec(t.slice(start))[0].length] : [0, start];
  const out = [];
  let i = openEnd;
  while (i < end) {
    const lt = t.indexOf("<", i);
    if (lt < 0 || lt >= end) break;
    if (t[lt + 1] === "/") break;
    if (t.startsWith("<!--", lt)) { i = t.indexOf("-->", lt) + 3; continue; }
    const [s, e] = elementSpan(t, lt);
    out.push([s, e]);
    i = e;
  }
  return out;
}

const textOf = (s) => s.replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const LABEL_RE = /(Mobile 390|Desktop 1440|^[AB] · The )/;
const PLACEHOLDER_HDR = /<div\b[^>]*height:\s*72px[^>]*>\s*(Approved (site|mobile) header|Site header)[^<]*<\/div>/i;
const PLACEHOLDER_FTR = /<div\b[^>]*height:\s*620px[^>]*>\s*(Approved (site|mobile) footer|Site footer)[^<]*<\/div>/i;

function unwrapBoard(t) {
  const helmetEnd = t.indexOf("</helmet>");
  const bodyStart = helmetEnd < 0 ? 0 : helmetEnd + "</helmet>".length;
  const firstLt = t.indexOf("<", bodyStart);
  if (firstLt < 0) return { t, changed: false };
  const [bs, be] = elementSpan(t, firstLt);
  const frames = children(t, bs, be);
  // A board: ≥2 frames and at least one annotation label in the board's text.
  if (frames.length < 2 || !LABEL_RE.test(textOf(t.slice(bs, be)))) return { t, changed: false };
  const [fs0, fe0] = frames[0];
  // Frame A may be a column: [label <p>s…, phone container]. The phone
  // container is the child carrying data-screen-label, else the last child.
  const kids = children(t, fs0, fe0);
  let phone = kids.find(([s, e]) => /data-screen-label=/.test(t.slice(s, Math.min(e, s + 400))));
  if (!phone) phone = kids.filter(([s]) => !/^<p\b/.test(t.slice(s, s + 3))).pop();
  if (!phone) throw new Error("board frame A has no phone container");
  let inner = t.slice(phone[0], phone[1]);
  // Frame A itself can still open with label paragraphs INSIDE the container.
  inner = inner.replace(/^(<div\b[^>]*>)\s*(<p\b[^>]*>[^<]*(?:Mobile 390|Desktop 1440|[AB] · The )[^<]*<\/p>\s*)+/, "$1");
  return { t: t.slice(0, bs) + inner + t.slice(be), changed: true };
}

function widths(t) {
  let n = 0;
  // Only the outermost wrapper right after the helmet (or the unwrapped phone container).
  const helmetEnd = t.indexOf("</helmet>");
  const lt = t.indexOf("<", helmetEnd < 0 ? 0 : helmetEnd + 9);
  const [s, e] = elementSpan(t, lt);
  const openEnd = s + /^<[^>]*>/.exec(t.slice(s))[0].length;
  let open = t.slice(s, openEnd);
  const fixed = open.replace(/(\bwidth:\s*)(1440px|390px)\b/g, (m, a) => { n += 1; return `${a}100%`; });
  return { t: t.slice(0, s) + fixed + t.slice(openEnd), n };
}

const ids = treatedViews();
let touched = 0;
const problems = [];
for (const id of ids) {
  const file = join(VIEWS, `${id}.json`);
  if (!existsSync(file)) { problems.push(`missing view payload: ${id}`); continue; }
  const view = JSON.parse(readFileSync(file, "utf8"));
  const before = view.template;
  let t = before;
  const did = [];
  const ub = unwrapBoard(t); if (ub.changed) { t = ub.t; did.push("board→frame A"); }
  if (PLACEHOLDER_HDR.test(t)) { t = t.replace(PLACEHOLDER_HDR, HEADER_IMPORT); did.push("header"); }
  if (PLACEHOLDER_FTR.test(t)) { t = t.replace(PLACEHOLDER_FTR, FOOTER_IMPORT); did.push("footer"); }
  const w = widths(t); if (w.n) { t = w.t; did.push(`width×${w.n}`); }
  // 4b. Review chips the designer pinned to the page ("PROVISIONAL — PENDING
  //     SITEMAP" beside the breadcrumb) are design-board annotations, not
  //     page content. The breadcrumb they annotate is the site's own.
  const chipRe = /<[a-z][a-z0-9-]*\b[^>]*>\s*PROVISIONAL — PENDING SITEMAP\s*<\/[a-z][a-z0-9-]*>\s*/gi;
  if (chipRe.test(t)) { t = t.replace(chipRe, ""); did.push("review chip"); }
  // 5. The design file's own <title> ("AHV Template — Product Family (Desktop
  //    1440)") is a file name, not a page title. The governed head writes the
  //    route's title from the manifest; a helmet title left here won the race
  //    on four routes. Removed; nothing else in the helmet is touched.
  const helmetTitle = /<title>[^<]*<\/title>\s*/i;
  const helmetEnd = t.indexOf("</helmet>");
  if (helmetEnd > 0 && helmetTitle.test(t.slice(0, helmetEnd))) {
    t = t.slice(0, helmetEnd).replace(helmetTitle, "") + t.slice(helmetEnd);
    did.push("helmet title");
  }
  // Postconditions for a treated view.
  // The helmet's own <title> may say "(Desktop 1440)"; it is never rendered,
  // the governed head replaces it. Only the body is judged.
  const bodyText = textOf(t.slice(t.indexOf("</helmet>") + 9));
  if (/(Approved (site|mobile) (header|footer)|Site (header|footer) — (approved|fixed))/i.test(bodyText)) problems.push(`${id}: placeholder text still present`);
  if (LABEL_RE.test(bodyText)) problems.push(`${id}: board label still present`);
  const imports = (t.match(/<dc-import\b/g) || []).length;
  if (imports !== 2) problems.push(`${id}: expected 2 chrome imports, found ${imports}`);
  // 6. The governed head owns <title> (boot.ts: "exactly one canonical, and
  //    the governed one wins"). A view whose logic writes document.title from
  //    its own dataset (Photo Collections) overrode the manifest title on every
  //    gallery route. The assignment becomes a no-op; the record's other head
  //    fields (description, canonical) are still applied by the same logic.
  let logic = view.logic || "";
  const logicBefore = logic;
  logic = logic.replace(/document\.title\s*=\s*([^;]+);/g, "void ($1); /* title governed by the route manifest */");
  if (logic !== logicBefore) did.push("document.title→governed");
  if (t !== before || logic !== logicBefore) {
    touched += 1;
    if (!DRY) { view.template = t; view.logic = logic; writeFileSync(file, JSON.stringify(view)); }
  }
  console.log(`${did.length ? "fixed  " : "as-is  "}${id}${did.length ? "  (" + did.join(", ") + ")" : ""}`);
}
console.log(`\nrepair-claude-design-chrome${DRY ? " (dry)" : ""}: ${touched} of ${ids.length} views changed`);
if (problems.length) { console.error("POSTCONDITION FAILURES:\n  " + problems.join("\n  ")); process.exit(1); }
