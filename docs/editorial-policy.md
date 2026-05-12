# Tailor Education editorial policy

**Status:** active rules.
**Last updated:** 2026-05-12.
**Owner:** Gareth Esson.

This document is the rulebook for what Tailor publishes. It applies to:

- Blog posts on tailoreducation.org.uk.
- Newsletter issues.
- LinkedIn posts published from Tailor's company page.
- Instagram carousels.
- Any other content published under the Tailor name.

It is referenced by:

- Every Claude prompt used in Content Studio (`prompts/*.md` in the GDH SEO repo).
- The Red Team safeguarding review pass (see `docs/content-pipeline-plan.md` §7).
- Gareth's own editorial review before publishing.

When updating a rule, update this file, commit it to the repo, and note the change in §6. Live updates without commit history make it impossible to reconstruct why a piece of content was approved or rejected.

---

## 1. The five governing principles

These come first. Every specific rule downstream is an application of one of these.

1. **Accuracy is non-negotiable.** RSE sits inside safeguarding, statutory guidance, child protection law, mental health, and political controversy. Wrong statements cause real harm — to children, to schools, to Tailor's reputation. Every factual claim must be defensible with a current source.

2. **Lived authority comes from Gareth's actual experience, not invented examples.** Tailor's edge is that Gareth has taught RSE in hundreds of UK schools. Posts can draw on that. They cannot invent classroom scenarios, fabricate teacher quotes, or attribute pseudo-experiences to "schools we've worked with" unless the experience is real.

3. **Opinion is welcome. Generic content isn't.** A post that takes a position — even one some readers disagree with — is more valuable than a hedged "on the one hand / on the other" piece. Tailor's brand is forthright expertise. The policy isn't "avoid opinions" — it's "have a real one, state it clearly, support it."

4. **Plain English over PSHE jargon.** Tailor's audience includes harried headteachers, anxious parents, and overworked PSHE leads. Sentences should land in one pass. If a paragraph needs explaining, rewrite the paragraph.

5. **UK context only.** Tailor serves UK schools. References to legislation, guidance, age of consent, statutory frameworks, education-system shape, and cultural references are UK-specific. American examples, OECD comparisons, and other-jurisdiction case studies are out of scope unless explicitly framed as comparative.

---

## 2. Hard rules — never publish content that violates these

The Red Team prompt severity for these is `block`. If a draft contains one of these patterns, it does not ship without explicit operator override and a corresponding edit.

### 2.1 Statutory and legal claims

- ❌ Never state a legal certainty about UK education law without citing the current source (link + access date).
- ❌ Never cite the DfE, Ofsted, KCSIE, RSHE guidance, or any statutory framework without a URL to the specific document being referenced.
- ❌ Never make claims about what schools are "required to" do without quoting the source language.
- ❌ Never simplify statutory guidance to the point of inaccuracy. If a rule has exceptions, name them.

**Example violation**: "All schools must teach about pornography in Year 8." This isn't what the guidance says, and stating it as fact would mislead headteachers.

### 2.2 Medical and clinical advice

- ❌ Never give medical advice, even hedged. Direct readers to NHS, Brook, or their GP for anything clinical.
- ❌ Never recommend specific contraceptive methods, drugs, or treatments as "the right choice."
- ❌ Never make claims about mental-health intervention efficacy.

**Example violation**: "If a student tells you they're feeling depressed, recommend they try [intervention]." Tailor is not a mental health service.

### 2.3 Fabrication

- ❌ Never invent a classroom scenario and present it as real.
- ❌ Never put words in the mouth of a teacher, headteacher, parent, or student that they didn't say.
- ❌ Never attribute experiences to "schools we work with" or "one teacher told us" without a real source. If the example is composite or anonymised, say so explicitly: "I've seen variations of this in several schools" is acceptable; "A teacher in Manchester told us last term…" with no actual teacher is not.
- ❌ Never cite a statistic without its source URL.

### 2.4 Political third rails

UK RSE is politically charged in 2026. Several topics attract pile-ons from both directions. Avoid taking positions that frame Tailor as a culture-war combatant:

- ❌ Never frame trans-inclusive RSE as either "obviously correct" or "obviously harmful." If the topic is addressed, follow statutory guidance, cite KCSIE, and stay focused on what schools must legally do.
- ❌ Never frame single-sex spaces in schools as a settled policy question.
- ❌ Never imply state schools are failing without specific evidence (Ofsted report, named research).
- ❌ Never engage with culture-war framing from either direction. If a media event puts these topics in the news, respond by linking to statutory guidance, not by taking a side.

**Why this isn't cowardice**: Tailor's job is to support schools to meet their statutory obligations. Taking sides in the culture war damages that role. Plenty of opinionated content exists in other domains (pedagogy, sector criticism, practical advice, parent communication) — opinions live there.

### 2.5 Libel and defamation risk

- ❌ Never name a specific school, MAT, headteacher, or individual in a negative light without certainty about the facts and willingness to defend the statement legally.
- ❌ Never imply specific organisations are doing something wrong without naming the evidence.
- ❌ Never quote a source out of context to make them appear to support a position they don't.

### 2.6 Age-of-consent statements

- ❌ Never state age of consent as a simple number without addressing the complications: close-in-age exceptions, abuse-of-position-of-trust rules, the difference between age of consent and legal age for buying contraception, the difference between criminality and safeguarding response.

**Example violation**: "The age of consent in England is 16." Technically true but misleading without context.

---

## 3. Soft rules — require careful handling

The Red Team prompt severity for these is `concern`. They don't block publish, but the editor must consciously decide they're OK.

### 3.1 Unsupported opinions presented as consensus

- ⚠ "Most teachers think X" without citation. State as opinion: "I think most teachers find X useful" or cite a survey.

### 3.2 Statistics without sources

- ⚠ Any percentage, fraction, or numerical claim needs a source.

### 3.3 Unhedged generalisations about schools

- ⚠ "Primary schools are uncomfortable with…" needs evidence or a clear "in my experience" framing.

### 3.4 Jargon without explanation

- ⚠ KCSIE, RSHE, KS3, PSHE, RSE, MAT, AP — all fine to use, but on first appearance in a post, gloss them ("Keeping Children Safe in Education", etc.).

### 3.5 Bullet-point soup

- ⚠ Long bullet lists with one-line entries feel like a slide deck. If a section is mostly bullets, consider whether prose would land better.

### 3.6 "Safe space" and other content fillers

- ⚠ Stock phrases that signal "I am writing about RSE" without saying anything: "creating a safe space", "open and honest conversations", "young people deserve". Use sparingly. Each instance should earn its place.

### 3.7 Hedging that erases the point

- ⚠ "It's important to acknowledge that, while some might argue…" Cut. State the position.

---

## 4. Voice rules — write like this

These are about tone and shape, not subject matter.

### 4.1 Sentence length

Mix short and long. Short sentences land hard. Long sentences allow nuance. Avoid five medium sentences in a row.

### 4.2 First person where it earns its place

- "I've taught this in 200+ schools" — useful. Establishes authority.
- "I believe that consent education is important" — unearned. Just state the claim.

### 4.3 Direct address

Use "you" for the reader where it makes sense. The reader is usually a PSHE lead, headteacher, or teacher — speak to them.

### 4.4 Plainspoken authority

Tailor's voice is "I've done this for ages and here's what works," not "Studies suggest that pedagogically grounded approaches may yield improved outcomes." When a sector buzzword sneaks in, rewrite the sentence.

### 4.5 Em-dashes

Tailor's house style now avoids em-dashes (—) in body prose. They were an LLM tell. Use comma, colon, semicolon, parenthesis, or full stop instead. Title separators are pipes (`|`), not em-dashes.

This rule applies to AI drafts especially. The Red Team review should flag any em-dash in a draft.

### 4.6 Headings

H2 only for main sections. H3 sparingly within a section. Headings should be readable sentences, not nominalisations: "How to write your RSE policy" not "RSE policy writing." Sentence case, not title case.

### 4.7 Sign-offs

End posts with what to do next: a CTA, a link to a service, a related question for the reader. Not "I hope this was helpful" or "thanks for reading."

---

## 5. Required elements per content type

### 5.1 Blog posts

Every published blog post must have:

- A featured image (licensed stock, AI graphic that isn't photographic, or own photography) with `heroImageAlt` describing it accurately.
- A `primaryTopic` matching a topic landing-page slug.
- At least one citation when claiming anything about DfE / KCSIE / Ofsted / RSHE.
- At least one link to another Tailor blog post, glossary term, or topic page (internal-link discipline).
- An explicit CTA: enquire about a service, read a related post, subscribe to the newsletter.
- A `reviewBy` date 6 months from publish if the post is `guidanceSensitive: true`, otherwise 12 months.

### 5.2 Newsletter issues

Every newsletter issue must have:

- A subject line of 5–7 words optimised for opens (not the post title).
- A preheader line ≤90 characters.
- A clear opinion in the first sentence.
- A `Read the full piece →` CTA pointing at the linked blog post.
- A working one-click unsubscribe link.
- A plain-text version (auto-generated).

### 5.3 LinkedIn announcement posts

- A hook in the first line that doesn't require clicking "see more" to land.
- A clear "why this matters" framing for the target audience (named in the post or implied).
- A single CTA: read the post, comment, save.

### 5.4 LinkedIn follow-up posts (Thursday)

- A standalone idea — should not require having read the announcement.
- A quote, hot take, stat, or angle drawn from the blog post.
- Link to the post at the end OR optionally in the first comment if engagement is the goal.

### 5.5 Instagram carousels

- 6–10 slides total.
- First slide is a hook with the title; no link in the image (Instagram doesn't make image-text links clickable).
- Last slide is a CTA: "Read more on tailoreducation.org.uk/blog/{slug}" or "Link in bio."
- Body slides each have a clear single idea — no walls of text.
- Alt text for every slide (Claude generates these; editor verifies).

---

## 6. Changelog

- **2026-05-12**: Initial policy committed. Sections 1–5 drafted.
