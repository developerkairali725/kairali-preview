# Sightseeing consolidation — 24 September 2026

Task: WOPS-AHV-FINAL-DRAFT-20260924-001. Owner explicitly approved merging the four distance pages into /sightseeing/, retaining distinct activity pages. English only as requested.

All 22 destinations retained once, with edited descriptions. Removed outdated fixed-band distances and unsupported visitor/medical promises (including mandatory walking inside Silent Valley and curative claims for Guruvayur). Incorrectly matched legacy photographs are not reused as destination photographs. This is a text-led guide. Private original datasets/backups retain provenance.

## Distance method
Origin: Kairali destination point 10.7280291,76.7117249 from the site's existing Google Maps directions embed in travel-family-data.js (not the map viewport centre). One-time OpenStreetMap Nominatim lookups, cached and single-threaded at no more than one request/second. OSRM car routing via routing.openstreetmap.de; full route responses saved in the workspace evidence. Road estimates are one-way, rounded to nearest km below20km and nearest5km above. Each page entry names its endpoint; walking/forest transport and onward local travel are excluded. This is routing research, not physical measurement or a guarantee that roads/attractions are open.

| Destination | Routed km | Published approx. km | Endpoint |
|---|---:|---:|---|
| Thiruvalathoor Temple | 6.02 | 6 | Temple approach |
| Chittur Gurumadam | 7.36 | 7 | Gurumadam approach |
| Thenari Sree Rama Temple | 9.16 | 9 | Sree Rama Theertham approach |
| Palakkad Fort · Tipu’s Fort | 10.19 | 10 | Fort road approach; walk to entrance |
| Jainimedu Jain Temple | 13.72 | 14 | Temple approach |
| Kalpathy Shiva Temple | 15.51 | 16 | Vishwanatha Swamy temple |
| Kerala Kalamandalam | 64.97 | 65 | Campus road approach |
| Thiruvegappura Sankaranarayana Temple | 79.04 | 80 | Temple approach |
| Thrithala | 80.12 | 80 | Thrithala village centre |
| Guruvayur | 98.19 | 100 | Road approach near Sree Krishna temple |
| Fantasy Park | 19.02 | 19 | Park entrance approach |
| Malampuzha Rock Garden | 19.29 | 19 | Rock Garden approach |
| Malampuzha Dam & Gardens | 20.67 | 20 | Dam approach |
| Meenkara Dam | 21.15 | 20 | Dam road approach |
| Pothundy Dam | 35.30 | 35 | Dam approach |
| Meenvallam Waterfalls | 39.96 | 40 | Nearest mapped road; final walk extra |
| Mangalam Dam | 44.90 | 45 | Dam approach |
| Kanjirapuzha Dam & Garden | 47.23 | 45 | Visitor garden approach |
| Nelliyampathy | 54.13 | 55 | Nelliyampathy village |
| Silent Valley National Park | 62.93 | 65 | Mukkali; park transport extra |
| Parambikulam Tiger Reserve | 66.02 | 65 | Anappady information centre approach |
| Attappadi | 67.89 | 70 | Agali road approach |

## Sources and endpoint decisions
- https://operations.osmfoundation.org/policies/nominatim/ — policy disclosed before geocoding; cache retained.
- https://routing.openstreetmap.de/ and https://project-osrm.org/docs/v5.24.0/api/ — route distance, not straight-line distance. Website has no geocoding/routing API dependency.
- https://www.keralatourism.org/destination/meenvallam-waterfalls-palakkad/554/ — official source embeds10.9225194,76.5910097; routing snaps228m to mapped road; page explicitly excludes final walk.
- https://mapcarta.com/W798620250 and https://wikimapia.org/1622122/Thenari-Theertham-Sree-Rama-Temple — matching Thenari Sree Rama spring coordinates; rejected Nominatim's nearby Shiva temple as a different destination.
- https://en.wikipedia.org/wiki/Jainimedu_Jain_temple —10.785667,76.642556, corroborated by geographic listings.
- https://www.keralatourism.org/destination/malampuzha-dam-garden-palakkad/124/ — official current garden closure notice, dam/ropeway open. Both related entries link the current notice.
- https://www.keralatourism.org/malabar/silent-valley-national-park/39 — Mukkali entry and arranged onward park transport; rejected reserve-polygon coordinate.
- https://www.parambikulam.org/ContactUs — Anappady visitor information centre. Coordinates corroborated at https://elevation.maplogs.com/poi/parambikulam_tiger_reserve_anappady_parambikulam_road_muthalamada_south_kerala_india.545541.html . Detailed route response follows Anaimalai–Sethumadai–Parambikulam Road; not a forest-centre straight-line shortcut.
- Attappadi: Agali village approach, maximum road-snap662m; rounded70km. Broad region explicitly not assigned a single exact distance.
- Other coordinate selections: cached Nominatim named-place responses; Kanjirapuzha park endpoint, Mangalam dam (not reservoir centroid), Kalpathy Vishwanatha Swamy temple and Guruvayur Sree Krishna temple selected over similarly named results.

## Implementation and release scope
Four explicit301s, direct internal links, search keywords for all22places, generated rail/tree/visitor sitemap and XML sitemap exclusion. Native server-rendered CollectionPage/ItemList. Old source templates remain provenance behind redirects and are not served as content. Exact originals verified against parent1313febc2717ecdef16ceb7b3f58b00f605ec650. Revert this scoped commit to restore the prior candidate; no database, DNS, forms, consent or production changes.
