import { Component, computed } from '@angular/core';
import { contentFilesResource } from '@analogjs/content/resources';

import { PostsComponent } from '../../components/posts.component';
import { ExtendedPost, isPost, toUnifiedPost } from '../../data/posts';

@Component({
  selector: 'blog-posts',
  imports: [PostsComponent],
  template: `
    <posts [posts]="posts()"></posts>
  `
})
export default class BlogComponent {
  // contentFilesResource now includes both local and dev.to posts
  // via the custom withDevToContentLoader provider
  private postsResource = contentFilesResource<ExtendedPost>(
    (post) => isPost(post, false) && post.attributes.published
  );

  readonly posts = computed(() => {
    return (this.postsResource.value() || [])
      .map(toUnifiedPost)
      .sort((a, b) =>
        new Date(b.publishedDate).valueOf() -
        new Date(a.publishedDate).valueOf()
      );
  });
}
