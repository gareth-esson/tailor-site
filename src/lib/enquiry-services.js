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
