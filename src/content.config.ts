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
    agent_summary: z.string().optional(),
    city:          z.string(),
    category:      z.string(),
    subcategory:   z.string().optional(),
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
