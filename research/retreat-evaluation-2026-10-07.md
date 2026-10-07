# Independent retreat evaluation — October 7, 2026

The expanded resolver passes **40 focused tests**, covering 13 synthetic planning scenarios through the actual `handleMcp` JSON-RPC adapter (including Bermuda Dunes), meaningful preference and policy comparisons, all 20 researched exact-ID retrievals, and nine evidence-contract checks. Retained tests cover coffee, unknown local records, satellite decisions, protocol discovery, invalid operations/arguments, HTTP parity, privacy-safe logging and the transaction boundary. This is a draft evaluation of the branch, not a production-release claim.

## Independent primary-source checks

The evaluator separately opened the following official publications on October 7. They are operator descriptions, not independent inspection, business attestation or current inventory. Field claims beyond these targeted checks rely on the other researchers’ attributed evidence and the build contract.

| Official source | Independent finding and decision implication |
| --- | --- |
| [Hotel Paseo meeting chart](https://www.hotelpaseo.com/meetings-weddings/) | Palm Boardroom conference 14 / U-shape 12 differs from reception 16. Paseo A/B conference 38 / U-shape 48 can frame a 16-person working-room inquiry. Exclusive in-house catering matters to an outside-chef plan. Neither the resort-wide event maximum nor reception count proves working seating. |
| [Courtyard Palm Desert event chart](https://www.marriott.com/en-us/hotels/ctdcy-courtyard-palm-desert/events/) | Desert Mallow conference and U-shape 20; Desert Star and Desert Candle conference 12. The venue’s largest-space 50 is a different layout. No date-specific quote or block is established. |
| [Old Polo corporate offering](https://oldpolo.com/corporate) and [FAQ](https://oldpolo.com/faqs) | Corporate page says Coachella and lodging 28; FAQ says Indio and 20 in the main estate with optional lodging approximately 60. City and contracted overnight footprint remain unresolved. Event maximum 200 proves neither overnight inventory nor a named working layout. |
| [VenueTEN official home](https://venueten.com/) | The combined footprint publishes 12 bedrooms across two residences and overnight accommodation up to 40. An explicit 16 separate-bedroom request conflicts; eight rooms from a sharing estimate only creates a conditional inquiry. Published inventory does not establish bed mix or availability. |
| [Frederick Loewe corporate offering](https://frederickloeweestate.com/corporate-events-retreats/) and [vacation lodging](https://frederickloeweestate.com/vacation-experience/) | Corporate use and vacation lodging have different scopes. Corporate minimum is two days; vacation minimum is three nights. The three-night vacation rule does not automatically exclude a two-night corporate lodging inquiry. Four bedrooms do not establish an overnight guest maximum. |

The lead’s targeted Hotel Paseo, Parker and JW node clarifications were reviewed. Larger-layout review prompted a separate evaluator check of the [Ritz chart](https://www.ritzcarlton.com/en/hotels/pspps-the-ritz-carlton-rancho-mirage/events/) (Salon I conference 60 / U-shape 54 / schoolroom 90) and [JW chart](https://www.marriott.com/en-us/hotels/ctdca-jw-marriott-desert-springs-resort-and-spa/events/) (three combined Sinatra salons conference 75 / U-shape 70 / schoolroom 120); neither count is a whole-property maximum. They preserve the September 25 broader node date, add a visible October 7 targeted note, remove crowding/default/price assumptions and separate named working layouts from aggregate area and reception totals. Remaining historical measurements are not newly verified by this evaluation.

## Synthetic scenario findings

The companion `retreat-benchmark-results.json` records actual in-process MCP responses and text/structured agreement. These are synthetic inputs, not fabricated assistant transcripts. The venue ordering is an editorial judgment; tests assert meaningful evidence consequences rather than an arbitrary exact order.

| Scenario | Observed consequence |
| --- | --- |
| Executive strategy, 16, two nights, private working room | Full-service and meeting-capable properties are compared with named layout evidence and privacy unknowns. Strategy alone does not imply an improvisation provider is a dedicated strategic-planning facilitator. |
| Shared lodging, 16, two nights, $25,000 total | Rooms become an explicit planning estimate of eight. Practical meeting hotels enter the comparison; affordability remains unknown and an itemized whole-retreat quote is requested. Frederick’s four-bedroom footprint conflicts with eight separate bedrooms. |
| Wellness, 16, two nights | Sensei and Two Bunch appear because of their documented wellness format; working-layout suitability stays unresolved. Generic seating evidence no longer suppresses every wellness specialist. |
| Boutique, 16 | Boutique records enter and fit reasons describe the property format. Boutique positioning is not a price or quietness claim. |
| Private estate, 16 sharing, chef and AV | Old Polo and VenueTEN enter conditionally with exclusive-use contract questions; chef and AV pathways are separate supporting services. No combined package or provider/property compatibility is inferred. |
| Day only, 16 | Nights become zero and lodging rooms become null. Day access remains an operator proposal where no day-use policy is established. Overnight minima are not automatically applied to a day-only inquiry. |
| Large, 60 | Sensei’s 48-guest buyout limit and VenueTEN’s 40 overnight guests exclude those arrangements. JW’s three combined Sinatra salons conference 75 and Ritz’s Salon I conference 60 enter with actual adequate published layouts. Smaller conditional alternates explicitly lack layout evidence for 60. Setup and availability still require a proposal. |
| Accessibility, 16 | Specific accessible rooms, meeting routes, restrooms and transport need confirmation. General accessibility statements add no anonymous fit bonus or suitability promise; questions change while selection remains comparable to the same request without an access constraint. |
| Strict Palm Desert | Only Palm Desert venue records enter. Known other-city records are documented exclusions. Old Polo is separately listed as a match that cannot be established because its city is unresolved. |
| Near Palm Springs | Municipal boundaries are relaxed as a regional anchor, with a maximum acceptable drive-time question. No distance or journey duration is verified. `within 10 miles` is an unsupported distance constraint, not an inferred municipal restriction. |
| Bermuda Dunes / VenueTEN | Known locality is supported and the researched VenueTEN record is returned by its stable existing hospitality ID. |
| Unsupported named Palm-prefixed motel | No unrelated venue fallback. The caller is asked for its exact name or official group-planning URL. |
| San Diego retreat | Outside-coverage response with no regional venue fallback. |

Additional focused cases cover Ritz’s boardroom vs whole-property scope, Hotel Paseo’s reception vs working seating, VenueTEN own-room vs shared-room requests, Sensei one-night policy, explicit municipal arguments even with `nearby: true`, and No Worries’ published 35-person catering ceiling. Exact record retrieval preserves the historical IDs, including the researched supporting-service identities.

## Defects challenged and repaired

Independent checks found unsupported named Palm-prefixed requests could receive unrelated candidates; an unresolved city could be presented as a documented incompatibility; short VenueTEN names could fail despite a qualified researched record; and general seating evidence could hide every wellness specialist. Regression checks now cover these behaviors. The resolver separates `unestablished_matches` from documented `exclusions`, respects strict city arguments, handles unsupported distance wording, and uses recorded operator aliases. Accessibility remains a required confirmation rather than a ranking bonus.

Evidence guard mutations permanently reject an unqualified record, invented node, guessed room inventory, reset historical preview date, reset node date, undated action, global derived source-date reset and exact-retrieval field-date reset. These checks test semantic failure modes, not the current venue order. Per-field dates and official-action dates are tested independently of each record’s targeted check date.

## Reproduction and delivery boundaries

Run locally after catalog generation:

```sh
node scripts/build-intent-catalog.mjs
node --test scripts/local-intent.test.mjs scripts/retreat-benchmarks.test.mjs scripts/retreat-contract.test.mjs
```

Real-network preview verification uses the official MCP SDK installed outside the website dependencies:

```sh
node scripts/verify-retreat-preview.mjs --endpoint https://<immutable-preview>/mcp --sdk-path /private/tmp/aicv-retreat-mcp-client/node_modules/@modelcontextprotocol/sdk
```

The client initializes, discovers all three tools and expanded schemas, compares text with structured output, runs 13 synthetic scenarios, submits one synthetic clarification, checks unknown-record and coffee controls, validates a synthetic booking/payment request retains the read-only boundary, and confirms unknown tools and malformed structured arguments produce MCP JSON-RPC InvalidParams errors (`-32602`). It prints a structured summary with selected IDs, sources, unknowns, exclusions, questions and official handoffs. It sends no operator inquiry or booking.

**Network preview evidence:** The official MCP SDK successfully connected to the [immutable Git preview](https://d8e42533.aicoachellavalley-homepage.pages.dev/mcp) on October 7, 2026 at **4:20 p.m. Pacific** (`2026-10-07T23:20:56.914Z`). The lead associated this deployment with source commit `1966546`; the server independently reports `aicv-local-intelligence` version `0.2.0`. The evaluator reviewed the client receipt and preserved it in [retreat-preview-results.json](./retreat-preview-results.json).

All 13 synthetic scenarios passed with text/structured agreement, including wellness specialists, separate supporting services, strict-city and nearby differences, Bermuda Dunes, adequate published working layouts for 60, unsupported named venues and outside coverage. The synthetic clarification preserved eight explicit shared rooms, two nights and the whole-retreat budget question. The booking/payment request returned `needs_details`, the explicit read-only boundary and an official proposal handoff, without transaction IDs or completion claims. Unknown tools, zero rooms and string-valued sharing arguments were rejected through actual SDK MCP JSON-RPC errors (`-32602`); the unknown record returned `not_found` and coffee retained its local-business intent.

This is real-network client retrieval against the immutable preview, supported by synthetic requests. It does not establish production publication, organic discovery, a personal assistant-account installation or an independent assistant conversation. No operator was contacted and no availability lookup, reservation or payment was executed. Live availability, total prices, contracted exclusivity, individual access suitability and dedicated strategic-planning facilitation remain gaps requiring their own evidence. Browser interaction review is a separate check owned by the lead.


The lead repeated the official client run after the browser-driven brief correction; the preserved receipt is the corrected preview above. Browser checks on that revision verified day-only briefs discard earlier eight-room/two-night counts, sharing estimates retain their conditional basis, and editing the form invalidates stale comparison notes. Copying confirmed nothing was sent; the official Courtyard Palm Desert handoff reached its Marriott events page with a planning pathway. These are synthetic lead-operated browser checks, not operator confirmation.
