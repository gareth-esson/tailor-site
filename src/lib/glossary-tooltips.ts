/**
 * Build-time glossary tooltip matching.
 * Scans HTML text for glossary term matches and wraps the first
 * occurrence of each term in a tooltip wrapper element.
 */
import type { GlossaryIndex } from './types';

interface TooltipMatch {
  term: string;
  slug: string;
  shortDefinition: string;
  simpleDefinition: string;
}

/**
 * Scan an HTML string for glossary term matches and wrap the first
 * occurrence of each in a <span> with tooltip data attributes.
 *
 * Rules:
 * - Case-insensitive, whole word only
 * - Only first occurrence per term
 * - Skip matches inside headings, alt text, or existing tooltips
 * - Don't tooltip a term on its own glossary page
 */
export function injectGlossaryTooltips(
  html: string,
  glossaryIndex: GlossaryIndex,
  excludeSlug?: string
): string {
  if (!html || Object.keys(glossaryIndex).length === 0) return html;

  // Sort terms by length (longest first) to match longer phrases before shorter ones
  const terms = Object.keys(glossaryIndex)
    .filter((t) => !excludeSlug || glossaryIndex[t].slug !== excludeSlug)
    .sort((a, b) => b.length - a.length);

  if (terms.length === 0) return html;

  const matched = new Set<string>();

  for (const termLower of terms) {
    if (matched.has(termLower)) continue;

    const ref = glossaryIndex[termLower];
    // Build a regex that matches the term as a whole word, case-insensitive,
    // including common inflected forms (plurals, -ing, -ed, -er, -est)
    // but NOT inside HTML tags, headings, or existing tooltip spans
    const escaped = termLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b(${escaped}(?:s|es|ing|ed|er|est)?)\\b`, 'i');

    // Split HTML into segments: tags vs text
    // We only want to match in text segments outside of:
    // - HTML tags
    // - <h1>-<h6> content
    // - elements with data-glossary-tooltip
    const result = replaceFirstInText(html, regex, (match) => {
      matched.add(termLower);
      return `<span class="glossary-term" data-glossary-tooltip data-term-slug="${ref.slug}" data-short-def="${escapeAttr(ref.shortDefinition)}" data-simple-def="${escapeAttr(ref.simpleDefinition)}">${match}</span>`;
    });

    if (matched.has(termLower)) {
      html = result;
    }
  }

  return html;
}

/**
 * Replace the first occurrence of a regex match in text nodes only
 * (not inside HTML tags or heading elements).
 */
function replaceFirstInText(
  html: string,
  regex: RegExp,
  replacer: (match: string) => string
): string {
  let replaced = false;
  let depth = 0;
  let inHeading = false;
  let inTooltip = false;

  // Split into tags and text segments
  const parts = html.split(/(<[^>]+>)/);
  const result: string[] = [];

  for (const part of parts) {
    if (replaced) {
      result.push(part);
      continue;
    }

    if (part.startsWith('<')) {
      // It's a tag
      const isClosing = part.startsWith('</');
      const tagMatch = part.match(/^<\/?(\w+)/);
      const tagName = tagMatch ? tagMatch[1].toLowerCase() : '';

      if (/^h[1-6]$/.test(tagName)) {
        inHeading = isClosing ? false : true;
      }
      if (tagName === 'span' && part.includes('data-glossary-tooltip')) {
        inTooltip = true;
      }
      if (isClosing && tagName === 'span' && inTooltip) {
        inTooltip = false;
      }

      result.push(part);
    } else {
      // It's a text node — only replace if not in a heading or tooltip
      if (!inHeading && !inTooltip) {
        const newText = part.replace(regex, (m) => {
          if (replaced) return m;
          replaced = true;
          return replacer(m);
        });
        result.push(newText);
      } else {
        result.push(part);
      }
    }
  }

  return result.join('');
}

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
