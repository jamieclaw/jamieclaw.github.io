import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Single collection; `lang` is derived from the file path.
// EN posts live at src/content/blog/*.md
// Cantonese posts live at src/content/blog/zh/*.md
// Same filename stem = translation pair (shared translationId).
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // SEO / metadata extras. All optional — safe defaults applied in templates.
    author: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    /** Optional hero image (absolute path under /public, e.g. /og/foo.png). */
    heroImage: z.string().optional(),
    /** Optional override for social share image. Defaults to heroImage or auto-generated OG card. */
    ogImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
