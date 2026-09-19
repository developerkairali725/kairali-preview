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
  path: string;
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
  measurement?: { ga4?: string; clarity?: string; metaPixel?: string };
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
  function liveRoot() {
    var kids = host.children;
    for (var i = 0; i < kids.length; i++) {
      var k = kids[i];
      if (k.hasAttribute("data-ahv-snapshot") || k.tagName === "SCRIPT" || k.tagName === "X-DC") continue;
      return k;
    }
    return null;
  }
  function retireSnapshot(tries) {
    var live = liveRoot();
    if (live && (live.innerText || "").trim().length > 200) {
      for (var i = 0; i < snapshotNodes.length; i++) {
        if (snapshotNodes[i].parentNode) snapshotNodes[i].parentNode.removeChild(snapshotNodes[i]);
      }
      snapshotNodes = [];
      host.setAttribute("data-ahv-snapshot-state", "retired");
      return;
    }
    if (tries > 0) { setTimeout(function () { retireSnapshot(tries - 1); }, 100); return; }
    // The runtime never rendered: give the visitor the snapshot back rather
    // than an empty page.
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
    // Source media links are downloads, not website page navigation.
    if (/[.](pdf|jpg|jpeg|png|webp|gif|svg|mp4|zip)$/i.test(url.pathname)) return;
    // Source links use older spellings; resolve to the approved pages. The map
    // is english-candidate/link-aliases.json so that ONE list serves both this
    // runtime pass and tools/apply-link-aliases.mjs, which rewrites the same
    // hrefs inside the prerendered snapshots. Before that, a legacy spelling
    // was corrected for a visitor but still shipped broken in the server HTML,
    // which is what a crawler and a no-JS first paint actually read.
    var aliases = ${JSON.stringify(LINK_ALIASES)};
    var path = aliases[url.pathname.replace(/[/]$/, "")] || url.pathname;
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
        if (t) sp.textContent = "Now " + t; else if (sp.parentElement) sp.parentElement.hidden = true;
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
   * The first few are left eager -- they are the LCP candidates -- and every slot
   * after them is marked lazy, so the gallery loads as the patient scrolls to it
   * rather than competing with the hero. Applied from our side, on the shadow
   * root, so no approved byte is edited and a re-import cannot undo it.
   */
  var slotsSeen = 0;
  function deferSlotImage(slot) {
    if (!slot || slot.__ahvLazySet) return;
    var shadow = slot.shadowRoot;
    if (!shadow) return;
    var img = shadow.querySelector(".frame img");
    if (!img) return;
    slot.__ahvLazySet = true;
    slotsSeen++;
    if (slotsSeen <= 3) {
      img.setAttribute("fetchpriority", "high");
      img.removeAttribute("loading");
      return;
    }
    if (!img.getAttribute("loading")) img.setAttribute("loading", "lazy");
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
  function honeypotNames() {
    var names = [];
    Object.keys(window).forEach(function (key) {
      if (key.indexOf("AHV_") !== 0) return;
      var seen = 0;
      (function scan(node) {
        if (!node || typeof node !== "object" || seen++ > 20000) return;
        if (Array.isArray(node)) { node.forEach(scan); return; }
        if (node.honeypot === true && typeof node.name === "string") {
          if (names.indexOf(node.name) === -1) names.push(node.name);
        } else if (node.honeypot && typeof node.honeypot === "object" && typeof node.honeypot.name === "string") {
          if (names.indexOf(node.honeypot.name) === -1) names.push(node.honeypot.name);
        }
        Object.keys(node).forEach(function (k) { scan(node[k]); });
      })(window[key]);
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
  // career@kairali.com is a separate approved departmental address and is NOT
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

  // Language switcher. The approved chrome ships a DECORATIVE locale control:
  // the header "EN" is a bare <span> with no handler, and the mobile menu
  // carries a plain <div> reading "ENGLISH - FRANCAIS - DEUTSCH". Neither is
  // wired to anything, and this build is English-only by instruction, so there
  // is nothing for them to point at. grep -c 'lang' over the header component
  // returns 0. Owner-reported 15 Sep 2026; ruling D-20260915-05: show EN as
  // current and DE/FR as visibly unavailable rather than hiding the control,
  // so the multilingual signal survives and the day translations ship this
  // becomes a real switcher.
  //
  // Built here rather than in the payload: public/ahv/components/*.dc.html is
  // approved source that the importer rewrites wholesale. The visual language
  // (1px #C9BFA8 border, 4px radius, 44px min target) is copied from the  [brand-allow: rogue-hex]
  // existing EN badge so nothing is re-themed.
  // One rule, installed once: the pending locale pills are display:none below the
  // design's own 700px breakpoint, which is the same width at which the design
  // swaps to its Mobile view.
  (function () {
    if (document.getElementById("ahv-locale-narrow")) return;
    var st = document.createElement("style");
    st.id = "ahv-locale-narrow";
    st.textContent = "@media (max-width:699px){[data-ahv-locale-pending]{display:none !important}}";
    document.head.appendChild(st);
  })();

  var LOCALES = [
    { code: "EN", name: "English", live: true },
    { code: "DE", name: "Deutsch", live: false },
    { code: "FR", name: "Fran\u00e7ais", live: false }
  ];
  function localePill(loc) {
    var el = document.createElement("span");
    el.textContent = loc.code;
    el.setAttribute("data-ahv-locale", loc.code);
    var base = "border:1px solid #C9BFA8;border-radius:4px;padding:0 clamp(6px,1.7vw,11px);" + /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
      "min-height:44px;box-sizing:border-box;display:inline-flex;align-items:center;" +
      "font-weight:700;font-size:13px;letter-spacing:1px;";
    if (loc.live) {
      el.setAttribute("aria-current", "true");
      el.style.cssText = base + "color:#2A2118;"; /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
    } else {
      // HIDDEN ON PHONES. Three pills plus BOOK NOW overran the header row by up
      // to 39px, and 94% of routes scrolled sideways at 360px because of it --
      // a mobile-usability fault Google flags, on a site that is 80% mobile.
      // These two are non-functional "coming soon" placeholders, so on a narrow
      // screen they were costing real layout to advertise pages that do not
      // exist yet. They return by themselves once de/fr ship, because the pill
      // becomes live and takes the branch above.
      el.setAttribute("data-ahv-locale-pending", "");
      // Not a link and not focusable: there is no page to go to yet. Announced
      // as unavailable rather than silently inert.
      el.setAttribute("aria-disabled", "true");
      el.setAttribute("title", loc.name + " \u2014 coming soon");
      el.setAttribute("aria-label", loc.name + " \u2014 coming soon");
      el.style.cssText = base + "color:#A79C89;border-color:#E2DACA;cursor:default;"; /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
    }
    return el;
  }
  function localeGroup() {
    var nav = document.createElement("nav");
    nav.setAttribute("aria-label", "Language");
    nav.setAttribute("data-ahv-locale-switcher", "");
    nav.style.cssText = "display:inline-flex;align-items:center;gap:6px;";
    LOCALES.forEach(function (loc) { nav.appendChild(localePill(loc)); });
    return nav;
  }
  function upgradeLanguageControls(root) {
    if (!root || root.nodeType !== 1) return;
    // EVERY header badge, not the first: non-homepage routes mount a duplicate
    // hidden <header> ahead of the visible one, so upgrading only the first
    // left the real header decorative and put the new control where nobody
    // could see it. Both are upgraded; whichever is displayed is correct.
    root.querySelectorAll("header span, header div, header button, header a").forEach(function (el) {
      if ((el.textContent || "").trim() !== "EN") return;
      if (el.hasAttribute("data-ahv-locale")) return;
      // Innermost match only. The desktop header wraps the badge as
      // <span><svg/>EN</span> while the mobile header uses a bare <span>, so a
      // childless test skipped the desktop one and a naive test would replace
      // an outer wrapper and take the icon with it.
      var inner = false;
      el.querySelectorAll("*").forEach(function (d) {
        if ((d.textContent || "").trim() === "EN") inner = true;
      });
      if (inner) return;
      el.replaceWith(localeGroup());
      localesUpgraded++;
    });
    // The mobile menu's static locale line.
    root.querySelectorAll("div, p, span").forEach(function (el) {
      if (el.childElementCount !== 0) return;
      var t = (el.textContent || "").replace(/\\s+/g, " ").trim();
      // Separator-agnostic: the captured line uses a middot, but the same
      // static line appears with other separators across the chrome variants.
      if (t.length > 64) return;
      if (!/ENGLISH/i.test(t) || !/FRAN\u00c7AIS/i.test(t) || !/DEUTSCH/i.test(t)) return;
      var wrap = document.createElement("div");
      wrap.style.cssText = "display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:16px;";
      wrap.appendChild(localeGroup());
      var note = document.createElement("span");
      note.textContent = "Deutsch and Fran\u00e7ais coming soon";
      note.style.cssText = "font-size:12px;letter-spacing:.3px;color:#75695A;"; /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
      wrap.appendChild(note);
      el.replaceWith(wrap);
      localesUpgraded++;
    });
  }
  var localesUpgraded = 0;

  // Cookie notice. The approved design HAS a real consent mechanism — the home
  // view logic writes localStorage["ktahv-consent"] = "accepted" | "declined"
  // and shows the notice only while the value is absent — but the notice markup
  // lives in the two HOME views only: 2 of 136 templates. 250 of the 252 routes
  // offered no way to accept or decline, so anyone arriving on a programme page
  // from search had no choice at all. Owner-reported 15 Sep 2026.
  //
  // This EXTENDS the approved mechanism rather than replacing it: the same
  // storage key, the same two values, the same copy and the same styling lifted
  // from the approved home view. A choice made on any page therefore suppresses
  // the notice on every page, including the design's own homepage banner, so
  // the two can never both appear or disagree.
  var CONSENT_KEY = "ktahv-consent";
  function consentChoice() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return "unavailable"; }
  }
  function recordConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) { /* private mode: honour the choice for this page view only */ }
    var el = document.getElementById("ahv-consent");
    if (el) el.remove();
    if (value === "accepted") startMeasurement();
  }
  function consentNotice() {
    var narrow = window.matchMedia && window.matchMedia("(max-width: 700px)").matches;
    var wrap = document.createElement("div");
    wrap.id = "ahv-consent";
    wrap.setAttribute("role", "region");
    wrap.setAttribute("aria-label", "Cookie notice");
    // Sits above the design's fixed bottom action bar on narrow screens, which
    // is why the approved home notice uses bottom:74px there.
    wrap.style.cssText = "position:fixed;left:12px;right:12px;bottom:" + (narrow ? "74px" : "18px") +
      ";z-index:60;max-width:" + (narrow ? "406px" : "520px") + ";margin:0 auto;background:#fff;" + /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
      "border:1px solid #E9E2D3;border-radius:4px;box-shadow:0 7px 25px rgba(60,45,20,.08);padding:18px 20px"; /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
    var copy = document.createElement("div");
    copy.style.cssText = "font-size:14.5px;color:#514a3f;line-height:1.55"; /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
    copy.appendChild(document.createTextNode("We use cookies to improve your experience and analyse site traffic. See our "));
    var policy = document.createElement("a");
    policy.setAttribute("href", "/privacy-policy/");
    policy.style.cssText = "font-weight:700";
    policy.textContent = "Privacy Policy";
    copy.appendChild(policy);
    copy.appendChild(document.createTextNode("."));
    var row = document.createElement("div");
    row.style.cssText = "display:flex;gap:12px;align-items:center;margin-top:14px";
    var decline = document.createElement("button");
    decline.type = "button";
    decline.textContent = "Decline";
    decline.style.cssText = "flex:1;background:none;border:1px solid #C9BFA8;border-radius:4px;" + /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
      "font-family:'Mulish',sans-serif;font-weight:700;font-size:12.5px;letter-spacing:1.5px;color:#75695A;" + /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
      "cursor:pointer;text-transform:uppercase;padding:14px 6px;min-height:44px";
    decline.addEventListener("click", function () { recordConsent("declined"); });
    var accept = document.createElement("button");
    accept.type = "button";
    accept.textContent = "Accept All";
    accept.style.cssText = "flex:1;background:#5A4420;color:#F7F4EA;border:none;border-radius:4px;" + /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
      "padding:14px 6px;font-family:'Mulish',sans-serif;font-weight:600;font-size:12.5px;letter-spacing:1.5px;" +
      "cursor:pointer;text-transform:uppercase;min-height:44px";
    accept.addEventListener("click", function () { recordConsent("accepted"); });
    row.appendChild(decline);
    row.appendChild(accept);
    wrap.appendChild(copy);
    wrap.appendChild(row);
    return wrap;
  }
  /** The design's own notice, if this view renders one. Excludes ours. */
  function designNotice() {
    var found = null;
    document.querySelectorAll("button").forEach(function (b) {
      if (found || b.closest("#ahv-consent")) return;
      if (/^accept all$/i.test((b.textContent || "").trim())) found = b;
    });
    return found;
  }
  function ensureConsentNotice() {
    var choice = consentChoice();
    var mine = document.getElementById("ahv-consent");
    // The home views render the approved notice THEMSELVES, and they render it
    // after the design mounts — later than the first sweep tick. So this cannot
    // be a one-shot check: it has to keep looking and withdraw ours the moment
    // theirs appears, or the homepage shows two banners. That exact double-up
    // is why this lane has its own root layout in the first place.
    if (designNotice()) {
      if (mine) mine.remove();
      return;
    }
    if (mine) return;
    if (choice === "accepted" || choice === "declined") return;
    if (choice === "unavailable") return; // cannot record a choice; do not pretend to offer one
    // Wait for the design to mount before adding ours, so a view that carries
    // its own notice is never briefly given a second one.
    if (!host.firstElementChild) return;
    document.body.appendChild(consentNotice());
  }

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

  // Measurement. Every id comes from analytics.config.json, which records what
  // the LIVE site already runs; nothing is invented. Two independent locks:
  // the build must set AHV_ANALYTICS=1, AND the visitor must have accepted.
  // Both are off on staging by the owner's 15 Sep ruling, so a preview reviewer
  // never lands in the production GA4 and Clarity data.
  var measurementStarted = false;
  function startMeasurement() {
    if (measurementStarted) return;
    var m = cfg.measurement;
    if (!m) return; // build-time switch is off: nothing to start
    measurementStarted = true;
    if (m.ga4) {
      var g = document.createElement("script");
      g.async = true;
      g.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(m.ga4);
      document.head.appendChild(g);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", m.ga4);
    }
    if (m.clarity) {
      window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
      var c = document.createElement("script");
      c.async = true;
      c.src = "https://www.clarity.ms/tag/" + encodeURIComponent(m.clarity);
      document.head.appendChild(c);
    }
    if (m.metaPixel) {
      var f = document.createElement("script");
      f.async = true;
      f.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(f);
      window.fbq = window.fbq || function () {
        (window.fbq.queue = window.fbq.queue || []).push(arguments);
      };
      window.fbq("init", m.metaPixel);
      window.fbq("track", "PageView");
    }
  }
  function applyConsent() {
    ensureConsentNotice();
    dedupeVerificationMetas();
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
    // Recomputed until it finds something: the dataset global is loaded by the
    // family script, which runs AFTER the first sweep tick, so caching an empty
    // first result would disable this permanently.
    if (!hpNames.length) { try { hpNames = honeypotNames(); } catch (e) { hpNames = []; } }
    if (!hpNames.length) return;
    hpNames.forEach(function (name) {
      root.querySelectorAll('input[name="' + name + '"]').forEach(function (input) {
        if (input.__ahvHoneypotHidden) return;
        var field = input.closest("label") || input.parentElement || input;
        // Off-screen rather than display:none — a bot reading the DOM still
        // sees a fillable field, which is the whole point of a honeypot.
        field.style.position = "absolute";
        field.style.left = "-9999px";
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
    // enquiry page, which carries both.
    if ((hpHidden === 0 || emailsFixed === 0 || localesUpgraded === 0) && tries > 0) {
      setTimeout(function () { sweepHoneypots(tries - 1); }, 80);
    }
  }
  new MutationObserver(function (changes) {
    changes.forEach(function (change) {
      if (change.type === "attributes") localizeLink(change.target);
      else change.addedNodes.forEach(function (node) {
        localizeLinks(node);
        restoreSlotScrolling(node);
        deferSlotImages(node);
        aliasImages(node);
        enhanceDirections(host);
        startIstClock(node);
        hideHoneypots(node);
        repairEmailLinks(node);
        upgradeLanguageControls(node);
        applyConsent();
        retargetSelfLinks(node);
      });
    });
  }).observe(host, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });
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

    // STAGING ONLY. On a production build this must not run at all: forcing
    // noindex here would override the approved design's own robots value and
    // silently deindex the live site. The deduplication above still runs in
    // both modes, because two robots metas are wrong either way.
    assertShareTags();
    var keep = governedWins('meta[name="robots"]');
    if (!STAGING) return;
    if (!keep) {
      keep = document.createElement("meta");
      keep.setAttribute("name", "robots");
      document.head.appendChild(keep);
    }
    if (keep.getAttribute("content") !== "noindex, nofollow") {
      keep.setAttribute("content", "noindex, nofollow");
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
  // belt-and-braces re-assert. It RE-APPLIES on a short schedule rather than
  // firing once, because __dcSetProps becomes callable in the same tick the
  // runtime picks its root name, and a single early call could land on the
  // pre-boot name. Re-asserting is idempotent: setProps replaces the override
  // with the same value and bumps the registry only when React re-renders.
  var pendingTemplate = null;
  var templatePushed = false;

  // A slot upgrades when image-slot.js runs, which is AFTER its element is in
  // the DOM, so the MutationObserver above can see the node before it has a
  // shadow root. Sweep on the same retry cadence as bindRoute so late upgrades
  // and <sc-for>-rendered list slots are covered too.
  function sweepSlots(tries) {
    restoreSlotScrolling(host);
    deferSlotImages(host);
    aliasImages(host);
    enhanceDirections(host);
    startIstClock(host);
    hideHoneypots(host);
    if (tries > 0) setTimeout(function () { sweepSlots(tries - 1); }, 60);
  }

  function bindRoute(tries) {
    if (typeof window.__dcSetProps === "function" && typeof window.__dcRootName === "function") {
      var name = window.__dcRootName();
      if (!templatePushed && pendingTemplate && typeof window.__dcUpdate === "function") {
        try {
          window.__dcUpdate(name, "html", pendingTemplate, false);
          templatePushed = true;
          host.setAttribute("data-ahv-template", "source");
          releaseSnapshot();
        } catch (e) {
          fail(e);
        }
      }
      try {
        window.__dcSetProps(name, { route: cfg.path });
      } catch (e) { /* a view without a route prop simply ignores it */ }
      scheduleHead();
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
      host.appendChild(document.createElement("x-dc"));
      pendingTemplate = view.template;
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
      logic.text = view.logic || "";
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
        s.onerror = function () { fail(new Error("script " + entry.src)); };
        host.appendChild(s);
      });

      bindRoute(40);
      sweepSlots(40);
      sweepHoneypots(150);
    })
    .catch(fail);
})();
`.trim();
