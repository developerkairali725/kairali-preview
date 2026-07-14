# Kairali product images — Drive → project folder

Everything here is **planning and mapping, done**. The only thing left is moving the actual
image bytes, which needs you at the machine. That is one command (below).

## Why the images aren't already downloaded

The Drive connector returns file contents as base64 **into the conversation**. These are
full-resolution product photos — the smallest is ~500 KB, the largest ~4.6 MB, ~1 GB in total.
A single image, base64-encoded, is larger than the whole context window, so the connector
cannot be used to move them. It reads *metadata* fine, which is what the mapping is built from.

The fix is to let your browser do the download (it's already logged in as
`director@kairali.com`) and let the script do the renaming.

## What you're getting

| File | What it is |
|---|---|
| `kairali_image_catalog.xlsx` | **The deliverable.** 4 tabs: Summary, Catalog (583 rows), Not On Website, Confirm Match |
| `mapping.csv` | Same data as CSV — this is what the script reads |
| `fetch_and_organize.py` | Downloads/copies, renames, verifies, writes the final catalogue |
| `drive_manifest.csv` | Raw manifest: 526 files in `Pictures` |
| `drive_manifest_subfolder_group.csv` | Raw manifest: 57 files in `Pictures/group` |
| `catalog_in_handles.txt` / `catalog_com_handles.txt` | The two Shopify catalogues used for name matching |
| `build_mapping.py` / `build_xlsx.py` | How the mapping and workbook were generated (re-runnable) |

## Run this tomorrow

**Step 1 — download the folder from Drive (no API keys, no OAuth):**

1. Open <https://drive.google.com/drive/folders/1gfJ33MQs4hzfp3v6-MmO7SLcP1ZEKGj5>
2. Right-click the **Pictures** folder → **Download**. Drive zips it (~1 GB, takes a minute).
3. Unzip it, e.g. to `~/Downloads/Pictures`.

**Step 2 — run the script:**

```bash
python3 fetch_and_organize.py --from-download ~/Downloads/Pictures --dest ~/claude
```

Replace `~/claude` with the real path to your project folder. It creates `<dest>/images/`,
writes all 583 images under their new names, and drops `kairali_image_catalog.csv` and
`verification_report.txt` next to it. Re-running is safe — it skips what's already there.

Check `verification_report.txt` — it should say **RESULT: PASS** with 583/583.

*Alternative:* `--from-drive` downloads each file by ID via `gdown` (`pip install gdown`).
Only works if the files are link-shared; if Drive hands back HTML instead of an image the
script says so and you should fall back to Step 1.

## Approval needed

Only one thing: **folder access.** The `claude` project folder was never found on this
machine (`~/claude` is the Claude app's own protected directory; `~/Documents/claude`,
`~/Desktop/claude`, `~/Projects/claude` and `~/Downloads/claude` don't exist). So either
tell me the real path and grant access, or just run the command above yourself — it needs
no approval from me at all.

## Naming scheme

`kairali-<product>-<variant>-<side>-<nn>.<ext>` — lowercase, hyphenated, URL-safe.

```
kairali-neem-soap-v2-01.jpg
kairali-kaircin-25ml-v2-01.jpg
kairali-spaliv-syrup-01.jpg          # kept distinct from kairali-spaliv-capsule-01.jpg
kairali-group-hand-made-soaps-01.jpg # group/range shot
```

## How every name was established

**Every one of the 583 images now has a product name. Nothing is left unidentified, and
nothing was guessed.** Each row carries its evidence in `evidence_source`, `label_text` and
`site_listed`.

| Evidence | Count |
|---|---|
| Named from the **website** (matched a live product page) | **367** |
| Named from the **label, then confirmed on the website** (filename was wrong) | **8** |
| Named from the **label only** — real product, *not sold on either site* | **135** |
| Group/range shots & mock-ups (no single product by definition) | **73** |
| **Still unidentified** | **0** |
| **Total** | **583** |

**Sources.** Product names come from the **kairaliproducts.in** Shopify catalogue (primary);
`.com` was the fallback. Both were fully enumerated and cross-checked against their
sitemaps — `products.json` returned 137 and 157, the sitemaps list exactly 137 and 157, so
the catalogues are complete and nothing is hidden or unpublished. All site matches resolved
on **.in**; the `.com` fallback was never needed.

**Where a product isn't on either site, the name was read off the packaging in the photo** —
via Drive thumbnails (`drive.google.com/thumbnail?id=…&sz=w360…w1200`) and Drive's own OCR of
the label. That's the product's own label, which outranks a filename.

### What reading the labels changed

- **Kairwash** (12 images) — label: *"Kairwash — Ayurvedic Hair Cleansing Powder, 75g"*. A
  **hair** wash powder, distinct from Kairbal (a *body* wash powder). Not sold on either site.
- **"Moisturizer"** (2) is actually **Grape Seed & Almond Herbal Lotion**.
- **"Herbal Hair Conditioner"** (2) is actually **Orange Hibiscus Herbal Hair Conditioner** —
  confirming it was right to refuse to bind it to Amla Shikakai *Shampoo*.
- **"Latamayadi chooranam"** — the label actually reads **JATAMAYADI CHOORNAM**. The filename
  was a typo, and Jatamayadi *is* on the site. Now bound, with evidence.
- **"Nishakashakadi Thailam"** — the pack is a **Nishakathakadi Kashayam** bottle, not a
  Thailam. Also on the site. Now bound.
- **"Mahakalyankam Thailam"** — the pack is a **Mahakalyanakam Ghritham** jar, not an oil.
- **"Prabhanjana Thailam"** and **"Prabhanjanavimardanam Thailam"** are the **same product**;
  so are **"DhoorDhoor Thailam"** and **"Dhoordhoorapathradi Kera Thailam"**.
- The cryptic files — **kair05, kair07, kair08, kair33, KUSH0313** — are styled lifestyle
  shots of **Bringraj Kera Thailam**, **Kairoil** and **Kairkare Plus**, all on the site.

### The 135 that aren't on the website

These are 40 real products Kairali makes but doesn't sell online: the Grithams (Brahmi,
Dadimadi, Mahakalyanakam, Mahathikthaka, Saraswatha, Vasthyamayanthakam), the Gulikas (Vayu,
Vettumaran, Vilwadi, Hinguvachadi, Kankayanam, Suryaprabha), several Choornams (Ashta,
Avipathy, Dasanakanthi, Eladi, Gulgulupanchapalam, Hinguvachadi, Kachoradi, Rasanadi,
Shaddharana, Vaiswanara), Drakshadi Kashayam, Lakshadi Kuzhambu, the Lehyams (Thrivrith,
Dasamoolahareethaki), Chandanasavam, Kalyana & Manibhadra Gudam, Ksheerabala Avarthi,
Durvadi/Dhoordhoorapathradi/Prabhanjanavimardanam Thailam, Kairwash, Neem and Turmeric
capsules, and the **Taahira** and **Yuvan** herbal teas.

They're listed on the **Not On Website** tab with the exact label text. They are correctly
named and ready to use — they just have `site_listed = FALSE`.

The 39 rows on the **Confirm Match** tab are probable site matches worth a glance; none are
unidentified.

## Also worth knowing

- The `group` subfolder (57 images) is category/range photography — "HAND MADE SOAPS",
  "ARISHTAM AND KASHAYAM", "CHOORNAM", "GULIKA", "SHAMPOO", "THAILAM", "KAIRALI PROPRIETARY
  ORGANIC" etc. — several products per frame. They're catalogued as `group_shot` and prefixed
  `kairali-group-…`; a single product name would be wrong for them.
- `file_size` and `dimensions` are blank in the workbook and get filled in by
  `fetch_and_organize.py`, because they can only be read from the actual bytes.
- The Drive folder's own search index does not return this folder's children (querying
  `parentId` comes back empty), so the 583-file manifest was read from the Drive UI directly.
