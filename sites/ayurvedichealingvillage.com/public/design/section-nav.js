/* AHV — the shared section rail, DOM half (owner, 23 Sep 2026; see section-nav.css
 * for the layout law and tools/build-section-nav.mjs for the data).
 *
 * On every route listed in window.AHV_SECTION_NAV.routes this
 *   1. REMOVES the captured WordPress sidebar the page happened to carry
 *      (a <nav data-source-component="contextNav">, the article family's
 *      disclosure menu, the attractions family's "Also in …" aside, or the
 *      menu subtree of a context-menu component, matched by source pointer);
 *   2. BUILDS one <nav aria-label="In this section"> from the section's page
 *      tree — hub link, then every page, current page marked aria-current;
 *   3. PLACES it: replacing the article family's menu in place ("inline"),
 *      under the attractions family's "On this page" list ("toc"), or as a
 *      direct child of <main> after the title block, with main laid out as a
 *      grid from 1024px ("grid").
 * Idempotent on the design root's own mutation stream (the design re-mounts
 * <main> on hydration; the rail is rebuilt whenever it is missing). Never
 * touches boot.ts. setTimeout, not requestAnimationFrame: a frame callback
 * never fires in a background tab. */
(function () {
  "use strict";
  var root = document.getElementById("ahv-design-root");
  var DATA = window.AHV_SECTION_NAV;
  if (!root || !DATA) return;
  var route = root.getAttribute("data-ahv-route") || location.pathname;
  var info = DATA.routes[route];
  if (!info) return;
  var section = DATA.sections[info.section];
  if (!section) return;
  var DESKTOP = window.matchMedia("(min-width:1024px)");
  var scheduled = false;

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  // a node is "on the path" when it is the current page or one of its ancestors;
  // a concern heading (group) is on the path when a descendant is
  function onPath(node) {
    if (node.path) return info.crumbs.indexOf(node.path) >= 0;
    for (var i = 0; i < (node.children || []).length; i++) if (onPath(node.children[i])) return true;
    return false;
  }
  function count(node) { var n = 0; for (var i = 0; i < (node.children || []).length; i++) n += (node.children[i].path ? 1 : 0) + count(node.children[i]); return n; }
  // Progressive disclosure (owner, 23 Sep 2026: easy for an older visitor): the
  // section's first level is always shown; a branch opens only when you are in it.
  function list(nodes) {
    var h = '<ul class="ahv-rail-list">';
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i], here = onPath(n), cur = n.path === route, kids = n.children && n.children.length;
      h += "<li" + (here && !cur ? ' class="ahv-rail-open"' : "") + ">";
      if (n.link) h += '<a href="' + esc(n.path) + '"' + (cur ? ' aria-current="page"' : "") + ">" + esc(n.label) +
        (kids && !here ? '<span class="ahv-rail-count" aria-label="' + count(n) + ' pages inside"> · ' + count(n) + "</span>" : "") + "</a>";
      else h += '<span class="ahv-rail-plain">' + esc(n.label) + "</span>";
      if (kids && (here || n.group && here)) h += list(n.children);
      h += "</li>";
    }
    return h + "</ul>";
  }
  function build() {
    var nav = document.createElement("nav");
    nav.setAttribute("data-ahv-section-nav", "1");
    nav.setAttribute("aria-label", "In this section: " + section.label);
    var hubCur = section.hub === route;
    nav.innerHTML =
      "<details" + (DESKTOP.matches ? " open" : "") + ">" +
        '<summary><span class="ahv-rail-kicker">In this section</span><span class="ahv-rail-name">' + esc(section.label) + '</span><span class="ahv-rail-chev" aria-hidden="true"></span></summary>' +
        '<div class="ahv-rail-body">' +
          '<a class="ahv-rail-hub" href="' + esc(section.hub) + '"' + (hubCur ? ' aria-current="page"' : "") + ">" + esc(section.label) + " — overview</a>" +
          list(section.items) +
        "</div>" +
      "</details>";
    return nav;
  }

  function startsWith(s, p) { return s === p || s.indexOf(p + "/") === 0; }
  function removeLegacy(main) {
    var i, els;
    // (a) the captured sidebar as a nav component
    els = main.querySelectorAll("nav[data-source-component]");
    for (i = 0; i < els.length; i++) if (/context|menu|navigation/i.test(els[i].getAttribute("data-source-component") || "")) els[i].parentNode.removeChild(els[i]);
    // (b) the menu subtree of a context-menu component, by source pointer
    var prefixes = (info.remove && info.remove.blockPrefixes) || [];
    if (prefixes.length) {
      els = main.querySelectorAll("[data-source-pointer]");
      for (i = 0; i < els.length; i++) {
        var ptr = els[i].getAttribute("data-source-pointer") || "";
        for (var k = 0; k < prefixes.length; k++) if (startsWith(ptr, prefixes[k])) { if (els[i].parentNode) els[i].parentNode.removeChild(els[i]); break; }
      }
    }
    // (c) the attractions family's "Also in …" aside
    els = main.querySelectorAll('aside[aria-labelledby="ctx-h"]');
    for (i = 0; i < els.length; i++) els[i].parentNode.removeChild(els[i]);
  }

  function textless(el) {
    var t = (el.textContent || "").replace(/\s+/g, "");
    return t.length < 3;
  }
  function isTail(el) {
    var l = el.getAttribute("aria-label") || "";
    return el.tagName === "SECTION" && (l === "Where we are" || l === "Guidance");
  }

  function place(main) {
    var nav = build();
    // inline: the article family's own left column
    var old = main.querySelector('nav[aria-labelledby="ctx-h"]');
    if (old && old.parentNode) {
      old.parentNode.replaceChild(nav, old);
      main.setAttribute("data-ahv-rail", "inline");
      return nav;
    }
    // toc: the attractions family's "On this page" column
    var toc = main.querySelector('nav[aria-labelledby="contents-h"]');
    if (toc && toc.parentNode && toc.nextElementSibling && toc.nextElementSibling.tagName === "ARTICLE") {
      var art = toc.nextElementSibling;
      toc.parentNode.insertBefore(nav, art);
      // explicit cells: the auto-placement algorithm would otherwise seat the article in column 1
      toc.style.gridColumn = "1"; toc.style.gridRow = "1";
      nav.style.gridColumn = "1"; nav.style.gridRow = "2"; nav.style.alignSelf = "start";
      art.style.gridColumn = "2"; art.style.gridRow = "1 / span 2";
      main.setAttribute("data-ahv-rail", "toc");
      return nav;
    }
    // grid: after the title block (breadcrumb + h1), main becomes the grid
    var first = main.firstElementChild;
    if (!first) return null;
    if (first.nextSibling) main.insertBefore(nav, first.nextSibling); else main.appendChild(nav);
    var seen = false, tail = false, n = 0, el;
    for (el = main.firstElementChild; el; el = el.nextElementSibling) {
      if (el === nav) { seen = true; continue; }
      if (!seen) { el.setAttribute("data-ahv-rail-col", "full"); continue; }
      if (tail || isTail(el)) { tail = true; el.setAttribute("data-ahv-rail-col", "tail"); continue; }
      if (textless(el) || (el.tagName === "NAV" && el.getAttribute("aria-label") === "On this page")) { el.setAttribute("data-ahv-rail-col", "full"); continue; }
      el.setAttribute("data-ahv-rail-col", "2"); n++;
    }
    nav.style.gridRow = "span " + Math.max(1, n);
    main.setAttribute("data-ahv-rail", "grid");
    return nav;
  }

  function keepCurrentVisible(nav) {
    if (!DESKTOP.matches) return;
    var box = nav.querySelector("details"), cur = nav.querySelector('a[aria-current="page"]');
    if (!box || !cur) return;
    var top = cur.offsetTop - box.offsetTop;
    if (top + cur.offsetHeight > box.clientHeight) box.scrollTop = top - Math.round(box.clientHeight / 3);
  }

  // The visible breadcrumb follows the SAME tree as the rail and the sitemap:
  // Home / section / ancestors / this page (owner, 23 Sep 2026; reviewers found 15
  // moved pages whose captured breadcrumb named their old section). Rebuilt from the
  // page's own breadcrumb elements so it keeps the design's look.
  var TITLE = {};
  (function () {
    TITLE[section.hub] = section.label;
    var walk = function (list) { for (var i = 0; i < list.length; i++) { if (list[i].path) TITLE[list[i].path] = list[i].label; walk(list[i].children || []); } };
    walk(section.items);
  })();
  function rewriteCrumbs(main) {
    var bc = root.querySelector('nav[aria-label="Breadcrumb"]');
    if (!bc || bc.getAttribute("data-ahv-crumbs") === "1") return;
    var link = bc.querySelector("a"), sep = bc.querySelector('span[aria-hidden="true"]'), last = bc.querySelector('[aria-current="page"]');
    if (!link || !last) return;
    var chain = [section.hub].concat(info.crumbs.slice(0, -1)).filter(function (p, i, a) { return p && p !== route && a.indexOf(p) === i; });
    var parts = [{ href: "/", label: "Home" }].concat(chain.map(function (p) { return { href: p, label: TITLE[p] || p }; }));
    var frag = document.createDocumentFragment();
    parts.forEach(function (c) {
      var a = link.cloneNode(false); a.setAttribute("href", c.href); a.textContent = c.label; frag.appendChild(a);
      if (sep) frag.appendChild(sep.cloneNode(true)); else frag.appendChild(document.createTextNode(" / "));
    });
    var cur = last.cloneNode(false); cur.textContent = TITLE[route] || last.textContent; frag.appendChild(cur);
    while (bc.firstChild) bc.removeChild(bc.firstChild);
    bc.appendChild(frag);
    bc.setAttribute("data-ahv-crumbs", "1");
  }

  function pass() {
    scheduled = false;
    var main = root.querySelector("main");
    if (!main || main.children.length < 2) return;
    try {
      rewriteCrumbs(main);
      removeLegacy(main);
      if (!main.querySelector("nav[data-ahv-section-nav]")) {
        var nav = place(main);
        if (nav) keepCurrentVisible(nav);
      }
    } catch (e) { /* never break the page */ }
  }
  function schedule() { if (scheduled) return; scheduled = true; setTimeout(pass, 0); }

  // desktop ⇄ phone: open on desktop, closed (tap to open) below it
  function onMedia() {
    var d = root.querySelector("nav[data-ahv-section-nav] details");
    if (!d) return;
    if (DESKTOP.matches) d.setAttribute("open", ""); else d.removeAttribute("open");
  }
  if (DESKTOP.addEventListener) DESKTOP.addEventListener("change", onMedia); else if (DESKTOP.addListener) DESKTOP.addListener(onMedia);

  if (window.MutationObserver) new MutationObserver(schedule).observe(root, { childList: true, subtree: true });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedule); else schedule();
  window.addEventListener("load", schedule);
})();
