/**
 * AHV — write alt text onto images the approved design ships with none.
 *
 * WHY. Measured across all 252 routes: 3,840 rendered images, 1,785 of them
 * with empty alt. Screen readers announce nothing; Google reads nothing.
 *
 * WHAT IT WILL AND WILL NOT DO. It applies english-candidate/image-alt-map.json
 * and nothing else. That map holds award and certificate badges, whose
 * filenames genuinely name their subject, plus a few written by hand from the
 * image itself. It deliberately does NOT machine-derive the rest: this site's
 * filenames yield "Video", "Doc cons", "Eye2", "AHV About 698image", and alt
 * like that is worse than none - it is read aloud and indexed. Those are
 * listed in image-alt-unresolved.json for a person. Ornament stays empty,
 * which is correct, and is recorded in image-alt-decorative.json.
 *
 * THE BIGGEST WIN NEEDS NO MAP AT ALL. Every award and certificate badge is
 * rendered by <img src="{{ aw.img }}" alt=""> while the very same object
 * carries aw.title - "Travellers' Choice Award 2025" - written by a person
 * and then thrown away by the template. Passing it through is not invention,
 * it is using the caption the page already shows. 124 of these across 62
 * views.
 *
 * WHERE ALT LIVES. Three places, all rewritten here: the interpolated award
 * images above, alt="" inside literal <img> tags in the view templates, and
 * "alt":"" beside "src" in the family datasets. An image is only touched when
 * its alt is currently EMPTY - existing alt is never overwritten.
 *
 * Idempotent. The import rewrites public/ahv wholesale, so this is a tool,
 * not a hand edit.
 *
 * Usage: node tools/repair-image-alt.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MAP = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/image-alt-map.json"), "utf8")).alt;
const DRY = process.argv.includes("--dry");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const jsonEsc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

let files = 0, imgTags = 0, dataFields = 0, interpolated = 0;
const unseen = new Set(Object.keys(MAP));

/** Award badges: hand the template the title the object already carries. */
for (const f of fs.readdirSync(path.join(SITE, "public/ahv/views"))) {
  const file = path.join(SITE, "public/ahv/views", f);
  const raw = fs.readFileSync(file, "utf8");
  let n = 0;
  const out = raw.replace(/<img src=\\"\{\{ ([a-zA-Z_]\w*)\.(img|image|src|icon|photo)\s*\}\}\\" alt=\\"\\"/g, (tag, v, prop) => {
    // Only when the same object really exposes a title in this view.
    if (!new RegExp("\\{\\{ " + v + "\\.title \\}\\}").test(raw)) return tag;
    n++;
    return tag.replace(/alt=\\"\\"$/, 'alt=\\"{{ ' + v + '.title }}\\"');
  });
  if (n && !DRY) fs.writeFileSync(file, out);
  if (n) { files++; interpolated += n; }
}

/** View templates: <img src="X" ... alt=""> — the JSON holds it escaped. */
for (const f of fs.readdirSync(path.join(SITE, "public/ahv/views"))) {
  const file = path.join(SITE, "public/ahv/views", f);
  const raw = fs.readFileSync(file, "utf8");
  let out = raw, n = 0;
  out = out.replace(/<img\b[^>]*?>/g, (tag) => {
    const src = (tag.match(/src=\\"([^"\\]+)\\"/) || [])[1];
    if (!src || !MAP[src]) return tag;
    // Only fill an alt that is empty; never overwrite words someone wrote.
    if (!/alt=\\"\\"/.test(tag)) return tag;
    unseen.delete(src); n++;
    return tag.replace(/alt=\\"\\"/, 'alt=\\"' + jsonEsc(esc(MAP[src])) + '\\"');
  });
  if (n && !DRY) fs.writeFileSync(file, out);
  if (n) { files++; imgTags += n; }
}

/** Datasets: "src":"X" ... "alt":"" in the same object, either order. */
for (const f of fs.readdirSync(path.join(SITE, "public/ahv/assets"))) {
  if (!f.endsWith(".js")) continue;
  const file = path.join(SITE, "public/ahv/assets", f);
  const raw = fs.readFileSync(file, "utf8");
  let out = raw, n = 0;
  for (const [src, alt] of Object.entries(MAP)) {
    const s = src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const a = jsonEsc(alt);
    const before = out;
    out = out.replace(new RegExp('("src":"' + s + '"[^}]{0,400}?"alt":)""', "g"), '$1"' + a + '"');
    out = out.replace(new RegExp('("alt":)""([^}]{0,400}?"src":"' + s + '")', "g"), '$1"' + a + '"$2');
    if (out !== before) { unseen.delete(src); n += (out.match(new RegExp('"' + a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '"', "g")) || []).length; }
  }
  if (n && !DRY) fs.writeFileSync(file, out);
  if (n) { files++; dataFields += n; }
}

console.log(`${DRY ? "[dry] " : ""}alt written: ${interpolated} award images now use their own title, ${imgTags} literal <img> tags, ${dataFields} dataset fields, across ${files} files`);
console.log(`map entries never matched (image not present, or its alt was already written): ${unseen.size}`);
