import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Per-finding machine-readable record. Referenced as a DataDownload in each
// finding's Dataset JSON-LD. Findings only — the methodology entry has no
// aggregate data to serialize.
export async function getStaticPaths() {
  const entries = await getCollection('aiqna');
  return entries
    .filter((e) => (e.data.type ?? 'finding') === 'finding')
    .map((entry) => ({
      params: { slug: entry.id.replace(/\.mdx$/, '') },
      props: { entry },
    }));
}

export const GET: APIRoute = ({ props }) => {
  const { entry } = props as any;
  const slug = entry.id.replace(/\.mdx$/, '');
  const d = entry.data;

  const body = {
    slug,
    type: 'finding',
    question_id: d.question_id ?? '',
    question: d.question ?? '',
    title: d.title,
    description: d.description,
    date: d.date,
    status: d.status,
    cadence: d.cadence,
    language: d.language,
    license: d.license,
    total_responses: d.total_responses ?? null,
    results: d.results ?? [],
    cities: d.cities ?? [],
    cloud: d.cloud ?? [],
    quotes: d.quotes ?? [],
    canonical: d.canonical ?? `https://aicoachellavalley.com/aiqna/${slug}/`,
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
