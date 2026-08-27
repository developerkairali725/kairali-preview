# Arogya Kendra Bing setup

- Task: `WOPS-FLEET-BING-WEBMASTER-WAVE-001`
- Property: `http://www.arogyakendra.com/`
- Authority: Search Console Administrator plus the controlled Kairali Group
  canonical legacy-site record
- Result: property present in Bing after the import read-back

The public HTTPS homepage is `200`, but both `/robots.txt` and `/sitemap.xml`
return `404`. Search Console reported zero sitemaps and Bing's authoritative
Sitemaps page reads no known sitemap/data rows. Nothing was submitted because
there is no proved canonical sitemap URL. Creating a sitemap is a separate
site-runtime/SEO release, not a Bing-dashboard substitute.

