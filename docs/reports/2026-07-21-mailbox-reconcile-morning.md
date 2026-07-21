---
report_id: RPT-20260721-MAILBOX-AM
date: "2026-07-21 10:32:00 IST"
task: "Mailbox reconcile item-by-item (handover task 3) + CRM endpoint outside re-probe — post-P1-wave session"
project: "OS v2"
source_tool: "claude-code session (director@ mailbox via Gmail MCP, read-only; curl status-only probes)"
type: ops-plan
supersedes: null
---

# Mailbox reconcile — 21 Jul morning (item-by-item, never clubbed)

All timestamps IST. Mailbox truth outranks trackers (reconcile-before-chasing rule); one tracker
correction found (§3 below) — BACKLOG/brief truth-up rides the session close, NOT PR #215 (its
authenticated approval binds at head; no further pushes to that branch).

## 1. Satyam — CRM lock: NO reply, endpoints STILL HOT (re-probed from outside)

- Thread 19f79a3afc570e69: owner's lock request went 20 Jul 21:43 IST; **no Satyam reply since**.
- Outside re-probe 21 Jul ~10:26 IST (status codes only, no bodies):
  `/api/leads` → **HTTP 000 (hangs, 12s timeout)** · `/api/conversion` → **HTTP 200, NO AUTH**.
- Identical to the 00:0x probe. **Endpoints stay HOT; nothing gets wired** until his written lock
  AND an outside probe shows denied. His stated window was "first task today" — not yet stale.

## 2. Shadab — silent; noon deadline live at time of writing

- Zero mail from developer6@ since 18 Jul 17:25. The 20 Jul 21:42 escalation demanded a written
  answer by **today Tue 21 Jul (12:00 noon per the handover)**. At 10:32 the deadline has not
  passed — nothing to escalate yet; the further-escalation draft stays staged, owner's word fires it.

## 3. kairali.guru corrective — ALREADY SENT by owner (tracker was stale), with two flags

**Finding:** the "staged Sunaj corrective draft (r-5458169620961505077)" recorded as owner-owed in
the morning handover/BACKLOG was in fact **SENT this morning — twice**: 07:24:31 IST
(19f82f30e7d236eb) and 08:43:45 IST (19f82aa4a075c4e7), thread 19f8261a1aea2150, to sysadmin@,
cc mkt@ktahv.com + ea.abhilash@. Both sends predate the 10:08 handover — the tracker snapshot was
stale at birth (the drift class the reconcile rule exists for).

What the sent mail does (verified full body):
- Delivers the five Delhi-row price corrections (OAP 13,500/160 · TAP 37,000/495 · WAP 61,000/655 ·
  AATP-1 130,000/1,400 · AALCT 250,000/2,700) with change-NOTHING-else instructions and a
  screenshot-per-page reply requirement. **The send was NOT blocked on D1–D3** — it explicitly
  defers them ("Do NOT touch… I will send their exact wording separately").
- **D4 (TAP $495) and D5 (AALCT naming) shipped as-sent.** Still owed by owner: **D1 (Mumbai
  label) · D2 (Kerala rows) · D3 (validity dates)** — exactly the three the mail defers.

Two flags for the owner (his call, nothing actioned):
1. **The internal staging note leaked into the sent body** — the bracketed "[NOTE TO Anupam: TAP's
   USD figure (495) looks off… Also pending my own word: D1…D3… Full decision sheet: PR #206,
   content/kairali-guru/…]" block went to all recipients. It publicly second-guesses the 495 figure
   the same mail instructs Sunaj to apply, and exposes an internal PR/repo path. A one-line
   follow-up ("apply the numbered list as written; ignore the bracketed note") would neutralize it.
2. **Duplicate send** (07:24 + 08:43) — Sunaj has previously replied "duplicate email" to triples;
   harmless but expect that reply.

Next machine step (unchanged): on Sunaj's screenshot reply → post-publish QA fetch of all 5 pages,
diff vs content/kairali-guru/2026-07-21-rates-truthup-paste.md → audits/.

## 4. Deepu — escalation delivered, no read-confirm yet

- D-20260721-02 escalation (19f82e5645d079d4) sent 09:48 IST on the AHV-compliance thread; **no
  reply/read-confirm yet** at 10:32. Read-confirm due TODAY; backup + task 1 (consent checkboxes,
  legal) due Wed 22 Jul evening. Watch lane, not chase lane.

## 5. Sunaj robot-adds ×5 + CLOSE list — due Wed, nothing new today

- No mail from sysadmin@ dated 21 Jul. The five 20-Jul replies (security tasks, booking/Cloudflare,
  four-items, server-readiness, GSC) were all reconciled by the prior sessions; SC half verified
  closed on-screen by owner 20 Jul 21:43. Wed deadline stands.

## 6. Anupam — 3 URL corrections: unanswered, not yet stale

- Owner's 20 Jul 22:36 IST corrections mail (thread 19f7528b5b9fc4ab) has no reply. Sent <1 day
  ago; shipped footers are verifiably clean of all three defective URLs — records-hygiene, no chase.

## GA4 residue (adjacent, seen during reconcile, no action)

- Vikash (seo@ktahv.com, 20 Jul 12:54/13:00) reports GA4 "Owner Access Given, I Don't Have Right
  Administrator Access" — the GA4 half of the access task remains partial; SC half is closed.
  Already on the owner's radar from last night's verification mail.

---

# ADDENDUM — full per-person sweep (2026-07-21 10:35:59 IST, owner-ordered: "all of them")

The owner asked whether ALL mail from Deepu/Anupam/etc was checked — the first pass covered the
handover's named lanes only. This addendum is the full `from:<person> newer_than:2d` sweep plus an
inbox unread scan. New findings, per person:

## Deepu (developer@) — 2 replies read in full; TWO answers now owed BY the owner

- **Audit round 2 status (20 Jul 18:22 IST, 19f7f962787320b4)** — kairalicenters + kairali.guru
  8-item list: items 2/4/6/8 DONE (footer socials · testimonials 301 · viewport meta · footer year
  line in TEMPORARY wording). Pending: item 3 blocked on **a question to the owner — "confirm the
  URLs of the two /product/ region pages"** (unanswered since 20 Jul evening); item 5 blocked on
  Vikash's GA4 Measurement ID; item 7 blocked on Roshni's privacy-policy content (help ticket
  raised). **Item 8's FINAL footer wording is also owner-owed** ("exact final wording comes from me
  before you publish" — his own instruction; canonical form per the ruled lineage family).
- **Preview-sites tech check (20 Jul 16:01 IST)** — QA started (render sanity, redirects, head
  tags, publish readiness); no completion yet.
- The 7-day silence remains specific to the AHV-compliance thread — the escalation stands correct.

## Anupam (mkt@ktahv.com) — the guru rates V2 SHEET found (bears on D1–D5)

- **20 Jul 16:11 IST (19f7f1e76d9dbda1), guru-rates addendum thread**: the full "Kairali Ayurvedic
  Centre – Ayurveda Training Program V2" price list — the source of this morning's corrective.
  Verified against the sent mail: all five INR/USD pairs MATCH, **TAP 495 USD is per the sheet**
  (the leaked staging-note's doubt is answered by the source itself).
- **Discrepancy: the sheet codes the 4-week program "AALC-2"; the sent corrective wrote "AALCT"**
  — D5 is therefore NOT settled-as-sent; one owner word (or a one-line follow-up to Sunaj) aligns it.
- D1/D2 inputs: the sheet scopes non-residential to **Mehrauli, Siri Fort, Gurgaon** (no Mumbai
  named) and prices residential at the Healing Village as **per-night villa rates** (Deluxe →
  Maharaja), i.e. not a course-fee row. **No validity dates anywhere — D3 stays fully open.**
- The 3-URL socials corrections remain unanswered (not stale).

## Vikash (seo@ktahv.com) — transcripts DELIVERED + a GA4 domain question pending

- **20 Jul 14:26 IST (19f7ebe34d7c3085, UNREAD)**: the requested video transcriptions delivered as
  Google Docs — including "Abilash K Ramesh — my interviews/talks (for my author voice)". Feeds the
  author-voice calibration lane (docs/sops author-voices; blog voice system).
- **GA4/GTM thread (20 Jul 11:47 IST)**: he flags old domain arogyashala.co.in vs new
  arogyashala.in and advises against installing both streams — awaiting the owner/agent technical
  ruling before the GA4 tag is wired. Also: GA4 admin access still partial ("Owner Access Given,
  I Don't Have Right Administrator Access") — SC half closed, GA4 half open.

## Gaurav (ops@kairalicentres.com)

- **kairalicenters.com Search Console: director@ added as Owner (20 Jul 11:20 IST)** — done.
- Centres CRM workflow map already on record; WAITING-ON new-platform rollout (no chase).

## Ambuj (dme@kairaliproducts.com)

- Storefront-token thread closed out 20 Jul: the mistakenly-shared **Admin API token revoked**
  (confirmed dead) and Storefront API enabled — the owner's urgent-redo instruction executed.
- Routine daily delegation summaries continue (21 Jul edition arrived 09:35 IST).

## Ticket system (noreply@kairaliproducts.com) — new activity TODAY

- **10 help-desk tickets raised at 10:16 IST today (HT-251600–251611, all HIGH)** under the owner's
  name, and **2 already resolved by 10:27 IST (HT-251590, HT-251592)** — consistent with the
  Ritu/team pending-checklist being pushed item-by-item into the ticketing system (D-20260720-06
  lane). Not agent-actionable; noted so the flood is not mistaken for noise.

## Unchanged from the main report

Sunaj: nothing new today (robot-adds ×5 + CLOSE list due Wed). Shadab: still silent, noon watch
live. Satyam: no lock reply; endpoints HOT per the 10:26 outside probe.

---

# ADDENDUM 2 — full 7–10-day ask-vs-reply reconcile (2026-07-21 10:52:58 IST, owner-ordered while working the call list)

Base = RPT-20260720-RITU (the person-wise checklist, mailbox-checked 20 Jul 09:10) + every send since.
New material findings first:

## 1. Dr. Deepu John REPLIED — partial clinical sign-off WITH required changes (HARD GATE 7 lane)

20 Jul 15:26 IST, doctor@ktahv.com (19f7ef47eddd9ca4), on the 8-point KTAHV-LP sign-off:
- **OK as-is:** 1 Pain Management · 4 Cleansing Centre · 6 German page · 7a in-person-consultation
  claim · 7c prescribed-never-self-selected claim · name/title/photo approved on all ten pages.
- **CHANGES REQUIRED:** 7b — drop the word "resident" from "Resident physicians plan and review
  every programme" (ALL TEN pages) · 8 — SOFTEN the scattered-sessions comparison wording (2 pages)
  · 5(page 2, /lp/treatment-in-kerala) — the "Is this a medical facility or a wholesome hotel?" FAQ
  answer "doesn't feel good" — rework · 2 & 3 — photos not good (Panchakarma, Weight-loss) · 3 —
  the patient video is NOT AVAILABLE to him (verify the embed) · overall: reconsider photos on all
  pages ("not all is attractive and supporting the contents").
- Consequence: the 10 KTAHV LPs may NOT ship as-are — a wording-fix wave (7b/8/5.2) is agent work;
  photos/video are the creative lane. Sign-off completes on his re-review after fixes.

## 2. Vikash's transcriptions: BOTH mails received (owner suspected two — confirmed)

- 18 Jul 17:42 IST "Author Transcript" (19f7524311376698): Drive links — Gita ma'am + Abhishek +
  Abhilash transcripts.
- 20 Jul 14:26 IST reply on the ask thread (19f7ebe34d7c3085): Google-Docs links — "Abilash K
  Ramesh — my interviews/talks (for my author voice)".
- Both feed the author-voice calibration lane (docs/sops author-voices). Ingestion queued.

## 3. Astha DELIVERED the marketing review of all 8 preview sites (missed by every prior pass)

20 Jul 17:44 IST, ho.mkt@ (19f7f731970e3d68, cc Anupam): per-site feedback (e.g. arogyakendra —
"Logo is missing · Image is missing · WhatsApp CTA working"). Closes checklist item H-2
(phantom-pending). NEW WORK: ingest the feedback item-by-item into the site-fix lane.

## 4. Vikash's GA4 answer arrived — as a PUSHBACK needing a technical ruling

20 Jul 11:47 IST: keep the stream URL as arogyashala.CO.in ("tracking works wherever the code is
installed"), and GA4-ONLY — he recommends AGAINST a GTM container (KTAHV had double-tracking
conflicts twice). Open: the ruling (update the stream URL to arogyashala.in — an edit, not a new
stream — vs leave; GTM yes/no), the account-structure answer, and the 11-URL whyayurveda list.

## 5. Ask-vs-reply status, person by person (everything else)

- **Sunaj:** SC ownership DONE + owner-verified · server-readiness, four-items ("done pls check"),
  security-tasks (screenshots), booking/Cloudflare replies ALL received 20 Jul — his "done" claims
  await machine verification (queued) · STILL OPEN: GA4 Administrator grants (Vikash confirms
  partial), the cleanup LIST, robot-adds ×5 + CLOSE list (Wed), kairali.ai DNS slot, Shadab's store
  access, the guru corrective execution (follow-up draft staged).
- **Shadab:** ZERO mail since 18 Jul — every item open; written-answer deadline TODAY noon.
- **Satyam:** schema+endpoints received (superseded by the LOCK request — no reply; endpoints
  re-probed HOT 10:26) · the 18-Jul "Forms check — 8 preview sites" ack NEVER came — still open.
- **Anupam:** socials list received (his 3 corrections pending) · V2 rates sheet received · the
  18-Jul "3 open items" reply still flagged for the owner's read · banned-words verify unconfirmed.
- **Deepu (developer):** tech-check + audit-round-2 replies received (4 items done; blocked on:
  OWNER's two /product/ page URLs · Vikash's GA4 ID · Roshni's privacy content) · Novamira install
  + two 17-Jul indexing items unheard · AHV read-confirm awaited (escalated 09:48 today).
- **Dr. Deepu John:** see §1. **Gaurav:** kairalicenters GSC ownership DONE · physician regs
  (Dr. Shari K 12695 + Anoop's attachment) received. **Ambuj:** tokens resolved, admin token
  revoked-dead. **Astha:** see §3.
- **Owner's own one-worders** (checklist §A) unchanged as far as the mailbox shows: Q-BAKEOFF-VERDICT
  · Q-AUDITORS-YML · Q-A13-REQUIRED-CHECK · kairali-os-bot account · Q-CLASSMAP-UNKNOWNS ×4 ·
  channels.yaml ratification · Villa Raag feedback round (+ the Q-VR-DISTANCES id needs registering
  — Phase-C C-LF-01/links).

---

# ADDENDUM 3 — Shadab replied BEFORE the noon deadline; incomplete (2026-07-21 10:58:11 IST)

Reply 21 Jul 10:52 IST (19f8320ac0682082), 68 minutes inside the deadline — the staged further-escalation
does NOT fire. Scored against the three written demands:
- **Item 1 (store list): ANSWERED** — kairaliproducts.in + .com, both live (matches Ambuj's two-store confirm).
- **Item 2 (read-only staff access, both stores): NOT ANSWERED** — he describes his own local setup
  (CLI, local envs, backups, exports, GitHub-connected unpublished staging themes, live untouched —
  genuinely correct prep) but grants no agent-lane access.
- **Item 3 (theme/token access per the v2 doc): NOT ANSWERED** — not mentioned.
Pilot remains blocked on items 2+3. Counter-reply STAGED (draft r-3598910097950572487, owner sends):
acknowledges the good prep · demands items 2+3 by EOD today · plus three verifications (repo URLs +
which org — must be the organisation, not personal · backup theme names/IDs · export locations ·
no tokens in email). His backup/export claims are verify-later, not trusted (proof-of-work rule).

---

# ADDENDUM 4 — all five staged mails SENT by owner; watch lanes armed (2026-07-21 11:51:58 IST)

Sent-folder verified, message IDs on record:
1. Sunaj guru follow-up (D1–D3 wordings + ignore-note) — 10:50:41 IST, 19f831e7eb6ca65d
2. Deepu audit-round-2 answers (product URLs + final footer wording) — 10:57:14 IST, 19f83247ebbf5f5f
3. Shadab counter-reply (items 2+3 by EOD + org/backup/export verifications) — 11:00:08 IST, 19f8327248bab9d1
4. Dr. Deepu John re-review request — 11:49:22 IST, 19f83543879e09f4
5. Vikash GA4 ruling (consult-backed) — 11:49:14 IST, 19f83541bd98cb9e

WATCH LANES now open (reply → machine step):
- Sunaj 5-page screenshots → post-publish QA fetch of all five live guru pages vs the paste file → audits/
- Deepu items 3+8 screenshots → verify head/footer on the live pages
- Shadab EOD: access items 2+3 + repo-org/backup/export answers → verify access + repos org-side
- Dr. Deepu John "confirmed" on the updated previews → clinical sign-off CLOSES (PR #219 lane)
- Vikash 3 items (stream URL edit · SC property for arogyashala.in · GA4-SC link) → then the team wires G-HS6BP7Z17Z into arogyashala.in and verifies events

Also seen in the same sweep: Anupam replied on the REVE Luxury Awards forward (12:32 IST, unread) —
assesses the award as low-credibility (launched 2025), proposes a barter-based alternative; owner's
marketing call, no agent action. Owner also cleared: WFH approval (pc1), Chattarpur complaint
forwarded to ops/Abishek, KTM directory to Anupam, HR staff-structure reminder to Anuj (ho.accounts).

