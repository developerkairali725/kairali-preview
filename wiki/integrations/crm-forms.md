# CRM & forms — UNBLOCKED 13 Jul 2026 (spec from Satyam, who built the CRM)
Canonical spec + verification evidence: docs/integrations/crm-forms-spec.md.
`@kairali/forms` v1 implements it exactly: buildPayload (only canonical fields),
trackingFromLocation (UTM/gclid/fbclid/landingPage/referrer capture), submitLead
(server-side, endpoint from env CRM_WEBHOOK_URL). v1 additions: DPDP consent
checkbox (client-side gate), Turnstile, data-cta events — payload unchanged.
- PRODUCTION webhook still needed from Satyam before first real launch.
- OPEN: does the CRM want an explicit consent field? (QUESTIONS)
- Launch evidence per site: one live test lead + screenshot/row-ref (Checklist B8).
v2 backlog (post-sprint): chat-style forms, conditional fields per MOA, enrichment, A/B.
