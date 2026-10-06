"use client";
// Consent-aware measurement (production only). IDs come from env; nothing loads in local/preview builds.
// - GTM set  -> GTM only (GA4 should then be configured inside the container; no duplicate direct gtag).
// - GA4 only -> direct gtag.js.
// Consent Mode defaults to denied; tags load only after the visitor accepts. No form field values or
// health information are ever sent: this site sends page views only.
import { useEffect, useState } from "react";
import { readStoredChoice } from "@kairali/consent";

type Props = { enabled: boolean; ga4?: string; gtm?: string; clarity?: string };

function load(src: string) { const s = document.createElement("script"); s.async = true; s.src = src; document.head.appendChild(s); }

export default function Analytics({ enabled, ga4, gtm, clarity }: Props) {
  const [choice, setChoice] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const active = enabled && !!(ga4 || gtm || clarity);

  useEffect(() => {
    if (!active) return;
    const syncChoice = () => setChoice(readStoredChoice(window.localStorage)?.granted ?? null);
    syncChoice();
    const observer = new MutationObserver(syncChoice);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-consent-open"] });
    setReady(true);
    return () => observer.disconnect();
  }, [active]);

  useEffect(() => {
    if (!active || choice !== true) return;
    const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void };
    w.dataLayer = w.dataLayer || [];
    w.gtag = function gtag() { // eslint-disable-next-line prefer-rest-params
      w.dataLayer.push(arguments); };
    w.gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" });
    w.gtag("consent", "update", { analytics_storage: "granted" });
    if (gtm) {
      w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      load(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtm)}`);
    } else if (ga4) {
      w.gtag("js", new Date());
      w.gtag("config", ga4, { anonymize_ip: true });
      load(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4)}`);
    }
    if (clarity) load(`https://www.clarity.ms/tag/${encodeURIComponent(clarity)}`);
  }, [active, choice, ga4, gtm, clarity]);

  if (!active || !ready || choice !== true) return null;
  return null;
}
