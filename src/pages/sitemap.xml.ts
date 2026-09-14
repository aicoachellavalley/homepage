import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
// Same .cjs the build script requires — see scripts/brief-dates.cjs and the
// claimed-members.cjs precedent in llms.txt.ts for why a shared module.
import { briefDateModified } from '../../scripts/brief-dates.cjs';

export const GET: APIRoute = async () => {
  const nodes   = await getCollection('nodes');
  const briefs  = await getCollection('briefs');
  const reports = await getCollection('reports');

  const staticPages = [
    { url: 'https://aicoachellavalley.com/',                       changefreq: 'weekly',  priority: '1.0' },
    { url: 'https://aicoachellavalley.com/nodes/',                 changefreq: 'weekly',  priority: '0.9' },
    { url: 'https://aicoachellavalley.com/briefs/',                changefreq: 'weekly',  priority: '0.9' },
    { url: 'https://aicoachellavalley.com/reports/',               changefreq: 'weekly',  priority: '0.9' },
    { url: 'https://aicoachellavalley.com/get-agent-ready/',       changefreq: 'monthly', priority: '0.9' },
    { url: 'https://aicoachellavalley.com/minimum-viable-agent/',  changefreq: 'monthly', priority: '0.8' },
    { url: 'https://aicoachellavalley.com/how-we-do-this/',        changefreq: 'monthly', priority: '0.8' },
    { url: 'https://aicoachellavalley.com/cvep-what-happened/',    changefreq: 'monthly', priority: '0.8' },
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

  // Briefs — lastmod is the latest event on the record (publication, or a
  // later correction/supersession), derived by the same helper the brief page
  // and briefs.json use. Before 2026-09-14 this reused the publication date,
  // so an amended brief told crawlers it had not changed.
  for (const entry of briefs) {
    const slug    = entry.id.replace(/\.mdx$/, '');
    const lastmod = briefDateModified(entry.data);
    urlEntries.push(`  <url>
    <loc>https://aicoachellavalley.com/briefs/${slug}/</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
  }

  // Reports
  for (const entry of reports) {
    if (entry.data.status !== 'published') continue;
    const slug    = entry.id.replace(/\.mdx$/, '');
    const lastmod = entry.data.date;
    urlEntries.push(`  <url>
    <loc>https://aicoachellavalley.com/reports/${slug}/</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
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
