/**
 * Guards the one conversion path that can break without anyone noticing:
 * a "Get in touch" link that carries the wrong ?service= value.
 *
 * The enquiry form pre-selects its dropdown by case-insensitive *exact*
 * match against its option list (EnquiryForm.astro). A near-miss doesn't
 * throw, doesn't warn, and doesn't show up in a build — the visitor just
 * lands on a form sitting on "Please select", and the enquiry record
 * loses the service they came in for.
 *
 * That is exactly what had happened: six of nine deep links sent values
 * the form discarded, including 'RSE policy and curriculum planning'
 * (the option uses '&') and four phase pages whose names were never
 * options at all. The values had been retyped as free strings across
 * seven files with nothing tying them to the dropdown.
 *
 * These tests fail if any ?service= value in the codebase drifts away
 * from ENQUIRY_SERVICES again.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  ENQUIRY_SERVICES,
  SERVICE_CTA,
  isValidEnquiryService,
  serviceCta,
} from '../src/lib/enquiry-services.js';

const SRC = fileURLToPath(new URL('../src/', import.meta.url));

function sourceFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...sourceFiles(full));
    else if (/\.(astro|ts|js)$/.test(entry)) out.push(full);
  }
  return out;
}

/** Comments are prose — a doc comment mentioning ?service= is not a link. */
function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

const FILES = sourceFiles(SRC).map((path) => ({
  path,
  rel: path.slice(SRC.length),
  text: stripComments(readFileSync(path, 'utf8')),
  raw: readFileSync(path, 'utf8'),
}));

/** Names destructured from Astro.props — supplied by callers, so they are
 *  covered by the caller-side tests rather than resolvable here. */
function propNames(text) {
  const names = new Set();
  for (const m of text.matchAll(/const\s*\{([^}]*)\}\s*=\s*Astro\.props/g)) {
    for (const part of m[1].split(',')) {
      const name = part.split('=')[0].trim();
      if (name) names.add(name);
    }
  }
  return names;
}

/** `const NAME = 'VALUE';` declarations in one file. */
function localConsts(text) {
  const map = new Map();
  for (const m of text.matchAll(/const\s+([A-Za-z_$][\w$]*)\s*=\s*'([^']*)'\s*;/g)) {
    map.set(m[1], m[2]);
  }
  return map;
}

test('every literal ?service= value is an option the form accepts', () => {
  const bad = [];
  for (const { rel, text } of FILES) {
    // ?service=Other  —  but not ?service=${…}
    for (const m of text.matchAll(/\?service=(?!\$\{)([^"'`\s&}]+)/g)) {
      const value = decodeURIComponent(m[1]);
      if (!isValidEnquiryService(value)) bad.push(`${rel}: ${value}`);
    }
  }
  assert.deepEqual(bad, [], `literal ?service= values the form will discard:\n${bad.join('\n')}`);
});

test('every interpolated ?service= variable resolves to an accepted option', () => {
  const bad = [];
  const unresolved = [];
  for (const { rel, text } of FILES) {
    const consts = localConsts(text);
    const props = propNames(text);
    for (const m of text.matchAll(/\?service=\$\{encodeURIComponent\(([^)]*)\)\}/g)) {
      // `a ?? b` fallbacks: every operand has to hold up.
      for (const name of m[1].split('??').map((s) => s.trim())) {
        // Caller-supplied values (component props, helper opts) are
        // validated where they are passed in, not here.
        // Member expressions (service.param, opts.enquiryValue) read from
        // an object literal or a caller. The object-literal case is
        // covered by the `param:` test below.
        if (props.has(name) || name.includes('.')) continue;
        if (!consts.has(name)) {
          unresolved.push(`${rel}: ${name}`);
          continue;
        }
        const value = consts.get(name);
        if (!isValidEnquiryService(value)) bad.push(`${rel}: ${name} = ${value}`);
      }
    }
  }
  assert.deepEqual(bad, [], `interpolated ?service= values the form will discard:\n${bad.join('\n')}`);
  assert.deepEqual(
    unresolved,
    [],
    `?service= interpolations this test could not resolve — extend the test rather than ignore them:\n${unresolved.join('\n')}`,
  );
});

test('any { label, param } service map anywhere holds accepted options', () => {
  // SERVICE_CTA is the canonical map and is covered directly above. This
  // scan is the tripwire for a *new* inline copy appearing in a component —
  // which is how the vocabulary fragmented the first time. Every `param:`
  // literal in src today belongs to a service map, so scanning broadly
  // costs nothing.
  const checked = [];
  const bad = [];
  for (const { rel, text } of FILES) {
    for (const m of text.matchAll(/\bparam:\s*'([^']*)'/g)) {
      checked.push(`${rel}: ${m[1]}`);
      if (!isValidEnquiryService(m[1])) bad.push(`${rel}: ${m[1]}`);
    }
  }
  assert.ok(checked.length > 0, 'expected at least one service map to check — has the pattern moved?');
  assert.deepEqual(bad, [], `service-map params the form will discard:\n${bad.join('\n')}`);
});

test('SERVICE_CTA maps every target onto an accepted option', () => {
  const entries = Object.entries(SERVICE_CTA);
  assert.ok(entries.length > 0, 'SERVICE_CTA is empty');
  const bad = entries
    .filter(([, cta]) => !isValidEnquiryService(cta.param))
    .map(([target, cta]) => `${target} → ${cta.param}`);
  assert.deepEqual(bad, [], `SERVICE_CTA params the form will discard:\n${bad.join('\n')}`);
});

test('serviceCta falls back rather than returning undefined', () => {
  // Landing pages may carry no serviceCtaTarget, or one that has since been
  // renamed. A missing fallback would render a CTA with an undefined href.
  for (const target of [null, undefined, '', 'no-such-service']) {
    const cta = serviceCta(target);
    assert.ok(cta && cta.param, `serviceCta(${JSON.stringify(target)}) returned nothing usable`);
    assert.ok(isValidEnquiryService(cta.param), `fallback param is not an option: ${cta.param}`);
  }
});

test('every declared enquiryService is an accepted option', () => {
  const declared = [];
  for (const { rel, text } of FILES) {
    for (const m of text.matchAll(/const\s+enquiryService\s*=\s*'([^']*)'/g)) {
      declared.push({ rel, value: m[1] });
    }
  }
  assert.ok(declared.length >= 7, `expected every service page to declare one, found ${declared.length}`);
  const bad = declared.filter((d) => !isValidEnquiryService(d.value));
  assert.deepEqual(bad, [], `enquiryService values the form will discard: ${JSON.stringify(bad)}`);
});

test('every service page passes enquiryValue into its JSON-LD offer', () => {
  const missing = FILES.filter(
    ({ rel, text }) =>
      rel.startsWith('pages/services/') &&
      text.includes('serviceJsonLd({') &&
      !text.includes('enquiryValue:'),
  ).map(({ rel }) => rel);
  assert.deepEqual(
    missing,
    [],
    `serviceJsonLd defaults its offer URL to the page title, which is not a form option:\n${missing.join('\n')}`,
  );
});

test('the form builds its dropdown from the shared vocabulary', () => {
  const form = FILES.find(({ rel }) => rel === 'components/EnquiryForm.astro');
  assert.ok(form, 'EnquiryForm.astro not found');
  assert.match(
    form.text,
    /ENQUIRY_SERVICES/,
    'EnquiryForm must build serviceOptions from ENQUIRY_SERVICES, or the dropdown can drift from the links again',
  );
  // A hardcoded option list alongside the import would defeat the point.
  for (const value of ENQUIRY_SERVICES) {
    const literal = new RegExp(`value:\\s*'${value.replace(/[.*+?^${}()|[\]\\&]/g, '\\$&')}'`);
    assert.ok(!literal.test(form.text), `EnquiryForm still hardcodes the option '${value}'`);
  }
});
