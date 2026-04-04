import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  site: 'https://tailoreducation.org.uk',
  vite: {
    plugins: [tailwindcss()],
  },
});
