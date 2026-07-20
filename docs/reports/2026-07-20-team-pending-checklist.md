---
report_id: RPT-20260720-RITU
date: "2026-07-20 09:20:00 IST"
task: "Team + owner pending-items checklist, mailbox-reconciled item-by-item, for Ritu's printout (D-20260720-06)"
project: "OS v2 / web factory"
source_tool: "claude-code Gmail reconcile (director@ inbox+sent, 20 Jul ~09:10 IST) + RPT-20260720-CHASE + QUESTIONS.md"
type: ops-plan
supersedes: null
---

# PENDING ITEMS — one line = one tick (mailbox-checked 20 Jul ~09:10 IST)

Rule used: reconcile-before-chasing. Every item below was checked against the
director@ mailbox this morning — items already answered are marked ✔ RECEIVED
and are NOT to be chased. Nothing is clubbed; tick each line separately.

## A. ABILASH — his own list (today first)

- [x] ✔ DONE — PR #176 MERGED to main (ea6b85a)
- [x] ✔ DONE — PR #180 MERGED to main (6707c55)
- [x] ✔ DONE 20 Jul ~12:5x IST BY AGENT (D-20260720-17 click delegation): kfi5o3g1a promoted to Production (new dpl_5xTuSrpwe, READY; public alias verified pointing at the full-site build)
- [ ] One word — Q-BAKEOFF-VERDICT: KEEP-NARROW / WIDEN / DROP (DataForSEO)
- [x] ✔ OBSOLETE 20 Jul — the update installed Python 3.12.13; hook fires + commit detection PROVEN. Live successor one-worder: Q-SECURITY-HOOK-CREDENTIALS — (a) ANTHROPIC_API_KEY env / (b) upstream issue / (c) both
- [ ] One word — Q-AUDITORS-YML: RELAND / DELETE (orphaned CI gate, paid keys idle)
- [ ] One word — Q-A13-REQUIRED-CHECK: GO (then one branch-protection click)
- [x] ✔ DONE 20 Jul (owner) — billing verify + payments settings submitted; profile "In review"; the 1-critical-alert chip = the pending verification itself, no further user action (machine-checked)
- [ ] Create kairali-os-bot GitHub account + give repo write (kills the approve deadlock)
- [ ] Q-CLASSMAP-UNKNOWNS — 4 one-worders (kairali.ai ×2, kairaliproduct.com, kairaliequipment.com)
- [ ] evolution/channels.yaml — ratification word
- [ ] READ Anupam's reply of 18 Jul 17:19 (UNREAD in inbox — status on the 3 open items)
- [ ] kairaliequipment.com: review PR #131 (your own auto-merge fires on it) — AGENT HOLD on the f3klajuzg promote: that build is from the UNMERGED #131 branch (dirty tree); promoting before your review would publish ahead of the gate. Order: your review → merge → agent promotes a post-merge build
- [ ] Villa Raag: feedback round + emblem SVG + Q-VR-DISTANCES one-worder
- [ ] 15-min self-chase per RPT-20260720-CHASE (anything above still unticked by evening)

## B. SUNAJ — sysadmin@kairali.com — HIS DEADLINE IS TODAY EOD (his mail of 19 Jul)

- [ ] director@ = OWNER on every Search Console property (11+, both Google logins — list is in his mail)
- [ ] director@ = ADMINISTRATOR on every GA4 account (~15 — map is in his mail)
- [ ] Cleanup LIST of inactive/duplicate GSC properties + GA4 accounts (LIST ONLY — owner confirms per item, nothing closed)
- [ ] Find which login owns each of the 5 orphan GSC properties (villaraag domain / kairali.com / kairaliayurvedainstitute / kairalitraining / keralatraining) + add director@ as Owner
- [ ] kairali.ai DNS: agree a flip slot (records come prepared; old Plesk serves a 500)
- [ ] Reply to "Server-side readiness — 8 rebuilt sites" (sent 18 Jul, no reply yet)
- [ ] Reply to "Four small items still open" (sent 17 Jul, no reply yet)
- [ ] Give Shadab the Shopify store access he is waiting on (Shadab's 18 Jul reply says he waits on Sunaj/Ambuj)

## C. VIKASH — seo@ktahv.com

- [ ] GA4 stream CORRECTED to arogyashala.in (his 19 Jul reply used arogyashala.CO.in — correction sent 19 Jul 17:18, no reply yet)
- [ ] GTM container ID (asked in the same correction mail)
- [ ] Answer the account-structure question (one GA4 property per site?)
- [ ] The 11-URL list for the first whyayurveda.org content batch
- [x] ✔ RECEIVED 18 Jul 17:42 IST — Vikash sent them on a NEW thread "Author Transcript" (19f7524311376698, Gita + Abhishek + Abhilash Drive links) + Drive share "Abhilash Sir Transcription- 1.docx"; the 09:10 reconcile missed it because it was not a reply on the ask thread (phantom-pending). Author-voice ingestion queued
- [ ] (joint with Sunaj) GA4 Admin grants — Section B items apply to him too

## D. SATYAM — dme@kairali.com

- [ ] Reply to "CRM read access + schema" (sent 19 Jul, no reply yet)
- [ ] Acknowledge "Forms check — 8 preview sites" (sent 18 Jul, no reply yet)

## E. SHADAB — developer6@kairali.com (Shopify pilot is TODAY)

- [ ] Confirm store access received (he waits on Sunaj/Ambuj — unblock via Section B/F)
- [ ] Confirm v2 instruction doc reviewed + a pilot start time today

## F. AMBUJ — dme@kairaliproducts.com

- [x] ✔ DELIVERED 20 Jul 10:21 IST, half-defective — .in token VALID; .com token is an ADMIN token (shpat_, sent over plain email, against the explicit ask). RESOLVED 20 Jul ~11:50 IST: owner sent the rotate mail; Ambuj revoked the admin token (dead) + issued a proper read-only Storefront token for .com (thread 19f704a636f7debb). BOTH stores now have valid tokens — Track B microsites lane UNBLOCKED (tokens go to Vercel env only, never the repo)

## G. ABHISHEK + GAURAV — abishek@kairali.com / ops@kairalicentres.com

- [x] ✔ RECEIVED 19 Jul: Centres lead/booking workflow map (Gaurav's full reply — already ingested)
- [ ] kairalicenters.com GSC: 16-month export or access grant (TIME-SENSITIVE — data deletes on a rolling window; sent 19 Jul, no reply yet)
- [ ] (later, not chased now) CRM endpoint access once their rollout completes

## H. ASTHA + ANUPAM — ho.mkt@kairaliproducts.com / mkt@ktahv.com

- [ ] Canonical social-media links list, all entities (sent 18 Jul, no reply on THAT thread)
- [ ] Marketing review round on the 8 preview sites (sent 18 Jul, no reply yet)
- [ ] Anupam: banned words on 9 live KTAHV pages — verify done (his 18 Jul reply claims progress; owner reads + confirms)
- [ ] Anupam: remaining items from the "3 open items" thread after owner reads the reply
- [ ] Anupam: kairali.guru training prices (standing ruling: prices come from Anupam)

## I. DEEPU (web developer) — developer@kairali.com

- [ ] Reply to "Tech check — 8 rebuilt sites on Vercel previews" (sent 18 Jul, no reply yet)
- [ ] Novamira install on WP staging + bookmarks + verify prompt (gates the FIRST content-pipeline item)
- [ ] Two open items from the 17 Jul "indexing fixes" mail

## J. DR. DEEPU JOHN (chief physician — via Abilash, never direct)

- [x] ✔ SENT 20 Jul 11:54 IST — plain-English 8-point sign-off request emailed DIRECTLY to doctor@ktahv.com per D-20260720-15 (routing change: owner granted direct-send for doctor approvals; msg 19f7e32b1784b0cf, CC ea.abhilash@). Now awaiting Dr. Deepu John's one-email reply

## K. PARKED (do not chase)

- Eeshal: kairali.guru DE/FR/AR/RU = Wave-2
- WordPress.com connector re-add = before first whyayurveda batch (BACKLOG)

*Generated from the director@ mailbox + RPT-20260720-CHASE + QUESTIONS.md.
When an item is done, tick it here AND tell the OS session so the trackers
update — a tick on paper that never reaches the repo is how drift starts.*
