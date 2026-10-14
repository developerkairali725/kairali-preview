// Pure rules for the on-page patient-film player mounted by Stories.tsx (GuestVideoDialog.tsx); node --test imports
// this file. Owner decision DEC-GUEST-VIDEO-POPUP: play the existing films in an on-page popup on exactly the 13
// English routes below, keeping each card's YouTube link as the fallback. Fail closed everywhere: an unknown route,
// language, film, consent state or API means no player.

/** The 13 English routes of DEC-GUEST-VIDEO-POPUP (WOPS-AHV-GUEST-VIDEO-20261010-001 SCOPE.json), exact paths. */
export const GUEST_VIDEO_ROUTES = Object.freeze([
  "/pain-management.html",
  "/family-ayurvedic-retreat-kerala.html",
  "/ayurveda-retreat-kerala.html",
  "/kairali-cleansing-centre.html",
  "/treatment-in-kerala.html",
  "/karkidaka-chikitsha-or-monsoon-wellness.html",
  "/preventive-rejuvenation-detoxification.html",
  "/wellness-resort-kerala.html",
  "/lp/ayurvedic-hospital-kerala/",
  "/lp/kairali-cleansing-centre/",
  "/lp/pain-management/",
  "/lp/treatment-in-kerala/",
  "/lp/treatment-packages/",
  // AHV-WB.015/039.change (standing owner authority for on-page guest-video playback, 10 Oct 2026): the two routes that
  // now render the same consented Stories films. Same consent gate, same films; nothing else changes.
  "/ayurvedic-treatment-packages.html",
  "/panchkarma-treatment.html",
]);

/** Every film the 13 routes' reviewed copy already links (production/pages/*.ts). No other id is ever embedded. */
export const APPROVED_FILM_IDS = Object.freeze(["iPARaMRASUs", "4x01PtWfNnk", "3vWviQfW1Ug", "07tVC2oXd8g", "DcTMckQD3rc"]);

/**
 * Conservative gating by this popup only. The existing consent configuration (public/consent, unchanged) offers
 * Analytics and Advertising as its optional categories and names neither YouTube nor embedded video, so this consumer
 * requires both to be currently accepted. That is not a purpose-specific permission for video. Global Privacy
 * Control removes Advertising, so with GPC a film never plays here.
 */
export const REQUIRED_CATEGORIES = Object.freeze(["analytics", "advertising"]);

const ROUTES = new Set(GUEST_VIDEO_ROUTES);
const FILMS = new Set(APPROVED_FILM_IDS);
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/** True only on one of the 13 exact paths of an English document. */
export function routeAllowed(pathname, lang) {
  return typeof pathname === "string" && typeof lang === "string" && ROUTES.has(pathname) && /^en(?:-[A-Za-z]{2})?$/.test(lang);
}

/** The approved film id behind an existing card href (`https://www.youtube.com/watch?v=<id>` exactly), else null. */
export function filmIdFromHref(href) {
  if (typeof href !== "string" || href.length > 64) return null;
  let url;
  try { url = new URL(href); } catch { return null; }
  if (url.protocol !== "https:" || url.hostname !== "www.youtube.com" || url.port || url.username || url.password) return null;
  if (url.pathname !== "/watch" || url.hash) return null;
  const keys = [...url.searchParams.keys()];
  if (keys.length !== 1 || keys[0] !== "v") return null;
  const id = url.searchParams.get("v");
  return YOUTUBE_ID.test(id) && FILMS.has(id) ? id : null;
}

function approved(id) {
  if (typeof id !== "string" || !YOUTUBE_ID.test(id) || !FILMS.has(id)) throw new Error(`guest-video: ${id} is not an approved film`);
  return id;
}

/** The privacy-enhanced embed for an approved film. Throws for anything else. */
export function embedSrc(id) {
  return `https://www.youtube-nocookie.com/embed/${approved(id)}?autoplay=1&playsinline=1&rel=0`;
}

/** The external full-film fallback for an approved film (the card's own href). */
export function watchHref(id) {
  return `https://www.youtube.com/watch?v=${approved(id)}`;
}

/** A plain primary click. Modified, middle/right and already-handled clicks keep the link's own behaviour. */
export function interceptsClick(e) {
  return !!e && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.defaultPrevented;
}

/**
 * Whether the visitor's CURRENT consent allows the embed. Reads the bridge's own state, never writes it:
 * `cc` = the pinned CookieConsent module public/consent/bridge.mjs runs; `policy` = public/consent/policy.mjs;
 * `settingsReady` = the bridge finished CC.run (it defines AHV_COOKIE_SETTINGS afterwards). Requires a valid,
 * current-revision, unexpired record that the bridge's own validator accepts and that grants every
 * REQUIRED_CATEGORIES entry. Missing, unknown, denied, expired, older-revision or GPC state → false.
 */
export function consentGranted({ cc, policy, storage, gpc, settingsReady, now } = {}) {
  try {
    if (gpc !== false || settingsReady !== true || !Number.isFinite(now)) return false;
    if (!cc || typeof cc.validConsent !== "function" || typeof cc.acceptedCategory !== "function" || typeof cc.getCookie !== "function") return false;
    if (!policy || typeof policy.readSavedChoice !== "function" || !Number.isInteger(policy.REVISION)) return false;
    if (cc.validConsent() !== true) return false;
    const cookie = cc.getCookie();
    if (!cookie || cookie.revision !== policy.REVISION || !Array.isArray(cookie.categories)) return false;
    if (!Number.isFinite(cookie.expirationTime) || cookie.expirationTime <= now) return false;
    const saved = policy.readSavedChoice(storage, now);
    if (!saved || saved.revision !== policy.REVISION || saved.consentId !== cookie.consentId || saved.expirationTime <= now) return false;
    return REQUIRED_CATEGORIES.every((c) => cc.acceptedCategory(c) === true && cookie.categories.includes(c) && saved.categories.includes(c));
  } catch {
    return false;
  }
}

/** Opens the bridge's existing Cookie choices (no second UI). False when that control is unavailable. */
export function openCookieSettings(win) {
  try {
    if (typeof win?.AHV_COOKIE_SETTINGS !== "function") return false;
    win.AHV_COOKIE_SETTINGS();
    return true;
  } catch {
    return false;
  }
}

/** @typedef {{ kind: "closed" } | { kind: "consent" | "playing", id: string, title: string }} GuestVideoState */

/** @type {GuestVideoState} */
export const CLOSED = Object.freeze({ kind: "closed" });

/**
 * The popup's state machine. "consent" shows only local content (thumbnail, settings, external link); "playing"
 * is the only state with a player, and is reached only from an explicit open (the visitor pressing a film) while
 * consent is currently granted on an allowed route. Consent granted later never starts playback by itself.
 *   open    {id, title, granted, routeOk}
 *   consent {granted}       — any consent change/recheck; withdrawal or expiry ends playback
 *   route   {routeOk}       — route/locale recheck; leaving the 13 routes closes
 *   close                   — close button, Escape, backdrop, navigation, unmount
 */
/**
 * @param {GuestVideoState} state
 * @param {{ type: string, id?: unknown, title?: unknown, granted?: unknown, routeOk?: unknown }} event
 * @returns {GuestVideoState}
 */
export function reduce(state, event) {
  switch (event?.type) {
    case "open": {
      if (state?.kind !== "closed" || event.routeOk !== true) return state ?? CLOSED;
      let id;
      try { id = approved(event.id); } catch { return state; }
      const title = typeof event.title === "string" && event.title.trim() ? event.title.trim().slice(0, 160) : "Video";
      return { kind: event.granted === true ? "playing" : "consent", id, title };
    }
    case "consent":
      return state?.kind === "playing" && event.granted !== true ? CLOSED : state;
    case "route":
      return state?.kind !== "closed" && event.routeOk !== true ? CLOSED : state;
    case "close":
      return CLOSED;
    default:
      return state ?? CLOSED;
  }
}

/**
 * The only path to a player source: an approved film in the "playing" state.
 * @param {GuestVideoState} state
 * @returns {string | null}
 */
export function playerSrc(state) {
  return state?.kind === "playing" ? embedSrc(state.id) : null;
}

/** Native modal <dialog> support. Without showModal() a card stays its plain link (no non-modal stand-in). */
export function dialogSupported(win) {
  try {
    return typeof win?.HTMLDialogElement === "function" && typeof win.HTMLDialogElement.prototype?.showModal === "function";
  } catch {
    return false;
  }
}

/** A same-origin thumbnail already on the card; never a remote image. */
export function localThumb(link, win) {
  const img = link?.querySelector?.("img");
  const src = img?.currentSrc || img?.getAttribute?.("src") || "";
  try {
    return src && new URL(src, win.location.href).origin === win.location.origin ? src : null;
  } catch {
    return null;
  }
}

/**
 * @typedef {{ film: GuestVideoState, thumb: string | null, host: Element | null, gpc: boolean, settingsUnavailable: boolean }} GuestVideoView
 */

/** @type {GuestVideoView} */
export const CLOSED_VIEW = Object.freeze({ film: CLOSED, thumb: null, host: null, gpc: false, settingsUnavailable: false });

/**
 * Everything the popup does outside rendering: the card click, consent reads, route/locale/navigation and consent
 * rechecks, and teardown. GuestVideoDialog.tsx renders `getSnapshot()` and reports the router's pathname and the native
 * dialog's lifecycle back. A single document click listener is always installed (no fetch, no other work); each
 * click checks the CURRENT path and <html lang>, so a component that stays mounted across client navigation works
 * on an allowed route reached later and does nothing on any other. The consent modules load only on an allowed route.
 * Any pathname change after a film opens (including to another allowed route) closes it.
 *
 * @param {{ win: any, doc: any, loadConsent: () => Promise<{ cc: unknown, policy: unknown }>, now?: () => number, recheckMs?: number }} deps
 */
export function createGuestVideoController({ win, doc, loadConsent, now = () => Date.now(), recheckMs = 1000 }) {
  /** @type {GuestVideoView} */
  let view = CLOSED_VIEW;
  /** @type {{ cc: unknown, policy: unknown } | null} */
  let apis = null;
  /** @type {Promise<void> | null} */
  let loading = null;
  /** @type {string | null} */
  let openPath = null;
  /** @type {any} */
  let trigger = null;
  let pendingSettings = false;
  let token = 0;
  /** @type {(() => void) | null} */
  let stopWatching = null;
  const subscribers = new Set();

  const set = (next) => {
    if (next === view) return;
    view = next;
    subscribers.forEach((f) => f());
  };
  const gpc = () => win.navigator?.globalPrivacyControl === true;
  const routeOk = () => routeAllowed(win.location?.pathname, doc.documentElement?.lang);
  const stillHere = () => openPath !== null && win.location?.pathname === openPath && routeOk();
  const granted = () => {
    if (!apis) return false;
    let storage;
    try { storage = win.localStorage; } catch { storage = undefined; }
    return consentGranted({
      cc: apis.cc, policy: apis.policy, storage, gpc: gpc(),
      settingsReady: typeof win.AHV_COOKIE_SETTINGS === "function", now: now(),
    });
  };

  const preload = () => {
    if (apis || !routeOk()) return loading ?? Promise.resolve();
    loading ??= Promise.resolve()
      .then(loadConsent)
      .then((m) => { apis = m && m.cc && m.policy ? m : null; }, () => { apis = null; })
      .finally(() => { if (!apis) loading = null; });
    return loading;
  };

  const apply = (event) => {
    const film = reduce(view.film, event);
    if (film === view.film) return;
    if (film.kind === "closed") {
      const stop = stopWatching;
      stopWatching = null;
      stop?.();
      openPath = null;
      set(CLOSED_VIEW);
      return;
    }
    set({ ...view, film });
  };

  const close = () => {
    token++;
    apply({ type: "close" });
  };

  const recheck = () => {
    apply({ type: "route", routeOk: stillHere() });
    if (view.film.kind !== "closed") apply({ type: "consent", granted: granted() });
  };

  const watch = () => {
    const winEvents = ["cc:onChange", "cc:onConsent", "storage", "focus"];
    winEvents.forEach((n) => win.addEventListener(n, recheck));
    doc.addEventListener("visibilitychange", recheck);
    win.addEventListener("popstate", close);
    win.addEventListener("pagehide", close);
    const Observer = win.MutationObserver;
    const lang = typeof Observer === "function" ? new Observer(recheck) : null;
    lang?.observe(doc.documentElement, { attributes: true, attributeFilter: ["lang"] });
    const timer = win.setInterval(recheck, recheckMs);
    stopWatching = () => {
      winEvents.forEach((n) => win.removeEventListener(n, recheck));
      doc.removeEventListener("visibilitychange", recheck);
      win.removeEventListener("popstate", close);
      win.removeEventListener("pagehide", close);
      lang?.disconnect();
      win.clearInterval(timer);
    };
  };

  const onClick = (e) => {
    if (!interceptsClick(e) || view.film.kind !== "closed" || !dialogSupported(win) || !routeOk()) return;
    const link = typeof e.target?.closest === "function" ? e.target.closest("a.lp-pstory") : null;
    if (!link || !link.closest(".lp-pstories")) return;
    const id = filmIdFromHref(link.getAttribute("href"));
    if (!id) return;
    e.preventDefault();
    const mine = ++token;
    openPath = win.location.pathname;
    trigger = link;
    const title = link.querySelector(".lp-pstory__title")?.textContent ?? "";
    const thumb = localThumb(link, win);
    const host = link.closest(".lp-prod") ?? doc.body;
    // Consent is judged at the press: unknown (modules not yet loaded) counts as denied for this press and is never
    // upgraded by a grant that lands while they load. The current state is still rechecked so a revocation wins.
    const allowedAtClick = apis ? granted() : false;
    const open = () => {
      if (mine !== token || view.film.kind !== "closed" || !stillHere()) return;
      const film = reduce(view.film, { type: "open", id, title, granted: allowedAtClick && granted(), routeOk: true });
      if (film.kind === "closed") return;
      set({ film, thumb, host, gpc: gpc(), settingsUnavailable: false });
      watch();
    };
    if (apis) open();
    else preload().then(open);
  };

  return {
    install() {
      doc.addEventListener("click", onClick);
      void preload();
    },
    destroy() {
      doc.removeEventListener("click", onClick);
      close();
      subscribers.clear();
    },
    /** @param {() => void} f */
    subscribe(f) {
      subscribers.add(f);
      return () => { subscribers.delete(f); };
    },
    /** @returns {GuestVideoView} */
    getSnapshot() {
      return view;
    },
    /** The router's current pathname: any change from the opened film's path closes it (and cancels a pending open). */
    setPathname(pathname) {
      if (pathname !== openPath) close();
      void preload();
    },
    close,
    /** Cookie choices: close this modal first (a modal would make them inert); the TSX calls dialogClosed() after. */
    requestSettings() {
      if (typeof win.AHV_COOKIE_SETTINGS !== "function") {
        set({ ...view, settingsUnavailable: true });
        return false;
      }
      pendingSettings = true;
      close();
      return true;
    },
    /** The native dialog has closed: return focus to the card, then open any requested Cookie choices. */
    dialogClosed() {
      const t = trigger;
      trigger = null;
      try { if (t?.isConnected) t.focus({ preventScroll: true }); } catch { /* focus is best-effort */ }
      if (pendingSettings) {
        pendingSettings = false;
        openCookieSettings(win);
      }
    },
    /** showModal() threw: close and keep the card's own behaviour (its href, in a new tab). */
    modalFailed() {
      const film = view.film;
      close();
      trigger = null;
      if (film.kind !== "closed") {
        try { win.open(watchHref(film.id), "_blank", "noopener,noreferrer"); } catch { /* nothing else to do */ }
      }
    },
  };
}
