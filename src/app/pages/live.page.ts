import { Component, computed } from '@angular/core';
import { contentFilesResource } from '@analogjs/content/resources';

import { PostsComponent } from '../components/posts.component';
import { Post, isPost } from '../data/posts';

@Component({
    selector: 'livestreams',
    imports: [PostsComponent],
    template: ` <posts [posts]="posts()"></posts> `
})
export default class BlogComponent {
  private postsResource = contentFilesResource<Post>((post) => isPost(post, true) && post.attributes.published);

  readonly posts = computed(() => {
    return (this.postsResource.value() || [])
      .slice().sort((a, b) =>
        new Date(b.attributes.publishedDate).valueOf() -
        new Date(a.attributes.publishedDate).valueOf()
      )
  });
}
