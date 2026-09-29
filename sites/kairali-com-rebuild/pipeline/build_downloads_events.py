#!/usr/bin/env python3
"""Download-centre and events data.
- Current editions: parsed from the owner-supplied portal https://kairali-documents.vercel.app/?property=all
  (captured 29 Sep 2026 to local-build/_work/fetch/portal.html).
- Product catalogues: five owner-approved R01 editions, public on the portal (owner update 29 Sep 2026).
- Earlier editions: the 72 legacy kairali.com documents, self-hosted at their exact legacy URLs.
- Events: whyayurveda.org WordPress REST API responses captured 29 Sep 2026."""
import html, json, os, re
from bs4 import BeautifulSoup
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.dirname(HERE)
LB = HERE
while not os.path.isdir(os.path.join(LB, "_work", "fetch")):
    LB = os.path.dirname(LB)
FETCH = os.path.join(LB, "_work", "fetch")
CONTENT = os.path.join(REPO, "site", "content")
PORTAL = "https://kairali-documents.vercel.app"
LANG = {"English": "en", "Hindi": "hi", "German": "de", "French": "fr", "Spanish": "es", "Italian": "it", "Portuguese": "pt", "Dutch": "nl",
        "Russian": "ru", "Arabic": "ar", "Chinese (Simplified)": "zh", "Japanese": "ja", "Korean": "ko"}

soup = BeautifulSoup(open(os.path.join(FETCH, "portal.html"), encoding="utf-8").read(), "lxml")
current = []
for sec in soup.select("section.property-collection"):
    prop = sec.get("data-collection")
    prop_name = sec.select_one("h2").get_text(" ", strip=True)
    for card in sec.select("details.card"):
        if "review-card" in (card.get("class") or []):
            continue
        title = card.select_one("h3").get_text(" ", strip=True)
        eds = []
        for tr in card.select("tbody tr"):
            a = tr.select_one("a.download")
            if not a:
                continue
            edtxt = tr.select_one("td.edition").get_text("\n", strip=True).split("\n")
            size = tr.select_one("small")
            eds.append({"language": tr.get("data-language") or tr.select_one("th").get_text(strip=True), "currency": tr.get("data-currency") or "",
                        "edition": edtxt[0] if edtxt else "", "validity": edtxt[1] if len(edtxt) > 1 else "",
                        "url": PORTAL + a["href"], "size": size.get_text(strip=True) if size else ""})
        current.append({"id": card.get("id"), "property": prop, "propertyName": prop_name, "title": title, "editions": eds, "status": "current"})

# Product catalogues: owner update 29 Sep 2026 — all five R01 editions published publicly on the portal.
# Evidence: Kairali-Claude-Design-Handoff/handoff/product-catalogues-public-verification.json (HTTP 200, application/pdf, SHA-256),
# re-checked here by HEAD request (200, identical byte counts).
PROJ = os.path.dirname(LB)
ver = {v["filename"]: v for v in json.load(open(os.path.join(PROJ, "Kairali-Claude-Design-Handoff", "handoff", "product-catalogues-public-verification.json")))}
def ked(fn, cur, pages):
    v = ver[fn]
    return {"language": "English", "currency": cur, "edition": "R01 · W.e.f. 28 Sep 2026", "validity": pages, "url": v["url"],
            "size": f"{v['bytes'] / 1048576:.1f} MB" if v["bytes"] > 1048576 else f"{round(v['bytes'] / 1024)} KB", "sha256": v["sha256"]}
products = [
    {"id": "kappl-retail", "property": "kappl", "propertyName": "Kairali Ayurvedic Products", "title": "Retail catalogue", "status": "current",
     "editions": [ked("KAPPL-RET-INR-20260928-R01.pdf", "INR", "48 pages"), ked("KAPPL-RET-USD-20260928-R01.pdf", "USD", "44 pages")]},
    {"id": "kappl-wholesale", "property": "kappl", "propertyName": "Kairali Ayurvedic Products", "title": "Wholesale catalogue", "status": "current",
     "editions": [ked("KAPPL-WHL-INR-20260928-R01.pdf", "INR", "15 pages"), ked("KAPPL-WHL-USD-20260928-R01.pdf", "USD", "15 pages")]},
    {"id": "kappl-manufacturing", "property": "kappl", "propertyName": "Kairali Ayurvedic Products", "title": "Contract manufacturing", "status": "current",
     "editions": [ked("KAPPL-CM-NA-20260928-R01.pdf", "Quotation-based", "5 pages")]},
]

legacy = json.load(open(os.path.join(CONTENT, "legacy-docs.json")))
def cur_of(n):
    for k, v in (("EURO", "EUR"), ("Euro", "EUR"), ("INR", "INR"), ("USD", "USD")):
        if k in n: return v
    return ""
def period_of(n):
    m = re.search(r"wef-(\d\d)-(\d\d)-(\d\d)to(\d\d)-(\d\d)-(\d\d)", n)
    if m: return f"1 Apr 20{m.group(3)} – 31 Mar 20{m.group(6)}"
    m = re.search(r"(20\d\d)[-–](20)?(\d\d)", n)
    if m: return f"{m.group(1)}–{('20' + m.group(3)) if len(m.group(3)) == 2 else m.group(3)}"
    m = re.search(r"(?<!\d)(\d\d)-(\d\d)(?=\.pdf|\)|$)", n)
    if m and int(m.group(2)) == int(m.group(1)) + 1: return f"20{m.group(1)}–20{m.group(2)}"
    m = re.search(r"(20\d\d)", n)
    if m: return m.group(1)
    return ""
ACRONYMS = {"INR", "USD", "EUR", "EURO", "CSR", "KTAHV", "APAI", "PDF", "ISO", "NABH"}
def natural_label(t):
    """Readable label from a legacy filename: ALL-CAPS words become sentence case, acronyms stay (filenames untouched)."""
    words = t.split()
    out = []
    for i, w in enumerate(words):
        core = re.sub(r"[^A-Za-z]", "", w)
        if core.isupper() and len(core) > 2 and core not in ACRONYMS:
            w = w.lower() if out else w.capitalize()
        elif core == "wef":
            w = "w.e.f."
        out.append(w)
    s = " ".join(out)
    return s[:1].upper() + s[1:]

GROUPS = [
    ("ahv-ayurveda-earlier", "ahv", "Ayurveda programme rates", r"Rates-of-Ayurveda|KTAHV-Ayurveda-Packages"),
    ("ahv-yoga-earlier", "ahv", "Yoga & meditation programme rates", r"Yoga"),
    ("ahv-admission-earlier", "ahv", "Admission & accommodation tariffs", r"Admission-Tariff|Accomodation-Tariff"),
    ("raag-earlier", "villa-raag", "Villa Raag brochures & room tariffs", r"Villa[-_ ]Ra"),
    ("kappl-prices-earlier", "kappl", "Product price lists", r"PRICE-LIST|Price-List-2019|Product-Price"),
    ("kappl-catalogues-earlier", "kappl", "Product catalogues, manuals & lists", r"Catalogue|Product-Manual|Beauty|Oil-Prod|patent|classical|full-list|skin-care|BULK"),
    ("ahv-profile-earlier", "ahv", "Healing Village profiles & brochures", r"Healing-Village|healing-village|KTAHV_Presentation|healing-secrets"),
    ("centres-earlier", "centres", "Treatment centre brochures & price card", r"Centre|centres"),
    ("group-earlier", "group", "Group profiles, awards, CSR & training", r"."),
]
earlier = {g[0]: {"id": g[0], "property": g[1], "title": g[2], "status": "earlier", "editions": []} for g in GROUPS}
for d in legacy:
    name = os.path.basename(d["path"])
    for gid, _, _, rx in GROUPS:
        if re.search(rx, name, re.I):
            label = re.sub(r"\s*w\.e\.f\..*$", "", natural_label(re.sub(r"[-_]+", " ", os.path.splitext(name)[0]).strip()))
            earlier[gid]["editions"].append({"label": label, "url": d["path"], "bytes": d["bytes"], "sha256": d["sha256"], "currency": cur_of(name),
                                             "period": period_of(name), "rates": "price" in (d.get("reviewFlag") or "") or "Tariff" in name or "Rates" in name or "Price" in name,
                                             "format": os.path.splitext(name)[1][1:].upper()})
            break
earlier_list = [e for e in earlier.values() if e["editions"]]
for e in earlier_list:
    e["editions"].sort(key=lambda x: (x["period"] or "0000", x["label"]), reverse=True)
json.dump({"portal": PORTAL + "/?property=all", "checked": "2026-09-29", "current": current + products, "earlier": earlier_list},
          open(os.path.join(CONTENT, "downloads.json"), "w"), indent=1, ensure_ascii=False)
print("current", len(current), "editions", sum(len(c["editions"]) for c in current), "| products", len(products), "| earlier", len(earlier_list), sum(len(e["editions"]) for e in earlier_list))

# ------------------------------------------------------------------ events & recognitions
TODAY = "2026-09-29"
def clean(t): return html.unescape(re.sub(r"<[^>]+>", "", t)).strip()
ev = json.load(open(os.path.join(FETCH, "wa-events.json")))
events = [{
    "title": "From Self to Team to Community to Nature: Kairali Marks Its World Wellness Weekend Debut",
    "url": "https://whyayurveda.org/world-wellness-weekend-2026-kairali/", "published": "2026-09-17",
    "start": "2026-09-18", "end": "2026-09-20", "place": "Kairali – The Ayurvedic Healing Village, Palakkad, Kerala",
    "summary": "Kairali – The Ayurvedic Healing Village took part in World Wellness Weekend for the first time, with five complimentary activities for in-house guests, team members and an invited local community group under the theme “From Self to Team to Community to Nature.”",
}]
for p in ev:
    events.append({"title": clean(p["title"]["rendered"]), "url": p["link"], "published": p["date"][:10], "start": "", "end": "", "place": "",
                   "summary": re.sub(r"\s+", " ", clean(p["excerpt"]["rendered"]))[:260].rsplit(" ", 1)[0] + "…"})
for e in events:
    last = e["end"] or e["published"]
    e["status"] = "upcoming" if last > TODAY else "past"
events.sort(key=lambda e: e["start"] or e["published"], reverse=True)
news = [{"title": clean(p["title"]["rendered"]), "url": p["link"], "published": p["date"][:10],
         "summary": re.sub(r"\s+", " ", clean(p["excerpt"]["rendered"]))[:240].rsplit(" ", 1)[0] + "…"}
        for p in json.load(open(os.path.join(FETCH, "wa-news.json")))]
json.dump({"source": "https://whyayurveda.org/ (WordPress REST API, checked 2026-09-29)", "today": TODAY, "events": events, "recognitions": news},
          open(os.path.join(CONTENT, "events.json"), "w"), indent=1, ensure_ascii=False)
print("events", len(events), "upcoming", sum(e["status"] == "upcoming" for e in events), "recognitions", len(news))
