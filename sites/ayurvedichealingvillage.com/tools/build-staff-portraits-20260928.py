#!/usr/bin/env python3
"""STAFF-01 (28 Sep 2026): the two new doctors' owner-supplied portraits, garden background edited by the parent at
the owner's request (staff-rana-20260926/portrait-backgrounds-20260928/HANDOFF.md + MANIFEST.json). Verifies each edited
PNG against the manifest SHA-256, then writes a 600x900 (2:3) web portrait — the framing of the existing team portraits
(team-deepu-john.webp is 600x900) — cropped horizontally around the subject, nothing generated or retouched here.
Originals stay private in the evidence folder; only these optimized assets ship.
  python3 tools/build-staff-portraits-20260928.py [--check]"""
import hashlib, json, sys
from pathlib import Path
from PIL import Image

SRC = Path("/Volumes/Extreme SSD - Blue 2nd/Claude Workspaces/10x WordPress and Websites/deliverables/WOPS-AHV-FINAL-DRAFT-20260924-001/staff-rana-20260926/portrait-backgrounds-20260928")
OUT = Path("public/ahv/assets/img")
CHECK = "--check" in sys.argv
manifest = {m["person"]: m for m in json.loads((SRC / "MANIFEST.json").read_text())}
# subject centre (x, as a fraction of the edited image width), read off the edited images
PEOPLE = [("adhina", "team-adhina-ub.webp", 0.535), ("aashitha", "team-aashitha-ps.webp", 0.495)]
rows = []
for person, name, cx in PEOPLE:
    m = manifest[person]; p = Path(m["edited"])
    h = hashlib.sha256(p.read_bytes()).hexdigest()
    assert h == m["editedSha256"], f"{person}: {h} != manifest {m['editedSha256']}"
    im = Image.open(p).convert("RGB")
    w = round(im.height * 2 / 3); x0 = min(max(0, round(im.width * cx - w / 2)), im.width - w)
    out = im.crop((x0, 0, x0 + w, im.height)).resize((600, 900), Image.LANCZOS)
    if not CHECK: out.save(OUT / name, "WEBP", quality=82, method=6)
    rows.append({"person": person, "asset": str(OUT / name), "size": out.size, "crop": [x0, 0, x0 + w, im.height], "editedSha256": h})
print(json.dumps(rows, indent=1))
