/**
 * Topic illustration mapping.
 * Maps landing page slugs to SVG filenames in /images/topics/.
 * Used by C3 landing pages and topic card grids.
 */

const topicIllustrationMap: Record<string, string> = {
  'consent': 'Consent.svg',
  'contraception': 'Contraception.svg',
  'masculinity-and-misogyny': 'Masculinity and Misogyny.svg',
  'personal-safety': 'Personal Safety.svg',
  'lgbtq-inclusion': 'LGBT Inclusion.svg',
  'pornography-and-media-literacy': 'Pornography and Media Literacy.svg',
  'sex-and-the-law': 'Sex and the Law.svg',
  'fgm-and-harmful-practices': 'FGM and Harmful Practices.svg',
  'sex-and-intimacy': 'Positive Sexuality and Intimacy.svg',
  'online-safety': 'Online Safety.svg',
  'healthy-relationships': 'Healthy Relationships.svg',
  'abuse-exploitation-and-violence': 'Abuse and Exploitation.svg',
  'pregnancy-and-reproductive-health': 'Pregnancy and Reproductive Health.svg',
  'friendships': 'Friendship.svg',
  'families': 'Families.svg',
  'puberty': 'Puberty.svg',
  'mental-health-and-wellbeing': 'Mental Health and Wellbeing.svg',
  'stis-and-sexual-health': 'STIs and Sexual Health.svg',
  'body-image': 'Body Image.svg',
  'sexting-and-sharing-nudes': 'Online Safety.svg',
  'gender-stereotypes-and-discrimination': 'Gender.svg',
  'bodies-and-anatomy': 'The Body.svg',
  'self-esteem': 'Self Esteem.svg',
};

/**
 * Get the public URL path for a topic's illustration SVG.
 * Returns null if no illustration is mapped for the given slug.
 */
export function getTopicIllustrationPath(slug: string): string | null {
  const file = topicIllustrationMap[slug];
  return file ? `/images/topics/${encodeURIComponent(file)}` : null;
}
