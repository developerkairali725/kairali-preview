/** Shared consent presentation and existing signal/measurement bridge.
 * Used by design pages and the server-rendered search page. */
export const CONSENT_RUNTIME = `
  // Cookie notice. The approved design HAS a real consent mechanism — the home
  // view logic writes localStorage["ktahv-consent"] = "accepted" | "declined"
  // and shows the notice only while the value is absent — but the notice markup
  // lives in the two HOME views only: 2 of 136 templates. 250 of the 252 routes
  // offered no way to accept or decline, so anyone arriving on a programme page
  // from search had no choice at all. Owner-reported 15 Sep 2026.
  //
  // This EXTENDS the approved mechanism rather than replacing it: the same
  // storage key, the same two values, the same copy and the same styling lifted
  // from the approved home view. A choice made on any page therefore suppresses
  // the notice on every page, including the design's own homepage banner, so
  // the two can never both appear or disagree.
  var CONSENT_KEY = "ktahv-consent";
  var pageConsentChoice = null;
  // Localized notice copy from the locale layout (window.__AHV_T); English and every page that
  // inlines this runtime WITHOUT the design boot script (native pages, /lp/) fall through to the
  // English string. Self-contained on purpose: a bare T() threw on those pages (25 Sep regression).
  function CT(s) { var d = window.__AHV_T; return (d && d[s]) || s; }

  // ---- Consent Mode v2 bridge (owner ruling, 2026-09-21) -------------------
  //
  // The layout now renders <ConsentScripts/> from @kairali/consent, which sets
  // all Consent Mode v2 signals to DENIED in <head> before any tag loads, and
  // re-applies a stored fleet choice synchronously. Without the code below that
  // default would never be lifted: startMeasurement() calls gtag("config") and
  // never gtag("consent"), so an accepting visitor would have been measured in
  // denied mode forever. The gate would have gone green while the thing it
  // guards got quietly worse.
  //
  // Two paths can record a choice on this site and BOTH must reach this: our
  // own notice (recordConsent, below) and the approved design's own "Accept
  // all" on the home views, which writes CONSENT_KEY itself. So the sweep tick
  // in ensureConsentNotice() applies it too, and applyConsentMode is
  // idempotent - it fires once per distinct choice.
  var FLEET_CONSENT_KEY = "kairali-consent-v1";
  var CONSENT_SIGNALS = ["ad_storage", "ad_user_data", "ad_personalization",
    "analytics_storage", "functionality_storage", "personalization_storage",
    "security_storage"];
  var consentApplied = null;
  function consentState(granted) {
    var out = {};
    for (var i = 0; i < CONSENT_SIGNALS.length; i++) {
      // security_storage is granted in both states - it is the strictly
      // necessary bucket, and @kairali/consent's DENIED_ALL does the same.
      out[CONSENT_SIGNALS[i]] = (granted || CONSENT_SIGNALS[i] === "security_storage") ? "granted" : "denied";
    }
    return out;
  }
  function applyConsentMode(choice) {
    if (choice !== "accepted" && choice !== "declined") return;
    if (consentApplied === choice) return;
    consentApplied = choice;
    var granted = choice === "accepted";
    var state = consentState(granted);
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== "function") {
      window.gtag = function () { window.dataLayer.push(arguments); };
    }
    window.gtag("consent", "update", state);
    if (typeof window.clarity === "function") window.clarity("consentv2", { analytics_Storage: granted ? "granted" : "denied", ad_Storage: granted ? "granted" : "denied" });
    if (typeof window.fbq === "function") window.fbq("consent", granted ? "grant" : "revoke");
    // Mirror into the fleet record so the head snippet re-applies this choice
    // SYNCHRONOUSLY on the next page load, before any tag can fire. The
    // visitor-facing key and notice are unchanged; this is a second, silent
    // copy for the head, not a second question.
    try {
      localStorage.setItem(FLEET_CONSENT_KEY, JSON.stringify({
        v: 1, granted: granted, consent: state, at: new Date().toISOString()
      }));
    } catch (e) { /* private mode: this page view only, same as CONSENT_KEY */ }
  }
  if (!window.__ahvCookieChoicesBound) {
    window.__ahvCookieChoicesBound = true;
    document.addEventListener("click", function (event) {
      var target = event.target && event.target.closest && event.target.closest("[data-ahv-cookie-choices]");
      if (!target) return;
      event.preventDefault();
      // Deny existing tags first; then clear both records so the next page
      // can show choices rather than restoring the fleet's declined record.
      applyConsentMode("declined");
      try {
        localStorage.removeItem(CONSENT_KEY);
        localStorage.removeItem(FLEET_CONSENT_KEY);
      } catch (e) {}
      window.location.reload();
    });
  }
  function consentChoice() {
    if (pageConsentChoice) return pageConsentChoice;
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }
  function recordConsent(value) {
    pageConsentChoice = value;
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) { /* private mode: honour the choice for this page view only */ }
    var el = document.getElementById("ahv-consent");
    if (el) el.remove();
    applyConsentMode(value);
    if (value === "accepted") startMeasurement();
  }
  function consentNotice() {
    var narrow = window.matchMedia && window.matchMedia("(max-width: " + (cfg.breakpoint - 1) + "px)").matches;
    var wrap = document.createElement("div");
    wrap.id = "ahv-consent";
    wrap.setAttribute("role", "region");
    wrap.setAttribute("aria-label", CT("Cookie notice"));
    // Sits above the design's fixed bottom action bar on narrow screens, which
    // is why the approved home notice uses bottom:74px there.
    wrap.style.cssText = "position:fixed;left:12px;right:12px;bottom:" + (narrow ? "74px" : "24px") +
      ";z-index:60;max-width:" + (narrow ? "406px" : "880px") + ";margin:0 auto;background:#fff;" + /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
      "border:1px solid #E9E2D3;border-radius:4px;box-shadow:0 7px 25px rgba(60,45,20,.08);padding:18px 20px;" + /* approved home-banner palette, unchanged. brand-allow: rogue-hex */
      "box-sizing:border-box;display:flex;gap:" + (narrow ? "10px" : "20px") + ";align-items:center;flex-direction:" + (narrow ? "column" : "row") + ";"; /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
    if (narrow) wrap.style.padding = "12px 14px";
    var copy = document.createElement("div");
    copy.style.cssText = "flex:1;min-width:0;font-size:14.5px;color:#514a3f;line-height:1.55"; /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
    if (narrow) { copy.style.fontSize = "13px"; copy.style.lineHeight = "1.4"; }
    copy.appendChild(document.createTextNode(CT("We use cookies to improve your experience and analyse site traffic. See our") + " "));
    var policy = document.createElement("a");
    policy.setAttribute("href", (cfg.locale && cfg.locale.privacyHref) || "/new-privacy-policy/");
    policy.style.cssText = "font-weight:700";
    policy.textContent = CT("Privacy Policy");
    copy.appendChild(policy);
    copy.appendChild(document.createTextNode("."));
    var row = document.createElement("div");
    row.style.cssText = "display:flex;gap:12px;align-items:center;flex-shrink:0;" + (narrow ? "width:100%" : "min-width:250px");
    var decline = document.createElement("button");
    decline.type = "button";
    decline.textContent = CT("Decline");
    decline.style.cssText = "flex:1;background:none;border:1px solid #C9BFA8;border-radius:4px;" + /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
      "font-family:'Mulish',sans-serif;font-weight:700;font-size:12.5px;letter-spacing:1.5px;color:#75695A;" + /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
      "cursor:pointer;text-transform:uppercase;padding:14px 6px;min-height:44px";
    decline.addEventListener("click", function () { recordConsent("declined"); });
    var accept = document.createElement("button");
    accept.type = "button";
    accept.textContent = CT("Accept All");
    accept.style.cssText = "flex:1;background:#5A4420;color:#F7F4EA;border:none;border-radius:4px;" + /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
      "padding:14px 6px;font-family:'Mulish',sans-serif;font-weight:600;font-size:12.5px;letter-spacing:1.5px;" +
      "cursor:pointer;text-transform:uppercase;min-height:44px";
    accept.addEventListener("click", function () { recordConsent("accepted"); });
    row.appendChild(decline);
    row.appendChild(accept);
    wrap.appendChild(copy);
    wrap.appendChild(row);
    return wrap;
  }
  /** The design's own notice, if this view renders one. Excludes ours. */
  function designNotice() {
    var found = null;
    document.querySelectorAll("button").forEach(function (b) {
      if (found || b.closest("#ahv-consent")) return;
      // Localized views carry the translated label of the SAME button (26 Sep 2026): match either.
      var label = (b.textContent || "").trim();
      if (/^accept all$/i.test(label) || label === CT("Accept all")) found = b;
    });
    return found;
  }
  function ensureConsentNotice() {
    var choice = consentChoice();
    // Catches the design's OWN "Accept all" on the home views, which writes
    // CONSENT_KEY directly and never calls recordConsent.
    applyConsentMode(choice);
    var mine = document.getElementById("ahv-consent");
    // The home views render the approved notice THEMSELVES, and they render it
    // after the design mounts — later than the first sweep tick. So this cannot
    // be a one-shot check: it has to keep looking and retire the captured notice
    // whenever it appears, or the homepage shows two banners. That exact double-up
    // is why this lane has its own root layout in the first place.
    var capturedButton = designNotice();
    if (capturedButton) {
      // Every homepage variant uses one shared notice. Runtime re-renders may
      // recreate the approved capture; the sweep retires it without changing copy.
      var captured = capturedButton.closest("[data-ahv-cta-notice]");
      if (!captured) {
        captured = capturedButton.parentElement;
        while (captured && captured !== host && captured.style.position !== "fixed") captured = captured.parentElement;
      }
      if (captured && captured !== host) captured.remove();
      else return; // Never remove unrelated content if the view contract changes.
    }
    if (mine) return;
    if (choice === "accepted" || choice === "declined") return;
    if (choice === "unavailable") return; // cannot record a choice; do not pretend to offer one
    // Wait for the design to mount before adding ours, so a view that carries
    // its own notice is never briefly given a second one.
    if (!host.firstElementChild) return;
    document.body.appendChild(consentNotice());
  }

  // Measurement. Every id comes from analytics.config.json, which records what
  // the LIVE site already runs; nothing is invented. Two independent locks:
  // the build must set AHV_ANALYTICS=1, AND the visitor must have accepted.
  // Owner 1 October authorises staging behind a separate explicit build switch.
  // Staging events carry environment markers; staging leads never fire live Ads goals.
  var measurementStarted = !!window.__ahvMeasurementStarted;
  function attributionValueSafe(name, value) {
    return name.indexOf("utm_") === 0 ? /^[a-zA-Z0-9_.~ -]{1,120}$/.test(value) : /^[a-zA-Z0-9_.~-]{1,120}$/.test(value);
  }
  function measurementUrlSafe() {
    // Meta and Clarity can inspect document.location themselves. Only start
    // them when every URL parameter is a bounded attribution value.
    var allowed = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "fbclid"];
    var safe = !window.location.hash || /^#(?:enquiry|main|contact|section-[0-8]|written-testimonials|press)$/.test(window.location.hash);
    new URLSearchParams(window.location.search).forEach(function (value, name) {
      if (allowed.indexOf(name) === -1 || !attributionValueSafe(name, value)) safe = false;
    });
    return safe;
  }
  function safePageLocation() {
    // Keep paid attribution parameters, but never send arbitrary URL parameters
    // or fragments (which can contain names, email addresses or form drafts).
    var allowed = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "fbclid"];
    var query = new URLSearchParams();
    var incoming = new URLSearchParams(window.location.search);
    allowed.forEach(function (name) {
      var value = incoming.get(name);
      if (value && attributionValueSafe(name, value)) query.set(name, value);
    });
    return window.location.origin + window.location.pathname + (query.size ? "?" + query.toString() : "");
  }
  function safeReferrer() {
    // Retain the referring site for acquisition reports without forwarding
    // its query string or path, either of which may carry private values.
    try {
      var referrer = new URL(document.referrer);
      return /^https?:$/.test(referrer.protocol) ? referrer.origin + "/" : "";
    } catch (e) { return ""; }
  }
  function recordAcceptedLead(form, token) {
    // Careers are applications, not the Ads EnquirySubmission conversion.
    if (["contact", "enquiry-form", "online-consultation", "opd", "landing-page"].indexOf(form) === -1) return false;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(token || ""))) return false;
    if (consentChoice() !== "accepted" || !measurementStarted || !cfg.measurement || !measurementUrlSafe()) return false;
    var key = "ktahv-accepted-lead-events-v1";
    var seen = window.__ahvLeadEventTokens || (window.__ahvLeadEventTokens = []);
    try { seen = JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) {}
    if (!Array.isArray(seen)) seen = [];
    if (seen.indexOf(token) !== -1) return false;
    var sent = false;
    var m = cfg.measurement;
    if (m.ga4 && typeof window.gtag === "function") {
      window.gtag("event", m.environment === "staging" ? "ahv_staging_lead" : "generate_lead", { event_id: token, page_location: safePageLocation(), ahv_environment: m.environment || "production", debug_mode: m.environment === "staging" });
      if (m.adsSendTo && m.environment !== "staging") window.gtag("event", "conversion", { send_to: m.adsSendTo, transaction_id: token, page_location: safePageLocation() });
      sent = true;
    }
    if (m.metaPixel && typeof window.fbq === "function") {
      window.fbq(m.environment === "staging" ? "trackCustom" : "track", m.environment === "staging" ? "AHVStagingLead" : "Lead", { ahv_environment: m.environment || "production" }, { eventID: token });
      sent = true;
    }
    if (m.clarity && typeof window.clarity === "function") {
      window.clarity("event", m.environment === "staging" ? "ahv_staging_lead" : "lead_received");
      sent = true;
    }
    if (sent) {
      seen.push(token);
      window.__ahvLeadEventTokens = seen.slice(-50);
      try { localStorage.setItem(key, JSON.stringify(window.__ahvLeadEventTokens)); } catch (e) {}
    }
    return sent;
  }
  function attribution() {
    var allowed = ["gclid", "gbraid", "wbraid", "fbclid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    var current = {}, incoming = new URLSearchParams(window.location.search);
    allowed.forEach(function (name) {
      var value = incoming.get(name);
      if (value && attributionValueSafe(name, value)) current[name] = value;
    });
    // Retain the paid visit across programme navigation only after consent,
    // for this tab/session and for at most 30 minutes. Never persist private URLs.
    if (consentChoice() !== "accepted") return current;
    try {
      var key = "ahv-paid-attribution-v1", previous = JSON.parse(sessionStorage.getItem(key) || "null");
      if (Object.keys(current).length) sessionStorage.setItem(key, JSON.stringify({at:Date.now(),values:current}));
      else if (previous && Date.now()-previous.at >= 0 && Date.now()-previous.at < 1800000) {
        allowed.forEach(function (name) {var value=previous.values && previous.values[name];if(typeof value === "string" && attributionValueSafe(name,value)) current[name]=value;});
      } else sessionStorage.removeItem(key);
    } catch(e) {}
    return current;
  }
  function recordInteraction(name, target) {
    var targets = { enquiry_open:["enquiry"], contact_click:["phone","whatsapp","directions","email"], tariff_download:["tariff"], programme_open:["programme"], video_open:["video"], form_start:["enquiry"], exit_help:["shown","dismissed","enquire","whatsapp"] };
    if (!targets[name] || targets[name].indexOf(target) === -1 || window.location.pathname !== "/ayurvedic-treatment-packages.html") return false;
    if(consentChoice() !== "accepted" || !measurementStarted || !cfg.measurement || !measurementUrlSafe()) return false;
    var m=cfg.measurement;
    if(!m.ga4 || typeof window.gtag !== "function") return false;
    // Interaction diagnostics are never Ads or Meta lead conversions.
    window.gtag("event", m.environment === "staging" ? "ahv_staging_"+name : name, { interaction_target:target, page_location:safePageLocation(), ahv_environment:m.environment || "production", debug_mode:m.environment === "staging" });
    return true;
  }
  window.AHV_MEASUREMENT = { recordLead: recordAcceptedLead, recordInteraction:recordInteraction, attribution:attribution };
  function startMeasurement() {
    if (measurementStarted) return;
    if (!measurementUrlSafe()) return;
    var m = cfg.measurement;
    if (!m) return; // build-time switch is off: nothing to start
    attribution();
    measurementStarted = true;
    window.__ahvMeasurementStarted = true;
    if (m.ga4) {
      var g = document.createElement("script");
      g.async = true;
      g.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(m.ga4);
      document.head.appendChild(g);
      window.dataLayer = window.dataLayer || [];
      // Do NOT clobber: <ConsentScripts/> installed this shim in <head> and the
      // consent defaults were pushed through it. Replacing it here would be
      // harmless today (same one-line push) and a trap the day it is not.
      if (typeof window.gtag !== "function") {
        window.gtag = function () { window.dataLayer.push(arguments); };
      }
      window.gtag("js", new Date());
      window.gtag("config", m.ga4, { page_location: safePageLocation(), page_referrer: safeReferrer(), ahv_environment: m.environment || "production", debug_mode: m.environment === "staging" });
      if (m.adsSendTo) window.gtag("config", m.adsSendTo.split("/")[0], { send_page_view: false });
    }
    if (m.clarity) {
      window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
      window.clarity("consentv2", { analytics_Storage: "granted", ad_Storage: "granted" });
      window.clarity("set", "ahv_environment", m.environment || "production");
      var c = document.createElement("script");
      c.async = true;
      c.src = "https://www.clarity.ms/tag/" + encodeURIComponent(m.clarity);
      document.head.appendChild(c);
    }
    if (m.metaPixel) {
      // Standard Meta bootstrap: dispatch through callMethod after the SDK loads.
      if (!window.fbq) {
        var fb = window.fbq = function () {
          if (fb.callMethod) fb.callMethod.apply(fb, arguments);
          else fb.queue.push(arguments);
        };
        window._fbq = window._fbq || fb;
        fb.push = fb; fb.loaded = true; fb.version = "2.0"; fb.queue = [];
      }
      window.fbq("consent", "grant");
      window.fbq("set", "autoConfig", false, m.metaPixel);
      window.fbq("init", m.metaPixel);
      window.fbq("track", "PageView", { ahv_environment: m.environment || "production" });
      var f = document.createElement("script");
      f.async = true;
      f.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(f);
    }
  }
`;
