/**
 * GitHub Contents API client for the post editor.
 *
 * Posts are read and written through GitHub rather than the local
 * filesystem because on Vercel the filesystem is a read-only snapshot of
 * the last build. Going through the API also means every save is an
 * ordinary commit on main — same history, same blame, same review trail
 * as an edit made from a terminal.
 *
 * Each read returns the blob's SHA and each write requires it back. That
 * is the concurrency guard: three people edit these files (the browser,
 * Claude, Codex), and a stale SHA gets a 409 from GitHub rather than
 * silently overwriting whoever committed last.
 */

const API = 'https://api.github.com';

export class GitHubError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'GitHubError';
    this.status = status;
  }
}

function config() {
  const token = import.meta.env.STUDIO_GITHUB_TOKEN;
  const repo = import.meta.env.STUDIO_GITHUB_REPO;
  if (!token || !repo) throw new GitHubError('GitHub access is not configured', 503);
  return { token, repo, branch: import.meta.env.STUDIO_GITHUB_BRANCH || 'main' };
}

async function call(path: string, init: RequestInit = {}): Promise<Response> {
  const { token } = config();
  return fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'tailor-site-studio',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers ?? {}),
    },
  });
}

export interface FileContents {
  text: string;
  sha: string;
}

export async function readFile(path: string): Promise<FileContents> {
  const { repo, branch } = config();
  const res = await call(`/repos/${repo}/contents/${encodeURI(path)}?ref=${encodeURIComponent(branch)}`);
  if (res.status === 404) throw new GitHubError('That post no longer exists on the branch', 404);
  if (!res.ok) throw new GitHubError(await describe(res), res.status);

  const body = (await res.json()) as { content?: string; encoding?: string; sha?: string };
  if (!body.content || !body.sha) throw new GitHubError('Unexpected response reading the post', 502);
  return { text: Buffer.from(body.content, 'base64').toString('utf8'), sha: body.sha };
}

export async function writeFile(
  path: string,
  text: string,
  sha: string,
  message: string,
): Promise<{ sha: string; commit: string }> {
  const { repo, branch } = config();
  const res = await call(`/repos/${repo}/contents/${encodeURI(path)}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: Buffer.from(text, 'utf8').toString('base64'),
      sha,
      branch,
    }),
  });

  // 409 (and 422 on some paths) is GitHub telling us the blob moved
  // under us — someone else committed to this file since it was opened.
  if (res.status === 409 || res.status === 422) {
    throw new GitHubError(
      'This post changed on the branch since you opened it. Reload to pick up the newer version — your text is still in the editor until you do.',
      409,
    );
  }
  if (!res.ok) throw new GitHubError(await describe(res), res.status);

  const body = (await res.json()) as { content?: { sha?: string }; commit?: { sha?: string } };
  return { sha: body.content?.sha ?? '', commit: body.commit?.sha ?? '' };
}

async function describe(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string };
    return body.message ? `GitHub: ${body.message}` : `GitHub returned ${res.status}`;
  } catch {
    return `GitHub returned ${res.status}`;
  }
}

/** Path of a post's source file from its slug. Slugs are validated
 *  before they reach here — this must never build a path from raw
 *  user input. */
export function postPath(slug: string): string {
  return `src/content/blog/${slug}/index.mdx`;
}

/** Blog slugs are directory names: lowercase, digits, hyphens. Anything
 *  else is rejected rather than escaped, which rules out traversal. */
export function isValidSlug(value: unknown): value is string {
  return typeof value === 'string' && /^[a-z0-9][a-z0-9-]{0,120}$/.test(value);
}
