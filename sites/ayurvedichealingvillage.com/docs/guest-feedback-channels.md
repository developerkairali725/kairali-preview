# Guest feedback channels — 24 September 2026

Task WOPS-AHV-FINAL-DRAFT-20260924-001; AHV candidate only.

The native `/givefeedback/` page replaces the old generic article while retaining the original catch-all dataset for rollback. It links to the existing Google Maps and Tripadvisor property listings, welcomes all honest reviews, and keeps public options available regardless of topic. No review gate or star-based routing.

The owner explicitly selected `info@kairali.com` for management feedback. Email quick actions and the message builder set a `For management:` subject and prefilled body. WhatsApp uses the existing patient-care number `919289838797`, addresses Priya and explicitly requests escalation to management. The owner confirms automatic escalation already exists; this UI change does not modify or independently verify that Chatbase/WhatsApp workflow.

The message builder accepts optional name/stay reference, a topic, and required non-whitespace feedback. It opens the guest's email client or WhatsApp with an editable draft, or copies the message. No site submission endpoint, persistence, analytics payload or automatic send is added. The guest sends from their chosen application. If no email client is configured, the page provides the address and a copy option; clipboard failure reveals selectable message text. Delivery and management receipt are not claimed by opening a draft.

Both private quick links work without JavaScript. The interactive builder requires JavaScript; native browser required validation and explicit whitespace validation prevent empty handoffs. Inputs are 16px and actions at least 50px high. Shared consent, patient-care controls and the collapsible section rail are reused. `ReviewsShell` only gains an optional route argument, defaulting to the existing reviews route.

Tests: three feedback-link tests cover Unicode/newlines/reserved URL characters, fixed recipients, optional values, topic allowlisting and ready-to-edit quick drafts. Existing three Google review tests and TypeScript also pass. Browser checks cover desktop/mobile layout, empty and whitespace validation, exact copied message, a real separate WhatsApp tab containing the draft (not sent), public-review access and shared chrome. No employee email or WhatsApp message was sent.

Rollback: restore the backed-up `ReviewsShell.tsx` from a17b5036 and remove this change's added feedback route/test/doc. The old article route remains intact. No production/DNS change.
