/// <reference types="vitest" />

import { defineConfig, Plugin } from 'vite';
import analog from '@analogjs/platform';
import tailwindcss from '@tailwindcss/vite';

// Virtual module plugin to fetch dev.to posts at build time
function devToPostsPlugin(): Plugin {
  const virtualModuleId = 'virtual:devto-posts';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;
  let cachedPosts: string | null = null;

  return {
    name: 'devto-posts',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
      return undefined;
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        if (!cachedPosts) {
          try {
            const response = await fetch(
              'https://dev.to/api/articles?username=brandontroberts&per_page=10'
            );
            if (response.ok) {
              const articles = await response.json();
              cachedPosts = JSON.stringify(articles);
            } else {
              cachedPosts = '[]';
            }
          } catch (error) {
            console.error('Failed to fetch dev.to posts:', error);
            cachedPosts = '[]';
          }
        }
        return `export const devToPosts = ${cachedPosts};`;
      }
      return undefined;
    }
  };
}

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
        routes: async() => [
          '/',
          '/about',
          '/blog',
          '/talks',
          {
            contentDir: '/src/content',
            transform(file) {
              return `/blog/posts/${file.attributes['slug']}`;
            },
          },
          {
            contentDir: '/src/content',
            transform(file) {
              return `/api/v1/og-images/${file.attributes['slug']}.png?title=${file.attributes['title']}`;
            },
          }          
        ],
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
    tailwindcss(),
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
