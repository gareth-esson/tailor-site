/**
 * Sitewide brand / organisation / founder constants.
 *
 * Single source of truth for everything Schema.org, OG, footer, and SEO
 * boilerplate needs. Edit values below — every page reads from here.
 *
 * Fields marked TODO are gaps where the public data isn't currently
 * known. Filling them in lifts E-E-A-T signals (especially for the
 * YMYL category Tailor publishes in). Order of priority:
 *   1. founder.linkedIn — Person.sameAs is the highest-leverage gap.
 *   2. organisation.companyNumber — required for the footer CIC line.
 *   3. organisation.telephone — adds NAP completeness.
 */

export const site = {
  url: 'https://tailoreducation.org.uk',
  brand: 'Tailor Education',
  defaultDescription:
    'Expert RSE resources, training and support for schools — from Tailor Education and Okay to Ask.',
  /** Used in <html lang="…">. Kept as plain "en" because Pagefind 1.4.0
   *  silently ignores BCP47 regional variants ("en-GB" → 0 pages indexed).
   *  Locale precision lives in og:locale and the WebSite schema's
   *  inLanguage field, which is where Google actually reads it. */
  locale: 'en',
  /** og:locale uses underscore form. */
  ogLocale: 'en_GB',
  /** Schema-level locale signal — accepts BCP47 regional variants. */
  schemaLocale: 'en-GB',
} as const;

/**
 * Files that are guaranteed to exist in /public/assets and can be
 * safely referenced from JSON-LD without a 404. See public/assets/.
 */
export const assets = {
  /** Used for Organization.logo. PNG/JPG required by Google logo guidance,
   *  ≥112×112, on white. */
  logo: '/assets/tailor-og-default.png', // best available right now; ideally a dedicated 1200x630-ish logo PNG.
  /** Default OG image — confirmed 1200×630. */
  ogDefault: '/assets/tailor-og-default.png',
  ogDefaultWidth: 1200,
  ogDefaultHeight: 630,
} as const;

export const organisation = {
  name: 'Tailor Education',
  legalName: 'Tailor Education CIC',
  url: site.url,
  logo: `${site.url}${assets.logo}`,
  email: 'hello@tailoreducation.org.uk',
  telephone: '+443302237740',
  /** Same number formatted for display in the footer. */
  telephoneDisplay: '0330 223 7740',
  /** TODO — Companies House CIC company number (e.g. "12345678"). */
  companyNumber: null as string | null,
  /** Loose UK signal; tighten with a registered address line if helpful. */
  areaServed: 'GB',
  /** TODO — incorporation date if known (YYYY or YYYY-MM-DD). */
  foundingDate: null as string | null,
  description:
    'Tailor Education is a UK community-interest company delivering specialist RSE content, training, and support to primary, secondary, special, and alternative-provision schools.',
  /** Public profiles where the same brand exists. Add platforms as they
   *  go live; never invent. Each entry must be a real, public URL. */
  sameAs: [
    'https://uk.linkedin.com/company/tailoreducation',
    'https://www.instagram.com/oktoask.co.uk/',
  ],
} as const;

export const founder = {
  name: 'Gareth Esson',
  /** Anchor on /about used for self-references and byline links. */
  pageAnchor: '/about#about-founder-title',
  jobTitle: 'Founder & RSE Specialist',
  /** Free-text credentials surfaced in the UI. Add real, verifiable
   *  credentials only — Google's QRG explicitly flags inflated claims
   *  for YMYL content. */
  credentials: 'QTS · Enhanced DBS',
  /** Topics the founder is recognised authorities on — used for
   *  Person.knowsAbout, a strong YMYL E-E-A-T signal. */
  knowsAbout: [
    'Relationships and Sex Education',
    'PSHE',
    'Special Educational Needs and Disabilities',
    'Primary Education',
    'Secondary Education',
    'Safeguarding',
  ],
  linkedIn: 'https://www.linkedin.com/in/gareth-esson-6886635a/',
  /** Public URL of the founder portrait. Used for Person.image in
   *  schema and the about page hero. Square 1000×1000 expected. */
  portrait: '/images/portrait-gareth.webp',
  portraitAlt: 'Gareth Esson, founder of Tailor Education',
  portraitWidth: 1000,
  portraitHeight: 1000,
} as const;

/** Canonical absolute URL for the founder bio anchor. */
export const founderUrl = `${site.url}${founder.pageAnchor}`;

/**
 * Build the sitewide Organization JSON-LD object. Idempotent. Used by
 * BaseLayout on every page. Stable @id allows other schemas to
 * reference it via `{ "@id": "<url>#organization" }`.
 */
export function organisationJsonLd() {
  const sameAs: string[] = [...organisation.sameAs];
  if (founder.linkedIn) sameAs.push(founder.linkedIn);

  const obj: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'EducationalOrganization'],
    '@id': `${site.url}/#organization`,
    name: organisation.name,
    legalName: organisation.legalName,
    url: organisation.url,
    logo: organisation.logo,
    email: organisation.email,
    description: organisation.description,
    areaServed: { '@type': 'Country', name: organisation.areaServed },
    sameAs,
    founder: { '@id': founderUrl },
  };
  if (organisation.telephone) obj.telephone = organisation.telephone;
  if (organisation.foundingDate) obj.foundingDate = organisation.foundingDate;
  if (organisation.companyNumber) {
    obj.identifier = {
      '@type': 'PropertyValue',
      propertyID: 'Companies House',
      value: organisation.companyNumber,
    };
  }
  return obj;
}

/**
 * Build the founder Person JSON-LD. Used by /about (where the Person
 * "lives") and referenced by `@id` from blog Article.author so authority
 * accrues to a single Person node across the site.
 */
export function founderJsonLd() {
  const sameAs: string[] = [];
  if (founder.linkedIn) sameAs.push(founder.linkedIn);

  const obj: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': founderUrl,
    name: founder.name,
    url: founderUrl,
    jobTitle: founder.jobTitle,
    knowsAbout: founder.knowsAbout,
    worksFor: { '@id': `${site.url}/#organization` },
    image: {
      '@type': 'ImageObject',
      url: `${site.url}${founder.portrait}`,
      width: founder.portraitWidth,
      height: founder.portraitHeight,
    },
  };
  if (sameAs.length) obj.sameAs = sameAs;
  return obj;
}

/**
 * Build the WebSite JSON-LD with SearchAction (sitelinks search box).
 * Emit on the homepage only — Google treats it as a sitewide declaration.
 */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    url: `${site.url}/`,
    name: site.brand,
    publisher: { '@id': `${site.url}/#organization` },
    inLanguage: site.schemaLocale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${site.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Service schema helper. The 7 service pages were each emitting a
 * stripped-down Service schema with only name + description + provider.
 * This expands to include `areaServed`, `serviceType`, `audience`, and
 * an optional `offers` block — all relevant for B2B service search.
 *
 * The provider references the sitewide Organization by `@id` rather
 * than duplicating it.
 */
export function serviceJsonLd(opts: {
  name: string;
  description: string;
  canonicalPath: string;
  /** Coarse Schema.org service category — e.g. "Training", "Delivery",
   *  "Consulting". Surfaces in SERPs and helps Google route the page
   *  for service-intent queries. */
  serviceType: string;
  /** Educational role the service is sold to. Most Tailor services are
   *  bought by school leaders and delivered with teachers; for the
   *  delivery products, the audience also includes students. */
  audienceRoles?: ReadonlyArray<string>;
  /** Per-page offer block. We default to "contact for quote" pricing —
   *  Tailor doesn't list public prices but the offer existence still
   *  helps search engines understand the page is commercial. */
  offer?: {
    priceCurrency?: string;
    /** Free-text price band, e.g. "Contact for quote" or "From £750". */
    priceText?: string;
  };
}) {
  const audience = (opts.audienceRoles && opts.audienceRoles.length > 0)
    ? opts.audienceRoles.map((role) => ({
        '@type': 'EducationalAudience',
        educationalRole: role,
      }))
    : [{ '@type': 'EducationalAudience', educationalRole: 'Teacher' }];

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${site.url}${opts.canonicalPath}#service`,
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType,
    provider: { '@id': `${site.url}/#organization` },
    areaServed: { '@type': 'Country', name: organisation.areaServed },
    audience,
    offers: {
      '@type': 'Offer',
      priceCurrency: opts.offer?.priceCurrency ?? 'GBP',
      ...(opts.offer?.priceText
        ? { description: opts.offer.priceText }
        : { description: 'Contact for a quote' }),
      availability: 'https://schema.org/InStock',
      url: `${site.url}/contact?service=${encodeURIComponent(opts.name)}`,
    },
  };
}

/**
 * BreadcrumbList helper. Pass an ordered list of {name, path} from
 * root → leaf (excluding the root if you want; we add Home for you).
 *
 * Example: breadcrumbJsonLd([
 *   { name: 'Blog', path: '/blog/' },
 *   { name: post.title, path: `/blog/${post.slug}/` },
 * ])
 */
export function breadcrumbJsonLd(
  trail: ReadonlyArray<{ name: string; path: string }>,
) {
  const items = [
    { name: 'Home', path: '/' },
    ...trail,
  ].map((step, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: step.name,
    item: `${site.url}${step.path}`,
  }));
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}
