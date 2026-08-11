"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useState } from "react";

const CONSENT_KEY = "abhilashkr-analytics-consent";

type AnalyticsConsent = "granted" | "denied" | null;

export function Analytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const [consent, setConsent] = useState<AnalyticsConsent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(CONSENT_KEY);
    queueMicrotask(() => {
      setConsent(saved === "granted" || saved === "denied" ? saved : null);
      setReady(true);
    });
  }, []);

  if (!measurementId || !ready) return null;

  const choose = (nextConsent: Exclude<AnalyticsConsent, null>) => {
    window.localStorage.setItem(CONSENT_KEY, nextConsent);
    setConsent(nextConsent);
  };

  return (
    <>
      {consent === "granted" ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}', { anonymize_ip: true });`}
          </Script>
        </>
      ) : null}

      {consent === null ? (
        <aside
          aria-label="Analytics preferences"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl border border-border bg-background p-4 shadow-lg"
        >
          <p className="font-sans text-sm leading-relaxed text-ink">
            This site uses optional Google Analytics only after you allow it. Read the{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              privacy notice
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-widest">
            <button
              type="button"
              onClick={() => choose("denied")}
              className="border border-border px-4 py-2 text-ink hover:border-primary"
            >
              Necessary only
            </button>
            <button
              type="button"
              onClick={() => choose("granted")}
              className="border border-primary bg-primary px-4 py-2 text-background hover:bg-transparent hover:text-primary"
            >
              Allow analytics
            </button>
          </div>
        </aside>
      ) : null}
    </>
  );
}
