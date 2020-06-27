import {
  Component,
  AfterViewChecked,
  ViewEncapsulation,
  NgModule,
} from '@angular/core';
import { ScullyLibModule } from '@scullyio/ng-lib';

import { HighlightService } from '../highlight.service';
import { PostCommentsComponentModule } from './comments.component';

@Component({
  selector: 'app-post',
  template: `
    <!-- This is where Scully will inject the static HTML -->
    <scully-content></scully-content>

    <app-post-comments></app-post-comments>
  `,
  styles: [''],
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PostComponent implements AfterViewChecked {
  constructor(private highlightService: HighlightService) {}

  ngAfterViewChecked() {
    this.highlightService.highlightAll();
  }
}

@NgModule({
  declarations: [PostComponent],
  imports: [ScullyLibModule, PostCommentsComponentModule],
})
export class PostComponentModule {}
