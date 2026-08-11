# Local font provenance

The production build consumes only the WOFF2 files in `assets/`. It does not
download a Google Fonts stylesheet or font file.

- Upstream: `google/fonts`
- Pinned upstream commit: `038b637da7b3fd956a4ed93ffc607c3d5e4ce172`
- Upstream commit date: 10 August 2026
- Packaging: the exact WOFF2 subsets from the last successful
  `next/font/google` build are vendored and pinned by SHA-256
- Kairali coverage: Kurale and Lato merge the prior Latin + Latin Extended
  subsets with FontTools 4.63.0 + Brotli 1.2.0; Asap keeps the official
  Latin, Latin Extended, and Vietnamese files split by `unicode-range`
- Other sites: retain the Latin subset they declared before this migration;
  variable axes and requested static weights are preserved
- Licences: the family-specific upstream `OFL.txt` files are retained in `licenses/`

| Local WOFF2 | Upstream path under the pinned commit | Source SHA-256 | Local SHA-256 |
|---|---|---|---|
| `allura-400.woff2` | `ofl/allura/Allura-Regular.ttf` | `9c142b2e515832c0dfc4ff8b8ea18f40314943bf937b72e2b23c4661bac14cc6` | `03828cd012694b3762601728e78c8d5c37b3d688fb62e5378395d151efaa8a74` |
| `asap-latin.woff2` | `ofl/asap/Asap[wdth,wght].ttf` | `7bf29bcab72f7d00de600e964a3fc206620050d8448ddd976822378d0fe18028` | `1ea4e924903959a46a4a625f0b26aef715b3bfc3e4b42da1fb3fa030a8cb5e2c` |
| `asap-latin-ext.woff2` | `ofl/asap/Asap[wdth,wght].ttf` | `7bf29bcab72f7d00de600e964a3fc206620050d8448ddd976822378d0fe18028` | `865f4df4228a6ed1f477bbee5faddb1c97bba8d80ab35e6e1f62602f4c59cd70` |
| `asap-vietnamese.woff2` | `ofl/asap/Asap[wdth,wght].ttf` | `7bf29bcab72f7d00de600e964a3fc206620050d8448ddd976822378d0fe18028` | `bbb6c174b22e65c61fabc2e6d97ba9e8017bb89adf281e8376a50152352e3b65` |
| `fraunces-variable-italic.woff2` | `ofl/fraunces/Fraunces-Italic[SOFT,WONK,opsz,wght].ttf` | `b24448c43702fac4ee856781d461a0dfba8d8e594b6e8e190234b75fed2c0e01` | `c9745ee907c02cdd46cc41a65bb711cd861432f679a76c18e3de204a18723040` |
| `fraunces-variable.woff2` | `ofl/fraunces/Fraunces[SOFT,WONK,opsz,wght].ttf` | `177ff6c0f14e5550a3c624247cd1189611d4eb65d000b14944c63d967958abbb` | `88e17be075f1be50ab67b057b99e3701b828f44ed28f9452df6c02645bb0cba9` |
| `ibm-plex-mono-300.woff2` | `ofl/ibmplexmono/IBMPlexMono-Light.ttf` | `780bcf65509d72a35ec114b57bcbe220dc6b77d8ea2e9b25e294be3c570c5025` | `3ba63b4a88636cce580c10a5f460b69ef471ef505532caa7e4eaa35e93d58f1e` |
| `ibm-plex-mono-400.woff2` | `ofl/ibmplexmono/IBMPlexMono-Regular.ttf` | `6a3412f058c7d8dfd9170c41e85ade48e5156ecb89356110ca57a0a27734af46` | `c36f509c0a8f9f85f29cb44bc8701d8a9e0b14c499e77a884f789ead7093a7ac` |
| `ibm-plex-mono-500.woff2` | `ofl/ibmplexmono/IBMPlexMono-Medium.ttf` | `a9b4c49bb299e05b5f6c481e7fb5e78943d2793249a0c8874ab574a2d1ea6755` | `a76f53ca6612e7b3828eec2311098675b7f9849ae4169a8bcef6302aec02a6c0` |
| `ibm-plex-mono-600.woff2` | `ofl/ibmplexmono/IBMPlexMono-SemiBold.ttf` | `d3c38e55c78f5b0f28009fddba4834ec503278936a5986032424c9bd2d23aa46` | `ad4580d8cb4b5f627c2d18457656732f7f7b070f7837fbc380e08054157e6f6c` |
| `ibm-plex-mono-700.woff2` | `ofl/ibmplexmono/IBMPlexMono-Bold.ttf` | `ac27abd6450a64dd94467580a02fe6235156d5b92f2926ebbc8e7489df64e0be` | `9e1455e6e9c5866f607e464fffb7855486dcf575b7e69b83a3d234e587fce41b` |
| `instrument-sans-variable.woff2` | `ofl/instrumentsans/InstrumentSans[wdth,wght].ttf` | `b24f1812584816958afcf22e22d08e44318c5e51651e25d2438efdde389b33b1` | `6219bc4bfdfc5d9b2201dcdf046218b122a758f932e25ed5f168f929b7ca2311` |
| `instrument-serif-400-italic.woff2` | `ofl/instrumentserif/InstrumentSerif-Italic.ttf` | `08939b8bdf534afec24ae0ef5e03f948940cd9a8fe08e7fecbad040e62327385` | `6ee678c33f388dd7ba59700ebea635deb98821baafd817b09891f7927177f702` |
| `instrument-serif-400.woff2` | `ofl/instrumentserif/InstrumentSerif-Regular.ttf` | `498efd461f6ddfcb7a111bf9a565709d2085d48201d501ead960d93e84ffbb88` | `60c06664b5a95c7de6cc3e00d1f9034d78bd1e40b564016b241674449a067d4d` |
| `jetbrains-mono-variable.woff2` | `ofl/jetbrainsmono/JetBrainsMono[wght].ttf` | `48715a42ec242c21e9f02692891e147d022299a52e48d5e413e1a942193ffeda` | `2c32b9b3ee358c119e210f6f5195f9bd34894d78a785ff2e95d60e718e400af4` |
| `kurale-400.woff2` | `ofl/kurale/Kurale-Regular.ttf` | `6055aaca6870ca64210dd81fa47f8bb71595a9c8fbe570351ed45a15f1a0820d` | `4ffedd2438a9363de0193f2c1caef766c6fa4d3367678ce58482728f8ecf3e60` |
| `lato-300.woff2` | `ofl/lato/Lato-Light.ttf` | `cf2a774503baf418d584f49967bd160e1e03f087c13b25602f28024ec7788f08` | `1eb95a3957695ee8efce31e1e82d766a4ff4e6c1cf093a4b15277084dc4e4702` |
| `lato-400.woff2` | `ofl/lato/Lato-Regular.ttf` | `d636e4683231f931eda222d588e944d082bfd3bdba02f928bee461c0f185b251` | `96f1b4b6fa9e1f2296861fff3124b5b755162a8d2e3e1dc6ca9596586c609ba5` |
| `lato-700.woff2` | `ofl/lato/Lato-Bold.ttf` | `8a0aace75d33794eece4b28187bfc1df0bbd2888b5d8a56e01788c8d65d16be1` | `e475be6ac4a64d3e9ce67217c7bc3fb22c28dc661c9ab9b08e3459ab7e924128` |
| `montserrat-variable.woff2` | `ofl/montserrat/Montserrat[wght].ttf` | `0f7b311b2f3279e4eef9b2f968bcdbab6e28f4daeb1f049f4f278a902bcd82f7` | `6438d7b8ea9c7c3992d5e2fd2afdb1ff948570a3ef0bedae76247b51632960ba` |
| `space-grotesk-variable.woff2` | `ofl/spacegrotesk/SpaceGrotesk[wght].ttf` | `acad6de1fc93436f5c0f1f4137751ef04f1aea3063e7036535970ffcfbd79f72` | `a0d054c4af557de20afd6ca59f47ab353bcaec49c63ff04b6c9d39d0f8910557` |

Upstream source files and licences are available at:
`https://github.com/google/fonts/tree/038b637da7b3fd956a4ed93ffc607c3d5e4ce172/ofl`.
