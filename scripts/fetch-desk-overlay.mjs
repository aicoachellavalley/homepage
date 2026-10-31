// Reads the desks service at build time. A failure leaves the committed fallback in
// place and says so: the desks keep their last real dates rather than failing the build.
import { writeFileSync } from 'node:fs';
const target = new URL('../src/data/desks/overlay.json', import.meta.url);
try {
  if (process.env.AICV_NO_OVERLAY) throw new Error('disabled for this build');
  const branch = process.env.CF_PAGES_BRANCH;
  const base = branch && branch !== 'main' ? (process.env.PREVIEW_DESKS_API || 'https://aicv-desks-preview.sunshinefm.workers.dev') : 'https://aicoachellavalley.com';
  const res = await fetch(`${base}/api/desks/overlay.json`, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data.observations || !Array.isArray(data.supplied) || !data.claims || !data.submissions) throw new Error('unexpected shape');
  writeFileSync(target, JSON.stringify(data));
  console.log(`Desk overlay: ${Object.keys(data.observations).length} observations, ${data.supplied.length} enrolled, ${Object.keys(data.claims).length} claims`);
} catch (error) {
  console.log(`Desk overlay not read (${error.message}); keeping the last committed values.`);
}
