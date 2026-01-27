import { Provider } from '@angular/core';
import { 
  ContentFile, 
  CONTENT_LIST_LOADER, 
  CONTENT_FILE_LOADER,
  injectContentFiles,
  injectContentFilesMap 
} from '@analogjs/content';
import { devToPosts } from 'virtual:devto-posts';
import { DevToArticle, ExtendedPost } from '../data/posts';

/** Convert dev.to article to Analog ContentFile format */
function devToArticleToContentFile(article: DevToArticle): ContentFile<ExtendedPost> {
  return {
    filename: article.slug,
    slug: article.slug,
    content: article.body_markdown || article.description,
    attributes: {
      title: article.title,
      slug: article.slug,
      published: true,
      publishedDate: article.published_at,
      description: article.description,
      isDevTo: true,
      coverImage: article.cover_image || undefined,
      socialImage: article.social_image || undefined,
    },
  };
}

/** Create content object for dev.to article - returns pre-rendered HTML with metadata */
function createDevToContentObject(article: DevToArticle): { metadata: ExtendedPost; default: string } {
  return {
    metadata: {
      title: article.title,
      slug: article.slug,
      published: true,
      publishedDate: article.published_at,
      description: article.description,
      isDevTo: true,
      coverImage: article.cover_image || undefined,
      socialImage: article.social_image || undefined,
    },
    // Return pre-rendered HTML (already syntax highlighted at build time)
    default: article.body_html_rendered || article.body_markdown || article.description,
  };
}

/** 
 * Custom content list loader that combines local markdown posts 
 * with dev.to posts fetched at build time 
 */
export function withDevToContentListLoader(): Provider {
  return {
    provide: CONTENT_LIST_LOADER,
    useFactory() {
      return async () => {
        // Get local content files
        const localPosts = injectContentFiles();
        
        // Convert dev.to posts to ContentFile format
        const devToContentFiles = devToPosts.map(devToArticleToContentFile);
        
        // Combine both sources
        return [...localPosts, ...devToContentFiles];
      };
    },
  };
}

/**
 * Custom content file loader that includes dev.to posts
 * alongside local markdown files
 */
export function withDevToContentFileLoader(): Provider {
  return {
    provide: CONTENT_FILE_LOADER,
    useFactory() {
      return async () => {
        // Get local content files map
        const localFilesMap = injectContentFilesMap();
        
        // Create a map for dev.to posts
        const devToFilesMap: Record<string, () => Promise<string>> = {};
        
        for (const article of devToPosts) {
          // Use standard path format so contentFileResource can find it
          const filePath = article.slug;
          devToFilesMap[filePath] = async () => createDevToContentObject(article) as unknown as string;
        }
        
        // Combine both maps
        return { ...localFilesMap, ...devToFilesMap };
      };
    },
  };
}

/**
 * Combined provider for both content loaders with dev.to integration
 */
export function withDevToContentLoader(): Provider[] {
  return [
    withDevToContentListLoader(),
    withDevToContentFileLoader(),
  ];
}
