/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import * as fs from 'fs';
const posts = fs.readdirSync('./src/content');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ['es2020'],
  },
  optimizeDeps: {
    include: ['@angular/common', 'reading-time']
  },
  plugins: [
    analog({
      static: true,
      prerender: {
        routes: async() => ['/', '/about', '/blog', '/talks', ...posts.map(post => `/blog/posts/${post.replace('.md', '')}`)],
        sitemap: {
          host: 'https://brandonroberts.dev/'
        }
      },
      nitro: {
        logLevel: 3
      }
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test.ts'],
    include: ['**/*.spec.ts'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
    // fix for readingtime
    'process.env.NODE_DEBUG': mode !== 'production' ? '"true"' : false
  },
}));
