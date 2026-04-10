# Tailor Education — Site structure & component inventory

*A complete list of everything that needs designing for the Tailor Education website. Every page, template, shared component, interactive element, and form — with a reference code for each.*

*Use this as the wireframing checklist. If it's not in this document, it doesn't need a wireframe.*

*Companion documents: Tailor_Content_Site_Strategy_v4.1.md (the why), Tailor_Content_Site_Build_Spec_v1.md (the how)*

---

## Reference code system

| Prefix | Category |
|--------|----------|
| **A** | Global components (appear on multiple pages) |
| **B** | Showcase pages (one-off pages with unique layouts) |
| **C** | Content templates (repeated across many pages) |
| **D** | Interactive elements and overlays |
| **E** | Forms |

---

## A — Global components

These appear across the site. Design once, use everywhere.

| Code | Component | Notes |
|------|-----------|-------|
| **A1** | Site header | Logo, navigation, search bar. Persistent on every page. Needs to work for both Tailor Education and Okay to Ask sections — same shell, potentially different visual treatment. Mobile: hamburger + search icon. |
| **A2** | Site footer | Links, copyright, social links, Tailor Education branding, Okay to Ask branding where relevant. Safeguarding statement link. Accessibility & inclusivity link. Privacy policy link. Tailor Education CIC company number (TBD). Design credit: "Designed by Guess Design House" with logo. |
| **A3** | Navigation | Desktop and mobile variants. Must handle: showcase pages, topics, Okay to Ask, blog, services, contact. Consider how a young person arriving at /questions/ navigates vs a teacher arriving at /rse-training. |
| **A4** | Search bar (header state) | Collapsed/expanded states. Part of A1 but complex enough to need its own wireframe. Desktop: visible in header. Mobile: icon that expands. |
| **A5** | Search results dropdown | Instant results panel below search bar. Appears after 2+ characters. Top 5–8 results grouped by content type. "See all results" link. |
| **A6** | Simple Mode toggle | The Standard/Simple switch. Appears on every page that has simple content (question pages, glossary pages). Exact placement and UX is a design decision. Needs active/inactive states. Needs to feel like an accessibility feature, not a dumbing-down. |
| **A7** | Glossary tooltip | Inline tooltip that appears when a glossary term is tapped/hovered in body text. Shows Short Definition (standard) or Simple Definition (simple mode). Links to full glossary page. Must work on mobile (tap) and desktop (hover + click). |
| **A8** | Signposting block | Support services block (Childline, Brook, The Mix, etc.). Appears at the bottom of question pages. Contextually populated per question. Persistent, not dismissable. |
| **A9** | Crisis support component | Prominent "Need support?" element. Appears above the answer on safeguarding-related question pages. Visually distinct from the answer content. Not dismissable. Shows the most relevant crisis service. |
| **A10** | *Retired — no author attribution on question pages. Blog posts carry author bylines. The organisation is the brand.* | |
| **A11** | CTA block — "Explore lessons" | Mid-page CTA linking to app library filtered by topic. Used on landing pages. |
| **A12** | CTA block — "Bring this into your school" | Bottom-page CTA linking to services or training. Used on landing pages. Target varies by topic. |
| **A13** | CTA block — service enquiry | "Want help with [service]? Talk to us" — links to enquiry form pre-tagged. Used on blog posts and service pages. |
| **A14** | *Retired — replaced by A17* | |
| **A15** | Related content cards | Reusable card component for showing related questions, related blog posts, related glossary terms. May have variants per content type. |
| **A16** | Topic tag chips | Small linked labels showing which topic(s) a page belongs to. Used on question pages, blog posts, glossary pages. |
| **A17** | End-of-answer panel | Three-panel CTA block at the bottom of every question page (above signposting). Panel 1: "Get the book" — Okay to Ask book purchase CTA (links to /book, Stripe payment link). Panel 2: "Explore how to teach this topic" — links to landing page for this question's primary topic (replaces the old A14 teacher bridge). Panel 3: "Bring RSE into your school" — links to /services or /rse-training. Serves all three audiences: young people/parents, teachers, school leaders. |

---

## B — Showcase pages (unique layouts)

Each of these is a one-off page with its own layout. Not templated.

| Code | Page | URL | Notes |
|------|------|-----|-------|
| **B1** | Homepage | `/` | Dual pathway: teacher/school hero + young person/Okay to Ask hero. Book promotion CTA within the Okay to Ask section ("The Okay to Ask book is here" → B11). Must serve both audiences without confusing either. The most important page to get right. |
| **B2** | About | `/about` | About Tailor Education, the team, and the Okay to Ask project. Organisation leads, then team. Trust-building for schools and parents. |
| **B3** | Our Approach | `/our-approach` | Pedagogical approach, framework alignment (DfE, PSHE Association, UNESCO, WHO), safeguarding commitment, content review process, evidence base. Key trust page. |
| **B4** | RSE Training | `/rse-training` | RSE training overview. What teachers learn, duration, format, how it connects to unlocking app content, how to book. CTA: enquiry form pre-tagged "RSE training". Highest-traffic service page (app funnels here). |
| **B5** | Services hub | `/services` | Brief description of each service line with cards linking to individual service pages. Landing page for "RSE services for schools" queries. |
| **B6** | Testimonials | `/testimonials` | School and teacher testimonials. Attributable where possible (school name, role). Case-study style where available. |
| **B7** | Contact | `/contact` | May include the enquiry form (E1) inline, or may be a simpler page linking to it. General contact information. |
| **B8** | Okay to Ask landing | `/questions/` | Browse all questions. The front door for young people. Must feel like Okay to Ask (warm, informal, post-it motif), not the B2B showcase. Filterable by the 7 Okay to Ask categories: Anatomy, Puberty, Relationships, Sex, Sexual Health, Sex & the Law, Contraception & Pregnancy. These are the book categories and the young-person browsing structure — distinct from the app's 87 topics and the website's 23 landing page groupings. Includes a book promotion hero/CTA ("Get the Okay to Ask book" → B11). May include featured/popular questions. |
| **B9** | Blog index | `/blog/` | List of all blog posts. Filterable by topic, category, or audience. Sorted by date (newest first). |
| **B10** | Search results | `/search?q={query}` | Full search results page. Results grouped by content type (Questions, Glossary, Topics, Blog, Services). Up to 5 per group with "Show all" toggle. |
| **B11** | Book page | `/book` | Okay to Ask book — what it is, what's inside, who it's for, purchase CTA. Linked from every question page via the end-of-answer panel (A17). Purchase via Stripe payment link. Okay to Ask visual identity. |
| **B12** | Privacy policy | `/privacy` | Uses legal template (C6). Required for GA4 and localStorage usage under UK GDPR. Linked from footer (A2). |
| **B13** | Accessibility & inclusivity | `/accessibility` | Uses legal template (C6). Simple Mode system, inclusive language, WCAG compliance, signposting. Linked from footer (A2). |

---

## C — Content templates (repeated across many pages)

Each of these is a template applied to many pages. Design the template once.

| Code | Template | URL pattern | Instance count | Notes |
|------|----------|-------------|---------------|-------|
| **C1** | Question page | `/anonymous_question/{slug}` | ~152 | Post-it image, answer (standard + simple), glossary tooltips, crisis support (conditional), age flag (conditional), signposting, end-of-answer panel (A17), author attribution. The most complex template. |
| **C2** | Glossary page | `/glossary/{slug}` | ~80–100 | Term, definition (standard + simple), full explainer (standard + simple), related terms, referencing questions, topic link. Standard/Simple toggle. |
| **C3** | Landing page | `/topics/{slug}` | 23 | Teacher-facing topic landing page. Aggregates relevant granular topics from the 87-topic app taxonomy. Pulls in related questions, glossary terms, blog posts. CTAs (mid-page "explore lessons" + bottom "bring to school"). The bridge between content and services. See landing page list below. |
| **C4** | Blog post | `/blog/{slug}` | ~20 at launch | Featured image (16:9, conditional), meta line (author · date · audience + share dropdown), body prose with accent-coloured headings, topic tags section after body, related posts grid (with featured images), bottom CTA. Share: native Web Share API on mobile, social dropdown (X, LinkedIn, Facebook, WhatsApp, Email, Copy link) on desktop. JSON-LD Article structured data. |
| **C5** | Service page | `/services/{type}` | 6 individual pages | v3 template: hero, at-a-glance strip, description, feature cards, optional process steps, testimonial, related blog posts, ServiceTopicsStrip, repeated CTA. Pages: `rse-for-primary-schools`, `rse-for-secondary-schools`, `rse-for-send-and-ap` (Circuits), `rse-training`, `drop-days`, `rse-policy-curriculum-planning`. Hub page lives at `/services` (B5). Shared styles via `ServicePageStyles.astro`. Legacy `/services/delivery` and `/services/rse-delivery` redirect 301 → `/services`. |
| **C6** | Legal page | various | 2 | Simple text page template. Used for B12 (Privacy policy) and B13 (Accessibility & inclusivity). No unique components — just heading, body text, footer. No wireframe needed. |

### C3 landing pages — the 23 pages

These are the teacher-facing website landing pages that sit on top of the 87 granular app topics. They are determined by search demand and competitor analysis (see Tailor_Landing_Page_Proposal.md). The 87 granular topics do not get their own pages on the website — they power the app's filtering system only.

**Topic landing pages (in the mega menu, grouped by the 7 app categories):**

| # | Page title | Slug | Category |
|---|-----------|------|----------|
| 1 | Consent | consent | Relationships |
| 2 | Healthy relationships | healthy-relationships | Relationships |
| 3 | Friendships | friendships | Relationships |
| 4 | Families | families | Relationships |
| 5 | Sex and intimacy | sex-and-intimacy | Relationships |
| 6 | Contraception | contraception | Sex & Sexual Health |
| 7 | STIs and sexual health | stis-and-sexual-health | Sex & Sexual Health |
| 8 | Pregnancy and reproductive health | pregnancy-and-reproductive-health | Sex & Sexual Health |
| 9 | Sex and the law | sex-and-the-law | Sex & Sexual Health |
| 10 | Puberty | puberty | Puberty & The Body |
| 11 | Body image | body-image | Puberty & The Body |
| 12 | Bodies and anatomy | bodies-and-anatomy | Puberty & The Body |
| 13 | LGBTQ+ inclusion | lgbtq-inclusion | Identity & Diversity |
| 14 | Masculinity and misogyny | masculinity-and-misogyny | Identity & Diversity |
| 15 | Gender stereotypes and discrimination | gender-stereotypes-and-discrimination | Identity & Diversity |
| 16 | Online safety | online-safety | Online Safety & Media |
| 17 | Sexting and sharing nudes | sexting-and-sharing-nudes | Online Safety & Media |
| 18 | Pornography and media literacy | pornography-and-media-literacy | Online Safety & Media |
| 19 | Abuse, exploitation and violence | abuse-exploitation-and-violence | Safety & Safeguarding |
| 20 | FGM and harmful practices | fgm-and-harmful-practices | Safety & Safeguarding |
| 21 | Personal safety | personal-safety | Safety & Safeguarding |
| 22 | Mental health and wellbeing | mental-health-and-wellbeing | Health & Wellbeing |
| 23 | Self-esteem | self-esteem | Health & Wellbeing |

**Cross-cutting service pages — flat nav (post v3):**

All six service lines are siblings under `/services`. The old "RSE Delivery" / "RSE Training & Support" dropdowns and hub variants have been removed — the header exposes the six pages directly. See C5 template notes.

| Page title | Route | Template | Notes |
|-----------|-------|----------|-------|
| RSE for primary schools | `/services/rse-for-primary-schools` | C5 v3 | Key stage entry point |
| RSE for secondary schools | `/services/rse-for-secondary-schools` | C5 v3 | Key stage entry point |
| RSE for SEND & AP (Circuits) | `/services/rse-for-send-and-ap` | C5 v3 | Circuits: workbook-based, self-paced lessons for SEND/AP settings. Simplified keynotes, doodle/game space in workbooks. A distinct product line, not an afterthought. |
| Drop days | `/services/drop-days` | C5 v3 (lean) | Whole-day, multi-cohort delivery |
| RSE Training | `/services/rse-training` | C5 v3 | Replaces standalone B4. Highest-traffic service page (app funnels here). |
| RSE Policy & Curriculum Planning | `/services/rse-policy-curriculum-planning` | C5 v3 (consultancy) | Policy + curriculum map deliverables |

---

## D — Interactive elements and overlays

States, modals, and interactive behaviours that need wireframing.

| Code | Element | Notes |
|------|---------|-------|
| **D1** | Age flag interstitial | Appears on age-flagged question pages before the answer. Shows topic label, Year 9+ note, link to foundational content, "Continue to answer" action. Not a hard gate — an honest signpost. |
| **D2** | Search bar expanded state | Desktop: the search bar in active/typing state with the instant results dropdown (A5) visible below it. Mobile: the expanded search overlay. |
| **D3** | Mobile navigation | Hamburger menu expanded state. Full navigation structure visible. |
| **D4** | Glossary tooltip expanded | The tooltip in its open state — showing definition text and link to full page. Desktop hover and mobile tap variants. |
| **D5** | Simple Mode transition | What happens visually when the reader toggles between Standard and Simple. Swap? Fade? Instant? This is a micro-interaction decision. |
| **D6** | Enquiry form states | Empty, partially filled, validation errors, success confirmation. |
| **D7** | Dual-answer layout | For the ~10–15% of questions with two age-differentiated answers on the same page. How are the two answers labelled and laid out? |
| **D8** | Topics mega menu | Desktop: expands from "Topics" nav item. Shows all 23 topic landing pages grouped by category (5 groups). Mobile: within the mobile nav (D3), either as an expandable section or a sub-menu. |

---

## E — Forms

| Code | Form | Location | Fields |
|------|------|----------|--------|
| **E1** | Service enquiry form | `/contact` and/or inline on service pages | Name (required), email (required), school name (required), service interested in (select, pre-filled from source page — options: Direct RSE delivery / RSE training / Drop day delivery / RSE policy & curriculum planning / Other), key stage or year group (optional), preferred timing (optional), message (optional). |

---

## Wireframing sequence (suggested)

Not prescriptive — Gareth designs in whatever order makes sense. But this is a logical dependency order.

**Phase 1 — Global shell (everything else sits inside this)**
A1, A2, A3 → header, footer, navigation

**Phase 2 — The two front doors**
B1 → homepage (dual pathway)
B8 → Okay to Ask landing

**Phase 3 — Core content templates (the bulk of the site)**
C1 → question page (the most complex template — includes A6, A7, A8, A9, A17, D1, D7)
C2 → glossary page (includes A6, A7)
C3 → landing page (includes A11, A12, A15)

**Phase 4 — Teacher/services layer**
C5 → service page (includes A13)
B4 → training page
B5 → services hub
C4 → blog post (includes A13)
B9 → blog index
E1 → enquiry form (includes D6)

**Phase 5 — Trust and support**
B2 → about
B3 → our approach
B6 → testimonials
B7 → contact

**Phase 6 — Search**
A4 → search bar
A5 → search results dropdown (includes D2)
B10 → search results page

---

## Not in scope for wireframing

These exist but are not part of the content site wireframes:

- The Tailor app (separate product, separate design, separate codebase)
- Email templates (defined in the Notification and Email System doc)
- Instagram content (social, not web)
- The Okay to Ask book (physical product)

---

## Implementation status (as of 10 April 2026)

### Built and live

| Code | Page / template | Route | Notes |
|------|----------------|-------|-------|
| **A1** | Site header | — | Persistent header with navigation, search bar, topics mega menu |
| **A2** | Site footer | — | Links, branding, Guess Design House credit |
| **A3** | Navigation | — | Flat service nav post-v3; topics mega menu via `TopicsMegaMenu.astro` |
| **A4** | Search bar | — | `SearchBar.astro`, header-integrated, Pagefind-backed |
| **A5** | Search results dropdown | — | Instant results panel, grouped by content type |
| **A6** | Simple Mode toggle | — | `SimpleModeToggle.astro`, Standard/Simple swap on question and glossary pages |
| **A7** | Glossary tooltip | — | `GlossaryTooltips.astro`, inline tooltip system |
| **A8** | Signposting block | — | `SignpostingBlock.astro`, contextual support services on question pages |
| **A9** | Crisis support | — | `CrisisSupport.astro`, safeguarding-triggered surface above answers |
| **A11** | CTA — Explore lessons | — | `CtaExploreLessons.astro`, used on landing pages |
| **A12** | CTA — Bring to school | — | `CtaBringToSchool.astro`, used on landing pages |
| **A13** | CTA — service enquiry | — | `CtaServiceEnquiry.astro`, pre-tagged via `?service=` param |
| **A15** | Related content cards | — | `RelatedQuestions.astro`, `RelatedTerms.astro`, blog related-posts grid |
| **A16** | Topic tag chips | — | `TopicTags.astro`, used on question, glossary and landing pages |
| **A17** | End-of-answer panel | — | `EndOfAnswerPanel.astro`, three-panel CTA on question pages |
| **B1** | Homepage v2 | `/` | Teacher-first 8-section layout, single OtA layer switch, hero/delivery/training photography wired |
| **B2** | About | `/about` | Team and organisation page |
| **B3** | Our Approach | `/our-approach` | Pedagogical approach, framework alignment, safeguarding |
| **B5** | Services hub | `/services` | Six-card grid + hero photo, linking to all individual service pages |
| **B6** | Testimonials | `/testimonials` | School and teacher testimonials |
| **B7** | Contact | `/contact` | Enquiry form (E1) inline, service param pre-fill |
| **B8** | Okay to Ask landing | `/questions/` | Question browse with category filtering |
| **B9** | Blog index | `/blog/` | Filterable list, sorted newest-first |
| **B10** | Search results | `/search` | Full results page, Pagefind-backed |
| **B11** | Book page | `/book` | Hero cover, product image, audience cards, purchase CTA |
| **B12** | Privacy policy | `/privacy` | Legal page template (C6) |
| **B13** | Accessibility & inclusivity | `/accessibility` | Legal page template (C6) |
| **B14** | Topics hub | `/topics/` | Filterable card grid with topic illustrations, trust signal |
| **C1** | Question page | `/anonymous_question/{slug}` | Post-it images, categories, content tags, end-of-answer panel |
| **C2** | Glossary term page | `/glossary/{slug}` | Full layout, tooltip stemming, referenced-in cross-links |
| **C3** | Landing page | `/topics/{slug}` | 23 pages — curriculum mapping, topic illustrations, body prose |
| **C4** | Blog post | `/blog/{slug}` | Featured image, meta + share dropdown, tags after body, related posts, JSON-LD Article |
| **C5** | Service pages | `/services/{type}` | 6 individual pages, all on v3 template — see routes below |
| **C6** | Legal page | `/privacy`, `/accessibility` | Shared prose layout used by B12 and B13 |
| **D8** | Topics mega menu | — | `TopicsMegaMenu.astro`, 23 topics grouped in desktop nav |
| **E1** | Enquiry form | `/contact` | `EnquiryForm.astro`, pre-tags via `?service=`, validation + success state |

### B1 homepage v2 — section breakdown

8-section teacher-first layout. Surface rhythm: dark → white → alt → white → alt → warm → ground → dark. Single OtA layer switch in §6.

| § | Section | Layer | Notes |
|---|---------|-------|-------|
| §1 | Teacher hero | Tailor | `surface--dark`, photography (`tailor-education-secondary-rse-group-activity.webp`), dual CTA |
| §2 | Platform / Tailor Teach | Tailor | App screenshot placeholder, feature list, lesson library CTA |
| §3 | Delivery | Tailor | `surface--alt`, photography (`tailor-education-primary-rse-discussion-circle.webp`), 3-step process |
| §4 | Training & support | Tailor | Photography (`tailor-education-teachers-reviewing-rse-resources.webp`), dual CTA |
| §5 | Trust signals | Tailor | `surface--alt`, framework badges + pull quote |
| §6 | Okay to Ask | OtA | Single layer switch — wordmark, 3 featured question cards (Fisher-Yates shuffled), book panel |
| §7 | Topics overview | Tailor | `TopicsOverviewGrid` |
| §8 | Closing CTA | Tailor | `surface--dark`, contact + lessons CTAs |

### C5 service page routes (v3)

All individual service pages share the v3 template — `service-hero`, `service-glance` (key facts strip), `service-description`, `service-features` (cards), optional `service-process` (steps), testimonial pullquote, related blog posts, `ServiceTopicsStrip`, repeated CTA. Hero photography wired across all pages.

| Route | Status | `serviceLink` filter |
|-------|--------|---------------------|
| `/services` | Hub (B5, `index.astro`) — header photo + six-card grid | — |
| `/services/rse-for-primary-schools` | v3 | `delivery` |
| `/services/rse-for-secondary-schools` | v3 | `delivery` |
| `/services/rse-for-send-and-ap` | v3 (Circuits) | `delivery` |
| `/services/drop-days` | v3 (lean — no process steps) | `drop-days` |
| `/services/rse-training` | v3 (richest content; replaces standalone B4) | `training` |
| `/services/rse-policy-curriculum-planning` | v3 (consultancy-shaped) | `rse-policy-curriculum-planning` |
| `/services/delivery` | 301 → `/services` | — |
| `/services/rse-delivery` | 301 → `/services` (v3 spec removed the hub variant) | — |
| `/training` | 301 → `/services/rse-training` (legacy B4 URL) | — |
| `/services/consultancy` | Stub — no longer in scope; held for removal | — |

### Shared components

| Component | Purpose |
|-----------|---------|
| `SiteHeader.astro` | A1 — persistent header, flat service nav, topics mega menu entry |
| `SiteFooter.astro` | A2 — links, Guess Design House credit, legal links |
| `SearchBar.astro` | A4 — header search input with Pagefind integration |
| `SimpleModeToggle.astro` | A6 — Standard/Simple switch for question and glossary pages |
| `GlossaryTooltips.astro` | A7 — inline tooltip system for glossary term references |
| `SignpostingBlock.astro` | A8 — contextual support services block on question pages |
| `CrisisSupport.astro` | A9 — prominent "Need support?" surface on safeguarding question pages |
| `AgeFlag.astro` | D1 — age interstitial on age-flagged question pages |
| `CtaExploreLessons.astro` | A11 — mid-landing "explore lessons" CTA |
| `CtaBringToSchool.astro` | A12 — bottom-landing "bring to school" CTA, now points at `/services` |
| `CtaServiceEnquiry.astro` | A13 — bottom-of-page service CTA, pre-tags enquiry form via `?service=` |
| `CtaBlogBottom.astro` | A13 variant — bottom-of-post blog CTA |
| `RelatedQuestions.astro`, `RelatedTerms.astro` | A15 — related content cards |
| `TopicTags.astro` | A16 — topic tag chips |
| `EndOfAnswerPanel.astro` | A17 — three-panel CTA at the bottom of question pages |
| `TopicsMegaMenu.astro` | D8 — desktop topics mega menu (23 landing pages, grouped) |
| `TopicsOverviewGrid.astro` | Topic card grid — homepage §7 and topics hub |
| `QuestionCard.astro` | OtA question card. Astro template for tags (no `set:html`), JS dynamic background detection for `mix-blend-mode: multiply` |
| `GlossaryTermCard.astro` | Glossary term card for related-terms panels |
| `EnquiryForm.astro` | E1 — service enquiry form, validation, success state |
| `ServicePageStyles.astro` | Global styles shared by all C5 pages (hero, glance, description, feature cards, process steps, testimonial, blog grid) |
| `ServiceTopicsStrip.astro` | Compact 6-topic chip row for C5 pages. Accepts `featuredSlugs` prop, backfills alphabetically |
| `Analytics.astro` | GA4 + analytics attribute helpers |

### Data layer

- `src/lib/notion.ts` — low-level Notion client + `getFilesUrl()` and `getDateValue()` property helpers
- `src/lib/notion-cache.ts` — per-build Notion cache
- `src/lib/fetchers.ts` — Notion API fetchers for blog posts, questions, glossary, landing pages
- `src/lib/content.ts` — high-level `getBlogPosts()`, `getQuestions()`, `getLandingPages()`, `getGlossaryTerms()` content API used by pages
- `src/lib/types.ts` — `BlogPost` (includes `featuredImage`, `publishedDate`, `serviceLink`), `LandingPage`, `QuestionRef`, `GlossaryTerm` types
- `src/lib/related-blog-posts.ts`, `src/lib/related-questions.ts` — related-content resolvers
- `src/lib/render-blocks.ts` — Notion block → HTML renderer
- `src/lib/glossary-tooltips.ts` — tooltip stemming and term matching for inline glossary references
- `src/lib/topic-illustrations.ts` — slug → illustration SVG path map for the 23 landing pages
- `src/lib/post-it-images.ts` — question post-it image resolution
- `src/lib/support-services.ts` — signposting and crisis service registry

### Retired or superseded

| Code | Note |
|------|------|
| **A10** | Author attribution on question pages — retired (the organisation is the brand) |
| **A14** | Teacher bridge — superseded by A17 end-of-answer panel |
| **B4** | Standalone RSE Training showcase — replaced by C5 `/services/rse-training` (v3 spec); `/training` now 301s to the new route |

### Not yet built

| Code | Page / template | Notes |
|------|----------------|-------|
| **D2** | Search bar expanded state | Working states live in A4/A5; dedicated wireframe pending |
| **D3** | Mobile navigation | Mobile nav functional; dedicated wireframe pending |
| **D4** | Glossary tooltip expanded | Working states live in A7; dedicated wireframe pending |
| **D5** | Simple Mode transition | Micro-interaction design pending |
| **D6** | Enquiry form states | Visual states spec pending (form itself is built) |
| **D7** | Dual-answer layout | For ~10–15% of questions with two age-differentiated answers |

*Document version: 1.3 | Date: 10 April 2026*
