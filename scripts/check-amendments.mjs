#!/usr/bin/env node
/**
 * check-amendments.mjs — fails the build if an amended brief's notice does not
 * reach every surface that publishes the brief, or if an unamended brief has
 * grown amendment metadata it should not have. Runs in `postbuild`, after
 * `dist/` and `public/` exist. Added 2026-09-14 with the `supersession` field.
 *
 * WHAT IT ASSERTS, per brief, derived from the brief's own frontmatter (no
 * slug list anywhere in this file — OPERATING-RULES §7.6, a guard with a
 * hardcoded scope decays):
 *
 *   amended (has `correction` and/or `supersession`)
 *     - the rendered page carries every notice's summary text, and every
 *       supersession notice links to its successor_url
 *     - briefs.json carries the identical arrays, plus `date_modified` equal to
 *       the derived modification date (scripts/brief-dates.cjs)
 *     - llms-full.txt's section for the brief carries every summary
 *     - the page's NewsArticle JSON-LD says datePublished = frontmatter date and
 *       dateModified = derived date
 *     - sitemap.xml lastmod for the brief = derived date
 *     - an internal successor_url resolves to a page that was actually built
 *   unamended
 *     - no `correction`, `supersession` or `date_modified` key in briefs.json
 *     - no notice markup on the page; JSON-LD dateModified = datePublished;
 *       sitemap lastmod = publication date
 *   all
 *     - briefs.json count = MDX count = llms-full.txt brief-section count
 *
 * The frontmatter is parsed here with js-yaml (Astro's own frontmatter parser,
 * present as its dependency), NOT with build-static-json.cjs's hand parser — so
 * this is a second, independent reading. If the hand parser ever mangles a
 * notice, the feed will disagree with this reading and the build will stop.
 *
 * `--dist <dir> --public <dir>` point the check at other build outputs. That
 * is how this script was proven against the pre-2026-09-14 build (it fails
 * there on every amended brief), and it is how to re-prove it later.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import yaml from 'js-yaml';

const require = createRequire(import.meta.url);
const { briefDateModified, briefIsAmended } = require('./brief-dates.cjs');

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const argv = process.argv.slice(2);
const argOf = (flag, dflt) => { const i = argv.indexOf(flag); return i !== -1 && argv[i + 1] ? resolve(argv[i + 1]) : dflt; };
const DIST   = argOf('--dist',   resolve(root, 'dist'));
const PUBLIC = argOf('--public', resolve(root, 'public'));
const BRIEFS = resolve(root, 'src', 'content', 'briefs');
const SITE   = 'https://aicoachellavalley.com';

const failures = [];
const fail = (slug, msg) => failures.push(`${slug}: ${msg}`);

// ---- inputs -------------------------------------------------------------
const need = (p) => { if (!existsSync(p)) { console.error(`check-amendments: missing ${p} — run after the build`); process.exit(1); } return p; };
const feed     = JSON.parse(readFileSync(need(resolve(PUBLIC, 'briefs.json')), 'utf8'));
const llmsFull = readFileSync(need(resolve(PUBLIC, 'llms-full.txt')), 'utf8');
const sitemap  = readFileSync(need(resolve(DIST, 'sitemap.xml')), 'utf8');

const feedBySlug = new Map(feed.map(b => [b.slug, b]));

const sitemapLastmod = new Map();
for (const m of sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)) {
  sitemapLastmod.set(m[1], m[2] || null);
}

const llmsSections = new Map();
for (const section of llmsFull.split('\n\n---\n\n')) {
  const m = section.match(/^## brief: (\S+)\n/);
  if (m) llmsSections.set(m[1], section);
}

const decode = (html) => html
  .replace(/&#39;/g, "'").replace(/&#x27;/g, "'").replace(/&quot;/g, '"')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

const files = readdirSync(BRIEFS).filter(f => f.endsWith('.mdx') && !f.startsWith('_'));

// ---- per-brief ----------------------------------------------------------
let amendedCount = 0;
for (const file of files) {
  const slug = basename(file, '.mdx');
  const src  = readFileSync(resolve(BRIEFS, file), 'utf8');
  const fmMatch = src.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) { fail(slug, 'no frontmatter'); continue; }
  const fm = yaml.load(fmMatch[1]);
  const derived  = briefDateModified(fm);
  const amended  = briefIsAmended(fm) || Array.isArray(fm.correction) || Array.isArray(fm.supersession);
  const notices  = [
    ...(fm.correction   || []).map(c => ({ kind: 'correction',   ...c })),
    ...(fm.supersession || []).map(s => ({ kind: 'supersession', ...s })),
  ];

  const pageUrl  = `${SITE}/briefs/${slug}/`;
  const htmlPath = resolve(DIST, 'briefs', slug, 'index.html');
  if (!existsSync(htmlPath)) { fail(slug, `page not built at ${htmlPath}`); continue; }
  const html = readFileSync(htmlPath, 'utf8');
  const text = decode(html);

  // JSON-LD — find the NewsArticle block
  let article = null;
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { const j = JSON.parse(m[1]); if (j['@type'] === 'NewsArticle') article = j; } catch { /* other blocks */ }
  }
  if (!article) fail(slug, 'no NewsArticle JSON-LD on page');
  else {
    if (article.datePublished !== fm.date) fail(slug, `JSON-LD datePublished ${article.datePublished} ≠ frontmatter date ${fm.date}`);
    if (article.dateModified  !== derived) fail(slug, `JSON-LD dateModified ${article.dateModified} ≠ derived ${derived}`);
  }

  // sitemap
  if (!sitemapLastmod.has(pageUrl)) fail(slug, 'not in sitemap.xml');
  else if (sitemapLastmod.get(pageUrl) !== derived) fail(slug, `sitemap lastmod ${sitemapLastmod.get(pageUrl)} ≠ derived ${derived}`);

  // feed presence
  const entry = feedBySlug.get(slug);
  if (!entry) { fail(slug, 'absent from briefs.json'); continue; }

  // llms-full presence
  const section = llmsSections.get(slug);
  if (!section) fail(slug, 'absent from llms-full.txt');

  if (!amended) {
    for (const key of ['correction', 'supersession', 'date_modified']) {
      if (key in entry) fail(slug, `unamended brief carries "${key}" in briefs.json`);
    }
    if (/class="(correction|supersession)-note"/.test(html)) fail(slug, 'unamended brief renders a notice');
    if (/class="brief-updated"/.test(html)) fail(slug, 'unamended brief renders an Updated line');
    continue;
  }

  amendedCount++;
  if (notices.length === 0) fail(slug, 'derived date differs from publication date but no notice found');

  for (const key of ['correction', 'supersession']) {
    if (Array.isArray(fm[key])) {
      if (JSON.stringify(entry[key]) !== JSON.stringify(fm[key])) fail(slug, `briefs.json "${key}" ≠ frontmatter`);
    } else if (key in entry) fail(slug, `briefs.json carries "${key}" the frontmatter does not`);
  }
  if (entry.date_modified !== derived) fail(slug, `briefs.json date_modified ${entry.date_modified} ≠ derived ${derived}`);

  if (!/class="brief-updated"/.test(html)) fail(slug, 'page has no Updated line');

  for (const n of notices) {
    if (!n.date || !n.summary) { fail(slug, `${n.kind} entry missing date or summary`); continue; }
    if (!text.includes(n.summary)) fail(slug, `${n.kind} summary not rendered on page (${n.date})`);
    if (!html.includes(`class="${n.kind}-note"`)) fail(slug, `no .${n.kind}-note element on page`);
    if (section) {
      const raw = n.summary, esc = JSON.stringify(n.summary).slice(1, -1);
      if (!section.includes(raw) && !section.includes(esc)) fail(slug, `${n.kind} summary absent from llms-full.txt section`);
    }
    if (n.kind === 'supersession') {
      if (!n.successor_url) { fail(slug, 'supersession entry has no successor_url'); continue; }
      if (!html.includes(`href="${n.successor_url}"`)) fail(slug, `page does not link successor ${n.successor_url}`);
      if (n.successor_url.startsWith(SITE + '/')) {
        const rel = n.successor_url.slice(SITE.length).replace(/\/$/, '');
        const target = resolve(DIST, `.${rel}`, 'index.html');
        if (!existsSync(target)) fail(slug, `successor_url ${n.successor_url} was not built (${target})`);
        if (n.successor_url === pageUrl) fail(slug, 'supersession points at itself');
      }
    }
  }
}

// ---- corpus counts -------------------------------------------------------
if (feed.length !== files.length) failures.push(`briefs.json has ${feed.length} entries, src has ${files.length} brief files`);
if (llmsSections.size !== files.length) failures.push(`llms-full.txt has ${llmsSections.size} brief sections, src has ${files.length} brief files`);

// ---- verdict --------------------------------------------------------------
if (failures.length) {
  console.error(`check-amendments FAILED — ${failures.length} problem(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`amendments check ok — ${files.length} briefs, ${amendedCount} amended, notices agree across page, briefs.json, llms-full.txt, JSON-LD and sitemap`);
