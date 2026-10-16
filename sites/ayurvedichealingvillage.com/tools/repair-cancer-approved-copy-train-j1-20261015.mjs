// Train J batch 1 (15 Oct 2026; AHV-M005.02). Preservation diff of the retired long-URL cancer page
// (/revitalizing-and-strengthening-treatment-for-cancer-patients/: exception-five dataset record and its
// ahv-page-cancer-supportive-care views) against the survivor /revitalizing-and-strengthening/
// (deliverables/.../train-j/batch1/proof/pres-M005.json). Three paragraphs of owner-approved copy (CLINICAL-COPY
// batches 1-3, 2528cb315, under the owner's 28 Sep 2026 authority; each a frozen unit with 12 accepted translations)
// never reached the survivor. They are restored verbatim, as their own paragraphs, after the History section's
// paragraph on both views and the English snapshot. Not restored (recorded in the receipt): the retired package
// inclusions and activity timetable (superseded by the survivor's current tariff inclusions and daily schedule), the
// Abhyangam/Shirodhara/Vaman sentence (the survivor's physician-reviewed step 04 says cleansing procedures are only
// considered with the oncology team), the uncleared "motivator" line, sidebar/chrome links and editor placeholders.
//   node tools/repair-cancer-approved-copy-train-j1-20261015.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
export const RESTORED = [
  "Our holistic approach places comfort, emotional wellbeing and individual care needs at the centre of the experience.",
  "We focus on supporting quality of life through compassionate care that considers physical comfort and emotional wellbeing.",
  "Ayurvedic therapies aim to restore the balance of the doshas in the body.",
];
const LEAD = "Our approach focuses on the person’s overall wellbeing. Any Ayurvedic supportive care should be discussed with the treating oncologist and must not replace or delay prescribed cancer treatment.</p>";
export const VIEWS = ["public/ahv/views/ahv-page-supportive-care-cancer-desktop.json", "public/ahv/views/ahv-page-supportive-care-cancer-mobile.json"];
export const SNAPSHOT = "english-candidate/prerender/revitalizing-and-strengthening.html";
const viewAnchor = LEAD + "\n    <a href=\"https://ayurvedichealingvillage.com/enquiry-form/?programme=treatment\"";
export function applyView(text) {
  const d = JSON.parse(text);
  if (d.template.includes('data-approved-merger="care-approach"')) return text;
  if (d.template.split(viewAnchor).length !== 2) throw new Error("history paragraph not found exactly once");
  const add = RESTORED.map((s) => `\n    <p data-approved-merger="care-approach" style="margin:0 0 18px;max-width:64ch">${s}</p>`).join("");
  d.template = d.template.replace(viewAnchor, LEAD + add + viewAnchor.slice(LEAD.length));
  return JSON.stringify(d, null, 2) + "\n";
}
const snapAnchor = LEAD + "\n    <a data-dc-tpl=\"99\"";
export function applySnapshot(html) {
  if (html.includes('data-approved-merger="care-approach"')) return html;
  if (html.split(snapAnchor).length !== 2) throw new Error("snapshot history paragraph not found exactly once");
  const add = RESTORED.map((s) => `\n    <p data-approved-merger="care-approach" style="margin: 0px 0px 18px; max-width: 64ch;">${s}</p>`).join("");
  return html.replace(snapAnchor, LEAD + add + snapAnchor.slice(LEAD.length));
}
if (process.argv[1]?.endsWith("repair-cancer-approved-copy-train-j1-20261015.mjs")) {
  const changed = [];
  for (const f of VIEWS) {
    const s = fs.readFileSync(f, "utf8");
    if (JSON.stringify(JSON.parse(s), null, 2) + "\n" !== s) throw new Error(f + ": does not round-trip");
    const n = applyView(s); if (n !== s) { changed.push(f); if (!CHECK) fs.writeFileSync(f, n); }
  }
  const h = fs.readFileSync(SNAPSHOT, "utf8"), hn = applySnapshot(h);
  if (hn !== h) { changed.push(SNAPSHOT); if (!CHECK) fs.writeFileSync(SNAPSHOT, hn); }
  console.log((CHECK ? "[check] " : "") + `${changed.length} file(s) changed` + (changed.length ? ": " + changed.join(" ") : ""));
  if (CHECK && changed.length) process.exitCode = 1;
}
