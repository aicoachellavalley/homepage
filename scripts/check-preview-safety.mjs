// Fails the build if a preview could take real money or a production build could
// point at preview resources. Scans everything that ships, not a list of pages.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const root = new URL('../', import.meta.url).pathname;
const cfg = JSON.parse(readFileSync(join(root, 'src/data/desks/preview.json'), 'utf8'));
const branch = process.env.CF_PAGES_BRANCH;
const preview = Boolean(branch && branch !== 'main');
const walk = d => readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]);
const banned = preview ? ['buy.stripe.com/6oUf'] : [cfg.stripe_test_link, cfg.site_origin, cfg.desks_api, cfg.mcp, cfg.activate, '1x00000000000000000000AA'];
const hits = [];
for (const file of walk(join(root, 'dist')).filter(f => /\.(html|json|txt|xml|js)$/.test(f))) {
  const text = readFileSync(file, 'utf8');
  for (const value of banned) if (text.includes(value)) hits.push(`${file.slice(root.length)}: ${value}`);
}
if (!preview && walk(join(root, 'dist')).some(f => f.includes('preview-fixtures'))) hits.push('dist/preview-fixtures: fictional pages in a production build');
if (hits.length) { console.error(`PREVIEW SAFETY FAILED (${preview ? 'preview' : 'production'} build):\n${hits.slice(0, 20).join('\n')}`); process.exit(1); }
console.log(`preview safety ok — ${preview ? 'preview build carries no live payment link' : 'production build carries no preview resource'}`);
