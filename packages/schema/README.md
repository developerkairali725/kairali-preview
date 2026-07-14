# @kairali/schema

Typed JSON-LD builders per template: Organization + entity type (MedicalClinic/LocalBusiness/Product/Article), BreadcrumbList, FAQPage where Q&A exists, Person for bylines, MedicalWebPage condition template (doctor-bylined, Dr. Deepu John sign-off lane). Checklist item A8.

## API (v0.2, extracted from arogyakendra.com 14 Jul 2026)
Builders: `graph`, `serializeJsonLd` (escapes `<`), `organization`,
`kairaliOrganization` (locked facts prefilled from @kairali/compliance/rules),
`webSite`, `breadcrumbList`, `faqPage`, `person`, `physician`, `article`,
`medicalWebPage` (Dr. Deepu John sign-off lane), `medicalClinic`,
`localBusiness`, `product` (offers point at Shopify — checkout never built
here). Undefined fields are stripped: a missing fact stays ABSENT, never
null/"". Tests: `pnpm --filter @kairali/schema test`.
