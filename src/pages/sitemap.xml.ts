import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
// Same .cjs the build script requires — see scripts/brief-dates.cjs and the
// claimed-members.cjs precedent in llms.txt.ts for why a shared module.
import { briefDateModified } from '../../scripts/brief-dates.cjs';
import pageDates from '../data/page-dates.json';
import { latestDate, latestResearchDate } from '../../scripts/research-dates.mjs';

export const GET: APIRoute = async () => {
  const nodes   = await getCollection('nodes');
  const briefs  = await getCollection('briefs');
  const reports = await getCollection('reports');
  const records = await getCollection('records');

  /* STATIC PAGES CARRY A LASTMOD (2026-09-14). Until today only collection
   * pages did. Two AI Search dashboard syncs that day re-fetched every brief
   * whose lastmod had moved and re-fetched no static page, so the corpus
   * served a pre-deploy /get-agent-ready/ for hours after the deploy. The
   * hand-written pages take theirs from src/data/page-dates.json — the same
   * value their own JSON-LD dateModified reads — and the index pages derive
   * theirs from the newest entry they list. The homepage lists briefs and
   * reports, so it moves when either does. A page with no date claim
   * (/cvep-what-happened/) stays without one rather than carrying a guess. */
  const maxDate = (dates: (string | undefined)[]) =>
    dates.filter((d): d is string => !!d).reduce((a, b) => (b > a ? b : a), '') || undefined;
  const briefsLastmod  = maxDate(briefs.map((e) => briefDateModified(e.data)));
  const nodesLastmod   = maxDate(nodes.map((e) => e.data.last_updated));
  const reportsLastmod = maxDate(reports.filter((e) => e.data.status === 'published').map((e) => e.data.date));
  const pd = pageDates as Record<string, string>;
  // This page now displays corpus activity. Keep its crawl date aligned with
  // its JSON-LD when published research advances; never use the build clock.
  const garLastmod = latestDate([pd['/get-agent-ready/'], latestResearchDate({ briefs, nodes, reports, records })]) || undefined;
  const homeLastmod    = maxDate([briefsLastmod, reportsLastmod, ...Object.keys(pd).filter((k) => k.startsWith('/')).map((k) => pd[k])]);

  const staticPages: { url: string; changefreq: string; priority: string; lastmod?: string }[] = [
    { url: 'https://aicoachellavalley.com/',                       changefreq: 'weekly',  priority: '1.0', lastmod: homeLastmod },
    { url: 'https://aicoachellavalley.com/nodes/',                 changefreq: 'weekly',  priority: '0.9', lastmod: nodesLastmod },
    { url: 'https://aicoachellavalley.com/briefs/',                changefreq: 'weekly',  priority: '0.9', lastmod: briefsLastmod },
    { url: 'https://aicoachellavalley.com/reports/',               changefreq: 'weekly',  priority: '0.9', lastmod: reportsLastmod },
    { url: 'https://aicoachellavalley.com/get-agent-ready/',       changefreq: 'monthly', priority: '0.9', lastmod: garLastmod },
    { url: 'https://aicoachellavalley.com/minimum-viable-agent/',  changefreq: 'monthly', priority: '0.8', lastmod: pd['/minimum-viable-agent/'] },
    { url: 'https://aicoachellavalley.com/how-we-do-this/',        changefreq: 'monthly', priority: '0.8', lastmod: pd['/how-we-do-this/'] },
    { url: 'https://aicoachellavalley.com/about/',                 changefreq: 'monthly', priority: '0.8', lastmod: pd['/about/'] },
    { url: 'https://aicoachellavalley.com/cvep-what-happened/',    changefreq: 'monthly', priority: '0.8' },
  ];

  const urlEntries: string[] = [];

  // Static pages
  for (const page of staticPages) {
    urlEntries.push(`  <url>
    <loc>${page.url}</loc>${page.lastmod ? `\n    <lastmod>${page.lastmod}</lastmod>` : ''}
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
