import { ContentFile, injectContentFiles } from '@analogjs/content';

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

export function injectPosts(livestreams = false) {
  return injectContentFiles<Post>()
    .filter((post) => isPost(post, livestreams))
    .filter((post) => post.attributes.published)
    .sort(
      (a, b) =>
        new Date(b.attributes.publishedDate).valueOf() -
        new Date(a.attributes.publishedDate).valueOf()
    );
}
