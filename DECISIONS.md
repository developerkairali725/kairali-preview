# DECISIONS.md — append-only

## 2026-07-13 18:28:44 IST — Abilash, in-session rulings
- D6: theblushlounge.com = PRIMARY (live domain); snehachowdhary.com = secondary/forward.
- D3: Kairali Organics and KAIR are TWO brands. Organics = 100% chemical-free products; KAIR = soaps/shampoos/moisturizing cream/body wash (not fully chemical-free).
- D2: whatisayurveda.com = canonical; .org (older) forwards to it. Context in historical chats.
- D1 (forward strategy): delegated to agent — research best-ROI, Google-compliant approach (Reddit/expert consensus) and decide; Runbook §2D semantic map is the starting recommendation.
- Drop list: balanceglow, mobistorr, tourdenight, trueinstantloan → DROP. kagapp = KEEP as placeholder (future app). All .in centre variants = plain forwards.
- kairali.guru: intern (Eeshal) repo github.com/Eeshal27/kairali-guru- confirmed as her latest; plan = evaluate as baseline, migrate into monorepo, Eeshal continues work in the Factory repo via PRs.
- Launch evidence: filled sitewide+pagewise checklists committed per launch in launches/<domain>/ (CLAUDE.md rule).
- Team: Eeshal, Deepu, Ambuj, Sunaj, Satyam join via GitHub org invites (Abilash executes); PR + Vercel-preview review flow; only Abilash merges main.

## 2026-07-13 18:51:36 IST — Abilash, evening rulings
- INTERIM chat: use the existing Priya/Chatbase bot (chatbotId rpNt_uRW6W8EDiTf6AvYJ, extracted from live kairali.guru) on new sites NOW; replace with the four entity bots later. Compliance caveat noted: clinical-register bot on non-clinical surfaces is temporary by owner's order.
- INTERIM WhatsApp: chat-first CTAs on all sites (email alone is not enough — most clients won't write email). Use Priya's +91 92898 38797 until a group number is provided; swap later.
- kairali.guru upgrade: blend the LIVE site's design + Eeshal's repo design, improve both — neither is the ceiling.

## 2026-07-13 18:55:39 IST — agent research per D1 delegation
- D1 CLOSED (forward strategy): SEMANTIC MAP adopted — every surplus domain 301s (Cloudflare Bulk Redirects, single hop, no chains, never in Ads final URLs) to the topically nearest LIVE Kairali site, never all→one; full findings, citations and per-family mapping rules in docs/research/forward-strategy-D1.md.

## 2026-07-14 11:59:06 IST — agent, stale-fact correction per SPRINT_STATE gap #14 (standing instruction: register-table amendments via DECISIONS)
- kairali.guru LIVE-site locale fact corrected: the live site is EN-ONLY (verified 13 Jul — /de/ 404s, no hreflang, dead UA analytics). The EN/DE/FR/AR/RU build exists ONLY in Eeshal's repo and becomes real at the Wave-2 migration. SITE_DESIGN_LOCALE_REGISTER.md row amended this commit. PROJECT_CONTEXT.md §1/§3/§7 carry the same stale claim but the file is being replaced wholesale by PR #2 (mentor doc-sync, same stale lines) — patching those three lines is queued in BACKLOG for immediately after PR #2 merges, so the fix isn't lost in a merge conflict.

## 2026-07-14 11:59:06 IST — agent, design-critic gate formalized (BACKLOG NOW item; SPRINT_STATE action #10)
- The ad-hoc arogyakendra design pass is now LAW for every Factory site: scripts/design-review/PROMPT.md (skeptical-marketer persona, 5 criteria, mobile-first method, computed-style audit, average ≥9.0/10 + no criterion <7, max 3 iterations) + Ship Gate B-14 in SITE_LAUNCH_CHECKLIST_v1.0.md. Evidence contract: launches/<domain>/design-review.md with an Honest-limitations section. Criteria amendments only via LEARNINGS-driven PR.

## 2026-07-14 13:14:52 IST — Abilash, in-chat rulings (post-PR#2-merge session)
- **Nakshatra villa 212 = ROYAL** — the Nakshatra guide is correct, the website archive is wrong. (Maharaja Suite names for 1001/1002 still unresolved — re-asked.)
- **kairali.guru student-hub:** Eeshal's version is a TEMPORARY benchmark — will be redone properly; improve on it, don't preserve it. No online digital program exists today → student-hub/program surface ships as "coming soon". Her sitemap/architecture is good — keep it as the Wave-2 baseline.
- **Design-source protocol extended to the Factory track** (mirrors D9(iv)): Awwwards/Mobbin/CSSDA primary; **Dribbble/Pinterest are valid at COMPONENT level only** (never whole-page copying); every design decision cites its source; brand tokens always win (CLAUDE.md rule d).
- **Asset-generation roster + prompt-handoff rule:** Claude Code does NOT generate raster/visual assets itself (images, buttons, PNGs — quality insufficient, Abilash observation). Instead it drafts the EXACT prompt and names the tool; a human runs it. Approved tools: Higgsfield (per-register policy codes stand), ChatGPT's image model (Abilash cited "Sol 5.6" — exact model name to confirm), Google Nano Banana (Gemini image). Register/imagery law unchanged: no AI humans/patients/physicians on KTAHV, ever.
- **Triple Whale reality check:** account is FREE tier — Moby is not present, so D8's "Autopilot OFF" rule is dormant until any purchase. Moby purchase (~$2,200/yr) DEFERRED pending the Shopify Stage-0/U7b audit (plan cost vs GMV vs features actually used) — agent recommendation, Abilash to re-decide with the audit data.
- **Measurement access:** Abilash signed into Google Ads + Analytics + Search Console + Semrush in the browser — read access for baselines/exports now possible via browser sessions; property/container CREATION remains per-action approval. Staff (Vikash) handover no longer blocks reads.
- **Blush Lounge droplet:** Abilash calling Sunaj to restore the origin.

## 2026-07-14 13:38:20 IST — Abilash, second ruling batch (in-chat)
- **abhilashkr.com brand ruling (ratifies the 14 Jul exemption):** his personal site does NOT use Kairali tokens — may be *inspired by* Kairali colors, never required to match. site.config.json brand:"none" stands.
- **Shopify store structure (Stage-0 U1, PROVISIONAL):** kairaliproducts.in and kairaliproducts.com are TWO deliberately separate stores — .in for Indian compliance + Indian payment gateways, .com for international compliance + gateways. Abilash: "I'm not sure. Let me know." → recorded as the working answer; VERIFY against the live admin at Shopify kickoff (Settings → Domains/Markets) before anything depends on it.
- **Domain ownership confirmed:** all domains on the Runbook §2D domain sheet are owned, incl. raagcasa.com / raagvilla.com / theraagvilla.com → un-HELD in forward-farm.csv (target villaraag.com, flip-ready). kairaliproduct.com (singular) added to the products family per the standing semantic-map decision.
- **Consent banner × Chatbase overlap: FIX NOW** (not deferred) — implemented: banner sets data-consent-open on <html>; the chat bubble yields (hidden) while the banner is open, reappears on choice.
- **whatisayurveda .org→.com flip: BLOCKED by evidence, not by choice.** Abilash said flip now; live check shows whatisayurveda.com serves a registrar PARKING lander (JS redirect to /lander) while .org is the live content site — 301ing live content into a parked page is the exact soft-404 pattern D1 rule 8 forbids. D2 (.com canonical) stands; the flip executes when the Wave-2 .com site is LIVE. whyayurveda.* interim → .org unchanged.
- **Moby 2 purchase:** deferred pending real GMV/ad-spend numbers — to be pulled read-only at the Shopify kickoff (Stage-0/U7b audit); decision framework given to Abilash (see chat 14 Jul).

## 2026-07-14 13:55:47 IST — Abilash directives, third batch (in-chat)
- **AI-content doctrine (research-backed, 25+ sources):** websites must never read as low-value AI output — but the mechanism is QUALITY, not camouflage. Google runs no AI detector and rewards quality "however produced"; it punishes scaled low-value patterns (March-2024 policy, 2025 manual actions). **Humanizer tools/APIs REJECTED** — independent tests show they degrade content and their "Reddit consensus" is vendor astroturf; detector-score gates rejected (15–45% false positives). Adopted instead: the **Human-Authorship Standard** (SEO_PLAYBOOK §6, PR #13): information gain per page · real bylines + Person/Physician schema · human editorial pass before publish · restrained velocity (no mass generation, ever) · YMYL prune-don't-humanize · IPTC AI-labels on generated imagery. No new API/MCP needed.
- **Origin-server deploys:** standing architecture confirmed to Abilash — new sites NEVER deploy to the Windows/Linux origins (PROJECT_CONTEXT §5); GitHub→Vercel is the safe/economical lane (already paid, previews + rollback built in). WP tail changes stay on Lane B (REST → staging slug → human publish). From Sunaj: Phase-0 AUDIT access only (inventory, limited SSH, backups, ports, patch level + KTAHV WP Editor app-password) — no deploy credentials to the origins.
- **Vercel relink VERIFIED:** kairali-web-factory-abhilashkr now builds from kairali-digital/kairali-web-factory; per-PR failures stopped (Step 1 of the one-by-one queue done).

## 2026-07-14 15:58:00 IST — Abilash, in-chat rulings (fourth batch)
- **Maharaja Suites RESOLVED (closes the last Nakshatra conflict): room 1001 = Shivalaya · room 1002 = Brahmalaya.** The Nakshatra guide's mapping stands where it agrees with this; the website archive was wrong on the swap (consistent with the 212=Royal ruling — the guide is the authority).
- **Shipping aggregator + couriers (runbook Part 4 blanks): Sunaj will supply** — answer routes into SHOPIFY_TRACK_CONTEXT §9B when it arrives.
- **Image-model choice delegated to agent** ("hyper-realistic, must look real not AI-made, check editing capability") — research running; result lands below when decided. Constraint unchanged: ambient/product only per register policy; NO AI humans on KTAHV, ever.

## 2026-07-14 15:22:13 IST — agent, image-gen roster decided (Abilash delegation, fourth batch)
- **PRIMARY = OpenAI GPT Image 2 (`gpt-image-2`)** — #1 on both Artificial Analysis leaderboards (generation Elo 1336 + editing Elo 1256, Apr 2026); the key Abilash stored 14 Jul is exactly the right one ("ChatGPT image model" instinct confirmed — the 2025 "yellow-tint" objection is superseded, color-grade QA retained). Ambient at medium+Batch ≈ $0.026/image; hero/product at high ≈ $0.21.
- **FLUX.2 (BFL) = pixel-locked edit specialist** (GPT edits drift unmasked pixels) · **Nano Banana 2 = fallback/bulk/4K** · **Higgsfield = video only, not stills** · Midjourney REJECTED (no API, no C2PA, revenue clause). Full roster, prompting guide ("photographer's brief", demand imperfection, never prompt 'hyper-realistic'), and metadata law (C2PA/SynthID never stripped; IPTC labeling at ingest; quality not camouflage) in docs/design/IMAGE_GEN_ROSTER.md.
- **People routing correction (Abilash):** domain list, Shopify staff, Sentry, Triple Whale → SUNAJ; Chatbase → AMBUJ. Abilash to answer Chatbase owner + TW pixel-installed directly.
