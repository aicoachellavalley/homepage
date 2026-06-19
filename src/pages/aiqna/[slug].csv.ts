import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Per-finding CSV. Referenced as a text/csv DataDownload in each finding's
// Dataset JSON-LD. A tidy long format: one row per measured value.
export async function getStaticPaths() {
  const entries = await getCollection('aiqna');
  return entries
    .filter((e) => (e.data.type ?? 'finding') === 'finding')
    .map((entry) => ({
      params: { slug: entry.id.replace(/\.mdx$/, '') },
      props: { entry },
    }));
}

function csvCell(v: string | number): string {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export const GET: APIRoute = ({ props }) => {
  const { entry } = props as any;
  const d = entry.data;

  const rows: (string | number)[][] = [['metric', 'label', 'value']];
  for (const r of d.results ?? []) rows.push(['result', r.label, r.pct]);
  if (d.total_responses != null) rows.push(['total', 'Total responses', d.total_responses]);
  for (const c of d.cities ?? []) rows.push(['city_pct_right_call', c.name, c.pct]);

  const csv = rows.map((row) => row.map(csvCell).join(',')).join('\r\n') + '\r\n';

  return new Response(csv, {
    headers: { 'Content-Type': 'text/csv; charset=utf-8' },
  });
};
