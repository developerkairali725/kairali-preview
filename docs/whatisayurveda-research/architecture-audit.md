# whatisayurveda.com — Architecture Audit (code-level)

**2026-07-15 17:35:16 IST · Repo audit, no code changed, no git run.**
**Scope:** exactly how a page exists today, so we know precisely what to add for multi-type content at scale (20 → ~3,400 pages).
**As-of:** working tree of branch `feat/wia-content-engine-research` (worktree `vigorous-swanson-7a2b7c`).
**Companion docs (planning, not code):** `docs/group-inputs/whatisayurveda-full-sitemap.md` §3 (template library T0–T7), `whatisayurveda-IA-roadmap.md` (six pillars), `whatisayurveda-niche-brief.md`.

> **PR #61 note:** `app/lib/medical-review.ts` **is present in this worktree** and is imported by `article.tsx`. The reviewer refactor is therefore audited as live code, not as a pending diff. Whether it is merged to `origin/main` was NOT checked (no git per task instruction).

---

## 0 · File map (the whole engine)

| Path (absolute under `sites/whatisayurveda.com/`) | Role |
|---|---|
| `content/*.json` | 20 page files, one per page. **The content source.** |
| `content/_manifest.json` | slug→file index. **Documentation only — no code reads it** (see §2.4). |
| `app/lib/content.ts` | Loader + the `Page` type. 51 lines. The whole schema lives here. |
| `app/[...slug]/page.tsx` | Catch-all route. 25 lines. |
| `app/what-is-ayurveda/page.tsx` | Pillar's own static route (same `Article` component). |
| `app/page.tsx` | Home — **hard-coded TSX**, not content JSON (`CLUSTERS`/`TRUST` arrays). |
| `app/_components/article.tsx` | **The only page template.** 184 lines. Byline, JSON-LD, sections, pathway, FAQ, citations. |
| `app/_components/chrome.tsx` | Header/footer. Nav links **hard-coded** (6 links). |
| `app/lib/render.tsx` | Zero-dep block Markdown subset (p, h3, ul, ol, GFM table, `**b**`/`*i*`/links). |
| `app/lib/medical-review.ts` | `MEDICAL_REVIEW` single source of truth for the reviewer. |
| `app/lib/meta.ts` | `pageMetadata(page)` → `@kairali/seo` `buildMetadata`, clamps title 60 / desc 155. |
| `app/sitemap.ts` | `allPages()` → `buildSitemap`. |
| `app/llms.txt/route.ts` | `allPages()` → `buildLlmsTxt`. |
| `site.config.json` | `{domain, entity: "group", register: "A", locales: ["en"], targetMarkets, video, brand}` |
| `packages/schema/src/index.js` | `graph · medicalWebPage · article · physician · person · kairaliOrganization · faqPage · breadcrumbList · webSite · serializeJsonLd` (+ `medicalClinic`, `localBusiness`, `product`). |

**No test/spec file exists for this site** (`find` for `*.spec.*`/`*.test.*` matching ayurveda/wia → zero hits). There is no content lint.

---

## 1 · The current content-JSON schema (VERBATIM)

`app/lib/content.ts` lines 8–26 — this is the complete, authoritative schema. Nothing else defines a field.

```ts
export type Citation = { n: number; text: string; url?: string };
export type Section = { h2: string; capsule: string; body: string };
export type Faq = { q: string; a: string };
export type Crumb = { name: string; url: string };

export type Page = {
  slug: string;
  title: string;
  metaDescription: string;
  h1?: string;
  breadcrumb?: Crumb[];
  answerCapsule: string;
  sections: Section[];
  faqs?: Faq[];
  citations?: Citation[];
  routesTo?: string[];
  clinical: boolean;
  register_ok: "ok" | "review";
};
```

### 1.1 Field-by-field truth table

| Field | Type | Req? | Who reads it | Reality check across the 20 files |
|---|---|---|---|---|
| `slug` | `string` | yes | `pageBySlug`, `allSlugParams`, sitemap, llms.txt, all `@id`s | Leading-slash absolute (`/herbs/ashwagandha`). Present in 20/20. **This — not the filename — is the routing key.** |
| `title` | `string` | yes | `pageMetadata` (clamp 60), `medicalWebPage.name` / `article.headline` | 20/20. |
| `metaDescription` | `string` | yes | `pageMetadata` (clamp 155), llms.txt `note` | 20/20. |
| `h1` | `string?` | no | `<h1>`, breadcrumb fallback label | **19/20 — `herbs__ashwagandha.json` has no `h1`** and silently falls back to the SEO `title` ("Ashwagandha: Uses, Evidence & Safety \| Ayurveda" renders as the H1). Optionality is already causing a defect. |
| `breadcrumb` | `Crumb[]?` | no | `<nav>` + `breadcrumbList` JSON-LD | 20/20 present (2–3 crumbs). Hand-authored, **not derived from slug** → drift risk at scale. |
| `answerCapsule` | `string` | yes | `.capsule.lead` above the body (the AEO device) | 20/20. |
| `sections` | `Section[]` | yes | the `.prose` loop | 4–8 per page. `{h2, capsule, body}`; `capsule` is typed required but rendered conditionally (`s.capsule ? … : null`). `body` = Markdown subset. |
| `faqs` | `Faq[]?` | no | FAQ section + `faqPage` JSON-LD | 20/20 present (3–15 items). |
| `citations` | `Citation[]?` | no | References `<ol>` | 20/20 present (2–11). |
| `routesTo` | `string[]?` | no | pathway aside | Values seen: `"KTAHV"`, `"KAPPL"`, `"Villa Raag"`. **Untyped `string[]`** — a typo silently renders nothing. `doshas*.json` carry `[]`. |
| `clinical` | `boolean` | yes | **the only template switch**: `true` → `MedicalWebPage`, `false` → `Article` | 20/20. |
| `register_ok` | `"ok" \| "review"` | yes | **NOBODY.** `grep -rn "register_ok" app` → only the type declaration | Dead field. Two files say `"review"` (`is-ayurveda-scientific`, `faq`) and nothing gates on it. |

### 1.2 Fields that do NOT exist today (each is a §5 gap)

`type` · `datePublished` · `dateModified` · `lastReviewed` · `reviewer` · `author` · `aliases` · `names` · `dravyaguna` · `evidenceTiers` · `classicalRefs` · `safety` · `related` · `children` · `locale` · `noindex` · `tags`.

---

## 2 · Slug → file → HTML (the exact chain)

### 2.1 Route resolution

```
GET /herbs/ashwagandha
  → app/[...slug]/page.tsx           params.slug = ["herbs","ashwagandha"]
  → pageBySlug("herbs/ashwagandha")  (app/lib/content.ts:40)
      norm = "/" + slug.replace(/^\/+/,"")     → "/herbs/ashwagandha"
      allPages().find(p => p.slug === norm)    ← FULL DIRECTORY SCAN + FULL JSON PARSE OF EVERY FILE
  → <Article page={page} />          or notFound()
```

`generateStaticParams()` → `allSlugParams()` → `allPages()` again, `.filter(p => p.slug !== "/what-is-ayurveda")` (the pillar is excluded because `app/what-is-ayurveda/page.tsx` owns that path), `.map(p => ({ slug: p.slug.replace(/^\/+/,"").split("/") }))`.

`generateMetadata()` → `pageBySlug(...)` → `allPages()` **a third time**.

### 2.2 The loader (`allPages`, content.ts:31–37)

```ts
const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json") && !f.startsWith("_"));
return files
  .map((f) => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), "utf8")) as Page)
  .filter((p) => p && p.slug)
  .sort((a, b) => a.slug.localeCompare(b.slug));
```

**No cache, no memo, no index.** Every call re-reads and re-parses the entire corpus.

### 2.3 The O(N²) build — the single biggest scale defect

Per page built, `allPages()` runs **twice** (`generateMetadata` + the page component), plus once for `generateStaticParams`, once for `sitemap.ts`, once for `llms.txt`. So a build of N pages performs ≈ **2N + 3 full-corpus scans = ~2N² file reads**.

| N | Full-corpus scans | JSON file reads (approx) |
|---|---|---|
| 20 (today) | 43 | ~860 — invisible |
| 500 (v2) | 1,003 | ~500,000 |
| 3,400 (target) | 6,803 | **~23,000,000** |

At 3,400 pages this is a multi-hour (or OOM) build. **Fix before the corpus grows, not after** — a module-level `Map` cache + a slug→file index makes it O(N). This is the one item that is genuinely urgent; everything else in §5 is additive.

### 2.4 The manifest is a lie waiting to happen

`content/_manifest.json` (`{generated, pages:[{slug,file,clinical,register_ok}]}`) is filtered OUT by the loader (`!f.startsWith("_")`) and **read by no code**. Slugs come from inside each JSON; filenames (`herbs__ashwagandha.json`, `__` = path separator) are convention only — rename a file and nothing breaks; change a `slug` and the manifest silently lies. The full-sitemap doc §3 plans A–Z generators driven *from* `_manifest.json` — those would be building on an unvalidated artifact. Either make the manifest generated-and-checked in CI, or make it the actual index the loader uses.

### 2.5 Not content-driven

Home (`app/page.tsx`) and nav (`chrome.tsx`) are hard-coded TSX. Adding `/ingredients` or `/classical-texts` needs a **code edit**, not a content file — contradicting "new clusters are content, not code" (IA roadmap). Hub children/nav must become manifest-derived.

---

## 3 · Component → rendered part (all of it is `article.tsx`)

| Rendered part | Source | Line(s) |
|---|---|---|
| JSON-LD `<script>` | `graph(...)` + `serializeJsonLd` | 63–105 |
| Breadcrumb `<nav>` | `page.breadcrumb` else `[Home, h1/title]` | 59–61, 107–115 |
| `<h1>` | `page.h1 ?? page.title` | 119 |
| **Byline** | literal `"the Kairali Editorial Team"` + `MEDICAL_REVIEW.current.{name,credentials}` + `REVIEWED` const | 121–125 |
| Lead capsule | `page.answerCapsule` | 127 |
| Body | `page.sections.map` → `<h2 id={`s-${i}`}>` + optional capsule + `<Markdown text={s.body} />` | 129–137 |
| Pathway aside | `page.routesTo?.map(k => PATHWAYS[k]).find(Boolean)` — **first match only**, from a 3-key const map | 29–48, 101, 139–147 |
| FAQ block | `page.faqs` → `<h3>/<p>` | 149–159 |
| References | `page.citations` sorted by `n` → `<ol>` | 161–175 |
| Sticky CTA | literal WhatsApp link | 179–181 |

**There is no related-links / sibling-links renderer.** The file's own header comment claims "sibling links" — in reality siblings are hand-typed Markdown links inside `body` prose (e.g. ashwagandha § 4 links triphala/brahmi/turmeric by hand). The full-sitemap doc's linking law (§4: every spoke links hub + 2–3 siblings, bounded fan-out) is **not enforceable by any component today**. At 3,400 pages, hand-typed crosslinks are unmaintainable — this needs a `related[]` field + a renderer.

**Citation numbering caveat:** body text carries literal `[1]`/`[3]` markers; the References list is a plain `<ol>` whose browser numbering ignores `c.n`. Contiguous `n` today, so it matches — but a page with `n: [1,3,5]` would render as 1,2,3 and silently mis-map every marker. No anchor links between marker and reference either.

---

## 4 · JSON-LD / MedicalWebPage / physician wiring

Constants at `article.tsx:22–26`:

```ts
const SITE = "https://whatisayurveda.com";
const REVIEWED = "2026-07-14"; // build date; real review cadence tracked in editorial policy
const REVIEWER_ID = `${SITE}/about#${MEDICAL_REVIEW.current.anchor}`;   // → /about#medical-reviewer
const AUTHOR_ID = `${SITE}/about#editorial-team`;
const ORG_ID = `${SITE}/#organization`;
```

The graph emitted per page:

1. `kairaliOrganization({id: ORG_ID, url: SITE})`
2. **`clinical ? medicalWebPage(...) : articleSchema(...)`** — the single branch.
   - `medicalWebPage`: `{name: title, url, lastReviewed: REVIEWED, reviewedBy: {@id: REVIEWER_ID}, inLanguage: "en"}`. Note `packages/schema` supports an `about: MedicalCondition` via `m.condition` — **whatisayurveda never passes it** (no condition field exists).
   - `articleSchema`: `{headline, url, author:{@id:AUTHOR_ID}, datePublished: REVIEWED, dateModified: REVIEWED, publisher:{@id:ORG_ID}}`.
3. `physician({id: REVIEWER_ID, name, jobTitle: "<title> (<credentials>)", medicalSpecialty: "https://schema.org/PublicHealth", affiliationId: ORG_ID})`
4. `person({id: AUTHOR_ID, name: "The Kairali Editorial Team", affiliationId: ORG_ID})`
5. `breadcrumbList(...)`
6. `faqPage(...)` **iff** `page.faqs?.length`

`medical-review.ts` is a clean single source of truth (`current.{name,credentials,title,anchor}` + `institution`), and `article.tsx` reads it correctly for byline + `Physician` + `@id`.

### 4.1 Three defects in the wiring (all worsen with scale)

1. **`REVIEWED` is one hard-coded const for the whole site.** Every page claims `lastReviewed: "2026-07-14"` and Articles claim identical `datePublished`/`dateModified`. Since the byline prints it too, page 3,400 published in 2027 would *display* a 2026 review date. **Per-page `lastReviewed`/`dateModified` is mandatory before the corpus grows** — it is also the E-E-A-T signal the niche brief leans on.
2. **`REVIEWER_ID` points at an anchor that doesn't exist.** `https://whatisayurveda.com/about#medical-reviewer` — `article.tsx` only ever emits `id="s-{i}"` on H2s; nothing renders `id="medical-reviewer"` or `id="editorial-team"`. Every page's `reviewedBy`/`author` `@id` resolves to a dead fragment. Cheap fix (a `sectionId` field on `Section`, or a rendered bio block on /about); real credibility cost.
3. **`MEDICAL_REVIEW` is bypassed in two places** — the exact leak the refactor exists to prevent:
   - `app/llms.txt/route.ts:17` hard-codes `"Every health page is medically reviewed by Dr. Deepu John (BAMS), Chief Physician"`.
   - `content/about.json` names "Dr. Deepu John, BAMS" in prose ~6 times (answerCapsule, editorial-policy body, reviewer bio, an FAQ answer).
   A leadership change would leave the byline/schema correct and llms.txt + /about stale. Per the Abilash ruling behind the refactor ("head can change; reviewer is config, not a literal"), llms.txt should read `MEDICAL_REVIEW.current`, and /about's prose should either be templated or state the **institutional** framing (`MEDICAL_REVIEW.institution`) with the named reviewer injected.

Also: `inLanguage: "en"` is hard-coded (site is `locales: ["en"]`, but the full-sitemap doc makes German a Phase-1 priority second locale — see §5.7).

---

## 5 · Gap-to-multi-type (herb · condition · formulation · concept · classical-text)

Today: **one type**, selected by one boolean. Target (full-sitemap §3): T0 pillar, T1 monograph (+T1f facet, T1q question, T1c condition), T2 hub, T3 index, T4 tool, T5 reference/bio, T6 glossary, T7 news. The engine does not need replacing — it needs a discriminant, typed blocks, per-type templates, and an O(N) loader.

### 5.1 Add a `type` discriminant (the keystone)

```ts
export type PageType =
  | "pillar" | "hub" | "index"
  | "herb" | "formulation" | "therapy" | "condition" | "concept"
  | "classical-text" | "glossary" | "question" | "reference" | "news";

export type BasePage = { /* today's fields */ type: PageType; … };
export type Page = HerbPage | ConditionPage | FormulationPage | ConceptPage | ClassicalTextPage | …;
```

Then `clinical` stops being the template switch and becomes what it should be: the **physician-gate flag** (CLAUDE.md rule 7). Schema choice derives from `type`. Migration: today's 20 files get `"type"` added (`herbs/*` → `herb`, `herbs`/`doshas`/`panchakarma`/`diet` → `hub`, `what-is-ayurveda` → `pillar`, `about` → `reference`, `faq` → `question`, `doshas/*`, `lifestyle/*`, `is-ayurveda-scientific`, `history-of-ayurveda` → `concept`). **Make `type` required and defaulted nowhere** — a silent default is how 3,400 pages end up mistyped.

### 5.2 Per-type optional typed blocks (extension, not replacement)

| Type | New optional fields |
|---|---|
| `herb` | `names{devanagari,iast,botanical,english,vernacular[]}`, `dravyaguna{rasa,guna,virya,vipaka,prabhava}`, `evidenceTiers[{tier,claim,source}]`, `safety{cautions[],contraindications[],pregnancy}`, `classicalRefs[{text,sthana,chapter,verse}]`, `aliases[]` |
| `condition` | `neutralDescription{text,citation}`, `ayurvedicFraming{rogadhikara,text}`, `evidenceTiers[]` — **DMR-safe fixed spine; banned-claims lint mandatory** |
| `formulation` | `kalpanaClass`, `classicalSource{text,ref}`, `ingredients[{herb,slug,part,proportion?}]`, `manufacture` — educational only; buy → Shopify, never on-site |
| `classical-text` | `attributedAuthor`, `approxDate`, `structure[{sthana,chapters}]`, `editions[]` |
| `concept` | `sanskrit{devanagari,iast}`, `glossaryRef` |
| all | `lastReviewed`, `dateModified`, `reviewer` (defaults to `MEDICAL_REVIEW.current`), `author`, `related[{slug,label}]`, `aliases[]`, `locale` |

Every block **optional** → the 20 live files stay valid; enforcement moves to lint (§5.6), not to the type system alone. Rule 6 (never invent facts) means a missing block is *absent*, never guessed.

### 5.3 Per-type templates + section renderers

Split `article.tsx` into `ArticleShell` (breadcrumbs, byline, JSON-LD, FAQ, citations, pathway, sticky CTA — all type-agnostic) + a `TEMPLATES: Record<PageType, Component>` registry. New renderers needed: `<NamesBlock>`, `<DravyagunaTable>`, `<EvidenceTiers>` (the four-tier display), `<SafetyBlock>`, `<ClassicalRefs>`, `<IngredientList>`, `<RelatedLinks>`, `<HubChildren>`, `<AZLadder>`. Keep the Markdown subset for prose; typed blocks render as components, not as hand-typed Markdown tables (today's dravyaguna-style tables would be prose — unqueryable, unlintable, and un-schema-able).

### 5.4 Schema-per-type

Replace the `clinical ?` ternary with a `SCHEMA_BY_TYPE` map: herb/therapy/condition/question → `MedicalWebPage` (+ `MedicalEntity`/`Substance` where accurate; **never `Drug` + `AggregateRating`**, divergence D6 — no UGC, and fabricated ratings violate rule 6); condition → pass `m.condition` so the **existing-but-unused** `about: MedicalCondition` builder finally fires; hub/index → `CollectionPage` + `ItemList`; glossary → `DefinedTerm`; news → `NewsArticle`; bio → `Person`. `packages/schema` already has `person/physician/article/medicalWebPage/faqPage/breadcrumbList`; **missing builders: `collectionPage`, `itemList`, `definedTerm`, `newsArticle`, `medicalEntity`/`substance`** — add to the shared package (factory rule: built only from `packages/*`).

### 5.5 Loader + sitemap at scale

- **Cache + index (blocking, per §2.3):** module-level `Map<slug, Page>` built once; `pageBySlug` = O(1). Optionally shard `content/` into per-cluster subfolders (`content/herbs/…`) — the loader must then walk recursively.
- **`_manifest.json` becomes real:** generated by a script, validated in CI (slug↔file↔type↔clinical agree), and the source for hub `children[]`, A–Z ladders, and nav — killing the hard-coded home/nav problem (§2.5).
- **Sitemap:** today one flat list, `priority` a ternary on the pillar slug. At scale: priority by `type` (pillar 1.0 > hub 0.9 > monograph 0.7 > facet 0.5), `lastModified` from per-page `dateModified` (not `new Date()` — today every URL claims "modified now" on every deploy, a real freshness-signal defect), and **sitemap index sharding past 50,000 URLs / 50 MB** (fine at 3,400, needed at v4). `buildSitemap` already skips `/lp/*` and emits hreflang alternates when >1 locale.
- **llms.txt:** currently lists *every* page with its full metaDescription — at 3,400 pages that is a huge unusable file. Needs curation (hubs + pillar + top monographs) or per-cluster llms.txt.

### 5.6 Lint (the honest-YMYL gate, currently zero)

No content lint exists; `register_ok` is dead. Needed in CI: JSON conforms to its type's schema · banned-claims scan (cure/treat/prevent) with the condition cluster double-gated · every efficacy statement has `evidenceTiers` + a citation · `citations[].n` contiguous and every body marker resolves · `routesTo` values ∈ `PATHWAYS` keys · every `related[]`/breadcrumb/internal Markdown link resolves to a real slug (link-rot is the #1 failure mode of a 3,400-page corpus) · `h1` required · `lastReviewed` present and not stale beyond the re-review cadence /about promises. `packages/compliance` (`src/lint.js`, `src/rules.js`) is the natural home.

### 5.7 Register + locale

`site.config.json` is `locales:["en"]`; `inLanguage` is hard-coded `"en"`. If DE becomes a priority second locale, `Page` needs `locale` + a translation-pairing key, and `buildSitemap`/`buildMetadata` already handle hreflang once `locales` grows. **Flag, do not assume** — this is a decision, not a code detail.

### 5.8 Physician-gate at volume

One reviewer const + one hard-coded date does not survive 3,400 pages: per-page `reviewer` + `lastReviewed`, batched per-cluster sign-off (roadmap §5), and a lint that fails a clinical page whose `lastReviewed` is absent. `clinical: true` should mechanically mean "Dr. Deepu John (or the then-current head) signed this file" — today it only means "emit MedicalWebPage".

---

## 6 · Priority order (recommendation, for Abilash)

| # | Item | Why now |
|---|---|---|
| 1 | Loader cache + slug index (§2.3) | O(N²) build; blocks every scale plan. Cheap fix today, expensive later. |
| 2 | Per-page `lastReviewed`/`dateModified` + reviewer (§4.1.1, §5.8) | YMYL credibility; retrofitting dates onto 500 published pages is worse. |
| 3 | `type` discriminant + template registry (§5.1, §5.3) | Every later cluster depends on it. 20 files to migrate now vs 500 later. |
| 4 | Fix `#medical-reviewer` anchor + llms.txt/about reviewer leak (§4.1.2, §4.1.3) | Small, and they undercut the exact E-E-A-T the site is for. |
| 5 | `_manifest.json` generated + validated; hub `children[]`/nav from it (§2.4, §2.5) | Unblocks "content, not code" and the A–Z generators. |
| 6 | `related[]` + `<RelatedLinks>` (§3) | Hand-typed crosslinks do not scale; linking law is the discovery engine. |
| 7 | Content lint in CI (§5.6) | Must exist *before* volume, not after. |
| 8 | Typed blocks + new schema builders (§5.2, §5.4) | The actual monograph quality jump. |

**Open questions for Abilash / Dr. Deepu John (not decided here):** (a) does `/about` prose name the reviewer literally, or render from `MEDICAL_REVIEW`? (b) is DE a real second locale for this property, and when? (c) per-cluster physician sign-off batching — who signs, at what cadence, recorded where?

---

## 7 · Verification note

Every claim above is from reading files in this worktree at 2026-07-15 17:35 IST. Not verified (out of scope — no git, no build run): whether `medical-review.ts` is merged to `origin/main`; the actual wall-clock build time at any N (the §2.3 table is arithmetic from the call graph, not a measured benchmark); live-site behaviour.
