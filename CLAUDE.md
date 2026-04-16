# AICV — aicoachellavalley.com repo

### CRITICAL: Stack
Mintlify retired April 2026. Current stack: Astro + Cloudflare Pages.
Ignore any legacy mint.json, docs/, or .mintlify references anywhere
in this repo or git history.

### CRITICAL: Source of Truth
All schemas, workflows, content type definitions, and strategic
decisions live in the AICV Claude Project (Claude.ai). This file
is a repo orientation only. For architectural changes, schema
questions, or anything beyond file execution — consult the
Claude Project first.

## What this repo is

Astro source for aicoachellavalley.com — the agent-first
intelligence documentation site for the Coachella Valley.

GitHub: https://github.com/aicoachellavalley/homepage
Live: https://aicoachellavalley.com

## Repo structure

src/content/briefs/   — Intelligence Brief MDX files
src/content/nodes/    — Node MDX files
src/content/reports/  — Report MDX files
public/               — Static assets
scripts/              — Build scripts
  build-static-json.cjs — Run after every brief or node session

## Key commands

Build static JSON (run after every content session):
  node scripts/build-static-json.cjs
  from ~/Projects/com/

Deploy:
  cd ~/Projects/com && npx wrangler pages deploy dist 
  --project-name aicoachellavalley-homepage

Org site deploy (required after every node addition):
  cd ~/Projects/org && npx wrangler pages deploy . 
  --project-name aicoachellavalley-org

## Companion files (in Claude Project)

- CLAUDE.md — full schemas, workflows, MDX rules, strategy
- STATE.md — live counts, active month, last commit
- ARCHITECTURE.md — infra, workers, deployment details
- NODES.md — full node plan with status
- VOICE.md — @CoachellaAI tone brief

## Side effects (required after every session)

Every brief filed → 📡 journal line item in ~/sunshine-fm/journal/index.html
Every node added → 📓 journal line item in ~/sunshine-fm/journal/index.html
Every session → update STATE.md counts and last commit hash
