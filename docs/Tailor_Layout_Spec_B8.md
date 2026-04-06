# B8 — Okay to Ask landing page layout spec

**Page:** `/questions/`
**Template:** `src/pages/questions/index.astro`
**Layer:** `.layer-ota` on `<main>` — Atkinson + Fraunces, OtA text colours, warm surfaces.
**Role:** The front door for young people. Browse all 152 questions. Discover the book. Feel held.

**Version:** 1.1
**Date:** 2026-04-06

---

## Reference documents

- `Tailor_Page_Content_Spec_v1.md` — B8 section (content structure)
- `Tailor_Art_Direction_Brief_v1.md` — OtA layer mood, post-it motif, category colour system, B1 homepage sequence
- `Tailor_Design_System_Implementation_Notes.md` — token vocabulary, surface classes
- `Tailor_Layout_Spec_C1.md` — C1 question page (sibling page, shared components)
- `Tailor_Layout_Spec_Shell.md` — header, footer, nav

---

## Design intent

This page must feel like Okay to Ask *immediately*. Not Tailor-with-a-warm-filter — genuinely its own thing. The post-it motif, warm surfaces, candid typography, and category colours are the levers. The art direction brief says the mood is "you can ask this here." The page should feel like opening a box of real questions — not browsing a clinical FAQ database.

The key tension: 152 questions is a lot of content. The page must be browseable, scannable, and fast without losing the warmth and personality. The spec addresses this by using the same `QuestionCard` component as C1 and the tag archive pages — keeping visual language consistent across the OtA layer — with client-side category filtering and pagination (12 cards per page) to keep each view manageable.

---

## Shared components from C1

These components are reused from the C1 question page:

- **`QuestionCard.astro`** — Used for the main question grid on B8. All 152 questions render as cards, paginated to keep each page light. The same component used on C1's related questions and tag archive grids.
- **`SignpostingBlock.astro`** — reused in §6 for the general support services block. Currently B8 has a hardcoded signposting section; this should be replaced with the component.
- **`GlossaryTooltips.astro`** — included for any glossary-tagged terms in the "What is OtA?" prose.

---

## Layer scoping

```html
<body>
  <header>…shell…</header>

  <main id="main" class="layer-ota">
    <!-- B8 content sections go here -->
  </main>

  <footer>…shell…</footer>
</body>
```

Same as C1. `.layer-ota` activates Atkinson + Fraunces and OtA text colours. Individual sections add surface classes where needed.

---

## Page structure in one picture

```
┌──────────────────────────────────── <header> (shell)
│
├─ <main id="main" class="layer-ota">       ← sits on --bg-page ground
│     ├─ §1  Hero                     [surface--ota, full bleed, centred]
│     ├─ §2  Book promotion           [page ground, contained panel, 56rem]
│     ├─ §3  Category filter + cards   [surface--ota, full bleed, 56rem inner]
│     │       ├─ Category filter bar
│     │       ├─ Question card grid (QuestionCard, paginated, filterable)
│     │       ├─ Result count
│     │       └─ Pagination controls
│     ├─ §4  What is Okay to Ask?     [surface--ota-alt, full bleed, 44rem prose]
│     ├─ §5  Signposting (A8)         [safeguarding-support-bg, full bleed, 56rem]
│
└──────────────────────────────────── <footer> (shell)
```

**Surface rhythm.** Five bands with three distinct surfaces:

1. **§1** (hero) — `.surface--ota` (`--bg-ota-surface`, warm paper). The hero introduces the OtA world; warm paper is the right starting surface.
2. **§2** (book promotion) — sits on `--bg-page` ground. A contained white panel (`--bg-surface`, `--shadow-md`, `--radius-lg`) lifts off the ground, echoing C1's "book page" content panel. The book promotion is literally *about* a book — the panel metaphor is apt.
3. **§3** (question browsing) — `.surface--ota` (warm paper). This is the core of the page; the warm paper grounds the reading experience.
4. **§4** (about section) — `.surface--ota-alt` (`--bg-ota-surface-alt`, deeper warm). The surface shift signals a different kind of content — explanatory prose rather than browsable questions.
5. **§5** (signposting) — `--safeguarding-support-bg` (cool blue). Same treatment as C1 §5 — the cool break signals support information.

### Vertical rhythm

- Each section uses `py-[var(--space-struct-y-base)]` as the default vertical padding, except:
  - §1 (hero) uses `py-[var(--space-global-2xl)]` for generous hero air.
  - §2 (book panel) uses `margin-top/bottom: var(--space-global-lg)` on the panel container.
- Horizontal insets: every section uses `px-[var(--space-global-gutter)]` on the outer wrapper and `max-w-[var(--container-max-reading-wide)] mx-auto` on the inner wrapper. §4 narrows to `max-w-[var(--container-max-prose)]` for the prose measure.

---

## Section 1 — Hero

### Role
The emotional entrance. Establishes this as Okay to Ask territory — warm, candid, inviting. The post-it motif should be present but not dominant; the headline does the heavy lifting.

### Desktop

**Outer wrapper.** Full-bleed `.surface--ota` section.
- Tailwind: `w-full py-[var(--space-global-2xl)] px-[var(--space-global-gutter)]`
- `.surface--ota` class on the `<section>`.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-reading-wide)] text-center`.

**Contents (in order):**

1. **OtA wordmark.** `<img>` of the Okay to Ask wordmark SVG (`/assets/ota-wordmark-dark.svg`).
   - Width: `auto`, height: `3rem`. Centred via the text-center on the parent.
   - Tailwind: `mx-auto mb-[var(--space-global-md)]`
   - `alt="Okay to Ask"`.

2. **Headline.** `<h1>` — "Real questions from real young people. Answered honestly."
   - Font: Fraunces (inherited from `.layer-ota`), display ramp.
   - Size: `--text-display-size-h1`, weight `--heading-ota-weight-h1`, colour `--text-ota-heading`, line-height 1.15.
   - Tailwind: `mb-[var(--space-global-sm)]`

3. **Subtitle.** `<p>` — "Every question here was written anonymously by a young person. No judgement, no awkwardness — just honest answers."
   - Size: `--text-prose-size-body`, colour `--text-ota-muted`, line-height 1.6.
   - Max width: `32rem`, centred via `mx-auto`.

4. **Post-it scatter (optional enhancement).** 3–5 post-it thumbnail images arranged in a loose row below the subtitle, each slightly rotated via `--postit-rotation` with per-image variation (e.g. –2°, 1°, –1.5°, 2.5°). These are a visual sample of real questions, not navigation — purely atmospheric. `mix-blend-mode: multiply`, `filter: saturate(0.85)` matching the `QuestionCard` treatment. Images selected randomly at build time from the full question set.
   - This is an enhancement, not a blocker. If build complexity is high, defer to v2.
   - If implemented: Tailwind `flex justify-center gap-[var(--space-global-md)] mt-[var(--space-global-lg)]`, each image `w-[6rem] h-auto`.

### Mobile

- Headline size steps down via the display ramp clamp.
- Subtitle max-width becomes `100%` (fills the column at narrow widths).
- Post-it scatter (if present): reduce to 3 images, smaller (`w-[4rem]`), or hide entirely at `< 640px`.

---

## Section 2 — Book promotion

### Role
Hero-level visibility for the Okay to Ask book. Not a sidebar ad — this is a significant content block. The book is the physical embodiment of the project and deserves prominent placement on its front page.

### Desktop

**Outer wrapper.** No surface class — sits on the `--bg-page` ground between §1 and §3.
- Tailwind: `w-full px-[var(--space-global-gutter)]`

**Inner wrapper / panel.** A contained white panel, echoing C1's "book page" metaphor.
- Tailwind: `mx-auto w-full max-w-[var(--container-max-reading-wide)]`
- Scoped class `.b8-book-panel`:
  ```css
  .b8-book-panel {
    background: var(--bg-surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    padding: var(--space-global-xl);
    margin-top: var(--space-global-lg);
    margin-bottom: var(--space-global-lg);
  }
  ```

**Panel layout.** Two-column grid on desktop: text/CTA left, book cover image right.
- Tailwind on the grid: `grid grid-cols-1 md:grid-cols-[1fr_auto] gap-[var(--space-global-lg)] items-center`
- Left column: heading, pitch, CTA button.
- Right column: book cover image (or placeholder until asset is ready).

**Left column contents:**

1. **Heading.** `<h2>` — "The Okay to Ask book"
   - Fraunces, `--text-prose-size-h2`, `--heading-ota-weight-h2`, `--text-ota-heading`.
   - Tailwind: `text-center md:text-left mb-[var(--space-global-xs)]`
   - Note: centred on mobile (single column), left-aligned on desktop where it sits beside the cover image. This is the one heading that breaks the centred pattern — justified by the two-column layout.

2. **Pitch.** `<p>` — "Real questions, honest answers, post-it notes and all. The physical book for your home, school, or staff room."
   - `--text-prose-size-body`, `--text-ota-body`, line-height 1.6.
   - Tailwind: `mb-[var(--space-global-md)]`

3. **CTA button.** `<a href="/book" class="btn btn--std btn--primary">Get the book</a>`
   - Standard primary button from the design system. No overrides needed.
   - Note: the `/book` page currently shows a "register interest" form, not Stripe. The CTA text stays "Get the book" regardless — the destination page handles conversion state.

**Right column:**

- Book cover `<img>` when the asset is available. Fallback: a placeholder `<div>` with `--surface-ota-postit-soft` background, dashed `--surface-ota-postit` border, 3:4 aspect ratio, `max-width: 12rem`.
- Image: `border-radius: var(--radius-sm)`, `box-shadow: var(--shadow-sm)` for a slight lift.

### Mobile

- Grid collapses to single column: cover image moves above the text content (visual first, then CTA).
- At mobile, `flex-direction: column-reverse` or reorder via grid `order` so the cover image appears first — it's the visual hook.
- Panel padding reduces to `var(--space-global-lg)`.

---

## Section 3 — Category filter + question card grid

### Role
The core of the page. 152 questions, filterable by 7 OtA categories, displayed as `QuestionCard` cards in a paginated grid. Must feel warm, browseable, and fast despite the volume.

### Design decision: cards with pagination

All 152 questions use the same `QuestionCard.astro` component as C1's related questions and the tag archive pages — one card component across the whole OtA layer. Pagination keeps each view to a manageable page of cards (12 per page default), so initial page weight stays reasonable and the user isn't confronted with 152 cards at once. Category filtering works with pagination: when a filter is active, only matching cards are counted and paginated.

### Desktop

**Outer wrapper.** Full-bleed `.surface--ota`.
- Tailwind: `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-reading-wide)]`.

**Section heading.** `<h2>` — "Browse questions"
- Fraunces, `--text-prose-size-h2`, `--heading-ota-weight-h2`, `--text-ota-heading`.
- Tailwind: `text-center mb-[var(--space-global-md)]`

#### Category filter bar (D9 — new component)

A horizontal row of filter buttons. Each button represents one of the 7 OtA categories, plus an "All" button.

**Container:**
- Tailwind: `flex flex-wrap justify-center gap-[var(--space-global-xs)] mb-[var(--space-global-lg)]`
- `role="group"` with `aria-label="Filter by category"`.

**"All" button:**
- `<button class="btn btn--sm btn--tint" data-category="all">All</button>`
- Uses the generic tint button style (not a category badge). This is the default active state on page load.

**Category buttons:**
- Each: `<button class="badge badge--pill badge--ota-{token}" data-category="{name}">{name}</button>`
- Uses the existing `.badge--ota-*` classes which provide the correct category-coloured backgrounds, text, and border.
- The badge classes already have `cursor: pointer` set up for interactive use (they're `<button>` elements here, not `<span>`).

**Active state:**
- The active filter gets `.is-active` class.
- Styling for `.is-active`: `opacity: 1`.
- Inactive filters: `opacity: 0.55` — dimmed but still readable, so the reader can see all available categories.
- Use `outline: var(--focus-ring-width) solid var(--focus-ring); outline-offset: var(--focus-ring-offset);` on the active button as the selected indicator. This reuses the global focus-ring tokens rather than inventing a custom indicator.
- Transition: `opacity var(--transition-duration) var(--transition-easing)`.

**Keyboard / accessibility:**
- Each button is a native `<button>` — no ARIA role override needed.
- Tab through all buttons normally.
- `aria-pressed="true"` on the active filter, `aria-pressed="false"` on others. JS toggles this.

#### Question card grid

A paginated grid of `QuestionCard.astro` cards, filtered client-side by the active category.

**Container:**
- `<ul role="list">` — Tailwind: `list-none p-0 m-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--space-global-md)]`
- Same grid as `RelatedQuestions.astro` — 1 → 2 → 3 columns.

**Each item:**
- `<li data-category="{okayToAskCategory}">` — the `data-category` attribute is what the JS filter reads.
- Renders `<QuestionCard question={q} />` inside the `<li>`.
- Cards size to their own content height (no `h-full` stretching), matching C1's treatment.

**Pagination controls:**

Below the card grid. Only shown when the filtered set exceeds 12 items.

- **Container:** Tailwind: `flex justify-center items-center gap-[var(--space-global-sm)] mt-[var(--space-global-lg)]`
- **Page size:** 12 cards per page (fills a 3-col grid with 4 rows — clean and scannable).
- **Previous / Next buttons:** `<button class="btn btn--sm btn--tint">` — "Previous" and "Next". Disabled (with `opacity: 0.4; pointer-events: none;`) when at first/last page.
- **Page indicator:** `<span>` between the buttons — "Page 1 of 13" (or whatever the count is for the active filter). `--text-card-size-body`, `--text-ota-muted`.
- **Behaviour:** JS swaps which cards are visible by toggling `display: none` on `<li>` items outside the current page window. No page reload, no URL change.
- **Filter + pagination interaction:** When a category filter is activated, the pagination resets to page 1 and recalculates total pages based on the filtered count. The result count updates accordingly.
- **Scroll on page change:** When the user clicks Previous/Next, the viewport scrolls to the top of §3 (the section heading) so they see the new page of cards from the top.

**Result count:**
- `<p aria-live="polite">` below the pagination — "{n} questions" text (total for the active filter, not per page).
- `--text-card-size-body`, `--text-ota-muted`.
- Updates dynamically when the filter changes (JS).

#### Client-side filter + pagination (JS)

When a category button is clicked:
1. Toggle `.is-active` on the clicked button, remove from all others.
2. Toggle `aria-pressed` accordingly.
3. Build the filtered set: all `<li>` items matching `data-category` (or all items for "all").
4. Reset to page 1.
5. Show only items 1–12 of the filtered set; hide the rest.
6. Update pagination controls (page count, disabled state on prev/next).
7. Update the result count `<p>`.

When a pagination button is clicked:
1. Advance/retreat the page index.
2. Show/hide cards for the new page window.
3. Update the page indicator text.
4. Update prev/next disabled states.
5. Smooth-scroll to the §3 heading.

No page reload. No URL change. All client-side.

### Mobile

- Filter bar wraps to multiple rows via `flex-wrap`. Buttons stay the same size.
- Card grid collapses: 1 column on mobile, 2 on `sm:`. Cards stack naturally.
- Pagination controls remain centred and usable at all widths — the buttons are large enough for tap targets.

---

## Section 4 — What is Okay to Ask?

### Role
Brief explanatory prose about the project's origin. This is context for adults and curious young people — where the questions come from, who answers them, why it exists.

### Desktop

**Outer wrapper.** Full-bleed `.surface--ota-alt` (deeper warm paper — signals different content type).
- Tailwind: `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-prose)]` — the 44rem prose measure. This is explanatory text, not a browsing interface, so it narrows to the reading column.

**Heading.** `<h2>` — "What is Okay to Ask?"
- Fraunces, `--text-prose-size-h2`, `--heading-ota-weight-h2`, `--text-ota-heading`.
- Tailwind: `text-center mb-[var(--space-global-sm)]`

**Body text.** 2–3 paragraphs of prose.
- `--text-prose-size-body`, `--text-ota-body`, line-height 1.7, `max-width: 40rem`.
- Content (from existing implementation):
  - "Okay to Ask started with anonymous question boxes in schools. Young people wrote down whatever they wanted to know about relationships, sex, their bodies, and growing up. No names, no judgement. We collected those questions and answered every single one honestly."
  - "This is a Tailor Education project. The same team that delivers RSE in schools wrote every answer on this site."

### Mobile

- Prose column fills the viewport minus the gutter. No change needed.
- Heading size steps down via clamp.

---

## Section 5 — Signposting (A8)

### Role
A general safety net — not question-specific (unlike C1, where signposting is tied to the current answer's topic). Always present on B8 because any young person browsing questions might need support.

### Desktop

**Outer wrapper.** Full-bleed section with `background: var(--safeguarding-support-bg)` — the cool blue, matching C1 §5's treatment.
- Tailwind: `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
- `style="background: var(--safeguarding-support-bg);"`

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-reading-wide)]`.

**Component.** Reuse `SignpostingBlock.astro` with a general set of services (Childline, Brook, The Mix). The component expects a `services` prop — an array of service keys from the `SUPPORT_SERVICES` registry. B8 passes a fixed general set:
```astro
<SignpostingBlock services={['childline', 'brook', 'the-mix']} />
```

This replaces the current hardcoded signposting HTML in B8 with the shared component, ensuring the heading style, service layout, and link treatment are consistent with C1.

### Mobile

- Same as C1's signposting section — services list collapses to single column automatically.

---

## Tokens required

All tokens used in this spec already exist in `tailor-site-v2.css`. No new tokens needed.

Surface classes used: `.surface--ota`, `.surface--ota-alt`. The book panel and signposting section use inline background values (`--bg-surface`, `--safeguarding-support-bg`) rather than surface classes.

Category colour tokens used: `--ota-cat-anatomy` through `--ota-cat-contraception`, plus `-soft`, `-h`, `-s`, `-l` variants via `.badge--ota-*` classes.

---

## Accessibility notes

- Category filter: each `<button>` has `aria-pressed` toggled by JS. The containing `<div>` has `role="group"` and `aria-label="Filter by category"`.
- Question list: `<ul role="list">` with semantic `<li>` items. Each question is an `<a>` link.
- Result count: `<p aria-live="polite">` announces the count change to screen readers when the filter updates.
- Signposting: `role="complementary"` with `aria-labelledby` on the section, matching C1's treatment.
- Book promotion: the cover image gets descriptive `alt` text ("The Okay to Ask book cover"). The CTA button is a standard `<a>` link.
- `<main id="main">` is the skip-link target from the shell.

---

## Contradictions and notes for C1 spec

**Resolved:**

1. **`RelatedQuestions.astro` heading alignment.** The component uses `text-align: center` — this is correct. Centred headings are the OtA house pattern. The C1 spec has been updated to match (v1.4 → v1.5).

**Still outstanding:**

2. **C1 template §6 comment.** The comment block above §6 in `[...slug].astro` (lines 276–279) still references "Topic tags (A16)" and ".surface--ota band" — both removed. This is stale and should be cleaned up.

---

## Build checklist

1. Replace the hardcoded signposting in B8 with `<SignpostingBlock services={['childline', 'brook', 'the-mix']} />`.
2. Verify the service keys ('childline', 'brook', 'the-mix') exist in `SUPPORT_SERVICES`. If not, add them.
3. Apply surface classes and the signposting background as specified.
4. Use `max-w-[var(--container-max-reading-wide)]` instead of `max-w-4xl` — they resolve to the same value (56rem) but the token is the canonical source.
5. Replace hardcoded `gap: 0.5rem`, `gap: 0.375rem`, `padding: 0.75rem 1rem` in the scoped styles with token equivalents.
6. Add `aria-pressed` to the filter buttons (currently missing from the existing implementation).
7. Book promotion: convert the current `max-w-4xl` container to the white panel treatment specified above.
8. Post-it scatter in §1: defer to v2 unless straightforward.
9. Replace compact question rows with `QuestionCard.astro` card grid (3-col, same grid as RelatedQuestions).
10. Implement client-side pagination (12 cards per page) with Previous/Next buttons and page indicator.
11. Wire pagination to the category filter: filter change → reset to page 1 → recalculate page count.
12. Add scroll-to-top-of-section behaviour on page change.
13. Centre all section `<h2>` headings (except §2 book panel heading which is left-aligned in the two-column layout on desktop).
