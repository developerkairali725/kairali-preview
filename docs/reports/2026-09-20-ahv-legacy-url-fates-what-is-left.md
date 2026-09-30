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

---

# Addendum, same day: two corrections and one page that is unreadable

Written after starting the builds the owner ruled on. Both corrections are to the section above.

## Correction 1 — the Russian page was not invisible. Its design was never started.

I wrote that all four URLs fell outside the decision process because the manifest was built from
the sitemap plus Search Console and these are unlisted, unlinked ad destinations. That holds for
`/karkidaka-…`. It is **wrong** for the Russian page.

`/treatment-in-kerala-russian.html` **has a complete source kit** —
`phases/phase-02-tier-1-campaign-ppc-offer-16-pages/pages/13-treatment-in-kerala-russian-html`,
36 MB, `sourceKitComplete: true`, `pass: true`, live response captured, three viewport
screenshots, normalised record, sections, headings, assets, SEO. It was mined on 2026-09-01 with
the other fifteen campaign pages. What never happened is the next step: `designStarted: false`.
No design pass, so no view, so no dataset record, so no manifest entry.

Reconciled every kit against the rebuild to see how far that goes. **Of 241 page kits, exactly
two never reached the rebuild**, and both are the Russian ones:

| kit | route | sourceKitComplete | designStarted |
|---|---|---|---|
| `phase-02/…/13-treatment-in-kerala-russian-html` | `/treatment-in-kerala-russian.html` | true | **false** |
| `phase-15/…/05-ru` | `/ru/` | true | **false** |

Every other one of the 241 is built or redirected. So the mining pass missed nothing; the design
pass stopped one short of the end twice, and nothing downstream noticed because the manifest is
generated from what the design package contains, not from what was mined. That is the same
failure shape this session keeps meeting — **a generated view that cannot report what is absent
from its own input.**

## Correction 2 — `/ru/` is not a Russian page

I described `/ru/` as "a Russian locale root an EN-only build would not carry", and used it as the
reason the sitemap check came out at 239 of 240. Measured: `/ru/` returns 200 and is **entirely
in English** — title "Authentic Ayurveda and Wellness Retreat in Kerala | Kairali – The Ayurvedic
Healing Village", zero Cyrillic characters in 1,028,403 bytes. It is an English page at a Russian
URL. There is no Russian tree behind it.

## The thing that changes the ruling: the page is unreadable

`/treatment-in-kerala-russian.html` is served as **mojibake**. Measured on the live bytes:

```
bytes                     277,280
declared charset          UTF-8
valid UTF-8               yes
real Cyrillic letters     0
mojibake character pairs  14,640
```

The file is valid UTF-8 — it just encodes the *corruption* rather than the language. Its Russian
was decoded once as a Western single-byte codepage and re-encoded as UTF-8, so where a reader
should see `Лучший` the page serves `Ð›ÑƒÑ‡ÑˆÐ¸Ð¹`. Every Russian character on the page, all
14,640 of them, is in that state. The English twin `/treatment-in-kerala.html` and `/ru/` are both
clean, so this is one page, not a server setting.

**A Russian speaker cannot read a single word of it, and has not been able to for as long as it
has been live.** It carries **5,609 impressions and 6 clicks — a 0.11% click-through rate**, which
is what a search result looks like when its title is gibberish. That number was the reason to keep
the page; it is really a measure of how long it has been broken.

**The text is recoverable, losslessly.** The double-encoding reverses — proven on the title:

```
served    Ð›ÑƒÑ‡ÑˆÐ¸Ð¹ ÐÑŽÑ€Ð²ÐµÐ´Ð¸Ñ‡ÐµÑÐºÐ¸Ð¹ Ð ÐµÑ‚Ñ€Ð¸Ñ‚ Ð² ÐšÐµÑ€Ð°Ð»Ðµ | Ð Ð¾ÑÐºÐ¾ÑˆÐ½Ñ‹Ðµ ÐºÑƒÑ€Ð¾Ñ€Ñ‚Ñ‹ ÐšÐµÑ€Ð°Ð»Ñ‹.
recovered Лучший Аюрведический Ретрит в Керале | Роскошные курорты Кералы.
```

So the page can be rebuilt readable. Two things have to be settled first, and neither is a build
decision:

1. **The recovered title is off-register.** "Роскошные курорты" is *luxury resorts* — both words
   are on the KTAHV banned list, in the page's own title tag. And **Russian is not a declared
   locale**: CLAUDE.md locks EN / DE / FR, so no banned-word equivalents have ever been defined
   for it. Rebuilding the page means either shipping the banned register or writing new Russian
   copy, and writing new copy is not something this lane can do.
2. **Nobody here reads Russian.** Recovery is mechanical and verifiable byte-for-byte, but whether
   the recovered sentences are *correct Russian* is not something I can check. It needs a Russian
   speaker before it goes anywhere near production.

This does not change the owner's ruling — it changes what the ruling costs, so it goes back to him
before the build rather than after.
