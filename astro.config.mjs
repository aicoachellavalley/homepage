import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';

export default defineConfig({
  // Preserve the published site's Markdown and inline spacing during v7 upgrade.
  compressHTML: true,
  markdown: { processor: unified() },
  integrations: [mdx()],
  output: 'static',
  site: 'https://aicoachellavalley.com',
  build: {
    assets: '_astro'
  }
});
