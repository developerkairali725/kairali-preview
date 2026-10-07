# AHV consent candidate — 7 October 2026

Status: review candidate only. No production publication or account-setting changes.
Task: WOPS-AHV-CONSENT-UPDATE-20261007-001. Scope: this AHV site only.

## Why this change

The custom binary banner trusted an unversioned `ktahv-consent` value indefinitely and could not express analytics-only or advertising-only choices. The shared head restore accepted the historical fleet record before validating its age. AHV now uses locally served CookieConsent 3.1.0, upstream commit `e6279509aab5b96be198297b0283b321ad76b0a9`, verified as GitHub's latest release on 7 October 2026. Its MIT license, untouched distribution files and SHA-256 manifest are in `public/consent/vendor`. No shared package or dependency lock is changed.

The head starts denied. Only CookieConsent's validated current revision can start optional SDKs. Analytics gates GA4 and Clarity (including session replay); advertising gates Google Ads and Meta. Reject and accept are equally prominent; the settings panel offers separate optional categories. Every page retains a translated preferences entry point. Saved changes revoke consent before reloading to unload SDK timers/listeners. Cross-tab changes reload; expired, malformed or old-revision records re-prompt. Storage failure honors the current page choice and re-prompts next visit. Failure to load the module leaves optional SDKs blocked and offers retry.

Old explicit rejection migrates once. Old blanket acceptance re-prompts instead of silently authorizing new categories. The old key remains only for captured-view presentation compatibility. GPC keeps advertising off, including when a previously accepted record exists. Geography is not fetched: missing, unknown and all known regions use the same opt-in default. This is a conservative product choice, not a claim that every jurisdiction requires identical consent.

Existing public measurement IDs, build-time analytics switch, safe URL guards, customer-data suppression, successful-enquiry requirement, lead deduplication and staging conversion safeguards are preserved. No synthetic conversions or real visitor data were transmitted during QA. Account-side Google Ads/Meta receipt reconciliation remains a separate checkpoint.

## Research and approval decisions

- [Upstream release](https://github.com/orestbida/cookieconsent/releases/tag/v3.1.0), [configuration](https://cookieconsent.orestbida.com/reference/configuration-reference.html), [API](https://cookieconsent.orestbida.com/reference/api-reference.html): maintained self-hosted UI with revision, expiry, opt-in, equal-weight controls and consent/change callbacks. This is not a managed legal-service or certified-CMP purchase.
- [Google consent implementation](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic) and [mode concepts](https://developers.google.com/tag-platform/security/concepts/consent-mode): the candidate blocks Google script loading until the relevant category is chosen, and updates all four Consent Mode v2 signals. It does not add pre-consent cookieless pings.
- [Clarity Consent API v2](https://learn.microsoft.com/en-gb/clarity/setup-and-installation/clarity-consent-api-v2): explicit `analytics_Storage` and `ad_Storage` signals retained. Microsoft describes EEA, UK and Switzerland consent enforcement from 31 October 2025. The integration is tested separately from account receipt proof.
- [Meta consent documentation](https://developers.facebook.com/docs/meta-pixel/implementation/gdpr/) returned HTTP429 during this review. Existing grant/revoke semantics were preserved and the real SDK was exercised with all collection requests aborted; this does not replace a vendor/legal policy review.
- [EDPB cookie banner taskforce report](https://www.edpb.europa.eu/system/files/2023-01/edpb_20230118_report_cookie_banner_taskforce_en.pdf) supports meaningful first-layer refusal and no preselected optional categories; national rules still matter. [ICO guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/) and [December 2025 enforcement update](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2025/12/ico-action-secures-increased-cookie-compliance/) reinforce usable refusal controls. This is not an opinion that the entire site meets GDPR/PECR.
- [California CPPA opt-out preference signals](https://cppa.ca.gov/pdf/oops.pdf): the candidate honors GPC for advertising everywhere. Applicability, sale/share characterization and the wording of any required privacy-rights link need owner/privacy review; a cookie preference panel alone does not settle them.
- [India government DPDP update](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2198217&lang=1&reg=3) states that the November 2025 notification has phased implementation. Confirm applicable commencement provisions and AHV notice/consent obligations before publication; do not treat a banner upgrade as DPDP certification.
- [Reddit implementation discussion](https://www.reddit.com/r/GoogleTagManager/comments/1akbdnq/consent_mode_v2_query/) was used as an anecdotal prompt to test persistence and signal ordering, not as legal or authoritative technical evidence.

Owner/privacy approval is required for the proposed **182-day preference retention**, revision-2 migration/re-prompt behavior, category grouping (especially Clarity replay under analytics), 13 translated notices and regional disclosures. Translations are candidates requiring human review. No paid CMP, geolocation service or new credentials are needed. If certified TCF/Google publisher CMP requirements apply to a future advertising setup, assess that separately; no certification is asserted here.

The already recorded Cloudflare beacon is independent of these four optional SDKs and can occur before choice/after rejection on the public site. Its purpose, configuration and legal treatment remain a separate owner decision; no remote Cloudflare setting was changed. Existing legal policy pages were linked and checked, not rewritten or claimed to cover the new copy automatically.

## Verification and release boundary

Reproducible checks:

- `node --test test/*.test.mjs` (520 tests).
- `AHV_STAGING=1 AHV_ANALYTICS=0 npm run build` (locked AHV Next 15.5.24; 2,875 prerendered routes).
- `node tools/consent-browser-qa.mjs`: real pinned UI on localhost, remote requests blocked. Set `CONSENT_QA_VENDOR_SCRIPTS=1` to download only public vendor scripts; collection remains blocked. No lead events are generated. Optional report/screenshot paths must be on the external SSD.
- Start the built site on `127.0.0.1:3139`, then run `CONSENT_QA_SCREENSHOTS=<external-dir> CONSENT_BUILT_QA_REPORT=<external-json> node tools/consent-built-page-qa.mjs` for six actual page/layout/privacy-link/reopen cases with all external requests blocked.
- Scoped brand/compliance/chat-presence lint and normal required PR gates remain mandatory. The first CI run found a missing ConsentScripts component contract; the AHV server component now renders the shared denied-only snippet while deliberately omitting the unchecked historical restore. No gate was relaxed.

PR341 (homepage draft, observed head cbe13b352) also changes site-document.tsx. Reconcile that document when combining candidates; its checkout and unpublished source were not modified.

Before any separately authorized release, compare current main and active AHV work, rebuild the accepted combined source, back up the exact live deployment and prove rollback, obtain protected hosted preview approval, then verify public apex/www and released locales. No merge, production deployment, cache purge or settings change is authorized by this draft. Rollback is a source revert plus the previous verified deployment; it would restore historical binary consent semantics, so prefer a reviewed forward fix when privacy behavior is involved. User preferences are not erased during source rollback preparation.
