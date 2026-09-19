import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import stats from '../../data/stats.json';
import { nodeContent } from '../../../scripts/node-content.cjs';

// Same collection, same stats, same build as the human page. The metadata index
// stays small; tools fetch a complete body only for the node they need.
export async function getStaticPaths() {
  return (await getCollection('nodes')).map(entry => ({
    params: { slug: entry.id.replace(/\.mdx$/, '') },
    props: { entry },
  }));
}

export const GET: APIRoute = ({ props }) => {
  const { entry } = props;
  const slug = entry.id.replace(/\.mdx$/, '');
  const content = nodeContent(entry.body, stats.counts);
  const body = JSON.stringify({
    slug,
    title: entry.data.title,
    description: entry.data.description,
    last_updated: entry.data.last_updated,
    canonical: `https://aicoachellavalley.com/nodes/${slug}/`,
    content_type: 'text/markdown',
    content,
  });
  // A corrupt generator must not publish a giant or empty record. Never slice.
  if (!content || new TextEncoder().encode(body).length > 128 * 1024) {
    throw new Error(`Invalid node content size: ${slug}`);
  }
  return new Response(body, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
