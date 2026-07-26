# Briefs directory

Intelligence Brief MDX files. One file per signal, filed by date.

Full schema and section structure: AICV Claude Project → CLAUDE.md
→ "Intelligence Brief Frontmatter Schema" and 
  "Intelligence Brief Section Structure"

## Naming convention

YYYY-MM-DD-slug.mdx

Slug: lowercase, hyphens, descriptive, no city prefix.
Example: 2026-04-15-moonshots-white-collar-replacement.mdx

## Also Noted files

YYYY-MM-DD-also-noted.mdx
Full schema: AICV Claude Project → CLAUDE.md → "Also Noted"

## After filing any brief

1. Run: node scripts/build-static-json.cjs from ~/AICV/core/com/
2. Commit: feat: add [date] [slug] brief
3. Push to main — auto-deploys
4. Add 📡 journal line item to ~/AICV/sunshine-fm/journal/index.html
5. Update STATE.md brief count

## MDX rules (critical)

- Never use <!-- --> comments — use {/* */}
- Dollar signs in frontmatter: bare $ only, never \$
- Dollar signs in body: always escape as \$
- Full rules: AICV Claude Project → CLAUDE.md → "MDX Rules"
