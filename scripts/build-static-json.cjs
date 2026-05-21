#!/usr/bin/env node
// build-static-json.js
// Generates public/nodes.json, public/briefs.json, public/snapshots.json,
// and public/reports.json from content files in the com repo.
// Run from ~/Projects/com: node scripts/build-static-json.js

const fs = require('fs');
const path = require('path');

const COM_ROOT   = path.resolve(__dirname, '..');
const NODES_DIR  = path.join(COM_ROOT, 'src', 'content', 'nodes');
const BRIEFS_DIR = path.join(COM_ROOT, 'src', 'content', 'briefs');
const SNAPS_DIR  = path.join(COM_ROOT, 'src', 'data', 'snapshots');
const REPORTS_DIR = path.join(COM_ROOT, 'src', 'content', 'reports');
const PUBLIC_DIR = path.join(COM_ROOT, 'public');

// --- Frontmatter parser (no external deps) ---
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const yaml = match[1];
  const result = {};

  for (const line of yaml.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    if (!key) continue;

    // Array: ["a", "b"] or [a, b]
    if (value.startsWith('[')) {
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

  // Nodes — sorted alphabetically by slug
  const nodeFiles = walkMdx(NODES_DIR).sort((a, b) =>
    path.basename(a).localeCompare(path.basename(b))
  );

  // Briefs — sorted reverse-chronologically by filename
  const briefFiles = walkMdx(BRIEFS_DIR).sort((a, b) =>
    path.basename(b).localeCompare(path.basename(a))
  );

  const nodeSections = nodeFiles.map(filePath => {
    const slug = path.basename(filePath, '.mdx');
    const content = fs.readFileSync(filePath, 'utf8');
    return `## node: ${slug}\n\n${content.trim()}`;
  });

  const briefSections = briefFiles.map(filePath => {
    const slug = path.basename(filePath, '.mdx');
    const content = fs.readFileSync(filePath, 'utf8');
    return `## brief: ${slug}\n\n${content.trim()}`;
  });

  const header = [
    `# AI Coachella Valley — Full Content Dump`,
    `# Generated: ${timestamp}`,
    `# Nodes: ${nodeSections.length} | Briefs: ${briefSections.length}`,
    `# https://aicoachellavalley.com`,
  ].join('\n');

  const output = [header, ...nodeSections, ...briefSections].join('\n\n---\n\n');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms-full.txt'), output, 'utf8');

  const sizeKb = (Buffer.byteLength(output, 'utf8') / 1024).toFixed(1);
  console.log(`llms-full.txt  — ${nodeSections.length} nodes, ${briefSections.length} briefs (${sizeKb} KB)`);
}

// --- IndexNow submission ---
async function submitToIndexNow(urls) {
  const payload = {
    host: "aicoachellavalley.com",
    key: "aicv-indexnow-2026",
    keyLocation: "https://aicoachellavalley.com/aicv-indexnow-2026.txt",
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

  // Serialize
  const nodesJson     = JSON.stringify(nodes,     null, 2);
  const briefsJson    = JSON.stringify(briefs,    null, 2);
  const snapshotsJson = JSON.stringify(snapshots, null, 2);
  const reportsJson   = JSON.stringify(reports,   null, 2);

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

  console.log(`nodes.json     — ${nodes.length} nodes     (${(nodesSize  / 1024).toFixed(1)} KB)`);
  console.log(`briefs.json    — ${briefs.length} briefs   (${(briefsSize / 1024).toFixed(1)} KB)`);
  console.log(`snapshots.json — ${snapshots.length} snapshots`);
  console.log(`reports.json   — ${reports.length} published reports`);
  console.log(`Output: public/`);

  validate(nodes, briefs);

  generateLlmsFullTxt();

  await submitToIndexNow([
    "https://aicoachellavalley.com/nodes.json",
    "https://aicoachellavalley.com/briefs.json",
    "https://aicoachellavalley.com/snapshots.json",
    "https://aicoachellavalley.com/reports.json",
  ]);
}

main();
