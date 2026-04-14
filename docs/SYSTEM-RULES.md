# Guess Design House — Design System Rules

> **Purpose**: This file is a system prompt for any AI that needs to build pages, templates, or components using the Guess Design House design system. Hand this to any LLM alongside the master CSS when asking it to write markup or styles. The system is **platform-agnostic** — it works on WordPress, Next.js, static HTML, or any project that renders CSS in a browser.
>
> **Source of truth**: `guess-design-house-master.css` — a single CSS file that defines every token and component class. Nothing exists outside this file.


## 1. The One Rule That Governs Everything

**Every visual value must reference a design token.** No hardcoded colours, font sizes, spacing values, border radii, or shadows anywhere in component CSS or inline styles. If a value doesn't have a token, create one first — then use it.

```css
/* WRONG */
.my-thing { border-radius: 8px; padding: 1.5rem; color: #2463eb; }

/* RIGHT */
.my-thing { border-radius: var(--radius-md); padding: var(--space-global-md); color: var(--brand-accent); }
```


## 2. Token Architecture

The system uses CSS custom properties (`:root` variables) organised into two layers:

### Layer 1 — Primitive tokens (raw values)
These are the base values. Brand colours, the neutral scale, the spacing scale, the radius scale, the shadow scale, the type scales. They rarely appear directly in component CSS.

### Layer 2 — Semantic / component tokens (aliases)
These reference the primitives and carry meaning: `--btn-primary-bg`, `--card-radius`, `--surface-padding`, `--link-action-color`. Component classes consume these.

### The dependency chain matters more than the values
When you change `--brand-accent`, everything downstream updates: `--btn-primary-bg`, `--btn-tint-bg`, `--link-action-color`, `--spot-icon-color`, `--focus-ring`, and so on. Understand the chain before you touch a root token.

Key propagation paths:

```
--brand-accent
  ├── --btn-primary-bg (and H/S/L children)
  │     ├── --btn-tint-bg (20% opacity of primary)
  │     └── --btn-outline-bg-hover (8% opacity of primary)
  ├── --link-action-color (via --brand-accent-text)
  ├── --focus-ring
  ├── --spot-icon-color
  ├── --spot-icon-bg (10% opacity tint)
  ├── --badge--accent background (10% opacity)
  └── --card__eyebrow color (via --brand-accent-text)

--brand-accent-text (lightness-clamped for WCAG AA on white)
  ├── --link-default
  ├── --link-action-color
  ├── --btn-tint-text
  └── --btn-outline-text
```


## 3. Naming Conventions

### Component-first prefixes
All component tokens use the component name as prefix. This gives IDE autocomplete discoverability — type `--btn-` and see every button token.

```
--btn-primary-bg          (not --primary-button-bg)
--btn-padding-y           (not --padding-button-y)
--card-radius             (not --radius-card)
--alert-padding-y         (not --padding-alert-y)
--spot-icon-size          (not --icon-spot-size)
```

### Short semantic prefixes for shared scales
Shared scales use the shortest unambiguous prefix:

```
--radius-*      (not --border-radius-*)
--shadow-*      (not --box-shadow-*)
--z-*           (not --z-index-*)
--bp-*          (not --breakpoint-*)
--space-*       (not --spacing-*)
```

### Variant suffixes
Variants are appended with a double-dash in class names and a dash in token names:

```css
/* Classes: BEM-like */
.btn--primary   .btn--tint   .btn--sm   .card--lift   .surface--dark

/* Tokens: dashes */
--btn-primary-bg   --btn-tint-bg   --glass-tint-dark
```

### HSL component exposure
Any colour that needs runtime manipulation exposes `-h`, `-s`, `-l` (and optionally `-a`) siblings:

```css
--brand-accent: #2463eb;
--brand-accent-h: 221;
--brand-accent-s: 84%;
--brand-accent-l: 53%;
```

This allows downstream tokens to construct `hsla()` values at any opacity without duplicating the base colour.


## 4. Brand Customisation (Per-Client Theming)

Only three hex values change per brand:

```css
--brand-primary: #2463eb;    /* hero backgrounds, large areas */
--brand-secondary: #3f3f46;  /* dark neutral, secondary text areas */
--brand-accent: #2463eb;     /* action colour: buttons, links, focus rings */
```

Update the hex AND the matching `-h`, `-s`, `-l` components. Everything else cascades automatically through `calc()` and `hsl()` derivations:

- `-soft` = H same, S −33%, L +25%
- `-strong` = H same, S +4%, L −20%
- `-text` = H same, S same, L clamped to max 45% (WCAG AA guarantee)


## 4b. Extending the Master

When a project needs a component the master doesn't have, decide where it belongs:

- **Generic component** (toast, modal, toggle switch, progress bar, interactive chip) → Add it to `guess-design-house-master.css`, following the same naming conventions and token patterns. Update this file and `CLAUDE.md` to document it.
- **Project-specific component** (app sidebar, bottom tray, editor layout, drag-to-reorder) → Keep it in the project's own CSS. Still use design system tokens for all values.

The test: "Would this component be useful on a completely different project?" If yes, it belongs in the master.

When adding to the master:
1. Define component tokens in `:root` (e.g. `--toast-*`, `--modal-*`)
2. Use primitive tokens as values (e.g. `--toast-radius: var(--radius-md)`)
3. Follow the BEM-like class pattern (`.component`, `.component__element`, `.component--modifier`)
4. Include all interactive states (hover, focus, active, disabled) where applicable
5. Handle `prefers-reduced-motion` for any transitions
6. Add a corresponding section to this file documenting the component


## 5. Colour System

### Brand colours (change per client)
`--brand-primary`, `--brand-secondary`, `--brand-accent` — each with `-soft`, `-strong`, and HSL component variants.

### Neutral scale (shared across all brands)
`--neutral-100` through `--neutral-900` — zinc-based. Used for backgrounds, borders, disabled states.

### Background tokens
`--bg-page` (white), `--bg-surface` (off-white), `--bg-surface-alt` (slightly darker), `--bg-subtle` (zinc-200).

### Text tokens
`--text-body` (zinc-900), `--text-body-muted`, `--text-heading`, `--text-heading-muted`, `--text-on-dark`, `--text-heading-on-dark`.

### State colours
Four semantic states, each with base, `-soft` (background), and `-text` (foreground) variants:
`--state-success-*`, `--state-warning-*`, `--state-error-*`, `--state-info-*`

### Border tokens
`--border-subtle` (light), `--border-strong` (medium), plus `-on-dark` variants of each.


## 6. Typography System

### Three type scales for three contexts

| Scale | Token prefix | Use case |
|-------|-------------|----------|
| Display | `--text-display-size-*` | Landing pages, heroes, marketing |
| Prose | `--text-prose-size-*` | Blog posts, long-form content |
| Card | `--text-card-size-*` | Cards, compact UI, dashboards |

Each scale provides: `h1` through `h6`, `body`, and `quote` (display/prose) sizes. Card scale is one semantic step smaller than prose.

All heading sizes use `clamp()` for fluid responsive scaling. The formula pattern is:
```
clamp(min-rem, calc-expression, max-rem)
```

### Utility text classes
These are fully-tokenised classes with size, weight, line-height, and letter-spacing:

| Class | Purpose |
|-------|---------|
| `.signpost` | Uppercase label above section headings (h2, h3). Size: `--text-card-size-h5` (1rem), tight 4px margin. Use by default. Margin resets browser `<p>` default. |
| `.preheader` | Larger uppercase label above h1/display headings. Size: `--text-card-size-h4` (~1.05–1.15rem), 8px margin. Heroes and major CTAs only. Margin resets browser `<p>` default. |
| `.hero-subhead` | Subtitle beneath hero headings |
| `.subheading` | Section subtitles |
| `.lede` | Opening paragraph emphasis |
| `.microtext` / `small` | Fine print, captions |

### Button typography
Buttons have their own tokens: `--btn-font-size` (fluid clamp), `--btn-font-weight` (700), `--btn-ls` (0.01em), `--btn-lh` (1).


## 7. Spacing System

### Global grid scale (rem-based, for gaps / margins / component padding)
```
--space-global-xs:  0.5rem
--space-global-sm:  1rem
--space-global-md:  1.5rem
--space-global-lg:  2rem
--space-global-xl:  3rem
--space-global-2xl: 5rem
--space-global-gutter: clamp(0.75rem, 2vw, 2rem)
```

### Structural spacing (fluid, for section-level layout)
```
--space-struct-x:      clamp(1rem, 5vw, 15vw)
--space-struct-y-hero: clamp(6rem, 8vw + 3rem, 10rem)
--space-struct-y-base: clamp(4rem, 5vw + 2rem, 6rem)
```

### Button spacing (em-based, scales with font size)
Standard: `--btn-padding-y` (0.8em), `--btn-padding-x` (1.6em), `--btn-padding-bal` (1.2em), `--btn-padding-icon` (2.5em)
Small (`-sm`): `--btn-padding-y-sm` (0.6em), `--btn-padding-x-sm` (1.4em), `--btn-padding-bal-sm` (1em), `--btn-padding-icon-sm` (2.2em)


## 8. Border Radius Scale

```
--radius-none:   0px
--radius-xs:     2px
--radius-sm:     4px      (buttons, form inputs, badges)
--radius-md:     8px      (spot icons, alerts)
--radius-lg:     16px     (cards, surfaces)
--radius-xl:     32px
--radius-pill:   9999px   (pill badges, rounded buttons)
--radius-circle: 50%      (avatars, spot icon circle variant)
```


## 9. Shadow / Elevation Scale

### Component scale (general use)
```
--shadow-none
--shadow-xs    (barely perceptible)
--shadow-sm    (subtle lift — use sparingly)
--shadow-md    (elevated cards, dropdowns)
--shadow-lg    (hover states, modals)
--shadow-xl    (popovers, high-emphasis)
```

### Button scale (tighter spread, smaller blur)
```
--btn-shadow-sm
--btn-shadow-md
--btn-shadow-lg
```


## 10. Z-Index Scale

```
--z-base:     1      (default stacking)
--z-sticky:   100    (sticky headers)
--z-dropdown: 400    (dropdowns, popovers)
--z-overlay:  500    (overlays, backdrops)
--z-modal:    600    (modal dialogs)
--z-toast:    700    (toast notifications, topmost)
```

Never use arbitrary z-index values. Always reference a token from this scale.


## 11. Breakpoints

```
--bp-sm:  480px
--bp-md:  768px
--bp-lg:  1024px
--bp-xl:  1280px
```

**Important**: CSS custom properties cannot be used inside `@media` rules. These tokens are reference values for documentation and JavaScript. In `@media` queries, use the raw pixel values directly:

```css
@media (max-width: 768px) { /* --bp-md */ }
```

Always add a comment noting which token the value corresponds to.


## 12. Transitions

All interactive elements share timing:
```
--transition-duration: 0.25s
--transition-easing: ease
```

Pattern for transition declarations:
```css
transition: property var(--transition-duration) var(--transition-easing);
```

Always respect `prefers-reduced-motion: reduce` by setting `transition: none` inside a `@media` block.


## 13. Components — Decision Tree

Use this to pick the right component:

```
Need a container?
├── Standalone with its own background/padding? → SURFACE
├── Plural items in a grid? → CARD
├── Full-width page-level row? → SECTION (Divi row/section)
└── Frosted glass overlay? → GLASS (modifier on surface or card)

Need a call to action?
├── Primary action (high emphasis)? → .btn--primary
├── Secondary (lower emphasis)?
│   ├── Translucent brand tint? → .btn--tint
│   └── Bordered, no fill? → .btn--outline
├── On a brand-coloured background?
│   ├── Solid white? → .btn--white-primary
│   ├── Translucent white? → .btn--white-tint
│   └── White border only? → .btn--white-outline
├── Minimal, no visual weight? → .btn--text
└── Inactive/locked? → .btn--disabled

Need a link?
├── Within body text? → .link-inline
└── Standalone action trigger ("Read more →")? → .link-action

Need an icon?
├── Functional UI icon (16px, interactive)? → Lucide icon, .icon-ui-* class
└── Decorative illustration (36–64px, card headers)? → .spot-icon

Need feedback?
├── Inline status label? → .badge / .badge--{variant}
└── Block-level message? → .alert / .alert--{variant}

Need a page-level layout?
├── Legal / policy / terms page? → .legal-header + .legal-body
├── 404 / error page? → .error-page + .error-page__suggestions
├── Search results page? → .search-page + .search-results / .search-empty
├── Downloadable file list? → .doc-list + .doc-row
├── Gated / members-only panel? → .doc-locked
└── Page navigation numbers? → .pagination
```


## 14. Button Component

### Class structure (always combine these)
```
.btn              — base (font, cursor, transition, border-style)
.btn--std         — standard size (padding, border-width)
.btn--sm          — small size (tighter padding, 90% font)
.btn--{style}     — colour: primary, tint, outline, text, white-primary, white-tint, white-outline, disabled
.has-icon-right   — persistent right arrow
.has-icon-left    — persistent left arrow
.has-icon-hover   — right arrow that reveals on hover
```

**Example markup:**
```html
<a class="btn btn--std btn--primary has-icon-hover">Get Started</a>
<a class="btn btn--sm btn--outline has-icon-right">Learn More</a>
```

### Padding model (the key concept)
Without icon: symmetric padding (`--btn-padding-y` / `--btn-padding-x`).
With icon: icon side gets `--btn-padding-icon` (wider), opposite side gets `--btn-padding-bal` (slightly reduced, keeps text visually centred).
Hover-icon: symmetric at rest; animates to asymmetric on hover as the arrow fades in.

### Border model
All styles use `border-style: solid` on `.btn` base. Primary and Tint use an invisible border (colour matches bg) so the box model stays identical to Outline — no layout shift when mixing styles side by side.

### Icon model
Icons are CSS `::after` (right/hover) or `::before` (left) pseudo-elements using inline SVG data URIs (24×24 viewBox, 1.5px stroke, round caps, miter joins). Absolutely positioned — they don't push the text. Background uses `currentColor` with CSS mask.

### On-dark variants
Tint and Outline both have `-on-dark` token sets. **These wire automatically**: any `.btn--tint` or `.btn--outline` placed inside a `.surface--dark` parent inherits the on-dark variant via `.surface--dark .btn--tint` / `.surface--dark .btn--outline` selectors. No modifier class needed. The `-on-dark` tokens derive from `--brand-accent-soft` (lighter, higher-lightness variant).

### Disabled state
`.btn--disabled` provides the visual styling (muted background, `not-allowed` cursor, reduced opacity). But visual styling alone does not communicate disabled state to assistive technology. Always pair the class with the correct accessibility attribute:

- **`<button>` elements**: use the native `disabled` attribute. This prevents interaction and announces "dimmed" / "unavailable" to screen readers automatically.
- **`<a>` elements**: use `aria-disabled="true"`. Links cannot use the native `disabled` attribute. Also remove the `href` or set `href="javascript:void(0)"` to prevent navigation, and add `tabindex="-1"` if the link should be removed from the tab order.
- **Never rely on `pointer-events: none` alone** — it prevents mouse interaction but does nothing for keyboard users or screen readers.

```html
<!-- Button: use native disabled -->
<button class="btn btn--std btn--disabled" disabled>Unavailable</button>

<!-- Link: use aria-disabled + remove href -->
<a class="btn btn--std btn--disabled" aria-disabled="true" tabindex="-1">Sold Out</a>
```

### Divi override block
When using buttons inside Divi modules, add your btn classes to the module's CSS Class field. The `.et_pb_button.btn` reset block in the master CSS strips Divi's defaults so the design-system tokens take full control.


## 15. Card Component

### Structure
```html
<div class="card">
  <div class="card__img"><img src="..." alt="..."></div>
  <div class="card__body">
    <span class="card__eyebrow">Category</span>
    <h3 class="card__title">Title</h3>
    <p class="card__text">Description</p>
    <a class="card__link" href="#">Read More</a>
  </div>
</div>
```

### Tokens
`--card-radius` (lg), `--card-padding` (md), `--card-gap` (sm), `--card-shadow` (none), `--card-bg` (page), `--card-border` (none), `--card-img-ratio` (56.25% = 16:9). Cards have no border and no resting shadow by default. Shadow appears on hover via `.card--lift`. Override the tokens per-context if a specific card needs a border or resting shadow.

### Layout variants
- **Vertical** (default): image on top, content below
- **Horizontal** (`.card--horizontal`): image left (40%), content right (60%). Stacks on mobile.
- **Horizontal reverse** (`.card--horizontal-reverse`): image right
- **Thumbnail** (`.card--thumbnail`): small 120px square image left, compact

### Interaction variants
- `.card--lift`: no shadow at rest, lifts + shadow on hover
- `.card--reveal`: transparent at rest, reveals bg + shadow on hover
- `.card--ghost`: no background, no border, no shadow — pure content


## 16. Surface Component

**Rule**: if it's a singular standalone container with its own background and padding, it's a surface. If it's plural and in a grid, it's a card. If it's a full-width page-level row, it's a section.

### Structure
```html
<div class="surface surface--light">
  <!-- any content: text, buttons, cards, forms -->
</div>
```

### Variants
- `.surface--light`: `--bg-surface` (off-white)
- `.surface--alt`: `--bg-surface-alt` (slightly darker)
- `.surface--dark`: `--neutral-900`, text flips to `--text-on-dark`
- `.surface--brand`: `--brand-accent` background, white text
- `.surface--bordered`: adds subtle border (optional modifier)

### Tokens
`--surface-padding` (xl = 3rem), `--surface-radius` (lg = 16px).


## 17. Glass (Glassmorphism) Modifier

`.glass` is a universal modifier — apply it to any container (surface, card, nav, modal).

**Important naming distinction**: `.glass` = glassmorphism backdrop-filter blur effect. `.btn--tint` = translucent brand-coloured button background. These are different things — do not confuse them.

### Variants

Three intensity levels, each available in light and dark modes:

| Modifier | Light tint | Dark tint | Use case |
|----------|-----------|-----------|----------|
| `.glass` | 0.15 | 0.25 | Atmospheric, decorative — nav overlays, subtle panels |
| `.glass--strong` | 0.35 | 0.45 | Semi-readable — panels on busy backgrounds |
| `.glass--solid` | 0.75 | 0.75 | Content-heavy — hero cards, modals over images, anything with body text that must pass WCAG contrast |

Combine with `.glass--dark` for dark-tinted variants: `.glass.glass--dark`, `.glass--dark.glass--strong`, `.glass--dark.glass--solid`.

### Decision tree

```
Need frosted glass?
├── Decorative / atmospheric only? → .glass
├── Some text but background still visible? → .glass.glass--strong
├── Body text / headings that must be readable? → .glass.glass--solid
└── Dark overlay variant needed? → add .glass--dark to any of the above
```

### Tokens
`--glass-blur` (12px), `--glass-tint-light`, `--glass-tint-light-strong`, `--glass-tint-light-solid`, `--glass-tint-dark`, `--glass-tint-dark-strong`, `--glass-tint-dark-solid`, `--glass-border-light`, `--glass-border-light-solid`, `--glass-border-dark`, `--glass-border-dark-solid`, `--glass-shadow`, `--glass-shadow-dark`.

### Requirements
The element needs something behind it (image, gradient, colour) for the blur to have something to frost. Includes `@supports` fallback for browsers without `backdrop-filter`. The `--solid` fallback raises opacity further (0.88 light / 0.85 dark) to guarantee readability without blur.


## 18. Accordion Component

Built on native `<details>/<summary>` — no JavaScript required. Smooth expand via `grid-template-rows: 0fr → 1fr`.

### Structure
```html
<div class="accordion">
  <details class="accordion__item" name="group-name">
    <summary class="accordion__trigger">
      <span>Question text</span>
      <span class="accordion__icon"><!-- plus/minus SVG --></span>
    </summary>
    <div class="accordion__content">
      <div class="accordion__content-inner">
        <p>Answer text</p>
      </div>
    </div>
  </details>
</div>
```

Use shared `name` attribute on `<details>` for exclusive (one-open-at-a-time) grouping.


## 19. Form Components

### Classes
- `.form-group`: stacked label + input wrapper (flex column, gap)
- `.form-label`: label styling (+ `.required` span for asterisk)
- `.form-input`: text inputs and textareas
- `.form-select`: custom-styled select with SVG chevron arrow
- `.form-check`: checkbox/radio wrapper (flex row, gap)
- `.form-helper`: small help text below inputs
- `.form-toggle`: on/off switch (extends form system)
- `.form-range`: styled range slider input (extends form system)

### Validation states
Apply to the `.form-group` wrapper:
- `.form-group--error`: red border, error text colour
- `.form-group--success`: green border, success text colour
- `.form-group--disabled`: reduced opacity, not-allowed cursor

### Focus pattern
- `:focus` → border-color change (mouse + keyboard)
- `:focus-visible` → outline ring (keyboard only)


### Toggle Switch (`.form-toggle`)

On/off switch component for binary inputs.

#### Structure
```html
<div class="form-group">
  <label class="form-label" for="toggle-1">Enable notifications</label>
  <input type="checkbox" id="toggle-1" class="form-toggle">
</div>
```

#### Tokens
`--form-toggle-width` (48px), `--form-toggle-height` (24px), `--form-toggle-radius` (pill), `--form-toggle-bg` (neutral-300), `--form-toggle-bg-active` (brand-accent), `--form-toggle-thumb-size` (20px), `--form-toggle-thumb-bg` (white).

#### Interactive states
- `:checked` → background swaps to `--form-toggle-bg-active`, thumb slides to right
- `:hover` → shadow lift
- `:focus-visible` → focus ring
- `:disabled` → opacity reduced, `not-allowed` cursor
- Smooth transition using `--transition-duration` and respects `prefers-reduced-motion`


### Range Slider (`.form-range`)

Styled range input for numeric value selection.

#### Structure
```html
<div class="form-group">
  <label class="form-label" for="range-1">Difficulty</label>
  <input type="range" id="range-1" class="form-range" min="0" max="100">
</div>
```

#### Tokens
`--form-range-height` (4px), `--form-range-radius` (sm), `--form-range-bg` (neutral-300), `--form-range-fill-bg` (brand-accent), `--form-range-thumb-size` (20px), `--form-range-thumb-bg` (white), `--form-range-thumb-shadow` (shadow-md).

#### Interactive states
- Thumb scales up on `:hover`
- `:focus-visible` → focus ring around thumb
- `:disabled` → opacity reduced
- Track fill animates smoothly from 0% to current value position


## 20. Badge Component

Small inline labels for status, categories, or metadata.

### Structure
```html
<span class="badge badge--success">Active</span>
<span class="badge badge--pill badge--accent">New</span>
```

### Variants
Soft (tinted background): `--accent`, `--success`, `--warning`, `--error`, `--info`
Solid (filled background): `--solid-accent`, `--solid-success`, `--solid-error`
Shape: `--pill` (rounded ends)


## 20.5. Chip Component (Interactive)

Selectable, removable tags for filter multi-select and dynamic tag lists. **Distinct from `.badge`** — chips are interactive and stateful, badges are static labels.

### Structure
```html
<button class="chip">Design System</button>
<button class="chip chip--active">UI Kit</button>
<button class="chip chip--removable">Components <span class="chip__remove">&times;</span></button>
```

### Variants
- `.chip` — base, unselected state
- `.chip--active` — selected/activated state (brand-accent background)
- `.chip--removable` — includes a close button or remove affordance

### Tokens
`--chip-padding-x` (1rem), `--chip-padding-y` (0.6rem), `--chip-radius` (pill), `--chip-bg` (neutral-100), `--chip-color` (text-body), `--chip-active-bg` (brand-accent), `--chip-active-color` (text-on-dark).

### Interactive states
- `:hover` — background tint
- `:active` — slight scale reduction
- `:focus-visible` — focus ring from global `--focus-ring`
- Respects `prefers-reduced-motion` for any transitions


## 21. Alert Component

Block-level callouts for contextual messages.

### Structure
```html
<div class="alert alert--info">
  <span class="alert__icon"><!-- SVG --></span>
  <div class="alert__content">
    <div class="alert__title">Title</div>
    <div class="alert__body"><p>Message</p></div>
  </div>
  <button class="alert__dismiss">&times;</button>
</div>
```

### Variants
`--info`, `--success`, `--warning`, `--error` — each maps to the corresponding `--state-*` colour tokens.


## 21.5. Toast Component

Fixed-position notification stacks for temporary, non-blocking feedback. Distinct from `.alert` (block-level, persistent until dismissed).

### Structure
```html
<div class="toast toast--success" role="alert" aria-live="polite">
  <span class="toast__icon"><!-- SVG --></span>
  <div class="toast__body">Operation completed successfully</div>
  <button class="toast__dismiss" aria-label="Dismiss">×</button>
</div>
```

### Variants
`--success`, `--error`, `--info`, `--warning` — each maps to the corresponding `--state-*` colour tokens.

### Tokens
`--toast-padding` (md), `--toast-radius` (md), `--toast-shadow` (lg), `--toast-max-width` (400px), `--toast-z-index` (var(--z-toast) = 700).

### Layout and positioning
- Fixed positioning, bottom-right corner or stack-aware (app-specific)
- Auto-dismiss with timer (app handles via JavaScript)
- Stacks vertically with `gap: var(--space-global-sm)`
- Full-width at mobile, constrained at desktop

### Interactive states
- `:hover` → subtle lift via `--toast-shadow` or transform
- `:focus-visible` → focus ring
- Dismiss button hides icon on click, animates out
- Respects `prefers-reduced-motion` for animations


## 22. Table Component

### Structure
```html
<table class="table table--striped table--hover">
  <thead><tr><th>Header</th></tr></thead>
  <tbody><tr><td>Cell</td></tr></tbody>
</table>
```

### Modifiers
- `.table--striped`: alternating row backgrounds
- `.table--hover`: highlight row on hover
- `.table--bordered`: full cell borders
- `.table--compact`: reduced padding + smaller font

### On-dark
Tables inside `.surface--dark` automatically swap to dark-aware tokens (`--table-header-bg-on-dark`, `--table-stripe-bg-on-dark`, `--table-hover-bg-on-dark`).


## 23. Spot Icon Component

Decorative single-colour illustrations for card headers, feature grids, and empty states. **These are NOT functional UI icons** — use Lucide for that.

### Structure
```html
<span class="spot-icon" aria-hidden="true">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">...</svg>
</span>
```

### Sizes
- `.spot-icon` — 48px (default)
- `.spot-icon--sm` — 36px
- `.spot-icon--lg` — 64px

### Modifiers
- `.spot-icon--circle`: round container
- `.spot-icon--hoverable`: background darkens on hover
- `.spot-icon--on-dark`: lighter colour + darker tint for dark backgrounds
- `.spot-icon--neutral`: grey instead of brand colour

### SVG requirements
`viewBox="0 0 24 24"`, `stroke="currentColor"`, `stroke-width="1.5"`, `fill="none"` (or single fill at `--spot-icon-fill-opacity`).


## 24. Link Components

### Inline links (`.link-inline`)
For use within body text paragraphs. Subtle underline at rest (30% opacity), full underline on hover. Uses `--link-default` / `--link-hover` / `--link-visited`.

### Action links (`.link-action`)
Standalone triggers like "Read more →". Bold, no underline, arrow `::after` that nudges right on hover. Hover interaction is purely typographic: letter-spacing widens + arrow nudges right. No background change. Uses `--link-action-color` / `--link-action-color-hover`.

On dark surfaces, swap to `--link-action-color-on-dark` automatically via `.surface--dark .link-action` or `.on-dark .link-action`.

**Size variants** (lock to a type scale — base `.link-action` inherits from context):

| Modifier | Font size | Use case |
|----------|----------|----------|
| `.link-action--card` | `--text-card-size-body` | Card footers, compact sections, secondary CTAs alongside body text |
| `.link-action--display` | `--text-display-size-body` | Hero sections, large CTA areas, alongside display headings |

**Other modifiers:**
- `.link-action--no-arrow` — hides the `→` arrow.

**When to use `.link-action` vs `.btn--text`**: If the element has an arrow and no box/background on hover, use `.link-action`. If the element needs a visible hover container (subtle background tint), use `.btn--text`. The arrow is the deciding factor — don't combine `.btn--text` with `.has-icon-right` for links that should behave like action links.


## 25. Focus States

Global `:focus-visible` ring using `outline` (not box-shadow). Keyboard-only — mouse clicks won't trigger it.

Tokens: `--focus-ring` (brand-accent), `--focus-ring-width` (2px), `--focus-ring-offset` (2px), `--focus-ring-on-dark` (brand-accent-soft).

On dark surfaces, the ring automatically swaps via `.surface--dark :focus-visible` / `.on-dark :focus-visible`.


## 26. Progress Bar Component

Horizontal progress indicator for multi-step processes, file uploads, and loading states.

### Structure
```html
<div class="progress">
  <div class="progress__bar" style="width: 65%"></div>
</div>

<div class="progress progress--sm">
  <div class="progress__bar"></div>
</div>
```

### Variants
- `.progress` — standard height
- `.progress--sm` — compact height (use for dense layouts)

### Tokens
`--progress-height` (8px), `--progress-height-sm` (4px), `--progress-radius` (pill), `--progress-bg` (neutral-200), `--progress-bar-bg` (brand-accent), `--progress-bar-shadow` (none at rest, optional shadow on active).

### Interactive states
- Background bar is static (no state changes)
- Width updates via inline `style="width: X%"` or JavaScript
- Respects `prefers-reduced-motion` for any animated fills or striping

### Accessibility
- Use with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` on the container for screen readers
- Label with text or heading before the progress bar (e.g. "Upload progress: 65%")


## 27. Modal Component

Overlay dialog for focused, blocking interactions. Centered above the page with a semi-transparent backdrop.

### Structure
```html
<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="modal__overlay"></div>
  <div class="modal__dialog">
    <header class="modal__header">
      <h1 id="modal-title">Confirm Action</h1>
      <button class="modal__close" aria-label="Close">&times;</button>
    </header>
    <div class="modal__body">
      <p>Are you sure you want to proceed?</p>
    </div>
    <footer class="modal__footer">
      <button class="btn btn--std btn--outline">Cancel</button>
      <button class="btn btn--std btn--primary">Confirm</button>
    </footer>
  </div>
</div>
```

### Tokens
`--modal-z-index` (var(--z-modal) = 600), `--modal-backdrop-bg` (rgba from brand-secondary at 40% opacity), `--modal-width` (500px), `--modal-max-width` (90vw), `--modal-radius` (lg), `--modal-shadow` (lg), `--modal-padding` (xl = 3rem), `--modal-header-border` (neutral-200), `--modal-footer-gap` (md).

### Sub-components
- `.modal__overlay` — fixed backdrop, full viewport, semi-transparent (positioned behind dialog)
- `.modal__dialog` — centred container, max-width constrained, shadow elevated
- `.modal__header` — top section with title and close button, optional border-bottom
- `.modal__body` — scrollable content area
- `.modal__footer` — bottom section, typically flex row with buttons (gap-based spacing)
- `.modal__close` — close button (top-right), uses focus ring

### Interactive states
- Close button and overlay click dismiss the modal (app handles via JavaScript)
- `:focus-visible` on buttons inside modal gets focus ring
- Modal animates in with fade + slide (respects `prefers-reduced-motion`)
- Overlay prevents interaction with page below

### Accessibility
- Trap focus within modal (JavaScript responsibility)
- Set `aria-modal="true"` and link `aria-labelledby` to the title
- Close button has `aria-label="Close"`
- Announce modal open to screen readers


## 28. Pagination Component

WordPress-compatible numbered pagination with active state.

### Structure
```html
<nav class="pagination" aria-label="Page navigation">
  <div class="nav-links">
    <a class="prev" href="#">&laquo; Previous</a>
    <a href="#">1</a>
    <span class="current">2</span>
    <a href="#">3</a>
    <a class="next" href="#">Next &raquo;</a>
  </div>
</nav>
```

### Tokens
`--pagination-min-size` (40px), `--pagination-radius`, `--pagination-font-size`, `--pagination-font-weight`, `--pagination-color`, `--pagination-hover-bg`, `--pagination-hover-color`, `--pagination-active-bg` (brand-accent), `--pagination-active-color` (text-on-dark).

Override these in the child theme `:root` to customise pagination globally.

### Notes
- Centred by default via `justify-content: center`.
- `.current` span gets accent background — no additional modifier needed.
- Works with `the_posts_pagination()`, `paginate_links()`, and custom markup.


## 29. Legal Page Component

Prose-first layout for privacy policies, terms pages, cookie policies, and accessibility statements.

### Structure
```html
<section class="legal-header">
  <div class="container container--narrow">
    <h1>Privacy Policy</h1>
    <p class="legal-header__updated">Last updated 20 March 2026</p>
  </div>
</section>
<section class="legal-body">
  <div class="container container--narrow">
    <!-- prose content: h2, h3, p, ul, ol -->
  </div>
</section>
```

### Classes
- `.legal-header` — surface-coloured header with title and date.
- `.legal-header__updated` — micro-size muted timestamp.
- `.legal-body` — prose container with heading spacing and list indentation.
- `.legal-body a` — accent-coloured links with underline on hover.

### Notes
- Always pair with `.container--narrow` for optimal reading width.
- `h2` gets `margin-top: var(--space-global-xl)`, `h3` gets `var(--space-global-lg)`.
- Lists get `padding-left: var(--space-global-lg)` for indentation.


## 30. Document Row Component

Horizontal list-item pattern for downloadable resources, file directories, and structured item lists.

### Structure
```html
<div class="doc-list">
  <div class="doc-row">
    <div class="doc-row__icon">
      <svg>...</svg>
    </div>
    <div class="doc-row__body">
      <h3 class="doc-row__title"><a href="#">Document Title</a></h3>
      <p class="doc-row__summary">Brief description of the document.</p>
      <div class="doc-row__meta">
        <span class="doc-row__date">20 Mar 2026</span>
        <span class="doc-row__size">PDF · 1.2 MB</span>
      </div>
    </div>
    <div class="doc-row__action">
      <a href="#" class="btn btn--sm btn--tint">Download</a>
    </div>
  </div>
</div>
```

### Tokens
`--doc-row-bg` (bg-page), `--doc-row-radius` (radius-base), `--doc-row-icon-size` (40px), `--doc-row-icon-bg` (bg-surface), `--doc-row-icon-color` (brand-accent), `--doc-row-icon-radius` (radius-sm).

### Sub-components
- `.doc-list` — vertical flex container with gap.
- `.doc-row` — 3-column grid (icon · body · action). Hover shows `shadow-sm`.
- `.doc-row__icon` — square icon container with tinted background.
- `.doc-row__body` — min-width:0 text column containing title, summary, meta.
- `.doc-row__title` — card-h5 size, heading-coloured link.
- `.doc-row__summary` — muted body text.
- `.doc-row__meta` — inline flex row of date, size, badges.
- `.doc-row__action` — button/link slot, vertically centred.

### Locked content panel
For gated/members-only content behind a login wall:
```html
<div class="doc-locked surface surface--light">
  <div class="doc-locked__icon"><svg>...</svg></div>
  <p class="doc-locked__text">Sign in to access internal documents.</p>
  <div class="doc-locked__actions">
    <a href="#" class="btn btn--std btn--primary">Log in</a>
    <a href="#" class="link-action link-action--card">Join</a>
  </div>
</div>
```

### Responsive
At `640px` the grid collapses to single column, icon hides, action aligns left.


## 31. System Pages Component (404 & Search)

Reusable layouts for error pages, empty states, and search results.

### 404 / Error page structure
```html
<section class="error-page">
  <div class="container">
    <p class="preheader">404</p>
    <div class="error-page__illustration">
      <svg>...</svg>
    </div>
    <h1>Page not found</h1>
    <p class="error-page__message">The page you're looking for doesn't exist.</p>
    <form class="error-page__search" role="search">
      <input type="search" class="form-input" placeholder="Search...">
      <button class="btn btn--std btn--primary">Search</button>
    </form>
    <div class="error-page__actions">
      <a href="/" class="btn btn--std btn--primary">Go home</a>
      <a href="/contact" class="link-action link-action--card">Contact us</a>
    </div>
  </div>
</section>
<section class="error-page__suggestions">
  <div class="container">
    <p class="signpost">Try these instead</p>
    <div class="error-page__grid">
      <!-- 3 × .card.card--lift suggestion cards -->
    </div>
  </div>
</section>
```

### Search page structure
```html
<section class="search-page">
  <div class="container">
    <h1>Search results for "query"</h1>
    <form class="search-form-inline" role="search">
      <input type="search" class="form-input" value="query">
      <button class="btn btn--std btn--primary">Search</button>
    </form>
  </div>
</section>
<section class="search-results">
  <div class="container">
    <!-- result cards -->
  </div>
  <div class="search-results__pagination">
    <!-- .pagination component -->
  </div>
</section>
```

### Empty search state
```html
<section class="search-empty">
  <div class="container">
    <div class="search-empty__illustration"><svg>...</svg></div>
    <p class="search-empty__message">No results found. Try a different search term.</p>
    <div class="search-empty__links">
      <!-- 3 × .card.card--lift browse-suggestion cards -->
    </div>
  </div>
</section>
```

### Classes
- `.error-page` — centred hero with structural padding.
- `.error-page__illustration` — muted, low-opacity SVG slot.
- `.error-page__message` — display-body size, max-width 540px.
- `.error-page__search` — inline flex search (max-width 460px).
- `.error-page__actions` — centred flex row for buttons/links.
- `.error-page__suggestions` — section wrapper for suggestion cards.
- `.error-page__grid` — 3-column grid (collapses at 768px).
- `.search-page` — surface-tinted header with title + search form.
- `.search-form-inline` — flex search (max-width 500px).
- `.search-results` — results section with pagination slot.
- `.search-empty` — centred empty state with illustration + suggestions.
- `.search-empty__links` — 3-column grid (collapses at 768px).

### Notes
- Use `.preheader` for the "404" label (hero-level, above h1).
- Suggestion cards should use `.card.card--lift` from the card system.
- Inline search forms reuse `.form-input` from the forms system.


## 32. Anti-Patterns — Things You Must Never Do

1. **Never use a hardcoded colour, font-size, spacing value, radius, or shadow.** Always `var(--token)`.
2. **Never use `!important`.** If you need it, the cascade order is wrong — fix the specificity.
3. **Never nest `var()` references deeper than two levels.** E.g. `var(--a)` → references `var(--b)` → references a raw value. Three levels deep causes debugging nightmares and browser calc issues.
4. **Never use `--border-radius-*` tokens.** The correct prefix is `--radius-*`.
5. **Never use `--box-shadow-*` tokens.** The correct prefix is `--shadow-*`.
6. **Never use `--z-index-*` tokens.** The correct prefix is `--z-*`.
7. **Never use `--spacing-*` tokens.** The correct prefix is `--space-*`.
8. **Never use `.btn--glass` for button classes.** The correct class is `.btn--tint`. Glass (`backdrop-filter` blur) and tint (translucent brand background) are different concepts.
9. **Never create a new component with inline styles.** Extract tokens, create classes.
10. **Never place CSS custom properties inside `@media` conditions.** Use raw values with a comment.
11. **Never skip `prefers-reduced-motion: reduce` handling** for any component with transitions or animations.
12. **Never assume a heading size.** Always specify which scale — display, prose, or card.
13. **Never add `!important` to override Divi styles.** Use the `.et_pb_button.btn` reset pattern instead — higher specificity via compound selector.
14. **Beware WordPress body classes colliding with component classes.** WordPress adds classes like `search-results`, `error404`, `single-post` etc. to `<body>`. If a component class like `.search-results` matches a WP body class, scope it with `section.search-results` to avoid styling the body element. Always check `body_class()` output before naming components.


## 33. Divi Integration Notes (Legacy)

> **Note**: These rules apply to older projects that use Divi as a page builder. New projects use the GDH Starter theme (WordPress) or a non-WordPress platform. Retained here for reference on legacy Divi sites.

- **Button classes**: Add `btn btn--std btn--primary has-icon-hover` (or your variant) to the Divi module's Advanced > CSS ID & Classes field. The `.et_pb_button.btn` reset block strips Divi defaults.
- **Post Content Row Width**: `.et-db #et-boc .et-l .et-l--post .et_builder_inner_content .et_pb_row` is forced to `width: 100% !important` — this is the one permitted `!important` in the system (Divi override).
- **Divi's default arrow**: Suppressed via `.et_pb_button.btn:after, .et_pb_button.btn:before { display: none; }`. The design system's `.has-icon` classes handle all button icons.


## 34. File Structure

```
guess-design-house-master.css   ← Single source of truth (all tokens + components)
SYSTEM-RULES.md                 ← This file (AI-facing rules)
CLAUDE.md                       ← Project instructions for Claude sessions
brand-previewer.html            ← Interactive brand colour configurator + export tool
docs-site.html                  ← Human-readable documentation hub (standalone, own :root copy)
button-reference.html           ← Visual button reference page
card-reference.html             ← Visual card reference page
surface-reference.html          ← Visual surface reference page
elevation-reference.html        ← Visual shadow/elevation reference page
icon-style-sampler.html         ← Icon and spot-icon reference page
header-footer-options.html      ← Visual preview of header/footer variants (WordPress)
themes/gdh-starter/             ← WordPress parent theme (enqueues master CSS, layout, JS)
themes/gdh-starter-child/       ← WordPress child theme scaffold (duplicate per brand)
```

**Important**: `docs-site.html` has its own `:root` block with tokens copied from the master CSS. It does NOT import the master file. If you change a token in the master, you must also update the docs site.


## 35. Page Build Patterns

These patterns were established through real builds and apply to every project regardless of platform. They prevent the most common layout bugs.

### 29.1 The Reset

Every project should include this minimal reset (already in the WordPress parent theme's `theme-layout.css`). Do NOT rely on browser defaults for any spacing — they will fight you:

```css
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; }
h1, h2, h3, h4, h5, h6 { margin-top: 0; }
img, svg { display: block; max-width: 100%; }
```

### 29.2 Section Header Pattern (signpost + heading ↔ subtitle)

Many sections use a flex row with a signpost + heading on the left and a subtitle/description on the right. This is the standard pattern:

```css
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;          /* NOT flex-end */
  gap: var(--space-global-xl);
  margin-bottom: var(--space-global-xl);
}
.section-header h2 {
  font-size: var(--text-display-size-h2);
  font-weight: 700;
  margin-bottom: 0;             /* CRITICAL — prevents flex height inflation */
}
.section-header p {
  margin: 0;                    /* kill browser <p> margin */
  max-width: 400px;
}
```

**Why `margin-bottom: 0` on the heading**: The heading is typically the last child in its wrapper div. Its browser-default `margin-bottom` (~0.83em) inflates the wrapper height, which breaks `align-items: center` because centering happens relative to the tallest flex child. Zero it out, and the paragraph on the right will properly centre-align.

**Why `margin: 0` on the paragraph**: Same issue — browser-default `<p>` margin adds phantom height.

### 29.3 Signpost vs Preheader

Two separate classes with different purposes. Do not combine or interchange them.

| Class | Size | Margin below | Use case |
|-------|------|-------------|----------|
| `.signpost` | `--text-card-size-h5` (1rem) | 4px | Above section headings (h2, h3). Default choice. |
| `.preheader` | `--text-card-size-h4` (~1.05–1.15rem) | 8px (`--space-global-xs`) | Above h1/display headings. Heroes and major CTAs only. |

Both classes reset browser `<p>` margin to `0` and only set `margin-bottom`. An adjacent sibling rule zeros `margin-top` on h1–h4 that follow a signpost/preheader.

### 29.4 Paragraph Colour Cascade

Set `--text-muted` as the base paragraph colour once in your project's CSS:

```css
p, li, td, dd { color: var(--text-muted); }
```

Then in page CSS, only declare colour on paragraphs when it **differs** from the base (e.g. `--text-muted-on-dark` on dark surfaces). Never repeat `color: var(--text-muted)` in section-specific rules — it's redundant and creates maintenance debt.

### 29.5 Surface Class (not custom hero-card classes)

For any standalone container with its own background and padding, use `.surface` (optionally composed with `.glass` variants). Do NOT create one-off classes like `.hero-card` — the surface system already provides `padding: var(--surface-padding)` and `border-radius: var(--surface-radius)`. Add only page-specific positioning rules (max-width, z-index, position).

```html
<div class="surface glass glass--solid">
  <!-- hero content -->
</div>
```

### 29.6 Template Structure Rules

- **One `<main>` element per page.** In WordPress, the parent theme's `header.php` opens `<main id="content" class="site-content">`. In other frameworks, ensure your layout shell creates exactly one `<main>`. Page templates must NOT create a second `<main>` — use `<div>` if you need a wrapper inside.
- **Sections are full-width.** Each `<section>` (or `<header>` for the hero) spans the full viewport. A `.container` class inside constrains content width using `max-width: var(--layout-max-width)` (default 1400px). In the WordPress theme this is `width: 85%` (desktop) / `90%` (mobile). Other platforms should set up an equivalent container. Override `--layout-max-width` in your project's `:root` to change the site-wide ceiling.
- **Section vertical spacing** uses structural tokens: `--space-struct-y-hero` for hero sections, `--space-struct-y-base` for standard sections.

### 29.7 Flex/Grid Containers — Heading Margin Checklist

Before shipping any flex or grid layout that contains headings:

1. **Is there a heading inside a flex child?** → Set `margin-bottom: 0` on it (unless there's content below it that needs the margin).
2. **Is there a `<p>` element as a direct flex child?** → Set `margin: 0` on it.
3. **Is `align-items` correct?** → Use `center` for header rows. Only use `flex-end` if you specifically want baseline alignment AND have accounted for heading margins.

### 29.8 Specificity Rules for Page CSS

CSS load order (later wins at equal specificity):
```
gdh-master.css → [platform layout CSS] → [brand/project overrides]
```

For WordPress: `gdh-master.css → theme-layout.css → [brand child theme style.css]`
For Next.js/other: `gdh-master.css → [project globals.css with brand overrides]`

- Contextual `p` rules (e.g. `.section-name p`) have specificity 0-1-1, which beats single-class utility rules like `.signpost` (0-1-0). Always exclude utility classes: `.section-name p:not(.signpost):not(.preheader)`.
- Use `p.signpost` (0-1-1) as an escape hatch when signpost specificity needs boosting.

#### Astro-scoped CSS: the specificity gotcha

Astro's `<style>` blocks in `.astro` components are scoped by default — the compiler rewrites every selector to include a `[data-astro-cid-<hash>]` attribute selector on each compound. That attribute counts as a class for specificity purposes, which breaks the bare `p.classname` escape hatch above.

**Concrete example**: in a component scoped with `data-astro-cid-abc123`:

| Source selector | Astro rewrites to | Specificity |
|---|---|---|
| `.approach-section p` | `.approach-section[data-astro-cid-abc123] p[data-astro-cid-abc123]` | 0-3-1 |
| `p.framework-title` | `p[data-astro-cid-abc123].framework-title` | 0-2-1 |
| `.approach-section p.framework-title` | `.approach-section[data-astro-cid-abc123] p[data-astro-cid-abc123].framework-title` | 0-4-1 |

Source-order tiebreaking doesn't help because specificity differs. The override at 0-2-1 loses to the base at 0-3-1 regardless of where it sits in the file.

**Rule for Astro-scoped `<style>` blocks:**

- When a utility class needs to override a contextual `p` rule in the same scoped block, always include the parent selector: `.parent-class p.utility-name`, not bare `p.utility-name`.
- Global (unscoped) CSS files (`tailor-site-v2.css`, `tailwind.css`) don't get the attribute injection, so the bare `p.utility-name` escape hatch still works there.
- If you reach for `!important` to make a utility class stick inside an Astro `<style>` block, stop — the correct fix is almost always raising specificity via the parent selector, not `!important`.

### 29.9 ACF Taxonomy Fields (WordPress Only)

When building taxonomy-driven layouts in WordPress with ACF (e.g. theme area cards):
- Derive CSS token prefixes from slugs: `explode('-', $term->slug)[0]` maps `"youth-families"` → `"youth"` → `var(--theme-youth-tint)`.
- Handle ACF image fields defensively — they may return an attachment ID (numeric), an array with `url` key, or a URL string depending on field settings.

### 29.10 Responsive Breakpoints

Use the token values as raw pixels in media queries (CSS custom properties don't work in `@media`):

```css
@media (max-width: 1024px) { /* --bp-lg */ }
@media (max-width: 768px)  { /* --bp-md */ }
@media (max-width: 640px)  { /* below --bp-md, mobile */ }
@media (max-width: 480px)  { /* --bp-sm */ }
```

Always stack layouts (grid → fewer columns → single column) progressively. Override `--surface-padding` at breakpoints rather than hardcoding padding values.


## 36. Checklist — Before You Ship

Before generating any CSS or markup for this system, verify:

### Universal (all platforms)
- [ ] Every visual value references a `var(--token)` — no hardcoded values
- [ ] Component classes follow the existing BEM-like pattern (`.component`, `.component__element`, `.component--modifier`)
- [ ] New tokens use component-first naming (`--component-property`, not `--property-component`)
- [ ] Shared-scale tokens use the short prefix (`--radius-*`, `--shadow-*`, `--z-*`, `--space-*`)
- [ ] Button markup includes all three class layers: `.btn` + size + style
- [ ] On-dark contexts use the correct `-on-dark` token variants
- [ ] `@media` queries use raw pixel values with a `/* --bp-* */` comment
- [ ] `prefers-reduced-motion: reduce` is handled for any transitions
- [ ] Colours that need opacity manipulation expose `-h`, `-s`, `-l` components
- [ ] No `!important` anywhere (except legacy Divi overrides on old projects)
- [ ] Every heading inside a flex/grid container has `margin-bottom: 0` (unless content follows it)
- [ ] Every `<p>` that's a direct flex/grid child has `margin: 0`
- [ ] Section header rows use `align-items: center`, not `flex-end`
- [ ] Contextual `p` rules exclude `.signpost` and `.preheader` with `:not()`
- [ ] No redundant `color: var(--text-muted)` — the base rule handles it
- [ ] `.preheader` used only above h1/display headings; `.signpost` used everywhere else
- [ ] Page template does not create a second `<main>` element
- [ ] `.surface` used for standalone containers — no one-off card classes
- [ ] New generic components added to the master CSS, not project-specific files (see section 4b)

### WordPress-specific (only when building on WP)
- [ ] Header/footer containers use the same `--layout-max-width` as page content
- [ ] Child theme `:root` overrides load after the parent theme (priority 20)
- [ ] ACF image fields handled defensively (may return ID, array, or URL string)
