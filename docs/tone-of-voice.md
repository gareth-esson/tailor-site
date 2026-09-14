# Tone of voice — Tailor copy rules

This doc codifies the writing rule that governs all Tailor copy on
this site, in marketing collateral (flyers, decks, social), and in
email. It applies to every prose surface where Tailor speaks to a
reader who is choosing whether to engage with the service.

It does **not** apply to:

- Blog posts. First-person reflection ("we ran a workshop", "we
  worked in small groups") is the right register for editorial
  long-form and should be left alone.
- Trust-strip / legal / operational copy. ("We are a community-
  interest company"; "We do not require user accounts.")
- Error and form messages. ("We couldn't send your enquiry.")

The rule is specifically about *marketing / service-page* prose —
the surfaces where Tailor is positioning what it offers.

## The rule, in one sentence

The customer (the school, the teacher, the PSHE lead) is the
protagonist of the sentence. Tailor is the support that makes
their action possible. Sentences that lead with **"We [action
verb] [customer outcome]"** make Tailor the protagonist and the
customer the object — that's the pattern this doc kills.

## What the anti-pattern looks like

These are the sentences that need rewriting. Examples drawn from
the current codebase, not invented:

- `src/pages/services/rse-training.astro:42` — "We offer half-day,
  full-day, and multi-session programmes…"
- `src/pages/services/rse-training.astro:41` — "We don't run a
  catalogue of separate sessions…"
- `src/pages/about.astro:161` — "We build the resources, the
  training, and the planning support…"
- (Flyer, now fixed) — "We come into your school and teach the
  lessons / We train your team / We build the year of RSE your
  school actually needs."

The diagnostic is structural, not lexical. It's not the pronoun
"we" — it's the pattern where **Tailor is the grammatical
subject of a verb whose result is something the customer wants**.
That inversion (vendor acting on customer) reads as performative-
confident rather than actually-confident. Top-tier B2B service
writing puts the customer in the subject position and lets
Tailor recede into the means.

## The pattern we use instead

Recast the sentence so the customer, the service, or the
outcome is the grammatical subject. Tailor becomes the means,
not the headline. Examples from the flyer rewrite:

| Anti-pattern | Service-voice rewrite |
| --- | --- |
| "We come into your school and teach the lessons." | "RSE lessons taught in your classrooms." |
| "We train your team to teach them with confidence." | "CPD that helps your team teach RSE with confidence." |
| "We build the year of RSE your school actually needs." | "RSE curricula and policy designed around your school." |
| "We deliver expert support to schools across the UK." | "Expert support for UK schools." |
| "We offer half-day, full-day, and multi-session programmes…" | "Half-day, full-day, and multi-session programmes…" or "Programmes ranging from a single twilight to a multi-session engagement." |
| "We help schools meet the statutory guidance." | "Support to help your school meet the statutory guidance." |
| "Tell us where you're starting from. We'll work out what Tailor can do." | "Start with a conversation about your school's RSE." |

Notice that several rewrites just **drop the "We [verb]"
opener** and let the noun phrase stand alone. That's often the
cleanest move — the sentence was carrying redundant Tailor-as-
actor framing the reader didn't need.

## Self-congratulatory words to strip (or rate-limit)

Alongside the structural fix, watch for individual words that
boast on Tailor's behalf. The current site has a clear **"actually"
tic** — the word appears 11+ times across service pages and is
almost always doing self-congratulatory work ("the questions
students *actually* ask" = "we know the real version; others
don't"). One or two uses across the whole site is fine; eleven
is a tell.

Words to audit for and usually cut:

- **"actually" / "really" / "truly"** — when implying *we* know
  what others don't ("the year of RSE your school actually
  needs", "topics students are actually thinking about")
- **"leading" / "best-in-class" / "world-class" / "trusted"** —
  unsupported quality claims
- **"passionate about" / "committed to"** — empty intensifiers
  (e.g. `accessibility.astro:45` "We're committed to:")
- **"uniquely positioned" / "uniquely placed"**
- **Exclamation marks in pull-quotes** — a real teacher rarely
  punctuates this way; remove or replace with full stop

These almost always read as the brand insisting on its own
quality. The work itself becomes the proof when these words
aren't doing it for us.

## When "we" and quality descriptors are fine

The rule is about a specific sentence pattern, not about the
pronoun "we" or all positioning language. These are all fine
and should **not** be changed:

- **Trust / credentials / legal disclosure** — "Tailor Learning
  CIC is a community-interest company registered in England &
  Wales." "Delivered by QTS-qualified RSE specialists."
- **Collaborative continuation** after a customer-first opener —
  "Tell us where you're starting from — we'll shape the right
  support around it." The customer goes first; "we'll" rides on
  the back of an imperative addressed to them.
- **First-person voice in blog posts** — "We ran the workshop
  twice, once with young people and once with adults." This is
  reflective narrative, not vendor pitch.
- **Imperatives addressed to the reader** — "Talk to us about
  your RSE programme." "Get in touch."
- **Inclusive 'we' meaning Tailor + the school together** —
  "What we found, working with the team at…"
- **Sparing use of "specialist" / "expert" as positioning** —
  one or two mentions across a page that name what's on offer
  (e.g. "Specialist RSE for UK schools") is positioning, not
  bragging. The threshold is repetition: when the same quality
  claim appears three or four times on one surface, cut down to
  the one or two that do the most work.

## The litmus test

When auditing a sentence, ask: **would a top-tier consultancy
or a sector-leading charity (Brook, MBB, the better RSE
practices) write the sentence this way?** If yes, leave it. If
it sounds like a startup overstating itself, rewrite using the
patterns above.

A second test: **does the customer appear anywhere in this
sentence?** If Tailor is the subject and there's no school,
teacher, or pupil in view, the sentence is probably ego-talking
to itself.

## How to apply this across the repo

A grep-based pass through `src/pages/**/*.astro` (service pages
especially) and `src/components/Cta*.astro` will find most of
the marketing-prose offenders. The scope is intentionally
narrow — blog posts and about/founder copy should be left to
their first-person voice.

### Grep patterns to start from

```
# Sentence openers (most likely offenders):
\b(We|We'll|Our)\s+(deliver|provide|offer|bring|help|train|teach|build|create|design|develop|support|enable|empower|equip|ensure)\b

# Self-congratulatory modifiers:
\b(actually|truly|really|leading|trusted|passionate|committed to|uniquely|world-class|best-in-class)\b

# Sentence-start "We" in any astro prose:
^\s*(<p[^>]*>|>)?\s*We\s+[a-z]+
```

### Priority order

1. **Homepage** (`src/pages/index.astro`) — already partly
   rewritten in the flyer pass; quick audit to confirm the
   service-section text matches.
2. **Service pages** (`src/pages/services/*.astro`) — highest
   concentration of marketing prose and the anti-pattern. The
   `descriptors`, `whats-included` arrays, and FAQ answers are
   the hot spots.
3. **CTA components** (`src/components/Cta*.astro`) — appear on
   many pages, so one fix cascades.
4. **About / Our Approach** (`src/pages/about.astro`,
   `src/pages/our-approach.astro`) — review carefully; some
   first-person voice here is intentional and right.
5. **Topic and questions index pages** — light pass to remove
   "actually" tics where they're not earning their keep.

### What changes after this rule lands

The site will read more like a confident specialist service
practice and less like a SaaS landing page. Tailor's expertise
will land harder *because* it's not being asserted as often —
the work itself becomes the proof, and the customer always has
the spotlight.

### What this rule explicitly does not require

- Stripping every "we" from the site.
- Removing all uses of "specialist" or "expert" — these are
  legitimate positioning words used sparingly.
- Rewriting blog posts to remove first-person voice.
- Removing values statements ("We believe young people deserve
  honest, inclusive, age-appropriate RSE") — these are stance,
  not pitch.

Restraint and judgement on each rewrite; not a mechanical
search-and-replace.
