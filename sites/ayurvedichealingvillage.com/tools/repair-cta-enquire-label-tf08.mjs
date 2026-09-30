// TF-08 (team audit, triage group 8; owner 28 Sep 2026: truthful CTA labels need no extra approval). On 23 programme
// pages the button "Book My Treatment…" opens /enquiry-form/ — an enquiry, not a booking. This relabels ONLY anchors
// whose href is the enquiry form, keeping every attribute, the destination and the form itself untouched (Deepu's
// form integration is not affected). Campaign / landing views are excluded by owner rule. Idempotent.
//   node tools/repair-cta-enquire-label-tf08.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
const dir = "public/ahv/views/";
let changed = 0, files = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json") && !x.startsWith("ahv-page-campaign"))) {
  const raw = fs.readFileSync(dir + f, "utf8");
  const json = JSON.parse(raw);
  const t = json.template || "";
  const next = t.replace(/(<a\b[^>]*href="(?:https:\/\/ayurvedichealingvillage\.com)?\/enquiry-form\/"[^>]*>)Book My Treatment( for [^<]+)?(<\/a>)/g, (m, open, suffix, close) => {
    changed++;
    return open + (suffix ? "Enquire About Treatment" + suffix : "Enquire About My Treatment") + close;
  });
  if (next !== t) { files++; json.template = next; if (!CHECK) fs.writeFileSync(dir + f, JSON.stringify(json, null, 2) + (raw.endsWith("\n") ? "\n" : "")); }
}
console.log(`${CHECK ? "would change" : "changed"} ${changed} label(s) in ${files} view(s)`);
if (CHECK && changed) process.exitCode = 1;
