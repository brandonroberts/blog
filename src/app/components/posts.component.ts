import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { UnifiedPost } from '../data/posts';
import * as css from './posts.css';

@Component({
  selector: 'posts',
  imports: [RouterLink, DatePipe],
  template: `
    <div [class]="css.list">
      @for (post of posts(); track post.slug) {
        <div [class]="css.item">
          <a [routerLink]="post.url" [class]="css.link">{{ post.title }}</a>

          <p [class]="css.date">
            {{ post.publishedDate | date : 'MMMM dd, yyyy' }}
          </p>
        </div>
      }
    </div>
  `
})
export class PostsComponent {
  posts = input<UnifiedPost[]>([]);
  protected readonly css = css;
}
