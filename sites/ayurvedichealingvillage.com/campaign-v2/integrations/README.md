# /lp-v2 integrations: what plugs in where

Every tag, analytics, ads, chat and verification point ships as an **empty, typed slot**. To switch a tool on, fill its slot, preferably with its env var in Vercel. You never edit a component to add a tag. This file mirrors §16 of the authoring guide (`docs/lp-v2/2026-10-07-ahv-campaign-lp-authoring-guide.md`).

**Rules**
- Real IDs are never committed while the template runs on staging. Set them as env vars at go-live, or fill `slots.ts` in a reviewed go-live PR.
- Never put personal or health data in event params. `track()` drops undeclared params and anything that looks like an email address or phone number, but that check is a safety net and does not replace care.
- Nothing loads unless the **master switch** is on: `AHV_ANALYTICS=1` **and** `AHV_STAGING=0`. "Never on in staging or preview" holds **only if `AHV_STAGING=0` is scoped to the Vercel Production environment** (Preview and Development must leave it unset or `1`). If it is set for all environments, preview deployments will load real tags.

## Files

| File | What it does |
|---|---|
| `slots.ts` | `INTEGRATIONS`: every slot, empty by default, with env overrides (`NEXT_PUBLIC_LP_<TOOL>_<FIELD>`). It is read on the server only. The loader hands only the browser-needed values to the page as `window.__lpSlots` (`browserSlots()`: tag/pixel/project IDs, the GTM container, Ads conversion ID + labels, chat settings). `meta.capiEndpoint` and verification tokens never reach the browser. |
| `events.ts` | `EVENTS`: the canonical event catalogue (name → declared params + description), and `EventName`. |
| `consent.ts` | Consent helpers. **Fail closed**: consent counts as required unless `window.__ahvConsentRequired === false`. |
| `track.ts` | `track(event, params)` is the single choke point. It scrubs the params, pushes `{event, ...params}` to `window.dataLayer`, then fans out to the adapters whose slots are filled. It is consent-aware, SSR-safe and never throws. |
| `adapters/*.ts` | One file per tool: `{ id, consentMode, enabled(slots), load(slots), send(event, params, slots, w) }`. Each one is a no-op when its ID is empty. |
| `loader.ts` | `loaderSnippet(slots)` builds the inline boot script. `Document` renders it after the geo consent default, and only when the master switch is on. |
| `dom.ts` | `installDomTracking()`: a delegated click listener for `data-track` (also handles legacy `data-cta`), plus `scroll_depth` at 50% and 90%. |
| `chat.ts` | Chat hooks `onChatOpen(source)`, `onChatMessage()` and `onChatLeadCaptured(ref?)`, also exposed as `window.lpChat`. |
| `seo.ts` | `buildJsonLd(campaign, req)` and `verificationMeta(slots)`. |
| `../sections/Tracking.tsx` | A client component that installs the DOM tracking and `window.lpChat` once per page. |

## What plugs in where

| You want to… | Slot | Env var | Who fills it | How to verify |
|---|---|---|---|---|
| Turn tracking on in production | master switch | `AHV_ANALYTICS=1`, `AHV_STAGING=0` (server env) | Vikash, at go-live | View source shows `<script id="lp-integrations">` |
| Use GTM | `gtm.containerId` | `NEXT_PUBLIC_LP_GTM_CONTAINERID` | PPC / analytics team | GTM Preview connects. Every `track()` event is in `dataLayer` as `{event, ...params}` |
| GA4 | `ga4.measurementId` | `NEXT_PUBLIC_LP_GA4_MEASUREMENTID` | Analytics team | Network shows `gtag/js?id=G-…`, and events appear in GA4 DebugView with the same names |
| Google Ads conversions | `googleAds.conversionId` + `googleAds.labels.<key>` | `NEXT_PUBLIC_LP_GOOGLEADS_CONVERSIONID`, `NEXT_PUBLIC_LP_GOOGLEADS_LABELS_<KEY>` (e.g. `…_LABELS_GENERATE_LEAD`) | PPC team | Tag Assistant shows `conversion` with `send_to=AW-…/label`. A conversion fires only if its label is filled |
| Meta Pixel | `meta.pixelId` (`capiEndpoint` is reserved for CAPI) | `NEXT_PUBLIC_LP_META_PIXELID` | Paid social | Meta Pixel Helper and Events Manager Test events. `Lead` carries `eventID` = submission token |
| Microsoft Clarity | `clarity.projectId` | `NEXT_PUBLIC_LP_CLARITY_PROJECTID` | Analytics team | Network shows `clarity.ms/tag/…`. Events show as Clarity custom events |
| Bing / Microsoft Ads UET | `bing.uetTagId` | `NEXT_PUBLIC_LP_BING_UETTAGID` | PPC team | UET Tag Helper. Events are custom UET events |
| LinkedIn Insight | `linkedin.partnerId` | `NEXT_PUBLIC_LP_LINKEDIN_PARTNERID` | Paid social | Network shows `snap.licdn.com`. Per-event conversions need a `conversion_id` map (not built yet; see `adapters/linkedin.ts`) |
| TikTok Pixel | `tiktok.pixelId` | `NEXT_PUBLIC_LP_TIKTOK_PIXELID` | Paid social | TikTok Pixel Helper. `generate_lead` → `SubmitForm`, `cta_click` → `ClickButton` |
| Search-console verification | `verification.google` / `.bing` / `.facebook` | `NEXT_PUBLIC_LP_VERIFICATION_GOOGLE` / `_BING` / `_FACEBOOK` | SEO team | View source shows `google-site-verification` / `msvalidate.01` / `facebook-domain-verification` meta, but only when filled |
| Chat widget + triggers | `chat.provider`, `chat.widgetId`, `chat.openOnLoad` | `NEXT_PUBLIC_LP_CHAT_PROVIDER`, `_WIDGETID`, `_OPENONLOAD` | Chat owner (Task 13 renders the widget slot) | In the vendor's callbacks call `window.lpChat.onChatOpen("floating")`, `.onChatMessage()` and `.onChatLeadCaptured(ref)`. Check with `?lp_debug=1`. Chat is **not** behind the `AHV_ANALYTICS` master switch: it is user-initiated (loads only on "Chat here now", EU/UK asked first), so a filled `chat.provider` works on staging too. If the vendor fails or does not open within 6s, the Ask sheet reopens with a WhatsApp fallback |
| A new event | add to `EVENTS` in `events.ts` | — | Developer / AI | Put `data-track="name"` + `data-track-<param>="…"` on the element (or call `track()`), then check the `[lp-track]` line with `?lp_debug=1` |
| SEO / AI-search structured data | `campaign.extraJsonLd` (array of schema.org objects) | — | Content AI / SEO | View source shows one `application/ld+json` script. Validate it in the Rich Results Test |
| A different form | `campaign.form.schema` / `campaign.form.adapterId` | — | Task 13 / content AI | See `campaign-v2/forms/` (Task 13). Form events still go through `track()` |

### Google Ads label keys

| Label key | Fires on |
|---|---|
| `generate_lead` | `generate_lead`, only with a server-confirmed `transaction_id` (submission token). It is de-duplicated per token with the main site's `ktahv-lead-conversions` store |
| `whatsapp_click` | `cta_click` with `cta=whatsapp` |
| `call_click` | `cta_click` with `cta=call` |
| `consult_cta` | `cta_click` with `cta=consult` or `cta=offer` |
| `chat_start` | `chat_open` |
| `channel_handoff` | `channel_handoff` |

### Consent

| Region | dataLayer, GA4, Google Ads | Meta, Clarity, Bing, LinkedIn, TikTok |
|---|---|---|
| EU/EEA/UK/CH, or region unknown (`window.__ahvConsentRequired !== false`, fail closed) | Always. Consent Mode (denied by default) limits them to cookieless pings until the visitor grants | Loaded and sent only after a **granted** choice is stored in `kairali-consent-v1`. The loader checks every 1s until a choice exists |
| Everywhere else (`__ahvConsentRequired === false`) | Always (Consent Mode is granted by default) | Always, unless a stored explicit **denial** exists |

The Google Ads `generate_lead` de-dupe list is written to `localStorage` only where consent is not required or a granted choice is stored; otherwise it is kept in memory for the page view.

If GTM owns some tags, leave the matching per-tool slots empty so nothing is sent twice. Consent for tags inside GTM is then GTM's job (use its Consent Mode checks).

## Standard events

| Event | Params | Fired when |
|---|---|---|
| `cta_click` | `cta` (consult, whatsapp, ask, call, offer, email), `position` (header, hero, bar, section, sticky, footer, lightbox) | Any CTA click (`data-track`) |
| `form_start` | `form_id`, `variant` | First interaction with the enquiry form |
| `form_step_complete` | `form_id`, `step` | Each step's Continue |
| `form_error` | `form_id`, `field`, `code` | A validation error is shown |
| `form_submit_attempt` | `form_id` | Send is pressed with valid data |
| `generate_lead` | `form_id`, `transaction_id`, `ref` | **Only** after the adapter confirms the lead is stored |
| `form_submit_failed` | `form_id`, `status` | A 4xx, 5xx or network failure |
| `channel_select` | `channel` | The reply channel is chosen |
| `channel_handoff` | `channel`, `ref` | The success-screen channel button is tapped |
| `chat_open` | `source` (ask_sheet, floating, success) | The chat widget opens |
| `chat_message` | `role` (user) | A visitor sends a chat message |
| `chat_lead` | `ref` (optional) | The chat vendor reports a captured lead |
| `film_play` | `kind`, `youtube_id` | A film facade is clicked |
| `gallery_open` | `category` | The gallery opens |
| `currency_change` / `locale_change` | `to` | A switcher is used |
| `scroll_depth` | `percent` (50, 90) | Once each |

## SEO and AI search

- **JSON-LD** is always rendered as one `<script type="application/ld+json">` (an array). It contains:
  - MedicalClinic: name, address, telephone and email come from `campaign-v110/lib/site.ts`; the url is the main site.
  - FAQPage: answered (non-pending) FAQs only.
  - VideoObject: one per film.
  - Offer: only when a real (non-pending) offer exists.
  - `campaign.extraJsonLd`, if set.
- **Canonical and hreflang are not emitted.** Variant URLs (`/lp-v2/<slug>/<a|b|c|d>`) are always noindex. The canonical for each campaign's main indexable route is **Vikash's decision** and should be set where that route is served, not in the variant template.
- Verification meta is rendered only for filled slots.

## Known live IDs: fill these at go-live (NOT active in the template)

| Tool | ID | Env var to set |
|---|---|---|
| GA4 | `G-PZBX8G4Y9N` | `NEXT_PUBLIC_LP_GA4_MEASUREMENTID` |
| Google Ads | `AW-972059125`, lead label `fqrBCJvyugcQ9ePBzwM` | `NEXT_PUBLIC_LP_GOOGLEADS_CONVERSIONID`, `NEXT_PUBLIC_LP_GOOGLEADS_LABELS_GENERATE_LEAD` |
| Meta Pixel | `1305161823266727` | `NEXT_PUBLIC_LP_META_PIXELID` |
| Clarity | `rf5s9ugok4` | `NEXT_PUBLIC_LP_CLARITY_PROJECTID` |

The source for these is `analytics.config.json`. A test (`test/lp-v2-integrations.test.mjs`) fails if any of them appears in the integrations code.

## Go-live checklist

- [ ] `AHV_ANALYTICS=1` and `AHV_STAGING=0` are set **in the Vercel Production environment only**.
- [ ] Each tool's ID is set as its `NEXT_PUBLIC_LP_*` env var (see the table of known live IDs), not committed.
- [ ] If GTM is used, the per-tool slots for tags that GTM owns are left empty (no double counting).
- [ ] Any non-Consent-Mode tag managed inside GTM must use GTM consent checks (EU/UK).
- [ ] `?lp_debug=1` on production shows `[lp-track]` lines reaching the expected adapters, and the vendor debuggers confirm the hits.

## How to check the slots work

1. Run `node --test test/lp-v2-integrations.test.mjs` and `pnpm lp:check`.
2. Open the page with `?lp_debug=1`. Each `track()` call logs `[lp-track] <event> {params} → [adapters reached]`. This also works with everything off (`→ []`).
3. With IDs set and the master switch on, confirm the hits in GTM Preview, GA4 DebugView, Google Tag Assistant and Meta Events Manager.
