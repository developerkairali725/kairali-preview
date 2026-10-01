/**
 * Media loading for the approved-design runtime (lane P-perf, 29 Sep 2026).
 *
 * Measured on staging: a cold load downloaded almost every image on the page, whether or not it was on
 * screen (homepage mobile 7.9 MB). Four causes, all fixed here from the runtime side — no approved view
 * byte, family renderer or image file is edited, so a re-import of public/ahv/ cannot undo any of it.
 *
 * boot.ts injects these functions into BOOT_SCRIPT as `(${fn.toString()})(...)` expressions, the same
 * channel formPostSafety already uses. That is why every function is SELF-CONTAINED (no reference to
 * anything outside its own body) and is only ever called as an expression, never by its name: a
 * minifier may rename the declaration, and the template literal must never see a backslash
 * (memory: boot.ts template-literal escapes) — code interpolated with ${} is not escape-processed.
 */

/** Homepage LCP slots: the only <image-slot>s that load eagerly at high priority (desktop / phone view). */
export const EAGER_SLOTS = { "hero-still": 1, "m-hero": 1 };

/**
 * P1a — put loading="lazy" ahead of src in every <img> of an approved view template.
 * The runtime applies attributes in source order to a detached element; with src first the fetch starts
 * before the lazy attribute exists (A/B on staging: 48/48 far-below-fold images fetched vs 6/48).
 * Pure text transform: the tag keeps every attribute byte-for-byte, only the lazy one moves first.
 * An <img> without loading="lazy" is untouched; idempotent.
 */
export function lazyImgFirst(html) {
  return String(html).replace(/<img\b([^>]*?)\s(loading=(["'])lazy\3)([^>]*)>/gi,
    (m, pre, lazy, q, post) => "<img " + lazy + pre + post + ">");
}

/**
 * P3 — the approved homepage film autoplays on wide screens from the moment its <video> ref attaches,
 * so 2.8 MB of video competed with the LCP. It now starts once the page has loaded and the main thread
 * is idle; the poster (the same wx-hero still) shows meanwhile. Autoplay is kept; phones are untouched
 * (the source never autoplays below 900px). Save-Data is honoured (the film stays click-to-play there).
 * A visitor who already started or seeked the film before idle keeps control: the deferred start only
 * fires while the video has never been given its src.
 * Exact-string rewrite: a re-import that changes this line leaves the source behaviour untouched.
 */
export function deferHeroFilm(logic) {
  var now = "if (wide && !calm) this._heroPlay();";
  var later = "if (wide && !calm && !(navigator.connection && navigator.connection.saveData)) {" +
    " const go = () => { const v = this._hv; if (v && !v.getAttribute('src')) this._heroPlay(); };" +
    " const idle = () => (window.requestIdleCallback ? requestIdleCallback(go, {timeout: 3000}) : setTimeout(go, 1500));" +
    " if (document.readyState === 'complete') idle(); else window.addEventListener('load', idle, {once: true}); }";
  return String(logic || "").split(now).join(later);
}

/**
 * P1b — renderer-built images. Seven family renderers build <img> with React.createElement({src, …,
 * loading:'lazy'}); react-dom applies props in key order to the detached element, so the same src-first
 * fetch happens there (and P1a cannot reach them — they are not template text).
 * Holds a src written by setAttribute on a DISCONNECTED <img> that has no loading attribute yet for one
 * microtask, so a loading attribute written in the same task lands first. Connected images, the .src
 * property (image-slot uses it) and every other element/attribute pass straight through; a later direct
 * src write wins over the held one. Verified by the staging A/B (48/48 -> 6/48).
 */
export function installLazyImgOrder(win, responsiveAttrs) {
  var P = win.Element && win.Element.prototype;
  if (!P || P.__ahvLazyOrder) return;
  var setAttr = P.setAttribute;
  var later = win.queueMicrotask ? win.queueMicrotask.bind(win) : function (f) { Promise.resolve().then(f); };
  try { Object.defineProperty(P, "__ahvLazyOrder", { value: true }); } catch (e) { P.__ahvLazyOrder = true; }
  P.setAttribute = function (name, value) {
    if (name === "loading" && value === "lazy" && this.tagName === "IMG") setAttr.call(this, "fetchpriority", "low");
    if (name === "src" && this.tagName === "IMG" && responsiveAttrs) {
      var attrs = responsiveAttrs(String(value), this.id || "");
      if (attrs) { setAttr.call(this, "srcset", attrs.srcset); setAttr.call(this, "sizes", attrs.sizes); }
    }
    if (name === "src" && this.tagName === "IMG" && !this.isConnected && !this.hasAttribute("loading")) {
      var el = this, queued = el.__ahvSrc !== undefined;
      el.__ahvSrc = String(value);
      if (!queued) later(function () {
        var v = el.__ahvSrc;
        el.__ahvSrc = undefined;
        if (v !== undefined && !el.hasAttribute("src")) setAttr.call(el, "src", v);
      });
      return;
    }
    if (name === "src" && this.__ahvSrc !== undefined) this.__ahvSrc = undefined;
    return setAttr.call(this, name, value);
  };
}

/**
 * P1c — <image-slot> photos (the two homepage views). The slot builds its shadow <img> with no loading
 * attribute and assigns .src from its own callbacks while the host is still detached, so marking it
 * lazy afterwards (deferSlotImage) was too late. This hooks the element definition so the loading
 * decision is written BEFORE the slot's first src write: the LCP slot (eager map) gets
 * fetchpriority=high, every other slot loading=lazy + decoding=async, and the hidden reframing copy
 * (.spill img, never shown outside the editor) loading=lazy. The decision is re-applied on each
 * callback until the first src exists, so it always uses the id the slot has at that moment.
 */
export function installSlotLoading(win, eager) {
  var ce = win.customElements;
  if (!ce || ce.__ahvSlotHook) return;
  ce.__ahvSlotHook = true;
  var define = ce.define.bind(ce);
  function decide(slot) {
    if (slot.__ahvLoadingFixed) return;
    var root = slot.shadowRoot;
    if (!root) return;
    var img = root.querySelector(".frame img"), ghost = root.querySelector(".spill img");
    if (!img) return;
    if (img.getAttribute("src")) { slot.__ahvLoadingFixed = true; return; }
    if (eager[slot.id]) { img.setAttribute("fetchpriority", "high"); img.removeAttribute("loading"); }
    else { img.setAttribute("loading", "lazy"); img.setAttribute("fetchpriority", "low"); img.setAttribute("decoding", "async"); }
    if (ghost && !ghost.getAttribute("src")) ghost.setAttribute("loading", "lazy");
  }
  ce.define = function (name, C, opts) {
    if (name === "image-slot" && C && C.prototype) {
      ["attributeChangedCallback", "connectedCallback"].forEach(function (k) {
        var orig = C.prototype[k];
        if (typeof orig !== "function") return;
        C.prototype[k] = function () { decide(this); return orig.apply(this, arguments); };
      });
    }
    return define(name, C, opts);
  };
}

/**
 * P2 — inline CSS background images wait until they are near the viewport.
 * site-document.tsx serves `#ahv-design-root [style*='url(']:not([data-ahv-bg]){background-image:none!important}`
 * so no inline background is fetched until this marks its element data-ahv-bg. Anything in or within
 * `margin` px of the first screen is revealed synchronously (no frame of waiting); the rest is revealed
 * by an IntersectionObserver with the same margin, and a revealed element reveals every background in
 * its <section> at once, so carousels, tabs and horizontal rows never show a blank sibling. Colour,
 * size and position are untouched, so a tile shows its own fill until the image arrives — exactly as on
 * a slow connection today — and a revealed element keeps its attribute through the runtime's style
 * rewrites (the rotating announcement keeps loading while it is on screen, and stops while it is not).
 * Returns deferBackgrounds(root, shallow): shallow checks only root itself (used for style mutations).
 */
export function createBackgroundDeferral(win, margin) {
  var SEL = "[style*='url(']";
  var io = null;
  function reveal(el) {
    if (el.hasAttribute("data-ahv-bg")) return;
    if (io && el.__ahvBgSeen) io.unobserve(el);
    el.setAttribute("data-ahv-bg", "");
  }
  function revealGroup(el) {
    var sec = el.closest("section") || el.parentElement;
    reveal(el);
    if (sec) sec.querySelectorAll(SEL).forEach(reveal);
  }
  if ("IntersectionObserver" in win) {
    io = new win.IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) revealGroup(e.target); });
    }, { rootMargin: margin + "px 0px" });
  }
  return function deferBackgrounds(root, shallow) {
    if (!root || root.nodeType !== 1) return;
    var list = [];
    if (root.matches(SEL)) list.push(root);
    if (!shallow) root.querySelectorAll(SEL).forEach(function (e) { list.push(e); });
    var todo = list.filter(function (el) { return !el.hasAttribute("data-ahv-bg") && !el.__ahvBgSeen; });
    if (!todo.length) return;
    if (!io) { todo.forEach(reveal); return; }
    // Read every rect first, then write: one layout pass for the whole batch.
    var vh = win.innerHeight;
    var near = todo.map(function (el) {
      var r = el.getBoundingClientRect();
      return (r.width || r.height) && r.bottom > -margin && r.top < vh + margin;
    });
    todo.forEach(function (el, i) {
      el.__ahvBgSeen = true;
      if (near[i]) reveal(el); else io.observe(el);
    });
  };
}
