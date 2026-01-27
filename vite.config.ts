/// <reference types="vitest" />

import { defineConfig, Plugin } from 'vite';
import analog from '@analogjs/platform';
import tailwindcss from '@tailwindcss/vite';
import { marked } from 'marked';
import { createHighlighter } from 'shiki';

interface DevToArticle {
  id: number;
  slug: string;
  path: string;
  title: string;
  description: string;
  published_at: string;
  body_markdown?: string;
  body_html?: string;
}

// Virtual module plugin to fetch dev.to posts with full content at build time
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
            // Initialize Shiki highlighter
            const highlighter = await createHighlighter({
              themes: ['github-dark', 'github-light'],
              langs: ['typescript', 'javascript', 'html', 'css', 'json', 'bash', 'sh', 'shell', 'markdown', 'yaml', 'xml']
            });

            // Configure marked with Shiki for syntax highlighting
            marked.use({
              renderer: {
                code(token) {
                  const lang = token.lang || 'text';
                  try {
                    const highlighted = highlighter.codeToHtml(token.text, {
                      lang: highlighter.getLoadedLanguages().includes(lang) ? lang : 'text',
                      theme: 'github-dark'
                    });
                    return highlighted;
                  } catch {
                    return `<pre><code class="language-${lang}">${token.text}</code></pre>`;
                  }
                }
              }
            });

            // First, get the list of articles
            const listResponse = await fetch(
              'https://dev.to/api/articles?username=brandontroberts&per_page=10'
            );
            
            if (!listResponse.ok) {
              cachedPosts = '[]';
              return `export const devToPosts = ${cachedPosts};`;
            }
            
            const articleList: DevToArticle[] = await listResponse.json();
            
            // Fetch full content for each article and render markdown to HTML
            const fullArticles = await Promise.all(
              articleList.map(async (article) => {
                try {
                  const articleResponse = await fetch(
                    `https://dev.to/api/articles/${article.id}`
                  );
                  if (articleResponse.ok) {
                    const fullArticle = await articleResponse.json();
                    // Render markdown to HTML with syntax highlighting
                    if (fullArticle.body_markdown) {
                      fullArticle.body_html_rendered = await marked.parse(fullArticle.body_markdown);
                    }
                    return fullArticle;
                  }
                  return article;
                } catch {
                  return article;
                }
              })
            );
            
            cachedPosts = JSON.stringify(fullArticles);
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
        routes: async () => {
          // Fetch dev.to posts for prerendering
          let devToSlugs: string[] = [];
          try {
            const response = await fetch(
              'https://dev.to/api/articles?username=brandontroberts&per_page=10'
            );
            if (response.ok) {
              const articles: DevToArticle[] = await response.json();
              devToSlugs = articles.map(a => a.slug);
            }
          } catch (error) {
            console.error('Failed to fetch dev.to slugs for prerender:', error);
          }

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
