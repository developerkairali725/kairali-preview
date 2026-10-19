# Automated verification — http://127.0.0.1:8774

| Check | Result |
|---|---|
| Route dispositions (215 mapping + observations + case/guard probes) | 179/179 as expected |
| Legacy documents served byte-identical (SHA-256) | 72/72 (71 in owner legacy manifest) |
| Page-copy parity vs audit blocks (not a pass/fail: classify with tests/registers.py) | 2846 distinct blocks on 152 pages; 1447 blocks not found as contiguous text on the same page (10919 of 61871 words) on 44 pages |
| Rendered images | 274/274 return 200; missing alt attr 0; missing width/height 0 |
| Internal link targets | 313/313 resolve to 200 (≤1 redirect) |
| Sitemap | 149 URLs, non-200: 0, production host only: True |
| Google Fonts references in HTML | 0 pages |
| Failures | 0 |

## Failures by kind

