#!/usr/bin/env python3
"""Browseable list data (owner round 2):
- content/awards-browse.json: the 77 kairali.com award/recognition records enriched with a *source-stated* year,
  record type, entity scope and (for certifications) validity status; plus the certificates verified from scans.
- content/news.json: dated company news from whyayurveda.org (Awards, Events, CSR, Kairali Ayurveda Group),
  read from reference/whyayurveda-company-news.json (WordPress REST API capture, 29 Sep 2026).

Dating rule (never inferred): a year printed in the record title, else in the listing teaser, else an explicit
calendar date in the detail-page text. Otherwise the record is "Date not stated".
"""
import collections, json, os, re

HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.dirname(HERE)
C = os.path.join(REPO, "site", "content")
REF = os.path.join(REPO, "reference")
pages = json.load(open(os.path.join(C, "pages.json")))
awards = json.load(open(os.path.join(C, "awards-index.json")))
accr = json.load(open(os.path.join(C, "accreditations.json")))

YEAR = re.compile(r"\b(19[89]\d|20[0-2]\d)\b")
MONTHS = "January|February|March|April|May|June|July|August|September|October|November|December"
DATE = re.compile(rf"\b(\d{{1,2}})(?:st|nd|rd|th)?\s+(?:of\s+)?({MONTHS}),?\s+((?:19|20)\d\d)\b|\b({MONTHS})\s+(\d{{1,2}})(?:st|nd|rd|th)?,?\s+((?:19|20)\d\d)\b")
PEOPLE = re.compile(r"Abhilash|Abishek|Gita Ramesh|K\.?\s?V\.? Ramesh|K\.R\. Abhilash|Mrs\. Gita", re.I)

def record_type(t):
    tl = t.lower()
    if "nominat" in tl: return "Nomination"
    if "certificate of excellence" in tl: return "Award"
    if re.search(r"certif|accredit|nabh|\biso\b|registration|compliance|green leaf|fit premium|veggie|vegan", tl): return "Certification"
    if re.search(r"featured|\belle\b|lonely planet|national geographic|recommend|top 50|preferred partner|our pick|hip getaway", tl): return "Feature or listing"
    if PEOPLE.search(t): return "Leadership honour"
    return "Award"

def entity(t):
    tl = t.lower()
    if PEOPLE.search(t): return "Leadership"
    if re.search(r"healing village|health retreat|health resorts?|ayurvedic resort|health farm|hospitality sector|om beach", tl): return "The Ayurvedic Healing Village"
    if re.search(r"products|sanitizer", tl): return "Kairali Ayurvedic Products"
    if re.search(r"cent(er|re)\b|centre chain|chain", tl): return "Kairali Ayurvedic Centres"
    return "Kairali Ayurvedic Group"

items = []
for i, a in enumerate(awards):
    pg = pages.get(a["href"]) or {}
    year, basis, exact = None, "not stated", None
    for field, label in ((a["title"], "title"), (a["teaser"], "listing text")):
        m = YEAR.search(field)
        if m:
            year, basis = int(m.group(1)), label
            break
    if year is None:
        m = DATE.search(pg.get("text", ""))
        if m:
            year = int(m.group(3) or m.group(6)); basis = "date in record"; exact = m.group(0)
    typ = record_type(a["title"])
    items.append({
        "id": f"award-{i + 1}", "title": a["title"], "summary": a["teaser"], "href": a["href"], "image": a["image"],
        "year": year, "dateBasis": basis, "dateText": exact, "type": typ, "entity": entity(a["title"]),
        # a kairali.com record never states a current validity period, so certification records are "unknown"
        "validity": "unknown" if typ == "Certification" else None, "sourceOrder": i,
    })

certs = []
for c in accr["current"]:
    certs.append({"id": "cert-" + c["number"], "title": c["name"], "summary": f"{c['issuer']}. {c['scope']}.", "holder": c["holder"],
                  "href": c["image"], "image": {"src": c["image"], "w": c["w"], "h": c["h"], "alt": f"{c['name']} certificate {c['number']}"},
                  "year": int(c["validFrom"][:4]), "dateBasis": "certificate", "validFrom": c["validFrom"], "validTo": c["validTo"],
                  "number": c["number"], "type": "Certification", "entity": "The Ayurvedic Healing Village", "validity": "current"})
for c in accr.get("notShownAsCurrent", []):
    certs.append({"id": "cert-ayur-diamond", "title": c["name"], "summary": c["reason"] + ".",
                  "holder": "Kairali Ayurvedic Health Resorts Pvt. Ltd., Olassery P.O., Kodumbu, Palakkad",
                  "href": None, "image": None, "year": 2023, "dateBasis": "certificate", "validFrom": "2023-07-24", "validTo": "2026-07-23",
                  "number": "M3-7700/2023", "type": "Certification", "entity": "The Ayurvedic Healing Village", "validity": "historical"})
json.dump({"checked": "2026-09-29", "records": items, "certificates": certs}, open(os.path.join(C, "awards-browse.json"), "w"), indent=1, ensure_ascii=False)

news = json.load(open(os.path.join(REF, "whyayurveda-company-news.json")))
out = [{"id": f"wa-{p['id']}", "title": p["title"], "date": p["date"][:10], "year": int(p["date"][:4]), "url": p["link"], "categories": p["cats"],
        "summary": (p["excerpt"][:220].rsplit(" ", 1)[0] + "…") if len(p["excerpt"]) > 220 else p["excerpt"]} for p in news["posts"]]
json.dump({"source": news["source"], "checked": news["checked"], "items": out}, open(os.path.join(C, "news.json"), "w"), indent=1, ensure_ascii=False)

print("awards", len(items), dict(collections.Counter(x["type"] for x in items)), "undated", sum(1 for x in items if x["year"] is None))
print("entities", dict(collections.Counter(x["entity"] for x in items)))
print("certs", [(c["title"][:30], c["validity"]) for c in certs], "| news", len(out))
