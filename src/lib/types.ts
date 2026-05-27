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
  /** ISO 8601 — Notion page.created_time. Emitted as datePublished
   *  in the page's QAPage JSON-LD (Question + Answer). */
  createdTime: string;
  /** ISO 8601 — Notion page.last_edited_time. Emitted as dateModified
   *  in the JSON-LD; useful as a freshness signal for AI Overview
   *  source-selection on health queries. */
  lastEditedTime: string;
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
  /** Alternate phrasings the question is searched for — flow into
   *  schema.org Question.alternateName in the page's QAPage JSON-LD.
   *  Lets Google associate query variants with the canonical answer
   *  without rewriting the visible H1. One phrasing per line in the
   *  Notion "Alternate Phrasings" Rich Text property; blank lines
   *  are dropped. */
  alternatePhrasings: string[];
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
  /** ISO 8601 — Notion page.created_time. Emitted as datePublished
   *  in the page's MedicalWebPage JSON-LD when medical. */
  createdTime: string;
  /** ISO 8601 — Notion page.last_edited_time. Emitted as dateModified. */
  lastEditedTime: string;
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
  /** Intrinsic pixel dimensions of `featuredImage`, resolved by Astro's
   *  image pipeline at build time. Used for og:image:width/height so
   *  social platforms can pre-size the share card without fetching the
   *  bytes. */
  featuredImageWidth: number | null;
  featuredImageHeight: number | null;
  imageCredit: string | null;
  imageCreditUrl: string | null;
  publishedDate: string | null;
  /** ISO date the post was last materially refreshed. `null` until the
   *  first refresh; the renderer falls back to publishedDate for both
   *  schema.org dateModified and the visible "Last reviewed" line. */
  dateModified: string | null;
  /** Plain-text excerpt derived from the post body at content-load time.
   *  Used for cards on the index and category pages. Body markdown lives
   *  in the MDX entry and is rendered via <Content /> on the slug page. */
  excerpt: string | null;
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
