// TF-18 (owner decision 28 Sep 2026, OWNER-DECISIONS-LATEST.md "Owner-approved programme enquiry preselection"):
// treatment programme enquiry buttons open the enquiry form with their context preselected in the EXISTING select.
// The form offers one matching existing option — "Planning a treatment programme" — so the treatment buttons
// (the TF-08 "Enquire About (My) Treatment…" anchors to /enquiry-form/) carry ?programme=treatment;
// public/design/chrome.js does the preselection. Generic enquiry links stay unselected. Training buttons get
// nothing: the form has no training option, and adding one changes the lead form (Deepu's integration) — flagged.
// Campaign/landing views are excluded (owner rule). Only the template line of each view changes. Idempotent.
//   node tools/repair-enquiry-preselect-tf18.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
const dir = "public/ahv/views/";
const ser = (obj, raw) => (raw.startsWith("{\n  ") ? JSON.stringify(obj, null, 2) : raw.startsWith("{\n") ? JSON.stringify(obj, null, 1) : raw.startsWith('{"id": ') ? null : JSON.stringify(obj)) ;
let links = 0, files = 0; const skipped = [];
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json") && !x.startsWith("ahv-page-campaign"))) {
  const raw = fs.readFileSync(dir + f, "utf8"); const json = JSON.parse(raw); const t = json.template || "";
  const next = t.replace(/(<a\b[^>]*href=")((?:https:\/\/ayurvedichealingvillage\.com)?\/enquiry-form\/)("[^>]*>Enquire About (?:My )?Treatment\b[^<]*<\/a>)/g, (m, a, href, rest) => { links++; return a + href + "?programme=treatment" + rest; });
  if (next === t) continue;
  json.template = next; const out = ser(json, raw);
  if (out === null) { skipped.push(f); continue; } // python-style serialisation: leave for a byte-safe writer
  files++; if (!CHECK) fs.writeFileSync(dir + f, out + (raw.endsWith("\n") ? "\n" : ""));
}
console.log(`${CHECK ? "would tag" : "tagged"} ${links} treatment enquiry link(s) in ${files} view(s)` + (skipped.length ? `; SKIPPED (serialisation): ${skipped.join(", ")}` : ""));
