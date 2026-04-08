# Tailor Education — Website & content strategy v4.1

*This document describes the full Tailor web presence: the company website, the "Okay to Ask" content layer, the teaching app, and how they connect. It covers architecture, content types, audiences, editorial policy, and commercial strategy.*

*Implementation detail (page templates, CTA positions, search behaviour, analytics events, Notion schemas) lives in the companion document: **Tailor_Content_Site_Build_Spec_v1.md**.*

*Author: Gareth Esson / strategic advisory sessions, March 2026*

---

## Context

Tailor Education's web presence has three components:

1. **The Tailor website** (tailoreducation.org.uk) — the company's public-facing website. It serves two audiences: teachers/school leaders looking for RSE delivery, training and resources, and young people/parents looking for honest answers to questions about relationships, sex, and health. It replaces the current underutilised WordPress site. Domain authority and indexed URLs are preserved via 301 redirects during migration.

2. **Okay to Ask** (okaytoask.co.uk → redirects to tailoreducation.org.uk/questions/) — a branded content layer within the main site. It houses ~152 anonymous questions from real young people, answered honestly and directly. It has its own visual identity, its own social presence (@oktoask.co.uk on Instagram), and its own vanity domain — but it lives on the main Tailor site, contributing to a single pool of domain authority. okaytoask.org.uk also redirects here, as well as oktoask.co.uk, oktoask.org.uk, nosillyquestions.co.uk and nosillyquestions.org.uk. The brand tagline is "#nosillyquestions"

3. **The Tailor app** — a web application for UK RSE teachers to browse, clone, customise, and deliver expert-built lessons. Currently in active development (Next.js 15, Drizzle, Neon Postgres, Vercel). Behind auth for actions (clone, edit, deliver), but with a public browse layer already built.

These are connected but serve distinct purposes. This document explains the architecture.

---

## The website (tailoreducation.org.uk)

### What it is

The single public-facing domain for everything Tailor Education does. It serves two audiences through distinct sections with different tones, but shares a common topic taxonomy and navigation structure.

### Site architecture

```
tailoreducation.org.uk/
│
├── SHOWCASE LAYER (audience: teachers, school leaders, parents)
│   ├── /                       → Homepage (hero, value prop, dual pathways, book promo)
│   ├── /about                  → About Tailor Education, the team, mission
│   ├── /rse-training            → RSE training overview and booking
│   ├── /services               → Services hub (see services architecture below)
│   │   ├── /services/delivery      → Direct RSE delivery in schools
│   │   ├── /services/drop-days     → RSE drop day delivery
│   │   ├── /services/rse-policy-curriculum-planning → RSE policy & curriculum planning
│   │   └── /services/training      → Alternative entry to /rse-training (or canonical redirect)
│   ├── /our-approach           → How we teach, content review methodology, safeguarding commitment
│   ├── /testimonials           → School and teacher testimonials
│   ├── /contact                → General contact and enquiry form
│   ├── /book                   → Okay to Ask book page (purchase CTA, about the book)
│   ├── /privacy                → Privacy policy
│   ├── /accessibility          → Accessibility & inclusivity statement
│   └── /blog/{slug}            → Teacher-facing editorial blog posts
│
├── LANDING PAGE LAYER (audience: teachers — the bridge between showcase and content)
│   └── /topics/{slug}          → 23 landing pages (see landing pages section)
│       ├── Topic overview and why it matters
│       ├── Aggregates relevant granular topics from the 87-topic app taxonomy
│       ├── "Questions young people ask" → links to Okay to Ask questions
│       ├── Key terms → links to /glossary/{slug} glossary entries
│       ├── For teachers: related blog posts (auto-populated, conditional)
│       ├── Related landing pages
│       └── CTAs to app library and services (see build spec for placement rules)
│
├── OKAY TO ASK LAYER (audience: young people — branded subsection)
│   ├── /questions/              → Okay to Ask landing page (browse by 7 book categories, book promo)
│   ├── /anonymous_question/{slug} → Individual question + answer pages
│   └── /glossary/{slug}         → Rich glossary explainer pages
│
├── SEARCH
│   └── /search?q={query}       → Full search results page
│
└── APP BRIDGE (audience: teachers — public browse, auth for actions)
    └── /lessons/                → Public library browse (or deep link to app)
```

### The homepage (dual pathway)

The homepage needs to serve both audiences without confusing either. The model is a clear fork:

**For teachers and schools:** "Build and deliver expert RSE lessons" → leads to training, services, topic pages, and the app.

**For young people:** "Got a question? Okay to Ask." → leads to the questions section with its own visual identity.

These pathways are visually distinct on the homepage but share the same navigation shell. The Tailor Education brand is always present; Okay to Ask is a branded content series within it, not a separate entity.

---

## Services architecture and conversion pathways

### Four service lines

Tailor Education offers four distinct services, each with a different buyer and a different decision process:

| Service | Buyer | Decision |
|---------|-------|----------|
| **Direct RSE delivery** | Head of PSHE, PSHE lead, head of year | "We need someone to come and teach this" |
| **RSE training** | PSHE coordinator, CPD lead, headteacher | "Our staff need training to teach RSE confidently" |
| **Drop day delivery** | Head of year, events coordinator, headteacher | "We want a full RSE day for a year group" |
| **RSE policy & curriculum planning** | Headteacher, DSL, senior leadership team | "We need help with our RSE policy/approach/parent communication" |

### Page structure

**`/services`** — Hub page. Brief description of each service with a card linking to its dedicated page. This page exists so that "RSE services for schools" has a landing page, but the real conversion happens on the individual pages.

**`/services/delivery`**, **`/services/drop-days`**, **`/services/rse-policy-curriculum-planning`** — Each has: what the service is, who it's for, what's included, what schools get, and a clear CTA to enquire. The CTA links to the enquiry form pre-tagged with the service type.

**`/rse-training`** — Dedicated page for RSE training. This is the highest-traffic service page because the app funnels teachers here via training-recommended prompts. It explains: what training covers, how it connects to unlocking content in the app, duration, format, and how to book.

### Enquiry form

A structured enquiry form (not an open text box) that captures: name, email, school name, which service they're interested in (pre-selected if they came from a specific service page), key stage or year group (optional), preferred timing (optional), and a free-text message. All enquiries are sent to the team's email. No CRM needed at launch.

### Conversion across the site

Every content page type has defined CTA positions that move visitors toward services, training, or the app. The principle is: content pages serve their primary audience first, but include conversion pathways appropriate to the page type. Question pages serve young people first, but end with a three-panel block serving all audiences (book, teacher landing page, school services). Landing pages serve both audiences and carry the strongest conversion CTAs. Blog posts feed directly into the services funnel.

CTA placement rules per page type are defined in the build spec.

### Internal links to services

Services pages are not orphans. They are linked from:
- The homepage (teacher pathway)
- Relevant landing pages
- Relevant blog posts
- The app's training-recommended prompts (these link to `/rse-training`)

---

## Trust and credibility layer

### Why this matters

RSE is a high-trust, high-scrutiny space. Parents google the provider before consenting. School leaders need to justify their choice of external provider. Ofsted expects schools to demonstrate they've quality-assured RSE content. The website must earn trust quickly and visibly.

### `/our-approach` page

A dedicated page explaining:
- The pedagogical approach (expert-authored, not crowdsourced; curriculum-aligned; inclusive by design)
- Framework alignment: DfE statutory guidance (2020 and 2026 revision), PSHE Association Programme of Study, UNESCO International Technical Guidance, WHO Standards for Sexuality Education in Europe
- Safeguarding commitment: how safeguarding is embedded in content (not bolted on), FGM mandatory reporting duties, KCSIE awareness, disclosure-aware activity design
- Content review process: how answers and activities are written, reviewed, and updated
- Evidence base: grounded in established RSE pedagogy, not opinion

This page serves both trust audiences: parents who want to know "who wrote this and is it safe?" and school leaders who need to evidence "we chose a credible, safeguarding-aware provider."

### The team

The about page (`/about`) presents Tailor Education as a professional organisation, not a one-person operation. It leads with the company's mission and approach, then introduces the team: Gareth Esson as founder, plus team members with their names, roles, and photos. The site should use "we" not "I" throughout — service pages, training descriptions, and all professional-facing copy. Gareth's personal name and expertise appear where they build trust (book authorship, founder bio, blog bylines) but the organisation is the brand.

### Testimonials

Already planned at `/testimonials`. These should be attributable (school name, role of the person) wherever possible. Case-study-style testimonials ("We brought Gareth in for a Year 9 drop day and here's what happened") are more powerful than pull quotes and also support the services conversion pathway.

---

## Crisis and safeguarding UX (Okay to Ask pages)

### The problem

Some Okay to Ask questions are about abuse, coercion, self-harm, or situations where the young person reading the answer might be in that situation right now. A signposting block at the bottom of the page is not enough — by the time they scroll there, they may have already left.

### Solution: tiered support visibility

**All question pages:** A persistent, visible signposting block at the bottom of the answer with relevant support services (Childline, Brook, The Mix, NSPCC, Women's Aid, NHS Sexual Health, Galop — contextually selected per question).

**Questions tagged to Safety & Safeguarding topics, or with content sensitivity "specialist" or "mandatory_reporting":** An additional, prominent "Need support?" component positioned above the answer — visually distinct, not dismissable, with a direct link to Childline (or the most relevant service for that topic). This is not a modal or a gate — it's a visible, always-present element that says "If this is happening to you, help is here."

The design of this element is Gareth's decision. The build spec defines the template requirement.

---

## Okay to Ask — the content layer

### Brand identity

**Name:** Okay to Ask (not "OK to Ask" or "Ok to Ask")

**Domain:** okaytoask.co.uk (redirect to tailoreducation.org.uk/questions/)

**Also redirects:** okaytoask.org.uk, oktoask.co.uk, oktoask.org.uk, nosillyquestions.co.uk, nosillyquestions.org.uk.

**Instagram:** @oktoask.co.uk

**Relationship to Tailor Education:** Okay to Ask is a Tailor Education project. It's branded as its own thing (its own visual identity, its own social presence, its own voice) but it lives on the Tailor website and credits Tailor Education as the source. Think of it like how a newspaper has named columns or series — it's part of the whole, but it has its own identity within it.

**Voice:** Written directly to young people. Warm, honest, direct. Correct terminology always. Inclusive by default. The tone of a trusted, knowledgeable older sibling — not a teacher, not a parent, not a textbook. Full editorial voice guidelines are in the separate document: Ok_to_Ask_Writing_Prompt.md.

**Visual identity:** Distinct from the main Tailor site. The post-it note is the visual anchor. The Okay to Ask section should feel warmer, more informal, more personal than the professional showcase pages. Different colour palette, more casual typography, the handwritten post-it images as a recurring motif. A young person arriving via okaytoask.co.uk or via Google should feel like they've landed somewhere made for them, not a corporate B2B website. Design decisions are Gareth's domain — build with CSS custom properties so he can apply his design system. A separate design and art direction document will be provided at the start of the build.

### Simple Mode — site-wide accessibility system

Every content page on the Okay to Ask site has two reading levels: Standard and Simple. The reader switches between them with a single toggle. Their choice persists across the entire site.

**Why it exists:** The site serves a wide range of readers: confident teenagers, younger children, adults with learning needs, people whose first language isn't English, parents who aren't familiar with RSE terminology. Rather than building separate versions of the site for different audiences, one site serves everyone with an accessibility toggle.

**How it works:** A toggle is available on every page that has content with a simple version. The exact UX and placement is a design decision for Gareth. When the reader chooses Simple, the entire page adapts — and their preference persists via localStorage so every subsequent page loads in Simple mode until they switch back.

**The cascade:** This is the key design insight. When a reader toggles to Simple mode, every content layer responds. They read the Simple Answer on a question page. Within that answer, if they tap a glossary term, the tooltip shows the Simple Definition. If they click through to the glossary page, it loads with the Simple Explainer. One choice, every layer adapts.

**What changes and what doesn't:**

| Element | Standard mode | Simple mode |
|---------|-------------|-------------|
| Question answer | Standard answer (page body) | Simple Answer (property field) |
| Glossary tooltip | Short Definition | Simple Definition |
| Glossary page | Standard explainer (page body) | Simple Explainer (property field) |
| Signposting block | Unchanged | Unchanged |
| Post-it scan image | Unchanged | Unchanged |
| Page layout and design | Unchanged | Unchanged |
| Meta title and description | Unchanged (SEO stays standard) | Unchanged |

**What makes this special:** Most educational and health websites don't do this at all. The few that offer "easy read" versions treat it as a separate, inferior product — often a PDF buried in a footer link. This approach treats accessibility as a first-class feature integrated into every page. A reader with learning needs gets the same design, the same experience, the same respect — just with clearer language.

### Content types within Okay to Ask

#### 1. Question pages (`/anonymous_question/{slug}`)

~152 questions with launch-ready answers in Notion. Each page contains:

- The scanned/styled image of the anonymous question (handwritten post-it note)
- A direct, honest answer written to the young person (150–300 words for most; longer for complex topics)
- A Simple Answer (plain-language version stored as a Notion property field)
- Inline glossary tooltips for key terms (linked to glossary pages; tooltips respect Simple Mode)
- Conditional crisis-support component (for safeguarding-related questions)
- A signposting block with relevant support services
- Related questions (internal links to other question pages)
- Link to parent landing page(s) — questions can be tagged to multiple topics
- End-of-answer panel: three CTA panels serving all audiences — book purchase (young people/parents), landing page link (teachers), services link (school leaders)
- Age flag where appropriate

**URL example:** `/anonymous_question/is-it-normal-to-queef`

**SEO target:** Long-tail queries that young people actually type into search engines ("is it normal to...", "what happens if...", "how do you know if...").

**Source material:** ~147 scanned questions from real anonymous question boxes in UK schools, organised in 9 original categories (Anatomy 15, Contraception 19, Glossary 3, Pregnancy 9, Puberty 5, Relationships 13, Sex & the Law 11, STIs 22, Sex 49). Additional questions will be generated from patterns observed in real sessions — representative and truthful in spirit.

#### 2. Glossary pages (`/glossary/{slug}`)

~80–100 terms at launch, all with written definitions and topic tags. Illustrations and diagrams will be added post-launch.

**Standard view** (default): Written for a young person aged 11+. Uses correct terminology. Rich explainer as long as needed (some terms need 500+ words). Can reference diagrams and other glossary terms.

**Simple view:** Shorter, plainer version covering the same ground. No jargon. No terms that need their own glossary entry. 150–250 words. Permitted to use "girls and women" / "boys and men" for clarity where the standard version would use more precise terminology.

Each page also contains:
- Related glossary terms (internal links)
- Questions that reference this term (internal links back to Okay to Ask)
- Link to relevant landing page
- Signposting block (same in both views)

**URL example:** `/glossary/consent`

**SEO target:** Definitional queries ("what does consent mean", "what is an STI", "what is the age of consent UK"). Google indexes the standard view.

**Dual function:** The glossary is also a system-wide layer. Any question answer or blog post that uses a glossary term gets an inline tooltip with the definition (Standard or Simple, matching the reader's preference), linking to the full glossary page.

### Editorial policy

- **Voice:** Written to the young person. Warm, direct, honest. Correct terminology always (not euphemisms). Inclusive by default (no assumption of heterosexuality or cisgender identity).
- **Three content tiers:**
  - **Open** — the vast majority. No age flag. Honest, clear, accessible to any reader.
  - **Age-flagged** — detailed content on sex acts, contraception specifics, STI detail, pornography. A respectful interstitial: "This answer talks about [topic] in detail. It's written for young people in Year 9 and above." Not a hard gate — an honest signpost with a link to a more foundational answer.
  - **Dual-answer** — a small subset (~10–15% of questions) where the best answer genuinely differs by age/experience. Two clearly labelled answers on the same page.
- **Safeguarding:** Persistent signposting on every question page (not dismissable). No user-submitted questions at launch. No comments. Curated content only.
- **Honesty principle:** Questions are answered fully and honestly. Where content is more appropriate for older readers, it is age-flagged — not withheld.

### Age flagging system

Not a hard verification gate. A respectful, honest content signal:

```
┌─────────────────────────────────────────────────────┐
│  This answer talks about [sex / contraception / etc] │
│  in detail. It's written for young people in Year 9  │
│  and above.                                          │
│                                                      │
│  If you'd like to start with the basics:             │
│  → [Link to foundational question/glossary entry]    │
│                                                      │
│  [Continue to answer]                                │
└─────────────────────────────────────────────────────┘
```

### Meta title branding convention

- **Question pages:** "[question in natural language] | Okay to Ask"
- **Glossary pages:** "What is [term]? | Tailor Education"
- **Landing pages:** "[Topic name] — RSE for Schools | Tailor Education"
- **Blog posts:** "[Title] | Tailor Education"
- **Showcase pages:** "[Page title] | Tailor Education"
- **Service pages:** "[Service name] — RSE for Schools | Tailor Education"

Okay to Ask branding only appears on question pages. Everything else is Tailor Education.

---

## Blog — teacher-facing editorial content

### Purpose

The blog serves three functions: building SEO authority on mid-funnel teacher-intent queries, supporting the services and training conversion pathways, and creating two-way internal links with landing pages. It is written for teachers, school leaders, and (some posts) parents — never for young people. The Okay to Ask voice does not appear in blog posts.

Blog posts live at `/blog/{slug}`. They are teacher-facing, professional-tone content under the Tailor Education brand. They are not an afterthought — they are part of the internal linking fabric from day one.

### Editorial categories

**Practical teaching** (~8–10 posts at launch): Answers to the questions teachers actually search for. How to set ground rules for RSE. Handling disclosures during lessons. Teaching consent across different key stages. Adapting RSE for SEND students. What to do when students ask questions you weren't expecting. These link naturally to landing pages and to the delivery/training services.

**Curriculum and policy** (~5–6 posts at launch): The 2026 DfE guidance changes. What Ofsted looks for in RSE provision. Building an RSE policy that works. How to involve parents in RSE decisions. Whole-school approaches to RSE. These support the RSE policy and curriculum planning service line and position Gareth as the authority on the regulatory landscape.

**Bridging content** (~4–5 posts at launch): Why young people's questions matter in RSE planning. What anonymous question boxes reveal about what students actually want to know. How the Okay to Ask approach works in practice. These link the teacher-facing content to the Okay to Ask layer and help teachers see the value of honest, direct RSE.

**Launch target:** ~20 blog posts, enough to establish the internal linking pattern and give the blog section substance. Exact titles to be developed against search data.

### Blog in the internal linking model

Blog posts are not orphans. They link and are linked:

**From blog posts outward:**
- To relevant landing pages (1–3 per post, tagged via Topic relation)
- Inline glossary tooltips (same system as question pages)
- To relevant Okay to Ask questions
- To relevant services/training pages (driven by Service Link field)
- To related blog posts

**From other pages inward to blog posts:**
- Landing pages auto-populate a conditional "For teachers" section with blog posts tagged to that topic. If no blog posts exist for a topic, the section does not render.
- Services and training pages link to relevant blog posts.

---

## Landing pages — the bridge

23 landing pages at `/topics/{slug}` are the structural backbone of the teacher-facing website. They are not the 87 granular app topics — they are a smaller, SEO-driven set of pages determined by keyword research and competitor analysis (documented in Tailor_Landing_Page_Proposal.md).

Each landing page aggregates one or more of the 87 granular app topics. The 87 topics continue to power the app's filtering system. The landing pages are the public website's navigation and SEO structure that sits on top of that taxonomy.

**For teachers:** Topic overview, curriculum mapping (DfE 2026, PSHE Association), learning objectives, related blog posts, and CTAs to explore ready-made lessons in the app and enquire about services.

**For young people:** A curated list of real questions other young people have asked about this topic, plus key glossary terms explained in accessible language.

**For SEO:** Each landing page is the canonical authority page for that subject, supported by a cluster of specific question pages, glossary definitions, and blog posts. The 23-page structure targets the terms teachers actually search for, validated by Search Console data and competitor analysis.

The 23 landing pages, grouped by the 7 app categories:

| Category | Landing pages |
|----------|-------------|
| Relationships | Consent, Healthy relationships, Friendships, Families, Sex and intimacy |
| Sex & Sexual Health | Contraception, STIs and sexual health, Pregnancy and reproductive health, Sex and the law |
| Puberty & The Body | Puberty, Body image, Bodies and anatomy |
| Identity & Diversity | LGBTQ+ inclusion, Masculinity and misogyny, Gender stereotypes and discrimination |
| Online Safety & Media | Online safety, Sexting and sharing nudes, Pornography and media literacy |
| Safety & Safeguarding | Abuse exploitation and violence, FGM and harmful practices, Personal safety |
| Health & Wellbeing | Mental health and wellbeing, Self-esteem |

These groupings are used in the topics mega menu (D8) in the site navigation.

Five additional cross-cutting service/audience pages also use the landing page template but do not appear in the topics mega menu: RSE training for teachers (→ `/rse-training`), RSE for primary schools, RSE for secondary schools, RSE for SEND and alternative provision, RSE policy and curriculum planning. These are service and audience entry points, not topic pages.

### Okay to Ask browsing categories

The Okay to Ask landing page (`/questions/`) uses a separate set of 7 categories for browsing questions: Anatomy, Puberty, Relationships, Sex, Sexual Health, Sex & the Law, Contraception & Pregnancy. These are the book categories — the reader's mental model, not the app's filtering taxonomy. They are distinct from both the 7 app categories and the 23 landing page groupings.

---

## Site search

The site will have 300+ pages at launch. Young people arriving confused need to find answers fast. Teachers looking for a specific topic shouldn't have to browse through categories. Site search is a core navigation element, not an optional feature.

A persistent search bar in the site header, visible on every page. Unified search across all content types (questions, glossary, topics, blog, services). Fuzzy matching using the same topic alias vocabulary already built for the app — so informal terms and slang map to the correct content. Instant results as you type, plus a full results page at `/search?q={query}`.

Implementation detail is in the build spec.

---

## Internal linking model

All content types form a tightly interconnected graph:

```
Homepage
  ├── Teacher pathway → Showcase pages → Landing pages → App library
  ├── Teacher pathway → Services/training pages
  ├── Young person pathway → Okay to Ask landing → Question pages
  └── Book promotion → Book page

Landing pages (22)
  ├── aggregate → Question pages tagged to underlying granular topics
  ├── aggregate → Glossary terms tagged to underlying granular topics
  ├── aggregate → Blog posts tagged to underlying topics (conditional)
  ├── link to   → Related landing pages
  ├── CTA to    → App library filtered by topic
  ├── CTA to    → Services/training (contextual)
  └── link from → Showcase pages, services pages, blog posts, mega menu

Question pages (152)  [Okay to Ask]
  ├── belong to → One or more landing pages (via granular topic tags)
  ├── inline    → Glossary tooltips
  ├── link to   → Related questions
  ├── CTA panel → Book purchase, landing page, services (A17)
  ├── include   → Signposting / support services (immediately after answer)
  └── include   → Conditional crisis-support component

Glossary pages (~80–100)
  ├── belong to → Landing page(s) (via granular topic tags)
  ├── link to   → Related glossary terms
  ├── link to   → Questions that reference this term
  └── CTA to    → Landing page

Blog posts (~20 at launch)
  ├── link to   → Relevant landing pages (1–3 per post)
  ├── inline    → Glossary tooltips
  ├── link to   → Relevant Okay to Ask questions
  ├── CTA to    → Relevant services/training pages
  ├── link to   → Related blog posts
  └── byline    → Author name (Gareth, or team member who wrote it)

Services pages (4) + Training page
  ├── link to   → Topics overview grid (landing pages)
  ├── link to   → Relevant blog posts
  ├── CTA       → Enquiry form (repeated at top and bottom)
  └── link from → Homepage, landing pages, blog posts, app training prompts

/our-approach
  ├── link from → Homepage, about page
  └── link to   → Services, training

/book
  ├── link from → Homepage, Okay to Ask landing, every question page (A17)
  └── link to   → Question pages (sample content)

App public library browse
  ├── link from → Landing page CTAs
  ├── indexable → Activity/lesson/programme detail pages
  └── auth gate → Clone, edit, deliver actions
```

Selection rules for related questions, glossary tooltip matching, and CTA placement logic are defined in the build spec.

---

## Content source: Notion databases

All Okay to Ask content, landing pages, and blog posts are managed in Notion. The website pulls from five databases at build time via the Notion API and generates static pages. Notion is the authoring tool, not a live CMS — there is no live connection between Notion and the site. Content is pulled, pages are built, and the site is deployed as static HTML. If a more traditional CMS workflow is needed later, the content can be migrated to Sanity or similar.

The five databases are: Questions, Glossary, Topics (87 granular app topics), Landing Pages (22 website pages), and Blog. Full schemas with field-level detail are in the build spec.

---

## How the app connects

### 1. Public browse layer — already built ✓

The library browse experience is already publicly accessible without authentication. The auth gate is at the point of action (clone, edit, deliver).

### 2. Topic and landing page alignment

The app's 87 granular topics power filtering in the app. The website's 23 landing pages are the public-facing structure. Each landing page maps to one or more granular app topics. The granular topic slugs are used in the app; the landing page slugs are used on the website. When a landing page links to "Explore ready-made lessons on Consent →", it deep-links to the app's library filtered by the relevant granular topic slug(s). Coordination is needed when granular topic slugs change.

### 3. SEO metadata on public app pages

Every publicly accessible app page needs unique titles, meta descriptions, OG tags, JSON-LD structured data, canonical URLs, internal linking, and sitemap inclusion.

### 4. Domain strategy — RESOLVED

**Subdomain split:**
- `tailoreducation.org.uk` → Astro content site
- `app.tailoreducation.org.uk` → Next.js Tailor app

Two separate Vercel projects. The content site is the SEO engine (152 question pages, 23 landing pages, glossary, blog). The app is a tool behind auth. Keeping them separate means the Astro site builds without touching the existing Next.js codebase, and deployments are independent. Can consolidate to a single domain later if SEO data justifies it.

**Vanity domains (all redirect, no separate hosting):**
- `oktoask.co.uk`, `oktoask.org.uk`, `okaytoask.co.uk`, `okaytoask.org.uk` → `tailoreducation.org.uk/questions/`
- `nosillyquestions.co.uk`, `nosillyquestions.org.uk` → `tailoreducation.org.uk/questions/`
- `tailor-rse.co.uk` → `tailoreducation.org.uk`

### 5. Future integration points (not launch requirements)

- The app's anonymous question box (T18 template) could surface Okay to Ask questions.
- The website glossary could power tooltips within delivered lessons in the app.
- Okay to Ask content could appear in the app's teacher notes as "common questions students ask."

---

## Tech stack

**Astro** (static site generator) pulling content from Notion at build time. Static HTML output for speed and SEO. Astro component islands for interactive elements (glossary tooltips, age-flag interstitials, search). Deploys to Vercel alongside the app. Can migrate to a headless CMS later if Notion becomes limiting.

**Design:** Gareth is a graphic and web designer with an existing design system built on CSS custom properties. A design and art direction document will be provided at the start of the build. Produce token-ready markup. Don't make visual choices — build for design system integration.

Tech stack detail, content pipeline steps, and SEO infrastructure checklist are in the build spec.

---

## Okay to Ask — additional assets

| Asset | Purpose | Status |
|-------|---------|--------|
| **Instagram** (@oktoask.co.uk) | Social content — post-it scans, answer summaries, glossary terms, topic carousels | Handle secured, not yet active |
| **Book** ("Okay to Ask") | Physical coffee-table book. Post-it scans + answers. Credibility artifact for conferences, school staff rooms, parent evenings. Not the revenue model — the trust object. Purchase CTA appears on every question page via the end-of-answer panel (A17). | Complete. Sales via Stripe payment link. Book page at `/book` needed (placeholder until purchase URL confirmed). |
| **Blog** | Teacher-facing editorial content at /blog/. See blog section above. | ~20 posts planned for launch |

The social → website → app funnel:
```
Instagram post (post-it scan + answer summary)
  → drives to question page on website (oktoask.co.uk redirect)
    → question page links to landing page
      → landing page links to:
          → app library (teacher pathway)
          → services/training (school buyer pathway)
          → more questions (young person pathway)
```

---

## SEO baseline (from Search Console data, March 2025–March 2026)

The existing WordPress site has measurable SEO traction that must be preserved during migration:

- **Top performing page:** `/anonymous_question/if-i-played-with-myself-am-i-a-virgin/` — 25,556 impressions, position 1.92, but only 0.31% CTR (meta description was the generic Tailor Education tagline, not the answer)
- **Other ranking question pages:** queef (2,985 impressions), hit a girl (2,330), first time pain myth (849), STD slag (774, position 1.82)
- **Topic page traction:** porn literacy (2,717 impressions, position 19), consent (188 impressions, position 48)
- **Brand search noise:** "tailor sex", "tailor porn" etc. account for ~2,850 impressions from mismatched intent. Not harmful, improves as legitimate content grows.

Migration requirements are in the build spec.

---

## Content status at launch

| Content type | Count | Status |
|-------------|-------|--------|
| Question answers (standard) | 152 | All launch-ready. May be updated post-launch. |
| Question answers (simple) | 152 | All written and populated. ✓ |
| Glossary terms (standard) | ~80–100 | Definitions and explainers written. Illustrations/diagrams to be added post-launch. |
| Glossary terms (simple) | ~80–100 | Simple Definitions and Simple Explainers written and populated. ✓ |
| Landing pages | 22 (+5 cross-cutting) | Structure defined. Page body content to be written. |
| Blog posts | ~20 | To be written. Titles to be developed against search data. |
| Showcase pages | ~11 | To be written (homepage, about, training, services hub + ×3, our-approach, testimonials, contact, book, privacy, accessibility). |

---

## Summary table

| | Website | Okay to Ask | Blog | Tailor app |
|---|---|---|---|---|
| **Purpose** | Showcase + content hub + services conversion | SEO content engine + brand | Teacher authority + services funnel | Teaching tool |
| **Primary audience** | Teachers, school leaders, parents | Young people | Teachers, school leaders | Teachers |
| **Auth** | None | None | None | Required for actions |
| **Domain** | tailoreducation.org.uk | okaytoask.co.uk → redirect | Same domain | app.tailoreducation.org.uk |
| **Stack** | Astro + Notion + Vercel | Same | Same | Next.js + Drizzle + Neon |
| **Visual identity** | Professional, expert | Warm, informal, post-it motif | Professional (Tailor brand) | Functional, clean |

The website is the public face. Okay to Ask is the emotional front door for young people. The blog builds teacher trust and feeds the services funnel. The app is the professional tool. The 23 landing pages connect the content layer to the services layer. The 87-topic app taxonomy powers filtering in the app and tagging across all content. All contribute to SEO on a single domain.

---

## Related documents

- **Tailor_Content_Site_Build_Spec_v1.md** — implementation detail: page templates, CTA placement, search, analytics, Notion schemas, content pipeline, SEO infrastructure, 301 redirects
- **Tailor_Site_Structure_v1.md** — complete component and page inventory with reference codes (A1–A17, B1–B13, C1–C5, D1–D8, E1)
- **Tailor_Page_Content_Spec_v1.md** — content specification for every page, template, and component
- **Tailor_Landing_Page_Proposal.md** — research and evidence for the 23 landing pages (Search Console data, keyword research, competitor analysis)
- **Ok_to_Ask_Writing_Prompt.md** — full editorial voice guidelines, structure rules, Notion workflow
- **Ok_to_Ask_Approved_Answers.md** — finalised question answers for voice reference
- **Ok_to_Ask_Meta_Optimisation_v1.md** — SEO meta title/description optimisation for top performing pages
- **Tailor_Education_-_Platform_Brief.docx** — platform vision and business model
- **Tailor_Signup_Onboarding_Flow_v1.docx** — app analytics event map (section 11)

---

*Document version: 4.2 | Date: 4 April 2026 | Status: All question answers launch-ready (standard and simple). Glossary complete (definitions, explainers, simple versions — diagrams post-launch). Blog posts planned (~20). Okay to Ask book complete. 23 landing pages defined and populated. All Notion databases ready. Website build ready to start. Domains secured. App public browse layer confirmed working.*
