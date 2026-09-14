# Blog audit — all published posts, 14 September 2026

**Scope:** the 24 posts in `src/content/blog/` with `status: "Published"`.
**Assessed against:** `docs/Tailor_Blog_Writing_Rules.md` (as rewritten 14 Sept 2026) and `docs/editorial-policy.md` §1.
**Method:** six parallel reviews, one per post group, each loading both rule docs in full. Mechanical rules (British spelling, topic links, filler intensifiers, em-dash density, frontmatter) checked by grep across all 24.

**Verification status.** Findings marked **[V]** were checked directly against the source file during the audit. Unmarked findings come from the review pass and carry the quoted sentence as their evidence — check the quote before acting. Findings marked **[AUTHOR]** cannot be settled from the repository at all and need Gareth.

---

## Provenance — which commit this audit describes

The audit was read from the working tree at **`5cc8bde`** ("Blog: make the withdrawal post read as a reference").

`origin/main` had moved on by seven commits while this ran, three of them blog edits. Checked afterwards: **22 of the 24 posts are byte-identical** between `5cc8bde` and `origin/main`, so their findings describe the live text exactly. Two posts differ:

**`consulting-parents-rse-policy-2026`** — every finding listed below has already been fixed upstream, independently: "Two obligations sit in one sentence.", the governance-calendar closing payoff, "That is worth knowing before you design one", "A policy describes a subject. It does not show a parent what a lesson contains.", and the "I'd say which is which in the invitation itself." author-check. **Treat this post's entry as closed.**

**`2026-rse-guidance-primary-schools`** — most voice findings fixed upstream ("The fifth needs planning rather than slotting.", "The shift that's easiest to miss in an audit", "That makes the choice a more visible one.", "significant restoration", and the opening preview triplet). **Two findings still stand:**
- The "additions that need curriculum time" section is still entirely uncited. Upstream expanded it from four items to five (adding mental-health language, and a wider family-structures list) without adding a single paragraph or page reference. This was the highest-value finding for the post and it is now larger than when audited.
- Bold labels are still there — `**Personal safety**`, `**Vaping**`, `**Online financial harms**`.

That an independent editor converged on the same voice fixes for these two posts is corroboration of the method, not a contradiction of it. But the lesson holds: **check the sentence against the file before acting on any quote in this document.** Every prompt in `docs/blog-audit-chat-prompts.md` says so.

---

## Status — what has already been actioned

Applied on 14 September 2026, after the audit. `astro build` exits 0 with all 24 posts.

**Done:**
- **§1.4 meta description** on `talking-to-boys-masculinity-misogyny-online-influencers` — the named individual is gone from the file entirely.
- **Alt text** written for all 10 posts that had none, each from looking at the image. All 24 posts now carry `featuredImageAlt`.
- **31 deletions** — 23 throat-clearing sentences and 8 closing rhetorical payoffs, listed per post below. Each was an exact-match deletion; the seams were re-read afterwards for dangling referents.
- **`topicIds` populated on 13 posts** with real Notion landing-page IDs, verified to resolve against `.cache/notion/landing-pages.json`.
- **5 in-prose `/topics/` links** added by linking a phrase already in the text.
- **Schema:** `guidanceSensitive`, `reviewBy`, `lastReviewedDate` added to the blog collection in `src/content.config.ts`.

**Still open — deliberately not done:**
- Every **publish-gate breach in Part 1** except §1.4. The citation work needs the real source documents.
- **8 posts still have no `/topics/` link.** In most of them the only natural anchor sits inside a sentence flagged for rewrite (the opening anecdotes in `teaching-consent`, `sharing-nudes`, `teaching-puberty`) or inside a quoted passage from the guidance (`2026-rse-guidance-plain-english-summary`). `rse-policy-questions-governors-ask` contains no topic term at all. These want the rewrite first, then the link.
- **11 posts still have empty `topicIds`** — the policy, governance, guidance and SEND posts. There is no landing page matching "policy", "governance" or "SEND", so any assignment would have been a guess that changes what shows in related posts. Needs a decision: either accept no topic for these, or add a topic.
- **Every rewrite.** Nothing that required replacing a sentence rather than removing one was touched, and no `[AUTHOR]` claim was resolved.

One reviewer quote could not be found in the source — "That's a complex piece of work" in `complete-guide-rse-special-schools` does not appear in the file, and that finding has been dropped.

---

## Part 1 — Publish-gate breaches

These are `block` severity under `editorial-policy.md` §1. All are live.

### 1.1 Placeholder citations — 12 instances, 4 posts **[V]**

Every one is in a Trusted resources list; every one is a bare `http://` domain standing in for a named document.

| Post | Placeholders |
| --- | --- |
| `teaching-porn-literacy-what-it-is-why-it-matters` | `bbfc.co.uk`, `gov.uk` x2 |
| `rse-send-practical-approaches` | `schools.oxfordshire.gov.uk`, `learning.nspcc.org.uk`, `gov.uk` |
| `what-young-people-want-to-know-sex-relationships` | `sexeducationforum.org.uk`, `brook.org.uk`, `gov.uk` |
| `rse-programme-more-than-drop-down-day` | `gov.uk`, `sexeducationforum.org.uk`, `pshe-association.org.uk` |

Policy: §1.1 (no DfE/statutory citation without a URL to the specific document). Also fails the 90% test — these are placeholders left in a published draft.

### 1.2 Statistics with no source URL **[V]**

- `what-young-people-want-to-know-sex-relationships` — eight figures (50%, 43%, 58%, 54%, 54%, 46%, 30%, 25%) across two paragraphs. The only link in that passage is an internal `/topics/lgbtq-inclusion`.
- `teaching-porn-literacy-what-it-is-why-it-matters` — Baroness Bertin 23% (line 34); Sex Education Forum 58% and 15% (line 37). No link on either line.
- `rse-send-practical-approaches` — "Disabled children are over three times more likely to be abused or neglected than non-disabled children, according to the NSPCC" (line 32). The hyperlink points at `/topics/abuse-exploitation-and-violence`, not the NSPCC. The next sentence, "Research consistently shows that children with SEND have a poorer understanding of boundaries…", cites nothing.
- `rse-programme-more-than-drop-down-day` — SEF 2024 poll (57%) unlinked; Ofsted's 2021 review of sexual abuse in schools cited with no URL and characterised rather than quoted.

Policy: §1.3.

### 1.3 Legal oversimplification **[V]**

`rse-send-practical-approaches:35` — "The [2026 DfE guidance](/blog/2026-rse-guidance-plain-english-summary/) is clear that RSE is statutory for all pupils, including those in special schools and alternative provision. There's no exemption, and there shouldn't be."

Two failures. The link goes to Tailor's own blog rather than the DfE document (§1.1). And "there's no exemption" flattens the actual position — relationships education and sex education are not on the same footing, and the parental right to request withdrawal from sex education exists. A SENCO who repeats this to a parent is wrong. `parental-right-to-withdraw-rse-2026` documents the real position correctly.

Policy: §1.1, including the anti-oversimplification clause.

### 1.4 Libel risk in a meta description **[V]**

`talking-to-boys-masculinity-misogyny-online-influencers` — the body names no individual anywhere, which is a deliberate and correct choice. The frontmatter does:

    metaDescription: "How to talk to boys about masculinity, misogyny, and the influence of figures like Andrew Tate. Practical classroom approaches that work."

A named living person placed in apposition with "misogyny", with no evidence attached, in the string that ships to search results and social cards. Policy: §1.4.

Repair: "…and the influence of online figures named in the 2026 RSHE guidance."

---

## Part 2 — Per-post findings

### Guidance and policy

#### 2026-rse-guidance-plain-english-summary
**Verdict:** Needs work. Well cited, but it does not deliver what its title promises.

1. **Title/content mismatch [V].** Titled "What the 2026 RSE guidance means for your school now"; `metaTitle` is "2026 RSE Guidance Summary: What Schools Need to Do". Its five headings are *Start with the teaching / What pupils do with the information / Parents need to see the materials / Read sensitive sections together / Give the review an owner*. There is no section summarising what changed — this is a review method. `rse-policy-checklist-2026` links here for "the full picture of what changed". Repair: retitle to what it is and repoint the checklist's link at the primary/secondary posts, which are the summaries.
2. **Balanced triplets, four consecutive.** "Check what pupils are being asked to understand, whether the explanation is clear and what the teacher has available when a discussion becomes difficult." / "Check how the lesson handles blame, where pupils can seek help and how staff will respond…" / "Explaining how someone could respond to pressure, notice discomfort or ask for help" / "A discussion prompt needs a purpose, some thought about possible answers and a way to bring the conversation back when it drifts."
3. **Throat-clearing opener.** "An RSE review has to fit around lessons that are already being planned and taught. If you're responsible for the curriculum, it can be difficult to tell which parts need attention first." Repair: open on "Start with the lessons pupils are about to receive."
4. **Mini-intro restating its own heading.** Under "What pupils do with the information": "I would also look at what pupils do with the information." Delete.
5. **Three-item em-dash appositive.** "…audit sheet — two sides of A4, free, with the paragraph reference against each check."

**Structure:** Order is sound; sags at "Read sensitive sections together" and "Give the review an owner" (generic project management). Close is correctly flat.
**Actionability:** Weakest of the guidance set. Verbs are "check", "look at", "keep a record" with no method attached. Worst: "Check how that works in your school. A parent reading the policy should be able to find the next step easily."
**Highest-value fix:** Decide what this post is, then make title, meta description and the checklist's inbound link agree.

#### 2026-rse-guidance-primary-schools
**Verdict:** Solid with fixes. Best-shaped of the guidance set.

1. **Uncited statutory content [V].** The whole "The additions that need curriculum time" section states new statutory curriculum content with no paragraph, page or link — personal safety, change and loss, vaping, online financial harms, and "The minimum age for social media, currently 13, is now content pupils should know." The skills paragraph is the same. This is the section a PSHE lead will take to a governor or provider, and it is the only uncited stretch in the post. §1.1.
2. **Bold labels inside a section [V].** "**Personal safety** is now…", "**Change and loss**, including bereavement…", "**Vaping**, alongside…", "**Online financial harms**, including gaming…". Named AI-tell.
3. **Throat clearing, four instances.** "The fifth needs planning rather than slotting." / "The shift that's easiest to miss in an audit is that a lot of the new material is something pupils should be able to do." / "The condition is the part to notice." / "That makes the choice a more visible one."
4. **Opening previews with a triplet.** "What's changed is a short list of additions, one clarification that will need a letter home before you teach it, and a much firmer set of expectations about what parents get to see." The headings already do this job.
5. **Filler intensifier.** "That's a significant restoration of professional judgement."

**Structure:** Strongest running order of the set; nothing sags. Close is a proper two-line landing plus CTA.
**Actionability:** Good. "Where to start this term" gives a real sequence. Stops short at "it means having the slides in a shareable state rather than in a shared drive" — never says what shareable means in practice.
**Highest-value fix:** Cite the additions section.

#### 2026-rse-guidance-secondary-schools
**Verdict:** Solid on voice, least actionable of the four.

1. **No "where to start" section at all.** The primary post has one; this goes from a withdrawal check straight to the CTA. Its own opening sets up a Year 7 baseline check and never returns to it. Repair: add a closing section naming two or three concrete jobs.
2. **"It's not X; it's Y" as a heading.** "## Misogyny is now in the curriculum content, not only the culture". Repair: cut after "content".
3. **Citations drop the hyperlink [V].** The statutory PDF is linked once at the top; after that references are bare — "(printed page 14)", "(paragraphs 75 and 76, printed page 37)", "(paragraph 85)", "(paragraph 21)". The 2019 comparisons — "(2019, pages 14 and 28)", "(2019, page 28)", "(2019, page 43)" — are load-bearing and never linked at all. The sibling posts hyperlink every reference. §1.1.
4. **One heading covering four unrelated topics.** "## Everyone in the room, and knowing whether it landed" covers SEND accessibility, same-sex integration, sex-separated teaching, assessment, and then a withdrawal policy check. Repair: split.
5. **Mini-intro restating the heading.** Under "Teaching it without amplifying it": "The practical problem with influencer content is teaching it without giving the material another airing."

**Structure:** Best opening in the set — a concrete instruction in sentence one. Becomes a change-log after that, and the opening's promise goes unpaid.
**Actionability:** The real weakness. Weakest passage is the assessment diff, which states what changed and leaves the consequence for the reader to infer.
**Highest-value fix:** Add the closing "where to start", beginning with the Year 7 baseline check.

#### rse-policy-checklist-2026
**Verdict:** Strong — the most usable post on the site — but it repeatedly characterises schools as falling short.

1. **Good-faith breaches, four [V].** "Plenty of policies describe the subject beautifully and never say which term it happens in or whose job it is." / "because these are the items schools most often find missing" / "which is the part most schools struggle to show" / "Most schools find the same thing: the policy needs a paragraph or two, and the coverage map is the real job." Repair per the rule: describe the standard, not the failure — e.g. "A policy that names the term and the post-holder can be held against this year's plan; one that describes the subject alone cannot."
2. **Opening is a stakes hook.** "So this is no longer a planning exercise. If your policy has not been through a proper review, you are teaching under guidance your policy was not written for, and the first person to notice will probably be a parent asking to see something." Repair: cut to the commencement fact and go straight to the paragraph-5 point.
3. **Throat clearing before each of the four items.** "This is the change with real teeth, and the one with a lead time you cannot shorten."
4. **[AUTHOR]** "I have seen schools add the topic to the scheme of work without the training, which is the wrong way round."
5. **Seven checkable items buried in a semicolon run-on**, in a post whose deliverable is a scannable list, with no paragraph references: "deepfakes and how to identify them; sextortion; strangulation and suffocation as criminal offences; …"

**Structure:** Best-organised post on the site. The four priority items reappear inside the checklist, which is defensible but worth a line acknowledging. The close does more work than the rules allow — "Finishing the list gives you a record of what you found on a particular date…" is a summary paragraph.
**Actionability:** Strongest on the site, and the reason is specificity of artefact: "Pull out every licence and contract for bought-in RSHE material and read the sharing terms." The bullet list is a legitimate use — it is the deliverable. Goes abstract once: "There is some evidence of what pupils took away from a unit" names no method.
**Highest-value fix:** Rewrite the four generalisations as descriptions of the standard.

### Parents, withdrawal and governance

#### consulting-parents-rse-policy-2026
**Verdict:** Cleanest of the set on tone, strongest on citation.

1. **Throat clearing — the rules doc's own example, still live [V].** Line 45 opens "Two obligations sit in one sentence." This exact sentence is quoted in `Tailor_Blog_Writing_Rules.md` line 36 as a thing not to write. Repair: delete and open on the quotation itself.
2. **Rhetorical payoff at the close.** "A fixed review date in the governance calendar is the difference between a consultation that happens in a difficult year and one that happens in every year." Repair: "Put a fixed review date in the governance calendar."
3. **Framing before the point.** "That is worth knowing before you design one, because it means a local process is a local choice…"
4. **"It's not X; it's Y" in two-sentence form.** "A policy describes a subject. It does not show a parent what a lesson contains."
5. **[AUTHOR]** "I'd say which is which in the invitation itself." / "The letters, questionnaires and classroom events I use are a separate piece."

**Good faith:** Clean, and the model for the rest of the site. "Parents who need a translation, parents of children with SEND, and families who do not attend school events can be missing from a set of responses that otherwise looks healthy" describes what happened to the response set without characterising the families — exactly the form the rule asks for.
**Structure:** Opening is a straight statement of the duty with its citation. No sag at 1,369 words.
**Actionability:** Strong. Weakest passage is "Who the consultation reaches", which lists routes without saying how to choose between them or what a workable return looks like.
**Highest-value fix:** Delete "Two obligations sit in one sentence."

#### parental-right-to-withdraw-rse-2026
**Verdict:** Legally the most careful post on the site; heaviest offender on AI-tells.

1. **Bold-label block that duplicates the whole post.** "The short answers" (lines 33–39) is a bulleted list of bold labels — "**Relationships education, health education and the science curriculum:**", "**Primary:**", "**Secondary:**", "**Pupils with SEND:**". Two AI-tells at once, and every line is restated properly below. Repair: cut it.
2. **Good faith + unverifiable claim + filler intensifier in one sentence.** "Most requests we see come from parents who have imagined the content rather than seen it, and they tend to soften considerably once the actual material is in front of them." Repair: "Showing parents the actual material earlier does more to reduce withdrawals than anything you can write into the process for handling requests."
3. **Sector generalisation blaming schools.** "A withdrawn pupil sitting at the back of reception with a reading book is the version of this that everyone recognises and nobody intends." Repair: keep "Name the work and the member of staff before the first lesson" and delete the sentence.
4. **Throat clearing, three.** "That single word does most of the work in this article." / "What parents call RSE is really four separate things sitting next to each other on a timetable." / "There is a pattern in all of that worth naming."
5. **Aphoristic payoffs.** "It does not remove the content from the child's week. It removes your control over how they receive it." / "A right nobody has told you about is not a right you have."

**[AUTHOR]:** "which surprises a lot of parents who assumed puberty was the thing they were opting out of"; "That point tends to land with parents more than anything else a school can say"; "Most requests we see…".
**Structure:** Exemplary opening — the quotation first, then "Sex education. Not RSE, and not RSHE." Length earned at 1,717 words once the bullet block goes.
**Actionability:** Highest on the site for a head facing a live request. Weakest passage: "So work out how you will tell them, in a way that does not require them to challenge anyone at home to find out" — identifies the hardest operational problem and hands it back unsolved.
**Safety:** Best in the set. Twelve hyperlinked references; full withdrawal nuance including the three-terms-before-16 opt-back-in.
**Highest-value fix:** Delete "The short answers".

#### reduce-withdrawals-sex-education-parent-consultation
**Verdict:** The most useful post to a PSHE lead, and the most rule-breaking.

1. **Opening carries three tells at once.** "A school's job isn't to change their mind. It's to make sure the decision isn't resting on an assumption that's wrong, information that's incomplete, or a picture of the lessons that's years out of date." Banned construction, then a balanced triplet, and the triplet characterises the absent parent's decision as wrong/incomplete/outdated — undoing the good-faith sentence immediately before it. Repair: start the post at "Parents have the right to request withdrawal, and that stands whatever a school does."
2. **Good-faith breach.** "Most communications cover content and stop there, but the conditions of the lesson are what an anxious parent is actually imagining…" Repair: drop the census of the worse version.
3. **[AUTHOR], four.** "Most parents who open the slides are reassured by how unremarkable they are." / "Plain naming tends to prompt fewer questions than euphemism" / "It feels riskier to write than it turns out to be." / "which answers something a lot of parents wonder about without ever putting it into words".
4. **Rhetorical payoff close.** "Then do the same thing next year, in the same order, in more or less the same words. That's the part that compounds."
5. **Absolute off-domain internal link.** "[talk to us about RSE policy and curriculum planning](https://www.tailor-rse.org.uk/services/rse-policy-curriculum-planning/)" — the only absolute internal link in the set. Repair: make it relative.

**Structure:** Right sequence, but sags in the middle third — "Use the words the lessons use" (three sentences) and "Show the adaptation for children who need it" (four) read as headings looking for sections. Length only partly earned.
**Actionability:** Strongest on method. "Questions I use" and the six-item lesson-conditions list lift straight into a letter. Weakest: "Close the loop" names the task but no format, length, timing or signatory.
**Highest-value fix:** Cut the first paragraph to its good-faith sentence.

#### rse-policy-questions-governors-ask
**Verdict:** Voice-clean — no throat clearing, no bold labels, no good-faith problem — with one §1.1 breach.

1. **~20 statutory quotations with bare paragraph numbers.** Only the opening block quote and line 34 are hyperlinked. Everything after is "(paragraph 12, printed page 4)", "(paragraph 56, printed page 34)", "(paragraph 75, printed page 37)" and so on. The other three posts in this group hyperlink every one. §1.1. Repair: link each to its `#page=` anchor.
2. **A meta-aside that breaks voice.** "This article draws no additional inspection requirements from that sentence." Repair: "The guidance names no inspection requirement beyond that."
3. **One question is not a question.** "### Show us the SEND adaptation in a real unit." is an imperative among six interrogatives.
4. **Three of seven questions stop at the quote and never name the evidence to ask for** — the parent-materials, SEND-adaptation and staffing questions. The other four close with a concrete ask.
5. **Two mild framing sentences.** "Assessment is folded into curriculum design rather than given a system of its own." / "Assurance is a different job from running the subject."

**Good faith:** Clean throughout. The model for the site.
**Structure:** Tightest post in the set at 1,130 words; no sag. Close is flat.
**Actionability:** Very high where it names the evidence. Weakest: "Where governance stops" draws the boundary and leaves the governor nothing to do at it, with no link out to the withdrawal post.
**Highest-value fix:** Hyperlink every paragraph reference.

### Teaching practice

#### teaching-consent-beyond-no-means-no
**Verdict:** Strongest post on method; undermined by a hook opener.

1. **Opening is a hook containing a verbatim pupil quote. [AUTHOR]** "I was observing a consent lesson in a secondary school last year… And then a boy at the back said… 'But what if you're not sure if she's into it and you don't want to ruin the moment by asking?'" Repair: open on the question itself as a stated problem.
2. **"It's not X; it's Y", three times.** "Consent in 2026 isn't just about physical situations." / "It isn't a guess that happened to be right, or agreement you talked someone into." / "Not 'where did it go wrong' — which implies blame — but 'where could someone make a different choice?'" The third earns its place; the first is filler.
3. **Throat clearing.** "That's the question consent education needs to be able to answer. And too often, it can't."
4. **Rhetorical payoff on a method.** "It shifts the focus from judgement to agency, which is where the real learning happens." End at "agency".
5. **The legal definition is invoked but never linked.** The post says pupils "need to know" it and paraphrases s.74 Sexual Offences Act 2003 without naming or linking it. §1.1.

**Method:** Yes — third-person distancing with a spoken boundary, a named non-negotiable, a specific question ("where could someone make a different choice?"), and what to do when a pupil starts to disclose.
**Structure:** Grey areas, digital, classroom method, guidance last — correctly puts statutory material where it belongs. "Digital consent" is the one section where description outweighs method.
**Highest-value fix:** Delete the observation anecdote; open on the question.

#### teaching-hard-topics-when-not-a-specialist
**Verdict:** The most useful post on the site for its stated reader; heaviest load of "It's not X; it's Y".

1. **"It's not X; it's Y" four times, including a heading.** Heading: "You don't need to be an expert. You need to be steady." Then "your job is not to know everything about pornography or masculinity. It's to be the calm adult…" / "Students aren't looking for a lecture. They're checking whether…" / "Being handed a hard topic with no support is a staffing problem, not a personal shortcoming." Keep at most the last; rewrite the heading to "What the job actually is".
2. **"Here is the reassuring part:"** — textbook throat clearing. Delete the clause.
3. **[AUTHOR]** "Most of the RSE I see taught in schools is not taught by RSE specialists." / "In my sessions the boys are rarely hostile." / "When I teach porn literacy to a Year 10 class…"
4. **Balanced triplet on a summary cadence at the close.** "Know what you are teaching, prepare the questions you can anticipate, and know who will support you with the ones you cannot." Repair: end on "You can teach this while still feeling nervous."
5. **Mid-post triplet.** "a poor guide to real sex, real bodies and real consent."

**Method:** Yes, and it is the only post that hands over verbatim scripts — "I'm not going to talk about myself, but I'll answer the real question underneath it." and "That's a good question. I don't want to guess at it, so I'll find out and we'll come back to it." Plus a named preparation drill and a rule for hostile comments.
**Structure:** Best opening on the site — a plain statement of the reader's situation, no run-up. One wobble: the parents paragraph sits inside "The statutory grounding is on your side" and doesn't belong there.
**Safety:** Best-cited post in its group. Paragraph-level deep links, document named with both dates, obligation quoted rather than paraphrased.
**Highest-value fix:** Strip the "not X; it's Y" scaffolding, starting with the heading.

#### teaching-porn-literacy-what-it-is-why-it-matters
**Verdict:** Would not pass the editorial policy as it stands, and it never delivers a method. Rebuild.

1. **Three unsourced statistics [V]** — see Part 1.2.
2. **Three placeholder Trusted resources links [V]** — see Part 1.1.
3. **Statutory requirement asserted without citing the source [V].** "The updated DfE statutory guidance, effective from September 2026, requires schools to teach about [pornography as part of their RSE curriculum]" — the only link on that sentence goes to Tailor's own `/topics/` page. §1.1 forbids "required to" claims without quoting source language, and forbids citing the DfE without a URL. `teaching-hard-topics…` gets the identical claim right; copy that treatment.
4. **Good-faith breach in paragraph three.** "That's the gap I see everywhere. Schools know pornography needs to be addressed. Most just don't know where to start."
5. **"It's not X; it's Y" plus condescension.** "This is not about showing pornography in classrooms. It's about acknowledging that most young people will encounter it." / "Porn literacy is a media literacy concept." — a PSHE lead does not need media literacy defined.
6. **[AUTHOR]** Opening quotation attributed verbatim to a teacher at a named Tate Modern session.

**Method:** None. "focus on attitudes and assumptions", "Ground rules matter", distancing "helps", "start small" — all descriptions of good teaching, no moves. No question, no activity, no worked example, and no guidance on a pupil disclosing having seen or been shown something. The sibling hard-topics post does more for a porn-literacy teacher than this does.
**Structure:** Front-loads rationale badly — two full sections before any teaching content, then "What good teaching looks like" describes rather than instructs, then "Where to start" restarts the same ground and turns into a case for buying training.
**Highest-value fix:** Replace "What good teaching looks like" with the actual lesson — the opening question, the assumptions you surface, and what you say when a pupil says something graphic or discloses.

#### teaching-puberty-primary-schools-guide
**Verdict:** Solid on sequencing and statutory nuance; opens on a child's distress.

1. **Opens on a child's distress.** "one of her pupils had started her period at school and was convinced she was dying. Nobody had told her. Not school, not home. She was ten." This breaches "never open on someone else's trauma" outright, and is **[AUTHOR]** under §1.3 — a second-hand account attributed to an unnamed Year 5 teacher. Repair: open on the planning problem.
2. **Throat clearing plus not-X-not-X-but-Y, immediately after.** "That's the case for teaching puberty before it happens. Not because it's comfortable, not because parents are asking for it, but because children deserve to understand what's happening to their bodies before it starts."
3. **"That last phrase should drive your sequence."** — previews before making the point.
4. **"It's not X; it's Y" twice more.** "This isn't about embarrassing anyone. It's about building a school culture where…" / "Puberty isn't just about bodies."
5. **[AUTHOR], in the exact banned phrasing.** "In my experience, that kind of transparency takes the heat out of most concerns".
6. **Two citation checks.** "In maintained primaries, academies and free schools, parents cannot withdraw from puberty in health education or science content" is a legal certainty asserted without quoting source language. And the link on "Other independent schools follow separate PSHE standards" points at page 4 of the RSHE PDF, not at any separate standards document — looks like a mismatched link.

**Method:** Partly. Real curriculum and culture decisions (plan a first pass while abstract and revisit; penis/vulva/vagina not "front bottom"; never let half the year group leave for menstruation; period products visible in all year groups; no naming a child's development in front of the class). Missing: the lesson itself, and the inevitable "how does the baby get in there" follow-up.
**Structure:** Order is right, and the withdrawal section is the most valuable thing in the post because it distinguishes health education from primary sex education. Close is a rhetorical payoff: "That matters more than you might think."
**Highest-value fix:** Cut the opening anecdote — it removes the trauma-opener breach, the fabrication exposure, and the throat-clearing paragraph that follows, in one edit.

### SEND, drop days and programme

#### complete-guide-rse-special-schools
**Verdict:** Best-sourced of its group, but does not earn "Complete Guide" and never touches the three hardest SEND questions.

1. **[AUTHOR] — quoted words in a head teacher's mouth.** "The head or PSHE lead says something like: 'We know we need to do this. We just don't know where to begin.'" "Says something like" is the composite tell; §1.3 bans this without a real source.
2. **Throat clearing, four.** "Hold two things at once." / "That last one is where RSE has something to offer, and it's worth being precise about what." / "Read it for what it is, though." / "That's a complex piece of work."
3. **"It's not X; it's Y" in negated form, in the opening.** "They're not resistant. They're overwhelmed."
4. **Broken referent — a real copy defect.** The Safeguarding section opens "Its [SEND section](…) asks for accessible teaching…" with no antecedent; the previous mention of the DfE document is 60 lines earlier. This converts a properly-linked statutory claim into an unattributed one. Repair: "The 2026 RSHE guidance's SEND section…"
5. **No `/topics/` link [V].**

**Title:** Overpromises. A complete guide that never mentions mental capacity, intimate care policy, masturbation and private behaviour, puberty for pupils who cannot self-manage, harmful vs developmental sexual behaviour, EHCP outcomes, governor sign-off or assessment is not complete. Repair: retitle to "Developing RSE in Special Schools: Where to Start", or add the sections.
**Actionability:** Partly. The parent-engagement section is genuinely usable — "We ask questions like 'Do you have any concerns about your child as they grow up and go through puberty?'" Everything else stops at principle. Most abstract: "Your RSE policy should reflect the specific context of your school. That means acknowledging the communication needs of your pupils, the role of personal care in your setting, and the additional safeguarding considerations…"
**Structure:** Length ~80% earned. "Start with your whole-school approach" is mostly assertion; "Curriculum design for non-linear learners" restates what the other SEND post does better. Opening is a soft run-up.
**Highest-value fix:** Add the missing section — capacity, intimate care, and disclosure from pupils without spoken language. It is both the actionability gap and the only thing that would justify the title.

#### rse-send-practical-approaches
**Verdict:** The most useful classroom content in its group, wrapped in a hook and undermined by three block-level citation failures.

1. **Unsourced NSPCC statistic and uncited "research consistently shows" [V]** — Part 1.2.
2. **Legal oversimplification [V]** — Part 1.3.
3. **Opening is a hook with a withheld payoff.** "a pupil put his hand up and asked me a question so direct and so honest that it completely reframed how I thought about the session." The question is never revealed. The purest violation of the no-hook rule on the site.
4. **"It's not X; it's Y" twice.** "This isn't about shaming. It's about giving young people the social knowledge they need…" / "He didn't need the nuance stripped out. He needed it presented differently."
5. **Throat clearing before the one section that matters.** "Here's what I've seen make the biggest difference in practice."

**Method:** Yes, in the middle third, and it is the best classroom material in the group — "Instead of 'respect someone's personal space,' try 'stand an arm's length away unless they say it's OK to be closer.'" and the traffic-light system, "green for handshakes and high fives, amber for hugs with permission, red for touches that aren't OK." The disclosure section, which carries the most risk, is the least specific part: "Have clear, practised protocols."
**Structure:** Three headings for 627 words and only "What actually works" earns its place. Roughly 40% argues that SEND RSE matters before any of it says how.
**Highest-value fix:** Fix the three citations — the post's credibility rests on the claim in its second paragraph.

#### drop-day-setup
**Verdict:** Well-voiced, safety-clean, almost entirely unactionable for the person reading it.

1. **Title is a hook.** "The Drop Day That Taught Me More Than It Taught the Kids" is a curiosity gap, and it mismatches the `metaTitle` ("How to Set Up an RSE Drop Day That Actually Works") which promises a how-to the post does not deliver — and uses "actually", a flagged tic.
2. **Closing rhetorical payoff.** "That Friday in September was one of my roughest days in a school, but it made every drop day after it better." Delete; the CTA already closes the post.
3. **Throat clearing / suspense.** "I hadn't given that a second thought when I accepted the booking, but I really wish I had." / "I failed. And here's what I learned."
4. **Advice framed as autobiography.** "But I didn't ask about the room beforehand, and I should have." The post's best insight, aimed at the author rather than the reader.
5. **Performed surprise.** "it was the first day back at school after the six-week holidays!"

**Actionability:** No. Both items in "What I do differently now" are provider-side process (the SLA, checking the date against the school calendar). The school-side lessons — don't book for the first day of term, don't accept the sports hall, ask what the room is before agreeing — are demonstrated but never stated as advice.
**Structure:** Sensible order; length right for an anecdote at 528 words. The third section, the only part with reader value, is the thinnest. Passes the read-aloud test better than anything else in its group.
**Highest-value fix:** Convert "What I do differently now" into a short checklist the booking school can act on.

#### rse-programme-more-than-drop-down-day
**Verdict:** A confident argument whose three load-bearing evidence claims carry no URLs.

1. **SEF 2024 poll unsourced [V]** — Part 1.2.
2. **Ofsted 2021 review cited without URL and characterised rather than quoted [V].** "Ofsted's 2021 review of sexual abuse in schools found that RSE teaching was inadequate in many settings and that there were significant gaps in curriculum coverage." Related unsourced claims about the inspection framework: "Ofsted doesn't grade RSE as a separate subject"; "The inspection methodology includes deep dives". "Significant" is also a filler intensifier. §1.1.
3. **Rhetorical question as transition plus unevidenced sector claim.** "But as the backbone of your RSE programme? They don't work. And increasingly, Ofsted is noticing."
4. **"What good looks like" is a summary paragraph plus "It's not X; it's Y".** "Good RSE delivery is embedded in the timetable, not bolted on." Five sentences of anaphoric restatement.
5. **Opening hook with a quoted school [AUTHOR] and a performed simile.** "…is like teaching a child to swim by showing them a PowerPoint about water."
6. **Unsourced sector claim attributing shortcoming to schools.** "Most RSE in England is delivered by form tutors or PSHE teachers who haven't had specialist training."

**Actionability:** Barely. The spiral-curriculum paragraph is the only applicable model: "Puberty education in Year 5 builds on body awareness in Year 3. Consent conversations in Year 8 build on boundary-setting in Year 6."
**Highest-value fix:** Add real hyperlinks to the Ofsted 2021 review and the SEF 2024 poll — the entire argument rests on them.

### Online harms and young people

#### sharing-nudes-sextortion-deepfakes-schools-2026
**Verdict:** Strongest post on the site for safety handling. One hook opener to remove.

1. **Opening hook [AUTHOR].** "Last week I came across one of my old lesson plans on online safety. It was from around 2010… It was quite shocking to see how tame it was and how tunnel-visioned (if I can say that!)." The reader reaches the first fact at line 29. Repair: cut the paragraph and open on "A normal, clothed photograph can now be used to generate a realistic sexual image of someone."
2. **Filler intensifiers in that same paragraph.** "quite shocking"; "which is obviously still important and still very much part of what we teach".
3. **Throat clearing.** "In teaching, I'd make that distinction clear." / "I would teach those routes before a pupil needs them."
4. **No `/topics/` link [V]**, and `topicIds: []`, so it surfaces on no topic page.

**Safety:** Exemplary and worth preserving as the house model. Criminal-law material attributed rather than asserted, then qualified — "Indecency is a legal assessment; nudity alone does not settle it (section 1.7)". The Outcome 21 passage refuses the simplification §1.5 warns about. The Report Remove passage limits its own promise.
**Method:** Yes, the best of its group — a teacher taking a disclosure has a sequence to follow before break.
**Highest-value fix:** Delete the 2010-lesson-plan opening.

#### talking-to-boys-masculinity-misogyny-online-influencers
**Verdict:** Careful with boys, careless in the meta description.

1. **Andrew Tate in the meta description [V]** — Part 1.4.
2. **Good faith — the whole "## What doesn't work" section** is a list of things schools currently do, framed as errors: "Lecturing boys about toxic masculinity." / "Hanging the whole topic on a one-off assembly or a drop-down day." / "Framing the conversation as 'boys need to be better.'" Repair: fold into "What works better" as positive formulations. The structural fix and the tone fix are the same fix.
3. **Throat clearing that also makes a sector-wide negative claim.** "It's worth saying, because a lot of the conversation around masculinity in schools starts from the assumption that boys are the problem. They're not. They're kids who need support." Cut from "It's worth saying".
4. **Citation label/anchor mismatch [V].** Link text says "guidance page 14"; the href resolves to `#page=15`.
5. **Balanced triplet in the first three lines.** "They're still having crushes, still loving their mums, still trying to figure out who they are."
6. **Rhetorical payoff close.** "Boys hear plenty about the sort of man not to be, and much less about the sort they could be. That gap is where the influencers do their best business." Same move mid-post: "That pause is where the real work happens."
7. **[AUTHOR]** "In one session, a boy said to me, 'But what if I want to be hench and sleep with lots of women? Is that bad? Am I wrong?'"

**Statistic handling is the best on the site** and should be the house model: "over five days the share of recommended videos with misogynistic content rose roughly fourfold ([UCL, February 2024](…))", immediately followed by "That's a modelling study with researcher-built accounts, not a count of what real boys watch; it shows the route exists, not how many take it."
**Method:** Partly. A usable stance, but no lesson structure and no script for the moment a boy says something misogynistic in front of thirty people — the thing teachers are most afraid of.
**Highest-value fix:** Rewrite "What doesn't work" as positive practice.

#### what-young-people-want-to-know-sex-relationships
**Verdict:** Eight unsourced statistics and three placeholder citations. Weakest actionability on the site. Rebuild.

1. **Eight statistics with no source URL [V]** — Part 1.2.
2. **Three placeholder Trusted resources links [V]** — Part 1.1.
3. **Bold labels inside a section.** "- **Sex Education Forum:** Young people's RSE poll 2024 …" and the two following.
4. **Throat clearing.** "That last statistic is the one that should concern us most."
5. **"It's not X; it's Y" plus two triplets.** "I'm not suggesting schools should answer every anonymous question in a classroom setting. But I am suggesting that…" / "No filters, no judgement, no teacher watching over their shoulder." / "elsewhere doesn't have a curriculum, a safeguarding policy, or anyone checking whether the information is accurate."
6. **Good faith about schools.** "And when I look at what most schools are teaching in RSE, there's a gap." The following disclaimer doesn't undo it.
7. **[AUTHOR]** "We've had over 150 questions so far", repeated in the meta description as "based on 150+ anonymous questions". Load-bearing for the post's authority; check against the live Okay to Ask total.
8. **Unsupported superlative.** "Anonymous question boxes — physical or digital — are one of the simplest and most effective tools in RSE."
9. **Check `/topics/lgbtq-inclusion` resolves** — topic pages are generated from Notion at build time.

**Handled well:** No pupil question is reproduced verbatim. The material appears as themed paraphrase ("Am I normal? Is my body normal?"), which carries no identification risk. That was the right call.
**Actionability:** No. One action, and it is a link out to another post.
**Highest-value fix:** Hyperlink the Sex Education Forum 2024 poll and the RSHE guidance to their actual documents.

### Partner session write-ups

#### british-museum-no-sex-please-anonymous-questions
**Verdict:** The most transferable of the five; the mechanics stop one step short.

1. **The sift rule is never given.** "Two members of the Youth Collective, Gabby and Gerald, spent a couple of hours lightly sifting the questions — removing anything outright offensive or off-topic". Against what test? And what happens when you pull out a disclosure, or a question about a named person? In a school those two gaps are the entire risk of the format.
2. **[AUTHOR] — unsourced quantified sector claims.** "Most people over thirty had no sex education that contained the word consent as we now understand it." / "Most people of any age have unanswered questions they've never had permission to ask out loud."
3. **Throat clearing, three.** "That's a format that either works or doesn't. It worked." / "That is, on its own, worth noting." / "Anonymity is the obvious piece."
4. **Summary section plus payoff plus triplet.** "What I took away" opens "Two things. Firstly… Secondly…" and ends "a format I would use again tomorrow in any audience, any age, any venue." Also "a large, polite, quietly desperate audience for it".

**What a reader can do:** Run an anonymous written question box — box out well before the session (5:30 for a 7pm start), peers rather than staff sift, roughly half content / half questions, don't pre-screen yourself. Genuinely portable.
**Structure:** ~55% venue to 45% method. The British-Museum-atmosphere paragraph sits where the sift criteria should be.
**Highest-value fix:** Replace that paragraph with the question-box operating rules.

#### rada-consent-for-film-and-tv
**Verdict:** A well-written war story that promises a method in so many words and never delivers it.

1. **The promise-without-delivery sentence.** "If you're directing that scene, here is how you set it up so that both performers can do their best work without being asked to choose between their boundaries and their reputation." It says "here is how" and then doesn't say how. This is the one sentence a headteacher could translate into a school, and it is empty.
2. **"It's not X; it's Y" three times.** "The sessions weren't delivered as a warning. They were delivered as craft." / "consent is a craft skill before it is a moral position" / "the people with power in a room are the ones who set the consent culture, not the ones most affected by it."
3. **Throat clearing in the opening and at two section heads.** "If that title sounds fairly normal now, it's worth remembering that…" / "The honest answer is that…" / "It's strange looking back."
4. **Three-item em-dash list, filler intensifier x2, closing payoff.** "intimate work — kissing, partial nudity, simulated sex — with very little language"; "genuinely awful" / "genuinely heartening"; "When they don't, all the policy in the world won't save it."

**What a reader can do:** Almost nothing. Every concrete element is described from the outside — "We worked through concrete scenarios, not slogans" without a single scenario.
**Structure:** ~70% context to 30% usable, and even that 30% is described rather than demonstrated. "Before intimacy coordination" is ~25% of the post and teaches a school nothing. The reflective closing section is the most useful part, which means the post is upside down.
**Highest-value fix:** Cash the cheque in "here is how you set it up" — one concrete setup sequence, written out.

#### red-cross-angel-youth-group
**Verdict:** The best of the five on actionability and the only one that asks the reader to do something in their own setting.

1. **Three-item em-dash list in the post's most important sentence.** "…most likely to be getting less than the rest — because of language, because of care status, because of what's happening at home". This is the line you least want reading as a pattern.
2. **Closing rhetorical payoff.** "That's worth sitting with for a moment." then "A universal programme that leaves the same group behind every year isn't really universal." Cut both; the audit instruction is the ending.
3. **Throat clearing.** "Which, written down like that, sounds simple." / "Two things, mainly."
4. **Locational precision about a vulnerable cohort.** The post names the organisation, project, nickname, neighbourhood, weekday and age range: "Every Tuesday evening, the British Red Cross runs a youth group at its office near Angel… young unaccompanied refugees and asylum seekers in London, aged roughly fourteen to twenty-one." No individual is identified and nothing breaches §1 as written, but a recurring time and place for a group of unaccompanied minors is more precision than the story needs. Drop either the weekday or the location, and get Red Cross sign-off either way.

**What a reader can do:** Three portable things — seat mixed first languages at each table so participants translate for each other; put the known adult beside the young person who needs them rather than at the front; and audit your own roll for who is systematically getting less. That audit paragraph is the only place in the series that turns a write-up into a task.
**Structure:** ~40% context to 60% practice — the only post in the series with the ratio the right way round.
**Highest-value fix:** Extend the audit paragraph by one sentence saying what you change once you've found that group.

#### tate-modern-bedfellows-porn-literacy
**Verdict:** Contains the most usable artefact in the series, buried in a definitional aside.

1. **Three-item em-dash list plus a balanced triplet.** "there was the thing you'd expect — a slightly nervy energy at the start, some deflection through humour, some very sharp observations once the room warmed up" and "spaces that are already public, already cultural, already used to being places where people think hard about images".
2. **"It's not X; it's Y" twice, including as the closing payoff.** "Porn literacy isn't a campaign for or against pornography. It's a set of skills for…" / "isn't a young-people conversation with an adult conversation bolted on. It's one conversation that all of us have mostly had on our own."
3. **Throat clearing plus [AUTHOR] generalisation in one paragraph.** "That sounds obvious written down. It isn't how most people first encounter pornography. Most people encounter it accidentally, usually young, usually with no framework at all." Cite (IWF, Children's Commissioner) or attribute to the two rooms.
4. **Closing CTA carries a triplet.** "not a moral panic session, not a reassurance session, a real one".

**What a reader can do:** Use five questions on any piece of sexual imagery — "Who made this. Who's it aimed at. What's it selling. What's it leaving out. What would it be like if you took it as instructions for real life." That is a lesson's spine and needs no gallery. Plus: don't dial content up or down by age ("the vocabulary scales, the underlying questions don't"). Missing: what you put in front of pupils given you cannot show the material, and what to do when a participant discloses habitual use.
**Structure:** "The young people's session" and "The adults' session" describe how the rooms felt, not what happened in them. ~25% venue framing, ~15% method.
**Highest-value fix:** Promote the five questions into a section of their own showing how you run them without showing the material.

#### work-out-consent-masculinity-athletes
**Verdict:** A nice story about a thing Tailor did. It teaches a reader nothing they can do on Monday.

1. **The method section says there wasn't a method.** "The project didn't start with a fixed curriculum. The team shaped the sessions around what was emerging from the group as we went."
2. **Good-faith breach.** "In a lot of settings it's delivered as a set of rules."
3. **Avoid-list stack.** "Not resistance — relief." / "It was a genuinely unusual mix, and that was the point." / "That combination turned out to work well. The art gave people permission to be honest. The dialogue gave that honesty somewhere to go." / "That's what happened here." Each deletes without losing content — the test they fail.
4. **Repeated sentence frame plus summary close.** "Dorothee Boulanger and Dr Alana Harris brought… Phoebe Davies brought… Alex Bowmer brought…", then "The project has given me a lot to think about… I'd like to see more projects like it".
5. **Check the participant quote was cleared** — it is the only directly quoted participant in the series, and it sits beside a named institution and five named teams.

**What a reader can do:** Nothing. Closest to transferable is a stance, not a technique: "A consent session that treats participants as people with things to work out — rather than an audience to be briefed — gets a completely different response."
**Structure:** ~65% who-was-involved, 10% method, 25% reflection — the most skewed of the five. The sentence introducing the documentary ("captures what the sessions felt like better than I can in writing") concedes the problem.
**Highest-value fix:** Write one reflective-dialogue session out in full — opening question, grouping, the no-resolution rule — or drop the "Our Work" educational framing.

---

## Part 3 — Cross-cutting patterns

**1. Actionability splits on one thing: whether the words someone actually says were written down.** Every post that reaches usable does it by quoting a sentence a teacher can speak aloud, or naming a physical artefact to go and find. Every post that fails describes the conditions for good teaching instead. This is the most reliable predictor in the audit and it cuts across topic, length and audience.

**2. Hook openings are the most-breached rule.** Near-universal outside the September 2026 posts. Shapes seen: an anecdote with a withheld payoff (`rse-send-practical-approaches`), a quoted third party (`complete-guide-rse-special-schools`, `rse-programme…`, `teaching-consent…`, `teaching-porn-literacy…`), a nostalgia frame (`sharing-nudes…`), a child's distress (`teaching-puberty…`), a stakes warning (`rse-policy-checklist-2026`).

**3. Throat clearing has one signature shape: a sentence that rates a point immediately before making it.** "This is the change with real teeth." / "That last statistic is the one that should concern us most." / "Here's what I've seen make the biggest difference in practice." / "Hold two things at once." / "Two obligations sit in one sentence." Every instance found is deletable with no loss. A single pass deleting the first sentence of each section would clear most of them.

**4. The good-faith rule breaks in exactly one shape:** *here is what most schools currently do, and it isn't enough.* Found in `rse-policy-checklist-2026` (x4), `reduce-withdrawals…`, `teaching-porn-literacy…`, `what-young-people…`, `rse-programme…`, `work-out…`, and as the entire structure of the masculinity post's "What doesn't work" section. All survive the repair the rule prescribes.

**5. Closings reach for a payoff by habit.** At least nine posts. The rule says a flat ending is fine.

**6. Citation discipline splits by revision date, not by author care.** Posts revised in September 2026 carry page-anchored deep links, document names and years, and quoted source language. Un-revised posts carry bare-domain placeholders and unsourced statistics. Same author, same guidance document. The fix is a sourcing pass, not a writing pass.

**7. The partner-session series runs one visible template.** Intro naming the partner → why they asked / who was in the room → what the sessions looked like → **"What I took away"** → identically shaped CTA. The fourth slot is a summary-paragraph heading, which the rules ban, and three of five open it with a numbered preview ("Two things. Firstly…"). The third slot describes atmosphere rather than procedure in three of five.

**8. Risk concentrates where the advice thins.** The sections carrying the most safeguarding weight are consistently the least specific in their posts: disclosure handling in both SEND posts, the sift criteria in the British Museum question-box method, disclosure of habitual use in the Tate post, the "what to say when a boy says it out loud" moment in the masculinity post.

**9. Around 25 first-person claims cannot be verified from the repository.** Sector generalisations in Gareth's voice ("Most of the RSE I see taught in schools…", "In my experience…", "Most requests we see…") and five verbatim quotations attributed to real people — a head teacher, a phone caller, a boy in a consent lesson, a teacher at the Tate, a Year 5 teacher. These are the §1.3 exposure and only Gareth can clear them.

---

## Part 4 — Mechanical and data findings

All checked by grep across all 24 posts.

**Clean site-wide:** British spelling (zero US spellings across all 24 posts).

**Filler intensifiers — the named words are gone, the habit is not.** Zero hits for *dramatically*, *significantly*, *crucially*, *incredibly*. But the same tic is alive in words the rule does not name: **genuinely x8** (`rada` x2, `british-museum` x2, `tate-modern`, `talking-to-boys`, `teaching-porn-literacy`, `work-out`), *significant* x2 (`2026-rse-guidance-primary-schools:76` "significant restoration", `rse-programme:37` "significant gaps"), *considerably* (`parental-right-to-withdraw:105`), *quite* (`sharing-nudes:25` "quite shocking", `red-cross:58`, `rada:20`).

Worth noting against the rules doc itself: the avoid-list names four words, and a reviewer checking only those four would report this site clean. The rule would catch more as a description of the move — an adverb added to make a claim feel stronger — with the four words as examples rather than the list.

**13 of 24 posts have no `/topics/` link**, breaching the rule that every post links at least one topic landing page: `2026-rse-guidance-plain-english-summary`, `2026-rse-guidance-primary-schools`, `2026-rse-guidance-secondary-schools`, `complete-guide-rse-special-schools`, `parental-right-to-withdraw-rse-2026`, `reduce-withdrawals-sex-education-parent-consultation`, `rse-policy-checklist-2026`, `rse-policy-questions-governors-ask`, `sharing-nudes-sextortion-deepfakes-schools-2026`, `talking-to-boys-masculinity-misogyny-online-influencers`, `teaching-consent-beyond-no-means-no`, `teaching-hard-topics-when-not-a-specialist`, `teaching-puberty-primary-schools-guide`.

**`topicIds` is empty on all 24 posts.** In `src/lib/related-blog-posts.ts` that is the 10-point matching signal, with `secondaryTopicIds` at 5 — both dead site-wide. Related posts currently fall back to content tags (3) and target audience (2).

**Five posts have no content tags either**, so their related-posts block matches on `targetAudience` alone — every "School leaders" post scores an identical 2 and the three shown are arbitrary: `2026-rse-guidance-primary-schools`, `2026-rse-guidance-secondary-schools`, `reduce-withdrawals-sex-education-parent-consultation`, `rse-policy-checklist-2026`, `rse-policy-questions-governors-ask`. These are the newest and strongest posts on the site.

**Nine posts have no `featuredImageAlt`.** The schema defaults it to `''`, so the build passes and the hero ships with empty alt text: `british-museum…`, `drop-day-setup`, `rada-consent-for-film-and-tv`, `red-cross-angel-youth-group`, `rse-programme-more-than-drop-down-day`, `rse-send-practical-approaches`, `tate-modern-bedfellows-porn-literacy`, `teaching-porn-literacy…`, `work-out-consent-masculinity-athletes`.

**Em-dash density** clusters in older and partner-session posts — `complete-guide-rse-special-schools` and `rada-consent-for-film-and-tv` 13 each, `tate-modern…` 10, `british-museum…` 9. The September 2026 posts barely use them.

**The `editorial-policy.md` §3 review machinery — now implemented (14 Sept 2026).** `guidanceSensitive` (boolean, default `false`), `reviewBy` and `lastReviewedDate` (nullable ISO date strings) are now fields on the blog collection in `src/content.config.ts`. Before this they existed only in `docs/editorial-policy.md` and `docs/content-pipeline-plan.md`, and adding them to a post's frontmatter would have failed the build.

The defaults mean every existing post still validates untouched, so nothing is flagged until someone sets the field. **No post currently carries `guidanceSensitive: true` or a review date, and most of the site touches statutory guidance.** Populating them is outstanding work, not a completed step — §3 also asks that a review re-checks every cited URL for a 200 and for the content still saying what it said, which matters given the citation findings in Part 1.
