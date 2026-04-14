import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  site: 'https://tailoreducation.org.uk',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    // In output: 'static' mode the sitemap integration automatically
    // includes every prerendered page, so no customPages list is needed.
    sitemap({
      filter: (page) =>
        !page.includes('/test-') &&
        !page.includes('/api/'),
    }),
  ],
  // All 301 redirects (WordPress migration + legacy slugs + renamed
  // landing pages) live in vercel.json so they fire at the edge.
  // Astro's own redirects block is left empty — static mode would
  // otherwise require each destination to resolve to an existing
  // route in the build, which is awkward for catch-alls like
  // /category/:slug → /topics/.
});
