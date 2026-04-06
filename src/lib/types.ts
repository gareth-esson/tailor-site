import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

// --- Resolved reference types (after relation resolution) ---

export interface TopicRef {
  id: string;
  name: string;
  slug: string;
  category: string | null;
}

export interface GlossaryRef {
  id: string;
  term: string;
  slug: string;
  shortDefinition: string;
  simpleDefinition: string;
}

export interface QuestionRef {
  id: string;
  question: string;
  slug: string;
  /**
   * Okay to Ask category name (e.g. "Puberty", "Relationships").
   * Optional because not every consumer needs it — C1's related-questions
   * grid uses it to colour the card eyebrow per OtA category.
   */
  okayToAskCategory?: string | null;
  contentTags?: string[];
}

export interface LandingPageRef {
  id: string;
  title: string;
  slug: string;
}

export interface BlogPostRef {
  id: string;
  title: string;
  slug: string;
}

// --- Full content types ---

export interface Topic {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  crisisService: string | null;
  topicNumber: number | null;
  body: BlockObjectResponse[];
}

export interface Question {
  id: string;
  question: string;
  slug: string;
  status: string | null;
  topicIds: string[];
  topic: TopicRef | null;
  contentTags: string[];
  ageTier: string | null;
  originalCategory: string | null;
  glossaryTermIds: string[];
  glossaryTerms: GlossaryRef[];
  relatedQuestionIds: string[];
  relatedQuestions: QuestionRef[];
  okayToAskCategory: string | null;
  metaTitle: string;
  metaDescription: string;
  signposting: string[];
  hasPostItScan: boolean;
  imageUrl: string;
  simpleAnswer: string;
  notes: string;
  body: BlockObjectResponse[];
}

export interface GlossaryTerm {
  id: string;
  term: string;
  slug: string;
  status: string | null;
  shortDefinition: string;
  simpleDefinition: string;
  topicIds: string[];
  topic: TopicRef | null;
  relatedTermIds: string[];
  relatedTerms: GlossaryRef[];
  referencedInIds: string[];
  referencedIn: QuestionRef[];
  needsDiagram: string;
  simpleExplainer: string;
  metaTitle: string;
  metaDescription: string;
  body: BlockObjectResponse[];
}

export interface LandingPage {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  granularTopicIds: string[];
  granularTopics: TopicRef[];
  serviceCtaTarget: string | null;
  metaTitle: string;
  metaDescription: string;
  body: BlockObjectResponse[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string | null;
  topicIds: string[];
  topics: LandingPageRef[];
  secondaryTopicIds: string[];
  secondaryTopics: LandingPageRef[];
  contentTags: string[];
  metaTitle: string;
  metaDescription: string;
  targetAudience: string | null;
  serviceLink: string | null;
  author: string;
  body: BlockObjectResponse[];
}

// --- Glossary index for tooltip matching ---

export interface GlossaryIndex {
  [termLower: string]: GlossaryRef;
}
