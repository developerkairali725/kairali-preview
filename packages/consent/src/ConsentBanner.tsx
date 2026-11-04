"use client";
// Interactivity is the point: the banner reads/writes the visitor's stored
// choice and fires gtag consent updates on click.

import { useEffect, useState } from "react";
import { readStoredChoice, applyChoice } from "./core.js";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Consent banner (Google Consent Mode v2, default denied — Ship Gate A12).
 * Brand-token styling only; pill buttons per Manual ch.07. Decline is as
 * prominent as accept (privacy-preserving default, PROJECT_CONTEXT §4.4).
 *
 * @param privacyHref link to the entity's privacy page. Until the page
 * exists the caller may omit it — the banner then shows no link and Ship
 * Gate A12 ("privacy/terms pages per entity") stays a visible launch gap.
 */
export function ConsentBanner({ privacyHref }: { privacyHref?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = readStoredChoice(window.localStorage);
    if (stored === null) {
      const gpc = typeof navigator !== "undefined" && (navigator as unknown as { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
      if (gpc) {
        applyChoice(false, { storage: window.localStorage, gtagFn: window.gtag });
        setVisible(false);
        return;
      }
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, []);

  useEffect(() => {
    const handleReopen = () => setVisible(true);
    window.addEventListener("kairali:reopen-consent", handleReopen);
    return () => window.removeEventListener("kairali:reopen-consent", handleReopen);
  }, []);

  // Signal other floating UI (chat bubble, sticky bars) to yield while the
  // banner is open — sites style [data-consent-open] as needed.
  useEffect(() => {
    if (visible) document.documentElement.setAttribute("data-consent-open", "");
    else document.documentElement.removeAttribute("data-consent-open");
    return () => document.documentElement.removeAttribute("data-consent-open");
  }, [visible]);

  if (!visible) return null;

  const choose = (granted: boolean) => {
    applyChoice(granted, { storage: window.localStorage, gtagFn: window.gtag });
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      data-consent-banner
      style={{
        position: "fixed",
        insetInline: 0,
        bottom: 0,
        zIndex: 60,
        background: "var(--card-bg, #fff)" /* brand-allow: rogue-hex — token fallback only */,
        borderTop: "1px solid var(--leaf-500)",
        boxShadow: "var(--shadow-warm)",
        padding: "16px",
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-body)",
        color: "var(--ink)",
      }}
    >
      <p style={{ margin: 0, maxWidth: "52ch", fontSize: "0.9375rem" }}>
        We use cookies for analytics and to improve your experience. Nothing is
        stored until you choose.{" "}
        {privacyHref ? (
          <a href={privacyHref} style={{ color: "var(--forest-500)" }}>
            Privacy policy
          </a>
        ) : null}
      </p>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          type="button"
          onClick={() => choose(false)}
          style={{
            minHeight: "44px",
            padding: "0 20px",
            borderRadius: "var(--radius-pill)",
            border: "1.5px solid var(--forest-500)",
            background: "transparent",
            color: "var(--forest-500)",
            font: "600 0.9375rem var(--font-body)",
            cursor: "pointer",
          }}
        >
          Essential only
        </button>
        <button
          type="button"
          onClick={() => choose(true)}
          style={{
            minHeight: "44px",
            padding: "0 20px",
            borderRadius: "var(--radius-pill)",
            border: "1.5px solid var(--forest-500)",
            background: "var(--forest-500)",
            color: "var(--ivory)",
            font: "600 0.9375rem var(--font-body)",
            cursor: "pointer",
          }}
        >
          Accept all
        </button>
      </div>
    </div>
  );
}
