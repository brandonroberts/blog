/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import { devToPostsPlugin, getDevToSlugs } from './vite-plugins/devto-posts';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

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
    vanillaExtractPlugin(),
    devToPostsPlugin(),
    analog({
      vite: {
        // Leave vanilla-extract's modules to its own plugin. The Angular
        // compiler otherwise re-emits *.css.ts from its program (discarding
        // the compiled styles), and its `.ts` filter also matches the
        // virtual *.css.ts.vanilla.css ids (the ".ts." substring), where it
        // would wipe the extracted CSS.
        transformFilter: (_code, id) => {
          const file = id.split('?')[0];
          return !file.endsWith('.css.ts') && !file.endsWith('.vanilla.css');
        },
      },
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
