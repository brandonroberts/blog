import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { injectContent, MarkdownComponent } from '@analogjs/content';

import { ReadingTimePipe } from '../../pipes/reading-time.pipe';
import { Post } from '../../data/posts';

@Component({
  selector: 'post',
  standalone: true,
  imports: [MarkdownComponent, AsyncPipe, NgIf, DatePipe, ReadingTimePipe],
  template: `
    @if (post$ | async; as post) {
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
  `,
})
export default class BlogPostComponent {
  post$ = injectContent<Post>();
}
