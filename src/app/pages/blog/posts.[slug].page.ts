import { DatePipe } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MarkdownComponent } from '@analogjs/content';
import { contentFileResource } from '@analogjs/content/resources';
import { RouteMeta } from '@analogjs/router';

import { ReadingTimePipe } from '../../pipes/reading-time.pipe';
import { ExtendedPost } from '../../data/posts';
import { postMetaResolver, postTitleResolver } from './resolvers';

export const routeMeta: RouteMeta = {
  title: postTitleResolver,
  meta: postMetaResolver,
};

@Component({
  selector: 'post',
  imports: [MarkdownComponent, DatePipe, ReadingTimePipe],
  template: `
    @let post = postResource.value();

    @if (post) {
      <div class="flex flex-grow justify-center min-h-screen">
        <article class="w-screen max-w-4xl p-8">
          @if (post.attributes.coverImage) {
            <img 
              [src]="post.attributes.coverImage" 
              [alt]="post.attributes.title"
              class="w-full rounded-lg mb-6"
            />
          }
          
          <h2 class="text-gray-600 dark:text-gray-300 text-2xl">{{ post.attributes.title }}</h2>

          <span class="font-light text-sm text-gray-500 dark:text-gray-400">
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
