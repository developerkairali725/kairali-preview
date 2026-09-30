"""EF-10 (owner feedback, 26 Sep 2026): /experience/ recovers the upgraded house-rule images.
All eight cards showed the same 100px alcohol-free icon. The owner-approved 2026 illustrations
(commit 04df2a60 'Refresh eight house-rule illustrations') are used on each child page; each card
now shows its own page's illustration (alt text as on that page), linked to that page. In-house
products has no illustration; it shows the product-gallery photo of the full Kairali range.
Cards use 360x240 derivatives (<name>-360.webp) of the same images: the rail stylesheet lets an
article image grow to its natural width (up to 480px tall), which made eight 709px cards.
Also corrects 'The Ayurvedic care Village' (twice) to the property name. Idempotent."""
import json
P = "public/ahv/assets/article-family-data.js"; PREFIX = "window.AHV_ARTICLE = "
HR = "/ahv/assets/img/house-rules/"
CARDS = {
    "Alcohol Free": ("/alcohol-free/", HR + "alcohol-free-2026.webp", "Illustration of a water jug, drinking glasses and lime"),
    "No Smoking": ("/no-smoking/", HR + "no-smoking-2026.webp", "Illustration of a smoke-free garden with a no-smoking symbol"),
    "No Caffeine": ("/no-caffeine/", HR + "no-caffeine-2026.webp", "Illustration of a herbal infusion with ginger and tulsi"),
    "Vegetarian": ("/vegetarian/", HR + "vegetarian-2026.webp", "Illustration of a vegetarian meal on a banana leaf"),
    "In House Products": ("/in-house-products/", "/ahv/assets/img/gallery-2026/product/range-product-full-kairali-personal-care-01.webp",
                          "The full Kairali personal-care range — Kairtis tin; gift box; Kairpack; Neem and Sandal bars; Herbal Infusion; lotions"),
    "No Preservatives": ("/no-preservatives/", HR + "no-preservatives-2026.webp", "Illustration of fresh vegetables, leafy greens and pumpkin"),
    "No Refridgeration": ("/no-refridgeration/", HR + "no-refridgeration-2026.webp", "Illustration of a freshly prepared warm vegetable meal"),
    "Organic Farming": ("/organic-farm/", HR + "organic-farm-2026.webp", "Illustration of a vegetable garden and bottle-gourd trellis"),
}
t = open(P, encoding="utf-8").read(); body = t[len(PREFIX):t.rstrip().rfind(";")]
d = json.loads(body); dumps = lambda o: json.dumps(o, ensure_ascii=False)
assert dumps(d) == body
r = next(x for x in d["routes"] if x["path"] == "/experience/")
n = 0
for it in r["items"]:
    if it.get("kind") != "card": continue
    route, src, alt = CARDS[it["title"]]
    im = it["image"]
    thumb = src.replace(".webp", "-360.webp")  # 360x240 derivative of the same approved image (dwebp | sips -Z 360 | cwebp -q 82)
    im.update({"src": thumb, "alt": alt, "width": 360, "height": 240, "linkHref": route, "noninteractive": False,
               "accessibleName": it["title"], "ef10": "26 Sep 2026: page's own 2026 image (was one repeated 100px icon)"})
    n += 1
s = dumps(r)
fixed = json.loads(s.replace("Ayurvedic care Village", "Ayurvedic Healing Village"))
d["routes"][d["routes"].index(r)] = fixed
new = PREFIX + dumps(d) + t[len(PREFIX) + len(body):]
if new != t: open(P, "w", encoding="utf-8").write(new)
print("cards", n, "changed", new != t, "typo left", new.count("Ayurvedic care Village"))
