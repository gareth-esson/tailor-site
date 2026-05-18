/**
 * Content collections.
 *
 * blog: long-form editorial posts. One folder per post under
 * src/content/blog/<slug>/ containing index.mdx and any images the
 * post references (featured.webp, 01.webp, 02.webp, etc.). The folder
 * name is the URL slug.
 *
 * Frontmatter mirrors the old Notion BlogPost shape so downstream
 * consumers (the blog index, category pages, related-posts logic,
 * service-page sidebars) don't need restructuring. Topic relations
 * are stored as Notion page IDs for now — the LandingPage data still
 * comes from Notion and is resolved through the same path.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/index.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      status: z.enum(['Draft', 'In Review', 'Published']).default('Draft'),
      publishedDate: z.string().nullable().default(null),
      author: z.string().default('Gareth Esson'),
      category: z
        .enum(['RSE in Practice', 'Guidance and Policy', 'Our Work'])
        .nullable()
        .default(null),
      targetAudience: z
        .enum(['Teachers', 'School leaders', 'Parents'])
        .nullable()
        .default(null),
      contentTags: z.array(z.string()).default([]),
      /** Primary landing-page relations, by Notion page id. Resolved
       *  to LandingPageRef via getBlogPosts() in src/lib/content.ts. */
      topicIds: z.array(z.string()).default([]),
      secondaryTopicIds: z.array(z.string()).default([]),
      serviceLink: z
        .enum(['delivery', 'training', 'drop-days', 'consultancy', 'none'])
        .nullable()
        .default(null),
      metaTitle: z.string().default(''),
      metaDescription: z.string().default(''),
      /** Co-located, e.g. `./featured.webp`. Optimised by Astro.
       *  Allow `null` from YAML so posts without a hero serialise
       *  cleanly. The data layer maps null → undefined downstream. */
      featuredImage: image().nullish(),
      imageCredit: z.string().nullable().default(null),
      imageCreditUrl: z.string().url().nullable().default(null),
    }),
});

export const collections = { blog };
