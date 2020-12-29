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
    <h2>{{ title$ | async }}</h2>

    <span
      >{{ publishedDate$ | async | date: 'longDate' }} -
      {{ readingTime$ | async }} min read</span
    >

    <!-- This is where Scully will inject the static HTML -->
    <scully-content></scully-content>
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
