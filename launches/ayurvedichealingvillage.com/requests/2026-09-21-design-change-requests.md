# Design change requests — AHV English, 2026-09-21

**Status: OPEN, with the designer. Nothing in the build changes until the design does.**

Owner ruling, 2026-09-21, in-chat: *neither — the design stands.* Both items below came from
Deepu (web developer, not the designer). MODE A makes the supplied design the authority and the
agent implements it faithfully; it does not restyle it because a developer asked. The owner was
shown both, measured, and ruled that they go to the designer as change requests rather than being
applied.

That is a ruling about AUTHORITY, not about whether the items have merit. Item 2 in particular is
a real gap and is recorded as such.

---

## CR-1 · Contact form field order (`/contact-us/`, enquiry family)

**Requested:** email and phone on the same row, as the first row.

**As built, measured in the rendered page:**

```
1  text      fname          "e.g. Anjali Menon"
2  text      country_code
3  tel       phone          "98765 43210"
4  textarea  programme
5  email     email          "you@example.com"
6  textarea  message
```

So phone (3) and email (5) are not adjacent — `programme` sits between them.

**Assessment:** this is a layout preference against an approved design. No defect: the fields are
labelled, ordered coherently, and every control has a placeholder and an autocomplete attribute.
Nothing is broken and nothing is inaccessible. If the designer wants the pairing, it is a design
change and the build follows it.

## CR-2 · No contact affordance in the header

**Requested:** "header should have a contact option".

**As built, measured — CONFIRMED, and this one is a functional gap:**

```
header links : Ayurveda Treatment · Villas · Yoga & Training · Offers · About Us
header action: "Book Your Stay" → https://bookings.ayurvedichealingvillage.com/
```

The header's ONLY action on every one of the 254 routes sends the visitor **off the site** to the
bookings subdomain. There is no call, no WhatsApp and no contact link in the header anywhere.

**Assessment:** on a hospital site whose audience skews 45+/55+, a visitor who wants to *ask
something* rather than book has no affordance in the persistent chrome — they have to find their
way to `/contact-us/` through the body. The locked number (+91 92898 38797) and `info@kairali.com`
already appear elsewhere on the site, so nothing new would need inventing.

**Recommended to the designer:** a secondary action beside "Book Your Stay" — a call or WhatsApp
link on the locked number — at ≥44px and AA contrast, so the primary booking CTA keeps its
prominence. The agent has NOT built this; it needs the designer's treatment and the owner's
approval of the changed header, which appears on every page.

---

## How this closes

The designer specifies; the owner approves the changed design; the build then implements it
faithfully. Until then the header and the form ship exactly as approved.
