"use client";

// On-page player for the Stories film cards (DEC-GUEST-VIDEO-POPUP). Renders nothing on the server and nothing until a
// film is pressed, so the section's markup, links and thumbnails stay exactly as Stories.tsx renders them; without
// JavaScript, <dialog> support, an allowed route or an approved film, a card stays the plain YouTube link it was.
// A plain click on a card opens a popup. The YouTube (nocookie) player is created only when that click happens while
// the visitor's current consent allows it (guest-video-policy.mjs); otherwise the popup shows the local thumbnail, the
// existing Cookie choices control and the external link. Rules live in guest-video-policy.mjs; dialog behaviour
// (modal, focus trap, Escape, scroll lock, focus return) is the kit's useDialog.

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDialog } from "../../sections/interactive/useDialog";
import {
  CLOSED, consentGranted, filmIdFromHref, interceptsClick, openCookieSettings, playerSrc, reduce, routeAllowed, watchHref,
} from "./guest-video-policy.mjs";
import css from "./GuestVideoDialog.module.css";

// The same module instances public/consent/bridge.mjs imports (same URLs), read-only. Not bundled.
const CC_URL = "/consent/vendor/cookieconsent.esm.js";
const POLICY_URL = "/consent/policy.mjs";
type ConsentApis = { cc: unknown; policy: unknown };
let consentApis: ConsentApis | null = null;
let consentLoad: Promise<void> | null = null;
function loadConsentApis(): Promise<void> {
  consentLoad ??= Promise.all([import(/* webpackIgnore: true */ CC_URL), import(/* webpackIgnore: true */ POLICY_URL)])
    .then(([cc, policy]) => { consentApis = { cc, policy }; })
    .catch(() => { consentApis = null; });
  return consentLoad;
}

function currentGrant(): boolean {
  if (!consentApis) return false;
  let storage: Storage | undefined;
  try { storage = window.localStorage; } catch { storage = undefined; }
  const w = window as unknown as { AHV_COOKIE_SETTINGS?: unknown };
  return consentGranted({
    cc: consentApis.cc, policy: consentApis.policy, storage,
    gpc: (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true,
    settingsReady: typeof w.AHV_COOKIE_SETTINGS === "function",
    now: Date.now(),
  });
}

function currentRouteOk(): boolean {
  return routeAllowed(window.location.pathname, document.documentElement.lang);
}

/** A same-origin thumbnail already on the card; never a remote image. */
function localThumb(link: Element): string | null {
  const img = link.querySelector("img");
  const src = img?.currentSrc || img?.getAttribute("src") || "";
  try { return src && new URL(src, window.location.href).origin === window.location.origin ? src : null; } catch { return null; }
}

type Open = { thumb: string | null; host: Element };

export default function GuestVideoDialog() {
  const [state, dispatch] = useReducer(reduce, CLOSED);
  const [open, setOpen] = useState<Open | null>(null);
  const [settingsUnavailable, setSettingsUnavailable] = useState(false);
  const pendingSettings = useRef(false);
  const gpc = useRef(false);
  const isOpen = state.kind !== "closed";

  const close = useCallback(() => dispatch({ type: "close" }), []);
  const { ref, trapKeyDown, setTrigger, dialogProps } = useDialog(isOpen, close);

  // Card clicks: only on the 13 routes, checked at mount and again on every click.
  useEffect(() => {
    if (!currentRouteOk()) return;
    void loadConsentApis();
    const onClick = (e: MouseEvent) => {
      if (!interceptsClick(e) || typeof window.HTMLDialogElement !== "function" || !currentRouteOk()) return;
      const link = e.target instanceof Element ? e.target.closest("a.lp-pstory") : null;
      if (!link || !link.closest(".lp-pstories")) return;
      const id = filmIdFromHref(link.getAttribute("href"));
      if (!id) return;
      e.preventDefault();
      gpc.current = (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
      setSettingsUnavailable(false);
      setTrigger(link);
      setOpen({ thumb: localThumb(link), host: link.closest(".lp-prod") ?? document.body });
      dispatch({
        type: "open", id, routeOk: true, granted: currentGrant(),
        title: link.querySelector(".lp-pstory__title")?.textContent ?? "",
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [setTrigger]);

  // While open: consent withdrawal/expiry and leaving the route (or locale) end playback; navigation closes.
  useEffect(() => {
    if (!isOpen) return;
    const recheck = () => {
      dispatch({ type: "route", routeOk: currentRouteOk() });
      dispatch({ type: "consent", granted: currentGrant() });
    };
    const onLeave = () => dispatch({ type: "close" });
    const consentEvents = ["cc:onChange", "cc:onConsent", "storage", "focus"];
    consentEvents.forEach((n) => window.addEventListener(n, recheck));
    document.addEventListener("visibilitychange", recheck);
    window.addEventListener("popstate", onLeave);
    window.addEventListener("pagehide", onLeave);
    const lang = new MutationObserver(recheck);
    lang.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    const timer = window.setInterval(recheck, 1000);
    return () => {
      consentEvents.forEach((n) => window.removeEventListener(n, recheck));
      document.removeEventListener("visibilitychange", recheck);
      window.removeEventListener("popstate", onLeave);
      window.removeEventListener("pagehide", onLeave);
      lang.disconnect();
      window.clearInterval(timer);
    };
  }, [isOpen]);

  // Cookie choices open only after this modal has closed (a modal dialog would make them inert).
  useEffect(() => {
    if (isOpen || !pendingSettings.current) return;
    pendingSettings.current = false;
    openCookieSettings(window);
  }, [isOpen]);

  const chooseSettings = () => {
    if (typeof (window as unknown as { AHV_COOKIE_SETTINGS?: unknown }).AHV_COOKIE_SETTINGS !== "function") {
      setSettingsUnavailable(true);
      return;
    }
    pendingSettings.current = true;
    close();
  };

  if (state.kind === "closed" || !open) return null;
  const src = playerSrc(state);
  const external = watchHref(state.id);

  return createPortal(
    <dialog
      ref={ref}
      {...dialogProps}
      className={css.dialog}
      aria-labelledby="lp-gvideo-h"
      onKeyDown={trapKeyDown}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className={css.top}>
        <h2 id="lp-gvideo-h" className={css.heading}>{state.title}</h2>
        <button type="button" className={css.close} onClick={close} aria-label="Close video" data-autofocus>
          Close <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className={css.screen}>
        {src ? (
          <iframe
            className={css.frame}
            src={src}
            title={state.title}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className={css.facade}>
            {/* The card's own local thumbnail, already loaded (next/image would re-request it at another size). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {open.thumb ? <img className={css.thumb} src={open.thumb} alt="" /> : null}
            <div className={css.note}>
              <p>This video is hosted on YouTube.</p>
              {gpc.current ? (
                <p>Your browser sends Global Privacy Control, so the video does not play on this page. You can watch it on YouTube instead.</p>
              ) : (
                <>
                  <p>To play it on this page, allow Analytics and Advertising in Cookie choices, then select the video again. Until then, nothing is loaded from YouTube.</p>
                  <button type="button" className={css.action} onClick={chooseSettings}>Cookie choices</button>
                  {settingsUnavailable ? <p role="status">Cookie choices are not available right now. You can watch the video on YouTube instead.</p> : null}
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <div className={css.bottom}>
        <a className={css.link} href={external} target="_blank" rel="noopener noreferrer">
          Watch on YouTube<span className="lp-sr"> (opens in a new tab)</span> <span aria-hidden="true">↗</span>
        </a>
      </div>
    </dialog>,
    open.host,
  );
}
