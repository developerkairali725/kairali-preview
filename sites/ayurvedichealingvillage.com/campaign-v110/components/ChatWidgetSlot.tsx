import styles from "./ChatWidgetSlot.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// Chat widget slot — intentionally empty.
//
// On import into the main site, insert the Priya / WhatsApp chat script here.
// The live pages load https://chat.kairali.com/embed.min.js with the
// attributes chatbotId "rpNt_uRW6W8EDiTf6AvYJ" and domain "chat.kairali.com".
//
// Staging also rendered floating "WhatsApp us" and "Chat with Priya" buttons
// (#ahv-contact-controls from chrome.js) that covered page text on phones.
// They are not rebuilt: the chat launcher belongs here, and WhatsApp stays
// beside the form's submit button only.
//
// Use next/script (strategy="lazyOnload") and point the widget's launcher at
// this container, or position it with the same offsets, so it sits above the
// sticky mobile bar (bottom = var(--mobile-bar-h) + 16px) and never covers it.
// ─────────────────────────────────────────────────────────────────────────────

export default function ChatWidgetSlot() {
  return <div id="chat-widget-slot" className={styles.slot} aria-hidden="true" />;
}
