/**
 * The enquiry form's service vocabulary — single source of truth.
 *
 * EnquiryForm builds its <select> from this list, and every link that
 * deep-links into the form with ?service=… must send one of these exact
 * strings. The form matches case-insensitively but otherwise exactly
 * (see EnquiryForm.astro), so a near-miss doesn't error — the dropdown
 * simply stays on "Please select" and the context the link was carrying
 * is lost. Six of nine deep links were broken that way before this
 * module existed, because the values were retyped as free strings in
 * seven files with nothing keeping them in sync.
 *
 * This is NOT the same vocabulary as `ServiceTag` in types.ts. That one
 * is the Notion testimonial tag set ('RSE delivery', 'Drop days',
 * 'Circuits (SEND/AP)'…). The wording overlaps; the sets do not. Don't
 * substitute one for the other.
 *
 * Adding a service here also adds it to the form's dropdown, so it must
 * be a value the enquiry handler and Notion are happy to receive.
 *
 * Plain .js rather than .ts so `node --test` can import it directly —
 * tests/enquiry-links.test.mjs asserts every ?service= value in the
 * codebase is a member of this list.
 */

export const ENQUIRY_SERVICES = [
  'Direct RSE delivery',
  'RSE training',
  'Drop day delivery',
  'RSE policy & curriculum planning',
  'Other',
];

/** True when `value` is one of the form's accepted options. */
export function isValidEnquiryService(value) {
  return ENQUIRY_SERVICES.some(
    (option) => option.toLowerCase() === String(value).toLowerCase(),
  );
}

/**
 * `serviceCtaTarget` (set per landing page and per blog post) → the wording
 * a CTA shows and the value it sends to the form.
 *
 * `label` is prose and appears mid-sentence, so it stays lowercase and
 * spells out "and". `param` must be an ENQUIRY_SERVICES member exactly.
 * They differ on purpose; don't collapse them.
 *
 * Consumed by CtaBlogBottom [A14] and the topic landing template [C3].
 * Kept here rather than in either component so a third caller can't
 * introduce a third slightly-different copy — which is how the enquiry
 * links broke in the first place.
 */
export const SERVICE_CTA = {
  delivery: { label: 'direct RSE delivery', param: 'Direct RSE delivery' },
  training: { label: 'RSE training', param: 'RSE training' },
  'drop-days': { label: 'drop day delivery', param: 'Drop day delivery' },
  consultancy: {
    label: 'RSE policy and curriculum planning',
    param: 'RSE policy & curriculum planning',
  },
  'rse-policy-curriculum-planning': {
    label: 'RSE policy and curriculum planning',
    param: 'RSE policy & curriculum planning',
  },
};

/** The CTA mapping for a serviceCtaTarget, falling back to training. */
export function serviceCta(target) {
  return SERVICE_CTA[target] ?? SERVICE_CTA.training;
}
