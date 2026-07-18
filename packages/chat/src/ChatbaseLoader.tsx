"use client";
// "use client" justification: Chatbase is a browser-only third-party embed.
// It is injected AFTER first user interaction (or a 6s idle fallback) so it
// never competes with LCP (docs/ENGINEERING_STANDARDS.md performance budgets).
//
// HOISTED 2026-07-18 from the four identical per-site copies
// (sites/{kairali.com,kairalicenters.com,arogyakendra.com,whatisayurveda.com}/
// app/chatbase-loader.tsx) — the Factory rule is packages/* only, no
// copy-pasted components. Load mechanics are UNCHANGED from those copies.
// Fleet-wide mandate: D-20260718-05 (chat bubble on every Factory site).
//
// CONSENT ORDERING CONTRACT: layouts render <ConsentScripts/> (default-DENIED
// Consent Mode v2, @kairali/consent) in <head>, BEFORE any loader — this
// component renders at the end of <body>, so the denied-before-loaders order
// verified in the pilot's security audit is preserved.
//
// CONSENT GATE (the tracked follow-up, landed 2026-07-18): the Chatbase embed
// is not Consent-Mode-aware and writes its own storage on load, so an OPT-IN
// `consentGated` mode defers injection until the visitor has ANSWERED the
// @kairali/consent banner (any choice — the bubble itself is mandatory,
// D-20260718-05; what is gated is the third-party load, which keeps the
// banner's "Nothing is stored until you choose." literally true). Default is
// UNCHANGED for existing fleet sites — turning them on is a per-site,
// reviewed change, never a silent one. First consumer: kairaliequipment.com.

import { useEffect } from "react";
import { readStoredChoice } from "@kairali/consent";

// Interim Priya bot per DECISIONS.md 2026-07-13 18:51 IST — replaced by the
// four entity bots later (gates/registry.yaml: chatbase-entity-bot).
export const CHATBASE_PRIYA_BOT_ID = "rpNt_uRW6W8EDiTf6AvYJ";

declare global {
  interface Window {
    embeddedChatbotConfig?: { chatbotId: string; domain: string };
  }
}

export function ChatbaseLoader({
  chatbotId = CHATBASE_PRIYA_BOT_ID,
  consentGated = false,
}: {
  /** Override when a site moves to its ENTITY bot (registry: chatbase-entity-bot). */
  chatbotId?: string;
  /** Defer third-party injection until the consent banner has been ANSWERED
   *  (any choice). Opt-in per site — the fleet default is unchanged. */
  consentGated?: boolean;
} = {}) {
  useEffect(() => {
    if (document.getElementById(chatbotId)) return;
    let loaded = false;
    let armed = false;
    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    let idle: number | undefined;
    let observer: MutationObserver | undefined;

    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, load));
      if (idle !== undefined) window.clearTimeout(idle);
      observer?.disconnect();
    };

    function load() {
      if (loaded) return;
      loaded = true;
      cleanup();
      window.embeddedChatbotConfig = {
        chatbotId,
        domain: "www.chatbase.co",
      };
      const s = document.createElement("script");
      s.src = "https://www.chatbase.co/embed.min.js";
      s.id = chatbotId;
      s.setAttribute("domain", "www.chatbase.co");
      s.defer = true;
      document.body.appendChild(s);
    }

    /** Interaction/idle arming — the original LCP-protecting mechanics. */
    function arm() {
      if (armed || loaded) return;
      armed = true;
      events.forEach((e) =>
        window.addEventListener(e, load, { once: true, passive: true })
      );
      idle = window.setTimeout(load, 6000);
    }

    if (!consentGated) {
      arm();
    } else if (readStoredChoice(window.localStorage) !== null) {
      // Returning visitor with a recorded choice: normal mechanics.
      arm();
    } else {
      // No choice yet: wait for the banner to close (it removes the
      // data-consent-open attribute on choice — the @kairali/consent yield
      // contract), then confirm a choice was actually stored before arming.
      observer = new MutationObserver(() => {
        if (
          !document.documentElement.hasAttribute("data-consent-open") &&
          readStoredChoice(window.localStorage) !== null
        ) {
          arm();
        }
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-consent-open"],
      });
    }

    return cleanup;
  }, [chatbotId, consentGated]);

  return null;
}
