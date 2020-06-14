import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router } from '@blog/router';
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
  post$ = this.router.url$.pipe(
    switchMap(url => 
      this.postService.getPost(url.split('/').pop())
        .pipe(tap(() => {}, () => {
          this.router.go('/404');
        }))
    )
  );

  constructor(
    private router: Router,
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
  ],
  exports: [PostComponent]
})
export class PostComponentModule { }