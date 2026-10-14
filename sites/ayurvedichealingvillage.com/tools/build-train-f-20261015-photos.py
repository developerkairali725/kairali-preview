#!/usr/bin/env python3
"""Train F (15 Oct 2026), owner decision 10 (OWNER-DECISIONS-20261014-ANSWERS.json "10-photos": "pick one not just from
new you can pick from old"): page-specific hero photographs for the live ad routes whose hero is still a therapy photograph
with a bare back or an identifiable model (rows AHV-WB.031/.058/.192/.218/.377 hero-image; production/bindings.ts
PHOTO_PICKS_20261015). Five picks have no published web file yet; this builds them from the exact Palakkad library
originals (ahv-edited, IMAGE_CATALOG register_ok=yes), verified by SHA-256 first, with the batch-1/batch-2 convention
(tools/build-owner-batch02-assets.py, tools/build-owner-decision-20261014-photos.py): 1600px-wide WebP q82 plus a 768px
rendition, EXIF orientation applied, nothing cropped (crop is a display decision) except where a box is recorded below to
keep a person out of frame or the subject in the hero frame.

  ahv-pkd-50   -50.jpg   laterite-brick villa with a blue arched porch and bay windows across the water channel; no people
  ahv-pkd-180  -180.jpg  a therapist's hand pouring warm oil from a brass uruli into a dough ring on a knee (Janu Vasti).
               The one cropped pick (review, 15 Oct 2026): the left 548 px of the 3648 px-wide original are trimmed,
               because an out-of-focus sliver of a second therapist's face (an eye behind glasses) sits at the top-left
               edge, and the portrait is cut to a near-square window (y 1965-5096) centred on the oil stream, the dough
               ring and the knee, so the variant-A hero's cover crop keeps them in frame from a 390 px phone to a 1920 px
               desktop (test/train-f-photos-20261015.test.mjs pins the box and the frame arithmetic).
  ahv-pkd-115  -115.jpg  terraced treatment blocks with a colonnaded veranda among palms; no people
  ahv-pkd-132  -132.jpg  courtyard with a sculpted lotus relief wall and terracotta urns; no people
  ahv-pkd-307  -307.jpg  elevated view of tiled-roof buildings in a dense coconut grove; no people

KHASGIWALA-344/-345/-347 are not used (their catalogue approval has not been applied), nor any ktahv-shoot-2025 (Delhi HO
centre) photograph.

  python3 tools/build-train-f-20261015-photos.py [--check]"""
import hashlib, json, sys
from pathlib import Path
from PIL import Image, ImageOps

LIB = Path("/Volumes/Extreme SSD - Blue 2nd/Kairali-Image-Library/ahv-edited")
OUT = Path("public/ahv/assets/img/owner-decision-20261015")
NAME = "kAIRALI PALAK KAD_DEPICTIONS BY PRACHI KHASGIWALA-{}.jpg"
PICKS = {  # library number: (source SHA-256, crop box (left, top, right, bottom) on the EXIF-transposed original or None)
    "50": ("f5798c974081c9ed7b08ba87557b282d4d467a324ef7dd050b690519e9420c0b", None),
    "180": ("bbee193ce7c40e6745828ea2a7bcf10a3697a88d6370d1da158dc39db474aa69", (548, 1965, 3648, 5096)),
    "115": ("04b8bedff8eda0155824423b6b4a9a1f5f8fb1b63cb5109fa8a4354e0509754f", None),
    "132": ("8f3a8e02d98f5670c15f9916254881becc0f185cbce8d7c5033207d902af7fbc", None),
    "307": ("7b21e6adce4d153a542a18b652367bc878429ee3d9e2b643c50e76f9d8cfa302", None),
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
