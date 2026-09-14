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
  new MutationObserver(function (changes) {
    changes.forEach(function (change) {
      if (change.type === "attributes") localizeLink(change.target);
      else change.addedNodes.forEach(localizeLinks);
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
    })
    .catch(fail);
})();
`.trim();
