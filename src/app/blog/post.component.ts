import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewChecked,
  ViewEncapsulation,
  NgModule,
} from '@angular/core';
import { ScullyLibModule, ScullyRoutesService } from '@scullyio/ng-lib';

import { HighlightService } from '../highlight.service';
import { PostCommentsComponentModule } from './comments.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  template: `
    <h2>{{ title$ | async }}</h2>

    <span>{{ publishedDate$ | async | date:'longDate' }} - {{ readingTime$ | async }} min read</span>

    <!-- This is where Scully will inject the static HTML -->
    <scully-content></scully-content>

    <app-post-comments></app-post-comments>
  `,
  styles: [''],
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PostComponent implements AfterViewChecked {
  current$ = this.routes.getCurrent();
  title$ = this.current$.pipe(map(route => route.title));
  publishedDate$ = this.current$.pipe(map(route => route.publishedDate));
  readingTime$ = this.current$.pipe(map(route => route.readingTime));

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
  imports: [CommonModule, ScullyLibModule, PostCommentsComponentModule],
})
export class PostComponentModule {}
