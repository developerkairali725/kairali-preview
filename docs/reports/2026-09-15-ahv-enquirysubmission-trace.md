# EnquirySubmission — conversion chain trace and staging candidate

**Task:** `WOPS-AHV-GO-LIVE-MEASUREMENT-PERFORMANCE-AUDIT-001`, reopened by the evidenced cutover gap
**Date:** 2026-09-15 · **Mode:** read-only for all live systems

No form was submitted. No live setting, tag, bid, goal, counting rule or conversion action was
changed. No WordPress change. Page fetches used `curl`, which executes no JavaScript, so no tracking
fired from this work. The staging candidate in §7 is inert: not wired to any caller, and measurement
is off in the build.

---

## 1. The mapping — VERIFIED

**AHV-NEO `712-961-0573` → `EnquirySubmission` ctId `15644955` → `AW-972059125/fqrBCJvyugcQ9ePBzwM`**

| Evidence | Value |
|---|---|
| Live page source | `gtag('event','conversion',{'send_to':'AW-972059125/fqrBCJvyugcQ9ePBzwM'})` on `/ppc-thanks/` |
| Injected by | WordPress plugin **HFCM by 99 Robots — Snippet #1 "ppc thanks"** |
| Google's generated comment | `<!-- Event snippet for EnquirySubmission conversion page -->` |
| Ads action detail | `EnquirySubmission`, conversion type ID **15644955** |
| Ads **Webpages** tab | `https://ayurvedichealingvillage.com/ppc-thanks` — *Recording conversions* — 1 tag — **163.00** |
| Cross-check | 163.00 on the Webpages row equals 163.00 on the EnquirySubmission row |

Ownership was verified in the Ads UI, which satisfies the 27 Aug caution *"do not infer ownership
from the public ID… export the exact Ads account/conversion destinations first."*

**Action settings (read-only):** Source `Website` · Primary · **Count: Every conversion** · value ₹1 ·
click-through 30 days · engaged-view 3 days · view-through 1 day · data-driven attribution ·
**not** included in account-level goals.

`/ppc-thanks/` is the **only** thank-you variant carrying an Ads tag. Checked and clean:
`/thank-you/` (301 → `/contact-us/thank-you/`), `/contact-us/thank-you/`, `/thanks-old/`,
`/emailsubscriber/`.

---

## 2. Four distinct things, deliberately not conflated

Earlier wording in this session blurred these. Stated separately:

| Layer | What is established | Confidence |
|---|---|---|
| **Script execution** | The conversion snippet is unconditional inline script in `<head>`; it runs on page load. | **Established** from source. |
| **Network dispatch** | A recorded read-only audit (27 Aug 2026) states *"Opening the URL during this read-only audit generated the Google Ads conversion request."* | **Established** by that prior observation. Not re-tested here; `curl` runs no JS. |
| **Ads attribution** | Whether a dispatched hit is attributed depends on an ad click existing within the 30-day click-through / 3-day engaged-view / 1-day view-through windows, plus data-driven attribution. A hit from a visitor with no qualifying interaction is not attributed. | **Not established.** Cannot be determined from the UI rows available. |
| **Counted conversions** | What finally appears in the column, after Google's own deduplication and modelling. | **Not established** per-event. |

**Therefore:** it is **not** correct to say every refresh becomes a counted conversion. Dispatch is
load-triggered, and `Count: Every` removes Google's per-click collapsing — those two together make
repeat counting *possible and structurally likely for a visitor who did click an ad*, but each
refresh becoming a counted conversion does not follow, and is not claimed.

Equally, **the 163 reported conversions do not prove 163 successful form submissions.** They prove
163 conversions were credited to that URL in the window. How many correspond to accepted leads
cannot be determined from Ads alone — it needs the CRM / lead-store join, which the 31 Aug audit
already identified as the missing piece.

---

## 3. The chain

```
/enquiry-form/  or  /contact-us/          (live WordPress)
        |
        |  WPForms AJAX forms (method=post, action = same URL, wpforms-ajax-form)
        |  form ids observed: 11965, 18926, 8055
        |  AJAX => the browser does NOT navigate on submit
        v
   [ accepted response ]                   <-- NOT VERIFIED, see §4
        |
        |  WPForms confirmation is a SERVER-SIDE per-form setting:
        |  inline message (no redirect, no conversion) OR redirect to a page
        v
/ppc-thanks/                               (HTTP 200, public, indexable, self-canonical)
        |
        |  unconditional inline <script>, injected by HFCM
        v
AW-972059125/fqrBCJvyugcQ9ePBzwM  ->  EnquirySubmission (ctId 15644955), AHV-NEO
```

---

## 4. Form trace — what is established, and the exact gap

**Established from public source:**

- `/enquiry-form/` renders WPForms **11965** and **18926**; `/contact-us/` renders **11965**, **18926**
  and **8055**. All are `wpforms-ajax-form`, `method="post"`, `action` = the current page.
- Theme CSS styles `#wpforms-form-11965` and `#wpforms-form-18926` as compact flex rows with a
  half-width submit — consistent with footer subscribe/short forms — while **8055** appears only on
  `/contact-us/`. *Inference, not configuration:* 8055 is the substantive contact form.
- Both `11965` and `18926` carry a hidden honeypot field
  (`#wpforms-11965-field_2-container` is `height:1px; visibility:hidden`).
- No redirect target appears in markup, because WPForms stores it server-side.

**BLOCKED — the exact configuration fields still needed.** For each of 11965, 18926, 8055:

1. `Settings → Confirmations → Confirmation Type` (Message / Page / Redirect URL)
2. If Page or Redirect: the **target page or URL** — specifically whether it is `/ppc-thanks/`
3. Any **conditional logic** on the confirmation (multiple confirmations, per-condition targets)
4. `Settings → General → AJAX form submission` on/off
5. The list of pages/posts embedding each form (Form → Locations, or the embed audit)

**Access attempted and denied, not routed around.** The exact blocked operation:
`mcp__claude-in-chrome__navigate` → `https://ayurvedichealingvillage.com/wp-admin/admin.php?page=wpforms-overview`,
refused by the Claude Code auto-mode classifier. `WP_APP_PASSWORD` is also unset in this session.
No other tool was used to reach the same surface, no credential was created, and no access control
was bypassed. A search of already-authorised workspace evidence found **no** recorded confirmation
configuration for any of the three forms.

**Consequence:** whether the live forms reach `/ppc-thanks/`, and which of them do, is **unverified**.
163 conversions prove something reaches that URL; they do not prove a form did.

**Corresponding new-site handler — fully known, no inference.** `packages/forms/src/route-handler.ts`:

| Outcome | Status | Body |
|---|---|---|
| **Accepted and stored** | **201** | `{ ok: true, id: "<lead row id>" }` |
| Honeypot tripped | 200 | `{ ok: true }` — **no `id`**, pretend success |
| Invalid body | 400 | `{ ok: false, error: "invalid body" }` |
| Validation, incl. missing consent | 422 | `{ ok: false, error }` |
| Server/config failure | 500 | `{ ok: false, error: "could not submit" }` |
| Staging guard | 503 | `{ ok: false, staging: true }` |

`packages/forms/src/store.js` throws unless `consent === true` and stamps `consent_at`, so a stored
lead already carries explicit consent. Note that `EnquiryForm.tsx` currently treats any `res.ok` as
"sent", which includes the honeypot's 200 — intended for bots, and the reason §7's predicate requires
the `id`.

---

## 5. Consent behaviour — UNVERIFIED

The page contains no `gtag('consent', …)` default or update call, and no conditional around the
conversion event.

**That is not sufficient to conclude consent is unenforced.** Enforcement could sit outside the page
source — a consent platform that blocks or rewrites tag requests, a Cloudflare worker, region-gated
delivery, or Google's own consent-mode defaults applied elsewhere. None of that was tested, because
testing it means executing the page's JavaScript and observing outgoing requests, which would fire a
conversion.

**Status: unverified in both directions.** What *is* established: no in-page consent signal exists.

To resolve it without firing a conversion: inspect the tag manager / consent platform configuration,
or observe a request-level capture from an already-authorised session.

---

## 6. Enhanced conversions — UNVERIFIED

The action reports *"Enhanced Conversions: Managed through Google Tag Manager. Enhanced conversions
is enabled."* No GTM container appears in the source of the homepage or `/ppc-thanks/`
(`grep -c 'GTM-'` returns 0 on both).

**Absence of a visible container is not proof that enhanced conversions are not delivered.** GTM can
be injected server-side, via a worker, or on pages not fetched here. The contradiction is worth
resolving, but the honest status is **unverified**, not broken.

---

## 7. Staging candidate — prepared, tested, NOT activated

`sites/ayurvedichealingvillage.com/app/(english)/_families/lead-conversion.mjs`
Tests: `sites/ayurvedichealingvillage.com/test/lead-conversion.test.mjs` — **17 pass, 0 fail**

Implements the behaviour the 27 Aug plan already required: *never fire because a URL was opened or
reloaded; fire once only after the server confirms a successful accepted lead; unique non-personal
correlation ID for deduplication; prevent repeat firing on refresh/back; no personal data in the
payload.*

**Design:**

- Uses the **existing** conversion action `AW-972059125/fqrBCJvyugcQ9ePBzwM`. Nothing new is created.
- Success predicate is the real contract, not a guess: **201 AND `ok:true` AND a non-empty string
  `id`**. The honeypot's 200/`ok:true`/no-id is explicitly excluded.
- The lead row `id` becomes the Ads `transaction_id`, so a duplicate dispatch is droppable by Google
  as well as by us.
- Deduplicated locally in `localStorage` (bounded to 50 ids), surviving refresh and back-navigation,
  with an in-memory fallback for private mode.
- Consent is read **at fire time**, never cached, so withdrawal takes effect immediately.
- Two independent off-switches: measurement config absent (AHV_ANALYTICS unset) **and** no `gtag`.
- A dispatch that throws does **not** mark the lead seen, so it stays eligible rather than being lost.
- Every outcome is an explicit constant (`fired`, `skipped:not-accepted`, `skipped:duplicate`,
  `skipped:no-consent`, `skipped:disabled`) so a caller or test can prove *why* nothing fired.

**Test coverage — all tracking intercepted, no network, no Ads, no lead store:**

| Scenario | Result |
|---|---|
| Success — one confirmed lead | fires exactly once, correct `send_to` and `transaction_id` |
| Success — payload hygiene | only `send_to` + `transaction_id`; name/phone/email provably absent |
| Failure — 400 / 422 / 500 / 503 | no dispatch on any |
| Failure — honeypot 200 pretend-success | no dispatch |
| Double-click, same lead | fires once |
| Retry with a genuinely new lead | fires again (correctly) |
| Refresh, persisted storage | no second dispatch |
| Refresh, storage unavailable | still deduped within the page view |
| Direct thank-you access / navigation | **cannot dispatch — there is no page-view path** |
| Consent rejected / absent | no dispatch |
| Consent withdrawn after an earlier lead | no dispatch for the later lead |
| Consent withdrawn then re-granted | already-counted lead is not re-counted |
| Staging: measurement off / no gtag | no dispatch |
| Dispatch throws | lead stays eligible for retry |

**Not activated.** No caller imports it (`grep` over `app/` confirms), so it runs nowhere. `next build`
is clean, 273 static pages. Reversal is deleting one file and one call site that does not yet exist.

**Deliberately NOT done:** no tracking activated, no live lead submitted, no Ads goal/counting/bidding
change, no enhanced-conversions configuration, no UET, no WordPress change, no merge, no publish.

---

## 8. The cutover gap — stated precisely

**This website conversion path, and only it.**

| | Live WordPress | New staging build |
|---|---|---|
| `/ppc-thanks/` resolves | yes (200) | yes — it is one of the 252 approved routes, serves 200 |
| Carries `AW-972059125/fqrBCJvyugcQ9ePBzwM` | yes | **no** |
| Injected by | HFCM WordPress plugin | plugin has no counterpart in the new stack |

At the DNS flip, `/ppc-thanks/` keeps rendering while **the website-sourced `EnquirySubmission`
signal stops**. It fails quietly: the page still looks right, so the first symptom is a conversion
decline that reads like a performance problem.

**Scope of the loss, precisely:** `EnquirySubmission` contributed **163.00** of the account's
**14,549.42** all-conversions in the 28-day window. `Calls from ads` (1,651.99) and
`Conversation started` (724.00) are **not** website-tag dependent and are unaffected by the flip.
So account conversions do **not** go to zero — what is lost is the only *website-sourced lead* signal,
in an account spending ₹650,776 per 30 days, and it is the one signal closest to an actual enquiry.

---

## 9. Remaining access and configuration gaps

1. **WPForms confirmation configuration** for 11965 / 18926 / 8055 — the five fields in §4. Blocked.
2. **Microsoft Advertising account identity** — no verified Healing Village account name or ID.
   **BLOCKED pending the owner or Vikash.** Not inferred from Bing Webmaster Tools, which identifies
   no advertising account.
3. **Consent enforcement** (§5) — unverified in both directions.
4. **Enhanced-conversions delivery** (§6) — unverified.
5. **Whether `/ppc-thanks/` should remain a conversion surface at all** once firing moves to
   server-confirmed acceptance. It is currently public, indexable and self-canonical.

---

## 10. Activation decision — for the owner and Vikash

The candidate is ready and tested but must not be switched on by this workstream. The decision is:

- **A.** Wire the candidate to the new site's enquiry submit path and activate it at go-live with
  `AHV_ANALYTICS=1`, keeping the existing conversion action. Restores the signal on a *better*
  definition than today's page-view firing.
- **B.** Wire it but leave `Count: Every` and the account-goal membership exactly as they are, so the
  only change is *when* it fires. Smallest possible change; the 31 Aug audit's counting concerns stay
  open.
- **C.** Also change the action to `Count: One` and reconcile account-level goals — larger, touches
  Ads settings, and belongs with Vikash.
- **D.** Retire `/ppc-thanks/` as a conversion surface entirely and rebuild lead measurement on
  server-confirmed acceptance plus the CRM join, per the 31 Aug recommendation.

Whichever is chosen, the WPForms confirmation configuration (§9.1) should be read first, because it
determines whether the live signal is currently form-driven at all.
