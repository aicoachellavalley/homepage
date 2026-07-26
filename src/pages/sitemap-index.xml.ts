import type { APIRoute } from 'astro';

/**
 * Sitemap index — makes the per-tranche Agent Preview sitemaps discoverable
 * without disturbing /sitemap.xml, which stays exactly as it was (a flat
 * urlset that search engines and the surface-health monitor already consume).
 *
 * The preview sitemaps are served by the aicv-previews worker on the same
 * origin; this index simply points at them. The tranche list is DERIVED from
 * the committed manifests in src/data/previews/ — ship a tranche, sync the
 * manifest, and it appears here. Nothing to hand-edit.
 */
const manifests = import.meta.glob<{ default: { segment: string; sitemap: string; generated?: string } }>(
  '../data/previews/previews-index-*.json',
  { eager: true }
);

export const GET: APIRoute = async () => {
  const entries: string[] = [
    `  <sitemap>
    <loc>https://aicoachellavalley.com/sitemap.xml</loc>
  </sitemap>`,
  ];

  for (const mod of Object.values(manifests)) {
    const m = mod.default;
    if (!m?.sitemap) continue;
    entries.push(`  <sitemap>
    <loc>${m.sitemap}</loc>${m.generated ? `\n    <lastmod>${m.generated}</lastmod>` : ''}
  </sitemap>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</sitemapindex>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
