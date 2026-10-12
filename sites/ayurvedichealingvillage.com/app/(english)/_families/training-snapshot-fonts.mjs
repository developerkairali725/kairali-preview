/** Keep the training snapshot's exact font faces, but defer unused extra subsets.
 * The complete original stylesheet still arrives with the interactive view.
 * Inspect all snapshot characters (including attributes and inline CSS), not just
 * visible text, so hidden menus and generated content retain their glyph coverage.
 * Unrecognised entities or ranges conservatively keep the complete stylesheet.
 */
export const TRAINING_SNAPSHOT_ROUTES = new Set([
  "/ananda-lahari-yoga-and-ayurveda-retreat/",
  "/ashtanga-yoga-and-ayurveda-retreat/",
  "/ayurveda-treatment/", "/mindfulness-retreat/",
  "/all-programs/",
  "/ayurveda-training-programme/",
  "/advanced-ayurveda-lifestyle-consultant-and-therapist-training-program-kerala-aalct-hv/",
  "/intensive-ayurveda-training-program-learn-practice-ayurveda/",
  "/level-one-advance-ayurveda-training-program-for-wellness-professionals-kerala-aatp-1-hv/",
  "/new-to-yoga-teacher-training/",
  "/one-day-ayurveda-workshop-program-kerala/",
  "/three-day-short-term-ayurveda-certificate-program-tap-hv/",
]);
const ENTITIES = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: "\u00a0" };
export function trainingSnapshotFontCss(route, css, snapshot) {
  if (!TRAINING_SNAPSHOT_ROUTES.has(route) || !snapshot) return css;
  let unknown = false;
  const decoded = snapshot.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]+);/gi, (all, entity) => {
    if (entity[0] === "#") {
      const point = entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
      if (point >= 0 && point <= 0x10ffff) return String.fromCodePoint(point);
    } else if (Object.hasOwn(ENTITIES, entity)) return ENTITIES[entity];
    unknown = true; return all;
  });
  if (unknown) return css;
  const points = new Set([...decoded].map(c => c.codePointAt(0)));
  return css.replace(/@font-face\s*\{[^}]*\}/gi, face => {
    if (!/\.extra\.woff2/.test(face)) return face;
    const definition = face.match(/unicode-range\s*:\s*([^;}]+)/i);
    if (!definition) return face;
    const ranges = definition[1].split(",").map(part => part.trim().match(/^U\+([0-9a-f]+)(?:-([0-9a-f]+))?$/i));
    if (ranges.some(range => !range)) return face;
    for (const range of ranges) {
      const low = parseInt(range[1], 16), high = parseInt(range[2] || range[1], 16);
      if (low > high || high > 0x10ffff) return face;
      for (const point of points) if (point >= low && point <= high) return face;
    }
    return "";
  });
}
