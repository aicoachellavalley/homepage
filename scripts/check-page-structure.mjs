// Inspect built HTML: collection titles must render once, and local links must
// resolve without executing JavaScript. Preview routes belong to the separate
// preview service and are outside this static build's verification scope.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { parse } from 'parse5';

const root = new URL('../', import.meta.url).pathname;
const dist = resolve(root, 'dist');
const origin = 'https://aicoachellavalley.com';
const walkFiles = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walkFiles(join(dir, e.name)) : [join(dir, e.name)]);
const walkNodes = node => [node, ...(node.childNodes || []).flatMap(walkNodes)];
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
const pages = new Map();
const failures = [];

for (const file of walkFiles(dist).filter(f => f.endsWith('.html'))) {
  const relative = file.slice(dist.length);
  const pathname = relative.endsWith('/index.html') ? relative.slice(0, -10) : relative;
  const nodes = walkNodes(parse(readFileSync(file, 'utf8')));
  const h1s = nodes.filter(n => n.tagName === 'h1');
  if (h1s.length > 1) failures.push(`${pathname}: ${h1s.length} H1s`);
  if (/^\/(briefs|nodes|reports)\/[^/]+\/$/.test(pathname) && h1s.length !== 1) {
    failures.push(`${pathname}: expected one collection-page title`);
  }
  pages.set(pathname, {
    ids: new Set(nodes.map(n => attr(n, 'id')).filter(Boolean)),
    links: nodes.filter(n => n.tagName === 'a').map(n => attr(n, 'href')).filter(Boolean),
  });
}
if (!pages.size) throw new Error('No built HTML pages — run after astro build');

const redirects = new Map();
for (const line of readFileSync(resolve(root, 'public/_redirects'), 'utf8').split('\n')) {
  if (line.trim().startsWith('#')) continue;
  const [from, to, code] = line.trim().split(/\s+/);
  if (from && /^30[1278]$/.test(code || '')) redirects.set(from, to);
}
const existingFile = path => existsSync(path) && statSync(path).isFile();
let checkedLinks = 0;
for (const [pathname, page] of pages) {
  for (const href of page.links) {
    const url = new URL(href, origin + pathname);
    if (url.origin !== origin) continue;
    // Served by a different Worker; absence from dist is not a broken link.
    if (/^\/agent-preview(?:\/|$)/.test(url.pathname)) continue;
    // These routes are compiled from functions/ by Cloudflare Pages, rather
    // than emitted as static HTML. Require their source, not a blanket skip.
    const runtimeSources = { '/mcp': 'functions/mcp.js', '/api/resolve-local-intent': 'functions/api/resolve-local-intent.js', '/api/usage': 'functions/api/usage.js' };
    if (runtimeSources[url.pathname] && existsSync(resolve(root, runtimeSources[url.pathname]))) continue;
    let targetPath = decodeURIComponent(url.pathname);
    const seen = new Set();
    while (redirects.has(targetPath) && !seen.has(targetPath)) {
      seen.add(targetPath);
      targetPath = redirects.get(targetPath);
    }
    if (seen.has(targetPath)) { failures.push(`${pathname}: redirect loop at ${href}`); continue; }
    checkedLinks++;
    const target = pages.get(targetPath) || pages.get(targetPath.replace(/\/$/, '') + '/');
    const path = resolve(dist, '.' + targetPath);
    if (!target && !existingFile(path) && !existingFile(join(path, 'index.html'))) {
      failures.push(`${pathname}: missing route ${href}`);
    } else if (target && url.hash && !target.ids.has(decodeURIComponent(url.hash.slice(1)))) {
      failures.push(`${pathname}: missing anchor ${href}`);
    }
  }
}
if (failures.length) throw new Error(`Page structure check failed (${failures.length}):\n${failures.slice(0, 25).join('\n')}`);
console.log(`page structure check ok — ${pages.size} HTML pages, ${checkedLinks} static internal links; no duplicate H1s or missing destinations (separate preview service excluded)`);
