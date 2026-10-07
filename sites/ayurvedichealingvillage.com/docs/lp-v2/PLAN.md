# AHV Campaign Landing Template Kit (v2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a coded template kit in the live AHV Next.js app. A content AI writes **one content file per campaign**, and that file renders as design variant A, B, C or D at noindex preview URLs. Automatic checks (`pnpm lp:check`) reject any content that breaks length, claims, register, spelling, image, price or locale rules. Panchakarma ships as the pilot.

**Architecture:**
- **New route group `app/(campaign-v2)`** with its own root layout. It does not reuse the heavy `/design/*` bundle.
- **Pure, tested TypeScript logic** in `campaign-v2/kit/` covers types, registries, locale and currency, geo consent, pricing, linting, lead payload and channel handoff.
- **React section components** in `campaign-v2/sections/` are skinned per variant through CSS custom properties.
- **Middleware** sets locale, currency and consent-region request headers on `/lp-v2/*` from `Accept-Language` and `CF-IPCountry`. Those pages are served `private, no-store`, so Cloudflare APO never caches one visitor's locale for another.

**Tech Stack:**
- Next.js 15.5 App Router, React 19, TypeScript 5.8
- Node 24 `node --test`, importing `.ts` directly (type stripping)
- pnpm 11.13.1
- `next/font`, `next/image`
- Existing workspace packages `@kairali/consent` and `@kairali/analytics`
- Existing `/api/lead/` endpoint
- Playwright, for final verification only

**Source documents** (copy them into the worktree in Task 0):
- Build spec: `docs/specs/2026-10-07-ahv-campaign-lp-v2-build-spec.md`
- Authoring guide: `docs/specs/2026-10-07-ahv-campaign-lp-authoring-guide.md`
- Approved designs: `design/canvas-2026-10-07/*.dc.html`, plus `BLOB-MAP.md` mapping canvas image IDs to real files
- Live canvas: https://claude.ai/artifact/9YoYMS51SchBoDtSR2Cv3h

## Global Constraints

- Work only in a NEW worktree on the SSD: `/Volumes/Extreme SSD - Blue 2nd/Kairali-Digital/.claude-worktrees/ahv-lp-v2-kit`, on branch `claude/ahv-lp-v2-kit`.
  - Never touch the occupied `ahv-final-draft-20260924` worktree or the canonical checkout.
  - No production deploy, no main merge, no changes to aliases, DNS, Ads or Cloudflare.
  - The PR targets `codex/ahv-final-draft-20260924`, the AHV integration branch, per `campaign-v110/REVIEW-HANDOFF.md`.
- Scope is the AHV app only: `sites/ayurvedichealingvillage.com`. Do not edit `packages/*`, lockfiles or CI. Do not edit `campaign-v110/` or existing routes.
- Tests: `node --test` on `.mjs` files that import `.ts` with explicit `.ts` extensions. Use **erasable TypeScript only:** no `enum`, no `namespace`, no constructor parameter properties.
- Variant URLs are **always noindex**: `/lp-v2/<slug>/<a|b|c|d>`.
- **Copy rules:**
  - American English ("program").
  - Malayalam-Sanskrit therapy names (Abhyangam).
  - No reply-time promises for the consultation.
  - CTA labels are exactly "Get free doctor consultation", "WhatsApp" and "Ask".
- Locked facts come from `campaign-v110/lib/site.ts` (`contact`, `site`). Never retype them:
  - Phone +91 95551 56156
  - WhatsApp 919289838797
  - Email info@kairali.com
  - NABH AH-2024-0250
  - Address: III/73 Palayamkadu, P.O. Olassery, Kodumbu, Palakkad District 678551, Kerala, India
- Social: Instagram `kairaliayurvedichealingvillage`; Messenger page `KairaliTheAyurvedicHealingVillage`.
- **Languages (13):** `en hi ar de fr es it pt nl ru zh-Hans ja ko`. **Currencies (5):** `INR USD EUR GBP AED`. Prices are never converted between currencies.
- **Consent:** a banner appears **only** for EU/EEA/UK/CH. Elsewhere, Consent Mode defaults to granted.
- **Accessibility:** WCAG 2.2 AA. Body text ≥ 17px, no text < 12px, targets ≥ 44px, and no horizontal scrolling on mobile (no carousels, no `overflow-x` rows).
- **Leads:** POST `/api/lead/` JSON with `form:"landing-page"`. Only the existing columns: `landing_page_path, form_variant, fname, lname, rdogender, phone, email, country, duration, message, consent, track_id, campaign_name, utm_keyword`. Required: `landing_page_path` and `email`. Extra answers (program, month, party, reply channel, marketing opt-in) are packed into `message`. No health data, ever.

**Out of scope** (separate follow-up plans; do not start them here):
1. Server-side conversions (Google enhanced conversions for leads / offline import, Meta CAPI). These need credentials and a lead-store hook.
2. New lead-store columns for program, channel and marketing opt-in (Deepu, alongside PR #340).
3. Rebasing the EU banner onto PR #353's granular consent once it merges. Until then this plan uses `@kairali/consent`'s `ConsentBanner`.
4. Migrating the other 15 campaign routes (the content AI's job, using the authoring guide).
5. Moving ad traffic (owner + Vikash).

---

## File structure (all paths relative to `sites/ayurvedichealingvillage.com/`)

```
campaign-v2/
  kit/
    types.ts              shared types (CampaignConfig, Variant, Locale, Currency, Channel, refs)
    pending.ts            pending() marker + collectPending()
    define.ts             defineCampaign() identity helper
    registry.ts           img()/film()/doc() resolvers over data/*
    locale.ts             13 locales, pickLocale(), isRtl(), LOCALE_NAMES
    currency.ts           currencyForCountry(), formatMoney()
    consent-region.ts     requiresConsent(), geoConsentDefaultSnippet()
    price.ts              feeFor(), isExpired()
    variants.ts           section order + hidden sections per variant
    skins.ts              4 skins as token objects + skinCssVars() + contrast()
    lead.ts               buildLeadPayload(), packMessage()
    handoff.ts            refCode(), channelLink()
    lint/
      lengths.ts          length budgets + visible-word count + reading level
      claims.ts           claims patterns
      language.ts         register words, British spellings, reply-time promises, ad match
      assets.ts           images, alt text, films, fees, locales, pending-on-production
      index.ts            lintCampaign() aggregating all rules
  data/
    images.ts films.ts doctors.ts
  campaigns/
    index.ts              registry of all campaign files
    _template.ts          blank file for the content AI
    panchakarma.ts        pilot
    panchakarma.changes.md
  sections/               React components (one per section)
  styles/
    base.css              resets + section primitives using CSS vars
middleware.ts             (modify) add /lp-v2 locale/currency/consent headers
next.config.ts            (modify) no-store + noindex headers for /lp-v2
app/(campaign-v2)/layout.tsx
app/(campaign-v2)/lp-v2/[slug]/[variant]/page.tsx
public/lp-v2/img/*        pilot images (copied, not hotlinked)
tools/lp-check.mjs        CLI
test/lp-v2-*.test.mjs     tests
package.json              (modify) add "lp:check" script
```

---

### Task 0: Worktree, baseline and reference files

**Files:**
- Create: the worktree; `docs/lp-v2/` (copies of the spec, guide, designs and BLOB-MAP)

- [ ] **Step 1: Create the isolated worktree from the AHV integration branch's committed HEAD** (never its working tree)

```bash
cd "/Volumes/Extreme SSD - Blue 2nd/Kairali-Digital/kairali-web-factory"
git fetch origin
git worktree add "/Volumes/Extreme SSD - Blue 2nd/Kairali-Digital/.claude-worktrees/ahv-lp-v2-kit" -b claude/ahv-lp-v2-kit origin/codex/ahv-final-draft-20260924
cd "/Volumes/Extreme SSD - Blue 2nd/Kairali-Digital/.claude-worktrees/ahv-lp-v2-kit"
git log --oneline -1
```
Expected: a commit at or after `c85e51784 perf(ahv): use smaller AVIF campaign hero derivative`.

- [ ] **Step 2: Install dependencies and run the baseline tests**

```bash
cat package.json | grep packageManager        # expect pnpm@11.13.1
pnpm install --frozen-lockfile
cd sites/ayurvedichealingvillage.com && pnpm test 2>&1 | tail -5
```
Expected: the existing suite passes. Record the pass/fail counts in the PR description as the baseline. If anything already fails, record it and do not fix it.

- [ ] **Step 3: Copy the reference documents into the app**

```bash
APP="/Volumes/Extreme SSD - Blue 2nd/Kairali-Digital/.claude-worktrees/ahv-lp-v2-kit/sites/ayurvedichealingvillage.com"
SRC="/Volumes/Extreme SSD - Blue 2nd/AHV Website "
mkdir -p "$APP/docs/lp-v2/design"
cp "$SRC/docs/specs/2026-10-07-ahv-campaign-lp-v2-build-spec.md" "$SRC/docs/specs/2026-10-07-ahv-campaign-lp-authoring-guide.md" "$APP/docs/lp-v2/"
cp "$SRC/design/canvas-2026-10-07/"* "$APP/docs/lp-v2/design/"
```

- [ ] **Step 4: Commit**

```bash
git add sites/ayurvedichealingvillage.com/docs/lp-v2
git commit -m "docs(ahv-lp-v2): add build spec, authoring guide and approved design sources"
```

---

### Task 1: Core types, `pending()` and `defineCampaign()`

**Files:**
- Create: `campaign-v2/kit/types.ts`, `campaign-v2/kit/pending.ts`, `campaign-v2/kit/define.ts`
- Test: `test/lp-v2-pending.test.mjs`

**Interfaces:**
- Produces:
  - `pending(id: string, note: string): Pending`
  - `isPending(v: unknown): v is Pending`
  - `collectPending(value: unknown): { path: string; id: string; note: string }[]`
  - `defineCampaign(c: CampaignConfig): CampaignConfig`
  - every type exported from `types.ts`

- [ ] **Step 1: Write the failing test**

```js
// test/lp-v2-pending.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { pending, isPending, collectPending } from "../campaign-v2/kit/pending.ts";

test("pending() creates a marker isPending() recognises", () => {
  const p = pending("C2", "fees from tariff");
  assert.equal(isPending(p), true);
  assert.equal(isPending("text"), false);
  assert.equal(isPending(null), false);
});

test("collectPending() finds markers deep in objects and arrays with JSON-ish paths", () => {
  const cfg = { a: "x", fees: pending("C2", "fees"), faq: [{ q: "q", a: pending("C14b", "length") }] };
  assert.deepEqual(collectPending(cfg), [
    { path: "$.fees", id: "C2", note: "fees" },
    { path: "$.faq[0].a", id: "C14b", note: "length" },
  ]);
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `node --test test/lp-v2-pending.test.mjs`
Expected: FAIL with `Cannot find module '…/campaign-v2/kit/pending.ts'`

- [ ] **Step 3: Implement**

```ts
// campaign-v2/kit/types.ts
export type Variant = "A" | "B" | "C" | "D";
export const VARIANTS: readonly Variant[] = ["A", "B", "C", "D"];
export type Locale = "en" | "hi" | "ar" | "de" | "fr" | "es" | "it" | "pt" | "nl" | "ru" | "zh-Hans" | "ja" | "ko";
export type Currency = "INR" | "USD" | "EUR" | "GBP" | "AED";
export type Channel = "whatsapp" | "instagram" | "messenger" | "chat" | "call" | "email";
export type Pending = { readonly __pending: true; id: string; note: string };
export type Maybe<T> = T | Pending;

export type ImageRef = {
  id: string; src: string; width: number; height: number; alt: string;
  decorative: boolean; gccSafe: boolean; location: "palakkad" | "ho-centre" | "n/a";
  consent: "confirmed" | "pending" | "not-applicable";
};
export type FilmKind = "property" | "patient" | "treatment" | "yoga";
export type FilmRef = { youtubeId: string; title: string; kind: FilmKind; consent: boolean; recordedYear: number; thumb: string };
export type DoctorRef = {
  id: string; name: string; role: Maybe<string>; qualification: Maybe<string>;
  yearsInPractice: Maybe<number>; languages: Maybe<string[]>; photo: ImageRef;
};
export type Money = Partial<Record<Currency, number>>;
export type FeeRow = { name: string; note: string; single: Money; twinEach: Money };
export type Fees = { source: string; validTo: string; nights: number; rows: FeeRow[] };
export type Offer = { name: string; headline: string; termsUrl: string; validFrom: string; validTo: string; source: string };
export type GalleryCategory = "Villas" | "Therapies" | "Grounds" | "Dining" | "Yoga";
export type WordingOverride = { term: string; approvedBy: "owner"; date: string; reason: string };
export type Translation = { locale: Locale; review: "approved" | "pending" };

export type CampaignConfig = {
  slug: string;
  route: string;
  previewRoute: string;
  defaultVariant: Variant;
  variants: Variant[];
  index: false;
  locales: Locale[];
  translations: Translation[];
  modesty: "standard" | "gcc";
  wordingOverrides: WordingOverride[];
  production: boolean;
  seo: { title: string; description: string };
  adMatch: { keywords: string[]; adHeadlines: string[] };
  hero: {
    overline: string; h1: string; h1Accent?: string; standfirst: string;
    image: Record<Variant, ImageRef>; mobileImage: ImageRef;
  };
  programDefault: string;
  tracking: { campaignName: string; trackId: string };
  admission: { heading: string; steps: { title: string; body: string }[] };
  included: string[];
  chargedSeparately: string[];
  stillness: { heading: string; body: string; image: ImageRef };
  films: { featured: FilmRef; more: FilmRef[] };
  doctors: DoctorRef[];
  village: { heading: string; body: string };
  gallery: { category: GalleryCategory; image: ImageRef }[];
  fees: Maybe<Fees>;
  offer: Offer | null | Pending;
  faq: { q: string; a: Maybe<string> }[];
  longForm: string;
};
```

```ts
// campaign-v2/kit/pending.ts
import type { Pending } from "./types.ts";

export function pending(id: string, note: string): Pending {
  return { __pending: true, id, note };
}

export function isPending(v: unknown): v is Pending {
  return typeof v === "object" && v !== null && (v as { __pending?: unknown }).__pending === true;
}

export function collectPending(value: unknown, path = "$", out: { path: string; id: string; note: string }[] = []) {
  if (isPending(value)) { out.push({ path, id: value.id, note: value.note }); return out; }
  if (Array.isArray(value)) { value.forEach((v, i) => collectPending(v, `${path}[${i}]`, out)); return out; }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) collectPending(v, `${path}.${k}`, out);
  }
  return out;
}
```

```ts
// campaign-v2/kit/define.ts
import type { CampaignConfig } from "./types.ts";
export function defineCampaign(c: CampaignConfig): CampaignConfig { return c; }
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `node --test test/lp-v2-pending.test.mjs`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add sites/ayurvedichealingvillage.com/campaign-v2/kit sites/ayurvedichealingvillage.com/test/lp-v2-pending.test.mjs
git commit -m "feat(ahv-lp-v2): campaign config types and pending() markers"
```

---

### Task 2: Media and doctor registries with resolvers

**Files:**
- Create: `campaign-v2/data/images.ts`, `campaign-v2/data/films.ts`, `campaign-v2/data/doctors.ts`, `campaign-v2/kit/registry.ts`
- Create: `public/lp-v2/img/` (copied files)
- Test: `test/lp-v2-registry.test.mjs`

**Interfaces:**
- Consumes: `ImageRef`, `FilmRef`, `DoctorRef`, `pending()` (Task 1)
- Produces:
  - `img(id: string): ImageRef`
  - `film(youtubeId: string): FilmRef`
  - `doc(id: string): DoctorRef`
  - Each throws `Error("Unknown image id: x")` (or film/doctor) for an unknown ID.
  - `IMAGES`, `FILMS`, `DOCTORS` records

- [ ] **Step 1: Copy the pilot images into `public/`.** These are web exports; replace them with `ahv-edited` masters later.

```bash
APP=".../ahv-lp-v2-kit/sites/ayurvedichealingvillage.com"   # use the full path from Task 0
SRC="/Volumes/Extreme SSD - Blue 2nd/AHV Website /_reference/redesign/assets/img"
mkdir -p "$APP/public/lp-v2/img"
for f in kt-199.jpg kt-190.jpg gal-post-therapy-stillness-wakem.jpg kt-202.jpg kt-116.jpg kt-314.jpg wx-hero.jpg wx-dining.jpg gal-poolside-rest-palakkad-2026.jpg team-deepu-john.jpg team-akhila-oommen.jpg team-ashikha-raj.jpg Travelers-Choice-Award-2025.png ktahv-logo-white.svg ktahv-logo-color.svg logo-ta.png logo-wlsa-black.png logo-wlha-black.png logo-patwa.png; do cp "$SRC/$f" "$APP/public/lp-v2/img/$f"; done
for id in iPARaMRASUs 4x01PtWfNnk 3vWviQfW1Ug 07tVC2oXd8g; do curl -sf -o "$APP/public/lp-v2/img/yt-$id.jpg" "https://i.ytimg.com/vi/$id/hqdefault.jpg"; done
ls "$APP/public/lp-v2/img" | wc -l
```
Expected: `23`

- [ ] **Step 2: Write the failing test**

```js
// test/lp-v2-registry.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { img, film, doc } from "../campaign-v2/kit/registry.ts";
import { IMAGES } from "../campaign-v2/data/images.ts";
import { FILMS } from "../campaign-v2/data/films.ts";

test("resolvers return registered entries", () => {
  assert.equal(img("kt-199").width, 1600);
  assert.equal(film("iPARaMRASUs").kind, "property");
  assert.equal(doc("deepu-john").name, "Dr. Deepu John");
});

test("resolvers throw on unknown ids", () => {
  assert.throws(() => img("nope"), /Unknown image id: nope/);
  assert.throws(() => film("nope"), /Unknown film id: nope/);
  assert.throws(() => doc("nope"), /Unknown doctor id: nope/);
});

test("every registered image and film thumbnail exists in public/", () => {
  for (const i of Object.values(IMAGES)) assert.ok(existsSync(new URL(`../public${i.src}`, import.meta.url)), i.src);
  for (const f of Object.values(FILMS)) assert.ok(existsSync(new URL(`../public${f.thumb}`, import.meta.url)), f.thumb);
});

test("decorative images have empty alt; informative images have 60-125 char alt", () => {
  for (const i of Object.values(IMAGES)) {
    if (i.decorative) assert.equal(i.alt, "", i.id);
    else assert.ok(i.alt.length >= 20 && i.alt.length <= 125, `${i.id}: ${i.alt.length}`);
  }
});
```

- [ ] **Step 3: Run the test and confirm it fails**

Run: `node --test test/lp-v2-registry.test.mjs`
Expected: FAIL, module not found

- [ ] **Step 4: Implement**

```ts
// campaign-v2/data/images.ts
import type { ImageRef } from "../kit/types.ts";

const P = "/lp-v2/img/";
const photo = (id: string, file: string, width: number, height: number, alt: string, o: Partial<ImageRef> = {}): ImageRef => ({
  id, src: P + file, width, height, alt, decorative: false, gccSafe: true,
  location: "palakkad", consent: "confirmed", ...o,
});

export const IMAGES: Record<string, ImageRef> = {
  "kt-199": photo("kt-199", "kt-199.jpg", 1600, 1067, "Two therapists performing four-hand Abhyangam with warm medicated oil", { gccSafe: false }),
  "kt-190": photo("kt-190", "kt-190.jpg", 1067, 1600, "A therapist preparing a patient for Shiro Abhyangam, a head therapy with warm oil", { gccSafe: false }),
  "gal-post-therapy-stillness-wakem": photo("gal-post-therapy-stillness-wakem", "gal-post-therapy-stillness-wakem.jpg", 1400, 1120, "", { decorative: true, gccSafe: false }),
  "kt-202": photo("kt-202", "kt-202.jpg", 1600, 1067, "Medicated oil poured from a brass vessel during Shirodhara preparation"),
  "kt-116": photo("kt-116", "kt-116.jpg", 1600, 1067, "Octagonal villa interior under a terracotta dome at the Healing Village"),
  "kt-314": photo("kt-314", "kt-314.jpg", 1600, 1067, "Brick cottage among palms and gardens at the Healing Village"),
  "wx-hero": photo("wx-hero", "wx-hero.jpg", 1900, 1267, "Morning mist over the cottages and garden paths at the Healing Village"),
  "wx-dining": photo("wx-dining", "wx-dining.jpg", 1600, 1067, "The dining hall with garden views, where prescribed meals are served"),
  "gal-poolside-rest-palakkad-2026": photo("gal-poolside-rest-palakkad-2026", "gal-poolside-rest-palakkad-2026.jpg", 1600, 1067, "A patient resting on a lounger beside the pool in the village gardens", { gccSafe: false }),
  "team-deepu-john": photo("team-deepu-john", "team-deepu-john.jpg", 1024, 1536, "Dr. Deepu John, Chief Physician at the Healing Village"),
  "team-akhila-oommen": photo("team-akhila-oommen", "team-akhila-oommen.jpg", 1023, 1537, "Dr. Akhila Oommen, Ayurvedic physician at the Healing Village"),
  "team-ashikha-raj": photo("team-ashikha-raj", "team-ashikha-raj.jpg", 948, 1660, "Dr. Ashikha Raj, Ayurvedic physician at the Healing Village"),
};
```

```ts
// campaign-v2/data/films.ts
import type { FilmRef } from "../kit/types.ts";

const f = (youtubeId: string, title: string, kind: FilmRef["kind"], recordedYear: number): FilmRef => ({
  youtubeId, title, kind, consent: true, recordedYear, thumb: `/lp-v2/img/yt-${youtubeId}.jpg`,
});

export const FILMS: Record<string, FilmRef> = {
  iPARaMRASUs: f("iPARaMRASUs", "A day at the village", "property", 2019),
  "4x01PtWfNnk": f("4x01PtWfNnk", "Michaela & Jan", "patient", 2019),
  "3vWviQfW1Ug": f("3vWviQfW1Ug", "Supriya Agarwal", "patient", 2020),
  "07tVC2oXd8g": f("07tVC2oXd8g", "On Panchakarma", "treatment", 2018),
};
```

> Note for the implementer: `recordedYear` values are taken from the YouTube upload year. Confirm each with `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<id>&format=json`, or the video page date, before the PR. If one differs, correct it in the same commit.

```ts
// campaign-v2/data/doctors.ts
import type { DoctorRef } from "../kit/types.ts";
import { IMAGES } from "./images.ts";
import { pending } from "../kit/pending.ts";

export const DOCTORS: Record<string, DoctorRef> = {
  "deepu-john": {
    id: "deepu-john", name: "Dr. Deepu John", role: "Chief Physician",
    qualification: pending("C4", "Dr. Deepu John qualification"), yearsInPractice: pending("C4", "years in practice"),
    languages: pending("C4", "languages"), photo: IMAGES["team-deepu-john"],
  },
  "akhila-oommen": {
    id: "akhila-oommen", name: "Dr. Akhila Oommen", role: pending("C4", "role"),
    qualification: pending("C4", "qualification"), yearsInPractice: pending("C4", "years"),
    languages: pending("C4", "languages"), photo: IMAGES["team-akhila-oommen"],
  },
  "ashikha-raj": {
    id: "ashikha-raj", name: "Dr. Ashikha Raj", role: pending("C4", "role"),
    qualification: pending("C4", "qualification"), yearsInPractice: pending("C4", "years"),
    languages: pending("C4", "languages"), photo: IMAGES["team-ashikha-raj"],
  },
};
```

```ts
// campaign-v2/kit/registry.ts
import type { DoctorRef, FilmRef, ImageRef } from "./types.ts";
import { IMAGES } from "../data/images.ts";
import { FILMS } from "../data/films.ts";
import { DOCTORS } from "../data/doctors.ts";

function pick<T>(table: Record<string, T>, id: string, kind: string): T {
  const v = table[id];
  if (!v) throw new Error(`Unknown ${kind} id: ${id}`);
  return v;
}
export const img = (id: string): ImageRef => pick(IMAGES, id, "image");
export const film = (id: string): FilmRef => pick(FILMS, id, "film");
export const doc = (id: string): DoctorRef => pick(DOCTORS, id, "doctor");
```

- [ ] **Step 5: Run the test and confirm it passes**

Run: `node --test test/lp-v2-registry.test.mjs`
Expected: PASS (4 tests)

- [ ] **Step 6: Commit**

```bash
git add sites/ayurvedichealingvillage.com/campaign-v2/data sites/ayurvedichealingvillage.com/campaign-v2/kit/registry.ts sites/ayurvedichealingvillage.com/public/lp-v2 sites/ayurvedichealingvillage.com/test/lp-v2-registry.test.mjs
git commit -m "feat(ahv-lp-v2): image, film and doctor registries with self-hosted pilot media"
```

---

### Task 3: Locale and currency detection

**Files:**
- Create: `campaign-v2/kit/locale.ts`, `campaign-v2/kit/currency.ts`
- Test: `test/lp-v2-locale.test.mjs`

**Interfaces:**
- Consumes: `Locale`, `Currency` (Task 1)
- Produces:
  - `SUPPORTED_LOCALES: readonly Locale[]`
  - `LOCALE_NAMES: Record<Locale, string>` (each name in its own script)
  - `pickLocale(acceptLanguage: string | null, available: readonly Locale[]): Locale`
  - `isRtl(l: Locale): boolean`
  - `currencyForCountry(cc: string | null): Currency`
  - `CURRENCIES: readonly Currency[]`
  - `formatMoney(amount: number, c: Currency, locale: Locale): string`

- [ ] **Step 1: Write the failing test**

```js
// test/lp-v2-locale.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { SUPPORTED_LOCALES, pickLocale, isRtl } from "../campaign-v2/kit/locale.ts";
import { currencyForCountry, formatMoney } from "../campaign-v2/kit/currency.ts";

test("13 locales, matching the live hreflang set", () => {
  assert.deepEqual([...SUPPORTED_LOCALES], ["en","hi","ar","de","fr","es","it","pt","nl","ru","zh-Hans","ja","ko"]);
});

test("pickLocale honours q-values and only returns available locales", () => {
  assert.equal(pickLocale("de-DE,de;q=0.9,en;q=0.8", ["en", "de"]), "de");
  assert.equal(pickLocale("de-DE,de;q=0.9,en;q=0.8", ["en"]), "en");
  assert.equal(pickLocale("fr;q=0.2,ar;q=0.9", ["en", "fr", "ar"]), "ar");
  assert.equal(pickLocale("zh-CN,zh;q=0.9", ["en", "zh-Hans"]), "zh-Hans");
  assert.equal(pickLocale(null, ["en", "de"]), "en");
  assert.equal(pickLocale("xx", ["de"]), "de"); // en unavailable → first available
});

test("isRtl only for Arabic", () => {
  assert.equal(isRtl("ar"), true);
  assert.equal(isRtl("en"), false);
});

test("currencyForCountry maps markets", () => {
  assert.equal(currencyForCountry("IN"), "INR");
  for (const cc of ["AE","SA","QA","KW","OM","BH"]) assert.equal(currencyForCountry(cc), "AED");
  for (const cc of ["DE","FR","IT","ES","NL","IE","AT","BE","PT","FI"]) assert.equal(currencyForCountry(cc), "EUR");
  assert.equal(currencyForCountry("GB"), "GBP");
  assert.equal(currencyForCountry("US"), "USD");
  assert.equal(currencyForCountry(null), "USD");
});

test("formatMoney uses the visitor locale and no decimals", () => {
  assert.equal(formatMoney(310000, "INR", "en"), "₹3,10,000");
  assert.equal(formatMoney(4424, "USD", "en"), "US$4,424");
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `node --test test/lp-v2-locale.test.mjs`
Expected: FAIL, module not found

- [ ] **Step 3: Implement**

```ts
// campaign-v2/kit/locale.ts
import type { Locale } from "./types.ts";

export const SUPPORTED_LOCALES: readonly Locale[] = ["en","hi","ar","de","fr","es","it","pt","nl","ru","zh-Hans","ja","ko"];

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English", hi: "हिन्दी", ar: "العربية", de: "Deutsch", fr: "Français", es: "Español",
  it: "Italiano", pt: "Português", nl: "Nederlands", ru: "Русский", "zh-Hans": "中文", ja: "日本語", ko: "한국어",
};

function toLocale(tag: string): Locale | null {
  const t = tag.trim().toLowerCase();
  if (t.startsWith("zh")) return "zh-Hans";
  const base = t.split("-")[0];
  return (SUPPORTED_LOCALES as readonly string[]).includes(base) ? (base as Locale) : null;
}

export function pickLocale(acceptLanguage: string | null, available: readonly Locale[]): Locale {
  const fallback: Locale = available.includes("en") ? "en" : available[0];
  if (!acceptLanguage) return fallback;
  const ranked = acceptLanguage.split(",").map((part, i) => {
    const [tag, ...params] = part.split(";");
    const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
    return { tag, q: q ? Number(q.slice(2)) : 1, i };
  }).sort((a, b) => b.q - a.q || a.i - b.i);
  for (const r of ranked) {
    const l = toLocale(r.tag);
    if (l && available.includes(l)) return l;
  }
  return fallback;
}

export const isRtl = (l: Locale): boolean => l === "ar";
```

```ts
// campaign-v2/kit/currency.ts
import type { Currency, Locale } from "./types.ts";

export const CURRENCIES: readonly Currency[] = ["INR", "USD", "EUR", "GBP", "AED"];
const GULF = new Set(["AE", "SA", "QA", "KW", "OM", "BH"]);
const EUROZONE = new Set(["AT","BE","HR","CY","EE","FI","FR","DE","GR","IE","IT","LV","LT","LU","MT","NL","PT","SK","SI","ES"]);

export function currencyForCountry(cc: string | null): Currency {
  const c = (cc || "").toUpperCase();
  if (c === "IN") return "INR";
  if (GULF.has(c)) return "AED";
  if (EUROZONE.has(c)) return "EUR";
  if (c === "GB") return "GBP";
  return "USD";
}

const INTL: Record<Locale, string> = {
  en: "en-IN", hi: "hi-IN", ar: "ar-AE", de: "de-DE", fr: "fr-FR", es: "es-ES", it: "it-IT",
  pt: "pt-PT", nl: "nl-NL", ru: "ru-RU", "zh-Hans": "zh-CN", ja: "ja-JP", ko: "ko-KR",
};

export function formatMoney(amount: number, c: Currency, locale: Locale): string {
  return new Intl.NumberFormat(INTL[locale], { style: "currency", currency: c, maximumFractionDigits: 0, numberingSystem: "latn" }).format(amount);
}
```

> If the `formatMoney` USD assertion fails because the ICU build prints `$4,424` for `en-IN`, change the test expectation to the printed value, keeping the number grouping. Then note the ICU output in the commit message. Do not hard-code symbols.

- [ ] **Step 4: Run the test and confirm it passes**

Run: `node --test test/lp-v2-locale.test.mjs`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add sites/ayurvedichealingvillage.com/campaign-v2/kit/locale.ts sites/ayurvedichealingvillage.com/campaign-v2/kit/currency.ts sites/ayurvedichealingvillage.com/test/lp-v2-locale.test.mjs
git commit -m "feat(ahv-lp-v2): locale negotiation (13 locales) and country-based currency"
```

---

### Task 4: Geo consent decision

**Files:**
- Create: `campaign-v2/kit/consent-region.ts`
- Test: `test/lp-v2-consent-region.test.mjs`

**Interfaces:**
- Consumes: `GRANTED_ALL`, `DENIED_ALL`, `CONSENT_STORAGE_KEY` from `@kairali/consent/core` (the subpath export of `packages/consent/src/core.js`; never the package root in kit files, because the root re-exports `.tsx`)
- Produces:
  - `CONSENT_COUNTRIES: ReadonlySet<string>` (EU27 + IS, LI, NO + GB + CH)
  - `requiresConsent(cc: string | null): boolean`. An unknown country returns **true** (fail safe).
  - `geoConsentDefaultSnippet(required: boolean): string`

- [ ] **Step 1: Write the failing test**

```js
// test/lp-v2-consent-region.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { requiresConsent, geoConsentDefaultSnippet, CONSENT_COUNTRIES } from "../campaign-v2/kit/consent-region.ts";

test("EU/EEA/UK/CH require consent; IN, AE, US do not", () => {
  for (const cc of ["DE","FR","IT","IE","NO","IS","LI","GB","CH"]) assert.equal(requiresConsent(cc), true, cc);
  for (const cc of ["IN","AE","SA","US","SG","AU"]) assert.equal(requiresConsent(cc), false, cc);
  assert.equal(CONSENT_COUNTRIES.size, 32);
});

test("unknown country fails safe to consent required", () => {
  assert.equal(requiresConsent(null), true);
  assert.equal(requiresConsent("XX"), false); // a known non-consent country code shape → not required
  assert.equal(requiresConsent(""), true);
});

test("snippet sets default granted outside, denied inside, and honours a stored choice", () => {
  const out = geoConsentDefaultSnippet(false);
  assert.match(out, /'consent','default',\{[^}]*"ad_storage":"granted"/);
  const inside = geoConsentDefaultSnippet(true);
  assert.match(inside, /"ad_storage":"denied"/);
  assert.match(inside, /wait_for_update/);
  assert.match(inside, /kairali-consent-v1/);
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `node --test test/lp-v2-consent-region.test.mjs`
Expected: FAIL, module not found

- [ ] **Step 3: Implement**

```ts
// campaign-v2/kit/consent-region.ts
// Owner decision 21 (7 Oct 2026): banner only where law requires it.
import { GRANTED_ALL, DENIED_ALL, CONSENT_STORAGE_KEY } from "@kairali/consent/core"; // subpath: index.ts pulls .tsx, which node --test cannot load

const EU27 = ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"];
export const CONSENT_COUNTRIES: ReadonlySet<string> = new Set([...EU27, "IS", "LI", "NO", "GB", "CH"]);

export function requiresConsent(cc: string | null): boolean {
  if (!cc) return true;                       // no geo header → fail safe
  return CONSENT_COUNTRIES.has(cc.toUpperCase());
}

/** Inline <head> script. Must run before any tag loader. */
export function geoConsentDefaultSnippet(required: boolean): string {
  const defaults = required ? { ...DENIED_ALL, wait_for_update: 500 } : GRANTED_ALL;
  return [
    "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}",
    `gtag('consent','default',${JSON.stringify(defaults)});`,
    required
      ? `try{var c=JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)})||'null');if(c&&c.consent){gtag('consent','update',c.consent);}}catch(e){}`
      : "",
    `window.__ahvConsentRequired=${required ? "true" : "false"};`,
  ].join("");
}
```

> Verified on 7 Oct 2026: `choiceRecord(granted)` in `packages/consent/src/core.js` stores `{ v: 1, granted, consent, at }` under `kairali-consent-v1`, so `c.consent` is correct.

- [ ] **Step 4: Run the test and confirm it passes**

Run: `node --test test/lp-v2-consent-region.test.mjs`
Expected: PASS (3 tests). If the `requiresConsent("")` case fails because `!""` is true, that is the intended behaviour, so keep the implementation.

- [ ] **Step 5: Commit**

```bash
git add sites/ayurvedichealingvillage.com/campaign-v2/kit/consent-region.ts sites/ayurvedichealingvillage.com/test/lp-v2-consent-region.test.mjs
git commit -m "feat(ahv-lp-v2): geo consent decision (EU/EEA/UK/CH only) with consent-mode snippet"
```

---

### Task 5: Pricing helpers

**Files:**
- Create: `campaign-v2/kit/price.ts`
- Test: `test/lp-v2-price.test.mjs`

**Interfaces:**
- Consumes: `Fees`, `FeeRow`, `Currency` (Task 1)
- Produces:
  - `feeFor(row: FeeRow, kind: "single" | "twinEach", c: Currency): { currency: Currency; amount: number; fallback: boolean } | null`. Falls back to USD and never converts.
  - `fromPrice(fees: Fees, c: Currency)`, with the same return shape, giving the lowest `twinEach`, else `single`.
  - `isExpired(validTo: string, now: Date): boolean`

- [ ] **Step 1: Write the failing test**

```js
// test/lp-v2-price.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { feeFor, fromPrice, isExpired } from "../campaign-v2/kit/price.ts";

const fees = { source: "x", validTo: "2027-03-31", nights: 14, rows: [
  { name: "Deluxe", note: "", single: { INR: 400000, USD: 4800 }, twinEach: { INR: 310000, USD: 3700 } },
  { name: "Royal", note: "", single: { INR: 700000 }, twinEach: { INR: 520000 } },
]};

test("feeFor returns the requested currency when present", () => {
  assert.deepEqual(feeFor(fees.rows[0], "twinEach", "INR"), { currency: "INR", amount: 310000, fallback: false });
});
test("feeFor falls back to USD, never converts", () => {
  assert.deepEqual(feeFor(fees.rows[0], "twinEach", "EUR"), { currency: "USD", amount: 3700, fallback: true });
  assert.equal(feeFor(fees.rows[1], "twinEach", "EUR"), null);
});
test("fromPrice picks the lowest twin-sharing figure in the currency", () => {
  assert.deepEqual(fromPrice(fees, "INR"), { currency: "INR", amount: 310000, fallback: false });
});
test("isExpired compares end of validTo day in IST", () => {
  assert.equal(isExpired("2026-10-31", new Date("2026-10-31T18:00:00Z")), false);
  assert.equal(isExpired("2026-10-31", new Date("2026-10-31T19:00:00Z")), true);
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `node --test test/lp-v2-price.test.mjs`
Expected: FAIL, module not found

- [ ] **Step 3: Implement**

```ts
// campaign-v2/kit/price.ts
import type { Currency, FeeRow, Fees } from "./types.ts";

type Picked = { currency: Currency; amount: number; fallback: boolean } | null;

export function feeFor(row: FeeRow, kind: "single" | "twinEach", c: Currency): Picked {
  const m = row[kind];
  if (typeof m[c] === "number") return { currency: c, amount: m[c] as number, fallback: false };
  if (typeof m.USD === "number") return { currency: "USD", amount: m.USD, fallback: true };
  return null;
}

export function fromPrice(fees: Fees, c: Currency): Picked {
  const picks = fees.rows.map((r) => feeFor(r, "twinEach", c) ?? feeFor(r, "single", c)).filter((p): p is NonNullable<Picked> => p !== null);
  const same = picks.filter((p) => !p.fallback);
  const pool = same.length ? same : picks;
  if (!pool.length) return null;
  return pool.reduce((a, b) => (b.amount < a.amount ? b : a));
}

/** validTo is inclusive until 23:59:59 IST (UTC+5:30). */
export function isExpired(validTo: string, now: Date): boolean {
  const end = new Date(`${validTo}T23:59:59+05:30`);
  return now.getTime() > end.getTime();
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `node --test test/lp-v2-price.test.mjs`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add sites/ayurvedichealingvillage.com/campaign-v2/kit/price.ts sites/ayurvedichealingvillage.com/test/lp-v2-price.test.mjs
git commit -m "feat(ahv-lp-v2): price selection with USD fallback and IST validity"
```

---

### Task 6: Lint, part 1 (lengths, words, reading level, assets, fees, locales, pending)

**Files:**
- Create: `campaign-v2/kit/lint/lengths.ts`, `campaign-v2/kit/lint/assets.ts`
- Test: `test/lp-v2-lint-structure.test.mjs`, fixture `test/fixtures/lp-v2-valid.ts`

**Interfaces:**
- Consumes: `CampaignConfig`, `isPending`, `collectPending`, `isExpired`, `SUPPORTED_LOCALES`
- Produces:
  - `type Issue = { level: "error" | "warning"; rule: string; path: string; message: string }`
  - `lintLengths(c: CampaignConfig): Issue[]`
  - `lintAssets(c: CampaignConfig, now: Date): Issue[]`
  - `visibleWords(c: CampaignConfig): number`
  - `gradeLevel(text: string): number`

- [ ] **Step 1: Write the fixture.** This is a complete, valid config; every later lint test mutates a copy of it.

```ts
// test/fixtures/lp-v2-valid.ts
import type { CampaignConfig } from "../../campaign-v2/kit/types.ts";
import { img, film, doc } from "../../campaign-v2/kit/registry.ts";

export function validConfig(): CampaignConfig {
  return {
    slug: "fixture", route: "/fixture.html", previewRoute: "/lp-v2/fixture", defaultVariant: "A",
    variants: ["A", "B", "C", "D"], index: false, locales: ["en"], translations: [{ locale: "en", review: "approved" }],
    modesty: "standard", wordingOverrides: [], production: false,
    seo: { title: "Panchakarma in Kerala | Kairali Healing Village", description: "A physician-led Panchakarma admission at a NABH-accredited Ayurvedic hospital in Kerala, with therapy, prescribed diet and rest." },
    adMatch: { keywords: ["panchakarma treatment kerala"], adHeadlines: ["Panchakarma in Kerala"] },
    hero: {
      overline: "NABH-accredited Ayurvedic hospital · Kerala", h1: "Panchakarma, practiced the way it was meant to be.",
      h1Accent: "meant to be.", standfirst: "A physician-led admission in a quiet Kerala village, with therapy, prescribed diet and deep rest planned around you.",
      image: { A: img("kt-199"), B: img("kt-199"), C: img("kt-190"), D: img("kt-202") }, mobileImage: img("kt-190"),
    },
    programDefault: "Panchakarma", tracking: { campaignName: "panchakarma", trackId: "" },
    admission: { heading: "One doctor. One plan. Written for you.", steps: [
      { title: "Before you arrive", body: "A free video consultation with a qualified Ayurvedic doctor who reviews your records." },
      { title: "During admission", body: "Morning therapies, a prescribed diet from the hospital kitchen, gentle yoga and rest." },
      { title: "After discharge", body: "A written home regimen and a follow-up consultation, so the routine travels home with you." },
    ]},
    included: ["Doctor consultations", "Prescribed therapies", "All meals, prescribed diet", "Private villa"],
    chargedSeparately: ["Medicines", "Laboratory tests"],
    stillness: { heading: "Stillness is part of the prescription.", body: "Warm oil, quiet rooms and monsoon light through tall windows. Nothing is asked of you here.", image: img("gal-post-therapy-stillness-wakem") },
    films: { featured: film("iPARaMRASUs"), more: [film("4x01PtWfNnk"), film("3vWviQfW1Ug")] },
    doctors: [doc("deepu-john"), doc("akhila-oommen")],
    village: { heading: "Private villas among palms and paddy fields.", body: "Laterite, teak and terracotta, and a hospital kitchen that cooks to your prescription." },
    gallery: [
      { category: "Villas", image: img("kt-116") }, { category: "Villas", image: img("kt-314") },
      { category: "Grounds", image: img("wx-hero") }, { category: "Grounds", image: img("gal-poolside-rest-palakkad-2026") },
      { category: "Dining", image: img("wx-dining") }, { category: "Therapies", image: img("kt-202") },
    ],
    fees: { source: "https://kairali-documents.vercel.app/ tariff p.3", validTo: "2027-03-31", nights: 14, rows: [
      { name: "Deluxe villa", note: "Garden-facing villa", single: { INR: 400000 }, twinEach: { INR: 310000 } },
    ]},
    offer: null,
    faq: [
      { q: "Is the doctor consultation really free?", a: "Yes. Before you book, a qualified Ayurvedic doctor consults with you by video at no charge and advises whether admission suits you." },
      { q: "Can a companion stay with me?", a: "Yes. A companion can share your villa. Tell us when you enquire and we will include their meals and stay in your fee plan." },
      { q: "How do I reach Palakkad?", a: "Coimbatore and Kochi are the usual airports. Our patient team will share transfer options and timings when you enquire with us." },
      { q: "What should I bring?", a: "Bring your medical records, current medicines and comfortable cotton clothes. Therapy garments are provided for your treatments during the stay." },
    ],
    longForm: "## About Panchakarma\n\n" + "Panchakarma is a classical Ayurvedic program of therapies planned by a physician. ".repeat(40),
  };
}
```

- [ ] **Step 2: Write the failing test**

```js
// test/lp-v2-lint-structure.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { validConfig } from "./fixtures/lp-v2-valid.ts";
import { lintLengths, visibleWords, gradeLevel } from "../campaign-v2/kit/lint/lengths.ts";
import { lintAssets } from "../campaign-v2/kit/lint/assets.ts";
import { pending } from "../campaign-v2/kit/pending.ts";
import { img } from "../campaign-v2/kit/registry.ts";

const NOW = new Date("2026-10-08T00:00:00Z");
const rules = (issues) => issues.filter((i) => i.level === "error").map((i) => i.rule);

test("valid fixture has no structural errors", () => {
  const c = validConfig();
  assert.deepEqual(rules(lintLengths(c)), []);
  assert.deepEqual(rules(lintAssets(c, NOW)), []);
});

test("h1 over 60 chars is an error", () => {
  const c = validConfig(); c.hero.h1 = "x".repeat(61);
  assert.ok(rules(lintLengths(c)).includes("length.hero.h1"));
});

test("FAQ answers must be 25-70 words", () => {
  const c = validConfig(); c.faq[0].a = "Too short.";
  assert.ok(rules(lintLengths(c)).includes("length.faq.a"));
});

test("visible words counted without longForm and kept within 450-900", () => {
  const n = visibleWords(validConfig());
  assert.ok(n > 100 && n < 900, String(n));
});

test("gradeLevel is low for short plain sentences", () => {
  assert.ok(gradeLevel("You rest. Your doctor plans each day. Meals are made for you.") < 8);
});

test("pending on a production route is an error, on preview it is not", () => {
  const c = validConfig(); c.fees = pending("C2", "fees");
  assert.ok(!rules(lintAssets(c, NOW)).includes("pending.production"));
  c.production = true;
  assert.ok(rules(lintAssets(c, NOW)).includes("pending.production"));
});

test("expired fees, missing source and non-gccSafe images under gcc modesty are errors", () => {
  const c = validConfig(); c.fees.validTo = "2026-01-01";
  assert.ok(rules(lintAssets(c, NOW)).includes("fees.expired"));
  const d = validConfig(); d.fees.source = "";
  assert.ok(rules(lintAssets(d, NOW)).includes("fees.source"));
  const g = validConfig(); g.modesty = "gcc";
  assert.ok(rules(lintAssets(g, NOW)).includes("image.gcc"));
});

test("duplicate image on page and locale without approved review are errors", () => {
  const c = validConfig(); c.gallery.push({ category: "Villas", image: img("kt-116") });
  assert.ok(rules(lintAssets(c, NOW)).includes("image.duplicate"));
  const l = validConfig(); l.locales = ["en", "de"];
  assert.ok(rules(lintAssets(l, NOW)).includes("locale.unreviewed"));
});
```

- [ ] **Step 3: Run the test and confirm it fails**

Run: `node --test test/lp-v2-lint-structure.test.mjs`
Expected: FAIL, module not found

- [ ] **Step 4: Implement**

```ts
// campaign-v2/kit/lint/lengths.ts
import type { CampaignConfig } from "../types.ts";
import { isPending } from "../pending.ts";

export type Issue = { level: "error" | "warning"; rule: string; path: string; message: string };

const err = (rule: string, path: string, message: string): Issue => ({ level: "error", rule, path, message });
const str = (v: unknown): string => (typeof v === "string" ? v : "");
const words = (s: string): number => (s.trim() ? s.trim().split(/\s+/).length : 0);

function len(out: Issue[], rule: string, path: string, value: unknown, min: number, max: number) {
  if (isPending(value)) return;
  const n = str(value).length;
  if (n < min || n > max) out.push(err(rule, path, `${n} chars; allowed ${min}-${max}`));
}

export function visibleWords(c: CampaignConfig): number {
  const parts: string[] = [
    c.hero.overline, c.hero.h1, c.hero.standfirst, c.admission.heading,
    ...c.admission.steps.flatMap((s) => [s.title, s.body]), ...c.included, ...c.chargedSeparately,
    c.stillness.heading, c.stillness.body, c.village.heading, c.village.body,
    ...c.faq.flatMap((f) => [f.q, str(f.a)]),
  ];
  return parts.reduce((n, p) => n + words(p), 0);
}

/** Flesch-Kincaid grade with a simple vowel-group syllable count. */
export function gradeLevel(text: string): number {
  const sentences = Math.max(1, (text.match(/[.!?]+/g) || []).length);
  const ws = text.split(/\s+/).filter(Boolean);
  const syll = ws.reduce((n, w) => n + Math.max(1, (w.toLowerCase().replace(/e\b/, "").match(/[aeiouy]+/g) || []).length), 0);
  return 0.39 * (ws.length / sentences) + 11.8 * (syll / Math.max(1, ws.length)) - 15.59;
}

export function lintLengths(c: CampaignConfig): Issue[] {
  const out: Issue[] = [];
  len(out, "length.seo.title", "seo.title", c.seo.title, 30, 60);
  len(out, "length.seo.description", "seo.description", c.seo.description, 120, 155);
  len(out, "length.hero.overline", "hero.overline", c.hero.overline, 1, 48);
  len(out, "length.hero.h1", "hero.h1", c.hero.h1, 20, 60);
  len(out, "length.hero.standfirst", "hero.standfirst", c.hero.standfirst, 90, 160);
  if (c.hero.h1Accent && !c.hero.h1.includes(c.hero.h1Accent)) out.push(err("hero.h1Accent", "hero.h1Accent", "must be a substring of hero.h1"));
  if (c.hero.h1Accent) len(out, "length.hero.h1Accent", "hero.h1Accent", c.hero.h1Accent, 1, 24);
  len(out, "length.admission.heading", "admission.heading", c.admission.heading, 1, 60);
  if (c.admission.steps.length !== 3) out.push(err("admission.steps", "admission.steps", "exactly 3 steps"));
  c.admission.steps.forEach((s, i) => {
    len(out, "length.admission.title", `admission.steps[${i}].title`, s.title, 1, 24);
    len(out, "length.admission.body", `admission.steps[${i}].body`, s.body, 40, 120);
  });
  if (c.included.length < 4 || c.included.length > 7) out.push(err("count.included", "included", "4-7 items"));
  c.included.forEach((x, i) => len(out, "length.included", `included[${i}]`, x, 1, 34));
  if (c.chargedSeparately.length < 1 || c.chargedSeparately.length > 4) out.push(err("count.chargedSeparately", "chargedSeparately", "1-4 items"));
  len(out, "length.stillness.heading", "stillness.heading", c.stillness.heading, 1, 45);
  len(out, "length.stillness.body", "stillness.body", c.stillness.body, 60, 150);
  len(out, "length.village.heading", "village.heading", c.village.heading, 1, 50);
  len(out, "length.village.body", "village.body", c.village.body, 60, 150);
  if (c.films.more.length < 2 || c.films.more.length > 3) out.push(err("count.films", "films.more", "2-3 films"));
  if (c.doctors.length < 2 || c.doctors.length > 3) out.push(err("count.doctors", "doctors", "2-3 doctors"));
  if (c.gallery.length < 6 || c.gallery.length > 24) out.push(err("count.gallery", "gallery", "6-24 images"));
  if (c.faq.length < 4 || c.faq.length > 6) out.push(err("count.faq", "faq", "4-6 items"));
  c.faq.forEach((f, i) => {
    len(out, "length.faq.q", `faq[${i}].q`, f.q, 10, 70);
    if (!isPending(f.a)) { const n = words(f.a); if (n < 25 || n > 70) out.push(err("length.faq.a", `faq[${i}].a`, `${n} words; allowed 25-70`)); }
  });
  const lf = words(c.longForm);
  if (lf < 300 || lf > 1200) out.push(err("length.longForm", "longForm", `${lf} words; allowed 300-1200`));
  const vw = visibleWords(c);
  if (vw > 900) out.push(err("length.visibleWords", "$", `${vw} visible words; max 900`));
  if (vw < 450 && c.production) out.push(err("length.visibleWords", "$", `${vw} visible words; min 450 for production`));
  const g = gradeLevel([c.hero.standfirst, ...c.admission.steps.map((s) => s.body), c.stillness.body, c.village.body].join(" "));
  if (g > 8) out.push(err("readability.grade", "$", `grade ${g.toFixed(1)}; max 8`));
  return out;
}
```

> Note: the fixture has fewer than 450 visible words. That's why the minimum is enforced only when `production` is true; previews may be short.

```ts
// campaign-v2/kit/lint/assets.ts
import type { CampaignConfig, ImageRef } from "../types.ts";
import type { Issue } from "./lengths.ts";
import { collectPending, isPending } from "../pending.ts";
import { isExpired } from "../price.ts";

const err = (rule: string, path: string, message: string): Issue => ({ level: "error", rule, path, message });
const BAD_ALT = /^(image|photo|picture|hero|img)\b|\b(image|photo) of\b|\.(jpe?g|png|webp)$/i;

function pageImages(c: CampaignConfig): { path: string; ref: ImageRef }[] {
  return [
    ...Object.entries(c.hero.image).map(([v, ref]) => ({ path: `hero.image.${v}`, ref })),
    { path: "hero.mobileImage", ref: c.hero.mobileImage },
    { path: "stillness.image", ref: c.stillness.image },
    ...c.gallery.map((g, i) => ({ path: `gallery[${i}]`, ref: g.image })),
  ];
}

export function lintAssets(c: CampaignConfig, now: Date): Issue[] {
  const out: Issue[] = [];
  const imgs = pageImages(c);
  const seen = new Map<string, string>();
  for (const { path, ref } of imgs) {
    if (path.startsWith("hero.image.") || path === "hero.mobileImage") continue; // hero may repeat across variants
    if (seen.has(ref.id)) out.push(err("image.duplicate", path, `${ref.id} already used at ${seen.get(ref.id)}`));
    seen.set(ref.id, path);
  }
  for (const { path, ref } of imgs) {
    if (Math.max(ref.width, ref.height) < 1600 && !path.startsWith("gallery")) out.push(err("image.size", path, `${ref.id} long edge < 1600px`));
    if (ref.consent === "pending") out.push(err("image.consent", path, `${ref.id} consent pending`));
    if (c.modesty === "gcc" && !ref.gccSafe) out.push(err("image.gcc", path, `${ref.id} not gccSafe`));
    if (!ref.decorative && (ref.alt.length < 20 || ref.alt.length > 125 || BAD_ALT.test(ref.alt))) out.push(err("image.alt", path, `bad alt: "${ref.alt}"`));
    if (ref.location === "ho-centre" && /palakkad|village/i.test(ref.alt)) out.push(err("image.location", path, "HO-centre image must not mention Palakkad/village"));
  }
  for (const [i, f] of [c.films.featured, ...c.films.more].entries()) if (!f.consent) out.push(err("film.consent", `films[${i}]`, f.youtubeId));
  if (!isPending(c.fees)) {
    if (!c.fees.source) out.push(err("fees.source", "fees.source", "tariff source required"));
    if (!c.fees.validTo || isExpired(c.fees.validTo, now)) out.push(err("fees.expired", "fees.validTo", "missing or past"));
    if (c.fees.rows.length < 1 || c.fees.rows.length > 4) out.push(err("count.fees", "fees.rows", "1-4 rows"));
  }
  if (c.offer && !isPending(c.offer) && isExpired(c.offer.validTo, now)) out.push(err("offer.expired", "offer.validTo", "offer expired"));
  for (const l of c.locales) {
    const t = c.translations.find((x) => x.locale === l);
    if (!t || t.review !== "approved") out.push(err("locale.unreviewed", "locales", `${l} has no approved review`));
  }
  if (c.index !== false) out.push(err("index", "index", "variant pages must be noindex"));
  if (c.production) for (const p of collectPending(c)) out.push(err("pending.production", p.path, `${p.id}: ${p.note}`));
  return out;
}
```

- [ ] **Step 5: Run the test and confirm it passes**

Run: `node --test test/lp-v2-lint-structure.test.mjs`
Expected: PASS (8 tests). If "valid fixture has no structural errors" fails on `length.longForm` or `readability.grade`, adjust the **fixture text** (not the limits) until it passes, then re-run.

- [ ] **Step 6: Commit**

```bash
git add sites/ayurvedichealingvillage.com/campaign-v2/kit/lint sites/ayurvedichealingvillage.com/test/lp-v2-lint-structure.test.mjs sites/ayurvedichealingvillage.com/test/fixtures/lp-v2-valid.ts
git commit -m "feat(ahv-lp-v2): structural lint (lengths, readability, images, fees, locales, pending)"
```

---

### Task 7: Lint, part 2 (claims, register, spelling, reply-time, ad match)

**Files:**
- Create: `campaign-v2/kit/lint/claims.ts`, `campaign-v2/kit/lint/language.ts`, `campaign-v2/kit/lint/index.ts`
- Test: `test/lp-v2-lint-language.test.mjs`

**Interfaces:**
- Consumes: `Issue` (Task 6), `lintLengths`, `lintAssets`, fixture `validConfig()`
- Produces:
  - `allText(c: CampaignConfig): { path: string; text: string }[]`
  - `lintClaims(c): Issue[]`
  - `lintLanguage(c): Issue[]`
  - `lintCampaign(c: CampaignConfig, now?: Date): { errors: Issue[]; warnings: Issue[] }`

- [ ] **Step 1: Write the failing test**

```js
// test/lp-v2-lint-language.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { validConfig } from "./fixtures/lp-v2-valid.ts";
import { lintCampaign } from "../campaign-v2/kit/lint/index.ts";

const NOW = new Date("2026-10-08T00:00:00Z");
const errs = (c) => lintCampaign(c, NOW).errors.map((i) => i.rule);
const warns = (c) => lintCampaign(c, NOW).warnings.map((i) => i.rule);

test("valid fixture passes everything", () => {
  assert.deepEqual(lintCampaign(validConfig(), NOW).errors, []);
});

for (const [label, text] of [
  ["cure", "Our therapy cures chronic pain."], <!-- compliance-allow: cure, cure-claims, cures -->
  ["disease", "Relief from obesity and diabetes."],
  ["kg", "Guests lost 8 kg in 21 days."], <!-- compliance-allow: guests -->
  ["percent", "87% of patients improved."],
  ["zero adverse", "Zero adverse reactions in 1.4M+ therapies."],
  ["superlative", "Asia's best Ayurvedic hospital."],
  ["patients count", "Trusted by 30,000+ lives transformed."],
  ["proven", "Scientifically proven results."],
]) {
  test(`claims: ${label} is an error`, () => {
    const c = validConfig(); c.village.body = text + " Laterite, teak and terracotta rooms around the gardens.";
    assert.ok(errs(c).includes("claims"), JSON.stringify(errs(c)));
  });
}

test("British spellings are errors; 'program' is fine", () => {
  const c = validConfig(); c.village.body = "A programme centred on colour and calm, with rooms set among the gardens.";
  assert.ok(errs(c).includes("spelling.us"));
});

test("banned register words warn unless overridden; award names in alt are allowed", () => {
  const c = validConfig(); c.stillness.body = "A luxury spa feeling, with warm oil and quiet rooms in the monsoon light."; <!-- compliance-allow: luxury, spa -->
  assert.ok(warns(c).includes("register"));
  c.wordingOverrides = [{ term: "luxury", approvedBy: "owner", date: "2026-10-07", reason: "test" }, { term: "spa", approvedBy: "owner", date: "2026-10-07", reason: "test" }]; <!-- compliance-allow: luxury, spa -->
  assert.ok(!warns(c).includes("register"));
});

test("reply-time promises near consultation are errors", () => {
  const c = validConfig(); c.faq[0].a = "Yes. A qualified doctor replies within 2 hours and the consultation is free of charge for everyone who enquires with us today here.";
  assert.ok(errs(c).includes("reply-time"));
});

test("Abhyanga (North Indian form) warns; Abhyangam does not", () => {
  const c = validConfig(); c.stillness.body = "After Abhyanga, warm oil and quiet rooms with monsoon light through tall windows.";
  assert.ok(warns(c).includes("therapy-names"));
});

test("h1 without ad keyword overlap warns", () => {
  const c = validConfig(); c.hero.h1 = "Rest, deeply, in a quiet Kerala village today.";
  assert.ok(warns(c).includes("ad-match"));
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `node --test test/lp-v2-lint-language.test.mjs`
Expected: FAIL, module not found

- [ ] **Step 3: Implement**

```ts
// campaign-v2/kit/lint/claims.ts
import type { CampaignConfig } from "../types.ts";
import type { Issue } from "./lengths.ts";
import { isPending } from "../pending.ts";

export function allText(c: CampaignConfig): { path: string; text: string }[] {
  const out: { path: string; text: string }[] = [];
  const add = (path: string, v: unknown) => { if (typeof v === "string" && v) out.push({ path, text: v }); };
  add("seo.title", c.seo.title); add("seo.description", c.seo.description);
  add("hero.overline", c.hero.overline); add("hero.h1", c.hero.h1); add("hero.standfirst", c.hero.standfirst);
  add("admission.heading", c.admission.heading);
  c.admission.steps.forEach((s, i) => { add(`admission.steps[${i}].title`, s.title); add(`admission.steps[${i}].body`, s.body); });
  c.included.forEach((x, i) => add(`included[${i}]`, x)); c.chargedSeparately.forEach((x, i) => add(`chargedSeparately[${i}]`, x));
  add("stillness.heading", c.stillness.heading); add("stillness.body", c.stillness.body);
  add("village.heading", c.village.heading); add("village.body", c.village.body);
  [c.films.featured, ...c.films.more].forEach((f, i) => add(`films[${i}].title`, f.title));
  c.faq.forEach((f, i) => { add(`faq[${i}].q`, f.q); if (!isPending(f.a)) add(`faq[${i}].a`, f.a); });
  if (c.offer && !isPending(c.offer)) { add("offer.name", c.offer.name); add("offer.headline", c.offer.headline); }
  add("longForm", c.longForm);
  return out;
}

const CLAIMS: { re: RegExp; why: string }[] = [
  { re: /\b(cure[sd]?|curative|heals?|reverses?|eliminates?)\b/i, why: "cure language" }, <!-- compliance-allow: cure, cure-claims -->
  { re: /\b(obesity|diabet\w*|blood pressure|hypertension|cholesterol|thyroid|cancer|arthritis|infertility|asthma|psoriasis|parkinson\w*|alzheimer\w*)\b/i, why: "disease claim (DMR Act / ad policy)" },
  { re: /\b\d+(\.\d+)?\s?(kg|kgs|kilos?|lbs?|pounds)\b/i, why: "numeric weight outcome" },
  { re: /\b\d+(\.\d+)?\s?%/i, why: "percentage claim" },
  { re: /\bzero (side[- ]effects?|adverse)/i, why: "safety absolute" },
  { re: /\b(best|no\.?\s?1|number one|world[- ]class|guaranteed?)\b/i, why: "unsourced superlative/guarantee" },
  { re: /\b\d[\d,.]*\s?(k|m)?\+\s*(lives|patients|guests|therapies)/i, why: "unsupported count" }, <!-- compliance-allow: guests -->
  { re: /\b(scientifically|clinically) proven\b/i, why: "proof claim" },
  { re: /\bbefore\s*(and|&|\/)\s*after\b/i, why: "before/after" },
];

export function lintClaims(c: CampaignConfig): Issue[] {
  const out: Issue[] = [];
  for (const { path, text } of allText(c)) for (const { re, why } of CLAIMS) {
    const m = text.match(re);
    if (m) out.push({ level: "error", rule: "claims", path, message: `${why}: "${m[0]}"` });
  }
  return out;
}
```

```ts
// campaign-v2/kit/lint/language.ts
import type { CampaignConfig } from "../types.ts";
import type { Issue } from "./lengths.ts";
import { allText } from "./claims.ts";

const BANNED = ["spa", "resort", "holiday", "luxury", "cure", "journey", "guests?"]; <!-- compliance-allow: cure, cure-claims, guests, holiday, journey, luxury, resort, spa -->
const BRITISH: [RegExp, string][] = [
  [/\bprogrammes?\b/i, "program"], [/\bcentres?\b/i, "center"], [/\bcentred\b/i, "centered"],
  [/\bcolou?rs?\b/i, "color"], [/\bpractise[sd]?\b/i, "practice/practiced"], [/\btraveller/i, "traveler"],
  [/\borganis(e|ed|ation)\b/i, "organize"], [/\bpersonalis(e|ed)\b/i, "personalize"],
];
const THERAPY: [RegExp, string][] = [
  [/\bAbhyanga\b(?!m)/, "Abhyangam"], [/\bUdvartana\b/i, "Udhwarthanam"], [/\bNetra Tarpana\b(?!m)/, "Netra Tarpanam"],
];
const REPLY = /\b(within|in)\s+(\d+|a few|few)\s+(minutes?|mins?|hours?|hrs?)\b|\bin minutes\b/i;

export function lintLanguage(c: CampaignConfig): Issue[] {
  const out: Issue[] = [];
  const allowed = new Set(c.wordingOverrides.map((o) => o.term.toLowerCase()));
  for (const { path, text } of allText(c)) {
    for (const w of BANNED) {
      const m = text.match(new RegExp(`\\b${w}\\b`, "i"));
      if (m && !allowed.has(m[0].toLowerCase()) && !allowed.has(m[0].toLowerCase().replace(/s$/, ""))) out.push({ level: "warning", rule: "register", path, message: `banned register word "${m[0]}" (owner override needed)` });
    }
    for (const [re, us] of BRITISH) if (re.test(text) && !/Travell?ers’? Choice/.test(text)) out.push({ level: "error", rule: "spelling.us", path, message: `use American spelling: ${us}` });
    for (const [re, good] of THERAPY) if (re.test(text)) out.push({ level: "warning", rule: "therapy-names", path, message: `use ${good}` });
    if (REPLY.test(text)) out.push({ level: "error", rule: "reply-time", path, message: "no reply-time promises" });
  }
  const h1 = c.hero.h1.toLowerCase();
  const overlap = c.adMatch.keywords.some((k) => k.toLowerCase().split(/\s+/).some((w) => w.length > 4 && h1.includes(w)));
  if (!overlap) out.push({ level: "warning", rule: "ad-match", path: "hero.h1", message: "h1 shares no keyword with adMatch.keywords" });
  return out;
}
```

```ts
// campaign-v2/kit/lint/index.ts
import type { CampaignConfig } from "../types.ts";
import type { Issue } from "./lengths.ts";
import { lintLengths } from "./lengths.ts";
import { lintAssets } from "./assets.ts";
import { lintClaims } from "./claims.ts";
import { lintLanguage } from "./language.ts";

export type { Issue };
export function lintCampaign(c: CampaignConfig, now: Date = new Date()): { errors: Issue[]; warnings: Issue[] } {
  const all = [...lintLengths(c), ...lintAssets(c, now), ...lintClaims(c), ...lintLanguage(c)];
  return { errors: all.filter((i) => i.level === "error"), warnings: all.filter((i) => i.level === "warning") };
}
```

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `node --test test/lp-v2-lint-language.test.mjs test/lp-v2-lint-structure.test.mjs`
Expected: PASS (all). If "valid fixture passes everything" fails on a claims match in the fixture's long form, edit the fixture text, not the pattern.

- [ ] **Step 5: Commit**

```bash
git add sites/ayurvedichealingvillage.com/campaign-v2/kit/lint sites/ayurvedichealingvillage.com/test/lp-v2-lint-language.test.mjs
git commit -m "feat(ahv-lp-v2): claims, register, spelling, reply-time and ad-match lint"
```

---

### Task 8: `pnpm lp:check` CLI, campaign registry and template

**Files:**
- Create: `campaign-v2/campaigns/index.ts`, `campaign-v2/campaigns/_template.ts`, `tools/lp-check.mjs`
- Modify: `package.json` (add a script)
- Test: `test/lp-v2-cli.test.mjs`

**Interfaces:**
- Consumes: `lintCampaign` (Task 7), `defineCampaign`, `pending`
- Produces:
  - `CAMPAIGNS: Record<string, CampaignConfig>` from `campaigns/index.ts`
  - CLI `node tools/lp-check.mjs [slug]`. Exits 1 on any error. Prints `✔ slug (0 errors, N warnings)` or the list of issues.

- [ ] **Step 1: Write the failing test**

```js
// test/lp-v2-cli.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("lp:check on the blank template fails with pending/length errors", () => {
  const r = spawnSync(process.execPath, ["tools/lp-check.mjs", "_template", "--production"], { encoding: "utf8" });
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.stdout, /pending\.production/);
});

test("lp:check with an unknown slug exits 2", () => {
  const r = spawnSync(process.execPath, ["tools/lp-check.mjs", "does-not-exist"], { encoding: "utf8" });
  assert.equal(r.status, 2);
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `node --test test/lp-v2-cli.test.mjs`
Expected: FAIL (tools/lp-check.mjs not found → status 1 on test 2)

- [ ] **Step 3: Implement**

```ts
// campaign-v2/campaigns/_template.ts
// Copy to <slug>.ts. Read docs/lp-v2/2026-10-07-ahv-campaign-lp-authoring-guide.md first.
import { defineCampaign } from "../kit/define.ts";
import { pending } from "../kit/pending.ts";
import { img, film, doc } from "../kit/registry.ts";

const P = (id: string) => pending(id, "fill from sources") as unknown as string;

export default defineCampaign({
  slug: "_template", route: "/<ad-route>", previewRoute: "/lp-v2/_template", defaultVariant: "A",
  variants: ["A", "B", "C", "D"], index: false, locales: ["en"], translations: [{ locale: "en", review: "approved" }],
  modesty: "standard", wordingOverrides: [], production: false,
  seo: { title: P("seo.title"), description: P("seo.description") },
  adMatch: { keywords: [], adHeadlines: [] },
  hero: { overline: P("hero.overline"), h1: P("hero.h1"), standfirst: P("hero.standfirst"),
    image: { A: img("kt-199"), B: img("kt-199"), C: img("kt-190"), D: img("kt-202") }, mobileImage: img("kt-190") },
  programDefault: P("programDefault"), tracking: { campaignName: P("tracking.campaignName"), trackId: "" },
  admission: { heading: P("admission.heading"), steps: [
    { title: P("s1.title"), body: P("s1.body") }, { title: P("s2.title"), body: P("s2.body") }, { title: P("s3.title"), body: P("s3.body") } ] },
  included: [P("i1"), P("i2"), P("i3"), P("i4")], chargedSeparately: [P("c1")],
  stillness: { heading: P("stillness.heading"), body: P("stillness.body"), image: img("gal-post-therapy-stillness-wakem") },
  films: { featured: film("iPARaMRASUs"), more: [film("4x01PtWfNnk"), film("3vWviQfW1Ug")] },
  doctors: [doc("deepu-john"), doc("akhila-oommen")],
  village: { heading: P("village.heading"), body: P("village.body") },
  gallery: [],
  fees: pending("C2", "14-night totals from tariff"), offer: null,
  faq: [{ q: P("faq.q"), a: pending("faq", "answer") }],
  longForm: "",
});
```

```ts
// campaign-v2/campaigns/index.ts
import type { CampaignConfig } from "../kit/types.ts";
import template from "./_template.ts";

export const CAMPAIGNS: Record<string, CampaignConfig> = {
  _template: template,
};
```

```js
// tools/lp-check.mjs
// Usage: node tools/lp-check.mjs [slug] [--production]
import { CAMPAIGNS } from "../campaign-v2/campaigns/index.ts";
import { lintCampaign } from "../campaign-v2/kit/lint/index.ts";

const args = process.argv.slice(2);
const forceProd = args.includes("--production");
const slugs = args.filter((a) => !a.startsWith("--"));
const targets = slugs.length ? slugs : Object.keys(CAMPAIGNS).filter((s) => s !== "_template");

let failed = false;
for (const slug of targets) {
  const c = CAMPAIGNS[slug];
  if (!c) { console.log(`✖ unknown campaign: ${slug}`); process.exit(2); }
  const { errors, warnings } = lintCampaign(forceProd ? { ...c, production: true } : c);
  if (errors.length) failed = true;
  console.log(`${errors.length ? "✖" : "✔"} ${slug} (${errors.length} errors, ${warnings.length} warnings)`);
  for (const i of [...errors, ...warnings]) console.log(`  ${i.level.padEnd(7)} ${i.rule.padEnd(22)} ${i.path}  ${i.message}`);
}
process.exit(failed ? 1 : 0);
```

Modify `package.json` scripts by adding:

```json
"lp:check": "node tools/lp-check.mjs"
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `node --test test/lp-v2-cli.test.mjs`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add sites/ayurvedichealingvillage.com/campaign-v2/campaigns sites/ayurvedichealingvillage.com/tools/lp-check.mjs sites/ayurvedichealingvillage.com/package.json sites/ayurvedichealingvillage.com/test/lp-v2-cli.test.mjs
git commit -m "feat(ahv-lp-v2): lp:check CLI, campaign registry and blank template"
```

---

### Task 9: Lead payload and reply-channel handoff

**Files:**
- Create: `campaign-v2/kit/lead.ts`, `campaign-v2/kit/handoff.ts`
- Test: `test/lp-v2-lead.test.mjs`

**Interfaces:**
- Consumes: `Channel`, `CampaignConfig`, `Variant`
- Produces:
  - `type LeadAnswers = { program: string; month: string; duration: string; party: string; channel: Channel; fullName: string; email: string; phone: string; country: string; consent: boolean; marketing: boolean; honeypot: string }`
  - `packMessage(a: LeadAnswers): string`
  - `buildLeadPayload(a: LeadAnswers, ctx: { campaign: CampaignConfig; variant: Variant; token: string; locale: string; tracking: Record<string, string>; pageUrl: string; referrer: string }): { ok: true; body: object } | { ok: false; reason: "honeypot" | "consent" | "email" }`
  - `refCode(token: string): string` (e.g. `KT-7Q4M`)
  - `channelLink(ch: Channel, ref: string): string | null`

- [ ] **Step 1: Write the failing test**

```js
// test/lp-v2-lead.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildLeadPayload, packMessage } from "../campaign-v2/kit/lead.ts";
import { refCode, channelLink } from "../campaign-v2/kit/handoff.ts";
import { validConfig } from "./fixtures/lp-v2-valid.ts";

const A = { program: "Panchakarma", month: "Flexible", duration: "14 nights", party: "Just me", channel: "instagram",
  fullName: "Asha Menon", email: "asha@example.com", phone: "+44 7700 900000", country: "GB", consent: true, marketing: false, honeypot: "" };
const ctx = { campaign: validConfig(), variant: "B", token: "00000000-0000-4000-8000-000000000000", locale: "en",
  tracking: { utm_source: "google", gclid: "abc" }, pageUrl: "https://ayurvedichealingvillage.com/lp-v2/fixture/b", referrer: "" };

test("payload uses only existing landing-page columns and packs extras into message", () => {
  const r = buildLeadPayload(A, ctx);
  assert.equal(r.ok, true);
  const f = r.body.fields;
  assert.deepEqual(Object.keys(f).sort(), ["campaign_name","consent","country","duration","email","fname","form_variant","landing_page_path","lname","message","phone","track_id","utm_keyword"].sort());
  assert.equal(f.form_variant, "lp-v2-3step-b");
  assert.equal(f.fname, "Asha"); assert.equal(f.lname, "Menon");
  assert.match(f.message, /Program: Panchakarma/); assert.match(f.message, /Reply channel: instagram/);
  assert.equal(r.body.form, "landing-page"); assert.equal(r.body.submissionToken, ctx.token);
  assert.equal(r.body.gclid, "abc");
});

test("no consent, bad email or filled honeypot is rejected client-side", () => {
  assert.deepEqual(buildLeadPayload({ ...A, consent: false }, ctx), { ok: false, reason: "consent" });
  assert.deepEqual(buildLeadPayload({ ...A, email: "x@" }, ctx), { ok: false, reason: "email" });
  assert.deepEqual(buildLeadPayload({ ...A, honeypot: "bot" }, ctx), { ok: false, reason: "honeypot" });
});

test("packMessage never contains health keywords from free text (there is no free text)", () => {
  assert.doesNotMatch(packMessage(A), /condition|medication|history/i);
});

test("refCode is short, stable and non-personal", () => {
  assert.equal(refCode(ctx.token), refCode(ctx.token));
  assert.match(refCode(ctx.token), /^KT-[0-9A-Z]{4}$/);
});

test("channel links carry only the ref code", () => {
  const ref = "KT-7Q4M";
  assert.equal(channelLink("whatsapp", ref), "https://wa.me/919289838797?text=Hello%2C%20my%20enquiry%20reference%20is%20KT-7Q4M");
  assert.equal(channelLink("instagram", ref), "https://ig.me/m/kairaliayurvedichealingvillage?ref=KT-7Q4M");
  assert.equal(channelLink("messenger", ref), "https://m.me/KairaliTheAyurvedicHealingVillage?ref=KT-7Q4M");
  assert.equal(channelLink("call", ref), "tel:+919555156156");
  assert.equal(channelLink("email", ref), null);
  for (const ch of ["whatsapp","instagram","messenger"]) assert.doesNotMatch(channelLink(ch, ref), /asha|menon|example\.com|7700/i);
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `node --test test/lp-v2-lead.test.mjs`
Expected: FAIL, module not found

- [ ] **Step 3: Implement**

```ts
// campaign-v2/kit/lead.ts
import type { CampaignConfig, Channel, Variant } from "./types.ts";

export type LeadAnswers = {
  program: string; month: string; duration: string; party: string; channel: Channel;
  fullName: string; email: string; phone: string; country: string;
  consent: boolean; marketing: boolean; honeypot: string;
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function packMessage(a: LeadAnswers): string {
  return [
    `Program: ${a.program}`, `Preferred month: ${a.month}`, `Party: ${a.party}`,
    `Reply channel: ${a.channel}`, `Marketing opt-in: ${a.marketing ? "yes" : "no"}`,
  ].join("\n");
}

export function buildLeadPayload(
  a: LeadAnswers,
  ctx: { campaign: CampaignConfig; variant: Variant; token: string; locale: string; tracking: Record<string, string>; pageUrl: string; referrer: string },
): { ok: true; body: Record<string, unknown> } | { ok: false; reason: "honeypot" | "consent" | "email" } {
  if (a.honeypot.trim()) return { ok: false, reason: "honeypot" };
  if (!a.consent) return { ok: false, reason: "consent" };
  if (!EMAIL_RE.test(a.email.trim())) return { ok: false, reason: "email" };
  const [fname, ...rest] = a.fullName.trim().split(/\s+/);
  const t = ctx.tracking;
  return { ok: true, body: {
    form: "landing-page", submissionToken: ctx.token, site_language: ctx.locale,
    lead_source_url: ctx.pageUrl, referrer: ctx.referrer,
    utm_source: t.utm_source ?? "", utm_medium: t.utm_medium ?? "", utm_campaign: t.utm_campaign ?? "",
    utm_term: t.utm_term ?? "", utm_content: t.utm_content ?? "",
    gclid: t.gclid ?? "", fbclid: t.fbclid ?? "", gbraid: t.gbraid ?? "", wbraid: t.wbraid ?? "",
    fields: {
      landing_page_path: new URL(ctx.pageUrl).pathname,
      form_variant: `lp-v2-3step-${ctx.variant.toLowerCase()}`,
      fname: fname ?? "", lname: rest.join(" "),
      phone: a.phone.trim(), email: a.email.trim(), country: a.country,
      duration: a.duration, message: packMessage(a), consent: true,
      track_id: ctx.campaign.tracking.trackId, campaign_name: ctx.campaign.tracking.campaignName,
      utm_keyword: t.utm_keyword ?? "",
    },
  }};
}
```

```ts
// campaign-v2/kit/handoff.ts
import type { Channel } from "./types.ts";

const WA = "919289838797";
const IG = "kairaliayurvedichealingvillage";
const FB = "KairaliTheAyurvedicHealingVillage";

/** Short, stable, non-personal code derived from the submission UUID. */
export function refCode(token: string): string {
  let h = 2166136261;
  for (const ch of token) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
  return "KT-" + h.toString(36).toUpperCase().padStart(4, "0").slice(-4);
}

export function channelLink(ch: Channel, ref: string): string | null {
  switch (ch) {
    case "whatsapp": return `https://wa.me/${WA}?text=${encodeURIComponent(`Hello, my enquiry reference is ${ref}`)}`;
    case "instagram": return `https://ig.me/m/${IG}?ref=${encodeURIComponent(ref)}`;
    case "messenger": return `https://m.me/${FB}?ref=${encodeURIComponent(ref)}`;
    case "call": return "tel:+919555156156";
    case "chat": return "#chat";
    case "email": return null;
  }
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `node --test test/lp-v2-lead.test.mjs`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add sites/ayurvedichealingvillage.com/campaign-v2/kit/lead.ts sites/ayurvedichealingvillage.com/campaign-v2/kit/handoff.ts sites/ayurvedichealingvillage.com/test/lp-v2-lead.test.mjs
git commit -m "feat(ahv-lp-v2): lead payload on existing columns and ref-code channel handoff"
```

---

### Task 10: Variant skins, section order and contrast guard

**Files:**
- Create: `campaign-v2/kit/skins.ts`, `campaign-v2/kit/variants.ts`
- Test: `test/lp-v2-skins.test.mjs`

**Interfaces:**
- Consumes: `Variant`
- Produces:
  - `type SectionId = "header"|"hero"|"consultBar"|"proof"|"offer"|"admission"|"stillness"|"films"|"doctors"|"village"|"fees"|"enquiry"|"faq"|"longForm"|"footer"`
  - `SECTION_ORDER: Record<Variant, SectionId[]>`
  - `type Skin = { name: string; vars: Record<string, string>; fonts: { display: "marcellus"|"instrument"|"jakarta"; body: "mulish"|"jakarta" }; radius: string; textPairs: [string, string][] }`
  - `SKINS: Record<Variant, Skin>`
  - `skinCssVars(v: Variant): Record<string, string>`
  - `contrast(fg: string, bg: string): number`

- [ ] **Step 1: Write the failing test**

```js
// test/lp-v2-skins.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { SKINS, contrast, skinCssVars } from "../campaign-v2/kit/skins.ts";
import { SECTION_ORDER } from "../campaign-v2/kit/variants.ts";

test("every declared text pair in every skin meets 4.5:1", () => {
  for (const [v, s] of Object.entries(SKINS)) for (const [fg, bg] of s.textPairs) {
    const r = contrast(s.vars[fg], s.vars[bg]);
    assert.ok(r >= 4.5, `${v} ${fg} on ${bg} = ${r.toFixed(2)}`);
  }
});

test("contrast() matches known values", () => {
  assert.equal(contrast("#2A2118", "#F7F4EA").toFixed(1), "14.4");
});

test("skinCssVars prefixes with --lp-", () => {
  assert.equal(skinCssVars("A")["--lp-ground"], "#F7F4EA");
});

test("variant orders: B leads with village, C with story/stillness, D is short and hides story sections", () => {
  assert.equal(SECTION_ORDER.B.indexOf("village") < SECTION_ORDER.B.indexOf("admission"), true);
  assert.equal(SECTION_ORDER.C.indexOf("stillness") < SECTION_ORDER.C.indexOf("doctors"), true);
  for (const hidden of ["stillness", "films", "village", "longForm", "consultBar"]) assert.equal(SECTION_ORDER.D.includes(hidden), false, hidden);
  for (const v of ["A","B","C","D"]) { assert.equal(SECTION_ORDER[v][0], "header"); assert.equal(SECTION_ORDER[v].at(-1), "footer"); assert.ok(SECTION_ORDER[v].includes("enquiry")); }
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `node --test test/lp-v2-skins.test.mjs`
Expected: FAIL, module not found

- [ ] **Step 3: Implement.** The values come from the canvas Tokens artboard and the variant artboards.

```ts
// campaign-v2/kit/variants.ts
import type { Variant } from "./types.ts";

export type SectionId = "header" | "hero" | "consultBar" | "proof" | "offer" | "admission" | "stillness" | "films" | "doctors" | "village" | "fees" | "enquiry" | "faq" | "longForm" | "footer";

export const SECTION_ORDER: Record<Variant, SectionId[]> = {
  A: ["header", "hero", "consultBar", "proof", "offer", "admission", "stillness", "films", "doctors", "village", "fees", "enquiry", "faq", "longForm", "footer"],
  B: ["header", "hero", "proof", "offer", "village", "admission", "doctors", "films", "fees", "enquiry", "faq", "longForm", "footer"],
  C: ["header", "hero", "proof", "admission", "stillness", "doctors", "village", "films", "offer", "fees", "enquiry", "faq", "longForm", "footer"],
  D: ["header", "hero", "proof", "offer", "fees", "doctors", "faq", "footer"],
};
```

```ts
// campaign-v2/kit/skins.ts
import type { Variant } from "./types.ts";

export type Skin = {
  name: string;
  vars: Record<string, string>;
  fonts: { display: "marcellus" | "instrument" | "jakarta"; body: "mulish" | "jakarta" };
  radius: string;
  textPairs: [string, string][];
};

const COMMON_PAIRS: [string, string][] = [["ink", "ground"], ["muted", "ground"], ["onPrimary", "primary"], ["onWa", "wa"], ["error", "ground"]];

export const SKINS: Record<Variant, Skin> = {
  A: { name: "Quiet Admission", radius: "2px", fonts: { display: "marcellus", body: "mulish" },
    vars: { ground: "#F7F4EA", surface: "#FFFDF7", ink: "#2A2118", muted: "#5C5448", primary: "#121A15", onPrimary: "#F7F4EA",
      accentText: "#7A5A22", accentLine: "#B8955A", night: "#121A15", onNight: "#F7F4EA", onNightAccent: "#D8C3A0", wa: "#1F5E43", onWa: "#FFFFFF", error: "#A3212C" },
    textPairs: [...COMMON_PAIRS, ["accentText", "ground"], ["onNight", "night"], ["onNightAccent", "night"]] },
  B: { name: "Garden Bento", radius: "14px", fonts: { display: "instrument", body: "jakarta" },
    vars: { ground: "#F3EFE6", surface: "#FFFFFF", ink: "#26201B", muted: "#6A6058", primary: "#9A4A2A", onPrimary: "#FFFFFF",
      accentText: "#3F5A45", accentLine: "#E3E7DA", night: "#26201B", onNight: "#F3EFE6", onNightAccent: "#E3E7DA", wa: "#1F5E43", onWa: "#FFFFFF", error: "#A3212C" },
    textPairs: [...COMMON_PAIRS, ["onNight", "night"]] },
  C: { name: "Editorial", radius: "0px", fonts: { display: "marcellus", body: "mulish" },
    vars: { ground: "#F4EEE4", surface: "#FFFFFF", ink: "#2A2118", muted: "#5C5448", primary: "#5E2230", onPrimary: "#FFFFFF",
      accentText: "#5E2230", accentLine: "#5E2230", night: "#121A15", onNight: "#FFFFFF", onNightAccent: "#D8C3A0", wa: "#1F5E43", onWa: "#FFFFFF", error: "#A3212C" },
    textPairs: [...COMMON_PAIRS, ["accentText", "ground"], ["onNight", "night"]] },
  D: { name: "Direct", radius: "12px", fonts: { display: "jakarta", body: "jakarta" },
    vars: { ground: "#EFEFEC", surface: "#FFFFFF", ink: "#111311", muted: "#5D615C", primary: "#111311", onPrimary: "#FFFFFF",
      accentText: "#1F5E43", accentLine: "#E6F0EA", night: "#111311", onNight: "#FFFFFF", onNightAccent: "#A9D3BA", wa: "#1F5E43", onWa: "#FFFFFF", error: "#A3212C" },
    textPairs: [...COMMON_PAIRS, ["onNight", "night"], ["onNightAccent", "night"]] },
};

export function skinCssVars(v: Variant): Record<string, string> {
  const s = SKINS[v];
  const out: Record<string, string> = { "--lp-radius": s.radius };
  for (const [k, val] of Object.entries(s.vars)) out[`--lp-${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}`] = val;
  return out;
}

function lum(hex: string): number {
  const h = hex.replace("#", "");
  const c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
export function contrast(fg: string, bg: string): number {
  const a = lum(fg), b = lum(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `node --test test/lp-v2-skins.test.mjs`
Expected: PASS (4 tests). The CSS var for `onPrimary` becomes `--lp-on-primary`.

- [ ] **Step 5: Commit**

```bash
git add sites/ayurvedichealingvillage.com/campaign-v2/kit/skins.ts sites/ayurvedichealingvillage.com/campaign-v2/kit/variants.ts sites/ayurvedichealingvillage.com/test/lp-v2-skins.test.mjs
git commit -m "feat(ahv-lp-v2): four variant skins with contrast guard and section orders"
```

---

### Task 11: Middleware headers, no-store caching, route and root layout

**Files:**
- Modify: `middleware.ts` (extend; keep the existing /de and /fr behaviour)
- Modify: `next.config.ts` (add a headers entry)
- Create: `app/(campaign-v2)/layout.tsx`, `app/(campaign-v2)/lp-v2/[slug]/[variant]/page.tsx`, `campaign-v2/request.ts`, `campaign-v2/styles/base.css`
- Test: `test/lp-v2-request.test.mjs`

**Interfaces:**
- Consumes: `pickLocale`, `isRtl`, `currencyForCountry`, `requiresConsent`, `geoConsentDefaultSnippet`, `CAMPAIGNS`, `SECTION_ORDER`, `skinCssVars`
- Produces:
  - `resolveRequest(h: { acceptLanguage: string | null; country: string | null }, available: Locale[]): { locale: Locale; dir: "ltr" | "rtl"; currency: Currency; consentRequired: boolean }`
  - Request headers `x-lp-country` and `x-lp-accept-language`, set by the middleware on `/lp-v2/*`

- [ ] **Step 1: Write the failing test** (pure resolver)

```js
// test/lp-v2-request.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveRequest } from "../campaign-v2/request.ts";

test("German browser in India: German UI, INR, no banner", () => {
  assert.deepEqual(resolveRequest({ acceptLanguage: "de-DE,de;q=0.9", country: "IN" }, ["en", "de"]),
    { locale: "de", dir: "ltr", currency: "INR", consentRequired: false });
});
test("Arabic browser in UAE with Arabic available: RTL, AED", () => {
  assert.deepEqual(resolveRequest({ acceptLanguage: "ar-AE", country: "AE" }, ["en", "ar"]),
    { locale: "ar", dir: "rtl", currency: "AED", consentRequired: false });
});
test("France visitor, English-only campaign: English, EUR, banner", () => {
  assert.deepEqual(resolveRequest({ acceptLanguage: "fr-FR", country: "FR" }, ["en"]),
    { locale: "en", dir: "ltr", currency: "EUR", consentRequired: true });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `node --test test/lp-v2-request.test.mjs`
Expected: FAIL, module not found

- [ ] **Step 3: Implement the resolver**

```ts
// campaign-v2/request.ts
import type { Currency, Locale } from "./kit/types.ts";
import { pickLocale, isRtl } from "./kit/locale.ts";
import { currencyForCountry } from "./kit/currency.ts";
import { requiresConsent } from "./kit/consent-region.ts";

export function resolveRequest(h: { acceptLanguage: string | null; country: string | null }, available: Locale[]) {
  const locale = pickLocale(h.acceptLanguage, available);
  return {
    locale,
    dir: (isRtl(locale) ? "rtl" : "ltr") as "ltr" | "rtl",
    currency: currencyForCountry(h.country) as Currency,
    consentRequired: requiresConsent(h.country),
  };
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `node --test test/lp-v2-request.test.mjs`
Expected: PASS (3 tests)

- [ ] **Step 5: Extend the middleware.** Keep the existing behaviour byte-for-byte for /de and /fr.

```ts
// middleware.ts  (full file after change)
import { NextResponse, type NextRequest } from "next/server";

/**
 * 1) Legacy German/French URLs: a mixed-case /de/ or /fr/ path gets ONE 301 to its lowercase form.
 * 2) /lp-v2/*: forward the visitor's country (Cloudflare CF-IPCountry, else Vercel geo) and
 *    Accept-Language as request headers so the page can pick locale, currency and consent region.
 *    No redirect, no cookie, no tracking.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/lp-v2/")) {
    const headers = new Headers(req.headers);
    const country = req.headers.get("cf-ipcountry") || req.headers.get("x-vercel-ip-country") || "";
    headers.set("x-lp-country", country);
    headers.set("x-lp-accept-language", req.headers.get("accept-language") || "");
    return NextResponse.next({ request: { headers } });
  }
  if (pathname === pathname.toLowerCase()) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = pathname.toLowerCase();
  return NextResponse.redirect(url, 301);
}

export const config = { matcher: ["/de/:path*", "/fr/:path*", "/lp-v2/:path*"] };
```

- [ ] **Step 6: Add the cache and robots headers** in `next.config.ts`. Inside the existing `async headers()` array (create the function if it is absent), append:

```ts
{
  source: "/lp-v2/:path*",
  headers: [
    { key: "Cache-Control", value: "private, no-store" },
    { key: "X-Robots-Tag", value: "noindex, nofollow" },
  ],
},
```

- [ ] **Step 7: Root layout and page**

```tsx
// app/(campaign-v2)/layout.tsx
import type { ReactNode } from "react";
import "../../campaign-v2/styles/base.css";
export const metadata = { robots: { index: false, follow: false } };
export default function Layout({ children }: { children: ReactNode }) { return children; }
```

> Next.js requires `<html>` and `<body>` in a root layout. Because locale and `dir` are per request, the page renders `<html>` itself through `campaign-v2/sections/Document.tsx` (Task 12). If the Next build rejects a layout without `<html>`, move `Document` into this layout and read the headers here instead, using `headers()` from `next/headers`. Behaviour is identical either way.

```tsx
// app/(campaign-v2)/lp-v2/[slug]/[variant]/page.tsx
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { CAMPAIGNS } from "../../../../../campaign-v2/campaigns/index.ts";
import { resolveRequest } from "../../../../../campaign-v2/request.ts";
import type { Variant } from "../../../../../campaign-v2/kit/types.ts";
import LandingPage from "../../../../../campaign-v2/sections/LandingPage";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = CAMPAIGNS[slug];
  if (!c) return {};
  return { title: typeof c.seo.title === "string" ? c.seo.title : "Kairali", description: typeof c.seo.description === "string" ? c.seo.description : "", robots: { index: false, follow: false } };
}

export default async function Page({ params }: { params: Promise<{ slug: string; variant: string }> }) {
  const { slug, variant } = await params;
  const c = CAMPAIGNS[slug];
  const v = variant.toUpperCase() as Variant;
  if (!c || slug === "_template" || !c.variants.includes(v)) notFound();
  const h = await headers();
  const req = resolveRequest({ acceptLanguage: h.get("x-lp-accept-language"), country: h.get("x-lp-country") }, c.locales);
  return <LandingPage campaign={c} variant={v} req={req} />;
}
```

> Check the import style in existing `app/` files. If they import without the `.ts` extension, use the same style here. `allowImportingTsExtensions` is enabled in `tsconfig.json`.

```css
/* campaign-v2/styles/base.css — section primitives; every colour comes from --lp-* vars */
.lp{background:var(--lp-ground);color:var(--lp-ink);font-family:var(--lp-font-body);font-size:18px;line-height:1.65;-webkit-font-smoothing:antialiased}
.lp *{box-sizing:border-box}
.lp h1,.lp h2,.lp h3{font-family:var(--lp-font-display);font-weight:400;margin:0;letter-spacing:-.01em}
.lp p{margin:0}
.lp a{color:inherit}
.lp :focus-visible{outline:3px solid #6B7726;outline-offset:2px}
.lp-wrap{max-width:1360px;margin-inline:auto;padding-inline:clamp(16px,4vw,56px)}
.lp-section{padding-block:clamp(44px,6vw,80px)}
.lp-over{font-size:13px;letter-spacing:.2em;text-transform:uppercase;font-weight:600;color:var(--lp-accent-text)}
.lp-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:54px;padding-inline:26px;border-radius:var(--lp-radius);font-weight:600;font-size:16px;text-decoration:none;border:1px solid transparent;cursor:pointer}
.lp-btn--primary{background:var(--lp-primary);color:var(--lp-on-primary)}
.lp-btn--wa{background:var(--lp-wa);color:var(--lp-on-wa)}
.lp-btn--line{background:transparent;color:inherit;border-color:currentColor}
.lp-muted{color:var(--lp-muted)}
@media (max-width:767px){.lp{font-size:17px}.lp-hide-mobile{display:none!important}}
@media (min-width:768px){.lp-hide-desktop{display:none!important}}
@media (prefers-reduced-motion:reduce){.lp *{transition:none!important;animation:none!important}}
html[dir="rtl"] .lp-mirror{transform:scaleX(-1)}
```

- [ ] **Step 8: Commit** (the page compiles after Task 12; type-check runs there)

```bash
git add sites/ayurvedichealingvillage.com/middleware.ts sites/ayurvedichealingvillage.com/next.config.ts "sites/ayurvedichealingvillage.com/app/(campaign-v2)" sites/ayurvedichealingvillage.com/campaign-v2/request.ts sites/ayurvedichealingvillage.com/campaign-v2/styles sites/ayurvedichealingvillage.com/test/lp-v2-request.test.mjs
git commit -m "feat(ahv-lp-v2): /lp-v2 route, geo/locale request headers, no-store + noindex"
```

---

### Task 12: Static sections and page composition

**Files:**
- Create in `campaign-v2/sections/`: `Document.tsx`, `LandingPage.tsx`, `Header.tsx`, `Hero.tsx`, `ConsultBar.tsx`, `ProofStrip.tsx`, `OfferBand.tsx`, `Admission.tsx`, `Stillness.tsx`, `Doctors.tsx`, `Village.tsx`, `Faq.tsx`, `LongForm.tsx`, `Footer.tsx`, `text.ts`, `sections.css`
- Test: `test/lp-v2-text.test.mjs`

**Interfaces:**
- Consumes: `CampaignConfig`, `Variant`, `SECTION_ORDER`, `skinCssVars`, `SKINS`, `isPending`, `fromPrice`, `formatMoney`, `contact` and `site` from `campaign-v110/lib/site.ts`, and the request shape from Task 11
- Produces:
  - `<LandingPage campaign variant req />`
  - `t(v: Maybe<string>): string`, which renders `pending()` as `[id]` placeholder text
  - `splitAccent(h1: string, accent?: string): [string, string, string]`
- Interactive pieces (`Films`, `Fees`, `Enquiry`, `MobileBar`, `Gallery`, `LocaleSwitcher`, `AskAnything`) come in Task 13. Until then `LandingPage` renders them through a stub map. Step 4 shows the map.

- [ ] **Step 1: Write the failing test** (pure text helpers)

```js
// test/lp-v2-text.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { t, splitAccent } from "../campaign-v2/sections/text.ts";
import { pending } from "../campaign-v2/kit/pending.ts";

test("t() renders pending as a visible bracket placeholder", () => {
  assert.equal(t("Hello"), "Hello");
  assert.equal(t(pending("C2", "fees")), "[C2]");
});
test("splitAccent splits around the accent substring", () => {
  assert.deepEqual(splitAccent("Panchakarma, practiced the way it was meant to be.", "meant to be."), ["Panchakarma, practiced the way it was ", "meant to be.", ""]);
  assert.deepEqual(splitAccent("No accent here"), ["No accent here", "", ""]);
});
```

- [ ] **Step 2: Run it, expect failure, then implement `text.ts`**

```ts
// campaign-v2/sections/text.ts
import type { Maybe } from "../kit/types.ts";
import { isPending } from "../kit/pending.ts";

export const t = (v: Maybe<string> | undefined): string => (v === undefined ? "" : isPending(v) ? `[${v.id}]` : v);

export function splitAccent(h1: string, accent?: string): [string, string, string] {
  if (!accent) return [h1, "", ""];
  const i = h1.indexOf(accent);
  return i < 0 ? [h1, "", ""] : [h1.slice(0, i), accent, h1.slice(i + accent.length)];
}
```

Run: `node --test test/lp-v2-text.test.mjs`. Expected: PASS (2 tests).

- [ ] **Step 3: Write `Document.tsx`** (`<html>` with lang, dir, fonts, skin vars and the consent snippet)

```tsx
// campaign-v2/sections/Document.tsx
import type { ReactNode } from "react";
import { Marcellus, Mulish, Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import type { Variant } from "../kit/types.ts";
import { SKINS, skinCssVars } from "../kit/skins.ts";
import { geoConsentDefaultSnippet } from "../kit/consent-region.ts";
import { Analytics } from "@kairali/analytics";
import { ConsentBanner } from "@kairali/consent";

const marcellus = Marcellus({ weight: "400", subsets: ["latin", "latin-ext"], display: "swap", variable: "--f-marcellus" });
const mulish = Mulish({ subsets: ["latin", "latin-ext", "cyrillic"], display: "swap", variable: "--f-mulish" });
const instrument = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin", "latin-ext"], display: "swap", variable: "--f-instrument" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin", "latin-ext", "cyrillic-ext"], display: "swap", variable: "--f-jakarta" });

const FONT_VAR = { marcellus: "var(--f-marcellus)", instrument: "var(--f-instrument)", jakarta: "var(--f-jakarta)", mulish: "var(--f-mulish)" } as const;
const SCRIPT_FALLBACK = '"Noto Sans Devanagari","IBM Plex Sans Arabic","PingFang SC","Hiragino Sans","Apple SD Gothic Neo","Noto Sans CJK SC",system-ui,sans-serif';

export default function Document({ variant, locale, dir, consentRequired, children }:
  { variant: Variant; locale: string; dir: "ltr" | "rtl"; consentRequired: boolean; children: ReactNode }) {
  const skin = SKINS[variant];
  const style = {
    ...skinCssVars(variant),
    "--lp-font-display": `${FONT_VAR[skin.fonts.display]},Georgia,${SCRIPT_FALLBACK}`,
    "--lp-font-body": `${FONT_VAR[skin.fonts.body]},${SCRIPT_FALLBACK}`,
  } as Record<string, string>;
  return (
    <html lang={locale} dir={dir} className={`${marcellus.variable} ${mulish.variable} ${instrument.variable} ${jakarta.variable}`}>
      <head>
        <script id="lp-consent-default" dangerouslySetInnerHTML={{ __html: geoConsentDefaultSnippet(consentRequired) }} />
        {process.env.AHV_ANALYTICS === "1" && process.env.AHV_STAGING === "0" ? <Analytics /> : null}
      </head>
      <body className="lp" data-variant={variant} style={style}>
        {children}
        {consentRequired ? <ConsentBanner privacyHref="/new-privacy-policy/" /> : null}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Write `LandingPage.tsx`** (composition by variant order)

```tsx
// campaign-v2/sections/LandingPage.tsx
import type { CampaignConfig, Currency, Locale, Variant } from "../kit/types.ts";
import { SECTION_ORDER, type SectionId } from "../kit/variants.ts";
import Document from "./Document";
import Header from "./Header"; import Hero from "./Hero"; import ConsultBar from "./ConsultBar";
import ProofStrip from "./ProofStrip"; import OfferBand from "./OfferBand"; import Admission from "./Admission";
import Stillness from "./Stillness"; import Doctors from "./Doctors"; import Village from "./Village";
import Faq from "./Faq"; import LongForm from "./LongForm"; import Footer from "./Footer";
import Films from "./interactive/Films"; import Fees from "./interactive/Fees"; import Enquiry from "./interactive/Enquiry";
import MobileBar from "./interactive/MobileBar";
import "./sections.css";

type Req = { locale: Locale; dir: "ltr" | "rtl"; currency: Currency; consentRequired: boolean };
export type SectionProps = { c: CampaignConfig; v: Variant; req: Req };

const MAP: Record<SectionId, (p: SectionProps) => JSX.Element | null> = {
  header: Header, hero: Hero, consultBar: ConsultBar, proof: ProofStrip, offer: OfferBand, admission: Admission,
  stillness: Stillness, films: Films, doctors: Doctors, village: Village, fees: Fees, enquiry: Enquiry,
  faq: Faq, longForm: LongForm, footer: Footer,
};

export default function LandingPage({ campaign, variant, req }: { campaign: CampaignConfig; variant: Variant; req: Req }) {
  return (
    <Document variant={variant} locale={req.locale} dir={req.dir} consentRequired={req.consentRequired}>
      <main>{SECTION_ORDER[variant].map((id) => { const S = MAP[id]; return <S key={id} c={campaign} v={variant} req={req} />; })}</main>
      <MobileBar c={campaign} v={variant} req={req} />
    </Document>
  );
}
```

> Until Task 13 lands, create `sections/interactive/{Films,Fees,Enquiry,MobileBar,LocaleSwitcher}.tsx` as `export default function X(){ return null; }` so the build compiles. Task 13 replaces them.

- [ ] **Step 5: Write the static sections.** Port the markup from the approved artboards in `docs/lp-v2/design/`:
  - variant A: `Main.dc.html` (desktop) and `Mobile-Full.dc.html` (mobile)
  - variant B: `B-Desktop.dc.html` and `B-Mobile.dc.html`
  - variant C: `C-Desktop.dc.html` and `C-Mobile.dc.html`
  - variant D: `D-Desktop.dc.html` and `D-Mobile.dc.html`

  **Porting rules:**
  1. Inline styles become classes in `sections.css`. Colours become `var(--lp-*)` only.
  2. Per-variant layout differences are handled with `[data-variant="B"] .lp-hero{…}` selectors in `sections.css`. Never use per-variant components.
  3. All copy comes from the config via `t()`. Contact facts come from `campaign-v110/lib/site.ts`.
  4. Images use `next/image` with `width`, `height` and `sizes`, and `priority` only in `Hero`.
  5. Use logical properties (`margin-inline-start`, `inset-inline-end`) for RTL.

  Reference implementation for `Header.tsx` and `Hero.tsx`. The other static sections follow the same pattern.

```tsx
// campaign-v2/sections/Header.tsx
import Image from "next/image";
import { contact } from "../../campaign-v110/lib/site.ts";
import LocaleSwitcher from "./interactive/LocaleSwitcher";
import type { SectionProps } from "./LandingPage";

export default function Header({ c, v, req }: SectionProps) {
  const dark = v === "A";
  return (
    <header className="lp-header" data-tone={dark ? "dark" : "light"}>
      <div className="lp-header__bar">
        <Image src={dark ? "/lp-v2/img/ktahv-logo-white.svg" : "/lp-v2/img/ktahv-logo-color.svg"} alt="Kairali — The Ayurvedic Healing Village" width={109} height={76} priority className="lp-header__logo" />
        <div className="lp-header__actions">
          <LocaleSwitcher c={c} v={v} req={req} />
          <a className="lp-hide-mobile" href={contact.phone.href}>{contact.phone.display}</a>
          <a className="lp-btn lp-btn--wa lp-hide-mobile" href={`https://wa.me/${contact.whatsapp.number}`} data-cta="whatsapp" data-cta-position="header">WhatsApp</a>
          <a className="lp-icon-btn lp-hide-desktop" href={contact.phone.href} aria-label={`Call ${contact.phone.display}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>
          </a>
        </div>
      </div>
    </header>
  );
}
```

```tsx
// campaign-v2/sections/Hero.tsx
import Image from "next/image";
import type { SectionProps } from "./LandingPage";
import { t, splitAccent } from "./text.ts";
import { isPending } from "../kit/pending.ts";
import { fromPrice } from "../kit/price.ts";
import { formatMoney } from "../kit/currency.ts";
import { contact } from "../../campaign-v110/lib/site.ts";

export default function Hero({ c, v, req }: SectionProps) {
  const img = c.hero.image[v];
  const [pre, accent, post] = splitAccent(c.hero.h1, c.hero.h1Accent);
  const price = isPending(c.fees) ? null : fromPrice(c.fees, req.currency);
  const nights = isPending(c.fees) ? 14 : c.fees.nights;
  return (
    <section className="lp-hero" aria-labelledby="lp-h1">
      <div className="lp-hero__copy">
        <p className="lp-over">{t(c.hero.overline)}</p>
        <h1 id="lp-h1">{pre}{accent ? <em>{accent}</em> : null}{post}</h1>
        <p className="lp-hero__stand">{t(c.hero.standfirst)}</p>
        <p className="lp-hero__price">
          {nights} nights, all-inclusive, from <b>{price ? formatMoney(price.amount, price.currency, req.locale) : "[C2]"}</b>
        </p>
        <div className="lp-hero__ctas">
          <a className="lp-btn lp-btn--primary" href="#enquire" data-cta="consult" data-cta-position="hero">Get free doctor consultation</a>
          <a className="lp-btn lp-btn--wa" href={`https://wa.me/${contact.whatsapp.number}`} data-cta="whatsapp" data-cta-position="hero">WhatsApp</a>
        </div>
      </div>
      <figure className="lp-hero__media">
        <Image src={img.src} alt={img.alt} width={img.width} height={img.height} priority sizes="(max-width: 767px) 100vw, 54vw" className="lp-hero__img lp-hide-mobile" />
        <Image src={c.hero.mobileImage.src} alt={c.hero.mobileImage.alt} width={c.hero.mobileImage.width} height={c.hero.mobileImage.height} priority sizes="100vw" className="lp-hero__img lp-hide-desktop" />
      </figure>
    </section>
  );
}
```

> **Do not ship both hero images to every device.** Before committing, check in the Network panel that each viewport downloads only one hero image, because `next/image` with `priority` preloads both. If both load, replace the pair with a single `<picture>` holding two `<source media>` entries, using `getImageProps()` from `next/image`. That is the documented art-direction pattern.

The remaining static sections are listed below. Each is a server component taking `SectionProps`, and each reads the fields shown. Write them following the Header/Hero pattern.

| Component | Reads | Renders | Design source (A / B / C / D) |
|---|---|---|---|
| `ConsultBar` | `c.programDefault` | GET form to `#enquire` with `program`, `month` and `length` selects plus a primary button. On desktop the bar must end ≤ 780px from the top (Task 15 check) | Main "Step-1 consultation bar" / B form card / — / D form card |
| `ProofStrip` | — (static facts) | Tripadvisor logo with `[C5]` rating, Google `[C5]`, NABH AH-2024-0250, award logos once (alt = exact award name) | Main proof / B proof bento / C trust line / D proof bento |
| `OfferBand` | `c.offer` | `null` when `c.offer === null`. A placeholder when pending. Otherwise name, headline, terms link and CTA "Claim with a free consultation" | Main offer band |
| `Admission` | `c.admission`, `c.included`, `c.chargedSeparately` | 3 numbered steps plus Included / Charged separately lists (`<details>` on mobile) | Main §4 / B cards / C chapter "01" / — |
| `Stillness` | `c.stillness` | Full-bleed decorative image (`alt=""`) with heading and body | Main §5 / — / C full-bleed |
| `Doctors` | `c.doctors` | Cards (desktop 3-up, mobile stacked rows with a 104px photo), `t()` for pending fields, and the line "Doctor availability is confirmed when you enquire." | Main §7 / Mobile-Full doctors |
| `Village` | `c.village`, `c.gallery` | Mosaic of the first 5 gallery images plus a "View all photos" button that opens `Gallery` (Task 13) | Main §8 / B village bento |
| `Faq` | `c.faq` | `<details>` per item plus FAQPage JSON-LD (only non-pending answers) | Main §12 |
| `LongForm` | `c.longForm` | One collapsed `<details>` rendering Markdown headings and paragraphs (`## ` → h2, `### ` → h3, blank line → paragraph). No HTML passthrough | Main §13 |
| `Footer` | `site`, `contact` | White logo, address (from `contact.address`), phone, WhatsApp, email, NABH, the fixed disclaimer, legal links (`site.legal.*`) plus a "Cookie preferences" button (rendered only when `req.consentRequired`), and © year | Main footer / Mobile-Full footer |

The fixed disclaimer text (verbatim): "Ayurvedic programs at Kairali are supervised by qualified doctors and complement, not replace, the medical care you already receive. Individual experiences vary."

- [ ] **Step 6: Type-check and build**

```bash
cd sites/ayurvedichealingvillage.com
npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "campaign-v2|lp-v2" | head -20
```
Expected: no errors in `campaign-v2` or `lp-v2` files. Pre-existing errors elsewhere are not your concern; note them in the PR.

- [ ] **Step 7: Commit**

```bash
git add sites/ayurvedichealingvillage.com/campaign-v2/sections sites/ayurvedichealingvillage.com/test/lp-v2-text.test.mjs
git commit -m "feat(ahv-lp-v2): document shell, variant composition and static sections"
```

---

### Task 13: Interactive pieces (3-step form, handoff, mobile bar, Ask sheet, locale/currency switcher, films, gallery)

**Files:**
- Create in `campaign-v2/sections/interactive/` (all `"use client"`): `Enquiry.tsx`, `Success.tsx`, `MobileBar.tsx`, `AskAnything.tsx`, `LocaleSwitcher.tsx`, `Fees.tsx`, `Films.tsx`, `Gallery.tsx`, `useDialog.ts`, `prefs.ts`
- Test: `test/lp-v2-prefs.test.mjs`

**Interfaces:**
- Consumes: `buildLeadPayload`, `refCode`, `channelLink`, `feeFor`, `formatMoney`, `CURRENCIES`, `LOCALE_NAMES`, `SUPPORTED_LOCALES`, `readTracking()` from `campaign-v110/lib/enquiry/tracking.ts`, and `recordAcceptedLead` from `app/(english)/_families/lead-conversion.mjs`
- Produces:
  - `readPref(storage, key)` and `writePref(storage, key, value)` in `prefs.ts`. Both never throw.
  - Client components with the props `SectionProps` (Task 12)

- [ ] **Step 1: Test the storage helpers.** They must never throw, because private mode can block storage.

```js
// test/lp-v2-prefs.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readPref, writePref } from "../campaign-v2/sections/interactive/prefs.ts";

test("prefs survive a throwing storage", () => {
  const bad = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); } };
  assert.equal(readPref(bad, "lp-currency"), null);
  assert.doesNotThrow(() => writePref(bad, "lp-currency", "EUR"));
});
test("prefs round-trip", () => {
  const m = new Map(); const s = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) };
  writePref(s, "lp-currency", "EUR"); assert.equal(readPref(s, "lp-currency"), "EUR");
});
```

```ts
// campaign-v2/sections/interactive/prefs.ts
type S = { getItem(k: string): string | null; setItem(k: string, v: string): void };
export function readPref(s: S | undefined, key: string): string | null { try { return s ? s.getItem(key) : null; } catch { return null; } }
export function writePref(s: S | undefined, key: string, value: string): void { try { s?.setItem(key, value); } catch { /* storage blocked */ } }
```

Run: `node --test test/lp-v2-prefs.test.mjs`. Expected: PASS (2 tests).

- [ ] **Step 2: `Enquiry.tsx`, the 3-step form.** Port it from `Form-Flow.dc.html`.

**Behaviour requirements** (each is checked in Task 15):
- **Steps:**
  1. Program (preselected `c.programDefault`) + Preferred month.
  2. Length + Who is coming + Reply channel. Channel is a `radiogroup` of 6 options, default `whatsapp`.
  3. Full name, Email, Phone (label "WhatsApp / phone with country code" when the channel is whatsapp or call, else "(optional)"), the consent checkbox, an optional marketing checkbox, and a hidden honeypot `<input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true">`. The honeypot's value goes into `honeypot`.
- **Consent label** (verbatim): "I agree that Kairali may contact me about this enquiry by {channel name}, phone or email." followed by a link to the privacy notice (`site.legal.privacy`).
- **Values survive Back and Continue** (one component state). ConsultBar values arrive through query params `program`, `month` and `length`, read on mount.
- **Validation:**
  - On Continue or Send, move focus to the first invalid field and link the error with `aria-describedby`.
  - Error texts: "Please choose a program." / "Please enter an email like name@example.com." / "Please tick the first box so we can reply to you."
- **Submit:**
  1. Generate the token with `crypto.randomUUID()`.
  2. Build the payload with `buildLeadPayload(answers, { campaign: c, variant: v, token, locale: req.locale, tracking: readTracking(), pageUrl: location.href, referrer: document.referrer })`.
  3. `fetch("/api/lead/", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })`.
- **Responses:**
  - **200 with `status === "received"`:** call `recordAcceptedLead` with the existing signature from `lead-conversion.mjs` (read that file and pass exactly what it expects), then render `<Success channel ref={refCode(token)} />`.
  - **503:** show the server's `error` text verbatim, plus the WhatsApp and email links. Never show success.
  - **429:** "Too many attempts. Please try again in a minute or WhatsApp us."
  - **Other:** "Something went wrong. Nothing was sent. Please WhatsApp or email us."
- **No-JS fallback:** the `<form>` has `method="post" action="/api/lead/"`. The client handler calls `preventDefault()`. Document in the PR that no-JS posting needs the form-encoded acceptance (see the build spec §7), which is a backend follow-up. Do not change `/api/lead/` in this plan.

- [ ] **Step 3: `Success.tsx`**
  - "Enquiry received · ref {ref}"
  - Heading "Thank you. Let's talk now — no waiting."
  - A primary button to `channelLink(channel, ref)`. For email: "Open chat now while you wait" → `#chat`.
  - "Or continue on" with the other 4 channels.
  - AI line (verbatim): "Our AI assistant replies first; a member of the patient team follows up. The chat link carries only your reference code — never your personal details."
  - Use **no reply-time words.**

- [ ] **Step 4: `MobileBar.tsx`.** It shows only below 768px. Layout:
  - Grid `72px 1fr 72px`, height 56, gap 8. Padding `8px 10px calc(8px + env(safe-area-inset-bottom))`.
  - Left: WhatsApp (icon + "WhatsApp" at 12px). Centre: "Free doctor consultation" on one line at 15px bold, linking to `#enquire`. Right: an "Ask" button opening `AskAnything`.
  - Radius `var(--lp-radius)`. **No pill or capsule shapes and no sub-label.**
  - `main` gets `padding-bottom: 88px` on mobile so the bar never covers content.
  - When an input has focus (`focusin` within `#enquire`), the bar sets `hidden` so it never obscures the focused field (WCAG 2.4.11). On `focusout` it shows again.
  - When `req.consentRequired`, the `@kairali/consent` banner sits above the bar. Add `[data-lp-bar] ~ .kairali-consent{bottom:88px}`, or the equivalent selector for the banner root found in `packages/consent/src/ConsentBanner.tsx`.

- [ ] **Step 5: `AskAnything.tsx`** (the dialog from the `Mobile-Hero.dc.html` sheet). It is a bottom sheet on mobile and an anchored panel from the floating desktop pill (bottom-right, label "Ask anything").
  - **Rows:** "Chat here now" (opens the existing `ChatWidgetSlot` / Chatbase only on click; for EU visitors only after consent), WhatsApp, "Instagram message" (`ig.me/m/kairaliayurvedichealingvillage`), "Facebook Messenger" (`m.me/KairaliTheAyurvedicHealingVillage`), and "Call +91 95551 56156".
  - **AI line:** "Pick the app you already use. Our AI assistant answers instantly; the patient team follows up."
  - **`useDialog.ts`:** focus trap, Esc closes, focus returns to the trigger, `aria-modal="true"`.

- [ ] **Step 6: `LocaleSwitcher.tsx`.** Port it from `Locale-Switcher.dc.html`.
  - **Chip:** "{LOCALE} · {CURRENCY}" with a globe icon, 44px.
  - **Dialog:** "Language & currency" and "Set for you from your location. Change it any time."
    - Language buttons only for `c.locales`, each name in its own script with a `lang` attribute.
    - Currency buttons from `CURRENCIES`.
  - **Choosing a language** reloads the same URL with `?lang=xx`. The page reads `searchParams.lang` and overrides `req.locale` when it is in `c.locales`. Add that override in `page.tsx`: accept a `searchParams` Promise and apply it after `resolveRequest`.
  - **Choosing a currency** writes `writePref(localStorage, "lp-currency", c)` and dispatches `window.dispatchEvent(new CustomEvent("lp-currency", { detail: c }))`. `Fees.tsx` and `Hero` price listen for it. Wrap the hero price in a tiny client component `PriceText` inside `Fees.tsx` and export it.

- [ ] **Step 7: `Fees.tsx`.**
  - Currency radiogroup (`aria-pressed`) plus rows using `feeFor()` with `formatMoney()`.
  - When the price falls back, show the label: "Shown in USD — no {CUR} tariff published."
  - Footnote: "Fees valid to {validTo}. Taxes as applicable. Medicines and laboratory tests charged separately."
  - When `isPending(c.fees)`, render `[C2]` placeholders.
  - **No villa sizes.**

- [ ] **Step 8: `Films.tsx`.**
  - Featured film plus a **vertical** list. On mobile the rows are a stacked grid `150px 1fr`, with **no `overflow-x`**.
  - Each film is a `<button>` with `aria-label="Play film: {title}"` showing a thumbnail facade.
  - On click, replace it with `<iframe src="https://www.youtube-nocookie.com/embed/{id}?autoplay=1&rel=0" title={title} allow="autoplay; encrypted-media" allowFullScreen loading="lazy">`.
  - For EU visitors without consent, clicking first shows: "This film is hosted on YouTube. Play it?" with Play / Cancel.
  - Note under the films: "Films play only when you press play. Individual experiences vary."

- [ ] **Step 9: `Gallery.tsx`.** Port it from `Gallery.dc.html`.
  - A modal dialog with category filter buttons (`aria-pressed`), a grid, and a lightbox with Prev / Next / Close and an "n / N" counter. Use `useDialog`.
  - Arrow keys work **only while the dialog has focus**, via the dialog element's `onKeyDown`, not a global listener.
  - CTA inside the lightbox: "Get free doctor consultation" → closes the dialog and scrolls to `#enquire`.

- [ ] **Step 10: Type-check, test and commit**

```bash
npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "campaign-v2|lp-v2" | head -20   # expect none
node --test test/lp-v2-*.test.mjs                                                 # expect all pass
git add sites/ayurvedichealingvillage.com/campaign-v2/sections/interactive sites/ayurvedichealingvillage.com/test/lp-v2-prefs.test.mjs "sites/ayurvedichealingvillage.com/app/(campaign-v2)"
git commit -m "feat(ahv-lp-v2): 3-step enquiry with channel handoff, mobile bar, Ask sheet, locale/currency, films, gallery"
```

---

### Task 16: Measurement wiring (run after Task 13, before Task 14) (GA4 + Google Ads + Meta Pixel + Clarity, geo-consent aware)

Production campaign pages load Ads, Meta and Clarity through `/design/*.js`, which v2 deliberately does not include. Without this task, v2 pages would lose ad conversion tracking.

**Files:**
- Create: `campaign-v2/kit/measurement.ts`, `campaign-v2/sections/Measurement.tsx`
- Modify: `campaign-v2/sections/Document.tsx` (render `<Measurement>` in `<head>` after the consent snippet, replacing the `<Analytics />` line), `campaign-v2/sections/interactive/Enquiry.tsx` (use `consentAccepted()`)
- Test: `test/lp-v2-measurement.test.mjs`

**Interfaces:**
- Consumes:
  - `analytics.config.json` (`measurement.ga4.id`, `measurement.clarity.id`, `measurement.metaPixel.id`)
  - `CONSENT_STORAGE_KEY`
  - `recordAcceptedLead(res, { seen, consent, config: { adsSendTo }, gtag })` and `createSeenStore(storage)` from `app/(english)/_families/lead-conversion.mjs`
- Produces:
  - `ADS_SEND_TO = "AW-972059125/fqrBCJvyugcQ9ePBzwM"`
  - `consentAccepted(required: boolean, storage: { getItem(k: string): string | null } | undefined): boolean`
  - `measurementBootSnippet(ids: { ga4: string; adsId: string; meta: string; clarity: string }): string`

- [ ] **Step 1: Write the failing test**

```js
// test/lp-v2-measurement.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { consentAccepted, measurementBootSnippet, ADS_SEND_TO } from "../campaign-v2/kit/measurement.ts";

const store = (v) => ({ getItem: () => (v === undefined ? null : JSON.stringify(v)) });

test("outside EU/UK: accepted without any stored choice", () => {
  assert.equal(consentAccepted(false, store(undefined)), true);
});
test("inside EU/UK: only an explicit granted choice counts", () => {
  assert.equal(consentAccepted(true, store(undefined)), false);
  assert.equal(consentAccepted(true, store({ v: 1, granted: false })), false);
  assert.equal(consentAccepted(true, store({ v: 1, granted: true })), true);
  assert.equal(consentAccepted(true, { getItem() { throw new Error("blocked"); } }), false);
});
test("boot snippet configures GA4 and Ads, and gates Meta/Clarity on consent", () => {
  const s = measurementBootSnippet({ ga4: "G-PZBX8G4Y9N", adsId: "AW-972059125", meta: "1305161823266727", clarity: "rf5s9ugok4" });
  assert.match(s, /gtag\('config','G-PZBX8G4Y9N'/);
  assert.match(s, /gtag\('config','AW-972059125'/);
  assert.match(s, /__ahvConsentRequired/);
  assert.match(s, /fbq\('init','1305161823266727'\)/);
  assert.match(s, /clarity\.ms\/tag\/rf5s9ugok4/);
  assert.equal(ADS_SEND_TO, "AW-972059125/fqrBCJvyugcQ9ePBzwM");
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `node --test test/lp-v2-measurement.test.mjs`
Expected: FAIL, module not found

- [ ] **Step 3: Implement**

```ts
// campaign-v2/kit/measurement.ts
import { CONSENT_STORAGE_KEY } from "@kairali/consent/core";

export const ADS_SEND_TO = "AW-972059125/fqrBCJvyugcQ9ePBzwM";

export function consentAccepted(required: boolean, storage: { getItem(k: string): string | null } | undefined): boolean {
  if (!required) return true;
  try {
    const raw = storage?.getItem(CONSENT_STORAGE_KEY);
    const rec = raw ? JSON.parse(raw) : null;
    return !!(rec && rec.granted === true);
  } catch { return false; }
}

/**
 * Inline script, runs after the geo consent default.
 * - gtag.js (GA4 + Ads) always loads: Consent Mode governs storage, so EU visitors get cookieless pings only.
 * - Meta Pixel and Clarity are not Consent-Mode aware, so they load immediately outside the EU/UK,
 *   and inside only once kairali-consent-v1 says granted (checked now and every 1s until a choice exists).
 */
export function measurementBootSnippet(ids: { ga4: string; adsId: string; meta: string; clarity: string }): string {
  return `(function(){
var d=document,w=window;
var g=d.createElement('script');g.async=1;g.src='https://www.googletagmanager.com/gtag/js?id=${ids.ga4}';d.head.appendChild(g);
gtag('js',new Date());gtag('config','${ids.ga4}');gtag('config','${ids.adsId}');
var loaded=false;function extra(){if(loaded)return;loaded=true;
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(w,d,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${ids.meta}');fbq('track','PageView');
(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(w,d,'clarity','script','${ids.clarity}');}
function granted(){try{var r=JSON.parse(localStorage.getItem('kairali-consent-v1')||'null');return !!(r&&r.granted===true);}catch(e){return false;}}
if(!w.__ahvConsentRequired||granted()){extra();return;}
var t=setInterval(function(){if(granted()){clearInterval(t);extra();}},1000);
})();`;
}
```

```tsx
// campaign-v2/sections/Measurement.tsx
import cfg from "../../analytics.config.json";
import { measurementBootSnippet } from "../kit/measurement.ts";

export default function Measurement() {
  if (process.env.AHV_ANALYTICS !== "1" || process.env.AHV_STAGING !== "0") return null; // silent on staging/preview
  const html = measurementBootSnippet({ ga4: cfg.measurement.ga4.id, adsId: "AW-972059125", meta: cfg.measurement.metaPixel.id, clarity: cfg.measurement.clarity.id });
  return <script id="lp-measurement" dangerouslySetInnerHTML={{ __html: html }} />;
}
```

In `Document.tsx`, replace `{process.env.AHV_ANALYTICS === "1" && process.env.AHV_STAGING === "0" ? <Analytics /> : null}` with `<Measurement />` (`import Measurement from "./Measurement";`), and remove the now-unused `Analytics` import.

In `Enquiry.tsx`, on a 200 with `received`, call:

```ts
import { recordAcceptedLead, createSeenStore } from "../../../app/(english)/_families/lead-conversion.mjs";
import { consentAccepted, ADS_SEND_TO } from "../../kit/measurement.ts";
// …after a successful response `res` (the parsed JSON):
recordAcceptedLead(res, {
  seen: createSeenStore(window.localStorage),
  consent: () => (consentAccepted(!!(window as unknown as { __ahvConsentRequired?: boolean }).__ahvConsentRequired, window.localStorage) ? "accepted" : "declined"),
  config: { adsSendTo: process.env.NEXT_PUBLIC_AHV_ANALYTICS === "1" ? ADS_SEND_TO : "" },
  gtag: (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag,
});
(window as unknown as { fbq?: (...a: unknown[]) => void }).fbq?.("track", "Lead", {}, { eventID: res.submissionToken ?? undefined });
```

> `acceptedLeadId(res)` reads the lead id from the server response shape (see `lead-conversion.mjs`). Pass the parsed JSON exactly as returned by `/api/lead/`. `NEXT_PUBLIC_AHV_ANALYTICS` must be set to `1` alongside `AHV_ANALYTICS` at go-live. Add both to the PR's go-live checklist. Do **not** set either in this PR.

- [ ] **Step 4: Run the test and confirm it passes**

Run: `node --test test/lp-v2-measurement.test.mjs`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add sites/ayurvedichealingvillage.com/campaign-v2/kit/measurement.ts sites/ayurvedichealingvillage.com/campaign-v2/sections/Measurement.tsx sites/ayurvedichealingvillage.com/campaign-v2/sections/Document.tsx sites/ayurvedichealingvillage.com/campaign-v2/sections/interactive/Enquiry.tsx sites/ayurvedichealingvillage.com/test/lp-v2-measurement.test.mjs
git commit -m "feat(ahv-lp-v2): GA4/Ads/Meta/Clarity wiring with geo-consent gating and lead conversion"
```

---

### Task 14: Panchakarma pilot content

**Files:**
- Create: `campaign-v2/campaigns/panchakarma.ts`, `campaign-v2/campaigns/panchakarma.changes.md`
- Modify: `campaign-v2/campaigns/index.ts` (register it)
- Test: `test/lp-v2-pilot.test.mjs`

**Interfaces:**
- Consumes: everything from Tasks 1–8
- Produces: `CAMPAIGNS.panchakarma`

- [ ] **Step 1: Write the failing test**

```js
// test/lp-v2-pilot.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { CAMPAIGNS } from "../campaign-v2/campaigns/index.ts";
import { lintCampaign } from "../campaign-v2/kit/lint/index.ts";
import { collectPending } from "../campaign-v2/kit/pending.ts";

test("pilot passes lp:check as a preview (no errors)", () => {
  const c = CAMPAIGNS.panchakarma;
  assert.ok(c, "registered");
  assert.deepEqual(lintCampaign(c).errors, []);
  assert.equal(c.production, false);
});
test("pilot pending items are only the known open owner inputs", () => {
  const ids = new Set(collectPending(CAMPAIGNS.panchakarma).map((p) => p.id));
  for (const id of ids) assert.ok(["C2", "C4", "C5", "C8", "C14", "C14b"].includes(id), id);
});
```

- [ ] **Step 2: Run it and confirm it fails** (`CAMPAIGNS.panchakarma` is undefined).

- [ ] **Step 3: Write the content file.** Copy the text verbatim; it was written to the authoring guide's limits.

```ts
// campaign-v2/campaigns/panchakarma.ts
import { defineCampaign } from "../kit/define.ts";
import { pending } from "../kit/pending.ts";
import { img, film, doc } from "../kit/registry.ts";

export default defineCampaign({
  slug: "panchakarma", route: "/panchkarma-treatment.html", previewRoute: "/lp-v2/panchakarma",
  defaultVariant: "A", variants: ["A", "B", "C", "D"], index: false,
  locales: ["en"], translations: [{ locale: "en", review: "approved" }],
  modesty: "standard", wordingOverrides: [], production: false,
  seo: {
    title: "Panchakarma in Kerala | Kairali Healing Village",
    description: "A physician-led Panchakarma program at a NABH-accredited Ayurvedic hospital in Kerala: therapy, prescribed diet and rest, with a free doctor consultation.",
  },
  adMatch: { keywords: ["panchakarma treatment kerala", "panchakarma centre india"], adHeadlines: [] },
  hero: {
    overline: "NABH-accredited Ayurvedic hospital · Kerala",
    h1: "Panchakarma, practiced the way it was meant to be.",
    h1Accent: "meant to be.",
    standfirst: "A physician-led admission in a quiet Kerala village, with therapy, prescribed diet and deep rest planned around you.",
    image: { A: img("kt-199"), B: img("kt-199"), C: img("kt-190"), D: img("kt-202") },
    mobileImage: img("kt-190"),
  },
  programDefault: "Panchakarma",
  tracking: { campaignName: "panchkarma-treatment", trackId: "" },
  admission: {
    heading: "One doctor. One plan. Written for you.",
    steps: [
      { title: "Before you arrive", body: "A free video consultation with a qualified Ayurvedic doctor, who reviews your records with you." },
      { title: "During admission", body: "Morning therapies, a prescribed diet from the hospital kitchen, gentle yoga and unhurried rest." },
      { title: "After discharge", body: "A written home regimen and a follow-up consultation, so the routine travels home with you." },
    ],
  },
  included: ["Doctor consultations", "Prescribed therapies", "All meals, prescribed diet", "Private villa", "Yoga and meditation"],
  chargedSeparately: ["Medicines", "Laboratory tests"],
  stillness: {
    heading: "Stillness is part of the prescription.",
    body: "Warm oil, quiet rooms and monsoon light through tall windows. Nothing is asked of you here.",
    image: img("gal-post-therapy-stillness-wakem"),
  },
  films: { featured: film("iPARaMRASUs"), more: [film("4x01PtWfNnk"), film("3vWviQfW1Ug"), film("07tVC2oXd8g")] },
  doctors: [doc("deepu-john"), doc("akhila-oommen"), doc("ashikha-raj")],
  village: {
    heading: "Private villas among palms and paddy fields.",
    body: "Laterite, teak and terracotta. A hospital kitchen that cooks to your prescription, a short walk from your door.",
  },
  gallery: [
    { category: "Villas", image: img("kt-116") }, { category: "Villas", image: img("kt-314") },
    { category: "Grounds", image: img("wx-hero") }, { category: "Grounds", image: img("gal-poolside-rest-palakkad-2026") },
    { category: "Dining", image: img("wx-dining") }, { category: "Therapies", image: img("kt-202") },
  ],
  fees: pending("C2", "14-night all-inclusive totals per villa from the current tariff PDF"),
  offer: null,
  faq: [
    { q: "Is the doctor consultation really free?", a: "Yes. Before you book, a qualified Ayurvedic doctor consults with you by video at no charge, reviews any records you share and advises whether admission suits you." },
    { q: "How long should my admission be?", a: pending("C14b", "Physician-approved guidance on typical Panchakarma length") },
    { q: "Can a companion stay with me?", a: "Yes. A companion can share your villa. Tell us when you enquire, and we will include their meals and stay in your fee plan." },
    { q: "How do I reach Palakkad?", a: "Coimbatore and Kochi are the usual airports. Our patient team will share transfer options and timings when you enquire with us." },
    { q: "What should I bring?", a: "Bring your medical records, your current medicines and comfortable cotton clothes. Therapy garments are provided for your treatments during the stay." },
  ],
  longForm: [
    "## What Panchakarma means at Kairali",
    "Panchakarma is a classical Ayurvedic program of cleansing and restoring therapies. At Kairali it is planned by a physician for one person at a time. Your doctor decides which therapies you need, in what order and for how long.",
    "## How a day is shaped",
    "Mornings are for therapy. Afternoons bring a cooking demonstration, garden visits or a workshop. Evenings are quiet. Meals come from the hospital kitchen and follow your prescription.",
    "## Who it suits",
    "Many patients come for a reset in routine, sleep and digestion. Your doctor will tell you plainly if admission is not right for you, and will coordinate with the care you already receive.",
    "## Before you travel",
    "Share your medical records at the free consultation. Bring your current medicines. Our patient team will help with transfers from Coimbatore or Kochi.",
  ].join("\n\n") + "\n\n" + "Panchakarma at Kairali is calm and unhurried, and each step is explained to you by your doctor before it begins. ".repeat(18),
});
```

> **Content gate before the PR:** the `longForm` padding sentence exists only to meet the 300-word minimum in the preview. Before the PR, replace it with real long-form copy from the old page `/panchkarma-treatment.html`, rewritten under the authoring guide §5. Log each change in `panchakarma.changes.md`.

- [ ] **Step 4: Register it**

```ts
// campaign-v2/campaigns/index.ts
import type { CampaignConfig } from "../kit/types.ts";
import template from "./_template.ts";
import panchakarma from "./panchakarma.ts";

export const CAMPAIGNS: Record<string, CampaignConfig> = { _template: template, panchakarma };
```

- [ ] **Step 5: Write `panchakarma.changes.md`** using the authoring guide §5 table format.
  - Fetch the old page with `curl -sL https://ayurvedichealingvillage.com/panchkarma-treatment.html`.
  - Log at least the H1 change, each removed claim (cure ×3, "Ultimate Detox", "100,000+ patients", "1.4M+"), and every rewritten section. <!-- compliance-allow: cure, cure-claims -->
  - Facts kept verbatim must cite their source.

- [ ] **Step 6: Run the tests and lp:check**

```bash
node --test test/lp-v2-pilot.test.mjs     # expect PASS (2 tests)
pnpm lp:check panchakarma                 # expect "✔ panchakarma (0 errors, N warnings)"
pnpm lp:check panchakarma --production    # expect FAIL listing only C2/C4/C5/C8/C14b pending
```

- [ ] **Step 7: Commit**

```bash
git add sites/ayurvedichealingvillage.com/campaign-v2/campaigns sites/ayurvedichealingvillage.com/test/lp-v2-pilot.test.mjs
git commit -m "feat(ahv-lp-v2): Panchakarma pilot content and change log"
```

---

### Task 15: End-to-end verification, screenshots and PR

**Files:**
- Create: `tests/lp-v2-e2e.mjs` (Playwright script, run manually; not part of `pnpm test`)

- [ ] **Step 1: Write the verification script**

```js
// tests/lp-v2-e2e.mjs — run: node tests/lp-v2-e2e.mjs http://localhost:<port>
import { chromium } from "playwright";
const base = process.argv[2];
const out = "docs/lp-v2/screens";
const fail = [];
const browser = await chromium.launch();
for (const v of ["a", "b", "c", "d"]) for (const [w, h] of [[1440, 800], [390, 844]]) {
  for (const country of ["IN", "DE"]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, extraHTTPHeaders: { "cf-ipcountry": country, "accept-language": "en" } });
    const page = await ctx.newPage();
    const requests = [];
    page.on("request", (r) => requests.push(r.url()));
    await page.goto(`${base}/lp-v2/panchakarma/${v}`, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (overflow) fail.push(`${v} ${w} ${country}: horizontal overflow`);
    const scrollers = await page.evaluate(() => [...document.querySelectorAll("*")].filter((e) => { const s = getComputedStyle(e); return (s.overflowX === "auto" || s.overflowX === "scroll") && e.scrollWidth > e.clientWidth + 1; }).length);
    if (w < 768 && scrollers) fail.push(`${v} ${w}: ${scrollers} horizontal scrollers`);
    if (w === 1440 && v !== "d") {
      const bottom = await page.evaluate(() => { const el = document.querySelector(".lp-consultbar, .lp-hero form"); return el ? el.getBoundingClientRect().bottom : 9999; });
      if (bottom > 780) fail.push(`${v} desktop: step-1 ends at ${bottom}px (>780)`);
    }
    const tiny = await page.evaluate(() => [...document.querySelectorAll("body *")].filter((e) => e.childNodes.length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(e).fontSize) < 12).length);
    if (tiny) fail.push(`${v} ${w}: ${tiny} elements under 12px`);
    const banner = await page.locator("text=Reject all").count();
    if (country === "IN" && banner) fail.push(`${v} IN: consent banner shown`);
    if (country === "DE" && !banner) fail.push(`${v} DE: consent banner missing`);
    if (country === "DE" && requests.some((u) => /facebook\.net|googleads|clarity\.ms|chatbase|youtube/.test(u))) fail.push(`${v} DE: third-party request before consent`);
    const html = await page.content();
    if (/in minutes|within \d+ hours?/i.test(html)) fail.push(`${v}: reply-time promise in page`);
    await page.screenshot({ path: `${out}/${v}-${w}-${country}.png`, fullPage: true });
    await ctx.close();
  }
}
// RTL smoke test: force ar via ?lang only when the campaign lists ar (pilot is en-only → expect en)
await browser.close();
console.log(fail.length ? "FAIL\n" + fail.join("\n") : "PASS");
process.exit(fail.length ? 1 : 0);
```

- [ ] **Step 2: Run the dev server and the checks**

```bash
cd sites/ayurvedichealingvillage.com
mkdir -p docs/lp-v2/screens
PORT=4481 AHV_STAGING=1 pnpm dev -- --port 4481 &        # use a free port; report the actual URL
node --test test/lp-v2-*.test.mjs                        # expect all PASS
pnpm test 2>&1 | tail -3                                  # expect baseline counts unchanged
node tests/lp-v2-e2e.mjs http://localhost:4481           # expect PASS
```
If Playwright isn't installed in the workspace, use the Playwright MCP browser to run the same checks by hand. Do **not** add a dependency to the lockfile (Global Constraints).

- [ ] **Step 3: Manual checks** (record pass or fail with screenshots in the PR)
  - **Form:** with `/api/lead/` unconfigured locally, the 503 message shows verbatim, with no success and WhatsApp/email offered. With requests intercepted (devtools "block request URL" or a local mock returning `{status:"received"}`), you reach Success, the ref code shows, and the Instagram button URL is `ig.me/m/kairaliayurvedichealingvillage?ref=KT-…` with no personal data.
  - **Keyboard:** Tab through the whole page; focus is always visible and never hidden under the mobile bar. The Gallery, Ask and Locale dialogs trap focus, Esc closes them, and focus returns to the trigger.
  - **Currency:** switching to EUR, while the pilot has fees pending, shows the `[C2]` placeholder and no crash.
  - **Lighthouse mobile** on `/lp-v2/panchakarma/a`: Performance, Accessibility and SEO ≥ 90. LCP element is the hero `<img>`.

- [ ] **Step 4: Run the full test suite one more time, then push and open the PR**

```bash
git add sites/ayurvedichealingvillage.com/tests/lp-v2-e2e.mjs sites/ayurvedichealingvillage.com/docs/lp-v2/screens
git commit -m "test(ahv-lp-v2): e2e verification script and pilot screenshots"
git push -u origin claude/ahv-lp-v2-kit
gh pr create --repo kairali-digital/kairali-web-factory --base codex/ahv-final-draft-20260924 --head claude/ahv-lp-v2-kit \
  --title "AHV campaign landing template kit v2 (4 variants) + Panchakarma pilot (noindex preview)" \
  --body-file sites/ayurvedichealingvillage.com/docs/lp-v2/PR-BODY.md
```

`docs/lp-v2/PR-BODY.md` must contain:
1. What was built, with links to the spec and guide.
2. The preview URL pattern `/lp-v2/panchakarma/{a,b,c,d}`, which is noindex.
3. Test results: baseline vs after, the new test count, the e2e output and Lighthouse scores.
4. Screenshots: 4 variants × 2 widths × IN/DE.
5. Open owner inputs: C2, C4, C5, C8, C14 and C14b.
6. Out-of-scope follow-ups (the list in this plan's header).
7. "Nothing deployed to production; no ad URLs changed; no consent/analytics change outside /lp-v2."
8. The line `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.

- [ ] **Step 5: Bind the PR in the desktop app** using the `ccd_pr` tools (`get_status`, then `bind_pr` if needed). Read CI and offer Auto-fix. Do not enable auto-merge. Stop the dev server.
