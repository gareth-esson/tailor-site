# Component inventory

**Read this before designing any page.** The design docs describe the
system in the abstract; this describes what is actually built. A brief
will happily talk you into inventing something that already exists here.

Regenerate the usage column with:

```bash
for f in src/components/*.astro; do
  n=$(basename "$f" .astro)
  users=$(grep -rlE "<${n}\b" src/pages src/components src/layouts --include='*.astro' \
          | grep -v "/${n}.astro" | sed 's|src/pages/||;s|src/components/||;s|src/layouts/||;s|\.astro||' | sort | tr '\n' ' ')
  printf '%-22s %s\n' "$n" "${users:-UNUSED}"
done
```

Two traps in that command, both of which produced a wrong inventory the
first time: `grep` is line-based, so a multi-line `<Component` invocation
is missed unless you match `<Name\b` rather than `<Name[ />]`; and
`src/layouts` must be in the search path or the shell components look
unused.

---

## The rule that matters

**Every card on this site has exactly one action.** It is a `<span>` cue
inside a card-wide `<a>`: `card__link`, `topic-hub-card__link`,
`service-card__link`, `glossary-term-card__link`. If a design calls for
two actions on a card, that is a new pattern — raise it rather than
inventing it. A tinted `btn--sm` paired with a plain text link is the
sanctioned shape when two are genuinely needed.

`.card` is the system primitive (`card__img`, `card__body`,
`card__eyebrow`, `card__title`, `card__text`, `card__link`, plus
`--lift`, `--horizontal`). Bespoke cards compose with it:
`class="card card--lift service-blog-card"`. Build that way rather than
copying a bespoke card wholesale.

---

## Components

| Component | What it is for | Used by |
|---|---|---|
| **QuestionCard** | A handed-in pupil question. Resolves its own post-it scan from the slug, renders the OtA category eyebrow, the question, content tags and "Read the answer". Built on `.card .card--lift`. **Use this for any question anywhere** — do not build a post-it treatment. | RelatedQuestions, book, for-schools/[...slug], glossary/[...slug], questions/index, questions/tag/[...slug], topics/[...slug] |
| **ServiceTopicsStrip** | Grid of topic cards (illustration + category + title) from curated `featuredSlugs`. Card treatment matches the homepage carousel so topics read as one component sitewide. Optional `heading` and `intro`. **Use this for any "related topics" section.** | for-schools/[...slug] + all 7 service pages |
| **ServiceMetaStrip** | Horizontal band of label/value pairs for operational facts (format, length, group size, pricing anchor). Built for scanning buyers. Deliberately understated: no chrome, no icons. | for-schools/[...slug], services/rse-training |
| **CtaServiceEnquiry** | `[A13]` Enquiry CTA deep-linking to `/contact/?service=…`. `variant="tinted"` for mid-page, `"alt"` for bottom. Takes `serviceParam` (analytics label) and optional `enquiryValue` (the form value) — keep them separate. | for-schools/[...slug], topics/[...slug], all 7 service pages |
| **CtaBringToSchool** | `[A12]` "Bring {topic} into your school" — routes to a *service page*, not the form. | topics/[...slug], topics/index |
| **CtaBlogBottom** | `[A13]` Blog-post foot CTA. Keys a `SERVICE_CTA` map by `serviceLink`; falls back to the topic page when `none`. | blog/[...slug] |
| **HeroImage** | Wraps a hero/LCP photograph in a responsive `<picture>`. Used by every page with a hero photo. | about, blog/[...slug], book, index, all 7 service pages, services/index |
| **Breadcrumb** | `[A18]` Takes `trail={[{name, path}]}`. | blog, explained, for-schools, topics templates |
| **EnquiryForm** | `[E1]` The enquiry form. GIAS school combobox, Turnstile, `?service=` pre-select. Its options come from `ENQUIRY_SERVICES`. **Any minimal capture form should cut this down, not start fresh.** | contact |
| **ServiceFaq** | Accordion FAQ for service pages, feeds FAQPage JSON-LD. | services/rse-training |
| **TestimonialCard** | Quote + attribution. `variant="card"` (grid) or `"band"` (service proof band). Pair with `getTestimonialsByService(tag)`. | testimonials |
| **GlossaryTermCard** | Term + definition card. | glossary/[...slug] |
| **GlossaryTooltips** | `[A7]` Tooltip runtime for glossary terms in body copy. | anonymous_question, glossary, questions/index |
| **RelatedQuestions** | `[A15]` Question grid for C1 — wraps QuestionCard. | anonymous_question/[...slug] |
| **SignpostingBlock** | `[A8]` Safeguarding signposting. **Never add a dismiss button.** | anonymous_question, glossary, questions/search |
| **CrisisSupport** | `[A9]` Crisis support. **Never add a dismiss button.** | anonymous_question/[...slug] |
| **AgeFlag** | `[D1]` Age-tier interstitial. | anonymous_question/[...slug] |
| **EndOfAnswerPanel** | `[A17]` End-of-answer panel on question pages. | anonymous_question/[...slug] |
| **SimpleModeToggle** | `[A6]` Standard/Simple reading toggle. | anonymous_question, explained, glossary |
| **SearchBar** | `[A4/A5]` Header search with instant results. | SiteHeader |
| **SiteHeader / SiteFooter / Analytics / CookieBanner / OtaSearchPill** | Shell. Mounted once in BaseLayout; never import directly. | BaseLayout |
| **RelatedTerms** | `[A15]` Glossary variant of related items. **Currently unused.** | — |
| **TopicTags** | `[A16]` Topic tag row for C1. **Currently unused.** | — |
| **TopicsOverviewGrid** | All 23 topics grouped by the 7 app categories. **Currently unused** — `ServiceTopicsStrip` superseded it for curated subsets. | — |

---

## Shared data helpers

| Helper | Purpose |
|---|---|
| `src/lib/enquiry-services.js` | `ENQUIRY_SERVICES` (the form's five values), `isValidEnquiryService()`, `SERVICE_CTA` (serviceCtaTarget → `{label, param}`), `serviceCta()` with fallback. Guarded by `tests/enquiry-links.test.mjs`. |
| `src/lib/post-it-images.ts` | `getPostItImagePath(slug)` and `getPostItImage(slug)`. QuestionCard already calls this — you rarely need it directly. |
| `src/lib/topic-illustrations.ts` | `getTopicIllustrationPath(slug)`. ServiceTopicsStrip already calls it. |
| `src/lib/content.ts` | `getQuestions`, `getGlossaryTerms`, `getLandingPages`, `getBlogPosts`, `getTestimonialsByService`, `getCurriculumStatements`. |
| `src/lib/site.ts` | `breadcrumbJsonLd`, `serviceJsonLd` (takes `enquiryValue`), founder/organisation nodes. |

---

## Six things that were rebuilt from scratch when they already existed

Recorded because the failure was systematic, not incidental: the brief was
treated as the spec and the codebase as somewhere to put the output. The
site already encodes decisions about what a card is, what an action looks
like and how a question is displayed.

1. The post-it scatter — `/explained/` already had the mechanism
2. `QuestionCard` — rebuilt as bespoke typographic questions
3. `.card` — a bespoke topic card built instead
4. Blog cards — a bespoke list built instead of the `.card`-based pattern
5. `ServiceTopicsStrip` — a whole "related topics" section rebuilt, and it
   collided on the class name `.topic-card`
6. `ServiceMetaStrip` — a hand-rolled `Year 9 · 6 lessons · 55 minutes`
   kicker instead

The check that would have caught all six takes about a minute: list the
components, read the two or three whose names touch the thing you are about
to build, and only then design.
