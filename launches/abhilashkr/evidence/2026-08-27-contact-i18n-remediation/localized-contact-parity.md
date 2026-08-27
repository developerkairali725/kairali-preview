# Localized contact parity follow-up

- Task: `ISS-abhilashkr-com-0001`
- Verified: `2026-08-27 18:15:32 IST` (`2026-08-27T12:45:32Z`)
- Source commit: `6248b99d9cb16912bcf40cbc305255949f88fff8`
- Vercel deployment: `dpl_8FfHKPjM4ofhQ8CzKoXQ5c9LHnmv`
- Environment: `preview`
- Status: `Ready`
- Protected Preview: <https://kairali-web-factory-abhilashkr-a6w0egkjx-kairali.vercel.app>
- Production promotion: not performed

## Finding and correction

The first candidate made the English email, phone and LinkedIn values
actionable. The German and French contact pages already had direct email links
and no form, but did not yet carry equivalent phone, LinkedIn and HQ entries.

The localized contact pages now expose the same core coordinate set:

- email via the visitor's mail application;
- telephone via `tel:+919555156156`;
- the exact approved LinkedIn profile; and
- Kairali HQ as plain text, without inventing a map destination.

German and French email guidance now explicitly says the visitor must send the
message in their mail application and that the website transmits and stores no
message. Neither localized page contains a site-submitted form.

## Verification

- Site lint: pass.
- Production build: pass; 42 routes generated.
- Focused Playwright: 8/8 pass on mobile 375 px and desktop 1280 px. The
  contact-coordinate test now verifies exact email, phone and LinkedIn
  destinations on English, German and French pages plus localized delivery
  disclosures.
- Local browser structure/visual read: German and French pages expose all
  expected headings, text and actions with localized consent UI intact.
- Authenticated protected Preview reads: exact email, telephone, LinkedIn and
  delivery disclosure checks pass on `/contact`, `/de/kontakt` and
  `/fr/contact`.

The candidate remains `STAGING_QA`; protected PR checks and human Preview
approval are still required before any merge or production release.
