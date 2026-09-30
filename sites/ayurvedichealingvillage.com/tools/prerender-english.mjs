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
// --locale <code> (25 Sep 2026): snapshot the LOCALIZED runtime at each route's
// reviewed locale URL (l10n/routes.json); files are written, link-repaired, then
// stored gzip-compressed under l10n/prerender/<code>/ (read by design-view.tsx).
const LOCALE = arg("locale", null);
const CONCURRENCY = Math.max(1, Number(arg("concurrency", "1")) || 1);
const OUT = arg("out", LOCALE ? `l10n/prerender-tmp/${LOCALE}` : "english-candidate/prerender");
const ONLY = arg("only", null);
const LIMIT = Number(arg("limit", "0")) || 0;

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, "..");
const L10N_ROUTES = LOCALE ? JSON.parse(fs.readFileSync(path.join(SITE, "l10n/routes.json"), "utf8")).routes : null;
const routes = JSON.parse(
  fs.readFileSync(path.join(SITE, "english-candidate/route-manifest.json"), "utf8"),
).routes.filter((r) => !L10N_ROUTES || (L10N_ROUTES[r.path] && L10N_ROUTES[r.path][LOCALE]));
const urlPath = (r) => (L10N_ROUTES ? L10N_ROUTES[r.path][LOCALE] : r.path);

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
    // currentSrc is FULLY RESOLVED, so it carries the render origin -- which on a
    // build machine is http://127.0.0.1:4321. Shipping that bakes a localhost
    // address into production HTML: broken for every visitor, and blocked as
    // mixed content on https. 92 such URLs reached the deployed homepage before
    // this was caught, and every test missed it because the tests ran on
    // localhost, where they resolve. Strip the origin back to a site-root path.
    const raw = src ? src.currentSrc || src.getAttribute("src") : el.getAttribute("src");
    let resolved = raw;
    if (resolved) {
      try {
        const u = new URL(resolved, "http://localhost/");
        if (u.origin === "http://localhost" || /^https?:$/.test(u.protocol)) {
          if (u.hostname === "localhost" || u.hostname === "127.0.0.1") resolved = u.pathname + u.search;
        }
      } catch { /* leave a relative value alone */ }
    }
    if (!resolved) continue;
    img.setAttribute("src", resolved);
    img.setAttribute("alt", el.getAttribute("placeholder") || "");
    // The LCP candidate sits among the first images (image 1 is the header logo,
    // the hero is image 2), so the first three are never lazy-loaded. Lazy on the
    // LCP element defers its request until after layout and inflates LCP, which is
    // the opposite of what the prerender exists to do.
    if (flattened < 3) {
      img.setAttribute("fetchpriority", "high");
    } else {
      img.setAttribute("loading", "lazy");
    }
    img.setAttribute("decoding", "async");
    img.setAttribute("style", "width:100%;height:100%;object-fit:cover");
    el.replaceWith(img);
    flattened++;
  }

  // Never ship the cookie notice in the snapshot: consent state is per visitor
  // and the live layer renders it from localStorage on hydration.
  const notice = clone.querySelector("#ahv-consent");
  if (notice) notice.remove();

  // The family header (family-header.js, 26 Sep 2026) inserts its own controls into the
  // design's header at runtime. A snapshot carrying them would ship inert copies (the finder's
  // filter bar binds its listener only on creation), so the snapshot keeps the design's own
  // header and the script re-applies itself to whatever is on screen.
  clone.querySelectorAll("[data-ahv-fh-btn], .ahv-fh-filterbar, #ahv-fh-panel").forEach((n) => n.remove());
  for (const n of clone.querySelectorAll("*")) {
    for (const a of [...n.attributes]) if (a.name.startsWith("data-ahv-fh")) n.removeAttribute(a.name);
  }

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
  // A route in the protection map 301s, so fetching it returns the TARGET's
  // HTML. Snapshotting that would file another page's markup under this path.
  const redirected = new Set(
    Object.keys(
      JSON.parse(
        fs.readFileSync(path.join(SITE, "english-candidate/redirect-map.json"), "utf8"),
      ).redirects,
    ),
  );
  // --only takes one route or a comma-separated list (23 Sep 2026: one browser for a 120-route partial run)
  const onlySet = ONLY ? new Set(ONLY.split(",").map((s) => s.trim()).filter(Boolean)) : null;
  let list = (onlySet ? routes.filter((r) => onlySet.has(r.path)) : routes).filter(
    (r) => !redirected.has(r.path),
  );
  if (LIMIT) list = list.slice(0, LIMIT);

  const browser = await chromium.launch();
  const index = [];
  let failures = 0;

  const queue = [...list.entries()];
  const worker = async () => { for (let item = queue.shift(); item; item = queue.shift()) await one(...item); };
  const one = async (i, route) => {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 900 },
      hasTouch: true,
      isMobile: true,
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    let rec = { path: route.path, ok: false };
    try {
      await page.goto(BASE + urlPath(route), { waitUntil: "networkidle", timeout: 60000 });
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
      // The snapshot strips every script (see EXTRACT). A view that carries a
      // FAQPage JSON-LD block gets THAT block re-appended, taken from the same
      // payload the page rendered (English or the locale copy), so the visible
      // FAQ and its schema come from one template.
      let html = got.html;
      const viewId = route.mobileView || route.desktopView;
      const viewPath = LOCALE
        ? path.join(SITE, "public", "ahv", "l10n", JSON.parse(fs.readFileSync(path.join(SITE, "l10n/locales.json"), "utf8"))[LOCALE].prefix, "views", viewId + ".json")
        : path.join(SITE, "public", "ahv", "views", viewId + ".json");
      if (viewId && fs.existsSync(viewPath) && !/"@type":\s*"FAQPage"/.test(html)) {
        const tpl = JSON.parse(fs.readFileSync(viewPath, "utf8")).template || "";
        const faq = [...tpl.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]).find((j) => /"@type":\s*"FAQPage"/.test(j));
        if (faq) html += `<script type="application/ld+json">${faq}</script>`;
      }
      fs.writeFileSync(path.join(outDir, file), html);
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
        `[${i + 1}/${list.length}] ${urlPath(route)} ${rec.ok ? `${rec.textChars} chars, ${rec.imgs} imgs` : "FAILED " + rec.error}`,
      );
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  await browser.close();
  // A partial run (--only / --limit) MERGES into the existing index instead of
  // replacing it: a single-route re-render once overwrote the 252-route index
  // with count 1 while every snapshot file on disk was intact, which made the
  // index lie about what the build ships. Full runs still replace it outright.
  const indexPath = path.join(outDir, "index.json");
  let merged = index;
  if ((ONLY || LIMIT) && fs.existsSync(indexPath)) {
    const prev = JSON.parse(fs.readFileSync(indexPath, "utf8")).routes || [];
    const fresh = new Map(index.map((r) => [r.path, r]));
    merged = prev.map((r) => fresh.get(r.path) || r);
    for (const r of index) if (!prev.some((p) => p.path === r.path)) merged.push(r);
  }
  const mergedFailures = merged.filter((r) => !r.ok).length;
  fs.writeFileSync(
    indexPath,
    JSON.stringify({ generated: new Date().toISOString(), base: BASE, count: merged.length, failures: mergedFailures, routes: merged }, null, 1),
  );
  console.log(`\nprerendered ${index.length - failures}/${index.length} routes -> ${OUT} (${failures} failed; index now ${merged.length})`);

  // A fresh snapshot carries the design's own legacy link spellings and the
  // legacy site's Cloudflare email links, both of which boot.ts corrects at
  // runtime but the server response would otherwise ship broken. Chained here
  // so a re-render can never silently drop the repair.
  const { execFileSync } = await import("node:child_process");
  const written = index.filter((r) => r.ok && r.file).map((r) => r.file);
  execFileSync(process.execPath, [path.join(HERE, "repair-snapshot-links.mjs"), "--dir", outDir, ...((ONLY || LIMIT) && !LOCALE ? ["--files", written.join(",")] : [])], {
    stdio: "inherit",
  });

  // The footer year is a live binding; a fresh snapshot serialises it as a bare span, which banned-string-lint
  // (D-ROLLING-NUMBER) cannot tell from a typed year. tools/repair-computed-year.mjs marks it — its header says
  // "re-run after any prerender", and the 28 Sep full refresh skipped it (60 CI findings), so it is chained here,
  // batch by batch (the tool never touches more than 25 snapshots per run).
  if (!LOCALE) {
    const n = fs.readdirSync(outDir).filter((f) => f.endsWith(".html")).length;
    for (let batch = 0; batch * 25 < n; batch++) execFileSync(process.execPath, [path.join(HERE, "repair-computed-year.mjs"), `--batch=${batch}`], { stdio: "ignore" });
  }

  if (LOCALE) {
    // store compressed; the uncompressed working copies are removed
    const { gzipSync } = await import("node:zlib");
    const final = path.join(SITE, "l10n", "prerender", LOCALE);
    fs.mkdirSync(final, { recursive: true });
    for (const f of fs.readdirSync(outDir)) {
      const src = path.join(outDir, f);
      if (f.endsWith(".html")) { fs.writeFileSync(path.join(final, f + ".gz"), gzipSync(fs.readFileSync(src), { level: 9 })); fs.rmSync(src); }
      else if (f === "index.json") fs.copyFileSync(src, path.join(final, f));
    }
  }
  if (failures) process.exitCode = 1;
};

run();
