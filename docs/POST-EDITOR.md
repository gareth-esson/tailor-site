# Post editor (`/studio`)

A browser editor for the blog posts in `src/content/blog`. Sign in, pick
a post, edit the words and the metadata, press Save. A save is an
ordinary commit on `main`, so Vercel rebuilds and the change goes live —
normally within a couple of minutes.

It exists so a small fix doesn't need a laptop, a terminal, or Notion.

---

## Quick setup

Four variables in Vercel → Project → Settings → Environment Variables.
**Tick both Production and Preview for each one**, or the editor will
only work on one of them.

| Name | Value |
|---|---|
| `STUDIO_PASSWORD` | A long passphrase you choose. |
| `STUDIO_SESSION_SECRET` | Output of `openssl rand -base64 32`. Never typed by anyone. |
| `STUDIO_GITHUB_REPO` | `gareth-esson/tailor-site` |
| `STUDIO_GITHUB_TOKEN` | A fine-grained GitHub token — the only fiddly one, see below. |

**The token, in six clicks:** github.com/settings/personal-access-tokens/new
→ Repository access: *Only select repositories* → `tailor-site`
→ Permissions: *Repository permissions* → **Contents** → *Read and write*
→ Generate → copy it (GitHub shows it once).

Nothing else. That one permission on that one repository is the whole
blast radius: a leaked token can change files here and nowhere else.

Then redeploy — Vercel only picks up new environment variables on a new
build, so setting them doesn't affect the deployment already running.

Everything below is the reasoning and the detail. You don't need it to
get started.

---

## Why it commits to git rather than writing to a database

Three people change these files: Gareth in the browser, Claude and Codex
from a terminal. If the browser wrote to a database instead, there would
be two sources of truth within a fortnight and no way to reconcile them —
Claude would "fix" a typo in a file that no longer renders.

So the editor is a front-end over the same `.mdx` files, and every save
goes through the GitHub Contents API. Same history, same blame, same
review trail as an edit made from a terminal.

The consequences follow from that:

- **A save is a commit.** `git log` shows it, `git revert` undoes it.
- **A save is not instant.** Commit → Vercel build → live. Budget a
  couple of minutes, not a couple of seconds.
- **Concurrent edits are detected, not merged.** Each load carries the
  file's blob SHA and the save sends it back. If the file changed in the
  meantime the save is refused with a message, and your text stays in the
  editor until you reload. Nobody's work gets silently overwritten.

---

## Setting it up

Four environment variables in Vercel (Project → Settings → Environment
Variables). All four are required; without them `/studio` refuses every
login with a setup message rather than a confusing 401.

| Variable | What it is |
|---|---|
| `STUDIO_PASSWORD` | The passphrase you type to sign in. Make it long. |
| `STUDIO_SESSION_SECRET` | Random string used to sign the session cookie. Never typed by anyone. |
| `STUDIO_GITHUB_TOKEN` | A GitHub **fine-grained** personal access token (see below). |
| `STUDIO_GITHUB_REPO` | `gareth-esson/tailor-site` |

`STUDIO_GITHUB_BRANCH` is optional and defaults to `main`.

Generate the two secrets with something like:

```sh
openssl rand -base64 32   # run twice — one for each
```

### The GitHub token

Create it at **Settings → Developer settings → Personal access tokens →
Fine-grained tokens**:

- **Repository access**: *Only select repositories* → `tailor-site`.
- **Permissions**: *Contents: Read and write*. Nothing else.
- **Expiry**: set one. Ninety days is reasonable; put a reminder in the
  calendar, because the editor stops saving the day it lapses.

That scope is the blast radius. A leaked token can change files in this
one repository and nothing else — not other repos, not the account, not
Vercel.

### Why the variables are named `STUDIO_GITHUB_*`

A bare `GITHUB_TOKEN` is exported ambiently by CI runners, dev containers
and the `gh` CLI. An editor that silently changes *where it writes*
because an unrelated tool happened to set a variable is a trap — this was
caught during development, when a sandbox's ambient `GITHUB_TOKEN` made
the editor try to commit through a token that wasn't ours. Nothing but
this feature sets the `STUDIO_` names.

---

## Security posture

Be clear-eyed about what this is: one shared passphrase in front of a
token that can rewrite the site. The realistic worst case isn't data
theft, it's defacement of a live site about RSE.

What's in place:

- The token is server-side only. It is never sent to the browser, and
  the `/studio` pages are `noindex, nofollow` and disallowed in
  `robots.txt`.
- The session is a signed cookie — `HttpOnly`, `SameSite=Lax`, `Secure`
  in production — that expires after 12 hours. It carries no server
  state, so **rotating `STUDIO_SESSION_SECRET` signs everyone out
  immediately**. That's the move if a laptop or phone goes missing.
- Login is rate-limited through Redis (10 attempts per IP per hour, 60
  globally), so the count is shared across serverless instances rather
  than resetting every time Vercel hands out a fresh one. If Redis is
  configured but unreachable, logins are refused rather than run
  unprotected.
- Every save is validated against the content schema before it is
  committed (see below).

What is *not* in place: no second factor, and no per-user identity —
commits are attributed to whoever owns the token. If the editor ever gets
more than one user, that's the point to move to GitHub OAuth.

---

## Why saves are validated

`main` auto-deploys. A post committed with a `status` or `category` value
that Zod rejects fails `astro build`, and that takes down the *next
deploy of the whole site*, not just that post.

So `src/lib/studio/schema.js` mirrors the collection schema in
`src/content.config.ts` and the server checks every field against it
before writing anything. **If you add a field to `content.config.ts`, add
it to `schema.js` too** — otherwise the editor will refuse to save it.

---

## How it keeps diffs readable

A naive editor round-trips the whole file on every save, so a three-word
fix arrives as a 200-line diff and the other two editors can no longer
see what changed. Three things prevent that:

1. **Untouched frontmatter keeps its original bytes.** Fields are parsed
   into ordered blocks that each retain their source text; only fields
   you actually changed get re-emitted. A metadata-only save produces a
   one-line diff.
2. **A metadata-only save doesn't touch the body at all.** The prose
   bytes are left exactly as they were.
3. **A body is canonicalised only when it's genuinely edited** — once,
   the first time. The corpus has inconsistent blank-line spacing left
   over from the Notion migration (307 single, 247 double), so the first
   real edit to a post normalises its spacing and shows a slightly larger
   diff than the words alone. Every edit after that is clean. Use
   `git diff -w --ignore-blank-lines` to see just the words.

`tests/studio-roundtrip.test.mjs` enforces all of this against every real
post — run `npm test`.

---

## What the editor can and can't do

**Can**: edit the body with a rich-text editor (headings, bold, italic,
inline code, links, bullet and numbered lists, blockquotes); edit title,
status, dates, author, category, audience, tags, service link, meta
title/description, and the featured image's alt text and credit; switch
to a raw Markdown view.

**Can't**, by design in this version:

- **Create a new post.** Still a terminal job — a new post needs a
  folder, a slug and a featured image.
- **Upload or change the featured image.** Only its alt text and credit.
- **Edit Okay-to-Ask questions.** Those still come from Notion at build
  time. A git-backed editor can't reach them without moving that content
  out of Notion first, which is a much bigger job.
- **Edit pillar pages.** Blog only for now.

### The constrained schema

The editor can only produce formatting the blog templates actually style.
Code blocks, horizontal rules, strikethrough and underline are switched
off, so pasting from Word or a web page can't smuggle in syntax that
would render as literal text on the published page.

If a save would lose formatting — Markdown emphasis has flanking rules,
so bold that starts or ends mid-word can serialise to asterisks that read
back as plain text — the server compares the document it received against
a re-parse of the Markdown and **refuses the save** with an explanation.
It would rather stop than quietly drop your bold. In ordinary prose this
never fires.

If a post's existing body can't be represented exactly in the rich
editor, it opens in the Markdown view instead, with a notice. All 24
current posts open in the rich editor.

---

## Using it locally

`npm run dev` and visit <http://localhost:4321/studio/>. You still need
`STUDIO_PASSWORD` and `STUDIO_SESSION_SECRET` (put them in `.env`), but
**not** the GitHub ones: with no `STUDIO_GITHUB_TOKEN` set, a dev server
reads and writes the working tree directly instead of committing. Good
for trying an edit without putting it on the live site — `git diff` shows
what it did.

That path is gated on `import.meta.env.DEV`, which Vite replaces with a
literal at build time, so it is dead code in the Vercel build and cannot
be reached however production is configured.

One dev-only quirk: saving writes a file that Astro's content watcher is
watching, so the page hot-reloads straight after a save and the "Saved"
message disappears. The save still happened. This doesn't occur in
production, where the local file isn't touched.

---

## Where the code lives

| Path | What it does |
|---|---|
| `src/pages/studio/` | The three screens: login, post list, editor. |
| `src/pages/api/studio/` | Login, logout, and the post read/save endpoint. |
| `src/lib/studio/frontmatter.js` | Minimal-diff frontmatter parse and write. |
| `src/lib/studio/markdown.js` | Markdown ⇄ editor-document conversion. |
| `src/lib/studio/schema.js` | The editable fields and their validation. |
| `src/lib/studio/auth.ts` | Passphrase check and signed session cookie. |
| `src/lib/studio/github.ts` | GitHub Contents API client. |
| `src/lib/studio/store.ts` | Chooses GitHub or (in dev) the working tree. |
| `src/lib/studio/rate-limit.ts` | Redis-backed login throttle. |
| `src/scripts/studio-editor.ts` | TipTap setup, toolbar, save flow. |
| `src/styles/studio.css` | Project-specific `.studio-*` app chrome. |
| `tests/studio-roundtrip.test.mjs` | The round-trip guarantees, against real posts. |
