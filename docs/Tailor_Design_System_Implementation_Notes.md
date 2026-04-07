# Tailor Education — Design system implementation notes for Claude Code

*This document accompanies `tailor-site-v2.css`. It tells Claude Code how the design system works, what patterns to follow, and what to avoid when building components for the Tailor Education / Okay to Ask website.*

*Read this before writing any markup or component CSS.*

---

## The system in one paragraph

This is a token-based design system with two emotional layers expressed through one structural shell. The **Tailor layer** (showcase, services, training, topic hubs, blog) uses Lexend for all typography and the brand teal for actions. The **Okay to Ask layer** (question pages, glossary pages, /questions/ landing) uses Atkinson Hyperlegible for body text, Fraunces for headings, warmer surfaces, and its own category colour palette. The navigation shell (header, footer) always stays in the Tailor layer regardless of which page the reader is on. All visual values come from CSS custom properties — never hardcode hex values, font sizes, spacing values, font weights, or line heights in component markup.

---

## Critical rules

1. **Never hardcode colours, fonts, sizes, spacing, weights, or line heights in components.** Every visual value must reference a `--token`. If you need a value that doesn't exist as a token, flag it — don't invent an inline value.

2. **Use the typography tokens for weights and line heights.** Never write a raw `font-weight: 600` or `line-height: 1.6` in a component. Use `var(--font-weight-semibold)` and `var(--lh-body)` instead. The system has four weight tokens and six line-height tokens — these cover every use case. If a component genuinely needs a weight or line height that doesn't map to an existing token, flag it.

3. **Use the nav and footer text size tokens.** Never hardcode `font-size: 0.9rem` in the shell. Use `var(--text-nav-size)` for nav links, `var(--text-nav-size-sm)` for smaller nav text, `var(--text-footer-size)` for footer text, and `var(--text-footer-size-sm)` for smaller footer text.

4. **The `.layer-ota` class goes on `<main>`, not on `<body>`.** This is what creates the typographic split. The header and footer sit outside `<main>` and inherit Lexend from the body rule. Everything inside `<main>` on an OtA page gets Atkinson Hyperlegible (body) and Fraunces (headings).

5. **The OtA category colours (`--ota-cat-*`) and the app category colours (`--cat-*`) are separate systems.** The `--cat-*` tokens are the Tailor app's 7 RSHE categories (used in the mega menu groupings). The `--ota-cat-*` tokens are the Okay to Ask book/browsing categories (used on question pages, /questions/ landing filters, category badges). Never use one where the other belongs.

6. **The safeguarding tokens (`--safeguarding-*`) are not the UI state tokens (`--state-*`).** Use `--state-success/warning/error/info` for form validation, system alerts, and generic UI feedback. Use `--safeguarding-support/ageflag/crisis` for components A8 (signposting), D1 (age flag), and A9 (crisis support). These have different emotional calibrations.

7. **The crisis support component (A9) and signposting block (A8) must never have a dismiss button.** This is a safeguarding requirement, not a design preference. Do not add `.alert__dismiss` to these components.

---

## Typography tokens

### Font weight tokens

Use these instead of raw numbers. Every weight in the codebase maps to one of these four:

| Token | Value | Use for |
|---|---|---|
| `--font-weight-regular` | 400 | Body text, default weight |
| `--font-weight-medium` | 500 | Subtle emphasis, nav links |
| `--font-weight-semibold` | 600 | Headings, eyebrow labels, glossary terms, card titles |
| `--font-weight-bold` | 700 | Strong emphasis, primary headings |

The system also has heading-level weights (`--heading-weight-h1` etc.) and a button weight (`--btn-font-weight`). Those are component-specific — the four tokens above are the general-purpose set.

### Line-height tokens

Use these instead of raw numbers. The six tokens form a scale from tight (display type) to generous (prose reading):

| Token | Value | Use for |
|---|---|---|
| `--lh-display` | 1.15 | Display headings (h1, hero) |
| `--lh-heading` | 1.2 | Section headings (h2, h3) |
| `--lh-heading-sub` | 1.3 | Subheadings, card titles |
| `--lh-card` | 1.4 | Card body text, compact layouts |
| `--lh-body` | 1.6 | Default body text |
| `--lh-prose` | 1.7 | Long-form reading (`.ota-prose` answer text) |

The utility text classes have their own line-height tokens (`--text-util-preheader-lh` etc.) — those stay as-is. The six tokens above are for everything else.

### Nav and footer text sizes

| Token | Value | Use for |
|---|---|---|
| `--text-nav-size` | 0.9rem | Primary nav links, mega menu links |
| `--text-nav-size-sm` | 0.85rem | Secondary nav text, mega menu category labels |
| `--text-footer-size` | 0.9rem | Footer links and body text |
| `--text-footer-size-sm` | 0.8rem | Footer fine print, copyright |

### Eyebrow letter-spacing

| Token | Value | Use for |
|---|---|---|
| `--text-eyebrow-ls` | 0.05em | Category eyebrows, section labels, tight-tracked uppercase text |

The system also has `--card-eyebrow-ls` (0.1em) for card contexts and `--text-util-preheader-ls` (0.15em) for looser preheaders. `--text-eyebrow-ls` fills the gap for the tighter tracking used on page-level eyebrow elements.

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
| OtA book panel | `--bg-ota-book-panel` | #eae6e1 | Book promo panel on /questions/ landing |
| On-dark overlay | `--overlay-on-dark` | rgba(255, 255, 255, 0.15) | Translucent white on dark backgrounds |

---

## Component reference

### Buttons

No layer-specific button styles. Buttons use the brand teal everywhere.

```html
<a class="btn btn--std btn--primary has-icon-hover">Get started</a>
<a class="btn btn--std btn--outline">Learn more</a>
<a class="btn btn--sm btn--tint">Filter</a>
```

On dark surfaces, use `btn--white-primary`, `btn--white-tint`, or `btn--white-outline`.

### Badges — OtA categories

```html
<span class="badge badge--pill badge--ota-anatomy">Anatomy</span>
<span class="badge badge--pill badge--ota-relationships">Relationships</span>
```

Available variants: `badge--ota-anatomy`, `badge--ota-puberty`, `badge--ota-relationships`, `badge--ota-sex`, `badge--ota-sexual-health`, `badge--ota-law`, `badge--ota-contraception`.

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

### Simple Mode toggle

The toggle uses `--toggle-mode-*` tokens. Build as a segmented control with two options (Standard / Simple). The toggle does not change page layout — it only swaps text content via JS.

```html
<div class="mode-toggle" role="radiogroup" aria-label="Reading level">
  <button role="radio" aria-checked="true" class="mode-toggle__option mode-toggle__option--active">Standard</button>
  <button role="radio" aria-checked="false" class="mode-toggle__option">Simple</button>
</div>
```

Style using the `--toggle-mode-*` tokens: `--toggle-mode-bg` for the container, `--toggle-mode-bg-active` for the selected segment, `--toggle-mode-text` / `--toggle-mode-text-active` for label colours, `--toggle-mode-radius` for the pill shape.

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

## Token naming conventions

| Prefix | Purpose |
|---|---|
| `--brand-*` | Brand primitives and relational variants |
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
| `--font-weight-*` | General-purpose font weights (regular, medium, semibold, bold) |
| `--lh-*` | General-purpose line heights (display, heading, heading-sub, card, body, prose) |
| `--text-nav-*` | Navigation text sizes |
| `--text-footer-*` | Footer text sizes |
| `--text-eyebrow-*` | Eyebrow/label letter-spacing |
| `--text-ota-*` | Okay to Ask text colour aliases |
| `--bg-ota-*` | Okay to Ask surface colours (including book panel) |
| `--surface-ota-*` | Okay to Ask motif colours (post-it) |
| `--overlay-*` | Overlay colours (on-dark translucent) |
| `--link-ota-*` | Okay to Ask link colour overrides |
| `--toggle-mode-*` | Simple Mode toggle styling |
| `--btn-*` | Button tokens |
| `--card-*` | Card tokens |
| `--alert-*` | Alert tokens |
| `--badge-*` | Badge tokens |
| `--space-*` | Spacing scale |
| `--radius-*` | Border radius scale |
| `--shadow-*` | Elevation scale |
| `--border-*` | Border colours and widths |

---

## What this CSS does NOT include

- **Layout system** — no grid classes, no container widths, no responsive layout utilities. These will be handled by Astro components and Tailwind/custom layout CSS specific to the site build.
- **Page-level composition** — the CSS provides tokens and component classes, not full page layouts. Each page template (C1, C2, C3, C4, C5) needs its own layout composition.
- **Simple Mode JS logic** — the CSS provides toggle styling tokens. The text-swap behaviour is a JS concern.
- **Glossary tooltip (A7)** — needs its own component design. Use existing token vocabulary for styling.
- **Search (A4, A5, B10)** — needs its own component design.
- **Mega menu (D8)** — needs its own component design.

---

*Document version: 1.1 | Date: 7 April 2026 | Updated with font weight tokens, line-height tokens, nav/footer text size tokens, eyebrow letter-spacing token, book panel surface token, overlay token, and expanded token naming table.*
