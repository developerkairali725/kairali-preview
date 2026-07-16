# QUESTIONS.md — append-only; unattended sessions log here and continue

## 2026-07-13 · Day-0 scaffold session (Claude Code)

1. **DE/FR clinical-lock word lists are SEEDS.** CLAUDE.md gives examples (Kur/Urlaub/Luxus; cure/vacances/luxe); I extrapolated a fuller list in `packages/compliance/src/rules.js`. Needs native + legal confirmation before the DE/FR gate is treated as authoritative. Note: FR "séjour" and "hôtes" may be legitimate in clinical contexts (séjour = hospital stay) — flagging may over-fire; review wanted.
2. **kairali.com mixed register.** The clinical lock applies only to KTAHV sections/links on kairali.com. v1 convention implemented: MDX frontmatter `entity: ktahv` overrides the site entity per page. Confirm this convention or specify another.
3. **packages/forms is BLOCKED** on the canonical CRM form schema + webhook endpoint + test-mode flag from Ambuj (START_HERE §3-B item 9). Charter and v1-freeze rules are documented in the package; no code until the schema arrives.
4. **Claims-jurisdiction matrix** (India DMR/ASCI · UK MHRA · US FDA/FTC · EU): v1 lint enforces only the universal no-cure-claims floor. Per-market regulated-phrase lists needed to gate the full matrix — who supplies these (legal counsel? Semrush competitor scans?)?
5. **START_HERE §3-E:** DE/FR slugs in `tests/ktahv-critical-flows.spec.ts` still need confirmation against the live sitemap (Abilash, 2 min).
6. **GitHub org/repo do not exist yet** (`kairali-digital/kairali-web-factory` → 404 on 13 Jul). Local repo is committed and remote is preconfigured; push blocked until Step 1 (accounts) is done and this machine gets GitHub credentials (`gh auth login` or a PAT). Vercel import also pending.
7. **"unique" and similar filler in code files:** technical usages ("unique key") would false-positive, so `.ts/.tsx/.js/.jsx` violations report as warnings, content files as errors. Confirm this severity split.
8. **Site scaffolds not created yet.** No `sites/<domain>` apps exist; Step 4 expects the already-built abhilashkr.com Next.js code to be dropped in — that code is not on this machine. Where does it live (Drive/other repo)?

## 2026-07-13 · Evening update (same session)
- Item 6 RESOLVED: repo live at github.com/AbhilashKairali/kairali-web-factory (private); Vercel project `kairali-web-factory-kairali-ai` deployed from sites/kairali.ai → https://kairali-web-factory-kairali-ai.vercel.app (chain proven per START_HERE Step 4 intent).
- NEW: GitHub org creation via automated browser was refused by GitHub ("You can't perform that action at this time") — Abilash creates the org manually at github.com/account/organizations/new?plan=free, then the repo gets transferred (Vercel's GitHub app will need org access re-granted after transfer).

## 2026-07-13 · M2 master-setup session (post-crash)
9. **Branch protection needs GitHub Pro or a public repo** (API returned 403 on this private free-plan repo). Options: (a) upgrade to Pro (~$4/mo, E5 payment — your call), (b) make repo public (not advised — client work), (c) rely on hooks + CI only for now. Dependabot alerts + security updates ARE enabled. Which option?
10. **E4 — first-tenant repo name.** gh repo list shows candidates: portfolio-website (likely abhilashkr.com), kairali-guru-website, voyagent, voyagent-pulse, voyagent-prototype, ayurvedic-treatment-packages. Confirm which is the abhilashkr.com personal site to import into sites/abhilashkr.
11. **pmset sudo batch (E1)** — run in Terminal when convenient:
    `sudo pmset -c sleep 0 disksleep 0 displaysleep 15; sudo pmset -a autorestart 1; pmset -g`
    `autorestart 1` = auto power-on after outage — the single best crash mitigation until the UPS arrives. Interim: caffeinate process runs while the machine is up.
12. **OAuth-gated MCPs pending an interactive session** (run /mcp in the repo to authenticate): Vercel, GitHub, Cloudflare. Sentry org + Clarity token + Semrush/Composio deferred (E2) — say when.
13. **Vercel deploy block RESOLVED**: commit author now uses the GitHub no-reply address. If you'd rather commits show director@kairali.com, verify that address on GitHub (Settings → Emails) and I'll switch git config.

## 2026-07-13 16:55:59 IST · Org + Vercel resolution
- Org kairali-digital created by Abilash (16:36:11 IST). Repo transferred in, then BACK to AbhilashKairali: Vercel Hobby cannot deploy private org-owned repos (paywall discovered 16:49 IST). Pipeline reconnected and verified green (deploy of dfd7887 completed, 16:55 IST).
- **DECISION PENDING (Abilash): Vercel Pro (~$20/user/mo).** Needed to (a) host the repo under the org and (b) be properly licensed — Hobby is non-commercial and this is a revenue fleet. When purchased: transfer repo to org + reconnect (5 min, documented here). Branch protection (Q9) also becomes worth revisiting then via GitHub Pro/Team.

## 2026-07-13 17:18:44 IST · First tenant + lint scope
- Q10 RESOLVED by Abilash: portfolio-website = abhilashkr.com. Imported to sites/abhilashkr (original repo untouched); builds green in turbo (2/2 tasks).
- SCOPE DECISION (ratify or veto, Abilash): entity "personal" is now EXEMPT from the Kairali banned-filler rule only — your portfolio's "Curated Speeches" isn't Kairali brand copy. Cure-claims + locked-facts checks still apply to it. Also: dot-directories (.agents etc.) excluded from lint scans, and the old repo's agent docs moved to docs/tenants/.

## 2026-07-13 17:53:12 IST · Wave 1 kickoff rulings (from Abilash)
- Personal-site exemption VETOED — banned filler applies to all sites incl. abhilashkr.com; copy fixed ("Curated" → "Selected").
- Language locks are ALL-LOCALE: every locale a site targets needs its own native-reviewed banned list before that locale ships (rules.js updated). Applies beyond DE/FR: AR, RU, CS, etc.
- KTAHV inputs exist OUTSIDE this repo: Abilash has the competitor comp set and extensive target-audience work (MOA Matrix v3.0, European Buyer Journey, competitor dossiers — PROJECT_CONTEXT §7) from previous Claude chats. ACTION (Abilash): export/drop these into the repo (suggest: docs/ktahv-inputs/ — any format) or share the Drive folder BEFORE any KTAHV or KTAHV-related work begins. Agent rule: no KTAHV surface gets built without ingesting these first.

## 2026-07-13 18:19:34 IST · Brand-manual ingest (Kairali rev. 2 + Villa Raag 2026) — values the PDFs do NOT give
Both 2026 manuals ingested from Drive (text layers: docs/brand/). All eight Kairali hexes in brand-tokens.css verified against rev. 2 — but the PDFs defer the 10-step ramps to "the design-system library", so these token TODOs remain and need the library export (or the exact hexes) from you/the design team:
14. **Kairali ramp steps + ink** — exact hexes for: **ink** (manual only gives "15.6:1 on ivory"), **forest-800** (named for dark surfaces, ch.08), **leaf-700** (body-capable leaf, ch.10), **bronze-600** (body-capable bronze, ch.10), **marigold-300** (descriptors/accents on dark, ch.08). None are printed in rev. 2.
15. **Villa Raag ramps** — Raag manual ch.04 says "digital ramps follow the group's ten-step method in the shared design system" but prints only the four anchors + Gold 600 (#8F6D49) + the gradient ends. Need the blush/tan/gold/forest ramp hexes (raag-tokens.css hover-deepen states depend on the forest ramp). Raag "ink" wordmark colourway shares the group's missing ink hex (Q14).
16. **Villa Raag web type scale** — ch.05 gives the hierarchy in print points only (overline Vonca 9–11 · body Miller 10–12 pt, leading 1.6 · caption 8–9 pt) and "tracked wide" without a tracking value. Confirm the px scale + letterspacing for villaraag.com, or confirm we derive from the group's component library when it ships.
17. **Logo/wordmark/emblem asset files** — neither manual ships vector assets, and both forbid recreating the marks. Need: Kairali lockups (full/wordmark/icon, light+dark) and Villa Raag wordmark (ink/gold/white, ± descriptor) + emblem + roundels as SVG. Where do these live in Drive?
    - **→ RESOLVED (2026-07-15):** agency sent the SVG pack ("svg logos 2" Drive folder); security-screened + committed to `image-library/brand-assets/svg/` (KAG, KTAHV, Products, Villa Raag lockups in colour+white, plus `icon_color.svg`/`icon_white.svg`). The Kairali icon mark now drives the header (crisp vector) + favicon (SVG primary + PNG fallback via `faviconIcons()`) on all four live sites. **Open sub-item:** a 180×180 `apple-icon.png` (iOS home-screen) still needs generating — blocked on a local SVG rasterizer (no rsvg/magick/inkscape/sharp on the Mac mini). Low priority; SVG favicon covers all desktop + Android browsers. Villa Raag site not built yet — its wordmark/emblem swap happens at that build.

## 2026-07-13 18:43:16 IST · Forms v1 verified
- packages/forms BUILT + LIVE-TESTED against Satyam's test webhook (success, rows 2-4 in test sheet). Ask Satyam: (a) PRODUCTION webhook URL when ready, (b) should payload carry an explicit consent field (DPDP evidence), (c) he can delete the 3 test rows.

## 2026-07-13 19:22:05 IST · Drive corpus sweep — two source docs missing
Corpus sweep landed 28 docs in docs/ktahv-inputs/ (incl. all 20 competitor dossiers). Two referenced sources could NOT be found in Drive and gate full fidelity of the MOA/KTAHV work:
- **European Buyer Journey (the 8-stage DACH/FR document, PROJECT_CONTEXT §7).** Only its condensed cohorts (DA1–DA3, FR1–FR3) and moments (M1 "90-second first impression" = Stage 4; M2 "pre-booking physician video consult" = Stage 5) survive inside Harmony_Content_Brief_Pack; KTAHV_B2B_Landscape cross-references it by name. Abilash: where does the full doc live (chat export? xlsx? another account)?
- **KTAHV_MOA_Matrix_v3_0.xlsx** — the workbook the MOA Review Handover names as must-attach (9 sheets, classifier code in Sheet 3, baseline in Sheet 7, open questions in Sheet 9). Only the handover DOC is in Drive. Abilash: export/drop the xlsx into Drive or docs/ktahv-inputs/.
Also reconfirmed: folders "KTAHV New Shoot 2025 HO centre" (1LlD59bSNYYcgddcVkYG5oPVFLtnA1xxk) and "Villa Raag- Images" (1WTBf-LIiA3YPnFYb5NWNeIm6l9WKf0_R) show metadata but list zero children to director@kairali.com — the sharing fix is still pending (matches the media-catalog pass).

## 2026-07-13 19:23:46 IST · Media catalog + guides follow-ups
- Two Drive folders show their name but their CONTENTS aren't shared with director@kairali.com: "KTAHV New Shoot 2025 HO centre" (owner mkt@ktahv.com) and "Villa Raag- Images" (owner ho.mkt@kairaliproducts.com). Ask both owners to share folder contents — these hold the photos for placeholder swaps.
- "Link secrets" resolved: it's "Healing Secrets of Kairali" — ingested (2 Jul version) with the Nakshatra guide + villa spec.
- Two data conflicts inside the Nakshatra materials need Abilash's ruling: (a) villa 212 — Classic (guide) vs Royal (inventory)? (b) Maharaja Suite names for 1001/1002 are swapped between the guide and the website archive — which is correct?

## 2026-07-13 19:38:12 IST · theblushlounge.com mining (D6) — outage + facts to confirm
- **theblushlounge.com origin is DOWN**: DNS resolves (A 64.227.129.189, DigitalOcean; www→apex) but ports 80/443/22 all filtered — live mine timed out; content mined from Wayback instead (latest homepage capture 2025-11-24, so it died within the last ~8 months). Abilash: revive the old droplet/hosting, or accept downtime until the Factory rebuild ships? (The snehachowdhary.com 301 flip is gated on the new site being LIVE either way — D1 rule 8.)
- **WhatsApp number conflict on the old site**: api.whatsapp links carry BOTH +91 88269 21110 (matches the contact-page phone) and +91 88260 21114. Which is Sneha's real number for the rebuild's chat-first CTA? (Priya's interim number is Kairali-only — wrong for a personal brand.)
- **Blush Lounge brand assets**: only a low-res logo.png + Allura/Montserrat type mined. Does Blush Lounge get its own token file (like raag-tokens.css) and is there any brand material / does Sneha have Instagram (@blushlounge_sneha) originals for portfolio imagery? Old gallery is 2018-era low-res.
- **Wave placement**: personal site isn't on the Wave map — when should sites/theblushlounge.com be built?

## 2026-07-13 19:44:30 IST · kairali.guru baseline evaluation — rulings needed
- **student-hub**: Eeshal's repo has a fake client-side login (hardcoded email+password committed to her PUBLIC repo). Drop the page for launch, or is a real student portal (auth, noindex) wanted in Wave 2/3?
- **Course prices**: her repo hardcodes prices (e.g. OAP ₹15,500 / $260 Kerala, ₹9,000 / $150 Delhi-Mumbai) that do NOT appear on the live site. Who confirms current programme pricing before the rebuild ships? (Rule 6: verify or leave empty + flag.)
- **Supabase**: her enquiry form writes to a Supabase project from the client. Plan is to replace with packages/forms → Satyam webhook; does anything in that Supabase table need exporting first?
- **Register-table correction**: SITE_DESIGN_LOCALE_REGISTER.md says kairali.guru live = EN/DE/FR/AR/RU, but the live site is EN-only (no hreflang, /de/ 404s) — the 5 locales exist only in Eeshal's repo. Amend the table via DECISIONS at next edit.

## 2026-07-13 19:50:28 IST · URGENT pair from the overnight synthesis
- **theblushlounge.com is DOWN** (DigitalOcean origin unreachable on all ports; was live Nov 2025). This is Sneha's live business site. Who manages that droplet — Sunaj or Ambuj? Restore or accelerate the rebuild; brief ready at docs/site-briefs/theblushlounge.md (content recovered via Wayback).
- **Security: Eeshal's PUBLIC repo (kairali-guru-) contains a hardcoded student-hub password.** Action: Eeshal rotates that credential immediately and makes the repo private (or removes the secret + history). Flag when she joins the org.

## 2026-07-14 11:56:19 IST · Wave-0 mechanization session (packages + gates + forward farm)
- **Brand-lint exemptions to ratify (or veto, like the banned-filler one):** site.config.json now carries `brand: "kairali" | "raag" | "none"`; abhilashkr (own personal design) and kairali.ai (internal placeholder) are set to `"none"` — exempt from token law only (compliance lint still applies). Related: should those two also join the factory-spec CI matrix in .github/workflows/factory-gate.yml (currently arogyakendra only)?
- **kairaliproduct.com (singular)** is in sweep_results.csv but NOT in Runbook §2D's forward list — does it join the products family in docs/redirects/forward-farm.csv?
- **raagcasa.com / raagvilla.com / theraagvilla.com** are named in Runbook §2D + D1 but absent from the 87-domain sweep — confirm we actually own them (rows are HELD until then).
- **ktahv.com already 301s correctly** (all 4 URL forms, single hop → https://ayurvedichealingvillage.com/, verified 14 Jul) — where is that redirect configured (already Cloudflare? registrar forward?)? Matters for consolidating everything into the one Bulk Redirects list without breaking a working redirect.
- **arogyashala.co.in flip is now BLOCKED, not just pending:** its D1 target arogyashala.in is DNS-dead (sweep dns_fail, re-verified 14 Jul) while arogyashala.co.in itself serves a live site — held per D1 rule 8. Sunaj's registrar/DNS fix is the gate.
- **whyayurveda.* interim target:** pointed at whatisayurveda.org (nearest LIVE topical parent per D1 rule 8) with a noted same-edit re-point to .com at Wave-2 cutover — ratify.
- **Consent banner vs Chatbase bubble:** on first visit at 375px the interim Priya bubble overlaps the banner's text edge (cosmetic; banner dismisses forever after one tap). Fix now or fold into the packages/ui "floating stack" idea from LEARNINGS #3?

## 2026-07-14 13:14:52 IST · Answered today by Abilash (in-chat) + still-open re-asks
- ANSWERED: villa 212 = Royal (guide wins) · guru student-hub = temp benchmark, redo; digital program = "coming soon" · guru sitemap = keep · Blush Lounge droplet = Sunaj (call in progress) · image-folder shares = Abilash clicking the links · Pinterest = component-level source, yes · Google Ads/GA4/GSC/Semrush = browser sessions available.
- STILL OPEN (re-ask, simply): (1) **Maharaja Suites** — rooms 1001 and 1002 have swapped names between the Nakshatra guide and the old website; which name belongs to which room? (2) exact name of the ChatGPT image model Abilash recommends ("Sol 5.6" as heard). 
- NEW: interim uptime monitor priority raised (Abilash "regular listening tool") — see BACKLOG; news/watch monitor for stack-relevant updates queued for Fleet Pulse phase.

## 2026-07-14 13:38:20 IST · Second batch answered (Abilash in-chat)
- ANSWERED: abhilashkr brand exemption ratified (Kairali-inspired allowed, not required) · raag ×3 + all sheet domains owned · kairaliproduct.com → products family · banner×bubble fix now · U1 provisional = TWO stores (.in India / .com international, compliance + gateways) — verify at kickoff.
- STILL OPEN: Maharaja Suites 1001/1002 names · where ktahv.com's existing 301 is configured · exact ChatGPT image-model name ("Sol 5.6" as heard) · shipping aggregator + couriers (runbook Part 4 blanks).
- NOTE: whatisayurveda.com is a PARKED lander (verified 14 Jul) — the "fresh Jun 2026" in the Runbook was the registration, not a site. Flip stays gated on the Wave-2 build; Abilash informed.

## 2026-07-14 15:05:00 IST · GitHub MCP — SKIPPED by design (not pending)
Remote GitHub MCP (api.githubcopilot.com) fails Claude Code OAuth: "incompatible auth server: does not support dynamic client registration" (GitHub-side limitation). Ruling with Abilash in-chat: SKIP — the authenticated gh CLI on this machine already covers 100% of the factory's GitHub needs (PRs, API, secrets, protection), proven across the whole 14 Jul session. Revisit only if a future agent lacks shell access. MCP roster for factory scope is now: playwright · vercel · cloudflare-docs · next-devtools · clarity (step 4) · semrush (step 5).

## 2026-07-14 15:35:00 IST · MCP sitting outcomes (steps 3-5 closed)
- GitHub MCP: SKIPPED (DCR incompatibility; gh CLI covers everything — see entry above).
- Clarity: clarity-ktahv CONNECTED + verified with real data (677 sessions/day, 4.14% dead-click on KTAHV). Three more projects exist (Villa Raag, whyayurVeda, Kairali Products.com) — same one-command pattern when needed; the whyayurVeda project implies tracked traffic on that family (relevant to Wave-2 whatisayurveda build).
- Semrush: Composio MCP CONNECTED ✔; Semrush API purchase DECLINED (Business-tier + units / Trends API ≈ ₹17k+/mo for data we don't need). Keyword lane per the checklist's own fallback: GSC (free, browser access granted 14 Jul) + DataForSEO pay-per-call (~$50 covers the sprint) — set up at Wave-1 start.

## 2026-07-14 16:10:08 IST · Domain sheet ingested — follow-ups
- Sunaj (one line): add two columns to the Domain List sheet — "Registered with (company)" + "Login email" — that's the part the Cloudflare move needs.
- Abilash rulings: (a) kairaliproduct.com is a LIVE Shopify property per the sheet (not a parked variant) — what's its future (kept as-is / folded into .in)? Redirect HELD. (b) The sheet note says all domains "forward into one" main domain — D1 (semantic map) stands unless you re-rule; confirm the sheet note is outdated. (c) kairalipharma.com is in our sweep but absent from the sheet — do we still own it?
- RENEWALS within ~10 weeks (needs registrar access): snehachowdhary 01-Sep · kairalicenters.com 03-Sep (LIVE main site) · kairbykairali 23-Sep · whatisayurveda.org 28-Sep (live, ranking) · ayurvedafranchise 01-Oct · theblushlounge 28-Oct.

## 2026-07-14 16:35:00 IST · Sunaj server-audit reply processed
- VERIFIED: blush lounge RESTORED (200) · arogyashala.in DNS back (GoDaddy parking; forward stays HELD until real content) · Linux box = DigitalOcean droplet managed by RedHoney (ktahv.redhoney.in) — the "Linux vs DigitalOcean" confusion is resolved, they're the same machine.
- SECURITY (for Sunaj, prepare-only list in docs/infra/SERVER_AUDIT_2026-07-14.md): RDP+SSH are internet-exposed → allowlist/VPN hardening recommended; the two WhatsApp-shared credentials should be stored-to-env then ROTATED; backup destination + restore-test evidence still needed.
- UNLOCK: Cloudflare admin access granted to director@ — bulk-redirect upload (39 rules ready) is now an Abilash dashboard action; also enables GSC domain-property DNS verification.

## 2026-07-14 18:27:00 IST — kairali.com agency-build intake (docs/group-inputs/kairali-com-agency-build-intake.md)
- **Q-KC1 (Abilash):** Is the agency's Hostinger build meant to GO LIVE as kairali.com, or is it reference input for the Factory rebuild? Working assumption: reference input only. If it's going live, §4 of the intake doc is the blocker list (banned words in KTAHV sections, chronic-disease claim, GTranslate, unverified phone).
- **Q-KC2 (Abilash):** Canonical founding year — logo says "since 1908", agency footer says "© 1956-2026". Which is true? (Locked-fact candidate.)
- **Q-KC3 (Abilash):** Is +91 9555156156 a real, current group contact number (Delhi office?)? If yes it becomes a locked fact for kairali.com; if not it must not ship.
- **Q-KC4 (Abilash):** Which external agency built it (name/contact), so register fixes can be delegated via the protocol if their build proceeds?
- **Q-KC5 (Abilash/Ritu):** github.com/Eeshal27/kairali.com is PUBLIC with paid plugin bundles (Elementor Pro, Slider Rev, ACF Pro, Ohio) — recommend making it private (licensing + CVE surface). Add to the existing Eeshal repo-privacy delegation.

## 2026-07-14 18:27:00 IST — kairalitea.com pre-build escalations (docs/kappl-inputs/kairalitea-niche-brief.md §5)
- **Q-TEA1 (Abilash/legal):** FSSAI naming exposure — herbal infusions without Camellia sinensis may not legally be sold as "tea" in India; the DOMAIN ITSELF is kairalitea.com. Need ruling on SKU naming ("herbal infusion" vs "tea") before copy is finalized. Build proceeds with compliant copy ("herbal infusion" for tea-less SKUs) pending ruling.
- **Q-TEA2 (Abilash):** Sign-off requested on the claims-guardrails section of the niche brief as BINDING copy law for kairalitea.com (safe vs banned phrasings, India DMR/FSSAI/ASCI + US FDA/FTC + EU). Build proceeds under it as law until amended.

## 2026-07-14 18:40:00 IST — kairalitea.com BLOCKED by catalog reality (build-order pivot)
- **Q-TEA3 (Abilash + Vikash):** The live Shopify store (kairaliproducts.com, 157 products) has exactly ONE tea SKU — "Ayurvedic Herbal Infusion - Herbal Tea for Immunity & Vitality", ₹20, OUT OF STOCK. Taahira Ayurvedic Herbal Tea (photographed, 8 library images) is listed on NEITHER website. kairalitea.com cannot assist add-to-carts against this. Ruling needed: which tea SKUs will exist (Taahira launch? restock? price points?) before the site ships. Research brief is banked and ready (docs/kappl-inputs/kairalitea-niche-brief.md).
- **Q-TEA4 (Monday catalog lint / Vikash):** the one live tea SKU's TITLE carries "for Immunity & Vitality" — a benefit claim inside a food product title (FSSAI claims exposure, brief §5.B). Flag for the catalog-compliance pass; do not reproduce the title verbatim on any Factory surface.

## 2026-07-14 19:55:00 IST — closures + new (Abilash night batch)
- Q-KC1 ANSWERED: reference only. Q-KC2 ANSWERED: 1908. Q-KC3 ANSWERED: IVR number, real. "Slaget" ANSWERED: transcription artifact, nobody. Free-consultation ANSWERED: real config.
- **Q-TEA5 (Abilash/Vikash, NEW):** "Yuvan tea" is not on either Shopify store's public catalog — what is its exact listing name/URL (or does it sell on another channel: Amazon/offline)? Needed before kairalitea.com merchandises it.
- **Q-TEA6 (Vikash, NEW — catalog-compliance flag):** Aarogya Herbal Infusion on .com shows ₹20 available=true (vs ₹618 on .in) — looks like a placeholder price on a LIVE purchasable listing. Route per rule (l)/(m); do not auto-fix.
- Q-KC4 (which agency built the Hostinger site) — still open, low priority now (reference-only).

## 2026-07-14 21:35:00 IST — rate-list questions (from the 6-PDF ingestion FLAGS; full list in RATES_RECKONER FLAGS)
- **Q-RATE1 (Abilash/reservations):** Yoga 26-27 USD Grid 1, SUITE double occupancy shows **$927** in a bold cell — anomaly vs surrounding grid; confirm the true rate.
- **Q-RATE2 (Abilash):** filenames say "Sanskrit" (Yoga KTAHV … Sanskit V4) but NO Sanskrit course table exists in any of the 3 yoga PDFs — is a Sanskrit price list missing, or is the filename stale?
- **Q-RATE3 (Abilash):** KTAHV 25-26 lists carry an 18-month validity (w.e.f Apr 1 2025 → Sep 30 2026) though titled "2025-26" — intended overlap with the 26-27 yoga cycle?
- **Q-RATE4 (rides the Anupam thread):** banned words (luxury, spa, journey, guests) appear inside ALL SIX price PDFs themselves — marketing collateral fix, same delegation lane as the website wording.

## 2026-07-14 23:10:00 IST — kairalicenters.com mining findings (docs/group-inputs/kairalicenters-org-inventory.md)
- **Q-KC-SEC (URGENT, Abilash + Sunaj):** kairalicenters.com live WordPress is COMPROMISED — every page injects a hidden zero-width `<marquee>` link-farm with 3 gambling/casino spam links (Italian AAMS, Mexican/US casinos → flowerhome.com.tw, budsandbrewsusa.com, veracruzalterno.com.mx). Classic hacked-WP SEO-spam. Needs security remediation of the LIVE site now (scan, clean, re-secure, change creds). Links NOT visited (quarantined per rule r). Delegation drafted + bulk-sheet row added.
- **Q-KC-ROSTER (Abilash):** register says "18 centres, 9 countries" but the LIVE /locations/ page lists **14 centres, 5 countries** (India ×8, Japan ×3, Mauritius, Czech, Kuwait). Which is canonical? Rebuild will NOT print "18/9" until confirmed (rule 6). If 4 centres are missing from live, send their real NAP.
- **Q-KC-DOMAIN (Abilash):** centre emails use **kairalicentres.com** (British spelling) but the site domain is **kairalicenters.com** (American). Which is canonical for the rebuild + email?
- **Q-KC-PARTNERS (Abilash):** 6 centres appear partner/franchise-branded (Patna=Surya Healthcare + a gmail; Vadodara=M/s RETROFIT; Japan ×3=ayus.co.jp; Mauritius=kairali.mu; Czech=Katerina Resort; Kuwait=hotmail). Are these owned or franchise partners? Affects how they're presented + which get full pages.
- **Q-KC-DATA (Abilash): Raipur** hours missing · **Czech** domain typo (katrinaresort.com vs katerinaresort.cz) · **founding year** 1908 (logo) vs 1989 (if the centres line claims it) — confirm.

## 2026-07-14 (late) — kairalifranchise.com pre-build: BLOCKED on money + domain (Abilash)
Mining done (docs/group-inputs/kairalifranchise-*), security scan CLEAN (no injection). But the site's CORE — the franchise investment offer — cannot be built truthfully without your input. Per rule 6 nothing is invented.
- **Q-FR-MONEY (decision, Abilash):** The upfront INVESTMENT / franchise fee / technical-service fee / ROI are NOT stated on any Kairali surface (third-party portals float an unconfirmed ₹10–15 lakh that contradicts our own numbers). TWO paths — your call: (a) I gate ALL financial specifics behind the enquiry form ("investment breakdown shared with qualified applicants" — standard, best-converting, needs no figures from you); OR (b) you give me the exact current figures in writing and I publish them. I recommend (a) now, (b) later. The /investment page is blocked until you pick.
- **Q-FR-ROYALTY (Abilash):** Live site prints royalty Rs 25,000 + 5% (domestic) / USD 1,000 + 7% (international), 1,500/2,100 sq ft area, ~90-day setup, 10–15 km territory. Publish these as-is on the rebuild, or are they stale? (I will NOT publish specific financial terms without your confirm.)
- **Q-FR-DOMAIN (decision, Abilash — ties to register Decision #4):** kairalifranchise.com currently 301s to ayurvedafranchise.com. Which is canonical for the rebuild — build under kairalifranchise.com, ayurvedafranchise.com, or one 301s to the other?
- **Q-FR-CONTACT (Abilash):** franchise enquiries — use the locked info@kairali.com, or a dedicated franchise@kairali.com (seen on the live site)?
- **Q-FR-SCALE (Abilash):** conflicting centre/country counts across sources (35 / 25 / ~13 / "6+19") — same root issue as Q-KC-ROSTER. What is the canonical "X centres in Y countries" for ALL sites? (One authoritative number unblocks kairali.com, kairalicenters, and franchise at once.)
- Founding year RESOLVED: 1908 (locked fact + your confirm), despite live-site 1989/1948 noise.

## 2026-07-15 00:15:00 IST — kairaliequipment.com pre-build: BLOCKED (no catalog data) + security
- **Q-EQ-CATALOG (Abilash/Deepu):** the legacy kairaliequipment.com product gallery is DB-driven and EMPTY in every live + Wayback capture. Only 5 category names survive (Pathi, Shirodhara Stand, Steam Box, Urlis, Accessories) + 3 accessory names — ZERO recoverable SKUs, models, dimensions, prices, or product photos. Cannot build a real equipment catalog without the source product data. Need: the actual product list (names/specs/photos), or a decision to ship category-level pages only for now.
- **Q-EQ-SECURITY (Deepu/Sunaj):** kairaliequipment.com live homepage + Category.aspx return HTTP 500 (site is BROKEN) with customErrors=Off — the error pages LEAK full server file paths (information disclosure). Two issues: the site is down, and it's exposing internals. Route to whoever manages that server (ASP.NET/IIS, not the WP stack).
- **Q-EQ-CLAIMS (Abilash):** cert / export capability / own-manufacturing / heritage-year / phone are asserted about the equipment business but not captured — confirm before publishing any.

## 2026-07-15 00:15:00 IST — PATTERN: the legacy-site rebuild queue is now DATA-BLOCKED on Abilash
Three consecutive non-revenue sites mined tonight are each blocked on missing SOURCE data the legacy sites don't contain:
- kairalicenters.com → built (14 verified centres) BUT live site is HACKED (gambling injection).
- kairalifranchise.com → blocked: investment figures absent everywhere; canonical domain undecided.
- kairaliequipment.com → blocked: product catalog DB is empty; live site is 500/broken + leaking paths.
The mining discipline is doing its job (no fabrication), but the remaining non-revenue rebuilds need Abilash to SUPPLY real source data (product lists, franchise terms, canonical roster) — they can't be mined from broken/empty/hacked legacy sites. Consolidated ask surfaced to Abilash; further speculative mining paused until he provides data or picks targets.

## 2026-07-15 12:45:00 IST — POSITIONING_AND_MOA.md questions (from the archive strategy-docs synthesis)
The strategy source-of-truth (docs/strategy/POSITIONING_AND_MOA.md, distilled from your real MOA Matrix v3, Villa Raag buyer journey, competitor audits, GEO KB) raises 5 Abilash questions — full text in its §6. Load-bearing ones:
- **Q-POS-MCB:** "MCB" is NOT defined anywhere in the competitor audits — it only appears as an informal label. Confirm what MCB stands for (Pavan is sending Akshar Yadav's teachings this week — likely the source). Not invented.
- **Q-POS-RATIFY (register amendments — need your sign-off before applied):** the synthesis proposes 5 build changes (Villa Raag = wellness-not-medicine compliance rewrite; whatisayurveda = "WebMD/Mayo of Ayurveda" spec; GERMAN as priority 2nd locale on reference/tourism sites; KTAHV audience +M3 NRI +M6 GCC; hard reference-vs-commerce boundary) + add WhyAyurveda to the register. These change site briefs → ratify per site before build (register-table amendments go via DECISIONS with your sign-off).
- MOA data caveat: figures rest on a 58-booking sample (workbook ~80% complete) — directional, not precise.

## 2026-07-15 14:05:00 IST — kairali.com mining results: new facts needing Abilash
- **Q-KC-AHV-YEAR:** agency draft contradicts itself — AHV established **1997** (/partnerships-and-investment/) vs **1999** (/ayurvedic-healing-village/ + /our-partner-resorts/). Which year is true?
- **Q-KC-ROSTER (now 4 variants!):** register 18/9 · live centres site 14/5 · agency draft "24 centres" + a /locations/ list including **Hyderabad ×2** (absent from the live centres site!) · franchise sources 35/25/13. One canonical roster please — it now touches kairali.com, kairalicenters, franchise AND the agency content reuse.
- **Q-KC-PDFS:** the agency Hostinger site's download-centre holds price lists + Villa Raag tariffs — HARVEST before that staging site is torn down (queued as a machine task; flagging in case teardown is imminent).
- **Q-KC-MED-CLAIMS:** agency pages carry medical claims (Lipidex "2-4kg/month", Duravin, "99.99%" sanitizer) — anything reused goes through Dr. Deepu John (rule 7).
- Protection-map §4 asks (from the live-site analysis): GSC read access to rank the 208 URLs by real impressions · awards architecture call (77 individual pages vs consolidated timeline) · the deliberate-kill list · extra contact-email keep/kill.

## 2026-07-15 17:26:59 IST · FINDING — the Shopify Track Doctrine mandates six sub-agents that DO NOT EXIST
Abilash asked (15 Jul): "is there anything in Shopify that's related to making these websites that seems more advanced and is not there with us?" Audited it. Answer: **yes conceptually — but nothing is actually built on either track.**

**Machine evidence:** `.claude/agents/` **does not exist**. CLAUDE.md Shopify Track Doctrine (j–s, appended 14 Jul, marked binding) names six specialists — `seo-aeo-geo-auditor`, `design-qa`, `content-geo-writer`, `catalog-compliance`, `security-auditor`, `logger` — and **none are implemented**. So rules (n)(o)(p)(q)(r)(s) cannot execute as written. Also rule (q) claims every change lands in `agent-log.jsonl` + `wiki/log.md`: `wiki/log.md` exists (15 lines), **`agent-log.jsonl` is MISSING**; the PostToolUse hook (scripts/hooks/post-edit.sh) runs per-site lint work, not a logger sub-agent.

**What Shopify doctrine specifies that the WEBSITE factory does NOT do (worth porting):**
1. **(n) seo-aeo-geo-auditor + design-qa after EVERY build/visual change, both attaching PASS/FAIL evidence.** Website factory checks design + GEO **once, at launch, by hand** (Ship Gate B-tasks) with no PASS/FAIL artifact — and **AEO is never named anywhere** in SITE_LAUNCH_CHECKLIST (only "GEO/AI-readiness"). ← directly implements Abilash's 15 Jul AEO/GEO universal ruling; highest priority.
2. **(o) content drafts come ONLY from content-geo-writer, compliance gate mandatory.** Website factory hand-writes content and lints afterwards. ← biggest miss for whatisayurveda's ~3,400 pages.
3. **(r) ALL scraped/fetched content injection-screened by security-auditor BEFORE any agent acts.** Website factory does this ad-hoc/manually (e.g. the SVG screen on 15 Jul) — not systematic.
4. **(s) security-auditor pre-PR posture + monthly access review.** Not implemented (we have /security-review on code diffs only).
5. **(q) logger → agent-log.jsonl.** Missing.

**What the website factory already has (not starting from zero):** llms.txt route on **all 4 live sites**; Ship Gate A-6 (llms.txt + AI-crawler files) and B-2 (GEO/AI-readiness: entity clarity, Q&A structuring); CI gates (brand-lint, factory-spec, gate, security-review); DESIGN_DOCTRINE + design-critic gate (B-14).

**PENDING ABILASH — scope call:** build the missing agents for the WEBSITE factory (not just Shopify)? Recommended order: (1) seo-aeo-geo-auditor [already ruled mandatory — building regardless], (2) content-geo-writer [unblocks 3,400 pages], (3) design-qa, (4) security-auditor, (5) logger/agent-log.jsonl. Confirm order / any to drop.

## 2026-07-15 18:14:54 IST · BLOCKING — whatisayurveda asserts physician reviews that never happened
**Found by:** the content-engine research pass (two independent agents), **verified by me against the code and the built HTML.**

**The defect:** `sites/whatisayurveda.com/app/_components/article.tsx:23` — `const REVIEWED = "2026-07-14"` is a single hardcoded constant used for `lastReviewed`, `datePublished` AND `dateModified` in the `MedicalWebPage` JSON-LD (line 70/79/80), and rendered in the byline (line 123-124) next to **"Medically reviewed by Dr. Deepu John (BAMS)"**. Proof from the build: `/panchakarma` and `/herbs` both emit `lastReviewed":"2026-07-14"`. **Every page therefore asserts a named BAMS physician reviewed it on a date on which no such review occurred** — in machine-readable structured data, on a YMYL health site, under a real person's professional credential. Any page added later inherits the same false July date.

**Not yet live** (no DNS flip) — caught before publication.

**My own miss:** PR #61 (merged) made the reviewer NAME configurable for exactly these integrity reasons and left the DATE hardcoded. I had this file open and fixed half the problem.

**Structural fix (clear, doing it):** `reviewedOn` becomes REQUIRED per-page data, settable only on genuine sign-off; a page with no real review must NOT render a reviewer byline and must NOT emit `lastReviewed`/`reviewer`. Absence of a claim is honest; a false claim is not. Lint gate: reviewer byline present ⟺ `reviewedOn` present.

**DECISIONS NEEDED (Abilash + Dr. Deepu John — medical/professional boundary, CLAUDE.md rule 7):**
1. The existing ~20-30 pages: (a) strip the review claim until Dr. Deepu John genuinely reviews them, (b) he reviews them now and we record the true dates, or (c) re-label as "written by the Kairali editorial team" with no physician assertion? **Recommend (a) now + (b) as he has time** — no page claims a review it didn't get.
2. **The ~3,400-page promise is arithmetically false.** No single physician can genuinely review 3,400 pages, and a nominal review under a named credential is WORSE than no claim. Research recommends capping genuinely-reviewed pages (e.g. condition pages 15-25) and letting the herb cluster carry the traffic with a different, TRUE trust label. This changes the site's core promise — needs Abilash's ruling before the content engine is built.

**Related (minor, found same pass):** `packages/schema/src/index.js:164` emits `about: MedicalCondition` from a `condition` param `article.tsx` never passes — built and unused. And Mount Sinai's About Herbs library is dead (301→/care as of 15 Jul) — drop from the comp set.

## 2026-07-15 18:40:54 IST · Physician roster mined from the LIVE sites — 5 verified, 7 gaps need a human
Evidence + verbatim credential lines: `docs/group-inputs/kairali-physician-roster.md`. Every doctor corroborated on TWO independent sources (KTAHV roster + whyayurveda profile/author schema). Injection screen clean. **All five are BAMS only — no MD/MS/PhD is published anywhere, so none may ever be written into our roster.**

**On the panel now (usable):** Dr. Deepu John (Chief Physician **& Head of Department** — our string was TRUNCATED, now corrected) · Dr. Akhila Oommen · Dr. Rahul R.

**Verified but NOT usable — need Abilash/HR:**
1. **Dr. Ashika vs Ashikha Raj** — both spellings are live and *contradict each other inside one Yoast schema block*. We will not guess a doctor's name. Which is correct?
2. **Dr. Anagha's SURNAME is not published anywhere** — no profile, no author account. Cannot be credited until we have it.

**Other gaps:**
3. **No medical-council REGISTRATION NUMBERS for any physician.** This is the single biggest YMYL credibility gap — the first thing a Google quality rater or a regulator asks for on health content. Collect from HR **before** launch, not after.
4. **No head-office doctor exists on either site** — this contradicts Abilash's stated process ("doctors in the head office or at the Healing Village"). Are head-office doctors simply unpublished, or does the premise need revisiting? Affects who can approve content.
5. **"Dr. Priya Devi"** appears only in a guest testimonial thanking her for personal guidance — unrostered, uncredentialed. Current/former physician?
6. **"Helped draft the NABH Panchakarma Clinic Standards"** (Dr. Deepu John) — appears once, uncited. High-value if true, a liability if not. Not reused until confirmed.
7. **Gita Ramesh is Co-Founder & Joint Managing Director** — always "Mrs.", NEVER "Dr.", with **no published medical credential**. Two consequences: (a) she must NEVER be a YMYL medical reviewer — editorial voice is not clinical sign-off; (b) our /about UNDERSTATES her as "a long-standing author and educator" when she co-founded the group. "Editorial Voice" is our own label, not published anywhere — Abilash confirms she knows and accepts it.
8. **Founding year is live in FOUR conflicting forms across Kairali's own sites: 1908 / 1989 / "115+ years" / "25 years".** Our locked fact is 1908. The group's own sites contradict themselves publicly.
9. KTAHV DE/FR locales not mined (robots.txt confirms they exist) — the all-locale rule applies.

**Design correction accepted (agent pushback, and it is right):** whyayurveda credits doctors by making the doctor the POST AUTHOR (byline + rel=author + Article.author schema). Do NOT mirror that — it asserts the physician WROTE the page. Abilash's actual model is *approval*, not authorship. We keep distinct `author` + `reviewedBy` fields with a visible "Medically reviewed by Dr. X, BAMS on <date>".

## 2026-07-15 20:06:54 IST · CORRECTION — I was WRONG: the six Shopify sub-agents DO exist
Earlier today I reported to Abilash that the six sub-agents named in CLAUDE.md (n)–(s) "do not exist — doctrine on paper". **That was factually wrong, and I reported it as a finding.** The pipeline's inventory agent caught it and pushed back rather than inheriting my error.

**The truth:** all six exist as well-formed agent files in `shopify-agents/` (authored 14 Jul, 1.9–5.4 KB each, valid frontmatter with name/description/tools/model). They were never *discoverable* because `.claude/agents/` — the folder Claude Code loads from — did not exist. `M2_SHOPIFY_SETUP_PROMPT.md` line 56 says verbatim: *"Copy the SIX files from shopify-agents/ into this repo's .claude/agents/"*. **The copy step was simply never executed.** A month of "binding doctrine" was one `cp` away from running.

**My error mode:** I checked `.claude/agents/`, found it absent, and concluded the agents were never built — without grepping the repo for the filenames. A confident conclusion from a partial check: exactly the failure this whole day has been about. **Lesson: absence in the expected location is not evidence of absence.**

**FIXED:** the six are now installed in `.claude/agents/` (catalog-compliance, content-geo-writer, design-qa, logger, security-auditor, seo-aeo-geo-auditor). They are now discoverable. NOT yet verified as *working* — that is the next step, and rule (q) remains FALSE as written (`post-edit.sh` runs a compliance lint, never a logger; `agent-log.jsonl` does not exist).

## 2026-07-15 20:06:54 IST · FIXED — the anti-fabrication test never ran in CI (2nd dead-on-arrival test)
CI ran `node --test packages/*/test/*.test.js`. `sites/whatisayurveda.com/test/medical-review.test.js` — the ONLY test guarding the gate that stops us asserting a physician review that never happened — sat outside that glob and **never executed**. Second instance of this exact class (after `tests/ktahv-critical-flows.spec.ts`). **A test that does not run is not a gate; it is a comment.**
**Fixed:** the step now DISCOVERS tests via `find packages sites -path '*/test/*.test.js'` and fails loudly if discovery returns nothing. Verified under bash (as Actions runs it): 11 files discovered (was 10), **76 tests pass**. My local zsh run silently ran zero tests — zsh does not word-split unquoted vars — which is itself a reminder to verify in the target shell.

## 2026-07-15 20:12:57 IST · THE PIPELINE FAILED ITS OWN AUDIT — and for the right reason
GPT-5 judged `docs/process/MASTER_PIPELINE.md` as an end result for Abilash. **Verdict: FAIL. Quality: weak.**
**Verbatim finding:** *"It promises un-skippable, machine-evidenced gates but delivers a prose spec with most machines unbuilt — the exact class of failure the document condemns."*
**It is right.** This afternoon I reported that the Shopify doctrine's sin was declaring rules binding whose enforcement was never built. I then wrote 2,181 lines committing the same sin. The doc's own scorecard: **"Score today: 1 of 9 mechanized."** Approving it changes NOTHING tomorrow.
**Blocking:** (1) **no minimal runnable core** — `matrix-walk.mjs` doesn't exist; most G3/G9 gates are NOT BUILT; (2) `resolveReview()` protects **whatisayurveda only** — no repo-wide gate; (3) the **compliance research agent DIED** on an API error and the pipeline was finalised without it — in a YMYL domain.
**RECOMMENDATION FOR THE MORNING — do NOT ratify the 2,181-line spec.** Approve a **minimal core** instead: build the 3–4 gates that actually run (wire the two proven auditors into CI; generalise the anti-fabrication gate repo-wide; the S3 keyword-plausibility check), prove they catch our real failures, and let the spec follow the machines rather than lead them. Re-run the compliance research before any YMYL ratification.

## 2026-07-16 12:40:40 IST · FOR THE NATIVE-SPEAKER / LEGAL REVIEW — French "cure" is caught by the WRONG rule
Found while rebuilding the DE/FR clinical lock (both auditors failed the old lists; see DECISIONS).
**The conflict:** the CLINICAL LOCK (a tax-register rule, KTAHV-only) correctly no longer bans French `cure` — "cure de sevrage" is a legitimate course of treatment, a false friend of English "cure". But the **CURE-CLAIMS rule** (a medical-claims rule, ALL entities, all languages — India's DMR Act floor) still fires on it. So legitimate French clinical text is blocked by a rule aimed at English efficacy promises.
**Not fixed unilaterally, deliberately.** Two rules, two reasons, two reviewers: the clinical lock defends a GST classification; cure-claims defends against regulated medical claims. Weakening the DMR floor to unblock French would be exactly the "never weaken a gate" failure — the fix has to come from someone who can say what French efficacy language actually looks like.
**FOR THE REVIEWER:** (1) what French wording constitutes a prohibited efficacy claim, vs a legitimate clinical "cure de …"? (2) Should cure-claims become locale-aware (phrase-level rather than token-level)? (3) Same question for German "heilen"/"Heilung". Until then French clinical copy mentioning "cure" will be blocked and must be reworded.

## 2026-07-16 13:20:00 IST · FIXED (mechanism) + FOR ABILASH (wording) — rule (q) logger enforcement
Rule (q) ("the logger sub-agent is invoked by the PostToolUse hook — every change lands in agent-log.jsonl + wiki/log.md") was FALSE two ways: agent-log.jsonl did not exist, and the mechanism as written is impossible — a shell hook cannot invoke a Claude sub-agent.
**FIXED (mechanism):** post-edit.sh now appends a deterministic JSON audit line to agent-log.jsonl on every Edit/Write/MultiEdit (the hook writes it directly), preserving the compliance-lint exit-2 gate. Pinned by scripts/test/post-edit-hook.test.js (runs in factory-gate.yml). agent-log.jsonl is git-ignored (per-edit commits would be a merge-conflict magnet across concurrent writers); wiki/log.md remains the committed spine, written by the logger sub-agent for curated rollups. Verified: 125/125 scripts/test green, exit-2 reproduced with a real KTAHV banned-word violation.
**FOR ABILASH (CLAUDE.md is amend-by-you-only):** rule (q)'s wording still says "the logger sub-agent is invoked by the PostToolUse hook", which describes an impossible mechanism. Suggested amendment: *"every Edit/Write lands in agent-log.jsonl via the PostToolUse hook (deterministic); the logger sub-agent writes curated rollups to wiki/log.md."* Two-layer split, same intent, now true. Ack to update the rule text?

## 2026-07-16 13:08:00 IST · RECONCILIATION — the repo was tracking PHANTOM open items; the mailbox says they're done
Resuming the sprint, I synced to origin/main and cross-checked the "open" people-items against the director@kairali.com mailbox (Gmail MCP). The durable logs (BACKLOG/morning brief) had drifted badly from reality because **email replies were never logged back into the repo** — the sprint agent tracked only what it wrote in-repo, so answered work kept showing as "STALE, chase today".

**Verified against real sent/received threads:**
- **kairalicenters.com hack — FIXED 15 Jul 12:33.** Sunaj: *"We removed the hidden spam/casino links from all pages, including the database, and cleaned the website. We also changed all relevant passwords (WordPress, cPanel, database, and FTP/SFTP)."* Reported 14 Jul 18:46 → remediated in <18h. BACKLOG/brief still flagged it URGENT with a "drafted email to send" — that email was already sent AND answered.
- **Eeshal public-repo credential — FIXED 15 Jul 09:13.** Ritu: *"This is completed by Eeshal."*
- **Satyam forms/webhook — RESOLVED 14 Jul.** His reply drove the store-first decision (#55). Nothing to chase.
- **The "drafted Sunaj email" / bulk-sheet-row-7 never existed as a Gmail draft** — the delegation emails were sent as real emails from director@, not left as unsent drafts. delegation-log.md status column ("DRAFTED"/"IN BULK SHEET row 7 + email") did not match Gmail; treat delegation-log as intent, not proof.

**Still genuinely open (verified):** Vikash (GA4/GTM/Ads/GSC/Bing handover — no ask thread, no reply; the real gap) · Deepu (4 WP tech tasks, asked 14 Jul, 2 days, no reply) · Ambuj (Storefront token, but he's in active daily contact) · whatisayurveda.org renewal (Sunaj, asked 14 Jul).

**SYSTEMIC — the root cause, for a ruling:** the sprint has no mechanism to fold mailbox replies back into the repo, so every delegated item silently rots into a false "stale" state. Options: (a) a scheduled reconcile step (read director@ threads for delegated subjects, auto-update BACKLOG/delegation-log status) before each morning brief; (b) keep it manual but make the brief say "as-sent, reply unverified" instead of "stale, chase". Recommend (a). Until then, NO "you're 3 days late" chaser should be sent without a mailbox check first — three of today's five would have wrongly scolded people who already delivered.

## 2026-07-16 14:00:44 IST · RESOLVED — the two whatisayurveda review rulings (15 Jul 18:14 BLOCKING item)
Abilash ruled in-session, 16 Jul: **(1) strip now** — option (a), no page claims a review it didn't get; genuine reviews re-badge with true dates as Dr. Deepu John has time. Machine state verified: zero pages carry `reviewedOn`, so the strip was already in force via PR #64's resolveReview law — now it is policy. **(2) promise capped** — only genuinely-reviewed pages (~15-25 key condition pages) carry the physician badge; the herb cluster and the rest carry an honest editorial trust label. Site-wide review promises are prohibited. Recorded as D-REVIEW-1 / D-REVIEW-2 in DECISIONS.md. **The content engine is UNBLOCKED.** Also ruled: rule (q) wording amendment approved (D-RULE-Q, CLAUDE.md v1.5).
