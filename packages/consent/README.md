# @kairali/consent

DPDP 2023 baseline, GDPR posture on EU-facing pages. Banner + Google Consent Mode v2 + per-entity privacy/terms pages (Checklist A12). No PII in repos, logs, or prompts.

## API (v0.2, 14 Jul 2026)
`<ConsentScripts/>` (server, inline: dataLayer+gtag shim → Consent Mode v2
default DENIED all keys incl. ad_user_data/ad_personalization → stored-choice
re-apply) — render in <head> BEFORE <Analytics/>. `<ConsentBanner
privacyHref?/>` (client): equal-prominence Accept all / Essential only,
brand tokens, choice persisted (kairali-consent-v1) + gtag consent update.
Core logic plain JS (`@kairali/consent/core`), node --test covered.
Verified live 14 Jul: dataLayer order default→update, banner dismiss,
returning-visitor re-apply before any tag.
