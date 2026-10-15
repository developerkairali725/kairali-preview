// Train J batch 1 (15 Oct 2026; AHV-I04.M054/M056/M059/M065.links). Ports the reviewed contextual-resources lists of
// queued batch 8 (ac09c15d7, only ever on codex/ahv-queued-batch8-20261014) and adds the same Ayurveda list to
// /learn-about-ayurveda/ (M056; the Train E06 reviewer found its only body link pointed at yoga training).
// Labels and destinations are reused verbatim from sibling articles (frozen English units, 12 accepted translations
// each); no new copy. Two corrections against ac09c15d7:
//   - /what-is-yoga/ 'Yoga programmes' opens /yoga-meditation-programs/ (the Train G rework retarget; /yoga-retreats/ is
//     a 301 source);
//   - reader25b and reader6c render 'contextual-resources' as a <section> (reader25b already on the Train G head,
//     reader6c here), so section-nav.js's retired-sidebar sweep (nav[data-source-component] /context|menu|navigation/)
//     never removes it.
// Existing article components are untouched; the list is appended last. Idempotent; byte-exact round trip.
//   node tools/repair-contextual-links-train-j1-20261015.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
const link = (href, label) => ({ tree: [{ k: "e", tag: "a", attrs: { href }, c: [{ k: "t", v: label }] }], text: label });
export const resources = (items) => ({
  component: "contextual-resources",
  blocks: [
    { kind: "heading", tag: "h2", tree: [{ k: "t", v: "Explore related resources" }], text: "Explore related resources" },
    { kind: "list", ordered: false, items: items.map(([href, label]) => link(href, label)) },
  ],
});
const AYURVEDA = [
  ["/ayurvedic-treatments/", "Ayurvedic treatment programmes"],
  ["/panchakarma-therapy/", "Panchakarma treatment programme"],
  ["/online-consultation/", "Speak with an Ayurvedic physician"],
];
// The English mobile snapshot (english-candidate/prerender/<slug>.html) is what the server sends; it receives the same
// section markup the reader renderers emit (as on /yoga-retreats-for-everyone/), right after the last body section and
// with that view's own data-dc-tpl.
const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const S = { section: "width: min(1220px, 94%); margin: 0px auto; padding: 14px 0px; min-width: 0px;", h2: "font-family: Marcellus, serif; font-weight: 400; line-height: 1.22; margin: 26px 0px 10px; font-size: clamp(24px, 2.4vw, 32px);", ul: "margin: 0px 0px 16px; padding-left: 24px; display: flex; flex-direction: column; gap: 8px; max-width: 76ch; list-style-type: disc;", li: "font-size: 17.5px; line-height: 1.75; text-wrap: pretty;", a: "text-underline-offset: 2px; overflow-wrap: anywhere;" };
export const snapshotSection = (tpl, items) => `<section data-dc-tpl="${tpl}" data-source-component="contextual-resources" style="${S.section}"><h2 style="${S.h2}">Explore related resources</h2><ul data-list-depth="0" style="${S.ul}">` + items.map(([href, label]) => `<li style="${S.li}"><a href="${href}" data-source-href="${href}" style="${S.a}">${esc(label)}</a></li>`).join("") + `</ul></section>`;
export function addSnapshotSection(html, items) {
  if (html.includes('data-source-component="contextual-resources"')) return html;
  const opens = [...html.matchAll(/<section data-dc-tpl="(\d+)" data-source-component="[^"]+"[^>]*>/g)];
  if (!opens.length) throw new Error("no body sections in snapshot");
  const last = opens.at(-1), end = html.indexOf("</section>", last.index);
  if (end < 0 || html.slice(last.index + last[0].length, end).includes("<section")) throw new Error("unexpected nested section");
  const at = end + "</section>".length;
  return html.slice(0, at) + "\n      " + snapshotSection(last[1], items) + html.slice(at);
}
export const snapshotFile = (route) => "english-candidate/prerender/" + route.replace(/^\/+|\/+$/g, "") + ".html";
export const PLAN = [
  ["AHV-I04.M054.links", "public/ahv/assets/seven-informational-data.js", "/ayurveda-treatment/", AYURVEDA],
  ["AHV-I04.M056.links", "public/ahv/assets/reader6c-family-data.js", "/learn-about-ayurveda/", AYURVEDA],
  ["AHV-I04.M059.links", "public/ahv/assets/reader25b-family-data.js", "/meditation/", [
    ["/yoga-classes-theory/", "Yoga theory at Kairali"],
    ["/yoga-classes-practical/", "Practical yoga classes"],
    ["/yoga-meditation-training/", "Yoga and meditation programme"],
  ]],
  ["AHV-I04.M065.links", "public/ahv/assets/reader25a-family-data.js", "/what-is-yoga/", [
    ["/yoga-meditation-programs/", "Yoga programmes"],
    ["/yoga-classes-practical/", "Practical yoga classes"],
    ["/yoga-classes-theory/", "Yoga theory"],
  ]],
];
if (process.argv[1]?.endsWith("repair-contextual-links-train-j1-20261015.mjs")) {
  const changed = [];
  for (const [, file, route, items] of PLAN) {
    const s = fs.readFileSync(file, "utf8");
    const i = s.indexOf("{"), j = s.lastIndexOf("}");
    const pre = s.slice(0, i), post = s.slice(j + 1), D = JSON.parse(s.slice(i, j + 1));
    if (pre + JSON.stringify(D) + post !== s) throw new Error(file + ": dataset does not round-trip");
    const r = D.routes.find((x) => x.path === route);
    if (!r) throw new Error(file + ": missing " + route);
    const want = resources(items);
    const at = r.components.findIndex((c) => c.component === "contextual-resources");
    if (at >= 0) {
      if (JSON.stringify(r.components[at]) !== JSON.stringify(want)) throw new Error(route + ": differing contextual-resources already present");
      continue;
    }
    r.components.push(want);
    changed.push(route);
    if (!CHECK) fs.writeFileSync(file, pre + JSON.stringify(D) + post);
  }
  for (const [, , route, items] of PLAN) {
    const f = snapshotFile(route), html = fs.readFileSync(f, "utf8"), next = addSnapshotSection(html, items);
    if (next !== html) { changed.push(f); if (!CHECK) fs.writeFileSync(f, next); }
  }
  console.log((CHECK ? "[check] " : "") + `${changed.length} contextual-resources component(s) added` + (changed.length ? ": " + changed.join(" ") : ""));
  if (CHECK && changed.length) process.exitCode = 1;
}
