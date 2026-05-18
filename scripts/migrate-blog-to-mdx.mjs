/**
 * One-shot migration: Notion blog → MDX content collection.
 *
 * Reads every page from NOTION_BLOG_DB, converts blocks to markdown via
 * notion-to-md, downloads inline images into the post's folder, copies
 * the existing locally-cached featured webp into the same folder, and
 * writes src/content/blog/<slug>/index.mdx with frontmatter that
 * matches the Zod schema in src/content.config.ts.
 *
 * Idempotent: rerunnable, overwrites in place.
 *
 * Flags:
 *   --dry     Don't write or download anything; just log what would happen.
 *   --slug X  Process only the post with slug X.
 *
 * After running, delete this script and the supporting Notion blog
 * code in src/lib/fetchers.ts + src/lib/blog-image-cache.ts.
 */

import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { stringify as stringifyYaml } from 'yaml';
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  copyFileSync,
  existsSync,
  createWriteStream,
} from 'node:fs';
import { resolve, dirname } from 'node:path';

// ─── env ──────────────────────────────────────────────────────────────
const env = Object.fromEntries(
  readFileSync(resolve(import.meta.dirname, '..', '.env'), 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry');
const slugFilter = (() => {
  const i = process.argv.indexOf('--slug');
  return i >= 0 ? process.argv[i + 1] : null;
})();

const notion = new Client({ auth: env.NOTION_API_KEY });
const DATA_SOURCE_ID = env.NOTION_BLOG_DB;

const REPO_ROOT = resolve(import.meta.dirname, '..');
const CONTENT_DIR = resolve(REPO_ROOT, 'src/content/blog');
const CACHED_IMAGE_DIR = resolve(REPO_ROOT, 'public/images/blog');

// ─── helpers ──────────────────────────────────────────────────────────
const plainText = (rich) => (rich ?? []).map((r) => r.plain_text ?? '').join('');

function getProp(props, name) {
  return props[name] ?? null;
}

function getString(prop) {
  if (!prop) return null;
  if (prop.type === 'title') return plainText(prop.title) || null;
  if (prop.type === 'rich_text') return plainText(prop.rich_text) || null;
  if (prop.type === 'url') return prop.url || null;
  return null;
}

function getSelect(prop) {
  if (!prop || prop.type !== 'select') return null;
  return prop.select?.name ?? null;
}

function getMultiSelect(prop) {
  if (!prop || prop.type !== 'multi_select') return [];
  return (prop.multi_select ?? []).map((s) => s.name);
}

function getDateStart(prop) {
  if (!prop || prop.type !== 'date') return null;
  return prop.date?.start ?? null;
}

function getRelationIds(prop) {
  if (!prop || prop.type !== 'relation') return [];
  return (prop.relation ?? []).map((r) => r.id);
}

// Map content-type / URL → extension. Notion image URLs often lack
// useful extensions; we fall back to inspecting the response header.
function extFromContentType(ct) {
  if (!ct) return 'png';
  if (ct.includes('jpeg')) return 'jpg';
  if (ct.includes('png')) return 'png';
  if (ct.includes('gif')) return 'gif';
  if (ct.includes('webp')) return 'webp';
  if (ct.includes('svg')) return 'svg';
  if (ct.includes('avif')) return 'avif';
  return 'png';
}

function extFromUrl(url) {
  try {
    const u = new URL(url);
    const m = u.pathname.match(/\.([a-z0-9]+)$/i);
    if (m) return m[1].toLowerCase();
  } catch {}
  return null;
}

async function downloadTo(url, destPath) {
  if (dryRun) return { skipped: 'dry-run' };
  // Use global fetch (Node 20+).
  const res = await fetch(url);
  if (!res.ok) {
    return { error: `HTTP ${res.status}` };
  }
  const buf = Buffer.from(await res.arrayBuffer());
  mkdirSync(dirname(destPath), { recursive: true });
  writeFileSync(destPath, buf);
  return { ok: true, contentType: res.headers.get('content-type') };
}

// ─── per-post image counter ──────────────────────────────────────────
let currentPostDir = '';
let imageCounter = 0;
const imageFailures = [];

const n2m = new NotionToMarkdown({ notionClient: notion });

// Custom image transformer — downloads to per-post folder, rewrites the
// markdown ref to the relative co-located path.
n2m.setCustomTransformer('image', async (block) => {
  const img = block.image;
  const url = img.type === 'external' ? img.external.url : img.file.url;
  const caption = plainText(img.caption);
  imageCounter += 1;
  const n = String(imageCounter).padStart(2, '0');
  let ext = extFromUrl(url) || 'png';
  // Notion S3 URLs always have an extension in the path; trust it.
  const filename = `${n}.${ext}`;
  const destPath = resolve(currentPostDir, filename);
  const res = await downloadTo(url, destPath);
  if (res?.error) {
    imageFailures.push({ post: currentPostDir, url, err: res.error });
    return `<!-- image failed: ${res.error} -->`;
  }
  return `![${caption}](./${filename})`;
});

// ─── main ────────────────────────────────────────────────────────────
const allPages = [];
let cursor;
do {
  const r = await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID,
    page_size: 100,
    start_cursor: cursor,
  });
  allPages.push(...r.results);
  cursor = r.has_more ? r.next_cursor : undefined;
} while (cursor);

console.log(`Found ${allPages.length} blog records.`);

const summary = {
  written: 0,
  skipped: 0,
  imageFailures: 0,
  posts: [],
};

for (const page of allPages) {
  const props = page.properties;
  const slug = getString(getProp(props, 'Slug'));
  const title = getString(getProp(props, 'Title')) || '(untitled)';
  const status = getSelect(getProp(props, 'Status'));

  if (!slug) {
    console.log(`  ⚠ skip — no slug: ${title}`);
    summary.skipped++;
    continue;
  }
  if (slugFilter && slug !== slugFilter) continue;

  // Mirror BlogPost shape into the new frontmatter schema.
  const frontmatter = {
    title,
    status: status || 'Draft',
    publishedDate: getDateStart(getProp(props, 'Published Date')),
    author: getString(getProp(props, 'Author')) || 'Gareth Esson',
    category: getSelect(getProp(props, 'Category')),
    targetAudience: getSelect(getProp(props, 'Target Audience')),
    contentTags: getMultiSelect(getProp(props, 'Content Tags')),
    topicIds: getRelationIds(getProp(props, 'Topic')),
    secondaryTopicIds: getRelationIds(getProp(props, 'Secondary Topics')),
    serviceLink: getSelect(getProp(props, 'Service Link')),
    metaTitle: getString(getProp(props, 'Meta Title')) || '',
    metaDescription: getString(getProp(props, 'Meta Description')) || '',
    featuredImage: null, // populated below
    imageCredit: getString(getProp(props, 'Image Credit')),
    imageCreditUrl: getString(getProp(props, 'Image Credit URL')),
  };

  const postDir = resolve(CONTENT_DIR, slug);
  currentPostDir = postDir;
  imageCounter = 0;

  if (!dryRun) mkdirSync(postDir, { recursive: true });

  // ── featured image — prefer existing local cache.
  const featuredCachedPath = resolve(CACHED_IMAGE_DIR, `${slug}.webp`);
  const featuredRemoteUrl = getString(getProp(props, 'Featured Image'));
  let featuredFile = null;
  if (existsSync(featuredCachedPath)) {
    const dest = resolve(postDir, 'featured.webp');
    if (!dryRun) copyFileSync(featuredCachedPath, dest);
    featuredFile = './featured.webp';
  } else if (featuredRemoteUrl) {
    const ext = extFromUrl(featuredRemoteUrl) || 'jpg';
    const dest = resolve(postDir, `featured.${ext}`);
    const res = await downloadTo(featuredRemoteUrl, dest);
    if (res?.error) {
      console.log(`  ⚠ featured-image fetch failed for ${slug}: ${res.error}`);
    } else {
      featuredFile = `./featured.${ext}`;
    }
  }
  frontmatter.featuredImage = featuredFile;

  // ── body
  const mdBlocks = await n2m.pageToMarkdown(page.id);
  let body = n2m.toMarkdownString(mdBlocks).parent || '';

  // Rewrite Notion-internal links the author wrote as site paths
  // (e.g. https://www.notion.so/topics/consent → /topics/consent).
  body = body.replace(/https?:\/\/(?:www\.)?notion\.so\//g, '/');

  // ── write
  const yaml = stringifyYaml(frontmatter, {
    lineWidth: 0,
    defaultStringType: 'QUOTE_DOUBLE',
    defaultKeyType: 'PLAIN',
  });
  const fileContent = `---\n${yaml}---\n\n${body.trim()}\n`;
  const filePath = resolve(postDir, 'index.mdx');

  if (dryRun) {
    console.log(
      `  · would write ${filePath.replace(REPO_ROOT + '/', '')}  (body ${body.length} chars, ${imageCounter} body images)`,
    );
  } else {
    writeFileSync(filePath, fileContent);
    console.log(
      `  ✓ wrote   ${filePath.replace(REPO_ROOT + '/', '')}  (body ${body.length} chars, ${imageCounter} body images)`,
    );
  }
  summary.written++;
  summary.posts.push({ slug, title, bodyChars: body.length, images: imageCounter });
}

summary.imageFailures = imageFailures.length;
console.log('\n─── DONE ────────────────────────────────');
console.log(JSON.stringify(summary, null, 2));
if (imageFailures.length) {
  console.log('\nImage failures:');
  for (const f of imageFailures) {
    console.log(`  - ${f.post}\n    ${f.url}\n    ${f.err}`);
  }
}
