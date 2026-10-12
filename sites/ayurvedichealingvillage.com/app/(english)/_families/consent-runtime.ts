/** AHV-only bridge to the pinned, local CookieConsent UI. Optional SDKs are
 * blocked until its validated, current-revision preference callback runs. */
export const CONSENT_RUNTIME = `
  var consentPreferences = null;
  var consentApplied = null;
  function consentChoice() {
    if (!consentPreferences) return null;
    return consentPreferences.analytics || consentPreferences.advertising ? "accepted" : "declined";
  }
  function consentState(preferences) {
    var analytics = !!(preferences && preferences.analytics);
    var ads = !!(preferences && preferences.advertising);
    return { analytics_storage: analytics ? "granted" : "denied",
      ad_storage: ads ? "granted" : "denied", ad_user_data: ads ? "granted" : "denied",
      ad_personalization: ads ? "granted" : "denied", functionality_storage: "denied",
      personalization_storage: "denied", security_storage: "granted" };
  }
  function applyConsentMode() {
    var state = consentState(consentPreferences);
    var signature = JSON.stringify(state);
    if (signature === consentApplied) return;
    consentApplied = signature;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "update", state);
    if (typeof window.clarity === "function") window.clarity("consentv2", { analytics_Storage: state.analytics_storage, ad_Storage: state.ad_storage });
    if (typeof window.fbq === "function") window.fbq("consent", state.ad_storage === "granted" ? "grant" : "revoke");
  }
  window.AHV_SET_CONSENT = function (preferences) {
    var previous = consentPreferences;
    consentPreferences = {analytics: preferences.analytics === true, advertising: preferences.advertising === true};
    applyConsentMode();
    var changed = previous && JSON.stringify(previous) !== JSON.stringify(consentPreferences);
    if (changed && measurementStarted) {
      // Revoke first, then unload already-running SDKs. Removing script tags
      // alone cannot stop their timers or listeners. No new measurement here.
      try { sessionStorage.removeItem("ahv-paid-attribution-v1"); } catch(e) {}
      window.location.reload();
      return;
    }
    if (consentChoice() === "accepted") startMeasurement();
  };
  function ensureConsentNotice() {
    // Retire embedded historical homepage notices, never the maintained UI.
    document.querySelectorAll("[data-ahv-cta-notice]").forEach(function(el){el.remove();});
    document.querySelectorAll("button").forEach(function(button){
      if (button.closest("#cc-main")) return;
      var label=(button.textContent || "").trim();
      var translated=window.__AHV_T && window.__AHV_T["Accept all"];
      if (!/^accept all$/i.test(label) && label !== translated) return;
      var captured=button.parentElement;
      while(captured && captured!==host && captured.style.position!=="fixed") captured=captured.parentElement;
      if(captured && captured!==host) captured.remove();
    });
    if (window.__ahvConsentLoading) return;
    window.__ahvConsentLoading = true;
    var css = document.createElement("link");
    css.rel = "stylesheet"; css.href = "/consent/vendor/cookieconsent.css";
    document.head.appendChild(css);
    var theme=document.createElement("link");theme.rel="stylesheet";theme.href="/consent/ahv.css";document.head.appendChild(theme);
    var script = document.createElement("script");
    script.type = "module"; script.src = "/consent/bridge.mjs";
    script.onerror = function () {
      // Asset failure leaves all optional tags blocked and exposes a retry.
      var button = document.createElement("button");
      button.textContent = "Cookie choices unavailable. Retry";
      button.type = "button"; button.onclick = function(){window.location.reload();};
      document.body.appendChild(button);
    };
    document.head.appendChild(script);
  }

  // Measurement. Every id comes from analytics.config.json, which records what
  // the live site and authenticated AHV account verify; nothing is invented.
  // Two independent locks:
  // the build must set AHV_ANALYTICS=1, AND the visitor must have accepted.
  // Owner 1 October authorises staging behind a separate explicit build switch.
  // Staging events carry environment markers; staging leads never fire live Ads goals.
  var measurementStarted = !!window.__ahvMeasurementStarted;
  function attributionValueSafe(name, value) {
    // An encoded ampersand is part of the existing Brand & Competition name.
    return name.indexOf("utm_") === 0 ? /^[a-zA-Z0-9_.~ &-]{1,120}$/.test(value) : /^[a-zA-Z0-9_.~-]{1,120}$/.test(value);
  }
  function firstAttributionValue(incoming, name) {
    // Existing Ads URLs repeat UTM keys, sometimes with an empty placeholder.
    // Preserve the first nonempty valid value, consistently in events and forms.
    var values = incoming.getAll(name);
    for (var i = 0; i < values.length; i++) {
      if (values[i] && attributionValueSafe(name, values[i])) return values[i];
    }
    return "";
  }
  function measurementUrlSafe() {
    return urlSafe(window.location.search, window.location.hash) && referrerSafe();
  }
  function urlSafe(search, hash) {
    // Meta and Clarity can inspect document.location themselves. Only start
    // them when every URL parameter is a bounded attribution value.
    var allowed = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "fbclid"];
    var safe = !hash || /^#(?:enquiry|main|contact|section-[0-8]|written-testimonials|press)$/.test(hash);
    new URLSearchParams(search).forEach(function (value, name) {
      // Google appends these numeric click metadata fields. They may remain in
      // the landing URL but are not copied into our attribution/session payload.
      if (name === "gad_source" || name === "gad_campaignid") {
        if (!/^[0-9]{1,20}$/.test(value)) safe = false;
        return;
      }
      if (allowed.indexOf(name) !== -1 && name.indexOf("utm_") === 0 && value === "") return;
      if (allowed.indexOf(name) === -1 || !attributionValueSafe(name, value)) safe = false;
    });
    return safe;
  }
  function referrerSafe() {
    // Meta and Clarity also read document.referrer. Our own pages are held to
    // the same rule (site search puts typed text in ?q=; a page left before its
    // ad metadata was removed still carries it); other sites' referrers reach
    // GA4 as an origin only and are otherwise as the browser sent them.
    try {
      var referrer = new URL(document.referrer);
      return referrer.origin !== window.location.origin || urlSafe(referrer.search, referrer.hash);
    } catch (e) { return true; }
  }
  // Google Ads campaign templates add these keys to AHV-NEO click URLs (seen in
  // the expanded landing-page report, 8 Sep-7 Oct 2026). Nothing on the site
  // reads them, so they are removed from the address rather than reported. Each
  // value must fit its documented ValueTrack form; anything else keeps
  // measurement off. Keys not listed here (targetid included) stay unknown.
  var AD_METADATA = {
    campaignid: /^[0-9]{0,20}$/, adgroupid: /^[0-9]{0,20}$/, creative: /^[0-9]{0,20}$/, device: /^[mtc]?$/,
    placement: /^[a-zA-Z0-9_.~-]{0,120}$/, keyword: /^[a-zA-Z0-9_.~ &-]{0,120}$/,
    utm_adgroup: /^[a-zA-Z0-9_.~ &-]{0,120}$/, utm_device: /^[a-zA-Z0-9_.~ &-]{0,120}$/
  };
  function withoutAdMetadata(search, hash) {
    // The query without ad metadata and unexpanded {placeholder} UTM values,
    // keeping every other pair byte-for-byte; null when nothing would be removed
    // or the remainder would still fail urlSafe().
    var kept = [], removed = false, parts = (search.charAt(0) === "?" ? search.slice(1) : search).split("&");
    for (var i = 0; i < parts.length; i++) {
      if (!parts[i]) continue;
      var name = null, value = "";
      // URLSearchParams drops a leading "?" only from the whole query; the "&"
      // keeps a pair like "?campaignid=1" the unknown key it is there.
      new URLSearchParams("&" + parts[i]).forEach(function (v, k) { if (name === null) { name = k; value = v; } });
      var placeholder = /^[{]_?[A-Za-z][A-Za-z0-9_]{0,39}[}]$/.test(value);
      if (Object.prototype.hasOwnProperty.call(AD_METADATA, name)) {
        if (!placeholder && !AD_METADATA[name].test(value)) return null;
        removed = true;
      } else if (placeholder && /^utm_(?:source|medium|campaign|term|content)$/.test(name)) removed = true;
      else kept.push(parts[i]);
    }
    var cleaned = kept.length ? "?" + kept.join("&") : "";
    return removed && urlSafe(cleaned, hash) ? cleaned : null;
  }
  function removeAdMetadata(tries) {
    if (!cfg.measurement) return;
    var search = withoutAdMetadata(window.location.search, window.location.hash);
    if (search === null) return;
    // Before hydration Next.js would write the original address back. It adopts
    // outside history changes once its own history handlers replace the native ones.
    if (window.next && Function.prototype.toString.call(window.history.replaceState).indexOf("[native code]") !== -1) {
      if (tries > 0) setTimeout(function () { removeAdMetadata(tries - 1); }, 100);
      return;
    }
    try { window.history.replaceState(null, "", window.location.pathname + search + window.location.hash); } catch (e) { return; }
    if (consentChoice() === "accepted") startMeasurement();
  }
  function safePageLocation() {
    // Keep paid attribution parameters, but never send arbitrary URL parameters
    // or fragments (which can contain names, email addresses or form drafts).
    var allowed = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "fbclid"];
    var query = new URLSearchParams();
    var incoming = new URLSearchParams(window.location.search);
    allowed.forEach(function (name) {
      var value = firstAttributionValue(incoming, name);
      if (value) query.set(name, value);
    });
    return window.location.origin + window.location.pathname + (query.toString() ? "?" + query.toString() : "");
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
    if (consentPreferences.analytics && m.ga4 && typeof window.gtag === "function") {
      window.gtag("event", m.environment === "staging" ? "ahv_staging_lead" : "generate_lead", { user_data: null, event_id: token, page_location: safePageLocation(), ahv_environment: m.environment || "production", debug_mode: m.environment === "staging" });
      sent = true;
    }
    if (consentPreferences.advertising && m.adsTagId && m.adsSendTo && m.environment !== "staging" && typeof window.gtag === "function") {
      window.gtag("event", "conversion", { user_data: null, send_to: m.adsSendTo, transaction_id: token, page_location: safePageLocation() });
      sent = true;
    }
    if (consentPreferences.advertising && m.metaPixel && typeof window.fbq === "function") {
      window.fbq(m.environment === "staging" ? "trackCustom" : "track", m.environment === "staging" ? "AHVStagingLead" : "Lead", { ahv_environment: m.environment || "production" }, { eventID: token });
      sent = true;
    }
    if (consentPreferences.analytics && m.clarity && typeof window.clarity === "function") {
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
      var value = firstAttributionValue(incoming, name);
      if (value) current[name] = value;
    });
    // Retain the paid visit across programme navigation only after consent,
    // for this tab/session and for at most 30 minutes. Never persist private URLs.
    if (!consentPreferences || !consentPreferences.advertising) return current;
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
    if(!consentPreferences.analytics || !m.ga4 || typeof window.gtag !== "function") return false;
    // Interaction diagnostics are never Ads or Meta lead conversions.
    window.gtag("event", m.environment === "staging" ? "ahv_staging_"+name : name, { user_data: null, interaction_target:target, page_location:safePageLocation(), ahv_environment:m.environment || "production", debug_mode:m.environment === "staging" });
    return true;
  }
  window.AHV_MEASUREMENT = { recordLead: recordAcceptedLead, recordInteraction:recordInteraction, attribution:attribution };
  function startMeasurement() {
    if (measurementStarted || consentChoice() !== "accepted") return;
    if (!measurementUrlSafe()) return;
    var m = cfg.measurement;
    if (!m) return; // build-time switch is off: nothing to start
    attribution();
    measurementStarted = true;
    window.__ahvMeasurementStarted = true;
    if ((consentPreferences.analytics && m.ga4) || (consentPreferences.advertising && m.adsTagId)) {
      window.dataLayer = window.dataLayer || [];
      // Do NOT clobber: <ConsentScripts/> installed this shim in <head> and the
      // consent defaults were pushed through it. Replacing it here would be
      // harmless today (same one-line push) and a trap the day it is not.
      if (typeof window.gtag !== "function") {
        window.gtag = function () { window.dataLayer.push(arguments); };
      }
      // Explicitly opt out of automatic customer-data collection, including
      // remotely enabled enhanced conversions. Cookie consent permits counts,
      // not reading enquiry fields. Queue this before loading Google's SDK.
      // https://support.google.com/google-ads/answer/13438771
      window.gtag("set", { user_data: null });
      window.gtag("js", new Date());
      if (consentPreferences.analytics && m.ga4) window.gtag("config", m.ga4, { user_data: null, page_location: safePageLocation(), page_referrer: safeReferrer(), ahv_environment: m.environment || "production", debug_mode: m.environment === "staging" });
      // Bootstrap the verified AHV tag; the conversion destination's AW alias
      // currently belongs to a different tag. Never derive a loader from sendTo.
      if (consentPreferences.advertising && m.adsTagId) window.gtag("config", m.adsTagId, { user_data: null, send_page_view: false });
      var g = document.createElement("script");
      g.async = true;
      g.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(consentPreferences.analytics && m.ga4 ? m.ga4 : m.adsTagId);
      document.head.appendChild(g);
    }
    if (consentPreferences.analytics && m.clarity) {
      window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
      window.clarity("consentv2", { analytics_Storage: "granted", ad_Storage: consentPreferences.advertising ? "granted" : "denied" });
      window.clarity("set", "ahv_environment", m.environment || "production");
      var c = document.createElement("script");
      c.async = true;
      c.src = "https://www.clarity.ms/tag/" + encodeURIComponent(m.clarity);
      document.head.appendChild(c);
    }
    if (consentPreferences.advertising && m.metaPixel) {
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
  // Up to 10 s for hydration; after that the address stays and measurement stays off.
  removeAdMetadata(100);
`;
