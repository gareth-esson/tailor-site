# Tailor Layout Spec — Shell (A1, A2, A3, D3, D8)

*Layout specification for the persistent shell: site header (A1), footer (A2), navigation (A3), topics mega menu (D8), mobile navigation (D3). This shell wraps every page on the site regardless of layer. It is always Lexend (via `--font-shell-body-stack`) and always sits outside `<main>`.*

*Companion: `tailor-site-v2.css` is the token vocabulary. Tailwind utility classes drive layout structure only. All visual values resolve to a CSS custom property.*

---

## Global ground rules for the shell

1. **The shell never inherits `.layer-ota` typography.** The header and footer sit outside `<main>`. Even when the page's `<main>` carries `.layer-ota`, the shell stays Lexend because it inherits from `body`, not `main`. Do not nest header or footer inside `<main>`.
2. **The shell is visually identical on Tailor and Okay to Ask pages.** No variant classes, no token swaps. The tonal change happens inside `<main>`; the shell stays stable so the reader feels like they're moving between rooms in the same building.
3. **Layout via Tailwind. Style via tokens.** Every background, colour, font, radius, shadow, border, and spacing value must resolve to a `var(--…)`. Tailwind provides grid/flex structure, gap, padding/margin, responsive breakpoints, and positioning only. Where Tailwind's arbitrary value syntax is needed to consume a token (e.g. `max-w-[72rem]`, `px-[var(--space-global-gutter)]`), use it.
4. **Breakpoints.** Desktop spec refers to viewports ≥ 1024px (Tailwind `lg`); the desktop layout is tuned for 1200px+ as the reference width. Mobile spec refers to viewports < 768px (below Tailwind `md`). Tablet (768–1023px) inherits mobile composition unless explicitly noted; the nav flip from hamburger to horizontal happens at `lg` (1024px), matching the existing build.

---

## Shared tokens referenced throughout the shell

| Purpose | Token | Current value |
|---|---|---|
| Shell font | `--font-shell-body-stack` | Lexend, sans-serif |
| Header surface | `--bg-surface` | #FFFFFF |
| Header border | `--border-subtle` | #e5e4de |
| Footer surface | `--bg-emphasis` | #1E2A3A |
| Text on light | `--text-body` | #1E2A3A |
| Text on dark | `--text-on-dark` | #f4f3ef |
| Muted on dark | `--text-muted-on-dark` | rgba(255,255,255,0.6) |
| Border on dark | `--border-subtle-on-dark` | #4a4844 |
| Link rest (light) | `--brand-accent-text` | teal L=29% |
| Hover surface | `--bg-surface-alt` | #f0efeb |
| Focus ring | `--focus-ring` / `--focus-ring-on-dark` | teal / soft teal |
| Radius (small) | `--radius-sm` | 4px |
| Radius (card) | `--radius-md` | 12px |
| Shadow (mega menu) | `--shadow-lg` | existing |
| Transition | `--transition-duration` / `--transition-easing` | 0.25s ease |
| Horizontal gutter | `--space-global-gutter` | clamp(0.75rem, 2vw, 2rem) |
| XS/SM/MD/LG/XL spacing | `--space-global-xs` … `--space-global-2xl` | 0.5 → 5rem |

### Tokens that need attention

**Missing — flag for addition to `tailor-site-v2.css`:**

1. **`--container-max-shell` (new token).** The existing header and footer both use a hardcoded `max-width: 72rem`. This is a layout value, but it is a brand-level decision that recurs across every page (shell, hero containers, landing page reading columns). Add it under the spacing section, alongside `--space-struct-*`:
   ```css
   --container-max-shell: 72rem; /* 1152px — outer wrapper on header/footer/page sections */
   --container-max-prose: 44rem; /* 704px — long-form reading measure (reserved for C1/C2/C4 specs) */
   ```
   All references in the shell spec below use `--container-max-shell`. Until the token lands, the Tailwind equivalent is `max-w-[72rem]`.

2. **`--header-height` (new token).** Several things downstream need to know the sticky header height (scroll-offset anchors, mega-menu top position, sticky sub-nav on long pages). Add:
   ```css
   --header-height: 4rem; /* 64px — desktop/mobile unified */
   ```
   Until it lands, the Tailwind equivalent is `h-16`.

3. **`--z-header` and `--z-overlay` (new tokens).** The header is `z-index: 100`, the mega menu is `99`, and the mobile nav overlay needs to sit between them. Formalise as:
   ```css
   --z-header: 100;
   --z-mega: 90;      /* sits under the header border but above page content */
   --z-mobile-nav: 95;
   ```

**Base-value change I'm proposing site-wide (not a new token):**

- **`--space-global-gutter`** is currently `clamp(0.75rem, 2vw, 2rem)`. The shell feels tight on mobile at 0.75rem when paired with the logo and hamburger. I recommend raising the floor to `1rem`:
  ```css
  --space-global-gutter: clamp(1rem, 2vw, 2rem);
  ```
  Reason: this is the canonical outer page gutter used by the header, footer, and all section wrappers. A 1rem floor gives the logo and tap targets visual air on phones without affecting the desktop value (which is already capped at 2rem). If Gareth wants to keep 0.75rem for very narrow edge-content (inside cards, alerts), those use `--space-global-sm` / `--space-global-xs` already.

No other token base values need to change for the shell.

---

## A1 — Site header

### Role in the shell
Sticky top bar on every page. Contains the logo, primary navigation (A3), search (A4 — treated as a slot in this spec; its internal spec comes in Phase 6), and the mobile hamburger trigger. The header is the single structural element where desktop and mobile diverge most sharply.

### Desktop (≥ 1024px, tuned at 1200px+)

**Outer element.** `<header>` with Tailwind `sticky top-0 w-full` and style-layer class for tokens. The sticky behaviour is a layout concern, so it stays in Tailwind; everything visual comes from tokens.

- Background: `--bg-surface`
- Bottom border: `var(--border-width-xs) solid var(--border-subtle)`
- Font: `--font-shell-body-stack`
- Height: `--header-height` (4rem). Tailwind `h-16`.
- Stacking: `z-[var(--z-header)]` (z-100)
- No shadow at rest. On scroll, optional `--shadow-sm` once the page has scrolled past 8px. This is a micro-interaction aligned with the art direction brief's "considered, reassuring, lightly tactile" motion note. If the build team prefers zero motion, omit.

**Inner wrapper.** A single flex row, centred horizontally, padded by the page gutter.

- Tailwind: `mx-auto flex h-full w-full items-center max-w-[var(--container-max-shell)] px-[var(--space-global-gutter)] gap-[var(--space-global-md)]`
- Three slots in order: brand (left), primary nav (centre, grows), utility cluster (right). `gap-[var(--space-global-md)]` separates the three top-level slots. `--space-global-md` = 1.5rem.

**Slot 1 — Brand (logo).**
- Tailwind: `flex items-center shrink-0`
- The `<a>` wraps the logo `<img>`. Logo height: fixed at 2rem (current build). No token exists for logo sizing and none is needed — logo is a brand asset, not a type-ramp element.
- Focus state: `--focus-ring` with `--focus-ring-width` and `--focus-ring-offset`.

**Slot 2 — Primary navigation (A3).**
- Tailwind: `hidden lg:flex flex-1 justify-center`
- Inside: `<ul role="list">` with Tailwind `flex items-center gap-[var(--space-global-xs)] m-0 p-0 list-none`.
- `--space-global-xs` (0.5rem) gives the nav items air without drifting apart.
- One `<li>` per nav item. Nav items and their composition are specified in A3 below.

**Slot 3 — Utility cluster (search + hamburger).**
- Tailwind: `flex items-center gap-[var(--space-global-sm)] shrink-0`
- On desktop, this slot renders the SearchBar (A4) in its inline input form and the hamburger hidden (`lg:hidden` on the hamburger button). The SearchBar is specified in Phase 6; its desktop footprint is fixed at `w-[16rem]` (Tailwind) so the nav slot's centring stays stable.

**Overall row proportions at ≥ 1200px:** brand (~180px logo + small padding) | nav (flex-1, centre-justified) | utility (~16rem search + gap). At the 1024–1199px band, the search bar shrinks to `w-[12rem]` via `lg:w-[12rem] xl:w-[16rem]`; the nav gap shrinks to `gap-0` if needed (this is a build-time overflow guard, not a design-time compromise).

### Mobile (< 768px)

**Outer element.** Same `<header>` element, same `sticky top-0` behaviour, same tokens. Height stays at `--header-height` (4rem) — do not shrink on mobile; the consistent height is part of the shell's calm.

**Inner wrapper.** Same Tailwind utilities as desktop — the responsive split is achieved by hiding/showing slots, not by rewriting the container. At mobile widths the nav slot collapses.

**Slot composition at mobile:**
- Slot 1 — Brand: visible.
- Slot 2 — Primary nav: `hidden lg:flex` removes it.
- Slot 3 — Utility: SearchBar renders its icon-only "toggle" form (`lg:hidden` on the icon, `hidden lg:flex` on the input). Hamburger button is visible (`lg:hidden`).

**Hamburger button.**
- Tailwind: `flex lg:hidden flex-col items-center justify-center gap-1 w-10 h-10 p-2 bg-transparent border-0 cursor-pointer`
- Border radius: `rounded-[var(--radius-sm)]`
- Hover background: `--bg-surface-alt`
- Focus state: `--focus-ring` via `outline` token.
- Three `<span>` lines, each `block w-5 h-[2px] rounded-[1px]` coloured `bg-[var(--text-body)]`. Animation to an X on `is-open` exists in the current build; retain.

### Tablet note (768–1023px)

The nav stays collapsed (hamburger visible) until `lg` (1024px). This is existing behaviour and should remain. Tablet gets the mobile layout with more horizontal breathing room because the gutter clamp scales up. No tablet-specific rules needed.

---

## A3 — Navigation (primary nav items, inside A1)

### Role
The primary nav is a slot inside the header on desktop and inside the mobile nav panel (D3) on mobile. It carries the same items in the same order in both breakpoints; only the presentation differs.

### Nav items (canonical order, both breakpoints)

1. **Topics** — button, triggers D8 mega menu
2. **Okay to Ask** — link to `/questions/`
3. **RSE Delivery** — button, triggers secondary dropdown (spec below)
4. **RSE Training & Support** — button, triggers secondary dropdown (spec below)
5. **Blog** — link to `/blog/`
6. **About** — link to `/about`
7. **Contact** — link to `/contact`

(Current build has: Topics, Okay to Ask, Training, Services, Blog, About, Contact. Changes needed: remove "Training" and "Services" as standalone nav items. Add "RSE Delivery" dropdown with 5 items. Add "RSE Training & Support" dropdown with 2 items.)

### Nav link — desktop composition

Each nav `<li>` contains either an `<a>` or a `<button>` (button for items with dropdowns). The visual treatment is identical; the semantic element differs.

- Tailwind: `inline-flex items-center gap-1 px-3 py-2 border-0 bg-transparent cursor-pointer`
  - `px-3` = 0.75rem, `py-2` = 0.5rem (these are sub-token paddings chosen because `--space-global-xs` / `--space-global-sm` would be either too tight or too loose; they match the existing build and fall within the ramp).
- Font: `--font-shell-body-stack`
- Font size: `--text-card-size-body` (14px)
- Weight: 500 (Lexend Medium — intentionally lighter than headings; matches existing build)
- Color rest: `--text-body`
- Color hover / aria-expanded=true: `--brand-accent-text`
- Background hover / aria-expanded=true: `--bg-surface-alt`
- Radius: `--radius-sm`
- Transition: `--transition-duration --transition-easing` on background and color

Chevron (for dropdown triggers only): 12×12 SVG, stroke = `currentColor`. Rotates 180° on `aria-expanded="true"` via `--transition-duration` `transform`.

**Focus state (keyboard):** outline uses `--focus-ring` at `--focus-ring-width` with `--focus-ring-offset`. This applies to all nav links and buttons.

### Nav link — mobile composition

The nav items sit inside the D3 mobile panel, not inside the header itself. Each item is a full-width row:

- Tailwind: `flex items-center justify-between w-full py-3 border-0 bg-transparent cursor-pointer`
- Font: `--font-shell-body-stack`, size `--text-prose-size-body` (larger than desktop — mobile taps need bigger targets and a more generous type size), weight 500, colour `--text-body`.
- Each `<li>` separated from the next by a `border-bottom: var(--border-width-xs) solid var(--border-subtle)`. Last item has no border.
- Items with sub-navigation (Topics, RSE Delivery, RSE Training & Support) render as `<button>` with a trailing chevron. Tapping expands an inline accordion panel (see D3 + D8 mobile sections).

### RSE Delivery dropdown (desktop) — D8-lite

Unlike Topics (which warrants a full multi-column mega menu), RSE Delivery is a 5-item dropdown. Compose it as a compact panel, not a mega menu:

- Positioning: absolute, `top: 100%; left: 0; margin-top: 0.25rem;` from the `<li>` (same pattern as the Topics mega menu).
- Surface: `--bg-surface`
- Border: `var(--border-width-xs) solid var(--border-subtle)`
- Radius: `--radius-md`
- Shadow: `--shadow-md` (lighter than the mega menu because it is visually smaller)
- Tailwind: `absolute top-full left-0 mt-1 min-w-[16rem] py-2 z-[var(--z-mega)]`
- Inside: a single `<ul role="list">` with each item rendered as `.site-header__nav-link`-variant: `block px-4 py-2` with the same hover tokens as the primary nav link. Font size drops to `0.9rem` (matches the mega menu link size) so the dropdown feels secondary to the main nav row.
- Five links: RSE for Primary Schools, RSE for Secondary Schools, RSE for SEND & AP (Circuits), Direct RSE Delivery, Drop Days.
- No category grouping. Five simple links. The trigger's `aria-expanded` chevron rotates 180° when open.

On mobile, RSE Delivery uses the same accordion pattern as Topics (see D3 below).

### RSE Training & Support dropdown (desktop) — same pattern as RSE Delivery

A 2-item dropdown, identical pattern to RSE Delivery:

- Positioning, surface, border, radius, shadow, z-index: all identical to RSE Delivery dropdown above.
- Tailwind: `absolute top-full left-0 mt-1 min-w-[16rem] py-2 z-[var(--z-mega)]`
- Inside: a single `<ul role="list">` with the same link styling as RSE Delivery.
- Two links: RSE Training (→ `/rse-training`), RSE Policy & Curriculum Planning (→ `/services/rse-policy-curriculum-planning`).
- The trigger's `aria-expanded` chevron rotates 180° when open.

On mobile, RSE Training & Support uses the same accordion pattern as RSE Delivery and Topics (see D3 below).

---

## D8 — Topics mega menu

### Role
Expands from the "Topics" primary nav item on desktop. Shows all 23 landing pages grouped by the 7 app categories. On mobile, renders inside D3 as an expandable section.

### Desktop

**Outer element.** `<div id="mega-menu" role="region" aria-label="Topics menu">` rendered as an absolutely-positioned flyout beneath the nav item.

- Position: `absolute top-full left-0 mt-1 z-[var(--z-mega)]`
- Width: `w-[max(70vw,56rem)] max-w-[calc(100vw-2rem)]`
- Surface: `--bg-surface`
- Border: `var(--border-width-xs) solid var(--border-subtle)`
- Radius: `--radius-md`
- Shadow: `--shadow-lg` (deliberately heavier than the RSE Delivery dropdown — this is the knowledge map moment and deserves visual weight)
- Hidden state: `aria-hidden="true"` → `display: none`. Open state: `aria-hidden="false"` → `display: block`. Do not animate with `max-height` or `opacity` on the menu itself; the fade/lift is reserved for a later motion pass.

**Inner wrapper.** Tailwind: `px-[var(--space-global-lg)] pt-[var(--space-global-lg)] pb-[var(--space-global-md)]`. `--space-global-lg` = 2rem; `--space-global-md` = 1.5rem.

**Grid.** Seven category groups laid out in a responsive grid:

- At `lg` (1024–1279px): 3 columns → the 7 groups flow across 3 rows.
- At `xl` (1280px+): 4 columns → the 7 groups flow across 2 rows (the 8th cell is an empty slot; acceptable — it creates visual breathing room in the bottom-right corner).
- Tailwind: `grid grid-cols-3 xl:grid-cols-4 gap-y-[var(--space-global-lg)] gap-x-[var(--space-global-md)]`
- Leave the existing `grid-cols-4` behaviour as the canonical desktop form because the original build is tuned for it and the art direction brief's "well-organised knowledge map" language suits the denser grid. If `lg` (1024–1279) feels cramped in review, drop to 3 columns at that band.

**Category group.**
- Heading: Lexend 600, size `--text-card-size-body` (14px), colour driven by the category token (`--cat-relationships`, `--cat-safety`, `--cat-identity`, `--cat-sexual-health`, `--cat-wellbeing`, `--cat-online-safety`, `--cat-puberty`). These are set inline via a CSS custom property (`--cat-color`) so a single class rule can consume them.
- Border under heading: `2px solid var(--cat-color)` — the category colour is the category's visual signature. Tailwind: `border-b-2 pb-1.5 mb-2`.
- Tailwind for the `<ul>`: `list-none p-0 m-0 flex flex-col gap-0.5`

**Category links.**
- Tailwind: `block px-2 py-1 rounded-[var(--radius-xs)]`
- Font: `--font-shell-body-stack`, size `0.85rem`, weight 400, colour `--text-body`
- Hover: background `--bg-surface-alt`, colour `--brand-accent-text`
- Transition: `--transition-duration --transition-easing` on background and colour

Note on the `0.85rem` link size: this is sub-token and comes from the existing build. The mega menu is a dense scanning surface, not reading prose, so it sits slightly below `--text-card-size-body`. If the review team wants a token, add `--text-nav-meta: 0.85rem` to the typography section; otherwise accept the literal.

**Footer row.**
- Tailwind: `mt-[var(--space-global-md)] pt-[var(--space-global-sm)] border-t-[var(--border-width-xs)] text-center`
- Border colour: `--border-subtle`
- "View all topics" link: Lexend 500, `--text-card-size-body`, `--brand-accent-text`, underline on hover.

### Mobile (inside D3)

The mega menu collapses to an inline accordion panel that opens beneath the "Topics" mobile nav row. No flyout; no overlay.

- Tailwind: `pl-[var(--space-global-sm)]` (matches current build — the slight indent visually subordinates the sub-items to the parent nav row)
- Each category group: `mb-[var(--space-global-sm)]`
- Category heading: Lexend 600, `0.8rem`, uppercase, letter-spacing `0.04em`, colour `var(--cat-color)`, border-bottom `2px solid var(--cat-color)`, `pb-1 mb-1`. The uppercase treatment is intentional — on mobile the category headings need to be visually distinct from the nav rows because they sit in the same narrow column.
- Links: `block px-2 py-[0.4rem]` Lexend 400 `0.9rem` colour `--text-body`. Active/hover: colour `--brand-accent-text`.
- "View all topics" row at the end: `block py-2 0.9rem` Lexend 500 colour `--brand-accent-text`.

---

## D3 — Mobile navigation

### Role
The expanded navigation panel revealed when the hamburger is tapped. Contains every item from A3 in the canonical order, plus the expanded Topics and RSE Delivery accordions.

### Structure

**Outer element.** `<div id="mobile-nav" aria-hidden="true">`. Sits inside the `<header>` after the inner row, so it flows beneath the sticky bar.

- Tailwind open state: `block`. Closed: `hidden`. Driven by the `aria-hidden` attribute value, not a JS class, so the state lives in one place.
- Background: `--bg-surface`
- Top border: `var(--border-width-xs) solid var(--border-subtle)`
- Padding: `py-[var(--space-global-sm)] px-[var(--space-global-gutter)]`
- Height constraint: `max-h-[calc(100vh-var(--header-height))] overflow-y-auto`
- `lg:hidden` to ensure it never renders on desktop even if the attribute is toggled.
- Body scroll lock while open: the existing `body.nav-open { overflow: hidden }` rule stays.

**List.** `<ul role="list">` Tailwind `list-none p-0 m-0`. Each `<li>` as described in A3 (mobile composition).

**Accordion panels (Topics, RSE Delivery, RSE Training & Support).**
- Closed: `aria-hidden="true"` → `display: none`.
- Open: `aria-hidden="false"` → `display: block`.
- Panel: `pb-[var(--space-global-sm)]`. The panel content is the mobile mega menu (see D8 mobile) for Topics, or a simple link list for RSE Delivery and RSE Training & Support (Tailwind: `list-none p-0 m-0 pl-[var(--space-global-sm)] flex flex-col gap-0.5`, each link using the same mobile sub-item style as D8 mobile).

**Motion.** No slide animation on the panel itself in v1. The expansion is instant, which aligns with the art direction brief's "no bouncy youthful transitions" rule. Tap feedback on the trigger rows (subtle `--bg-surface-alt` on `:active`) is enough.

### Search on mobile

The SearchBar icon lives in the header utility cluster, not inside D3. When tapped, it opens its own expanded state (D2 — specified in Phase 6). The mobile nav panel does not embed a search input in v1. If user testing shows this is confusing, add an inline search row at the top of D3 in v2.

---

## A2 — Site footer

### Role
Persistent dark authority band at the bottom of every page. Carries trust (legal, safeguarding, accessibility, CIC registration), wayfinding (link columns), branding (both Tailor and Okay to Ask lockups), and the Guess Design House credit.

### Desktop (≥ 768px — the footer flips earlier than the nav)

**Outer element.** `<footer>` outside `<main>`, always Lexend.

- Background: `--bg-emphasis`
- Text colour: `--text-on-dark`
- Font: `--font-shell-body-stack`
- Padding: `pt-[var(--space-global-xl)] pb-[var(--space-global-lg)] px-[var(--space-global-gutter)]`
  - Top gap = 3rem, bottom gap = 2rem, horizontal = page gutter. The asymmetric top/bottom is intentional: the footer should feel like it's descending into closing, not terminating abruptly.

**Inner wrapper.** Tailwind: `mx-auto w-full max-w-[var(--container-max-shell)]`.

**Three vertical stripes, stacked:**

1. **Top stripe — brand block + nav columns** — `grid` layout. Border-bottom `--border-width-xs` solid `--border-subtle-on-dark`. Padding-bottom: `--space-global-lg` (2rem).
2. **Middle stripe — social row** — `py-[var(--space-global-md)]` (1.5rem vertical). Border-bottom `--border-width-xs` solid `--border-subtle-on-dark`.
3. **Bottom stripe — legal + credits row** — `pt-[var(--space-global-md)]`.

### Top stripe — brand + nav columns

**At md (≥ 768px):** `grid grid-cols-[1.2fr_2fr] gap-[var(--space-global-xl)]`. Brand sits left at 1.2fr, nav group right at 2fr.

**At mobile (< 768px):** `grid grid-cols-1 gap-[var(--space-global-xl)]`. Brand stacks above nav.

**Brand block.**
- Logo (light variant): `h-8 w-auto mb-[var(--space-global-sm)]`
- Strapline ("Expert RSE for every school."): `--text-prose-size-body`, weight 400, `opacity: 0.9` (this opacity is literal in the current build; it could be replaced by a token like `--text-on-dark-muted` but `--text-muted-on-dark` already exists at `rgba(255,255,255,0.6)` which is slightly too dim for a strapline. Keep the literal or add a new `--text-on-dark-strapline: rgba(255,255,255,0.9)` token. I recommend adding it — it's used in exactly this place and possibly in hero subheadings on dark hero sections.)
- OtA attribution line ("Okay to Ask is a Tailor Education project."): `--text-card-size-body`, colour `--text-muted-on-dark`.

**Nav columns.** Three columns: Topics, For schools, About (as currently built). Inside the right slot of the top stripe grid.

- Tailwind: `grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-[var(--space-global-lg)]`
- `auto-fit` lets the three columns collapse gracefully at narrow widths.

**Column heading.** Lexend 600, `--text-card-size-body`, uppercase, letter-spacing `0.04em`, colour `--text-on-dark` with `opacity: 0.7`. Tailwind: `mb-2`.

**Column list.** `list-none p-0 m-0 flex flex-col gap-[0.375rem]`. Each `<a>`: colour `--text-on-dark`, font-size `0.9rem`, `opacity: 0.85` rest → `1` hover, underline on hover.

(Note: the `0.9rem` literal, and the opacity literals, recur across the footer. If the review team wants to formalise them, propose: `--text-footer-link: 0.9rem` and `--text-on-dark-link-opacity-rest: 0.85` / `--text-on-dark-link-opacity-hover: 1`. I don't think this is worth token-promoting yet — they only appear in the footer. Keep literals but document them here.)

### Middle stripe — social row

- Tailwind: `py-[var(--space-global-md)]`
- Contains a single `<a>` lockup: icon + "@oktoask.co.uk" text, Tailwind `inline-flex items-center gap-2`, colour `--text-on-dark`, size `0.9rem`, opacity `0.85` → `1` hover.

Future-proofing: if more social links are added, the row becomes `flex flex-wrap gap-x-[var(--space-global-lg)] gap-y-[var(--space-global-sm)]`.

### Bottom stripe — legal + credits

**At md (≥ 768px):** `flex flex-row justify-between items-center gap-[var(--space-global-sm)]`.

**At mobile (< 768px):** `flex flex-col gap-[var(--space-global-sm)]`.

**Legal cluster (left on desktop, top on mobile).**
- Tailwind: `flex flex-wrap gap-x-[var(--space-global-md)] gap-y-[var(--space-global-sm)]`
- Links: Safeguarding, Accessibility, Privacy policy. Each: colour `--text-on-dark`, size `0.8rem`, opacity `0.7` rest → `1` hover, underline on hover.

**Credits cluster (right on desktop, bottom on mobile).**
- Tailwind: `flex flex-wrap items-center gap-1`
- Size `0.8rem`, opacity `0.6`. Contains, in order: copyright line (`© {year} Tailor Education CIC` — company number to be appended inline once the CIC registration is complete), middle dot separator, Guess Design House credit with link (underline at rest).

**Cookie notice link (flagged as missing from current build).** The Page Content Spec lists item 7 "Cookie notice link (if not handled by a banner/modal)". Add a third item to the legal cluster (`Cookies`) until a banner/modal is implemented. Link destination: `/privacy#cookies`.

### Mobile footer

Already covered above by the responsive fallbacks. Summary:
- Top stripe collapses to a single column; brand above nav.
- Nav columns still use `auto-fit minmax(10rem,1fr)` — at < 480px, that becomes one column; at 480–767px it may be two columns depending on available width. Both are acceptable.
- Middle stripe unchanged.
- Bottom stripe stacks legal above credits, both left-aligned.

The footer height is allowed to be tall on mobile — this is a trust page-tail, not a space-constrained UI surface.

---

## Layer boundaries — where Tailwind ends and tokens begin

For the shell only, here is the hard boundary the developer should enforce:

**Tailwind handles:** `sticky`, `top-0`, `z-[…]`, `h-16`, `w-full`, `max-w-[…]`, `mx-auto`, `flex`, `grid`, `grid-cols-*`, `gap-*`, `items-*`, `justify-*`, `px-*`, `py-*`, `mt-*`, `mb-*`, `hidden`, `block`, `lg:hidden`, `lg:flex`, `md:grid-cols-*`, `list-none`, `shrink-0`, `flex-1`, `overflow-*`, `border-0` (resets).

**Tokens handle:** every background, every foreground, every font family/size/weight, every border colour, every border width (via `--border-width-*`), every radius, every shadow, every transition duration/easing, every opacity value tied to a specific role (via new tokens if promoted), and the container width (via `--container-max-shell`).

Specifically: **no Tailwind colour classes** (`bg-white`, `text-gray-900`, `border-gray-200`) appear in the shell. Tailwind arbitrary values consuming tokens (`bg-[var(--bg-surface)]`) are acceptable and are the mechanism by which the two systems meet.

---

## Accessibility notes for the shell

- Header: `<header role="banner">` (implicit), single `<nav aria-label="Main navigation">` for the desktop list, separate `<nav aria-label="Mobile navigation">` inside D3. Do not share one nav landmark between breakpoints — the two are distinct in the DOM and screen readers should see them independently.
- Skip link: add `<a href="#main" class="sr-only focus:not-sr-only">Skip to main content</a>` as the first child inside `<header>`. Style via tokens: when focused, `bg-[var(--bg-surface)] text-[var(--text-body)] px-[var(--space-global-sm)] py-[var(--space-global-xs)] rounded-[var(--radius-sm)] shadow-[var(--shadow-md)]`. This is a shell requirement, not an afterthought — the brief says accessibility is part of the mood.
- Focus rings use `--focus-ring`, `--focus-ring-width`, `--focus-ring-offset` throughout. Inside the footer (dark ground), switch to `--focus-ring-on-dark`.
- Mega menu: `role="region"` with `aria-label` (already present). The trigger button carries `aria-expanded` and `aria-controls`. Links inside are a plain list — no `role="menu"` (this is navigation, not a menubar).
- Mobile nav: `aria-hidden` toggling is correct. Add `inert` on the panel when closed so focus can't tab into hidden items. Add `aria-modal="true"` only if the hamburger trap is made modal; v1 does not modal-trap, so omit.

---

## Summary of deltas against the current build

These are the places where this layout spec differs from what's in `SiteHeader.astro`, `SiteFooter.astro`, and `TopicsMegaMenu.astro` today. Claude Code should apply these changes when implementing the shell.

1. **Restructure the primary navigation.** Remove "Training" and "Services" as standalone nav items. Add **RSE Delivery** dropdown (5 items: RSE for Primary Schools, RSE for Secondary Schools, RSE for SEND & AP / Circuits, Direct RSE Delivery, Drop Days). Add **RSE Training & Support** dropdown (2 items: RSE Training, RSE Policy & Curriculum Planning). Final nav order: Topics, Okay to Ask, RSE Delivery, RSE Training & Support, Blog, About, Contact.
2. Add the **skip link** as the first child of `<header>`.
3. Add a **Cookies** link to the footer legal cluster.
4. Introduce new tokens **`--container-max-shell`**, **`--header-height`**, **`--z-header` / `--z-mega` / `--z-mobile-nav`**, and optionally **`--text-on-dark-strapline`**. Replace the existing `max-width: 72rem` literal in the header and footer CSS with `var(--container-max-shell)`. Replace the `height: 4rem` / `max-height: calc(100vh - 4rem)` literals with the header-height token.
5. Raise the base value of **`--space-global-gutter`** from `clamp(0.75rem, 2vw, 2rem)` to `clamp(1rem, 2vw, 2rem)`. This is a site-wide change — flagged here because the shell is the first place it shows.
6. Add `inert` attribute handling on the mobile nav panel when closed (JS concern — noted for the build).
7. Everything else in the current build is correct and should remain.

---

*Document version: 1.1 — shell layer, layout spec. Nav restructured: Services removed, RSE Training & Support dropdown added, Drop Days moved under RSE Delivery. Next: C1 question page.*
