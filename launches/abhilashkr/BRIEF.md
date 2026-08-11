# Abhilash personal entity hub — 77-gate pilot brief

**Task:** `WOPS-ABHILASHKR-LAUNCH-001`  
**Owner direction:** 11 August 2026, in this Codex task  
**Site:** `abhilashkr.com`  
**Class:** organic / personal entity hub (`ED` register)

## Outcome

Make the existing live personal site easier to find and pleasant to use, close
the incomplete launch cards against the unified 77-gate registry, and publish
real German and French page equivalents for the language choices already shown
in the header.

## Audience

- people verifying Abhilash Kalathil Ramesh and his current roles;
- institutional, media and speaking contacts;
- founders whose proposals match the published investment themes;
- English, German and French readers researching Kairali-related entities.

## Locked release decisions

- English stays at the root and is `x-default`.
- German uses `/de` and meaningful German slugs; French uses `/fr` and
  meaningful French slugs.
- Entity names, awards and organization distinctions are preserved, not
  embellished in translation.
- The one published English essay remains English-only. Four source files with
  `draft: true` must be unreachable and absent from the sitemap.
- No ad spend, pixel, chatbot, CRM, medical enquiry channel, invented listing,
  address, hours or stronger claim is introduced.
- GA4 remains off until the owner completes Google's owner-binding acceptance
  and the approved privacy/consent release lane.
- Healthy production DNS is not changed for a content release.

## Success measures

- clean Next.js production build without a remote font fetch;
- zero broken internal targets and no mobile horizontal overflow;
- reciprocal English/German/French `hreflang` plus localized `html lang`;
- unique titles, descriptions and canonicals on all sitemap URLs;
- schema parses on all sitemap URLs;
- Lighthouse budgets pass on English home, an article and both locale homes;
- protected GitHub/Vercel preview and rollback target recorded;
- Deepu receives an honest 77-gate handoff with open human/vendor items loud.
