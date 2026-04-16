# Nodes directory

Node MDX files. One file per institution or location.

Full schema and section structure: AICV Claude Project → CLAUDE.md
→ "Node Frontmatter Schema" and "Node Section Structure"

## Naming convention

slug.mdx — flat, no city subfolder.
Example: workforce-talent.mdx NOT palm-desert/workforce-talent.mdx

The flat path rule is non-negotiable. The MCP worker and 
static JSON build expect /nodes/[slug] — city subfolders 
break routing.

## After adding any node

1. Run: node scripts/build-static-json.cjs from ~/Projects/com/
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
