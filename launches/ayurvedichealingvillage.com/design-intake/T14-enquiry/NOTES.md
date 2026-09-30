# T14 ENQUIRY — Claude Design output, its own comments (2026-09-21 IST)

**Note:** a 7-Sep `AHV Page Enquiry Desktop/Mobile.dc.html` pair already existed and is wired
(`enquiry-family`). This 21-Sep run regenerated the family to the standing brief. Both exist;
the newer one is the one built to the 18px body / 45+ reader ruling (D-20260921-14).

**Files (3):** `AHV Template Forms Family Desktop.dc.html`, `…Mobile.dc.html`, plus a data/render file.
Its self-check was interrupted twice by the agent navigating the tab — a rule violation, recorded.

## Its strain note — verbatim
> Where it strains: the desktop trust rail is sticky at 372px — with a short field set (apply-now,
> consultation) the rail outruns the form and leaves whitespace at the foot of the right column;
> everything else is flow and just gets longer or vanishes.

## Its extremes handling — verbatim
> Content extremes are live as tweaks. The `variant` prop switches between the 871-word enquiry
> page, the 19-word consultation (form only, prose region gone) and apply-now (zero words, CV
> upload, no prose). The `language` prop swaps every label, hint and error to French to test wrapping.

## Audit findings (agent, by eye — code was not exportable)
- Motifs match the site: cream canvas, Marcellus h1, exact eyebrow, gold diamond bullets, 4px, green links, real photography with caption.
- Locked facts correct (+91 92898 38797, info@kairali.com). No banned words seen. `[TO CONFIRM]` ×3 for response time / patient-care hours.
- "Prototype — no endpoint is wired in this file." — honest.
- **Not approved by the agent, for the owner:** operational promises in DRAFT copy ("logged the same day", "clinical questions go to an Ayurvedic doctor before anyone replies"); hint text is the smallest, greyest type on the page; the named rail strain hits `/apply-now/` and `/online-consultation/`; split phone input narrow at 390.
