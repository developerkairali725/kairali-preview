---
report_id: RPT-20260720-CHASE
date: "2026-07-19 22:40:00 IST"
task: "Monday 20 Jul owner chase sheet — every person + exactly what the OS needs from them (D-20260719-31)"
project: "OS v2 (post-M1; M2 in flight)"
source_tool: "claude-code session compile (mailbox-reconciled 19 Jul ~21:00 IST)"
type: ops-plan
supersedes: null
---

# MONDAY 20 JUL — CHASE SHEET (phone order, highest-leverage first)

Mailbox-reconciled 19 Jul night (reconcile-before-chasing rule). The 09:30 scheduled task
auto-chases items 1/4/5 by email; your calls accelerate. "Done-when" = what to demand before
hanging up.

## 1. Sunaj Sahoo — IT Manager · sysadmin@kairali.com · +91 88260 21114
Deadline he already holds: **TODAY EOD** (your 19 Jul HIGH-PRIORITY mail + clarifier).
- director@kairali.com = **OWNER on every Search Console property** (11+ across both Google logins).
- director@kairali.com = **ADMINISTRATOR on every GA4 account** (~15; the map is in his mail).
- **Propose-first cleanup LIST** of inactive/duplicate GSC properties + GA4 accounts (two Villa
  Raags, SpaZense, Tourdenight, Kerala-named…) — list only; you confirm per item; nothing closed
  that holds unexported history (D-26 safety clause).
- The **5 orphan GSC properties** (villaraag domain · kairali.com · kairaliayurvedainstitute ·
  kairalitraining · keralatraining): find which login owns each, add director@ as Owner.
- **kairali.ai DNS**: flip to Vercel (old Plesk serves an iisnode 500) — records get prepared
  agent-side; he executes.
**Done-when:** Owner/Admin visible from director@ everywhere + cleanup list in your inbox + a DNS slot agreed.

## 2. Vikash Jha — SEO Manager · seo@ktahv.com · +91 70654 17063
- Joint owner of the same EOD access task (above).
- **arogyashala GA4 fix** (your 19 Jul 17:18 correction, unanswered): edit the stream URL from
  www.arogyashala.co.in → **https://arogyashala.in** · send the **GTM container ID** (GTM-XXXXXXX)
  · answer **per-site vs group-level** GA4/GTM — his one answer patterns all ~15 sites.
**Done-when:** corrected stream + GTM id + the one-line structure answer, in the email thread (written, not verbal).

## 3. Shadab Ali — Shopify developer · developer6@kairali.com (CC Sunaj)
**TODAY is the agentic-pilot day (D-20260718-06)** and his access reply is 2 days overdue (sent 18 Jul 17:08).
- Store list + staff access for the READ-ONLY agent lane + theme/token access per the v2 rollout
  doc you sent him 18 Jul 16:36. Astha approves batches; doctrine j–s binds (humans publish).
**Done-when:** access/tokens usable; pilot can start same day.

## 4. Satyam — central CRM (commercial truth)
- **Read-only access/endpoints** to the central lead DB (your 19 Jul mail, unanswered).
- The **UTM/source field map**: exactly which field stores lead source today, per channel — this
  is the known gap (D-20260719-21) the M3 measurement layer must fix; his field names decide the build.
- **PMS names** used for KTAHV + Villa Raag bookings (reconciliation depth; non-blocking).
**Done-when:** endpoint + credentials handed to the OS lane + the field list in writing.

## 5. Abhishek + Gaurav Saraswat — Centres
- **Abhishek**: add director@ as **Owner on kairalicenters.com GSC** (your 19 Jul mail, unanswered).
- **Gaurav**: his workflow map arrived 19 Jul 17:19 — **thank him, it was complete.** Only ask:
  a **target date** for the new-CRM Gurgaon pilot completion (the promised read endpoint follows
  it; we deliberately don't chase before rollout).
**Done-when:** GSC access done + a date on record.

## 6. Deepu — web developer (WordPress execution)
- **Novamira install on WP staging** + bookmarks + the verify prompt (Team Workbook human steps)
  — the whyayurveda.org content pipeline's first batch is blocked on exactly this.
**Done-when:** installed, confirmed with a screenshot.

## 7. Dr. Deepu John — chief physician (clinical lane)
- The **8 KTAHV clinical clusters** compiled for the LP rebuild set await his **sign-off**
  (HARD GATE 7). Book a review slot; his notes are as valuable as his yes.
**Done-when:** signed disposition per cluster.

## 8. Astha / Anupam
- **Astha**: confirm her **Shopify pilot batch-approval role** for today + Gate-B audit feedback
  (with Anupam, from your 18 Jul emails).
- **Anupam**: the **kairali.guru price list** (standing item — prices are his).

## 9. Ambuj
- **Track B**: Shopify staff access + Storefront API tokens for the Wave-1 microsites (standing).
- The **~8 legacy domains with NO GSC property** (Q-GSC-COVERAGE): verification records get
  prepared agent-side; he places the DNS/HTML records.

## 10. You — 15 minutes of self-chase (highest money-risk first)
- **GCP billing identity verification — PAST DUE, suspension warning** + the new **tax-info
  form** (both in the billing console; the 09:30 task reminds you).
- **GBP 5-minute trio**: group check + first Insights CSV + application submit
  (docs/sops/gbp-access-runbook.md).
- **Create the agent machine account** (e.g. `kairali-os-bot`) + repo write access — after last
  night's finding (author==owner kills the Approve button), this makes the authenticated-review
  gate go green BEFORE merge instead of you merging over red.
- **4 one-worders**: Q-CLASSMAP-UNKNOWNS (QUESTIONS.md 19:55 entry).

## Explicitly NOT chased (so the calls stay clean)
- Gaurav's read endpoint (waits for their rollout — date only, item 5).
- Site promotes / Villa Raag feedback / Instagram re-mine — site lane, frozen until the M4 pilot.
- GitHub Actions budget at 75% — watch, no action yet.

---

## MAILBOX RECONCILIATION — 2026-07-20 11:31:43 IST (mid-morning update, D-20260720-09/-10)

**Item 9 Ambuj — Storefront tokens: DELIVERED, half-defective.** Reply 20 Jul 10:21 IST (thread 19f704a636f7debb, msg 19f7ddd80bd299da) carries both stores' tokens. The **.in token is valid** (proper Storefront format — goes to Vercel env, never the repo). The **.com token is an ADMIN API token (shpat_ prefix)** — exactly what the ask said not to send: it cannot work in the Storefront header AND it is full-write access exposed over plain email. **Reply draft in director@ (r-2425061058603262229): revoke/rotate first, then issue the real Storefront token — owner clicks send.** Registrar sheet + GSC DNS records (Q-GSC-COVERAGE) remain open with Ambuj.

**Item 2 Vikash — GA4 correction still unanswered** as of this check (thread 19f7550795ad2d32; last message = owner's 19 Jul 17:18 IST three-fix correction). Chase stands. **Transcripts: DELIVERED 18 Jul** — "Author Transcript" thread 19f7524311376698 (Gita Ramesh + Abhishek + Abhilash, Drive links) + Drive share "Abhilash Sir Transcription- 1.docx"; already captured in PR #121; author-voice ingestion queued behind the OS deep-review lane.

**Owner self-items — billing: DONE (owner word, this session).** GCP billing verify + payments.google.com settings both completed. Payments profile 8749-4151-4001 ("Kairali Ayurvedic Group", Organization/India) now shows **In review**; the "1 critical alert" chip is the pending business-identity verification — machine-checked in the payments center this session: **no user-fixable item behind it**; it should clear when Google's review completes. If Google needs documents it emails director@; only chase if the alert survives 3–5 business days. GCP-console detail sits behind a password re-auth (owner-only).

---

## MAILBOX RECONCILIATION — 2026-07-20 19:38:40 IST (evening, pre-chase truth — reconcile-before-chasing)

Today's replies overturn most of the sheet. **Still live chases: Shadab (item 3, now 2 days overdue, pilot-day blocker) and Satyam (item 4, no reply seen).** Everything else moved:

1. **Sunaj (item 1) — CLAIMS ALL DONE, needs machine verify.** "All existing account access has been given done. Vikas check all update if missing" (11:58 IST, HIGH-PRIORITY thread) + "Sir done all pls check below points" on the four-small-items thread (13:15 IST). Also landed: Cloudflare allow rule created + KTAHV password rotated, screenshots attached (13:08 IST) · server-side readiness reply — DNS control available from the domain panel on cutover day + host inventory (14:44 IST) · **AHV staging: "No staging environment is currently available"** (16:52 IST) — the 4 AHV technical fixes have no staging lane; owner decision on how Deepu executes them (HARD GATE 1 keeps the agent out of production WP regardless). NEXT SESSION: machine-verify director@ Owner/Admin across both GSC logins + GA4 before closing the item (trackers drift optimistic AND pessimistic — verify, don't chase).
2. **Vikash (item 2) — ANSWERED WITH PUSHBACK (11:47 IST).** Stream URL stays `www.arogyashala.co.in` ("data will be collected from whichever pages we install the tracking code on"); **structure answer delivered: GA4-only, NO GTM** ("tracking conflicts… faced twice on KTAHV — implement only the GA4 tracking code"); Measurement ID G-HS6BP7Z17Z stands. So: no GTM container ID exists to chase. Owner one-worder next session: ACCEPT-STREAM-NAME (cosmetic mismatch, factory wires G-HS6BP7Z17Z) or INSIST-EDIT. On the access thread (13:00 IST): "Owner Access Given / I Don't Have Right Administrator Access Given" — his GA4 admin gap is now the blocking half of item 1's verify. **Author transcripts delivered** (14:26 IST): Drive links incl. "Abilash K Ramesh" doc — pointer for the author-voice lane (queued behind the OS review).
3. **Abhishek/Gaurav (item 5) — kairalicenters.com GSC Owner ADDED** (ops@kairalicentres.com, 11:20 IST, in writing). The orphan-property list shrinks by one; **kairalicenters.com joins the bulk-export set next session** (searchconsole_kairalicenters · Mumbai — the addendum-8 path). Gaurav target-date ask stands.
4. **Ambuj (item 9) — FULLY RESOLVED (11:49 IST).** shpat_ Admin token revoked in the ayurvedakairali admin; Storefront API enabled READ-ONLY scoped (products/listings/variants); a proper .com Storefront token delivered with endpoint + API version 2026-01. Token values go to Vercel env ONLY, never the repo (HARD GATE 14). Both stores now have valid Storefront tokens → Wave-1 product microsites unblocked on the token axis.
5. **Anupam (item 8) — kairali.guru PRICE LIST DELIVERED (16:11 IST)**: training-program prices incl. the centres' non-residential programs. The standing "prices are his" item lands; the kairali.guru content fixes can now carry real rates (next content wave).
6. **Astha/marketing — CANONICAL SOCIAL LINKS DELIVERED (17:26 IST**, mkt@ktahv cc ho.mkt): per-vertical actual profiles ("Kairali Ayurvedic Group" on LinkedIn/YouTube/Twitter for KTAHV…). This is the input D-20260718-04 (fleet footer social parity) and PR #139 have been waiting for — truth-up rides the site lane (frozen until the M4 pilot; owner may prioritize).
7. **8-site review feedback DELIVERED (17:44 IST**, ho.mkt): per-site copy/brand/imagery feedback (arogyakendra: logo missing, image missing, WhatsApp CTA works…). Site lane, frozen until M4 — filed for the design-feedback queue, NOT actioned.
8. **Deepu — audit round 2 status (18:22 IST)**: items 2 (footer socials placeholder), 4 (/testimonilas/ redirect), 6 done per his list; tech check of the 8 Vercel previews STARTED (16:01 IST). His AHV fixes wait on the staging answer (see item 1).

Routine ops mail (weekly consultation report · KTAHV daily sales · Riya AI daily) noted, not chase items.
