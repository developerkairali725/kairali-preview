---
report_id: RPT-20260721-ASTHA-INGEST
date: "2026-07-21 12:24:00 IST"
task: "Astha 8-site feedback ingestion — all 35 items verified item-by-item against main + live previews, classified into lanes"
project: "OS v2 / web factory"
source_tool: "claude-code workflow (8 verify agents + 12 adversarial refuters, run wf_cf8fd408-610)"
type: ingest-screen
supersedes: null
---

# ASTHA FEEDBACK INGESTION — 21 Jul 2026

Source: Gmail 19f7f731970e3d68 (Astha Kumari, Marketing Manager, 20 Jul 17:44 IST — reply to the
18 Jul review-round mail). Verified against **main @ 0f90009** and the live Vercel previews on
21 Jul. Every item below carries machine evidence (file:line and/or preview fetch) from the
verification workflow; verdicts classified ALREADY_FIXED / CHALLENGE were additionally put through
an adversarial refute pass. Two verdicts were REVERSED by that pass (§4) — the pass earned its keep.

Feedback is DATA, item-by-item, never clubbed. Nothing was edited on a guess (HARD GATE 6).

## 1. ROLL-UP

| Lane | Count | Items |
|---|---|---|
| Stale — already fixed on main + LIVE on preview (no-op) | 6 | all six "social links missing" items (PR #204 merged 22:49 IST, 5h after her review; refute-verified rendered on every preview, Instagram off per D-20260720-41) |
| Challenge back (feedback factually wrong; evidence in §2) | 3 | healing.recipes grammar · kairalihospitality sitemap · kairaliyoga sitemap |
| Normal-PR fixes (no owner word needed) | 8 | §3 fix wave A–D |
| Asset gaps → creative lane | 4 | arogyakendra images (7 slots) · arogyashala photography · healing.recipes author photo · kairali.com Centres-card photo |
| Owner word required | 8 rulings | §5 (QUESTIONS.md entries this PR) |
| Asks back to Astha | 3 | §6 |

## 2. FULL REGISTER (site · item → verdict → lane)

**arogyakendra.com**
1. Logo missing → VALID_FIX — header is a text wordmark (page.tsx:163-165); KAG_logo.svg already
   in image-library/brand-assets/svg/ (Q17 closed 15 Jul, swap explicitly intended). → PR B.
2. Image missing → ASSET_GAP — all 7 slots are deliberate described placeholders (HARD GATE 6);
   IMAGE_MANIFEST.md specs written. → creative lane.
3. Email CTA "not working" → **REFUTE-REVERSED: VALID_FIX (mobile overlay defect)** — Playwright
   at 375×812: Chatbase proactive bubbles (z 2147483644, pointer-events auto) cover the hero
   "Write to info@kairali.com" button; taps resolve into the chat container; the chat launcher also
   overlaps the sticky email icon. WhatsApp button sits above the overlap → her exact asymmetric
   symptom, reproduced. Anchors + analytics listener themselves are correct. → PR D (fleet check).
4. Corporate office address in footer → STRATEGY_OWNER — address itself is repo-verified (D-130,
   Block D, Ambedkar Colony, Mehrauli, New Delhi – 110030); rendering it is a new fleet decision. → Q.
5. Socials → ALREADY_FIXED (refute-upheld; one provenance nit corrected: the footer render landed
   via #204/c5307a2, not #127 as first cited).
6. Policies → VALID_FIX — /privacy /terms /cookie-policy exist and 200, but the footer links NONE
   (fleet outlier; 9+ siblings link them). → PR A. Also fix stale layout.tsx:58-59 comment.

**arogyashala.in**
1. Logo = icon only → VALID_FIX — header renders bare 44×31 icon, no name text; fleet pattern pairs
   icon + wordmark. → PR B (text wordmark; a drawn logo would be creative-lane, none exists).
2. Images missing → ASSET_GAP — deliberate original SVG illustration ("an honest drawing beats a
   stock fake"); zero photo assets in repo. → creative lane.
3. Email CTA → challenge upheld on desktop evidence (4 standard mailto anchors, nothing intercepts;
   no-mail-handler signature) — **BUT** arogyakendra's reversed twin (same Chatbase package) means
   PR D MUST mobile-test this site too before the challenge is sent back. → PR D verify.
4. Add inquiry form → STRATEGY_OWNER — new feature on a frozen two-CTA design; forms are a
   strategy-gate integrations decision (backend/CRM + consent). → Q.
5. Socials → ALREADY_FIXED (refute-upheld).

**healing.recipes**
1. "Meet all four books" grammatically incorrect → CHALLENGE_FEEDBACK_WRONG (refute-upheld) —
   "all + numeral + plural noun" is standard English; her own suggested fix keeps "Meet". No-op
   unless the owner prefers a style change.
2. S&S buy link for Harmony → UNVERIFIABLE — books.json ships 4 verified retailers; targeted S&S
   searches find NO Harmony page (only The Ayurvedic Cookbook, whose S&S link already ships);
   direct probes 403 (bot-block). Likely title confusion. → ask Astha for the exact URL (§6).
3. Author image missing → ASSET_GAP — gap already logged for the owner in IMAGE_MANIFEST.md:19-20;
   ships text-first by design. → creative lane.
4. Socials → ALREADY_FIXED (refute-upheld).

**kairali.com**
1. "Health through Ayurveda" logo missing → VALID_FIX — header ships icon_color.svg + HTML span;
   the 15 Jul DECISIONS entry already ruled the header swap to KAG_logo.svg and #63 shipped the
   icon instead. → PR B.
2. Six-doors images wrong → ASSET_GAP (half) + challenge (half) — Centres card confirmed: it renders
   a KTAHV product-display photo because the curated library has ZERO centre photography (candidate
   pool: 182 unvetted mined images in image-library/legacy-kairalicenters/). Healing-Village card
   DISPUTED: the Ganesha entrance is provenance-verified KTAHV's own gate (catalog + 2025 shoot).
   → creative lane + ask Astha (§6).
3. Policies missing in footer → VALID_FIX — pages exist + 200; footer links none. → PR A.
4. Socials → ALREADY_FIXED (refute-upheld, timing git-proven: pre-#204 tree had zero Social matches).

**kairalicenters.com**
1. Contact details → FACT_CONFLICT_OWNER — she wants legacy +91-9555156156 + info@kairalicenters.com;
   preview correctly renders the LOCKED email (info@kairali.com everywhere) + the 13-Jul interim
   Priya WhatsApp (now the AI assistant, D-20260721-07). Her observation is accurate; her prescribed
   fix breaks a lock. NOT edited. → Q (top of §5).
2. Socials → ALREADY_FIXED (refute-upheld).

**kairalihospitality.com**
1. "VYSOCINA" in home images → live TEXT, not baked into any image (hero place strip GOA · PALAKKAD ·
   VYSOČINA); deliberate, rides the Katerina ruling. → Q.
2. Svata Katerina "not our property" → FACT_CONFLICT_OWNER — owner-sourced LOCKED facts (16 Jul) +
   D-KH-JV-LABEL (17 Jul) ship it as "in cooperation with", no ownership claim. Nuance in her
   favour: the 3-properties/2-countries counters + footer "The properties" nav DO lump it in. → Q.
3. Founders "1 country 2 properties" → same ruling (counters flip only if Katerina comes off). → Q.
4. Consultancy Czech info → same ruling (sentence is a D-KH-JV-LABEL applied surface). → Q.
5. Footer Katerina mention → same ruling (strongest ownership-implying surface; relabel option). → Q.
6. No sitemap → CHALLENGE (refute-upheld, exhaustively: sitemap.ts since 17 Jul; preview
   /sitemap.xml 200; even the legacy live IIS site serves one; every deployment ever contained it).
7. Socials → ALREADY_FIXED (refute-upheld).
8. No FAQ → STRATEGY_OWNER — factually correct, but the one-pager shipped gate-passed without one;
   content would come from owner/marketing, never invented. → Q.

**kairaliyoga.com**
1. Logo not clearly visible → STRATEGY_OWNER — mark IS present; 44px tri-colour icon blends into the
   green dawn hero (screenshot-verified perception, nothing broken); repo has icon mark only, ch.02
   forbids recreating the logo. → Q.
2. Sitemap missing → CHALLENGE (refute-upheld; preview AND legacy live site both serve sitemap.xml).
3. Link kairali.guru in training section → VALID_FIX with a TIMING caveat — zero guru links today;
   premise checks out (guru = live training arm, matching course ladder). Caveat: guru live pages
   still print 2019-expired rates until Sunaj publishes the corrective (watch lane 1). → PR C for
   the CSS half; link lands behind the guru-pages QA pass or the owner's word (§5).
4. Evening image doesn't fit frame → VALID_FIX — CONFIRMED in live DOM: portrait 1066×1600 forced
   into aspect-ratio 3/2 cover (55% cropped). Same latent defect on the Sunrise entry. → PR C.

**whatisayurveda.com**
1. Policies missing → VALID_FIX — pages exist + 200; footer links none (fleet outlier). → PR A.
2. Sitemap missing → **REFUTE-REVERSED: DECLINE_BY_DESIGN, explain + gate** — XML sitemap exists
   (29 URLs, robots-advertised), but she flagged "no sitemap" on 3 sites that all serve XML
   sitemaps — the consistent reading is she means a VISIBLE sitemap, which no fleet site ships
   (convention). → reply explains /sitemap.xml; fleet-wide visible-sitemap question → Q.

## 3. FIX WAVE (normal PRs, no owner word — "rest ride normal PRs")

- **PR A — footer policy links parity:** arogyakendra + kairali.com + whatisayurveda footers link
  /privacy /terms /cookie-policy (pages already exist; copy the healing.recipes chrome pattern);
  fix arogyakendra layout.tsx stale comment. ~link wiring only.
- **PR B — brand marks:** arogyakendra header renders KAG_logo.svg (asset in hand, Q17) ·
  kairali.com header lockup swap per the 15 Jul ruling · arogyashala icon + site-name wordmark
  (fleet pattern).
- **PR C — kairaliyoga timeline CSS:** portrait-aware frames for Evening + Sunrise entries
  (aspect-ratio/object-position fix, both verified portrait-in-3:2).
- **PR D — Chatbase overlay defect (mobile):** arogyakendra confirmed occluding the hero email CTA
  + sticky bar at 375×812; audit + fix placement/z-offsets across ALL fleet sites using the chat
  package (arogyashala explicitly retested mobile); Playwright evidence before/after.

## 4. REFUTE REVERSALS (why the adversarial pass mattered)

1. arogyakendra #3: static analysis said "reviewer has no mail client" — runtime mobile testing
   found the Chatbase overlay really does eat the taps. The challenge would have been WRONG.
2. whatisayurveda #2: technically-true XML-sitemap defence answers a claim she plausibly never
   made (3-for-3 pattern across her sitemap flags). Routed to explain-and-gate instead of
   FEEDBACK_WRONG.

## 5. OWNER-WORD ITEMS → QUESTIONS.md (this PR)

Q-KCENTERS-CONTACT · Q-KH-KATERINA (covers hospitality 1–5, one ruling) · Q-KH-FAQ ·
Q-AS-FORM · Q-CORP-ADDRESS · Q-KY-LOGO · Q-KY-GURU-LINK · Q-SITEMAP-VISIBLE.

## 6. DISPOSITIONS (triad — one row per finding)

| # | Finding (site · item) | Verdict | Reason |
|---|---|---|---|
| 1 | arogyakendra 1 logo missing | IMPLEMENT | icon+name header landed, PR #223; horizontal lockup asset owed via Q-KAG-LOCKUP creative lane |
| 2 | arogyakendra 2 images missing | IMPLEMENT | creative-lane asset requests per IMAGE_MANIFEST specs (deliberate placeholders until real photos) |
| 3 | arogyakendra 3 email CTA dead | IMPLEMENT | real mobile defect (Chatbase bubble occlusion) — package fix, PR #225 |
| 4 | arogyakendra 4 corporate address | MONITOR | WAITING-ON owner word (QUESTIONS.md Q-CORP-ADDRESS); address itself repo-verified |
| 5 | arogyakendra 5 socials missing | REJECT | stale — PR #204 landed 5h after review; refute-verified live on preview |
| 6 | arogyakendra 6 policies missing | IMPLEMENT | footer links landed, PR #222 (pages existed since #37) |
| 7 | arogyashala 1 logo icon-only | IMPLEMENT | name wordmark beside icon landed, PR #223 |
| 8 | arogyashala 2 images missing | IMPLEMENT | creative-lane request; deliberate SVG illustration stands until photos exist |
| 9 | arogyashala 3 email CTA dead | IMPLEMENT | same package fix applies, PR #225; mobile hit-test verified all 4 mailto CTAs clean |
| 10 | arogyashala 4 inquiry form | MONITOR | WAITING-ON owner word (Q-AS-FORM) — frozen design, strategy-gate integrations decision |
| 11 | arogyashala 5 socials missing | REJECT | stale — same #204 timing; refute-verified live |
| 12 | healing.recipes 1 CTA grammar | REJECT | "all four books" is standard English; refuter upheld — style preference, not a correction |
| 13 | healing.recipes 2 S&S Harmony link | MONITOR | WAITING-ON Astha's exact URL — S&S searches find only The Ayurvedic Cookbook; HARD GATE 6 forbids guessing |
| 14 | healing.recipes 3 author image | IMPLEMENT | creative-lane request (gap already logged for owner in IMAGE_MANIFEST) |
| 15 | healing.recipes 4 socials missing | REJECT | stale — same #204 timing; refute-verified live |
| 16 | kairali.com 1 lockup missing | MONITOR | WAITING-ON Q-KAG-LOCKUP — supplied lockup is vertical/illegible at header scale; 15 Jul swap ruling flagged back per pushback duty |
| 17 | kairali.com 2 six-doors images | IMPLEMENT | Centres-card half real (no centre photography exists — creative lane); Healing-Village half challenged back (Ganesha gate provenance-verified KTAHV) |
| 18 | kairali.com 3 footer policies | IMPLEMENT | footer links landed, PR #222 |
| 19 | kairali.com 4 socials missing | REJECT | stale — git-proven pre-#204 review; refute-verified live |
| 20 | kairalicenters 1 contact details | MONITOR | WAITING-ON owner word (Q-KCENTERS-CONTACT) — email lock + interim-phone decision both in play |
| 21 | kairalicenters 2 socials missing | REJECT | stale — same #204 timing; refute-verified live |
| 22 | hospitality 1 VYSOCINA text | MONITOR | WAITING-ON Q-KH-KATERINA — live text, rides the one Katerina ruling |
| 23 | hospitality 2 Katerina not ours | MONITOR | WAITING-ON Q-KH-KATERINA — collides with owner-sourced locked facts + D-KH-JV-LABEL |
| 24 | hospitality 3 founders counts | MONITOR | WAITING-ON Q-KH-KATERINA — counters flip only with that ruling |
| 25 | hospitality 4 consultancy Czech | MONITOR | WAITING-ON Q-KH-KATERINA — sentence is an applied ruling surface |
| 26 | hospitality 5 footer Katerina | MONITOR | WAITING-ON Q-KH-KATERINA — strongest ownership-implying surface, relabel option in the question |
| 27 | hospitality 6 no sitemap | REJECT | sitemap.xml serves on preview AND legacy live; refuter exhausted every steelman |
| 28 | hospitality 7 socials missing | REJECT | stale — same #204 timing; refute-verified live |
| 29 | hospitality 8 no FAQ | MONITOR | WAITING-ON owner word (Q-KH-FAQ) — new feature on a frozen gate-passed one-pager |
| 30 | kairaliyoga 1 logo visibility | MONITOR | WAITING-ON owner word (Q-KY-LOGO) — perception has merit, nothing broken, frozen design |
| 31 | kairaliyoga 2 sitemap missing | REJECT | sitemap.xml serves on preview AND legacy live; refuter upheld |
| 32 | kairaliyoga 3 guru link | MONITOR | WAITING-ON owner word (Q-KY-GURU-LINK) — good add, timing gated on the guru price corrective |
| 33 | kairaliyoga 4 evening image crop | IMPLEMENT | portrait-frame fix landed, PR #224 (plus the latent Sunrise twin) |
| 34 | whatisayurveda 1 policies missing | IMPLEMENT | footer links landed, PR #222 |
| 35 | whatisayurveda 2 sitemap missing | MONITOR | WAITING-ON owner word (Q-SITEMAP-VISIBLE) — XML exists; her consistent meaning is a visible sitemap, gated as a fleet decision |

## 7. ASKS BACK TO ASTHA (ride the reply mail; drafts on request)

1. Exact simonandschuster.com URL for Harmony (only The Ayurvedic Cookbook is findable there;
   with a working URL the add is one line).
2. The Ganesha entrance photo: repo provenance says KTAHV's own gate — does she have first-hand
   knowledge it is a Centre location? (If yes, the library folder labels need her correction.)
3. Socials + sitemaps: socials shipped 5h after her review (all previews now render the 4 group
   profiles; Instagram off is the owner's ruling); sitemaps exist at /sitemap.xml on every site
   she flagged — if she meant a visible sitemap page/link, that is Q-SITEMAP-VISIBLE.
