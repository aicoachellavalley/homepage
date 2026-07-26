#!/usr/bin/env node
/**
 * check-pricing.mjs — fails the build if any surface disagrees with the single
 * source (src/data/pricing.json). Pricing is live commercial copy; silent drift
 * between the storefront, its JSON-LD offers, and llms.txt is how a wrong
 * number reaches a buyer. Runs in `prebuild`.
 */
import { readFileSync } from 'node:fs';
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

if (errs.length) { console.error('PRICING CHECK FAILED:\n  ' + errs.join('\n  ')); process.exit(1); }
console.log(`pricing check ok — ${pricing.tiers.length} tiers, JSON-LD prices consistent`);
