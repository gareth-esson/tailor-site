/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly NOTION_API_KEY: string;
  readonly NOTION_LANDING_PAGES_DB: string;
  readonly NOTION_BLOG_DB: string;
  readonly GA4_MEASUREMENT_ID: string;

  /* Post editor (/studio). All four must be set for the editor to
     accept a login — see docs/POST-EDITOR.md for how to create them. */
  readonly STUDIO_PASSWORD: string;
  readonly STUDIO_SESSION_SECRET: string;
  readonly STUDIO_GITHUB_TOKEN: string;
  readonly STUDIO_GITHUB_REPO: string;
  readonly STUDIO_GITHUB_BRANCH: string;
}

// Extend Window for analytics helpers
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    trackEvent: (eventName: string, params?: Record<string, unknown>) => void;
  }
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
