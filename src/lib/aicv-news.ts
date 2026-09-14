// ════════════════════════════════════════════════════════════════════════════
// AICV NEWS FEED — the subscriber side (founder ruling 2026-09-14). aicv.news
// is the ONE publishing surface; this site pulls from it, never the reverse.
// The homepage shows "Latest from AICV News" as a band of OUTBOUND cards.
// No copies, no .com routes, no rebroadcast: canonical stays at the origin.
//
// Same shape as aicoachellavalley-org's src/lib/aicv-news.ts, on purpose.
// FETCHED AT BUILD TIME over public HTTP — the boundary rule for any external
// dependency: no shared package, no import from the other repo. DEGRADES TO
// NOTHING: on any failure (network, non-200, parse) the band is empty and the
// build STILL SUCCEEDS; it logs loudly instead. A deploy hook fired from
// aicv-news keeps this as fresh as the last publish there.
// ════════════════════════════════════════════════════════════════════════════
export const AICV_NEWS = 'https://aicv.news';
export const FEED_URL = `${AICV_NEWS}/feed.xml`;

export interface AicvNewsItem {
  title: string;
  link: string;
  date: Date;
  description: string;
  /** First <category> — the type label (News / Views / Field Notes). */
  type: string;
}

const unescape = (s: string) =>
  s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").trim();
const tag = (xml: string, name: string) => {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`));
  return m ? unescape(m[1]) : '';
};

export async function latestFromAicvNews(limit = 3): Promise<AicvNewsItem[]> {
  try {
    const res = await fetch(FEED_URL, { signal: AbortSignal.timeout(10000), headers: { 'user-agent': 'aicoachellavalley-com build (subscriber band)' } });
    if (!res.ok) { console.warn(`[aicv-news] feed ${res.status} — band will be empty`); return []; }
    const xml = await res.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
    const out: AicvNewsItem[] = [];
    for (const it of items) {
      const title = tag(it, 'title'); const link = tag(it, 'link'); const pub = tag(it, 'pubDate');
      if (!title || !link || !pub) continue;
      const date = new Date(pub); if (isNaN(date.getTime())) continue;
      out.push({ title, link, date, description: tag(it, 'description'), type: tag(it, 'category') || 'AICV News' });
    }
    out.sort((a, b) => b.date.getTime() - a.date.getTime());
    if (out.length === 0) console.warn('[aicv-news] feed parsed to zero items — band will be empty');
    return out.slice(0, limit);
  } catch (e) {
    console.warn(`[aicv-news] feed unreachable (${(e as Error).message}) — band will be empty`);
    return [];
  }
}
