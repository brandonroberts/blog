import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewChecked,
  ViewEncapsulation,
  NgModule,
} from '@angular/core';
import { ScullyLibModule, ScullyRoutesService } from '@scullyio/ng-lib';
import { map } from 'rxjs/operators';

import { HighlightService } from '../highlight.service';
import { PostCommentsComponentModule } from './comments.component';

@Component({
  selector: 'app-post',
  template: `
    <div class="w-screen max-w-4xl text-2xl py-4">
      <h2 class="text-gray-600 text-2xl">{{ title$ | async }}</h2>

      <span class="font-light text-sm">
        {{ publishedDate$ | async | date: 'longDate' }} -
        {{ readingTime$ | async }} min read
      </span>

      <!-- This is where Scully will inject the static HTML -->
      <scully-content></scully-content>
    </div>
  `,
  styles: [''],
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PostComponent implements AfterViewChecked {
  current$ = this.routes.getCurrent();
  title$ = this.current$.pipe(map((route) => route.title));
  publishedDate$ = this.current$.pipe(map((route) => route.publishedDate));
  readingTime$ = this.current$.pipe(map((route) => route.readingTime));

  constructor(
    private highlightService: HighlightService,
    private routes: ScullyRoutesService
  ) {}

  ngAfterViewChecked() {
    this.highlightService.highlightAll();
  }
}

@NgModule({
  declarations: [PostComponent],
  exports: [PostComponent],
  imports: [CommonModule, ScullyLibModule, PostCommentsComponentModule],
})
export class PostComponentModule {}
