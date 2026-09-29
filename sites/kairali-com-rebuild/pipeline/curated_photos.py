#!/usr/bin/env python3
"""Curated company photography for page-family openers and share images.
Sources are the Kairali Image Library (owner-authorised bank); rows carry register_ok from IMAGE_CATALOG.csv."""
import csv, hashlib, json, os
from PIL import Image, ImageOps
LIB = "/Volumes/Extreme SSD - Blue 2nd/Kairali-Image-Library"
CAT = "/Volumes/Extreme SSD - Blue 2nd/Kairali-Digital/kairali-web-factory/docs/media/IMAGE_CATALOG.csv"
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.dirname(HERE)
OUT = os.path.join(REPO, "site", "public", "media", "photo")
os.makedirs(OUT, exist_ok=True); os.makedirs(os.path.join(REPO, "site", "public", "og"), exist_ok=True)
P = "ahv-edited/kAIRALI PALAK KAD_DEPICTIONS BY PRACHI KHASGIWALA-{}.jpg"
PHOTOS = {  # key: (library path, alt text, credit, bw)
 "ahv-grounds-pond": (P.format(113), "Lawns and a curving lily pond before the brick treatment blocks of Kairali – The Ayurvedic Healing Village, Palakkad", "Prachi Khasgiwala for Kairali", False),
 "ahv-veranda": (P.format(108), "Curved veranda of the main block overlooking lawns and the water channel at the Healing Village", "Prachi Khasgiwala for Kairali", False),
 "ahv-footbridge": (P.format(102), "White wooden footbridge leading to a gable-roofed building amid tropical trees at the Healing Village", "Prachi Khasgiwala for Kairali", False),
 "ahv-colonnade": (P.format(105), "Covered colonnaded walkway connecting the brick-and-stone treatment blocks", "Prachi Khasgiwala for Kairali", False),
 "ahv-treatment-room": (P.format(106), "Traditional treatment room with a carved single-piece wooden therapy table (dhroni)", "Prachi Khasgiwala for Kairali", False),
 "ahv-consultation": (P.format(111), "Physician consultation room at The Ayurvedic Healing Village", "Prachi Khasgiwala for Kairali", False),
 "ahv-kati-vasti": (P.format(175), "Two therapists pour warm herbal oil into a dough ring during Kati Vasti", "Prachi Khasgiwala for Kairali", False),
 "ahv-founders-wall": (P.format(144), "Reception lounge at the Healing Village with the founders' portraits on the wall", "Prachi Khasgiwala for Kairali", True),
 "ahv-reception": (P.format(142), "Reception lounge under a beamed conical ceiling with founder portraits", "Prachi Khasgiwala for Kairali", False),
 "ahv-cottages": (P.format(115), "Terraced treatment blocks with tiled roofs and colonnaded verandas", "Prachi Khasgiwala for Kairali", False),
 "raag-facade": ("raag-shoot-pro/raag-drive-47.jpg", "Villa Raag's white facade and columned portico at twilight, Agonda, South Goa", "Villa Raag professional shoot", False),
 "raag-rooftop": ("raag-shoot-pro/raag-drive-40.jpg", "Rooftop terrace with a private plunge pool at Villa Raag", "Villa Raag professional shoot", False),
 "raag-beach": ("raag-shoot-pro/raag-drive-04.jpg", "A guest walks along the beach at sunset near Villa Raag", "Villa Raag professional shoot", False),
 "products-still": ("ktahv/ktahv-nontherapy-01.jpg", "An arrangement of Kairali Ayurvedic products, oils and herbal infusion tea boxes", "Kairali 2025 shoot", False),
 "centre-emblem": ("ktahv/ktahv-nontherapy-38.jpg", "Back-lit wall emblem reading Kairali Ayurvedic Centre", "Kairali 2025 shoot", False),
 "centre-reception": ("ktahv/ktahv-nontherapy-40.jpg", "Reception room of a Kairali Ayurvedic Centre", "Kairali 2025 shoot", False),
}
cat = {}
for r in csv.DictReader(open(CAT, encoding="utf-8", errors="replace")):
    cat[os.path.basename(r["filename"])] = r
def find(rel):
    p = os.path.join(LIB, rel)
    if os.path.exists(p): return p
    base = os.path.basename(rel)
    for dp, _, fns in os.walk(LIB):
        if base in fns: return os.path.join(dp, base)
    return None
manifest = {}
rows = [["key", "library_file", "sha256", "register_ok", "catalog_description", "credit", "sizes"]]
for key, (rel, alt, credit, bw) in PHOTOS.items():
    src = find(rel)
    if not src:
        print("MISSING", key, rel); continue
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    if bw: im = ImageOps.grayscale(im).convert("RGB")
    w, h = im.size; sizes = []
    for tw in (640, 1024, 1600, 2200):
        if tw > w and tw != 640: continue
        out = os.path.join(OUT, f"{key}-{tw}.webp")
        if not os.path.exists(out):
            im.resize((tw, round(h * tw / w)), Image.LANCZOS).save(out, "WEBP", quality=78, method=5)
        sizes.append(tw)
    og = os.path.join(REPO, "site", "public", "og", f"{key}.jpg")
    if not os.path.exists(og):
        ImageOps.fit(im, (1200, 630), Image.LANCZOS).save(og, "JPEG", quality=82, optimize=True, progressive=True)
    c = cat.get(os.path.basename(src), {})
    manifest[key] = {"alt": alt, "credit": credit, "w": w, "h": h, "ratio": round(w / h, 4), "sizes": sizes, "og": f"/og/{key}.jpg"}
    rows.append([key, os.path.relpath(src, LIB), hashlib.sha256(open(src, "rb").read()).hexdigest(), c.get("register_ok", "not catalogued"), c.get("description", "")[:160], credit, ";".join(map(str, sizes))])
json.dump(manifest, open(os.path.join(REPO, "site", "content", "photos.json"), "w"), indent=1)
os.makedirs(os.path.join(HERE, "out"), exist_ok=True)
with open(os.path.join(HERE, "out", "curated-photo-provenance.csv"), "w", newline="") as fh:
    csv.writer(fh).writerows(rows)
print(len(manifest), "photos")
