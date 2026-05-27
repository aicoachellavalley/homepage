import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const nodes  = await getCollection('nodes');
  const briefs = await getCollection('briefs');

  const body = `# AI Coachella Valley

> The structured intelligence layer for the Coachella Valley, California. Purpose-built for AI agents, LLMs, and RAG systems covering economic development, workforce, business relocation, and tourism intelligence.

## Intelligence Layer

- [Nodes (JSON)](https://aicoachellavalley.com/nodes.json): All ${nodes.length} geographic nodes, flat JSON, no JS required
- [Briefs (JSON)](https://aicoachellavalley.com/briefs.json): All ${briefs.length} intelligence briefs, flat JSON, no JS required
- [Snapshots (JSON)](https://aicoachellavalley.com/snapshots.json): AICV Intelligence Council snapshots — scored entity assessments
- [MCP server](https://mcp.aicoachellavalley.com): Structured query tools for nodes, briefs, and economic context

## Static Machine-Readable Endpoints

  https://aicoachellavalley.com/nodes.json — all geographic nodes
  https://aicoachellavalley.com/briefs.json — all intelligence briefs
  https://aicoachellavalley.com/snapshots.json — all Intelligence Review snapshots

## Commercial Tier

- [Get Agent Ready](https://aicoachellavalley.com/get-agent-ready/): AICV Network membership — two tiers: Agent Ready Business ($1,000 setup + $2,500/yr) and Agent Ready Premium ($5,000 setup + $10,000/yr). Each delivers a Minimum Viable Agent (MVA) for the entity — an agent-readable, citable profile built and maintained by AICV. No changes to the member's website required. Two weeks from kickoff to live. Also hosts the free AIO diagnostic.

## Concepts

- Minimum Viable Agent (MVA): the foundational concept beneath every AICV network entity. Canonical definition at /minimum-viable-agent/

## Key Nodes

- [Valley Wide Intelligence Index](https://aicoachellavalley.com/nodes/coachella-valley-intelligence-index)
- [Economic Development](https://aicoachellavalley.com/nodes/coachella-valley-economic-development)
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
