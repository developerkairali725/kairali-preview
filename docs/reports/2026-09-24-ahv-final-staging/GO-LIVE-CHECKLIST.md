# AHV launch checklist — 24 September 2026

Task: **WOPS-AHV-FINAL-DRAFT-20260924-001**. Scope: **Ayurvedic Healing Village, English website only**.

**The only final staging address: https://ahv-final-staging.vercel.app**

**Final staging means the consolidated handoff build. It does not mean approved for production.** Deepu can start integrating forms against this branch now. The live domain has not been moved. Old deployment URLs are historical snapshots, not separate workstreams. Keep this staging address when the underlying approved deployment changes.

Release PR: https://github.com/kairali-digital/kairali-web-factory/pull/309

Working branch: `codex/ahv-english-staging-20260915`. Site directory: `sites/ayurvedichealingvillage.com`. The repository is a multi-site monorepo; this handoff authorizes AHV work only.

## How to use this checklist

A checked item has recorded evidence. An unchecked item is a required verification or an explicitly identified decision, not a claim that the feature is absent. Recheck release-critical items on the final frozen commit after forms are integrated. Record date, person, commit/deployment and evidence next to each completed item. Owners below are proposed work responsibilities; this document does not create employee assignments or fabricate delegation IDs.

**Do not launch while any hard blocker remains:** real form delivery; unresolved required checks and authenticated approval; applicable offer/tariff facts; production indexing and legacy URL coverage; production configuration; rollback readiness. New medical FAQ answers stay unpublished unless Dr. Deepu John approves them. Keeping currently approved content is an alternative to waiting for optional new content.

## 1. Questions requiring a human answer

**End-of-day authority:** use [the consolidated 23-question queue and team-input register](OWNER-DECISIONS-AND-TEAM-INPUTS.md) one question at a time, starting with the latest approved rates PDF. The list below is the earlier launch-gate grouping; settled decisions must not be re-asked. Historic CI descriptions require fresh verification because campaign/LP behaviour has since changed.

1. **Abhilash — launch window and authority:** Who gives the final go/no-go, who operates the cutover, and what time window is acceptable? The current instruction establishes staging, not an immediate domain flip.
2. **Abhilash / Deepu — enquiry routing:** Confirm the destination inbox and CRM/queue for general enquiries, consultations, OPD, training, careers, and newsletter subscriptions. `info@kairali.com` is already confirmed for management feedback; do not ask for that decision again.
3. **Patient care — operational response:** Who owns each incoming lead, what response commitment can the site truthfully display, and who handles unattended/out-of-hours messages?
4. **Business owner — new tariff:** What approved INR/EUR rates apply after **30 September 2026**? Confirm validity, minimum stays, taxes, villa/occupancy rules and authoritative PDFs. The current treatment tariff expires on that date; training tariffs have their own validity.
5. **Anupam — offers:** Which offers are active, with approved eligibility, price/discount, dates, exclusions, cancellation rules and images? Resolve the Defence percentage/URL and overlapping stay-band discrepancies. Existing request: **MID-12046 / SF-67-DID-12046**; do not create a duplicate.
6. **Rana / Dr. Deepu John — public staff facts:** Supply verified practice-start years, current roles/qualifications, portraits and permission to publish for doctors, nurses and yoga staff. Existing request **MID-20136 / DID-20136**. A list of names alone does not establish experience. Quotes are optional, not required for launch.
7. **Property team — room facts still unconfirmed:** Confirm refrigerator/coffee-maker availability and any unverified occupancy or room-area figures. Hairdryers in all four categories and the different Maharaja 1001/1002 layouts are already confirmed by Abhilash.
8. **Anupam — villa photographs:** Which approved current interior/exterior images are available for every physical room? Existing **MID-14163 / SF-59-DID-14163** includes the image inventory and linked Excel request. Do not delay all launch work for photography if accurate approved existing images are acceptable to the owner.
9. **Abhilash — review feed:** Launch with attributed existing reviews, or authorize Google Places credentials, restricted API quota and any billing for a live feed? No account, key or paid subscription is claimed to exist. A live feed is optional if the fallback remains honest.
10. **Abhilash / Vikash — domain and legacy coverage:** Confirm the exact production-domain cutover plan, preferred apex/www host, booking subdomain, paid landing URLs, and treatment of existing DE/FR or other legacy URLs during an English-only release. English-only does not authorize breaking live non-English campaigns.
11. **Vikash — measurement:** Confirm the production activation decision and success-event destination for this AHV property. Staging must remain excluded. Do not substitute IDs from another Kairali site.
12. **Business/privacy owner — data handling:** Confirm form retention, who can access medical messages/uploads, approved privacy/consent text and deletion process. Marketing subscription must be separate from an ordinary care enquiry.
13. **Abhilash / engineering owner — CI contract conflicts:** Resolve the inherited group-social test versus the approved property footer, the consent test that includes GET search forms, and the production LP performance suite running against deliberately blocked staging LPs. Fix the contract with evidence; do not add marketing consent to search or lower thresholds to make a check pass.
14. **Abhilash — final GitHub approval:** Submit the required authenticated review on PR309 **after the last release push**. The bot cannot provide your review or bypass protection. Earlier approval on an older commit is insufficient for the current gate.

## 2. Consolidation and handoff

- [x] Establish one stable staging hostname: **ahv-final-staging.vercel.app**.
- [x] Use existing PR309 and its existing branch as the English handoff workstream.
- [x] Preserve older immutable previews as historical rollback/evidence snapshots; they are not current review links.
- [x] Prepare a canonical repository handoff and replace the stale build-status introduction.
- [ ] Deepu opens the stable URL using authorized Vercel access and confirms the repository/branch/site directory before coding. Keep deployment protection; do not send tokens in email or documents.
- [ ] Record the final tested commit and Vercel deployment ID when forms are complete; update the stable alias only after that deployment is READY and verified.
- [ ] Keep unrelated/older migration PRs clearly separate; PR284 and PR285 contain unique historical work and are not automatically safe to merge or delete.
- [ ] Record an explicit freeze after owner acceptance. Any later change triggers only the affected checks plus release smoke tests.
- [ ] Verify all required GitHub checks on that exact commit. A Vercel READY build or successful security review is not the same as all checks passing.
- [ ] Save the final review outcome, unresolved exclusions, rollback target and launch owner in the release record.

## 3. Deepu's forms implementation — hard launch blockers

- [ ] Inventory every English form and submit-like control: enquiry, contact, consultation, OPD, booking handoff, programme/training/workshop requests, careers/apply, newsletter, complimentary guide and exit popup. Distinguish actual forms from links and visual placeholders.
- [ ] Reuse the existing server enquiry contract where appropriate; connect each visible form's fields and endpoint. Removing the global staging submit guard alone does not wire a form.
- [ ] Retain staging noindex, tracking locks and production-recipient isolation while using an approved test backend. **Do not set `AHV_STAGING=0` simply to test forms.** The current enquiry endpoint intentionally returns 503 before storing staging submissions.
- [ ] Implement server-side field validation, length limits, explicit error messages and accessible success states; verify mobile keyboard/autocomplete choices.
- [ ] Require one appropriate contact method. Make email/phone conditions understandable; reject invalid or empty submissions without discarding the user's draft.
- [ ] Persist a lead successfully before claiming success. Handle email/CRM delivery failures with durable retry and a truthful acknowledgement; do not show a success message for a failed request.
- [ ] Keep credentials server-side and out of browser bundles, screenshots, repository and logs.
- [ ] Add proportionate spam/rate protection without an inaccessible puzzle. Verify duplicate-click/retry idempotency and abusive-input handling.
- [ ] Complete enquiry privacy/consent requirements with the approved text. Do not force promotional subscription as a condition of asking for care.
- [ ] Preserve homepage programme/interest and arrival/departure prefill, direct focus/scroll to the form, and visitor-editable WhatsApp message preparation.
- [ ] Validate date order, timezone boundaries and expired tariff transitions. Do not imply that choosing dates confirms availability or a booking.
- [ ] Preserve relevant programme/campaign attribution without exposing personal or medical messages in URLs or analytics.
- [ ] Deliver the complimentary guide email after a valid address is submitted; retain the promised download/acknowledgement flow. The current required-email browser gate is not actual email delivery.
- [ ] Replace the decorative newsletter field/link with a real subscription flow and approved acknowledgement/unsubscribe process, or obtain an owner decision on its release treatment.
- [ ] Build **one shared short enquiry popup** using the same backend: name + one required contact method + optional message, with programme/date context. Cover native and design-runtime English pages.
- [ ] Verify popup desktop exit behaviour and mobile engagement trigger; avoid duplicates, repeated interruptions and opening while a visitor is already completing a form. Add dismissal cooldown, Escape, focus trap/return and clear close control.
- [ ] Confirm any popup incentive has approved terms before production. Staging promises have deliberately been retained by owner instruction; this is not evidence of live fulfilment.
- [ ] Keep management feedback as an explicit email-client/WhatsApp action where intended: prefilled `info@kairali.com` mail and Priya escalation. Do not tell a visitor it was sent merely because a composer opened.
- [ ] Test every form type with clearly identified synthetic data: success, missing fields, bad input, server outage, slow response, repeat clicks and back/refresh. Confirm receipt in the designated destination, not just HTTP 200/201.
- [ ] Verify any careers upload restrictions, storage access and retention before enabling uploads. Do not introduce real patient records into staging.
- [ ] Confirm patient-care/management staff can see and act on test leads and know the escalation procedure.
- [ ] Wire conversion events only to genuine successful submissions, with a stable deduplication ID and consent checked at firing time. Keep CTA clicks distinct from submitted leads.

## 4. Content and factual readiness

- [ ] Replace or explicitly approve continued use of tariff PDFs and all derived programme totals before the relevant expiry. Audit treatment and training price sources independently.
- [ ] Read back every newly supplied offer against Anupam's approved terms; update visible copy, links and structured data together.
- [ ] Replace unverified staff experience figures only after Rana supplies dated evidence. Compute elapsed experience from an approved start year, not an annually typed number.
- [ ] Keep the **217 draft medical answers across 31 programme pages** outside published content until Dr. Deepu John approves them. Straightforward editorial fixes have a separate implementation record.
- [ ] Check current medical statements, medicine/suitability/safety/companion/follow-up answers against approved content; do not promise an outcome.
- [ ] Confirm villa details: 1001 king bedroom + living room, each with bathroom/wardrobe; 1002 king bedroom + twin bedroom, each with bathroom/wardrobe; hairdryers across Deluxe, Classic, Royal and Maharaja.
- [ ] Match each villa image to the correct room/category; record photographer/source, permissions and useful alt text. Keep the image inventory linked to actual accessible files.
- [ ] Verify review excerpts remain authentic, attributed and dated; translations are labelled. Do not imply old reviews are fresh API results or invent customer images.
- [ ] If activating Google review data, verify the exact property Place ID, server-key restrictions, API quota, attribution and failure state. The Places response is not a full chronological review archive.
- [ ] Verify Tripadvisor fallback/link remains usable if a widget is blocked. Do not route satisfied and dissatisfied visitors to different public-review channels.
- [ ] Recheck all public contact methods and visible labels: WhatsApp, phone, email, social messaging, maps, booking and management feedback.
- [ ] Retain the approved House Rules artwork and founder-letter consolidation; do not reopen settled design choices without a regression.
- [ ] Confirm approximate sightseeing distances are described as approximate road guidance, with route variability; verify destination links and any time-sensitive access advice.
- [ ] Check no internal audit notes, placeholder labels, duplicate headings or source-provenance fields leak into customer-facing copy.
- [ ] Flag English-only content explicitly in the release record; schedule translations separately rather than generating unsupported language parity.

## 5. UX, accessibility and search regression checks

- [ ] Test desktop, tablet, 390px mobile and narrow 320px layouts on the frozen release; include actual Safari/iOS and Chrome/Android checks.
- [ ] Verify one responsive consent banner across native and runtime pages, retained choice, keyboard operation and no overlap with chat or booking controls.
- [ ] Verify one consistent Priya chat and WhatsApp pair across all English template families; chat must open and close, not only show an icon.
- [ ] Confirm secondary page navigation **replaces the primary while scrolling**, as the owner requested, on package/course pages on desktop and mobile. Check anchor offsets and return to the top.
- [ ] Confirm one clear expandable left section navigation, correct active page, and no duplicate left-hand rails. Include yoga theory/practical and sightseeing.
- [ ] Check primary CTAs remain visible, keyboard reachable and at least 44px touch targets. Complete the `data-cta` contract during conversion wiring without activating staging analytics.
- [ ] Verify homepage preferred-date year does not clip; search/date enquiry prefill, villa descriptions and complimentary-guide email gate work.
- [ ] Test all English search surfaces: header/modal, mobile menu, homepage finder, main results, six programme finders, FAQs and sitemap search.
- [ ] Repeat representative natural-language, spelling, symptom, duration, price, room-number and hairdryer queries; test empty/no-result/error states and clearing filters.
- [ ] Verify duration filters survive sorting, result counts match visible results, all results remain available and Enter does not unexpectedly navigate.
- [ ] Verify hidden results cannot receive focus and a new FAQ query does not retain an unrelated open answer.
- [ ] Rebuild and check search-index freshness after final content changes. Keep test/confirmation/internal routes out of search.
- [ ] Verify external links—including YouTube, maps, news, products and footer—open as labelled in a separate tab; retain `noopener` protection.
- [ ] Check How to Reach steps 1–4, Previous/Next boundaries, image-click enlargement, Escape/focus return and labelled Google Maps directions.
- [ ] Check footer spacing, tariff/CTA spacing, offers alignment, partner-logo sizes and no broken or stretched images.
- [ ] Audit headings, labels, visible focus, contrast, alt text, reduced motion, keyboard menus/dialogs and accessible error announcements.
- [ ] Run production-representative performance/accessibility checks against actual eligible pages, plus the preserved paid landing pages. Keep existing budgets; resolve CI environment mismatch instead of suppressing failures.

## 6. Technical release, SEO and AI discoverability

- [ ] Freeze one commit with an installable lockfile, successful production build, unit/search tests and all required CI/review evidence. Resolve unrelated monorepo failures with their owners; AHV completion cannot claim another site's deployment is healthy.
- [ ] Resolve the 87 inherited evidence-manifest findings through a provenance-preserving migration; retain original source bytes and producer history. Resolve the inherited factory-test contract conflicts and missing CTA instrumentation before merge. Tests must represent the approved site behaviour; do not silently weaken them.
- [ ] Review dependency/security findings by severity and applicability; fix release-relevant issues and record accepted risks. A build pass alone is not a security audit.
- [ ] Confirm environment variables and server secrets separately for Preview and Production; restrict access and avoid copying production patient data into preview.
- [ ] Build a **new production-configured artifact** with the approved settings. Do not blindly promote the noindex, form-blocked staging artifact: `AHV_STAGING` affects build-time output.
- [ ] Verify production metadata before the public switch: title/description, canonical, one intended robots policy, social cards and correct host on representative page families.
- [ ] Verify production robots.txt and XML sitemap expose only eligible canonical pages; staging stays noindex/disallowed with its intentionally empty sitemap.
- [ ] Verify Google/Bing ownership meta remains present independently of analytics activation.
- [ ] Validate meaningful initial server HTML, crawlable links and structured data matching visible approved facts. Keep unapproved medical answers and unsupported review aggregates out of schema.
- [ ] Preserve the approved canonical host and trailing-slash policy. Check canonical URLs resolve directly to 200 rather than through redirects.
- [ ] Validate all owner-approved 301s, including Founder’s Message → About Us and all four distance pages → Sightseeing. Update internal links directly and remove retired URLs from navigation/search/XML.
- [ ] Audit the actual live high-traffic, indexed and paid URL inventory, including `.html`, `.aspx`, case variants, PDFs, media, blog and language routes. A count of English pages alone cannot prove legacy coverage.
- [ ] Confirm Vikash's per-URL paid destination approval and preserve campaign query strings. Do not infer that blocking old `/lp/` paths in preview is acceptable on the production domain.
- [ ] Confirm existing DE/FR paid or indexed paths keep an approved destination while the redesign remains English-only. Avoid a blanket redirect to an unrelated homepage.
- [ ] Test unknown URLs return a genuine helpful 404, retired intentional URLs use their approved status, and redirects have no loops or unnecessary chains.
- [ ] Verify share-image/media/font/PDF bytes are deployed and cache headers permit changed design payloads to refresh. Restore the documented private asset bundle on a clean clone.
- [ ] Verify HTTPS, apex/www handling, booking subdomain independence, Cloudflare/Vercel settings and relevant security headers without disturbing email DNS.
- [ ] Check WAF/bot settings do not accidentally block intended search crawlers. Accurate crawlable content supports AI discovery; no checklist can guarantee Google rankings or AI citations.
- [ ] Verify consent before and after production measurement activation, correct AHV IDs, zero duplicate installations and successful-submission event deduplication with Vikash.
- [ ] Define API error logging/alerts that omit personal/medical payloads; restrict staff access and verify recovery procedures.

## 7. Before the switch — go/no-go meeting

- [ ] Abhilash accepts the frozen staging build and any explicitly deferred non-blocking enhancements.
- [ ] Deepu demonstrates delivered enquiries, guide delivery and popup submission with verified destination receipts.
- [ ] Clinical/business owners sign off the facts actually being released; optional unapproved additions remain excluded.
- [ ] GitHub required checks and authenticated owner review pass on the exact final commit; merge through the existing protected process, without agent bypass.
- [ ] Capture restorable WordPress files/database/configuration and existing host/DNS/CDN settings using approved backup storage. Keep an independently reachable rollback origin; do not put dumps in Git.
- [ ] Record the previous live target, new deployment, launch operator, verification owner and rollback steps. Test restoration of the relevant configuration in a safe environment.
- [ ] Agree rollback triggers: unusable enquiries, critical paid/indexed URLs failing, major rendering errors, security/data incident or unintended indexing/tracking behaviour. Set the decision owner and acceptable recovery interval.
- [ ] Confirm recipient staff availability, outage communication and the change window. Do not assume a sent notification equals operational readiness.
- [ ] Warm/verify the production artifact through an approved private access method and perform final smoke tests before switching public traffic.
- [ ] Perform only the authorized domain/routing change; keep a timestamped before/after record. Do not change mail records or unrelated properties.

## 8. Immediately after launch — first 0–2 hours

- [ ] Verify the public apex and www from more than one network/device; HTTPS, primary redirects and the correct release are visible.
- [ ] Check homepage, contact/enquiry, consultation, each programme family, villas, offers, reviews, FAQs/search, navigation, sitemap and important paid URLs.
- [ ] Submit one clearly labelled synthetic enquiry per implemented delivery type and verify durable receipt, staff routing and acknowledgement; remove/label test data through the approved process.
- [ ] Confirm WhatsApp/mail/maps/booking actions and Chatbase/Priya open the intended destination with useful context.
- [ ] Verify the production robots header/meta/robots.txt/XML and canonical host. Confirm the stable staging URL remains protected/noindex and separate.
- [ ] Recheck consent accept/decline/revisit, analytics activation state and submission conversion deduplication with the correct AHV account.
- [ ] Watch application errors, API failures, delivery queues and unexpected 404/5xx responses; compare to rollback triggers.
- [ ] Purge only relevant stale caches once if needed; confirm new content from the edge. Do not repeat deployment/DNS changes while normal cache/TTL propagation is occurring.
- [ ] Submit the production sitemap through the existing authorized Search Console/Bing property, check fetch acceptance and record the result. Submission is not instant indexing.
- [ ] Record launch completion with the actual production URL/commit and hand over active monitoring ownership; retain the previous origin and rollback package.

## 9. First 24–48 hours

- [ ] Compare submissions saved, notifications sent, CRM entries and staff-received enquiries; investigate missing or duplicate leads.
- [ ] Review delivery bounces, spam/rate limiting, guide delivery, popup frequency and abandoned/error states without exposing medical messages in reports.
- [ ] Recheck priority paid destinations and attribution after real traffic returns; coordinate with Vikash before modifying campaigns.
- [ ] Inspect server/edge error logs for legacy URLs, missing assets and redirect loops; repair evidenced regressions rather than mass-redirecting unknown traffic.
- [ ] Verify returning-browser cache behaviour and consent persistence on mobile and desktop.
- [ ] Check search queries/no-result examples only through an approved privacy-preserving measurement method; tracking is not implicitly authorized by this checklist.
- [ ] Confirm staff know where enquiries appear and escalation is functioning; compare actual response time with the website promise.
- [ ] Recheck production access/security and the staging noindex/protection boundary after any configuration change.

## 10. Days 3–7, then weeks 2–4

- [ ] **Days 3–7:** inspect Search Console/Bing coverage, sitemap processing, selected canonicals and important redirects. Crawling/indexing may take days or weeks; distinguish processing delays from concrete errors.
- [ ] **Days 3–7:** compare top landing-page traffic, impressions, clicks and real enquiries with an appropriate pre-launch baseline; account for seasonality and low volumes.
- [ ] **Days 3–7:** review paid landing performance and genuine successful-lead conversions with Vikash; do not treat clicks as leads or make duplicate tracking changes during processing delay.
- [ ] **Days 3–7:** check representative real-device accessibility, page speed and form usability with staff feedback.
- [ ] **Before 1 October:** ensure the approved replacement treatment tariff is effective everywhere if the site is then live. Do not continue calculating fresh quotations from an expired price list.
- [ ] **When Rana replies:** update only verified staff facts/photos and derive experience from an approved start date; obtain clinical approval where applicable.
- [ ] **When Anupam replies:** incorporate approved offers/villa images from the existing assignments; verify each changed page and index, with no duplicate delegation.
- [ ] **Weeks 2–4:** evaluate field performance; Core Web Vitals field reports commonly use a rolling 28-day window, so do not expect them to reset on launch day.
- [ ] **Weeks 2–4:** compare relevant search-result quality, failed queries, enquiry completion and content freshness; prioritize evidenced improvements before adding an AI search service.
- [ ] **After a stable observation period:** owner decides when to retire the old origin/backups under the agreed retention plan; do not delete rollback resources automatically.
- [ ] **Separate follow-up:** implement approved medical FAQs, new photographs, optional live-review integration and other-language work through their own acceptance checks.

## Recorded dependencies and limits

The Anupam/Rana IDs above were verified earlier in this task; live status must be checked before follow-up to avoid duplicate work. Separate performance KPI mappings are not yet verified. Cody account setup remains a dependency owned by Ambuj under **MID-19918**; this document does not claim a live self-assignment. No email or new employee assignment is sent by preparing this handoff.

The source audit, earlier page-family checks and this checklist are evidence of scoped work, not a blanket claim that all production requirements passed. The accompanying `CI-STATUS.md` records remaining failures and the exact distinction between staging readiness and live readiness.

## Evidence already received — do not request it again

COS's records-only handoff on 24 September confirms receipt of Deepu's 21 September WordPress inventory: https://docs.google.com/spreadsheets/d/1J9RIHQh418NIXirA5dMKSta6GYLLgTXB9trQxWoQUnc/edit . His reported removal of noindex on `/learn-about-ayurveda/` and `/retreats-for-everyone/`, retained sitemap inclusion and monsoon self-canonical repair are recorded under existing **MID-18813** (due 27 September) and **MID-13695** (due 24 September), both still Pending. These are reported WordPress corrections, not proof of complete Next.js migration coverage.

His 19 September WPForms report identifies 11965/18926 → `/emailsubscriber/` and 8055 → the booklet PDF. Use this as input to the form inventory, not proof that the new Next.js forms deliver. Attachments were reported, not independently inspected in this handoff. The nine-day workshop PDF search was already acknowledged; the archive response from Sunaj remains a separate missing-file dependency. COS has already sent the acknowledgement; no duplicate email or assignment is needed.

## End-of-day additions — rates, feedback freeze and translation

- [x] Consolidate outstanding AHV workspace inputs, settled decisions and team references in OWNER-DECISIONS-AND-TEAM-INPUTS.md.
- [x] Repair mobile home hero cropping and remove redundant footer year range; preserve the copyright and heritage tagline.
- [ ] Triage team feedback due Saturday 26 September 18:00 IST against this same staging alias.
- [ ] Receive the owner’s latest approved rates PDF; record source/version/hash, approval, effective dates, currencies and superseded documents.
- [ ] Reconcile PDF prices with accommodation, programme pages, finders/search totals, offers, campaign/LP copy, FAQs and download links in batches of at most 25; validate tax/occupancy/minimum-stay/inclusion assumptions.
- [ ] Expiry boundary: test 30 September/1 October; do not publish expired totals merely because a build permits expired source data. Training/yoga/OPD validity must be checked separately.
- [ ] Receive Vikash’s 25 September source handoff; reconcile received ad/WordPress inventories and test final imports without restoring old layouts.
- [ ] Complete developer form delivery and clinical review separately; identify developer Deepu Sahani versus Dr. Deepu John clearly.
- [ ] Freeze approved English content before batch translation; confirm language priority, reviewers, market currencies/PDFs and release timing.
- [ ] Translate UI, forms, validation, search, metadata, alt text and approved medical copy along with pages; human-review each batch.
- [ ] Verify locale routes, lang/hreflang, canonicals, sitemap coverage, redirects, search and mobile layouts; retain working legacy non-English paid URLs until replacement is ready.
- [ ] After rates/translation release, monitor stale PDFs/cache/search snippets, incorrect language redirects, form delivery by locale and conversion changes. CDN and search-index updates have processing windows; verify rather than repeatedly redeploy.

The existing before-launch, immediate-release, 24–48-hour, days-3–7 and weeks-2–4 checks remain required. Today’s 108 passing site tests are scoped evidence, not a declaration that GitHub release gates or real form delivery are complete.
