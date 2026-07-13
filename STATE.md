# com/ operational state

> Operational state only. Strategic state lives in `aicv-playbook/STATE.md`.

## 2026-07-13 — OpenAI ChatGPT Work / GPT-5.6 agent-race brief filed + published

Brief `2026-07-13-openai-chatgpt-work-gpt-5-6-agent-race` filed, pushed (commit `bc93678`), and edge-verified **agent-visible** ~60s after push: HTML (`/briefs/2026-07-13-openai-chatgpt-work-gpt-5-6-agent-race/`, HTTP 200), `briefs.json` (now 170 briefs), and `llms-full.txt`. CF auto-deploy regenerated the gitignored data artifacts in-cloud via `build-static-json.cjs` — push of the `.mdx` alone published every surface and fired IndexNow; no `content(data)` commit exists.

- **Two Related Nodes, both live-verified before build:** `workforce-talent`, `civic-infrastructure`. A visitor-economy/agent-readiness node was checked per the deck's instruction and **does not exist** in the 81-node corpus — dropped, not invented.
- **Filing-date discipline held:** `date: 2026-07-13` (filing date, from `date +%Y-%m-%d`) drives `datePublished` in the NewsArticle schema; the July 9, 2026 ChatGPT Work / GPT-5.6 release date lives in the Signal prose.
- **MDX dollar rule applied:** body pricing (`\$5/\$30` etc.) escaped per briefs/CLAUDE.md; live page render verified clean (no backslash leak).
- **Journal 📡 line deferred** to a sunshine-fm session (same posture as the 2026-06-30 entry) — not added this run.

---

## 2026-07-08 — California adopts Claude brief filed + published

Brief `2026-07-08-california-adopts-claude-state-local-government` filed, pushed (commit `991db84`), and edge-verified **agent-visible** ~60s after push: HTML (`/briefs/2026-07-08-california-adopts-claude-state-local-government/`, HTTP 200), `briefs.json` (now 169 briefs), and `llms-full.txt`. CF auto-deploy regenerated the gitignored data artifacts in-cloud via `build-static-json.cjs` — push of the `.mdx` alone published every surface and fired IndexNow; no `content(data)` commit exists.

- **Three Related Nodes, all live-verified before build:** `riverside-county-economic-development`, `civic-infrastructure`, `workforce-talent`.
- **Filing-date discipline:** `date: 2026-07-08` (today's filing date) drives `datePublished`/`dateModified` in the NewsArticle schema; the June 29, 2026 announcement date lives in the Signal prose, not the schema — a citable source states its true publication date, not the event date.
- **Journal 📡 line reconciled, not deferred:** the sunshine-fm `📡` line was added (commit `20e3f62`, wrangler-deployed) and **closed the +1 brief-counter drift** flagged in the 2026-06-30 entry — actual `📡` lines 168→169 now equal the `169 briefs` span; the counter was left untouched, not bumped.

---

## 2026-07-05 — Cross-thread tangle RESOLVED (reconciled + shipped)

The weekend's parallel-thread stack on com main is cleared: **origin/main = `949993f`, production matches canon.** The Q2 report (`a25e497`) and the nav cleanup (`d17de7a`) were pushed and are live; the git↔production divergence is healed. The AIQnA `llms.txt.ts` WIP remains parked in `stash@{0}` for its own thread — **untouched; do not `stash drop`/`pop`.** *(Retires the earlier "⚠️ PUSH BLOCKED" note — it did its job over the weekend and is no longer true.)*

**Root cause fixed:** the divergence traced to a canon contradiction — `ARCHITECTURE.md` said com deploys via git push while `CLAUDE.md` node-step-12 (and com/CLAUDE.md Key-commands) told sessions to `wrangler pages deploy` com. Reconciled 2026-07-05: com deploys **only** via git push; the wrangler-deploy-com instruction was removed. Deploy discipline now lives, un-contradicted, in ARCHITECTURE.md → Deployment notes.

## 2026-06-30 — Homepage stats bar made status-aware (commit `bf0bd3e`)

`scripts/generate-stats.mjs` (the `prebuild` step that writes `stats.json`, which the homepage bar reads at build time) now counts by frontmatter status — `nodes` = `status: live`, `reports` = `status: published` — instead of raw `.mdx` file count. `briefs`/`snapshots` have no status field and stay raw counts. Output is identical today (81/163/8/3 — zero drafts/non-live), so this is a drift guard, not a number change: a future `draft` report or `planned`/`under construction` node can no longer silently inflate the bar above what its "Published" / "Regional Nodes" labels claim. Confirm the bar anytime with `curl -s https://aicoachellavalley.com/stats.json` — check the counts and `generated_at` (should be ≥ the last content deploy).

---

## 2026-06-30 — Social cards shipped to Base layout; two items parked (hw-card non-bug, detail-page cards)

**Shipped — `feat(seo): og:image + twitter cards in Base.astro` (commit `81558bc`).** Base-using pages (homepage, get-agent-ready, minimum-viable-agent, founding-111, 404, and the index/listing pages) emitted no social card unless they passed `ogImage` — only the homepage did, so most pages shared as naked links. Base now sets a default `ogImage`, expands it to an absolute URL via `new URL(ogImage, Astro.site)` (no hardcoded domain — uses the `site` config), and always emits `og:image` + `og:type` / `og:site_name` / `og:image:alt` + the `twitter:*` card block. Backward-compatible: an absolute `ogImage` (the homepage's) passes through `new URL()` unchanged. High-effort `/code-review`: no blockers; low findings folded into the follow-up below.

**Parked — Fix 1 was a non-bug (closed, nothing shipped).** The long-parked "320px `.gar-v2-hw-card` ~29px horizontal overflow" is a **preview-emulator artifact, not a real layout bug.** At the 320 emulation, `innerWidth`/`docScrollWidth` report 349 while the real viewport (`clientWidth`/`visualViewport`) is 320, content fits, and the page **cannot scroll horizontally** (`scrollX` locked at 0); toggling every clip (body/section/scroller) changed docScrollWidth not at all; at 360 everything is clean (`innerWidth==clientWidth==scrollWidth`). An `overflow-x: clip` one-liner was tried, confirmed to change nothing, and **reverted** — tree clean, no commit. Close this item.

**Follow-up — the real social-card work (high-leverage SEO, not housekeeping).** Content detail pages — `briefs/[slug]`, `nodes/[slug]`, `reports/[slug]`, `aiqna/index`, `aiqna/[slug]`, `snapshots/[slug]` — each roll their own `<head>` and emit **zero** `og:image`/`twitter:*`. These are the per-item citation pages: the most-shared URLs and the core of the agent-native intelligence layer. The Base.astro commit covered only the landing/index subset; this is the set that actually gets shared. Right fix is a **shared head partial (one source of truth)**, not the tag block repeated six times. Design notes for when picked up: (a) the partial needs an `ogType` prop defaulting to `website`, with detail pages passing `article` — preserves the `og:type: article` they already set; this is the prop-default shape the phantom og:type conflict implied (conflict wasn't real, design is); (b) add an `ogImageAlt` prop — alt should describe the image, not the page (Base currently sets `alt={title}`, which mismatches the fixed default image); (c) make the default robust to empty-string `ogImage` (`new URL(ogImage || '/…png', Astro.site)` — `''` currently resolves to the site root, not an image).

**Parked — `index.astro` hardcodes the full domain (latent one-source-of-truth violation).** `index.astro` writes the full domain longhand in its `ogImage`/`canonicalUrl` instead of letting the build expand a relative path against the `site` config. If the site ever moves, that string gets forgotten. Fix by passing a relative path or dropping the prop. Independent of the social-card partial above — don't let it get swallowed when that work is cleared.

---

## 2026-06-30 — Shops at Palm Desert redevelopment brief filed + published

Brief `2026-06-30-shops-palm-desert-redevelopment-status` filed, pushed (commit `79f0100`), and edge-verified **agent-visible on all three surfaces** ~40s after push: HTML (`/briefs/2026-06-30-shops-palm-desert-redevelopment-status/`), `briefs.json` (now 163 briefs), and `llms-full.txt`. CF auto-deploy regenerated the gitignored data artifacts in-cloud via `build-static-json.cjs` — push of the `.mdx` alone published every surface; no `content(data)` commit exists.

- **Two Related Nodes, both live-verified before build:** `north-palm-desert-development-zone`, `palm-desert-economic-development`.
- **Provenance:** derived from an LLM Council run, but the council's search **missed the city's Sears-parcel Surplus Land Act notice** — the brief's most material unresolved fact. Brief was rebuilt from verified City of Palm Desert / trade-press sources rather than council output; verified-facts standard held over council convenience.
- **Journal 📡 line deferred** to a dedicated sunshine-fm session: `refresh_journal.py` hardcodes a stale `/Users/macmini/Projects/com/dist/briefs` path (wrong machine + pre-`~/AICV` layout), and the journal brief counter reads 163 vs 162 actual 📡 lines — needs deliberate reconciliation, not a blind bump.

---

## 2026-06-11 — Dining report shipped + agent-discovery recon (two gaps logged)

Report `agent-mapped-food-dining-coachella-valley` is published and wired into every in-repo agent-discovery surface (commit `63c454d`). Recon across all surfaces:

- **Inherited automatically (no per-report work needed):** `/reports/` index, `sitemap.xml`, `reports.json` (+ `.well-known/api-catalog`, IndexNow), `llms-full.txt` — all dynamic via `getCollection('reports')` / `build-static-json.cjs` since the 2026-06-05 work. JSON-LD is a shared layout (`reports/[slug].astro`) emitting `@type: ['Article','Report']` + the full field set — verified byte-identical to the visitor-economy report.
- **Fixed this session:** the curated `/llms.txt` summary now advertises `reports.json` in both its Intelligence Network and Static Machine-Readable Endpoints lists (it previously omitted the entire reports collection — a 06-05 oversight; `api-catalog` already carried it).

Two gaps surfaced by the recon, logged here as **prioritized future work — neither built this session:**

**GAP 1 — ✅ CLOSED 2026-06-11 — MCP report retrieval shipped.**
- The `mcp.aicoachellavalley.com` worker (**repo: `aicv-mcp`, OUT OF THIS REPO**) exposes tools `query_venues`, `get_node`, `get_regional_brief`, `get_economic_context`, `route_query`. No report tool or resource.
- **Why it matters:** agents querying the canonical MCP "desk" cannot retrieve AICV's long-form reports — directly contradicts the agent-to-agent north star. Humans can read reports on the web; agents through the desk cannot.
- **✅ Closed 2026-06-11 (same day logged):** built and deployed in `aicv-mcp` — commits `ce42b68`→`4eca8ed`. The desk now serves **6 tools** incl. `get_report` (browse/filter + full-body modes); `route_query` routes report-shaped intent to it; `scripts/smoke-test.mjs` covers it. `get_report` reads `reports.json` via the same fetch pattern as nodes/briefs. Verified disk + live (`tools/list`) June 11 — **zero drift**. The open questions resolved as: ONE tool (`get_report`), slug-presence selecting browse vs. full-body (not two tools); the data surface was already ready — only the MCP tool layer was missing.

**GAP 2 — CORPUS ENRICHMENT — LOWER PRIORITY — no node↔report cross-links.**
- No node links to any report and no report links to any node, anywhere in the corpus (category-wide, affects all 4 reports). Agent graph traversal cannot move between entity nodes and the reports about their category.
- **Next step (own session, NOT here):** establish a node↔report cross-link pattern (e.g. food nodes `el-paseo` / `gardens-on-el-paseo` ↔ the dining report) and apply corpus-wide. No existing pattern to replicate → it is a net-new convention, so design it deliberately before applying.

---

## 2026-06-11 — Food & Dining census report + three standing report conventions

- **New report published:** `src/content/reports/agent-mapped-food-dining-coachella-valley.mdx`
  - `report_type: "agent-readiness"`, `period: "Q2 2026"`, label-style `sections` identifiers (continues the 2026-06-05 convention below).
  - Second entry in the recurring agent-readiness series; first to map a single category end to end (ground-up establishment census of 1,423 + an agent-visibility sample of 377 independents).

- **THREE STANDING CONVENTIONS for every AICV category report** (apply to reports #3–#13 and beyond — the dining report is the worked example, so report #2 onward inherit these instead of re-deriving them on review):

  1. **House voice — mark interpretation, state data plainly.** Interpretive / strategic claims are prefixed `According to AICV, …`; measured data is stated without the prefix. The construction deliberately separates AICV's interpretation from the numbers it measured. Lead each `### What This Means for the Coachella Valley` subsection with it, and attach it to standalone strategic claims (e.g. the closing thesis); do NOT attach it to pure data statements — overuse defeats the marker. (Matches the visitor-economy report's usage.)

  2. **Every report closes with three elements, in order, before the italic publisher footer:** (a) **free-diagnostic CTA** pointing to `/get-agent-ready/` — "free, immediate, no AICV engagement required"; (b) **recurring-series framing** — which entry this is, which verticals come next, and the baseline this report puts on the record; (c) the **institutional publisher/footer block** — org-published declaration + methodology transparency hook + .com/.org surface clarification + Desert Community Foundation fiscal-sponsor mention + "nodes, briefs, and reports are available at aicoachellavalley.com" callout (the institutional closing pattern from the 2026-06-05 entry).

  3. **Cross-report number hygiene.** When a new report's figures touch a category a prior report already covered, reconcile the numbers explicitly (2–3 sentences, cite the prior report by name) rather than letting two figures stand unexplained and read as a contradiction. Worked example: the dining report reconciles its ground-up census (1,423 establishments / 924 independents) against the visitor-economy report's directory-sourced scored subset (Dining = 956, mean 3.01, 5.5% Tier A) — the difference is scope/method, not a conflict or correction.

- **Pointer:** a terse author checklist of these three (plus the frontmatter + editorial-link conventions) lives at `src/content/reports/README.md`; this STATE.md entry is canonical. The README is `.md`, so the reports glob loader (`**/*.mdx`) ignores it as a content entry.

---

## 2026-06-05 — Q2 2026 agent-readiness report + editorial link convention + sitemap fix

- **New report published:** `src/content/reports/state-cv-visitor-economy-agent-readiness-q2-2026.mdx`
  - `report_type: "agent-readiness"`, `period: "Q2 2026"`
  - First entry in a recurring agent-readiness report series. Subsequent reports will follow the same `report_type` for category continuity.
  - Section identifiers are label-style (matches `data-centers-ai-infrastructure-coachella-valley` precedent, not the slug-style used by `state-of-ai-q1-2026`).

- **Sitemap fix:** `src/pages/sitemap.xml.ts` now includes a reports loop parallel to the existing nodes/briefs loops, and the `staticPages` array now includes `/reports/`, `/get-agent-ready/`, and `/minimum-viable-agent/`. The reports loop filters on `status === 'published'` to match the index page and `[slug].astro` behavior. Three pre-existing static pages were missing from the sitemap; this is a back-fix.

- **Editorial link convention (new, applies to all future reports and the visitor-economy landing page):**
  - First mention: `[AICV (AI Coachella Valley)](https://aicoachellavalley.com)` — expand and link in body prose on first use; bylines stay plain.
  - `aicoachellavalley.com` — link on first body mention and in the closing italicized note.
  - `aicoachellavalley.org` — link on first body mention.
  - `Desert Community Foundation` — link to `https://desertcommunityfoundation.org` on first mention; repeat in closing note if relevant.
  - Internal program/framework names — link to canonical page on first mention: `[Get Agent Ready program](/get-agent-ready/)`, `[Minimum Viable Agent framework](/minimum-viable-agent/)`.
  - Prior reports — link to canonical URL on first mention: `[State of AI — Q1 2026](/reports/state-of-ai-q1-2026/)`, `[The Server Farm Next Door](/reports/data-centers-ai-infrastructure-coachella-valley/)`.
  - Standard markdown link syntax. No special MDX components.
  - **This convention departs from earlier reports** (state-of-ai and data-centers use plain-text mentions for AICV and aicoachellavalley.com in the body). The new convention is more agent-readable and more navigable; it becomes the going-forward standard. Earlier reports are not back-fixed.

- **Closing italicized note — institutional pattern.** Reports authored under AICV's institutional voice use the institutional closing pattern: organization-published declaration + methodology transparency hook + .com/.org surface clarification + DCF fiscal-sponsor mention + "nodes, briefs, and reports are available at aicoachellavalley.com" callout. The data-centers report's bylined closing remains valid for personal-voice essays from Sat Singh; institutional reports use the institutional pattern.

---

## 2026-05-02 — Background color swap: sand → paper (#FAFAF7)

- **Commit:** `690dc4a` — style: swap sand background to paper (#FAFAF7) across five files
- `--sand` #E8E2D0 → #FAFAF7 (body background)
- `--sand-light` #F2EDE0 → #FFFFFF (elevated surfaces)
- `--sand-dark` #D4CCBA → #E8E5DD (borders/dividers)
- Variable names (`--sand`, `--sand-light`, `--sand-dark`) unchanged — Option B, rename deferred
- **Files touched (5):** `src/styles/tokens.css`, `src/pages/briefs/[slug].astro`, `src/pages/nodes/[slug].astro`, `src/pages/reports/[slug].astro`, `src/pages/snapshots/[slug].astro`
- **Intentionally untouched:** Grade color maps in `snapshots/[slug].astro` lines 57–110 (`gradeBg`, `gradeBorder`, `gradeLightBg`, `findingHeaderBorderColor`) — these use old sand hex values as semantic indicators for D/F grade tiers, not background colors. **Dead code post-postcard migration — delete in cleanup pass after postcards ship.**

---

## 2026-04-27 — Column 2 & 3 headline and description update

- **Commit:** `f6b549c` — feat(homepage): update column 2 and 3 headlines and descriptions to ladder into new CTAs
- Col 2: "Track What AI Sees About the Valley" / "Daily intelligence on how AI systems read and cite the valley." → Read the Briefs →
- Col 3: "Explore the Valley's Regional Map" / "A growing map of regional nodes…" → Explore the Nodes →; no hardcoded counts

---

## 2026-04-27 — Focal block + CTA update

- **Commit:** `6468bfc` — feat(homepage): combine stats + blueprint into focal block; update CTAs
- Stats, "Updated" date (repositioned above stats), and blueprint image merged into single `<section class="focal-block">`; CTAs updated: "Join the Network →" (/get-agent-ready/#diagnostic), "Read the Briefs →" (/briefs/), "Explore the Nodes →" (/nodes/); column 2/3 headlines held pending copy approval

---

## 2026-04-27 — TOS modal generalized to AICV Terms of Use

- **Commit:** `a3e0bc4` — chore(homepage): generalize TOS modal to AICV Terms of Use (was AIO Tool — Terms of Use)
- Title, date, No Legal Recourse, and Changes section generalized; five tool-specific clauses flagged for Sat's legal review (not changed): intro paragraph, "No Account..." data handling, "How It Works" pipeline, "For Informational..." body, "Acceptable Use" URL submission sentences
- CLAUDE.md (`aicv-playbook`, commit `8969fa2`) updated with TOS modal scope clarification rule

---

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
- **81 nodes, 147 briefs, 3 snapshots, 2 reports** as of 2026-05-21

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
