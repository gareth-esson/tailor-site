# Tailor Education — Design System Implementation Notes for Claude Code (v2)

*This document accompanies `tailor-site-v2.css`. It tells Claude Code how the design system works, what patterns to follow, and what to avoid when building components for the Tailor Education / Okay to Ask website.*

*Read this before writing any markup or component CSS.*

*This document is a project-specific companion to `SYSTEM-RULES.md` (the full Guess Design House design system rules) and `CLAUDE-CODE-OPERATING-RULES.md` (the behavioural rules for Claude Code). Where those documents define the generic system, this document defines what's specific to Tailor Education. If something here conflicts with those documents, those documents win on system logic and process — this document wins only on Tailor-specific token values and layer architecture.*

---

## The mandatory workflow (do this first, every time)

Before writing ANY CSS, before applying ANY class to markup:

1. **Grep `tailor-site-v2.css`** for the component or token category you need (e.g. `--btn-`, `--card-`, `--surface-`, `.btn--`, `.card--`)
2. **Read every variant that exists** for that component, including hover states, on-dark variants, and modifiers
3. **Match the correct variant to the context** you're working in (what surface? what layer? what state? what hierarchy?)
4. **Then** write code

If you skip step 1, you will pick the wrong class. The CSS file is the source of truth, not your intuition. When you guess, you are wrong.

For the full component decision tree, read `SYSTEM-RULES.md` Section 13. For detailed behavioural rules (variant selection, anti-patterns, extension rules), read `CLAUDE-CODE-OPERATING-RULES.md`. This document does not duplicate those — it adds the Tailor-specific context on top.

---

## The system in one paragraph

This is a token-based design system (forked from the Guess Design House master) with two emotional layers expressed through one structural shell. The **Tailor layer** (showcase, services, training, topic hubs, blog) uses Lexend for all typography and the brand teal for actions. The **Okay to Ask layer** (question pages, glossary pages, /questions/ landing) uses Atkinson Hyperlegible for body text, Fraunces for headings, warmer surfaces, and its own category colour palette. The navigation shell (header, footer) always stays in the Tailor layer regardless of which page the reader is on. All visual values come from CSS custom properties — never hardcode hex values, font sizes, or spacing values in component markup.

---

## Critical rules

1. **Every visual value must reference a design token.** No hardcoded colours, font sizes, spacing values, border radii, or shadows anywhere in component CSS or inline styles. If you need a value that doesn't exist as a token, flag it — don't invent an inline value. *(This is Rule 1 from SYSTEM-RULES.md — it governs everything.)*

2. **The `.layer-ota` class goes on `<main>`, not on `<body>`.** This is what creates the typographic split. The header and footer sit outside `<main>` and inherit Lexend from the body rule. Everything inside `<main>` on an OtA page gets Atkinson Hyperlegible (body) and Fraunces (headings).

3. **The OtA category colours (`--ota-cat-*`) and the app category colours (`--cat-*`) are separate systems.** The `--cat-*` tokens are the Tailor app's 7 RSHE categories (used in the mega menu groupings). The `--ota-cat-*` tokens are the Okay to Ask book/browsing categories (used on question pages, /questions/ landing filters, category badges). Never use one where the other belongs.

4. **The safeguarding tokens (`--safeguarding-*`) are not the UI state tokens (`--state-*`).** Use `--state-success/warning/error/info` for form validation, system alerts, and generic UI feedback. Use `--safeguarding-support/ageflag/crisis` for components A8 (signposting), D1 (age flag), and A9 (crisis support). These have different emotional calibrations.

5. **The crisis support component (A9) and signposting block (A8) must never have a dismiss button.** This is a safeguarding requirement, not a design preference. Do not add `.alert__dismiss` to these components.

6. **No `!important`.** If you think you need it, your specificity is wrong — fix the cascade order or selector instead. *(From CLAUDE-CODE-OPERATING-RULES.md Rule 6.2 and SYSTEM-RULES.md anti-pattern 2.)*

7. **Handle `prefers-reduced-motion: reduce` for every transition or animation.** If you add motion, add the reduced-motion override in the same change. *(From CLAUDE-CODE-OPERATING-RULES.md Rule 6.3.)*

8. **WCAG 2.1 AA contrast on every colour combination.** The system's `*-text` variants are lightness-clamped to guarantee this — use them. *(From CLAUDE-CODE-OPERATING-RULES.md Rule 6.4.)*

9. **Visible focus indicators on every interactive element** using `--focus-ring` (or `--focus-ring-on-dark`). Never `outline: none` without a replacement. *(From CLAUDE-CODE-OPERATING-RULES.md Rule 6.5.)*

10. **Component-first naming.** `--btn-tint-bg`, not `--tint-button-background`. `.card__title`, not `.title-card`. *(From SYSTEM-RULES.md Section 3 and CLAUDE-CODE-OPERATING-RULES.md Rule 6.6.)*

---

## Layer scoping pattern

### Tailor pages (default)

No special class needed. The body rule applies Lexend globally. Pages render against `--bg-page` (#FAFAF7).

```html
<body>
  <header><!-- always Lexend --></header>
  <main>
    <!-- Tailor content: Lexend everywhere, teal accent, neutral surfaces -->
  </main>
  <footer><!-- always Lexend --></footer>
</body>
```

### Okay to Ask pages

Add `.layer-ota` to `<main>`. Optionally add `.surface--ota` to section wrappers for the warmer paper ground.

```html
<body>
  <header><!-- still Lexend --></header>
  <main class="layer-ota">
    <section class="surface--ota">
      <!-- OtA content: Atkinson body, Fraunces headings, warm paper surface -->
    </section>
  </main>
  <footer><!-- still Lexend --></footer>
</body>
```

### What `.layer-ota` does

- Sets `font-family` to `var(--font-ota-body-stack)` (Atkinson Hyperlegible)
- Sets `color` to `var(--text-ota-body)`
- Overrides h1–h6 to `var(--font-ota-heading-stack)` (Fraunces)
- Applies `font-variation-settings` on h1–h3 for Fraunces optical size and WONK axes

### What `.surface--ota` does

- Sets `background` to `var(--bg-ota-surface)` (#F7F5F0 — warm paper)
- `.surface--ota-alt` gives a slightly deeper warm tint (#F0EDE5)

These are independent — you can use `.layer-ota` without `.surface--ota` if a section needs OtA typography on a white surface.

---

## Font loading

Three font families must be loaded in the `<head>` of every page:

```html
<!-- Tailor layer + shell -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- Okay to Ask layer -->
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,100..900,0..100,0..1;1,9..144,100..900,0..100,0..1&display=swap" rel="stylesheet">
```

All three load on every page because navigation between layers should be instant — no flash of unstyled text when moving from a Tailor page to an OtA page.

---

## Surface hierarchy

Use these tokens/classes for background surfaces, in order of visual weight:

| Purpose | Token / Class | Value | When to use |
|---|---|---|---|
| Page ground | `--bg-page` | #FAFAF7 | Default page background (set on body) |
| Soft section band | `--bg-surface-alt` | #f0efeb | Alternating content sections on Tailor pages |
| Elevated container | `--bg-surface` | #FFFFFF | Cards, contained panels, elevated surfaces |
| Brand tinted | `--bg-tinted` | 4% teal opacity | Light accent wash behind feature sections |
| Authority band | `--bg-emphasis` / `.surface--dark` | #1E2A3A | Dark section bands, footer background, hero overlays |
| OtA warm ground | `.surface--ota` | #F7F5F0 | Main content area on OtA pages |
| OtA section band | `.surface--ota-alt` | #F0EDE5 | Alternating sections within OtA pages |

### Pair every surface with its matching text token

Whenever you set a surface (background), set the matching text colour using the system token:

- Light surfaces (default) → `--text-body`, `--text-body-muted`, `--text-heading`
- `.surface--dark` → `--text-on-dark`, `--text-heading-on-dark` (auto-swaps for headings, body text, buttons, links, tables, focus rings — see CLAUDE-CODE-OPERATING-RULES.md Section 3 for the full list)
- `.surface--brand` → treat as dark surface; this is where white-family buttons belong
- `.surface--ota` → `--text-ota-body`, `--text-ota-heading`, `--text-ota-muted`

What does **NOT** auto-swap on dark surfaces (you must handle explicitly):
- Inline opacity values — use `--on-dark-*` tokens, never raw `rgba(255,255,255,X)`
- Custom borders — use `--border-subtle-on-dark` / `--border-strong-on-dark`

---

## Component reference

### Buttons

No layer-specific button styles. Buttons use the brand teal everywhere.

**Three-layer class structure (always):** Every button uses base + size + style. Never omit the size class.

```html
<a class="btn btn--std btn--primary has-icon-hover">Get started</a>
<a class="btn btn--std btn--tint">Secondary action</a>
<a class="btn btn--std btn--outline">Learn more</a>
<a class="btn btn--sm btn--tint">Filter</a>
```

**Style priority order (this is a codified preference — follow it):**

1. **`.btn--tint` is the DEFAULT** for secondary actions and most CTAs. Reach for tint first, always.
2. **`.btn--primary`** is for the single most important action on a screen.
3. **`.btn--outline`** ONLY when explicitly requested, or when tint genuinely cannot work in context. Outline is not a default — it's a fallback.
4. **`.btn--text`** for low-emphasis tertiary actions ("Cancel", inline "Learn more"). For arrow-driven "Read more →" links, use `.link-action` instead.

**Never default to `.btn--outline`.** This has been called out as a failure mode.

**On dark surfaces:** The standard family (`.btn--tint`, `.btn--outline`) auto-swaps to on-dark tokens when inside `.surface--dark`. Only switch to the white family (`.btn--white-primary`, `.btn--white-tint`, `.btn--white-outline`) when the surface IS the brand-primary or brand-accent colour.

**Disabled state accessibility:** `.btn--disabled` provides visual styling only. Always pair with the correct accessibility attribute:
- `<button>`: use native `disabled` attribute
- `<a>`: use `aria-disabled="true"` AND remove `href` AND add `tabindex="-1"`
- Never rely on `pointer-events: none` alone

### Link-action vs btn--text

Both are low-emphasis triggers, but they are not interchangeable:

- **`.link-action`** — has an arrow (`→`) that nudges on hover. Bold, no background. Use for "Read more →" standalone CTAs. Size variants: `.link-action--card`, `.link-action--display`.
- **`.btn--text`** — no arrow, has a subtle background tint on hover. Use for "Cancel", inline actions.

**Never combine `.btn--text` with `.has-icon-right`.** If you want the arrow, that's `.link-action`.

### Badges — OtA categories

```html
<span class="badge badge--pill badge--ota-anatomy">Anatomy</span>
<span class="badge badge--pill badge--ota-relationships">Relationships</span>
```

Available variants: `badge--ota-anatomy`, `badge--ota-puberty`, `badge--ota-relationships`, `badge--ota-sex`, `badge--ota-sexual-health`, `badge--ota-law`, `badge--ota-contraception`.

**Badge vs Chip:** Badges are static labels. Chips (`.chip`, `.chip--active`, `.chip--removable`) are interactive selectable tags for filter multi-select. If the user can click it to toggle, it's a chip. If it just labels something, it's a badge.

### Alerts — safeguarding

```html
<!-- A8 signposting block — no dismiss button -->
<div class="alert alert--support">
  <div class="alert__icon"><!-- icon --></div>
  <div class="alert__content">
    <div class="alert__title">Need to talk to someone?</div>
    <div class="alert__body"><p>...</p></div>
  </div>
</div>

<!-- A9 crisis support — no dismiss button -->
<div class="alert alert--crisis">
  <div class="alert__icon"><!-- icon --></div>
  <div class="alert__content">
    <div class="alert__title">Need support right now?</div>
    <div class="alert__body"><p>...</p></div>
  </div>
</div>

<!-- D1 age flag -->
<div class="alert alert--ageflag">
  <div class="alert__icon"><!-- icon --></div>
  <div class="alert__content">
    <div class="alert__title">This content is aimed at Year 9+</div>
    <div class="alert__body"><p>...</p></div>
  </div>
</div>
```

**Alert vs Toast:** Alerts are block-level, persistent, in-page. Toasts are fixed-position, temporary, floating. If it's part of page content, it's an alert. If it floats and disappears, it's a toast.

### Containers — surface vs card vs section

The system has a clear hierarchy (from SYSTEM-RULES.md Section 13 and CLAUDE-CODE-OPERATING-RULES.md Section 3):

- **Surface** — singular standalone container with its own background and padding. Use `.surface` + variant. Don't create one-off classes like `.hero-card`.
- **Card** — plural items in a grid. Use `.card` + variant with the full BEM structure (`.card__img`, `.card__body`, `.card__eyebrow`, `.card__title`, `.card__text`, `.card__link`).
- **Section** — full-width page-level row. Surfaces and cards live inside sections.

Card rules: no borders (unless explicitly requested), no resting shadow (use `.card--lift` for hover-only elevation). Layout variants: `.card--horizontal`, `.card--horizontal-reverse`, `.card--thumbnail`.

### Simple Mode toggle

The toggle uses `--toggle-mode-*` tokens. Build as a segmented control with two options (Standard / Simple). The toggle does not change page layout — it only swaps text content via JS.

```html
<div class="mode-toggle" role="radiogroup" aria-label="Reading level">
  <button role="radio" aria-checked="true" class="mode-toggle__option mode-toggle__option--active">Standard</button>
  <button role="radio" aria-checked="false" class="mode-toggle__option">Simple</button>
</div>
```

Style using the `--toggle-mode-*` tokens: `--toggle-mode-bg` for the container, `--toggle-mode-bg-active` for the selected segment, `--toggle-mode-text` / `--toggle-mode-text-active` for label colours, `--toggle-mode-radius` for the pill shape.

### Typography — three scales (don't mix within a context)

| Scale | Token prefix | Use case |
|-------|-------------|----------|
| **Display** | `--text-display-size-*` | Landing pages, heroes, marketing |
| **Prose** | `--text-prose-size-*` | Blog posts, long-form content, articles |
| **Card** | `--text-card-size-*` | Cards, compact UI, dashboards, app interfaces |

Card scale is one semantic step smaller than prose. For Tailor app UI, default to card scale unless in a hero or marketing moment.

### Typography utility classes

- `.signpost` — small uppercase label above section headings (h2/h3). The default choice.
- `.preheader` — slightly larger label above h1/display headings. Heroes and major CTAs only.
- `.hero-subhead` — subtitle beneath hero headings
- `.subheading` — section subtitles
- `.lede` — opening paragraph emphasis
- `.microtext` / `small` — fine print, captions

Don't combine `.signpost` and `.preheader` — pick one based on the heading they sit above.

### Icons — spot icons vs functional UI icons

- **`.spot-icon`** — decorative illustration (36–64px). Card headers, feature grids, empty states. Sizes: `.spot-icon--sm` (36px), `.spot-icon` (48px), `.spot-icon--lg` (64px). Modifiers: `--circle`, `--hoverable`, `--on-dark`, `--neutral`.
- **Functional UI icons** — interactive UI affordances (16px). Use Lucide icons.

Don't use `.spot-icon` for a 16px button icon. Don't use a Lucide icon at 48px in a card header.

---

## Post-it motif

The post-it yellow is available as a token:

- `--surface-ota-postit`: #F5E58A — the full post-it yellow, for accent borders, small colour blocks
- `--surface-ota-postit-soft`: #FBF4C7 — gentle tint, for subtle background washes

The actual post-it images are scanned artefacts served as image files — they are not generated by CSS. The tokens are for UI elements that reference the post-it colour (borders, accent highlights, background tinting behind post-it images).

---

## Colour contrast notes

Every foreground/background pairing in the system has been tested against WCAG 2.1. All 30 pairs pass AA (4.5:1 for normal text). Many exceed AAA (7:1).

| Combination | Ratio | WCAG |
|---|---|---|
| `--text-body` on `--bg-page` | 13.87:1 | AAA |
| `--text-body` on `--bg-surface` | 14.51:1 | AAA |
| `--text-body` on `--bg-surface-alt` | 12.61:1 | AAA |
| `--text-body` on `--bg-ota-surface` | 13.32:1 | AAA |
| `--text-body-muted` on `--bg-page` | 5.10:1 | AA |
| `--text-body-muted` on `--bg-surface-alt` | 4.64:1 | AA |
| `--text-ota-muted` on `--bg-ota-surface` | 5.35:1 | AA |
| `--text-on-dark` on `--bg-emphasis` | 13.07:1 | AAA |
| `--brand-accent-text` on `--bg-page` | 4.76:1 | AA |
| `--brand-accent-text` on `--bg-ota-surface` | 4.57:1 | AA |
| White on `--btn-primary-bg` | 5.60:1 | AA |
| Support text on support bg | 8.42:1 | AAA |
| Crisis text on crisis bg | 8.43:1 | AAA |
| Crisis accent on crisis bg | 4.77:1 | AA |
| Ageflag text on ageflag bg | 7.15:1 | AAA |

### Important: accent-text vs accent vs button bg

These are three different values from the same hue:

- **`--brand-accent` (#1A9E8A, L=36%)** — the brand teal. Used for focus rings, tinted backgrounds, spot icons, chip active states. NOT used as text on light backgrounds.
- **`--brand-accent-text` (L=29%)** — darker teal for inline link text. Clamped to ensure 4.5:1 on all page grounds including the warm OtA surface.
- **`--btn-primary-bg` (L=27%)** — darkest teal, used only for primary button backgrounds. Ensures white button text hits 5.6:1 contrast.

All three are the same hue (168) and saturation (71%). The system keeps them visually cohesive while meeting different contrast requirements.

---

## Anti-patterns — stop if you catch yourself doing these

These come from CLAUDE-CODE-OPERATING-RULES.md Section 5, applied to the Tailor context:

| If you're about to write... | The system already provides... |
|----------------------------|-------------------------------|
| `color: #fff` or `color: white` | `var(--text-on-dark)` or `var(--text-heading-on-dark)` |
| `color: rgba(255, 255, 255, 0.7)` | An `--on-dark-*` opacity token (grep `--on-dark-`) |
| `background: rgba(0, 0, 0, X)` | A glass class or surface variant |
| `border-radius: 8px` | `var(--radius-md)` or equivalent |
| `padding: 16px` | `var(--space-global-sm)` |
| `font-size: 14px` | A token from the appropriate type scale |
| `display: flex; flex-direction: column; border-radius; overflow: hidden` | `.card` |
| `backdrop-filter: blur` | `.glass`, `.glass--strong`, or `.glass--solid` |
| `translateY` + `box-shadow` on hover | `.card--lift` |
| `.btn--outline` for any secondary button | `.btn--tint` (the actual default) |
| Mixing button families (`--white-tint` next to `--primary`) | Stay inside one family — standard OR white |
| Custom focus ring | `var(--focus-ring)` / `var(--focus-ring-on-dark)` |
| A hand-rolled colour derivation | A `-soft`, `-strong`, or `-on-dark` sibling that already exists |
| `.alert__dismiss` on A8 or A9 components | Nothing — these must never be dismissible |
| `--border-radius-*` | `--radius-*` (correct prefix) |
| `--box-shadow-*` | `--shadow-*` (correct prefix) |
| `--z-index-*` | `--z-*` (correct prefix) |
| `--spacing-*` | `--space-*` (correct prefix) |
| `var()` nested three levels deep | Maximum two levels: `var(--a)` → `var(--b)` → raw value |

---

## Page build patterns (from SYSTEM-RULES.md Sections 35.1–35.10)

These apply to every page on the Tailor site. They prevent the most common layout bugs.

### The reset

Already included in the CSS. Don't rely on browser defaults for spacing.

### Section header pattern

```css
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;          /* NOT flex-end */
  gap: var(--space-global-xl);
  margin-bottom: var(--space-global-xl);
}
```

**Critical:** Set `margin-bottom: 0` on headings inside flex containers (prevents height inflation). Set `margin: 0` on `<p>` elements that are direct flex children.

### Signpost vs Preheader

| Class | Size | Margin below | Use case |
|-------|------|-------------|----------|
| `.signpost` | `--text-card-size-h5` (1rem) | 4px | Above section headings (h2, h3). Default choice. |
| `.preheader` | `--text-card-size-h4` (~1.05–1.15rem) | 8px | Above h1/display headings. Heroes and major CTAs only. |

### Paragraph colour cascade

Set `--text-muted` as the base paragraph colour once. Only declare colour on paragraphs when it differs (e.g. on dark surfaces). Never repeat `color: var(--text-muted)` in section-specific rules.

### Template structure

- **One `<main>` element per page.** Page templates must NOT create a second `<main>`.
- **Sections are full-width.** A `.container` class inside constrains content width.
- **Section vertical spacing** uses structural tokens: `--space-struct-y-hero` for hero sections, `--space-struct-y-base` for standard sections.

### Specificity rules

- Contextual `p` rules (e.g. `.section-name p`) beat single-class utility rules like `.signpost`. Always exclude utility classes: `.section-name p:not(.signpost):not(.preheader)`.
- No redundant `color: var(--text-muted)` — the base rule handles it.

### Responsive breakpoints

Use raw pixel values in `@media` with a comment naming the token:

```css
@media (max-width: 1024px) { /* --bp-lg */ }
@media (max-width: 768px)  { /* --bp-md */ }
@media (max-width: 640px)  { /* below --bp-md, mobile */ }
@media (max-width: 480px)  { /* --bp-sm */ }
```

---

## Token naming conventions

| Prefix | Purpose |
|---|---|
| `--brand-*` | Brand primitives and relational variants (includes `-soft`, `-strong`, `-text`, HSL components) |
| `--text-*` | Text colours (body, heading, muted, on-dark) |
| `--bg-*` | Background colours |
| `--neutral-*` | Neutral scale (100–900) |
| `--state-*` | UI feedback states (success, warning, error, info) |
| `--safeguarding-*` | Content safeguarding tones (support, ageflag, crisis) |
| `--cat-*` | App RSHE category colours (7 categories) |
| `--ota-cat-*` | Okay to Ask browsing/book category colours (7 categories) |
| `--font-tailor-*` | Tailor layer font stacks |
| `--font-ota-*` | Okay to Ask layer font stacks |
| `--font-shell-*` | Shell (header/footer) font stacks |
| `--text-ota-*` | Okay to Ask text colour aliases |
| `--bg-ota-*` | Okay to Ask surface colours |
| `--surface-ota-*` | Okay to Ask motif colours (post-it) |
| `--link-ota-*` | Okay to Ask link colour overrides |
| `--toggle-mode-*` | Simple Mode toggle styling |
| `--btn-*` | Button tokens |
| `--card-*` | Card tokens |
| `--alert-*` | Alert tokens |
| `--badge-*` | Badge tokens |
| `--chip-*` | Chip tokens |
| `--toast-*` | Toast tokens |
| `--modal-*` | Modal tokens |
| `--space-*` | Spacing scale (global and structural) |
| `--radius-*` | Border radius scale |
| `--shadow-*` | Elevation scale |
| `--border-*` | Border colours and widths |
| `--z-*` | Z-index scale |
| `--transition-*` | Transition timing |

**Important:** Token names in `tailor-site-v2.css` may differ from the original GDH master names. Always grep the actual file — don't trust this list blindly, use it as a pattern guide.

---

## Extending the system

If a component doesn't exist in the CSS, you may add it — following these rules from CLAUDE-CODE-OPERATING-RULES.md Section 7:

- **Generic component** (would be useful on a completely different project) → add to `tailor-site-v2.css` following BEM-like pattern, define token family in `:root` first, consume primitive tokens, include all states, handle reduced motion.
- **Project-specific component** (app sidebar, editor layout, etc.) → add to project CSS, same naming and token rules.

**When in doubt, ask before creating a new component class.**

---

## Existing code — how to handle violations

When you encounter existing code that violates these rules (from CLAUDE-CODE-OPERATING-RULES.md Section 9):

- **Flag it** clearly
- **Propose the correction** using the right token or class, with a one-line explanation
- **Wait for confirmation** before sweeping refactors

Surface violations as you find them, but don't auto-rewrite the whole codebase in one pass.

---

## What this CSS does NOT include

- **Layout system** — no grid classes, no container widths, no responsive layout utilities. These are handled by Astro components and Tailwind (for layout only; all colour, typography, and component styling via CSS custom properties).
- **Page-level composition** — the CSS provides tokens and component classes, not full page layouts. Each page template (C1, C2, C3, C4, C5) needs its own layout composition.
- **Simple Mode JS logic** — the CSS provides toggle styling tokens. The text-swap behaviour is a JS concern.
- **Glossary tooltip (A7)** — needs its own component design. Use existing token vocabulary for styling.
- **Search (A4, A5, B10)** — needs its own component design.
- **Mega menu (D8)** — needs its own component design.

### Master components NOT currently in the Tailor fork

`SYSTEM-RULES.md` describes the full Guess Design House component library. This fork only includes what the site actually uses. The following master components are **documented but not ported** — their classes and tokens don't exist in `tailor-site-v2.css`. If a feature needs one, add it following the extension rules in `CLAUDE-CODE-OPERATING-RULES.md` §7 (define the token family in `:root` first, follow the BEM-like class pattern, include all states, handle reduced motion).

| Master component | Docs section | Notes |
|---|---|---|
| `.modal` | SYSTEM-RULES §27 | No modal flows on the current site. |
| `.toast` | SYSTEM-RULES §21.5 | No toast flows on the current site. |
| `.progress` | SYSTEM-RULES §26 | No progress bars on the current site. |
| `.pagination` | SYSTEM-RULES §28 | Site uses bespoke `.blog-pagination` instead. |
| `.form-toggle` / `.form-range` | SYSTEM-RULES §19 | Simple Mode uses `.mode-toggle` (different pattern). |
| `.split-layout` | operating rules §1 | Site uses Tailwind utilities for 2-col layouts. |
| `.page-nav` | operating rules §1 | No sticky sub-nav on the current site. |
| `.skip-to-content` | operating rules §1 | Accessibility gap — worth adding. |
| `.legal-header` / `.legal-body` | SYSTEM-RULES §29 | `/privacy` and `/accessibility` are bespoke. |
| `.error-page` | SYSTEM-RULES §31 | `/404` uses bespoke `.error-404`. |
| `.search-page` / `.search-empty` | SYSTEM-RULES §31 | `/search` uses bespoke composition. |
| `.doc-row` / `.doc-locked` | SYSTEM-RULES §30 | No download lists or gated panels on the current site. |

### Known drift targets (existing bespoke components that reinvent system ones)

These are in-site components that duplicate functionality the design system already provides. Each is a refactor candidate — swap the bespoke class for the system component + a thin layout hook, remove the redundant CSS.

| Bespoke class | Where | Should consume | Status |
|---|---|---|---|
| ~~`.blog-filter-chip`, `.testimonial-filter-chip`~~ | ~~blog index, testimonials~~ | `.chip` + `.chip.is-active` | ✓ done (see `--chip-*` tokens added to the CSS). |
| ~~`.site-header__skip-link`~~ | ~~SiteHeader~~ | `.skip-to-content` | ✓ done (promoted to global class in tailor-site-v2.css). |
| `.topic-chip` | ServiceTopicsStrip | — | **Left bespoke.** A nav link to a topic page, not an interactive "selectable tag." Doesn't match the `.chip` system definition. |
| `.blog-pagination` | blog index | `.pagination` | Deferred — `.pagination` not yet in the Tailor fork. Port the master component first, then migrate. |
| `.error-404` | /404 | `.error-page` | Deferred — `.error-page` not yet in the Tailor fork. Port first, then migrate. |

### Specialised cards (NOT drift — left bespoke by design)

Earlier audits flagged these as "bypassing `.card` BEM." On closer review they are **specialised designs with their own typography, surface, and structural needs**, not reinvention of the generic card. Refactoring each to compose with `.card` + override class would add markup wrappers (`.card__body`, etc.) and a near-equal amount of override CSS — no net hygiene win. Leave bespoke unless a specific case genuinely matches the generic `.card` shape (title + text + optional image + action link at card-scale typography).

| Class | Why it's specialised |
|---|---|
| `.feature-card` | Large-format title + body on bordered surface; no image, no action, padding is lg not card-default. |
| `.service-card` / `.service-card--flagship` / `.service-card--secondary` | Card-like but with two distinct visual hierarchies (flagship vs secondary) and a bespoke hover treatment. |
| `.b11-sample-card` | Post-it image framing is intrinsic to the OtA identity; the whole card IS the post-it. |
| `.topic-hub-card` | Illustration + `--cat-color` category theming via inline custom property. |
| `.blog-index-card` | Image + eyebrow + title + meta block; close match to `.card` but CSS lives in 3 pages with small structural variance — refactor isn't worth the risk. |
| `.testimonial-card` | Quote + attribution pattern, not a title-body-action card. |
| `.glossary-term-card` | Term + definition pattern; the typographic design is the point. |
| `.about-team-card` | Portrait + name + bio team-member layout. |

### Genuinely absent (no local usage)

| Master component | Status in site |
|---|---|
| Decorative `.spot-icon` (36–64px illustrations) | Site uses photos for hero imagery and 16–24px Lucide-style icons for UI. No 48px decorative icons in any page. `.spot-icon` CSS is present for future use but has zero markup uses today. |

---

## Self-check before shipping any CSS change

- [ ] Did I grep `tailor-site-v2.css` before writing this?
- [ ] Is every value a `var(--token)` (no hardcoded colours, sizes, or spacing)?
- [ ] Does my button choice match the preference order (tint first, then primary, outline last)?
- [ ] On dark surfaces, am I using the `*-on-dark` variants and not white/rgba overrides?
- [ ] Am I using the right button family (standard on most surfaces, white only on brand-accent surfaces)?
- [ ] If I added motion, did I add the `prefers-reduced-motion` override?
- [ ] Do all interactive elements have a visible focus indicator?
- [ ] Did I avoid `!important`?
- [ ] If I added a new component, does it follow the naming pattern and live in the right file?
- [ ] Is there only one `<main>` element on the page?
- [ ] Do headings inside flex/grid containers have `margin-bottom: 0`?
- [ ] Do `<p>` elements as direct flex children have `margin: 0`?
- [ ] Are safeguarding components (A8, A9) free of dismiss buttons?
- [ ] Am I using the correct category colour system (`--ota-cat-*` for OtA, `--cat-*` for app)?
- [ ] Do contextual `p` rules exclude `.signpost` and `.preheader` with `:not()`?

---

*Document version: 2.2 | Date: 15 April 2026 | Supersedes: v2.1 (15 April 2026)*
*v2.2 changelog: migrates `.blog-filter-chip` / `.testimonial-filter-chip` to*
*`.chip` + `--chip-*` tokens; promotes `.site-header__skip-link` to global*
*`.skip-to-content`. Splits the "known drift targets" table into genuine drift*
*(refactored) and specialised bespoke cards (left as-is with rationale).*
*Audited against: SYSTEM-RULES.md and CLAUDE-CODE-OPERATING-RULES.md*
