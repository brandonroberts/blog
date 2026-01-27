import { Component, computed } from '@angular/core';
import { contentFilesResource } from '@analogjs/content/resources';

import { PostsComponent } from '../../components/posts.component';
import { 
  isPost, 
  Post, 
  toUnifiedPost, 
  devToToUnifiedPost 
} from '../../data/posts';
import { devToPosts } from 'virtual:devto-posts';

@Component({
  selector: 'blog-posts',
  imports: [PostsComponent],
  template: `
    <posts [posts]="posts()"></posts>
  `
})
export default class BlogComponent {
  private localPostsResource = contentFilesResource<Post>(
    (post) => isPost(post, false) && post.attributes.published
  );

  readonly posts = computed(() => {
    const localPosts = (this.localPostsResource.value() || [])
      .map(toUnifiedPost);

    const devToPostsList = devToPosts.map(devToToUnifiedPost);

    return [...localPosts, ...devToPostsList]
      .sort((a, b) =>
        new Date(b.publishedDate).valueOf() -
        new Date(a.publishedDate).valueOf()
      );
  });
}
