/**
 * The enquiry form's "How did you hear about us?" vocabulary — single
 * source of truth.
 *
 * EnquiryForm builds its <select> from this list and the enquiry handler
 * validates against it and prints the label in the email, so the two
 * can't disagree about what a value means. The answer is optional; an
 * empty value means the person didn't say.
 *
 * Plain .js rather than .ts so `node --test` can import it directly,
 * matching enquiry-services.js.
 */

export const ENQUIRY_SOURCES = [
  { value: 'colleague',    label: 'A colleague or another school' },
  { value: 'ai_assistant', label: 'ChatGPT or another AI chatbot' },
  { value: 'search',       label: 'Google or another search engine' },
  { value: 'social',       label: 'LinkedIn or social media' },
  { value: 'network',      label: 'Local authority, trust or PSHE network' },
  { value: 'okay_to_ask',  label: 'The Okay to Ask book or website' },
  { value: 'event',        label: 'A conference, event or training' },
  { value: 'other',        label: 'Other' },
];

/** The label for a source value, or null when it isn't one of ours. */
export function enquirySourceLabel(value) {
  return ENQUIRY_SOURCES.find((source) => source.value === value)?.label ?? null;
}
