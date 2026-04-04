# Stage 2 — Design system integration

*Briefing document for Claude Code. Read this first, then read the referenced files.*

---

## What you're building

Integrating Gareth's existing CSS token-based design system into the Astro project. This stage sets up font loading, the base layout shell (header placeholder, main, footer placeholder), the two-layer typographic system, and verifies the token system works end to end. No page content yet — just the visual foundation.

## What already exists

Stage 1 delivered the Astro project scaffold, Notion pipeline, route structure, and typed content collections. All routes exist as empty shells. Read the existing codebase before making changes.

## Files to read for this stage

```
styles/tailor-site-v2.css
docs/Tailor_Design_System_Implementation_Notes.md
docs/Tailor_Art_Direction_Brief_v1.md
```

The Implementation Notes tell you how to use the design system — critical rules, layer scoping patterns, component reference. The Art Direction Brief gives context on why the two layers exist and what each should feel like. You don't make design decisions — Gareth does — but understanding the intent helps you write correct markup.

## What to build

### 1. CSS integration

Copy `styles/tailor-site-v2.css` into the project (e.g. `src/styles/tailor-site-v2.css`). Import it globally in the base layout.

**Do not modify the CSS file.** It is Gareth's design system. If you need a value that doesn't exist as a token, flag it — don't invent an inline value.

### 2. Font loading

Add Google Fonts links in the `<head>` of every page. All three families load on every page:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,100..900,0..100,0..1;1,9..144,100..900,0..100,0..1&display=swap" rel="stylesheet">
```

### 3. Base layout component

Create `src/layouts/BaseLayout.astro` — the shared shell for every page:

```html
<html>
<head>
  <!-- fonts, meta, CSS -->
</head>
<body>
  <header><!-- placeholder: Tailor Education shell, always Lexend --></header>
  <main class={layer === 'ota' ? 'layer-ota' : ''}>
    <slot />
  </main>
  <footer><!-- placeholder: always Lexend --></footer>
</body>
</html>
```

The layout accepts a `layer` prop. When `layer="ota"`, it adds `.layer-ota` to `<main>`. This creates the typographic split: everything inside main gets Atkinson Hyperlegible (body) and Fraunces (headings), while the header and footer stay in Lexend.

### 4. Two test pages

Create two minimal test pages that prove the layer system works:

**Tailor layer test** (`/test-tailor`) — a page with headings, body text, a button, and a card surface. Uses the default Tailor layer (Lexend throughout, teal accents, `--bg-page` ground).

**Okay to Ask layer test** (`/test-ota`) — a page with `layer="ota"` that shows headings in Fraunces, body text in Atkinson Hyperlegible, the warm `--bg-ota-surface` ground, an OtA category badge, and a safeguarding alert component.

These test pages exist purely for visual verification. They can be removed later.

### 5. Surface classes

The CSS provides surface utilities. Make sure the layout supports:

- `.surface--ota` and `.surface--ota-alt` for warm OtA sections
- `.surface--dark` for authority bands (footer, dark hero sections)
- Standard `--bg-surface-alt` sections for alternating bands on Tailor pages

## Critical rules (from the Implementation Notes)

1. **Never hardcode colours, fonts, sizes, or spacing.** Every visual value must reference a `--token`.
2. **`.layer-ota` goes on `<main>`, not on `<body>`.** Header and footer sit outside and stay in Lexend.
3. **OtA category colours (`--ota-cat-*`) and app category colours (`--cat-*`) are separate systems.** Don't mix them.
4. **Safeguarding tokens (`--safeguarding-*`) are not UI state tokens (`--state-*`).** Different emotional calibrations.
5. **Crisis support (A9) and signposting (A8) must never have a dismiss button.** Safeguarding requirement.

## What "done" looks like

1. Both test pages render correctly with the right fonts, colours, and surfaces
2. The Tailor test page shows Lexend everywhere, teal buttons, neutral surfaces
3. The OtA test page shows Fraunces headings, Atkinson body, warm paper surface, correct badge and alert colours
4. The header and footer placeholders stay in Lexend on both pages
5. No hardcoded hex values, font names, or spacing values in any component markup
6. All three fonts load without FOUT (flash of unstyled text) on navigation between pages

## What NOT to build

- No real header/footer content (just placeholders with correct font inheritance)
- No page templates
- No JavaScript interactions
- No responsive layout system (that's built per-template in later stages)
- No Tailwind — the design system is pure CSS custom properties

## Layout note

The CSS file provides tokens and component classes but no layout system (no grid, no container widths, no responsive utilities). Layout CSS for each page template will be written in later stages using Astro component styles or a minimal utility approach. Don't add Tailwind or any CSS framework — keep it simple.

---

*Stage 2 of 6. Previous: Scaffold and Pipeline. Next: Core Templates (C1 + C2).*
