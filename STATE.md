# com/ operational state

> Operational state only. Strategic state lives in `aicv-playbook/STATE.md`.

## 2026-04-22 — Tier 4 agent-readiness achieved

- **Cloudflare Pro** upgrade on aicoachellavalley.com zone
- **Markdown for Agents** enabled at CDN edge — agents requesting `Accept: text/markdown` get edge-converted markdown with `Content-Signal: ai-train=yes, search=yes, ai-input=yes` response header
- **aicoachellavalley.com now at Tier 4** of the four-tier agent-readiness framework (see aicv-playbook CLAUDE.md)
- **80 nodes, 133 briefs, 3 snapshots, 1 report** as of this date

### Agent discovery endpoints (as of 2026-04-22)

- `/robots.txt` — Content-Signal directive
- `/llms.txt` — human-readable content summary
- `/nodes.json`, `/briefs.json`, `/snapshots.json`, `/reports.json` — structured data
- `/_headers` — 6 Link headers on homepage, Content-Type rule for api-catalog
- `/.well-known/api-catalog` — RFC 9727 linkset (application/linkset+json)
- `/.well-known/mcp/server-card.json` — SEP-2127 draft MCP Server Card advertising mcp.aicoachellavalley.com with 5 tools

### Commits

- **35c1464** — feat: add FAQPage schema, expand WebSite description
- **41cc994** — feat: agent discovery — Content Signals, Link headers, API catalog, MCP Server Card

### Known debt

Layer 2 work (bidirectional node references, explicit relationship types from four-layer framework, temporal structure in briefs, aggregation surfaces) is the next major architectural build — see aicv-playbook CLAUDE.md "Collective signal vision." No near-term tactical debt queued.

---

## 2026-04-19 — Stats pipeline + Phase 3 completion

- **Commit range:** `612354b..f15da21` (6 commits)
- **Deployed to:** `origin/main` via Cloudflare Pages
- **Framework:** Astro static build
- **Deploy trigger:** Cloudflare Pages invokes `npm run build`, which
  runs the prebuild hook (`scripts/generate-stats.mjs`) before
  `astro build`

## Verified live URLs (all green as of 2026-04-19)

- <https://aicoachellavalley.com/briefs/> — 131 briefs
- <https://aicoachellavalley.com/nodes/node-zero/> — "80 nodes across
  nine cities and adjacent communities"
- <https://aicoachellavalley.com/llms.txt> — dynamic counts (Astro
  endpoint)
- <https://aicoachellavalley.com/sitemap.xml> — 3 snapshots enumerated
  dynamically
- <https://aicoachellavalley.com/stats.json> — valid JSON, current
  timestamp and counts

## Stats pipeline

A prebuild hook runs `scripts/generate-stats.mjs` before every
`astro build`. The script reads the content collections and writes
computed counts to `public/stats.json` and `src/data/stats.json`. All
surfaces that display counts import from those files rather than
hardcoding values. Cloudflare Pages triggers this chain automatically
on push to `origin/main`.
