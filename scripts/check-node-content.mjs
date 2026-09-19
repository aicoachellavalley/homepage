// Post-build parity gate: derive scope from the metadata index, compare the
// machine record against the actual rendered human page, not another regex.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'parse5';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';
const read = path => readFileSync(new URL(`../dist/${path}`, import.meta.url), 'utf8');
const index = JSON.parse(read('nodes.json'));
const walk = n => [n, ...(n.childNodes || []).flatMap(walk)];
const htmlText = n => n.nodeName === '#text' ? n.value : (n.childNodes || []).map(htmlText).join('');
const mdText = n => ['text', 'code', 'inlineCode'].includes(n.type) ? n.value : (n.children || []).map(mdText).join('');
const normalize = s => s.replace(/\s+/g, '');
// Match Astro's existing typography transform; apostrophe style is not drift.
const parser = unified().use(remarkParse).use(remarkGfm).use(remarkSmartypants);
const textOf = record => normalize(mdText(parser.runSync(parser.parse(record.content))));
const same = (record, human) => assert.equal(textOf(record), normalize(human));

// Controls must exercise the same comparison as the corpus pass.
same({ content: '# Example\n\nA **clear** record.' }, 'ExampleA clear record.');
assert.throws(() => same({ content: '# Example\n\nA wrong record.' }, 'ExampleA clear record.'));
const dump = read('llms-full.txt');
let maximum = 0;
for (const node of index) {
  const record = JSON.parse(read(`nodes/${node.slug}.json`));
  assert.equal(record.slug, node.slug);
  assert.equal(record.canonical, `https://aicoachellavalley.com/nodes/${node.slug}/`);
  assert.equal(record.title, node.title);
  assert.equal(record.last_updated, node.last_updated);
  const doc = walk(parse(read(`nodes/${node.slug}/index.html`)));
  const body = doc.find(n => n.attrs?.some(a => a.name === 'class' && a.value.split(/\s+/).includes('node-body')));
  assert.ok(body, `No rendered node body: ${node.slug}`);
  const machine = textOf(record), human = normalize(htmlText(body));
  if (machine !== human) {
    let at = 0;
    while (machine[at] === human[at] && at < Math.min(machine.length, human.length)) at++;
    throw new Error(`${node.slug}: rendered text differs at ${at}: machine=${JSON.stringify(machine.slice(at, at + 100))}, human=${JSON.stringify(human.slice(at, at + 100))}`);
  }
  const dumpSection = dump.split(`## node: ${node.slug}\n\n`)[1]?.split(/\n\n---\n\n## (?:node|brief|report):/)[0];
  assert.ok(dumpSection?.trim().endsWith(record.content), `Bulk dump disagrees: ${node.slug}`);
  maximum = Math.max(maximum, Buffer.byteLength(JSON.stringify(record)));
}
console.log(`node content check ok — ${index.length} complete records agree with rendered pages and bulk dump; largest ${maximum} bytes; positive/negative controls passed`);
