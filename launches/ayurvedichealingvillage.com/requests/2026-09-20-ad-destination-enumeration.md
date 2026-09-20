# Two requests: enumerate the ad-landing estate before the flip

Owner ruling, 2026-09-20: "Ask Deepu + Vikash now." Both are **drafts in Abilash's Gmail,
unsent** — the agent drafts, the owner clicks send (CLAUDE.md §7 missing-asset protocol).

## Why both, and why neither alone is enough

The rebuild's route inventory was assembled from the live XML sitemap plus the Search Console
URL set. An ad-landing page that is unlisted, unlinked and never ranked is invisible to both.
Four surfaced by accident from one line in Deepu's review; there is no way to tell from inside
this repo whether there are more, and every one that exists becomes a 404 at the DNS flip.

- **Deepu** has the WordPress page list — everything that was ever *published*, sitemap or not.
- **Vikash** has the Google Ads final URLs — everything that was ever *pointed at*, including
  removed campaigns, which is where a page that WordPress no longer lists can still be spending.

A page could be in either set and not the other, so both are needed to close the gap.

## Draft 1 — Deepu (developer@kairali.com)

**Subject:** AHV: full WordPress page list needed before the Next.js flip
**Draft id:** `r458110548838292067`

Asks for the complete Pages list (title, URL, status, sitemap presence), explicitly including
the `.html` landing pages. Carries two live-site fixes that are small and already evidenced:
the `/karkidaka-…` canonical pointing at a URL that 404s, and the `noindex` on
`/learn-about-ayurveda/` and `/retreats-for-everyone/` that the owner already ruled a mistake.

## Draft 2 — Vikash (seo@ktahv.com), Rohan copied (digital@kairali.com)

**Subject:** AHV: every Google Ads final URL, before the Next.js flip
**Draft id:** `r1472368396508848141`

Asks AHV-NEO / customer ID 712-961-0573 for every Final URL live and for the last 24 months
**including removed campaigns**, plus any Final URL Suffix or tracking template that rewrites
the destination. Rohan is copied because he is in the account day to day; the owner can drop
him if he would rather it stayed with Vikash.

Flags one thing for immediate checking: **`/panchakarma-treatment.html` is already 404 on the
live site.** If a live ad still points at that spelling, that spend is landing on an error page
today. The working page, `/panchkarma-treatment.html`, earns 499 clicks against 29,346
impressions.

## What happens with the answers

Both lists get reconciled against `english-candidate/route-manifest.json` and
`english-candidate/redirect-map.json`. Anything in neither gets a fate under the BUILD DECISION
MATRIX — build, merge or 301 — the same treatment the four already have.
