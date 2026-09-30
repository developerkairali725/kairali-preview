# Campaign and landing-page remediation

Task: WOPS-AHV-FINAL-DRAFT-20260924-001. Owner requested implementation of the campaign audit, including /lp/, and explicitly rejected restoration of old layouts.

Seven flattened legacy campaign bodies now use the current cream/gold/brown design: a clear hero, current property/treatment photographs, labelled sections, bounded photo grids, native FAQ disclosures and a short enquiry form. The family retreat's duplicate header/menu is removed. Existing revenue URLs are retained; original source content is reorganised, not treated as newly medically approved.

All ten /lp/ routes now render in staging, use the current typography and colours, show real photographs on mobile, and share the existing Priya/WhatsApp and consent implementation. Their short enquiry form validates name/email/consent, retains details on a server error and carries campaign attribution. Staging submission remains closed. Deepu must reconcile the optional-phone frontend contract with server validation, implement delivery, spam protection and consent recording, and prove receipt before activation. No live lead handling is certified here.

Three verified advertising sitelinks redirect permanently: /contact-us.aspx to /contact-us/; /villas.aspx to /our-villas/; /de/behandlung-in-kerala.html to /lp/behandlung-in-kerala/. This does not change live advertising destinations or WordPress production.

Seventeen campaign HTML snapshots were refreshed. Final review found and repaired two truncated captures; a regression test rejects capture truncation. The shared boot implementation remains unchanged.

Validation: 108 unit tests, production build, 17 campaign routes and 10 landing pages checked in separate batches at 1280px and 360px; one H1 and no horizontal overflow on each. Campaign section/enquiry anchors resolve; #chat is a shared JavaScript action rather than a section. The three redirects return 301. Native form required-field validation and truthful staging 503 error handling were exercised locally with synthetic details. Initial image inventory: 354 unique local image paths existed and were nonempty; visible key photographs were inspected. This is not an exhaustive certification of every video, medical claim, tariff, translation or real-world conversion.

Release target is the existing https://ahv-final-staging.vercel.app alias and existing PR309. No production/DNS flip, tracking activation or ad switch. Approved current offers/tariffs, clinical review and delivered-lead tests remain pre-launch dependencies.
