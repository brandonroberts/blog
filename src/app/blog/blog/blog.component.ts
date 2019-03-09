import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/core/services';
import { Observable } from 'rxjs';
import { Post } from 'src/app/core/models';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-blog',
  template: `
    <mat-list>
      <mat-list-item *ngFor="let post of posts$ | async">
        <h3 mat-line>
          <a [routerLink]="['/blog/posts', post.id]">{{post.title}}</a>
        </h3>

        <p mat-line> {{post.dateCreated | date}} </p>
      </mat-list-item>
    </mat-list>
  `,
  styles: []
})
export class BlogComponent implements OnInit {
  posts$: Observable<Post[]>;

  constructor(private postServce: PostService) {
    this.posts$ = this.postServce.getPosts();
  }

  ngOnInit() {
  }

}
