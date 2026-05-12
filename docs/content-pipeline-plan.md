# Tailor Education content pipeline — plan

**Status:** approved, not yet built. Build starts with Phase 0.
**Last updated:** 2026-05-12
**Authors:** Gareth Esson + Claude (planning conversation, two-LLM critique from ChatGPT and Gemini).

This doc is the single source of truth for the content automation system being built for Tailor Education. It exists for two audiences:

1. **Gareth**, returning to this plan after a break, needing to remember decisions.
2. **A future Claude Code session** starting cold and asked to execute a phase. Such a session should be able to read only this doc (plus `docs/editorial-policy.md`) and proceed without referring to any chat thread.

If anything here turns out to be wrong during build, update this doc in the same commit as the code change. Don't let the spec rot.

---

## 1. Context

### The business

**Tailor Education** is a UK community-interest company delivering Relationships and Sex Education (RSE) services to primary, secondary, SEND and alternative-provision schools. Single founder (Gareth Esson). Site: [tailoreducation.org.uk](https://tailoreducation.org.uk).

Current content stack:
- Astro 6 static site, Vercel deploy.
- Notion as CMS for 16 blog posts, 152 anonymous student questions, 145 glossary terms, 23 topic landing pages, 8 testimonials, 249 curriculum statements.
- Resend for transactional email (book orders, contact-form enquiries).
- Redis (Vercel KV) for state (book order tracking).

### The orchestration layer that already exists

**GDH SEO** is an internal tool at [seo.guessdesignhouse.com](https://seo.guessdesignhouse.com) (operator-only). It's a Claude-powered SEO reporting app serving multiple clients. Tailor is one of them. Per client, it stores brand context (voice, audiences, off-brand areas, growth areas) and runs monthly GSC + GA4 analysis through Claude Sonnet to produce structured reports.

The Content Studio described in this plan extends GDH SEO. We are not building a new app.

### The pain that triggered this work

Notion in the build pipeline causes real problems for prose content:
- Signed S3 image URLs that expire (~1h), forcing a build-time download cache.
- Em-dash auto-conversion polluting every page.
- API rate limits requiring a dev-time cache (`notion-cache.ts`) to make `npm run dev` usable.
- Every Vercel build refetching all content.
- No version control on content; no `git blame` on a paragraph.

Manual content workflow is also unsustainable. Tailor publishes sporadically. Distribution is ad-hoc. Sector landscape research, SEO opportunities, and editorial calendar are tracked in human memory.

### The goal

Sustainable **weekly content cadence** with multi-channel distribution. Per week:

- 1 long-form blog post on the site.
- 2 LinkedIn posts (Tuesday announcement, Thursday follow-up).
- 1 Instagram carousel (Friday, text-based, branded).
- 1 newsletter (Pattern B: short, punchy, opinionated, ~200 words, links to the blog post).

### The non-negotiable constraint

**Gareth writes and edits everything. AI never publishes directly.**

The system's job is to compress time-to-publish-ready-draft, surface decisions Gareth would otherwise miss (sector news, opportunity queries, topic-cluster gaps), and remove friction from distribution. It is not a content generator that runs autonomously. Every published artifact is human-finalised.

This framing is load-bearing for the architecture. It removes some risk classes (AI-detection paranoia in audience, voice drift, full-blown safeguarding incidents) and adds one (the AI must save real time, not just feel productive).

---

## 2. Channel decisions

| Channel | Status | Rationale |
|---|---|---|
| Blog (site) | Primary owned channel | SEO, owned, no algorithm risk |
| Newsletter | Build | Owned channel, hedge against social-platform throttling |
| LinkedIn | Build (manual posting) | Right audience for B2B education |
| Instagram (text carousels) | Build (manual posting) | Reach + brand-building; carousels outperform photo posts 3–5× |
| X / Twitter | **Skip** | Wrong audience, hostile algorithm tone around RSE / safeguarding / LGBT+, poor reach |
| TikTok | Skip | High content cost, brand risk in RSE space, not where decision-makers live |
| YouTube | Defer | Possibly worth later for explainers; not a starting channel |

### Visual content policy

- **Carousels: text-only, branded design.** No photos. No AI-generated illustrations of people.
- **Featured images for blog posts**: licensed stock photography, sourced from Unsplash/similar (with credit), or own photography. **No AI-generated photographic imagery of children or classrooms.** Reasons: model release issues, deepfake-adjacent perception, schools/parents will push back.
- **AI graphics (icons, diagrams, abstract illustrations)**: acceptable if visually good and clearly not photographic.

---

## 3. Architecture decisions

### 3.1 Blog content: Astro Content Collections + Keystatic, replacing Notion

**Decision**: Migrate the 16 blog posts from Notion to file-based markdown using Astro Content Collections. Editor UI is Keystatic, running locally during `npm run dev`. Content lives in `src/content/blog/{slug}/index.md` with images alongside.

**Rationale**:
- Solves all the Notion pain (expired image URLs, em-dash corruption, rate limits, build-time API dependency, no version control).
- Astro's native image pipeline replaces the manual `optimize-hero-images.mjs` + `blog-image-cache.ts` workaround.
- Keystatic stores everything as plain markdown; if Keystatic ever dies, content survives intact.
- Free, MIT, no SaaS dependency.

**Alternatives rejected**:
- Stay on Notion: doesn't solve any of the existing pain.
- Custom CMS: years of UI work for no advantage over Keystatic.
- Sanity / Strapi / Hygraph: heavier infra, headless-CMS SaaS dependency, content not in git.

### 3.2 Structured content types: also migrate, in Phase 0

**Decision**: Migrate glossary (145), anonymous questions (152), testimonials (8), and curriculum statements (249) from Notion to Astro Content Collections in Phase 0. Use Keystatic's structured-data collection editors for ongoing editing.

**Defer**: topic landing pages (23). These have prose-heavy bodies and are essentially a second blog migration. Migrate them after the Phase 1 validation sprint passes.

**Rationale**:
- These four types are structured records (small, schema-shaped), not prose. Migration is scriptable in a day; no rich-text-to-markdown conversion needed.
- Keeping them in Notion means Content Studio either calls Notion live during drafting (slow, rate-limited) or relies on a snapshot job that lags behind Notion edits. Both are worse than just having the data in the repo.
- Astro can then validate cross-references at build time (e.g., "blog post X links to glossary term Y — does Y exist?").
- CI builds get faster (fewer Notion fetches).

**Earlier framing rejected**: I (Claude) initially argued for keeping these in Notion. Gemini's critique pointed out the cost of half-in / half-out architecture and the user explicitly asked the question. On re-evaluation, the migration cost for structured records is much lower than for prose, and the ongoing simplicity is worth the extra day.

### 3.3 Newsletter: custom-built on Resend Broadcasts, Pattern B

**Decision**:
- Newsletter content is a separate content collection (`src/content/newsletter/{slug}/index.md`) — not a re-email of the blog post.
- Each issue is short (~200 words), opinionated, links to the corresponding blog post.
- Send via Resend's **Broadcasts** endpoint (not transactional) to inherit List-Unsubscribe headers, suppression list, bounce/complaint handling, one-click unsubscribe POST.
- Subscriber list stored in Redis.
- Public archive at `/newsletter/{slug}` for SEO.
- Sender domain isolation: marketing broadcasts use a separate sending subdomain to avoid damaging transactional (book order, contact form) email deliverability.

**Pattern B specifics**:
- **Subject line ≠ post title**. Optimised for opens: 5–7 words, intrigue or claim or question.
- **Body**: hook in first sentence, opinionated take, plain-spoken, no jargon, single CTA at end: `Read the full piece →`.
- **Optional PS**: high-attention. Sector tidbit, reading rec, quick thought, one-line story.
- **Reply-to**: `hello@tailoreducation.org.uk` (or `newsletter@`). Replies are conversation, not support tickets.

**Alternatives rejected**:
- Substack: SEO dilution (content lives on Substack CDN), audience-discovery network skews tech/culture not B2B education.
- Mailchimp / ConvertKit / Loops.so: no public web archive without extra work; content not on tailoreducation.org.uk; loses SEO benefit.
- Resend transactional API for broadcasts: forces us to implement List-Unsubscribe / suppression / bounce-handling manually. Broadcasts gives it for free.

### 3.4 Content Studio: built inside GDH SEO

**Decision**: Build Content Studio as a module within the existing GDH SEO app, not as a separate application.

**Module structure** (intentionally separate from the SEO-reports module, even though they live in the same repo):

```
gdh-platform/
├── modules/
│   ├── seo-reports/      ← existing
│   ├── content-studio/   ← new
│   ├── brand-contexts/   ← shared (already exists per-client)
│   └── publishing-targets/  ← new (Tailor's GitHub repo, sender domain, etc.)
└── clients/              ← shared (Tailor, future clients)
```

**Rationale**:
- GDH SEO already has the Claude API plumbing, per-client brand context store, and GSC/GA4 data integration. Reusing these vs. duplicating is the obvious call.
- Multi-tenant from day one: every other GDH client can get the same Content Studio when ready.

**ChatGPT's concern addressed**: ChatGPT worried that "SEO reports" would remain the parent concept and Content Studio would feel grafted-on. The module structure above explicitly avoids that — SEO reports are one module among several, not the parent.

### 3.5 IG carousel rendering: HTML + Puppeteer, outputs PNG sequence AND PDF

**Decision**: Render carousels from HTML templates using Puppeteer (or Playwright) headless. Templates use Tailor's existing design tokens (Lexend headings, brand green, OtA palette). Claude generates JSON slide content; renderer produces both:

- **PNG sequence** (1080×1350 each) for standard IG carousel upload via Publer/Buffer.
- **PDF** for IG document upload (which IG displays as a carousel). Some regions show document uploads higher in the algorithm; text remains selectable/searchable for accessibility.

5 initial template types:
1. Numbered list ("5 myths about RSE in primary schools")
2. Step-by-step ("How to write your RSE policy in 4 stages")
3. Myth vs fact (alternating layout)
4. Quote card (pulled paragraph + attribution)
5. Stat punch (open with a striking number)

Claude picks the template type based on the source post.

**Alternatives rejected**:
- Placid / Bannerbear: $25/month each, can't pixel-match site brand, SaaS dependency.
- Canva bulk-create: not API-friendly, UI-driven.

### 3.6 Social posting: manual via Publer or Buffer

**Decision**: Drafts generated in Content Studio. Operator copies into Publer (or Buffer) for scheduling. No direct LinkedIn / Instagram API integration in any phase.

**Rationale**:
- LinkedIn API requires Company Page admin permissions + OAuth + app review process. Often blocked for new apps.
- Instagram Graph API requires Business Account linked to Facebook Page, two-step container-publish flow for carousels, cryptic format-rejection failures.
- Maintenance burden for a single-founder operation is not worth the time saved.
- Manual posting takes ~5 minutes/post via Publer. Acceptable.

**Choice of Publer over Buffer**: Publer handles IG carousel uploads natively (no faffing with multi-image API), first-comment scheduling for hashtags, $9.60/month covers LinkedIn + IG. Buffer works but is slightly less carousel-savvy.

### 3.7 Editorial policy: three companion docs, hard-coded rules

**Decision**: Editorial guidance for Tailor lives in three docs in this repo, each with a different scope:

- **`docs/Tailor_Blog_Writing_Rules.md`** — voice, tone, structure, and the things-to-avoid list for Gareth's first-person blog voice. Authoritative for blog drafting.
- **`docs/Tailor_Site_Copy_Writing_Rules.md`** — the organisation's "we" voice, used for service pages, homepage, about, and landing pages. Includes the stance section (no punchdowns, no imagined bad providers, end on purpose not contrast).
- **`docs/editorial-policy.md`** — safety, safeguarding, and legal-risk hard rules that the voice docs don't cover. Plus the Red Team prompt specification.

All three are referenced by every Content Studio prompt and versioned in git.

**Why three files instead of one merged policy**: The voice docs already existed and represent real codified feedback rounds from Gareth (the site-copy doc is at v1.2.2 after multiple revisions). They are the authoritative source for *how* to write. The new safety doc handles *what may not be published* — a different concern requiring different enforcement. Merging would dilute both and obscure the voice docs' clear "things to avoid" pattern.

**Enforcement scope:**
- Voice issues → `concern` severity in the Red Team review. Advisory; never blocks publish.
- Safety issues per `docs/editorial-policy.md` → `block` severity. Requires operator override + fix to publish.

### 3.8 Prompts versioned in git (in GDH SEO repo)

**Decision**: Every Claude prompt used by Content Studio is stored as a markdown file in the GDH SEO repo (e.g., `prompts/brief-generation.md`, `prompts/blog-drafting.md`, `prompts/safeguarding-review.md`). Not hardcoded in TypeScript.

**Rationale**: Prompts are content — they evolve with the brand. Versioning lets you `git blame` "when did we change the brief-generation prompt and did engagement improve afterwards?" Cheap now, painful to retrofit.

---

## 4. Content models

### 4.1 Blog post frontmatter schema

Every `src/content/blog/{slug}/index.md` starts with:

```yaml
---
# --- Identity ---
title: "2026 RSE guidance: a plain-English summary"
slug: "2026-rse-guidance-plain-english-summary"  # derived from folder name; included for explicit reference
description: "What's actually changed in the September 2026 DfE statutory guidance, distilled for busy PSHE leads."  # also used as meta-description

# --- SEO ---
metaTitle: null  # override of <title> if different from title; null = use title
canonicalPath: null  # override if needed; null = /blog/{slug}/

# --- Authorship ---
author: "Gareth Esson"
publishedDate: 2026-04-18
lastReviewedDate: 2026-04-18  # when this post was last fact-checked by a human

# --- Categorisation ---
category: "Guidance"  # one of: Guidance, Practical, Opinion, Sector, Research
targetAudience: "PSHE leads"  # one of: PSHE leads, School leaders, Teachers, Parents, Decision-makers
serviceLink: "RSE training"  # which Tailor service this post supports

# --- Topic-cluster discipline (ChatGPT critique addition) ---
primaryTopic: "rse-policy"  # landing-page slug; this post strengthens this cluster
secondaryTopics:
  - "puberty"
  - "consent"
linkedGlossaryTerms:
  - "consent"
  - "statutory-guidance"
linkedStudentQuestions:
  - "is-16-the-right-age-of-consent"
  - "how-do-condoms-prevent-pregnancy"

# --- Content tags ---
contentTags:
  - "guidance"
  - "statutory"

# --- Featured image ---
heroImage: "./hero.jpg"  # relative to this folder
heroImageAlt: "Stack of statutory guidance documents on a teacher's desk"
imageCredit: "Photographer Name"  # optional, surfaces a credit line under the image
imageCreditUrl: "https://unsplash.com/@photographer"  # optional

# --- Provenance (Gemini + ChatGPT critique addition) ---
draftedWithAI: true
humanEditedBy: "Gareth Esson"
factCheckedOn: 2026-04-18
primarySources:
  - title: "DfE Relationships, Sex and Health Education statutory guidance (2026 update)"
    url: "https://gov.uk/..."
    accessed: 2026-04-18
contentRisk: "medium"  # one of: low, medium, high
contentType: "guidance"  # one of: guidance, opinion, explainer, news-response, evergreen
sourceBriefId: "brief-2026-04-12-001"  # GDH SEO Content Studio brief ID, for traceability
repurposedFrom: null  # slug of post this was derived from, if any
canonicalCluster: "rse-policy-2026-guidance"  # internal grouping for posts about the same theme

# --- Maintenance ---
reviewBy: 2026-10-18  # when this post should be re-fact-checked (default: +6 months for guidance-sensitive)
guidanceSensitive: true  # true if the post cites DfE / KCSIE / Ofsted / RSHE / statutory anything

# --- Distribution status (added by Content Studio when derivatives ship) ---
distribution:
  newsletter:
    issueSlug: "what-everyone-got-wrong-this-week"
    sentAt: null
  linkedinAnnouncement:
    publerPostId: null
    publishedAt: null
  linkedinFollowUp:
    publerPostId: null
    publishedAt: null
  instagramCarousel:
    publerPostId: null
    publishedAt: null
---

# 2026 RSE guidance: a plain-English summary

The September 2026 update isn't a rewrite — it's a clarification…

(body in markdown)
```

### 4.2 Newsletter issue frontmatter schema

`src/content/newsletter/{slug}/index.md`:

```yaml
---
title: "The RSE guidance everyone's misreading"   # archive page title
subject: "What everyone got wrong this week"      # email subject line — different from title
preheader: "The DfE update isn't what most schools think it is."  # preview text in inbox
sendDate: 2026-05-15
sentAt: null  # populated when broadcast fires
linkedBlogPost: "2026-rse-guidance-plain-english-summary"
ps: "PS: If you're updating policy, the consultation closes May 31."  # optional PS line
---

Short body in markdown. ~150–250 words. Opinionated take in Gareth's voice.

[Read the full piece →](/blog/2026-rse-guidance-plain-english-summary/)
```

### 4.3 Glossary term schema (post-migration)

`src/content/glossary/{slug}/index.json` (or `.md` with frontmatter only):

```yaml
---
term: "Consent"
slug: "consent"
shortDefinition: "..."
simpleDefinition: "..."  # plain-English version
topic: "healthy-relationships"  # primary topic landing-page slug
relatedTerms:
  - "coercion"
  - "boundaries"
referencedIn:
  - "is-16-the-right-age-of-consent"
  - "is-consent-always-necessary"
needsDiagram: false
metaTitle: null
metaDescription: null
---

(Optional longer explainer body in markdown)
```

### 4.4 Question schema (post-migration)

`src/content/questions/{slug}/index.md`:

```yaml
---
question: "Are you a slag if you get an STI?"
slug: "are-you-a-slag-if-you-get-an-std"
topic: "stis-and-sexual-health"
contentTags: ["stigma", "sti"]
ageTier: "secondary"
originalCategory: "Sexual Health"
glossaryTerms: ["sti", "stigma"]
relatedQuestions: ["how-do-you-get-an-std", "most-common-sti"]
okayToAskCategory: "Sexual Health"
metaTitle: null
metaDescription: null
signposting:
  - "Brook"
  - "NHS"
hasPostItScan: true
simpleAnswer: "No. STIs are infections, not moral judgements."
notes: null
---

(Long-form answer body in markdown)
```

### 4.5 Testimonial schema (post-migration)

`src/content/testimonials/{slug}.json`:

```json
{
  "name": "Sara Stafford",
  "role": "Head of PSHE",
  "school": "Example School",
  "quote": "...",
  "serviceTag": "RSE delivery",
  "approved": true,
  "dateGiven": "2026-03-15"
}
```

### 4.6 Curriculum statement schema (post-migration)

`src/content/curriculum/{keystage}/{slug}.json` — pure lookup data, no UI.

---

## 5. Editorial guidance — three docs, three scopes

The Tailor editorial system is now three companion documents working together. Content Studio prompts and the Red Team review load all three as context, weighting them per the content type being produced.

### 5.1 `docs/Tailor_Blog_Writing_Rules.md` — blog voice (first-person, Gareth)

**Scope**: every blog post drafted for the Tailor site.

**Authoritative for**: golden rule ("read like a conversation, not an essay"), voice characterisation (warm, direct, human — colleague at a conference), structure (600–900 words, personal opening, prose not bullet lists, natural CTA, "Trusted resources" section), tone rules, things to avoid (em-dash lists, "It's not X; it's Y," bold labels, throat-clearing, filler intensifiers, summary paragraphs, rhetorical-question transitions, balanced triplets), practical requirements (British spelling, hyperlink sources in text, every post links to at least one topic page), the 90% test and the read-aloud test.

**Benchmark post**: "Are We Leaving Boys Behind? Teaching Masculinity in Schools" (already in the existing 16).

### 5.2 `docs/Tailor_Site_Copy_Writing_Rules.md` — site copy voice (organisation "we")

**Scope**: service pages, homepage, about page, landing pages, navigation copy. Not blog posts (those use the blog rules); not Okay to Ask content (different voice again).

**Authoritative for**: golden rule ("describe the work, not the offering"), stance (no punchdowns, no imagined bad providers to define against, speak from conviction and memory, ground specifics in real failure modes, end on purpose rather than contrast), structural rules ("describe the work not the offering," "paragraph openers earn their first sentence," "sentences are not nodes on a flow diagram," "don't stack `We [verb] [object]` sentences," "section headings are not hierarchy statements"), things to avoid (extensive phrasing/rhetorical/structural/content tics list — every one is a pattern Gareth corrected in a real draft), the read-aloud test plus the "feature list in prose clothing" test.

This doc is at v1.2.2 (11 April 2026) and has been through multiple voice-feedback rounds. Treat it as load-bearing.

### 5.3 `docs/editorial-policy.md` — safety, safeguarding, legal risk

**Scope**: every piece of content Tailor publishes, regardless of channel or voice.

**Authoritative for**: hard rules on statutory and legal claims (citation required as hyperlink with document name + year), medical and clinical advice (don't give it; direct to NHS/Brook/GP), fabrication (no invented classroom scenarios, no fabricated quotes, no unsourced statistics), libel/defamation risk, age-of-consent statements (always include the necessary nuance). Plus the Red Team prompt specification (§2 of that doc).

**Enforcement**: violations are `block` severity in the Red Team review. Voice-rule violations from §5.1 and §5.2 are `concern` severity (advisory, never block publish).

### 5.4 How a Red Team review loads these

For a blog draft, the review prompt loads `Tailor_Blog_Writing_Rules.md` + `editorial-policy.md`.
For a site-copy/page draft, the review prompt loads `Tailor_Site_Copy_Writing_Rules.md` + `editorial-policy.md`.
For a newsletter, LinkedIn post, or carousel: §7 of this plan + `editorial-policy.md`. The voice docs apply by inheritance (newsletter and LinkedIn share blog voice DNA; carousels share site-copy DNA) but are not strict — the format docs in §5 below take precedence on shape.

---

## 6. GDH SEO integration contract

This section defines what Content Studio reads, writes, and produces. It exists so the GDH SEO session (Session B) can build against a clear spec without needing live Tailor-repo access.

### 6.1 Inputs Content Studio reads

From **GDH SEO's own per-client store** (already exists):
- Tailor's brand context: voice, audiences, growth areas, off-brand areas.
- Latest GSC + GA4 data: opportunity queries (page 1 but low CTR), top queries, daily sessions.
- Latest monthly SEO report: content ideas section, actions-to-take list, quick wins.

From **GDH SEO's new landscape module** (build in Phase 1):
- Weekly sector news digest (via Claude web search tool, sources include gov.uk, DfE, Ofsted, PSHE Association, Brook, Schools Week, Tes, Children's Commissioner).
- Monthly competitor scan (PSHE Association, Brook, Big Talk Education, Mentally Healthy Schools, Coram Life Education).
- Seasonal calendar for Tailor (LGBTQ+ History Month, Pride Month, Anti-Bullying Week, Mental Health Awareness Week, school terms, etc.).

From **the Tailor repo** (accessed via GitHub API read, or via snapshot if performance demands):
- List of existing blog post slugs + titles + primary topics (for internal-link suggestions and cluster awareness).
- List of glossary term slugs + short definitions (for internal-link suggestions).
- List of question slugs + question text (for internal-link suggestions).
- List of topic landing-page slugs.
- `docs/Tailor_Blog_Writing_Rules.md`, `docs/Tailor_Site_Copy_Writing_Rules.md`, and `docs/editorial-policy.md` (loaded per content type into prompt context and Red Team enforcement; see §5.4 above for which combination per content type).
- The 16 existing blog posts in markdown (for voice RAG corpus — initially all 16; over time, tag which ones go into the corpus). The benchmark for blog voice is "Are We Leaving Boys Behind? Teaching Masculinity in Schools."

### 6.2 Outputs Content Studio produces

For each weekly cycle:

1. **Brief list** (5–10 suggested briefs ranked by score):
   - Angle (one sentence)
   - Why now (links to sector news, seasonal context, SEO opportunity, competitor gap)
   - Target audience (which of Tailor's stored audiences)
   - Anticipated word count
   - Suggested CTA
   - Suggested primary topic + secondary topics + linked glossary terms + linked questions
   - **Score** against the rubric in §7.2
   - **Source brief ID** (used in blog frontmatter `sourceBriefId`)

2. **Full blog draft** (from a chosen brief):
   - Markdown body
   - Populated frontmatter (except `distribution.*` fields)
   - Inline internal-link suggestions: `[link text](/blog/slug)` and `[link text](/glossary/slug)` based on the existing content snapshot
   - List of claims to verify (with source URLs from web search where possible)

3. **Red Team review report** (after draft generation, before Gareth sees it):
   - List of flagged passages with line references
   - Severity per flag (info, concern, block)
   - Reason citing the editorial policy
   - Suggested rewrite (optional)

4. **Derivatives** (after Gareth has edited and approved the blog draft — NOT from the first AI draft):
   - LinkedIn announcement post (longer, professional framing)
   - LinkedIn follow-up post (quote, hot take, or angle, ready for Thursday)
   - Newsletter issue (subject + preheader + body + PS, in the schema from §4.2)
   - Instagram carousel content (slide-by-slide JSON, ready for the rendering pipeline)

5. **Post-edit diff analysis** (after Gareth publishes the final version):
   - Compares first AI draft to final published version
   - Output: "What you changed and why" — patterns to bake into future prompts
   - Fed back into the system prompt for the next week

### 6.3 Writes Content Studio performs

In **Phase 1**: nothing automatic. Operator copies markdown out of Content Studio and into the Tailor repo manually. Validation phase tests whether this is good enough.

In **Phase 2** (after validation passes): Octokit-based auto-commit to the Tailor repo on operator approval. Specifically:
- Creates branch `content/{slug}` from `main`.
- Writes `src/content/blog/{slug}/index.md` plus images.
- For newsletters, writes `src/content/newsletter/{slug}/index.md`.
- Creates a PR with diff summary in the PR description.
- Auto-merges if all CI checks pass and operator approval is recorded.
- Vercel deploys on merge.

### 6.4 Secrets Content Studio needs

- Anthropic API key (already in GDH SEO).
- GitHub PAT or App credentials scoped to write `tailoreducation/tailor-site` (Phase 2 onwards).
- Resend API key (for newsletter sends — but the Tailor site, not GDH SEO, makes these calls; GDH SEO only generates the issue content).
- Web search tool enabled on the Anthropic API key (Phase 1).

### 6.5 Where prompts live

In the GDH SEO repo at `prompts/`:
- `brief-generation.md`
- `brief-scoring.md`
- `blog-drafting.md`
- `safeguarding-review.md` (the Red Team prompt)
- `derivative-linkedin-announcement.md`
- `derivative-linkedin-follow-up.md`
- `derivative-newsletter.md`
- `derivative-carousel-content.md`
- `post-edit-diff-analysis.md`

Each is a plain markdown file with the system prompt and any inline templating variables documented at the top.

---

## 7. The Red Team / Safeguarding Officer prompt

The Red Team review is the editorial safety layer. After Phase 1 generates a draft and **before** the draft is surfaced to Gareth, a separate Claude call runs as the safeguarding reviewer.

The detailed spec — context load order, severity guidance, output schema, what happens to the output — lives in `docs/editorial-policy.md` §2. This section captures the integration shape only.

### 7.1 Why a separate call

- Different system prompt = different headspace. A model in "be helpful and write well" mode is bad at adversarial review of its own output.
- Pipeline order: `Draft → Safeguarding Review → Surface to operator (with flags) → Operator edits`. Easier to debug, easier to swap models per step.
- Cost negligible: drafting ≈ 8–15K tokens, review ≈ 3–5K tokens. Maybe 8¢ per post.

### 7.2 Context load order (summary; full version in `prompts/safeguarding-review.md` in GDH SEO repo)

1. The reviewer role: *"You are Tailor Education's safeguarding officer reviewing a draft before it reaches the editor."*
2. The safety rules: full contents of `docs/editorial-policy.md`.
3. The voice rules for the content type:
   - Blog draft → `docs/Tailor_Blog_Writing_Rules.md`
   - Site copy or page → `docs/Tailor_Site_Copy_Writing_Rules.md`
   - Newsletter / LinkedIn / carousel → the format requirements from §5 of this plan
4. The draft itself.

Severity (recapped from `docs/editorial-policy.md` §2.3):
- **`block`** = safety violation per `docs/editorial-policy.md` §1. Requires operator override + fix to publish.
- **`concern`** = voice-rule violation per the relevant `Tailor_*_Writing_Rules.md` doc. Advisory; never blocks publish.
- **`info`** = minor — phrasing, internal link suggestion, glossary linking opportunity.

---

## 8. Validation gates

Both ChatGPT and Gemini independently converged: the gate between Phase 1 and Phase 2 must be a real production sprint, not a one-off test.

### 8.1 The 4-week sprint

After Phase 1 ships, run for 4 weeks producing real content:

- Week 1–4: 1 blog + 2 LinkedIn + 1 newsletter + 1 carousel per week (carousel via manual design during validation; Phase 3 carousel pipeline not built yet).
- All content goes through Content Studio (brief → draft → Red Team → operator edit → publish).
- Operator times every blog edit, records it.

### 8.2 Pass criteria — all must hold

1. **4 blog posts published in 4 weeks.** Cadence is sustainable.
2. **Each final post is unmistakably Tailor in voice.** Operator judgement — would Gareth put his name on it without flinching?
3. **Average edit time under 90 minutes per blog.** Gemini's "90-Minute Edit" test. If editing takes longer than writing from scratch, the system is failing.
4. **Each post produces usable derivatives.** LinkedIn announcement, follow-up, and newsletter issue all required only minor edits to ship.
5. **Operator does not dread doing it by week 4.** ChatGPT's fatigue test. A pipeline that survives 4 weeks of real use survives indefinitely; one that hits week-3 grind is wrong.
6. **At least 2 of 4 posts produce a real signal**: a reply, an enquiry, a LinkedIn comment or save, a newsletter click-through, a GSC impressions/clicks uplift on the new URL, or a school directly mentioning the post.

### 8.3 What happens if the gate fails

- Pause Phase 2 and 3 build.
- Diagnose: is it the brief generation (wrong topics suggested)? The drafting prompt (drafts too generic)? The Red Team (catching too much / too little)? The editor (Gareth burning out)?
- Iterate on prompts. Re-run the sprint.
- Do not build downstream automation on a broken upstream.

### 8.4 Lower bar to start Phase 2 if Phase 1 partially passes

If 3/6 criteria pass and the failing ones are the "minor edits on derivatives" or "real signal" ones (not the edit-time or sustainability ones), Phase 2 can start while iterating on derivative quality. Edit-time and sustainability are non-negotiable; signal is desirable but slower-moving.

---

## 9. Phase plan

### Phase 0 — Content migration foundation (2.5–3 days)

**Goal**: Get all content out of Notion where Notion's pain is real (prose-heavy or cross-referenced). Put it in the repo with a strong content schema.

**Deliverables**:
- Astro Content Collections configured with Zod schemas matching §4.1–§4.6.
- Keystatic config covering blog + newsletter + glossary + questions + testimonials + curriculum.
- Migration script for the 16 blog posts (Notion blocks → markdown, body images downloaded into post folders, frontmatter populated).
- Migration scripts for glossary (145), questions (152), testimonials (8), curriculum statements (249).
- `docs/editorial-policy.md` written and committed.
- All 16 blog posts manually eyeballed post-migration (formatting fidelity, image references, frontmatter accuracy).
- Existing `blog-image-cache.ts` and Notion blog fetcher deleted (no longer needed).
- Existing `optimize-hero-images.mjs` simplified or deprecated for blog images (Astro's native image pipeline takes over).
- The hot-linked 403 image on `work-out-consent-masculinity-athletes` — source a replacement during migration or remove the featured image.

**Defer**: Topic landing pages migration (after validation sprint).

**Edits to existing files**:
- `src/content/config.ts` — Zod schemas.
- `src/lib/content.ts` — `getBlogPosts` etc. read from content collections, not Notion.
- `src/pages/blog/[...slug].astro` — use the collection API, `<Image>` from `astro:assets`.
- `src/pages/blog/index.astro` — same.
- `src/pages/anonymous_question/[...slug].astro` — use the collection API.
- `src/pages/glossary/[...slug].astro` — same.
- `src/pages/testimonials.astro` — same.

**Verification**:
- All 16 blog post URLs resolve and render correctly.
- Internal glossary tooltips still work.
- All featured images load (no Notion S3 URLs anywhere in the build output).
- `npm run dev` starts fast (no waiting for Notion content fetch on blog/glossary/questions/testimonials).
- Keystatic UI loads and lets you edit a blog post end-to-end.

### Phase 0.5 — Newsletter infrastructure (2.5 days)

**Goal**: A working newsletter subsystem on the Tailor site. Subscribers can join, issues can be sent, archive is public.

**Deliverables**:
- `src/pages/newsletter/index.astro` — subscribe form + archive list (most recent issues from `src/content/newsletter/`).
- `src/pages/newsletter/[slug].astro` — individual archive page per issue.
- Subscribe form embedded on blog post pages (footer of `src/pages/blog/[...slug].astro`).
- `src/pages/api/newsletter-subscribe.ts` — POST endpoint, validates email, double-opt-in flow via confirmation email, writes to Redis with consent timestamp + source.
- `src/pages/api/newsletter-confirm.ts` — GET endpoint, verifies confirmation token, moves subscriber to active list.
- `src/pages/api/newsletter-unsubscribe.ts` — GET + POST endpoints; the POST handles List-Unsubscribe one-click; both remove from Redis.
- Resend Broadcasts integration: a script (initially manual to trigger) that sends a markdown newsletter issue to all active subscribers, with proper List-Unsubscribe header pointing to `/api/newsletter-unsubscribe?email=...`.
- Sender domain isolation: configure Resend to send marketing broadcasts from a subdomain (e.g., `newsletter@mail.tailoreducation.org.uk`) separate from transactional (`noreply@mail.tailoreducation.org.uk`).
- Plain-text version of each issue generated automatically from markdown.
- Test-send mode: send to operator only before broadcasting.

**Compliance checklist** (UK GDPR + PECR + Resend Broadcast requirements):
- Double opt-in OR confirmed opt-in with consent timestamp logged in Redis.
- Unsubscribe link in every issue body.
- `List-Unsubscribe` header with `<https://...>` URL.
- `List-Unsubscribe-Post: List-Unsubscribe=One-Click` header.
- Suppression list on bounce / complaint (Resend Broadcasts handles this; verify config).
- Newsletter content does not go to transactional-only contacts (book purchasers who didn't subscribe to the newsletter).

**Verification**:
- Subscribe → receive confirmation email → click confirm → appear in Redis as active.
- Manually trigger a test broadcast → all active subscribers receive it.
- Click the one-click unsubscribe link → removed from Redis → next broadcast skips them.
- Hard-bounce email → automatically removed from active list.

### Phase 1 — Content Studio in GDH SEO (3.5 days)

**Goal**: A working brief-to-draft pipeline. Operator selects a brief, gets a full blog draft + Red Team review + suggested internal links. Manual export of markdown for now (no auto-commit yet).

**Deliverables**:
- New "Content Studio" module in GDH SEO (separate from "SEO Reports" module — see §3.4 architecture).
- Brief generator: combines GSC opportunity queries + sector landscape (web search) + competitor scan (web search) + seasonal calendar + Tailor brand context → produces ranked brief list.
- Brief scoring rubric: §7.2's questions ("would Gareth put his name on this?", "useful to a school decision-maker?", "strengthens an existing cluster?", "real opinion present?").
- Manual brief creation: operator can add a brief without the AI suggesting it.
- Blog draft generator: takes a brief + Tailor brand context + voice RAG corpus + existing content snapshot (blog slugs, glossary terms, questions, topic slugs from Tailor repo) + editorial policy → produces full markdown draft with frontmatter and inline internal links.
- Red Team safeguarding pass: separate Claude call as per §7.
- Source-tracking sidebar: every factual claim shows its source (from web search) or is flagged as "no source — verify before publishing".
- Editor UI: in-browser markdown editor with the Red Team flags as a sidebar.
- Manual export: download as `.md` file for now, copy into Tailor repo manually.
- Prompts in `prompts/` directory of GDH SEO repo, all named per §6.5.

**Web search tool usage**: roughly 5–10 Claude calls with web search per brief (for the landscape research). Cost roughly $1–2 per weekly cycle. Acceptable.

**Verification**:
- Open Content Studio for Tailor → see a brief list.
- Click a brief → see full draft + Red Team flags + sources.
- Edit in-browser → download markdown.
- Manually copy markdown + image into Tailor repo → push → Vercel deploys → post appears live.

### Phase 1 validation — 4-week real-production sprint

**Goal**: Prove the upstream system works before automating downstream.

See §8 for the gate criteria. This is calendar time (4 real weeks), not build time.

### Phase 2 — Derivative Studio + auto-commit + feedback loop (2 days)

**Only built if Phase 1 validation passes.**

**Goal**: After Gareth edits and approves the final blog markdown, generate derivatives from that final version. Auto-commit to the Tailor repo. Capture post-edit diffs for prompt tuning.

**Deliverables**:
- Derivative generators (each reads the **edited final markdown**, not the brief):
  - LinkedIn announcement post
  - LinkedIn follow-up post (Thursday)
  - Newsletter issue (subject, preheader, body, optional PS — all per §4.2 schema)
  - Carousel content (slide-by-slide JSON for the Phase 3 renderer)
- Octokit integration: "Approve and ship" button in Content Studio commits the post (blog markdown + images) to the Tailor repo via a branch + auto-merged PR.
- Newsletter issue commit happens at the same time, scheduled for send via Resend Broadcasts on the configured `sendDate`.
- Post-edit diff analysis: after publish, Content Studio fetches the final published markdown and diffs against the first AI draft. Outputs "what changed and why" patterns. Stores per-client; surfaces in the next brief-generation prompt's system context.

**Verification**:
- Brief → draft → edit → approve → Octokit commit appears on Tailor repo → Vercel deploys → post live.
- Same flow: newsletter issue committed → broadcast fires on sendDate → subscribers receive it.
- Post-edit diff is captured and visible in Content Studio's audit log.

### Phase 3 — Carousel rendering pipeline (4 days)

**Only built after Phase 2 ships and you've manually produced 6+ carousel scripts you actually like during validation.**

**Goal**: Take carousel JSON content from Content Studio, render to PNG sequence + PDF for IG upload.

**Deliverables**:
- 5 HTML template types per §3.5: numbered list, step-by-step, myth vs fact, quote card, stat punch.
- Templates use Tailor's design tokens (Lexend, brand green, OtA palette where appropriate).
- Puppeteer (or Playwright) rendering script: takes a JSON content payload + template ID + brand tokens → outputs `slide-01.png` … `slide-N.png` at 1080×1350.
- Same script also outputs `carousel.pdf` for IG document upload.
- Text overflow handling: if a slide's body exceeds template capacity, either auto-split into two slides or surface a "too long" warning back to Content Studio.
- Preview view in Content Studio: see the rendered carousel as a strip before approving.
- Download as a zip (PNGs + PDF) for upload to Publer.

**Verification**:
- Take 6 carousel JSON payloads (the ones produced during validation) → render each → eyeball every slide → upload one to IG via Publer → it posts correctly.

### Phase 4 — Direct social posting integration

**Deferred indefinitely.** See §3.6.

---

## 10. Risks and known unknowns

Catalogue of what could go wrong, with mitigation where known.

### Build-time risks

| Risk | Mitigation |
|---|---|
| Voice match takes more iteration than expected | First-week prompt tuning is explicit; post-edit diff feedback loop (§9 Phase 2) auto-tunes over time |
| Notion-to-markdown conversion has edge cases on body content (callouts, columns, synced blocks) | Manual eyeball pass on all 16 posts in Phase 0; budget extra half-day if needed |
| Keystatic schema doesn't quite match Notion's flexibility for some types | Test glossary + questions migration first (simpler schemas) before blog migration |
| Headless rendering of carousels has font issues on Vercel | Render locally during dev; if production rendering needed, use Vercel function with bundled fonts |
| GitHub Octokit needs personal access token management | Use a fine-scoped PAT or a GitHub App; document rotation |

### Operational risks

| Risk | Mitigation |
|---|---|
| Topical accuracy on DfE / KCSIE / Ofsted references degrades over time | `reviewBy` date in frontmatter; monthly report from GDH SEO surfaces stale posts |
| AI-detection scepticism in audience erodes brand trust | Hard rule: every post heavily edited before publish; voice training corpus only includes Gareth-rewritten posts |
| Voice drift in RAG corpus over time | Tag each post with `voiceTrainingMaterial: true/false` at publish; corpus only includes `true` |
| Editorial bottleneck on single author | Acknowledged. Acceptable for v1. If Tailor grows, add collaborator review path in Phase 5+ |
| Newsletter deliverability degraded by marketing broadcasts polluting transactional reputation | Sender domain isolation per §3.3 |
| Crisis-response content lag (DfE drops new guidance, news breaks) | Manual fast-lane: bypass the brief generator, write directly. Pipeline assumes evergreen cadence |

### Strategic risks

| Risk | Mitigation |
|---|---|
| Weekly cadence isn't the right rhythm — fortnight might be better | Validation sprint will tell. If 4-week sprint shows fatigue, fall back to fortnightly |
| The pipeline produces competent-but-forgettable content | Brief scoring rubric explicitly tests for "would Gareth put his name on this" and "real opinion present" |
| GDH SEO becomes a content operating system unintentionally | Module structure (§3.4) keeps things organised; if Content Studio grows beyond GDH SEO's scope, extract later — don't pre-build |

---

## 11. What we explicitly chose NOT to build

This list exists so future-you doesn't spend a Saturday building something we already considered and rejected.

| Thing | Why not |
|---|---|
| Direct LinkedIn / Instagram API posting | Gating, OAuth pain, app review friction, maintenance burden. Manual via Publer is acceptable. |
| Substack / Mailchimp / ConvertKit / Loops.so newsletter | Loses SEO archive value, splits content off the main domain. Custom Resend Broadcasts is better. |
| AI-generated photographic imagery | Children-in-photos + deepfake risk + brand-trust erosion in education niche. |
| AI as autonomous publisher | Voice integrity + safeguarding stakes. Gareth in the loop on every publish. |
| Generic multi-client Content Studio polish (UI niceties, etc.) | Premature. Build for Tailor first; generalise when a second client wants it. |
| Topic landing page migration in Phase 0 | Deferred. They're prose-heavy and don't block Phase 1. Migrate after validation passes. |
| Image generation in the pipeline | No AI photos by policy. Stock + Tailor branding only. |
| One-click "generate all channel variants at once from the brief" | Wrong architecture. Derivatives must come from the edited final, not the first draft (ChatGPT critique). |
| Per-issue newsletter analytics dashboard | Resend's own dashboard is sufficient v1. Add aggregate analytics to GDH SEO monthly report later if needed. |
| Comment system on blog posts | Adds moderation burden; LinkedIn replies and newsletter replies cover engagement. |

---

## 12. Execution guide for the future Claude Code session

If you're reading this as a fresh Claude Code session and have been asked to execute a phase: here's how to proceed.

### General principles

- **Trust this doc as the spec.** Where it's specific, follow it. Where it's ambiguous, ask before guessing.
- **Update this doc when reality diverges.** A decision you make mid-build that contradicts the plan should be reflected here in the same commit.
- **Validation before progression.** Phase N's deliverables must verify before Phase N+1 starts. The validation sprint between Phase 1 and Phase 2 is non-negotiable.

### Per-phase startup

1. Read this entire doc.
2. Read `docs/editorial-policy.md`.
3. Identify which phase you're starting (operator will say).
4. Pull the phase's deliverables checklist from §9.
5. List the files you expect to create or modify.
6. Confirm the list with the operator before starting.
7. Build phase deliverables iteratively, verifying each as you go.
8. End with the verification steps in §9 for that phase.
9. Update this doc if anything changed during execution.

### Session contracts

- **Session A** (Tailor repo, this repo): owns Phase 0 + 0.5.
- **Session B** (GDH SEO repo): owns Phase 1, 2, 3.
- The 4-week validation sprint happens between Session A finishing Phase 0.5 and Session B starting Phase 1's downstream work (Phases 2+).

### Things to keep open when working

- This file.
- `docs/Tailor_Blog_Writing_Rules.md`.
- `docs/Tailor_Site_Copy_Writing_Rules.md`.
- `docs/editorial-policy.md`.
- For Phase 1+: GDH SEO repo open as primary workspace, Tailor repo as read reference (for schemas, paths, design tokens, and the three editorial docs above).

---

## 13. Open questions to resolve before Phase 1

These don't block Phase 0 but should be answered before Session B starts.

1. **Voice RAG corpus**: which of the 16 existing posts go in? All for v1; tag `voiceTrainingMaterial` per post and let the corpus shrink to only well-edited posts over time?
2. **Editorial policy enforcement scope**: does the Red Team prompt run on derivatives too (LinkedIn, newsletter, carousel content), or only on the blog draft? My instinct: yes on all, with a lighter touch on derivatives.
3. **Newsletter cadence on weeks when no blog ships**: if a blog skips a week, does the newsletter skip too? Default yes. But: a "sector commentary" newsletter without a blog might still be valuable for staying-in-touch. TBD.
4. **The `work-out-consent-masculinity-athletes` post**: that's the one whose featured image returned 403 from the WP site. Find replacement image during Phase 0 migration, or remove featured image and proceed.
5. **GitHub credentials**: PAT or GitHub App for the Octokit integration in Phase 2? App is cleaner long-term but PAT is faster for v1.
6. **Sender domain for newsletter**: `newsletter@mail.tailoreducation.org.uk` or a different subdomain? Resend DNS setup needed either way.

---

## 14. Changelog

- **2026-05-12 v0.2**: Rewrote §3.7 and §5 after Gareth flagged that `docs/Tailor_Blog_Writing_Rules.md` and `docs/Tailor_Site_Copy_Writing_Rules.md` already exist and are authoritative for voice. The editorial system is now three companion docs: blog voice, site-copy voice, and a safety-focused `docs/editorial-policy.md`. Updated §6.1 (Content Studio inputs), §7 (Red Team prompt context load order), and §12 (files to keep open during execution) to reference all three.
- **2026-05-12 v0.1**: Initial plan committed. Authored by Gareth Esson + Claude (planning conversation including two-LLM critique from ChatGPT and Gemini).
