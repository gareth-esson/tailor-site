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
      /** Periodic-review machinery — see docs/editorial-policy.md §3.
       *  Set `guidanceSensitive: true` on posts touching statutory
       *  guidance, KCSIE, Ofsted, RSHE, mental-health intervention,
       *  age of consent or online-safety law — anything whose
       *  underlying landscape can change under the published text.
       *  Such a post gets a `reviewBy` date, its interval set by
       *  how fast the underlying source moves (§3). The clock runs
       *  from the last review, not from publish: on completing one,
       *  bump `lastReviewedDate` and set the next `reviewBy`.
       *  `lastReviewedDate` stays null until a human has actually
       *  re-read the post. Both are ISO date strings. */
      guidanceSensitive: z.boolean().default(false),
      reviewBy: z.string().nullable().default(null),
      lastReviewedDate: z.string().nullable().default(null),
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
      featuredImageAlt: z.string().default(''),
      imageCredit: z.string().nullable().default(null),
      imageCreditUrl: z.string().url().nullable().default(null),
    }),
});

/**
 * clusters: teacher-facing cluster pages under /for-schools/<slug>/.
 *
 * One teaching intent ("teaching about misogyny and masculinity") that
 * consolidates a group of search variants a PSHE lead actually types —
 * "online misogyny lesson plan", "toxic masculinity lesson plan", "pshe
 * andrew tate". Distinct from /topics/<slug>, which is the taxonomy hub
 * the OtA questions and glossary roll up into and stays exactly as it is:
 * a cluster page answers "how do I teach this, and who can help", a topic
 * page answers "everything we hold on this subject". They cross-link
 * rather than compete.
 *
 * Distinct too from /for-schools/ itself, which is deliberately plain —
 * no cards, no downloads, no prices. That restraint is the hub's; its
 * children carry the offer.
 *
 * The MDX body is the teaching content. Everything else is structured so
 * the template can compose the page: real handed-in pupil questions
 * (resolved from Notion by slug — the artefact no competitor has),
 * further reading, the downloadable resource, and where the enquiry goes.
 */
const clusters = defineCollection({
  loader: glob({ pattern: '**/index.{md,mdx}', base: './src/content/clusters' }),
  schema: z.object({
    title: z.string(),
    /** One sentence under the H1, written from the teacher's side. */
    lede: z.string().default(''),
    status: z.enum(['Draft', 'In Review', 'Published']).default('Draft'),
    publishedDate: z.string().nullable().default(null),
    dateModified: z.string().nullable().default(null),
    metaTitle: z.string().default(''),
    metaDescription: z.string().default(''),
    /** The statutory line this cluster hangs on, if any. Rendered in the
     *  hero as the reason this is on a PSHE lead's desk this year. */
    statutoryNote: z.string().default(''),
    /** Source for the statutory claim. The page makes no legal assertion of
     *  its own, so the claim carries a link to the guidance it rests on. */
    statutoryHref: z.string().default(''),
    /** Testimonial service tag to pull proof from, e.g. "RSE delivery".
     *  Must be a ServiceTag (types.ts) — a different vocabulary from the
     *  enquiry form's. Empty means no proof band renders. */
    testimonialTag: z.string().default(''),
    /** Real anonymous questions to feature, by question slug. Resolved
     *  against Notion at build; any slug that no longer exists is dropped
     *  rather than rendered as a dead card, and the build warns. */
    questionSlugs: z.array(z.string()).default([]),
    /** Further reading, by blog slug, in the order they should appear. */
    postSlugs: z.array(z.string()).default([]),
    /** Topic pages to cross-link down to, by landing-page slug. */
    topicSlugs: z.array(z.string()).default([]),
    /** Which service the enquiry CTA points at. Same vocabulary the
     *  landing pages and blog posts use; mapped through SERVICE_CTA. */
    serviceCtaTarget: z
      .enum(['delivery', 'training', 'drop-days', 'consultancy', 'rse-policy-curriculum-planning'])
      .default('delivery'),
    /** A worked example of a sequence on this topic. It is a sample, not a
     *  fixed product: schools take one lesson or all of them, a one-off or
     *  a drop day, and everything adapts to age and prior knowledge. The
     *  template says so plainly, because a scheme presented as fixed sells
     *  to fewer schools than the same scheme presented as a starting point.
     *
     *  Downloads hang off individual lessons rather than the unit, so a
     *  plan can be published the week it is written and sits in the
     *  sequence that gives it meaning. `download: null` renders the lesson
     *  without a link rather than promising a file that isn't there. */
    unit: z
      .object({
        title: z.string(),
        /** e.g. "Year 9". Shown as a label, not a restriction. */
        yearGroup: z.string().default(''),
        lessonLength: z.string().default(''),
        /** One paragraph: what the sequence is and what it is not. */
        intro: z.string().default(''),
        /** The intellectual arc, one step per lesson phase. Rendered as a
         *  spine beside the lessons so a PSHE lead can see the progression
         *  without reading all six rows. */
        arc: z.array(z.string()).default([]),
        /** One activity, shown in full. A page that only describes lessons
         *  asks the reader to take the teaching on trust; showing a single
         *  activity lets a PSHE lead judge it. Clearly labelled as a sample
         *  because the unit itself is still being written. */
        sampleActivity: z
          .object({
            fromLesson: z.string(),
            name: z.string(),
            intro: z.string().default(''),
            steps: z
              .array(
                z.object({
                  label: z.string(),
                  prompt: z.string(),
                  example: z.string(),
                }),
              )
              .default([]),
          })
          .nullable()
          .default(null),
        lessons: z
          .array(
            z.object({
              title: z.string(),
              /** The lesson's central question, in pupil-facing words. */
              question: z.string(),
              /** What pupils should leave understanding. */
              outcome: z.string(),
              download: z
                .object({ href: z.string(), format: z.string().default('') })
                .nullable()
                .default(null),
            }),
          )
          .default([]),
      })
      .nullable()
      .default(null),
  }),
});

export const collections = { blog, pillars, clusters };
