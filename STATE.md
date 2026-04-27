# com/ operational state

> Operational state only. Strategic state lives in `aicv-playbook/STATE.md`.

## 2026-04-27 — Homepage AIO Tool section removed; image-CTA bridge

- **Commit:** `472a47c` — refactor(homepage): replace AIO Tool section with image-CTA bridge to /get-agent-ready/
- AIO Tool embed fully removed from homepage (`id="aio"`, input, results, loading, error divs, submit button)
- Replaced with `.img-cta-section`: `<a href="/get-agent-ready/">` wrapping `<img src="/gar-banner.svg">` (placeholder — drop file in `public/` to activate)
- Nav button updated: "Free AIO Tool ↓" `#aio` → "Get Agent Ready →" `/get-agent-ready/#diagnostic`
- Footer "AIO Tool" link updated: `#aio` → `/get-agent-ready/#diagnostic`
- **Canonical AIO Tool instance:** `/get-agent-ready/#diagnostic` only
- **Orphaned JS retained** (not removed — separate decision needed): `WORKER_BASE`, `resetTool`, `showErr`, `gradeFromScore`, `runAnalysis`, `copyReport` — all in `<script is:inline>` block
- **TOS modal retained** (not removed — separate decision needed): `id="tosModal"`, triggered by footer "Terms of Use" link; title still reads "AIO Tool — Terms of Use"
- Build: 248 pages, no errors, 4.35s

### Follow-up — `6759def` — blueprint asset wired
- `public/learn-to-get-agent-ready-blueprint.png` added (2172×724px, 1.1 MB, Retina-safe); placeholder `/gar-banner.svg` replaced; `width`/`height` attributes added for CLS prevention
- `src/learn-to-get-agent-ready-blueprint.png` intentionally NOT committed (working copy, no Astro role)
- `public/learn-to-get-agent-ready-blueprint.webp` added (71 KB, ~94% smaller); `<picture>` element wraps `<img>` with WebP preferred source and PNG fallback

---

## 2026-04-27 — /get-agent-ready FAQ 10th entry (agent-payment)

- **Commit:** `7944eec` — feat(get-agent-ready): add agent-payment FAQ entry (Reviewed-tier roadmap commitment)
- FAQ now has 10 entries (schema and HTML in sync); new entry covers x402, ACP, agent-payable MCP endpoints as a Reviewed-tier future commitment for hospitality/dining/wellness/retail

---

## 2026-04-27 — Homepage Get Included CTA fix

- **Commit:** `1126352` — fix(homepage): repoint Get Included CTA to V7.7 diagnostic anchor
- `#aio` → `/get-agent-ready/#diagnostic` (one-line change, `src/pages/index.astro` line 363)
- Submit a Brief `mailto:sat@aicv.co` unchanged — mailto is correct, AIO Tool inability to verify mailto is a known tool limitation (codified in aicv-playbook CLAUDE.md)
- Homepage MED-tier nav finding from 2026-04-27 AIO scan addressed; will confirm at next routine homepage scan (no dedicated re-verification scheduled)

---

## 2026-04-27 — /get-agent-ready Phase 2 schema additions

- **Commit:** `2ccc65a` — feat(get-agent-ready): Phase 2 schema additions (Organization, LocalBusiness, ContactPoint)
- **Deploy:** Cloudflare Pages auto-deploy on push to main
- **Scope:** schema-only — no visible copy changes, no AIO widget changes, no TOS modal changes
- **@graph now contains 7 entries:** WebPage, BreadcrumbList, Service (AICV Ready), Service (AICV Reviewed), FAQPage, Organization, LocalBusiness
- **Organization schema:** @id `#organization`, founder Sat Singh, parentOrganization Desert Community Foundation (fiscal sponsor), contactPoint (email-only, general inquiries, English), sameAs mirrored from homepage (`x.com/CoachellaAI`, `github.com/aicoachellavalley`, `sunshinefm.beehiiv.com`), logo `logo.png`, foundingDate 2025-01-19
- **LocalBusiness schema:** @id `#localbusiness`, verified address 37023 Cook Street Palm Desert CA 92211, parentOrganization @id reference, email sat@aicv.co — addresses Local Signals warn from 2026-04-27 AIO analysis
- **Service ×2 provider:** simplified to `{ "@id": "https://aicoachellavalley.com/#organization" }` @id-only reference — no duplication of Organization properties
- **dateModified:** 2026-04-26 → 2026-04-27
- **No phone field added:** AICV operates email-only; phone was AIO LOW-tier generic suggestion, not a content gap
- **Build check:** 248 pages, no errors, 4.00s

### Deferred verifications — 2026-04-28

- **AIO Tool grade on `/get-agent-ready/`** — Phase 2 directly addresses both MED-tier Top Fixes from 2026-04-27 analysis (Organization entity block, LocalBusiness with street address). Target: Grade A (90+). Note: rate-limit budget consumed on 2026-04-27; do not run today.
- **Google Rich Results revalidation** — confirm all 7 schema types parse cleanly; verify LocalBusiness and Organization render correctly; confirm no regression on WebPage, BreadcrumbList, Service×2, FAQPage. Note: LocalBusiness and Organization are not Google Rich Result types (no visual enhancement), but must validate without errors.
- **Cloudflare scan:** not needed — schema additions do not affect API/Auth/MCP/Skill Discovery category; infrastructure score unchanged.

---

## 2026-04-27 — /get-agent-ready V7.7 copy replacement

- **Commit:** `1e85313` — feat(get-agent-ready): V7.7 final copy — proof strip, streamlined sections, agentic-internet thesis
- **Deploy:** Cloudflare Pages auto-deploy on push to main; live at `https://aicoachellavalley.com/get-agent-ready/`
- **Scope:** full visible-content replacement; schema, AIO widget, TOS modal, JS preserved exactly
- **dateModified:** updated to 2026-04-26
- **Dynamic proof strip:** `{nodeCount}+` / `{briefCount}+` imported from `public/nodes.json` and `public/briefs.json` at build time (80 nodes, 136 briefs as of this build)
- **Sections added:** Proof Strip (new), Why This Matters Now, Why Networks Win (network statements two-up), Members Only (25-min session), About AICV (with address — Local Signals improvement), Final Close (dual CTAs)
- **Sections removed:** Section 6 Deployment (7-step sequence), Section 9 Booking (standalone calendar section)
- **New CSS:** `.gar-proof-strip`, `.gar-light-list`, `.gar-dark-list`, `.gar-network-statements`, `.gar-about-wrap`, `.gar-close-ctas`, `.gar-hero-note`
- **Build check:** 248 pages, no errors, 4.33s

### Deferred verifications — schedule 2026-04-28

- **AIO Tool grade on `/get-agent-ready/`** — V7.7 adds address (Local Signals fix) and About AICV entity block. Run after deploy propagation (~24h). Target: clear Local Signals warn from Phase 1, assess Entity Clarity and Content Completeness improvements.
- **Google Rich Results** — confirm dateModified=2026-04-26 reflected, all 4 schema types still valid after description update.
- **Homepage regression check** — confirm unchanged (200 OK, stat blocks present, no CSS bleed from gar-* additions).

---

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

### AIO Tool Truncation Bug — Found and Fixed (2026-04-25)

**Bug:** `worker.js` was silently capping cleaned page content at `6000` chars before sending to Haiku. Long-form pages (pitch pages, FAQ pages, multi-section sales pages) were being evaluated with a fraction of their content, producing suppressed scores and false warns.

**Root cause:** `fetchPageContent` line 143 — `.slice(0, 6000)`. The `/get-agent-ready/` page produces 14,669 chars of cleaned text; worker was sending 6,000 (41%). Truncation point was mid-sentence: "Deployment is a sequence, not an event. Every s[top]." JSON-LD schema was unaffected — it arrives via a separate regex extraction path.

**Fix deployed:** `aicv-api` commit, deployed 2026-04-25.
- Content cap raised from 6,000 to 12,000 chars
- Word-boundary slice: `cleaned.lastIndexOf(' ', 12000)` to avoid mid-word cuts
- Truncation marker appended when truncation occurs: `[Note: page content truncated at ~12000 chars; full page is N chars]` — Haiku can adjust confidence accordingly

**Re-scored after fix (2026-04-25):**

| Page | Pre-fix | Post-fix | Check delta |
|---|---|---|---|
| `/get-agent-ready/` | 82 / Grade B, 3 warns | **78 / Grade C, 1 warn** | Entity Clarity ✓, Content Completeness ✓, Hallucination Risk ✓ resolved; Local Signals newly warned |
| `/` (homepage) | 89 / Grade B, 1 warn | **86 / Grade B, 0 warns** | Entity Clarity warn resolved; all 7 checks now pass |

**Interpretation of results:**
- `/get-agent-ready/` page score (78 vs 82): check quality improved (3 → 1 warn) but raw score dipped due to Haiku model variance and a more accurate Local Signals warn (missing LocalBusiness schema with street address — previously masked by truncation). The 78 is a more honest assessment.
- The new Local Signals warn is legitimate: the page references "Rancho Mirage, California" in footer text only, not in LocalBusiness structured data. Scope for Phase 2.
- Grade A target still requires: LocalBusiness schema + Organization entity block + contact detail in structured data (as flagged in fixes). All are content additions.
- Homepage: 7/7 checks now pass. Score variance (89→86) is expected Haiku run-to-run variation; all warns cleared is the signal.
- **Prior AIO grades on long pages may have been suppressed** — any page with >6000 chars of cleaned text received artificially low scores before this fix.

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
