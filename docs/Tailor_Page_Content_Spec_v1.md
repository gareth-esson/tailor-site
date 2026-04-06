# Tailor Education — Page content spec v1

*Content specification for every page, template, and component in the site. Use alongside the Site Structure document (Tailor_Site_Structure_v1.md) when wireframing.*

*This document specifies what goes on each page, in what order, and what's grouped together. It does not make layout decisions — wireframe in a single column, showing content hierarchy and section order only. Art direction (grid structure, asymmetric layouts, visual weight, spacing) is in the separate art direction brief.*

*Reference codes match the Site Structure document exactly.*

---

## A — Global components

### A1 — Site header

The persistent top-level navigation bar on every page.

**Contains:**
1. Tailor Education logo (links to `/`)
2. Primary navigation (see A3)
3. Search bar (see A4)

**Behaviour:**
- Sticky or fixed on scroll (design decision)
- Same structural shell across the whole site — the Okay to Ask section doesn't get a different header, just potentially different visual treatment via CSS tokens
- Mobile: logo + hamburger icon + search icon

---

### A2 — Site footer

**Contains:**
1. Tailor Education branding and strapline
2. Okay to Ask branding (secondary)
3. Navigation links (mirroring or summarising the main nav)
4. Social links (Instagram @oktoask.co.uk, any others)
5. Safeguarding statement link (→ `/our-approach` or a dedicated anchor within it)
6. Accessibility & inclusivity link (→ `/accessibility`)
7. Privacy policy link (→ `/privacy`) — required for GA4 and localStorage usage under UK GDPR
7. Cookie notice link (if not handled by a banner/modal)
8. Copyright notice
9. Tailor Education CIC company number (to be added once CIC registration is complete)
10. "Okay to Ask is a Tailor Education project" attribution line
11. Design credit: "Designed by Guess Design House" with Guess Design House logo (links to guessdesignhouse.com or equivalent)

---

### A3 — Navigation

**Primary navigation items:**
- Topics (→ mega menu D8 showing 22 landing pages grouped by 7 app categories)
- Okay to Ask (→ `/questions/`)
- RSE Delivery (→ dropdown containing:)
  - RSE for primary schools
  - RSE for secondary schools
  - RSE for SEND & alternative provision (Circuits)
  - Direct RSE delivery
  - Drop days
- RSE Training & Support (→ dropdown containing:)
  - RSE Training (→ `/rse-training`)
  - RSE Policy & Curriculum Planning (→ `/services/rse-policy-curriculum-planning`)
- Blog (→ `/blog/`)
- About (→ `/about`)
- Contact (→ `/contact`)

**Considerations:**
- "Topics" and "Okay to Ask" are the two highest-traffic sections — they should be prominent
- A teacher arriving at `/rse-training` and a young person arriving at `/questions/` both need to feel the navigation serves them
- Mobile: full-screen or slide-out panel (see D3)

---

### A4 — Search bar (header state)

**Desktop:** Visible in header. Text input with placeholder ("Search questions, topics, glossary..."). Expands or highlights on focus.

**Mobile:** Magnifying glass icon in header. Tapping it expands the search bar (could overlay the header, or slide down below it — design decision).

**States:** Inactive, focused/empty, typing (triggers A5 dropdown after 2+ characters), results showing.

---

### A5 — Search results dropdown

**Appears:** Below the search bar after 2+ characters typed.

**Contains:**
1. Results grouped by content type, each with a label:
   - "Questions" — question title + topic tag
   - "Glossary" — term + short definition
   - "Topics" — topic name + category
   - "Blog" — post title
   - "Services" — page title
2. Top 5–8 results total (not 5–8 per type)
3. "See all results →" link at the bottom (→ `/search?q={query}`)

**States:** Loading, results found, no results ("No results for '[query]'. Try a different search term.")

---

### A6 — Simple Mode toggle

**What it is:** A switch that lets the reader choose between Standard and Simple reading levels. Their choice persists across the site via localStorage.

**Where it appears:** On every page that has simple content — question pages (C1) and glossary pages (C2). Does not appear on pages without simple content variants (showcase pages, blog posts, landing pages).

**States:** Standard (default), Simple (active).

**Behaviour:** Should remain accessible as the reader scrolls — either sticky/fixed, or positioned so it doesn't scroll out of view before the content it controls. Design decision for Gareth.

**Important:** This should feel like an accessibility feature, not a children's mode. The language and design should frame it as a reading level preference, not a simplification.

---

### A7 — Glossary tooltip

**Trigger:** Tapping (mobile) or hovering (desktop) on a highlighted glossary term in body text.

**Contains:**
1. Term name (bold)
2. Definition — Short Definition in Standard mode, Simple Definition in Simple mode
3. "Read more →" link (→ `/glossary/{slug}`)

**Behaviour:**
- Desktop: appears on hover, stays open on hover, closes on mouse-out or click elsewhere
- Mobile: appears on tap, closes on tap elsewhere or a close button
- Only the first occurrence of each term per page is tooltipped

---

### A8 — Signposting block

**What it is:** A persistent block at the bottom of question pages listing relevant support services.

**Contains (contextually selected per question from the Signposting field):**
- Service name
- What they help with (one line)
- Contact method (phone number, URL, or both)

**Services pool:** Childline, Brook, The Mix, NSPCC, Women's Aid, NHS Sexual Health, Galop. Only those relevant to the question's topic appear.

**Behaviour:** Not dismissable. Same in Standard and Simple modes.

---

### A9 — Crisis support component

**What it is:** A prominent "Need support?" element on safeguarding-related question pages, positioned above the answer.

**Contains:**
1. A short, direct message — something like "If this is happening to you, help is here"
2. The most relevant crisis service for this question's topic (name + phone number + link)
3. Possibly a secondary service

**Behaviour:**
- Only appears on questions whose topic is in the Safety & Safeguarding category or whose content sensitivity is "specialist" or "mandatory_reporting"
- Visually distinct from the answer content — must be noticeable without being alarming
- Not dismissable
- Same in Standard and Simple modes

---

### A10 — *Retired — no author attribution on question pages*

Question pages do not carry individual author attribution. The answers are the Okay to Ask brand voice, not a personal byline. Trust on question pages comes from the signposting, safeguarding commitment, the `/our-approach` page, and the quality of the answers — not from a name.

Blog posts (C4) have author bylines (the team member who wrote it). The book credits Gareth as author. Service pages use "we" not "I".

---

### A11 — CTA block: "Explore lessons"

**Contains:**
1. Copy: "Explore ready-made lessons on [topic name]" (topic name pulled from the page's Topic relation)
2. Link → app library filtered by this topic slug

**Where it appears:** Mid-page on landing pages (C3), after the topic overview section, before the questions list.

---

### A12 — CTA block: "Bring this into your school"

**Contains:**
1. Copy: "Bring [topic name] into your school" or similar
2. Link → target varies by landing page (Service CTA Target field on Landing Pages DB): delivery, training, drop-days, or rse-policy-curriculum-planning page

**Where it appears:** Bottom of landing pages (C3), after all content sections.

---

### A13 — CTA block: service enquiry

**Contains:**
1. Copy: "Want help with [service name]? Talk to us" (service name driven by the page's Service Link field)
2. Link → enquiry form (E1) pre-tagged with the service type

**Variant:** When Service Link = "none", the CTA becomes "Explore lessons on [topic] →" linking to the app library.

**Where it appears:** Bottom of blog posts (C4). Also used on service pages (C5) as the primary conversion CTA.

---

### A14 — *Retired — replaced by A17*

---

### A15 — Related content cards

**What it is:** A reusable card component for showing related items. Likely needs variants per content type.

**Variant: Related question**
- Question title
- Topic tag
- Links to `/anonymous_question/{slug}`

**Variant: Related blog post**
- Post title
- Date
- Target audience label
- Links to `/blog/{slug}`

**Variant: Related glossary term**
- Term name
- Short definition (or Simple Definition in Simple mode)
- Links to `/glossary/{slug}`

**Where it appears:** Related questions on C1, related blog posts on C4 and C5, glossary terms list on C3, blog posts section on C3.

---

### A16 — Topic tag chips

**What it is:** Small linked labels showing which topic(s) a page belongs to.

**Contains:** Topic name, links to `/topics/{slug}`. Possibly colour-coded by category (design decision).

**Where it appears:** Question pages (C1), blog posts (C4), glossary pages (C2). Usually near the top or bottom of the page.

---

### A17 — End-of-answer panel

**What it is:** A three-panel CTA block that appears at the bottom of every question page, after the signposting block (A8). It serves all three audiences who land on question pages.

**Panel 1 — "Get the book"**
- Audience: young people, parents
- Okay to Ask book purchase CTA
- Links to `/book` (purchase via Stripe payment link)
- Visual: should feel connected to the Okay to Ask brand (post-it motif, book cover image when available)

**Panel 2 — "Explore how to teach this topic"**
- Audience: teachers
- Links to `/topics/{primary_topic_slug}` for this question's primary topic
- This replaces the old single-line teacher bridge (A14) — same destination, but now part of a designed panel rather than a quiet line

**Panel 3 — "Bring RSE into your school"**
- Audience: school leaders
- Links to `/services` or `/rse-training`
- The most direct conversion pathway on question pages

**Where it appears:** On every question page (C1). Positioned after the signposting block (A8).

**Design considerations:**
- The panels should feel like a natural end to the page, not an ad strip. The tone is helpful, not salesy.
- On mobile, the three panels likely stack vertically. On desktop, they could sit side by side.
- The book panel will need a placeholder state until the sales URL and book imagery are ready.

---

## B — Showcase pages

### B1 — Homepage

**Purpose:** The front door for the entire site. Serves two audiences with a clear fork.

**Sections in order:**

1. **Hero — teacher/school pathway**
   - Headline: something conveying "Expert RSE lessons, ready to teach" (copy TBD)
   - Subline: brief value proposition
   - Primary CTA: "Explore RSE lessons" → app library or `/topics`
   - Secondary CTA: "Training and services for schools" → `/services`

2. **Hero — young person pathway (Okay to Ask)**
   - Headline: "Got a question? Okay to Ask."
   - The visual shift to Okay to Ask identity starts here (post-it motif, warmer tone)
   - CTA: leads to `/questions/`

3. **Book promotion** (within the Okay to Ask section)
   - "The Okay to Ask book is here" — cover image, one-line pitch, purchase CTA → B11
   - This sits naturally alongside the Okay to Ask hero as part of the young person / parent pathway

4. **What Tailor Education does** (brief — 2–3 short points)
   - Expert-authored RSE lessons
   - RSE training for teachers
   - Consultancy and delivery for schools
   - Each links to the relevant section

5. **Featured questions** (Okay to Ask taster)
   - 3–5 question titles with post-it images, linking to question pages
   - Draws the young person audience deeper

6. **Trust signals**
   - Framework alignment badges or text (DfE, PSHE Association, UNESCO, WHO)
   - Testimonial pull quote
   - Link to `/our-approach`

7. **Topics overview**
   - The 22 landing pages grouped by the 7 app categories, or a visual browse-by-category element
   - Links into `/topics/{slug}` landing pages
   - This is a teacher-facing section — shows the breadth of what Tailor covers

---

### B2 — About

**Purpose:** What Tailor Education is, what it does, and who's behind it. Presents the organisation as a professional practice, not a one-person operation.

**Sections in order:**

1. **Tailor Education** — what the CIC does, its mission, its approach. This leads. The organisation is the brand.

2. **Meet the team** — Gareth Esson as founder, plus team members with names, roles, and photos. Gareth's background and qualifications sit here as part of the team, not as the page's centrepiece. Real people, real faces — this is the "we" behind "we deliver."

3. **The Okay to Ask project** — what it is, why it exists, the post-it question story. The book.

4. **Framework alignment** — DfE, PSHE Association, UNESCO, WHO. Can be brief here because `/our-approach` (B3) covers it in depth.

5. **CTA** — "See our approach →" (→ B3) and/or "Get in touch →" (→ B7)

---

### B3 — Our Approach

**Purpose:** The trust page. Parents checking the site, school leaders justifying their choice of provider, Ofsted evidence.

**Sections in order:**

1. **How we write content** — expert-authored by Gareth, not crowdsourced. Consistent pedagogical voice. Reviewed and updated.

2. **Framework alignment** — in detail:
   - DfE statutory RSE guidance (2020 and 2026 revision)
   - PSHE Association Programme of Study
   - UNESCO International Technical Guidance on Sexuality Education
   - WHO Standards for Sexuality Education in Europe
   - Each with a brief explanation of what it means and how Tailor content maps to it

3. **Safeguarding commitment**
   - How safeguarding is embedded in content design (not bolted on)
   - FGM mandatory reporting duties
   - KCSIE awareness
   - Disclosure-aware activity design
   - Link to Childline / relevant services

4. **Inclusivity** — Equality Act 2010 protected characteristics inform every activity. Inclusive by design, not as an afterthought.

5. **The Okay to Ask editorial approach** — how answers are written, the voice principles, why honesty matters, the age flagging system.

6. **CTA** — "Explore our training →" (→ B4) and/or "Browse topics →" (→ landing pages)

---

### B4 — RSE Training

**Purpose:** Convert teachers and schools into training enquiries. The highest-traffic service page because the app funnels here.

**Sections in order:**

1. **What the training is** — headline, brief description. "Tailor Education RSE training gives your teachers the confidence and skills to deliver RSE on the topics that matter most."

2. **What teachers learn** — key outcomes. Not a bullet list of modules — frame as what changes for the teacher after the training.

3. **How it connects to the app** — completing training unlocks training-recommended content in the Tailor app. This is the unique value proposition: training isn't just a day, it's a gateway to ongoing resources.

4. **Format and logistics** — duration, in-person / online / both, who delivers it, what schools need to provide.

5. **Testimonial** — from a teacher or school leader about the training specifically.

6. **CTA** — enquiry form (E1) pre-tagged "RSE training". Could be inline on this page or a link to `/contact`.

---

### B5 — Services hub

**Purpose:** Landing page for all services. Brief descriptions with cards linking to individual pages.

**Sections in order:**

1. **Headline** — "RSE services for schools" or similar.

2. **Service cards** (one per service line):
   - Direct RSE delivery (→ C5 at `/services/delivery`)
   - RSE training (→ B4 at `/rse-training`)
   - Drop day delivery (→ C5 at `/services/drop-days`)
   - RSE policy & curriculum planning (→ C5 at `/services/rse-policy-curriculum-planning`)
   - Each card: service name, one-sentence description, "Learn more →" link

3. **Trust signal** — testimonial or "Trusted by X schools" or framework alignment badges.

4. **CTA** — "Not sure what you need? Get in touch →" (→ B7)

---

### B6 — Testimonials

**Purpose:** Social proof. Supports every service line.

**Sections in order:**

1. **Headline** — "What schools say" or similar.

2. **Testimonials** — attributable wherever possible (school name, person's role). Mix of:
   - Pull quotes (short)
   - Case-study style (longer — "We brought Gareth in for a Year 9 drop day and here's what happened")
   - Ideally tagged by service line so they can be filtered or grouped

3. **CTA** — "Work with us →" (→ B5 or B7)

---

### B7 — Contact

**Purpose:** General contact page. May host the enquiry form (E1) or link to it.

**Sections in order:**

1. **Enquiry form** (E1) — if this is where the form lives. Pre-selectable service type.

2. **Direct contact** — Team email and/or phone.

3. **Social links** — Instagram, anything else.

4. **Note** — "For urgent safeguarding concerns, contact [relevant authority]." Not a crisis helpline page — just a responsible acknowledgement.

---

### B8 — Okay to Ask landing

**Purpose:** The front door for young people. Browse all questions. Buy the book.

**Sections in order:**

1. **Hero** — Okay to Ask branding. Headline: "Real questions from real young people. Answered honestly." (or similar — Gareth's copy). The post-it motif is prominent here.

2. **Book promotion** — "The Okay to Ask book" — cover image, one-line pitch, purchase CTA → B11. This is a hero-level element, not a sidebar ad. The book is the physical embodiment of the Okay to Ask project and deserves prominent placement on its home page.

3. **Browse by category** — the 7 Okay to Ask categories (Anatomy, Puberty, Relationships, Sex, Sexual Health, Sex & the Law, Contraception & Pregnancy). Each filterable to show questions within. These are the book categories — distinct from the app's 7 categories and the website's 22 landing page groupings.

4. **Question list** — all published questions, filterable by the 7 categories above. Each shows: question title (as a link), category tag. Could also show the post-it image as a thumbnail.

5. **What is Okay to Ask?** — brief explanation of where the questions come from (real anonymous question boxes in schools) and who answers them.

6. **Signposting** — a general "Need support?" block with key services. Not question-specific — just a safety net for anyone browsing.

---

### B9 — Blog index

**Purpose:** List of all blog posts.

**Sections in order:**

1. **Headline** — "Blog" or "For teachers" or similar.

2. **Filter/sort** — by topic, by category (practical teaching / curriculum & policy / bridging content), by target audience. Sorted by date (newest first) by default.

3. **Post list** — each showing: title, date, author, target audience label, topic tags, first 1–2 lines of the post. Links to `/blog/{slug}`.

---

### B10 — Search results

**Purpose:** Full search results when the reader presses Enter or clicks "See all results" from the dropdown.

**Sections in order:**

1. **Search input** — the query pre-filled, editable. Same search bar as A4 but larger/more prominent.

2. **Result count** — "X results for '[query]'"

3. **Results grouped by content type:**
   - Questions (with "Okay to Ask" label)
   - Glossary (with short definition preview)
   - Topics (with category label)
   - Blog (with date)
   - Services
   - Each group shows up to 5 results with a "Show all [type]" toggle
   - Groups with no results don't appear

4. **No results state** — "No results for '[query]'. Try a different search, or browse by topic →" (→ B8 or landing pages)

---

### B11 — Book page

**Purpose:** Sell the Okay to Ask book. This page is the destination for every "Get the book" panel in the end-of-answer block (A17) across all 152 question pages.

**Sections in order:**

1. **Hero** — book title ("Okay to Ask"), cover image (or hero shot of the book), one-line pitch. Okay to Ask visual identity, not the B2B showcase tone.

2. **What's inside** — brief description of the book. Real questions from real young people, answered honestly. Post-it scans + answers. The physical version of the Okay to Ask content.

3. **Who it's for** — this is important because the book serves multiple use cases:
   - Parents who want a conversation starter at home
   - School staff rooms — a reference that's always on the shelf
   - Conference and training tables — a credibility artifact
   - Young people themselves — a book that treats them with respect

4. **Purchase CTA** — the primary action. Links to Stripe payment link. "Buy the book" or "Get your copy" button.
   - If selling direct: price, add-to-cart or buy button
   - If selling via external retailer: "Buy on [retailer]" link
   - If not yet available for purchase: "Register interest" email capture

5. **Sample content** — 2–3 example questions with post-it images and answer excerpts. Lets the visitor see the tone and quality before buying. Links to the full question pages.

6. **Trust signal** — could be a testimonial, or the framework alignment badges, or "Written by the Tailor Education team."

---

### B12 — Privacy policy

**Purpose:** Legal requirement for GA4 and localStorage usage under UK GDPR.

**Sections in order:**

1. **What data is collected** — GA4 analytics (anonymised usage data), localStorage (Simple Mode preference only). No user accounts on the content site. No personal data collected beyond the enquiry form.

2. **Enquiry form data** — what happens to name, email, school name submitted via E1. Sent to the team's email. Not stored in a database. Not shared with third parties.

3. **Cookies and localStorage** — what's stored, why, how to clear it.

4. **Third-party services** — GA4 (Google), any form provider, any embedded content.

5. **Contact** — how to request data deletion or ask questions about privacy.

**Design note:** This doesn't need a custom wireframe — it's a standard text page. Use the same layout as other text-heavy pages (about, our approach). Linked from footer.

---

### B13 — Accessibility & inclusivity

**Purpose:** A standalone page explaining how the site is built for accessibility and what Tailor Education's commitment to inclusivity means in practice. This is both a genuine accessibility statement and a trust signal — it shows schools and parents that the site takes these things seriously.

**Sections in order:**

1. **Simple Mode** — what it is, how to use it, who it's for. This is the headline feature. Frame it as a reading level choice, not a disability accommodation.

2. **Inclusive language** — how Okay to Ask content is written: no assumption of heterosexuality or cisgender identity, correct terminology, age-appropriate honesty.

3. **Technical accessibility** — WCAG compliance level the site targets, keyboard navigation, screen reader support, colour contrast, alt text on images.

4. **Signposting and safeguarding** — how support services are surfaced on every question page, the crisis support component on safeguarding topics.

5. **Feedback** — "If something on this site isn't accessible to you, tell us" — contact link.

**Design note:** Standard text page. Linked from footer. Doesn't need a custom wireframe.

---

## C — Content templates

### C1 — Question page

**The most complex template.** Each section is listed in order. Components referenced by their A-code.

1. **[CONDITIONAL] Crisis support component (A9)** — only on safeguarding-related questions. Above everything else.

2. **[CONDITIONAL] Age flag interstitial (D1)** — only on age-flagged questions. Shows before the answer.

3. **Post-it image** — the scanned handwritten question. Prominent. This is the visual hook.

4. **Simple Mode toggle (A6)** — positioned near the answer, before the text begins.

5. **Answer** — standard answer (from Notion page body) or Simple Answer (from property field), depending on mode. This is the core content. Includes inline glossary tooltips (A7) throughout.

6. **Signposting block (A8)** — support services relevant to this question. Immediately after the answer. Always present, not dismissable.

7. **End-of-answer panel (A17)** — three-panel CTA block: "Get the book" / "Explore how to teach this topic" / "Bring RSE into your school". Serves all three audiences.

8. **Related questions (A15, question variant)** — 3–5 related question cards.

9. **Topic tags (A16)** — links to parent landing page(s).

---

### C2 — Glossary page

1. **Term heading** — the glossary term as the page title.

2. **Simple Mode toggle (A6)**

3. **Definition** — Short Definition (standard) or Simple Definition (simple mode). Prominent — this is the tooltip text, shown here as a standalone element.

4. **Full explainer** — standard explainer (from Notion page body) or Simple Explainer (from property field), depending on mode. Includes inline glossary tooltips (A7).

5. **[FUTURE] Diagram/illustration** — where relevant. Shows in both modes.

6. **Related glossary terms (A15, glossary variant)** — links to related terms.

7. **Questions that reference this term (A15, question variant)** — links to question pages.

8. **Signposting block (A8)** — if relevant to the term's topic.

9. **CTA** — "Explore [topic name] →" linking to the landing page.

10. **Topic tags (A16)**

---

### C3 — Landing page

22 instances. These are teacher-facing topic landing pages that aggregate relevant granular topics from the 87-topic app taxonomy. They are the website's primary SEO and navigation structure for topics. See the site structure document for the full list of 22 pages grouped by the 7 app categories.

Each landing page maps to one or more of the 87 granular app topics. It pulls in questions, glossary terms, and blog posts tagged to any of its underlying granular topics.

1. **Page title + category label** — the landing page title (e.g. "Consent", "Pornography and media literacy") plus its app category (e.g. "Relationships", "Online Safety & Media").

2. **Topic overview** — what this topic covers and why it matters. Written for teachers and school leaders. Should make clear what the landing page encompasses (e.g. "Puberty" covers physical changes, emotional changes, menstruation, hygiene, body confidence). Body content pulled from the Notion page body at build time.

3. **Curriculum mapping** — DfE 2026 references, PSHE Association references. Which statutory requirements this topic addresses. Brief — this is for teachers checking alignment.

4. **Learning objectives** — what students should understand about this topic, by key stage where relevant.

5. **CTA: "Explore lessons" (A11)** — mid-page. "Explore ready-made lessons on [topic]" → app library filtered by the relevant granular topic slug(s).

6. **Questions young people ask** — auto-populated from Questions DB where any of this landing page's underlying granular topics match. Question titles as links, with category tags. This section serves both audiences: young people can click through, teachers can see what students actually ask.

7. **Key terms** — auto-populated from Glossary DB where any of this landing page's underlying granular topics match. Term name + short definition, linking to glossary pages.

8. **[CONDITIONAL] For teachers: further reading** — auto-populated from Blog DB. Only renders if blog posts exist tagged to any of this landing page's underlying topics. Post titles with date and audience label.

9. **Related landing pages** — links to other landing pages in the same category, plus any cross-category pages that are thematically related.

10. **CTA: "Bring this into your school" (A12)** — bottom of page. Target varies by landing page (driven by Service CTA Target field).

---

### C4 — Blog post

1. **Title**

2. **Meta line** — author, date, target audience label (teachers / school leaders / parents).

3. **Topic tags (A16)** — which topic(s) this post relates to.

4. **Body content** — from Notion page body. Includes inline glossary tooltips (A7). May include author-placed inline CTAs written naturally into the text (linking to service pages).

5. **Related blog posts (A15, blog variant)** — 2–3 related posts.

6. **CTA (A13)** — if Service Link is set: "Want help with [service]? Talk to us" → enquiry form. If Service Link = "none": "Explore lessons on [topic] →" → app library.

---

### C5 — Service page

Three instances: `/services/delivery`, `/services/drop-days`, `/services/rse-policy-curriculum-planning`. Same template, different content.

1. **Service name + headline**

2. **What the service is** — clear description. What happens, what's included, what the school gets.

3. **Who it's for** — the buyer persona in plain language. "For schools who want..." or "Ideal for..."

4. **What's included** — specifics: key stages covered, duration, what the team delivers, what the school provides.

5. **CTA: enquiry (A13)** — "Enquire about [service]" → enquiry form (E1) pre-tagged with this service.

6. **Testimonial** — a pull quote relevant to this specific service. Links to `/testimonials`.

7. **Related blog posts** — posts where Service Link matches this service type.

8. **Topics overview grid** — a selection of the 22 landing pages as a browsable visual grid. Shows the breadth of what Tailor covers. Not mapped to this specific service — same grid across all service pages. Links to `/topics/{slug}`.

9. **CTA: enquiry repeated (A13)** — same CTA as section 5, repeated at the bottom of the page for readers who've scrolled through everything.

---

## D — Interactive elements

### D1 — Age flag interstitial

**Appears:** On question pages where Age Tier = "Age-flagged Year 9+". Positioned between the post-it image and the answer.

**Contains:**
1. Message: "This answer talks about [topic] in detail. It's written for young people in Year 9 and above."
2. Link to foundational content: "If you'd like to start with the basics →" (links to a related foundational question or glossary entry)
3. Action: "Continue to answer" (reveals the answer below)

**Behaviour:** Not a hard gate. The answer is always accessible. This is an honest signpost, not a block.

---

### D2 — Search bar expanded state (mobile)

**What it is:** The full-width search experience when the mobile search icon is tapped.

**Contains:**
1. Search input field (auto-focused)
2. Close/cancel button
3. Instant results dropdown (A5) appearing below as the user types

---

### D3 — Mobile navigation

**What it is:** The expanded navigation when the hamburger menu is tapped.

**Contains:** Full navigation structure from A3, plus search bar access if not handled separately.

---

### D4 — Glossary tooltip expanded state

**What it is:** The tooltip (A7) in its open/visible state.

**Desktop:** Positioned near the highlighted term. Arrow pointing to the term.
**Mobile:** Could be a bottom sheet, a popover, or an inline expansion — design decision.

---

### D5 — Simple Mode transition

**What it is:** The visual change when the reader toggles between Standard and Simple.

**Design question:** Does the content swap instantly? Fade? Slide? This is a micro-interaction — but it needs a decision because both versions of content exist in the HTML and the toggle shows/hides them.

**Requirement:** No flash of wrong content on page load. The page must check localStorage before first paint and render the correct version immediately.

---

### D6 — Enquiry form states

**States to wireframe:**
1. Empty (default — with pre-selected service if arrived from a service page)
2. Partially filled (in progress)
3. Validation errors (missing required fields, invalid email)
4. Submitting (loading state)
5. Success confirmation ("Thanks — we'll be in touch within [timeframe]")

---

### D7 — Dual-answer layout

**What it is:** For the ~10–15% of questions where the best answer genuinely differs by age/experience. Two answers on the same page.

**Contains:**
1. A clear label for each answer — something like "For younger readers" and "For older readers", or "The short answer" and "The full answer" (Gareth to decide framing)
2. Both answers visible on the page (not tabbed or hidden — the reader should see that both exist)
3. Each answer may have its own Simple version (so potentially 4 variants on one page: standard younger, standard older, simple younger, simple older)

**Design question:** Are the two answers stacked? Side by side? Tabbed? This is a layout decision, but the wireframe should show the content structure.

---

### D8 — Topics mega menu

**What it is:** A dropdown or flyout panel that expands from the "Topics" item in the main navigation (A3). Shows all 22 topic landing pages grouped by the 7 app categories.

**Contains:**
1. 7 category headings (Relationships, Sex & Sexual Health, Puberty & The Body, Identity & Diversity, Online Safety & Media, Safety & Safeguarding, Health & Wellbeing)
2. Under each heading: the landing pages in that category, as links to `/topics/{slug}`
3. Possibly a "View all topics" link at the bottom → a topics index page or just `/topics/`

**Desktop:** Multi-column layout — each category is a column or group. All 22 pages visible at once without scrolling. This is the "see everything we cover at a glance" moment.

**Mobile:** Within the mobile navigation (D3). Either an expandable accordion by category, or a scrollable sub-menu. All 22 pages must be reachable.

**Design note:** The category headings are not clickable pages — they're organisational labels. The clickable items are the 22 landing pages beneath them.

---

## E — Forms

### E1 — Service enquiry form

| Field | Type | Required | Pre-fill logic |
|-------|------|----------|---------------|
| Name | text | Yes | — |
| Email | email | Yes | — |
| School name | text | Yes | — |
| Service interested in | select | Yes | Pre-selected if arrived from a service page (delivery / training / drop-days / rse-policy-curriculum-planning). Default: blank with "Please select" prompt. Options: Direct RSE delivery, RSE training, Drop day delivery, RSE policy & curriculum planning, Other. |
| Key stage or year group | text | No | — |
| Preferred timing | text | No | — |
| Message | textarea | No | — |

**Submit action:** Sends to the team's email. Success state shows confirmation (see D6).

---

*Document version: 1.0 | Date: 1 April 2026*
