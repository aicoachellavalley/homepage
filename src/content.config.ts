import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const briefs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/briefs' }),
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    date:        z.string(),
    tags:        z.array(z.string()).default([]),
  }),
});

const nodes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/nodes' }),
  schema: z.object({
    title:         z.string(),
    description:   z.string(),
    agent_summary: z.string(),
    // MAINTENANCE: if you change these enums, update
    // aicv-playbook/prompts/node-intake-v0.md in the same session.
    city:          z.enum([
      'Palm Springs', 'Desert Hot Springs', 'Cathedral City',
      'Rancho Mirage', 'Palm Desert', 'Indian Wells',
      'La Quinta', 'Indio', 'Coachella',
      'Coachella Valley', 'Adjacent Communities',
    ]),
    domain:        z.enum([
      'Access & Arrival', 'Hospitality & Retreat Venues',
      'Founder Infrastructure', 'Talent & Workforce',
      'Home & Real Estate', 'Family & Schooling',
      'Wellness & Healthcare', 'Food & Dining',
      'Arts & Culture', 'Outdoors & Recreation',
      'Media & Story', 'Civic & Safety', 'Service Class',
    ]),
    funnel_stages: z.array(z.enum([
      'Discover', 'Visit', 'Return',
      'Satellite', 'Relocate', 'Build',
    ])).min(1),
    agent_intent:  z.array(z.enum([
      'invest', 'relocate', 'visit', 'research',
      'retreat', 'hire', 'fund', 'sponsor', 'route',
    ])).min(1),
    category:      z.string(),
    subcategory:   z.string().optional(),
    verified:      z.boolean(),
    status:        z.enum(['live', 'under construction', 'planned']),
    last_updated:  z.string().optional(),
  }),
});

// Standing factual records of regional organizations whose status has changed.
// One entry = one record page with its own FAQ set. Modeled on `briefs` — the
// same glob loader, a flat schema, no taxonomy enums — because a record is a
// single self-contained document, not a node in the network graph. Like nodes
// and briefs (and unlike reports) there is deliberately NO status field: the
// generator does not status-filter this collection.
const records = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/records' }),
  schema: z.object({
    title:         z.string(),
    description:   z.string(),
    datePublished: z.string(),
    dateModified:  z.string(),
    // Page order. Rendered as the visible h2/answer sequence AND as FAQPage
    // mainEntity from this one array, so the structured data cannot drift
    // from the visible copy.
    faq: z.array(z.object({
      question: z.string(),
      answer:   z.string(),
    })).min(1),
    // `id` is the @id fragment the citation takes in the page @graph. It is
    // carried rather than slugged from `publisher` because the fragment is
    // part of the citation's identity and no slug rule reproduces it.
    sources: z.array(z.object({
      id:              z.string(),
      url:             z.string(),
      author:          z.string(),
      publisher:       z.string(),
      publicationDate: z.string(),
    })).min(1),
  }),
});

const reports = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/reports' }),
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    date:        z.string(),
    period:      z.string(),
    report_type: z.string(),
    status:      z.enum(['published', 'draft']),
    tags:        z.array(z.string()),
    sections:    z.array(z.string()),
    canonical:   z.string(),
  }),
});

const aiqna = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/aiqna' }),
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    date:        z.string(),
    status:      z.string(),
    cadence:     z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
    language:    z.string().default('en'),
    license:     z.string().default('CC-BY-4.0'),
    // type distinguishes the single methodology entry (rendered at /aiqna/)
    // from weekly findings (rendered at /aiqna/[slug]/).
    type:        z.enum(['methodology', 'finding']).default('finding'),
    canonical:   z.string().optional(),
    // Finding-only display data (a weekly aggregate snapshot). Optional so the
    // methodology entry validates without them.
    question_id:     z.string().optional(),
    question:        z.string().optional(),
    total_responses: z.number().optional(),
    results:  z.array(z.object({ label: z.string(), pct: z.number(), accent: z.boolean().default(false) })).optional(),
    cities:   z.array(z.object({ name: z.string(), pct: z.number() })).optional(),
    cloud:    z.array(z.object({ term: z.string(), size: z.enum(['xl', 'lg', 'md', 'sm']), accent: z.boolean().default(false) })).optional(),
    quotes:   z.array(z.object({ text: z.string(), attribution: z.string() })).optional(),
  }),
});

export const collections = { briefs, nodes, records, reports, aiqna };
