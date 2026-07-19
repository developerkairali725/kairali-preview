# Centralized CRM — the commercial-truth system (R4 fact, owner-stated)

**Source:** Abilash in chat, 2026-07-19 (ask ⑤ answer; D-20260719-21). Builder/keeper: **Satyam**
(dme@kairali.com — CRM/databases/dashboards, forms webhook owner; see [people](../people.md)).
Consistent with his 14-Jul store-first spec (DECISIONS.md: every submission written to OUR
database; CRM fetches/reprocesses; no direct-to-webhook in production).

## Architecture (as stated by the owner)

ALL leads land in ONE centralized system, across entities and channels — web forms, the chatbot,
Facebook, Instagram, IVR phone calls, everything:

1. Lead/call → **central database**.
2. **AI parsing + qualification** on every record.
3. **Unqualified** → AI voice-calling lane (automated follow-up).
4. **Qualified** → mapped to a **telecaller** → telecaller converts → **conversion stored in the
   same database**.
5. Prioritized funnel entry ("as per priority it goes into the funnel").

## What this means for the OS

- **Dual-source verification (measurement standard §9): Source B = this database** for forms,
  chat, calls, and paid-social leads. GA4/GTM is never the truth; this is.
- **The known gap the OS must close (owner-stated, load-bearing): UTM codes are NOT mapped
  properly today.** Exact UTM/source mapping through to the CRM record is a BUILD REQUIREMENT of
  the measurement layer (M3) — including chatbot leads and Facebook/Instagram leads. This is one of
  the owner's stated reasons for building the OS at all.
- Attribution-preservation tests (standard 04 §7: identifiers must survive redirects, forms,
  gateways, CRM transfer) run against THIS system's records.

## Access

Owner-authorized 19 Jul: Satyam provides endpoints / start points / read access on request.
Requested via director@ draft (2026-07-19): read-only access + schema + lead-source/UTM field
inventory + IVR record shape + qualification statuses + conversion/revenue fields. Fill in below
when answered; never guess fields (HARD GATE 6).

- Endpoint / read access: _pending Satyam_
- Lead schema + source/UTM fields: _pending Satyam_
- IVR/call record shape: _pending Satyam_
- Qualification status enum: _pending Satyam_
- Conversion/revenue representation: _pending Satyam_

## Rulings + open items

- **Call attribution RULED (owner, 19 Jul, D-20260719-22): launch with wa.me + UTM only.**
  Inbound call-source attribution (per-channel numbers / tracking vendor) is an M3+ decision,
  not a launch blocker.
- **Access requests SENT 19 Jul 14:43 IST** (verified in director@ sent mail): Satyam CRM
  read-access (msg 19f79a70d0cdffac) · Abhishek/Gaurav kairalicenters GSC (msg 19f79a6f65de3220).
  Replies awaited — reconcile against the mailbox before chasing.
- **Bookings RULED (owner, 19 Jul, D-20260719-23):** KTAHV and Villa Raag bookings are entered
  BOTH in the central CRM and in property-management software — **two different PMS** (names TBD;
  not blocking, since conversion truth incl. booking details = Satyam's CRM DB). PMS names ride
  the Satyam reply or ops, needed only for reconciliation depth at M3.
- **Centres system MAPPED — Gaurav Saraswat REPLIED 19 Jul 17:19 IST** (msg 19f7a365247be568,
  supersedes the "workflow unknown" state below):
  - **Stack:** in-house CRM on **Google Sheets** (operational lead management) + **Looker Studio**
    (reporting/dashboards). Not a commercial CRM.
  - **Lead flow:** all channels (Website, LPs, WhatsApp, Meta FB/IG, GBP, Direct Call, Walk-in,
    Vendor, Event) → **Lead Verification Team** (validation + de-dup) → Centre assignment →
    Centre calling panel → appointment scheduling → patient visit → **billing** → revenue mapping
    & conversion reporting → follow-up.
  - **Attribution key = customer MOBILE NUMBER** (lead→revenue join; marketing dashboard tracks
    Lead vs Revenue per campaign/source). OS implication: the wa.me+UTM launch pattern
    (D-20260719-22) feeds this key natively — the phone number IS the join.
  - **Source captured:** yes — Lead Source field (category level: Website / Google / Meta /
    WhatsApp / Direct Call / Landing Pages / Event / Vendor / Walk-in) + Assigned Centre +
    Revenue Status. Click-level UTM→lead mapping still absent = the M3 build requirement stands.
  - **Read-only access DEFERRED by Gaurav:** Centres are mid-migration to a NEW CRM platform
    (pilot live at the **Gurgaon Centre**, DME team finalizing); read endpoint promised after
    rollout stabilizes. **WAITING-ON: chase the endpoint once the new platform rollout completes**
    — M3 integration targets the NEW platform, not the Sheets legacy.
- ORIGINAL delegation record (kept for provenance): different team, different CRM, workflow was
  unknown to the owner; delegated to Gaurav Saraswat (ops@kairalicentres.com). Email SENT 19 Jul
  14:51 IST (msg 19f79ae347a9f8b8, mailbox-verified); dual-source verification for
  kairalicenters.com binds to the Centres system now documented above. Access threads: Satyam
  (awaited) · Abhishek/Gaurav GSC (awaited) · Gaurav centres (**ANSWERED**).
