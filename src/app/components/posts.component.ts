import { Component, Input } from '@angular/core';
import { DatePipe, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Post } from '../data/posts';

@Component({
  selector: 'posts',
  standalone: true,
  imports: [NgFor, RouterLink, DatePipe],
  template: `
    <div class="text-2xl">
      <div class="py-4" *ngFor="let post of posts">
        <a
          [routerLink]="['/blog', 'posts', post.frontmatter.slug]"
          class="text-gray-600"
          >{{ post.frontmatter.title }}</a
        >

        <p class="text-sm">
          {{ post.frontmatter.publishedDate | date:'MMMM dd, yyyy' }}
        </p>
      </div>
    </div>
  `,
})
export class PostsComponent {
  @Input() posts: Post[] = [];
}
