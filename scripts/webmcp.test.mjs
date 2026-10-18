// WebMCP bridge (src/components/WebMcpTools.astro). Pins the three properties
// the public description of it depends on: it is on every Base page, it only
// runs where the browser offers WebMCP, and it registers read-only tools taken
// from the live desk rather than a list typed here.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const c = read('../src/components/WebMcpTools.astro');

test('Base layout renders the WebMCP bridge', () => {
  assert.match(read('../src/layouts/Base.astro'), /<WebMcpTools \/>/);
});
test('feature-detected: no request unless the browser offers WebMCP', () => {
  assert.match(c, /document as any\)\.modelContext \?\? \(navigator as any\)\.modelContext/);
  assert.match(c, /if \(mc && typeof mc\.registerTool === 'function'\) registerDeskTools\(mc\)/);
});
test('tools come from the desk tools/list and are read-only', () => {
  assert.match(c, /rpc\('tools\/list'\)/);
  assert.match(c, /annotations: \{ readOnlyHint: true \}/);
  assert.doesNotMatch(c, /readOnlyHint: false|consequentialHint: true/);
});
