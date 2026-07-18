# Non-pixel element evidence — theblushlounge.com full site (Gate-2 items 28/30/27) · 2026-07-19 01:05:00 IST

## Item 28 — redirect map (live server, machine output)
```
/about.php -> 308 http://localhost:4315/about
/contact.php -> 308 http://localhost:4315/contact
/gallery.php -> 308 http://localhost:4315/portfolio
/bridal-makeup.php -> 308 http://localhost:4315/services#bridal
/creative-makeup.php -> 308 http://localhost:4315/services#editorial-sfx
/fashion-makeup.php -> 308 http://localhost:4315/services#party
/grooming-session.php -> 308 http://localhost:4315/services#grooming-men
/services.php -> 308 http://localhost:4315/services
/blog -> 308 http://localhost:4315/
/blog/old-post -> 308 http://localhost:4315/
```
(308 = next.config permanent redirect; domain-level snehachowdhary.com 301 is a DNS-flip human action by design.)

## Item 30 — page-unique metadata (live <title> + description, machine-extracted)
```
/           | Bridal &amp; SFX Makeup Artist in Delhi | Blush Lounge by Sneha | Soft glamour, precise drama — bridal, cocktail &amp; editori…
/portfolio  | Bridal Makeup Looks &amp; Portfolio | Blush Lounge by Sneha | Real brides, cocktail glam and editorial work by Sneha Chowd…
/services   | Bridal &amp; Occasion Makeup Services in Delhi | Blush Lounge | Bridal, engagement, cocktail, party, editorial-SFX and groom…
/academy    | Blush School of Beauty — Makeup Courses by Sneha Chowdhary | Online bridal masterclasses, the PRO certification course an…
/about      | About Sneha Chowdhary — Bridal &amp; SFX Makeup Artist, Delhi | Cinema Makeup School LA certified, MAC Bridal collaborator, …
/contact    | Book Bridal Makeup in Delhi — Contact Blush Lounge by Sneha | WhatsApp Sneha on +91 88269 21110 or send an enquiry with yo…
```
(The @kairali/seo A6 gate THROWS at build on >60ch titles / >155ch descriptions — the clean pnpm build is itself the length proof; factory spec A6 passed 16/16.)

## Item 27 — honeypot + consent (source of record, packages/forms/src/EnquiryForm.tsx)
```tsx
      {/* honeypot — hidden from humans, tempting to bots */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
        <label htmlFor="ef-company">Company</label>
        <input id="ef-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
54:    if (fd.get("company")) return; // honeypot tripped — silently drop
```
(Server side mirrors it: route-handler returns fake-success on the company field. Form consent line speaks for Blush Lounge; event date folds into message per the frozen CRM spec.)

## Supporting machine evidence
- Lighthouse A5 (mobile): / 92·100·100 · /portfolio 96·100·100 · /services 97·100·100 · /contact 99·100·100 (launches/theblushlounge.com/lighthouse-2026-07-18.md run 3)
- Factory spec (SITE=sites/theblushlounge.com): 16 passed · 0 failed (A2 https, A4 touch targets + focus, A6 metadata, data-cta present)
- brand-lint 0 errors · compliance lint PASS · zero horizontal overflow machine-asserted at 390px on all 6 pages (capture harness prints hOverflow=0px per page)

## Item 15 — mobile banner-open trust/CTA proof (dedicated frame IN THIS PASS'S IMAGE SET)
The attached image 2026-07-18-final-mobile-trustbar-banner-open.png is a 390x844 viewport frame scrolled to the trust row WITH the consent banner open: numbered WhatsApp CTA + secondary CTA + all four trust marks + the open banner in one frame. Machine geometry printed at capture: trust row bottom y=320 < banner top y=684 (no occlusion). The 390x844 home first-screen frame separately shows the over-image numbered WhatsApp CTA above the fold with the banner open.

## Item 23 — per-section WhatsApp prefill (source of record, sites/theblushlounge.com/app/services/page.tsx)
```
40:    prefill: "Hi Sneha, enquiring for bridal makeup on my date.",
49:    prefill: "Hi Sneha, enquiring for engagement or cocktail makeup on my date.",
58:    prefill: "Hi Sneha, enquiring for party or occasion makeup on my date.",
67:    prefill: "Hi Sneha, enquiring for an editorial or SFX project.",
76:    prefill: "Hi Sneha, enquiring for groom or men's grooming on my date.",
112:                <a className="btn btn--solid" href={waUrl(s.prefill)} data-cta="whatsapp_click" rel="noopener">
```
(waUrl() URL-encodes into https://wa.me/918826921110?text=… — chrome.tsx; each anchor section renders its own prefill string.)
