/**
 * Editable frontmatter fields, as the editor understands them.
 *
 * This mirrors the blog collection schema in src/content.config.ts, and
 * the server validates every save against it. That check is not
 * politeness: `main` auto-deploys, and a post committed with an enum
 * value Zod rejects fails `astro build` — which takes the whole site's
 * next deploy down, not just that post. Nothing reaches a commit without
 * passing this first.
 *
 * If you add a field to content.config.ts, add it here too.
 */

export const STATUSES = ['Draft', 'In Review', 'Published'];
export const CATEGORIES = ['RSE in Practice', 'Guidance and Policy', 'Our Work'];
export const AUDIENCES = ['Teachers', 'School leaders', 'Parents'];
export const SERVICE_LINKS = ['delivery', 'training', 'drop-days', 'consultancy', 'none'];

/** Fields the editor is allowed to change. Everything else in the
 *  frontmatter is passed through untouched — notably featuredImage
 *  (changing it means uploading a file, which this version doesn't do)
 *  and the Notion relation ids. */
export const EDITABLE_FIELDS = {
  title: { kind: 'text', label: 'Title', required: true, max: 200 },
  status: { kind: 'enum', label: 'Status', options: STATUSES, required: true },
  publishedDate: { kind: 'date', label: 'Published' },
  dateModified: { kind: 'date', label: 'Last updated' },
  author: { kind: 'text', label: 'Author', max: 120 },
  category: { kind: 'enum', label: 'Category', options: CATEGORIES, nullable: true },
  targetAudience: { kind: 'enum', label: 'Audience', options: AUDIENCES, nullable: true },
  contentTags: { kind: 'list', label: 'Content tags', max: 60 },
  serviceLink: { kind: 'enum', label: 'Service link', options: SERVICE_LINKS, nullable: true },
  metaTitle: { kind: 'text', label: 'Meta title', max: 300 },
  metaDescription: { kind: 'textarea', label: 'Meta description', max: 500 },
  featuredImageAlt: { kind: 'text', label: 'Featured image alt text', max: 300 },
  imageCredit: { kind: 'text', label: 'Image credit', max: 200, nullable: true },
  imageCreditUrl: { kind: 'url', label: 'Image credit URL', max: 500, nullable: true },
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validate and coerce a patch of frontmatter values.
 * @param {Record<string, unknown>} patch
 * @returns {{ ok: true, value: Record<string, unknown> } | { ok: false, errors: string[] }}
 */
export function validatePatch(patch) {
  const errors = [];
  const value = {};

  for (const [key, raw] of Object.entries(patch)) {
    const field = EDITABLE_FIELDS[key];
    if (!field) {
      errors.push(`"${key}" is not a field the editor can change.`);
      continue;
    }

    // Empty means "unset" for nullable fields and for the optional
    // dates; for a plain text field it means an empty string, which the
    // schema defaults handle.
    const isBlank = raw === null || raw === undefined || (typeof raw === 'string' && raw.trim() === '');

    switch (field.kind) {
      case 'enum': {
        if (isBlank) {
          if (field.required) errors.push(`${field.label} is required.`);
          else value[key] = null;
          break;
        }
        if (typeof raw !== 'string' || !field.options.includes(raw)) {
          errors.push(`${field.label} must be one of: ${field.options.join(', ')}.`);
          break;
        }
        value[key] = raw;
        break;
      }

      case 'date': {
        if (isBlank) {
          value[key] = null;
          break;
        }
        if (typeof raw !== 'string' || !ISO_DATE.test(raw) || Number.isNaN(Date.parse(raw))) {
          errors.push(`${field.label} must be a date in YYYY-MM-DD form.`);
          break;
        }
        value[key] = raw;
        break;
      }

      case 'url': {
        if (isBlank) {
          value[key] = null;
          break;
        }
        if (typeof raw !== 'string') {
          errors.push(`${field.label} must be text.`);
          break;
        }
        try {
          const parsed = new URL(raw);
          if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') throw new Error('scheme');
        } catch {
          errors.push(`${field.label} must be a full URL starting with https://`);
          break;
        }
        if (raw.length > field.max) errors.push(`${field.label} is too long.`);
        else value[key] = raw;
        break;
      }

      case 'list': {
        if (!Array.isArray(raw)) {
          errors.push(`${field.label} must be a list.`);
          break;
        }
        const items = raw
          .map((v) => (typeof v === 'string' ? v.trim() : ''))
          .filter((v) => v.length > 0);
        if (items.some((v) => v.length > field.max)) {
          errors.push(`Each ${field.label.toLowerCase()} entry must be ${field.max} characters or fewer.`);
          break;
        }
        if (items.length > 25) {
          errors.push(`${field.label}: 25 entries is the limit.`);
          break;
        }
        value[key] = items;
        break;
      }

      case 'text':
      case 'textarea':
      default: {
        if (isBlank) {
          if (field.required) {
            errors.push(`${field.label} is required.`);
            break;
          }
          value[key] = field.nullable ? null : '';
          break;
        }
        if (typeof raw !== 'string') {
          errors.push(`${field.label} must be text.`);
          break;
        }
        // Single-line fields must stay single-line: a newline in a
        // quoted YAML scalar would break the frontmatter block.
        const cleaned = field.kind === 'textarea' ? raw.trim() : raw.replace(/[\r\n]+/g, ' ').trim();
        if (cleaned.length > field.max) {
          errors.push(`${field.label} must be ${field.max} characters or fewer.`);
          break;
        }
        value[key] = cleaned;
      }
    }
  }

  return errors.length ? { ok: false, errors } : { ok: true, value };
}
