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
- **Centres are a SEPARATE system:** different team, different CRM, workflow unknown to the owner.
  **Delegated to Gaurav Saraswat (ops@kairalicentres.com)** — his team supplies the exact
  workflow, endpoints/start points, and how appointments + conversions are recorded. Owner expects
  an extensive tracking system there too. Email SENT 19 Jul 14:51 IST (msg 19f79ae347a9f8b8,
  mailbox-verified); dual-source verification for kairalicenters.com binds to THAT system once
  documented. All three access threads now in flight: Satyam · Abhishek/Gaurav GSC · Gaurav centres.
