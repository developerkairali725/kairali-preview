#!/usr/bin/env python3
"""Restore the 72 legacy kairali.com documents into site/public/download and verify SHA-256.

The documents (473 MB) are not stored in git. Point --from at any folder holding the original files, e.g. the
handoff bundle's `legacy-documents/` folder or the owner's `03-DOCUMENT-UPDATES/legacy-originals/`.
Usage: python3 scripts/restore_legacy_docs.py --from /path/to/legacy-documents [--check-only]
"""
import argparse, hashlib, json, os, shutil, sys
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEST = os.path.join(REPO, "site", "public", "download")
docs = json.load(open(os.path.join(REPO, "site", "content", "legacy-docs.json")))
ap = argparse.ArgumentParser(); ap.add_argument("--from", dest="src"); ap.add_argument("--check-only", action="store_true"); a = ap.parse_args()
os.makedirs(DEST, exist_ok=True)
ok = bad = missing = 0
for d in docs:
    name = os.path.basename(d["path"]); dst = os.path.join(DEST, name)
    if not a.check_only and a.src and not os.path.exists(dst):
        src = os.path.join(a.src, name)
        if os.path.exists(src): shutil.copy2(src, dst)
    if not os.path.exists(dst):
        missing += 1; print("MISSING", name); continue
    h = hashlib.sha256(open(dst, "rb").read()).hexdigest()
    if d["sha256"] and h != d["sha256"]: bad += 1; print("HASH MISMATCH", name)
    else: ok += 1
print(f"{ok}/{len(docs)} verified, {missing} missing, {bad} mismatched")
sys.exit(1 if (missing or bad) else 0)
