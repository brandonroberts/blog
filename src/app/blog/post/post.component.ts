import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router, RouteParams } from '@blog/router';
import { MarkdownModule } from 'ngx-markdown';
import { tap, switchMap } from 'rxjs/operators';

import { PostService } from 'src/app/core/services';

@Component({
  selector: 'app-post',
  template: `
    <markdown [data]="post$ | async"></markdown>
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
export class PostComponent {
  post$ = this.routeParams$.pipe(
    switchMap(params => 
      this.postService.getPost(params.postId)
        .pipe(tap(() => {}, () => {
          this.router.go('/404');
        }))
    )
  );

  constructor(
    private router: Router,
    private routeParams$: RouteParams<{ postId: string }>,
    private postService: PostService
  ) { }

  ngOnInit() {
  }

}

@NgModule({
  declarations: [
    PostComponent
  ],
  imports: [
    CommonModule,
    MarkdownModule.forChild(),
  ]
})
export class PostComponentModule { }