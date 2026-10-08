# Independent action-readiness review — October 7, 2026

Reviewer owns this evaluation only and did not author the resolver or transaction module. The reviewer authored the regional source records, so source review is a primary-source spot check rather than an independent research replication. Runtime/transaction checks below are separate from discovery search checks, preview network tests and live operator behavior.

## Source boundaries checked

| Consequential interpretation | Primary-source basis | Required implementation behavior |
| --- | --- | --- |
| Hive desk access | [Memberships](https://www.thehivecoworking.com/memberships): $30 drop-in desk/day; first-come first-served or call for a specific spot | Do not promise availability or hold a desk from a published price |
| Hive room capacity | [Conference room](https://www.thehivecoworking.com/conference-room-rentals): eight comfortable seats; operator also permits additional people that fit | Eight is a working configuration, not a documented occupancy maximum; larger requests need confirmation |
| Fusion published price | [Location page](https://www.fusionworkplaces.com/locations/palm-desert-ca/): $119/month Address virtual-office plan | Do not use virtual-address pricing to satisfy physical desk, office or meeting-room budgets |
| Regus price | [Specific centre](https://www.regus.com/en/us/6794): starting rates by product | Preserve starting-price qualifier and scope; no guaranteed complete price |
| ERC current operations | [Newer page](https://rlce.csusb.edu/pderc), [older homepage](https://rlce.csusb.edu/), [legacy inventory](https://entre.csusb.edu/content/ihub-office) conflict on hours and retain old inventory/branding | Keep current availability/capacity unknown and preserve September 1 institutional-strain observation |
| Founder programs | [CVWBC counseling](https://cvwbc.org/business-counseling/), [SBDC intake](https://ociesmallbusiness.org/schedule-an-appointment/), [Indio city program](https://www.indio.org/departments/economic-development/indio-business-connect) | Program duration, intake duration, geographic eligibility and currently open application windows stay separate |

All sources checked October 7. These source reads do not verify operation, facility access, appointment inventory or a supported operator API. Public records expose `official_handoff`; source availability is unknown for every option. Local observation/import dates and preview verification dates remain historical.

## Runtime and mock review

**Final focused result: 16 independent workspace/adversarial tests, seven shared-quantity regression tests and 25 transaction tests pass.** The evaluator also ran the mock CLI, reviewed the browser demo source and checked the semantic contract mutations below. The lead owns full repository/build gates, actual browser execution and preview network verification; those are not asserted by this review.

## Initial adversarial findings sent to authors

The arriving mock's 22 authored tests passed. Two independent executions failed: an approved cancellation retry after the original date cutoff returned `mock-cancellation-window-closed`; a next-day Pacific request at `2026-10-08T02:00:00Z` was rejected as `date-not-future` because the current calendar date was computed in UTC. Cancellation's fixed `-08:00` boundary also needed a Pacific/DST policy. These are mock correctness defects, not real charges or reservations.

The first resolver draft preserved Hive's conditional eight-seat scope, unknown availability, virtual-office budget caveat and ERC institutional warning. Independent cases found:

- Regus's documented day-pass string was excluded by a boolean-only access check.
- A virtual-office request returned Hive without a sourced virtual-office product.
- A generic Palm Desert workspace request returned CVWBC counseling as a physical workspace candidate.
- Structured four hours/eight people correctly took precedence over free-text two hours/twelve people, but no conflict was reported.
- “not private coworking desk” inferred a positive privacy request.
- A mixed explicit team-retreat/workspace phrase selected workspace before retreat, requiring a conservative precedence or ambiguity decision.

The author was given exact inputs and observed outputs. All listed findings were corrected and independently rechecked. A later structured physical-office request initially fell through to ordinary name search and returned Fusion Fitness; structured workspace type/access now selects the workspace resolver, and physical office/office lease wording is recognized. The mixed phrase “A coworking desk, not a private office, but confidential calls require privacy” initially became an office request with no privacy requirement; scoped negation now preserves the separate positive confidential-call requirement. Source-supported aliases preserve Hive, Fusion, Regus, CVWBC, OCIE SBDC and Palm Desert ERC identities. Ambiguous short IBC was omitted.


## Fix verification and practical limits

`node --test scripts/workspace-adversarial.test.mjs` passes all **14** cases against current source records and retained historical context. Cases exercise both source-specific limits and caller requirements: two published day-pass operators without inventory claims; Hive nine-person conditional inquiry; Fusion physical-price uncertainty; virtual-product filtering; counseling-versus-workspace separation; ERC conflicting hours, current unknown capacity and September 1 observation; structured headcount/hours/days conflicts; simple and mixed privacy negation; retreat versus structured decision routing; supported aliases, exclusions and unknown requested entities; exact comparison-to-brief requirements; and transaction-capability rejection. Two semantic mutations confirm that an invented canonical local ID and stale ten-seat ERC inventory presented as current unknown evidence are rejected. The source JSON and research JSON remain identical.

`node --test scripts/transaction-pilot.test.mjs` passes **25** cases after the two independent defect reports and DST policy correction. The final CLI returns `awaiting-verified-payment` after the browser-success read, `paid-awaiting-operator` after verified synthetic payment, then `confirmed-mock` only after mock operator acceptance. Identical execution retry retains one booking and one payment session; approved cancellation yields `cancelled-refunded`. The exact terms now state the Pacific visit-date midnight cutoff. These results establish only the single-instance in-memory mock behavior.

The browser source explicitly labels all transaction controls and the $33 complete quote as fictional, the $3 tax as an invented fixture, and the public HMAC as synthetic integrity rather than provider security. It exposes no card input, external payment call, remote live-action tool or WebMCP transaction registration. Source inspection is not browser execution. Per-process durable retries, multi-process inventory, buyer/operator authentication, real-provider signature/context validation and merchant fulfillment are untested and remain activation requirements.

No unresolved resolver/adapter correctness defect from these focused checks remains. A source-level navigation mismatch was flagged to integration and corrected: the mock page now links `/choose-workspace/`. This evaluator verified the corrected source link; the lead owns rendered link verification. This statement is bounded to the tested cases, not a universal natural-language guarantee. Public business records still have unknown availability, complete prices and access/terms questions. No operator authority, real sandbox, real payment, confirmed booking or live activation was established. Outside-assistant blind discovery was not tested by this reviewer.

## Browser-discovered quantity correction follow-up

The lead's actual browser QA on immutable preview `d062d6cc` found that a requested **1.5 hours** became **5 hours** in the prepared brief. This was a lead-observed browser defect, not an independent browser observation by this evaluator. The shared raw-query quantity helper now preserves decimal punctuation before text normalization; server requirements, lodging interpretation and workspace briefs use that helper.

Independent rerun of `scripts/decision-requirements.test.mjs` passed all six new regression cases: 1.5-hour comparison/brief agreement; structured fractional conflict; comma-separated integer headcount and individual-room estimate; strict structured-city conflict; zero-night day-only lodging; and no unrelated fallback for a named unknown workspace. No new browser execution was claimed here.

Additional independent probes found edge cases beyond that first fix: `.5 hours` became 5, `0.5 hours` was unresolved because the query helper defaulted to a minimum of 1, `1-2 hours` became exactly 2, `-1.5 hours` became positive 1.5, and malformed `12,34 people` became 1234. Two meaningful adversarial regressions were added for half-hour preservation and ambiguous/invalid quantities; they initially failed. The correction preserves leading and explicit decimals with a 0.25-hour minimum, validates comma grouping and refuses range, sign, suffix and bounded-quantity interpretations as exact values. Unresolved hour requests carry an explicit clarification message. These later findings and their repair supersede the earlier quantity-handling checkpoint.


Final follow-up verification: `node --test scripts/workspace-adversarial.test.mjs scripts/decision-requirements.test.mjs` passes **23/23** (16 independent scenarios plus seven shared-quantity regressions). The reported `.5`/`0.5`, signed/ranged duration and malformed-headcount defects are fixed; fractional comparison and generated brief agree. The prior transaction verification remains **25/25** and was not broadly repeated after an unrelated parsing change. The lead owns current full-build gates and fresh immutable-preview/browser confirmation. No unresolved defect from the reported focused scenarios remains; general free-text interpretation is still conservative and does not promise arbitrary natural-language understanding.

Integration follow-up: the lead replaced raw internal-field JSON in prepared inquiries with readable requirement labels. Focused semantic assertions retain headcount, duration, budget scope, privacy, accessibility and requested action, while original caller text and conflict messages remain explicit. The lead reran all 23 focused decision checks; exact final browser rendering is in the integration receipt.
