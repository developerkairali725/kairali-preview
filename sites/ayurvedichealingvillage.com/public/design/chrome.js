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
  var COPY = ["©", 1908, "—", new Date().getFullYear(), "Kairali — The Ayurvedic Healing Village."].join(" ");
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
    // Keep the date range once, in the copyright; retain the location label.
    f.querySelectorAll("div,span").forEach(function(el) {
      if (!/^\s*Ayurvedic Healing Village · Palakkad · 1908/.test(el.innerHTML)) return;
      el.innerHTML = el.innerHTML.replace(/(Ayurvedic Healing Village · Palakkad)\s*·\s*1908\s*[—–-]\s*(?:<span[^>]*>\d{4}<\/span>|\d{4})/, "$1");
    });
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
  // Reuse the provider's own toggle; its aria-expanded is the source of truth.
  // A second click during loading cancels the pending open instead of queuing two.
  var chatPending = false, chatTimer = null, chatObserver = null;
  var observedChatButton = null, observedChatWindow = null;
  function chatAttribute(el, name, value) {
    if (el && el.getAttribute(name) !== value) el.setAttribute(name, value);
  }
  function syncChatState() {
    var nativeButton = document.getElementById("chatbase-bubble-button");
    var panel = document.getElementById("chatbase-bubble-window");
    var expanded = nativeButton ? nativeButton.getAttribute("aria-expanded") === "true" : !!(panel && visible(panel));
    var button = document.querySelector("#ahv-contact-controls .ahv-contact-chat");
    var label = expanded ? "Minimize chat" : chatPending ? "Opening chat…" : "Chat with Priya";
    chatAttribute(document.body, "data-ahv-chat-open", expanded ? "true" : "false");
    chatAttribute(button, "aria-expanded", expanded ? "true" : "false");
    chatAttribute(button, "aria-label", chatPending ? "Cancel opening chat" : label);
    chatAttribute(button, "title", chatPending ? "Cancel opening chat" : label);
    chatAttribute(button, "aria-busy", chatPending ? "true" : "false");
    if (panel) chatAttribute(button, "aria-controls", "chatbase-bubble-window");
    var text = button && button.querySelector(".ahv-contact-label");
    if (text && text.textContent !== label) text.textContent = label;
    if (window.MutationObserver && (nativeButton !== observedChatButton || panel !== observedChatWindow)) {
      if (chatObserver) chatObserver.disconnect();
      chatObserver = new MutationObserver(syncChatState);
      if (nativeButton) chatObserver.observe(nativeButton, { attributes: true, attributeFilter: ["aria-expanded"] });
      if (panel) chatObserver.observe(panel, { attributes: true, attributeFilter: ["style", "hidden"] });
      observedChatButton = nativeButton; observedChatWindow = panel;
    }
  }
  function openChat(ev) {
    ev.preventDefault();
    if (chatPending) {
      clearTimeout(chatTimer); chatTimer = null; chatPending = false; syncChatState(); return;
    }
    var nativeButton = document.getElementById("chatbase-bubble-button");
    if (nativeButton) { nativeButton.click(); syncChatState(); return; }
    chatPending = true; syncChatState();
    try { window.dispatchEvent(new Event("pointerdown")); window.dispatchEvent(new Event("scroll")); window.dispatchEvent(new Event("keydown")); } catch (e) {}
    var tries = 0;
    (function poll() {
      if (!chatPending) return;
      var btn = document.getElementById("chatbase-bubble-button");
      if (btn) { chatPending = false; chatTimer = null; btn.click(); syncChatState(); return; }
      if (++tries < 40) chatTimer = setTimeout(poll, 150);
      else { chatPending = false; chatTimer = null; syncChatState(); window.location.href = WA_HREF; }
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
  // One shared pair for every English route, independent of page templates.
  function priyaWidget() {
    if (document.getElementById("ahv-contact-controls")) return;
    var controls = document.createElement("div");
    controls.id = "ahv-contact-controls";
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", "Contact Kairali");
    controls.innerHTML = "<a class=\"ahv-contact-wa\" href=\"https://wa.me/919289838797\" aria-label=\"WhatsApp us\" title=\"WhatsApp us\" target=\"_blank\" rel=\"noopener noreferrer\"><svg aria-hidden=\"true\" width=\"30\" height=\"30\" viewBox=\"0 0 24 24\" fill=\"#fff\"><path d=\"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z\"></path></svg></a><button type=\"button\" class=\"ahv-contact-chat\" aria-label=\"Chat with Priya\" title=\"Chat with Priya\"><span class=\"ahv-contact-symbol\"><svg aria-hidden=\"true\" width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M12 4c-4.6 0-8 2.9-8 6.8 0 2 .95 3.7 2.5 4.9-.1.95-.5 2.05-1.2 2.9 1.5-.1 2.8-.65 3.75-1.3.92.3 1.93.45 2.95.45 4.6 0 8-3 8-6.95S16.6 4 12 4z\" fill=\"#5A4420\"></path><g transform=\"rotate(43 12 10.5)\"><ellipse cx=\"12\" cy=\"10.2\" rx=\"2.2\" ry=\"3.9\" fill=\"#EEB41E\"></ellipse><path d=\"M12 7.2v6\" stroke=\"#5A4420\" stroke-width=\"1\" stroke-linecap=\"round\"></path></g></svg></span><span class=\"ahv-contact-label\">Chat with Priya</span></button>";
    controls.querySelector("button").addEventListener("click", openChat);
    document.body.appendChild(controls);
  }
  // Shared policy, including carousel href changes and links outside the design root.
  var externalOriginals = new WeakMap();
  function externalLink(a) {
    var u; try { u = new URL(a.getAttribute('href'), window.location.href); } catch (_) { return; }
    var external = /^https?:$/.test(u.protocol) && ((u.origin !== window.location.origin && !/^(www\.)?ayurvedichealingvillage\.com$/.test(u.hostname)) || /^\/wp-content\//.test(u.pathname));
    if (external) {
      if (!externalOriginals.has(a)) externalOriginals.set(a, { target: a.getAttribute('target'), rel: a.getAttribute('rel') });
      a.target = '_blank';
      a.rel = Array.from(new Set((a.rel || '').split(/\s+/).filter(Boolean).concat(['noopener', 'noreferrer']))).join(' ');
    } else if (externalOriginals.has(a)) {
      var old = externalOriginals.get(a);
      ['target', 'rel'].forEach(function (key) { if (old[key] === null) a.removeAttribute(key); else a.setAttribute(key, old[key]); });
      externalOriginals.delete(a);
    }
  }
  function externalLinks() { document.querySelectorAll('a[href]').forEach(externalLink); }
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[href]'); if (a) externalLink(a); }, true);
  document.addEventListener('auxclick', function (e) { var a = e.target.closest && e.target.closest('a[href]'); if (a) externalLink(a); }, true);
  function pass() {
    scheduled = false;
    try {
      var fs = footers();
      for (var i = 0; i < fs.length; i++) { whatsapp(fs[i]); copyright(fs[i]); chatLinks(fs[i]); }
      priyaWidget();
      syncChatState();
      externalLinks();
    } catch (e) { /* never break the page */ }
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(pass, 0);
  }
  if (window.MutationObserver) new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedule); else schedule();
  window.addEventListener("load", schedule);
})();

// Owner correction, 24 September 2026: secondary navigation takes over on scroll.
(function () {
  var root = document.getElementById('ahv-design-root');
  if (!root) return;
  var nav, marker, mount, active = false, queued = false;
  function reset() {
    root.removeAttribute('data-ahv-secondary-active');
    if (mount) { mount.removeAttribute('inert'); mount.removeAttribute('data-ahv-primary-mount'); }
    if (marker && marker.isConnected) marker.remove();
    active = false;
  }
  function update() {
    queued = false;
    var next = root.querySelector('nav[aria-label="On this page"]');
    if (next !== nav || (marker && !marker.isConnected)) {
      reset(); nav = next;
      if (!nav) { root.removeAttribute('data-ahv-secondary-page'); return; }
      nav.setAttribute('data-ahv-secondary', '1');
      root.setAttribute('data-ahv-secondary-page', '1');
      marker = document.createElement('div');
      marker.setAttribute('data-ahv-secondary-placeholder', '1');
      marker.setAttribute('aria-hidden', 'true');
      nav.parentNode.insertBefore(marker, nav);
    }
    if (!nav || !marker) return;
    var header = root.querySelector('[data-sc-name="AHV Chrome Header"]');
    if (header !== mount) {
      if (mount) { mount.removeAttribute('inert'); mount.removeAttribute('data-ahv-primary-mount'); }
      mount = header;
      if (mount) mount.setAttribute('data-ahv-primary-mount', '1');
    }
    var rect = marker.getBoundingClientRect();
    var shouldStick = rect.top <= 0;
    root.style.setProperty('--ahv-secondary-left', rect.left + 'px');
    root.style.setProperty('--ahv-secondary-width', rect.width + 'px');
    if (shouldStick !== active) {
      active = shouldStick;
      root.toggleAttribute('data-ahv-secondary-active', active);
      if (mount) mount.toggleAttribute('inert', active);
    }
    var height = nav.getBoundingClientRect().height;
    marker.style.height = active ? height + 'px' : '0px';
    root.style.setProperty('--ahv-secondary-height', height + 'px');
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', schedule, { passive:true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  new MutationObserver(schedule).observe(root, { childList:true, subtree:true });
  update();
})();

// Guide email stays in this tab only until the production lead-delivery integration.
// Never place a visitor's email in URLs, analytics, or localStorage.
document.addEventListener('submit', function (event) {
  var form = event.target;
  if (!form.matches || !form.matches('[data-ahv-guide-form]')) return;
  event.preventDefault();
  var email = form.querySelector('input[type="email"]');
  if (!email || !form.reportValidity()) return;
  try { sessionStorage.setItem('ahv-guide-email-draft', email.value.trim()); } catch (_) { /* downloads remain accessible if storage is unavailable */ }
  window.location.assign('/faqs-downloads/#downloads');
});
