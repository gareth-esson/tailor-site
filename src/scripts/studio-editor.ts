/**
 * Post editor behaviour (/studio/<slug>).
 *
 * Loads the post live from GitHub via /api/studio/post, hands the body
 * to TipTap as a ProseMirror document, and sends it back as a document
 * on save. The Markdown conversion in both directions lives in
 * src/lib/studio/markdown.js so the server can run the same code — the
 * browser never decides what the file looks like on disk.
 *
 * The editor schema is deliberately smaller than TipTap's defaults:
 * headings h2–h4, bold, italic, inline code, links, lists, blockquotes.
 * Code blocks, rules, strikethrough and underline are switched off, so
 * pasted content can only land as formatting the blog templates
 * actually style. Anything richer is flattened, never written to the
 * file as syntax the site would render as literal text.
 */

import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extensions';
import { docToMarkdown, markdownToDoc } from '../lib/studio/markdown.js';

interface LoadedPost {
  slug: string;
  sha: string;
  frontmatter: Record<string, unknown>;
  doc: { type: string; content?: Array<object> };
  markdown: string;
  lossless: boolean;
}

export function initStudioEditor(slug: string): void {
  const host = document.getElementById('studio-editor');
  const toolbar = document.getElementById('studio-toolbar');
  const saveButton = document.getElementById('studio-save') as HTMLButtonElement | null;
  const statusEl = document.getElementById('studio-save-status');
  const titleEl = document.getElementById('studio-bar-title');
  const sourceEl = document.getElementById('studio-source') as HTMLTextAreaElement | null;
  if (!host || !saveButton || !statusEl) return;

  let editor: Editor | null = null;
  let sha = '';
  let dirty = false;
  let sourceMode = false;
  let loaded: LoadedPost | null = null;

  /* ── Status line ─────────────────────────────────────────────── */

  const setStatus = (text: string) => {
    statusEl.textContent = text;
  };

  const markDirty = () => {
    if (dirty) return;
    dirty = true;
    setStatus('Unsaved changes');
    saveButton.disabled = false;
  };

  const markClean = (text: string) => {
    dirty = false;
    setStatus(text);
    saveButton.disabled = true;
  };

  // A half-written paragraph is only in the browser until it's committed,
  // so a stray Cmd-W must not take it silently.
  window.addEventListener('beforeunload', (event) => {
    if (!dirty) return;
    event.preventDefault();
    event.returnValue = '';
  });

  /* ── Frontmatter form ────────────────────────────────────────── */

  const fieldInputs = Array.from(
    document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[data-field]'),
  );
  let tags: string[] = [];

  const tagList = document.getElementById('studio-tags');
  const tagInput = document.getElementById('studio-tag-input') as HTMLInputElement | null;

  const renderTags = () => {
    if (!tagList) return;
    tagList.textContent = '';
    tags.forEach((tag, index) => {
      const chip = document.createElement('span');
      chip.className = 'chip chip--removable';
      chip.textContent = tag;

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'studio__tag-remove';
      remove.setAttribute('aria-label', `Remove tag ${tag}`);
      remove.textContent = '×';
      remove.addEventListener('click', () => {
        tags.splice(index, 1);
        renderTags();
        markDirty();
      });

      chip.appendChild(remove);
      tagList.appendChild(chip);
    });
  };

  tagInput?.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ',') return;
    event.preventDefault();
    const value = tagInput.value.trim().replace(/,$/, '');
    if (!value || tags.includes(value)) {
      tagInput.value = '';
      return;
    }
    tags.push(value);
    tagInput.value = '';
    renderTags();
    markDirty();
  });

  for (const input of fieldInputs) {
    input.addEventListener('input', markDirty);
    input.addEventListener('change', markDirty);
  }

  document.getElementById('studio-touch-date')?.addEventListener('click', () => {
    const field = document.querySelector<HTMLInputElement>('[data-field="dateModified"]');
    if (!field) return;
    field.value = new Date().toISOString().slice(0, 10);
    markDirty();
  });

  const readForm = (): Record<string, unknown> => {
    const out: Record<string, unknown> = { contentTags: tags };
    for (const input of fieldInputs) {
      const key = input.dataset.field;
      if (!key) continue;
      // A checkbox must post a real boolean: the collection schema is
      // z.boolean(), and its .value is the string "on" either way.
      out[key] =
        input instanceof HTMLInputElement && input.type === 'checkbox' ? input.checked : input.value;
    }
    return out;
  };

  const fillForm = (frontmatter: Record<string, unknown>) => {
    for (const input of fieldInputs) {
      const key = input.dataset.field;
      if (!key) continue;
      const value = frontmatter[key];
      if (input instanceof HTMLInputElement && input.type === 'checkbox') {
        input.checked = value === true;
        continue;
      }
      input.value = value === null || value === undefined ? '' : String(value);
    }
    tags = Array.isArray(frontmatter.contentTags) ? (frontmatter.contentTags as string[]).slice() : [];
    renderTags();
    if (titleEl) titleEl.textContent = String(frontmatter.title ?? slug);
  };

  document.querySelector<HTMLInputElement>('[data-field="title"]')?.addEventListener('input', (event) => {
    if (titleEl) titleEl.textContent = (event.target as HTMLInputElement).value || slug;
  });

  /* ── Toolbar ─────────────────────────────────────────────────── */

  const syncToolbar = () => {
    if (!editor || !toolbar) return;
    for (const button of toolbar.querySelectorAll<HTMLButtonElement>('[data-mark], [data-node]')) {
      const mark = button.dataset.mark;
      const node = button.dataset.node;
      const level = button.dataset.level ? Number(button.dataset.level) : undefined;
      const active = mark
        ? editor.isActive(mark)
        : node
          ? editor.isActive(node, level ? { level } : undefined)
          : false;
      button.setAttribute('aria-pressed', String(active));
    }
  };

  // Pressing a toolbar button must not steal the selection. Without
  // this, mousedown collapses the cursor inside the document before the
  // click handler runs, so "select some words, press Bold" quietly does
  // nothing — the command applies to an empty selection.
  toolbar?.addEventListener('mousedown', (event) => {
    if ((event.target as HTMLElement).closest('button')) event.preventDefault();
  });

  toolbar?.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]');
    if (!button || !editor) return;
    const chain = editor.chain().focus();

    switch (button.dataset.action) {
      case 'bold':
        chain.toggleBold().run();
        break;
      case 'italic':
        chain.toggleItalic().run();
        break;
      case 'code':
        chain.toggleCode().run();
        break;
      case 'heading':
        chain.toggleHeading({ level: Number(button.dataset.level) as 2 | 3 | 4 }).run();
        break;
      case 'paragraph':
        chain.setParagraph().run();
        break;
      case 'bulletList':
        chain.toggleBulletList().run();
        break;
      case 'orderedList':
        chain.toggleOrderedList().run();
        break;
      case 'blockquote':
        chain.toggleBlockquote().run();
        break;
      case 'link':
        promptForLink();
        break;
      case 'unlink':
        chain.unsetLink().run();
        break;
      case 'undo':
        chain.undo().run();
        break;
      case 'redo':
        chain.redo().run();
        break;
      default:
        break;
    }
    syncToolbar();
  });

  const promptForLink = () => {
    if (!editor) return;
    const existing = editor.getAttributes('link').href ?? '';
    // A native prompt is not elegant, but it is keyboard-accessible,
    // works on a phone, and needs no modal component the design system
    // doesn't have yet.
    const href = window.prompt('Link URL — a full https:// address, or a site path like /topics/consent', existing);
    if (href === null) return;
    if (href.trim() === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: href.trim() }).run();
  };

  /* ── Source mode ─────────────────────────────────────────────── */

  const setSourceMode = (on: boolean) => {
    sourceMode = on;
    if (!sourceEl) return;
    sourceEl.hidden = !on;
    host.hidden = on;

    // Disable the formatting controls rather than hiding the toolbar:
    // hiding it takes the toggle with it, and there is then no way back
    // out of Markdown mode.
    const toggle = document.getElementById('studio-source-toggle') as HTMLButtonElement | null;
    if (toolbar) {
      for (const button of toolbar.querySelectorAll<HTMLButtonElement>('button')) {
        if (button !== toggle) button.disabled = on;
      }
    }
    if (toggle) toggle.setAttribute('aria-pressed', String(on));

    if (on && editor) {
      sourceEl.value = docToMarkdown(editor.getJSON());
    } else if (!on && editor) {
      editor.commands.setContent(markdownToDoc(sourceEl.value));
    }
  };

  document.getElementById('studio-source-toggle')?.addEventListener('click', () => setSourceMode(!sourceMode));
  sourceEl?.addEventListener('input', markDirty);

  /* ── Load ────────────────────────────────────────────────────── */

  const load = async () => {
    setStatus('Loading…');
    const res = await fetch(`/api/studio/post/?slug=${encodeURIComponent(slug)}`, {
      headers: { Accept: 'application/json' },
    });

    if (res.status === 401) {
      window.location.href = '/studio/login/';
      return;
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: 'Could not load that post.' }));
      showError(body.error ?? 'Could not load that post.');
      setStatus('Not loaded');
      return;
    }

    loaded = (await res.json()) as LoadedPost;
    sha = loaded.sha;
    fillForm(loaded.frontmatter);

    editor = new Editor({
      element: host,
      extensions: [
        StarterKit.configure({
          heading: { levels: [2, 3, 4] },
          // Off: the blog templates don't style these, and letting them
          // in would put syntax in the file the site renders as literal
          // text or ignores.
          codeBlock: false,
          horizontalRule: false,
          strike: false,
          underline: false,
          link: {
            openOnClick: false,
            autolink: false,
            defaultProtocol: 'https',
            // Most links in these posts are internal paths
            // (/topics/consent), which the default validator rejects for
            // having no protocol. Accept those and in-page anchors.
            isAllowedUri: (url, ctx) => {
              const value = String(url ?? '').trim();
              if (value.startsWith('/') || value.startsWith('#')) return true;
              return Boolean(ctx.defaultValidate(value));
            },
          },
        }),
        Placeholder.configure({ placeholder: 'Start writing…' }),
      ],
      content: loaded.doc,
      onUpdate: () => {
        markDirty();
        syncToolbar();
      },
      onSelectionUpdate: syncToolbar,
    });

    if (!loaded.lossless) {
      setSourceMode(true);
      showWarning(
        'This post uses Markdown the rich editor can’t represent exactly, so it has opened as plain Markdown. Editing here is safe — the formatting toolbar is unavailable for this post.',
      );
      const toggle = document.getElementById('studio-source-toggle') as HTMLButtonElement | null;
      if (toggle) toggle.disabled = true;
    }

    syncToolbar();
    markClean('Up to date');
  };

  /* ── Save ────────────────────────────────────────────────────── */

  const save = async () => {
    if (!editor || saveButton.disabled) return;
    saveButton.disabled = true;
    setStatus('Saving…');
    clearMessages();

    const payload: Record<string, unknown> = {
      slug,
      sha,
      frontmatter: readForm(),
    };
    if (sourceMode && sourceEl) payload.markdown = sourceEl.value;
    else payload.doc = editor.getJSON();

    try {
      const res = await fetch('/api/studio/post/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        window.location.href = '/studio/login/';
        return;
      }

      const body = await res.json().catch(() => ({ error: 'Save failed.' }));

      if (!res.ok) {
        showError(body.error ?? 'Save failed.');
        setStatus('Not saved');
        saveButton.disabled = false;
        return;
      }

      sha = body.sha ?? sha;
      if (body.unchanged) {
        markClean('No changes to save');
        return;
      }
      markClean('Saved — live in a minute or two');
      showSuccess('Saved. Vercel is rebuilding the site; the change is usually live within a couple of minutes.');
    } catch {
      showError('Could not reach the server. Your changes are still here — try saving again.');
      setStatus('Not saved');
      saveButton.disabled = false;
    }
  };

  saveButton.addEventListener('click', save);

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      void save();
    }
  });

  /* ── Messages ────────────────────────────────────────────────── */

  const messages = document.getElementById('studio-messages');

  const clearMessages = () => {
    if (messages) messages.textContent = '';
  };

  const showMessage = (variant: 'error' | 'warning' | 'success', text: string) => {
    if (!messages) return;
    clearMessages();
    const alert = document.createElement('div');
    alert.className = `alert alert--${variant}`;
    alert.setAttribute('role', variant === 'error' ? 'alert' : 'status');
    const content = document.createElement('div');
    content.className = 'alert__content';
    const bodyEl = document.createElement('div');
    bodyEl.className = 'alert__body';
    const p = document.createElement('p');
    p.textContent = text;
    bodyEl.appendChild(p);
    content.appendChild(bodyEl);
    alert.appendChild(content);
    messages.appendChild(alert);
  };

  const showError = (text: string) => showMessage('error', text);
  const showWarning = (text: string) => showMessage('warning', text);
  const showSuccess = (text: string) => showMessage('success', text);

  void load();
}
