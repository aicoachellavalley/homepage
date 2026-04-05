import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://aicoachellavalley.com',
  build: {
    assets: '_astro'
  }
});
