import { Plugin } from 'vite';
import { marked } from 'marked';
import { createHighlighter } from 'shiki';

export interface DevToArticle {
  id: number;
  slug: string;
  path: string;
  title: string;
  description: string;
  published_at: string;
  body_markdown?: string;
  body_html?: string;
}

const DEVTO_USERNAME = 'brandontroberts';
const DEVTO_API_BASE = 'https://dev.to/api/articles';

/**
 * Vite plugin that fetches dev.to posts at build time and exposes them
 * via a virtual module `virtual:devto-posts`.
 * 
 * Posts are fetched with full content and markdown is rendered to HTML
 * with Shiki syntax highlighting.
 */
export function devToPostsPlugin(): Plugin {
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
              `${DEVTO_API_BASE}?username=${DEVTO_USERNAME}&per_page=10`
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
                    `${DEVTO_API_BASE}/${article.id}`
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

/**
 * Fetches dev.to article slugs for prerendering routes.
 */
export async function getDevToSlugs(): Promise<string[]> {
  try {
    const response = await fetch(
      `${DEVTO_API_BASE}?username=${DEVTO_USERNAME}&per_page=10`
    );
    if (response.ok) {
      const articles: DevToArticle[] = await response.json();
      return articles.map(a => a.slug);
    }
  } catch (error) {
    console.error('Failed to fetch dev.to slugs for prerender:', error);
  }
  return [];
}
