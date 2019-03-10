import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
      width: 80%;
    }

    markdown {
      width: 100%;
    }
    `
  ]
})
export class PostComponent implements OnInit {
  post$ = this.route.paramMap.pipe(
    switchMap(params => 
      this.postService.getPost(params.get('postId'))
        .pipe(tap(() => {}, () => {
          this.router.navigate(['/404']);
        }))
    )
  );

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService
  ) { }

  ngOnInit() {
  }

}
