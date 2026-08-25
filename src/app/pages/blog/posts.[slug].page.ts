import { DatePipe } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MarkdownComponent } from '@analogjs/content';
import { contentFileResource } from '@analogjs/content/resources';
import { RouteMeta } from '@analogjs/router';
import * as stylex from '@stylexjs/stylex';

import { ReadingTimePipe } from '../../pipes/reading-time.pipe';
import { ExtendedPost } from '../../data/posts';
import { colors } from '../../styles/tokens.stylex';
import { sx } from '../../styles/sx';
import { postMetaResolver, postTitleResolver } from './resolvers';

export const routeMeta: RouteMeta = {
  title: postTitleResolver,
  meta: postMetaResolver,
};

const styles = stylex.create({
  wrapper: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100vh',
  },
  article: {
    width: '100vw',
    maxWidth: '56rem',
    padding: '2rem',
  },
  coverImage: {
    width: '100%',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem',
  },
  title: {
    color: colors.textSecondary,
    fontSize: '1.5rem',
    lineHeight: '2rem',
  },
  byline: {
    fontWeight: 300,
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    color: colors.textMuted,
  },
});

@Component({
  selector: 'post',
  imports: [MarkdownComponent, DatePipe, ReadingTimePipe],
  template: `
    @let post = postResource.value();

    @if (post) {
      <div [class]="cls.wrapper">
        <article [class]="cls.article">
          @if (post.attributes.coverImage) {
            <img
              [src]="post.attributes.coverImage"
              [alt]="post.attributes.title"
              [class]="cls.coverImage"
            />
          }

          <h2 [class]="cls.title">{{ post.attributes.title }}</h2>

          <span [class]="cls.byline">
            {{ post.attributes.publishedDate | date : 'MMMM dd, yyyy' }} -
            {{ post.content | readingtime }} min read
          </span>

          <analog-markdown [content]="post.content"></analog-markdown>
        </article>
      </div>
    }
  `
})
export default class BlogPostComponent {
  protected readonly cls = {
    wrapper: sx(styles.wrapper),
    article: sx(styles.article),
    coverImage: sx(styles.coverImage),
    title: sx(styles.title),
    byline: sx(styles.byline),
  };

  private meta = inject(Meta);
  private title = inject(Title);
  
  postResource = contentFileResource<ExtendedPost>();

  constructor() {
    // Update meta tags when post loads (for dev.to posts with images)
    effect(() => {
      const post = this.postResource.value();
      if (post?.attributes.isDevTo) {
        const attrs = post.attributes;
        
        this.title.setTitle(attrs.title);
        
        this.meta.updateTag({ name: 'description', content: attrs.description });
        this.meta.updateTag({ property: 'og:title', content: attrs.title });
        this.meta.updateTag({ property: 'og:description', content: attrs.description });
        
        if (attrs.socialImage) {
          this.meta.updateTag({ property: 'og:image', content: attrs.socialImage });
          this.meta.updateTag({ property: 'twitter:image', content: attrs.socialImage });
        }
      }
    });
  }
}
