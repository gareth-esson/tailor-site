import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  site: 'https://www.tailor-rse.org.uk',
  // Canonicalise on trailing-slash URLs. Vercel already redirects
  // non-slash → slash at the edge (vercel.json: "trailingSlash": true),
  // but Astro's static-mode default ('ignore') means the sitemap and
  // generated link helpers don't pick a side, which is what let Google
  // index both forms of the same OtA URL (e.g. /anonymous_question/foo
  // and /anonymous_question/foo/) as separate pages. Setting 'always'
  // here makes every emitted URL — sitemap, BaseLayout canonical, JSON-LD,
  // dev-server redirects — agree with the edge redirect, so Google
  // consolidates on the single canonical form.
  trailingSlash: 'always',
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 4321,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    mdx(),
    // In output: 'static' mode the sitemap integration automatically
    // includes every prerendered page, so no customPages list is needed.
    sitemap({
      filter: (page) => {
        // Exclude routes that are noIndex'd in their BaseLayout call —
        // listing them in sitemap.xml while serving meta robots=noindex
        // is a contradiction Google flags as a quality issue.
        const exclusions = [
          '/test-',
          '/api/',
          '/search',
          '/404',
          '/book/order',         // covers /book/order and /book/order-confirmed
          '/blog/category/',     // category archives — noIndex'd
          '/questions/tag/',     // tag archives — noIndex'd
        ];
        return !exclusions.some((p) => page.includes(p));
      },
    }),
  ],
  // All 301 redirects (WordPress migration + legacy slugs + renamed
  // landing pages) live in vercel.json so they fire at the edge.
  // Astro's own redirects block is left empty — static mode would
  // otherwise require each destination to resolve to an existing
  // route in the build, which is awkward for catch-alls like
  // /category/:slug → /topics/.
});
