import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { packagePlugin, validatePlugin, validateEndpoint } from './package-agent-plugin.mjs';

const base = new URL('../plugins/aicv-regional-intelligence/', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('plugin.json', base)));
const mcp = JSON.parse(readFileSync(new URL('mcp.json', base)));

test('distribution package uses its real public endpoint and complete reviewer cases', () => {
  assert.equal(validatePlugin(manifest, mcp), true);
  assert.equal(mcp.mcpServers.aicv.url, 'https://aicoachellavalley.com/mcp');
  assert.equal(manifest.extensions['com.openai'].review.commerce, false);
  assert.equal(manifest.extensions['com.openai'].review.demo_recording_url, undefined);
  assert.equal(manifest.extensions['com.openai'].apps, undefined);
});

test('preview overrides cannot smuggle credentials or change production source', () => {
  for (const invalid of ['https://user:secret@example.com/mcp', 'javascript:alert(1)', 'http://example.com/mcp', 'https://example.com/mcp?token=secret']) assert.throws(() => validateEndpoint(invalid));
  const dir = mkdtempSync(join(tmpdir(), 'aicv-plugin-'));
  try {
    const before = readFileSync(new URL('mcp.json', base), 'utf8');
    const output = packagePlugin({ endpoint: 'https://preview.example/mcp', output: join(dir, 'preview.zip') });
    const inspect = spawnSync('python3', ['-c', 'import zipfile,json,sys; z=zipfile.ZipFile(sys.argv[1]); assert z.testzip() is None; print(json.dumps({"names":z.namelist(),"endpoint":json.loads(z.read("mcp.json"))["mcpServers"]["aicv"]["url"]}))', output], { encoding: 'utf8' });
    assert.equal(inspect.status, 0, inspect.stderr);
    const archive = JSON.parse(inspect.stdout);
    assert.equal(archive.endpoint, 'https://preview.example/mcp');
    assert.deepEqual(archive.names, ['plugin.json', 'mcp.json', 'assets/logo.svg', 'README.md']);
    assert.equal(readFileSync(new URL('mcp.json', base), 'utf8'), before);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
