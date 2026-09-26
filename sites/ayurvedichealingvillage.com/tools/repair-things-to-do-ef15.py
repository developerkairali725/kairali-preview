"""EF-15 (owner feedback, 26 Sep 2026): /things-to-do/ cards — images, content, links.
  · every activity card shows an image of what it names: the target page's own image where it has
    one (cooking classes, wildlife drive, elephant safari); where the target has only the shared
    aerial banner or a reused stock frame (village facilities, yoga theory/practical) a verified
    photo from the 2026 gallery bank; alt text as recorded for that image;
  · every card image links to the same page as its title;
  · the 'Cultural events' description that the capture left inside the jeep-safari card becomes its
    own card linking to /cultural-events/ (that page's own Kathakali image) — no text lost.
Idempotent."""
import json, copy
IMG = {
    "/village-facilities/": ("/ahv/assets/img/gallery-2026/property/grounds-exterior-tiled-roof-facility-buildings-03.webp",
        "Aerial view of tiled-roof facility buildings nestled in a dense coconut grove with lawns and a water channel", 1600, 1066),
    "/cooking-classes/": ("/ahv/assets/img/article/cooking-classes.webp", "Cooking Classes", None, None),
    "/yoga-classes-theory/": ("/ahv/assets/img/gallery-2026/photo/yoga-large-hall-exposed-03.webp",
        "Large yoga hall with exposed timber trussed roof and clerestory glazing", 1600, 1067),
    "/yoga-classes-practical/": ("/ahv/assets/img/gallery-2026/yoga/hall-yoga-female-patient-senior-02.webp",
        "Female patient and senior yoga instructor facing each other in namaste greeting inside a bright yoga hall with large windows", 1600, 1066),
    "/wildlife-drive/": ("/ahv/assets/img/reader25a/e8315579dcdf9ae1ece8da3f2942db1adaca1dc4", "wildlife drive in Kerala", None, None),
    "/elephant-safari/": ("/ahv/assets/img/article/elephant-safari-1.webp", "Elephant Safaris", None, None),
}
f = "public/ahv/assets/collection-family-data.js"
t = open(f, encoding="utf-8").read(); i = t.index("{"); j = t.rstrip().rfind("}"); body = t[i:j + 1]
d = json.loads(body); dumps = lambda o: json.dumps(o, ensure_ascii=False, separators=(",", ":"))
assert dumps(d) == body
# resolve the wildlife image's full file name (hash-named) from its own page record
import glob, os
wl = [p for p in glob.glob("public/ahv/assets/img/reader25a/e8315579dcdf9ae1ece8da3f2942db1adaca1dc4*") if not p.endswith("-360.webp")]
IMG["/wildlife-drive/"] = (wl[0][len("public"):], "Wildlife drive in Kerala", None, None)
r = next(x for x in d["routes"] if x["path"] == "/things-to-do/")
def cards(o, out, parent=None):
    if isinstance(o, dict):
        if o.get("kind") == "card": out.append((o, parent))
        for v in o.values(): cards(v, out, o)
    elif isinstance(o, list):
        for v in o: cards(v, out, o)
found = []; cards(r, found)
def href_of(card):
    for b in card["blocks"]:
        if b["kind"] == "heading":
            for n in b["tree"]:
                if n.get("tag") == "a": return n["attrs"]["href"]
    return None
from subprocess import run
def dims(src):
    out = run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", "public" + src], capture_output=True, text=True).stdout.split()
    return int(out[-3]), int(out[-1])
changed = 0
for card, parent in found:
    route = href_of(card)
    if not route: continue
    imgs = [b for b in card["blocks"] if b["kind"] == "image"]
    if route in IMG:
        src, alt, w, h = IMG[route]
        if not w: w, h = dims(src)
        blk = {"kind": "image", "ptr": card["ptr"].replace("/card", "/img"), "src": src, "alt": alt, "width": w, "height": h,
               "ef15": "EF-15 26 Sep 2026: image of the named activity (was missing or the shared aerial banner)"}
        if imgs:
            if imgs[0].get("src") != src: imgs[0].update(blk); changed += 1
        else:
            card["blocks"].insert(0, blk); changed += 1
        imgs = [b for b in card["blocks"] if b["kind"] == "image"]
    for im in imgs:
        if im.get("linkHref") != route: im["linkHref"] = route; changed += 1
# split the stray 'Cultural events' text out of the jeep-safari card into its own card
jeep = next(c for c, _ in found if href_of(c) == "/mountain-jeep-safari/")
para = next(b for b in jeep["blocks"] if b["kind"] == "para")
k = next((n for n, x in enumerate(para["tree"]) if x.get("tag") == "strong" and "Cultural events" in json.dumps(x)), None)
if k is not None:
    ce_text = "".join(x.get("v", "") for x in para["tree"][k + 1:]).lstrip(": ").strip()
    para["tree"] = [x for x in para["tree"][:k] if x.get("tag") != "br"]
    ce = {"kind": "card", "ptr": "/ef15/cultural-events/card", "blocks": [
        {"kind": "image", "ptr": "/ef15/cultural-events/img", "src": "/ahv/assets/img/article/cultural-1.webp", "alt": "Kathakali", "width": 800, "height": 600,
         "linkHref": "/cultural-events/", "ef15": "the target page's own image"},
        {"kind": "heading", "tag": "h3", "ptr": "/ef15/cultural-events/h", "tree": [{"k": "e", "tag": "a", "attrs": {"href": "/cultural-events/"}, "c": [{"k": "t", "v": "Cultural events"}]}]},
        {"kind": "para", "ptr": "/ef15/cultural-events/p", "tree": [{"k": "t", "v": ce_text}]},
        {"kind": "line", "ptr": "/ef15/cultural-events/more", "tree": [{"k": "e", "tag": "a", "attrs": {"href": "/cultural-events/"}, "c": [{"k": "t", "v": "Read more"}]}], "sourceClass": "wp-block-button__link"}],
        "ef15": "Split out of the mountain-jeep-safari card (captured stray paragraph), 26 Sep 2026"}
    # insert right after the jeep card in its container list
    for c, parent in found:
        if c is jeep and isinstance(parent, list):
            parent.insert(parent.index(jeep) + 1, ce); break
        if c is jeep and isinstance(parent, dict):
            for key, v in parent.items():
                if isinstance(v, list) and jeep in v: v.insert(v.index(jeep) + 1, ce); break
    changed += 1
new = t[:i] + dumps(d) + t[j + 1:]
if new != t: open(f, "w", encoding="utf-8").write(new)
print("changes", changed)
