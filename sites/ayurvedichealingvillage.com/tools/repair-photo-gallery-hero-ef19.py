"""EF-19 (owner feedback, 26 Sep 2026): the /photo-gallery/ hero (and the /gallery/ hub card cover)
showed the vine-covered brick building with a Ganesha shrine (ktahv-shoot-2025/IMG_8719-2.jpg) —
identified by the owner as the head office, not the Healing Village. Replaced with a Palakkad-library
image (ahv-edited/…PRACHI KHASGIWALA-49.jpg: two laterite-brick patient villas along the water
channel), which is not otherwise on /photo-gallery/. The generator excludes the HO frame by sha256
(NOT_THIS_PROPERTY). Remaining uncertain-provenance images go to the owner's numbered contact sheet.
Idempotent."""
import json
OLD = "hero-grounds-garden-vine-covered-brick-01"
NEW = {"src": "/ahv/assets/img/gallery-2026/villas/exteriors-villa-exterior-laterite-brick-patient-villas-01.webp",
       "src768": "/ahv/assets/img/gallery-2026/villas/exteriors-villa-exterior-laterite-brick-patient-villas-01-768.webp",
       "width": 1600, "height": 1067, "width768": 768, "height768": 512,
       "alt": "Wide view of two laterite-brick patient villas along the landscaped water channel with stone pathways",
       "sha256": "85a391d2b5b915aa9dfcac3be7d4e8841e34417907bb209251f20e74a3dd3d39",
       "libraryPath": "ahv-edited/kAIRALI PALAK KAD_DEPICTIONS BY PRACHI KHASGIWALA-49.jpg"}
def swap(o):
    n = 0
    if isinstance(o, dict):
        if OLD in str(o.get("src", "")):
            for k in list(o.keys()):
                if k in NEW: o[k] = NEW[k]
            if "caption" in o: o["caption"] = NEW["alt"] + "."
            o["ef19"] = "26 Sep 2026: replaced the head-office frame (owner) with a Palakkad-library image"
            n += 1
        for v in o.values(): n += swap(v)
    elif isinstance(o, list):
        for v in o: n += swap(v)
    return n
for f in ["public/ahv/assets/photo-collections-data.js", "english-candidate/package-overlay/assets/photo-collections-data.js"]:
    t = open(f, encoding="utf-8").read(); i = t.index("{"); j = t.rstrip().rfind("}"); body = t[i:j + 1]
    d = json.loads(body); dumps = lambda o: json.dumps(o, ensure_ascii=False, separators=(",", ":"))
    assert dumps(d) == body
    n = swap(d)
    if n: open(f, "w", encoding="utf-8").write(t[:i] + dumps(d) + t[j + 1:])
    print(f.split("/")[-3], "swapped", n)
m = "english-candidate/galleries-2026.json"; mt = open(m, encoding="utf-8").read(); md = json.loads(mt)
n = swap(md)
if n: open(m, "w", encoding="utf-8").write(json.dumps(md, ensure_ascii=False, indent=2 if mt.startswith('{\n  "') else 1) + ("\n" if mt.endswith("\n") else ""))
print("manifest swapped", n)
# hub card cover (JS object literal, one line per card)
h = "public/ahv/assets/gallery-hub-2026-candidate.js"; ht = open(h, encoding="utf-8").read()
old_cover = 'cover: "/ahv/assets/img/gallery-2026-09-24/01-hero-grounds-garden-vine-covered-brick-01.webp"'
if old_cover in ht:
    ht = ht.replace(old_cover, 'cover: "' + NEW["src"] + '"')
    import re
    ht = re.sub(r'(cover: "' + re.escape(NEW["src"]) + r'"[^}]*?alt: ")[^"]*(")', lambda mm: mm.group(1) + NEW["alt"] + mm.group(2), ht, count=1)
    open(h, "w", encoding="utf-8").write(ht); print("hub cover swapped")
