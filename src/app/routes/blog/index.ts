import { Component } from '@angular/core';

import { PostsComponent } from '../../components/posts.component';
import { injectPosts } from '../../data/posts';

@Component({
  selector: 'blog-posts',
  standalone: true,
  imports: [PostsComponent],
  template: ` <posts [posts]="posts"></posts> `,
})
export default class BlogComponent {
  posts = injectPosts();
}
