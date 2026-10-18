#!/usr/bin/env node
/**
 * check-entity.mjs — postbuild. Fails the build if anything that ships says
 * AICV (or .com, SunshineFM, "we") is a nonprofit or fiscally sponsored.
 * The rule and its history live in scripts/entity-rule.mjs.
 *
 * SCOPE = WHAT SHIPS. Every text file in dist/ (pages, llms.txt,
 * llms-full.txt, JSON feeds, sitemaps, the whole .well-known tree) plus the
 * repository's README.md and CLAUDE.md, which are public on GitHub and read by
 * the MCP desk. No list of surfaces: a new route or feed is covered the day it
 * is built. Pages are read the way an agent reads them — tags joined inside a
 * sentence, JSON-LD and meta/alt attribute text included.
 *
 * `--dist <dir>` points it at another build (how the controls were run).
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { entityViolations, stripMentions } from './entity-rule.mjs';

const arg = (name) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : null; };
const ROOT = new URL('../', import.meta.url).pathname;
const DIST = arg('--dist') || join(ROOT, 'dist');

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
const TEXT = new Set(['.html', '.txt', '.json', '.xml', '.md', '.webmanifest', '']);

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', mdash: '—', ndash: '–', middot: '·', hellip: '…' };
const unescape = (s) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
  .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
// Quote style and escaping vary by surface (smartypants on pages, \" inside
// llms-full.txt); a notice must match itself on every one of them.
const plain = (s) => s.replace(/\\(["'])/g, '$1').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[ \t\r\f\v]+/g, ' ');

const BLOCK = /^(?:p|li|h[1-6]|div|td|th|tr|dt|dd|br|hr|section|article|header|footer|nav|main|aside|ul|ol|dl|blockquote|title|script|figcaption|summary|details|table|form|label|option|button)$/i;
const ATTRS = /\b(?:content|alt|title|aria-label|tooldescription|toolparamdescription|placeholder)\s*=\s*"([^"]*)"/gi;

/** An HTML page as an agent reads it: visible text with inline tags joined,
 *  script bodies (JSON-LD, inline tool definitions) kept, attribute text added. */
function htmlText(html) {
  const attrs = [...html.matchAll(ATTRS)].map((m) => m[1]);
  // JSON-LD is read value by value, so one node's name never lends its subject
  // to another node's description inside the same <script> block.
  const ld = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => jsonText(m[1]));
  const body = html
    .replace(/<script[^>]*application\/ld\+json[^>]*>[\s\S]*?<\/script>/gi, '\n')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '\n')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?([a-z0-9-]+)\b[^>]*>/gi, (_, tag) => (BLOCK.test(tag) ? '\n' : ''));
  return unescape([body, ...ld, ...attrs].join('\n'));
}

/** Every string value in a JSON document, one per line. */
function jsonText(raw) {
  let doc; try { doc = JSON.parse(raw); } catch { return raw; }
  const out = [];
  (function visit(v) {
    if (typeof v === 'string') out.push(v);
    else if (Array.isArray(v)) v.forEach(visit);
    else if (v && typeof v === 'object') Object.values(v).forEach(visit);
  })(doc);
  return out.join('\n');
}

/* Correction and supersession notices quote removed wording on purpose. */
const mentions = [];
for (const feed of ['briefs.json', 'reports.json']) {
  const p = join(DIST, feed);
  if (!existsSync(p)) continue;
  for (const rec of JSON.parse(readFileSync(p, 'utf8'))) {
    for (const key of ['correction', 'supersession']) {
      for (const n of Array.isArray(rec[key]) ? rec[key] : []) if (n && n.summary) mentions.push(plain(n.summary));
    }
  }
}

if (!existsSync(DIST)) { console.error(`ENTITY CHECK FAILED: ${DIST} does not exist — did astro build run?`); process.exit(1); }
const files = [
  ...walk(DIST).filter((f) => TEXT.has(extname(f).toLowerCase())),
  ...['README.md', 'CLAUDE.md'].map((f) => join(ROOT, f)).filter(existsSync),
];

const failures = [];
for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  const ext = extname(file).toLowerCase();
  const text = ext === '.html' ? htmlText(raw) : ext === '.json' || raw.trimStart().startsWith('{') ? jsonText(raw) : raw;
  for (const s of entityViolations(stripMentions(plain(text), mentions))) {
    failures.push(`${relative(ROOT, file)}: ${s.slice(0, 220)}`);
  }
}

if (failures.length) {
  console.error(`ENTITY CHECK FAILED — ${failures.length} sentence(s) attach nonprofit or fiscal-sponsorship status to AICV/.com.\n`
    + `  Canon: .com is a product and service of SunshineFM LLC; sponsorship describes aicoachellavalley.org only.\n`
    + `  Fix by deleting the claim (scripts/entity-rule.mjs). A quoted correction belongs in a correction notice.\n  `
    + [...new Set(failures)].slice(0, 40).join('\n  '));
  process.exit(1);
}
console.log(`entity check ok — ${files.length} shipped files read; no sentence gives AICV nonprofit or sponsorship status (${mentions.length} correction notices treated as mentions)`);
