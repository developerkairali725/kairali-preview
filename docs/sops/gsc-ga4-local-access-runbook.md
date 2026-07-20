# GSC + GA4 local service-account access — owner runbook (one-time, ~15–20 min)

**Why:** D-20260719-18 — GSC/GA4 route via LOCAL service-account MCPs; credentials stay on the Mac
mini and in our own Google Cloud project. This also switches on the **BigQuery bulk export** that
permanently escapes GSC's 16-month deletion window (the export has NO backfill — every day before
setup is a day of continuous history we don't get, so sooner is better; our 19-Jul UI snapshots
cover the past).

**Verified:** every step below was re-checked against Google's live docs on 2026-07-19 (4-agent
research + adversarial re-fetch; sources at the end). Menu labels are quoted as they appear today.

**Accounts note (two-account trap):** GSC properties live on BOTH logins — abilash.kr@gmail.com
(u/0, 11 properties) and director@kairali.com (u/1, 4 properties). Steps B and D must be done from
whichever login OWNS each property. Check the top-right avatar before every grant.

---

## A. One-time Google Cloud setup (~5 min, do once)

1. Go to console.cloud.google.com signed in as **director@kairali.com** and accept the Cloud terms
   if asked. Top bar project picker → **New project** → name it `kairali-analytics-os` → Create.
   (No billing needed yet; billing is only for part C.)
2. **APIs & Services → Library** — enable these three (search by name):
   - **Google Search Console API** (`searchconsole.googleapis.com`)
   - **Google Analytics Data API** (`analyticsdata.googleapis.com`)
   - *(optional, for property listing)* **Google Analytics Admin API** (`analyticsadmin.googleapis.com`)
3. **IAM & Admin → Service Accounts → Create service account** → name `kairali-os-reader` →
   the two optional "Grant…" screens can be SKIPPED (Continue/Done) — no Cloud roles are needed.
   Note the email it gets: `kairali-os-reader@kairali-analytics-os.iam.gserviceaccount.com`.
4. Open the service account → **Keys** tab → **Add key → Create new key → JSON → Create**. The file
   downloads once. Move it to `~/secrets/kairali-os-reader.json` (OUTSIDE the repo — never commit,
   HARD GATE 14) and add to `~/.zshrc`:
   `export GOOGLE_APPLICATION_CREDENTIALS=$HOME/secrets/kairali-os-reader.json`
   - ⚠️ If you see **"Service account key creation is disabled"**: kairali.com's Workspace org
     policy blocks keys. Easiest fix: redo A1–A4 with the project under **abilash.kr@gmail.com**
     instead (standalone Gmail has no org policy). Everything else is unchanged.

## B. Grant the service account read access in Search Console (~5 min)

For EVERY property, from the login that owns it (u/0 ×11, u/1 ×4):

5. https://search.google.com/search-console → select property → **Settings → Users and permissions**
   (page is visible only to property owners) → **Add user** → paste the service-account email →
   permission **Restricted** (sufficient for all API reads) → Add.
   - Domain properties (`sc-domain:…`) cover all subdomains + both protocols in one grant.
6. ⚠️ **Known Google bug (acknowledged, open since ~23 Apr 2026):** adding a NEWLY created service
   account may fail with *"Email not found"* — in GSC and GA4 both. If that happens:
   (a) just try again anyway (it may be fixed by the time you run this);
   (b) domain properties reportedly behave better than URL-prefix ones;
   (c) tell me — I'll run the **Site Verification API fallback** with you (adds the SA as a
   verified owner programmatically; it then won't show in the Users UI — that's expected).

## C. BigQuery bulk export (biggest properties first; ~5 min; needs billing)

7. In the Cloud project: enable **billing** (the export writes into BigQuery; at our data volume
   the cost is pennies, and we'll set hygiene in step 11).
8. **APIs & Services** → also enable **BigQuery API** and **BigQuery Storage API** if not already.
9. **IAM and Admin → + GRANT ACCESS** → in "New principals" paste exactly:
   `search-console-data-export@system.gserviceaccount.com` (Google's own export account) → grant
   BOTH roles: **BigQuery Job User** and **BigQuery Data Editor** → Save.
10. In Search Console (per property, owner login): **Settings → Bulk data export** → paste the
    Cloud **project ID** (the ID string, not the number) → dataset name starts with `searchconsole`
    — use one per property, e.g. `searchconsole_whyayurveda` → dataset location: **asia-south1
    (Mumbai)** (⚠️ cannot be changed later) → Continue.
    First export lands within ~48h, current-day data only — no history (hence the urgency).
11. Hygiene (I do this once tables exist): NO table-level expiration (that deletes everything);
    partition expiration left OFF for now — the whole point is permanent history; cost reviewed at
    M3. Our own service account additionally gets **BigQuery Data Viewer + Job User** to query it.

## D. Grant the service account read access in GA4 (~3 min)

12. https://analytics.google.com (admin login) → **Admin** (gear, bottom left) → under Property:
    **Access Management** → **+** → **Add users** → paste the service-account email →
    UNCHECK **"Notify new users by email"** (no mailbox) → role **Viewer** (covers all Data-API
    reads; least privilege — Analyst adds nothing we need) → **Add**.
    Same known-bug caveat as step 6.
13. While there: **Admin → Property Settings** — note the numeric **PROPERTY ID** (top right; NOT
    the `G-…` Measurement ID) for each property and drop the list in chat or QUESTIONS.md.

## E. Then I take over (no action from you)

Smoke tests with the key: GSC `sites.list` must show all 15 properties with permission levels;
GA4 `runReport` (activeUsers, 7d) must return rows per property ID. Then the local MCP wiring +
quota budgeting (200k tokens/property/day standard tier; per-property quota is SHARED with any
third-party connector hitting the same property — budget recorded at M3) and the evidence-law
export cadence ride M3 as planned.

---

**Sources (fetched 2026-07-19):** searchconsole discovery doc (`searchconsole:v1`, scopes) ·
support.google.com/webmasters/answer/12917675 (bulk export, verbatim labels + roles) ·
…/webmasters/answer/7687615 (users & permissions) · developers.google.com/analytics …
`data/v1/quickstart`, `data/v1/property-id`, `data/v1/quotas`, `config/admin/v1/quickstart` ·
support.google.com/analytics/answer/9305788 + 9305587 (roles; "Viewer … via the user interface or
the APIs"). Known-bug reports: Google support forums, Apr–Jun 2026, Google-acknowledged.

---

# EXECUTION STATUS — 2026-07-19 ~15:4x IST (agent-driven per owner's order, D-20260719-24)

Owner ruled "do it yourself, I'll press when needed" — the agent drove his logged-in Chrome;
owner pressed exactly twice (director@ password re-auth · key-download Create).

**DONE (machine-verified by API smoke test, all 200):**
- GCP project `kairali-analytics-os` (number `174837120177`, org kairali.com, director@) — the
  number is what the GBP application form needs.
- APIs enabled: Search Console API · Analytics Data API · Analytics Admin API (first-round Enable
  clicks silently failed — the library page needs TWO clicks: card → product page → Enable; fixed).
- Service account `kairali-os-reader@kairali-analytics-os.iam.gserviceaccount.com` (no Cloud
  roles); JSON key at `~/secrets/kairali-os-reader.json` (0600) + `GOOGLE_APPLICATION_CREDENTIALS`
  in ~/.zshrc.
- GSC grants (Restricted) on 8 properties: ayurvedichealingvillage.com (both http-nowww on
  director@ AND https-www on abilash.kr) · whyayurveda.org · arogyakendra.com ·
  kairalihospitality.com · kairaliproducts.in · kairalitea.com · kairaliyoga.com.
  The Apr-2026 "Email not found" bug did NOT fire.
- GA4: account-level **Viewer** on account Kairali (384203334) — covers every property under it.
- Smoke tests: GSC sites.list 200 (8 props, siteRestrictedUser) · GA4 accountSummaries 200 ·
  runReport 200 (kairali.com activeUsers 7d = 841).

**GAPS — properties where NEITHER owner login is a GSC Owner (only Owners can add users):**
villaraag.com (sc-domain) · kairali.com (http://www) · kairaliayurvedainstitute.com ·
kairalitraining.com · keralatraining.com. Likely owners: developer@kairali.com (Deepu) /
seo@ktahv.com (Vikash) / ayurvedichealingvillage@gmail.com / ppc accounts — visible in the
ayurvedichealingvillage users table. FIX: whoever is Owner adds the service-account email with
Restricted, or bumps director@ to Owner. (kairalicenters.com rides the Abhishek/Gaurav thread.)

**FINDING:** the Kairali GA4 account holds exactly ONE property (kairali.com). The rest of the
fleet has no GA4 properties under this account — property creation/wiring is M3 work (or they
live under other accounts; Satyam/Vikash may know).

**STILL OWNER-SIDE (unchanged):** BigQuery bulk export (part C — needs billing enable + per-property
GSC settings; recommend after the ownership gaps close) · GBP business-group check + first
Insights CSV + API application submit (project number above; use-case text in
docs/sops/gbp-access-runbook.md).

---

# ADDENDUM 2 — GA4 MULTI-ACCOUNT MAP + Monday plan (2026-07-19 ~16:0x IST, D-20260719-25)

Owner corrected the record: GA4 is MULTI-ACCOUNT on both logins. Full enumeration (browser-verified):

**director@ (u/1), 4 accounts:** Kairali (384203334 → kairali.com 524286550, SA ✓Viewer) ·
Kairaliproducts.com (352447311 → 485944403) · Villa Raag (346054077 → 478461137) ·
VillaRaag (376287257 → 514624832) — TWO Villa Raag accounts, consolidation candidate.

**abilash.kr (u/0), ~14 accounts:** Kairali-The Ayurvedic Healing Village (41990250 → 394301498,
43k users/90d — the KTAHV workhorse) · kairaliequipment.com (53596178) · kairalihospitality
(42461617) · Kairaliproducts.com (352447311, shared) · kairaliproducts.us (109852464) ·
kairaliyoga.com · Kerala Ayurveda Institute (51315790) · Kerala Equipments (51307833) ·
Kerala Training (51517067) · SpaZense (46662440) · Tourdenight.com (49647585) · Villa Raag
(346054077, shared) · What Is Ayurveda (51306046) · Why Ayurveda (43055304).

**Monday plan (owner ruling):** Sunaj (sysadmin@) + Vikash (seo@ktahv.com) make director@ GSC
Owner + GA4 Administrator EVERYWHERE by Mon 21 Jul EOD — HIGH PRIORITY email drafted in director@
(draft r-3242578669131468487) with both gap lists. Once normalized, the agent sweeps the SA
(Restricted/Viewer) across all accounts and re-runs smoke tests (expected: accountSummaries
returns ~15 accounts, sites.list all properties).

**BigQuery lane:** old billing account CLOSED (free trial over). NEW billing account created:
"Kairali Analytics OS Billing" (013F27-9C0469-09890D, org kairali.com, India/INR) — owner fills
the payments profile + card (his explicit choice). Then agent: BigQuery+Storage APIs, the
search-console-data-export@system.gserviceaccount.com grant (Job User + Data Editor), and
per-property Bulk data export config (asia-south1) on every property where director@ is Owner.

---

# ADDENDUM 3 — BigQuery chain status (2026-07-19 ~16:4x IST, D-20260719-27)

**DONE tonight (browser-verified):**
- Billing account "Kairali Analytics OS Billing" (013F27-9C0469-09890D) created; owner entered
  payment; project kairali-analytics-os LINKED (billing page shows "Paid account").
- ⚠️ Account identity verification is PAST DUE (Google suspension warning) — owner asked for a
  reminder; scheduled task `monday-billing-verify-access-check` fires Mon 20 Jul 09:30 IST.
- BigQuery API + BigQuery Storage API: both Enabled.
- IAM: search-console-data-export@system.gserviceaccount.com granted BigQuery Job User +
  BigQuery Data Editor ("Policy updated" confirmed).

**PENDING — per-property GSC "Bulk data export" UI config (the last 60-second step per property):**
form values: project `kairali-analytics-os` · dataset `searchconsole_<domain>` · location
Mumbai (asia-south1). Attempted on whyayurveda.org tonight; the Angular form drops DOM-set values
and mis-renders keyboard input (a doubled "searchconsole_searchconsole_…" name appeared in the
review dialog — CANCELLED, nothing created; fresh form verified empty). GOTCHA for the next run:
type into focused fields only, verify the REVIEW DIALOG value before "Set up export", never trust
a mid-animation screenshot; the field self-prefixes nothing (default text is just "searchconsole").
Owner can equally do these clicks from runbook part C step 10. Properties to configure (8 owned
now, rest after Monday ownership): whyayurveda.org · www.ayurvedichealingvillage.com ·
ayurvedichealingvillage.com (u/1) · kairaliproducts.in · arogyakendra · hospitality · tea · yoga.
Every day before config = a day of lost permanent history (no backfill).

**Also this hour:** GA4 multi-account correction (addendum 2) · Sunaj+Vikash HIGH-PRIORITY draft
v3 (correct date Mon 20 Jul; adds Task 2 propose-first cleanup, D-20260719-26) · billing-verify
reminder scheduled.

## ADDENDUM 4 — Tracker-stack scope ruling: Meta / Bing / Clarity (D-20260719-30, 19 Jul evening)

Owner ruling: agent assesses the need itself; may set up APIs via the owner's logged-in browser
panels (owner clicks submit); anything not needed is simply skipped. Assessment (2026-07-19):

- **Clarity — KEEP, already integrated.** The `clarity-ktahv` MCP is live agent-side (dashboard
  queries + session recordings). Fleet-wide: one Clarity project per new site rides the M3
  per-site tracking bundle (project creation agent-driven in browser, code injected via the
  factory analytics package).
- **Bing Webmaster Tools — YES at M3, zero-cost.** One-click GSC import covers verification —
  run it AFTER the Sunaj/Vikash Monday ownership consolidation lands (director@ Owner
  everywhere), else the import replicates today's fragmentation. Covers Bing/Copilot/DuckDuckGo
  + AI-answer surfaces (AEO lane). Agent executes in browser; owner presses confirm.
- **Meta (pixel / Business Manager / CAPI) — NOT NOW.** Launch attribution is ruled wa.me + UTM
  only (D-20260719-22); no paid-social lane is live. Becomes an M3+ item the day an ads/pixel
  need opens; the CRM UTM-mapping build req (wiki/integrations/crm-centralized.md) is the
  prerequisite either way. Skipped per the ruling, not forgotten: logged here + M3 lane.

---

# ADDENDUM 5 — whyayurveda.org bulk export armed (owner+agent, 2026-07-20 11:56:10 IST)

Owner had Settings → Bulk data export open for https://whyayurveda.org/ (u/0 login owns it).
Agent verified the form live; typing was blocked by the permission classifier → owner entered values.
- Cloud project ID: kairali-analytics-os ✓ (owner-set) · Dataset location: asia-south1 (Mumbai) ✓ (owner-set)
- **DEVIATION: dataset name — the UI would not accept a change, stays `searchconsole`** (step 10 planned
  `searchconsole_whyayurveda`). Agent's ruling to the owner: PRESS CONTINUE anyway — the name is cosmetic
  while only ONE property exports into this project; the distinct-name rule only starts to bind at the
  SECOND property. ⚠ At the next property's setup: if its form also locks the name to `searchconsole`,
  the exports would collide — resolve THEN (options: check whether the field unlocks, or per-property
  Cloud projects). Flagged here so the Monday sweep sees it.
- First export lands ~48h after Continue; no backfill — remaining properties should follow soon.

---

# ADDENDUM 6 — whyayurveda.org bulk export DONE, location = DELHI asia-south2 (owner, 2026-07-20 ~17:40 IST) + region ruling needed

**LIVE ADMIN STATE (owner-reported, overrides addendum 5 and step 10 — rule j):** the owner completed
Settings → Bulk data export for https://whyayurveda.org/ with: project `kairali-analytics-os` ·
dataset `searchconsole` (the addendum-5 name deviation stands) · **location Delhi (asia-south2)** —
owner chose Delhi over the runbook's Mumbai ("we are based in Delhi"). Captured as D-20260720-28.

**VERIFIED FACTS (3-agent sweep, official docs + Tavily cross-checks, 20 Jul — full answers in the
session record):**
1. **Location is immutable in place** ("Bulk data export does not support changing the dataset
   location"). Official migration path: stop export → wait 24h → copy dataset → restart in the new
   location, losing ~1–2 days of data. Recreating an export has **NO backfill** — but the FIRST
   export only lands ~48h after setup, so **today (before any data flows) a redo costs ~nothing**.
2. **Cross-location joins are impossible** in a normal query (BigQuery colocation rule; location is
   per dataset). Workarounds are all paid/laggy (DTS copy 12h-min recurrence · cross-region replica
   with duplicate storage + egress · global queries still Preview). Consequence: the remaining 7 GSC
   property exports AND every GA4 BigQuery export MUST land in the SAME region as this dataset.
3. **Price: IDENTICAL** Delhi vs Mumbai on every BigQuery SKU (on-demand $7.50/TiB both; all storage
   and edition rates equal — parsed from the official pricing page + 2 cross-checks). **Feature gap:
   asia-south2 lacks BigQuery ML REMOTE models** (no Vertex AI endpoint / genAI SQL functions like
   ML.GENERATE_TEXT; built-in model training works). Mumbai has the fuller feature set. No India
   multi-region exists; both regions satisfy "data in India".

**ONE-WORDER FOR THE OWNER — Q-BQ-REGION (reply DELHI-STAYS or REDO-MUMBAI):**
- **DELHI-STAYS**: zero clicks; asia-south2 becomes the standard for ALL analytics datasets (step 10
  and the PENDING list update accordingly). Cost identical; the only loss = BigQuery's in-SQL AI
  functions would need a cross-region copy if ever wanted.
- **REDO-MUMBAI (recommended)**: one ~60-second form redo TODAY (stop the whyayurveda export →
  set it up again with location Mumbai asia-south1) — free only until the first export lands (~48h);
  keeps every BigQuery feature open (including the AI functions an AI-run operation may well want)
  and matches the runbook as written. After data flows, this same switch costs a dataset copy +
  1–2 days of data.
Whichever word comes back: **all 7 remaining property exports + GA4 exports use THAT region** — a
split brain between Indian regions is the one configuration the colocation rule punishes forever.

---

# ADDENDUM 7 — REDO-MUMBAI EXECUTED: whyayurveda export ACTIVE in Mumbai (agent in owner's Chrome, 2026-07-20 ~18:50 IST)

**LIVE STATE (GSC settings page, machine-verified on screen):** "Bulk data export is active — Exporting
to: kairali-analytics-os · `searchconsole_whyayurveda` · **Mumbai (asia-south1)**." First export ≤48h.
Q-BQ-REGION executed per D-20260720-31; the per-property dataset name (runbook step 10's original
intent) landed as a bonus.

**THREE OPERATIONAL FINDINGS (correct the addendum-5/6 record):**
1. **No dataset was ever created in Delhi.** BigQuery Explorer for kairali-analytics-os, filter off,
   tree expanded: zero datasets. The dataset only materializes at first export — so a pre-first-export
   redo truly costs nothing.
2. **"Dataset location mismatch" is GSC-side, keyed to the DATASET NAME.** Even with the export
   stopped and NO dataset existing, re-setup with the same name `searchconsole` + a new location fails
   (reproduced twice: owner, then agent). GSC retains the stopped config's name→location memory
   (presumably until a daily cycle clears it). **The dodge: use a different dataset name** — the
   per-property `searchconsole_<domain>` went straight through.
3. **The name field is NOT locked — it enforces the `searchconsole` stem and garbles inserted text.**
   Addendum-5's "UI would not accept a change" corrected: cmd+A + Delete resets the field to the bare
   stem (with trailing underscore), and APPENDING the suffix then works. Never paste/insert into the
   middle; never trust the field without zooming the review dialog. This unblocks per-property names
   for the remaining 7 properties — the addendum-5 name-collision worry is DISSOLVED.

**STANDING RESULT: region = Mumbai asia-south1 · naming = searchconsole_<domain> — BOTH now proven
paths for the remaining 7 GSC properties and the GA4 exports (same region, always).**

---

# ADDENDUM 8 — GO-EXPORTS EXECUTED: all 7 remaining GSC bulk exports ACTIVE in Mumbai (agent in owner's Chrome, 2026-07-20 ~19:35 IST)

**LIVE STATE (GSC "Setup completed successfully / Bulk data export is active" confirmation read on
screen per property, this session):** all seven remaining properties now export to
**kairali-analytics-os · Mumbai (asia-south1)**, per-property dataset names per the addendum-7
standing result:

| # | GSC property | login | dataset |
|---|---|---|---|
| 1 | http://www.arogyakendra.com/ | u/0 | `searchconsole_arogyakendra` |
| 2 | https://www.ayurvedichealingvillage.com/ | u/0 | `searchconsole_ayurvedichealingvillage` |
| 3 | http://www.kairalihospitality.com/ | u/0 | `searchconsole_kairalihospitality` |
| 4 | https://www.kairaliproducts.in/ | u/0 | `searchconsole_kairaliproducts` |
| 5 | http://www.kairalitea.com/ | u/0 | `searchconsole_kairalitea` |
| 6 | http://www.kairaliyoga.com/ | u/0 | `searchconsole_kairaliyoga` |
| 7 | https://ayurvedichealingvillage.com/ | u/1 director@ | `searchconsole_ayurvedichealingvillage_nowww` |

With whyayurveda.org (addendum 7) that is **8 of 8 property exports live, one region, one project** —
the colocation rule is satisfied fleet-wide. First exports land ≤48h per property; NO backfill, so
the continuous-history clock started today for all of them. Next: dataset hygiene pass (runbook
step 11) once tables exist — M3.

**OPERATIONAL FINDINGS (correct/extend the addendum-7 record):**
1. **Addendum-7 finding 3 re-diagnosed:** the name field never garbles anything — it is a plain
   input with a fixed `searchconsole_` PREFIX ADORNMENT, and after typing it horizontally scrolls
   so the value's first characters hide UNDER the adornment (visually reading as "eaten" text,
   e.g. `searchconsole_edichealingvillage_nowww`). The DOM value stays correct the whole time.
   cmd+A+Delete clears the VALUE only (the adornment always renders). The law stands unchanged:
   **trust only the Review-your-settings dialog**, which prints the full effective name.
2. **Deep links work** for both logins: `search.google.com/search-console/settings/bulk-data-export?resource_id=<property>`
   (u/0) and `search.google.com/u/1/search-console/settings/bulk-data-export?resource_id=…` (u/1);
   the authuser=1 QUERY form 500s — use the /u/1/ PATH form.
3. **Accounts-note truth-up (rule j):** director@'s AHV variant is **https://ayurvedichealingvillage.com/**
   (https, no-www) — the runbook's "http-nowww" note was stale. Also https://www.kairaliproducts.in/
   appears on BOTH logins (exported once, from u/0).
4. The form's first fill attempt right after page load is sometimes swallowed — fill, VERIFY the
   zoomed fields, and refill once if blank (took one retry on 3 of 7 properties).
