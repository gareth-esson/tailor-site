/**
 * Frontmatter read/write for the post editor.
 *
 * The editor is one of three writers on these files (Gareth in the
 * browser, Claude and Codex on disk), so the priority here is *minimal
 * diffs*: a save that changes one field must not reformat the other
 * fifteen. That rules out round-tripping through a YAML emitter — every
 * emitter has its own opinions about quoting and key order, and the
 * posts were written by a Notion migration with its own.
 *
 * So: parse into an ordered list of blocks that each keep their original
 * source text. On write, a field whose value is unchanged re-emits its
 * original bytes verbatim; only genuinely edited fields get canonical
 * formatting. Untouched keys are byte-identical by construction, not by
 * the emitter happening to agree.
 */

/** Key order used when a field is added to a post that lacks it.
 *  Mirrors the blog collection schema in src/content.config.ts. */
export const FIELD_ORDER = [
  'title',
  'status',
  'publishedDate',
  'dateModified',
  'guidanceSensitive',
  'reviewBy',
  'lastReviewedDate',
  'author',
  'category',
  'targetAudience',
  'contentTags',
  'topicIds',
  'secondaryTopicIds',
  'serviceLink',
  'metaTitle',
  'metaDescription',
  'featuredImage',
  'featuredImageAlt',
  'imageCredit',
  'imageCreditUrl',
];

const DELIM = '---';

/**
 * Split a raw .mdx file into its frontmatter block and body.
 * @param {string} raw
 * @returns {{ fields: Array<{key: string, value: unknown, source: string}>, body: string }}
 */
export function parseFile(raw) {
  const normalised = raw.replace(/\r\n/g, '\n');
  if (!normalised.startsWith(DELIM + '\n')) {
    throw new Error('File does not start with a frontmatter delimiter');
  }
  const end = normalised.indexOf('\n' + DELIM + '\n', DELIM.length);
  if (end === -1) throw new Error('Unterminated frontmatter block');

  const block = normalised.slice(DELIM.length + 1, end + 1);
  // Drop the blank line that separates frontmatter from body — the
  // serialiser puts it back, so it isn't part of the body's content.
  const body = normalised.slice(end + ('\n' + DELIM + '\n').length).replace(/^\n+/, '');
  return { fields: parseBlock(block), body };
}

/**
 * Parse the inside of a frontmatter block into ordered key blocks,
 * each retaining the exact source lines it came from.
 * @param {string} block
 */
function parseBlock(block) {
  const lines = block.split('\n');
  // A trailing '' from the final newline is not a line.
  if (lines[lines.length - 1] === '') lines.pop();

  /** @type {Array<{key: string, value: unknown, source: string}>} */
  const fields = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const match = /^([A-Za-z_][A-Za-z0-9_]*):\s?(.*)$/.exec(line);
    if (!match) {
      // Not a key line at top level — skip rather than guess. Nothing in
      // the corpus hits this, but a malformed file shouldn't throw away
      // content silently.
      i += 1;
      continue;
    }
    const [, key, inline] = match;
    const sourceLines = [line];
    let value;

    if (inline.trim() === '') {
      // Block value: consume following indented "  - item" lines.
      const items = [];
      let j = i + 1;
      while (j < lines.length && /^\s+-\s/.test(lines[j])) {
        items.push(parseScalar(lines[j].replace(/^\s+-\s/, '')));
        sourceLines.push(lines[j]);
        j += 1;
      }
      value = items;
      i = j;
    } else {
      value = parseScalar(inline);
      i += 1;
    }

    fields.push({ key, value, source: sourceLines.join('\n') });
  }
  return fields;
}

/** Parse a YAML scalar limited to the shapes this schema uses. */
function parseScalar(text) {
  const trimmed = text.trim();
  if (trimmed === 'null' || trimmed === '~' || trimmed === '') return null;
  if (trimmed === '[]') return [];
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length >= 2) {
    return trimmed.slice(1, -1).replace(/\\(["\\])/g, '$1');
  }
  if (trimmed.startsWith("'") && trimmed.endsWith("'") && trimmed.length >= 2) {
    return trimmed.slice(1, -1).replace(/''/g, "'");
  }
  return trimmed;
}

/** Emit a value in the house style: double-quoted strings, bare null,
 *  `[]` for empty arrays, `  - "item"` for populated ones. */
function emitField(key, value) {
  if (value === null || value === undefined) return `${key}: null`;
  if (Array.isArray(value)) {
    if (value.length === 0) return `${key}: []`;
    return [`${key}:`, ...value.map((v) => `  - ${quote(String(v))}`)].join('\n');
  }
  if (typeof value === 'boolean') return `${key}: ${value}`;
  return `${key}: ${quote(String(value))}`;
}

function quote(s) {
  return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function sameValue(a, b) {
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }
  // Treat null and undefined as the same absence.
  if (a === null || a === undefined) return b === null || b === undefined;
  return a === b;
}

/**
 * Rebuild a file from its parsed fields plus a patch of changed values.
 * Fields absent from `patch` keep their original bytes.
 *
 * @param {Array<{key: string, value: unknown, source: string}>} fields
 * @param {Record<string, unknown>} patch
 * @param {string} body
 * @returns {string}
 */
export function serialiseFile(fields, patch, body) {
  const seen = new Set();
  const out = [];

  for (const field of fields) {
    seen.add(field.key);
    if (Object.prototype.hasOwnProperty.call(patch, field.key) && !sameValue(field.value, patch[field.key])) {
      out.push(emitField(field.key, patch[field.key]));
    } else {
      out.push(field.source);
    }
  }

  // Keys the post didn't previously carry (e.g. first time dateModified
  // is set) get inserted at their schema position rather than appended,
  // so frontmatter blocks stay comparable across posts.
  const additions = Object.keys(patch).filter(
    (k) =>
      !seen.has(k) &&
      patch[k] !== null &&
      patch[k] !== undefined &&
      patch[k] !== '' &&
      // A boolean sitting at its schema default (guidanceSensitive is
      // `false` by default) says exactly what the key's absence already
      // says. The form posts every field on every save, so writing it
      // out would add a line to every post the first time anyone pressed
      // Save — churn in return for no information.
      patch[k] !== false,
  );
  for (const key of additions) {
    const emitted = emitField(key, patch[key]);
    const target = FIELD_ORDER.indexOf(key);
    let insertAt = out.length;
    if (target !== -1) {
      for (let i = 0; i < out.length; i += 1) {
        const existingKey = /^([A-Za-z_][A-Za-z0-9_]*):/.exec(out[i])?.[1];
        const pos = existingKey ? FIELD_ORDER.indexOf(existingKey) : -1;
        if (pos !== -1 && pos > target) {
          insertAt = i;
          break;
        }
      }
    }
    out.splice(insertAt, 0, emitted);
  }

  const bodyText = body.replace(/\s*$/, '') + '\n';
  return `${DELIM}\n${out.join('\n')}\n${DELIM}\n\n${bodyText}`;
}

/** Convenience: parsed fields as a plain object. */
export function toObject(fields) {
  const obj = {};
  for (const f of fields) obj[f.key] = f.value;
  return obj;
}
