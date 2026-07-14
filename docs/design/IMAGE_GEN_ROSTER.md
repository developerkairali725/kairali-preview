# Image-Generation Roster — Kairali Web Factory

**Decided 2026-07-14 15:22:13 IST · Abilash delegation ("hyper-realistic, must look real not AI-made, check edits") · 59 sources via 4-agent research pass · Amend via LEARNINGS-driven PRs only.**
**Standing law unchanged: AI imagery is ambient/nature/product ONLY per the register policy codes; NEVER people presented as patients/staff/clients on KTAHV; any image touching a KTAHV medical page routes through Dr. Deepu John's sign-off. Claude drafts prompts and names the tool — a human runs the generation.**

## The roster

| Role | Model (API id) | Why | Cost/image |
|---|---|---|---|
| **PRIMARY** — generation + edits | **OpenAI GPT Image 2 (`gpt-image-2`)** | #1 on both Artificial Analysis leaderboards — [text-to-image](https://artificialanalysis.ai/image/leaderboard/text-to-image) (Elo 1336) AND [editing](https://artificialanalysis.ai/image/leaderboard/editing) (Elo 1256). Key already held. Edits endpoint takes up to 16 reference images + mask. | ~$0.053 medium / ~$0.211 high; [Batch halves it](https://developers.openai.com/api/docs/pricing) → ambient at medium+Batch ≈ $0.026; hero/product at high |
| **SPECIALIST** — pixel-locked edits | **FLUX.2 edit (BFL API)** | GPT edits regenerate the whole frame (unmasked pixels can drift — [known issue](https://community.openai.com/t/image-editing-inpainting-with-a-mask-for-gpt-image-1-replaces-the-entire-image/1244275)). When a KAPPL product shot must stay pixel-identical outside the edit, or a series needs locked object consistency (10 reference images), use FLUX.2. C2PA-signed outputs. | [$0.03–0.07](https://bfl.ai/pricing) |
| **FALLBACK / bulk / 4K** | **Google Nano Banana 2 (`gemini-3.1-flash-image`)**; Pro (`gemini-3-pro-image-preview`) for 4K | Near-Pro quality at half price, #3 editor, best conversational revision loop, SynthID + Vertex indemnification. | [$0.067/1K](https://openrouter.ai/google/gemini-3.1-flash-image-preview) · [$0.24/4K Pro](https://cloud.google.com/blog/products/ai-machine-learning/nano-banana-pro-available-for-enterprise) |
| **VIDEO only** | **Higgsfield** (unchanged) | Register-approved for video; its Soul stills model is out-ranked by the roster above — do not extend to stills except frame-matching a Higgsfield video campaign. | — |

**Rejected:** Midjourney V8.1 (no public API, no C2PA, >$1M-revenue commercial clause) · Ideogram/Recraft (not photorealism leaders; revisit Recraft only if packaging-text renders become a need).

**QA caveat on the primary:** the GPT-4o-era warm/sepia cast was a documented AI tell ([TechRadar](https://www.techradar.com/ai-platforms-assistants/chatgpt/tired-of-that-yellow-tint-in-chatgpt-images-heres-how-to-fix-it-with-simple-color-correction)); gpt-image-2 is newer, but Kairali's palette is deliberately warm, so a baked cast would compound — color-grade check stays in the asset QA.

## Prompting guide — "looks real, not AI"

1. Write a **photographer's brief**, not an adjective pile: lens + aperture + light first — "35mm, f/8, overcast monsoon light" (grounds) · "85mm macro, f/2.8, raking window light" (product texture).
2. Anchor color science to film: "shot on Kodak Portra 400, subtle grain" ([why](https://miraflow.ai/blog/how-to-make-ai-images-look-like-real-photos-prompt-tricks)).
3. **Demand imperfection**: visible grain, dust motes, steam, uneven leaf surfaces, slight motion blur — "too clean" is the tell ([14 AI tells](https://roblaughter.medium.com/is-that-image-ai-here-are-14-telltale-signs-to-look-for-d40e5cff2d0a)).
4. Never prompt "hyper-realistic / 8K / stunning" — ask for a plausible *ordinary photograph* (the "flickr 2007" principle).
5. Negative-prompt the tells: "no plastic textures, no HDR tone mapping, no 3D render, no beauty filter, no oversaturation."
6. QA every asset: repeating/clone-stamped foliage · shadow-direction consistency · blown highlights · absent grain · gibberish text.
7. Generate 3–5 seed variants; **pick, don't regenerate-and-pray**.

## Metadata & integrity (non-negotiable)

OpenAI outputs carry C2PA + SynthID by default — **never strip them** (WP/CDN recompression can; verify post-upload). At media-library ingest add IPTC `DigitalSourceType = trainedAlgorithmicMedia` + creator/credit, and record model + prompt in the IMAGE_CATALOG row. This is Google's own guidance for generated imagery and pre-complies with the EU AI Act disclosure (Aug 2026). The "not flagged as AI" goal is met by *quality* (images that read as real photography to humans) — never by hiding provenance, which is the pattern that actually gets sites burned.
