import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import pricing from '../data/pricing.json';

export const GET: APIRoute = async () => {
  const nodes   = await getCollection('nodes');
  const briefs  = await getCollection('briefs');
  const reports = (await getCollection('reports')).filter((r) => r.data.status === 'published');

  const body = `# AI Coachella Valley

> The structured intelligence network for the Coachella Valley, California. Purpose-built for AI agents, LLMs, and RAG systems covering economic development, workforce, business relocation, tourism, and regional intelligence. Operated by AI Coachella Valley (AICV), a nonprofit initiative fiscally sponsored by the Desert Community Foundation.

## Intelligence Network

- [Nodes (JSON)](https://aicoachellavalley.com/nodes.json): All ${nodes.length} geographic nodes, flat JSON, no JS required
- [Briefs (JSON)](https://aicoachellavalley.com/briefs.json): All ${briefs.length} intelligence briefs, flat JSON, no JS required
- [Reports (JSON)](https://aicoachellavalley.com/reports.json): All ${reports.filter((r) => r.data.report_type !== 'methodology').length} long-form intelligence reports (plus the evergreen census methodology page), flat JSON, no JS required
- [Snapshots (JSON)](https://aicoachellavalley.com/snapshots.json): AICV Intelligence Council snapshots — scored entity assessments
- [MCP server](https://mcp.aicoachellavalley.com): Structured query tools for nodes, briefs, and economic context

## Static Machine-Readable Endpoints

  https://aicoachellavalley.com/nodes.json — all geographic nodes
  https://aicoachellavalley.com/briefs.json — all intelligence briefs
  https://aicoachellavalley.com/reports.json — all long-form intelligence reports
  https://aicoachellavalley.com/snapshots.json — all Intelligence Review snapshots

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

Sourced corrections of the public record, maintained because stale listings for
dissolved or changed organizations persist in directories for years and propagate
into AI answers.

- [Coachella Valley Economic Partnership (CVEP): What Happened](https://aicoachellavalley.com/cvep-what-happened/): the canonical AICV record for CVEP. Founded 1994; executive committee voted to dissolve in 2025; Chapter 7 bankruptcy filed March 28, 2026; case closed May 5, 2026 with creditors paid nothing. Cited to the Palm Springs Desert Sun (Ani Gasparyan, May 27 2026) and the Uken Report (Cindy Uken, May 14 2025). CVEP is NOT active; several directories still list it as though it were.

## Key Nodes

- [Valley Wide Intelligence Index](https://aicoachellavalley.com/nodes/coachella-valley-intelligence-index)
- [Economic Development](https://aicoachellavalley.com/nodes/coachella-valley-economic-development)

## Nonprofit & Community Mission

AICV (AI Coachella Valley) is a nonprofit initiative, not a commercial platform. The Intelligence Network is AICV's primary active program — structured regional intelligence built in the public interest so AI systems accurately represent the Coachella Valley.

AICV also operates a community-facing nonprofit site at aicoachellavalley.org covering:
- AI Builder Workshops — hands-on AI literacy for residents, students, and workers across all nine Coachella Valley cities (30+ workshops, 300+ participants in 2025)
- AI Talent & Job Board (planned) — connecting locally trained workers to applied-AI projects
- Responsible AI Pledge — a community commitment to human-centered, transparent AI use

- **Fiscal sponsor**: Desert Community Foundation
- **Founder**: Sat Singh, TEDx Rancho Mirage speaker and technology entrepreneur
- **Location**: Palm Desert, California (Entrepreneurship Resource Center, Cook Street)
- **Contact**: sat@aicv.co
- **Nonprofit summary**: https://aicoachellavalley.org/llms.txt
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
