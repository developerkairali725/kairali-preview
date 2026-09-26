"""EF-09 (owner feedback, 26 Sep 2026): /ayurvedic-cuisine/ related-page cards.
The four captured cards all carried the same unrelated image (a World Luxury Spa Awards 2020 plaque,
the WordPress placeholder) and linked nowhere. Each card now links (image + label) to the page it
names, and shows an image that page already uses (approved assets, alt preserved):
  What is Ayurvedic food?  -> dining photo from the 2026 retreats gallery bank (the target page has
                              only the shared aerial banner; the meal photo fits the card)
  Ayurvedic restaurant     -> meal photo from the 2026 photo gallery (the page's own image is portrait
                              400x420 and broke the row; landscape keeps the four cards even)
  Organic farm, Animal husbandry -> each page's own 2026 illustration. Idempotent."""
import json, hashlib

CARDS = {
    "What is ayurvedic food?": ("/what-is-ayurvedic-food/", "/ahv/assets/img/gallery-2026/retreats/dining-food-ayurvedic-dietary-meal-02.webp",
        "Ayurvedic dietary meal on a wooden tray: red (matta) rice in a square dish with three small bowls of curry", 1600, 1066),
    "Ayurvedic Restaurant & Cooking at Healing Village": ("/ayurvedic-resturant-and-cooking-at-healing-village/", "/ahv/assets/img/gallery-2026/photo/cuisine-food-angled-vegetarian-meal-05.webp",
        "Angled view of a vegetarian meal tray: red rice; sambar; thoran and coconut stew garnished with curry leaf", 1600, 1066),
    "Organic Farm": ("/organic-farm/", "/ahv/assets/img/house-rules/organic-farm-2026.webp", "Illustration of a vegetable garden and bottle-gourd trellis", 1536, 1024),
    "Animal Husbandry": ("/animal-husbandry/", "/ahv/assets/img/house-rules/animal-husbandry-2026.webp", "Illustration of a cow and calf resting in a shaded meadow", 1536, 1024),
}
f = "public/ahv/assets/reader25b-family-data.js"
t = open(f, encoding="utf-8").read(); i = t.index("{"); j = t.rstrip().rfind("}"); body = t[i:j + 1]
d = json.loads(body); dumps = lambda o: json.dumps(o, ensure_ascii=False)
assert dumps(d) == body
r = next(x for x in d["routes"] if x["path"] == "/ayurvedic-cuisine/")
art = next(c for c in r["components"] if c["component"] == "article")
done = 0
for card in [b for b in art["blocks"] if b["kind"] == "card"]:
    img = next(b for b in card["blocks"] if b["kind"] == "image")
    para = next(b for b in card["blocks"] if b["kind"] == "para")
    label = para["text"]
    route, src, alt, w, h = CARDS[label]
    img.update({"src": src, "alt": alt, "width": w, "height": h, "sourceUrl": None, "linkHref": route,
                "recordedOriginalSha256": hashlib.sha256(open("public" + src, "rb").read()).hexdigest(),
                "ef09": "26 Sep 2026: replaced the repeated awards placeholder with the linked page's own image"})
    para["tree"] = [{"k": "e", "tag": "a", "attrs": {"href": route}, "c": [{"k": "t", "v": label}]}]
    done += 1
new = t[:i] + dumps(d) + t[j + 1:]
if new != t: open(f, "w", encoding="utf-8").write(new)
print("cards", done, "changed", new != t)
