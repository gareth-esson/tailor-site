# B1 Homepage — Structural wireframe v2

*Teacher-first restructure. This is a working wireframe for Gareth to react to before the full layout spec is written. It captures section order, content priorities, surface rhythm, and image slots — not detailed spacing tokens or component-level CSS.*

**Date:** 2026-04-07
**Status:** Draft for review

---

## The strategic reframe

The v1 spec treated the homepage as a 50/50 showcase for Tailor and Okay to Ask, using an A-B-A-B-A layer rhythm. The problem: a headteacher lands, scrolls past one dark hero, and spends the next two sections in a warm paper world about young people's questions. The professional offering — the thing they came to evaluate — is buried below the fold.

**v2 principle:** The homepage is a Tailor Education page. It sells what Tailor does for schools. Okay to Ask appears once, further down, as proof of care and expertise — not as a co-headliner.

**The teacher's journey:** I trust these people → I see what they offer → I understand which service is right for me → they've also built something remarkable for young people → they cover everything I need to teach.

---

## Section order

```
┌──────────────────────────────────── <header> (shell, sticky)
│
├─ <main id="main">                          ← Tailor root, no .layer-ota
│
│  ┌─ §1  HERO                        [dark surface]
│  │      Headline · subline · dual CTA
│  │      Photo: editorial classroom/workshop image
│  │
│  ├─ §2  THE PLATFORM                [white surface]
│  │      Tailor Teach app · screenshot/mockup · feature bullets · CTA
│  │
│  ├─ §3  DELIVERY                    [alt surface or tinted]
│  │      "We come to your school" · how it works · photo · enquiry CTA
│  │
│  ├─ §4  TRAINING & SUPPORT          [white surface]
│  │      CPD · policy · curriculum planning · formats · CTA
│  │
│  ├─ §5  TRUST SIGNALS               [alt surface]
│  │      Framework badges · testimonial with headshot
│  │
│  ├─ .layer-ota wrapper
│  │  ├─ §6  OKAY TO ASK              [OtA warm surface]
│  │  │      OtA intro · book promotion · 3 featured question cards
│  │  │
│  ├─ §7  TOPICS BREADTH              [page ground]
│  │      TopicsOverviewGrid · 7 categories · 23 landing pages
│  │
│  └─ §8  CLOSING CTA                 [dark surface or brand]
│         "Ready to bring RSE to your school?" · enquiry/contact CTA
│
└──────────────────────────────────── <footer> (shell)
```

---

## Surface rhythm

| § | Surface | Emotional beat | Layer |
|---|---------|---------------|-------|
| 1 | `--hero-tailor-bg` (dark, #1E2A3A) | Authority. Confidence. "You're in the right place." | Tailor |
| 2 | `--bg-surface` (white) | Clean, digital, product-focused. "Here's the tool." | Tailor |
| 3 | `--bg-surface-alt` or `--bg-tinted` | Slightly warmer/distinct. "This is the premium offering." | Tailor |
| 4 | `--bg-surface` (white) | Professional, structured. "We support your team." | Tailor |
| 5 | `--bg-surface-alt` (#f0efeb) | Calm credibility. "Others trust us." | Tailor |
| 6 | `--bg-ota-surface` (warm paper) | The one warm moment. "We built something for young people too." | OtA |
| 7 | `--bg-page` (page ground) | Breadth. "We cover everything." | Tailor |
| 8 | `--bg-emphasis` or `--hero-tailor-bg` | Bookend. Dark-to-dark framing. "Let's talk." | Tailor |

The sequence: **dark → white → alt → white → alt → warm → ground → dark**. No two adjacent sections share a surface. OtA appears once at position 6 — late enough that the professional case is already made, early enough that it's not an afterthought.

---

## §1 — Hero

**Job:** Immediate authority. "Expert RSE for schools." The headteacher decides in 3 seconds whether this is a credible provider.

**Layout:** Two-column on desktop. Text left (headline, subline, dual CTA), editorial photograph right.

**Content:**
- Eyebrow: positioning line (e.g. "Tailor Education" or similar)
- `<h1>`: `[COPY TBD]` — something conveying "Expert RSE lessons and training for schools"
- Subline: one sentence value prop
- Primary CTA → platform/lessons ("Explore RSE lessons" or similar)
- Secondary CTA → services/delivery ("Bring Tailor to your school" or similar)

**Image:** Editorial classroom/workshop photograph. Real, not stock. The image requirements doc calls for "training room, workshop, classroom facilitation." Rounded corners, shadow, 8% brand overlay to tie it to the dark surface.

**Fallback:** Text-only, left-aligned, max-width capped.

**Typography:** Lexend throughout. Display h1 size. White on dark.

---

## §2 — The platform / Tailor Teach

**Job:** Show the product. A school evaluating RSE providers wants to know what they're actually getting. The Tailor Teach app is in development — this section signals it's coming and positions it as a differentiator.

**Layout:** Two-column on desktop. Text on one side, product visual on the other. The visual side is the star — a screenshot, mockup, or stylised product illustration of the app interface.

**Content:**
- `<h2>`: `[COPY TBD]` (e.g. "Expert-authored RSE lessons, ready to teach" or "Tailor Teach")
- 2–3 short paragraphs or a tight feature list (not a long grid of cards — this is a single product, not a catalogue)
  - Expert-authored, curriculum-aligned content
  - Structured by topic and key stage
  - Built for teacher confidence (not just student resources)
  - Simple Mode / accessibility built in
- CTA: "See the lesson library" or "Get early access" (depending on app status)
- If the app is pre-launch, frame as "coming soon" with an email signup or waitlist CTA alongside the main CTA

**Image:** Product screenshot or mockup of the Tailor Teach interface. If not available yet, a stylised illustration of lesson content (see image requirements: "A stylised open laptop or tablet showing a lesson layout"). This is NOT a spot icon — it's a substantial visual, roughly equal in weight to the text column.

**Why this section exists separately from §3/§4:** The platform is the product. Delivery and training are services. A PSHE lead browsing for lesson resources needs to see the product immediately. A headteacher looking for someone to come in and deliver RSE needs to see delivery. They're different people with different needs — separate sections let each find their answer fast.

---

## §3 — Delivery

**Job:** The premium offering. "We come to your school and deliver RSE directly." This is the high-value conversion — the school that says "do it for us." It needs more room than a card to explain what it actually involves and to reassure.

**Layout:** Two-column on desktop. Text on one side, image on the other. Consider reversing the text/image orientation from §2 to create visual rhythm (if §2 is text-left/image-right, §3 is image-left/text-right).

**Content:**
- `<h2>`: `[COPY TBD]` (e.g. "We deliver RSE in your school")
- What delivery includes: a short, direct description. Not a features grid — a confident paragraph or two explaining what actually happens when Tailor comes to a school.
  - Who delivers (qualified facilitators, not random supply teachers)
  - What it covers (curriculum-aligned, age-appropriate, sensitive)
  - What the school gets (lesson delivery + teacher guidance + parent communication + follow-up)
- "How it works" beat: could be 3 simple steps (enquire → we plan together → we deliver), or a short process description. Keep it grounded, not salesy.
- CTA: "Enquire about delivery" or "Book a conversation" → contact/enquiry

**Image:** Editorial photograph of Tailor delivering in a school. The image requirements doc lists "Delivery service hero: Team member working with students in school." If no delivery-specific photo exists yet, use the general classroom/workshop photo. This photo does real work — it shows a teacher or facilitator in a room with young people, and that's the proof that this is a real service, not a brochure.

**Surface consideration:** This section needs to feel distinct from §2 (white) and §4 (white). Using `--bg-surface-alt` or a subtle brand tint gives delivery its own visual weight. Alternatively, a full-bleed background image with a text overlay panel could work for a more immersive treatment — but that might be too heavy for v1. The safer option is a tinted surface with a contained photo.

---

## §4 — Training & support

**Job:** "We upskill your team." CPD, confidence-building, policy guidance, curriculum planning support. This speaks to the PSHE coordinator who wants help getting better at delivering RSE themselves, and to the deputy head responsible for RSE policy compliance.

**Layout:** Could mirror §3's layout (two-column with image), or shift to a different pattern to avoid three consecutive two-column sections. Options:
- **Option A:** Two-column (text + image), same pattern as §3 but reversed. Consistent but potentially repetitive.
- **Option B:** Centred heading + a 2–3 card sub-grid below, each card covering a different aspect of support (CPD workshops, policy review, curriculum planning). More structured, breaks the rhythm.
- **Option C:** Full-width text section with an inset panel or callout for "What training covers." No image — the section differentiates itself by being more text-forward and information-dense.

Gareth to decide. My instinct: **Option B** gives this section its own visual identity and lets you break out the different support strands clearly. The cards aren't the same as v1's three-up value props because each card is a support type within one service area, not three separate products.

**Content:**
- `<h2>`: `[COPY TBD]` (e.g. "Training and support for your RSE team")
- Intro paragraph: brief framing of what "support" means — not just a one-off workshop
- Support strands (however laid out):
  - **CPD & teacher training:** Workshops, twilight sessions, in-school or online. Building teacher confidence in delivering RSE.
  - **Policy guidance:** Help developing or reviewing your school's RSE policy. Statutory compliance, stakeholder consultation, documentation.
  - **Curriculum planning:** Mapping RSE across key stages. Aligning with DfE statutory guidance, PSHE Association frameworks, and your school's context.
- CTA: "Explore training options" or "Talk to us about support" → training page or contact

**Image:** If two-column layout: editorial photograph of a CPD workshop ("Training page hero: CPD workshop in progress. Teachers engaging." from image requirements). If card layout: spot illustrations for each strand (optional — the cards can work text-only with a coloured top border or icon).

---

## §5 — Trust signals

**Job:** Validate everything above. "These people are framework-aligned, endorsed, and recommended." This section is the credibility layer that supports the conversion §2–§4 are building toward.

**Layout:** Same as v1 — framework badges in a horizontal row, testimonial pull quote below with headshot.

**Content:**
- `<h2>`: `[COPY TBD]` (e.g. "Aligned with national and international frameworks")
- Badge row: DfE, PSHE Association, UNESCO, WHO marks
- Testimonial `<blockquote>`: `[COPY TBD]` — ideally from a headteacher or PSHE lead who used delivery or training (this reinforces §3/§4)
- Attribution with circular headshot
- Optional link: "See our approach →"

**No structural changes from v1.** This section was already well-designed. It just needed to be in the right position — after the professional case, before the OtA warmth.

---

## §6 — Okay to Ask

**Job:** The one warm moment. "We also built a free resource where young people get honest answers to real questions — and published a book." This is proof of care, depth, and expertise. It shows the school that Tailor understands the end user (young people), not just the institutional buyer.

**Layout:** This is the only `.layer-ota` section on the page. It consolidates what was previously §2 (OtA hero), §3 (book promotion), and §5 (featured questions) into one cohesive section. The warm paper surface appears once and does all three jobs.

**Structure within the section:**

1. **OtA introduction** (top of section)
   - OtA wordmark (centred, small)
   - `<h2>`: `[COPY TBD]` (e.g. "Okay to Ask — honest answers for young people")
   - Subline: 1–2 sentences explaining what OtA is
   - Typography: Fraunces heading, Atkinson body (inherited from `.layer-ota`)

2. **Book promotion** (mid-section, contained panel)
   - Same panel treatment as v1 §3: book cover image + pitch text + "Buy the book" link
   - Panel on `--bg-ota-book-panel`
   - This sits inside the warm section rather than being its own separate section

3. **Featured question cards** (bottom of section)
   - 3 QuestionCard instances in a row
   - "See all questions →" link below
   - These demonstrate the quality of the content to teachers and invite young people deeper

**Post-it scatter:** Optional — 2–3 post-it thumbnails as faint decorative texture (15% opacity, multiply, absolute positioned). Adds warmth without clutter. Desktop only.

**Surface:** `--bg-ota-surface` (warm paper, #F7F5F0). One unbroken warm band. The transition in from §5's alt surface is gentle; the transition out to §7's page ground is similarly soft.

**Design note:** This section is doing triple duty (intro + book + cards) so it will be the longest section on the page. That's fine — it's a self-contained world. The internal spacing should create clear sub-sections without needing hard dividers. Generous vertical padding between the three beats.

---

## §7 — Topics breadth

**Job:** "We cover everything you need to teach." The 23 landing pages grouped by 7 app categories. Teacher-facing, professional, Lexend.

**Layout:** Reuses `TopicsOverviewGrid.astro`. No changes from v1.

**Surface:** `--bg-page` (page ground). The neutral canvas lets the category-coloured cards provide the visual interest.

---

## §8 — Closing CTA (NEW)

**Job:** A clear final call to action. The teacher has scrolled the whole page — they've seen the product, the services, the credentials, the OtA story, the topic breadth. Now: "What's your next step?"

**Layout:** Full-bleed dark band (bookending with §1's dark hero). Centred text, single or dual CTA.

**Content:**
- `<h2>`: `[COPY TBD]` (e.g. "Ready to bring expert RSE to your school?")
- Optional subline: one sentence
- Primary CTA: "Get in touch" or "Book a conversation" → contact/enquiry
- Optional secondary CTA: "Explore lessons" → platform (for the person who wants to browse before committing)

**Surface:** `--hero-tailor-bg` or `--bg-emphasis` (dark, #1E2A3A). White text. The dark bookend creates a visual frame — the page opened dark and closes dark, with warmth and light in between.

**Typography:** Lexend. Display h2 or h3 size. Centred.

**Why this exists:** The v1 spec ended with the topics grid, which is informational, not action-oriented. A teacher who's been convinced by §2–§5 has no obvious "what now?" at the bottom of the page. The closing CTA catches them. It's a common pattern on service sites, but it earns its place here because the homepage is long and the conversion paths (delivery enquiry, training enquiry, platform signup) are spread across multiple sections. The closing CTA gathers them.

---

## What changed from v1

| v1 | v2 | Why |
|----|-----|-----|
| §2 was OtA hero (position 2) | OtA is §6 (position 6) | Teacher-first. The professional case comes before the emotional proof. |
| §3 was book promotion (position 3) | Book is inside §6 as a sub-section | Consolidates all OtA content into one warm moment. |
| §4 was "What Tailor does" as 3 equal cards | §2 (platform), §3 (delivery), §4 (training) are each their own section | Each service line gets room to make its case. Different buyers, different needs. |
| §5 was featured questions (OtA, position 5) | Featured questions are inside §6 | One OtA section, not two. |
| No closing CTA | §8 closing CTA | Catches the convinced teacher at the bottom. |
| A-B-A-B-A layer rhythm (5 switches) | A-A-A-A-A-B-A-A (1 switch) | OtA is a moment, not a theme. |
| 7 sections | 8 sections | But 6 of 8 are Tailor-layer, making the page feel decisively professional. |

---

## Layer scoping (revised)

```html
<main id="main">                              ← Tailor root
  <section> §1 hero </section>
  <section> §2 platform </section>
  <section> §3 delivery </section>
  <section> §4 training & support </section>
  <section> §5 trust signals </section>
  <div class="layer-ota">                     ← single OtA scope
    <section> §6 okay to ask </section>
  </div>
  <section> §7 topics overview </section>
  <section> §8 closing CTA </section>
</main>
```

One `.layer-ota` wrapper. One typographic switch. One warm surface. Everything else is Tailor.

---

## Image slots summary

| § | Image type | Source | Status |
|---|-----------|--------|--------|
| 1 | Editorial photograph (classroom/workshop) | `/images/homepage/hero.jpg` | To source |
| 2 | Product screenshot/mockup (Tailor Teach) | TBD | To create |
| 3 | Editorial photograph (delivery in school) | `/images/services/delivery-hero.jpg` | To source |
| 4 | Optional: CPD workshop photo or spot illustrations | `/images/training/` or `/images/spots/homepage/` | To source/create |
| 5 | Framework badge logos + testimonial headshot | `/images/trust/` + `/images/testimonials/` | To source |
| 6 | OtA wordmark + book cover + post-it scans (cards) + optional post-it scatter | Existing assets | Exist |
| 7 | Topic illustrations (in TopicsOverviewGrid) | Existing 22 illustrations | Exist |
| 8 | None (text + CTA only) | — | — |

---

## Open questions for Gareth

1. **Tailor Teach status:** Is the app far enough along for a screenshot/mockup in §2, or should this be framed as "coming soon" with an illustration placeholder?

2. **§3 delivery surface:** Tinted surface with a contained photo, or something more immersive (background image with text panel)? Tinted is safer for v1.

3. **§4 layout:** Two-column with photo (Option A), card sub-grid (Option B), or text-forward with inset panel (Option C)?

4. **§8 closing CTA:** Want this, or does the footer already serve as the final catch? (I'd argue the footer is navigation, not persuasion — they do different jobs.)

5. **Section count:** 8 sections is more than v1's 7, but the page should actually feel *shorter* to a teacher because they hit relevant content faster. Does the count feel right, or should any sections merge?
