# AHV go-live runbook — the flip is NOT one env var

Date: 2026-09-16 · Directives D-20260916-08, -09
Supersedes: `BUILD-STATUS.md` line 157, *"All flips are one env var"* — **that is false**.

---

## 1. Why this document exists

`AHV_STAGING=0` flips **three** things: `robots.txt` goes allow-all, `sitemap.xml`
publishes 252 URLs, and the `X-Robots-Tag: noindex` response header disappears.
All three verified.

It does **not** lift the `noindex` that reaches Google. Two separate mechanisms
hold it, and neither reads that flag:

| Mechanism | Where | Gated on |
|---|---|---|
| Runtime head enforcement | `boot.ts` `enforceStagingHead()` | **Fixed 2026-09-16** — now reads `AHV_STAGING` |
| Baked into the payloads | 122 of 136 files in `public/ahv/views/` | `AHV_KEEP_ROBOTS` — set at **import** time, not build time |

Flipping only `AHV_STAGING=0` produces a site that invites crawlers in via
`robots.txt`, hands them a 252-URL sitemap, and then tells every page
`noindex, nofollow`. Google renders JavaScript. **That is full deindexation of a
ranked, revenue-earning site**, with `nofollow` discarding internal link equity
on the way out.

## 2. The trap inside the trap

The obvious fix — "set every page to `index, follow`" — is also wrong. Read from
the approved source package, the real values are not uniform:

```
102 pages   index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1
 16 pages   index, follow
  4 pages   index, follow, max-image-preview:large, max-snippet:-1
  1 page    noindex, nofollow        <- deliberately excluded by the design
datasets    18x noindex, follow · 9x noindex, nofollow · 7x index, follow
```

Two things would be destroyed by a blanket flip: the **one page the design
deliberately keeps out of the index**, and the **`max-snippet` / `max-image-preview`
directives on 106 pages**, which Google's own documentation ties to AI Overview and
rich-result eligibility. Restricting snippets reduces AI-feature eligibility.

`tools/import-english-candidate.mjs` **overwrites** the original value, so it
cannot be recovered from the repo. Only a re-import with `AHV_KEEP_ROBOTS=1`
restores the true per-page values.

## 3. The sequence

Every step is a re-runnable tool. Run them in this order.

```bash
cd sites/ayurvedichealingvillage.com

# 1. Re-import, PRESERVING the design's own robots values.
AHV_KEEP_ROBOTS=1 node tools/import-english-candidate.mjs

# 2. Re-apply everything the import wipes (it rewrites public/ahv wholesale).
node tools/optimise-images.mjs            # 350 MB -> ~185 MB, idempotent
node tools/repair-payload-schema.mjs      # Resort -> Hospital, NABH credential

# 3. Build for production.
AHV_STAGING=0 pnpm build

# 4. Re-render and repair the snapshots against the production build.
node tools/prerender-english.mjs --base http://127.0.0.1:4321   # server must be up
node tools/repair-snapshot-links.mjs

# 5. VERIFY BEFORE DNS. Non-negotiable.
node tools/verify-ssr.mjs --base http://127.0.0.1:4321
```

## 4. The gate — do not flip DNS unless all of this passes

- [ ] `robots.txt` = `Allow: /` **and** carries the `Sitemap:` line
- [ ] `sitemap.xml` = 252 `<loc>` entries, canonical host, **zero** `/lp/` URLs
- [ ] **No `X-Robots-Tag` header** on any response
- [ ] Rendered `meta[name=robots]` across all 252 routes matches the **source
      distribution above** — roughly 122 indexable, the one excluded page still
      `noindex`, and the `max-snippet` directives intact. **Not** "all 252 say
      index,follow" — that would itself be the bug.
- [ ] Exactly **one** `meta[name=robots]` per page (staging currently renders two;
      both agree, but production must be checked)
- [ ] All 252 routes return 200 with the trailing slash
- [ ] `verify-ssr.mjs`: 0 non-200, 0 below 600 chars, 0 missing `<h1>`
- [ ] Verification metas present (they no longer depend on the analytics flag)
- [ ] `/download/ayurvedaworkshop-in-kairali.pdf` resolved or the link removed
      (it is 404 on production today; Deepu/Sunaj to supply the file)
- [ ] og:image decision made — 181 pages point at `/wp-content/`, which the new
      host does not serve, so they break the moment DNS moves

## 5. Also true, and separate

`app/(lp)/layout.tsx` gates the 11 landing pages on the **same** `AHV_STAGING`
flag. So the flip that publishes the English site simultaneously publishes
`/lp/*`, `/privacy` and `/terms` at new URLs — and `next.config.ts`'s own comment
says the legacy→`/lp/` mapping must wait on **Vikash's written per-URL
confirmation** because live Google Ads point at the legacy URLs. Decide that
before the flip, not during it.

## 6. How this was missed

Every check run against this build tested staging **as staging**. Nobody, me
included, ever built with the production flag set and looked at the result. The
gate in §4 exists so that is no longer possible — and it matters more, not less,
once ten translated locales multiply every one of these surfaces.
