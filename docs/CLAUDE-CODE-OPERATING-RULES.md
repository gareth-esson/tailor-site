# Design System — Operating Rules for Claude Code

> **Read this before writing any CSS or applying any class. This document is not optional.**

You are working in a codebase that already has a mature, opinionated design system loaded as a single CSS file (a fork of the Guess Design House master). Every token and component class in that file exists for a deliberate reason. Your job is **not** to write CSS that looks right — your job is to **use what's already there**, correctly. When you guess, you are wrong. The CSS file is the source of truth, not your intuition.

If you take nothing else from this document, take this: **grep the CSS file first, write code second**.

---

## 1. The Mandatory Workflow

Before writing ANY CSS, before applying ANY class to markup, do these in order:

1. **Grep the master CSS file** for the component or token category you need (e.g. `--btn-`, `--card-`, `--surface-`, `.btn--`, `.card--`)
2. **Read every variant that exists** for that component, including hover states, on-dark variants, and modifiers
3. **Match the correct variant to the context** you're working in (what surface? what state? what hierarchy?)
4. **Then** write code

If you skip step 1, you will pick the wrong class. There is no shortcut. Reading the CSS takes 30 seconds — undoing wrong decisions takes much longer.

### What components already exist (don't rebuild any of these)

This is the catalogue of components in the master CSS. Before writing custom CSS for any of these patterns, use the existing class. If the project's CSS is a fork, the names may have minor variations — grep to confirm.

**Important:** a fork may only include a subset of the master. The "Status in Tailor" column below records presence in `tailor-site-v2.css` as of this document's date. A component marked `— not yet in Tailor fork` means the class is documented but the CSS hasn't been ported. If a feature needs one of those, add it to `tailor-site-v2.css` following the extension rules in Section 7 (define the token family in `:root` first, follow the BEM-like class pattern, include all states, handle reduced motion) and update this status column.

| Need | Use this | Status in Tailor | Don't write |
|------|----------|------------------|-------------|
| Buttons | `.btn` + size + style + optional icon class | ✓ | Custom button styles |
| Links in body text | `.link-inline` | ✓ | Custom underline/colour rules |
| Standalone "Read more →" link | `.link-action` (size variants: `--card`, `--display`; muted variant: `--muted`) | ✓ | Custom arrow CSS |
| Standalone container (singular) | `.surface` + variant | ✓ | Custom container with bg + padding |
| Items in a grid | `.card` + variants + BEM children | ✓ | Custom flex/grid card layouts |
| Frosted glass effect | `.glass`, `.glass--strong`, `.glass--solid` (+ `--dark`) | ✓ (`--solid` partial — no dedicated solid tokens) | `backdrop-filter: blur` |
| Status label (static) | `.badge` + variant | ✓ | Custom inline label styles |
| Selectable tag (interactive) | `.chip` + variant | ✓ classes, ✗ `--chip-*` tokens | Custom interactive tag styles |
| Block-level message (persistent) | `.alert` + variant | ✓ (incl. `--support`, `--crisis`, `--ageflag`) | Custom inline alert styles |
| Floating notification (temporary) | `.toast` + variant | — not yet in Tailor fork | Custom snackbar/notification |
| Modal dialog | `.modal` + sub-elements | — not yet in Tailor fork | Custom overlay/dialog |
| Expandable section | `.accordion` (uses native `<details>/<summary>`) | ✓ | Custom JS accordion |
| Form field group | `.form-group` + `.form-label` + `.form-input`/`.form-select`/`.form-check` | ✓ | Custom form layouts |
| On/off toggle | `.form-toggle` (checkbox-based) | — not yet in Tailor fork (see `.mode-toggle` for Simple Mode) | Custom switch from scratch |
| Range slider | `.form-range` | — not yet in Tailor fork | Custom styled range input |
| Progress bar | `.progress` (+ `.progress--sm`) with `.progress__bar` | — not yet in Tailor fork | Custom fill bar |
| Decorative icon (36–64px) | `.spot-icon` + size + modifier | ✓ | Custom icon container |
| Functional UI icon (16px) | Lucide icon (or project's icon library) | ✓ | — |
| Section label above heading | `.signpost` (default) or `.preheader` (heroes only) | ✓ | Custom uppercase label |
| Lead paragraph | `.lede` | ✓ | Custom intro paragraph styles |
| Two-column text + image grid | `.split-layout` (+ `--start`, `--reverse`) | — not yet in Tailor fork | Custom 2-col layouts |
| Sticky horizontal sub-nav | `.page-nav` | — not yet in Tailor fork | Custom sticky nav |
| Tables | `.table` + modifiers (`--striped`, `--hover`, `--bordered`, `--compact`) | ✓ | Custom table styles |
| Pagination | `.pagination` | — not yet in Tailor fork (site uses bespoke `.blog-pagination`) | Custom page number UI |
| Skip-to-content link | `.skip-to-content` | — not yet in Tailor fork | Custom visually-hidden link |
| Legal/policy page | `.legal-header` + `.legal-body` | — not yet in Tailor fork | Custom layouts |
| 404 / error page | `.error-page` + `.error-page__suggestions` | — not yet in Tailor fork (site uses bespoke `.error-404`) | Custom layouts |
| Search page / empty state | `.search-page` / `.search-empty` | — not yet in Tailor fork | Custom layouts |
| Downloadable file row | `.doc-row` / `.doc-list` / `.doc-locked` | — not yet in Tailor fork | Custom layouts |

For app-specific components that don't exist (sidebar nav, bottom tray, drag handles, app shell layouts), build them following the same naming and token patterns — see Section 7.

### Where to find the full decision tree

`SYSTEM-RULES.md` (Section 13) contains a complete component decision tree — use it when you're unsure which component to pick. It also contains detailed sections for every component (structure, tokens, variants, accessibility requirements). Read the relevant section before building anything that touches an existing component family.

---

## 2. Context-Aware Variant Selection (Where Most Failures Happen)

The system has **dedicated variants for context**. You must use them. The most common failure mode is using the wrong variant because you didn't check what was available.

### The on-dark / on-light pattern

Almost every interactive component has an "on dark" variant. Look for it before falling back to overrides.

| Context | Look for variants ending in / starting with |
|---------|---------------------------------------------|
| Light surface (default) | The base class — no suffix needed |
| Dark surface | `*-on-dark`, `--white-*`, `--text-on-dark`, `--text-heading-on-dark`, `--focus-ring-on-dark` |
| Brand-coloured surface | Check for `--on-brand` variants; otherwise treat as dark |
| Glass overlay | Depends on what's behind the glass — check both sides |

### Specific failures to avoid

- **Button variants are paired families. Pick the family, then the variant. Do not mix.**
  - **Standard family** (built on brand colour): `.btn--primary`, `.btn--tint`, `.btn--outline`
  - **White family** (built on white): `.btn--white-primary`, `.btn--white-tint`, `.btn--white-outline`
  - If the primary CTA in a context is `.btn--primary`, its tinted partners are `.btn--tint` — never `.btn--white-tint`.
  - If the primary CTA in a context is `.btn--white-primary`, its tinted partners are `.btn--white-tint` — never `.btn--tint`.
- **The white family is specifically for surfaces where the standard family would clash with the background.** It is NOT a default for "any dark surface."
  - Use the **white family** when the section background IS the brand-primary or brand-accent colour (or close enough that a standard `.btn--primary` would disappear into the background or fail contrast).
  - Use the **standard family** everywhere else — including light surfaces, generic dark surfaces (dark grey, brand-secondary, dark neutrals), and glass overlays. On these surfaces the brand colour stands out fine, so white buttons are unnecessary and break the visual identity.
  - Test: if you placed a `.btn--primary` on this surface, would it be clearly visible and on-brand? If yes → standard family. If no (because the surface IS that colour) → white family.
- **For text on a dark background**, use `var(--text-on-dark)` or `var(--text-heading-on-dark)` — never `color: white`, `color: #fff`, or `color: rgba(255,255,255,X)`.
- **For semi-transparent on-dark elements**, look for `--on-dark-*` opacity tokens (e.g. `--on-dark-70`, `--on-dark-40`) before writing raw `rgba()`.

### Rule: pair every surface with its matching text token

Whenever you set a surface (background), set the matching text colour using the system token, not white/black:
- `.surface--light` → `--text-body`, `--text-body-muted`, `--text-heading`
- `.surface--dark` → `--text-on-dark`, `--text-muted-on-dark`, `--text-heading-on-dark`
- `.surface--brand` → check the system; either `--text-on-brand` or treat as dark

---

## 3. Component Selection Rules (User Preferences Codified)

These are the user's explicit preferences. Defaulting to anything else is wrong unless the user has asked for it specifically.

### Buttons — three-layer class structure (always)

Every button uses **three** classes minimum: base + size + style. Never just the style class alone.

```html
<a class="btn btn--std btn--tint">Standard tint button</a>
<a class="btn btn--sm btn--primary has-icon-hover">Small primary with hover arrow</a>
<button class="btn btn--std btn--outline has-icon-right">Outline with persistent right arrow</button>
```

- **Base**: `.btn` (always present)
- **Size**: `.btn--std` (default size) OR `.btn--sm` (compact). Pick one — never omit.
- **Style**: `.btn--primary`, `.btn--tint`, `.btn--outline`, `.btn--text`, `.btn--disabled`, or the white-family equivalents.
- **Icons** (optional): `.has-icon-right`, `.has-icon-left`, `.has-icon-hover` (right arrow that reveals on hover).

Never write a custom CSS arrow on a button. The icon classes handle SVG, padding, and animation. They use `currentColor` so they inherit text colour automatically.

### Buttons — style priority order

1. **`.btn--tint` is the DEFAULT** for secondary actions and most CTAs. Reach for tint first, always.
2. **`.btn--primary`** is for the single most important action on a screen (the one thing you want the user to do).
3. **`.btn--outline`** ONLY when explicitly requested, OR when tint genuinely cannot work in context (e.g. would clash with a glass background). Outline is not a default — it's a fallback.
4. **`.btn--text`** for low-emphasis tertiary actions (e.g. "Cancel", inline "Learn more"). Note: `.btn--text` is a button with a hover background tint — for arrow-driven "Read more →" links use `.link-action` instead.

**Never default to `.btn--outline`.** The user prefers tint and has called this out as a failure mode.

### Buttons — disabled state (accessibility is mandatory)

`.btn--disabled` provides the visual styling, but visual styling alone does not communicate disabled state to assistive technology. Always pair it with the correct accessibility attribute:

- **`<button>` elements**: use the native `disabled` attribute.
  ```html
  <button class="btn btn--std btn--disabled" disabled>Unavailable</button>
  ```
- **`<a>` elements**: use `aria-disabled="true"` AND remove `href` (or set `href="javascript:void(0)"`) AND add `tabindex="-1"` to remove from the tab order.
  ```html
  <a class="btn btn--std btn--disabled" aria-disabled="true" tabindex="-1">Sold Out</a>
  ```
- **Never rely on `pointer-events: none` alone** — it blocks the mouse but does nothing for keyboard users or screen readers.

### Containers — surface vs card vs section (don't confuse these)

The system has a clear hierarchy. Pick the right one:

- **Surface** — a *singular standalone* container with its own background and padding. Use for hero panels, info boxes, sidebar widgets, anything that's one-of-a-kind on the page. Class: `.surface` + variant.
- **Card** — *plural items in a grid*. If you have multiple of these in a row/grid, it's a card, not a surface. Class: `.card` + variant.
- **Section** — a *full-width page-level row*. The wrapping `<section>` element. Surfaces and cards live inside sections.

If you write `background: var(--bg-surface); border-radius; padding` and it's standalone, that's `.surface`. If you write the same thing for items in a grid, that's `.card`.

### Cards

- **Use the full BEM structure** — `.card`, `.card__img`, `.card__body`, `.card__eyebrow`, `.card__title`, `.card__text`, `.card__link`. Don't recreate this with custom classes.
  ```html
  <article class="card card--lift">
    <div class="card__img"><img src="..." alt=""></div>
    <div class="card__body">
      <span class="card__eyebrow">Category</span>
      <h3 class="card__title">Title</h3>
      <p class="card__text">Description</p>
      <a class="card__link" href="#">Read more</a>
    </div>
  </article>
  ```
- **No borders.** Ever. Unless the user explicitly asks for one.
- **No resting shadow.** Apply `.card--lift` for hover-only elevation (the 99.9% case). Other interaction variants: `.card--reveal` (transparent at rest, reveals on hover) and `.card--ghost` (no background, no border, no shadow — pure content).
- **Layout variants**: `.card--horizontal` (image left, content right), `.card--horizontal-reverse`, `.card--thumbnail` (small 120px square image left).

### Surfaces

- `.surface--light` — subtle lift from page background
- `.surface--alt` — alternative subtle tone
- `.surface--dark` — inverted dark section (text colours auto-swap — see Section 4)
- `.surface--brand` — brand-accent colour as background (this is where white-family buttons belong)
- `.surface--bordered` — adds subtle border (combine with another variant)
- Pair every surface with the correct text colour tokens — see Section 2.

### What auto-swaps on dark surfaces (and what doesn't)

When a parent element has `.surface--dark` or `.on-dark`, the system **automatically swaps** these for you. Don't manually override them inside dark surfaces:

- **Headings** (`h1`–`h6`, `.card__title`) → `--text-heading-on-dark`
- **Body text** → `--text-on-dark`
- **Focus rings** → `--focus-ring-on-dark`
- **`.link-action`** colour and hover
- **Tables** (`.table`, `.table--striped`, `.table--hover`, `.table--bordered`) — all token swaps automatic
- **Buttons** — `.btn--tint` and `.btn--outline` auto-swap to their on-dark token sets via `.surface--dark .btn--tint` / `.surface--dark .btn--outline` selectors. Use the standard family on dark surfaces; the wiring picks up the on-dark variant for you. Only switch to the **white family** (`.btn--white-primary` / `.btn--white-tint` / `.btn--white-outline`) when the surface IS the brand-primary or brand-accent colour (see Section 2).

What does **NOT** auto-swap (you must handle these explicitly):

- **Inline opacity values** — if you need translucent on-dark, use the `--on-dark-*` opacity tokens (`--on-dark-70`, `--on-dark-40`, etc.) — never raw `rgba(255,255,255,X)`.
- **Custom borders** — use `--border-subtle-on-dark` / `--border-strong-on-dark` if you need them.

### Glass effects (`.glass` is NOT the same as `.btn--tint`)

These two often get confused. They are completely different things:

- **`.glass`** — applies `backdrop-filter: blur` to a container. Frosted-glass effect on surfaces, cards, navs, modals.
- **`.btn--tint`** — translucent brand-coloured background on a button. Not a blur effect.

Three glass intensity tiers — pick based on the readability requirement:

| Modifier | Use case |
|----------|----------|
| `.glass` | Decorative / atmospheric only (text legibility not required) |
| `.glass--strong` | Text is readable but secondary |
| `.glass--solid` | Full WCAG-compliant readability (hero cards, modals over images, anything with body text) |

Each combines with `.glass--dark` for dark-tinted variants. Tint buttons (`.btn--tint`) are the correct button choice on glass surfaces — outline buttons clash with the blur.

The blur needs something behind it (image, gradient, colour) to frost. Don't put glass on a flat solid background — there's nothing to blur.

### Typography — three scales for three contexts (don't mix)

The system provides three separate type scales. Each is for a specific context. **Do not mix them within a context.**

| Scale | Token prefix | Use case |
|-------|-------------|----------|
| **Display** | `--text-display-size-*` | Landing pages, heroes, marketing |
| **Prose** | `--text-prose-size-*` | Blog posts, long-form content, articles |
| **Card** | `--text-card-size-*` | Cards, compact UI, dashboards, app interfaces |

Card scale is one semantic step smaller than prose. If you're styling app UI (which the Tailor Education project is), default to card scale unless you're in a hero or marketing moment.

### Typography utility classes

- `.signpost` — small uppercase label above section headings (h2/h3). The default choice.
- `.preheader` — slightly larger label above h1 / display headings (heroes and major CTAs only).
- `.hero-subhead` — subtitle beneath a hero heading
- `.subheading` — section subtitles
- `.lede` — opening paragraph emphasis (lead paragraph)
- `.microtext` / `small` — fine print, captions

Don't combine `.signpost` and `.preheader` — pick one based on the heading they sit above.

### Badge vs Chip — different things

- **`.badge`** — *static* inline label. Use for status, categories, metadata. Not interactive. Variants: `--accent`, `--success`, `--warning`, `--error`, `--info`, `--solid-*`, plus `--pill` for shape.
- **`.chip`** — *interactive* selectable tag. Use for filter multi-select, removable tags, dynamic selection UI. Variants: `--active`, `--removable`. Has `:hover`, `:active`, `:focus-visible` states.

If the user can click it to toggle, it's a chip. If it just labels something, it's a badge.

### Alert vs Toast — different things

- **`.alert`** — *block-level, persistent* contextual message. Lives in the page flow until dismissed. Use for inline form errors, warnings on a page, success confirmations after an action. Variants: `--info`, `--success`, `--warning`, `--error`.
- **`.toast`** — *fixed-position, temporary* notification. Floats over the page, auto-dismisses. Use for action feedback ("Saved", "Copied to clipboard"), system events.

If it's part of the page content, it's an alert. If it floats and disappears, it's a toast.

### Icons — spot icons vs functional UI icons

These are different and serve different purposes. Don't confuse them:

- **`.spot-icon`** — *decorative illustration* (36–64px). Used in card headers, feature grids, empty states. Single-colour SVG with `viewBox="0 0 24 24"`, `stroke="currentColor"`, `stroke-width="1.5"`. Sizes: `.spot-icon--sm` (36px), `.spot-icon` (48px), `.spot-icon--lg` (64px). Modifiers: `--circle`, `--hoverable`, `--on-dark`, `--neutral`.
- **Functional UI icons** — *interactive UI affordances* (16px). Use Lucide icons (or whatever icon library the project uses). These are for buttons, form fields, navigation items, anything the user clicks.

Don't use `.spot-icon` for a 16px button icon. Don't use a Lucide icon at 48px in a card header.

### Link-action vs btn--text — the arrow is the deciding factor

Both are low-emphasis text-style triggers, but they're not interchangeable:

- **`.link-action`** — has an arrow (`→`) that nudges right on hover. Bold, no background. Use for "Read more →" style standalone CTAs. Size variants: `.link-action--card` (compact), `.link-action--display` (large hero CTAs). Hide the arrow with `.link-action--no-arrow`.
- **`.btn--text`** — no arrow, has a subtle background tint on hover. Use for "Cancel" buttons, inline actions that need a button-shaped hover affordance.

**Never combine `.btn--text` with `.has-icon-right`.** If you want the arrow, that's `.link-action`.

---

## 4. Token Discovery — How to Find the Right Token

Every token has siblings. Before using one, find the family.

### Pattern: brand colours

Each brand colour exposes a full family. Don't manually derive — look first.
```
--brand-accent
--brand-accent-h, --brand-accent-s, --brand-accent-l    (HSL components)
--brand-accent-soft                                      (lighter, less saturated)
--brand-accent-strong                                    (darker, more saturated)
--brand-accent-text                                      (lightness-clamped for WCAG AA on white)
```

If you want a "softer accent for a hover background" — that's `--brand-accent-soft`, not `hsl(var(--brand-accent-h) var(--brand-accent-s) 90%)`.

### Pattern: components

Each component has token families. Grep `--component-name-` and read everything that comes back.
```
--btn-primary-bg, --btn-primary-text, --btn-primary-bg-hover
--btn-tint-bg, --btn-tint-text, --btn-tint-bg-hover
--btn-outline-border, --btn-outline-text, --btn-outline-bg-hover
```

### Pattern: scales

Spacing, radius, shadow, z-index, type sizes — all on shared scales. Use these short prefixes:
- Spacing: `--space-global-xs/sm/md/lg/xl/2xl` and `--space-global-gutter`
- Radius: `--radius-*`
- Shadow: `--shadow-*`
- Z-index: `--z-*` (`--z-base`, `--z-sticky`, `--z-dropdown`, `--z-overlay`, `--z-modal`, `--z-toast`)
- Type: `--text-*`, `--font-*`

Note: token names in your forked CSS may differ from the original GDH names. **Always grep the actual file in your project — don't trust this list blindly, use it as a pattern guide.**

---

## 5. Anti-Patterns — Stop If You Catch Yourself Doing These

Each of these is a real failure mode that has happened. If you start writing code that matches one of these patterns, **stop and re-read the CSS**.

| If you're about to write... | The system already provides... |
|----------------------------|-------------------------------|
| `color: #fff` or `color: white` | `var(--text-on-dark)` or `var(--text-heading-on-dark)` |
| `color: rgba(255, 255, 255, 0.7)` | An `--on-dark-*` opacity token (grep `--on-dark-`) |
| `background: rgba(0, 0, 0, X)` | A glass class or surface variant |
| `border-radius: 8px` | `var(--radius-md)` or equivalent |
| `padding: 16px` | `var(--space-global-sm)` |
| `font-size: 14px` | A scale-specific token — e.g. `var(--text-card-size-body)`, `var(--text-prose-size-body)` (pick the scale that matches the context; see Section 3 — Typography) |
| `display: flex; flex-direction: column; border-radius; overflow: hidden` | `.card` |
| `backdrop-filter: blur` | `.glass`, `.glass--strong`, or `.glass--solid` |
| `translateY` + `box-shadow` on hover | `.card--lift` |
| `.btn--outline` for any old secondary button | `.btn--tint` (the actual default) |
| `.btn--white-tint` next to `.btn--primary` (or `.btn--tint` next to `.btn--white-primary`) | Stay inside one family — standard (`primary`/`tint`/`outline`) OR white (`white-primary`/`white-tint`/`white-outline`). Never mix. |
| Custom focus ring | `var(--focus-ring)` / `var(--focus-ring-on-dark)` with `--focus-ring-width` and `--focus-ring-offset` |
| A hand-rolled colour derivation | A `-soft`, `-strong`, or `-on-dark` sibling that already exists |

---

## 6. Universal Rules (No Exceptions)

1. **Every visual value uses a token.** No hardcoded hex, rgb, rgba, or pixel values for design properties (colours, spacing, radius, shadow, font size, z-index). Only exception: pixel values inside `@media` queries (CSS custom properties don't work there) — use raw px with a comment naming the breakpoint token.
2. **No `!important`.** If you think you need it, your specificity is wrong — fix the cascade order or selector instead.
3. **`prefers-reduced-motion: reduce`** is handled for every transition or animation. If you add motion, add the reduced-motion override in the same change.
4. **WCAG 2.1 AA contrast** on every colour combination. The system's `*-text` variants are lightness-clamped to guarantee this — use them.
5. **Visible focus indicators** on every interactive element using `--focus-ring` (or `--focus-ring-on-dark`). Never `outline: none` without a replacement.
6. **Component-first naming.** `--btn-tint-bg`, not `--tint-button-background`. `.card__title`, not `.title-card`.

---

## 7. Extending the System

If a component genuinely doesn't exist in the master CSS, you may add it — but follow the rules:

- **Generic component** (toast, modal, toggle switch, progress bar, interactive chip) → Add it to the main CSS file following the existing BEM-like pattern (`.component`, `.component__element`, `.component--modifier`). Define its token family in `:root` first (`--toast-bg`, `--toast-radius`, etc.) and consume primitive tokens for the values. Include all states (hover, focus, active, disabled). Handle reduced motion.
- **Project-specific component** (app sidebar, bottom tray, editor layout, drag-to-reorder) → Add it to the project's own CSS, following the same naming and token rules.

Decision rule: "Would this component be useful on a completely different project?" If yes → master. If no → project.

When in doubt, ASK before creating a new component class.

---

## 8. When You're Unsure — Don't Guess

The single most common cause of failure is guessing instead of checking. If you don't know:

1. **Grep the CSS** for the relevant pattern (`--btn-`, `.surface--`, `--text-`, etc.) and read what comes back
2. **If grep doesn't reveal what you need**, ask the user for the correct token or class — don't invent one
3. **If the user's request is ambiguous** about hierarchy or context (e.g. "add a button" — primary or tint? where will it live?), ask before placing it

Wrong answers cost more than questions. The user has explicitly said: when you guess, the system fails.

---

## 9. Applying These Rules to Existing Code

This document governs all CSS work going forward. When you encounter existing code that violates these rules:

- **Flag it** clearly to the user
- **Propose the correction** using the right token or class, with a one-line explanation
- **Wait for confirmation** before sweeping refactors — let the user see and approve corrections rather than silently rewriting large blocks

Surface violations as you find them, but don't auto-rewrite the whole codebase in one pass.

---

## 10. Quick Self-Check Before Shipping Any CSS Change

- [ ] Did I grep the CSS file before writing this?
- [ ] Is every value a `var(--token)` (no hardcoded colours, sizes, or spacing)?
- [ ] Does my button choice match the user's preference order (tint first, then primary, outline last)?
- [ ] On dark surfaces, am I using the `*-on-dark` variants and not white/rgba overrides?
- [ ] If I added motion, did I add the `prefers-reduced-motion` override?
- [ ] Do all interactive elements have a visible focus indicator?
- [ ] Did I avoid `!important`?
- [ ] If I added a new component, does it follow the naming pattern and live in the right file?

If any of these is "no", fix it before considering the change done.
