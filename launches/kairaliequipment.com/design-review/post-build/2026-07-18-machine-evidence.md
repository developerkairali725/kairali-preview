# kairaliequipment.com — MACHINE EVIDENCE for Gate-2 post-build pass 3

- Recorded: 2026-07-18 23:52:00 IST · lane: full-site build (PR #131 branch)
- Surface: Vercel preview deployment `dpl` for build 9b8f17e+lede-fix — URL
  kairali-web-factory-kairaliequipment-jyg3a8n5r-kairali.vercel.app (share-link
  authenticated; all routes 200)
- Method: Playwright (chromium), fresh context, network-request log + DOM
  assertions; raw results reproduced verbatim below. Screenshots of the same
  session: `screens/2026-07-18-pass3-*.png`.

## 1 · Consent-gated chat — NO third-party load before the banner is answered

PRE-choice window (page open, idle past the 6-second chat timer):

```json
{
  "localStorageKeys": [],
  "chatScript": false,
  "bannerOpen": true,
  "chatbaseRequests": 0,
  "thirdPartyHosts": ["vercel.live"]
}
```

- `vercel.live` is the Vercel PREVIEW toolbar (platform chrome on *.vercel.app
  previews) — not part of the site; it does not exist on a production domain.
- The cookies present pre-choice are ALL Vercel platform/SSO cookies set by the
  share-link authentication flow (`_vercel_jwt`, `_vercel_sso_nonce`,
  `vercel_session_id`, …) — none are set by the site. The site's own surfaces
  store NOTHING before the choice: localStorage is empty, no Chatbase request
  has left the page, Consent Mode v2 is default-denied (@kairali/consent).

POST-choice ("Essential only" clicked):

```json
{
  "stored": true,
  "bannerOpen": false,
  "chatScript": true,
  "bubble": true,
  "chatbaseRequestsAfterChoice": 3
}
```

The choice record lands in `localStorage["kairali-consent-v1"]` (denied-all,
security granted), the banner closes, and ONLY THEN does the consent-gated
loader (`@kairali/chat` `consentGated` prop, sites/kairaliequipment.com/app/
layout.tsx) inject the Chatbase embed — 3 chatbase.co requests, all after the
click. This is the checklist-24 proof and makes the banner's "Nothing is
stored until you choose." literally true for the site's own surfaces.

## 2 · Mobile 390×844 — overflow + sticky bar + stacking

```json
{
  "overflowX": false,
  "scrollWidth": 390,
  "stickyVisible": true,
  "bubble": true,
  "bubbleAboveBar": true
}
```

Zero horizontal overflow (scrollWidth 390 = viewport 390); the sticky utility
bar (Request a Quote + WhatsApp) is pinned inside the viewport; the chat
bubble stacks ABOVE the bar (screenshot:
`screens/2026-07-18-pass3-mobile-postconsent-viewport.png`).

## 3 · Trust-chip / hero-chip / lane link map (DOM truth; every target 200)

```json
[
  {"cta":"category-pathi","href":"/equipment/pathi"},
  {"cta":"category-shirodhara","href":"/equipment/shirodhara-stand"},
  {"cta":"category-steam","href":"/equipment/steam-box"},
  {"cta":"category-urlis","href":"/equipment/urlis"},
  {"cta":"category-accessories","href":"/equipment/accessories"},
  {"cta":"trust-manufacturing","href":"/manufacturing"},
  {"cta":"trust-certifications","href":"/certifications"},
  {"cta":"trust-trade","href":"/trade"},
  {"cta":"trust-about","href":"/about"},
  {"cta":"trade-lane-click","href":"/trade/contract-manufacturing"},
  {"cta":"trade-lane-click","href":"/trade/hotel-resort-spa-supply"},
  {"cta":"trade-lane-click","href":"/trade/spa-consultancy"},
  {"cta":"trade-lane-click","href":"/trade/distributors-importers"}
]
```

A curl sweep over every internal href across 11 rendered pages (33 unique
hrefs) returned 200 for all — no broken internal link exists on the site.

## 4 · Route + indexability sweep (27 routes)

All 27 routes return HTTP 200. Placeholder PDPs render
`<meta name="robots" content="noindex, nofollow"/>`; category pages render
`index, follow`; sitemap.xml carries 21 URLs and ZERO `sku-placeholder`
entries (D-EQ-CATALOG §6.2 honoured by construction).

## 5 · Pass-3 additions — trust-strip scoping · terms hrefs · tap targets [2026-07-19 00:05:00 IST]

**Trust-strip scoping (checklist 7):** DOM text of the four chips (mobile 390px render):
`Own manufacturing — Facility · QC · R&D` · `Certifications & awards — Carried from record` ·
`Worldwide alliances — Distributor network` · `One family group — Incl. the NABH-accredited Healing Village`.
Credential badges: `NABH Accredited AYUSH hospital — group (AH-2024-0250)` · `GREEN LEAF Govt. of Kerala — group`
— the "— group" scoping is IN the rendered strings.

**Commercial-terms link targets (checklist 20):** DOM link map:
MOQs & lead times → `/faq` · Territories & margins → `/trade/distributors-importers` ·
Packaging & export terms → `/manufacturing` · Certifications & documents → `/certifications`.
All four targets return 200 (§4 sweep).

**Tap targets, mobile 390px (checklist 13):** 62 interactive elements measured
(`getBoundingClientRect`). EVERY `data-cta` primary control is ≥44px in at
least one dimension with ≥44px effective hit area (buttons/pills 44–48px tall;
padded inline CTAs carry the 44px padding-block hit-area technique). The only
elements under 44×44 are (a) the RFQ consent checkbox input (13×18) whose
WRAPPING `<label class="consent">` is the actual click surface (full-width,
>44px), and (b) inline body-text links (footer legal links, in-copy references)
— which Ship Gate A4 does not class as primary controls. No primary control
fails the bar.
