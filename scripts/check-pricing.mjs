#!/usr/bin/env node
/**
 * check-pricing.mjs — fails the build if any surface disagrees with the single
 * source (src/data/pricing.json). Pricing is live commercial copy; silent drift
 * between the storefront, its JSON-LD offers, and llms.txt is how a wrong
 * number reaches a buyer. Runs in `prebuild`.
 */
import { readFileSync, readdirSync } from 'node:fs';
const pricing = JSON.parse(readFileSync(new URL('../src/data/pricing.json', import.meta.url)));
const gar = readFileSync(new URL('../src/pages/get-agent-ready.astro', import.meta.url), 'utf8');
const errs = [];

// JSON-LD offer prices must match the source's numeric fields.
const expected = new Set();
for (const t of pricing.tiers) {
  for (const v of [t.setup, t.annual, t.onetime]) if (v > 0) expected.add(`${v}.00`);
}
expected.add('0.00');
const found = new Set([...gar.matchAll(/"price":\s*"([\d.]+)"/g)].map((m) => m[1]));
for (const f of found) if (!expected.has(f)) errs.push(`JSON-LD price ${f} is not in pricing.json`);

// The retired diagnostic name must never come back on an agent-facing surface.
const llms = readFileSync(new URL('../src/pages/llms.txt.ts', import.meta.url), 'utf8');
if (/\bAIO\b/.test(llms)) errs.push('llms.txt still says "AIO" — retired vocabulary');

/* AICV IS NOT A NONPROFIT — DESERT COMMUNITY FOUNDATION IS.
 * AICV is a fiscally sponsored project of DCF; the 501(c)(3) belongs to DCF,
 * never to AICV. Agent-facing surfaces asserted otherwise in 28 places until
 * the 2026-08-07 deletion pass. This gate is what stops them coming back.
 *
 * Method: neutralise the legitimate carriers FIRST — the phrasings where
 * "nonprofit" correctly attaches to DCF or to a third party — then match what
 * is left. A bare AICV-near-nonprofit proximity rule would fail the build on
 * the canonical fiscal-sponsorship string itself, which puts those two words
 * eleven apart and is CORRECT. Strip, then match. */
const CARRIERS = [
  /501\(c\)\(3\) nonprofit organization/gi, // attaches to DCF — the locked string
  /nonprofit organizations/gi,              // third parties, plural
  /community nonprofits/gi,
];
const BANNED = [
  [/nonprofit initiative/i, '"nonprofit initiative"'],
  [/fiscally sponsored nonprofit/i, '"fiscally sponsored nonprofit"'],
  [/nonprofit (?:intelligence|civic|research|media)/i, '"nonprofit <noun>" describing AICV'],
  [/\bAICV nonprofit\b/i, '"AICV nonprofit"'],
  [/nonprofit (?:site|summary|address|platform|mission)\b/i, '"nonprofit <noun>"'],
  [/Nonprofit\s*&/i, '"Nonprofit &" section header'],
  [/(?:AICV|AI Coachella Valley)[^.]{0,100}\bis an? [^.]{0,40}nonprofit\b/i,
   'AICV predicated as a nonprofit'],
];

/* Every agent-facing surface that states AICV's own institutional identity.
 * SKILL.md is globbed, not listed, so a second published skill is covered the
 * day it lands rather than the day someone remembers this file. */
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(new URL(`${e.name}/`, dir)) : [new URL(e.name, dir)]);

const identitySurfaces = [
  new URL('../src/pages/llms.txt.ts', import.meta.url),
  new URL('../public/.well-known/mcp/server-card.json', import.meta.url),
  ...walk(new URL('../public/.well-known/skills/', import.meta.url))
    .filter((u) => u.pathname.endsWith('SKILL.md')),
];

for (const url of identitySurfaces) {
  const stripped = CARRIERS.reduce((s, c) => s.replace(c, ''),
    readFileSync(url, 'utf8'));
  const name = url.pathname.split('/.well-known/').pop().split('/src/').pop();
  for (const [re, label] of BANNED) {
    if (re.test(stripped)) errs.push(`${name} calls AICV a nonprofit — ${label}`);
  }
}

if (errs.length) { console.error('PRICING CHECK FAILED:\n  ' + errs.join('\n  ')); process.exit(1); }
console.log(`pricing check ok — ${pricing.tiers.length} tiers, JSON-LD prices consistent, ${identitySurfaces.length} identity surfaces clean`);
