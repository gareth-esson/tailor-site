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

> `src/content/blog/what-young-people-want-to-know-sex-relationships/index.mdx` diagnoses a gap and gives the reader one action, which is a link out to another post.
>
> Read first, in full: `docs/Tailor_Blog_Writing_Rules.md`, `docs/editorial-policy.md`, and this post's entry in `docs/blog-audit-2026-09-14.md` Part 2.
>
> The job: the post's real asset is the themed clusters of what young people actually ask. Turn that into something a PSHE lead can use — what the clusters imply for a scheme of work, which ones schools systematically under-teach, what you do with a question you can't answer in the room. The final section is currently the thinnest in the piece and is where it should deepen.
>
> Handled well and worth preserving: no pupil question is reproduced verbatim, only themed paraphrase. Keep it that way — verbatim questions from a real question box carry identification risk.
>
> Constraints:
> - Eight statistics in this post have no source URL and its three Trusted resources are placeholder homepages. That is a publish-gate breach (see chat 1). Do not add more unsourced figures.
> - "We've had over 150 questions so far" is load-bearing for the post's authority and unverifiable from the repo. Check it against the live Okay to Ask total or flag it; don't restate it on trust.
> - Do not invent first-person experience.
>
> Note: a mechanical pass on 14 Sept deleted 31 sentences across the blog; check the file rather than trusting quotes in the audit.

---

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

## 6. The partner-session series — five posts, one chat

> Five published posts are first-person write-ups of sessions Tailor delivered with partner organisations. They run one visible template and it is not working.
>
> Read first, in full: `docs/Tailor_Blog_Writing_Rules.md` and the "Partner session write-ups" section plus pattern 7 in `docs/blog-audit-2026-09-14.md`.
>
> The five:
> - `british-museum-no-sex-please-anonymous-questions`
> - `rada-consent-for-film-and-tv`
> - `red-cross-angel-youth-group`
> - `tate-modern-bedfellows-porn-literacy`
> - `work-out-consent-masculinity-athletes`
>
> The template: intro naming the partner → why they asked / who was in the room → what the sessions looked like → a closing section headed "What I took away" → an identically shaped CTA. Read consecutively they sound like one filled-in form.
>
> Two structural faults. The fourth slot is a summary-paragraph heading, which the voice rules ban. The third slot describes how the room felt rather than what happened in it, in three of the five.
>
> The job: differentiate them. Each post should carry the transferable practice at its centre rather than the venue. Specific targets from the audit:
> - British Museum: the question-box method is nearly usable but never gives the sift criteria or what happens when a disclosure comes out of the box. In a school those two gaps are the whole risk of the format.
> - Red Cross: the strongest of the five. Its audit paragraph asks the reader to find who on their roll is getting less, then stops at the door of the answer. Also carries more locational precision about a group of unaccompanied minors than the story needs — consider dropping the weekday or the location, and it wants Red Cross sign-off either way.
> - Tate Modern: the five-question set is the most usable artefact in the series and is buried in a definitional aside. Promote it, and show how you run it without showing the material.
> - RADA and Work Out: see chats 4 and 5 — if those have run, don't redo them.
>
> Note: a mechanical pass on 14 Sept already removed the throat-clearing openers and closing payoffs from these posts, so sentences quoted in the audit may no longer exist. Check the files.
>
> Do not invent session content or first-person experience.

---

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
