---
report_id: RPT-20260720-ACCESS-VERIFY
date: "2026-07-20 21:32:00 IST"
task: "Machine-verify Sunaj's Owner/Admin claims (HIGH-PRIORITY thread 19f7a1bb082b6bb1) — GSC both logins + GA4, before closing chase item 1"
project: "OS v2"
source_tool: "claude-code + claude-in-chrome (owner's Chrome, D-20260720-17 lane) + 2 subagent audit loops"
type: audit
supersedes: null
---

# ACCESS VERIFY — Sunaj's "all done" claim, machine-checked screen by screen

Claim under test (sysadmin@, 11:58 IST): "All existing account access has been given done."
Vikash (13:00 IST): "Owner Access Given / I Don't Have Right Administrator Access Given."
Method: read every access screen from the owner's Chrome — GSC as u/1 (director@), GA4 as
authuser=1 (director@) AND authuser=0 (abilash.kr@gmail.com). Strictly read-only. Every row
below was read off the live screen this session (OBSERVED_FIRST_PARTY).

## VERDICT IN ONE LINE

**GSC half: TRUE — CLOSED. GA4 half: PARTIAL — 6 of 15 done, 3 grantable-in-minutes, 7 are
property-less shells that cannot be granted and belong on the TASK-2 CLOSE list instead.**

## 1. GSC — all five 19-Jul gaps FIXED (Sunaj's claim TRUE here)

| property | director@ (u/1) | kairali-os-reader |
|---|---|---|
| sc-domain:villaraag.com | **Delegated owner ✓** | present ✓ |
| http://www.kairali.com/ | **Delegated owner ✓** | present ✓ |
| http://www.kairaliayurvedainstitute.com/ | **Delegated owner ✓** (added 20 Jul) | present ✓ |
| http://www.kairalitraining.com/ | **Delegated owner ✓** (added 20 Jul) | present ✓ |
| http://www.keralatraining.com/ | **Delegated owner ✓** (added 20 Jul) | present ✓ |

(kairalicenters.com rides the Abhishek/Gaurav lane — Owner added 11:20 IST in writing; its
bulk export is the next task in this session.)

## 2. GA4 — director@ Administrator on 6 of 16; the other 10 split 3 + 7 (count truth-up: the task email said "15" but listed 16 accounts — the two Villa Raags)

**Administrator ✓ (6):** Kairali 384203334 · Kairaliproducts.com 352447311 · Villa Raag
346054077 · VillaRaag 376287257 (2-user near-empty duplicate) · Kairali-The Ayurvedic
Healing Village 41990250 · Why Ayurveda 43055304.

**director@ ABSENT — grantable in minutes (3):** kairaliequipment.com 53596178 ·
kairalihospitality 42461617 · kairaliyoga.com **41701680** (the task email had no id; recovered
on screen). On all three: abilash.kr@gmail.com IS Administrator (owner can self-grant), and the
legacy alias sysadmin%kairali.com@gtempaccount.com is Administrator too (Sunaj CAN execute
these — they were simply missed).

**Property-less shells — CANNOT be granted via UI (7):** kairaliproducts.us 109852464 · Kerala
Ayurveda Institute 51315790 · Kerala Equipments 51307833 · Kerala Training 51517067 · SpaZense
46662440 · Tourdenight.com 49647585 · What Is Ayurveda 51306046. All show zero GA4 properties
(sunset-UA-only shells); the GA4 UI exposes no account-access screen without a property. **These
are the natural first draft of the TASK-2 CLOSE list** — Google already deleted UA data in 2024,
so the "unexported historical data" guard is very likely moot, but per the owner's own rule
nothing closes without his per-list confirmation.

## 3. Vikash's side — his pushback is CONFIRMED honest

seo@ktahv.com is Editor on KTAHV, None/lower-level on Villa Raag, Administrator only on the
VillaRaag 376287257 duplicate. He genuinely lacks the Administrator seat he'd need — his "I
Don't Have Right Administrator Access" line is accurate, and his GA4-admin gap is now the
blocking half of nothing: the 3 missing grants route around him (owner or Sunaj).

## 4. Robot reader (kairali-os-reader@kairali-analytics-os.iam.gserviceaccount.com)

Present as Viewer on: Kairali 384203334, Villa Raag 346054077, KTAHV 41990250, Why Ayurveda
43055304. **Missing on:** Kairaliproducts.com 352447311, VillaRaag 376287257, and all three
owner-admin accounts (equipment/hospitality/yoga). GSC side: present on all five verified
properties.

## 5. Cleanup intel banked for TASK 2 (beyond the 7 shells)

- Legacy gtempaccount Administrator rows (sysadmin%kairali.com@gtempaccount.com) on most
  readable accounts, plus sunaj.kairali@gmail.com personal-gmail Administrator seats — access
  hygiene items for the same cleanup pass.
- Name-twin hazard: Kairali vs Kerala variants with DIFFERENT ids (two Training, two Ayurveda
  Institute accounts); reconcile by id only.
- Picker rosters diverge hard between the two logins (32 accounts under abilash.kr@, far fewer
  under director@) — full roster captured in session transcript for the cleanup proposal.

## 6. DISPOSITION

- Chase item 1: **stays OPEN on the GA4 half only**, with the precise 3-grant + 7-shell split
  above. GSC half closed. Sunaj's next ask is now surgical: "grant director@ Administrator on
  53596178, 42461617, 41701680 + add the robot Viewer where missing" — or the owner self-serves
  the 3 grants from abilash.kr@ in ~2 minutes.
- TASK-2 CLOSE-list proposal drafts from §2's shells + §5's hygiene rows; owner confirmation
  gate per his own email before anything closes.

## 7. ADDENDUM — the 3 grants EXECUTED same session (owner's in-chat GO, D-20260720-17 lane)

2026-07-20 ~21:50 IST, owner's Chrome, abilash.kr@ login: director@kairali.com added as
**Administrator** on kairaliequipment.com 53596178, kairalihospitality 42461617, and
kairaliyoga.com 41701680 — each add verified by re-reading the live access list (row present,
role Administrator). GA4 tally is now **9 of 16 Administrator** (6 pre-existing + 3 granted
tonight); the only remainder is the **7 property-less UA shells** of §2, which are un-grantable
and belong on the CLOSE list. **Chase item 1's GA4 half now reduces to: (a) robot-reader Viewer adds on 5
accounts (equipment/hospitality/yoga + Kairaliproducts.com 352447311 + VillaRaag 376287257) —
the agent-side classifier correctly refused to type the service-account address, so these are
one line in Sunaj's follow-up OR 5 owner pastes; (b) the TASK-2 CLOSE-list confirmation for
the 7 shells.** No user was removed, no role changed except the 3 adds; Notify-by-email stayed
on, so director@'s inbox holds Google's own confirmation of each grant.

## 8. DISPOSITIONS (triad — every finding rowed)

| finding | verdict | reason |
|---|---|---|
| GSC: all five 19-Jul ownership gaps fixed, robot present (Sunaj claim TRUE) | IMPLEMENT | executed by Sunaj, machine-verified §1; chase item 1's GSC half CLOSED on this record — no further action |
| GA4: 3 grantable director@ gaps (equipment/hospitality/yoga) | IMPLEMENT | executed same session in the owner's Chrome on his in-chat GO (§7, D-20260720-37), each verified on the live access list |
| GA4: 7 property-less UA shells cannot be granted via UI | IMPLEMENT | routed into Sunaj's TASK-2 CLOSE proposal (follow-up mail sent); nothing closes without the owner's per-list confirm |
| Robot reader missing on 5 GA4 accounts | IMPLEMENT | agent-side typing classifier-blocked; the adds ride the sent Sunaj follow-up; falls back to owner-paste staging on his word |
| Vikash lacks GA4 Administrator (his pushback honest) | MONITOR | no action owed by him for chase item 1; his seat rides the cleanup pass — WAITING-ON Sunaj's CLOSE-list reply (Wednesday deadline in the sent mail) |
| Legacy gtempaccount + personal-gmail Administrator seats (§5 hygiene) | IMPLEMENT | folded into the same Sunaj cleanup proposal: one identity per person, work accounts only |
