# homepage

Source for **aicoachellavalley.com** — the AICV Intelligence Network's
agent-native platform. Astro v7, deployed on Cloudflare Pages.

## What this serves

The public `.com` surface for AI Coachella Valley: regional nodes,
intelligence briefs, snapshots, and the `/get-agent-ready/` analyzer.
Built to be read by agents first and humans second.

## Stack

| Layer | Tech |
| :--- | :--- |
| Framework | Astro v7 (static output) |
| Hosting | Cloudflare Pages |
| Worker | aicv-api.sunshinefm.workers.dev |
| Auto-deploy | push to `main` |

## Agent endpoints

- `/llms.txt` — site summary, generated at build time
- `/llms-full.txt` — full content dump (nodes + briefs)
- `/.well-known/mcp/server-card.json` — MCP server card
- `/.well-known/api-catalog` — API catalog index
- `/nodes.json`, `/briefs.json` — static JSON corpora
- `/sitemap.xml`

## Team retreat decisions

`/plan-team-retreat/` and the read-only `/mcp` and
`/api/resolve-local-intent` endpoints share the same qualified retreat records
and comparison logic. Preview identity alone does not qualify a property.
The resolver returns a short conditional comparison, fit judgments, documented
exclusions, unresolved requirements and official business handoffs. Supporting
providers are separate inquiry options. Rates, room blocks, contractual privacy
and itinerary-specific accessibility require direct confirmation.

Records live in `src/data/retreat-options.json`; field-level provenance and the
research handoffs live in `research/`. Build generation preserves recorded
source-check dates and the historical node and preview measurements.
Recommendation eligibility and ranking do not use payment to AICV.

Validate with `npm audit --audit-level=low`, `npm test`, then
`AICV_NO_INDEXNOW=1 npm run build`. The build runs pricing, ownership,
amendment, node-content and rendered-page gates. Retreat benchmarks are synthetic
and exercise the MCP response as well as resolver behavior.

Push the review branch and open a PR to obtain the existing Git-connected
Cloudflare preview. Do not merge `main` or deploy production before Sat's
review. Run `scripts/verify-retreat-preview.mjs` against the immutable preview
MCP URL, using the official MCP SDK from a temporary installation; the site
does not require a new runtime dependency. Refresh personal connector tool
metadata or use a preview ZIP to test the expanded inputs; instructions are in
`plugins/aicv-regional-intelligence/README.md`.

## Regional decisions and bounded action pilot

`/choose-workspace/` renders all seven qualified workspace/founder-support
records from `src/data/workspace-options.json`, their dated sources, restrictions
and unknowns. The same data enters the three existing read-only MCP tools.
Structured inputs now include decision/type, access/duration, working setup,
budget amount/scope, requested/excluded names or IDs, and required action.
Shared interpretation reports contradictions while retaining explicit fields;
browser inquiries preserve the compared requirements only while the form matches.
The original 15 retreat venues, five services and historical dates remain intact.

| Gap | Implemented result | Remaining evidence or approval |
| --- | --- | --- |
| Workspace and founder decisions had generic context | Seven scoped official-source records, meaningful comparisons and rendered evidence | Operator confirmation of access, complete price, capacity, eligibility and date-specific availability |
| Free text could lose requirements | Structured bounded fields, shared entity/location/duration interpretation, explicit conflict output and consistent prepared briefs | Clarify contradictory or missing caller requirements before an offer |
| Distribution metadata described retreat only | Version 0.3.0 package, public resources and unsent listing/share drafts | Sat-approved production release; verified publisher/domain, actual account reviewer cases/demo, submission and publication |
| Outside-assistant discovery unmeasured | Eight fresh Gemini/Grok conversations plus separate search/crawl receipts | ZeroAICV.com citations observed; account context unisolated; repeat after publication/indexing |
| No authoritative booking/payment workflow | Runnable local/mock adapter and browser demo, with exact approval, holds, retries, verified events, reconciliation and refunds | Operator permission, supported interface, authorized sandbox, scoped credentials, full terms and observed fulfillment |

Run `node scripts/run-transaction-pilot.mjs` or open `/action-pilot/`.
**LOCAL/MOCK ONLY:** synthetic inventory, a fictional complete $33 quote,
public fake signing key and in-memory state. Hive's published $30 base/day
remains separate; real tax/fees, availability and cancellation policy are unknown.
Confirmation requires verified synthetic payment AND authoritative mock operator
acceptance. A browser success screen cannot confirm. Nothing is booked or paid.
No transaction tools were added to MCP, and no raw card/contact fields or new
runtime dependencies were introduced. The demo is noindex and outside the sitemap.

Discovery receipts and unsent public-submission/private-share materials:
`research/discovery-2026-10-07.{md,json}`. Eight actual fresh conversations
returned zero AICV.com citations and one AICV.org community mention; signed-in
account memory/workspace isolation is unproven. Four ordinary Exa searches are
SEARCH observations, never assistant conversations. SDK checks are synthetic
connected retrieval, never organic discovery. WebMCP was not implemented because
supported browser/origin-trial behavior was not verified; it would operate after
a page visit and does not establish search discovery.

Source notes: `research/workspace-evidence-2026-10-07.{md,json}`.
Independent runtime findings: `research/action-readiness-evaluation-2026-10-07.md`.
Exact merchant permissions, sandbox/credential requirements, real-provider failure
matrix and unsent Hive outreach: `research/transaction-pilot-2026-10-07.md`.
All outreach, portal applications, account setup, agreements, live transactions,
production publication and live action capability require separate authorization.

Run `scripts/verify-regional-preview.mjs --endpoint https://<immutable-preview>/mcp
--sdk-path /path/to/node_modules/@modelcontextprotocol/sdk` with an external
official SDK installation. It retains 18 retreat scenarios and adds 13 workspace
scenarios, identity checks and negative controls. A new review PR is stacked on
unmerged PR #2; merging it into that review branch does not authorize main publication.

Headers advertise `llms.txt` and `llms-full.txt` via Link `rel="llms-txt"`
and `rel="llms-full-txt"` (emerging convention, pending IANA registration).

## Related

- **aicoachellavalley.org** — civic / community face
  ([repo](https://github.com/aicoachellavalley/aicoachellavalley-org))
- **AI Coachella Valley** — [aicoachellavalley.com](https://aicoachellavalley.com)
