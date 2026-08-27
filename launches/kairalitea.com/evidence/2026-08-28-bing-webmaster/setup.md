# Kairali Tea Bing setup

- Task: `WOPS-FLEET-BING-WEBMASTER-WAVE-001`
- Property: `http://www.kairalitea.com/`
- Authority: Search Console Administrator plus the controlled KAPPL legacy-site
  record
- Result: property present in Bing after the import read-back

The public HTTPS homepage is `200`, but `/robots.txt` and `/sitemap.xml` return
`404`. Search Console exposed zero sitemap rows and Bing's Sitemaps table has no
data. No nonexistent sitemap was submitted. This preserves the live legacy site
boundary; adding a real sitemap remains separate release work.

