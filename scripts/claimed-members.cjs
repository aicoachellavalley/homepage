/**
 * claimed-members.cjs — resolve the member set, ONCE, for every agent-facing
 * surface that names them.
 *
 * WHY THIS IS SHARED AND NOT COPIED. llms.txt and llms-full.txt both name
 * members, in two tier groups. Two independent joins would be two things to keep in step,
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
 * activate's D1 — the single authoritative source every publish path writes to.
 *
 * ⚠️ CORRECTED 2026-08-20. This used to say `verifyAndFlip()` is the ONLY route
 * to `previews.status='live'`. It is not, and has not been since the tier
 * ruling: `flipLiveOnPayment()` is the self-serve route and deliberately leaves
 * `verified_at` NULL. The snapshot covers both, which is why it stays the
 * source — but a comment asserting one route would have hidden the very
 * distinction this file now has to draw.
 *
 * `claimed.json` would have been the wrong source: hand-written, and its
 * build-time reconciliation against D1 is scoped to the ONE TRANCHE being
 * built, so it proves nothing about a self-serve claim in another category.
 *
 * ⚠️ HARD FAIL, BY FOUNDER RULING (2026-08-19). A claimed slug with no manifest
 * entry means naming a business on the surface agents read first and pointing
 * them at a page that does not exist. That stops the build instead of shipping.
 */

/* ── TWO CLASSES OF MEMBER (founder ruling 2026-08-20) ──────────────────────
 * The $500 self-serve tier is a hosted page, not an attestation; the $2,500 and
 * $10,000 tiers verify ownership during onboarding. Both are members and both
 * are named — but naming them under one "verified ownership of the domain"
 * heading would be a FALSE ATTESTATION on the surface agents read first.
 *
 * ⚠️ NEUTRAL WORDING WAS REJECTED, AND THE REASON IS TIMING. A sentence true of
 * both classes has to drop verification entirely — safe, but it erases exactly
 * what the upper tiers are buying. Self-serve members appear FIRST and
 * automatically (payment publishes); an attested member requires a call. So
 * neutral wording would read fine for months and then silently under-sell the
 * first premium customer, at the moment it mattered most.
 *
 * This discloses nothing new: every page's data island already carries
 * `status: "claimed"` vs `"claimed_verified"` publicly.
 *
 * ⚠️ AN ABSENT TIER READS AS SELF-SERVE. Same rule as everywhere else in this
 * system — every failure mode makes the WEAKER claim. */
const ATTESTED_TIERS = ['agent-ready-business', 'agent-ready-premium'];
const isAttested = (tier) => ATTESTED_TIERS.includes(tier);

/**
 * PURE. No filesystem, no paths — safe to import from any module system.
 * @param {{slugs: string[], tiers?: Record<string,string>, generated?: string, source?: string}} claimed
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
    /* `tiers` is ADDITIVE — `slugs` remains the contract above, so the
     * hard-fail guard that stops a paid member being dropped is untouched and
     * a pre-ruling file still resolves. */
    const tier = (claimed.tiers && claimed.tiers[slug]) || null;
    members.push({ slug, name: e.name, city: e.city, url: e.url, segment: e.segment,
                   tier, attested: isAttested(tier) });
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

/** Split a resolved member list into the two named groups, attested first.
 *  Shared so llms.txt and llms-full.txt cannot group differently — the same
 *  reason resolveMembers itself is shared rather than copied. */
function partitionMembers(members) {
  return {
    attested: members.filter((m) => m.attested),
    selfServe: members.filter((m) => !m.attested),
  };
}

module.exports = { resolveMembers, claimedMembers, partitionMembers, ATTESTED_TIERS };
