"use client";

// "Ask anything" (Mobile-Hero.dc.html sheet; Main.dc.html floating button). One dialog for the whole page:
//   - mobile: a bottom sheet, opened by the bar's Ask tile ([data-ask-open]);
//   - desktop: a floating "Ask anything" button at the bottom inline-end opens an anchored panel;
//   - every href="#chat" on the page (Success screen, handoff links) opens it too — one delegated click
//     listener, no hash navigation.
// Rows: Chat here now · WhatsApp · Instagram message · Facebook Messenger · Call. 54px each.
//
// "Chat here now": onChatOpen("ask_sheet"), then the chat vendor (INTEGRATIONS.chat, passed from the server)
// is loaded ON THIS CLICK ONLY — never on idle or scroll. EU/UK visitors without a granted consent record are
// asked first. With no vendor configured the row is a WhatsApp link instead.
//
// This component also keeps the mobile bar ([data-lp-bar]) out of the way: the bar is `hidden` while focus is
// inside #enquiry, so it can never cover the focused field (WCAG 2.4.11).

import { useCallback, useEffect, useState } from "react";
import { contact } from "../../../campaign-v110/lib/site.ts";
import { CHATBASE_PRIYA_BOT_ID } from "@kairali/chat";
import { onChatOpen } from "../../integrations/chat.ts";
import { consentAllowsNonCm } from "../../integrations/consent.ts";
import { useDialog } from "./useDialog";
import { WaIcon, PhoneIcon } from "../icons";

export type ChatSlot = { provider: string; widgetId: string };

const IG = "https://ig.me/m/kairaliayurvedichealingvillage";
const FB = "https://m.me/KairaliTheAyurvedicHealingVillage";
export const AI_LINE = "Pick the app you already use. Our AI assistant answers instantly; the patient team follows up.";

const ChatIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 5h16v11H8l-4 4z" /><path d="M8 9.5h8M8 12.5h5" /></svg>
);
const Close = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
);

type ChatWindow = Window & {
  embeddedChatbotConfig?: { chatbotId: string; domain: string };
  chatbase?: ((...args: unknown[]) => unknown) & { q?: unknown[] };
};

/** Known vendors. Unknown or empty provider → null (the row falls back to WhatsApp). */
function vendorFor(slot: ChatSlot): "chatbase" | null {
  return slot.provider.trim().toLowerCase() === "chatbase" ? "chatbase" : null;
}

/** How long the vendor gets to load and open before we offer WhatsApp instead. */
const CHAT_TIMEOUT_MS = 6000;

/**
 * Open the Chatbase bubble; inject the embed first if needed (same mechanics as @kairali/chat's loader).
 * Calls onFail once if the script errors, or if nothing has opened within CHAT_TIMEOUT_MS — so the visitor is
 * never left at a dead end.
 */
function openChatbase(widgetId: string, onFail: () => void) {
  const w = window as ChatWindow;
  const id = widgetId || CHATBASE_PRIYA_BOT_ID;
  let settled = false;
  let poll: number | undefined;
  const timer = window.setTimeout(() => fail(), CHAT_TIMEOUT_MS);
  function done() {
    settled = true;
    window.clearTimeout(timer);
    if (poll !== undefined) window.clearInterval(poll);
  }
  function fail() {
    if (settled) return;
    done();
    onFail();
  }
  const tryOpen = () => {
    if (settled) return true;
    try {
      const b = document.getElementById("chatbase-bubble-button");
      if (typeof w.chatbase === "function" || b) {
        if (typeof w.chatbase === "function") w.chatbase("open"); else b?.click();
        done();
        // The vendor's own bubble takes the bottom inline-end corner from now on (sections.css hides our button).
        document.documentElement.setAttribute("data-lp-chat", "");
        return true;
      }
    } catch { /* vendor API changed: keep polling until the timeout */ }
    return false;
  };
  const existing = document.getElementById(id);
  if (existing) {
    if (!tryOpen()) poll = window.setInterval(tryOpen, 250);
    return;
  }
  if (!document.getElementById("kairali-chat-coexistence")) {
    const style = document.createElement("style");
    style.id = "kairali-chat-coexistence";
    style.textContent = "@media (max-width: 767px) { #chatbase-message-bubbles { display: none !important; } }";
    document.head.appendChild(style);
  }
  w.embeddedChatbotConfig = { chatbotId: id, domain: "www.chatbase.co" };
  const s = document.createElement("script");
  s.src = "https://www.chatbase.co/embed.min.js";
  s.id = id;
  s.setAttribute("domain", "www.chatbase.co");
  s.defer = true;
  // The bubble renders a moment after the script runs: poll until it can be opened (or the timeout fires).
  s.onload = () => { if (!tryOpen()) poll = window.setInterval(tryOpen, 250); };
  s.onerror = () => { s.remove(); fail(); };
  document.body.appendChild(s);
}

function useBarYieldsToForm() {
  useEffect(() => {
    const inEnquire = (n: EventTarget | null) => n instanceof Element && !!n.closest("#enquiry");
    const setHidden = (h: boolean) => {
      document.querySelectorAll<HTMLElement>("[data-lp-bar]").forEach((b) => { b.hidden = h; });
    };
    const onIn = (e: FocusEvent) => setHidden(inEnquire(e.target));
    const onOut = (e: FocusEvent) => { if (!inEnquire(e.relatedTarget)) setHidden(false); };
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
      setHidden(false);
    };
  }, []);
}

/**
 * Publishes the mobile bar's real height (incl. its safe-area padding) as --lp-bar-h on <html>, so the page's
 * bottom padding, scroll padding, the consent banner and a chat bubble clear it even when large system text
 * wraps the label to 2–3 lines. Without JS (or ResizeObserver) sections.css falls back to 73px + safe area.
 * A hidden bar (focus in #enquiry) measures 0 and is ignored, so the page does not jump.
 */
function useBarHeightVar() {
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>("[data-lp-bar]");
    if (!bar || typeof ResizeObserver !== "function") return;
    const root = document.documentElement;
    const update = () => {
      const h = bar.getBoundingClientRect().height;
      if (h > 0) root.style.setProperty("--lp-bar-h", `${Math.ceil(h)}px`);
    };
    const ro = new ResizeObserver(update);
    ro.observe(bar);
    update();
    return () => { ro.disconnect(); root.style.removeProperty("--lp-bar-h"); };
  }, []);
}

export default function AskAnything({ chat }: { chat: ChatSlot }) {
  const [open, setOpen] = useState(false);
  const [asking, setAsking] = useState(false);
  // Set when the chat vendor failed or never opened: the sheet reopens with a one-line notice, WhatsApp focused.
  const [unavailable, setUnavailable] = useState(false);
  const close = useCallback(() => { setOpen(false); setAsking(false); setUnavailable(false); }, []);
  const { ref, trapKeyDown, setTrigger, dialogProps } = useDialog(open, close);
  const vendor = vendorFor(chat);
  const wa = `https://wa.me/${contact.whatsapp.number}`;

  useBarYieldsToForm();
  useBarHeightVar();

  // Switching between the rows and the "ask first" prompt moves focus to the new first action.
  useEffect(() => {
    const d = ref.current;
    if (!d || !d.open) return;
    d.querySelector<HTMLElement>(asking ? "[data-autofocus]" : ".lp-ask__row--chat")?.focus();
  }, [asking, ref]);

  // After a chat failure the sheet reopens: focus the WhatsApp row (runs after useDialog's initial focus).
  useEffect(() => {
    if (!open || !unavailable) return;
    const t = window.setTimeout(() => ref.current?.querySelector<HTMLElement>(".lp-ask__row--wa")?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open, unavailable, ref]);

  // [data-ask-open] (bar tile) and every a[href="#chat"] open this dialog. Capture phase, before any
  // navigation; data-track on the clicked element still fires (integrations/dom.ts listens in capture too).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const t = e.target instanceof Element ? e.target.closest('[data-ask-open],a[href="#chat"]') : null;
      if (!t) return;
      e.preventDefault();
      setTrigger(t);
      setOpen(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [setTrigger]);

  const startChat = () => {
    onChatOpen("ask_sheet");
    if (vendor === "chatbase") {
      openChatbase(chat.widgetId, () => { setAsking(false); setUnavailable(true); setOpen(true); });
    }
    close();
  };
  const onChatRow = () => {
    let ok = false;
    try { ok = consentAllowsNonCm(window as unknown as Parameters<typeof consentAllowsNonCm>[0]); } catch { ok = false; }
    if (ok) startChat(); else setAsking(true);
  };

  return (
    <>
      <button type="button" className="lp-ask__fab" aria-haspopup="dialog" data-ask-open
        data-track="cta_click" data-track-cta="ask" data-track-position="sticky">
        <ChatIcon />Ask anything
      </button>
      <dialog ref={ref} className="lp-dlg lp-dlg--sheet lp-ask" aria-labelledby="lp-ask-h" {...dialogProps}
        onKeyDown={trapKeyDown} onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
        {open ? (
          <div className="lp-dlg__inner">
            <div className="lp-dlg__head">
              <h2 id="lp-ask-h" className="lp-dlg__title">Ask anything</h2>
              <button type="button" className="lp-dlg__close" aria-label="Close" onClick={close}><Close /></button>
            </div>
            {asking ? (
              <div className="lp-ask__consent" role="group" aria-labelledby="lp-ask-consent">
                <p id="lp-ask-consent" className="lp-ask__consent-text">Chat is provided by our chat partner. Open it?</p>
                <button type="button" className="lp-ask__row lp-ask__row--chat" data-autofocus onClick={startChat}>Open</button>
                <button type="button" className="lp-ask__row" onClick={() => setAsking(false)}>Cancel</button>
              </div>
            ) : (
              <>
                {unavailable ? (
                  <p className="lp-ask__unavailable" role="alert">Chat is unavailable right now — WhatsApp us instead.</p>
                ) : null}
                <p className="lp-dlg__note">{AI_LINE}</p>
                <ul className="lp-ask__rows">
                  <li>
                    {vendor ? (
                      <button type="button" className="lp-ask__row lp-ask__row--chat" onClick={onChatRow}><ChatIcon />Chat here now</button>
                    ) : (
                      <a className="lp-ask__row lp-ask__row--chat" href={wa} target="_blank" rel="noopener noreferrer"
                        data-track="cta_click" data-track-cta="whatsapp" data-track-position="ask">
                        <ChatIcon />Chat here now
                      </a>
                    )}
                  </li>
                  <li>
                    <a className="lp-ask__row lp-ask__row--wa" href={wa} target="_blank" rel="noopener noreferrer"
                      data-track="cta_click" data-track-cta="whatsapp" data-track-position="ask"><WaIcon size={20} />WhatsApp</a>
                  </li>
                  <li>
                    <a className="lp-ask__row" href={IG} target="_blank" rel="noopener noreferrer"
                      data-track="cta_click" data-track-cta="instagram" data-track-position="ask">Instagram message</a>
                  </li>
                  <li>
                    <a className="lp-ask__row" href={FB} target="_blank" rel="noopener noreferrer"
                      data-track="cta_click" data-track-cta="messenger" data-track-position="ask">Facebook Messenger</a>
                  </li>
                  <li>
                    <a className="lp-ask__row" href={contact.phone.href}
                      data-track="cta_click" data-track-cta="call" data-track-position="ask"><PhoneIcon size={20} />Call {contact.phone.display}</a>
                  </li>
                </ul>
              </>
            )}
          </div>
        ) : null}
      </dialog>
    </>
  );
}
