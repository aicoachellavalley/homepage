#!/usr/bin/env node
// build-static-json.js
// Generates public/nodes.json, public/briefs.json, public/snapshots.json,
// and public/reports.json from content files in the com repo.
// Run from ~/AICV/core/com: node scripts/build-static-json.js

const fs = require('fs');
const path = require('path');

const COM_ROOT   = path.resolve(__dirname, '..');
const NODES_DIR  = path.join(COM_ROOT, 'src', 'content', 'nodes');
const BRIEFS_DIR = path.join(COM_ROOT, 'src', 'content', 'briefs');
const SNAPS_DIR  = path.join(COM_ROOT, 'src', 'data', 'snapshots');
const REPORTS_DIR = path.join(COM_ROOT, 'src', 'content', 'reports');
const AIQNA_DIR  = path.join(COM_ROOT, 'src', 'content', 'aiqna');
const PUBLIC_DIR = path.join(COM_ROOT, 'public');

// --- Frontmatter parser (no external deps) ---
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const yaml = match[1];
  const result = {};

  const lines = yaml.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    if (!key) continue;

    // Multiline YAML block array: opener '[' with no closing ']' on this
    // line — pull in following lines until the array closes.
    if (value.startsWith('[') && !value.includes(']')) {
      while (i + 1 < lines.length && !value.includes(']')) {
        value += ' ' + lines[++i].trim();
      }
    }

    // Array: ["a", "b"] or [a, b]
    if (value.startsWith('[')) {
      // Strict pass first: double-quoted frontmatter arrays are valid JSON.
      // The legacy bare-word quoting below corrupts quoted strings that
      // contain commas (e.g. "Verified, Editorial, Unverified") — only fall
      // through to it for arrays that aren't already parseable as-is.
      try {
        result[key] = JSON.parse(value);
        continue;
      } catch { /* not strict JSON — legacy paths below */ }
      try {
        const jsonLike = value
          .replace(/'/g, '"')
          .replace(/(\w[\w-]*)(?=[,\]])/g, '"$1"')
          .replace(/""(\w)/g, '"$1');
        result[key] = JSON.parse(jsonLike);
      } catch {
        result[key] = value.replace(/[\[\]"']/g, '').split(',').map(s => s.trim()).filter(Boolean);
      }
      continue;
    }

    if (value === 'true')  { result[key] = true;  continue; }
    if (value === 'false') { result[key] = false; continue; }

    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      result[key] = value.slice(1, -1);
      continue;
    }

    result[key] = value;
  }

  return result;
}

// --- File walker (MDX) ---
function walkMdx(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMdx(fullPath));
    } else if (entry.name.endsWith('.mdx') && !entry.name.startsWith('_')) {
      files.push(fullPath);
    }
  }
  return files;
}

// --- Body section extractor ---
function extractSection(content, sectionName) {
  const body = content.replace(/^---[\s\S]*?---\n/, '');
  const pattern = new RegExp(
    `##\\s+${sectionName}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`,
    'i'
  );
  const match = body.match(pattern);
  if (!match) return '';

  let text = match[1];
  text = text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^#+\s+/gm, '')
    .replace(/\{\/\*.*?\*\/\}/gs, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return text;
}

// --- Build nodes.json ---
function buildNodes() {
  const files = walkMdx(NODES_DIR);
  const nodes = [];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fm = parseFrontmatter(content);
    if (!fm.title) continue;

    const slug = path.basename(filePath, '.mdx');

    nodes.push({
      slug,
      title: fm.title || '',
      description: fm.description || '',
      agent_summary: fm.agent_summary || '',
      city: fm.city || '',
      category: fm.category || '',
      subcategory: fm.subcategory || '',
      status: fm.status || '',
      verified: fm.verified === true || fm.verified === 'true',
      agent_intent: Array.isArray(fm.agent_intent) ? fm.agent_intent : [],
      domain: fm.domain || '',
      funnel_stages: Array.isArray(fm.funnel_stages) ? fm.funnel_stages : [],
      last_updated: fm.last_updated || '',
    });
  }

  nodes.sort((a, b) => {
    if (a.city < b.city) return -1;
    if (a.city > b.city) return 1;
    return a.title.localeCompare(b.title);
  });

  return nodes;
}

// --- Build briefs.json ---
function buildBriefs() {
  const files = walkMdx(BRIEFS_DIR);
  const briefs = [];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fm = parseFrontmatter(content);
    if (!fm.title) continue;

    const slug = path.basename(filePath, '.mdx');

    briefs.push({
      slug,
      title: fm.title || '',
      description: fm.description || '',
      date: fm.date || '',
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      signal: extractSection(content, 'Signal'),
      agent_signal: extractSection(content, 'Agent Signal'),
      context: extractSection(content, 'Context'),
    });
  }

  briefs.sort((a, b) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return 0;
  });

  return briefs;
}

// --- Build snapshots.json ---
function buildSnapshots(nodeSlugs) {
  if (!fs.existsSync(SNAPS_DIR)) return [];
  const snapshots = [];

  for (const fname of fs.readdirSync(SNAPS_DIR)) {
    if (!fname.endsWith('.json') || fname.startsWith('_')) continue;
    const raw = fs.readFileSync(path.join(SNAPS_DIR, fname), 'utf8');
    let data;
    try { data = JSON.parse(raw); } catch { continue; }

    const slug = data.slug || fname.replace('.json', '');
    const nodeSlug = nodeSlugs.has(slug) ? slug : null;

    snapshots.push({
      slug,
      entityName:       data.entityName       || '',
      metaTitle:        data.metaTitle         || '',
      metaDescription:  data.metaDescription   || '',
      datePublished:    data.datePublished      || '',
      dateModified:     data.dateModified       || '',
      snapshotLocation: data.snapshotLocation   || '',
      snapshotPeriod:   data.snapshotPeriod     || '',
      grades:           data.grades             || {},
      opener:           data.opener             || {},
      findings:         data.findings           || [],
      actions:          data.actions            ?? null,
      top_gaps:         data.top_gaps           ?? null,
      nodeSlug,
    });
  }

  snapshots.sort((a, b) => {
    if (a.datePublished > b.datePublished) return -1;
    if (a.datePublished < b.datePublished) return 1;
    return 0;
  });

  return snapshots;
}

// --- Build reports.json ---
function buildReports() {
  const files = walkMdx(REPORTS_DIR);
  const reports = [];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fm = parseFrontmatter(content);
    if (!fm.title) continue;
    if (fm.status !== 'published') continue;

    const slug = path.basename(filePath, '.mdx');

    reports.push({
      slug,
      title:       fm.title       || '',
      description: fm.description || '',
      date:        fm.date        || '',
      period:      fm.period      || '',
      report_type: fm.report_type || '',
      tags:        Array.isArray(fm.tags)     ? fm.tags     : [],
      sections:    Array.isArray(fm.sections) ? fm.sections : [],
      canonical:   fm.canonical   || '',
    });
  }

  reports.sort((a, b) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return 0;
  });

  return reports;
}

// --- Build aiqna.json ---
// The AIQnA corpus index: the methodology entry first, then weekly findings
// reverse-chronologically. Same flat-metadata shape as reports.json. The rich
// per-finding display data (results, cities, quotes) lives in the .mdx
// frontmatter and is rendered by the Astro pages; the index stays lightweight.
function buildAiqna() {
  const files = walkMdx(AIQNA_DIR);
  const entries = [];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fm = parseFrontmatter(content);
    if (!fm.title) continue;

    const slug = path.basename(filePath, '.mdx');
    const type = fm.type || (slug === 'methodology' ? 'methodology' : 'finding');
    const url = type === 'methodology'
      ? 'https://aicoachellavalley.com/aiqna'
      : `https://aicoachellavalley.com/aiqna/${slug}/`;

    entries.push({
      slug,
      type,
      title:       fm.title       || '',
      description: fm.description || '',
      date:        fm.date        || '',
      status:      fm.status      || '',
      cadence:     fm.cadence     || 'weekly',
      language:    fm.language    || 'en',
      license:     fm.license     || 'CC-BY-4.0',
      question_id: fm.question_id || '',
      url,
    });
  }

  // Methodology pinned first; findings reverse-chronological after it.
  entries.sort((a, b) => {
    if (a.type === 'methodology') return -1;
    if (b.type === 'methodology') return 1;
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return 0;
  });

  return entries;
}

// --- Schema validation ---
const BRIEF_AGENT_SIGNAL_CUTOFF = '2026-03-01';

function validate(nodes, briefs) {
  let warnings = 0;

  const NODE_REQUIRED = ['agent_summary', 'agent_intent', 'status', 'verified', 'domain', 'funnel_stages'];
  for (const node of nodes) {
    for (const field of NODE_REQUIRED) {
      const val = node[field];
      const empty =
        val === '' ||
        val === false ||
        (Array.isArray(val) && val.length === 0) ||
        val === null ||
        val === undefined;
      if (empty) {
        console.warn(`WARN: ${node.slug} missing ${field}`);
        warnings++;
      }
    }
  }

  for (const brief of briefs) {
    if (brief.date >= BRIEF_AGENT_SIGNAL_CUTOFF && !brief.slug.includes('also-noted')) {
      if (!brief.agent_signal || brief.agent_signal === '') {
        console.warn(`WARN: ${brief.slug} missing agent_signal`);
        warnings++;
      }
    }
  }

  const eligibleBriefs = briefs.filter(
    b => b.date >= BRIEF_AGENT_SIGNAL_CUTOFF && !b.slug.includes('also-noted')
  );

  if (warnings === 0) {
    console.log(`Validation — ${nodes.length} nodes clean, ${eligibleBriefs.length} briefs clean`);
  } else {
    console.log(`Validation — ${warnings} warning${warnings === 1 ? '' : 's'} found`);
  }
}

// --- llms-full.txt generator ---
function generateLlmsFullTxt() {
  const timestamp = new Date().toISOString();

  // Substitute {stats.counts.X} MDX expressions with their live values from
  // src/data/stats.json — the same file nodes import — so the flat-text dump
  // shows the rendered number instead of leaking the literal expression into
  // the agent-facing export. Sourcing from stats.json (not a parallel count)
  // means llms-full.txt can never silently diverge from the rendered page.
  // Unknown keys fall through unchanged.
  let statsCounts = {};
  try {
    statsCounts = JSON.parse(
      fs.readFileSync(path.join(COM_ROOT, 'src', 'data', 'stats.json'), 'utf8')
    ).counts || {};
  } catch { /* stats.json absent (run outside the build) — leave expressions as-is */ }
  const renderExpr = (text) =>
    text.replace(/\{\s*stats\.counts\.(\w+)\s*\}/g, (m, key) =>
      statsCounts[key] != null ? String(statsCounts[key]) : m);

  // Nodes — sorted alphabetically by slug
  const nodeFiles = walkMdx(NODES_DIR).sort((a, b) =>
    path.basename(a).localeCompare(path.basename(b))
  );

  // Briefs — sorted reverse-chronologically by filename
  const briefFiles = walkMdx(BRIEFS_DIR).sort((a, b) =>
    path.basename(b).localeCompare(path.basename(a))
  );

  // Reports — published only, sorted reverse-chronologically by frontmatter date
  // (matches the /reports/ index page sort and buildReports() behavior).
  // Added 2026-06-05; reports were previously absent from the LLM-facing dump.
  const reportFiles = walkMdx(REPORTS_DIR)
    .map(filePath => ({ filePath, fm: parseFrontmatter(fs.readFileSync(filePath, 'utf8')) }))
    .filter(({ fm }) => fm.status === 'published')
    .sort((a, b) => (a.fm.date > b.fm.date ? -1 : a.fm.date < b.fm.date ? 1 : 0))
    .map(({ filePath }) => filePath);

  const nodeSections = nodeFiles.map(filePath => {
    const slug = path.basename(filePath, '.mdx');
    const content = fs.readFileSync(filePath, 'utf8');
    return `## node: ${slug}\n\n${renderExpr(content.trim())}`;
  });

  const briefSections = briefFiles.map(filePath => {
    const slug = path.basename(filePath, '.mdx');
    const content = fs.readFileSync(filePath, 'utf8');
    return `## brief: ${slug}\n\n${renderExpr(content.trim())}`;
  });

  const reportSections = reportFiles.map(filePath => {
    const slug = path.basename(filePath, '.mdx');
    const content = fs.readFileSync(filePath, 'utf8');
    return `## report: ${slug}\n\n${renderExpr(content.trim())}`;
  });

  const header = [
    `# AI Coachella Valley — Full Content Dump`,
    `# Generated: ${timestamp}`,
    `# Nodes: ${nodeSections.length} | Briefs: ${briefSections.length} | Reports: ${reportSections.length}`,
    `# https://aicoachellavalley.com`,
  ].join('\n');

  // Order: header → reports (long-form research; highest signal density) →
  // nodes (canonical entities) → briefs (chronological intelligence stream).
  // Snapshots are intentionally excluded: they are JSON, not MDX, and would
  // require a separate formatting pass to render as readable text.
  const output = [header, ...reportSections, ...nodeSections, ...briefSections].join('\n\n---\n\n');

  /* ── Size guard, two tiers (added 2026-07-31) ──────────────────────────────
   *
   * CHECKED BEFORE THE WRITE, deliberately. On a FAIL the previous build's
   * llms-full.txt survives on disk rather than being replaced by a bad one.
   * Stale is recoverable; corrupt is not. Note this is NOT fail-before-write in
   * the sense the nodes/briefs guard above is — by the time this runs, all five
   * JSON files have already been written, so public/ ends up mixed either way.
   * The choice here is which mixed state, not whether to have one.
   *
   * Thresholds derived from measured growth, not picked round:
   *   at the time of writing  1.51 MB
   *   after the planned standalone-page migration  ~1.70 MB
   *   organic growth ~0.75 MB/yr at steady cadence — ~13 briefs/mo at 3.9 KB
   *   each, ~5 reports/yr at 24.4 KB, ~5 nodes/yr at 6.7 KB (all measured).
   *
   * WARN 3 MB — roughly 17 months of runway from the post-migration base.
   *   Far enough not to nag, near enough that it fires while there is still a
   *   year to decide what to do. Never breaks a build.
   *
   * FAIL 6 MB — ~5.7 years at steady cadence; 3.9x the size at the time it was
   *   set. This tier is NOT for slow growth; WARN covers that with years of
   *   notice. It exists to catch a generator bug that MULTIPLIES the output —
   *   a duplicated loop, a double-append, an accidental corpus re-emit. Those
   *   clear 6 MB instantly, while a year of honest publishing does not. Set
   *   lower, it would eventually break a legitimate build and get edited under
   *   pressure, which is the failure mode this design is avoiding.
   *
   * Neither tier is platform-driven: Cloudflare Pages caps a single asset at
   * 25 MiB, ~15x current size. Both tiers are editorial judgement.
   *
   * The unconditional gauge line below matters more than either threshold.
   * This file reached 1.51 MB unnoticed because the old line printed KB only,
   * with nothing to measure against. It now prints every build, pass or fail,
   * in MB against the ceiling.
   */
  const LLMS_FULL_WARN_BYTES = 3 * 1024 * 1024;
  const LLMS_FULL_FAIL_BYTES = 6 * 1024 * 1024;

  const outputBytes = Buffer.byteLength(output, 'utf8');
  const outputMb    = (outputBytes / 1024 / 1024).toFixed(2);

  console.log(`llms-full.txt  — ${nodeSections.length} nodes, ${briefSections.length} briefs, ${reportSections.length} reports — ${outputMb} MB of 6 MB ceiling (warn at 3 MB)`);

  if (outputBytes > LLMS_FULL_FAIL_BYTES) {
    console.error(`ERROR: llms-full.txt is ${outputMb} MB, exceeds the 6 MB ceiling — NOT written, the previous build's file is left in place`);
    process.exit(1);
  }

  if (outputBytes > LLMS_FULL_WARN_BYTES) {
    console.warn(`WARN: llms-full.txt is ${outputMb} MB, past the 3 MB review threshold — still written; build fails at 6 MB`);
  }

  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms-full.txt'), output, 'utf8');
}

// --- IndexNow submission ---
async function submitToIndexNow(urls) {
  // IndexNow key: strict Option 1 — {key}.txt served at the site root, so the
  // protocol's default keyLocation (https://host/{key}.txt) is used; no explicit
  // keyLocation field needed. Reset 2026-06-12 to a fresh hex key (the prior
  // aicv-indexnow-2026 key 403'd "UserForbiddedToAccessSite" — negative-cache
  // legacy from months the keyLocation served 404). Key file: public/<key>.txt.
  const payload = {
    host: "aicoachellavalley.com",
    key: "a0637c7110a38cb16503aceee7e1a289",
    urlList: urls
  };

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload)
  });

  console.log(`IndexNow: ${response.status} — ${urls.length} URLs submitted`);
}

// --- Main ---
async function main() {
  // Ensure public/ exists
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  const nodes    = buildNodes();
  const briefs   = buildBriefs();

  // Build set of node slugs for snapshot nodeSlug lookup
  const nodeSlugs = new Set(nodes.map(n => n.slug));

  const snapshots = buildSnapshots(nodeSlugs);
  const reports   = buildReports();
  const aiqna     = buildAiqna();

  // Serialize
  const nodesJson     = JSON.stringify(nodes,     null, 2);
  const briefsJson    = JSON.stringify(briefs,    null, 2);
  const snapshotsJson = JSON.stringify(snapshots, null, 2);
  const reportsJson   = JSON.stringify(reports,   null, 2);
  const aiqnaJson     = JSON.stringify(aiqna,     null, 2);

  // Size guard
  const nodesSize  = Buffer.byteLength(nodesJson,  'utf8');
  const briefsSize = Buffer.byteLength(briefsJson, 'utf8');
  if (nodesSize  > 2 * 1024 * 1024) { console.error('ERROR: nodes.json exceeds 2MB');  process.exit(1); }
  if (briefsSize > 2 * 1024 * 1024) { console.error('ERROR: briefs.json exceeds 2MB'); process.exit(1); }

  // Write
  fs.writeFileSync(path.join(PUBLIC_DIR, 'nodes.json'),     nodesJson,     'utf8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'briefs.json'),    briefsJson,    'utf8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'snapshots.json'), snapshotsJson, 'utf8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'reports.json'),   reportsJson,   'utf8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'aiqna.json'),     aiqnaJson,     'utf8');

  console.log(`nodes.json     — ${nodes.length} nodes     (${(nodesSize  / 1024).toFixed(1)} KB)`);
  console.log(`briefs.json    — ${briefs.length} briefs   (${(briefsSize / 1024).toFixed(1)} KB)`);
  console.log(`snapshots.json — ${snapshots.length} snapshots`);
  console.log(`reports.json   — ${reports.length} published reports`);
  console.log(`aiqna.json     — ${aiqna.length} entries (methodology + findings)`);
  console.log(`Output: public/`);

  validate(nodes, briefs);

  generateLlmsFullTxt();

  await submitToIndexNow([
    "https://aicoachellavalley.com/nodes.json",
    "https://aicoachellavalley.com/briefs.json",
    "https://aicoachellavalley.com/snapshots.json",
    "https://aicoachellavalley.com/reports.json",
    "https://aicoachellavalley.com/aiqna.json",
  ]);
}

main();
