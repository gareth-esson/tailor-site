export const prerender = false;

import type { APIRoute } from 'astro';
import { parseFile, serialiseFile, toObject } from '../../../lib/studio/frontmatter.js';
import { docSignature, docToMarkdown, markdownToDoc } from '../../../lib/studio/markdown.js';
import { validatePatch } from '../../../lib/studio/schema.js';
import { isValidSlug, postPath } from '../../../lib/studio/github';
import { readPost, writePost } from '../../../lib/studio/store';
import { errorResponse, json, readJson, requireSession } from './_shared';

/** GET /api/studio/post?slug=… — the post as the editor needs it. */
export const GET: APIRoute = async ({ request, url }) => {
  const denied = requireSession(request);
  if (denied) return denied;

  const slug = url.searchParams.get('slug');
  if (!isValidSlug(slug)) return json({ error: 'Unknown post.' }, 400);

  try {
    const { text, sha } = await readPost(postPath(slug));
    const { fields, body } = parseFile(text);
    const doc = markdownToDoc(body);

    // If the body doesn't survive a round trip through the editor's
    // document model, say so rather than quietly handing back something
    // that would rewrite the post on save. The editor drops to plain
    // Markdown when this is false.
    const lossless = docToMarkdown(markdownToDoc(docToMarkdown(doc))) === docToMarkdown(doc);

    return json({
      slug,
      sha,
      frontmatter: toObject(fields),
      doc,
      markdown: body,
      lossless,
    });
  } catch (err) {
    return errorResponse('post GET', err);
  }
};

/** PUT /api/studio/post — validate, then commit. */
export const PUT: APIRoute = async ({ request }) => {
  const denied = requireSession(request);
  if (denied) return denied;

  const body = await readJson(request);
  if (body instanceof Response) return body;

  const { slug, sha, frontmatter, doc, markdown } = body as {
    slug?: unknown;
    sha?: unknown;
    frontmatter?: unknown;
    doc?: unknown;
    markdown?: unknown;
  };

  if (!isValidSlug(slug)) return json({ error: 'Unknown post.' }, 400);
  if (typeof sha !== 'string' || sha.length === 0) {
    return json({ error: 'Missing the version this edit was based on. Reload the post.' }, 400);
  }
  if (frontmatter !== undefined && (typeof frontmatter !== 'object' || frontmatter === null || Array.isArray(frontmatter))) {
    return json({ error: 'Invalid frontmatter.' }, 400);
  }

  const patchResult = validatePatch((frontmatter ?? {}) as Record<string, unknown>);
  if (!patchResult.ok) return json({ error: patchResult.errors.join(' ') }, 422);

  try {
    const current = await readPost(postPath(slug));
    if (current.sha !== sha) {
      return json(
        {
          error:
            'This post changed on the branch since you opened it. Reload to pick up the newer version — your text is still in the editor until you do.',
          conflict: true,
        },
        409,
      );
    }

    const { fields, body: currentBody } = parseFile(current.text);

    // Work out the new body, preferring not to touch it at all. A save
    // that only changed metadata must leave the prose bytes alone, and a
    // body whose meaning is unchanged keeps its original spacing rather
    // than being reflowed into the serialiser's house style. The corpus
    // has inconsistent blank-line spacing from the Notion migration;
    // normalising it all at once would bury real edits in the diff.
    let newBody = currentBody;
    let bodyChanged = false;
    if (doc !== undefined || markdown !== undefined) {
      const proposed =
        doc !== undefined
          ? docToMarkdown(doc as { content?: Array<object> })
          : docToMarkdown(markdownToDoc(String(markdown)));
      // Prove the Markdown reproduces what the editor sent before it
      // goes anywhere near a commit. See docSignature for why this can
      // fail: emphasis butted against a word boundary serialises to
      // asterisks that read back as literal text. Refusing is the only
      // honest option — the alternative is committing a post with
      // formatting silently missing.
      if (doc !== undefined) {
        const sent = docSignature(doc as { content?: Array<object> });
        const reparsed = docSignature(markdownToDoc(proposed));
        if (sent !== reparsed) {
          return json(
            {
              error:
                'Some formatting in this post can’t be written to Markdown unambiguously — usually bold or italic that starts or ends mid-word. Add a space around it, or switch to the Markdown view to write it directly. Nothing has been saved.',
            },
            422,
          );
        }
      }

      if (proposed !== docToMarkdown(markdownToDoc(currentBody))) {
        newBody = proposed;
        bodyChanged = true;
      }
    }

    const changedFields = Object.keys(patchResult.value).filter((key) => {
      const before = fields.find((f) => f.key === key)?.value ?? null;
      const after = patchResult.value[key];
      if (Array.isArray(before) || Array.isArray(after)) {
        return JSON.stringify(before ?? []) !== JSON.stringify(after ?? []);
      }
      return (before ?? '') !== (after ?? '');
    });

    const nextText = serialiseFile(fields, patchResult.value, newBody);
    if (nextText === current.text) {
      return json({ ok: true, sha: current.sha, unchanged: true });
    }

    const written = await writePost(postPath(slug), nextText, current.sha, commitMessage(slug, changedFields, bodyChanged));
    return json({ ok: true, sha: written.sha, commit: written.commit, bodyChanged, changedFields });
  } catch (err) {
    return errorResponse('post PUT', err);
  }
};

/** Commit messages in this repo are imperative and topical, with a body
 *  carrying the concrete detail. Keep editor commits in the same shape
 *  so `git log` reads the same whoever made the change. */
function commitMessage(slug: string, changedFields: string[], bodyChanged: boolean): string {
  const subject = bodyChanged
    ? `Blog: edit the ${slug} post`
    : `Blog: update metadata on the ${slug} post`;

  const detail: string[] = [];
  if (bodyChanged) detail.push('Body text edited.');
  if (changedFields.length) detail.push(`Frontmatter changed: ${changedFields.join(', ')}.`);
  detail.push('Edited in the site post editor (/studio).');

  return `${subject}\n\n${detail.join('\n')}\n`;
}
