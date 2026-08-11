#!/usr/bin/env node
/**
 * check-ownership.mjs — fails the build if the ownership statement is missing
 * from the RENDERED output. Runs in `postbuild`, after `dist/` exists.
 *
 * WHY THIS IS A SEPARATE SCRIPT AND A SEPARATE HOOK.
 * check-pricing.mjs runs in `prebuild`, before astro has written anything, so
 * it can only read source. Every check in that file is also NEGATIVE — it
 * forbids "nonprofit" on five identity surfaces, none of which is a .astro
 * file. Nothing anywhere required the ownership statement to EXIST. Deleting
 * the only visible ownership statement on .com would have passed the build
 * silently, on a repo whose entity rulings are the most carefully guarded
 * thing in it.
 *
 * ASSERTING ON RENDERED HTML, NOT ON SOURCE (founder call, 2026-08-10).
 * A source-level check passes if the string sits inside a branch that never
 * renders — a `variant` that no page uses, a conditional that is always false.
 * dist/ is what an agent actually reads, so dist/ is what gets asserted.
 *
 * CANON. On .com, SunshineFM LLC is the owning entity, and no
 * fiscal-sponsorship or nonprofit language appears — that framing belongs to
 * .org. See com commits b6cb0a7, 0b00c90, e243b6e and the deletion pass
 * cd2ecaf.
 *
 * THIS PINS COPY, AND THAT IS THE POINT. Rewording the statement fails the
 * build until this file is updated in the same commit. That is intended: the
 * string is a canon claim, not a design detail, and it should not be possible
 * to change it by accident. Note there is NO trailing period — the statement
 * sits between middot separators in the bottom bar.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const OWNERSHIP = 'A product and service of SunshineFM LLC';

/* EXEMPT, and each for a recorded reason — not a convenience list.
 *   aiqna/      programme disclosure; AIQnA carries its own ownership
 *               phrasing ("Powered by SunshineFM LLC") and is a separate
 *               project. If AIQnA ever separates, that string goes with it.
 *
 * terms/ WAS EXEMPT AND NO LONGER IS (founder ruling 2026-08-11). It was
 * exempted as "legally scoped, parked pending counsel" — and that exemption
 * is exactly why /terms/ was the last page on .com asserting fiscal
 * sponsorship and a 501(c)(3), in a hand-rolled <footer> that named no owner
 * at all. The counterparty copy is now corrected and the standard ownership
 * statement is in that footer, so the page is inside the gate. What still
 * goes to counsel is the DCF indemnity clause, which this gate does not
 * touch: a parked clause is not grounds to park the whole page. */
const EXEMPT = [/^aiqna\//];

const DIST = new URL('../dist/', import.meta.url).pathname;
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);

const pages = walk(DIST).filter((p) => p.endsWith('index.html'));
if (!pages.length) {
  console.error('OWNERSHIP CHECK FAILED: no built pages found in dist/ — did astro build run?');
  process.exit(1);
}

const missing = [];
let checked = 0;
for (const p of pages) {
  const rel = p.slice(DIST.length);
  if (EXEMPT.some((re) => re.test(rel))) continue;
  checked++;
  const html = readFileSync(p, 'utf8');
  const footer = html.match(/<footer[\s\S]*?<\/footer>/);
  /* Asserted INSIDE the footer, not anywhere on the page: a match in body
   * prose or in JSON-LD is not the visible ownership statement. */
  if (!footer || !footer[0].includes(OWNERSHIP)) missing.push(rel);
}

if (missing.length) {
  console.error(
    `OWNERSHIP CHECK FAILED — ${missing.length} of ${checked} pages have no ownership statement in their footer.\n`
    + `  Expected verbatim, inside <footer>: "${OWNERSHIP}"\n`
    + `  Canon requires it present and visible on .com.\n  `
    + missing.slice(0, 20).join('\n  ')
    + (missing.length > 20 ? `\n  ...and ${missing.length - 20} more` : '')
  );
  process.exit(1);
}
console.log(`ownership check ok — "${OWNERSHIP}" present in the footer of all ${checked} non-exempt pages`);
