# Stage 6 — Search, SEO, analytics, and redirects

*Briefing document for Claude Code. Read this first, then read the referenced files.*

---

## What you're building

The finishing layer: Pagefind search, GA4 analytics event map, per-page SEO metadata, JSON-LD structured data, sitemap, robots.txt, and 301 redirects from the old WordPress site. Everything that makes the site findable, measurable, and migration-safe.

## What already exists

Stages 1–5: The complete site is built. All pages render. All content types work. All CTAs are wired. The design system is integrated. Navigation works. The form works.

Read the existing codebase before making changes.

## Files to read for this stage

```
docs/Tailor_Content_Site_Build_Spec_v1.md    — sections 7, 8, and 9
search-console-data/                          — current site performance reports (for redirect map)
```

## Site search [A4, A5, B10]

### Technology: Pagefind

Pagefind is Astro-native. It generates a static search index at build time and runs entirely client-side. No server, no API, no external service.

### Search bar [A4]

Replace the placeholder search bar in the header with a functional one:

- Desktop: visible in header, text input with placeholder
- Mobile: collapses to search icon, expands on tap
- Same visual element on every page (doesn't change between Tailor and OtA sections)

### Instant results dropdown [A5]

- Triggers after 2+ characters typed
- Top 5–8 results grouped by content type (Questions, Glossary, Topics, Blog, Services)
- Each result shows: title, content type label, and a preview snippet or definition
- "See all results →" link at bottom → `/search?q={query}`

### Full results page [B10] (`/search?q={query}`)

- Results grouped by content type
- Up to 5 per group with "Show all" toggle
- No results state: "No results for '[query]'. Try a different search, or browse by topic →"

### Topic aliases in search

Each topic has 20–30 search aliases (slang, informal terms, alternative phrasing). These must be included in the Pagefind index as metadata on topic hub pages:

```html
<div data-pagefind-meta="aliases" style="display:none">
  porn, explicit content, pornography, adult content, xxx, ...
</div>
```

Gareth will provide the alias lists. Build the mechanism — add a placeholder that's easy to populate.

### Searchable content

| Content type | Indexed fields | Display in results |
|-------------|---------------|-------------------|
| Questions | Question title, answer body, content tags | Question title, topic tag, "Okay to Ask" label |
| Glossary | Term name, short definition | Term, short definition |
| Topics | Topic name, category, aliases | Topic name, category |
| Blog posts | Title, body text, content tags | Title, target audience label |
| Services/training | Page title, description | Page title, "Services" label |

## Analytics (GA4 event map)

### Setup

GA4 property must be configured before launch. Add the GA4 snippet to the base layout. Use the measurement ID from an environment variable (`GA4_MEASUREMENT_ID`).

### Events

Implement all events from the build spec section 8. Each event fires via `gtag('event', ...)`. Key events:

| Event | Properties | Trigger |
|-------|-----------|---------|
| `question_page_view` | slug, topic, age_tier, source | Question page load |
| `question_to_topic_click` | question_slug, topic_slug | Topic tag click on question page |
| `topic_to_app_click` | topic_slug | "Explore lessons" CTA click on landing page |
| `topic_to_service_click` | topic_slug, service_type | "Bring to school" CTA click on landing page |
| `glossary_tooltip_click` | term_slug, source_page_slug | Tooltip "Read more" click |
| `blog_to_service_click` | blog_slug, service_type | Blog CTA click |
| `service_enquiry_started` | service_type, source_page | Form opened/focused |
| `service_enquiry_submitted` | service_type, source_page | Form submitted |
| `signposting_click` | service_name, question_slug | Support service link click |
| `crisis_support_click` | service_name, question_slug | Crisis component link click |
| `age_flag_continue` | question_slug | "Continue to answer" click |
| `age_flag_redirect` | question_slug, redirect_slug | Foundational content link click |
| `related_question_click` | source_slug, target_slug | Related question card click |
| `site_search_query` | query, result_count, source_page | Search executed |
| `site_search_result_click` | query, result_slug, result_type, position | Search result click |
| `cta_click` | cta_type, source_page_slug, target | Any CTA click |

`cta_type` values: `explore_lessons`, `bring_to_school`, `get_the_book`, `teach_this_topic`, `enquire_service`, `blog_to_service`, `blog_to_app`, `glossary_to_topic`

## SEO infrastructure

### Per-page metadata

Every page must have:

- Unique `<title>` from Meta Title field (or generated from content)
- Unique `<meta name="description">` from Meta Description field (or auto-generated)
- `<link rel="canonical">` (self-referencing)
- Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- Twitter Card tags: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

### Meta title convention

- Question pages: "[question] | Okay to Ask"
- Glossary pages: "What is [term]? | Tailor Education"
- Landing pages: "[Topic] | Tailor Education"
- Blog posts: "[Title] | Tailor Education"
- Showcase pages: "[Page title] | Tailor Education"
- Service pages: "[Service] — RSE for Schools | Tailor Education"

### JSON-LD structured data

| Page type | Schema type | Key properties |
|-----------|------------|----------------|
| Question pages | `FAQPage` or `Article` | question text, answer text, datePublished |
| Glossary pages | `DefinedTerm` | name, description |
| Landing pages | `WebPage` with `about` | name, description, educationalLevel |
| Blog posts | `Article` | headline, author, datePublished, articleSection |
| Service pages | `Service` | name, description, provider |

### Sitemap

Auto-generated at build time. All published pages. Submit to Google Search Console.

### robots.txt

```
User-agent: *
Allow: /
Sitemap: https://tailoreducation.org.uk/sitemap.xml
```

## 301 redirects

### WordPress migration

Question page URLs are preserved (`/anonymous_question/{slug}`) — no redirect needed. Other WordPress URLs must redirect:

| Old pattern | New pattern |
|-------------|-------------|
| `/topic/{slug}` | `/topics/{slug}` |
| `/category/{cat}` | `/topics/` or nearest equivalent |
| Other indexed pages | Nearest equivalent or `/` |

Use the search console data in `search-console-data/` to identify all indexed WordPress URLs that need redirects. Build a complete redirect map.

### Domain redirects (Vercel config)

| Source | Target | Type |
|--------|--------|------|
| oktoask.co.uk | tailoreducation.org.uk/questions/ | 301 |
| oktoask.org.uk | tailoreducation.org.uk/questions/ | 301 |
| okaytoask.co.uk | tailoreducation.org.uk/questions/ | 301 |
| okaytoask.org.uk | tailoreducation.org.uk/questions/ | 301 |
| nosillyquestions.co.uk | tailoreducation.org.uk/questions/ | 301 |
| nosillyquestions.org.uk | tailoreducation.org.uk/questions/ | 301 |
| tailor-rse.co.uk | tailoreducation.org.uk | 301 |

### Critical preservation

These URLs currently rank position 1–2 and must resolve correctly after deployment:

- `/anonymous_question/if-i-played-with-myself-am-i-a-virgin/` (25,556 impressions, position 1.92)
- `/anonymous_question/are-you-a-slag-if-you-get-an-std/` (774 impressions, position 1.82)

Verify with `curl -I` after deployment.

## What "done" looks like

1. Search works: type in the header search bar, see instant results, click through to full results page
2. All GA4 events fire correctly (test with GA4 debug mode)
3. Every page has correct `<title>`, meta description, canonical, OG tags, and JSON-LD
4. Sitemap generates at `/sitemap.xml` with all published pages
5. robots.txt serves correctly
6. WordPress redirects work (test old URLs → new URLs)
7. Domain redirects configured in Vercel
8. Top-ranking question pages resolve at their exact existing URLs

## Post-launch checklist

- [ ] GA4 property verified and receiving events
- [ ] Google Search Console verified for tailoreducation.org.uk
- [ ] Sitemap submitted to Search Console
- [ ] Top 5 question page URLs verified with `curl -I`
- [ ] Domain redirects verified (oktoask.co.uk, etc.)
- [ ] WordPress redirect map verified (all indexed old URLs)

---

*Stage 6 of 6. Previous: Remaining Pages. The site is complete.*
