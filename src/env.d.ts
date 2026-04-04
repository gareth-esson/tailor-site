/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly NOTION_API_KEY: string;
  readonly NOTION_LANDING_PAGES_DB: string;
  readonly NOTION_BLOG_DB: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
