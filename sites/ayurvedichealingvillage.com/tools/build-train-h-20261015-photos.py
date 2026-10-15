#!/usr/bin/env python3
"""Train H (15 Oct 2026), owner decision 10 (OWNER-DECISIONS-20261014-ANSWERS.json "10-photos": "pick one not just from
new you can pick from old"): the page-specific hero of /lp/ayurvedic-hospital-kerala/ (row AHV-WB.335.hero-image;
production/bindings.ts PHOTO_PICKS_20261015H), replacing the morning-mist photograph that the route shared with
/Ayurveda_Treatment_Neo_S.India_Cities.html. Built from the exact Palakkad library original (ahv-edited, IMAGE_CATALOG
register_ok=yes), verified by SHA-256 first, with the Train F convention (tools/build-train-f-20261015-photos.py):
1600px-wide WebP q82 plus a 768px rendition, EXIF orientation applied, nothing cropped.

  ahv-pkd-111  -111.jpg  the physician consultation room: curved wooden desk, computer, chairs, an examination couch,
               round windows with bamboo blinds and the founders' framed portraits on the brick wall; no person present

  python3 tools/build-train-h-20261015-photos.py [--check]"""
import hashlib, json, sys
from pathlib import Path
from PIL import Image, ImageOps

LIB = Path("/Volumes/Extreme SSD - Blue 2nd/Kairali-Image-Library/ahv-edited")
OUT = Path("public/ahv/assets/img/owner-decision-20261015")
NAME = "kAIRALI PALAK KAD_DEPICTIONS BY PRACHI KHASGIWALA-{}.jpg"
PICKS = {  # library number: (source SHA-256, crop box or None)
    "111": ("f110d9a4b4d42cd00593674cd7fd5d8bbd237340c5128aa3757241603c0c4e63", None),
}
CHECK = "--check" in sys.argv
OUT.mkdir(parents=True, exist_ok=True)
report = []
for n, (sha, box) in PICKS.items():
    src = LIB / NAME.format(n)
    h = hashlib.sha256(src.read_bytes()).hexdigest()
    assert h == sha, f"-{n}: source hash {h} != recorded {sha}"
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    row = {"id": f"ahv-pkd-{n}", "source": f"ahv-edited/{src.name}", "sourceSize": im.size, "sourceSha256": h, "crop": box}
    if box:
        im = im.crop(box)
    for suffix, w in (("", 1600), ("-768", 768)):
        dest = OUT / f"ahv-pkd-{n}{suffix}.webp"
        r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        if not CHECK:
            r.save(dest, "WEBP", quality=82, method=6)
        row["out" + (suffix or "-1600")] = [str(dest), r.size, hashlib.sha256(dest.read_bytes()).hexdigest() if dest.exists() else None]
    report.append(row)
print(json.dumps(report, indent=1))
