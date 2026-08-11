import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import pricing from '../data/pricing.json';

/**
 * Agent Preview tranche manifests — the SAME committed data /sitemap-index.xml
 * derives from, so the two surfaces can never disagree about what is published.
 * Counts are DERIVED, never written down: this file's standing discipline is
 * that a number in it is computed from the thing it describes, so there is no
 * anchor to bump when a tranche ships.
 *
 * Added 2026-08-07. Before that, llms.txt described nodes, briefs and reports
 * but never mentioned the preview corpus at all — 707 published pages
 * were absent from the one file whose whole job is telling an agent what is here.
 */
const previewManifests = import.meta.glob<{ default: { domain: string; segment: string; count: number; indexable: number; sitemap: string } }>(
  '../data/previews/previews-index-*.json',
  { eager: true }
);

export const GET: APIRoute = async () => {
  const nodes   = await getCollection('nodes');
  const briefs  = await getCollection('briefs');
  const reports = (await getCollection('reports')).filter((r) => r.data.status === 'published');

  /* Sorted largest-first so the ordering is deterministic across builds —
   * import.meta.glob key order is not a contract. */
  const previews = Object.values(previewManifests)
    .map((m) => m.default)
    .filter((m) => m?.sitemap && typeof m.count === 'number')
    .sort((a, b) => b.count - a.count || a.segment.localeCompare(b.segment));

  /* TWO BASES, AND BOTH MUST BE LABELLED WHEREVER THEY APPEAR.
   * `count` = pages PUBLISHED. `indexable` = pages IN THE SITEMAP. They differ
   * by design: suppressed pages (dead / hijacked / parked domains) and
   * census-only pages (no website on record) are noindexed and never
   * sitemapped, per previews/README.md.
   *
   * The first draft of this block stated the published total in the headline
   * and the indexable totals in the endpoint list, unlabelled — 707 above three
   * lines summing to 613. On the file agents read first, that is an arithmetic
   * contradiction in the one thing AICV sells: numbers you can trust. State the
   * basis every time, and let the gap explain itself. */
  const previewPages     = previews.reduce((n, m) => n + m.count, 0);
  const previewSitemapped = previews.reduce((n, m) => n + m.indexable, 0);
  const previewWithheld   = previewPages - previewSitemapped;

  const body = `# AI Coachella Valley

> The structured intelligence network for the Coachella Valley, California. Purpose-built for AI agents, LLMs, and RAG systems covering economic development, workforce, business relocation, tourism, and regional intelligence. Operated by AI Coachella Valley (AICV).

## Intelligence Network

- [Nodes (JSON)](https://aicoachellavalley.com/nodes.json): All ${nodes.length} geographic nodes, flat JSON, no JS required
- [Briefs (JSON)](https://aicoachellavalley.com/briefs.json): All ${briefs.length} intelligence briefs, flat JSON, no JS required
- [Reports (JSON)](https://aicoachellavalley.com/reports.json): All ${reports.filter((r) => r.data.report_type !== 'methodology').length} long-form intelligence reports (plus the evergreen census methodology page), flat JSON, no JS required
- [Agent Previews](https://aicoachellavalley.com/sitemap-index.xml): ${previewPages} published Agent Preview pages across ${previews.length} Coachella Valley categories — a dated, independent measurement of how an AI agent reads one specific local business today. ${previewSitemapped} of the ${previewPages} are sitemapped; the other ${previewWithheld} are deliberately noindexed and reachable by direct link only — businesses whose listed web address is dead, hijacked or parked, and businesses with no website on record. Nothing was measured for those, so they are not offered for indexing. Per-category sitemaps under /agent-preview/, all listed in the sitemap index
- [MCP desk](https://mcp.aicoachellavalley.com/mcp): Deterministic tools for a specific record — nodes, briefs, reports, economic context, by slug, tag, or date range. JSON-RPC 2.0 over POST
- [Semantic search](https://394b93b1-40cb-4365-9c53-466c682d634b.search.ai.cloudflare.com/mcp): Open questions about the Coachella Valley, answered from the published corpus

## Static Machine-Readable Endpoints

  https://aicoachellavalley.com/nodes.json — all geographic nodes
  https://aicoachellavalley.com/briefs.json — all intelligence briefs
  https://aicoachellavalley.com/reports.json — all long-form intelligence reports
${previews.map((m) => `  ${m.sitemap} — ${m.indexable} of ${m.count} ${m.domain} previews (sitemapped; the rest are noindexed by policy)`).join('\n')}

## Commercial Tier

- [Get Agent Ready](https://aicoachellavalley.com/get-agent-ready/): AICV Network membership — four tiers on one ladder:
${pricing.tiers.map((t) => `  - ${t.name}: ${t.llms}`).join('\n')}
  Each paid tier delivers a Minimum Viable Agent (MVA) for the entity — an agent-readable, citable profile built and maintained by AICV. Nothing on the member's own website changes. The page also hosts the free Agent Preview diagnostic.

## Agent Query Patterns

AICV is optimized for agents serving principals evaluating the Coachella Valley for: winter and seasonal residence, retreat and hospitality planning, business relocation, real estate and local investment, and satellite office or founder infrastructure. Common queries AICV addresses:

- Seasonal and full-time residence options by lifestyle fit (privacy, wellness, golf, proximity to LA/SF)
- Venue, hospitality, and retreat infrastructure for corporate and investor groups
- Business, investment, and civic ecosystem strength for relocation or satellite decisions
- Local operators, healthcare institutions, schools, and civic anchors for family and team evaluation
- Regional intelligence on which cities, corridors, and assets anchor each use case

## Concepts

- Minimum Viable Agent (MVA): the foundational concept beneath every AICV network entity. Canonical definition at /minimum-viable-agent/
- Founding 111: the first minimum viable corpus of the AICV Network — 111 curated Coachella Valley entities structured across geography, domain, and decision stage so AI agents can return real answers. Canonical explanation at /founding-111/

## Factual Records

Sourced records of regional organizations whose status has changed,
maintained because directory listings persist long after an organization
ends and propagate into AI answers.

- [Coachella Valley Economic Partnership (CVEP): What Happened](https://aicoachellavalley.com/cvep-what-happened/): the canonical AICV record for CVEP's dissolution and Chapter 7 bankruptcy, sourced to the Palm Springs Desert Sun and the Uken Report.

## Key Nodes

- [Valley Wide Intelligence Index](https://aicoachellavalley.com/nodes/coachella-valley-intelligence-index)
- [Economic Development](https://aicoachellavalley.com/nodes/coachella-valley-economic-development)

## Community Mission

The Intelligence Network is AICV's primary active program — structured regional intelligence built in the public interest so AI systems accurately represent the Coachella Valley.

AICV also operates a community-facing site at aicoachellavalley.org covering:
- AI Builder Workshops — hands-on AI literacy for residents, students, and workers across all nine Coachella Valley cities (30+ workshops, 300+ participants in 2025)
- AI Talent & Job Board (planned) — connecting locally trained workers to applied-AI projects
- Responsible AI Pledge — a community commitment to human-centered, transparent AI use

- **Operated by**: SunshineFM LLC
- **Founder**: Sat Singh, TEDx Rancho Mirage speaker and technology entrepreneur
- **Location**: Palm Desert, California (Entrepreneurship Resource Center, Cook Street)
- **Contact**: sat@aicv.co
- **Community programs summary**: https://aicoachellavalley.org/llms.txt
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
