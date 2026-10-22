/**
 * Guards the enquiry form's per-service questions (enquiry-details.js).
 *
 * The form shows a service's questions by matching the dropdown value
 * exactly, so a key here that drifts from ENQUIRY_SERVICES never shows
 * at all, and nothing errors. The handler prints only answers it can
 * match to a known question and option; these tests pin that down so a
 * stray value can't reach the email and a bad answer can't cost an
 * enquiry.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { ENQUIRY_SERVICES } from '../src/lib/enquiry-services.js';
import { ENQUIRY_DETAILS, describeEnquiryDetails } from '../src/lib/enquiry-details.js';
import { TRAINING_SESSIONS } from '../src/lib/training.js';

test('every service with questions is a value the form offers', () => {
  for (const service of Object.keys(ENQUIRY_DETAILS)) {
    assert.ok(ENQUIRY_SERVICES.includes(service), `not in ENQUIRY_SERVICES: ${service}`);
  }
});

test('question names and option values are unique within a service', () => {
  for (const [service, fields] of Object.entries(ENQUIRY_DETAILS)) {
    const names = fields.map((f) => f.name);
    assert.equal(new Set(names).size, names.length, `duplicate question in ${service}`);
    for (const f of fields) {
      const values = f.options.map((o) => o.value);
      assert.equal(new Set(values).size, values.length, `duplicate option in ${service}/${f.name}`);
      assert.ok(['select', 'checkboxes'].includes(f.type), `${service}/${f.name} type`);
      assert.ok(f.emailLabel, `${service}/${f.name} needs an emailLabel`);
    }
  }
});

test('the training session question offers every catalogue session', () => {
  const field = ENQUIRY_DETAILS['RSE training'].find((f) => f.name === 'training_session');
  const values = field.options.map((o) => o.value);
  for (const s of TRAINING_SESSIONS) assert.ok(values.includes(s.slug), s.slug);
});

test('describeEnquiryDetails prints known answers with their labels', () => {
  const lines = describeEnquiryDetails('RSE training', {
    training_session: 'masculinity-misogyny-and-online-influence',
    staff_count: '10_20',
    key_stages: ['ks3', 'ks4'],
  });
  assert.deepEqual(lines, [
    { label: 'Session', value: 'Masculinity, misogyny and online influence' },
    { label: 'Staff', value: '10 to 20' },
    { label: 'Key stages', value: 'KS3, KS4' },
  ]);
});

test('describeEnquiryDetails drops unknown questions, values and junk', () => {
  assert.deepEqual(
    describeEnquiryDetails('RSE training', {
      staff_count: '<script>',
      key_stages: ['ks9', 42, 'ks3', 'ks3'],
      injected: 'Bcc: someone@example.com',
    }),
    [{ label: 'Key stages', value: 'KS3' }],
  );
  assert.deepEqual(describeEnquiryDetails('RSE training', null), []);
  assert.deepEqual(describeEnquiryDetails('RSE training', 'a string'), []);
  assert.deepEqual(describeEnquiryDetails('Other', { staff_count: '10_20' }), []);
  // An answer for another service's question doesn't leak through.
  assert.deepEqual(describeEnquiryDetails('Drop day delivery', { staff_count: '10_20' }), []);
});
