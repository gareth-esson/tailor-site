# Stage 4 — Landing pages and navigation

*Briefing document for Claude Code. Read this first, then read the referenced files.*

---

## What you're building

The 22 topic landing pages (C3), the site header with navigation (A1, A3), the topics mega menu (D8), and the Okay to Ask landing page (B8). These are the structural backbone of the teacher-facing site and the front door for young people.

## What already exists

- Stage 1: Notion pipeline, typed content collections
- Stage 2: Design system, font loading, layout with layer scoping
- Stage 3: Question pages (C1), glossary pages (C2), Simple Mode toggle, glossary tooltips, signposting, crisis support

Read the existing codebase before making changes.

## Files to read for this stage

```
docs/Tailor_Content_Site_Build_Spec_v1.md           — sections 3.3, 4, and 5
docs/Tailor_Page_Content_Spec_v1.md                  — sections C3, B8, A1, A2, A3, D8
docs/Tailor_Site_Structure_v1.md                     — full list of 22 landing pages and 5 cross-cutting pages
docs/Tailor_Design_System_Implementation_Notes.md    — token reference
```

## Landing page template [C3] (`/topics/{slug}`)

22 instances. Each landing page aggregates one or more of the 83 granular app topics. Content is pulled from all underlying granular topics.

Build in content hierarchy order:

1. **Page title + category label** — landing page title with its app category.

2. **Topic overview** — body content from Notion page body. What this topic covers and why it matters.

3. **Curriculum mapping** — DfE 2026 references, PSHE Association references.

4. **Learning objectives** — by key stage where relevant.

5. **CTA [A11]** — mid-page. "Explore ready-made lessons on [topic]" → app library URL filtered by relevant granular topic slug(s). Always present.

6. **Questions young people ask** — auto-populated from Questions DB where Topic relation includes any of this landing page's underlying granular topics. Shows question title + category tag, links to question pages. Sorted: answered questions first, then alphabetically.

7. **Key terms** — auto-populated from Glossary DB where Topic relation includes any underlying granular topic. Term name + short definition, linking to glossary pages. Sorted alphabetically.

8. **For teachers: further reading** — conditional. Auto-populated from Blog DB where Topic or Secondary Topics match. Only renders if at least one post exists. Sorted by date (newest first).

9. **Related landing pages** — other landing pages in the same category, plus thematically related cross-category pages.

10. **CTA [A12]** — bottom of page. "Bring [topic] into your school" → target varies by landing page (driven by Service CTA Target field: delivery / training / drop-days / consultancy).

### Landing pages use the Tailor layer

Default layer — Lexend throughout, neutral surfaces, teal accent. No `.layer-ota` on these pages.

## The 22 landing pages

| # | Title | Slug | Category |
|---|-------|------|----------|
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

## Site header and navigation [A1, A3]

Build the real header now. It appears on every page and must work for both layers.

**Contains:**
1. Tailor Education logo (links to `/`) — placeholder image for now
2. Primary navigation links: Topics, Okay to Ask, Training, Services, Blog, About, Contact
3. Search bar placeholder (A4) — visible on desktop, icon on mobile. Non-functional until Stage 6.

**Behaviour:**
- Always uses Lexend (it's outside `<main>`, inherits from body)
- Mobile: hamburger menu + search icon
- "Topics" triggers the mega menu (D8)

## Topics mega menu [D8]

Expands from the "Topics" nav item. Shows all 22 landing pages grouped by the 7 app categories.

**Desktop:** Multi-column layout. Each category is a group heading with its landing pages listed beneath. All 22 visible without scrolling.

**Mobile:** Within the mobile nav, either an accordion by category or a scrollable sub-menu.

The category headings use the `--cat-*` tokens (these are the app's 7 RSHE categories, NOT the OtA browsing categories). The category headings are labels, not links.

## Okay to Ask landing page [B8] (`/questions/`)

The front door for young people. Uses the OtA layer (`layer="ota"`).

1. **Hero** — Okay to Ask branding. Post-it motif prominent.
2. **Book promotion** — placeholder CTA to `/book`.
3. **Browse by category** — the 7 OtA categories (Anatomy, Puberty, Relationships, Sex, Sexual Health, Sex & the Law, Contraception & Pregnancy). These use `--ota-cat-*` tokens and `.badge--ota-*` classes. Filter buttons that show/hide questions by category.
4. **Question list** — all published questions, filterable by the 7 OtA categories. Each shows: question title (link), category badge. Client-side filtering.
5. **What is Okay to Ask?** — brief explanation text.
6. **General signposting** — a support block with key services. Not question-specific.

## Footer [A2]

Build the real footer now. Always Lexend. Always outside `<main>`.

Contains: Tailor Education branding, Okay to Ask attribution ("Okay to Ask is a Tailor Education project"), nav links, social links (Instagram @oktoask.co.uk), safeguarding statement link, accessibility link, privacy link, copyright, design credit ("Designed by Guess Design House").

## What "done" looks like

1. All 22 landing pages render with aggregated questions, glossary terms, and (conditional) blog posts
2. The mega menu shows all 22 pages grouped correctly by category
3. The header appears on every page with working navigation links
4. The footer appears on every page with correct content
5. The Okay to Ask landing page shows all questions with working category filters
6. Category badges use the correct token system (`--ota-cat-*` on B8, `--cat-*` in the mega menu)
7. Mobile navigation works (hamburger menu, responsive mega menu)

## What NOT to build

- No blog post template (Stage 5)
- No service pages (Stage 5)
- No showcase pages (Stage 5)
- No search functionality (Stage 6)
- No analytics (Stage 6)
- No SEO metadata (Stage 6)

---

*Stage 4 of 6. Previous: Core Templates. Next: Remaining Pages.*
