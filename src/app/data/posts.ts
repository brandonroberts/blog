import { ContentFile } from '@analogjs/content';

export interface Post {
  title: string;
  slug: string;
  published: boolean;
  publishedDate: string;
  description: string;
}

export function isPost(post: ContentFile<Post>, liveStreams: boolean) {
  if (liveStreams) {
    return post.attributes.title.includes('Unfiltered');
  }

  return !post.attributes.title.includes('Unfiltered');
}
