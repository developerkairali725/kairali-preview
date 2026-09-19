# Deepu's AHV review, reconciled against the rebuild

2026-09-19. Owner instruction: read both Deepu docs and fold them into the work.

**There is one doc, not two.** "Ahv Review Feedback" (`18r4P1AM…`, owned by
developer@kairali.com, created 05:59 IST, last edited 10:01 IST 19 Sep) has two sections —
main site, then landing pages. A Drive search across everything Deepu owns and has shared,
modified since 10 Sep, returns only this one AHV file; the other two are Villa Raag and
Kairali Tea data sheets. Recorded so nobody goes looking for a second document.

**Deepu reviewed a Vercel preview** (`…-hek2z0v4o-…vercel.app`), not this workspace. So every
item is a candidate until it is measured here — the standing rule. Twenty-nine items:
**14 confirmed, 8 not reproduced, 7 need the owner.** Plus five defects the review did not
find, which the measuring turned up.

---

## Confirmed — measured in this workspace

### D-4 · "Header is not same of every page" — confirmed, and worse than a layout difference

Four different headers across six sampled routes:

| route | header height | primary nav | contact in header |
|---|---|---|---|
| `/` | 73px | 5 items + `EN ▾` | no |
| `/packages/`, `/archive/`, `/contact-us/` | 123px | 5 items, no `EN ▾` | no |
| `/panchkarma-treatment.html` | 81px | **none** — "Call Us / +91-9555-156-156 / address / Book Free Doctor Consultation" | yes |
| `/weight-loss.html` | **no `<header>` element at all** | — | — |

The homepage is 50px shorter than every other page and is the only one carrying the language
pill. `/panchkarma-treatment.html` has no site navigation whatsoever. `/weight-loss.html`
has no header element in the DOM.

### D-5 · "Header me contact ka option hona chahiye" — confirmed

The standard header's only action is **Book Your Stay**, which leaves for
`bookings.ayurvedichealingvillage.com`. There is no call, no WhatsApp, no enquiry. A patient
who wants to ask a question before booking has nothing to press.

### D-15 · "Search icon functionality not work" — confirmed, with the cause

The control is `<a href="#search" aria-label="Search">`. **There is no `#search` target and
no search input anywhere in the document.** Clicked programmatically, past any overlay, it
does not even change the hash. The site ships a search icon that is decoration.

### D-17 · "Dropdown item not showing after hover" — confirmed, structurally

There are no dropdowns to show. Every primary nav item is a plain link with **no
`aria-haspopup`, no `aria-expanded`, no `<ul>` and no `[role=menu]`** anywhere in its
subtree. Same for `EN ▾` — it carries a caret, points at `/`, and has no menu, so the
language switcher advertises DE/FR and delivers neither.

### D-6 and D-10 · missing required validation — confirmed, on exactly one form

The distinction the review does not draw, and it matters:

| form | fields | required attributes | posts to |
|---|---|---|---|
| `/ayurvedic-treatment-packages.html` (**legacy**) | rdogender, fname, phone, email, message, result, chkAgree | **none, on any field** | `https://ayurvedichealingvillage.com/submitContactForm.php` |
| `/contact-us/` (rebuilt) | fname, country_code, phone, email, message | 4 of 5 | handled in-page |
| `/online-consultation/` (rebuilt) | fName, fCode, fPhone, fEmail, fCountry | 4 of 5 | handled in-page |

So the defect is real and it is on the **legacy `.html` page**, which also posts off-site to
the live WordPress domain — the same cross-property dependency the price-list PDFs had, and
it is a form carrying patient contact details.

### D-LP 2, 3, 4, 5, 9, 11, 12 · "layout brake" on the campaign family — confirmed

All seven routes are one family, `ahv-page-campaign-nine-desktop`. Measured at 1280 on
`/weight-loss.html`: the content is crammed into a ~470px left gutter of a 1280px page, the
right two-thirds are empty, and the decorative fragments — tape measure, leaves, the "9 kgs"
badge — float unplaced. There is no horizontal overflow; the layout simply does not assemble.

**This is the family the long-form advertising design package replaces.** Deepu's five
"layout brake" routes and the new template's two bound routes are the same eight pages:
`/wellness-resort-kerala.html`, `/offers/defence-paramilitary-personnel-get-upto-30-off/`,
`/weight-loss.html`, `/preventive-rejuvenation-detoxification.html`, `/pain-management.html`,
`/kairali-cleansing-centre.html`, `/Ayurveda_Treatment_Neo_S.India_Cities.html`,
`/Kairali_Brand_and_Competition_Neo-original.html`. Deepu's items 11 and 12 —
"page structure not good" on the two Neo pages — are the same finding about the same view.

**The package is not on this machine.** Until it arrives these eight pages stay broken, and
no amount of patching the current view is worth doing to a template that is being replaced.

### D-LP 1 and 6 · two routes really are missing from the rebuild

| route | live | in live XML sitemap | in the 252-route manifest |
|---|---|---|---|
| `/karkidaka-chikitsha-or-monsoon-wellness.html` | **200, index,follow** | no | **no** |
| `/deaddiction-treatment-program.html` | **200** | no | **no** |

Both are live, indexable, orphaned from the sitemap, and absent here. Two things found while
checking them:

- `/karkidaka-chikitsha-…` declares `rel=canonical` to
  `https://www.ayurvedichealingvillage.com/karkidaka-Chikitsa-or-monsoon-wellness` — different
  spelling, different case, no `.html`. **That URL 404s.** The page tells Google the real
  version is somewhere that does not exist.
- `/deaddiction-treatment-program.html` is titled **"Luxury Ayurvedic Deaddiction Treatment
  at Kairali"**. `luxury` is on the KTAHV banned list. It is live today, on a de-addiction
  page. A near-sibling is already rebuilt here:
  `/de-addiction-and-rehabilitation-from-alcohol-drugs-tobacco/`.

Every legacy URL needs an explicit fate (BUILD DECISION MATRIX §2): build, merge, or 301.
These two have none.

### Coverage check, since two gaps appeared

The live EN sitemap carries **240 URLs**. Against the rebuild's manifest and redirect map,
**239 of 240 are covered** — the only uncovered one is `/ru/`, a Russian locale root that an
EN-only rebuild would not carry. So the manifest is not generally short; these two pages are
missing because they are missing from the live sitemap too.

---

## Not reproduced here

- **D-2 "Priya Showing 404"** — the two Priya links are `wa.me/919289838797` (the locked
  WhatsApp number, correct) and `https://chat.kairali.com/`. Both return **200** today. The
  chat host is off-site and outside this repo, so it can break again without anything here
  noticing; it is on **237 prerendered routes**.
- **D-3 and D-9 "wrong validation on phone / whatsapp"** — measured on the URL Deepu cites.
  `/online-consultation/` rejects `123` with *"Please enter a valid phone number."* and
  accepts `9289838797`, `92898 38797`, `+91 92898 38797` and `+44 20 7946 0958`.
  `/contact-us/` behaves the same and flags all four required fields on an empty submit.
  Validation is **submit-time, not blur-time** — which may be what read as "wrong".
- **D-LP 16 `/enquiry-form/` "page structure not good"** — renders correctly at 1280:
  breadcrumb, eyebrow, H1, hero, form. See the new finding below, though: this route has a
  different problem.
- **D-LP 7, 8, 10, 13** — `/france-ayurveda-retreat/`, `/vajikarana-therapy-at-kairali/`,
  `/behandlung-in-kerala.html`, `/treatment-in-kerala-russian/` all **404 on the live site
  too**. They are pre-existing broken links, not rebuild regressions, and three of the four
  are FR/DE/RU routes an EN-only rebuild would not carry.
- **D-11 "Footer content changed in mobile view"** — desktop and mobile footers are
  effectively identical: 53 links each, 1147 vs 1144 characters. The whole difference is one
  missing space — `"Kodumbu, Palakkad"` on desktop, `"Kodumbu,Palakkad"` at 375px. Real, but
  three characters, not changed content.

---

## Five defects the review did not find

1. **Eight sitemap routes tell the visitor nothing is submitted.** The string *"Design review
   prototype — nothing is submitted. No enquiry, consultation request, health information,
   file upload, e-mail or contact action leaves this page"* is in the served HTML of
   `/enquiry-form/`, `/ayurveda-retreat-kerala.html`,
   `/family-ayurvedic-retreat-kerala.html`, `/kairali-air-india-maharaja-club.html`,
   `/offers/senior-citizen-offer/`, `/postulez-maintenant/`, `/treatment-in-kerala.html` and
   `/walk-in-ayurveda-treatment/`. All eight are in the sitemap. It comes from the enquiry
   and campaign-retreat datasets. `/contact-us/` and `/online-consultation/` use the same
   view and do **not** carry it, so this is per-route data, not the template.

   Checking those eight turned up the thing underneath, and it is bigger than the notice:
   **no enquiry form in this rebuild has a working endpoint.**

   | route | disclaimer | form action |
   |---|---|---|
   | `/ayurveda-retreat-kerala.html` | yes | **`https://ayurvedichealingvillage.com/submitContactForm.php`** |
   | `/treatment-in-kerala.html` | yes | **`https://ayurvedichealingvillage.com/submitContactForm.php`** |
   | `/enquiry-form/`, `/family-ayurvedic-retreat-kerala.html`, `/kairali-air-india-maharaja-club.html`, `/postulez-maintenant/`, `/walk-in-ayurveda-treatment/` | yes | none |
   | `/offers/senior-citizen-offer/` | yes | no form at all |
   | `/contact-us/`, `/online-consultation/` | **no** | none |

   Two consequences. On the two `.html` routes the disclaimer is **factually wrong** — the page
   promises that no contact action leaves it, next to a form that would post a patient's name,
   phone and e-mail to the live WordPress host. And `/contact-us/` and `/online-consultation/`
   validate beautifully, flag every required field, and then have nowhere to send the result —
   they simply do not carry the notice that says so.

   This is the same root cause as item 7 of the long-form advertising handover ("enquiry
   endpoint is unknown"), and it is sitewide rather than one template's gap.
2. **Two contact addresses on a domain the locked facts do not name** —
   `partners@ayurvedichealingvillage.com` and `press@ayurvedichealingvillage.com` on
   `/contact-us/`, against the locked "public contact email everywhere: info@kairali.com".
   Same class as the open `career@kairali.com` question: do these mailboxes exist?
3. **The same phone number in two formats on one page** — `tel:+91-9555156156` (2
   occurrences) and `tel:+919555156156` (16) on `/contact-us/`.
4. **`+91-9555-156-156` in the `/panchkarma-treatment.html` header** is a third number,
   alongside the locked WhatsApp `+91 92898 38797`. Not a locked-fact violation — the lock
   names only the WhatsApp number and the email — but it is a fourth contact route with no
   owner behind it in the record.
5. **No structured data anywhere.** Zero of the 252 prerendered routes emit `ld+json`. See
   the long-form advertising claim check; it belongs in the same decision.

---

## Needs the owner — not actionable by measurement

- **D-1 "Email and phone should be in the same row, first row"** — a form-layout change. MODE
  A: the supplied design is the authority and the agent does not restyle it. Deepu is the web
  developer, not the designer. **Does this carry the owner's authority?**
- **D-7 and D-12 "live map with `<iframe>`"** on the attractions and contact pages. Three
  things collide: the route sweep fails any state containing an iframe; an embedded Google
  Map sets third-party cookies before consent, and HARD GATE 11 forbids changing consent
  logic; `tools/repair-how-to-reach-maps.mjs` already exists and chose a different answer.
  **A static map that links out, or a real embed behind the consent gate?**
- **The two orphan pages** — build, 301, or leave. And the banned word in the live
  `/deaddiction-treatment-program.html` title needs Dr. Deepu John, not a find-and-replace.
- **The search control** — build search, or remove the icon. Shipping a dead control is the
  one option that is not defensible.
- **The `EN ▾` switcher** — it advertises DE and FR. Neither exists in this rebuild. Remove
  the caret until they do, or wire it.
