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
| **B8** | Okay to Ask landing | `/questions/` | Browse all questions. The front door for young people. Must feel like Okay to Ask (warm, informal, post-it motif), not the B2B showcase. Filterable by the 7 Okay to Ask categories: Anatomy, Puberty, Relationships, Sex, Sexual Health, Sex & the Law, Contraception & Pregnancy. These are the book categories and the young-person browsing structure — distinct from the app's 87 topics and the website's 22 landing page groupings. Includes a book promotion hero/CTA ("Get the Okay to Ask book" → B11). May include featured/popular questions. |
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
| **C3** | Landing page | `/topics/{slug}` | 22 | Teacher-facing topic landing page. Aggregates relevant granular topics from the 87-topic app taxonomy. Pulls in related questions, glossary terms, blog posts. CTAs (mid-page "explore lessons" + bottom "bring to school"). The bridge between content and services. See landing page list below. |
| **C4** | Blog post | `/blog/{slug}` | ~20 at launch | Title, author, date, audience label, body content with glossary tooltips, topic tags, related posts, bottom CTA (service or app). |
| **C5** | Service page | `/services/{type}` | 3 | What the service is, who it's for, what's included, enquiry CTA, testimonial pull quote, related blog posts, related topics. Three instances: delivery, drop-days, rse-policy-curriculum-planning. |
| **C6** | Legal page | various | 2 | Simple text page template. Used for B12 (Privacy policy) and B13 (Accessibility & inclusivity). No unique components — just heading, body text, footer. No wireframe needed. |

### C3 landing pages — the 22 pages

These are the teacher-facing website landing pages that sit on top of the 87 granular app topics. They are determined by search demand and competitor analysis (see Tailor_Landing_Page_Proposal.md). The 87 granular topics do not get their own pages on the website — they power the app's filtering system only.

**Topic landing pages (in the mega menu, grouped by the 7 app categories):**

| # | Page title | Slug | Category |
|---|-----------|------|----------|
| 1 | Consent | consent | Relationships |
| 2 | Healthy relationships | healthy-relationships | Relationships |
| 3 | Friendships | friendships | Relationships |
| 4 | Families | families | Relationships |
| 5 | Positive sexuality and intimacy | positive-sexuality-and-intimacy | Relationships |
| 6 | Contraception | contraception | Sex & Sexual Health |
| 7 | STIs and sexual health | stis-and-sexual-health | Sex & Sexual Health |
| 8 | Pregnancy and reproductive health | pregnancy-and-reproductive-health | Sex & Sexual Health |
| 9 | Sex and the law | sex-and-the-law | Sex & Sexual Health |
| 10 | Puberty | puberty | Puberty & The Body |
| 11 | Body image | body-image | Puberty & The Body |
| 12 | LGBTQ+ inclusion | lgbtq-inclusion | Identity & Diversity |
| 13 | Masculinity and misogyny | masculinity-and-misogyny | Identity & Diversity |
| 14 | Stereotypes, prejudice and discrimination | stereotypes-prejudice-and-discrimination | Identity & Diversity |
| 15 | Online safety | online-safety | Online Safety & Media |
| 16 | Sexting and sharing nudes | sexting-and-sharing-nudes | Online Safety & Media |
| 17 | Pornography and media literacy | pornography-and-media-literacy | Online Safety & Media |
| 18 | Abuse, exploitation and violence | abuse-exploitation-and-violence | Safety & Safeguarding |
| 19 | FGM and harmful practices | fgm-and-harmful-practices | Safety & Safeguarding |
| 20 | Personal safety | personal-safety | Safety & Safeguarding |
| 21 | Mental health and wellbeing | mental-health-and-wellbeing | Health & Wellbeing |
| 22 | Drugs, alcohol and vaping | drugs-alcohol-and-vaping | Health & Wellbeing |

**Cross-cutting service/audience pages — nav placement resolved:**

These pages use a service/audience template (variant of C3 or C5) and sit in the "RSE Delivery" dropdown in the main nav, except where noted.

| Page title | Slug | Nav location | Notes |
|-----------|------|-------------|-------|
| RSE for primary schools | rse-for-primary-schools | RSE Delivery dropdown | Key stage entry point |
| RSE for secondary schools | rse-for-secondary-schools | RSE Delivery dropdown | Key stage entry point |
| RSE for SEND & alternative provision (Circuits) | rse-for-send-and-alternative-provision | RSE Delivery dropdown | Circuits: workbook-based, self-paced lessons for SEND/AP settings. Simplified keynotes, doodle/game space in workbooks. A distinct product line, not an afterthought. Deserves its own dedicated page. |
| Direct RSE delivery | delivery | RSE Delivery dropdown | Also accessible via `/services/delivery` |
| RSE policy and curriculum planning | rse-policy-and-curriculum-planning | Under RSE policy & curriculum planning on `/services` | Consultancy pathway — not in the RSE Delivery dropdown |
| Training | training | Top-level nav item (`/rse-training`, B4) | Already exists. Not in the RSE Delivery dropdown — it's its own nav item. |

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
| **D8** | Topics mega menu | Desktop: expands from "Topics" nav item. Shows all 22 topic landing pages grouped by category (5 groups). Mobile: within the mobile nav (D3), either as an expandable section or a sub-menu. |

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

*Document version: 1.0 | Date: 1 April 2026*
