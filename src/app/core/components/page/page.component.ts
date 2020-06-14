import { Component, OnInit, NgModule } from '@angular/core';
import { Router, RouteParams } from '@blog/router';
import { MarkdownModule } from 'ngx-markdown';
import { tap, switchMap } from 'rxjs/operators';

import { PageService } from 'src/app/core/services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page',
  template: ` <markdown [data]="page$ | async"></markdown> `,
  styles: [
    `
      :host {
        display: flex;
      }

      markdown {
        width: 100%;
      }
    `,
  ],
})
export class PageComponent implements OnInit {
  page$ = this.routeParams$.pipe(
    switchMap((params) =>
      this.postService.getPageContent(params.pageId).pipe(
        tap(
          () => {},
          () => {
            this.router.go('/404');
          }
        )
      )
    )
  );

  constructor(
    private router: Router,
    private routeParams$: RouteParams<{ pageId: string }>,
    private postService: PageService
  ) {}

  ngOnInit() {}
}

@NgModule({
  declarations: [PageComponent],
  imports: [CommonModule, MarkdownModule.forChild()],
  exports: [PageComponent],
})
export class PageComponentModule {}
