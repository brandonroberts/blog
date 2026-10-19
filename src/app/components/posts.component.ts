import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LinkTo } from '@analogjs/router';

import { UnifiedPost } from '../data/posts';

@Component({
  selector: 'posts',
  imports: [LinkTo, DatePipe],
  template: `
    <div class="text-2xl">
      @for (post of posts(); track post.slug) {
        <div class="py-4">
          <a
            [linkTo]="{ path: '/blog/posts/[slug]', params: { slug: post.slug } }"
            class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >{{ post.title }}</a
          >

          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ post.publishedDate | date : 'MMMM dd, yyyy' }}
          </p>
        </div>
      }
    </div>
  `
})
export class PostsComponent {
  posts = input<UnifiedPost[]>([]);
}
