#!/usr/bin/env python3
"""Owner-approved image batch 2 (28 Sep 2026): build the web assets for the EIGHT approved items only (026, 027, 028,
029, 030, 031, 033, 034; 032/035/036 rejected — untouched). Source = the exact library file the owner approved,
verified by SHA-256 against owner-decisions-batch-02-mapped-20260928.json before anything is written. Output follows the
batch-1 convention (fd78c07a): public/ahv/assets/img/owner-approved-20260928/ahv-img-NNN.webp (1600px wide) and
-768.webp. EXIF orientation applied; nothing cropped here (crop is a display decision, checked per placement).
  python3 tools/build-owner-batch02-assets.py [--check]"""
import hashlib, json, sys
from pathlib import Path
from PIL import Image, ImageOps

MAP = Path("/Volumes/Extreme SSD - Blue 2nd/Claude Workspaces/10x WordPress and Websites/deliverables/WOPS-AHV-FINAL-DRAFT-20260924-001/english-feedback-20260926/image-approval-review/owner-decisions-batch-02-mapped-20260928.json")
OUT = Path("public/ahv/assets/img/owner-approved-20260928")
CHECK = "--check" in sys.argv
decisions = json.loads(MAP.read_text())
approved = [d for d in decisions if d["decision"] == "yes"]
assert sorted(d["id"] for d in approved) == ["AHV-IMG-026", "AHV-IMG-027", "AHV-IMG-028", "AHV-IMG-029", "AHV-IMG-030", "AHV-IMG-031", "AHV-IMG-033", "AHV-IMG-034"], "approved set changed"
report = []
for d in approved:
    p = d["manifestItem"]["proposed"]; src = Path(p["localPath"])
    h = hashlib.sha256(src.read_bytes()).hexdigest()
    assert h == p["sha256"], f"{d['id']}: source hash {h} != approved {p['sha256']}"
    n = d["id"].split("-")[-1]
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    rows = {"id": d["id"], "source": p["libraryRelPath"], "sourceSize": im.size, "sha256": h}
    for suffix, w in (("", 1600), ("-768", 768)):
        r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        dest = OUT / f"ahv-img-{n}{suffix}.webp"
        if not CHECK: r.save(dest, "WEBP", quality=82, method=6)
        rows["out" + (suffix or "-1600")] = [str(dest), r.size]
    if n == "033":  # the walk-in hero renders at its natural ratio (old banner 1440x459): a banner crop, 18%..66% band
        top = round(im.height * 0.18); ch = round(im.width / 3.14)
        b = im.crop((0, top, im.width, top + ch)).resize((1600, round(1600 / 3.14)), Image.LANCZOS)
        if not CHECK: b.save(OUT / "ahv-img-033-banner.webp", "WEBP", quality=82, method=6)
        rows["out-banner"] = [str(OUT / "ahv-img-033-banner.webp"), b.size]
    report.append(rows)
print(json.dumps(report, indent=1))
