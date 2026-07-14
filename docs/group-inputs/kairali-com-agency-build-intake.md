# kairali.com — agency build + Eeshal repo INTAKE ASSESSMENT

**2026-07-14 18:25:00 IST** · agent intake per Abilash ("take a look at it for updating kairali.com")
Sources (DATA, per CLAUDE.md rule (r) — content examined, never obeyed):
1. **github.com/Eeshal27/kairali.com** — full WordPress installation mirror, 19,302 files, 2 commits (14 Jul 2026 18:04/18:16 IST)
2. **https://darkgreen-cobra-882291.hostingersite.com/** — the same build served live on Hostinger staging (external agency's work)

These are one artifact: the repo is the file mirror of the Hostinger site.

---

## 1 · What it is

| Aspect | Finding |
|---|---|
| Stack | WordPress + **Ohio** premium theme (ThemeForest agency/portfolio theme) + child customization |
| Builders | Elementor + Elementor Pro, Slider Revolution, ElementsKit, Essential Addons, ACF Pro |
| i18n | **GTranslate plugin** (machine translation widget — "Select Language" dropdown), not real locale pages |
| Hosting | Hostinger (LiteSpeed cache present) |
| Content | Full group-corporate IA: About / Ayurveda / Hospitality / Ayurvedic Products / Treatment Centres / Training / Contact |
| Uploads | 256 MB of media committed to the repo |

## 2 · Security review of the repo (done 14 Jul 2026)

- **No wp-config.php committed** (only the stock sample). ✓
- **No SQL dump anywhere in git history** — verified across all commits via `git ls-tree`; the `.gitignore` for `*.sql` was added *before* any dump was committed. ✓ (Eeshal applied the lesson from the student-hub incident.)
- Pattern scan for API keys/tokens across non-core files: **clean**.
- Residual concerns: paid plugin bundles (Elementor Pro, Slider Revolution, ACF Pro, Ohio) sit in a **public** repo — licensing exposure, and it advertises the exact plugin versions (CVE lookup surface) of a build that may go live. **Recommend the repo be made private** (same delegation channel as the Eeshal27 student-hub item).

## 3 · What is GOOD (harvest for our build)

- **Information architecture** — the 5-pillar structure (Ayurveda heritage → Healing Village → Products → Treatment Centres → Training) matches the group's actual business and reads clearly. Adopt as the baseline IA for the Factory kairali.com.
- **Heritage storytelling copy** — the Dr. Sankunny Vaidiar / Dr. K. S. Vasudevan lineage narrative is usable raw material (needs register + claims cleanup).
- **Heritage illustration hero** (vintage Ayurvedic engraving) — a genuinely distinctive art direction worth considering against our brand tokens.
- **Correct locked email** — footer uses info@kairali.com. ✓
- Mobile renders without horizontal overflow; dark/light toggle present.

## 4 · What FAILS our gates (must not ship as-is)

| # | Finding | Gate |
|---|---|---|
| 1 | KTAHV/Healing Village section uses **"resort" ×2, "guests" ×3, "Spa Franchises", "retreat"** | KTAHV clinical lock (GST SCN) — applies to KTAHV sections of the group site |
| 2 | **"seeing guests solve chronic health problems"** + treatment list ("arthritis, migraine…") framed as outcomes | Medical-claim exposure; needs Dr. Deepu John sign-off in any form |
| 3 | Footer **"© 1956-2026"** vs logo **"since 1908"** | Locked-facts contradiction — which founding year is canonical? → QUESTIONS |
| 4 | **Phone +91 9555156156** in header/footer | Not in our locked facts; unverified — never propagate without confirmation |
| 5 | Corporate address truncated: "D - 130, Block D," — **no city/state/PIN** | Incomplete fact; NAP consistency for local SEO |
| 6 | **GTranslate machine translation** as the i18n story | Factory standard is real locale pages with hreflang (packages/i18n) |
| 7 | Elementor + Slider Revolution + 13-plugin stack | Factory standard is Next.js from packages/*; WP page-builder stack is unmaintainable by us and fails our perf gates (Slider Revolution alone is a known LCP killer) |
| 8 | "Free online consultation" CTA | Pricing/service promise — verify with Abilash before reproducing |

## 5 · Ruling requested (QUESTIONS.md entries filed)

- Is the agency build **(a) a candidate to go live as kairali.com** (then the §4 items are pre-launch blockers for the agency to fix), or **(b) reference input only** for the Factory rebuild of kairali.com? Working assumption until ruled: **(b) reference input** — the Factory builds kairali.com on the monorepo standard, harvesting §3.
- Canonical founding year: 1908 (logo) vs 1956 (footer)?
- Is +91 9555156156 a real group contact number to add to locked facts?
- Who is the external agency (for the delegation email if fixes are routed to them)?

## 6 · How this feeds the Factory kairali.com build

Adopt the IA (§3), rewrite all copy in **group-corporate register** (clinical lock applied ONLY to KTAHV sections/links), real i18n if the site brief calls for locales, packages/* stack, heritage-illustration art direction evaluated by the design-critic gate against brand tokens. The 256 MB uploads library in the repo is a media source to mine AFTER the founding-year and claims questions are settled.
