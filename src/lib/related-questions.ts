/**
 * Related question selection logic (section 5 of Build Spec).
 *
 * Priority:
 * 1. Other questions sharing the same primary granular Topic
 * 2. If fewer than 3, expand to questions with the same OtA category
 *
 * Cap at 5, exclude the current question.
 */
import type { Question, QuestionRef } from './types';

export function selectRelatedQuestions(
  current: Question,
  allQuestions: Question[],
  maxResults = 5
): QuestionRef[] {
  const results: QuestionRef[] = [];
  const seen = new Set<string>([current.id]);

  const toRef = (q: Question): QuestionRef => ({
    id: q.id,
    question: q.question,
    slug: q.slug,
    okayToAskCategory: q.okayToAskCategory,
    contentTags: q.contentTags,
  });

  // 1. Same primary topic
  if (current.topicIds.length > 0) {
    const primaryTopicId = current.topicIds[0];
    for (const q of allQuestions) {
      if (seen.has(q.id)) continue;
      if (q.topicIds.includes(primaryTopicId)) {
        results.push(toRef(q));
        seen.add(q.id);
        if (results.length >= maxResults) return results;
      }
    }
  }

  // 2. Same OtA category (fallback)
  if (results.length < 3 && current.okayToAskCategory) {
    for (const q of allQuestions) {
      if (seen.has(q.id)) continue;
      if (q.okayToAskCategory === current.okayToAskCategory) {
        results.push(toRef(q));
        seen.add(q.id);
        if (results.length >= maxResults) return results;
      }
    }
  }

  // 3. Same content tags (further fallback)
  if (results.length < 3 && current.contentTags.length > 0) {
    const tags = new Set(current.contentTags);
    for (const q of allQuestions) {
      if (seen.has(q.id)) continue;
      if (q.contentTags.some((t) => tags.has(t))) {
        results.push(toRef(q));
        seen.add(q.id);
        if (results.length >= maxResults) return results;
      }
    }
  }

  return results;
}
