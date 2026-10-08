# AICV Regional Intelligence plugin

This portable Agent Plugins package declares the read-only connector at `https://aicoachellavalley.com/mcp`. The original connector was published with PR #1. Version 0.3.0 adds workspace, satellite-base and founder-support evidence alongside retreat comparison; the new capabilities remain on the review branch until Sat approves a production merge. The package is not evidence of directory approval or organic discovery.

Build a ZIP with `node scripts/package-agent-plugin.mjs`. To test a deployment before production, use `node scripts/package-agent-plugin.mjs --endpoint https://YOUR-PREVIEW.pages.dev/mcp --output /tmp/aicv-preview-plugin.zip`. Endpoint overrides affect only the generated archive; production source stays unchanged. The normal build generates `/aicv-regional-intelligence-plugin.zip` for review download and publishes the source metadata at `/agent-plugin/`.

Connect the deployed endpoint in the assistant account, then run all five positive and three negative cases in `plugin.json`. These are expected reviewer outcomes, not claims that a provider-level test has already passed. A successful MCP client test verifies transport and retrieval; it does not prove assistant installation, citations or customer demand.

Refresh an existing personal connector's tool metadata after switching to the tested preview endpoint, or import a new preview ZIP. The expanded read-only `resolve_local_intent` schema is advertised through MCP `tools/list`. An existing connector pinned to the September 30 preview continues using that older deployment until its endpoint is updated. Keep production metadata pointed at the permanent endpoint; use the ZIP override for review. All reviewer cases are synthetic.

Retreat results draw from qualified evidence records rather than treating every business preview as suitable. Published facts, observations, planning judgments and unknowns are distinguished. Follow-ups change the comparison using group size, room needs, sharing, purpose, duration, privacy, accessibility and city constraints. Named room/layout capacity is separate from overnight or event occupancy. Budgets prompt scoped quote questions; the connector does not infer rates from a venue's positioning. Supporting providers remain separate inquiries, not an assembled bookable package.

Workspace and founder decisions preserve workspace access/duration, working setup, budget amount and scope, requested/excluded entities and required action. `/choose-workspace/` exposes the evidence in an ordinary readable page. Official booking, quote, tour, membership and application destinations are handoffs; current availability and suitability still require operator confirmation. The separate `/action-pilot/` is a synthetic mock and adds no transactional MCP capability.

OpenAI documentation checked October 7 distinguishes personal installation, private workspace sharing and local/repo distribution from the reviewed universal public directory shared by ChatGPT and Codex. A personal installation does not make this plugin discoverable to everyone.

Public submission preparation: use a verified publisher, verify the MCP hostname with the portal-provided plain-text challenge, scan tools, execute five positive/three negative reviewer cases, and provide an accessible demonstration recording. Draft review materials are in `research/discovery-2026-10-07.md`. Package validation is not final submission approval. Publisher verification, actual account tests, recording, portal scans, submission and publication remain uncompleted. Do not upload, submit or publish without Sat’s approval. Private workspace sharing also needs an authorized administrator and explicit approval.

Grok supports a custom connector using the public MCP URL. Muse documents custom connectors created with its guidance, but its public help page does not establish that this MCP endpoint can be installed unchanged. A Muse partner application is separate from a working custom connection. Verify either route in the actual account.

OpenAI references checked October 7, 2026; Grok/Muse references retain their September 30 check:

- [OpenAI package format](https://developers.openai.com/plugins/build/plugins)
- [OpenAI upload, review and publication](https://developers.openai.com/plugins/deploy/submission)
- [Grok custom connectors](https://docs.x.ai/grok/connectors)
- [Muse connectors](https://www.meta.com/help/artificial-intelligence/1687253048996149/)
