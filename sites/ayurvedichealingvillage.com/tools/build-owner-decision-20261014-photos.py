#!/usr/bin/env python3
"""Owner decision 10 (14 Oct 2026, OWNER-DECISIONS-20261014-ANSWERS.json "10-photos"): replace bare-back therapy hero /
"How it works" photographs on the scoped live ad routes with doctor-consultation / pulse-check / villa photographs picked
from the EXISTING image bank (old and new). Two picks have no published web file yet; this builds them from the exact
library originals, verified by SHA-256 first, using the batch-1/batch-2 convention (tools/build-owner-batch02-assets.py):
1600px-wide WebP q82 plus a 768px rendition, EXIF orientation applied, nothing cropped (crop is a display decision).

  AHV-IMG-005  ahv-edited/...-111.jpg  physician consultation room, no people (owner batch 1 "yes", 28 Sep 2026;
               also published in english-candidate/galleries-2026.json as property/block-facility-physician-consultation-room-01)
  AHV-IMG-045  ahv-edited/...-348.jpg  pulse examination close-up, hands only, faces not shown (image-approval batch 3
               manifest; IMAGE_CATALOG register_ok=yes; picked under owner decision 10)

  python3 tools/build-owner-decision-20261014-photos.py [--check]"""
import hashlib, json, sys
from pathlib import Path
from PIL import Image, ImageOps

LIB = Path("/Volumes/Extreme SSD - Blue 2nd/Kairali-Image-Library/ahv-edited")
OUT = Path("public/ahv/assets/img/owner-decision-20261014")
PICKS = {
    "005": ("kAIRALI PALAK KAD_DEPICTIONS BY PRACHI KHASGIWALA-111.jpg", "f110d9a4b4d42cd00593674cd7fd5d8bbd237340c5128aa3757241603c0c4e63"),
    "045": ("kAIRALI PALAK KAD_DEPICTIONS BY PRACHI KHASGIWALA-348.jpg", "8a253b8bd635e62c1a99054df3e8fc05deb48999f90a2c6256c1a83bc582ba3e"),
}
CHECK = "--check" in sys.argv
OUT.mkdir(parents=True, exist_ok=True)
report = []
for n, (name, sha) in PICKS.items():
    src = LIB / name
    h = hashlib.sha256(src.read_bytes()).hexdigest()
    assert h == sha, f"AHV-IMG-{n}: source hash {h} != recorded {sha}"
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    row = {"id": f"AHV-IMG-{n}", "source": f"ahv-edited/{name}", "sourceSize": im.size, "sourceSha256": h}
    for suffix, w in (("", 1600), ("-768", 768)):
        dest = OUT / f"ahv-img-{n}{suffix}.webp"
        r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        if not CHECK:
            r.save(dest, "WEBP", quality=82, method=6)
        row["out" + (suffix or "-1600")] = [str(dest), r.size, hashlib.sha256(dest.read_bytes()).hexdigest() if dest.exists() else None]
    report.append(row)
print(json.dumps(report, indent=1))
