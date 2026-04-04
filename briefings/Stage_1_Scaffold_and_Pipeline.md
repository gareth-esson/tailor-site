# Stage 1 — Scaffold and pipeline

*Briefing document for Claude Code. Read this first, then read the referenced files.*

---

## What you're building

An Astro static site that pulls content from five Notion databases at build time and generates static HTML pages. This stage builds the project scaffold, the Notion content pipeline, and the route structure. No page templates, no styling, no components — just the data layer and project skeleton.

## Context

This is the Tailor Education website at tailoreducation.org.uk. It has two emotional layers — a professional teacher-facing showcase (Tailor) and a warm young-person-facing content layer (Okay to Ask) — but they share one codebase, one domain, and one build pipeline. The design system and page templates come in later stages.

The site replaces an existing WordPress site. The existing URL `/anonymous_question/{slug}` must be preserved exactly (no redirect needed — the new site uses the same pattern).

## Files to read for this stage

Read sections 1 and 2 only (tech stack, content pipeline, Notion database schemas):

```
docs/Tailor_Content_Site_Build_Spec_v1.md
```

No other files are needed for this stage. Do not read the CSS, art direction, or page content spec yet.

## Tech stack

| Component | Technology |
|-----------|-----------|
| Static site generator | Astro |
| Content source | Notion API (five databases) |
| Hosting | Vercel |
| Package manager | npm |
| Language | TypeScript |

## What to build

### 1. Astro project scaffold

Initialise a new Astro project with TypeScript in `src/`. Configure for static output (SSG). Set up Vercel adapter. No Tailwind at this stage — layout CSS comes later.

### 2. Notion API integration

Create a reusable Notion client that handles:

- Authentication via `NOTION_API_KEY` environment variable
- Database queries with pagination (Notion returns max 100 results per request — you must paginate to get all records)
- Rich text block fetching for page body content (the `/blocks/{id}/children` endpoint, also paginated)
- Error handling and retry logic

### 3. Five database fetchers

One fetcher per database. Each fetcher queries its database, paginates through all results, and returns typed TypeScript objects.

**Questions database** (existing)
- Database ID: `cd6d5a28-64a7-4809-84e1-483e4a4ac259`
- Filter: Status = "Published"
- Key fields: Question (title), Slug, Status, Topic (relation), Content Tags, Age Tier, Original Category, Glossary Terms (relation), Related Questions (self-relation), Meta Title, Meta Description, Signposting, Has Post-it Scan, Image URL, Simple Answer, Okay to Ask Category, Notes
- Also fetch: page body content (the answer text — rich text blocks)

**Glossary database** (existing)
- Database ID: `c844695c-a72f-496f-9fef-3e72cdf25f02`
- Filter: Status = "Published"
- Key fields: Term (title), Slug, Status, Short Definition, Simple Definition, Topic (relation), Related Terms (self-relation), Referenced In (reverse relation), Needs Diagram, Meta Title, Meta Description
- Also fetch: page body content (the full explainer)

**Topics database** (existing)
- Database ID: `16dde54c-a2e1-47c2-8c84-f84fa602f6e9`
- No status filter — fetch all
- Key fields: Topic Name (title), Slug, Category, Topic Number

**Landing Pages database** (to be created by Gareth before build)
- Database ID: will be provided — use an environment variable `NOTION_LANDING_PAGES_DB`
- Key fields: Title (title), Slug, Category, Granular Topics (relation → Topics DB), Service CTA Target, Meta Title, Meta Description
- Also fetch: page body content (overview, curriculum mapping)

**Blog database** (to be created by Gareth before build)
- Database ID: will be provided — use an environment variable `NOTION_BLOG_DB`
- Filter: Status = "Published"
- Key fields: Title (title), Slug, Status, Topic (relation), Secondary Topics (relation), Content Tags, Meta Title, Meta Description, Target Audience, Service Link, Author
- Also fetch: page body content

### 4. Content type definitions

TypeScript interfaces for each content type. These will be consumed by page templates in later stages. Define them now so the fetchers are properly typed.

### 5. Route structure

Set up the Astro page files (empty shells — just the route, no content):

```
src/pages/
├── index.astro                         → /
├── about.astro                         → /about
├── training.astro                      → /training
├── services/
│   ├── index.astro                     → /services
│   ├── delivery.astro                  → /services/delivery
│   ├── drop-days.astro                 → /services/drop-days
│   └── consultancy.astro               → /services/consultancy
├── our-approach.astro                  → /our-approach
├── testimonials.astro                  → /testimonials
├── contact.astro                       → /contact
├── book.astro                          → /book
├── privacy.astro                       → /privacy
├── accessibility.astro                 → /accessibility
├── blog/
│   ├── index.astro                     → /blog/
│   └── [...slug].astro                 → /blog/{slug}
├── topics/
│   ├── index.astro                     → /topics/ (optional browse page)
│   └── [...slug].astro                 → /topics/{slug}
├── questions/
│   └── index.astro                     → /questions/
├── anonymous_question/
│   └── [...slug].astro                 → /anonymous_question/{slug}
├── glossary/
│   └── [...slug].astro                 → /glossary/{slug}
└── search.astro                        → /search
```

### 6. Build-time data loading

Create a `src/lib/content.ts` module that:

- Calls all five fetchers at build time
- Resolves Notion relations into usable references (e.g. a question's Topic relation resolves to the full topic object with its slug, name, and category)
- Builds a glossary term index for tooltip matching in later stages
- Exports typed collections that page templates can import

### 7. Environment configuration

`.env.example` with:
```
NOTION_API_KEY=
NOTION_LANDING_PAGES_DB=
NOTION_BLOG_DB=
```

The three existing database IDs are hardcoded (they won't change). The two new databases use env vars because Gareth hasn't created them yet.

## What "done" looks like

1. `npm run build` succeeds
2. Build log shows all records fetched from all five databases (with counts)
3. All routes resolve (even though pages are empty shells)
4. TypeScript compiles with no errors
5. The content module exports typed collections that a page template could consume like:

```typescript
import { getQuestions, getGlossaryTerms, getTopics, getLandingPages, getBlogPosts } from '../lib/content';

const questions = await getQuestions();
// questions[0].question, questions[0].slug, questions[0].topic.name, etc.
```

## What NOT to build

- No CSS, no design system integration, no fonts
- No page templates or components
- No search (Pagefind comes in Stage 6)
- No analytics
- No SEO metadata generation
- No internal link resolution beyond relation lookups
- No image handling beyond storing the Image URL string

## Important technical notes

- Notion's `notion-search` endpoint returns max ~25 results with no pagination. Use `/databases/{id}/query` with `start_cursor` pagination instead.
- Notion relation fields return page IDs, not page data. You need a second lookup to resolve them to full objects. Do this resolution in the content module, not in individual page templates.
- Rich text blocks from Notion page bodies need to be fetched separately via `/blocks/{page_id}/children`. This endpoint is also paginated.
- The Questions database has ~152 entries. The Glossary has ~80–100. Topics has 83. Landing Pages will have ~27. Blog will have ~20. Total: ~360 pages. Not a heavy build.

---

*Stage 1 of 6. Next stage: Design system integration.*
