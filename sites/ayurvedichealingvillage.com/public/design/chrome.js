/* AHV — two footer additions the owner ruled on 22 Sep 2026, applied on every
 * page INCLUDING the homepage (his explicit word — "everywhere"):
 *
 *   D-20260922-18  the copyright line on every footer. Measured: the mobile
 *                  footer prints "© 1908 — 2026 Kairali — The Ayurvedic Healing
 *                  Village."; the desktop footer and the homepage footer print
 *                  none. The line is appended to the footer's bottom bar (its
 *                  last block) wherever no "©" text exists, in that bar's own
 *                  type. The closing year is the current year, as the mobile
 *                  footer's own computed-year logic does.
 *   D-20260922-19  WhatsApp +91 92898 38797 (the locked patient-care number)
 *                  as a wa.me link directly under the hospital phone
 *                  +91 9555 156 156 in every footer. Nothing else moves.
 *
 * Both are idempotent (marked with data attributes) and run on the design
 * root's own mutation stream, coalesced to one pass per tick — the same
 * pattern as consistency.js, and independent of boot.ts. The shared footer
 * is one component, so one pass covers every family; the homepage's own
 * footer has the same phone link and bottom bar and is covered by the same
 * rules. Locked facts only: no other number, no other e-mail. */
(function () {
  "use strict";
  var root = document.getElementById("ahv-design-root");
  if (!root) return;
  var WA_HREF = "https://wa.me/919289838797";
  var WA_TEXT = "WhatsApp +91 92898 38797";
  var COPY = "© 1908 — " + new Date().getFullYear() + " Kairali — The Ayurvedic Healing Village.";
  var scheduled = false;

  function visible(el) {
    var cs = window.getComputedStyle(el);
    return cs.display !== "none" && cs.visibility !== "hidden";
  }
  function footers() {
    var all = root.querySelectorAll("footer");
    var out = [];
    for (var i = 0; i < all.length; i++) {
      var f = all[i];
      // the page footer, not a testimonial's <footer> inside a blockquote
      if (f.closest("blockquote, article, main")) continue;
      if (visible(f)) out.push(f);
    }
    return out;
  }

  function whatsapp(f) {
    if (f.querySelector("a[data-ahv-whatsapp]")) return;
    var tel = f.querySelector('a[href^="tel:"]');
    if (!tel) return;
    var a = document.createElement("a");
    a.href = WA_HREF;
    a.setAttribute("data-ahv-whatsapp", "1");
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");
    a.textContent = WA_TEXT;
    tel.parentNode.insertBefore(a, tel.nextSibling);
  }

  function copyright(f) {
    if (f.querySelector("[data-ahv-copyright]")) return;
    if (/©/.test(f.textContent || "")) return;
    // the bottom bar: the footer's last element block
    var bar = f.lastElementChild;
    if (!bar) return;
    var span = document.createElement("span");
    span.setAttribute("data-ahv-copyright", "1");
    span.textContent = COPY;
    // the bar's own type: if it is a flex column of spans the new span joins it;
    // otherwise it becomes its own line at the bar's font
    span.style.display = "block";
    bar.appendChild(span);
  }

  // D-20260922-21: ONE chat. The footer's "Chat with Priya" pointed at
  // chat.kairali.com (dead); the Chatbase bubble is the chat that works. The
  // link now opens that bubble: wake the deferred loader, wait for the widget,
  // open it. If the widget never arrives (blocked, offline) the link falls back
  // to the locked WhatsApp number — never a dead end.
  function openChat(ev) {
    ev.preventDefault();
    try { window.dispatchEvent(new Event("pointerdown")); window.dispatchEvent(new Event("scroll")); window.dispatchEvent(new Event("keydown")); } catch (e) {}
    var tries = 0;
    (function poll() {
      if (typeof window.chatbase === "function") { try { window.chatbase("open"); return; } catch (e) {} }
      var btn = document.getElementById("chatbase-bubble-button");
      if (btn) { btn.click(); return; }
      if (++tries < 40) setTimeout(poll, 150); else window.location.href = WA_HREF;
    })();
  }
  function chatLinks(f) {
    var links = f.querySelectorAll('a[href^="https://chat.kairali.com"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      if (a.getAttribute("data-ahv-chat") === "1") continue;
      a.setAttribute("data-ahv-chat", "1");
      a.setAttribute("href", "#chat");
      a.removeAttribute("target");
      a.addEventListener("click", openChat);
    }
  }
  function pass() {
    scheduled = false;
    try {
      var fs = footers();
      for (var i = 0; i < fs.length; i++) { whatsapp(fs[i]); copyright(fs[i]); chatLinks(fs[i]); }
    } catch (e) { /* never break the page */ }
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(pass, 0);
  }
  if (window.MutationObserver) new MutationObserver(schedule).observe(root, { childList: true, subtree: true });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedule); else schedule();
  window.addEventListener("load", schedule);
})();
