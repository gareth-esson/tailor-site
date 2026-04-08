/**
 * Render Notion block objects to HTML strings.
 * Handles the rich text annotations and common block types
 * used in question answers and glossary explainers.
 */
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

type RichText = {
  type: string;
  plain_text: string;
  href: string | null;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
};

function renderRichText(richTexts: RichText[]): string {
  return richTexts
    .map((rt) => {
      let text = escapeHtml(rt.plain_text);
      const a = rt.annotations;
      if (a.bold) text = `<strong>${text}</strong>`;
      if (a.italic) text = `<em>${text}</em>`;
      if (a.strikethrough) text = `<s>${text}</s>`;
      if (a.underline) text = `<u>${text}</u>`;
      if (a.code) text = `<code>${text}</code>`;
      if (rt.href) text = `<a href="${escapeAttr(rt.href)}">${text}</a>`;
      return text;
    })
    .join('');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str: string): string {
  return str.replace(/"/g, '&quot;').replace(/&/g, '&amp;');
}

/**
 * @param blocks  Notion block objects to render.
 * @param options.headingOffset  How many levels to shift Notion headings down.
 *   Default `1`: heading_1→h2, heading_2→h3, heading_3→h4.
 *   Use `0` when the prose sits directly under an h1 (e.g. C3 landing pages)
 *   so that heading_1→h1, heading_2→h2, heading_3→h3.
 */
export function renderBlocks(
  blocks: BlockObjectResponse[],
  options: { headingOffset?: number } = {},
): string {
  const offset = options.headingOffset ?? 1;
  const parts: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  // Clamp heading level to 1–6
  const h = (notionLevel: number) => `h${Math.min(notionLevel + offset, 6)}`;

  for (const block of blocks) {
    const type = block.type;

    // Close open list if this block isn't a list item of the same type
    if (listType && type !== 'bulleted_list_item' && type !== 'numbered_list_item') {
      parts.push(listType === 'ul' ? '</ul>' : '</ol>');
      listType = null;
    }

    switch (type) {
      case 'paragraph': {
        const rt = (block as any).paragraph.rich_text;
        const html = renderRichText(rt);
        if (html) parts.push(`<p>${html}</p>`);
        break;
      }
      case 'heading_1': {
        const rt = (block as any).heading_1.rich_text;
        const tag = h(1);
        parts.push(`<${tag}>${renderRichText(rt)}</${tag}>`);
        break;
      }
      case 'heading_2': {
        const rt = (block as any).heading_2.rich_text;
        const tag = h(2);
        parts.push(`<${tag}>${renderRichText(rt)}</${tag}>`);
        break;
      }
      case 'heading_3': {
        const rt = (block as any).heading_3.rich_text;
        const tag = h(3);
        parts.push(`<${tag}>${renderRichText(rt)}</${tag}>`);
        break;
      }
      case 'bulleted_list_item': {
        if (listType !== 'ul') {
          if (listType) parts.push('</ol>');
          parts.push('<ul>');
          listType = 'ul';
        }
        const rt = (block as any).bulleted_list_item.rich_text;
        parts.push(`<li>${renderRichText(rt)}</li>`);
        break;
      }
      case 'numbered_list_item': {
        if (listType !== 'ol') {
          if (listType) parts.push('</ul>');
          parts.push('<ol>');
          listType = 'ol';
        }
        const rt = (block as any).numbered_list_item.rich_text;
        parts.push(`<li>${renderRichText(rt)}</li>`);
        break;
      }
      case 'quote': {
        const rt = (block as any).quote.rich_text;
        parts.push(`<blockquote>${renderRichText(rt)}</blockquote>`);
        break;
      }
      case 'callout': {
        const rt = (block as any).callout.rich_text;
        const icon = (block as any).callout.icon;
        const emoji = icon?.type === 'emoji' ? icon.emoji : '';
        parts.push(`<aside class="callout">${emoji ? `<span class="callout__icon">${emoji}</span> ` : ''}${renderRichText(rt)}</aside>`);
        break;
      }
      case 'divider': {
        parts.push('<hr>');
        break;
      }
      case 'image': {
        const img = (block as any).image;
        const url = img.type === 'external' ? img.external.url : img.file?.url;
        const caption = img.caption ? renderRichText(img.caption) : '';
        if (url) {
          parts.push(`<figure><img src="${escapeAttr(url)}" alt="${caption ? caption.replace(/<[^>]*>/g, '') : ''}" loading="lazy" />${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`);
        }
        break;
      }
      case 'video': {
        const video = (block as any).video;
        const url = video.type === 'external' ? video.external.url : video.file?.url;
        if (url) {
          // YouTube/Vimeo embeds
          if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.includes('youtu.be')
              ? url.split('/').pop()
              : new URL(url).searchParams.get('v');
            if (videoId) {
              parts.push(`<div class="video-embed"><iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen loading="lazy"></iframe></div>`);
            }
          } else {
            parts.push(`<video src="${escapeAttr(url)}" controls></video>`);
          }
        }
        break;
      }
      // Skip unsupported block types silently
    }
  }

  // Close any trailing list
  if (listType) {
    parts.push(listType === 'ul' ? '</ul>' : '</ol>');
  }

  return parts.join('\n');
}
