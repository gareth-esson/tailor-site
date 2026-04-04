/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly NOTION_API_KEY: string;
  readonly NOTION_LANDING_PAGES_DB: string;
  readonly NOTION_BLOG_DB: string;
  readonly GA4_MEASUREMENT_ID: string;
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
