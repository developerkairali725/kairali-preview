"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useState } from "react";

import { hrefFor, type Locale } from "@/lib/i18n";

const CONSENT_KEY = "abhilashkr-analytics-consent";
const RAW_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
const MEASUREMENT_ID = /^G-[A-Z0-9]+$/i.test(RAW_MEASUREMENT_ID)
  ? RAW_MEASUREMENT_ID
  : null;
const SIXTY_DAYS_SECONDS = 60 * 24 * 60 * 60;

type AnalyticsChoice = "granted" | "denied";
type StoredChoice = { v: 1; analytics: AnalyticsChoice; at: string };

const COPY: Record<
  Locale,
  { title: string; body: string; privacy: string; deny: string; allow: string }
> = {
  en: {
    title: "Your privacy, your choice",
    body: "Google Analytics stays off unless you allow it. Essential site features work either way.",
    privacy: "Privacy notice",
    deny: "Necessary only",
    allow: "Allow analytics",
  },
  de: {
    title: "Ihre Privatsphäre, Ihre Wahl",
    body: "Google Analytics bleibt ausgeschaltet, bis Sie es erlauben. Notwendige Website-Funktionen arbeiten in beiden Fällen.",
    privacy: "Datenschutzhinweis",
    deny: "Nur notwendig",
    allow: "Analyse erlauben",
  },
  fr: {
    title: "Votre confidentialité, votre choix",
    body: "Google Analytics reste désactivé tant que vous ne l’autorisez pas. Les fonctions essentielles du site restent disponibles.",
    privacy: "Avis de confidentialité",
    deny: "Nécessaire uniquement",
    allow: "Autoriser la mesure",
  },
};

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
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    if (raw === "granted" || raw === "denied") return raw;

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
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  } catch {
    // The in-memory choice still applies when private browsing blocks storage.
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

export function Analytics({ locale }: { locale: Locale }) {
  const [choice, setChoice] = useState<AnalyticsChoice | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const copy = COPY[locale];

  useEffect(() => {
    const stored = readStoredChoice();
    queueMicrotask(() => {
      setChoice(stored);
      setOpen(stored === null);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    const openSettings = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest("[data-analytics-settings]")) return;
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

  const choose = useCallback((nextChoice: AnalyticsChoice) => {
    storeChoice(nextChoice);
    updateGoogleConsent(nextChoice);
    if (nextChoice === "denied") clearGoogleAnalyticsCookies();
    setChoice(nextChoice);
    setOpen(false);
  }, []);

  const configureAnalytics = useCallback(() => {
    if (!MEASUREMENT_ID) return;
    updateGoogleConsent("granted");
    window.gtag?.("js", new Date());
    window.gtag?.("set", "allow_google_signals", false);
    window.gtag?.("set", "allow_ad_personalization_signals", false);
    window.gtag?.("config", MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      anonymize_ip: true,
      cookie_expires: SIXTY_DAYS_SECONDS,
      cookie_flags: "SameSite=Lax;Secure",
      send_page_view: true,
      transport_type: "beacon",
    });
  }, []);

  if (!MEASUREMENT_ID) return null;

  return (
    <>
      {choice === "granted" ? (
        <Script
          id="abhilashkr-ga4-loader"
          data-analytics-loader
          src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`}
          strategy="afterInteractive"
          onReady={configureAnalytics}
        />
      ) : null}

      {ready && open ? (
        <section
          aria-labelledby="analytics-consent-title"
          aria-modal="false"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl border border-border bg-background p-4 shadow-lg"
          data-consent-banner
          role="dialog"
        >
          <div>
            <strong id="analytics-consent-title" className="font-display text-xl text-ink">
              {copy.title}
            </strong>
            <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">
              {copy.body}{" "}
              <Link href={hrefFor(locale, "privacy")} className="text-ink underline underline-offset-4">
                {copy.privacy}
              </Link>
              .
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-widest">
            <button
              type="button"
              onClick={() => choose("denied")}
              className="min-h-11 border border-border px-4 py-2 text-ink hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {copy.deny}
            </button>
            <button
              type="button"
              onClick={() => choose("granted")}
              className="min-h-11 border border-primary bg-primary px-4 py-2 text-background hover:bg-transparent hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {copy.allow}
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}
