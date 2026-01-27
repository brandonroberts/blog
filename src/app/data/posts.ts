import { ContentFile } from '@analogjs/content';

export interface Post {
  title: string;
  slug: string;
  published: boolean;
  publishedDate: string;
  description: string;
}

/** Extended post attributes that include dev.to post fields */
export interface ExtendedPost extends Post {
  /** Whether this is a dev.to post */
  isDevTo?: boolean;
  /** Cover/banner image URL (from dev.to) */
  coverImage?: string;
  /** Social sharing image URL (from dev.to) */
  socialImage?: string;
}

/** Unified post type for displaying mixed local and dev.to posts */
export interface UnifiedPost {
  title: string;
  slug: string;
  publishedDate: string;
  /** Internal route path */
  url: string;
}

/** dev.to API article response (full article with content) */
export interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  published_at: string;
  cover_image: string | null;
  social_image: string | null;
  tag_list: string[];
  reading_time_minutes: number;
  slug: string;
  body_markdown?: string;
  body_html_rendered?: string;
}

/** Convert a ContentFile to UnifiedPost - all posts now render locally */
export function toUnifiedPost(post: ContentFile<ExtendedPost>): UnifiedPost {
  const { attributes } = post;
  
  return {
    title: attributes.title,
    slug: attributes.slug,
    publishedDate: attributes.publishedDate,
    url: `/blog/posts/${attributes.slug}`,
  };
}

export function isPost(post: ContentFile<ExtendedPost>, liveStreams: boolean) {
  if (liveStreams) {
    return post.attributes.title.includes('Unfiltered');
  }

  return !post.attributes.title.includes('Unfiltered');
}
