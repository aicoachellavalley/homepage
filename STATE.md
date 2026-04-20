# com/ operational state

> Operational state only. Strategic state lives in `aicv-playbook/STATE.md`.

## Today's deploy — 2026-04-19

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
