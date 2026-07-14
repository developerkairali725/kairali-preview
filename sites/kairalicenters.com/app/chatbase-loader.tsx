"use client";
// "use client" justification: Chatbase is a browser-only third-party embed.
// It is injected AFTER first user interaction (or a 6s idle fallback) so it
// never competes with LCP (docs/ENGINEERING_STANDARDS.md performance budgets).
// Interim Priya bot per DECISIONS.md 2026-07-13 18:51 IST — replaced by the
// four entity bots later. NOTE: packages/consent is not built yet; when it
// lands, this loader gates behind consent like every third-party script.

import { useEffect } from "react";

const CHATBOT_ID = "rpNt_uRW6W8EDiTf6AvYJ"; // interim Priya bot (DECISIONS.md)

declare global {
  interface Window {
    embeddedChatbotConfig?: { chatbotId: string; domain: string };
  }
}

export default function ChatbaseLoader() {
  useEffect(() => {
    if (document.getElementById(CHATBOT_ID)) return;
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
        chatbotId: CHATBOT_ID,
        domain: "www.chatbase.co",
      };
      const s = document.createElement("script");
      s.src = "https://www.chatbase.co/embed.min.js";
      s.id = CHATBOT_ID;
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
  }, []);

  return null;
}
