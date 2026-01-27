import { ContentFile } from '@analogjs/content';

export interface Post {
  title: string;
  slug: string;
  published: boolean;
  publishedDate: string;
  description: string;
}

/** Unified post type for displaying mixed local and external posts */
export interface UnifiedPost {
  title: string;
  slug: string;
  publishedDate: string;
  /** Internal route path for local posts, external URL for dev.to posts */
  url: string;
  /** Whether this links to an external site */
  isExternal: boolean;
}

/** dev.to API article response */
export interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  published_at: string;
  cover_image: string | null;
  tag_list: string[];
  reading_time_minutes: number;
  slug: string;
}

/** Convert a local ContentFile post to UnifiedPost */
export function toUnifiedPost(post: ContentFile<Post>): UnifiedPost {
  return {
    title: post.attributes.title,
    slug: post.attributes.slug,
    publishedDate: post.attributes.publishedDate,
    url: `/blog/posts/${post.attributes.slug}`,
    isExternal: false,
  };
}

/** Convert a dev.to article to UnifiedPost */
export function devToToUnifiedPost(article: DevToArticle): UnifiedPost {
  return {
    title: article.title,
    slug: article.slug,
    publishedDate: article.published_at,
    url: article.url,
    isExternal: true,
  };
}

export function isPost(post: ContentFile<Post>, liveStreams: boolean) {
  if (liveStreams) {
    return post.attributes.title.includes('Unfiltered');
  }

  return !post.attributes.title.includes('Unfiltered');
}
