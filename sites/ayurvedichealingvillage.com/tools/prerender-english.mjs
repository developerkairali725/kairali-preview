/**
 * AHV English candidate — build-time prerender of the approved design's BODY.
 *
 * WHY. The approved design is a client-side runtime: the server response carries
 * the correct per-route <head> but no page text. Measured on the built site, a
 * crawler that does not execute JavaScript sees 254-296 characters per route
 * against 1,200-16,100 rendered. Owner ruled server-side rendering of the body a
 * BLOCKER before any DNS flip (D-20260915-03).
 *
 * WHAT THIS DOES. Renders each approved route in a real browser exactly as a
 * visitor gets it, then serialises the compiled DOM so the SAME markup can be
 * delivered in the server response. The approved design is not rebuilt, re-themed
 * or ported: this captures its own output. After hydration the client runtime
 * mounts as it does today and replaces the snapshot with the live view, so what
 * the visitor ends up interacting with is unchanged.
 *
 * WHY IT IS SAFE TO SERIALISE. Measured on the rendered DOM, every framework
 * element the views use compiles away: x-dc:0, sc-for:0, sc-if:0, dc-import:0.
 * What remains is ordinary HTML.
 *
 * THE ONE HARD PART — shadow DOM. The two homepage views use 46-50 <image-slot>
 * custom elements that keep their <img> inside a shadow root. innerHTML does not
 * serialise shadow content, so a naive prerender emits the homepage layout with
 * NO images — precisely the most valuable page. Each slot already carries its
 * image in a src/ref attribute and its shadow <img> resolves to a real URL, so
 * the snapshot flattens each slot to a plain <img> carrying the resolved src and
 * the slot's own alt/placeholder text. The live runtime re-upgrades the element
 * on hydration, so the flattened copy is what crawlers read, not what users use.
 *
 * MOBILE-FIRST. Google indexes with a mobile crawler, and the design ships two
 * separate documents per route. The snapshot is taken at PHONE width so the
 * served text matches what the mobile crawler would render. Body text is
 * near-identical between the two views (499 of 504 states matched exactly in the
 * accepted baseline), so this is a routing detail, not a content difference.
 *
 * Usage:
 *   node tools/prerender-english.mjs --base http://127.0.0.1:4321 \
 *        --out english-candidate/prerender [--only /about-us/] [--limit 5]
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require_ = createRequire(import.meta.url);
const loadPlaywright = () => {
  try {
    return require_("playwright");
  } catch {
    /* not a direct dependency of this site package */
  }
  let dir = path.dirname(fileURLToPath(import.meta.url));
  for (let up = 0; up < 6; up++) {
    const store = path.join(dir, "node_modules", ".pnpm");
    if (fs.existsSync(store)) {
      const hit = fs.readdirSync(store).find((d) => d.startsWith("playwright@"));
      if (hit) {
        const p = path.join(store, hit, "node_modules", "playwright", "index.js");
        if (fs.existsSync(p)) return require_(p);
      }
    }
    dir = path.dirname(dir);
  }
  throw new Error("playwright not resolvable");
};
const { chromium } = loadPlaywright();

const arg = (n, d) => {
  const i = process.argv.indexOf("--" + n);
  return i > -1 ? process.argv[i + 1] : d;
};
const BASE = arg("base", "http://127.0.0.1:4321");
const OUT = arg("out", "english-candidate/prerender");
const ONLY = arg("only", null);
const LIMIT = Number(arg("limit", "0")) || 0;

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, "..");
const routes = JSON.parse(
  fs.readFileSync(path.join(SITE, "english-candidate/route-manifest.json"), "utf8"),
).routes;

/** Stable, filesystem-safe name for a route path. */
export function snapshotName(routePath) {
  const cleaned = routePath.replace(/^\/+|\/+$/g, "");
  return (cleaned === "" ? "index" : cleaned.replace(/[^a-z0-9._-]+/gi, "_")) + ".html";
}

/**
 * Runs IN THE PAGE. Flattens every image-slot's shadow <img> to a light-DOM
 * <img>, then returns the design root's markup. Mutates only the snapshot copy
 * the crawler receives — the live page is discarded immediately afterwards.
 */
const EXTRACT = () => {
  const root = document.getElementById("ahv-design-root");
  if (!root || !root.firstElementChild) return null;

  const clone = root.cloneNode(true);

  // Pair each live slot with its clone by document order, because a clone has no
  // shadow root of its own to read from.
  const live = [...root.querySelectorAll("image-slot")];
  const copies = [...clone.querySelectorAll("image-slot")];
  let flattened = 0;
  for (let i = 0; i < copies.length; i++) {
    const src = live[i] && live[i].shadowRoot && live[i].shadowRoot.querySelector(".frame img");
    const el = copies[i];
    const img = document.createElement("img");
    const resolved = src ? src.currentSrc || src.getAttribute("src") : el.getAttribute("src");
    if (!resolved) continue;
    img.setAttribute("src", resolved);
    img.setAttribute("alt", el.getAttribute("placeholder") || "");
    img.setAttribute("loading", "lazy");
    img.setAttribute("decoding", "async");
    img.setAttribute("style", "width:100%;height:100%;object-fit:cover");
    el.replaceWith(img);
    flattened++;
  }

  // Never ship the cookie notice in the snapshot: consent state is per visitor
  // and the live layer renders it from localStorage on hydration.
  const notice = clone.querySelector("#ahv-consent");
  if (notice) notice.remove();

  // STRIP EVERY SCRIPT. Scripts inserted through innerHTML never execute, so
  // they are dead weight to a crawler -- but they are NOT harmless. The design
  // root contains the runtime's own <script type="text/x-dc" data-dc-script>,
  // and the snapshot's copy carries data-props="{}" because the live props were
  // already consumed. Shipped in the server HTML it lands in the DOM BEFORE the
  // boot script appends the real one, so the runtime's lookup of
  // script[data-dc-script] finds the empty copy first, compiles with no data
  // and renders an empty page. Caught in regression: body text fell to 110
  // characters and the h1 disappeared on every route.
  clone.querySelectorAll("script").forEach((s) => s.remove());
  // <x-dc> is the runtime's own mount point and is display:none by stylesheet;
  // a stale one in the snapshot can only confuse the same lookup.
  clone.querySelectorAll("x-dc").forEach((s) => s.remove());

  return {
    html: clone.innerHTML,
    textChars: (root.innerText || "").trim().length,
    imgs: clone.querySelectorAll("img").length,
    flattened,
    h1: (root.querySelector("h1") || {}).textContent || null,
    leftovers: ["x-dc", "sc-for", "sc-if", "dc-import", "image-slot"]
      .map((t) => t + ":" + clone.querySelectorAll(t).length)
      .join(" "),
  };
};

const run = async () => {
  const outDir = path.isAbsolute(OUT) ? OUT : path.join(SITE, OUT);
  fs.mkdirSync(outDir, { recursive: true });
  let list = ONLY ? routes.filter((r) => r.path === ONLY) : routes;
  if (LIMIT) list = list.slice(0, LIMIT);

  const browser = await chromium.launch();
  const index = [];
  let failures = 0;

  for (const [i, route] of list.entries()) {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 900 },
      hasTouch: true,
      isMobile: true,
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    let rec = { path: route.path, ok: false };
    try {
      await page.goto(BASE + route.path, { waitUntil: "networkidle", timeout: 60000 });
      // The runtime mounts, compiles the template and binds the route's dataset.
      await page.waitForFunction(
        () => {
          const r = document.getElementById("ahv-design-root");
          return !!(r && r.firstElementChild && (r.innerText || "").trim().length > 200);
        },
        null,
        { timeout: 45000 },
      );
      await page.waitForTimeout(1200);
      const got = await page.evaluate(EXTRACT);
      if (!got || !got.html) throw new Error("empty extraction");
      const file = snapshotName(route.path);
      fs.writeFileSync(path.join(outDir, file), got.html);
      rec = {
        path: route.path,
        ok: true,
        file,
        bytes: got.html.length,
        textChars: got.textChars,
        imgs: got.imgs,
        flattened: got.flattened,
        leftovers: got.leftovers,
      };
    } catch (e) {
      failures++;
      rec.error = String(e).slice(0, 160);
    }
    await ctx.close();
    index.push(rec);
    if (i % 10 === 0 || !rec.ok) {
      console.log(
        `[${i + 1}/${list.length}] ${route.path} ${rec.ok ? `${rec.textChars} chars, ${rec.imgs} imgs` : "FAILED " + rec.error}`,
      );
    }
  }

  await browser.close();
  fs.writeFileSync(
    path.join(outDir, "index.json"),
    JSON.stringify({ generated: new Date().toISOString(), base: BASE, count: index.length, failures, routes: index }, null, 1),
  );
  console.log(`\nprerendered ${index.length - failures}/${index.length} routes -> ${OUT} (${failures} failed)`);
  if (failures) process.exitCode = 1;
};

run();
