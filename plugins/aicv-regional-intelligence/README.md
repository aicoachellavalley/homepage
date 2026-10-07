# AICV Regional Intelligence plugin

This portable Agent Plugins package declares the read-only connector at `https://aicoachellavalley.com/mcp`. The original connector was published with PR #1. Version 0.2.0 adds retreat comparison inputs and evidence; those changes remain on the review branch until Sat approves a production merge. The package is not evidence of directory approval or organic discovery.

Build a ZIP with `node scripts/package-agent-plugin.mjs`. To test a deployment before production, use `node scripts/package-agent-plugin.mjs --endpoint https://YOUR-PREVIEW.pages.dev/mcp --output /tmp/aicv-preview-plugin.zip`. Endpoint overrides affect only the generated archive; production source stays unchanged. The normal build generates `/aicv-regional-intelligence-plugin.zip` for review download and publishes the source metadata at `/agent-plugin/`.

Connect the deployed endpoint in the assistant account, then run all five positive and three negative cases in `plugin.json`. These are expected reviewer outcomes, not claims that a provider-level test has already passed. A successful MCP client test verifies transport and retrieval; it does not prove assistant installation, citations or customer demand.

Refresh an existing personal connector's tool metadata after switching to the tested preview endpoint, or import a new preview ZIP. The expanded `resolve_local_intent` schema is advertised through MCP `tools/list`. An existing connector pinned to the September 30 preview continues using that older deployment until its endpoint is updated. Keep production metadata pointed at the permanent endpoint; use the ZIP override for review. All reviewer cases are synthetic.

Retreat results draw from qualified evidence records rather than treating every business preview as suitable. Published facts, observations, planning judgments and unknowns are distinguished. Follow-ups change the comparison using group size, room needs, sharing, purpose, duration, privacy, accessibility and city constraints. Named room/layout capacity is separate from overnight or event occupancy. Budgets prompt scoped quote questions; the connector does not infer rates from a venue's positioning. Supporting providers remain separate inquiries, not an assembled bookable package.

For OpenAI directory submission, upload the ZIP, verify the publisher identity and endpoint domain, pass the metadata/tool scans, add an accessible demonstration recording, and submit the tested package for review. The portal supplies the exact domain token. Do not commit credentials, invent a registered plugin ID or publish before approval. Confirm current portal category and identity fields before submitting.

Grok supports a custom connector using the public MCP URL. Muse documents custom connectors created with its guidance, but its public help page does not establish that this MCP endpoint can be installed unchanged. A Muse partner application is separate from a working custom connection. Verify either route in the actual account.

Official references checked September 30, 2026:

- [OpenAI package format](https://developers.openai.com/plugins/build/plugins)
- [OpenAI upload, review and publication](https://developers.openai.com/plugins/deploy/submission)
- [Grok custom connectors](https://docs.x.ai/grok/connectors)
- [Muse connectors](https://www.meta.com/help/artificial-intelligence/1687253048996149/)
