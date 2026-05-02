import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// User site (https://jamieclaw.github.io/) — no `base` needed.
export default defineConfig({
  site: 'https://jamieclaw.github.io',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: false, // EN at /, Cantonese at /zh/
    },
  },
  integrations: [sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', zh: 'zh-HK' } } })],
});

