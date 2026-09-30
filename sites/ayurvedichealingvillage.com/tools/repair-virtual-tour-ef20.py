"""EF-20 (owner English feedback, 26 Sep 2026): /virtual-tour/ must not claim a finished tour.
Owner fact: the tour is being filmed (no readiness date). The page's existing link opens a 360°
photo of the village on Google Maps (short link resolves to a Maps photo-sphere at the property),
so it stays, labelled for what it is. Copy avoids dates and banned KTAHV register words.
Updates the travel-family record (body + head) and the route manifest head. Idempotent."""
import json

INTRO = ("Our full virtual tour of Kairali – The Ayurvedic Healing Village is in production and will be "
         "published on this page when it is ready. Until then, you can look around the village grounds in a "
         "360° photo on Google Maps, or browse our photo and video galleries.")
DESC = ("Kairali’s full virtual tour is in production and will be published here. Until then, look around "
        "the village in a 360° photo on Google Maps.")
CARD_TITLE, CARD_BUTTON = "360° view on Google Maps", "Open in Google Maps"

f = "public/ahv/assets/travel-family-data.js"
t = open(f, encoding="utf-8").read()
i, j = t.index("{"), t.rstrip().rfind("}")
body = t[i:j + 1]
d = json.loads(body)
dumps = lambda o: json.dumps(o, ensure_ascii=False, separators=(",", ":"))
assert dumps(d) == body
r = next(x for x in d["routes"] if x.get("path") == "/virtual-tour/")
comp = {c["component"]: c for c in r["components"]}
intro = comp["introduction"]["blocks"][0]
intro["tree"] = [{"k": "t", "v": INTRO}]; intro["text"] = INTRO
card = comp["virtual-tour-card"]["blocks"]
for b in card:
    for node in b.get("tree", []):
        if node.get("k") == "e" and node.get("tag") == "a":
            label = CARD_TITLE if b["kind"] == "para" else CARD_BUTTON
            node["c"] = [{"k": "t", "v": label}]
            node["attrs"]["rel"] = "noopener"
            b["text"] = label
r["metadata"]["description"] = DESC
r["metadata"]["og"]["description"] = DESC
r["ef20"] = "EF-20 26 Sep 2026: coming-soon copy; tour filming in progress (owner), no readiness date."
new = t[:i] + dumps(d) + t[j + 1:]
if new != t:
    open(f, "w", encoding="utf-8").write(new)

m = "english-candidate/route-manifest.json"
mt = open(m, encoding="utf-8").read()
md = json.loads(mt)
ind = 2 if mt.startswith('{\n  "') else 1
row = next(x for x in md["routes"] if x["path"] == "/virtual-tour/")
changed = False
for k in ("description", "ogDescription"):
    if k in row["metadata"] and row["metadata"][k] and row["metadata"][k] != DESC:
        row["metadata"][k] = DESC; changed = True
if changed:
    out = json.dumps(md, ensure_ascii=False, indent=ind) + ("\n" if mt.endswith("\n") else "")
    open(m, "w", encoding="utf-8").write(out)
print("desc chars", len(DESC), "manifest changed", changed)
