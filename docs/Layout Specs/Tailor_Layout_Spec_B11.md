# Tailor Layout Spec — B11 Book page

*Layout specification for the Okay to Ask book page at `/book`. Single instance. This page is the destination for every "Get the book" panel across all 152 question pages (via A17's Panel 1), the book promotion on B8 `/questions/`, and the homepage §6 book panel. It is the only page on the site whose primary conversion action is a purchase (via Stripe payment link).*

*Mood: warm, confident, physical. The book is the tangible embodiment of Okay to Ask — post-it scans and honest answers in a 210×210mm square format produced with ReportLab. This page should make the reader feel the book before they buy it. The warmth of OtA is turned up here — this is the warmest page on the site, because it's selling something personal.*

*This is an Okay to Ask page. `<main>` carries `.layer-ota`. Typography inside `<main>` is Atkinson Hyperlegible (body) and Fraunces (headings). The shell (header, footer) remains in Lexend per the shell spec.*

**Version:** 1.0
**Date:** 2026-04-07

---

## Reference documents

- `Tailor_Page_Content_Spec_v1.md` — B11 section (content structure, 6 sections)
- `Tailor_Art_Direction_Brief_v1 (1).md` — OtA layer mood, post-it motif, image strategy
- `Tailor_Image_Requirements.md` — Book interior samples, book lifestyle shot
- `Tailor_Layout_Spec_Shell.md` — header, footer, nav, container tokens
- `Tailor_Layout_Spec_C1.md` — C1 question page (OtA patterns, QuestionCard, post-it treatment)
- `Tailor_Layout_Spec_B8.md` — B8 /questions/ landing (book promotion panel, OtA hero)
- `Tailor_Layout_Spec_B1.md` — B1 homepage (book promotion in §6)
- `src/components/EndOfAnswerPanel.astro` — A17 end-of-answer panel (Panel 1 links here)
- `src/components/QuestionCard.astro` — reused for sample questions

---

## Layer scoping

```html
<body>
  <header>…shell…</header>

  <main id="main" class="layer-ota">
    <!-- B11 content sections go here -->
  </main>

  <footer>…shell…</footer>
</body>
```

`.layer-ota` on `<main>` activates Atkinson + Fraunces and OtA text colours. Individual sections add `.surface--ota` or `.surface--ota-alt` where they want the warm paper ground. The shell is untouched.

---

## Tokens and conventions this spec depends on

### Tokens referenced on this page (all existing)

| Purpose | Token | Current value |
|---|---|---|
| OtA heading font | `--font-ota-heading-stack` | Fraunces |
| OtA body font | `--font-ota-body-stack` | Atkinson Hyperlegible |
| OtA text body | `--text-ota-body` | `--text-body` |
| OtA text heading | `--text-ota-heading` | `--text-heading` |
| OtA text muted | `--text-ota-muted` | #5B6675 |
| Text on dark | `--text-on-dark` | #f4f3ef |
| Text heading on dark | `--text-heading-on-dark` | #ffffff |
| Text muted on dark | `--text-muted-on-dark` | rgba(255,255,255,0.6) |
| Page ground | `--bg-page` | #FAFAF7 |
| White surface | `--bg-surface` | #FFFFFF |
| OtA surface | `--bg-ota-surface` | #F7F5F0 |
| OtA alt surface | `--bg-ota-surface-alt` | #F0EDE5 |
| OtA book panel bg | `--bg-ota-book-panel` | #eae6e1 |
| Emphasis bg | `--bg-emphasis` | #1E2A3A |
| Brand primary | `--brand-primary` | #1A9E8A |
| Brand accent text | `--brand-accent-text` | teal L≤29% |
| Display ramp | `--text-display-size-h1` … `--text-display-size-body` | existing |
| Prose ramp | `--text-prose-size-*` | existing |
| Card ramp | `--text-card-size-*` | existing |
| Utility text | `--text-util-preheader-*`, `--text-util-hero-subhead-*`, `--text-util-lede-*` | existing |
| Heading weights (OtA) | `--heading-ota-weight-*` | existing |
| Font weights | `--font-weight-regular` (400), `-medium` (500), `-semibold` (600), `-bold` (700) | existing |
| Line heights | `--lh-display` (1.15), `--lh-heading` (1.2), `--lh-heading-sub` (1.3), `--lh-card` (1.4), `--lh-body` (1.6), `--lh-prose` (1.7) | existing |
| Letter-spacing | `--text-eyebrow-ls` (0.05em), `--card-eyebrow-ls` (0.1em), `--text-util-preheader-ls` (0.15em) | existing |
| Spacing | `--space-global-xs` … `--space-global-2xl`, `--space-global-gutter` | existing |
| Structural spacing | `--space-struct-y-hero`, `--space-struct-y-base` | existing |
| Container widths | `--container-max-shell` (72rem), `--container-max-reading-wide` (56rem), `--container-max-prose` (44rem) | existing |
| Shadows | `--shadow-xs` … `--shadow-xl` | existing |
| Radii | `--radius-sm` (4px), `--radius-md` (12px), `--radius-lg` (16px), `--radius-xl` (32px), `--radius-pill` | existing |
| Borders | `--border-subtle`, `--border-width-xs` (1px), `--border-width-sm` (2px) | existing |
| Button tokens | `--btn-*` | existing |
| Link tokens | `--link-action-*`, `--link-default` | existing |
| Focus | `--focus-ring`, `--focus-ring-width`, `--focus-ring-offset` | existing |
| Transition | `--transition-duration`, `--transition-easing` | 0.25s ease |
| Post-it tokens | `--postit-rotation`, `--postit-max-width` | existing |
| Card tokens | `--card-*` | existing |
| Post-it surface | `--surface-ota-postit`, `--surface-ota-postit-soft` | existing |
| Panel tokens | `--panel-radius`, `--panel-padding` | existing |
| OtA font variation | `--font-ota-heading-opsz`, `--font-ota-heading-wonk` | existing |

### Tokens flagged for addition

1. **`--book-cover-shadow`** — a specific shadow for the book cover image that gives it a physical, lifted feel. The book is 210×210mm square; the shadow needs to suggest thickness and weight, not a flat card.
   ```css
   --book-cover-shadow: 0 8px 24px rgba(27, 26, 23, 0.12),
                        0 2px 8px rgba(27, 26, 23, 0.08);
   ```

2. **`--book-cover-max-width`** — caps the cover image at a size that reads as "a real book on a table" rather than a full-bleed hero image. The square format means width = height; capping width controls both.
   ```css
   --book-cover-max-width: 20rem;   /* 320px — generous but contained */
   ```

### Base-value changes

None.

---

## Page structure in one picture

```
┌──────────────────────────────────── <header> (shell)
│
├─ <main id="main" class="layer-ota">       ← sits on --bg-page ground
│
│  ┌─ §1  Hero                       [surface--ota, full bleed, 56rem inner]
│  │       ├─ Book cover image (square, 210×210mm format)
│  │       ├─ Title + one-line pitch + primary purchase CTA
│  │
│  ├─ §2  What's inside              [page ground, 44rem prose]
│  │       ├─ Description of the book's content and format
│  │       ├─ Optional: interior spread images
│  │
│  ├─ §3  Who it's for               [surface--ota, full bleed, 56rem inner]
│  │       ├─ 4 audience cards (parents, staff rooms, conferences, young people)
│  │
│  ├─ §4  Purchase CTA               [bg-ota-book-panel, full bleed, 40rem inner]
│  │       ├─ Price + Stripe purchase button + secondary info
│  │
│  ├─ §5  Sample content             [page ground, 56rem inner]
│  │       ├─ 2–3 QuestionCards with answer excerpts
│  │
│  └─ §6  Trust signal               [surface--ota-alt, full bleed, 44rem inner]
│          ├─ Testimonial or authorship credential
│
└──────────────────────────────────── <footer> (shell)
```

### Surface rhythm

Six sections, five distinct surfaces:

1. **§1** — `.surface--ota` (warm paper, #F7F5F0). The hero opens on warm paper — immediately OtA. The book cover is the visual centre.
2. **§2** — `--bg-page` ground (#FAFAF7). Subtle shift to neutral ground for the descriptive prose. The content panel metaphor is not used here — B11 doesn't need C1's "book page" framing because B11 *is* the book page. The page ground gives the interior images room to breathe.
3. **§3** — `.surface--ota` (warm paper). Returns to warm paper for the audience cards. The warmth suits the personal "who is this for?" tone.
4. **§4** — `--bg-ota-book-panel` (#eae6e1). The deepest warm surface — the purchase moment. This is the same token used for the book panel on B8 and B1, creating visual continuity. The reader who clicked "Get the book" from a question page sees the same warm tone they saw on the promotion panel.
5. **§5** — `--bg-page` ground. Neutral canvas for the sample question cards. The cards provide their own visual structure.
6. **§6** — `.surface--ota-alt` (#F0EDE5). The deeper warm exit band, same as C1's §7 exit. Calm close.

Sequence: **warm → ground → warm → book panel → ground → deeper warm**. The alternation prevents monotony while keeping the whole page unmistakably OtA.

### Vertical rhythm

- §1 (hero): `pt-[var(--space-struct-y-hero)] pb-[var(--space-struct-y-base)]`. Generous top air; the hero needs presence.
- §2–§6: `py-[var(--space-struct-y-base)]`.
- Horizontal insets: every section uses `px-[var(--space-global-gutter)]`. Inner wrappers use `max-w-[var(--container-max-reading-wide)] mx-auto` unless noted.

---

## Section 1 — Hero

### Role
The emotional entrance and the sale's opening move. The book cover is the hero image. The 210×210mm square format is distinctive — it's not a standard paperback, and the layout should emphasise that. The cover, title, pitch, and purchase CTA share the stage. A visitor arriving from A17's "Get the book" panel should immediately feel "yes, this is the book I was told about."

### Desktop (≥ 1200px)

**Outer wrapper.** `<section>` with `.surface--ota`.
- Tailwind: `surface--ota w-full pt-[var(--space-struct-y-hero)] pb-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-reading-wide)]`.

**Layout.** Two-column: book cover left, text right. The cover is the visual anchor — it sits left because the eye goes there first in an LTR layout.
- Tailwind: `grid grid-cols-1 md:grid-cols-[auto_1fr] gap-[var(--space-global-xl)] items-center`
- The `auto` column sizes to the cover image's intrinsic width (capped by `--book-cover-max-width`). The `1fr` column takes the remaining space for text.

**Book cover image (left column).**
- `<img>` — the Okay to Ask book cover. Source: `/images/book/cover.jpg` (or `.webp`).
  - Tailwind: `block max-w-[var(--book-cover-max-width)] w-full h-auto rounded-[var(--radius-md)]`
  - Shadow: `box-shadow: var(--book-cover-shadow)` — the shadow gives the square format physical presence.
  - The image is square (1:1 aspect ratio) reflecting the 210×210mm format. The `rounded-[var(--radius-md)]` (12px) softens the corners just enough to feel tactile without losing the book's rectilinear authority.
  - `alt="Okay to Ask book cover — [descriptive text of the cover design]"`.
- **Optional: slight rotation.** A subtle `rotate-[-1deg]` on the cover image can give it a "placed on a table" feel. This is the same instinct as the post-it rotation but much more restrained — 1° max. The rotation is a design choice, not a spec requirement. If it reads as gimmicky in implementation, remove it.

**Text block (right column).**

1. **Okay to Ask wordmark.** Small wordmark above the title, establishing the sub-brand.
   - Tailwind: `mb-[var(--space-global-md)]`
   - Width: `w-[8rem]`. Smaller than the B8 hero wordmark — the book cover already carries the brand identity visually.
   - `alt="Okay to Ask"`.

2. **Title.** `<h1>` — `[COPY TBD]` (the book's full title, e.g. "Okay to Ask: Real questions from real young people, answered honestly").
   - Font: Fraunces.
   - Size: `--text-display-size-h1` (clamps 2.25rem → 3.75rem).
   - Weight: `--heading-ota-weight-h1` (700).
   - Line height: `--lh-display` (1.15).
   - `font-variation-settings` inherited from `.layer-ota h1`.
   - Colour: `--text-ota-heading`.
   - Tailwind: `mb-[var(--space-global-md)]`

3. **One-line pitch.** `<p>` — `[COPY TBD]` (e.g. "152 questions young people really asked — answered with honesty, care, and no judgement").
   - Font: Atkinson.
   - Size: `--text-util-hero-subhead-size` (clamps 1.25rem → 1.75rem).
   - Weight: `--font-weight-regular` (400).
   - Line height: `--lh-heading-sub` (1.3).
   - Colour: `--text-ota-muted`.
   - Tailwind: `mb-[var(--space-global-lg)] max-w-[28rem]`

4. **Purchase CTA.** Primary action.
   - `<a href="[STRIPE_LINK]" class="btn btn--std btn--primary has-icon-hover">` — text `[COPY TBD]` (e.g. "Buy the book — £[PRICE]"). Including the price in the button text reduces friction: the reader doesn't have to scroll to find the cost.
   - If purchase is not yet live: `<a class="btn btn--std btn--primary has-icon-hover">Register your interest</a>` → email capture or waitlist (see §4 for the full purchase/pre-purchase logic).
   - Below the button, optional: a quiet line of supporting info. E.g. "Free UK delivery · 210×210mm square format".
     - Size: `--text-card-size-body` (14px). Colour: `--text-ota-muted`. Weight: `--font-weight-regular`.
     - Tailwind: `mt-[var(--space-global-sm)]`

### Mobile (< 768px)

- Single column. Book cover stacks above text, centred.
- Cover: `max-w-[16rem] mx-auto mb-[var(--space-global-lg)]`. Slightly smaller on mobile but still prominent.
- Title: clamp handles sizing. Left-aligned text (not centred — Fraunces reads better left-aligned on narrow screens).
- CTA: `w-full sm:w-auto`.
- Supporting info line: same placement below button.

---

## Section 2 — What's inside

### Role
Describe the book. What the reader will find: real questions from real young people, handwritten on post-it notes, answered honestly. The post-it motif and the book's physical format are the selling points. This section bridges the emotional hook of the hero with the practical "who is this for?" of §3.

### Desktop (≥ 1200px)

**Outer wrapper.** `<section>` on `--bg-page` ground (no surface class).
- Tailwind: `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-prose)]`. The prose measure (44rem) is appropriate — this is descriptive text, not a grid.

**Contents:**

1. **Headline.** `<h2>` — `[COPY TBD]` (e.g. "What's inside the book").
   - Font: Fraunces. Size: `--text-display-size-h3` (clamps 1.5rem → 2rem). Weight: `--heading-ota-weight-h2` (700). Colour: `--text-ota-heading`.
   - Tailwind: `mb-[var(--space-global-md)]`

2. **Description.** 2–3 paragraphs of prose, class `.ota-prose`.
   - `[COPY TBD]` — describes the book's content: real anonymous questions from young people, written on post-it notes and scanned, each answered honestly by the Tailor Education team. The book covers relationships, sex, puberty, consent, identity, and more. The 210×210mm square format. The tone: warm, direct, respectful.
   - The `.ota-prose` class handles: Atkinson body, `--text-prose-size-body`, `--lh-prose` (1.7), paragraph spacing, link styling.
   - Tailwind on the prose wrapper: `mb-[var(--space-global-xl)]`

3. **Interior spread images (optional).** 2–3 photographs of book interior pages showing the post-it + answer layout. Source: `/images/book/interior-*.jpg` (see image requirements: "2–3 interior spread images showing post-it + answer layout").
   - These are the proof that the book is real and the content is high quality. A parent considering the purchase should be able to see the tone and the physical format.
   - Layout: a horizontal row on desktop, centred.
     - Tailwind: `flex flex-wrap justify-center gap-[var(--space-global-md)]`
   - Each image: `<img>` at `max-w-[16rem] w-full h-auto rounded-[var(--radius-sm)] shadow-[var(--shadow-md)]`.
     - Optional: slight individual rotation (±1°) for a "spread on a table" feel. Same treatment as the hero cover.
     - `alt` — describe the specific content visible (e.g. "Interior spread showing a post-it question about puberty with the written answer").
   - **Fallback.** If no interior images are available, omit this sub-section. The descriptive prose carries the section on its own.

### Mobile (< 768px)

- Prose: full-width within `--container-max-prose` (already responsive).
- Interior images: stack vertically. Each `max-w-[14rem] mx-auto`. Or show 2 side-by-side with `grid grid-cols-2 gap-[var(--space-global-sm)]` if they fit.

---

## Section 3 — Who it's for

### Role
The book serves multiple audiences and the page needs to say so explicitly. A parent, a PSHE lead, and a young person all need to see themselves reflected. This section uses short audience cards to address each one directly. The content spec identifies four use cases: parents (conversation starter at home), school staff rooms (a reference always on the shelf), conference/training tables (a credibility artefact), and young people themselves (a book that treats them with respect).

### Desktop (≥ 1200px)

**Outer wrapper.** `<section>` with `.surface--ota`.
- Tailwind: `surface--ota w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-reading-wide)]`.

**Section heading.** Centred above the cards.
- `<h2>` — `[COPY TBD]` (e.g. "Who is this book for?").
- Font: Fraunces. Size: `--text-display-size-h3`. Weight: `--heading-ota-weight-h2` (700). Colour: `--text-ota-heading`.
- Tailwind: `text-center mb-[var(--space-global-xl)]`

**Audience card grid.** Four cards in a 2×2 grid on desktop.
- Tailwind: `grid grid-cols-1 sm:grid-cols-2 gap-[var(--space-global-md)]`

**Audience card.** Each card is an informational block, not a clickable link. Transparent background with a subtle border — the warm surface behind provides the visual warmth.

- Tailwind: `flex flex-col p-[var(--space-global-lg)] rounded-[var(--radius-lg)] border-[var(--border-width-xs)] border-[var(--border-subtle)]`
- Background: `transparent` — the `.surface--ota` warm paper shows through. A background colour would create unnecessary visual weight on four small cards.

- **Inner structure:**
  1. **Audience label.** `<h3>` — e.g. "For parents and carers", "For school staff rooms", "For conferences and training", "For young people".
     - Font: Fraunces. Size: `--text-card-size-h3` (clamps 1.15rem → 1.3rem). Weight: `--heading-ota-weight-h3` (600). Colour: `--text-ota-heading`.
     - Tailwind: `mb-[var(--space-global-xs)]`
  2. **Description.** `<p>` — `[COPY TBD]` (2–3 sentences describing this use case).
     - Size: `--text-card-size-body` (14px). Colour: `--text-ota-muted`. Line height: `--lh-body` (1.6).

### Mobile (< 768px)

- Grid: `grid-cols-1`. Cards stack.
- Same padding and structure.

---

## Section 4 — Purchase CTA

### Role
The primary conversion point. This section contains the price, the purchase button (Stripe payment link), and any supporting purchase information (delivery, format, returns). It's separated from the hero CTA to allow the intervening sections (what's inside, who it's for) to build the case. A reader who scrolled past the hero CTA without clicking has now seen the content, the audience fit, and arrives at the purchase moment informed.

The hero's CTA and this section's CTA link to the same destination (Stripe). The duplication is deliberate — the hero catches impulse buyers who arrive already convinced (e.g. from A17), while §4 catches considered buyers who needed more information.

### Desktop (≥ 1200px)

**Outer wrapper.** `<section>` on `--bg-ota-book-panel`.
- Tailwind: `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
- Background: `bg-[var(--bg-ota-book-panel)]` (#eae6e1). This is the deepest warm surface on the page — the purchase moment gets the most enveloping warmth.

**Inner wrapper.** `mx-auto w-full max-w-[40rem] text-center`.

**Contents:**

1. **Headline.** `<h2>` — `[COPY TBD]` (e.g. "Get your copy").
   - Font: Fraunces. Size: `--text-display-size-h3` (clamps 1.5rem → 2rem). Weight: `--heading-ota-weight-h2` (700). Colour: `--text-ota-heading`.
   - Tailwind: `mb-[var(--space-global-sm)]`

2. **Price.** Displayed prominently.
   - `<p>` — `[PRICE TBD]` (e.g. "£14.99").
   - Font: Fraunces. Size: `--text-display-size-h2` (clamps 1.75rem → 2.75rem). Weight: `--heading-ota-weight-h2` (700). Colour: `--text-ota-heading`.
   - Tailwind: `mb-[var(--space-global-md)]`
   - The price is large because it reduces cognitive load — the reader shouldn't have to hunt for it. Displaying it in Fraunces at heading scale treats it as a confident statement, not small print.

3. **Purchase button.** The primary Stripe link.
   - `<a href="[STRIPE_PAYMENT_LINK]" class="btn btn--std btn--primary has-icon-hover">Buy the book</a>`
   - Use `btn--std` with upscaled padding via inline style or a `.btn--purchase` modifier (`padding: var(--space-global-md) var(--space-global-xl)`) to give the purchase button more visual weight than a standard button. Flag `btn--lg` as a new size variant for the design system if this pattern is needed elsewhere.
   - If the Stripe link is not yet live, swap for the pre-purchase state (see edge cases).

4. **Supporting info.** Below the button, quiet reassurance text.
   - `[COPY TBD]` — e.g. "Free UK delivery · Dispatched within 2 working days · 210×210mm square format · [X] pages".
   - Size: `--text-card-size-body`. Colour: `--text-ota-muted`. Weight: `--font-weight-regular`.
   - Tailwind: `mt-[var(--space-global-md)]`
   - Each item separated by a middle dot or pipe. Not a list — a single line of quiet facts.

### Pre-purchase state

If the book is not yet available for purchase:

- The price line is either omitted or replaced with `[COPY TBD]` (e.g. "Coming soon — £[PRICE]").
- The purchase button becomes: `<a class="btn btn--lg btn--primary has-icon-hover">Register your interest</a>` → links to an email capture form (inline `<form>` or link to an external form).
- Optionally: add a simple inline email input + submit button below the main CTA: `<form>` with `<input type="email" placeholder="Your email">` and `<button type="submit">Notify me</button>`. Styled with the existing form tokens.
- The supporting info line adjusts: "210×210mm square format · Publication date TBD".

### Mobile (< 768px)

- Same structure, centred text. Button: `w-full sm:w-auto`.
- Price stays prominent.

---

## Section 5 — Sample content

### Role
Let the visitor see the tone and quality of the book before buying. 2–3 example questions with post-it images and answer excerpts. Each links to the full question page on the site. This demonstrates the bridge between the book and the website — the book contains the same content, presented physically.

### Desktop (≥ 1200px)

**Outer wrapper.** `<section>` on `--bg-page` ground.
- Tailwind: `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-reading-wide)]`.

**Section heading.**
- `<h2>` — `[COPY TBD]` (e.g. "A taste of what's inside").
- Font: Fraunces. Size: `--text-display-size-h3`. Weight: `--heading-ota-weight-h2` (700). Colour: `--text-ota-heading`.
- Tailwind: `text-center mb-[var(--space-global-lg)]`

**Optional subline.**
- `<p>` — `[COPY TBD]` (e.g. "Every question in the book is answered on this site too. Here are a few to try.").
- Atkinson, `--text-display-size-body`, `--text-ota-muted`, `text-center max-w-[30rem] mx-auto mb-[var(--space-global-xl)]`.

**Sample question cards.** Two approaches, depending on how much of the answer should be visible:

**Option A — QuestionCard with excerpt.** Reuses `QuestionCard.astro` enhanced with an answer excerpt. This requires either:
- An `excerpt` prop on `QuestionCard` (recommended: add an optional `excerpt?: string` prop that renders below the title), or
- A wrapper that pairs the standard `QuestionCard` with an additional excerpt block.

If using the prop approach, each card shows:
- Post-it thumbnail (standard `QuestionCard` treatment)
- Category eyebrow
- Question title (Fraunces)
- **Answer excerpt** — 2–3 sentences from the answer. Atkinson, `--text-card-size-body`, `--text-ota-muted`, line height `--lh-body`. Truncated with ellipsis or "…" if needed.
- "Read the full answer →" link

**Option B — Expanded sample cards (B11-specific).** A bespoke card layout that shows more of the answer than a standard QuestionCard. Each card is a wider, more horizontal format:
- Tailwind per card: `flex flex-col md:flex-row gap-[var(--space-global-lg)] p-[var(--space-global-lg)] rounded-[var(--radius-lg)] border-[var(--border-width-xs)] border-[var(--border-subtle)] bg-[var(--bg-surface)]`
- Left: post-it image at `w-[8rem] shrink-0`, rotated, multiply blending — the same treatment as `QuestionCard`'s `.qcard__img`.
- Right: category eyebrow + question title (Fraunces, `--text-card-size-h2`) + answer excerpt (Atkinson, `--text-prose-size-body`, 3–4 sentences) + "Read the full answer →" link.

**Recommendation:** Option B. The book page is the one place where showing more of the answer makes the sale. A standard QuestionCard is built for browse-and-click; the B11 sample cards are built for "look at the quality of this." The horizontal format also breaks the visual rhythm from the 2×2 audience cards above, which prevents the page from feeling like a repeating grid.

- Card grid: `flex flex-col gap-[var(--space-global-lg)]` — stack the 2–3 cards vertically.
- Cards are curated editorially — specific question slugs chosen to represent a spread of categories and tones.

**"See all questions" link.** Below the sample cards, centred.
- Tailwind: `flex justify-center mt-[var(--space-global-xl)]`
- `<a href="/questions/" class="btn btn--std btn--outline has-icon-hover">Browse all 152 questions</a>`

### Mobile (< 768px)

- Sample cards: `flex-col` on each card (post-it above, text below). Post-it `max-w-[6rem] mx-auto`.
- "Browse all questions" button: `w-full sm:w-auto`.

---

## Section 6 — Trust signal

### Role
A closing credibility beat. This could be a testimonial, an authorship statement ("Written by the Tailor Education team"), or framework alignment badges. The content spec says "could be a testimonial, or the framework alignment badges, or 'Written by the Tailor Education team.'" — the implementation should support any of these, with a testimonial as the primary recommendation.

### Desktop (≥ 1200px)

**Outer wrapper.** `<section>` with `.surface--ota-alt`.
- Tailwind: `surface--ota-alt w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-prose)] text-center`.

**Contents (testimonial variant — recommended):**

1. **Pull quote.** `<blockquote>` — `[COPY TBD]` (a quote about the book from a parent, teacher, or reviewer).
   - Font: Fraunces. Size: `--text-display-size-quote` (clamps 1.25rem → 1.75rem). Weight: `--font-weight-regular`. Line height: `--lh-heading-sub` (1.3). Colour: `--text-ota-heading`. Font-style: italic.
   - Tailwind: `mb-[var(--space-global-md)]`

2. **Attribution.** `<cite>` — `[COPY TBD]` (name, role).
   - Font: Atkinson. Size: `--text-card-size-body`. Weight: `--font-weight-medium`. Colour: `--text-ota-muted`. Font-style: normal.

**Contents (authorship variant — fallback):**

If no testimonial is available:

1. **Statement.** `<p>` — "Written and produced by the Tailor Education team. Based on real anonymous questions from young people."
   - Font: Atkinson. Size: `--text-prose-size-body`. Colour: `--text-ota-muted`. Line height: `--lh-body`.

2. **Link.** `<a href="/about" class="link-action mt-[var(--space-global-md)] inline-flex">About Tailor Education</a>`.

### Mobile (< 768px)

- Same structure. Quote: clamp handles sizing. Text stays centred.

---

## New CSS needed for B11

Add to `tailor-site-v2.css`:

```css
/* ── Book page sample card (B11 §5) ── */
.b11-sample-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-global-lg);
    padding: var(--space-global-lg);
    border-radius: var(--radius-lg);
    border: var(--border-width-xs) solid var(--border-subtle);
    background: var(--bg-surface);
    transition:
        transform var(--transition-duration) var(--transition-easing),
        box-shadow var(--transition-duration) var(--transition-easing);
}

@media (min-width: 768px) {
    .b11-sample-card {
        flex-direction: row;
    }
}

.b11-sample-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.b11-sample-card__postit {
    flex-shrink: 0;
    width: 8rem;
    display: flex;
    align-items: flex-start;
    justify-content: center;
}

.b11-sample-card__postit img {
    max-width: 100%;
    height: auto;
    transform: rotate(var(--postit-rotation, -1.5deg));
    border-radius: var(--radius-sm);
    mix-blend-mode: multiply;
}

.b11-sample-card__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-global-xs);
}

.b11-sample-card__category {
    font-family: var(--font-ota-body-stack);
    font-size: var(--text-util-preheader-size, 0.75rem);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    letter-spacing: var(--card-eyebrow-ls, 0.08em);
}

.b11-sample-card__title {
    font-family: var(--font-ota-heading-stack);
    font-size: var(--text-card-size-h2);
    font-weight: var(--heading-ota-weight-h2);
    line-height: var(--lh-heading-sub);
    color: var(--text-ota-heading);
}

.b11-sample-card__excerpt {
    font-family: var(--font-ota-body-stack);
    font-size: var(--text-prose-size-body);
    color: var(--text-ota-muted);
    line-height: var(--lh-body);
    margin-top: var(--space-global-xs);
}

.b11-sample-card__link {
    display: inline-block;
    margin-top: var(--space-global-sm);
    font-family: var(--font-ota-body-stack);
    font-size: var(--text-card-size-body);
    font-weight: var(--font-weight-bold);
    color: var(--link-action-color);
}

.b11-sample-card__link::after {
    content: ' \2192';
}
```

---

## Component specifications

### Reused components

- **`QuestionCard.astro`** — §5 sample content uses the QuestionCard's visual language (post-it treatment, category eyebrow, Fraunces title) but in an expanded horizontal format via `.b11-sample-card`. The post-it image treatment (rotation, multiply blending, desaturation) should match the QuestionCard exactly.

### B11-specific patterns (not componentised)

- **Sample card** (§5). The `.b11-sample-card` is a B11-only layout. If this horizontal question-with-excerpt pattern is needed elsewhere, extract to a component. For now, template-level markup.
- **Purchase CTA section** (§4). The price display and Stripe button are specific to B11. If other products are sold in the future, extract the purchase pattern.

### Components NOT on B11

- **`SimpleModeToggle.astro`** — not present. B11 is a product page, not a content page with reading-level variants.
- **`SignpostingBlock.astro`** — not present. The book page is not a content page with sensitive material requiring support signposting.
- **`EndOfAnswerPanel.astro`** — not present. B11 is the *destination* of Panel 1; it doesn't display the triptych itself.
- **`TopicsOverviewGrid.astro`** — not present. The book page is OtA-layer; the topics grid is Tailor-layer.
- **`GlossaryTooltips`** — not present. No long-form prose requiring tooltip definitions.

---

## Accessibility notes

1. **Heading hierarchy.** `<h1>` is in §1 (book title). §2 through §6 each have an `<h2>`. §3's audience cards use `<h3>`. §5's sample cards do not have separate headings — the question title is a `<div>` (consistent with QuestionCard's pattern), and the card links to the full question page.

2. **Purchase button.** The Stripe link opens a new page (Stripe's hosted checkout). The button should include `target="_blank" rel="noopener"` if the payment link navigates away from the site, and `aria-label="Buy the Okay to Ask book — opens Stripe checkout"`.

3. **Image alt text.** The book cover image needs specific descriptive alt text. The interior spread images need alt text describing the visible content. Post-it images in sample cards use the same empty `alt=""` as QuestionCard (the question title carries the meaning). The OtA wordmark uses `alt="Okay to Ask"`.

4. **Price accessibility.** The price in §4 should be inside a semantically appropriate element — either a `<p>` with `aria-label="Price: £[X]"` or a `<data value="[X]">£[X]</data>` element.

5. **Focus rings.** All sections use `--focus-ring` (default teal). No dark surfaces on B11 (no `.surface--dark`), so `--focus-ring-on-dark` is not needed.

6. **Skip link.** The shell's existing skip-to-main link (`#main`) targets `<main>`, which wraps all six sections.

---

## Edge cases

**No book cover image.** §1 renders with text-only content. The grid falls back to a single centred column: `max-w-[32rem] mx-auto text-center`. The title, pitch, and CTA carry the section. A placeholder is acceptable during development (a `<div>` with `--surface-ota-postit-soft` background, 1:1 aspect ratio, `--book-cover-max-width`, dashed border in `--surface-ota-postit`).

**No interior spread images (§2).** The descriptive prose carries the section alone. No placeholder needed.

**No sample questions selected (§5).** §5 is omitted entirely. The page flows from §4 (purchase CTA) to §6 (trust signal). The purchase section is strong enough to close on its own.

**No testimonial available (§6).** Falls back to the authorship variant: "Written and produced by the Tailor Education team" + link to the about page.

**Book not yet for sale (§4 pre-purchase).** The purchase button becomes "Register your interest." The price line is replaced with "Coming soon." An optional inline email form appears. The hero's CTA (§1) also switches to the pre-purchase state. Both CTAs must stay in sync — do not show "Buy the book" in the hero and "Register interest" in §4.

**Stripe payment link changes.** The Stripe URL is a configuration value, not hardcoded. It should be sourced from a site-level config (e.g. `site.config.ts` or environment variable) so it can be updated without touching the template.

**Very long book title.** The `<h1>` in §1 is constrained by the grid column width on desktop and by the viewport on mobile. The display ramp clamp handles sizing. If the title exceeds two lines on desktop, the two-column layout still works — the text column simply grows taller, and `items-center` on the grid vertically centres the cover against the taller text block.

---

## Design decisions log

**Why is the cover image left-aligned, not centred?** On a two-column layout, the book cover sits left because the eye lands there first in LTR reading. The cover is the visual hook; the text is the sales pitch. This mirrors how physical books are displayed: cover facing you, description beside it. Centring the cover above the text (as on mobile) works for a vertical scroll, but on desktop the side-by-side layout is more confident and less "product listing."

**Why a separate purchase CTA section (§4) when the hero already has a buy button?** The hero catches impulse buyers — someone who clicked "Get the book" from a question page and is already convinced. §4 catches considered buyers who scrolled through "what's inside" and "who it's for" before deciding. Dual CTAs at different points in the scroll is standard for product pages. They link to the same Stripe destination.

**Why expanded sample cards instead of standard QuestionCards?** The standard QuestionCard is designed for browsing — small, quick, grid-friendly. On B11, the sample cards need to show the quality of the *answers*, not just the questions. The horizontal format with a 3–4 sentence excerpt gives the reader enough to judge tone, sensitivity, and depth. This is the one place where "show, don't tell" applies to the answer content.

**Why `.surface--ota` for §3 (who it's for) instead of a neutral surface?** The audience cards describe personal, emotional use cases — a parent wanting to talk to their child, a young person finding answers. The warm paper surface matches the emotional register. A white or neutral surface would make these cards feel like a corporate "target market" section rather than an empathetic "this is for you."

**Why the book panel surface for §4?** `--bg-ota-book-panel` (#eae6e1) is already associated with the book across B1 and B8. Using it for the purchase section creates visual continuity — the reader who saw the book promotion panel on another page recognises this warm tone as "the book's surface." It also makes §4 feel enveloping and warm at the moment of purchase, which matters for a product that's sold on emotional connection, not utility.
