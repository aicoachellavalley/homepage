# Nodes directory

Node MDX files. One file per institution or location.

Full schema and section structure: AICV Claude Project → CLAUDE.md
→ "Node Frontmatter Schema" and "Node Section Structure"

## Three-axis schema — Astro-enforced

`city`, `domain`, and `funnel_stages` are required fields validated
at build time by `src/content.config.ts`. A missing or invalid value
causes a Cloudflare deploy failure, not just a review note.

Enum values are locked — do not invent new values without a
deliberate schema session. Current enums in content.config.ts.

## Operating discipline — five stages, no exceptions

1. Recon — read existing nodes and schema before touching anything
2. Propose — draft frontmatter + diff, explicit stop-gate
3. Write — only after explicit approval
4. Verify — check build output and nodes.json before committing
5. Commit — one concern per commit, message describes the change

No stage is skipped. No action lands without the prior stage confirmed.

## Naming convention

slug.mdx — flat, no city subfolder.
Example: workforce-talent.mdx NOT palm-desert/workforce-talent.mdx

The flat path rule is non-negotiable. The MCP worker and 
static JSON build expect /nodes/[slug] — city subfolders 
break routing.

## After adding any node

1. Run: node scripts/build-static-json.cjs from ~/Projects/com/
   Verify: node count incremented, zero validation warnings,
   domain and funnel_stages present on the new node in nodes.json
2. Update org graph — add to ZONE_MAP, SUB_MAP, and STATIC_LINKS
   in ~/Projects/org/index.html (minimum one edge required)
3. If valley-wide node: add slug to VW_ORDER array
4. Update reciprocal related: frontmatter on all linked nodes
5. Commit com changes: feat: add [location] node
6. Commit org changes: feat: add [node-slug] to graph lookup tables
7. Deploy both sites (see ~/Projects/com/CLAUDE.md)
8. Add 📓 journal line item to ~/sunshine-fm/journal/index.html
9. Update STATE.md node count

## MDX rules

Same as briefs — see ~/Projects/com/src/content/briefs/CLAUDE.md

Intake prompt for new nodes: aicv-playbook/prompts/node-intake-v0.md
