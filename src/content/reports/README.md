# AICV Report Nodes — House Conventions

Authoring checklist for every category report in this directory. **Canonical record:** root `STATE.md` (entries `2026-06-05` and `2026-06-11`). This file is a pointer; if the two disagree, STATE.md wins.

> This is a `.md` file. The reports content collection loads `**/*.mdx` only (see `src/content.config.ts`), so this README is never treated as a report entry and never hits the Zod schema.

## Frontmatter (all required — Zod schema: `reports` in `src/content.config.ts`)
`title · description · date · period · report_type · status · tags · sections · canonical`
- Category reports use `report_type: "agent-readiness"` and **label-style** `sections` identifiers (not slug-style).
- `canonical` is the full URL with trailing slash: `https://aicoachellavalley.com/reports/<slug>/`.

## The three standing conventions

1. **House voice — mark interpretation, state data plainly.** Prefix interpretive/strategic claims with `According to AICV, …`; state measured data without it. Lead every `### What This Means for the Coachella Valley` subsection with it; attach it to standalone strategic claims (e.g. the closing thesis). Do **not** attach it to pure data statements — overuse defeats the marker.

2. **Closing sequence — three elements, in this order, before the italic publisher footer:**
   1. **Free-diagnostic CTA** → `/get-agent-ready/` ("free, immediate, no AICV engagement required").
   2. **Recurring-series framing** — which entry this is, which verticals come next, the baseline this report puts on the record.
   3. **Institutional publisher/footer block** — AICV org-published declaration + methodology transparency hook + .com/.org surface clarification + "aicoachellavalley.com is a product and service of SunshineFM LLC." + "nodes, briefs, and reports are available at aicoachellavalley.com" callout.

   **No fiscal-sponsorship clause (founder ruling 2026-08-11).** The block used to close with "; aicoachellavalley.org is a fiscally sponsored project of the [Desert Community Foundation]". That clause was correctly scoped — it named `.org`, not AICV — and it was preserved as compliant by the 2026-08-07/08 sweeps. It comes out anyway: `.com` is a commercial surface owned by SunshineFM LLC, and it does not carry `.org`'s sponsorship framing even accurately. Removed from all 11 instances in the same commit as this spec change. DCF remains a legitimate first-mention link (below) wherever a report discusses the foundation as a *subject*.

   **Adoption is partial, and the spec is the aspiration, not the census.** 6 of 14 reports carry this block; 8 do not — including every report since Wellness. If a future pass standardises the closing sequence, the block to propagate is the post-ruling one above, not the version any older report still shows.

3. **Cross-report number hygiene.** If your figures touch a category a prior report already covered, reconcile the numbers explicitly (2–3 sentences, name the prior report) rather than letting two figures stand unexplained and read as a contradiction. Worked example: dining's ground-up census (1,423 / 924 independents) vs. the visitor-economy report's directory-sourced scored subset (Dining = 956, mean 3.01, 5.5% Tier A) — different scope/method, not a conflict.

## Editorial links (from the 2026-06-05 STATE.md entry)
First-mention canonical links for: `[AICV (AI Coachella Valley)](https://aicoachellavalley.com)`, aicoachellavalley.com, aicoachellavalley.org, `[Desert Community Foundation](https://desertcommunityfoundation.org)`, internal programs (`[Get Agent Ready program](/get-agent-ready/)`, `[Minimum Viable Agent framework](/minimum-viable-agent/)`), and prior reports (link to their canonical `/reports/<slug>/`). Standard markdown links — no MDX components.
