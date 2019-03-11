import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, switchMap } from 'rxjs/operators';

import { PageService } from 'src/app/core/services';

@Component({
  selector: 'app-page',
  template: `
    <markdown [data]="page$ | async"></markdown>
  `,
  styles: [
    `
    :host {
      display: flex;
      width: 80%;
    }

    markdown {
      width: 100%;
    }
    `
  ]
})
export class PageComponent implements OnInit {
  page$ = this.route.paramMap.pipe(
    switchMap(params => 
      this.postService.getPageContent(params.get('pageId'))
        .pipe(tap(() => {}, () => {
          this.router.navigate(['/404']);
        }))
    )
  );

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postService: PageService
  ) { }

  ngOnInit() {
  }

}
