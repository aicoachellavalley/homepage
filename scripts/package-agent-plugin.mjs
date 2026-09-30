import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const packageRoot = resolve(root, 'plugins/aicv-regional-intelligence');
const files = ['plugin.json', 'mcp.json', 'assets/logo.svg', 'README.md'];

export function validatePlugin(manifest, mcp) {
  if (manifest.$schema !== 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json') throw new Error('Unsupported portable plugin schema.');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest.name) || manifest.name.length > 64) throw new Error('Invalid plugin name.');
  if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) throw new Error('Use an explicit semantic version.');
  const info = manifest.extensions?.['com.openai']?.interface;
  if (!info) throw new Error('Missing listing metadata.');
  for (const key of ['displayName', 'shortDescription']) if (!info[key] || info[key].length > 30) throw new Error(`${key} must be present and no longer than 30 characters.`);
  for (const key of ['websiteURL', 'supportURL', 'privacyPolicyURL', 'termsOfServiceURL']) {
    const url = new URL(info[key]);
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error(`${key} must be public HTTPS without credentials.`);
  }
  for (const p of info.defaultPrompt ?? []) if (p.length > 128) throw new Error('Starter prompt exceeds 128 characters.');
  const review = manifest.extensions['com.openai'].review;
  if (review.test_cases.positive.length !== 5 || review.test_cases.negative.length !== 3) throw new Error('Review requires five positive and three negative cases.');
  for (const c of review.test_cases.positive) if (!c.description || !c.prompt || !c.tools_triggered || !c.expected_behavior) throw new Error('Incomplete positive review case.');
  if (mcp.$schema !== 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json') throw new Error('Unsupported portable MCP schema.');
  const servers = Object.values(mcp.mcpServers ?? {});
  if (servers.length !== 1 || servers[0].type !== 'streamable-http') throw new Error('Declare one streamable HTTP MCP server.');
  validateEndpoint(servers[0].url);
  return true;
}

export function validateEndpoint(endpoint) {
  const u = new URL(endpoint);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(u.hostname);
  if (u.protocol !== 'https:' && !(local && u.protocol === 'http:')) throw new Error('MCP endpoint must use HTTPS, or HTTP on localhost for testing.');
  if (u.username || u.password || u.hash || u.search) throw new Error('Endpoint must not contain credentials, a query or a fragment.');
  return endpoint;
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Uncompressed ZIP: no dependency or platform-specific archive executable needed.
// A fixed DOS date keeps identical source packages byte-for-byte reproducible.
export function buildZip(entries) {
  const local = [], central = [];
  let offset = 0;
  for (const [path, data] of entries) {
    const name = Buffer.from(path, 'utf8'), bytes = Buffer.from(data), checksum = crc32(bytes);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50); header.writeUInt16LE(20, 4); header.writeUInt16LE(0x800, 6);
    header.writeUInt16LE(0x21, 12); header.writeUInt32LE(checksum, 14);
    header.writeUInt32LE(bytes.length, 18); header.writeUInt32LE(bytes.length, 22); header.writeUInt16LE(name.length, 26);
    local.push(header, name, bytes);
    const record = Buffer.alloc(46);
    record.writeUInt32LE(0x02014b50); record.writeUInt16LE(20, 4); record.writeUInt16LE(20, 6); record.writeUInt16LE(0x800, 8);
    record.writeUInt16LE(0x21, 14); record.writeUInt32LE(checksum, 16);
    record.writeUInt32LE(bytes.length, 20); record.writeUInt32LE(bytes.length, 24); record.writeUInt16LE(name.length, 28); record.writeUInt32LE(offset, 42);
    central.push(record, name); offset += header.length + name.length + bytes.length;
  }
  const directory = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, directory, end]);
}

export function packagePlugin({ endpoint, output = resolve(root, 'public/aicv-regional-intelligence-plugin.zip'), publishConfig = !endpoint } = {}) {
  const entries = files.map(path => [path, readFileSync(resolve(packageRoot, path))]);
  const manifest = JSON.parse(entries[0][1]), mcp = JSON.parse(entries[1][1]);
  if (endpoint) { validateEndpoint(endpoint); mcp.mcpServers.aicv.url = endpoint; entries[1][1] = Buffer.from(`${JSON.stringify(mcp, null, 2)}\n`); }
  validatePlugin(manifest, mcp);
  mkdirSync(dirname(output), { recursive: true }); writeFileSync(output, buildZip(entries));
  if (publishConfig) {
    for (const [path, data] of entries) {
      const target = resolve(root, 'public/agent-plugin', path);
      mkdirSync(dirname(target), { recursive: true }); writeFileSync(target, data);
    }
  }
  return output;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), options = {};
  for (let i = 0; i < args.length; i += 2) {
    if (!['--endpoint', '--output'].includes(args[i]) || !args[i + 1]) throw new Error('Usage: node scripts/package-agent-plugin.mjs [--endpoint URL] [--output ZIP_PATH]');
    options[args[i].slice(2)] = args[i + 1];
  }
  console.log(`Built review package: ${packagePlugin(options)}`);
  console.log('Directory publication still requires provider setup, domain verification, reviewer video and approval.');
}
