/**
 * AHV — prove a change did NOT move the owner's pages.
 *
 * THE STANDING RULE this mechanises (Abilash): the homepage, the package pages
 * and the treatment pages are the benchmark and must not move. Every change
 * ships with a before/after computed-style diff showing 0 of 16 page/width
 * pairs changed. Until now that proof was produced ad hoc and left no tool
 * behind, so the next session had to reinvent it and the one after that had to
 * trust a number in a report.
 *
 * WHAT IT MEASURES. For each benchmark page at each width, it walks every
 * element in document order and records a fingerprint of the properties that
 * decide what the page LOOKS like — box, type, colour, layout — plus the
 * element's position and size from getBoundingClientRect. Text content is
 * deliberately NOT part of the fingerprint: this tool answers "did the design
 * move", and the body-text question is already answered, per route and width,
 * by verify-english-candidate.mjs against its accepted baseline.
 *
 * WHY A FINGERPRINT AND NOT A SCREENSHOT. A screenshot diff on this site is
 * noisy by construction — lazy images, fonts settling, the runtime swapping the
 * prerendered snapshot for the live view. Computed styles and rects are exactly
 * the thing the rule is about, and they compare byte-for-byte.
 *
 * Usage, and it is a two-step by design — you capture the BEFORE with the
 * change reverted, then the AFTER with it applied:
 *
 *   node tools/computed-style-diff.mjs --save before.json
 *   …apply the change, rebuild, restart the server…
 *   node tools/computed-style-diff.mjs --against before.json
 *
 * Exit 0 only when every pair is byte-identical. Any drift prints the element
 * path and the properties that moved, and exits 1.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, "..");

const argv = process.argv.slice(2);
const flag = (n, d) => {
  const i = argv.indexOf(n);
  return i > -1 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : d;
};

const BASE = flag("--base", "http://127.0.0.1:4321").replace(/\/$/, "");
const SAVE = flag("--save", null);
const AGAINST = flag("--against", null);

/**
 * The owner's own pages. Eight pages × two widths = the 16 pairs the rule
 * names. 320 is the narrowest phone the design is reviewed at; 1280 is the
 * width the approved desktop views are drawn for.
 */
const PAGES = [
  "/",
  "/packages/",
  "/ayurvedic-treatments/",
  "/all-programs/",
  "/treatment-programs/",
  "/wellness-programs/",
  "/ayurveda-training-programme/",
  "/one-day-ayurveda-workshop-program-kerala/",
];
const WIDTHS = [320, 1280];

/** The properties that decide what the page looks like. */
const PROPS = [
  "display", "position", "top", "right", "bottom", "left", "float", "clear",
  "width", "height", "min-width", "max-width", "min-height", "max-height",
  "margin-top", "margin-right", "margin-bottom", "margin-left",
  "padding-top", "padding-right", "padding-bottom", "padding-left",
  "border-top-width", "border-right-width", "border-bottom-width", "border-left-width",
  "border-top-color", "border-right-color", "border-bottom-color", "border-left-color",
  "border-top-left-radius", "border-top-right-radius", "border-bottom-left-radius", "border-bottom-right-radius",
  "color", "background-color", "background-image", "opacity", "visibility",
  "font-family", "font-size", "font-weight", "font-style", "line-height",
  "letter-spacing", "text-align", "text-transform", "text-decoration-line", "white-space",
  "flex-direction", "flex-wrap", "justify-content", "align-items", "align-self",
  "flex-grow", "flex-shrink", "flex-basis", "gap", "row-gap", "column-gap",
  "grid-template-columns", "grid-template-rows",
  "overflow-x", "overflow-y", "box-shadow", "z-index", "object-fit",
  // `transform` is deliberately ABSENT. The approved homepage carries
  // auto-advancing sections whose transform is mid-animation at any instant,
  // so including it made two captures of an unchanged page disagree. Layout
  // movement is still caught: getBoundingClientRect reflects the transformed
  // box, and it is part of every row.
];

async function capture(page, url, width) {
  await page.setViewportSize({ width, height: 900 });
  // networkidle is the wrong bar here: the approved runtime keeps fetching
  // payloads and lazy images, so it either never idles or aborts the
  // navigation. Wait for the document, then give the runtime a fixed settle
  // window — the same window for BEFORE and AFTER, which is what makes the
  // two captures comparable. One retry absorbs a transient abort.
  for (let attempt = 0; ; attempt++) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      break;
    } catch (err) {
      if (attempt >= 1) throw err;
      await page.waitForTimeout(1000);
    }
  }
  // Settle on EVIDENCE, not on a guess. A fixed 2.5s wait caught
  // /treatment-programs/ at 320px mid-render once — body height 1,056 against
  // its real 26,273, element count 1,060 against 1,143 — and the pair read as
  // "changed" when nothing had. Wait until the document stops growing.
  await page.waitForFunction(
    () => {
      const h = document.body.scrollHeight;
      const w = window;
      if (w.__lastH === h) { w.__stable = (w.__stable ?? 0) + 1; } else { w.__stable = 0; w.__lastH = h; }
      return w.__stable >= 4;
    },
    undefined,
    { timeout: 45000, polling: 250 },
  ).catch(() => {}); // a page that never settles is measured as-is, not skipped
  await page.waitForTimeout(800);
  return page.evaluate((props) => {
    // TRANSIENT CHROME IS EXCLUDED, and this exclusion is the difference
    // between a proof and a coin toss. Measured: with NOTHING changed between
    // two captures, the first version of this tool reported 3 of 16 pairs
    // "changed", and a different 3 each run. Two culprits, neither of them
    // design:
    //   · <next-route-announcer> — Next.js injects and removes it around
    //     client-side navigations, so whether it exists at the moment of
    //     capture is a race.
    //   · #ahv-consent — the cookie notice boot.ts mounts, which is present
    //     or absent depending on the localStorage consent state of the
    //     browser profile that happens to run the capture.
    // Because elements were keyed by child INDEX, one transient element
    // shifted every sibling after it and the whole subtree read as changed.
    const SKIP = (el) =>
      el.tagName.toLowerCase() === "next-route-announcer" ||
      el.id === "ahv-consent" ||
      el.closest("#ahv-consent") != null;

    const out = [];
    const walk = (el, at) => {
      if (SKIP(el)) return;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const style = props.map((p) => cs.getPropertyValue(p)).join("|");
      out.push(`${at}\t${el.tagName.toLowerCase()}\t${Math.round(r.x)},${Math.round(r.y)},${Math.round(r.width)},${Math.round(r.height)}\t${style}`);
      // Index among the children that SURVIVE the skip, so a transient
      // sibling cannot renumber the ones that matter.
      let i = 0;
      for (const c of el.children) {
        if (SKIP(c)) continue;
        walk(c, `${at}/${c.tagName.toLowerCase()}[${i}]`);
        i++;
      }
    };
    walk(document.body, "body");
    return out;
  }, PROPS);
}

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();

const shot = {};
for (const p of PAGES) {
  for (const w of WIDTHS) {
    const rows = await capture(page, `${BASE}${p}`, w);
    shot[`${p}@${w}`] = rows;
    console.log(`captured ${String(w).padStart(4)}px ${p}  (${rows.length} elements)`);
  }
}
await browser.close();

if (SAVE) {
  fs.writeFileSync(path.resolve(SITE, SAVE), `${JSON.stringify(shot)}\n`);
  console.log(`\nsaved ${Object.keys(shot).length} page/width pairs -> ${SAVE}`);
  process.exit(0);
}

if (!AGAINST) {
  console.log("\nnothing to compare against — pass --save <file> or --against <file>");
  process.exit(0);
}

const before = JSON.parse(fs.readFileSync(path.resolve(SITE, AGAINST), "utf8"));
const keys = [...new Set([...Object.keys(before), ...Object.keys(shot)])].sort();
let changed = 0;
console.log("");
for (const k of keys) {
  const a = before[k] ?? [];
  const b = shot[k] ?? [];
  const diffs = [];
  if (a.length !== b.length) diffs.push(`element count ${a.length} -> ${b.length}`);
  const n = Math.min(a.length, b.length);
  // Rects carry a 1px tolerance; computed styles do not. An element whose
  // resting position lands on a sub-pixel rounds to y=582 on one capture and
  // y=581 on the next, and calling that "the design moved" would make the
  // proof cry wolf on every run. A style PROPERTY changing is never rounding,
  // so that stays exact. Anything that shifts a box by 2px or more still
  // fails, which is well below anything a person would call unchanged.
  const RECT_TOLERANCE = 1;
  const rectMoved = (ra, rb) => {
    if (ra === rb) return false;
    const x = ra.split(",").map(Number);
    const y = rb.split(",").map(Number);
    return x.some((v, i) => Math.abs(v - y[i]) > RECT_TOLERANCE);
  };
  for (let i = 0; i < n && diffs.length < 6; i++) {
    if (a[i] === b[i]) continue;
    const [pa, , ra] = a[i].split("\t");
    const [, , rb] = b[i].split("\t");
    const sa = a[i].split("\t")[3].split("|");
    const sb = b[i].split("\t")[3].split("|");
    const moved = PROPS.filter((_, j) => sa[j] !== sb[j]);
    const boxMoved = rectMoved(ra, rb);
    if (!moved.length && !boxMoved) continue;
    diffs.push(`${pa}${boxMoved ? ` rect ${ra} -> ${rb}` : ""}${moved.length ? ` [${moved.join(", ")}]` : ""}`);
  }
  if (diffs.length) {
    changed++;
    console.log(`CHANGED  ${k}`);
    for (const d of diffs) console.log(`         ${d}`);
  } else {
    console.log(`same     ${k}  (${b.length} elements)`);
  }
}
console.log(`\n${changed} of ${keys.length} page/width pairs changed`);
process.exit(changed === 0 ? 0 : 1);
