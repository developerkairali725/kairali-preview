import { phoneCriticalMedia, descriptiveAwardLinks, villaImageAttributes } from "./critical-media.mjs";
import { formPostSafety } from "./form-post-safety.mjs";
import {
  EAGER_SLOTS,
  lazyImgFirst,
  deferHeroFilm,
  installLazyImgOrder,
  installSlotLoading,
  createBackgroundDeferral,
} from "./media-loading.mjs";
import { deferFarSnapshotContent, whenSnapshotPainted, snapshotFocusTarget, preserveSnapshotInputs } from "./snapshot-paint.mjs";
import { CONSENT_RUNTIME } from "./consent-runtime";
/**
 * AHV English candidate — page bootstrap.
 *
 * This is the ONE piece of client code the lane adds. Everything it mounts is
 * the approved design, byte-for-byte: the packaged dc-runtime (support.js),
 * the shared chrome components, the family data/render scripts, the accepted
 * preview layer, and the view's own template + logic.
 *
 * Order of operations, and why each step exists (every one of these is a fix
 * for a defect the independent 320px review caught on the first build):
 *
 *   1. Install the component resource map BEFORE support.js loads. The runtime
 *      resolves a <dc-import> sibling as "./<Name>.dc.html" relative to the
 *      document and checks window.__resources for that key first. On a
 *      direct-path URL the relative form 404s, which is why the shared Chrome
 *      Header and Footer rendered as empty placeholders on 126 views.
 *   2. Pick the narrow or wide view from the viewport, the same rule the
 *      approved package preview uses (< 700px = Mobile).
 *   3. Fetch that view's payload. 136 payloads serve all 252 routes, so the
 *      CDN caches a family once and every route in it reuses the object.
 *   4. Insert the approved <x-dc> template and its logic block verbatim. The
 *      page stylesheet hides x-dc from the first frame, exactly as support.js
 *      does in the package; without that the 281 interpolated
 *      loading="lazy" images fetch their "{{ expr }}" placeholder as a URL.
 *   5. Apply the ACCEPTED preview layer (preview/portable-preview.js) with the
 *      view's own filename, so the Home-Mobile marker and the shared <=360px
 *      footer correction travel with the design instead of being reinvented.
 *   6. Load the family scripts, then support.js, as ordered classic scripts —
 *      the load order the approved views declare.
 *   7. Once the runtime is up, bind the route: the family renderers resolve
 *      their record from ?route= first and the `route` prop second, and a
 *      direct-path URL carries no query string. Two approved views ship a
 *      data-props block that is not valid JSON, so the prop default cannot be
 *      relied on — __dcSetProps is the runtime's own override channel and
 *      works regardless.
 *   8. Keep the staging head honest: exactly one canonical, and a robots meta
 *      that says noindex even after a family renderer rewrites the head.
 *
 * Everything inserted goes INSIDE the design root, which the page renders with
 * dangerouslySetInnerHTML. That is load-bearing: React does not hydrate or
 * reconcile the children of such an element, so the approved design is
 * invisible to React. Injecting into a normal React-owned node produced
 * hydration error 418 and React's recovery render wiped the design away.
 *
 * Staging safety net: a capture-phase submit guard blocks any native form
 * submission on these pages. The approved forms are design previews that
 * already prevent their own default; this guarantees it even if one does not.
 * preventDefault only — propagation is untouched, so the design's own
 * client-side state changes still run and nothing fakes a success.
 */

import LINK_ALIASES from "../../../english-candidate/link-aliases.json";
import IMAGE_ALIASES from "../../../english-candidate/image-aliases.json";

export interface BootConfig {
  bookingCopy?: {old: string; new: string};
  contentReviewCopy?: Array<{old: string; new: string; kind: string}>;
  path: string;
  robots?: string;
  desktopView: string | null;
  mobileView: string | null;
  breakpoint: number;
  payloadBase: string;
  supportSrc: string;
  previewSrc: string;
  /** window.__resources entries for every <dc-import> sibling. */
  resources: Record<string, string>;
  /**
   * Measurement ids, present ONLY when the build sets AHV_ANALYTICS=1.
   * Absent (the staging default) means the boot script has nothing to start,
   * so no tag can load however the visitor answers the cookie notice. The
   * consent gate is the second lock, not the only one.
   */
  measurement?: { ga4?: string; clarity?: string; metaPixel?: string; adsSendTo?: string; environment?: string };
  /**
   * The page's locale (25 Sep 2026): code, document language/direction, the
   * localized URL, every language that has THIS page (for the switcher), and
   * the switcher's own UI labels. Generated from l10n/routes.json.
   */
  locale?: {
    code: string;
    lang: string;
    dir: "ltr" | "rtl";
    path: string;
    options: Array<{ code: string; name: string; lang: string; href: string }>;
    ui: { language: string; choose: string; current: string };
    privacyHref?: string;
  };
}

/**
 * The go-live switch, read here the same way next.config.ts, robots.ts and
 * sitemap.ts read it.
 *
 * This existed nowhere in this file until 2026-09-16, and that was a go-live
 * trap: enforceStagingHead() wrote "noindex, nofollow" into every page
 * UNCONDITIONALLY and re-armed it through a MutationObserver, while
 * BUILD-STATUS.md promised "all flips are one env var". Flipping AHV_STAGING=0
 * would therefore have served an allow-all robots.txt and published a 252-URL
 * sitemap while every rendered page still told Google not to index it. Google
 * renders JavaScript, so it would have read that -- full deindexation of a
 * ranked site, with nofollow discarding internal link equity as well.
 * Found by an independent audit, verified, and gated here.
 */
const IS_STAGING = process.env.AHV_STAGING !== "0";

export const ROUTE_CONFIG_ID = "ahv-route-config";
export const DESIGN_ROOT_ID = "ahv-design-root";

/** Emitted inline, ASCII-safe, and small enough to stay in the document. */
export const BOOT_SCRIPT = `
  var STAGING = ${JSON.stringify(IS_STAGING)};
(function () {
  // React may re-insert this inline script during hydration; boot exactly once.
  if (window.__ahvBooted) return;
  window.__ahvBooted = true;

  // The server's share-card tags, captured before the runtime mounts. Some
  // templates' head writers do not merely duplicate og:image -- they replace
  // the server node outright, and the travel renderer deletes twitter:image --
  // so deduplication alone cannot keep them. These values are re-asserted on
  // every head mutation, so the rendered DOM matches what scrapers (which never
  // run JavaScript) read from the server HTML.
  var SHARE_KEYS = ["og:image", "og:image:secure_url", "og:image:width", "og:image:height", "og:image:type", "og:image:alt",
    "twitter:card", "twitter:image", "twitter:image:alt", "twitter:image:width", "twitter:image:height"];
  var SERVER_SHARE = {};
  SHARE_KEYS.forEach(function (key) {
    var m = document.head.querySelector('meta[property="' + key + '"], meta[name="' + key + '"]');
    if (m && m.getAttribute("content")) SERVER_SHARE[key] = { attr: m.hasAttribute("property") ? "property" : "name", content: m.getAttribute("content") };
  });
  function assertShareTags() {
    Object.keys(SERVER_SHARE).forEach(function (key) {
      var want = SERVER_SHARE[key];
      var nodes = document.head.querySelectorAll('meta[property="' + key + '"], meta[name="' + key + '"]');
      var keep = nodes.length ? nodes[0] : null;
      for (var i = 1; i < nodes.length; i++) nodes[i].parentNode && nodes[i].parentNode.removeChild(nodes[i]);
      if (!keep) { keep = document.createElement("meta"); keep.setAttribute(want.attr, key); document.head.appendChild(keep); }
      if (keep.getAttribute("content") !== want.content) keep.setAttribute("content", want.content);
    });
  }

  var cfgEl = document.getElementById(${JSON.stringify(ROUTE_CONFIG_ID)});
  var host = document.getElementById(${JSON.stringify(DESIGN_ROOT_ID)});
  if (!cfgEl || !host) return;
  var cfg = JSON.parse(cfgEl.textContent || "{}");

  // Secondary English content-review lane. Apply before the snapshot swap and
  // to subsequently rendered content; shared family payloads remain untouched.
  var reviewByKey = new Map();
  (cfg.contentReviewCopy || []).forEach(function(e) {
    var key = e.kind + "\\0" + e.old;
    if (!reviewByKey.has(key)) reviewByKey.set(key, e.new);
  });
  function applyContentReview(root) {
    if (!cfg.contentReviewCopy || cfg.path === "/villa-raag/") return;
    function normal(s) { return (s || "").replace(/\\s+/g, " ").trim(); }
    function changeText(n) {
      var p = n.parentElement;
      if (!p || p.closest("script,style,svg,noscript,form")) return;
      var h = p.closest("h1,h2,h3,h4,h5,h6");
      var kind = h ? h.tagName.toLowerCase() : (p.closest(".ahv-link-context") ? "text" : (p.closest("a") ? "link" : "text"));
      var value = normal(n.nodeValue);
      var link = p.closest("a");
      if (cfg.bookingCopy && value === cfg.bookingCopy.old && link && link.getAttribute("href") === "https://bookings.ayurvedichealingvillage.com/") return;
      var replacement = reviewByKey.get(kind + "\\0" + value);
      if (replacement != null) {
        var nextValue = (n.nodeValue.match(/^\\s*/) || [""])[0] + replacement + (n.nodeValue.match(/\\s*$/) || [""])[0];
        if (n.nodeValue !== nextValue) n.nodeValue = nextValue;
      }
    }
    if (root.nodeType === 3) changeText(root);
    else {
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n;
      while ((n = walker.nextNode())) changeText(n);
    }
    var links = root.querySelectorAll ? Array.from(root.querySelectorAll("a[href]")) : [];
    if (root.nodeType === 1 && root.matches("a[href]")) links.unshift(root);
    links.forEach(function(a) {
      var label = normal(a.textContent), href = a.getAttribute("href");
      var accessible = a.getAttribute("aria-label");
      if (accessible) (cfg.contentReviewCopy || []).forEach(function(edit) {
        if (edit.kind === "link" && accessible.indexOf(edit.old) !== -1) accessible = accessible.replace(edit.old, edit.new);
      });
      if (a.hasAttribute("data-recorded-embed") && label) accessible = label;
      if (accessible && accessible !== a.getAttribute("aria-label")) a.setAttribute("aria-label", accessible);
      if (cfg.bookingCopy && label === cfg.bookingCopy.old && href === "https://bookings.ayurvedichealingvillage.com/") {
        var walker = document.createTreeWalker(a, NodeFilter.SHOW_TEXT), n;
        while ((n = walker.nextNode())) if (normal(n.nodeValue) === cfg.bookingCopy.old) n.nodeValue = cfg.bookingCopy.new;
      }
    });
  }
  applyContentReview(host);
  if (cfg.contentReviewCopy) new MutationObserver(function(changes) {
    changes.forEach(function(c) {
      if (c.type === "characterData") applyContentReview(c.target);
      else c.addedNodes.forEach(function(n) { applyContentReview(n); });
    });
  }).observe(host, {subtree: true, childList: true, characterData: true});


  // Media loading (lane P-perf, media-loading.mjs). The LCP slots, the inline-background deferral that
  // the site-document stylesheet pairs with, and — before any design script can create an image — the
  // two hooks that decide loading ahead of the first src write.
  var EAGER_SLOTS = ${JSON.stringify(EAGER_SLOTS)};
  var deferBackgrounds = (${createBackgroundDeferral.toString()})(window, 800);
  (${installLazyImgOrder.toString()})(window, (${villaImageAttributes.toString()}), (${phoneCriticalMedia.toString()}));
  (${installSlotLoading.toString()})(window, EAGER_SLOTS);

  // The server response carries the prerendered snapshot (phone width, for
  // the mobile crawler). It stays on screen until the runtime has rendered
  // the live view: wiping it first left a desktop visitor a phone layout and
  // then up to five seconds of empty paper on a slow connection, because the
  // family scripts and the runtime load only AFTER the payload arrives.
  // Every snapshot node is marked so the served stylesheet can hide it the
  // moment the live template is pushed, and the runtime's own #dc-root id is
  // taken off the copy so only the live root ever carries it.
  var snapshotNodes = [];
  (function () {
    var kids = host.children;
    for (var i = 0; i < kids.length; i++) {
      kids[i].setAttribute("data-ahv-snapshot", "");
      if (kids[i].id === "dc-root") kids[i].removeAttribute("id");
      snapshotNodes.push(kids[i]);
    }
  })();
  // The snapshot's own inline backgrounds: the first screen now, the rest as it nears the viewport.
  deferBackgrounds(host);
  // Far-below-the-fold snapshot content skips rendering (and its lazy images) until the reader nears it (snapshot-paint.mjs).
  (${deferFarSnapshotContent.toString()})(window, snapshotNodes, cfg.breakpoint, 1.5);
  function liveRoot() {
    var kids = host.children;
    for (var i = 0; i < kids.length; i++) {
      var k = kids[i];
      if (k.hasAttribute("data-ahv-snapshot") || k.tagName === "SCRIPT" || k.tagName === "X-DC") continue;
      return k;
    }
    return null;
  }
  // Snapshot -> live swap without a layout shift (lane P-perf, 29 Sep 2026; measured mobile CLS 1.0 on
  // /, /ayurvedic-treatments/ and 0.44 on /festivals/). Two causes, both fixed here and in the
  // site-document stylesheet:
  //  1. The live root was laid out BELOW the phone snapshot (x-dc was appended after it), so hiding the
  //     snapshot moved the whole live page ~24,000px up into the viewport: a full-screen shift. The live
  //     root now mounts FIRST in the design root and, on a phone, sits out of flow at top 0 and
  //     invisible while the snapshot stays on screen; the swap removes the snapshot and shows the live
  //     page in the same frame, at the same position. A disappearance plus an appearance is not a shift.
  //  2. The sitewide scripts (section-nav.js, consistency.js, ...) query the FIRST match in the design
  //     root, which was the snapshot's copy, so they restyled the live page only after the snapshot
  //     left — the captured sidebar was removed in front of the visitor. With the live root first they
  //     work on it while it is still hidden, and the swap waits until its DOM has been quiet for a
  //     moment (at most 0.8 s after it is ready), so their passes land before it is shown.
  // The ready test counts rendered text directly: innerText is empty for an invisible element.
  var lastLiveChange = 0, liveReadyAt = 0;
  function liveTextLength(el) {
    var n = 0, walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), t;
    while (n <= 200 && (t = walker.nextNode())) {
      var tag = t.parentNode && t.parentNode.nodeName;
      if (tag !== "STYLE" && tag !== "SCRIPT" && tag !== "TEMPLATE") n += (t.nodeValue || "").trim().length;
    }
    return n;
  }
  function retireSnapshot(tries) {
    var live = liveRoot();
    if (live && liveTextLength(live) > 200) {
      var now = Date.now();
      if (!liveReadyAt) liveReadyAt = now;
      if (tries > 0 && now - lastLiveChange < 120 && now - liveReadyAt < 800) {
        setTimeout(function () { retireSnapshot(tries - 1); }, 100);
        return;
      }
      (${preserveSnapshotInputs.toString()})(document, snapshotNodes, live);
      applyContentReview(live);
      var focusTarget = (${snapshotFocusTarget.toString()})(document, snapshotNodes, live);
      for (var i = 0; i < snapshotNodes.length; i++) {
        if (snapshotNodes[i].parentNode) snapshotNodes[i].parentNode.removeChild(snapshotNodes[i]);
      }
      snapshotNodes = [];
      // The snapshot's served copies of the view's helmet styles (snapshot-styles.mjs) leave with it, each
      // only once the runtime has written the identical block (or font link) into <head> — so nothing on
      // screen changes; a copy whose twin has not arrived yet simply stays.
      var headCss = {}, headLinks = {};
      document.head.querySelectorAll("style").forEach(function (el) { headCss[(el.textContent || "").trim()] = 1; });
      document.head.querySelectorAll("link[rel=stylesheet]").forEach(function (el) { headLinks[el.getAttribute("href")] = 1; });
      document.querySelectorAll("[data-ahv-snapshot-style]").forEach(function (el) {
        var twin = el.tagName === "LINK" ? headLinks[el.getAttribute("href")] : headCss[(el.textContent || "").trim()];
        if (twin && el.parentNode) el.parentNode.removeChild(el);
      });
      host.setAttribute("data-ahv-snapshot-state", "retired");
      host.removeAttribute("data-ahv-live-pending");
      if (focusTarget) focusTarget.focus({ preventScroll: true });
      return;
    }
    if (tries > 0) { setTimeout(function () { retireSnapshot(tries - 1); }, 100); return; }
    // The runtime never rendered: give the visitor the snapshot back rather
    // than an empty page — with the partial live root back behind it, where it
    // sat before the live root was mounted first.
    if (live) host.appendChild(live);
    host.removeAttribute("data-ahv-live-pending");
    host.setAttribute("data-ahv-snapshot-state", "held");
  }
  function releaseSnapshot() {
    if (!snapshotNodes.length) return;
    host.setAttribute("data-ahv-snapshot-state", "released");
    retireSnapshot(40);
  }

  // A design-preview query must never override the real website route.
  var currentUrl = new URL(window.location.href);
  if (currentUrl.searchParams.has("route")) {
    currentUrl.searchParams.delete("route");
    history.replaceState(history.state, "", currentUrl.href);
  }

  document.addEventListener("submit", function (e) {
    // A GET search form (the homepage finder, the search dialog) submits no
    // data anywhere: it is navigation to /ayurvedic-treatments/?q=… and must
    // work (owner, 23 Sep 2026: "Find a programme" did nothing). Everything
    // else stays blocked.
    var f = e.target;
    if (f && f.getAttribute && f.getAttribute("role") === "search" && /^get$/i.test(f.getAttribute("method") || "")) return;
    e.preventDefault();
  }, true);

  // The source designs retain canonical production URLs. Keep navigation
  // within this deployment while leaving external destinations, downloads,
  // mail, telephone links, metadata and source provenance untouched.
  function localizeLink(anchor) {
    if (!anchor || !anchor.getAttribute) return;
    var raw = anchor.getAttribute("href");
    if (!raw) return;
    var url;
    try { url = new URL(raw, window.location.href); } catch (_) { return; }
    if (url.protocol !== "https:" && url.protocol !== "http:") return;
    var sourceHost = url.hostname === "ayurvedichealingvillage.com" ||
      url.hostname === "www.ayurvedichealingvillage.com";
    if (!sourceHost && url.origin !== window.location.origin) return;
    // Source media links are downloads, not website page navigation — EXCEPT the site's own packaged documents
    // (/documents/…, the approved rate PDFs and brochures shipped in this deployment). A family renderer builds
    // those as production-absolute URLs (A + href), and production has no copy yet, so the visible OPD rates link
    // pointed at a 404 after hydration (owner regression, 28 Sep 2026). They stay on this deployment with their
    // exact path — language and currency live in the path, so the approved document is unchanged. Other media
    // (legacy uploads, videos, images) keep their source URL.
    var packagedDocument = sourceHost && /^[/]documents[/]/.test(url.pathname);
    if (packagedDocument) {
      var local = url.pathname + url.search + url.hash;
      if (raw !== local) anchor.setAttribute("href", local);
      return;
    }
    if (/[.](pdf|jpg|jpeg|png|webp|gif|svg|mp4|zip)$/i.test(url.pathname)) return;
    // Source links use older spellings; resolve to the approved pages. The map
    // is english-candidate/link-aliases.json so that ONE list serves both this
    // runtime pass and tools/apply-link-aliases.mjs, which rewrites the same
    // hrefs inside the prerendered snapshots. Before that, a legacy spelling
    // was corrected for a visitor but still shipped broken in the server HTML,
    // which is what a crawler and a no-JS first paint actually read.
    var aliases = ${JSON.stringify(LINK_ALIASES)};
    var path = aliases[url.pathname.replace(/[/]$/, "")] || url.pathname;
    // Locale pages (28 Sep 2026 link audit): view logic builds many links by concatenation (A + o.href, crumbs,
    // cards), which the build's string rewrite cannot reach, so a German page linked to /about-us/ instead of
    // /de/uber-uns/. A link to an English page that has an equivalent in this locale goes to that equivalent — the
    // map is the locale's own route table (section-nav.data.js AHV_LOCAL_PATHS). Language-switcher links
    // (hreflang) point at other languages on purpose and are left alone; English pages have no map.
    var localPaths = window.AHV_LOCAL_PATHS;
    if (localPaths && !anchor.hasAttribute("hreflang") && (document.documentElement.lang || "en").slice(0, 2) !== "en") {
      var key = path.charAt(path.length - 1) === "/" || path.lastIndexOf(".") > path.lastIndexOf("/") ? path : path + "/";
      if (localPaths[key] && localPaths[key] !== key) path = localPaths[key];
    }
    var next = path + url.search + url.hash;
    if ((sourceHost || path !== url.pathname) && raw !== next) anchor.setAttribute("href", next);
  }
  function localizeLinks(root) {
    if (root.nodeType !== 1) return;
    if (root.matches("a[href], area[href]")) localizeLink(root);
    root.querySelectorAll("a[href], area[href]").forEach(localizeLink);
  }

  // The approved homepage views are the only two that use <image-slot>. Its
  // shadow stylesheet sets touch-action:none on the framed <img> and on the
  // .spill layer so a photo can be dragged to reposition inside its frame in
  // the design tool. That drag is correctly gated on data-editable, which is
  // never set here (it requires window.omelette.writeFile), but the CSS is
  // unconditional — so on a touch device a finger landing on any homepage
  // photo suppressed the browser's own pan gesture and the page would not
  // scroll. Measured: drag from a slot scrolled 0px; with touch-action back to
  // auto the same drag scrolled 237-285px.
  //
  // Fixed from our own stylesheet rather than by editing the payload:
  // image-slot.js is imported source, and tools/import-english-candidate.mjs
  // rewrites public/ahv/ wholesale on every run, so a payload edit would not
  // survive a re-import. The slot's shadow root is mode:"open", so an adopted
  // sheet reaches it without touching approved bytes. Scoped to slots that are
  // NOT editable, so authoring behaviour is unchanged wherever it does apply.
  var slotSheet = null;
  function slotScrollSheet() {
    if (slotSheet === null) {
      try {
        slotSheet = new CSSStyleSheet();
        slotSheet.replaceSync(".frame img,.spill{touch-action:auto}");
      } catch (e) { slotSheet = false; }
    }
    return slotSheet;
  }
  function restoreSlotScroll(slot) {
    if (!slot || slot.__ahvTouchFixed) return;
    var shadow = slot.shadowRoot;
    var sheet = slotScrollSheet();
    if (!shadow || !sheet || slot.hasAttribute("data-editable")) return;
    try {
      if (shadow.adoptedStyleSheets.indexOf(sheet) === -1) {
        shadow.adoptedStyleSheets = shadow.adoptedStyleSheets.concat(sheet);
      }
      slot.__ahvTouchFixed = true;
    } catch (e) { /* a browser without adoptedStyleSheets keeps source behaviour */ }
  }
  // Same map as tools/repair-snapshot-links.mjs applies to the snapshots, so
  // the server HTML and the mounted runtime show the same picture.
  var IMG_ALIASES = ${JSON.stringify(IMAGE_ALIASES)};
  // A translated "Learn more" needs the visible news title as link context.
  // Reuse that exact title for assistive readers without changing visible copy.
  function describeHomeNewsLinks(root) {
    if (cfg.path !== "/" || !root) return;
    root.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (href.slice(-12) !== "/contact-us/") return;
      var parent = a.parentElement, title = null;
      for (var depth = 0; parent && parent !== root && depth < 3; depth++, parent = parent.parentElement) {
        title = parent.querySelector("h3");
        if (title || parent.tagName === "SECTION") break;
      }
      if (!title || !(title.textContent || "").trim()) return;
      var context = a.querySelector("[data-ahv-news-context]");
      if (!context) {
        context = document.createElement("span");
        context.setAttribute("data-ahv-news-context", "");
        context.style.cssText = "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0";
        a.appendChild(context);
      }
      var text = " — " + title.textContent.trim();
      if (context.textContent !== text) context.textContent = text;
    });
  }

  function aliasImages(root) {
    if (!root || root.nodeType !== 1) return;
    var imgs = root.matches("img") ? [root] : root.querySelectorAll("img[src]");
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      var cur = img.getAttribute("src") || "";
      var key = cur.replace(new RegExp("^https?://[^/]+"), "");
      if (IMG_ALIASES[key] && cur !== IMG_ALIASES[key]) img.setAttribute("src", IMG_ALIASES[key]);
    }
  }

  /**
   * Directions page layout (/how-to-reach/) — tags containers for
   * public/design/directions.css.
   *
   * The reader renders the page as one flat prose column and emits no classes,
   * only data-source-pointer paths. Sections, cards and the "Good to know"
   * pairs live in anonymous <div>s with no pointer of their own, so CSS cannot
   * reach them. This climbs from a known pointer to the nearest ancestor that
   * holds ONLY that group's blocks, and tags it. Nothing is moved, reordered or
   * reworded; the FAQ split is presentational — the source has the question
   * and its answer as one run of text with no break after the "?".
   *
   * Runs once per mount. The prerender runs after boot, so the next snapshot
   * of the route carries these tags too.
   */
  // Finds the elements of one source group and returns a single container
  // that holds exactly them. The renderer FLATTENS the source tree, so a
  // group's blocks are usually siblings in one big column with no wrapper of
  // their own -- in that case the consecutive run is wrapped in a new element.
  // Where the renderer did keep a wrapper that holds only this group, that
  // wrapper is tagged instead and nothing moves.
  function tagGroup(main, prefix, cls, attr, val) {
    var all = main.querySelectorAll('[data-source-pointer^="' + prefix + '"]');
    if (!all.length) return null;
    // Scope to the first match's own top-level section. The sticky call bar
    // reuses the closing CTA's pointers OUTSIDE the content section, and
    // letting a group span both climbed to <main> and wrapped the whole page.
    var scope = all[0].closest('section[data-source-pointer], [data-source-pointer="/sections/3"]') || main;
    if (scope === all[0]) scope = all[0].parentElement || main;
    // A nested call passes a grid or fact-set as the container; the nearest
    // section lies OUTSIDE it, and escaping the container resolved the run to
    // the wrong parent and silently made no cards. Never scope past the
    // container this call was given.
    if (!main.contains(scope) || scope === main) scope = main;
    var els = [];
    for (var i = 0; i < all.length; i++) if (scope.contains(all[i]) && all[i] !== scope) els.push(all[i]);
    if (!els.length) return null;
    var first = els[0], last = els[els.length - 1];
    var parent = first.parentElement;
    while (parent && parent !== scope && parent !== main && !parent.contains(last)) parent = parent.parentElement;
    if (!parent || parent === main && scope !== main) parent = scope;
    if (!parent) return null;
    var foreign = parent.querySelector('[data-source-pointer]:not([data-source-pointer^="' + prefix + '"])');
    if (!foreign && parent !== main) {
      if (!parent.classList.contains(cls)) { parent.classList.add(cls); if (attr) parent.setAttribute(attr, val); }
      return parent;
    }
    var run = [];
    for (var c = parent.firstElementChild; c; c = c.nextElementSibling) {
      var owns = (c.hasAttribute("data-source-pointer") && c.getAttribute("data-source-pointer").indexOf(prefix) === 0) ||
                 !!c.querySelector('[data-source-pointer^="' + prefix + '"]');
      if (owns) run.push(c);
    }
    if (!run.length) return null;
    if (run.length === 1 && run[0].classList.contains(cls)) return run[0];
    var box = document.createElement("div");
    box.className = cls;
    if (attr) box.setAttribute(attr, val);
    parent.insertBefore(box, run[0]);
    run.forEach(function (el) { box.appendChild(el); });
    return box;
  }
  function enhanceDirections(host) {
    if (!host || host.__ahvDirectionsDone) return;
    if (host.getAttribute("data-ahv-route") !== "/how-to-reach/") return;
    var main = host.querySelector("#main-content") || host;
    if (!main.querySelector('[data-source-pointer="/sections/3/c/19/c/1/c/3"]')) return; // not rendered yet
    host.__ahvDirectionsDone = true;
    // bands: one per top-level section of the directions content
    [1, 3, 5, 7, 9, 11, 13, 15, 17, 19].forEach(function (n) {
      tagGroup(main, "/sections/3/c/" + n + "/", "ahv-band", "data-ahv-band", String(n));
    });
    // Grids first (the outer wrapper around a whole card set), then the cards
    // inside them. Order matters in a flat layout: tagging the cards' shared
    // parent as the grid would turn the entire page column into a grid.
    [["/sections/3/c/3/c/1/c/5/", [1, 3], "2"],
     ["/sections/3/c/5/c/1/c/7/", [1, 3, 5], "3"],
     ["/sections/3/c/15/c/1/c/5/", [1, 3], "2"]].forEach(function (g) {
      var grid = tagGroup(main, g[0], "ahv-grid", "data-ahv-cols", g[2]);
      if (!grid) return;
      g[1].forEach(function (k) { tagGroup(grid, g[0] + "c/" + k + "/", "ahv-card"); });
    });
    // "Good to know": the pair set, then each label/value pair
    var facts = tagGroup(main, "/sections/3/c/9/c/1/c/1/c/3/c/15/", "ahv-facts");
    if (facts) [1, 3, 5, 7].forEach(function (k) { tagGroup(facts, "/sections/3/c/9/c/1/c/1/c/3/c/15/c/" + k + "/", "ahv-fact"); });
    // FAQ: question and answer share one paragraph with no break after "?"
    main.querySelectorAll('p[data-source-pointer^="/sections/3/c/17/c/1/c/"]').forEach(function (p) {
      var ptr = p.getAttribute("data-source-pointer");
      if (new RegExp("/c/(1|3)$").test(ptr) || p.children.length) return;
      var t = p.textContent || "";
      var i = t.indexOf("?");
      if (i < 8 || i > t.length - 8) return;
      var q = document.createElement("strong"); q.className = "ahv-q"; q.textContent = t.slice(0, i + 1);
      var a = document.createElement("span"); a.className = "ahv-a"; a.textContent = t.slice(i + 1).trim();
      p.textContent = ""; p.appendChild(q); p.appendChild(a);
    });
  }

  /**
   * The contact page's clock. The design carries status.clockPlaceholder
   * "— IST" for a live clock the design tool never populated, so the pill
   * shipped reading "— IST" with nothing in front of it. Fills it with the
   * current time at the hospital; hides the pill if the browser cannot
   * compute Asia/Kolkata rather than show a broken placeholder.
   */
  var clockStarted = false;
  function istNow() {
    return new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", hour12: true })
      .format(new Date()).replace(/am|pm/i, function (m) { return m.toUpperCase(); }) + " IST";
  }
  function startIstClock(root) {
    if (!root || root.nodeType !== 1) return;
    var spans = root.querySelectorAll("span.sc-interp");
    var found = [];
    for (var i = 0; i < spans.length; i++) {
      var sp = spans[i];
      if (sp.__ahvClock || (sp.textContent || "").trim() !== String.fromCharCode(8212) + " IST") continue;
      sp.__ahvClock = true; found.push(sp);
    }
    if (!found.length) return;
    var paint = function () {
      var t; try { t = istNow(); } catch (_) { t = null; }
      found.forEach(function (sp) {
        if (t) sp.textContent = T("Now") + " " + t; else if (sp.parentElement) sp.parentElement.hidden = true;
      });
    };
    paint();
    if (!clockStarted) { clockStarted = true; setInterval(paint, 60000); }
  }

  function restoreSlotScrolling(root) {
    if (!root || root.nodeType !== 1) return;
    if (root.matches("image-slot")) restoreSlotScroll(root);
    root.querySelectorAll("image-slot").forEach(restoreSlotScroll);
  }

  /**
   * Defer the off-screen slot photographs.
   *
   * The homepage mounts 46 <image-slot> elements and each holds its <img> in a
   * shadow root with no loading attribute, so the browser fetched all of them at
   * once: measured, 91 image requests and 16.7 MB on a single mobile load, which
   * starves the hero and left LCP at 35.8s against a 1.4s first paint. The
   * snapshot's own lazy attributes cannot help here, because the runtime replaces
   * that markup when it mounts.
   *
   * The LCP slot (EAGER_SLOTS: hero-still / m-hero) is left eager at high
   * priority and every other slot is marked lazy, so the gallery loads as the
   * patient scrolls to it rather than competing with the hero. Applied from our
   * side, on the shadow root, so no approved byte is edited and a re-import
   * cannot undo it. The decision itself is made before the slot's first src
   * write (installSlotLoading, media-loading.mjs); this pass is the net for a
   * slot that pass missed, and it can no longer turn a lazy slot eager (the old
   * "first three slots seen" rule did, whatever their position — removing
   * loading from a lazy image fetches it at once).
   */
  function deferSlotImage(slot) {
    if (!slot || slot.__ahvLazySet) return;
    var shadow = slot.shadowRoot;
    if (!shadow) return;
    var img = shadow.querySelector(".frame img");
    if (!img) return;
    slot.__ahvLazySet = true;
    if (EAGER_SLOTS[slot.id]) {
      img.setAttribute("fetchpriority", "high");
      img.removeAttribute("loading");
      return;
    }
    if (!img.getAttribute("loading")) img.setAttribute("loading", "lazy");
    img.setAttribute("fetchpriority", "low");
    if (!img.getAttribute("decoding")) img.setAttribute("decoding", "async");
  }
  function deferSlotImages(root) {
    if (!root || root.nodeType !== 1) return;
    if (root.matches("image-slot")) deferSlotImage(root);
    root.querySelectorAll("image-slot").forEach(deferSlotImage);
  }

  // Spam honeypots must not be visible to a patient filling the form in.
  // The approved datasets already say which field is one: /contact-us/ carries
  // form.honeypot = { name:"company", omitted:true } and its renderer omits it,
  // but /enquiry-form/ marks its field inline as { name:"website",
  // honeypot:true } and the enquiry renderer never reads that flag — so the
  // real enquiry page shipped a full-width text input labelled "Leave this
  // empty" in the middle of the form. Owner-reported, 15 Sep 2026.
  //
  // Fixed from the DATA, not by guessing at names or editing the payload:
  // the dataset globals are the same records the renderer used, and
  // public/ahv/assets/*.js is imported source that the importer rewrites
  // wholesale. Hidden the way a honeypot is meant to be — removed from sight,
  // from the accessibility tree and from tab order, while staying in the DOM
  // and in the submitted payload so it still traps bots.
  var honeypotDatasetCache = new WeakMap();
  function honeypotNames() {
    var names = [];
    Object.keys(window).forEach(function (key) {
      if (key.indexOf("AHV_") !== 0) return;
      var dataset = window[key];
      if (!dataset || typeof dataset !== "object") return;
      var cached = honeypotDatasetCache.get(dataset);
      if (cached) {
        cached.forEach(function (name) { if (names.indexOf(name) === -1) names.push(name); });
        return;
      }
      var found = [];
      var seen = 0;
      (function scan(node) {
        if (!node || typeof node !== "object" || seen++ > 20000) return;
        if (Array.isArray(node)) { node.forEach(scan); return; }
        if (node.honeypot === true && typeof node.name === "string") {
          if (found.indexOf(node.name) === -1) found.push(node.name);
        } else if (node.honeypot && typeof node.honeypot === "object" && typeof node.honeypot.name === "string") {
          if (found.indexOf(node.honeypot.name) === -1) found.push(node.honeypot.name);
        }
        Object.keys(node).forEach(function (k) { scan(node[k]); });
      })(dataset);
      honeypotDatasetCache.set(dataset, found);
      found.forEach(function (name) { if (names.indexOf(name) === -1) names.push(name); });
    });
    return names;
  }
  // Cloudflare email obfuscation, inherited from the legacy WordPress site.
  // The capture preserved it verbatim: 85 visible "[email protected]"
  // strings and 58 <a href="/cdn-cgi/l/email-protection#<hex>"> links that
  // 404 here, because this deployment is not behind Cloudflare. Patients saw
  // the literal placeholder where an address should be.
  //
  // The real address is NOT invented — it is recoverable from the captured
  // hex, which is the address XORed byte-by-byte with its first byte. Decoded
  // across the payload: 46x info@kairali.com, 2x info@kairalil.com (a typo
  // domain on the legacy site), 1x the doubled-letter local part already
  // recorded in BUILD-STATUS, and 1x mylinkexchangepartner@gmail.com (SEO
  // link-exchange plumbing; the local part is the public one with a doubled
  // letter). Owner ruling D-20260915-04: restore the real
  // ones and NORMALISE all three non-standard addresses to the locked public
  // address, so nothing that bounces and no link-exchange mailbox ships.
  var PUBLIC_EMAIL = "info@kairali.com";
  function decodeCfEmail(hex) {
    if (!hex || hex.length < 4 || hex.length % 2) return null;
    var key = parseInt(hex.substr(0, 2), 16);
    if (isNaN(key)) return null;
    var out = "";
    for (var i = 2; i < hex.length; i += 2) {
      var c = parseInt(hex.substr(i, 2), 16);
      if (isNaN(c)) return null;
      out += String.fromCharCode(c ^ key);
    }
    return /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(out) ? out : null;
  }
  // Locked facts: info@kairali.com is the public contact address everywhere.
  // career@kairali.com is a separate approved departmental address and is NOT  // banned-string-allow: wrong-contact-email — D-20260915-06 names the address
  // cf-encoded, so it never reaches this function (D-20260915-06).
  function publicAddress(decoded) {
    return decoded === PUBLIC_EMAIL ? decoded : PUBLIC_EMAIL;
  }
  function repairEmailLinks(root) {
    if (!root || root.nodeType !== 1) return;
    var links = [];
    if (root.matches && root.matches('a[href*="email-protection"]')) links.push(root);
    root.querySelectorAll('a[href*="/cdn-cgi/l/email-protection"]').forEach(function (a) { links.push(a); });
    links.forEach(function (a) {
      if (a.__ahvEmailFixed) return;
      var raw = a.getAttribute("href") || "";
      var hash = raw.split("#")[1] || "";
      var address = publicAddress(decodeCfEmail(hash));
      a.setAttribute("href", "mailto:" + address);
      // Replace the placeholder wherever it is shown, including when the
      // anchor wraps other markup.
      if (/\\[email\\s*protected\\]/i.test(a.textContent || "")) a.textContent = address;
      a.__ahvEmailFixed = true;
      emailsFixed++;
    });
    // Placeholders captured as plain text with no surrounding link. The
    // substring test first: walking every text node of a 24,000px page on
    // each sweep tick is not free, and most pages carry no placeholder.
    if ((root.textContent || "").indexOf("[email") === -1) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var stray = [], node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue && /\\[email\\s*protected\\]/i.test(node.nodeValue)) stray.push(node);
    }
    stray.forEach(function (t) {
      t.nodeValue = t.nodeValue.replace(/\\[email\\s*protected\\]/gi, PUBLIC_EMAIL);
      emailsFixed++;
    });
  }
  var emailsFixed = 0;

  // Language switcher (25 Sep 2026, localization — replaces the decorative
  // EN/DE/FR pills of D-20260915-05 now that the locales exist). Built from
  // cfg.locale, which the server generates from the reviewed route table: every
  // option is a real, crawlable link to THIS page's equivalent in that language
  // (deep-link preserving, never a reset to the locale home). Hooks are data
  // attributes (data-ahv-lang-badge / data-ahv-drawer / data-ahv-lang-line,
  // tools/repair-language-hooks.mjs) because visible text and aria-labels are
  // translated. The choice is remembered for the visitor's own next visit; the
  // site never redirects by IP or browser language.
  var LOC = cfg.locale || { code: "en", options: [], ui: {} };
  var LOC_UI = LOC.ui || {};
  var LANG_SHORT = { "zh-Hans": "ZH" };
  function shortCode(code) { return LANG_SHORT[code] || String(code).slice(0, 2).toUpperCase(); }
  (function () {
    if (document.getElementById("ahv-lang-style")) return;
    var st = document.createElement("style");
    st.id = "ahv-lang-style";
    st.textContent =
      ".ahv-lang{position:relative;display:inline-flex}" +
      ".ahv-lang-btn{display:inline-flex;align-items:center;gap:6px;min-height:44px;min-width:44px;box-sizing:border-box;padding:0 clamp(6px,1.7vw,11px);border:1px solid #C9BFA8;border-radius:4px;background:transparent;color:#2A2118;font:inherit;font-weight:700;font-size:13px;letter-spacing:1px;cursor:pointer}" + /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
      ".ahv-lang-btn:focus-visible,.ahv-lang-list a:focus-visible,.ahv-lang-inline a:focus-visible{outline:3px solid #6B7726;outline-offset:2px}" + /* brand-allow: rogue-hex */
      ".ahv-lang-list{position:absolute;top:calc(100% + 6px);inset-inline-end:0;z-index:120;margin:0;padding:6px;list-style:none;background:#FFFDF7;border:1px solid #E2DACA;border-radius:6px;box-shadow:0 14px 34px rgba(42,32,20,.18);min-width:190px;max-height:calc(100vh - 96px);overflow:auto;overscroll-behavior:contain}" + /* brand-allow: rogue-hex */
      ".ahv-lang-list[hidden]{display:none}" +
      ".ahv-lang-list a,.ahv-lang-inline a{display:flex;align-items:center;gap:10px;min-height:44px;padding:0 12px;border-radius:4px;color:#2A2118;text-decoration:none;font-size:15px;font-weight:600;letter-spacing:0;text-transform:none;white-space:nowrap}" + /* brand-allow: rogue-hex */
      ".ahv-lang-list a:hover,.ahv-lang-inline a:hover{background:#F3EEDF;text-decoration:none}" + /* brand-allow: rogue-hex */
      ".ahv-lang-list a[aria-current],.ahv-lang-inline a[aria-current]{background:#EFE6CF;color:#006038}" + /* brand-allow: rogue-hex */
      ".ahv-lang-code{display:inline-block;min-width:26px;font-size:11.5px;font-weight:700;letter-spacing:1px;color:#75695A}" + /* brand-allow: rogue-hex */
      ".ahv-lang-inline{margin-top:16px;border-top:1px solid #E9E2D3;padding-top:12px}" + /* brand-allow: rogue-hex */
      ".ahv-lang-inline-h{font-size:11.5px;font-weight:700;letter-spacing:2.2px;text-transform:uppercase;color:#75695A;margin:0 0 6px}" + /* brand-allow: rogue-hex */
      ".ahv-lang-inline ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:2px 8px}";
    document.head.appendChild(st);
  })();
  function langLink(o) {
    var a = document.createElement("a");
    a.href = o.href;
    a.setAttribute("hreflang", o.lang);
    a.setAttribute("lang", o.lang);
    a.setAttribute("data-ahv-lang-option", o.code);
    var code = document.createElement("span");
    code.className = "ahv-lang-code";
    code.setAttribute("aria-hidden", "true");
    code.textContent = shortCode(o.code);
    var name = document.createElement("span");
    name.textContent = o.name;
    a.appendChild(code);
    a.appendChild(name);
    if (o.code === LOC.code) a.setAttribute("aria-current", "true");
    a.addEventListener("click", function () {
      try { localStorage.setItem("ahv-locale", o.code); } catch (_) { /* storage blocked: the link still works */ }
    });
    return a;
  }
  var langSeq = 0;
  function localeGroup() {
    var wrap = document.createElement("div");
    wrap.className = "ahv-lang";
    wrap.setAttribute("data-ahv-locale-switcher", "");
    var id;
    do { id = "ahv-lang-list-" + (++langSeq); } while (document.getElementById(id));
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ahv-lang-btn";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", id);
    var current = null;
    LOC.options.forEach(function (o) { if (o.code === LOC.code) current = o; });
    btn.setAttribute("aria-label", shortCode(LOC.code) + " — " + (LOC_UI.choose || "Choose language") + " — " + (LOC_UI.current || "Current language") + ": " + (current ? current.name : "English"));
    btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6.3" stroke="currentColor" stroke-width="1.4"></circle><ellipse cx="8" cy="8" rx="2.8" ry="6.3" stroke="currentColor" stroke-width="1.1"></ellipse><path d="M2 8h12" stroke="currentColor" stroke-width="1.1"></path></svg>';
    var lbl = document.createElement("span");
    lbl.textContent = shortCode(LOC.code);
    btn.appendChild(lbl);
    var list = document.createElement("ul");
    list.id = id;
    list.className = "ahv-lang-list";
    list.hidden = true;
    list.setAttribute("aria-label", LOC_UI.language || "Language");
    LOC.options.forEach(function (o) { var li = document.createElement("li"); li.appendChild(langLink(o)); list.appendChild(li); });
    function close(focusBtn) { list.hidden = true; btn.setAttribute("aria-expanded", "false"); if (focusBtn) btn.focus(); }
    function open() {
      list.hidden = false; btn.setAttribute("aria-expanded", "true");
      var cur = list.querySelector("a[aria-current]") || list.querySelector("a");
      if (cur) cur.focus();
    }
    btn.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); if (list.hidden) open(); else close(false); });
    wrap.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !list.hidden) { e.preventDefault(); close(true); return; }
      if (list.hidden || (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End")) return;
      var links = Array.prototype.slice.call(list.querySelectorAll("a"));
      var i = links.indexOf(document.activeElement);
      e.preventDefault();
      if (e.key === "Home") i = 0; else if (e.key === "End") i = links.length - 1;
      else i = (i + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
      links[i].focus();
    });
    wrap.addEventListener("focusout", function (e) { if (!wrap.contains(e.relatedTarget)) close(false); });
    document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) close(false); });
    wrap.appendChild(btn);
    wrap.appendChild(list);
    return wrap;
  }
  function inlineLanguages() {
    var nav = document.createElement("nav");
    nav.className = "ahv-lang-inline";
    nav.setAttribute("aria-label", LOC_UI.language || "Language");
    nav.setAttribute("data-ahv-locale-inline", "");
    var h = document.createElement("p");
    h.className = "ahv-lang-inline-h";
    h.textContent = LOC_UI.language || "Language";
    nav.appendChild(h);
    var ul = document.createElement("ul");
    LOC.options.forEach(function (o) { var li = document.createElement("li"); li.appendChild(langLink(o)); ul.appendChild(li); });
    nav.appendChild(ul);
    return nav;
  }
  function upgradeLanguageControls(root) {
    if (!root || root.nodeType !== 1 || !LOC.options.length) return;
    // EVERY badge, not the first: non-homepage routes mount a duplicate hidden
    // header ahead of the visible one; whichever is displayed is correct.
    root.querySelectorAll("[data-ahv-lang-badge]").forEach(function (el) {
      if (el.hasAttribute("data-ahv-locale-done")) return;
      var g = localeGroup();
      g.setAttribute("data-ahv-locale-done", "");
      el.replaceWith(g);
      localesUpgraded++;
    });
    root.querySelectorAll("[data-ahv-lang-line], [data-ahv-drawer]").forEach(function (el) {
      if (el.querySelector("[data-ahv-locale-inline]")) return;
      if (el.hasAttribute("data-ahv-lang-line")) { el.replaceWith(inlineLanguages()); localesUpgraded++; return; }
      el.appendChild(inlineLanguages());
      localesUpgraded++;
    });
  }
  var localesUpgraded = 0;

  // Locale UI dictionary (English source -> accepted translation), installed by
  // the locale layout as window.__AHV_T; English pages have none and fall through.
  function T(s) { var d = window.__AHV_T; return (d && d[s]) || s; }
  ${CONSENT_RUNTIME}

  /**
   * Verification metas. Some approved programme views write their own copies
   * client-side, carrying the SAME tokens this build serves from
   * analytics.config.json. Two of each is untidy and pointless, and the
   * server-rendered one is the copy a crawler actually reads, so the first of
   * each name wins and later duplicates are dropped — the same governed-head
   * rule the head guard above already applies per slot.
   */
  function dedupeVerificationMetas() {
    ["google-site-verification", "msvalidate.01", "facebook-domain-verification"].forEach(function (name) {
      var nodes = document.head.querySelectorAll('meta[name="' + name + '"]');
      for (var i = 1; i < nodes.length; i++) nodes[i].remove();
    });
  }

  function applyConsent() {
    ensureConsentNotice();
    dedupeVerificationMetas();
    applyConsentMode(consentChoice());
    if (consentChoice() === "accepted") startMeasurement();
  }

  // Enquiry form placement. On /enquiry-form/ the form sat ~6,000px down an
  // ~8,400px page -- about fifteen phone screens of scrolling before a patient
  // could enquire, on the page whose entire job is enquiries. The approved
  // design does ship a "Skip to the enquiry form" link, but it is a 1px
  // visually-hidden skip link: real for a keyboard or screen reader, invisible
  // to everyone else. Owner-reported ("format looked bad, the original was
  // better"); owner ruled BOTH remedies, 2026-09-15.
  //
  // Nothing is deleted, re-worded or re-styled. The form element is MOVED to
  // the top of the column it already lives in, and self-referencing CTAs are
  // pointed at it. Every section, all copy and all styling survive unchanged.
  var formLifted = false;
  function liftEnquiryForm() {
    if (formLifted) return;
    var form = host.querySelector("form[id]");
    if (!form) return;
    var column = form.parentElement;
    if (!column || column.children.length < 2) return;
    // Keep the skip link first so it still precedes what it targets; the form
    // goes immediately after it, ahead of the long editorial block.
    var first = column.firstElementChild;
    var afterSkip = first && first.tagName === "A" && /^#/.test(first.getAttribute("href") || "")
      ? first.nextSibling
      : first;
    if (form === afterSkip) { formLifted = true; return; }
    column.insertBefore(form, afterSkip);
    formLifted = true;
  }

  // A call to action that points at the page you are already on does nothing.
  // The sticky bar's "Enquire" is exactly that on the enquiry page. Where the
  // page carries a form with an id, those self-links scroll to it instead.
  function retargetSelfLinks(root) {
    if (!root || root.nodeType !== 1) return;
    var form = host.querySelector("form[id]");
    if (!form || !form.id) return;
    var here = window.location.pathname.replace(/[/]$/, "");
    var links = [];
    if (root.matches && root.matches("a[href]")) links.push(root);
    root.querySelectorAll("a[href]").forEach(function (a) { links.push(a); });
    links.forEach(function (a) {
      if (a.__ahvSelfRetargeted) return;
      var raw = a.getAttribute("href") || "";
      if (/^#/.test(raw)) return;
      var url;
      try { url = new URL(raw, window.location.href); } catch (e) { return; }
      if (url.origin !== window.location.origin) return;
      if (url.pathname.replace(/[/]$/, "") !== here) return;
      a.setAttribute("href", "#" + form.id);
      a.__ahvSelfRetargeted = true;
    });
  }

  var hpNames = [];
  function hideHoneypots(root) {
    if (!root || root.nodeType !== 1) return;
    // Most added nodes contain no input. Dataset discovery caches each object,
    // including empty results, while still seeing later/replaced family globals.
    if (!root.matches("input") && !root.querySelector("input")) return;
    try { hpNames = honeypotNames(); } catch (e) { hpNames = []; }
    if (!hpNames.length) return;
    hpNames.forEach(function (name) {
      var inputs = Array.prototype.slice.call(root.querySelectorAll('input[name="' + name + '"]'));
      if (root.matches('input[name="' + name + '"]')) inputs.unshift(root);
      inputs.forEach(function (input) {
        if (input.__ahvHoneypotHidden) return;
        var field = input.closest("label") || input.parentElement || input;
        // Off-screen rather than display:none — a bot reading the DOM still
        // sees a fillable field, which is the whole point of a honeypot.
        field.style.position = "absolute";
        field.style.left = "0";
        field.style.clipPath = "inset(50%)";
        field.style.width = "1px";
        field.style.height = "1px";
        field.style.overflow = "hidden";
        field.setAttribute("aria-hidden", "true");
        input.setAttribute("tabindex", "-1");
        input.setAttribute("autocomplete", "off");
        input.__ahvHoneypotHidden = true;
        hpHidden++;
      });
    });
  }
  // The dataset global is loaded by the family script and the form is rendered
  // after it, both later than the 2.4s slot sweep — so honeypots get their own
  // longer watch that stops as soon as it has actually hidden one.
  var hpHidden = 0;
  function sweepHoneypots(tries) {
    hideHoneypots(host);
    repairEmailLinks(host);
    upgradeLanguageControls(host);
    applyConsent();
    liftEnquiryForm();
    retargetSelfLinks(host);
    // Keep going while EITHER repair still has nothing to show for itself —
    // stopping at the honeypot alone would cut the email repair short on the
    // enquiry page, which carries both. Once the interactive snapshot replaces
    // its placeholder, the mutation observer handles later additions. Pages
    // without a honeypot/email repair must not rescan the whole page 150 times.
    if ((hpHidden === 0 || emailsFixed === 0 || localesUpgraded === 0) && tries > 0 && host.getAttribute("data-ahv-snapshot-state") !== "retired") {
      setTimeout(function () { sweepHoneypots(tries - 1); }, 80);
    }
  }
  new MutationObserver(function (changes) {
    // A delivery can contain a parent insertion AND insertions into that parent.
    // Repair the final attached subtree once, not once per nested mutation record.
    // Detached nodes belong to discarded runtime renders and need no repair.
    var addedRoots = new Set();
    changes.forEach(function (change) {
      if (change.type !== "childList") return;
      change.addedNodes.forEach(function (node) {
        if (node.nodeType === 1 && host.contains(node)) addedRoots.add(node);
      });
    });
    addedRoots.forEach(function (node) {
      for (var parent = node.parentElement; parent && parent !== host; parent = parent.parentElement) {
        if (addedRoots.has(parent)) { addedRoots.delete(node); break; }
      }
    });
    var addedContent = false;
    changes.forEach(function (change) {
      if (change.type === "childList") lastLiveChange = Date.now();
      // style: an element that gains an inline background later (a rewritten style attribute) is
      // deferred like a new one; only the element itself is checked, never its subtree.
      if (change.type === "attributes") {
        if (change.attributeName === "style") deferBackgrounds(change.target, true);
        else localizeLink(change.target);
      }
      else change.addedNodes.forEach(function (node) {
        addedContent = true;
        if (!addedRoots.delete(node)) return;
        localizeLinks(node);
        restoreSlotScrolling(node);
        deferSlotImages(node);
        deferBackgrounds(node);
        aliasImages(node);
        startIstClock(node);
        hideHoneypots(node);
        repairEmailLinks(node);
        upgradeLanguageControls(node);
        retargetSelfLinks(node);
      });
    });
    // These scan the entire host/document, unlike the node-local repairs above.
    // One mutation delivery already contains the completed DOM batch: scanning
    // it again for every added node caused quadratic work during hydration.
    if (addedContent) { enhanceDirections(host); applyConsent(); describeHomeNewsLinks(host); }
  }).observe(host, { childList: true, subtree: true, attributes: true, attributeFilter: ["href", "style"] });
  // Also normalize synchronously before native activation, including middle
  // clicks and copied link addresses, without overriding browser behavior.
  ["click", "auxclick", "contextmenu", "focusin"].forEach(function (event) {
    host.addEventListener(event, function (e) {
      var target = e.target;
      if (target && target.closest) localizeLink(target.closest("a[href], area[href]"));
    }, true);
  });

  // Step 1 — sibling component map. Also makes support.js skip its
  // location.href re-fetch, which would look for an <x-dc> this page does not
  // serve (the template arrives as JSON).
  window.__resources = cfg.resources || {};

  var mql = window.matchMedia
    ? window.matchMedia("(max-width: " + (cfg.breakpoint - 1) + "px)")
    : null;
  var narrow = !!(mql && mql.matches);
  var id = (narrow && cfg.mobileView) || cfg.desktopView || cfg.mobileView;
  if (!id) return;

  // Re-pick the variant when the breakpoint is crossed. The two views are
  // separate approved documents, not one fluid layout, so the switch is a
  // reload rather than a re-render.
  if (mql && mql.addEventListener) {
    mql.addEventListener("change", function () { location.reload(); });
  }

  // Step 8 — staging head. Runs after boot and on every later head mutation,
  // because the family renderers call applyHead() whenever the bound record
  // changes and would otherwise reinstate the source's "index, follow".
  function drop(node) {
    if (node && node.parentNode) node.parentNode.removeChild(node);
  }

  /**
   * The family renderers mark every head node they own with data-ahv-head and
   * state the rule in their own source: where a governed node exists, the
   * view's static <helmet> node for the same slot must not survive, "otherwise
   * two canonicals and two titles would coexist and the first would win".
   *
   * That rule has to be re-applied here because the helmet is re-applied every
   * time the template is pushed, which happens after the renderer has written
   * its head. This enforces the renderer's rule as the final state; it does not
   * invent one.
   */
  function governedWins(selector) {
    var all = [];
    var found = document.head.querySelectorAll(selector);
    for (var i = 0; i < found.length; i++) all.push(found[i]);
    if (all.length < 2) return all[0] || null;
    var governed = all.filter(function (n) { return n.hasAttribute("data-ahv-head"); });
    var keepSet = governed.length ? governed : all;
    all.forEach(function (n) { if (keepSet.indexOf(n) < 0) drop(n); });
    // Same slot twice from the same source: keep the last written.
    for (var j = 0; j < keepSet.length - 1; j++) drop(keepSet[j]);
    return keepSet[keepSet.length - 1];
  }

  function enforceStagingHead() {
    governedWins("title");
    governedWins('link[rel="canonical"]');
    governedWins('meta[name="description"]');
    // og:* and twitter:* are many slots, so they dedupe per property name.
    var tagged = document.head.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]');
    var byKey = {};
    for (var i = 0; i < tagged.length; i++) {
      var el = tagged[i];
      var key = el.getAttribute("property") || el.getAttribute("name");
      (byKey[key] = byKey[key] || []).push(el);
    }
    Object.keys(byKey).forEach(function (key) {
      if (byKey[key].length < 2) return;
      // The share-card image and its subproperties are the SERVER's to set:
      // metadata.ts emits a generated 1200x630 card per route, replacing the
      // source's og:image (71 routes had none, 180 pointed at /wp-content/,
      // the homepage's 404s). The design's own head writer re-adds the source
      // value after mount; for image keys the server node must win so the
      // rendered DOM agrees with what scrapers -- which never run JS -- read.
      if (key.indexOf("og:image") === 0 || key.indexOf("twitter:image") === 0) {
        var nodes = byKey[key];
        var server = nodes.filter(function (n) { return !n.hasAttribute("data-ahv-head"); });
        var keepNode = server.length ? server[server.length - 1] : nodes[nodes.length - 1];
        nodes.forEach(function (n) { if (n !== keepNode) drop(n); });
        return;
      }
      governedWins(
        'meta[property="' + key + '"], meta[name="' + key + '"]'
      );
    });

    // Keep one robots value in both modes. Imported payloads carry staging
    // values, so production must enforce the server's explicit route policy.
    assertShareTags();
    var keep = governedWins('meta[name="robots"]');
    var expectedRobots = STAGING ? "noindex, nofollow" : (cfg.robots || "noindex, follow");
    if (!keep) {
      keep = document.createElement("meta");
      keep.setAttribute("name", "robots");
      document.head.appendChild(keep);
    }
    if (keep.getAttribute("content") !== expectedRobots) {
      keep.setAttribute("content", expectedRobots);
    }
  }
  var headScheduled = false;
  function scheduleHead() {
    if (headScheduled) return;
    headScheduled = true;
    (window.requestAnimationFrame || setTimeout)(function () {
      headScheduled = false;
      enforceStagingHead();
    }, 0);
  }
  if (window.MutationObserver) {
    new MutationObserver(scheduleHead).observe(document.head, { childList: true, subtree: true });
  }
  enforceStagingHead();

  function fail(err) {
    host.setAttribute("data-ahv-error", String((err && err.message) || err));
    if (window.console) console.error("[ahv] design payload failed:", err);
  }

  // Steps 6b/7 — hand the runtime the SOURCE template text and bind the route,
  // through the runtime's own channels, once it exposes them.
  //
  // __dcUpdate(name, "html", text) is the same entry point the package's own
  // self-repair uses when it re-fetches its document and re-parses the template
  // from source. It is what makes <sc-for> inside <tbody> survive: the browser's
  // table-content parsing rules would otherwise foster-parent that element out
  // of the table and collapse the rows.
  //
  // The prop default in the payload is the primary binding; this is the
  // readiness retry: the runtime can expose a temporary root name before boot.
  // Bind once per observed root. setProps unconditionally bumps the registry,
  // so repeating identical props forced forty full-page React renders.
  // Continue watching for the final name without re-rendering an unchanged root.
  var pendingTemplate = null;
  var templatePushed = false;
  var boundRouteName = null;

  // A slot upgrades when image-slot.js runs, which is AFTER its element is in
  // the DOM, so the MutationObserver above can see the node before it has a
  // shadow root. Sweep on the same retry cadence as bindRoute so late upgrades
  // and <sc-for>-rendered list slots are covered too.
  function sweepSlots(tries) {
    // General repairs already run for added nodes. Only custom elements can
    // upgrade without another host mutation, so retry those pending slots.
    var pending = false;
    host.querySelectorAll("image-slot").forEach(function (slot) {
      if (!slot.__ahvTouchFixed) restoreSlotScroll(slot);
      if (!slot.__ahvLazySet) deferSlotImage(slot);
      if (!slot.__ahvTouchFixed || !slot.__ahvLazySet) pending = true;
    });
    if (pending && tries > 0) setTimeout(function () { sweepSlots(tries - 1); }, 60);
  }

  function bindRoute(tries) {
    if (typeof window.__dcSetProps === "function" && typeof window.__dcRootName === "function") {
      var name = window.__dcRootName();
      var headChanged = false;
      if (!templatePushed && pendingTemplate && typeof window.__dcUpdate === "function") {
        try {
          window.__dcUpdate(name, "html", pendingTemplate, false);
          templatePushed = true;
          headChanged = true;
          host.setAttribute("data-ahv-template", "source");
          releaseSnapshot();
        } catch (e) {
          fail(e);
        }
      }
      try {
        if (name !== boundRouteName) {
          window.__dcSetProps(name, { route: cfg.path });
          boundRouteName = name;
          headChanged = true;
        }
      } catch (e) { /* a view without a route prop simply ignores it */ }
      // Readiness polling without a render cannot change the head. Later head
      // writes are independently guarded by its existing MutationObserver.
      if (headChanged) scheduleHead();
    }
    if (tries > 0) setTimeout(function () { bindRoute(tries - 1); }, 60);
  }

  // Same-origin credentials preserve Preview authentication and match the
  // anonymous CORS preload, which also includes same-origin credentials.
  fetch(cfg.payloadBase + id + ".json", { credentials: "same-origin" })
    .then(function (r) {
      if (!r.ok) throw new Error("view " + id + " -> HTTP " + r.status);
      return r.json();
    })
    .then(function (view) {
      // On a phone with a snapshot the runtime chain starts after the snapshot's first paint
      // (snapshot-paint.mjs): the snapshot is what the reader sees meanwhile, so this only moves script
      // downloads out of the first paint's way. Desktop and snapshot-less pages continue at once.
      // The page repairs and the cookie notice (sweepHoneypots -> applyConsent) keep their timing: they
      // start the moment the payload arrives, exactly as before, so the notice and the contact controls
      // it lifts are in place for the first paint (deferring them moved #ahv-contact-controls on screen).
      sweepHoneypots(150);
      return new Promise(function (resolve) {
        (${whenSnapshotPainted.toString()})(window, narrow && snapshotNodes.length > 0, resolve, 3000);
      }).then(function () { return view; });
    })
    .then(function (view) {
      // The template is mounted EMPTY and pushed as raw text below. It is never
      // written into the DOM as markup, because the HTML parser would silently
      // rewrite it: the approved views put <sc-for> inside <tbody>, and an
      // unknown element in table content gets foster-parented out, which
      // collapsed every villa room table and two programme tables to a single
      // empty row. The package hits the same parser and repairs itself by
      // re-fetching its own document and re-parsing the template from source
      // text; this page has no <x-dc> to re-fetch, so it hands the runtime the
      // source text directly through the runtime's own channel.
      // Mounting empty also means the 281 interpolated lazy images never exist
      // as DOM nodes before compilation, so no "{{ expr }}" is ever resolved
      // as a URL.
      // The snapshot stays where it is (see releaseSnapshot): the runtime takes
      // the first <x-dc> in the document and replaces it with its own root.
      // FIRST child, ahead of the snapshot (see retireSnapshot): the live page is laid out at the top
      // from the start, and first-match queries in the sitewide scripts find the live copy.
      // data-ahv-live-pending keeps it out of flow and invisible until the swap (site-document.tsx);
      // only while there is a snapshot to swap with — a page without one shows its live view as it renders.
      if (snapshotNodes.length) host.setAttribute("data-ahv-live-pending", "");
      host.insertBefore(document.createElement("x-dc"), host.firstChild);
      // lazyImgFirst: loading="lazy" ahead of src in every template <img> (media-loading.mjs, P1a).
      pendingTemplate = (${lazyImgFirst.toString()})((${formPostSafety.toString()})((${descriptiveAwardLinks.toString()})(narrow ? (${phoneCriticalMedia.toString()})(view.template) : view.template, cfg.path)));
      host.setAttribute("data-ahv-view", view.id);
      host.setAttribute("data-ahv-variant", view.variant);
      host.setAttribute("data-ahv-view-file", view.file || "");

      var props = {};
      if (view.props) { try { props = JSON.parse(view.props); } catch (e) { props = {}; } }
      if (props && props.route) props.route.default = cfg.path;

      var logic = document.createElement("script");
      logic.type = "text/x-dc";
      logic.setAttribute("data-dc-script", "");
      logic.setAttribute("data-props", JSON.stringify(props));
      // deferHeroFilm: the homepage film starts after load + idle on wide screens (media-loading.mjs, P3).
      logic.text = (${deferHeroFilm.toString()})(view.logic || "");
      host.appendChild(logic);

      // Step 5 — the accepted preview layer self-attaches from its own tag,
      // using the exact view filename the package's marker list keys on.
      var srcs = [{ src: cfg.previewSrc, view: view.file || "" }];
      (view.scripts || []).forEach(function (s) { srcs.push({ src: s }); });
      srcs.push({ src: cfg.supportSrc });

      srcs.forEach(function (entry) {
        var s = document.createElement("script");
        s.src = entry.src;
        if (entry.view) s.setAttribute("data-ahv-view", entry.view);
        s.async = false; // keeps classic-script execution in insertion order
        s.onload = function () { honeypotDatasetCache = new WeakMap(); hideHoneypots(host); };
        s.onerror = function () { fail(new Error("script " + entry.src)); };
        host.appendChild(s);
      });

      bindRoute(40);
      sweepSlots(40);
      if (window.customElements && window.customElements.whenDefined) {
        window.customElements.whenDefined("image-slot").then(function () { sweepSlots(40); });
      }
    })
    .catch(fail);
})();
`.trim();
