// Train J batch 1 (15 Oct 2026; AHV-M021.02, duration part). The retired /training-programs/ finder filtered the five
// Ayurveda courses by length; the survivor /ayurveda-training-programme/ (owner-approved combined intro + filter
// structure, Sentinel_21f32e4f) lists them with no filter. The legacy finder's duration control is ported verbatim:
// its group label "Duration", its chip list [Any, Up to 7 nights, 10 nights, 14 nights, 20 nights, 21+ nights] with the
// same rule (a chip shows only when a course matches it, so Any / Up to 7 nights / 10 nights / 20 nights), its chip
// styling and aria-pressed state. Every label is an existing frozen unit with 12 accepted translations. The courses
// run 1, 3, 5, 10 or 20 nights (the page's tariff note). The legacy budget and currency controls are NOT ported here
// (receipt: the legacy budget rule excluded these per-night-priced courses, and the page's only prices are the
// static C-37 tariff tables) — that part is recorded for an owner decision.
//   node tools/repair-training-duration-filter-train-j1-20261015.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
export const VIEWS = { mobile: "public/ahv/views/ahv-page-ayurveda-training-programme-mobile.json", desktop: "public/ahv/views/ahv-page-ayurveda-training-programme-desktop.json" };
export const SNAPSHOT = "english-candidate/prerender/ayurveda-training-programme.html";
export const DURATIONS = [["", "Any"], ["7", "Up to 7 nights"], ["10", "10 nights"], ["14", "14 nights"], ["20", "20 nights"], ["21", "21+ nights"]];
const CHIP = (pad, size) => `font-family:'Mulish',sans-serif;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;box-sizing:border-box;padding:0 ${pad}px;border-radius:4px;font-weight:700;font-size:${size}px;white-space:nowrap;flex:none;min-height:44px;font-size:15px;`;
const GROUP = (v) => `<div role="group" aria-label="Duration" data-ahv-course-duration="" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:0 0 ${v === "mobile" ? 18 : 22}px"><span style="font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#8F6212;flex:none">Duration</span>\n    <sc-for list="{{ durations }}" as="c" hint-placeholder-count="4"><button type="button" onClick="{{ c.pick }}" aria-pressed="{{ c.on }}" style="${CHIP(v === "mobile" ? 16 : 18, v === "mobile" ? 15.5 : 16)}border:1.5px solid {{ c.bd }};background:{{ c.bg }};color:{{ c.fg }}">{{ c.label }}</button></sc-for>\n  </div>\n  `;
const ANCHOR = { mobile: '<ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:16px">\n    <sc-for list="{{ courses }}"', desktop: '<div style="background:#FFFDF7;border:1px solid #E9E2D3;border-top:3px solid #C1882C;border-radius:4px;overflow-x:auto">\n    <table' };
const COURSES_BEFORE = "courses: D.courses.map(c => ({ ...c, href: A + c.href, duration: c.days + (c.days === 1 ? ' day' : ' days'), hours: c.hours + ' hours' })),";
const COURSES_AFTER = "durations: DURATIONS.filter(pair => !pair[0] || D.courses.some(c => fits(c.days, pair[0]))).map(pair => Object.assign({ label: pair[1], pick: () => this.setState({ dur: pair[0] }) }, sel(dur === pair[0]))),\n      courses: D.courses.filter(c => fits(c.days, dur)).map(c => ({ ...c, href: A + c.href, duration: c.days + (c.days === 1 ? ' day' : ' days'), hours: c.hours + ' hours' })),";
const HELPERS = "    // AHV-M021.02: the retired /training-programs/ finder's duration chips, same labels and rule (course length in nights).\n" +
  `    const DURATIONS = ${JSON.stringify(DURATIONS).replace(/"/g, "'")};\n` +
  "    const dur = (this.state && this.state.dur) || '';\n" +
  "    const fits = (n, k) => !k || (k === '7' ? n <= 7 : k === '21' ? n >= 21 : n === Number(k));\n" +
  "    const sel = (on) => ({ on: on ? 'true' : 'false', bg: on ? '#5A4420' : '#fff', fg: on ? '#F7F4EA' : '#2A2118', bd: on ? '#5A4420' : '#C9BFA8' });\n";
const RV = "    const A = 'https://ayurvedichealingvillage.com';\n";
export function applyView(v, text) {
  const d = JSON.parse(text);
  if (d.template.includes("data-ahv-course-duration")) return text;
  if (d.template.split(ANCHOR[v]).length !== 2) throw new Error(v + ": course list anchor");
  d.template = d.template.replace(ANCHOR[v], GROUP(v) + ANCHOR[v]);
  if (d.logic.split(COURSES_BEFORE).length !== 2 || d.logic.split(RV).length !== 2) throw new Error(v + ": logic anchors");
  d.logic = d.logic.replace(RV, RV + HELPERS).replace(COURSES_BEFORE, COURSES_AFTER);
  if (v === "desktop") d.logic = d.logic.replace("class Component extends DCLogic {\n", "class Component extends DCLogic {\n  state = { dur: '' };\n");
  else d.logic = d.logic.replace("state = { barOn: false };", "state = { barOn: false, dur: '' };");
  return JSON.stringify(d, null, 2) + "\n";
}
// The English phone snapshot: the same group in its first-paint state (Any pressed, all five courses listed).
const SNAP_ANCHOR = '<ul data-dc-tpl="82" style="list-style: none; margin: 0px; padding: 0px; display: flex; flex-direction: column; gap: 16px;">';
const SNAP_CHIP = "font-family: Mulish, sans-serif; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; box-sizing: border-box; padding: 0px 16px; border-radius: 4px; font-weight: 700; white-space: nowrap; flex: none; min-height: 44px; font-size: 15px; ";
const snapChip = (label, on) => `<button type="button" aria-pressed="${on}" style="${SNAP_CHIP}border: 1.5px solid ${on ? "rgb(90, 68, 32)" : "rgb(201, 191, 168)"}; background: ${on ? "rgb(90, 68, 32)" : "rgb(255, 255, 255)"}; color: ${on ? "rgb(247, 244, 234)" : "rgb(42, 33, 24)"};">${label}</button>`;
export const SNAP_GROUP = `<div role="group" aria-label="Duration" data-ahv-course-duration="" style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin: 0px 0px 18px;"><span style="font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: rgb(143, 98, 18); flex: none;">Duration</span>` +
  ["Any", "Up to 7 nights", "10 nights", "20 nights"].map((l, i) => snapChip(l, i === 0)).join("") + "</div>\n  ";
export function applySnapshot(html) {
  if (html.includes("data-ahv-course-duration")) return html;
  if (html.split(SNAP_ANCHOR).length !== 2) throw new Error("snapshot course list anchor");
  return html.replace(SNAP_ANCHOR, SNAP_GROUP + SNAP_ANCHOR);
}
if (process.argv[1]?.endsWith("repair-training-duration-filter-train-j1-20261015.mjs")) {
  const changed = [];
  for (const [v, f] of Object.entries(VIEWS)) {
    const s = fs.readFileSync(f, "utf8");
    if (JSON.stringify(JSON.parse(s), null, 2) + "\n" !== s) throw new Error(f + ": does not round-trip");
    const n = applyView(v, s); if (n !== s) { changed.push(f); if (!CHECK) fs.writeFileSync(f, n); }
  }
  const h = fs.readFileSync(SNAPSHOT, "utf8"), hn = applySnapshot(h);
  if (hn !== h) { changed.push(SNAPSHOT); if (!CHECK) fs.writeFileSync(SNAPSHOT, hn); }
  console.log((CHECK ? "[check] " : "") + `${changed.length} file(s) changed` + (changed.length ? ": " + changed.join(" ") : ""));
  if (CHECK && changed.length) process.exitCode = 1;
}
