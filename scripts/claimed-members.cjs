/**
 * claimed-members.cjs — resolve the verified-member set, ONCE, for every
 * agent-facing surface that names them.
 *
 * WHY THIS IS SHARED AND NOT COPIED. llms.txt and llms-full.txt both name
 * verified members. Two independent joins would be two things to keep in step,
 * and the failure would be silent: a member present on one surface and absent
 * from the other, with nothing asserting they agree. So the JOIN AND THE
 * ASSERTION live here and both callers use them. They cannot disagree with each
 * other, and neither can disagree with the claimed set.
 *
 * ⚠️ TWO EXPORTS, AND THE SPLIT IS LOAD-BEARING. `resolveMembers()` is PURE —
 * data in, members out, no filesystem, no paths. `claimedMembers()` is the Node
 * convenience that reads from disk and calls it. They are separate because
 * llms.txt.ts is an Astro endpoint: Vite transforms this file into ESM, where
 * `__dirname` does not exist. Evaluating a path at module scope therefore
 * CRASHED THE BUILD ("__dirname is not defined in ES module scope"). Every path
 * expression now lives INSIDE claimedMembers(), so importing the pure function
 * from an ESM context never touches one. The Astro endpoint feeds its own data
 * in via import/glob; build-static-json.cjs uses the disk reader. Same join,
 * same assertion, two data paths.
 *
 * THE SOURCE IS THE SNAPSHOT, NOT claimed.json. `previews-claimed.json` is
 * derived from mva's `previews/claims-snapshot.json`, itself a census of
 * activate's D1 — the single authoritative source both verification paths write
 * to (`verifyAndFlip()` is the only route to `previews.status='live'`, and
 * self-serve DNS goes through it exactly as an admin approval does).
 *
 * `claimed.json` would have been the wrong source: hand-written, and its
 * build-time reconciliation against D1 is scoped to the ONE TRANCHE being
 * built, so it proves nothing about a self-serve claim in another category.
 *
 * ⚠️ HARD FAIL, BY FOUNDER RULING (2026-08-19). A claimed slug with no manifest
 * entry means naming a business on the surface agents read first and pointing
 * them at a page that does not exist. That stops the build instead of shipping.
 */

/**
 * PURE. No filesystem, no paths — safe to import from any module system.
 * @param {{slugs: string[], generated?: string, source?: string}} claimed
 * @param {Array<{segment: string, entries: Array<{slug,name,city,url}>}>} manifests
 */
function resolveMembers(claimed, manifests) {
  if (!claimed || !Array.isArray(claimed.slugs)) {
    throw new Error('previews-claimed.json is missing or malformed — needs slugs[]. An absent file is never read as "zero members": that would drop a paid, verified member silently.');
  }
  const bySlug = new Map();
  for (const doc of manifests) {
    for (const e of doc.entries || []) bySlug.set(e.slug, { ...e, segment: doc.segment });
  }
  const members = [];
  const orphans = [];
  for (const slug of claimed.slugs) {
    const e = bySlug.get(slug);
    if (!e) { orphans.push(slug); continue; }
    members.push({ slug, name: e.name, city: e.city, url: e.url, segment: e.segment });
  }
  if (orphans.length) {
    throw new Error(
      `${orphans.length} verified member(s) have no published preview page: ${orphans.join(', ')}.\n` +
      `  Naming them on llms.txt would point an agent at a page that does not exist.\n` +
      `  Either the tranche has not been rebuilt since the claim, or the slug changed.\n` +
      `  Fix the manifest (rebuild + sync the tranche in mva), or retract the claim.`
    );
  }
  /* Sorted so both surfaces emit the same order and a no-op build makes no
   * diff. Manifest read order is not a contract. */
  members.sort((a, b) => a.slug.localeCompare(b.slug));
  return { generated: claimed.generated || null, source: claimed.source || null, members };
}

/** Node/CJS convenience — reads from disk, then defers to resolveMembers(). */
function claimedMembers() {
  const fs = require('fs');
  const path = require('path');
  const comRoot = path.resolve(__dirname, '..');
  const claimedPath = path.join(comRoot, 'src', 'data', 'previews-claimed.json');
  const manifestDir = path.join(comRoot, 'src', 'data', 'previews');
  let claimed;
  try {
    claimed = JSON.parse(fs.readFileSync(claimedPath, 'utf8'));
  } catch (err) {
    throw new Error(
      `src/data/previews-claimed.json is missing or unreadable (${err.message}).\n` +
      `  It is derived from mva by scripts/sync-previews-manifest.mjs.\n` +
      `  An absent file is never read as "zero members" — that would drop a paid member silently.`
    );
  }
  const manifests = fs.readdirSync(manifestDir)
    .filter((x) => /^previews-index-.+\.json$/.test(x))
    .map((f) => JSON.parse(fs.readFileSync(path.join(manifestDir, f), 'utf8')));
  return resolveMembers(claimed, manifests);
}

module.exports = { resolveMembers, claimedMembers };
