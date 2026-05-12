import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  output: 'static',
  site: 'https://uglis.github.io',
  trailingSlash: 'never',
  vite: {
    css: {
      postcss: './postcss.config.cjs',
    },
  },
});
