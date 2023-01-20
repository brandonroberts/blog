import { ContentFile, injectContentFiles } from '@analogjs/content';
import { injectActivatedRoute } from '@analogjs/router';

export interface Post {
  title: string;
  slug: string;
  published: boolean;
  publishedDate: string;
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

export function injectPost(slug: string) {
  const route = injectActivatedRoute();
  return injectContentFiles<Post>().find(
    (posts) =>
      posts.filename === `/src/content/${route.snapshot.paramMap.get(slug)}.md`
  );
}
