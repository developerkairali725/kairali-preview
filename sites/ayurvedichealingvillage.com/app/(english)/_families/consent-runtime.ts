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
      try {
        localStorage.removeItem(CONSENT_KEY);
        localStorage.removeItem(FLEET_CONSENT_KEY);
      } catch (e) {}
      applyConsentMode("declined");
      window.location.reload();
    });
  }
  function consentChoice() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return "unavailable"; }
  }
  function recordConsent(value) {
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
    wrap.setAttribute("aria-label", "Cookie notice");
    // Sits above the design's fixed bottom action bar on narrow screens, which
    // is why the approved home notice uses bottom:74px there.
    wrap.style.cssText = "position:fixed;left:12px;right:12px;bottom:" + (narrow ? "74px" : "24px") +
      ";z-index:60;max-width:" + (narrow ? "406px" : "880px") + ";margin:0 auto;background:#fff;" + /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
      "border:1px solid #E9E2D3;border-radius:4px;box-shadow:0 7px 25px rgba(60,45,20,.08);padding:18px 20px;" + /* approved home-banner palette, unchanged. brand-allow: rogue-hex */
      "box-sizing:border-box;display:flex;gap:20px;align-items:center;flex-direction:" + (narrow ? "column" : "row") + ";"; /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
    var copy = document.createElement("div");
    copy.style.cssText = "flex:1;min-width:0;font-size:14.5px;color:#514a3f;line-height:1.55"; /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
    copy.appendChild(document.createTextNode("We use cookies to improve your experience and analyse site traffic. See our "));
    var policy = document.createElement("a");
    policy.setAttribute("href", "/privacy-policy/");
    policy.style.cssText = "font-weight:700";
    policy.textContent = "Privacy Policy";
    copy.appendChild(policy);
    copy.appendChild(document.createTextNode("."));
    var row = document.createElement("div");
    row.style.cssText = "display:flex;gap:12px;align-items:center;flex-shrink:0;" + (narrow ? "width:100%" : "min-width:250px");
    var decline = document.createElement("button");
    decline.type = "button";
    decline.textContent = "Decline";
    decline.style.cssText = "flex:1;background:none;border:1px solid #C9BFA8;border-radius:4px;" + /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
      "font-family:'Mulish',sans-serif;font-weight:700;font-size:12.5px;letter-spacing:1.5px;color:#75695A;" + /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
      "cursor:pointer;text-transform:uppercase;padding:14px 6px;min-height:44px";
    decline.addEventListener("click", function () { recordConsent("declined"); });
    var accept = document.createElement("button");
    accept.type = "button";
    accept.textContent = "Accept All";
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
      if (/^accept all$/i.test((b.textContent || "").trim())) found = b;
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
    // be a one-shot check: it has to keep looking and withdraw ours the moment
    // theirs appears, or the homepage shows two banners. That exact double-up
    // is why this lane has its own root layout in the first place.
    if (designNotice()) {
      if (mine) mine.remove();
      return;
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
  // Both are off on staging by the owner's 15 Sep ruling, so a preview reviewer
  // never lands in the production GA4 and Clarity data.
  var measurementStarted = false;
  function startMeasurement() {
    if (measurementStarted) return;
    if (window.location.search || window.location.hash) return;
    var m = cfg.measurement;
    if (!m) return; // build-time switch is off: nothing to start
    measurementStarted = true;
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
      window.gtag("config", m.ga4);
    }
    if (m.clarity) {
      window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
      var c = document.createElement("script");
      c.async = true;
      c.src = "https://www.clarity.ms/tag/" + encodeURIComponent(m.clarity);
      document.head.appendChild(c);
    }
    if (m.metaPixel) {
      var f = document.createElement("script");
      f.async = true;
      f.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(f);
      window.fbq = window.fbq || function () {
        (window.fbq.queue = window.fbq.queue || []).push(arguments);
      };
      window.fbq("init", m.metaPixel);
      window.fbq("track", "PageView");
    }
  }
`;
