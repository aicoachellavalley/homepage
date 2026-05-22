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
    category:      z.string(),
    subcategory:   z.string().optional(),
    verified:      z.boolean(),
    status:        z.enum(['live', 'under construction', 'planned']),
    last_updated:  z.string().optional(),
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

export const collections = { briefs, nodes, reports };
