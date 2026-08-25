/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import { devToPostsPlugin, getDevToSlugs } from './vite-plugins/devto-posts';
import { cssTsPlugin } from './vite-plugins/css-ts';

// Only run in Netlify CI
let base = process.env['URL'] || 'http://localhost:5173';
if (process.env['NETLIFY'] === 'true') {
  if (process.env['CONTEXT'] === 'deploy-preview') {
    base = `${process.env['DEPLOY_PRIME_URL']}/`;
  }
}

process.env['VITE_ANALOG_BASE_URL'] = base;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ['es2020'],
    outDir: 'dist/client'
  },
  optimizeDeps: {
    include: ['reading-time']
  },
  plugins: [
    // Must come before the Analog/Angular plugin so its `load` hook stubs
    // *.styles.ts modules before the Angular compiler sees them.
    cssTsPlugin(),
    devToPostsPlugin(),
    analog({
      content: {
        highlighter: 'shiki',
        shikiOptions: {
          highlighter: {
            additionalLangs: ['sh']
          }
        }
      },
      static: true,
      prerender: {
        routes: async () => {
          const devToSlugs = await getDevToSlugs();

          return [
            '/',
            '/about',
            '/blog',
            '/talks',
            // Local content posts
            {
              contentDir: '/src/content',
              transform(file) {
                return `/blog/posts/${file.attributes['slug']}`;
              },
            },
            // Dev.to posts
            ...devToSlugs.map(slug => `/blog/posts/${slug}`),
            // OG images for local posts
            {
              contentDir: '/src/content',
              transform(file) {
                return `/api/v1/og-images/${file.attributes['slug']}.png?title=${file.attributes['title']}`;
              },
            },
          ];
        },
        sitemap: {
          host: base
        }
      },
      nitro: {
        logLevel: 3,
        prerender: {
          concurrency: 1
        },
        hooks: {
          'prerender:generate': (route) => {
            route.route = route.route.split('?')[0];
            route.fileName = route.fileName?.split('?')[0];
          }
        }
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
  }
}));
