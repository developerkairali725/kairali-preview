# @kairali/analytics

One `data-cta` event vocabulary (form_submit, whatsapp_click, call_click, add_to_cart_assist) mapped to GA4 + Google Ads conversions, Meta pixel (C/E consumer sites), LinkedIn Insight (A-register B2B), Bing UET where Ads run. Site IDs live in per-site config, never hardcoded. Checklist items B3–B6.

## API (v0.2, 14 Jul 2026)
`<Analytics/>` (server): reads NEXT_PUBLIC_GA4_ID / NEXT_PUBLIC_GTM_ID —
absent (today: measurement handover pending, Vikash) → renders ONLY the
inert data-cta listener; events queue in dataLayer via the gtag shim and
flow the moment IDs land. IDs are shape-validated (G-…/GTM-…), never
invented (rule 6). data-cta delegation: one capture listener →
gtag('event', name, {link_url, link_text, beacon}) per Ship Gate B4 event
names. Render AFTER <ConsentScripts/>. Core plain JS
(`@kairali/analytics/core`), node --test covered. Verified live 14 Jul:
email_click event captured in dataLayer with zero loaders present.
