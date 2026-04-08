# Tailor Layout Spec — B1 Homepage

*Layout specification for the homepage at `/`. This is a Tailor Education page. Its primary audience is teachers, PSHE leads, and school leaders evaluating RSE provision. The homepage sells what Tailor does for schools. Okay to Ask appears once, further down the page, as proof of care and expertise — not as a co-headliner.*

*Mood: one credible organisation with two clearly signposted emotional doorways. Tailor leads with authority and holds it. The teacher's journey through the page is: I trust these people → I see what they offer → I understand which service is right for me → they've also built something remarkable for young people → they cover everything I need to teach.*

*The art direction brief says the homepage sequence is: immediate authority → visible breadth → visible proof of credibility → clear fork. v2 adjusts this: immediate authority → product → services → credibility → the fork (OtA) → breadth → action.*

**Version:** 2.0
**Date:** 2026-04-07

---

## Reference documents

- `Tailor_Page_Content_Spec_v1.md` — B1 section (content structure)
- `Tailor_Art_Direction_Brief_v1 (1).md` — Homepage art direction, two-layer system, surface language
- `Tailor_Layout_Spec_Shell.md` — header, footer, nav, container tokens
- `Tailor_Layout_Spec_C1.md` — C1 question page (OtA patterns, QuestionCard, SignpostingBlock)
- `Tailor_Layout_Spec_B8.md` — B8 /questions/ landing (OtA hero, book panel, QuestionCard grid)
- `Tailor_Layout_Spec_C2.md` — C2 glossary page (glossary term card, definition block)
- `Tailor_Wireframe_B1_v2.md` — Structural wireframe this spec implements
- `Tailor_Image_Requirements.md` — Photography and illustration requirements

---

## What changed from v1

The v1 spec treated the homepage as a 50/50 showcase for Tailor and OtA, with an A-B-A-B-A layer rhythm (5 switches). A headteacher landed, scrolled past one section, and immediately entered a warm paper world about young people's questions. The professional offering was buried below the fold.

v2 is teacher-first. The three service lines (platform, delivery, training) each get their own section instead of sharing a three-card grid. OtA consolidates into one section at position 6. The layer rhythm becomes T-T-T-T-T-OtA-T-T (1 switch). A closing CTA bookends the dark hero.

---

## The layer-transition approach

`<main>` does NOT carry `.layer-ota`. The homepage is a Tailor page at its root. One section (§6) wraps its content in a `<div class="layer-ota">` scope. This is the only typographic switch on the page.

```html
<body>
  <header>…shell…</header>

  <main id="main">                              ← Tailor root, no .layer-ota
    <section> §1 hero </section>                ← Tailor (Lexend)
    <section> §2 platform </section>            ← Tailor (Lexend)
    <section> §3 delivery </section>            ← Tailor (Lexend)
    <section> §4 training & support </section>  ← Tailor (Lexend)
    <section> §5 trust signals </section>       ← Tailor (Lexend)
    <div class="layer-ota">                     ← OtA scope opens
      <section> §6 okay to ask </section>       ← Fraunces + Atkinson
    </div>                                      ← OtA scope closes
    <section> §7 topics overview </section>     ← Tailor (Lexend)
    <section> §8 closing CTA </section>         ← Tailor (Lexend)
  </main>

  <footer>…shell…</footer>
</body>
```

One `.layer-ota` wrapper. One typographic switch. One warm surface. Everything else is Tailor.

---

## Tokens and conventions this spec depends on

### Tokens referenced on this page (all existing)

| Purpose | Token | Current value |
|---|---|---|
| Tailor heading font | `--font-tailor-heading-stack` | Lexend |
| Tailor body font | `--font-tailor-body-stack` | Lexend |
| OtA heading font | `--font-ota-heading-stack` | Fraunces |
| OtA body font | `--font-ota-body-stack` | Atkinson Hyperlegible |
| Text body | `--text-body` | #1E2A3A |
| Text heading | `--text-heading` | #1E2A3A |
| Text muted | `--text-body-muted` | hsl(213, 10%, 43%) |
| Text on dark | `--text-on-dark` | #f4f3ef |
| Text heading on dark | `--text-heading-on-dark` | #ffffff |
| Text muted on dark | `--text-muted-on-dark` | rgba(255,255,255,0.6) |
| On-dark strapline | `--text-on-dark-strapline` | rgba(255,255,255,0.9) |
| OtA text body | `--text-ota-body` | `--text-body` |
| OtA text heading | `--text-ota-heading` | `--text-heading` |
| OtA text muted | `--text-ota-muted` | #5B6675 |
| Page ground | `--bg-page` | #FAFAF7 |
| White surface | `--bg-surface` | #FFFFFF |
| Alt surface | `--bg-surface-alt` | #f0efeb |
| Tinted bg | `--bg-tinted` | brand-accent at 4% |
| Emphasis bg | `--bg-emphasis` | #1E2A3A |
| OtA surface | `--bg-ota-surface` | #F7F5F0 |
| OtA book panel bg | `--bg-ota-book-panel` | #eae6e1 |
| Brand primary | `--brand-primary` | #1A9E8A |
| Brand accent text | `--brand-accent-text` | teal L≤29% |
| Brand secondary | `--brand-secondary` | #1E2A3A |
| Display ramp | `--text-display-size-h1` … `--text-display-size-body` | existing |
| Prose ramp | `--text-prose-size-*` | existing |
| Card ramp | `--text-card-size-*` | existing |
| Utility text | `--text-util-preheader-*`, `--text-util-hero-subhead-*`, `--text-util-lede-*` | existing |
| Heading weights (Tailor) | `--heading-weight-h1` … `--heading-weight-h6` | 700/700/600/600/600/600 |
| Heading weights (OtA) | `--heading-ota-weight-*` | same |
| Font weights | `--font-weight-regular` (400), `-medium` (500), `-semibold` (600), `-bold` (700) | existing |
| Line heights | `--lh-display` (1.15), `--lh-heading` (1.2), `--lh-heading-sub` (1.3), `--lh-card` (1.4), `--lh-body` (1.6), `--lh-prose` (1.7) | existing |
| Letter-spacing | `--text-eyebrow-ls` (0.05em), `--card-eyebrow-ls` (0.1em), `--text-util-preheader-ls` (0.15em) | existing |
| Spacing | `--space-global-xs` … `--space-global-2xl`, `--space-global-gutter` | existing |
| Structural spacing | `--space-struct-y-hero`, `--space-struct-y-base`, `--space-struct-x` | existing |
| Container widths | `--container-max-shell` (72rem), `--container-max-reading-wide` (56rem), `--container-max-prose` (44rem) | existing |
| Header height | `--header-height` | 4rem |
| Shadows | `--shadow-xs` … `--shadow-xl` | existing |
| Radii | `--radius-sm` (4px), `--radius-md` (12px), `--radius-lg` (16px), `--radius-xl` (32px), `--radius-pill` | existing |
| Borders | `--border-subtle`, `--border-strong`, `--border-width-xs` (1px), `--border-width-sm` (2px) | existing |
| Button tokens | `--btn-*` | existing |
| Link tokens | `--link-action-*`, `--link-default`, `--link-hover` | existing |
| Focus | `--focus-ring`, `--focus-ring-width`, `--focus-ring-offset`, `--focus-ring-on-dark` | existing |
| Transition | `--transition-duration`, `--transition-easing` | 0.25s ease |
| Post-it tokens | `--postit-rotation`, `--postit-max-width` | existing |
| Card tokens | `--card-*` | existing |
| App category colours | `--cat-relationships`, `--cat-safety`, `--cat-identity`, `--cat-sexual-health`, `--cat-wellbeing`, `--cat-online-safety`, `--cat-puberty` | existing |
| Surface classes | `.surface--ota`, `.surface--dark`, `.surface--light`, `.surface--alt`, `.surface--brand` | existing |

### Tokens flagged for addition

1. **`--hero-tailor-bg`** — the teacher hero background. A named token aliasing `--bg-emphasis` so the hero can diverge later (e.g. subtle gradient or texture) without affecting every dark surface.
   ```css
   --hero-tailor-bg: var(--bg-emphasis);   /* #1E2A3A — dark authority */
   ```

2. **`--trust-icon-size`** — for framework alignment badges in §5.
   ```css
   --trust-icon-size: 3rem;   /* 48px — badge/logo mark for trust signals */
   ```

3. **`--spot-illus-size`** — editorial spot illustrations in §2 if fallback icons are needed.
   ```css
   --spot-illus-size: 6rem;   /* 96px — editorial illustration default */
   ```

### Base-value changes

None. No existing token values need changing for B1.

---

## Page structure in one picture

```
┌──────────────────────────────────── <header> (shell, sticky)
│
├─ <main id="main">                          ← Tailor root, sits on --bg-page
│
│  ┌─ §1  Teacher hero             [--hero-tailor-bg (dark), full bleed, 72rem inner]
│  │       ├─ Text: headline + subline + dual CTA  │  Photo: editorial classroom image
│  │
│  ├─ §2  Platform / Tailor Teach  [--bg-surface (white), full bleed, 72rem inner]
│  │       ├─ Text: headline + features + CTA  │  Screenshot: app interface
│  │
│  ├─ §3  Delivery                 [--bg-surface-alt, full bleed, 72rem inner]
│  │       ├─ Photo: delivery in school  │  Text: what + how it works + CTA
│  │
│  ├─ §4  Training & support       [--bg-surface (white), full bleed, 72rem inner]
│  │       ├─ Text: headline + strands + CTA  │  Photo: CPD workshop
│  │
│  ├─ §5  Trust signals            [--bg-surface-alt, full bleed, 72rem inner]
│  │       ├─ Framework badges + testimonial (with headshot)
│  │
│  ├─ .layer-ota wrapper
│  │  └─ §6  Okay to Ask           [--bg-ota-surface (warm), full bleed, 56rem inner]
│  │          ├─ OtA intro (wordmark + headline + subline)
│  │          ├─ Book promotion panel
│  │          ├─ 3 × QuestionCard
│  │          ├─ Optional post-it scatter (decorative, 15% opacity)
│  │
│  ├─ §7  Topics overview          [--bg-page ground, 72rem inner]
│  │       ├─ TopicsOverviewGrid (7 categories, 23 landing pages)
│  │
│  └─ §8  Closing CTA              [--hero-tailor-bg (dark), full bleed, 40rem inner]
│          ├─ Headline + subline + dual CTA
│
└──────────────────────────────────── <footer> (shell)
```

### Surface rhythm

The homepage has eight sections across six distinct surfaces:

1. **§1** — `--hero-tailor-bg` (dark blue-grey, #1E2A3A). Authority. The one full-bleed dark band that opens the page.
2. **§2** — `--bg-surface` (white, #FFFFFF). Clean, digital, product-focused. The Tailor Teach app deserves a crisp backdrop.
3. **§3** — `--bg-surface-alt` (#f0efeb). Slightly warmer. Distinguishes delivery from platform without competing with OtA warmth.
4. **§4** — `--bg-surface` (white). Back to crisp white. Training and support is information-dense; white keeps it legible.
5. **§5** — `--bg-surface-alt` (#f0efeb). Calm credibility. The subtlest surface — trust signals need to feel grounded, not dramatic.
6. **§6** — `.surface--ota` (`--bg-ota-surface`, warm paper #F7F5F0). The one warm moment on the page. Temperature shift is deliberate and contained.
7. **§7** — `--bg-page` ground (#FAFAF7). Neutral canvas. The category-coloured cards provide the visual interest.
8. **§8** — `--hero-tailor-bg` (dark, #1E2A3A). Bookend. The page opened dark and closes dark, with warmth and light in between.

Sequence: **dark → white → alt → white → alt → warm → ground → dark**. No two adjacent sections share a surface.

### Vertical rhythm

- §1 (hero): `pt-[var(--space-struct-y-hero)] pb-[var(--space-struct-y-hero)]`.
- §2–§7: `py-[var(--space-struct-y-base)]`.
- §8 (closing CTA): `py-[var(--space-global-2xl)]` — smaller than a content section; this is a single prompt, not a reading section.
- Horizontal insets: every section uses `px-[var(--space-global-gutter)]` on the outer wrapper. Inner wrappers use `max-w-[var(--container-max-shell)] mx-auto` for Tailor sections, `max-w-[var(--container-max-reading-wide)] mx-auto` for OtA section §6.

---

## Section 1 — Teacher hero

### Role
The opening statement. Establishes Tailor Education as a credible, professional RSE provider for schools. This is the "immediate authority" moment. Dark surface, confident typography, clear dual CTA, editorial photograph. The headteacher decides in 3 seconds whether this is a credible provider.

### Desktop (≥ 1200px)

**Outer wrapper.** `<section>` with dark background.
- Tailwind: `w-full pt-[var(--space-struct-y-hero)] pb-[var(--space-struct-y-hero)] px-[var(--space-global-gutter)]`
- Background: `background-color: var(--hero-tailor-bg)` (inline style or utility). This is `--bg-emphasis` (#1E2A3A).
- Text colour: `--text-on-dark`. Headings: `--text-heading-on-dark`.
- Add `.surface--dark` class so child elements (links, focus rings, headings) pick up on-dark overrides.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-shell)]`.

**Layout.** Two-column: text left, editorial photograph right.
- Tailwind: `grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-[var(--space-global-xl)] items-center`
- The `1fr_0.9fr` split gives text slightly more room than the photo — the copy leads, the image supports.
- **Text-only fallback** (if no photograph): `max-w-[38rem]` on the text block. Left-aligned — not centred. Authority is left-aligned; OtA is centred. This distinction matters. Do not render an empty column.

**Text block contents:**

1. **Eyebrow/preheader.** `[COPY TBD]` — could be "Tailor Education" or a positioning line.
   - Tailwind: `mb-[var(--space-global-sm)]`
   - Size: `--text-util-preheader-size` (0.875em).
   - Weight: `--font-weight-regular` (400).
   - Letter-spacing: `--text-util-preheader-ls` (0.15em).
   - Text-transform: uppercase.
   - Colour: `--text-on-dark-strapline` (rgba(255,255,255,0.9)).
   - Font: `--font-tailor-body-stack` (Lexend).

2. **Headline.** `<h1>` — `[COPY TBD]` (e.g. "Expert RSE lessons and training for schools").
   - Font: `--font-tailor-heading-stack` (Lexend).
   - Size: `--text-display-size-h1` (clamps 2.25rem → 3.75rem).
   - Weight: `--heading-weight-h1` (700).
   - Line height: `--lh-display` (1.15).
   - Colour: `--text-heading-on-dark` (#ffffff).
   - Tailwind: `mb-[var(--space-global-md)]`

3. **Subline.** `<p>` — `[COPY TBD]` (brief value proposition).
   - Font: `--font-tailor-body-stack`.
   - Size: `--text-util-hero-subhead-size` (clamps 1.25rem → 1.75rem).
   - Weight: `--font-weight-regular` (400).
   - Line height: `--lh-heading-sub` (1.3).
   - Colour: `--text-on-dark-strapline`.
   - Tailwind: `mb-[var(--space-global-lg)] max-w-[32rem]`.

4. **CTA pair.** Two buttons side by side.
   - Tailwind wrapper: `flex flex-wrap gap-[var(--space-global-sm)]`
   - Primary: `<a class="btn btn--std btn--primary has-icon-hover">` → platform/lessons. Text: `[COPY TBD]` (e.g. "Explore RSE lessons").
   - Secondary: `<a class="btn btn--std btn--white-outline has-icon-hover">` → services/delivery. Text: `[COPY TBD]` (e.g. "Bring Tailor to your school"). White outline on dark — `--btn-white-outline-*` tokens.

**Hero photograph.** Right column on desktop.
- Tailwind: `hidden lg:block relative`
- `<img>` — classroom/workshop editorial photograph. Source: `/images/homepage/hero.jpg` (or `.webp`). The image requirements doc calls for "training room, workshop, classroom facilitation. Real, not stock."
  - Tailwind: `w-full h-auto rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]`
  - `object-fit: cover` if constraining aspect ratio.
  - `alt` — descriptive alt text for the specific photograph used.
- **Brand overlay.** A `::after` pseudo-element on the image wrapper applies an 8% brand tint to unify the photo with the dark hero surface:
  ```css
  .hero-photo-wrap::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-lg);
    background: var(--brand-secondary);
    opacity: 0.08;
    pointer-events: none;
  }
  ```
- **Fallback.** If no photograph is available, the right column does not render (conditionally omit the grid column). The text block gets `max-w-[38rem]`.

### Mobile (< 768px)

- Single column, full-width text block.
- Headline: display ramp clamp handles responsive sizing.
- CTA pair: `flex-wrap` stacks them vertically. Both buttons `w-full sm:w-auto`.
- Padding: `pt-[var(--space-global-2xl)] pb-[var(--space-global-2xl)]`.
- Hero photograph: hidden.

---

## Section 2 — Platform / Tailor Teach

### Role
Show the product. A PSHE lead evaluating RSE providers wants to know what they're actually getting. The Tailor Teach app is nearly ready to launch — this section positions it as a differentiator. The app screenshot is the visual centrepiece; the text explains what's in it and why it matters.

### Desktop (≥ 1200px)

**Outer wrapper.** `<section>` on `--bg-surface` (white).
- Tailwind: `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
- Background: `bg-[var(--bg-surface)]`.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-shell)]`.

**Layout.** Two-column: text left, product screenshot right.
- Tailwind: `grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-global-xl)] items-center`

**Text block contents:**

1. **Section label (optional).** An inline tag or badge reading "Tailor Teach" — not a heading, just a product name marker.
   - Tailwind: `inline-flex items-center px-[var(--space-global-sm)] py-[2px] rounded-[var(--radius-sm)] mb-[var(--space-global-md)]`
   - Background: `bg-[var(--brand-primary)]`. Text: `#fff`. Size: `0.7rem`. Weight: `--font-weight-bold`. Uppercase. Letter-spacing: `0.1em`.

2. **Headline.** `<h2>` — `[COPY TBD]` (e.g. "Expert-authored RSE lessons, ready to teach").
   - Font: `--font-tailor-heading-stack` (Lexend).
   - Size: `--text-display-size-h2` (clamps 1.75rem → 2.75rem).
   - Weight: `--heading-weight-h2` (700).
   - Line height: `--lh-heading` (1.2).
   - Colour: `--text-heading`.
   - Tailwind: `mb-[var(--space-global-md)]`

3. **Intro paragraph.** `<p>` — `[COPY TBD]` (what the platform is, in 2–3 sentences).
   - Size: `--text-prose-size-body`. Colour: `--text-body-muted`. Line height: `--lh-body` (1.6).
   - Tailwind: `mb-[var(--space-global-md)] max-w-[36rem]`

4. **Feature list.** A short checklist — 4–5 items max.
   - `<ul>` with no bullets. Each `<li>` has a teal checkmark prefix (SVG icon or `::before` with `content: '✓'` in `--brand-primary`).
   - Items: expert-authored curriculum-aligned content / structured by topic and key stage / built for teacher confidence / Simple Mode and accessibility built in / `[COPY TBD]`.
   - Size: `--text-prose-size-body`. Colour: `--text-body`. Line height: `--lh-body`.
   - Tailwind on list: `flex flex-col gap-[var(--space-global-xs)] mb-[var(--space-global-lg)]`
   - Tailwind on each `<li>`: `pl-[1.5rem] relative` (checkmark positioned absolutely at left).

5. **CTA.** Single primary button.
   - `<a class="btn btn--std btn--primary has-icon-hover">` → lesson library or Tailor Teach. Text: `[COPY TBD]` (e.g. "Explore the lesson library").

**Product screenshot.** Right column.
- Tailwind: `hidden lg:block`
- `<img>` — real screenshot of the Tailor Teach interface. Source: `/images/homepage/tailor-teach-screenshot.png` (or `.webp`).
  - Tailwind: `w-full h-auto rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] border-[var(--border-width-xs)] border-[var(--border-subtle)]`
  - The border + shadow gives the screenshot a "floating device" feel without needing a device frame mockup.
  - `alt="Screenshot of the Tailor Teach lesson interface"`.
- **Fallback.** If no screenshot: a stylised illustration of lesson content (see `Tailor_Image_Requirements.md` → "A stylised open laptop or tablet showing a lesson layout"). The illustration should be roughly equal in visual weight to the text column.

### Mobile (< 768px)

- Single column. Screenshot stacks above or below text (below is safer — text-first on mobile).
- Screenshot: `lg:hidden block w-full max-w-[24rem] mx-auto mb-[var(--space-global-lg)]` — centred but not full-width.
- Feature list and CTA: same structure, full-width.
- CTA button: `w-full sm:w-auto`.

---

## Section 3 — Delivery

### Role
The premium offering. "We come to your school and deliver RSE directly." This is the high-value conversion — the school that says "do it for us." A headteacher scanning the page should understand what delivery means and have a clear next step. The editorial photograph does real work here: it shows a facilitator in a room with young people, proving this is a real service.

### Desktop (≥ 1200px)

**Outer wrapper.** `<section>` on `--bg-surface-alt`.
- Tailwind: `surface--alt w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-shell)]`.

**Layout.** Two-column: photo left, text right. This reverses §2's orientation (text-left/image-right → image-left/text-right) to create visual rhythm across the scroll.
- Tailwind: `grid grid-cols-1 lg:grid-cols-[0.9fr_1fr] gap-[var(--space-global-xl)] items-center`

**Photograph.** Left column.
- Tailwind: `hidden lg:block`
- `<img>` — editorial photograph of Tailor delivering in a school. Source: `/images/services/delivery-hero.jpg`. Image requirements: "Team member working with students in school."
  - Tailwind: `w-full h-auto rounded-[var(--radius-lg)] shadow-[var(--shadow-md)]`
  - `alt` — descriptive alt text for the specific photograph.
- **Fallback.** If no delivery-specific photo: use the general classroom/workshop photo from §1 (different crop) or omit. The text block carries the section on its own.

**Text block contents:**

1. **Headline.** `<h2>` — `[COPY TBD]` (e.g. "We deliver RSE in your school").
   - Font: Lexend. Size: `--text-display-size-h2`. Weight: `--heading-weight-h2` (700). Colour: `--text-heading`.
   - Tailwind: `mb-[var(--space-global-md)]`

2. **Description.** `<p>` — `[COPY TBD]` (what delivery means: qualified facilitators come to your school, deliver curriculum-aligned RSE directly. Not supply teachers. Expert-led, sensitive, age-appropriate. What the school gets: lesson delivery + teacher guidance + parent communication + follow-up).
   - Size: `--text-prose-size-body`. Colour: `--text-body-muted`. Line height: `--lh-body`.
   - Tailwind: `mb-[var(--space-global-lg)] max-w-[34rem]`

3. **"How it works" steps.** Three simple steps — a lightweight process indicator, not a wizard.
   - Tailwind wrapper: `flex flex-col sm:flex-row gap-[var(--space-global-md)] mb-[var(--space-global-lg)]`
   - Each step: `flex items-start gap-[var(--space-global-sm)]`
     - **Number.** Circular badge: `w-6 h-6 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center shrink-0`. Size: `0.75rem`. Weight: `--font-weight-bold`.
     - **Text.** `[COPY TBD]` (e.g. "Get in touch and tell us what you need" / "We plan together around your school context" / "We deliver — and follow up afterwards"). Size: `--text-card-size-body`. Colour: `--text-body-muted`.

4. **CTA.** Single primary button.
   - `<a class="btn btn--std btn--primary has-icon-hover">` → enquiry/contact. Text: `[COPY TBD]` (e.g. "Enquire about delivery").

### Mobile (< 768px)

- Single column. Photo stacks above text.
- Photo: `lg:hidden block w-full rounded-[var(--radius-lg)] mb-[var(--space-global-lg)]`.
- Steps: stack vertically (`flex-col`).
- CTA: `w-full sm:w-auto`.

---

## Section 4 — Training & support

### Role
"We upskill your team." CPD, confidence-building, policy guidance, curriculum planning support. This speaks to the PSHE coordinator who wants help getting better at delivering RSE themselves, and to the deputy head responsible for RSE policy compliance. The section needs to convey that "support" means more than a one-off workshop — it's ongoing partnership.

### Desktop (≥ 1200px)

**Outer wrapper.** `<section>` on `--bg-surface` (white).
- Tailwind: `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
- Background: `bg-[var(--bg-surface)]`.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-shell)]`.

**Layout.** Two-column: text left, photograph right. This mirrors §2's orientation and reverses §3's — maintaining the alternating image/text rhythm.
- Tailwind: `grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-[var(--space-global-xl)] items-center`

**Text block contents:**

1. **Headline.** `<h2>` — `[COPY TBD]` (e.g. "Training and support for your RSE team").
   - Font: Lexend. Size: `--text-display-size-h2`. Weight: `--heading-weight-h2` (700). Colour: `--text-heading`.
   - Tailwind: `mb-[var(--space-global-md)]`

2. **Intro paragraph.** `<p>` — `[COPY TBD]` (framing: we don't just provide resources — we help your team feel confident, compliant, and supported).
   - Size: `--text-prose-size-body`. Colour: `--text-body-muted`. Line height: `--lh-body`.
   - Tailwind: `mb-[var(--space-global-md)] max-w-[34rem]`

3. **Support strand tags.** A row of pill badges indicating the three strands. These are scannable labels, not clickable links.
   - Tailwind wrapper: `flex flex-wrap gap-[var(--space-global-xs)] mb-[var(--space-global-md)]`
   - Each pill: `inline-flex items-center px-[var(--space-global-sm)] py-[3px] rounded-[var(--radius-pill)]`
     - Background: `hsla(var(--brand-accent-h), var(--brand-accent-s), var(--brand-accent-l), 0.1)`.
     - Text: `--brand-accent-text`. Size: `0.75rem`. Weight: `--font-weight-semibold`. Uppercase. Letter-spacing: `0.05em`.
   - Tags: "CPD & Workshops" / "Policy Guidance" / "Curriculum Planning".

4. **Expansion paragraph.** `<p>` — `[COPY TBD]` (brief details: in-school or online workshops, twilight CPD sessions, RSE policy development support, curriculum mapping across key stages, DfE statutory alignment).
   - Size: `--text-card-size-body` (14px). Colour: `--text-body-muted`. Line height: `--lh-body`.
   - Tailwind: `mb-[var(--space-global-lg)] max-w-[34rem]`

5. **CTA pair.**
   - Tailwind wrapper: `flex flex-wrap gap-[var(--space-global-sm)]`
   - Primary: `<a class="btn btn--std btn--primary has-icon-hover">` → training page. Text: `[COPY TBD]` (e.g. "Explore training options").
   - Secondary: `<a class="btn btn--std btn--outline has-icon-hover">` → contact. Text: `[COPY TBD]` (e.g. "Talk to us about support").

**Photograph.** Right column.
- Tailwind: `hidden lg:block`
- `<img>` — editorial photograph of a CPD workshop. Source: `/images/training/training-hero.jpg`. Image requirements: "CPD workshop in progress. Teachers engaging."
  - Tailwind: `w-full h-auto rounded-[var(--radius-lg)] shadow-[var(--shadow-md)]`
  - `alt` — descriptive alt text.
- **Fallback.** If no training photo: omit the image column. The text block expands to fill the section with `max-w-[38rem]`. The strand tags and CTA pair carry the section visually.

### Mobile (< 768px)

- Single column. Photo below text (or hidden if no photo).
- Strand tags: wrap naturally on narrow screens.
- CTA pair: stack vertically. Both `w-full sm:w-auto`.

---

## Section 5 — Trust signals

### Role
Framework alignment and social proof. Validates everything above — the product, delivery, training. This answers "why should I trust you?" for school leaders. The art direction brief says "visible proof of credibility — trust signals integrated naturally, not tacked on."

### Desktop (≥ 1200px)

**Outer wrapper.** `<section>` on `--bg-surface-alt`.
- Tailwind: `surface--alt w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-shell)]`.

**Layout.** Two vertical sub-sections stacked: framework badges at the top, testimonial pull quote below.

**Sub-section A — Framework alignment badges.**

- Tailwind wrapper: `text-center mb-[var(--space-global-xl)]`
- Heading: `<h2>` — `[COPY TBD]` (e.g. "Aligned with national and international frameworks").
  - Font: Lexend. Size: `--text-display-size-h3`. Weight: `--heading-weight-h2`. Colour: `--text-heading`.
  - Tailwind: `mb-[var(--space-global-lg)]`
- **Badge row.** Horizontal row of framework logos/marks.
  - Tailwind: `flex flex-wrap justify-center items-center gap-[var(--space-global-xl)]`
  - Each badge: `<div class="trust-badge">` containing a logo image + label text.
    - Logo: `<img>` at `w-[var(--trust-icon-size)] h-[var(--trust-icon-size)] object-contain` — DfE, PSHE Association, UNESCO, WHO marks.
    - Label: below the logo. `--text-card-size-body`, `--text-body-muted`, `--font-weight-medium`, `text-center`.
    - Tailwind on each badge: `flex flex-col items-center gap-[var(--space-global-xs)] w-[7rem]`

**Sub-section B — Testimonial pull quote.**

- Tailwind wrapper: `mt-[var(--space-global-xl)] max-w-[var(--container-max-prose)] mx-auto text-center`
- `<blockquote>`:
  - Quote text: `[COPY TBD]` — ideally from a headteacher or PSHE lead who used delivery or training.
  - Font: Lexend. Size: `--text-display-size-quote` (clamps 1.25rem → 1.75rem). Weight: `--font-weight-regular`. Line height: `--lh-heading-sub` (1.3). Colour: `--text-heading`. Font-style: italic.
  - Tailwind: `mb-[var(--space-global-md)]`
- **Attribution row.** Horizontal group: headshot + name/role.
  - Tailwind: `flex items-center justify-center gap-[var(--space-global-sm)] mt-[var(--space-global-md)]`
  - **Headshot.** Circular portrait.
    - `<img>` — source: `/images/testimonials/[name].jpg`.
    - Tailwind: `w-12 h-12 rounded-full object-cover shrink-0 shadow-[var(--shadow-xs)]`
    - `alt="[Person's name]"`.
    - **Fallback.** If no headshot: omit the image. The `<cite>` text renders cleanly alone.
  - `<cite>`:
    - Attribution: `[COPY TBD]` (name, role, school).
    - Font: Lexend. Size: `--text-card-size-body`. Weight: `--font-weight-medium`. Colour: `--text-body-muted`. Font-style: normal.
- Optional: `<a href="/our-approach" class="link-action mt-[var(--space-global-lg)] inline-flex">See our approach</a>` below the quote.

### Mobile (< 768px)

- Framework badges: `flex-wrap` arranges them in 2×2. Gap drops to `--space-global-lg`.
- Pull quote: font size steps down via clamp. Text stays centred.
- Headshot + citation: same layout, same sizing.

---

## Section 6 — Okay to Ask

### Role
The one warm moment. "We also built a free resource where young people get honest answers to real questions — and published a book." This is proof of care, depth, and expertise. It shows the school that Tailor understands the end user (young people), not just the institutional buyer. For any young people or parents who find the homepage directly, this section is their entry point.

This is the only `.layer-ota` section on the page. It consolidates what was three separate sections in v1 (OtA hero, book promotion, featured questions) into one cohesive warm band.

### Desktop (≥ 1200px)

**Outer wrapper.** `<section>` inside the `.layer-ota` scope, with `.surface--ota`.
- Tailwind: `surface--ota w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)] relative overflow-hidden`
- Background: `--bg-ota-surface` (#F7F5F0).
- The `relative overflow-hidden` contains the optional post-it scatter within bounds.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-reading-wide)]`.

The section has three internal beats separated by generous spacing. No hard dividers — the vertical rhythm creates the separation.

**Beat 1 — OtA introduction.**

- Tailwind wrapper: `text-center mb-[var(--space-global-2xl)]`

1. **Okay to Ask wordmark.** Small wordmark image centred above the headline.
   - Tailwind: `mx-auto mb-[var(--space-global-lg)] block`
   - Width: `w-[10rem]`. Fixed — the wordmark is a brand asset.
   - `alt="Okay to Ask"`.

2. **Headline.** `<h2>` — `[COPY TBD]` (e.g. "Okay to Ask — honest answers for young people").
   - Font: Fraunces (inherited from `.layer-ota`).
   - Size: `--text-display-size-h2` (clamps 1.75rem → 2.75rem).
   - Weight: `--heading-ota-weight-h2` (700).
   - Line height: `--lh-heading` (1.2).
   - `font-variation-settings: 'opsz' var(--font-ota-heading-opsz), 'WONK' var(--font-ota-heading-wonk)` — inherited from `.layer-ota h2`.
   - Colour: `--text-ota-heading`.
   - Tailwind: `mb-[var(--space-global-md)]`

3. **Subline.** `<p>` — `[COPY TBD]` (1–2 sentences: what OtA is, who it's for, why it exists).
   - Font: Atkinson (inherited from `.layer-ota`).
   - Size: `--text-display-size-body` (clamps 1.125rem → 1.375rem).
   - Weight: `--font-weight-regular` (400).
   - Line height: `--lh-body` (1.6).
   - Colour: `--text-ota-muted`.
   - Tailwind: `max-w-[30rem] mx-auto`

**Beat 2 — Book promotion panel.**

- Tailwind wrapper: `mb-[var(--space-global-2xl)]`

A contained card panel, echoing B8's book promotion treatment. The whole panel is a clickable link to `/book`.
- Outer: `<a href="/book" class="block no-underline">`
- Tailwind on the panel: `flex flex-col md:flex-row items-center gap-[var(--space-global-xl)] p-[var(--space-global-xl)] rounded-[var(--radius-lg)]`
- Background: `bg-[var(--bg-ota-book-panel)]` (#eae6e1).
- Shadow: `--shadow-md` at rest. Hover: `--shadow-lg` with `translateY(-2px)`.
- Transition: `transition-all`.

Panel contents:

1. **Book cover image (left on desktop).**
   - Tailwind: `shrink-0 w-[12rem] md:w-[10rem] lg:w-[12rem]`
   - `<img>` with `rounded-[var(--radius-sm)] shadow-[var(--shadow-md)]`.
   - `alt="Okay to Ask book cover"`.

2. **Text block (right on desktop).**
   - Flex column: `flex flex-col gap-[var(--space-global-sm)]`
   - Eyebrow: `[COPY TBD]` (e.g. "The Okay to Ask book") — `--text-util-preheader-size`, uppercase, `--text-util-preheader-ls`, `--text-ota-muted`, weight `--font-weight-semibold`.
   - Title: `[COPY TBD]` (e.g. "The book that answers the questions young people really ask"). Fraunces, `--text-card-size-h2` (clamps 1.25rem → 1.5rem), weight `--heading-ota-weight-h2`, colour `--text-ota-heading`, line height `--lh-heading-sub` (1.3).
   - Description: `[COPY TBD]` (one-line pitch). Atkinson, `--text-prose-size-body`, `--text-ota-muted`, line height `--lh-body`.
   - Action: "Buy the book →" — styled as `.link-action`. Colour `--link-action-color`, weight `--font-weight-bold`, arrow via `::after`.

**Beat 3 — Featured question cards.**

- Optional heading: `<h3>` — `[COPY TBD]` (e.g. "Questions young people really ask").
  - Font: Fraunces. Size: `--text-display-size-h3`. Weight: `--heading-ota-weight-h3` (600). Colour: `--text-ota-heading`.
  - Tailwind: `text-center mb-[var(--space-global-lg)]`

- **Card grid.** Reuses `QuestionCard.astro` — same component as C1 §6 and B8 §3.
  - Tailwind: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--space-global-md)]`
  - 3 cards on desktop (one row of three).
  - Cards are curated editorially — specific question slugs from a frontmatter list or a Notion property.

- **"See all questions" link.** Below the grid, centred.
  - Tailwind wrapper: `flex justify-center mt-[var(--space-global-xl)]`
  - `<a href="/questions/" class="btn btn--std btn--outline has-icon-hover">See all questions</a>`

**Post-it scatter (decorative, optional).** 2–3 post-it thumbnail images positioned absolutely within the section. These use existing post-it scans from `/images/postits/`.
- The outer `<section>` already has `relative overflow-hidden`.
- Each post-it: `<img>` with `absolute` positioning, individual `top`/`left`/`right`/`bottom` values, `w-[6rem] md:w-[8rem]`, `opacity-[0.15]`, `mix-blend-mode: multiply`, individual `rotate-[Xdeg]` (±2–5°).
- `pointer-events: none`, `aria-hidden="true"`.
- Position toward section edges so they don't obscure centred content.
- Desktop only: each post-it image gets `hidden md:block`.

### Mobile (< 768px)

- Book panel: `flex-col`, centred. Book image on top, text below.
  - Book image: `w-[10rem] mx-auto mb-[var(--space-global-md)]`.
  - Text block: `text-center`.
  - Panel padding: `p-[var(--space-global-lg)]`.
- Card grid: `grid-cols-1`. Cards stack. Show all 3.
- "See all questions" button: `w-full sm:w-auto`.
- Post-it scatter: hidden.

---

## Section 7 — Topics overview

### Role
Shows the breadth of what Tailor covers — all 23 landing pages grouped by the 7 app categories. Teacher-facing; uses the app's `--cat-*` category colours (not `--ota-cat-*`). The message is "we cover everything you need to teach."

### Desktop (≥ 1200px)

**Outer wrapper.** `<section>` on `--bg-page` ground (no surface class).
- Tailwind: `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-shell)]`.

**Component.** Reuses `TopicsOverviewGrid.astro`. The component owns its own heading ("Topics we cover"), intro text, grid layout, and category styling. The page template wraps it in the section; the component handles everything inside.

The grid is 3-col on desktop, 2-col on tablet, 1-col on mobile. Category headings are coloured via `style="--cat-color: var(--cat-{token})"`.

**Heading level adjustment:** The component's internal `<h2>` and `<h3>` elements need to shift down one level when embedded in B1 (under the page's §7 `<h2>`). The component needs a `headingLevel` prop — same pattern as `TopicTags.astro`'s `label` prop. Flag for build.

### Mobile (< 768px)

- Grid: `grid-cols-1`. Category groups stack.
- Category group cards: same padding and structure, full-width.

---

## Section 8 — Closing CTA

### Role
The final prompt. The teacher has scrolled the whole page — product, services, credentials, the OtA story, topic breadth. Now: "What's your next step?" The dark surface bookends the hero at the top, framing the page. This is persuasion, not navigation — it does a different job from the footer.

### Desktop (≥ 1200px)

**Outer wrapper.** `<section>` on `--hero-tailor-bg` (dark).
- Tailwind: `w-full py-[var(--space-global-2xl)] px-[var(--space-global-gutter)]`
- Background: `background-color: var(--hero-tailor-bg)`.
- Text colour: `--text-on-dark`. Add `.surface--dark`.

**Inner wrapper.** `mx-auto w-full max-w-[40rem] text-center`.

**Contents:**

1. **Headline.** `<h2>` — `[COPY TBD]` (e.g. "Ready to bring expert RSE to your school?").
   - Font: Lexend. Size: `--text-display-size-h2` (clamps 1.75rem → 2.75rem). Weight: `--heading-weight-h2` (700). Line height: `--lh-heading` (1.2). Colour: `--text-heading-on-dark`.
   - Tailwind: `mb-[var(--space-global-md)]`

2. **Subline (optional).** `<p>` — `[COPY TBD]` (e.g. "Whether you need lessons, training, or delivery — we're here to help").
   - Size: `--text-util-hero-subhead-size`. Colour: `--text-on-dark-strapline`. Line height: `--lh-heading-sub`.
   - Tailwind: `mb-[var(--space-global-lg)] max-w-[30rem] mx-auto`

3. **CTA pair.** Centred.
   - Tailwind wrapper: `flex flex-wrap justify-center gap-[var(--space-global-sm)]`
   - Primary: `<a class="btn btn--std btn--primary has-icon-hover">` → contact/enquiry. Text: `[COPY TBD]` (e.g. "Get in touch").
   - Secondary: `<a class="btn btn--std btn--white-outline has-icon-hover">` → platform/lessons. Text: `[COPY TBD]` (e.g. "Explore lessons"). White outline on dark.

### Mobile (< 768px)

- Same structure. Headline and subline: clamp handles sizing.
- CTA pair: stack vertically. Both `w-full sm:w-auto`.
- Padding: `py-[var(--space-global-xl)]`.

---

## New CSS needed for B1

Add to `tailor-site-v2.css`:

```css
/* ── Hero photo overlay (B1 §1) ── */
.hero-photo-wrap {
    position: relative;
    display: block;
}

.hero-photo-wrap::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-lg);
    background: var(--brand-secondary);
    opacity: 0.08;
    pointer-events: none;
}

/* ── Trust Signal Badge (B1 §5) ── */
.trust-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-global-xs);
    width: 7rem;
}

.trust-badge img {
    width: var(--trust-icon-size);
    height: var(--trust-icon-size);
    object-fit: contain;
}

.trust-badge span {
    font-size: var(--text-card-size-body);
    font-weight: var(--font-weight-medium);
    color: var(--text-body-muted);
    text-align: center;
    line-height: var(--lh-card);
}
```

---

## Component specifications

### Reused components

- **`QuestionCard.astro`** — §6 featured questions. No changes.
- **`TopicsOverviewGrid.astro`** — §7 topics overview. Needs `headingLevel` prop for B1 context (flag for build, not blocking v1).

### B1-specific visual patterns (not componentised)

- **Hero photograph with brand overlay** (§1). The `::after` pseudo-element is defined as `.hero-photo-wrap` in the CSS. This is specific to the dark hero context.
- **Post-it scatter** (§6). Decorative absolute-positioned post-it thumbnails. Hand-placed in the B1 page template — not a reusable component. Positions, rotations, and specific post-it images are authored directly.
- **Support strand tags** (§4). Inline pill badges. If this pattern appears on other pages, extract to a component. For now, template-level markup.

### Components NOT on B1

- **`SignpostingBlock.astro`** — not present. Signposting belongs on content pages with sensitive material.
- **`SimpleModeToggle.astro`** — not present. The homepage is a showcase page, not a content page.
- **`EndOfAnswerPanel.astro`** — not present. B1 distributes the same three CTAs differently: the book is in §6, topics in §7, services in §1's secondary CTA + §3.
- **`GlossaryTooltips`** — not present. No long-form prose on the homepage.

---

## Accessibility notes

1. **Heading hierarchy.** `<h1>` is in §1 (teacher hero headline). §2 through §8 each have an `<h2>`. §3's process steps are not headings. §6's "Questions young people really ask" is an `<h3>` (under §6's `<h2>`). §7's `TopicsOverviewGrid` internal headings should be `<h3>` and `<h4>` when embedded here — requires `headingLevel` prop.

2. **Layer scoping and screen readers.** The `.layer-ota` wrapper is a `<div>` with no semantic role — invisible to screen readers. The `<section>` inside carries `aria-labelledby` pointing to its heading ID.

3. **Dark/light contrast.** §1 and §8 use `--text-on-dark` and `--text-heading-on-dark` on `--hero-tailor-bg`. Both are white/near-white on #1E2A3A — WCAG AAA.

4. **Focus rings.** §1 and §8 (dark): `--focus-ring-on-dark` via `.surface--dark`. All other sections: `--focus-ring` (default teal).

5. **Skip link.** The shell's existing skip-to-main link (`#main`) still works — it targets `<main>` which wraps all eight sections.

6. **Image alt text.** The editorial photographs in §1, §3, and §4 need specific, descriptive alt text (not generic "classroom photo"). The post-it scatter images in §6 are `aria-hidden="true"`. The product screenshot in §2 has functional alt text.

---

## Edge cases

**No hero photograph (§1).** Grid falls back to single-column. Text block gets `max-w-[38rem]`. Do not render an empty right column.

**No app screenshot (§2).** Replace with the editorial illustration fallback described in §2. If neither is available, the text column expands to full width with `max-w-[38rem]`.

**No delivery photograph (§3).** Text block expands. The "how it works" steps and CTA carry the section. Omit the image column entirely.

**No training photograph (§4).** Text block expands with `max-w-[38rem]`. The strand tags give the section visual structure even without a photo.

**No book cover image (§6).** The book panel still renders with text content. The book cover `<img>` is conditionally rendered — if missing, the panel becomes text-only.

**No featured questions selected (§6).** Beat 3 (cards + "See all questions" link) is omitted. The section still shows the OtA intro and book panel.

**No testimonial quote (§5).** §5 shows only the framework badges. The pull quote sub-section doesn't render.

**No testimonial headshot (§5).** The `<cite>` text renders without the portrait. The flex layout handles this.

**No framework badge images (§5).** Text-only badges (label text without logos).

**Very long copy.** All `[COPY TBD]` fields have max-width constraints: §1 headline capped by grid column; §1 subline by `max-w-[32rem]`; §2–§4 descriptions by `max-w-[34rem]` or `max-w-[36rem]`; §6 subline by `max-w-[30rem]`; §8 by `max-w-[40rem]` inner wrapper. No copy field can overflow its container.

---

## Design decisions log

**Why teacher-first?** The homepage's primary audience is teachers and school leaders evaluating RSE provision. OtA is the SEO winner but the homepage is a conversion page for schools. OtA content lives at `/questions/` and `/anonymous_question/` — it doesn't need the homepage to be its hero.

**Why separate sections for platform, delivery, and training instead of a three-card grid?** Because they represent three different buying decisions made by different people. A PSHE lead browsing for resources, a headteacher who wants someone to deliver RSE, and a deputy head looking for CPD — they need different information and different CTAs. A card with three sentences can't make any of those cases.

**Why one OtA section instead of three?** The A-B-A-B-A rhythm in v1 created visual confusion about whose page this was. One warm section at position 6 is enough to show the OtA story, the book, and the question cards. The typographic switch happens once, stays contained, and resolves cleanly back into Tailor for the final two sections.

**Why a closing CTA?** The page is long (8 sections). The conversion paths are spread across §2 (platform), §3 (delivery), and §4 (training). A teacher who scrolls all the way down deserves a clear "what now?" that gathers those paths. The footer is navigation; §8 is persuasion. They do different jobs.

**Why alternating image/text column orientation?** §2 is text-left/image-right. §3 is image-left/text-right. §4 is text-left/image-right. This zigzag prevents the scroll from feeling like a template repeating. The reader's eye moves differently through each section even though the underlying grid structure is similar.
