#!/usr/bin/env python3
"""
Kairali product images: download -> rename -> verify -> catalogue.

Reads mapping.csv (583 images: 526 in "Pictures" + 57 in "Pictures/group") and
puts every image into <DEST>/images/ under its clean new name, then writes a
catalogue with real file sizes + pixel dimensions and a verification report.

TWO MODES
---------
A. --from-download <PATH>   (RECOMMENDED - no API keys, no OAuth)
     1. Open the Drive folder in your browser (logged in as director@kairali.com):
        https://drive.google.com/drive/folders/1gfJ33MQs4hzfp3v6-MmO7SLcP1ZEKGj5
     2. Right-click the "Pictures" folder -> Download. Drive builds a .zip.
     3. Unzip it (or point <PATH> straight at the .zip).
     4. python3 fetch_and_organize.py --from-download ~/Downloads/Pictures --dest ~/claude
   Files are matched by their ORIGINAL Drive filename, so the zip's internal
   layout doesn't matter.

B. --from-drive             (downloads by Drive file ID via gdown)
     pip install gdown
     python3 fetch_and_organize.py --from-drive --dest ~/claude
   Only works if the files are link-shared. If Drive returns HTML instead of an
   image, the file is permission-restricted -> use mode A.

Nothing is overwritten unless you pass --force. Re-running is safe (it resumes).
"""
import argparse, csv, os, shutil, struct, sys, zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
MAPPING = HERE / "mapping.csv"
FOLDER_ID = "1gfJ33MQs4hzfp3v6-MmO7SLcP1ZEKGj5"

# ----------------------------------------------------------------- dimensions
def dimensions(path):
    """(width, height) for JPEG/PNG without requiring Pillow."""
    try:
        from PIL import Image  # noqa
        with Image.open(path) as im:
            return im.size
    except Exception:
        pass
    try:
        with open(path, "rb") as f:
            head = f.read(26)
            if head[:8] == b"\x89PNG\r\n\x1a\n":
                w, h = struct.unpack(">II", head[16:24])
                return int(w), int(h)
            if head[:2] == b"\xff\xd8":                    # JPEG: walk the markers
                f.seek(2)
                while True:
                    b = f.read(1)
                    while b and b != b"\xff":
                        b = f.read(1)
                    while b == b"\xff":
                        b = f.read(1)
                    if not b:
                        break
                    m = b[0]
                    if m in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7,
                             0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                        f.read(3)
                        h, w = struct.unpack(">HH", f.read(4))
                        return int(w), int(h)
                    seg = f.read(2)
                    if len(seg) < 2:
                        break
                    f.seek(struct.unpack(">H", seg)[0] - 2, 1)
    except Exception:
        pass
    return None, None

def is_image(path):
    try:
        with open(path, "rb") as f:
            sig = f.read(8)
        return sig[:2] == b"\xff\xd8" or sig[:8] == b"\x89PNG\r\n\x1a\n"
    except Exception:
        return False

# ---------------------------------------------------------------------- input
def index_source(src: Path):
    """original filename (lowercased) -> path on disk."""
    idx = {}
    if src.is_file() and src.suffix.lower() == ".zip":
        stage = src.parent / (src.stem + "__unzipped")
        if not stage.exists():
            print(f"unzipping {src.name} -> {stage}")
            with zipfile.ZipFile(src) as z:
                z.extractall(stage)
        src = stage
    for p in src.rglob("*"):
        if p.is_file() and p.suffix.lower() in (".jpg", ".jpeg", ".png"):
            idx.setdefault(p.name.lower(), p)
    return idx

def gdown_fetch(file_id, dest: Path):
    try:
        import gdown
    except ImportError:
        sys.exit("gdown not installed.  pip install gdown   (or use --from-download)")
    url = f"https://drive.google.com/uc?id={file_id}"
    gdown.download(url, str(dest), quiet=True)
    return dest.exists() and is_image(dest)

# ----------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dest", required=True, help="project folder (images/ is created inside)")
    ap.add_argument("--from-download", metavar="PATH", help="unzipped Drive download, or the .zip")
    ap.add_argument("--from-drive", action="store_true", help="download by Drive ID via gdown")
    ap.add_argument("--force", action="store_true", help="overwrite existing files")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    if not a.from_download and not a.from_drive:
        sys.exit("choose --from-download <PATH> (recommended) or --from-drive")
    if not MAPPING.exists():
        sys.exit(f"mapping.csv not found next to this script ({MAPPING})")

    rows = list(csv.DictReader(open(MAPPING, encoding="utf-8")))
    dest = Path(os.path.expanduser(a.dest)).resolve()
    images = dest / "images"
    if not a.dry_run:
        images.mkdir(parents=True, exist_ok=True)

    src_idx = index_source(Path(os.path.expanduser(a.from_download)).resolve()) if a.from_download else {}
    if a.from_download:
        print(f"source images found: {len(src_idx)}")

    ok = skipped = missing = bad = 0
    problems = []
    for r in rows:
        out = images / r["proposed_new_filename"]
        if out.exists() and not a.force:
            skipped += 1
        elif a.dry_run:
            pass
        else:
            if a.from_download:
                srcp = src_idx.get(r["original_drive_filename"].lower())
                if not srcp:
                    missing += 1
                    problems.append(f"MISSING SOURCE  {r['original_drive_filename']}")
                    continue
                shutil.copy2(srcp, out)
            else:
                if not gdown_fetch(r["drive_file_id"], out):
                    out.unlink(missing_ok=True)
                    missing += 1
                    problems.append(f"DOWNLOAD FAILED {r['original_drive_filename']} "
                                    f"({r['drive_file_id']}) - likely not link-shared")
                    continue
        if out.exists():
            if not is_image(out):
                bad += 1
                problems.append(f"NOT AN IMAGE    {out.name}")
                r["file_size"], r["dimensions"] = "", ""
                continue
            w, h = dimensions(out)
            r["file_size"] = str(out.stat().st_size)
            r["dimensions"] = f"{w}x{h}" if w else "unknown"
            ok += 1

    # ---------------------------------------------------------- catalogue out
    if not a.dry_run:
        final = dest / "kairali_image_catalog.csv"
        with open(final, "w", newline="", encoding="utf-8") as f:
            w_ = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
            w_.writeheader()
            w_.writerows(rows)

        report = dest / "verification_report.txt"
        with open(report, "w", encoding="utf-8") as f:
            f.write("KAIRALI PRODUCT IMAGES - VERIFICATION\n")
            f.write("=" * 48 + "\n")
            f.write(f"mapping rows          : {len(rows)}\n")
            f.write(f"images present & valid: {ok}\n")
            f.write(f"already existed       : {skipped}\n")
            f.write(f"missing               : {missing}\n")
            f.write(f"corrupt / not image   : {bad}\n")
            on_disk = len([p for p in images.glob('*') if p.is_file()])
            f.write(f"files in images/      : {on_disk}\n")
            f.write(f"expected              : {len(rows)}\n")
            f.write("RESULT: " + ("PASS\n" if (on_disk == len(rows) and not bad and not missing)
                                  else "INCOMPLETE - see problems below\n"))
            needs = [r for r in rows if r["needs_review"] == "YES"]
            f.write(f"\nrows needing a human product name: {len(needs)}\n")
            for r in needs:
                f.write(f"  - {r['proposed_new_filename']}  (Drive: {r['original_drive_filename']})\n")
            if problems:
                f.write("\nPROBLEMS\n")
                for p in problems:
                    f.write("  " + p + "\n")
        print(f"\ncatalogue -> {final}")
        print(f"report    -> {report}")

    print(f"\nwrote/verified {ok} | skipped {skipped} | missing {missing} | bad {bad}")
    if problems:
        print("\nfirst problems:")
        for p in problems[:10]:
            print("  " + p)
    print("\nRESULT:", "PASS" if (not missing and not bad) else "INCOMPLETE")

if __name__ == "__main__":
    main()
