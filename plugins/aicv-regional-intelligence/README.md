# AICV Regional Intelligence plugin

This portable Agent Plugins package declares the read-only connector at `https://aicoachellavalley.com/mcp`. It is a review package, not evidence of an installed assistant connection or directory listing. In a draft branch, that production endpoint and its privacy/contact pages remain pending merge.

Build a ZIP with `node scripts/package-agent-plugin.mjs`. To test a deployment before production, use `node scripts/package-agent-plugin.mjs --endpoint https://YOUR-PREVIEW.pages.dev/mcp --output /tmp/aicv-preview-plugin.zip`. Endpoint overrides affect only the generated archive; production source stays unchanged. The normal build generates `/aicv-regional-intelligence-plugin.zip` for review download and publishes the source metadata at `/agent-plugin/`.

Connect the deployed endpoint in the assistant account, then run all five positive and three negative cases in `plugin.json`. These are expected reviewer outcomes, not claims that a provider-level test has already passed. A successful MCP client test verifies transport and retrieval; it does not prove assistant installation, citations or customer demand.

For OpenAI directory submission, upload the ZIP, verify the publisher identity and endpoint domain, pass the metadata/tool scans, add an accessible demonstration recording, and submit the tested package for review. The portal supplies the exact domain token. Do not commit credentials, invent a registered plugin ID or publish before approval. Confirm current portal category and identity fields before submitting.

Grok supports a custom connector using the public MCP URL. Muse documents custom connectors created with its guidance, but its public help page does not establish that this MCP endpoint can be installed unchanged. A Muse partner application is separate from a working custom connection. Verify either route in the actual account.

Official references checked September 30, 2026:

- [OpenAI package format](https://developers.openai.com/plugins/build/plugins)
- [OpenAI upload, review and publication](https://developers.openai.com/plugins/deploy/submission)
- [Grok custom connectors](https://docs.x.ai/grok/connectors)
- [Muse connectors](https://www.meta.com/help/artificial-intelligence/1687253048996149/)
