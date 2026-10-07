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

Headers advertise `llms.txt` and `llms-full.txt` via Link `rel="llms-txt"`
and `rel="llms-full-txt"` (emerging convention, pending IANA registration).

## Related

- **aicoachellavalley.org** — civic / community face
  ([repo](https://github.com/aicoachellavalley/aicoachellavalley-org))
- **AI Coachella Valley** — [aicoachellavalley.com](https://aicoachellavalley.com)
