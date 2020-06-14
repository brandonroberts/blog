import { Component, OnInit, NgModule } from '@angular/core';
import { Router, RouteComponent } from '@blog/router';
import { MarkdownModule } from 'ngx-markdown';
import { tap, switchMap } from 'rxjs/operators';

import { PageService } from 'src/app/core/services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page',
  template: `
    <markdown [data]="page$ | async"></markdown>
  `,
  styles: [
    `
    :host {
      display: flex;
    }

    markdown {
      width: 100%;
    }
    `
  ]
})
export class PageComponent implements OnInit {
  page$ = this.postService.getPageContent(this.route.path)
    .pipe(tap(() => { }, () => {
      this.router.go('/404');
    }));


  constructor(
    private router: Router,
    private route: RouteComponent,
    private postService: PageService
  ) { }

  ngOnInit() {
  }

}

@NgModule({
  declarations: [
    PageComponent,
  ],
  imports: [
    CommonModule,
    MarkdownModule.forChild()
  ],
  exports: [PageComponent]
})
export class PageComponentModule { }
