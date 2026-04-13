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
  category: string | null;
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
  category: string | null;
  serviceLink: string | null;
  author: string;
  featuredImage: string | null;
  publishedDate: string | null;
  body: BlockObjectResponse[];
}

export interface CurriculumStatement {
  id: string;
  statement: string;
  source: string;
  sectionReference: string;
  keyStages: string[];
  topicIds: string[];
}

// --- Testimonials (B6) ---

export type ServiceTag =
  | 'RSE delivery'
  | 'RSE training'
  | 'Drop days'
  | 'Circuits (SEND/AP)'
  | 'RSE policy & curriculum planning'
  | 'Universities & FE'
  | 'About / general';

export type Setting =
  | 'Primary school'
  | 'Secondary school'
  | 'SEND school'
  | 'Alternative provision'
  | 'Third sector'
  | 'Higher education'
  | 'Other';

export type Voice =
  | 'School staff'
  | 'Third sector lead'
  | 'Young person'
  | 'Academic / collaborator'
  | 'Parent';

export interface Testimonial {
  id: string;
  /** The testimonial text. Line breaks preserved as `\n`. */
  quote: string;
  /** Attributed name or anonymous descriptor. Never empty. */
  name: string;
  /** Job title. May be empty. */
  role: string;
  /** School or organisation. May be empty. */
  organisation: string;
  /** Service tag multi-select values. At least one expected. */
  serviceTags: ServiceTag[];
  /** Setting select. May be empty. Reserved for future use. */
  setting: Setting | '';
  /** Voice select. May be empty. Reserved for future use. */
  voice: Voice | '';
  /** Notion created_time, ISO string. Used for ordering. */
  createdTime: string;
}

// --- Glossary index for tooltip matching ---

export interface GlossaryIndex {
  [termLower: string]: GlossaryRef;
}
