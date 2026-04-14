# Tailor Education Site — Claude Code Context

## Read these first, every session, in this order

1. **`/Users/gareth/Desktop/Guess Design House Design System/CLAUDE-CODE-OPERATING-RULES.md`** — operating rules for any CSS or markup work. Mandatory grep-first workflow, button family pairing rules, what auto-swaps on dark surfaces, anti-patterns. **The tiebreaker over any per-task brief.**
2. **`/Users/gareth/Desktop/Guess Design House Design System/SYSTEM-RULES.md`** — full design system reference: token architecture, naming conventions, every component (structure, tokens, variants, accessibility), decision trees.
3. **`src/styles/tailor-site-v2.css`** — the project's design system file (a fork of the GDH master). Source of truth for what tokens and classes actually exist in this codebase. Token names may differ slightly from the master — always grep this file before guessing.

## Project layers

- **Tailor layer** — all marketing pages (homepage, services, topics, blog, about, contact, training, our-approach, book, testimonials). Lexend body + headings.
- **Okay to Ask layer** — `/questions/`, `/anonymous_question/*`, `/glossary/*`. Marked by `.layer-ota` on `<main>`. Fraunces headings + Atkinson Hyperlegible body. Warm OtA surface palette.
- **Shell** — `<header>` and `<footer>` sit outside `<main>`. Always Lexend, always Tailor visual register.

## Project-specific conventions

- **Layout via Tailwind utilities; visual values via CSS custom properties from `tailor-site-v2.css`.** Never hardcode hex, font sizes, spacing, radii, or shadows in component markup or scoped `<style>` blocks.
- **Token edits are allowed** in `tailor-site-v2.css` — but check blast radius (grep usages) before changing a base token value.
- **No inventing token names.** If a token doesn't exist and isn't explicitly being added, flag it.
- **Pages and components live in `src/pages/` and `src/components/`.** Layout is `src/layouts/BaseLayout.astro`.
- **Notion content pipeline** drives topics, questions, glossary, services, blog posts. See `src/lib/content.ts` and friends.

## Active brief

When working through a multi-task brief, the per-task brief defines *what* to change; the design system docs define *how*. If the brief says "use 12px padding" and the docs say "use the em-based padding token," the docs win — flag the conflict to the user.

## Verification

After observable changes, restart the dev server (`npm run dev`) and ask the user to review in browser before proceeding. Build with `npm run build` to catch compile errors.
