import { ContentFile } from '@analogjs/content';
import { contentFilesResource } from '@analogjs/content/resources';
import { computed } from '@angular/core';

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
  const posts = contentFilesResource<Post>((post) => isPost(post, livestreams) && post.attributes.published);

  return computed(() => (posts.value() || []).slice().sort((a, b) =>
    new Date(b.attributes.publishedDate).valueOf() -
    new Date(a.attributes.publishedDate).valueOf()
  ));
}
