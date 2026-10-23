/**
 * The training catalogue's shared facts — single source of truth.
 *
 * Two lists live here because three different places need them and must
 * agree: the training pages (hub, session pages, schema), the enquiry
 * form's "Which session?" question, and the enquiry handler that prints
 * the session's name in the email.
 *
 * TRAINING_SESSIONS is the catalogue. A session's page content lives in
 * src/content/training/<slug>/index.mdx; this list holds only what the
 * form and handler need, so they don't depend on a page being written.
 * tests/training-catalogue.test.mjs asserts every content folder has an
 * entry here, so a page can't go live under a name the form doesn't know.
 *
 * TRAINING_FORMATS is the rate card. Every named session is sold at these
 * three lengths for these prices; bespoke work is quoted. Change a price
 * here and the hub, every session page and the structured data follow.
 *
 * Plain .js rather than .ts so `node --test` can import it directly,
 * matching enquiry-services.js.
 */

export const TRAINING_SESSIONS = [
  { slug: 'teaching-rse-with-confidence', title: 'Teaching RSE with confidence' },
  { slug: 'teaching-the-hard-topics', title: 'Teaching the hard topics' },
  { slug: 'masculinity-misogyny-and-online-influence', title: 'Masculinity, misogyny and online influence' },
  { slug: 'consent-pressure-and-power', title: 'Consent, pressure and power' },
  { slug: 'sex-in-a-digital-world', title: 'Porn, nudes, sextortion and deepfakes' },
  { slug: 'primary-rse', title: 'Primary RSE: bodies, puberty and boundaries' },
  { slug: 'rse-in-special-schools-and-ap', title: 'RSE in special schools, AP and SEMH settings' },
];

export const TRAINING_FORMATS = [
  { key: 'twilight', label: 'Twilight', length: '90 minutes', price: 450, workload: 'PT1H30M' },
  { key: 'half_day', label: 'Half day', length: '3 hours', price: 650, workload: 'PT3H' },
  { key: 'full_day', label: 'Full day', length: '5.5 hours', price: 950, workload: 'PT5H30M' },
];

export const TRAVEL_NOTE = 'plus travel at cost';

/** "£450" — whole pounds, thousands separated. */
export function formatPrice(pounds) {
  return `£${pounds.toLocaleString('en-GB')}`;
}

/** The one-line rate card, e.g. for a meta strip or schema offer. */
export function rateCardLine({ from = false } = {}) {
  const prefix = from ? ' from ' : ' ';
  const parts = TRAINING_FORMATS.map(
    (f, i) => `${i === 0 ? f.label : f.label.toLowerCase()}${prefix}${formatPrice(f.price)}`,
  );
  return `${parts.join(', ')}, ${TRAVEL_NOTE}`;
}

/** A session's title by slug, or null when it isn't in the catalogue. */
export function trainingSessionTitle(slug) {
  return TRAINING_SESSIONS.find((s) => s.slug === slug)?.title ?? null;
}
