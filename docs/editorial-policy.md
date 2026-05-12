# Tailor Education editorial safety policy

**Status:** active rules.
**Last updated:** 2026-05-12.
**Owner:** Gareth Esson.

## Scope and what this doc isn't

This document covers safety, safeguarding, and legal-risk rules for Tailor's content. It is the rulebook the AI Red Team safeguarding review enforces (see §2).

**Voice, tone, sentence shape, structural conventions, and stance live elsewhere:**

- **Blog voice** (Gareth's first-person voice): [`docs/Tailor_Blog_Writing_Rules.md`](Tailor_Blog_Writing_Rules.md)
- **Site copy voice** (organisation "we"): [`docs/Tailor_Site_Copy_Writing_Rules.md`](Tailor_Site_Copy_Writing_Rules.md)
- **Per-channel format requirements** (newsletter, LinkedIn announcements + follow-ups, Instagram carousels): [`docs/content-pipeline-plan.md`](content-pipeline-plan.md) §5

Those documents are authoritative for everything they cover. This doc complements them — it covers the safety / risk rules they don't, and it specifies the Red Team review pass that enforces all three.

If a rule appears in both this doc and one of the voice docs, the voice docs win on phrasing and the safety doc wins on hard-block enforcement (e.g., the voice docs say "don't invent composite scenarios"; this doc treats fabrication as a block-level violation).

---

## 1. Hard rules — block on publish

Severity in the Red Team review: `block`. A draft containing one of these patterns does not ship without an explicit operator override accompanied by a fix.

### 1.1 Statutory and legal claims

- ❌ Never state a legal certainty about UK education law without citing the current source as a hyperlink in the prose, with the document name and year.
- ❌ Never cite the DfE, Ofsted, KCSIE, RSHE statutory guidance, or any statutory framework without a URL to the specific document being referenced.
- ❌ Never make claims about what schools are "required to" do without quoting the source language.
- ❌ Never simplify statutory guidance to the point where a head teacher would act on the simplification and be wrong. If a rule has exceptions, name them or rephrase to avoid implying universality.

The Tailor voice rules say "be specific (name the document, give the year) but don't turn the post into a policy summary." This policy adds: **specificity is non-negotiable**. The voice doc covers the shape of the citation; this doc makes it a publish gate.

### 1.2 Medical and clinical advice

- ❌ Never give medical advice, even hedged. Direct readers to the NHS, Brook, the school nurse, or their GP for anything clinical.
- ❌ Never recommend specific contraceptive methods, drugs, or treatments as "the right choice." Explain what exists; let the reader make the call with their own clinician.
- ❌ Never make claims about mental-health intervention efficacy. Naming a service (e.g., Childline, Samaritans) is fine; ranking interventions is not.

### 1.3 Fabrication

- ❌ Never invent a classroom scenario and present it as real.
- ❌ Never put words in the mouth of a teacher, head teacher, parent, or student that they didn't say.
- ❌ Never attribute experiences to "schools we've worked with" or "one teacher told us" without a real source. If the example is composite or anonymised, say so explicitly. "I've seen variations of this in several schools" is fine. "A teacher in Manchester told us last term…" with no actual teacher is not.
- ❌ Never cite a statistic without its source URL.

The site-copy voice rules treat this as a stance issue ("ground specifics in real failure modes that a teacher would recognise"). This policy treats the inverse — fabricated specifics — as a block-level publish violation. Both apply.

### 1.4 Libel and defamation risk

- ❌ Never name a specific school, multi-academy trust, head teacher, or individual in a negative light without certainty about the facts and willingness to defend the statement legally.
- ❌ Never imply specific organisations are doing something wrong without naming the evidence (named report, regulator finding, public statement quoted in context).
- ❌ Never quote a source out of context to make them appear to support a position they don't.

### 1.5 Age-of-consent and criminal-law statements

- ❌ Never state age of consent or related criminal-law thresholds as a simple number without addressing the immediate complications: close-in-age provisions where they apply, abuse-of-position-of-trust rules, the difference between age of consent and legal ages for related activities (buying contraception, viewing pornography, etc.), the distinction between criminality and a school's safeguarding response.

Plain "the age of consent in England is 16" is technically true and practically misleading. Never publish it as a standalone fact in a Tailor post.

---

## 2. The Red Team safeguarding review

After Phase 1 generates a draft and **before** the draft is surfaced to Gareth, a separate Claude API call runs as the safeguarding reviewer. This is the AI enforcement of the rules above.

### 2.1 Why a separate Claude call

- Different system prompt = different headspace. A model in "be helpful and write well" mode is poor at adversarial review of its own output.
- The pipeline order is `Draft → Safeguarding Review → Surface to operator (with flags) → Operator edits`. Easier to debug, easier to swap models per step.
- Cost is negligible: drafting roughly 8–15k tokens; review roughly 3–5k. Maybe 8 pence per post.

### 2.2 The review prompt — context it loads

The prompt at `prompts/safeguarding-review.md` in the GDH SEO repo loads, in this order:

1. **The role**: *"You are Tailor Education's safeguarding officer reviewing a draft blog post before it reaches the editor."*
2. **The safety rules**: full contents of this file.
3. **The voice rules** for the relevant content type (blog → `Tailor_Blog_Writing_Rules.md`; site copy → `Tailor_Site_Copy_Writing_Rules.md`).
4. **The draft itself.**

The reviewer is asked to enforce safety rules at `block` severity, voice rules at `concern` severity. Voice issues never block publish — they're advisory. Safety violations do.

### 2.3 The review prompt — what it returns

For each potential issue, the reviewer outputs JSON:

```json
{
  "lineReference": "line 42",
  "severity": "info" | "concern" | "block",
  "rule": "<which policy rule or voice-doc heading>",
  "issue": "<one sentence>",
  "suggestedRewrite": "<optional>"
}
```

Severity guidance for the reviewer:

- **`block`**: legal / medical / safeguarding violation per §1 above. Libel risk. Fabricated lived-experience. Statutory claim without citation. Age-of-consent statement without nuance.
- **`concern`**: voice-rule violation per the relevant `Tailor_*_Writing_Rules.md` doc. Stack of `We [verb] [object]` sentences. Em-dash overuse. Filler intensifiers. Balanced triplets. Bold labels inside paragraphs. Throat-clearing opener. Stealth punchdown. Anything from the "things to avoid" sections of the voice docs.
- **`info`**: minor — phrasing that could be punchier, a suggested internal link missing, a glossary term that could be linked.

The reviewer also returns:

- **`claimsToVerify`**: list of factual claims the editor should fact-check before publishing, with the source URL where available.
- **`missingCitations`**: list of statements that need a source URL and don't have one.
- **`topicClusterFit`**: does this draft strengthen its declared `primaryTopic`? If not, why not?
- **`voiceConsistency`**: short note on whether the draft sounds like one person wrote it start to finish (the read-aloud test from the voice docs).

### 2.4 What happens to the output

Surfaced in Content Studio next to the draft as a sidebar. Each flag has a "dismiss" button (operator judgement is final) and a "rewrite using suggestion" button. The draft itself is not modified automatically. The operator can accept, edit, or ignore each suggestion.

`block`-severity flags that the operator dismisses without rewriting are recorded in the audit log for that post.

---

## 3. Periodic review

Posts that touch statutory guidance, KCSIE, Ofsted, RSHE, mental-health intervention, age-of-consent, online-safety law, or any topic where the underlying landscape can change are flagged in frontmatter with `guidanceSensitive: true` and given a `reviewBy` date six months from publish.

GDH SEO's monthly Tailor report includes a "Posts due for review this month" section. When a post hits its review date:

1. Re-run the Red Team review against the current published version.
2. Re-check every URL cited in the post — `200` response, content still says what it said when published.
3. Update the post's `lastReviewedDate` field on completion and set the next `reviewBy`.

If a statutory document the post references has been superseded, either update the post in place (with `lastReviewedDate` bumped) or add a banner directing the reader to the new guidance, with a note explaining when and why.

---

## 4. Changelog

- **2026-05-12 v0.2**: Rewrote to be a safety-focused complement to the existing `Tailor_Blog_Writing_Rules.md` and `Tailor_Site_Copy_Writing_Rules.md` docs, after Gareth flagged that the v0.1 draft duplicated and partly contradicted the voice rules that already existed. Removed the speculative voice rules section, removed the invented political-third-rails section, kept the safeguarding hard rules and the Red Team review spec.
- **2026-05-12 v0.1**: Initial draft. Superseded.
