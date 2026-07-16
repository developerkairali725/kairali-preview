# Quillrun — Kairali's content generation management system

**LOCKED FACT (Abilash, 2026-07-16 in-chat): "Quillrun" is the NAME of our content
generation management system.** Not a third-party SaaS reference — when Quillrun
appears in team communication, it means this internal system.

What is known so far (source: Ambuj's email, 16 Jul 2026, thread "FMS — publishing
website content into it for Roshni to review"):
- Quillrun has an **API endpoint that pulls data into a Google Sheet** (a "response
  sheet"); an **Apps Script trigger** picks up new rows and pushes them into the
  **FMS** (the flow-management sheet Roshni's editorial team works in).
- Ambuj is extending this same pattern for the website content pipeline: our page
  drafts → response sheet → FMS → Roshni edits → editor-approved (name+date) →
  doctor-approved (name+date, health rows only, fields auto-clear on later edits)
  → pre-publication scheduling. Publish is manual today across ~36 channels.
- Dropdown lists supplied to Ambuj 16 Jul 14:54: 5-physician panel (exact
  spellings) + Roshni A John (editor).

Gaps to fill as they surface: who owns/hosts Quillrun, its endpoint auth, whether
the agent writes to it directly or via the response sheet only.
