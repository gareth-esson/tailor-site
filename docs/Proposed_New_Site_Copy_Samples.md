# Proposed New Site Copy — sample drafts

**Purpose:** Three sample rewrites of existing live pages, drafted to the Tailor voice
(warm, direct, human — per `Tailor_Blog_Writing_Rules.md`) and the strategy in
`Tailor_Content_Site_Strategy_v4_2.md`. The section architecture of each page is
preserved — this is a voice/copy pass, not a layout change.

Each draft below is also pushed to the Notion DB
**Proposed New Site Copy — tailoreducation.org.uk**
(data source `fa01b7c7-0bac-4efe-bbbe-29aaff8198c9`).

Review process:
1. Read these three samples as a voice test.
2. If the voice is right, Claude drafts the remaining ~16 showcase/service pages
   against the same template.
3. If the voice needs adjustment, Gareth marks up one sample, Claude recalibrates,
   re-drafts these three, and we try again before scaling.

---

## 1 · Homepage `/` — B1 (Showcase)

**Voice layer:** Tailor (teacher-facing, with one OtA layer switch in §6)
**Template:** B1 — 8 sections, teacher-first
**Legacy source:** `/` (current live copy at `src/pages/index.astro`)
**Priority:** P1 Hero

### Meta
- **Title:** Tailor Education — RSE lessons, training and delivery for UK schools
- **Description:** Expert relationships and sex education for UK schools. Ready-to-teach lessons, CPD and training, and qualified specialists who come into your school. From the team behind Okay to Ask.

### §1 Teacher hero (dark)
- **Eyebrow:** Tailor Education
- **H1:** RSE that's ready when you are
- **Subtitle:** Lessons, training and in-school delivery for UK primary and secondary schools — from the team behind Okay to Ask.
- **CTA 1:** Explore our lessons → `/topics`
- **CTA 2:** Bring Tailor to your school → `/services`

### §2 Tailor Teach (white)
- **Eyebrow:** Tailor Teach
- **H2:** A lesson library your RSE team will actually use
- **Body:** Tailor Teach is our lesson platform. Every lesson is written by an RSE specialist, mapped to the DfE statutory guidance and the PSHE Association Programme of Study, and structured so a teacher who hasn't taught the topic before can pick it up and deliver it with confidence. Browse by topic or key stage. Clone a lesson, adapt it to your class, take it into the room on Monday.
- **Feature list:**
  - Written by practising RSE specialists
  - Mapped to DfE and PSHE Association frameworks
  - Structured for teacher confidence, not just compliance
  - Simple Mode and accessibility built in from the start
- **CTA:** Explore the lesson library → `/topics`

### §3 Delivery (alt)
- **Eyebrow:** In-school delivery
- **H2:** Or we can come and teach it ourselves
- **Body:** When the lesson needs to happen and the capacity isn't there, we come into your school and deliver it. A specialist plans the sessions with your PSHE lead, delivers them to the class, and leaves your team with a debrief and follow-up notes. Primary or secondary, single sessions or a full scheme — we plan around the school, not the other way round.
- **Steps:**
  1. Tell us what you need
  2. We plan it together
  3. We deliver — and leave you with notes
- **CTA:** Explore delivery options → `/services`

### §4 Training & support (white)
- **Eyebrow:** Training and CPD
- **H2:** Help your team teach this with confidence
- **Intro:** RSE is one of the hardest things schools are asked to teach. High stakes, high scrutiny, and most teachers haven't been trained in it.
- **Body:** Our CPD workshops give your team the subject knowledge, the classroom strategies, and the framework awareness to handle the conversations — including the ones they don't see coming. Delivered in your school or online, booked around the school calendar.
- **CTA 1:** Explore training → `/services/rse-training`
- **CTA 2:** Talk to us about support → `/contact`

### §5 Trust signals (alt)
- **Eyebrow:** Frameworks and standards
- **H2:** Aligned with the guidance schools are held to
- **Badges:**
  - DfE Statutory RSE Guidance
  - PSHE Association Programme of Study
  - UNESCO International Technical Guidance
  - WHO Standards for Sexuality Education
- **Pullquote:** "Tailor Education's content is some of the best RSE material I've seen. Thoughtful, inclusive, and genuinely useful."
- **Attribution:** PSHE Coordinator
- **Link:** See our approach → `/our-approach`

### §6 Okay to Ask — layer switch (warm)
- **Wordmark:** Okay to Ask
- **H2:** Honest answers to the questions young people actually ask
- **Body:** Okay to Ask is our answer to every anonymous question box that turned up at the end of a lesson. Real questions from real young people, answered honestly — no judgement, no awkwardness, no silly questions. Free to read. Linked from every Tailor lesson. And now a book.
- **Featured cards:** (3 auto-shuffled question cards)
- **CTA:** See all questions → `/questions/`
- **Book panel eyebrow:** The Okay to Ask book
- **Book panel H3:** The book that answers the questions young people really ask
- **Book panel body:** Real questions, honest answers, post-it notes and all.
- **CTA:** Buy the book → `/book`

### §7 Topics overview (ground)
- (Component — no new copy. Grid of 23 landing-page cards.)

### §8 Closing CTA (dark)
- **H2:** Ready to bring expert RSE into your school?
- **Subtitle:** Whether you need lessons, training, delivery, or just a conversation about your RSE provision — we're here.
- **CTA 1:** Get in touch → `/contact`
- **CTA 2:** Explore lessons → `/topics`

---

## 2 · About `/about` — B2 (Showcase)

**Voice layer:** Tailor (teacher-facing)
**Template:** B2 — showcase page, unique layout
**Legacy source:** `/about` (current live copy at `src/pages/about.astro`)
**Priority:** P1 Hero

### Meta
- **Title:** About — Tailor Education
- **Description:** Tailor Education is a community interest company providing expert RSE to UK schools. Ready-to-teach lessons, training, in-school delivery — and the Okay to Ask project.

### §1 Hero
- **H1:** About Tailor Education
- **Body:** We're Tailor Education — a community interest company building RSE that schools can actually use. We write lessons, train teachers, come into schools to deliver sessions ourselves, and publish Okay to Ask: free, honest answers to the questions young people really ask.

### §2 What we do
- **H2:** What we do
- **Body:**
  Tailor exists because good RSE is hard to get right, and because the schools we work with shouldn't have to build it from scratch.

  We write lessons — mapped to the DfE statutory guidance and the PSHE Association Programme of Study, written by people who still teach the content in schools. They live in the Tailor Teach app. Your team can browse, clone and adapt them.

  We train teachers — CPD for teaching teams who know RSE matters but haven't had the subject-specific training to feel confident in the room.

  We deliver RSE in schools — when you need someone to come in and teach it directly, we come in and teach it directly. Primary, secondary, SEND and alternative provision.

  Everything we make is rooted in practice. If it hasn't worked in a real classroom, it doesn't go into Tailor.

### §3 Meet the team (alt)
- **H2:** Meet the team
- **Team card — Gareth Esson**
  - **Role:** Founder and RSE specialist
  - **Bio:** Gareth founded Tailor after years of delivering RSE in UK schools and noticing the same patterns come up every time: teachers who wanted to do this well, pupils who had questions they couldn't ask anywhere else, and curricula that hadn't caught up with what young people were actually asking about. He writes most of the Tailor content and still delivers sessions in schools every week.
- **Team card — [TBC]**
  - **Role:** Role TBC
  - **Bio:** Bio coming soon.

### §4 The Okay to Ask project
- **H2:** The Okay to Ask project
- **Body:**
  Okay to Ask started with a shoebox. At the end of our sessions, we'd pass round slips of paper and ask pupils to write down anything they wanted to know — no names, no judgement, nothing silly. We kept the boxes. We read everything. And we answered every single question honestly.

  The questions kept coming. Some of them broke our hearts. Most of them were things adults assume young people already know — and they don't. A few were funny. All of them deserved a proper answer.

  Okay to Ask is where those answers live now: a growing library of real questions from real young people, written for the readers they came from. There's also a book — the original handwritten post-it notes, alongside the answers.
- **CTA:** Learn about the book → `/book`

### §5 How we stay accountable (alt)
- **H2:** How we stay accountable
- **Body:** Everything we write is mapped to the DfE Statutory RSE Guidance, the PSHE Association Programme of Study, UNESCO's International Technical Guidance, and the WHO Standards for Sexuality Education in Europe. We publish our approach in full, because schools and parents should be able to see the workings.
- **CTA:** Read our approach → `/our-approach`

### §6 CTA band
- **CTA 1:** See our approach → `/our-approach`
- **CTA 2:** Get in touch → `/contact`

---

## 3 · RSE for primary schools `/services/rse-for-primary-schools` — C5 (Service page)

**Voice layer:** Tailor (teacher-facing)
**Template:** C5 v3 — service page
**Legacy source:** `/services/rse-for-primary-schools` (current live copy)
**Priority:** P1 Hero

### Meta
- **Title:** RSE for primary schools — Tailor Education
- **Description:** In-school RSE delivery for KS1 and KS2. A specialist plans the sessions with your PSHE lead, delivers them to your pupils, and leaves your team with a debrief. Age-appropriate, honest, mapped to DfE statutory guidance.

### §1 Hero
- **Eyebrow:** Services
- **H1:** RSE for primary schools
- **Subtitle:** We come into primary schools and deliver age-appropriate RSE for KS1 and KS2 — planned with your PSHE lead, pitched for the age group, and rooted in years of real classroom practice.
- **CTA:** Enquire now → `/contact?service=RSE for primary schools`
- **Hero image:** `/images/services/tailor-education-primary-rse-circle-time.webp`

### §2 At-a-glance strip
| Label | Value |
|-------|-------|
| Format | In-school delivery |
| Year groups | KS1 and KS2 |
| Session length | 45–60 minutes |
| For | Primary schools and PSHE leads |
| Aligned with | DfE statutory guidance, PSHE Association |

### §3 Description
- **Lead:** Primary RSE is its own craft. The pacing is different, the language is different, and the adults in the room need to feel as comfortable as the children do. Our primary service is built around that.
- **Body:**
  A specialist RSE educator comes into your school and delivers sessions directly to your pupils. Before we arrive, we plan the sessions with your PSHE lead — which year groups, which topics, which starting points, what the school is ready to say and what it's still working out. The session is shaped around the class you've actually got.

  We cover the topics primary staff tell us are the hardest to get right: bodies and anatomy, puberty, healthy friendships, boundaries and consent in age-appropriate language, and online safety for younger children. We use honest, correct terminology. Nothing euphemistic, nothing overblown. Children pick up on both.
- **H2:** What schools get
- **Body:** Pupils who can name their body parts correctly, know what a healthy friendship looks like, understand the difference between safe and unsafe touch, and know who they can go to for help. Staff who feel more confident continuing the conversations after we've left. And parents who can see the school has taken this seriously and handled it well.

### §4 What's included — feature cards
- **Pre-visit planning call:** A meeting with your PSHE lead or headteacher to agree year groups, topics and approach before we arrive. The session is shaped by your school, not imported into it.
- **Age-appropriate session design:** KS1 and KS2 lessons pitched for primary developmental stages, using language and activities that feel natural for the age group.
- **Honest, correct terminology:** We use the right words for bodies and feelings. Children notice when adults get squeamish.
- **DfE statutory alignment:** Every topic maps to the DfE statutory RSE and health education guidance.
- **Post-session staff summary:** A written debrief for the staff team with talking points for classroom follow-up.
- **Parent-facing information on request:** A short document you can share with parents explaining what was covered and why.

### §5 How it works — process steps
1. **We plan together** — A planning call with your PSHE lead to agree topics, year groups, and the approach that fits your school.
2. **We deliver** — A specialist educator comes in and delivers the sessions to your pupils.
3. **You follow up** — A staff debrief, follow-up resources, and pupils who can have the conversations that matter.

### §6 Dark proof band
- **Quote:** "The children were completely engaged. The educator pitched it perfectly for our Year 5s — honest, clear, and never overwhelming. Several parents told us afterwards how well their children had talked about the session at home."
- **Source:** PSHE Lead, primary school
- **CTA:** Enquire about RSE for primary schools → `/contact?service=RSE for primary schools`
- **Link:** Read more testimonials → `/testimonials`

### §7 Related articles
- (Auto-populated from blog posts tagged `serviceLink: 'delivery'`.)

### §8 Topics strip
- Featured topic slugs (unchanged): `puberty`, `friendships`, `families`, `bodies-and-anatomy`, `personal-safety`, `online-safety`.

### §9 Closing enquiry CTA
- (Shared `CtaServiceEnquiry` component — copy not overridden.)

---

## Voice notes for the rewrite pass (all three pages)

Applied throughout these drafts:

- **"We," not "I"** — the organisation is the brand. Gareth's "I" voice is reserved for blog posts.
- **Warm, direct, human** — the colleague-at-a-conference test.
- **No throat-clearing.** No "here's what we do," "let's explore," "in this section we'll cover."
- **No balanced triplets as rhetorical flourish.** The current copy has a few ("expert-authored, curriculum-aligned, built for teachers") — rewritten as plain sentences.
- **No bold inline labels** inside paragraphs. Information is folded into sentences.
- **No "it's not X, it's Y."**
- **No filler intensifiers** (dramatically, significantly, crucially).
- **British spelling.**
- **Honest about the job RSE is.** Primary RSE copy now opens by naming the difficulty of the work, not by claiming mastery of it.
- **One strong voice per page.** Homepage has one deliberate layer switch in §6 (OtA); everything else is Tailor.

## Open questions for Gareth

1. **Is the homepage H1 "RSE that's ready when you are" the right note?** Alternatives I considered: "Expert RSE, ready to teach" (tighter, less dual-mode). "Good RSE, ready for Monday morning" (warmer but arguably flippant).
2. **"A lesson library your RSE team will actually use"** in §2 — this carries an implicit criticism of other libraries. Within the blog voice rules it reads as "direct without being blunt," but it is sharper than the current copy. Keep or soften?
3. **The Okay to Ask origin story on the About page** ("started with a shoebox… some of them broke our hearts") — is that the truth? I wrote it as the most plausible version of the story from the strategy doc, but it needs Gareth's facts before it ships.
4. **"We come in and teach it directly"** — is that always true for SEND/AP via Circuits? I kept it on the About page but may need to qualify if Circuits is workbook-led rather than facilitator-led.
5. **Team bios** — who else is on the team, and what are the real roles and names? Currently a single Gareth bio plus a "TBC" placeholder.
6. **Scale-up decision:** If this voice is right, I'll draft the remaining ~16 pages in two priority tiers:
   - **P1 Hero (8 pages):** Homepage, About, Our Approach, Services hub, the 5 other service pages, Testimonials, Contact.
   - **P2 Important (~8 pages):** RSE Training, Book, Blog index, Okay to Ask landing intro, Topics hub intro, Privacy, Accessibility, plus one or two 23 landing-page samples as a voice test.
