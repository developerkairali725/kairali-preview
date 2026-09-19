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
const RENDERED_ALT = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/image-alt-map.json"), "utf8")).alt;

/**
 * The map is keyed on the src the BROWSER ends up showing. Two things break a
 * naive lookup against the payload, and both were measured, not guessed:
 *
 *  1. ALIASES. boot.ts rewrites some srcs at runtime from
 *     english-candidate/image-aliases.json, so the payload says
 *     ".../travel/5b42479….jpg" while the page shows ".../wx-pathway.jpg" and
 *     the map is keyed on the latter. 2 occurrences.
 *  2. A SECOND SHAPE. Reader families do not write {"src":…,"alt":…}; they write
 *     {"kind":"image","file":"/ahv/assets/img/…","placement":"hero","alt":""}.
 *     This tool only ever looked at "src", so it was blind to all of them.
 *     38 occurrences across 5 datasets.
 *
 * MAP is therefore keyed by the PAYLOAD src — alias sources folded in — and both
 * key names are searched below. Nothing else about the contract changes: an alt
 * is written only where it is currently EMPTY, and existing words are never
 * overwritten.
 *
 * Deliberately NOT used: the `preparedAltPrivate` field sitting beside 16 of
 * these. It is named private, its provenance is the design tool rather than
 * someone who looked at the image, and where both exist the map's text is the
 * fuller one ("A therapist pouring warm herbal powder over a patient during an
 * Udwarthanam treatment" against "Ayurvedic herbal powder treatment").
 */
const ALIASES = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/image-aliases.json"), "utf8"));
const MAP = { ...RENDERED_ALT };
for (const [payloadSrc, renderedSrc] of Object.entries(ALIASES)) {
  if (RENDERED_ALT[renderedSrc] && !MAP[payloadSrc]) MAP[payloadSrc] = RENDERED_ALT[renderedSrc];
}
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
    for (const key of ["src", "file"]) {
      // The window used to be [^}]{0,400}, which stops at the FIRST closing
      // brace — so an entry carrying a nested object, e.g.
      // "placement":{"type":"hero"}, hid its own "alt":"" from this tool. The
      // guard is now "do not cross into ANOTHER image": braces are allowed,
      // a second src/file key is not.
      const within = '(?:(?!"(?:src|file)":)[\\s\\S]){0,400}?';
      out = out.replace(new RegExp('("' + key + '":"' + s + '"' + within + '"alt":)""', "g"), '$1"' + a + '"');
      out = out.replace(new RegExp('("alt":)""(' + within + '"' + key + '":"' + s + '")', "g"), '$1"' + a + '"$2');
    }
    // Count the alt fields this pass actually FILLED, not every occurrence of
    // the text in the file: the old form re-counted alts that were already
    // written and reported 63 where the true number was 37. A tool that
    // over-reports its own work is a tool you cannot verify with.
    if (out !== before) {
      unseen.delete(src);
      const emptyBefore = (before.match(/"alt":""/g) || []).length;
      const emptyAfter = (out.match(/"alt":""/g) || []).length;
      n += emptyBefore - emptyAfter;
    }
  }
  if (n && !DRY) fs.writeFileSync(file, out);
  if (n) { files++; dataFields += n; }
}

console.log(`${DRY ? "[dry] " : ""}alt written: ${interpolated} award images now use their own title, ${imgTags} literal <img> tags, ${dataFields} dataset fields, across ${files} files`);
console.log(`map entries never matched (image not present, or its alt was already written): ${unseen.size}`);
