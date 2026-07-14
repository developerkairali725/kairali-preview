#!/usr/bin/env python3
"""
Build the Drive -> local mapping for Kairali product images.

Inputs (same dir):
  drive_manifest.csv                  (526 files in "Pictures")
  drive_manifest_subfolder_group.csv  (57 files in "Pictures/group")
  catalog_in_handles.txt              (137 Shopify handles, kairaliproducts.in  - PRIMARY)
  catalog_com_handles.txt             (157 Shopify handles, kairaliproducts.com - FALLBACK)

Output:
  mapping.csv
"""
import csv, os, re, difflib
from collections import defaultdict

D = os.path.dirname(os.path.abspath(__file__))
IN_URL = "https://www.kairaliproducts.in/products/"
COM_URL = "https://www.kairaliproducts.com/products/"

# ---------------------------------------------------------------- load inputs
def load_manifest(fn, subfolder=""):
    rows = []
    with open(os.path.join(D, fn), newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            rows.append({
                "id": r["drive_file_id"].strip(),
                "orig": r["original_drive_filename"].strip(),
                "sub": r.get("parent_subfolder", subfolder) or subfolder,
            })
    return rows

files = load_manifest("drive_manifest.csv") + load_manifest("drive_manifest_subfolder_group.csv", "group")

def load_handles(fn):
    with open(os.path.join(D, fn), encoding="utf-8") as f:
        return [l.strip() for l in f if l.strip()]

handles_in = load_handles("catalog_in_handles.txt")
handles_com = load_handles("catalog_com_handles.txt")

# ------------------------------------------------------------ normalisation
# Spelling variants seen in Drive filenames -> the spelling used in site handles.
# These are transliteration variants of the SAME word, not guesses at a product.
ALIASES = [
    (r"\bashwa\s*gandha\b", "ashwagandha"),
    (r"\bamrutottaram\b", "amruthotharam"),
    (r"\bbalaswaganthadi\b", "balaswagandhadi"),
    (r"\bcardospa\b", "cardo spa"),
    (r"\brheumaspa\b", "rheuma spa"),
    (r"\brheumspa\b", "rheuma spa"),
    (r"\bchavanparkash\b", "chyawanaprasam"),
    (r"\bgadharvahasthadi\b", "gandharvahasthadi"),
    (r"\bgandharvahastadi\b", "gandharvahasthadi"),
    (r"\bthriphladi\b", "thriphaladi"),
    (r"\btriphaladi\b", "thriphaladi"),
    (r"\bjathyadi\b", "jatyadi"),
    (r"\bjatyadi\b", "jathyadi"),
    (r"\bsafeed\s*musli\b", "safed musli"),
    (r"\bkarcin\b", "kaircin"),
    (r"\bkaireoil\b", "kairoil"),
    (r"\bharidrakhandam\b", "haridrakandam"),
    (r"\bgulucyadi\b", "guluchyadi"),
    (r"\bindukantam\b", "indukantham"),
    (r"\bnisakathakadi\b", "nishakathakadi"),
    (r"\bnisothamadi\b", "nishothamadi"),
    (r"\bmaha\s*rasnadi\b", "maha rasnadi"),
    (r"\bmaha\s*rasnad\b", "maha rasnadi"),
    (r"\bsahachardi\b", "sahacharadi"),
    (r"\bbruhath\s*manjstad\b", "bruhath manjishtadi"),
    (r"\bdasamoolam\s*katuthrayam\b", "dasamoolam katuthurayadi"),
    (r"\bkashyam\b", "kashayam"),
    (r"\bchooranam\b", "choornam"),
    (r"\bchoornam\b", "choornam"),
    (r"\baloe\s*vera\b", "aloevera"),
    (r"\bbeauty\s*soap\b", "herbal beauty soap"),
    (r"\bsandal\s*soap\b", "sandal herbal soap"),
    (r"\baarogya(\s*herbal)?\s*tea\b", "aarogya herbal infusion"),
    (r"\baarogya\b", "aarogya herbal infusion"),
]

# Product "form" words. If both sides declare a form and they differ, reject the
# match (stops e.g. "Nishakashakadi Thailam" binding to a *Kashayam* product).
FORMS = ["thailam", "kashayam", "choornam", "gulika", "gritham", "lehyam", "kuzhambu",
         "arishtam", "asavam", "gudam", "soap", "shampoo", "capsule", "syrup", "balm",
         "tablet", "infusion", "gel", "guggulu", "avenakkenna", "kera"]

NOISE = re.compile(r"(^|\s)(v2|front|back|copy|group)(\s|$)", re.I)

def base_name(fn):
    """Drive filename -> normalised product slug + captured variant hints."""
    n = os.path.splitext(fn)[0]
    n = n.replace("_", " ")
    n = re.sub(r"(?i)([a-z])(v2)\b", r"\1 \2", n)  # "SoapV2" -> "Soap V2"
    n = re.sub(r"\s*\(\d+\)", " ", n)              # "(1)"
    n = re.sub(r"\bB64W\d+\b", " ", n, flags=re.I)  # camera codes
    n = re.sub(r"\bJ\d+A\d+\b", " ", n, flags=re.I)
    variant = []
    m = re.search(r"\b(\d+\s*ml|\d+\s*g|\d+\s*gm)\b", n, re.I)
    if m:
        variant.append(m.group(1).replace(" ", "").lower())
    if re.search(r"\bv2\b", n, re.I):
        variant.append("v2")
    side = ""
    if re.search(r"\bfront\b", n, re.I):
        side = "front"
    elif re.search(r"\bback\b", n, re.I):
        side = "back"
    n = NOISE.sub(" ", n)
    n = re.sub(r"\b\d+\s*ml\b|\b\d+\s*gm?\b", " ", n, flags=re.I)
    n = re.sub(r"[^a-zA-Z+\s]", " ", n)             # drop digits/punct, keep '+'
    n = re.sub(r"\s+", " ", n).strip().lower()
    for pat, rep in ALIASES:
        n = re.sub(pat, rep, n)
    n = re.sub(r"\s+", " ", n).strip()
    return n, variant, side

def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

def forms_of(text):
    return {f for f in FORMS if re.search(r"\b" + f, text)}

# ------------------------------------------------------------------ matching
# Products where a tempting near-match would be WRONG. We refuse to bind these
# and send them to human review instead of inventing a name.
#   herbal hair conditioner -> no conditioner exists on either site (a shampoo is
#                              a different product, not a substitute)
#   latamayadi              -> only "Jatamayadi" exists; L/J is an unverified leap
NEVER_MATCH = ("herbal hair conditioner", "latamayadi")

def subsequence(small, big):
    """True if every token in `small` appears in `big`, in order."""
    it = iter(big)
    return all(any(t == b for b in it) for t in small)

def match(nb):
    """Return (handle, site, confidence). .in is primary, .com is fallback."""
    if not nb:
        return None, None, "unmatched"
    if any(b in nb for b in NEVER_MATCH):
        return None, None, "unmatched"
    s = slug(nb)
    toks = [t for t in s.split("-") if t]
    if not toks:
        return None, None, "unmatched"
    nb_forms = forms_of(" " + nb)

    for handles, site in ((handles_in, "in"), (handles_com, "com")):
        cands = []  # (form_bonus, conf_rank, handle, confidence)
        for h in handles:
            h_forms = forms_of("-" + h)
            # form guard: both declare a form and they're disjoint -> reject
            if nb_forms and h_forms and not (nb_forms & h_forms):
                continue
            # form bonus: prefer a handle that *shares* the form (syrup vs capsule)
            bonus = 1 if (nb_forms and (nb_forms & h_forms)) else 0
            hp = "-" + h + "-"
            htoks = h.split("-")
            conf = None
            if ("-" + s + "-") in hp or h == s or h.startswith(s + "-"):
                conf = "high"
            elif len(toks) >= 2 and subsequence(toks, htoks):
                # every token of the drive name appears, in order, in the handle
                # (e.g. "aloevera shampoo" -> kairali-ALOEVERA-herbal-SHAMPOO-...)
                conf = "high"
            elif len(toks) >= 2 and ("-" + toks[0] + "-" + toks[1] + "-") in hp:
                conf = "medium"
            elif len(toks[0]) >= 6 and h.startswith(toks[0] + "-"):
                conf = "medium"
            if conf:
                cands.append((bonus, 1 if conf == "high" else 0, h, conf))
        if cands:
            cands.sort(reverse=True)
            bonus, _, h, conf = cands[0]
            return h, site, conf
        # fuzzy, conservative
        cand, score = None, 0.0
        for h in handles:
            h_forms = forms_of("-" + h)
            if nb_forms and h_forms and not (nb_forms & h_forms):
                continue
            head = "-".join(h.split("-")[: max(2, len(toks))])
            r = difflib.SequenceMatcher(None, s, head).ratio()
            if r > score:
                cand, score = h, r
        if cand and score >= 0.90:
            return cand, site, "medium"
    return None, None, "unmatched"

# Marketing tail words: everything from here on in a handle is SEO copy, not the
# product name. NB "herbal"/"oil"/"health" are deliberately NOT stop words - they
# are part of real product names (e.g. "Kairali Herbal Beauty Soap").
STOP = {"best", "ayurvedic", "medicine", "for", "and", "or", "the", "with", "to", "of",
        "in", "a", "support", "treatment", "bulk", "pack", "ayurveda",
        "effective", "safe", "online", "buy"}

def product_name_from_handle(h, nb):
    """Product name taken from the site handle: leading brand tokens, stopping at
    the first marketing/stop word (but always including a form word if it leads)."""
    toks = h.split("-")
    out = []
    for t in toks:
        if t in STOP and out:
            break
        if t in STOP and not out:
            continue
        out.append(t)
        if t in FORMS and len(out) >= 2:
            break
    if not out:
        out = toks[:2]
    return " ".join(w.capitalize() for w in out)

# ---------------------------------------------------- label evidence (round 2)
# Product names READ FROM THE PACKAGING in each image, via Drive thumbnails
# (drive.google.com/thumbnail?id=...&sz=w360..w1200) and Drive's OCR of the label
# (get_file_metadata -> contentSnippet). Nothing here is inferred from a filename.
#
#   (product_name, label_text, site_handle_or_None)
# site_handle is set only where the label text matches a product that IS listed on
# kairaliproducts.in. Where it is None the product is real but simply not sold on
# either site -> site_listed = FALSE, evidence = label.
LABEL = {
 # --- label reveals a product that IS on the site (filename was misleading) ---
 "latamayadi choornam": ("Jatamayadi Choornam", "JATAMAYADI CHOORNAM",
     "jatamayadi-choornam-bulk-pack-medicine-for-arthritis-and-gout"),
 "nishakashakadi thailam": ("Nishakathakadi Kashayam", "NISHAKATHAKADI KASHAYAM",
     "nishakathakadi-kashayam-ayurvedic-medicine-for-diabetes-related-complications"),
 # --- label-derived, NOT sold on either site ---
 "kairwash": ("Kairwash", "Kairwash - Ayurvedic Hair Cleansing Powder, 75g / KAIRWASH - Kairali's Ayurvedic Herbal Hair Wash", None),
 "turmeric with black pepper": ("Turmeric with Black Pepper", "Kairali TURMERIC WITH BLACK PEPPER - 60 Capsules", None),
 "neem capsules": ("Neem Capsules", "Kairali NEEM - 60 Capsules", None),
 "moisturizer": ("Grape Seed & Almond Herbal Lotion", "GRAPE SEED & ALMOND Herbal Lotion - Soothing Daily Use, 200 ml", None),
 "herbal hair conditioner": ("Orange Hibiscus Herbal Hair Conditioner", "ORANGE HIBISCUS Herbal Hair Conditioner - Refreshing And Repairing, 200 ml", None),
 "taahira herbal tea": ("Taahira Ayurvedic Herbal Tea", "Ayurvedic Herbal Tea - Taahira - 100g Healing & Detoxifying", None),
 "taahira tea": ("Taahira Ayurvedic Herbal Tea", "Ayurvedic Herbal Tea - Taahira - 100g Healing & Detoxifying", None),
 "yuvan herbal tea": ("Yuvan Ayurvedic Herbal Tea", "Ayurvedic Herbal Tea - Yuvan - 100g Strengthening & Rejuvenating", None),
 "yuvan tea": ("Yuvan Ayurvedic Herbal Tea", "Ayurvedic Herbal Tea - Yuvan - 100g Strengthening & Rejuvenating", None),
 "brahmi gritham": ("Brahmi Gritham", "BRAHMI GRITHAM", None),
 "dadimadi gritham": ("Dadimadi Gritham", "DADIMADI GRITHAM", None),
 "mahakalyanaka gritham": ("Mahakalyanakam Ghritham", "MAHAKALYANAKAM GHRITHAM", None),
 "mahakalyankam thailam": ("Mahakalyanakam Ghritham", "MAHAKALYANAKAM GHRITHAM (filename says 'Thailam' - the pack is a Ghritham)", None),
 "mahathikthaka gritham": ("Mahathikthaka Ghritham", "MAHATHIKTHAKA GHRITHAM", None),
 "saraswatha gritham": ("Saraswatha Ghritham", "SARASWATHA GHRITHAM", None),
 "vasthyamaynkam gritham": ("Vasthyamayanthakam Ghritham", "VASTHYAMAYANTHAKAM GHRITHAM", None),
 "drakshadi kashayam": ("Drakshadi Kashayam", "DRAKSHADI KASHAYAM", None),
 "chandanasavam": ("Chandanasavam", "CHANDANASAVAM", None),
 "lakshadi kuzhambu": ("Lakshadi Kuzhambu", "LAKSHADI KUZHAMBU", None),
 "thrivrith lehyam": ("Thrivrith Lehyam", "THRIVRITH LEHYAM", None),
 "dasamoola lehnam": ("Dasamoolahareethaki Lehyam", "DASAMOOLAHAREETHAKI LEHYAM", None),
 "dasamaoolah lehyam": ("Dasamoolahareethaki Lehyam", "DASAMOOLAHAREETHAKI LEHYAM", None),
 "kalyana gudam": ("Kalyana Gudam", "KALYANA GUDAM", None),
 "manibhadra gudam": ("Manibhadra Gudam", "MANIBHADRA GUDAM", None),
 "vayu gulika": ("Vayu Gulika", "VAYU GULIKA", None),
 "vettumaran gulika": ("Vettumaran Gulika", "VETTUMARAN GULIKA", None),
 "vilwadi gulika": ("Vilwadi Gulika", "VILWADI GULIKA", None),
 "hinguvachadi gulika": ("Hinguvachadi Gulika", "HINGUVACHADI GULIKA", None),
 "kankayanam gulika": ("Kankayanam Gulika", "KANKAYANAM GULIKA", None),
 "suryaprabha gulika": ("Suryaprabha Gulika", "SURYAPRABHA GULIKA", None),
 "ksheerbala avarthi": ("Ksheerabala Avarthi", "KSHEERABALA AVARTHI", None),
 "asta choornam": ("Ashta Choornam", "ASHTA CHOORNAM", None),
 "asta chooranamn": ("Ashta Choornam", "ASHTA CHOORNAM", None),
 "avpathy choornam": ("Avipathy Choornam", "AVIPATHY CHOORNAM", None),
 "avlpathy choornam": ("Avipathy Choornam", "AVIPATHY CHOORNAM", None),
 "dasanakath choornam": ("Dasanakanthi Choornam", "DASANAKANTHI CHOORNAM", None),
 "dasankathi choornam": ("Dasanakanthi Choornam", "DASANAKANTHI CHOORNAM", None),
 "eladi choornam": ("Eladi Choornam", "ELADI CHOORNAM", None),
 "gulgulupancha choornam": ("Gulgulupanchapalam Choornam", "GULGULUPANCHAPALAM CHOORNAM", None),
 "hinguvachadi choornam": ("Hinguvachadi Choornam", "HINGUVACHADI CHOORNAM", None),
 "kachooradi choornam": ("Kachoradi Choornam", "KACHORADI CHOORNAM", None),
 "rasanadi choornam": ("Rasanadi Choornam", "RASANADI CHOORNAM", None),
 "shaddharana choornam": ("Shaddharana Choornam", "SHADDHARANA CHOORNAM", None),
 "vaiswanara choornam": ("Vaiswanara Choornam", "VAISWANARA CHOORNAM", None),
 "dhoordhoor thailam": ("Dhoordhoorapathradi Kera Thailam", "DHOORDHOORAPATHRADI KERA THAILAM", None),
 "dhoordhoorapathradi kera thailam": ("Dhoordhoorapathradi Kera Thailam", "DHOORDHOORAPATHRADI KERA THAILAM", None),
 "durvadi thailam": ("Durvadi Thailam", "DURVADI THAILAM", None),
 "prabhanjana thailam": ("Prabhanjanavimardanam Thailam", "PRABHANJANAVIMARDANAM THAILAM", None),
 "prabhanjanavimardanam thailam": ("Prabhanjanavimardanam Thailam", "PRABHANJANAVIMARDANAM THAILAM", None),
}

# Cryptic filenames (kair05/kair33/KUSH0313...) - identified purely from the pack
# shown in the photo. All three products ARE listed on kairaliproducts.in.
FILE_LABEL = {
 "kair05.jpg": ("Bringraj Kera Thailam", "Kairali Bringraj Kera Thailam - Ayurvedic Hair Oil, 200ml",
                "bhringraj-kera-thailam-best-ayurvedic-hair-oil-for-hair-growth"),
 "kair33.jpg": ("Bringraj Kera Thailam", "Kairali Bringraj Kera Thailam - Ayurvedic Hair Oil, For Intensive Hair Treatment, 200ml",
                "bhringraj-kera-thailam-best-ayurvedic-hair-oil-for-hair-growth"),
 "KUSH0313.jpg": ("Bringraj Kera Thailam", "Kairali Bringraj Kera Thailam - Ayurvedic Hair Oil, For Intensive Hair Treatment, 200ml",
                  "bhringraj-kera-thailam-best-ayurvedic-hair-oil-for-hair-growth"),
 "kair07.jpg": ("Kairoil", "Kairali Kairoil - Ayurvedic Hair Oil",
                "kairoil-best-ayurvedic-hair-oil-for-hair-fall-and-dandruff"),
 "kair08.jpg": ("Kairkare Plus", "Kairali Kairkare Plus - Ayurvedic Body Oil, For Muscular Aches & Pains, 200ml",
                "kairkare-plus-ayurvedic-body-pain-relief-oil"),
}

def label_lookup(orig, nb):
    if orig in FILE_LABEL:
        return FILE_LABEL[orig]
    if nb in LABEL:
        return LABEL[nb]
    for k, v in LABEL.items():          # ksheerbala avarthi 21 / 41
        if nb.startswith(k):
            return v
    return None

# ------------------------------------------------------------------- classify
GROUP_HINTS = ("group", "combo", "+", "soap group", "arishtam and kashayam", "hand made soaps",
               "capules", "proprietary organic", "herbal infusion", "choornam -", "gulika -",
               "thailam -", "shampoo -", "spa rub -", "chavanparkash -", "safeed musli -")
MOCKUP_HINTS = ("mockup", "tube.png", "kair0", "kair3", "kush", "j09a", "kairfinal", "10 25 ml")

def classify(f):
    o = f["orig"].lower()
    if f["sub"] == "group":
        return "group_shot"
    if any(h in o for h in ("group", "combo", " + ", "+")):
        return "group_shot"
    if "mockup" in o or o in ("tube.png",):
        return "mockup_asset"
    return "single_product"

# ----------------------------------------------------------------------- run
rows, seq = [], defaultdict(int)
for f in files:
    nb, variant, side = base_name(f["orig"])
    cat = classify(f)
    label_text = ""
    ext = os.path.splitext(f["orig"])[1].lower().lstrip(".")
    ext = "jpg" if ext in ("jpeg", "jpg") else ext

    if cat in ("group_shot", "mockup_asset"):
        h = site = None
        conf = "n/a"
    else:
        h, site, conf = match(nb)

    # ---- round 2: evidence read off the product's own packaging ------------
    lab = None if cat != "single_product" else label_lookup(f["orig"], nb)
    if lab and not h:
        lab_name, lab_text, lab_handle = lab
        pname = lab_name
        label_text = lab_text
        if lab_handle:                       # label matched a product on .in
            h, site, conf = lab_handle, "in", "high"
            url = IN_URL + lab_handle
            evidence = "label + site:kairaliproducts.in"
            site_listed = "TRUE"
            need = "no"
        else:                                # real product, just not sold online
            url = ""
            evidence = "label (read from packaging)"
            site_listed = "FALSE"
            conf = "label-confirmed"
            need = "no"
        stem = slug(pname)
        prefix = [] if stem.startswith("kairali") else ["kairali"]
        parts = prefix + [stem] + variant + ([side] if side else [])
        key = "-".join(p for p in parts if p)
        seq[key] += 1
        newname = f"{key}-{seq[key]:02d}.{ext}"
        tags = [t for t in [stem.split("-")[0], cat.replace("_", "-"), side, *variant] if t]
        desc = f"Product photograph of {pname}"
        desc += f" ({', '.join(variant)})" if variant else ""
        desc += f", {side} of pack." if side else "."
        if site_listed == "FALSE":
            desc += " Name read from the product label; not listed on either website."
        rows.append({
            "drive_file_id": f["id"], "original_drive_filename": f["orig"],
            "source_folder": "Pictures/group" if f["sub"] == "group" else "Pictures",
            "proposed_new_filename": newname, "relative_path": f"images/{newname}",
            "product_name": pname, "matched_source_url": url, "match_confidence": conf,
            "description": desc, "tags": ";".join(dict.fromkeys(tags)), "category": cat,
            "file_size": "", "format": ext, "dimensions": "", "needs_review": need,
            "evidence_source": evidence, "label_text": label_text, "site_listed": site_listed,
        })
        continue

    if h:
        pname = product_name_from_handle(h, nb)
        # The Drive filename states the pack form (Syrup vs Capsule). If the site
        # name doesn't already carry it, append it so that e.g. "Mulberine Syrup"
        # and "Mulberine Capsules" don't collapse to the same name/filename.
        for fm in sorted(forms_of(" " + nb)):
            if fm not in pname.lower():
                pname = f"{pname} {fm.capitalize()}"
        url = (IN_URL if site == "in" else COM_URL) + h
        need = "no" if conf == "high" else "check"
        stem = slug(pname)
    else:
        pname = "UNMATCHED"
        url = ""
        # group shots / mock-ups are *expected* to have no single product match;
        # only genuine single-product images that failed to match need review.
        need = "YES" if cat == "single_product" else "n/a"
        conf = "unmatched" if cat == "single_product" else conf
        stem = slug(nb) or "unidentified"

    # don't double-prefix when the product name already starts with "kairali"
    prefix = [] if stem.startswith("kairali") else ["kairali"]
    parts = prefix + [stem] + variant + ([side] if side else [])
    if cat == "group_shot":
        parts = ["kairali", "group", slug(nb) or "range"]
    elif cat == "mockup_asset":
        parts = ["kairali", "asset", slug(nb) or "mockup"]
    key = "-".join(p for p in parts if p)
    seq[key] += 1
    newname = f"{key}-{seq[key]:02d}.{ext}"

    tags = [t for t in [stem.split("-")[0], cat.replace("_", "-"), side, *variant] if t]

    if cat == "group_shot":
        desc = f"Group / range shot showing multiple Kairali products (Drive: {f['orig']})."
    elif cat == "mockup_asset":
        desc = f"Packaging mock-up or non-catalogue asset (Drive: {f['orig']})."
    elif h:
        desc = f"Product photograph of {pname}" + (f" ({', '.join(variant)})" if variant else "")
        desc += f", {side} of pack." if side else "."
    else:
        desc = ("Product photograph; no confident match in the kairaliproducts.in or .com "
                f"catalogue. Original Drive name: {f['orig']}.")

    if cat != "single_product":
        evidence, site_listed = "n/a (not a single-product photo)", ""
    elif h:
        evidence, site_listed = "site:kairaliproducts.in", "TRUE"
    else:
        evidence, site_listed = "none - unidentified", ""

    rows.append({
        "drive_file_id": f["id"],
        "original_drive_filename": f["orig"],
        "source_folder": "Pictures/group" if f["sub"] == "group" else "Pictures",
        "proposed_new_filename": newname,
        "relative_path": f"images/{newname}",
        "product_name": pname,
        "matched_source_url": url,
        "match_confidence": conf,
        "description": desc,
        "tags": ";".join(dict.fromkeys(tags)),
        "category": cat,
        "file_size": "",     # filled by download script
        "format": ext,
        "dimensions": "",    # filled by download script
        "needs_review": need,
        "evidence_source": evidence,
        "label_text": label_text,
        "site_listed": site_listed,
    })

cols = ["drive_file_id", "original_drive_filename", "source_folder", "proposed_new_filename",
        "relative_path", "product_name", "matched_source_url", "match_confidence",
        "description", "tags", "category", "file_size", "format", "dimensions", "needs_review",
        "evidence_source", "label_text", "site_listed"]
with open(os.path.join(D, "mapping.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=cols)
    w.writeheader()
    w.writerows(rows)

# --------------------------------------------------------------------- report
tot = len(rows)
hi = sum(1 for r in rows if r["match_confidence"] == "high")
md = sum(1 for r in rows if r["match_confidence"] == "medium")
un = sum(1 for r in rows if r["match_confidence"] == "unmatched")
na = sum(1 for r in rows if r["match_confidence"] == "n/a")
lab = sum(1 for r in rows if r["evidence_source"].startswith("label"))
labsite = sum(1 for r in rows if r["evidence_source"] == "label + site:kairaliproducts.in")
labonly = sum(1 for r in rows if r["evidence_source"] == "label (read from packaging)")
unk = sum(1 for r in rows if r["evidence_source"] == "none - unidentified")
dupes = sum(1 for k, v in seq.items() if v > 1)
print(f"total rows          : {tot}")
print(f"  high confidence   : {hi}")
print(f"  medium (check)    : {md}")
print(f"  unmatched (YES)   : {un}")
print(f"  group/mockup (n/a): {na}")
print(f"filename collisions : 0 (sequence-suffixed; {dupes} stems reused)")
print(f"unique new filenames: {len(set(r['proposed_new_filename'] for r in rows))}")
print(f"unique drive ids    : {len(set(r['drive_file_id'] for r in rows))}")
print()
print(f"resolved via label+site : {labsite}")
print(f"resolved via label only : {labonly}  (real product, not sold on either site)")
print(f"still unidentified      : {unk}")
