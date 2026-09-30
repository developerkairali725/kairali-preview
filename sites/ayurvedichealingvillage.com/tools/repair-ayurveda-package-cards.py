"""EF-02 (owner English feedback, 26 Sep 2026): /ayurveda-package/ card hub.

The captured WordPress cards carried old programme names, titles that link
nowhere (titleHref "#") and images without links. This maps every card to the
approved current programme (english-candidate/final-rates/ayurveda.json, rate
build 20260925-R1): current approved name, working link on title and image.
'Treatment for Rheumatism' has no approved programme or page, so its card is
dropped (flagged in the EF-02 disposition). The four approved programmes the
old list lacked are appended with each programme page's own image.
Idempotent: a second run changes nothing. Serialization style of the file is
preserved (verified by an unmodified round-trip before writing).
"""
import json, sys
from urllib.parse import urlparse

DATA = "public/ahv/assets/article-family-data.js"
PREFIX = "window.AHV_ARTICLE = "
OLD_TO_ROUTE = {
    "Preventive & Regenerative Treatment": "/preventive-and-regenerative-treatment/",
    "Treatment for Sinusitis & Migraine": "/treatment-for-sinusitis-and-migraine/",
    "Treatment for Bronchial Diseases": "/treatment-for-bronchial-diseases/",
    "Kairali’s Eye Care": "/beauty-care-and-eye-care/",
    "Holistic Treatment for Rejuvenation &": "/holistic-treatment-for-rejuvenation-and-detoxification/",
    "Treatment to Remove Stress & Strain": "/treatment-to-remove-stress-and-strain/",
    "Treatment for Hypertension": "/treatment-for-hypertension/",
    "Treatment for Nervous Disability": "/treatment-for-nervous-disability/",
    "Revitalizing and Strengthening Treatment": "/revitalizing-and-strengthening/",
    "Weight Loss Programme": "/weight-loss-programme/",
    "Treatment for Slip Disc": "/treatment-for-slip-disc/",
    "Treatment for Arthritis & Spondylitis": "/treatment-for-arthritis-and-spondylitis/",
    "Treatment for Spondylitis": "/treatment-for-spondylitis/",
    "Treatment for Cervical Spondylitis": "/treatment-for-cervical-spondylosis/",
    "Treatment for Chronic Back Pain": "/treatment-for-chronic-back-pain/",
    "Post Pregnancy Health Programme": "/post-pregnancy-health-programme/",
    "Treatment for Skin Diseases": "/treatment-for-skin-diseases/",
    "Panchakarma Therapy": "/panchakarma-therapy/",
    "Treatment for Facial Paralysis": "/treatment-for-facial-paralysis/",
    "Treatment for Diabetes": "/treatment-for-diabetes/",
    "De-Addiction & Rehabilitation Treatment": "/de-addiction-and-rehabilitation-from-alcohol-drugs-tobacco/",
    "Treatment for Paralysis": "/treatment-for-paralysis/",
    "Treatment for Psoriasis": "/treatment-for-psoriasis/",
}
DROP = {"Treatment for Rheumatism"}
# the programme page's own image (its intro/og image), alt written from the image itself;
# displayed at the captured cards' 300 px thumbnail width (height = natural aspect)
ADD_IMAGES = {
    "/immunity-enhancement-executive-health-assessment-therapy/": ("/ahv/assets/img/immune.webp", "A woman in a green linen outfit raising her joined hands overhead in a yoga pose", 300, 304),
    "/sleep-restoration-therapy/": ("/ahv/assets/img/sleep-restoration.webp", "A therapist pouring a steady stream of warm herbal oil onto a patient's forehead during Shirodhara", 300, 200),
    "/womens-hormonal-balance-endocrine-therapy/": ("/ahv/assets/img/woman-hormonal-therapy.webp", "Two therapists pressing warm herbal poultices onto a patient lying on a wooden treatment table", 300, 200),
    "/personalized-customized-healing-program/": ("/ahv/assets/img/F-6.webp", "Two therapists massaging warm herbal oil into a patient's shoulders during an Ayurvedic oil treatment", 300, 214),
}

def dumps(o):
    return json.dumps(o, ensure_ascii=False)

text = open(DATA, encoding="utf-8").read()
assert text.startswith(PREFIX) and text.rstrip().endswith(";")
body = text[len(PREFIX):text.rstrip().rfind(";")]
doc = json.loads(body)
assert dumps(doc) == body, "serialization style differs; refusing to rewrite"

cat = json.load(open("english-candidate/final-rates/ayurveda.json", encoding="utf-8"))
approved = {}
for g in cat["groups"]:
    for p in g["programmes"]:
        approved[urlparse(p["url"]).path] = p["name"]

rec = next(r for r in doc["routes"] if r.get("path") == "/ayurveda-package/")
items = rec["items"]
cards = [i for i in items if i.get("kind") == "card"]
changed = 0
out = []
seen = set()
for it in items:
    if it.get("kind") != "card":
        out.append(it); continue
    t = it.get("title")
    if t in DROP:
        changed += 1; continue
    route = OLD_TO_ROUTE.get(t)
    if route is None:
        # already repaired: title is a current approved name
        route = next((r for r, n in approved.items() if n == t), None)
    if route is None or route not in approved:
        sys.exit(f"unmapped card title: {t!r}")
    name = approved[route]
    before = dumps(it)
    if "sourceTitle" not in it and t != name:
        it["sourceTitle"] = t
    it["title"] = name
    it["titleHref"] = route
    it["titleNoninteractive"] = False
    img = it.get("image")
    if img:
        img["linkHref"] = route
        img["noninteractive"] = False
        img["accessibleName"] = name
    it.setdefault("ef02", "Mapped to the approved current programme (EF-02, 26 Sep 2026; final-rates/ayurveda.json 20260925-R1).")
    if dumps(it) != before:
        changed += 1
    seen.add(route)
    out.append(it)
template = next(i for i in out if i.get("kind") == "card")
for route, name in approved.items():
    if route in seen:
        continue
    src, alt, w, h = ADD_IMAGES[route]
    card = {
        "kind": "card", "ptr": None, "title": name, "titleHref": route, "titleSourceHref": None, "titleNoninteractive": False,
        "image": {"kind": "figure", "ptr": None, "sourceUrl": None, "alt": alt, "width": w or template["image"]["width"], "height": h or template["image"]["height"],
                  "linkHref": route, "linkPtr": None, "accessibleName": name, "sourceHref": None, "noninteractive": False, "src": src, "layer": "ef02"},
        "body": None, "more": None,
        "ef02": "Added: approved programme missing from the captured list (EF-02, 26 Sep 2026); image = the programme page's own image.",
    }
    out.append(card); changed += 1; seen.add(route)
rec["items"] = out
counts = doc.get("articleFive", {}).get("cardCounts", {})
if "/ayurveda-package/" in counts:
    counts["/ayurveda-package/"] = sum(1 for i in out if i.get("kind") == "card")
assert all(r in seen for r in approved), "approved programme missing"
new = PREFIX + dumps(doc) + text[len(PREFIX) + len(body):]
if new != text:
    open(DATA, "w", encoding="utf-8").write(new)
print(f"cards before {len(cards)}, after {sum(1 for i in out if i.get('kind') == 'card')}, changed {changed}, approved {len(approved)}")
