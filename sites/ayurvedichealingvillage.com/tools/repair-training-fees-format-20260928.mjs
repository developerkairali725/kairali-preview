// /training-course-fees/ — owner fact 28 Sep 2026 (deliverable OWNER-DECISIONS-LATEST.md, "Latest owner correction —
// … flexible training dates"): "these are all one on one classes or … the students can come in groups there are no
// fixed dates yet". Plus the owner wording standard (same file): no customer-visible TO CONFIRM chips, source/
// transcription notes or template scaffolding.
//   · Schedule column/cell "TO CONFIRM" → "Arranged on enquiry".
//   · The three scaffold sections of the design template (Course structure / Daily schedule / Eligibility — every
//     item "List item poured from the record" or "Session — time [TO CONFIRM]") → ONE real section stating the
//     owner fact. No hours, dates, cohorts, eligibility rules or documents invented.
//   · Source/transcription notes go; the validity window and every fee, duration and code stay unchanged.
// Exact-count assertions, all-or-nothing write, logic compile check (repo-owned view logic, as in
// test/view-logic-compiles.test.mjs), idempotent.
//   node tools/repair-training-fees-format-20260928.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
const FACT = "Classes are one-to-one or for groups. There are no fixed course dates: dates and session times are agreed with you when you enquire.";
const NOTE = "There is no separate course fee: tuition is included in the nightly rate, charged per villa and occupancy. " + FACT;
const log = [], pending = []; let bad = 0;
// replace every match of `re` (global) via `fn`, asserting the match count
const sub = (s, re, fn, label, want = 1) => { const n = (s.match(re) || []).length; if (n !== want) { bad++; console.error(`FAIL ${label}: expected ${want}, found ${n}`); return s; } log.push(label); return s.replace(re, fn); };
const P = `<p(?: style="[^"]*")?>`;
for (const v of ["desktop", "mobile"]) {
  const file = `public/ahv/views/ahv-template-course-and-fees-${v}.json`;
  const raw = fs.readFileSync(file, "utf8"); const view = JSON.parse(raw);
  if (view.logic.includes("const FORMAT_SECTIONS")) { log.push(`${v}: already applied`); continue; }
  let t = view.template, L = view.logic;
  t = sub(t, /(<span style="[^"]*">)TO CONFIRM(<\/span>)/g, (_, a, b) => a + "Arranged on enquiry" + b, `${v}: schedule chip → Arranged on enquiry`);
  t = sub(t, new RegExp(`(${P})The rate sheet prices per night by villa and occupancy and prints no separate course fee: tuition is inside the nightly rate\\. Daily timetables are not held in the record, so the schedule (?:column|row) stays <span(?: style="[^"]*")?>\\[TO CONFIRM\\]</span>\\.(</p>)`, "g"), (_, a, b) => a + NOTE + b, `${v}: schedule note → owner fact`);
  t = sub(t, / The rate sheet prints no separate course fee\.<\/p>/g, () => "</p>", `${v}: 'rate sheet' sentence dropped from the fees intro`);
  t = sub(t, new RegExp(`(${P})Source: KTAHV Ayurveda Training Courses V2, Ref KAHR/AY-TRG/2026-2027/04/GBL, (?:with effect from 1 October 2026 to 30 September 2027\\. Figures are shown exactly as held; no totals are calculated here|w\\.e\\.f\\. 1 Oct 2026 to 30 Sep 2027\\. No totals are calculated here)\\.(</p>)`, "g"), (_, a, b) => a + "Rates valid 1 October 2026 to 30 September 2027." + b, `${v}: source line → validity only`);
  t = sub(t, /Training programmes — KAHR\/AY-TRG\/2026-2027\/04\/GBL/g, () => "Training programmes", `${v}: table caption without the internal reference`);
  t = sub(t, new RegExp(`\\s*${P}Transcribed from the KTAHV Ayurveda Training Courses V2 rate sheet and independently confirmed by the marketing team\\.</p>`, "g"), () => "", `${v}: transcription note removed`);
  L = sub(L, /const SECTIONS = \[/g, () => `const FORMAT_SECTIONS = [\n  { h2: 'Class format and dates', body: '${FACT}', groups: [] }\n];\n\nconst SECTIONS = [`, `${v}: FORMAT_SECTIONS added`);
  L = sub(L, /sections: (?:sections|short \? SECTIONS\.slice\(0, 1\) : \(long \? SECTIONS : SECTIONS\.slice\(0, 3\)\))/g, () => "sections: FORMAT_SECTIONS", `${v}: page renders FORMAT_SECTIONS, not the scaffold`);
  if (v === "mobile") L = sub(L, /\{ label: 'Schedule', value: '', confirm: true \}/g, () => "{ label: 'Schedule', value: 'Arranged on enquiry', confirm: false }", "mobile: Schedule cell value");
  try { new Function("DCLogic", "StreamableLogic", "React", L + "\n;return 1;"); } catch (e) { bad++; console.error(`FAIL ${v} logic does not compile: ${e.message}`); }
  view.template = t; view.logic = L; pending.push([file, view, raw]);
}
if (bad) { console.error(`${bad} failure(s) — nothing written`); process.exit(1); }
const ser = (view, raw) => (raw.startsWith("{\n") ? JSON.stringify(view, null, 1) : JSON.stringify(view)) + (raw.endsWith("\n") ? "\n" : ""); // keep the file's own serialisation
if (!CHECK) for (const [file, view, raw] of pending) fs.writeFileSync(file, ser(view, raw));
console.log((CHECK ? "[check] " : "") + log.join("\n"));
