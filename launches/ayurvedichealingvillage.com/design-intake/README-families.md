# Per-family design intake — one folder per template family

Nineteen families are being redesigned (docs/reports/2026-09-19-ahv-article-template-families-and-design-brief.md).
One folder each, so nothing gets mixed up:

    design-intake/
      T14-enquiry/          T15-confirmation/     T1-explain/
      T16-campaign-long/    T5-experience/        T12-gallery/     … etc

**In each family folder:**

| file | what it is | who writes it |
|---|---|---|
| `BRIEF.md` | the owner's instruction for this family, verbatim, plus what was measured | owner dictates, agent records |
| `desktop-*.png` / share link | the Claude Design output at 1440 | **owner** |
| `mobile-*.png` / share link | the Claude Design output at 390 | **owner** |
| `OPEN.md` | anything the agent must not decide alone | agent |

The agent does not design. It implements what lands here. A family with no design in its
folder is not ready, and the agent asks rather than inventing one (MODE A, CLAUDE.md).
