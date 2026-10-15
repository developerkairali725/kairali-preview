"use client";

import { useEffect } from "react";
import { isBareWhatsApp, prefillHref, type PrefillLocale } from "./whatsapp-prefill.ts";

/**
 * Adds the page-context prefill (whatsapp-prefill.ts) to the bare WhatsApp links of one live ad route, as the English
 * landing pages' LpSticky does: the links already rendered (header, hero, enquiry, footer) on mount, and any bare link
 * the shared chrome adds later (chat choices) at the moment it is pressed. Same number; nothing else on the link
 * changes, so measurement (interaction-map.ts: any wa.me link) is unaffected. Renders nothing. Without JavaScript the
 * links stay the plain WhatsApp link. Mounted only by app/(ppc-v2-ru)/lp/treatment-in-kerala-russian/page.tsx.
 */
export default function WhatsAppPrefill({ locale }: { locale: PrefillLocale }) {
  useEffect(() => {
    const href = () => prefillHref(locale, document.title, window.location.pathname);
    const apply = (a: HTMLAnchorElement) => { if (isBareWhatsApp(a.getAttribute("href"))) a.setAttribute("href", href()); };
    document.querySelectorAll<HTMLAnchorElement>("a[href]").forEach(apply);
    const onClick = (e: MouseEvent) => {
      const a = e.target instanceof Element ? e.target.closest("a") : null;
      if (a) apply(a);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [locale]);
  return null;
}
