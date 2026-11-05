# Regional intelligence review — October 30, 2026

Review base: `82cd81ee34ec18d8aa2c98c9b07757fccce03874` on `main`.
Status: factual corrections staged for Sat's review; no merge or production publication authorized.

## Scope and method

Read repository `CLAUDE.md`, node instructions, schema, date/freshness generators, homepage journey, and the relevant retreat, aviation, economic-development, education, workforce and philanthropy nodes. Inventoried review dates for all 79 nodes. Read the published aviation page and compared its contradictory international-access claim with the repository and PSP's current publication. Rechecked 20 official information/action destinations with live fetches; receipts are in `regional-node-source-checks-2026-10-30.json`. A separate October 20 airport release supplies the construction update below.

This is a targeted review, not a full verification of every node or business preview. A readable page or login portal does not demonstrate successful booking, intake, payment, availability or assistant discovery. No forms were submitted. No hours, menus or inventory were added to a maintenance commitment. No assistant citations are promised.

## Changes staged

| Area | Finding and correction | Primary evidence checked October 30 |
| --- | --- | --- |
| Team Retreat: arrival | Aviation synthesis incorrectly denied all international nonstops; airport node cited Puerto Vallarta, absent from the current PSP list. State what PSP currently publishes: U.S. and Canadian service. Correct the retreat synthesis's year-round ORD/JFK assumption and remove conflicting fixed LA drive-time promises. | [PSP airline/destination list](https://flypsp.com/airline-baggage/) distinguishes seasonal and year-round routes. This is a source observation, not a claim that a route can never return. |
| Arrival infrastructure | Replace generic airport construction copy with the October 20 groundbreaking: $93.6 million outbound baggage system, more than $66.5 million federal funding, expected completion late 2028. Future capacity remains future. | [PSP official release, October 20, 2026](https://flypsp.com/palm-springs-international-airport-breaks-ground-on-93-6-million-baggage-handling-system/) |
| Satellite / founder support | Indio now advertises free business-related workspaces and a conference room at 45222 Towne Street. Add the official inquiry contact to the node and a dated fact to the existing assistant record. Replace its old fetch-failure constraint with the new readable-page observation. Do not reclassify the record as unrestricted coworking or change ranking. | [Indio Business Connect](https://www.indio.org/departments/economic-development/indio-business-connect). Eligibility, capacity, privacy and date-specific reservations still need confirmation. |
| Build, Invest, and Belong | CV Giving Day summary still implied 200+ participants despite its existing 2026 count of 173. Align summary/body with historical results; add the current enrollment instructions and November 3, 2026–February 23, 2027 window. Early giving starts February 2; event March 2, 2027. Remove the inaccurate blanket 30-day description and distinguish sponsor prize dollars from individual donation fees. | [Official results/about](https://www.cvgivingday.org/p/about), [official registration](https://www.cvgivingday.org/p/registration). Preserve results at their original 2023–2026 years; organizer approval remains required. |

## Official handoffs checked

All 20 receipt destinations returned HTTP 200 and relevant information, intake or login content. No confirmed broken action link among this targeted set. Repaired handoffs were missing clickable/direct instructions rather than confirmed dead destinations.

- Retreat: Ritz-Carlton events, Grand Hyatt meetings and Sensei groups. Sensei still publishes a buyout requirement for 10 or more rooms and a maximum of 48 guests; no change warranted. Rates and dates were not checked.
- Satellite: Hive memberships and login; Fusion Palm Desert and its Yardi portal; Regus 750 N Palm Canyon. Login/portal accessibility is not inventory validation. Fusion's public page and portal show different package figures; obtain an operator quote rather than treating either as an all-in price.
- Relocate / build: LiveWorkGPS redirects successfully to VGPS economic development; Palm Desert economic-development and start/grow-business pages work. `pderc.org` redirects successfully to `rlce.csusb.edu/pderc`. CVWBC counseling and Calendly intake, SBDC intake and Indio Business Connect work.
- Belong: DCF homepage and CV Giving Day about/registration work. DCF still names Mary Panesar as executive director; no personnel change staged.

A guessed PSP `/flights/airlines/` URL returned 404, but it is not the repository's published handoff and is not counted as a broken site link. An initial PSP fetch failed; a subsequent live fetch of the actual airline page succeeded. The legacy IECE ERC URL returned generic university content; the existing canonical workspace record already uses the working RLCE destination.

## Journey proposal — Sat's decision

1. **Team Retreat:** retain the working planner; prioritize correcting arrival facts. Venue selection still requires dates, rooms, meeting layout, budget and official confirmation.
2. **Satellite Base:** consider routing the homepage CTA to `/choose-workspace/`, with the historical founder-infrastructure report as supporting evidence. Today it goes to the report. The existing workspace page gives a more direct next step; this navigation change is proposed, not staged.
3. **Relocate the Startup:** the CTA currently lands at the broad intelligence index. Decide whether to commission a concise relocation decision page connecting housing, school eligibility, healthcare access, hiring and city permits. Do not infer school places, clinical access or available talent from institutional presence.
4. **Build, Invest, and Belong:** consider a valley-wide handoff rather than Palm Desert alone. Preserve city-specific permitting and direct users to qualified counseling and community participation. Distinguish grant opportunities from fiscal sponsorship; sponsorship does not provide funding automatically.

Before expanding education claims, recheck the workforce node's blanket COD free-tuition language, cyber-MBA ranking and institutional AI-program assertions. Before revising regional leadership claims, obtain primary evidence for any successor alliance or operator; VGPS links to coverage but that does not prove the new organization's mandate. No organizational change is staged from that secondary lead.

## Dates and freshness

All five edited nodes keep `last_updated: 2026-09-25` because checks were claim-specific, not full-node reverification. Only `last_modified` moves to October 30. Source checks are explicitly dated beside the affected claims. Existing research, census, preview and measurement dates are unchanged. The Indio assistant record retains its October 7 broad source date; only its new fact, targeted check and rechecked official action carry October 30.

Six nodes last reviewed July 29 crossed the 90-day limit on October 27 and remain `verified: false` in generated `nodes.json`: Indian Wells economic development, North Palm Desert development zone, AI economy, Riverside County economic development, Coachella Valley economic development, and Node Zero. Prioritize the two economic-development synthesis nodes and AI economy for primary-source re-verification. Editing their prose or checking one linked page would not justify restoring verification.

## Validation and release limits

- `AICV_NO_INDEXNOW=1 npm run build`: successful; test suite 180 passed, one skipped, zero failed. Pricing, ownership, entity, amendment, complete-node-content and rendered-page gates pass. 79 nodes, 317 HTML pages, 6,113 internal links checked.
- Targeted generated-output assertions: the five original review dates remain; modification dates are October 30; their verification expiry remains December 24. Exactly six overdue nodes stay unverified. No schema or freshness code changed.
- `git diff --check`: pass.
- `npm audit --audit-level=low`: fails with three pre-existing high-severity dependency groups (`undici`, `vite`, `zod`); installed versions match the current base lockfile. No dependency changes in this content PR. Resolve in a separate dependency patch before a production release.
- Companion playbook, journal and STATE files referenced under `~/AICV/` are unavailable in this environment; no counts or session entries were invented there. No new nodes were added. This report records the session and unchanged node count.

User authorization explicitly covers staging supported factual corrections in a draft PR; that scope governs the repository's propose/write gate for this review. Architectural/schema changes and production release remain outside scope. Sat's decisions: approve or revise these factual edits, choose the proposed journey destinations, and prioritize the overdue-node and dependency follow-ups.
