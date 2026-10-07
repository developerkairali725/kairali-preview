"use client";

import { useRef } from "react";
import { CONTACT_DIALOG_ID, openExistingChatChoices } from "./interaction-map.ts";

/**
 * "Ask Anything" on the live ad routes opens the site's existing chat choices, built by
 * public/design/review-chrome.js (#ahv-contact-controls: WhatsApp us, Chat with Priya on the existing Chatbase
 * bot, Instagram, Facebook Messenger). Same flow as the header Chat control: it clicks that control when it is
 * present, else opens the dialog itself. No chat vendor, channel or tag is added here.
 */
export default function AskAnythingButton({ className, label }: { className: string; label: string }) {
  const waiting = useRef<number | null>(null);
  const onClick = () => {
    if (openExistingChatChoices(document)) return;
    // review-chrome.js builds the dialog right after load; give it a moment rather than failing silently.
    if (waiting.current !== null) return;
    let tries = 0;
    waiting.current = window.setInterval(() => {
      tries += 1;
      if (openExistingChatChoices(document) || tries >= 20) {
        if (waiting.current !== null) window.clearInterval(waiting.current);
        waiting.current = null;
      }
    }, 150);
  };
  return (
    <button type="button" className={className} aria-haspopup="dialog" aria-controls={CONTACT_DIALOG_ID} onClick={onClick}>
      {label}
    </button>
  );
}
