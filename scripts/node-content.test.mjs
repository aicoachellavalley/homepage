import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { nodeContent } from './node-content.cjs';

const counts = JSON.parse(readFileSync(new URL('../src/data/stats.json', import.meta.url))).counts;
test('positive control: readable prose, links and late sections survive', () => {
  const source = "---\ntitle: Demo\n---\nimport stats from '../../data/stats.json';\n\n# Demo\n{/* internal */}\nThere are {stats.counts.nodes} nodes.\n\n" + 'Context. '.repeat(400) + '\n\n## Handoff\n[Official page](https://example.com/)';
  const body = nodeContent(source, counts);
  assert.ok(body.length > 2000);
  assert.match(body, new RegExp(`There are ${counts.nodes} nodes`));
  assert.ok(body.endsWith('[Official page](https://example.com/)'));
  assert.doesNotMatch(body, /import stats|internal|stats\.counts|title: Demo/);
});
test('literal fences are not evaluated or stripped, including nested shorter markers', () => {
  const literal = '````mdx\n```\n{/* literal */}\n{stats.counts.nodes}\n```\n````';
  assert.equal(nodeContent(literal, counts), literal);
});
test('negative controls refuse unknown counts and unhandled MDX', () => {
  for (const source of ['{stats.counts.unknown}', '{somethingElse()}', 'import Other from "other";', '<Widget />', '```\nopen fence']) {
    assert.throws(() => nodeContent(source, counts), /Unresolved|Unsupported|Unclosed/);
  }
});
test('every authored node converts; scope derives from the source directory', () => {
  const dir = new URL('../src/content/nodes/', import.meta.url);
  const files = readdirSync(dir).filter(f => f.endsWith('.mdx') && !f.startsWith('_'));
  assert.ok(files.length > 0);
  for (const name of files) {
    const source = readFileSync(new URL(name, dir), 'utf8');
    const body = nodeContent(source, counts);
    assert.ok(body.length > 0, name);
    assert.doesNotMatch(body, /^import |\{stats\.counts\.|\{\/\*/m, name);
    const headings = source.match(/^#{1,6} .+$/gm) || [];
    for (const heading of headings) assert.ok(body.includes(heading), `${name}: lost ${heading}`);
  }
});
