import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  site: 'https://tailoreducation.org.uk',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/test-') &&
        !page.includes('/api/'),
      customPages: [
        'https://tailoreducation.org.uk/',
        'https://tailoreducation.org.uk/about',
        'https://tailoreducation.org.uk/our-approach',
        'https://tailoreducation.org.uk/contact',
        'https://tailoreducation.org.uk/services/',
        'https://tailoreducation.org.uk/services/drop-days',
        'https://tailoreducation.org.uk/services/rse-for-primary-schools',
        'https://tailoreducation.org.uk/services/rse-for-secondary-schools',
        'https://tailoreducation.org.uk/services/rse-for-send-and-ap',
        'https://tailoreducation.org.uk/services/rse-policy-curriculum-planning',
        'https://tailoreducation.org.uk/services/rse-training',
        'https://tailoreducation.org.uk/topics/',
        'https://tailoreducation.org.uk/questions/',
        'https://tailoreducation.org.uk/blog/',
        'https://tailoreducation.org.uk/book',
        'https://tailoreducation.org.uk/testimonials',
        'https://tailoreducation.org.uk/accessibility',
        'https://tailoreducation.org.uk/privacy',
      ],
    }),
  ],
  redirects: {
    // WordPress migration — /topic/ → /topics/
    '/topic/[...slug]': {
      status: 301,
      destination: '/topics/[...slug]',
    },
    // WordPress category pages → topics index
    '/category/relationships': {
      status: 301,
      destination: '/topics/',
    },
    '/category/puberty-the-body': {
      status: 301,
      destination: '/topics/',
    },
    '/category/sex-sexual-health': {
      status: 301,
      destination: '/topics/',
    },
    '/category/identity-diversity': {
      status: 301,
      destination: '/topics/',
    },
    '/category/online-safety-media': {
      status: 301,
      destination: '/topics/',
    },
    '/category/safety-safeguarding': {
      status: 301,
      destination: '/topics/',
    },
    '/category/health-wellbeing': {
      status: 301,
      destination: '/topics/',
    },
    '/category/[...slug]': {
      status: 301,
      destination: '/topics/',
    },
    // Common WordPress pages
    '/about-us': {
      status: 301,
      destination: '/about',
    },
    '/contact-us': {
      status: 301,
      destination: '/contact',
    },
    // /rse-training → /services/rse-training is handled by vercel.json
    // at the edge (fires before astro's redirect layer).
    '/our-services': {
      status: 301,
      destination: '/services/',
    },
    '/glossary': {
      status: 301,
      destination: '/topics/',
    },
    '/blog/page/[...num]': {
      status: 301,
      destination: '/blog/',
    },
    // WordPress feed URLs
    '/feed': {
      status: 301,
      destination: '/',
    },
    '/feed/[...rest]': {
      status: 301,
      destination: '/',
    },
    // WordPress author/tag archives
    '/author/[...slug]': {
      status: 301,
      destination: '/about',
    },
    '/tag/[...slug]': {
      status: 301,
      destination: '/topics/',
    },
    // Renamed landing pages (April 2026)
    '/topics/positive-sexuality-and-intimacy': {
      status: 301,
      destination: '/topics/sex-and-intimacy',
    },
    '/topics/stereotypes-prejudice-and-discrimination': {
      status: 301,
      destination: '/topics/gender-stereotypes-and-discrimination',
    },
    '/topics/drugs-alcohol-and-vaping': {
      status: 301,
      destination: '/topics/',
    },
  },
});
