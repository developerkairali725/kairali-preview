import { readFileSync } from "node:fs";
import { join } from "node:path";
import { runInNewContext } from "node:vm";
import { phoneCriticalMedia, descriptiveAwardLinks, firstCriticalImage } from "./critical-media.mjs";
import { formPostSafety } from "./form-post-safety.mjs";
import { newsletterFooters } from "./newsletter-markup.mjs";
import { computedFooterYear } from "./computed-footer-year";
import { youtubeNewTabs } from "./youtube-links";
import { snapshotStylesFor } from "./snapshot-styles.mjs";
import { routeSchema } from "./schema";
import { buildBootConfig } from "./design-view";
import { CONSENT_RUNTIME } from "./consent-runtime";
import { createBackgroundDeferral } from "./media-loading.mjs";
import type { CandidateRoute } from "./registry";
import consistencyLock from "../../../english-candidate/consistency-locked-families.json";

// The compiled approved views are captured at both view widths during the
// build. The mobile document remains the crawlable, no-JS HTML. Wide screens
// fetch their static HTML fragment instead of making phones download a second
// full document. Neither variant loads the design runtime or a second React root.
function snapshot(routePath: string, desktop = false): string {
  const name = routePath === "/" ? "index" : routePath.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9._-]+/gi, "_");
  const source = readFileSync(desktop
    ? join(process.cwd(), "public/ahv/static", `${name}.html`)
    : join(process.cwd(), "english-candidate/prerender", `${name}.html`), "utf8");
  const safe = formPostSafety(newsletterFooters(computedFooterYear(youtubeNewTabs(source))));
  return descriptiveAwardLinks(desktop ? safe : phoneCriticalMedia(safe));
}

function tariffRows(viewId: string | null): Record<string, string[][]> | undefined {
  if (!viewId) return undefined;
  const payload = JSON.parse(readFileSync(join(process.cwd(), "public/ahv/views", `${viewId}.json`), "utf8"));
  const match = String(payload.logic || "").match(/const tableData = (\{[^\n]+?\});/);
  if (!match) throw new Error(`AHV static tariff data missing from ${viewId}`);
  const rows = JSON.parse(match[1]) as Record<string, string[][]>;
  if (!["INR", "USD", "EURO"].every((key) => rows[key]?.length === 4)) throw new Error(`AHV static tariff data invalid in ${viewId}`);
  return rows;
}

function homeStaticData(viewId: string | null) {
  if (!viewId) return undefined;
  const payload = JSON.parse(readFileSync(join(process.cwd(), "public/ahv/views", `${viewId}.json`), "utf8"));
  const logic = String(payload.logic || "");
  const source = `${logic}\n;const __component = new Component(); __component.props = {}; globalThis.__homeStatic = { values: __component.renderVals(), rates: HOME_RATES };`;
  const sandbox = { DCLogic: class {} };
  runInNewContext(source, sandbox, { timeout: 1000 });
  const data = (sandbox as { __homeStatic?: { values: Record<string, any>; rates: Record<string, any> } }).__homeStatic;
  if (!data?.values?.newsItems?.length || !data?.values?.galItems?.length) throw new Error("AHV homepage interaction data missing");
  return {
    rates: data.rates,
    news: data.values.newsItems.map(({ title, body, cta, href, img, alt }: any) => ({ title, body, cta, href, img, alt })),
    galleryCategories: data.values.galItems.map(({ cat }: any) => cat),
    galleryPhotos: data.values.galItems.map(({ src, caption, alt, kind }: any) => ({ src, caption, alt, kind })),
    programmeCounts: data.values.groups.map((group: any) => group.items.length),
  };
}

const STATIC_BOOT = `
(async function () {
  if (window.__ahvStaticDesignBooted) return;
  window.__ahvStaticDesignBooted = true;
  var host = document.getElementById("ahv-design-root");
  if (!host) return;
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
      host.innerHTML = await response.text();
      host.setAttribute("data-ahv-variant", "desktop");
    } catch (error) {
      host.setAttribute("data-ahv-variant", "mobile-fallback");
    }
  }
  host.removeAttribute("data-ahv-static-pending");
  (${createBackgroundDeferral.toString()})(window, 800)(host);
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
        button.style.background = active ? "#5A4420" : "#fff";
        button.style.color = active ? "#F7F4EA" : "#2A2118";
        button.style.borderColor = active ? "#5A4420" : "#C9BFA8";
      });
    }
    buttons.forEach(function (button, index) {
      button.addEventListener("click", function () { chooseCurrency(["INR", "USD", "EURO"][index]); });
    });
  }
  if (cfg.staticHome) {
    var homeSection = host.querySelector('section:has(button[aria-label="Next announcement"])');
    var homeNews = cfg.staticHome.news || [];
    if (homeSection && homeNews.length) {
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
    }
    var programmeLabels = ["Detox & Rejuvenation", "Pain, Spine & Joints", "Lifestyle & Chronic Conditions", "Women's Health", "Yoga & Mind"];
    var programmeSection = Array.from(host.querySelectorAll("section")).find(function (section) {
      var labels = Array.from(section.querySelectorAll("button")).map(function (button) { return button.textContent.trim(); });
      return programmeLabels.every(function (label) { return labels.indexOf(label) >= 0; });
    });
    if (programmeSection) {
      var programmeButtons = Array.from(programmeSection.querySelectorAll("button")).filter(function (button) { return programmeLabels.indexOf(button.textContent.trim()) >= 0; });
      var programmeGroups = Array.from(programmeSection.querySelectorAll("div")).filter(function (div) {
        return div.querySelectorAll("a[href]").length >= 2 && div.children.length > 0 && Array.from(div.children).every(function (child) { return child.tagName === "A"; });
      });
      if (programmeGroups.length > 5) programmeGroups = programmeGroups.slice(-5);
      var programmeCards = Array.from(programmeSection.querySelectorAll('div[data-dc-tpl="204"]'));
      var programmeCounts = cfg.staticHome.programmeCounts || [];
      programmeButtons.forEach(function (button, index) {
        button.addEventListener("click", function () {
          if (programmeGroups.length === 5) {
            programmeGroups.forEach(function (group, groupIndex) { group.style.display = groupIndex === index ? "flex" : "none"; });
          } else {
            var start = programmeCounts.slice(0, index).reduce(function (sum, count) { return sum + count; }, 0);
            var end = start + (programmeCounts[index] || 0);
            programmeCards.forEach(function (card, cardIndex) { card.style.display = cardIndex >= start && cardIndex < end ? "flex" : "none"; });
          }
          programmeButtons.forEach(function (other, otherIndex) {
            var active = otherIndex === index;
            other.style.background = active ? "#5A4420" : "transparent";
            other.style.color = active ? "#F7F4EA" : "#2A2118";
          });
        });
      });
    }
    var homeRates = cfg.staticHome.rates || {};
    var rateSection = host.querySelector('section:has(button[aria-pressed])');
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
        button.style.background = active ? "#5A4420" : "#fff";
        button.style.color = active ? "#F7F4EA" : "#2A2118";
        button.style.borderColor = active ? "#5A4420" : "#C9BFA8";
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
    var galleryButtons = Array.from(host.querySelectorAll("button")).filter(function (button) {
      return ["All", "Treatment", "Villa", "Yoga & Meditation", "Experience at Kairali"].indexOf(button.textContent.trim()) >= 0;
    });
    var galleryItems = Array.from(host.querySelectorAll("a[aria-description]"));
    var galleryCategories = cfg.staticHome.galleryCategories || [];
    galleryButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var category = button.textContent.trim();
        galleryItems.forEach(function (item, index) {
          item.style.display = category === "All" || galleryCategories[index] === category ? "block" : "none";
        });
        galleryButtons.forEach(function (other) {
          var active = other === button;
          other.style.background = active ? "#EEB41E" : "transparent";
          other.style.color = active ? "#2A2118" : "#F7F4EA";
        });
      });
    });
    var photoData = cfg.staticHome.galleryPhotos || [];
    var galleryDialog = document.createElement("dialog");
    galleryDialog.setAttribute("aria-label", "Photo gallery");
    galleryDialog.style.cssText = "border:0;padding:18px;max-width:min(96vw,1100px);max-height:94vh;background:#17130f;color:#fff;border-radius:6px;box-shadow:0 16px 70px rgba(0,0,0,.5)";
    var galleryClose = document.createElement("button");
    galleryClose.type = "button"; galleryClose.textContent = "Close"; galleryClose.setAttribute("aria-label", "Close photo");
    galleryClose.style.cssText = "display:block;margin:0 0 12px auto;padding:10px 14px;border:1px solid #ddd;background:#17130f;color:#fff;cursor:pointer";
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
    [galleryPrevious, galleryNext].forEach(function (button) { button.style.cssText = "padding:10px 14px;border:1px solid #ddd;background:#17130f;color:#fff;cursor:pointer"; });
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
    var heroVideo = host.querySelector("video");
    var heroToggle = host.querySelector('button[aria-label*="background video"]');
    var chapterButtons = Array.from(host.querySelectorAll("button")).filter(function (button) { return /^0[1-4] ·/.test(button.textContent.trim()); });
    var chapterTimes = [0, 8.067, 15.767, 22.834];
    function playHero(time) {
      if (!heroVideo) return;
      if (!heroVideo.getAttribute("src")) heroVideo.setAttribute("src", "/ahv/assets/homepage-journey.mp4");
      heroVideo.muted = true;
      var seek = function () { try { heroVideo.currentTime = time; } catch (error) {} };
      if (time && heroVideo.readyState < 1) heroVideo.addEventListener("loadedmetadata", seek, { once: true });
      else if (time) seek();
      var playing = heroVideo.play();
      if (playing && playing.catch) playing.catch(function () {});
      if (heroToggle) { heroToggle.setAttribute("aria-label", "Pause background video"); heroToggle.textContent = "❚❚ Pause background video"; }
    }
    chapterButtons.forEach(function (button, index) { button.addEventListener("click", function () { playHero(chapterTimes[index]); }); });
    if (heroToggle) heroToggle.addEventListener("click", function () {
      if (!heroVideo) return;
      if (heroVideo.paused) playHero(0);
      else { heroVideo.pause(); heroToggle.setAttribute("aria-label", "Play background video"); heroToggle.textContent = "▶ Play background video"; }
    });
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
    var timeout = setTimeout(function () { controller.abort(); }, 10000);
    try {
      var programme = String(data.get("programme") || "");
      var select = form.elements.namedItem("programme");
      if (select && window.AHV_LEAD_RECEIPT) {
        programme = window.AHV_LEAD_RECEIPT.canonicalOption("programme", select.selectedIndex, programme);
      }
      var response = await fetch("/api/lead/", {
        method: "POST", credentials: "same-origin", cache: "no-store",
        body: new Blob([JSON.stringify({
          form: "contact", submissionToken: token,
          site_language: window.AHV_LEAD_RECEIPT.siteLanguage(),
          utm_source: (new URLSearchParams(location.search).get("utm_source") || "").slice(0, 190),
          utm_medium: (new URLSearchParams(location.search).get("utm_medium") || "").slice(0, 190),
          utm_campaign: (new URLSearchParams(location.search).get("utm_campaign") || "").slice(0, 190),
          utm_term: (new URLSearchParams(location.search).get("utm_term") || "").slice(0, 190),
          utm_content: (new URLSearchParams(location.search).get("utm_content") || "").slice(0, 190),
          gclid: (new URLSearchParams(location.search).get("gclid") || "").slice(0, 190),
          fbclid: (new URLSearchParams(location.search).get("fbclid") || "").slice(0, 190),
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

function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function StaticDesignView({ route }: { route: CandidateRoute }) {
  const mobile = snapshot(route.path);
  const desktop = snapshot(route.path, true);
  const cfg = buildBootConfig(route);
  const family = (route.desktopView ?? route.mobileView ?? "").replace(/^ahv-page-/, "").replace(/-(desktop|mobile)$/, "").replace(/--[a-z0-9-]+$/, "");
  const consistency = Object.hasOwn(consistencyLock.families, family.replace(/^ahv-template-/, "")) ? undefined : "1";
  const staticDesktopPath = `/ahv/static/${route.path === "/" ? "index" : route.path.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9._-]+/gi, "_")}.html`;
  const staticConfig = {
    breakpoint: cfg.breakpoint,
    locale: cfg.locale,
    measurement: cfg.measurement,
    staticDesktopPath,
    deferFonts: route.path === "/",
    staticHome: route.path === "/" ? homeStaticData(route.mobileView ?? null) : undefined,
    staticTariffs: route.path === "/panchakarma-therapy/" ? tariffRows(route.mobileView) : undefined,
  };
  const narrow = `(max-width: ${cfg.breakpoint - 1}px)`;
  const wide = `(min-width: ${cfg.breakpoint}px)`;
  const phonePaint = snapshotStylesFor(cfg);
  const widePaint = snapshotStylesFor({ ...cfg, mobileView: cfg.desktopView });
  const fontCss = [...(phonePaint?.fontCss || []), ...(widePaint?.fontCss || [])].filter((value, index, all) =>
    all.findIndex((item) => item.href === value.href) === index,
  );
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(routeSchema(route, "en")) }} />
      {firstCriticalImage(mobile) ? <link rel="preload" as="image" fetchPriority="high" media={narrow} href={firstCriticalImage(mobile)!} /> : null}
      {firstCriticalImage(desktop) ? <link rel="preload" as="image" fetchPriority="high" media={wide} href={firstCriticalImage(desktop)!} /> : null}
      {phonePaint?.preloadFonts.map((href) => (
        <link key={href} rel="preload" as="font" type={href.endsWith(".woff2") ? "font/woff2" : "font/ttf"} crossOrigin="anonymous" href={href} media={route.path === "/" ? "print" : narrow} data-ahv-deferred-font={route.path === "/" ? "" : undefined} data-ahv-font-media={route.path === "/" ? narrow : undefined} />
      ))}
      <link rel="preload" as="fetch" crossOrigin="anonymous" media={wide} href={staticDesktopPath} />
      {fontCss.map(({ href, css }) => css
        ? <style key={href} media={route.path === "/" ? "print" : undefined} data-ahv-deferred-font={route.path === "/" ? "" : undefined} data-ahv-font-media={route.path === "/" ? "all" : undefined} dangerouslySetInnerHTML={{ __html: css }} />
        : <link key={href} rel="stylesheet" href={href} media={route.path === "/" ? "print" : undefined} data-ahv-deferred-font={route.path === "/" ? "" : undefined} data-ahv-font-media={route.path === "/" ? "all" : undefined} />)}
      {phonePaint?.styles.map((css, index) => <style key={`phone-${index}`} media={narrow} dangerouslySetInnerHTML={{ __html: css }} />)}
      {widePaint?.styles.map((css, index) => <style key={`wide-${index}`} media={wide} dangerouslySetInnerHTML={{ __html: css }} />)}
      <style dangerouslySetInnerHTML={{ __html: `@media ${wide}{#ahv-design-root[data-ahv-static-pending]{visibility:hidden;min-height:100vh}}` }} />
      <div id="ahv-design-root" data-ahv-route={route.path} data-ahv-family={family || undefined} data-ahv-consistency={consistency} data-ahv-bg-defer="" data-ahv-static-pending=""
        suppressHydrationWarning dangerouslySetInnerHTML={{ __html: mobile }} />
      <script id="ahv-static-design-config" type="application/json" dangerouslySetInnerHTML={{ __html: safeJson(staticConfig) }} />
      <script dangerouslySetInnerHTML={{ __html: STATIC_BOOT }} />
    </>
  );
}
