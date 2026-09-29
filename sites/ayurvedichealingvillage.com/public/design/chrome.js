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
  var campaignRoot = document.querySelector("body[data-ahv-campaign]");
  var root = campaignRoot || document.getElementById("ahv-design-root");
  if (!root) return;
  var WA_HREF = "https://wa.me/919289838797";
  var WA_TEXT = "WhatsApp +91 92898 38797";
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
    // the year is computed here, so it carries the same marker the footer component's live binding gets
    // (tools/repair-computed-year.mjs): a prerender snapshot then records it as computed, not typed (D-ROLLING-NUMBER)
    // one template, its end year a computed placeholder — the ruled "© 1989–{new Date().getFullYear()}" shape
    var parts = "© 1908 — {yearNow} Kairali — The Ayurvedic Healing Village.".split("{yearNow}");
    span.appendChild(document.createTextNode(parts[0]));
    var yr = document.createElement("span");
    yr.className = "sc-interp";
    yr.setAttribute("data-dc-computed", "yearNow");
    yr.textContent = String(new Date().getFullYear());
    span.appendChild(yr);
    span.appendChild(document.createTextNode(parts[1]));
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
  /* ── BEGIN OWNER-REG-05 chat scroll-lock lifecycle ─────────────────────────────────────────────────────────
   * iOS: footer "Chat with Priya" → minimize left the page frozen. The chat lifecycle owns only what changed
   * during it: when a trigger opens the chat, the inline scroll-lock properties of <body>/<html> and the scroll
   * position are recorded (never re-recorded while open); on the open→closed transition, once, each recorded
   * property that now differs is put back exactly (value + priority), the scroll position is re-applied
   * (instantly) only if a property had to be restored or the page was pinned while the chat was open, and focus
   * left inside the hidden chat returns to the trigger without scrolling. Nothing is blanket-reset: while another
   * modal (film-player's <dialog>, the about-us viewer) is open its lock is left alone and the restore waits.
   * Hooks outside this block: syncChatState (reconciled expanded state + transition), openChat (baseline). */
  var CHAT_LOCK_PROPS = ["overflow", "overflow-x", "overflow-y", "position", "top", "left", "right", "bottom", "width", "height", "touch-action", "overscroll-behavior"];
  var chatLock = null, chatWasOpen = false, chatPanelSeen = false, chatRestoreTimer = null, chatRestoreTries = 0;
  function chatStyleSnapshot(el) {
    var s = {};
    if (!el || !el.style || !el.style.getPropertyValue) return null;
    for (var i = 0; i < CHAT_LOCK_PROPS.length; i++) s[CHAT_LOCK_PROPS[i]] = [el.style.getPropertyValue(CHAT_LOCK_PROPS[i]), el.style.getPropertyPriority(CHAT_LOCK_PROPS[i])];
    return s;
  }
  function chatSnapshot(trigger) {
    chatLock = { trigger: trigger || null, x: window.scrollX || window.pageXOffset || 0, y: window.scrollY || window.pageYOffset || 0,
      body: chatStyleSnapshot(document.body), html: chatStyleSnapshot(document.documentElement) };
  }
  function chatRestoreStyles(el, saved) {
    var restored = false;
    if (!el || !saved) return false;
    for (var p in saved) {
      if (el.style.getPropertyValue(p) === saved[p][0] && el.style.getPropertyPriority(p) === saved[p][1]) continue;
      if (saved[p][0]) el.style.setProperty(p, saved[p][0], saved[p][1]); else el.style.removeProperty(p);
      restored = true;
    }
    return restored;
  }
  // the provider pins the page while open on phones (html.__cb_widget_active: html/body position:fixed) and on close
  // scrolls back with the page's smooth scroll-behavior, so the page visibly jumps to the top and glides back
  function viewportPinned() {
    try { return window.getComputedStyle(document.documentElement).position === "fixed" || window.getComputedStyle(document.body).position === "fixed"; } catch (e) { return false; }
  }
  function otherModalOpen() {
    if (!document.querySelectorAll) return false;
    var m = document.querySelectorAll('dialog[open], [aria-modal="true"]');
    for (var i = 0; i < m.length; i++) {
      if (m[i].closest && m[i].closest("#chatbase-bubble-window")) continue;
      if (m[i].tagName === "DIALOG" || visible(m[i])) return true;
    }
    return false;
  }
  function chatRelease() {
    if (chatRestoreTimer) { clearTimeout(chatRestoreTimer); chatRestoreTimer = null; }
    var lock = chatLock;
    if (!lock) return;
    if (otherModalOpen()) {
      // another modal owns the page lock right now; retry after it closes (bounded: ~60s, then leave it be)
      if (++chatRestoreTries <= 240) chatRestoreTimer = setTimeout(function () { chatRestoreTimer = null; if (!chatWasOpen) chatRelease(); }, 250);
      return;
    }
    chatLock = null; chatRestoreTries = 0;
    var restored = chatRestoreStyles(document.body, lock.body);
    restored = chatRestoreStyles(document.documentElement, lock.html) || restored;
    // back to the position the chat opened at, instantly — only when this lifecycle pinned or locked the page (a visitor
    // who scrolled a desktop page while the chat sat open is never moved)
    if ((restored || lock.pinned) && window.scrollTo && ((window.scrollY || 0) !== lock.y || (window.scrollX || 0) !== lock.x)) window.scrollTo({ left: lock.x, top: lock.y, behavior: "instant" });
    var active = document.activeElement, panel = document.getElementById("chatbase-bubble-window");
    var stranded = !active || active === document.body || (panel && panel.contains && panel.contains(active));
    if (stranded && lock.trigger && lock.trigger.isConnected && lock.trigger.focus) { try { lock.trigger.focus({ preventScroll: true }); } catch (e) {} }
  }
  // Leaving the page (including into the back/forward cache) cancels timers, so a pending open never fires on return;
  // a restore that was waiting on another modal is retried when the page is shown again.
  if (window.addEventListener) {
    window.addEventListener("pagehide", function () {
      if (chatPending) { clearTimeout(chatTimer); chatTimer = null; chatPending = false; chatLock = null; }
      if (chatRestoreTimer) { clearTimeout(chatRestoreTimer); chatRestoreTimer = null; }
    });
    window.addEventListener("pageshow", function () { if (chatLock && !chatWasOpen && !chatPending) { chatRestoreTries = 0; chatRelease(); } schedule(); });
  }
  /* ── END OWNER-REG-05 chat scroll-lock lifecycle ─────────────────────────────────────────────────────────── */
  function chatAttribute(el, name, value) {
    if (el && el.getAttribute(name) !== value) el.setAttribute(name, value);
  }
  function syncChatState() {
    var nativeButton = document.getElementById("chatbase-bubble-button");
    var panel = document.getElementById("chatbase-bubble-window");
    // The provider's aria-expanded, reconciled with the panel itself: an absent attribute is not "closed" while the
    // panel is visibly open, and a panel that was shown and is now hidden is closed even if aria-expanded is stale.
    var shown = !!(panel && visible(panel));
    if (shown) chatPanelSeen = true;
    var aria = nativeButton ? nativeButton.getAttribute("aria-expanded") : null;
    var expanded = aria === "true" ? !(chatPanelSeen && panel && !shown) : aria === "false" ? false : shown;
    if (chatWasOpen && !expanded) { chatWasOpen = false; chatPanelSeen = false; chatRelease(); }
    else if (expanded) { chatWasOpen = true; if (chatLock && !chatLock.pinned && viewportPinned()) chatLock.pinned = true; }
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
      if (panel) chatObserver.observe(panel, { attributes: true, attributeFilter: ["style", "hidden", "class"] });
      observedChatButton = nativeButton; observedChatWindow = panel;
    }
  }
  function openChat(ev) {
    ev.preventDefault();
    if (chatPending) {
      clearTimeout(chatTimer); chatTimer = null; chatPending = false; chatLock = null; syncChatState(); return;
    }
    // opening (not minimizing): record the baseline before the provider can touch anything
    if (!chatWasOpen) { if (chatRestoreTimer) { clearTimeout(chatRestoreTimer); chatRestoreTimer = null; } chatRestoreTries = 0; chatSnapshot(ev.currentTarget); }
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
  // OWNER-REG-02 (owner, 28 Sep 2026: "apply the homepage bottom call/enquire/free-consult contact bar
  // consistently across pages"). ONE shared bar, built here for every design and native page in every locale,
  // replaces the templates' own copies (the homepage's sticky bar, the phone templates' scroll-in bar, the
  // panchakarma "Quick actions" bar, the training/yoga strips) so exactly one bar is ever on screen. Labels, order,
  // colours and destinations are the homepage bar's own (public/ahv/views/home-mobile.json): Call → the hospital
  // phone exactly as the homepage links it; Enquire → the homepage's enquiry link as boot.ts resolves it through
  // english-candidate/link-aliases.json (/enquiry-form → /contact-us/); Free Consult → /online-consultation/.
  // The markup is ONE HTML string so the locale build (tools/l10n, runtime scripts) translates it with the SAME
  // units the templates' bar already carries — no new strings. Locale pages take the locale route through
  // AHV_LOCAL_PATHS, like every other shared control. Shown on phone widths only (< 700px: the homepage serves its
  // bar in the phone view alone); layout, safe-area, clearance and offsets in chrome.css. The /lp/ lane (which
  // loads this script through ReviewsShell) is excluded: chromeless ad pages, one CTA each, their own pinned
  // WhatsApp CTA. Presentation only: consent, analytics and forms untouched.
  var CTA_BAR = "<nav id=\"ahv-cta-bar\" aria-label=\"Quick actions\"><a class=\"ahv-cta-call\" href=\"tel:+91 9555 156 156\">Call</a> <a class=\"ahv-cta-enquire\" href=\"/contact-us/\">Enquire</a> <a class=\"ahv-cta-consult\" href=\"/online-consultation/\">Free Consult</a></nav>";
  // A template's own bottom bar, from its inline style and its links (structural, any locale):
  // "replace" = hidden, the shared bar stands in; "unpin" = stays where it sits in the page, not pinned.
  function ctaBarKind(style, links, tel) {
    var fixed = /position:\s*fixed/.test(style), sticky = /position:\s*sticky/.test(style);
    // a full-height layer (pinned top AND bottom: a drawer, an overlay) is never a bar
    if (!(fixed || sticky) || !/(^|;)\s*bottom:\s*0(px)?\s*(;|$)/.test(style) || /(^|;)\s*(top|inset):\s*0/.test(style) || links < 1) return "";
    if (fixed) return links >= 2 ? "replace" : "";
    return tel && links >= 3 ? "replace" : "unpin";
  }
  function ctaBar() {
    // OWNER-REG-02 (all pages, owner 28 Sep 2026) includes the /lp/ lane: the shared bar shows there too; the LP's own
    // pinned WhatsApp strip (.lp-sticky) steps aside while the bar is on (chrome.css), so one bar is pinned at a time,
    // and "Enquire" goes to the landing page's own consultation form (campaign context kept, below).
    var isLp = document.body.classList.contains("lp-page");
    var pinned = root.querySelectorAll('[style*="position"][style*="bottom"]');
    for (var i = 0; i < pinned.length; i++) {
      var p = pinned[i];
      if (p.hasAttribute("data-ahv-cta-bar") || p.hasAttribute("data-ahv-cta-unpin")) continue;
      if (p.closest("header, #ahv-consent, #ahv-contact-controls") || p.querySelector("header")) continue;
      var ph = p.getBoundingClientRect().height;
      if (!ph || ph > 160) continue; // not laid out yet (re-checked next pass), or not a bar
      var kind = ctaBarKind(p.getAttribute("style") || "", p.querySelectorAll("a[href]").length, !!p.querySelector('a[href^="tel:"]'));
      if (kind === "replace") p.setAttribute("data-ahv-cta-bar", "");
      else if (kind === "unpin") p.setAttribute("data-ahv-cta-unpin", "");
    }
    var html = document.documentElement, bar = document.getElementById("ahv-cta-bar");
    if (!bar) {
      var box = document.createElement("div");
      box.innerHTML = CTA_BAR;
      bar = box.firstChild;
      document.body.appendChild(bar);
      html.setAttribute("data-ahv-cta-bar-on", "");
    }
    var lp = window.AHV_LOCAL_PATHS, form = root.querySelector("form[id]");
    var here = location.pathname.replace(/\/?$/, "/");
    bar.querySelectorAll("a").forEach(function (a) {
      var h = a.getAttribute("href") || "";
      if (lp && lp[h] && lp[h] !== h) a.setAttribute("href", (h = lp[h]));
      // the enquiry page itself: "Enquire" goes to its form, as boot.ts does for the page's own self-links
      if (h.charAt(0) === "/" && h === here && form && form.id) a.setAttribute("href", "#" + form.id);
      // a landing page: "Enquire" goes to its own in-page consultation form (the LP's "Request a consultation" link)
      if (isLp && a.classList.contains("ahv-cta-enquire")) {
        var lpForm = document.querySelector('a.lp-enquire-link[href^="#"]');
        if (lpForm && document.getElementById(lpForm.getAttribute("href").slice(1))) a.setAttribute("href", lpForm.getAttribute("href"));
      }
    });
    // the homepage's own cookie notice sits above the bar the same way #ahv-consent does (chrome.css)
    // (its privacy link carries the locale's own slug on locale pages, read from the same path map)
    markDesignNotices();
    var hgt = Math.round(bar.getBoundingClientRect().height);
    if (hgt) html.style.setProperty("--ahv-cta-bar-h", hgt + "px"); else html.style.removeProperty("--ahv-cta-bar-h");
  }
  window.addEventListener("resize", function () { schedule(); });
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
  // Standalone article actions belong to their content, not a bare floating line.
  function articleActions() {
    if (root.getAttribute("data-ahv-family") !== "article-reader") return;
    root.querySelectorAll("main p:not([data-ahv-article-action])").forEach(function (p) {
      if (p.closest('nav,header,footer,table,[data-ahv-article-cta],[data-collection="cards"],[data-source-component="virtual-tour-card"]')) return;
      var links = p.querySelectorAll("a[href]");
      if (links.length !== 1) return;
      var a = links[0];
      if (!a.textContent.trim() || a.querySelector("img,svg") || p.textContent.trim() !== a.textContent.trim()) return;
      // Preserve existing designed buttons and downloads, only repair their placement.
      var cs = getComputedStyle(a);
      var designed = cs.backgroundColor !== "rgba(0, 0, 0, 0)" && cs.backgroundColor !== "transparent";
      p.setAttribute("data-ahv-article-action", designed ? "existing" : "related");
      var previous = p.previousElementSibling;
      if (previous && previous.getAttribute("role") === "note") {
        var group = document.createElement("div");
        group.setAttribute("data-ahv-article-note-action", "");
        previous.parentNode.insertBefore(group, previous);
        group.appendChild(previous);
        group.appendChild(p);
      }
    });
  }
  function pass() {
    scheduled = false;
    try {
      if (campaignRoot) { footers().forEach(function(f) { whatsapp(f); copyright(f); chatLinks(f); }); priyaWidget(); syncChatState(); externalLinks(); return; }
      var fs = footers();
      for (var i = 0; i < fs.length; i++) { whatsapp(fs[i]); copyright(fs[i]); chatLinks(fs[i]); }
      priyaWidget();
      ctaBar();
      syncChatState();
      externalLinks();
      // Legacy breadcrumbs must navigate; preserve the locale home/offer destination.
      var localeMatch = location.pathname.match(/^\/(hi|de|fr|es|it|pt|nl|ru|ar|zh|ja|ko)(?:\/|$)/);
      var homeHref = localeMatch ? "/" + localeMatch[1] + "/" : "/";
      if (root.getAttribute("data-ahv-route") === "/defence-and-paramilitary-forces/") {
        root.querySelectorAll('nav[aria-label] a[href="#"]').forEach(function (a) {
          var tpl = a.getAttribute("data-dc-tpl");
          if (tpl === "11") a.setAttribute("href", homeHref);
          if (tpl === "13" || tpl === "10") a.setAttribute("href", (window.AHV_LOCAL_PATHS || {})["/offers/"] || "/offers/");
        });
      }
      if (root.getAttribute("data-ahv-family") === "how-to-reach") root.querySelectorAll('nav[aria-label] a[href="#"]').forEach(function(a) {
        if (a.closest("header,footer")) return;
        if (a.parentElement.querySelectorAll("a")[0] === a) a.setAttribute("href", homeHref);
      });

      articleActions();
      liftContacts();
      noticeUnderMenu();
      switcherContrast();
      templateLaunchers();
      enquiryPreselect();
      footerLanguages();
    } catch (e) { /* never break the page */ }
  }
  // TF-18 (owner, 28 Sep 2026): a treatment page's enquiry button opens /enquiry-form/?programme=treatment and the
  // form's existing, editable "What's it about?" select starts on its existing "Planning a treatment programme"
  // option. Only a known key maps (unknown or missing → the form is left exactly as it is); the option is taken by
  // its POSITION in the existing list because locales translate the labels; a visitor's own choice is never
  // overridden. The value goes through the select's normal change event, so the form's state, validation, consent,
  // field names and submission transport are the form's own — nothing here submits or stores anything.
  // FOOTER-13 (owner, 28 Sep 2026): the footers printed "English · Français · Deutsch" (home) or "English" (shared
  // chrome) — three languages, no links. Every footer variant marks that label [data-ahv-footer-langs]; it is rebuilt
  // here from the page's own language switcher, the single source that already carries all 13 released languages,
  // their native names, the current one, and this page's equivalent deep link in each. Current language: named, not
  // linked (aria-current). Idempotent per element (the snapshot footer is replaced when the live view mounts).
  function footerLanguages() {
    var list = document.querySelector('.ahv-lang-list'); if (!list) return;
    // Footers captured before the marker existed (the native pages' stored chrome snapshot) still print the bare
    // label: that exact leaf is adopted as the slot, so the list lands where the label was.
    footers().forEach(function (f) {
      f.querySelectorAll('span:not([data-ahv-footer-langs])').forEach(function (s) {
        if (s.closest('.ahv-footer-langs, .ahv-lang-list, [data-ahv-footer-langs]')) return;
        if (!s.children.length && /^English( · Français · Deutsch)?$/.test((s.textContent || '').trim())) s.setAttribute('data-ahv-footer-langs', '');
      });
    });
    var slots = document.querySelectorAll('[data-ahv-footer-langs]:not([data-ahv-footer-langs-done])');
    var seen = {}, items = [];
    list.querySelectorAll('a[data-ahv-lang-option]').forEach(function (a) {
      var code = a.getAttribute('data-ahv-lang-option'); if (seen[code]) return; seen[code] = 1;
      var name = a.querySelector('span:last-child'); name = (name ? name.textContent : a.textContent || '').trim();
      items.push({ code: code, name: name, href: a.getAttribute('href'), lang: a.getAttribute('lang') || code, cur: a.getAttribute('aria-current') === 'true' || a.getAttribute('aria-current') === 'page' });
    });
    if (items.length < 2) return;
    var sig = items.map(function (it) { return it.code + '=' + (it.cur ? '*' : it.href); }).join('|');
    function makeNav() {
      var nav = document.createElement('nav'); nav.setAttribute('aria-label', list.getAttribute('aria-label') || 'Language'); nav.className = 'ahv-footer-langs';
      nav.setAttribute('data-sig', sig);
      items.forEach(function (it, k) {
        if (k) { var sep = document.createElement('span'); sep.setAttribute('aria-hidden', 'true'); sep.textContent = ' · '; nav.appendChild(sep); }
        var el;
        if (it.cur || !it.href || it.href.charAt(0) === '#') { el = document.createElement('span'); el.setAttribute('aria-current', 'true'); }
        else { el = document.createElement('a'); el.setAttribute('href', it.href); el.setAttribute('hreflang', it.lang); }
        el.setAttribute('lang', it.lang); el.textContent = it.name; nav.appendChild(el);
      });
      return nav;
    }
    for (var i = 0; i < slots.length; i++) {
      var slot = slots[i]; slot.setAttribute('data-ahv-footer-langs-done', '');
      slot.textContent = ''; slot.appendChild(makeNav());
    }
    // Some footer designs hide the bar that holds the label on phones: a visible footer with no visible language
    // list gets one on its bottom bar, so every viewport shows the 13 languages.
    var fs = footers();
    for (var j = 0; j < fs.length; j++) {
      var f = fs[j];
      var shown = [].some.call(f.querySelectorAll('.ahv-footer-langs'), function (n) { return n.getClientRects().length > 0; });
      if (shown || f.querySelector('[data-ahv-footer-langs-added]')) continue;
      var bar = f.lastElementChild || f; var add = makeNav(); add.setAttribute('data-ahv-footer-langs-added', '');
      bar.appendChild(add);
    }
    // A list captured in a snapshot for another page (the native pages reuse one stored chrome) or before the
    // switcher settled carries that page's links: any list whose signature differs is rebuilt in place.
    document.querySelectorAll('nav.ahv-footer-langs').forEach(function (n) {
      if (n.getAttribute('data-sig') === sig) return;
      var fresh = makeNav(); n.textContent = ''; while (fresh.firstChild) n.appendChild(fresh.firstChild); n.setAttribute('data-sig', sig);
    });
  }
  // The server snapshot's form is replaced when the live view mounts, so each select element is handled once.
  var PRESELECT = { treatment: 1 };
  function enquiryPreselect() {
    var key = new URLSearchParams(location.search).get('programme');
    if (!key || !Object.prototype.hasOwnProperty.call(PRESELECT, key)) return;
    var sel = document.querySelector('form[data-form="contact"] select[name="programme"]');
    if (!sel || sel.hasAttribute('data-ahv-preselected')) return; // not rendered yet, or already handled
    sel.setAttribute('data-ahv-preselected', '');
    var opt = sel.options[PRESELECT[key]];
    if (!opt || sel.selectedIndex > 0) return;
    if ((document.documentElement.lang || 'en').slice(0, 2) === 'en' && !/treatment programme/i.test(opt.text)) return; // list changed: do nothing
    Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(sel, opt.value);
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  }
  // The templates' own floating Priya / WhatsApp launchers are replaced by #ahv-contact-controls.
  // chrome.css hides them by their English aria-label; locale pages translate that label, so they
  // are also recognised by destination: a short chat.kairali.com link or an icon-only wa.me link that
  // is itself (or sits in) a fixed-position launcher. In-flow content links are never touched.
  function templateLaunchers() {
    var root = document.getElementById('ahv-design-root');
    if (!root) return;
    root.querySelectorAll('a[href]').forEach(function (a) {
      if (a.closest('#ahv-contact-controls') || a.hasAttribute('data-ahv-template-launcher')) return;
      var h = a.getAttribute('href') || '';
      var launcher = false;
      var chat = /^https:\/\/chat\.kairali\.com/.test(h) && (a.textContent || '').replace(/\s+/g, '').length <= 20;
      var wa = /^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(h) && !(a.textContent || '').replace(/\s+/g, '');
      if (chat || wa) {
        var el = a, hops = 0;
        while (el && hops < 3) { if (getComputedStyle(el).position === 'fixed') { launcher = true; break; } el = el.parentElement; hops++; }
      }
      if (launcher) a.setAttribute('data-ahv-template-launcher', '');
    });
  }
  // EF-25 (owner, 26 Sep 2026): while the cookie notice is on screen the WhatsApp / chat controls
  // sit above it instead of covering its buttons (seen at 390px over "Accept All"). Presentation
  // only — the notice, its choices, storage and signals are untouched.
  // The homepage view renders its own cookie notice (a fixed box with two buttons and a privacy link) instead of
  // #ahv-consent; mark it so the bar offset (chrome.css) and the page-end clearance below treat it the same way.
  // Its privacy link carries the locale's own slug on locale pages, read from the same path map.
  function markDesignNotices() {
    var root = document.getElementById('ahv-design-root');
    if (!root) return;
    var lp = window.AHV_LOCAL_PATHS || null;
    var privLocal = lp && (lp["/new-privacy-policy/"] || lp["/privacy-policy/"]);
    var fixed = root.querySelectorAll('[style*="position: fixed"], [style*="position:fixed"]');
    for (var k = 0; k < fixed.length; k++) {
      var n = fixed[k];
      if (n.hasAttribute("data-ahv-cta-notice") || n.closest("header") || n.querySelectorAll("button").length < 2) continue;
      if (n.querySelector('a[href*="privacy"]') || (privLocal && n.querySelector('a[href$="' + privLocal + '"]'))) n.setAttribute("data-ahv-cta-notice", "");
    }
  }
  function pendingNotice() {
    var list = [document.getElementById('ahv-consent')].concat([].slice.call(document.querySelectorAll('[data-ahv-cta-notice]')));
    for (var i = 0; i < list.length; i++) {
      var n = list[i];
      if (!n) continue;
      var r = n.getBoundingClientRect();
      if (r.height > 0 && r.top < window.innerHeight) return n;
    }
    return null;
  }
  function liftContacts() {
    markDesignNotices();
    var n = pendingNotice(), off = 0;
    // distance from the notice's top edge to the viewport bottom: includes a floating notice's own bottom offset
    if (n) off = Math.max(0, Math.round(window.innerHeight - n.getBoundingClientRect().top + 12));
    var c = document.getElementById('ahv-contact-controls');
    if (c) { if (off) c.style.bottom = off + 'px'; else c.style.removeProperty('bottom'); }
    // page-end clearance for the pending notice (chrome.css html[data-ahv-consent-open]) and matching
    // scroll-padding so keyboard focus is never scrolled under it; presentation only
    var root = document.documentElement;
    // focus clearance adds the WhatsApp / chat controls, which sit just above the notice while it is pending
    var clear = off && c ? off + Math.round(c.getBoundingClientRect().height) + 12 : off + 8;
    if (off) { root.setAttribute('data-ahv-consent-open', ''); root.style.setProperty('--ahv-consent-h', off + 'px'); root.style.setProperty('--ahv-focus-clear', clear + 'px'); }
    else if (root.hasAttribute('data-ahv-consent-open')) { root.removeAttribute('data-ahv-consent-open'); root.style.removeProperty('--ahv-consent-h'); root.style.removeProperty('--ahv-focus-clear'); }
    // desktop page-end clearance (chrome.css --ahv-page-clear): whichever reaches higher, the pending notice (with the
    // controls lifted above it) or the floating WhatsApp / chat controls alone, so the footer's last row can scroll
    // clear of both. In RTL that row starts on the right, under the controls (VERIFY footer-reachability, /ar/ 1440px)
    var cr = c ? c.getBoundingClientRect() : null;
    var ctrl = cr && cr.height ? Math.max(0, Math.round(window.innerHeight - cr.top + 12)) : 0;
    var page = Math.max(off ? clear : 0, ctrl);
    if (page) root.style.setProperty('--ahv-page-clear', page + 'px'); else root.style.removeProperty('--ahv-page-clear');
  }
  window.addEventListener('resize', liftContacts);
  // EF-25 (owner, 26 Sep 2026: the cookie notice must not obscure navigation): the homepage's own phone
  // menu and the cookie notice share z-index 60 and the notice, later in the document, covered the open
  // menu's lower half on a fresh visit. While a header menu is expanded the notice steps one layer
  // below it; closing the menu restores it. Structural (any locale). Nothing is hidden or answered —
  // the notice, its choices, storage and signals are untouched.
  // The language switcher (boot.ts) is dark text by default. On the homepage hero's transparent header its
  // neighbours (Search, phone) are white over the video, so the switcher read dark-on-dark (28 Sep 2026). It
  // follows its neighbours: light when most sibling controls use light text. Structural, any locale.
  function switcherContrast() {
    var boxes = document.querySelectorAll('.ahv-lang');
    for (var i = 0; i < boxes.length; i++) {
      var box = boxes[i], par = box.parentElement; if (!par) continue;
      var light = 0, dark = 0;
      for (var k = 0; k < par.children.length; k++) {
        var c = par.children[k]; if (c === box || !c.getBoundingClientRect().width) continue;
        var m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(getComputedStyle(c).color); if (!m) continue;
        var lum = (0.2126 * m[1] + 0.7152 * m[2] + 0.0722 * m[3]) / 255;
        if (lum > 0.7) light++; else dark++;
      }
      if (light > dark) box.setAttribute('data-ahv-lang-light', ''); else box.removeAttribute('data-ahv-lang-light');
    }
  }
  function noticeUnderMenu() {
    var open = false, bs = document.querySelectorAll('header button[aria-expanded="true"]');
    for (var i = 0; i < bs.length; i++) if (!bs[i].classList.contains('ahv-lang-btn') && bs[i].getAttribute('aria-haspopup') !== 'dialog') open = true;
    var fixed = document.querySelectorAll('#ahv-design-root [style*="position: fixed"], #ahv-design-root [style*="position:fixed"], #ahv-consent');
    for (var k = 0; k < fixed.length; k++) {
      var n = fixed[k];
      // the privacy link carries the locale's own slug (e.g. /de/datenschutzerklarung/), read from the locale path map
      var lp = window.AHV_LOCAL_PATHS && (window.AHV_LOCAL_PATHS['/new-privacy-policy/'] || window.AHV_LOCAL_PATHS['/privacy-policy/']);
      var priv = n.querySelector('a[href*="privacy-policy"]') || (lp && n.querySelector('a[href="' + lp + '"], a[href$="' + lp + '"]'));
      if (n.closest('header') || !priv || n.querySelectorAll('button').length < 2) continue;
      if (open) n.setAttribute('data-ahv-notice-under-menu', ''); else n.removeAttribute('data-ahv-notice-under-menu');
    }
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(pass, 0);
  }
  if (window.MutationObserver) new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['href', 'aria-expanded'] });
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
    // Superseded on family pages (owner, 26 Sep 2026 — HEADER-TAKEOVER-OWNER-DECISION.md): the ONE
    // compact family header (family-header.js) stays; the in-page bar is never pinned over it.
    if (document.documentElement.hasAttribute('data-ahv-fh')) { if (active || nav) reset(); root.removeAttribute('data-ahv-secondary-page'); return; }
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

// Footer keyboard focus: locale headers can exceed the static 96px focus margin.
// Measure only visible fixed/sticky header surfaces; preserve anchor offsets and bottom-layer rules.
(function () {
  function footerHeaderDelta(target, headers) {
    var bottom = 0;
    headers.forEach(function (r) {
      if (r.right > target.left && r.left < target.right && r.bottom > target.top && r.top < target.bottom)
        bottom = Math.max(bottom, r.bottom);
    });
    return bottom ? Math.min(0, target.top - bottom - 8) : 0;
  }
  document.addEventListener('focusin', function (event) {
    var target = event.target;
    if (!target || !target.closest || !target.closest('#ahv-design-root footer') || !target.matches('a,button,input,select,textarea,summary,[tabindex]')) return;
    // Let the browser's native focus scroll settle before measuring the remaining collision.
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      if (document.activeElement !== target || !target.isConnected) return;
      var headers = [];
      document.querySelectorAll('#ahv-design-root header, [data-ahv-fh-sticky]').forEach(function (header) {
        if (header.contains(target)) return;
        var cs = getComputedStyle(header), r = header.getBoundingClientRect();
        if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0 || r.width <= 0 || r.height <= 0 || r.bottom <= 0 || r.top >= innerHeight) return;
        var pinned = false;
        for (var n = header; n && n !== document.body; n = n.parentElement) {
          var pos = getComputedStyle(n).position;
          if (pos === 'fixed' || pos === 'sticky') { pinned = true; break; }
        }
        if (pinned) headers.push(r);
      });
      var delta = footerHeaderDelta(target.getBoundingClientRect(), headers);
      if (delta) window.scrollBy({ top: delta, left: 0, behavior: 'instant' });
    }); });
  });
})();
