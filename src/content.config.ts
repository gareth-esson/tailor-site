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

/**
 * pillars: Okay-to-Ask hub pages [C5]. One conceptual young-person
 * question ("What counts as losing your virginity?") that consolidates a
 * cluster of high-impression search variants. One folder per pillar under
 * src/content/pillars/<slug>/index.mdx — the folder name is the URL slug.
 *
 * Split content model: the MDX body carries the conceptual intro prose;
 * `faqs` carries the "does X count?" sub-answers as structured data. The
 * template renders `faqs` verbatim as H2 Q&A AND feeds the same strings to
 * FAQPage JSON-LD, so on-page/schema parity holds from a single source.
 * The post-it hero and spoke links are queried live from Notion by
 * `clusterTag` — the real handed-in notes stay on their own question
 * pages, this page hubs them.
 */
const pillars = defineCollection({
  loader: glob({ pattern: '**/index.{md,mdx}', base: './src/content/pillars' }),
  schema: z.object({
    title: z.string(),
    /** Subtitle under the H1. Answers the umbrella question in one line. */
    lede: z.string().default(''),
    status: z.enum(['Draft', 'In Review', 'Published']).default('Draft'),
    publishedDate: z.string().nullable().default(null),
    dateModified: z.string().nullable().default(null),
    metaTitle: z.string().default(''),
    metaDescription: z.string().default(''),
    /** Notion "Content Tag" whose questions supply the hero post-it
     *  scatter and spoke links (e.g. "virginity"). Only questions with a
     *  real scan appear — the flag that sorts artefact-backed spokes from
     *  editorial fold-ins. */
    clusterTag: z.string(),
    /** Plain-language version of the MDX intro, one string per paragraph.
     *  Rendered as the Simple Mode ([A6]) view of the conceptual intro —
     *  same content, simpler words, for younger readers and anyone who
     *  wants it clearer. The MDX body is the standard view. */
    simpleIntro: z.array(z.string()).default([]),
    /** The "does X count?" sub-answers. Rendered verbatim as H2 Q&A and
     *  emitted as FAQPage mainEntity — one source keeps schema/on-page
     *  parity, which Google checks (schema always uses the standard
     *  `answer`). `simpleAnswer` is the Simple Mode swap; `spokeSlug`
     *  optionally links a fold-in to a real question page. */
    faqs: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
          simpleAnswer: z.string().optional(),
          spokeSlug: z.string().optional(),
        }),
      )
      .default([]),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/index.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      status: z.enum(['Draft', 'In Review', 'Published']).default('Draft'),
      publishedDate: z.string().nullable().default(null),
      /** ISO date string. Set when the post is materially refreshed
       *  (new sources, internal links rewired, factual correction).
       *  Drives schema.org Article.dateModified and og:modified_time. */
      dateModified: z.string().nullable().default(null),
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

export const collections = { blog, pillars };
