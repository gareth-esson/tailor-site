/**
 * Markdown ⇄ editor-document conversion for the post editor.
 *
 * The editor is TipTap (ProseMirror), which speaks a JSON document
 * shape. Converting through HTML would need a DOM, so instead this maps
 * marked's token tree straight to ProseMirror JSON and back. Pure JS,
 * runs in node, which is what lets tests/studio-roundtrip.test.mjs check
 * the conversion against every real post in the repo.
 *
 * The schema is deliberately small: it covers exactly what the blog
 * corpus uses (headings, bold, italic, inline code, links, lists,
 * blockquotes) and nothing else. Anything richer that gets pasted in is
 * flattened to those marks rather than written into the file as syntax
 * the Astro templates don't style.
 */

import { marked } from 'marked';

/** Heading levels the blog body allows. H1 is the frontmatter title, so
 *  a pasted H1 is demoted rather than competing with it. */
const MIN_HEADING = 2;
const MAX_HEADING = 4;

/* ── Markdown → document ─────────────────────────────────────────── */

/**
 * @param {string} md
 * @returns {{type: 'doc', content: Array<object>}}
 */
export function markdownToDoc(md) {
  const tokens = marked.lexer(md.replace(/\r\n/g, '\n'));
  const content = blocksFromTokens(tokens);
  // ProseMirror requires at least one block node.
  return { type: 'doc', content: content.length ? content : [{ type: 'paragraph' }] };
}

function blocksFromTokens(tokens) {
  const out = [];
  for (const token of tokens) {
    const node = blockFromToken(token);
    if (Array.isArray(node)) out.push(...node);
    else if (node) out.push(node);
  }
  return out;
}

function blockFromToken(token) {
  switch (token.type) {
    case 'space':
      return null;

    case 'heading': {
      const level = Math.min(MAX_HEADING, Math.max(MIN_HEADING, token.depth));
      const content = inlineFromTokens(token.tokens ?? []);
      if (!content.length) return null;
      return { type: 'heading', attrs: { level }, content };
    }

    case 'paragraph':
    case 'text': {
      const content = inlineFromTokens(token.tokens ?? [{ type: 'text', raw: token.text, text: token.text }]);
      if (!content.length) return null;
      return { type: 'paragraph', content };
    }

    case 'blockquote':
      return { type: 'blockquote', content: nonEmpty(blocksFromTokens(token.tokens ?? [])) };

    case 'list': {
      const type = token.ordered ? 'orderedList' : 'bulletList';
      const node = {
        type,
        content: (token.items ?? []).map((item) => ({
          type: 'listItem',
          content: nonEmpty(blocksFromTokens(item.tokens ?? [])),
        })),
      };
      if (token.ordered && token.start && token.start !== 1) node.attrs = { start: token.start };
      return node;
    }

    // Anything the schema doesn't model (tables, code fences, raw HTML,
    // images, rules) is flattened to its text rather than dropped —
    // losing a reader's words silently would be worse than losing the
    // formatting. Nothing in the current corpus takes this branch.
    case 'code':
      return { type: 'paragraph', content: [{ type: 'text', text: token.text }] };

    case 'hr':
      return null;

    default: {
      const text = (token.raw ?? '').trim();
      return text ? { type: 'paragraph', content: [{ type: 'text', text }] } : null;
    }
  }
}

/** ProseMirror rejects empty block containers; give them a paragraph. */
function nonEmpty(content) {
  return content.length ? content : [{ type: 'paragraph' }];
}

function inlineFromTokens(tokens, marks = []) {
  const out = [];
  for (const token of tokens) {
    switch (token.type) {
      case 'strong':
        out.push(...inlineFromTokens(token.tokens ?? [], addMark(marks, { type: 'bold' })));
        break;
      case 'em':
        out.push(...inlineFromTokens(token.tokens ?? [], addMark(marks, { type: 'italic' })));
        break;
      case 'del':
        out.push(...inlineFromTokens(token.tokens ?? [], marks));
        break;
      case 'codespan':
        out.push(textNode(decode(token.text), addMark(marks, { type: 'code' })));
        break;
      case 'link':
        out.push(
          ...inlineFromTokens(token.tokens ?? [], addMark(marks, { type: 'link', attrs: { href: token.href } })),
        );
        break;
      case 'br':
        out.push({ type: 'hardBreak' });
        break;
      case 'escape':
      case 'text':
        out.push(textNode(decode(token.text ?? ''), marks));
        break;
      case 'image':
        // No inline images anywhere in the corpus; keep the alt text
        // rather than emit syntax the editor can't show.
        out.push(textNode(token.text ?? '', marks));
        break;
      default:
        out.push(textNode(decode(token.raw ?? token.text ?? ''), marks));
    }
  }
  return mergeAdjacent(out.filter((n) => n.type !== 'text' || n.text.length > 0));
}

/** Fuse neighbouring text nodes that carry the same marks. marked emits
 *  an escaped character as its own token, so "a \\* b" arrives as three
 *  fragments; ProseMirror would join them itself when building a real
 *  document, and doing it here keeps the JSON comparable either way. */
function mergeAdjacent(nodes) {
  const out = [];
  for (const node of nodes) {
    const previous = out[out.length - 1];
    if (
      previous &&
      previous.type === 'text' &&
      node.type === 'text' &&
      sameMarkSet(previous.marks, node.marks)
    ) {
      previous.text += node.text;
      continue;
    }
    out.push(node);
  }
  return out;
}

function sameMarkSet(a = [], b = []) {
  if (a.length !== b.length) return false;
  return a.every((mark, i) => sameMark(mark, b[i]));
}

function addMark(marks, mark) {
  return [...marks, mark];
}

function textNode(text, marks) {
  const node = { type: 'text', text };
  if (marks.length) node.marks = marks.map((m) => ({ ...m }));
  return node;
}

/** marked HTML-encodes a few characters in token text; undo that so the
 *  document holds the author's actual characters. */
function decode(text) {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

/* ── Document → Markdown ─────────────────────────────────────────── */

/**
 * @param {{content?: Array<object>}} doc
 * @returns {string}
 */
export function docToMarkdown(doc) {
  const blocks = (doc?.content ?? []).map((node) => blockToMarkdown(node)).filter((s) => s !== null && s !== '');
  return blocks.join('\n\n').replace(/\s*$/, '') + '\n';
}

function blockToMarkdown(node) {
  switch (node.type) {
    case 'heading': {
      const level = Math.min(MAX_HEADING, Math.max(MIN_HEADING, node.attrs?.level ?? MIN_HEADING));
      return `${'#'.repeat(level)} ${inlineToMarkdown(node.content ?? [])}`;
    }

    case 'paragraph':
      return inlineToMarkdown(node.content ?? []);

    case 'blockquote': {
      // Every line of a quoted block carries the marker. Blank lines get
      // a bare '>' (no trailing space); content lines keep the space, so
      // a list nested inside a quote still reads as '> - item'.
      const inner = (node.content ?? []).map(blockToMarkdown).filter(Boolean).join('\n\n');
      return inner
        .split('\n')
        .map((line) => (line === '' ? '>' : `> ${line}`))
        .join('\n');
    }

    case 'bulletList':
    case 'orderedList': {
      const ordered = node.type === 'orderedList';
      const start = ordered ? (node.attrs?.start ?? 1) : 0;
      return (node.content ?? [])
        .map((item, i) => {
          const marker = ordered ? `${start + i}. ` : '- ';
          const inner = (item.content ?? []).map(blockToMarkdown).filter(Boolean).join('\n\n');
          const pad = ' '.repeat(marker.length);
          return prefixLines(inner, marker, pad, true);
        })
        .join('\n');
    }

    case 'hardBreak':
      return '';

    default:
      return node.content ? (node.content ?? []).map(blockToMarkdown).filter(Boolean).join('\n\n') : '';
  }
}

/** Prefix every line of a block. `first` marks the first line when the
 *  marker differs from the continuation padding (list items). */
function prefixLines(text, firstPrefix, contPrefix, markerStyle = false) {
  const lines = text.split('\n');
  return lines
    .map((line, i) => {
      if (i === 0) return firstPrefix + line;
      if (line === '') return markerStyle ? '' : contPrefix;
      return contPrefix + line;
    })
    .join('\n');
}

function inlineToMarkdown(nodes) {
  let out = '';
  /** @type {Array<object>} */
  let open = [];

  const close = (count) => {
    for (let i = 0; i < count; i += 1) out += markClose(open.pop());
  };

  for (const node of nodes) {
    if (node.type === 'hardBreak') {
      close(open.length);
      out += '\\\n';
      continue;
    }
    if (node.type !== 'text') continue;

    const marks = node.marks ?? [];
    // Close marks that don't continue into this node, innermost first.
    let shared = 0;
    while (shared < open.length && shared < marks.length && sameMark(open[shared], marks[shared])) shared += 1;
    close(open.length - shared);
    for (let i = shared; i < marks.length; i += 1) {
      out += markOpen(marks[i]);
      open.push(marks[i]);
    }
    out += open.some((m) => m.type === 'code') ? node.text : escapeText(node.text);
  }
  close(open.length);
  return out;
}

function sameMark(a, b) {
  if (a.type !== b.type) return false;
  if (a.type === 'link') return (a.attrs?.href ?? '') === (b.attrs?.href ?? '');
  return true;
}

function markOpen(mark) {
  switch (mark.type) {
    case 'bold':
      return '**';
    case 'italic':
      return '_';
    case 'code':
      return '`';
    case 'link':
      return '[';
    default:
      return '';
  }
}

function markClose(mark) {
  switch (mark.type) {
    case 'bold':
      return '**';
    case 'italic':
      return '_';
    case 'code':
      return '`';
    case 'link':
      return `](${mark.attrs?.href ?? ''})`;
    default:
      return '';
  }
}

/**
 * Escape only what would otherwise be read back as syntax. Deliberately
 * conservative: over-escaping would sprinkle backslashes through prose
 * on the first save and make the diff unreadable. The corpus contains no
 * escapes today and this keeps it that way.
 */
function escapeText(text) {
  let out = text
    .replace(/\\/g, '\\\\')
    .replace(/([*`[\]])/g, '\\$1')
    // Underscores only where they could open or close emphasis — a word
    // boundary on one side. Leaves snake_case identifiers alone.
    .replace(/(^|\s)_/g, '$1\\_')
    .replace(/_(?=\s|$)/g, '\\_');
  // Line-leading characters that would start a block.
  out = out.replace(/^(\s*)(#{1,6}\s|>|[-+*]\s|\d+\.\s)/, (_m, ws, tok) => `${ws}\\${tok}`);
  return out;
}

/* ── Round-trip safety ───────────────────────────────────────────── */

/**
 * A comparable fingerprint of a document's text and formatting.
 *
 * Used to prove that the Markdown about to be committed actually
 * reproduces the document the editor sent. Markdown emphasis has
 * flanking rules: `**bold**` immediately followed by a letter is not
 * emphasis at all, so a mark applied across an awkward boundary can
 * serialise to asterisks that read back as literal text. Rather than
 * let that quietly drop someone's formatting, the save compares
 * fingerprints and refuses.
 *
 * Deliberately ignores block nesting and mark order — it is checking
 * that no text or formatting was lost, not that two objects are equal.
 */
export function docSignature(doc) {
  const parts = [];

  const walk = (node) => {
    if (!node) return;
    if (node.type === 'text') {
      const marks = (node.marks ?? [])
        .map((m) => (m.type === 'link' ? `link:${m.attrs?.href ?? ''}` : m.type))
        // Only marks this schema can express survive a save; anything
        // else (TipTap internals, pasted leftovers) is not a difference
        // worth refusing over.
        .filter((m) => m === 'bold' || m === 'italic' || m === 'code' || m.startsWith('link:'))
        .sort();
      parts.push(`${marks.join('+')}|${node.text}`);
      return;
    }
    if (node.type === 'heading') parts.push(`#${node.attrs?.level ?? 2}`);
    if (node.type === 'listItem') parts.push('-');
    for (const child of node.content ?? []) walk(child);
  };

  for (const block of doc?.content ?? []) walk(block);
  // Collapse whitespace: the serialiser is allowed to re-wrap and
  // re-space, it is not allowed to change words or formatting.
  return parts.join('\u0000').replace(/[ \t]+/g, ' ');
}
