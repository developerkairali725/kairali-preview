# Domain-list ingest — findings (2026-07-14 16:10:08 IST)

**Source: "Domain List" Google Sheet (Sunaj/office; sheet id 1Nbb_V28…, gid 1694397055), shared to the machine 14 Jul; raw CSV frozen at [domain-list-sunaj-2026-07-14.csv](domain-list-sunaj-2026-07-14.csv) (87 domains + 2 strategy notes). Cross-checked against sweep_results.csv (87) and docs/redirects/forward-farm.csv (44).**

## Confirmations (sheet agrees with our plan)
- **Every flip-ready forward-farm row is marked "Forward" in the sheet** — the semantic-map source set and the office's own disposition match 1:1.
- raagcasa.com / raagvilla.com / theraagvilla.com: owned, Active, "Forward" (ownership now evidenced, not just stated).
- whatisayurveda.com registered **2026-07-07**, "to be created" — confirms the parking-page finding; .org "qa qc to be done" per D2.
- The sheet's e-commerce note ("affiliate-style category sites with unique content; shipping/payments on the main Shopify") **matches the product-microsite architecture exactly**.
- abhilashkr.com "to be hosted — site created in next.js" ✓ (it's in the factory).

## CONTRADICTIONS / corrections applied
1. **kairaliproduct.com is NOT a parked variant** — sheet: hosted **Shopify**, "To be updated: QA, QC". Today's forward-farm addition was wrong; row moved to **HOLD** (39 uploadable rules now). Needs Abilash's ruling on its future.
2. **Sheet note "they will all forward into one [main domain]" contradicts D1** (semantic map, Abilash-ratified 13 Jul: variants forward to the *topically nearest* live site, never all→one). D1 stands unless Abilash re-rules; the note likely predates it. FLAGGED.
3. **theblushlounge.com hosted: "Linux"** vs our finding (A record → DigitalOcean IP 64.227.129.189). Either the office "Linux server" *is* a DO droplet, or the sheet is stale — reconcile in Sunaj's server-audit reply.
4. **D6 not reflected**: sheet says "forward to sneha chowdhary or vice versa" — Abilash ruled theblushlounge = primary (13 Jul). Sheet needs the update once the rebuild ships.

## New facts worth acting on
- **Expiry cluster inside ~10 weeks**: snehachowdhary.com **2026-09-01** · kairalicenters.com **2026-09-03** (a LIVE main site!) · kairbykairali.com 2026-09-23 · whatisayurveda.org **2026-09-28** (live, ranking) · ayurvedafranchise.com 2026-10-01 · theblushlounge.com 2026-10-28. Renewals need registrar access — raises item-3 urgency.
- **Absent from the sheet**: kairalipharma.com (in our sweep + forward farm — owned? lapsed?), kagapp.com (KEEP-placeholder per drop-list ruling), kairaliproducts.cn, and the four DROP-list domains (consistent with dropping).
- Hosting column mapped per domain (Windows/Linux/Shopify/NA) — first real inventory of what runs where; feeds Sunaj's server-audit answers.

## Still missing vs the item-3 ask
The sheet has **no registrar column and no login-email column** — the two fields the Cloudflare consolidation actually needs. One-line follow-up to Sunaj: add "Registered with (company)" + "Login email" columns to the same sheet.
