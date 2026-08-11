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
/* CARRIERS[0] IS DEAD BY RULING (founder ruling 2026-08-11), NOT DEAD CODE.
 * It was annotated "the locked string" — the one phrasing whose presence was
 * mandatory-adjacent, protected from the sweep because it attaches to DCF and
 * not to AICV. The 2026-08-11 ruling retires fiscal-sponsorship framing from
 * .com entirely: correctly scoped is no longer sufficient grounds to keep it,
 * because .com is a commercial surface owned by SunshineFM LLC and does not
 * carry .org's arrangement even accurately. Measured at ruling time: zero
 * matches for all three carriers across all ten identity surfaces, so the
 * stripping pass is a no-op today.
 * KEPT DELIBERATELY. A carrier that matches nothing costs one regex and makes
 * the gate WRONG in exactly one direction if deleted: a future surface that
 * legitimately quotes DCF's own 501(c)(3) status — the DCF node's text, a
 * report discussing the foundation as a subject — would trip zero-tolerance
 * and fail the build on a true third-party fact. The array is the gate's
 * definition of "legitimate", not a whitelist of strings we intend to ship. */
const CARRIERS = [
  /501\(c\)\(3\) nonprofit organization/gi, // attaches to DCF — dead by ruling 2026-08-11, kept as a third-party carrier
  /nonprofit organizations/gi,              // third parties, plural
  /community nonprofits/gi,
];
/* ZERO TOLERANCE, not noun enumeration (hardened 2026-08-08).
 * The previous gate listed seven prose patterns. README.md's "nonprofit face"
 * fired NONE of them — the list anticipated site/summary/address/platform/
 * mission and never "face", and would not have anticipated arm, wing or side
 * either. Enumeration cannot win that race.
 * On an identity surface there is no legitimate reason to say "nonprofit" at
 * all except through a CARRIER above, so after stripping carriers ANY survivor
 * is a defect. Measured at hardening time: exactly the two live defects, zero
 * false positives across all ten surfaces. */
const NONPROFIT = /non-?profit/gi;

/* Structural pass — JSON predicates with a KEY/VALUE PAIR, never a sentence.
 * `"type": "Nonprofit"` asserts precisely what "AICV is a nonprofit" asserts,
 * in a grammar no prose regex models; the two tokens also sit on different
 * lines, so line-based greps miss them for a second, unrelated reason. Zero
 * tolerance already catches it in raw text — this pass exists to LOCATE it
 * ("_meta.publisher.type") instead of reporting an unplaced hit. */
const jsonNonprofitPaths = (text) => {
  let doc;
  try { doc = JSON.parse(text); } catch { return []; }
  const out = [];
  (function walkValue(node, path) {
    if (Array.isArray(node)) node.forEach((v, i) => walkValue(v, `${path}[${i}]`));
    else if (node && typeof node === 'object')
      for (const [k, v] of Object.entries(node)) walkValue(v, `${path}.${k}`);
    else if (typeof node === 'string' && /^\s*non-?profit\s*$/i.test(node)) out.push(path);
  })(doc, '');
  return out;
};

/* IDENTITY SURFACES — the test is NOT "is this machine-readable" but "can an
 * agent read this and conclude AICV is a nonprofit". The repo is PUBLIC and the
 * MCP desk fetches from its raw.githubusercontent.com URLs, so README.md and
 * CLAUDE.md qualify alongside the .well-known tree. The whole tree is globbed,
 * not listed, so a new discovery file is covered the day it lands.
 *
 * DELIBERATELY OUT: STATE.md and this file. Both DESCRIBE the rule and so
 * necessarily contain the forbidden word. A gate that forbids a word cannot
 * police the log documenting the policy, or its own source.
 *
 * DEFERRED, not rejected: the .astro identity pages. They pass the test, but
 * get-agent-ready.astro carries the FAQ header "Is AICV a nonprofit?" — a
 * question, not a claim — which needs its own ruling first. See playbook
 * STATE.md (2026-08-08). */
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(new URL(`${e.name}/`, dir)) : [new URL(e.name, dir)]);

const identitySurfaces = [
  new URL('../src/pages/llms.txt.ts', import.meta.url),
  new URL('../README.md', import.meta.url),
  new URL('../CLAUDE.md', import.meta.url),
  new URL('../public/robots.txt', import.meta.url),
  ...walk(new URL('../public/.well-known/', import.meta.url)),
];

const repoRoot = new URL('../', import.meta.url).pathname;
for (const url of identitySurfaces) {
  const raw = readFileSync(url, 'utf8');
  const survivors = CARRIERS.reduce((s, c) => s.replace(c, ''), raw).match(NONPROFIT);
  if (!survivors) continue;
  const paths = jsonNonprofitPaths(raw);
  const rel = url.pathname.startsWith(repoRoot) ? url.pathname.slice(repoRoot.length) : url.pathname;
  errs.push(`${rel} calls AICV a nonprofit — ${survivors.length} occurrence(s) survive `
    + `carrier-stripping${paths.length ? ` (JSON value at ${paths.join(', ')})` : ''}`);
}

if (errs.length) { console.error('PRICING CHECK FAILED:\n  ' + errs.join('\n  ')); process.exit(1); }
console.log(`pricing check ok — ${pricing.tiers.length} tiers, JSON-LD prices consistent, ${identitySurfaces.length} identity surfaces clean`);
