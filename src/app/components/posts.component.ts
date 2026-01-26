import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentFile } from '@analogjs/content';

import { Post } from '../data/posts';

@Component({
  selector: 'posts',
  imports: [RouterLink, DatePipe],
  template: `
    <div class="text-2xl">
      @for (post of posts(); track post.slug) {
        <div class="py-4">
          <a
            [routerLink]="['/blog', 'posts', post.attributes.slug]"
            class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >{{ post.attributes.title }}</a
          >

          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ post.attributes.publishedDate | date : 'MMMM dd, yyyy' }}
          </p>
        </div>
      }
    </div>
  `
})
export class PostsComponent {
  posts = input<ContentFile<Post>[] | undefined>([]);
}
