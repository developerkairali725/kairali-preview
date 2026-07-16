> # ⛔ DO NOT USE — THIS DATA IS FLAWED (quarantined 2026-07-15)
>
> GPT-5 audit (`scripts/audit-gpt.mjs`) returned **FAIL** on this artifact and was **correct**. Verified against `demand-raw.json`:
>
> 1. **Fake compound seeds.** Terms like `turmeric curcumin`, `amla amalaki`, `tulsi holy basil`, `giloy guduchi`, `fenugreek methi` are invented concatenations nobody searches. They understate real demand badly — `turmeric` alone = **301,000 US** (this file says 27,100 → **11x** understated); `amla` alone = **165,000 India** (this file says 6,600 → **25x**).
> 2. **Implausible zeros summed into totals.** `shilajit`, `shatavari`, `gokshura`, `kapikacchu` return **0 in the US** (7/80 terms are zero in both markets) — a data fault, not a finding. Single-term re-test: shilajit **India 246,000**, shatavari **India 90,500**, gokshura **India 27,100**, all **US 0** → the US pull is unreliable for these.
> 3. **India pulled in English only** (`language_code=en`) — misses Hindi/Devanagari/Hinglish demand entirely, systematically biasing the India picture.
> 4. **Seed universe far too small** (~80 ad-hoc seeds) to prioritise a ~3,400-page architecture, and no entity ontology, competitor analysis, intent mapping, difficulty, or AEO/question research.
>
> **Therefore the cluster totals below (e.g. "herbs 2.57M/mo") are NOT trustworthy and must not be cited.** The directional read (herbs dominate — ashwagandha 673K US, turmeric 301K US, moringa 201K US are real) survives, but the numbers do not.
>
> **Superseded by:** the rigorous keyword/AEO stage defined in `docs/process/MASTER_PIPELINE.md` (entity ontology → real single-term seeds → multi-locale → automated plausibility validation → Perplexity fact-grounding → intent/difficulty/opportunity scoring). Re-run required before any content decision.

# whatisayurveda — search demand map (DataForSEO, US + India, monthly volume)

Pulled via DataForSEO google_ads search_volume. Cost this pull: US $0.09 + India $0.09. location: US=2840, India=2356, lang=en.
## Cluster priority (by total US+India volume)

## herbs  (cluster demand US+IN: 2,568,670/mo)
| US/mo | India/mo | keyword |
|---:|---:|---|
| 673,000 | 301,000 | ashwagandha |
| 201,000 | 246,000 | moringa |
| 201,000 | 33,100 | ashwagandha benefits |
| 135,000 | 135,000 | fenugreek methi |
| 4,400 | 110,000 | bhringraj |
| 14,800 | 74,000 | triphala |
| 1,300 | 60,500 | punarnava |
| 22,200 | 49,500 | neem |
| 5,400 | 49,500 | brahmi |
| 27,100 | 1,300 | turmeric curcumin |
| 12,100 | 27,100 | haritaki |
| 22,200 | 12,100 | bacopa monnieri |
| 22,200 | 9,900 | gotu kola |
| 1,600 | 22,200 | manjistha |
| 18,100 | 880 | ashwagandha for anxiety |
| 2,400 | 14,800 | guggul |
| 12,100 | 4,400 | cardamom benefits |
| 590 | 12,100 | giloy guduchi |
| 6,600 | 880 | ashwagandha dosage |
| 1,000 | 6,600 | amla amalaki |
| 390 | 4,400 | bibhitaki |
| 210 | 4,400 | boswellia shallaki |
| 1,300 | 880 | tulsi holy basil |
| 590 | 880 | arjuna herb |
| 70 | 480 | vidari |
| 10 | 110 | yashtimadhu licorice |
| 0 | 0 | shilajit |
| 0 | 0 | shatavari |
| 0 | 0 | kapikacchu mucuna |
| 0 | 0 | gokshura |

## formulations  (cluster demand US+IN: 344,640/mo)
| US/mo | India/mo | keyword |
|---:|---:|---|
| 3,600 | 74,000 | chyawanprash |
| 880 | 74,000 | triphala churna |
| 720 | 60,500 | sitopaladi churna |
| 390 | 40,500 | ashokarishta |
| 1,900 | 33,100 | kumkumadi oil |
| 590 | 22,200 | avipattikar churna |
| 720 | 12,100 | mahanarayan oil |
| 110 | 8,100 | saraswatarishta |
| 480 | 4,400 | trikatu |
| 110 | 3,600 | brahmi ghrita |
| 70 | 1,600 | hingvastak churna |
| 90 | 880 | dashamoola |

## concepts  (cluster demand US+IN: 1,542,690/mo)
| US/mo | India/mo | keyword |
|---:|---:|---|
| 12,100 | 1,500,000 | ojas |
| 1,900 | 5,400 | pitta dosha |
| 1,900 | 4,400 | vata dosha |
| 1,300 | 2,900 | kapha dosha |
| 2,400 | 2,400 | what is ayurveda |
| 2,400 | 480 | dosha quiz |
| 260 | 1,900 | tridosha |
| 50 | 1,300 | prakriti ayurveda |
| 70 | 480 | srotas |
| 90 | 390 | agni ayurveda |
| 40 | 390 | dhatu ayurveda |
| 50 | 90 | ama ayurveda |

## treatments  (cluster demand US+IN: 72,380/mo)
| US/mo | India/mo | keyword |
|---:|---:|---|
| 2,900 | 27,100 | panchakarma |
| 2,400 | 12,100 | shirodhara |
| 1,300 | 6,600 | vamana |
| 1,900 | 4,400 | abhyanga |
| 480 | 2,900 | marma therapy |
| 170 | 2,900 | virechana |
| 1,000 | 2,400 | nasya |
| 590 | 1,300 | kizhi |
| 90 | 880 | udvartana |
| 90 | 880 | basti ayurveda |

## texts  (cluster demand US+IN: 27,590/mo)
| US/mo | India/mo | keyword |
|---:|---:|---|
| 720 | 12,100 | sushruta samhita |
| 590 | 8,100 | charaka samhita |
| 70 | 5,400 | ashtanga hridaya |
| 20 | 590 | bhavaprakasha |

## conditions  (cluster demand US+IN: 13,630/mo)
| US/mo | India/mo | keyword |
|---:|---:|---|
| 590 | 4,400 | ayurvedic treatment for hair fall |
| 70 | 2,400 | ayurvedic treatment for acidity |
| 320 | 1,900 | ayurveda for weight loss |
| 50 | 1,300 | ayurvedic medicine for anxiety |
| 70 | 720 | ayurvedic medicine for immunity |
| 390 | 590 | ayurvedic medicine for stress |
| 70 | 320 | ayurveda for gut health |
| 50 | 260 | ayurveda for skin |
| 40 | 90 | ayurveda for sleep |
| 0 | 0 | ayurvedic treatment for joint pain |
| 0 | 0 | ayurvedic medicine for diabetes |
| 0 | 0 | ayurveda for pcos |
