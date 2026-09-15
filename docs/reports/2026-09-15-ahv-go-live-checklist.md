# ayurvedichealingvillage.com — go-live checklist

**Created:** 2026-09-15, AHV English staging session · **Branch:** `codex/ahv-english-staging-20260915`
**Authority:** owner rulings D-20260915-01 (consent-gated analytics) and 2026-09-15 (record the IDs, keep
them inert on staging, switch them at go-live).

This is the list of things that must happen BEFORE and AFTER the DNS flip. It exists because the
measurement identities are deliberately switched OFF on staging: recorded, wired and tested, but not
firing, so six reviewers clicking around a preview never land in the production GA4 and Clarity data.

## The one switch

Everything measurement-related is behind a single build flag.

```
AHV_ANALYTICS=1
```

Unset (the staging default) means: no GA4, no Clarity, no Meta Pixel, no verification metas — the ids
never reach the browser at all, whatever the visitor answers the cookie notice. Set to `1` means the
ids are served, and each tag then waits for the visitor to accept.

Two independent locks, deliberately. The consent gate is not the only thing standing between a preview
and the production analytics properties.

Identities live in `sites/ayurvedichealingvillage.com/analytics.config.json`, read from the live site's
own tags on 2026-09-15 and cross-checked where possible. They are public identifiers, not secrets.

## BEFORE the flip

- [ ] **Owner confirms the measurement identities** are the ones this site should report to:
      GA4 `G-PZBX8G4Y9N` · Clarity `rf5s9ugok4` · Meta Pixel `1305161823266727`.
- [ ] **Decide Google Ads.** There is nothing to port: no `AW-` tag exists anywhere on the live site and
      the KTAHV Ads account `214-403-0919` is CANCELLED. Either skip Ads, or nominate an account and a
      conversion action — an owner/Vikash decision, not a build one.
- [ ] **Decide Bing UET.** No `bat.bing.com` tag exists on the live site. Net-new if Bing Ads is ever run.
- [ ] **Server-side rendering of the page body** — the owner ruled this a BLOCKER (D-20260915-03). A
      crawler that does not run JavaScript currently sees 254-296 characters per route against
      1,200-16,100 rendered. See `docs/reports/2026-09-15-ahv-ssr-feasibility.md`.
- [ ] **Deepu signs off the enquiry and contact forms.** They fail closed today: `AHV_STAGING=1` makes
      `app/api/enquiry/route.ts` return 503 without reading the body or calling the lead store. Going
      live means `AHV_STAGING=0`, which restores the real handler — test before, not after.
- [ ] **Dr. Deepu John and the owner rule on the KTAHV language lock.** 191 of 252 routes carry terms the
      clinical lock bans, 2,772 occurrences. This is a GST-exposure decision and it is not a build fix.
      Full tally: `sites/ayurvedichealingvillage.com/english-candidate/language-lock-audit.json`.
- [ ] **Protection map for every legacy URL** — KEEP / MERGE / 301, single hop, no content-rich ranking
      page redirected to a thin target (BUILD DECISION MATRIX §2).
- [ ] **Take a ranking and traffic baseline** the day before, so any post-flip movement can be measured
      rather than argued about.
- [ ] **Confirm the verification metas will be served.** `google-site-verification`,
      `msvalidate.01` and `facebook-domain-verification` currently emit only when `AHV_ANALYTICS=1`.
      If they are missing at the flip, **Search Console and Bing verification break.** The approved
      payload also writes its own copies on some programme views; the boot layer keeps the first of
      each so there is never a duplicate.
- [ ] **Merge to `main` first.** As of this session `sites/villaraag.com` has ZERO files on main and the
      whole AHV `app/(english)` tree has ZERO files on main — 262 unmerged remote branches repo-wide.
      A site that only exists on a branch is one deleted worktree from gone. PR #309 is MERGEABLE but
      still a DRAFT, and drafts cannot merge.

## AT the flip

- [ ] Set `AHV_ANALYTICS=1` and `AHV_STAGING=0` on the production environment.
- [ ] Confirm `robots.txt` no longer says `Disallow: /`, the sitemap is populated, and the
      `X-Robots-Tag: noindex` header is gone. All four are driven by `AHV_STAGING`.
- [ ] DNS is a HUMAN action. The agent prepares; Abilash/Ambuj flip.

## AFTER the flip — same day

- [ ] **Confirm the cookie notice appears and both buttons work**, on a phone and on desktop, on the
      homepage AND on an interior page. The homepage uses the approved design's own notice; the other
      251 routes use the site-wide one added in this session. Both write the same
      `localStorage["ktahv-consent"]`, so one choice covers the site.
- [ ] **Confirm NOTHING fires before consent.** Open a page in a fresh private window, check the network
      panel: no request to `googletagmanager.com`, `clarity.ms` or `connect.facebook.net` until Accept
      is clicked. This was verified in the build; verify it again on the live domain.
- [ ] **Confirm tags fire after consent** — GA4 realtime shows the visit, Clarity shows the session,
      Meta Events Manager shows PageView.
- [ ] **Re-verify Search Console and Bing** still show the domain as verified.
- [ ] Submit the new sitemap in Search Console and Bing.
- [ ] Test a real enquiry end to end and confirm it reaches the inbox it should.

## AFTER the flip — the watch

- [ ] **24h:** crawl errors, 4xx/5xx, Search Console coverage.
- [ ] **72h:** indexation of the main templates; compare against the pre-flip baseline.
- [ ] **7d and 28d:** rankings and organic traffic against baseline. This is the window where the
      server-rendering decision shows up in the numbers, for better or worse.
- [ ] Keep the previous WordPress site restorable until 28d looks right. Rollback authority is human.
