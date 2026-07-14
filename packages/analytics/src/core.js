/**
 * @kairali/analytics core — GA4/GTM loader plumbing + data-cta delegation.
 *
 * IDs come from ENV VARS ONLY (rule 6: never invent IDs):
 *   NEXT_PUBLIC_GA4_ID  — G-XXXXXXX  (per-site GA4 web stream, Ship Gate B3)
 *   NEXT_PUBLIC_GTM_ID  — GTM-XXXXX  (per-site container, Ship Gate B4)
 * Until the measurement handover lands (BACKLOG WAITING ON: Vikash), both
 * are unset and <Analytics/> renders the inert bootstrap only — no loaders,
 * no invented IDs, nothing to strip out later.
 *
 * Consent contract: @kairali/consent's <ConsentScripts/> MUST render before
 * <Analytics/> (Consent Mode v2 default-denied precedes any tag).
 */

/** Read measurement IDs from an env object; absent = null, never invented. */
export function readIds(env = {}) {
  const ga4 = env.NEXT_PUBLIC_GA4_ID?.trim() || null;
  const gtm = env.NEXT_PUBLIC_GTM_ID?.trim() || null;
  if (ga4 && !/^G-[A-Z0-9]+$/i.test(ga4)) {
    throw new Error(`analytics: NEXT_PUBLIC_GA4_ID "${ga4}" does not look like a GA4 id (G-…)`);
  }
  if (gtm && !/^GTM-[A-Z0-9]+$/i.test(gtm)) {
    throw new Error(`analytics: NEXT_PUBLIC_GTM_ID "${gtm}" does not look like a GTM id (GTM-…)`);
  }
  return { ga4, gtm };
}

export function gtagSrc(ga4Id) {
  return `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`;
}

/** GA4 config snippet (runs after the async loader tag). */
export function ga4ConfigSnippet(ga4Id) {
  return [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){dataLayer.push(arguments);}",
    "window.gtag=window.gtag||gtag;",
    "gtag('js',new Date());",
    `gtag('config',${JSON.stringify(ga4Id)});`,
  ].join("");
}

/** GTM loader snippet (standard, container publishes the tags — B4). */
export function gtmSnippet(gtmId) {
  return (
    "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});" +
    "var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';" +
    "j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})" +
    `(window,document,'script','dataLayer',${JSON.stringify(gtmId)});`
  );
}

/**
 * data-cta delegation (Ship Gate B4: conversion events from data-cta —
 * form_submit, whatsapp_click, call_click, add_to_cart_assist…). One
 * document-level listener; events queue in dataLayer via the gtag shim, so
 * wiring works the moment IDs/tags land, and is inert before that.
 */
export function ctaListenerSnippet() {
  return [
    "document.addEventListener('click',function(e){",
    "var el=e.target&&e.target.closest?e.target.closest('[data-cta]'):null;",
    "if(!el)return;",
    "var n=el.getAttribute('data-cta');if(!n)return;",
    "window.gtag&&window.gtag('event',n,{transport_type:'beacon',link_url:el.href||'',link_text:(el.textContent||'').trim().slice(0,80)});",
    "},{capture:true});",
  ].join("");
}
