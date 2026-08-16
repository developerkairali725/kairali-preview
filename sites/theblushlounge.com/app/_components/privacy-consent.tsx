"use client";

import Script from "next/script";
import { useCallback, useEffect, useState } from "react";

const CONSENT_STORAGE_KEY = "blush-analytics-consent-v1";
// The Measurement ID is public configuration, not a secret. Keeping the
// Blush-specific default with this isolated consent component prevents CI and
// one-off production builds from silently shipping an unconfigured tracker.
const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_ID?.trim() || "G-6K7HVLYXZQ";
const GA4_ID = /^G-[A-Z0-9]+$/i.test(MEASUREMENT_ID) ? MEASUREMENT_ID : null;
const SIXTY_DAYS_SECONDS = 60 * 24 * 60 * 60;

type AnalyticsChoice = "granted" | "denied";
type StoredChoice = { v: 1; analytics: AnalyticsChoice; at: string };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function ensureGtag() {
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = window.gtag ?? ((...args: unknown[]) => window.dataLayer?.push(args));
}

function updateGoogleConsent(choice: AnalyticsChoice) {
  ensureGtag();
  window.gtag?.("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: choice,
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
  });
}

function readStoredChoice(): AnalyticsChoice | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredChoice>;
    return parsed.v === 1 && (parsed.analytics === "granted" || parsed.analytics === "denied")
      ? parsed.analytics
      : null;
  } catch {
    return null;
  }
}

function storeChoice(choice: AnalyticsChoice) {
  const record: StoredChoice = { v: 1, analytics: choice, at: new Date().toISOString() };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Private browsing can block storage; the in-memory choice still applies.
  }
}

function clearGoogleAnalyticsCookies() {
  const names = document.cookie
    .split(";")
    .map((part) => part.split("=")[0]?.trim())
    .filter((name): name is string => Boolean(name))
    .filter((name) => name === "_ga" || name.startsWith("_ga_") || name === "_gid" || name === "_gat");

  const hostname = window.location.hostname;
  for (const name of names) {
    const expiry = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    document.cookie = expiry;
    document.cookie = `${expiry}; domain=${hostname}`;
    document.cookie = `${expiry}; domain=.${hostname}`;
  }
}

export function PrivacyConsent() {
  const [choice, setChoice] = useState<AnalyticsChoice | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = readStoredChoice();
    setChoice(stored);
    setOpen(stored === null);
    setReady(true);
  }, []);

  useEffect(() => {
    const openSettings = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest("[data-consent-settings]")) return;
      event.preventDefault();
      setOpen(true);
    };
    document.addEventListener("click", openSettings);
    return () => document.removeEventListener("click", openSettings);
  }, []);

  useEffect(() => {
    if (open) document.documentElement.setAttribute("data-consent-open", "");
    else document.documentElement.removeAttribute("data-consent-open");
    return () => document.documentElement.removeAttribute("data-consent-open");
  }, [open]);

  useEffect(() => {
    if (choice !== "granted" || !GA4_ID) return;

    const trackCta = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const cta = target.closest<HTMLElement>("[data-cta]");
      const eventName = cta?.dataset.cta;
      if (!eventName || !/^[a-z0-9_]+$/i.test(eventName)) return;
      ensureGtag();
      window.gtag?.("event", eventName, {
        event_category: "engagement",
        page_path: window.location.pathname,
      });
    };

    document.addEventListener("click", trackCta, { capture: true });
    return () => document.removeEventListener("click", trackCta, { capture: true });
  }, [choice]);

  const choose = useCallback((nextChoice: AnalyticsChoice) => {
    storeChoice(nextChoice);
    updateGoogleConsent(nextChoice);
    if (nextChoice === "denied") clearGoogleAnalyticsCookies();
    setChoice(nextChoice);
    setOpen(false);
  }, []);

  const configureAnalytics = useCallback(() => {
    if (!GA4_ID) return;
    updateGoogleConsent("granted");
    window.gtag?.("js", new Date());
    window.gtag?.("set", "allow_google_signals", false);
    window.gtag?.("set", "allow_ad_personalization_signals", false);
    window.gtag?.("config", GA4_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: SIXTY_DAYS_SECONDS,
      cookie_flags: "SameSite=Lax;Secure",
      send_page_view: true,
      transport_type: "beacon",
    });
  }, []);

  return (
    <>
      {choice === "granted" && GA4_ID ? (
        <Script
          id="blush-ga4-loader"
          data-analytics-loader
          src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`}
          strategy="afterInteractive"
          onLoad={configureAnalytics}
        />
      ) : null}

      {ready && open ? (
        <section
          className="consent"
          role="dialog"
          aria-modal="false"
          aria-labelledby="consent-title"
          data-consent-banner
        >
          <div className="consent__copy">
            <strong id="consent-title">Your privacy, your choice</strong>
            <p>
              Google Analytics is off unless you allow it. Essential site features still work either
              way. Read the <a href="/privacy">privacy notice</a> and{" "}
              <a href="/cookie-policy">cookie details</a>.
            </p>
          </div>
          <div className="consent__actions">
            <button type="button" className="consent__button consent__button--quiet" onClick={() => choose("denied")}>
              Essential only
            </button>
            <button type="button" className="consent__button consent__button--allow" onClick={() => choose("granted")}>
              Allow analytics
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}
