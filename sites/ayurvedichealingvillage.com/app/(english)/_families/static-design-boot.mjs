import { removeHomeVillaRates } from './home-villa-rates.mjs';
import { initializeHomeHero } from './home-hero.mjs';
import { createBackgroundDeferral } from './media-loading.mjs';
import { CONSENT_RUNTIME } from './consent-runtime.ts';

export const STATIC_BOOT = `
(async function () {
  if (window.__ahvStaticDesignBooted) return;
  window.__ahvStaticDesignBooted = true;
  var host = document.getElementById("ahv-design-root");
  if (!host) return;
  function initializeNearViewport(target, initialize) {
    if (!target || !("IntersectionObserver" in window)) { initialize(); return; }
    var observer = new IntersectionObserver(function (entries) {
      if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
      observer.disconnect();
      initialize();
    }, { rootMargin: "500px 0px" });
    observer.observe(target);
  }
  var cfg = JSON.parse(document.getElementById("ahv-static-design-config").textContent || "{}");
  if (cfg.deferFonts) {
    var revealFonts = function () {
      setTimeout(function () {
        document.querySelectorAll("[data-ahv-deferred-font]").forEach(function (node) {
          node.media = node.getAttribute("data-ahv-font-media") || "all";
        });
      }, 700);
    };
    if (document.readyState === "complete") revealFonts();
    else window.addEventListener("load", revealFonts, { once: true });
  }
  if (window.matchMedia("(min-width:" + cfg.breakpoint + "px)").matches) {
    try {
      var response = await fetch(cfg.staticDesktopPath, { credentials: "same-origin" });
      if (!response.ok) throw new Error("desktop view " + response.status);
      host.innerHTML = (${removeHomeVillaRates.toString()})(await response.text(), cfg.staticHome ? "/" : "");
      host.setAttribute("data-ahv-variant", "desktop");
    } catch (error) {
      host.setAttribute("data-ahv-variant", "mobile-fallback");
    }
  }
  if (cfg.staticHome) {
    host.querySelectorAll('footer a[href]').forEach(function (link) {
      if (link.textContent.trim() === "Reviews") link.setAttribute("href", "/read-feedback/");
    });
    host.querySelectorAll('.ahv-lang-btn').forEach(function (button) {
      var label = button.getAttribute("aria-label") || "";
      if (label && !label.startsWith("EN — ")) button.setAttribute("aria-label", "EN — " + label);
    });
  }
  host.querySelectorAll('a[aria-label]').forEach(function (link) {
    var label = link.getAttribute("aria-label");
    (cfg.contentReviewCopy || []).forEach(function (edit) {
      if (edit.kind === "link" && label.indexOf(edit.old) !== -1) label = label.replace(edit.old, edit.new);
    });
    if (link.hasAttribute("data-recorded-embed") && link.textContent.trim()) label = link.textContent.replace(/\\s+/g, " ").trim();
    if (label !== link.getAttribute("aria-label")) link.setAttribute("aria-label", label);
  });
  if (cfg.staticHome) {
    var stickyHeader = host.querySelector('header[style*="translateY"]');
    if (stickyHeader && window.matchMedia("(min-width:" + cfg.breakpoint + "px)").matches) {
      // Keep the header revealed while a keyboard-focused descendant holds focus, so its focus ring is visible at the top of the page.
      var stickyHeaderKeyboardFocus = false;
      function updateStickyHeader() {
        stickyHeader.style.transform = window.scrollY > 520 || stickyHeaderKeyboardFocus ? "translateY(0)" : "translateY(-110%)";
      }
      stickyHeader.addEventListener("focusin", function (event) {
        var focusVisible = true;
        try { focusVisible = event.target.matches(":focus-visible"); } catch (error) {}
        stickyHeaderKeyboardFocus = focusVisible;
        updateStickyHeader();
      });
      stickyHeader.addEventListener("focusout", function (event) {
        if (event.relatedTarget && stickyHeader.contains(event.relatedTarget)) return;
        stickyHeaderKeyboardFocus = false;
        updateStickyHeader();
      });
      window.addEventListener("scroll", updateStickyHeader, { passive: true });
      updateStickyHeader();
    }
  }
  host.setAttribute("data-ahv-snapshot-state", "retired");
  host.removeAttribute("data-ahv-static-pending");
  // Measure each section boundary, not its skipped background descendants.
  // Probing descendants defeats the homepage's content-visibility containment.
  function deferStaticHomeBackgrounds() {
    var groups = new Map();
    host.querySelectorAll("[style*='url(']").forEach(function (element) {
      if (element.hasAttribute("data-ahv-bg")) return;
      var section = element.closest('.sc-host > div[data-dc-tpl="31"] > section[data-dc-tpl]') || element.closest("section") || element;
      if (!groups.has(section)) groups.set(section, []);
      groups.get(section).push(element);
    });
    if (!groups.size) return;
    var pending = new Set(groups.keys());
    var observer = null;
    function reveal(section) {
      if (!pending.has(section)) return;
      groups.get(section).forEach(function (element) { element.setAttribute("data-ahv-bg", ""); });
      pending.delete(section);
      if (observer) {
        observer.unobserve(section);
        if (!pending.size) observer.disconnect();
      }
    }
    if (!("IntersectionObserver" in window)) { groups.forEach(function (_, section) { reveal(section); }); return; }
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) reveal(entry.target); });
    }, { rootMargin: "800px 0px" });
    var sections = Array.from(groups.keys());
    // Read all boundary boxes before revealing any background.
    var near = sections.map(function (section) {
      var rect = section.getBoundingClientRect();
      return (rect.width || rect.height) && rect.bottom > -800 && rect.top < window.innerHeight + 800;
    });
    sections.forEach(function (section, index) { if (near[index]) reveal(section); else observer.observe(section); });
  }
  if (cfg.staticHome) deferStaticHomeBackgrounds();
  else (${createBackgroundDeferral.toString()})(window, 800)(host);
  ${CONSENT_RUNTIME}
  ensureConsentNotice();
  if (consentChoice() === "accepted") startMeasurement();
  var menuButton = host.querySelector('button[aria-label="Menu"]');
  var drawer = host.querySelector('[data-ahv-drawer]');
  function closeMenu() {
    if (!menuButton || !drawer) return;
    menuButton.setAttribute("aria-expanded", "false");
    drawer.style.display = "none";
  }
  if (menuButton && drawer) {
    menuButton.addEventListener("click", function () {
      var opening = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(opening));
      drawer.style.display = opening ? "flex" : "none";
      if (opening) drawer.querySelector('button[aria-label="Close menu"]').focus();
    });
    drawer.querySelector('button[aria-label="Close menu"]').addEventListener("click", function () {
      closeMenu(); menuButton.focus();
    });
    drawer.addEventListener("click", function (event) {
      if (event.target.closest("a[href]")) closeMenu();
    });
  }
  function closeLanguages() {
    host.querySelectorAll(".ahv-lang-btn[aria-expanded=true]").forEach(function (button) {
      button.setAttribute("aria-expanded", "false");
      var list = document.getElementById(button.getAttribute("aria-controls"));
      if (list) list.hidden = true;
    });
  }
  host.addEventListener("click", function (event) {
    var link = event.target && event.target.closest && event.target.closest("a[data-ahv-lang-option]");
    if (!link || !host.contains(link)) return;
    var code = link.getAttribute("data-ahv-lang-option");
    var options = cfg.locale && cfg.locale.options;
    if (!Array.isArray(options) || !options.some(function (option) {
      return option.code === code && option.href === link.getAttribute("href");
    })) return;
    try { localStorage.setItem("ahv-locale", code); } catch (_) { /* storage blocked: the link still works */ }
  });
  document.addEventListener("click", function (event) {
    var button = event.target && event.target.closest && event.target.closest(".ahv-lang-btn");
    if (!button || !host.contains(button)) {
      if (!event.target.closest || !event.target.closest(".ahv-lang-list")) closeLanguages();
      return;
    }
    var list = document.getElementById(button.getAttribute("aria-controls"));
    if (!list) return;
    var open = button.getAttribute("aria-expanded") !== "true";
    closeLanguages();
    button.setAttribute("aria-expanded", String(open));
    list.hidden = !open;
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeLanguages();
  });
  if (cfg.staticTariffs) {
    var tariffSection = host.querySelector("#package");
    var group = tariffSection && tariffSection.querySelector('[role="group"][aria-label="Currency"]');
    var buttons = group ? Array.from(group.querySelectorAll("button")) : [];
    var currentCurrency = "INR";
    function chooseCurrency(nextCurrency) {
      if (!tariffSection || !cfg.staticTariffs[nextCurrency] || nextCurrency === currentCurrency) return;
      var previous = cfg.staticTariffs[currentCurrency];
      var next = cfg.staticTariffs[nextCurrency];
      var prices = {};
      for (var row = 0; row < previous.length; row++) {
        prices[previous[row][1]] = next[row][1];
        prices[previous[row][2]] = next[row][2];
      }
      var walker = document.createTreeWalker(tariffSection, NodeFilter.SHOW_TEXT);
      var node;
      while ((node = walker.nextNode())) {
        var value = (node.nodeValue || "").trim();
        if (prices[value]) node.nodeValue = node.nodeValue.replace(value, prices[value]);
      }
      currentCurrency = nextCurrency;
      buttons.forEach(function (button, index) {
        var active = ["INR", "USD", "EURO"][index] === nextCurrency;
        button.setAttribute("aria-pressed", String(active));
        button.style.background = active ? "var(--bronze-600)" : "var(--ivory)";
        button.style.color = active ? "var(--ivory)" : "var(--ink)";
        button.style.borderColor = active ? "var(--bronze-600)" : "var(--ink-line)";
      });
    }
    buttons.forEach(function (button, index) {
      button.addEventListener("click", function () { chooseCurrency(["INR", "USD", "EURO"][index]); });
    });
  }
  if (cfg.staticHome) {
    var homeSection = host.querySelector('section[data-dc-tpl="213"]');
    var homeNews = cfg.staticHome.news || [];
    if (homeSection && homeNews.length) initializeNearViewport(homeSection, function () {
      var nextNewsButton = homeSection.querySelector('[aria-label="Next announcement"]');
      var newsCard = nextNewsButton && nextNewsButton.closest("div[data-dc-tpl]");
      while (newsCard && !newsCard.querySelector("h3")) newsCard = newsCard.parentElement;
      var newsIndex = 0;
      var showNews = function (index) {
        newsIndex = (index + homeNews.length) % homeNews.length;
        var item = homeNews[newsIndex];
        var heading = newsCard && newsCard.querySelector("h3");
        var paragraphs = newsCard ? Array.from(newsCard.querySelectorAll("p")) : [];
        var body = paragraphs.find(function (p) { return (p.textContent || "").length > 80; });
        var link = newsCard && Array.from(newsCard.querySelectorAll("a")).find(function (a) { return /Know More|See More/.test(a.textContent.trim()); });
        var counter = paragraphs.find(function (p) { return (p.textContent || "").indexOf("/") >= 0; });
        if (heading) heading.textContent = item.title;
        if (body) body.textContent = item.body;
        if (link) { link.textContent = item.cta; link.href = item.href; }
        if (counter) counter.textContent = (newsIndex + 1) + " / " + homeNews.length;
        var imageFrame = newsCard && newsCard.parentElement;
        if (imageFrame) imageFrame.querySelectorAll("[style*='background-image']").forEach(function (node) {
          if ((node.style.backgroundImage || "").indexOf("ann-") >= 0) node.style.backgroundImage = "url('" + item.img + "')";
        });
      };
      homeSection.querySelector('[aria-label="Previous announcement"]')?.addEventListener("click", function () { showNews(newsIndex - 1); });
      homeSection.querySelector('[aria-label="Next announcement"]')?.addEventListener("click", function () { showNews(newsIndex + 1); });
      if (!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
        window.setInterval(function () { showNews(newsIndex + 1); }, 7000);
      }
    });
    var programmeLabels = ["Detox & Rejuvenation", "Pain, Spine & Joints", "Lifestyle & Chronic Conditions", "Women's Health", "Yoga & Mind"];
    var programmeSection = host.querySelector('section[data-dc-tpl="195"]');
    if (programmeSection) initializeNearViewport(programmeSection, function () {
      var programmeButtons = Array.from(programmeSection.querySelectorAll("button")).filter(function (button) { return programmeLabels.indexOf(button.textContent.trim()) >= 0; });
      var programmeCategoryGroups = Array.from(programmeSection.querySelectorAll('div[data-dc-tpl="202"]')).filter(function (group) {
        return group.querySelectorAll('div[data-dc-tpl="204"]').length > 0;
      });
      var programmeGroups = programmeCategoryGroups.length === 5 ? [] : Array.from(programmeSection.querySelectorAll("div")).filter(function (div) {
        return div.querySelectorAll("a[href]").length >= 2 && div.children.length > 0 && Array.from(div.children).every(function (child) { return child.tagName === "A"; });
      });
      if (programmeGroups.length > 5) programmeGroups = programmeGroups.slice(-5);
      var programmeCards = programmeGroups.length === 5 || programmeCategoryGroups.length === 5 ? [] : Array.from(programmeSection.querySelectorAll('div[data-dc-tpl="204"]'));
      var programmeCounts = cfg.staticHome.programmeCounts || [];
      programmeButtons.forEach(function (button, index) {
        button.addEventListener("click", function () {
          if (programmeGroups.length === 5) {
            programmeGroups.forEach(function (group, groupIndex) { group.style.display = groupIndex === index ? "flex" : "none"; });
          } else if (programmeCategoryGroups.length === 5) {
            programmeCategoryGroups.forEach(function (group, groupIndex) { group.style.display = groupIndex === index ? "grid" : "none"; });
          } else {
            var start = programmeCounts.slice(0, index).reduce(function (sum, count) { return sum + count; }, 0);
            var end = start + (programmeCounts[index] || 0);
            programmeCards.forEach(function (card, cardIndex) { card.style.display = cardIndex >= start && cardIndex < end ? "flex" : "none"; });
          }
          programmeButtons.forEach(function (other, otherIndex) {
            var active = otherIndex === index;
            other.style.background = active ? "var(--bronze-600)" : "transparent";
            other.style.color = active ? "var(--ivory)" : "var(--ink)";
          });
        });
      });
    });
    var homeRates = cfg.staticHome.rates || {};
    var rateSection = host.querySelector("section[data-ahv-final-rates]");
    if (rateSection) initializeNearViewport(rateSection, function () {
    var rateButtons = rateSection ? Array.from(rateSection.querySelectorAll('button[aria-pressed]')) : [];
    var rateCurrencies = ["INR", "USD", "EUR"];
    var visibleRates = [];
    if (rateSection) {
      var rateWalker = document.createTreeWalker(rateSection, NodeFilter.SHOW_TEXT);
      var rateNode;
      while ((rateNode = rateWalker.nextNode())) if (/[₹$€]\\s?[\\d,]+/.test(rateNode.nodeValue || "")) visibleRates.push(rateNode);
    }
    var currentHomeCurrency = "INR";
    function homeMoney(value, currency) {
      var amount = Number(value).toLocaleString(currency === "INR" ? "en-IN" : "en-US");
      return (currency === "INR" ? "₹" : currency === "USD" ? "$" : "€") + amount;
    }
    function chooseHomeCurrency(currency) {
      var row = homeRates[currency];
      if (!row || !rateSection) return;
      var values = (row.p || []).concat(row.day || []);
      visibleRates.forEach(function (node, index) {
        if (values[index] !== undefined) node.nodeValue = node.nodeValue.replace(/[₹$€]\\s?[\\d,]+/, homeMoney(values[index], currency));
      });
      currentHomeCurrency = currency;
      rateButtons.forEach(function (button, index) {
        var active = rateCurrencies[index] === currency;
        button.setAttribute("aria-pressed", String(active));
        button.style.background = active ? "var(--bronze-600)" : "var(--ivory)";
        button.style.color = active ? "var(--ivory)" : "var(--ink)";
        button.style.borderColor = active ? "var(--bronze-600)" : "var(--ink-line)";
      });
      try { localStorage.setItem("ahv-cur", currency); } catch (error) {}
    }
    rateButtons.forEach(function (button, index) {
      button.addEventListener("click", function () { chooseHomeCurrency(rateCurrencies[index]); });
    });
    try {
      var savedCurrency = localStorage.getItem("ahv-cur");
      if (savedCurrency && rateCurrencies.indexOf(savedCurrency) >= 0) chooseHomeCurrency(savedCurrency);
    } catch (error) {}
    });
    // Captured mobile/desktop template IDs differ. Use the existing gallery
    // structure so both snapshots receive the same unchanged filter handlers.
    var gallerySection = Array.from(host.querySelectorAll("section")).find(function (section) {
      return section.querySelector("a[aria-description]") && section.querySelector("button");
    });
    var galleryButtons = gallerySection ? Array.from(gallerySection.querySelectorAll("button")).filter(function (button) {
      return ["All", "Treatment", "Villa", "Yoga & Meditation", "Experience at Kairali"].indexOf(button.textContent.trim()) >= 0;
    }) : [];
    if (galleryButtons.length && gallerySection) initializeNearViewport(gallerySection, function () {
      var galleryItems = Array.from(gallerySection.querySelectorAll("a[aria-description]"));
      var galleryCategories = cfg.staticHome.galleryCategories || [];
      galleryButtons.forEach(function (button) {
        button.addEventListener("click", function () {
          var category = button.textContent.trim();
          galleryItems.forEach(function (item, index) {
            item.style.display = category === "All" || galleryCategories[index] === category ? "block" : "none";
          });
          galleryButtons.forEach(function (other) {
            var active = other === button;
            other.style.background = active ? "var(--marigold-400)" : "transparent";
            other.style.color = active ? "var(--ink)" : "var(--ivory)";
          });
        });
      });
      var photoData = cfg.staticHome.galleryPhotos || [];
    var galleryDialog = document.createElement("dialog");
    galleryDialog.setAttribute("aria-label", "Photo gallery");
    galleryDialog.style.cssText = "border:0;padding:18px;max-width:min(96vw,1100px);max-height:94vh;background:var(--forest-800);color:var(--ivory);border-radius:6px;box-shadow:0 16px 70px color-mix(in srgb,var(--ink) 40%,transparent)";
    var galleryClose = document.createElement("button");
    galleryClose.type = "button"; galleryClose.textContent = "Close"; galleryClose.setAttribute("aria-label", "Close photo");
    galleryClose.style.cssText = "display:block;margin:0 0 12px auto;padding:10px 14px;border:1px solid color-mix(in srgb,var(--ivory) 38%,var(--forest-800));background:var(--forest-800);color:var(--ivory);cursor:pointer";
    var galleryImage = document.createElement("img");
    galleryImage.style.cssText = "display:block;max-width:90vw;max-height:76vh;width:auto;height:auto;object-fit:contain;margin:auto";
    var galleryCaption = document.createElement("p");
    galleryCaption.style.cssText = "margin:12px 0 0;text-align:center";
    var galleryControls = document.createElement("div");
    galleryControls.style.cssText = "display:flex;justify-content:space-between;gap:12px;margin-top:10px";
    var galleryPrevious = document.createElement("button");
    galleryPrevious.type = "button"; galleryPrevious.textContent = "Previous"; galleryPrevious.setAttribute("aria-label", "Previous photo");
    var galleryNext = document.createElement("button");
    galleryNext.type = "button"; galleryNext.textContent = "Next"; galleryNext.setAttribute("aria-label", "Next photo");
    [galleryPrevious, galleryNext].forEach(function (button) { button.style.cssText = "padding:10px 14px;border:1px solid color-mix(in srgb,var(--ivory) 38%,var(--forest-800));background:var(--forest-800);color:var(--ivory);cursor:pointer"; });
    galleryControls.append(galleryPrevious, galleryNext);
    galleryDialog.append(galleryClose, galleryImage, galleryCaption, galleryControls);
    document.body.appendChild(galleryDialog);
    var photoIndex = 0;
    function showPhoto(index) {
      var photos = photoData.filter(function (item) { return item.kind === "photo"; });
      if (!photos.length) return;
      photoIndex = (index + photos.length) % photos.length;
      galleryImage.src = photos[photoIndex].src;
      galleryImage.alt = photos[photoIndex].alt || "";
      galleryCaption.textContent = photos[photoIndex].caption || "";
    }
    galleryItems.forEach(function (item, index) {
      item.addEventListener("click", function (event) {
        if (photoData[index]?.kind !== "photo") return;
        event.preventDefault();
        showPhoto(index);
        if (!galleryDialog.open) galleryDialog.showModal();
      });
    });
    galleryClose.addEventListener("click", function () { galleryDialog.close(); });
    galleryPrevious.addEventListener("click", function () { showPhoto(photoIndex - 1); });
    galleryNext.addEventListener("click", function () { showPhoto(photoIndex + 1); });
    galleryDialog.addEventListener("click", function (event) { if (event.target === galleryDialog) galleryDialog.close(); });
    galleryDialog.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") { event.preventDefault(); showPhoto(photoIndex - 1); }
      if (event.key === "ArrowRight") { event.preventDefault(); showPhoto(photoIndex + 1); }
    });
    });
    (${initializeHomeHero.toString()})(host, window);
  }
  var form = host.querySelector('form[data-form="contact"]');
  if (!form) return;
  if (location.hash.indexOf("#message?") === 0) {
    var draft = new URLSearchParams(location.hash.slice(9)).get("draft");
    var messageField = form.elements.namedItem("message");
    if (draft && messageField && !messageField.value) messageField.value = draft.slice(0, 1000);
    if (messageField) setTimeout(function () { messageField.focus(); }, 100);
  }
  var status = form.querySelector('[role="status"]');
  var token = null;
  var busy = false;
  form.addEventListener("input", function () { if (!busy) token = null; });
  form.addEventListener("change", function () { if (!busy) token = null; });
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (busy) return;
    var data = new FormData(form);
    var name = String(data.get("fname") || "").trim();
    var countryCode = String(data.get("country_code") || "").trim();
    var phone = String(data.get("phone") || "").trim();
    var email = String(data.get("email") || "").trim();
    var invalid = {
      fname: name.length < 2,
      country_code: !countryCode,
      phone: phone.replace(/\\D/g, "").length < 7,
      email: !/^\\S+@\\S+\\.\\S+$/.test(email)
    };
    var first = null;
    Object.keys(invalid).forEach(function (field) {
      var input = form.elements.namedItem(field);
      if (!input) return;
      if (invalid[field]) {
        input.setAttribute("aria-invalid", "true");
        if (!first) first = input;
      } else input.removeAttribute("aria-invalid");
    });
    if (first) { first.focus(); return; }
    if (!token) token = crypto.randomUUID();
    busy = true;
    form.setAttribute("aria-busy", "true");
    if (status) status.textContent = "Sending…";
    var controller = new AbortController();
    // Allow both the signed relay and Sheet acknowledgement (15 seconds each) to finish.
    var timeout = setTimeout(function () { controller.abort(); }, 45000);
    try {
      var programme = String(data.get("programme") || "");
      var select = form.elements.namedItem("programme");
      if (select && window.AHV_LEAD_RECEIPT) {
        programme = window.AHV_LEAD_RECEIPT.canonicalOption("programme", select.selectedIndex, programme);
      }
      var campaign = window.AHV_LEAD_RECEIPT.attribution();
      var response = await fetch("/api/lead/", {
        method: "POST", credentials: "same-origin", cache: "no-store",
        body: new Blob([JSON.stringify({
          form: "contact", submissionToken: token,
          site_language: window.AHV_LEAD_RECEIPT.siteLanguage(),
          utm_source: campaign.utm_source || "",
          utm_medium: campaign.utm_medium || "",
          utm_campaign: campaign.utm_campaign || "",
          utm_term: campaign.utm_term || "",
          utm_content: campaign.utm_content || "",
          gclid: campaign.gclid || "",
          fbclid: campaign.fbclid || "",
          gbraid: campaign.gbraid || "", wbraid: campaign.wbraid || "",
          lead_source_url: location.href.slice(0, 500),
          referrer: (document.referrer || "").slice(0, 500),
          fields: { full_name: name, countrycode: countryCode, phone: phone,
            programme: programme, email: email, message: String(data.get("message") || "") }
        })], { type: "application/json" }),
        signal: controller.signal
      });
      var result = await response.json().catch(function () { return {}; });
      if (response.status === 503 && /_NOT_CONFIGURED$/.test(String(result.code || ""))) {
        if (status) status.textContent = "The form is not connected yet. Your details are still here; please contact us by phone or email.";
        return;
      }
      if (!response.ok || result.ok !== true) {
        if (status) status.textContent = response.status === 429
          ? "Please wait before trying again. Your details are still in the form."
          : "We could not confirm your submission. Your details are still here; please try again.";
        return;
      }
      if (typeof result.guideUrl === "string" && result.guideUrl.charAt(0) === "/") {
        var guide = document.createElement("a");
        guide.href = result.guideUrl; guide.download = ""; guide.hidden = true;
        document.body.appendChild(guide); guide.click(); guide.remove();
      }
      if (status) status.textContent = "Thank you — your details have been received.";
    } catch (error) {
      if (status) status.textContent = "We could not confirm your submission. Check your connection and try again.";
    } finally {
      clearTimeout(timeout);
      busy = false;
      form.removeAttribute("aria-busy");
    }
  });
})();`;
