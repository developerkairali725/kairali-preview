# WEEKEND UNBLOCK SHEET — one batched pass (18 Jul 2026, 17:11:08 IST)

Authority: D-20260718-08 (all new sites preview-ready by Mon 20 Jul, EXCEPT Shopify/commerce) + D-20260718-10 (landing pages + all blocker-free sites in weekend scope). This sheet is the ONE stop: answer the numbered items below (phone-style, e.g. `1a · 2 agree · 3 info@ · …` or `AGREE ALL except 5: <note>`) and the weekend build runs uninterrupted. Every item carries a recommendation — a bare `AGREE ALL` is a valid full answer.

Compiled from QUESTIONS.md / DECISIONS.md / BACKLOG.md / STATUS.yaml / handover-night §OPEN + a full sweep (agent-verified, source refs inline). Corrections to stale state are in §D — no answer needed there.

## §A — ONE-WORDERS (each single reply unblocks a build lane)

| # | item | ask | RECOMMENDATION |
|---|---|---|---|
| 1 | **Q-FR-MONEY** (kairalifranchise + ayurvedafranchise — BUILD START) | publish investment/fee/ROI figures, or gate behind enquiry form? | **(a) gate behind enquiry form for v1**; figures publish later when confirmed (QUESTIONS.md:151 rec) |
| 2 | **Q-FR-ROYALTY** | publish live royalty terms as-is? | **Defer — keep behind enquiry with #1a**; never publish unconfirmed financial terms (rule 6) |
| 3 | **Q-FR-CONTACT** | franchise enquiries → info@kairali.com or new franchise@? | **info@kairali.com for v1** (locked-fact consistency); franchise@ later if volume warrants |
| 4 | **Q-EQ-CATALOG ruling** (kairaliequipment — BUILD START) | no recoverable SKUs → ship category-level pages only for v1? | **YES — category-level v1**; full catalog when real data arrives (§B-1) |
| 5 | **Q-EQ-CLAIMS** | cert/export/own-manufacturing/heritage claims unverified | **v1 ships ONLY claims verifiable from mined materials; all else held** — confirm the held list when convenient |
| 6 | **Q-KC-DOMAIN** (kairalicenters richer — BUILD START) | canonical spelling: centers (site) vs centres (email)? | **kairalicenters.com** (live site + existing GSC property spelling) |
| 7 | **Q-KC-PARTNERS** | 6 partner-branded centres — owned or franchise? | If you can't rule tonight: **v1 presents all as "network centres" with no ownership claims** (honest, reversible) |
| 8 | **Decision #3 residual** (kairaliorganic shells) | which domain hosts which brand? | **DEFER to the Shopify track** — buy-path is Track-B-gated anyway; not in Monday scope |
| 9 | **O1** (shopify-catalog-lint.mjs missing vs doctrine (l)/(p)) | BUILD or AMEND doctrine? | **BUILD this weekend** — it becomes Monday's pilot tool for the catalog-cleanup batches (Shadab lane) |
| 10 | **O4** | ratify `run: automated\|agent\|human` enum | **KEEP** (honest three-way; registry stays as merged) |
| 11 | **Q-FRONT-GATE-BACKFILL** | arm front gates on the 8 pre-2D sites? | **Leave unarmed** (QUESTIONS.md:416 option 1) — new sites are armed by construction |
| 12 | **LP BRAINSTORM GATE** (D-20260718-10) | which landing pages first? | **Agent proposes 3 MODE B LPs — KTAHV consultation · franchise lead-gen · healing.recipes launch** — each stops at golden page for your approve; name different campaigns if you want others |
| 13 | **EMITTER CI WIRING** (PR #126 tranche 2) | ratify wiring emitters into CI + the verdict-commit step (the change that actually drops the 50-unproven count)? | **APPROVE as its own PR** (same pattern as O6: shipped un-wired, wiring ratified separately) |
| 14 | **BULK B2B ×2** (bulkayurvedaoils/-products — no recorded blocker) | build informational B2B lead-gen shells this weekend, buy-path deferred to Track B? | **YES** — competitor/niche research first per the 13-Jul launch-evidence rule (agent work, no input needed) |
| 15 | **Q-SOCIAL-LINKS-SOURCE** (D-20260718-04 — the rebuilt kairali.com repo footer has NO socials; agent correctly refused to invent) | LIVE kairali.com footer set (curl-verified 17:14 IST: FB /KairaliGroup · X /Kairali_Group · IG @kairali_the_healing_village · LI company/kairali-ayurvedic-group · Pinterest /kairalihealing · YT /user/kairaliayurvedagroup) **DISAGREES with your director@ signature set on 4 of 6 handles** (X KairaliGroup · IG @kairaliayurvedichealingvillage · YT @kairaliayurvedagroup · FB share-link). Which set is canonical — LIVE, SIGNATURE, or send corrected list? | **SIGNATURE set + Pinterest from live** (signature is hand-maintained and fresher; live WP footer predates the rebuild) — socials PR follows your word; healing.recipes carries them too unless you say otherwise |

## §B — DATA/ASSET DELIVERIES (yours; tonight-or-defer, weekend not blocked either way)

| # | item | if delivered tonight | if not |
|---|---|---|---|
| B-1 | **Equipment product data** (names/specs/photos) | full catalog build | §A-4 category-level v1 stands |
| B-2 | **Villa Raag final manual** + 10-step ramp hexes (Q15) + web type scale (Q16) | villaraag build starts (currently anchors-only, "provisional until final manual") | **villaraag DEFERS out of the weekend** — flagged, not silently skipped |
| B-3 | **Sneha's Blush Lounge originals** (IG @blushlounge_sneha; only low-res logo mined) | theblushlounge build starts | **theblushlounge DEFERS** until assets arrive |

## §C — THIRD-PARTY (routed, not weekend-blocking)

- **Per-centre NAP** (Raipur hours, addresses) — Abishek; only gates the RICHER centres pages' final content, not the build start.
- **Eeshal org invite + final push** — kairali.guru migration is Wave 2, not Monday.
- **Q-EQ-SECURITY** (live equipment site HTTP 500 + path leak) — Deepu/Sunaj lane; go-live hygiene only.
- **Ambuj's two Storefront tokens** — commerce track, excluded from the Monday aim; Wave-1 microsites wait on it as before.
- **Shadab's reply** to the 17:08 IST access/tokens email — gates the Monday Shopify pilot only.

## §D — CORRECTIONS TO STALE STATE (no answer needed; close-PR fixes the records)

1. **Decision #4 CLOSED, STATUS.yaml reversed it**: ayurvedafranchise.com is the canonical BUILD, kairalifranchise 301s INTO it (DECISIONS.md:248). STATUS blocker line was stale — fixed in this session's close PR.
2. **Decision #2 CLOSED** (whatisayurveda.com canonical, .org forwards at Wave-2) · **Decision #6 CLOSED** (theblushlounge primary, snehachowdhary forwards).
3. **Forms schema (old Q#3) CLOSED** — packages/forms built + live-tested (#55); only Satyam's production webhook URL remains, at go-live.
4. **Gate B–E: SENT** — Abilash fired all four himself 16:40 IST (the sweep read pre-send state; BACKLOG DONE has the send log + message ids). Round B–E is live; next is reply-tracking.
5. **kappl.co.in shipping**: aggregator RULED = ESHOPBOX (DECISIONS.md:66); only residual couriers read at Shopify kickoff — STATUS's "3× unanswered" is partially stale.
6. Items NOT build-blocking for Monday and left as-is: DE/FR banned lists (EN ships), claims-jurisdiction matrix (v1 no-cure floor suffices), MDX-frontmatter convention (implemented v1), severity split, kairali.com agency intake (Wave 4), whyayurveda interim forward (Wave-2 cutover).

## §E — WHAT BUILDS THIS WEEKEND ONCE §A IS ANSWERED

With `AGREE ALL`: **ayurvedafranchise.com (canonical franchise build) · kairaliequipment.com (category v1) · kairalicenters.com richer · bulkayurvedaoils.com + bulkayurvedaproducts.com (B2B shells) · 3 landing pages (golden-page stops each)** — plus B1/B2/B3 additions if delivered. Every site: own worktree, front-gate law, MODE B one-direction proposal where design-intake is empty, golden page → STOP for your phone approve, no publish, no DNS. Already-preview sites keep absorbing the social-links/chat-bubble amendments as you merge those PRs.

*Compiled per report-deliverable rule; timestamped 2026-07-18 17:11:08 IST.*
