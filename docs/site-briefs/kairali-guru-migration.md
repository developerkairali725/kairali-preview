# kairali.guru — Baseline Evaluation: Eeshal's rebuild vs the live site

**2026-07-13 19:42:57 IST · per DECISIONS 2026-07-13 18:28:44 (evaluate intern repo as baseline, migrate into monorepo) and 18:51:36 (blend live design + Eeshal's design, improve both — neither is the ceiling). Evaluation only — no code copied into sites/ (Wave 2 work).**

**Sources examined:** shallow clone of github.com/Eeshal27/kairali-guru- (last commit 2026-07-13 18:08 IST — she is actively committing) at scratchpad/guru-eval; live fetches of https://www.kairali.guru/ (200), /intensive-ayurveda-training-program.aspx (200), /contact-us.aspx (404), /de/ (404), /robots.txt (404 — none), /sitemap.xml (404 — none). Live copies in session scratchpad; a full `scripts/mine.py kairali.guru` pass into content-mined/ is the first Wave-2 step (durable raw layer before anything is replaced).

---

## 1 · Intern repo: stack, structure, quality

**Stack (package.json):** Next.js **16.2.10** (App Router) · React **19.2.4** · **next-intl 4.13** · Tailwind **4** (PostCSS) · TypeScript 5 · react-hook-form 7 + zod 4 · @supabase/supabase-js 2 (enquiry storage) · schema-dts · motion 12 · Phosphor icons · react-compiler babel plugin. Uses **npm** (package-lock.json), not pnpm. No test framework, no Playwright, no CI config.

**Structure:** `src/app/[locale]/…` with 18 route groups: about, courses (+[slug] — 5 course pages, generateStaticParams), learn (+[slug]), locations (+delhi, +kerala), kerala, panchakarma, gallery, testimonials, faq, enquiry, travel-visa, student-hub, privacy, terms, refund, sitemap. Plus 14 shared components (Header/mega-menu, Footer, EnquiryForm, StickyCTA, WhatsAppButton, TrustBar, Breadcrumbs, SchemaRenderer, GalleryGrid, LanguageSwitcher, consent/ banner suite), `src/lib/consent/` (own consent manager: config/events/storage/types), static `public/sitemap.xml` served by a route handler.

**i18n — the headline question: yes, her repo handles locales, and the LIVE site does not.**
- next-intl `defineRouting` with locales **["en","de","fr","ar","ru"]**, `localePrefix: "always"`, middleware on all non-asset paths; `dir={isRtl ? "rtl" : "ltr"}` on `<html>` for AR.
- messages/{en,de,fr,ar,ru}.json exist (11–19 KB each) — but they cover **UI chrome only**. Page copy (all course data: titles, descriptions, syllabi, pricing tables) is **hardcoded arrays inside page.tsx** with per-locale `title`/`desc` objects whose EN entries are full paragraphs and DE/FR/AR/RU entries are one-liners. So localization is real but **shallow and uneven** — exactly what the transcreation rules forbid shipping silently (Factory rule: a page missing a declared locale is flagged).
- **No hreflang/alternates metadata anywhere** — Checklist A7 (complete + reciprocal hreflang) fails today.
- Correction to our register table: SITE_DESIGN_LOCALE_REGISTER.md line for kairali.guru says locales are "EN/DE/FR/AR/RU — live". As fetched today the LIVE site is **EN-only** (no hreflang, no language switcher markup, /de/ → 404). The five-locale set exists only in Eeshal's repo. Register table should be corrected when next amended via DECISIONS.md.

**Quality assessment — the good:**
- Correct fonts already: `Kurale, Asap, Lato` via next/font (build-time self-hosted) — matches ENGINEERING_STANDARDS.
- **.aspx → new-URL 301 map already written in next.config.ts** for all 5 legacy course URLs + default.aspx + catch-all `/:path*.aspx` → /courses. This is migration-playbook thinking and is directly reusable.
- JSON-LD via schema-dts: Course/CourseInstance/Offer, EducationalOrganization, LocalBusiness, Breadcrumb ListItems — typed, not string-blob.
- Consent banner + preferences + storage abstraction, analytics gated on stored consent.
- Honest self-audit docs in docs/: feature-status-matrix.csv (every row candidly "No" on desktop/mobile/a11y/multilingual testing), compliance-audit, cookie/tracker inventories, keyword maps, redesign-plan. She also vendored the Factory OS doc (_temp_source/) — she's read our system.

**Quality assessment — the bad:**
- **Security: hardcoded client-side credentials** in student-hub/page.tsx: `email === "student@kairali.guru" && password === "REDACTED"` — fake auth committed to a public repo. Must be removed or replaced with real auth + noindex before any deploy (her own matrix flags it).
- **Forms lane conflict:** EnquiryForm inserts directly into Supabase from the client with the anon key (name/email/country/programme/phone/language/location). Factory lane is packages/forms → Satyam's webhook; a public-repo Supabase table also raises RLS + DPDP consent-evidence questions. Replace, don't extend.
- **Analytics is a stub:** AnalyticsTracker logs pageviews to console. No GA4, no Google Consent Mode v2 — her consent UI is not wired to anything real. packages/analytics + packages/consent replace this.
- **Rogue palette:** globals.css defines its own token set (bark/laterite/palm/turmeric/sage/sand…, 15 raw hexes) — not brand-tokens.css; brand lint would fail the build today.
- Course/page content lives in 600-line TSX arrays, not MDX with frontmatter (violates the Factory MDX rule; also makes the locale gaps invisible to lint).
- npm not pnpm; standalone app not a workspace package; no tests; prices hardcoded (₹15,500/$260 etc.) with **no verifiable source** — rule 6: verify every price against the live business before shipping, never trust repo literals.
- README is untouched create-next-app boilerplate.

## 2 · What the LIVE site does better

- **Authentic, complete course copy** — the .aspx course pages carry the full canonical programme text (WAP/OAP/TAP curricula, recommended-for, session structure, "Course Contains" lists) and the brand story (founded 1989, 35 locations, mission). This is the content source of truth; Eeshal's EN course copy is largely lifted from it, her other locales are not.
- **A working lead engine:** "FREE EXPERT COUNSELING" form with training-location selector (Delhi/Gurgaon/Mumbai/Palakkad) above the fold, tel +91 95551 56156, info@kairali.guru, Chatbase live chat (the bot our DECISIONS entry extracted the chatbotId from), Google Maps embed, testimonials.
- **Indexed equity:** verified in Google (google-site-verification present) + Bing; the .aspx URLs are what Google knows — her redirect map is the bridge and must survive migration.
- Nothing else — it is an XHTML-era ASP.NET one-pager + 5 course pages, EN-only, **no robots.txt, no sitemap, and dead analytics (Universal Analytics UA-111691547-1, defunct since 2023–24 — the live site has effectively had NO measurement for two years).**

## 3 · What Eeshal's rebuild does better

- Modern stack (Next 16/React 19/Tailwind 4), static-first App Router, correct brand fonts.
- Real i18n architecture: 5-locale routing, AR RTL, language switcher — the RTL tokens our packages/i18n README already names kairali.guru "the donor codebase" for.
- Much larger, sensible IA (learn/knowledge centre, locations, FAQ, travel-visa, policies, testimonials, gallery) vs the live one-pager.
- Typed structured data, breadcrumbs, consent scaffolding, sticky CTA + WhatsApp button (already on Priya's interim +91 92898 38797 — matches DECISIONS interim ruling).
- The legacy-URL 301 map, keyword maps, and honest compliance/feature audits in docs/.

## 4 · Gaps vs our standards (ENGINEERING_STANDARDS + brand manual + compliance)

| # | Gap | Standard violated | Fix lane |
|---|---|---|---|
| 1 | Own hex palette, no brand tokens | brand-tokens.css only; brand lint gates build | Re-skin on packages/ui tokens (ED register: prose 720px, Kurale headlines, bylines) |
| 2 | No hreflang/alternates | Checklist A7 | packages/seo + next-intl alternates |
| 3 | Locale copy uneven (EN deep, others thin) | Transcreation rules 1–3; "flagged, never silently EN-only" | MDX per-locale frontmatter + locale lint; ship EN + only MOA-justified locales complete |
| 4 | Client→Supabase form, anon key, no consent field | Forms lane (packages/forms→webhook), DPDP evidence | Replace EnquiryForm internals with packages/forms |
| 5 | Analytics console-stub; consent not Consent Mode v2 | Third-party scripts only via packages/analytics + packages/consent | Swap in shared packages |
| 6 | Hardcoded student-hub credential in public repo | Basic security; /security-review Ship Gate A-13 | Delete page or gate behind real auth + noindex |
| 7 | Content in TSX arrays, not MDX + frontmatter | Factory rule: every page MDX with title/description/locale/keywords/schemaType/cta | Extract to content/ MDX during port |
| 8 | Unverified hardcoded prices | CLAUDE.md rule 6 (never invent facts/prices) | Verify each price with Abilash/centre team; empty + flag otherwise |
| 9 | npm, standalone, no workspace | Monorepo: sites/* built only from packages/* | Port into sites/kairali.guru, pnpm + turbo |
| 10 | No tests, no Lighthouse evidence, nothing QA'd (her own matrix) | Ship Gate: build clean · specs green · LH ≥90/100 · compliance lint zero | Full gate run at Wave 2 |
| 11 | No launch-evidence checklists | launches/<domain>/ rule | Fill at launch |
| 12 | public/ still has create-next-app SVGs, boilerplate README | hygiene | Sweep during port |

Register/compliance note: kairali.guru is **ED register** (education) and NOT a KTAHV clinical surface — the banned-word lock does not apply here; live copy's "spa & wellness professionals" audience language is acceptable. Claims discipline still applies (no cure claims in course marketing).

## 5 · Migration plan → sites/kairali.guru (Wave 2, Days 13–19)

Blend directive (DECISIONS 18:51:36): keep the live site's authoritative copy + lead-gen prominence, keep Eeshal's architecture + IA, improve both. Eeshal continues via Factory PRs after org invite (she must **stop pushing to the standalone repo** — already in BACKLOG WAITING ON).

1. **Freeze + mine (0.5 d):** `scripts/mine.py kairali.guru` → content-mined/ (immutable layer); ask Eeshal for her final push; record repo SHA in DECISIONS.
2. **Port skeleton (1 d):** create sites/kairali.guru in the workspace (pnpm, turbo, tsconfig.base); bring over src/app/[locale] routing, middleware, i18n/routing.ts, components; swap fonts import to the shared next/font setup; wire packages/ui + brand-tokens.css and delete her palette (brand lint green).
3. **Replace integration layer (1 d):** EnquiryForm → packages/forms (Satyam webhook + consent field); AnalyticsTracker/consent → packages/analytics + packages/consent (Consent Mode v2); WhatsApp/Chatbase interim per DECISIONS (Priya number + chatbotId rpNt_uRW6W8EDiTf6AvYJ — already partly present); delete student-hub or rebuild noindex with real auth (decision needed from Abilash — QUESTIONS).
4. **Content extraction (1–1.5 d):** course/learn/locations copy out of TSX into MDX with full frontmatter; EN copy reconciled against the live .aspx text (live wins on authenticity); prices verified or emptied+flagged; locale files completed only where an MOA brief exists — others declared-and-flagged per transcreation rule 3.
5. **SEO/compliance layer (0.5 d):** hreflang/alternates via packages/seo, generated sitemap (replace static file), robots.txt, keep + extend her .aspx 301 map (Migration Playbook semantic 1:1), schema via packages/schema, compliance lint zero.
6. **Design blend pass (1 d):** ED-register visual pass — her premium editorial direction on brand tokens, live site's above-the-fold counseling CTA restored, mobile-first at 375px, image placeholders + IMAGE_MANIFEST.md.
7. **Ship Gate (0.5 d):** pnpm build clean, spec suite, Lighthouse ≥90/100, /security-review, design-critic pass, launches/kairali.guru/ checklists, Vercel preview → Abilash approval. DNS flip = human action.

**Estimated effort: ~5.5–6 focused days** (fits the Wave-2 window). Keep-from-each summary: *from Eeshal* — routing/i18n/RTL, IA, components, schema, redirect map, docs; *from live* — canonical copy, lead-gen layout priority, Chatbase, GSC/Bing verification continuity; *from neither* — forms, analytics, consent internals, palette, student-hub auth (all Factory packages/rebuilds).

**Verdict:** Eeshal's repo is a genuinely usable baseline — the architecture and i18n scaffolding alone save 2–3 days over greenfield — but its integration layer (forms/analytics/consent/auth) and palette must be replaced wholesale with Factory packages, and every locale/price/claim it carries must be verified against the live source of truth before it ships.
