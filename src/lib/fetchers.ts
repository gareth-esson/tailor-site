import {
  queryDatabase,
  fetchPageBlocks,
  getTitleValue,
  getRichTextValue,
  getSelectValue,
  getMultiSelectValues,
  getRelationIds,
  getCheckboxValue,
  getNumberValue,
} from './notion';
import type { Question, GlossaryTerm, Topic, LandingPage, BlogPost } from './types';

// --- Data source IDs (Notion SDK v5 uses data source IDs, not database IDs) ---

const QUESTIONS_DB = 'cd6d5a28-64a7-4809-84e1-483e4a4ac259';
const GLOSSARY_DB = 'c844695c-a72f-496f-9fef-3e72cdf25f02';
const TOPICS_DB = '16dde54c-a2e1-47c2-8c84-f84fa602f6e9';

function getLandingPagesDb(): string | null {
  return import.meta.env.NOTION_LANDING_PAGES_DB || null;
}

function getBlogDb(): string | null {
  return import.meta.env.NOTION_BLOG_DB || null;
}

// --- Fetchers ---

export async function fetchQuestions(): Promise<Question[]> {
  console.log('Fetching questions...');
  const pages = await queryDatabase(QUESTIONS_DB, {
    property: 'Status',
    select: { equals: 'Published' },
  });

  const questions: Question[] = await Promise.all(
    pages.map(async (page) => {
      const p = page.properties;
      const body = await fetchPageBlocks(page.id);

      return {
        id: page.id,
        question: getTitleValue(p['Question']),
        slug: getRichTextValue(p['Slug']),
        status: getSelectValue(p['Status']),
        topicIds: getRelationIds(p['Topic']),
        topic: null, // resolved later
        contentTags: getMultiSelectValues(p['Content Tags']),
        ageTier: getSelectValue(p['Age Tier']),
        originalCategory: getSelectValue(p['Original Category']),
        glossaryTermIds: getRelationIds(p['Glossary Terms']),
        glossaryTerms: [], // resolved later
        relatedQuestionIds: getRelationIds(p['Related Questions']),
        relatedQuestions: [], // resolved later
        okayToAskCategory: getSelectValue(p['Okay to Ask Category']),
        metaTitle: getRichTextValue(p['Meta Title']),
        metaDescription: getRichTextValue(p['Meta Description']),
        signposting: getMultiSelectValues(p['Signposting']),
        hasPostItScan: getCheckboxValue(p['Has Post-it Scan']),
        imageUrl: getRichTextValue(p['Image URL']),
        simpleAnswer: getRichTextValue(p['Simple Answer']),
        notes: getRichTextValue(p['Notes']),
        body,
      };
    }),
  );

  console.log(`  ✓ ${questions.length} questions fetched`);
  return questions;
}

export async function fetchGlossaryTerms(): Promise<GlossaryTerm[]> {
  console.log('Fetching glossary terms...');
  const pages = await queryDatabase(GLOSSARY_DB, {
    property: 'Status',
    select: { equals: 'Published' },
  });

  const terms: GlossaryTerm[] = await Promise.all(
    pages.map(async (page) => {
      const p = page.properties;
      const body = await fetchPageBlocks(page.id);

      return {
        id: page.id,
        term: getTitleValue(p['Term']),
        slug: getRichTextValue(p['Slug']),
        status: getSelectValue(p['Status']),
        shortDefinition: getRichTextValue(p['Short Definition']),
        simpleDefinition: getRichTextValue(p['Simple Definition']),
        topicIds: getRelationIds(p['Topic']),
        topic: null, // resolved later
        relatedTermIds: getRelationIds(p['Related Terms']),
        relatedTerms: [], // resolved later
        referencedInIds: getRelationIds(p['Referenced In']),
        referencedIn: [], // resolved later
        needsDiagram: getCheckboxValue(p['Needs Diagram']),
        metaTitle: getRichTextValue(p['Meta Title']),
        metaDescription: getRichTextValue(p['Meta Description']),
        body,
      };
    }),
  );

  console.log(`  ✓ ${terms.length} glossary terms fetched`);
  return terms;
}

export async function fetchTopics(): Promise<Topic[]> {
  console.log('Fetching topics...');
  const pages = await queryDatabase(TOPICS_DB);

  const topics: Topic[] = await Promise.all(
    pages.map(async (page) => {
      const p = page.properties;
      const body = await fetchPageBlocks(page.id);

      return {
        id: page.id,
        name: getTitleValue(p['Topic Name']),
        slug: getRichTextValue(p['Slug']),
        category: getSelectValue(p['Category']),
        crisisService: getSelectValue(p['Crisis Service']),
        topicNumber: getNumberValue(p['Topic Number']),
        body,
      };
    }),
  );

  console.log(`  ✓ ${topics.length} topics fetched`);
  return topics;
}

export async function fetchLandingPages(): Promise<LandingPage[]> {
  const dbId = getLandingPagesDb();
  if (!dbId) {
    console.warn('  ⚠ NOTION_LANDING_PAGES_DB not set, skipping landing pages');
    return [];
  }

  console.log('Fetching landing pages...');
  try {
    const pages = await queryDatabase(dbId);

    const landingPages: LandingPage[] = await Promise.all(
      pages.map(async (page) => {
        const p = page.properties;
        const body = await fetchPageBlocks(page.id);

        return {
          id: page.id,
          title: getTitleValue(p['Title']),
          slug: getRichTextValue(p['Slug']),
          category: getSelectValue(p['Category']),
          granularTopicIds: getRelationIds(p['Granular Topics']),
          granularTopics: [], // resolved later
          serviceCtaTarget: getSelectValue(p['Service CTA Target']),
          metaTitle: getRichTextValue(p['Meta Title']),
          metaDescription: getRichTextValue(p['Meta Description']),
          body,
        };
      }),
    );

    console.log(`  ✓ ${landingPages.length} landing pages fetched`);
    return landingPages;
  } catch (error) {
    console.warn(`  ⚠ Could not fetch landing pages (database may not be shared with integration yet):`, (error as Error).message);
    return [];
  }
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const dbId = getBlogDb();
  if (!dbId) {
    console.warn('  ⚠ NOTION_BLOG_DB not set, skipping blog posts');
    return [];
  }

  console.log('Fetching blog posts...');
  try {
    const pages = await queryDatabase(dbId, {
      property: 'Status',
      select: { equals: 'Published' },
    });

    const blogPosts: BlogPost[] = await Promise.all(
      pages.map(async (page) => {
        const p = page.properties;
        const body = await fetchPageBlocks(page.id);

        return {
          id: page.id,
          title: getTitleValue(p['Title']),
          slug: getRichTextValue(p['Slug']),
          status: getSelectValue(p['Status']),
          topicIds: getRelationIds(p['Topic']),
          topics: [], // resolved later
          secondaryTopicIds: getRelationIds(p['Secondary Topics']),
          secondaryTopics: [], // resolved later
          contentTags: getMultiSelectValues(p['Content Tags']),
          metaTitle: getRichTextValue(p['Meta Title']),
          metaDescription: getRichTextValue(p['Meta Description']),
          targetAudience: getSelectValue(p['Target Audience']),
          serviceLink: getSelectValue(p['Service Link']),
          author: getRichTextValue(p['Author']),
          body,
        };
      }),
    );

    console.log(`  ✓ ${blogPosts.length} blog posts fetched`);
    return blogPosts;
  } catch (error) {
    console.warn(`  ⚠ Could not fetch blog posts (database may not be shared with integration yet):`, (error as Error).message);
    return [];
  }
}
