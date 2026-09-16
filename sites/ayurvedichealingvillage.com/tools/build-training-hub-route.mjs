/**
 * AHV Ayurveda training hub — the hub layout on the URL Google rates.
 *
 * Derives ahv-page-ayurveda-training-programme-{desktop,mobile} from the
 * approved hub pair (ahv-page-ayurveda-training-programs-*) with the head
 * rewritten for /ayurveda-training-programme/, and points the approved pair's
 * canonical and og:url at the hub so /ayurveda-training-programs/ serves the
 * same page as a canonicalised twin (no redirect, no 404). Pair with
 * tools/repair-route-manifest.mjs, which mounts the derived views on the
 * route. Idempotent; every anchor must match exactly once.
 *
 * Usage: node tools/build-training-hub-route.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VIEWS = path.join(SITE, "public/ahv/views");
const DRY = process.argv.includes("--dry");
const HUB = "https://ayurvedichealingvillage.com/ayurveda-training-programme/";
const TWIN = "https://ayurvedichealingvillage.com/ayurveda-training-programs/";
const rx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function once(text, find, repl, label) {
  const re = find instanceof RegExp ? find : new RegExp(rx(find));
  const n = (text.match(new RegExp(re.source, "g" + re.flags.replace("g", ""))) || []).length;
  if (n !== 1) throw new Error(`${label}: expected exactly one match, found ${n}`);
  return text.replace(re, repl);
}
const pointAtHub = (t, label) => {
  t = once(t, /<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${HUB}">`, label + " canonical");
  t = once(t, /<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${HUB}">`, label + " og:url");
  return t;
};
for (const v of ["desktop", "mobile"]) {
  const srcFile = path.join(VIEWS, `ahv-page-ayurveda-training-programs-${v}.json`);
  const src = JSON.parse(fs.readFileSync(srcFile, "utf8"));
  // The twin keeps its page and canonicalises to the hub.
  if (!src.template.includes(`href="${HUB}"`)) {
    src.template = pointAtHub(src.template, `twin ${v}`);
    if (!DRY) fs.writeFileSync(srcFile, JSON.stringify(src, null, 1) + "\n");
    console.log(`${v}: twin canonical -> hub`);
  } else console.log(`${v}: twin already canonicalised`);
  // The hub view is the same page under its own id.
  const hub = JSON.parse(JSON.stringify(src));
  hub.id = `ahv-page-ayurveda-training-programme-${v}`;
  hub.derivedFrom = src.id;
  hub.derivedRoute = "/ayurveda-training-programme/";
  if (!DRY) fs.writeFileSync(path.join(VIEWS, hub.id + ".json"), JSON.stringify(hub, null, 1) + "\n");
  console.log(`${DRY ? "[dry] " : ""}wrote ${hub.id}`);
}
console.log(`twin ${TWIN} -> canonical ${HUB}`);
