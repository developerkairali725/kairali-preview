# Abhilashkr technical SEO and security closure — pre-change evidence

Collected: 2026-08-27 20:13:20 IST

Task: `WOPS-ABHILASHKR-SEO-TECHNICAL-CLOSURE-001`
Source revision: `6e83b8722fc3539a915eab893c104637d61c47f7`

## Verified existing baseline

- Production serves 37 sitemap URLs with page-specific titles, descriptions, canonical URLs, reciprocal `hreflang`, Open Graph and Twitter metadata.
- Production already exposes `robots.txt`, `sitemap.xml`, `feed.xml`, `llms.txt`, Person/ProfilePage/FAQPage/BlogPosting structured data, consent-gated GA4, localized privacy notices, and the platform's HTTPS/HSTS boundary.
- The current production release passed 14/14 focused public Playwright checks and the 27 August PageSpeed run scored SEO 100 and Best Practices 100 on every successful report.

## Observed remaining technical gaps

- Public `/about` and `/de/ueber-mich` contain neither visible breadcrumb navigation nor `BreadcrumbList` structured data.
- The global structured-data surface publishes a standalone `Person` but no stable `WebSite` or top-level `Organization` entity graph.
- Public response headers include clickjacking, MIME-sniffing, referrer and permissions controls, but no Content Security Policy.
- The repository has no directly callable axe Playwright package or OWASP ZAP executable/image. Accessibility and security closure therefore needs deterministic browser semantics, Lighthouse accessibility, dependency/security gates and explicit disclosure that a full ZAP/manual WCAG certification remains separate.

## Approved bounded implementation

The owner instructed the agent to complete the remaining production-safe work and publish it. This change adds localized visible breadcrumbs and matching JSON-LD to every inner route, strengthens the stable site/person/organization/page entity graph, adds a tested production-compatible CSP and complementary headers, and adds focused browser coverage. It does not claim legal certification, accept third-party terms, create paid accounts, change analytics/consent behavior, or invent off-page SEO results.
