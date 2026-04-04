import type { BlogPost } from './types';

/**
 * Select 2–3 related blog posts for a given post.
 * Priority: same primary topic → same content tags → same target audience.
 */
export function getRelatedBlogPosts(
  current: BlogPost,
  allPosts: BlogPost[],
  max = 3
): BlogPost[] {
  const others = allPosts.filter((p) => p.id !== current.id);
  const scored = others.map((p) => {
    let score = 0;

    // Same primary topic (landing page relation)
    const currentTopicIds = new Set(current.topicIds);
    for (const tid of p.topicIds) {
      if (currentTopicIds.has(tid)) score += 10;
    }

    // Same secondary topics
    const currentSecondary = new Set(current.secondaryTopicIds);
    for (const tid of p.secondaryTopicIds) {
      if (currentSecondary.has(tid)) score += 5;
    }

    // Shared content tags
    const currentTags = new Set(current.contentTags);
    for (const tag of p.contentTags) {
      if (currentTags.has(tag)) score += 3;
    }

    // Same target audience
    if (p.targetAudience && p.targetAudience === current.targetAudience) {
      score += 2;
    }

    return { post: p, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((s) => s.post);
}
