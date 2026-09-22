/* AHV — sitewide consistency layer, the DOM half (D-20260922-13, 22 Sep 2026).
 *
 * consistency.css does everything a stylesheet can. Two things it cannot:
 *
 *   1. THE TYPE FLOOR. The served views size text inline, and the small print
 *      is where the families diverge: 10–13.5px micro labels ("View image",
 *      "Past Retreat", jump-nav labels, table headers) against the package
 *      page's 13px labels and 17px body. CSS cannot select "anything whose
 *      computed size is under N", so this walks the rendered text once and
 *      raises what is under the floor:
 *        · an uppercase / tracked label            → 14px
 *        · any other text                          → 15.5px
 *      (the package page's own labels are 13px; 14px is the smallest a
 *      45-year-old reads a tracked capital label without effort, and the
 *      gold standard itself is not touched — it is a locked family).
 *      Only the text's own element is sized, with !important because the size
 *      it beats is inline. Nothing is sized DOWN.
 *
 *   2. TABLES ON A PHONE. A table with a header row gets each cell labelled
 *      (data-label = its column header) so consistency.css can stack it as
 *      labelled cards under 700px; a table without one is wrapped so it
 *      scrolls inside its own box instead of the page.
 *
 * SCOPE. Runs only when the design root carries data-ahv-consistency="1"
 * (see design-view.tsx / tools/build-consistency-lock.mjs) — the homepage,
 * the package pages, the finder hubs and the course family never enter this
 * file. Within a page it touches <main> only: the shared header and footer
 * are the homepage's chrome. It runs its own MutationObserver on the root,
 * coalesced to one pass per animation frame, and never edits boot.ts. */
(function () {
  "use strict";
  var root = document.getElementById("ahv-design-root");
  if (!root || root.getAttribute("data-ahv-consistency") !== "1") return;
  var LABEL_MIN = 14, TEXT_MIN = 15.5;
  var done = (typeof WeakSet === "function") ? new WeakSet() : { has: function () { return false; }, add: function () {} };
  var scheduled = false;

  function typeFloor(main) {
    var walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, null);
    var node, el, seen = [];
    while ((node = walker.nextNode())) {
      var text = node.nodeValue;
      if (!text || text.replace(/\s+/g, "").length < 3) continue;   // separators, icons, ◆
      el = node.parentElement;
      if (!el || done.has(el) || seen.indexOf(el) !== -1) continue;
      seen.push(el);
      if (el.closest("script,style,svg,sup,sub,[aria-hidden='true'],[data-ahv-no-floor]")) { done.add(el); continue; }
      var cs = window.getComputedStyle(el);
      var fs = parseFloat(cs.fontSize);
      if (!fs) continue;
      var isLabel = cs.textTransform === "uppercase" || parseFloat(cs.letterSpacing) >= 1;
      var min = isLabel ? LABEL_MIN : TEXT_MIN;
      if (fs < min) {
        el.style.setProperty("font-size", min + "px", "important");
        el.setAttribute("data-ahv-floored", String(fs));
      }
      done.add(el);
    }
  }

  function tables(main) {
    var list = main.querySelectorAll("table");
    for (var i = 0; i < list.length; i++) {
      var tb = list[i];
      if (tb.hasAttribute("data-ahv-table")) continue;
      tb.setAttribute("data-ahv-table", "1");
      var first = tb.rows[0];
      var head = null;
      if (tb.tHead && tb.tHead.rows.length) head = tb.tHead.rows[0];
      else if (first && first.cells.length > 1 && first.querySelectorAll("th").length === first.cells.length) head = first;
      if (head) {
        var labels = [];
        for (var c = 0; c < head.cells.length; c++) labels.push((head.cells[c].textContent || "").replace(/\s+/g, " ").trim());
        tb.setAttribute("data-ahv-stack", "1");
        head.setAttribute("data-ahv-head", "1");
        for (var r = 0; r < tb.rows.length; r++) {
          var row = tb.rows[r];
          if (row === head) continue;
          for (var k = 0; k < row.cells.length; k++) if (labels[k] && row.cells[k].tagName === "TD") row.cells[k].setAttribute("data-label", labels[k]);
        }
      } else if (tb.parentElement && !tb.parentElement.classList.contains("ahv-table-scroll")) {
        var wrap = document.createElement("div");
        wrap.className = "ahv-table-scroll";
        tb.parentNode.insertBefore(wrap, tb);
        wrap.appendChild(tb);
      }
    }
  }

  // The legacy campaign template renders its hero slider's slide names as a
  // bulleted list ("Image 01" … "Image 06") — a list of nothing. Dropped.
  function campaignSliderStubs(main) {
    if (root.getAttribute("data-ahv-family") !== "campaign-nine") return;
    var items = main.querySelectorAll("li");
    for (var i = 0; i < items.length; i++) {
      if (/^Image \d\d$/.test((items[i].textContent || "").trim())) items[i].parentNode.removeChild(items[i]);
    }
  }

  // A sticky side rail taller than the window pins its top and hides its
  // bottom links for ever (measured on /books/: a 19-link rail, top:96px,
  // links below the fold unreachable — "the navigation links are not
  // clickable"). If the rail cannot fit, it scrolls with the page instead.
  function tallStickyRails(main) {
    var els = main.querySelectorAll("nav, aside");
    for (var i = 0; i < els.length; i++) {
      var el = els[i]; var cs = window.getComputedStyle(el);
      if (cs.position !== "sticky") continue;
      var top = parseFloat(cs.top) || 0;
      if (el.offsetHeight + top > window.innerHeight - 24) el.style.setProperty("position", "static", "important");
      else if (el.getAttribute("data-ahv-unstuck") === "1") el.style.removeProperty("position");
      el.setAttribute("data-ahv-unstuck", el.style.position === "static" ? "1" : "0");
    }
  }
  // The WordPress source printed its own breadcrumb ("Home – Kair by Kairali")
  // as the first paragraph of a few legacy articles and the capture kept it as
  // body text. It is never content: the site has a real breadcrumb above it.
  function strayBreadcrumbs(main) {
    var ps = main.querySelectorAll("p");
    for (var i = 0; i < ps.length; i++) {
      var t = (ps[i].textContent || "").replace(/\s+/g, " ").trim();
      if (/^Home [–»>] .{1,80}$/.test(t) && !ps[i].querySelector("a, img")) ps[i].parentNode.removeChild(ps[i]);
    }
  }
  // D-20260922-28: the contact page's live map, CONSENT-GATED. The static
  // map (an <img> inside the map link, data-source-embed="map") shows first;
  // once the visitor has accepted cookies (the design's own notice writes
  // localStorage "ktahv-consent" = "accepted") it becomes a Google Maps
  // embed of the hospital. No API key, no script: an <iframe> with the
  // public embed URL, lazy, titled. Declined or undecided: the static map
  // stays and the Get-directions button beside it still works.
  function liveMap(main) {
    if (root.getAttribute("data-ahv-route") !== "/contact-us/") return;
    var link = main.querySelector('a[data-source-embed="map"]');
    if (!link || link.getAttribute("data-ahv-live-map") === "1") return;
    var accepted = false;
    try { accepted = window.localStorage.getItem("ktahv-consent") === "accepted"; } catch (e) {}
    if (!accepted) return;
    var img = link.querySelector("img");
    if (!img) return;
    var frame = document.createElement("iframe");
    frame.setAttribute("title", "Map: Kairali \u2013 The Ayurvedic Healing Village, Olassery, Kodumbu, Palakkad");
    frame.setAttribute("loading", "lazy");
    frame.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
    frame.setAttribute("allowfullscreen", "");
    frame.src = "https://www.google.com/maps?q=Kairali+-+The+Ayurvedic+Healing+Village,+Olassery,+Kodumbu,+Palakkad&z=15&output=embed";
    frame.style.cssText = "display:block;width:100%;height:" + Math.max(300, Math.round(img.getBoundingClientRect().height || 340)) + "px;border:0;border-radius:4px;";
    img.parentNode.replaceChild(frame, img);
    link.setAttribute("data-ahv-live-map", "1");
    // the link wrapper must not swallow clicks inside the map
    link.style.pointerEvents = "none"; frame.style.pointerEvents = "auto";
    var caption = link.querySelector("span"); if (caption) caption.style.pointerEvents = "auto";
  }
  function pass() {
    scheduled = false;
    var main = root.querySelector("main") || root;
    try { typeFloor(main); tables(main); campaignSliderStubs(main); tallStickyRails(main); strayBreadcrumbs(main); liveMap(main); } catch (e) { /* never break the page */ }
  }
  // consent can be given after load: re-run on the notice's click and on storage
  document.addEventListener("click", function () { setTimeout(schedule, 50); }, true);
  window.addEventListener("storage", schedule);
  window.addEventListener("resize", schedule);
  // setTimeout, NOT requestAnimationFrame: a frame callback never fires in a
  // hidden tab (measured on the deployed preview opened in a background tab —
  // the pass never ran and the slider stubs stayed), and a page opened in the
  // background must still be right when the visitor switches to it.
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(pass, 0);
  }
  if (window.MutationObserver) new MutationObserver(schedule).observe(root, { childList: true, subtree: true });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedule); else schedule();
  window.addEventListener("load", schedule);
})();
