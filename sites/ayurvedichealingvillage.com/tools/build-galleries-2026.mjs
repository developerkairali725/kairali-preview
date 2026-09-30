/**
 * AHV galleries 2026 — build the eight chaptered galleries from the image-bank
 * candidate register (owner directive D-20260922-31: "galleries: GO — build all
 * 8 per the spec"; spec: docs/research/2026-09-23-ahv-gallery-best-practice.md).
 *
 * WHAT IT DOES, deterministically and idempotently:
 *   1. SELECT — from docs/media/ahv-gallery-candidates-2026-09-23.json, per
 *      gallery, up to the spec's target: candidates already served on the site
 *      sink to the end and are used only to reach a minimum; [TO CONFIRM]
 *      captions are skipped; pixel duplicates are refused by sha256 within a
 *      gallery and across the seven themed galleries. /photo-gallery/ is the
 *      curated best-of and may reuse at most 3 images per sibling route (spec
 *      §6.3), each marked `reusedFrom`; everything else on it is unique.
 *   2. CHAPTER — images fall into named chapters by theme + caption rule;
 *      every chapter carries a 2–3 sentence orientation paragraph written from
 *      the candidates' own catalog descriptions (no fact that is not in a
 *      caption; anything unsure is "[TO CONFIRM]"), and an onward link that is
 *      verified against english-candidate/route-manifest.json.
 *   3. CAPTION + ALT — derived from the catalog description: caption ≤120
 *      chars, alt 8–20 words, unique within the route, no "image of", no
 *      locked word (the KTAHV clinical lock is a hard failure here).
 *   4. IMAGES — library → COPY → sips -Z 1600 → cwebp (and a 768 px variant
 *      for tiles) into public/ahv/assets/img/gallery-2026/<gallery>/<slug>.webp
 *      (gitignored like every runtime binary; deployed from disk). The library
 *      is never written. Descriptive slugs; the sha256 stays in the manifest.
 *   5. VIDEO — only YouTube videos that carry NO compliance flag in the register
 *      and NO locked word in their title; at most one per chapter; self-hosted
 *      poster (fetched once at build time, converted to WebP) so the page makes
 *      zero third-party requests before a play click. uploadDate/duration are
 *      copied from the register where present, never typed.
 *   6. WRITE — english-candidate/galleries-2026.json (the manifest), the
 *      dataset public/ahv/assets/photo-collections-data.js (+ overlay copy),
 *      and the two views (served payloads + overlay .dc.html sources) from
 *      tools/lib/galleries-2026-views.mjs.
 *
 * Postconditions are checked loudly at the end; any failure exits non-zero.
 *
 *   node tools/build-galleries-2026.mjs [--dry] [--skip-images] [--reconvert] [--tmp <dir>]
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { desktopTemplate, mobileTemplate, logic, PROPS } from "./lib/galleries-2026-views.mjs";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPO = path.resolve(SITE, "..", "..");
const arg = (n, d) => { const i = process.argv.indexOf("--" + n); return i > -1 ? process.argv[i + 1] : d; };
const DRY = process.argv.includes("--dry");
const SKIP_IMAGES = process.argv.includes("--skip-images");
const RECONVERT = process.argv.includes("--reconvert");
const TMP = arg("tmp", null);

const CANDIDATES = path.join(REPO, "docs/media/ahv-gallery-candidates-2026-09-23.json");
const ROUTE_MANIFEST = path.join(SITE, "english-candidate/route-manifest.json");
const MANIFEST_OUT = path.join(SITE, "english-candidate/galleries-2026.json");
const DATASET_SERVED = path.join(SITE, "public/ahv/assets/photo-collections-data.js");
const DATASET_OVERLAY = path.join(SITE, "english-candidate/package-overlay/assets/photo-collections-data.js");
const VIEW_SERVED = (v) => path.join(SITE, `public/ahv/views/ahv-template-photo-collections-${v}.json`);
const VIEW_OVERLAY = (v) => path.join(SITE, `english-candidate/package-overlay/AHV Template Photo Collections ${v === "desktop" ? "Desktop" : "Mobile"}.dc.html`);
const IMG_ROOT_URL = "/ahv/assets/img/gallery-2026/";
const IMG_ROOT_DIR = path.join(SITE, "public/ahv/assets/img/gallery-2026");
const SITE_URL = "https://ayurvedichealingvillage.com";
const CREDIT = "Kairali – The Ayurvedic Healing Village";
/** Owner to confirm the exact notice (spec §6.11) — used as-is meanwhile and flagged in the report. */
const COPYRIGHT = "© Kairali Ayurvedic Group";

/** KTAHV clinical lock (CLAUDE.md), word-bounded, every casing. */
const LOCKED = /\b(spa|spas|resort|resorts|holiday|holidays|luxury|luxurious|cure|cures|cured|curing|journey|journeys|guest|guests)\b/i;
const IST = () => {
  const d = new Date(Date.now() + 5.5 * 3600 * 1000);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} IST`;
};
const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
const fail = (m) => { console.error("FAIL: " + m); process.exit(1); };

/* ------------------------------------------------------------------ *
 * 1. Configuration — chapters, intros (from the captions' own facts), links, videos
 * ------------------------------------------------------------------ */

const TREATMENT_THEMES = new Set([
  "Abhyanga", "Shiro Abhyanga", "Udara Abhyanga", "Mukha Abhyanga", "Pizhichil", "Back Udwarthanam", "Leg Udwarthanam", "Udwarthanam",
  "Shirodhara", "Thakaradhara", "Janu Vasti", "Kati Vasti", "Kati & Greeva Vasti", "vasti", "Greeva Pichu", "Shiro Pichu",
  "Pinda Sweda", "kizhi", "steam", "Bashpa Swedana", "Thalapothichil", "Nasyam", "Nasya", "treatment", "therapy-prep", "dhara", "detail",
]);
const OIL = /^(Abhyanga|Shiro Abhyanga|Udara Abhyanga|Mukha Abhyanga|Pizhichil|Back Udwarthanam|Leg Udwarthanam|Udwarthanam)$/;
const DHARA = /^(Shirodhara|Thakaradhara)$/;
const VASTI = /^(Janu Vasti|Kati Vasti|Kati & Greeva Vasti|vasti|Greeva Pichu|Shiro Pichu)$/;
const SWEDA = /^(Pinda Sweda|kizhi|steam|Bashpa Swedana|Thalapothichil|Nasyam|Nasya)$/;
const ROOMS = /^(therapy-prep|dhara|detail|treatment)$/;
const PLACE = new Set(["grounds", "interior", "exterior", "facility", "facility-interior", "reception", "signage", "detail", "pool"]);
/** Register: swimwear/model frames are hospitality imagery, not a hospital gallery. */
const SWIMWEAR = /swimsuit|swimwear|model in|bikini|cover-up/i;

/**
 * Videos that may be embedded: NO compliance flag in the register, NO locked
 * word in the YouTube title (both verified again at build time), and a
 * clinical on-page title/description written ONLY from the title, channel and
 * publication date — never from footage nobody here has watched.
 */
const VIDEOS = {
  JaNra6qVgeM: {
    title: "Inside the hospital campus, Palakkad",
    caption: "Film: inside Kairali – The Ayurvedic Healing Village, Palakkad, Kerala.",
    description: "A walk through the hospital campus at Palakkad, Kerala, published on the Kairali Ayurveda Group channel on 26 May 2026. Press play to load the YouTube player; nothing is requested from YouTube before that.",
  },
  DehKsHYtoJM: {
    title: "The quiet room and therapy area",
    caption: "Film: the quiet room and the therapy area of the treatment block (2023).",
    description: "The quiet room and the therapy area of the treatment block, a 47-second film from 2023 on the Kairali Ayurveda Group channel. Press play to load the YouTube player.",
  },
  h6q1ICxpsS4: {
    title: "A few minutes of yoga",
    caption: "Film: a short yoga film published for International Yoga Day, 22 June 2026.",
    description: "A short yoga film published for International Yoga Day, 22 June 2026, on the Kairali Ayurveda Group channel. Press play to load the YouTube player.",
  },
  P3n1GNHr39A: {
    title: "Meditating amidst flowing water",
    caption: "Film: meditating amidst flowing water (3 min 14 s, 2017).",
    description: "A meditation film of 3 min 14 s published on the Kairali Ayurveda Group channel on 12 October 2017. Press play to load the YouTube player.",
  },
  "Gx-OjZ9fuvg": {
    title: "Onam: pookalam and tradition",
    caption: "Film: the Onam flower carpet (pookalam) and the festival's traditions, 2026.",
    description: "The Onam flower carpet (pookalam) and the festival's traditions, a short film published on 25 August 2026 on the Kairali Ayurveda Group channel. Press play to load the YouTube player.",
  },
  "6SDJDwHktFM": {
    title: "Onam celebration, 2024",
    caption: "Film: Onam celebration 2024 (8 min 10 s).",
    description: "Onam celebrations in 2024, an 8 min 10 s film from the Kairali Ayurveda Group channel. Press play to load the YouTube player.",
  },
};

const ROUTES = [
  {
    path: "/photo-gallery/", dir: "photo", h1: "Photo Gallery", target: 80, chapterCap: 16, chapterMin: 4, master: true, heroFrom: "grounds",
    intro: "Photographs of the hospital, its treatment rooms, villas, yoga hall, kitchen and the countryside around it — made on site and arranged by chapter.",
    chapters: [
      { id: "grounds", title: "The hospital and its grounds", linkTo: "/property-gallery/", linkLabel: "See the full property gallery", video: "JaNra6qVgeM",
        intro: "Kairali – The Ayurvedic Healing Village is a hospital campus of brick-and-stone treatment blocks, patient cottages and lawns threaded by a stone water channel. These photographs show the reception, the covered walkways and the gardens as a patient meets them on arrival.",
        match: (c) => PLACE.has(c.theme) },
      { id: "treatments", title: "Treatment rooms and Panchakarma", linkTo: "/treatments-gallery/", linkLabel: "See the full treatment gallery", video: "DehKsHYtoJM",
        intro: "Treatments are given in brick-walled rooms on carved wooden therapy tables, with warm herbal oils, kizhi boluses and dhara vessels prepared by the therapists. Each caption names the procedure as the treatment record names it.",
        match: (c) => TREATMENT_THEMES.has(c.theme) },
      { id: "villas", title: "Villas and patient rooms", linkTo: "/villas-gallery/", linkLabel: "See the full villas gallery",
        intro: "Patients stay in tiled-roof brick and stone cottages set among the coconut palms, each with its own verandah. The rooms are shown as they are furnished: white linen, red-oxide or terracotta floors and a door opening onto the garden.",
        match: (c) => c.theme === "villa-exterior" || c.theme === "room" },
      { id: "yoga", title: "Yoga and meditation", linkTo: "/yoga-gallery/", linkLabel: "See the full yoga gallery", video: "h6q1ICxpsS4", topUpFrom: "/yoga-gallery/",
        intro: "Yoga sessions take place in the timber-roofed yoga hall, one patient with one instructor. These frames show asana practice with the instructor's guidance.",
        match: (c) => c.theme === "yoga" },
      { id: "cuisine", title: "Ayurvedic cuisine", linkTo: "/ayurvedic-cuisine/", linkLabel: "Read about the Ayurvedic kitchen",
        intro: "Meals are vegetarian and served on wooden trays: red matta rice, sambar, thoran, coconut stew, idiyappam and fresh salads, with pink herbal water.",
        match: (c) => c.theme === "food" || c.theme === "dining" },
      { id: "life", title: "Daily life on the campus", linkTo: "/kairali-the-ayurvedic-healing-village/", linkLabel: "About the hospital", video: "Gx-OjZ9fuvg",
        intro: "These photographs show the traditional welcome in the reception hall, walks on the garden paths and footbridges, the organic kitchen garden and the therapists and staff who run the hospital.",
        match: (c) => c.theme === "people" },
      { id: "around", title: "Around Palakkad", linkTo: "/sight-seeing-gallery/", linkLabel: "See the full sightseeing gallery",
        intro: "The hospital stands among paddy fields and coconut groves in the Palakkad countryside of Kerala. Aerial and ground-level frames show the river, the fields and rice transplanting on the organic farm around the campus.",
        match: (c) => c.theme === "surroundings" },
    ],
  },
  {
    path: "/property-gallery/", dir: "property", h1: "Property Gallery", target: 36, chapterMin: 3, heroFrom: "grounds",
    intro: "The hospital campus at Palakkad: reception, the treatment block and its corridors, the patient cottages, and the gardens and water channels between them.",
    chapters: [
      { id: "dusk", title: "The campus at dusk", linkTo: "/village-facilities/", linkLabel: "Facilities of the hospital",
        intro: "As the light goes, the arched windows of the brick buildings are lit from inside and the courtyard downlights come on. A short chapter of evening frames.",
        match: (c) => /\b(dusk|evening|golden hour|warm-lit)\b/i.test(c.caption) },
      { id: "arrival", title: "Arrival and reception", linkTo: "/how-to-reach/", linkLabel: "How to reach the hospital", video: "JaNra6qVgeM",
        intro: "Patients arrive through the tiled Kerala-style gatehouse and are received in the reception lounge, under a high beamed ceiling with the founders' portraits on the brick walls. The round Kairali emblem and the trophy shelves stand behind the reception desk.",
        match: (c) => c.theme === "reception" || c.theme === "signage" || /\b(gate|gatehouse|entrance)\b/i.test(c.caption) },
      { id: "block", title: "The treatment block and its interiors", linkTo: "/village-facilities/", linkLabel: "Facilities of the hospital",
        intro: "Inside the treatment block, arched wooden doors marked Panchakarma open off a skylit atrium with tiered stone fountains. The consultation room, the in-house pharmacy dispensary, the waiting lounge and the corridors are shown as they are used.",
        match: (c) => ["interior", "facility", "facility-interior", "detail"].includes(c.theme) },
      { id: "grounds", title: "Gardens, water and grounds", linkTo: "/kairali-the-ayurvedic-healing-village/", linkLabel: "About the hospital",
        intro: "A stone-lined water channel winds between the cottages and lawns, crossed by white-railed timber footbridges. Coconut palms, flowering ixora and the lotus pond frame the brick and laterite buildings; the outdoor pool sits inside the tree canopy.",
        match: (c) => ["grounds", "exterior", "pool"].includes(c.theme) },
    ],
  },
  {
    path: "/treatments-gallery/", dir: "treatments", h1: "Treatment Gallery", target: 40, chapterMin: 3, clinical: true, heroFrom: "rooms",
    intro: "Panchakarma and supporting treatments as they are given at the hospital, photographed in the treatment rooms with the therapists at work. Each caption names the procedure.",
    chapters: [
      { id: "rooms", title: "Treatment rooms and preparation", linkTo: "/panchakarma-therapy/", linkLabel: "Read about Panchakarma at Kairali", video: "DehKsHYtoJM",
        intro: "Treatment rooms are brick-walled, with a carved wooden therapy table, a hanging brass dhara vessel and candles. Before a session the therapists prepare the kizhi boluses, herbal pastes and warm oils in brass vessels; a physician's pulse examination and the changing area are also shown.",
        match: (c) => ROOMS.test(c.theme) },
      { id: "oil", title: "Abhyanga and oil therapies", linkTo: "/ayurvedic-treatments/", linkLabel: "Read about the treatments",
        intro: "Abhyanga is the synchronised application of warm herbal oil by two therapists, here along the legs, feet, shoulders and scalp. Pizhichil pours the oil from a brass vessel over the body; Udwarthanam works herbal powder into the skin instead of oil.",
        match: (c) => OIL.test(c.theme) },
      { id: "dhara", title: "Shirodhara and Thakradhara", linkTo: "/ayurvedic-treatments/", linkLabel: "Read about the treatments",
        intro: "In Shirodhara a continuous stream of warm herbal oil falls from a suspended brass vessel onto the forehead; Thakradhara uses medicated buttermilk in the same way. The patient lies on the wooden table with cotton eye pads while a therapist steadies the vessel.",
        match: (c) => DHARA.test(c.theme) },
      { id: "vasti", title: "Vasti and Pichu", linkTo: "/ayurvedic-treatments/", linkLabel: "Read about the treatments",
        intro: "Janu Vasti holds warm medicated oil in a ring of herbal dough sealed around the knee. Greeva Pichu and Shiro Pichu place an oil-soaked cotton pad on the upper spine or the crown and pour warm oil over it from a brass vessel.",
        match: (c) => VASTI.test(c.theme) },
      { id: "sweda", title: "Kizhi, Swedana and Thalapothichil", linkTo: "/ayurvedic-treatments/", linkLabel: "Read about the treatments",
        intro: "Pinda Sweda presses warm herbal boluses (kizhi) over the back, chest and limbs; Bashpa Swedana is herbal steam taken seated in a wooden chamber with only the head outside. In Thalapothichil the scalp is covered with a medicated herbal paste.",
        match: (c) => SWEDA.test(c.theme) },
    ],
  },
  {
    path: "/villas-gallery/", dir: "villas", h1: "Villas Gallery", target: 30, chapterMin: 2, heroFrom: "exteriors",
    intro: "The patient cottages and rooms of the hospital: brick and stone villas with tiled roofs, verandahs and garden-facing doors, photographed as they are furnished.",
    chapters: [
      { id: "exteriors", title: "Villa exteriors", linkTo: "/our-villas/", linkLabel: "Read about the villas",
        intro: "The villas are single cottages of brick, laterite or stone with tiled gabled roofs, arched porches and red-oxide steps, set on lawns beside the water channel. Several carry their room numbers and names at the porch.",
        match: (c) => c.theme === "villa-exterior" },
      { id: "baths", title: "Bathrooms and details", linkTo: "/our-villas/", linkLabel: "Read about the villas",
        intro: "Rainfall showers, stone wash basins and the wall finishes of the patient villas.",
        match: (c) => /\b(bathroom|shower|wash basin|basin)\b/i.test(c.caption) },
      { id: "rooms", title: "Patient rooms", linkTo: "/our-villas/", linkLabel: "Read about the villas",
        intro: "Rooms have wooden beds with white linen, vaulted or terracotta-inlaid ceilings, red-oxide or patterned tile floors and a carved door opening onto a private verandah. Twin and double-bed layouts are both shown.",
        match: (c) => c.theme === "room" },
    ],
  },
  {
    path: "/retreats-gallery/", dir: "retreats", h1: "Retreats Gallery", target: 30, chapterMin: 3, heroFrom: "grounds",
    intro: "Programme life at the hospital: the welcome on admission, consultations, walks on the grounds, the kitchen garden and the dining hall.",
    head: {
      description: "Programme life at Kairali – The Ayurvedic Healing Village in photographs: the welcome on admission, consultations, garden walks and the dining hall.",
    },
    chapters: [
      { id: "welcome", title: "Arrival and welcome", linkTo: "/kairali-the-ayurvedic-healing-village/", linkLabel: "About the hospital", video: "6SDJDwHktFM",
        intro: "On admission a patient is received in the reception hall with the traditional welcome: a kasavu cloth draped over the shoulders, a lamp tray and a forehead mark, and a tender coconut to drink. Staff and therapists greet with a namaste.",
        match: (c) => /\b(welcome|reception hall|kasavu (cloth|wrap)|lamp|namaste|arriving|tender coconut|forehead mark|greeting)\b/i.test(c.caption) },
      { id: "dining", title: "Cuisine and dining hall", linkTo: "/ayurvedic-cuisine/", linkLabel: "Read about the Ayurvedic kitchen",
        intro: "Meals are vegetarian: red matta rice, sambar, thoran, coconut stew, idiyappam, chapatis and fresh salads, with pink herbal water, served on wooden trays in the dining hall.",
        match: (c) => c.theme === "food" || c.theme === "dining" },
      { id: "care", title: "Physicians, therapists and patients", linkTo: "/ayurvedic-treatments/", linkLabel: "Read about the treatments",
        intro: "Physicians in white coats consult with patients on the verandahs; therapists in Kairali aprons walk patients to and from the treatment block and prepare the kizhi boluses. The staff team is photographed together on the garden steps.",
        match: (c) => /\b(physician|therapist|therapists|patient|gown|consultation|staff|uniform|kizhi|incense)\b/i.test(c.caption) },
      { id: "grounds", title: "Walks, garden and rest", linkTo: "/property-gallery/", linkLabel: "See the property gallery",
        intro: "Between treatments patients walk the stone paths and footbridges, rest in the rope hammocks on the lawn and visit the organic kitchen garden with the gardener.",
        match: (c) => c.theme === "people" },
    ],
  },
  {
    path: "/product-gallery/", dir: "product", h1: "Product Gallery", target: 18, chapterMin: 2, heroFrom: "in-treatment",
    intro: "The Kairali Ayurvedic product range as it is used and displayed at the hospital: oils, powders, soaps, lotions and herbal infusions from Kairali Ayurvedic Products Pvt. Ltd.",
    chapters: [
      { id: "in-treatment", title: "Products in the treatment room", linkTo: "/in-house-products/", linkLabel: "In-house products",
        intro: "Kairtis Oil and the kizhi boluses on the droni table while a therapist works, and the range set out on a therapy table beneath a hanging brass dhara vessel.",
        match: (c) => /\b(droni|therapist|treatment table|therapy table|dhara vessel|treatment)\b/i.test(c.caption) },
      { id: "range", title: "The range on display", linkTo: "/product-range/", linkLabel: "The product range",
        intro: "The personal-care range photographed on the garden tables and shelves: Kairtis oil, Kairpack face pack, Kairbal cleansing powder, Kaircin facial oil, Kairkare body oil, Neem and Sandal soaps, lotions, shampoos, Herbal Infusion teas and the gift hampers.",
        match: (c) => c.theme === "product" },
    ],
  },
  {
    path: "/sight-seeing-gallery/", dir: "sightseeing", h1: "Sight Seeing Gallery", target: 36, chapterMin: 2, heroFrom: "air",
    intro: "The countryside around the hospital at Palakkad, Kerala: paddy fields, coconut groves and the river, seen from the air and from the fields. The attractions themselves are described on the attractions pages.",
    chapters: [
      { id: "air", title: "The countryside from the air", linkTo: "/destination-palakkad/", linkLabel: "About Palakkad",
        intro: "Drone frames over the countryside near the hospital: the misty river through the tree canopy, paddy fields bordered by coconut palms, village houses and a rural road.",
        match: (c) => /\b(aerial|top-down)\b/i.test(c.caption) },
      { id: "fields", title: "Rice transplanting on the organic farm", linkTo: "/sightseeing/", linkLabel: "Sightseeing near Kairali",
        intro: "Farm workers transplant rice seedlings in the flooded paddy fields at sunrise, framed by coconut and palmyra palms, on the organic farm around the campus.",
        match: (c) => c.theme === "surroundings" },
    ],
  },
  {
    path: "/yoga-gallery/", dir: "yoga", h1: "Yoga Gallery", target: 24, chapterMin: 2, heroFrom: "hall",
    intro: "The yoga hall and asana practice at the hospital: one patient with one instructor in the timber-roofed hall with clerestory glazing.",
    chapters: [
      { id: "hall", title: "The yoga hall", linkTo: "/yoga-meditation-programs/", linkLabel: "Yoga and meditation programmes", video: "h6q1ICxpsS4",
        intro: "The yoga hall has an exposed timber trussed roof and clerestory glazing, with mats set on the polished floor. Sessions open with a namaste between patient and instructor.",
        match: (c) => /\b(hall with exposed timber|large yoga hall|glass-walled hall|facing each other in namaste)\b/i.test(c.caption) },
      { id: "practice", title: "Asana practice with the instructor", linkTo: "/learn-more-about-yoga/", linkLabel: "Learn more about yoga at Kairali", video: "P3n1GNHr39A",
        intro: "The instructor guides and supports each posture: seated meditation with chin mudra, tree pose, low and crescent lunges, cobra and seated backbends on the teal mats.",
        match: (c) => c.theme === "yoga" },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * 2. Caption / alt / slug derivation
 * ------------------------------------------------------------------ */

const LEAD_STRIP = /^(?:(?:Vertical|Horizontal|Portrait|Landscape|Portrait-orientation|Posed|Alternate|Near-identical|A near-identical|Another|Similar|Same|Close|Closer|Wider)(?:\s+(?:close-up|portrait|view|shot|image|frame|composition|arrangement|product still-life|product shot|product arrangement|detail))?\s+(?:of|frame of)\s+)/i;
const JUNK_CLAUSE = /IMG_\d|edited grade|near-identical|identifiable|faces not shown|face prominent|frame of the same|same patient room|\(KTAHV 2025 shoot\)/i;
const TRAIL_STOP = /\s+(with|and|on|in|of|at|the|a|an|during|beside|by|to|from|for|over|onto|into|as|while|where|or|per)$/i;
const STOP = new Set("a an the of in on with and to at during from for over onto into as while where or by beside two three four eight view close close-up vertical horizontal portrait landscape wide wider closer shot image frame near-identical alternate same another similar aerial top-down overhead detail".split(" "));

function capitalise(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }
function tidy(s) { return s.replace(/\s+/g, " ").replace(/\s+([,;:.])/g, "$1").replace(/[,;:\s]+$/g, "").trim(); }

/** Split "Abhyanga — Vertical close-up of…" into { prefix, body }. */
function splitPrefix(raw, theme) {
  const m = /^([^—]{1,30})\s—\s(.+)$/.exec(raw);
  let prefix = null, body = raw;
  if (m && m[1].trim().split(/\s+/).length <= 3) { prefix = m[1].trim(); body = m[2]; }
  else if (/^[A-Z]/.test(theme) && TREATMENT_THEMES.has(theme) && !new RegExp("\\b" + theme.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i").test(raw)) prefix = theme;
  return { prefix, body };
}

function cleanBody(body) {
  const clauses = body.split(/\s*;\s*/).filter((c) => c && !JUNK_CLAUSE.test(c));
  if (!clauses.length) return "";
  clauses[0] = capitalise(clauses[0].replace(LEAD_STRIP, ""));
  return clauses.map(tidy).filter(Boolean).join("; ");
}

/** Strip dangling function words at the end, repeatedly ("…poured from a steel vessel into" → "…poured from a steel vessel"). */
function untrail(s) {
  let prev;
  do { prev = s; s = tidy(s.replace(TRAIL_STOP, "").replace(/[;,:—-]$/, "")); } while (s !== prev);
  return s;
}

function cutChars(text, max) {
  if (text.length <= max) return text;
  const clauses = text.split("; ");
  let out = "";
  for (const c of clauses) {
    const next = out ? out + "; " + c : c;
    if (next.length > max) break;
    out = next;
  }
  if (!out) {
    // The first clause alone is too long: cut at the strongest natural boundary that keeps ≥45% of the budget.
    const head = text.slice(0, max);
    const boundaries = [", ", " — ", " while ", " with ", " and ", " beside ", " during ", " on ", " in ", " at ", " of "];
    let cutAt = -1;
    for (const b of boundaries) { const i = head.lastIndexOf(b); if (i > max * 0.45) { cutAt = i; break; } }
    out = cutAt > 0 ? head.slice(0, cutAt) : head.slice(0, head.lastIndexOf(" "));
  }
  return untrail(out);
}

function cutWords(text, max) {
  const words = text.split(/\s+/);
  if (words.length <= max) return tidy(text);
  // Prefer a clause boundary inside the limit.
  let best = null;
  for (let n = max; n >= Math.min(8, max); n--) {
    const cand = words.slice(0, n).join(" ");
    if (/[;,]$/.test(cand)) { best = cand; break; }
  }
  const out = (best || words.slice(0, max).join(" ")).replace(/[;,]$/, "");
  return untrail(out);
}

/** Words that keep their capital after "Treatment: …" (everything else is a common noun and drops to lower case). */
const PROPER = /^(Kairali|Kairtis|Kairpack|Kairbal|Kaircin|Kairkare|Kair|Kerala|Ayurvedic|Ayurveda|Anu|Shirodhara|Thakradhara|Thakaradhara|Janu|Kati|Greeva|Shiro|Udara|Mukha|Pizhichil|Abhyanga|Pinda|Sweda|Swedana|Bashpa|Thalapothichil|Nasyam|Udwarthanam|Kizhi|Vasti|Pichu|Panchakarma|Panchkarma|Dhara|Ganesha|Nataraja|Buddha|Neem|Sandal|Safed|Musli|Herbal|Palakkad|India)$/;
function afterPrefix(t) {
  const first = t.split(/\s+/)[0];
  return PROPER.test(first.replace(/[^A-Za-z]/g, "")) ? t : t[0].toLowerCase() + t.slice(1);
}

function deriveText(c) {
  const { prefix, body } = splitPrefix(c.caption, c.theme);
  let base = cleanBody(body);
  if (!base) base = capitalise(c.theme);
  const withPrefix = (t) => (prefix && !new RegExp("^" + prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(t) ? `${prefix}: ${afterPrefix(t)}` : t);
  let caption = cutChars(withPrefix(base), 119);
  if (!/[.!?]$/.test(caption)) caption += ".";
  let alt = cutWords(withPrefix(base), 20).replace(/\.$/, "");
  if (alt.split(/\s+/).length < 8) alt = tidy(alt + ", Kairali – The Ayurvedic Healing Village, Palakkad");
  return { caption, alt };
}

function slugify(s) {
  return s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
function slugFor(c, prefixWords = 3) {
  const { body } = splitPrefix(c.caption, c.theme);
  const words = cleanBody(body).toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((w) => w && !STOP.has(w) && w.length > 2);
  const theme = slugify(c.theme);
  const rest = words.filter((w) => !theme.split("-").includes(w)).slice(0, prefixWords).join("-");
  return [theme, rest].filter(Boolean).join("-").slice(0, 64).replace(/-$/, "");
}
/** "grounds-grounds-…" → "grounds-…": drop a token that repeats its predecessor. */
function dedupeTokens(slug) {
  return slug.split("-").filter((t, i, a) => i === 0 || t !== a[i - 1]).join("-");
}

/* ------------------------------------------------------------------ *
 * 3. Selection
 * ------------------------------------------------------------------ */

const reg = JSON.parse(fs.readFileSync(CANDIDATES, "utf8"));
const manifestRoutes = JSON.parse(fs.readFileSync(ROUTE_MANIFEST, "utf8")).routes;
const ROUTE_PATHS = new Set(manifestRoutes.map((r) => r.path));
const publicVideos = new Map(reg.video.youtube.publicVideos.map((v) => [v.id, v]));
const log = [];
const toConfirm = [];

// Near-duplicates of an image already selected (same scene, same moment; not a pixel duplicate, so the
// sha256 refusal cannot see them). Owner feedback EF-23, 26 Sep 2026: the last two /retreats-gallery/ tiles
// were two frames of the same hammock shot; the wider frame (-13) stays.
const NEAR_DUPLICATES = new Set([
  "fb9572c10df07909bc2b8b152c7b16e0921d093d43b909c5a5952da8ea7ad0fb", // grounds-people-woman-rests-white-12 ≈ grounds-people-woman-reclining-white-13
]);
// Frames the owner identified as another Kairali property (EF-19, 26 Sep 2026): not the Healing Village.
const NOT_THIS_PROPERTY = new Set([
  "5c1a7d37788e698b1ffe09d743fdfd72f7a8006b33298b506188b7254d953b76", // ktahv-shoot-2025/IMG_8719-2.jpg — head office (vine-covered brick building, Ganesha shrine)
]);
function usable(c) {
  if (NEAR_DUPLICATES.has(c.sha256) || NOT_THIS_PROPERTY.has(c.sha256)) return false;
  if (/TO CONFIRM/.test(c.caption + " " + c.alt)) return false;
  if (c.theme === "pool" && SWIMWEAR.test(c.caption)) return false;
  if (c.width < 1000) return false;
  return true;
}

/** Assign candidates to chapters by rule, dissolving chapters below their minimum. */
function chapterise(route, picks) {
  const buckets = route.chapters.map(() => []);
  const dropped = [];
  for (const c of picks) {
    const k = route.chapters.findIndex((ch) => ch.match(c));
    if (k < 0) { dropped.push(c); continue; }
    buckets[k].push(c);
  }
  // Dissolve thin chapters: their images re-run the rules with that chapter disabled.
  let changed = true;
  const disabled = new Set();
  while (changed) {
    changed = false;
    route.chapters.forEach((ch, k) => {
      if (disabled.has(k) || buckets[k].length === 0 || buckets[k].length >= (route.chapterMin ?? 2)) return;
      disabled.add(k); changed = true;
      const moved = buckets[k].splice(0);
      for (const c of moved) {
        const j = route.chapters.findIndex((ch2, idx) => !disabled.has(idx) && idx !== k && ch2.match(c));
        if (j < 0) dropped.push(c); else buckets[j].push(c);
      }
    });
  }
  return { buckets, dropped, disabled };
}

const bySha = new Map(); // sha256 -> { path, dir, slug } (owner gallery of the file)
const selections = new Map(); // route path -> { picks (flat, in chapter order), chapters }

// Pass 1 — the seven themed galleries, in spec order; the master's candidate
// set is known so that siblings prefer images the master does NOT want
// (giving the master a unique set) while still filling their own targets.
const master = ROUTES.find((r) => r.master);
const masterShas = new Set(reg.galleries[master.path.replace(/\//g, "")].candidates.filter(usable).map((c) => c.sha256));
const usedShas = new Set();

for (const route of ROUTES.filter((r) => !r.master)) {
  const key = route.path.replace(/\//g, "");
  const g = reg.galleries[key];
  if (!g) fail("no candidates for " + route.path);
  const pool = g.candidates.filter(usable);
  const fresh = pool.filter((c) => !c.alreadyOnSite);
  const onSite = pool.filter((c) => c.alreadyOnSite);
  const seen = new Set();
  const take = (list, cond) => {
    const out = [];
    for (const c of list) {
      if (seen.has(c.sha256) || usedShas.has(c.sha256)) continue;
      if (cond && !cond(c)) continue;
      out.push(c); seen.add(c.sha256);
    }
    return out;
  };
  let picks = [];
  // 1) fresh, not wanted by the master; 2) fresh, wanted by the master (they become the master's ≤3 reuse);
  // 3) already-on-site, only to reach the target (used as masters, not the legacy crops).
  picks = picks.concat(take(fresh, (c) => !masterShas.has(c.sha256)).slice(0, route.target));
  if (picks.length < route.target) picks = picks.concat(take(fresh, (c) => masterShas.has(c.sha256)).slice(0, route.target - picks.length));
  if (picks.length < route.target) {
    const extra = take(onSite).slice(0, route.target - picks.length);
    if (extra.length) log.push(`${route.path}: ${extra.length} already-on-site originals used to reach the target (served today as legacy crops; these are the ≥3000 px masters)`);
    picks = picks.concat(extra);
  }
  // A chapter must not starve because the master wanted its best frames: top thin
  // chapters up from the remaining pool (master-wanted first, then on-site originals),
  // beyond the target if needed. The first chapter also gives up its hero (+1).
  const firstMatch = (c) => route.chapters.findIndex((ch) => ch.match(c));
  const remaining = [...fresh, ...onSite].filter((c) => !seen.has(c.sha256) && !usedShas.has(c.sha256));
  route.chapters.forEach((ch, k) => {
    const need = (route.chapterMin ?? 2) + (ch.id === route.heroFrom ? 1 : 0);
    let have = picks.filter((c) => firstMatch(c) === k).length;
    if (have === 0) return; // an empty chapter dissolves by design; only THIN ones are topped up
    for (const c of remaining) {
      if (have >= need) break;
      if (seen.has(c.sha256) || firstMatch(c) !== k) continue;
      picks.push(c); seen.add(c.sha256); have++;
      log.push(`${route.path}: chapter ${ch.id} topped up with candidate #${c.order} (${c.alreadyOnSite ? "already-on-site original" : "master-wanted frame, the master may reuse it"})`);
    }
  });
  // Restore candidate order (score order) before chaptering.
  picks.sort((a, b) => a.order - b.order);
  const { buckets, dropped, disabled } = chapterise(route, picks);
  if (dropped.length) log.push(`${route.path}: ${dropped.length} candidate(s) matched no chapter and were left out (${dropped.map((c) => c.order + " " + c.theme + " " + c.caption.slice(0, 40)).join(" | ")})`);
  const chapters = route.chapters.map((ch, k) => ({ ...ch, images: buckets[k] })).filter((ch, k) => !disabled.has(k) && ch.images.length);
  for (const ch of chapters) for (const c of ch.images) usedShas.add(c.sha256);
  selections.set(route.path, { route, chapters });
}

// Pass 2 — the master gallery: unique images first, then ≤3 reuse per sibling, then
// thin chapters are topped up from the named sibling (still within the 3).
{
  const key = master.path.replace(/\//g, "");
  const pool = reg.galleries[key].candidates.filter(usable);
  const ownerOf = new Map();
  for (const [p, sel] of selections) for (const ch of sel.chapters) for (const c of ch.images) ownerOf.set(c.sha256, p);
  const reuseCount = new Map();
  const canReuse = (sha) => { const o = ownerOf.get(sha); if (!o) return true; return (reuseCount.get(o) || 0) < 3; };
  const noteReuse = (sha) => { const o = ownerOf.get(sha); if (o) reuseCount.set(o, (reuseCount.get(o) || 0) + 1); return o || null; };
  const buckets = master.chapters.map(() => []);
  const seen = new Set();
  // unique first
  for (const c of pool) {
    if (seen.has(c.sha256) || ownerOf.has(c.sha256)) continue;
    const k = master.chapters.findIndex((ch) => ch.match(c));
    if (k < 0 || buckets[k].length >= master.chapterCap) continue;
    buckets[k].push({ ...c, reusedFrom: null }); seen.add(c.sha256);
  }
  // then reuse (≤3 per sibling), lowest-order first
  for (const c of pool) {
    if (seen.has(c.sha256) || !ownerOf.has(c.sha256)) continue;
    const k = master.chapters.findIndex((ch) => ch.match(c));
    if (k < 0 || buckets[k].length >= master.chapterCap || !canReuse(c.sha256)) continue;
    buckets[k].push({ ...c, reusedFrom: noteReuse(c.sha256) }); seen.add(c.sha256);
  }
  // top up thin chapters from the named sibling's selection
  master.chapters.forEach((ch, k) => {
    if (!ch.topUpFrom || buckets[k].length >= master.chapterMin) return;
    const sib = selections.get(ch.topUpFrom);
    for (const sch of sib.chapters) for (const c of sch.images) {
      if (buckets[k].length >= master.chapterMin) break;
      if (seen.has(c.sha256) || !canReuse(c.sha256)) continue;
      buckets[k].push({ ...c, reusedFrom: noteReuse(c.sha256) }); seen.add(c.sha256);
    }
  });
  const chapters = master.chapters.map((ch, k) => ({ ...ch, images: buckets[k] })).filter((ch) => ch.images.length);
  let total = chapters.reduce((n, ch) => n + ch.images.length, 0);
  if (total > master.target) log.push(`${master.path}: ${total} > target ${master.target} — chapter caps hold it`);
  selections.set(master.path, { route: master, chapters });
  const reused = chapters.reduce((n, ch) => n + ch.images.filter((c) => c.reusedFrom).length, 0);
  log.push(`${master.path}: ${total} images, ${reused} reused from siblings (≤3 each, spec §6.3): ${[...reuseCount].map(([p, n]) => p + "×" + n).join(" ")}`);
}

/* ------------------------------------------------------------------ *
 * 4. Hero, captions, slugs, register lint
 * ------------------------------------------------------------------ */

const previous = fs.existsSync(MANIFEST_OUT) ? JSON.parse(fs.readFileSync(MANIFEST_OUT, "utf8")) : null;
const prevDims = new Map();
if (previous) for (const r of previous.routes) for (const im of [r.hero, ...r.chapters.flatMap((ch) => ch.images)]) if (im && im.sha256) prevDims.set(im.sha256, im);

const built = [];
for (const route of ROUTES) {
  const sel = selections.get(route.path);
  // Hero: the first landscape image of the establishing chapter (heroFrom), taken out of the tiles.
  let hero = null;
  const heroOrder = [...sel.chapters].sort((a, b) => (a.id === route.heroFrom ? -1 : b.id === route.heroFrom ? 1 : 0));
  for (const ch of heroOrder) {
    const i = ch.images.findIndex((c) => c.width > c.height && !c.reusedFrom);
    const j = i >= 0 ? i : ch.images.findIndex((c) => c.width > c.height);
    if (j >= 0) { hero = ch.images.splice(j, 1)[0]; break; }
  }
  if (!hero) fail(route.path + ": no landscape image for the hero");
  const chapters = sel.chapters.filter((ch) => ch.images.length);

  const seenAlt = new Map(), seenCap = new Map(), seenSlug = new Set();
  const finish = (c, chapterId, n) => {
    const t = deriveText(c);
    let alt = t.alt, caption = t.caption;
    if (seenAlt.has(alt)) { const k = seenAlt.get(alt) + 1; seenAlt.set(alt, k); alt = `${alt} (frame ${k})`; } else seenAlt.set(alt, 1);
    if (seenCap.has(caption)) { const k = seenCap.get(caption) + 1; seenCap.set(caption, k); caption = caption.replace(/\.$/, "") + ` (frame ${k}).`; } else seenCap.set(caption, 1);
    for (const [what, text] of [["alt", alt], ["caption", caption]]) {
      const hit = LOCKED.exec(text);
      if (hit) fail(`${route.path} ${what} carries a locked word "${hit[0]}": ${text}`);
      if (/^(image|photo|picture) of\b/i.test(text)) fail(`${route.path} ${what} starts with "image of": ${text}`);
    }
    if (caption.length > 120) fail(`${route.path} caption >120 chars: ${caption}`);
    const words = alt.split(/\s+/).length;
    if (words < 8 || words > 20) fail(`${route.path} alt not 8–20 words (${words}): ${alt}`);
    // The file lives under the gallery that FIRST selected it (the sibling for a reused image).
    let owner = bySha.get(c.sha256);
    if (!owner) {
      let slug = dedupeTokens(`${chapterId}-${slugFor(c)}`) + `-${String(n).padStart(2, "0")}`;
      while (seenSlug.has(slug)) slug += "b";
      seenSlug.add(slug);
      owner = { path: route.path, dir: route.dir, slug };
      bySha.set(c.sha256, owner);
    }
    const prev = prevDims.get(c.sha256);
    return {
      src: `${IMG_ROOT_URL}${owner.dir}/${owner.slug}.webp`,
      src768: `${IMG_ROOT_URL}${owner.dir}/${owner.slug}-768.webp`,
      width: prev?.width ?? null, height: prev?.height ?? null,
      width768: prev?.width768 ?? null, height768: prev?.height768 ?? null,
      alt, caption, theme: c.theme, chapter: chapterId,
      sha256: c.sha256, libraryPath: c.libraryRelPath, sourceWidth: c.width, sourceHeight: c.height,
      captionSource: c.captionSource, alreadyOnSite: !!c.alreadyOnSite,
      ...(c.reusedFrom ? { reusedFrom: c.reusedFrom } : {}),
      _cand: c,
    };
  };

  const heroOut = finish(hero, "hero", 1);
  const chaptersOut = chapters.map((ch) => {
    if (ch.linkTo && !ROUTE_PATHS.has(ch.linkTo)) fail(`${route.path} chapter ${ch.id} links to a route not in the manifest: ${ch.linkTo}`);
    for (const text of [ch.title, ch.intro]) { const hit = LOCKED.exec(text); if (hit) fail(`${route.path} chapter ${ch.id} text carries a locked word "${hit[0]}"`); }
    let video = null;
    if (ch.video) {
      const v = publicVideos.get(ch.video);
      if (!v) fail(`video ${ch.video} is not in the register's public list`);
      if (v.complianceFlag) fail(`video ${ch.video} carries a compliance flag: ${v.complianceFlag}`);
      const hit = LOCKED.exec(v.title);
      if (hit) fail(`video ${ch.video} title carries a locked word "${hit[0]}": ${v.title}`);
      const meta = VIDEOS[ch.video];
      if (!meta) fail(`no on-page title/description for video ${ch.video}`);
      for (const text of [meta.title, meta.caption, meta.description]) { const h = LOCKED.exec(text); if (h) fail(`video ${ch.video} on-page text carries a locked word "${h[0]}"`); }
      video = {
        youtubeId: ch.video, title: meta.title, caption: meta.caption, description: meta.description,
        sourceTitle: v.title, sourceUrl: v.url,
        ...(v.uploadDate ? { uploadDate: isoDate(v.uploadDate) } : {}),
        ...(v.duration ? { duration: isoDuration(v.duration) } : {}),
        metaSource: "docs/media/ahv-gallery-candidates-2026-09-23.json (video.youtube.publicVideos)",
        poster: { src: `${IMG_ROOT_URL}video/${ch.video}.webp`, width: null, height: null },
      };
    }
    let n = 0;
    return {
      id: ch.id, title: ch.title, intro: ch.intro, linkTo: ch.linkTo || null, linkLabel: ch.linkLabel || null,
      images: ch.images.map((c) => finish(c, ch.id, ++n)),
      video,
    };
  });
  for (const text of [route.intro]) { const hit = LOCKED.exec(text); if (hit) fail(`${route.path} intro carries a locked word "${hit[0]}"`); }
  built.push({ route, hero: heroOut, chapters: chaptersOut });
}

function isoDate(s) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = /^(\d{4})(\d{2})(\d{2})$/.exec(s);
  if (!m) fail("unrecognised uploadDate in the register: " + s);
  return `${m[1]}-${m[2]}-${m[3]}`;
}
function isoDuration(s) {
  const p = s.split(":").map(Number);
  if (p.some(Number.isNaN)) fail("unrecognised duration in the register: " + s);
  const [h, m, sec] = p.length === 3 ? p : [0, p[0], p[1]];
  return `PT${h ? h + "H" : ""}${m ? m + "M" : ""}${sec}S`;
}

/* ------------------------------------------------------------------ *
 * 5. Images (library → copy → sips → cwebp) and video posters
 * ------------------------------------------------------------------ */

const tmpDir = TMP ? path.resolve(TMP) : fs.mkdtempSync(path.join(os.tmpdir(), "ahv-gallery-2026-"));
fs.mkdirSync(tmpDir, { recursive: true });
const sipsDims = (file) => {
  const out = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], { encoding: "utf8" });
  const w = Number(/pixelWidth:\s*(\d+)/.exec(out)?.[1]), h = Number(/pixelHeight:\s*(\d+)/.exec(out)?.[1]);
  if (!w || !h) throw new Error("sips could not read " + file);
  return { w, h };
};

let converted = 0, skipped = 0, bytes1600 = 0, largest = { bytes: 0, file: "" }, overBudget = [];
/** cwebp at `q`, stepping the quality down (never below 60) until the file fits the spec's per-variant budget (§6.7). */
function encodeWithin(src, out, q, budget) {
  for (let quality = q; ; quality -= 6) {
    execFileSync("cwebp", ["-quiet", "-q", String(quality), "-metadata", "none", src, "-o", out], { stdio: "ignore" });
    const size = fs.statSync(out).size;
    if (size <= budget) return quality;
    if (quality - 6 < 60) { overBudget.push(`${path.relative(path.join(SITE, "public"), out)} ${(size / 1024).toFixed(0)} KB at q${quality}`); return quality; }
  }
}
function convertImage(im) {
  const out = path.join(SITE, "public", im.src);
  const out768 = path.join(SITE, "public", im.src768);
  const srcAbs = path.join(reg.library, im.libraryPath);
  if (!fs.existsSync(srcAbs)) fail("library file missing: " + srcAbs);
  const have = !RECONVERT && fs.existsSync(out) && fs.existsSync(out768) && im.width && im.height && im.width768 && im.height768;
  if (have || SKIP_IMAGES) {
    if (!have && SKIP_IMAGES) { im.width = im.sourceWidth; im.height = im.sourceHeight; im.width768 = im.sourceWidth; im.height768 = im.sourceHeight; }
    if (fs.existsSync(out)) { const b = fs.statSync(out).size; bytes1600 += b; if (b > largest.bytes) largest = { bytes: b, file: im.src }; }
    skipped++; return;
  }
  if (DRY) { im.width = im.sourceWidth; im.height = im.sourceHeight; return; }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const ext = path.extname(srcAbs).toLowerCase() || ".jpg";
  const tmp = path.join(tmpDir, im.sha256.slice(0, 16) + ext);
  fs.copyFileSync(srcAbs, tmp);                       // never touch the library
  execFileSync("sips", ["-Z", "1600", tmp], { stdio: "ignore" });
  const d1 = sipsDims(tmp);
  encodeWithin(tmp, out, 82, 300 * 1024);
  execFileSync("sips", ["-Z", "768", tmp], { stdio: "ignore" });
  const d2 = sipsDims(tmp);
  encodeWithin(tmp, out768, 80, 90 * 1024);
  fs.unlinkSync(tmp);
  im.width = d1.w; im.height = d1.h; im.width768 = d2.w; im.height768 = d2.h;
  const b = fs.statSync(out).size; bytes1600 += b; if (b > largest.bytes) largest = { bytes: b, file: im.src };
  converted++;
}

async function fetchPoster(video) {
  const out = path.join(SITE, "public", video.poster.src);
  const prev = previous?.routes.flatMap((r) => r.chapters).map((ch) => ch.video).find((v) => v && v.youtubeId === video.youtubeId);
  if (fs.existsSync(out) && prev?.poster?.width) { video.poster.width = prev.poster.width; video.poster.height = prev.poster.height; video.poster.source = prev.poster.source; return; }
  if (DRY || SKIP_IMAGES) { video.poster.width = 1280; video.poster.height = 720; return; }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  let source = null, buf = null;
  for (const name of ["maxresdefault.jpg", "hqdefault.jpg"]) {
    const url = `https://i.ytimg.com/vi/${video.youtubeId}/${name}`;
    const r = await fetch(url);
    if (r.ok) { const ab = await r.arrayBuffer(); if (ab.byteLength > 5000) { buf = Buffer.from(ab); source = url; break; } }
  }
  if (!buf) fail("no poster could be fetched for video " + video.youtubeId);
  const tmp = path.join(tmpDir, "poster-" + video.youtubeId + ".jpg");
  fs.writeFileSync(tmp, buf);
  execFileSync("sips", ["-Z", "1280", tmp], { stdio: "ignore" });
  const d = sipsDims(tmp);
  execFileSync("cwebp", ["-quiet", "-q", "75", "-metadata", "none", tmp, "-o", out], { stdio: "ignore" });
  fs.unlinkSync(tmp);
  video.poster.width = d.w; video.poster.height = d.h; video.poster.source = source + " (fetched at build time, self-hosted)";
}

const allImages = built.flatMap((b) => [b.hero, ...b.chapters.flatMap((ch) => ch.images)]);
const uniqueImages = [...new Map(allImages.map((im) => [im.sha256, im])).values()];
console.log(`images to process: ${uniqueImages.length} unique (${allImages.length} placements)`);
let i = 0;
for (const im of uniqueImages) {
  convertImage(im);
  i++;
  if (i % 25 === 0) console.log(`  … ${i}/${uniqueImages.length} (converted ${converted}, reused ${skipped})`);
}
// Placements sharing a sha256 share the dimensions.
const dimsBySha = new Map(uniqueImages.map((im) => [im.sha256, im]));
for (const im of allImages) { const d = dimsBySha.get(im.sha256); im.width = d.width; im.height = d.height; im.width768 = d.width768; im.height768 = d.height768; }
for (const b of built) for (const ch of b.chapters) if (ch.video) await fetchPoster(ch.video);
// Orphans: files under gallery-2026/ that no manifest placement references (a renamed slug, a dropped
// candidate) are build outputs, gitignored, and removed so the deployed folder equals the manifest.
if (!DRY) {
  const referenced = new Set();
  for (const im of allImages) { referenced.add(path.join(SITE, "public", im.src)); referenced.add(path.join(SITE, "public", im.src768)); }
  for (const b of built) for (const ch of b.chapters) if (ch.video) referenced.add(path.join(SITE, "public", ch.video.poster.src));
  const walk = (d, out = []) => { if (!fs.existsSync(d)) return out; for (const e of fs.readdirSync(d)) { const q = path.join(d, e); if (fs.statSync(q).isDirectory()) walk(q, out); else out.push(q); } return out; };
  const orphans = walk(IMG_ROOT_DIR).filter((f) => !referenced.has(f));
  for (const f of orphans) fs.unlinkSync(f);
  if (orphans.length) log.push(`removed ${orphans.length} orphaned file(s) under gallery-2026/ (renamed or dropped)`);
}
console.log(`images: converted ${converted}, reused ${skipped}; 1600px bytes ${(bytes1600 / 1048576).toFixed(1)} MB; largest ${largest.file} ${(largest.bytes / 1024).toFixed(0)} KB`);
if (overBudget.length) log.push(`budget: ${overBudget.length} variant(s) still over the §6.7 per-variant budget at the q60 floor: ${overBudget.join("; ")}`);

/* ------------------------------------------------------------------ *
 * 6. Manifest
 * ------------------------------------------------------------------ */

const existing = readDataset(DATASET_SERVED);
const strip = (im) => { const { _cand, ...rest } = im; return rest; };
const manifest = {
  generated: IST(),
  directive: "D-20260922-31 (galleries GO) · spec docs/research/2026-09-23-ahv-gallery-best-practice.md",
  source: { candidates: "docs/media/ahv-gallery-candidates-2026-09-23.json", candidatesGenerated: reg.generated, library: reg.library },
  site: SITE_URL,
  imageRoot: IMG_ROOT_URL,
  creditText: CREDIT,
  copyrightNotice: COPYRIGHT,
  copyrightNoticeStatus: "CONFIRMED by the owner, D-20260922-35 (2026-09-23): © Kairali Ayurvedic Group; no licence page requested",
  register: "KTAHV clinical lock enforced on every alt, caption, chapter title, intro and video text (build fails on a hit)",
  routes: built.map(({ route, hero, chapters }) => {
    const images = chapters.flatMap((ch) => ch.images);
    return {
      path: route.path, slug: route.path.replace(/\//g, ""), dir: route.dir, h1: route.h1, intro: route.intro,
      counts: {
        // "before" = what the legacy gallery served when the register was mined (the served dataset is replaced by this run, so it cannot be the reference).
        before: reg.galleries[route.path.replace(/\//g, "")].currentCountOnSite,
        after: images.length + 1, chapters: chapters.length, videos: chapters.filter((ch) => ch.video).length,
        reusedFromSiblings: images.filter((im) => im.reusedFrom).length,
        alreadyOnSiteOriginals: images.filter((im) => im.alreadyOnSite).length + (hero.alreadyOnSite ? 1 : 0),
      },
      clinicalSignoff: route.clinical ? "REQUIRED — captions name treatments (HARD GATE 7: Dr. Deepu John before staging→production)" : "captions describe places/people only (owner approval)",
      hero: strip(hero),
      chapters: chapters.map((ch) => ({ ...ch, images: ch.images.map(strip) })),
    };
  }),
  notes: log,
};

// [TO CONFIRM] register for the report.
toConfirm.push(`copyrightNotice wording "${COPYRIGHT}" (used as-is in ImageObject.copyrightNotice) — owner to confirm`);
toConfirm.push("consent category of YouTube in the site's consent notice: the notice has no vendor classification (boot.ts: accepted/declined + Consent Mode v2 signals), so the play click is not gated — owner/legal to confirm");
toConfirm.push("villa category mapping (Royal / Deluxe / Classic) for the villas chapters — the catalog descriptions carry room numbers and names (205, 206 Makeriyam, 209, 211 Chithira) but no category; chapters are by exterior/room, not by category");
for (const r of manifest.routes) if (r.counts.alreadyOnSiteOriginals) toConfirm.push(`${r.path}: ${r.counts.alreadyOnSiteOriginals} image(s) whose subject already serves elsewhere on the site were used to reach the target (the bank holds no others)`);
manifest.toConfirm = toConfirm;
manifest.shootList = {
  "/sight-seeing-gallery/": "The image bank holds NO off-campus attraction photography (register §Genuinely missing #1): Malampuzha dam and gardens, Parambikulam, Silent Valley, Nelliyampathy, Kalpathy, Palakkad Fort and town, temples, waterfalls, tea/coffee estates, backwaters — every attraction the /attractions-*/ pages list. Needs a Kairali shoot (or licensed imagery with a rights record); nothing stock. Also the 2023 paddy-field buggy film exists only as a library MP4 (not on YouTube) — no video slot could be filled.",
  "/yoga-gallery/": "Only one indoor series (10 stills, one patient, one instructor) exists; 9 of 10 already serve on the yoga pages. Missing: outdoor/lawn yoga, a group class, pranayama, the meditation garden, a sunrise session, the hall as an empty space, teacher-training cohorts.",
  "/villas-gallery/": "No villa video without a locked word in its YouTube title (the interior film is titled with 'Resort'); no twilight exteriors; few bathrooms.",
  "/treatments-gallery/": "One Nasyam frame, one Bashpa Swedana set-up; no Vamana/Virechana/Vasti preparation, no physician consultation during a programme, no pharmacy medicine-preparation series, no post-treatment rest; the 165-frame legacy archive needs treatment names before any caption can name a therapy.",
  "/retreats-gallery/": "No group-programme photography (arrival day, group consultation, cooking demonstration, evening cultural programme stills).",
  "/product-gallery/": "No KTAHV-context product photography beyond the 18 garden-table displays; the 61 KAPPL packshots were skipped as [TO CONFIRM] retail renders.",
};

/* ------------------------------------------------------------------ *
 * 7. Dataset + views
 * ------------------------------------------------------------------ */

function readDataset(file) {
  const s = fs.readFileSync(file, "utf8");
  const start = s.indexOf("{");
  return JSON.parse(s.slice(start).replace(/;\s*$/, ""));
}

function datasetFor() {
  const routes = manifest.routes.map((r) => {
    const prev = existing.routes.find((x) => x.path === r.path);
    if (!prev) fail("served dataset has no record for " + r.path);
    const conf = ROUTES.find((x) => x.path === r.path);
    const head = JSON.parse(JSON.stringify(prev.head));
    if (conf.head?.description) { head.description = conf.head.description; if (head.og) head.og.description = conf.head.description; }
    for (const text of [head.description, head.og?.description]) { const hit = text && LOCKED.exec(text); if (hit) fail(`${r.path} head description carries a locked word "${hit[0]}" — add a head override`); }
    const pick = (im) => ({ src: im.src, src768: im.src768, width: im.width, height: im.height, alt: im.alt, caption: im.caption });
    const chapters = r.chapters.map((ch) => ({
      id: ch.id, title: ch.title, intro: ch.intro, linkTo: ch.linkTo, linkLabel: ch.linkLabel,
      images: ch.images.map(pick),
      video: ch.video ? { youtubeId: ch.video.youtubeId, title: ch.video.title, caption: ch.video.caption, description: ch.video.description, poster: ch.video.poster } : null,
    }));
    const flat = [pick(r.hero), ...chapters.flatMap((ch) => ch.images)];
    return {
      path: r.path, slug: r.slug, h1: r.h1,
      head, crumbs: prev.crumbs,
      hero: pick(r.hero),
      intro: { text: r.intro, source: false },
      chapters,
      // Flat list kept for any scanner that walks `photos` (alt audits, image ledgers).
      photos: flat.map((p, i) => ({ src: p.src, w: p.width, h: p.height, ar: Number((p.width / p.height).toFixed(4)), alt: p.alt, name: p.caption, caption: p.caption })),
      captionsBlock: null,
      duplicatedInSource: false,
      sourceGroups: [{ role: "chapters", count: flat.length }],
    };
  });
  return { generated: manifest.generated, site: SITE_URL, family: "photo-collections (chaptered, galleries-2026)", routes };
}

function entities(s) { return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }

/** The overlay .dc.html source: document-relative asset URLs, the package's own head (title + index robots). */
function overlaySource(variant, title) {
  const tpl = (variant === "desktop" ? desktopTemplate() : mobileTemplate())
    .replace(/\/ahv\/assets\//g, "assets/")
    .replace("<helmet>\n", "<helmet>\n")
    .replace(/(<link href="https:\/\/fonts\.googleapis\.com[^\n]*\n)/, `$1<script src="assets/photo-collections-data.js"></script>\n`)
    .replace(/<meta name="robots" content="noindex, nofollow">/, `<title>${title}</title>\n<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">`);
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="./support.js"></script>
</head>
<body>
<x-dc>${tpl}</x-dc>
<script type="text/x-dc" data-dc-script data-props="${entities(JSON.stringify(PROPS))}">${logic(variant === "mobile")}</script>
</body>
</html>
`;
}

function writeViews() {
  for (const variant of ["desktop", "mobile"]) {
    const served = JSON.parse(fs.readFileSync(VIEW_SERVED(variant), "utf8"));
    const overlayPath = VIEW_OVERLAY(variant);
    const title = "Property Gallery | Kairali - The Ayurvedic Healing Village";
    const overlay = overlaySource(variant, title);
    const template = variant === "desktop" ? desktopTemplate() : mobileTemplate();
    // Served payload: the importer's shape (template minus dependency scripts, noindex, /ahv/ URLs, no <title>).
    const payload = {
      ...served,
      sourceSha256: sha256(Buffer.from(overlay)),
      template,
      logic: logic(variant === "mobile"),
      props: JSON.stringify(PROPS),
      scripts: ["/ahv/assets/photo-collections-data.js"],
    };
    if (!DRY) {
      fs.writeFileSync(overlayPath, overlay);
      fs.writeFileSync(VIEW_SERVED(variant), JSON.stringify(payload));
    }
    console.log(`view ${variant}: template ${template.length} chars, logic ${payload.logic.length} chars${DRY ? " (dry)" : ""}`);
  }
}

const dataset = datasetFor();
const datasetText = "window.AHV_PHOTO_COLLECTIONS = " + JSON.stringify(dataset) + ";\n";
if (!DRY) {
  fs.writeFileSync(MANIFEST_OUT, JSON.stringify(manifest, null, 1) + "\n");
  fs.writeFileSync(DATASET_SERVED, datasetText);
  fs.mkdirSync(path.dirname(DATASET_OVERLAY), { recursive: true });
  fs.writeFileSync(DATASET_OVERLAY, datasetText);
}
writeViews();

/* ------------------------------------------------------------------ *
 * 8. Postconditions (loud)
 * ------------------------------------------------------------------ */

const problems = [];
for (const r of manifest.routes) {
  const ims = [r.hero, ...r.chapters.flatMap((ch) => ch.images)];
  const shas = new Set(ims.map((im) => im.sha256));
  if (shas.size !== ims.length) problems.push(`${r.path}: duplicate sha256 inside the route`);
  const alts = new Set(ims.map((im) => im.alt));
  if (alts.size !== ims.length) problems.push(`${r.path}: duplicate alt inside the route`);
  for (const im of ims) {
    if (!im.alt || !im.caption) problems.push(`${r.path}: empty alt/caption ${im.src}`);
    if (!DRY && !SKIP_IMAGES && (!fs.existsSync(path.join(SITE, "public", im.src)) || !fs.existsSync(path.join(SITE, "public", im.src768)))) problems.push(`${r.path}: missing file ${im.src}`);
    if (!im.width || !im.height) problems.push(`${r.path}: no dimensions ${im.src}`);
    if (/[0-9a-f]{64}/.test(im.src)) problems.push(`${r.path}: hash-named URL ${im.src}`);
  }
  if (r.chapters.length < 2) problems.push(`${r.path}: fewer than 2 chapters`);
  for (const ch of r.chapters) if (ch.video && !DRY && !SKIP_IMAGES && !fs.existsSync(path.join(SITE, "public", ch.video.poster.src))) problems.push(`${r.path}: missing poster ${ch.video.poster.src}`);
}
// Cross-gallery duplicates among the seven themed galleries (the master's ≤3 reuse is by design and marked).
const themedShas = new Map();
for (const r of manifest.routes.filter((x) => x.path !== master.path)) for (const im of [r.hero, ...r.chapters.flatMap((ch) => ch.images)]) {
  if (themedShas.has(im.sha256)) problems.push(`cross-gallery duplicate ${im.sha256.slice(0, 12)} in ${r.path} and ${themedShas.get(im.sha256)}`);
  themedShas.set(im.sha256, r.path);
}
const m = manifest.routes.find((x) => x.path === master.path);
for (const im of [m.hero, ...m.chapters.flatMap((ch) => ch.images)]) if (themedShas.has(im.sha256) && !im.reusedFrom) problems.push(`master reuse not marked: ${im.src}`);
// Dataset + views parse and carry the family's contracts.
if (!DRY) {
  const ds = readDataset(DATASET_SERVED);
  if (ds.routes.length !== 8) problems.push("dataset does not carry 8 routes");
  for (const variant of ["desktop", "mobile"]) {
    const v = JSON.parse(fs.readFileSync(VIEW_SERVED(variant), "utf8"));
    for (const must of ["<dialog id=\"gallery-dialog\"", "data-gallery-chapter", "<figcaption", "aria-label=\"Sections\"", "data-cta=\"gallery-tile-open\"", "youtube-nocookie"]) {
      if (!(v.template + v.logic).includes(must)) problems.push(`view ${variant} lacks ${must}`);
    }
    if (/\{\{\s*p\.src\s*\}\}/.test(v.template)) problems.push(`view ${variant} interpolates an image src (placeholder fetch hazard)`);
    if (LOCKED.test(v.template.replace(/World Luxury Award Winner/g, ""))) problems.push(`view ${variant} template carries a locked word`);
  }
  if (sha256(fs.readFileSync(DATASET_SERVED)) !== sha256(fs.readFileSync(DATASET_OVERLAY))) problems.push("served and overlay datasets differ");
}
if (problems.length) { for (const p of problems) console.error("POSTCONDITION: " + p); process.exit(1); }

console.log("\nper-route:");
for (const r of manifest.routes) console.log(`  ${r.path.padEnd(24)} ${String(r.counts.before).padStart(3)} → ${String(r.counts.after).padStart(3)} photographs · ${r.counts.chapters} chapters · ${r.counts.videos} video(s) · reused ${r.counts.reusedFromSiblings} · on-site originals ${r.counts.alreadyOnSiteOriginals}\n${" ".repeat(28)}${r.chapters.map((ch) => `${ch.id}:${ch.images.length}${ch.video ? "+video" : ""}`).join("  ")}`);
for (const l of log) console.log("note: " + l);
console.log(`\nwrote ${DRY ? "(dry) " : ""}${path.relative(SITE, MANIFEST_OUT)}, dataset (served + overlay), views (served + overlay) — ${manifest.generated}`);
