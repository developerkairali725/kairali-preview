"use client";

// On-page player for the Stories film cards (DEC-GUEST-VIDEO-POPUP). Renders nothing on the server and nothing until a
// film is pressed, so the section's markup, links and thumbnails stay exactly as Stories.tsx renders them; without
// JavaScript, native modal <dialog> support, an allowed route or an approved film, a card stays the plain YouTube link
// it was. The YouTube (nocookie) player exists only in the "playing" state, reached by pressing a film while the
// visitor's current consent allows it; otherwise the popup shows the local thumbnail, the existing Cookie choices
// control and the external link. All behaviour outside rendering is createGuestVideoController (guest-video-policy.mjs);
// this file renders its snapshot and runs the native modal (page inert, Escape, Tab wrap, scroll lock, focus return).
// The kit's useDialog is not used: when showModal() fails it falls back to a non-modal open attribute, and this popup
// must instead keep the card's own link.

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { CLOSED_VIEW, createGuestVideoController, playerSrc, watchHref } from "./guest-video-policy.mjs";
import css from "./GuestVideoDialog.module.css";

// The same module instances public/consent/bridge.mjs imports (same URLs), read-only. Not bundled.
const CC_URL = "/consent/vendor/cookieconsent.esm.js";
const POLICY_URL = "/consent/policy.mjs";
const loadConsent = () =>
  Promise.all([import(/* webpackIgnore: true */ CC_URL), import(/* webpackIgnore: true */ POLICY_URL)])
    .then(([cc, policy]) => ({ cc, policy }));

type Controller = ReturnType<typeof createGuestVideoController>;
const noSubscribe = () => () => {};
const closedView = () => CLOSED_VIEW;
const FOCUSABLE = 'a[href],button:not([disabled]),iframe,[tabindex]:not([tabindex="-1"])';

export default function GuestVideoDialog() {
  const pathname = usePathname();
  const [ctl, setCtl] = useState<Controller | null>(null);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const c = createGuestVideoController({ win: window, doc: document, loadConsent });
    c.install();
    setCtl(c);
    return () => c.destroy();
  }, []);

  useEffect(() => { ctl?.setPathname(pathname); }, [ctl, pathname]);

  const view = useSyncExternalStore(ctl ? ctl.subscribe : noSubscribe, ctl ? ctl.getSnapshot : closedView, closedView);
  const film = view.film;
  const isOpen = film.kind !== "closed";

  useEffect(() => {
    const dlg = ref.current;
    if (!isOpen || !dlg || !ctl) return;
    try {
      dlg.showModal();
    } catch {
      ctl.modalFailed();
      return;
    }
    const html = document.documentElement;
    const saved = { html: html.style.overflow, body: document.body.style.overflow };
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    dlg.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const onCancel = (e: Event) => { e.preventDefault(); ctl.close(); };
    const onClose = () => ctl.close();
    dlg.addEventListener("cancel", onCancel);
    dlg.addEventListener("close", onClose);
    return () => {
      dlg.removeEventListener("cancel", onCancel);
      dlg.removeEventListener("close", onClose);
      try { if (dlg.open) dlg.close(); } catch { /* already detached */ }
      html.style.overflow = saved.html;
      document.body.style.overflow = saved.body;
      ctl.dialogClosed();
    };
  }, [isOpen, ctl]);

  const trapTab = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== "Tab" || !ref.current) return;
    const list = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.getClientRects().length > 0);
    if (!list.length) { e.preventDefault(); return; }
    const first = list[0];
    const last = list[list.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === ref.current)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
  };

  if (!ctl || film.kind === "closed" || !view.host) return null;
  const src = playerSrc(film);

  return createPortal(
    <dialog
      ref={ref}
      aria-modal="true"
      className={css.dialog}
      aria-labelledby="lp-gvideo-h"
      onKeyDown={trapTab}
      onClick={(e) => { if (e.target === e.currentTarget) ctl.close(); }}
    >
      <div className={css.top}>
        <h2 id="lp-gvideo-h" className={css.heading}>{film.title}</h2>
        <button type="button" className={css.close} onClick={ctl.close} aria-label="Close video" data-autofocus>
          Close <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className={css.screen}>
        {src ? (
          <iframe
            className={css.frame}
            src={src}
            title={film.title}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className={css.facade}>
            {/* The card's own local thumbnail, already loaded (next/image would re-request it at another size). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {view.thumb ? <img className={css.thumb} src={view.thumb} alt="" /> : null}
            <div className={css.note}>
              <p>This video is hosted on YouTube.</p>
              {view.gpc ? (
                <p>Your browser sends Global Privacy Control, so the video does not play on this page. You can watch it on YouTube instead.</p>
              ) : (
                <>
                  <p>To play it on this page, allow Analytics and Advertising in Cookie choices, then select the video again. Until then, nothing is loaded from YouTube.</p>
                  <button type="button" className={css.action} onClick={() => ctl.requestSettings()}>Cookie choices</button>
                  {view.settingsUnavailable ? <p role="status">Cookie choices are not available right now. You can watch the video on YouTube instead.</p> : null}
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <div className={css.bottom}>
        <a className={css.link} href={watchHref(film.id)} target="_blank" rel="noopener noreferrer">
          Watch on YouTube<span className="lp-sr"> (opens in a new tab)</span> <span aria-hidden="true">↗</span>
        </a>
      </div>
    </dialog>,
    view.host,
  );
}
