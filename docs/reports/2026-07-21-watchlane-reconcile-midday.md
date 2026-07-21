---
report_id: RPT-20260721-WATCHLANE-MIDDAY
date: "2026-07-21 12:58:00 IST"
task: "Watch-lane mailbox reconcile (midday) — 6 lanes checked item-by-item against machine truth before any chase"
project: "OS v2 / web factory"
source_tool: "claude-code (Gmail MCP + outside curl probes)"
type: audit
supersedes: null
---

# WATCH-LANE RECONCILE — midday (21 Jul)

Reconcile-before-chasing (standing rule): every lane checked against the mailbox + a live probe
before any status is asserted. Trackers drift pessimistic; the mailbox and the endpoints are truth.

## 1. Sunaj — kairali.guru 5-page rates truth-up · STILL OWED (screenshots NOT in yet)

QA-fetched all 5 live `.aspx` course pages (Mozilla UA, 21 Jul ~12:55 IST) and diffed against the
approved rulings in `content/kairali-guru/2026-07-21-rates-truthup-paste.md` (RULINGS §, D-03..06):

| Ruling | Expected on live | Observed on all 5 pages | Status |
|---|---|---|---|
| D1 Mumbai OFF → "Delhi NCR (Mehrauli · Siri Fort · Gurugram)" | no "Mumbai"; new label | **"Mumbai" still present**, old label | NOT DONE |
| D3 validity → "1 Jan 2026 – 30 September 2027" | "September, 2027" | **"March, 2027"** (the pre-ruling interim rewrite) | NOT DONE |
| D2 Kerala rows → per-night villa line | "per-night" villa line | absent | NOT DONE |

The corrective mail was SENT by the owner 10:50 IST (19f831e7eb6ca65d) but **the IT-lane edits have
not landed on the live pages** — every page still carries the 2019-price / "March 2027" state the
paste file flagged as the live pricing liability. This lane's watch trigger (Sunaj's 5-page
screenshots) has NOT arrived; nothing to reconcile against yet. **Action: none owed from us — the
publish is Sunaj's; when the screenshots arrive, re-run this exact 5-page diff into audits/.**
The stale live prices are why Q-KY-GURU-LINK gates the kairaliyoga→guru link on this publish.

## 2. Deepu (WordPress dev) — three audit threads · ALL PROGRESSED, one live-verified

- **AHV 7-day escalation thread (19f6138c…, D-20260721-02):** owner's chase re-sent 04:18 IST 21 Jul.
  No Deepu reply on THIS thread yet; his AHV read-confirm was **due today** — still open, backup +
  task 1 due Wed 22 Jul evening. Watch continues.
- **Audit-round-2 (kairalicenters + guru, 19f6aac0…):** items 2/4/6/8 done per his 20 Jul reply;
  owner answered his two open points (item 3 region pages, item 7) 21 Jul 05:27. Ball with Deepu.
- **URGENT 3-site audit (19f6a8d5…, items 1–13):** his 21 Jul 05:33 update — items 10, 12, 13 now
  COMPLETE (were open); items 2/3/4 (Shopify) handed to the Shopify dev. **Live-verified from
  outside (21 Jul ~12:56):**
  - Item 10 (AHV homepage Air India Maharaja form) → **GONE** (0 matches on live homepage). ✓
  - Item 13 (villaraag schema image 404) → **FIXED** — JSON-LD now points at
    `wp-content/uploads/2026/07/resort.webp`, which loads HTTP 200 (160 KB); old `resort.jpg`
    reference is gone. ✓
  - Item 12 (villaraag Contact + Enquire forms consent) → **FIXED** — both /contact-us/ and
    /enquire-now/ forms carry a **required** consent checkbox with a Privacy Policy link inside the
    form. ✓
  His three "completed" claims check out on the live sites. No chase owed.

## 3. Shadab (developer6) — Shopify access for the pilot · PARTIAL (1 of the batch answered)

His 21 Jul 05:22 reply (before deadline) gave the store list + the right pattern (backups first,
GitHub-connected staging themes, live themes untouched). Owner replied 05:30 that the prep is good
**but the specific access items are still owed** — the pilot stays BLOCKED until the actual access
grants + repo-in-org confirmation + backup/export answers arrive. No new Shadab mail since 05:22.
**Pilot (theblushlounge) remains blocked on Shadab; watch continues — no chase, owner already
pushed 05:30.**

## 4. Dr. Deepu John — clinical sign-off on the 10 LP pages · RE-REVIEW SENT, awaiting his "confirmed"

His full point-by-point review landed 20 Jul 09:56 (19f7ef47…); every change executed in PR #219;
owner's re-review mail SENT 21 Jul 06:19 (19f83543…) listing all 8 changes made. **No "confirmed"
reply back yet** — clinical sign-off (HARD GATE 7) does NOT close until he confirms on the updated
previews. #219 rides #145; the lane stays open on his word. Watch continues.

## 5. Vikash (SEO) — GA4 + GSC access · RULING SENT, 3 GA4 wiring items pending his end

GA4 consult decided + Vikash ruling mail SENT 21 Jul 06:19 (per handover). His 20 Jul replies on the
access thread say **"Owner Access Given, I don't have Administrator access"** for GSC/GA4 — so the
`director@` Owner/Admin task is partially done (Owner yes, Admin no). The 3 GA4 wiring items
(G-HS6BP7Z17Z into arogyashala.in + event verification) sit on his side post-ruling. No transcript/
GA4 action owed from us this tick; watch continues. **Note the Admin-vs-Owner gap for the next
access chase — it recurs across Sunaj+Vikash.**

## 6. Satyam (CRM) — endpoints RE-VERIFIED FROM OUTSIDE · STILL HOT (unchanged from 10:26 probe)

Written schema arrived 20 Jul 07:08 (19f7e5b1…): 2 read-only GET endpoints, full lead schema (UTM
fields present), IVR call-record shape (sr_number = dialed service number), 3 qualification statuses,
conversion shape. **Outside re-probe 21 Jul ~12:52 IST (no auth, from this machine):**

- `GET /api/conversion` → **HTTP 200, 8.4 MB, no auth** — returns real company data
  (KAPPL / KTAHV / VILLARAAG keys). **OPEN TO THE PUBLIC.**
- `GET /api/leads` → **hangs (timed out at 25s, HTTP 000)** — same behavior as the 10:26 probe;
  large unpaginated dump or slow query, still no auth gate observed.

**CRM endpoints remain HOT** — `/api/conversion` serves the group's real lead/conversion data to any
unauthenticated caller, and `/api/leads` (which carries names, emails, phones, consent) is reachable
without auth (it hangs on volume, not on a 401/403). This is a **live PII exposure** — HARD GATE 14
territory (never expose a secret; here it is customer PII). The sample bytes were curled to the
scratchpad ONLY to read the top-level shape and were **purged immediately** (never committed, never
logged). **Do NOT wire anything against these endpoints until Satyam confirms in writing that (a)
auth is added and (b) the leads endpoint is paginated + access-controlled.** Escalation owed to the
owner (below).

## RECONCILE SUMMARY

| Lane | Machine truth | Owed from us |
|---|---|---|
| Sunaj guru | live pages still pre-ruling (Mumbai on, March-2027) | none — Sunaj publishes; re-QA on screenshots |
| Deepu | 10/12/13 live-verified DONE; AHV read-confirm still owed by him | none — owner chased 04:18 |
| Shadab | prep good, access items still owed; pilot blocked | none — owner chased 05:30 |
| Dr. Deepu John | re-review sent; awaiting "confirmed" | none — sign-off is his |
| Vikash | ruling sent; Owner-not-Admin gap on GSC/GA4 | none — flag Admin gap next chase |
| Satyam CRM | **endpoints HOT — live PII exposure, re-verified outside** | **OWNER ESCALATION** |

## ONE OWNER ESCALATION (the only item that can't wait on a watch tick)

The CRM `/api/conversion` and `/api/leads` endpoints are serving real lead/conversion PII with no
authentication (re-verified from outside 21 Jul 12:52). Recommend the owner tell Satyam, in writing,
to gate both endpoints (token/IP-allowlist) and paginate `/api/leads` BEFORE any OS wiring reads
them — and that until then the measurement integration stays unbuilt. Draft-on-request.

## DISPOSITIONS (triad — one row per actionable finding)

| # | Finding | Verdict | Reason |
|---|---|---|---|
| 1 | Sunaj: guru 5 pages still pre-ruling (Mumbai on, March-2027, no per-night line) | MONITOR | WAITING-ON Sunaj publish/screenshots; re-QA diff into audits/ fires then — publish is his lane, mail already sent 10:50 |
| 2 | Deepu: items 10/12/13 live-verified DONE | REJECT | no action — claims check out on live sites (Air India form gone, villaraag consent+schema fixed); nothing owed |
| 3 | Deepu: AHV read-confirm due today, no reply on that thread | MONITOR | WAITING-ON Deepu, EOD deadline; escalation D-20260721-02 stands; owner already chased 04:18 |
| 4 | Shadab: access items still owed, pilot blocked | MONITOR | WAITING-ON Shadab EOD; owner chased 05:30; theblushlounge pilot gated until access lands |
| 5 | Dr. Deepu John: re-review sent, no "confirmed" yet | MONITOR | WAITING-ON his confirm; HARD GATE 7 sign-off closes #219 lane only on his word |
| 6 | Vikash: Owner-not-Admin gap on GSC/GA4 + 3 GA4 wiring items | MONITOR | WAITING-ON Vikash; note the Admin-vs-Owner gap (recurs with Sunaj) for the next access chase |
| 7 | Satyam: CRM endpoints serving PII with no auth (re-verified outside) | IMPLEMENT | owner escalation drafted above — tell Satyam to gate+paginate before any wiring; integration stays unbuilt until confirmed. BACKLOG: do-not-wire-CRM-until-auth |

Concurrent-writer note: a second reconcile pass (RPT-20260721-MAILBOX-MIDDAY, same 12:58 timestamp)
was found as a TRUNCATED on-disk fragment — it stopped mid-sentence in the Vikash lane, carried no
Satyam lane and no dispositions (likely an interrupted write; M2 has no power backup). Its findings
where present were IDENTICAL to this report's (independent corroboration of Deepu 10/12/13 and the
guru pre-ruling state). The fragment was removed to keep one-item-one-home; this report is canonical.
