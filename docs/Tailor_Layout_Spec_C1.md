# Tailor Layout Spec — C1 Question page

*Layout specification for the question page template (C1) at `/anonymous_question/{slug}`. There are ~152 instances of this page. It is the most complex template on the site and the emotional heart of the Okay to Ask layer.*

*Mood: intimate, uncluttered, kind, direct, safe, easy to scan, serious when needed. The right register is "quietly held." The page must avoid over-designed distractions — the answer is the work.*

*This is an Okay to Ask page. `<main>` carries `.layer-ota`. Typography inside `<main>` is Atkinson Hyperlegible (body) and Fraunces (headings). The shell (header, footer) remains in Lexend per the shell spec and is not re-specified here.*

---

## Tokens and conventions this spec depends on

All visual values resolve to tokens in `tailor-site-v2.css`. All layout structure uses Tailwind utility classes (grid, flex, gap, padding, max-width, responsive breakpoints, positioning). The shell spec established the Tailwind/tokens boundary; C1 follows it unchanged.

### Tokens newly referenced on this page

| Purpose | Token | Current value |
|---|---|---|
| OtA body font | `--font-ota-body-stack` | Atkinson Hyperlegible |
| OtA heading font | `--font-ota-heading-stack` | Fraunces |
| OtA text colour | `--text-ota-body` → `--text-body` | #1E2A3A |
| OtA heading colour | `--text-ota-heading` → `--text-heading` | #1E2A3A |
| OtA muted text | `--text-ota-muted` | #5B6675 |
| OtA page surface | `--bg-ota-surface` (via `.surface--ota`) | #F7F5F0 |
| OtA alt band | `--bg-ota-surface-alt` (via `.surface--ota-alt`) | #F0EDE5 |
| Post-it bright | `--surface-ota-postit` | #F5E58A |
| Post-it soft | `--surface-ota-postit-soft` | #FBF4C7 |
| OtA contextual link | `--link-ota-contextual` | `--brand-accent-text` |
| Structural x-inset | `--space-struct-x` | clamp(1rem, 5vw, 15vw) |
| Struct y-hero gap | `--space-struct-y-hero` | clamp(6rem, 8vw + 3rem, 10rem) |
| Struct y-base gap | `--space-struct-y-base` | clamp(4rem, 5vw + 2rem, 6rem) |
| Alert safeguarding | `.alert--crisis`, `.alert--ageflag`, `.alert--support` | — |
| Mode toggle tokens | `--toggle-mode-*` | existing |
| Card tokens | `--card-*` | existing |
| Badge OtA | `--ota-cat-*`, `.badge--ota-*` | existing |
| Prose type ramp | `--text-prose-size-*` | existing |
| Display type ramp | `--text-display-size-*` | existing |
| Heading weights (OtA) | `--heading-ota-weight-*` | existing |

### Tokens flagged for addition

These are used on C1 and should be added to `tailor-site-v2.css`. None of them can be reasonably expressed as Tailwind utilities because they are semantic/brand decisions, not layout.

1. **`--container-max-prose: 44rem`** — the long-form reading measure. Already flagged in the shell spec; C1 is the first page that actually uses it. Add under the spacing section alongside `--container-max-shell`.

2. **`--container-max-reading-wide: 56rem`** — used for the post-it + metadata band and the end-of-answer panel grid. Wider than the prose measure but narrower than the shell container. This gives sectioning rhythm without creating an extra structural decision per section.

3. **Post-it framing tokens.** The scanned post-it is the emotional centre. The CSS has the yellow tokens but nothing that describes how the post-it sits on the page:
   ```css
   --postit-rotation: -1.5deg;          /* subtle hand-placed tilt; never 0, never >3 */
   --postit-max-width: 22rem;           /* 352px — the capped width for the scanned artefact on desktop */
   --postit-shadow: 0 12px 28px rgba(27, 26, 23, 0.08),
                    0 4px 10px rgba(27, 26, 23, 0.06);
   ```
   `--postit-shadow` is retained as a named token for potential future use, but **is not consumed by `.postit-image` in the current build.** The drop shadow was removed during implementation — the scanned JPEG artefacts read more honestly without one. The shadow would impose a sharp rectangular boundary on what are organically shaped paper scans. The `mix-blend-mode: multiply` treatment (see §3) handles edge artefacts more elegantly than a shadow could mask them.

4. **Glossary tooltip tokens (A7).** The CSS currently has no tooltip. Add:
   ```css
   --tooltip-bg: var(--bg-surface);           /* white, even on .surface--ota, for maximum legibility */
   --tooltip-text: var(--text-body);
   --tooltip-border: var(--border-subtle);
   --tooltip-border-width: var(--border-width-xs);
   --tooltip-radius: var(--radius-md);
   --tooltip-shadow: var(--shadow-lg);
   --tooltip-padding-y: var(--space-global-sm);
   --tooltip-padding-x: var(--space-global-md);
   --tooltip-max-width: 20rem;
   --tooltip-arrow-size: 8px;
   /* Underline style for the trigger term */
   --glossary-underline: 2px dotted var(--link-ota-contextual);
   --glossary-underline-offset: 0.2em;
   ```
   This is a self-contained component subsystem. The tooltip surface is intentionally white (not `--bg-ota-surface`) so it visually lifts off the warm paper ground and reads as a layered overlay rather than a flattened section.

5. **Topic tag token (A16).** The existing `.badge--ota-*` pill variants are the right visual, but A16 needs a specifically-named semantic tag:
   ```css
   --topic-tag-gap: var(--space-global-xs);
   ```
   Everything else (background, border, colour) is already provided by `.badge.badge--pill.badge--ota-{category}`. Treat A16 as a composition of existing badge classes; the new token exists only to formalise the gap between chips in a tag row.

6. **End-of-answer panel surface tokens (A17).** The three panels need differentiated surfaces so each one reads as a distinct offer:
   ```css
   --panel-book-bg: var(--surface-ota-postit-soft);  /* Panel 1: book — post-it tint */
   --panel-topic-bg: var(--bg-surface);              /* Panel 2: teacher landing — crisp white */
   --panel-services-bg: var(--bg-emphasis);          /* Panel 3: school services — dark authority */
   --panel-radius: var(--radius-lg);                 /* 16px, warmer than card default */
   --panel-padding: var(--space-global-lg);
   ```
   This is the one place on the page where the surface hierarchy does a deliberate three-step shift — from warm paper to white to dark — which the art direction brief calls "a natural continuation of help, not a conversion block." Promoting these to tokens is what stops the panel from being re-invented on future edits.

### Base-value changes I am *not* recommending

Nothing. The existing OtA tokens, prose type ramp, and alert variants are correct for this page. The post-it tokens already exist at the right values. The only changes are additions, not mutations.

---

## Layer scoping

```html
<body>
  <header>…shell…</header>

  <main id="main" class="layer-ota">
    <!-- C1 content sections go here -->
  </main>

  <footer>…shell…</footer>
</body>
```

`.layer-ota` on `<main>` activates Atkinson + Fraunces and the OtA text colour. Individual sections within `<main>` add `.surface--ota` where they want the warm paper ground, or nothing where they want the page's own `--bg-page` to show through. The shell is untouched.

---

## Page structure in one picture

```
┌──────────────────────────────────── <header> (shell)
│
├─ <main id="main" class="layer-ota">       ← sits on --bg-page ground
│     ├─ §1  Crisis support (A9)      [CONDITIONAL, on page ground]
│     ├─ §2  Age flag (D1)            [CONDITIONAL, inside the same band as §1]
│     ├─ ┌─ .c1-content-panel ──────────────── --bg-surface, contained, shadow, radius
│     │  │  §3  Post-it + question meta  [56rem inner, centred]
│     │  │  §4  Reading level + answer   [44rem prose measure]
│     │  │       ├─ Simple Mode toggle (A6)
│     │  │       ├─ Answer body (standard or simple) with inline glossary tooltips (A7)
│     │  └──────────────────────────────────
│     ├─ §5  Signposting (A8)         [safeguarding-support-bg band, full bleed, 56rem inner]
│     ├─ §6  Related questions (A15)  [page ground, 56rem inner, card grid]
│     └─ §7  End-of-answer panel (A17)[surface--ota-alt band, 56rem inner, 3-col grid]
│
└──────────────────────────────────── <footer> (shell)
```

**Surface rhythm (v1.3).** The page uses a "book page" metaphor: the hero and answer sit on a contained white panel that lifts off the page ground, while the surrounding sections use full-bleed surface bands.

1. **§3–§4** share a contained `.c1-content-panel` with `--bg-surface` (#FFFFFF), `--shadow-md`, and `--radius-lg`. This is the "book page" — it reads as a physical object against the `--bg-page` ground (#FAFAF7). The panel is max-width `--container-max-reading-wide` (56rem) and centred with auto margins. The warm paper (`.surface--ota`) is removed from this wrapper; the white surface is the point.
2. **§5** (signposting) breaks to a full-bleed `--safeguarding-support-bg` (#EEF3F7) section background — a cool blue that signals "this is support information, not answer content."
3. **§6** (related questions) sits on the plain `--bg-page` ground with no surface band. The cards provide their own visual structure — they don't need a coloured band behind them. Content tags render as muted dot-separated text below each card title, linking to tag archive pages.
4. **§7** shifts to `.surface--ota-alt` (`--bg-ota-surface-alt`, #F0EDE5) — the deeper warm exit band.

The contrast between the white panel (§3–§4) and the page ground is what creates the book-page feeling. The panel has real depth via `--shadow-md` and real edges via `--radius-lg`. Below the panel, the page ground shows through for signposting and related questions before the deeper exit band.

Topic tags (A16) have been removed as a standalone section. Content tags now appear inline on each question card as muted text with dot dividers, linking to `/questions/tag/{slug}` archive pages. The ordering was changed during implementation — related questions follow signposting immediately, keeping the reader in OtA content before the exit triptych.

### Vertical rhythm

- The gap between §1 (crisis) and §3 (post-it) is `--space-struct-y-base` when §1 is present; when §1 is absent, §3 gets `--space-struct-y-hero` from the shell so the post-it sits with generous air.
- The gap between §3, §4, §5, §6, §7 is uniformly `--space-struct-y-base`. The only deviation is between §4 (answer) and §5 (signposting): use `--space-global-2xl` (5rem) rather than the full struct gap. The signposting block should feel *adjacent to* the answer, not quarantined in its own zone — that's a safeguarding decision, not a layout preference.
- Horizontal insets: every section uses `px-[var(--space-global-gutter)]` on the outer wrapper and `max-w-[var(--container-max-reading-wide)] mx-auto` on the inner wrapper, except §4 which narrows to `max-w-[var(--container-max-prose)] mx-auto` for the reading measure. The `.c1-content-panel` (§3–§4) handles its own horizontal padding.

---

## Section 1 — Crisis support (A9) [CONDITIONAL]

### Role
Appears only on questions whose topic is in Safety & Safeguarding or whose content sensitivity is "specialist" / "mandatory_reporting". When present, it is the first thing the reader sees inside `<main>`. It must be noticeable without being alarming; it must not be dismissable.

### Desktop (≥ 1024px)

**Outer wrapper.** A full-width section sitting immediately under the header.
- Tailwind: `w-full pt-[var(--space-global-xl)] pb-0 px-[var(--space-global-gutter)]`
- Background: inherits from `<main>` (no surface class on this wrapper). The crisis alert itself carries its own tinted surface, so no containing band is needed. The section's top padding pushes the alert down from the sticky header by `--space-global-xl` (3rem).

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-reading-wide)]` — the crisis alert sits within the same 56rem reading column as the rest of the answer-adjacent content, so the eye traces a single central column down the page.

**The component.** A single `.alert.alert--crisis` with no dismiss button.
- HTML structure is the standard alert pattern (`.alert__icon`, `.alert__content`, `.alert__title`, `.alert__body`). No `.alert__dismiss` — this is a hard safeguarding rule.
- Inside `.alert__body`, the primary crisis service appears as a line of contact info (service name in bold, phone number, link). A secondary service may follow on a new line.
- The alert tokens already ensure the surface (`--safeguarding-crisis-bg`), border (`--safeguarding-crisis-border`), text (`--safeguarding-crisis-text`), and icon colour (`--safeguarding-crisis-icon`) are calibrated correctly.
- Minor override via Tailwind: `p-[var(--space-global-lg)]` on the alert to upscale padding from the default `--alert-padding-y/x`. C1's crisis alert is bigger than a generic alert — it is the page's opening statement of care. The `--alert-padding-*` tokens serve generic UI use; C1 overrides the padding via utility, not via mutating the token, because other alerts on other pages should stay at default size.
- `--alert-title-size` → the title ("Need support right now?") sits at `--text-card-size-h6` by default. On C1 only, promote the title to `--text-prose-size-h5` via an inline style or a wrapper class `.alert--crisis-hero`. Add `.alert--crisis-hero` to `tailor-site-v2.css` as a C1-specific modifier:
  ```css
  .alert--crisis-hero .alert__title { font-size: var(--text-prose-size-h5); }
  ```

**Focus state on the phone/link inside the alert:** `outline: var(--focus-ring-width) solid var(--safeguarding-crisis-icon); outline-offset: var(--focus-ring-offset);` — the focus ring picks up the crisis accent colour so it is visible against the tinted surface. This deviates from the shell's `--focus-ring` default because the default teal would sit oddly inside a warm-red alert.

### Mobile (< 768px)

Same component, same wrapper, same tokens. The only difference: drop the padding override from `--space-global-lg` back to the alert defaults (`--alert-padding-y/x`) so the alert doesn't dominate the viewport. Inner wrapper width is automatic via `mx-auto w-full max-w-[…]`. Top padding on the outer wrapper drops from `--space-global-xl` to `--space-global-lg` to match the tighter mobile rhythm.

---

## Section 2 — Age flag interstitial (D1) [CONDITIONAL]

### Role
Appears only on questions with Age Tier = "Age-flagged Year 9+". Sits after the crisis alert (if present) and before the post-it. It is an honest signpost, not a gate. The reader can read on.

### Composition
- Component class: `.alert.alert--ageflag` — no dismiss button.
- Title: topic label + "This content is aimed at Year 9+" (the alert title slot).
- Body: short explanatory paragraph + inline link "Read a foundational answer first →" → Astro `<a>` to the earlier-year version of the content where one exists.
- Action: a single "Continue to the answer" button below the body, styled `.btn.btn--outline.btn--sm`. Tailwind on the button wrapper: `mt-[var(--space-global-sm)]`. The button scrolls the viewport to §3 (the post-it) with a smooth scroll and focus moves to the post-it's caption so screen readers continue naturally. This is a JS concern flagged for the build.
- Outer wrapper: same pattern as §1 — `w-full pt-[var(--space-global-lg)] px-[var(--space-global-gutter)]` with an inner `mx-auto max-w-[var(--container-max-reading-wide)]`.

### Stacking with §1
When both §1 (crisis) and §2 (age flag) are present, they sit as two stacked alerts in the same 56rem column with `gap-[var(--space-global-md)]` between them (`flex flex-col` on a combined wrapper). The crisis alert is always first.

### Mobile
Identical. The alert naturally stacks its body content vertically. No breakpoint-specific rules.

---

## Section 3 — Post-it image + question metadata

### Role
The emotional centre of the page. The scanned handwritten question is the primary visual, and it is what tells the reader *this is a real question from a real young person*. It must feel tactile and human, not polished into sterility.

### Desktop

**Outer wrapper.** `<section class="surface--ota w-full pt-[var(--space-struct-y-base)] pb-[var(--space-global-xl)] px-[var(--space-global-gutter)]">`. The `.surface--ota` class applies `--bg-ota-surface` (#F7F5F0). This is the first place on the page where the warm paper ground takes over; the visual temperature change is felt here.

When §1 and §2 are absent, the top padding bumps up to `--space-struct-y-hero` so the post-it sits with full hero air below the header.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-reading-wide)]`.

**Layout.** A single centred column containing, in order:

1. **Topic category chip** (A16 preview). A single `.badge.badge--pill.badge--ota-{category}` at the top of the column, Tailwind `mb-[var(--space-global-md)]`. Identifies the OtA category (Anatomy / Puberty / Relationships / Sex / Sexual Health / Sex & the Law / Contraception & Pregnancy). This is not a full A16 tag row — that sits at the bottom of the page. This is a single category chip that orients the reader before they see the question.

2. **The post-it image.** A figure containing `<img>` + `<figcaption>`.
   - Tailwind on the figure: `flex flex-col items-center mb-[var(--space-global-lg)]`.
   - `<img>` styling via a class `.postit-image`:
     ```css
     .postit-image {
       max-width: var(--postit-max-width);
       width: 100%;
       height: auto;
       transform: rotate(var(--postit-rotation));
       border-radius: var(--radius-sm);
       mix-blend-mode: multiply;
       background: var(--bg-surface); /* retained for structural completeness; moot under multiply blending */
     }
     ```
   - **No `box-shadow`.** The scanned JPEGs have natural white-trim edges from the photography. Rather than masking these with a drop shadow (which imposes a crisp rectangle on an organic shape), `mix-blend-mode: multiply` makes the white pixels invisible against the warm `.surface--ota` ground, letting the post-it float as if placed directly on paper. This is more honest to the scanned artefact than any shadow treatment.
   - The rotation is subtle (–1.5°). It is the single moment of tactile personality on the page and must not be overdone.
   - `<figcaption>` sits beneath the image at Tailwind `mt-[var(--space-global-sm)] text-center`, font `var(--text-ota-muted)`, size `--text-util-micro-size`, with the source attribution: "A real question from a young person, submitted anonymously."

3. **The question heading.** The question itself, as an `<h1>`, centred.
   - Tailwind: `text-center mt-[var(--space-global-lg)] mb-0`
   - Font family: inherited from `.layer-ota` (Fraunces).
   - Size: `--text-display-size-h1` via a utility class on the `<h1>`. The C1 question is a display moment — it should breathe. Use the display ramp, not the prose ramp.
   - Weight: `--heading-ota-weight-h1` (700).
   - Line height: 1.2 (not tokenised — add a site-wide `--heading-lh-display: 1.2` token if preferred, but the existing build lets headings set their own line-height; keep as a literal for now and flag for later consolidation).
   - Max inline size: the h1 may overflow 56rem on very long questions. Apply Tailwind `max-w-[38rem] mx-auto` to clamp the line length for readability.

### Mobile

- Post-it `max-width: 16rem` (override via `.postit-image` at `@media (max-width: 768px)` or via a utility class — recommend the media query inside the CSS because it's tied to the component, not the page).
- Post-it rotation stays at –1.5°; do not flatten on mobile.
- Question `<h1>` size steps down via the display ramp clamp, which is already responsive (`clamp(2.25rem, 1.75rem + 2.5vw, 3.75rem)`). No override needed.
- Top padding drops from `--space-struct-y-base` to `--space-global-xl` to stop the post-it sitting too deep.
- Category chip stays the same size.

---

## Section 4 — Reading level toggle (A6) + answer body

### Role
The core of the page. The Simple Mode toggle sits above the answer so the reader can choose a reading level before engaging with the text. The answer is long-form prose; it must feel readable, generous, and calm. Inline glossary tooltips (A7) decorate specific terms.

### Desktop

**Outer wrapper.** §3 and §4 share a single `.c1-content-panel` wrapper — the "book page" panel. This is a contained white surface (`--bg-surface`, `--shadow-md`, `--radius-lg`) centred at `max-w-[var(--container-max-reading-wide)]` on the `--bg-page` ground. §4 is a `<section>` inside this panel, immediately following §3. The panel's horizontal padding (`px-[var(--space-global-gutter)]`) applies to both sections.

**Section 4 inner wrapper.** `mx-auto w-full max-w-[var(--container-max-prose)]`. The prose measure (44rem) is narrower than the 56rem panel; this is the moment where the page pulls in to a long-form reading column.

**Layout inside the prose column.**

1. **Simple Mode toggle (A6).** Sits at the very top of §4, above the answer body. Rendered as a single switch, not a segmented control.
   - Tailwind wrapper: `flex items-center justify-end gap-[var(--space-global-md)] mb-[var(--space-global-xl)] pb-[var(--space-global-md)] border-b-[var(--border-width-xs)] border-[var(--border-subtle)]`
   - The bottom border is intentional — it marks the toggle as a control bar separate from the prose that follows.
   - **No "Reading level" label.** The original spec had a left-aligned uppercase preheader label and a right-aligned segmented control with two buttons (Standard / Simple). During implementation, this was simplified to a single right-aligned toggle switch labelled "Simplify". Rationale: a segmented control with "Standard" and "Simple" options risks reading as a judgement on the reader's ability; a simple on/off switch labelled as a verb ("Simplify") feels more like an action than a designation. It tells the reader what the toggle does without implying anything about who they are.
   - The toggle uses `role="switch"` with `aria-checked` (true when Simple is active) and `aria-label="Simple version"`. Styling comes from `--toggle-mode-*` tokens — no overrides.
   - **Sticky behaviour.** On desktop viewports ≥ 1024px, wrap the toggle row in a `sticky top-[var(--header-height)] z-[20]` container with `bg-[var(--bg-surface)]` (matching the white content panel) and a subtle bottom border. The toggle sticks to just under the header as the reader scrolls the answer. This is what the Page Content Spec means by *"remain accessible as the reader scrolls."* The `z-20` is below the shell's `--z-header` but above the prose so the sticky bar sits in front of the text that scrolls under it.
   - On mobile, the toggle does not stick (sticky controls on narrow screens eat too much viewport). Instead, use `mb-[var(--space-global-lg)]` and leave it in normal flow.

2. **Answer body (Standard view).** A `<div data-reading-level="standard">` containing the prose. This is the default view and is visible on load unless localStorage says otherwise.
   - Inherits Fraunces for headings and Atkinson for body via `.layer-ota`.
   - Body paragraphs use `--text-prose-size-body` (clamps 1.0625rem → 1.25rem).
   - Line height: 1.7 on paragraphs. The Atkinson glyphs read beautifully with generous leading; anything tighter than 1.65 feels cramped. Not tokenised yet — if this recurs on C2 and C4, promote to `--prose-line-height: 1.7`.
   - Paragraph spacing: `mt-[var(--space-global-md)]` between paragraphs (1.5rem). Not margin-bottom on p — margin-top so the first paragraph butts up cleanly to whatever sits above.
   - Subheadings inside the answer: `<h2>` at `--text-prose-size-h2`, `<h3>` at `--text-prose-size-h3`, both with `mt-[var(--space-global-xl)] mb-[var(--space-global-sm)]`.
   - Lists: `ul`/`ol` at `pl-[var(--space-global-lg)]`, list items with `mt-[var(--space-global-xs)]` spacing.
   - Max width: the prose column is already constrained by `--container-max-prose` on the section wrapper, so individual elements need no further width constraints.
   - Text colour: inherits `--text-ota-body`.

3. **Answer body (Simple view).** A `<div data-reading-level="simple" hidden>` sibling of the standard view, with identical structural rules. JS toggles the `hidden` attribute between the two based on the toggle state. Both views exist in the DOM at build time. No layout change when toggling — this is part of the A6 requirement ("Stable layout; only the text swaps").

4. **Inline glossary tooltips (A7).** Glossary-tagged terms inside the prose render as `<button class="glossary-trigger">…</button>` (button, not anchor, because the action is a tooltip-reveal, not a navigation on primary click).
   - Trigger styling (via new tokens flagged above):
     ```css
     .glossary-trigger {
       font: inherit;
       color: inherit;
       background: none;
       border: none;
       padding: 0;
       cursor: help;
       text-decoration: var(--glossary-underline);
       text-underline-offset: var(--glossary-underline-offset);
     }
     .glossary-trigger:hover,
     .glossary-trigger:focus-visible {
       color: var(--link-ota-contextual);
     }
     ```
   - The underline is dotted, not solid, to distinguish glossary terms from navigation links (which are solid underline on hover, per the existing link system). The dotted underline is a reading-convention affordance — it reads as *"there is more to know here"*, not *"this is a link to another page."*
   - **Tooltip panel (D4 — desktop hover state, mobile tap state).** Positioned absolutely relative to the trigger.
     - Tailwind on the panel: `absolute z-30 mt-2 min-w-[14rem] max-w-[var(--tooltip-max-width)] p-[var(--tooltip-padding-y)] px-[var(--tooltip-padding-x)]`
     - Visual via the new tooltip tokens: `background: var(--tooltip-bg); color: var(--tooltip-text); border: var(--tooltip-border-width) solid var(--tooltip-border); border-radius: var(--tooltip-radius); box-shadow: var(--tooltip-shadow);`
     - Font: the tooltip sits inside `.layer-ota`, so it inherits Atkinson. This is correct — the definition text should read in the same typographic voice as the surrounding prose.
     - Contents (in order): term name in bold at `--text-prose-size-body`, short or simple definition at `--text-prose-size-body`, "Read more →" link at `--text-card-size-body` in `--link-ota-contextual` colour.
     - Arrow: a small triangle pointing to the trigger, sized by `--tooltip-arrow-size`. Built as a rotated square inheriting background and border from the tooltip panel.
     - Behaviour: on desktop, opens on hover, stays on hover, closes on mouse-leave after 150ms. On mobile, opens on tap, closes on outside tap or on tapping a close button rendered only at mobile widths.
     - Only the first occurrence of a term per page is tooltipped (JS concern).
   - **Accessibility:** the trigger has `aria-describedby` pointing to the tooltip panel's id; the panel has `role="tooltip"`. When opened on mobile, the trigger gets `aria-expanded="true"`.

### Mobile

- Prose column: `max-w-[var(--container-max-prose)]` still applies, and at narrow widths the column fills the viewport minus the gutter. No change needed.
- Toggle row does not stick (see above).
- Glossary tooltip renders as a bottom sheet at mobile widths, not an anchored popover. Tailwind on the mobile variant: `fixed inset-x-0 bottom-0 z-40 mx-0 max-w-none rounded-t-[var(--radius-lg)] rounded-b-none p-[var(--space-global-lg)] shadow-[var(--tooltip-shadow)]` with a close button and a backdrop (`fixed inset-0 bg-black/20 z-30`). This is the simplest way to guarantee the tooltip content is always readable on narrow screens. Desktop version keeps the anchored popover.
- Paragraph line-height stays at 1.7.
- Prose size via clamp already steps down.

### Dual-answer layout (D7, referenced but not specified in full here)

~10–15% of questions carry two age-differentiated answers on the same page. For those, §4 contains two answer panels stacked vertically inside the prose column, each labelled at the top with a `.badge` + short heading ("For younger readers" / "For older readers"). A horizontal rule (`hr` styled with `border-top: var(--border-width-xs) solid var(--border-subtle); margin: var(--space-struct-y-base) 0;`) separates them. Full D7 spec will follow in a later pass; for C1 v1, the build can implement the single-answer path first and layer dual-answer in as a variant of §4.

---

## Section 5 — Signposting block (A8)

### Role
A persistent list of relevant support services, shown at the bottom of every answer. Always present, never dismissable. Tonally it should feel like a hand reaching out — calm and steady, not sugary.

### Desktop

**Outer wrapper.** §5 breaks out of the `.surface--ota` wrapper and sits in its own full-bleed `<section>` with `--safeguarding-support-bg` as the section background. This cool blue (#EEF3F7) interrupts the warm paper ground and signals a shift from answer content to support information — a deliberate surface punctuation that stops the long scroll feeling monotonous.
- Tailwind: `w-full pt-[var(--space-global-2xl)] pb-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
- Background: `background: var(--safeguarding-support-bg)` (applied via inline style or a utility class on the `<section>`, not via `.surface--ota`)
- Note the top padding is `--space-global-2xl` (5rem) rather than `--space-struct-y-base` — this is the "adjacent to the answer, not quarantined" rule from the rhythm section above. The reduced gap keeps the signposting feeling proximate to the answer even though the surface has changed.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-reading-wide)]`.

**Section heading.** A centred `<h2>` sits above the alert component as the section's own heading:
- `<h2>` text: "Need to talk to someone?"
- Tailwind: `text-center mb-[var(--space-global-lg)]`
- Size: `--text-prose-size-h3`
- Font: Fraunces (inherited from `.layer-ota`)
- Weight: `--heading-ota-weight-h3`
- Colour: `--text-ota-heading`

This heading replaces what was originally a duplication: the spec had both a section `<h2>` ("Support services") and an internal `.alert__title` ("Need to talk to someone?") with a heart icon. During implementation, these were consolidated — "Need to talk to someone?" is the stronger, more human phrasing, so it was promoted to the section heading and the alert's internal title and icon were removed. The alert component now has no `.alert__title` or `.alert__icon`; it contains only `.alert__content` with `.alert__body`.

**The component.** A single `.alert.alert--support` — no dismiss button, no `.alert__title`, no `.alert__icon`.
- Inline class override: `alert--support` at its default padding is correct for this use. No C1-specific size bump (unlike the crisis alert in §1 — signposting is supportive, not hero; it should feel like a letter, not a banner).
- Structure: `.alert__content` containing `.alert__body` directly.
- Inside `.alert__body`, the services list is a `<ul>` styled with Tailwind: `list-none p-0 m-0 grid grid-cols-1 md:grid-cols-2 gap-[var(--space-global-md)] mt-[var(--space-global-sm)]`. Two columns at `md` and up, one column on mobile.
- Each `<li>` is a service entry. Composition:
  - Service name in bold at `--text-prose-size-body`.
  - "What they help with" line at `--text-card-size-body` in `--safeguarding-support-text` (inherited from alert).
  - Contact method line: phone number and/or URL, styled as a link. Phone numbers use `<a href="tel:…">`; URLs use `<a href="…">`. Both links on this surface use `--safeguarding-support-icon` (#3D7A9E) as their colour — this is the one place the support icon colour doubles as a link colour, because the default `--link-ota-contextual` (teal) fights the warm-blue support ground. Flag: if this becomes a pattern, promote to a `--link-on-support: var(--safeguarding-support-icon)` token. For C1, an inline style on the links is acceptable.

### Mobile

- Services list collapses from 2-col to 1-col automatically via `grid-cols-1 md:grid-cols-2`.
- Heading size steps down via the prose ramp clamp. No explicit override.
- The alert's default padding remains comfortable at narrow widths.

---

## Section 6 — Related questions (A15, question variant) + Topic tags (A16)

### Role
3–5 related question cards, helping the reader continue browsing if the answer didn't fully resolve their question, or if they want to read adjacent material. Topic tags sit at the bottom of this section as a final wayfinding cue.

This section was originally spec'd as §7, with the end-of-answer panel before it. The order was reversed during implementation: related questions now follow signposting immediately, keeping the reader in OtA content and in the "quietly held" register before the exit triptych. The end-of-answer panel (now §7) sits directly above the footer, functioning as a transition zone between the OtA layer and the Tailor shell.

### Desktop

**Outer wrapper.** §6 sits on the plain `--bg-page` ground — no surface band. The `.surface--ota` wrapper was removed during implementation; the cards provide their own structure and don't need a coloured band behind them. `<section class="w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]">`.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-reading-wide)]`.

**Section heading.** Above the card grid:
- `<h2>` text: "Other questions young people ask"
- Tailwind: `mb-[var(--space-global-lg)]`
- Size: `--text-prose-size-h2`, Fraunces, weight `--heading-ota-weight-h2`, colour `--text-ota-heading`
- Centred (`text-align: center`), consistent with the OtA heading pattern used across all OtA sections.

**Card grid.** 3–5 cards in a responsive grid.
- Tailwind: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--space-global-md)]`
- Cards size to their own content height — no `h-full` stretching.
- Card rendering is delegated to the shared `QuestionCard.astro` component (see below).

**QuestionCard component** (`src/components/QuestionCard.astro`).

A unified card component used by both `RelatedQuestions.astro` and the tag archive page at `/questions/tag/{slug}`. Owns all card rendering: post-it image, category eyebrow, question title, content tags, and "Read the answer" link.

- Outer: `<a href="/anonymous_question/{slug}" class="card qcard no-underline flex flex-col">` — the whole card is a link.
- **Hover interaction.** The `.card--lift` shadow elevation was removed. The card uses a custom hover: subtle 3px upward translate, border reveal (`--border-subtle`), and post-it image saturation boost (0.85 → 1.2 via CSS `filter: saturate()`). No shadow on hover. The desaturated-to-saturated image transition makes the post-it "come alive" on hover.
- **Post-it thumbnail.** `.qcard__image` container: `height: 10rem`, flex centering, `overflow: hidden`, top corners rounded. `<img>` inside: `object-fit: contain`, `mix-blend-mode: multiply`, `rotate(var(--postit-rotation))`, `filter: saturate(0.85)` at rest.
- `.card__body` contents (in order):
  1. `.card__eyebrow` — the OtA category name, colour driven per card by `style="--card-eyebrow-color: var(--ota-cat-{slug})"`.
  2. `.card__title` — the question text. Fraunces, `--text-card-size-h3`, `--heading-ota-weight-h3`, line-height 1.3.
  3. **Content tags line.** Each question's `contentTags` render as muted dot-separated text (`· `) below the title. Each tag is a clickable `<span>` with `data-tag-href` — a global event-delegated JS click handler (`stopPropagation`) navigates to the tag archive page without triggering the parent card link. Font-size `--text-util-micro-size`, colour `--text-ota-muted`. On hover, tags transition to `--brand-accent-text` with an underline. If `contentTags` is empty, the line is omitted.
     - **Tag archive pages** exist at `src/pages/questions/tag/[...slug].astro` — one page per unique content tag, generated at build time via `getStaticPaths()`. Each page shows a grid of matching question cards using the same `QuestionCard` component.
  4. `.card__link` — "Read the answer" in `--link-ota-contextual`.

### Mobile

- `grid-cols-1` — cards stack.
- Post-it thumbnails retain `mix-blend-mode: multiply` and rotation.
- Card padding from `--card-padding` (16px) is correct at narrow widths.
- Section heading size steps down via clamp.
- If there are more than 3 cards on mobile, no truncation — the reader scrolls through all of them. No "show more" UI for the v1.

---

## Section 7 — End-of-answer panel (A17)

### Role
Three CTA panels serving all three audiences who land on question pages: young people/parents (book), teachers (topic landing), school leaders (services). Must feel like a natural continuation of help, not a conversion block. This is now the final content section before the footer — it functions as the transition between the OtA layer and the Tailor shell.

### Desktop

**Outer wrapper.** A `<section>` with `.surface--ota-alt` — the deeper warm exit band:

```html
  </div><!-- /.surface--ota wrapping §3-§6 -->
  <section class="surface--ota-alt w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]">
    …
  </section>
```

The surface shift to `.surface--ota-alt` (#F0EDE5) is what makes the panel feel like its own moment. It's still warm paper, just a shade deeper.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-reading-wide)]`.

**Section heading.** Above the panel grid, a small heading establishes the invitation:
- `<h2>` text: "Where to go from here"
- Tailwind: `text-center mb-[var(--space-global-xl)]`
- Size: `--text-prose-size-h2`
- Fraunces, weight `--heading-ota-weight-h2`, colour `--text-ota-heading`
- Optional subline below the h2: `--text-util-lede-size`, `--text-ota-muted`, `text-center max-w-[30rem] mx-auto mb-[var(--space-global-xl)]`. Copy: "Three places this answer connects to — pick what you need next."

**Panel grid.** Three panels in a 3-column grid on desktop, stacked on mobile.
- Tailwind: `grid grid-cols-1 md:grid-cols-3 gap-[var(--space-global-lg)]`

**Panel 1 — Get the book.**
- Outer: `<a href="/book">` — the whole panel is a link.
- Tailwind: `block rounded-[var(--panel-radius)] p-[var(--panel-padding)] no-underline`
- Background: `bg-[var(--panel-book-bg)]` — the post-it soft yellow. This is the most visually distinctive of the three panels; it carries the Okay to Ask motif forward.
- Text colour: `text-[var(--text-ota-body)]`
- Inner structure (flex column):
  1. Book cover image (when available) — Tailwind `w-[7rem] mx-auto mb-[var(--space-global-md)] rounded-[var(--radius-sm)] shadow-[var(--shadow-md)]`. Placeholder state when image is missing: a post-it-yellow rectangle of the same dimensions with the Okay to Ask wordmark on it.
  2. Eyebrow: "For readers" — Tailwind `text-center mb-[var(--space-global-xs)]`, size `--text-util-preheader-size`, uppercase, letter-spacing `--card-eyebrow-ls`, colour `--text-ota-muted`.
  3. Title: "Get the Okay to Ask book" — Fraunces, `--text-card-size-h3`, weight `--heading-ota-weight-h3`, `text-center`.
  4. Description: one line, `--text-card-size-body`, `--text-ota-muted`, `text-center mt-[var(--space-global-xs)]`.
  5. Action: "Buy from £… →" at the bottom, styled like `.card__link` — `--text-card-size-body`, weight 700, colour `--link-ota-contextual`, arrow via `::after`. Tailwind `mt-auto pt-[var(--space-global-md)] text-center`.

**Panel 2 — Explore how to teach this topic.**
- Outer: `<a href="/topics/{primary_topic_slug}">`
- Tailwind: `block rounded-[var(--panel-radius)] p-[var(--panel-padding)] no-underline border-[var(--border-width-xs)] border-[var(--border-subtle)]`
- Background: `bg-[var(--panel-topic-bg)]` — crisp white. The border is needed because this panel sits on the `.surface--ota-alt` ground without its own tinted background; the border gives it containment.
- Shadow: `--shadow-sm` at rest. On `:hover`, upgrade to `--shadow-md` with a `-2px` translate via `--card-lift-distance`. Transition tokens as per shell.
- Inner structure:
  1. Spot icon at the top — `--spot-icon-size-lg` via `.spot-icon` styling, centred. Icon: a small classroom/chalkboard shape or similar.
  2. Eyebrow: "For teachers" — same styling as Panel 1's eyebrow.
  3. Title: "Explore how to teach {topic name}" — Fraunces, `--text-card-size-h3`.
  4. Description: one line summarising the landing page.
  5. Action: "See the topic hub →" — same styling as Panel 1.

**Panel 3 — Bring RSE into your school.**
- Outer: `<a href="/services">` or `/rse-training` (driven by content).
- Tailwind: `block rounded-[var(--panel-radius)] p-[var(--panel-padding)] no-underline`
- Background: `bg-[var(--panel-services-bg)]` — `--bg-emphasis`, the dark authority tone.
- Text colour: `text-[var(--text-on-dark)]`.
- Inner structure:
  1. Spot icon at the top, recoloured for dark ground: use `--brand-accent-soft` for the icon stroke.
  2. Eyebrow: "For school leaders" — same sizing as Panel 1/2, but colour `--text-muted-on-dark`.
  3. Title: "Bring RSE into your school" — Fraunces on a dark ground. The `.layer-ota` rule applies Fraunces to all h-tags including those inside this panel. Colour `--text-heading-on-dark`.
  4. Description: one line, colour `--text-muted-on-dark`.
  5. Action: "See our services →" — action link on dark, colour `--link-action-color-on-dark`, hover `--link-action-color-on-dark-hover`.
- Focus ring on the whole panel: use `--focus-ring-on-dark`.

**Shared panel rules.**
- Every panel is a clickable area — the whole block is wrapped in an `<a>`. Use `block` Tailwind utility so the anchor consumes the padded box.
- The `flex flex-col h-full` pattern keeps the three panels vertically aligned when their copy lengths differ: the action link lives at `mt-auto` so it always sits at the bottom of each card.
- `:focus-visible` on the outer `<a>`: `outline: var(--focus-ring-width) solid var(--focus-ring); outline-offset: var(--focus-ring-offset); border-radius: var(--panel-radius);` (and `--focus-ring-on-dark` for Panel 3).
- No dismiss, no close, no animation beyond the lift on Panel 2.

### Mobile

- Grid becomes `grid-cols-1`. Panels stack: book → topic → services. This order is deliberate — a young person or parent scrolling from the answer sees the book first; a teacher scrolls one more; a school leader scrolls one more.
- Gap between stacked panels: `gap-[var(--space-global-md)]` (tighter than desktop's `-lg` because vertical stacks on mobile need less separation to feel grouped).
- Book panel's book cover: reduce to `w-[5.5rem]`.
- All three panels retain their backgrounds and treatment — the three-surface reveal is the whole point of the component, and it works on mobile because the reader sees it as a sequence rather than a row.

---

## Accessibility notes for C1

- The page has a single `<h1>` — the question itself in §3. Every other heading is `<h2>` or deeper.
- `<main id="main">` is the skip-link target from the shell.
- Simple Mode toggle (A6): `role="switch"` with `aria-checked` and `aria-label="Simple version"`. The answer body divs have `aria-live="polite"` so screen readers announce when content swaps. The toggle persists via localStorage; the first paint must render the correct view to avoid flash (JS concern).
- Glossary tooltip (A7): trigger is a `<button>` with `aria-describedby` → tooltip id; tooltip panel has `role="tooltip"`. On mobile bottom-sheet variant, the sheet uses `role="dialog" aria-modal="true"` and traps focus while open.
- Crisis (A9) and signposting (A8) alerts: `role="complementary"` with `aria-labelledby` pointing to the alert title. These are not `role="alert"` — `role="alert"` is reserved for dynamic, interrupting content; A9 and A8 are persistent page regions.
- Age flag (D1): same pattern as A9. The "Continue to the answer" button moves focus to the post-it `<figure>` caption (with `tabindex="-1"` on the figcaption element) to continue the reading flow.
- The three end-of-answer panels are independent `<a>` elements, not a single component — each is independently focusable and reads as a discrete destination to screen readers.
- Related questions cards are `<a>` elements wrapping the card content. Each card is one stop in the tab order.
- Topic tag chips are `<a>` elements, each one stop in the tab order.

---

## Sensitive-content constraints (visual)

The art direction brief's constraints for safeguarding content are hard rules on this page:

1. No decorative flourishes around the crisis alert. No gradient backgrounds, no icon animations, no hover-lift on the crisis card. It sits still and steady.
2. No hover animations inside the prose column — the answer is the work; decoration would undermine the "quietly held" mood.
3. The post-it is the only place on the page where visual personality is allowed to lead. Everything else is restraint.
4. The end-of-answer panel's dark services panel (Panel 3) is the hardest single visual shift on the page. It must not feel like a sales interruption; it works because the three panels together form a triptych where each addresses a distinct audience. The darkness of Panel 3 is what makes it legible as *school leader* content — treating it as a sibling of a consumer book CTA (Panel 1) and a teacher link (Panel 2) would flatten the three audiences into one beige row.
5. No animation on the toggle between Standard and Simple modes. No fade, no slide. Instant swap. (D5 will confirm this in its own spec, but C1 needs the decision now to build correctly.)

---

## Summary of deltas against the current build

These are the changes to `tailor-site-v2.css` and component code that this spec introduces for C1.

1. **Add new tokens to `tailor-site-v2.css`:**
   - `--container-max-prose: 44rem` and `--container-max-reading-wide: 56rem` (spacing section).
   - `--postit-rotation`, `--postit-max-width`, `--postit-shadow` (OtA motif section, near `--surface-ota-postit`). Note: `--postit-shadow` is defined but not consumed — retained for potential future use.
   - Glossary tooltip subsystem: `--tooltip-bg`, `--tooltip-text`, `--tooltip-border`, `--tooltip-border-width`, `--tooltip-radius`, `--tooltip-shadow`, `--tooltip-padding-y`, `--tooltip-padding-x`, `--tooltip-max-width`, `--tooltip-arrow-size`, `--glossary-underline`, `--glossary-underline-offset`. New section in the CSS; name it `/* ── Glossary tooltip (A7) ── */`.
   - End-of-answer panel tokens: `--panel-book-bg`, `--panel-topic-bg`, `--panel-services-bg`, `--panel-radius`, `--panel-padding`. New section in the CSS.
   - `--topic-tag-gap` (optional — defer if it's the only member of its group).
2. **Add one new alert modifier class:** `.alert--crisis-hero` for the C1 opening crisis alert (promotes the title from `--text-card-size-h6` to `--text-prose-size-h5`).
3. **Add one new card enhancement:** allow `.card__eyebrow` to consume a `--card-eyebrow-color` custom property so question cards can colour the eyebrow per OtA category.
4. **Add the `.postit-image` class** with rotation, `mix-blend-mode: multiply`, radius, and max-width consuming the post-it tokens. No `box-shadow` — the multiply blending handles edge artefacts on the scanned JPEGs.
5. **Build the A7 glossary tooltip component** as a new Astro component `GlossaryTooltip.astro` (desktop popover + mobile bottom sheet). Uses the new tooltip tokens. JS: hover/focus for desktop, tap/click-outside for mobile.
6. **Build the A17 end-of-answer panel** as a new Astro component `EndOfAnswerPanel.astro` consuming the three panel tokens. Replaces the existing `EndOfAnswerPanel.astro` if it exists.
7. **Rename post-it image files** from `AQ - "Question text?".jpeg` to `{slug}.jpeg` with a `slug-map.json` index. Update `src/lib/post-it-images.ts` to use slug-based lookup. (Implemented — the `?` characters in the original filenames caused Vite 404s on encoded URLs.)
8. **Simple Mode toggle redesign:** replace the two-button segmented control (`role="radiogroup"`) with a single toggle switch (`role="switch"`) labelled "Simple version". Remove the "Reading level" label.
9. **Signposting heading consolidation:** remove `.alert__title` and `.alert__icon` from the signposting alert. Promote "Need to talk to someone?" to a centred section `<h2>` above the alert.
10. **Section order: related questions (§6) before end-of-answer panel (§7).** Topic tags sit inside §6 with a border separator. The `.surface--ota` wrapper groups §3–§6; `.surface--ota-alt` sits on §7 only.
11. **Related question cards include post-it thumbnails.** Each card shows a compact (10rem container) post-it scan with `mix-blend-mode: multiply` above the card body.
12. **The existing `SignpostingBlock.astro`, `CrisisSupport.astro`, `AgeFlag.astro`, `SimpleModeToggle.astro`, `RelatedQuestions.astro`, and `TopicTags.astro` components** should be audited against this spec during implementation; styling should already be close to correct thanks to the alert/badge/card token primitives, but layout structure (wrappers, grid columns, prose-measure vs reading-wide inner widths) needs to match this document exactly.
13. **The C1 page template (`pages/anonymous_question/[slug].astro` or equivalent)** needs to be structured so `<main class="layer-ota">` wraps the sections in the order and surface grouping described above, with the `.surface--ota` grouping wrapping §3–§6, and `.surface--ota-alt` on §7.

---

*Document version: 1.1 — C1 question page, layout spec. Updated to reflect implementation deviations (post-it shadow removal, mix-blend-mode multiply, toggle redesign, signposting consolidation, section reorder, post-it thumbnails on cards, slug-based image filenames). Next (per wireframing sequence): C2 glossary page.*
