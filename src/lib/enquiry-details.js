/**
 * The enquiry form's follow-up questions, per service — single source of
 * truth.
 *
 * Choosing a service in the form reveals that service's questions, so an
 * enquiry arrives with what's needed to quote and the first reply can be
 * a price rather than a list of questions. EnquiryForm renders these, the
 * enquiry handler validates against them and prints them in the email, so
 * the two can't disagree about what a value means.
 *
 * Keys are ENQUIRY_SERVICES values (enquiry-services.js). A service with
 * no entry (e.g. 'Other') shows no extra questions.
 *
 * Each field:
 *   name        unique within its service; sent as a key of `details`
 *   label       the question as the form asks it
 *   emailLabel  the short label the email prints beside the answer
 *   type        'select' (one answer) or 'checkboxes' (any number)
 *   options     [{ value, label }]
 *   required    checked in the browser only. The handler never rejects an
 *               enquiry over these: losing an answer beats losing a lead.
 *
 * Keep each service to four or five questions, mostly quick picks. Every
 * question added here is one more reason not to finish the form.
 *
 * Plain .js rather than .ts so `node --test` can import it directly.
 */

import { TRAINING_FORMATS, TRAINING_SESSIONS } from './training.js';

const KEY_STAGES = [
  { value: 'eyfs', label: 'EYFS' },
  { value: 'ks1', label: 'KS1' },
  { value: 'ks2', label: 'KS2' },
  { value: 'ks3', label: 'KS3' },
  { value: 'ks4', label: 'KS4' },
  { value: 'ks5', label: 'KS5 / post-16' },
];

const TIMING = [
  { value: 'this_term', label: 'This term' },
  { value: 'next_term', label: 'Next term' },
  { value: 'later', label: 'Later than that' },
  { value: 'not_sure', label: 'Not sure yet' },
];

const YES_NO_UNSURE = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'not_sure', label: 'Not sure' },
];

const TOPICS = [
  { value: 'consent', label: 'Consent' },
  { value: 'healthy_relationships', label: 'Healthy relationships' },
  { value: 'puberty_bodies', label: 'Puberty and bodies' },
  { value: 'sex_sexual_health', label: 'Sex and sexual health' },
  { value: 'porn_online', label: 'Porn, nudes and online safety' },
  { value: 'misogyny_masculinity', label: 'Misogyny and masculinity' },
  { value: 'lgbtq', label: 'LGBTQ+ inclusion' },
  { value: 'help_decide', label: 'Help us decide' },
];

export const ENQUIRY_DETAILS = {
  'RSE training': [
    {
      name: 'training_session',
      label: 'Which session?',
      emailLabel: 'Session',
      type: 'select',
      options: [
        ...TRAINING_SESSIONS.map((s) => ({ value: s.slug, label: s.title })),
        { value: 'bespoke', label: 'Something bespoke' },
        { value: 'not_sure', label: 'Not sure yet' },
      ],
    },
    {
      name: 'training_format',
      label: 'Which length?',
      emailLabel: 'Length',
      type: 'select',
      options: [
        ...TRAINING_FORMATS.map((f) => ({ value: f.key, label: `${f.label} (${f.length})` })),
        { value: 'not_sure', label: 'Not sure yet' },
      ],
    },
    {
      name: 'staff_count',
      label: 'How many staff?',
      emailLabel: 'Staff',
      type: 'select',
      required: true,
      options: [
        { value: 'under_10', label: 'Fewer than 10' },
        { value: '10_20', label: '10 to 20' },
        { value: 'over_20', label: 'More than 20' },
      ],
    },
    {
      name: 'key_stages',
      label: 'Which key stages do they teach?',
      emailLabel: 'Key stages',
      type: 'checkboxes',
      options: KEY_STAGES,
    },
    {
      name: 'send_context',
      label: 'Do any of their pupils have SEND or SEMH needs?',
      emailLabel: 'SEND or SEMH',
      type: 'select',
      options: YES_NO_UNSURE,
    },
    {
      name: 'timing',
      label: 'When would you like it?',
      emailLabel: 'When',
      type: 'select',
      options: TIMING,
    },
  ],

  'Direct RSE delivery': [
    {
      name: 'key_stages',
      label: 'Which key stages?',
      emailLabel: 'Key stages',
      type: 'checkboxes',
      required: true,
      options: KEY_STAGES,
    },
    {
      name: 'class_count',
      label: 'Roughly how many classes?',
      emailLabel: 'Classes',
      type: 'select',
      options: [
        { value: 'one', label: 'One class' },
        { value: '2_4', label: '2 to 4 classes' },
        { value: 'year_group', label: 'A whole year group' },
        { value: 'several_year_groups', label: 'Several year groups' },
      ],
    },
    {
      name: 'topics',
      label: 'Which topics?',
      emailLabel: 'Topics',
      type: 'checkboxes',
      options: TOPICS,
    },
    {
      name: 'send_context',
      label: 'Is this for pupils with SEND or SEMH needs, or in AP?',
      emailLabel: 'SEND, SEMH or AP',
      type: 'select',
      options: YES_NO_UNSURE,
    },
    {
      name: 'timing',
      label: 'When would you like it?',
      emailLabel: 'When',
      type: 'select',
      options: TIMING,
    },
  ],

  'Drop day delivery': [
    {
      name: 'key_stages',
      label: 'Which key stages?',
      emailLabel: 'Key stages',
      type: 'checkboxes',
      required: true,
      options: KEY_STAGES,
    },
    {
      name: 'cohort_size',
      label: 'How many pupils?',
      emailLabel: 'Pupils',
      type: 'select',
      options: [
        { value: 'under_60', label: 'Fewer than 60' },
        { value: '60_120', label: '60 to 120' },
        { value: '120_200', label: '120 to 200' },
        { value: 'over_200', label: 'More than 200' },
      ],
    },
    {
      name: 'topics',
      label: 'Which topics?',
      emailLabel: 'Topics',
      type: 'checkboxes',
      options: TOPICS,
    },
    {
      name: 'timing',
      label: 'When would you like it?',
      emailLabel: 'When',
      type: 'select',
      options: TIMING,
    },
  ],

  'RSE policy & curriculum planning': [
    {
      name: 'phase',
      label: 'Which phase?',
      emailLabel: 'Phase',
      type: 'select',
      required: true,
      options: [
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'all_through', label: 'All-through' },
        { value: 'special_ap', label: 'Special school or AP' },
      ],
    },
    {
      name: 'policy_need',
      label: 'What do you need?',
      emailLabel: 'Needs',
      type: 'checkboxes',
      options: [
        { value: 'new_policy', label: 'A new RSE policy' },
        { value: 'policy_review', label: 'A review of our current policy' },
        { value: 'curriculum_map', label: 'A curriculum map' },
      ],
    },
    {
      name: 'deadline',
      label: 'Is there a deadline?',
      emailLabel: 'Deadline',
      type: 'select',
      options: [
        { value: 'ofsted', label: 'An Ofsted inspection' },
        { value: 'governors', label: "A governors' meeting" },
        { value: 'end_of_term', label: 'End of term' },
        { value: 'none', label: 'No fixed deadline' },
      ],
    },
  ],
};

/**
 * Turn raw answers into email lines, keeping only known fields and known
 * option values for the given service. Unknown fields, unknown values and
 * empty answers are dropped silently. Returns [{ label, value }].
 */
export function describeEnquiryDetails(service, raw) {
  const fields = ENQUIRY_DETAILS[service];
  if (!fields || raw == null || typeof raw !== 'object') return [];

  const lines = [];
  for (const field of fields) {
    const answer = raw[field.name];
    const labelFor = (v) => field.options.find((o) => o.value === v)?.label ?? null;

    if (field.type === 'select') {
      const label = typeof answer === 'string' ? labelFor(answer) : null;
      if (label) lines.push({ label: field.emailLabel, value: label });
    } else {
      const values = Array.isArray(answer) ? answer : [];
      const labels = [...new Set(values)]
        .filter((v) => typeof v === 'string')
        .map(labelFor)
        .filter(Boolean);
      if (labels.length > 0) lines.push({ label: field.emailLabel, value: labels.join(', ') });
    }
  }
  return lines;
}
