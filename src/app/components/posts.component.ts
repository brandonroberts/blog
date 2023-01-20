import { Component, Input } from '@angular/core';
import { DatePipe, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentFile } from '@analogjs/content';

import { Post } from '../data/posts';

@Component({
  selector: 'posts',
  standalone: true,
  imports: [NgFor, RouterLink, DatePipe],
  template: `
    <div class="text-2xl">
      <div class="py-4" *ngFor="let post of posts">
        <a
          [routerLink]="['/blog', 'posts', post.attributes.slug]"
          class="text-gray-600"
          >{{ post.attributes.title }}</a
        >

        <p class="text-sm">
          {{ post.attributes.publishedDate | date:'MMMM dd, yyyy' }}
        </p>
      </div>
    </div>
  `,
})
export class PostsComponent {
  @Input() posts: ContentFile<Post>[] = [];
}
