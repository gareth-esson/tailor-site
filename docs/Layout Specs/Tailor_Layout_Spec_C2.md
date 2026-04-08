# Tailor Layout Spec — C2 Glossary page

*Layout specification for the glossary term page template (C2) at `/glossary/{slug}`. There are ~80–100 instances of this page. It is a reference page — quieter and more direct than C1.*

*Mood: dictionary entry, not editorial. Clean, purposeful, helpful. "Here's what this means." The definition is the hero — no post-it image, no crisis support, no age flag. The page should feel like looking something up and getting a clear answer.*

*This is an Okay to Ask page. `<main>` carries `.layer-ota`. Typography inside `<main>` is Atkinson Hyperlegible (body) and Fraunces (headings). The shell (header, footer) remains in Lexend per the shell spec and is not re-specified here.*

**Version:** 1.0
**Date:** 2026-04-07

---

## Reference documents

- `Tailor_Page_Content_Spec_v1.md` — C2 section (content structure)
- `Tailor_Layout_Spec_C1.md` — C1 question page (sibling page, shared components, established patterns)
- `Tailor_Layout_Spec_B8.md` — B8 /questions/ landing (shared OtA patterns)
- `Tailor_Layout_Spec_Shell.md` — header, footer, nav

---

## Tokens and conventions this spec depends on

All visual values resolve to tokens in `tailor-site-v2.css`. All layout structure uses Tailwind utility classes. The shell spec established the Tailwind/tokens boundary; C2 follows it unchanged.

### Tokens referenced on this page (all existing)

| Purpose | Token | Current value |
|---|---|---|
| OtA body font | `--font-ota-body-stack` | Atkinson Hyperlegible |
| OtA heading font | `--font-ota-heading-stack` | Fraunces |
| OtA text colour | `--text-ota-body` → `--text-body` | #1E2A3A |
| OtA heading colour | `--text-ota-heading` → `--text-heading` | #1E2A3A |
| OtA muted text | `--text-ota-muted` | #5B6675 |
| OtA page surface | `--bg-ota-surface` (via `.surface--ota`) | #F7F5F0 |
| OtA alt band | `--bg-ota-surface-alt` (via `.surface--ota-alt`) | #F0EDE5 |
| White surface | `--bg-surface` | #FFFFFF |
| Page ground | `--bg-page` | #FAFAF7 |
| Structural x-inset | `--space-struct-x` | clamp(1rem, 5vw, 15vw) |
| Struct y-hero gap | `--space-struct-y-hero` | clamp(6rem, 8vw + 3rem, 10rem) |
| Struct y-base gap | `--space-struct-y-base` | clamp(4rem, 5vw + 2rem, 6rem) |
| Mode toggle tokens | `--toggle-mode-*` | existing |
| Card tokens | `--card-*` | existing |
| Badge OtA | `--ota-cat-*`, `.badge--ota-*` | existing |
| Prose type ramp | `--text-prose-size-*` | existing |
| Display type ramp | `--text-display-size-*` | existing |
| Heading weights (OtA) | `--heading-ota-weight-*` | existing |
| Safeguarding support | `--safeguarding-support-*` | existing |
| Link action | `--link-action-*` | existing |
| Topic tag gap | `--topic-tag-gap` | `--space-global-xs` |
| OtA contextual link | `--link-ota-contextual` | `--brand-accent-text` |
| Tooltip tokens | `--tooltip-*` | existing |
| Glossary underline | `--glossary-underline`, `--glossary-underline-offset` | existing |
| Shadow md | `--shadow-md` | existing |
| Radius lg | `--radius-lg` | 16px |
| Border subtle | `--border-subtle` | #e5e4de |

### Tokens flagged for addition

1. **`--glossary-card-accent: var(--brand-accent);`** — accent colour for the top border on glossary term cards. Defaults to brand-accent but can be overridden per-card via inline style for category colours.

2. **Glossary term card tokens.** The related glossary term card (A15 glossary variant) is a new component. It needs minimal new tokens because it reuses the card system:
   ```css
   --glossary-card-bg: var(--bg-surface);
   --glossary-card-border: var(--border-width-xs) solid var(--border-subtle);
   --glossary-card-radius: var(--radius-md);
   --glossary-card-padding: var(--space-global-md);
   --glossary-card-shadow: var(--shadow-xs);
   --glossary-card-shadow-hover: var(--shadow-sm);
   ```
   Place after the existing `--card-*` block in `:root`. These are deliberately lighter than the main card system (xs shadow instead of sm, md radius instead of lg) — the glossary card is smaller and quieter than a question card.

### Base-value changes

None. No existing token values need changing for C2.

---

## Design decisions

### No "book page" panel on C2

C1 wraps its hero + answer in a `.c1-content-panel` — a contained white panel with `--shadow-md` and `--radius-lg` that lifts off the page ground. This "book page" metaphor works for C1 because the post-it image, question heading, and long answer form a coherent, immersive reading experience that benefits from containment.

C2 does not use this pattern. Reasons:

1. **Scale mismatch.** Many glossary terms have short explainers (1–2 paragraphs). A lifted panel around a heading, a two-sentence definition, and a short paragraph of explanation would feel like an oversized frame around a small picture. The panel metaphor works when there's enough content to fill it.

2. **Reference vs. reading.** The panel on C1 says "settle in and read." C2 is a lookup — you arrive, get the definition, maybe read the explainer, and move on. The warm `.surface--ota` ground is enough to say "you're in OtA territory" without the additional containment.

3. **Simpler surface rhythm.** C2 uses `.surface--ota` for the heading/definition/explainer, then drops to `--bg-page` for the related content sections, then shifts to `.surface--ota-alt` or `--safeguarding-support-bg` for the exit. This is the same three-band rhythm as C1's post-panel sections, just without the panel in the middle.

The result: C2's primary content sits directly on the warm paper surface, feeling integrated and calm rather than lifted and dramatic. This is the right register for a reference page.

### Toggle placement

On C1, the toggle sits in a control bar between the content panel's hero section and the answer, with a bottom border separating it from the prose. On C2, there is no such structural divide — the definition and explainer flow together as "the content."

The toggle sits **between the definition and the explainer**. This placement is natural because:

- The reader arrives, sees the heading, reads the definition (which is short and always visible in both modes — it's the "hero" of the page).
- The toggle sits below the definition, inviting the reader to choose a reading level before diving into the longer explainer.
- It marks the transition from "quick answer" (definition) to "full explanation" (explainer) — a natural affordance break.

The toggle does **not** stick on C2. C1's sticky toggle is justified because the answer can be very long (10+ paragraphs) and the reader may want to switch mid-read. C2's explainers are shorter — the toggle is never far from view.

### Visual personality without visual noise

C2 gets its character from three sources: (1) Fraunces at display scale on the term heading — the typeface itself is the visual interest; (2) the italic Fraunces definition, which reads like a dictionary entry and creates typographic contrast against the Atkinson explainer prose; (3) category colour accents on the related term cards, connecting the page to the broader OtA colour world. None of these add UI weight — they're all typographic or chromatic, not structural. The page stays clean and direct while feeling like it belongs in the OtA layer rather than a generic documentation site.

---

## Layer scoping

```html
<body>
  <header>…shell…</header>

  <main id="main" class="layer-ota">
    <!-- C2 content sections go here -->
  </main>

  <footer>…shell…</footer>
</body>
```

Same as C1 and B8. `.layer-ota` activates Atkinson + Fraunces and OtA text colours. Individual sections add surface classes where needed.

---

## Page structure in one picture

```
┌──────────────────────────────────── <header> (shell)
│
├─ <main id="main" class="layer-ota">       ← sits on --bg-page ground
│     ├─ §1  Term heading + definition  [surface--ota, full bleed, 44rem prose]
│     │       ├─ h1 (term name)
│     │       └─ Definition block
│     ├─ §2  Toggle + explainer         [surface--ota, full bleed, 44rem prose]
│     │       ├─ Simple Mode toggle (A6)
│     │       ├─ Explainer body (.ota-prose) with glossary tooltips (A7)
│     │       └─ [FUTURE] Diagram placeholder
│     ├─ §3  Related glossary terms     [page ground, 56rem inner]
│     ├─ §4  Questions referencing term [page ground, 56rem inner]
│     ├─ §5  Signposting (A8)          [CONDITIONAL, safeguarding-support-bg, 56rem]
│     ├─ §6  CTA + topic tags          [surface--ota-alt, 56rem inner]
│
└──────────────────────────────────── <footer> (shell)
```

**Surface rhythm.** Four bands with three surfaces, simpler than C1:

1. **§1–§2** — `.surface--ota` (`--bg-ota-surface`, warm paper). The term heading, definition, and explainer all sit on the same warm ground. This is the "you looked something up" zone. No panel, no elevation — just content on paper.
2. **§3–§4** — `--bg-page` ground, no surface class. The cards and links provide their own visual structure. The step from warm paper to the slightly cooler page ground marks the transition from "the definition" to "where else this connects."
3. **§5** — `--safeguarding-support-bg` (cool blue). Same treatment as C1 §5. Conditional — only shown if the term's topic warrants signposting.
4. **§6** — `.surface--ota-alt` (`--bg-ota-surface-alt`, deeper warm). The exit band with CTA and topic tags.

### Vertical rhythm

- §1 top padding: `--space-struct-y-hero`. The term heading is the first content after the header; it needs generous air.
- §1 bottom padding: `--space-global-xl` (3rem). The definition ends, and the explainer follows closely — they're part of the same thought.
- §2 top padding: `0` — §1 and §2 share the same `.surface--ota` band. They are separated semantically (as `<section>` elements for accessibility) but visually they flow together within one continuous warm surface. The top of §2 butts up against the bottom of §1.
- §2 bottom padding: `--space-struct-y-base`.
- §3–§4: `py-[var(--space-struct-y-base)]` each.
- §5 (when present): same as C1 — `pt-[var(--space-global-2xl)] pb-[var(--space-struct-y-base)]`.
- §6: `py-[var(--space-struct-y-base)]`.
- Horizontal insets: every section uses `px-[var(--space-global-gutter)]` on the outer wrapper. §1–§2 inner wrappers use `max-w-[var(--container-max-prose)] mx-auto`. §3–§6 inner wrappers use `max-w-[var(--container-max-reading-wide)] mx-auto`.

**Implementation note on the §1–§2 shared surface:** Because §1 and §2 share `.surface--ota` and should render as one continuous warm band, wrap them in a single `<div class="surface--ota w-full">` with combined padding: `pt-[var(--space-struct-y-hero)] pb-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`. Inside, §1 and §2 are separate `<section>` elements for landmark/heading structure. §1 carries `pb-[var(--space-global-xl)]`; §2 carries `pt-0`.

---

## Section 1 — Term heading + definition

### Role
The entry point. The term heading is the page title; the definition answers the question "what does this mean?" at a glance. Together they are the hero of the page — no image, no post-it, just the word and its meaning.

### Desktop (≥ 1200px)

**Outer wrapper.** Part of the shared `.surface--ota` band (see implementation note above). No separate outer section needed — §1 is the first `<section>` inside the shared wrapper.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-prose)]`.

**Layout.** A single centred column containing:

1. **The term heading.** The glossary term as an `<h1>`, centred.
   - Tailwind: `text-center mb-[var(--space-global-lg)]`
   - Font family: inherited from `.layer-ota` (Fraunces).
   - Size: `--text-display-size-h1` (clamps 2.25rem → 3.75rem). The term name is the only visual anchor on the page — where C1 has the post-it image, C2 has the word itself. Fraunces at display scale with optical sizing and WONK axes active is the visual moment. Pulling this down would leave the page without a hero.
   - Weight: `--heading-ota-weight-h1` (700).
   - Line height: `--lh-heading` (1.2).
   - Colour: `--text-ota-heading`.
   - `font-variation-settings: 'opsz' var(--font-ota-heading-opsz), 'WONK' var(--font-ota-heading-wonk)` — inherited from `.layer-ota h1` rule.
   - No max-width clamp needed — glossary terms are short (1–5 words), and the prose measure (44rem) already constrains the column.

2. **The definition block.** The definition is rendered as large italic Fraunces text — a dictionary-style primary definition, not a callout box. No container, no border, no background. The typography is the treatment.

   - HTML: `<p class="c2-definition">` (no wrapping div needed).
   - **Typography:**
     - Font family: `var(--font-ota-heading-stack)` (Fraunces).
     - Size: `--text-display-size-h4`.
     - Weight: `--font-weight-regular` (400).
     - Style: `font-style: italic`.
     - `font-variation-settings: 'opsz' var(--font-ota-heading-opsz), 'WONK' var(--font-ota-heading-wonk)`.
     - Line height: `--lh-heading-sub` (1.3).
     - Colour: `--text-ota-heading`.
     - Text align: `center`.
     - Max width: `max-w-[36rem] mx-auto`.
   - **Simple mode.** In Simple mode, the Short Definition is replaced by the Simple Definition in this same block. The styling and position are identical — only the text swaps. Both definitions exist in the DOM:
     ```html
     <p class="c2-definition" data-mode="standard">…</p>
     <p class="c2-definition" data-mode="simple" hidden>…</p>
     ```
     The `hidden` attribute toggles based on `.simple-active` on `<html>`, consistent with C1's mode-switching pattern.

3. **Decorative divider.** `<hr class="c2-divider" />` — a thin centred rule as visual punctuation between the definition and what follows.
   - Width: `3rem`.
   - `border-top: var(--border-width-sm) solid var(--brand-accent)`.
   - `opacity: 0.4`.
   - A 48px-wide teal hairline at 40% opacity, giving the eye a resting point.

### Mobile (< 768px)

- Term heading size steps down via the display ramp clamp. No override needed.
- Definition: same typographic treatment at all breakpoints. The `--text-display-size-h4` clamp handles the scaling.
- Decorative divider: same treatment, no responsive override needed.

---

## Section 2 — Toggle + explainer

### Role
The Simple Mode toggle sits between the definition and the explainer, marking the transition from "quick answer" to "full explanation." The explainer is long-form prose from Notion, rendered with `.ota-prose` and decorated with glossary tooltips (A7).

### Desktop (≥ 1200px)

**Outer wrapper.** The second `<section>` inside the shared `.surface--ota` band. No separate surface class needed.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-prose)]`.

**Layout.**

1. **Simple Mode toggle (A6).** Same `SimpleModeToggle.astro` component as C1.
   - Tailwind wrapper: `flex items-center justify-end gap-[var(--space-global-md)] mb-[var(--space-global-lg)] pt-[var(--space-global-lg)] pb-[var(--space-global-md)] border-b-[var(--border-width-xs)] border-[var(--border-subtle)]`
   - The top padding (`pt-[var(--space-global-lg)]`) creates breathing room between the definition block above and the toggle. The bottom border separates the toggle from the prose — same pattern as C1 §4.
   - **No sticky behaviour.** C2 explainers are shorter than C1 answers; the toggle stays in normal flow.
   - No "Reading level" label — just the "Simplify" switch, right-aligned, exactly as implemented on C1.
   - All `--toggle-mode-*` tokens apply unchanged.

2. **Explainer body (Standard view).** A `<div class="ota-prose" data-mode="standard">` containing the rendered Notion content.
   - All `.ota-prose` rules from `tailor-site-v2.css` apply: `--text-prose-size-body` for paragraphs, `--lh-prose` (1.7) line height, `--space-global-md` paragraph spacing, Fraunces subheadings at `--text-prose-size-h2`/`h3`, list styling, blockquote styling, figure styling.
   - **Inline glossary tooltips (A7).** Same `GlossaryTooltips.astro` component and `--tooltip-*` / `--glossary-underline` tokens as C1. Build-time exclusion: the current term is not tooltipped on its own glossary page (already in place).
   - Max width: constrained by `--container-max-prose` on the section wrapper.
   - Text colour: inherits `--text-ota-body`.

3. **Explainer body (Simple view).** A `<div class="ota-prose" data-mode="simple" hidden>` sibling. Identical structural rules. `hidden` toggles based on `.simple-active`. Same pattern as C1.

4. **[FUTURE] Diagram placeholder.** For terms that will eventually have an illustration:
   - A `<figure>` element inside the prose, below the explainer text, in both modes.
   - Tailwind: `mt-[var(--space-global-xl)] mb-[var(--space-global-md)]`
   - Placeholder: a dashed-border box at `aspect-ratio: 16/9`, `border: var(--border-width-sm) dashed var(--border-subtle)`, `border-radius: var(--radius-md)`, with centred muted text "Illustration coming soon" at `--text-card-size-body` in `--text-ota-muted`. This is a build-time placeholder — it will not render in production unless a `diagram` field is present on the Notion record. When the diagram is available, it replaces this placeholder as a standard `.ota-prose figure img`.
   - Shows in both standard and simple modes.

### Mobile (< 768px)

- Toggle row: same layout, no change. `justify-end` keeps the switch right-aligned.
- Prose column: fills viewport minus gutter. `.ota-prose` sizes step down via clamp.
- Glossary tooltips: render as bottom sheet on mobile, same as C1 §4 mobile spec.
- Diagram placeholder: same aspect ratio, same dashed border. It scales naturally via `max-width: 100%`.

---

## Section 3 — Related glossary terms (A15, glossary variant)

### Role
Links to 2–6 related terms from the self-relation. Each card shows the term name and its short definition (or simple definition in Simple mode). This is a glossary-to-glossary navigation — simpler and quieter than question cards.

### Desktop (≥ 1200px)

**Outer wrapper.** A `<section>` on `--bg-page` ground (no surface class).
- Tailwind: `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
- Background: inherits `--bg-page` from `<body>`.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-reading-wide)]`.

**Section heading.**
- `<h2>` text: "Related terms"
- Tailwind: `text-center mb-[var(--space-global-lg)]`
- Size: `--text-prose-size-h2`
- Font: Fraunces (inherited from `.layer-ota`)
- Weight: `--heading-ota-weight-h2` (700)
- Colour: `--text-ota-heading`

**Glossary term card grid.** A responsive grid of term cards.
- Tailwind: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--space-global-md)]`
- If there are ≤2 terms, the grid still uses the same column spec — cards simply don't fill the row, and that's fine. The grid aligns left.

**Glossary term card** (new component: `GlossaryTermCard`). Each card is a clickable link to `/glossary/{slug}`.

- Outer: `<a href="/glossary/{term_slug}" class="glossary-term-card no-underline block">`.
- Visual:
  ```
  background: var(--glossary-card-bg)           /* --bg-surface, white */
  border: var(--glossary-card-border)            /* 1px solid --border-subtle */
  border-top: 3px solid var(--glossary-card-accent, var(--brand-accent))
  border-radius: var(--glossary-card-radius)     /* --radius-md, 12px */
  padding: var(--glossary-card-padding)          /* --space-global-md, 1.5rem */
  box-shadow: var(--glossary-card-shadow)        /* --shadow-xs */
  ```
  Tailwind: `transition-all`
- **Category colour accent.** Each card's top border colour can be set per-card via an inline style: `style="--glossary-card-accent: var(--ota-cat-{category}-accent)"`. This connects each related term to its category colour from the OtA colour system. If no category colour is available, the card falls back to `var(--brand-accent)` (teal). The per-card inline style pattern keeps the colour logic in the template rather than generating CSS classes for every category.
- Hover: `box-shadow: var(--glossary-card-shadow-hover)` (upgrades from xs to sm), `transform: translateY(-1px)`. Subtle — this is a reference card, not a hero card.
- Focus: `outline: var(--focus-ring-width) solid var(--focus-ring); outline-offset: var(--focus-ring-offset); border-radius: var(--glossary-card-radius);`

- **Inner structure** (flex column, gap `--space-global-xs`):
  1. **Term name.** `<div class="glossary-term-card__term">`.
     - Font: Fraunces (inherited from `.layer-ota` heading rules, but since this is a `<div>`, not an `<h*>`, explicitly set `font-family: var(--font-ota-heading-stack)`).
     - Size: `--text-card-size-h4` (clamps 1.05rem → 1.15rem).
     - Weight: `--font-weight-semibold` (600).
     - Line height: `--lh-card` (1.4).
     - Colour: `--text-ota-heading`.
  2. **Short definition.** `<div class="glossary-term-card__def">`.
     - Font: Atkinson (inherited from `.layer-ota`).
     - Size: `--text-card-size-body` (14px).
     - Line height: `--lh-body` (1.6).
     - Colour: `--text-ota-muted`.
     - Display: show 2 lines max, then truncate with `display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;`. The full definition is on the destination page; the card only needs a preview.
     - **Simple mode.** In Simple mode, the short definition is replaced by the simple definition. Both exist in the DOM:
       ```html
       <div class="glossary-term-card__def" data-mode="standard">…</div>
       <div class="glossary-term-card__def" data-mode="simple" hidden>…</div>
       ```
  3. **Action hint.** `<span class="glossary-term-card__link">` — "Read more →".
     - Same styling as `.card__link`: `--text-card-size-body`, weight `--font-weight-bold` (700), colour `--link-action-color`, arrow via `::after` content `→`. Gap `--link-action-gap`.
     - Tailwind: `mt-auto pt-[var(--space-global-xs)]` — pushes to the bottom if cards are different heights.

### Mobile (< 768px)

- Grid becomes `grid-cols-1`. Cards stack.
- Card padding stays at `--glossary-card-padding`. At narrow widths, this (1.5rem) is comfortable.
- 2-line clamp on the definition remains — prevents tall cards on mobile.

### Conditional rendering

If `terms.length === 0`, the entire section is omitted (no heading, no empty grid). This is already the pattern in `RelatedTerms.astro`.

---

## Section 4 — Questions that reference this term (A15, question variant)

### Role
Links to question pages that use this glossary term in their answer text (from the "Referenced In" reverse relation). Reuses `QuestionCard.astro` — the same card component from C1 §6 and B8 §3.

### Desktop (≥ 1200px)

**Outer wrapper.** A `<section>` on `--bg-page` ground (no surface class).
- Tailwind: `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-reading-wide)]`.

**Section heading.**
- `<h2>` text: "Questions about this"
- Tailwind: `text-center mb-[var(--space-global-lg)]`
- Size: `--text-prose-size-h2`
- Font: Fraunces, weight `--heading-ota-weight-h2`, colour `--text-ota-heading`

**Card grid.** Same grid as C1 §6:
- Tailwind: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--space-global-md)]`
- Cards rendered by `QuestionCard.astro` — post-it image, category eyebrow, question title, content tags, "Read the answer" link. All component styling is owned by the component; no page-level overrides.
- Maximum 6 cards shown. If more exist, show the first 6 (sorted by relevance or recency — build-time decision) and omit the rest. No "show more" UI for v1. Six cards fill two rows of three on desktop, which is the right visual density for a reference page — it shouldn't feel like a browsing destination.

### Mobile (< 768px)

- Grid becomes `grid-cols-1`. Cards stack.
- All 6 cards shown (no truncation).
- Card component handles its own responsive behaviour.

### Conditional rendering

If no questions reference this term, the entire section is omitted. Show the section only if at least one question card can be rendered.

---

## Section 5 — Signposting block (A8) [CONDITIONAL]

### Role
Support services relevant to the term's topic. Same `SignpostingBlock.astro` component as C1 §5. Present only if the term's primary topic warrants signposting (determined at build time via topic metadata).

### Desktop (≥ 1200px)

**Outer wrapper.** A `<section>` with `--safeguarding-support-bg` as the background.
- Tailwind: `w-full pt-[var(--space-global-2xl)] pb-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
- Background: `background-color: var(--safeguarding-support-bg)` via inline style or utility.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-reading-wide)]`.

**Component.** `<SignpostingBlock services={relevantServices} />` — renders the "Need to talk to someone?" heading and the `.alert--support` service grid exactly as implemented for C1. No overrides, no modifications.

### Mobile (< 768px)

Same as C1 §5 mobile. Services grid collapses from 2-col to 1-col.

### Conditional rendering

If the term's topic doesn't warrant signposting (no services mapped), the section is omitted entirely — no heading, no empty alert.

---

## Section 6 — CTA + topic tags

### Role
The exit band. A single CTA linking to the parent topic landing page, plus topic tag pills for wayfinding. This replaces C1's three-panel A17 triptych — C2 is a reference page, and a single "go deeper" action is the right weight. The reader has looked something up; the natural next step is "explore this topic."

### Desktop (≥ 1200px)

**Outer wrapper.** A `<section>` with `.surface--ota-alt`:
- Tailwind: `surface--ota-alt w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-reading-wide)]`.

**Layout.** A centred column with three elements stacked:

1. **CTA heading + link.** A centred block inviting the reader to explore the parent topic.
   - Tailwind on wrapper: `text-center mb-[var(--space-global-xl)]`
   - `<h2>` text: "Explore [topic name]"
     - Size: `--text-prose-size-h3` (clamps 1.25rem → 1.5rem). One step smaller than the section headings in §3/§4 — this is a call to action, not a content heading.
     - Font: Fraunces, weight `--heading-ota-weight-h3` (600), colour `--text-ota-heading`.
     - Tailwind: `mb-[var(--space-global-md)]`
   - Below the heading, a single button-styled link:
     - `<a href="/topics/{primary_landing_page_slug}" class="btn btn--outline btn--std has-icon-hover">` with text "See everything on [topic name]".
     - The `.btn.btn--outline.btn--std.has-icon-hover` classes handle all styling: outline border, standard sizing, and the arrow hover animation. No additional Tailwind needed beyond the classes themselves.

2. **Topic tags (A16).** Same `TopicTags.astro` component as C1.
   - Outer wrapper: `<div>` with Tailwind `pt-[var(--space-global-lg)] border-t-[var(--border-width-xs)] border-[var(--border-subtle)]`.
   - The top border separates the CTA from the tags — a light horizontal rule that says "this is metadata, not content."
   - The component renders:
     - Label: "This term is part of" (modified from C1's "This question is part of" — the component should accept a `label` prop or the label should be passed as a slot). Size `--text-util-preheader-size`, uppercase, letter-spacing `--text-util-preheader-ls`, colour `--text-ota-muted`, weight `--font-weight-semibold`.
     - Tag pills: `.badge.badge--pill.badge--ota-{category}` linking to `/topics/{slug}`. Gap: `--topic-tag-gap`.

3. **Edge case: no topic.** If the term has no mapped landing page (unlikely but possible), omit the CTA heading and link. The topic tags section still renders if a topic exists. If neither CTA target nor topic exists, omit §6 entirely.

### Mobile (< 768px)

- All elements stack and centre naturally.
- The `.btn.btn--outline` CTA wraps naturally if the topic name is long.
- Tag pills wrap via `flex-wrap` in the component.

---

## Component specifications

### New: `.c2-definition` (Definition block)

Add to `tailor-site-v2.css` alongside the `.ota-prose` rules:

```css
/* ── Glossary Definition Block (C2) ── */
.c2-definition {
    font-family: var(--font-ota-heading-stack);
    font-size: var(--text-display-size-h4);
    font-weight: var(--font-weight-regular);
    font-style: italic;
    font-variation-settings: 'opsz' var(--font-ota-heading-opsz), 'WONK' var(--font-ota-heading-wonk);
    line-height: var(--lh-heading-sub);
    color: var(--text-ota-heading);
    text-align: center;
    margin: 0;
}

.c2-divider {
    width: 3rem;
    border: none;
    border-top: var(--border-width-sm) solid var(--brand-accent);
    opacity: 0.4;
}
```

### New: `.glossary-term-card` (Related term card)

Add to `tailor-site-v2.css` after the card component block:

```css
/* ── Glossary Term Card (A15 glossary variant) ── */
.glossary-term-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-global-xs);
    background: var(--glossary-card-bg);
    border: var(--glossary-card-border);
    border-top: 3px solid var(--glossary-card-accent, var(--brand-accent));
    border-radius: var(--glossary-card-radius);
    padding: var(--glossary-card-padding);
    box-shadow: var(--glossary-card-shadow);
    text-decoration: none;
    color: inherit;
    transition:
        box-shadow var(--transition-duration) var(--transition-easing),
        transform var(--transition-duration) var(--transition-easing);
}

.glossary-term-card:hover {
    box-shadow: var(--glossary-card-shadow-hover);
    transform: translateY(-1px);
}

.glossary-term-card:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring);
    outline-offset: var(--focus-ring-offset);
    border-radius: var(--glossary-card-radius);
}

.glossary-term-card__term {
    font-family: var(--font-ota-heading-stack);
    font-size: var(--text-card-size-h4);
    font-weight: var(--font-weight-semibold);
    line-height: var(--lh-card);
    color: var(--text-ota-heading);
    font-variation-settings: 'opsz' var(--font-ota-heading-opsz), 'WONK' var(--font-ota-heading-wonk);
}

.glossary-term-card__def {
    font-size: var(--text-card-size-body);
    line-height: var(--lh-body);
    color: var(--text-ota-muted);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.glossary-term-card__link {
    font-size: var(--text-card-size-body);
    font-weight: var(--font-weight-bold);
    color: var(--link-action-color);
    display: inline-flex;
    align-items: center;
    gap: var(--link-action-gap);
    margin-top: auto;
    padding-top: var(--space-global-xs);
    transition: color var(--transition-duration) var(--transition-easing);
}

.glossary-term-card__link::after {
    content: "\2192" / "";
    display: inline-block;
    transition: transform var(--transition-duration) var(--transition-easing);
}

.glossary-term-card:hover .glossary-term-card__link {
    color: var(--link-action-color-hover);
}

.glossary-term-card:hover .glossary-term-card__link::after {
    transform: translateX(var(--link-action-arrow-nudge));
}
```

### Reused: `SimpleModeToggle.astro`

No changes. Same component, same tokens. The only difference from C1 is the wrapper Tailwind — no sticky behaviour, and the wrapper sits between the definition and the explainer rather than at the top of the answer.

### Reused: `GlossaryTooltips.astro`

No changes. Same component, same `--tooltip-*` tokens, same `--glossary-underline` trigger styling. Build-time exclusion of the current term is already implemented.

### Reused: `SignpostingBlock.astro`

No changes. Same component, same props interface (`services: string[]`). Page template passes the relevant services array.

### Reused: `QuestionCard.astro`

No changes. Same component, same styling. All card-level decisions (post-it image, category eyebrow, content tags, hover interaction) are owned by the component.

### Reused: `TopicTags.astro`

Minor modification needed: the label text should be configurable. Currently hardcoded to "This question is part of". For C2, it should read "This term is part of". Options:

1. **Preferred:** Add a `label` prop with a default of "This question is part of". C2 passes `label="This term is part of"`.
2. **Alternative:** Use a slot for the label text.

The visual styling remains unchanged.

---

## Accessibility notes

1. **Heading hierarchy.** `<h1>` is the term name (§1). All section headings are `<h2>` (§3, §4, §5 via SignpostingBlock, §6). The explainer prose may contain `<h2>`/`<h3>` from Notion — these should be demoted to `<h3>`/`<h4>` at render time to maintain valid hierarchy. Flag this for the Notion renderer.

2. **Simple Mode toggle.** `role="switch"` with `aria-checked`. Consistent with C1.

3. **Definition block.** No special ARIA needed — it's a `<p>`. The visual distinction is typographic (italic Fraunces), not semantic. Screen readers will read the definition as normal paragraph text following the h1, which is the correct reading order.

4. **Glossary term cards.** Each card is an `<a>` wrapping the term name, definition preview, and "Read more" text. Screen reader announcement: link text should be the term name. Add `aria-label="{term name} — {short definition}"` on the `<a>` for richer context. The "Read more →" text inside the card is decorative for sighted users; `aria-hidden="true"` on the `.glossary-term-card__link` span prevents duplicate announcements.

5. **Landmark structure.** Each `<section>` should have an `aria-labelledby` pointing to its heading's `id`.

6. **Conditional sections.** When §3, §4, §5, or §6 are omitted due to empty data, no empty landmarks are rendered.

---

## Short-term / long-term edge cases

**Very short terms.** ~30% of glossary terms will have a definition and 1–2 paragraphs of explainer. The layout handles this well: the warm surface band (§1–§2) naturally contracts around short content, and the related content sections below provide visual ballast. The page will never feel "empty" because:
- The definition in italic Fraunces always has visual weight.
- The toggle row provides a structural beat even for short content.
- §3 (related terms) and §4 (referencing questions) fill the page below the explainer.

**Very long terms.** ~10% of terms will have detailed multi-paragraph explainers with subheadings. The `.ota-prose` styling handles this identically to C1's answer body — heading hierarchy, list styling, blockquotes all work within the 44rem prose column. The only difference from C1: no sticky toggle. For terms long enough to warrant a sticky toggle (>10 paragraphs), revisit in v2.

**No related terms.** §3 is omitted. §4 may still have referencing questions.

**No referencing questions.** §4 is omitted. §3 may still have related terms.

**Neither related terms nor referencing questions.** Both §3 and §4 are omitted. The page flows directly from the `.surface--ota` explainer band to the exit band (§5 if present, otherwise §6). This is visually fine — the warm paper stops, the exit begins.

**No topic landing page.** §6 omits the CTA heading and link but still renders topic tags if a topic category exists. If neither exists, §6 is omitted and the page ends at the last rendered section before the footer.
