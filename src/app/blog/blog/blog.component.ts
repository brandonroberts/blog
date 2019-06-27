import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/core/services';
import { Observable } from 'rxjs';
import { Post } from 'src/app/core/models';

@Component({
  selector: 'app-blog',
  template: `
    <h2>Posts</h2>

    <mat-list>
      <mat-list-item *ngFor="let post of posts$ | async">
        <h2 mat-line>
          <a [routerLink]="['/blog/posts', post.id]">{{post.title}}</a>
        </h2>

        <p mat-line> {{post.dateCreated | date}} </p>
      </mat-list-item>
    </mat-list>
  `,
  styles: [
    `
    :host {
      width: 80%;
    }

    a {
      color: black;
      white-space: initial;
    }

    :host /deep/ .mat-list-item { 
      font-size: 24px;
    }
    `
  ]
})
export class BlogComponent implements OnInit {
  posts$: Observable<Post[]>;

  constructor(private postServce: PostService) {
    this.posts$ = this.postServce.getPosts();
  }

  ngOnInit() {
  }

}
