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
]);

/** Every film the 13 routes' reviewed copy already links (production/pages/*.ts). No other id is ever embedded. */
export const APPROVED_FILM_IDS = Object.freeze(["iPARaMRASUs", "4x01PtWfNnk", "3vWviQfW1Ug", "07tVC2oXd8g", "DcTMckQD3rc"]);

/**
 * The site's consent UI (public/consent) offers only Analytics and Advertising as optional categories and names
 * neither YouTube nor embedded video. Until a privacy owner maps embedded films to a category, both must be
 * currently accepted; Global Privacy Control removes Advertising, so GPC never plays a film here.
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
