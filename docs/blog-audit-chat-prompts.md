# Prompts for the follow-up chats

Copy one into a fresh Claude Code session in `~/Sites/tailor-site`.

**A note that applies to all of them, already included in each prompt below:**
the mechanical pass of 14 Sept 2026 deleted 31 sentences, so some sentences
quoted in the audit no longer exist in the posts. Every prompt tells the new
session to check the file rather than trust the quote.

---

## 1. The citation pass — four posts, one chat

> Four published blog posts in this repo carry publish-gate breaches under `docs/editorial-policy.md` §1. Fix them.
>
> Read first, in full: `docs/editorial-policy.md` (§1 especially) and Part 1 of `docs/blog-audit-2026-09-14.md`.
>
> The four posts:
> - `src/content/blog/teaching-porn-literacy-what-it-is-why-it-matters/index.mdx`
> - `src/content/blog/what-young-people-want-to-know-sex-relationships/index.mdx`
> - `src/content/blog/rse-send-practical-approaches/index.mdx`
> - `src/content/blog/rse-programme-more-than-drop-down-day/index.mdx`
>
> Between them they carry 12 placeholder citations (bare `http://` domain homepages standing in for named documents, all in Trusted resources lists) and 12 statistics with no source URL. `rse-send-practical-approaches` also states "There's no exemption, and there shouldn't be" about RSE being statutory, which flattens the parental right to request withdrawal from sex education — a SENCO repeating that to a parent would be wrong — and links the claim to Tailor's own blog rather than the DfE document.
>
> The house pattern to copy is in `src/content/blog/rse-policy-checklist-2026/index.mdx` and `src/content/blog/teaching-hard-topics-when-not-a-specialist/index.mdx`: the document named with its year, a deep link with a `#page=` anchor, and the obligation quoted rather than paraphrased. `src/content/blog/parental-right-to-withdraw-rse-2026/index.mdx` has the correct statement of the withdrawal position.
>
> For each unsourced statistic: find the real source, verify the figure actually says what the post claims, and hyperlink it at first mention. If you cannot verify a figure, say so and leave it flagged rather than linking something approximate — do not link a homepage or a search result as a substitute.
>
> Note: a mechanical pass on 14 Sept deleted 31 sentences across the blog, so some sentences quoted in the audit no longer exist. Check the file, not the quote.
>
> Run `npx astro build` when done and report the real exit status.

---

## 2. Rebuild: teaching-porn-literacy — one chat, this post only

> `src/content/blog/teaching-porn-literacy-what-it-is-why-it-matters/index.mdx` needs a method written into it. It currently has none.
>
> Read first, in full: `docs/Tailor_Blog_Writing_Rules.md`, `docs/editorial-policy.md`, and the entry for this post in `docs/blog-audit-2026-09-14.md` Part 2.
>
> The problem: the post says sessions should "focus on attitudes and assumptions", that "Ground rules matter", that distancing "helps", and that you should "start small". Those describe the conditions for good teaching. None is a move a teacher can make. There is no question to ask, no activity, no worked example of handling a wrong answer, and — in a post about pornography — nothing on what to do when a pupil discloses having seen or been shown something.
>
> The job: replace the "What good teaching looks like" section with the actual lesson. The opening question you put to a Year 10 class, the two or three assumptions you surface, what you say when a pupil says something graphic, and what you do on a disclosure. Let the two rationale sections shrink to make room — the post currently spends two full sections before any teaching content.
>
> Two constraints:
> - `src/content/blog/tate-modern-bedfellows-porn-literacy/index.mdx` contains a five-question set ("Who made this. Who's it aimed at. What's it selling. What's it leaving out. What would it be like if you took it as instructions for real life."). That is the closest thing to a usable spine that exists. Decide whether this post should carry it, reference it, or use something else — don't silently duplicate.
> - The opening quotation attributed to a teacher at a Tate Modern session is flagged NEEDS-AUTHOR-CHECK. Do not invent replacement anecdotes or first-person experience. Where a first-person observation would go, write the point without one and leave the gap — that material is Gareth's to add.
>
> Note: a mechanical pass on 14 Sept deleted 31 sentences across the blog; check the file rather than trusting quotes in the audit.
>
> This post also has outstanding citation breaches. If chat 1 has not run yet, flag them but leave them.

---

## 3. Rebuild: what-young-people-want-to-know — one chat, this post only

> `src/content/blog/what-young-people-want-to-know-sex-relationships/index.mdx` diagnoses a gap and gives the reader one action, which is a link out to another post. It also publishes four wrong statistics.
>
> Read first, in full: `docs/Tailor_Blog_Writing_Rules.md`, `docs/editorial-policy.md`, and this post's entry in `docs/blog-audit-2026-09-14.md` Part 2.
>
> ### The statistics — verified against the source on 14 September 2026
>
> Every figure below was checked by extracting the text of the [Sex Education Forum Young People's RSE Poll 2024 report PDF](https://www.sexeducationforum.org.uk/sites/default/files/field/attachment/Young%20Peoples%20RSE%20Poll%202024%20-%20Report.pdf). **Do not re-derive these from search results — use the report.**
>
> **Correct as published, keep them:**
> - 50% rated their RSE good or very good. The report gives 50.05% for 2024 against 40.42% (2022), 35.33% (2021) and 41.10% (2019), and calls it "the highest percentage since polling began". The post's "highest since polling began" is sound.
> - 43% felt personally represented. Report: "Only 43% of young people agree that they felt personally represented and included in the RSE that they received at school."
> - 30% social media ahead of school at 25% for LGBT+ information. Report, verbatim: "for learning about LGBT+ issues, young people are more likely to turn to social media (30%) ahead of school (25%)".
>
> **Wrong, must be fixed:**
> - **"not learning enough about pornography (58%)" — this figure does not exist.** The same bogus 58% was found and removed from the porn literacy post on 14 Sept. The report says: "Over 1 in 5 respondents (23%) learnt nothing at all about pornography at school, with a combined 49% learning nothing at all or not enough** about pornography."
> - **"LGBTQ+ relevant information (54%)" — wrong.** The report gives "38% learnt nothing at all or not enough** about sexual orientation, and 44% learnt nothing at all or not enough about gender identity". There is no 54%.
> - **"healthy relationships (54%)" — not in the report's coverage-gaps list at all.** That list covers sexual pleasure (60%), pornography (23%/49%), power imbalances (49%), sexual orientation (38%), gender identity (44%), sexual health services (46%), HIV (40%) and STIs (35%). Either find the real figure in the report or drop the item.
> - **"Only 46% learned about how to access local sexual health services" — this states the opposite of the finding.** The report says "46% learnt nothing at all or not enough** about how to access local sexual health services". 46% is the proportion who did *not* learn enough. Separately the report notes 49% learnt all they needed to. As published the post reverses the meaning.
>
> `src/content/blog/teaching-porn-literacy-what-it-is-why-it-matters/index.mdx` now carries verified wording for the pornography figures — reuse its phrasing rather than inventing new wording.
>
> Also still outstanding: the three Trusted resources entries are placeholder `http://` homepages (editorial-policy §1.1), and "Anonymous question boxes… are one of the simplest and most effective tools in RSE" is a bare superlative with nothing behind it — attribute it or drop the claim.
>
> ### The rewrite
>
> The post's real asset is the themed clusters of what young people actually ask. Turn that into something a PSHE lead can use — what the clusters imply for a scheme of work, which ones schools systematically under-teach, what you do with a question you cannot answer in the room. The final section is currently the thinnest in the piece and is exactly where it should deepen.
>
> Handled well and worth preserving: no pupil question is reproduced verbatim, only themed paraphrase. Keep it that way — verbatim questions from a real question box carry identification risk.
>
> ### Constraints
>
> - "We've had over 150 questions so far" is load-bearing for the post's authority and cannot be verified from the repository. Check it against the live Okay to Ask total or ask Gareth; do not restate it on trust.
> - Do not invent first-person experience. Ask Gareth for real material rather than filling gaps.
> - A mechanical pass on 14 Sept deleted 31 sentences across the blog — check the file rather than trusting quotes in the audit.
> - Run `npx astro build` and report the real exit status. Commit when done; do not push without asking.

## 4. Rewrite: work-out-consent-masculinity-athletes — one chat, this post only

> `src/content/blog/work-out-consent-masculinity-athletes/index.mdx` is a write-up of a real project that teaches the reader nothing they can do.
>
> Read first: `docs/Tailor_Blog_Writing_Rules.md` and this post's entry in `docs/blog-audit-2026-09-14.md` Part 2.
>
> The post's own method section says there wasn't a method: "The project didn't start with a fixed curriculum. The team shaped the sessions around what was emerging from the group as we went." Roughly 65% of it is who was involved, 10% method, 25% reflection.
>
> The job: one reflective-dialogue session written out end to end — the opening question, how the group was set up, the rule about not resolving, the handoff between the art activity and the talking — plus a paragraph on what transfers from a university sports team to a Year 11 form group, which is the only reason a PSHE lead would read this.
>
> If that material isn't available, say so plainly rather than padding: the honest alternative is to drop the "Our Work" educational framing and let it be a project record.
>
> Constraints: do not invent the session content. The participant quote is the only directly quoted participant in the partner series and should be confirmed as cleared for use. Do not invent first-person experience.

---

## 5. Rewrite: rada-consent-for-film-and-tv — one chat, this post only

> `src/content/blog/rada-consent-for-film-and-tv/index.mdx` contains this sentence: "If you're directing that scene, here is how you set it up so that both performers can do their best work without being asked to choose between their boundaries and their reputation."
>
> It then doesn't say how. That is the one sentence in the post a headteacher could translate into a school, and it's empty.
>
> Read first: `docs/Tailor_Blog_Writing_Rules.md` and this post's entry in `docs/blog-audit-2026-09-14.md` Part 2.
>
> The job: cash that cheque. One concrete setup sequence — the check-in, the order it happens in, what gets agreed before anyone is in the room. Then cut into the industry-history section ("Before intimacy coordination", roughly 25% of the post) to make room, since it teaches a school nothing.
>
> The post is currently about 70% context to 30% usable, and the reflective closing section is its most useful part, which means it's upside down.
>
> Constraints: do not invent the RADA session content or dialogue. Do not invent first-person experience.

---

## 6. The partner-session series — five thought pieces, one chat

> **Read the "Correction" section of `docs/blog-audit-2026-09-14.md` before anything else.** The audit originally judged these five posts as guides that fail to deliver a method. That was wrong. They are thought pieces — reflective writing about work Tailor did — and the audit's "what can a reader do on Monday?" verdicts for all five are void. Do not ask them to carry transferable practice, do not criticise their venue-to-practice ratio, and do not add method sections.
>
> `work-out-consent-masculinity-athletes` is **out of scope** — closed by decision on 14 Sept 2026, nothing further to do to it.
>
> The four in scope, in `src/content/blog/`: `british-museum-no-sex-please-anonymous-questions`, `rada-consent-for-film-and-tv`, `red-cross-angel-youth-group`, `tate-modern-bedfellows-porn-literacy`.
>
> Read `docs/Tailor_Blog_Writing_Rules.md` and `docs/editorial-policy.md` §1.
>
> ### 1. The safety item — the only one that is not stylistic
>
> `red-cross-angel-youth-group` names the organisation, the project, the nickname, the neighbourhood, the weekday and the age range: "Every Tuesday evening, the British Red Cross runs a youth group at its office near Angel… young unaccompanied refugees and asylum seekers in London, aged roughly fourteen to twenty-one." No individual is identified and nothing breaches §1 as written, but a recurring time and place for a group of unaccompanied minors is more locational precision than the writing needs. Dropping either the weekday or the location costs the piece nothing. Raise with Gareth that it also wants Red Cross sign-off either way.
>
> ### 2. Two unsourced quantified generalisations
>
> These survive the genre correction — editorial-policy §1.3 applies to a reflective piece as much as a guide.
>
> - British Museum: "Most people over thirty had no sex education that contained the word consent as we now understand it." and "Most people of any age have unanswered questions they've never had permission to ask out loud."
> - Tate Modern: "It isn't how most people first encounter pornography. Most people encounter it accidentally, usually young, usually with no framework at all."
>
> Cite them, narrow them to what was actually observed in those rooms, or cut them. Do not stretch a source to fit.
>
> ### 3. Residual voice items the mechanical pass did not reach
>
> That pass removed throat-clearing openers and closing payoffs only. Still present:
>
> - Three-item em-dash lists — Red Cross's "because of language, because of care status, because of what's happening at home" (the most important sentence in that post, and the one you least want reading as a pattern); RADA's "kissing, partial nudity, simulated sex"; Tate's "a slightly nervy energy at the start, some deflection through humour, some very sharp observations once the room warmed up".
> - "It's not X; it's Y" — twice in Tate, twice remaining in RADA.
> - Filler intensifiers: "genuinely" twice in RADA, once in Tate, twice in British Museum.
>
> ### 4. The sameness problem
>
> All five run one shape: intro naming the partner, who was in the room, what the sessions looked like, a section headed "What I took away" (or "What I took from it" / "What the two sessions told me"), then an identically constructed CTA. Read consecutively they sound like one filled-in form. Summary-paragraph headings are on the avoid list, and three of them open that section with a numbered preview ("Two things. Firstly…").
>
> This is a legitimate criticism of reflective writing — it is about the writing being formulaic, not about it failing to instruct. Vary the shape. The fix is usually to delete the heading and let the last insight sit as the final body paragraph.
>
> ### Constraints
>
> Do not invent session content or first-person experience — ask Gareth. Check the files rather than trusting quotes in the audit; 31 sentences were deleted on 14 Sept. Run `npx astro build` and report the real exit status. Commit when done; do not push without asking.

## 7. Two structural decisions, plus the topic taxonomy — one short chat — **DONE, 14 Sept 2026**

**Settled. Do not re-run this prompt.** The answers, the reasoning and what was applied are
written up as D1–D3 in `docs/blog-audit-2026-09-14.md` ("Decisions settled"). In short:
D1 the plain-English post was retitled as the review it is and ten inbound links reworded;
D2 the drop-day line follows `/services/drop-days`, and `rse-programme` gets reframed —
carried into prompt 9 below; D3 the 11 posts keep empty `topicIds`, and `contentTags` were
added to the five that had none. The original prompt is kept below for the record.


> Three decisions about the Tailor blog that sit above any single post. Read `docs/blog-audit-2026-09-14.md` (the status section and cross-cutting patterns) first, then work through these with me — ask rather than deciding alone, since each changes what readers see.
>
> **1. `2026-rse-guidance-plain-english-summary` is a review method wearing a summary's title.** It's titled "What the 2026 RSE guidance means for your school now"; its five headings are Start with the teaching / What pupils do with the information / Parents need to see the materials / Read sensitive sections together / Give the review an owner. No section summarises what changed. Meanwhile `rse-policy-checklist-2026` links to it as "the full picture of what changed", and the primary and secondary guidance posts are where that picture actually lives. Retitle, rewrite, or repoint the inbound links — but the decision comes first, because the links change either way.
>
> **2. Two posts argue opposite sides.** `rse-programme-more-than-drop-down-day` argues drop-down days fail as a programme backbone. `drop-day-setup` closes by selling one. A reader who finds both sees Tailor on both sides. One sentence in `drop-day-setup` positioning the drop day as supplementary would fix it, and that's already the other post's stated position — but confirm that's the line Tailor wants to take.
>
> **3. Eleven posts have no `topicIds` and eight have no `/topics/` link.** They're the policy, governance, guidance and SEND posts. There is no landing page for "policy", "governance" or "SEND" — the 23 topics are content topics for young people. So either these posts legitimately have no topic, or the taxonomy needs new entries. Note that `src/lib/related-blog-posts.ts` scores primary topic at 10 and secondary at 5, and five of these posts have no content tags either, so their related-posts block currently matches on `targetAudience` alone and shows arbitrary results. Those five are the newest and strongest posts on the site.

---

## 8. Make the review fields editable in the studio post editor — one chat, no blog content

> `src/content.config.ts` gained three fields on the blog collection that `src/lib/studio/schema.js` does not know about: `guidanceSensitive` (boolean), `reviewBy` and `lastReviewedDate` (nullable ISO date strings). `CLAUDE.md` says the two schemas must mirror each other. Close the gap.
>
> Read first, in full: `docs/POST-EDITOR.md`, the "Post editor (`/studio`)" section of `CLAUDE.md`, and §3 of `docs/editorial-policy.md` (which is why these fields exist).
>
> **What is already true, verified — do not re-derive it.** The editor does *not* currently strip these fields. `serialiseFile` in `src/lib/studio/frontmatter.js` re-emits any field it wasn't asked to change from its original source verbatim, so a post carrying all three round-trips byte-for-byte through a save today. The gap is narrower than data loss: the fields survive, but they cannot be set or changed from the editor, so populating them per editorial-policy §3 currently means hand-editing the file.
>
> The job:
> - Add all three to `EDITABLE_FIELDS` in `src/lib/studio/schema.js` and to `FIELD_ORDER` in `src/lib/studio/frontmatter.js`, positioned to match `src/content.config.ts` (they sit after `dateModified`, before `author`).
> - `reviewBy` and `lastReviewedDate` are dates and the `date` kind already exists — these should be small.
> - `guidanceSensitive` is a boolean and there is **no boolean field kind**. The existing kinds are `enum | date | url | list | text | textarea`. Adding one means a validator branch in `validatePatch`, an emitter that writes an unquoted `true`/`false` (not a string), a control in the editor UI, and a round-trip test case. Consider whether a new `boolean` kind or a two-option `enum` is the better fit, and say which you chose and why.
> - Extend `tests/studio-roundtrip.test.mjs` to cover all three. At minimum: setting each from empty, changing each, clearing the nullable dates back to null, and confirming a post that carries them is still rewritten byte-for-byte when untouched.
>
> Run `npm test` and report the real exit status, not a filtered tail. Then run `npx astro build` and report its exit status too.
>
> Touch nothing under `src/content/blog/`. This chat is code only, and is safe to run alongside any of the content chats.

---

## 9. Reframe rse-programme, and fix its out-of-date Ofsted claims — one chat, this post only

> `src/content/blog/rse-programme-more-than-drop-down-day/index.mdx` needs two things doing together: its description of Ofsted inspection is out of date, and its central argument contradicts Tailor's own service page. They interact, because the out-of-date material is what the argument leans on.
>
> Read first, in full: `docs/Tailor_Blog_Writing_Rules.md`, `docs/editorial-policy.md` §1, the **D2** entry under "Decisions settled" in `docs/blog-audit-2026-09-14.md`, cross-cutting pattern 4 in the same document, and `src/pages/services/drop-days.astro`.
>
> ### Part 1 — the factual error, do this first
>
> The post describes an Ofsted framework that no longer exists. Verified on 14 Sept 2026 by fetching <https://www.gov.uk/government/publications/education-inspection-framework-eif/education-inspection-framework-for-use-from-november-2025> (HTTP 200, page updated 9 September 2025, "For use on inspections from 10 November 2025"):
>
> - The post says "The inspection methodology includes deep dives". The phrase "deep dive" does not appear anywhere in the current framework, in any casing.
> - The post names the judgement areas "quality of education", "personal development" and "behaviour and attitudes". None is a current evaluation area name for schools. The framework's term is now "evaluation areas", and for schools they are: safeguarding, inclusion, curriculum and teaching, achievement, attendance and behaviour, personal development and wellbeing, early years (where applicable), post-16 provision (where applicable), leadership and governance.
> - Since November 2025 Ofsted no longer gives an overall effectiveness grade, and the scale is five points — Exceptional, Strong standard, Expected standard, Needs attention, Urgent improvement. Safeguarding is graded met / not met.
> - "Ofsted doesn't grade RSE as a separate subject" is uncited and should be checked against the current framework rather than restated.
>
> **One caveat to check rather than assume:** the framework page defers methodology to separate "inspection toolkits" and "operating guides" per remit. "Deep dive" may survive in the school inspection toolkit even though it is absent from the framework. Fetch the school toolkit, linked from the framework page, before wording the correction.
>
> This is the most actionable wrong thing on the blog — a school leader could plan an inspection response around it.
>
> ### Part 2 — the reframe
>
> **The decision is already made — implement it, do not reopen it.** `/services/drop-days` sells the concentrated day as a legitimate delivery model ("Some schools prefer to concentrate their RSE delivery into a single, high-quality day rather than spread it thinly across the year"). This post says the opposite ("as the backbone of your RSE programme? They don't work"). Gareth's position, given on 14 Sept 2026: for most schools the drop day **is** their RSE, and the writing has to meet that reader. The service page is the line.
>
> Keep the guidance-backed argument — the 2026 guidance expects secondary RSE to provide clear progression from primary, and a single day cannot carry that alone. Change what the post does with it: from *this doesn't work* to *here is how to make the day carry weight, and the smallest thing to put around it*. The reader running one drop day a year should finish with something to do, not a verdict on their programme.
>
> This also closes the cross-cutting pattern 4 good-faith breach ("here is what most schools currently do, and it isn't enough"), sharpest under the "Why one-off sessions don't stick" heading.
>
> Note the post already contains "the external input should supplement your programme, not replace it" — that sentence is not the fix and was considered and rejected as one.
>
> Add a cross-link to `src/content/blog/drop-day-setup/index.mdx`, the practical companion piece, which currently takes no position on the drop day's role. `drop-day-setup` itself needs no sentence added — see D2 for why.
>
> ### Part 3 — two claims still unsourced
>
> - "A spiral curriculum… is what the evidence supports" — cite it or drop the appeal to evidence.
> - "Most RSE in England is delivered by form tutors or PSHE teachers who haven't had specialist training" — uncited, and it also breaches the good-faith rule by attributing a shortcoming to schools. Handle both faults.
>
> ### Already done — do not redo
>
> This post's Ofsted 2021 review citation and its Sex Education Forum 2024 poll figure (57%) were sourced and verified on 14 Sept, and its three placeholder Trusted resources links were replaced. Leave all of those alone. The earlier coordination note about prompt 1 owning this file is spent — prompt 1's work here is finished.
>
> ### Finally
>
> This post is exactly the case `docs/editorial-policy.md` §3 exists to catch: guidance that moves under published text. The blog schema now carries `guidanceSensitive`, `reviewBy` and `lastReviewedDate`, and the studio editor can set them. No post yet does. Propose setting them here, and raise with Gareth whether the other guidance-sensitive posts should follow.
>
> Do not invent first-person experience. A mechanical pass on 14 Sept deleted 31 sentences across the blog, so some sentences quoted in the audit no longer exist — check the file, not the quote. Run `npx astro build` and report the real exit status. Commit when done; do not push without asking.

---

## 10. Set the periodic-review fields across the guidance-sensitive posts — one chat, frontmatter and one policy edit

> `docs/editorial-policy.md` §3 requires posts whose underlying landscape can change to carry `guidanceSensitive: true`, a `reviewBy` date, and `lastReviewedDate` when reviewed. The schema and the studio editor both support them since 14 Sept 2026. Exactly one post sets them.
>
> Read first: `docs/editorial-policy.md` §3, and `src/content/blog/rse-programme-more-than-drop-down-day/index.mdx`, which is the worked example — `guidanceSensitive: true`, `lastReviewedDate: "2026-09-14"`, `reviewBy: "2027-03-14"`.
>
> ### The candidate list
>
> 18 of the 24 published posts cite statutory or legal sources (DfE assets, gov.uk, Ofsted, KCSIE, UKCIS or the Sexual Offences Act). `rse-programme-more-than-drop-down-day` is already done, leaving **17**:
>
> `2026-rse-guidance-plain-english-summary` (11 refs), `2026-rse-guidance-primary-schools` (11), `2026-rse-guidance-secondary-schools` (7), `complete-guide-rse-special-schools` (3), `consulting-parents-rse-policy-2026` (10), `parental-right-to-withdraw-rse-2026` (17), `reduce-withdrawals-sex-education-parent-consultation` (12), `rse-policy-checklist-2026` (33), `rse-policy-questions-governors-ask` (5), `rse-send-practical-approaches` (11), `sharing-nudes-sextortion-deepfakes-schools-2026` (16), `talking-to-boys-masculinity-misogyny-online-influencers` (8), `teaching-consent-beyond-no-means-no` (3), `teaching-hard-topics-when-not-a-specialist` (6), `teaching-porn-literacy-what-it-is-why-it-matters` (2), `teaching-puberty-primary-schools-guide` (4), `what-young-people-want-to-know-sex-relationships` (8).
>
> The six with no statutory citation are the partner-session write-ups plus `drop-day-setup`. Check rather than assume — a post can be guidance-sensitive without a hyperlink.
>
> ### Two decisions to settle with Gareth before editing
>
> **1. Stagger the dates.** Seventeen posts all dated `2027-03-14` means seventeen reviews due in one week, which is how a review date becomes something people ignore. Propose a staggering principle and get it agreed. A sensible basis is volatility of the underlying source rather than an arbitrary spread:
>
> - Fastest-moving, shortest interval: anything resting on the Ofsted framework or the school inspection toolkit (the toolkit reached v2.0 in June 2026), and anything resting on criminal or online-safety law — `sharing-nudes-sextortion-deepfakes-schools-2026` especially.
> - Slower: posts resting on the RSHE statutory guidance, which only came into force on 1 September 2026 and is unlikely to move soon.
>
> Do not invent a schedule unilaterally — put the principle to Gareth, then apply it.
>
> **2. Amend `docs/editorial-policy.md` §3.** It says a guidance-sensitive post is "given a `reviewBy` date six months from publish". The practice established on `rse-programme` is six months from **review**, so the clock restarts each time someone actually looks. That is the more useful rule and the doc should be amended to match, rather than left contradicting what the posts do. Make the edit as part of this pass.
>
> ### The work
>
> Frontmatter only — do not edit prose. For each post: `guidanceSensitive: true`, `reviewBy` per the agreed schedule, and `lastReviewedDate` only where a genuine review has happened. **Do not set `lastReviewedDate` to today for a post nobody has reviewed** — that would assert a check that did not occur, which is the quiet kind of false record §3 exists to prevent. Posts reviewed on 14 Sept 2026 (the audit pass) can carry that date; the rest should leave it null until reviewed.
>
> §3 also asks that a review re-checks every cited URL for a 200 and for the content still saying what it said. That is not part of this pass — this pass sets the flags. Say so plainly in your report so nobody later reads `lastReviewedDate` as meaning the URLs were checked.
>
> Run `npm test` and `npx astro build`, and report the real exit statuses. Commit when done; do not push without asking.
