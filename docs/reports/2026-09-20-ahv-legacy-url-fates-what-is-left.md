# "I thought we took all decisions — what is left?"

2026-09-20. Checked against the workspace and the history rather than answered from memory.

## Short answer

The decisions **were** all taken — over the 252 routes that were in the rebuild. What is left
is **four legacy `.html` URLs that were never in that set**, so nothing in the decision process
could have put them in front of you.

| URL | live | in the live XML sitemap | Search Console (Jul 2026) | in the rebuild |
|---|---|---|---|---|
| `/treatment-in-kerala-russian.html` | **200** | no | **6 clicks / 5,609 impressions** | no |
| `/karkidaka-chikitsha-or-monsoon-wellness.html` | **200**, `index,follow` | no | not present | no |
| `/deaddiction-treatment-program.html` | **200** | no | not present | no |
| `/panchakarma-treatment.html` | 404 | no | 0 clicks / 6 impressions | no |

## Where the decisions were taken, and why these four fell outside

The fate register is §7 of `docs/reports/2026-09-19-ahv-article-template-families-and-design-brief.md`
— "pages that need a fate, not a design". Your ruling on it ("make all these pages 301") became
the twelve entries in `english-candidate/redirect-map.json`:

```
/test-page/ /test-page-2/ /testing/ /gift-test/ /my-account/ /how-to-reach-old/
/contact-us-old/ /enquiry-form-old/ /online-consultation-old/ /cart/ /checkout/ /offers/new/
```

That register was drawn from routes **already in the 252-route manifest**, and the manifest was
built from the live XML sitemap plus the Search Console URL set. Both sources miss these four:

- **Not in the sitemap.** The live EN sitemap carries 240 URLs. Checked in full: 239 of the 240
  are built or redirected in this rebuild — the only uncovered one is `/ru/`, a Russian locale
  root an EN-only build would not carry. So the manifest is not generally short. These four are
  simply not in the sitemap at all.
- **Not linked from the live site.** Crawled five live hubs (`/`, `/sitemap/`, `/offers/`,
  `/ayurvedic-treatments/`, `/packages/`) for internal `.html` links: **zero**. Every `.html`
  href on the live homepage points off-site — kairaliproducts.in, TripAdvisor, Petit Futé,
  booking.com. `/karkidaka-chikitsha-…` itself links out to exactly one place, TripAdvisor.
  These are ad-landing destinations, reachable by clicking an ad and nothing else.
- **Three of the four have no Search Console impressions**, so the GSC pass could not name them
  either.

The 13 `.html` routes the rebuild *does* carry are precisely the ones Search Console had seen.
So the process worked as designed; its two inputs just cannot see an unlinked, unlisted,
never-ranked ad destination. Only the WordPress page list (Deepu) or the Google Ads
destination-URL list (Vikash) can enumerate those completely.

## What each one needs

**1 · `/treatment-in-kerala-russian.html` — the one that matters.** Live, 200, and **5,609
impressions**. It is the Russian-market landing page, and the live site also has a whole `/ru/`
tree that this EN-only rebuild deliberately does not carry. So it is probably an intentional
locale exclusion rather than a miss — but there is **no written decision anywhere**, and on the
day of the flip it becomes a 404 with 5,609 impressions behind it. One line from you closes it:
out of EN scope like `/ru/`, or a 301.

**2 · `/karkidaka-chikitsha-or-monsoon-wellness.html`** — live and indexable, and it declares
`rel=canonical` to `https://www.ayurvedichealingvillage.com/karkidaka-Chikitsa-or-monsoon-wellness`
— different spelling, different case, no `.html`. **That URL 404s.** The page has been telling
Google the real version is somewhere that does not exist. Monsoon/Karkidaka is a seasonal
programme you run, so this is content with a reason to exist, not a leftover.

**3 · `/deaddiction-treatment-program.html`** — live, titled **"Luxury Ayurvedic Deaddiction
Treatment at Kairali"**. `luxury` is on the KTAHV banned list and this is a clinical page, so
whatever happens to the URL, the title is a Dr. Deepu John item, not a find-and-replace. A
sibling is already rebuilt: `/de-addiction-and-rehabilitation-from-alcohol-drugs-tobacco/`.

**4 · `/panchakarma-treatment.html`** — already 404 on live, 0 clicks against 6 impressions.
A misspelling of the real `/panchkarma-treatment.html`, which earns **499 clicks / 29,346
impressions**. Nothing to preserve; a 301 to the correctly-spelled page costs nothing.

## The wider gap this exposes

The rebuild's route inventory can only ever be as complete as the sitemap and Search Console.
Any ad destination that is unlisted, unlinked and never ranked is invisible to both. Four turned
up from one review comment; there is no way to know from inside this repo whether there are
more. **The complete list lives in two places neither of which is here** — the WordPress page
list and the Google Ads destination URLs. Worth pulling both before the flip, once, rather than
finding the next one the way we found these.
