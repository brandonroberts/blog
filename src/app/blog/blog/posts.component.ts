import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';

import { RouterModule } from '@blog/router';
import { Observable } from 'rxjs';

import { Post } from 'src/app/core/models';
import { PostService } from 'src/app/core/services';

@Component({
  selector: 'app-posts',
  template: `
    <h2>Posts</h2>

    <mat-list>
      <mat-list-item *ngFor="let post of posts$ | async">
        <h2 mat-line>
          <a linkTo="/blog/posts/{{post.id}}">{{post.title}}</a>
        </h2>

        <p mat-line> {{post.dateCreated | date}} </p>
      </mat-list-item>
    </mat-list>
  `,
  styles: [
    `
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
export class PostsComponent implements OnInit {
  posts$: Observable<Post[]>;

  constructor(private postServce: PostService) {
    this.posts$ = this.postServce.getPosts();
  }

  ngOnInit() {
  }

}

@NgModule({
  declarations: [PostsComponent],
  imports: [
    CommonModule,
    MatListModule,
    RouterModule
  ],
  exports: [PostsComponent]
})
export class PostsComponentModule {}