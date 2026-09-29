"use client";
// Consent-aware measurement (production only). IDs come from env; nothing loads in local/preview builds.
// - GTM set  -> GTM only (GA4 should then be configured inside the container; no duplicate direct gtag).
// - GA4 only -> direct gtag.js.
// Consent Mode defaults to denied; tags load only after the visitor accepts. No form field values or
// health information are ever sent: this site sends page views only.
import { useEffect, useState } from "react";

type Props = { enabled: boolean; ga4?: string; gtm?: string; clarity?: string };
const KEY = "kairali-analytics-consent";

function load(src: string) { const s = document.createElement("script"); s.async = true; s.src = src; document.head.appendChild(s); }

export default function Analytics({ enabled, ga4, gtm, clarity }: Props) {
  const [choice, setChoice] = useState<"granted" | "denied" | null>(null);
  const [ready, setReady] = useState(false);
  const active = enabled && !!(ga4 || gtm || clarity);

  useEffect(() => {
    if (!active) return;
    try { const v = localStorage.getItem(KEY); if (v === "granted" || v === "denied") setChoice(v); } catch { /* storage blocked */ }
    setReady(true);
  }, [active]);

  useEffect(() => {
    if (!active || choice !== "granted") return;
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

  if (!active || !ready || choice) return null;
  const decide = (v: "granted" | "denied") => { try { localStorage.setItem(KEY, v); } catch { /* ignore */ } setChoice(v); };
  return (
    <div className="consent" role="region" aria-label="Cookie preferences">
      <p>We use analytics cookies to understand how visitors use kairali.com. They are set only if you accept. See our <a href="/privacy-policy.aspx">privacy policy</a>.</p>
      <div className="actions"><button type="button" className="btn" onClick={() => decide("granted")}>Accept analytics</button><button type="button" className="btn secondary" onClick={() => decide("denied")}>Decline</button></div>
    </div>
  );
}
