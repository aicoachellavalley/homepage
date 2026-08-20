#!/usr/bin/env node
/**
 * sync-previews-manifest.mjs — bring the Agent Preview tranche manifests into
 * this repo as committed data.
 *
 * DERIVE-FIRST, COMMITTED FALLBACK. The manifests are produced by the mva
 * build (`previews/dist/_manifest/previews-index-<segment>.json`). When a
 * sibling mva checkout is present (a dev machine), this script derives from it
 * and rewrites `src/data/previews/`. When it is absent — which is always true
 * in the Cloudflare Pages build — it no-ops and the committed copies are used.
 *
 * Deliberately NO network fetch: a build that can fail because a remote file
 * was briefly unreachable is a build that will eventually fail at the worst
 * moment. The committed copy is the contract; syncing is a dev-time action
 * whose result is reviewable in a diff.
 *
 * Run: node scripts/sync-previews-manifest.mjs   (then commit the diff)
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '../src/data/previews');
const srcDir = resolve(here, '../../../mva/previews/dist/_manifest');

mkdirSync(outDir, { recursive: true });

if (!existsSync(srcDir)) {
  const have = existsSync(outDir) ? readdirSync(outDir).filter((f) => f.endsWith('.json')) : [];
  console.log(`sync-previews-manifest: no sibling mva checkout — using ${have.length} committed manifest(s)`);
  process.exit(0);
}

const REQUIRED = ['domain', 'segment', 'count', 'indexable', 'sitemap', 'entries'];
let n = 0;
for (const f of readdirSync(srcDir).filter((x) => /^previews-index-.+\.json$/.test(x))) {
  const doc = JSON.parse(readFileSync(join(srcDir, f), 'utf8'));
  const missing = REQUIRED.filter((k) => doc[k] === undefined);
  if (missing.length) { console.error(`  ${f}: missing ${missing.join(', ')} — refusing to sync`); process.exit(1); }
  if (!Array.isArray(doc.entries) || doc.entries.length !== doc.count) {
    console.error(`  ${f}: entries (${doc.entries?.length}) != count (${doc.count}) — refusing to sync`); process.exit(1);
  }
  writeFileSync(join(outDir, f), JSON.stringify(doc, null, 1) + '\n');
  console.log(`  synced ${doc.segment}: ${doc.count} pages, ${doc.indexable} indexable`);
  n++;
}
console.log(`sync-previews-manifest: ${n} manifest(s) derived from the mva build`);

/* ── VERIFIED MEMBERS (2026-08-19) ──────────────────────────────────────────
 * The manifests above say what is PUBLISHED. This says who has PAID AND
 * VERIFIED, which is a different fact and lives in a different place: mva's
 * previews/claims-snapshot.json, a census of activate's D1 written by
 * previews/sync-claims.mjs.
 *
 * ⚠️ THE SNAPSHOT, NOT claimed.json. claimed.json is hand-written, and mva's
 * build gate reconciles it against D1 only for the ONE TRANCHE being built — so
 * a self-serve DNS claim in another category can be Live and correct while
 * absent from every claimed.json this repo could read. The snapshot is
 * whole-corpus and covers both verification paths.
 *
 * Slugs only. The snapshot is findings-free by construction and carries no
 * owner-supplied facts, so the honest scope of a named presence is a name and a
 * URL — both of which come from the manifest entries, joined at build time by
 * scripts/claimed-members.cjs. */
const snapPath = resolve(srcDir, '../../previews/claims-snapshot.json');
if (existsSync(snapPath)) {
  const snap = JSON.parse(readFileSync(snapPath, 'utf8'));
  if (!Array.isArray(snap.d1)) {
    console.error(`  claims-snapshot.json has no d1[] — refusing to sync the member list`);
    process.exit(1);
  }
  const slugs = snap.d1.filter((r) => r.status === 'live').map((r) => r.slug).sort();
  const outFile = resolve(here, '../src/data/previews-claimed.json');
  const prev = existsSync(outFile) ? JSON.parse(readFileSync(outFile, 'utf8')) : {};
  writeFileSync(outFile, JSON.stringify({
    ...prev,
    generated: snap.generated,
    source: snap.source,
    slugs,
  }, null, 2) + '\n');
  console.log(`sync-previews-manifest: ${slugs.length} verified member(s) from claims-snapshot ${String(snap.generated).slice(0, 10)}`);
} else {
  console.log(`sync-previews-manifest: no claims-snapshot.json beside mva — member list left as committed`);
}
