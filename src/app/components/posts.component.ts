import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import * as stylex from '@stylexjs/stylex';

import { UnifiedPost } from '../data/posts';
import { colors } from '../styles/tokens.stylex';
import { sx } from '../styles/sx';

const styles = stylex.create({
  list: {
    fontSize: '1.5rem',
    lineHeight: '2rem',
  },
  item: {
    paddingBlock: '1rem',
  },
  link: {
    color: {
      default: colors.textSecondary,
      ':hover': colors.textStrong,
    },
    transitionProperty: 'background-color, border-color, color',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  date: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    color: colors.textMuted,
  },
});

@Component({
  selector: 'posts',
  imports: [RouterLink, DatePipe],
  template: `
    <div [class]="cls.list">
      @for (post of posts(); track post.slug) {
        <div [class]="cls.item">
          <a [routerLink]="post.url" [class]="cls.link">{{ post.title }}</a>

          <p [class]="cls.date">
            {{ post.publishedDate | date : 'MMMM dd, yyyy' }}
          </p>
        </div>
      }
    </div>
  `
})
export class PostsComponent {
  posts = input<UnifiedPost[]>([]);

  protected readonly cls = {
    list: sx(styles.list),
    item: sx(styles.item),
    link: sx(styles.link),
    date: sx(styles.date),
  };
}
