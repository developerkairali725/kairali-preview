# AHV guest reviews — native Next.js candidate, 24 September 2026

Task: WOPS-AHV-FINAL-DRAFT-20260924-001. Site: ayurvedichealingvillage.com. Candidate only; no WordPress plugin or paid widget account.

`app/(english)/read-feedback/page.tsx` now overrides the old catch-all route. The old design payload remains intact for rollback. Remove the added route, API, helper, widget and test to restore the previous route at base commit de86828d. No existing implementation files were modified.

The page server-renders seven sourced editorial excerpts and three existing guest films. India/international labels are used only when the source gives a location. Dates distinguish historical testimonials from dated Google excerpts. Hindi, German, French and Russian are labelled translations with English originals accessible; this does not translate the whole website. No invented portraits, ratings, review counts, medical claims or Review/AggregateRating schema were added.

## Official integrations

Tripadvisor property 530306 uses the official public selfserveprop widget in an isolated click-to-load iframe. It loaded four real review excerpts in desktop/mobile browser verification. Full listing remains available if a browser blocks third-party content. No account or key is needed for this widget.

Google has a native server endpoint `/api/reviews/google?language=en`. It requires these **server-only** deployment variables:

- `AHV_GOOGLE_REVIEWS_ENABLED=1`
- `AHV_GOOGLE_PLACES_API_KEY` (restricted to Places API (New); never NEXT_PUBLIC)
- `AHV_GOOGLE_PLACE_ID` (verify the exact Healing Village property; the public Maps CID is not a Place ID)

No credentials have been created, no billing enabled, and no Google feed activation is claimed. Until configured, the component offers its direct Maps link and a clear unavailable state on load. Before enabling, set an appropriate Google API quota/billing alert and validate the exact property's live result. Place Details returns at most five reviews selected by Google's relevance order; it is not a complete chronological review feed. A complete owner feed would require separately authorised Google Business Profile OAuth access.

Requests use an allowlist of five languages, a minimal field mask, an eight-second timeout and no-store. Credentials stay server-side. All star ratings returned by Google are preserved; author names/profile/photo attribution, dates, source links and translation originals are retained. Errors and wrong-property responses reveal no internal details. Mock tests cover these boundaries. Use Google's approved Maps attribution artwork when activating the feed; the candidate uses plain Google Maps text, not a fabricated logo. Recheck current attribution requirements before live enablement.

Shared DOM-based chrome and section navigation attach after native React hydration, preventing the shared rail from invalidating server HTML. The page retains one shared consent notice, WhatsApp and Chat with Priya, plus the owner's secondary-header takeover behaviour.

## Research

Reddit discussions were checked for Next.js integration experience; official platform documentation determines the implementation:

- https://www.reddit.com/r/nextjs/comments/1aukgd6
- https://www.reddit.com/r/googleReviews/comments/ot6lm8
- https://developers.google.com/maps/documentation/places/web-service/place-details
- https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places
- https://developers.google.com/maps/documentation/places/web-service/policies
- https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list
- https://www.tripadvisor.com/business/insights/hotels/resources/display-rating-and-latest-tripadvisor-review-on-website

Published story sources are linked on each card. Google excerpts were already published on the existing AHV website; they are labelled September/October 2024, not represented as current API results. Kairali's official testimonials page and Healing Village profile PDF identify the archived guests and locations. Existing original YouTube thumbnails supply the guest imagery.
