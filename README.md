# homepage

Source for **aicoachellavalley.com** — the AICV Intelligence Network's
agent-native platform. Astro v6, deployed on Cloudflare Pages.

## What this serves

The public `.com` surface for AI Coachella Valley: regional nodes,
intelligence briefs, snapshots, and the `/get-agent-ready/` analyzer.
Built to be read by agents first and humans second.

## Stack

| Layer | Tech |
| :--- | :--- |
| Framework | Astro v6 (static output) |
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

Headers advertise `llms.txt` and `llms-full.txt` via Link `rel="llms-txt"`
and `rel="llms-full-txt"` (emerging convention, pending IANA registration).

## Related

- **aicoachellavalley.org** — civic / nonprofit face
  ([repo](https://github.com/aicoachellavalley/aicoachellavalley-org))
- **AI Coachella Valley** — [aicoachellavalley.com](https://aicoachellavalley.com)
