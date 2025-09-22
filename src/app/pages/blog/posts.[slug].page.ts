import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MarkdownComponent } from '@analogjs/content';
import { contentFileResource } from '@analogjs/content/resources';
import { RouteMeta } from '@analogjs/router';

import { ReadingTimePipe } from '../../pipes/reading-time.pipe';
import { Post } from '../../data/posts';
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
          <h2 class="text-gray-600 text-2xl">{{ post.attributes.title }}</h2>

          <span class="font-light text-sm">
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
  postResource = contentFileResource<Post>();
}
