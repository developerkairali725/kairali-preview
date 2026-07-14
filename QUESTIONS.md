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
