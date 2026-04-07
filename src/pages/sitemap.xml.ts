import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const nodes  = await getCollection('nodes');
  const briefs = await getCollection('briefs');

  const staticPages = [
    { url: 'https://aicoachellavalley.com/',        changefreq: 'weekly',  priority: '1.0' },
    { url: 'https://aicoachellavalley.com/nodes/',  changefreq: 'weekly',  priority: '0.9' },
    { url: 'https://aicoachellavalley.com/briefs/', changefreq: 'daily',   priority: '0.9' },
  ];

  const snapshots = [
    'visit-greater-palm-springs',
    'gardens-on-el-paseo',
  ];

  const urlEntries: string[] = [];

  // Static pages
  for (const page of staticPages) {
    urlEntries.push(`  <url>
    <loc>${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
  }

  // Nodes
  for (const entry of nodes) {
    const slug    = entry.id.replace(/\.mdx$/, '');
    const lastmod = entry.data.last_updated;
    urlEntries.push(`  <url>
    <loc>https://aicoachellavalley.com/nodes/${slug}/</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }

  // Briefs
  for (const entry of briefs) {
    const slug    = entry.id.replace(/\.mdx$/, '');
    const lastmod = entry.data.date;
    urlEntries.push(`  <url>
    <loc>https://aicoachellavalley.com/briefs/${slug}/</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
  }

  // Snapshots
  for (const slug of snapshots) {
    urlEntries.push(`  <url>
    <loc>https://aicoachellavalley.com/snapshots/${slug}/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
