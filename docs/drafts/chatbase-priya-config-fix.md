# Chatbase "Priya" bot — the exact config changes, ready to paste

**Status: DRAFT for whoever holds the Chatbase dashboard. Nothing here is applied by any agent —
the bot config lives outside this repo.** Drafted 2026-09-21 alongside the owner's ruling to ship
the bubble on the AHV English lane as-is; this is the mitigation, not a blocker on that.

Source of the findings: QUESTIONS.md **Q-CHATBOT-WRONG-NUMBER** (2026-07-18), with runtime evidence
at `launches/ayurvedafranchise.com/evidence/chat-bubble-open-disclosure.png` and
`chat-bubble-footer-zoom-WRONG-NUMBER.png`. **Every fleet site carrying the interim bot shows the
same config**, so fixing it once fixes all of them — including the 252 AHV English routes the
bubble now ships on.

Bot id: `rpNt_uRW6W8EDiTf6AvYJ` (`CHATBASE_PRIYA_BOT_ID`, packages/chat/src/ChatbaseLoader.tsx).

---

## 1 · The WhatsApp number is wrong — fix first

| | |
|---|---|
| currently prints | `WhatsApp: +91-92898-38794` |
| must print | `WhatsApp: +91 92898 38797` |

This is a **LOCKED FACT** (CLAUDE.md: Priya's KTAHV WhatsApp is +91 92898 38797, fix on sight).
A wrong contact number on a NABH-accredited hospital's chat widget sends a patient to a number
that is not ours. Of the three items here this is the one that costs something the day it is read.

## 2 · No honest-AI disclosure

| | |
|---|---|
| currently | display name **"Priya Sharma - Kairali"**, with a human avatar photograph |
| change to | display name **"Priya — Kairali's AI assistant"**, and replace the human photograph with a non-human mark (the Kairali leaf or a simple monogram) |

The page copy around the widget already discloses AI-first; the widget itself does not, and the
human photo actively contradicts it. Every lane doc and audit since D-20260718-05 asks for
"Priya, our AI assistant".

## 3 · "Trusted since 1908" in the footer

| | |
|---|---|
| currently | `Trusted since 1908` |
| change to | `Kairali — health through Ayurveda` *(drop the date entirely)* |

1908 is the **family lineage** origin; the **group** was founded 1989. Attaching 1908 to the group
is the conflation `D-1908-WORDING` bans, and this repo already carries a repair tool
(`tools/repair-1908-attribution.mjs`) that enforces the ruled form in site copy. The widget is
outside that tool's reach, so it has to be changed by hand.

## 4 · Greeting register (AHV specifically)

The interim greeting is KTAHV consumer copy. On the AHV English lane that is on-entity, so it does
not need changing for this site — but note it must stay inside the **clinical register**: patient,
physician, treatment, programme, Panchakarma, admission, discharge, consultation. The banned-word
list is the KTAHV LANGUAGE LOCK in CLAUDE.md; it is not repeated here, and the greeting must be
checked against it before it is pasted.

Suggested AHV greeting, clinical register, AI-disclosed:

> Hello — I'm Priya, Kairali's AI assistant. I can help you find a treatment programme, explain what
> an admission involves, or arrange a consultation with an Ayurvedic physician. What brings you here
> today?

---

## After the change

Reopen the bubble on any fleet site and check the footer prints `+91 92898 38797`, the name
discloses AI, and no "1908" claim attaches to the group. One screenshot closes
Q-CHATBOT-WRONG-NUMBER for the whole fleet.
