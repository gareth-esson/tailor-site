# Tailor Education — Content site build spec v1

*Implementation specification for the Astro content site at tailoreducation.org.uk. This document tells a developer exactly what to build. For the strategic context — why these decisions were made, who the audiences are, and how the pieces fit together — see the companion document: **Tailor_Content_Site_Strategy_v4.2.md**.*

*Component and page reference codes (A1, B1, C1, etc.) match the Site Structure document (Tailor_Site_Structure_v1.md) and Page Content Spec (Tailor_Page_Content_Spec_v1.md). Use these codes to cross-reference between documents.*

*Author: Gareth Esson / technical advisory sessions, March 2026*

---

## 1. Tech stack and content pipeline

### Stack

| Component | Technology |
|-----------|-----------|
| Static site generator | Astro |
| Content source | Notion API (four databases) |
| Hosting | Vercel |
| Search | Pagefind (client-side, build-time index) |
| Analytics | Google Analytics 4 |
| Forms | Resend via Vercel serverless function (see section 3.7) |
| Design system | CSS custom properties (Gareth provides tokens at build start) |
| Interactive elements | Astro component islands (glossary tooltips [A7], age-flag interstitials [D1], search [A4/A5], Simple Mode toggle [A6]) |

### Content pipeline

1. **Fetch** — At build time, pull all content from five Notion databases via the Notion API:
   - Questions (data source ID: `cd6d5a28-64a7-4809-84e1-483e4a4ac259`)
   - Glossary (data source ID: `c844695c-a72f-496f-9fef-3e72cdf25f02`)
   - Topics (data source ID: `16dde54c-a2e1-47c2-8c84-f84fa602f6e9`)
   - Landing Pages (database ID: `b74ee20388924181803416529f35f1e2`, data source ID: `d09bf1ff-a7c9-49ef-bc51-a4c067e966a6`)
   - Blog (data source ID: `f7a3dbbf-8730-4e70-aacb-c1eb898e6ca4`)

2. **Generate pages** — Create static HTML pages for each content type from Astro templates.

3. **Generate internal links** — Resolve Notion relations into page URLs:
   - Question → Topic(s)
   - Question → Glossary terms
   - Question → Related questions (see selection rules in section 5)
   - Glossary → Topic(s)
   - Glossary → Related terms
   - Glossary → Questions that reference this term (reverse relation)
   - Blog → Topic(s)
   - Blog → Related blog posts
   - Topic → all linked questions, glossary terms, and blog posts (aggregation)

4. **Generate glossary tooltips** — Scan page body content for glossary term matches (see rules in section 5).

5. **Generate search index** — Pagefind indexes all rendered pages, plus inject topic aliases as searchable metadata (see section 7).

6. **Build SEO assets** — Sitemap, robots.txt, JSON-LD structured data, OG tags (see section 9).

7. **Deploy** — Push to Vercel. Rebuild triggered manually or via Notion webhook.

### Design integration

Gareth will provide a design and art direction document at build start. All markup should use CSS custom properties — no hardcoded hex values, font sizes, or spacing values. The build should produce token-ready HTML that Gareth's design system can style.

---

## 2. Notion database schemas

### Questions database (existing)

Data source ID: `cd6d5a28-64a7-4809-84e1-483e4a4ac259`

| Field | Type | Notes |
|-------|------|-------|
| Question | title | The question text, used as page title |
| Slug | text | URL-safe slug for `/anonymous_question/{slug}` |
| Status | select | Draft / In Review / Final / Published |
| Topic | relation → Topics DB | Primary topic |
| Content Tags | multi-select | For filtering and related question matching |
| Age Tier | select | Open / Age-flagged Year 9+ / Dual-answer |
| Original Category | select | Source category from original post-it sorting |
| Glossary Terms | relation → Glossary DB | Terms used in this answer (reverse: "Referenced In" on Glossary) |
| Okay to Ask Category | select | Anatomy / Puberty / Relationships / Sex / Sexual Health / Sex & the Law / Contraception & Pregnancy. Drives B8 browsing. |
| Meta Title | text | SEO title |
| Meta Description | text | SEO description |
| Signposting | multi-select | Which support services to show (Childline, Brook, The Mix, etc.) |
| Has Post-it Scan | checkbox | |
| Image URL | text | URL to the scanned post-it image |
| Simple Answer | text | Plain-language version of the answer for Simple Mode. No jargon. Tooltips within Simple Answers show Simple Definitions. |
| Notes | text | Internal notes |

Standard answer text and signposting block live in the page body content.

### Glossary database (existing)

Data source ID: `c844695c-a72f-496f-9fef-3e72cdf25f02`

| Field | Type | Notes |
|-------|------|-------|
| Term | title | The glossary term |
| Slug | text | URL-safe slug for `/glossary/{slug}` |
| Status | select | Draft / Published |
| Short Definition | text | Tooltip text in standard mode. One or two sentences. Written for age 11+. Uses correct terminology. |
| Simple Definition | text | Tooltip text in simple mode. One or two sentences. Maximum clarity. No jargon. No terms requiring their own glossary entry. |
| Topic | relation → Topics DB | Primary topic |
| Related Terms | self-relation | Links to other glossary entries |
| Referenced In | reverse relation from Questions DB | Auto-populated |
| Needs Diagram | checkbox | Flagged for future illustration |
| Meta Title | text | SEO title |
| Meta Description | text | SEO description |

**Page body content (standard view):** Full rich explainer in the Notion page body. As long as needed. Can reference diagrams. Written for age 11+.

**Simple Explainer:** A separate text property or a clearly demarcated section in the page body. Shorter, plainer version covering the same ground. No jargon. No complex formatting. 150–250 words.

### Topics database (existing)

Data source ID: `16dde54c-a2e1-47c2-8c84-f84fa602f6e9`

| Field | Type | Notes |
|-------|------|-------|
| Topic Name | title | Display name |
| Slug | text | URL-safe slug for `/topics/{slug}` — must match app slugs exactly |
| Category | select | One of 7 categories |
| Crisis Service | select | Childline / Women's Aid / NSPCC / CEOP / Galop / The Mix / none. Drives the A9 crisis support component. |
| Topic Number | number | Ordering within category |

Landing page body content (overview, curriculum mapping, learning objectives) is pulled from the Notion page body at build time.

### Blog database

| Field | Type | Notes |
|-------|------|-------|
| Title | title | Blog post title |
| Slug | text | URL-safe slug for `/blog/{slug}` |
| Status | select | Draft / In Review / Published |
| Topic | relation → Landing Pages DB | Primary landing page this post relates to |
| Secondary Topics | relation → Landing Pages DB | Additional landing page tags |
| Content Tags | multi-select | For filtering and related post matching |
| Meta Title | text | SEO title |
| Meta Description | text | SEO description |
| Target Audience | select | teachers / school leaders / parents |
| Service Link | select | delivery / training / drop-days / rse-policy-curriculum-planning / none |
| Author | text | Byline name — team member who wrote it |

Body content in the page.

---

## 3. Page templates

Each page type has a defined template. Templates are Astro components that pull data from Notion and render HTML with the correct structure, internal links, CTAs, and metadata. Reference codes match the Site Structure document.

### 3.1 Question page [C1] (`/anonymous_question/{slug}`)

One page, one URL, two views. Both standard and simple answer content are rendered in the HTML at build time. JavaScript toggles visibility based on the reader's stored preference.

```
┌─────────────────────────────────────────────────────┐
│  [CONDITIONAL: Crisis support component — A9]        │
│  Only renders if question's topic is in              │
│  Safety & Safeguarding category, or content          │
│  sensitivity is "specialist" or "mandatory_reporting" │
│  Prominent, visually distinct, not dismissable.      │
│  Shows most relevant crisis service for this topic.  │
│  Same in both Standard and Simple mode.              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  [CONDITIONAL: Age flag interstitial — D1]           │
│  Only renders if Age Tier = "Age-flagged Year 9+"    │
│  Shows topic label, Year 9+ note, link to           │
│  foundational content, "Continue to answer" button.  │
│  Same in both modes.                                 │
└─────────────────────────────────────────────────────┘

  Post-it image (from Image URL field)
  — Same in both modes.

  Reading level toggle [A6]: [Standard] / [Simple]
  Reads from localStorage on page load. No flash of 
  wrong content — check preference before first render.

  ┌─ STANDARD VIEW (default) ──────────────────────┐
  │  Answer body content (from Notion page body)     │
  │    — with inline glossary tooltips [A7] showing  │
  │      Short Definition                            │
  └──────────────────────────────────────────────────┘

  ┌─ SIMPLE VIEW (toggled) ────────────────────────┐
  │  Simple Answer (from Simple Answer property)    │
  │    — with inline glossary tooltips [A7] showing │
  │      Simple Definition                          │
  └─────────────────────────────────────────────────┘

  — Everything below is the same in both modes —

  Signposting block [A8]:
  Support services from Signposting field.
  Persistent, not dismissable.
  Immediately after the answer.
  
  End-of-answer panel [A17]:
  Three panels, same on every question page:
  1. "Get the book" → /book (Stripe payment link)
  2. "Explore how to teach this topic" 
     → /topics/{primary_landing_page_slug}
  3. "Bring RSE into your school" 
     → /services or /rse-training

  Related questions [A15]:
  3–5 links (see selection rules in section 5)

  Topic tags [A16]:
  Links to parent landing page(s)
```

### 3.2 Glossary page [C2] (`/glossary/{slug}`)

One page, one URL, two views. Both views are rendered in the HTML at build time. JavaScript toggles visibility. No separate pages.

```
  Term heading

  Reading level toggle [A6]: [Standard] / [Simple]
  Default: Standard. Persists via cookie/localStorage.
  If the reader has previously chosen Simple anywhere 
  on the site, this page loads in Simple mode.

  ┌─ STANDARD VIEW (default) ──────────────────────┐
  │  Short Definition (prominent — the tooltip text) │
  │                                                   │
  │  Extended explainer (from Notion page body)       │
  │    — with inline glossary tooltips [A7]           │
  │                                                   │
  │  [FUTURE: Diagram/illustration]                   │
  └───────────────────────────────────────────────────┘

  ┌─ SIMPLE VIEW (toggled) ───────────────────────────┐
  │  Simple Definition                                  │
  │                                                     │
  │  Simple Explainer (150–250 words, no jargon,        │
  │  no formatting, no terms needing their own entry)   │
  │                                                     │
  │  [Diagrams still show if present — visuals help     │
  │   the simple audience too]                          │
  └─────────────────────────────────────────────────────┘

  — Everything below is the same in both views —

  Related glossary terms [A15]:
  Links from Related Terms self-relation
  
  Questions that reference this term [A15]:
  Links from Referenced In reverse relation

  Signposting block [A8] (if relevant to topic)

  CTA: "Explore [topic name] →"
  → links to /topics/{primary_topic_slug}

  Topic tags [A16]
```

**SEO:** Google indexes the standard view (the default rendered content). The simple view is present in the HTML but hidden by default, so it won't confuse crawlers. No `noindex` needed — both views are on the same URL.

**Accessibility:** The toggle must be keyboard-accessible and announce the state change to screen readers (use `aria-pressed` or equivalent).

### 3.3 Landing page [C3] (`/topics/{slug}`)

22 instances. Each landing page aggregates one or more of the 87 granular app topics. Questions, glossary terms, and blog posts are pulled in from all underlying granular topics.

```
  Landing page title + category label
  
  Overview: what this topic covers and why it matters.
  Makes clear what the landing page encompasses.
  (Body content from Notion page body)
  
  Curriculum mapping:
  DfE 2026 references, PSHE Association references
  
  Learning objectives (by key stage where relevant)

  CTA [A11] (mid-page): "Explore ready-made lessons on [topic]"
  → app library filtered by the relevant granular topic slug(s)

  Questions young people ask [A15]:
  Auto-populated from Questions DB where any underlying 
  granular topic matches.
  Shows question title + category tag. Links to question pages.

  Key terms [A15]:
  Auto-populated from Glossary DB where any underlying
  granular topic matches.
  Shows term + short definition. Links to glossary pages.

  [CONDITIONAL: For teachers — further reading] [A15]
  Only renders if blog posts exist tagged to any underlying topic.
  Auto-populated from Blog DB where Topic or 
  Secondary Topics match any underlying topic.
  Shows post title + target audience label.

  Related landing pages:
  Links to other landing pages in the same category,
  plus thematically related cross-category pages.

  CTA [A12] (bottom): "Bring [topic] into your school"
  → target varies by landing page (see section 4)
```

### 3.4 Blog post [C4] (`/blog/{slug}`)

```
  Title
  Author byline + date + share button
  Target audience label (teachers / school leaders / parents)

  Body content (from Notion page body)
    — with inline glossary tooltips [A7]
    — author-placed inline CTAs in body text (manual)

  Topic tags [A16]:
  Links to landing pages (from Topic + Secondary Topics)
  
  Related blog posts [A15]:
  2–3 other posts, selected by shared topics/content tags

  CTA [A13] (bottom):
  If Service Link ≠ "none":
    "Want help with [service]? Talk to us"
    → enquiry form pre-tagged with service type
  If Service Link = "none":
    "Explore lessons on [topic] →"
    → app library filtered by primary topic
```

### 3.5 Services page [C5] (`/services/{type}`)

```
  Service name + description
  
  Who it's for
  What's included
  What schools get
  
  CTA [A13] (primary): "Enquire about [service]"
  → enquiry form [E1] (inline or /contact) 
    pre-tagged with service type

  Testimonial pull quote (relevant to this service)
  → links to /testimonials
  
  Related blog posts [A15]:
  Posts where Service Link matches this service type.

  Topics overview grid:
  Selection of the 23 landing pages as browsable cards.
  Same grid across all service pages — shows breadth.
  Links to /topics/{slug}.

  CTA [A13] (repeated): "Enquire about [service]"
  → same as primary CTA, repeated at bottom of page
```

### 3.6 Homepage [B1]

```
  Teacher pathway:
    Hero CTA: "Explore RSE lessons" → app library or /topics
    Secondary CTA: "Training and services for schools" → /services
  
  Young person pathway:
    Hero CTA: "Got a question? Okay to Ask." → /questions/
```

### 3.7 Enquiry form [E1] (on `/contact` and/or inline on service pages)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | text | Yes | |
| Email | email | Yes | |
| School name | text | Yes | |
| Service interested in | select | Yes | Pre-selected if arrived from a service page. Options: Direct RSE delivery / RSE training / Drop day delivery / RSE policy & curriculum planning / Other |
| Key stage or year group | text | No | |
| Preferred timing | text | No | |
| Message | textarea | No | |

Submissions are sent to the team's email. No CRM at launch.

**Implementation: Resend via Vercel serverless function.**

The form posts to `/api/enquiry`, an Astro API route deployed as a Vercel serverless function. The function:

1. Validates required fields (name, email, school, service)
2. Sanitises input
3. Sends a formatted email to Gareth via the existing Resend account (already set up for the Tailor app's magic link auth)
4. Returns a JSON success/error response

The form UI handles states per D6 in the page content spec: empty (with pre-selected service if arrived from a service page), partially filled, validation errors, submitting (loading), and success confirmation.

No third-party form service needed. No submission limits. No data passing through external services. The Resend API key is already in the Vercel environment variables from the app build.

---

## 4. CTA placement rules

### Landing pages [C3]

| Position | CTA | Target | Logic |
|----------|-----|--------|-------|
| Mid-page (after overview, before questions list) | [A11] "Explore ready-made lessons on [topic]" | App library filtered by relevant granular topic slug(s) | Always present |
| Bottom of page | [A12] "Bring [topic] into your school" | Contextual — see below | Always present |
| Blog section | Blog post cards [A15] are the CTA | Blog posts tagged to underlying topics | Conditional — only if posts exist |

**Bottom CTA targeting logic:** The target of "Bring [topic] into your school" varies by landing page. Pages where direct delivery is the natural next step (e.g. FGM, consent, pornography, sexual exploitation) link to `/services/delivery`. Pages where training/CPD is the natural next step (e.g. healthy relationships, puberty) link to `/rse-training`. This mapping needs a field on the Landing Pages database. Recommendation: a "Service CTA Target" select field with options: delivery / training / drop-days / rse-policy-curriculum-planning. Default: training.

### Blog posts [C4]

| Position | CTA | Target | Logic |
|----------|-----|--------|-------|
| Inline (in body) | Author-written, natural to the content | Relevant service page | Manual — written into the post body |
| Bottom of post | [A13] "Want help with [service]? Talk to us" | Enquiry form [E1] pre-tagged with service type | Only if Service Link ≠ "none" |
| Bottom of post (fallback) | "Explore lessons on [topic] →" | App library filtered by primary topic | Only if Service Link = "none" |

### Question pages [C1]

| Position | CTA | Target | Logic |
|----------|-----|--------|-------|
| After signposting block | [A17] End-of-answer panel — three panels | Panel 1: `/book` (Stripe payment link). Panel 2: `/topics/{primary_landing_page_slug}`. Panel 3: `/services` or `/rse-training`. | Always present on every question page. |

### Glossary pages [C2]

| Position | CTA | Target | Logic |
|----------|-----|--------|-------|
| Bottom of page | "Explore [topic name] →" | `/topics/{primary_landing_page_slug}` | Always present |

No services CTA on glossary pages. The pathway is: glossary → landing page → services/app.

### Services and training pages [C5, B4]

| Position | CTA | Target | Logic |
|----------|-----|--------|-------|
| Below service description | [A13] "Enquire about [service]" | Enquiry form [E1] pre-tagged | Always present — this is the conversion action |
| Below testimonial/blog section | Topics overview grid | 23 landing pages as browsable cards | Always present — shows breadth |
| Bottom of page | [A13] "Enquire about [service]" (repeated) | Enquiry form [E1] pre-tagged | Same CTA repeated at bottom |

### Homepage [B1]

| Position | CTA | Target |
|----------|-----|--------|
| Teacher pathway hero | "Explore RSE lessons" | App library or `/topics` |
| Teacher pathway secondary | "Training and services for schools" | `/services` |
| Young person pathway hero | "Got a question? Okay to Ask." | `/questions/` |
| Okay to Ask section | "The Okay to Ask book is here" | `/book` |

---

## 5. Internal linking generation rules

These rules define what the Astro build generates automatically from Notion data. They are not editorial suggestions — they are build requirements.

### Related question selection

Each question page shows 3–5 related questions. Selection is driven by the granular topic tagging — no manual override field needed.

Selection logic:
1. Other questions sharing the same primary granular Topic. This is the primary mechanism — granular topics are specific enough (e.g. "Consent", "Managing puberty: hygiene and self-care") that questions within the same topic are genuinely related.
2. If fewer than 3 results, expand to other questions tagged to any granular topic that shares the same landing page.

Cap at 5. Exclude the current question from results.

### Glossary tooltip matching [A7]

Scan the rendered text content of question answers (both standard and simple), blog post bodies, and landing page descriptions for exact matches against glossary term names (case-insensitive).

Rules:
- Only the **first occurrence** of each term per page is tooltipped.
- In **Standard mode**: the tooltip shows the **Short Definition** field.
- In **Simple mode**: the tooltip shows the **Simple Definition** field.
- The tooltip links to `/glossary/{slug}`.
- Do not tooltip a term on its own glossary page.
- Do not tooltip inside headings, image alt text, or other tooltips.
- Match whole words only (not partial matches — "consent" should not match "consenting").

**Reading level persistence:** The Standard/Simple preference is a site-wide setting, not per-page. When a reader toggles to "Simple" on any page, a localStorage value is set (e.g. `simple_mode=true`). On every page load, the page checks this value and renders the correct view immediately — no flash of wrong content. The toggle on every page reads and writes this same value.

**Writing rules — what can reference glossary terms:**

| Content layer | Can use glossary terms? | Why |
|--------------|------------------------|-----|
| Standard answer | Yes | Tooltips show Short Definition |
| Simple Answer | Yes | Tooltips show Simple Definition |
| Standard explainer | Yes | Tooltips show Short Definition |
| Simple Explainer | Yes | Tooltips show Simple Definition |
| Short Definition (tooltip) | Yes, sparingly | Reader can click through to glossary page |
| Simple Definition (tooltip) | **No** | This is the end of the line. No tooltip within a tooltip. Must be understood completely on its own. |

### Related blog post selection

Each blog post shows 2–3 related posts. Selection logic:

1. Other posts sharing the same primary Topic.
2. Other posts sharing Content Tags.
3. Fallback: other posts with the same Target Audience.

### Landing page aggregation

Each landing page maps to one or more of the 87 granular app topics. It auto-populates three content lists by pulling from all its underlying granular topics:

- **Questions:** All questions where the Topic relation includes any of this landing page's underlying granular topics. Sorted by: questions with answers first, then alphabetically.
- **Glossary terms:** All glossary entries where the Topic relation includes any underlying granular topic. Sorted alphabetically.
- **Blog posts:** All blog posts where Topic or Secondary Topics includes any underlying granular topic. Sorted by date (newest first). This section only renders if at least one post exists.

The mapping between landing pages and granular topics is defined in the Landing Pages database.

---

## 6. Crisis support component [A9]

### Trigger conditions

The crisis support component renders on a question page if ANY of these conditions are true:
- The question's primary Topic is in the **Safety & Safeguarding** category
- The question's Content Tags include any safeguarding-related tags (TBD — Gareth to define the specific tags)

### Behaviour

- Positioned above the answer, below any age flag interstitial
- Visually distinct from the answer content (design is Gareth's decision)
- Not dismissable
- Shows the most relevant crisis service for the question's topic:

| Topic area | Primary service | Fallback |
|-----------|----------------|----------|
| Abuse / domestic abuse | Childline (0800 1111) | Women's Aid |
| Sexual abuse / exploitation | Childline (0800 1111) | NSPCC |
| Online safety / image sharing | Childline (0800 1111) | CEOP |
| LGBT+ specific | Galop (0800 999 5428) | Childline |
| Self-harm / mental health | Childline (0800 1111) | The Mix |
| General / unclear | Childline (0800 1111) | — |

This mapping should be configurable — not hardcoded as a switch statement. Recommendation: add a "Crisis Service" select field to the Topics database.

### Support service contact details

This is the complete lookup table for all support services referenced by the signposting block (A8) and crisis support component (A9). The Signposting multi-select field on the Questions database uses these service names as values.

| Service | What they help with | Phone | URL | When to show |
|---------|-------------------|-------|-----|-------------|
| Childline | Any issue affecting under-19s. Abuse, bullying, mental health, relationships, sexual health. | 0800 1111 (free, 24/7) | childline.org.uk | Default for most questions. Primary crisis service. |
| Brook | Sexual health, contraception, relationships, STIs. For under-25s. | Local clinic finder on website | brook.org.uk | Questions about sexual health, contraception, STIs, pregnancy. |
| The Mix | Mental health, drugs, homelessness, money, sex, relationships. For under-25s. | 0808 808 4994 (free) | themix.org.uk | Mental health, drugs/alcohol, general wellbeing. |
| NSPCC | Child abuse and neglect. For children and adults concerned about a child. | Childline: 0800 1111 / Adult helpline: 0808 800 5000 | nspcc.org.uk | Abuse, exploitation, safeguarding concerns. |
| Women's Aid | Domestic abuse. For women and children. | Live chat on website (no phone to avoid risk) | womensaid.org.uk | Domestic abuse, coercive control, unhealthy relationships with abuse indicators. |
| NHS Sexual Health | Sexual health services, STI testing, contraception. | Local clinic finder on website | nhs.uk/service-search/sexual-health | STI testing, contraception access, sexual health services. |
| Galop | LGBT+ hate crime and domestic abuse. | 0800 999 5428 (free) | galop.org.uk | LGBT+-specific questions about abuse, hate crime, or relationship violence. |
| CEOP | Online exploitation and abuse of children. Reporting tool. | Report button on website (no phone) | ceop.police.uk | Online grooming, image sharing, sextortion, online exploitation. |

---

## 7. Site search

### Technology

**Pagefind** — Astro-native, generates a static search index at build time, runs entirely client-side. No server, no API, no external service.

### Search bar [A4]

- Persistent in the site header, visible on every page
- On mobile: collapses to a search icon, expands on tap
- Same visual element across the whole site (doesn't change between Tailor and Okay to Ask sections)

### Searchable content

| Content type | Indexed fields | Display in results |
|-------------|---------------|-------------------|
| Questions | Question title, answer body text, content tags | Question title, topic tag, "Okay to Ask" label |
| Glossary terms | Term name, short definition | Term, short definition |
| Topics | Topic name, category, **search aliases** | Topic name, category |
| Blog posts | Title, body text, content tags | Title, target audience label |
| Services/training | Page title, description | Page title, "Services" label |

### Topic aliases in search

Each topic in the app has 20–30 search aliases (e.g. "porn", "explicit content", "pornography" all map to the same topic). These aliases must be included in the Pagefind search index as metadata on landing pages, even though they don't appear in the visible page content.

Implementation: add a hidden `<div data-pagefind-meta="aliases">` element to landing pages containing the comma-separated aliases. Pagefind will index it.

### Search behaviour

**Instant results dropdown [A5]:**
- Triggers after 2+ characters typed
- Dropdown panel below the search bar
- Top 5–8 results, grouped by content type
- "See all results" link at the bottom

**Full results page [B10] (`/search?q={query}`):**
- All matches grouped by content type (Questions, Glossary, Topics, Blog, Services)
- Up to 5 results per group with "Show all" toggle
- Ranked by relevance, not alphabetically

---

## 8. Analytics (GA4 event map)

The content site has its own analytics, separate from the app's analytics (defined in Tailor_Signup_Onboarding_Flow_v1.docx, section 11).

### Events

| Event | Properties | Purpose |
|-------|-----------|---------|
| `question_page_view` | slug, topic, age_tier, source (organic/social/direct) | Content performance |
| `question_to_topic_click` | question_slug, topic_slug | Internal linking effectiveness |
| `topic_to_app_click` | topic_slug | Funnel: content → app |
| `topic_to_service_click` | topic_slug, service_type | Funnel: content → services |
| `glossary_tooltip_click` | term_slug, source_page_slug | Glossary engagement |
| `blog_to_topic_click` | blog_slug, topic_slug | Blog linking effectiveness |
| `blog_to_service_click` | blog_slug, service_type | Blog → services funnel |
| `service_enquiry_started` | service_type, source_page | Conversion: form opened |
| `service_enquiry_submitted` | service_type, source_page | Conversion: form completed |
| `signposting_click` | service_name (Childline/Brook/etc), question_slug | Support service usage |
| `crisis_support_click` | service_name, question_slug | Crisis component engagement |
| `age_flag_shown` | question_slug | Age-flagged content |
| `age_flag_continue` | question_slug | Continue past age flag |
| `age_flag_redirect` | question_slug, redirect_slug | Chose foundational content |
| `related_question_click` | source_slug, target_slug | Cross-linking engagement |
| `site_search_query` | query, result_count, source_page | Search usage and zero-result queries |
| `site_search_result_click` | query, result_slug, result_type, position | Search effectiveness |
| `cta_click` | cta_type, source_page_slug, target | CTA conversion by placement |

**`cta_type` values:** `explore_lessons`, `bring_to_school`, `get_the_book`, `teach_this_topic`, `enquire_service`, `blog_to_service`, `blog_to_app`, `glossary_to_topic`

### Content performance reporting

Track per content type (question, glossary, landing page, blog post):
- Page views
- Organic search impressions and clicks (via Search Console)
- Average position
- Internal link clicks (to other pages)
- Exit rate

This tells you which content is working as an entry point (SEO), which is working as a connector (internal links), and which is a dead end.

---

## 9. SEO infrastructure

All built in from day one. Non-negotiable.

### Per-page metadata

Every page must have:
- Unique `<title>` (see meta title convention in strategy doc)
- Unique `<meta name="description">` (from Meta Description field, or auto-generated)
- `<link rel="canonical">` (self-referencing)
- Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- Twitter Card tags: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

### JSON-LD structured data

| Page type | Schema type | Key properties |
|-----------|------------|----------------|
| Question pages [C1] | `FAQPage` or `Article` | question text, answer text, datePublished |
| Glossary pages [C2] | `DefinedTerm` | name, description |
| Landing pages [C3] | `WebPage` with `about` | name, description, educationalLevel |
| Blog posts [C4] | `Article` | headline, author, datePublished, articleSection |
| Service pages [C5] | `Service` | name, description, provider |

### Sitemap

Auto-generated at build time. Includes all published pages across all content types. Submitted to Google Search Console.

### robots.txt

```
User-agent: *
Allow: /
Sitemap: https://tailoreducation.org.uk/sitemap.xml
```

### 301 redirects (WordPress migration)

Question page URLs are preserved from the existing WordPress site (`/anonymous_question/{slug}`) — no redirect needed. Other WordPress URLs must 301 redirect to their new equivalents:

| Old URL pattern | New URL pattern |
|----------------|-----------------|
| `/topic/{slug}` | `/topics/{slug}` |
| `/category/{cat}` | `/topics/` (or nearest equivalent landing page) |
| Any other indexed WordPress page | Nearest equivalent or `/` |

**Critical:** The existing position 1–2 rankings must be preserved:
- `/anonymous_question/if-i-played-with-myself-am-i-a-virgin/` (25,556 impressions, position 1.92)
- `/anonymous_question/are-you-a-slag-if-you-get-an-std/` (774 impressions, position 1.82)

These URLs are unchanged in the new site, so no redirect is needed — but verify they resolve correctly after deployment. Test with `curl -I`.

Build a full redirect map from the existing WordPress URL structure for the remaining pages before migration.

### Domain redirects

| Source | Target | Type |
|--------|--------|------|
| oktoask.co.uk | tailoreducation.org.uk/questions/ | 301 |
| oktoask.org.uk | tailoreducation.org.uk/questions/ | 301 |
| okaytoask.co.uk | tailoreducation.org.uk/questions/ | 301 |
| okaytoask.org.uk | tailoreducation.org.uk/questions/ | 301 |
| nosillyquestions.co.uk | tailoreducation.org.uk/questions/ | 301 |
| nosillyquestions.org.uk | tailoreducation.org.uk/questions/ | 301 |
| tailor-rse.co.uk | tailoreducation.org.uk | 301 |

### GA4 and Search Console

- GA4 property configured with the event map from section 8
- Google Search Console verified for tailoreducation.org.uk
- Both operational before launch, not after

---

## 10. Notion database status

### All databases ready for build:
- **Questions** — data source ID: `cd6d5a28-64a7-4809-84e1-483e4a4ac259`. Okay to Ask Category field added and populated ✓. Simple Answer field populated for all 152 questions ✓.
- **Glossary** — data source ID: `c844695c-a72f-496f-9fef-3e72cdf25f02`. Simple Definition and Simple Explainer fields populated ✓.
- **Topics** (87 granular app topics) — data source ID: `16dde54c-a2e1-47c2-8c84-f84fa602f6e9`. Crisis Service field added and populated ✓.
- **Landing Pages** — database ID: `b74ee20388924181803416529f35f1e2`, data source ID: `d09bf1ff-a7c9-49ef-bc51-a4c067e966a6`. 22 pages populated with titles, slugs, categories, tiers, Service CTA targets, meta titles/descriptions, and granular topic relations ✓.
- **Blog** — data source ID: `f7a3dbbf-8730-4e70-aacb-c1eb898e6ca4`. Empty, ready for blog post content.

All database fields are in place. No schema changes needed before the build starts.

---

## 11. Resolved decisions

| Decision | Resolution |
|----------|-----------|
| Domain strategy | **Option A — subdomain split.** `tailoreducation.org.uk` = Astro content site. `app.tailoreducation.org.uk` = Next.js Tailor app. Two separate Vercel projects. SEO authority lives on the content site; the app is a tool behind auth. Consolidate later if SEO data justifies it. |
| Landing page body content | **Notion page body.** Same pipeline as questions and glossary — pull at build time from the Landing Pages database. |
| Form provider | **Resend via Vercel serverless function.** See section 3.7 for implementation detail. |
| Simple content launch timing | **Standard and simple launch together.** All simple content is written and populated. No graceful fallback needed. |
| Cross-cutting service/audience pages | **Two service dropdowns in the nav.** "RSE Delivery" dropdown contains: RSE for primary schools, RSE for secondary schools, RSE for SEND & alternative provision (Circuits), Direct RSE delivery, Drop days. "RSE Training & Support" dropdown contains: RSE Training (`/rse-training`), RSE Policy & Curriculum Planning (`/services/rse-policy-curriculum-planning`). "Services" removed as a top-level nav item. The `/services` hub page may be retained as an SEO landing page but is not in the primary navigation. |
| Circuits (SEND/AP product) | **Dedicated page within the RSE Delivery dropdown.** Circuits is a distinct workbook-based lesson approach for SEND/AP settings — self-paced, simplified keynotes, doodle/game space in workbooks. Not an afterthought — a purposefully designed product line that deserves its own page and messaging. |
| Book sales/fulfilment | **Stripe payment link.** The `/book` page CTA links directly to a Stripe checkout URL. No cart, no inventory system, no e-commerce platform. |

## 12. Remaining open decisions

| Decision | Owner | Impact |
|----------|-------|--------|
| Full WordPress redirect map | Dev + Gareth | Needed before launch, not before build. Map old WordPress URLs to new Astro URLs for 301 redirects. |

---

*Document version: 1.2 | Date: 3 April 2026 | Companion document: Tailor_Content_Site_Strategy_v4.2.md*
