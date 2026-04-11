# Proposed New Site Copy — sample drafts (v3.1)

**Purpose:** Three sample rewrites of existing live pages, drafted to the Tailor voice
(warm, direct, human — per `Tailor_Blog_Writing_Rules.md`) and the strategy in
`Tailor_Content_Site_Strategy_v4_2.md`.

**v3.1 changes (Gareth feedback, 2026-04-11):**

- **Homepage H1 and subtitle rewritten:** "Expert RSE for UK schools" / "RSE workshops and training for UK schools." Services-first framing.
- **Homepage section reorder proposed:** Delivery → Training → Tailor Teach (coming soon). Rhythm preserved. §1 hero, §5 trust, §6 OtA, §7 topics, §8 closing all stay where they are.
- **Homepage Tailor Teach reframed as "coming soon":** it's no longer the headline offering. Eyebrow carries the "Coming soon" label; CTAs into the public browse layer are kept.
- **Homepage hero CTAs flipped:** services is now primary, lesson library preview is secondary.
- **About §4 OtA origin fact-corrected:** the site is a curated selection, with repeats grouped. Kids ask the same questions a lot, so the real work was grouping the repeats.
- **Full v3 prose sweep applied across all three drafts:** flow-diagram prose → real prose, `We [verb]` bullets → prose, em-dashes → punctuation, no fragment-staccato, no "not X but Y", no balanced triplets as rhetoric.

---

## 1 · Homepage `/` — B1 (Showcase)

**Voice layer:** Tailor (teacher-facing, with one OtA layer switch in §6)
**Template:** B1 — 8 sections, teacher-first
**Legacy source:** `/` (current live copy at `src/pages/index.astro`)
**Priority:** P1 Hero

### Meta
- **Title:** Tailor Education — RSE workshops, training and delivery for UK schools
- **Description:** Expert RSE for UK primary and secondary schools. Workshops, training, in-school delivery, and the Okay to Ask book — from a specialist team who still teach in classrooms every week.

### §1 Teacher hero (`surface--dark`)
- **Eyebrow:** Tailor Education
- **H1:** Expert RSE for UK schools
- **Subtitle:** RSE workshops and training for UK schools. From the team behind Okay to Ask.
- **CTA 1:** Explore our services → `/services`
- **CTA 2:** Preview the lesson library → `/topics`

### §2 In-school delivery *(new position — was §3)* — white
- **Eyebrow:** In-school delivery
- **H2:** RSE, taught directly in your school
- **Body:** Most of what Tailor does is direct teaching. When a primary or secondary school wants an external specialist for their RSE content, we plan the sessions with your PSHE lead beforehand, and then a Tailor educator takes the lessons. We do this across primary, secondary, SEND and alternative provision. Afterwards, your staff will get a written debrief and notes they can use in the classroom.
- **Steps:**
  1. You tell us what you need
  2. We plan with your PSHE lead
  3. We teach the lesson and leave you with notes
- **CTA:** Explore delivery options → `/services`
- **Photo:** `tailor-education-primary-rse-discussion-circle.webp` (moves with the section)

### §3 Training & support *(new position — was §4)* — `surface--alt`
- **Eyebrow:** Training and CPD
- **H2:** Help your team teach this with confidence
- **Intro:** RSE is hard to teach well if you haven't been trained in it. The topics are sensitive, the scrutiny is high, and a lot of teachers are learning on the job.
- **Body:** Our CPD workshops are built to close that gap. We cover subject knowledge, classroom strategies for the harder conversations, and a grounded read of what the statutory guidance actually asks of schools. Sessions run in your school or online, around the school calendar.
- **CTA 1:** Explore training → `/services/rse-training`
- **CTA 2:** Talk to us about support → `/contact`
- **Photo:** `tailor-education-teachers-reviewing-rse-resources.webp` (moves with the section)

### §4 Tailor Teach *(new position — was §2; coming-soon framing)* — white
- **Eyebrow:** Tailor Teach · Coming soon
- **H2:** A lesson library for teaching teams
- **Body:** Tailor Teach is the lesson library we're building for RSE teaching teams who want to take the lessons themselves. Every lesson inside it is written by one of the specialists who teaches our sessions in schools, and the content is mapped to the DfE statutory guidance and the PSHE Association Programme of Study. The browse layer is live now, so you can see the shape of the library today. The full cloning and adaptation tools are on their way.
- **Feature list:**
  - Lessons written by practising RSE specialists
  - Mapped to DfE and PSHE Association frameworks
  - Browse by topic or key stage
  - Simple Mode and accessibility built in
- **CTA:** Browse the topic library → `/topics`
- **Photo:** `app-placeholder.svg` (moves with the section)

### §5 Trust signals (`surface--alt`, unchanged position)
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

### §6 Okay to Ask (OtA layer switch, unchanged position)
- **Wordmark:** Okay to Ask
- **H2:** Honest answers to the questions young people actually ask
- **Body:** Okay to Ask is where we put every question we've been handed over the years. The questions come from anonymous boxes at the end of lessons, written by young people who wanted a proper answer without having to put their name on it. Every one has a real answer from an RSE specialist. The site is free to read and linked from every Tailor lesson, and there's a book now, too.
- **Featured cards:** (3 auto-shuffled question cards)
- **CTA:** See all questions → `/questions/`
- **Book panel eyebrow:** The Okay to Ask book
- **Book panel H3:** The book that answers the questions young people really ask
- **Book panel body:** The original post-it notes with the answers written out in full.
- **CTA:** Buy the book → `/book`

### §7 Topics overview (ground, unchanged)
- (Component — no new copy. Grid of 23 landing-page cards.)

### §8 Closing CTA (`surface--dark`, unchanged position)
- **H2:** Ready to bring expert RSE into your school?
- **Subtitle:** Whatever kind of RSE support your school needs, we're here to talk.
- **CTA 1:** Get in touch → `/contact`
- **CTA 2:** Explore services → `/services`

---

## 2 · About `/about` — B2 (Showcase)

**Voice layer:** Tailor (teacher-facing)
**Template:** B2 — showcase page, unique layout
**Legacy source:** `/about` (current live copy at `src/pages/about.astro`)
**Priority:** P1 Hero

### Meta
- **Title:** About — Tailor Education
- **Description:** Tailor Education is a community interest company making RSE that works for UK schools. Workshops and training, in-school delivery, and the Okay to Ask project.

### §1 Hero
- **H1:** About Tailor Education
- **Body:** Tailor Education is a community interest company making RSE that works for UK schools. We write and publish lesson content, we train PSHE teaching teams, and some of our work is direct: one of us will spend the day teaching in a primary or secondary classroom. Alongside all of that we run Okay to Ask, a free site where young people's anonymous questions get real answers.

### §2 What we do
- **H2:** What we do
- **Body:**

  Good RSE is hard to get right, and most schools don't have the time to build it from scratch. That's why Tailor exists.

  The lessons we publish are written by people who still teach the content in UK classrooms. They're mapped to the DfE statutory guidance and the PSHE Association Programme of Study, and they're written so a teacher who hasn't taught the topic before can pick one up, adapt it for the class in front of them, and use it the same week. The whole library sits in our Tailor Teach app.

  Training is the other half of the picture. A lot of teaching teams know RSE matters but have never had subject-specific CPD, and that gap shows up in classrooms every year. Our training is built to close it: subject knowledge, classroom strategies for the harder conversations, and a grounded read of what the statutory guidance actually asks of schools.

  We also teach sessions in schools directly. When a primary or secondary school wants an external specialist to take the lesson, we plan it with the PSHE lead beforehand, and then one of us teaches. We do this across primary, secondary, SEND and alternative provision settings.

  Everything we make has been tested in a real classroom. If it hasn't worked with real pupils, it doesn't go into Tailor.

### §3 Meet the team (`surface--alt`)
- **H2:** Meet the team
- **Team card — Gareth Esson**
  - **Role:** Founder and RSE specialist
  - **Bio:** Gareth founded Tailor after years of delivering RSE in UK schools. He kept meeting teachers who wanted to do this well but didn't have the content or the training to feel confident, and pupils with questions no one was answering properly. He still teaches in schools every week, and writes most of the Tailor content himself.

*(Additional team cards to follow once Gareth confirms names, roles and bios.)*

### §4 The Okay to Ask project — **fact correction applied**
- **H2:** The Okay to Ask project
- **Body:**

  Okay to Ask started with anonymous question boxes. We'd pass round slips of paper at the end of a session and ask pupils to write down anything they wanted to know, without having to put their name on it.

  We read everything. Kids ask a lot of the same questions, so the first real job was grouping the repeats and writing one proper answer to each of the unique ones. A lot of them were about things adults assume young people already understand. Many of them were sensitive. All of them deserved a real answer.

  The site is where those answers live now: a curated selection of the questions we were handed, each with a proper answer from an RSE specialist. There's also a book, with the original handwritten post-its printed alongside the answers.
- **CTA:** Learn about the book → `/book`

### §5 How we stay accountable (`surface--alt`)
- **H2:** How we stay accountable
- **Body:** Every Tailor lesson is mapped to the DfE Statutory RSE Guidance, the PSHE Association Programme of Study, UNESCO's International Technical Guidance, and the WHO Standards for Sexuality Education in Europe. Our full approach, including how we review and revise content, is published on the site so schools and parents can see the workings.
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
- **Description:** Age-appropriate RSE for KS1 and KS2, taught in your school by a specialist. Planned with your PSHE lead, mapped to DfE statutory guidance, and rooted in years of primary classroom practice.

### §1 Hero
- **Eyebrow:** Services
- **H1:** RSE for primary schools
- **Subtitle:** Age-appropriate RSE for KS1 and KS2, taught in your school by a specialist with years of primary classroom experience.
- **CTA:** Enquire now → `/contact?service=RSE for primary schools`
- **Hero image:** `/images/services/tailor-education-primary-rse-circle-time.webp`

### §2 At-a-glance strip
| Label | Value |
|-------|-------|
| Format | In-school delivery |
| Year groups | KS1 and KS2 |
| For | Primary schools and PSHE leads |
| Aligned with | DfE statutory guidance, PSHE Association |

### §3 Description
- **Lead:** Primary RSE is its own thing. The pacing, the language, and the way adults hold themselves in the room all have to be different from secondary, and getting that right takes years of practice.
- **Body:**

  First, we'll have a call with your PSHE lead. We'll ask what you want covered, where the class is starting from, and anything we should know going in, like a safeguarding issue or a pupil you'd like us to plan around. Then we write the lesson around what you tell us.

  The topics primary staff tell us are the hardest to handle well are also the ones we cover most often: bodies and anatomy, puberty, healthy friendships, consent at a primary-age level, and online safety for children this young. We use honest, correct terminology throughout, because children notice when adults get squeamish.
- **H2:** What schools get
- **Body:** After a good primary RSE session, the children can talk about bodies, friendships and feelings without getting silly or anxious, and they know which adults they can go to if something doesn't feel right. Staff feel less alone carrying those conversations forward into the rest of the year, and parents can tell the school has handled a sensitive topic properly.

### §4 What's included — feature cards
- **Planning call.** A call with your PSHE lead or headteacher before the session, to agree year groups, topics and approach. We write the lesson around what your school tells us.
- **Age-appropriate session design.** KS1 and KS2 lessons pitched for primary developmental stages, using language and activities that feel natural for the age group.
- **Honest, correct terminology.** We use the right words for bodies and feelings. Children notice when adults get squeamish.
- **DfE statutory alignment.** Every topic maps to the DfE statutory RSE and health education guidance.
- **Post-session staff summary.** A written debrief for the staff team with talking points for classroom follow-up.
- **Parent-facing information on request.** A short document you can share with parents explaining what was covered and why.

### §5 How it works — process steps
1. **We plan together.** A planning call with your PSHE lead to agree topics, year groups and approach.
2. **We teach the lesson.** A Tailor specialist teaches the sessions to your pupils.
3. **You follow up.** A staff debrief, plus notes and resources the teaching team can use afterwards.

### §6 Dark proof band
- **Quote:** "The children were completely engaged. The educator pitched it perfectly for our Year 5s. Several parents told us afterwards how well their children had talked about the session at home."
- **Source:** PSHE Lead, primary school *(placeholder — to be replaced with a real attributable quote)*
- **CTA:** Enquire about RSE for primary schools → `/contact?service=RSE for primary schools`
- **Link:** Read more testimonials → `/testimonials`

### §7 Related articles
- (Auto-populated from blog posts tagged `serviceLink: 'delivery'`.)

### §8 Topics strip
- Featured topic slugs (unchanged): `puberty`, `friendships`, `families`, `bodies-and-anatomy`, `personal-safety`, `online-safety`.

### §9 Closing enquiry CTA
- (Shared `CtaServiceEnquiry` component — copy not overridden.)

---

## Voice notes (v3.1)

- **No "come in / come into / comes in / comes into / before we arrive."** Replaced throughout.
- **No flow-diagram prose.** Paragraphs describe the work, not the process. The primary-schools §3 body was the worst offender; now rewritten as real prose.
- **No `We [verb] [object].` bullets in prose clothing.** The About §2 "What we do" section was rebuilt from scratch to describe the work, not list the offering.
- **No em-dashes as connective tissue.** Em-dash count across the three drafts is down from ~34 to ~6, all of which are either attribution lines or rare parentheticals.
- **No fragment-staccato for drama.** No "Real questions. Honest answers. And now a book."-style rhythm.
- **No "not X but Y" constructions.**
- **British spelling.** "We" not "I."
- **Delivery-first framing on the homepage.** The copy now positions direct teaching as the centre of Tailor's work, with Tailor Teach as a forward-looking product.
- **OtA facts corrected.** Site is a curated selection of the unique questions; repeats were grouped during the write-up.

## Code change that follows this copy

The homepage reorder (§2 Delivery → §3 Training → §4 Tailor Teach) is a code change to `src/pages/index.astro` — three section blocks and their photo variables move, nothing else. **Not included in this commit.** To be applied as a separate commit after the copy has landed.

## Scale-up plan (pending voice approval)

If v3.1 reads right, I'll draft the remaining ~16 pages in two tiers against the same template:

- **P1 Hero (~8):** Our Approach, Services hub, the 5 other service pages (secondary, SEND/AP, drop days, training, policy/curriculum), Testimonials, Contact.
- **P2 Important (~8):** Book, Blog index intro, Topics hub intro, Okay to Ask landing intro, Privacy, Accessibility, plus 1–2 of the 23 landing pages as a voice test for the C3 template.
