# CLAUDE.md — session instructions for this repo

This file auto-loads at the start of every Claude Code session in this
project. Read it first, then follow its pointers.

## Design system (mandatory before any CSS or component work)

This repo has a mature, opinionated design system. Every token and
component class exists for a reason. Before writing any CSS or applying
any class to markup, read these two documents in full:

- **`docs/CLAUDE-CODE-OPERATING-RULES.md`** — the behavioural rules.
  Mandatory "grep the CSS first" workflow, codified user preferences
  (tint is the default, never default to outline; three-layer button
  class structure; etc.), the anti-pattern table, and the component
  catalogue with a "Status in Tailor" column showing what's actually
  present in this fork vs. documented-but-not-ported.

- **`docs/Tailor_Design_System_Implementation_Notes_v2.md`** — the
  Tailor-specific context. OtA layer split, safeguarding tokens,
  layer-scoping pattern (`.layer-ota` on `<main>`, not `<body>`), the
  drift table (what's still bespoke and why), and the fork-subset
  awareness section.

The **source of truth** is `src/styles/tailor-site-v2.css`. Grep it for
specific classes and tokens — never guess, and don't read it wholesale
(it's ~3,700 lines; wholesale reads waste context).

`docs/SYSTEM-RULES.md` is the canonical Guess Design House master
system catalogue. Reference it when the operating rules or v2 notes
point to a specific section; it doesn't need to be read up-front every
session.

## The one rule that governs everything

Every visual value must reference a design token. No hardcoded hex, rgb,
rgba, or pixel values for colours, spacing, radius, shadow, font-size,
or z-index in component CSS or inline styles. Only exception: pixel
values inside `@media` queries (CSS custom properties don't work there)
— use raw px with a comment naming the breakpoint token.

## Container widths

Pick one of the named container tokens — never pick a number by hand.
See `docs/Tailor_Design_System_Implementation_Notes_v2.md` →
"Container widths and layout rhythm" for the full rules. Quick version:

- `--container-max-shell` → header, footer, every page section outer
- `--container-max-hero-text` (48rem) → hero H1 + subtitle, centred CTAs
- `--container-max-text-col` (36rem) → text column beside an image
- `--container-max-prose` (44rem) → long-form editorial reading
- `--container-max-reading-wide` (56rem) → OtA Q&A metadata bands

Always cap the wrapper, not individual `__title` / `__intro` / `__desc`
elements — heading and body must share the same right edge.

## When you're unsure — don't guess

1. Grep `tailor-site-v2.css` for the relevant pattern (`--btn-`,
   `.surface--`, `--text-`, etc.) and read what comes back.
2. If grep doesn't reveal what you need, ask the user for the correct
   token or class — don't invent one.
3. If the user's request is ambiguous about hierarchy or context
   (e.g. "add a button" — primary or tint? where will it live?), ask
   before placing it.

## Project context

- **Framework**: Astro (static output, Vercel deploy via `main` branch).
- **Styling**: CSS custom properties throughout, with Tailwind utilities
  for layout only (no colour/typography utilities). All design values
  come from `tailor-site-v2.css`.
- **Layers**: Tailor pages use Lexend + brand teal. Okay-to-Ask pages
  (`/questions/*`, `/glossary/*`, etc.) add `.layer-ota` to `<main>`
  for Atkinson Hyperlegible body + Fraunces headings + warm paper
  surfaces. Header and footer always stay in the Tailor layer.
- **Dev server**: `preview_start` with the `dev` launch config (port
  4321). Use it for any observable CSS/UI change.

## Post editor (`/studio`)

The site has a browser-based editor for blog posts. It reads and writes
the same `src/content/blog/<slug>/index.mdx` files you edit from here,
committing each save to `main` through the GitHub API — so it is a third
writer on the same source of truth, not a parallel one.

Two things follow for any session that touches blog content or the
editor:

- **Frontmatter and body formatting are load-bearing.** The editor keeps
  diffs minimal by re-emitting only the fields that changed. Reformatting
  a post's frontmatter by hand (re-quoting, reordering keys) will show up
  as churn in the next editor save.
- **`src/lib/studio/schema.js` mirrors the blog schema in
  `src/content.config.ts`.** Add a field to one and you must add it to
  the other, or the editor will refuse to save that field.

Read `docs/POST-EDITOR.md` before changing anything under
`src/pages/studio/`, `src/pages/api/studio/` or `src/lib/studio/`.
Run `npm test` after — `tests/studio-roundtrip.test.mjs` checks the
round-trip guarantees against every real post.

## Git and deploy

- Commit style: imperative, topical; multi-line bodies with concrete
  details. See recent commits for the house style.
- `main` is auto-deployed by Vercel. Don't force-push. Don't commit
  without the user asking. When committing, follow the existing
  `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`
  trailer pattern.
