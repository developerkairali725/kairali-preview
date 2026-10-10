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
    var existing = f.querySelector("[data-ahv-copyright]");
    if (existing) {
      // Older captures put this line inside the preferences control. Keep
      // copyright text separate from the button's accessible label/border.
      var control = existing.closest("[data-ahv-cookie-choices]");
      if (control) {
        var bottom = control.previousElementSibling;
        (bottom && bottom.matches("div,section") ? bottom : f).appendChild(existing);
      }
      return;
    }
    if (/©/.test(f.textContent || "")) return;
    // A preferences control can be appended after the footer's bottom bar.
    // Never make the copyright a child of an interactive element.
    var bar = f.lastElementChild;
    if (!bar) return;
    if (bar.matches("button,a,input,select,textarea")) {
      var previous = bar.previousElementSibling;
      bar = previous && previous.matches("div,section") ? previous : f;
    }
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
  var chatPending = false, contactChoiceTrigger = null, chatTimer = null, chatObserver = null;
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
    if (!chatWasOpen) { if (chatRestoreTimer) { clearTimeout(chatRestoreTimer); chatRestoreTimer = null; } chatRestoreTries = 0; chatSnapshot(ev.currentTarget && ev.currentTarget.classList && ev.currentTarget.classList.contains("ahv-contact-chat") ? contactChoiceTrigger : ev.currentTarget); }
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
    var links = f.querySelectorAll('a[href^="https://chat.kairali.com"], a[href="#chat"][data-ahv-chat="1"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      // Snapshots keep attributes, but event handlers must bind again on their
      // new DOM nodes. This runtime-only flag also makes repeated passes safe.
      if (a.__ahvChatBound) continue;
      a.setAttribute("data-ahv-chat", "1");
      a.setAttribute("href", "#chat");
      a.removeAttribute("target");
      a.addEventListener("click", openChat);
      a.__ahvChatBound = true;
    }
  }
  // Owner 5 Oct: one Chat control, with explicit channel choices. Closed controls
  // live in the header/mobile action bar, so no floating launcher covers content.
  function openContactChoices(ev) {
    contactChoiceTrigger = ev.currentTarget;
    ev.preventDefault();
    var dialog = document.getElementById("ahv-contact-controls");
    if (dialog && !dialog.open) { dialog.showModal(); dialog.querySelector("button[data-ahv-close]").focus(); }
  }
  function bindContactTrigger(button) {
    if (button.__ahvContactBound) return;
    button.addEventListener("click", openContactChoices);
    button.__ahvContactBound = true;
  }
  function contactTrigger() {
    var b = document.createElement("button");
    b.type = "button"; b.className = "ahv-contact-trigger"; b.textContent = "Chat";
    b.setAttribute("aria-haspopup", "dialog"); b.setAttribute("aria-controls", "ahv-contact-controls");
    bindContactTrigger(b);
    return b;
  }
  function priyaWidget() {
    if (!document.getElementById("ahv-contact-controls")) {
      var controls = document.createElement("dialog");
      controls.id = "ahv-contact-controls";
      controls.className = "ahv-contact-choices";
      controls.setAttribute("aria-labelledby", "ahv-contact-title");
      controls.innerHTML = '<button type="button" data-ahv-close aria-label="Close chat choices">Close</button><h2 id="ahv-contact-title">How would you like to chat?</h2><div class="ahv-contact-channels"><a class="ahv-contact-wa" href="https://wa.me/919289838797" target="_blank" rel="noopener noreferrer">WhatsApp us</a><button type="button" class="ahv-contact-chat"><span class="ahv-contact-label">Chat with Priya</span></button><a class="ahv-contact-social" href="https://ig.me/m/kairaliayurvedichealingvillage" target="_blank" rel="noopener noreferrer">Instagram</a><a class="ahv-contact-social" href="https://m.me/KairaliTheAyurvedicHealingVillage" target="_blank" rel="noopener noreferrer">Facebook Messenger</a></div>';
      controls.querySelector("[data-ahv-close]").addEventListener("click", function () { controls.close(); });
      controls.querySelector(".ahv-contact-chat").addEventListener("click", function (ev) { controls.close(); openChat(ev); });
      document.body.appendChild(controls);
    }
    root.querySelectorAll("header").forEach(function (header) {
      var familyMenu = header.querySelector(".ahv-fh-btn");
      var group = (familyMenu && familyMenu.parentElement) || header.querySelector("nav") || header.querySelector("div:last-child") || header;
      var trigger = header.querySelector(".ahv-contact-trigger");
      if (!trigger) { trigger = contactTrigger(); group.appendChild(trigger); }
      else if (trigger.parentElement !== group) group.appendChild(trigger);
      bindContactTrigger(trigger);
    });
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
      var kind = ctaBarKind(p.getAttribute("style") || "", p.querySelectorAll("a[href]").length, !!p.querySelector('a[href^="tel:"]'));
      if (!kind) continue;
      var ph = p.getBoundingClientRect().height;
      if (!ph || ph > 160) continue; // not laid out yet (re-checked next pass), or not a bar
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
      bar.appendChild(contactTrigger());
    }
    var lp = window.AHV_LOCAL_PATHS, form = root.querySelector("form[id]");
    var here = location.pathname.replace(/\/?$/, "/");
    bar.querySelectorAll("a").forEach(function (a) {
      if (campaignRoot && a.classList.contains("ahv-cta-consult")) { syncFreeConsult(a, lp); return; }
      var h = a.getAttribute("href") || "";
      if (lp && lp[h] && lp[h] !== h) a.setAttribute("href", (h = lp[h]));
      // the enquiry page itself: "Enquire" goes to its form, as boot.ts does for the page's own self-links
      if (h.charAt(0) === "/" && h === here && form && form.id) a.setAttribute("href", "#" + form.id);
      // a landing page: "Enquire" goes to its own in-page consultation form (the LP's "Request a consultation" link)
      if (campaignRoot && a.classList.contains("ahv-cta-enquire")) {
        var campaignForm = root.querySelector("#enquiry, #consult") || root.querySelector("main form[id]");
        if (campaignForm) a.setAttribute("href", "#" + campaignForm.id);
      }
      if (isLp && a.classList.contains("ahv-cta-enquire")) {
        var lpForm = document.querySelector('a.lp-enquire-link[href^="#"]');
        if (lpForm && document.getElementById(lpForm.getAttribute("href").slice(1))) a.setAttribute("href", lpForm.getAttribute("href"));
      }
    });
    // the homepage's own cookie notice sits above the bar the same way #ahv-consent does (chrome.css)
    // (its privacy link carries the locale's own slug on locale pages, read from the same path map)
    markDesignNotices();
    var hgt = Math.round(bar.getBoundingClientRect().height);
    var barHeight = hgt ? hgt + "px" : "";
    if (html.style.getPropertyValue("--ahv-cta-bar-h") !== barHeight) {
      if (hgt) html.style.setProperty("--ahv-cta-bar-h", barHeight); else html.style.removeProperty("--ahv-cta-bar-h");
    }
  }
  // LATER-011 / DEC-FREE-CONSULT (owner, 10 Oct 2026: same-page Free Consult, unchanged styling). On the live campaign
  // routes (app/(ppc-v2*): the same free doctor consultation the bar's own link offers) "Free Consult" opens the page's
  // own consultation form, #enquiry, the target of every in-page consultation CTA. Any other route, or a page whose
  // #enquiry holds no form, keeps the bar's own consultation link (`own`, as first built; through the locale path map).
  // Decided for the current path on every pass, so client navigation never keeps a stale target; written only on change.
  // A route change by history alone mutates nothing the observer watches, so the link also re-decides its own
  // destination when it is activated (click, middle click, context menu), before the browser's default action reads
  // the href. Installed once per link; never cancels or stops the event, so modified clicks keep their defaults.
  function syncFreeConsult(a, lp) {
    if (a.__ahvConsultHref == null) a.__ahvConsultHref = a.getAttribute("href") || "";
    if (!a.__ahvConsultBound && typeof a.addEventListener === "function") {
      a.__ahvConsultBound = true;
      var refresh = function () { syncFreeConsult(a, lp); };
      a.addEventListener("click", refresh);
      a.addEventListener("auxclick", refresh);
      a.addEventListener("contextmenu", refresh);
    }
    var want = freeConsultHref(lp, a.__ahvConsultHref);
    if (want && a.getAttribute("href") !== want) a.setAttribute("href", want);
  }
  function freeConsultHref(lp, own) {
    var routes = {
      "/ayurvedic-treatment-packages.html": 1, "/panchkarma-treatment.html": 1, "/pain-management.html": 1,
      "/family-ayurvedic-retreat-kerala.html": 1, "/karkidaka-chikitsha-or-monsoon-wellness.html": 1,
      "/preventive-rejuvenation-detoxification.html": 1, "/ayurveda-retreat-kerala.html": 1, "/wellness-resort-kerala.html": 1,
      "/kairali-cleansing-centre.html": 1, "/treatment-in-kerala.html": 1, "/Ayurveda_Treatment_Neo_S.India_Cities.html": 1,
      "/Kairali_Brand_and_Competition_Neo-original.html": 1, "/weight-loss.html": 1,
      "/lp/ayurveda-treatment-south-india": 1, "/lp/ayurvedic-hospital-kerala": 1, "/lp/kairali-brand": 1,
      "/lp/kairali-cleansing-centre": 1, "/lp/pain-management": 1, "/lp/panchkarma-treatment": 1, "/lp/treatment-in-kerala": 1,
      "/lp/treatment-packages": 1, "/lp/weight-loss": 1, "/lp/behandlung-in-kerala": 1, "/lp/treatment-in-kerala-russian": 1
    };
    var path = location.pathname.replace(/\/+$/, "");
    if (Object.prototype.hasOwnProperty.call(routes, path) && root.querySelector("#enquiry form")) return "#enquiry";
    return lp && own && lp[own] ? lp[own] : own;
  }
  window.addEventListener("resize", function () { schedule(); });
  // Shared policy, including carousel href changes and links outside the design root.
  var externalOriginals = new WeakMap();
  var checkedExternalHrefs = new WeakMap();
  function externalLink(a) {
    var href = a.getAttribute('href'), base = window.location.href;
    var checked = checkedExternalHrefs.get(a);
    // The mutation pass scans every link. Most hrefs are unchanged after the
    // first pass, including the many external links in the shared footer.
    // Keep enforcing the policy if another script changes target or rel.
    if (checked && checked.href === href && checked.base === base) {
      if (!externalOriginals.has(a)) return;
      var currentRel = a.getAttribute('rel') || '';
      if (a.getAttribute('target') === '_blank' && /(?:^|\s)noopener(?:\s|$)/.test(currentRel) && /(?:^|\s)noreferrer(?:\s|$)/.test(currentRel)) return;
    }
    var u; try { u = new URL(href, window.location.href); } catch (_) { return; }
    var external = /^https?:$/.test(u.protocol) && ((u.origin !== window.location.origin && !/^(www\.)?ayurvedichealingvillage\.com$/.test(u.hostname)) || /^\/wp-content\//.test(u.pathname));
    if (external) {
      if (!externalOriginals.has(a)) externalOriginals.set(a, { target: a.getAttribute('target'), rel: a.getAttribute('rel') });
      if (a.getAttribute('target') !== '_blank') a.target = '_blank';
      var rel = Array.from(new Set((a.rel || '').split(/\s+/).filter(Boolean).concat(['noopener', 'noreferrer']))).join(' ');
      if (a.getAttribute('rel') !== rel) a.rel = rel;
    } else if (externalOriginals.has(a)) {
      var old = externalOriginals.get(a);
      ['target', 'rel'].forEach(function (key) { if (old[key] === null) a.removeAttribute(key); else a.setAttribute(key, old[key]); });
      externalOriginals.delete(a);
    }
    checkedExternalHrefs.set(a, { href: href, base: base });
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
  function readableHomeLabels(container) {
    container.querySelectorAll("[style]").forEach(function (el) {
      if (el.closest("a,button,input,select,textarea")) return;
      var size = parseFloat(el.style.fontSize);
      if (size && size < 16) {
        el.style.fontSize = "16px"; el.style.lineHeight = "1.6"; el.style.color = "#514a3f";
      }
    });
  }
  function homeReviewRefinements() {
    if (root.getAttribute("data-ahv-family") !== "home-hi-fi-v4") return;
    var finder = root.querySelector("[data-ahv-home-finder]");
    if (finder) {
      finder.parentElement.classList.add("ahv-finder-section");
      readableHomeLabels(finder);
      var input = finder.querySelector("input[name=q]");
      if (input && document.documentElement.lang.indexOf("en") === 0) input.placeholder = "e.g. back pain";
    }
    root.querySelectorAll(".ahv-home-rates .ahv-rate-grid article").forEach(function (card, i) {
      var heading = card.querySelector("h3"), programme = card.querySelector(":scope > a[href]:not(.ahv-package-image-link)");
      if (heading && programme && !heading.querySelector("a")) {
        var titleLink = document.createElement("a");
        titleLink.href = programme.getAttribute("href");
        titleLink.className = "ahv-package-title-link";
        titleLink.style.cssText = "display:inline;color:inherit;font:inherit;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:4px;margin:0";
        while (heading.firstChild) titleLink.appendChild(heading.firstChild);
        heading.appendChild(titleLink);
      }
      var img = card.querySelector(".ahv-rate-photo");
      if (!img) {
        img = document.createElement("img");
        img.className = "ahv-rate-photo";
        img.src = i === 1 ? "/ahv/assets/img/kt-181.webp" : "/ahv/assets/img/kt-199.webp";
        img.alt = ""; img.loading = "lazy"; img.width = 640; img.height = 400;
        card.insertBefore(img, card.firstChild);
      }
      if (heading && programme && !img.closest("a")) {
        var imageLink = document.createElement("a");
        imageLink.href = programme.getAttribute("href");
        imageLink.className = "ahv-package-image-link";
        imageLink.setAttribute("aria-label", heading.textContent.trim());
        img.parentNode.insertBefore(imageLink, img);
        imageLink.appendChild(img);
      }
    });
    root.querySelectorAll("section").forEach(function (section) {
      var title = section.querySelector("h2");
      var text = title && title.textContent.trim();
      var tr = window.__AHV_T || {};
      if (text === "Our Experts" || text === tr["Our Experts"]) { section.classList.add("ahv-home-experts"); readableHomeLabels(section); }
      if (section.querySelector("button") && Array.from(section.querySelectorAll("a[href]")).some(function(a) { return a.getAttribute("href") === ((window.AHV_LOCAL_PATHS || {})["/gallery/"] || "/gallery/"); })) section.classList.add("ahv-home-gallery");
      if (section.querySelector('a[href*="youtube.com/watch"]')) {
        section.classList.add("ahv-home-stories");
        section.querySelectorAll('a[href*="youtube.com/watch"] [style]').forEach(function (overlay) {
          if (overlay.style.position !== "absolute" || !overlay.querySelector("svg")) return;
          if (overlay.style.left !== "12px" || overlay.style.bottom !== "12px") { overlay.style.inset = "auto"; overlay.style.left = "12px"; overlay.style.bottom = "12px"; }
          if (overlay.style.background !== "transparent") overlay.style.background = "transparent";
        });
      }
    });
  }
  function pass() {
    scheduled = false;
    try {
      if (campaignRoot) { footers().forEach(function(f) { whatsapp(f); copyright(f); chatLinks(f); }); priyaWidget(); ctaBar(); syncChatState(); externalLinks(); return; }
      var fs = footers();
      for (var i = 0; i < fs.length; i++) { whatsapp(fs[i]); copyright(fs[i]); chatLinks(fs[i]); }
      priyaWidget();
      ctaBar();
      homeReviewRefinements();
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
    if (c) {
      var bottom = off ? off + 'px' : '';
      if (c.style.bottom !== bottom) {
        if (off) c.style.bottom = bottom; else c.style.removeProperty('bottom');
      }
    }
    // Read the controls once, after their offset changes and before updating root styles. This keeps
    // the focus and page-end clearance in sync without another read after a style write.
    var cr = c ? c.getBoundingClientRect() : null;
    var root = document.documentElement;
    var clear = off && cr ? off + Math.round(cr.height) + 12 : off + 8;
    var ctrl = cr && cr.height ? Math.max(0, Math.round(window.innerHeight - cr.top + 12)) : 0;
    var page = Math.max(off ? clear : 0, ctrl);
    if (off && !root.hasAttribute('data-ahv-consent-open')) root.setAttribute('data-ahv-consent-open', '');
    if (!off && root.hasAttribute('data-ahv-consent-open')) root.removeAttribute('data-ahv-consent-open');
    function setClearance(name, value) {
      if (root.style.getPropertyValue(name) === value) return;
      if (value) root.style.setProperty(name, value); else root.style.removeProperty(name);
    }
    setClearance('--ahv-consent-h', off ? off + 'px' : '');
    setClearance('--ahv-focus-clear', off ? clear + 'px' : '');
    // Desktop page-end clearance reaches above either the pending notice and lifted controls or the controls alone.
    setClearance('--ahv-page-clear', page ? page + 'px' : '');
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
    var boxes = document.querySelectorAll('.ahv-lang'), decisions = [];
    for (var i = 0; i < boxes.length; i++) {
      var box = boxes[i], par = box.parentElement; if (!par) continue;
      var light = 0, dark = 0;
      for (var k = 0; k < par.children.length; k++) {
        var c = par.children[k]; if (c === box || !c.getBoundingClientRect().width) continue;
        var m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(getComputedStyle(c).color); if (!m) continue;
        var lum = (0.2126 * m[1] + 0.7152 * m[2] + 0.0722 * m[3]) / 255;
        if (lum > 0.7) light++; else dark++;
      }
      decisions.push({ box: box, light: light > dark });
    }
    for (var j = 0; j < decisions.length; j++) {
      var decision = decisions[j];
      if (decision.light && !decision.box.hasAttribute('data-ahv-lang-light')) decision.box.setAttribute('data-ahv-lang-light', '');
      else if (!decision.light && decision.box.hasAttribute('data-ahv-lang-light')) decision.box.removeAttribute('data-ahv-lang-light');
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
