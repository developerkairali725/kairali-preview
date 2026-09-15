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
 * hydration error #418 and React's recovery render wiped the design away.
 *
 * Staging safety net: a capture-phase submit guard blocks any native form
 * submission on these pages. The approved forms are design previews that
 * already prevent their own default; this guarantees it even if one does not.
 * preventDefault only — propagation is untouched, so the design's own
 * client-side state changes still run and nothing fakes a success.
 */

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
}

export const ROUTE_CONFIG_ID = "ahv-route-config";
export const DESIGN_ROOT_ID = "ahv-design-root";

/** Emitted inline, ASCII-safe, and small enough to stay in the document. */
export const BOOT_SCRIPT = `
(function () {
  // React may re-insert this inline script during hydration; boot exactly once.
  if (window.__ahvBooted) return;
  window.__ahvBooted = true;

  var cfgEl = document.getElementById(${JSON.stringify(ROUTE_CONFIG_ID)});
  var host = document.getElementById(${JSON.stringify(DESIGN_ROOT_ID)});
  if (!cfgEl || !host) return;
  var cfg = JSON.parse(cfgEl.textContent || "{}");

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
    // Source links use older spellings; resolve to the approved pages.
    var aliases = {
      "/ayurveda-training-program": "/ayurveda-training-programs/",
      "/sight-seeing": "/sightseeing/",
      "/programs/yoga-meditation-programs": "/yoga-meditation-programs/",
      "/our-villa": "/our-villas/",
      "/programs/wellness-programs": "/wellness-programs/",
      "/programs/treatment-programs": "/treatment-programs/",
      "/programs/training-programs": "/training-programs/"
    };
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
  function restoreSlotScrolling(root) {
    if (!root || root.nodeType !== 1) return;
    if (root.matches("image-slot")) restoreSlotScroll(root);
    root.querySelectorAll("image-slot").forEach(restoreSlotScroll);
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
    if (hpHidden === 0 && tries > 0) setTimeout(function () { sweepHoneypots(tries - 1); }, 80);
  }
  new MutationObserver(function (changes) {
    changes.forEach(function (change) {
      if (change.type === "attributes") localizeLink(change.target);
      else change.addedNodes.forEach(function (node) {
        localizeLinks(node);
        restoreSlotScrolling(node);
        hideHoneypots(node);
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
      if (byKey[key].length > 1) {
        governedWins(
          'meta[property="' + key + '"], meta[name="' + key + '"]'
        );
      }
    });

    var keep = governedWins('meta[name="robots"]');
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
      host.innerHTML = "<x-dc></x-dc>";
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
