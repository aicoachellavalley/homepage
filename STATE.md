# com/ operational state

> Operational state only. Strategic state lives in `aicv-playbook/STATE.md`.

## 2026-04-23 — /get-agent-ready Phase 1 launch

- **Commit:** `32b6981` — feat: add /get-agent-ready commercial positioning page (Phase 1 — widget copied, homepage unchanged)
- **Deploy:** Cloudflare Pages auto-deploy on push to main; live at `https://aicoachellavalley.com/get-agent-ready/`
- **Scope:** new standalone page, 9 sections, AIO Tool widget copied verbatim from homepage, `@graph` JSON-LD (WebPage, BreadcrumbList, Service×2, FAQPage, UnitPriceSpecification), TOS modal + Escape handler copied, footer adds "Get Agent Ready" + Terms of Use trigger
- **Homepage regression check:** 200 OK, 30,859 bytes, `aio-section` + `id="aio"` present — unchanged
- **llms.txt:** Commercial Tier section added pointing to new page
- **IndexNow:** submitted manually (GET 202) — `build-static-json.cjs` only auto-submits the 4 JSON endpoints
- **Pricing locked:** AICV Ready $1,000 deploy + $2,500/yr; AICV Reviewed Founding $2,500 deploy + $5,000/yr (first 10 only); AICV Reviewed Standard $5,000 deploy + $7,500/yr
- **CSS namespace:** `gar-*` prefix to avoid homepage selector collision
- **Widget bundle verified separate:** homepage `index@_@astro.C3DEf_kG.css` vs new page `get-agent-ready@_@astro.Brs_PR_K.css`

### Phase 1 Verification Baselines — 2026-04-25

Verifications originally scheduled 2026-04-24; run 2026-04-25 due to prior session rate-limit deferral.

**AIO Tool — `/get-agent-ready/`** (run 2026-04-25)
- Score: **82 / Grade B** — target Grade A (90+) not met; 8 points short
- Pass (4): AI Crawler Access, Structured Data, Local Signals, Content Freshness
- Warn (3): Entity Clarity (sales-page framing obscures standalone entity description), Content Completeness (no leadership names, no street address, no client testimonials), Hallucination Risk (80-node/133-brief claims not directly verifiable from page)
- All warns are content additions, not structural issues — addressable in Phase 2

**Cloudflare Agent-Readiness — `/get-agent-ready/`** (2026-04-25)
- isitagentready.com has no public API; page-specific scan not automatable
- Domain infrastructure verified manually: robots.txt ✓, llms.txt ✓, sitemap.xml ✓, .well-known/api-catalog ✓, .well-known/mcp/server-card.json ✓, Markdown for Agents (text/markdown) ✓, all Link headers present ✓
- Domain-level score unchanged → **75 / Level 5 Agent-Native** (inherited from homepage baseline)
- Manual browser scan on isitagentready.com recommended to confirm; all infrastructure checks expected to pass identically

**Google Rich Results — `/get-agent-ready/`** (2026-04-25)
- JSON-LD: 1 block, **valid JSON, no parse errors**
- All 4 target schema types confirmed:
  - WebPage ✓ (dateModified=2026-04-23, URL matches canonical)
  - BreadcrumbList ✓ (2 items: Home → Get Agent Ready; position/name/item all present)
  - Service × 2 ✓ (AICV Ready: 2 offers; AICV Reviewed: 4 offers; areaServed on both)
  - FAQPage ✓ (9 Q&A pairs, all acceptedAnswer.text fields populated)
- Note: Service schema is valid schema.org but not a Google Rich Result type; FAQPage and BreadcrumbList are Google Rich Result-eligible

**Homepage AIO regression check** (run 2026-04-25)
- Score: **89 / Grade B** — no regression; improved from 2026-04-23 Grade B baseline
- Pass (6): AI Crawler Access, Structured Data, Content Completeness, Local Signals, Content Freshness, Hallucination Risk
- Warn (1): Entity Clarity only (first 100 words don't define business type in plain English)
- 1 point from Grade A; Entity Clarity warn is the sole gap. Phase 1 commercial/organizational separation working as intended.

**Known debt from Phase 1 verification**
- AIO Grade A not achieved on `/get-agent-ready/` — content additions needed (Organization entity block, proof-of-execution links to MCP server, contact method in page copy). Scope for Phase 2.
- Homepage 1 point from Grade A — single Entity Clarity warn; first-100-words copy fix would likely push to 90+.
- aicv-playbook STATE.md recorded "Grade A" for homepage (anticipatory); actual 2026-04-25 result is 89/Grade B — update playbook in next strategic review.
- **IndexNow key file** `/aicv-indexnow-2026.txt` returns 404 at public root; API accepts submissions (202). Worth confirming whether Bing actually fetches the key or swallows silently.

---

## 2026-04-22 — Tier 4 agent-readiness achieved

- **Cloudflare Pro** upgrade on aicoachellavalley.com zone
- **Markdown for Agents** enabled at CDN edge — agents requesting `Accept: text/markdown` get edge-converted markdown with `Content-Signal: ai-train=yes, search=yes, ai-input=yes` response header
- **aicoachellavalley.com now at Tier 4** of the four-tier agent-readiness framework (see aicv-playbook CLAUDE.md)
- **80 nodes, 133 briefs, 3 snapshots, 1 report** as of 2026-04-23

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

---

## Agent-Readiness Baselines — 2026-04-23

Recorded after Cloudflare Pro + Markdown for Agents +
.well-known discovery deployment (commits 35c1464, 41cc994).

**Cloudflare Agentic Readability** (isitagentready.com):
- Score: 75 / Level 5 "Agent-Native" (highest tier)
- Discoverability: 3/3 ✓
- Content: 1/1 ✓
- Bot Access Control: 2/2 ✓
- API, Auth, MCP & Skill Discovery: 3/6

**AICV AIO Tool** (self-grade of aicoachellavalley.com):
- Grade: B
- Warning: Entity Clarity — homepage conflates AICV's
  organizational mission with AIO Tool product narrative.
  To be addressed via /get-agent-ready page launch (separate
  session), not via homepage rewrite.
- All other checks passing.

## Agent-Readiness Items Intentionally Deferred

- **OAuth/OIDC discovery** (/.well-known/openid-configuration)
  — not applicable. AICV has no protected APIs. All endpoints
  are public-read by design.

- **OAuth Protected Resource Metadata**
  (/.well-known/oauth-protected-resource) — same rationale.

- **WebMCP** (navigator.modelContext.provideContext()) —
  deferred to dedicated session. Worth implementing; mirrors
  existing MCP server tool set for browser-native agents.

- **Phone number in Organization schema contactPoint** —
  deferred pending Twilio routing project.
