/* AHV — villa details in an on-page dialog (DEC-VILLA-POPUP, WOPS-AHV-VILLA-POPUP-20261010-001).
 *
 * On the live ad routes (body[data-ahv-campaign]) an ordinary click on a link to one of the four villa pages opens
 * that villa's details in a native modal <dialog> on the same page, so the visitor keeps the page, its campaign
 * query and any half-filled form. Progressive enhancement only:
 *   - the link keeps its real href; modified clicks (Ctrl/Cmd/Shift/Alt, middle button), target/download links,
 *     links outside the page's <main>, unknown paths and browsers without showModal() navigate exactly as before;
 *   - the dialog's own "Explore …" link is the original href, unchanged.
 * Content is the villa pages' approved text and images, copied verbatim from english-candidate/prerender/<slug>.html
 * (facts list, "In your villa/suite" lists, first four images with their alt text) — no prices, no new claims. It is
 * built with createElement/textContent only: nothing is fetched, no page HTML is parsed. No tracking, consent, form
 * or lead behaviour is touched; the click still reaches every other listener (no stopPropagation). */
(function () {
  "use strict";

  var VILLAS = {
    "/classic-villa/": {
      name: "Classic Villa",
      facts: ["309 – 373 Sqft", "Twin/King Size Bed", "Upto 3 Adults", "Garden View"],
      amenitiesHeading: "In your villa",
      groups: [
        { heading: "Room and comfort", items: ["King or twin beds, depending on the villa", "Wardrobe", "Air conditioning", "LED television"] },
        { heading: "Bathroom essentials", items: ["Attached bathroom", "Hairdryer", "Toiletries", "Bath, hand and face towels", "Bathrobe", "Bath mat"] },
        { heading: "Useful extras", items: ["Drinking water", "Tissue box", "Stationery", "Two umbrellas"] }
      ],
      images: [
        { src: "/ahv/assets/img/AHV-Classic-Hero.webp", alt: "Classic Villa surrounded by palms and garden planting", width: 1440, height: 731 },
        { src: "/ahv/assets/img/AHV-Classic-G01.webp", alt: "Twin beds in a pink Classic Villa bedroom", width: 1400, height: 1000 },
        { src: "/ahv/assets/img/AHV-Classic-G02.webp", alt: "Classic Villa desk and seating area", width: 1400, height: 1000 },
        { src: "/ahv/assets/img/AHV-Classic-G03.webp", alt: "Twin beds beside bedroom windows", width: 1400, height: 1000 }
      ]
    },
    "/deluxe-villa/": {
      name: "Deluxe Villa",
      facts: ["260- 375 Sqft", "Twin/King Size Bed", "Upto 3 Adults", "Garden View"],
      amenitiesHeading: "In your villa",
      groups: [
        { heading: "Room and comfort", items: ["King or twin beds, depending on the villa", "Wardrobe", "Air conditioning", "LED television"] },
        { heading: "Bathroom essentials", items: ["Attached bathroom", "Hairdryer", "Toiletries", "Bath, hand and face towels", "Bathrobe", "Bath mat"] },
        { heading: "Useful extras", items: ["Drinking water", "Tissue box", "Stationery", "Two umbrellas"] }
      ],
      images: [
        { src: "/ahv/assets/img/AHV-Deluxe-G17.webp", alt: "Rounded Deluxe Villa beside the garden channel", width: 1400, height: 1000 },
        { src: "/ahv/assets/img/AHV-Deluxe-G01.webp", alt: "Deluxe Villa bathroom with glass shower and basin", width: 1400, height: 1000 },
        { src: "/ahv/assets/img/AHV-Deluxe-G02.webp", alt: "Twin beds in a pink Deluxe Villa bedroom", width: 1400, height: 1000 },
        { src: "/ahv/assets/img/AHV-Deluxe-G03.webp", alt: "Single bed and wardrobe in a Deluxe Villa bedroom", width: 1400, height: 1000 }
      ]
    },
    "/royal-villa/": {
      name: "Royal Villa",
      facts: ["284- 441 Sqft", "Twin/King Size Bed", "Upto 3 Adults", "Garden View"],
      amenitiesHeading: "In your villa",
      groups: [
        { heading: "Room and comfort", items: ["King or twin beds, depending on the villa", "Wardrobe", "Air conditioning", "LED television"] },
        { heading: "Bathroom essentials", items: ["Attached bathroom", "Hairdryer", "Toiletries", "Bath, hand and face towels", "Bathrobe", "Bath mat"] },
        { heading: "Useful extras", items: ["Drinking water", "Tissue box", "Stationery", "Two umbrellas"] }
      ],
      images: [
        { src: "/ahv/assets/img/AHV-Royal-G29.webp", alt: "Royal Villa entrance surrounded by palms", width: 1400, height: 1000 },
        { src: "/ahv/assets/img/AHV-Royal-G01.webp", alt: "Royal Villa bedroom and dressing mirror", width: 1400, height: 1000 },
        { src: "/ahv/assets/img/AHV-Royal-G02.webp", alt: "Royal Villa bedroom and seating area", width: 1400, height: 1000 },
        { src: "/ahv/assets/img/AHV-Royal-G03.webp", alt: "Royal Villa bathroom basin and mirror", width: 1400, height: 1000 }
      ]
    },
    "/maharaja-suite/": {
      name: "Maharaja Suite",
      facts: ["603 – 654 Sqft", "Two suite layouts", "Upto 4 Adults", "Garden View"],
      amenitiesHeading: "In your suite",
      groups: [
        { heading: "Comfort", items: ["Air conditioning", "LED television", "Refrigerator in both suites 1001 and 1002", "Coffee maker in both suites 1001 and 1002"] },
        { heading: "Bathroom essentials", items: ["Hairdryer", "Toiletries", "Bath, hand and face towels", "Bathrobe", "Bath mat"] },
        { heading: "Useful extras", items: ["Drinking water", "Tissue box", "Stationery", "Two umbrellas"] }
      ],
      images: [
        { src: "/ahv/assets/img/AHV-Maharaja-G18.webp", alt: "Maharaja Suite exterior and garden path", width: 1400, height: 1000 },
        { src: "/ahv/assets/img/AHV-Maharaja-G01.webp", alt: "Brick-walled suite bedroom", width: 1400, height: 1000 },
        { src: "/ahv/assets/img/AHV-Maharaja-G02.webp", alt: "Suite bedroom with desk and golden floor", width: 1400, height: 1000 },
        { src: "/ahv/assets/img/AHV-Maharaja-G03.webp", alt: "Suite hallway with a decorative lamp", width: 1400, height: 1000 }
      ]
    }
  };
  var CSS_HREF = "/design/villa-dialog.css";
  var FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  /** The VILLAS key for a link's href, or null: same origin only, trailing slash optional, query/hash ignored. */
  function villaKey(href, origin) {
    if (!href) return null;
    var u;
    try { u = new URL(href, origin); } catch (_) { return null; }
    if (u.origin !== origin) return null;
    var path = u.pathname.charAt(u.pathname.length - 1) === "/" ? u.pathname : u.pathname + "/";
    return Object.prototype.hasOwnProperty.call(VILLAS, path) ? path : null;
  }

  /** True only for a plain primary click on a same-tab link inside the page's main content. */
  function shouldIntercept(ev, a) {
    if (!ev || !a || ev.defaultPrevented) return false;
    if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return false;
    var target = (a.getAttribute("target") || "").toLowerCase();
    if (target && target !== "_self") return false;
    if (a.hasAttribute("download")) return false;
    if (!a.closest || !a.closest("main") || a.closest("header, nav, footer, dialog")) return false;
    return true;
  }

  /** The visible label for the dialog's full-page link: the source link's own text when it names the villa,
   *  otherwise the pages' existing "Explore <villa>" pattern. */
  function exploreLabel(a, villa) {
    var t = ((a && a.textContent) || "").replace(/\s+/g, " ").trim();
    return t && t.indexOf(villa.name) !== -1 ? t : "Explore " + villa.name;
  }

  function el(doc, tag, cls, text) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /** Builds (never parses) the dialog for one villa. `href` is the source link's own href attribute. */
  function buildDialog(doc, key, href, label) {
    var v = VILLAS[key];
    var id = "ahv-villa-dialog-" + key.replace(/[^a-z]/g, "");
    var d = el(doc, "dialog", "ahv-villa-dialog");
    d.setAttribute("aria-labelledby", id + "-h");
    d.setAttribute("data-ahv-villa-dialog", key);
    var box = el(doc, "div", "ahv-villa-dialog__box");
    var head = el(doc, "div", "ahv-villa-dialog__head");
    var h = el(doc, "h2", "ahv-villa-dialog__title", v.name);
    h.id = id + "-h";
    var close = el(doc, "button", "ahv-villa-dialog__close");
    close.type = "button";
    close.setAttribute("aria-label", "Close");
    close.setAttribute("data-ahv-villa-close", "");
    close.appendChild(el(doc, "span", null, "×")).setAttribute("aria-hidden", "true");
    head.appendChild(h);
    head.appendChild(close);

    var body = el(doc, "div", "ahv-villa-dialog__body");
    var gallery = el(doc, "div", "ahv-villa-dialog__gallery");
    v.images.forEach(function (im, i) {
      var img = doc.createElement("img");
      img.src = im.src;
      img.alt = im.alt;
      img.width = im.width;
      img.height = im.height;
      img.setAttribute("loading", "lazy");
      img.setAttribute("decoding", "async");
      if (i === 0) img.className = "ahv-villa-dialog__lead";
      gallery.appendChild(img);
    });
    body.appendChild(gallery);
    var facts = el(doc, "ul", "ahv-villa-dialog__facts");
    facts.setAttribute("aria-label", "Villa facts");
    v.facts.forEach(function (f) { facts.appendChild(el(doc, "li", null, f)); });
    body.appendChild(facts);
    body.appendChild(el(doc, "h3", "ahv-villa-dialog__sub", v.amenitiesHeading));
    var groups = el(doc, "div", "ahv-villa-dialog__groups");
    v.groups.forEach(function (g) {
      var wrap = el(doc, "div", "ahv-villa-dialog__group");
      wrap.appendChild(el(doc, "h4", null, g.heading));
      var ul = el(doc, "ul");
      g.items.forEach(function (it) { ul.appendChild(el(doc, "li", null, it)); });
      wrap.appendChild(ul);
      groups.appendChild(wrap);
    });
    body.appendChild(groups);

    var foot = el(doc, "div", "ahv-villa-dialog__foot");
    var more = el(doc, "a", "ahv-villa-dialog__more", label);
    more.setAttribute("href", href);
    foot.appendChild(more);

    box.appendChild(head);
    box.appendChild(body);
    box.appendChild(foot);
    d.appendChild(box);
    return d;
  }

  function focusables(d) {
    var list = d.querySelectorAll(FOCUSABLE), out = [];
    for (var i = 0; i < list.length; i++) out.push(list[i]);
    return out;
  }

  /** Keeps Tab / Shift+Tab inside the open dialog (showModal already makes the page inert). */
  function trapTab(ev, d, active) {
    if (ev.key !== "Tab") return false;
    var f = focusables(d);
    if (!f.length) return false;
    var first = f[0], last = f[f.length - 1];
    if (ev.shiftKey && (active === first || !d.contains(active))) { ev.preventDefault(); last.focus(); return true; }
    if (!ev.shiftKey && (active === last || !d.contains(active))) { ev.preventDefault(); first.focus(); return true; }
    return false;
  }

  function wire(doc, d, trigger) {
    d.addEventListener("keydown", function (ev) { trapTab(ev, d, doc.activeElement); });
    d.addEventListener("click", function (ev) {
      // the close button, or a click on the backdrop (the dialog element itself, outside its box)
      if (ev.target === d || (ev.target.closest && ev.target.closest("[data-ahv-villa-close]"))) d.close();
    });
    d.addEventListener("close", function () {
      var t = d.__ahvTrigger;
      d.__ahvTrigger = null;
      if (t && t.isConnected && typeof t.focus === "function") t.focus();
    });
    d.__ahvTrigger = trigger;
  }

  /** Opens (building once per villa and page) the dialog for `a`. Returns false when it cannot, so the link navigates. */
  function open(doc, a, key) {
    var host = (a.closest && a.closest(".lp")) || doc.body;
    var d = host.querySelector('dialog[data-ahv-villa-dialog="' + key + '"]');
    if (!d) {
      d = buildDialog(doc, key, a.getAttribute("href"), exploreLabel(a, VILLAS[key]));
      if (typeof d.showModal !== "function") return false;
      wire(doc, d, a);
      host.appendChild(d);
    } else {
      if (d.open) return true;
      d.__ahvTrigger = a;
    }
    try { d.showModal(); } catch (_) { return false; }
    var c = d.querySelector("[data-ahv-villa-close]");
    if (c) c.focus();
    return true;
  }

  function ensureCss(doc) {
    if (doc.querySelector('link[data-ahv-villa-dialog-css]')) return;
    var l = doc.createElement("link");
    l.rel = "stylesheet";
    l.href = CSS_HREF;
    l.setAttribute("data-ahv-villa-dialog-css", "");
    (doc.head || doc.documentElement).appendChild(l);
  }

  function onClick(doc, origin) {
    return function (ev) {
      var a = ev.target && ev.target.closest ? ev.target.closest("a[href]") : null;
      if (!a) return;
      var key = villaKey(a.getAttribute("href"), origin);
      if (!key || !shouldIntercept(ev, a)) return;
      if (open(doc, a, key)) ev.preventDefault();
    };
  }

  function init(win) {
    var doc = win.document;
    if (win.__ahvVillaDialog || !doc.querySelector("body[data-ahv-campaign]")) return false;
    if (typeof win.HTMLDialogElement !== "function") return false;
    win.__ahvVillaDialog = true;
    ensureCss(doc);
    doc.addEventListener("click", onClick(doc, win.location.origin));
    return true;
  }

  var api = { VILLAS: VILLAS, villaKey: villaKey, shouldIntercept: shouldIntercept, exploreLabel: exploreLabel, buildDialog: buildDialog, trapTab: trapTab, open: open, onClick: onClick, init: init };
  if (typeof module === "object" && module && module.exports) module.exports = api;
  else if (typeof window !== "undefined") init(window);
})();
