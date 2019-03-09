import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, tap, concatMap, switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

import { PostService } from 'src/app/core/services';

@Component({
  selector: 'app-post',
  template: `
    <markdown [data]="post$ | async"></markdown>
  `,
  styles: []
})
export class PostComponent implements OnInit {
  post$ = this.route.paramMap.pipe(
    switchMap(params => 
      this.postService.getPost(params.get('postId')))
    );

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) { }

  ngOnInit() {
  }

}
