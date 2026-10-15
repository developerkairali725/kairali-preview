// Train J batch 2 (15 Oct 2026) on the Train I head 00e944e44. Source only: no build, deploy, form submission or lead.
// Exact deltas: fixtures/train-j2-20261015.json.
//   AHV-N08.*.heading  reviewed article outline: every heading a reviewed correction retags is marked
//                      data-ahv-outline-from=<source tag> and article-reader.css styles it as that source tag, so the
//                      page looks the same; refinements for /new-to-yoga/, /ayurveda-workshop/, /yoga-retreats-for-everyone/.
//   AHV-M087.01 / AHV-M090.01  past-retreat '<name> | Past Retreat | Kairali Healing Village' titles and the page's own
//                      approved past-retreat line as the description (locale titles composed from accepted strings).
//   AHV-N08.sleep-restoration-therapy.title  brand punctuation only.
//   AHV-STAFF15.review / AHV-N08.about-us.title  'About Kairali – NABH-Accredited Ayurvedic Hospital in Kerala'.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import zlib from "node:zlib";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { unitId } from "../tools/l10n/lib.mjs";
import { LOCALES } from "../tools/l10n/locales.mjs";
import { articleContactHeadingHtml, repairArticleContactHeading } from "../app/(english)/_families/article-contact-heading.mjs";
import { articleOutlineSourcesHtml, articleHeadingOutlineHtml, repairArticleOutline } from "../app/(english)/_families/article-heading-outline.mjs";
import { TRAIN_J2, reverseTrainJ2Source, peelTrainJ2Source } from "./fixtures/train-j2-20261015.mjs";
// Train J integration: a file another Train J batch also edited is read as Train J2 left it (fixtures/train-j-integration-20261015.mjs).
import { peelTrainJ1UnderJ2 } from "./fixtures/train-j-integration-20261015.mjs";
import { peelTrainNTail } from "./fixtures/train-n-integration-20261015.mjs";

const SITE = fileURLToPath(new URL("../", import.meta.url));
const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(read(p));
const sha = (s) => createHash("sha256").update(s).digest("hex");
const BASE = "00e944e4440c4b1710bffc29cc7c2bea8b385fdc";
const LOCS = Object.keys(LOCALES).filter((l) => l !== "en");
const ALL = ["en", ...LOCS];
const MARK = "data-ahv-outline-from";

// ── the recorded delta ───────────────────────────────────────────────────────────────────────────────────────────────
test("every Train J2 file reverses exactly to the Train I head bytes (git 00e944e44); the head passes through; a third state fails", () => {
  assert.equal(TRAIN_J2.base, BASE);
  assert.equal(Object.keys(TRAIN_J2.files).length, 13);
  for (const [p, e] of Object.entries(TRAIN_J2.files)) {
    const now = peelTrainJ1UnderJ2(p, peelTrainNTail(p, read(p)));
    assert.equal(sha(now), e.afterSHA256, `${p}: current bytes are Train J2's`);
    const head = reverseTrainJ2Source(p, now);
    assert.equal(sha(head), e.beforeSHA256, p);
    assert.equal(reverseTrainJ2Source(p, head), head, `${p}: head bytes pass through`);
    assert.equal(peelTrainJ2Source(p, head), head, `${p}: peel passes the head through`);
    assert.throws(() => reverseTrainJ2Source(p, now + " "), undefined, `${p}: any third state fails`);
    // Shallow CI checkouts lack 00e944e44; as in the J1, I and H tests, provenance is checked whenever history exists
    // (every local run), and the reversal to beforeSHA256 above is asserted everywhere.
    let base = null;
    try { base = execFileSync("git", ["show", `${BASE}:sites/ayurvedichealingvillage.com/${p}`], { cwd: SITE, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1 << 27 }); } catch {}
    if (base !== null) assert.equal(sha(base), e.beforeSHA256, `${p}: beforeSHA256 is the Train I head`);
    for (const r of e.replacements) assert.match(r.row, /AHV-|locale titles/, p);
  }
});

// ── AHV-N08 heading rows: outline ────────────────────────────────────────────────────────────────────────────────────
const snapshot = (route, locale) => {
  const name = route.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9._-]+/gi, "_") + ".html";
  const file = locale === "en" ? "english-candidate/prerender/" + name : `l10n/prerender/${locale}/${name}.gz`;
  if (!fs.existsSync(new URL(`../${file}`, import.meta.url))) return null;
  const raw = fs.readFileSync(new URL(`../${file}`, import.meta.url));
  return (file.endsWith(".gz") ? zlib.gunzipSync(raw) : raw).toString();
};
// The server pipeline exactly as design-view.tsx composes it.
const serve = (html, route) => articleHeadingOutlineHtml(articleContactHeadingHtml(articleOutlineSourcesHtml(html, route), route), route);
const levels = (html) => [...html.matchAll(/<h([1-6])\b/g)].map((m) => m[1]).join("");

const REFINED = {
  "/new-to-yoga/": "1222333332222",
  "/ayurveda-workshop/": "123322",
  "/yoga-retreats-for-everyone/": "122233333222222",
};
for (const [route, expected] of Object.entries(REFINED)) test(`${route}: reviewed outline in every locale, one H1, no skipped level, marked source tags`, () => {
  for (const locale of ALL) {
    const html = snapshot(route, locale);
    const out = serve(html, route);
    assert.equal(levels(out), expected, locale);
    assert.equal(serve(out, route), out, `${locale}: idempotent`);
    // only tag names and the marker change; every retagged element is marked with its ORIGINAL tag
    const orig = new Map([...html.matchAll(/<(h[1-6])\b([^>]*\bdata-source-pointer="([^"]+)"[^>]*)>/g)].map((m) => [m[3], m[1]]));
    let retagged = 0;
    for (const m of out.matchAll(/<(h[1-6]|p)\b([^>]*\bdata-source-pointer="([^"]+)"[^>]*)>/g)) {
      const was = orig.get(m[3]); if (!was) continue;
      const mark = /data-ahv-outline-from="(h[2-4])"/.exec(m[2]);
      if (was !== m[1]) { retagged++; assert.ok(mark, `${locale} ${m[3]} retagged without a marker`); }
      if (mark) assert.equal(mark[1], was, `${locale} ${m[3]} marker names the source tag`);
    }
    assert.ok(retagged > 0, locale);
    const strip = (s) => s.replace(/ data-ahv-outline-from="h[2-4]"/g, "").replace(/<(\/?)(?:h[1-6]|p)\b/g, "<$1x");
    assert.equal(strip(out), strip(html), `${locale}: no attribute, text or child changes`);
    if (route !== "/new-to-yoga/") {
      const h1 = /<h1\b[^>]*>([\s\S]*?)<\/h1>/.exec(out)[1].replace(/<[^>]+>/g, "").trim();
      const p0 = /<p data-source-pointer="\/sections\/3\/c\/3\/c\/0"[^>]*>([\s\S]*?)<\/p>/.exec(out)[1].replace(/<[^>]+>/g, "").trim();
      assert.equal(p0, h1, `${locale}: the de-headed paragraph is exactly the duplicated title`);
    }
  }
});

test("every reviewed level correction (article-contact-heading.mjs) is marked with its source tag in every locale snapshot", () => {
  const routes = ["/why-get-training-in-ayurveda/", "/why-pick-a-yoga-or-yoga-retreat/", "/meditation/", "/new-to-ayurveda/", "/new-to-yoga/", "/yoga-retreats-for-everyone/", "/ayurveda-workshop/", "/karkidaka-chikitsha-or-monsoon-wellness.html", "/what-is-yoga/", "/yoga-classes-practical/", "/yoga-classes-theory/", "/ayurveda-treatment/"];
  for (const route of routes) {
    const [from, to] = repairArticleContactHeading(null, route);
    for (const locale of ALL) {
      const html = snapshot(route, locale) ?? (route.endsWith(".html") ? snapshot(route + ".html", locale) : null);
      if (!html) continue;
      const marked = articleOutlineSourcesHtml(html, route);
      const fixed = articleContactHeadingHtml(marked, route);
      // marking adds only the attribute; the level correction itself is unchanged
      assert.equal(marked.replace(/ data-ahv-outline-from="h[2-4]"/g, ""), html, `${route} ${locale}`);
      assert.equal(articleContactHeadingHtml(html, route), fixed.replace(/ data-ahv-outline-from="h[2-4]"/g, ""), `${route} ${locale}`);
      const changed = levels(fixed).split("").filter((l, i) => l !== levels(html)[i]).length;
      const markedCount = (fixed.match(new RegExp(`<${to}\\b[^>]*${MARK}="${from}"`, "g")) || []).length;
      assert.equal(markedCount, changed, `${route} ${locale}: every retagged heading, and only those, is marked`);
    }
  }
  for (const route of ["/", "/about-us/", "/packages/"]) assert.equal(articleOutlineSourcesHtml("<h4>x</h4><h2>y</h2>", route), "<h4>x</h4><h2>y</h2>", route);
});

// Minimal DOM: the serialized live wrapper must produce exactly the server pipeline's tags and markers.
function fakeRoot(html) {
  const children = [];
  const doc = { createElement: (tag) => element(tag, []) };
  function element(tag, attributes) {
    return { tagName: tag.toUpperCase(), ownerDocument: doc, kids: [], attributes,
      hasAttribute(name) { return this.attributes.some((a) => a.name === name); },
      setAttribute(name, value) { const f = this.attributes.find((a) => a.name === name); if (f) f.value = value; else this.attributes.push({ name, value }); },
      getAttribute(name) { return this.attributes.find((a) => a.name === name)?.value ?? null; },
      get firstChild() { return this.kids[0] || null; },
      appendChild(child) { if (child.parent) child.parent.kids.splice(child.parent.kids.indexOf(child), 1); child.parent = this; this.kids.push(child); },
      replaceWith(next) { children[children.indexOf(this)] = next; } };
  }
  for (const m of html.matchAll(/<(h[1-6]|p)\b([^>]*)>/g)) {
    if (m[1] === "p" && !m[2].includes("data-source-pointer")) continue;
    const node = element(m[1], [...m[2].matchAll(/([a-z-]+)="([^"]*)"/g)].map((a) => ({ name: a[1], value: a[2] })));
    node.appendChild({ text: "child" });
    children.push(node);
  }
  const matches = (node, selector) => selector.split(",").some((part) => {
    const s = /^(h[1-6])(?:\[data-source-pointer="([^"]+)"\])?$/.exec(part);
    assert.ok(s, "unexpected selector " + part);
    return node.tagName === s[1].toUpperCase() && (!s[2] || node.getAttribute("data-source-pointer") === s[2]);
  });
  return { children, root: { querySelectorAll: (selector) => children.filter((n) => matches(n, selector)) } };
}
test("the serialized live outline wrapper matches the server pipeline (tags and markers) in every locale", () => {
  const run = vm.runInNewContext("(" + repairArticleOutline.toString() + ")");
  const contact = vm.runInNewContext("(" + repairArticleContactHeading.toString() + ")");
  for (const route of [...Object.keys(REFINED), "/meditation/", "/why-pick-a-yoga-or-yoga-retreat/", "/karkidaka-chikitsha-or-monsoon-wellness.html"]) for (const locale of ALL) {
    const html = snapshot(route, locale);
    if (!html) continue;
    const dom = fakeRoot(html);
    run(dom.root, route, contact);
    run(dom.root, route, contact); // repeated mutation deliveries are idempotent
    const server = serve(html, route);
    const want = [...server.matchAll(/<(h[1-6]|p)\b([^>]*)>/g)].filter((m) => m[1] !== "p" || m[2].includes("data-source-pointer")).map((m) => m[1] + (/data-ahv-outline-from="(h\d)"/.exec(m[2])?.[1] ?? ""));
    assert.deepEqual(dom.children.map((n) => n.tagName.toLowerCase() + (n.getAttribute(MARK) ?? "")), want, `${route} ${locale}`);
    run(dom.root, "/unrelated/", contact);
  }
  assert.equal(repairArticleOutline(null, "/unrelated/"), undefined);
});

test("server and live wiring: design-view marks, corrects, then refines; boot injects the wrapper around the unchanged correction", () => {
  const view = read("app/(english)/_families/design-view.tsx");
  assert.match(view, /articleHeadingOutlineHtml\(articleContactHeadingHtml\(articleOutlineSourcesHtml\(applyReviewSnapshot\(/);
  const boot = read("app/(english)/_families/boot.ts");
  for (const v of ["host", "node"]) assert.equal(boot.split(`(\${repairArticleOutline.toString()})(${v}, cfg.path, (\${repairArticleContactHeading.toString()}));`).length - 1, 1, v);
  assert.equal(boot.split("${repairArticleContactHeading.toString()}").length - 1, 2, "the correction is still injected exactly twice");
});

// ── the look is unchanged: article-reader.css matches marked headings as their source tag ───────────────────────────
test("article-reader.css and consistency.css only gain zero-specificity source-tag guards; reversing them gives the head bytes", () => {
  const AS = (tag) => tag === "p" ? `p:where(:not([${MARK}]))` : `:is(h2,h3,h4,p):where(${tag}:not([${MARK}]),[${MARK}="${tag}"])`;
  for (const file of ["public/design/article-reader.css", "public/design/consistency.css"]) {
    let text = peelTrainNTail(file, read(file));
    for (const tag of ["h2", "h3", "h4", "p"]) text = text.split(AS(tag)).join(tag);
    text = text.replace(/\/\* Reviewed outline corrections \(N08; Train J batch 2[\s\S]*?\*\/\n/, "");
    assert.equal(sha(text), TRAIN_J2.files[file].beforeSHA256, file);
    assert.ok(!text.includes(MARK), file);
  }
  const css = read("public/design/article-reader.css");
  // the family's heading, prose and >=1180px grid rules all recognise the marker
  for (const s of ['[data-ahv-family="article-reader"] main ' + AS("h2") + " {", '[data-ahv-family="article-reader"] main ' + AS("h3") + " {", '[data-ahv-family="article-reader"] main ' + AS("p") + " { margin:0 0 20px !important; }", "section:has(> " + AS("p") + "):not(:has(h1)):has(> :is(" + AS("h2") + "," + AS("h3") + "))"])
    assert.ok(css.includes(s), s);
  assert.match(read("public/design/consistency.css"), /#ahv-design-root\[data-ahv-consistency="1"\] main p:where\(:not\(\[data-ahv-outline-from\]\)\),/);
});

// ── metadata rows ────────────────────────────────────────────────────────────────────────────────────────────────────
const SRC = new Map(json("l10n/source/units.json").units.map((u) => [u.id, u]));
const catalogs = new Map();
function catalog(loc) {
  if (catalogs.has(loc)) return catalogs.get(loc);
  const cat = new Map();
  const pre = new URL(`../l10n/prefill/${loc}.json`, import.meta.url);
  if (fs.existsSync(pre)) for (const [id, v] of Object.entries(JSON.parse(fs.readFileSync(pre, "utf8")))) cat.set(id, v.text);
  const dir = new URL(`../l10n/output/${loc}/`, import.meta.url);
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json")).sort()) {
    for (const u of JSON.parse(fs.readFileSync(new URL(f, dir), "utf8")).units) {
      const src = SRC.get(u.id);
      if (src && src.sourceHash === u.sourceHash && u.status === "translated" && typeof u.text === "string") cat.set(u.id, u.text);
    }
  }
  const ovr = new URL(`../l10n/overrides/${loc}.json`, import.meta.url);
  if (fs.existsSync(ovr)) for (const [id, v] of Object.entries(JSON.parse(fs.readFileSync(ovr, "utf8")))) if (SRC.get(id)?.sourceHash === v.sourceHash) cat.set(id, v.text);
  for (const f of ["catalogue-locales.json", "information-locales.json", "release-visible-locales.json"]) {
    for (const u of json(`english-candidate/${f}`).units) if (u.translations[loc]) cat.set(unitId(u.source), u.translations[loc]);
  }
  catalogs.set(loc, cat);
  return cat;
}
const tr = (source, loc) => catalog(loc).get(unitId(source));
const untranslated = (source) => LOCS.filter((loc) => typeof tr(source, loc) !== "string" || !tr(source, loc).trim());
// Accepted strings only, read from the Train I head (no Train J2 entries): the compositions below must be rebuilt from them.
const headInfo = JSON.parse(reverseTrainJ2Source("english-candidate/information-locales.json", read("english-candidate/information-locales.json")));
const acceptedTr = (source, loc) => { const u = headInfo.units.find((x) => x.source === source); if (u?.translations[loc]) return u.translations[loc]; const id = unitId(source); for (const f of ["catalogue-locales.json", "release-visible-locales.json"]) { const v = json(`english-candidate/${f}`).units.find((x) => x.source === source); if (v?.translations[loc]) return v.translations[loc]; } const c = catalog(loc); return c.get(id); };
const manifest = () => new Map(json("english-candidate/route-manifest.json").routes.map((r) => [r.path, r.metadata]));

const L18 = { title: "Lakshya Yoga Retreat 2018 | Past Retreat | Kairali Healing Village", description: "This page preserves the Lakshya Yoga Retreat 2018 material. Its programme, schedule and inclusions are historical and are not current booking terms." };
const MR = { title: "Mindfulness Retreat | Past Retreat | Kairali Healing Village", description: "This is a past retreat. The original description and speaker biographies below are retained as a historical record and are not a current offer. There are no current dates or bookings for this retreat." };
const SLEEP = "Sleep Restoration Therapy | Kairali – The Ayurvedic Healing Village";
const ABOUT = "About Kairali – NABH-Accredited Ayurvedic Hospital in Kerala";

test("AHV-M087.01 / AHV-M090.01: accepted past-retreat title pattern and the page's own approved past-retreat line", () => {
  const m = manifest();
  assert.equal(m.get("/lakshya-yoga/").title, "Lakshya Yoga | Past Retreat | Kairali Healing Village", "the accepted pattern");
  for (const [route, want, ogTitle] of [["/lakshya-yoga-retreat-2018/", L18, "Lakshya Yoga Retreat 2018"], ["/mindfulness-retreat/", MR, "Mindfulness Retreat"]]) {
    const md = m.get(route);
    assert.equal(md.title, want.title, route);
    assert.equal(md.description, want.description, route);
    assert.equal(md.ogDescription, want.description, route);
    assert.equal(md.ogTitle, ogTitle, `${route}: og title unchanged`);
    assert.deepEqual(untranslated(want.title), [], `${route}: 12 locale titles`);
    assert.deepEqual(untranslated(want.description), [], `${route}: 12 accepted description translations`);
  }
  // the descriptions are the pages' own approved labels, already on the page
  assert.equal(read("public/ahv/assets/hist9-family-data.js").split(L18.description).length - 1, 3, "label + metadata description + og description");
  assert.ok(read("public/ahv/assets/hist9-family-data.js").includes(`"title":"${L18.title}"`));
  assert.ok(read("public/ahv/assets/mindfulness-retreat-data.js").includes(MR.description), "the mindfulness page's own label");
  for (const v of ["desktop", "mobile"]) {
    const t = read(`public/ahv/views/ahv-page-mindfulness-retreat-${v}.json`);
    assert.equal(t.split(MR.title).length - 1, 2, `${v}: <title> and JSON-LD name`);
    assert.ok(!t.includes("Mindfulness Retreat in Kerala | Kairali Healing Village"), v);
    assert.ok(!t.includes("A five-day Mindfulness Retreat at Kairali"), v);
  }
  for (const f of ["english-candidate/route-manifest.json", "public/ahv/assets/hist9-family-data.js"]) {
    assert.ok(!read(f).includes("Lakshya Yoga Retreat 2018 | Ayurveda & Yoga Retreat in Kerala"), f);
    assert.ok(!read(f).includes("Rejuvenate at the Lakshya Yoga Retreat 2018"), f);
  }
  // every locale title is the accepted name + the accepted /lakshya-yoga/ title's own 2nd and 3rd segments
  for (const loc of LOCS) {
    const seg = acceptedTr("Lakshya Yoga | Past Retreat | Kairali Healing Village", loc).split(" | ");
    assert.equal(seg.length, 3, loc);
    assert.equal(tr(L18.title, loc), [acceptedTr("Lakshya Yoga Retreat 2018", loc), seg[1], seg[2]].join(" | "), loc);
    assert.equal(tr(MR.title, loc), [acceptedTr("Mindfulness Retreat", loc), seg[1], seg[2]].join(" | "), loc);
  }
});

test("AHV-N08.sleep-restoration-therapy.title: brand punctuation only, English and every locale", () => {
  const OLD = "Sleep Restoration Therapy at Kairali The Ayurvedic Healing Village";
  assert.equal(manifest().get("/sleep-restoration-therapy/").title, SLEEP);
  for (const v of ["desktop", "mobile"]) {
    const t = read(`public/ahv/views/ahv-page-sleep-restoration-${v}.json`);
    assert.equal(t.split(SLEEP).length - 1, 2, v);
    assert.ok(!t.includes(OLD), v);
  }
  for (const loc of LOCS) {
    const was = acceptedTr(OLD, loc), now = tr(SLEEP, loc);
    assert.equal(typeof was, "string", loc);
    assert.equal(now, was.replace("Kairali The Ayurvedic Healing Village", "Kairali – The Ayurvedic Healing Village"), loc);
  }
});

test("AHV-STAFF15.review / AHV-N08.about-us.title: the page is named; the NABH fact is the approved description's; locales use reviewed strings", () => {
  const md = manifest().get("/about-us/");
  assert.equal(md.title, ABOUT);
  assert.equal(ABOUT.length, 60);
  assert.match(md.description, /an NABH-accredited Ayurvedic hospital in Palakkad, Kerala/, "the approved description already states the fact");
  assert.equal(md.ogTitle, "About Us");
  assert.ok(read("public/ahv/assets/about-us-data.js").includes(`"metadata":{"title":"${ABOUT}"`));
  // the brand string itself is unchanged everywhere else
  assert.ok(read("public/ahv/assets/enquiry-family-data.js").includes('"title":"Kairali - The Ayurvedic Healing Village"'));
  for (const loc of LOCS) assert.equal(tr(ABOUT, loc), acceptedTr("About Us", loc) + " | " + acceptedTr("Kairali - The Ayurvedic Healing Village", loc), loc);
});

test("search cards: the two past-retreat descriptions use the index's own clip, every other record is unchanged", () => {
  const clip = (s, n) => { if (s.length <= n) return s; const cut = s.slice(0, n - 1); return cut.slice(0, Math.max(cut.lastIndexOf(" "), 40)) + "…"; };
  const j2 = peelTrainJ1UnderJ2("public/ahv/search-index.json", read("public/ahv/search-index.json"));
  const now = JSON.parse(j2);
  const head = JSON.parse(reverseTrainJ2Source("public/ahv/search-index.json", j2));
  const byPath = (idx) => new Map(idx.pages.map((p) => [p.route, p]));
  const a = byPath(head), b = byPath(now);
  assert.equal(a.size, b.size);
  let changed = 0;
  for (const [k, p] of b) {
    const q = a.get(k);
    if (JSON.stringify(p) === JSON.stringify(q)) continue;
    changed++;
    const want = /lakshya-yoga-retreat-2018/.test(k) ? L18.description : MR.description;
    assert.deepEqual({ ...p, desc: undefined }, { ...q, desc: undefined }, k);
    assert.equal(p.desc, clip(want, 90), k);
    assert.deepEqual(untranslated(p.desc), [], `${k}: clipped snippet in 12 locales`);
  }
  assert.equal(changed, 2);
});
