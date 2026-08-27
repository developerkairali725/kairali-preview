# Fleet Bing Webmaster Tools wave

- Task: `WOPS-FLEET-BING-WEBMASTER-WAVE-001`
- Action date: 28 August 2026, Asia/Kolkata
- Completion class: `ACTION-COMPLETE / MONITOR-OPEN`
- Comparable units: 11 newly added properties, below the 25-unit cap

## Exact selection and result

The authenticated Bing account contained five properties before this wave:
Ayurvedic Healing Village, Abhilash KR, Kairali Products `.com`, the Voyagent
Sites property and Kairali Products `.in`. Google Search Console then exposed
12 other importable properties. The already-present Kairali Products `.in`
property was explicitly unchecked, leaving exactly 11 selected sites.

Bing displayed an unsuccessful bulk-import alert after processing. No retry was
made blindly. The authoritative property selector was reopened first and proved
that every one of the 11 intended properties had in fact been added. The final
selector contains 16 properties: the five before-state entries plus the 11
listed below, with no unintended or duplicate property.

| Property added | Search Console role | Immediate sitemap outcome |
|---|---|---|
| `https://whyayurveda.org/` | Administrator | 11 known; 0 errors; 0 warnings; two historical Success rows and nine imported Processing rows |
| `http://www.kairaliyoga.com/` | Administrator | one imported sitemap; Success; 65 URLs |
| `http://www.kairalitea.com/` | Administrator | no public sitemap exists; no submission |
| `http://www.arogyakendra.com/` | Administrator | no public sitemap exists; no submission |
| `https://theblushlounge.com/` | Administrator | canonical sitemap submitted once; Processing; 0 errors; 0 warnings |
| `https://arogyashala.in/` | Administrator | canonical sitemap submitted once; Processing; 0 errors; 0 warnings |
| `http://www.kairalihospitality.com/` | Administrator | imported sitemap Success; 36 URLs; existing discovered variants also Success |
| `http://www.kairalitraining.com/` | Read / Modify | no public sitemap exists; no submission |
| `https://villaraag.com/` | Read / Modify | existing sitemap index Success; 74 URLs |
| `http://www.kairaliayurvedainstitute.com/` | Read / Modify | no public sitemap exists; no submission |
| `http://www.keralatraining.com/` | Read / Modify | no public sitemap exists; no submission |

The four Read / Modify properties were not accepted merely because they
appeared in Search Console. The control workspace independently classifies the
three training properties as Kairali Group education sites and Villa Raag as a
controlled canonical site. Each property has its own evidence file; this index
does not substitute one site's evidence for another.

## Safeguards and monitors

- Google access remains Search Console view-only; the already-approved Bing
  connection was reused without requesting broader scopes.
- No website source, hosting, DNS, content, robots, analytics, advertising,
  Clarity, IndexNow key or URL-submission batch changed.
- No sitemap URL was guessed. Five legacy sites returned public `404` for
  `/sitemap.xml` and exposed no sitemap pointer in `robots.txt`; their Bing
  sitemap tables correctly remain empty.
- Bing may take up to 48 hours to populate new-property and sitemap reports.
  Accepted submissions must not be repeated during that window. Indexing and
  AI citations are not guaranteed.

