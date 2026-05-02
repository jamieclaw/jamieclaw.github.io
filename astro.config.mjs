import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// User site (https://jamieclaw.github.io/) — no `base` needed.
export default defineConfig({
  site: 'https://jamieclaw.github.io',
  integrations: [sitemap()],
});
