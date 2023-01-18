import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { map } from 'rxjs';
import { injectContent, MarkdownComponent } from '@analogjs/content';
import frontmatter from 'front-matter';

import { Frontmatter } from '../../data/posts';
import { ReadingTimePipe } from '../../pipes/reading-time.pipe';

@Component({
  selector: 'post',
  standalone: true,
  imports: [
    MarkdownComponent,
    AsyncPipe,
    NgIf,
    DatePipe,
    ReadingTimePipe,
  ],
  template: `
    <div
      class="flex flex-grow justify-center min-h-screen"
      *ngIf="content$ | async as content"
    >
      <article class="w-screen max-w-4xl p-8">
        <h2 class="text-gray-600 text-2xl">{{ content.attributes.title }}</h2>

        <span class="font-light text-sm">
          {{ content.attributes.publishedDate | date:'MMMM dd, yyyy'}} - {{ content.body | readingtime }} min read
        </span>

        <analog-markdown [content]="content.body"></analog-markdown>
      </article>
    </div>
  `,
})
export default class BlogPostComponent {
  content$ = injectContent().pipe(map((content) => frontmatter<Frontmatter>(content)));
}
