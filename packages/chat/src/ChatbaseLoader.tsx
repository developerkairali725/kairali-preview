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
// verified in the pilot's security audit is preserved. NOTE (pre-existing,
// unchanged here): the Chatbase embed itself is not Consent-Mode-aware; gating
// its injection on the stored consent state is a tracked follow-up, not
// something this hoist silently changes.

import { useEffect } from "react";

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
}: {
  /** Override when a site moves to its ENTITY bot (registry: chatbase-entity-bot). */
  chatbotId?: string;
} = {}) {
  useEffect(() => {
    if (document.getElementById(chatbotId)) return;
    let loaded = false;
    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    const cleanup = () =>
      events.forEach((e) => window.removeEventListener(e, load));

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

    events.forEach((e) =>
      window.addEventListener(e, load, { once: true, passive: true })
    );
    const idle = window.setTimeout(load, 6000);

    return () => {
      cleanup();
      window.clearTimeout(idle);
    };
  }, [chatbotId]);

  return null;
}
