/**
 * Where the editor reads and writes posts.
 *
 * In production that is always GitHub: on Vercel the filesystem is a
 * read-only snapshot of the last build, and going through the Contents
 * API means every save is an ordinary commit on main.
 *
 * Locally (`npm run dev`) it is the working tree instead, so the editor
 * can be used and tested without committing anything. The branch is
 * gated on import.meta.env.DEV, which Vite replaces with a literal at
 * build time — in the Vercel build this whole path is dead code and is
 * removed, so a production deployment cannot reach it however it is
 * configured.
 */

import { createHash } from 'node:crypto';
import { readFile as fsRead, writeFile as fsWrite } from 'node:fs/promises';
import { resolve } from 'node:path';
import { GitHubError, readFile as ghRead, writeFile as ghWrite } from './github';

export interface StoredFile {
  text: string;
  sha: string;
}

/** True when posts are read from the working tree rather than GitHub.
 *
 *  The credential is namespaced (STUDIO_GITHUB_TOKEN, not GITHUB_TOKEN)
 *  on purpose: a bare GITHUB_TOKEN is set ambiently by CI runners, dev
 *  containers and the gh CLI, and an editor that silently changes where
 *  it writes because some unrelated tool exported a variable is a trap.
 *  Nothing but this feature sets these names. */
export function isLocal(): boolean {
  return Boolean(import.meta.env.DEV) && !import.meta.env.STUDIO_GITHUB_TOKEN;
}

/** Git's blob id, so a local sha and a GitHub sha mean the same thing
 *  and the conflict check behaves identically in both modes. */
function blobSha(text: string): string {
  const body = Buffer.from(text, 'utf8');
  return createHash('sha1')
    .update(Buffer.concat([Buffer.from(`blob ${body.length}\0`, 'utf8'), body]))
    .digest('hex');
}

/** Resolve a repo-relative path and refuse anything that escapes the
 *  project root, whatever the caller passed. */
function localPath(path: string): string {
  const root = resolve(process.cwd());
  const target = resolve(root, path);
  if (target !== root && !target.startsWith(root + '/')) {
    throw new GitHubError('Refusing to read outside the project.', 400);
  }
  return target;
}

export async function readPost(path: string): Promise<StoredFile> {
  if (!isLocal()) return ghRead(path);
  try {
    const text = await fsRead(localPath(path), 'utf8');
    return { text, sha: blobSha(text) };
  } catch {
    throw new GitHubError('That post no longer exists in the working tree', 404);
  }
}

export async function writePost(
  path: string,
  text: string,
  sha: string,
  message: string,
): Promise<{ sha: string; commit: string }> {
  if (!isLocal()) return ghWrite(path, text, sha, message);

  const current = await readPost(path);
  if (current.sha !== sha) {
    throw new GitHubError('That post changed on disk since you opened it. Reload to pick up the newer version.', 409);
  }
  await fsWrite(localPath(path), text, 'utf8');
  return { sha: blobSha(text), commit: 'local' };
}
