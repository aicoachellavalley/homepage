// Writes the public desk files the MCP desk reads. Fails the build on any record
// that lacks a label, date, source or official contact.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { applyOverlay, assembleDesk, deskProblems, siteOrigin } from './desks.mjs';

const root = new URL('../', import.meta.url).pathname;
const dataDir = resolve(root, 'src/data/desks');
const outDir = resolve(root, 'public/desks');
const meta = JSON.parse(readFileSync(resolve(dataDir, 'desks.json'), 'utf8'));
const overlay = JSON.parse(readFileSync(resolve(dataDir, 'overlay.json'), 'utf8'));
mkdirSync(outDir, { recursive: true });

const index = [];
for (const file of readdirSync(dataDir).filter(f => f.endsWith('.entries.json'))) {
  const slug = file.replace('.entries.json', '');
  const entries = applyOverlay(slug, JSON.parse(readFileSync(resolve(dataDir, file), 'utf8')).entries, overlay);
  const problems = deskProblems(entries);
  if (problems.length) throw new Error(`Desk ${slug} failed:\n${problems.join('\n')}`);
  const desk = assembleDesk(meta, slug, entries);
  writeFileSync(resolve(outDir, `${slug}.json`), JSON.stringify(desk));
  index.push({ slug, title: desk.desk.title, url: desk.desk.url, data: `${siteOrigin()}/desks/${slug}.json`, counts: desk.counts });
}
writeFileSync(resolve(outDir, 'index.json'), JSON.stringify({ network_cap: meta.network_cap, coverage: meta.coverage, desks: index }));
console.log(`Desks written: ${index.map(d => `${d.slug} (${d.counts.records})`).join(', ')}`);
