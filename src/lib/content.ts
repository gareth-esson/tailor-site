import { getCollection } from 'astro:content';
import {
  fetchQuestions,
  fetchGlossaryTerms,
  fetchTopics,
  fetchLandingPages,
  fetchCurriculumStatements,
  fetchTestimonials,
} from './fetchers';
import { cached } from './notion-cache';
import type {
  Question,
  GlossaryTerm,
  Topic,
  LandingPage,
  BlogPost,
  CurriculumStatement,
  Testimonial,
  ServiceTag,
  TopicRef,
  GlossaryRef,
  QuestionRef,
  LandingPageRef,
  GlossaryIndex,
} from './types';

/**
 * Derive a plain-text excerpt from MDX body markdown — first non-empty
 * paragraph, stripped of inline markup, truncated at a word boundary
 * with an ellipsis. Used by getBlogPosts() to pre-populate
 * BlogPost.excerpt for card rendering on the index/category pages.
 * Returns null when the body has no usable paragraph.
 */
function markdownExcerpt(md: string | undefined | null, maxChars: number): string | null {
  if (!md) return null;
  const paragraphs = md.split(/\n\n+/);
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    // Skip non-paragraph blocks.
    if (
      trimmed.startsWith('#') ||
      trimmed.startsWith('>') ||
      trimmed.startsWith('- ') ||
      trimmed.startsWith('* ') ||
      trimmed.startsWith('![') ||
      trimmed.startsWith('```') ||
      /^\d+\.\s/.test(trimmed)
    ) continue;

    const plain = trimmed
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')   // inline images
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links → label
      .replace(/\*\*([^*]+)\*\*/g, '$1')        // bold
      .replace(/\*([^*]+)\*/g, '$1')             // italic
      .replace(/`([^`]+)`/g, '$1')                // inline code
      .replace(/_+/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!plain) continue;

    if (plain.length <= maxChars) return plain;
    const slice = plain.slice(0, maxChars);
    const lastSpace = slice.lastIndexOf(' ');
    const cut = lastSpace > maxChars * 0.6 ? slice.slice(0, lastSpace) : slice;
    return `${cut.trimEnd()}…`;
  }
  return null;
}

// --- Cached data (populated once per build) ---

let _questions: Question[] | null = null;
let _glossaryTerms: GlossaryTerm[] | null = null;
let _topics: Topic[] | null = null;
let _landingPages: LandingPage[] | null = null;
let _blogPosts: BlogPost[] | null = null;
let _curriculumStatements: CurriculumStatement[] | null = null;
let _testimonials: Testimonial[] | null = null;
let _glossaryIndex: GlossaryIndex | null = null;

// Promise-singleton guard. Without this, Astro dev — which fires many
// getStaticPaths calls concurrently on first load — will race N callers
// past the `_topics === null` check and N parallel Notion fetches will
// run, trip the rate-limiter, and poison subsequent requests. We must
// only ever hold one in-flight load at a time.
let _loadPromise: Promise<void> | null = null;

/**
 * Load all content from Notion and resolve relations.
 * Called once at build time; subsequent calls return cached data.
 */
async function loadAllContent(): Promise<void> {
  if (_topics !== null) return; // already loaded
  if (_loadPromise) return _loadPromise; // already loading — join the existing call

  _loadPromise = (async () => {
    await _loadAllContentImpl();
  })();

  try {
    await _loadPromise;
  } finally {
    // Keep _loadPromise around only while the first pass is in flight.
    // Once it resolves, subsequent callers see the populated `_topics`
    // and short-circuit above.
  }
}

async function _loadAllContentImpl(): Promise<void> {
  console.log('\n=== Loading content from Notion ===\n');

  // Fetch databases sequentially to avoid Notion API rate limits.
  // Each call is wrapped in the disk cache (`.cache/notion/*.json`) so
  // subsequent dev-server starts read from disk instead of hitting the
  // API. Delete .cache/notion or set NOTION_CACHE_REFRESH=1 to refetch.
  const topics = await cached('topics', fetchTopics);
  const glossaryTerms = await cached('glossary-terms', fetchGlossaryTerms);
  const questions = await cached('questions', fetchQuestions);
  const landingPages = await cached('landing-pages', fetchLandingPages);
  const curriculumStatements = await cached('curriculum-statements', fetchCurriculumStatements);
  const testimonials = await cached('testimonials', fetchTestimonials);

  // Blog posts now live in src/content/blog as MDX. Pull entries via
  // Astro's content collection API and map into the BlogPost shape so
  // downstream consumers (blog index/category, related-posts logic,
  // service-page sidebars, about) keep working unchanged.
  const blogEntries = await getCollection('blog', ({ data }) => data.status === 'Published');
  const blogPosts: BlogPost[] = blogEntries.map((entry) => {
    const fm = entry.data;
    const featured = fm.featuredImage;
    return {
      id: entry.id,
      title: fm.title,
      slug: entry.id,
      status: fm.status,
      topicIds: fm.topicIds,
      topics: [], // resolved below
      secondaryTopicIds: fm.secondaryTopicIds,
      secondaryTopics: [], // resolved below
      contentTags: fm.contentTags,
      metaTitle: fm.metaTitle,
      metaDescription: fm.metaDescription,
      targetAudience: fm.targetAudience,
      category: fm.category,
      serviceLink: fm.serviceLink,
      author: fm.author,
      featuredImage: featured?.src ?? null,
      featuredImageWidth: featured?.width ?? null,
      featuredImageHeight: featured?.height ?? null,
      imageCredit: fm.imageCredit,
      imageCreditUrl: fm.imageCreditUrl,
      publishedDate: fm.publishedDate,
      dateModified: fm.dateModified,
      excerpt: markdownExcerpt(entry.body, 140),
    };
  });

  // Build lookup maps
  const topicMap = new Map<string, Topic>(topics.map((t) => [t.id, t]));
  const glossaryMap = new Map<string, GlossaryTerm>(glossaryTerms.map((g) => [g.id, g]));
  const questionMap = new Map<string, Question>(questions.map((q) => [q.id, q]));
  const landingPageMap = new Map<string, LandingPage>(landingPages.map((lp) => [lp.id, lp]));

  // --- Resolve relations ---

  // Helper: create a TopicRef from a Topic
  function toTopicRef(t: Topic): TopicRef {
    return { id: t.id, name: t.name, slug: t.slug, category: t.category };
  }

  function toGlossaryRef(g: GlossaryTerm): GlossaryRef {
    return {
      id: g.id,
      term: g.term,
      slug: g.slug,
      shortDefinition: g.shortDefinition,
      simpleDefinition: g.simpleDefinition,
      category: g.topic?.category || null,
    };
  }

  function toQuestionRef(q: Question): QuestionRef {
    return { id: q.id, question: q.question, slug: q.slug, okayToAskCategory: q.okayToAskCategory, contentTags: q.contentTags };
  }

  function toLandingPageRef(lp: LandingPage): LandingPageRef {
    return { id: lp.id, title: lp.title, slug: lp.slug };
  }

  // Resolve question relations
  for (const q of questions) {
    const topicId = q.topicIds[0];
    if (topicId) {
      const topic = topicMap.get(topicId);
      if (topic) q.topic = toTopicRef(topic);
    }

    q.glossaryTerms = q.glossaryTermIds
      .map((id) => glossaryMap.get(id))
      .filter((g): g is GlossaryTerm => g !== undefined)
      .map(toGlossaryRef);

    q.relatedQuestions = q.relatedQuestionIds
      .map((id) => questionMap.get(id))
      .filter((rq): rq is Question => rq !== undefined)
      .map(toQuestionRef);
  }

  // Resolve glossary term relations
  for (const g of glossaryTerms) {
    const topicId = g.topicIds[0];
    if (topicId) {
      const topic = topicMap.get(topicId);
      if (topic) g.topic = toTopicRef(topic);
    }

    g.relatedTerms = g.relatedTermIds
      .map((id) => glossaryMap.get(id))
      .filter((rt): rt is GlossaryTerm => rt !== undefined)
      .map(toGlossaryRef);

    // Build referencedIn from the questions side (more reliable than
    // Notion's reverse relation property which can be empty).
    // A question references this glossary term if its glossaryTermIds includes g.id.
    g.referencedIn = questions
      .filter((q) => q.glossaryTermIds.includes(g.id))
      .map(toQuestionRef);
  }

  // Resolve landing page relations
  for (const lp of landingPages) {
    lp.granularTopics = lp.granularTopicIds
      .map((id) => topicMap.get(id))
      .filter((t): t is Topic => t !== undefined)
      .map(toTopicRef);
  }

  // Resolve blog post relations (Topic relates to Landing Pages DB per spec)
  for (const bp of blogPosts) {
    bp.topics = bp.topicIds
      .map((id) => landingPageMap.get(id))
      .filter((lp): lp is LandingPage => lp !== undefined)
      .map(toLandingPageRef);

    bp.secondaryTopics = bp.secondaryTopicIds
      .map((id) => landingPageMap.get(id))
      .filter((lp): lp is LandingPage => lp !== undefined)
      .map(toLandingPageRef);
  }

  // Build glossary index for tooltip matching.
  // Compound terms like "Pregnant / Pregnancy" are split so each
  // variant ("pregnant", "pregnancy") maps to the same ref.
  const glossaryIndex: GlossaryIndex = {};
  for (const g of glossaryTerms) {
    const ref = toGlossaryRef(g);
    const termLower = g.term.toLowerCase();
    if (termLower.includes(' / ')) {
      for (const variant of termLower.split(' / ')) {
        const trimmed = variant.trim();
        if (trimmed) glossaryIndex[trimmed] = ref;
      }
    } else {
      glossaryIndex[termLower] = ref;
    }
  }

  // Cache everything
  _topics = topics;
  _glossaryTerms = glossaryTerms;
  _questions = questions;
  _landingPages = landingPages;
  _blogPosts = blogPosts;
  _curriculumStatements = curriculumStatements;
  _testimonials = testimonials;
  _glossaryIndex = glossaryIndex;

  console.log('\n=== Content loaded and relations resolved ===\n');
}

// --- Public API ---

export async function getQuestions(): Promise<Question[]> {
  await loadAllContent();
  return _questions!;
}

export async function getGlossaryTerms(): Promise<GlossaryTerm[]> {
  await loadAllContent();
  return _glossaryTerms!;
}

export async function getTopics(): Promise<Topic[]> {
  await loadAllContent();
  return _topics!;
}

export async function getLandingPages(): Promise<LandingPage[]> {
  await loadAllContent();
  return _landingPages!;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  await loadAllContent();
  return _blogPosts!;
}

export async function getCurriculumStatements(): Promise<CurriculumStatement[]> {
  await loadAllContent();
  return _curriculumStatements!;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  await loadAllContent();
  return _testimonials!;
}

export async function getTestimonialsByService(tag: ServiceTag): Promise<Testimonial[]> {
  const all = await getTestimonials();
  return all.filter((t) => t.serviceTags.includes(tag));
}

export async function getGlossaryIndex(): Promise<GlossaryIndex> {
  await loadAllContent();
  return _glossaryIndex!;
}
